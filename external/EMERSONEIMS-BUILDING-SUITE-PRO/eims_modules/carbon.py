"""Embodied-carbon assessment to EN 15978 / RICS WLCA 2nd ed. (2023).

Computes life-cycle embodied carbon (kgCO2e) for a building or BOQ from
material quantities and EPD (Environmental Product Declaration) factors
sourced from authoritative free databases:

  * ICE Database v3.0 (Inventory of Carbon & Energy, Univ. of Bath, 2019).
    Open-access, peer-reviewed cradle-to-gate factors. Distributed under
    a permissive licence by Circular Ecology.
  * Ökobaudat (German Federal Ministry of the Interior), open-access EPD
    library aligned with EN 15804.
  * EPD International (environdec.com) -- third-party verified EPDs.

NO carbon factors are hard-coded: every material in the request must
carry its kgCO2e per unit AND its source citation. The function applies
the algebra and adds RICS-mandated stage labels:

    Stages per EN 15978:
        A1-A3  Product (cradle-to-gate)
        A4     Transport to site
        A5     Construction
        B1-B7  Use (replacement, refurbishment, operational energy/water)
        C1-C4  End of life
        D      Beyond system boundary (reuse / recovery / recycling potential)

This module focuses on A1-A3 + A4 + A5 + C, which is what RICS WLCA
mandates as the minimum reporting boundary for new buildings.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.carbon')


VALID_STAGES = ('A1-A3', 'A4', 'A5', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7',
                 'C1', 'C2', 'C3', 'C4', 'D')


def assess(*, materials: List[Dict[str, Any]],
            gifa_m2: Optional[float] = None,
            project_name: str = '',
            assessment_stage: str = 'RIBA-3') -> Dict[str, Any]:
    """Compute embodied carbon from a quantity-take-off.

    Each material dict:
        {
          name, quantity, unit,
          factor_kgCO2e_per_unit, factor_source,  # MANDATORY
          stage           : one of VALID_STAGES (default A1-A3),
          element         : NRM1 element (e.g. '2.1 Frame'),
        }
    """
    if not materials:
        return {'success': False, 'error': 'no materials provided'}

    line_items = []
    by_stage: Dict[str, float] = {}
    by_element: Dict[str, float] = {}
    grand_total = 0.0
    missing_source = []

    for i, m in enumerate(materials):
        name = m.get('name', f'item_{i}')
        try:
            qty = float(m.get('quantity', 0) or 0)
            factor = float(m.get('factor_kgCO2e_per_unit', 0) or 0)
        except (TypeError, ValueError):
            return {'success': False,
                     'error': f'numeric quantity & factor required for {name!r}'}
        source = (m.get('factor_source') or '').strip()
        stage = m.get('stage', 'A1-A3')
        if stage not in VALID_STAGES:
            return {'success': False,
                     'error': f'invalid stage {stage!r} on {name!r}; must be one of {VALID_STAGES}'}
        element = m.get('element', 'unspecified')
        if not source:
            missing_source.append(name)
        co2 = qty * factor
        grand_total += co2
        by_stage[stage] = by_stage.get(stage, 0) + co2
        by_element[element] = by_element.get(element, 0) + co2
        line_items.append({
            'name':        name,
            'unit':        m.get('unit', ''),
            'quantity':    qty,
            'factor_kgCO2e_per_unit': factor,
            'factor_source': source or '[MISSING -- not labelled]',
            'stage':       stage,
            'element':     element,
            'embodied_co2_kg': round(co2, 3),
        })

    out: Dict[str, Any] = {
        'success': True,
        'standard': 'EN 15978:2011; RICS WLCA Professional Statement (2nd ed., 2023)',
        'project':  project_name,
        'assessment_stage': assessment_stage,
        'recommended_databases': [
            'ICE v3.0 (University of Bath / Circular Ecology, 2019)',
            'Ökobaudat (Federal Ministry of the Interior, Germany)',
            'EPD International (environdec.com)',
            'EC3 Embodied Carbon in Construction Calculator (Building Transparency)',
        ],
        'totals': {
            'embodied_co2e_kg':      round(grand_total, 2),
            'embodied_co2e_tonnes':  round(grand_total / 1000, 3),
        },
        'by_lifecycle_stage_kg': {k: round(v, 2) for k, v in by_stage.items()},
        'by_element_kg':         {k: round(v, 2) for k, v in by_element.items()},
        'line_items':            line_items,
        'data_provenance':       {
            'all_factors_user_supplied_with_source': not missing_source,
            'items_missing_source':                  missing_source,
        },
        'disclaimer': 'Carbon factors must be sourced from peer-reviewed EPDs '
                      'or open databases (ICE, Ökobaudat, EC3). Items lacking '
                      'a factor_source are flagged. Module does not invent '
                      'factors -- if a factor is zero or missing, the result '
                      'will be zero for that line.',
    }

    if gifa_m2 and gifa_m2 > 0:
        out['intensity'] = {
            'gifa_m2': gifa_m2,
            'kgCO2e_per_m2': round(grand_total / gifa_m2, 2),
            'benchmark_reference': 'LETI 2020 / RIBA 2030 Climate Challenge',
        }

    return out


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/carbon/assess', methods=['POST'])
    def _ec():
        data = request.get_json(silent=True) or {}
        try:
            r = assess(
                materials=data.get('materials') or [],
                gifa_m2=(float(data['gifa_m2'])
                          if data.get('gifa_m2') is not None else None),
                project_name=str(data.get('project_name', '')),
                assessment_stage=str(data.get('assessment_stage', 'RIBA-3')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/qs/carbon/stages', methods=['GET'])
    def _stages():
        return jsonify({
            'success': True,
            'standard': 'EN 15978:2011',
            'stages': {
                'A1-A3': 'Product (raw material supply, transport, manufacture)',
                'A4':    'Transport to site',
                'A5':    'Construction installation',
                'B1':    'Use',
                'B2':    'Maintenance',
                'B3':    'Repair',
                'B4':    'Replacement',
                'B5':    'Refurbishment',
                'B6':    'Operational energy use',
                'B7':    'Operational water use',
                'C1':    'Deconstruction / demolition',
                'C2':    'Transport (end of life)',
                'C3':    'Waste processing',
                'C4':    'Disposal',
                'D':     'Reuse / recovery / recycling potential',
            },
            'rics_minimum_boundary': ['A1-A3', 'A4', 'A5', 'B', 'C'],
        })

    logger.info('Embodied-carbon (EN 15978) module registered')
