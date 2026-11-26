/**
 * TIME-SERIES PUMPING-TEST ANALYSIS (AquaScan, 2026-11-25, branch ws/aquascan-pumptest-timeseries).
 *
 * Interprets a constant-rate pumping test entered as timed drawdown readings,
 * with optional rate changes and optional recovery readings. It complements, and
 * never replaces, the single-reading path (buildFieldPumpTestAnalysis in
 * pumpTestAnalyzer.ts), which still gives only the observed specific capacity
 * with INSUFFICIENT EVIDENCE.
 *
 * Methods (documented with formulas, assumptions and references in
 * docs/engineering/aquascan-pumping-test-analysis.md):
 *  - Theis (1935) full-curve least-squares fit, exact W(u) (wellFunction);
 *  - Cooper & Jacob (1946) straight line, with the u < 0.01 validity check;
 *  - Theis (1935) recovery: residual drawdown vs log10(t / t').
 *  - Hantush & Jacob (1955) leaky model: fitted beside Theis to diagnose leakage
 *    (F test + late-time flattening); when diagnosed, T comes from the leaky fit
 *    only if it is within the stated ±10 % tolerance, otherwise no T is given.
 * Storativity only with an observation well at a known distance. Variable-rate
 * tests are NOT analysed by superposition: the first constant-rate segment is
 * analysed and this is stated. No sustainable or safe yield is derived from
 * the parameters; at most a labelled drawdown projection at the tested rate.
 *
 * Units: time in minutes (input), drawdown and distances in metres, rate in
 * m³/h (input); internally T in m²/day, Q in m³/day, t in days.
 */
import { wellFunction, MIN_PUMP_READINGS_FOR_PARAMETERS } from './pumpTestAnalyzer';

export const TIME_SERIES_ANALYSIS_VERSION = 'aquascan-pumptest-timeseries 1.1.0 (2026-11-26, leakage diagnosis)';

// ─────────────────────────────── Input types ───────────────────────────────

export interface DrawdownReading { t_min: number; s_m: number }
export interface RateChange { t_min: number; rate_m3h: number }
export interface RecoveryReading { tPrime_min: number; sResidual_m: number }

/** A validated time-series pumping test (as stored on fieldData.pumpTest.timeSeries). */
export interface PumpTestTimeSeries {
  /** Initial (constant) pumping rate, m³/h. */
  rate_m3h: number;
  /** Changes of rate after the start: time since pumping started (min) and the new rate (m³/h). */
  rateChanges: RateChange[];
  /** Drawdown during pumping: time since pumping started (min), drawdown below static level (m). */
  readings: DrawdownReading[];
  /** Time the pump was stopped, minutes since start; required with recovery readings. */
  pumpingStopped_min: number | null;
  /** Residual drawdown after the pump stopped: time since stop t' (min), residual drawdown s' (m). */
  recovery: RecoveryReading[];
  /** Distance from the pumping well to the observation well (m); null = readings in the pumping well. */
  observationDistance_m: number | null;
  /** Depth of the pump intake below ground (m), optional: gives the available drawdown. */
  pumpIntakeDepth_m: number | null;
  /** Static water level below ground (m) before pumping. */
  staticWaterLevel_m: number;
}

// ───────────────────────────── Plausibility limits ─────────────────────────

export const TS_LIMITS = {
  maxRate_m3h: 500,
  maxDrawdown_m: 500,
  maxTime_min: 2000 * 60,
  maxObservationDistance_m: 5000,
  maxDepth_m: 1500,
  maxStatic_m: 1000,
  maxReadings: 2000,
} as const;

// ─────────────────────────── Paste-from-spreadsheet ────────────────────────

export interface ParsedColumns { rows: [number, number][]; errors: string[]; header: string | null }

const NUM_DOT = /^[+-]?(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?$/;
const NUM_COMMA = /^[+-]?(\d+(,\d*)?|,\d+)([eE][+-]?\d+)?$/;
/** Unit words that are never minutes or metres. */
const FOREIGN_UNIT_WORDS = /\b(ft|feet|foot|inch|inches|sec|secs|seconds?|hrs?|hours?|days?|cm|mm|gpm|lps|lpm)\b/i;
/** Accepted units inside brackets in a header. */
const OK_UNIT = /^(min|mins|minutes?|m|metres?|meters?|m bgl|m below ground|m3\/h|m³\/h)$/i;

function splitCells(line: string): { cells: string[]; decimalComma: boolean } {
  const tryWith = (sep: string | RegExp, decimalComma: boolean) => {
    const cells = line.split(sep).map((c) => c.trim());
    while (cells.length && cells[cells.length - 1] === '') cells.pop();
    return { cells, decimalComma };
  };
  const isNum = (c: string, dc: boolean) => NUM_DOT.test(c) || (dc && NUM_COMMA.test(c));
  const candidates = [tryWith('\t', true), tryWith(';', true), tryWith(',', false), tryWith(/\s+/, true)];
  const good = candidates.find((c) => c.cells.length === 2 && c.cells.every((x) => isNum(x, c.decimalComma)));
  if (good) return good;
  return candidates.find((c) => c.cells.length > 1) ?? candidates[3];
}

/** A header names a unit other than minutes and metres. */
function headerUnitProblem(line: string): boolean {
  if (FOREIGN_UNIT_WORDS.test(line)) return true;
  const bracketed = [...line.matchAll(/[([]([^)\]]*)[)\]]/g)].map((m) => m[1].trim()).filter(Boolean);
  return bracketed.some((u) => !OK_UNIT.test(u));
}

/**
 * Two columns pasted from a spreadsheet (tab-, comma-, semicolon- or
 * space-separated). A first line that is not numeric is taken as a header; if
 * it names a unit other than minutes and metres the paste is refused (this entry
 * takes minutes and metres only; nothing is converted silently). With tab or
 * semicolon separators a decimal comma is accepted.
 */
export function parseTwoColumns(text: string, what: { first: string; second: string }): ParsedColumns {
  const errors: string[] = [];
  const rows: [number, number][] = [];
  let header: string | null = null;
  const lines = String(text ?? '').split(/\r?\n/);
  let seenData = false;
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line) return;
    const { cells, decimalComma } = splitCells(line);
    const isNum = (c: string) => NUM_DOT.test(c) || (decimalComma && NUM_COMMA.test(c));
    const allNumeric = cells.length > 0 && cells.every(isNum);
    if (!seenData && header === null && !allNumeric) {
      header = line;
      if (headerUnitProblem(line)) errors.push(`Header "${line}" names a unit other than minutes and metres. Enter ${what.first} in minutes and ${what.second} in metres (convert before pasting).`);
      return;
    }
    seenData = true;
    if (cells.length !== 2) { errors.push(`Line ${i + 1}: expected 2 columns (${what.first}, ${what.second}), found ${cells.length}.`); return; }
    const vals = cells.map((c) => (isNum(c) ? Number(c.replace(',', '.')) : NaN));
    if (!vals.every(Number.isFinite)) { errors.push(`Line ${i + 1}: "${line}" is not two numbers.`); return; }
    rows.push([vals[0], vals[1]]);
  });
  if (!rows.length && !errors.length) errors.push(`No ${what.first} / ${what.second} rows found.`);
  return { rows, errors, header };
}

// ──────────────────────────────── Validation ───────────────────────────────

export type TsResult<T> = { ok: true; value: T; errors: []; warnings: string[] } | { ok: false; errors: string[]; warnings: string[] };

const fin = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x);

/**
 * Validates a time series and returns it normalised (sorted is NOT applied:
 * unsorted times are rejected, so the analysed order is the entered order).
 * Every reason is listed; nothing is clipped, defaulted or converted.
 */
