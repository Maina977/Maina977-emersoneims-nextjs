"""Live foreign-exchange rates with cache + offline fallback.

Primary source: https://api.exchangerate.host (free, no key, ECB-derived).
Fallback source: baked-in indicative rates from app_professional.CURRENCIES.

Cache:
  * In-memory dict keyed by base currency
  * On-disk JSON at uploads/.fx_cache.json (survives restarts)
  * TTL configurable via EIMS_FX_TTL_HOURS (default 24h)

All responses include:
  * rate_source : 'exchangerate.host' | 'ecb_fallback' | 'static_reference'
  * fetched_at  : ISO-8601 UTC timestamp of the live fetch (or null)
  * disclaimer  : provenance note for downstream display
"""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any, Dict, Optional

try:
    import urllib.request
    import urllib.error
except Exception:  # pragma: no cover
    urllib = None  # type: ignore

logger = logging.getLogger('eims.fx')

# ---------- configuration ----------
_PRIMARY_URL = 'https://api.exchangerate.host/latest?base=USD'
_FALLBACK_URL = 'https://open.er-api.com/v6/latest/USD'  # secondary free source
_HTTP_TIMEOUT = 5  # seconds
_DEFAULT_TTL_HOURS = 24
_CACHE_PATH = os.path.join(os.getcwd(), 'uploads', '.fx_cache.json')

# ---------- in-memory cache ----------
_lock = threading.Lock()
_cache: Dict[str, Any] = {
    'base': 'USD',
    'rates': {},          # {'EUR': 0.92, ...}  -- 1 USD = X foreign
    'fetched_at': None,   # ISO timestamp
    'source': None,       # provider id
}


def _ttl_seconds() -> int:
    try:
        hrs = float(os.environ.get('EIMS_FX_TTL_HOURS', _DEFAULT_TTL_HOURS))
    except ValueError:
        hrs = _DEFAULT_TTL_HOURS
    return int(max(1, hrs) * 3600)


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _load_disk_cache() -> None:
    """Populate in-memory cache from disk if file exists and is parseable."""
    try:
        if not os.path.exists(_CACHE_PATH):
            return
        with open(_CACHE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, dict) and isinstance(data.get('rates'), dict):
            _cache.update(data)
            logger.info('FX cache loaded from disk (%d rates, fetched_at=%s)',
                        len(data['rates']), data.get('fetched_at'))
    except Exception as e:  # pragma: no cover
        logger.warning('FX disk cache load failed: %s', e)


def _save_disk_cache() -> None:
    try:
        os.makedirs(os.path.dirname(_CACHE_PATH), exist_ok=True)
        with open(_CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(_cache, f)
    except Exception as e:  # pragma: no cover
        logger.warning('FX disk cache write failed: %s', e)


def _fetch_url(url: str) -> Optional[Dict[str, Any]]:
    if urllib is None:
        return None
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'EIMS-BuildingSuitePro/1.0 (+fx-feed)'}
        )
        with urllib.request.urlopen(req, timeout=_HTTP_TIMEOUT) as resp:
            payload = resp.read().decode('utf-8')
        return json.loads(payload)
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as e:
        logger.warning('FX fetch failed for %s: %s', url, e)
        return None
    except Exception as e:  # pragma: no cover
        logger.warning('FX fetch unexpected error for %s: %s', url, e)
        return None


def _refresh_locked(force: bool = False) -> bool:
    """Refresh the cache from a live source. Returns True on success."""
    if not force and _cache.get('fetched_at'):
        try:
            ts = datetime.fromisoformat(_cache['fetched_at']).timestamp()
            if time.time() - ts < _ttl_seconds():
                return True  # still fresh
        except Exception:
            pass

    # Try primary then secondary
    for url, src_id in ((_PRIMARY_URL, 'exchangerate.host'),
                         (_FALLBACK_URL, 'open.er-api.com')):
        data = _fetch_url(url)
        if not data:
            continue
        rates = data.get('rates') or data.get('conversion_rates')
        if isinstance(rates, dict) and rates:
            _cache['base'] = 'USD'
            _cache['rates'] = {k.upper(): float(v) for k, v in rates.items()
                                if isinstance(v, (int, float))}
            _cache['fetched_at'] = _now_iso()
            _cache['source'] = src_id
            _save_disk_cache()
            logger.info('FX refreshed from %s (%d rates)', src_id, len(_cache['rates']))
            return True

    logger.warning('FX refresh failed; using existing cache or static fallback')
    return False


def refresh(force: bool = False) -> bool:
    """Public refresh, thread-safe."""
    with _lock:
        return _refresh_locked(force=force)


