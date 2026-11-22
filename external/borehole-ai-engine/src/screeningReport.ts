/**
 * AquaScan desktop screening report (Release 5, 2026-11-20).
 *
 * Without site field evidence, AquaScan gives no drilling depth, yield, cost
 * or payback (evidenceGate.ts). The full engineering report prints those
 * figures throughout, so this shorter report replaces it until a survey or
 * pumping test has been entered.
 *
 * It contains only what a desktop screen can support: the location, the
 * screening verdict and its next step, the data used, and what the survey and
 * test-pumping must establish. The same text drives the screen and the PDF.
 */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from 'docx';
import type { AnalysisResult } from './types';
import { evidenceGate, provenanceText } from './evidenceGate';
import { finalVerdict, labSourceLabel } from './verdict';

export const SCREENING_REPORT_VERSION = 'aquascan-screening-report 1.0.0 (2026-11-20)';

export interface ScreeningContent {
  title: string;
  location: string;
  verdict: string; next: string;
  evidenceNote: string;
  established: string[];
  notEstablished: string[];
  nextSteps: string[];
  sources: string[];
}

export function screeningContent(result: AnalysisResult, when = new Date()): ScreeningContent {
  const g = evidenceGate(result);
  const v = finalVerdict(result);
  const lat = result.site?.latitude, lon = result.site?.longitude;
  const sources = Array.isArray((result as any).dataSources) ? ((result as any).dataSources as unknown[]).map(String).slice(0, 20) : [];
  return {
    title: `AquaScan Pro: desktop screening report (${when.toISOString().slice(0, 10)})`,
    location: Number.isFinite(lat) && Number.isFinite(lon) ? `${(lat as number).toFixed(5)}, ${(lon as number).toFixed(5)}` : 'location not recorded',
    verdict: v.verdict.replace(' -- ', ' — '),
    next: v.next,
    evidenceNote: g.note,
    established: [
      // Field evidence entered so far, cited with its source (2026-11-22).
      ...(g.citations.depth ? [`Geophysical survey entered: ${g.citations.depth}.`] : []),
      ...(g.citations.yield ? [`Pumping test entered: ${g.citations.yield}.`] : []),
      ...(result.fieldData?.labWaterAnalysis ? [`Laboratory analysis entered: ${labSourceLabel(result.fieldData.labWaterAnalysis)} ${provenanceText(result.fieldData.labWaterAnalysis.provenance)}.`] : []),
      'Location and terrain context from public elevation and map data.',
      'Regional climate and recharge context from public climate data.',
      'Screening indicators from public geological, soil and satellite data (regional, not site-specific).',
    ],
    notEstablished: [
      ...(g.depth ? [] : ['Drilling depth: needs a geophysical survey (ERT/VES) at the drilling point.']),
      ...(g.yield ? [] : ['Yield: needs a test-pumped borehole (constant-rate or step-drawdown test).']),
      ...(g.cost ? [] : ['Project cost and payback: follow from the survey, the drilled depth and a quotation.']),
      'Water quality: needs laboratory analysis of a sample from the borehole.',
    ],
    nextSteps: [
      'Commission a hydrogeological survey with geophysics; it is required for the Water Resources Authority (WRA) permit.',
      'Apply for the WRA authorisation before drilling.',
      'After drilling, test-pump the borehole and analyse a water sample; enter the results here to update the assessment.',
    ],
    sources,
  };
}

/** The screening report as table rows, for the CSV download when evidence is missing (2026-11-22). */
export function screeningRows(result: AnalysisResult, when = new Date()): string[][] {
  const c = screeningContent(result, when);
  return [
    [c.title], ['DESKTOP SCREENING: NOT A SITE ASSESSMENT'], ['Location', c.location], ['Verdict', c.verdict], ['Next step', c.next], ['Evidence', c.evidenceNote], [''],
    ['What this desktop screen covers'], ...c.established.map((x) => ['', x]), [''],
    ['Not established by a desktop screen'], ...c.notEstablished.map((x) => ['', x]), [''],
    ['Next steps'], ...c.nextSteps.map((x, i) => ['', `${i + 1}. ${x}`]),
    ...(c.sources.length ? [[''], ['Data used'], ...c.sources.map((x) => ['', x])] : []),
  ];
}

const SCREENING_BANNER = 'DESKTOP SCREENING: NOT A SITE ASSESSMENT';
const screeningFileName = (ext: 'docx' | 'xlsx') => `AquaScanPro_Screening_${new Date().toISOString().slice(0, 10)}.${ext}`;
const DOCX_MIME = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

