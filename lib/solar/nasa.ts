/**
 * NASA POWER climatology — long-term average solar irradiance for a point.
 * https://power.larc.nasa.gov/docs/services/api/temporal/climatology/
 *
 * Shared by the solar calculator (/api/solar/calculate) and the design tools
 * (/api/site/pvwatts). Server-side only (no browser CORS issue); cached for
 * 30 days because a climatology does not change. On failure it says so —
 * callers decide what to show, nothing is invented here.
 */

const NASA = 'https://power.larc.nasa.gov/api/temporal/climatology/point';
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] as const;

export interface NasaSun {
  /** Long-term average global horizontal irradiance, kWh/m²/day (≈ peak sun hours). */
  annual: number;
  /** Twelve monthly averages, Jan..Dec, kWh/m²/day. */
  monthly: number[];
  worstMonth: number;
}

export async function fetchNasaSun(lat: number, lon: number): Promise<NasaSun> {
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error('Invalid coordinates');
  }
  const url = `${NASA}?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon.toFixed(3)}&latitude=${lat.toFixed(3)}&format=JSON`;
  const res = await fetch(url, { signal: AbortSignal.timeout(9000), next: { revalidate: 60 * 60 * 24 * 30 } });
  if (!res.ok) throw new Error(`NASA POWER HTTP ${res.status}`);
  const j = await res.json();
  const p = j?.properties?.parameter?.ALLSKY_SFC_SW_DWN as Record<string, number> | undefined;
  const monthly = MONTHS.map((m) => Number(p?.[m]));
  const annual = Number(p?.ANN);
  if (!Number.isFinite(annual) || annual <= 0 || monthly.some((v) => !Number.isFinite(v) || v <= 0)) {
    throw new Error('NASA POWER returned no irradiance for this point');
  }
  const r2 = (n: number) => Math.round(n * 100) / 100;
  return { annual: r2(annual), monthly: monthly.map(r2), worstMonth: r2(Math.min(...monthly)) };
}

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
