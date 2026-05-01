"""
Risk register generator (safety manager tool).

Given project type + phase + location context, returns a tailored
construction-risk register (hazard / likelihood / severity / controls /
responsible party) using HSE + OGP + ISO 45001 category taxonomy.

No external APIs. Pure data + rules.
"""
from __future__ import annotations
from typing import Any
import logging

logger = logging.getLogger('eims')

# Hazard taxonomy — from HSE "Construction hazards" (HSG150) + OGP 432
# Each row: hazard, likelihood(1-5), severity(1-5), typical_controls, responsible
_BASE_REGISTER: list[dict[str, Any]] = [
    # Access / work-at-height
    {'category': 'Work at height', 'hazard': 'Fall from scaffolding > 2 m',
     'likelihood': 3, 'severity': 5,
     'controls': ['Scaffolding inspected weekly by competent person',
                  'Fall arrest / edge protection',
                  'Toolbox talk before shift',
                  'Scaffolding tag system'],
     'responsible': 'Site supervisor', 'standard': 'HSE CIS49'},
    {'category': 'Work at height', 'hazard': 'Unprotected floor opening',
     'likelihood': 2, 'severity': 5,
     'controls': ['Rigid cover or guardrail 1.1 m + toeboard',
                  'Permit-to-work for cover removal'],
     'responsible': 'Site supervisor', 'standard': 'HSE CIS49'},
    # Excavation
    {'category': 'Excavation', 'hazard': 'Trench collapse',
     'likelihood': 2, 'severity': 5,
     'controls': ['Trench support/battering to OSHA 29 CFR 1926 Sub P',
                  'Daily inspection by competent person',
                  'Spoil kept > 0.6 m from edge',
                  'Underground-services survey before dig'],
     'responsible': 'Excavation supervisor', 'standard': 'HSE HSG47'},
    {'category': 'Excavation', 'hazard': 'Strike of buried services',
     'likelihood': 3, 'severity': 4,
     'controls': ['CAT & Genny scan before dig',
                  'As-built drawings on site',
                  'Hand-dig within 0.5 m of marked service'],
     'responsible': 'Excavation supervisor', 'standard': 'HSE HSG47'},
    # Lifting
    {'category': 'Lifting operations', 'hazard': 'Crane tip-over / load drop',
     'likelihood': 2, 'severity': 5,
     'controls': ['Lift plan per LOLER reg 8',
                  'Appointed Person oversight',
                  'Thorough examination in last 12 months',
                  'Exclusion zone / banksman'],
     'responsible': 'Appointed Person', 'standard': 'LOLER 1998'},
    # Electrical
    {'category': 'Electrical', 'hazard': 'Contact with live overhead line',
     'likelihood': 2, 'severity': 5,
     'controls': ['Goalposts at 6 m clearance',
                  'Method statement references GS6',
                  'Supervised lifting operations near lines'],
     'responsible': 'Site engineer', 'standard': 'HSE GS6'},
    {'category': 'Electrical', 'hazard': 'Shock from site tools (230 V)',
     'likelihood': 3, 'severity': 3,
     'controls': ['110 V CTE transformer preferred',
                  'PAT testing quarterly',
                  'RCDs on all 230 V circuits'],
     'responsible': 'Site engineer', 'standard': 'BS 7671 amd 2'},
    # Manual handling
    {'category': 'Manual handling', 'hazard': 'Back/neck injury lifting > 25 kg',
     'likelihood': 4, 'severity': 3,
     'controls': ['Mechanical aid first',
                  'Two-person lift above 25 kg',
                  'Manual-handling training recorded'],
     'responsible': 'All workers', 'standard': 'MHOR 1992'},
    # Hot work
    {'category': 'Hot work', 'hazard': 'Fire from welding sparks',
     'likelihood': 2, 'severity': 5,
     'controls': ['Hot-work permit',
                  'Fire watch 60 min post-work',
                  'Extinguisher within 3 m',
                  'Combustibles moved > 10 m or covered'],
     'responsible': 'Hot-work supervisor', 'standard': 'FM Global DS 10-3'},
    # Confined space
    {'category': 'Confined space', 'hazard': 'Asphyxiation in manhole / tank',
     'likelihood': 2, 'severity': 5,
     'controls': ['Atmospheric testing pre-entry (O2/LEL/CO/H2S)',
                  'Confined-space permit',
                  'Top-man + tripod rescue',
                  'Forced ventilation'],
     'responsible': 'Entry supervisor', 'standard': 'CSR 1997'},
    # Noise / vibration / dust
    {'category': 'Health', 'hazard': 'Hand-arm vibration syndrome (breakers)',
     'likelihood': 3, 'severity': 3,
     'controls': ['Trigger-time logging',
                  'Low-vibration tools specified',
                  'Health surveillance annually'],
     'responsible': 'Site manager', 'standard': 'CVWR 2005'},
    {'category': 'Health', 'hazard': 'Silica dust (cutting concrete / masonry)',
     'likelihood': 4, 'severity': 4,
     'controls': ['Water suppression on cut saws',
                  'FFP3 mask',
                  'M-class vacuum'],
     'responsible': 'Site manager', 'standard': 'COSHH 2002'},
    # Traffic / plant
    {'category': 'Site traffic', 'hazard': 'Struck by reversing plant',
     'likelihood': 3, 'severity': 5,
     'controls': ['Pedestrian / vehicle separation',
                  'Banksman on all reverses',
                  'Reversing alarms + camera'],
     'responsible': 'Site manager', 'standard': 'HSE HSG144'},
    # Covid / health (modern)
    {'category': 'Welfare', 'hazard': 'Heat stress (summer work)',
     'likelihood': 3, 'severity': 3,
     'controls': ['Shade + water every 20 min',
                  'WBGT monitoring > 28 degC',
                  'Rotation of outdoor work'],
     'responsible': 'Site manager', 'standard': 'ISO 7243'},
]

