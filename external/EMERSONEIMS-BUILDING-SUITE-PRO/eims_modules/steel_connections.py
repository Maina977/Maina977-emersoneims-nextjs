"""Steel connection design to EN 1993-1-8:2005 (Eurocode 3, Part 1-8).

Implements:
  * Bolt shear & bearing resistance (cl. 3.6.1, Table 3.4)
  * Bolt tension resistance (cl. 3.6.1)
  * Combined shear + tension (cl. 3.6.1(2), Table 3.4)
  * Fillet weld resistance per unit length (cl. 4.5.3.3, simplified method)
  * Column base plate -- bearing on concrete (cl. 6.2.5)

Material partial factors (cl. 2.2):
  gM2 = 1.25  (bolts, welds)
  gM0 = 1.0   (cross-sections)
  gC  = 1.5   (concrete, EN 1992)
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict

logger = logging.getLogger('eims.steel')

_GM2 = 1.25
_GM0 = 1.0

# Table 3.1 -- bolt grades (fyb, fub in MPa)
_BOLT_GRADES = {
    '4.6': {'fyb': 240, 'fub': 400},
    '5.6': {'fyb': 300, 'fub': 500},
    '8.8': {'fyb': 640, 'fub': 800},
    '10.9': {'fyb': 900, 'fub': 1000},
}

# Bolt tensile stress area (mm^2) -- standard ISO metric coarse
_BOLT_AS = {
    'M12': 84.3, 'M16': 157, 'M20': 245, 'M22': 303,
    'M24': 353, 'M27': 459, 'M30': 561, 'M36': 817,
}
_BOLT_A = {  # gross area
    'M12': 113, 'M16': 201, 'M20': 314, 'M22': 380,
    'M24': 452, 'M27': 572, 'M30': 706, 'M36': 1018,
}


def bolt_capacity(*, designation: str = 'M20', grade: str = '8.8',
                   shear_planes: int = 1, threads_in_shear: bool = True,
                   t_ply_mm: float = 10.0, fu_ply_MPa: float = 410.0,
                   e1_mm: float = 30.0, p1_mm: float = 60.0,
                   d_hole_mm: float = 22.0,
                   Fv_Ed_kN: float = 0.0, Ft_Ed_kN: float = 0.0) -> Dict[str, Any]:
    """Single-bolt resistance: shear, bearing, tension, combined.

    Returns Fv,Rd / Fb,Rd / Ft,Rd in kN with utilizations.
    """
    if designation not in _BOLT_AS or grade not in _BOLT_GRADES:
        return {'success': False,
                 'error': f'unknown bolt {designation}/{grade}'}
    if t_ply_mm <= 0 or fu_ply_MPa <= 0:
        return {'success': False, 'error': 'ply thickness/fu must be positive'}

    g = _BOLT_GRADES[grade]
    fub = g['fub']
    A_s = _BOLT_AS[designation]
    A = _BOLT_A[designation]
    d = float(designation[1:])  # nominal diameter (mm)

    # Shear -- alpha_v depends on grade & threads in shear plane
    if threads_in_shear:
        alpha_v = 0.6 if grade in ('4.6', '5.6', '8.8') else 0.5
        A_v = A_s
    else:
        alpha_v = 0.6
        A_v = A
    Fv_Rd_N = alpha_v * fub * A_v / _GM2 * shear_planes
    Fv_Rd_kN = Fv_Rd_N / 1e3

    # Bearing -- Table 3.4
    alpha_d_end = e1_mm / (3.0 * d_hole_mm)
    alpha_d_inner = p1_mm / (3.0 * d_hole_mm) - 0.25
    alpha_b = min(alpha_d_end, alpha_d_inner, fub / fu_ply_MPa, 1.0)
    k1 = 2.5  # for end-bolt; conservative for inner
    Fb_Rd_N = k1 * alpha_b * fu_ply_MPa * d * t_ply_mm / _GM2
    Fb_Rd_kN = Fb_Rd_N / 1e3

    # Tension
    k2 = 0.9  # standard countersunk = 0.63
    Ft_Rd_N = k2 * fub * A_s / _GM2
    Ft_Rd_kN = Ft_Rd_N / 1e3

    util_v = Fv_Ed_kN / Fv_Rd_kN if Fv_Rd_kN > 0 else 0
    util_b = Fv_Ed_kN / Fb_Rd_kN if Fb_Rd_kN > 0 else 0
    util_t = Ft_Ed_kN / Ft_Rd_kN if Ft_Rd_kN > 0 else 0
    # Combined (Table 3.4): Fv/Fv,Rd + Ft/(1.4*Ft,Rd) <= 1
    util_combined = util_v + util_t / 1.4

    return {
        'success': True, 'code': 'EN 1993-1-8:2005', 'check': 'bolt',
        'inputs': {'designation': designation, 'grade': grade,
                    'shear_planes': shear_planes,
                    'threads_in_shear': threads_in_shear,
                    't_ply_mm': t_ply_mm, 'fu_ply_MPa': fu_ply_MPa,
                    'e1_mm': e1_mm, 'p1_mm': p1_mm, 'd_hole_mm': d_hole_mm,
                    'Fv_Ed_kN': Fv_Ed_kN, 'Ft_Ed_kN': Ft_Ed_kN},
        'intermediate': {'fub_MPa': fub, 'A_s_mm2': A_s, 'A_mm2': A,
                          'alpha_v': alpha_v, 'alpha_b': round(alpha_b, 3),
                          'k1': k1, 'k2': k2},
        'Fv_Rd_kN': round(Fv_Rd_kN, 2),
        'Fb_Rd_kN': round(Fb_Rd_kN, 2),
        'Ft_Rd_kN': round(Ft_Rd_kN, 2),
        'utilization': {'shear': round(util_v, 3),
                         'bearing': round(util_b, 3),
                         'tension': round(util_t, 3),
                         'combined_shear_tension': round(util_combined, 3)},
        'pass': bool(max(util_v, util_b, util_t, util_combined) <= 1.0),
        'clauses': {'shear_bearing': 'Table 3.4',
                     'tension':       'Table 3.4',
                     'combined':      '3.6.1(2)'},
        'disclaimer': 'Single-bolt resistance. Group effects, long-joint '
                      '(cl. 3.8), block tearing (cl. 3.10.2), and prying '
                      'action (cl. 6.2.4) not included.',
    }


def fillet_weld_capacity(*, throat_a_mm: float, length_L_mm: float,
                          fu_MPa: float = 410.0, beta_w: float = 0.85,
                          F_Ed_kN_per_mm: float = 0.0) -> Dict[str, Any]:
    """Fillet weld resistance per unit length, simplified method (cl. 4.5.3.3).

    fvw,d = fu / (sqrt(3) * beta_w * gM2)
    Fw,Rd = fvw,d * a   [N per mm length]

    beta_w from Table 4.1: S235=0.80, S275=0.85, S355=0.90, S420=1.00, S460=1.00
    """
    if throat_a_mm <= 0 or length_L_mm <= 0 or fu_MPa <= 0 or beta_w <= 0:
        return {'success': False, 'error': 'positive geometry & fu required'}
    fvw_d = fu_MPa / (math.sqrt(3) * beta_w * _GM2)
    Fw_Rd_per_mm_N = fvw_d * throat_a_mm
    Fw_Rd_per_mm_kN = Fw_Rd_per_mm_N / 1e3
    Fw_Rd_total_kN = Fw_Rd_per_mm_kN * length_L_mm
    util = F_Ed_kN_per_mm / Fw_Rd_per_mm_kN if Fw_Rd_per_mm_kN > 0 else 0
    return {
        'success': True, 'code': 'EN 1993-1-8:2005', 'check': 'fillet_weld',
        'inputs': {'throat_a_mm': throat_a_mm, 'length_L_mm': length_L_mm,
                    'fu_MPa': fu_MPa, 'beta_w': beta_w,
                    'F_Ed_kN_per_mm': F_Ed_kN_per_mm},
        'intermediate': {'fvw_d_MPa': round(fvw_d, 3)},
        'Fw_Rd_kN_per_mm': round(Fw_Rd_per_mm_kN, 4),
        'Fw_Rd_total_kN':  round(Fw_Rd_total_kN, 2),
        'utilization': round(util, 3),
        'pass': bool(util <= 1.0),
        'clauses': {'simplified_method': '4.5.3.3',
                     'beta_w_table':     'Table 4.1'},
        'disclaimer': 'Simplified-method resistance per unit length. The '
                      'directional method (cl. 4.5.3.2) gives less conservative '
                      'results when the load direction relative to the weld is '
                      'known.',
    }


def base_plate_bearing(*, B_mm: float, L_mm: float,
                        fck_MPa: float = 25.0, alpha_cc: float = 0.85,
                        beta_j: float = 2.0 / 3.0,
                        Ned_kN: float = 0.0) -> Dict[str, Any]:
    """Column base-plate concrete bearing (cl. 6.2.5).

        fjd = beta_j * alpha_cc * fck / gC
        NRd = fjd * B * L
    """
    if B_mm <= 0 or L_mm <= 0 or fck_MPa <= 0:
        return {'success': False, 'error': 'positive geometry & fck required'}
    fjd = beta_j * alpha_cc * fck_MPa / 1.5
    Nrd_N = fjd * B_mm * L_mm
    Nrd_kN = Nrd_N / 1e3
    util = Ned_kN / Nrd_kN if Nrd_kN > 0 else 0
    return {
        'success': True, 'code': 'EN 1993-1-8:2005', 'check': 'base_plate',
        'inputs': {'B_mm': B_mm, 'L_mm': L_mm, 'fck_MPa': fck_MPa,
                    'alpha_cc': alpha_cc, 'beta_j': beta_j, 'Ned_kN': Ned_kN},
        'intermediate': {'fjd_MPa': round(fjd, 3)},
        'NRd_kN': round(Nrd_kN, 2),
        'utilization': round(util, 3),
        'pass': bool(util <= 1.0),
        'clauses': {'concentrated_bearing': '6.2.5',
                     'concrete_design':     'EN 1992-1-1 cl. 6.7'},
        'disclaimer': 'Pure axial bearing on grout/concrete. T-stub effective '
                      'area, anchor-bolt design, and uplift resistance verified '
                      'separately (cl. 6.2.6 / 6.2.8).',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    def _f(d, k, default=0.0):
        try:
            return float(d.get(k, default))
        except (TypeError, ValueError):
            raise ValueError(f'parameter {k!r} must be numeric')

    @app.route('/api/steel/bolt', methods=['POST'])
    def _bolt():
        data = request.get_json(silent=True) or {}
        try:
            r = bolt_capacity(
                designation=str(data.get('designation', 'M20')),
                grade=str(data.get('grade', '8.8')),
                shear_planes=int(data.get('shear_planes', 1)),
                threads_in_shear=bool(data.get('threads_in_shear', True)),
                t_ply_mm=_f(data, 't_ply_mm', 10),
                fu_ply_MPa=_f(data, 'fu_ply_MPa', 410),
                e1_mm=_f(data, 'e1_mm', 30),
                p1_mm=_f(data, 'p1_mm', 60),
                d_hole_mm=_f(data, 'd_hole_mm', 22),
                Fv_Ed_kN=_f(data, 'Fv_Ed_kN', 0),
                Ft_Ed_kN=_f(data, 'Ft_Ed_kN', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/steel/weld', methods=['POST'])
    def _weld():
        data = request.get_json(silent=True) or {}
        try:
            r = fillet_weld_capacity(
                throat_a_mm=_f(data, 'throat_a_mm', 5),
                length_L_mm=_f(data, 'length_L_mm', 100),
                fu_MPa=_f(data, 'fu_MPa', 410),
                beta_w=_f(data, 'beta_w', 0.85),
                F_Ed_kN_per_mm=_f(data, 'F_Ed_kN_per_mm', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/steel/baseplate', methods=['POST'])
    def _baseplate():
        data = request.get_json(silent=True) or {}
        try:
            r = base_plate_bearing(
                B_mm=_f(data, 'B_mm', 300), L_mm=_f(data, 'L_mm', 300),
                fck_MPa=_f(data, 'fck_MPa', 25),
                alpha_cc=_f(data, 'alpha_cc', 0.85),
                beta_j=_f(data, 'beta_j', 2.0 / 3.0),
                Ned_kN=_f(data, 'Ned_kN', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/steel/bolt-grades', methods=['GET'])
    def _grades():
        return jsonify({'success': True,
                         'bolt_grades': _BOLT_GRADES,
                         'bolt_areas': _BOLT_AS,
                         'reference': 'EN 1993-1-8 Table 3.1 + ISO metric coarse'})

    logger.info('Steel-connection module registered (EN 1993-1-8)')
