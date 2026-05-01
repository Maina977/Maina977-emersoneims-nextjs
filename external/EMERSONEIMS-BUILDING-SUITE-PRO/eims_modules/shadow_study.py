"""
Hourly shadow / solar-path study (architect tool).

Given a site GPS + date, returns:
  - sun altitude/azimuth hour-by-hour (sunrise to sunset)
  - shadow length + direction for a vertical pole / wall of given height
  - equinox + solstice comparison

Uses the pysolar library (MIT-licensed). No external APIs.
"""
from __future__ import annotations
from typing import Any
from datetime import datetime, timedelta, date, timezone, time as dtime
import math
import logging

logger = logging.getLogger('eims')

try:
    from pysolar.solar import get_altitude, get_azimuth
    HAS_PYSOLAR = True
except ImportError:
    HAS_PYSOLAR = False


def _local_day(lat: float, lng: float, d: date, utc_offset_hours: float) -> list[datetime]:
    """Hourly timestamps through local day 06:00 - 19:00 in UTC."""
    out = []
    for h in range(6, 20):
        local_dt = datetime.combine(d, dtime(h, 0)).replace(
            tzinfo=timezone(timedelta(hours=utc_offset_hours)))
        out.append(local_dt.astimezone(timezone.utc))
    return out


def sun_position(lat: float, lng: float, when_utc: datetime) -> dict[str, Any]:
    if not HAS_PYSOLAR:
        raise RuntimeError('pysolar not installed')
    alt = get_altitude(lat, lng, when_utc)
    az = get_azimuth(lat, lng, when_utc)
    return {'altitude_deg': round(alt, 3), 'azimuth_deg': round(az, 3)}


def shadow_length(pole_height_m: float, sun_altitude_deg: float) -> float:
    if sun_altitude_deg <= 0.1:
        return float('inf')
    return pole_height_m / math.tan(math.radians(sun_altitude_deg))


def hourly_shadow(*, lat: float, lng: float, d: date,
                   utc_offset_hours: float = 0.0,
                   pole_height_m: float = 3.0) -> dict[str, Any]:
    if not HAS_PYSOLAR:
        return {'success': False, 'error': 'pysolar library not available'}
    rows = []
    for utc in _local_day(lat, lng, d, utc_offset_hours):
        local = utc.astimezone(timezone(timedelta(hours=utc_offset_hours)))
        p = sun_position(lat, lng, utc)
        if p['altitude_deg'] <= 0:
            rows.append({'local_time': local.strftime('%H:%M'),
                         'altitude_deg': p['altitude_deg'],
                         'azimuth_deg':  p['azimuth_deg'],
                         'shadow_length_m': None,
                         'shadow_direction_deg': None,
                         'note': 'sun below horizon'})
            continue
        sl = shadow_length(pole_height_m, p['altitude_deg'])
        shadow_dir = (p['azimuth_deg'] + 180.0) % 360.0  # shadow opposite sun
        rows.append({'local_time': local.strftime('%H:%M'),
                     'altitude_deg': p['altitude_deg'],
                     'azimuth_deg':  p['azimuth_deg'],
                     'shadow_length_m': round(sl, 2) if sl != float('inf') else None,
                     'shadow_direction_deg': round(shadow_dir, 2)})
    return {
        'success': True,
        'site': {'lat': lat, 'lng': lng, 'utc_offset_hours': utc_offset_hours},
        'date': d.isoformat(),
        'pole_height_m': pole_height_m,
        'method': 'NREL SPA via pysolar (tolerance +/- 0.0003 deg on sun position)',
        'hourly': rows,
    }


def solstice_equinox_comparison(*, lat: float, lng: float, year: int,
                                 pole_height_m: float = 3.0) -> dict[str, Any]:
    dates = {
        'summer_solstice': date(year, 6, 21),
        'winter_solstice': date(year, 12, 21),
        'spring_equinox':  date(year, 3, 21),
        'autumn_equinox':  date(year, 9, 23),
    }
    out = {}
    for k, d in dates.items():
        noon_utc = datetime.combine(d, dtime(12, 0)).replace(tzinfo=timezone.utc)
        p = sun_position(lat, lng, noon_utc)
        out[k] = {
            'date': d.isoformat(),
            'solar_noon_altitude_deg': p['altitude_deg'],
            'solar_noon_azimuth_deg': p['azimuth_deg'],
            'shadow_at_noon_m': (round(shadow_length(pole_height_m, p['altitude_deg']), 2)
                                  if p['altitude_deg'] > 0 else None),
        }
    return {
        'success': True,
        'site': {'lat': lat, 'lng': lng},
        'year': year,
        'pole_height_m': pole_height_m,
        'key_dates': out,
        'design_implication': (
            'Use summer-solstice altitude to size roof overhang for cooling; '
            'winter-solstice altitude for solar-gain analysis; equinoxes for '
            'building-regs shading assessments.'
        ),
    }


def register(app, *, auth_required=None) -> None:
    from flask import jsonify, request

    @app.route('/api/arch/shadow/position', methods=['POST'])
    def _pos():
        data = request.get_json(silent=True) or {}
        try:
            lat = float(data.get('lat'))
            lng = float(data.get('lng'))
            when = data.get('datetime_utc')
            if when:
                dt = datetime.fromisoformat(str(when).replace('Z', '+00:00'))
                if dt.tzinfo is None:
                    dt = dt.replace(tzinfo=timezone.utc)
            else:
                dt = datetime.now(timezone.utc)
        except (TypeError, ValueError, KeyError) as e:
            return jsonify({'success': False, 'error': f'lat, lng required; {e}'}), 400
        try:
            p = sun_position(lat, lng, dt)
        except RuntimeError as e:
            return jsonify({'success': False, 'error': str(e)}), 503
        return jsonify({'success': True, 'site': {'lat': lat, 'lng': lng},
                        'datetime_utc': dt.isoformat(), **p})

    @app.route('/api/arch/shadow/hourly', methods=['POST'])
    def _hourly():
        data = request.get_json(silent=True) or {}
        try:
            lat = float(data.get('lat'))
            lng = float(data.get('lng'))
            d = date.fromisoformat(str(data.get('date', date.today().isoformat())))
            tz = float(data.get('utc_offset_hours', 0))
            ph = float(data.get('pole_height_m', 3.0))
            if ph <= 0:
                raise ValueError('pole_height_m must be > 0')
        except (TypeError, ValueError, KeyError) as e:
            return jsonify({'success': False, 'error': f'bad input: {e}'}), 400
        return jsonify(hourly_shadow(lat=lat, lng=lng, d=d,
                                      utc_offset_hours=tz, pole_height_m=ph))

    @app.route('/api/arch/shadow/solstice', methods=['POST'])
    def _solstice():
        data = request.get_json(silent=True) or {}
        try:
            lat = float(data.get('lat'))
            lng = float(data.get('lng'))
            y = int(data.get('year', date.today().year))
            ph = float(data.get('pole_height_m', 3.0))
        except (TypeError, ValueError, KeyError) as e:
            return jsonify({'success': False, 'error': f'bad input: {e}'}), 400
        try:
            return jsonify(solstice_equinox_comparison(lat=lat, lng=lng, year=y,
                                                        pole_height_m=ph))
        except RuntimeError as e:
            return jsonify({'success': False, 'error': str(e)}), 503

    logger.info('Shadow-study module registered (pysolar=%s, 3 endpoints)',
                 HAS_PYSOLAR)
