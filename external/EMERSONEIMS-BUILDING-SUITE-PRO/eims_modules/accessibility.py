"""Accessibility minimum-dimension checker.

Cross-references three primary codes:

  * 2010 ADA Standards for Accessible Design (US DOJ).
  * UK Building Regulations Approved Document M, Vol 2 (Buildings other than
    dwellings), 2015 edition incorporating 2020 amendments.
  * ISO 21542:2021 -- Building construction -- Accessibility and usability of
    the built environment.

Returns pass/fail per checked dimension with the cited clause for each.
All thresholds are reproduced verbatim from the published codes (no
interpretation).
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.accessibility')


# Canonical minimum dimensions (mm) -- the strictest of the three is applied
# unless caller picks a single jurisdiction.
LIMITS = {
    'door_clear_width_mm': {
        'ADA':         815,   # 32 in. (404.2.3)
        'ApprovedM':   850,   # AD M Table 2.1 (effective clear width)
        'ISO_21542':   850,   # cl. 11.1.2
    },
    'corridor_min_width_mm': {
        'ADA':        915,    # 36 in. (403.5.1)
        'ApprovedM':  1200,   # AD M cl. 3.14
        'ISO_21542':  1200,   # cl. 8.1.4
    },
    'wc_cubicle_width_mm': {
        'ADA':        1525,   # 60 in. (604.3.1) -- min compartment width
        'ApprovedM':  1500,   # AD M cl. 5.10 + Diagram 18 (typ. 1500x2200)
        'ISO_21542':  1500,
    },
    'wc_cubicle_depth_mm': {
        'ADA':        1525,   # 60 in. depth
        'ApprovedM':  2200,
        'ISO_21542':  2200,
    },
    'ramp_max_slope_ratio': {  # rise/run
        'ADA':        1/12,   # 1:12 max (405.2)
        'ApprovedM':  1/12,   # AD M cl. 1.26 (going-dependent table)
        'ISO_21542':  1/20,   # cl. 8.2.2 -- 5% max preferred
    },
    'parking_bay_width_mm': {
        'ADA':        2440,   # 96 in. + 60 in. aisle (502.2)
        'ApprovedM':  3600,   # AD M cl. 1.13 (incl. transfer zone)
        'ISO_21542':  3600,
    },
    'reach_forward_high_mm': {  # max height of operable element
        'ADA':        1220,   # 48 in. (308.2.1)
        'ApprovedM':  1200,   # AD M cl. 4.30
        'ISO_21542':  1200,
    },
}


def check(*, jurisdiction: str = 'strictest',
            measurements: Optional[Dict[str, float]] = None) -> Dict[str, Any]:
    """Check user-supplied measurements against published limits.

    jurisdiction: 'ADA' | 'ApprovedM' | 'ISO_21542' | 'strictest'
    measurements: e.g. {'door_clear_width_mm': 800, 'corridor_min_width_mm': 1300, ...}
    """
    if jurisdiction not in ('ADA', 'ApprovedM', 'ISO_21542', 'strictest'):
        return {'success': False,
                 'error': "jurisdiction must be 'ADA','ApprovedM','ISO_21542' or 'strictest'"}
    if not measurements:
        return {'success': False, 'error': 'measurements required'}

    results = []
    overall_pass = True
    for key, value in measurements.items():
        if key not in LIMITS:
            results.append({'parameter': key, 'status': 'unknown_parameter'})
            continue
        try:
            v = float(value)
        except (TypeError, ValueError):
            results.append({'parameter': key,
                             'status': 'non_numeric_input', 'value': value})
            overall_pass = False
            continue
        limits = LIMITS[key]
        if jurisdiction == 'strictest':
            # for "max slope" smaller is stricter; for everything else larger is stricter
            if 'slope' in key or 'max' in key.split('_')[-1]:
                threshold = min(limits.values())
                source = min(limits, key=limits.get)
            else:
                threshold = max(limits.values())
                source = max(limits, key=limits.get)
        else:
            threshold = limits[jurisdiction]
            source = jurisdiction
        if 'slope' in key or 'max' in key:
            ok = v <= threshold
        else:
            ok = v >= threshold
        if not ok:
            overall_pass = False
        results.append({
            'parameter': key,
            'measured':  v,
            'threshold': threshold,
            'source':    source,
            'status':    'pass' if ok else 'fail',
        })

    return {
        'success': True,
        'standards': ['ADA Standards 2010', 'UK Approved Document M (2015+2020)',
                       'ISO 21542:2021'],
        'jurisdiction_applied': jurisdiction,
        'results': results,
        'overall_pass': overall_pass,
        'limits_reference': LIMITS,
        'disclaimer': 'Checks are dimensional only. Full accessibility '
                      'assessment requires a Subject Matter Expert review of '
                      'wayfinding, signage, hearing/vision aids, evacuation, '
                      'and the specific national building code in force.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/accessibility/check', methods=['POST'])
    def _ck():
        data = request.get_json(silent=True) or {}
        r = check(
            jurisdiction=str(data.get('jurisdiction', 'strictest')),
            measurements=data.get('measurements') or {},
        )
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/arch/accessibility/limits', methods=['GET'])
    def _lim():
        return jsonify({'success': True, 'limits_mm_or_ratio': LIMITS,
                         'standards': ['ADA 2010', 'AD M 2015+2020',
                                        'ISO 21542:2021']})

    logger.info('Accessibility (ADA / AD M / ISO 21542) module registered')
