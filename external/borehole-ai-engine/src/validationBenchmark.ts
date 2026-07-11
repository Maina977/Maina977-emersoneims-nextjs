// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION BENCHMARK — measured accuracy against REAL drilled boreholes
// ═══════════════════════════════════════════════════════════════════════════
// Honest, scoped statement of how well desktop prediction actually performed
// when backtested against genuine drilled outcomes. The numbers below are the
// MEASURED results of a leave-one-out backtest run on 2026-07-12 against the
// shipped completion-records dataset (public/data/wra-boreholes.json), NOT
// aspirational targets. See scratchpad backtest-acacia.mjs / backtest-analog.mjs.
//
// HONESTY:
//   • Scoped to the counties where real completion data exists — never claimed
//     nationwide.
//   • Reports what desktop prediction CANNOT do (yield) as loudly as what it can.
//   • Carries the survivorship-bias caveat (the dataset under-records dry holes).
// ═══════════════════════════════════════════════════════════════════════════

export interface ValidationBenchmark {
  region: string;
  counties: string[];
  nBoreholes: number;           // total real boreholes in the benchmark set
  nDepthScored: number;         // holes with a drilled depth used in the depth test
  analogDepthWithin20pct: number; // fraction predicted within +-20% from real neighbours
  analogDepthMAPE_pct: number;
  analogYieldMAPE_pct: number;  // yield is essentially unpredictable from the desk
  priorDepthWithin20pct: number; // county-prior-alone baseline (for contrast)
  source: string;
  method: string;
  caveats: string[];
}

/** Measured 2026-07-12 backtest, northern Kenya arid counties. */
export const KENYA_NORTH_BENCHMARK: ValidationBenchmark = {
  region: 'Northern Kenya (arid basement / sedimentary / alluvial)',
  counties: ['Turkana', 'Wajir', 'Garissa', 'Isiolo', 'Marsabit'],
  nBoreholes: 3446,
  nDepthScored: 1072,
  analogDepthWithin20pct: 0.40,
  analogDepthMAPE_pct: 66.7,
  analogYieldMAPE_pct: 182.5,
  priorDepthWithin20pct: 0.27,
  source: 'Acacia Water / KenyaRapid+ and Rural Focus / TMAM (UNESCO IHP-WINS) — real drilled boreholes',
  method: 'Leave-one-out: each borehole predicted from the median of real neighbours within 25 km; compared to its actual drilled depth/yield.',
  caveats: [
    'Scoped to the five counties above, where real completion records exist — not a nationwide figure.',
    'The datasets under-record dry holes (survivorship bias), so success/failure rates are not fairly testable here — depth and yield errors are the meaningful metrics.',
    'This measures the regional/analog layer only; the full per-site assessment adds satellite and geophysics and still requires a field survey.',
  ],
};

/** Return the benchmark when the site sits in a validated region (else null). */
export function getValidationBenchmark(opts: {
  county?: string;
  nearbySources?: string[]; // sources of the nearby-well records actually found
}): ValidationBenchmark | null {
  const county = (opts.county || '').toLowerCase();
  const byCounty = KENYA_NORTH_BENCHMARK.counties.some(c => county.includes(c.toLowerCase()));
  const byData = (opts.nearbySources || []).some(s => /acacia|rural focus|kenyarapid/i.test(String(s)));
  return byCounty || byData ? KENYA_NORTH_BENCHMARK : null;
}

/** Plain-language, honest validation statement for a report. */
export function validationStatement(b: ValidationBenchmark): string {
  const dPct = Math.round(b.analogDepthWithin20pct * 100);
  return (
    `Backtested against ${b.nBoreholes.toLocaleString()} real drilled boreholes in ${b.region.split(' (')[0]} ` +
    `(${b.source}): predicting a new borehole's depth from real nearby boreholes lands within ±20% about ${dPct}% of the time ` +
    `(median absolute error ${b.analogDepthMAPE_pct}%). YIELD could NOT be reliably predicted from desktop/analog data ` +
    `(error ${b.analogYieldMAPE_pct}%) — which is exactly why this report specifies a pump test rather than a promised flow rate. ` +
    `Treat the depth as a range and confirm the target with a field survey before drilling.`
  );
}
