"""BOQ format renderer (NRM2 / CESMM4 / SMM7 / POMI).

Takes a generic priced-item list and renders it in the section-numbering and
column-layout convention of the requested standard:

  * RICS NRM2 (2nd ed., 2012) -- New Rules of Measurement: Detailed
    Measurement for Building Works (UK).
  * CESMM4 (2012, ICE) -- Civil Engineering Standard Method of Measurement.
  * SMM7 (1988+1998 amendments) -- legacy UK Standard Method.
  * POMI -- Principles of Measurement (International), RICS 1979.

This module does NOT attempt full automated re-classification of items
between standards (that requires expert mapping). Rather it produces a
formatted output table with the right section headings, units and column
order so a QS can publish to the requested form.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List

logger = logging.getLogger('eims.boq')

FORMATS = {
    'NRM2': {
        'name': 'RICS NRM2 (2nd ed., 2012)',
        'columns': ['ref', 'description', 'unit', 'quantity', 'rate', 'amount'],
        'sections': ['1 Substructure', '2 Superstructure', '3 Internal finishes',
                      '4 Fittings', '5 Services', '6 Prefabricated buildings',
                      '7 Existing buildings', '8 External works',
                      '9 Preliminaries'],
        'unit_convention_metric': True,
    },
    'CESMM4': {
        'name': 'CESMM4 (2012, ICE)',
        'columns': ['number', 'description', 'unit', 'quantity', 'rate', 'amount'],
        'sections': ['A General items', 'B Ground investigation', 'C Geotechnical',
                      'D Demolition', 'E Earthworks', 'F In-situ concrete',
                      'G Concrete ancillaries', 'H Precast concrete',
                      'I Pipework -- pipes', 'J Pipework -- fittings',
                      'K Pipework -- manholes', 'L Pipework -- supports',
                      'M Structural metalwork', 'N Misc metalwork',
                      'O Timber', 'P Piles', 'Q Piling ancillaries',
                      'R Roads & pavings', 'S Rail track', 'T Tunnels',
                      'U Brickwork', 'V Painting', 'W Waterproofing',
                      'X Misc work', 'Y Sewer renovation', 'Z Simple buildings'],
        'unit_convention_metric': True,
    },
    'SMM7': {
        'name': 'SMM7 (1988 + 1998 amendments)',
        'columns': ['ref', 'description', 'unit', 'quantity', 'rate', 'amount'],
        'sections': ['A Preliminaries / general conditions', 'C Existing site/buildings',
                      'D Groundwork', 'E In-situ concrete / large precast',
                      'F Masonry', 'G Structural / carcassing metal/timber',
                      'H Cladding / covering', 'J Waterproofing', 'K Linings',
                      'L Windows / doors / stairs', 'M Surface finishes',
                      'N Furniture / equipment', 'P Building fabric sundries',
                      'Q Paving / planting', 'R Disposal systems',
                      'S Piped supply systems', 'T Mechanical heating',
                      'U Ventilation / AC', 'V Electrical supply',
                      'W Communications', 'X Transport systems', 'Y Services'],
        'unit_convention_metric': True,
    },
    'POMI': {
        'name': 'RICS POMI (1979)',
        'columns': ['ref', 'description', 'unit', 'quantity', 'rate', 'amount'],
        'sections': ['1 General requirements', '2 Site work',
                      '3 Concrete work', '4 Masonry', '5 Metalwork',
                      '6 Woodwork', '7 Thermal & moisture protection',
                      '8 Doors & windows', '9 Finishes', '10 Specialties',
                      '11 Equipment', '12 Furnishings', '13 Special construction',
                      '14 Conveying systems', '15 Mechanical', '16 Electrical'],
        'unit_convention_metric': True,
    },
}


def render(*, items: List[Dict[str, Any]],
            format_name: str = 'NRM2',
            currency: str = 'GBP') -> Dict[str, Any]:
    if format_name not in FORMATS:
        return {'success': False,
                 'error': f'format must be one of {list(FORMATS)}'}
    spec = FORMATS[format_name]
    out_rows = []
    grand_total = 0.0
    for it in items or []:
        try:
            qty = float(it.get('quantity', 0) or 0)
            rate = float(it.get('rate', 0) or 0)
        except (TypeError, ValueError):
            continue
        amount = qty * rate
        grand_total += amount
        row = {c: '' for c in spec['columns']}
        row.update({
            'ref':         it.get('ref', '') or it.get('number', ''),
            'number':      it.get('number', '') or it.get('ref', ''),
            'description': it.get('description', ''),
            'unit':        it.get('unit', ''),
            'quantity':    qty,
            'rate':        round(rate, 2),
            'amount':      round(amount, 2),
            'section':     it.get('section', ''),
        })
        out_rows.append({c: row.get(c, '') for c in spec['columns'] + ['section']})
    return {
        'success': True,
        'format': spec['name'],
        'currency': currency,
        'columns': spec['columns'],
        'standard_sections': spec['sections'],
        'rows': out_rows,
        'grand_total': round(grand_total, 2),
        'disclaimer': 'Items are rendered in the requested layout. Re-classification '
                      'of work into the destination standard\'s sections is the '
                      'responsibility of the QS.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/boq/render', methods=['POST'])
    def _bq():
        data = request.get_json(silent=True) or {}
        r = render(
            items=data.get('items') or [],
            format_name=str(data.get('format', 'NRM2')),
            currency=str(data.get('currency', 'GBP')),
        )
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/qs/boq/formats', methods=['GET'])
    def _fmt():
        return jsonify({'success': True,
                         'formats': {k: {'name': v['name'],
                                          'columns': v['columns'],
                                          'sections': v['sections']}
                                       for k, v in FORMATS.items()}})

    logger.info('BOQ format renderer registered')
