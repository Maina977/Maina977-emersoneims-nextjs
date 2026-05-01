"""Construction-rate build-up library.

Builds a unit-rate (cost per unit of measure) from its four canonical
components used in tender pricing worldwide:

    Unit rate = ( labour + plant + material ) * (1 + waste)
                * (1 + overheads) * (1 + profit)

Inputs are quantities and current resource rates (currency / hour or
currency / unit) that the user supplies. NO RATES ARE HARD-CODED -- the
function returns whatever the user feeds in, with the algebra documented
clearly. This satisfies the strict data-policy requirement that every
number be traceable to a source.

Reference standards:
  * CIOB Code of Estimating Practice (8th ed., 2018)
  * RICS NRM2 -- Detailed Measurement for Building Works (cl. 1.6.5
    "Definition of Rates and Prices")
  * AACE International RP 16R-90 -- Conducting Technical and Economic
    Evaluations
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.rates')


def _sum_resources(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    total = 0.0
    breakdown = []
    for it in items or []:
        try:
            qty = float(it.get('quantity', 0) or 0)
            rate = float(it.get('rate', 0) or 0)
        except (TypeError, ValueError):
            continue
        amount = qty * rate
        total += amount
        breakdown.append({
            'description': it.get('description', ''),
            'unit':        it.get('unit', ''),
            'quantity':    qty,
            'rate':        rate,
            'amount':      round(amount, 4),
            'source':      it.get('source', 'user-supplied'),
        })
    return {'total': round(total, 4), 'breakdown': breakdown}


def build_rate(*, item_description: str = '', unit_of_measure: str = '',
                labour: Optional[List[Dict[str, Any]]] = None,
                plant:  Optional[List[Dict[str, Any]]] = None,
                material: Optional[List[Dict[str, Any]]] = None,
                waste_pct: float = 0.05,
                overheads_pct: float = 0.10,
                profit_pct: float = 0.05,
                currency: str = 'GBP') -> Dict[str, Any]:
    """Build a single unit rate from its components.

    Each item in labour/plant/material is a dict:
        {description, unit, quantity, rate, source}

    Returns full algebra plus the final unit rate.
    """
    if waste_pct < 0 or overheads_pct < 0 or profit_pct < 0:
        return {'success': False,
                 'error': 'percentages must be non-negative'}

    L = _sum_resources(labour or [])
    P = _sum_resources(plant or [])
    M = _sum_resources(material or [])

    direct = L['total'] + P['total'] + M['total']
    after_waste = direct * (1 + waste_pct)
    after_oh    = after_waste * (1 + overheads_pct)
    final_rate  = after_oh * (1 + profit_pct)

    return {
        'success': True,
        'reference': 'CIOB Code of Estimating Practice (8th ed., 2018); RICS NRM2',
        'currency': currency,
        'item': {'description': item_description, 'unit': unit_of_measure},
        'inputs': {
            'labour':   L['breakdown'],
            'plant':    P['breakdown'],
            'material': M['breakdown'],
            'waste_pct':     waste_pct,
            'overheads_pct': overheads_pct,
            'profit_pct':    profit_pct,
        },
        'subtotals': {
            'labour':   L['total'],
            'plant':    P['total'],
            'material': M['total'],
            'direct_cost':            round(direct, 4),
            'after_waste_allowance':  round(after_waste, 4),
            'after_overheads':        round(after_oh, 4),
        },
        'unit_rate': round(final_rate, 4),
        'unit_rate_breakdown_pct': {
            'labour':   round(L['total'] / final_rate * 100, 2) if final_rate else 0,
            'plant':    round(P['total'] / final_rate * 100, 2) if final_rate else 0,
            'material': round(M['total'] / final_rate * 100, 2) if final_rate else 0,
            'waste':    round((after_waste - direct) / final_rate * 100, 2) if final_rate else 0,
            'overheads':round((after_oh - after_waste) / final_rate * 100, 2) if final_rate else 0,
            'profit':   round((final_rate - after_oh) / final_rate * 100, 2) if final_rate else 0,
        },
        'disclaimer': 'All resource rates are user-supplied. The function performs '
                      'algebra only and does not invent costs. Reconcile labour rates '
                      'with current CITB / national-agreement scales and material '
                      'rates with current quotations or live PPI feeds.',
    }


def price_boq(*, items: List[Dict[str, Any]], currency: str = 'GBP') -> Dict[str, Any]:
    """Apply build_rate to many BOQ items.

    Each item: {description, unit, quantity, build_rate_args}
    where build_rate_args is the dict passed to build_rate().
    """
    out = []
    grand_total = 0.0
    for itm in items or []:
        try:
            qty = float(itm.get('quantity', 0) or 0)
        except (TypeError, ValueError):
            qty = 0
        args = dict(itm.get('build_rate_args') or {})
        args.setdefault('currency', currency)
        args.setdefault('item_description', itm.get('description', ''))
        args.setdefault('unit_of_measure', itm.get('unit', ''))
        r = build_rate(**args)
        unit_rate = r.get('unit_rate', 0) if r.get('success') else 0
        amount = qty * unit_rate
        grand_total += amount
        out.append({
            'description': itm.get('description', ''),
            'unit':        itm.get('unit', ''),
            'quantity':    qty,
            'unit_rate':   unit_rate,
            'amount':      round(amount, 2),
            'rate_buildup': r,
        })
    return {
        'success': True,
        'currency': currency,
        'items':    out,
        'grand_total': round(grand_total, 2),
        'reference': 'RICS NRM2 cl. 1.6.5',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/rate-buildup', methods=['POST'])
    def _rb():
        data = request.get_json(silent=True) or {}
        try:
            r = build_rate(
                item_description=str(data.get('item_description', '')),
                unit_of_measure=str(data.get('unit_of_measure', '')),
                labour=data.get('labour'),
                plant=data.get('plant'),
                material=data.get('material'),
                waste_pct=float(data.get('waste_pct', 0.05)),
                overheads_pct=float(data.get('overheads_pct', 0.10)),
                profit_pct=float(data.get('profit_pct', 0.05)),
                currency=str(data.get('currency', 'GBP')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/qs/boq/price', methods=['POST'])
    def _boq():
        data = request.get_json(silent=True) or {}
        items = data.get('items') or []
        currency = str(data.get('currency', 'GBP'))
        return jsonify(price_boq(items=items, currency=currency))

    logger.info('Rate build-up library module registered')
