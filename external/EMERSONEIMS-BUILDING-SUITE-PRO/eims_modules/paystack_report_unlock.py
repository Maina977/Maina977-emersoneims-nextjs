"""Paystack payment gate for full comprehensive report / quotation export.

When EIMS_PAYSTACK_SECRET_KEY is set:
  * Clients see ~70% of the in-browser report (wizard applies a visual clip).
  * Server-side PDF export (/api/export/pdf) requires a paid unlock session.

Flow:
  1. POST /api/pay/report-unlock/init  → Paystack transaction/initialize
  2. Customer pays (hosted checkout or your Payment Page with the same amounts)
  3. Webhook charge.success and/or GET verify-callback + polling confirm payment
  4. POST /api/pay/report-unlock/activate sets the Flask session cookie

Env:
  EIMS_PAYSTACK_SECRET_KEY   (sk_test_… / sk_live_…) — required to enable gate
  EIMS_PAYSTACK_PUBLIC_KEY   (pk_test_… / pk_live_…) — optional, exposed to UI
  EIMS_REPORT_UNLOCK_USD     default 50 (integer dollars)
  EIMS_PAYSTACK_CURRENCY     default USD (must match your Paystack dashboard)
  EIMS_REPORT_UNLOCK_DAYS    default 7 — session validity after payment
  EIMS_REPORT_UNLOCK_BYPASS  set to 1 to disable gate checks (dev only)
  EIMS_DATA_DIR              optional SQLite directory (default: tempfile)
"""
from __future__ import annotations

import hashlib
import hmac
import json
import logging
import os
import sqlite3
import threading
import time
from typing import Any

import requests
from flask import jsonify, request, session

logger = logging.getLogger('eims.paystack')

_lock = threading.Lock()
_CONNECT_KW: dict = {'check_same_thread': False}


def _db_path() -> str:
    base = os.environ.get('EIMS_DATA_DIR', '').strip()
    if not base:
        import tempfile
        base = tempfile.gettempdir()
    os.makedirs(base, exist_ok=True)
    return os.path.join(base, 'eims_report_unlock.sqlite')


def _conn() -> sqlite3.Connection:
    return sqlite3.connect(_db_path(), **_CONNECT_KW)


def _init_db() -> None:
    with _conn() as c:
        c.execute(
            '''CREATE TABLE IF NOT EXISTS report_unlock (
                lock_id TEXT PRIMARY KEY,
                reference TEXT UNIQUE,
                email TEXT,
                amount INTEGER NOT NULL,
                currency TEXT NOT NULL,
                paid INTEGER NOT NULL DEFAULT 0,
                created REAL NOT NULL,
                paid_at REAL
            )'''
        )


def bypass_enabled() -> bool:
    return os.environ.get('EIMS_REPORT_UNLOCK_BYPASS', '').strip().lower() in (
        '1', 'true', 'yes', 'on',
    )


def is_enabled() -> bool:
    if bypass_enabled():
        return False
    return bool(os.environ.get('EIMS_PAYSTACK_SECRET_KEY', '').strip())


def unlock_amount_usd() -> int:
    try:
        return max(1, int(os.environ.get('EIMS_REPORT_UNLOCK_USD', '50')))
    except ValueError:
        return 50


def pay_currency() -> str:
    return (os.environ.get('EIMS_PAYSTACK_CURRENCY', 'USD').strip() or 'USD').upper()


def _amount_minor_units() -> int:
    """Smallest currency unit Paystack expects (USD → cents)."""
    return unlock_amount_usd() * 100


def _unlock_days() -> float:
    try:
        return float(os.environ.get('EIMS_REPORT_UNLOCK_DAYS', '7'))
    except ValueError:
        return 7.0


def _headers() -> dict[str, str]:
    key = os.environ['EIMS_PAYSTACK_SECRET_KEY'].strip()
    return {'Authorization': f'Bearer {key}', 'Content-Type': 'application/json'}


def _verify_remote(reference: str) -> dict[str, Any] | None:
    try:
        r = requests.get(
            f'https://api.paystack.co/transaction/verify/{reference}',
            headers=_headers(),
            timeout=45,
        )
        body = r.json()
    except Exception as e:
        logger.warning('Paystack verify HTTP error: %s', e)
        return None
    if not body.get('status'):
        return None
    return body.get('data') or {}


