import { describe, it, expect, beforeAll } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import ExcelJS from 'exceljs';
import { generateScreeningPdf, generateScreeningDocx, generateScreeningXlsx, screeningContent } from '@/external/borehole-ai-engine/src/screeningReport';
import type { AnalysisResult } from '@/external/borehole-ai-engine/src/types';

// Management, 2026-11-22: "MS Word (.docx)" and "Excel (.xlsx)" returned the
// screening PDF and a release test counted that as a pass. Each format is now
// produced, and checked by opening it with an independent reader (pdfjs, the
// .docx XML via JSZip, ExcelJS), not by file name, size or a raw-byte search.
const r = {
  siteEvidence: { depth: false, yield: false, methods: [] },
  site: { latitude: -0.4532, longitude: 39.6461 },
  dataSources: ['NASA POWER (TEST)', 'SRTM (TEST)'],
  waterQuality: { tds: 8495, fluoride: 6.37, nitrate: 87.4 },
} as unknown as AnalysisResult;

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
beforeAll(async () => {
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
});
const pdfText = async (b: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: b.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t.replace(/\s+/g, ' ');
};
const docxText = async (b: Uint8Array) => {
  const zip = await JSZip.loadAsync(b);
  const xml = await zip.file('word/document.xml')!.async('string');
  return { text: xml.replace(/<w:tab\/>/g, ' ').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&'), zip };
};
const xlsxText = async (b: Uint8Array) => {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.load(b as unknown as ArrayBuffer);
  const out: string[] = [];
  wb.eachSheet((ws) => ws.eachRow((row) => out.push((row.values as unknown[]).slice(1).map((v) => String(v ?? '')).join(' | '))));
  return { text: out.join('\n'), sheets: wb.worksheets.map((w) => w.name) };
};

// What a screening report must say, and must never contain, in every format.
function checkScreening(text: string) {
  const c = screeningContent(r);
  expect(text).toContain('DESKTOP SCREENING: NOT A SITE ASSESSMENT');
  expect(text).toContain('-0.45320, 39.64610');
  for (const line of c.notEstablished) expect(text).toContain(line.slice(0, 40));
  expect(text).toMatch(/Drilling depth: needs a geophysical survey/);
  expect(text).toMatch(/Yield: needs a test-pumped borehole/);
  // No unsupported figures: no depth in metres, no yield, no money, no modelled concentration.
  expect(text).not.toMatch(/\b\d{2,3}\s?m\b(?! ?(³|3)\/)/);
  expect(text).not.toMatch(/\d\s?m(³|3)\/h/);
  expect(text).not.toMatch(/\$\s?\d|KSh\s?\d|KES\s?\d/);
  expect(text).not.toMatch(/8,?495|6\.37|87\.4/);
}

describe('AquaScan screening report: the format asked for is the format delivered', () => {
  it('PDF: %PDF- signature; text read back with pdfjs carries the screening content and no unsupported figures', async () => {
    const b = generateScreeningPdf(r, false);
    expect(Buffer.from(b.subarray(0, 5)).toString('latin1')).toBe('%PDF-');
    checkScreening(await pdfText(b));
  });
  it('Word: a real .docx (ZIP with word/document.xml and the Word content type), screening content, no unsupported figures', async () => {
    const b = await generateScreeningDocx(r, false);
    expect(Buffer.from(b.subarray(0, 2)).toString('latin1')).toBe('PK');
    const { text, zip } = await docxText(b);
    const types = await zip.file('[Content_Types].xml')!.async('string');
    expect(types).toMatch(/wordprocessingml\.document\.main\+xml/);
    expect(Buffer.from(b.subarray(0, 5)).toString('latin1')).not.toBe('%PDF-');
    checkScreening(text);
  });
  it('Excel: a real .xlsx that ExcelJS opens (sheet "Screening"), screening content, no unsupported figures', async () => {
    const b = await generateScreeningXlsx(r, false);
    expect(Buffer.from(b.subarray(0, 2)).toString('latin1')).toBe('PK');
    const { text, sheets } = await xlsxText(b);
    expect(sheets).toEqual(['Screening']);
    checkScreening(text);
  });
});
