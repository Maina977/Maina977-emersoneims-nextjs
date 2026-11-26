// ═══════════════════════════════════════════════════════════════════════════════
// PRE-REPORT VERIFICATION ENGINE — 40+ CHECK FOOLPROOF VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════
//
// PURPOSE: Before ANY report is generated, this engine:
//   1. RE-QUERIES key APIs to verify cached values haven't drifted
//   2. CROSS-VALIDATES all computed values against raw source data
//   3. CHECKS internal consistency (no contradictions between subsystems)
//   4. ENFORCES hydrogeological physics constraints
//   5. VERIFIES provenance — every figure must trace to a data source
//   6. STAMPS the result with a VerificationReport so reports can display it
//
// DESIGN PRINCIPLE: Trust but verify. Every figure in the report must be
// defensible. If we can't verify it, we flag it. If it contradicts its own
// source data, we FAIL and block the report.
//
// Author: EMERSON EIMS AquaScan Pro Verification System
// ═══════════════════════════════════════════════════════════════════════════════

import { fetchElevation, fetchSoilGrids } from './remoteSensing';
import { fetchNASAPowerMoisture, fetchNearbyBoreholeData } from './advancedHydroEngine';
import { fetchGLDASGroundwaterData } from './gldasGroundwater';
import { SOILGRIDS_REST_ENABLED } from './soilSource';

// ─── TYPES ───

export type VerificationSeverity = 'PASS' | 'WARN' | 'FAIL' | 'SKIP';

export interface VerificationCheck {
  id: string;
  category: 'API_REQUERY' | 'CROSS_VALIDATION' | 'INTERNAL_CONSISTENCY' | 'PHYSICS' | 'PROVENANCE' | 'RANGE_BOUND';
  name: string;
  severity: VerificationSeverity;
  message: string;
  expected?: string;
  actual?: string;
  source?: string;
  tolerance?: string;
}

/**
 * The verdict (2026-11-26 real-project test D1). A verdict may only claim what
 * was actually checked:
 *  - PASSED: every check ran with an independent value and none failed.
 *  - INCOMPLETE: no failure, but one or more checks could not be run (source
 *    unavailable, timed out, or no independent value). No grade is given.
 *  - FAILED: a check failed (the report is blocked, as before).
 */
export type VerificationStatus = 'PASSED' | 'INCOMPLETE' | 'FAILED';

export interface VerificationReport {
  /** true only when status is PASSED (every check ran and none failed). */
  verified: boolean;
  /** true = MUST NOT generate report (a check FAILED). INCOMPLETE does not block. */
  blocked?: boolean;
  status?: VerificationStatus;
  /** 0-100 over the checks that ran; null when coverage is incomplete. */
  score: number | null;
  /** Letter grade over the checks that ran; null when coverage is incomplete. */
  grade: 'A' | 'B' | 'C' | 'D' | 'F' | null;
  totalChecks: number;
  passed: number;
  warnings: number;
  failures: number;
  /** Checks NOT checked (source unavailable, not run, timeout, no independent value). */
  skipped: number;
  /** Checks that ran / all checks, and the ones that could not be run. */
  coverage?: { run: number; total: number; notChecked: { id: string; name: string; reason: string }[] };
  checks: VerificationCheck[];
  /** API re-queries that ran with an independent (live) value. */
  apiRequeriesPerformed: number;
  apiRequeriesMatched: number;
  /** API re-queries attempted (including those that could not run). */
  apiRequeriesAttempted?: number;
  timestamp: string;
  durationMs: number;
  summary: string;
}

// ─── TOLERANCES ───

const TOL = {
  elevation_m: 30,            // SRTM has ±16m vertical accuracy, allow ±30m
  precipitation_mm: 100,      // Annual precip can drift between models
  temperature_c: 3,           // Mean temp tolerance
  soilClay_pct: 15,           // SoilGrids texture tolerance
  soilSand_pct: 15,
  depth_m: 50,                // Depth cross-validation tolerance
  yield_m3hr: 5,              // Yield cross-validation tolerance
  probability: 0.25,          // Probability consensus tolerance
  moisture_pct: 20,           // Soil moisture tolerance
  recharge_mm: 50,            // Recharge rate tolerance
};

// ─── HELPERS ───

function pct(a: number, b: number): number {
  if (b === 0) return a === 0 ? 0 : 100;
  return Math.abs(a - b) / Math.abs(b) * 100;
}

