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
import type { AnalysisResult } from './types';
import { evidenceGate } from './evidenceGate';
import { finalVerdict } from './verdict';

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
