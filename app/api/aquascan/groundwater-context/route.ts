import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { groundwaterContext } from '@/lib/aquascan-geology/bgsAfricaGroundwater';
import { NO_STORE, edgeCacheHeaders } from '@/lib/http/edgeCache';

/**
 * GET /api/aquascan/groundwater-context?lat=&lon=
 * Regional (5 km, continental-scale) groundwater context from the BGS
 * quantitative maps of Africa: depth-to-groundwater, storage and productivity
 * classes. Not a site prediction (P1 2026-11-20; preview only).
 */
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const lat = Number(sp.get('lat')), lon = Number(sp.get('lon'));
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ status: 'INSUFFICIENT EVIDENCE', error: 'lat and lon must be valid coordinates' }, { status: 400, headers: NO_STORE });
  }
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!limiter.check(30, `gw-context:${ip}`).success) return NextResponse.json({ status: 'SERVICE UNAVAILABLE', error: 'Too many requests; try again in a minute.' }, { status: 429, headers: NO_STORE });
  const c = await groundwaterContext(lat, lon);
  const http = c.status === 'SERVICE UNAVAILABLE' ? 503 : 200;
  return NextResponse.json(c, { status: http, headers: edgeCacheHeaders(http) });
}
