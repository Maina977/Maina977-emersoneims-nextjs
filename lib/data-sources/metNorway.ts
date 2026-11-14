/**
 * MET Norway Locationforecast 2.0 (compliance replacement for Open-Meteo's
 * forecast, 2026-11-14).
 *
 * Licence (docs.api.met.no/doc/License, read 14 Nov 2026): data licensed under
 * NLOD 2.0 and CC BY 4.0, both of which permit commercial reuse with
 * attribution ("Data from MET Norway"). Terms (developer.yr.no/doc/TermsOfService):
 *   - identifying User-Agent with the application/domain and a company website;
 *   - coordinates truncated to at most 4 decimals;
 *   - no repeat request before the Expires header; revalidate with
 *     If-Modified-Since using the stored Last-Modified;
 *   - browsers must not call the API directly (this module runs on the server);
 *   - under 20 requests/second in total (the per-coordinate cache keeps us far below).
 * No SLA: failures are reported, never filled.
 */

export const MET_ATTRIBUTION = 'Data from MET Norway (Locationforecast 2.0; CC BY 4.0 / NLOD 2.0)';
export const MET_USER_AGENT = 'EmersonEIMS-website/1.0 https://www.emersoneims.com';
const ENDPOINT = 'https://api.met.no/weatherapi/locationforecast/2.0/complete';

/** Truncate (not round) to 4 decimals, as the terms require. */
export const truncate4 = (x: number) => Math.trunc(x * 1e4) / 1e4;

type Cached = { body: MetForecast; expires: number; lastModified: string | null };
const cache = new Map<string, Cached>();
const MAX_ENTRIES = 2000;

export interface MetTimestep {
  time: string;
  data: {
    instant: { details: Record<string, number | undefined> };
    next_1_hours?: { summary?: { symbol_code?: string }; details?: Record<string, number | undefined> };
    next_6_hours?: { summary?: { symbol_code?: string }; details?: Record<string, number | undefined> };
  };
}
export interface MetForecast { properties: { meta?: { updated_at?: string }; timeseries: MetTimestep[] } }

/** Fetch with the terms' caching rules. `fetchImpl` and `now` are injectable for tests. */
export async function fetchLocationforecast(lat: number, lon: number, fetchImpl: typeof fetch = fetch, now = Date.now()): Promise<{ data: MetForecast; fromCache: boolean; key: string }> {
  const la = truncate4(lat), lo = truncate4(lon);
  const key = `${la},${lo}`;
  const hit = cache.get(key);
  if (hit && hit.expires > now) return { data: hit.body, fromCache: true, key };
  const headers: Record<string, string> = { 'User-Agent': MET_USER_AGENT, Accept: 'application/json' };
  if (hit?.lastModified) headers['If-Modified-Since'] = hit.lastModified;
  const res = await fetchImpl(`${ENDPOINT}?lat=${la}&lon=${lo}`, { headers, signal: AbortSignal.timeout(10000) });
  const expiresHdr = res.headers.get('expires');
  const expires = expiresHdr && !Number.isNaN(Date.parse(expiresHdr)) ? Date.parse(expiresHdr) : now + 30 * 60 * 1000;
  if (res.status === 304 && hit) {
    cache.set(key, { ...hit, expires });
    return { data: hit.body, fromCache: true, key };
  }
  if (!res.ok) throw new Error(`MET Norway HTTP ${res.status}`);
  const body = (await res.json()) as MetForecast;
  if (!Array.isArray(body?.properties?.timeseries) || body.properties.timeseries.length === 0) throw new Error('MET Norway: no forecast in the answer');
  if (cache.size >= MAX_ENTRIES) cache.delete(cache.keys().next().value as string);
  cache.set(key, { body, expires, lastModified: res.headers.get('last-modified') });
  return { data: body, fromCache: false, key };
}

export function _clearMetCache() { cache.clear(); }

