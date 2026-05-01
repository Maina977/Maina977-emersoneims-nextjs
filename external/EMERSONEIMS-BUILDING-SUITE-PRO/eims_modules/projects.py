"""SQLite-backed project & calculation snapshot store.

Schema:
    projects(id PK, name, client, location, created_at, updated_at)
    snapshots(id PK, project_id FK, module, label, payload_json,
              source_count, created_at)

Endpoints:
    POST   /api/projects                   create project
    GET    /api/projects                   list projects
    GET    /api/projects/<id>              project + snapshot index
    DELETE /api/projects/<id>              delete project (+ snapshots)
    POST   /api/projects/<id>/snapshots    save a calc result
    GET    /api/projects/<id>/snapshots    list snapshots
    GET    /api/snapshots/<id>             single snapshot (full payload)
    DELETE /api/snapshots/<id>             delete snapshot

The DB lives at $EIMS_UPLOAD_FOLDER/eims_projects.db so it shares the
same persistence root as the audit log and variations register.
"""

from __future__ import annotations

import datetime as _dt
import json
import logging
import os
import sqlite3
import threading
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.projects')

_DB_LOCK = threading.Lock()
_DB_PATH = os.path.join(
    os.environ.get('EIMS_UPLOAD_FOLDER',
                    os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                  'uploads')),
    'eims_projects.db',
)


def _now() -> str:
    return _dt.datetime.now(_dt.timezone.utc).isoformat(timespec='seconds')


def _connect() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(_DB_PATH), exist_ok=True)
    conn = sqlite3.connect(_DB_PATH, timeout=10, isolation_level=None)
    conn.row_factory = sqlite3.Row
    conn.execute('PRAGMA foreign_keys = ON')
    conn.execute('PRAGMA journal_mode = WAL')
    return conn


def init_db() -> None:
    with _DB_LOCK, _connect() as conn:
        conn.executescript('''
            CREATE TABLE IF NOT EXISTS projects (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                name        TEXT NOT NULL,
                client      TEXT,
                location    TEXT,
                created_at  TEXT NOT NULL,
                updated_at  TEXT NOT NULL
            );
            CREATE TABLE IF NOT EXISTS snapshots (
                id            INTEGER PRIMARY KEY AUTOINCREMENT,
                project_id    INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                module        TEXT NOT NULL,
                label         TEXT NOT NULL,
                payload_json  TEXT NOT NULL,
                source_count  INTEGER NOT NULL DEFAULT 0,
                created_at    TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_snap_project ON snapshots(project_id);
        ''')


def _count_sources(payload: Any) -> int:
    """Count distinct source citations -- enforces data-policy traceability."""
    found = set()

    def walk(o):
        if isinstance(o, dict):
            for k, v in o.items():
                if k in ('source', 'factor_source', 'rate_source',
                          'reference', 'standard', 'data_source') \
                        and isinstance(v, str) and v.strip():
                    found.add(v.strip())
                walk(v)
        elif isinstance(o, list):
            for x in o:
                walk(x)
    walk(payload)
    return len(found)


def create_project(*, name: str, client: str = '', location: str = '') -> Dict[str, Any]:
    if not name or not name.strip():
        return {'success': False, 'error': 'name is required'}
    init_db()
    ts = _now()
    with _DB_LOCK, _connect() as conn:
        cur = conn.execute(
            'INSERT INTO projects (name, client, location, created_at, updated_at)'
            ' VALUES (?, ?, ?, ?, ?)',
            (name.strip(), client.strip(), location.strip(), ts, ts))
        return {'success': True,
                 'project': {'id': cur.lastrowid, 'name': name.strip(),
                              'client': client, 'location': location,
                              'created_at': ts, 'updated_at': ts}}


def list_projects() -> List[Dict[str, Any]]:
    init_db()
    with _DB_LOCK, _connect() as conn:
        rows = conn.execute(
            'SELECT p.*, COUNT(s.id) AS snapshot_count '
            'FROM projects p LEFT JOIN snapshots s ON s.project_id = p.id '
            'GROUP BY p.id ORDER BY p.updated_at DESC').fetchall()
    return [dict(r) for r in rows]


def get_project(pid: int) -> Optional[Dict[str, Any]]:
    init_db()
    with _DB_LOCK, _connect() as conn:
        row = conn.execute('SELECT * FROM projects WHERE id = ?', (pid,)).fetchone()
        if not row:
            return None
        snaps = conn.execute(
            'SELECT id, module, label, source_count, created_at '
            'FROM snapshots WHERE project_id = ? ORDER BY created_at DESC',
            (pid,)).fetchall()
    proj = dict(row)
    proj['snapshots'] = [dict(s) for s in snaps]
    return proj


def delete_project(pid: int) -> bool:
    init_db()
    with _DB_LOCK, _connect() as conn:
        cur = conn.execute('DELETE FROM projects WHERE id = ?', (pid,))
        return cur.rowcount > 0


