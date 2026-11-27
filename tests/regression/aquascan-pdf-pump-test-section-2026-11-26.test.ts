// @vitest-environment jsdom
/**
 * Correction 2026-11-26 (CA-14): the governing PDF prints section 27 (pump test) whenever a pump test was
 * entered. It used to sit inside the Professional-only block, and the tier has been 'basic' since
 * 3025687f (one governing PDF), so the PDF never printed the pump-test result or its INSUFFICIENT
 * EVIDENCE limitation (the screen, JSON and Word did). Real engine results (network down) and the
 * real PDF code; every string the PDF writes is recorded by wrapping jsPDF's text(). TEST values only.
 *
 * Integrated release (2026-11-27): the AquaScan safety release (b187d03b) tests the single reading
 * and the no-pump-test cases; the time-series case (b) from release/features-2026-11-26 is carried
 * here as well, since the time-series pumping test ships in this release.
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

// Synthetic Theis data: T = 120 m²/day, S = 2e-4, Q = 20 m³/h, r = 30 m (see the analysis test for the derivation).
function E1(u: number): number {
  if (u <= 1) return -Math.log(u) - 0.57721566 + 0.99999193 * u - 0.24991055 * u ** 2 + 0.05519968 * u ** 3 - 0.00976004 * u ** 4 + 0.00107857 * u ** 5;
  const num = u ** 4 + 8.5733287401 * u ** 3 + 18.059016973 * u ** 2 + 8.6347608925 * u + 0.2677737343;
  const den = u ** 4 + 9.5733223454 * u ** 3 + 25.6329561486 * u ** 2 + 21.0996530827 * u + 3.9584969228;
  return (num / den) / (u * Math.exp(u));
}
const s = (t: number) => ((20 * 24) / (4 * Math.PI * 120)) * E1((900 * 2e-4) / (4 * 120 * (t / 1440)));
const times = Array.from({ length: 40 }, (_, i) => Number((2880 ** (i / 39)).toFixed(3)));
const SWL = 12;
const series = times.map((t) => [t, Math.round(s(t) * 1e5) / 1e5] as const);
const recov = Array.from({ length: 25 }, (_, i) => Number((1440 ** (i / 24)).toFixed(3))).map((tp) => [tp, Math.round((s(2880 + tp) - s(tp)) * 1e5) / 1e5] as const);
const src = { source: 'TEST Pumping Ltd', date: '2026-11-01', method: 'constant-rate test (TEST)', reference: 'TEST-TS-1' };

function storedPumpTest() {
  const r = validatePumpingTest({
    ...src, testType: 'time-series', staticLevelM: SWL,
    timeSeries: {
      rateM3h: 20, valuesAre: 'drawdown', readings: series.map(([t, v]) => ({ tMin: t, value: v })), rateChanges: [],
      pumpingStoppedMin: 2880, recovery: recov.map(([t, v]) => ({ tPrimeMin: t, value: v })), observationDistanceM: 30, pumpIntakeDepthM: null,
    },
  }, new Date('2026-11-25'));
  if (!r.ok) throw new Error(r.errors.join(' '));
  return r.value.pumpTest!;
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

  it('(b) a time series: the section with the same rows as the Pump Test tab; not the single-reading or "no test" wording', async () => {
    const pt = storedPumpTest();
    const r = await run({ ...SURVEY, pumpTest: pt });
    expect(r.pumpTestTimeSeries?.rows?.length).toBeGreaterThan(0);
    pdfText.length = 0;
    await generatePDFReport(r, 'professional');
    const pdf = pdfText.join('\n');
    const at = pdf.indexOf('27. Pump Test Analysis (Theis / Cooper-Jacob)');
    expect(at).toBeGreaterThan(-1);
    const s27 = pdf.slice(at);
    for (const row of r.pumpTestTimeSeries!.rows) expect(s27, row[0]).toContain(row[0]);
    expect(s27).toContain('120 m²/day');
    expect(pdf).not.toContain('SINGLE READING: INSUFFICIENT EVIDENCE');
    expect(pdf).not.toContain('No field pump test has been conducted');
  });

  it('(c) no pump test: no section 27 (field evidence without a pump test, and no evidence at all)', async () => {
    for (const fd of [{ ...SURVEY }, undefined]) {
      const pdf = await pdfOf(fd);
      expect(pdf).not.toMatch(/27\. Pump Test/);
    }
  });
});