export function validateTimeSeries(ts: PumpTestTimeSeries): TsResult<PumpTestTimeSeries> {
  const errors: string[] = [];
  const warnings: string[] = [];
  const L = TS_LIMITS;
  const swl = ts.staticWaterLevel_m;
  if (!fin(swl) || swl < 0 || swl > L.maxStatic_m) errors.push(`Static water level must be between 0 and ${L.maxStatic_m} m below ground.`);
  if (!fin(ts.rate_m3h) || !(ts.rate_m3h > 0)) errors.push('Pumping rate (m³/h) is required and must be greater than 0.');
  else if (ts.rate_m3h > L.maxRate_m3h) errors.push(`Pumping rate ${ts.rate_m3h} m³/h is not plausible for one borehole (maximum ${L.maxRate_m3h} m³/h).`);

  const rd = ts.readings ?? [];
  if (rd.length > L.maxReadings) errors.push(`More than ${L.maxReadings} drawdown readings.`);
  if (rd.length < MIN_PUMP_READINGS_FOR_PARAMETERS) errors.push(`At least ${MIN_PUMP_READINGS_FOR_PARAMETERS} timed drawdown readings are needed (${rd.length} entered).`);
  rd.forEach((r, i) => {
    const n = i + 1;
    if (!fin(r.t_min) || !(r.t_min > 0)) errors.push(`Drawdown reading ${n}: time must be greater than 0 minutes.`);
    else if (r.t_min > L.maxTime_min) errors.push(`Drawdown reading ${n}: time ${r.t_min} min is longer than ${L.maxTime_min / 60} h.`);
    else if (i > 0 && fin(rd[i - 1].t_min) && !(r.t_min > rd[i - 1].t_min)) errors.push(`Drawdown reading ${n}: time ${r.t_min} min is not after the previous reading (${rd[i - 1].t_min} min); times must increase.`);
    if (!fin(r.s_m)) errors.push(`Drawdown reading ${n}: drawdown is not a number.`);
    else if (r.s_m < 0) errors.push(`Drawdown reading ${n}: drawdown ${r.s_m} m is negative (the water level is above the static level).`);
    else if (r.s_m > L.maxDrawdown_m) errors.push(`Drawdown reading ${n}: drawdown ${r.s_m} m is not plausible (maximum ${L.maxDrawdown_m} m).`);
  });
  const lastT = rd.length ? rd[rd.length - 1].t_min : NaN;
  if (rd.length && rd.every((r) => fin(r.s_m) && r.s_m === 0)) errors.push('Every drawdown reading is 0 m: there is no drawdown to analyse.');

  // Rate changes
  let prevRate = ts.rate_m3h;
  (ts.rateChanges ?? []).forEach((c, i) => {
    const n = i + 1;
    if (!fin(c.t_min) || !(c.t_min > 0)) errors.push(`Rate change ${n}: time must be greater than 0 minutes.`);
    else if (i > 0 && fin(ts.rateChanges[i - 1].t_min) && !(c.t_min > ts.rateChanges[i - 1].t_min)) errors.push(`Rate change ${n}: times must increase.`);
    else if (fin(lastT) && c.t_min >= lastT) errors.push(`Rate change ${n}: at ${c.t_min} min, at or after the last drawdown reading (${lastT} min).`);
    if (!fin(c.rate_m3h) || !(c.rate_m3h > 0)) errors.push(`Rate change ${n}: the new rate must be greater than 0 m³/h (enter the pump stop as "pumping stopped", not as a rate of 0).`);
    else if (c.rate_m3h > L.maxRate_m3h) errors.push(`Rate change ${n}: ${c.rate_m3h} m³/h is not plausible (maximum ${L.maxRate_m3h}).`);
    else if (fin(prevRate) && c.rate_m3h === prevRate) errors.push(`Rate change ${n}: the rate ${c.rate_m3h} m³/h is the same as before; remove the row.`);
    if (fin(c.rate_m3h)) prevRate = c.rate_m3h;
  });

  // Recovery
  const rec = ts.recovery ?? [];
  const tp = ts.pumpingStopped_min;
  if (rec.length) {
    if (!fin(tp) || !(tp > 0)) errors.push('Recovery readings need the time the pump was stopped (minutes since pumping started).');
    else if (fin(lastT) && tp < lastT) errors.push(`The pump stop time (${tp} min) is before the last drawdown reading (${lastT} min).`);
    else if (tp > L.maxTime_min) errors.push(`The pump stop time ${tp} min is longer than ${L.maxTime_min / 60} h.`);
    if (rec.length < 3) errors.push(`At least 3 recovery readings are needed for a recovery analysis (${rec.length} entered); leave the recovery table empty if there are none.`);
    const sMaxPump = Math.max(...rd.map((r) => (fin(r.s_m) ? r.s_m : 0)), 0);
    rec.forEach((r, i) => {
      const n = i + 1;
      if (!fin(r.tPrime_min) || !(r.tPrime_min > 0)) errors.push(`Recovery reading ${n}: time since the pump stopped must be greater than 0 minutes.`);
      else if (r.tPrime_min > L.maxTime_min) errors.push(`Recovery reading ${n}: time ${r.tPrime_min} min is longer than ${L.maxTime_min / 60} h.`);
      else if (i > 0 && fin(rec[i - 1].tPrime_min) && !(r.tPrime_min > rec[i - 1].tPrime_min)) errors.push(`Recovery reading ${n}: times must increase.`);
      if (!fin(r.sResidual_m)) errors.push(`Recovery reading ${n}: residual drawdown is not a number.`);
      else if (r.sResidual_m < 0) errors.push(`Recovery reading ${n}: residual drawdown ${r.sResidual_m} m is negative (above the static level); check the static level.`);
      else if (r.sResidual_m > sMaxPump * 1.05 + 0.05) errors.push(`Recovery reading ${n}: residual drawdown ${r.sResidual_m} m is more than the largest pumping drawdown (${sMaxPump} m).`);
    });
  } else if (tp != null && !(fin(tp) && tp > 0 && (!fin(lastT) || tp >= lastT))) {
    errors.push('The pump stop time, if entered, must be at or after the last drawdown reading.');
  }

  if (ts.observationDistance_m != null && !(fin(ts.observationDistance_m) && ts.observationDistance_m > 0 && ts.observationDistance_m <= L.maxObservationDistance_m)) {
    errors.push(`Observation-well distance, if entered, must be more than 0 and at most ${L.maxObservationDistance_m} m (leave it empty for readings in the pumping well).`);
  }
  if (ts.pumpIntakeDepth_m != null) {
    if (!(fin(ts.pumpIntakeDepth_m) && ts.pumpIntakeDepth_m > 0 && ts.pumpIntakeDepth_m <= L.maxDepth_m)) errors.push(`Pump intake depth, if entered, must be between 0 and ${L.maxDepth_m} m.`);
    else if (fin(swl) && !(ts.pumpIntakeDepth_m > swl)) errors.push('Pump intake depth must be deeper than the static water level.');
    else if (fin(swl) && ts.observationDistance_m == null) {
      const avail = ts.pumpIntakeDepth_m - swl;
      const over = rd.find((r) => fin(r.s_m) && r.s_m > avail + 1e-9);
      if (over) errors.push(`Drawdown ${over.s_m} m at ${over.t_min} min is more than the available drawdown to the pump intake (${round(avail, 2)} m); check the readings or the intake depth.`);
    }
  }

  // Warnings: kept with the result, they do not block the entry.
  if (!errors.length) {
    if (!rd.some((r) => r.t_min <= 10)) warnings.push('No reading in the first 10 minutes: the early-time curve shape (Theis fit) is poorly constrained.');
    if (lastT < 1440) warnings.push(`Pumping lasted ${round(lastT / 60, 1)} h, less than 24 h: long-term behaviour is not tested.`);
    let drops = 0;
    for (let i = 1; i < rd.length; i++) if (rd[i].s_m < rd[i - 1].s_m - 0.02) drops++;
    if (drops) warnings.push(`${drops} reading(s) show drawdown decreasing by more than 2 cm while pumping (rate fluctuation, measurement error or recharge).`);
    if (rd.length < 10) warnings.push(`Only ${rd.length} pumping readings: fit statistics are weak.`);
  }
  if (errors.length) return { ok: false, errors, warnings };
  return {
    ok: true, errors: [], warnings,
    value: {
      rate_m3h: ts.rate_m3h,
      rateChanges: (ts.rateChanges ?? []).map((c) => ({ t_min: c.t_min, rate_m3h: c.rate_m3h })),
      readings: rd.map((r) => ({ t_min: r.t_min, s_m: r.s_m })),
      pumpingStopped_min: fin(tp) ? tp : null,
      recovery: rec.map((r) => ({ tPrime_min: r.tPrime_min, sResidual_m: r.sResidual_m })),
      observationDistance_m: fin(ts.observationDistance_m) ? ts.observationDistance_m : null,
      pumpIntakeDepth_m: fin(ts.pumpIntakeDepth_m) ? ts.pumpIntakeDepth_m : null,
      staticWaterLevel_m: swl,
    },
  };
}

// ─────────────────────────────── Numerics ─────────────────────────────────

function round(x: number, dp: number): number { const f = 10 ** dp; return Math.round(x * f) / f; }

interface Line { slope: number; intercept: number; r2: number; rmse: number; n: number }
function fitLine(x: number[], y: number[]): Line {
  const n = x.length;
  const mx = x.reduce((a, b) => a + b, 0) / n;
  const my = y.reduce((a, b) => a + b, 0) / n;
  let sxx = 0, sxy = 0, syy = 0;
  for (let i = 0; i < n; i++) { sxx += (x[i] - mx) ** 2; sxy += (x[i] - mx) * (y[i] - my); syy += (y[i] - my) ** 2; }
  const slope = sxx > 0 ? sxy / sxx : 0;
  const intercept = my - slope * mx;
  let ss = 0;
  for (let i = 0; i < n; i++) ss += (y[i] - (slope * x[i] + intercept)) ** 2;
  return { slope, intercept, r2: syy > 0 ? 1 - ss / syy : 0, rmse: Math.sqrt(ss / n), n };
}

