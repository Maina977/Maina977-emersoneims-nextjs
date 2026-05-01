"""Append-only audit log for privileged actions.

Writes JSON-lines to uploads/.audit_log.jsonl. Each line:
    {ts, user, action, target, ip, ok, detail}

Provides a Flask hook to log every authenticated POST and a query API.
The log is append-only; a separate retention process should rotate it.
"""

from __future__ import annotations

import datetime as _dt
import json
import logging
import os
import threading
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.audit')

_LOG_PATH = os.path.join(
    os.environ.get('EIMS_UPLOAD_FOLDER',
                    os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                  'uploads')),
    '.audit_log.jsonl',
)
_LOCK = threading.Lock()


def log_event(*, user: str, action: str, target: str = '',
                ip: str = '', ok: bool = True,
                detail: Optional[Dict[str, Any]] = None) -> None:
    rec = {
        'ts':     _dt.datetime.now(_dt.timezone.utc).isoformat(timespec='seconds').replace('+00:00', 'Z'),
        'user':   user,
        'action': action,
        'target': target,
        'ip':     ip,
        'ok':     bool(ok),
        'detail': detail or {},
    }
    with _LOCK:
        os.makedirs(os.path.dirname(_LOG_PATH), exist_ok=True)
        with open(_LOG_PATH, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')


def query(*, limit: int = 200, user: Optional[str] = None,
            action: Optional[str] = None, since: Optional[str] = None) -> List[Dict[str, Any]]:
    if not os.path.exists(_LOG_PATH):
        return []
    out: List[Dict[str, Any]] = []
    with _LOCK:
        with open(_LOG_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                try:
                    rec = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if user and rec.get('user') != user:
                    continue
                if action and rec.get('action') != action:
                    continue
                if since and rec.get('ts', '') < since:
                    continue
                out.append(rec)
    return out[-limit:]


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import g, jsonify, request

    AUDIT_METHODS = {'POST', 'PUT', 'PATCH', 'DELETE'}

    @app.before_request
    def _audit_before():
        # Stash request start so after_request can compute outcome.
        g._eims_audit_should = (
            request.method in AUDIT_METHODS
            and not request.path.startswith('/static/')
        )

    @app.after_request
    def _audit_after(response):
        try:
            if getattr(g, '_eims_audit_should', False):
                user = (request.headers.get('X-EIMS-User')
                        or getattr(g, 'auth_user', None) or 'anon')
                log_event(
                    user=str(user),
                    action=f'{request.method} {request.path}',
                    target=request.path,
                    ip=request.headers.get('X-Forwarded-For', request.remote_addr or ''),
                    ok=(200 <= response.status_code < 400),
                    detail={'status': response.status_code,
                             'len':    response.calculate_content_length()},
                )
        except Exception as e:  # pragma: no cover - never let audit break a request
            logger.warning('audit logging failed: %s', e)
        return response

    # Fail-closed admin auth: the audit log records IPs, user actions, and
    # API call detail — it MUST NOT be publicly readable. Require header
    # X-Admin-Token to match env EIMS_ADMIN_TOKEN. If the env var is unset
    # or empty, the endpoint is disabled entirely (returns 503) — we never
    # want an "admin" route that accepts any caller.
    def _query_route():
        configured = (os.environ.get('EIMS_ADMIN_TOKEN') or '').strip()
        if not configured:
            return jsonify({
                'success': False,
                'error': 'admin endpoints disabled',
                'hint': 'Set EIMS_ADMIN_TOKEN in the server environment to enable /api/admin/*'
            }), 503
        supplied = (request.headers.get('X-Admin-Token') or '').strip()
        # Constant-time compare so we don't leak the token via timing
        import hmac
        if not supplied or not hmac.compare_digest(supplied, configured):
            return jsonify({'success': False, 'error': 'unauthorised'}), 401
        try:
            limit = int(request.args.get('limit', 200))
        except ValueError:
            limit = 200
        return jsonify({
            'success': True,
            'records': query(
                limit=min(limit, 2000),
                user=request.args.get('user'),
                action=request.args.get('action'),
                since=request.args.get('since'),
            ),
        })

    if auth_required:
        _query_route = auth_required(_query_route)
    app.add_url_rule('/api/admin/audit', 'eims_audit_query',
                      _query_route, methods=['GET'])

    logger.info('Audit log module registered (writes to %s)', _LOG_PATH)
