/**
 * Reads a technician-filled Oracle review pack (P1, 2026-11-15). Applies to
 * docs/engineering-apps/oracle-alarm-review-pack.csv and the guided-diagnostics
 * review sheet.
 *
 * Read-only. It checks that every verdict is evidenced and summarises the
 * review, but it never marks an alarm "verified" in the library. That is a
 * separate engineering change, made after management accepts the review.
 *
 * A verdict counts only with: the OEM manual title (from the manual register),
 * edition, page and the reviewer's name. A row with a verdict but missing
 * evidence is listed as an error, never counted.
 */
import { parseCsv } from '@/lib/solar/design/datasheet';

export type Verdict = 'correct' | 'change' | 'remove';
export interface ReviewRow { id: string; verdict: Verdict; manual: string; edition: string; page: string; reviewer: string; comment: string; highRisk: boolean }
export interface ReviewReport {
  rowsRead: number;
  reviewed: number;
  byVerdict: Record<Verdict, number>;
  highRiskReviewed: number;
  highRiskTotal: number;
  reviewers: string[];
  errors: string[];
  accepted: ReviewRow[];
  status: 'NO REVIEW YET' | 'PARTIAL' | 'COMPLETE';
}

const col = (r: Record<string, string>, ...names: string[]) => {
  for (const n of names) for (const k of Object.keys(r)) if (k.toLowerCase().startsWith(n.toLowerCase())) return (r[k] ?? '').trim();
  return '';
};

export function ingestReviewPack(csv: string): ReviewReport {
  const rows = parseCsv(csv);
  const errors: string[] = [];
  const accepted: ReviewRow[] = [];
  const byVerdict: Record<Verdict, number> = { correct: 0, change: 0, remove: 0 };
  let highRiskTotal = 0, highRiskReviewed = 0;
  rows.forEach((r, i) => {
    const id = col(r, 'id');
    if (!id) return;
    const highRisk = /^yes$/i.test(col(r, 'highRisk'));
    if (highRisk) highRiskTotal++;
    const v = col(r, 'verdict').toLowerCase();
    if (!v) return; // not yet reviewed
    if (v !== 'correct' && v !== 'change' && v !== 'remove') { errors.push(`row ${i + 2} (${id}): verdict must be correct, change or remove`); return; }
    const row: ReviewRow = { id, verdict: v, manual: col(r, 'oemManual', 'manual'), edition: col(r, 'edition'), page: col(r, 'page'), reviewer: col(r, 'reviewer'), comment: col(r, 'comment'), highRisk };
    const missing = [!row.manual && 'OEM manual', !row.edition && 'edition', !row.page && 'page', !row.reviewer && 'reviewer'].filter(Boolean);
    if (missing.length) { errors.push(`row ${i + 2} (${id}): verdict "${v}" without ${missing.join(', ')}; not counted`); return; }
    if (v !== 'correct' && !row.comment) { errors.push(`row ${i + 2} (${id}): "${v}" needs a comment saying what is wrong; not counted`); return; }
    accepted.push(row);
    byVerdict[v]++;
    if (highRisk) highRiskReviewed++;
  });
  const total = rows.filter((r) => col(r, 'id')).length;
  return {
    rowsRead: total,
    reviewed: accepted.length,
    byVerdict,
    highRiskReviewed,
    highRiskTotal,
    reviewers: [...new Set(accepted.map((a) => a.reviewer))],
    errors,
    accepted,
    status: accepted.length === 0 ? 'NO REVIEW YET' : accepted.length === total ? 'COMPLETE' : 'PARTIAL',
  };
}
