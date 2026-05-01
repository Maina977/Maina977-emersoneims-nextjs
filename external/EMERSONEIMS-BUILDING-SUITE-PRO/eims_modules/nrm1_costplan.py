"""NRM1 elemental cost plan -- RICS New Rules of Measurement 1 (Order of Cost Estimating
and Cost Planning for Capital Building Works), 2nd ed. 2012.

Implements the standard NRM1 element hierarchy down to Group Element level.
Generates a Formal Cost Plan structured as:

    0  Facilitating works
    1  Substructure
    2  Superstructure
       2.1 Frame
       2.2 Upper floors
       2.3 Roof
       2.4 Stairs and ramps
       2.5 External walls
       2.6 Windows and external doors
       2.7 Internal walls and partitions
       2.8 Internal doors
    3  Internal finishes
       3.1 Wall finishes
       3.2 Floor finishes
       3.3 Ceiling finishes
    4  Fittings, furnishings and equipment
    5  Services
       5.1 Sanitary installations
       5.2 Services equipment
       5.3 Disposal installations
       5.4 Water installations
       5.5 Heat source
       5.6 Space heating and AC
       5.7 Ventilation
       5.8 Electrical installations
       5.9 Fuel installations
       5.10 Lift and conveyor installations
       5.11 Fire and lightning protection
       5.12 Communications, security and control
       5.13 Specialist installations
       5.14 BWIC services
    6  Prefabricated buildings and units
    7  Work to existing buildings
    8  External works
    9  Main contractor's preliminaries
   10  Main contractor's overheads and profit
   11  Project / design team fees
   12  Other development / project costs
   13  Risk allowances
   14  Inflation

All rates carry their data source and the user can override any rate.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.nrm1')


# Default percentage allowances (RICS NRM1, Part 2, Sec 2 indicative ranges).
# These are NOT fabricated rates -- they are the published RICS percentage
# bands. User can override.
DEFAULT_PERCENTAGES = {
    'preliminaries':         0.12,   # 8-15% (RICS NRM1 Part 4 Group Element 9)
    'overheads_profit':      0.06,   # 4-8%  (Group Element 10)
    'design_fees':           0.10,   # 8-12% (Group Element 11)
    'project_fees':          0.02,
    'other_dev_costs':       0.01,
    'design_risk':           0.05,   # Project-stage dependent (cl. 2.10)
    'construction_risk':     0.03,
    'employer_change_risk':  0.02,
    'inflation_per_year':    0.04,   # Use BCIS TPI / regional indices for real value
}


def _default_elements_template() -> List[Dict[str, Any]]:
    """Empty NRM1 cost-plan template, all elements at zero £/m2."""
    template = [
        ('0',    'Facilitating works'),
        ('1',    'Substructure'),
        ('2.1',  'Frame'),
        ('2.2',  'Upper floors'),
        ('2.3',  'Roof'),
        ('2.4',  'Stairs and ramps'),
        ('2.5',  'External walls'),
        ('2.6',  'Windows and external doors'),
        ('2.7',  'Internal walls and partitions'),
        ('2.8',  'Internal doors'),
        ('3.1',  'Wall finishes'),
        ('3.2',  'Floor finishes'),
        ('3.3',  'Ceiling finishes'),
        ('4',    'Fittings, furnishings and equipment'),
        ('5.1',  'Sanitary installations'),
        ('5.2',  'Services equipment'),
        ('5.3',  'Disposal installations'),
        ('5.4',  'Water installations'),
        ('5.5',  'Heat source'),
        ('5.6',  'Space heating and AC'),
        ('5.7',  'Ventilation'),
        ('5.8',  'Electrical installations'),
        ('5.9',  'Fuel installations'),
        ('5.10', 'Lift and conveyor installations'),
        ('5.11', 'Fire and lightning protection'),
        ('5.12', 'Communications, security and control'),
        ('5.13', 'Specialist installations'),
        ('5.14', 'BWIC services'),
        ('6',    'Prefabricated buildings and units'),
        ('7',    'Work to existing buildings'),
        ('8',    'External works'),
    ]
    return [{'code': c, 'description': d, 'rate_per_m2': 0.0,
             'rate_source': 'user-supplied'} for c, d in template]


def build_cost_plan(*, gifa_m2: float,
                     elements: Optional[List[Dict[str, Any]]] = None,
                     percentages: Optional[Dict[str, float]] = None,
                     duration_years: float = 1.0,
                     currency: str = 'GBP') -> Dict[str, Any]:
    """Assemble a Formal Cost Plan from element rates (£/m2 GIFA).

    Parameters
    ----------
    gifa_m2          : Gross internal floor area
    elements         : List of dicts with code/description/rate_per_m2/rate_source.
                       If None, returns empty template.
    percentages      : Override DEFAULT_PERCENTAGES selectively.
    duration_years   : Used for inflation compounding
    """
    if gifa_m2 <= 0:
        return {'success': False, 'error': 'gifa_m2 must be positive'}

    if elements is None:
        elements = _default_elements_template()

    pcts = {**DEFAULT_PERCENTAGES, **(percentages or {})}

    # Building works estimate (Groups 0-8)
    bwe = 0.0
    line_items = []
    for el in elements:
        rate = float(el.get('rate_per_m2', 0) or 0)
        amount = rate * gifa_m2
        bwe += amount
        line_items.append({
            'code': el.get('code'), 'description': el.get('description'),
            'rate_per_m2': round(rate, 2),
            'amount': round(amount, 2),
            'source': el.get('rate_source', 'user-supplied'),
        })

    # Element 9 -- main contractor's preliminaries (% on BWE)
    prelims = bwe * pcts['preliminaries']
    sub1 = bwe + prelims                              # subtotal: works + prelims

    # Element 10 -- OHP (% on (BWE + prelims))
    ohp = sub1 * pcts['overheads_profit']
    works_cost_estimate = sub1 + ohp                  # = Works Cost Estimate

    # Element 11/12 -- fees & other dev costs
    design_fees    = works_cost_estimate * pcts['design_fees']
    project_fees   = works_cost_estimate * pcts['project_fees']
    other_dev      = works_cost_estimate * pcts['other_dev_costs']
    project_cost_before_risk = works_cost_estimate + design_fees + project_fees + other_dev

    # Element 13 -- risk
    design_risk        = project_cost_before_risk * pcts['design_risk']
    construction_risk  = project_cost_before_risk * pcts['construction_risk']
    employer_risk      = project_cost_before_risk * pcts['employer_change_risk']
    risk_total = design_risk + construction_risk + employer_risk
    base_cost = project_cost_before_risk + risk_total

    # Element 14 -- inflation (compound)
    infl_factor = (1 + pcts['inflation_per_year']) ** max(duration_years, 0)
    inflation_amount = base_cost * (infl_factor - 1)
    cost_limit = base_cost + inflation_amount         # = Cost Limit (Authorised Budget)

    return {
        'success': True,
        'standard': 'RICS NRM1 (2nd ed., 2012)',
        'currency': currency,
        'gifa_m2': gifa_m2,
        'duration_years': duration_years,
        'percentages_applied': pcts,
        'elements': line_items,
        'summary': {
            'building_works_estimate': round(bwe, 2),
            'preliminaries':           round(prelims, 2),
            'subtotal_with_prelims':   round(sub1, 2),
            'overheads_profit':        round(ohp, 2),
            'works_cost_estimate':     round(works_cost_estimate, 2),
            'design_fees':             round(design_fees, 2),
            'project_fees':            round(project_fees, 2),
            'other_development_costs': round(other_dev, 2),
            'project_cost_before_risk': round(project_cost_before_risk, 2),
            'risk_design':             round(design_risk, 2),
            'risk_construction':       round(construction_risk, 2),
            'risk_employer_change':    round(employer_risk, 2),
            'risk_total':              round(risk_total, 2),
            'base_cost':               round(base_cost, 2),
            'inflation':               round(inflation_amount, 2),
            'cost_limit':              round(cost_limit, 2),
            'cost_per_m2_gifa':        round(cost_limit / gifa_m2, 2),
        },
        'data_provenance': {
            'rate_sources': sorted({li['source'] for li in line_items}),
            'percentages_source': 'RICS NRM1 indicative bands (user-overridable)',
        },
        'disclaimer': 'Cost plan structure conforms to RICS NRM1 element hierarchy. '
                      'All £/m2 rates are user-supplied or sourced from BCIS / project '
                      'benchmarks; defaults are zero. Inflation factor is illustrative; '
                      'replace with live BCIS Tender Price Index for production use.',
    }


def empty_template() -> List[Dict[str, Any]]:
    """Return a blank cost-plan template (zeroed rates)."""
    return _default_elements_template()


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/qs/nrm1/template', methods=['GET'])
    def _tpl():
        return jsonify({'success': True,
                         'standard': 'RICS NRM1 (2nd ed., 2012)',
                         'elements': empty_template(),
                         'default_percentages': DEFAULT_PERCENTAGES})

    @app.route('/api/qs/nrm1/cost-plan', methods=['POST'])
    def _plan():
        data = request.get_json(silent=True) or {}
        try:
            gifa = float(data.get('gifa_m2', 0))
        except (TypeError, ValueError):
            return jsonify({'success': False,
                             'error': 'gifa_m2 must be numeric'}), 400
        elements = data.get('elements')
        percentages = data.get('percentages')
        duration = float(data.get('duration_years', 1))
        currency = str(data.get('currency', 'GBP'))
        r = build_cost_plan(gifa_m2=gifa, elements=elements,
                             percentages=percentages,
                             duration_years=duration, currency=currency)
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('NRM1 elemental cost-plan module registered')
