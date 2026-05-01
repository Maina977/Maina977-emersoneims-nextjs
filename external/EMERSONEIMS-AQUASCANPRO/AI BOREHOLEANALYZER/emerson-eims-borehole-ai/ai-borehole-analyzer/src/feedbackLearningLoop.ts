// ═══════════════════════════════════════════════════════════════════
// FEEDBACK LEARNING LOOP — SELF-LEARNING GROUNDWATER SYSTEM
//
// Architecture:
//   Prediction → Drilling → Outcome → Correction → Better Prediction
//
// Stores drilling outcomes in localStorage (browser) and computes:
// 1. Running accuracy metrics (per region, per rock type)
// 2. Bias corrections (systematic over/under-prediction)
// 3. Regional calibration factors
// 4. Confidence adjustment based on track record
//
// Over time: accuracy increases, confidence → 90%+
// ═══════════════════════════════════════════════════════════════════

import { computePredictionAccuracy, type DrillingOutcome } from './fieldCalibrationEngine';

const STORAGE_KEY = 'aquascan_drilling_outcomes';
const CALIBRATION_KEY = 'aquascan_regional_calibration';

export interface RegionalCalibration {
  regionKey: string;              // e.g., "KE-central" or lat/lon grid cell
  outcomeCount: number;
  avgDepthBias_m: number;         // Positive = we underpredicted depth
  avgYieldBias_m3h: number;       // Positive = we underpredicted yield
  successRateActual: number;      // Actual success rate from outcomes
  successRatePredicted: number;   // Average predicted probability
  depthCorrectionFactor: number;  // Multiply desktop depth by this
  yieldCorrectionFactor: number;  // Multiply desktop yield by this
  probabilityCalibration: number; // Reliability of our probability estimates
  lastUpdated: string;
  rockTypes: Record<string, {
    count: number;
    avgDepthError: number;
    avgYieldError: number;
  }>;
  /** Per-method accuracy tracking — answers "does adding NMR improve accuracy?" */
  methodAccuracy: Record<string, {
    count: number;
    avgDepthError: number;
    avgYieldError: number;
    successRate: number;
  }>;
}

export interface LearningStats {
  totalOutcomes: number;
  overallAccuracy: number;
  accuracyGrade: string;
  depthMAE_m: number;             // Mean Absolute Error
  yieldMAE_m3h: number;
  successPredictionAccuracy: number;
  regionCount: number;
  bestRegion: string;
  worstRegion: string;
  improvementTrend: 'improving' | 'stable' | 'declining';
  recentAccuracy: number;         // Last 10 outcomes
  allTimeAccuracy: number;
  confidenceBoost: number;        // How much to boost confidence based on track record
}

/**
 * Save a drilling outcome to the learning database.
 */
export function recordDrillingOutcome(outcome: DrillingOutcome): void {
  const outcomes = loadOutcomes();
  outcomes.push(outcome);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(outcomes));
  } catch {
    // localStorage full — keep only last 500
    const trimmed = outcomes.slice(-500);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  }

  // Recompute regional calibration
  updateRegionalCalibration(outcomes);
}

/**
 * Load all stored drilling outcomes.
 */
