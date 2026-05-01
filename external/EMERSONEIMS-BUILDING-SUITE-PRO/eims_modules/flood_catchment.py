"""
Flood / catchment hydrology module (civil engineer tool).

Provides:
  - Rational-method peak runoff (Q = C i A)
  - Kirpich time-of-concentration
  - Detention pond basic sizing

All formulas are in the public domain (original publications 1851-1940).
No external APIs needed -- inputs are site measurements + design rainfall.
"""
from __future__ import annotations
from typing import Any
import math
import logging

logger = logging.getLogger('eims')


# Runoff coefficients (Chow, Maidment, Mays 1988; ASCE 1992)
_RUNOFF_C = {
    'paved':        {'slope_lt_2': 0.80, 'slope_2_to_7': 0.85, 'slope_gt_7': 0.90},
    'concrete':     {'slope_lt_2': 0.80, 'slope_2_to_7': 0.85, 'slope_gt_7': 0.90},
    'roof':         {'slope_lt_2': 0.75, 'slope_2_to_7': 0.85, 'slope_gt_7': 0.90},
    'gravel':       {'slope_lt_2': 0.50, 'slope_2_to_7': 0.60, 'slope_gt_7': 0.70},
    'lawn_clay':    {'slope_lt_2': 0.20, 'slope_2_to_7': 0.25, 'slope_gt_7': 0.35},
    'lawn_sandy':   {'slope_lt_2': 0.10, 'slope_2_to_7': 0.15, 'slope_gt_7': 0.20},
    'woodland':     {'slope_lt_2': 0.10, 'slope_2_to_7': 0.15, 'slope_gt_7': 0.20},
    'cultivated':   {'slope_lt_2': 0.30, 'slope_2_to_7': 0.40, 'slope_gt_7': 0.50},
}


def _pick_c(surface: str, slope_pct: float) -> float:
    if surface not in _RUNOFF_C:
        raise ValueError(f'unknown surface: {surface}. '
                           f'Use one of: {", ".join(_RUNOFF_C.keys())}')
    row = _RUNOFF_C[surface]
    if slope_pct < 2:
        return row['slope_lt_2']
    if slope_pct <= 7:
        return row['slope_2_to_7']
    return row['slope_gt_7']


def kirpich_tc(length_m: float, slope_m_per_m: float) -> dict[str, Any]:
    """Kirpich (1940) time-of-concentration.

    Tc = 0.0195 L^0.77 S^-0.385   (Tc in minutes, L in m, S = ft/ft = m/m)
    """
    if length_m <= 0 or slope_m_per_m <= 0:
        raise ValueError('length_m and slope_m_per_m must be > 0')
    tc_min = 0.0195 * (length_m ** 0.77) * (slope_m_per_m ** -0.385)
    return {
        'method':          'Kirpich (1940)',
        'inputs':          {'L_m': length_m, 'S_m_per_m': slope_m_per_m},
        'Tc_minutes':      round(tc_min, 2),
        'Tc_hours':        round(tc_min / 60.0, 3),
        'caveat':          'Minimum 5 min; cap at 1.5 hr for urban catchments.',
    }


def rational_method(*, area_ha: float, runoff_c: float,
                     rainfall_intensity_mm_hr: float) -> dict[str, Any]:
    """Q = C * i * A / 360  (Q in m3/s, A in ha, i in mm/hr)"""
    if min(area_ha, runoff_c, rainfall_intensity_mm_hr) <= 0:
        raise ValueError('all inputs must be positive')
    if runoff_c > 1:
        raise ValueError('runoff coefficient must be <= 1.0')
    q_m3_s = runoff_c * rainfall_intensity_mm_hr * area_ha / 360.0
    return {
        'method':          'Rational method (Mulvaney 1851; Kuichling 1889)',
        'formula':         'Q = C i A / 360',
        'inputs': {
            'C':                    runoff_c,
            'i_mm_hr':              rainfall_intensity_mm_hr,
            'A_ha':                 area_ha,
        },
        'peak_discharge_m3_s':  round(q_m3_s, 4),
        'peak_discharge_L_s':   round(q_m3_s * 1000, 1),
        'caveat': ('Rational method valid for catchments < 80 ha. '
                    'For larger, use SCS curve-number or unit-hydrograph methods.'),
    }


