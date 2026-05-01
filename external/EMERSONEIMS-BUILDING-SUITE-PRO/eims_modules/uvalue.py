"""Building-element U-value (thermal transmittance) per:

  * BS EN ISO 6946:2017 -- Building components and building elements --
    Thermal resistance and thermal transmittance -- Calculation methods.
  * BS EN ISO 10456:2007 -- material thermal property reference data
    (lambda values must be sourced from this or an EPD; never invented).

    R_total = Rsi + sum(d_j / lambda_j) + Rse
    U       = 1 / R_total                                 [W/(m^2.K)]

Surface resistances (Table 7 of EN ISO 6946):
                              Rsi          Rse
    Horizontal heat flow      0.13         0.04
    Upward heat flow          0.10         0.04
    Downward heat flow        0.17         0.04

Layers in the request must each carry their lambda source citation.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, List

logger = logging.getLogger('eims.uvalue')

_RSI = {'horizontal': 0.13, 'upward': 0.10, 'downward': 0.17}
_RSE = 0.04


def u_value(*, layers: List[Dict[str, Any]],
              heat_flow: str = 'horizontal') -> Dict[str, Any]:
    """Compute U-value of a layered opaque element.

    Each layer dict: {description, thickness_m, lambda_W_mK, source}
    """
    heat_flow = heat_flow.lower()
    if heat_flow not in _RSI:
        return {'success': False,
                 'error': f"heat_flow must be one of {list(_RSI)}"}
    if not layers:
        return {'success': False, 'error': 'at least one layer required'}

    Rsi = _RSI[heat_flow]
    Rse = _RSE
    rows = []
    R_layers = 0.0
    missing_source = []
    for i, L in enumerate(layers):
        try:
            d = float(L.get('thickness_m', 0) or 0)
            lam = float(L.get('lambda_W_mK', 0) or 0)
        except (TypeError, ValueError):
            return {'success': False,
                     'error': f'layer {i}: thickness/lambda must be numeric'}
        if d < 0 or lam <= 0:
            return {'success': False,
                     'error': f'layer {i}: need thickness >= 0 and lambda > 0'}
        src = (L.get('source') or '').strip()
        if not src:
            missing_source.append(L.get('description', f'layer_{i}'))
        Rj = d / lam
        R_layers += Rj
        rows.append({'description': L.get('description', ''),
                      'thickness_m': d, 'lambda_W_mK': lam,
                      'R_m2K_per_W': round(Rj, 4),
                      'source': src or '[MISSING]'})

    R_total = Rsi + R_layers + Rse
    U = 1.0 / R_total

    return {
        'success': True,
        'standard': 'BS EN ISO 6946:2017; lambda data should be from EN ISO 10456 or EPD',
        'inputs': {'heat_flow_direction': heat_flow,
                    'Rsi': Rsi, 'Rse': Rse},
        'layers': rows,
        'R_layers_total': round(R_layers, 4),
        'R_total_m2K_per_W': round(R_total, 4),
        'U_value_W_m2K':    round(U, 4),
        'data_provenance': {
            'all_lambda_values_have_source': not missing_source,
            'layers_missing_source':         missing_source,
        },
        'disclaimer': 'Plane element only -- thermal bridges (point chi, '
                      'linear psi) and air-cavity Ru must be added per EN ISO '
                      '6946 Annex A/E. Window U-values use EN ISO 10077-1.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/uvalue', methods=['POST'])
    def _uv():
        data = request.get_json(silent=True) or {}
        try:
            r = u_value(
                layers=data.get('layers') or [],
                heat_flow=str(data.get('heat_flow', 'horizontal')),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    logger.info('U-value (EN ISO 6946) module registered')