const FOUR_PI = 4 * Math.PI;
/** Theis drawdown, Q in m³/d, T in m²/d, P = r²S in m², t in days. */
const theisS = (Q: number, T: number, P: number, tDay: number) => (Q / (FOUR_PI * T)) * wellFunction(P / (4 * T * tDay));

/** Cooper-Jacob transmissivity T = 2.303 Q / (4π Δs): Q in m³/day, Δs in m per log10 cycle → m²/day. */
export const cooperJacobT = (Q_m3d: number, deltaS_m: number): number => (deltaS_m > 0 ? (2.303 * Q_m3d) / (FOUR_PI * deltaS_m) : NaN);
/** Cooper-Jacob storativity S = 2.25 T t₀ / r²: T in m²/day, t₀ in minutes, r in m. */
export const cooperJacobS = (T_m2d: number, t0_min: number, r_m: number): number => (2.25 * T_m2d * (t0_min / 1440)) / (r_m * r_m);
/** Theis drawdown (m) at distance r (m) and time t (min) for Q in m³/day, T in m²/day. */
export const theisDrawdown = (Q_m3d: number, T_m2d: number, S: number, r_m: number, t_min: number): number => theisS(Q_m3d, T_m2d, r_m * r_m * S, t_min / 1440);

interface TheisFit { T: number; P: number; sse: number; r2: number; rmse: number; maxAbs: number; ciT: [number, number] | null; ciP: [number, number] | null; iterations: number }

/**
 * Least-squares fit of s = Q/(4πT)·W(P/(4Tt)) on (ln T, ln P), P = r²S.
 * Levenberg-Marquardt with central-difference Jacobian; seeded from a coarse
 * grid. Deterministic. Linearised 95 % intervals from σ²(JᵀJ)⁻¹ (statistical
 * fit uncertainty only, not model error).
 */
function fitTheis(Q: number, tDay: number[], s: number[], seedT: number): TheisFit | null {
  const n = s.length;
  if (n < 3) return null;
  const LT = [Math.log(1e-3), Math.log(1e6)], LP = [Math.log(1e-14), Math.log(1e8)];
  const clamp = (v: number, b: number[]) => Math.min(b[1], Math.max(b[0], v));
  const resid = (lt: number, lp: number) => { const T = Math.exp(lt), P = Math.exp(lp); return s.map((si, i) => si - theisS(Q, T, P, tDay[i])); };
  const sse = (r: number[]) => r.reduce((a, x) => a + x * x, 0);
  // Coarse grid seed: T over ×1/30..×30 of the seed, P over its full range.
  let best = { lt: Math.log(seedT), lp: 0, v: Infinity };
  for (let a = -3.4; a <= 3.41; a += 0.34) {
    for (let lp = LP[0]; lp <= LP[1]; lp += 0.5) {
      const lt = clamp(Math.log(seedT) + a, LT);
      const v = sse(resid(lt, lp));
      if (v < best.v) best = { lt, lp, v };
    }
  }
  let lt = best.lt, lp = best.lp, cur = best.v, lambda = 1e-3, it = 0;
  const h = 1e-6;
  for (; it < 300; it++) {
    const r0 = resid(lt, lp);
    const rT1 = resid(lt + h, lp), rT2 = resid(lt - h, lp), rP1 = resid(lt, lp + h), rP2 = resid(lt, lp - h);
    // J = d(model)/d(param) = -d(resid)/d(param)
    let a11 = 0, a12 = 0, a22 = 0, g1 = 0, g2 = 0;
    for (let i = 0; i < n; i++) {
      const j1 = -(rT1[i] - rT2[i]) / (2 * h), j2 = -(rP1[i] - rP2[i]) / (2 * h);
      a11 += j1 * j1; a12 += j1 * j2; a22 += j2 * j2; g1 += j1 * r0[i]; g2 += j2 * r0[i];
    }
    let improved = false;
    for (let k = 0; k < 30; k++) {
      const b11 = a11 * (1 + lambda), b22 = a22 * (1 + lambda);
      const det = b11 * b22 - a12 * a12;
      if (!(Math.abs(det) > 0)) { lambda *= 10; continue; }
      const d1 = (g1 * b22 - g2 * a12) / det, d2 = (b11 * g2 - a12 * g1) / det;
      const nlt = clamp(lt + d1, LT), nlp = clamp(lp + d2, LP);
      const v = sse(resid(nlt, nlp));
      if (v < cur) {
        const done = Math.abs(cur - v) <= 1e-14 * Math.max(1, cur) || (Math.abs(nlt - lt) < 1e-10 && Math.abs(nlp - lp) < 1e-10);
        lt = nlt; lp = nlp; cur = v; lambda = Math.max(1e-12, lambda / 10); improved = true;
        if (done) it = 1e9;
        break;
      }
      lambda *= 10;
    }
    if (!improved) break;
  }
  const r = resid(lt, lp);
  const mean = s.reduce((a, b) => a + b, 0) / n;
  const syy = s.reduce((a, b) => a + (b - mean) ** 2, 0);
  // Linearised covariance on (ln T, ln P).
  let ciT: [number, number] | null = null, ciP: [number, number] | null = null;
  if (n > 2) {
    const rT1 = resid(lt + h, lp), rT2 = resid(lt - h, lp), rP1 = resid(lt, lp + h), rP2 = resid(lt, lp - h);
    let a11 = 0, a12 = 0, a22 = 0;
    for (let i = 0; i < n; i++) {
      const j1 = (rT1[i] - rT2[i]) / (2 * h), j2 = (rP1[i] - rP2[i]) / (2 * h);
      a11 += j1 * j1; a12 += j1 * j2; a22 += j2 * j2;
    }
    const det = a11 * a22 - a12 * a12;
    const s2 = cur / (n - 2);
    if (det > 0) {
      const vT = (s2 * a22) / det, vP = (s2 * a11) / det;
      const z = 1.96;
      ciT = [Math.exp(lt - z * Math.sqrt(vT)), Math.exp(lt + z * Math.sqrt(vT))];
      ciP = [Math.exp(lp - z * Math.sqrt(vP)), Math.exp(lp + z * Math.sqrt(vP))];
    }
  }
  return {
    T: Math.exp(lt), P: Math.exp(lp), sse: cur, r2: syy > 0 ? 1 - cur / syy : 0,
    rmse: Math.sqrt(cur / n), maxAbs: Math.max(...r.map(Math.abs)), ciT, ciP, iterations: Math.min(it, 300),
  };
}

/**
 * Hantush leaky well function W(u, β) = ∫_u^∞ (1/y) exp(-y - β²/(4y)) dy, β = r/L
 * (Hantush & Jacob 1955; Kruseman & de Ridder 1994, section 4.2.1). β = 0 is the
 * Theis W(u) exactly. For β > 0: Simpson's rule in x = ln y, step ≤ 0.04, over the
 * range where the integrand is not negligible (y from max(u, β²/160) to 40; outside
 * it the integrand is below e^-40). Same convention as wellFunction: 0 for u > 10.
 */
export function hantushW(u: number, beta: number): number {
  if (!(beta > 0)) return wellFunction(u);
  if (u > 10) return 0;
  const a = Math.max(Math.log(Math.max(u, 1e-300)), Math.log((beta * beta) / 160)), c = Math.log(40);
  if (a >= c) return 0;
  const N = 2 * Math.ceil((c - a) / 0.08);
  const h = (c - a) / N;
  const b2 = (beta * beta) / 4;
  let sum = 0;
  for (let i = 0; i <= N; i++) {
    const y = Math.exp(a + i * h);
    sum += Math.exp(-y - b2 / y) * (i === 0 || i === N ? 1 : i % 2 ? 4 : 2);
  }
  return (sum * h) / 3;
}
const hantushS = (Q: number, T: number, P: number, beta: number, tDay: number) => (Q / (FOUR_PI * T)) * hantushW(P / (4 * T * tDay), beta);

/**
 * Upper 1 % point of Student's t (two-sided 0.99) for ν degrees of freedom
 * (Cornish-Fisher expansion, Abramowitz & Stegun 26.7.5; error < 0.01 for ν ≥ 3).
 * F(0.01; 1, ν) = t² is the extra-sum-of-squares critical value for one added parameter.
 */
function t995(nu: number): number {
  const z = 2.5758293035489;
  const z3 = z ** 3, z5 = z ** 5, z7 = z ** 7, z9 = z ** 9;
  return z + (z3 + z) / (4 * nu) + (5 * z5 + 16 * z3 + 3 * z) / (96 * nu ** 2)
    + (3 * z7 + 19 * z5 + 17 * z3 - 15 * z) / (384 * nu ** 3)
    + (79 * z9 + 776 * z7 + 1482 * z5 - 1920 * z3 - 945 * z) / (92160 * nu ** 4);
}

interface HantushFit { T: number; P: number; beta: number; sse: number; r2: number; rmse: number; ciT: [number, number] | null }

