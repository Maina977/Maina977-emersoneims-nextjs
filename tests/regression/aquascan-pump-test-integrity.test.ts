/**
 * P0 AquaScan integrity (Engineering Apps directive §5): a pump-test result
 * must come from a pump test.
 *
 * Before this fix the borehole report:
 *  - produced a "Pump Test Analysis" with NO pump test, from the model's own
 *    predicted yield and a drawdown / static level invented as 30% of depth;
 *  - defaulted a missing pumping rate to 1 m³/h and a missing drawdown to 10 m;
 *  - ticked "+ Pump Test 88-93%" on the accuracy ladder whenever that invented
 *    analysis existed.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildFieldPumpTestAnalysis } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

const root = join(__dirname, '..', '..');
const engine = (f: string) => readFileSync(join(root, 'external', 'borehole-ai-engine', 'src', f), 'utf8');

describe('buildFieldPumpTestAnalysis', () => {
  it('produces nothing when there is no field pump test', () => {
    expect(buildFieldPumpTestAnalysis(undefined, 80)).toEqual({});
    expect(buildFieldPumpTestAnalysis(null, 80)).toEqual({});
  });

  it('refuses a test without a drawdown instead of assuming 10 m', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 12, testDurationHrs: 24 }, 80);
    expect(out.analysis).toBeUndefined();
    expect(out.rejected).toMatch(/drawdown missing or zero/);
  });

  it('refuses a test without a pumping rate instead of assuming 1 m³/h', () => {
    const out = buildFieldPumpTestAnalysis({ drawdownM: 8, testDurationHrs: 24 }, 80);
    expect(out.analysis).toBeUndefined();
    expect(out.rejected).toMatch(/pumping rate missing or zero/);
  });

  it('refuses zero and negative values and names every missing input', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 0, drawdownM: -2 }, 80);
    expect(out.analysis).toBeUndefined();
    expect(out.rejected).toMatch(/pumping rate missing or zero/);
    expect(out.rejected).toMatch(/drawdown missing or zero/);
  });

  it('benchmark: Q = 12 m³/h, s = 8 m gives specific capacity 1.5 m³/h/m', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 12, drawdownM: 8, testDurationHrs: 24 }, 80);
    expect(out.rejected).toBeUndefined();
    expect(out.observation?.specificCapacity_m3hr_per_m).toBeCloseTo(1.5, 10);
  });

  // Safety correction 2026-11-25: the previous test here asserted that a single
  // reading produced a full analysis (with assumed 30 m thickness and an assumed
  // static level). That full analysis was the defect: it reported ~250 m²/day and
  // "good aquifer" whatever the data. A single reading now yields only the
  // observed specific capacity and INSUFFICIENT EVIDENCE (see
  // tests/regression/aquascan-single-reading-safety.test.ts).
  it('a single reading gives no aquifer analysis, only the observation and INSUFFICIENT EVIDENCE', () => {
    const out = buildFieldPumpTestAnalysis({ sustainableYieldM3Hr: 12, drawdownM: 8 }, 80);
    expect(out.analysis).toBeUndefined();
    expect(out.insufficientEvidence).toMatch(/^INSUFFICIENT EVIDENCE/);
    expect(out.observation?.statement).toMatch(/single observation/);
    expect(out.observation?.testDuration_hrs).toBeNull(); // nothing assumed
  });
});

describe('borehole report wiring', () => {
  it('no longer runs the invented quick estimate when there is no pump test', () => {
    const src = engine('boreholeAnalyzer.ts');
    expect(src).not.toMatch(/quickPumpEstimate\(/);
    expect(src).toMatch(/buildFieldPumpTestAnalysis\(fieldData\?\.pumpTest, calibratedDepth\)/);
    expect(src).not.toMatch(/sustainableYieldM3Hr \|\| 1\)/);
    expect(src).not.toMatch(/drawdownM \|\| 10/);
  });

  it('ticks "+ Pump Test" on the accuracy ladder only for user-supplied field data', () => {
    const ui = engine('index.tsx');
    // 2026-11-25: a single-reading test now produces pumpTestObservation instead of pumpTestAnalysis; still user field data only.
    expect(ui).toMatch(/level: '\+ Pump Test'[^\n]*status: !!\(\(result\.pumpTestAnalysis \|\| result\.pumpTestObservation\) && result\.fieldData\?\.pumpTest\)/);
  });

  it('shows the stated assumptions and the rejection reason on the pump-test tab', () => {
    const ui = engine('index.tsx');
    expect(ui).toMatch(/Assumptions \(not measured\):/);
    expect(ui).toMatch(/result\.pumpTestRejected \?/);
  });
});
