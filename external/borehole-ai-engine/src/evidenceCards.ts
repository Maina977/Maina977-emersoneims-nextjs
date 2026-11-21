/**
 * AquaScan Pro: two evidence cards for the results view (P1 UI, 2026-11-20).
 *
 * Pure parsers/formatters for the answers of
 *   GET /api/aquascan/groundwater-context?lat&lon       (BGS maps of Africa)
 *   GET /api/borehole/nearby-boreholes?lat&lon&radius   (OpenStreetMap water points)
 *
 * Rules: nothing is invented or defaulted. A value the API did not give is
 * shown as an em dash. No average, recommended depth or expected yield is
 * derived here; the cards show what the sources state and nothing more.
 * Any HTTP error, non-JSON body, network failure or unknown status is
 * SERVICE UNAVAILABLE.
 */

export const DASH = '—';
export const MSG_SERVICE_UNAVAILABLE = 'Not available right now — try again later';
export const MSG_NO_DATA = 'No mapped value at this point';
export const msgNoMatch = (radiusKm: number | string) =>
  `No water points are mapped in OpenStreetMap within ${radiusKm} km — that does not mean there are none; ask the Water Resources Authority for completion records`;

export const NEARBY_RADIUS_KM = 5;
export const NEARBY_MAX_ROWS = 8;

const str = (v: unknown): string | null => (typeof v === 'string' && v.trim() ? v.trim() : null);
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null);
const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter((s): s is string => s !== null) : []);

/* ─────────────── Regional groundwater context (BGS) ─────────────── */

export type GroundwaterStatus = 'OK' | 'NO DATA' | 'SERVICE UNAVAILABLE';

export interface GroundwaterRow {
  label: string;   // e.g. "Depth to groundwater"
  value: string;   // class label, or DASH
  range: string;   // the API's range text, or DASH
}

export interface GroundwaterCard {
  status: GroundwaterStatus;
  message: string;
  rows: GroundwaterRow[];   // always three rows when status is OK, otherwise empty
  scale: string | null;
  use: string | null;
  acknowledgement: string | null;
}

const unavailableGw = (): GroundwaterCard => ({
  status: 'SERVICE UNAVAILABLE', message: MSG_SERVICE_UNAVAILABLE, rows: [], scale: null, use: null, acknowledgement: null,
});

function gwRow(label: string, part: unknown, rangeKey: 'rangeM' | 'rangeMm' | 'rangeLs'): GroundwaterRow {
  const p = part && typeof part === 'object' ? (part as Record<string, unknown>) : null;
  return { label, value: str(p?.label) ?? DASH, range: str(p?.[rangeKey]) ?? DASH };
}

/** Parse the groundwater-context answer. `httpOk` is Response.ok. */
export function parseGroundwaterContext(httpOk: boolean, body: unknown): GroundwaterCard {
  if (!httpOk || !body || typeof body !== 'object') return unavailableGw();
  const b = body as Record<string, unknown>;
  const meta = { scale: str(b.scale), use: str(b.use), acknowledgement: str(b.acknowledgement) };
  if (b.status === 'OK') {
    return {
      status: 'OK',
      message: 'Regional class for the 5 km grid cell containing this site',
      rows: [
        gwRow('Depth to groundwater', b.depthToGroundwater, 'rangeM'),
        gwRow('Groundwater storage', b.storage, 'rangeMm'),
        gwRow('Aquifer productivity', b.productivity, 'rangeLs'),
      ],
      ...meta,
    };
  }
  if (b.status === 'NO DATA') return { status: 'NO DATA', message: MSG_NO_DATA, rows: [], ...meta };
  return unavailableGw();
}

/* ─────────────── Mapped water points (OpenStreetMap) ─────────────── */

export type NearbyStatus = 'OK' | 'NO MATCH FOUND' | 'SERVICE UNAVAILABLE';

export interface WaterPointRow {
  kind: string;
  name: string;         // the mapped name, or "unnamed"
  distance: string;     // "1.23 km", or DASH
  depth: string;        // "45 m" only if tagged, else DASH
  yield: string;        // "3.5 m³/h" only if tagged, else DASH
  waterLevel: string;   // "12 m" only if tagged, else DASH
  year: string;         // "2015" or DASH
}

export interface NearbyCard {
  status: NearbyStatus;
  message: string;
  radiusKm: number;
  count: number | null;          // number of mapped points the API returned; null when unavailable
  rows: WaterPointRow[];         // up to NEARBY_MAX_ROWS, nearest first
  pointsWithDepth: number | null;
  pointsWithYield: number | null;
  limitations: string[];
  dataSources: string[];
}

const unavailableNearby = (radiusKm: number): NearbyCard => ({
  status: 'SERVICE UNAVAILABLE', message: MSG_SERVICE_UNAVAILABLE, radiusKm, count: null, rows: [],
  pointsWithDepth: null, pointsWithYield: null, limitations: [], dataSources: [],
});

