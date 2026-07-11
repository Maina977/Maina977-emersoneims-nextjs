// ═══════════════════════════════════════════════════════════════════════════
// BACKTEST & CALIBRATION ENGINE — turns credibility into a PROVEN accuracy number
// ═══════════════════════════════════════════════════════════════════════════
// Scores the engine's blind predictions against REAL drilled-borehole outcomes:
// hit-rate, depth error, yield error, and probability calibration (Brier score +
// reliability bins). This is the only thing that converts "credible model" into
// "validated X% accurate on N boreholes".
//
// HONESTY — THE WHOLE POINT OF THIS MODULE:
//   • With NO outcome data it returns status 'UNVALIDATED' and NULL metrics —
//     never a fabricated accuracy %. No tool can claim a hit-rate without
//     drilled results, and saying so is honesty, not weakness.
//   • Metrics are labelled PRELIMINARY until enough holes exist to be stable.
// ═══════════════════════════════════════════════════════════════════════════

export interface BacktestRecord {
  name?: string;
  predictedDepth_m?: number;
  actualDepth_m?: number;
  predictedYield_m3h?: number;
  actualYield_m3h?: number;
  predictedProbability?: number; // 0-1 (the tool's success probability)
  success?: boolean;             // did the borehole hit usable water?
}

export interface CalibrationBin {
  binLabel: string;
  predictedMean: number;   // mean predicted probability in this bin
  observedFreq: number;    // observed success fraction in this bin
  count: number;
}

export interface BacktestMetrics {
  n: number;
  status: 'UNVALIDATED' | 'PRELIMINARY' | 'VALIDATED';
  message: string;
  grade: string;                       // 'N/A' until data exists

  observedSuccessRate: number | null;  // overall success fraction
  hitRate: number | null;              // success rate among "recommended" holes (p>=0.5)
  recommendedN: number;

  depthN: number;
  depthMAPE_pct: number | null;        // mean abs % error
  depthBias_m: number | null;          // mean (predicted - actual)
  depthWithin20pct: number | null;     // fraction within +-20%

  yieldN: number;
  yieldMAPE_pct: number | null;
  yieldBias_m3h: number | null;

  brierScore: number | null;           // probability calibration (0 best, 1 worst)
  calibration: CalibrationBin[];
}

const mean = (a: number[]) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);

