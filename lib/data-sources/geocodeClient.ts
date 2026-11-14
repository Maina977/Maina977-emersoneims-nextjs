/**
 * URLs for the site's own geocoding endpoint (/api/geocode), which applies the
 * Nominatim usage policy centrally: identification, 1 request/s application
 * wide, shared cache, per-visitor limits.
 *
 * Browser code must use these instead of calling nominatim.openstreetmap.org
 * directly (2026-11-14: seven components did, so no limit or cache applied).
 * The endpoint answers in Nominatim's own JSON shape, so callers' parsing is
 * unchanged. Failure: HTTP 503 with { status: 'SERVICE UNAVAILABLE' }.
 * Search with no match: []. Reverse with no match: { error: 'Unable to geocode' }.
 */
function base(): string {
  if (typeof window !== 'undefined') return '';
  return (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com').replace(/\/$/, '');
}

export function geocodeSearchUrl(q: string, o: { limit?: number; countrycodes?: string; lang?: string } = {}): string {
  const p = new URLSearchParams({ q, format: 'nominatim', limit: String(o.limit ?? 5), 'accept-language': o.lang ?? 'en' });
  if (o.countrycodes) p.set('countrycodes', o.countrycodes);
  return `${base()}/api/geocode?${p}`;
}

export function geocodeReverseUrl(lat: number, lon: number, o: { zoom?: number; lang?: string } = {}): string {
  const p = new URLSearchParams({ lat: String(lat), lon: String(lon), zoom: String(o.zoom ?? 18), 'accept-language': o.lang ?? 'en' });
  return `${base()}/api/geocode?${p}`;
}
