/**
 * S40 / CA-11 (2026-11-26): leaky aquifers are diagnosed by mechanism and the reported
 * transmissivity is not the confined-model value on a leaky record.
 *
 * Mechanism (Kruseman & de Ridder 1994, section 4.2.1; Hantush & Jacob 1955): leakage
 * makes late drawdown flatten below the Theis curve. The Hantush-Jacob model nests Theis
 * (r/L → 0); leakage is diagnosed when it fits significantly better (extra-sum-of-squares
 * F test, 1 %) AND the late readings lie below the Theis curve. When diagnosed, T comes from
 * the leaky fit only if its 95 % fit interval is within the stated ±10 % tolerance;
 * otherwise NO T is given (never the biased confined-model value).
 *
 * Published reference: Oude Korendijk (Wit 1963) in Kruseman & de Ridder (1994), Table 3.1;
 * the book's conclusion KD 390 m²/d, methods range 370-431 m²/d (Table 3.3), late data
 * affected by leakage (p. 70). Agreement tolerance: ±10 % of 390 m²/d (as stated in
 * docs/engineering/aquascan-pumping-test-analysis.md, section 5a).
 * All other records here are SYNTHETIC (generated from the formulas).
 */
import { describe, it, expect } from 'vitest';
import fx from '../fixtures/oude-korendijk.json';
import {
  analyzeTimeSeriesPumpTest, hantushW, theisDrawdown, LEAKY_T_TOLERANCE, type PumpTestTimeSeries,
} from '@/external/borehole-ai-engine/src/pumpTestTimeSeries';
import { wellFunction } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

const Q = fx.Q_m3d;
const BOOK = fx.published.summary;
const series = (key: 'H30' | 'H90'): PumpTestTimeSeries => ({
  rate_m3h: Q / 24, rateChanges: [], pumpingStopped_min: null, recovery: [],
  readings: fx.piezometers[key].readings.map(([t, s]) => ({ t_min: t, s_m: s })),
  observationDistance_m: fx.piezometers[key].r_m, pumpIntakeDepth_m: null, staticWaterLevel_m: 0,
});
const times = [0.5, 1, 1.5, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 960, 1200, 1440, 2000, 2880];
const synth = (f: (t: number) => number, r: number | null): PumpTestTimeSeries => ({
  rate_m3h: 20, rateChanges: [], pumpingStopped_min: null, recovery: [],
  readings: times.map((t) => ({ t_min: t, s_m: Number(f(t).toFixed(3)) })),
  observationDistance_m: r, pumpIntakeDepth_m: null, staticWaterLevel_m: 5,
});
const K0 = (x: number) => { // modified Bessel K0 by quadrature of ∫0^∞ exp(-x cosh t) dt
  let s = 0; const h = 1e-3; for (let t = 0; t < 30; t += h) s += Math.exp(-x * Math.cosh(t + h / 2)) * h; return s;
};

describe('Hantush leaky well function W(u, r/L)', () => {
  it('equals Theis W(u) as r/L → 0', () => {
    for (const u of [1e-5, 1e-3, 0.01, 0.1, 1, 5]) expect(hantushW(u, 1e-6)).toBeCloseTo(wellFunction(u), 4);
    expect(hantushW(0.01, 0)).toBe(wellFunction(0.01));
  });
  it('tends to the steady state 2·K0(r/L) at small u, and obeys W(u,β) + W(β²/4u, β) = 2·K0(β)', () => {
    for (const b of [0.05, 0.1, 0.5, 1]) {
      expect(hantushW(1e-9, b)).toBeCloseTo(2 * K0(b), 3);
      const u = 0.02;
      expect(hantushW(u, b) + hantushW((b * b) / (4 * u), b)).toBeCloseTo(2 * K0(b), 3);
    }
  });
});

