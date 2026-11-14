import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { fetchPowerHourly } from '@/lib/solar/design/nasaPowerHourly';

/**
 * GET /api/solar/hourly-weather?lat=&lon=&year=
 * A past year of hourly GHI and temperature from NASA POWER, for the hourly PV
 * engine (P1, 2026-11-15; preview only). Gaps → INSUFFICIENT EVIDENCE (never
 * filled). Upstream failure → SERVICE UNAVAILABLE. Cached per location/year.
 */
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const cache = new Map<string, { at: number; body: unknown }>();
const DAY = 86400e3;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get('lat')), lon = Number(sp.get('lon')), year = Number(sp.get('year'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return NextResponse.json({ status: 'INSUFFICIENT EVIDENCE', error: 'lat and lon are required' }, { status: 400 });
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!limiter.check(10, `hourly-weather:${ip}`).success) return NextResponse.json({ status: 'SERVICE UNAVAILABLE', error: 'Too many requests; try again in a minute.' }, { status: 429 });

  const key = `${lat.toFixed(2)},${lon.toFixed(2)},${year}`;
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < 30 * DAY) return NextResponse.json(hit.body, { headers: { 'X-Cache': 'hit' } });

  const w = await fetchPowerHourly(lat, lon, year);
  if (w.status === 'OK') {
    if (cache.size > 50) cache.delete(cache.keys().next().value as string);
    cache.set(key, { at: Date.now(), body: w });
    return NextResponse.json(w);
  }
  return NextResponse.json({ ...w, error: `${w.status}: ${w.reason}` }, { status: w.status === 'SERVICE UNAVAILABLE' ? 503 : 422 });
}
