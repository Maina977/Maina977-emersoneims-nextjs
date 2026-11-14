/**
 * Point ground elevation from SRTM (NASA/USGS, public domain), served by
 * Open-Elevation with Open Topo Data (srtm30m) as the fallback. Both services
 * are free and already used by /api/building/elevation.
 *
 * Returns null when neither answers: callers must then report INSUFFICIENT
 * EVIDENCE, never a regional guess (2026-11-14: the flood route used 1500 m
 * "Kenya highlands" / 50 m coast / 1100 m lake basin by latitude box).
 */
export interface PointElevation {
  elevationM: number;
  source: string;
}

const OPEN_ELEVATION_URL = 'https://api.open-elevation.com/api/v1/lookup';
const OPEN_TOPO_URL = 'https://api.opentopodata.org/v1/srtm30m';

function valid(v: unknown): v is number {
  // SRTM voids come back as null or -32768; the Dead Sea shore is about -430 m.
  return typeof v === 'number' && Number.isFinite(v) && v > -500 && v < 9000;
}

export async function fetchPointElevation(
  lat: number,
  lng: number,
  fetchImpl: typeof fetch = fetch,
): Promise<PointElevation | null> {
  try {
    const r = await fetchImpl(OPEN_ELEVATION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locations: [{ latitude: lat, longitude: lng }] }),
      signal: AbortSignal.timeout(10000),
    });
    if (r.ok) {
      const v = (await r.json())?.results?.[0]?.elevation;
      if (valid(v)) return { elevationM: v, source: 'SRTM via Open-Elevation' };
    }
  } catch { /* try the fallback */ }
  try {
    const r = await fetchImpl(`${OPEN_TOPO_URL}?locations=${lat},${lng}`, { signal: AbortSignal.timeout(10000) });
    if (r.ok) {
      const v = (await r.json())?.results?.[0]?.elevation;
      if (valid(v)) return { elevationM: v, source: 'SRTM 30 m via Open Topo Data' };
    }
  } catch { /* none */ }
  return null;
}
