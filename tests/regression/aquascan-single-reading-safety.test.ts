/**
 * AquaScan pumping-test SAFETY CORRECTION (2026-11-25, branch fix/aquascan-pump-test-integrity).
 *
 * Defect (production 3f6669ea): the Field Data form passes ONE pumping rate and ONE
 * drawdown; the full Theis / Cooper-Jacob analysis could not fit one point and fell
 * back to a fixed 500 m²/day blended 50/50, so every test reported ~250 m²/day,
 * "High transmissivity — good aquifer" and an inflated yield (1 m³/h at 40 m
 * drawdown showed ~46 m³/h "maximum continuous pumping").
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  analyzePumpTest, buildFieldPumpTestAnalysis, InsufficientPumpTestData, MIN_PUMP_READINGS_FOR_PARAMETERS,
} from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

const root = join(__dirname, '..', '..');
const engine = (f: string) => readFileSync(join(root, 'external', 'borehole-ai-engine', 'src', f), 'utf8');
const FORBIDDEN = /transmissivity|storativity|hydraulicConductivity|sustainableYield_m3hr|safeYield|maxRecommendedYield|good aquifer|sustainability|Maximum continuous pumping/i;

describe('single reading: specific capacity only, INSUFFICIENT EVIDENCE for the rest', () => {
  const cases = [
    { name: 'poor (1 m³/h, 40 m)', t: { sustainableYieldM3Hr: 1, drawdownM: 40, testDurationHrs: 24 }, sc: 1 / 40 },
    { name: 'moderate (3 m³/h, 15 m)', t: { sustainableYieldM3Hr: 3, drawdownM: 15, testDurationHrs: 24 }, sc: 0.2 },
    { name: 'good (10 m³/h, 2 m)', t: { sustainableYieldM3Hr: 10, drawdownM: 2, testDurationHrs: 24 }, sc: 5 },
  ];
  for (const c of cases) {
    it(`${c.name}: no transmissivity, storativity, yield, rating or recommendation`, () => {
      const out = buildFieldPumpTestAnalysis(c.t, 80);
      expect(out.analysis).toBeUndefined();
      expect(out.rejected).toBeUndefined();
      expect(out.observation?.specificCapacity_m3hr_per_m).toBeCloseTo(c.sc, 12);
      // Nothing beyond the observation and the INSUFFICIENT EVIDENCE text.
      expect(Object.keys(out.observation!).sort()).toEqual(['basis', 'drawdown_m', 'pumpingRate_m3hr', 'specificCapacity_m3hr_per_m', 'staticWaterLevel_m', 'statement', 'testDuration_hrs'].sort());
      expect(JSON.stringify(out.observation)).not.toMatch(FORBIDDEN);
      expect(out.insufficientEvidence).toMatch(/^INSUFFICIENT EVIDENCE/);
      expect(out.observation!.statement).toMatch(/not a sustainable or safe yield/);
      expect(out.required!.length).toBeGreaterThanOrEqual(5);
    });
  }

  it('a poor borehole receives no positive wording at all', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 1, drawdownM: 40, testDurationHrs: 24 }, 80);
    expect(JSON.stringify(out)).not.toMatch(/good|high transmissivity|excellent|recommended yield|sustainable yield of/i);
  });

  it('specific capacity matches hand calculations (Q / s)', () => {
    const sc = (Q: number, s: number) => buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: Q, drawdownM: s }, 80).observation!.specificCapacity_m3hr_per_m;
    expect(sc(1, 5)).toBeCloseTo(0.2, 12);   // management example: 1 m³/h at 5 m → 0.2 m³/h per m
    expect(sc(12, 8)).toBeCloseTo(1.5, 12);
    expect(sc(2.5, 10)).toBeCloseTo(0.25, 12);
  });

  it('assumes nothing: no default duration, thickness or static level', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 12, drawdownM: 8 }, 80);
    expect(out.observation!.testDuration_hrs).toBeNull();
    expect(out.observation!.staticWaterLevel_m).toBeNull();
    expect(JSON.stringify(out)).not.toMatch(/assumed|30 m|30%/i);
  });
});

describe('invalid inputs are rejected with every reason named (nothing clipped or assumed)', () => {
  const rej = (t: Record<string, unknown>) => buildFieldPumpTestAnalysis(t as never, 80);
  it.each([
    [{ drawdownM: 8 }, /pumping rate missing or zero/],
    [{ sustainableYieldM3Hr: 12 }, /drawdown missing or zero/],
    [{ sustainableYieldM3Hr: 0, drawdownM: 0 }, /pumping rate missing or zero; drawdown missing or zero/],
    [{ sustainableYieldM3Hr: -3, drawdownM: 4 }, /pumping rate missing or zero/],
    [{ sustainableYieldM3Hr: 'abc', drawdownM: 4 }, /pumping rate missing or zero/],
    [{ sustainableYieldM3Hr: 600, drawdownM: 4 }, /pumping rate 600 m³\/h is not plausible/],
    [{ sustainableYieldM3Hr: 5, drawdownM: 800 }, /drawdown 800 m is not plausible/],
    [{ sustainableYieldM3Hr: 5, drawdownM: 4, testDurationHrs: 0 }, /test duration 0 h is not valid/],
    [{ sustainableYieldM3Hr: 5, drawdownM: 4, testDurationHrs: 1000 }, /test duration 1000 h is not valid/],
    [{ sustainableYieldM3Hr: 5, drawdownM: 4, staticWaterLevelM: -2 }, /static water level -2 m is not valid/],
  ])('%j → rejected', (t, msg) => {
    const out = rej(t);
    expect(out.observation).toBeUndefined();
    expect(out.analysis).toBeUndefined();
    expect(out.rejected).toMatch(msg);
  });
  it('no field test at all: nothing', () => {
    expect(buildFieldPumpTestAnalysis(undefined, 80)).toEqual({});
  });
});

describe('the full analysis refuses too few readings and never uses a fixed transmissivity', () => {
  it(`fewer than ${MIN_PUMP_READINGS_FOR_PARAMETERS} pumping readings: InsufficientPumpTestData, no numbers`, () => {
    for (const n of [1, 2, 5]) {
      const readings = Array.from({ length: n }, (_, i) => ({ time_min: (i + 1) * 30, drawdown_m: 2 + i }));
      expect(() => analyzePumpTest({ pumpingRate_m3hr: 5, readings })).toThrow(InsufficientPumpTestData);
    }
  });

  it('source: the fixed 500 m²/day fallback is gone, and the field path never calls the full analysis', () => {
    const src = engine('pumpTestAnalyzer.ts');
    expect(src).not.toMatch(/\(4 \* Math\.PI \* deltaS_cj\) : 500/);
    const field = src.slice(src.indexOf('export function buildFieldPumpTestAnalysis'));
    expect(field).not.toMatch(/analyzePumpTest\(/);
  });

  it('a flat drawdown record (no Cooper-Jacob slope) is fitted from the data, not set to a fixed value', () => {
    const readings = [1, 2, 5, 10, 20, 40, 60, 120].map((t) => ({ time_min: t, drawdown_m: 3 }));
    const r = analyzePumpTest({ pumpingRate_m3hr: 10, readings });
    expect(Number.isFinite(r.transmissivity_m2day)).toBe(true);
    expect(r.transmissivity_m2day).not.toBeCloseTo(250, 0);
    expect(r.transmissivity_m2day).not.toBeCloseTo(500, 0);
  });
});

describe('every output path carries the single-reading result and its warning', () => {
  it('the analyser puts the observation, the INSUFFICIENT EVIDENCE text and the required records on the result', () => {
    const src = engine('boreholeAnalyzer.ts');
    expect(src).toMatch(/pumpTestObservation = pumpTestOutcome\.observation/);
    expect(src).toMatch(/pumpTestInsufficient = pumpTestOutcome\.insufficientEvidence/);
    expect(src).toMatch(/pumpTestObservation,\s*\n\s*pumpTestInsufficient,\s*\n\s*pumpTestEvidenceRequired,/);
  });

  it('screen (Pump Test tab): the observation branch comes first and shows the warning and the records needed', () => {
    const ui = engine('index.tsx');
    const tab = ui.slice(ui.indexOf("activeResultTab==='pump-test'"), ui.indexOf('LITHOLOGY LOG'));
    expect(tab.indexOf('result.pumpTestObservation ?')).toBeGreaterThan(-1);
    expect(tab.indexOf('result.pumpTestObservation ?')).toBeLessThan(tab.indexOf(': result.pumpTestAnalysis ?'));
    expect(tab).toMatch(/result\.pumpTestInsufficient/);
    expect(tab).toMatch(/pumpTestEvidenceRequired/);
    expect(tab).not.toMatch(/transmissivity, storativity, safe yield, and sustainability\./);
  });

  it('PDF section 27: the single-reading branch comes before "no pump test", and the module list says INSUFFICIENT EVIDENCE', () => {
    const src = engine('reportGenerator.ts');
    const s27 = src.slice(src.indexOf('// -- 27. PUMP TEST ANALYSIS --'));
    expect(s27.indexOf('if (result.pumpTestObservation)')).toBeGreaterThan(-1);
    expect(s27.indexOf('if (result.pumpTestObservation)')).toBeLessThan(s27.indexOf('No field pump test has been conducted'));
    expect(s27).toMatch(/SINGLE READING: INSUFFICIENT EVIDENCE/);
    expect(src).toMatch(/\['52', 'Pump Test Analysis', result\.pumpTestObservation \? 'INSUFFICIENT EVIDENCE'/);
  });

  it('JSON export spreads the result, so it carries the observation and the warning (and no analysis for a single reading)', () => {
    const src = engine('reportGenerator.ts');
    expect(src).toMatch(/\.\.\.result/);
  });
});