/**
 * Least-squares fit of the Hantush-Jacob leaky model s = Q/(4πT)·W(P/(4Tt), β) on
 * (ln T, ln P, ln β), P = r²S, β = r/L. Deterministic Nelder-Mead from the Theis fit
 * and a grid of β; linearised 95 % interval on T from σ²(JᵀJ)⁻¹ (statistical only).
 */
function fitHantush(Q: number, tDay: number[], s: number[], theisT: number, theisP: number): HantushFit | null {
  const n = s.length;
  if (n < 4) return null;
  const B = [Math.log(1e-4), Math.log(10)], LT = [Math.log(1e-3), Math.log(1e6)], LP = [Math.log(1e-14), Math.log(1e8)];
  const clamp = (v: number, b: number[]) => Math.min(b[1], Math.max(b[0], v));
  const fix = (x: number[]) => [clamp(x[0], LT), clamp(x[1], LP), clamp(x[2], B)];
  const resid = (x: number[]) => { const T = Math.exp(x[0]), P = Math.exp(x[1]), b = Math.exp(x[2]); return s.map((si, i) => si - hantushS(Q, T, P, b, tDay[i])); };
  const sse = (x: number[]) => resid(fix(x)).reduce((acc, v) => acc + v * v, 0);
  let best = { x: [Math.log(theisT), Math.log(theisP), B[0]], v: Infinity };
  for (let lb = B[0]; lb <= B[1] + 1e-9; lb += 0.5) {
    const x = [Math.log(theisT), Math.log(theisP), lb];
    const v = sse(x);
    if (v < best.v) best = { x, v };
  }
  // Nelder-Mead (standard coefficients), restarted once from the best vertex.
  let x0 = best.x;
  let fv = best.v;
  for (let restart = 0; restart < 2; restart++) {
    let pts = [x0, ...[0, 1, 2].map((j) => x0.map((v, k) => (k === j ? v + (j === 2 ? 1 : 0.3) : v)))];
    let vals = pts.map(sse);
    for (let it = 0; it < 400; it++) {
      const ord = [0, 1, 2, 3].sort((a, b) => vals[a] - vals[b]);
      pts = ord.map((i) => pts[i]); vals = ord.map((i) => vals[i]);
      if (vals[3] - vals[0] <= 1e-12 * Math.max(1e-12, vals[0])) break;
      const c = [0, 1, 2].map((k) => (pts[0][k] + pts[1][k] + pts[2][k]) / 3);
      const along = (f: number) => c.map((v, k) => v + f * (v - pts[3][k]));
      const xr = along(1), fr = sse(xr);
      if (fr < vals[0]) { const xe = along(2), fe = sse(xe); if (fe < fr) { pts[3] = xe; vals[3] = fe; } else { pts[3] = xr; vals[3] = fr; } }
      else if (fr < vals[2]) { pts[3] = xr; vals[3] = fr; }
      else {
        const xc = along(-0.5), fc = sse(xc);
        if (fc < vals[3]) { pts[3] = xc; vals[3] = fc; }
        else for (let i = 1; i < 4; i++) { pts[i] = pts[i].map((v, k) => pts[0][k] + 0.5 * (v - pts[0][k])); vals[i] = sse(pts[i]); }
      }
    }
    const i0 = vals.indexOf(Math.min(...vals));
    x0 = fix(pts[i0]); fv = vals[i0];
  }
  const x = x0;
  const mean = s.reduce((a, b) => a + b, 0) / n;
  const syy = s.reduce((a, b) => a + (b - mean) ** 2, 0);
  // Linearised covariance on (ln T, ln P, ln β): T variance = s²·[(JᵀJ)⁻¹]₁₁.
  let ciT: [number, number] | null = null;
  const h = 1e-5;
  const J: number[][] = [0, 1, 2].map((k) => {
    const up = x.slice(), dn = x.slice(); up[k] += h; dn[k] -= h;
    const ru = resid(up), rd = resid(dn);
    return ru.map((v, i) => (v - rd[i]) / (2 * h));
  });
  const A = [0, 1, 2].map((p) => [0, 1, 2].map((q) => J[p].reduce((acc, v, i) => acc + v * J[q][i], 0)));
  const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
  if (n > 3 && det > 0) {
    const inv11 = (A[1][1] * A[2][2] - A[1][2] * A[2][1]) / det;
    const vT = (fv / (n - 3)) * inv11;
    if (vT >= 0) { const z = 1.96; ciT = [Math.exp(x[0] - z * Math.sqrt(vT)), Math.exp(x[0] + z * Math.sqrt(vT))]; }
  }
  return { T: Math.exp(x[0]), P: Math.exp(x[1]), beta: Math.exp(x[2]), sse: fv, r2: syy > 0 ? 1 - fv / syy : 0, rmse: Math.sqrt(fv / n), ciT };
}

/**
 * Stated tolerance for a transmissivity from the leaky (Hantush-Jacob) fit: it is
 * reported only when its 95 % fit interval lies within ±10 % of the fitted value,
 * the agreement tolerance used against the published Oude Korendijk answer
 * (docs/engineering/aquascan-pumping-test-analysis.md, section 5a).
 */
export const LEAKY_T_TOLERANCE = 0.1;

// ──────────────────────────────── Output types ─────────────────────────────

export type Row = [string, string, string];

export interface TimeSeriesAnalysis {
  basis: 'time-series';
  version: string;
  status: 'analysed' | 'insufficient';
  geometry: 'observation-well' | 'pumping-well';
  observationDistance_m: number | null;
  testedRate_m3h: number;
  analysedSegment: { from_min: number; to_min: number; rate_m3h: number; readings: number; statement: string };
  variableRate: { changes: number; statement: string } | null;
  specificCapacity: { value_m3h_per_m: number; atTime_min: number; drawdown_m: number; statement: string } | null;
  theis: {
    T_m2d: number; S: number | null; r2: number; rmse_m: number; maxAbsResidual_m: number;
    T_ci95_m2d: [number, number] | null; S_ci95: [number, number] | null;
    residuals: { t_min: number; observed_m: number; fitted_m: number; residual_m: number }[];
    usable: boolean; note: string;
  } | null;
  cooperJacob: {
    T_m2d: number; S: number | null; slopePerLogCycle_m: number; t0_min: number;
    segment: { from_min: number; to_min: number; readings: number };
    r2: number; rmse_m: number;
    uCheck: { criterion: 'u < 0.01'; validAfter_min: number; met: boolean; statement: string };
    segmentSensitivity_T_m2d: [number, number]; segmentWindows: number;
    usable: boolean; note: string;
  } | null;
  recovery: {
    T_m2d: number; slopePerLogCycle_m: number; r2: number; readings: number;
    residualAtRatio1_m: number; usable: boolean; note: string;
  } | null;
  recoveryNotAnalysed: string | null;
  /**
   * Leakage diagnosis (S40 / CA-11, 2026-11-26): the Hantush-Jacob leaky model fitted
   * beside Theis. Leakage is diagnosed when the leaky model fits significantly better
   * (extra-sum-of-squares F test, 1 % level) AND the late readings lie below the Theis
   * curve (the late-time flattening of a leaky aquifer). null when not evaluated.
   */
  leakage: {
    diagnosed: boolean;
    T_m2d: number; S: number | null; rOverL: number; L_m: number | null;
    r2: number; rmse_m: number; T_ci95_m2d: [number, number] | null;
    fStatistic: number; fCritical: number; lateTheisResidual_m: number;
    tWithinTolerance: boolean; usable: boolean;
    fitted: { t_min: number; fitted_m: number }[];
    statement: string;
  } | null;
  transmissivity: { value_m2d: number; value_m2s: number; method: string; methodsRange_m2d: [number, number]; spreadPct: number; statement: string } | null;
  storativity: { value: number; method: string; methodsRange: [number, number] } | null;
  storativityStatement: string;
  planningEstimate: {
    status: 'presented' | 'withheld';
    horizon_days: number;
    projectedDrawdown_m: number | null;
    availableDrawdown_m: number | null;
    logCyclesExtrapolated: number | null;
    statement: string;
    assumptions: string[];
  };
  assumptions: string[];
  limitations: string[];
  warnings: string[];
  references: string[];
  insufficientEvidence: string | null;
  required: readonly string[] | null;
  /** The display rows used by the Pump Test tab and every export: identical text everywhere. */
  rows: Row[];
}

export const TS_REFERENCES: readonly string[] = [
  'Theis, C.V. (1935). The relation between the lowering of the piezometric surface and the rate and duration of discharge of a well using ground-water storage. Trans. American Geophysical Union 16(2): 519-524.',
  'Cooper, H.H. and Jacob, C.E. (1946). A generalized graphical method for evaluating formation constants and summarizing well-field history. Trans. American Geophysical Union 27(4): 526-534.',
  'Kruseman, G.P. and de Ridder, N.A. (1994). Analysis and Evaluation of Pumping Test Data, 2nd ed. ILRI Publication 47, Wageningen (sections 3.2.1 Theis, 3.2.2 Jacob straight line, 3.2.3 Theis recovery, 4.2.1 Hantush-Jacob leaky aquifer).',
  'Hantush, M.S. and Jacob, C.E. (1955). Non-steady radial flow in an infinite leaky aquifer. Trans. American Geophysical Union 36(1): 95-100.',
];

