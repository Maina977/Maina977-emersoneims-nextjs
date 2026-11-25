/**
 * Comparative site-photo report: one content model for the screen and the PDF, Word and
 * Excel downloads (same text everywhere), photos embedded with their location labels.
 * AquaScan site-photo workflow, 2026-11-25.
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, HeadingLevel, TextRun, ImageRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { GROUNDWATER_DISCLAIMER, NOT_A_GROUNDWATER_RANKING, REFERRAL, CHECKLIST_QUESTIONS } from './siteConstraints';
import { assess, comparison, PRIVACY_NOTE, type Property } from './siteProperty';
import { VISION_STATUS, featureStatements, type FeatureStatement } from './siteVision';
import type { Hint } from './siteConstraints';

/** The automated-visual-review row: NOT ASSESSED for every feature while no detector is enabled. */
export function visualReviewRow(hints: Hint[]): [string, string, string] {
  const st: FeatureStatement[] = featureStatements(hints);
  const notAssessed = st.filter((s) => s.certainty === 'NOT ASSESSED');
  if (notAssessed.length === st.length) return ['Automated visual review', 'NOT ASSESSED', `These features could not be assessed automatically: ${st.map((s) => s.feature).join(', ')}. Your checklist answers are used.`];
  return ['Automated visual review', st.some((s) => s.certainty === 'VALIDATED DETECTION') ? 'VALIDATED DETECTION / POSSIBLE' : 'POSSIBLE', st.filter((s) => s.certainty !== 'NOT ASSESSED').map((s) => s.text).join(' ') + ` Not assessed automatically: ${notAssessed.map((s) => s.feature).join(', ')}.`];
}

export const SITE_PHOTO_REPORT_VERSION = 'aquascan-site-photos 1.0.0 (2026-11-25)';

export interface ReportPhoto { label: string; dataUrl: string | null; caption: string }
export interface ReportSection { title: string; rows: [string, string, string][]; photos: ReportPhoto[] }
export interface SitePhotoReport { title: string; banner: string; property: [string, string][]; sections: ReportSection[]; comparison: { head: string[]; rows: string[][]; note: string }; notes: string[] }

const statusWord = { ok: 'OK', warn: 'CHECK', fail: 'FAIL', info: 'INFO' } as const;

export function buildSitePhotoReport(p: Property, when = new Date()): SitePhotoReport {
  const sections: ReportSection[] = p.locations.map((loc) => {
    const { set, assessment: a } = assess(p, loc);
    const rows: [string, string, string][] = [];
    rows.push(['Outcome', a.outcome, a.reasons.join(' ')]);
    if (loc.description) rows.push(['Description', loc.description, 'As entered']);
    rows.push(['Location GPS (entered)', loc.gps ? `${loc.gps.latitude.toFixed(5)}, ${loc.gps.longitude.toFixed(5)}` : 'not entered', loc.gps ? 'As entered' : 'Property position used for the photo-distance check, if entered']);
    for (const f of a.findings) rows.push([f.severity === 'constraint' ? 'Constraint' : 'Check on site', f.title, `${f.explanation} Basis: ${f.basis}.`]);
    if (a.requestAlternative) rows.push(['Next step', 'Photos requested', a.requestAlternative]);
    for (const q of Object.keys(CHECKLIST_QUESTIONS) as (keyof typeof CHECKLIST_QUESTIONS)[]) {
      const ans = loc.checklist[q];
      const opt = ans.value ? (CHECKLIST_QUESTIONS[q].options as Record<string, string>)[ans.value] : 'not answered';
      rows.push(['Checklist', CHECKLIST_QUESTIONS[q].q, `${opt}${ans.photo ? ` (photo ${ans.photo})` : ''}`]);
    }
    rows.push(['Checklist', 'Contamination sources nearby', loc.checklist.contamination.length ? loc.checklist.contamination.map((c) => `${c.kind}${c.distanceM != null ? ` ~${c.distanceM} m (your estimate)` : ''}${c.photo ? ` (photo ${c.photo})` : ''}`).join('; ') : loc.checklist.contaminationNoneSeen ? 'none seen' : 'not answered']);
    loc.photos.forEach((ph, i) => {
      const extra = set.perPhoto[i]?.extra ?? [];
      const checks = [...ph.checks, ...extra].map((c) => `${c.label}: ${c.measured} (threshold ${c.threshold}) ${statusWord[c.status]}`).join('; ');
      rows.push([`Photo ${i + 1}`, `${ph.facts.fileName}: ${set.perPhoto[i]?.usable ? 'usable' : 'NOT usable'}`, checks]);
    });
    for (const c of set.setChecks) rows.push(['Photo set', c.label, `${c.measured} (threshold ${c.threshold}) ${statusWord[c.status]}${c.note ? ` — ${c.note}` : ''}`]);
    rows.push(visualReviewRow([]));
    for (const h of a.hints) rows.push(['Automated hint', 'unverified', h]);
    for (const r of loc.history) rows.push(['History', r.at.replace('T', ' ').slice(0, 19), `${r.outcome}; photos: ${r.photos.join(', ') || 'none'}`]);
    return { title: `${loc.label}${loc.description ? `: ${loc.description}` : ''}`, rows, photos: loc.photos.map((ph, i) => ({ label: `${loc.label}, photo ${i + 1}`, dataUrl: ph.dataUrl, caption: `${loc.label}, photo ${i + 1}: ${ph.facts.fileName}` })) };
  });
  const cmp = comparison(p);
  return {
    title: `AquaScan Pro: candidate drilling locations (${when.toISOString().slice(0, 10)})`,
    banner: GROUNDWATER_DISCLAIMER,
    property: [['Property', p.name || 'not named'], ['County', p.county || 'not entered'], ['Property GPS', p.gps ? `${p.gps.latitude.toFixed(5)}, ${p.gps.longitude.toFixed(5)}` : 'not entered'], ['Locations', String(p.locations.length)]],
    sections,
    comparison: { head: ['Rank', 'Location', 'Outcome', 'Constraints', 'Checks on site'], rows: cmp.order.map((r) => [String(r.rank), r.label, r.outcome, String(r.constraints), String(r.checks)]), note: [cmp.summary, NOT_A_GROUNDWATER_RANKING].filter(Boolean).join(' ') },
    notes: [GROUNDWATER_DISCLAIMER, REFERRAL, PRIVACY_NOTE, VISION_STATUS, `${SITE_PHOTO_REPORT_VERSION} · EmersonEIMS`],
  };
}