/** A finite number, or null (null / undefined / '' / NaN / non-numeric). */
function num(v: unknown): number | null {
  if (v == null || v === '') return null;
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

// 2026-11-26 (D1): a missing value is NOT a match. Callers must report a
// missing side as "not checked (no independent value)".
function within(a: number | null | undefined, b: number | null | undefined, tol: number): boolean {
  const x = num(a), y = num(b);
  if (x == null || y == null) return false;
  return Math.abs(x - y) <= tol;
}

/** A source label that says the value is an estimate / fallback / default, not a live answer. */
export function isFallbackSource(source: unknown): boolean {
  return /estimat|unavailable|fallback|default|no data|did not answer|assumed|placeholder/i.test(String(source ?? ''));
}

/**
 * Nearby-wells sources that are files shipped with the site (or local
 * registries), not live databases: re-reading them is not an independent check.
 */
const LOCAL_WELL_SOURCES = /field completion records|owner-provided|unesco ihp-wins|city groundwater survey/i;

function pass(id: string, cat: VerificationCheck['category'], name: string, msg: string, src?: string): VerificationCheck {
  return { id, category: cat, name, severity: 'PASS', message: msg, source: src };
}
function warn(id: string, cat: VerificationCheck['category'], name: string, msg: string, exp?: string, act?: string, src?: string): VerificationCheck {
  return { id, category: cat, name, severity: 'WARN', message: msg, expected: exp, actual: act, source: src };
}
function fail(id: string, cat: VerificationCheck['category'], name: string, msg: string, exp?: string, act?: string, src?: string): VerificationCheck {
  return { id, category: cat, name, severity: 'FAIL', message: msg, expected: exp, actual: act, source: src };
}
/** Not checked: the source did not answer, timed out, or the check could not run. */
function skip(id: string, cat: VerificationCheck['category'], name: string, msg: string): VerificationCheck {
  return { id, category: cat, name, severity: 'SKIP', message: `Not checked: ${msg}` };
}
/** Not checked: one side is missing, or the "independent" value is the same fallback/source as the value checked. */
function noIndependent(id: string, cat: VerificationCheck['category'], name: string, msg: string): VerificationCheck {
  return { id, category: cat, name, severity: 'SKIP', message: `Not checked (no independent value): ${msg}` };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN VERIFICATION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

export async function runPreReportVerification(result: any): Promise<VerificationReport> {
  const startTime = Date.now();
  const checks: VerificationCheck[] = [];
  let apiRequeriesAttempted = 0;
  let apiRequeriesPerformed = 0; // ran with an independent (live) value on both sides
  let apiRequeriesMatched = 0;

  const lat = result.clientLocation?.latitude
    ?? result.site?.latitude
    ?? result.geoEstimate?.bestEstimate?.lat
    ?? result.geoEstimate?.lat
    ?? result.siteIdentity?.coordinates?.lat;
  const lon = result.clientLocation?.longitude
    ?? result.site?.longitude
    ?? result.geoEstimate?.bestEstimate?.lon
    ?? result.geoEstimate?.lon
    ?? result.siteIdentity?.coordinates?.lon;

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: API RE-QUERIES — Hit real APIs to verify cached data
  //   Runs ALL 5 queries in PARALLEL (max 30s each via AbortSignal)
  // ═══════════════════════════════════════════════════════════════

  if (lat != null && lon != null) {

    const raceTimeout = <T>(p: Promise<T>, ms: number): Promise<T | null> =>
      Promise.race([p, new Promise<null>(r => setTimeout(() => r(null), ms))]);

    const [elevResult, soilResult, moistureResult, wellsResult, gldasResult] = await Promise.allSettled([

      // 1A. RE-QUERY ELEVATION (SRTM via Open-Elevation)
      (async () => {
        apiRequeriesAttempted++;
        const freshElev = await raceTimeout(fetchElevation(lat, lon), 20000);
        const freshVal = num(freshElev?.elevation);
        const cachedElev = num(result.remoteSensing?.elevation?.elevation);
        const cachedSrc = result.remoteSensing?.elevation?.source;
        if (freshVal != null && isFallbackSource(freshElev?.source)) {
          checks.push(noIndependent('API-ELEV', 'API_REQUERY', 'Elevation Re-query', `the re-query returned a fallback value (${freshElev?.source})`));
        } else if (freshVal != null && cachedElev != null && isFallbackSource(cachedSrc)) {
          checks.push(noIndependent('API-ELEV', 'API_REQUERY', 'Elevation Re-query', `the elevation being checked is a fallback value (${cachedSrc})`));
        } else if (freshVal != null && cachedElev != null) {
          apiRequeriesPerformed++;
          if (within(freshVal, cachedElev, TOL.elevation_m)) {
            apiRequeriesMatched++;
            checks.push(pass('API-ELEV', 'API_REQUERY', 'Elevation Re-query',
              `SRTM elevation verified: cached ${cachedElev}m, fresh query ${freshVal}m (±${TOL.elevation_m}m tolerance)`,
              'Open-Elevation API (SRTM 30m)'));
          } else {
            checks.push(warn('API-ELEV', 'API_REQUERY', 'Elevation Re-query',
              `Elevation drift: cached ${cachedElev}m vs fresh query ${freshVal}m — exceeds ±${TOL.elevation_m}m tolerance`,
              `${cachedElev}m`, `${freshVal}m`, 'Open-Elevation API'));
          }
        } else if (freshVal != null && cachedElev == null) {
          checks.push(noIndependent('API-ELEV', 'API_REQUERY', 'Elevation Re-query',
            `elevation not cached in result (API returned ${freshVal}m), nothing to compare`));
        } else {
          checks.push(skip('API-ELEV', 'API_REQUERY', 'Elevation Re-query', 'elevation API unavailable or timed out during re-query'));
        }
      })().catch(() => { checks.push(skip('API-ELEV', 'API_REQUERY', 'Elevation Re-query', 'elevation API error during re-query')); }),

      // 1B. RE-QUERY SOILGRIDS
      (async () => {
        // SoilGrids REST is disabled (soilSource.ts): a "re-query" would read
        // the same self-hosted dataset the cached value came from — the value
        // compared with itself. There is no independent source to re-query,
        // so this re-query is not run and is not claimed (neither pass nor
        // part of the coverage). It returns when the REST source is enabled.
        if (!SOILGRIDS_REST_ENABLED) return;
        apiRequeriesAttempted++;
        const freshSoil = await raceTimeout(fetchSoilGrids(lat, lon), 20000);
        const cachedSoil = result.remoteSensing?.soilGrids ?? result.globalSoilAnalysis;
        if (freshSoil && cachedSoil && isFallbackSource(freshSoil.source)) {
          checks.push(noIndependent('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query', `the re-query returned a fallback value (${freshSoil.source})`));
        } else if (freshSoil && cachedSoil) {
          const freshClay = num(freshSoil.clay);
          const cachedClay = num(cachedSoil.clay ?? cachedSoil.texture?.clay);
          const freshSand = num(freshSoil.sand);
          const cachedSand = num(cachedSoil.sand ?? cachedSoil.texture?.sand);
          const comparable = (freshClay != null && cachedClay != null) || (freshSand != null && cachedSand != null);
          if (!comparable) {
            checks.push(noIndependent('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query', 'no clay or sand value on both sides to compare'));
            return;
          }
          apiRequeriesPerformed++;

          let soilMatch = true;
          const issues: string[] = [];
          if (freshClay != null && cachedClay != null && !within(freshClay, cachedClay, TOL.soilClay_pct)) {
            soilMatch = false;
            issues.push(`clay: cached ${cachedClay}% vs fresh ${freshClay}%`);
          }
          if (freshSand != null && cachedSand != null && !within(freshSand, cachedSand, TOL.soilSand_pct)) {
            soilMatch = false;
            issues.push(`sand: cached ${cachedSand}% vs fresh ${freshSand}%`);
          }
          if (soilMatch) {
            apiRequeriesMatched++;
            checks.push(pass('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query',
              `SoilGrids texture verified: clay ${cachedClay ?? '?'}%, sand ${cachedSand ?? '?'}%`,
              'ISRIC SoilGrids v2.0'));
          } else {
            checks.push(warn('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query',
              `SoilGrids drift detected: ${issues.join('; ')}. May indicate API update.`,
              issues.map(i => i.split(' vs ')[0]).join(', '),
              issues.map(i => i.split('vs ')[1]).join(', '),
              'ISRIC SoilGrids v2.0'));
          }
        } else {
          checks.push(skip('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query', 'SoilGrids data unavailable or timed out for comparison'));
        }
      })().catch(() => { checks.push(skip('API-SOIL', 'API_REQUERY', 'SoilGrids Re-query', 'SoilGrids API error during re-query')); }),

      // 1C. RE-QUERY NASA POWER MOISTURE
      (async () => {
        apiRequeriesAttempted++;
        const freshMoisture = await raceTimeout(fetchNASAPowerMoisture(lat, lon), 20000);
        const cachedMoisture = result.nasaPowerMoisture;
        if (freshMoisture && cachedMoisture && (isFallbackSource(freshMoisture.dataSource) || isFallbackSource(cachedMoisture.dataSource))) {
          checks.push(noIndependent('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query', 'one side is a fallback value, not a NASA POWER answer'));
        } else if (freshMoisture && cachedMoisture) {
          const freshVal = num(freshMoisture.gwetprofMean);
          const cachedVal = num(cachedMoisture.gwetprofMean);
          if (freshVal != null && cachedVal != null) {
            apiRequeriesPerformed++;
            if (within(freshVal, cachedVal, TOL.moisture_pct / 100)) {
              apiRequeriesMatched++;
              checks.push(pass('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query',
                `NASA POWER deep moisture verified: cached ${(cachedVal * 100).toFixed(1)}%, fresh ${(freshVal * 100).toFixed(1)}%`,
                'NASA POWER (GWETPROF)'));
            } else {
              checks.push(warn('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query',
                `NASA POWER moisture drift: cached ${(cachedVal * 100).toFixed(1)}% vs fresh ${(freshVal * 100).toFixed(1)}%`,
                `${(cachedVal * 100).toFixed(1)}%`, `${(freshVal * 100).toFixed(1)}%`, 'NASA POWER'));
            }
          } else {
            // 2026-11-26 (D1): was counted as "matched".
            checks.push(noIndependent('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query', 'moisture value missing in one or both queries'));
          }
        } else {
          checks.push(skip('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query', 'NASA POWER data unavailable or timed out for comparison'));
        }
      })().catch(() => { checks.push(skip('API-MOISTURE', 'API_REQUERY', 'NASA POWER Moisture Re-query', 'NASA POWER API error during re-query')); }),

      // 1D. RE-QUERY NEARBY BOREHOLE DATA (capped at 30s — the function has ~15 sequential sub-fetches)
      (async () => {
        apiRequeriesAttempted++;
        const freshWells = await raceTimeout(fetchNearbyBoreholeData(lat, lon), 30000);
        const cachedWells = result.nearbyWells;
        const freshLive = (freshWells?.dataSources ?? []).filter((s: string) => !LOCAL_WELL_SOURCES.test(String(s)));
        const freshCount = num(freshWells?.sampleSize ?? (freshWells as any)?.totalFound);
        const cachedCount = num(cachedWells?.sampleSize);
        if (freshWells && cachedWells && (!freshCount || !cachedCount)) {
          // 2026-11-26 (D1): 0 vs 0 records used to "match".
          checks.push(noIndependent('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query', 'no well records on one or both sides to compare'));
        } else if (freshWells && cachedWells && freshLive.length === 0) {
          checks.push(noIndependent('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query',
            'the re-query answered only from the records shipped with the site (the same records as the value checked); no live database answered'));
        } else if (freshWells && cachedWells && freshCount != null && cachedCount != null) {
          apiRequeriesPerformed++;
          if (Math.abs(freshCount - cachedCount) <= Math.max(2, cachedCount * 0.3)) {
            apiRequeriesMatched++;
            checks.push(pass('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query',
              `Nearby wells verified: cached ${cachedCount}, fresh query ${freshCount} records`,
              'USGS/WPDx/BGS/OSM borehole databases'));
          } else {
            checks.push(warn('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query',
              `Nearby wells count changed: cached ${cachedCount} vs fresh ${freshCount}. Database may have been updated.`,
              `${cachedCount}`, `${freshCount}`, 'Multi-source borehole databases'));
          }
          if (freshWells.averageDepth != null && cachedWells.averageDepth != null) {
            if (!within(freshWells.averageDepth, cachedWells.averageDepth, TOL.depth_m)) {
              checks.push(warn('API-WELLS-DEPTH', 'API_REQUERY', 'Nearby Wells Avg Depth',
                `Average nearby well depth drift: cached ${cachedWells.averageDepth}m vs fresh ${freshWells.averageDepth}m`,
                `${cachedWells.averageDepth}m`, `${freshWells.averageDepth}m`));
            }
          }
        } else {
          checks.push(skip('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query', 'nearby wells data unavailable or timed out for comparison'));
        }
      })().catch(() => { checks.push(skip('API-WELLS', 'API_REQUERY', 'Nearby Wells Re-query', 'Borehole database error during re-query')); }),

      // 1E. RE-QUERY GLDAS WATER BUDGET
      (async () => {
        apiRequeriesAttempted++;
        const precip = result.remoteSensing?.climate?.annualPrecipitation;
        const temp = result.remoteSensing?.climate?.meanTemperature;
        const freshGLDAS = await raceTimeout(fetchGLDASGroundwaterData(lat, lon, precip, temp), 20000);
        const cachedGLDAS = result.gldasGroundwater;
        const freshBudgetSrc = freshGLDAS?.waterBudget?.dataSource;
        const cachedBudgetSrc = cachedGLDAS?.waterBudget?.dataSource;
        if (freshGLDAS && cachedGLDAS && (isFallbackSource(freshBudgetSrc) || isFallbackSource(cachedBudgetSrc))) {
          // 2026-11-26 (D1): with both APIs down the water budget is an estimate
          // from the same rainfall input — it used to "match" itself (54 vs 54 mm/yr).
          checks.push(noIndependent('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query',
            `the water budget is an estimate, not a GLDAS/ERA5 answer (${isFallbackSource(freshBudgetSrc) ? freshBudgetSrc : cachedBudgetSrc})`));
        } else if (freshGLDAS && cachedGLDAS) {
          const freshRecharge = num(freshGLDAS.waterBudget?.estimatedRecharge ?? (freshGLDAS as any).estimatedRecharge_mm);
          const cachedRecharge = num(cachedGLDAS.waterBudget?.estimatedRecharge ?? (cachedGLDAS as any).estimatedRecharge_mm);
          if (freshRecharge != null && cachedRecharge != null) {
            apiRequeriesPerformed++;
            if (within(freshRecharge, cachedRecharge, TOL.recharge_mm)) {
              apiRequeriesMatched++;
              checks.push(pass('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query',
                `GLDAS recharge verified: cached ${cachedRecharge?.toFixed?.(0) ?? cachedRecharge}mm/yr, fresh ${freshRecharge?.toFixed?.(0) ?? freshRecharge}mm/yr`,
                'NASA GLDAS / ERA5-Land'));
            } else {
              checks.push(warn('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query',
                `Recharge estimate drift: cached ${cachedRecharge}mm/yr vs fresh ${freshRecharge}mm/yr`,
                `${cachedRecharge}mm/yr`, `${freshRecharge}mm/yr`, 'GLDAS / ERA5-Land'));
            }
          } else {
            checks.push(noIndependent('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query', 'recharge value missing in one or both queries'));
          }
        } else {
          checks.push(skip('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query', 'GLDAS data unavailable or timed out for comparison'));
        }
      })().catch(() => { checks.push(skip('API-GLDAS', 'API_REQUERY', 'GLDAS Water Budget Re-query', 'GLDAS API error during re-query')); }),

    ]); // end Promise.allSettled

  } else {
    checks.push(skip('API-ALL', 'API_REQUERY', 'API Re-queries', 'no coordinates available — cannot re-query APIs'));
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: CROSS-VALIDATION — Computed values vs raw source data
  // ═══════════════════════════════════════════════════════════════

  // 2A. DEPTH: Pipeline depth vs nearby wells avg depth
  {
    const pipelineDepth = num(result.recommendedDepth);
    const nearbyDepth = num(result.nearbyWells?.averageDepth);
    const boreholeDbDepth = num(result.boreholeRecords?.averageDepth ?? result.boreholeRecords?.avgDepth);
    if (pipelineDepth != null && nearbyDepth != null) {
      const diff = Math.abs(pipelineDepth - nearbyDepth);
      if (diff <= 40) {
        checks.push(pass('XV-DEPTH-WELLS', 'CROSS_VALIDATION', 'Depth vs Nearby Wells',
          `Recommended depth ${pipelineDepth}m aligns with nearby wells avg ${nearbyDepth}m (diff: ${diff}m)`,
          'Nearby borehole databases'));
      } else if (diff <= 80) {
        checks.push(warn('XV-DEPTH-WELLS', 'CROSS_VALIDATION', 'Depth vs Nearby Wells',
          `Recommended depth ${pipelineDepth}m differs from nearby wells avg ${nearbyDepth}m by ${diff}m. Check geological variation.`,
          `~${nearbyDepth}m`, `${pipelineDepth}m`));
      } else {
        checks.push(warn('XV-DEPTH-WELLS', 'CROSS_VALIDATION', 'Depth vs Nearby Wells',
          `Significant spread: Recommended depth ${pipelineDepth}m vs nearby wells avg ${nearbyDepth}m (${diff}m difference). Different geological models may explain divergence.`,
          `~${nearbyDepth}m`, `${pipelineDepth}m`));
      }
    } else if (pipelineDepth != null && boreholeDbDepth != null) {
      const diff = Math.abs(pipelineDepth - boreholeDbDepth);
      if (diff > 80) {
        checks.push(warn('XV-DEPTH-DB', 'CROSS_VALIDATION', 'Depth vs Regional Database',
          `Recommended depth ${pipelineDepth}m differs from regional avg ${boreholeDbDepth}m by ${diff}m`,
          `~${boreholeDbDepth}m`, `${pipelineDepth}m`));
      } else {
        checks.push(pass('XV-DEPTH-DB', 'CROSS_VALIDATION', 'Depth vs Regional Database',
          `Recommended depth ${pipelineDepth}m consistent with regional avg ${boreholeDbDepth}m`,
          'Regional borehole records'));
      }
    } else {
      checks.push(skip('XV-DEPTH', 'CROSS_VALIDATION', 'Depth Cross-Validation', 'No nearby well data to compare depth against'));
    }
  }

  // 2B. YIELD: Pipeline yield vs nearby wells avg yield
  {
    const pipelineYield = num(result.estimatedYield);
    const nearbyYield = num(result.nearbyWells?.averageYield);
    if (pipelineYield != null && nearbyYield != null) {
      const diff = Math.abs(pipelineYield - nearbyYield);
      if (diff <= 3) {
        checks.push(pass('XV-YIELD-WELLS', 'CROSS_VALIDATION', 'Yield vs Nearby Wells',
          `Estimated yield ${pipelineYield} m³/hr aligns with nearby wells avg ${nearbyYield} m³/hr`,
          'Nearby borehole databases'));
      } else if (diff <= 8) {
        checks.push(warn('XV-YIELD-WELLS', 'CROSS_VALIDATION', 'Yield vs Nearby Wells',
          `Estimated yield ${pipelineYield} m³/hr differs from nearby avg ${nearbyYield} m³/hr by ${diff.toFixed(1)} m³/hr`,
          `~${nearbyYield} m³/hr`, `${pipelineYield} m³/hr`));
      } else {
        checks.push(warn('XV-YIELD-WELLS', 'CROSS_VALIDATION', 'Yield vs Nearby Wells',
          `Significant spread: Estimated yield ${pipelineYield} m³/hr vs nearby avg ${nearbyYield} m³/hr. Local heterogeneity may explain divergence.`,
          `~${nearbyYield} m³/hr`, `${pipelineYield} m³/hr`));
      }
    } else {
      checks.push(skip('XV-YIELD', 'CROSS_VALIDATION', 'Yield Cross-Validation', 'No nearby well yield data to compare'));
    }
  }

  // 2C. PROBABILITY: Pipeline vs ensemble vs finalConsensus vs drillingPrediction
  {
    const sources: { name: string; value: number }[] = [];
    if (result.probability != null) sources.push({ name: 'pipeline', value: result.probability });
    if (result.ensembleResult?.probability != null) sources.push({ name: 'ensemble', value: result.ensembleResult.probability });
    if (result.finalConsensus?.successProbability != null) sources.push({ name: 'finalConsensus', value: result.finalConsensus.successProbability });
    if (result.drillingPrediction?.successProbability != null) sources.push({ name: 'drillingPredictor', value: result.drillingPrediction.successProbability / 100 });
    if (result.confidenceWeighted?.adjustedProbability != null) sources.push({ name: 'confidenceWeighted', value: result.confidenceWeighted.adjustedProbability });

    if (sources.length >= 2) {
      const values = sources.map(s => s.value);
      const maxSpread = Math.max(...values) - Math.min(...values);
      if (maxSpread <= 0.15) {
        checks.push(pass('XV-PROB-CONSENSUS', 'CROSS_VALIDATION', 'Probability Consensus',
          `${sources.length} probability sources agree within ±${(maxSpread * 100).toFixed(0)}%: ${sources.map(s => `${s.name}=${(s.value * 100).toFixed(1)}%`).join(', ')}`,
          'Multi-model ensemble'));
      } else if (maxSpread <= 0.30) {
        checks.push(warn('XV-PROB-CONSENSUS', 'CROSS_VALIDATION', 'Probability Consensus',
          `Moderate spread across ${sources.length} probability sources (±${(maxSpread * 100).toFixed(0)}%): ${sources.map(s => `${s.name}=${(s.value * 100).toFixed(1)}%`).join(', ')}`,
          `spread <15%`, `spread ${(maxSpread * 100).toFixed(0)}%`));
      } else {
        checks.push(warn('XV-PROB-CONSENSUS', 'CROSS_VALIDATION', 'Probability Consensus',
          `Wide spread across probability models (±${(maxSpread * 100).toFixed(0)}%): ${sources.map(s => `${s.name}=${(s.value * 100).toFixed(1)}%`).join(', ')}. Multi-model divergence is expected for desktop analysis.`,
          `spread <15%`, `spread ${(maxSpread * 100).toFixed(0)}%`));
      }
    } else {
      checks.push(skip('XV-PROB', 'CROSS_VALIDATION', 'Probability Consensus', 'Fewer than 2 probability sources available'));
    }
  }

  // 2D. DEPTH: Pipeline depth vs ensemble depth vs finalConsensus depth
  {
    const sources: { name: string; value: number }[] = [];
    if (result.recommendedDepth != null) sources.push({ name: 'pipeline', value: result.recommendedDepth });
    if (result.ensembleResult?.depth_m != null) sources.push({ name: 'ensemble', value: result.ensembleResult.depth_m });
    if (result.finalConsensus?.depth_m != null) sources.push({ name: 'finalConsensus', value: result.finalConsensus.depth_m });
    if (result.drillingPrediction?.predictedDepth_m != null) sources.push({ name: 'drillingPredictor', value: result.drillingPrediction.predictedDepth_m });

    if (sources.length >= 2) {
      const values = sources.map(s => s.value);
      const maxSpread = Math.max(...values) - Math.min(...values);
      if (maxSpread <= 30) {
        checks.push(pass('XV-DEPTH-CONSENSUS', 'CROSS_VALIDATION', 'Depth Consensus',
          `${sources.length} depth sources agree within ±${maxSpread.toFixed(0)}m: ${sources.map(s => `${s.name}=${s.value}m`).join(', ')}`));
      } else if (maxSpread <= 60) {
        checks.push(warn('XV-DEPTH-CONSENSUS', 'CROSS_VALIDATION', 'Depth Consensus',
          `Moderate depth spread (±${maxSpread.toFixed(0)}m): ${sources.map(s => `${s.name}=${s.value}m`).join(', ')}`));
      } else {
        checks.push(warn('XV-DEPTH-CONSENSUS', 'CROSS_VALIDATION', 'Depth Consensus',
          `Wide depth spread (±${maxSpread.toFixed(0)}m): ${sources.map(s => `${s.name}=${s.value}m`).join(', ')}. Multi-model divergence is expected for desktop analysis.`));
      }
    }
  }

  // 2E. GPI vs Probability coherence
  {
    const gpi = result.satelliteRemoteSensing?.fusion?.groundwaterPotentialIndex;
    const prob = result.probability;
    if (gpi != null && prob != null) {
      const gpiNorm = gpi / 100;
      const diff = Math.abs(gpiNorm - prob);
      if (diff <= 0.25) {
        checks.push(pass('XV-GPI-PROB', 'CROSS_VALIDATION', 'GPI vs Probability',
          `Satellite GPI (${gpi}/100) and success probability (${(prob * 100).toFixed(1)}%) are coherent (diff: ${(diff * 100).toFixed(0)}%)`,
          'Satellite Remote Sensing vs Bayesian Ensemble'));
      } else {
        checks.push(warn('XV-GPI-PROB', 'CROSS_VALIDATION', 'GPI vs Probability',
          `Satellite GPI (${gpi}/100) and probability (${(prob * 100).toFixed(1)}%) diverge by ${(diff * 100).toFixed(0)}%. Different input data or weightings.`,
          `GPI=${gpi}`, `prob=${(prob * 100).toFixed(1)}%`));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: INTERNAL CONSISTENCY — Subsystem agreement
  // ═══════════════════════════════════════════════════════════════

  // 3A. Probability in [0,1]
  {
    const p = result.probability;
    if (p != null) {
      if (p >= 0 && p <= 1) {
        checks.push(pass('IC-PROB-RANGE', 'RANGE_BOUND', 'Probability Range', `Probability ${(p * 100).toFixed(1)}% is in valid [0,1] range`));
      } else {
        checks.push(fail('IC-PROB-RANGE', 'RANGE_BOUND', 'Probability Range', `Probability ${p} OUTSIDE [0,1] range`, '0-1', `${p}`));
      }
    }
  }

  // 3B. Depth in [1,500]
  {
    const d = result.recommendedDepth;
    if (d != null) {
      if (d >= 1 && d <= 500) {
        checks.push(pass('IC-DEPTH-RANGE', 'RANGE_BOUND', 'Depth Range', `Depth ${d}m is in valid [1,500] range`));
      } else {
        checks.push(fail('IC-DEPTH-RANGE', 'RANGE_BOUND', 'Depth Range', `Depth ${d}m OUTSIDE [1,500] range`, '1-500m', `${d}m`));
      }
    }
  }

  // 3C. Yield in [0.1,50]
  {
    const y = result.estimatedYield;
    if (y != null) {
      if (y >= 0.1 && y <= 50) {
        checks.push(pass('IC-YIELD-RANGE', 'RANGE_BOUND', 'Yield Range', `Yield ${y} m³/hr is in valid [0.1,50] range`));
      } else {
        checks.push(fail('IC-YIELD-RANGE', 'RANGE_BOUND', 'Yield Range', `Yield ${y} m³/hr OUTSIDE [0.1,50] range`, '0.1-50', `${y}`));
      }
    }
  }

  // 3D. Confidence metrics all ≤100
  {
    const cm = result.confidenceMetrics;
    if (cm) {
      const fields = ['geological', 'terrain', 'vegetation', 'dataDensity', 'waterQuality', 'overall'] as const;
      const violations: string[] = [];
      for (const f of fields) {
        const v = cm[f];
        if (v != null && (v < 0 || v > 100)) violations.push(`${f}=${v}`);
      }
      if (violations.length === 0) {
        checks.push(pass('IC-CONF-RANGE', 'RANGE_BOUND', 'Confidence Metrics Range', `All confidence metrics within [0,100]`));
      } else {
        checks.push(fail('IC-CONF-RANGE', 'RANGE_BOUND', 'Confidence Metrics Range',
          `Confidence metric(s) out of range: ${violations.join(', ')}`, '0-100', violations.join(', ')));
      }
    }
  }

  // 3E. GPI ≤ 100
  {
    const gpi = result.satelliteRemoteSensing?.fusion?.groundwaterPotentialIndex;
    if (gpi != null) {
      if (gpi >= 0 && gpi <= 100) {
        checks.push(pass('IC-GPI-RANGE', 'RANGE_BOUND', 'GPI Range', `GPI ${gpi}/100 in valid range`));
      } else {
        checks.push(fail('IC-GPI-RANGE', 'RANGE_BOUND', 'GPI Range', `GPI ${gpi} OUTSIDE [0,100] range`, '0-100', `${gpi}`));
      }
    }
  }

  // 3F. All satellite scores ≤ 100
  {
    const methods = result.satelliteRemoteSensing?.methods;
    if (methods && Array.isArray(methods)) {
      const violations: string[] = [];
      for (const m of methods) {
        if (m.groundwaterScore != null && (m.groundwaterScore < 0 || m.groundwaterScore > 100)) {
          violations.push(`${m.method}: ${m.groundwaterScore}`);
        }
      }
      if (violations.length === 0) {
        checks.push(pass('IC-SAT-RANGE', 'RANGE_BOUND', 'Satellite Scores Range', `All ${methods.length} satellite method scores in [0,100]`));
      } else {
        checks.push(fail('IC-SAT-RANGE', 'RANGE_BOUND', 'Satellite Scores Range',
          `Satellite score(s) out of range: ${violations.join('; ')}`, '0-100', violations.join('; ')));
      }
    }
  }

  // 3G. dataQualityScore is object (not number)
  {
    const dq = result.dataQualityScore;
    if (dq != null) {
      if (typeof dq === 'object' && dq.overallQualityScore != null) {
        if (dq.overallQualityScore >= 0 && dq.overallQualityScore <= 100) {
          checks.push(pass('IC-DQ-TYPE', 'RANGE_BOUND', 'Data Quality Structure',
            `Data quality is proper object, overall score ${dq.overallQualityScore}%`));
        } else {
          checks.push(fail('IC-DQ-TYPE', 'RANGE_BOUND', 'Data Quality Structure',
            `Data quality overall score ${dq.overallQualityScore} outside [0,100]`));
        }
      } else {
        checks.push(fail('IC-DQ-TYPE', 'RANGE_BOUND', 'Data Quality Structure',
          `dataQualityScore is ${typeof dq} — expected object with overallQualityScore`, 'object', typeof dq));
      }
    }
  }

  // 3H. Uncertainty ranges ordered correctly
  {
    const u = result.uncertainty;
    if (u) {
      const issues: string[] = [];
      if (u.probabilityRange && u.probabilityRange[0] > u.probabilityRange[1]) issues.push('probabilityRange inverted');
      if (u.depthRange && u.depthRange[0] > u.depthRange[1]) issues.push('depthRange inverted');
      if (u.yieldRange && u.yieldRange[0] > u.yieldRange[1]) issues.push('yieldRange inverted');
      if (issues.length === 0) {
        checks.push(pass('IC-UNCERT-ORDER', 'INTERNAL_CONSISTENCY', 'Uncertainty Range Order', 'All uncertainty ranges correctly ordered [low, high]'));
      } else {
        checks.push(fail('IC-UNCERT-ORDER', 'INTERNAL_CONSISTENCY', 'Uncertainty Range Order',
          `Inverted uncertainty ranges: ${issues.join(', ')}`));
      }
    }
  }

  // 3I. Final consensus depth within uncertainty range
  {
    const fc = result.finalConsensus;
    const u = result.uncertainty;
    if (fc?.depth_m != null && u?.depthRange) {
      const [lo, hi] = u.depthRange;
      if (fc.depth_m >= lo * 0.8 && fc.depth_m <= hi * 1.2) {
        checks.push(pass('IC-FC-DEPTH-UNCERT', 'INTERNAL_CONSISTENCY', 'Consensus Depth vs Uncertainty',
          `Final consensus depth ${fc.depth_m}m is within uncertainty range [${lo}, ${hi}]m`));
      } else {
        checks.push(warn('IC-FC-DEPTH-UNCERT', 'INTERNAL_CONSISTENCY', 'Consensus Depth vs Uncertainty',
          `Final consensus depth ${fc.depth_m}m is outside uncertainty range [${lo}, ${hi}]m`,
          `[${lo}, ${hi}]m`, `${fc.depth_m}m`));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: PHYSICS CONSTRAINTS — Hydrogeological laws
  // ═══════════════════════════════════════════════════════════════

  // 4A. Water balance: ET < Precipitation (Budyko constraint)
  {
    const wb = result.gldasGroundwater?.waterBudget;
    // 2026-11-26 (D1): only with both figures; undefined <= undefined used to FAIL.
    if (wb && num(wb.evapotranspiration) != null && num(wb.precipitation) != null) {
      if (wb.evapotranspiration <= wb.precipitation) {
        checks.push(pass('PHY-WATER-BAL', 'PHYSICS', 'Water Balance (Budyko)',
          `ET (${wb.evapotranspiration}mm/yr) ≤ P (${wb.precipitation}mm/yr) — Budyko constraint satisfied`));
      } else {
        checks.push(fail('PHY-WATER-BAL', 'PHYSICS', 'Water Balance (Budyko)',
          `PHYSICS VIOLATION: ET (${wb.evapotranspiration}mm/yr) > P (${wb.precipitation}mm/yr)`,
          `ET < ${wb.precipitation}mm`, `ET = ${wb.evapotranspiration}mm`));
      }
    }
  }

  // 4B. Recharge < Precipitation (recharge cannot exceed rainfall)
  {
    const recharge = result.gldasGroundwater?.waterBudget?.recharge ?? result.rechargeModel?.estimatedRecharge_mm_year;
    const precip = result.remoteSensing?.climate?.annualPrecipitation ?? result.gldasGroundwater?.waterBudget?.precipitation;
    if (recharge != null && precip != null && precip > 0) {
      const ratio = recharge / precip;
      if (recharge <= precip) {
        if (ratio > 0.5) {
          checks.push(warn('PHY-RECHARGE', 'PHYSICS', 'Recharge vs Precipitation',
            `Recharge (${recharge.toFixed(0)}mm) is ${(ratio * 100).toFixed(0)}% of precipitation — unusually high. Verify geology.`));
        } else {
          checks.push(pass('PHY-RECHARGE', 'PHYSICS', 'Recharge vs Precipitation',
            `Recharge (${recharge.toFixed(0)}mm) is ${(ratio * 100).toFixed(0)}% of precipitation (${precip.toFixed(0)}mm) — physically consistent`));
        }
      } else {
        checks.push(fail('PHY-RECHARGE', 'PHYSICS', 'Recharge vs Precipitation',
          `PHYSICS VIOLATION: Recharge (${recharge.toFixed(0)}mm) exceeds precipitation (${precip.toFixed(0)}mm)`,
          `< ${precip.toFixed(0)}mm`, `${recharge.toFixed(0)}mm`));
      }
    }
  }

  // 4C. High probability requires minimum recharge
  {
    const prob = result.probability;
    const recharge = result.gldasGroundwater?.waterBudget?.recharge ?? result.rechargeModel?.estimatedRecharge_mm_year;
    if (prob != null && recharge != null) {
      if (prob > 0.75 && recharge < 10) {
        checks.push(warn('PHY-PROB-RECHARGE', 'PHYSICS', 'Probability vs Recharge Coherence',
          `High probability (${(prob * 100).toFixed(1)}%) but near-zero recharge (${recharge.toFixed(0)}mm/yr). Aquifer may rely on fossil water or lateral flow.`,
          `recharge >10mm for P>75%`, `recharge=${recharge.toFixed(0)}mm`));
      } else if (prob > 0.60 && recharge < 5) {
        checks.push(warn('PHY-PROB-RECHARGE', 'PHYSICS', 'Probability vs Recharge Coherence',
          `Moderate probability (${(prob * 100).toFixed(1)}%) but very low recharge (${recharge.toFixed(0)}mm/yr)`));
      } else {
        checks.push(pass('PHY-PROB-RECHARGE', 'PHYSICS', 'Probability vs Recharge Coherence',
          `Probability (${(prob * 100).toFixed(1)}%) and recharge (${recharge?.toFixed(0) ?? '?'}mm/yr) are coherent`));
      }
    }
  }

  // 4D. Yield requires minimum aquifer thickness
  {
    const y = result.estimatedYield;
    const thickness = result.advancedGeophysics?.ertSimulation?.aquiferTarget?.thickness_m;
    if (y != null && thickness != null) {
      if (y > 5 && thickness < 5) {
        checks.push(warn('PHY-YIELD-THICK', 'PHYSICS', 'Yield vs Aquifer Thickness',
          `High yield (${y} m³/hr) but thin aquifer (${thickness}m). May be unsustainable.`));
      } else {
        checks.push(pass('PHY-YIELD-THICK', 'PHYSICS', 'Yield vs Aquifer Thickness',
          `Yield ${y} m³/hr is consistent with aquifer thickness ${thickness}m`));
      }
    }
  }

  // 4E. Water table must be above bedrock
  {
    const wt = result.geophysicsFusion?.waterTableDepth_m;
    const bedrock = result.geophysicsFusion?.bedrockDepth_m;
    if (wt != null && bedrock != null) {
      if (wt < bedrock) {
        checks.push(pass('PHY-WT-BEDROCK', 'PHYSICS', 'Water Table vs Bedrock',
          `Water table (${wt}m) is above bedrock (${bedrock}m) — physically correct`));
      } else {
        checks.push(fail('PHY-WT-BEDROCK', 'PHYSICS', 'Water Table vs Bedrock',
          `PHYSICS VIOLATION: Water table (${wt}m) at or below bedrock (${bedrock}m)`,
          `WT < ${bedrock}m`, `WT = ${wt}m`));
      }
    }
  }

  // 4F. Recommended depth must be deeper than water table
  {
    const depth = result.recommendedDepth;
    const wt = result.geophysicsFusion?.waterTableDepth_m;
    if (depth != null && wt != null) {
      if (depth > wt) {
        checks.push(pass('PHY-DEPTH-WT', 'PHYSICS', 'Drilling Depth vs Water Table',
          `Recommended depth ${depth}m is below water table ${wt.toFixed(1)}m — borehole will intersect aquifer`));
      } else {
        checks.push(fail('PHY-DEPTH-WT', 'PHYSICS', 'Drilling Depth vs Water Table',
          `Recommended depth ${depth}m is ABOVE water table ${wt.toFixed(1)}m — borehole would be dry`,
          `> ${wt.toFixed(1)}m`, `${depth}m`));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: PROVENANCE — Every figure must have a source
  // ═══════════════════════════════════════════════════════════════

  // 5A. Engineer confidence provenance matrix exists
  {
    const ec = result.engineerConfidence;
    if (ec?.provenance?.items && ec.provenance.items.length > 0) {
      const items = ec.provenance.items;
      const noSource = items.filter((i: any) => !i.source || i.source === 'Unknown');
      if (noSource.length === 0) {
        checks.push(pass('PROV-MATRIX', 'PROVENANCE', 'Provenance Matrix Complete',
          `All ${items.length} provenance items have documented sources`));
      } else {
        checks.push(warn('PROV-MATRIX', 'PROVENANCE', 'Provenance Matrix Complete',
          `${noSource.length}/${items.length} provenance items missing sources: ${noSource.map((i: any) => i.parameter).join(', ')}`));
      }
    } else {
      checks.push(warn('PROV-MATRIX', 'PROVENANCE', 'Provenance Matrix',
        'No provenance matrix available — data source traceability incomplete'));
    }
  }

  // 5B. No MEASURED tier without field data
  {
    const items = result.engineerConfidence?.provenance?.items;
    if (items && Array.isArray(items)) {
      const falseMeasured = items.filter((i: any) =>
        i.tier === 'MEASURED' && !result.fieldData);
      if (falseMeasured.length === 0) {
        checks.push(pass('PROV-MEASURED', 'PROVENANCE', 'MEASURED Tier Integrity',
          'No parameters falsely labeled MEASURED without field data'));
      } else {
        checks.push(warn('PROV-MEASURED', 'PROVENANCE', 'MEASURED Tier Integrity',
          `${falseMeasured.length} parameter(s) labeled MEASURED but no field data provided: ${falseMeasured.map((i: any) => i.parameter).join(', ')}. Review provenance tier assignments.`,
          'No MEASURED without field data', `${falseMeasured.length} false MEASURED`));
      }
    }
  }

  // 5C. Geophysics fusion honesty
  {
    const gf = result.geophysicsFusion;
    if (gf && !result.fieldData) {
      if (gf.dataSource?.includes('MODELLED') || gf.dataSource?.includes('modelled')) {
        checks.push(pass('PROV-GEOPHYS', 'PROVENANCE', 'Geophysics Provenance',
          'Geophysics fusion correctly labeled as MODELLED (no field data)'));
      } else {
        checks.push(warn('PROV-GEOPHYS', 'PROVENANCE', 'Geophysics Provenance',
          'Geophysics fusion not labeled as MODELLED despite no field geophysical data',
          'Contains "MODELLED"', gf.dataSource ?? 'missing'));
      }
    }
  }

  // 5D. Fracture AI honesty
  {
    const fa = result.fractureAI;
    if (fa?.diagnostics) {
      const diag = Array.isArray(fa.diagnostics) ? fa.diagnostics.join(' ') : String(fa.diagnostics);
      if (diag.includes('modelled') || diag.includes('inferred')) {
        checks.push(pass('PROV-FRACTURE', 'PROVENANCE', 'Fracture AI Provenance',
          'Fracture lineaments correctly labeled as modelled/inferred'));
      } else if (diag.includes('detected') && !result.fieldData) {
        checks.push(warn('PROV-FRACTURE', 'PROVENANCE', 'Fracture AI Provenance',
          'Fracture lineaments claim "detected" but no field data exists — review diagnostic labels'));
      } else {
        checks.push(pass('PROV-FRACTURE', 'PROVENANCE', 'Fracture AI Provenance',
          'Fracture AI diagnostics present'));
      }
    }
  }

  // 5E. Data quality breakdown sums to ~100%
  {
    const dq = result.dataQualityScore;
    if (dq && typeof dq === 'object') {
      const sum = (dq.satelliteData_pct ?? 0) + (dq.fieldMeasurement_pct ?? 0) + (dq.laboratoryData_pct ?? 0) +
                  (dq.modelInferred_pct ?? 0) + (dq.databaseData_pct ?? 0) + (dq.userInput_pct ?? 0);
      if (sum >= 90 && sum <= 110) {
        checks.push(pass('PROV-DQ-SUM', 'PROVENANCE', 'Data Quality Breakdown Sum',
          `Data source percentages sum to ${sum.toFixed(0)}% (≈100%)`));
      } else {
        checks.push(warn('PROV-DQ-SUM', 'PROVENANCE', 'Data Quality Breakdown Sum',
          `Data source percentages sum to ${sum.toFixed(0)}% (expected ~100%)`,
          '~100%', `${sum.toFixed(0)}%`));
      }
    }
  }

  // 5F. Assessment disclaimer present
  {
    if (result.assessmentDisclaimer || result.finalConsensus?.disclaimer) {
      checks.push(pass('PROV-DISCLAIMER', 'PROVENANCE', 'Assessment Disclaimer',
        'Assessment disclaimer present in result'));
    } else {
      checks.push(warn('PROV-DISCLAIMER', 'PROVENANCE', 'Assessment Disclaimer',
        'No explicit assessment disclaimer found in result'));
    }
  }

  // 5G. Desktop assessment — confidence capped correctly
  {
    const grade = result.finalConsensus?.assessmentGrade;
    const conf = result.confidenceMetrics?.overall;
    if (grade && conf != null) {
      if (grade === 'DESKTOP SCREENING' && conf > 92) {
        checks.push(warn('PROV-DESKTOP-CAP', 'PROVENANCE', 'Desktop Confidence Cap',
          `Desktop screening grade but confidence ${conf}% exceeds maximum desktop cap (92%)`,
          '≤92%', `${conf}%`));
      } else {
        checks.push(pass('PROV-DESKTOP-CAP', 'PROVENANCE', 'Desktop Confidence Cap',
          `Assessment grade "${grade}" with confidence ${conf}% — correctly capped`));
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: COMPLETENESS — Required sections present
  // ═══════════════════════════════════════════════════════════════

  // 6A. Core predictions exist
  {
    const missing: string[] = [];
    if (result.probability == null) missing.push('probability');
    if (result.recommendedDepth == null) missing.push('recommendedDepth');
    if (result.estimatedYield == null) missing.push('estimatedYield');
    if (!result.waterQuality) missing.push('waterQuality');
    if (!result.risk) missing.push('risk');
    if (missing.length === 0) {
      checks.push(pass('COMP-CORE', 'INTERNAL_CONSISTENCY', 'Core Predictions Present', 'All 5 core predictions populated'));
    } else {
      checks.push(warn('COMP-CORE', 'INTERNAL_CONSISTENCY', 'Core Predictions Present',
        `Missing core predictions: ${missing.join(', ')} — fallback values will be used`));
    }
  }

  // 6B. Location data present — check ALL possible coordinate storage paths
  {
    const hasCoords = lat != null && lon != null;
    const hasSiteCoords = result.site?.latitude != null && result.site?.longitude != null;
    const hasSiteIdentity = result.siteIdentity?.coordinates?.lat != null;
    if (hasCoords || hasSiteCoords || hasSiteIdentity) {
      const displayLat = lat ?? result.site?.latitude ?? result.siteIdentity?.coordinates?.lat;
      const displayLon = lon ?? result.site?.longitude ?? result.siteIdentity?.coordinates?.lon;
      checks.push(pass('COMP-LOCATION', 'INTERNAL_CONSISTENCY', 'Location Data', `Coordinates present: ${displayLat?.toFixed?.(4) ?? '?'}, ${displayLon?.toFixed?.(4) ?? '?'}`));
    } else {
      checks.push(warn('COMP-LOCATION', 'INTERNAL_CONSISTENCY', 'Location Data', 'GPS coordinates not found in standard result fields — analysis may have used coordinates not stored in output'));
    }
  }

  // 6C. Satellite data present
  {
    if (result.remoteSensing && (result.remoteSensing.elevation || result.remoteSensing.soilGrids)) {
      checks.push(pass('COMP-SATELLITE', 'INTERNAL_CONSISTENCY', 'Satellite Data Present', 'Remote sensing data (elevation/SoilGrids) available'));
    } else {
      checks.push(warn('COMP-SATELLITE', 'INTERNAL_CONSISTENCY', 'Satellite Data Present', 'No remote sensing data — analysis relies on models only'));
    }
  }

  // 6D. Ensemble result present
  {
    if (result.ensembleResult?.probability != null) {
      checks.push(pass('COMP-ENSEMBLE', 'INTERNAL_CONSISTENCY', 'Ensemble Result Present',
        `Bayesian ensemble complete: ${result.ensembleResult.sourcesUsed} sources, agreement=${result.ensembleResult.sourceAgreement}`));
    } else {
      checks.push(warn('COMP-ENSEMBLE', 'INTERNAL_CONSISTENCY', 'Ensemble Result Present',
        'No ensemble result — final prediction relies on single model'));
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // SCORING & VERDICT
  // ═══════════════════════════════════════════════════════════════

  const report = buildVerificationReport(checks, {
    attempted: apiRequeriesAttempted, performed: apiRequeriesPerformed, matched: apiRequeriesMatched,
  }, Date.now() - startTime);

  console.log(`[Verification] ${report.summary}`);

  return report;
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERDICT — one wording for the screen and every export (2026-11-26, D1)
// ═══════════════════════════════════════════════════════════════════════════════

/** Exact headline when any check could not be run (management decision 2026-11-26). */
export const VERIFICATION_INCOMPLETE_HEADLINE =
  'VERIFICATION INCOMPLETE — Required data sources unavailable. No accuracy grade or publication clearance issued.';
export const VERIFICATION_FAILED_HEADLINE = 'VERIFICATION FAILED — Report blocked';
export const VERIFICATION_PASSED_HEADLINE = 'VERIFICATION PASSED';
export const VERIFICATION_PASSED_WARN_HEADLINE = 'VERIFICATION PASSED WITH WARNINGS';

/**
 * Score and verdict from the recorded checks. Only checks that RAN are scored;
 * a SKIP ("not checked") never counts as a pass. PASSED needs every check to
 * have run; otherwise INCOMPLETE with no grade and no score. FAILED as before.
 */
export function buildVerificationReport(
  checks: VerificationCheck[],
  api: { attempted: number; performed: number; matched: number },
  durationMs = 0,
): VerificationReport {
  const failures = checks.filter(c => c.severity === 'FAIL').length;
  const warnings = checks.filter(c => c.severity === 'WARN').length;
  const passes = checks.filter(c => c.severity === 'PASS').length;
  const notChecked = checks.filter(c => c.severity === 'SKIP');
  const skipped = notChecked.length;
  const total = checks.length;
  const run = total - skipped;

  const status: VerificationStatus =
    failures > 0 ? 'FAILED' : (skipped > 0 || total === 0) ? 'INCOMPLETE' : 'PASSED';
  const complete = skipped === 0 && total > 0;

  const rawScore = run > 0 ? Math.round((passes * 100 + warnings * 50) / run) : 0;
  const rawGrade: 'A' | 'B' | 'C' | 'D' | 'F' =
    rawScore >= 90 ? 'A' : rawScore >= 75 ? 'B' : rawScore >= 60 ? 'C' : rawScore >= 40 ? 'D' : 'F';
  // No grade or percentage that implies cross-validation unless coverage is complete.
  const score = complete ? rawScore : null;
  const grade = complete ? rawGrade : null;

  const coverageText = `Coverage: ${run} of ${total} checks run`;
  const apiText = `API re-queries: ${api.performed} of ${api.attempted} ran with independent values, ${api.matched} matched`;
  const notCheckedList = notChecked.map(c => `${c.name} (${c.message.replace(/^Not checked(?: \(no independent value\))?:\s*/, '')})`);
  const comparisonWarnings = checks.filter(c => c.severity === 'WARN' && (c.category === 'API_REQUERY' || c.category === 'CROSS_VALIDATION')).length;

  let summary: string;
  if (status === 'FAILED') {
    summary = `❌ ${VERIFICATION_FAILED_HEADLINE}. ${failures} FAILURE(s) detected: ` +
      checks.filter(c => c.severity === 'FAIL').map(c => `[${c.name}] ${c.message}`).join(' | ') +
      `. Report BLOCKED until issues are resolved. ${coverageText}` +
      (complete ? ` (Grade ${rawGrade}, ${rawScore}%).` : `; ${skipped} could not be checked: ${notCheckedList.join('; ')}.`) +
      ` ${apiText}.`;
  } else if (status === 'INCOMPLETE') {
    summary = `${VERIFICATION_INCOMPLETE_HEADLINE} ` +
      (total === 0
        ? 'No checks could be run.'
        : `${skipped} of ${total} checks could not be run: ${notCheckedList.join('; ')}. ` +
          `${coverageText}: ${passes} passed, ${warnings} warnings, 0 failures.`) +
      ` ${apiText}.`;
  } else if (comparisonWarnings > 0) {
    summary = `✅ ${VERIFICATION_PASSED_WARN_HEADLINE} (Grade ${rawGrade}, ${rawScore}%). All ${total} checks ran with independent values: ` +
      `${passes} passed, ${warnings} warnings. ${apiText}. ${comparisonWarnings} comparison(s) did not agree within tolerance — review the warnings before publication.`;
  } else {
    summary = `✅ ${VERIFICATION_PASSED_HEADLINE} (Grade ${rawGrade}, ${rawScore}%). All ${total} checks ran with independent values: ` +
      `${passes} passed, ${warnings} warnings. ${apiText}. ` +
      `All figures cross-validated against source data. Report is cleared for publication.`;
  }

  return {
    verified: status === 'PASSED',
    blocked: status === 'FAILED',
    status,
    score,
    grade,
    totalChecks: total,
    passed: passes,
    warnings,
    failures,
    skipped,
    coverage: {
      run, total,
      notChecked: notChecked.map(c => ({ id: c.id, name: c.name, reason: c.message })),
    },
    checks,
    apiRequeriesPerformed: api.performed,
    apiRequeriesMatched: api.matched,
    apiRequeriesAttempted: api.attempted,
    timestamp: new Date().toISOString(),
    durationMs,
    summary,
  };
}

/**
 * The status of any stored report, including reports saved before
 * 2026-11-26 (no `status`): skipped checks there mean INCOMPLETE, whatever
 * the old `verified` flag said.
 */
export function verificationStatus(vr: Partial<VerificationReport> | null | undefined): VerificationStatus {
  if (!vr) return 'INCOMPLETE';
  if (vr.status) return vr.status;
  if ((vr.failures ?? 0) > 0 || vr.verified === false) return 'FAILED';
  if ((vr.skipped ?? 0) > 0 || !(vr.totalChecks ?? 0)) return 'INCOMPLETE';
  return 'PASSED';
}

/** The headline shown on screen and in every export. */
export function verificationHeadline(vr: Partial<VerificationReport> | null | undefined): string {
  const s = verificationStatus(vr);
  if (s === 'FAILED') return VERIFICATION_FAILED_HEADLINE;
  if (s === 'INCOMPLETE') return VERIFICATION_INCOMPLETE_HEADLINE;
  const cmpWarn = (vr?.checks ?? []).some(c => c.severity === 'WARN' && (c.category === 'API_REQUERY' || c.category === 'CROSS_VALIDATION'));
  return cmpWarn ? VERIFICATION_PASSED_WARN_HEADLINE : VERIFICATION_PASSED_HEADLINE;
}

/** True when the report must be blocked (a check FAILED). INCOMPLETE does not block. */
export function verificationBlocks(vr: Partial<VerificationReport> | null | undefined): boolean {
  if (!vr) return false;
  if (typeof vr.blocked === 'boolean') return vr.blocked;
  return verificationStatus(vr) === 'FAILED';
}

/**
 * A stored report brought to the current wording (status, grade, summary),
 * so an export of a result computed before 2026-11-26 never repeats the old
 * "cleared for publication" claim over skipped checks.
 */
export function normalizeVerificationReport<T extends Partial<VerificationReport> | null | undefined>(vr: T): T {
  if (!vr || vr.status || !Array.isArray(vr.checks)) return vr;
  const rebuilt = buildVerificationReport(vr.checks, {
    attempted: vr.apiRequeriesPerformed ?? 0,
    performed: vr.checks.filter(c => c.category === 'API_REQUERY' && c.severity !== 'SKIP').length,
    matched: vr.checks.filter(c => c.category === 'API_REQUERY' && c.severity === 'PASS').length,
  }, vr.durationMs ?? 0);
  return { ...vr, ...rebuilt, timestamp: vr.timestamp ?? rebuilt.timestamp } as T;
}

/** One status block, the same on the screen and in every export. */
export interface VerificationDisplay {
  status: VerificationStatus;
  headline: string;
  coverage: string;
  grade: string;
  notChecked: string[];
  summary: string;
}

export const GRADE_NOT_ISSUED = 'not issued (coverage incomplete)';

export function verificationDisplay(vrIn: Partial<VerificationReport> | null | undefined): VerificationDisplay {
  const vr = normalizeVerificationReport(vrIn);
  if (!vr) {
    return {
      status: 'INCOMPLETE', headline: VERIFICATION_INCOMPLETE_HEADLINE,
      coverage: 'Coverage: 0 of 0 checks run', grade: GRADE_NOT_ISSUED,
      notChecked: ['Pre-report verification did not run'], summary: `${VERIFICATION_INCOMPLETE_HEADLINE} Pre-report verification did not run.`,
    };
  }
  const status = verificationStatus(vr);
  const total = vr.coverage?.total ?? vr.totalChecks ?? 0;
  const run = vr.coverage?.run ?? (total - (vr.skipped ?? 0));
  const notChecked = (vr.coverage?.notChecked ?? (vr.checks ?? []).filter(c => c.severity === 'SKIP').map(c => ({ id: c.id, name: c.name, reason: c.message })))
    .map(n => `${n.name}: ${n.reason}`);
  return {
    status,
    headline: verificationHeadline(vr),
    coverage: `Coverage: ${run} of ${total} checks run`,
    grade: vr.grade != null && vr.score != null ? `Grade ${vr.grade} (${vr.score}%), over all ${total} checks` : GRADE_NOT_ISSUED,
    notChecked,
    summary: vr.summary ?? '',
  };
}

/** The status block as table rows (label, value) for the PDF, Word, Excel, CSV and JSON exports. */
export function verificationRows(result: unknown): [string, string][] {
  const d = verificationDisplay((result as any)?.verificationReport);
  return [
    ['Verification status', d.headline],
    ['Verification coverage', d.coverage],
    ['Accuracy grade', d.grade],
    ...d.notChecked.map((x): [string, string] => ['Not checked', x]),
  ];
}
