"""In-process token-bucket rate limiter (no external Redis dependency).

Default: 60 requests / minute per (IP, route). Overridable via env:
    EIMS_RATELIMIT_PER_MINUTE  (int, default 60)
    EIMS_RATELIMIT_BURST       (int, default 20)

Returns 429 with Retry-After header when exceeded. Exempts:
   * GET /api/health
   * /static/*
"""

from __future__ import annotations

import logging
import os
import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict, Tuple

logger = logging.getLogger('eims.ratelimit')

_LOCK = threading.Lock()
_BUCKETS: Dict[Tuple[str, str], Deque[float]] = defaultdict(deque)


def _settings():
    try:
        rpm = int(os.environ.get('EIMS_RATELIMIT_PER_MINUTE', '60'))
    except ValueError:
        rpm = 60
    try:
        burst = int(os.environ.get('EIMS_RATELIMIT_BURST', '20'))
    except ValueError:
        burst = 20
    return max(1, rpm), max(1, burst)


def _check(ip: str, route: str) -> Tuple[bool, int]:
    """Return (allowed, retry_after_seconds)."""
    rpm, burst = _settings()
    window = 60.0
    now = time.monotonic()
    key = (ip, route)
    with _LOCK:
        dq = _BUCKETS[key]
        # discard timestamps outside the 60 s window
        while dq and (now - dq[0]) > window:
            dq.popleft()
        if len(dq) >= rpm + burst:
            retry = max(1, int(window - (now - dq[0])))
            return False, retry
        dq.append(now)
        return True, 0


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.before_request
    def _rl():
        path = request.path or '/'
        if path.startswith('/static/'):
            return None
        if path == '/api/health' and request.method == 'GET':
            return None
        ip = request.headers.get('X-Forwarded-For', request.remote_addr or 'unknown')
        ok, retry = _check(ip, path)
        if not ok:
            resp = jsonify({'success': False, 'error': 'rate_limit_exceeded',
                             'retry_after_seconds': retry})
            resp.status_code = 429
            resp.headers['Retry-After'] = str(retry)
            return resp
        return None

    rpm, burst = _settings()
    logger.info('Rate-limit middleware registered (%d/min + burst %d)', rpm, burst)
