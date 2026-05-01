"""
Safe method-statement library (SMS / SWMS).

Returns structured method statements for common construction tasks,
modelled on UK HSE templates + OSHA 1926 task-specific guidance. All
content is drawn from public standards; no copyrighted material.

No external APIs.
"""
from __future__ import annotations
from typing import Any
import logging
from datetime import date

logger = logging.getLogger('eims')

_LIBRARY: dict[str, dict[str, Any]] = {
    'scaffolding_erect': {
        'title': 'Erection of Tube & Fitting Scaffolding',
        'standard': 'BS EN 12811-1:2003; TG20:21; HSE CIS49',
        'scope': 'Erecting independent tied scaffolding up to 30 m with working platforms.',
        'competence': ['CISRS Advanced scaffolder', 'CISRS Basic scaffolder'],
        'ppe': ['Safety helmet', 'Safety harness with 2 lanyards', 'Steel-toe boots',
                'Hi-vis vest', 'Cut-resistant gloves'],
        'equipment': ['Scaffold tubes + fittings (TG20 compliant)',
                      'Base plates + sole boards',
                      'Working platforms / toe boards',
                      'Gin wheel + rope'],
        'steps': [
            'Survey ground bearing capacity; lay sole boards if < 150 kPa.',
            'Set baseplates; first lift of standards plumbed to 1:200.',
            'Install ledgers + transoms; fit right-angle couplers.',
            'Install ties to structure every 4 m vertical / 6 m horizontal.',
            'Install working platform with toe boards + double guardrail 950 + 470 mm.',
            'Fit diagonal bracing per TG20.',
            'Tag scaffold green only after independent inspection.',
        ],
        'hazards': ['Fall from height', 'Falling objects', 'Collapse', 'Manual handling'],
        'emergency': 'Rescue-at-height plan + trained rescuer on site at all times.',
    },
    'excavation_trench': {
        'title': 'Trench Excavation (1.2–6 m deep)',
        'standard': 'HSE HSG47; BS 6031:2009; OSHA 29 CFR 1926 Sub P',
        'scope': 'Mechanical excavation of service trenches or foundation trenches.',
        'competence': ['CPCS 360 operator', 'NVQ L2 Groundworker', 'Supervisor SMSTS'],
        'ppe': ['Safety helmet', 'Hi-vis', 'Steel-toe boots', 'Gloves', 'Face shield if breaking'],
        'equipment': ['Excavator + experienced operator', 'Trench shoring boxes',
                      'CAT & Genny scanner', 'Laser level', 'Barriers'],
        'steps': [
            'PTW review; CAT scan marked; call-before-dig confirmation held.',
            'Exclusion zone 3 m around excavator swing.',
            'Spoil deposited > 0.6 m from edge; battered 1:1 (soft) to 3:1 (soft clay).',
            'Trench shoring installed at 1.2 m depth per HSG47.',
            'Daily inspection by competent person; entries recorded.',
            'Access via ladder within 7.5 m of any point.',
            'On break of services: stop, withdraw, notify utility immediately.',
        ],
        'hazards': ['Collapse / buried alive', 'Striking services',
                    'Falls into trench', 'Mobile plant strike'],
        'emergency': 'Trench-rescue training; 999 call + utility emergency numbers posted.',
    },
    'work_at_height': {
        'title': 'Work at Height (general)',
        'standard': 'Work at Height Regulations 2005; HSE INDG401',
        'scope': 'Any work where a person could fall a distance liable to cause injury.',
        'competence': ['IPAF PAL card if MEWP', 'PASMA if mobile tower', 'Harness user training'],
        'ppe': ['Safety helmet with chin strap', 'Full-body harness',
                'Shock-absorbing lanyard', 'Non-slip boots'],
        'equipment': ['MEWP / tower / fixed scaffold',
                      'Independent anchor rated > 12 kN',
                      'Rescue kit on site'],
        'steps': [
            'Hierarchy applied: avoid → prevent → minimise.',
            'MEWP preferred over ladder where reasonably practicable.',
            'Harness attached to anchor point at all times in MEWP.',
            'Ladder only for < 30 min light work; 3 points of contact.',
            'Exclusion zone below work area.',
            'Weather stop: wind > 15 m/s, lightning, icy surfaces.',
        ],
        'hazards': ['Falls', 'Dropped objects', 'Collision with overhead', 'Wind'],
        'emergency': 'Rescue plan: suspension trauma management within 15 min.',
    },
    'hot_work': {
        'title': 'Hot Work (welding / cutting / grinding)',
        'standard': 'FM Global DS 10-3; NFPA 51B; HSE HSG250',
        'scope': 'Any operation producing sparks, flame, or surface > 400 degC.',
        'competence': ['Qualified welder', 'Fire watch trained'],
        'ppe': ['Welding helmet + filter shade to task',
                'Fire-retardant overalls', 'Welding gauntlets', 'Steel-toe boots'],
        'equipment': ['Fire blanket', 'Extinguisher (CO2 + dry powder) within 3 m',
                      'Spark-containment screens'],
        'steps': [
            'Hot-work permit issued and displayed.',
            'Combustibles removed to 10 m or covered with FR blanket.',
            'Fire watch posted during work AND 60 min after.',
            'Adequate ventilation / extraction (LEV if confined).',
            'Isolate fire detection if required (permit records this).',
            'Cancel permit + post-work inspection before leaving.',
        ],
        'hazards': ['Fire', 'Explosion in confined space', 'Fume inhalation',
                    'UV / arc-eye', 'Burns'],
        'emergency': 'Extinguisher use; 999 for any fire > 1 m; evacuation sounder.',
    },
    'confined_space': {
        'title': 'Confined Space Entry',
        'standard': 'Confined Spaces Regulations 1997; HSE L101',
        'scope': 'Entry into manholes, tanks, shafts, voids with restricted access + specified risks.',
        'competence': ['CSCS + confined space medium-risk training',
                       'Entry supervisor competent'],
        'ppe': ['Full-body harness + recovery line',
                'Multi-gas detector (O2, LEL, CO, H2S) on entrant',
                'Torch', 'Two-way radio'],
        'equipment': ['Tripod + winch', 'Forced ventilation fan', 'BA if specified'],
        'steps': [
            'Risk assessment identifies specified risks + justifies entry.',
            'Pre-entry atmospheric test from outside (probe at low/mid/high).',
            'Atmosphere within: 19.5-23.5% O2, <10% LEL, CO <30 ppm, H2S <5 ppm.',
            'Forced ventilation > 20 min before entry + continuous during.',
            'Top-man with radio + tripod rescue; no top-man = no entry.',
            'Permit time-limited; reauthorise after any break > 30 min.',
        ],
        'hazards': ['Asphyxiation', 'Toxic atmosphere', 'Flammable atmosphere',
                    'Engulfment', 'Entrapment'],
        'emergency': 'Rescue by top-man using tripod winch; BA team on stand-by; never enter to rescue without BA.',
    },
    'lifting_operation': {
        'title': 'Lifting Operation (mobile crane)',
        'standard': 'LOLER 1998; BS 7121-3:2017; CPA Lift Plan',
        'scope': 'Lifting operations using mobile crane up to 100 t capacity.',
        'competence': ['Appointed Person (AP)', 'CPCS crane operator',
                       'CPCS slinger-signaller'],
        'ppe': ['Helmet', 'Hi-vis', 'Steel-toe boots', 'Gloves'],
        'equipment': ['Mobile crane with valid thorough examination',
                      'Certified slings + shackles', 'Outrigger mats',
                      'Tag lines'],
        'steps': [
            'Lift plan signed off by AP; includes load weight, CoG, crane position.',
            'Ground bearing capacity verified; mats sized to pressure.',
            'Pre-lift checks: crane certificate, slings, weather, exclusion zone.',
            'Test lift: 100 mm off ground for 1 min to check stability.',
            'Dual-lift requires rigorous coordination — not covered here.',
            'Weather stop: wind > 10 m/s load, > 12 m/s empty boom.',
        ],
        'hazards': ['Load drop', 'Crane tip-over', 'Struck by load',
                    'Overhead line contact'],
        'emergency': 'Stop-work authority for any worker; incident reporting within 24 h.',
    },
    'demolition_soft_strip': {
        'title': 'Soft-strip Demolition (pre-2000 building)',
        'standard': 'BS 6187:2011; CAR 2012 for asbestos',
        'scope': 'Non-structural strip-out of finishes + M&E prior to demolition.',
        'competence': ['CCDO / demolition operative',
                       'UKATA asbestos awareness minimum'],
        'ppe': ['Helmet', 'FFP3 mask (RPE if asbestos)', 'Disposable coveralls',
                'Steel-toe boots', 'Goggles'],
        'equipment': ['Hand tools + low-vibration breakers',
                      'Segregation skips', 'Dust-suppression water spray'],
        'steps': [
            'R&D asbestos survey reviewed; any suspect materials left in-situ + marked.',
            'Services isolated and locked off (electrical, gas, water).',
            'Dust suppression continuous; M-class vacuum at source.',
            'Waste segregated: gypsum, metal, wood, hazardous.',
            'Sequential top-down strip, never undermine overheads.',
            'Daily clean-down of site.',
        ],
        'hazards': ['Asbestos exposure', 'Silica dust',
                    'Unexpected live service', 'Falls / sharps'],
        'emergency': 'On unexpected ACM discovery: STOP, evacuate, contact asbestos surveyor.',
    },
}


