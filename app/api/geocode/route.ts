import { NextRequest, NextResponse } from 'next/server';
import { limiter } from '@/lib/rate-limiter';
import { geocodeSearch, geocodeReverse, OSM_GEOCODE_ATTRIBUTION } from '@/lib/data-sources/nominatim';

/**
 * Geocoding for every EmersonEIMS tool (2026-11-14). Browsers used to call
 * Nominatim directly, which allowed no application-wide limit or cache.
 *
 * GET /api/geocode?q=Kitale                    → [{ displayName, lat, lon, … }]    (summary shape, unchanged)
 * GET /api/geocode?q=Kitale&format=nominatim   → Nominatim jsonv2-style array      (drop-in for former direct calls)
 * GET /api/geocode?lat=1.01&lon=35.0           → Nominatim reverse object
 *
 * Headers: X-Geocode-Status: OK | NO MATCH FOUND | SERVICE UNAVAILABLE.
 * Single lookups only: per-visitor limit of 15 a minute, so the endpoint cannot
 * serve autocomplete or bulk harvesting (Nominatim usage policy).
 */
export const dynamic = 'force-dynamic';

const PER_VISITOR_PER_MIN = 15;

function reply(status: 'OK' | 'NO MATCH FOUND' | 'SERVICE UNAVAILABLE', body: unknown, http = 200, cached = false) {
  return NextResponse.json(body, {
    status: http,
    headers: { 'X-Geocode-Status': status, 'X-Geocode-Attribution': OSM_GEOCODE_ATTRIBUTION, 'X-Geocode-Cache': cached ? 'hit' : 'miss' },
  });
}

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
  if (!limiter.check(PER_VISITOR_PER_MIN, `geocode:${ip}`).success) {
    return reply('SERVICE UNAVAILABLE', { status: 'SERVICE UNAVAILABLE', error: 'Too many place lookups from this connection. Wait a minute, or enter coordinates.' }, 429);
  }

  const lang = sp.get('accept-language') || 'en';

  // Reverse: coordinates → address.
  if (sp.has('lat') || sp.has('lon')) {
    const lat = Number(sp.get('lat')), lon = Number(sp.get('lon'));
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
      return NextResponse.json({ error: 'lat and lon must be valid coordinates' }, { status: 400 });
    }
    const r = await geocodeReverse(lat, lon, { zoom: Number(sp.get('zoom') ?? 18), acceptLanguage: lang });
    if (r.status === 'SERVICE UNAVAILABLE') return reply(r.status, { status: r.status, error: `SERVICE UNAVAILABLE: ${r.reason ?? 'geocoding did not answer'}` }, 503);
    if (r.status === 'NO MATCH FOUND') return reply(r.status, { status: r.status, error: 'Unable to geocode' }, 200, r.cached); // Nominatim's own no-match shape
    return reply(r.status, r.data, 200, r.cached);
  }

  // Forward: place name → coordinates.
  const q = (sp.get('q') || '').trim();
  if (q.length < 3) return NextResponse.json({ error: 'Missing or too-short query parameter q (3+ characters)' }, { status: 400 });
  const r = await geocodeSearch<Array<Record<string, any>>>(q, {
    limit: Number(sp.get('limit') ?? 5),
    countrycodes: sp.get('countrycodes') || undefined,
    acceptLanguage: lang,
  });
  if (r.status === 'SERVICE UNAVAILABLE') return reply(r.status, { status: r.status, error: `SERVICE UNAVAILABLE: ${r.reason ?? 'geocoding did not answer'}` }, 503);
  const rows = r.data ?? [];
  if (sp.get('format') === 'nominatim') return reply(r.status, rows, 200, r.cached);
  return reply(r.status, rows.map((x) => ({
    displayName: x.display_name,
    lat: parseFloat(x.lat),
    lon: parseFloat(x.lon),
    boundingBox: Array.isArray(x.boundingbox) ? x.boundingbox.map(parseFloat) : null,
    type: x.type,
    importance: x.importance,
  })), 200, r.cached);
}
