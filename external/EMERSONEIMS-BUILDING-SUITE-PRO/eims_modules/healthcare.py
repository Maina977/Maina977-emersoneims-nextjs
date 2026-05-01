"""Healthcare compliance — FGI Guidelines + UK HTM checks.

Auditing tool that takes a list of room specs (type, area, doors, pressure
relationship, etc.) and returns a compliance scorecard against:

* **FGI 2022** — Facility Guidelines Institute, Hospital Guidelines (US)
* **HBN 00-09** — Health Building Note (NHS England) infection prevention
* **HTM 03-01** — Specialised ventilation for healthcare premises (UK)
* **HTM 05-02** — Fire safety, compartmentation in healthcare buildings

Anything Revit needs a third-party plugin for; here it's built-in.
"""

from __future__ import annotations

from typing import Any

from eims_modules import logger


# ============================================================================
# Reference tables
# ============================================================================

# FGI 2.2 minimum clear floor area (m²) for select inpatient room types.
# All values converted from sq ft and rounded down to be conservative.
FGI_MIN_AREA_M2 = {
    'patient_room_single':           11.6,   # 125 sf
    'patient_room_multiple':          8.4,   # 90 sf per bed
    'icu_bed_position':              18.6,   # 200 sf
    'nicu_bed_position':              7.4,   # 80 sf
    'operating_room_general':        37.2,   # 400 sf
    'operating_room_orthopaedic':    55.7,   # 600 sf
    'operating_room_cardiac':        55.7,
    'pre_op_holding':                 7.4,
    'post_anesthesia_recovery':       7.4,
    'examination_room':               7.4,
    'treatment_room':                 9.3,   # 100 sf
    'isolation_room_airborne':       11.6,
    'isolation_room_protective':     11.6,
    'ldr_labour_delivery_recovery':  25.1,
    'birthing_room':                 25.1,
    'patient_toilet':                 4.2,   # 45 sf
}

# HTM 03-01 ventilation: air changes per hour and pressure relationship
HTM_03_VENTILATION = {
    'operating_room_general':        {'ach': 25, 'pressure': 'positive', 'min_pa': 10},
    'operating_room_ultraclean':     {'ach': 300, 'pressure': 'positive', 'min_pa': 25},
    'isolation_room_airborne':       {'ach': 12, 'pressure': 'negative', 'min_pa': -5},
    'isolation_room_protective':     {'ach': 12, 'pressure': 'positive', 'min_pa': 10},
    'pharmacy_clean_room':           {'ach': 25, 'pressure': 'positive', 'min_pa': 15},
    'general_ward':                  {'ach':  6, 'pressure': 'neutral',  'min_pa': 0},
    'patient_room_single':           {'ach':  6, 'pressure': 'neutral',  'min_pa': 0},
    'recovery_room':                 {'ach':  6, 'pressure': 'neutral',  'min_pa': 0},
}

# Door clear opening width (mm) — FGI 2.1-7.2.2.4 / HBN 00-04
DOOR_MIN_CLEAR_MM = {
    'patient_room_single':           1118,    # 44 in
    'patient_room_multiple':         1118,
    'icu_bed_position':              1219,    # 48 in (bed transfer)
    'operating_room_general':        1219,
    'operating_room_orthopaedic':    1219,
    'isolation_room_airborne':       1118,
    'general':                        914,    # 36 in default
    'patient_toilet':                 864,    # 34 in min, 813 if assisted
}

# HTM 05-02 — maximum compartment area (m²) for healthcare occupancies
HTM_05_02_MAX_COMPARTMENT_M2 = {
    'inpatient_ward':       2000,
    'outpatient':           3000,
    'critical_care':        1500,
    'operating_suite':      1500,
    'office_admin':         3000,
}


# ============================================================================
# Single-room compliance
# ============================================================================

