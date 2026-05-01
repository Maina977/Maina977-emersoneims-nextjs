"""Real-time multi-user collaboration — locks, presence, change feed.

This is the workflow Revit users get via Worksharing / Central File on
BIM 360. Here it's lightweight, runs against the existing SQLite DB, and
needs no central server licence.

* **Advisory project locks** — a user "checks out" a project for a TTL
  (default 5 min). Other users may read but writes return 409 Conflict.
  Heart-beat extends the lease.
* **Presence** — who is currently looking at the project, what view, last
  seen. Stale entries (>2× heartbeat) auto-purged.
* **Change feed** — every write op appends a row; long-poll endpoint
  returns rows after `since_id`, blocking up to ~25 s for new events.

All three primitives are persistent (survive restart) and require no extra
dependencies.
"""

from __future__ import annotations

import json
import sqlite3
import time
import uuid
from typing import Any

from eims_modules import logger


DEFAULT_LOCK_TTL_S = 300        # 5 minutes
PRESENCE_STALE_S = 60           # mark offline after 1 minute silence
LONG_POLL_TIMEOUT_S = 25
LONG_POLL_INTERVAL_S = 0.5


# ============================================================================
# Schema
# ============================================================================

def _ensure_schema(get_db) -> None:
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS project_locks (
            project_id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            user_name TEXT,
            acquired_at REAL NOT NULL,
            expires_at REAL NOT NULL,
            token TEXT NOT NULL
        )''')
        c.execute('''CREATE TABLE IF NOT EXISTS project_presence (
            project_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_name TEXT,
            view TEXT,
            last_seen REAL NOT NULL,
            PRIMARY KEY (project_id, user_id)
        )''')
        c.execute('''CREATE TABLE IF NOT EXISTS project_changes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_name TEXT,
            op TEXT NOT NULL,
            payload_json TEXT,
            ts REAL NOT NULL
        )''')
        c.execute('CREATE INDEX IF NOT EXISTS idx_changes_proj_id ON project_changes(project_id, id)')
        conn.commit()
    finally:
        conn.close()


# ============================================================================
# Lock primitives
# ============================================================================

def _now() -> float:
    return time.time()


def acquire_lock(get_db, *, project_id: str, user_id: str,
                 user_name: str = '', ttl_s: int = DEFAULT_LOCK_TTL_S,
                 force: bool = False) -> dict[str, Any]:
    if not project_id or not user_id:
        return {'success': False, 'error': 'project_id and user_id required'}
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('SELECT user_id, user_name, expires_at, token FROM project_locks WHERE project_id = ?',
                  (project_id,))
        row = c.fetchone()
        now = _now()
        if row and not force:
            holder_id, holder_name, expires_at, _tok = row[0], row[1], row[2], row[3]
            if expires_at > now and holder_id != user_id:
                return {'success': False, 'error': 'locked',
                        'held_by': {'user_id': holder_id, 'user_name': holder_name},
                        'expires_in_s': round(expires_at - now, 1)}
        token = uuid.uuid4().hex
        expires_at = now + max(30, int(ttl_s))
        c.execute('INSERT OR REPLACE INTO project_locks(project_id, user_id, user_name, acquired_at, expires_at, token) '
                  'VALUES (?,?,?,?,?,?)',
                  (project_id, user_id, user_name, now, expires_at, token))
        conn.commit()
        return {'success': True, 'token': token,
                'expires_at': expires_at, 'ttl_s': int(ttl_s)}
    finally:
        conn.close()


def renew_lock(get_db, *, project_id: str, token: str,
               ttl_s: int = DEFAULT_LOCK_TTL_S) -> dict[str, Any]:
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('SELECT token FROM project_locks WHERE project_id = ?', (project_id,))
        row = c.fetchone()
        if not row or row[0] != token:
            return {'success': False, 'error': 'invalid_token'}
        new_exp = _now() + max(30, int(ttl_s))
        c.execute('UPDATE project_locks SET expires_at = ? WHERE project_id = ?', (new_exp, project_id))
        conn.commit()
        return {'success': True, 'expires_at': new_exp}
    finally:
        conn.close()


def release_lock(get_db, *, project_id: str, token: str) -> dict[str, Any]:
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('SELECT token FROM project_locks WHERE project_id = ?', (project_id,))
        row = c.fetchone()
        if not row:
            return {'success': True, 'released': False, 'note': 'not_locked'}
        if row[0] != token:
            return {'success': False, 'error': 'invalid_token'}
        c.execute('DELETE FROM project_locks WHERE project_id = ?', (project_id,))
        conn.commit()
        return {'success': True, 'released': True}
    finally:
        conn.close()


def lock_status(get_db, *, project_id: str) -> dict[str, Any]:
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('SELECT user_id, user_name, acquired_at, expires_at FROM project_locks WHERE project_id = ?',
                  (project_id,))
        row = c.fetchone()
        if not row:
            return {'success': True, 'locked': False}
        now = _now()
        if row[3] <= now:
            c.execute('DELETE FROM project_locks WHERE project_id = ?', (project_id,))
            conn.commit()
            return {'success': True, 'locked': False, 'note': 'expired'}
        return {'success': True, 'locked': True,
                'held_by': {'user_id': row[0], 'user_name': row[1]},
                'acquired_at': row[2], 'expires_at': row[3],
                'expires_in_s': round(row[3] - now, 1)}
    finally:
        conn.close()


# ============================================================================
# Presence
# ============================================================================

def heartbeat(get_db, *, project_id: str, user_id: str,
              user_name: str = '', view: str = '') -> dict[str, Any]:
    if not project_id or not user_id:
        return {'success': False, 'error': 'project_id and user_id required'}
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('INSERT OR REPLACE INTO project_presence(project_id, user_id, user_name, view, last_seen) '
                  'VALUES (?,?,?,?,?)', (project_id, user_id, user_name, view, _now()))
        # Purge stale entries while we're here
        c.execute('DELETE FROM project_presence WHERE last_seen < ?', (_now() - PRESENCE_STALE_S * 5,))
        conn.commit()
        return {'success': True}
    finally:
        conn.close()


def presence(get_db, *, project_id: str) -> dict[str, Any]:
    conn = get_db()
    try:
        c = conn.cursor()
        cutoff = _now() - PRESENCE_STALE_S
        c.execute('SELECT user_id, user_name, view, last_seen FROM project_presence '
                  'WHERE project_id = ? AND last_seen >= ?',
                  (project_id, cutoff))
        users = [{'user_id': r[0], 'user_name': r[1], 'view': r[2],
                  'last_seen': r[3], 'idle_s': round(_now() - r[3], 1)}
                 for r in c.fetchall()]
        return {'success': True, 'count': len(users), 'users': users}
    finally:
        conn.close()


# ============================================================================
# Change feed
# ============================================================================

def record_change(get_db, *, project_id: str, user_id: str,
                  op: str, payload: Any = None,
                  user_name: str = '') -> dict[str, Any]:
    if not project_id or not user_id or not op:
        return {'success': False, 'error': 'project_id, user_id, op required'}
    conn = get_db()
    try:
        c = conn.cursor()
        payload_json = json.dumps(payload) if payload is not None else None
        c.execute('INSERT INTO project_changes(project_id, user_id, user_name, op, payload_json, ts) '
                  'VALUES (?,?,?,?,?,?)',
                  (project_id, user_id, user_name, op, payload_json, _now()))
        conn.commit()
        return {'success': True, 'change_id': c.lastrowid}
    finally:
        conn.close()


def _fetch_changes(get_db, *, project_id: str, since_id: int, limit: int = 200) -> list[dict]:
    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('SELECT id, user_id, user_name, op, payload_json, ts FROM project_changes '
                  'WHERE project_id = ? AND id > ? ORDER BY id ASC LIMIT ?',
                  (project_id, since_id, limit))
        rows = c.fetchall()
    finally:
        conn.close()
    out = []
    for r in rows:
        try:
            payload = json.loads(r[4]) if r[4] else None
        except (TypeError, ValueError):
            payload = r[4]
        out.append({'id': r[0], 'user_id': r[1], 'user_name': r[2],
                    'op': r[3], 'payload': payload, 'ts': r[5]})
    return out


def poll_changes(get_db, *, project_id: str, since_id: int,
                 timeout_s: float = LONG_POLL_TIMEOUT_S) -> dict[str, Any]:
    deadline = _now() + max(0.0, min(float(timeout_s), 60.0))
    while True:
        changes = _fetch_changes(get_db, project_id=project_id, since_id=since_id)
        if changes:
            return {'success': True, 'changes': changes,
                    'last_id': changes[-1]['id']}
        if _now() >= deadline:
            return {'success': True, 'changes': [], 'last_id': since_id, 'timed_out': True}
        time.sleep(LONG_POLL_INTERVAL_S)


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request, g

    # Resolve get_db lazily — app_professional.get_db is module-level
    import app_professional as _ap

    _ensure_schema(_ap.get_db)

    def _user(d: dict) -> tuple[str, str]:
        u = d.get('user_id') or 'guest'
        n = d.get('user_name') or u
        return str(u), str(n)

    @app.route('/api/collab/lock/acquire', methods=['POST'])
    def _lock_acquire():
        d = request.get_json(silent=True) or {}
        uid, uname = _user(d)
        r = acquire_lock(_ap.get_db,
                         project_id=str(d.get('project_id', '')),
                         user_id=uid, user_name=uname,
                         ttl_s=int(d.get('ttl_s', DEFAULT_LOCK_TTL_S)),
                         force=bool(d.get('force', False)))
        return jsonify(r), (200 if r.get('success') else 409)

    @app.route('/api/collab/lock/renew', methods=['POST'])
    def _lock_renew():
        d = request.get_json(silent=True) or {}
        r = renew_lock(_ap.get_db,
                       project_id=str(d.get('project_id', '')),
                       token=str(d.get('token', '')),
                       ttl_s=int(d.get('ttl_s', DEFAULT_LOCK_TTL_S)))
        return jsonify(r), (200 if r.get('success') else 409)

    @app.route('/api/collab/lock/release', methods=['POST'])
    def _lock_release():
        d = request.get_json(silent=True) or {}
        r = release_lock(_ap.get_db,
                         project_id=str(d.get('project_id', '')),
                         token=str(d.get('token', '')))
        return jsonify(r), (200 if r.get('success') else 409)

    @app.route('/api/collab/lock/status', methods=['GET'])
    def _lock_status():
        pid = request.args.get('project_id', '')
        return jsonify(lock_status(_ap.get_db, project_id=pid)), 200

    @app.route('/api/collab/presence/heartbeat', methods=['POST'])
    def _presence_hb():
        d = request.get_json(silent=True) or {}
        uid, uname = _user(d)
        r = heartbeat(_ap.get_db, project_id=str(d.get('project_id', '')),
                      user_id=uid, user_name=uname,
                      view=str(d.get('view', '')))
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/collab/presence', methods=['GET'])
    def _presence_get():
        pid = request.args.get('project_id', '')
        return jsonify(presence(_ap.get_db, project_id=pid)), 200

    @app.route('/api/collab/changes/record', methods=['POST'])
    def _changes_record():
        d = request.get_json(silent=True) or {}
        uid, uname = _user(d)
        r = record_change(_ap.get_db, project_id=str(d.get('project_id', '')),
                          user_id=uid, user_name=uname,
                          op=str(d.get('op', '')), payload=d.get('payload'))
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/collab/changes/poll', methods=['GET'])
    def _changes_poll():
        pid = request.args.get('project_id', '')
        try:
            since = int(request.args.get('since_id', 0))
            timeout = float(request.args.get('timeout_s', LONG_POLL_TIMEOUT_S))
        except (TypeError, ValueError):
            return jsonify({'success': False, 'error': 'bad since_id/timeout_s'}), 400
        return jsonify(poll_changes(_ap.get_db, project_id=pid,
                                    since_id=since, timeout_s=timeout)), 200

    logger.info('collaboration module registered: /api/collab/{lock,presence,changes}/*')