_PROJECT_EXTRAS: dict[str, list[dict[str, Any]]] = {
    'high_rise': [
        {'category': 'Work at height', 'hazard': 'Mast-climber / hoist failure',
         'likelihood': 1, 'severity': 5,
         'controls': ['Third-party thorough examination',
                      'Daily operator checks',
                      'Anemometer auto-stop > 15 m/s'],
         'responsible': 'Appointed Person', 'standard': 'LOLER 1998'},
        {'category': 'Logistics', 'hazard': 'Material hoist overload',
         'likelihood': 2, 'severity': 4,
         'controls': ['SWL clearly marked',
                      'Automatic overload cutout tested weekly'],
         'responsible': 'Hoist operator', 'standard': 'PUWER 1998'},
    ],
    'deep_excavation': [
        {'category': 'Excavation', 'hazard': 'Groundwater ingress / dewatering failure',
         'likelihood': 3, 'severity': 4,
         'controls': ['Piezometer monitoring',
                      'Back-up pump + generator',
                      'Geotechnical review pre-dig'],
         'responsible': 'Temp-works coordinator', 'standard': 'BS 5975:2019'},
    ],
    'demolition': [
        {'category': 'Demolition', 'hazard': 'Asbestos exposure (pre-2000 building)',
         'likelihood': 4, 'severity': 5,
         'controls': ['R&D survey pre-work',
                      'Licensed contractor for Cat 1/2',
                      'Air-monitoring clearance certificate'],
         'responsible': 'CDM Principal Contractor', 'standard': 'CAR 2012'},
        {'category': 'Demolition', 'hazard': 'Premature collapse of structure',
         'likelihood': 2, 'severity': 5,
         'controls': ['Structural survey + method statement',
                      'Temporary propping designed by SE',
                      'Top-down sequence'],
         'responsible': 'Demolition supervisor', 'standard': 'BS 6187:2011'},
    ],
    'roofing': [
        {'category': 'Work at height', 'hazard': 'Fall through fragile roof',
         'likelihood': 3, 'severity': 5,
         'controls': ['Crawl-boards + safety-net below',
                      'Fragile roof warning signs',
                      'Harness to independent anchor'],
         'responsible': 'Roofing supervisor', 'standard': 'HSE HSG33'},
    ],
    'marine': [
        {'category': 'Marine', 'hazard': 'Drowning / fall in water',
         'likelihood': 2, 'severity': 5,
         'controls': ['Lifejackets mandatory',
                      'Rescue boat on stand-by',
                      'Man-overboard alarm drill weekly'],
         'responsible': 'Marine coordinator', 'standard': 'IMCA SEL 025'},
    ],
}


def _score(e: dict[str, Any]) -> int:
    return int(e['likelihood']) * int(e['severity'])


def _rag(score: int) -> str:
    if score >= 15:
        return 'RED'
    if score >= 8:
        return 'AMBER'
    return 'GREEN'


def build_register(*, project_type: str = 'general',
                   extras: list[str] | None = None,
                   location: str | None = None) -> dict[str, Any]:
    items = list(_BASE_REGISTER)
    extras = extras or []
    if project_type in _PROJECT_EXTRAS:
        items.extend(_PROJECT_EXTRAS[project_type])
    for x in extras:
        if x in _PROJECT_EXTRAS and x != project_type:
            items.extend(_PROJECT_EXTRAS[x])

    for it in items:
        it['risk_score'] = _score(it)
        it['rag'] = _rag(it['risk_score'])

    items.sort(key=lambda x: (-x['risk_score'], x['category']))

    summary = {
        'RED':   sum(1 for i in items if i['rag'] == 'RED'),
        'AMBER': sum(1 for i in items if i['rag'] == 'AMBER'),
        'GREEN': sum(1 for i in items if i['rag'] == 'GREEN'),
    }

    return {
        'success': True,
        'standard': 'ISO 45001:2018 risk-assessment methodology',
        'scoring': 'Likelihood (1-5) x Severity (1-5); RAG: GREEN<8, AMBER 8-14, RED 15-25',
        'project_type': project_type,
        'extras_applied': extras,
        'location': location,
        'register': items,
        'summary': summary,
        'total_items': len(items),
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/safety/risks/categories', methods=['GET'])
    def _risk_categories():
        return jsonify({
            'project_types': ['general'] + list(_PROJECT_EXTRAS.keys()),
            'categories': sorted({r['category'] for r in _BASE_REGISTER}),
            'standards_referenced': sorted({r['standard'] for r in _BASE_REGISTER}),
        })

    @app.route('/api/safety/risks/register', methods=['POST'])
    def _risk_register():
        data = request.get_json(silent=True) or {}
        try:
            out = build_register(
                project_type=str(data.get('project_type', 'general')),
                extras=list(data.get('extras') or []),
                location=(data.get('location') or None),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(out)

    logger.info('Safety risk-register module registered (ISO 45001)')
