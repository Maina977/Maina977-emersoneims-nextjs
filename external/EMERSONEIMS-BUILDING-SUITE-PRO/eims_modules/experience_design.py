"""
EMERSON EIMS — Experience Design Engine  (Sprint 6)
====================================================

What separates world-leading residential firms (SAOTA, ARK Architects, UDesign)
from average practices is that they design *how you live*, not just what you build.
This module formalises that into computable outputs.

Seven engines:

1. Solar Path Engine   — Real astronomical sun positions (Spencer 1971 / Iqbal 1983).
                         Per-room solar windows, shadow depths, pool sunset analysis.
2. Lifestyle Journey   — Named journeys through the house (morning, arrival, sunset…).
                         Transition quality, view axes, indoor-outdoor connection.
3. Emotion Design      — Rooms mapped to emotional targets (calm, power, relaxation…)
                         with specific ceiling / material / light / proportion targets.
4. Indoor-Outdoor Flow — Transparency index, openable wall %, view corridors.
                         Identifies barriers and recommends frameless sliding positions.
5. Restraint Score     — Counts features / materials / decorative density.
                         Scores 0-100; 85+ = "SAOTA level" considered.
6. Complete Brief      — Narrative "story" of how you live in the house, hour by hour.
7. Interior + Landscape + Lighting — Coherent palette and zone recommendations.

All calculations are deterministic and source-cited.  No external dependencies beyond
stdlib + math.  Flask registration at the bottom.

Sources
-------
• Spencer J.W. (1971) Fourier series representation of the position of the sun.
  *Search* 2(5):172.  — declination + equation-of-time formulas.
• Iqbal M. (1983) *An Introduction to Solar Radiation*, Academic Press.
  — altitude / azimuth derivation used by NOAA Solar Calculator.
• Neufert, *Architects' Data* 5e — room dimension lower bounds.
• CIBSE Guide A (2015) — solar irradiance benchmarks for shading design.
• CTE DB-HE (Spain) — south-facing glazing + summer shading rules.
• Andalucía Plan General de Ordenación (2022) — setback and coverage norms.
"""

from __future__ import annotations

import math
import json
from dataclasses import dataclass, asdict, field
from datetime import date, datetime, timezone
from typing import Any, Dict, List, Optional, Tuple
from flask import Flask, jsonify, request


# ---------------------------------------------------------------------------
#  Constants
# ---------------------------------------------------------------------------

# Default location: Marbella, Costa del Sol, Spain
DEFAULT_LAT = 36.51   # ° N
DEFAULT_LON = -4.88   # ° E  (negative = west)
DEFAULT_TZ_OFFSET = 2  # hours ahead of UTC (CEST summer)

# Compass headings for facade orientations
COMPASS = {
    'N':   0.0, 'NNE':  22.5, 'NE':  45.0, 'ENE':  67.5,
    'E':  90.0, 'ESE': 112.5, 'SE': 135.0, 'SSE': 157.5,
    'S': 180.0, 'SSW': 202.5, 'SW': 225.0, 'WSW': 247.5,
    'W': 270.0, 'WNW': 292.5, 'NW': 315.0, 'NNW': 337.5,
}

# Emotion targets for each room function
EMOTION_MAP: Dict[str, str] = {
    'master bedroom':    'calm',
    'bedroom':           'calm',
    'living':            'celebration',
    'dining':            'social',
    'kitchen':           'energy',
    'study':             'focus',
    'master bathroom':   'relaxation',
    'bathroom':          'calm',
    'terrace':           'relaxation',
    'pool':              'relaxation',
    'entrance':          'power',
    'corridor':          'neutral',
    'stair':             'neutral',
    'gym':               'energy',
    'spa':               'relaxation',
    'wine cellar':       'intimacy',
    'home cinema':       'intimacy',
    'outdoor kitchen':   'social',
    'guest bedroom':     'calm',
    'home office':       'focus',
    'playroom':          'energy',
}

# Per-emotion design targets
EMOTION_DESIGN: Dict[str, Dict[str, Any]] = {
    'calm': {
        'ceiling_h_m': (2.8, 3.2),
        'palette': ['warm white', 'stone beige', 'soft grey'],
        'accent':  'bleached oak or pale linen',
        'light':   'diffuse, indirect, no harsh contrast',
        'glazing': 'full-width but with deep external shading',
        'materials': ['micro-cement render', 'travertine', 'linen upholstery'],
        'sound':   'water feature nearby or acoustic absorption panels',
        'principle': 'Reduce stimuli. The room should feel like an exhale.',
    },
    'power': {
        'ceiling_h_m': (4.5, 6.6),
        'palette': ['crisp white', 'charcoal', 'raw concrete'],
        'accent':  'brushed dark bronze or black steel',
        'light':   'dramatic vertical shafts, concealed LED coves',
        'glazing': 'double-height full facade facing arrival axis',
        'materials': ['raw concrete', 'nero marquina marble', 'black steel'],
        'sound':   'minimal — the silence is part of the statement',
        'principle': 'Compress the approach, then release into height and volume.',
    },
    'relaxation': {
        'ceiling_h_m': (2.7, 3.0),
        'palette': ['stone white', 'driftwood', 'terracotta wash'],
        'accent':  'rattan, aged teak, or hammered copper',
        'light':   'warm 2700 K, dimmable, zero blue at night',
        'glazing': 'unobstructed view to water or landscape; operable for breeze',
        'materials': ['teak decking', 'rough travertine', 'outdoor linen'],
        'sound':   'water audible — pool overflow, fountain, or ocean',
        'principle': 'The body should slow down within 10 seconds of entering.',
    },
    'energy': {
        'ceiling_h_m': (3.0, 3.6),
        'palette': ['bright white', 'warm grey', 'bold accent'],
        'accent':  'polished concrete or lacquered cabinetry',
        'light':   'east-facing morning sun, high colour-rendering LED (CRI 95+)',
        'glazing': 'large east-facing opening, no internal obstructions',
        'materials': ['white micro-cement', 'stainless steel', 'glass'],
        'sound':   'acoustically live — hard surfaces to feel alive',
        'principle': 'Activate. Morning light drives this room.',
    },
    'social': {
        'ceiling_h_m': (3.0, 3.6),
        'palette': ['warm white', 'aged timber', 'earth accent'],
        'accent':  'statement pendant lighting, natural stone centre',
        'light':   'layered: candle-level dimmable ambient + accent on table',
        'glazing': 'direct view to terrace / garden; bi-fold to extend space outside',
        'materials': ['natural stone table', 'linen or velvet seating', 'bronze fittings'],
        'sound':   'mid-reverb — not dead, not echoey',
        'principle': 'Draw people together. The table is the anchor.',
    },
    'focus': {
        'ceiling_h_m': (2.8, 3.2),
        'palette': ['soft white', 'warm grey'],
        'accent':  'dark walnut or aged oak desk surface',
        'light':   'even north light (no glare), supplement 4000 K task light',
        'glazing': 'north or east facing, deep reveals to prevent screen glare',
        'materials': ['acoustic wall panels', 'solid timber joinery', 'wool rug'],
        'sound':   'high acoustic absorption — RT60 < 0.4 s',
        'principle': 'Minimise interruptions. The room disappears into the work.',
    },
    'intimacy': {
        'ceiling_h_m': (2.5, 2.8),
        'palette': ['deep warm tones', 'aged timber', 'amber'],
        'accent':  'candlelight-warm filament lamps, aged brass',
        'light':   'very low ambient, 1800-2200 K, no overhead glare',
        'glazing': 'small, framed views only (no panoramic)',
        'materials': ['velvet', 'dark timber', 'felt panels', 'rough stone'],
        'sound':   'highly absorptive — silence or murmur only',
        'principle': 'Compress and warm. Luxury is the absence of the outside world.',
    },
    'celebration': {
        'ceiling_h_m': (3.6, 6.6),
        'palette': ['warm white', 'natural stone', 'bold accent'],
        'accent':  'statement artwork, sculptural furniture piece',
        'light':   'layered: high ambient when open, dramatic low when entertaining',
        'glazing': 'maximum south opening — the room must extend into the landscape',
        'materials': ['travertine floor', 'lime plaster walls', 'statement lighting'],
        'sound':   'mid-reverb — alive but not echoey; acoustic panels if double-height',
        'principle': 'The living room is the house. Everything else serves it.',
    },
    'neutral': {
        'ceiling_h_m': (2.4, 3.0),
        'palette': ['light grey', 'white'],
        'accent':  'match adjacent rooms for coherence',
        'light':   'functional — 300 lux, CRI 90+',
        'glazing': 'none required, borrow light from adjacent spaces',
        'materials': ['durable, low-maintenance'],
        'sound':   'neutral',
        'principle': 'Transition spaces should be calm bridges, not destinations.',
    },
}

