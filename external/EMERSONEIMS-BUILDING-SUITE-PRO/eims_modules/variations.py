"""Variation / change-order register with contract-clause mapping.

Tracks variations end-to-end with:
  * Sequential reference numbering
  * Status workflow: notified -> instructed -> priced -> agreed -> rejected
  * Cost & time impact
  * Cumulative running totals against contract sum & completion date
  * Contract-clause citation for the legal basis (FIDIC / JCT / NEC / AIA)

This is a pure-Python in-memory register (Flask routes persist via JSON
file under uploads/.variations.json so the data survives restarts). For
production use, swap _STORE for a database adapter.
"""

from __future__ import annotations

import datetime as _dt
import json
import logging
import os
import threading
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.variations')

_STORE_PATH = os.path.join(
    os.environ.get('EIMS_UPLOAD_FOLDER',
                    os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                  'uploads')),
    '.variations.json',
)
_LOCK = threading.Lock()

VALID_STATUSES = ('notified', 'instructed', 'priced', 'agreed', 'rejected', 'closed')

# Common contract-form clause references for the *change* mechanism
CLAUSE_REFERENCES = {
    'FIDIC_RED_2017':   {'change_clause': '13', 'name': 'Variations and Adjustments',
                           'sub_clauses': ['13.1 Right to Vary',
                                            '13.3 Variation Procedure',
                                            '13.5 Provisional Sums',
                                            '13.6 Daywork',
                                            '13.7 Adjustments for Changes in Laws']},
    'FIDIC_YELLOW_2017': {'change_clause': '13', 'name': 'Variations and Adjustments',
                            'sub_clauses': ['13.1', '13.3.1 Variation by Instruction',
                                             '13.3.2 Variation by Request for Proposal']},
    'JCT_SBC_2016':     {'change_clause': '5', 'name': 'Variations',
                           'sub_clauses': ['5.1 Definition of Variations',
                                            '5.2 Valuation of Variations',
                                            '5.3 Schedule 2 Quotation',
                                            '5.6 Valuation Rules']},
    'NEC4_ECC':         {'change_clause': '6 / 60 / 62 / 63', 'name': 'Compensation Events',
                           'sub_clauses': ['60.1 Listed events',
                                            '61 Notifying compensation events',
                                            '62 Quotations',
                                            '63 Assessment',
                                            '65 Implementation']},
    'AIA_A201_2017':    {'change_clause': '7', 'name': 'Changes in the Work',
                           'sub_clauses': ['7.2 Change Orders',
                                            '7.3 Construction Change Directives',
                                            '7.4 Minor Changes in the Work']},
}


