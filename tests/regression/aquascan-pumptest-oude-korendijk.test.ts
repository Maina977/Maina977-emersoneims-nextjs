/**
 * Independent published reference: pumping test "Oude Korendijk" (Wit 1963), as published in
 * Kruseman & de Ridder, Analysis and Evaluation of Pumping Test Data, 2nd ed. (1994), ILRI Publ. 47:
 *   data      Table 3.1, p. 59 (H30 at 30 m, H90 at 90 m; Q = 788 m³/d for ~14 h, p. 56);
 *   answers   Example 3.3 Theis p. 65; Example 3.4 Jacob p. 68; Table 3.3 and conclusion pp. 70-71.
 * Machine-readable data: timflow (MIT) piezometer_h30.txt / _h90.txt, checked value by value
 * against the text layer of the book's Table 3.1 (fixture: tests/fixtures/oude-korendijk.json).
 *
 * Two kinds of check:
 *  1. The book's own arithmetic, from the book's stated inputs, must be reproduced exactly
 *     (tolerance = the book's rounding).
 *  2. AquaScan's least-squares analysis of the same data is COMPARED with the book's graphical
 *     answers. The comparison is recorded as it is; the code is not tuned to the book.
 *     The book itself says the late-time data are affected by leakage and that graphical
 *     methods are never accurate (p. 70), and its methods range 370-431 m²/d (Table 3.3).
 */
import { describe, it, expect } from 'vitest';
import fx from '../fixtures/oude-korendijk.json';
import {
  analyzeTimeSeriesPumpTest, cooperJacobT, cooperJacobS, theisDrawdown, type PumpTestTimeSeries,
} from '@/external/borehole-ai-engine/src/pumpTestTimeSeries';
import { wellFunction } from '@/external/borehole-ai-engine/src/pumpTestAnalyzer';

const Q = fx.Q_m3d; // 788 m³/d
const P = fx.published;
const rel = (a: number, b: number) => (a - b) / b;
const series = (key: 'H30' | 'H90'): PumpTestTimeSeries => ({
  rate_m3h: Q / 24, rateChanges: [], pumpingStopped_min: null, recovery: [],
  readings: fx.piezometers[key].readings.map(([t, s]) => ({ t_min: t, s_m: s })),
  observationDistance_m: fx.piezometers[key].r_m, pumpIntakeDepth_m: null, staticWaterLevel_m: 0,
});
const rmse = (key: 'H30' | 'H90', T: number, S: number) => {
  const pz = fx.piezometers[key];
  return Math.sqrt(pz.readings.reduce((a, [t, s]) => a + (s - theisDrawdown(Q, T, S, pz.r_m, t)) ** 2, 0) / pz.readings.length);
};

describe('the data are the published Table 3.1 (p. 59)', () => {
  it('H30: 34 readings, 0.1 to 830 min, 0.04 to 1.088 m; H90: 35 readings, 1.5 to 845 min', () => {
    const h30 = fx.piezometers.H30.readings, h90 = fx.piezometers.H90.readings;
    expect(h30).toHaveLength(34);
    expect(h30[0]).toEqual([0.1, 0.04]);
    expect(h30[33]).toEqual([830, 1.088]);
    expect(h30.find(([t]) => t === 139)).toEqual([139, 0.915]);
    expect(h90).toHaveLength(35);
    expect(h90[0]).toEqual([1.5, 0.015]);
    expect(h90[34]).toEqual([845, 0.716]);
    expect(fx.source.sha256['piezometer_h30.txt']).toBe('a705d2fca98d033f840c06604765abbc01014509b30d2d1425626ea50eb3edb5');
  });
});