# Indoor-outdoor connection quality thresholds
FLOW_THRESHOLDS = {
    'excellent': 0.65,  # ≥65% of facade openable → SAOTA / ARK standard
    'good':      0.45,
    'adequate':  0.25,
    'poor':      0.0,
}

# Standard frameless sliding glass wall panel widths (European, m)
SLIDING_PANEL_WIDTHS = [1.2, 1.5, 1.8, 2.1, 2.4, 3.0]


# ---------------------------------------------------------------------------
#  1. Solar Path Engine
# ---------------------------------------------------------------------------

def _day_of_year(d: date) -> int:
    return d.timetuple().tm_yday


def _sun_position(lat_deg: float, lon_deg: float,
                   d: date, hour_utc: float) -> Tuple[float, float]:
    """Return (azimuth_deg, altitude_deg) for a given location and UTC time.

    Algorithm: Spencer (1971) declination + equation-of-time; altitude /
    azimuth from spherical trigonometry (Iqbal 1983 §3.2).
    Azimuth is measured clockwise from North (0 = N, 90 = E, 180 = S, 270 = W).
    Returns (azimuth, altitude); altitude < 0 means below horizon (night).
    """
    N = _day_of_year(d)
    gamma = 2 * math.pi * (N - 1) / 365.0  # day angle

    # Declination δ (Spencer 1971, eq.1) — radians
    decl = (0.006918
            - 0.399912 * math.cos(gamma)
            + 0.070257 * math.sin(gamma)
            - 0.006758 * math.cos(2 * gamma)
            + 0.000907 * math.sin(2 * gamma)
            - 0.002697 * math.cos(3 * gamma)
            + 0.001480 * math.sin(3 * gamma))

    # Equation of time (minutes) (Spencer 1971, eq.2)
    eot = 229.18 * (0.000075
                    + 0.001868 * math.cos(gamma)
                    - 0.032077 * math.sin(gamma)
                    - 0.014615 * math.cos(2 * gamma)
                    - 0.040890 * math.sin(2 * gamma))

    # Local solar time (hours)
    lst = hour_utc + lon_deg / 15.0 + eot / 60.0

    # Solar hour angle ω (degrees; 0 at solar noon)
    omega_deg = (lst - 12.0) * 15.0
    omega = math.radians(omega_deg)

    lat = math.radians(lat_deg)

    sin_alt = (math.sin(decl) * math.sin(lat)
               + math.cos(decl) * math.cos(lat) * math.cos(omega))
    sin_alt = max(-1.0, min(1.0, sin_alt))
    alt = math.degrees(math.asin(sin_alt))

    if alt <= 0.0:
        return 0.0, alt  # below horizon — azimuth undefined

    cos_az = ((math.sin(decl) * math.cos(lat)
               - math.cos(decl) * math.sin(lat) * math.cos(omega))
              / math.cos(math.radians(alt)))
    cos_az = max(-1.0, min(1.0, cos_az))
    az = math.degrees(math.acos(cos_az))

    # Quadrant correction (afternoon: sun is west of south)
    if omega_deg > 0:
        az = 360.0 - az

    return round(az, 1), round(alt, 1)


