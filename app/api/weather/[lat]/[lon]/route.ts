import { NextRequest, NextResponse } from 'next/server';

// Open-Meteo: free, no API key, CORS-safe from server-side
const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ lat: string; lon: string }> }
) {
  const { lat: latStr, lon: lonStr } = await params;
  const lat = parseFloat(latStr);
  const lon = parseFloat(lonStr);

  if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
  }

  try {
    const qs = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'cloud_cover',
        'wind_speed_10m',
        'wind_direction_10m',
        'precipitation',
        'weather_code',
      ].join(','),
      daily: [
        'temperature_2m_max',
        'temperature_2m_min',
        'precipitation_sum',
        'cloud_cover_mean',
        'wind_speed_10m_max',
        'shortwave_radiation_sum',
        'sunrise',
        'sunset',
      ].join(','),
      timezone: 'auto',
      forecast_days: '7',
    });

    const res = await fetch(`${OPEN_METEO}?${qs}`, {
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`Open-Meteo error: ${res.status}`);

    const d = await res.json();
    const cur = d.current ?? {};
    const daily = d.daily ?? {};

    const cloudCover: number = cur.cloud_cover ?? 0;
    const condition =
      cloudCover <= 10 ? 'excellent'
      : cloudCover <= 30 ? 'good'
      : cloudCover <= 60 ? 'moderate'
      : 'poor';

    const sunrise = daily.sunrise?.[0] ?? '';
    const sunset = daily.sunset?.[0] ?? '';
    let daylightHours = 0;
    if (sunrise && sunset) {
      daylightHours =
        Math.round(
          ((new Date(sunset).getTime() - new Date(sunrise).getTime()) / 3600000) * 10
        ) / 10;
    }

    const forecastDays: number = (daily.time ?? []).length;
    const forecast = Array.from({ length: forecastDays }, (_, i) => ({
      date: daily.time[i],
      temperature: {
        min: daily.temperature_2m_min?.[i] ?? null,
        max: daily.temperature_2m_max?.[i] ?? null,
      },
      cloudCover: daily.cloud_cover_mean?.[i] ?? 0,
      precipitation: daily.precipitation_sum?.[i] ?? 0,
      windSpeed: daily.wind_speed_10m_max?.[i] ?? 0,
      shortwaveRadiation: daily.shortwave_radiation_sum?.[i] ?? 0,
    }));

    return NextResponse.json({
      location: { latitude: lat, longitude: lon, timezone: d.timezone ?? 'UTC' },
      current: {
        temperature: cur.temperature_2m ?? null,
        feelsLike: cur.apparent_temperature ?? null,
        humidity: cur.relative_humidity_2m ?? null,
        cloudCover,
        windSpeed: cur.wind_speed_10m ?? null,
        windDirection: cur.wind_direction_10m ?? null,
        precipitation: cur.precipitation ?? null,
        weatherCode: cur.weather_code ?? null,
      },
      forecast,
      solarAnalysis: {
        currentCondition: condition,
        estimatedEfficiency: Math.round(100 - cloudCover * 0.75),
        daylightHours,
      },
    });
  } catch (err) {
    console.error('[weather]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Weather fetch failed' },
      { status: 502 }
    );
  }
}