def check_room(room: dict) -> dict[str, Any]:
    """Audit one room against FGI / HTM. Returns issues and pass flag."""
    rtype = str(room.get('type', '')).lower().strip()
    issues: list[dict] = []

    # ---- Area
    area = float(room.get('area_m2', 0))
    min_area = FGI_MIN_AREA_M2.get(rtype)
    if min_area is not None and area < min_area:
        issues.append({
            'standard': 'FGI 2022 §2.2',
            'severity': 'FAIL',
            'rule': f'Minimum clear floor area for {rtype}',
            'required': f'≥ {min_area} m²',
            'actual':   f'{area:.2f} m²',
            'remediation': f'Increase room area by {min_area - area:.1f} m²',
        })

    # ---- Door clear width
    door_mm = float(room.get('door_clear_mm', 0))
    min_door = DOOR_MIN_CLEAR_MM.get(rtype, DOOR_MIN_CLEAR_MM['general'])
    if door_mm and door_mm < min_door:
        issues.append({
            'standard': 'FGI 2022 §2.1-7.2.2.4',
            'severity': 'FAIL',
            'rule': 'Door clear opening width',
            'required': f'≥ {min_door} mm',
            'actual':   f'{door_mm:.0f} mm',
            'remediation': f'Increase door size to ≥ {min_door} mm',
        })

    # ---- Ventilation (ACH + pressure)
    vent_req = HTM_03_VENTILATION.get(rtype)
    ach = room.get('ach')
    pressure = str(room.get('pressure', '')).lower().strip()
    if vent_req:
        if ach is None or float(ach) < vent_req['ach']:
            issues.append({
                'standard': 'HTM 03-01',
                'severity': 'FAIL',
                'rule': f'Air changes per hour for {rtype}',
                'required': f'≥ {vent_req["ach"]} ACH',
                'actual': f'{ach if ach is not None else "(not specified)"}',
                'remediation': f'Resize AHU / increase supply diffusers to deliver {vent_req["ach"]} ACH',
            })
        if pressure and pressure != vent_req['pressure']:
            issues.append({
                'standard': 'HTM 03-01',
                'severity': 'FAIL',
                'rule': f'Pressure relationship for {rtype}',
                'required': vent_req['pressure'],
                'actual':   pressure,
                'remediation': f'Adjust supply/exhaust balance to achieve {vent_req["pressure"]} pressure',
            })

    # ---- En-suite WC for patient rooms (HBN 00-09)
    if rtype.startswith('patient_room') and not room.get('en_suite_wc', False):
        issues.append({
            'standard': 'HBN 00-09',
            'severity': 'WARN',
            'rule': 'Single-room patient ensuite WC for infection control',
            'required': 'Yes',
            'actual':   'No',
            'remediation': 'Add en-suite WC + shower; if not feasible justify in clinical brief',
        })

    # ---- Hand-wash basin within 2 m of doorway (clinical room)
    clinical_types = {'examination_room', 'treatment_room', 'patient_room_single',
                      'patient_room_multiple', 'isolation_room_airborne',
                      'isolation_room_protective', 'icu_bed_position'}
    if rtype in clinical_types:
        hwb = float(room.get('handwash_distance_m', -1))
        if hwb < 0:
            issues.append({
                'standard': 'HBN 00-09 §6.20',
                'severity': 'WARN',
                'rule': 'Hand-wash basin location not specified',
                'required': '≤ 2 m from doorway',
                'actual':   '(missing)',
                'remediation': 'Locate hand-wash basin within 2 m of door',
            })
        elif hwb > 2.0:
            issues.append({
                'standard': 'HBN 00-09 §6.20',
                'severity': 'FAIL',
                'rule': 'Hand-wash basin distance from doorway',
                'required': '≤ 2 m',
                'actual':   f'{hwb:.1f} m',
                'remediation': 'Relocate hand-wash basin closer to entry door',
            })

    fails = sum(1 for i in issues if i['severity'] == 'FAIL')
    return {
        'room_id': room.get('id', ''),
        'type': rtype,
        'pass': fails == 0,
        'fail_count': fails,
        'warn_count': sum(1 for i in issues if i['severity'] == 'WARN'),
        'issues': issues,
    }


# ============================================================================
# Compartment / fire check (HTM 05-02)
# ============================================================================

def check_compartments(compartments: list[dict]) -> dict[str, Any]:
    issues: list[dict] = []
    for c in compartments:
        usage = str(c.get('usage', '')).lower().strip()
        area = float(c.get('area_m2', 0))
        max_a = HTM_05_02_MAX_COMPARTMENT_M2.get(usage)
        if max_a and area > max_a:
            issues.append({
                'standard': 'HTM 05-02',
                'severity': 'FAIL',
                'rule': f'Max compartment area for {usage}',
                'required': f'≤ {max_a} m²',
                'actual':   f'{area:.0f} m²',
                'compartment_id': c.get('id', ''),
                'remediation': f'Subdivide with 60-min fire-rated compartmentation',
            })
    return {
        'compartments_checked': len(compartments),
        'issues': issues,
    }


# ============================================================================
# Whole-building audit
# ============================================================================

def audit(*, rooms: list[dict] | None = None,
          compartments: list[dict] | None = None) -> dict[str, Any]:
    rooms = rooms or []
    compartments = compartments or []
    room_results = [check_room(r) for r in rooms]
    comp_result = check_compartments(compartments)

    total_fails = sum(r['fail_count'] for r in room_results) + len(comp_result['issues'])
    total_warns = sum(r['warn_count'] for r in room_results)

    score = max(0.0, 100.0 - 5.0 * total_fails - 1.0 * total_warns)
    grade = ('A' if score >= 95 else
             'B' if score >= 85 else
             'C' if score >= 70 else
             'D' if score >= 50 else 'F')

    return {
        'success': True,
        'standards': ['FGI 2022', 'HBN 00-09', 'HTM 03-01', 'HTM 05-02'],
        'rooms_checked': len(rooms),
        'compartments_checked': len(compartments),
        'fail_count': total_fails,
        'warn_count': total_warns,
        'compliance_score': round(score, 1),
        'grade': grade,
        'pass_overall': total_fails == 0,
        'rooms': room_results,
        'compartments': comp_result,
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/healthcare/audit', methods=['POST'])
    def _audit():
        d = request.get_json(silent=True) or {}
        try:
            r = audit(rooms=d.get('rooms'), compartments=d.get('compartments'))
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), 200

    @app.route('/api/healthcare/standards', methods=['GET'])
    def _standards():
        return jsonify({
            'success': True,
            'fgi_min_area_m2': FGI_MIN_AREA_M2,
            'door_min_clear_mm': DOOR_MIN_CLEAR_MM,
            'htm_03_ventilation': HTM_03_VENTILATION,
            'htm_05_02_max_compartment_m2': HTM_05_02_MAX_COMPARTMENT_M2,
        }), 200

    logger.info('healthcare module registered: /api/healthcare/audit, /api/healthcare/standards')
