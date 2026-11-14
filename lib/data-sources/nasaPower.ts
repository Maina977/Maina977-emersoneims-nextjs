/**
 * NASA POWER daily precipitation (compliance replacement for Open-Meteo's
 * archive, 2026-11-14). PRECTOTCORR: MERRA-2 precipitation bias-corrected with
 * gauge data, mm/day, on a ~0.5° x 0.625° grid; NASA Langley Research Center
 * POWER project (NASA open data; cite "NASA POWER"). No API key; no SLA.
 * Grid-cell daily totals smooth local storm peaks: maxima and heavy-day counts
 * are lower bounds for a point site, and the result says so.
 */

export const NASA_POWER_PRECIP_SOURCE = 'NASA POWER daily PRECTOTCORR (MERRA-2, gauge-corrected), NASA Langley Research Center';
export const NASA_POWER_PRECIP_NOTE = 'Grid-cell (about 55 km) daily totals: local storm peaks are smoothed, so the maximum daily rainfall and the count of >50 mm days are lower bounds for the site.';

export interface PrecipStats { annual: number; maxDaily: number; extremeDays: number; days: number; source: string; note: string }

/** Statistics from a NASA POWER daily series ({YYYYMMDD: mm}); -999 = no data. */
export function precipStatsFromPower(series: Record<string, number>): PrecipStats | null {
  const valid = Object.values(series).filter((v) => typeof v === 'number' && v >= 0);
  if (valid.length < 365) return null; // less than a year of data: no statistics
  const years = valid.length / 365.25;
  return {
    annual: Math.round(valid.reduce((a, b) => a + b, 0) / years),
    maxDaily: Math.round(Math.max(...valid) * 10) / 10,
    extremeDays: Math.round(valid.filter((p) => p > 50).length / years),
    days: valid.length,
    source: NASA_POWER_PRECIP_SOURCE,
    note: NASA_POWER_PRECIP_NOTE,
  };
}

export interface PowerDay { date: string; tMax: number; tMin: number; tDew: number; u2: number; rsMJ: number; precip: number }

/**
 * Daily agro-meteorology from NASA POWER (community=AG: radiation in
 * MJ/m²/day). Days with any missing value (-999) are dropped, never filled.
 * Returns the grid elevation POWER reports for its cell.
 */
export async function fetchNasaPowerDailyMet(lat: number, lng: number, start: Date, end: Date, fetchImpl: typeof fetch = fetch): Promise<{ days: PowerDay[]; elevationM: number | null } | null> {
  const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
  const u = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M_MAX,T2M_MIN,T2MDEW,WS2M,ALLSKY_SFC_SW_DWN,PRECTOTCORR&community=AG&longitude=${lng.toFixed(4)}&latitude=${lat.toFixed(4)}&start=${ymd(start)}&end=${ymd(end)}&format=JSON`;
  try {
    const res = await fetchImpl(u, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    const j = await res.json();
    const p = j?.properties?.parameter;
    if (!p?.T2M_MAX) return null;
    const ok = (v: unknown): v is number => typeof v === 'number' && v > -998;
    const days: PowerDay[] = Object.keys(p.T2M_MAX).sort().flatMap((k) => {
      const v = [p.T2M_MAX[k], p.T2M_MIN?.[k], p.T2MDEW?.[k], p.WS2M?.[k], p.ALLSKY_SFC_SW_DWN?.[k], p.PRECTOTCORR?.[k]];
      if (!v.every(ok)) return [];
      return [{ date: `${k.slice(0, 4)}-${k.slice(4, 6)}-${k.slice(6, 8)}`, tMax: v[0], tMin: v[1], tDew: v[2], u2: v[3], rsMJ: v[4], precip: v[5] }];
    });
    const elev = j?.geometry?.coordinates?.[2];
    return { days, elevationM: typeof elev === 'number' ? elev : null };
  } catch {
    return null;
  }
}

export async function fetchNasaPowerPrecipitation(lat: number, lng: number, start: Date, end: Date, fetchImpl: typeof fetch = fetch): Promise<PrecipStats | null> {
  const ymd = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, '');
  const u = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOTCORR&community=AG&longitude=${lng.toFixed(4)}&latitude=${lat.toFixed(4)}&start=${ymd(start)}&end=${ymd(end)}&format=JSON`;
  try {
    const res = await fetchImpl(u, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) return null;
    const j = await res.json();
    const series = j?.properties?.parameter?.PRECTOTCORR as Record<string, number> | undefined;
    return series ? precipStatsFromPower(series) : null;
  } catch {
    return null;
  }
}
