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

    // NASA's -999 fill values are dropped. No valid days → null, not a stand-in
    // (2026-11-14: missing data became 5.0 kWh/m²/day and 25 °C).
    const mean = (o: Record<string, number> | undefined) => {
      const v = Object.values(o ?? {}).filter((x) => typeof x === 'number' && x > -900);
      return v.length ? { value: v.reduce((a, b) => a + b, 0) / v.length, days: v.length } : null;
    };
    const ghi = mean(param.ALLSKY_SFC_SW_DWN);
    const temp = mean(param.T2M);
    const r = (x: number, dp: number) => Math.round(x * 10 ** dp) / 10 ** dp;

    return NextResponse.json({
      status: ghi ? 'OK' : 'INSUFFICIENT EVIDENCE',
      location: { latitude: lat, longitude: lon },
      parameters: param,
      source: 'NASA POWER daily (community RE), NASA Langley Research Center',
      summary: {
        daysWithIrradiance: ghi?.days ?? 0,
        annualGHI: ghi ? Math.round(ghi.value * 365) : null,
        averageDailyGHI: ghi ? r(ghi.value, 2) : null,
        peakSunHours: ghi ? r(ghi.value, 2) : null,
        // Rule of thumb for fixed tilt (≈ 0.76·|latitude| + 3.1°); confirm with a production model.
        optimalTiltAngle: Math.round(Math.abs(lat) * 0.76 + 3.1),
        averageTemperature: temp ? r(temp.value, 1) : null,
        temperatureCoefficient: temp ? r(1 - (temp.value - 25) * 0.004, 3) : null,
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