def composite_catchment(sub_areas: list[dict[str, Any]],
                         rainfall_intensity_mm_hr: float) -> dict[str, Any]:
    """sub_areas: [{'area_ha': ..., 'surface': 'paved'|..., 'slope_pct': ...}, ...]"""
    if not sub_areas:
        raise ValueError('sub_areas empty')
    total_area = 0.0
    weighted_c_num = 0.0
    detail = []
    for sa in sub_areas:
        a = float(sa.get('area_ha', 0) or 0)
        s = str(sa.get('surface', 'paved'))
        slope = float(sa.get('slope_pct', 1) or 1)
        if a <= 0:
            continue
        c = _pick_c(s, slope)
        total_area += a
        weighted_c_num += c * a
        detail.append({'area_ha': a, 'surface': s, 'slope_pct': slope, 'C': c})
    if total_area == 0:
        raise ValueError('total area 0')
    c_composite = weighted_c_num / total_area
    q = rational_method(area_ha=total_area, runoff_c=c_composite,
                         rainfall_intensity_mm_hr=rainfall_intensity_mm_hr)
    return {
        'success': True,
        'sub_areas': detail,
        'total_area_ha': round(total_area, 3),
        'composite_C':   round(c_composite, 3),
        **q,
    }


def detention_pond_sizing(*, peak_inflow_m3_s: float, peak_outflow_m3_s: float,
                           storm_duration_hr: float = 1.0) -> dict[str, Any]:
    """Simplified modified rational method for storage.

    Storage S = 0.5 * (Qp_in - Qp_out) * Tc  (conservative triangular approximation)
    """
    if peak_inflow_m3_s <= 0 or peak_outflow_m3_s < 0:
        raise ValueError('peak_inflow_m3_s > 0 and peak_outflow_m3_s >= 0')
    if peak_outflow_m3_s >= peak_inflow_m3_s:
        return {'success': False,
                 'error': 'peak_outflow >= peak_inflow: no detention needed'}
    duration_s = storm_duration_hr * 3600.0
    volume_m3 = 0.5 * (peak_inflow_m3_s - peak_outflow_m3_s) * duration_s
    return {
        'success': True,
        'method':  'Modified rational method (triangular inflow hydrograph)',
        'inputs':  {'peak_inflow_m3_s': peak_inflow_m3_s,
                    'peak_outflow_m3_s': peak_outflow_m3_s,
                    'storm_duration_hr': storm_duration_hr},
        'storage_volume_m3':        round(volume_m3, 1),
        'recommended_storage_m3':   round(volume_m3 * 1.25, 1),
        'notes': [
            '25% safety factor applied.',
            'For storms > 1 hr: increase storage proportionally.',
            'Verify with hydrograph routing for critical works.',
        ],
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/hydro/tc/kirpich', methods=['POST'])
    def _tc():
        data = request.get_json(silent=True) or {}
        try:
            out = kirpich_tc(
                length_m=float(data.get('length_m', 0) or 0),
                slope_m_per_m=float(data.get('slope_m_per_m', 0) or 0),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify({'success': True, **out})

    @app.route('/api/hydro/rational', methods=['POST'])
    def _rat():
        data = request.get_json(silent=True) or {}
        try:
            if data.get('sub_areas'):
                return jsonify(composite_catchment(
                    data['sub_areas'],
                    float(data.get('rainfall_intensity_mm_hr', 0) or 0)))
            return jsonify({'success': True, **rational_method(
                area_ha=float(data.get('area_ha', 0) or 0),
                runoff_c=float(data.get('runoff_c', 0) or 0),
                rainfall_intensity_mm_hr=float(data.get('rainfall_intensity_mm_hr', 0) or 0),
            )})
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @app.route('/api/hydro/pond', methods=['POST'])
    def _pond():
        data = request.get_json(silent=True) or {}
        try:
            return jsonify(detention_pond_sizing(
                peak_inflow_m3_s=float(data.get('peak_inflow_m3_s', 0) or 0),
                peak_outflow_m3_s=float(data.get('peak_outflow_m3_s', 0) or 0),
                storm_duration_hr=float(data.get('storm_duration_hr', 1.0)),
            ))
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    @app.route('/api/hydro/runoff-coefficients', methods=['GET'])
    def _rc():
        return jsonify({'success': True, 'source': 'Chow et al. 1988; ASCE 1992',
                         'coefficients': _RUNOFF_C})

    logger.info('Flood/catchment hydrology module registered (rational+Kirpich+pond)')
