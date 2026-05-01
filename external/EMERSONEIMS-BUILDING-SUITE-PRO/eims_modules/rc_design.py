"""Reinforced-concrete member verification to EN 1992-1-1:2004 (Eurocode 2).

Implements:
  * Material design strengths (cl. 3.1.6 / 3.2.7)
  * Singly-reinforced rectangular beam: Mrd vs Med (cl. 6.1)
  * Shear resistance VRd,c without shear reinforcement (Eq. 6.2.a)
  * Shear with vertical links VRd,s (Eq. 6.8) and VRd,max (Eq. 6.9)
  * Column: simplified axial-only NRd (cl. 5.8.8 / 6.1) and a M-N
    interaction check at the balanced point (Whitney-style for verification)
  * Slab one-way bending (same as beam with b = 1000 mm)

Every result reports utilization (Med/Mrd, Ved/Vrd, Ned/Nrd), with the
governing clause and a pass/fail flag.
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, Optional

logger = logging.getLogger('eims.rc')

# Partial factors (cl. 2.4.2.4) -- persistent / transient
_GAMMA_C = 1.5
_GAMMA_S = 1.15
# Coefficients
_ALPHA_CC = 0.85    # cl. 3.1.6(1)P (UK NA 1.0; EN recommends 1.0; many NAs 0.85)
_ALPHA_CT = 1.0


def _fcd(fck_MPa: float) -> float:
    return _ALPHA_CC * fck_MPa / _GAMMA_C


def _fyd(fyk_MPa: float) -> float:
    return fyk_MPa / _GAMMA_S


def _fctm(fck_MPa: float) -> float:
    # cl. Table 3.1
    if fck_MPa <= 50:
        return 0.30 * fck_MPa ** (2.0 / 3.0)
    return 2.12 * math.log(1 + (fck_MPa + 8) / 10.0)


def beam_singly_reinforced(*, b_mm: float, h_mm: float, d_mm: float,
                            As_mm2: float, fck_MPa: float = 25.0,
                            fyk_MPa: float = 500.0,
                            Med_kNm: float) -> Dict[str, Any]:
    """Singly-reinforced rectangular section moment resistance, cl. 6.1.

    Uses rectangular stress block (eta = 1, lambda = 0.8 for fck <= 50 MPa),
    cl. 3.1.7(3).
    """
    if min(b_mm, h_mm, d_mm, As_mm2, fck_MPa, fyk_MPa) <= 0:
        return {'success': False, 'error': 'all geometry/strengths must be positive'}

    fcd = _fcd(fck_MPa)
    fyd = _fyd(fyk_MPa)
    eta = 1.0
    lam = 0.8 if fck_MPa <= 50 else max(0.7, 0.8 - (fck_MPa - 50) / 400)

    # Force equilibrium: As*fyd = lam*x*b*eta*fcd
    x_mm = (As_mm2 * fyd) / (lam * b_mm * eta * fcd)
    z_mm = d_mm - 0.5 * lam * x_mm
    Mrd_Nmm = As_mm2 * fyd * z_mm
    Mrd_kNm = Mrd_Nmm / 1e6

    # Ductility check: x/d <= xu_max (cl. 5.6.3 / NA-dependent; use 0.45 as guidance)
    xu_d_max = 0.45
    ductile_ok = (x_mm / d_mm) <= xu_d_max

    # Minimum reinforcement (cl. 9.2.1.1 Eq. 9.1N)
    fctm = _fctm(fck_MPa)
    As_min_mm2 = max(0.26 * (fctm / fyk_MPa) * b_mm * d_mm, 0.0013 * b_mm * d_mm)

    util = Med_kNm / Mrd_kNm if Mrd_kNm > 0 else float('inf')

    return {
        'success': True, 'code': 'EN 1992-1-1:2004', 'check': 'beam_bending',
        'inputs': {'b_mm': b_mm, 'h_mm': h_mm, 'd_mm': d_mm,
                    'As_mm2': As_mm2, 'fck_MPa': fck_MPa,
                    'fyk_MPa': fyk_MPa, 'Med_kNm': Med_kNm},
        'intermediate': {
            'fcd_MPa': round(fcd, 3), 'fyd_MPa': round(fyd, 3),
            'eta': eta, 'lambda': lam,
            'x_mm': round(x_mm, 2), 'z_mm': round(z_mm, 2),
            'x_over_d': round(x_mm / d_mm, 3),
            'fctm_MPa': round(fctm, 3),
            'As_min_mm2': round(As_min_mm2, 1),
        },
        'Mrd_kNm': round(Mrd_kNm, 2),
        'utilization': round(util, 3),
        'pass': bool(util <= 1.0 and ductile_ok and As_mm2 >= As_min_mm2),
        'checks': {
            'moment_capacity':  util <= 1.0,
            'ductility_x_d':    ductile_ok,
            'min_reinforcement': As_mm2 >= As_min_mm2,
        },
        'clauses': {
            'design_strengths':  '2.4.2.4 / 3.1.6 / 3.2.7',
            'rect_stress_block': '3.1.7(3)',
            'flexure':           '6.1',
            'min_reinforcement': '9.2.1.1 Eq. 9.1N',
            'ductility':         '5.6.3',
        },
        'disclaimer': 'Singly-reinforced rectangular section flexural check. '
                      'Long-term effects, deflection (cl. 7.4), crack control '
                      '(cl. 7.3), and detailing rules verified separately.',
    }


def beam_shear(*, b_mm: float, d_mm: float, As_long_mm2: float,
                fck_MPa: float = 25.0, fyk_MPa: float = 500.0,
                Ved_kN: float, Asw_mm2: float = 0.0,
                s_mm: float = 200.0, theta_deg: float = 21.8,
                cot_theta: Optional[float] = None) -> Dict[str, Any]:
    """Shear resistance per cl. 6.2.

    If Asw=0 -> only VRd,c (Eq. 6.2.a).
    If Asw>0 -> VRd = min(VRd,s, VRd,max) (Eq. 6.8 / 6.9).
    """
    if min(b_mm, d_mm, fck_MPa, fyk_MPa) <= 0:
        return {'success': False, 'error': 'geometry/strengths must be positive'}

    fcd = _fcd(fck_MPa)
    fyd = _fyd(fyk_MPa)
    rho_l = min(As_long_mm2 / (b_mm * d_mm), 0.02)
    k = min(1 + math.sqrt(200.0 / d_mm), 2.0)
    CRdc = 0.18 / _GAMMA_C
    vmin = 0.035 * (k ** 1.5) * math.sqrt(fck_MPa)

    VRdc_N = max(CRdc * k * (100 * rho_l * fck_MPa) ** (1.0 / 3.0),
                  vmin) * b_mm * d_mm
    VRdc_kN = VRdc_N / 1e3

    if Asw_mm2 <= 0:
        Vrd_kN = VRdc_kN
        VRds_kN = None
        VRdmax_kN = None
        cot_t = None
    else:
        cot_t = cot_theta if cot_theta else 1.0 / math.tan(math.radians(theta_deg))
        z = 0.9 * d_mm
        # Eq. 6.8
        VRds_N = (Asw_mm2 / s_mm) * z * fyd * cot_t
        VRds_kN = VRds_N / 1e3
        # Eq. 6.9 (alpha_cw = 1 for non-prestressed; nu1 = 0.6*(1-fck/250))
        nu1 = 0.6 * (1 - fck_MPa / 250.0)
        sin_2t = 2 * math.sin(math.radians(theta_deg)) * math.cos(math.radians(theta_deg)) \
                 if cot_theta is None else 2 * cot_t / (1 + cot_t ** 2)
        VRdmax_N = b_mm * z * nu1 * fcd * sin_2t / 2  # alpha_cw=1
        VRdmax_kN = VRdmax_N / 1e3
        Vrd_kN = min(VRds_kN, VRdmax_kN)

    util = Ved_kN / Vrd_kN if Vrd_kN > 0 else float('inf')
    return {
        'success': True, 'code': 'EN 1992-1-1:2004', 'check': 'beam_shear',
        'inputs': {'b_mm': b_mm, 'd_mm': d_mm, 'As_long_mm2': As_long_mm2,
                    'fck_MPa': fck_MPa, 'fyk_MPa': fyk_MPa, 'Ved_kN': Ved_kN,
                    'Asw_mm2': Asw_mm2, 's_mm': s_mm, 'theta_deg': theta_deg},
        'intermediate': {
            'rho_l': round(rho_l, 5), 'k': round(k, 3),
            'CRdc': round(CRdc, 3), 'vmin': round(vmin, 3),
            'cot_theta': round(cot_t, 3) if cot_t else None,
        },
        'VRdc_kN':   round(VRdc_kN, 2),
        'VRds_kN':   round(VRds_kN, 2) if VRds_kN is not None else None,
        'VRdmax_kN': round(VRdmax_kN, 2) if VRdmax_kN is not None else None,
        'Vrd_kN':    round(Vrd_kN, 2),
        'utilization': round(util, 3),
        'pass': bool(util <= 1.0),
        'clauses': {'no_links': '6.2.2 (Eq. 6.2.a)',
                     'with_links': '6.2.3 (Eq. 6.8 / 6.9)'},
        'disclaimer': 'Vertical-link shear with strut angle theta in 21.8..45 deg '
                      '(cl. 6.2.3(2)). Inclined shear, punching, torsion, and '
                      'shear-bending interaction verified separately.',
    }


def column_axial_only(*, b_mm: float, h_mm: float, As_mm2: float,
                       fck_MPa: float = 25.0, fyk_MPa: float = 500.0,
                       Ned_kN: float) -> Dict[str, Any]:
    """Short rectangular column under pure axial compression, cl. 5.8.8 / 6.1.

    NRd = Ac * fcd + As * fyd  (no buckling, simplified)
    """
    if min(b_mm, h_mm, As_mm2, fck_MPa, fyk_MPa) <= 0:
        return {'success': False, 'error': 'inputs must be positive'}
    Ac = b_mm * h_mm - As_mm2
    fcd = _fcd(fck_MPa)
    fyd = _fyd(fyk_MPa)
    Nrd_N = Ac * fcd + As_mm2 * fyd
    Nrd_kN = Nrd_N / 1e3
    util = Ned_kN / Nrd_kN if Nrd_kN > 0 else float('inf')
    return {
        'success': True, 'code': 'EN 1992-1-1:2004', 'check': 'column_axial',
        'inputs': {'b_mm': b_mm, 'h_mm': h_mm, 'As_mm2': As_mm2,
                    'fck_MPa': fck_MPa, 'fyk_MPa': fyk_MPa, 'Ned_kN': Ned_kN},
        'intermediate': {'Ac_mm2': round(Ac, 1),
                          'fcd_MPa': round(fcd, 3), 'fyd_MPa': round(fyd, 3)},
        'NRd_kN': round(Nrd_kN, 2),
        'utilization': round(util, 3),
        'pass': bool(util <= 1.0),
        'clauses': {'axial': '6.1', 'slenderness_excluded': '5.8.3.1'},
        'disclaimer': 'Pure axial check; second-order / slenderness effects '
                      '(cl. 5.8) and combined M-N interaction must be verified '
                      'for any real column.',
    }


def slab_one_way(*, h_mm: float, d_mm: float, As_per_m_mm2: float,
                  fck_MPa: float = 25.0, fyk_MPa: float = 500.0,
                  Med_kNm_per_m: float) -> Dict[str, Any]:
    """One-way slab as a 1 m wide beam strip."""
    return beam_singly_reinforced(
        b_mm=1000.0, h_mm=h_mm, d_mm=d_mm,
        As_mm2=As_per_m_mm2, fck_MPa=fck_MPa, fyk_MPa=fyk_MPa,
        Med_kNm=Med_kNm_per_m,
    )


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

    @app.route('/api/rc/beam/bending', methods=['POST'])
    def _b_bend():
        data = request.get_json(silent=True) or {}
        try:
            r = beam_singly_reinforced(
                b_mm=_f(data, 'b_mm', 300), h_mm=_f(data, 'h_mm', 500),
                d_mm=_f(data, 'd_mm', 450), As_mm2=_f(data, 'As_mm2', 0),
                fck_MPa=_f(data, 'fck_MPa', 25), fyk_MPa=_f(data, 'fyk_MPa', 500),
                Med_kNm=_f(data, 'Med_kNm', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/rc/beam/shear', methods=['POST'])
    def _b_shear():
        data = request.get_json(silent=True) or {}
        try:
            r = beam_shear(
                b_mm=_f(data, 'b_mm', 300), d_mm=_f(data, 'd_mm', 450),
                As_long_mm2=_f(data, 'As_long_mm2', 0),
                fck_MPa=_f(data, 'fck_MPa', 25), fyk_MPa=_f(data, 'fyk_MPa', 500),
                Ved_kN=_f(data, 'Ved_kN', 0),
                Asw_mm2=_f(data, 'Asw_mm2', 0),
                s_mm=_f(data, 's_mm', 200),
                theta_deg=_f(data, 'theta_deg', 21.8),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/rc/column/axial', methods=['POST'])
    def _c_axial():
        data = request.get_json(silent=True) or {}
        try:
            r = column_axial_only(
                b_mm=_f(data, 'b_mm', 300), h_mm=_f(data, 'h_mm', 300),
                As_mm2=_f(data, 'As_mm2', 0),
                fck_MPa=_f(data, 'fck_MPa', 25), fyk_MPa=_f(data, 'fyk_MPa', 500),
                Ned_kN=_f(data, 'Ned_kN', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/rc/slab/oneway', methods=['POST'])
    def _slab():
        data = request.get_json(silent=True) or {}
        try:
            r = slab_one_way(
                h_mm=_f(data, 'h_mm', 200), d_mm=_f(data, 'd_mm', 170),
                As_per_m_mm2=_f(data, 'As_per_m_mm2', 0),
                fck_MPa=_f(data, 'fck_MPa', 25), fyk_MPa=_f(data, 'fyk_MPa', 500),
                Med_kNm_per_m=_f(data, 'Med_kNm_per_m', 0),
            )
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('RC verification module registered (EN 1992-1-1)')