const withUnit = (v: unknown, unit: string) => {
  const n = num(v);
  return n === null ? DASH : `${n} ${unit}`;
};

function waterPointRow(p: unknown): WaterPointRow {
  const o = p && typeof p === 'object' ? (p as Record<string, unknown>) : {};
  const d = num(o.distance);
  const y = num(o.year);
  return {
    kind: str(o.kind) ?? DASH,
    name: str(o.name) ?? 'unnamed',
    distance: d === null ? DASH : `${d.toFixed(2)} km`,
    depth: withUnit(o.depth, 'm'),
    yield: withUnit(o.yield, 'm³/h'),
    waterLevel: withUnit(o.staticWaterLevel, 'm'),
    year: y === null ? DASH : String(y),
  };
}

/** Parse the nearby-boreholes answer. `httpOk` is Response.ok. */
export function parseNearbyWaterPoints(httpOk: boolean, body: unknown, requestedRadiusKm: number = NEARBY_RADIUS_KM): NearbyCard {
  if (!httpOk || !body || typeof body !== 'object') return unavailableNearby(requestedRadiusKm);
  const b = body as Record<string, unknown>;
  const data = b.success === true && b.data && typeof b.data === 'object' ? (b.data as Record<string, unknown>) : null;
  if (!data) return unavailableNearby(requestedRadiusKm);
  const radiusKm = num(data.searchRadius) ?? requestedRadiusKm;
  const stats = data.statistics && typeof data.statistics === 'object' ? (data.statistics as Record<string, unknown>) : {};
  const list = Array.isArray(data.boreholes) ? data.boreholes : [];
  const common = {
    radiusKm,
    pointsWithDepth: num(stats.pointsWithDepth),
    pointsWithYield: num(stats.pointsWithYield),
    limitations: strList(data.limitations),
    dataSources: strList(data.dataSources),
  };
  if (data.status === 'NO MATCH FOUND') {
    return { status: 'NO MATCH FOUND', message: msgNoMatch(radiusKm), count: 0, rows: [], ...common };
  }
  if (data.status === 'OK') {
    const sorted = list
      .map((p, i) => ({ p, i, d: num((p as any)?.distance) }))
      .sort((a, b) => (a.d ?? Infinity) - (b.d ?? Infinity) || a.i - b.i)
      .map((x) => x.p);
    const count = list.length;
    return {
      status: 'OK',
      message: `${count} mapped water point${count === 1 ? '' : 's'} within ${radiusKm} km`,
      count,
      rows: sorted.slice(0, NEARBY_MAX_ROWS).map(waterPointRow),
      ...common,
    };
  }
  return unavailableNearby(requestedRadiusKm);
}

/* ─────────────── Browser fetch helpers (relative URLs) ─────────────── */

type FetchLike = (input: string, init?: { signal?: AbortSignal }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

async function getJson(url: string, fetchImpl: FetchLike, signal?: AbortSignal): Promise<{ ok: boolean; body: unknown }> {
  const r = await fetchImpl(url, { signal });
  if (!r.ok) return { ok: false, body: null };
  try { return { ok: true, body: await r.json() }; } catch { return { ok: false, body: null }; }
}

export const groundwaterContextUrl = (lat: number, lon: number) =>
  `/api/aquascan/groundwater-context?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}`;
export const nearbyWaterPointsUrl = (lat: number, lon: number, radiusKm: number = NEARBY_RADIUS_KM) =>
  `/api/borehole/nearby-boreholes?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lon))}&radius=${encodeURIComponent(String(radiusKm))}`;

/** Never throws except when `signal` is aborted (the caller drops the result). */
export async function loadGroundwaterCard(lat: number, lon: number, fetchImpl: FetchLike, signal?: AbortSignal): Promise<GroundwaterCard> {
  try {
    const { ok, body } = await getJson(groundwaterContextUrl(lat, lon), fetchImpl, signal);
    return parseGroundwaterContext(ok, body);
  } catch (e) {
    if (signal?.aborted) throw e;
    return unavailableGw();
  }
}

/** Never throws except when `signal` is aborted (the caller drops the result). */
export async function loadNearbyCard(lat: number, lon: number, fetchImpl: FetchLike, signal?: AbortSignal, radiusKm: number = NEARBY_RADIUS_KM): Promise<NearbyCard> {
  try {
    const { ok, body } = await getJson(nearbyWaterPointsUrl(lat, lon, radiusKm), fetchImpl, signal);
    return parseNearbyWaterPoints(ok, body, radiusKm);
  } catch (e) {
    if (signal?.aborted) throw e;
    return unavailableNearby(radiusKm);
  }
}
