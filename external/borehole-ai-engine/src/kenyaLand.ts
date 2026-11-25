/**
 * Is a point on Kenyan land? One check for every way a site reaches the
 * engine: typed coordinates, "Find & Re-analyze", place search and photo GPS
 * (2026-10-27 audit: re-analysis ran a full Kampala analysis, and points in
 * Lake Turkana and ~3-4 km offshore got full "drill" results).
 */

import { KENYA_RINGS } from './kenyaOutline';
import { KENYA_WATER, KENYA_COAST_BOX, KENYA_COAST_LAND } from './kenyaWater';

/**
 * Kenya's land outline (kenyaOutline.ts, ~550 m accuracy) with a ~3 km
 * tolerance for border wells and the simplification (2026-10-30 audit: the
 * coarse 40-point outline needed ~8 km and accepted points that far offshore).
 * Checked 2026-10-30: all 22,820 registry points, 27 border, coastal and
 * island towns, and 3,445 of 3,446 field records are accepted (the one
 * refused is geocoded 43 km inside Ethiopia); points 7 km off Mombasa,
 * Malindi and Lamu, and Tororo, Busia (Uganda side), Arusha, Tanga and Kismayo
 * are refused.
 */
const TOLERANCE_DEG = 0.03;

export function inKenya(lat: number, lon: number): boolean {
  let minD = Infinity;
  for (const R of KENYA_RINGS) {
    let inside = false;
    for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
      const [xi, yi] = R[i], [xj, yj] = R[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
      const dx = xi - xj, dy = yi - yj;
      const s = Math.max(0, Math.min(1, ((lon - xj) * dx + (lat - yj) * dy) / (dx * dx + dy * dy)));
      minD = Math.min(minD, Math.hypot(lon - (xj + s * dx), lat - (yj + s * dy)));
    }
    if (inside) return true;
  }
  return minD < TOLERANCE_DEG;
}

type Ring = [number, number][];

function inRings(lat: number, lon: number, rings: Ring[]): boolean {
  let inside = false;
  for (const R of rings) {
    for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
      const [xi, yi] = R[i], [xj, yj] = R[j];
      if ((yi > lat) !== (yj > lat) && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
    }
  }
  return inside;
}

/** Distance in km from the point to the nearest ring edge (local equirectangular). */
function edgeKm(lat: number, lon: number, rings: Ring[]): number {
  const kx = Math.cos((lat * Math.PI) / 180);
  let best = Infinity;
  for (const R of rings) {
    for (let i = 0, j = R.length - 1; i < R.length; j = i++) {
      const ax = (R[j][0] - lon) * kx, ay = R[j][1] - lat, bx = (R[i][0] - lon) * kx, by = R[i][1] - lat;
      const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      const s = L > 0 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / L)) : 0;
      best = Math.min(best, Math.hypot(ax + s * dx, ay + s * dy));
    }
  }
  return best * 111.32;
}

/**
 * Shoreline margins: inside a mapped water body but closer to its shore than this, the point is not
 * refused (the map or the pin may be off by that much); the customer confirms it is on land instead.
 * Lakes and reservoirs: OpenStreetMap, simplified to ~130 m. Coast: Natural Earth 10 m, ~220 m
 * simplification plus the source's own generalisation.
 */
export const LAKE_SHORE_MARGIN_KM = 0.3;
export const SEA_SHORE_MARGIN_KM = 1.0;

export type WaterAt =
  | { kind: 'lake' | 'reservoir' | 'sea'; name: string; nearShore: boolean; shoreKm: number }
  | null;

/**
 * Re-review of 126efdbc, M-2 (2026-11-25): open water at the point, from bundled offline maps
 * (kenyaWater.ts: OpenStreetMap lakes and reservoirs, ODbL; Natural Earth coast, public domain).
 * Replaces the Open-Meteo elevation check (a paid licence is needed for commercial use, and it was
 * unavailable on every run). It never needs the network, so it is never "unavailable".
 * Rivers are not checked: Kenyan river channels are narrower than the pin and map accuracy.
 */
export function openWaterAt(lat: number, lon: number): WaterAt {
  for (const w of KENYA_WATER) {
    if (!inRings(lat, lon, w.rings as Ring[])) continue;
    const km = edgeKm(lat, lon, w.rings as Ring[]);
    return { kind: w.kind === 'reservoir' ? 'reservoir' : 'lake', name: w.name, nearShore: km < LAKE_SHORE_MARGIN_KM, shoreKm: km };
  }
  const [x0, y0, x1, y1] = KENYA_COAST_BOX;
  if (lon >= x0 && lon <= x1 && lat >= y0 && lat <= y1 && !inRings(lat, lon, KENYA_COAST_LAND as Ring[]) && !inRings(lat, lon, KENYA_RINGS as Ring[])) {
    const km = Math.min(edgeKm(lat, lon, KENYA_COAST_LAND as Ring[]), edgeKm(lat, lon, KENYA_RINGS as Ring[]));
    return { kind: 'sea', name: 'the Indian Ocean', nearShore: km < SEA_SHORE_MARGIN_KM, shoreKm: km };
  }
  return null;
}

const where = (lat: number, lon: number) => `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
function waterRefusal(lat: number, lon: number, w: NonNullable<WaterAt>): string {
  return w.kind === 'sea'
    ? `${where(lat, lon)} is in the sea (${w.name}, ${w.shoreKm.toFixed(1)} km off the mapped coastline). Move the pin onto land.`
    : `${where(lat, lon)} is on open water (${w.name}, ${w.shoreKm.toFixed(1)} km from the mapped shore). Move the pin onto land.`;
}

export const WATER_CHECK_OK = 'Not on a mapped lake, reservoir or the sea (offline OpenStreetMap and Natural Earth maps)';

/**
 * Refusal plus the state of the water-body check (review R7: never a silent pass). 'near-shore':
 * the point is on a mapped water body but within the shoreline margin, so the customer confirms
 * on a map that it is on land before reports are released.
 */
export async function siteCheck(lat: number, lon: number): Promise<{ refusal: string | null; waterCheck: 'ok' | 'near-shore'; note: string }> {
  if (!inKenya(lat, lon)) return { refusal: await siteRefusal(lat, lon), waterCheck: 'ok', note: WATER_CHECK_OK };
  const w = openWaterAt(lat, lon);
  if (w && !w.nearShore) return { refusal: waterRefusal(lat, lon, w), waterCheck: 'ok', note: WATER_CHECK_OK };
  if (w) return { refusal: null, waterCheck: 'near-shore', note: `Water-body check inconclusive: the pin is within ${Math.max(0.1, w.shoreKm).toFixed(1)} km of the mapped ${w.kind === 'sea' ? 'coastline' : `shore of ${w.name}`}` };
  return { refusal: null, waterCheck: 'ok', note: WATER_CHECK_OK };
}

/** A clear refusal, or null when the point is on Kenyan land. */
export async function siteRefusal(lat: number, lon: number): Promise<string | null> {
  if (!inKenya(lat, lon)) {
    return `${where(lat, lon)} is outside Kenya's land area (sea or a neighbouring country). AquaScan uses Kenyan borehole records, rainfall and costs, so it only runs for sites in Kenya.`;
  }
  const w = openWaterAt(lat, lon);
  return w && !w.nearShore ? waterRefusal(lat, lon, w) : null;
}
