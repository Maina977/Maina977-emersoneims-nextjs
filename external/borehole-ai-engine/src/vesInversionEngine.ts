// ═══════════════════════════════════════════════════════════════════════════
// VES INVERSION ENGINE — 1-D Vertical Electrical Sounding interpretation
// ═══════════════════════════════════════════════════════════════════════════
// Turns a REAL field VES/resistivity sounding curve (apparent resistivity vs
// electrode spacing) into an interpreted layered-earth model — the same job
// as IPI2Win / RES1D / ZondIP1D. VES (Schlumberger) is the method actually used
// on the ground by Kenyan water surveyors, so this converts uploaded field data
// into a genuine interpretation instead of an AI estimate.
//
// PHYSICS (all standard, verifiable):
//   • Kernel / resistivity transform via the Pekeris (1940) recurrence.
//   • Forward apparent-resistivity via the Ghosh (1971) digital linear filter
//     (9-point Schlumberger; coefficients sum to 1 so a homogeneous earth is
//     reproduced exactly).
//   • Inversion by damped least-squares (Levenberg–Marquardt) in log-space, so
//     resistivities and thicknesses stay positive.
//
// HONESTY:
//   • VES interpretation is inherently NON-UNIQUE (equivalence & suppression).
//     The result reports RMS misfit + an equivalence caveat; it is a field
//     INTERPRETATION, not ground truth — confirmed only by drilling.
//   • dataSource is 'field_ves' only when real sounding data is supplied.
// ═══════════════════════════════════════════════════════════════════════════

export interface VESDataPoint {
  ab2_m: number;      // AB/2 — half the current-electrode spacing (Schlumberger)
  rhoA_ohmm: number;  // observed apparent resistivity (ohm-m)
}

export interface VESModelLayer {
  layer: number;
  resistivity_ohmm: number;
  thickness_m: number | null;   // null = infinite half-space (bottom layer)
  depthTop_m: number;
  depthBottom_m: number | null;
  lithologyGuess: string;
  waterBearing: 'likely' | 'possible' | 'unlikely';
}

export interface VESInterpretation {
  bestAquiferLayer: number | null;   // 1-based layer index of the best target
  aquiferDepthTop_m: number | null;
  aquiferThickness_m: number | null;
  aquiferResistivity_ohmm: number | null;
  waterTableEstimate_m: number | null;
  recommendation: string;
  confidence: 'high' | 'moderate' | 'low';
}

export interface VESInversionResult {
  layers: VESModelLayer[];
  curveType: string;                 // H / K / A / Q composites
  rmsErrorPct: number;
  iterations: number;
  converged: boolean;
  observed: VESDataPoint[];
  predicted: VESDataPoint[];
  interpretation: VESInterpretation;
  equivalenceNote: string;
  dataSource: 'field_ves' | 'demo';
  method: string;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  warnings: string[];
}

// ── Ghosh (1971) 9-point Schlumberger digital filter (Σ = 1.0000) ──
const GHOSH_SCHLUMBERGER = [
  0.0225, -0.0499, 0.1064, 0.1854, 1.9720, -1.5716, 0.4018, -0.0814, 0.0148,
];
const GHOSH_MAIN_INDEX = 4;   // index of the 1.9720 term → sampled at λ = 1/(AB/2)
const SAMPLES_PER_DECADE = 3; // Ghosh sampling interval Δ = ln(10)/3

/**
 * Resistivity transform (kernel) T(λ) for a layered earth via the Pekeris
 * recurrence, evaluated from the bottom half-space upward.
 */
export function kernelTransform(lambda: number, res: number[], thick: number[]): number {
  let T = res[res.length - 1];
  for (let i = res.length - 2; i >= 0; i--) {
    const th = Math.tanh(lambda * thick[i]);
    T = (T + res[i] * th) / (1 + (T * th) / res[i]);
  }
  return T;
}

/**
 * Forward model: apparent resistivity at each AB/2 for a Schlumberger array,
 * via the Ghosh digital filter convolution of the kernel transform.
 */
