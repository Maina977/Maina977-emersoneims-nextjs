/**
 * Site-specific location rule (safety hotfix 2026-11-25, review B2). AquaScan analyses only a
 * site-specific point: typed coordinates, the photo's camera GPS, or a place-search result
 * that is a village, locality or finer, at most MAX_PLACE_EXTENT_KM across. A country,
 * county or town name is refused with the reason; it is never analysed at its centre.
 */

/** Largest place-search extent accepted as a site location (bounding-box diagonal). */
export const MAX_PLACE_EXTENT_KM = 5;

/** OpenStreetMap address types too coarse to stand for a drilling site. */
const COARSE = new Set(['country', 'state', 'region', 'province', 'state_district', 'county', 'district', 'municipality', 'city', 'town', 'city_district', 'borough', 'continent', 'archipelago', 'island']);

export interface PlaceMatch { lat?: string | number; lon?: string | number; display_name?: string; addresstype?: string; type?: string; class?: string; boundingbox?: (string | number)[] }
export type PlacePrecision = { ok: true; kind: string; extentKm: number | null; note: string; needsConfirm: boolean } | { ok: false; kind: string; extentKm: number | null; reason: string };

/** Settlement types that OpenStreetMap often maps as a single point. */
const POINT_PLACES = new Set(['village', 'hamlet', 'suburb', 'neighbourhood', 'quarter', 'locality', 'isolated_dwelling', 'farm', 'allotments', 'croft']);

/**
 * Nominatim gives a point-mapped place a synthetic box centred on the point (±0.01° hamlet,
 * ±0.02° village/suburb). Such a box says nothing about the place's size.
 */
function syntheticPointBox(m: PlaceMatch): boolean {
  const b = m.boundingbox?.map(Number);
  const lat = Number(m.lat), lon = Number(m.lon);
  if (!b || b.length < 4 || !b.every(Number.isFinite) || !Number.isFinite(lat) || !Number.isFinite(lon)) return false;
  const [s, n, w, e] = b;
  const halfLat = (n - s) / 2, halfLon = (e - w) / 2;
  const centred = Math.abs((s + n) / 2 - lat) < 1e-6 && Math.abs((w + e) / 2 - lon) < 1e-6;
  return centred && Math.abs(halfLat - halfLon) < 1e-6 && halfLat <= 0.025 + 1e-9;
}

function bboxKm(b: (string | number)[] | undefined): number | null {
  if (!Array.isArray(b) || b.length < 4) return null;
  const [s, n, w, e] = b.map(Number);
  if (![s, n, w, e].every(Number.isFinite)) return null;
  const R = 6371, toR = Math.PI / 180;
  const dLat = (n - s) * toR, dLon = (e - w) * toR, mLat = ((n + s) / 2) * toR;
  return R * Math.sqrt(dLat ** 2 + (dLon * Math.cos(mLat)) ** 2);
}

export function placePrecision(m: PlaceMatch): PlacePrecision {
  const kind = String(m.addresstype || m.type || 'place');
  const km = bboxKm(m.boundingbox);
  if (COARSE.has(kind)) return { ok: false, kind, extentKm: km, reason: `"${m.display_name ?? 'This place'}" is a ${kind.replace('_', ' ')}, not a site. Search for the village or locality of the drilling spot, or enter its coordinates.` };
  const name = m.display_name ?? 'the place found';
  // Review R2: a village / hamlet / suburb mapped as a point is pinned at that point; the customer must confirm it.
  if (POINT_PLACES.has(kind) && syntheticPointBox(m)) {
    return { ok: true, kind, extentKm: null, needsConfirm: true, note: `Pinned at the centre of ${name} (${kind.replace('_', ' ')}). This is the centre of the ${kind.replace('_', ' ')}, not necessarily your site: move the pin by typing the exact coordinates, or confirm it below.` };
  }
  if (km == null) return { ok: false, kind, extentKm: null, reason: `The map service did not give the size of "${name}", so its precision is unknown. Enter the coordinates of the drilling spot instead.` };
  if (km > MAX_PLACE_EXTENT_KM) return { ok: false, kind, extentKm: km, reason: `"${name}" covers about ${Math.round(km)} km: too large to stand for a drilling site (at most ${MAX_PLACE_EXTENT_KM} km). Enter the coordinates of the drilling spot, or search a smaller named place nearby (a hamlet, school or landmark).` };
  return { ok: true, kind, extentKm: km, needsConfirm: true, note: `Pinned at the centre of ${name} (${kind.replace('_', ' ')}, about ${km < 1 ? km.toFixed(1) : Math.round(km)} km across). Move the pin by typing the exact coordinates, or confirm it below.` };
}

export const SITE_LOCATION_NEEDED = 'Location problem: AquaScan needs a site-specific location: type the coordinates, use the place search to pin the village or locality, or add a photo that has its camera GPS position. A country, county or town name alone is not analysed, and a photo cannot locate the site or show groundwater.';