/** Text lines of the report (for CSV-style checks and tests). */
export function reportLines(r: SitePhotoReport): string[] {
  return [r.title, r.banner, ...r.property.map((x) => x.join(': ')), ...r.sections.flatMap((s) => [s.title, ...s.rows.map((x) => x.join(' | '))]), r.comparison.note, ...r.comparison.rows.map((x) => x.join(' | ')), ...r.notes];
}

// PDF Helvetica speaks WinAnsi only: map the few non-Latin-1 characters used here.
const pdfText = (s: string) => s.replace(/—/g, '-').replace(/≤/g, '<=').replace(/≥/g, '>=').replace(/×/g, 'x').replace(/[^\x00-\xFF]/g, '');

function dataUrlBytes(u: string): Uint8Array {
  const b64 = u.slice(u.indexOf(',') + 1);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
const isJpeg = (u: string | null): u is string => !!u && /^data:image\/(jpeg|png);base64,/.test(u);
const imgFormat = (u: string) => (u.startsWith('data:image/png') ? 'PNG' : 'JPEG');

export function sitePhotoPdf(r: SitePhotoReport): Uint8Array {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  doc.setFontSize(9); doc.setTextColor(176, 0, 32);
  doc.text(doc.splitTextToSize(pdfText(r.banner), 182), 14, 10);
  doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text(pdfText(r.title), 14, 22);
  autoTable(doc, { startY: 26, body: r.property.map((x) => x.map(pdfText)), styles: { fontSize: 9 } });
  autoTable(doc, { head: [r.comparison.head], body: r.comparison.rows.map((x) => x.map(pdfText)), styles: { fontSize: 9 } });
  let y = (doc as any).lastAutoTable.finalY + 4;
  doc.setFontSize(8); doc.text(doc.splitTextToSize(pdfText(r.comparison.note), 182), 14, y);
  for (const s of r.sections) {
    doc.addPage();
    doc.setFontSize(12); doc.text(pdfText(s.title), 14, 14);
    let x = 14; y = 18;
    for (const ph of s.photos) {
      if (isJpeg(ph.dataUrl)) { try { doc.addImage(ph.dataUrl, imgFormat(ph.dataUrl), x, y, 42, 31); } catch { /* skip */ } }
      doc.setFontSize(7); doc.text(pdfText(ph.label), x, y + 34);
      x += 45;
    }
    autoTable(doc, { startY: s.photos.length ? y + 38 : y, head: [['Item', 'Value', 'Basis']], body: s.rows.map((row) => row.map(pdfText)), styles: { fontSize: 7 }, columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 45 } } });
  }
  doc.addPage();
  doc.setFontSize(9);
  y = 14;
  for (const n of r.notes) { const lines = doc.splitTextToSize(pdfText(n), 182); doc.text(lines, 14, y); y += lines.length * 5 + 2; }
  return new Uint8Array(doc.output('arraybuffer'));
}