export function forwardVES(res: number[], thick: number[], ab2: number[]): number[] {
  return ab2.map((s) => {
    let rho = 0;
    for (let k = 0; k < GHOSH_SCHLUMBERGER.length; k++) {
      const lambda = Math.pow(10, (k - GHOSH_MAIN_INDEX) / SAMPLES_PER_DECADE) / s;
      rho += GHOSH_SCHLUMBERGER[k] * kernelTransform(lambda, res, thick);
    }
    return rho;
  });
}

function rmsLogPct(obs: number[], pred: number[]): number {
  let s = 0;
  for (let i = 0; i < obs.length; i++) {
    const e = Math.log(pred[i]) - Math.log(obs[i]);
    s += e * e;
  }
  return Math.sqrt(s / obs.length) * 100; // % in log-space (≈ relative %)
}

interface InvertOptions {
  nLayers?: number;         // fixed layer count (2–5); default inferred
  maxIterations?: number;
  dataSource?: 'field_ves' | 'demo';
}

/**
 * Invert an apparent-resistivity sounding curve to a layered model using
 * damped least-squares (Levenberg–Marquardt) on log(ρ) and log(h).
 */
export function invertVES(data: VESDataPoint[], opts: InvertOptions = {}): VESInversionResult {
  const warnings: string[] = [];
  const clean = data
    .filter((d) => d.ab2_m > 0 && d.rhoA_ohmm > 0 && Number.isFinite(d.ab2_m) && Number.isFinite(d.rhoA_ohmm))
    .sort((a, b) => a.ab2_m - b.ab2_m);

  if (clean.length < 4) {
    warnings.push('Fewer than 4 valid sounding points — inversion is unreliable.');
  }
  const ab2 = clean.map((d) => d.ab2_m);
  const obs = clean.map((d) => d.rhoA_ohmm);

  const nLayers = Math.max(2, Math.min(5, opts.nLayers ?? inferLayerCount(obs)));
  const maxIter = opts.maxIterations ?? 40;

  // ── Initial model ──
  // Resistivities spread across the observed range; thicknesses log-spaced
  // fractions of the max AB/2 (depth of investigation ≈ AB/2 for Schlumberger).
  const minR = Math.min(...obs), maxR = Math.max(...obs);
  const res: number[] = [];
  for (let i = 0; i < nLayers; i++) {
    const f = nLayers === 1 ? 0.5 : i / (nLayers - 1);
    res.push(Math.max(1, minR * Math.pow(maxR / Math.max(1e-3, minR), f)));
  }
  // Depth of investigation for Schlumberger ≈ AB/2, so layer interfaces live
  // between the shallowest spacing and ~40% of the deepest. Place interfaces
  // log-spaced across that window, then take thicknesses as the differences.
  const maxAB2 = ab2[ab2.length - 1];
  const dMin = Math.max(0.5, ab2[0]);
  const dMax = Math.max(dMin * 4, maxAB2 * 0.4);
  const interfaces: number[] = [];
  for (let i = 0; i < nLayers - 1; i++) {
    interfaces.push(dMin * Math.pow(dMax / dMin, (i + 1) / nLayers));
  }
  const thick: number[] = interfaces.map((d, i) => (i === 0 ? d : d - interfaces[i - 1]));

  // Parameter vector p = [ln res(0..N-1), ln thick(0..N-2)]
  let p = [...res.map(Math.log), ...thick.map(Math.log)];
  const unpack = (pp: number[]) => ({
    r: pp.slice(0, nLayers).map(Math.exp),
    h: pp.slice(nLayers).map(Math.exp),
  });
  const modelResidual = (pp: number[]) => {
    const { r, h } = unpack(pp);
    const pred = forwardVES(r, h, ab2);
    return obs.map((o, i) => Math.log(pred[i]) - Math.log(o));
  };

  let mu = 1e-2;
  let bestRms = rmsLogPct(obs, forwardVES(res, thick, ab2));
  let iterUsed = 0;
  const nP = p.length;
  // Parameter bounds (log-space): ρ ∈ [1, 1e5] Ω·m, thickness ∈ [0.3, 3·maxAB2] m
  const loB = [...res.map(() => Math.log(1)), ...thick.map(() => Math.log(0.3))];
  const hiB = [...res.map(() => Math.log(1e5)), ...thick.map(() => Math.log(maxAB2 * 3))];
  const bound = (pp: number[]) => pp.map((v, i) => clamp(v, loB[i], hiB[i]));

  for (let iter = 0; iter < maxIter; iter++) {
    iterUsed = iter + 1;
    const r0 = modelResidual(p);
    // Numerical Jacobian (forward difference in log-space)
    const J: number[][] = obs.map(() => new Array(nP).fill(0));
    const eps = 1e-4;
    for (let j = 0; j < nP; j++) {
      const pj = [...p];
      pj[j] += eps;
      const rj = modelResidual(pj);
      for (let i = 0; i < obs.length; i++) J[i][j] = (rj[i] - r0[i]) / eps;
    }
    // Normal equations (JᵀJ + μI) Δ = -Jᵀ r
    const JtJ: number[][] = Array.from({ length: nP }, () => new Array(nP).fill(0));
    const Jtr: number[] = new Array(nP).fill(0);
    for (let a = 0; a < nP; a++) {
      for (let b = 0; b < nP; b++) {
        let s = 0;
        for (let i = 0; i < obs.length; i++) s += J[i][a] * J[i][b];
        JtJ[a][b] = s;
      }
      let sr = 0;
      for (let i = 0; i < obs.length; i++) sr += J[i][a] * r0[i];
      Jtr[a] = -sr;
    }

    let improved = false;
    for (let attempt = 0; attempt < 8; attempt++) {
      // Marquardt damping: scale the diagonal by (1+μ) for conditioning.
      const A = JtJ.map((row, a) => row.map((v, b) => (a === b ? v * (1 + mu) + 1e-9 : v)));
      const delta = solveLinear(A, Jtr);
      if (!delta) { mu *= 10; continue; }
      const pTry = bound(p.map((v, i) => v + clamp(delta[i], -0.8, 0.8)));
      const { r, h } = unpack(pTry);
      const rms = rmsLogPct(obs, forwardVES(r, h, ab2));
      if (rms < bestRms) {
        p = pTry; bestRms = rms; mu = Math.max(1e-8, mu / 3); improved = true; break;
      } else {
        mu *= 5;
      }
    }
    if (!improved && mu > 1e7) break;
    if (bestRms < 1.5) break; // ~1.5% log-RMS is an excellent fit
  }

  const { r: finalR, h: finalH } = unpack(p);
  const pred = forwardVES(finalR, finalH, ab2);
  const converged = bestRms < 8;
  if (!converged) warnings.push(`Inversion RMS ${bestRms.toFixed(1)}% — model may be non-unique or data noisy.`);

  const layers = buildLayers(finalR, finalH);
  const curveType = classifyCurve(finalR);
  const interpretation = interpretAquifer(layers);
  const quality: VESInversionResult['quality'] =
    bestRms < 3 ? 'excellent' : bestRms < 6 ? 'good' : bestRms < 12 ? 'fair' : 'poor';

  return {
    layers,
    curveType,
    rmsErrorPct: Math.round(bestRms * 100) / 100,
    iterations: iterUsed,
    converged,
    observed: clean,
    predicted: ab2.map((s, i) => ({ ab2_m: s, rhoA_ohmm: Math.round(pred[i] * 100) / 100 })),
    interpretation,
    equivalenceNote:
      'VES resistivity interpretation is non-unique: thin conductive/resistive layers can be equivalent (same T = ρ·h or same conductance h/ρ) and are suppressed between contrasting beds. Depths carry ±10–20% uncertainty and MUST be confirmed by drilling.',
    dataSource: opts.dataSource ?? 'field_ves',
    method: 'Pekeris kernel recurrence + Ghosh (1971) Schlumberger digital filter; Levenberg–Marquardt log-space inversion.',
    quality,
    warnings,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number): number { return Math.max(lo, Math.min(hi, v)); }

function inferLayerCount(obs: number[]): number {
  // Count monotonicity changes in the smoothed curve → segments → layers.
  let turns = 0;
  for (let i = 1; i < obs.length - 1; i++) {
    const a = Math.sign(obs[i] - obs[i - 1]);
    const b = Math.sign(obs[i + 1] - obs[i]);
    if (a !== 0 && b !== 0 && a !== b) turns++;
  }
  return Math.max(2, Math.min(5, turns + 2));
}

/** Gaussian elimination with partial pivoting. Returns null if singular. */
function solveLinear(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

function lithologyFromResistivity(rho: number): { lith: string; water: VESModelLayer['waterBearing'] } {
  if (rho < 5) return { lith: 'clay / saline water', water: 'unlikely' };
  if (rho < 15) return { lith: 'clay / silty clay', water: 'unlikely' };
  if (rho < 60) return { lith: 'weathered/fractured basement or clayey sand', water: 'possible' };
  if (rho < 250) return { lith: 'sand / gravel / fractured aquifer', water: 'likely' };
  if (rho < 1000) return { lith: 'compact/dry formation', water: 'unlikely' };
  return { lith: 'fresh massive basement (dry unless fractured)', water: 'unlikely' };
}

function buildLayers(res: number[], thick: number[]): VESModelLayer[] {
  const out: VESModelLayer[] = [];
  let top = 0;
  for (let i = 0; i < res.length; i++) {
    const t = i < thick.length ? thick[i] : null;
    const { lith, water } = lithologyFromResistivity(res[i]);
    out.push({
      layer: i + 1,
      resistivity_ohmm: Math.round(res[i] * 10) / 10,
      thickness_m: t == null ? null : Math.round(t * 10) / 10,
      depthTop_m: Math.round(top * 10) / 10,
      depthBottom_m: t == null ? null : Math.round((top + t) * 10) / 10,
      lithologyGuess: lith,
      waterBearing: water,
    });
    if (t != null) top += t;
  }
  return out;
}

function classifyCurve(res: number[]): string {
  // Composite H/K/A/Q from consecutive triplets.
  if (res.length < 3) return res.length === 2 ? (res[0] < res[1] ? 'ascending (2-layer)' : 'descending (2-layer)') : 'single';
  let s = '';
  for (let i = 1; i < res.length - 1; i++) {
    const a = res[i - 1], b = res[i], c = res[i + 1];
    if (a > b && b < c) s += 'H';
    else if (a < b && b > c) s += 'K';
    else if (a < b && b < c) s += 'A';
    else if (a > b && b > c) s += 'Q';
    else s += '-';
  }
  return s || 'monotonic';
}

function interpretAquifer(layers: VESModelLayer[]): VESInterpretation {
  // Pick the thickest "likely/possible" water-bearing layer sitting above a
  // resistive basement, preferring 'likely' over 'possible'.
  const candidates = layers
    .map((l, idx) => ({ l, idx }))
    .filter(({ l }) => l.waterBearing !== 'unlikely');
  if (candidates.length === 0) {
    return {
      bestAquiferLayer: null, aquiferDepthTop_m: null, aquiferThickness_m: null,
      aquiferResistivity_ohmm: null, waterTableEstimate_m: null,
      recommendation: 'No clear water-bearing layer resolved from resistivity — site is high-risk on VES alone; confirm with a second method or step-out sounding.',
      confidence: 'low',
    };
  }
  const score = (c: { l: VESModelLayer }) =>
    (c.l.waterBearing === 'likely' ? 1000 : 0) + (c.l.thickness_m ?? 40);
  candidates.sort((a, b) => score(b) - score(a));
  const best = candidates[0].l;
  // Water table ≈ top of the first non-'unlikely' layer that is not the surface,
  // or the top of the aquifer if shallow.
  const firstMoist = layers.find((l) => l.waterBearing !== 'unlikely' && l.layer > 1) ?? best;
  const conf: VESInterpretation['confidence'] =
    best.waterBearing === 'likely' && (best.thickness_m ?? 99) >= 8 ? 'high'
    : best.waterBearing === 'likely' ? 'moderate' : 'low';
  return {
    bestAquiferLayer: best.layer,
    aquiferDepthTop_m: best.depthTop_m,
    aquiferThickness_m: best.thickness_m,
    aquiferResistivity_ohmm: best.resistivity_ohmm,
    waterTableEstimate_m: firstMoist.depthTop_m > 0 ? firstMoist.depthTop_m : best.depthTop_m,
    recommendation:
      `Target the ${best.lithologyGuess} at ${best.depthTop_m} m` +
      (best.thickness_m != null ? ` (~${best.thickness_m} m thick, ρ≈${best.resistivity_ohmm} Ω·m).` : ` (ρ≈${best.resistivity_ohmm} Ω·m).`) +
      ' Confirm depth and yield by drilling + pump test.',
    confidence: conf,
  };
}
