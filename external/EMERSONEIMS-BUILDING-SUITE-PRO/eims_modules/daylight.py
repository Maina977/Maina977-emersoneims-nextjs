"""Daylight performance assessment per:

  * BS EN 17037:2018+A1:2021 -- Daylight in buildings
  * BS 8206-2:2008 -- Lighting for buildings: Code of practice for
    daylighting (withdrawn but still widely cited; informative here).
  * CIBSE LG10 -- Daylighting (2014).

Implements:
  1. Average Daylight Factor (ADF) by the BRE / Crisp & Littlefair formula
     (cited in BS 8206-2 cl. 4.3 and CIBSE LG10):

         ADF = (T * Aw * theta) / (A * (1 - R^2))     [%]

     where
        T      glass diffuse visible transmittance (e.g. 0.68 for clear DGU)
        Aw     net glazed area (m^2)
        theta  visible sky angle in degrees (max 90)
        A      total internal surface area (walls+floor+ceiling+windows, m^2)
        R      area-weighted average reflectance (typ. 0.5)

  2. EN 17037 daylight provision target levels:
       * Minimum:    ADF >= 1.6 % (target illuminance 100 lx for 50% of area)
       * Medium:     ADF >= 2.4 % (target 300 lx)
       * High:       ADF >= 3.2 % (target 500 lx)

All numerical assumptions are user-supplied; defaults carry a published
source citation.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

logger = logging.getLogger('eims.daylight')


def average_daylight_factor(*, T_glass: float = 0.68,
                              window_area_m2: float,
                              sky_angle_deg: float = 65.0,
                              total_internal_surface_m2: float,
                              avg_reflectance: float = 0.5,
                              maintenance_factor: float = 0.9,
                              frame_factor: float = 0.7) -> Dict[str, Any]:
    """Compute ADF and EN 17037 compliance band.

    frame_factor      : net glass area / gross window area (typ. 0.7)
    maintenance_factor: dirt / cleaning allowance (typ. 0.8-0.95)
    """
    if min(T_glass, window_area_m2, sky_angle_deg,
            total_internal_surface_m2, avg_reflectance,
            maintenance_factor, frame_factor) <= 0:
        return {'success': False,
                 'error': 'all inputs must be positive'}
    if avg_reflectance >= 1:
        return {'success': False,
                 'error': 'avg_reflectance must be < 1'}
    if sky_angle_deg > 90:
        sky_angle_deg = 90.0

    Aw_net = window_area_m2 * frame_factor
    adf = (T_glass * Aw_net * sky_angle_deg * maintenance_factor) \
          / (total_internal_surface_m2 * (1 - avg_reflectance ** 2))

    if adf >= 3.2:
        en17037_band = 'High'
    elif adf >= 2.4:
        en17037_band = 'Medium'
    elif adf >= 1.6:
        en17037_band = 'Minimum'
    else:
        en17037_band = 'Below minimum'

    return {
        'success': True,
        'standard': 'BS EN 17037:2018+A1:2021; BS 8206-2:2008; CIBSE LG10:2014',
        'method':   'BRE / Crisp & Littlefair Average Daylight Factor formula',
        'inputs': {
            'T_glass_visible_transmittance':  T_glass,
            'window_area_gross_m2':            window_area_m2,
            'frame_factor':                    frame_factor,
            'window_area_net_m2':              round(Aw_net, 3),
            'sky_angle_deg':                   sky_angle_deg,
            'total_internal_surface_m2':       total_internal_surface_m2,
            'avg_reflectance':                 avg_reflectance,
            'maintenance_factor':              maintenance_factor,
        },
        'ADF_pct':                round(adf, 3),
        'EN17037_compliance_band': en17037_band,
        'recommended_target_lx_50pct_area': {
            'Minimum': 100, 'Medium': 300, 'High': 500,
        },
        'clauses': {
            'formula':  'BS 8206-2:2008 cl. 4.3',
            'targets':  'EN 17037:2018 cl. 5 + Annex A',
        },
        'disclaimer': 'ADF is a parametric daylight indicator. For credit '
                      'under EN 17037 (Annex A method 1) a climate-based '
                      'daylight modelling (CBDM) study is required; this '
                      'function provides the screening/early-design check.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/daylight/adf', methods=['POST'])
    def _adf():
        data = request.get_json(silent=True) or {}
        try:
            r = average_daylight_factor(
                T_glass=float(data.get('T_glass', 0.68)),
                window_area_m2=float(data.get('window_area_m2', 0)),
                sky_angle_deg=float(data.get('sky_angle_deg', 65)),
                total_internal_surface_m2=float(data.get('total_internal_surface_m2', 0)),
                avg_reflectance=float(data.get('avg_reflectance', 0.5)),
                maintenance_factor=float(data.get('maintenance_factor', 0.9)),
                frame_factor=float(data.get('frame_factor', 0.7)),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('Daylight (EN 17037) module registered')
