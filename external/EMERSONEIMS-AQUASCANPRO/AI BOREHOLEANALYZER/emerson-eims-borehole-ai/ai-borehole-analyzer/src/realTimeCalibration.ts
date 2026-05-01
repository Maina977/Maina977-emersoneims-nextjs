/* ═══════════════════════════════════════════════════════════════════════
   REAL-TIME CALIBRATION LOOP ENGINE
   Prediction → Drilling Result → Correction → Model Update
   Accuracy increases with every borehole drilled
   ═══════════════════════════════════════════════════════════════════════ */

import { getBoreholeDB, type BoreholeRecord } from './boreholeIntelligenceDB';

/* ── Types ─────────────────────────────────────────────────── */

export interface CalibrationEntry {
  id: string;
  timestamp: string;

  // Prediction (before drilling)
  predicted: {
    depth_m: number;
    yield_m3hr: number;
    probability: number;
    rockType: string;
    aquiferType: string;
    methods: string[];     // data sources used
  };

  // Actual (after drilling)
  actual: {
    depth_m: number;
    yield_m3hr: number;
    success: boolean;
    rockType: string;
    waterStrikeDepth_m: number;
    aquiferType: string;
  };

  // Error metrics
  errors: {
    depthError_pct: number;
    yieldError_pct: number;
    probabilityCalibration: number;  // predicted prob vs binary outcome
    rockTypeMatch: boolean;
    aquiferTypeMatch: boolean;
    overallAccuracy: number;          // 0-100
  };

  // Location
  latitude: number;
  longitude: number;
  region: string;
}

export interface CalibrationModel {
  // Regional correction factors (0.5° grid)
  depthBias: Map<string, number>;      // predicted × bias = corrected
  yieldBias: Map<string, number>;
  probabilityBias: Map<string, number>;

  // Rock-type corrections
  rockTypeDepthBias: Map<string, number>;
  rockTypeYieldBias: Map<string, number>;

  // Method effectiveness
  methodAccuracy: Map<string, { accuracy: number; count: number }>;

  // Global correction
  globalDepthBias: number;
  globalYieldBias: number;
  globalProbBias: number;

  // Statistics
  totalEntries: number;
  avgAccuracy: number;
  accuracyTrend: number[];  // last 20 entries
  modelVersion: number;
}

export interface CorrectionResult {
  correctedDepth_m: number;
  correctedYield_m3hr: number;
  correctedProbability: number;
  corrections: {
    source: string;
    factor: string;
    adjustment: number;
    weight: number;
  }[];
  modelConfidence: number;
  basedOnEntries: number;
  modelVersion: number;
}

export interface CalibrationStats {
  totalEntries: number;
  avgAccuracy: number;
  avgDepthError: number;
  avgYieldError: number;
  accuracyByMethod: { method: string; accuracy: number; count: number }[];
  accuracyByRockType: { rockType: string; accuracy: number; count: number }[];
  accuracyTrend: { entry: number; accuracy: number }[];
  improvementRate: number;   // accuracy improvement per 10 entries
  bestPredictingFactors: string[];
}

/* ── Storage ──────────────────────────────────────────────── */

const STORAGE_KEY = 'aquascan_calibration_loop';
const MODEL_VERSION = 1;

function loadEntries(): CalibrationEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return parsed.entries || [];
  } catch { return []; }
}

function saveEntries(entries: CalibrationEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: MODEL_VERSION, entries, updatedAt: new Date().toISOString() }));
  } catch { /* storage full */ }
}

/* ── Grid Cell Key ────────────────────────────────────────── */

function gridKey(lat: number, lon: number): string {
  // 0.5° grid cells (~50km)
  return `${(Math.round(lat * 2) / 2).toFixed(1)},${(Math.round(lon * 2) / 2).toFixed(1)}`;
}

/* ── Record a New Calibration Entry ───────────────────────── */

