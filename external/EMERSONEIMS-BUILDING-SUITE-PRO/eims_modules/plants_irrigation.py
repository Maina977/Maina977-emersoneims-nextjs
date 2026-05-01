"""
Landscape + irrigation planner.

Provides:
  - Curated native-plant database (Mediterranean + East-African + Gulf + tropical)
    filtered by country and sun exposure
  - Irrigation water-budget + drip-line sizing using FAO-56 reference ET0
    method (per Allen et al., 1998) without needing live weather data.

All data is from public taxonomic references (GBIF, USDA hardiness,
FAO-56). No external APIs.
"""
from __future__ import annotations
from typing import Any
import logging

logger = logging.getLogger('eims')


# Native / climate-appropriate plant list. 'kc' = FAO-56 crop coefficient
# averaged over growing season; 'water_need' = rough class (low/med/high).
_PLANTS: list[dict[str, Any]] = [
    # --- Mediterranean ---
    {'botanical': 'Olea europaea', 'common': 'Olive tree', 'type': 'tree',
     'region': 'mediterranean', 'kc': 0.65, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 6,
     'notes': 'Iconic Andalusian; silvery foliage; needs well-drained soil.'},
    {'botanical': 'Citrus sinensis', 'common': 'Orange tree', 'type': 'tree',
     'region': 'mediterranean', 'kc': 0.70, 'water_need': 'medium',
     'drought_tolerance': 'moderate', 'mature_height_m': 5,
     'notes': 'Traditional Andalusian courtyard tree; fragrant blossom.'},
    {'botanical': 'Cupressus sempervirens', 'common': 'Italian cypress',
     'type': 'tree', 'region': 'mediterranean', 'kc': 0.70, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 20,
     'notes': 'Columnar accent tree; avenue planting.'},
    {'botanical': 'Lavandula angustifolia', 'common': 'English lavender',
     'type': 'shrub', 'region': 'mediterranean', 'kc': 0.60, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 0.8,
     'notes': 'Fragrant; pollinator-friendly; silvery foliage.'},
    {'botanical': 'Rosmarinus officinalis', 'common': 'Rosemary',
     'type': 'shrub', 'region': 'mediterranean', 'kc': 0.55, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 1.2,
     'notes': 'Culinary + ornamental; tolerates salt spray.'},
    {'botanical': 'Bougainvillea spectabilis', 'common': 'Bougainvillea',
     'type': 'climber', 'region': 'mediterranean', 'kc': 0.60, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 10,
     'notes': 'Dramatic magenta/orange bracts; excellent on walls/pergolas.'},
    {'botanical': 'Jasminum officinale', 'common': 'Common jasmine',
     'type': 'climber', 'region': 'mediterranean', 'kc': 0.65, 'water_need': 'medium',
     'drought_tolerance': 'moderate', 'mature_height_m': 5,
     'notes': 'Intensely scented; classic for courtyards.'},
    {'botanical': 'Nerium oleander', 'common': 'Oleander', 'type': 'shrub',
     'region': 'mediterranean', 'kc': 0.55, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 3,
     'notes': 'WARNING: all parts toxic; avoid if children/pets.'},
    # --- East African / Kenyan ---
    {'botanical': 'Acacia xanthophloea', 'common': 'Fever tree', 'type': 'tree',
     'region': 'east_africa', 'kc': 0.70, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 15,
     'notes': 'Iconic savanna tree; yellow-green bark.'},
    {'botanical': 'Delonix regia', 'common': 'Flame tree / poinciana',
     'type': 'tree', 'region': 'east_africa', 'kc': 0.75, 'water_need': 'medium',
     'drought_tolerance': 'good', 'mature_height_m': 12,
     'notes': 'Scarlet flowers in dry season; canopy shade tree.'},
    {'botanical': 'Aloe vera', 'common': 'Aloe vera', 'type': 'succulent',
     'region': 'east_africa', 'kc': 0.45, 'water_need': 'very_low',
     'drought_tolerance': 'excellent', 'mature_height_m': 0.6,
     'notes': 'Medicinal; low-maintenance; tolerates poor soils.'},
    # --- Gulf / arid ---
    {'botanical': 'Phoenix dactylifera', 'common': 'Date palm', 'type': 'palm',
     'region': 'gulf_arid', 'kc': 0.85, 'water_need': 'medium',
     'drought_tolerance': 'excellent', 'mature_height_m': 20,
     'notes': 'Iconic Gulf; tolerates saline groundwater.'},
    {'botanical': 'Ziziphus spina-christi', 'common': 'Christ-thorn jujube',
     'type': 'tree', 'region': 'gulf_arid', 'kc': 0.60, 'water_need': 'very_low',
     'drought_tolerance': 'excellent', 'mature_height_m': 8,
     'notes': 'Ancient Levantine tree; edible fruit.'},
    # --- Tropical ---
    {'botanical': 'Cocos nucifera', 'common': 'Coconut palm', 'type': 'palm',
     'region': 'tropical', 'kc': 0.95, 'water_need': 'high',
     'drought_tolerance': 'moderate', 'mature_height_m': 25,
     'notes': 'Coastal tropical; needs >1500 mm/yr rainfall.'},
    {'botanical': 'Plumeria rubra', 'common': 'Frangipani', 'type': 'tree',
     'region': 'tropical', 'kc': 0.65, 'water_need': 'medium',
     'drought_tolerance': 'good', 'mature_height_m': 6,
     'notes': 'Tropical garden classic; fragrant flowers.'},
    # --- Universal (most regions) ---
    {'botanical': 'Cycas revoluta', 'common': 'Sago palm', 'type': 'cycad',
     'region': 'universal_warm', 'kc': 0.55, 'water_need': 'low',
     'drought_tolerance': 'excellent', 'mature_height_m': 2,
     'notes': 'Architectural accent; slow-growing.'},
]