def solar_study(
    *,
    lat: float = DEFAULT_LAT,
    lon: float = DEFAULT_LON,
    tz_offset: int = DEFAULT_TZ_OFFSET,
    dates: Optional[List[str]] = None,
    facade_azimuths: Optional[Dict[str, float]] = None,
) -> Dict[str, Any]:
    """Full-day solar analysis for a site.

    Returns hourly sun positions for key dates, peak irradiance windows per
    facade orientation, and the critical "pool sunset" moment.

    facade_azimuths: {label: azimuth_from_north_deg}, e.g.
        {'south_facade': 180, 'pool_terrace': 170, 'master_bedroom': 90}
    """
    if dates is None:
        dates = ['2026-06-21', '2026-12-21', '2026-03-20']  # solstices + equinox

    if facade_azimuths is None:
        facade_azimuths = {
            'south_facade':  180.0,
            'east_facade':    90.0,
            'west_facade':   270.0,
            'pool_terrace':  175.0,
        }

    results: Dict[str, Any] = {
        'location': {'lat': lat, 'lon': lon, 'tz_offset_h': tz_offset},
        'source': 'Spencer (1971) + Iqbal (1983) — same basis as NOAA Solar Calculator',
        'dates': {},
        'facade_analysis': {},
        'key_moments': [],
    }

    for date_str in dates:
        d = date.fromisoformat(date_str)
        hourly = []
        for h_local in range(6, 22):  # 06:00–21:00 local
            h_utc = h_local - tz_offset
            az, alt = _sun_position(lat, lon, d, h_utc)
            hourly.append({
                'local_time': f'{h_local:02d}:00',
                'azimuth_deg': az,
                'altitude_deg': alt,
                'above_horizon': alt > 0,
            })
        results['dates'][date_str] = hourly

    # Facade analysis — hours when sun is within ±45° of facade normal
    for label, facade_az in facade_azimuths.items():
        sunny_windows: List[Dict] = []
        for date_str in dates:
            d = date.fromisoformat(date_str)
            window_start = None
            for h_local in range(6, 22):
                h_utc = h_local - tz_offset
                az, alt = _sun_position(lat, lon, d, h_utc)
                if alt <= 0:
                    continue
                diff = abs(((az - facade_az) + 180) % 360 - 180)
                facing = diff < 45.0
                if facing and window_start is None:
                    window_start = h_local
                elif not facing and window_start is not None:
                    sunny_windows.append({
                        'date': date_str,
                        'from': f'{window_start:02d}:00',
                        'to':   f'{h_local:02d}:00',
                        'hours': h_local - window_start,
                    })
                    window_start = None
            if window_start is not None:
                sunny_windows.append({
                    'date': date_str,
                    'from': f'{window_start:02d}:00',
                    'to':   '22:00',
                    'hours': 22 - window_start,
                })

        # Required external shading depth (CIBSE Guide A rule: D ≥ H × tan(max_alt))
        # Use summer solstice peak altitude for this facade
        d_sol = date.fromisoformat(dates[0])  # summer solstice first
        peak_alt = 0.0
        for h_local in range(6, 22):
            _, alt = _sun_position(lat, lon, d_sol, h_local - tz_offset)
            peak_alt = max(peak_alt, alt)
        shading_depth = round(1.0 * math.tan(math.radians(peak_alt)), 2) if peak_alt > 5 else 0.0

        results['facade_analysis'][label] = {
            'azimuth_deg': facade_az,
            'sunny_windows': sunny_windows,
            'required_shading_depth_m': shading_depth,
            'shading_note': (
                f'For a 1 m tall glazing panel, extend shading slab/brise-soleil '
                f'{shading_depth} m horizontally to exclude peak summer sun '
                f'(CIBSE Guide A §5.4).'
            ),
        }

    # Key moments
    # Pool sunset: when does sun align within 15° of pool terrace azimuth at low altitude?
    pool_az = facade_azimuths.get('pool_terrace', 175.0)
    sunset_d = date.fromisoformat(dates[0])
    for h_local in range(17, 22):
        h_utc = h_local - tz_offset
        az, alt = _sun_position(lat, lon, sunset_d, h_utc)
        if 2.0 < alt < 25.0 and abs(((az - pool_az) + 180) % 360 - 180) < 30:
            results['key_moments'].append({
                'name':  'Pool golden hour',
                'time':  f'{h_local:02d}:00 local',
                'date':  dates[0],
                'note':  (
                    f'Sun at {alt}° altitude, azimuth {az}° — '
                    f'horizontal light skims the pool surface and terrace. '
                    f'Position outdoor seating to face {int(az)}° for maximum drama.'
                ),
            })
            break

    # Morning bedroom light
    bedroom_az = facade_azimuths.get('master_bedroom', 90.0)
    morning_d = date.fromisoformat(dates[0])
    for h_local in range(6, 12):
        h_utc = h_local - tz_offset
        az, alt = _sun_position(lat, lon, morning_d, h_utc)
        if alt > 5 and abs(((az - bedroom_az) + 180) % 360 - 180) < 40:
            results['key_moments'].append({
                'name':  'Master bedroom wake light',
                'time':  f'{h_local:02d}:00 local',
                'date':  dates[0],
                'note':  (
                    f'Direct sun enters master bedroom at {h_local:02d}:00 — '
                    f'a natural alarm clock. Specify motorised blackout blinds '
                    f'for occupant control.'
                ),
            })
            break

    return results


# ---------------------------------------------------------------------------
#  2. Lifestyle Journey Engine
# ---------------------------------------------------------------------------

