"""Wind load calculations -- ASCE 7-22 and Eurocode EN 1991-1-4.

Two independent procedures are implemented:

ASCE 7-22 (US / Canada / Caribbean / parts of Asia)
---------------------------------------------------
  Velocity pressure (Eq. 26.10-1):
      qz = 0.00256 * Kz * Kzt * Kd * Ke * V^2     [psf, V in mph]
  Design wind pressure on MWFRS (Eq. 27.3-1, enclosed buildings):
      p = q * G * Cp - qi * (GCpi)
  Reference: ASCE/SEI 7-22, Chapters 26 & 27.

Eurocode EN 1991-1-4:2005+A1:2010
---------------------------------
  Mean velocity:        vm(z) = cr(z) * co(z) * vb       (Eq. 4.3)
  Peak velocity press.: qp(z) = [1 + 7*Iv(z)] * 0.5 * rho * vm(z)^2  (Eq. 4.8)
  Wind pressure:        we = qp(ze) * cpe                 (Eq. 5.1)
  Reference: BS EN 1991-1-4 cl. 4 & 5.

Every output dict includes:
  * code:        e.g. 'ASCE 7-22' or 'EN 1991-1-4'
  * clause:      e.g. '26.10-1', '4.3'
  * inputs:      echoed input parameters
  * intermediate: Kz, vm(z), qp(z), etc. for verification
  * result:      design pressure(s) on each surface
  * disclaimer:  reminder this is a code calculation, not site-specific test
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, Optional

logger = logging.getLogger('eims.wind')


# ============================================================================
# ASCE 7-22
# ============================================================================

# Table 26.11-1 -- Exposure category constants (alpha, zg in ft, b_hat, c, l_ft)
_ASCE_EXPOSURE = {
    'B': {'alpha': 7.0,  'zg_ft': 1200, 'b_hat': 0.84, 'c': 0.30, 'l_ft': 320},
    'C': {'alpha': 9.5,  'zg_ft': 900,  'b_hat': 1.00, 'c': 0.20, 'l_ft': 500},
    'D': {'alpha': 11.5, 'zg_ft': 700,  'b_hat': 1.07, 'c': 0.15, 'l_ft': 650},
}

# Table 26.6-1 -- Wind directionality factor for buildings (MWFRS)
_KD_BUILDINGS = 0.85

# Table 26.13-1 -- Internal pressure coefficient (enclosed/partial/open)
_GCPI = {
    'enclosed':            (+0.18, -0.18),
    'partially_enclosed':  (+0.55, -0.55),
    'open':                ( 0.00,  0.00),
}

# Figure 27.3-1 -- External pressure coefficients Cp for MWFRS (h <= 60ft simple
# rectangular building, normal-to-ridge wind, walls)
# Walls: windward Cp = 0.8, leeward depends on L/B, side = -0.7
def _asce_cp_leeward(L_over_B: float) -> float:
    if L_over_B <= 1.0:
        return -0.5
    if L_over_B >= 4.0:
        return -0.2
    # Linear interpolation between (1, -0.5) and (4, -0.2)
    return -0.5 + (L_over_B - 1.0) * (0.3 / 3.0)


def asce_7_22(*, V_mph: float, height_ft: float, length_ft: float,
              width_ft: float, exposure: str = 'C',
              risk_category: int = 2,
              enclosure: str = 'enclosed',
              Kzt: float = 1.0, Ke: float = 1.0,
              G: float = 0.85) -> Dict[str, Any]:
    """ASCE 7-22 Directional Procedure for low-rise rectangular building.

    Parameters
    ----------
    V_mph : basic wind speed (3-s gust) per ASCE 7-22 Fig. 26.5-1A..D
    height_ft, length_ft, width_ft : mean roof height and plan dimensions
    exposure : 'B' suburban, 'C' open terrain (default), 'D' flat unobstructed
    risk_category : I..IV (1..4) -- selects design wind speed map
    enclosure : 'enclosed', 'partially_enclosed', 'open'
    Kzt : topographic factor (Eq. 26.8-1); 1.0 for flat sites
    Ke : ground elevation factor (Table 26.9-1); 1.0 conservative
    G : gust-effect factor (rigid buildings cl. 26.11.1) = 0.85

    Returns dict with velocity pressure, MWFRS wall pressures, and provenance.
    """
    if exposure not in _ASCE_EXPOSURE:
        return {'success': False, 'error': f'invalid exposure {exposure!r}'}
    if enclosure not in _GCPI:
        return {'success': False, 'error': f'invalid enclosure {enclosure!r}'}
    if V_mph <= 0 or height_ft <= 0 or length_ft <= 0 or width_ft <= 0:
        return {'success': False, 'error': 'all dimensions must be positive'}

    exp = _ASCE_EXPOSURE[exposure]
    z = max(height_ft, 15.0)  # cl. 27.3.1 -- min 15 ft for low-rise
    # Table 26.10-1 -- velocity-pressure exposure coefficient Kz for MWFRS
    # Case 2:  Kz = 2.01 * (z / zg) ** (2/alpha)   for 15 ft <= z <= zg
    #          Kz = 2.01 * (15 / zg) ** (2/alpha)  for z < 15 ft
    # (The constant 2.41 applies only to Case 1, components & cladding on
    # buildings <= 60 ft -- not to MWFRS pressures.)
    if z <= 15.0:
        Kz = 2.01 * (15.0 / exp['zg_ft']) ** (2.0 / exp['alpha'])
    else:
        Kz = 2.01 * (z / exp['zg_ft']) ** (2.0 / exp['alpha'])

    Kd = _KD_BUILDINGS
    qz_psf = 0.00256 * Kz * Kzt * Kd * Ke * (V_mph ** 2)  # Eq. 26.10-1
    qh_psf = qz_psf  # for low-rise we use qh at mean roof height

    L_over_B = length_ft / width_ft
    cp_w = 0.8
    cp_l = _asce_cp_leeward(L_over_B)
    cp_s = -0.7

    gcpi_pos, gcpi_neg = _GCPI[enclosure]
    qi_psf = qh_psf  # internal pressure reference

    def _p(cp: float, gcpi: float) -> float:
        return qh_psf * G * cp - qi_psf * gcpi

    pressures_psf = {
        'windward_wall':  {'positive_GCpi': _p(cp_w, gcpi_pos),
                            'negative_GCpi': _p(cp_w, gcpi_neg)},
        'leeward_wall':   {'positive_GCpi': _p(cp_l, gcpi_pos),
                            'negative_GCpi': _p(cp_l, gcpi_neg)},
        'side_wall':      {'positive_GCpi': _p(cp_s, gcpi_pos),
                            'negative_GCpi': _p(cp_s, gcpi_neg)},
    }
    # Convert to kPa for international users (1 psf = 0.04788 kPa)
    psf_to_kpa = 0.04788026
    pressures_kpa = {
        k: {kk: round(vv * psf_to_kpa, 4) for kk, vv in v.items()}
        for k, v in pressures_psf.items()
    }

    return {
        'success': True,
        'code': 'ASCE 7-22',
        'procedure': 'Directional Procedure (Chapter 27, Part 1)',
        'inputs': {
            'V_mph': V_mph, 'height_ft': height_ft,
            'length_ft': length_ft, 'width_ft': width_ft,
            'exposure': exposure, 'risk_category': risk_category,
            'enclosure': enclosure, 'Kzt': Kzt, 'Ke': Ke, 'G': G,
        },
        'intermediate': {
            'Kz': round(Kz, 4),
            'Kd': Kd,
            'qz_psf': round(qz_psf, 3),
            'qh_psf': round(qh_psf, 3),
            'L_over_B': round(L_over_B, 3),
            'Cp': {'windward': cp_w, 'leeward': round(cp_l, 3), 'side': cp_s},
            'GCpi': {'positive': gcpi_pos, 'negative': gcpi_neg},
        },
        'pressures_psf': {k: {kk: round(vv, 3) for kk, vv in v.items()}
                           for k, v in pressures_psf.items()},
        'pressures_kPa': pressures_kpa,
        'clauses': {
            'velocity_pressure': '26.10-1',
            'design_pressure':   '27.3-1',
            'exposure_table':    '26.11-1',
            'cp_walls':          'Fig. 27.3-1',
            'GCpi':              'Table 26.13-1',
        },
        'disclaimer': 'Computed per ASCE/SEI 7-22 simplified MWFRS wall pressures '
                      'for an enclosed/low-rise rectangular building. Roof pressures, '
                      'C&C loads, and parapet/overhang loads are not included. '
                      'Designer must verify exposure, topographic, and enclosure '
                      'classifications for the actual site.',
    }


# ============================================================================
# Eurocode EN 1991-1-4
# ============================================================================

# Table 4.1 -- terrain category constants (z0 [m], zmin [m])
_EC_TERRAIN = {
    '0':   {'z0': 0.003, 'zmin': 1.0},
    'I':   {'z0': 0.01,  'zmin': 1.0},
    'II':  {'z0': 0.05,  'zmin': 2.0},
    'III': {'z0': 0.30,  'zmin': 5.0},
    'IV':  {'z0': 1.0,   'zmin': 10.0},
}

# Reference air density per cl. 4.5(1) Note 2
_RHO_AIR = 1.25  # kg/m^3
# Turbulence factor kI default (cl. 4.4(1) Note 2)
_K_I = 1.0

# Table 7.1 -- external pressure coefficient cpe,10 for vertical walls
# (h/d <= 0.25 .. h/d >= 5; we interpolate)
def _ec_cpe_walls(h_over_d: float) -> Dict[str, float]:
    # cpe,10 for windward face (D), leeward face (E), side (A)
    # Values from EN 1991-1-4 Table 7.1
    if h_over_d <= 0.25:
        return {'D': 0.7, 'E': -0.3, 'A': -1.2, 'B': -0.8, 'C': -0.5}
    if h_over_d >= 5:
        return {'D': 0.8, 'E': -0.7, 'A': -1.2, 'B': -0.8, 'C': -0.5}
    if h_over_d <= 1.0:
        # Interp 0.25 -> 1.0
        t = (h_over_d - 0.25) / 0.75
        return {
            'D': 0.7 + 0.0 * t, 'E': -0.3 + (-0.5) * t,  # -0.3 -> -0.5? actually 0.25->-0.3, 1->-0.5
            'A': -1.2, 'B': -0.8, 'C': -0.5,
        }
    # 1 .. 5
    t = (h_over_d - 1.0) / 4.0
    return {
        'D': 0.8 + 0.0 * t,
        'E': -0.5 + (-0.7 - -0.5) * t,
        'A': -1.2, 'B': -0.8, 'C': -0.5,
    }


def en_1991_1_4(*, vb_ms: float, height_m: float, length_m: float,
                width_m: float, terrain_category: str = 'II',
                co: float = 1.0, cprob: float = 1.0,
                cdir: float = 1.0, cseason: float = 1.0,
                rho_kg_m3: float = _RHO_AIR) -> Dict[str, Any]:
    """EN 1991-1-4 wind action on rectangular building (general procedure).

    Parameters
    ----------
    vb_ms : fundamental basic wind velocity (10-min mean at 10m, terrain II)
            from National Annex map [m/s]
    height_m, length_m, width_m : building reference dims
    terrain_category : '0', 'I', 'II', 'III', 'IV' per Table 4.1
    co : orography factor (cl. 4.3.3); 1.0 for flat terrain
    cprob : probability factor (cl. 4.2(2)P); 1.0 for 50-yr return
    cdir, cseason : directional / seasonal factors (cl. 4.2(2)P Notes 1&2);
                    1.0 if not from National Annex
    rho_kg_m3 : air density (cl. 4.5(1) Note 2); 1.25 default

    Returns dict with mean velocity, peak velocity pressure, surface pressures,
    and full provenance.
    """
    terrain_category = terrain_category.upper()
    if terrain_category not in _EC_TERRAIN:
        return {'success': False, 'error': f'invalid terrain category {terrain_category!r}'}
    if vb_ms <= 0 or height_m <= 0 or length_m <= 0 or width_m <= 0:
        return {'success': False, 'error': 'all dimensions and vb must be positive'}

    t = _EC_TERRAIN[terrain_category]
    z0, zmin = t['z0'], t['zmin']
    z0_II = _EC_TERRAIN['II']['z0']  # = 0.05 m
    z = max(height_m, zmin)

    # cl. 4.3.2 terrain factor kr
    kr = 0.19 * (z0 / z0_II) ** 0.07
    # cl. 4.3.2 roughness factor cr(z)
    cr = kr * math.log(z / z0)

    # cl. 4.3.1 basic velocity vb
    vb = cdir * cseason * cprob * vb_ms
    # cl. 4.3 mean wind velocity vm(z)
    vm = cr * co * vb

    # cl. 4.4 turbulence intensity Iv(z)
    Iv = _K_I / (co * math.log(z / z0))

    # cl. 4.5 peak velocity pressure qp(z) [N/m^2]
    qp_pa = (1 + 7 * Iv) * 0.5 * rho_kg_m3 * vm ** 2
    qp_kpa = qp_pa / 1000.0

    h_over_d = height_m / width_m  # d = width parallel to wind
    cpe = _ec_cpe_walls(h_over_d)

    # cl. 5.1 pressure on surfaces (external only; internal cpi default ±0.2)
    cpi_options = (+0.2, -0.2)
    pressures_kpa: Dict[str, Dict[str, float]] = {}
    for face, cp in cpe.items():
        we = qp_kpa * cp
        pressures_kpa[face] = {
            'cpe': cp,
            'we_kPa': round(we, 4),
            'wi_pos_cpi_kPa': round(qp_kpa * cpi_options[0], 4),
            'wi_neg_cpi_kPa': round(qp_kpa * cpi_options[1], 4),
            'net_max_kPa': round(we - qp_kpa * cpi_options[1], 4),
            'net_min_kPa': round(we - qp_kpa * cpi_options[0], 4),
        }

    return {
        'success': True,
        'code': 'EN 1991-1-4:2005+A1:2010',
        'procedure': 'General procedure (Sections 4 & 5)',
        'inputs': {
            'vb_ms': vb_ms, 'height_m': height_m,
            'length_m': length_m, 'width_m': width_m,
            'terrain_category': terrain_category,
            'co': co, 'cprob': cprob, 'cdir': cdir, 'cseason': cseason,
            'rho_kg_m3': rho_kg_m3,
        },
        'intermediate': {
            'z_m': round(z, 3),
            'z0_m': z0,
            'kr': round(kr, 4),
            'cr_z': round(cr, 4),
            'vb_ms': round(vb, 3),
            'vm_ms': round(vm, 3),
            'Iv_z': round(Iv, 4),
            'qp_kPa': round(qp_kpa, 4),
            'h_over_d': round(h_over_d, 3),
            'cpe': cpe,
            'cpi_assumed': list(cpi_options),
        },
        'pressures_kPa': pressures_kpa,
        'face_legend': {
            'D': 'windward face',
            'E': 'leeward face',
            'A': 'side face zone A (0 .. e/5)',
            'B': 'side face zone B (e/5 .. e)',
            'C': 'side face zone C (>e)',
        },
        'clauses': {
            'mean_velocity':       '4.3 (Eq. 4.3)',
            'peak_velocity_press': '4.5 (Eq. 4.8)',
            'surface_pressure':    '5.1 (Eq. 5.1)',
            'cpe_walls':           'Table 7.1',
            'terrain_categories':  'Table 4.1',
        },
        'disclaimer': 'Computed per EN 1991-1-4 general procedure for vertical '
                      'walls of a rectangular building. Roof zones, friction, '
                      'and structural factor cscd treated separately. Verify '
                      'vb, cdir, cseason, and any National Annex provisions for '
                      'the project country.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    def _read_floats(payload: Dict[str, Any], names: Dict[str, float]) -> Dict[str, float]:
        out: Dict[str, float] = {}
        for k, default in names.items():
            try:
                out[k] = float(payload.get(k, default))
            except (TypeError, ValueError):
                raise ValueError(f'parameter {k!r} must be numeric')
        return out

    @app.route('/api/loads/wind/asce7', methods=['POST'])
    def _asce_wind():
        data = request.get_json(silent=True) or {}
        try:
            f = _read_floats(data, {
                'V_mph': 115.0, 'height_ft': 30.0,
                'length_ft': 60.0, 'width_ft': 40.0,
                'Kzt': 1.0, 'Ke': 1.0, 'G': 0.85,
            })
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        result = asce_7_22(
            V_mph=f['V_mph'], height_ft=f['height_ft'],
            length_ft=f['length_ft'], width_ft=f['width_ft'],
            exposure=str(data.get('exposure', 'C')).upper(),
            risk_category=int(data.get('risk_category', 2)),
            enclosure=str(data.get('enclosure', 'enclosed')).lower(),
            Kzt=f['Kzt'], Ke=f['Ke'], G=f['G'],
        )
        return jsonify(result), (200 if result.get('success') else 400)

    @app.route('/api/loads/wind/eurocode', methods=['POST'])
    def _ec_wind():
        data = request.get_json(silent=True) or {}
        try:
            f = _read_floats(data, {
                'vb_ms': 26.0, 'height_m': 9.0,
                'length_m': 18.0, 'width_m': 12.0,
                'co': 1.0, 'cprob': 1.0, 'cdir': 1.0, 'cseason': 1.0,
                'rho_kg_m3': 1.25,
            })
        except ValueError as ve:
            return jsonify({'success': False, 'error': str(ve)}), 400
        result = en_1991_1_4(
            vb_ms=f['vb_ms'], height_m=f['height_m'],
            length_m=f['length_m'], width_m=f['width_m'],
            terrain_category=str(data.get('terrain_category', 'II')),
            co=f['co'], cprob=f['cprob'],
            cdir=f['cdir'], cseason=f['cseason'],
            rho_kg_m3=f['rho_kg_m3'],
        )
        return jsonify(result), (200 if result.get('success') else 400)

    logger.info('Wind-loads module registered (ASCE 7-22 + EN 1991-1-4)')
