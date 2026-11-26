// @vitest-environment jsdom
/**
 * S46 (AquaScan register; P1-C §4: "only if calibrated may it later be called a probability").
 * The success score has no calibration against recorded drilling outcomes, but it was shown to
 * customers as a frequency, "about 6 in 10" (governingSummary.probabilityBand), and as a percentage
 * in the full PDF and the result tabs. Production bf2c7500 has the same "about N in 10" wording.
 * Now: a qualitative screening class with its score out of 100 and "not a probability of success —
 * not calibrated against drilled outcomes", on screen and in every export.
 *
 * S36: the pump-cost assumption ("the water stands at half the planned depth") carries no number
 * and is shown only beside the pump and cost figures, never as the water-table basis.
 * Real engine results, network disabled; TEST values only.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import JSZip from 'jszip';
import ExcelJS from 'exceljs';

vi.setConfig({ testTimeout: 600000, hookTimeout: 600000 });
const pdfText: string[] = [];
vi.mock('jspdf', async (orig) => {
  const m: any = await orig();
  const J = m.default ?? m.jsPDF;
  class Recording extends J {
    constructor(...a: any[]) {
      super(...a);
      const t = (this as any).text.bind(this);
      (this as any).text = (s: any, ...rest: any[]) => { pdfText.push(Array.isArray(s) ? s.join(' ') : String(s)); return t(s, ...rest); };
      (this as any).save = () => {};
    }
  }
  return { ...m, default: Recording, jsPDF: Recording };
});
const saved: { blob: Blob; name: string }[] = [];
vi.mock('file-saver', () => ({ saveAs: (blob: Blob, name: string) => { saved.push({ blob, name }); } }));

import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { validateSurvey, validatePumpingTest } from '@/external/borehole-ai-engine/src/fieldEvidence';
import { generatePDFReport, generateWordReport, generateExcelReport, csvReportRows, jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';
import { generateScreeningPdf, generateScreeningDocx, generateScreeningXlsx } from '@/external/borehole-ai-engine/src/screeningReport';
import { governingSummary, probabilityBand, screeningIndicator, SCORE_NOT_PROBABILITY } from '@/external/borehole-ai-engine/src/governingSummary';
import { compareCardFigures, compareVerdictSentence } from '@/external/borehole-ai-engine/src/compareGate';

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
const NOW = new Date('2026-11-25T12:00:00Z');
const SURVEY = (validateSurvey as any)({ source: 'TEST Geophysics Ltd', date: '2026-10-01', method: 'Schlumberger array, IPI2Win inversion', reference: 'TEST-VES-01', surveyType: 'VES', aquiferTopM: 45, aquiferBottomM: 80 } as any, NOW).value;
const PUMP = (validatePumpingTest as any)({ source: 'TEST Drillers', date: '2026-11-10', method: 'constant-rate test', reference: 'TEST-PT-07', testType: 'constant-rate', durationHrs: 24, rateM3h: 2, staticLevelM: 18, dynamicLevelM: 41.5, recoveryLevelM: 19.2, recoveryHrs: 12 } as any, NOW).value;

type Pdfjs = typeof import('pdfjs-dist/legacy/build/pdf.mjs');
let pdfjs: Pdfjs;
const pdfBytesText = async (b: Uint8Array) => {
  const doc = await pdfjs.getDocument({ data: b.slice() }).promise;
  let t = '';
  for (let p = 1; p <= doc.numPages; p++) t += (await (await doc.getPage(p)).getTextContent()).items.map((i) => ('str' in i ? i.str : '')).join(' ') + '\n';
  return t.replace(/\s+/g, ' ');
};
const blobBytes = (b: Blob) => new Promise<Uint8Array>((res, rej) => { const fr = new FileReader(); fr.onload = () => res(new Uint8Array(fr.result as ArrayBuffer)); fr.onerror = rej; fr.readAsArrayBuffer(b); });
const docxText = async (b: Uint8Array) => (await (await JSZip.loadAsync(b)).file('word/document.xml')!.async('string')).replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&apos;/g, "'");
const xlsxText = async (b: Uint8Array) => { const wb = new ExcelJS.Workbook(); await wb.xlsx.load(b as unknown as ArrayBuffer); const out: string[] = []; wb.eachSheet((ws) => ws.eachRow((row) => out.push((row.values as unknown[]).slice(1).map((v) => String(v ?? '')).join(' | ')))); return out.join('\n'); };

let screening: any, full: any;
async function run(fd?: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: 1.0157, longitude: 35.0062 } as any, fd);
  r.gpsSource = 'manual';
  return r;
}
beforeAll(async () => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
  (URL as any).createObjectURL = () => 'blob:test'; (URL as any).revokeObjectURL = () => {};
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,AA==';
  pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(path.resolve('node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs')).href;
  screening = await run();
  full = await run({ ...SURVEY, ...PUMP });
});

async function exportsOf(r: any, isFull: boolean): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  if (!isFull) {
    out.PDF = await pdfBytesText(generateScreeningPdf(r, false));
    out.Word = await docxText(await generateScreeningDocx(r, false));
    out.Excel = await xlsxText(await generateScreeningXlsx(r, false));
  } else {
    pdfText.length = 0; saved.length = 0;
    await generatePDFReport(r, 'professional'); out.PDF = pdfText.join('\n');
    await generateWordReport(r, 'professional'); out.Word = await docxText(await blobBytes(saved.find((s) => s.name.endsWith('.docx'))!.blob));
    await generateExcelReport(r, 'professional'); out.Excel = await xlsxText(await blobBytes(saved.find((s) => s.name.endsWith('.xlsx'))!.blob));
  }
  out.CSV = csvReportRows(r).map((x) => x.join(' | ')).join('\n');
  out.JSON = JSON.stringify(jsonReportData(r));
  return out;
}

// A frequency or chance claim on the success score.
// Labels; the lowercase "not the chance of water" (location grade) and "% chance of water requiring treatment" (risk) are not success-score claims.
const FREQUENCY = /\babout \d+ in 10\b|\bChance of (a productive borehole|success|water)\b/;
const SCORE_AS_PERCENT = /(success score|success probability|governing probability|Fused Probability)[^.\n|]{0,40}\b\d{1,3}(\.\d)?\s?%/i;

describe('S46: the uncalibrated success score is never a probability or a frequency', () => {
  it('the shared wording: a screening class, score out of 100, and the "not a probability" note', () => {
    expect(screeningIndicator(0.62)).toBe('Mixed screening indicator (score 62/100; not a probability of success — not calibrated against drilled outcomes)');
    expect(screeningIndicator(0.7)).toMatch(/^Favourable screening indicator \(score 70\/100;/);
    expect(screeningIndicator(0.3)).toMatch(/^Unfavourable screening indicator \(score 30\/100;/);
    expect(probabilityBand(0.62)).not.toMatch(/in 10/);
    expect(SCORE_NOT_PROBABILITY).toBe('not a probability of success — not calibrated against drilled outcomes');
  });

  it('screen data: the governing summary row, the compare cards and the compare sentence', () => {
    for (const r of [screening, full]) {
      const row = governingSummary(r, 'x').find((s) => s.title === 'Verdict')!.rows.find((x) => /success score/i.test(x[0]))!;
      expect(row[0]).toBe('Modelled success score (uncalibrated)');
      expect(row[1]).toContain(SCORE_NOT_PROBABILITY);
      expect(compareCardFigures(r).chance).toContain(SCORE_NOT_PROBABILITY);
      expect(compareVerdictSentence(r, 'Site A', 50)).not.toMatch(FREQUENCY);
    }
  });

  it('the result tabs (index.tsx) no longer label the score as a chance or print it as a percentage', () => {
    const ui = fs.readFileSync(path.resolve('external/borehole-ai-engine/src/index.tsx'), 'utf8');
    expect(ui).not.toMatch(/Chance of a productive borehole|Chance of success|>Chance of water<|Fused Probability/);
    expect(ui).not.toMatch(/successProbability\*100\)\.toFixed\(\d\)\}<span style=\{\{fontSize:14\}\}>%|\{dp\.successProbability\}%|\{dd\.successProbability\}%/);
    expect(ui).toContain('Modelled success score (uncalibrated)');
  });

  it('every export, screening and full: no "N in 10", no chance wording, no score as a percentage; the note where the score is shown', async () => {
    for (const [r, isFull] of [[screening, false], [full, true]] as const) {
      const ex = await exportsOf(r, isFull);
      for (const [fmt, t] of Object.entries(ex)) {
        expect(t, `${isFull ? 'full' : 'screening'} ${fmt}`).not.toMatch(FREQUENCY);
        // JSON: the readable text (string values), not the raw numeric model fields beside their keys.
        const readable = fmt === 'JSON' ? (() => { const s: string[] = []; JSON.parse(t, (_k, v) => { if (typeof v === 'string') s.push(v); return v; }); return s.join('\n'); })() : t;
        expect(readable.match(SCORE_AS_PERCENT)?.[0] ?? null, `${isFull ? 'full' : 'screening'} ${fmt}`).toBeNull();
        if (isFull && fmt !== 'JSON' && /success score/i.test(t)) expect(t, `full ${fmt}: the note`).toMatch(/not a probability/);
      }
    }
  });
});

describe('S36: the pump-cost assumption carries no number and stays with the pump/cost figures', () => {
  it('no digit in the sentence; the water-table basis never carries it; a no-evidence run shows it nowhere', async () => {
    const a = String(screening.pumpHeadAssumption ?? full.pumpHeadAssumption ?? '');
    if (a) expect(a).not.toMatch(/\d/);
    expect(String(screening.waterTableBasis ?? '')).not.toMatch(/half the planned depth/);
    const ex = await exportsOf(screening, false);
    for (const [fmt, t] of Object.entries(ex)) if (fmt !== 'JSON') expect(t, fmt).not.toMatch(/half the planned depth/);
    const gs = governingSummary(screening, 'x').flatMap((s) => [...s.rows.flat(), ...(s.notes ?? [])]).join(' | ');
    expect(gs).not.toMatch(/half the planned depth/);
  });
});
