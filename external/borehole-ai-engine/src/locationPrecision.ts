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
export type PlacePrecision = { ok: true; kind: string; extentKm: number; note: string } | { ok: false; kind: string; extentKm: number | null; reason: string };

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
  if (km == null) return { ok: false, kind, extentKm: null, reason: `The map service did not give the size of "${m.display_name ?? 'this place'}", so its precision is unknown. Enter the coordinates of the drilling spot instead.` };
  if (km > MAX_PLACE_EXTENT_KM) return { ok: false, kind, extentKm: km, reason: `"${m.display_name ?? 'This place'}" covers about ${Math.round(km)} km: too large to stand for a drilling site (at most ${MAX_PLACE_EXTENT_KM} km). Search for the village or locality, or enter coordinates.` };
  return { ok: true, kind, extentKm: km, note: `Pin set at the centre of ${m.display_name ?? 'the place found'} (${kind.replace('_', ' ')}, about ${km < 1 ? km.toFixed(1) : Math.round(km)} km across). Check that it is the drilling spot, or move it by entering coordinates.` };
}

export const SITE_LOCATION_NEEDED = 'Location problem: AquaScan needs a site-specific location: type the coordinates, use the place search to pin the village or locality, or add a photo that has its camera GPS position. A country, county or town name alone is not analysed, and a photo cannot locate the site or show groundwater.';