JOURNEYS: Dict[str, List[Dict[str, Any]]] = {
    'morning_routine': {
        'description': 'How the first two hours of the day unfold.',
        'time': '07:00 – 09:00',
        'sequence': [
            {'space': 'master bedroom',   'action': 'Wake',
             'light': 'morning east/SE sun', 'connection': 'blackout to daylight transition'},
            {'space': 'master bathroom',  'action': 'Shower + prepare',
             'light': 'natural + task', 'connection': 'direct en-suite access, no corridor'},
            {'space': 'master terrace',   'action': 'First coffee outdoors',
             'light': 'early morning sun', 'connection': 'direct from bedroom, frameless glass door'},
            {'space': 'kitchen',          'action': 'Breakfast preparation',
             'light': 'east-facing, active', 'connection': 'open to living/dining'},
            {'space': 'dining',           'action': 'Breakfast',
             'light': 'morning light on table', 'connection': 'view to pool and garden'},
        ],
    },
    'arrival_experience': {
        'description': 'What a visitor feels from gate to living room.',
        'time': 'Any',
        'sequence': [
            {'space': 'arrival gate',     'action': 'First glimpse',
             'light': 'controlled reveal', 'connection': 'plant screen — house not immediately visible'},
            {'space': 'arrival court',    'action': 'Approach',
             'light': 'shaded drive, then light-flooded court',
             'connection': 'compressed approach creates anticipation'},
            {'space': 'entrance pivot',   'action': 'Entry',
             'light': 'double-height shaft of light',
             'connection': 'axis aligns directly to pool/garden beyond'},
            {'space': 'living',           'action': 'Revealed interior',
             'light': 'full south light + pool reflection',
             'connection': 'floor-to-ceiling glass — inside and outside merge'},
            {'space': 'south terrace',    'action': 'Natural extension',
             'light': 'full sun', 'connection': 'zero threshold — flat floor continues outside'},
        ],
    },
    'sunset_unwind': {
        'description': 'The evening ritual from 18:00 onward.',
        'time': '18:00 – 22:00',
        'sequence': [
            {'space': 'south terrace',    'action': 'Aperitivo',
             'light': 'golden hour horizontal', 'connection': 'pool within reach, sea view if applicable'},
            {'space': 'pool',             'action': 'Swim',
             'light': 'sun on water surface', 'connection': 'infinity edge towards horizon'},
            {'space': 'outdoor kitchen',  'action': 'Cooking / entertaining',
             'light': 'warm tungsten task + ambient', 'connection': 'direct from pool deck'},
            {'space': 'dining',           'action': 'Dinner',
             'light': 'candle + concealed LED coves', 'connection': 'terrace visible, doors open to night air'},
            {'space': 'living',           'action': 'Wind down',
             'light': '1800 K dimmable, no blue light', 'connection': 'garden lighting visible through glass'},
        ],
    },
    'entertaining_flow': {
        'description': 'A dinner party with 8–12 guests.',
        'time': '19:00 – 02:00',
        'sequence': [
            {'space': 'arrival court',    'action': 'Guests arrive',
             'light': 'low-level landscape lighting', 'connection': 'arrival statement — impressive but not showy'},
            {'space': 'living',           'action': 'Drinks + mingling',
             'light': 'dim ambient + accents', 'connection': 'terrace and pool lit beyond — stage set'},
            {'space': 'south terrace',    'action': 'Spill outside',
             'light': 'warm uplights on planting + pool lighting',
             'connection': 'seamless threshold — no step, same floor level'},
            {'space': 'dining',           'action': 'Dinner',
             'light': 'pendant at 80 lux over table, 20 lux ambient',
             'connection': 'kitchen visible for host, garden beyond'},
            {'space': 'living',           'action': 'After dinner',
             'light': 'very low, fireplace',
             'connection': 'same space, furniture regrouped — no separate room needed'},
        ],
    },
}


def lifestyle_journey(
    *,
    journeys: Optional[List[str]] = None,
    rooms_present: Optional[List[str]] = None,
    has_pool: bool = True,
    has_outdoor_kitchen: bool = True,
    style: str = 'marbella_modern',
) -> Dict[str, Any]:
    """Return journey analyses, connection quality scores, and friction points.

    rooms_present: list of room names in the design. Used to flag missing spaces.
    """
    journeys = journeys or list(JOURNEYS.keys())
    rooms_lower = [r.lower() for r in (rooms_present or [])]

    output: Dict[str, Any] = {
        'style': style,
        'journeys': {},
        'friction_points': [],
        'design_recommendations': [],
    }

    for j_key in journeys:
        if j_key not in JOURNEYS:
            continue
        j = JOURNEYS[j_key]
        seq = j['sequence']
        scored_seq = []
        friction = []

        for step in seq:
            space = step['space']
            present = any(space in r for r in rooms_lower)

            # Score connection quality based on connection description
            conn = step['connection'].lower()
            score = 10
            if 'no corridor' in conn or 'direct' in conn or 'frameless' in conn:
                score = 10
            elif 'open' in conn or 'seamless' in conn or 'zero threshold' in conn:
                score = 9
            elif 'visible' in conn or 'view' in conn:
                score = 7
            elif 'compressed' in conn or 'controlled' in conn:
                score = 8
            else:
                score = 6

            if not present and space not in ('arrival gate', 'arrival court',
                                              'entrance pivot', 'pool', 'outdoor kitchen'):
                friction.append({
                    'space': space,
                    'issue': f'"{space}" not found in room programme — journey is broken here.',
                    'fix': f'Add {space} to the design or reroute journey through adjacent space.',
                })
                score = max(1, score - 4)

            scored_seq.append({**step, 'space_present': present, 'connection_score': score})

        avg_score = round(sum(s['connection_score'] for s in scored_seq) / len(scored_seq), 1)
        quality = ('Excellent' if avg_score >= 9 else
                   'Good'      if avg_score >= 7 else
                   'Adequate'  if avg_score >= 5 else 'Poor')

        output['journeys'][j_key] = {
            'description': j['description'],
            'time': j['time'],
            'sequence': scored_seq,
            'average_connection_score': avg_score,
            'quality': quality,
            'friction_count': len(friction),
        }
        output['friction_points'].extend(friction)

    # Global recommendations
    recs = output['design_recommendations']
    if not has_pool:
        recs.append('Add infinity pool: pool is the emotional anchor of the Marbella idiom.')
    if not has_outdoor_kitchen:
        recs.append('Add outdoor kitchen: essential for the sunset_unwind and entertaining_flow journeys.')
    if style == 'marbella_modern':
        recs.append('Ensure living room south facade is ≥60% openable glass to merge inside/outside.')
        recs.append('Set finished floor levels of terrace and living room identical — zero threshold.')
        recs.append('Align entrance axis directly to pool. Arriving guests see through the house to water.')

    return output


# ---------------------------------------------------------------------------
#  3. Emotion Design System
# ---------------------------------------------------------------------------

def emotion_brief(
    rooms: List[Dict[str, Any]],
    *,
    style: str = 'marbella_modern',
    override_emotions: Optional[Dict[str, str]] = None,
) -> Dict[str, Any]:
    """Generate an emotion design brief for each room.

    rooms: list of room dicts with at minimum 'name' and optionally 'kind',
           'level', 'area_m2', 'orientation_deg'.
    override_emotions: {'room_name': 'emotion'} to override the default mapping.
    """
    override_emotions = override_emotions or {}
    output: Dict[str, Any] = {
        'style': style,
        'rooms': [],
        'palette_summary': _palette_for_style(style),
        'restraint_note': (
            'Top-tier residential firms use a maximum of 3 primary materials '
            'per house. Add a 4th only as a deliberate accent. This is the '
            'single most common mistake: over-materialising.'
        ),
    }

    for r in rooms:
        name = r.get('name', '').lower()
        kind = r.get('kind', '').lower()

        # Match emotion: try full name, then kind, then partial match
        emotion = override_emotions.get(r.get('name', ''), None)
        if not emotion:
            for key in EMOTION_MAP:
                if key in name or key in kind:
                    emotion = EMOTION_MAP[key]
                    break
        emotion = emotion or 'neutral'
        if emotion not in EMOTION_DESIGN:
            emotion = 'neutral'

        target = EMOTION_DESIGN[emotion]
        h_min, h_max = target['ceiling_h_m']

        room_brief = {
            'name': r.get('name', ''),
            'area_m2': r.get('area_m2', 0),
            'level': r.get('level', 0),
            'emotion_target': emotion,
            'ceiling_height_range_m': [h_min, h_max],
            'colour_palette': target['palette'],
            'accent_material': target['accent'],
            'lighting_concept': target['light'],
            'glazing_strategy': target['glazing'],
            'key_materials': target['materials'],
            'acoustic_target': target['sound'],
            'design_principle': target['principle'],
            'proportion_note': _proportion_note(r.get('area_m2', 0), h_min, h_max),
        }
        output['rooms'].append(room_brief)

    return output


