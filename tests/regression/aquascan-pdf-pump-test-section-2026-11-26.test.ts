// @vitest-environment jsdom
/**
 * Correction 2026-11-26 (CA-14): the governing PDF prints section 27 (pump test) whenever a pump test was
 * entered. It used to sit inside the Professional-only block, and the tier has been 'basic' since
 * 3025687f (one governing PDF), so the PDF never printed the pump-test result or its INSUFFICIENT
 * EVIDENCE limitation (the screen, JSON and Word did). Real engine results (network down) and the
 * real PDF code; every string the PDF writes is recorded by wrapping jsPDF's text(). TEST values only.
 *
 * AquaScan safety release: the time-series pumping test is not part of this release (it ships with
 * the integrated release, where this file also carries the time-series case), so only the single
 * reading and the no-pump-test cases are tested here.
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
import { validateSurvey, validatePumpingTest } from '@/external/borehole-ai-engine/src/fieldEvidence';
import { generatePDFReport } from '@/external/borehole-ai-engine/src/reportGenerator';

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
async function run(fd?: any) {
  const an = new BoreholeAnalyzer();
  const det = (an as any).imageDetector;
  det.analyzeImage = vi.fn(async () => JSON.parse(JSON.stringify(NEUTRAL)));
  det.reverseGeocode = vi.fn(async () => ({ source: 'none' }));
  const r: any = await an.analyzeImage(new File([new Uint8Array([1])], '__aquascan-no-photo__.jpg', { type: 'image/jpeg' }), undefined, { latitude: 1.0157, longitude: 35.0062 } as any, fd);
  r.gpsSource = 'manual';
  return r;
}

async function pdfOf(fd?: any): Promise<string> {
  const r = await run(fd);
  pdfText.length = 0;
  await generatePDFReport(r, 'professional');
  return pdfText.join('\n');
}

describe('governing PDF, section 27 (pump test)', () => {
  it('(a) a single reading: the section, the observed specific capacity and INSUFFICIENT EVIDENCE; no T, S or yield analysis', async () => {
    const pdf = await pdfOf({ ...SURVEY, ...PUMP });
    expect(pdf).toContain('27. Pump Test -- SINGLE READING: INSUFFICIENT EVIDENCE');
    expect(pdf).toMatch(/Observed specific capacity: [\d.]+ m3\/h per m of drawdown \(2 m3\/h at 23\.5 m\)/);
    expect(pdf).toContain('INSUFFICIENT EVIDENCE');
    expect(pdf).toContain('Records needed for a defensible pumping-test interpretation:');
    expect(pdf).not.toContain('27. Pump Test Analysis (Theis / Cooper-Jacob)');
    expect(pdf).not.toContain('No field pump test has been conducted');
    expect(pdf).not.toMatch(/Transmissivity[^\n]*m²\/day|Storativity[^\n]*\d|Safe yield[^\n]*\d/i);
  });

  it('(c) no pump test: no section 27 (field evidence without a pump test, and no evidence at all)', async () => {
    for (const fd of [{ ...SURVEY }, undefined]) {
      const pdf = await pdfOf(fd);
      expect(pdf).not.toMatch(/27\. Pump Test/);
    }
  });
});