export function computeBacktest(records: BacktestRecord[]): BacktestMetrics {
  const recs = Array.isArray(records) ? records : [];
  const n = recs.length;

  if (n === 0) {
    return {
      n: 0,
      status: 'UNVALIDATED',
      message:
        'No drilled-borehole outcomes loaded. Accuracy is UNVALIDATED — the tool cannot honestly claim a hit-rate without real drilled results. Load outcomes (location, predicted vs actual depth/yield, hit/miss) to compute validated metrics. This is honesty, not a limitation of the model.',
      grade: 'N/A',
      observedSuccessRate: null, hitRate: null, recommendedN: 0,
      depthN: 0, depthMAPE_pct: null, depthBias_m: null, depthWithin20pct: null,
      yieldN: 0, yieldMAPE_pct: null, yieldBias_m3h: null,
      brierScore: null, calibration: [],
    };
  }

  // ── Success / hit-rate ──
  const withSuccess = recs.filter(r => typeof r.success === 'boolean');
  const observedSuccessRate = withSuccess.length ? mean(withSuccess.map(r => (r.success ? 1 : 0))) : null;
  const recommended = withSuccess.filter(r => (r.predictedProbability ?? 0) >= 0.5);
  const hitRate = recommended.length ? mean(recommended.map(r => (r.success ? 1 : 0))) : null;

  // ── Depth error ──
  const depthRecs = recs.filter(r => (r.actualDepth_m ?? 0) > 0 && (r.predictedDepth_m ?? 0) > 0);
  const depthMAPE_pct = depthRecs.length
    ? Math.round(mean(depthRecs.map(r => Math.abs(r.predictedDepth_m! - r.actualDepth_m!) / r.actualDepth_m!)) * 1000) / 10
    : null;
  const depthBias_m = depthRecs.length
    ? Math.round(mean(depthRecs.map(r => r.predictedDepth_m! - r.actualDepth_m!)) * 10) / 10
    : null;
  const depthWithin20pct = depthRecs.length
    ? Math.round(mean(depthRecs.map(r => (Math.abs(r.predictedDepth_m! - r.actualDepth_m!) / r.actualDepth_m! <= 0.2 ? 1 : 0))) * 1000) / 1000
    : null;

  // ── Yield error ──
  const yieldRecs = recs.filter(r => (r.actualYield_m3h ?? 0) > 0 && (r.predictedYield_m3h ?? 0) > 0);
  const yieldMAPE_pct = yieldRecs.length
    ? Math.round(mean(yieldRecs.map(r => Math.abs(r.predictedYield_m3h! - r.actualYield_m3h!) / r.actualYield_m3h!)) * 1000) / 10
    : null;
  const yieldBias_m3h = yieldRecs.length
    ? Math.round(mean(yieldRecs.map(r => r.predictedYield_m3h! - r.actualYield_m3h!)) * 100) / 100
    : null;

  // ── Probability calibration (Brier + reliability bins) ──
  const probRecs = withSuccess.filter(r => typeof r.predictedProbability === 'number');
  const brierScore = probRecs.length
    ? Math.round(mean(probRecs.map(r => (r.predictedProbability! - (r.success ? 1 : 0)) ** 2)) * 1000) / 1000
    : null;
  const bins: [number, number, string][] = [[0, 0.25, '0-25%'], [0.25, 0.5, '25-50%'], [0.5, 0.75, '50-75%'], [0.75, 1.01, '75-100%']];
  const calibration: CalibrationBin[] = bins.map(([lo, hi, label]) => {
    const inBin = probRecs.filter(r => r.predictedProbability! >= lo && r.predictedProbability! < hi);
    return {
      binLabel: label,
      predictedMean: inBin.length ? Math.round(mean(inBin.map(r => r.predictedProbability!)) * 1000) / 1000 : 0,
      observedFreq: inBin.length ? Math.round(mean(inBin.map(r => (r.success ? 1 : 0))) * 1000) / 1000 : 0,
      count: inBin.length,
    };
  }).filter(b => b.count > 0);

  // ── Status + grade ──
  const status: BacktestMetrics['status'] = n >= 15 ? 'VALIDATED' : 'PRELIMINARY';
  let grade = 'N/A';
  if (depthMAPE_pct != null || hitRate != null) {
    // Simple composite: reward low depth error, high hit-rate, low Brier.
    let score = 0, parts = 0;
    if (depthMAPE_pct != null) { score += depthMAPE_pct <= 15 ? 1 : depthMAPE_pct <= 30 ? 0.6 : depthMAPE_pct <= 50 ? 0.3 : 0; parts++; }
    if (hitRate != null) { score += hitRate; parts++; }
    if (brierScore != null) { score += brierScore <= 0.1 ? 1 : brierScore <= 0.2 ? 0.6 : brierScore <= 0.3 ? 0.3 : 0; parts++; }
    const g = parts ? score / parts : 0;
    grade = g >= 0.85 ? 'A' : g >= 0.7 ? 'B' : g >= 0.55 ? 'C' : g >= 0.4 ? 'D' : 'F';
  }

  const message = status === 'VALIDATED'
    ? `Validated on ${n} drilled boreholes. Metrics are field-confirmed; ${n < 30 ? 'they will stabilise further beyond ~30 holes.' : 'sample is robust.'}`
    : `PRELIMINARY — ${n} borehole${n === 1 ? '' : 's'} only. Metrics are indicative; ~15+ holes are needed before calling accuracy "validated". Keep logging outcomes.`;

  return {
    n, status, message, grade,
    observedSuccessRate: observedSuccessRate == null ? null : Math.round(observedSuccessRate * 1000) / 1000,
    hitRate: hitRate == null ? null : Math.round(hitRate * 1000) / 1000,
    recommendedN: recommended.length,
    depthN: depthRecs.length, depthMAPE_pct, depthBias_m, depthWithin20pct,
    yieldN: yieldRecs.length, yieldMAPE_pct, yieldBias_m3h,
    brierScore, calibration,
  };
}

/** Parse pasted CSV/TSV outcomes into BacktestRecords. Columns (header optional):
 *  name, predictedDepth_m, actualDepth_m, predictedYield_m3h, actualYield_m3h, predictedProbability(0-1 or %), success(1/0/yes/no) */
export function parseBacktestCSV(text: string): BacktestRecord[] {
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return [];
  // Drop a header row if the first line is non-numeric in the depth columns.
  const first = lines[0].split(/[,;\t]/).map(s => s.trim());
  const headerLikely = first.some(c => /[a-z]/i.test(c) && !/^(yes|no|true|false)$/i.test(c));
  const rows = headerLikely ? lines.slice(1) : lines;
  const out: BacktestRecord[] = [];
  for (const line of rows) {
    const c = line.split(/[,;\t]/).map(s => s.trim());
    const num = (s: string) => { const v = parseFloat(s); return isNaN(v) ? undefined : v; };
    let prob = num(c[5]);
    if (prob != null && prob > 1) prob = prob / 100; // accept percentages
    const succRaw = (c[6] ?? '').toLowerCase();
    const success = /^(1|yes|true|success|y)$/.test(succRaw) ? true : /^(0|no|false|fail|dry|n)$/.test(succRaw) ? false : undefined;
    const rec: BacktestRecord = {
      name: c[0] && isNaN(parseFloat(c[0])) ? c[0] : undefined,
      predictedDepth_m: num(c[1]), actualDepth_m: num(c[2]),
      predictedYield_m3h: num(c[3]), actualYield_m3h: num(c[4]),
      predictedProbability: prob, success,
    };
    if (rec.actualDepth_m != null || rec.actualYield_m3h != null || rec.success != null) out.push(rec);
  }
  return out;
}
