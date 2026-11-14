import { describe, it, expect } from 'vitest';
import fx from '../fixtures/pumptest-benchmark.json';
import { analyzePumpTest, wellFunction } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

// Independent references (scripts/benchmarks/pumptest_benchmark.py):
// scipy.special.exp1 for W(u); TTim (Bakker, MIT) synthetic confined-aquifer
// tests with KNOWN T and S. Synthetic data, not field measurements.

describe('Theis well function W(u) vs scipy.special.exp1', () => {
  for (const w of fx.wellFunction) {
    it(`W(${w.u}) = ${w.W.toPrecision(6)}`, () => {
      expect(Math.abs(wellFunction(w.u) - w.W)).toBeLessThan(1e-6);
    });
  }
  it('continuous across u = 0.01 (the former approximation switch)', () => {
    expect(Math.abs(wellFunction(0.0099999) - wellFunction(0.0100001))).toBeLessThan(1e-4);
  });
});

describe(`pumping-test analysis recovers TTim ${fx.ttim} aquifer parameters`, () => {
  for (const t of fx.tests) {
    const run = () => analyzePumpTest({
      pumpingRate_m3hr: t.Q_m3h, staticWaterLevel_m: 10, observationWellDistance_m: t.r, aquiferType: 'confined',
      readings: t.times_min.map((m, i) => ({ time_min: m, drawdown_m: t.drawdown_m[i] })),
    });
    it(`${t.name}: Theis fit T and S within 0.5 %, reported T and S within 1 %`, () => {
      const r = run();
      expect(Math.abs(r.theis.T_m2day - t.T) / t.T).toBeLessThan(0.005);
      expect(Math.abs(r.theis.S - t.S) / t.S).toBeLessThan(0.005);
      expect(Math.abs(r.transmissivity_m2day - t.T) / t.T).toBeLessThan(0.01);
      expect(Math.abs(r.storativity - t.S) / t.S).toBeLessThan(0.01);
    });
    it(`${t.name}: Cooper-Jacob straight-line T within 3 % (late-time method)`, () => {
      expect(Math.abs(run().cooperJacob.T_m2day - t.T) / t.T).toBeLessThan(0.03);
    });
    it(`${t.name}: deterministic`, () => {
      expect(JSON.stringify(run())).toBe(JSON.stringify(run()));
    });
  }
});