export const TS_ASSUMPTIONS: readonly string[] = [
  'Confined, homogeneous, isotropic aquifer of infinite areal extent and uniform thickness (Theis 1935).',
  'Fully penetrating well; flow horizontal; water released instantaneously from storage.',
  'Constant pumping rate over the analysed segment; drawdown measured from a static (non-trending) level.',
  'Well-bore storage negligible after the first readings; no leakage, recharge or boundaries within the test duration (Theis, Cooper-Jacob, recovery). Leakage is tested for with the Hantush-Jacob model (leaky aquifer, no aquitard storage); when it is diagnosed, the confined-model results are not used.',
  'For an unconfined aquifer the method holds only while drawdown is small relative to the saturated thickness (no Neuman delayed-yield correction is applied).',
];

const FIELD_REQUIRED: readonly string[] = [
  `At least ${MIN_PUMP_READINGS_FOR_PARAMETERS} timed drawdown readings at one constant pumping rate, from the first minutes to the end of the test.`,
  'A drawdown curve that rises with log time (a straight-line late-time segment for Cooper-Jacob).',
  'Recovery readings after the pump stops, where available.',
  'An observation well at a measured distance if storativity is wanted.',
  'An independent interpretation by a registered hydrogeologist.',
];

const HORIZON_DAYS = 365;
/** Appended to every presented planning estimate (management, 2026-11-25). */
export const PLANNING_NOT_YIELD = 'This is a modelled projection, not a sustainable-yield determination; the abstraction rate must be determined by a registered hydrogeologist.';

const sig = (x: number, d = 3) => (Number.isFinite(x) ? Number(x.toPrecision(d)).toString() : '—');
const sci = (x: number) => (Number.isFinite(x) ? x.toExponential(2) : '—');
const m2 = (x: number) => `${sig(x)} m²/day`;

// ──────────────────────────────── Analysis ────────────────────────────────

/**
 * Analyses a VALIDATED time series (validateTimeSeries). Throws if handed an
 * invalid one, so an unvalidated record can never yield numbers.
 */
