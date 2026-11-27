/**
 * Hourly historical weather for the hourly PV engine, from NASA POWER (P1, 2026-11-15).
 *
 * Endpoint: power.larc.nasa.gov/api/temporal/hourly/point, community RE,
 * time-standard UTC. Parameters: ALLSKY_SFC_SW_DWN (hourly all-sky global
 * horizontal irradiance; the hourly mean in W/m² equals Wh/m² for the hour)
 * and T2M (°C). NASA POWER data are openly available, with attribution to the
 * NASA Langley Research Center POWER Project.
 *
 * - Gaps (-999) are never filled. A year with gaps is reported as INSUFFICIENT
 *   EVIDENCE with the count, because simulateHourly refuses gaps.
 * - Each value is placed at the middle of its UTC hour (HH:30). Confirm the
 *   time-stamp convention against the POWER documentation before using the
 *   result for an hour-by-hour comparison with meter data.
 * - Resolution is about 0.5° × 0.625° (MERRA-2 / CERES grid): coarser than a
 *   site, so the result is a regional estimate.
 */
export const NASA_POWER_HOURLY_SOURCE = 'NASA POWER hourly (ALLSKY_SFC_SW_DWN, T2M; community RE; UTC), NASA Langley Research Center';

export type HourlyWeather =
  | { status: 'OK'; start: string; ghiWm2: number[]; tempC: number[]; hours: number; source: string; notes: string[];
      /** When the data were retrieved (ISO 8601 UTC), or null when unknown (REQ-02). */
      retrievedAt: string | null;
      /** POWER API name and version as the response states them (header.api), or null when it does not. */
      apiVersion: string | null }
  | { status: 'INSUFFICIENT EVIDENCE'; reason: string; missingHours?: number }
  | { status: 'SERVICE UNAVAILABLE'; reason: string };

export function hourlyUrl(lat: number, lon: number, year: number): string {
  const p = new URLSearchParams({
    parameters: 'ALLSKY_SFC_SW_DWN,T2M', community: 'RE',
    latitude: lat.toFixed(4), longitude: lon.toFixed(4),
    start: `${year}0101`, end: `${year}1231`, format: 'JSON', 'time-standard': 'UTC',
  });
  return `https://power.larc.nasa.gov/api/temporal/hourly/point?${p}`;
}

/**
 * The API name and version POWER states in its JSON header (header.api.name /
 * header.api.version), with the header title and data sources when present.
 * Nothing is assumed: absent fields give null.
 */
export function powerApiVersion(json: any): string | null {
  const api = json?.header?.api;
  const name = typeof api?.name === 'string' ? api.name.trim() : '';
  const version = typeof api?.version === 'string' ? api.version.trim() : '';
  if (!name && !version) return null;
  const sources = Array.isArray(json?.header?.sources) ? json.header.sources.filter((x: unknown) => typeof x === 'string').join(', ') : '';
  return `${[name, version].filter(Boolean).join(' ')}${sources ? ` (sources: ${sources})` : ''}`;
}

/** Converts a POWER hourly JSON body (keys YYYYMMDDHH) into ordered series. retrievedAt = when it was fetched. */
export function parsePowerHourly(json: any, year: number, retrievedAt: string | null = null): HourlyWeather {
  const ghi = json?.properties?.parameter?.ALLSKY_SFC_SW_DWN as Record<string, number> | undefined;
  const t2m = json?.properties?.parameter?.T2M as Record<string, number> | undefined;
  if (!ghi || !t2m) return { status: 'INSUFFICIENT EVIDENCE', reason: 'NASA POWER answered without hourly irradiance and temperature' };
  const start = Date.UTC(year, 0, 1, 0, 30);
  const end = Date.UTC(year + 1, 0, 1, 0, 30);
  const g: number[] = [], t: number[] = [];
  let missing = 0;
  for (let ms = start; ms < end; ms += 3600000) {
    const d = new Date(ms);
    const k = `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}${String(d.getUTCHours()).padStart(2, '0')}`;
    const gv = ghi[k], tv = t2m[k];
    if (typeof gv !== 'number' || gv <= -900 || typeof tv !== 'number' || tv <= -900) { missing++; g.push(NaN); t.push(NaN); continue; }
    g.push(Math.max(0, gv)); t.push(tv);
  }
  if (missing > 0) return { status: 'INSUFFICIENT EVIDENCE', reason: `${missing} of ${g.length} hours are missing in NASA POWER for ${year}; gaps are not filled`, missingHours: missing };
  const apiVersion = powerApiVersion(json);
  // REQ-02: the source names the retrieval date and the API version, so a
  // proposal can be traced to the exact data release it used.
  const provenance = `retrieved ${retrievedAt ?? 'at an unrecorded time'}; ${apiVersion ? `API ${apiVersion}` : 'API version not stated in the response'}`;
  return {
    status: 'OK', start: new Date(start).toISOString(), ghiWm2: g, tempC: t, hours: g.length, source: `${NASA_POWER_HOURLY_SOURCE}, ${year} (${provenance})`,
    retrievedAt, apiVersion,
    notes: [
      'Regional reanalysis/satellite estimate (~0.5° grid), not a site measurement.',
      'Values placed at the middle of each UTC hour; confirm the time-stamp convention before hour-by-hour comparison with meter data.',
    ],
  };
}

export async function fetchPowerHourly(lat: number, lon: number, year: number, fetchImpl: typeof fetch = fetch): Promise<HourlyWeather> {
  if (!(Math.abs(lat) <= 90 && Math.abs(lon) <= 180)) return { status: 'INSUFFICIENT EVIDENCE', reason: 'Invalid coordinates' };
  const now = new Date();
  if (!(Number.isInteger(year) && year >= 2001 && year < now.getUTCFullYear())) return { status: 'INSUFFICIENT EVIDENCE', reason: 'Choose a complete past year (2001 or later)' };
  try {
    const r = await fetchImpl(hourlyUrl(lat, lon, year), { signal: AbortSignal.timeout(45000) });
    if (!r.ok) return { status: 'SERVICE UNAVAILABLE', reason: `NASA POWER HTTP ${r.status}` };
    return parsePowerHourly(await r.json(), year, new Date().toISOString());
  } catch (e) {
    return { status: 'SERVICE UNAVAILABLE', reason: e instanceof Error ? e.message : 'NASA POWER did not answer' };
  }
}
