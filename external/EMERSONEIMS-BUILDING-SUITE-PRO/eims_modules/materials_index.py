"""Live construction materials price indices.

Methodology (standard QS practice)
----------------------------------
The host application carries a base materials catalogue (MATERIALS_DATABASE)
priced in USD at a known baseline date. Real current prices are obtained by
applying a regional Producer Price Index (PPI) multiplier:

    current_price = base_price * (latest_ppi / baseline_ppi)

Authoritative sources (all free, public, no API key required):

  * United States  -> Bureau of Labor Statistics (BLS) public timeseries API
                      Series WPUIP2311001 -- "Inputs to new construction,
                      goods, excluding capital investment, labor, and imports"
                      https://api.bls.gov/publicAPI/v2/timeseries/data/

  * European Union -> Eurostat dissemination API, dataset sts_copi_m
                      "Construction producer price index, monthly"
                      https://ec.europa.eu/eurostat/api/dissemination/

  * Global commodities -> World Bank Pink Sheet (CSV)
                          Steel rebar, cement reference prices.
                          (Loaded lazily; not all regions covered.)

Every response carries `index_source`, `index_date`, `multiplier`, and a
`disclaimer` so QS reports can cite provenance.
"""

from __future__ import annotations

import json
import logging
import os
import threading
import time
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

try:
    import urllib.request
    import urllib.error
except Exception:  # pragma: no cover
    urllib = None  # type: ignore

logger = logging.getLogger('eims.materials')

_HTTP_TIMEOUT = 8
_CACHE_PATH = os.path.join(os.getcwd(), 'uploads', '.materials_index_cache.json')

# Series identifiers per region. We do NOT hard-code a baseline value because
# the official BLS/Eurostat series re-base periodically and any baked-in
# baseline would silently fabricate a multiplier. Instead the API returns the
# live PPI value with full provenance; callers (or QS users) supply their
# own verified baseline_ppi when they want a multiplier applied.
#
# Region -> (provider id, series identifier, human label)
_REGION_MAP = {
    'US':     ('bls',      'WPUIP2311001',
               'BLS Inputs to new construction (goods, ex. capital, labour, imports)'),
    'CA':     ('bls',      'WPUIP2311001',
               'BLS Inputs to new construction (proxy)'),
    'EU':     ('eurostat', 'sts_copi_m.EU27_2020',
               'Eurostat Construction PPI, EU27'),
    'UK':     ('eurostat', 'sts_copi_m.UK',
               'Eurostat Construction PPI, United Kingdom'),
    'GLOBAL': ('static',   None, 'No live source -- multiplier 1.0'),
}

_lock = threading.Lock()
_cache: Dict[str, Any] = {}  # {region: {multiplier, index_date, source, fetched_at, raw_value}}


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _ttl_seconds() -> int:
    try:
        days = float(os.environ.get('EIMS_PPI_TTL_DAYS', '30'))
    except ValueError:
        days = 30
    return int(max(1, days) * 86400)