export function loadOutcomes(): DrillingOutcome[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/**
 * Get the regional calibration factor for a location.
 * Returns correction factors to multiply desktop predictions.
 */
export function getRegionalCalibration(lat: number, lon: number): RegionalCalibration | null {
  try {
    const raw = localStorage.getItem(CALIBRATION_KEY);
    if (!raw) return null;
    const calibrations: Record<string, RegionalCalibration> = JSON.parse(raw);
    const key = makeRegionKey(lat, lon);
    return calibrations[key] ?? null;
  } catch { return null; }
}

/**
 * Apply learning corrections to desktop predictions.
 * If we have regional data, adjust depth/yield/probability based on track record.
 */
export function applyLearningCorrections(
  lat: number,
  lon: number,
  desktopDepth: number,
  desktopYield: number,
  desktopProbability: number,
): {
  correctedDepth: number;
  correctedYield: number;
  correctedProbability: number;
  correctionApplied: boolean;
  correctionSource: string;
  outcomeCount: number;
} {
  const cal = getRegionalCalibration(lat, lon);
  if (!cal || cal.outcomeCount < 3) {
    // Not enough data for this region — no correction
    return {
      correctedDepth: desktopDepth,
      correctedYield: desktopYield,
      correctedProbability: desktopProbability,
      correctionApplied: false,
      correctionSource: cal ? `${cal.outcomeCount} outcomes (minimum 3 required for calibration)` : 'No regional data',
      outcomeCount: cal?.outcomeCount ?? 0,
    };
  }

  // Apply corrections — blend desktop with calibration
  // Weight of calibration increases with more data points
  const calWeight = Math.min(0.6, cal.outcomeCount / 20); // Max 60% calibration weight at 12+ outcomes
  const desktopWeight = 1 - calWeight;

  const correctedDepth = Math.round(desktopDepth * (desktopWeight + calWeight * cal.depthCorrectionFactor));
  const correctedYield = Math.round(
    (desktopYield * (desktopWeight + calWeight * cal.yieldCorrectionFactor)) * 10,
  ) / 10;
  const correctedProbability = Math.min(0.95, Math.max(0.05,
    desktopProbability * desktopWeight + cal.successRateActual * calWeight,
  ));

  return {
    correctedDepth,
    correctedYield,
    correctedProbability,
    correctionApplied: true,
    correctionSource: `Regional calibration from ${cal.outcomeCount} drilling outcomes (weight ${(calWeight * 100).toFixed(0)}%)`,
    outcomeCount: cal.outcomeCount,
  };
}

/**
 * Compute overall learning statistics.
 */
export function getLearningStats(): LearningStats {
  const outcomes = loadOutcomes();
  if (outcomes.length === 0) {
    return {
      totalOutcomes: 0,
      overallAccuracy: 0,
      accuracyGrade: 'N/A',
      depthMAE_m: 0,
      yieldMAE_m3h: 0,
      successPredictionAccuracy: 0,
      regionCount: 0,
      bestRegion: 'N/A',
      worstRegion: 'N/A',
      improvementTrend: 'stable',
      recentAccuracy: 0,
      allTimeAccuracy: 0,
      confidenceBoost: 0,
    };
  }

  // Compute accuracy for each outcome
  const accuracies = outcomes.map(o => computePredictionAccuracy(o));

  const overallAccuracy = accuracies.reduce((s, a) => s + a.overallAccuracy, 0) / accuracies.length;
  const depthMAE = outcomes.reduce((s, o) =>
    s + Math.abs(o.predictedDepth_m - o.actualDepth_m), 0) / outcomes.length;
  const yieldMAE = outcomes.reduce((s, o) =>
    s + Math.abs(o.predictedYield_m3h - o.actualYield_m3h), 0) / outcomes.length;

  // Success prediction accuracy
  const successCorrect = outcomes.filter(o =>
    (o.success && o.predictedProbability >= 0.5) || (!o.success && o.predictedProbability < 0.5),
  ).length;
  const successPredictionAccuracy = (successCorrect / outcomes.length) * 100;

  // Regional breakdown
  const regionMap = new Map<string, number[]>();
  outcomes.forEach((o, i) => {
    const key = makeRegionKey(o.location.lat, o.location.lon);
    if (!regionMap.has(key)) regionMap.set(key, []);
    regionMap.get(key)!.push(accuracies[i].overallAccuracy);
  });

  let bestRegion = 'N/A', worstRegion = 'N/A';
  let bestAvg = 0, worstAvg = 100;
  regionMap.forEach((accs, key) => {
    const avg = accs.reduce((a, b) => a + b, 0) / accs.length;
    if (avg > bestAvg) { bestAvg = avg; bestRegion = key; }
    if (avg < worstAvg) { worstAvg = avg; worstRegion = key; }
  });

  // Improvement trend (last 10 vs all-time)
  const recent = accuracies.slice(-10);
  const recentAccuracy = recent.length > 0
    ? recent.reduce((s, a) => s + a.overallAccuracy, 0) / recent.length
    : overallAccuracy;

  let trend: LearningStats['improvementTrend'] = 'stable';
  if (recentAccuracy > overallAccuracy + 3) trend = 'improving';
  else if (recentAccuracy < overallAccuracy - 3) trend = 'declining';

  // Confidence boost based on track record
  let confidenceBoost = 0;
  if (outcomes.length >= 10 && overallAccuracy >= 80) confidenceBoost = 5;
  if (outcomes.length >= 25 && overallAccuracy >= 85) confidenceBoost = 8;
  if (outcomes.length >= 50 && overallAccuracy >= 90) confidenceBoost = 12;

  const gradeMap: Record<string, string> = { A: '≥90%', B: '80-89%', C: '70-79%', D: '60-69%', F: '<60%' };
  const grade = overallAccuracy >= 90 ? 'A' : overallAccuracy >= 80 ? 'B' : overallAccuracy >= 70 ? 'C' : overallAccuracy >= 60 ? 'D' : 'F';

  return {
    totalOutcomes: outcomes.length,
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    accuracyGrade: `${grade} (${gradeMap[grade]})`,
    depthMAE_m: Math.round(depthMAE * 10) / 10,
    yieldMAE_m3h: Math.round(yieldMAE * 100) / 100,
    successPredictionAccuracy: Math.round(successPredictionAccuracy * 10) / 10,
    regionCount: regionMap.size,
    bestRegion,
    worstRegion,
    improvementTrend: trend,
    recentAccuracy: Math.round(recentAccuracy * 10) / 10,
    allTimeAccuracy: Math.round(overallAccuracy * 10) / 10,
    confidenceBoost,
  };
}

/**
 * Export all outcomes as JSON (for backup/transfer).
 */
export function exportOutcomes(): string {
  return JSON.stringify(loadOutcomes(), null, 2);
}

/**
 * Import outcomes from JSON (restore from backup).
 */
export function importOutcomes(json: string): number {
  try {
    const imported: DrillingOutcome[] = JSON.parse(json);
    if (!Array.isArray(imported)) return 0;
    const existing = loadOutcomes();
    const existingIds = new Set(existing.map(o => o.boreholeId));
    const newOnes = imported.filter(o => o.boreholeId && !existingIds.has(o.boreholeId));
    const merged = [...existing, ...newOnes];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    updateRegionalCalibration(merged);
    return newOnes.length;
  } catch { return 0; }
}

// ═══ INTERNAL HELPERS ═══

function makeRegionKey(lat: number, lon: number): string {
  // Grid cells of ~50km (0.5 degrees)
  const latBin = Math.round(lat * 2) / 2;
  const lonBin = Math.round(lon * 2) / 2;
  return `${latBin.toFixed(1)},${lonBin.toFixed(1)}`;
}

function updateRegionalCalibration(outcomes: DrillingOutcome[]): void {
  const regions: Record<string, DrillingOutcome[]> = {};
  outcomes.forEach(o => {
    const key = makeRegionKey(o.location.lat, o.location.lon);
    if (!regions[key]) regions[key] = [];
    regions[key].push(o);
  });

  const calibrations: Record<string, RegionalCalibration> = {};
  for (const [key, regionOutcomes] of Object.entries(regions)) {
    const depthErrors = regionOutcomes.map(o => o.actualDepth_m - o.predictedDepth_m);
    const yieldErrors = regionOutcomes.map(o => o.actualYield_m3h - o.predictedYield_m3h);
    const avgDepthBias = depthErrors.reduce((a, b) => a + b, 0) / depthErrors.length;
    const avgYieldBias = yieldErrors.reduce((a, b) => a + b, 0) / yieldErrors.length;

    const successRate = regionOutcomes.filter(o => o.success).length / regionOutcomes.length;
    const avgPredProb = regionOutcomes.reduce((s, o) => s + o.predictedProbability, 0) / regionOutcomes.length;

    // Correction factors: if we systematically underpredict by 10m, factor > 1
    const avgPredDepth = regionOutcomes.reduce((s, o) => s + o.predictedDepth_m, 0) / regionOutcomes.length;
    const avgActualDepth = regionOutcomes.reduce((s, o) => s + o.actualDepth_m, 0) / regionOutcomes.length;
    const avgPredYield = regionOutcomes.reduce((s, o) => s + o.predictedYield_m3h, 0) / regionOutcomes.length;
    const avgActualYield = regionOutcomes.reduce((s, o) => s + o.actualYield_m3h, 0) / regionOutcomes.length;

    const depthFactor = avgPredDepth > 0 ? avgActualDepth / avgPredDepth : 1;
    const yieldFactor = avgPredYield > 0 ? avgActualYield / avgPredYield : 1;

    // Rock type breakdown
    const rockTypes: RegionalCalibration['rockTypes'] = {};
    // (Would need rock type in outcome — for now just track by region)

    // Per-method accuracy tracking
    const methodAccuracy: RegionalCalibration['methodAccuracy'] = {};
    regionOutcomes.forEach(o => {
      if (o.geophysicalMethodsUsed) {
        for (const method of o.geophysicalMethodsUsed) {
          if (!methodAccuracy[method]) {
            methodAccuracy[method] = { count: 0, avgDepthError: 0, avgYieldError: 0, successRate: 0 };
          }
          methodAccuracy[method].count++;
          methodAccuracy[method].avgDepthError += Math.abs(o.actualDepth_m - o.predictedDepth_m);
          methodAccuracy[method].avgYieldError += Math.abs(o.actualYield_m3h - o.predictedYield_m3h);
          methodAccuracy[method].successRate += o.success ? 1 : 0;
        }
      }
    });
    // Finalize averages
    for (const m of Object.values(methodAccuracy)) {
      if (m.count > 0) {
        m.avgDepthError = Math.round(m.avgDepthError / m.count * 10) / 10;
        m.avgYieldError = Math.round(m.avgYieldError / m.count * 100) / 100;
        m.successRate = Math.round(m.successRate / m.count * 1000) / 1000;
      }
    }

    calibrations[key] = {
      regionKey: key,
      outcomeCount: regionOutcomes.length,
      avgDepthBias_m: Math.round(avgDepthBias * 10) / 10,
      avgYieldBias_m3h: Math.round(avgYieldBias * 100) / 100,
      successRateActual: Math.round(successRate * 1000) / 1000,
      successRatePredicted: Math.round(avgPredProb * 1000) / 1000,
      depthCorrectionFactor: Math.max(0.5, Math.min(2.0, Math.round(depthFactor * 100) / 100)),
      yieldCorrectionFactor: Math.max(0.3, Math.min(3.0, Math.round(yieldFactor * 100) / 100)),
      probabilityCalibration: Math.round(Math.abs(successRate - avgPredProb) * 1000) / 1000,
      lastUpdated: new Date().toISOString(),
      rockTypes,
      methodAccuracy,
    };
  }

  try {
    localStorage.setItem(CALIBRATION_KEY, JSON.stringify(calibrations));
  } catch { /* storage full */ }
}

// ═══════════════════════════════════════════════════════════════════
// BACKEND SYNC — Push/pull outcomes to PostgreSQL for cross-device learning
// ═══════════════════════════════════════════════════════════════════

const BACKEND_URL = typeof window !== 'undefined'
  ? (window.location.hostname === 'localhost' ? 'http://localhost:8000' : '')
  : '';

/**
 * Sync local outcomes to backend PostgreSQL.
 * Returns count of newly synced outcomes.
 */
export async function syncOutcomesToBackend(): Promise<{ pushed: number; pulled: number }> {
  const outcomes = loadOutcomes();
  let pushed = 0;
  let pulled = 0;

  // Push local outcomes to backend
  for (const o of outcomes) {
    try {
      const resp = await fetch(`${BACKEND_URL}/api/v1/learning/outcomes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          site_id: o.boreholeId,
          latitude: o.location.lat,
          longitude: o.location.lon,
          predicted_depth_m: o.predictedDepth_m,
          actual_depth_m: o.actualDepth_m,
          predicted_yield_m3h: o.predictedYield_m3h,
          actual_yield_m3h: o.actualYield_m3h,
          predicted_success_pct: o.predictedProbability * 100,
          was_successful: o.success,
          drilling_date: o.drillDate || new Date().toISOString().split('T')[0],
          report_level: 1,
        }),
      });
      if (resp.ok) pushed++;
    } catch { /* offline — skip */ }
  }

  // Pull new outcomes from backend
  try {
    const resp = await fetch(`${BACKEND_URL}/api/v1/learning/bulk-export`);
    if (resp.ok) {
      const serverOutcomes = await resp.json();
      const existingIds = new Set(outcomes.map(o => o.boreholeId));
      const newOnes = (serverOutcomes as any[]).filter(so => !existingIds.has(so.site_id));
      if (newOnes.length > 0) {
        const mapped: DrillingOutcome[] = newOnes.map(so => ({
          boreholeId: so.site_id,
          location: { lat: so.latitude, lon: so.longitude },
          predictedDepth_m: so.predicted_depth_m,
          actualDepth_m: so.actual_depth_m,
          predictedYield_m3h: so.predicted_yield_m3h,
          actualYield_m3h: so.actual_yield_m3h,
          predictedProbability: (so.predicted_success_pct || 50) / 100,
          success: so.was_successful,
          drillDate: so.drilling_date,
        }));
        const merged = [...outcomes, ...mapped];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        updateRegionalCalibration(merged);
        pulled = mapped.length;
      }
    }
  } catch { /* offline */ }

  return { pushed, pulled };
}