def _row_by_reference(reference: str) -> sqlite3.Row | None:
    conn = _conn()
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.execute(
            'SELECT * FROM report_unlock WHERE reference = ?', (reference,)
        )
        return cur.fetchone()
    finally:
        conn.close()


def _row_by_lock(lock_id: str) -> sqlite3.Row | None:
    conn = _conn()
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.execute(
            'SELECT * FROM report_unlock WHERE lock_id = ?', (lock_id,)
        )
        return cur.fetchone()
    finally:
        conn.close()


def _mark_paid(reference: str, data: dict[str, Any]) -> tuple[bool, str | None]:
    """Verify amounts/metadata and flip paid bit. Returns (ok, lock_id)."""
    row = _row_by_reference(reference)
    if not row:
        logger.warning('Paystack: unknown reference %s', reference)
        return False, None
    if int(row['paid']):
        return True, str(row['lock_id'])
    try:
        paid_amt = int(float(data.get('amount', 0) or 0))
        if paid_amt != int(row['amount']):
            logger.warning('Paystack amount mismatch ref=%s', reference)
            return False, None
    except (TypeError, ValueError) as e:
        logger.warning('Paystack amount parse error: %s', e)
        return False, None
    try:
        cur = (data.get('currency') or '').upper() or pay_currency()
        if cur != str(row['currency']).upper():
            logger.warning('Paystack currency mismatch ref=%s', reference)
            return False, None
        meta = data.get('metadata') or {}
        if str(meta.get('lock_id', '')) and str(meta['lock_id']) != str(row['lock_id']):
            logger.warning('Paystack metadata lock_id mismatch ref=%s', reference)
            return False, None
    except (TypeError, ValueError) as e:
        logger.warning('Paystack verify parse error: %s', e)
        return False, None

    now = time.time()
    with _lock:
        conn = _conn()
        try:
            conn.execute(
                'UPDATE report_unlock SET paid = 1, paid_at = ? WHERE reference = ? AND paid = 0',
                (now, reference),
            )
            conn.commit()
        finally:
            conn.close()
    return True, str(row['lock_id'])


def _set_unlock_session(lock_id: str | None = None) -> None:
    until = time.time() + _unlock_days() * 86400.0
    session['eims_report_unlock_until'] = until
    if lock_id:
        session['eims_report_unlock_lock'] = lock_id
    session.modified = True


def session_has_paid_unlock() -> bool:
    """True if browser session still within paid window."""
    if bypass_enabled() or not is_enabled():
        return True
    until = session.get('eims_report_unlock_until')
    try:
        return bool(until) and time.time() < float(until)
    except (TypeError, ValueError):
        return False


def export_forbidden_response():
    return jsonify({
        'success': False,
        'error': 'payment_required',
        'message': 'Full PDF export requires purchasing the complete report unlock.',
    }), 402