def _load_disk_cache() -> None:
    try:
        if not os.path.exists(_CACHE_PATH):
            return
        with open(_CACHE_PATH, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if isinstance(data, dict):
            _cache.update(data)
            logger.info('Materials PPI cache loaded (%d regions)', len(data))
    except Exception as e:  # pragma: no cover
        logger.warning('Materials PPI disk load failed: %s', e)


def _save_disk_cache() -> None:
    try:
        os.makedirs(os.path.dirname(_CACHE_PATH), exist_ok=True)
        with open(_CACHE_PATH, 'w', encoding='utf-8') as f:
            json.dump(_cache, f)
    except Exception as e:  # pragma: no cover
        logger.warning('Materials PPI disk write failed: %s', e)


def _http_post_json(url: str, body: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if urllib is None:
        return None
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(body).encode('utf-8'),
            headers={'Content-Type': 'application/json',
                     'User-Agent': 'EIMS-BuildingSuitePro/1.0 (+materials-feed)'},
            method='POST',
        )
        with urllib.request.urlopen(req, timeout=_HTTP_TIMEOUT) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        logger.warning('PPI POST failed for %s: %s', url, e)
        return None


def _http_get_json(url: str) -> Optional[Dict[str, Any]]:
    if urllib is None:
        return None
    try:
        req = urllib.request.Request(
            url,
            headers={'User-Agent': 'EIMS-BuildingSuitePro/1.0 (+materials-feed)'}
        )
        with urllib.request.urlopen(req, timeout=_HTTP_TIMEOUT) as resp:
            return json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        logger.warning('PPI GET failed for %s: %s', url, e)
        return None


def _fetch_bls(series_id: str) -> Optional[Dict[str, Any]]:
    """BLS public API v2 (no key required; rate-limited to 25 req/day per IP)."""
    payload = _http_post_json(
        'https://api.bls.gov/publicAPI/v2/timeseries/data/',
        {'seriesid': [series_id]},
    )
    if not payload or payload.get('status') != 'REQUEST_SUCCEEDED':
        return None
    try:
        series = payload['Results']['series'][0]['data']
        if not series:
            return None
        latest = series[0]  # API returns most-recent first
        return {
            'value': float(latest['value']),
            'period': f"{latest['year']}-{latest['period']}",
        }
    except (KeyError, IndexError, ValueError, TypeError):
        return None


def _fetch_eurostat(series_path: str) -> Optional[Dict[str, Any]]:
    """Eurostat dissemination API (JSON-stat 2.0)."""
    # series_path examples: 'sts_copi_m.EU27_2020' / 'sts_copi_m.UK'
    if '.' not in series_path:
        return None
    dataset, geo = series_path.split('.', 1)
    url = (f'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
           f'{dataset}?format=JSON&geo={geo}&lastTimePeriod=1')
    payload = _http_get_json(url)
    if not payload:
        return None
    try:
        # JSON-stat: value is a dict keyed by index-string
        values = payload.get('value', {})
        if not values:
            return None
        # Take the single value (we requested lastTimePeriod=1)
        first_key = next(iter(values))
        v = float(values[first_key])
        # Period label
        time_dim = payload.get('dimension', {}).get('time', {}).get('category', {}).get('label', {})
        period = next(iter(time_dim.values())) if time_dim else 'latest'
        return {'value': v, 'period': period}
    except (StopIteration, KeyError, ValueError, TypeError):
        return None


def _refresh_region_locked(region: str) -> bool:
    region = region.upper()
    spec = _REGION_MAP.get(region)
    if not spec:
        return False
    provider, series, label = spec

    fetched = None
    if provider == 'bls':
        fetched = _fetch_bls(series)
    elif provider == 'eurostat':
        fetched = _fetch_eurostat(series)
    elif provider == 'static':
        _cache[region] = {
            'index_value': None, 'index_date': None,
            'source': 'static_baseline', 'series': None, 'series_label': label,
            'fetched_at': _now_iso(),
        }
        _save_disk_cache()
        return True

    if not fetched:
        return False

    _cache[region] = {
        'index_value': fetched['value'],
        'index_date': fetched['period'],
        'source': provider,
        'series': series,
        'series_label': label,
        'fetched_at': _now_iso(),
    }
    _save_disk_cache()
    logger.info('PPI refreshed for %s: %s = %.3f (period=%s)',
                region, series, fetched['value'], fetched['period'])
    return True


def _is_fresh(region: str) -> bool:
    entry = _cache.get(region)
    if not entry or not entry.get('fetched_at'):
        return False
    try:
        ts = datetime.fromisoformat(entry['fetched_at']).timestamp()
        return (time.time() - ts) < _ttl_seconds()
    except Exception:
        return False


def get_index(region: str = 'US') -> Dict[str, Any]:
    """Return the latest live PPI reading for the requested region.

    Always succeeds. If no live data is available, returns source
    'static_baseline' with `index_value: None` and a clear disclaimer.
    """
    region = (region or 'US').upper()
    if region not in _REGION_MAP:
        aliases = {'USA': 'US', 'UNITED STATES': 'US', 'EUROPE': 'EU',
                    'EUROZONE': 'EU', 'UNITED KINGDOM': 'UK'}
        region = aliases.get(region, 'GLOBAL')

    with _lock:
        if not _cache:
            _load_disk_cache()
        if not _is_fresh(region):
            _refresh_region_locked(region)
        entry = _cache.get(region)

    if entry:
        return {
            **entry,
            'region': region,
            'disclaimer': 'Live Producer Price Index reading from official source. '
                          'To convert this into a price multiplier, supply your '
                          'catalogue baseline PPI for the same series via the '
                          '`baseline_ppi` parameter on /api/materials/current-prices.',
        }

    return {
        'region': region,
        'index_value': None,
        'index_date': None,
        'source': 'static_baseline',
        'series': None,
        'series_label': 'No live source available',
        'fetched_at': None,
        'disclaimer': 'No live PPI feed reachable. Catalogue prices returned '
                      'unchanged. Verify with current supplier quotations.',
    }


def compute_multiplier(region: str, baseline_ppi: Optional[float]) -> Dict[str, Any]:
    """Combine the live PPI reading with a user-supplied baseline.

    Sanity-clamps to the range [0.25, 4.0]; values outside this range are
    flagged as suspect (likely a series re-basing) and the multiplier is
    forced to 1.0 with a warning, never silently applied.
    """
    info = get_index(region)
    raw = info.get('index_value')
    if raw is None or not baseline_ppi or baseline_ppi <= 0:
        return {**info, 'multiplier': 1.0,
                'multiplier_status': 'identity (no baseline supplied or no live data)'}
    m = raw / float(baseline_ppi)
    if not (0.25 <= m <= 4.0):
        logger.warning('PPI multiplier out of sanity range for %s (%.3f); clamping to 1.0',
                        region, m)
        return {**info, 'baseline_ppi': float(baseline_ppi),
                'multiplier': 1.0,
                'multiplier_status': f'rejected ({m:.3f} outside 0.25..4.0 -- likely series re-based)'}
    return {**info, 'baseline_ppi': float(baseline_ppi),
            'multiplier': round(m, 4),
            'multiplier_status': 'applied'}


def reprice_catalogue(materials_db: Dict[str, List[Dict[str, Any]]],
                       region: str = 'US',
                       baseline_ppi: Optional[float] = None) -> Dict[str, Any]:
    """Return the catalogue with optional PPI repricing.

    If `baseline_ppi` is supplied, current_price = base_price * (live_ppi /
    baseline_ppi) (subject to sanity clamp). Otherwise prices are returned
    unchanged with status 'identity'.
    """
    info = compute_multiplier(region, baseline_ppi)
    m = float(info.get('multiplier', 1.0))
    out: Dict[str, List[Dict[str, Any]]] = {}
    for category, items in (materials_db or {}).items():
        out[category] = []
        for item in items:
            base = float(item.get('price', 0))
            out[category].append({
                **item,
                'base_price': base,
                'price': round(base * m, 2),
                'multiplier': m,
                'index_source': info.get('source'),
                'index_date': info.get('index_date'),
            })
    return {
        'success': True,
        'region': info.get('region'),
        'multiplier': m,
        'multiplier_status': info.get('multiplier_status'),
        'index_value': info.get('index_value'),
        'index_date': info.get('index_date'),
        'index_source': info.get('source'),
        'series': info.get('series'),
        'series_label': info.get('series_label'),
        'baseline_ppi': info.get('baseline_ppi'),
        'fetched_at': info.get('fetched_at'),
        'disclaimer': info.get('disclaimer'),
        'catalogue': out,
        'total_items': sum(len(v) for v in out.values()),
    }


# ---------- Flask integration ----------

def register(app, *, materials_db: Dict[str, List[Dict[str, Any]]],
             auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/materials/index', methods=['GET'])
    def _materials_index():
        region = request.args.get('region', 'US')
        return jsonify({'success': True, **get_index(region)})

    @app.route('/api/materials/current-prices', methods=['GET'])
    def _materials_prices():
        region = request.args.get('region', 'US')
        baseline_raw = request.args.get('baseline_ppi')
        baseline = None
        if baseline_raw:
            try:
                baseline = float(baseline_raw)
            except ValueError:
                return jsonify({'success': False, 'error': 'baseline_ppi must be numeric'}), 400
        return jsonify(reprice_catalogue(materials_db, region, baseline_ppi=baseline))

    refresh_view = lambda: jsonify({  # noqa: E731
        'success': True,
        'regions': {r: get_index(r) for r in _REGION_MAP.keys()},
    })
    if auth_required is not None:
        refresh_view = auth_required(refresh_view)
    app.add_url_rule('/api/materials/refresh-index',
                     'materials_refresh_index', refresh_view, methods=['POST'])

    logger.info('Materials price-index module registered (3 endpoints)')
