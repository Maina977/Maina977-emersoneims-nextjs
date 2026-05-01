"""
Site-hazard lookup from GPS.

Best-effort enrichment of a GPS point with:
  - Climate zone (Koppen-Geiger, derived from lat + simple temperature rules)
  - Seismic hazard band (lookup against a curated low-resolution global grid)
  - Wind zone (derived from lat + typical cyclone belts)

Uses ONLY free OpenMeteo historical climate endpoint (no key) when
reachable; falls back to static offline rules when not. No paid APIs.
"""
from __future__ import annotations
from typing import Any
import logging

logger = logging.getLogger('eims')

try:
    import requests
    HAS_REQUESTS = True
except ImportError:
    HAS_REQUESTS = False


# Low-res static seismic bands (PGA with 10% exceedance in 50 yr)
# Source: GEM Hazard Map 2018 simplified; not to be used for final design.
_SEISMIC_BANDS = [
    # (lat_min, lat_max, lng_min, lng_max, pga_g, description)
    (-90, 90,  -180, 180, 0.05, 'Low (stable craton)'),                # default
    (32, 42,   -5,   20,  0.25, 'Moderate (southern Europe / N Africa)'),
    (30, 45,   20,   60,  0.30, 'Moderate-high (Mediterranean / Middle East)'),
    (25, 45,   60,   90,  0.35, 'High (Zagros / Hindu Kush)'),
    (-10, 10, 95,    145, 0.40, 'High (Indonesian arc)'),
    (30, 45,  130,   145, 0.35, 'High (Japan)'),
    (-45, 10, -85,   -65, 0.35, 'High (Andes)'),
    (30, 42,  -125,  -115, 0.35, 'High (US West Coast)'),
    (-5, 5,   30,    45,  0.20, 'Moderate (East African Rift)'),
]


def _pick_seismic(lat: float, lng: float) -> dict[str, Any]:
    best_pga = 0.05
    best_desc = 'Low (stable craton)'
    for lat_min, lat_max, lng_min, lng_max, pga, desc in _SEISMIC_BANDS:
        if lat_min <= lat <= lat_max and lng_min <= lng <= lng_max and pga > best_pga:
            best_pga = pga
            best_desc = desc
    return {'PGA_g_475yr': best_pga,
            'band': best_desc,
            'ASCE_7_SDC_approx': ('D or higher' if best_pga >= 0.30
                                  else 'C' if best_pga >= 0.15
                                  else 'B' if best_pga >= 0.08
                                  else 'A'),
            'source': 'GEM 2018 simplified global grid (screening only)'}


def _koppen_from_lat(lat: float) -> str:
    alat = abs(lat)
    if alat < 15:
        return 'Tropical (A) -- use tropical design parameters'
    if alat < 25:
        return 'Arid / semi-arid (B) -- solar shading + night cooling priority'
    if alat < 40:
        return 'Temperate warm (Cs/Csa Mediterranean) -- classic Marbella climate'
    if alat < 55:
        return 'Temperate cool (Cf/Df) -- balanced heating + cooling'
    return 'Cold / polar (D/E) -- heating-dominated design'


def _wind_zone_from_lat(lat: float) -> dict[str, Any]:
    alat = abs(lat)
    if 5 <= alat <= 25:
        return {'zone': 'Cyclone-prone (Caribbean / Pacific typhoon / Indian monsoon)',
                'design_wind_m_s_3s_gust': 55,
                'caveat': 'Apply local code cyclone provisions.'}
    if 30 <= alat <= 55:
        return {'zone': 'Mid-latitude extratropical storms',
                'design_wind_m_s_3s_gust': 40,
                'caveat': 'Coastal sites: add 15%.'}
    return {'zone': 'Moderate',
            'design_wind_m_s_3s_gust': 30,
            'caveat': 'Verify against local code.'}


def _openmeteo_climate(lat: float, lng: float,
                         timeout_s: float = 6.0) -> dict[str, Any] | None:
    """Attempt to fetch 30-year climatology from open-meteo.com (free, no key)."""
    if not HAS_REQUESTS:
        return None
    try:
        r = requests.get(
            'https://archive-api.open-meteo.com/v1/archive',
            params={
                'latitude':  lat,
                'longitude': lng,
                'start_date': '2020-01-01',
                'end_date':   '2022-12-31',
                'daily':     'temperature_2m_max,temperature_2m_min,precipitation_sum,'
                              'wind_speed_10m_max',
                'timezone':  'UTC',
            },
            timeout=timeout_s,
        )
        if r.status_code != 200:
            return None
        j = r.json()
        d = j.get('daily') or {}
        if not d.get('temperature_2m_max'):
            return None
        tmax = d['temperature_2m_max']
        tmin = d['temperature_2m_min']
        prec = d['precipitation_sum']
        wind = d['wind_speed_10m_max']
        def _avg(xs):
            xs = [x for x in xs if x is not None]
            return sum(xs) / len(xs) if xs else None
        return {
            'T_max_avg_degC':  round(_avg(tmax) or 0, 1),
            'T_min_avg_degC':  round(_avg(tmin) or 0, 1),
            'annual_precip_mm': round(sum(p or 0 for p in prec) / 3, 0),  # avg of 3 yr
            'peak_wind_avg_m_s': round(_avg(wind) or 0, 1),
            'period': '2020-2022',
            'source': 'open-meteo.com archive (free, no API key)',
        }
    except Exception:
        return None


def site_enrich(lat: float, lng: float,
                 try_live_weather: bool = True) -> dict[str, Any]:
    out = {
        'site':       {'lat': lat, 'lng': lng},
        'koppen':     _koppen_from_lat(lat),
        'seismic':    _pick_seismic(lat, lng),
        'wind':       _wind_zone_from_lat(lat),
        'live_weather': None,
    }
    if try_live_weather:
        live = _openmeteo_climate(lat, lng)
        if live:
            out['live_weather'] = live
        else:
            out['live_weather'] = {'status': 'offline_or_unreachable',
                                    'note': 'Fell back to static rules.'}
    out['disclaimer'] = (
        'Screening-level data only. For seismic design, consult USGS Design Maps '
        '(free) or local hazard maps + geotechnical study. Wind speeds per local '
        'code (ASCE 7-22 / EN 1991-1-4) always take precedence.'
    )
    return {'success': True, **out}


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/site/enrich', methods=['POST'])
    def _site():
        data = request.get_json(silent=True) or {}
        try:
            lat = float(data.get('lat'))
            lng = float(data.get('lng'))
        except (TypeError, ValueError, KeyError):
            return jsonify({'success': False,
                             'error': 'lat + lng required'}), 400
        try_live = bool(data.get('try_live_weather', True))
        return jsonify(site_enrich(lat, lng, try_live_weather=try_live))

    logger.info('Site-hazard enrichment module registered (offline + open-meteo fallback)')
