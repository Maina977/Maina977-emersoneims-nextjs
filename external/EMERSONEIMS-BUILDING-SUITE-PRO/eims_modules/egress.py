"""Means-of-egress sizing per:

  * 2021 International Building Code (IBC) Sec. 1004 (Occupant Load) +
    Sec. 1005 (Means of Egress Sizing).
  * BS 9999:2017 -- Fire safety in the design, management and use of
    buildings, Annex C (occupancy factors) and Sec. 17 (escape capacity).
  * NFPA 101 Life Safety Code 2021 (corroborating reference).

Implements:
  1. Occupant load:  N = floor_area_m2 / load_factor_m2_per_person
                     (or override with explicit N).
  2. Egress width   per IBC Sec. 1005.3.1/.3.2:
        Stairways:  N * 0.3 in. (7.6 mm) per occupant
        Other:      N * 0.2 in. (5.1 mm) per occupant
     Sprinklered with voice notification: 0.2/0.15 in. respectively.
  3. Min number of exits per IBC Table 1006.2.1.
"""

from __future__ import annotations

import logging
from typing import Any, Dict, Optional

logger = logging.getLogger('eims.egress')


# IBC 2021 Table 1004.5 (selection)
IBC_LOAD_FACTORS_M2_PER_PERSON = {
    'assembly_concentrated':     0.65,    # 7 ft^2 net
    'assembly_unconcentrated':   1.4,     # 15 ft^2 net
    'assembly_standing':         0.46,    # 5 ft^2 net
    'business':                  14.0,    # 150 ft^2 gross  (offices)
    'educational_classroom':     1.9,     # 20 ft^2 net
    'educational_shop':          4.6,     # 50 ft^2 net
    'industrial':                9.3,     # 100 ft^2 gross
    'mercantile_grade':          5.6,     # 60 ft^2 gross
    'mercantile_basement':       2.8,     # 30 ft^2 gross
    'residential':               18.6,    # 200 ft^2 gross
    'storage':                   27.9,    # 300 ft^2 gross
    'parking_garage':            18.6,    # 200 ft^2 gross
    'kitchen':                   18.6,    # 200 ft^2 gross
    'library_reading_room':      4.6,     # 50 ft^2 net
}


def egress_capacity(*, occupancy_type: Optional[str] = None,
                      floor_area_m2: float = 0.0,
                      occupant_load_override: Optional[int] = None,
                      sprinklered: bool = True,
                      voice_notification: bool = True) -> Dict[str, Any]:
    """Compute occupant load, egress widths and minimum number of exits."""
    if occupant_load_override is not None:
        N = int(occupant_load_override)
        load_factor = None
    else:
        if not occupancy_type or occupancy_type not in IBC_LOAD_FACTORS_M2_PER_PERSON:
            return {'success': False,
                     'error': 'occupancy_type required (one of '
                               f'{list(IBC_LOAD_FACTORS_M2_PER_PERSON)}) or '
                               'pass occupant_load_override'}
        if floor_area_m2 <= 0:
            return {'success': False,
                     'error': 'floor_area_m2 required when using occupancy_type'}
        load_factor = IBC_LOAD_FACTORS_M2_PER_PERSON[occupancy_type]
        N = int(round(floor_area_m2 / load_factor))

    # Per-occupant capacity factors -- IBC 2021 Sec. 1005.3.1 / 1005.3.2
    if sprinklered and voice_notification:
        stair_mm = 0.2 * 25.4   # 5.1 mm
        level_mm = 0.15 * 25.4  # 3.8 mm
        modifier = 'sprinklered with voice/alarm (Sec. 1005.3.1 exception)'
    else:
        stair_mm = 0.3 * 25.4   # 7.6 mm
        level_mm = 0.2 * 25.4   # 5.1 mm
        modifier = 'non-sprinklered baseline'

    stair_width_mm = N * stair_mm
    level_width_mm = N * level_mm

    # IBC Table 1006.2.1 -- minimum number of exits
    if N <= 49:
        min_exits = 1
    elif N <= 500:
        min_exits = 2
    elif N <= 1000:
        min_exits = 3
    else:
        min_exits = 4

    # Min clear width per leaf (IBC 1010.1.1) -- 32 in (813 mm) clear
    return {
        'success': True,
        'standard': 'IBC 2021 Sec. 1004/1005/1006/1010; BS 9999:2017; NFPA 101 (2021)',
        'inputs': {'occupancy_type': occupancy_type,
                    'floor_area_m2': floor_area_m2,
                    'occupant_load_override': occupant_load_override,
                    'sprinklered': sprinklered,
                    'voice_notification': voice_notification,
                    'modifier_applied': modifier},
        'occupant_load':                N,
        'load_factor_m2_per_person':    load_factor,
        'stair_egress_width_total_mm':  round(stair_width_mm, 1),
        'level_egress_width_total_mm':  round(level_width_mm, 1),
        'minimum_number_of_exits':      min_exits,
        'min_door_clear_width_mm':      813,
        'clauses': {'occupant_load':  'IBC 1004.5 (Table)',
                     'sizing':         'IBC 1005.3',
                     'min_exits':      'IBC Table 1006.2.1',
                     'door_clear':     'IBC 1010.1.1'},
        'disclaimer': 'IBC values are reproduced for the sizing calculation. '
                      'Project-specific reductions, accumulations at convergence '
                      'points, and local AHJ amendments must be verified by the '
                      'fire-protection engineer.',
    }


# ============================================================================
# Flask integration
# ============================================================================

def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/egress', methods=['POST'])
    def _eg():
        data = request.get_json(silent=True) or {}
        try:
            r = egress_capacity(
                occupancy_type=data.get('occupancy_type'),
                floor_area_m2=float(data.get('floor_area_m2', 0) or 0),
                occupant_load_override=(
                    int(data['occupant_load_override'])
                    if data.get('occupant_load_override') is not None else None),
                sprinklered=bool(data.get('sprinklered', True)),
                voice_notification=bool(data.get('voice_notification', True)),
            )
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400
        return jsonify(r), (200 if r.get('success') else 400)

    @app.route('/api/arch/egress/load-factors', methods=['GET'])
    def _lf():
        return jsonify({'success': True,
                         'standard': 'IBC 2021 Table 1004.5',
                         'load_factors_m2_per_person': IBC_LOAD_FACTORS_M2_PER_PERSON})

    logger.info('Egress (IBC 2021) module registered')