def _statement(key: str, project_ref: str | None, site: str | None) -> dict[str, Any]:
    if key not in _LIBRARY:
        raise ValueError(f'unknown method statement: {key} (available: {", ".join(sorted(_LIBRARY))})')
    doc = dict(_LIBRARY[key])
    doc['id'] = key
    doc['project_ref'] = project_ref or 'N/A'
    doc['site'] = site or 'N/A'
    doc['issued'] = date.today().isoformat()
    doc['revision'] = 'A'
    doc['disclaimer'] = (
        'This method statement is a baseline template. It must be reviewed + '
        'site-specific-risks added by the Principal Contractor before issue.'
    )
    return doc


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/safety/methods/catalog', methods=['GET'])
    def _ms_catalog():
        return jsonify({
            'success': True,
            'count': len(_LIBRARY),
            'statements': [{'id': k, 'title': v['title'], 'standard': v['standard']}
                           for k, v in _LIBRARY.items()],
        })

    @app.route('/api/safety/methods/generate', methods=['POST'])
    def _ms_generate():
        data = request.get_json(silent=True) or {}
        key = str(data.get('id') or '').strip()
        if not key:
            return jsonify({'success': False, 'error': 'id required'}), 400
        try:
            doc = _statement(key, data.get('project_ref'), data.get('site'))
        except ValueError as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify({'success': True, 'statement': doc})

    logger.info('Method-statement module registered (7 templates: HSE/OSHA/NFPA-based)')
