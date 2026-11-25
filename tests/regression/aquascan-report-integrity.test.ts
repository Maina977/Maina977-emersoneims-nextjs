// @vitest-environment jsdom
/**
 * Re-review of f89698e8 (2026-11-25), BLOCKING 2 and 3 and the MAJOR, on real engine results
 * (network down) and the real export code. Every string the PDF writes is recorded by wrapping
 * jsPDF's text().
 *  - Without field evidence: no export carries a modelled depth or yield, and no potability
 *    conclusion.
 *  - With a survey and a pumping test (no lab): the full PDF, Word/Excel/CSV (governingSummary) and
 *    JSON show the MEASURED depth and yield; potability is "Not known" everywhere, as on the screen
 *    (the old PDF line was "WATER QUALITY POTABLE (modelled)"); the location and water-check status
 *    appear in Word/Excel/CSV as in the PDF and JSON.
 *  - With a laboratory result: one potability wording on the screen and in every export.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';

vi.setConfig({ testTimeout: 300000 });
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

import { BoreholeAnalyzer } from '@/external/borehole-ai-engine/src/boreholeAnalyzer';
import { validateSurvey, validatePumpingTest, validateLabAnalysis } from '@/external/borehole-ai-engine/src/fieldEvidence';
import { generatePDFReport, csvReportRows, jsonReportData } from '@/external/borehole-ai-engine/src/reportGenerator';
import { governingSummary } from '@/external/borehole-ai-engine/src/governingSummary';
import { waterQualityStatus } from '@/external/borehole-ai-engine/src/waterQualityStatus';
import { displayDepth, displayYield } from '@/external/borehole-ai-engine/src/displayFigures';
import { locationStatusText } from '@/external/borehole-ai-engine/src/locationStatus';

const NEUTRAL = { metadata: {}, terrainType: 'unknown', vegetationDensity: 0.3, soilColor: 'brown', rockExposure: false, waterBodies: false, classifications: [], pixelAnalysis: {}, vegetationScore: 0.3, waterProbability: 0.3, isReliableTerrainImage: false, locationMethod: 'none', locationContext: {}, gpsSource: 'none', predictions: [] };
beforeAll(() => {
  const fail = async () => { throw new TypeError('network disabled (test)'); };
  (window as any).fetch = fail; (globalThis as any).fetch = fail;
  (URL as any).createObjectURL = () => 'blob:test'; (URL as any).revokeObjectURL = () => {};
  (HTMLCanvasElement.prototype as any).getContext = function () {
    return new Proxy({}, { get: (_t, k) => (k === 'measureText' ? () => ({ width: 0 }) : k === 'getImageData' ? () => ({ data: new Uint8ClampedArray(4) }) : typeof k === 'string' && ['fillStyle', 'strokeStyle', 'font', 'lineWidth', 'textAlign', 'textBaseline', 'globalAlpha'].includes(k) ? '' : () => {}), set: () => true });
  };
  (HTMLCanvasElement.prototype as any).toDataURL = () => 'data:image/png;base64,AA==';
});
const NOW = new Date('2026-11-25T12:00:00Z');
const SURVEY = (validateSurvey as any)({ source: 'TEST Geophysics Ltd', date: '2026-10-01', method: 'Schlumberger array, IPI2Win inversion', reference: 'TEST-VES-01', surveyType: 'VES', aquiferTopM: 45, aquiferBottomM: 80 } as any, NOW).value;
const PUMP = (validatePumpingTest as any)({ source: 'TEST Drillers', date: '2026-11-10', method: 'constant-rate test', reference: 'TEST-PT-07', testType: 'constant-rate', durationHrs: 24, rateM3h: 2, staticLevelM: 18, dynamicLevelM: 41.5, recoveryLevelM: 19.2, recoveryHrs: 12 } as any, NOW).value;
const LAB = (validateLabAnalysis as any)({ source: 'TEST Water Lab', date: '2026-11-11', method: 'APHA 23rd edition', reference: 'TEST-LAB-99', accreditation: 'KENAS ISO/IEC 17025 (TEST)', samplePoint: 'Borehole head after 24 h pumping', values: { pH: 7.4, tds: 640, fluoride: 0.8 } } as any, NOW).value;

async function run(fd?: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: 1.0157, longitude: 35.0062 } as any, fd);
  r.gpsSource = 'manual';
  return r;
}
const rowsText = (rows: any[][]) => rows.map((r) => r.join(' | ')).join('\n');
const summaryText = (r: any) => governingSummary(r, 'TEST site').flatMap((s) => [s.title, ...s.rows.map((x) => x.join(' | ')), ...(s.notes ?? [])]).join('\n');

describe('no field evidence: no export carries a modelled depth/yield or a potability conclusion', () => {
  it('screening PDF, CSV and JSON', async () => {
    const r = await run();
    expect(displayDepth(r).shown).toBe(false);
    const d = Math.round(Number(r.recommendedDepth));
    expect(d).toBeGreaterThan(10); // a modelled depth exists, so its absence below is meaningful
    r.waterQuality.isPotable = true;
    pdfText.length = 0;
    await generatePDFReport(r, 'professional');
    const all = [pdfText.join('\n'), rowsText(csvReportRows(r)), JSON.stringify(jsonReportData(r))].join('\n');
    expect(all).not.toMatch(new RegExp(String.raw`(?<![\d.])${d}\s?m\b`));
    expect(all).not.toMatch(/POTABLE|Potable|Disinfection only|Safe to drink: YES/);
    expect(pdfText.join('\n')).toMatch(/Location source: Manual entry/);
  });
});

describe('survey + pumping test, no laboratory result', () => {
  it('the full exports show the measured depth and yield, "Not known" potability as on the screen, and the location status in Word/Excel/CSV', async () => {
    const r = await run({ ...SURVEY, ...PUMP });
    const dd = displayDepth(r), yy = displayYield(r);
    expect(dd.shown).toBe(true); expect(yy.shown).toBe(true);
    const depthM = (dd as any).value as number;
    // the reviewer's case: the MODEL says potable (the old PDF printed "POTABLE (modelled)")
    r.waterQuality.isPotable = true;
    pdfText.length = 0;
    await generatePDFReport(r, 'professional');
    const pdf = pdfText.join('\n');
    // BLOCKING 3: the old executive line
    expect(pdf).not.toMatch(/POTABLE \(modelled\)/);
    expect(pdf).toMatch(/NOT KNOWN -- needs a laboratory test of a water sample/);
    expect(pdf).not.toMatch(/Safe to drink: YES/);
    expect(waterQualityStatus(r).potability).toBe('Not known: needs a laboratory test of a water sample');
    // measured depth (field survey) in the PDF and the Word/Excel/CSV summary
    expect(pdf).toMatch(new RegExp(String.raw`(?<![\d.])${depthM}\s?m\b`));
    const sum = summaryText(r);
    expect(sum).toMatch(new RegExp(String.raw`Planned depth \| ${depthM} m`));
    expect(sum).toMatch(/Expected yield \| 2\.0 m³\/h/);
    // MAJOR: Word, Excel and CSV (all built from governingSummary) carry the location and water-check status
    expect(sum).toMatch(new RegExp(`Location source \\| ${locationStatusText(r)}`));
    expect(sum).toMatch(/Water-body check \| Not on a mapped lake, reservoir or the sea/);
    expect(sum).toMatch(/Potability \| Not known: needs a laboratory test of a water sample/);
    const csv = rowsText(csvReportRows(r));
    expect(csv).toMatch(/Location source \| Manual entry — coordinates typed by the customer/);
    expect(csv).toMatch(/Water-body check \| Not on a mapped lake/);
    const j: any = jsonReportData(r);
    expect(j.report.locationStatus).toBe(locationStatusText(r));
  });
});

describe('with a laboratory result', () => {
  it('one potability wording on the screen accessor and in the exports', async () => {
    const r = await run({ ...SURVEY, ...PUMP, ...LAB });
    const st = waterQualityStatus(r);
    expect(st.known).toBe(true);
    const sum = summaryText(r);
    pdfText.length = 0;
    await generatePDFReport(r, 'professional');
    const pdf = pdfText.join('\n');
    expect(pdf).not.toMatch(/POTABLE \(modelled\)|NOT KNOWN -- needs a laboratory/);
    if (st.treatment === 'NO') expect(pdf).toMatch(/MEETS THE GUIDELINE VALUES on the parameters the laboratory tested/);
    expect(sum).not.toMatch(/Potability \| Not known/);
  });
});
