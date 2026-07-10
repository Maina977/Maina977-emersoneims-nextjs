/**
 * hydroPhysics.ts — THE single source of truth for the engine's core
 * water-balance physics.
 *
 * Why this module exists (hydrogeologist audit, 2026-07-10): the Budyko
 * water balance used to live as THREE separate hand-copies (gldasGroundwater,
 * satelliteWaterEngine, boreholeAnalyzer cross-calibration). One of them
 * violated conservation of mass (>100% of rainfall allocated), and the copies
 * drifted until one report printed four different rainfall/recharge figures.
 * Every module that needs a water balance MUST call this function; never
 * re-implement these equations locally.
 *
 * Physics:
 *  - Reference ET (Penman-Monteith ET0) is ATMOSPHERIC DEMAND, not actual
 *    consumption. Actual ET is supply-limited: AET < P always (long-term).
 *  - Budyko (1974) banded ratio, ω≈2.6 simplification (Zhang et al. 2004).
 *  - The SURPLUS (P − AET) is partitioned 70% quickflow / 30% recharge
 *    (baseflow ≈ diffuse recharge for pre-feasibility screening).
 *  - Mass conservation holds by construction: P = AET + runoff + recharge
 *    (±1 mm rounding).
 */

export interface WaterBalanceResult {
  precipitation_mm: number;
  referenceET_mm: number;
  /** PET/P — <0.7 humid, 0.7-1.2 sub-humid, 1.2-2 semi-arid, >2 arid */
  aridityIndex: number;
  /** Budyko band: fraction of P consumed by actual ET */
  budykoBand: number;
  actualET_mm: number;
  surplus_mm: number;
  surfaceRunoff_mm: number;
  recharge_mm: number;
  /** recharge / precipitation, 0..1 (2 dp) */
  rechargeFraction: number;
  equation: string;
}

/** Budyko band from aridity index (PET/P). Same thresholds everywhere. */
export function budykoBand(aridityIndex: number): number {
  if (aridityIndex <= 0.3) return 0.60; // very humid
  if (aridityIndex <= 0.7) return 0.70; // humid
  if (aridityIndex <= 1.2) return 0.80; // sub-humid
  if (aridityIndex <= 2.0) return 0.88; // semi-arid
  return 0.93;                          // arid
}

/**
 * The one long-term annual water balance.
 * @param precip_mm       annual precipitation (mm/yr)
 * @param referenceET_mm  annual reference/potential ET (mm/yr, FAO PM ET0)
 */
export function budykoWaterBalance(precip_mm: number, referenceET_mm: number): WaterBalanceResult {
  const P = Math.max(1, Math.round(precip_mm));
  const refET = Math.max(0, Math.round(referenceET_mm));
  const aridity = refET / P;
  const band = budykoBand(aridity);

  // Supply limit: AET can never exhaust P — always leave ≥10 mm (if P allows)
  // for runoff + recharge, matching the historical GLDAS-module behaviour.
  const aet = Math.min(Math.round(P * band), Math.max(0, P - 10));
  const surplus = Math.max(P >= 20 ? 10 : 0, P - aet);
  const runoff = Math.round(surplus * 0.70);
  const recharge = Math.max(0, surplus - runoff); // remainder, so P = AET + Q + R exactly
  const fraction = Math.round((recharge / P) * 100) / 100;

  return {
    precipitation_mm: P,
    referenceET_mm: refET,
    aridityIndex: Math.round(aridity * 100) / 100,
    budykoBand: band,
    actualET_mm: aet,
    surplus_mm: surplus,
    surfaceRunoff_mm: runoff,
    recharge_mm: recharge,
    rechargeFraction: fraction,
    equation: `Recharge ≈ Baseflow = P(${P}) − ET(${aet}) − Qs(${runoff}) = ${recharge} mm/yr`,
  };
}

/** Aridity classification consistent with the balance above. */
export function aridityClass(aridityIndex: number): 'humid' | 'sub-humid' | 'semi-arid' | 'arid' {
  if (aridityIndex <= 0.7) return 'humid';
  if (aridityIndex <= 1.2) return 'sub-humid';
  if (aridityIndex <= 2.0) return 'semi-arid';
  return 'arid';
}