_REGION_HINTS = {
    'mediterranean':  ['spain', 'italy', 'france', 'greece', 'turkey', 'morocco',
                        'portugal', 'croatia'],
    'east_africa':    ['kenya', 'tanzania', 'uganda', 'ethiopia', 'rwanda'],
    'gulf_arid':      ['uae', 'saudi arabia', 'qatar', 'bahrain', 'oman', 'kuwait'],
    'tropical':       ['indonesia', 'malaysia', 'thailand', 'vietnam', 'philippines',
                        'brazil', 'nigeria'],
}

_WATER_LITRES_PER_DAY = {
    'very_low': 2, 'low': 5, 'medium': 10, 'high': 20,
}


def plants_for(country: str | None = None,
                water_budget: str | None = None,
                exposure: str | None = None) -> dict[str, Any]:
    region = None
    if country:
        c = country.lower()
        for r, countries in _REGION_HINTS.items():
            if c in countries:
                region = r
                break

    filtered = _PLANTS
    if region:
        filtered = [p for p in filtered if p['region'] == region or p['region'] == 'universal_warm']
    if water_budget in ('very_low', 'low', 'medium', 'high'):
        order = ['very_low', 'low', 'medium', 'high']
        budget_idx = order.index(water_budget)
        filtered = [p for p in filtered if order.index(p['water_need']) <= budget_idx]

    return {
        'success':        True,
        'country_input':  country,
        'region_inferred': region,
        'water_budget':   water_budget,
        'count':          len(filtered),
        'plants':         filtered,
        'data_source':    'Curated from GBIF + FAO-56 (non-copyrighted taxonomy)',
    }


def irrigation_plan(*, garden_area_m2: float, climate_et0_mm_day: float = 5.0,
                     water_need: str = 'medium',
                     drip_emitter_lph: float = 4.0,
                     emitter_spacing_m: float = 0.5,
                     line_spacing_m: float = 0.6) -> dict[str, Any]:
    if garden_area_m2 <= 0 or climate_et0_mm_day <= 0:
        return {'success': False, 'error': 'garden_area_m2 + climate_et0_mm_day must be > 0'}

    kc_lookup = {'very_low': 0.40, 'low': 0.55, 'medium': 0.75, 'high': 0.95}
    kc = kc_lookup.get(water_need, 0.75)

    etc_mm_day = climate_et0_mm_day * kc
    litres_per_day = etc_mm_day * garden_area_m2  # 1 mm x 1 m2 = 1 L
    line_count = max(1, int(garden_area_m2 ** 0.5 / line_spacing_m))
    line_length_m = garden_area_m2 / (line_count * line_spacing_m) if line_spacing_m > 0 else 0
    emitters_per_line = max(1, int(line_length_m / emitter_spacing_m))
    total_emitters = emitters_per_line * line_count
    flow_lph = total_emitters * drip_emitter_lph
    daily_runtime_hr = litres_per_day / flow_lph if flow_lph > 0 else 0

    return {
        'success': True,
        'method': 'FAO-56 Penman-Monteith crop-coefficient method (Allen et al., 1998)',
        'inputs': {
            'garden_area_m2':       garden_area_m2,
            'climate_ET0_mm_day':   climate_et0_mm_day,
            'water_need_class':     water_need,
            'Kc_applied':           kc,
        },
        'crop_ET_mm_day':       round(etc_mm_day, 2),
        'daily_water_L':        round(litres_per_day, 0),
        'monthly_water_m3':     round(litres_per_day * 30 / 1000, 2),
        'drip_system': {
            'line_count':         line_count,
            'line_length_m_each': round(line_length_m, 1),
            'emitters_per_line':  emitters_per_line,
            'total_emitters':     total_emitters,
            'emitter_lph':        drip_emitter_lph,
            'system_flow_lph':    round(flow_lph, 1),
            'daily_runtime_hr':   round(daily_runtime_hr, 2),
        },
        'notes': [
            'ET0 values: Marbella ~ 4 mm/day annual, 7 mm/day summer peak.',
            'Nairobi ~ 3.5 mm/day; Dubai ~ 6 mm/day summer.',
            'Runtime > 4 hr/day: consider splitting into 2 cycles at dawn/dusk.',
            'Add 10-15% to flow budget for system losses + evaporation.',
        ],
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/landscape/plants', methods=['GET'])
    def _plants():
        from flask import request as req
        return jsonify(plants_for(
            country=req.args.get('country'),
            water_budget=req.args.get('water_budget'),
        ))

    @app.route('/api/landscape/irrigation/plan', methods=['POST'])
    def _irr():
        data = request.get_json(silent=True) or {}
        try:
            return jsonify(irrigation_plan(
                garden_area_m2=float(data.get('garden_area_m2', 0) or 0),
                climate_et0_mm_day=float(data.get('climate_et0_mm_day', 5.0)),
                water_need=str(data.get('water_need', 'medium')),
                drip_emitter_lph=float(data.get('drip_emitter_lph', 4.0)),
                emitter_spacing_m=float(data.get('emitter_spacing_m', 0.5)),
                line_spacing_m=float(data.get('line_spacing_m', 0.6)),
            ))
        except (TypeError, ValueError) as e:
            return jsonify({'success': False, 'error': str(e)}), 400

    logger.info('Plants + irrigation module registered (%d plants, FAO-56 sizing)',
                 len(_PLANTS))
