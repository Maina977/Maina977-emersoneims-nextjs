import { NextResponse } from 'next/server';
import { soilAt } from '@/lib/aquascan-soil/kenyaSoil';

/**
 * Soil properties at a point from the self-hosted Kenya SoilGrids extract.
 * Deterministic, no outbound calls. GET /api/aquascan/soil?lat=-1.29&lon=36.82
 */
export const runtime = 'nodejs';

export function GET(request: Request) {
  const u = new URL(request.url);
  const lat = Number(u.searchParams.get('lat'));
  const lon = Number(u.searchParams.get('lon'));
  if (!u.searchParams.get('lat') || !u.searchParams.get('lon') || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return NextResponse.json({ error: 'lat and lon are required, in decimal degrees' }, { status: 400 });
  }
  // Same input, same answer: cacheable for a day at the CDN.
  return NextResponse.json(soilAt(lat, lon), { headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' } });
}