/** Sunrise/sunset daylight length (h) for a date, from solar geometry (−0.833° horizon). */
export function daylightHours(latDeg: number, dateIso: string): number {
  const d = new Date(`${dateIso}T12:00:00Z`);
  const doy = Math.floor((d.getTime() - Date.UTC(d.getUTCFullYear(), 0, 0)) / 86400000);
  const decl = (23.45 * Math.PI / 180) * Math.sin((2 * Math.PI * (284 + doy)) / 365);
  const phi = latDeg * Math.PI / 180;
  const cosWs = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(phi) * Math.sin(decl)) / (Math.cos(phi) * Math.cos(decl));
  const ws = Math.acos(Math.max(-1, Math.min(1, cosWs)));
  return Math.round(((2 * ws * 180 / Math.PI) / 15) * 10) / 10;
}

/**
 * The site's weather response from a MET forecast. Days are local solar days
 * (UTC + round(lon/15) h). Precipitation: hourly amounts while the forecast is
 * hourly, then 6-hour amounts, never both for the same period. Fields MET does
 * not provide (feels-like temperature, daily shortwave radiation) are null.
 */
export function toWeatherResponse(f: MetForecast, lat: number, lon: number, days = 7) {
  const ts = f.properties.timeseries;
  const offsetH = Math.round(lon / 15);
  const localDate = (t: string) => new Date(Date.parse(t) + offsetH * 3600000).toISOString().slice(0, 10);
  const first = ts[0];
  const cur = first.data.instant.details;
  const lastHourly = ts.reduce((i, s, k) => (s.data.next_1_hours ? k : i), -1);
  const byDay = new Map<string, { t: number[]; c: number[]; w: number[]; p: number }>();
  ts.forEach((s, k) => {
    const day = localDate(s.time);
    if (!byDay.has(day)) byDay.set(day, { t: [], c: [], w: [], p: 0 });
    const a = byDay.get(day)!;
    const d = s.data.instant.details;
    if (typeof d.air_temperature === 'number') a.t.push(d.air_temperature);
    if (typeof d.cloud_area_fraction === 'number') a.c.push(d.cloud_area_fraction);
    if (typeof d.wind_speed === 'number') a.w.push(d.wind_speed);
    if (k <= lastHourly) a.p += s.data.next_1_hours?.details?.precipitation_amount ?? 0;
    else if (s.data.next_6_hours && (k === lastHourly + 1 || Date.parse(s.time) - Date.parse(ts[k - 1].time) >= 6 * 3600000)) a.p += s.data.next_6_hours.details?.precipitation_amount ?? 0;
  });
  const r1 = (x: number) => Math.round(x * 10) / 10;
  const forecast = [...byDay.entries()].slice(0, days).map(([date, a]) => ({
    date,
    temperature: { min: a.t.length ? Math.min(...a.t) : null, max: a.t.length ? Math.max(...a.t) : null },
    cloudCover: a.c.length ? Math.round(a.c.reduce((x, y) => x + y, 0) / a.c.length) : null,
    precipitation: r1(a.p),
    windSpeed: a.w.length ? Math.max(...a.w) : null,
    shortwaveRadiation: null as number | null, // not provided by MET Norway
  }));
  const cloudCover = typeof cur.cloud_area_fraction === 'number' ? cur.cloud_area_fraction : null;
  const condition = cloudCover == null ? 'unknown' : cloudCover <= 10 ? 'excellent' : cloudCover <= 30 ? 'good' : cloudCover <= 60 ? 'moderate' : 'poor';
  return {
    location: { latitude: lat, longitude: lon, timezone: `UTC${offsetH >= 0 ? '+' : ''}${offsetH} (solar)` },
    current: {
      temperature: cur.air_temperature ?? null,
      feelsLike: null as number | null, // not provided by MET Norway
      humidity: cur.relative_humidity ?? null,
      cloudCover,
      windSpeed: cur.wind_speed ?? null,
      windDirection: cur.wind_from_direction ?? null,
      precipitation: first.data.next_1_hours?.details?.precipitation_amount ?? null,
      weatherCode: null as number | null,
      symbolCode: first.data.next_1_hours?.summary?.symbol_code ?? null,
      time: first.time,
    },
    forecast,
    solarAnalysis: {
      currentCondition: condition,
      estimatedEfficiency: cloudCover == null ? null : Math.round(100 - cloudCover * 0.75),
      daylightHours: daylightHours(lat, localDate(first.time)),
    },
    source: MET_ATTRIBUTION,
    updatedAt: f.properties.meta?.updated_at ?? null,
  };
}