def _load() -> List[Dict[str, Any]]:
    try:
        with open(_STORE_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def _save(items: List[Dict[str, Any]]) -> None:
    os.makedirs(os.path.dirname(_STORE_PATH), exist_ok=True)
    tmp = _STORE_PATH + '.tmp'
    with open(tmp, 'w', encoding='utf-8') as f:
        json.dump(items, f, indent=2)
    os.replace(tmp, _STORE_PATH)


def add_variation(*, project_id: str, title: str, description: str,
                    cost_impact: float = 0.0, time_impact_days: float = 0.0,
                    contract_form: str = 'FIDIC_RED_2017',
                    clause_cited: Optional[str] = None,
                    initiated_by: str = '',
                    currency: str = 'GBP',
                    status: str = 'notified') -> Dict[str, Any]:
    if status not in VALID_STATUSES:
        return {'success': False,
                 'error': f'status must be one of {VALID_STATUSES}'}
    if contract_form not in CLAUSE_REFERENCES:
        return {'success': False,
                 'error': f'contract_form must be one of {list(CLAUSE_REFERENCES)}'}
    with _LOCK:
        items = _load()
        # Sequential per-project reference: VO-001, VO-002 ...
        proj_items = [i for i in items if i.get('project_id') == project_id]
        ref = f'VO-{len(proj_items) + 1:03d}'
        record = {
            'id':              f'{project_id}:{ref}',
            'project_id':      project_id,
            'reference':       ref,
            'title':           title,
            'description':     description,
            'cost_impact':     float(cost_impact),
            'time_impact_days': float(time_impact_days),
            'currency':        currency,
            'contract_form':   contract_form,
            'change_clause':   CLAUSE_REFERENCES[contract_form]['change_clause'],
            'clause_cited':    clause_cited or CLAUSE_REFERENCES[contract_form]['change_clause'],
            'initiated_by':    initiated_by,
            'status':          status,
            'date_notified':   _dt.datetime.now(_dt.timezone.utc).isoformat(timespec='seconds'),
            'date_updated':    _dt.datetime.now(_dt.timezone.utc).isoformat(timespec='seconds'),
        }
        items.append(record)
        _save(items)
    return {'success': True, 'record': record,
             'reference_meta': CLAUSE_REFERENCES[contract_form]}


def update_variation(*, vo_id: str, **changes) -> Dict[str, Any]:
    allowed = {'status', 'cost_impact', 'time_impact_days', 'description',
                'title', 'clause_cited'}
    bad = set(changes) - allowed
    if bad:
        return {'success': False, 'error': f'cannot update fields: {sorted(bad)}'}
    if 'status' in changes and changes['status'] not in VALID_STATUSES:
        return {'success': False,
                 'error': f'status must be one of {VALID_STATUSES}'}
    with _LOCK:
        items = _load()
        for it in items:
            if it.get('id') == vo_id:
                it.update({k: v for k, v in changes.items() if v is not None})
                it['date_updated'] = _dt.datetime.now(_dt.timezone.utc).isoformat(timespec='seconds')
                _save(items)
                return {'success': True, 'record': it}
    return {'success': False, 'error': f'variation {vo_id!r} not found'}


def project_summary(project_id: str,
                     original_contract_sum: float = 0.0,
                     original_completion_date: Optional[str] = None) -> Dict[str, Any]:
    items = [i for i in _load() if i.get('project_id') == project_id]
    agreed = [i for i in items if i.get('status') in ('agreed', 'closed')]
    pending = [i for i in items if i.get('status') in ('notified', 'instructed', 'priced')]
    rejected = [i for i in items if i.get('status') == 'rejected']

    cost_agreed_total = sum(i.get('cost_impact', 0) for i in agreed)
    cost_pending_total = sum(i.get('cost_impact', 0) for i in pending)
    days_agreed_total = sum(i.get('time_impact_days', 0) for i in agreed)
    days_pending_total = sum(i.get('time_impact_days', 0) for i in pending)

    revised_sum = original_contract_sum + cost_agreed_total
    forecast_sum = original_contract_sum + cost_agreed_total + cost_pending_total

    revised_completion = None
    forecast_completion = None
    if original_completion_date:
        try:
            d = _dt.date.fromisoformat(original_completion_date)
            revised_completion = (d + _dt.timedelta(days=days_agreed_total)).isoformat()
            forecast_completion = (
                d + _dt.timedelta(days=days_agreed_total + days_pending_total)
            ).isoformat()
        except ValueError:
            pass

    return {
        'success': True,
        'project_id': project_id,
        'counts': {'total': len(items), 'agreed': len(agreed),
                    'pending': len(pending), 'rejected': len(rejected)},
        'cost_impact': {
            'original_contract_sum': original_contract_sum,
            'agreed_variations':     round(cost_agreed_total, 2),
            'pending_variations':    round(cost_pending_total, 2),
            'revised_contract_sum':  round(revised_sum, 2),
            'forecast_final_sum':    round(forecast_sum, 2),
            'agreed_pct_of_original': round(
                cost_agreed_total / original_contract_sum * 100, 2)
                if original_contract_sum else None,
        },
        'time_impact': {
            'original_completion_date': original_completion_date,
            'agreed_extension_days':    days_agreed_total,
            'pending_extension_days':   days_pending_total,
            'revised_completion_date':  revised_completion,
            'forecast_completion_date': forecast_completion,
        },
        'register': items,
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/variations/clauses', methods=['GET'])
    def _refs():
        return jsonify({'success': True,
                         'contract_forms': CLAUSE_REFERENCES,
                         'valid_statuses': list(VALID_STATUSES)})

    @app.route('/api/qs/variations/add', methods=['POST'])
    def _add():
        data = request.get_json(silent=True) or {}
        if not data.get('project_id') or not data.get('title'):
            return jsonify({'success': False,
                             'error': 'project_id and title required'}), 400
        try:
            r = add_variation(
                project_id=str(data['project_id']),
                title=str(data['title']),
                description=str(data.get('description', '')),
                cost_impact=float(data.get('cost_impact', 0)),
                time_impact_days=float(data.get('time_impact_days', 0)),
                contract_form=str(data.get('contract_form', 'FIDIC_RED_2017')),
                clause_cited=data.get('clause_cited'),
                initiated_by=str(data.get('initiated_by', '')),
                currency=str(data.get('currency', 'GBP')),
                status=str(data.get('status', 'notified')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/qs/variations/update', methods=['POST'])
    def _upd():
        data = request.get_json(silent=True) or {}
        if not data.get('id'):
            return jsonify({'success': False, 'error': 'id required'}), 400
        kw = {k: data.get(k) for k in
              ('status', 'cost_impact', 'time_impact_days',
               'description', 'title', 'clause_cited')
              if k in data}
        r = update_variation(vo_id=str(data['id']), **kw)
        return jsonify(r), (200 if r.get('success') else 404)

    @app.route('/api/qs/variations/summary', methods=['GET'])
    def _sum():
        pid = request.args.get('project_id') or ''
        if not pid:
            return jsonify({'success': False,
                             'error': 'project_id required'}), 400
        try:
            sum_args = {
                'original_contract_sum': float(
                    request.args.get('original_contract_sum', 0) or 0),
                'original_completion_date':
                    request.args.get('original_completion_date') or None,
            }
        except ValueError:
            return jsonify({'success': False,
                             'error': 'original_contract_sum must be numeric'}), 400
        return jsonify(project_summary(pid, **sum_args))

    logger.info('Variation-register module registered')