def get_rates(static_fallback: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """Return the current rate table.

    `static_fallback` is a {code: rate_to_usd} dict from the app's CURRENCIES
    table, used when no live data is available. Note: CURRENCIES uses
    `rate_to_usd` (foreign->USD), whereas live feeds use USD->foreign. Both
    representations are exposed for clarity.
    """
    with _lock:
        # Lazy first-call: try disk then live
        if _cache['fetched_at'] is None:
            _load_disk_cache()
        _refresh_locked(force=False)

        if _cache['rates']:
            usd_to_x = dict(_cache['rates'])  # 1 USD = X foreign
            return {
                'base': 'USD',
                'usd_to_foreign': usd_to_x,
                'foreign_to_usd': {k: (1.0 / v) for k, v in usd_to_x.items() if v > 0},
                'fetched_at': _cache['fetched_at'],
                'rate_source': _cache['source'] or 'cache',
                'disclaimer': 'Live rates from public ECB-derived feed; cached for '
                              f'{_ttl_seconds() // 3600}h. Verify against an authoritative '
                              'source before contractual use.',
            }

    # Static fallback (no network ever succeeded)
    fallback = static_fallback or {}
    foreign_to_usd = {k: float(v) for k, v in fallback.items() if v}
    usd_to_foreign = {k: (1.0 / v) for k, v in foreign_to_usd.items() if v > 0}
    return {
        'base': 'USD',
        'usd_to_foreign': usd_to_foreign,
        'foreign_to_usd': foreign_to_usd,
        'fetched_at': None,
        'rate_source': 'static_reference',
        'disclaimer': 'Indicative reference rates only -- live feed unavailable. '
                      'Verify against an authoritative source before contractual use.',
    }


def convert(amount: float, from_curr: str, to_curr: str,
            static_fallback: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """Convert `amount` from `from_curr` to `to_curr`."""
    from_curr = (from_curr or 'USD').upper()
    to_curr = (to_curr or 'USD').upper()
    table = get_rates(static_fallback=static_fallback)
    f2u = table['foreign_to_usd']
    f2u['USD'] = 1.0
    if from_curr not in f2u or to_curr not in f2u:
        return {
            'success': False,
            'error': f'unsupported currency: {from_curr if from_curr not in f2u else to_curr}',
            'rate_source': table['rate_source'],
        }
    usd_amount = float(amount) * f2u[from_curr]
    converted = usd_amount / f2u[to_curr]
    rate = f2u[from_curr] / f2u[to_curr] if f2u[to_curr] else 0
    return {
        'success': True,
        'original': {'amount': float(amount), 'currency': from_curr},
        'converted': {'amount': round(converted, 2), 'currency': to_curr},
        'rate': round(rate, 6),
        'rate_source': table['rate_source'],
        'fetched_at': table['fetched_at'],
        'disclaimer': table['disclaimer'],
    }


# ---------- Flask integration ----------

def register(app, *, currencies: Dict[str, Dict[str, Any]],
             auth_required=None) -> None:
    """Register FX endpoints on the given Flask app.

    Parameters
    ----------
    app : Flask
    currencies : dict
        The application's CURRENCIES table (used for static fallback).
    auth_required : callable, optional
        Auth decorator from the host app. Applied to the manual-refresh route.
    """
    from flask import jsonify, request

    def _static() -> Dict[str, float]:
        return {k: float(v.get('rate_to_usd', 0))
                for k, v in (currencies or {}).items()
                if v.get('rate_to_usd')}

    @app.route('/api/global/fx/rates', methods=['GET'])
    def _fx_rates():
        return jsonify({'success': True, **get_rates(static_fallback=_static())})

    @app.route('/api/global/fx/convert', methods=['POST'])
    def _fx_convert():
        data = request.get_json(silent=True) or {}
        try:
            amount = float(data.get('amount', 0))
        except (TypeError, ValueError):
            return jsonify({'success': False, 'error': 'invalid amount'}), 400
        return jsonify(convert(
            amount,
            data.get('from', 'USD'),
            data.get('to', 'USD'),
            static_fallback=_static(),
        ))

    refresh_view = lambda: (jsonify({  # noqa: E731
        'success': refresh(force=True),
        **get_rates(static_fallback=_static()),
    }))
    if auth_required is not None:
        refresh_view = auth_required(refresh_view)
    app.add_url_rule('/api/global/fx/refresh', 'fx_refresh',
                     refresh_view, methods=['POST'])

    logger.info('FX module registered (3 endpoints)')