describe('Oude Korendijk (published, leaky): leakage is flagged and T matches the book within ±10 %', () => {
  const a30 = analyzeTimeSeriesPumpTest(series('H30'));
  const a90 = analyzeTimeSeriesPumpTest(series('H90'));

  it('H30: leakage diagnosed by the F test and late-time flattening', () => {
    const lk = a30.leakage!;
    expect(lk.diagnosed).toBe(true);
    expect(lk.fStatistic).toBeGreaterThan(lk.fCritical);
    expect(lk.lateTheisResidual_m).toBeLessThan(0);
    expect(a30.warnings.some((w) => w.startsWith('LEAKAGE DIAGNOSED'))).toBe(true);
    expect(a30.rows.find((r) => r[0] === 'Leakage (Hantush-Jacob)')![1]).toMatch(/^DIAGNOSED/);
  });

  it('H30: reported T is the leaky fit, within ±10 % of the book\'s 390 m²/d and inside its 370-431 range', () => {
    const T = a30.transmissivity!;
    expect(T.method).toBe('Hantush-Jacob leaky fit');
    expect(Math.abs(T.value_m2d - BOOK.KD_m2d) / BOOK.KD_m2d).toBeLessThanOrEqual(LEAKY_T_TOLERANCE);
    expect(T.value_m2d).toBeGreaterThanOrEqual(BOOK.methodsRange_KD_m2d[0]);
    expect(T.value_m2d).toBeLessThanOrEqual(BOOK.methodsRange_KD_m2d[1]);
    // storativity from the leaky fit: book 1.7e-4 (Table 3.3), within ±25 %
    expect(Math.abs(a30.storativity!.value - BOOK.S) / BOOK.S).toBeLessThan(0.25);
    expect(a30.storativity!.method).toBe('Hantush-Jacob leaky fit');
  });

  it('H30: the confined-model values (Theis 480, Cooper-Jacob 542) are kept for display but not used', () => {
    expect(a30.theis!.usable).toBe(false);
    expect(a30.theis!.T_m2d).toBeGreaterThan(475);
    expect(a30.cooperJacob!.usable).toBe(false);
    expect(a30.transmissivity!.methodsRange_m2d).toEqual([a30.transmissivity!.value_m2d, a30.transmissivity!.value_m2d]);
    expect(a30.planningEstimate.status).toBe('withheld');
  });

  it('H90: leakage diagnosed; leaky T within ±10 % of 390 m²/d (book Jacob H90: 450, "less reliable")', () => {
    expect(a90.leakage!.diagnosed).toBe(true);
    expect(a90.transmissivity!.method).toBe('Hantush-Jacob leaky fit');
    expect(Math.abs(a90.transmissivity!.value_m2d - BOOK.KD_m2d) / BOOK.KD_m2d).toBeLessThanOrEqual(LEAKY_T_TOLERANCE);
  });

  it('one aquifer, two piezometers: the leaky fits agree (T within 5 %, leakage factor L within 10 %)', () => {
    const T30 = a30.leakage!.T_m2d, T90 = a90.leakage!.T_m2d;
    expect(Math.abs(T30 - T90) / T30).toBeLessThan(0.05);
    expect(Math.abs(a30.leakage!.L_m! - a90.leakage!.L_m!) / a30.leakage!.L_m!).toBeLessThan(0.1);
  });
});

describe('SYNTHETIC records: the diagnosis does not fire without leakage, and withholds T when the leaky fit is weak', () => {
  it('a confined (Theis) record: no leakage, T from the confined methods as before', () => {
    const a = analyzeTimeSeriesPumpTest(synth((t) => theisDrawdown(480, 150, 2e-4, 40, t), 40));
    expect(a.leakage!.diagnosed).toBe(false);
    expect(a.transmissivity!.method).toBe('Theis curve fit');
    expect(Math.abs(a.transmissivity!.value_m2d - 150) / 150).toBeLessThan(0.02);
  });

  it('a leaky record generated with Hantush-Jacob (T 150, S 2e-4, L 400 m at r 40 m): diagnosed, T recovered', () => {
    const r = 40, T = 150, S = 2e-4, beta = r / 400;
    const s = (t: number) => (480 / (4 * Math.PI * T)) * hantushW((r * r * S) / (4 * T * (t / 1440)), beta);
    const a = analyzeTimeSeriesPumpTest(synth(s, r));
    expect(a.leakage!.diagnosed).toBe(true);
    expect(a.transmissivity!.method).toBe('Hantush-Jacob leaky fit');
    expect(Math.abs(a.transmissivity!.value_m2d - T) / T).toBeLessThan(0.05);
    expect(Math.abs(a.leakage!.L_m! - 400) / 400).toBeLessThan(0.1);
  });

  it('a leaky record whose leaky fit is not determined within ±10 %: leakage stated, NO transmissivity given', () => {
    // Few, coarse readings with alternating ±3 cm errors on a leaky curve: the 95 % interval on T is wide.
    const r = 40, T = 150, S = 2e-4, beta = r / 150;
    const few = [1, 2, 5, 10, 30, 60, 120, 240, 480, 960, 1440, 2880];
    const ts: PumpTestTimeSeries = {
      rate_m3h: 20, rateChanges: [], pumpingStopped_min: null, recovery: [],
      readings: few.map((t, i) => ({ t_min: t, s_m: Number(((480 / (4 * Math.PI * T)) * hantushW((r * r * S) / (4 * T * (t / 1440)), beta) + (i % 2 ? 0.03 : -0.03)).toFixed(3)) })),
      observationDistance_m: r, pumpIntakeDepth_m: null, staticWaterLevel_m: 5,
    };
    const a = analyzeTimeSeriesPumpTest(ts);
    if (a.leakage!.diagnosed && !a.leakage!.usable) {
      expect(a.transmissivity).toBeNull();
      expect(a.insufficientEvidence).toMatch(/does not determine transmissivity within the stated ±10 %/);
      expect(a.rows.find((x) => x[0] === 'Leakage (Hantush-Jacob)')![1]).toBe('DIAGNOSED: T not determined');
      expect(a.planningEstimate.status).toBe('withheld');
    } else {
      throw new Error('fixture does not exercise the withheld path');
    }
  });
});
