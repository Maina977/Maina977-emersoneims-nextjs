"""Seismic analysis -- ASCE 7-22 ELF + EN 1998-1 response spectrum.

Two procedures:

ASCE 7-22 Equivalent Lateral Force (ELF), Section 12.8
------------------------------------------------------
  Cs = SDS / (R/Ie)                         (Eq. 12.8-2)
  Cs <= SD1 / (T * (R/Ie))   for T <= TL    (Eq. 12.8-3)
  Cs >= 0.044 * SDS * Ie   and >= 0.01      (Eq. 12.8-5/6)
  V  = Cs * W                                (Eq. 12.8-1)
  Ta = Ct * hn^x                             (Eq. 12.8-7)

EN 1998-1:2004 Horizontal elastic response spectrum, cl. 3.2.2.2
----------------------------------------------------------------
  Type 1 / Type 2 spectrum, soil class A..E
  Period regions:
    0     <= T <= TB :  Se = ag*S*[1 + T/TB*(eta*2.5 - 1)]
    TB    <= T <= TC :  Se = ag*S*eta*2.5
    TC    <= T <= TD :  Se = ag*S*eta*2.5*TC/T
    TD    <= T <= 4s :  Se = ag*S*eta*2.5*TC*TD/T^2
  Design spectrum Sd uses behaviour factor q (cl. 3.2.2.5):
    Sd(T) = ag*S*[2/3 + T/TB*(2.5/q - 2/3)]      0..TB
    Sd(T) = ag*S*2.5/q                            TB..TC
    Sd(T) = max(ag*S*2.5/q*TC/T,    beta*ag)      TC..TD
    Sd(T) = max(ag*S*2.5/q*TC*TD/T^2, beta*ag)    >TD

Every output dict carries the code, clause numbers, intermediate values,
and a disclaimer.
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.seismic')


# ============================================================================
# ASCE 7-22 ELF
# ============================================================================

# Table 12.2-1 (excerpt) -- Response Modification Coefficient R for common SFRS
_ASCE_R_DEFAULTS = {
    'special_moment_frame_steel':       8.0,
    'intermediate_moment_frame_steel':  4.5,
    'ordinary_moment_frame_steel':      3.5,
    'special_rc_moment_frame':          8.0,
    'intermediate_rc_moment_frame':     5.0,
    'ordinary_rc_moment_frame':         3.0,
    'special_rc_shear_wall':            5.0,
    'ordinary_rc_shear_wall':           4.0,
    'special_concentric_braced_frame':  6.0,
    'ordinary_concentric_braced_frame': 3.25,
    'bearing_wall_masonry':             2.0,
}

# Table 1.5-2 -- Importance factor Ie by Risk Category
_ASCE_IE = {1: 1.00, 2: 1.00, 3: 1.25, 4: 1.50}

# Table 12.8-2 -- Approximate period parameters Ct, x
_ASCE_CT_X = {
    'steel_moment_frame':    {'Ct': 0.028, 'x': 0.80},   # ft units
    'rc_moment_frame':       {'Ct': 0.016, 'x': 0.90},
    'eccentrically_braced':  {'Ct': 0.030, 'x': 0.75},
    'all_other':             {'Ct': 0.020, 'x': 0.75},
}


def asce_7_22_elf(*, SDS: float, SD1: float, R: float, Ie: float = 1.0,
                   W_kN: float, height_ft: float,
                   structure_type: str = 'all_other',
                   T_user: Optional[float] = None,
                   TL: float = 8.0,
                   stories: int = 1) -> Dict[str, Any]:
    """ASCE 7-22 Equivalent Lateral Force procedure (Section 12.8).

    Parameters
    ----------
    SDS : design spectral response acceleration at short periods (g)
          from ASCE 7 Section 11.4.4 / USGS hazard tool
    SD1 : design spectral response acceleration at 1 s (g)
    R   : response modification coefficient (Table 12.2-1) -- pass numeric
          value or use look-up via `structure_type`
    Ie  : importance factor (Table 1.5-2)
    W_kN : effective seismic weight (kN)
    height_ft : structural height hn (ft)
    structure_type : key in _ASCE_CT_X for approximate-period calculation
    T_user : user-computed fundamental period (s); overrides Ta if supplied
    TL : long-period transition (s); 8 s default for many US sites
    stories : number of stories above base (used for vertical distribution)
    """
    if SDS <= 0 or SD1 <= 0 or R <= 0 or Ie <= 0 or W_kN <= 0 or height_ft <= 0:
        return {'success': False, 'error': 'all numeric inputs must be positive'}
    ct_x = _ASCE_CT_X.get(structure_type, _ASCE_CT_X['all_other'])
    Ct, x_exp = ct_x['Ct'], ct_x['x']

    Ta = Ct * (height_ft ** x_exp)        # Eq. 12.8-7
    T = float(T_user) if T_user else Ta
    if T <= 0:
        return {'success': False, 'error': 'period T must be positive'}

    Cs_max_strength = SDS / (R / Ie)       # Eq. 12.8-2
    if T <= TL:
        Cs_period_cap = SD1 / (T * (R / Ie))   # Eq. 12.8-3
    else:
        Cs_period_cap = SD1 * TL / (T * T * (R / Ie))  # Eq. 12.8-4
    Cs_min_a = max(0.044 * SDS * Ie, 0.01)  # Eq. 12.8-5
    Cs_min_b = 0.5 * 1.0 / (R / Ie) if SD1 >= 0.6 else 0  # Eq. 12.8-6 (S1 proxy)

    Cs = min(Cs_max_strength, Cs_period_cap)
    Cs = max(Cs, Cs_min_a, Cs_min_b)

    V_kN = Cs * W_kN                       # Eq. 12.8-1

    # Vertical distribution exponent k (cl. 12.8.3)
    if T <= 0.5:
        k = 1.0
    elif T >= 2.5:
        k = 2.0
    else:
        k = 1.0 + 0.5 * (T - 0.5) / 2.0    # linear

    # Distribute equally per story for the simplified summary; real code uses
    # wx*hx^k / sum(wi*hi^k).
    story_h_ft = height_ft / max(stories, 1)
    sum_whk = sum((W_kN / stories) * ((i + 1) * story_h_ft) ** k
                   for i in range(stories))
    Fx = []
    for i in range(stories):
        wi = W_kN / stories
        hi = (i + 1) * story_h_ft
        Cvx = (wi * (hi ** k)) / sum_whk if sum_whk > 0 else 0
        Fx.append({'level': i + 1,
                    'height_ft': round(hi, 2),
                    'Cvx': round(Cvx, 4),
                    'Fx_kN': round(Cvx * V_kN, 2)})

    return {
        'success': True,
        'code': 'ASCE 7-22',
        'procedure': 'Equivalent Lateral Force (Section 12.8)',
        'inputs': {
            'SDS': SDS, 'SD1': SD1, 'R': R, 'Ie': Ie,
            'W_kN': W_kN, 'height_ft': height_ft,
            'structure_type': structure_type, 'TL_s': TL, 'stories': stories,
            'T_user': T_user,
        },
        'intermediate': {
            'Ct': Ct, 'x_exp': x_exp,
            'Ta_s': round(Ta, 4),
            'T_used_s': round(T, 4),
            'Cs_strength_cap': round(Cs_max_strength, 4),
            'Cs_period_cap':   round(Cs_period_cap, 4),
            'Cs_min':          round(max(Cs_min_a, Cs_min_b), 4),
            'Cs':              round(Cs, 4),
            'k_exponent':      round(k, 4),
        },
        'base_shear_kN': round(V_kN, 2),
        'vertical_distribution': Fx,
        'clauses': {
            'base_shear':            '12.8-1',
            'Cs_strength':           '12.8-2',
            'Cs_period':             '12.8-3 / 12.8-4',
            'Cs_min':                '12.8-5 / 12.8-6',
            'period_approx':         '12.8-7 (Table 12.8-2)',
            'vertical_distribution': '12.8.3',
            'R_table':               'Table 12.2-1',
            'Ie_table':              'Table 1.5-2',
        },
        'disclaimer': 'ASCE 7-22 ELF computation. Inputs SDS and SD1 must come '
                      'from the USGS Seismic Design Map / Section 11.4 for the '
                      'specific site. Modal Response Spectrum or Response History '
                      'analysis may be required for irregular or tall structures '
                      '(Section 12.6).',
    }


# ============================================================================
# EN 1998-1 elastic & design response spectra
# ============================================================================

# Table 3.2 -- Type 1 spectrum parameters (Ms > 5.5)
_EC8_TYPE1 = {
    'A': {'S': 1.00, 'TB': 0.15, 'TC': 0.40, 'TD': 2.0},
    'B': {'S': 1.20, 'TB': 0.15, 'TC': 0.50, 'TD': 2.0},
    'C': {'S': 1.15, 'TB': 0.20, 'TC': 0.60, 'TD': 2.0},
    'D': {'S': 1.35, 'TB': 0.20, 'TC': 0.80, 'TD': 2.0},
    'E': {'S': 1.40, 'TB': 0.15, 'TC': 0.50, 'TD': 2.0},
}
# Table 3.3 -- Type 2 spectrum parameters (Ms <= 5.5)
_EC8_TYPE2 = {
    'A': {'S': 1.00, 'TB': 0.05, 'TC': 0.25, 'TD': 1.2},
    'B': {'S': 1.35, 'TB': 0.05, 'TC': 0.25, 'TD': 1.2},
    'C': {'S': 1.50, 'TB': 0.10, 'TC': 0.25, 'TD': 1.2},
    'D': {'S': 1.80, 'TB': 0.10, 'TC': 0.30, 'TD': 1.2},
    'E': {'S': 1.60, 'TB': 0.05, 'TC': 0.25, 'TD': 1.2},
}


def _eta(damping_pct: float) -> float:
    # cl. 3.2.2.2(3) -- damping correction factor
    return max(math.sqrt(10.0 / (5.0 + damping_pct)), 0.55)


def en_1998_spectrum(*, ag_g: float, soil_class: str = 'B',
                     spectrum_type: int = 1,
                     damping_pct: float = 5.0,
                     q: Optional[float] = None,
                     beta: float = 0.2,
                     periods_s: Optional[List[float]] = None) -> Dict[str, Any]:
    """Compute EN 1998-1 horizontal elastic Se(T) and design Sd(T) spectra.

    Parameters
    ----------
    ag_g : design ground acceleration on type A ground (g) -- ag = gI * agR
    soil_class : 'A' .. 'E' per Table 3.1
    spectrum_type : 1 (Ms > 5.5) or 2 (Ms <= 5.5)
    damping_pct : viscous damping ratio (%); 5 default
    q : behaviour factor for Sd(T); if None, only elastic Se is returned
    beta : lower bound factor for design spectrum (cl. 3.2.2.5(4)P), 0.2 default
    periods_s : optional explicit period list; default 0..4s in 0.05s steps
    """
    soil_class = soil_class.upper()
    table = _EC8_TYPE1 if spectrum_type == 1 else _EC8_TYPE2
    if soil_class not in table:
        return {'success': False, 'error': f'invalid soil class {soil_class!r}'}
    if ag_g <= 0:
        return {'success': False, 'error': 'ag must be positive'}

    p = table[soil_class]
    S, TB, TC, TD = p['S'], p['TB'], p['TC'], p['TD']
    g = 9.81  # m/s^2
    ag = ag_g * g
    eta = _eta(damping_pct)

    if periods_s is None:
        periods_s = [round(0.05 * i, 3) for i in range(0, 81)]  # 0..4 s

    Se: List[Dict[str, float]] = []
    Sd: List[Dict[str, float]] = []
    for T in periods_s:
        # Elastic
        if T < 0:
            continue
        if T <= TB:
            se = ag * S * (1 + (T / TB) * (eta * 2.5 - 1)) if TB > 0 else ag * S
        elif T <= TC:
            se = ag * S * eta * 2.5
        elif T <= TD:
            se = ag * S * eta * 2.5 * (TC / T) if T > 0 else 0
        else:
            se = ag * S * eta * 2.5 * (TC * TD / (T * T)) if T > 0 else 0
        Se.append({'T_s': T, 'Se_m_s2': round(se, 4), 'Se_g': round(se / g, 4)})

        if q and q > 0:
            if T <= TB:
                sd = ag * S * (2.0 / 3.0 + (T / TB) * (2.5 / q - 2.0 / 3.0)) if TB > 0 else ag * S * (2.0 / 3.0)
            elif T <= TC:
                sd = ag * S * 2.5 / q
            elif T <= TD:
                sd = max(ag * S * 2.5 / q * (TC / T), beta * ag) if T > 0 else beta * ag
            else:
                sd = max(ag * S * 2.5 / q * (TC * TD / (T * T)), beta * ag) if T > 0 else beta * ag
            Sd.append({'T_s': T, 'Sd_m_s2': round(sd, 4), 'Sd_g': round(sd / g, 4)})

    return {
        'success': True,
        'code': 'EN 1998-1:2004',
        'procedure': 'Horizontal response spectrum, cl. 3.2.2.2 / 3.2.2.5',
        'inputs': {
            'ag_g': ag_g, 'soil_class': soil_class,
            'spectrum_type': spectrum_type,
            'damping_pct': damping_pct, 'q': q, 'beta': beta,
        },
        'parameters': {'S': S, 'TB_s': TB, 'TC_s': TC, 'TD_s': TD,
                        'eta': round(eta, 4), 'ag_m_s2': round(ag, 4)},
        'elastic_spectrum': Se,
        'design_spectrum': Sd if q else [],
        'clauses': {
            'elastic_spectrum': '3.2.2.2',
            'design_spectrum':  '3.2.2.5',
            'soil_table':       'Table 3.1 / 3.2 / 3.3',
            'damping_factor':   '3.2.2.2(3) Eq. 3.6',
        },
        'disclaimer': 'EN 1998-1 horizontal response spectrum. ag must be from '
                      'the National Annex hazard map for the project site. '
                      'Behaviour factor q must reflect ductility class, regularity, '
                      'and structural system per cl. 5.2.2.2 (concrete) / 6.3.2 '
                      '(steel). Vertical spectrum (cl. 3.2.2.3) not included.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/loads/seismic/asce7-elf', methods=['POST'])
    def _asce_elf():
        data = request.get_json(silent=True) or {}
        try:
            result = asce_7_22_elf(
                SDS=float(data.get('SDS', 0)),
                SD1=float(data.get('SD1', 0)),
                R=float(data.get('R', 0)),
                Ie=float(data.get('Ie', 1.0)),
                W_kN=float(data.get('W_kN', 0)),
                height_ft=float(data.get('height_ft', 0)),
                structure_type=str(data.get('structure_type', 'all_other')),
                T_user=(float(data['T_user']) if data.get('T_user') else None),
                TL=float(data.get('TL', 8.0)),
                stories=int(data.get('stories', 1)),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(result), (200 if result.get('success') else 400)

    @app.route('/api/loads/seismic/eurocode8', methods=['POST'])
    def _ec8_spectrum():
        data = request.get_json(silent=True) or {}
        try:
            result = en_1998_spectrum(
                ag_g=float(data.get('ag_g', 0)),
                soil_class=str(data.get('soil_class', 'B')),
                spectrum_type=int(data.get('spectrum_type', 1)),
                damping_pct=float(data.get('damping_pct', 5.0)),
                q=(float(data['q']) if data.get('q') else None),
                beta=float(data.get('beta', 0.2)),
                periods_s=data.get('periods_s'),
            )
        except (TypeError, ValueError) as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(result), (200 if result.get('success') else 400)

    @app.route('/api/loads/seismic/r-table', methods=['GET'])
    def _r_table():
        return jsonify({'success': True,
                         'R_defaults': _ASCE_R_DEFAULTS,
                         'reference': 'ASCE 7-22 Table 12.2-1 (extract)'})

    logger.info('Seismic module registered (ASCE 7-22 ELF + EN 1998-1)')
