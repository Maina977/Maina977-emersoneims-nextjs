/**
 * Pilot comparison report, as JSON and PDF, built in the browser.
 * Stamped as a pilot comparison for reviewer assessment, never a certification.
 * The reviewer section is printed BLANK for a wet signature: this tool never
 * fills it in and never marks anything verified.
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { pdfSafe } from '@/lib/qs/pdfReport';
import { PILOT_TOOL_VERSION, type PilotResult } from './cards';

export const PILOT_STAMP = 'PILOT COMPARISON — for reviewer assessment, not a certification';
export const REVIEWER_FIELDS = ['Reviewer name', 'Registration (body and number)', 'Date', 'Signature', 'Conclusion'] as const;

export interface PilotFileInfo { name: string; bytes: number; sha256: string }

export interface PilotReport {
  stamp: typeof PILOT_STAMP;
  tool: string;
  engine: string;
  card: PilotResult['card'];
  title: string;
  generatedAt: string;
  file: { name: string; bytes: number; sha256: string };
  anonymised: boolean;
  anonymisedColumns: Record<string, number>;
  status: string;
  summary: Array<{ item: string; value: string }>;
  tolerances: string[];
  rows: Array<{ ref: string; verdict: string; evidence: string }>;
  excluded: Array<{ ref: string; reason: string }>;
  notes: string[];
  reviewer: { name: ''; registration: ''; date: ''; signature: ''; conclusion: ''; instruction: string };
  engineReport: unknown;
}

/** SHA-256 of the file exactly as loaded (before any anonymising), lower-case hex. */
export async function sha256Hex(data: ArrayBuffer | Uint8Array): Promise<string> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes as BufferSource);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function buildReport(result: PilotResult, file: PilotFileInfo, now: Date = new Date()): PilotReport {
  return {
    stamp: PILOT_STAMP,
    tool: PILOT_TOOL_VERSION,
    engine: result.engine,
    card: result.card,
    title: result.title,
    generatedAt: now.toISOString(),
    // A file name can carry the client's name; it is withheld when anonymised. The hash still identifies the file.
    file: { name: result.anonymised ? '(withheld: anonymised report)' : file.name, bytes: file.bytes, sha256: file.sha256 },
    anonymised: result.anonymised,
    anonymisedColumns: result.anonymisedColumns,
    status: result.status,
    summary: result.summary.map(([item, value]) => ({ item, value })),
    tolerances: result.tolerances,
    rows: result.rows.map(({ ref, verdict, evidence }) => ({ ref, verdict, evidence })),
    excluded: result.excluded,
    notes: result.notes,
    reviewer: {
      name: '', registration: '', date: '', signature: '', conclusion: '',
      instruction: 'To be completed by hand by the independent reviewer on the printed report. This tool never fills these fields and never marks anything verified.',
    },
    engineReport: result.engineReport,
  };
}

export const reportJson = (r: PilotReport) => JSON.stringify(r, null, 2);

export function reportFileStem(r: PilotReport): string {
  return `pilot-comparison-${r.card}-${r.generatedAt.slice(0, 10)}-${r.file.sha256.slice(0, 8)}`;
}

export function reportPdf(r: PilotReport): Uint8Array {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const S = (s: string) => pdfSafe(s);
  const W = 182;
  let y = 16;
  const lastY = () => (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY;
  const para = (t: string, size = 8, gap = 1) => {
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(S(t), W) as string[];
    if (y + lines.length * size * 0.42 > 280) { doc.addPage(); y = 16; }
    doc.text(lines, 14, y);
    y += lines.length * size * 0.42 + gap;
  };
  const table = (head: string[], body: string[][], widths?: Record<number, number>) => {
    autoTable(doc, {
      startY: y,
      head: [head.map(S)],
      body: body.length ? body.map((row) => row.map(S)) : [['(none)', ...head.slice(1).map(() => '')]],
      styles: { fontSize: 7.5, cellPadding: 1.2, overflow: 'linebreak' },
      headStyles: { fillColor: [55, 65, 81] },
      columnStyles: Object.fromEntries(Object.entries(widths ?? {}).map(([k, w]) => [k, { cellWidth: w }])),
      margin: { left: 14, right: 14, top: 16, bottom: 16 },
    });
    y = lastY() + 5;
  };
  const heading = (t: string) => { if (y > 265) { doc.addPage(); y = 16; } doc.setFontSize(11); doc.text(S(t), 14, y); y += 5; };

  doc.setTextColor(180, 83, 9); para(r.stamp, 12, 2); doc.setTextColor(0, 0, 0);
  para(r.title, 14, 2);
  para(`Status (engine): ${r.status}`, 9, 2);
  table(['Report detail', 'Value'], [
    ['File SHA-256', r.file.sha256],
    ['File', `${r.file.name}, ${r.file.bytes} bytes`],
    ['Generated', r.generatedAt],
    ['Engine', r.engine],
    ['Pilot tool', r.tool],
    ['Client names', r.anonymised ? `anonymised (${Object.entries(r.anonymisedColumns).map(([c, n]) => `${c}: ${n}`).join(', ') || 'no client columns'})` : 'shown as in the file'],
  ], { 0: 40 });

  heading('Summary');
  table(['Item', 'Value'], r.summary.map((s) => [s.item, s.value]), { 0: 60 });
  heading('Acceptance tolerances and rules used');
  for (const t of r.tolerances) para(`- ${t}`);
  y += 2;
  heading(`Rows compared (${r.rows.length})`);
  table(['Row', 'Verdict', 'Evidence'], r.rows.map((x) => [x.ref, x.verdict, x.evidence]), { 0: 42, 1: 40 });
  heading(`Excluded or invalid rows (${r.excluded.length}); never filled in`);
  table(['Row', 'Reason'], r.excluded.map((x) => [x.ref, x.reason]), { 0: 42 });
  if (r.notes.length) { heading('Notes'); for (const n of r.notes) para(`- ${n}`); y += 2; }

  doc.addPage(); y = 16;
  heading('Independent reviewer');
  para(r.reviewer.instruction, 8, 4);
  doc.setFontSize(10);
  for (const f of REVIEWER_FIELDS) {
    const h = f === 'Conclusion' ? 60 : f === 'Signature' ? 18 : 10;
    doc.text(S(`${f}:`), 14, y + 6);
    doc.setDrawColor(120, 120, 120);
    doc.rect(70, y, 126, h);
    y += h + 4;
  }

  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFontSize(7); doc.setTextColor(180, 83, 9);
    doc.text(S(`${r.stamp} · SHA-256 ${r.file.sha256.slice(0, 16)}... · page ${p} of ${pages}`), 14, 291);
    doc.setTextColor(0, 0, 0);
  }
  return new Uint8Array(doc.output('arraybuffer'));
}
