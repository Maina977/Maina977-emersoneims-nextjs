"""Critical Path Method (CPM) scheduler with Gantt output.

Implements the standard forward / backward pass on an Activity-on-Node
(AON) network and returns the critical path, total float, free float,
and a Gantt-ready timeline. Day-precision; supports project start date.

Reference:
  * PMBOK 7th ed. -- Schedule Management Knowledge Area
  * Kelley & Walker (1959) -- "Critical-Path Planning and Scheduling"
  * AACE RP 29R-03 -- Forensic Schedule Analysis (terminology)

Endpoints:
  POST /api/sched/cpm        -> compute CPM
  POST /api/sched/gantt      -> CPM + ISO-date Gantt rows
"""

from __future__ import annotations

import datetime as _dt
import logging
from typing import Any, Dict, List, Optional, Tuple

logger = logging.getLogger('eims.scheduler')


def _topo_sort(activities: List[Dict[str, Any]]) -> List[str]:
    nodes = {a['id'] for a in activities}
    incoming = {a['id']: set(a.get('predecessors') or []) for a in activities}
    for n, preds in incoming.items():
        for p in preds:
            if p not in nodes:
                raise ValueError(f"activity {n!r} references unknown predecessor {p!r}")
    order: List[str] = []
    ready = [n for n, p in incoming.items() if not p]
    seen = set()
    while ready:
        n = ready.pop(0)
        if n in seen:
            continue
        order.append(n); seen.add(n)
        for m, preds in incoming.items():
            if n in preds:
                preds.discard(n)
                if not preds and m not in seen:
                    ready.append(m)
    if len(order) != len(nodes):
        raise ValueError('cycle detected in activity network')
    return order


def cpm(*, activities: List[Dict[str, Any]],
          project_start: Optional[str] = None) -> Dict[str, Any]:
    """Compute CPM. activities = [{id, name, duration_days, predecessors}].
    project_start -- ISO date 'YYYY-MM-DD' (optional)."""
    if not activities:
        return {'success': False, 'error': 'activities list is empty'}
    for a in activities:
        if 'id' not in a or 'duration_days' not in a:
            return {'success': False,
                     'error': 'each activity needs id and duration_days'}
        if not isinstance(a['duration_days'], (int, float)) or a['duration_days'] < 0:
            return {'success': False,
                     'error': f"activity {a['id']!r} duration must be >= 0"}

    try:
        order = _topo_sort(activities)
    except ValueError as e:
        return {'success': False, 'error': str(e)}

    by_id = {a['id']: dict(a) for a in activities}
    succ: Dict[str, List[str]] = {n: [] for n in by_id}
    for a in activities:
        for p in a.get('predecessors') or []:
            succ[p].append(a['id'])

    # Forward pass
    ES: Dict[str, float] = {}; EF: Dict[str, float] = {}
    for n in order:
        preds = by_id[n].get('predecessors') or []
        ES[n] = max((EF[p] for p in preds), default=0.0)
        EF[n] = ES[n] + by_id[n]['duration_days']

    project_duration = max(EF.values())

    # Backward pass
    LF: Dict[str, float] = {}; LS: Dict[str, float] = {}
    for n in reversed(order):
        children = succ[n]
        LF[n] = min((LS[c] for c in children), default=project_duration)
        LS[n] = LF[n] - by_id[n]['duration_days']

    # Floats
    activities_out = []
    for n in order:
        TF = LS[n] - ES[n]
        # Free float = min(ES of successors) - EF
        FF = (min((ES[c] for c in succ[n]), default=EF[n]) - EF[n]) if succ[n] else TF
        activities_out.append({
            'id':            n,
            'name':          by_id[n].get('name', n),
            'duration_days': by_id[n]['duration_days'],
            'predecessors':  by_id[n].get('predecessors') or [],
            'ES': round(ES[n], 3), 'EF': round(EF[n], 3),
            'LS': round(LS[n], 3), 'LF': round(LF[n], 3),
            'total_float':   round(TF, 3),
            'free_float':    round(FF, 3),
            'is_critical':   abs(TF) < 1e-6,
        })

    critical_path = [a['id'] for a in activities_out if a['is_critical']]

    out: Dict[str, Any] = {
        'success': True,
        'standard': 'CPM (Kelley & Walker 1959); PMBOK 7th ed.',
        'reference': 'AACE RP 29R-03',
        'project_duration_days': round(project_duration, 3),
        'critical_path': critical_path,
        'activities': activities_out,
        'disclaimer': 'Day-precision deterministic CPM. For probabilistic '
                       'duration analysis use PERT or Monte-Carlo schedule '
                       'risk analysis (AACE RP 57R-09 / PMBOK).',
    }

    if project_start:
        try:
            start = _dt.date.fromisoformat(project_start)
        except ValueError:
            return {'success': False,
                     'error': f'project_start must be YYYY-MM-DD, got {project_start!r}'}
        out['project_start'] = project_start
        out['project_finish'] = (start + _dt.timedelta(days=int(round(project_duration)))).isoformat()
        for a in activities_out:
            a['start_date']  = (start + _dt.timedelta(days=int(round(a['ES'])))).isoformat()
            a['finish_date'] = (start + _dt.timedelta(days=int(round(a['EF'])))).isoformat()

    return out


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/sched/cpm', methods=['POST'])
    def _cpm():
        d = request.get_json(silent=True) or {}
        try:
            r = cpm(activities=d.get('activities') or [],
                     project_start=d.get('project_start'))
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/sched/gantt', methods=['POST'])
    def _gantt():
        d = request.get_json(silent=True) or {}
        if not d.get('project_start'):
            d['project_start'] = _dt.date.today().isoformat()
        try:
            r = cpm(activities=d.get('activities') or [],
                     project_start=d.get('project_start'))
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        if not r.get('success'):
            return jsonify(r), 400
        gantt_rows = [{
            'id': a['id'], 'name': a['name'],
            'start': a['start_date'], 'finish': a['finish_date'],
            'duration_days': a['duration_days'],
            'critical': a['is_critical'],
            'depends_on': a['predecessors'],
        } for a in r['activities']]
        r['gantt'] = gantt_rows
        return jsonify(r)

    logger.info('CPM scheduler module registered (/api/sched/cpm, /api/sched/gantt)')
