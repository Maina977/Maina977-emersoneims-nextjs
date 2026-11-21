/**
 * Generator Oracle: job card report as a PDF (P1, 2026-11-21).
 *
 * Built from jobCardReportParts(), the same content as the .txt report, so the
 * two never drift apart. Every page carries a DRAFT / not-certified footer:
 * names are typed and not verified, and there are no reviewer accounts yet.
 */
import { jsPDF } from 'jspdf';
import { pdfSafe } from '@/lib/qs/pdfReport';
import { jobCardReportParts, type Asset, type JobCard } from './maintenance';

export const JOB_CARD_PDF_FOOTER = 'DRAFT — NOT A CERTIFIED RECORD. Names and sign-off are typed and NOT verified.';

const LEFT = 14;
const WIDTH = 182;
const BOTTOM = 280; // content stops here; the footer sits below
const TOP = 16;

export function jobCardToPdf(card: JobCard, asset: Asset): Uint8Array {
  const p = jobCardReportParts(card, asset);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setProperties({ title: pdfSafe(`Job card ${card.id} revision ${card.revision} (draft, not certified)`) });
  let y = TOP;

  /** Writes wrapped text; starts a new page when it would run into the footer. */
  const write = (text: string, opts: { x?: number; size?: number; bold?: boolean; red?: boolean; bullet?: string; gap?: number } = {}) => {
    const size = opts.size ?? 8.5;
    const x = opts.x ?? LEFT;
    const lh = size * 0.42;
    doc.setFont('helvetica', opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...((opts.red ? [170, 0, 0] : [0, 0, 0]) as [number, number, number]));
    const indent = opts.bullet ? 4 : 0;
    const wrapped = doc.splitTextToSize(pdfSafe(text), WIDTH - (x - LEFT) - indent) as string[];
    wrapped.forEach((line, i) => {
      if (y + lh > BOTTOM) { doc.addPage(); y = TOP; }
      if (opts.bullet && i === 0) doc.text(pdfSafe(opts.bullet), x, y);
      doc.text(line, x + indent, y);
      y += lh;
    });
    y += opts.gap ?? 0.6;
  };

  write(p.title, { size: 13, bold: true, gap: 2 });
  for (const n of p.notices) write(n, { size: 9, bold: true, red: true, gap: 1 });
  for (const s of p.sections) {
    y += 2.5;
    write(s.heading, { size: 10, bold: true, gap: 1 });
    for (const raw of s.lines) {
      const m = /^ {2}([-!]) (.*)$/.exec(raw);
      const text = m ? m[2] : raw.trim();
      const alert = /CHANGED AFTER SIGN-OFF|compatibility unverified/.test(text) || m?.[1] === '!';
      write(text, { x: LEFT + 2, bullet: m ? (m[1] === '!' ? '!' : '-') : undefined, red: alert, bold: /CHANGED AFTER SIGN-OFF/.test(text) });
    }
  }
  y += 3;
  write(p.footer, { size: 7 });

  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(170, 0, 0);
    doc.line(LEFT, 284, LEFT + WIDTH, 284);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(170, 0, 0);
    doc.text(pdfSafe(JOB_CARD_PDF_FOOTER), LEFT, 288);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(pdfSafe(`Job card ${card.id}, revision ${card.revision} · page ${i} of ${pages}`), LEFT + WIDTH, 292, { align: 'right' });
  }
  return new Uint8Array(doc.output('arraybuffer'));
}