export function analyzeTimeSeriesPumpTest(input: PumpTestTimeSeries): TimeSeriesAnalysis {
  const v = validateTimeSeries(input);
  if (!v.ok) throw new Error(`Time-series pumping test not valid: ${v.errors.join(' ')}`);
  const ts = v.value;
  const warnings = [...v.warnings];
  const limitations: string[] = [];
  const r = ts.observationDistance_m;
  const geometry: TimeSeriesAnalysis['geometry'] = r != null ? 'observation-well' : 'pumping-well';
  const Q_h = ts.rate_m3h;
  const Q = Q_h * 24; // m³/day

  // Constant-rate segment: up to the first rate change (superposition not implemented).
  const firstChange = ts.rateChanges.length ? ts.rateChanges[0].t_min : Infinity;
  const seg = ts.readings.filter((x) => x.t_min <= firstChange);
  const segEnd = seg.length ? seg[seg.length - 1].t_min : 0;
  const variableRate = ts.rateChanges.length
    ? { changes: ts.rateChanges.length, statement: `Variable-rate analysis not supported: constant-rate segment analysed (0 to ${sig(Math.min(firstChange, segEnd), 4)} min at ${Q_h} m³/h). The rate changed ${ts.rateChanges.length} time(s); readings after ${firstChange} min are not used.` }
    : null;
  if (variableRate) limitations.push(variableRate.statement);
  const analysedSegment = {
    from_min: 0, to_min: segEnd, rate_m3h: Q_h, readings: seg.length,
    statement: `${seg.length} readings at a constant ${Q_h} m³/h from 0 to ${sig(segEnd, 4)} min.`,
  };
  const endS = seg.length ? seg[seg.length - 1].s_m : NaN;
  const specificCapacity = seg.length && endS > 0
    ? { value_m3h_per_m: Q_h / endS, atTime_min: segEnd, drawdown_m: endS, statement: `Observed specific capacity ${sig(Q_h / endS)} m³/h per m (${Q_h} m³/h at ${endS} m drawdown after ${sig(segEnd, 4)} min); it applies to this rate and duration only.` }
    : null;

  const base = {
    basis: 'time-series' as const, version: TIME_SERIES_ANALYSIS_VERSION, geometry, observationDistance_m: r,
    testedRate_m3h: Q_h, analysedSegment, variableRate, specificCapacity,
    assumptions: [...TS_ASSUMPTIONS], references: [...TS_REFERENCES],
  };

  if (seg.length < MIN_PUMP_READINGS_FOR_PARAMETERS) {
    const msg = `INSUFFICIENT EVIDENCE: only ${seg.length} reading(s) at the initial constant rate (at least ${MIN_PUMP_READINGS_FOR_PARAMETERS} needed). Transmissivity, storativity and any yield projection are not calculated.`;
    const out: TimeSeriesAnalysis = {
      ...base, status: 'insufficient', theis: null, cooperJacob: null, recovery: null,
      recoveryNotAnalysed: 'Not analysed: the pumping record is insufficient.', leakage: null,
      transmissivity: null, storativity: null, storativityStatement: 'Not determined.',
      planningEstimate: { status: 'withheld', horizon_days: HORIZON_DAYS, projectedDrawdown_m: null, availableDrawdown_m: null, logCyclesExtrapolated: null, statement: 'Withheld: INSUFFICIENT EVIDENCE.', assumptions: [] },
      limitations, warnings, insufficientEvidence: msg, required: FIELD_REQUIRED, rows: [],
    };
    out.rows = buildRows(out);
    return out;
  }

  const tMin = seg.map((x) => x.t_min);
  const tDay = tMin.map((t) => t / 1440);
  const s = seg.map((x) => x.s_m);
  const lg = tMin.map((t) => Math.log10(t));

  // ── Cooper-Jacob: s = (2.303 Q / 4πT) log10(2.25 T t / (r² S)) ──
  const cjAt = (i0: number, i1: number) => fitLine(lg.slice(i0, i1 + 1), s.slice(i0, i1 + 1));
  const n = seg.length;
  let start = Math.floor(n / 2);
  let cjLine = cjAt(start, n - 1);
  let validAfter = NaN;
  const cjParams = (ln: Line) => {
    const T = cooperJacobT(Q, ln.slope);
    const t0 = ln.slope > 0 ? 10 ** (-ln.intercept / ln.slope) : NaN; // minutes
    const P = 2.25 * T * (t0 / 1440); // r²S, m²
    return { T, t0, P };
  };
  for (let k = 0; k < 25; k++) {
    const p = cjParams(cjLine);
    if (!(p.T > 0 && p.P > 0)) break;
    validAfter = (p.P / (4 * p.T * 0.01)) * 1440; // minutes: u < 0.01 ⇔ t > r²S / (0.04 T)
    let ns = tMin.findIndex((t) => t > validAfter);
    if (ns < 0 || n - ns < 3) ns = n - 3;
    if (ns === start) break;
    start = ns;
    cjLine = cjAt(start, n - 1);
  }
  // The iteration can oscillate between two segments (e.g. leaky late-time flattening,
  // Oude Korendijk H30). Then take the earliest start whose own fit satisfies u < 0.01
  // for every reading in the segment (self-consistent); if none exists, the check fails.
  {
    const consistent = (i: number) => { const p = cjParams(cjAt(i, n - 1)); return p.T > 0 && p.P > 0 && tMin[i] > (p.P / (4 * p.T * 0.01)) * 1440; };
    if (!consistent(start)) {
      for (let i = 0; i <= n - 3; i++) if (consistent(i)) { start = i; cjLine = cjAt(start, n - 1); break; }
    }
  }
  const cjp = cjParams(cjLine);
  let cooperJacob: TimeSeriesAnalysis['cooperJacob'] = null;
  if (cjp.T > 0 && Number.isFinite(cjp.T)) {
    validAfter = (cjp.P / (4 * cjp.T * 0.01)) * 1440;
    const metCount = tMin.slice(start).filter((t) => t > validAfter).length;
    const met = metCount === n - start && n - start >= 3;
    // Segment sensitivity: every window with ≥ 3 readings that starts or ends inside the chosen segment.
    const Ts: number[] = [];
    for (let i = start; i <= n - 3; i++) { const p = cjParams(cjAt(i, n - 1)); if (p.T > 0) Ts.push(p.T); }
    for (let j = start + 2; j < n - 1; j++) { const p = cjParams(cjAt(start, j)); if (p.T > 0) Ts.push(p.T); }
    const usable = met && cjLine.r2 >= 0.95;
    const uNote = geometry === 'pumping-well'
      ? ' In the pumping well, r²S is apparent (it absorbs well losses), so the check is indicative.'
      : '';
    cooperJacob = {
      T_m2d: cjp.T, S: r != null ? cjp.P / (r * r) : null, slopePerLogCycle_m: cjLine.slope, t0_min: cjp.t0,
      segment: { from_min: tMin[start], to_min: tMin[n - 1], readings: n - start },
      r2: cjLine.r2, rmse_m: cjLine.rmse,
      uCheck: {
        criterion: 'u < 0.01', validAfter_min: validAfter, met,
        statement: met
          ? `u < 0.01 holds after ${sig(validAfter)} min; all ${n - start} readings in the straight-line segment (${sig(tMin[start], 4)} to ${sig(tMin[n - 1], 4)} min) satisfy it.${uNote}`
          : `u < 0.01 requires t > ${sig(validAfter)} min; fewer than 3 readings satisfy it, so the straight line is fitted to the last 3 readings and Cooper-Jacob is NOT valid for this test.${uNote}`,
      },
      segmentSensitivity_T_m2d: [Math.min(...Ts, cjp.T), Math.max(...Ts, cjp.T)], segmentWindows: Ts.length,
      usable,
      note: usable ? 'Valid: u < 0.01 met and R² >= 0.95.' : !met ? 'Not used: u < 0.01 validity not met.' : `Not used: straight-line fit R² ${cjLine.r2.toFixed(3)} < 0.95.`,
    };
  } else {
    limitations.push('Cooper-Jacob: drawdown does not increase with log time in the late segment; no straight-line transmissivity.');
  }

  // ── Theis full-curve fit ──
  const seedT = cooperJacob ? cooperJacob.T_m2d : (1.22 * Q) / Math.max(...s);
  const tf = fitTheis(Q, tDay, s, seedT);
  let theis: TimeSeriesAnalysis['theis'] = null;
  if (tf) {
    const usable = tf.r2 >= 0.98;
    theis = {
      T_m2d: tf.T, S: r != null ? tf.P / (r * r) : null, r2: tf.r2, rmse_m: tf.rmse, maxAbsResidual_m: tf.maxAbs,
      T_ci95_m2d: tf.ciT, S_ci95: r != null && tf.ciP ? [tf.ciP[0] / (r * r), tf.ciP[1] / (r * r)] : null,
      residuals: seg.map((x, i) => { const f = theisS(Q, tf.T, tf.P, tDay[i]); return { t_min: x.t_min, observed_m: x.s_m, fitted_m: f, residual_m: x.s_m - f }; }),
      usable,
      note: usable ? 'Fit R² >= 0.98.' : `Not used: fit R² ${tf.r2.toFixed(3)} < 0.98 (the record is not Theis-shaped: leakage, boundaries, well-bore storage or a non-constant rate).`,
    };
  }

  // ── Leakage diagnosis: Hantush-Jacob leaky model vs Theis (S40 / CA-11) ──
  // Mechanism (Kruseman & de Ridder 1994, section 4.2.1): leakage through the aquitard
  // makes the late drawdown rise more slowly than Theis and approach a steady state.
  // Confined-model fits then flatten and overstate T. The leaky model nests Theis
  // (β = r/L → 0), so one added parameter is tested by the extra-sum-of-squares F test.
  let leakage: TimeSeriesAnalysis['leakage'] = null;
  const hf = tf && theis ? fitHantush(Q, tDay, s, tf.T, tf.P) : null;
  if (tf && theis && hf) {
    const dof = n - 3;
    const F = hf.sse > 0 ? (tf.sse - hf.sse) / (hf.sse / dof) : tf.sse > hf.sse ? Infinity : 0;
    const Fc = t995(dof) ** 2;
    const lateN = Math.max(3, Math.ceil(n / 4));
    const late = theis.residuals.slice(-lateN);
    const lateMean = late.reduce((a, x) => a + x.residual_m, 0) / late.length;
    const diagnosed = F > Fc && lateMean < 0 && hf.beta > 1e-3;
    const ciOk = !!hf.ciT && hf.ciT[0] >= hf.T * (1 - LEAKY_T_TOLERANCE) && hf.ciT[1] <= hf.T * (1 + LEAKY_T_TOLERANCE);
    const usable = diagnosed && ciOk && hf.r2 >= 0.98;
    const Lm = r != null ? r / hf.beta : null;
    const ciTxt = hf.ciT ? `95 % fit interval ${sig(hf.ciT[0])}-${sig(hf.ciT[1])} m²/day` : 'no fit interval could be computed';
    const test = `F = ${sig(F)} against the 1 % critical value ${sig(Fc)}; RMS residual ${sig(hf.rmse)} m against ${sig(tf.rmse)} m for Theis; the last ${late.length} readings lie on average ${sig(Math.abs(lateMean))} m ${lateMean < 0 ? 'below' : 'above'} the Theis curve`;
    const statement = !diagnosed
      ? `No leakage diagnosed: the leaky (Hantush-Jacob) model ${F > Fc ? 'fits better, but the late readings do not lie below the Theis curve (no late-time flattening)' : 'does not fit significantly better than Theis'} (${test}).`
      : usable
        ? `LEAKAGE DIAGNOSED (Hantush-Jacob leaky aquifer): the leaky model fits significantly better than Theis and the late drawdown flattens below the Theis curve (${test}). Transmissivity is taken from the leaky fit, ${m2(hf.T)} (${ciTxt}, within the stated ±${LEAKY_T_TOLERANCE * 100} % tolerance; R² ${hf.r2.toFixed(4)})${Lm != null ? `; leakage factor L about ${sig(Lm)} m (r/L ${sig(hf.beta)})` : '; r/L is apparent in the pumping well, so L is not reported'}. The confined-model transmissivities (Theis, Cooper-Jacob, Theis recovery) are not used: on a leaky record they overstate T.`
        : `LEAKAGE DIAGNOSED (Hantush-Jacob leaky aquifer): the leaky model fits significantly better than Theis and the late drawdown flattens below the Theis curve (${test}). The leaky fit does not determine T within the stated ±${LEAKY_T_TOLERANCE * 100} % tolerance (${m2(hf.T)}, ${ciTxt}; R² ${hf.r2.toFixed(4)}${hf.r2 < 0.98 ? ' < 0.98' : ''}), so NO transmissivity is given: the confined-model values would overstate T and the leaky value is not determined well enough. A longer test or an observation well closer to the pumping well is needed.`;
    leakage = {
      diagnosed, T_m2d: hf.T, S: r != null ? hf.P / (r * r) : null, rOverL: hf.beta, L_m: Lm,
      r2: hf.r2, rmse_m: hf.rmse, T_ci95_m2d: hf.ciT, fStatistic: F, fCritical: Fc, lateTheisResidual_m: lateMean,
      tWithinTolerance: ciOk, usable,
      fitted: seg.map((x, i) => ({ t_min: x.t_min, fitted_m: hantushS(Q, hf.T, hf.P, hf.beta, tDay[i]) })),
      statement,
    };
    if (diagnosed) {
      warnings.push(statement);
      const why = 'Not used: leakage diagnosed (Hantush-Jacob); the confined model overstates T on a leaky record.';
      theis.usable = false; theis.note = why;
      if (cooperJacob) { cooperJacob.usable = false; cooperJacob.note = why; }
    }
  }

  // ── Theis recovery: s' = (2.303 Q / 4πT) log10(t / t'),  t = tp + t' ──
  let recovery: TimeSeriesAnalysis['recovery'] = null;
  let recoveryNotAnalysed: string | null = null;
  if (!ts.recovery.length) recoveryNotAnalysed = 'No recovery readings entered.';
  else if (variableRate) recoveryNotAnalysed = 'Not analysed: Theis recovery needs a constant rate for the whole pumping period, and the rate changed (superposition not implemented).';
  else {
    const tp = ts.pumpingStopped_min as number;
    const x = ts.recovery.map((q) => Math.log10((tp + q.tPrime_min) / q.tPrime_min));
    const y = ts.recovery.map((q) => q.sResidual_m);
    // Late recovery (small t/t'): readings where u' = r²S/(4Tt') < 0.01 by the pumping-phase estimate, else the later 2/3.
    const P = theis?.usable && tf ? tf.P : cooperJacob ? cjp.P : NaN;
    const Tref = theis?.usable ? theis.T_m2d : cooperJacob?.T_m2d ?? NaN;
    let idx = ts.recovery.map((q, i) => i).filter((i) => Number.isFinite(P) && Number.isFinite(Tref) && ts.recovery[i].tPrime_min > (P / (4 * Tref * 0.01)) * 1440);
    if (idx.length < 3) idx = ts.recovery.map((_, i) => i).slice(Math.floor(ts.recovery.length / 3));
    if (idx.length < 3) idx = ts.recovery.map((_, i) => i);
    const ln = fitLine(idx.map((i) => x[i]), idx.map((i) => y[i]));
    if (ln.slope > 0) {
      const T = (2.303 * Q) / (FOUR_PI * ln.slope);
      const leaky = !!leakage?.diagnosed;
      const usable = ln.r2 >= 0.95 && !leaky;
      recovery = {
        T_m2d: T, slopePerLogCycle_m: ln.slope, r2: ln.r2, readings: idx.length, residualAtRatio1_m: ln.intercept, usable,
        note: `${leaky ? 'Not used (leakage diagnosed: Theis recovery assumes no leakage)' : usable ? 'Valid' : 'Not used'}: straight line through ${idx.length} late-recovery readings, R² ${ln.r2.toFixed(3)}. Extrapolated residual drawdown at t/t' = 1 is ${sig(ln.intercept)} m (ideal Theis: 0; a clearly non-zero value indicates recharge, a boundary or a change in storage, and is not interpreted further here).`,
      };
    } else recoveryNotAnalysed = 'Not analysed: residual drawdown does not decrease towards t/t\' = 1 (no positive slope).';
  }

  // ── Reported transmissivity, uncertainty ──
  const methods: { name: string; T: number }[] = [];
  if (theis?.usable) methods.push({ name: 'Theis curve fit', T: theis.T_m2d });
  if (cooperJacob?.usable) methods.push({ name: 'Cooper-Jacob straight line', T: cooperJacob.T_m2d });
  if (recovery?.usable) methods.push({ name: 'Theis recovery', T: recovery.T_m2d });
  if (leakage?.usable) methods.push({ name: 'Hantush-Jacob leaky fit', T: leakage.T_m2d });
  // Primary: leakage diagnosed → the leaky fit only (the confined methods are set unusable above);
  // pumping well → Cooper-Jacob (slope only, independent of well losses); observation well → Theis fit.
  const pick = leakage?.diagnosed
    ? (leakage.usable ? 'Hantush-Jacob leaky fit' : null)
    : geometry === 'pumping-well'
    ? (cooperJacob?.usable ? 'Cooper-Jacob straight line' : theis?.usable ? 'Theis curve fit' : recovery?.usable ? 'Theis recovery' : null)
    : (theis?.usable ? 'Theis curve fit' : cooperJacob?.usable ? 'Cooper-Jacob straight line' : recovery?.usable ? 'Theis recovery' : null);
  let transmissivity: TimeSeriesAnalysis['transmissivity'] = null;
  let insufficientEvidence: string | null = null;
  if (pick) {
    const T = methods.find((m) => m.name === pick)!.T;
    const lo = Math.min(...methods.map((m) => m.T)), hi = Math.max(...methods.map((m) => m.T));
    const spreadPct = ((hi - lo) / T) * 100;
    if (methods.length === 1) limitations.push('Only one method gave a valid transmissivity; there is no between-method check.');
    if (spreadPct > 30) warnings.push(`The methods differ by ${spreadPct.toFixed(0)} % in transmissivity: the aquifer may not meet the Theis assumptions (leakage, boundaries, heterogeneity, well losses); treat T as an order of magnitude.`);
    transmissivity = {
      value_m2d: T, value_m2s: T / 86400, method: pick, methodsRange_m2d: [lo, hi], spreadPct,
      statement: `Transmissivity ${m2(T)} (${pick}); ${methods.length > 1 ? `range between methods ${sig(lo)}-${sig(hi)} m²/day (${spreadPct.toFixed(0)} % of the reported value)` : 'single valid method'}.`,
    };
  } else if (leakage?.diagnosed) {
    insufficientEvidence = `INSUFFICIENT EVIDENCE: leakage is diagnosed and the leaky (Hantush-Jacob) fit does not determine transmissivity within the stated ±${LEAKY_T_TOLERANCE * 100} % tolerance. No transmissivity is given: the confined-model values (Theis ${m2(theis!.T_m2d)}${cooperJacob ? `, Cooper-Jacob ${m2(cooperJacob.T_m2d)}` : ''}) would overstate it. Storativity and any yield projection are not reported.`;
  } else {
    insufficientEvidence = 'INSUFFICIENT EVIDENCE: no method gives a valid transmissivity for this record (Cooper-Jacob validity not met or poor fit, Theis fit R² < 0.98, no valid recovery line). Transmissivity, storativity and any yield projection are not reported.';
  }

  // ── Storativity: observation well only ──
  let storativity: TimeSeriesAnalysis['storativity'] = null;
  let storativityStatement: string;
  if (geometry === 'pumping-well') {
    storativityStatement = 'Storativity is not reliably determinable from readings in the pumping well alone (well losses, the effective well radius and well-bore storage control the early drawdown). An observation well at a measured distance is needed.';
  } else if (!transmissivity) {
    storativityStatement = 'Not determined: no valid transmissivity.';
  } else {
    const Ss: { name: string; S: number }[] = [];
    if (theis?.usable && theis.S != null) Ss.push({ name: 'Theis curve fit', S: theis.S });
    if (cooperJacob?.usable && cooperJacob.S != null) Ss.push({ name: 'Cooper-Jacob straight line', S: cooperJacob.S });
    if (leakage?.usable && leakage.S != null) Ss.push({ name: 'Hantush-Jacob leaky fit', S: leakage.S });
    const prim = Ss.find((x) => x.name === transmissivity!.method) ?? Ss[0];
    if (prim) {
      storativity = { value: prim.S, method: prim.name, methodsRange: [Math.min(...Ss.map((x) => x.S)), Math.max(...Ss.map((x) => x.S))] };
      storativityStatement = `Storativity ${sci(prim.S)} (${prim.name}, observation well at ${r} m)${Ss.length > 1 ? `; range ${sci(storativity.methodsRange[0])}-${sci(storativity.methodsRange[1])}` : ''}. Storativity from recovery is not determined (the recovery method gives T only).`;
      if (prim.S > 0.5 || prim.S < 1e-7) warnings.push(`Storativity ${sci(prim.S)} is outside the physical range for aquifers (1e-7 to 0.5): check the observation distance and the readings.`);
    } else storativityStatement = 'Not determined: neither the Theis fit, the Cooper-Jacob line nor the leaky fit is valid for this observation-well record.';
  }

  // ── Planning estimate: drawdown projection at the tested rate (never a yield) ──
  const avail = ts.pumpIntakeDepth_m != null ? ts.pumpIntakeDepth_m - ts.staticWaterLevel_m : null;
  const peAssumptions = [
    `Pumping continues at the tested rate of ${Q_h} m³/h without interruption for ${HORIZON_DAYS} days.`,
    'The Cooper-Jacob straight line continues unchanged: no boundaries, leakage, recharge, seasonal decline, interference from other wells or change in well losses.',
    'Extrapolation beyond the test duration grows less certain with every log cycle; this is a planning figure for the hydrogeologist, not a design or permit value.',
  ];
  const withheld = (why: string): TimeSeriesAnalysis['planningEstimate'] => ({ status: 'withheld', horizon_days: HORIZON_DAYS, projectedDrawdown_m: null, availableDrawdown_m: avail, logCyclesExtrapolated: null, statement: `Planning estimate withheld: ${why}`, assumptions: [] });
  let planningEstimate: TimeSeriesAnalysis['planningEstimate'];
  if (!transmissivity) planningEstimate = withheld('INSUFFICIENT EVIDENCE (no valid transmissivity).');
  else if (variableRate) planningEstimate = withheld('the rate was changed during the test, so there is no single tested rate to project.');
  else if (leakage?.diagnosed) planningEstimate = withheld('leakage is diagnosed: the Cooper-Jacob straight line does not describe a leaky aquifer, so the late-time trend cannot be extrapolated with it.');
  else if (!cooperJacob?.usable) planningEstimate = withheld('the Cooper-Jacob straight line is not valid, so the late-time trend cannot be extrapolated.');
  else if (segEnd < 1440) planningEstimate = withheld(`the constant-rate test lasted ${sig(segEnd / 60, 3)} h; at least 24 h is needed before any projection.`);
  else {
    // Late-time trend check: slope of the last log cycle vs the slope of the valid
    // (u < 0.01) readings before it. The u < 0.01 time comes from the Theis fit when usable
    // (Cooper-Jacob's own segment can drift late when a boundary steepens the curve).
    const vRef = theis?.usable && tf ? (tf.P / (4 * tf.T * 0.01)) * 1440 : validAfter;
    const slopeOf = (ix: number[]) => fitLine(ix.map((i) => lg[i]), ix.map((i) => s[i])).slope;
    const allIdx = tMin.map((_, i) => i);
    const lastCycle = allIdx.filter((i) => lg[i] >= lg[n - 1] - 1);
    const refIdx = allIdx.filter((i) => tMin[i] > vRef && lg[i] < lg[n - 1] - 1);
    const lateSlope = lastCycle.length >= 3 ? slopeOf(lastCycle) : NaN;
    const refSlope = refIdx.length >= 3 ? slopeOf(refIdx) : NaN;
    if (!(Number.isFinite(lateSlope) && Number.isFinite(refSlope) && refSlope > 0)) {
      planningEstimate = withheld('fewer than 3 valid (u < 0.01) readings precede the last log cycle of the test, so the late-time trend cannot be checked for boundaries before extrapolating.');
    } else if (lateSlope > 1.25 * refSlope) {
      warnings.push(`Drawdown accelerates in the last log cycle (slope ${sig(lateSlope)} m vs ${sig(refSlope)} m per log cycle before it): possible barrier boundary or limited aquifer.`);
      planningEstimate = withheld('drawdown accelerates at the end of the test (possible barrier boundary); a projection would understate future drawdown.');
    } else {
      if (lateSlope < 0.75 * refSlope) warnings.push(`Drawdown flattens in the last log cycle (slope ${sig(lateSlope)} m vs ${sig(refSlope)} m per log cycle before it): leakage or recharge may be acting; the straight-line projection may overstate future drawdown.`);
      const tH = HORIZON_DAYS * 1440;
      const proj = cjLine.slope * Math.log10(tH) + cjLine.intercept;
      const cycles = Math.log10(tH / segEnd);
      const cmp = avail != null
        ? proj > avail
          ? ` This exceeds the available drawdown to the pump intake (${sig(avail)} m): on this projection the tested rate cannot be pumped continuously for ${HORIZON_DAYS} days.`
          : ` The available drawdown to the pump intake is ${sig(avail)} m.`
        : ' The pump intake depth was not entered, so the available drawdown is unknown.';
      planningEstimate = {
        status: 'presented', horizon_days: HORIZON_DAYS, projectedDrawdown_m: proj, availableDrawdown_m: avail, logCyclesExtrapolated: cycles,
        statement: `PLANNING ESTIMATE (extrapolation, not a measured or sustainable yield): at the tested ${Q_h} m³/h, the Cooper-Jacob line projects about ${sig(proj)} m drawdown after ${HORIZON_DAYS} days of continuous pumping (${cycles.toFixed(1)} log cycles beyond the ${sig(segEnd / 60, 3)} h test).${cmp} ${PLANNING_NOT_YIELD}`,
        assumptions: peAssumptions,
      };
    }
  }

  limitations.push(
    'No sustainable-yield or safe-yield figure is derived from T and S: that needs recharge, interference, water-quality and regulatory (WRA) considerations by a hydrogeologist.',
    'Hydraulic conductivity is not reported: the saturated thickness was not measured.',
    'The leaky (Hantush-Jacob) model is fitted only to diagnose leakage and, when diagnosed, to give T (and S with an observation well) within the stated tolerance; aquitard storage (Hantush 1960), unconfined delayed-yield (Neuman), partial-penetration, well-bore-storage and boundary models are not fitted.',
  );

  const out: TimeSeriesAnalysis = {
    ...base, status: transmissivity ? 'analysed' : 'insufficient',
    theis, cooperJacob, recovery, recoveryNotAnalysed, leakage, transmissivity, storativity, storativityStatement, planningEstimate,
    limitations, warnings, insufficientEvidence, required: transmissivity ? null : FIELD_REQUIRED, rows: [],
  };
  out.rows = buildRows(out);
  return out;
}

