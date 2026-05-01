"""Room acoustics -- reverberation time per:

  * Sabine equation (Wallace Sabine, 1900):  T60 = 0.161 * V / A
  * Eyring (Norris-Eyring) refinement:       T60 = 0.161 * V / (-S * ln(1 - alpha_bar))
  * BS 8233:2014 Guidance on sound insulation and noise reduction
  * BB93 -- Acoustic design of schools (UK DfE, 2014)
  * EN 12354-6 -- Sound absorption in enclosed spaces

The 0.161 (m) coefficient comes from c=343 m/s at 20 deg C; for SI:
    T = 24 * ln(10) * V / (c * S * alpha_bar) ~ 0.161 * V / (S * alpha_bar)
"""

from __future__ import annotations

import logging
import math
from typing import Any, Dict, List, Optional

logger = logging.getLogger('eims.acoustics')


# Recommended T60 ranges per BS 8233:2014 / BB93
RECOMMENDED_T60 = {
    'office_open_plan':         (0.4, 0.8),
    'office_cellular':          (0.4, 0.6),
    'classroom_primary':        (0.4, 0.6),   # BB93 cl. 1.2
    'classroom_secondary':      (0.6, 0.8),
    'lecture_theatre':          (0.8, 1.0),
    'concert_hall_speech':      (1.0, 1.4),
    'concert_hall_music':       (1.6, 2.2),
    'restaurant':               (0.4, 1.0),
    'sports_hall':              (1.5, 2.0),
    'place_of_worship':         (1.5, 3.0),
    'recording_studio':         (0.2, 0.4),
}


def reverberation(*, volume_m3: float,
                    surfaces: List[Dict[str, Any]],
                    method: str = 'sabine',
                    room_type: Optional[str] = None,
                    speed_of_sound_mps: float = 343.0) -> Dict[str, Any]:
    """Compute T60.

    surfaces: list of {area_m2, alpha (absorption coefficient 0..1), description}
    """
    if volume_m3 <= 0:
        return {'success': False, 'error': 'volume must be positive'}
    if not surfaces:
        return {'success': False, 'error': 'at least one surface required'}
    method = method.lower()
    if method not in ('sabine', 'eyring'):
        return {'success': False, 'error': "method must be 'sabine' or 'eyring'"}

    A_total = 0.0      # total absorption (Sabines, m^2)
    S_total = 0.0      # total surface area
    rows = []
    for s in surfaces:
        try:
            area = float(s.get('area_m2', 0) or 0)
            alpha = float(s.get('alpha', 0) or 0)
        except (TypeError, ValueError):
            return {'success': False, 'error': 'area_m2 and alpha must be numeric'}
        if alpha < 0 or alpha > 1:
            return {'success': False,
                     'error': f'alpha must be in 0..1 (got {alpha})'}
        absorption = area * alpha
        A_total += absorption
        S_total += area
        rows.append({'description': s.get('description', ''),
                      'area_m2': area, 'alpha': alpha,
                      'absorption_sabines': round(absorption, 3),
                      'source': s.get('source', 'user-supplied')})

    if S_total <= 0 or A_total <= 0:
        return {'success': False,
                 'error': 'total surface area / absorption must be > 0'}

    coeff = 24 * math.log(10) / speed_of_sound_mps  # = 0.1611 at 343 m/s

    if method == 'sabine':
        T60 = coeff * volume_m3 / A_total
        formula = 'T60 = 0.161 * V / A'
    else:  # eyring
        alpha_bar = A_total / S_total
        if alpha_bar >= 0.999:
            return {'success': False,
                     'error': 'mean absorption alpha_bar >= 1; Eyring undefined'}
        T60 = coeff * volume_m3 / (-S_total * math.log(1 - alpha_bar))
        formula = 'T60 = 0.161 * V / (-S * ln(1 - alpha_bar))'

    out = {
        'success': True,
        'standard': 'Sabine (1900); Eyring; BS 8233:2014; BB93:2014; EN 12354-6',
        'method':   method,
        'formula':  formula,
        'inputs': {'volume_m3': volume_m3, 'speed_of_sound_mps': speed_of_sound_mps},
        'surfaces': rows,
        'totals': {'total_surface_m2':  round(S_total, 2),
                    'total_absorption_sabines': round(A_total, 3),
                    'mean_absorption_alpha_bar': round(A_total / S_total, 4)},
        'T60_seconds': round(T60, 3),
        'disclaimer': 'Mean-frequency T60 only. For BS 8233 / BB93 compliance, '
                      'compute at the standard octave bands (125, 250, 500, '
                      '1000, 2000, 4000 Hz) using band-specific alpha values.',
    }
    if room_type and room_type in RECOMMENDED_T60:
        lo, hi = RECOMMENDED_T60[room_type]
        if T60 < lo:
            band = 'too_dead'
        elif T60 > hi:
            band = 'too_reverberant'
        else:
            band = 'within_recommended_range'
        out['compliance'] = {
            'room_type': room_type,
            'recommended_T60_seconds': [lo, hi],
            'compliance_band': band,
            'reference': 'BS 8233:2014 / BB93:2014',
        }
    return out


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/acoustics/reverberation', methods=['POST'])
    def _rev():
        data = request.get_json(silent=True) or {}
        try:
            r = reverberation(
                volume_m3=float(data.get('volume_m3', 0)),
                surfaces=data.get('surfaces') or [],
                method=str(data.get('method', 'sabine')),
                room_type=data.get('room_type'),
                speed_of_sound_mps=float(data.get('speed_of_sound_mps', 343)),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/arch/acoustics/recommended', methods=['GET'])
    def _rec():
        return jsonify({'success': True,
                         'recommended_T60_ranges': RECOMMENDED_T60,
                         'reference': 'BS 8233:2014 / BB93:2014'})

    logger.info('Acoustics (Sabine/Eyring) module registered')
