/**
 * NASA POWER monthly endpoint helpers (2026-10-19 re-audit).
 *
 * - The monthly endpoint accepts YEARS only: start=2023&end=2025 answers 200,
 *   start=202301&end=202512 answers 422 (measured). Several calls sent YYYYMM
 *   and silently got nothing.
 * - With year ranges the response also carries a "YYYY13" key per year: the
 *   annual mean. Treating it as a month skews averages and "last 12 months".
 */

/** Year range for the monthly endpoint: `yearsBack` complete years ending last year. */
export function nasaMonthlyYears(yearsBack: number): { start: number; end: number } {
  const end = new Date().getFullYear() - 1;
  return { start: end - Math.max(0, yearsBack - 1), end };
}

/** Monthly values in date order, without the YYYY13 annual means or -999 gaps. */
export function nasaMonthlyValues(series: Record<string, number> | undefined | null): number[] {
  return Object.entries(series || {})
    .filter(([k, v]) => !k.endsWith('13') && typeof v === 'number' && v > -990)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, v]) => v);
}
