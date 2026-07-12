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

// ════════════════════════════════════════════════════════════════════════════
// GOVERNING YIELD RECONCILIATION  (2026-07-12 driller/surgical audit)
// ════════════════════════════════════════════════════════════════════════════
// The tool prints one number too many times: the ensemble/executive yield (data-
// driven, but inflated by nearby springs) and the well-design "design rate" (the
// aquifer-limited pump rate derived from transmissivity). When they disagree
// (4.9 vs 0.28 m³/hr) the report contradicts itself and a driller loses trust.
//
// This is the single choke-point that decides THE governing yield everything
// else must obey. It is deliberately pure and unit-tested so the policy is
// auditable, not eyeballed:
//
//   1. Start from the aquifer-limited (physics) rate — a borehole can never
//      sustainably yield more than its aquifer allows within available drawdown.
//   2. But a single desktop transmissivity can be wildly wrong in EITHER
//      direction (0.1 m²/day → 0.28 m³/hr, or 146 m²/day → 18 m³/hr). So bound
//      the result by the PUBLISHED regional tested-yield band for the aquifer
//      province (e.g. Kenya BASEMENT = [0.5, 3] m³/hr, MacDonald et al. 2012 /
//      WRA completion stats) — real drilled outcomes, not a model.
//   3. When the physics rate falls BELOW the regional floor *and* an independent
//      data-driven estimate (ensemble of nearby wells, recharge, terrain) also
//      supports at least the floor, the low-T model is the outlier: trust the
//      published tested yield and lift to the floor.
//   4. Never advertise more than the aquifer/ensemble/regional ceiling allows.
//
// The returned value becomes estimatedYield / drillDecision.expectedYield_m3hr
// AND the well-design design rate — one number, whole report.
export interface GoverningYieldInput {
  /** data-driven ensemble/executive yield (may be inflated) */
  ensembleYield_m3hr: number;
  /** aquifer-limited design rate from wellDesignEngine (physics constraint) */
  aquiferLimitedYield_m3hr: number;
  /** published regional tested-yield band for the aquifer province, m³/hr */
  regionalPriorBand_m3hr: [number, number];
}
export interface GoverningYieldResult {
  governingYield_m3hr: number;
  basis: 'aquifer-limited' | 'regional-floor (low-T outlier)' | 'ensemble-capped' | 'regional-ceiling';
  note: string;
}
export function reconcileGoverningYield(input: GoverningYieldInput): GoverningYieldResult {
  const ensemble = Math.max(0, Number(input.ensembleYield_m3hr) || 0);
  const aquifer = Math.max(0, Number(input.aquiferLimitedYield_m3hr) || 0);
  const [priorLoRaw, priorHiRaw] = input.regionalPriorBand_m3hr ?? [0.5, 3];
  const priorLo = Math.max(0, Number(priorLoRaw) || 0);
  const priorHi = Math.max(priorLo, Number(priorHiRaw) || priorLo);

  let g = aquifer;
  let basis: GoverningYieldResult['basis'] = 'aquifer-limited';

  // (3) low-T outlier: aquifer rate below the regional floor but data supports it
  if (g < priorLo && ensemble >= priorLo) {
    g = priorLo;
    basis = 'regional-floor (low-T outlier)';
  }

  // (4) never exceed the independent ensemble estimate...
  if (g > ensemble && ensemble > 0) {
    g = ensemble;
    basis = 'ensemble-capped';
  }
  // ...nor the published regional ceiling
  if (g > priorHi) {
    g = priorHi;
    basis = 'regional-ceiling';
  }

  g = Math.round(g * 100) / 100;
  const note =
    basis === 'regional-floor (low-T outlier)'
      ? `Modelled transmissivity implies only ${aquifer.toFixed(2)} m³/hr — below the published ${priorLo}-${priorHi} m³/hr basement tested-yield band. Governing yield set to the regional floor ${g} m³/hr; confirm with a 24-h pump test.`
      : basis === 'ensemble-capped'
      ? `Governing yield ${g} m³/hr = data-driven ensemble estimate (aquifer physics would allow more).`
      : basis === 'regional-ceiling'
      ? `Governing yield capped to the published regional ceiling ${g} m³/hr.`
      : `Governing yield ${g} m³/hr = aquifer-limited design rate (within the regional tested-yield band).`;

  return { governingYield_m3hr: g, basis, note };
}