export async function sitePhotoDocx(r: SitePhotoReport): Promise<Uint8Array> {
  const p = (text: string, bold = false, color?: string) => new Paragraph({ children: [new TextRun({ text, bold, color })] });
  const table = (rows: string[][]) => new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rows.map((row) => new TableRow({ children: row.map((c) => new TableCell({ children: [p(c)] })) })) });
  const children: (Paragraph | Table)[] = [p(r.banner, true, 'B00020'), new Paragraph({ text: r.title, heading: HeadingLevel.HEADING_1 }), table(r.property), new Paragraph({ text: 'Comparison', heading: HeadingLevel.HEADING_2 }), table([r.comparison.head, ...r.comparison.rows]), p(r.comparison.note)];
  for (const s of r.sections) {
    children.push(new Paragraph({ text: s.title, heading: HeadingLevel.HEADING_2 }));
    for (const ph of s.photos) {
      if (isJpeg(ph.dataUrl)) children.push(new Paragraph({ children: [new ImageRun({ data: dataUrlBytes(ph.dataUrl), transformation: { width: 240, height: 180 } })] }));
      children.push(p(ph.caption));
    }
    children.push(table([['Item', 'Value', 'Basis'], ...s.rows]));
  }
  for (const n of r.notes) children.push(p(n));
  const doc = new Document({ creator: 'EmersonEIMS AquaScan Pro', title: r.title, sections: [{ children }] });
  const b64 = await Packer.toBase64String(doc);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export async function sitePhotoXlsx(r: SitePhotoReport): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS AquaScan Pro';
  const ws = wb.addWorksheet('Comparison');
  ws.columns = [{ width: 28 }, { width: 40 }, { width: 110 }];
  ws.addRow([r.banner]); ws.addRow([r.title]); ws.addRow([]);
  for (const x of r.property) ws.addRow(x);
  ws.addRow([]); ws.addRow(r.comparison.head);
  for (const x of r.comparison.rows) ws.addRow(x);
  ws.addRow([r.comparison.note]); ws.addRow([]);
  for (const n of r.notes) ws.addRow([n]);
  r.sections.forEach((s, k) => {
    const sh = wb.addWorksheet(`Location ${String.fromCharCode(65 + k)}`.slice(0, 31));
    sh.columns = [{ width: 26 }, { width: 44 }, { width: 110 }];
    sh.addRow([s.title]);
    for (const row of s.rows) sh.addRow(row);
    let rowAt = s.rows.length + 3;
    for (const ph of s.photos) {
      sh.getCell(`A${rowAt}`).value = ph.caption;
      if (isJpeg(ph.dataUrl)) {
        const id = wb.addImage({ base64: ph.dataUrl, extension: imgFormat(ph.dataUrl) === 'PNG' ? 'png' : 'jpeg' });
        sh.addImage(id, { tl: { col: 1, row: rowAt - 1 }, ext: { width: 240, height: 180 } });
      }
      rowAt += 10;
    }
  });
  const buf = await wb.xlsx.writeBuffer();
  return new Uint8Array(buf as ArrayBuffer);
}

export function saveBytes(bytes: Uint8Array, mime: string, name: string): void {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: mime }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** The enquiry link: the existing contact page, pre-filled; nothing is sent until the customer submits it there. */
export function surveyEnquiryHref(p: Property): string {
  const lines = [
    'Request: EmersonEIMS hydrogeological survey (from AquaScan site photos).',
    `Property: ${p.name || 'not named'}${p.county ? `, ${p.county} County` : ''}${p.gps ? ` (${p.gps.latitude.toFixed(5)}, ${p.gps.longitude.toFixed(5)})` : ''}.`,
    ...p.locations.map((l) => { const a = assess(p, l).assessment; return `${l.label}${l.description ? ` (${l.description})` : ''}${l.gps ? ` at ${l.gps.latitude.toFixed(5)}, ${l.gps.longitude.toFixed(5)}` : ''}: ${a.outcome}.`; }),
  ];
  return `/contact?type=survey&detail=${encodeURIComponent(lines.join('\n').slice(0, 1500))}`;
}
