/**
 * AquaScan validation metrics and baselines (P1-C, 2026-11-14).
 * Depth and yield errors, interval coverage, success-score calibration,
 * Brier score and AUC, compared with simple regional baselines.
 */
import { type BoreholeRecord, type Setting, type SplitManifest, verifyManifest, VALIDATION_FRAMEWORK_VERSION } from './records';

export interface Prediction {
  id: string;
  depthM: number | null; depthLowM?: number | null; depthHighM?: number | null;
  yieldM3h: number | null; yieldLowM3h?: number | null; yieldHighM3h?: number | null;
  /** 0–100 success score as shown by AquaScan, or null. */
  successScore: number | null;
  modelVersion: string;
}

export interface ErrorStats { n: number; bias: number; mae: number; rmse: number; maeCi95: [number, number] | null }

const r3 = (x: number) => Math.round(x * 1000) / 1000;

export function median(xs: number[]): number {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** mulberry32: seeded, so bootstrap intervals are reproducible. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

export function errorStats(pairs: Array<[number, number]>, bootstrap = 1000, seed = 20261114): ErrorStats {
  const n = pairs.length;
  if (!n) return { n: 0, bias: NaN, mae: NaN, rmse: NaN, maeCi95: null };
  const e = pairs.map(([pred, obs]) => pred - obs);
  const bias = e.reduce((a, b) => a + b, 0) / n;
  const mae = e.reduce((a, b) => a + Math.abs(b), 0) / n;
  const rmse = Math.sqrt(e.reduce((a, b) => a + b * b, 0) / n);
  let ci: [number, number] | null = null;
  if (n >= 10 && bootstrap > 0) {
    const r = rng(seed);
    const maes: number[] = [];
    for (let k = 0; k < bootstrap; k++) {
      let s = 0;
      for (let i = 0; i < n; i++) s += Math.abs(e[Math.floor(r() * n)]);
      maes.push(s / n);
    }
    maes.sort((a, b) => a - b);
    ci = [r3(maes[Math.floor(0.025 * bootstrap)]), r3(maes[Math.ceil(0.975 * bootstrap) - 1])];
  }
  return { n, bias: r3(bias), mae: r3(mae), rmse: r3(rmse), maeCi95: ci };
}

/** Share of observations inside the stated range, against the nominal level the range claims. */
export function coverage(rows: Array<{ low: number; high: number; obs: number }>): { n: number; inside: number; rate: number } {
  const inside = rows.filter((r) => r.obs >= r.low && r.obs <= r.high).length;
  return { n: rows.length, inside, rate: rows.length ? r3(inside / rows.length) : NaN };
}

export function brier(rows: Array<{ p: number; y: 0 | 1 }>): number {
  if (!rows.length) return NaN;
  return r3(rows.reduce((a, r) => a + (r.p - r.y) ** 2, 0) / rows.length);
}

/** AUC by the Mann–Whitney rank statistic (ties count one half). */
export function auc(rows: Array<{ p: number; y: 0 | 1 }>): number {
  const pos = rows.filter((r) => r.y === 1).map((r) => r.p);
  const neg = rows.filter((r) => r.y === 0).map((r) => r.p);
  if (!pos.length || !neg.length) return NaN;
  let s = 0;
  for (const a of pos) for (const b of neg) s += a > b ? 1 : a === b ? 0.5 : 0;
  return r3(s / (pos.length * neg.length));
}

/** Observed success rate per score band (0–20, 20–40, … 80–100). */
export function calibration(rows: Array<{ p: number; y: 0 | 1 }>, bands = 5) {
  return Array.from({ length: bands }, (_, i) => {
    const lo = i / bands, hi = (i + 1) / bands;
    const inBand = rows.filter((r) => r.p >= lo && (i === bands - 1 ? r.p <= hi : r.p < hi));
    return { band: `${Math.round(lo * 100)}–${Math.round(hi * 100)}`, n: inBand.length, meanScore: inBand.length ? r3(inBand.reduce((a, r) => a + r.p, 0) / inBand.length) : null, observedRate: inBand.length ? r3(inBand.reduce((a, r) => a + r.y, 0) / inBand.length) : null };
  });
}

/** Yield errors on log scale: log10(yield + 0.1), so dry holes (0) stay defined. */
const logY = (y: number) => Math.log10(y + 0.1);

export interface GroupMetrics {
  n: number;
  depth: ErrorStats; depthCoverage: ReturnType<typeof coverage>;
  yield: ErrorStats; yieldLog: ErrorStats; yieldCoverage: ReturnType<typeof coverage>;
  successBrier: number; successAuc: number; calibration: ReturnType<typeof calibration>;
  baselineCounty: { depth: ErrorStats; yield: ErrorStats };
  baselineSetting: { depth: ErrorStats; yield: ErrorStats };
  beatsBaselines: { depth: boolean | null; yield: boolean | null };
  sufficient: boolean;
}

const MIN_GROUP = 10;

function groupMetrics(test: BoreholeRecord[], preds: Map<string, Prediction>, train: BoreholeRecord[]): GroupMetrics {
  const depthPairs: Array<[number, number]> = [], yieldPairs: Array<[number, number]> = [], logPairs: Array<[number, number]> = [];
  const dCov: Array<{ low: number; high: number; obs: number }> = [], yCov: typeof dCov = [];
  const succ: Array<{ p: number; y: 0 | 1 }> = [];
  const bcD: Array<[number, number]> = [], bcY: Array<[number, number]> = [], bsD: Array<[number, number]> = [], bsY: Array<[number, number]> = [];
  // Baselines come from the training records only.
  const byCounty = new Map<string, BoreholeRecord[]>(), bySetting = new Map<Setting, BoreholeRecord[]>();
  for (const t of train) { byCounty.set(t.county, [...(byCounty.get(t.county) ?? []), t]); bySetting.set(t.setting, [...(bySetting.get(t.setting) ?? []), t]); }
  const med = (rs: BoreholeRecord[] | undefined, f: (r: BoreholeRecord) => number | null) => { const v = (rs ?? []).map(f).filter((x): x is number => x !== null); return v.length ? median(v) : null; };

  for (const r of test) {
    const p = preds.get(r.id);
    if (!p) continue;
    if (p.depthM !== null) depthPairs.push([p.depthM, r.drilledDepthM]);
    if (p.depthLowM != null && p.depthHighM != null) dCov.push({ low: p.depthLowM, high: p.depthHighM, obs: r.drilledDepthM });
    if (r.testedYieldM3h !== null) {
      if (p.yieldM3h !== null) { yieldPairs.push([p.yieldM3h, r.testedYieldM3h]); logPairs.push([logY(p.yieldM3h), logY(r.testedYieldM3h)]); }
      if (p.yieldLowM3h != null && p.yieldHighM3h != null) yCov.push({ low: p.yieldLowM3h, high: p.yieldHighM3h, obs: r.testedYieldM3h });
    }
    if (p.successScore !== null) succ.push({ p: p.successScore / 100, y: r.outcome === 'productive' ? 1 : 0 });
    const cd = med(byCounty.get(r.county), (x) => x.drilledDepthM), cy = med(byCounty.get(r.county), (x) => x.testedYieldM3h);
    const sd = med(bySetting.get(r.setting), (x) => x.drilledDepthM), sy = med(bySetting.get(r.setting), (x) => x.testedYieldM3h);
    if (cd !== null) bcD.push([cd, r.drilledDepthM]);
    if (sd !== null) bsD.push([sd, r.drilledDepthM]);
    if (r.testedYieldM3h !== null) { if (cy !== null) bcY.push([cy, r.testedYieldM3h]); if (sy !== null) bsY.push([sy, r.testedYieldM3h]); }
  }
  const depth = errorStats(depthPairs), yld = errorStats(yieldPairs);
  const baselineCounty = { depth: errorStats(bcD, 0), yield: errorStats(bcY, 0) };
  const baselineSetting = { depth: errorStats(bsD, 0), yield: errorStats(bsY, 0) };
  const beats = (m: ErrorStats, a: ErrorStats, b: ErrorStats) => (m.n && (a.n || b.n) ? m.mae < Math.min(a.n ? a.mae : Infinity, b.n ? b.mae : Infinity) : null);
  return {
    n: test.filter((r) => preds.has(r.id)).length,
    depth, depthCoverage: coverage(dCov), yield: yld, yieldLog: errorStats(logPairs), yieldCoverage: coverage(yCov),
    successBrier: brier(succ), successAuc: auc(succ), calibration: calibration(succ),
    baselineCounty, baselineSetting,
    beatsBaselines: { depth: beats(depth, baselineCounty.depth, baselineSetting.depth), yield: beats(yld, baselineCounty.yield, baselineSetting.yield) },
    sufficient: test.filter((r) => preds.has(r.id)).length >= MIN_GROUP,
  };
}

export interface ValidationReport {
  frameworkVersion: string;
  modelVersions: string[];
  split: { fingerprint: string; frozenOn: string; test: number; train: number };
  overall: GroupMetrics;
  bySetting: Record<string, GroupMetrics | 'insufficient (fewer than 10 records)'>;
  missingPredictions: string[];
  /** Plain-language verdicts, the only claims the site may make from this report. */
  verdicts: string[];
}

export function runValidation(records: BoreholeRecord[], manifest: SplitManifest, predictions: Prediction[]): ValidationReport {
  if (!verifyManifest(manifest)) throw new Error('Split manifest fingerprint does not match: the frozen split was changed');
  const byId = new Map(records.map((r) => [r.id, r]));
  const test = manifest.testIds.map((id) => byId.get(id)).filter((r): r is BoreholeRecord => !!r);
  const train = manifest.trainIds.map((id) => byId.get(id)).filter((r): r is BoreholeRecord => !!r);
  const preds = new Map(predictions.filter((p) => manifest.testIds.includes(p.id)).map((p) => [p.id, p]));
  const overall = groupMetrics(test, preds, train);
  const bySetting: ValidationReport['bySetting'] = {};
  for (const s of ['basement', 'volcanic', 'sedimentary', 'alluvial'] as Setting[]) {
    const t = test.filter((r) => r.setting === s);
    const g = groupMetrics(t, preds, train);
    bySetting[s] = g.sufficient ? g : 'insufficient (fewer than 10 records)';
  }
  const verdicts: string[] = [];
  if (!overall.sufficient) verdicts.push('Not enough test boreholes to state accuracy: AquaScan outputs remain uncalibrated model estimates.');
  else {
    verdicts.push(`Depth: mean absolute error ${overall.depth.mae} m over ${overall.depth.n} test boreholes${overall.depth.maeCi95 ? ` (95 % CI ${overall.depth.maeCi95[0]}–${overall.depth.maeCi95[1]} m)` : ''}.`);
    if (overall.beatsBaselines.depth === false) verdicts.push('Depth: does NOT beat the county/setting median baseline; no accuracy claim may be made.');
    if (overall.beatsBaselines.yield === false) verdicts.push('Yield: does NOT beat the county/setting median baseline; no accuracy claim may be made.');
    if (overall.calibration.some((b) => b.n >= 5 && b.observedRate !== null && b.meanScore !== null && Math.abs(b.observedRate - b.meanScore) > 0.15)) verdicts.push('Success score is not calibrated: it must not be described as a probability.');
  }
  verdicts.push('Hydrogeologist review required before any public claim.');
  return {
    frameworkVersion: VALIDATION_FRAMEWORK_VERSION,
    modelVersions: [...new Set(predictions.map((p) => p.modelVersion))].sort(),
    split: { fingerprint: manifest.fingerprint, frozenOn: manifest.frozenOn, test: test.length, train: train.length },
    overall, bySetting,
    missingPredictions: test.filter((r) => !preds.has(r.id)).map((r) => r.id),
    verdicts,
  };
}