def save_snapshot(*, project_id: int, module: str, label: str,
                    payload: Dict[str, Any]) -> Dict[str, Any]:
    if not module or not label:
        return {'success': False, 'error': 'module and label are required'}
    init_db()
    ts = _now()
    src_count = _count_sources(payload)
    with _DB_LOCK, _connect() as conn:
        proj = conn.execute('SELECT id FROM projects WHERE id = ?',
                              (project_id,)).fetchone()
        if not proj:
            return {'success': False, 'error': f'project {project_id} not found'}
        cur = conn.execute(
            'INSERT INTO snapshots (project_id, module, label, payload_json, '
            ' source_count, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            (project_id, module, label, json.dumps(payload, default=str),
              src_count, ts))
        conn.execute('UPDATE projects SET updated_at = ? WHERE id = ?',
                      (ts, project_id))
    return {'success': True,
             'snapshot': {'id': cur.lastrowid, 'project_id': project_id,
                            'module': module, 'label': label,
                            'source_count': src_count, 'created_at': ts},
             'data_provenance_warning':
                 None if src_count > 0 else
                 'Snapshot has no source citations -- review for data-policy '
                 'compliance before relying on it.'}


def get_snapshot(sid: int) -> Optional[Dict[str, Any]]:
    init_db()
    with _DB_LOCK, _connect() as conn:
        row = conn.execute('SELECT * FROM snapshots WHERE id = ?', (sid,)).fetchone()
    if not row:
        return None
    rec = dict(row)
    rec['payload'] = json.loads(rec.pop('payload_json'))
    return rec


def delete_snapshot(sid: int) -> bool:
    init_db()
    with _DB_LOCK, _connect() as conn:
        cur = conn.execute('DELETE FROM snapshots WHERE id = ?', (sid,))
        return cur.rowcount > 0


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    init_db()

    def _require(*keys):
        data = request.get_json(silent=True) or {}
        missing = [k for k in keys if k not in data or data[k] in (None, '')]
        return data, missing

    def _create():
        data, miss = _require('name')
        if miss:
            return jsonify({'success': False, 'error': f'missing: {miss}'}), 400
        return jsonify(create_project(name=str(data['name']),
                                         client=str(data.get('client', '')),
                                         location=str(data.get('location', ''))))

    def _list():
        return jsonify({'success': True, 'projects': list_projects()})

    def _get(pid):
        proj = get_project(pid)
        if not proj:
            return jsonify({'success': False, 'error': 'not found'}), 404
        return jsonify({'success': True, 'project': proj})

    def _delete(pid):
        ok = delete_project(pid)
        return jsonify({'success': ok}), (200 if ok else 404)

    def _save_snap(pid):
        data, miss = _require('module', 'label', 'payload')
        if miss:
            return jsonify({'success': False, 'error': f'missing: {miss}'}), 400
        r = save_snapshot(project_id=pid, module=str(data['module']),
                            label=str(data['label']),
                            payload=data['payload'])
        return jsonify(r), (200 if r['success'] else 400)

    def _list_snaps(pid):
        proj = get_project(pid)
        if not proj:
            return jsonify({'success': False, 'error': 'not found'}), 404
        return jsonify({'success': True, 'snapshots': proj['snapshots']})

    def _get_snap(sid):
        snap = get_snapshot(sid)
        if not snap:
            return jsonify({'success': False, 'error': 'not found'}), 404
        return jsonify({'success': True, 'snapshot': snap})

    def _del_snap(sid):
        ok = delete_snapshot(sid)
        return jsonify({'success': ok}), (200 if ok else 404)

    routes = [
        ('/api/store/projects',                          'eims_proj_create',   _create,     ['POST']),
        ('/api/store/projects',                          'eims_proj_list',     _list,       ['GET']),
        ('/api/store/projects/<int:pid>',                'eims_proj_get',      _get,        ['GET']),
        ('/api/store/projects/<int:pid>',                'eims_proj_delete',   _delete,     ['DELETE']),
        ('/api/store/projects/<int:pid>/snapshots',      'eims_snap_save',     _save_snap,  ['POST']),
        ('/api/store/projects/<int:pid>/snapshots',      'eims_snap_list',     _list_snaps, ['GET']),
        ('/api/store/snapshots/<int:sid>',               'eims_snap_get',      _get_snap,   ['GET']),
        ('/api/store/snapshots/<int:sid>',               'eims_snap_delete',   _del_snap,   ['DELETE']),
    ]
    for url, name, func, methods in routes:
        if auth_required:
            func = auth_required(func)
        # avoid clashing with any pre-existing /api/projects route
        try:
            app.add_url_rule(url, name, func, methods=methods)
        except (AssertionError, ValueError) as e:
            logger.warning('Could not register %s %s: %s', methods, url, e)

    logger.info('Project persistence module registered (%s)', _DB_PATH)