function saveBytes(bytes: Uint8Array, mime: string, name: string) {
  const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: mime }));
  const a = document.createElement('a');
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/**
 * The screening report as a real Word document (2026-11-22). Before, the
 * "MS Word (.docx)" button returned the screening PDF when field evidence was
 * missing, and a release test counted that as a pass. Same content as the PDF.
 */
export async function generateScreeningDocx(result: AnalysisResult, save = true): Promise<Uint8Array> {
  const c = screeningContent(result);
  const p = (text: string, opts: { bold?: boolean; color?: string } = {}) => new Paragraph({ children: [new TextRun({ text, bold: opts.bold, color: opts.color })] });
  const section = (heading: string, items: string[], numbered = false) => [
    new Paragraph({ text: heading, heading: HeadingLevel.HEADING_2 }),
    ...items.map((x, i) => p(numbered ? `${i + 1}. ${x}` : `• ${x}`)),
  ];
  const doc = new Document({
    creator: 'EmersonEIMS AquaScan Pro',
    title: c.title,
    sections: [{
      children: [
        p(SCREENING_BANNER, { bold: true, color: 'B00020' }),
        new Paragraph({ text: c.title, heading: HeadingLevel.HEADING_1 }),
        p(`Location: ${c.location}`),
        p(c.verdict, { bold: true }),
        p(c.next),
        p(c.evidenceNote),
        ...section('What this desktop screen covers', c.established),
        ...section('Not established by a desktop screen', c.notEstablished),
        ...section('Next steps', c.nextSteps, true),
        ...(c.sources.length ? section('Data used', c.sources) : []),
        p(`${SCREENING_REPORT_VERSION} · EmersonEIMS`),
      ],
    }],
  });
  // toBase64String works in the browser and under test (jsdom's Blob has no arrayBuffer()).
  const b64 = await Packer.toBase64String(doc);
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  if (save) saveBytes(bytes, DOCX_MIME, screeningFileName('docx'));
  return bytes;
}

/** The screening report as a real Excel workbook (2026-11-22); same content as the PDF. */
export async function generateScreeningXlsx(result: AnalysisResult, save = true): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'EmersonEIMS AquaScan Pro';
  const ws = wb.addWorksheet('Screening');
  ws.columns = [{ width: 34 }, { width: 110 }];
  for (const row of screeningRows(result)) ws.addRow(row);
  ws.getCell('A1').font = { bold: true, size: 13 };
  ws.getCell('A2').font = { bold: true, color: { argb: 'FFB00020' } };
  ws.addRow([]); ws.addRow([SCREENING_REPORT_VERSION]);
  const bytes = new Uint8Array(await wb.xlsx.writeBuffer() as ArrayBuffer);
  if (save) saveBytes(bytes, XLSX_MIME, screeningFileName('xlsx'));
  return bytes;
}

/** Saves the screening PDF in the browser; returns the bytes (for tests). */
export function generateScreeningPdf(result: AnalysisResult, save = true): Uint8Array {
  const c = screeningContent(result);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
  doc.setFontSize(9); doc.setTextColor(176, 0, 32); doc.text('DESKTOP SCREENING: NOT A SITE ASSESSMENT', 14, 10); doc.setTextColor(0, 0, 0);
  doc.setFontSize(15); doc.text(c.title, 14, 20);
  doc.setFontSize(10); doc.text(`Location: ${c.location}`, 14, 28);
  doc.setFontSize(12); doc.text(doc.splitTextToSize(c.verdict, 180), 14, 37);
  doc.setFontSize(10); doc.text(doc.splitTextToSize(c.next, 180), 14, 44);
  doc.setFontSize(9); doc.text(doc.splitTextToSize(c.evidenceNote, 180), 14, 54);
  autoTable(doc, { startY: 68, head: [['What this desktop screen covers']], body: c.established.map((x) => [x]), styles: { fontSize: 9 } });
  autoTable(doc, { head: [['Not established by a desktop screen']], body: c.notEstablished.map((x) => [x]), styles: { fontSize: 9 } });
  autoTable(doc, { head: [['Next steps']], body: c.nextSteps.map((x, i) => [`${i + 1}. ${x}`]), styles: { fontSize: 9 } });
  if (c.sources.length) autoTable(doc, { head: [['Data used']], body: c.sources.map((x) => [x]), styles: { fontSize: 8 } });
  const pages = doc.getNumberOfPages();
  for (let k = 1; k <= pages; k++) { doc.setPage(k); doc.setFontSize(7); doc.text(`${SCREENING_REPORT_VERSION} · page ${k} of ${pages} · EmersonEIMS`, 14, 290); }
  if (save) doc.save(`AquaScanPro_Screening_${new Date().toISOString().slice(0, 10)}.pdf`);
  return new Uint8Array(doc.output('arraybuffer'));
}
