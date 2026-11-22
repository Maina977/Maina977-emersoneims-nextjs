/**
 * "Anonymise client names in the report" (on by default). Replaces the values
 * of the client/site columns with neutral labels ("Client A", "Site 1"), the
 * same label for the same value, so the engines still group rows correctly.
 * A blank cell stays blank: anonymising never fills a missing value.
 */
import type { CsvTable } from './csv';

export type LabelStyle = 'letter' | 'number';
export interface AnonymiseColumn { column: string; label: string; style: LabelStyle }

export function letters(n: number): string {
  // 0 -> A, 25 -> Z, 26 -> AA
  let s = '';
  let k = n + 1;
  while (k > 0) { const r = (k - 1) % 26; s = String.fromCharCode(65 + r) + s; k = Math.floor((k - 1) / 26); }
  return s;
}

export function anonymiseTable(t: CsvTable, spec: AnonymiseColumn[]): { table: CsvTable; replaced: Record<string, number> } {
  const replaced: Record<string, number> = {};
  const maps = spec.map(() => new Map<string, string>());
  const idx = spec.map((s) => t.header.indexOf(s.column));
  const rows = t.rows.map((row) => row.map((cell, c) => {
    const k = idx.indexOf(c);
    if (k < 0 || cell.trim() === '') return cell;
    const m = maps[k];
    if (!m.has(cell)) {
      const s = spec[k];
      m.set(cell, `${s.label} ${s.style === 'letter' ? letters(m.size) : m.size + 1}`);
    }
    return m.get(cell)!;
  }));
  spec.forEach((s, k) => { if (idx[k] >= 0) replaced[s.column] = maps[k].size; });
  // Comment lines can carry names too; the engines ignore them, so they are dropped.
  return { table: { comments: [], header: t.header, rows }, replaced };
}

/** Coordinates to 0.1 degree (about 11 km), enough for a reviewer, not enough to find the site. */
export const coarseCoord = (x: number) => Math.round(x * 10) / 10;