export function recordCalibration(
  predicted: CalibrationEntry['predicted'],
  actual: CalibrationEntry['actual'],
  latitude: number,
  longitude: number,
  region: string = '',
): CalibrationEntry {
  const depthError = actual.depth_m > 0 ? Math.abs(predicted.depth_m - actual.depth_m) / actual.depth_m * 100 : 0;
  const yieldError = actual.yield_m3hr > 0 ? Math.abs(predicted.yield_m3hr - actual.yield_m3hr) / actual.yield_m3hr * 100 : 0;
  const probCal = actual.success ? predicted.probability : 1 - predicted.probability;
  const rockMatch = predicted.rockType.toLowerCase() === actual.rockType.toLowerCase();
  const aqMatch = predicted.aquiferType.toLowerCase() === actual.aquiferType.toLowerCase();

  const overallAccuracy = Math.max(0, 100 - (depthError * 0.35 + yieldError * 0.35 + (1 - probCal) * 30));

  const entry: CalibrationEntry = {
    id: `CAL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    predicted,
    actual,
    errors: {
      depthError_pct: Math.round(depthError * 10) / 10,
      yieldError_pct: Math.round(yieldError * 10) / 10,
      probabilityCalibration: Math.round(probCal * 1000) / 1000,
      rockTypeMatch: rockMatch,
      aquiferTypeMatch: aqMatch,
      overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    },
    latitude,
    longitude,
    region,
  };

  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);

  // Also feed into borehole intelligence DB
  const db = getBoreholeDB();
  db.addRecord({
    latitude,
    longitude,
    country: region,
    totalDepth_m: actual.depth_m,
    waterStrikeDepths_m: [actual.waterStrikeDepth_m],
    staticWaterLevel_m: actual.waterStrikeDepth_m,
    yield_m3hr: actual.yield_m3hr,
    success: actual.success,
    rockType: actual.rockType,
    aquiferType: actual.aquiferType as any,
    lithologyLog: [],
    geophysicsUsed: predicted.methods,
    source: 'field_entry',
    verified: true,
    aiPrediction: {
      predictedDepth_m: predicted.depth_m,
      predictedYield_m3hr: predicted.yield_m3hr,
      predictedProbability: predicted.probability,
      rockTypeGuess: predicted.rockType,
    },
  });

  return entry;
}

/* ── Build Calibration Model from All Entries ─────────────── */

function buildModel(): CalibrationModel {
  const entries = loadEntries();
  const model: CalibrationModel = {
    depthBias: new Map(),
    yieldBias: new Map(),
    probabilityBias: new Map(),
    rockTypeDepthBias: new Map(),
    rockTypeYieldBias: new Map(),
    methodAccuracy: new Map(),
    globalDepthBias: 1.0,
    globalYieldBias: 1.0,
    globalProbBias: 0,
    totalEntries: entries.length,
    avgAccuracy: 0,
    accuracyTrend: [],
    modelVersion: MODEL_VERSION,
  };

  if (entries.length === 0) return model;

  // Group by grid cell
  const gridDepthRatios = new Map<string, number[]>();
  const gridYieldRatios = new Map<string, number[]>();
  const gridProbDiffs = new Map<string, number[]>();
  const rockDepthRatios = new Map<string, number[]>();
  const rockYieldRatios = new Map<string, number[]>();
  const methodAcc = new Map<string, number[]>();

  const allAccuracies: number[] = [];

  for (const entry of entries) {
    const key = gridKey(entry.latitude, entry.longitude);
    const rock = entry.actual.rockType.toLowerCase();

    // Depth ratio: actual / predicted (>1 means we underestimate)
    const depthRatio = entry.actual.depth_m > 0 ? entry.actual.depth_m / entry.predicted.depth_m : 1;
    const yieldRatio = entry.actual.yield_m3hr > 0 ? entry.actual.yield_m3hr / entry.predicted.yield_m3hr : 1;
    const probDiff = (entry.actual.success ? 1 : 0) - entry.predicted.probability;

    // Grid cell
    if (!gridDepthRatios.has(key)) gridDepthRatios.set(key, []);
    gridDepthRatios.get(key)!.push(depthRatio);
    if (!gridYieldRatios.has(key)) gridYieldRatios.set(key, []);
    gridYieldRatios.get(key)!.push(yieldRatio);
    if (!gridProbDiffs.has(key)) gridProbDiffs.set(key, []);
    gridProbDiffs.get(key)!.push(probDiff);

    // Rock type
    if (rock) {
      if (!rockDepthRatios.has(rock)) rockDepthRatios.set(rock, []);
      rockDepthRatios.get(rock)!.push(depthRatio);
      if (!rockYieldRatios.has(rock)) rockYieldRatios.set(rock, []);
      rockYieldRatios.get(rock)!.push(yieldRatio);
    }

    // Method accuracy
    for (const method of entry.predicted.methods) {
      if (!methodAcc.has(method)) methodAcc.set(method, []);
      methodAcc.get(method)!.push(entry.errors.overallAccuracy);
    }

    allAccuracies.push(entry.errors.overallAccuracy);
  }

  // Compute grid biases
  for (const [key, ratios] of gridDepthRatios) {
    model.depthBias.set(key, median(ratios));
  }
  for (const [key, ratios] of gridYieldRatios) {
    model.yieldBias.set(key, median(ratios));
  }
  for (const [key, diffs] of gridProbDiffs) {
    model.probabilityBias.set(key, avg(diffs));
  }

  // Rock type biases
  for (const [rock, ratios] of rockDepthRatios) {
    model.rockTypeDepthBias.set(rock, median(ratios));
  }
  for (const [rock, ratios] of rockYieldRatios) {
    model.rockTypeYieldBias.set(rock, median(ratios));
  }

  // Method accuracy
  for (const [method, accs] of methodAcc) {
    model.methodAccuracy.set(method, { accuracy: avg(accs), count: accs.length });
  }

  // Global biases
  const allDepthRatios = [...gridDepthRatios.values()].flat();
  const allYieldRatios = [...gridYieldRatios.values()].flat();
  const allProbDiffs = [...gridProbDiffs.values()].flat();
  model.globalDepthBias = allDepthRatios.length > 0 ? median(allDepthRatios) : 1;
  model.globalYieldBias = allYieldRatios.length > 0 ? median(allYieldRatios) : 1;
  model.globalProbBias = allProbDiffs.length > 0 ? avg(allProbDiffs) : 0;

  // Accuracy trend
  model.avgAccuracy = avg(allAccuracies);
  model.accuracyTrend = allAccuracies.slice(-20);

  return model;
}

/* ── Apply Correction to New Prediction ───────────────────── */

export function applyCalibrationCorrection(
  predictedDepth: number,
  predictedYield: number,
  predictedProbability: number,
  latitude: number,
  longitude: number,
  rockType?: string,
  methods?: string[],
): CorrectionResult {
  const model = buildModel();
  const corrections: CorrectionResult['corrections'] = [];

  let depth = predictedDepth;
  let yld = predictedYield;
  let prob = predictedProbability;

  if (model.totalEntries < 3) {
    // Not enough data to calibrate
    return {
      correctedDepth_m: depth,
      correctedYield_m3hr: yld,
      correctedProbability: prob,
      corrections: [{ source: 'calibration_loop', factor: 'insufficient_data', adjustment: 0, weight: 0 }],
      modelConfidence: 0.3,
      basedOnEntries: model.totalEntries,
      modelVersion: model.modelVersion,
    };
  }

  // Calibration weight: grows with data
  const baseWeight = Math.min(0.6, model.totalEntries / 30);

  // 1. Grid cell correction
  const key = gridKey(latitude, longitude);
  if (model.depthBias.has(key)) {
    const bias = model.depthBias.get(key)!;
    const adj = predictedDepth * (bias - 1) * baseWeight;
    depth += adj;
    corrections.push({ source: 'regional_grid', factor: `depth_bias=${bias.toFixed(2)}`, adjustment: adj, weight: baseWeight });
  }
  if (model.yieldBias.has(key)) {
    const bias = model.yieldBias.get(key)!;
    const adj = predictedYield * (bias - 1) * baseWeight;
    yld += adj;
    corrections.push({ source: 'regional_grid', factor: `yield_bias=${bias.toFixed(2)}`, adjustment: adj, weight: baseWeight });
  }
  if (model.probabilityBias.has(key)) {
    const adj = model.probabilityBias.get(key)! * baseWeight;
    prob += adj;
    corrections.push({ source: 'regional_grid', factor: `prob_bias=${model.probabilityBias.get(key)!.toFixed(3)}`, adjustment: adj, weight: baseWeight });
  }

  // 2. Rock type correction
  if (rockType) {
    const rt = rockType.toLowerCase();
    const rtWeight = baseWeight * 0.8;
    if (model.rockTypeDepthBias.has(rt)) {
      const bias = model.rockTypeDepthBias.get(rt)!;
      const adj = predictedDepth * (bias - 1) * rtWeight;
      depth += adj;
      corrections.push({ source: 'rock_type', factor: `${rt}_depth_bias=${bias.toFixed(2)}`, adjustment: adj, weight: rtWeight });
    }
    if (model.rockTypeYieldBias.has(rt)) {
      const bias = model.rockTypeYieldBias.get(rt)!;
      const adj = predictedYield * (bias - 1) * rtWeight;
      yld += adj;
      corrections.push({ source: 'rock_type', factor: `${rt}_yield_bias=${bias.toFixed(2)}`, adjustment: adj, weight: rtWeight });
    }
  }

  // 3. Global fallback (low weight)
  const globalWeight = baseWeight * 0.3;
  if (!model.depthBias.has(key)) {
    const adj = predictedDepth * (model.globalDepthBias - 1) * globalWeight;
    depth += adj;
    corrections.push({ source: 'global', factor: `global_depth_bias=${model.globalDepthBias.toFixed(2)}`, adjustment: adj, weight: globalWeight });
  }

  // Clamp
  depth = Math.max(5, Math.round(depth * 10) / 10);
  yld = Math.max(0.01, Math.round(yld * 100) / 100);
  prob = Math.max(0.05, Math.min(0.98, Math.round(prob * 1000) / 1000));

  const modelConfidence = Math.min(0.95, 0.3 + model.totalEntries * 0.03 + (model.avgAccuracy / 100) * 0.3);

  return {
    correctedDepth_m: depth,
    correctedYield_m3hr: yld,
    correctedProbability: prob,
    corrections,
    modelConfidence,
    basedOnEntries: model.totalEntries,
    modelVersion: model.modelVersion,
  };
}

/* ── Get Calibration Statistics ───────────────────────────── */

export function getCalibrationStats(): CalibrationStats {
  const entries = loadEntries();
  if (entries.length === 0) {
    return {
      totalEntries: 0, avgAccuracy: 0, avgDepthError: 0, avgYieldError: 0,
      accuracyByMethod: [], accuracyByRockType: [], accuracyTrend: [],
      improvementRate: 0, bestPredictingFactors: [],
    };
  }

  const model = buildModel();

  // Accuracy by method
  const accuracyByMethod = [...model.methodAccuracy.entries()]
    .map(([method, data]) => ({ method, accuracy: Math.round(data.accuracy * 10) / 10, count: data.count }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // Accuracy by rock type
  const rockAcc = new Map<string, number[]>();
  for (const e of entries) {
    const rt = e.actual.rockType || 'unknown';
    if (!rockAcc.has(rt)) rockAcc.set(rt, []);
    rockAcc.get(rt)!.push(e.errors.overallAccuracy);
  }
  const accuracyByRockType = [...rockAcc.entries()]
    .map(([rockType, accs]) => ({ rockType, accuracy: Math.round(avg(accs) * 10) / 10, count: accs.length }))
    .sort((a, b) => b.accuracy - a.accuracy);

  // Trend
  const accuracyTrend = entries.map((e, i) => ({ entry: i + 1, accuracy: e.errors.overallAccuracy }));

  // Improvement rate (linear regression on accuracy)
  const accs = entries.map(e => e.errors.overallAccuracy);
  const improvementRate = accs.length >= 5 ? linearSlope(accs) * 10 : 0; // per 10 entries

  // Best predicting factors
  const bestPredictingFactors = accuracyByMethod.filter(m => m.accuracy > 70).map(m => m.method);

  return {
    totalEntries: entries.length,
    avgAccuracy: Math.round(model.avgAccuracy * 10) / 10,
    avgDepthError: Math.round(avg(entries.map(e => e.errors.depthError_pct)) * 10) / 10,
    avgYieldError: Math.round(avg(entries.map(e => e.errors.yieldError_pct)) * 10) / 10,
    accuracyByMethod,
    accuracyByRockType,
    accuracyTrend,
    improvementRate: Math.round(improvementRate * 10) / 10,
    bestPredictingFactors,
  };
}

/* ── Export / Import ──────────────────────────────────────── */

export function exportCalibrationData(): string {
  return JSON.stringify({ entries: loadEntries(), exportedAt: new Date().toISOString() }, null, 2);
}

export function importCalibrationData(json: string): number {
  try {
    const parsed = JSON.parse(json);
    const existing = loadEntries();
    const newEntries: CalibrationEntry[] = parsed.entries || [];
    const existingIds = new Set(existing.map(e => e.id));
    let added = 0;
    for (const e of newEntries) {
      if (!existingIds.has(e.id)) {
        existing.push(e);
        added++;
      }
    }
    if (added > 0) saveEntries(existing);
    return added;
  } catch { return 0; }
}

export function getCalibrationEntryCount(): number {
  return loadEntries().length;
}

/* ── Utilities ────────────────────────────────────────────── */

function avg(arr: number[]): number {
  return arr.length === 0 ? 0 : arr.reduce((a, b) => a + b) / arr.length;
}

function median(arr: number[]): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function linearSlope(values: number[]): number {
  const n = values.length;
  if (n < 3) return 0;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += i; sumY += values[i]; sumXY += i * values[i]; sumX2 += i * i;
  }
  return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
}