describe("1. the book's arithmetic is reproduced from its stated inputs", () => {
  it('Jacob, H30 (Example 3.4, p. 68): Δs 0.375 m, t₀ 0.25 min → KD 385 m²/d, S 1.7e-4', () => {
    const T = cooperJacobT(Q, P.jacob_H30.deltaS_m_per_log_cycle);
    expect(Math.round(T)).toBe(P.jacob_H30.KD_m2d); // 385.1 (book: 385, with 2.30 instead of 2.303)
    const S = cooperJacobS(P.jacob_H30.KD_m2d, P.jacob_H30.t0_min, 30);
    expect(Number(S.toPrecision(2))).toBe(P.jacob_H30.S); // 1.67e-4 → 1.7e-4
  });
  it('Theis match point (Example 3.3, p. 65): W(u) = 1, s = 0.16 m, t/r² = 1.5e-3 min/m², 1/u = 10 → KD 392 m²/d, S 1.6e-4', () => {
    const KD = (Q * 1) / (4 * Math.PI * 0.16);
    expect(Math.round(KD)).toBe(P.theis_all.KD_m2d);
    const S = 4 * KD * (1.5e-3 / 1440) * 0.1;
    expect(Number(S.toPrecision(2))).toBe(P.theis_all.S);
    // and the tool's Theis drawdown reproduces the match point: s = Q W(u) / (4π KD) at u = 0.1
    expect(theisDrawdown(Q, KD, S, 30, 1.5e-3 * 900)).toBeCloseTo((Q * wellFunction(0.1)) / (4 * Math.PI * KD), 6);
  });
});

describe('2. AquaScan least-squares analysis vs the published graphical answers (recorded, not tuned)', () => {
  const a30 = analyzeTimeSeriesPumpTest(series('H30'));
  const a90 = analyzeTimeSeriesPumpTest(series('H90'));

  it('H30 Theis fit: T 480 m²/d, S 1.13e-4 (R² 0.990, RMS 0.032 m); +23 % vs the book\'s conclusion 390 m²/d', () => {
    expect(a30.status).toBe('analysed');
    expect(a30.theis!.T_m2d).toBeGreaterThan(475);
    expect(a30.theis!.T_m2d).toBeLessThan(486);
    expect(a30.theis!.S!).toBeGreaterThan(1.08e-4);
    expect(a30.theis!.S!).toBeLessThan(1.18e-4);
    expect(rel(a30.theis!.T_m2d, P.summary.KD_m2d)).toBeGreaterThan(0.2); // documented disagreement
    expect(rel(a30.theis!.T_m2d, P.summary.KD_m2d)).toBeLessThan(0.26);
  });

  it('least squares is optimal for H30: the book\'s Theis and Jacob parameters fit these readings worse', () => {
    const own = a30.theis!.rmse_m;
    expect(rmse('H30', P.theis_all.KD_m2d, P.theis_all.S)).toBeGreaterThan(own);
    expect(rmse('H30', P.jacob_H30.KD_m2d, P.jacob_H30.S)).toBeGreaterThan(own);
  });

  it('H30 Cooper-Jacob (u < 0.01, segment 4-830 min): T 542 m²/d; the segment-choice range contains the book\'s 385', () => {
    const cj = a30.cooperJacob!;
    expect(cj.uCheck.met).toBe(true);
    expect(cj.segment.from_min).toBe(4);
    expect(cj.T_m2d).toBeGreaterThan(535);
    expect(cj.T_m2d).toBeLessThan(550);
    expect(cj.segmentSensitivity_T_m2d[0]).toBeLessThan(P.jacob_H30.KD_m2d);
    expect(cj.segmentSensitivity_T_m2d[1]).toBeGreaterThan(P.jacob_H30.KD_m2d);
  });

  it('H90 Theis fit: T 501 m²/d, S 2.04e-4; Cooper-Jacob 601 m²/d (book Jacob H90: 450 m²/d, S 1.7e-4)', () => {
    expect(a90.theis!.T_m2d).toBeGreaterThan(495);
    expect(a90.theis!.T_m2d).toBeLessThan(507);
    expect(a90.theis!.S!).toBeGreaterThan(1.95e-4);
    expect(a90.theis!.S!).toBeLessThan(2.12e-4);
    expect(a90.cooperJacob!.T_m2d).toBeGreaterThan(590);
    expect(a90.cooperJacob!.T_m2d).toBeLessThan(612);
  });

  it('the test lasted < 24 h: the planning projection is withheld for both piezometers', () => {
    expect(a30.planningEstimate.status).toBe('withheld');
    expect(a90.planningEstimate.status).toBe('withheld');
  });
});
