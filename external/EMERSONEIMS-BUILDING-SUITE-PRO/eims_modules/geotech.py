"""Geotechnical bearing-capacity analysis.

Implements three independent classical methods:

  1. Terzaghi (1943) -- shallow strip/square/circular foundation, general shear
        qu = c*Nc*sc + q*Nq + 0.5*gamma*B*Ng*sg

  2. Meyerhof (1963) -- shape, depth and inclination factors
        qu = c*Nc*sc*dc*ic + q*Nq*sq*dq*iq + 0.5*gamma*B*Ng*sg*dg*ig

  3. Hansen (1970) -- shape, depth, inclination, base & ground factors
        qu = c*Nc*sc*dc*ic*bc*gc + q*Nq*sq*dq*iq*bq*gq
              + 0.5*gamma'*B*Ng*sg*dg*ig*bg*gg

Plus SPT correlations:
  * phi' (Peck-Hanson-Thornburn 1974, after Wolff)
  * Allowable bearing pressure (Meyerhof 1956 / Bowles 1996, settlement-limited
    to 25 mm) for granular soils:
        qa_kPa = 12 * N60 * Kd  (B <= 1.22 m)        (Meyerhof simplified)

All outputs include code/method name, clause/reference, intermediate factors
and a disclaimer.

References
----------
* Terzaghi, K. (1943) "Theoretical Soil Mechanics", Wiley.
* Meyerhof, G.G. (1963) "Some Recent Research on the Bearing Capacity of
  Foundations", Canadian Geotechnical Journal, 1(1).
* Hansen, J.B. (1970) "A Revised and Extended Formula for Bearing Capacity",
  Danish Geotechnical Institute Bulletin No. 28.
* Bowles, J.E. (1996) "Foundation Analysis and Design", 5th ed., McGraw-Hill.
* Peck, R.B., Hanson, W.E., Thornburn, T.H. (1974) "Foundation Engineering",
  2nd ed., Wiley.
* EN 1997-1:2004 (Eurocode 7) -- Annex D for partial-factor verification.
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, Optional

logger = logging.getLogger('eims.geotech')


# ---------- bearing-capacity factors ----------

def bearing_factors(phi_deg: float) -> Dict[str, float]:
    """Return Nq, Nc, Ng (Hansen/Vesic family).

    Nq = e^(pi*tan phi) * tan^2(45 + phi/2)         (Reissner)
    Nc = (Nq - 1) * cot(phi)        ; phi=0 -> Nc=5.14
    Ng = 2*(Nq + 1)*tan(phi)        (Vesic)
    """
    phi = math.radians(phi_deg)
    if phi_deg == 0:
        return {'Nq': 1.0, 'Nc': 5.14, 'Ng': 0.0}
    Nq = math.exp(math.pi * math.tan(phi)) * (math.tan(math.pi / 4 + phi / 2)) ** 2
    Nc = (Nq - 1.0) / math.tan(phi)
    Ng = 2.0 * (Nq + 1.0) * math.tan(phi)
    return {'Nq': Nq, 'Nc': Nc, 'Ng': Ng}


# ---------- shape / depth factors (Meyerhof / Hansen) ----------

def _meyerhof_shape(phi_deg: float, B: float, L: float) -> Dict[str, float]:
    Kp = math.tan(math.radians(45 + phi_deg / 2)) ** 2
    sc = 1 + 0.2 * Kp * (B / L)
    if phi_deg >= 10:
        sq = sg = 1 + 0.1 * Kp * (B / L)
    else:
        sq = sg = 1.0
    return {'sc': sc, 'sq': sq, 'sg': sg}


def _meyerhof_depth(phi_deg: float, B: float, Df: float) -> Dict[str, float]:
    Kp = math.tan(math.radians(45 + phi_deg / 2)) ** 2
    dc = 1 + 0.2 * math.sqrt(Kp) * (Df / B)
    if phi_deg >= 10:
        dq = dg = 1 + 0.1 * math.sqrt(Kp) * (Df / B)
    else:
        dq = dg = 1.0
    return {'dc': dc, 'dq': dq, 'dg': dg}


def _hansen_shape(B: float, L: float, Nq: float, Nc: float) -> Dict[str, float]:
    sc = 1 + (Nq / Nc) * (B / L) if Nc > 0 else 1
    sq = 1 + (B / L) * math.tan(math.radians(0))  # phi-dependent applied below
    sg = 1 - 0.4 * (B / L)
    return {'sc': sc, 'sq': sq, 'sg': max(sg, 0.6)}


def _hansen_depth(B: float, Df: float, phi_deg: float) -> Dict[str, float]:
    k = (Df / B) if Df / B <= 1 else math.atan(Df / B)  # rad if >1
    dc = 1 + 0.4 * k
    phi = math.radians(phi_deg)
    dq = 1 + 2 * math.tan(phi) * (1 - math.sin(phi)) ** 2 * k
    dg = 1.0
    return {'dc': dc, 'dq': dq, 'dg': dg}


# ---------- main method dispatch ----------

def terzaghi(*, c_kPa: float, phi_deg: float, gamma_kN_m3: float,
              B_m: float, Df_m: float,
              shape: str = 'strip') -> Dict[str, Any]:
    """Classical Terzaghi general-shear failure.

    shape: 'strip' / 'square' / 'circular' / 'rectangular' (latter uses B/L=B/B*1.5 default).
    """
    if B_m <= 0 or gamma_kN_m3 <= 0:
        return {'success': False, 'error': 'B and gamma must be positive'}
    f = bearing_factors(phi_deg)
    Nc, Nq, Ng = f['Nc'], f['Nq'], f['Ng']
    # Terzaghi shape factors (cl. classic)
    if shape == 'strip':
        sc, sg = 1.0, 1.0
    elif shape == 'square':
        sc, sg = 1.3, 0.8
    elif shape == 'circular':
        sc, sg = 1.3, 0.6
    else:
        sc, sg = 1.2, 0.85
    q = gamma_kN_m3 * Df_m
    qu = c_kPa * Nc * sc + q * Nq + 0.5 * gamma_kN_m3 * B_m * Ng * sg
    return {
        'success': True, 'method': 'Terzaghi (1943)',
        'inputs': {'c_kPa': c_kPa, 'phi_deg': phi_deg,
                    'gamma_kN_m3': gamma_kN_m3,
                    'B_m': B_m, 'Df_m': Df_m, 'shape': shape},
        'factors': {'Nc': round(Nc, 3), 'Nq': round(Nq, 3), 'Ng': round(Ng, 3),
                     'sc': sc, 'sg': sg, 'q_overburden_kPa': round(q, 3)},
        'qu_kPa': round(qu, 2),
        'qa_FS3_kPa': round(qu / 3.0, 2),
        'reference': 'Terzaghi (1943) Theoretical Soil Mechanics',
        'disclaimer': 'Ultimate bearing pressure for general shear failure on '
                      'homogeneous c-phi soil. Apply factor of safety (typ. 3.0) '
                      'or use Eurocode 7 partial-factor approach for design.',
    }


def meyerhof(*, c_kPa: float, phi_deg: float, gamma_kN_m3: float,
              B_m: float, L_m: float, Df_m: float) -> Dict[str, Any]:
    if B_m <= 0 or L_m <= 0 or gamma_kN_m3 <= 0:
        return {'success': False, 'error': 'B, L and gamma must be positive'}
    f = bearing_factors(phi_deg)
    s = _meyerhof_shape(phi_deg, B_m, L_m)
    d = _meyerhof_depth(phi_deg, B_m, Df_m)
    q = gamma_kN_m3 * Df_m
    qu = (c_kPa * f['Nc'] * s['sc'] * d['dc']
          + q * f['Nq'] * s['sq'] * d['dq']
          + 0.5 * gamma_kN_m3 * B_m * f['Ng'] * s['sg'] * d['dg'])
    return {
        'success': True, 'method': 'Meyerhof (1963)',
        'inputs': {'c_kPa': c_kPa, 'phi_deg': phi_deg,
                    'gamma_kN_m3': gamma_kN_m3,
                    'B_m': B_m, 'L_m': L_m, 'Df_m': Df_m},
        'factors': {**{k: round(v, 3) for k, v in f.items()},
                     **{k: round(v, 3) for k, v in s.items()},
                     **{k: round(v, 3) for k, v in d.items()},
                     'q_overburden_kPa': round(q, 3)},
        'qu_kPa': round(qu, 2),
        'qa_FS3_kPa': round(qu / 3.0, 2),
        'reference': 'Meyerhof (1963) CGJ 1(1)',
        'disclaimer': 'Ultimate bearing pressure with Meyerhof shape & depth '
                      'factors. Inclination factors not applied (vertical load '
                      'assumed). Apply FS or Eurocode 7 partial factors.',
    }


def hansen(*, c_kPa: float, phi_deg: float, gamma_kN_m3: float,
            B_m: float, L_m: float, Df_m: float,
            water_table_below_base_m: Optional[float] = None) -> Dict[str, Any]:
    if B_m <= 0 or L_m <= 0 or gamma_kN_m3 <= 0:
        return {'success': False, 'error': 'B, L and gamma must be positive'}
    f = bearing_factors(phi_deg)
    s = _hansen_shape(B_m, L_m, f['Nq'], f['Nc'])
    # phi-dependent sq override
    s['sq'] = 1 + (B_m / L_m) * math.tan(math.radians(phi_deg))
    d = _hansen_depth(B_m, Df_m, phi_deg)
    # Water-table correction on the gamma term (Bowles 1996)
    g_eff = gamma_kN_m3
    if water_table_below_base_m is not None:
        if water_table_below_base_m <= 0:
            g_eff = gamma_kN_m3 - 9.81  # submerged unit weight
        elif water_table_below_base_m < B_m:
            # Linear interp between submerged (at base) and full (at depth B)
            ratio = water_table_below_base_m / B_m
            g_eff = (gamma_kN_m3 - 9.81) + ratio * 9.81
    q = gamma_kN_m3 * Df_m
    qu = (c_kPa * f['Nc'] * s['sc'] * d['dc']
          + q * f['Nq'] * s['sq'] * d['dq']
          + 0.5 * g_eff * B_m * f['Ng'] * s['sg'] * d['dg'])
    return {
        'success': True, 'method': 'Hansen (1970)',
        'inputs': {'c_kPa': c_kPa, 'phi_deg': phi_deg,
                    'gamma_kN_m3': gamma_kN_m3, 'gamma_eff_kN_m3': round(g_eff, 3),
                    'B_m': B_m, 'L_m': L_m, 'Df_m': Df_m,
                    'water_table_below_base_m': water_table_below_base_m},
        'factors': {**{k: round(v, 3) for k, v in f.items()},
                     **{k: round(v, 3) for k, v in s.items()},
                     **{k: round(v, 3) for k, v in d.items()},
                     'q_overburden_kPa': round(q, 3)},
        'qu_kPa': round(qu, 2),
        'qa_FS3_kPa': round(qu / 3.0, 2),
        'reference': 'Hansen (1970) DGI Bull. 28; Bowles (1996)',
        'disclaimer': 'Ultimate bearing pressure with Hansen shape, depth and '
                      'water-table corrections. Inclination, base-tilt and ground '
                      'factors set to unity. Apply FS or EN 1997-1 partial factors.',
    }


# ---------- SPT correlations ----------

def spt_friction_angle(N60: float) -> Dict[str, Any]:
    """Wolff (1989) regression on Peck-Hanson-Thornburn data.

        phi' = 27.1 + 0.3*N60 - 0.00054*N60^2     [degrees]
    """
    if N60 < 0:
        return {'success': False, 'error': 'N60 must be >= 0'}
    phi = 27.1 + 0.3 * N60 - 0.00054 * N60 ** 2
    return {
        'success': True,
        'method': 'Wolff (1989) regression on Peck-Hanson-Thornburn (1974)',
        'inputs': {'N60': N60},
        'phi_deg': round(phi, 2),
        'reference': 'Wolff, T.F. (1989) "Pile capacity prediction using '
                     'parameter functions", ASCE Geotech. Spec. Pub. 23',
        'disclaimer': 'Empirical correlation; valid for clean sands only. Apply '
                      'overburden correction CN before use if N is uncorrected.',
    }


def spt_allowable_bearing(N60: float, B_m: float, Df_m: float = 0.0,
                           settlement_mm: float = 25.0) -> Dict[str, Any]:
    """Meyerhof (1956) / Bowles (1996) allowable bearing from SPT, settlement-limited.

    For B <= 1.22 m:    qa_kPa = 12 * N60 * Kd * (S/25)
    For B  > 1.22 m:    qa_kPa = 8  * N60 * ((B+0.305)/B)^2 * Kd * (S/25)
    where Kd = 1 + 0.33*Df/B  <= 1.33   (depth factor)
    """
    if N60 < 0 or B_m <= 0 or settlement_mm <= 0:
        return {'success': False, 'error': 'N60>=0, B>0, settlement>0 required'}
    Kd = min(1.0 + 0.33 * Df_m / B_m, 1.33)
    s_factor = settlement_mm / 25.0
    if B_m <= 1.22:
        qa = 12.0 * N60 * Kd * s_factor
    else:
        qa = 8.0 * N60 * ((B_m + 0.305) / B_m) ** 2 * Kd * s_factor
    return {
        'success': True,
        'method': 'Meyerhof (1956) / Bowles (1996), settlement-limited',
        'inputs': {'N60': N60, 'B_m': B_m, 'Df_m': Df_m,
                    'settlement_mm': settlement_mm},
        'intermediate': {'Kd': round(Kd, 3),
                          'settlement_factor': round(s_factor, 3)},
        'qa_kPa': round(qa, 2),
        'reference': 'Meyerhof (1956); Bowles (1996) Foundation Analysis & Design',
        'disclaimer': 'Allowable bearing pressure for granular soils based on '
                      'tolerable settlement. For cohesive soils use undrained '
                      'shear strength with FS=3 against bearing failure.',
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

    @app.route('/api/geotech/bearing/terzaghi', methods=['POST'])
    def _terz():
        data = request.get_json(silent=True) or {}
        try:
            r = terzaghi(c_kPa=_f(data, 'c_kPa'),
                          phi_deg=_f(data, 'phi_deg'),
                          gamma_kN_m3=_f(data, 'gamma_kN_m3', 18.0),
                          B_m=_f(data, 'B_m', 1.0),
                          Df_m=_f(data, 'Df_m', 1.0),
                          shape=str(data.get('shape', 'strip')).lower())
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/geotech/bearing/meyerhof', methods=['POST'])
    def _mey():
        data = request.get_json(silent=True) or {}
        try:
            r = meyerhof(c_kPa=_f(data, 'c_kPa'),
                          phi_deg=_f(data, 'phi_deg'),
                          gamma_kN_m3=_f(data, 'gamma_kN_m3', 18.0),
                          B_m=_f(data, 'B_m', 1.0),
                          L_m=_f(data, 'L_m', 1.0),
                          Df_m=_f(data, 'Df_m', 1.0))
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/geotech/bearing/hansen', methods=['POST'])
    def _han():
        data = request.get_json(silent=True) or {}
        try:
            wt = data.get('water_table_below_base_m')
            wt = float(wt) if wt is not None else None
            r = hansen(c_kPa=_f(data, 'c_kPa'),
                        phi_deg=_f(data, 'phi_deg'),
                        gamma_kN_m3=_f(data, 'gamma_kN_m3', 18.0),
                        B_m=_f(data, 'B_m', 1.0),
                        L_m=_f(data, 'L_m', 1.0),
                        Df_m=_f(data, 'Df_m', 1.0),
                        water_table_below_base_m=wt)
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/geotech/spt/phi', methods=['POST'])
    def _spt_phi():
        data = request.get_json(silent=True) or {}
        try:
            r = spt_friction_angle(_f(data, 'N60'))
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/geotech/spt/bearing', methods=['POST'])
    def _spt_qa():
        data = request.get_json(silent=True) or {}
        try:
            r = spt_allowable_bearing(_f(data, 'N60'),
                                       _f(data, 'B_m', 1.0),
                                       _f(data, 'Df_m', 0.0),
                                       _f(data, 'settlement_mm', 25.0))
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('Geotechnical module registered (Terzaghi/Meyerhof/Hansen + SPT)')