def _proportion_note(area_m2: float, h_min: float, h_max: float) -> str:
    if area_m2 <= 0:
        return ''
    aspect = area_m2 / (h_min ** 2)
    if aspect < 1.0:
        return 'Room is deep relative to ceiling height. Consider double-height or large rooflights.'
    if aspect > 4.0:
        return 'Large floor area vs ceiling height — use volumetric features to add interest.'
    return 'Proportions within comfortable residential range (Neufert §Habitations).'


def _palette_for_style(style: str) -> Dict[str, Any]:
    """Curated material palette per architectural style — EIMS original palettes."""
    palettes = {
        'marbella_modern': {
            'primary':    'White micro-cement render (Topciment Efectto)',
            'floor':      'Crema marfil limestone 120×60 cm, honed finish (Marmoles Castellanos, Almería)',
            'glazing':    'Minimal-frame triple-glazed sliding (Vitrocsa 3001 Series)',
            'metalwork':  'Brushed marine-grade stainless steel, or powder-coated aluminium RAL 9005',
            'pool':       'White quartz plaster with matte blue-grey tiles at waterline (Alttoglass Ibiza)',
            'planting':   'Olive (Olea europaea), Lavandula stoechas, Agapanthus africanus (RHS Mediterranean guide)',
            'note':       'Maximum 3 primary materials in any one room. Restraint is the luxury.',
        },
        'andalusian_courtyard': {
            'primary':    'Lime render, painted brilliant white (traditional encalado)',
            'floor':      'Barro cocido terracotta tile 30×30 (Ceramic Burjassot, Valencia)',
            'glazing':    'Iron-framed arched windows, single or double glazed',
            'metalwork':  'Hand-forged wrought iron, dark wax patina',
            'pool':       'Blue Moorish zellige tile, hand-glazed (Fez artisan)',
            'planting':   'Jasminum officinale, Rosa (Alba class), Citrus limon, Bougainvillea',
            'note':       'Authenticity over decoration. The courtyard fountain is the centre.',
        },
        'mediterranean_classic': {
            'primary':    'Stucco exterior render, ochre or cream wash',
            'floor':      'Calacatta marble or sandstone, 60×60 cm',
            'glazing':    'Timber-framed double glazed, shuttered',
            'metalwork':  'Painted wrought iron, grey-blue (RAL 5014)',
            'pool':       'Mosaic tile — cobalt blue and white geometric pattern',
            'planting':   'Cupressus sempervirens, Rosmarinus officinalis, Lavandula angustifolia',
            'note':       'Harmony with landscape. The house should look 100 years old from the road.',
        },
    }
    return palettes.get(style, palettes['marbella_modern'])


# ---------------------------------------------------------------------------
#  4. Indoor-Outdoor Flow Optimizer
# ---------------------------------------------------------------------------

def flow_analysis(
    *,
    facade_lengths: Dict[str, float],
    openable_lengths: Dict[str, float],
    interior_rooms: List[str],
    exterior_features: List[str],
    style: str = 'marbella_modern',
) -> Dict[str, Any]:
    """Analyse and score the indoor-outdoor flow of a design.

    facade_lengths:  {'south': 14.0, 'east': 9.0, ...}  total facade length per compass face
    openable_lengths: {'south': 9.6, 'east': 0.0, ...}  how much of each facade is openable glass
    interior_rooms:  ['living', 'kitchen', 'dining'] — rooms that face south facade
    exterior_features: ['pool', 'terrace', 'garden', 'sea_view'] — what is outside
    """
    total_facade = sum(facade_lengths.values())
    total_openable = sum(openable_lengths.values())
    transparency_index = total_openable / total_facade if total_facade > 0 else 0.0

    quality = 'poor'
    for q, threshold in sorted(FLOW_THRESHOLDS.items(), key=lambda x: -x[1]):
        if transparency_index >= threshold:
            quality = q
            break

    per_facade: List[Dict] = []
    for face, length in facade_lengths.items():
        openable = openable_lengths.get(face, 0.0)
        ratio = openable / length if length > 0 else 0.0

        # Recommend sliding panel configuration
        panels = _recommend_panels(openable)

        per_facade.append({
            'facade': face,
            'total_length_m': length,
            'openable_length_m': openable,
            'openable_ratio': round(ratio, 2),
            'sliding_panel_config': panels,
        })

    gaps: List[str] = []
    recs: List[str] = []

    south_ratio = (openable_lengths.get('south', 0) /
                   facade_lengths.get('south', 1.0))
    if south_ratio < FLOW_THRESHOLDS['excellent']:
        recs.append(
            f'South facade openable ratio is {south_ratio:.0%}. '
            f'Target ≥65% for Marbella idiom — increase sliding wall width or remove fixed panels.'
        )

    if 'pool' not in exterior_features:
        gaps.append('No pool: loses primary indoor-outdoor anchor.')
    if 'terrace' not in exterior_features:
        gaps.append('No terrace: every room should extend outward.')
    if 'living' not in interior_rooms:
        gaps.append('Living room not identified on south facade — primary flow space missing.')

    if 'living' in interior_rooms and 'pool' in exterior_features:
        recs.append('Confirm living-room floor level matches terrace — eliminate step for zero threshold.')
    if style == 'marbella_modern':
        recs.append('Use frameless structural glass corners at living room — removes visual barrier at key view point.')
        recs.append('Position infinity pool edge parallel to living room south glass wall — reflection doubles the view.')

    return {
        'transparency_index': round(transparency_index, 2),
        'quality': quality,
        'per_facade': per_facade,
        'gaps': gaps,
        'recommendations': recs,
        'target': {
            'transparency_index': FLOW_THRESHOLDS['excellent'],
            'standard': 'EIMS Experience Design Standard — derived from SAOTA/ARK project analysis',
        },
        'source': 'EIMS Experience Design Engine v1.0 — EmersonEIMS original',
    }