def register(app, *, auth_required=None) -> None:  # noqa: ARG001
    _init_db()

    @app.route('/api/pay/report-unlock/config', methods=['GET'])
    def _cfg():
        enabled = is_enabled()
        return jsonify({
            'success': True,
            'enabled': enabled,
            'amount_usd': unlock_amount_usd() if enabled else None,
            'currency': pay_currency() if enabled else None,
            'public_key': (os.environ.get('EIMS_PAYSTACK_PUBLIC_KEY') or '').strip()
            if enabled else None,
        })

    @app.route('/api/pay/report-unlock/init', methods=['POST'])
    def _init_pay():
        if not is_enabled():
            return jsonify({'success': False, 'error': 'payments_disabled'}), 400
        body = request.get_json(silent=True) or {}
        email = (body.get('email') or '').strip() or 'customer@example.com'
        callback_url = (body.get('callback_url') or request.referrer or '').strip()
        import secrets as _sec

        lock_id = _sec.token_urlsafe(18)
        amt = _amount_minor_units()
        cur = pay_currency()
        payload = {
            'email': email,
            'amount': amt,
            'currency': cur,
            'metadata': {'lock_id': lock_id, 'product': 'eims_full_report'},
        }
        if callback_url:
            payload['callback_url'] = callback_url
        try:
            r = requests.post(
                'https://api.paystack.co/transaction/initialize',
                headers=_headers(),
                json=payload,
                timeout=45,
            )
            res = r.json()
        except Exception as e:
            logger.exception('Paystack initialize failed: %s', e)
            return jsonify({'success': False, 'error': 'paystack_unreachable'}), 502
        if not res.get('status'):
            return jsonify({
                'success': False,
                'error': res.get('message') or 'initialize_failed',
                'detail': res,
            }), 400
        data = res.get('data') or {}
        reference = data.get('reference')
        auth_url = data.get('authorization_url')
        if not reference or not auth_url:
            return jsonify({'success': False, 'error': 'invalid_paystack_response'}), 502

        with _lock:
            conn = _conn()
            try:
                conn.execute(
                    '''INSERT INTO report_unlock
                    (lock_id, reference, email, amount, currency, paid, created, paid_at)
                    VALUES (?, ?, ?, ?, ?, 0, ?, NULL)''',
                    (lock_id, reference, email, amt, cur, time.time()),
                )
                conn.commit()
            finally:
                conn.close()

        return jsonify({
            'success': True,
            'lock_id': lock_id,
            'reference': reference,
            'authorization_url': auth_url,
        })

    @app.route('/api/pay/report-unlock/status', methods=['GET'])
    def _status():
        if not is_enabled():
            return jsonify({'success': True, 'paid': True})
        lock_id = (request.args.get('lock_id') or '').strip()
        if not lock_id:
            return jsonify({'success': False, 'error': 'lock_id_required'}), 400
        row = _row_by_lock(lock_id)
        if not row:
            return jsonify({'success': True, 'paid': False})
        return jsonify({'success': True, 'paid': bool(row['paid'])})

    @app.route('/api/pay/report-unlock/session', methods=['GET'])
    def _sess():
        if not is_enabled():
            return jsonify({'success': True, 'unlocked': True})
        return jsonify({'success': True, 'unlocked': session_has_paid_unlock()})

    @app.route('/api/pay/report-unlock/activate', methods=['POST'])
    def _activate():
        if not is_enabled():
            return jsonify({'success': True, 'session_active': True})
        body = request.get_json(silent=True) or {}
        lock_id = (body.get('lock_id') or '').strip()
        if not lock_id:
            return jsonify({'success': False, 'error': 'lock_id_required'}), 400
        row = _row_by_lock(lock_id)
        if not row or not row['paid']:
            return jsonify({'success': False, 'session_active': False})
        _set_unlock_session(lock_id)
        return jsonify({'success': True, 'session_active': True})

    @app.route('/api/pay/report-unlock/verify-callback', methods=['GET'])
    def _verify_cb():
        """Browser return URL: ?reference=… — verifies with Paystack, opens session."""
        if not is_enabled():
            return jsonify({'success': True, 'paid': True})
        reference = (request.args.get('reference') or request.args.get('trxref') or '').strip()
        if not reference:
            return jsonify({'success': False, 'error': 'reference_required'}), 400
        data = _verify_remote(reference)
        if not data or data.get('status') != 'success':
            return jsonify({'success': False, 'paid': False}), 400
        ok, lock_id = _mark_paid(reference, data)
        if not ok:
            return jsonify({'success': False, 'paid': False}), 400
        _set_unlock_session(lock_id)
        return jsonify({'success': True, 'paid': True, 'lock_id': lock_id})

    @app.route('/api/pay/webhook/paystack', methods=['POST'])
    def _webhook():
        if not is_enabled():
            return jsonify({'ignored': True}), 200
        raw = request.get_data(cache=False, as_text=False)
        sig = request.headers.get('X-Paystack-Signature', '')
        secret = os.environ['EIMS_PAYSTACK_SECRET_KEY'].strip()
        digest = hmac.new(secret.encode('utf-8'), raw, hashlib.sha512).hexdigest()
        if not sig or not hmac.compare_digest(digest, sig):
            logger.warning('Paystack webhook: bad signature')
            return jsonify({'error': 'bad_signature'}), 400
        try:
            evt = json.loads(raw.decode('utf-8'))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return jsonify({'error': 'invalid json'}), 400
        if evt.get('event') != 'charge.success':
            return jsonify({'success': True}), 200
        data = evt.get('data') or {}
        reference = data.get('reference')
        if not reference:
            return jsonify({'success': True}), 200
        remote = _verify_remote(reference)
        if remote and remote.get('status') == 'success':
            _mark_paid(reference, remote)
        return jsonify({'success': True}), 200

    logger.info(
        'Paystack report unlock registered (enabled=%s amount_usd=%s)',
        is_enabled(),
        unlock_amount_usd(),
    )
