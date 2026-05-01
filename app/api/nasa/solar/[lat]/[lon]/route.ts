import { NextRequest, NextResponse } from 'next/server';

const NASA_POWER_API = 'https://power.larc.nasa.gov/api/temporal/daily/point';
const PARAMETERS = [
  'ALLSKY_SFC_SW_DWN',
  'ALLSKY_SFC_SW_DNI',
  'ALLSKY_SFC_SW_DIFF',
  'CLRSKY_SFC_SW_DWN',
  'T2M',
  'T2M_MAX',
  'T2M_MIN',
  'RH2M',
  'WS10M',
  'PRECTOTCORR',
].join(',');

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
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setFullYear(startDate.getFullYear() - 1);
    const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');

    const qs = new URLSearchParams({
      parameters: PARAMETERS,
      community: 'RE',
      longitude: lon.toString(),
      latitude: lat.toString(),
      start: fmt(startDate),
      end: fmt(endDate),
      format: 'JSON',
    });

    const res = await fetch(`${NASA_POWER_API}?${qs}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      throw new Error(`NASA POWER API error: ${res.status}`);
    }

    const raw = await res.json();
    const param = raw.properties?.parameter ?? {};

    const ghiValues = Object.values(param.ALLSKY_SFC_SW_DWN ?? {}) as number[];
    const validGHI = ghiValues.filter((v) => v > -900);
    const avgDailyGHI = validGHI.length
      ? validGHI.reduce((a, b) => a + b, 0) / validGHI.length
      : 5.0;

    const tempValues = Object.values(param.T2M ?? {}) as number[];
    const validTemp = tempValues.filter((v) => v > -900);
    const avgTemp = validTemp.length
      ? validTemp.reduce((a, b) => a + b, 0) / validTemp.length
      : 25;

    return NextResponse.json({
      location: { latitude: lat, longitude: lon },
      parameters: param,
      summary: {
        annualGHI: Math.round(avgDailyGHI * 365),
        averageDailyGHI: Math.round(avgDailyGHI * 100) / 100,
        peakSunHours: Math.round(avgDailyGHI * 100) / 100,
        optimalTiltAngle: Math.round(Math.abs(lat) * 0.76 + 3.1),
        averageTemperature: Math.round(avgTemp * 10) / 10,
        temperatureCoefficient: Math.round((1 - (avgTemp - 25) * 0.004) * 1000) / 1000,
      },
    });
  } catch (err) {
    console.error('[nasa/solar]', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'NASA POWER fetch failed' },
      { status: 502 }
    );
  }
}