/** The display rows [item, value, basis]: one source for the screen and every export. */
function buildRows(a: TimeSeriesAnalysis): Row[] {
  // Every basis starts with its evidence class (management directive 2026-11-25):
  // [Measured], [Modelled estimate], [Planning estimate], [Not supported], [Reference].
  const M = '[Measured] ', E = '[Modelled estimate] ', P = '[Planning estimate: modelled, assumptions stated] ', N = '[Not supported] ', R = '[Reference] ';
  const rows: Row[] = [];
  rows.push(['Test analysed', a.analysedSegment.statement, M + (a.geometry === 'observation-well' ? `Observation well at ${a.observationDistance_m} m (distance as entered)` : 'Readings in the pumping well')]);
  if (a.variableRate) rows.push(['Variable rate', 'not supported', N + a.variableRate.statement]);
  if (a.specificCapacity) rows.push(['Specific capacity (observed)', `${sig(a.specificCapacity.value_m3h_per_m)} m³/h per m`, M + a.specificCapacity.statement]);
  if (a.insufficientEvidence) rows.push(['Aquifer parameters', 'INSUFFICIENT EVIDENCE', N + a.insufficientEvidence]);
  if (a.transmissivity) {
    rows.push(['Transmissivity (reported)', `${m2(a.transmissivity.value_m2d)} (${a.transmissivity.value_m2s.toExponential(2)} m²/s)`, E + a.transmissivity.statement]);
  }
  if (a.theis) {
    const ci = a.theis.T_ci95_m2d ? `; 95 % fit interval ${sig(a.theis.T_ci95_m2d[0])}-${sig(a.theis.T_ci95_m2d[1])} m²/day (statistical only)` : '';
    rows.push(['Theis curve fit: T', m2(a.theis.T_m2d), `${E}R² ${a.theis.r2.toFixed(4)}, RMS residual ${sig(a.theis.rmse_m)} m, largest residual ${sig(a.theis.maxAbsResidual_m)} m${ci}. ${a.theis.note}`]);
  }
  if (a.cooperJacob) {
    const cj = a.cooperJacob;
    rows.push(['Cooper-Jacob straight line: T', m2(cj.T_m2d), `${E}Slope ${sig(cj.slopePerLogCycle_m)} m per log cycle over ${cj.segment.readings} readings (${sig(cj.segment.from_min, 4)}-${sig(cj.segment.to_min, 4)} min), R² ${cj.r2.toFixed(4)}; segment choice gives ${sig(cj.segmentSensitivity_T_m2d[0])}-${sig(cj.segmentSensitivity_T_m2d[1])} m²/day. ${cj.note}`]);
    rows.push(['Cooper-Jacob validity (u < 0.01)', cj.uCheck.met ? 'met' : 'NOT met', E + cj.uCheck.statement]);
  }
  if (a.leakage) {
    const lk = a.leakage;
    rows.push(['Leakage (Hantush-Jacob)', lk.diagnosed ? (lk.usable ? `DIAGNOSED: T ${m2(lk.T_m2d)}` : 'DIAGNOSED: T not determined') : 'not diagnosed', E + lk.statement]);
  }
  if (a.recovery) rows.push(['Theis recovery: T', m2(a.recovery.T_m2d), `${E}Recovery slope ${sig(a.recovery.slopePerLogCycle_m)} m per log cycle of t/t'. ${a.recovery.note}`]);
  else if (a.recoveryNotAnalysed) rows.push(['Theis recovery', 'not analysed', N + a.recoveryNotAnalysed]);
  rows.push(['Storativity', a.storativity ? sci(a.storativity.value) : 'not determined', (a.storativity ? E : N) + a.storativityStatement]);
  rows.push(['Tested rate and drawdown', `${a.testedRate_m3h} m³/h; ${a.specificCapacity ? `${a.specificCapacity.drawdown_m} m after ${sig(a.specificCapacity.atTime_min, 4)} min` : '—'}`, M + 'As entered from the test record. Not a sustainable-yield figure.']);
  rows.push(['Planning estimate', a.planningEstimate.status === 'presented' ? `${sig(a.planningEstimate.projectedDrawdown_m as number)} m drawdown at ${a.planningEstimate.horizon_days} days` : 'withheld', (a.planningEstimate.status === 'presented' ? P : N) + [a.planningEstimate.statement, ...a.planningEstimate.assumptions.map((x) => `Assumes: ${x}`)].join(' ')]);
  rows.push(['Sustainable yield', 'not stated', N + 'Not derived from aquifer parameters: it needs recharge, interference, water-quality and WRA permit considerations by a registered hydrogeologist.']);
  for (const w of a.warnings) rows.push(['Warning', '', w]);
  rows.push(['Method and references', a.version, R + 'Theis (1935); Cooper & Jacob (1946); Hantush & Jacob (1955); Kruseman & de Ridder (1994) 2nd ed. Assumptions: confined (or, when leakage is diagnosed, leaky without aquitard storage), homogeneous, infinite aquifer; constant rate; fully penetrating well.']);
  return rows;
}

/** One row as a sentence, for the screening reports (same text as the table). */
export function timeSeriesRowText(r: Row): string {
  return `Pumping-test analysis, ${r[0]}: ${r[1] ? `${r[1]}${r[1].endsWith('.') ? '' : '.'} ` : ''}${r[2]}`;
}

/** Wrapper for the report pipeline: the field pump test → analysis, or nothing when there is no time series. */
export function buildFieldTimeSeriesAnalysis(pumpTest: { timeSeries?: PumpTestTimeSeries | null } | null | undefined): TimeSeriesAnalysis | undefined {
  const ts = pumpTest?.timeSeries;
  if (!ts) return undefined;
  if (!validateTimeSeries(ts).ok) return undefined;
  return analyzeTimeSeriesPumpTest(ts);
}