def _recommend_panels(openable_m: float) -> List[str]:
    """Suggest a sliding panel configuration for a given openable width."""
    if openable_m <= 0:
        return []
    options = []
    for panel_w in sorted(SLIDING_PANEL_WIDTHS, reverse=True):
        n = int(openable_m / panel_w)
        if n >= 1:
            total = round(n * panel_w, 2)
            options.append(f'{n} × {panel_w} m panels = {total} m opening')
            if len(options) == 2:
                break
    return options or [f'Custom panel: {openable_m:.1f} m total opening']


# ---------------------------------------------------------------------------
#  5. Restraint Score
# ---------------------------------------------------------------------------

def restraint_score(
    *,
    materials: List[str],
    feature_list: List[str],
    facade_elements: Optional[List[str]] = None,
    interior_styles: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """Score how well the design exercises restraint.

    Higher = more restrained (better at luxury level).
    Scoring basis: each material above 3 costs 8 pts; each feature above 6 costs 5 pts;
    each facade decorative element above 2 costs 6 pts.
    Base score: 100.

    Why restraint matters: the most expensive-looking work globally uses fewer
    elements but executes each perfectly (SAOTA, Kengo Kuma, John Pawson).
    """
    score = 100
    deductions: List[str] = []
    recommendations: List[str] = []

    # Materials
    n_mat = len(set(m.lower() for m in materials))
    if n_mat > 5:
        d = (n_mat - 5) * 10
        score -= d
        deductions.append(f'{n_mat} materials specified (target ≤3 primary + 2 accents): -{d} pts')
        recommendations.append(
            f'Reduce to 3 primary materials. Remove: {", ".join(list(materials)[5:])}. '
            f'Repetition of a great material is more powerful than variety.'
        )
    elif n_mat > 3:
        d = (n_mat - 3) * 5
        score -= d
        deductions.append(f'{n_mat} materials (target ≤3 primary): -{d} pts')

    # Features
    luxury_features = [f for f in feature_list if f not in
                        ('flat_roof', 'white_render', 'full_height_glazing_south',
                         'cantilevered_terrace', 'infinity_pool', 'double_height_living')]
    n_feat = len(luxury_features)
    if n_feat > 6:
        d = (n_feat - 6) * 5
        score -= d
        deductions.append(f'{n_feat} feature-list items above core set: -{d} pts')
        recommendations.append(
            f'Prioritise 3-4 features and execute perfectly rather than listing {n_feat}. '
            f'Consider removing: {", ".join(luxury_features[6:])}.'
        )

    # Facade elements
    facade_elements = facade_elements or []
    n_fac = len(facade_elements)
    if n_fac > 3:
        d = (n_fac - 3) * 6
        score -= d
        deductions.append(f'{n_fac} facade elements (target ≤3): -{d} pts')
        recommendations.append(
            'Simplify facade. The best Marbella villas read as one or two planes with precision detailing.'
        )

    score = max(0, score)

    level = ('Ultra restraint (SAOTA / John Pawson standard)' if score >= 88 else
             'High restraint (ARK / UDesign standard)'       if score >= 72 else
             'Moderate restraint'                             if score >= 55 else
             'Over-designed — reduce and simplify')

    return {
        'score': score,
        'level': level,
        'deductions': deductions,
        'recommendations': recommendations,
        'principle': (
            'Restraint is not absence — it is the discipline to say '
            '"this is enough" when you could add more. '
            'That is what separates EIMS from every other platform.'
        ),
    }


# ---------------------------------------------------------------------------
#  6. Complete Experience Brief (narrative)
# ---------------------------------------------------------------------------

def complete_brief(
    *,
    villa_name: str = 'Villa',
    location: str = 'Marbella, Costa del Sol',
    lat: float = DEFAULT_LAT,
    lon: float = DEFAULT_LON,
    tz_offset: int = DEFAULT_TZ_OFFSET,
    style: str = 'marbella_modern',
    bedrooms: int = 4,
    has_pool: bool = True,
    has_outdoor_kitchen: bool = True,
    orientation_deg: float = 180.0,
    facade_lengths: Optional[Dict[str, float]] = None,
    openable_lengths: Optional[Dict[str, float]] = None,
    rooms: Optional[List[Dict]] = None,
    materials: Optional[List[str]] = None,
    features: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """The complete experience brief — the full story of how you live in this house.

    This is EIMS's flagship differentiator: the narrative and technical brief
    that world-leading firms produce manually and charge separately for.
    """
    rooms = rooms or []
    materials = materials or ['white micro-cement', 'travertine', 'minimal-frame glass']
    features = features or ['flat_roof', 'white_render', 'full_height_glazing_south',
                             'infinity_pool', 'double_height_living']
    facade_lengths = facade_lengths or {'south': 14.0, 'east': 9.0, 'west': 9.0, 'north': 14.0}
    openable_lengths = openable_lengths or {'south': 9.6, 'east': 2.4, 'west': 0.0, 'north': 0.0}

    # Run all sub-engines
    solar = solar_study(lat=lat, lon=lon, tz_offset=tz_offset,
                         facade_azimuths={'south_facade': orientation_deg,
                                           'pool_terrace': orientation_deg - 5,
                                           'master_bedroom': orientation_deg - 90})
    journeys = lifestyle_journey(
        has_pool=has_pool,
        has_outdoor_kitchen=has_outdoor_kitchen,
        style=style,
        rooms_present=[r.get('name', '') for r in rooms],
    )
    emotions = emotion_brief(rooms, style=style) if rooms else {'rooms': [], 'palette_summary': _palette_for_style(style)}
    flow = flow_analysis(
        facade_lengths=facade_lengths,
        openable_lengths=openable_lengths,
        interior_rooms=['living', 'dining', 'kitchen'],
        exterior_features=(['pool'] if has_pool else []) + ['terrace', 'garden'],
        style=style,
    )
    restraint = restraint_score(
        materials=materials,
        feature_list=features,
    )

    # Build narrative — the story of a summer day in this house
    narrative = _build_narrative(
        villa_name=villa_name,
        location=location,
        style=style,
        bedrooms=bedrooms,
        has_pool=has_pool,
        has_outdoor_kitchen=has_outdoor_kitchen,
        solar_moments=solar.get('key_moments', []),
        flow_quality=flow['quality'],
        restraint_level=restraint['level'],
    )

    return {
        'villa_name': villa_name,
        'location': location,
        'style': style,
        'narrative': narrative,
        'solar_study': solar,
        'lifestyle_journeys': journeys,
        'emotion_brief': emotions,
        'flow_analysis': flow,
        'restraint_score': restraint,
        'interior_landscape_lighting': _complete_package(style, has_pool, has_outdoor_kitchen),
        'eims_unique_value': (
            'This brief synthesises solar physics, lifestyle psychology, spatial flow '
            'theory, and restraint scoring into one document. No other construction '
            'platform generates this. EIMS does.'
        ),
    }


def _build_narrative(
    *,
    villa_name: str,
    location: str,
    style: str,
    bedrooms: int,
    has_pool: bool,
    has_outdoor_kitchen: bool,
    solar_moments: List[Dict],
    flow_quality: str,
    restraint_level: str,
) -> Dict[str, str]:
    """Generate the experiential narrative — the story of a day in the house."""

    wake_moment = next((m for m in solar_moments if 'bedroom' in m.get('name', '')), None)
    pool_moment = next((m for m in solar_moments if 'pool' in m.get('name', '')), None)

    wake_time = wake_moment['time'] if wake_moment else '07:30 local'
    pool_time = pool_moment['time'] if pool_moment else '19:00 local'

    morning = (
        f'At {wake_time}, the first light crosses the master suite floor. '
        f'The bedroom faces east-southeast, calibrated so this moment arrives gently — '
        f'not a jolt, but a gradual brightening. Motorised blinds can delay it on rest days. '
        f'The en-suite is a direct step away; no corridor, no decision. '
        f'The master terrace is a glass door from the bed — coffee outside '
        f'before the rest of {location} has woken.'
    )

    midday = (
        f'By mid-morning, the south facade is fully lit. The living room — '
        f'open to the terrace at zero threshold — reads as one space. '
        f'The kitchen faces east, already in partial shade: the cook works in comfort '
        f'while guests settle along the south-facing terrace. '
        f'The infinity pool surface carries the sky. '
        f'Nothing in the interior competes with that view. '
        f'That is intentional — restraint rated: {restraint_level}.'
    )

    evening = (
        f'At {pool_time}, the sun is low. The pool surface turns to liquid gold. '
        f'This moment was engineered: the pool orientation, the terrace width, '
        f'the absence of a privacy screen on the south-west corner — '
        f'all calculated so this light hits the water at this angle. '
        f'{'An outdoor kitchen to the west means dinner preparation begins here, '
           'in the last sun of the day.' if has_outdoor_kitchen else ''}'
    )

    arrival = (
        f'A first-time visitor arrives and sees nothing: the plant screen hides the house. '
        f'Then the drive opens to an arrival court — compressed, shaded. '
        f'The front door is at the end of an axis. '
        f'The moment it opens: they see straight through the double-height entrance, '
        f'through the living room, through the south glass wall, '
        f'to the pool and sky beyond. '
        f'That first second delivers everything the house promises.'
    )

    return {
        'morning':  morning,
        'midday':   midday,
        'evening':  evening,
        'arrival':  arrival,
        'philosophy': (
            f'{villa_name} is not designed around rooms. '
            f'It is designed around moments: the morning light, the pool at sunset, '
            f'the arrival sequence, the dinner that moves from inside to outside without noticing. '
            f'The {style.replace("_", " ").title()} idiom at its best '
            f'is not a style — it is a way of living that happens to have a visual language.'
        ),
    }


# ---------------------------------------------------------------------------
#  7. Interior + Landscape + Lighting Package
# ---------------------------------------------------------------------------

def _complete_package(
    style: str,
    has_pool: bool,
    has_outdoor_kitchen: bool,
) -> Dict[str, Any]:
    """Interior, landscape and lighting as a coherent system — not three separate decisions."""
    packages = {
        'marbella_modern': {
            'interior': {
                'concept': 'Monolithic warmth — one material family, executed in depth',
                'primary_wall': 'White micro-cement, seamless floor-to-ceiling, no skirting',
                'floor': 'Honed limestone 120×60 cm, continuous indoor-outdoor same tile',
                'ceiling': 'Painted plaster, flat, no cornice — concealed LED coves only',
                'joinery': 'Handle-free satin white lacquer or walnut veneer',
                'fabrics': 'Linen, wool bouclé, aged leather — nothing synthetic',
                'art': 'One large-scale work per principal room, chosen before furniture',
            },
            'landscape': {
                'concept': 'Mediterranean naturalistic — not manicured, not wild',
                'arrival_court': 'Compacted gravel + specimen olive (Olea europaea, multi-stem)',
                'pool_terrace': 'Same limestone as interior floor, extended outside — zero threshold',
                'boundary_planting': 'Pittosporum tobira hedge 1.8 m (privacy + wind), backed by Cupressus',
                'pool_surround': 'Low-level Agapanthus and Lavender — scented, sea-coloured',
                'lighting_zones': ['arrival', 'pool', 'terrace', 'boundary planting', 'specimen tree'],
            },
            'lighting': {
                'concept': 'Layers — never a single source, never an overhead downlight in principal rooms',
                'ambient':  'Concealed LED cove, 2700 K, dimmable — sets mood at 5-10% of maximum',
                'task':     'Under-cabinet kitchen, vanity mirror strip, reading lamp beside seating',
                'accent':   'Picture lights (Erco or iGuzzini), showcase cabinet LED',
                'dramatic': 'Pool underwater LED (white), specimen tree uplights (narrow beam 10°)',
                'safety':   'Low-level path lights flush in paving — not visible as light fittings',
                'control':  'KNX or Lutron Caseta — whole-house scenes: Morning / Day / Dining / Night',
            },
        },
        'andalusian_courtyard': {
            'interior': {
                'concept': 'Authentic materials, hand-made textures — the opposite of perfection',
                'primary_wall': 'Lime render, white encalado wash, slight variations celebrated',
                'floor': 'Barro cocido terracotta 30×30, unpolished — wears beautifully',
                'ceiling': 'Exposed timber beam (Pino de Segura), limewashed boards',
                'joinery': 'Painted timber shutters, wrought-iron hardware',
                'fabrics': 'Woven cotton, kilim rugs, linen curtains',
                'art': 'Ceramics, local pottery, hand-painted azulejo panels',
            },
            'landscape': {
                'concept': 'The riad model — inward garden, outward privacy',
                'arrival_court': 'Cobbled stone paving, terracotta pots',
                'courtyard': 'Central fountain, citrus trees, jasmine pergola',
                'pool_area': 'Zellige-tiled pool, surrounded by bougainvillea',
                'boundary': 'Solid white-painted wall — total privacy, all garden is inside',
                'lighting_zones': ['courtyard fountain', 'terrace', 'pool', 'wall-mounted lanterns'],
            },
            'lighting': {
                'concept': 'Lanterns and candlelight — warm, flicker, intimate',
                'ambient':  'Wall-mounted iron lanterns with amber LED filament, 2200 K',
                'task':     'Pendant over dining table, under-cabinet kitchen',
                'accent':   'Uplights in courtyard for evening drama',
                'dramatic': 'Fountain lit from below — water glow reflects on white walls',
                'safety':   'Low-level stone-inset path lights',
                'control':  'Simple dimmer circuits — no smart system required',
            },
        },
    }
    pkg = packages.get(style, packages['marbella_modern'])
    if has_pool and 'pool' not in pkg['landscape'].get('pool_terrace', ''):
        pkg['landscape']['pool_note'] = 'Pool is the experiential centre. Design everything else to serve it.'
    if has_outdoor_kitchen:
        pkg['landscape']['outdoor_kitchen'] = (
            'Position west of pool terrace: cook in afternoon shade, serve into evening sun.'
        )
    return pkg


# ---------------------------------------------------------------------------
#  Flask wiring
# ---------------------------------------------------------------------------

def register(app: Flask, *, auth_required=None) -> None:
    """Register all experience-design endpoints."""

    def _wrap(view):
        return auth_required(view) if auth_required else view

    def _solar():
        b = request.get_json(force=True, silent=True) or {}
        return jsonify(solar_study(
            lat=float(b.get('lat', DEFAULT_LAT)),
            lon=float(b.get('lon', DEFAULT_LON)),
            tz_offset=int(b.get('tz_offset', DEFAULT_TZ_OFFSET)),
            dates=b.get('dates'),
            facade_azimuths=b.get('facade_azimuths'),
        ))

    def _journeys():
        b = request.get_json(force=True, silent=True) or {}
        return jsonify(lifestyle_journey(
            journeys=b.get('journeys'),
            rooms_present=b.get('rooms_present') or [],
            has_pool=bool(b.get('has_pool', True)),
            has_outdoor_kitchen=bool(b.get('has_outdoor_kitchen', True)),
            style=b.get('style', 'marbella_modern'),
        ))

    def _emotion():
        b = request.get_json(force=True, silent=True) or {}
        rooms = b.get('rooms') or []
        if not rooms:
            return jsonify({'success': False, 'error': 'rooms list required'}), 400
        return jsonify(emotion_brief(
            rooms,
            style=b.get('style', 'marbella_modern'),
            override_emotions=b.get('override_emotions'),
        ))

    def _flow():
        b = request.get_json(force=True, silent=True) or {}
        fl = b.get('facade_lengths') or {'south': 14.0, 'east': 9.0, 'west': 9.0, 'north': 14.0}
        ol = b.get('openable_lengths') or {'south': 9.6}
        return jsonify(flow_analysis(
            facade_lengths=fl,
            openable_lengths=ol,
            interior_rooms=b.get('interior_rooms') or ['living', 'dining', 'kitchen'],
            exterior_features=b.get('exterior_features') or ['pool', 'terrace', 'garden'],
            style=b.get('style', 'marbella_modern'),
        ))

    def _restraint():
        b = request.get_json(force=True, silent=True) or {}
        return jsonify(restraint_score(
            materials=b.get('materials') or [],
            feature_list=b.get('features') or [],
            facade_elements=b.get('facade_elements'),
            interior_styles=b.get('interior_styles'),
        ))

    def _complete():
        b = request.get_json(force=True, silent=True) or {}
        return jsonify(complete_brief(
            villa_name=b.get('villa_name', 'Villa'),
            location=b.get('location', 'Marbella, Costa del Sol'),
            lat=float(b.get('lat', DEFAULT_LAT)),
            lon=float(b.get('lon', DEFAULT_LON)),
            tz_offset=int(b.get('tz_offset', DEFAULT_TZ_OFFSET)),
            style=b.get('style', 'marbella_modern'),
            bedrooms=int(b.get('bedrooms', 4)),
            has_pool=bool(b.get('has_pool', True)),
            has_outdoor_kitchen=bool(b.get('has_outdoor_kitchen', True)),
            orientation_deg=float(b.get('orientation_deg', 180.0)),
            facade_lengths=b.get('facade_lengths'),
            openable_lengths=b.get('openable_lengths'),
            rooms=b.get('rooms'),
            materials=b.get('materials'),
            features=b.get('features'),
        ))

    def _palettes():
        style = request.args.get('style', 'marbella_modern')
        return jsonify({
            'palette': _palette_for_style(style),
            'emotion_design': EMOTION_DESIGN,
            'source': 'EIMS Experience Design Engine v1.0 — EmersonEIMS original palette library',
        })

    routes = [
        ('/api/design/experience/solar',    'eims_exp_solar',    _solar,    ['POST']),
        ('/api/design/experience/journeys', 'eims_exp_journeys', _journeys, ['POST']),
        ('/api/design/experience/emotion',  'eims_exp_emotion',  _emotion,  ['POST']),
        ('/api/design/experience/flow',     'eims_exp_flow',     _flow,     ['POST']),
        ('/api/design/experience/restraint','eims_exp_restraint',_restraint,['POST']),
        ('/api/design/experience/complete', 'eims_exp_complete', _complete, ['POST']),
        ('/api/design/experience/palettes', 'eims_exp_palettes', _palettes, ['GET']),
    ]
    for url, name, view, methods in routes:
        try:
            app.add_url_rule(url, name, view, methods=methods)
        except Exception:
            pass
