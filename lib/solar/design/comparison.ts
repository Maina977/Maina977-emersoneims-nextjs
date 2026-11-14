/**
 * Real-system comparison (P1-B): design prediction vs measured production for
 * EmersonEIMS installations, from docs/solar-validation/real-system-comparison-template.csv.
 * Months with data gaps or missing source files are excluded and listed,
 * never filled. Months off by more than 15 % must carry a reason.
 */
import { parseCsv } from './datasheet';

export interface MonthRow { systemId: string; month: string; predicted: number; measured: number; source: string; fileRef: string; gapDays: number; notes: string }
export interface SystemSummary {
  systemId: string; months: number; excluded: Array<{ month: string; why: string }>;
  predictedKwh: number; measuredKwh: number; errorPct: number | null;
  monthsOver15: Array<{ month: string; errorPct: number; reasonGiven: boolean }>;
}
export interface ComparisonReport { systems: SystemSummary[]; rowErrors: string[]; overallErrorPct: number | null; systemsWithData: number; status: string }

export function compareRealSystems(csv: string): ComparisonReport {
  const rowErrors: string[] = [];
  const rows: MonthRow[] = [];
  parseCsv(csv).forEach((r, i) => {
    if (!r.systemId || (!r.month && !r.predicted_kWh && !r.measured_kWh)) return; // empty template row
    const p = Number(r.predicted_kWh), m = Number(r.measured_kWh), g = r.dataGap_days === '' ? 0 : Number(r.dataGap_days);
    const e: string[] = [];
    if (!/^\d{4}-\d{2}$/.test(r.month)) e.push('month must be YYYY-MM');
    if (!(p > 0)) e.push('predicted_kWh must be positive');
    if (r.measured_kWh !== '' && !(m >= 0)) e.push('measured_kWh must be a number');
    if (!(g >= 0)) e.push('dataGap_days must be a number of days');
    if (e.length) { rowErrors.push(`row ${i + 2} (${r.systemId}): ${e.join('; ')}`); return; }
    rows.push({ systemId: r.systemId, month: r.month, predicted: p, measured: r.measured_kWh === '' ? NaN : m, source: r.measuredSource, fileRef: r.measuredFileRef, gapDays: g, notes: r.notes });
  });
  const ids = [...new Set(rows.map((r) => r.systemId))];
  const systems: SystemSummary[] = ids.map((id) => {
    const excluded: SystemSummary['excluded'] = [];
    const used = rows.filter((r) => r.systemId === id).filter((r) => {
      if (!Number.isFinite(r.measured)) { excluded.push({ month: r.month, why: 'no measured value' }); return false; }
      if (!r.source || !r.fileRef) { excluded.push({ month: r.month, why: 'measured value without its source file' }); return false; }
      if (r.gapDays > 0) { excluded.push({ month: r.month, why: `${r.gapDays} day(s) of missing data` }); return false; }
      return true;
    });
    const P = used.reduce((a, r) => a + r.predicted, 0), M = used.reduce((a, r) => a + r.measured, 0);
    const monthsOver15 = used.map((r) => ({ month: r.month, errorPct: Math.round(((r.predicted - r.measured) / r.measured) * 1000) / 10, reasonGiven: !!r.notes.trim() }))
      .filter((x) => Math.abs(x.errorPct) > 15);
    return { systemId: id, months: used.length, excluded, predictedKwh: Math.round(P), measuredKwh: Math.round(M), errorPct: M > 0 ? Math.round(((P - M) / M) * 1000) / 10 : null, monthsOver15 };
  });
  const withData = systems.filter((s) => s.months > 0);
  const P = withData.reduce((a, s) => a + s.predictedKwh, 0), M = withData.reduce((a, s) => a + s.measuredKwh, 0);
  const status = withData.length < 10
    ? `INSUFFICIENT: ${withData.length} of the 10 required systems have usable measured data`
    : withData.some((s) => s.monthsOver15.some((m) => !m.reasonGiven)) ? 'INCOMPLETE: months over 15 % error without a stated reason' : 'READY FOR ENGINEER REVIEW';
  return { systems, rowErrors, overallErrorPct: M > 0 ? Math.round(((P - M) / M) * 1000) / 10 : null, systemsWithData: withData.length, status };
}
