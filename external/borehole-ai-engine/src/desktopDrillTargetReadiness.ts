/**
 * desktopDrillTargetReadiness.ts — THREE-SCORE STATUS ARCHITECTURE
 * ════════════════════════════════════════════════════════════════════════════
 * Global Desktop Drill-Target Intelligence upgrade (§1, §10, §14).
 *
 * Replaces the single ambiguous "drill-ready" number with THREE independent
 * outputs, so a strong desktop target can be reported honestly without ever
 * implying authority to mobilise a rig:
 *
 *   A. DDTR — Desktop Drill-Target Readiness (0-95)
 *        How strongly ALL available desktop/satellite/registry/geological/
 *        historical evidence supports THIS target for professional confirmation.
 *        Hard-capped at 95: desktop evidence alone can never reach 100.
 *
 *   B. FRR — Field & Regulatory Readiness (0-100)
 *        How much of the field/professional/regulatory work is actually done
 *        (peg, ERT, sign-off, authorisation, pump test, lab). Desktop-only ≈ 0.
 *
 *   C. MAG — Mobilisation Authorisation Gate
 *        BLOCKED | CONDITIONALLY RELEASED (for field confirmation) |
 *        RELEASED FOR DRILLING. A high DDTR must NOT release this gate.
 *
 * This module is PURE and GLOBAL: it derives every score from the evidence the
 * pipeline already gathers (nearby water points, geology, lineaments, terrain,
 * recharge, remote sensing, soil, water quality, provenance) — nothing is
 * hardcoded to any one site. Missing evidence simply scores zero for its
 * category; it is never invented (spec §2/§9 "no hallucination").
 */

export type DDTRClass =
  | 'DESKTOP TARGET REJECTED'
  | 'LOW-CONFIDENCE DESKTOP TARGET'
  | 'PRELIMINARY DESKTOP TARGET'
  | 'PROMISING DESKTOP TARGET'
  | 'ADVANCED DESKTOP DRILL TARGET'
  | 'HIGH-CONFIDENCE DESKTOP DRILL TARGET';

export type MAGStatus = 'BLOCKED' | 'CONDITIONALLY RELEASED' | 'RELEASED FOR DRILLING';

export interface DDTRCategory {
  category: string;
  earned: number;
  max: number;
  /** the exact evidence that would lift this category's remaining points (§15.22) */
  lifts: string;
  /** where the score came from */
  basis: string;
}

export interface DDTRPenalty {
  reason: string;
  points: number; // negative
}

export interface DesktopDrillTargetReadiness {
  // A — DDTR
  ddtr: number;                 // 0-95
  ddtrBase: number;             // before penalties
  ddtrClass: DDTRClass;
  categories: DDTRCategory[];
  penalties: DDTRPenalty[];
  evidenceFamilies: string[];   // independent families that contributed
  evidenceFamilyCount: number;
  // B — FRR
  frr: number;                  // 0-100
  frrGates: { gate: string; done: boolean }[];
  // C — MAG
  mag: MAGStatus;
  magReason: string;
  // shared
  criticalContradictions: string[];
  conclusion: string;           // the §14 recommended desktop conclusion
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Classify a DDTR score into the §1 band. */
export function classifyDDTR(ddtr: number): DDTRClass {
  if (ddtr < 40) return 'DESKTOP TARGET REJECTED';
  if (ddtr < 55) return 'LOW-CONFIDENCE DESKTOP TARGET';
  if (ddtr < 70) return 'PRELIMINARY DESKTOP TARGET';
  if (ddtr < 80) return 'PROMISING DESKTOP TARGET';
  if (ddtr < 90) return 'ADVANCED DESKTOP DRILL TARGET';
  return 'HIGH-CONFIDENCE DESKTOP DRILL TARGET';
}

/**
 * Compute the three-score architecture from a full AnalysisResult.
 * `auditFailedCount` is the number of FAIL checks from reportAuditor (>0 means an
 * unresolved critical contradiction exists → DDTR is capped and MAG is BLOCKED).
 */
export function computeDesktopDrillTargetReadiness(
  result: any,
  auditFailedCount = 0,
): DesktopDrillTargetReadiness {
  const r = result ?? {};
  const families = new Set<string>();
  const categories: DDTRCategory[] = [];
  const add = (category: string, earned: number, max: number, family: string | null, basis: string, lifts: string) => {
    const e = clamp(Math.round(earned), 0, max);
    if (e > 0 && family) families.add(family);
    categories.push({ category, earned: e, max, basis, lifts });
  };

  // ── 1. Coordinate & administrative verification (5) ──
  const gpsSource = String(r.gpsSource ?? 'none');
  const grade = String(r.locationConfidence?.grade ?? r.siteIdentity?.locationConfidenceGrade ?? '');
  // AUDIT FIX (2026-07-16): the pipeline stores the geocoded admin hierarchy on
  // resolvedLocation / geocodedDisplayName — the old field list missed them, so
  // the report printed a full village→ward→county hierarchy on page 1 while
  // this category claimed "admin unresolved" (2 points wrongly withheld).
  const adminResolved = !!(r.siteIdentity?.adminHierarchy || r.locationContext?.county || r.administrativeLocation?.county
    || r.resolvedLocation?.county || r.resolvedLocation?.state || r.locationContext?.state
    || (typeof r.geocodedDisplayName === 'string' && r.geocodedDisplayName.includes(','))
    || (typeof r.resolvedLocation?.displayName === 'string' && r.resolvedLocation.displayName.includes(',')));
  let coordScore = 0;
  if (Number.isFinite(r.siteIdentity?.coordinates?.lat) || Number.isFinite(r.latitude)) coordScore += 2; // valid coords
  if (adminResolved) coordScore += 2;                                                                     // admin hierarchy resolved
  if (['exif', 'device'].includes(gpsSource)) coordScore += 1;                                            // photo/device fix
  else if (/^[AB]$/i.test(grade)) coordScore += 1;   // geocoded admin hierarchy corroborates the entered point (grade A/B)
  add('Coordinate & administrative verification', coordScore, 5, 'Coordinates',
    `GPS source "${gpsSource}"${grade ? `, location grade ${grade}` : ''}; admin ${adminResolved ? 'resolved' : 'unresolved'}.`,
    'Set out and record a survey-grade GPS peg on site (accuracy, date, operator, photo).');

  // ── 2. Official water-point & borehole evidence (20) ──
  // Hydrogeological weighting note (recalibration 2026-07-16): in weathered
  // basement terrain, nearby FUNCTIONAL water points are the single most
  // predictive desktop evidence family (MacDonald et al. 2005/2012). Springs
  // are DIRECT groundwater discharge — the aquifer outcropping at the surface —
  // and are first-order occurrence evidence, not noise. They still cannot
  // calibrate borehole depth/yield the way completion records can, which is why
  // drilled boreholes and drilled outcomes keep their own sub-scores.
  const wells: any[] = r.nearbyWells?.nearbyWells ?? [];
  const sampleSize = Number(r.nearbyWells?.sampleSize ?? wells.length ?? 0);
  // /sp?ring/i tolerates registry typos ("Water Sring") — a misspelled spring
  // must not be counted (and displayed) as a drilled borehole (audit #7).
  const boreholes = wells.filter((w) => !/sp?ring/i.test(String(w?.id ?? '')) && !/sp?ring/i.test(String(w?.lithology ?? '')));
  const springs = wells.length - boreholes.length;
  // A "drilled outcome" must be a REAL recorded outcome — wells whose outcome
  // was back-filled from regional-estimated yields are calibration aids, not
  // validation evidence (no synthetic outcomes may earn analogue credit).
  const drilledOutcomes = wells.filter((w) => (w?.outcome === 'Success' || w?.outcome === 'Fail')
    && !/sp?ring/i.test(String(w?.id ?? '')) && !/regional est/i.test(String(w?.source ?? '')));
  const successRate = Number(r.nearbyWells?.successRate ?? 0);
  let wpScore = 0;
  if (sampleSize > 0) wpScore += Math.min(6, Math.ceil(sampleSize / 15));        // volume of registry records (max 6)
  wpScore += Math.min(6, boreholes.length * 2);                                   // actual drilled boreholes/wells (max 6)
  wpScore += Math.min(5, Math.floor(springs / 10));                               // springs = direct discharge evidence (max 5)
  if (sampleSize >= 10 && successRate >= 0.8) wpScore += 3;                       // proven, sustained functionality (max 3)
  else if (sampleSize >= 10 && successRate >= 0.6) wpScore += 2;
  add('Official water-point & borehole evidence', wpScore, 20, 'Water-point records',
    `${sampleSize} registry record(s): ${boreholes.length} borehole/well, ${springs} spring; ${drilledOutcomes.length} with a drilled outcome; functional share ${(successRate * 100).toFixed(0)}%.`,
    'Obtain WRA/registry BOREHOLE completion records (depth, yield, water strikes) in the same geology — springs prove occurrence but cannot calibrate borehole depth/yield.');

  // ── 3. Geology & hydrogeological setting (14) ──
  const hasSubsurface = !!r.subsurfaceModel;
  const prior = r.kenyaHydroPrior;
  const hasProvince = !!(prior?.province);
  const hasAquiferClass = !!r.aquiferClassification;
  let geoScore = 0;
  if (hasProvince) geoScore += 6;                 // identified hydrogeological province (literature prior)
  if (hasSubsurface) geoScore += 5;               // layered subsurface model
  if (hasAquiferClass) geoScore += 3;             // aquifer-type classification
  add('Geology & hydrogeological setting', geoScore, 14, 'Geology',
    `${hasProvince ? `Province: ${prior.province}` : 'Province not identified'}; subsurface model ${hasSubsurface ? 'present' : 'absent'}; aquifer class ${hasAquiferClass ? 'present' : 'absent'}.`,
    'Add a national geological/hydrogeological map sheet and a licensed local report to raise geology above literature-prior tier.');

  // ── 4. Structural & lineament evidence (8) ──
  // Weight reduced from 13 → 8 (recalibration 2026-07-16): desktop lineament
  // mapping has poor inter-analyst reproducibility (published overlap between
  // independent lineament maps of the same area is routinely <20%), so it must
  // not dominate the desktop score the way offset-well evidence does.
  const lin = r.lineamentAnalysis;
  const srsForStruct = r.satelliteRemoteSensing;
  let structScore = 0;
  if (lin) {
    structScore += 4;                                                     // DEM structural/lineament analysis ran
    if ((lin.intersectionCount ?? 0) > 0) structScore += 2;              // intersections mapped
    if ((lin.lineamentDensity ?? 0) > 0.1) structScore += 2;            // meaningful density
    // remote-sensing lineaments alone are capped — need a second sensor family / geological map to go higher
  } else if (srsForStruct) {
    structScore += 3;                                                     // spectral lineament screening only
  }
  add('Structural & lineament evidence', structScore, 8, 'Structural geology',
    lin ? `Lineament density ${lin.lineamentDensity ?? 0}/km², ${lin.intersectionCount ?? 0} intersection(s) (remote-sensing — requires field confirmation).`
      : srsForStruct ? 'Spectral lineament screening only (no DEM lineament model).' : 'No lineament analysis available.',
    'Confirm lineaments across a SECOND sensor family (radar + optical) and against a mapped fault layer; field ERT confirms whether a lineament is a water-bearing fracture.');

  // ── 5. Terrain, drainage & recharge position (10) ──
  const dem = r.demHydrology;
  let terrScore = 0;
  if (dem) {
    terrScore += 4;
    if (Number.isFinite(dem.twi)) terrScore += 2;
    if (Number.isFinite(dem.drainageDensity)) terrScore += 2;
    if (Number.isFinite(dem.groundwaterFavorability)) terrScore += Math.round((dem.groundwaterFavorability / 100) * 2);
  }
  add('Terrain, drainage & recharge position', terrScore, 10, 'Terrain',
    dem ? `TWI ${dem.twi ?? '—'}, slope ${dem.slope_degrees ?? '—'}°, drainage density ${dem.drainageDensity ?? '—'}, position ${dem.relativePosition ?? '—'}.` : 'No DEM hydrology available.',
    'Already strong from DEM; a higher-resolution national/drone DEM refines valley-bottom and depression targeting.');

  // ── 6. Climate, rainfall & recharge reliability (8) ──
  const rech = r.rechargeModel;
  // AUDIT FIX (2026-07-16): the dynamic recharge model itself carries a
  // multi-year annual time series (NASA POWER-derived). The old check only
  // looked at historicalData.weather, so a report with a full multi-year
  // recharge series was scored "single-period climate" (2-3 points withheld).
  const rechYears = Array.isArray(rech?.annualRechargeTimeSeries) ? rech.annualRechargeTimeSeries.length : 0;
  const hasMultiYear = !!(r.historicalData?.weather) || rechYears >= 3;
  const hasPrecipData = hasMultiYear || rechYears > 0
    || Number.isFinite(rech?.annualRainfall_mm) || Number.isFinite(rech?.annualRainfall) || Number.isFinite(rech?.precipitation_mm);
  let climScore = 0;
  if (rech) climScore += 3;
  if (hasMultiYear) climScore += 3;
  else if (hasPrecipData) climScore += 2;            // single-period satellite precipitation record
  if (rech && Number.isFinite(rech.confidence)) climScore += Math.round((rech.confidence) * 2);
  add('Climate, rainfall & recharge reliability', climScore, 8, 'Climate/recharge',
    `${rech ? 'Recharge model present' : 'No recharge model'}; ${hasMultiYear ? 'multi-year climate record' : 'single-period climate'}.`,
    'Add a second and third recharge approach (water-balance + coefficient + land-surface model) and show their agreement/disagreement (§3F).');

  // ── 7. Optical, radar & multi-temporal agreement (8) ──
  const srs = r.satelliteRemoteSensing;
  const seasonalVeg = !!(r.vegetationGWProxy?.ndviSeasonalRange != null || r.satelliteVegetation);
  let rsScore = 0;
  if (srs) {
    rsScore += 3;
    const used = Number(srs.totalMethodsUsed ?? 0);
    rsScore += Math.min(3, Math.round(used / 3));
  }
  if (seasonalVeg) rsScore += 2; // multi-season vegetation comparison
  add('Optical, radar & multi-temporal agreement', rsScore, 8, 'Remote sensing',
    `${srs ? `${srs.totalMethodsUsed ?? 0} satellite method(s)` : 'No satellite fusion'}; multi-season vegetation ${seasonalVeg ? 'assessed' : 'not assessed'}.`,
    'Add genuine multi-DATE Sentinel-2 + Sentinel-1 retrieval (wet vs dry season) and require cross-sensor lineament/wetness agreement (§3B/§3C).');

  // ── 8. Soil, infiltration & land-cover suitability (6) ──
  const soil = r.soil;
  let soilScore = 0;
  if (soil?.type) soilScore += 3;
  if (Number.isFinite(soil?.permeability)) soilScore += 2;
  if (Number.isFinite(soil?.porosity)) soilScore += 1;
  add('Soil, infiltration & land-cover suitability', soilScore, 6, 'Soil',
    soil ? `Soil ${soil.type ?? '—'}, permeability ${soil.permeability ?? '—'}, porosity ${soil.porosity ?? '—'}.` : 'No soil data.',
    'Add ESA WorldCover land cover + national soil map; a field soil pit confirms infiltration class.');

  // ── 9. Water-quality & contamination screening (5) ──
  const wq = r.waterQuality;
  const hasSetback = !!(r.wellDesign?.setbackAnalysis || r.setbackAnalysis ||
    Number.isFinite(r.risk?.categories?.contamination) || r.risk?.contaminationRisk);  // land-use contamination screening counts
  let wqScore = 0;
  if (wq) wqScore += 3;
  if (hasSetback) wqScore += 2;
  add('Water-quality & contamination screening', wqScore, 5, 'Hydrochemistry',
    `${wq ? 'Modelled WQ risk screened' : 'No WQ screening'}; contamination/setback screening ${hasSetback ? 'present' : 'absent'}.`,
    'Field sanitary reconnaissance (measure real setbacks) + ISO 17025 laboratory analysis replace modelled WQ risk.');

  // ── 10. Historical analogue & depth calibration (11) ──
  // Weight raised from 8 → 11 (recalibration 2026-07-16) and extended: registry
  // water points with REAL (non-estimated) depths are legitimate desktop
  // calibration data — if the model's recommended depth sits inside the band of
  // measured offset depths, the depth recommendation is empirically anchored.
  const bt = r.backtest || r.boreholeIntelligence;
  const measuredDepths = wells
    .filter((w) => Number(w?.depth_m) > 0 && !/regional est/i.test(String(w?.source ?? '')))
    .map((w) => Number(w.depth_m))
    .sort((a, b) => a - b);
  const medianDepth = measuredDepths.length > 0 ? measuredDepths[Math.floor(measuredDepths.length / 2)] : 0;
  const recDepth = Number(r.recommendedDepth ?? 0);
  const depthConcordant = medianDepth > 0 && recDepth >= medianDepth * 0.5 && recDepth <= medianDepth * 1.6;
  // Regional drilled-borehole intelligence (county database — REAL aggregate
  // drilling statistics for the same region: count, success rate, depth band).
  // These are drilled, tested boreholes in the same hydrogeological unit — the
  // strongest analogue evidence available before completion records arrive.
  const countyIntel = r.boreholeRecords?.countyIntelligence;
  const countyHasDrilled = Number(countyIntel?.estimatedBoreholes ?? 0) > 0 && Number(countyIntel?.successRate ?? 0) > 0;
  const countyDepthLo = Number(countyIntel?.depthRange?.[0] ?? NaN);
  const countyDepthHi = Number(countyIntel?.depthRange?.[1] ?? NaN);
  const countyConcordant = countyHasDrilled && Number.isFinite(countyDepthLo) && Number.isFinite(countyDepthHi)
    && recDepth >= countyDepthLo && recDepth <= countyDepthHi;
  let analogScore = 0;
  if (drilledOutcomes.length >= 3) analogScore += Math.min(4, drilledOutcomes.length); // real drilled analogues nearby
  if (measuredDepths.length >= 5) analogScore += 2;                                     // measured offset depths available
  if (measuredDepths.length >= 5 && depthConcordant) analogScore += 2;                  // model depth inside the measured band
  if (countyHasDrilled) analogScore += 2;                                               // regional drilled-borehole statistics
  if (countyConcordant) analogScore += 1;                                               // model depth inside the county drilled band
  if (bt) analogScore += 2;
  add('Historical analogue & depth calibration', analogScore, 11, 'Borehole outcomes',
    `${drilledOutcomes.length} drilled-outcome analogue(s); ${measuredDepths.length} offset record(s) with measured depth` +
    (measuredDepths.length >= 5 ? ` (median ${medianDepth} m — model depth ${recDepth} m ${depthConcordant ? 'CONCORDANT' : 'NOT concordant'})` : '') +
    (countyHasDrilled ? `; regional drilled-borehole intelligence: ~${countyIntel.estimatedBoreholes} boreholes (${countyIntel.county ?? 'county'}), success rate ${(Number(countyIntel.successRate) * 100).toFixed(0)}%, drilled depths ${Number.isFinite(countyDepthLo) ? `${countyDepthLo}-${countyDepthHi} m` : 'n/a'}${countyConcordant ? ' — model depth INSIDE the drilled band' : ''}` : '') +
    `${bt ? '; intelligence/back-test module present' : ''}.`,
    'Add REAL successful AND failed borehole outcomes in the same geological/structural unit; calibrate probability against them (§6).');

  // ── 11. Data provenance, completeness & integrity (5) ──
  const prov = r.engineerConfidence?.provenance;
  const reportConsistent = auditFailedCount === 0;
  let provScore = 0;
  if (prov) provScore += 2;
  if (Number.isFinite(prov?.overallAccuracy_pct) && prov.overallAccuracy_pct >= 50) provScore += 1;
  if (reportConsistent) provScore += 2;
  add('Data provenance, completeness & integrity', provScore, 5, 'Provenance',
    `Provenance ${prov ? `tracked (${prov.overallAccuracy_pct ?? '—'}% of source-level values from measured/verified data — a stricter metric than the report confidence %)` : 'absent'}; ${reportConsistent ? 'no unresolved contradiction' : `${auditFailedCount} unresolved audit failure(s)`}.`,
    'Resolve any audit FAIL and ensure every governing value traces to a cited source.');

  const ddtrBase = categories.reduce((s, c) => s + c.earned, 0);

  // ══ PENALTIES (§10) — only those derivable from actual data ══
  // Recalibration 2026-07-16: penalties must not double-punish what the rubric
  // already scores. Manual coordinates are the NORMAL desktop input mode (the
  // survey-grade peg is a FIELD gate scored in FRR) — so the manual penalty is
  // small; only an unlocated/visual estimate is heavily penalised. Likewise,
  // "no drilled outcomes" is softened when abundant functional water points
  // prove groundwater occurrence — the missing piece is then depth/yield
  // calibration (already reflected in categories 2 & 10), not occurrence.
  const penalties: DDTRPenalty[] = [];
  if (!['exif', 'device', 'manual'].includes(gpsSource)) penalties.push({ reason: 'Location is a regional/visual estimate (not manual/photo/device)', points: -8 });
  else if (gpsSource === 'manual') penalties.push({ reason: 'Coordinates manually entered (survey-grade peg outstanding — a mis-placed pin analyses the wrong plot)', points: -3 });
  if (drilledOutcomes.length === 0) {
    const occurrenceProven = sampleSize >= 20 && successRate >= 0.8;
    penalties.push(occurrenceProven
      ? { reason: 'No drilled BOREHOLE outcome records — occurrence proven by functional water points, but borehole depth/yield calibration is registry-estimated', points: -3 }
      : { reason: 'No actual drilled BOREHOLE outcomes in the evidence set (springs/registry points only)', points: -8 });
  }
  if (sampleSize === 0) penalties.push({ reason: 'No official water-point/borehole records retrieved', points: -10 });
  if (!hasProvince) penalties.push({ reason: 'No identified geological/hydrogeological province from an authoritative source', points: -5 });
  if (auditFailedCount > 0) penalties.push({ reason: `${auditFailedCount} unresolved critical contradiction(s) in the consistency validator`, points: -Math.min(20, 8 + auditFailedCount * 4) });

  const penaltyTotal = penalties.reduce((s, p) => s + p.points, 0);
  // Hard cap at 95 — desktop evidence alone can never reach 100 (§1A).
  let ddtr = clamp(ddtrBase + penaltyTotal, 0, 95);

  // A DDTR above 90 is not allowed while an unresolved critical contradiction exists (§9).
  const criticalContradictions: string[] = [];
  if (auditFailedCount > 0) {
    criticalContradictions.push(`${auditFailedCount} consistency-validator FAIL(s) unresolved`);
    ddtr = Math.min(ddtr, 89);
  }

  const ddtrClass = classifyDDTR(ddtr);

  // ══ B — FIELD & REGULATORY READINESS (0-100) ══
  const f = r._auditFlags ?? {};
  const dr = r.drillReadiness ?? {};
  const frrGates = [
    { gate: 'Field reconnaissance completed', done: !!f.hasFieldRecon },
    { gate: 'Survey-grade drill peg recorded', done: !!f.hasFieldPeg },
    { gate: 'Actual ERT/VES field data uploaded', done: !!f.hasFieldERT },
    { gate: 'Raw geophysical data QA passed', done: !!f.hasFieldERT },
    { gate: 'Hydrogeologist interpretation & sign-off', done: !!f.hasHydrogeologistSignoff },
    { gate: 'WRA authorisation verified', done: !!f.hasWRAAuthorisation },
    { gate: 'Environmental requirement verified', done: !!(f.hasEnvAuthorisation ?? f.hasWRAAuthorisation) },
    { gate: 'Final drilling target & stopping criteria issued', done: !!(f.hasFieldERT && f.hasHydrogeologistSignoff) },
    { gate: 'Constant-rate pump test completed', done: !!f.hasFieldPumpTest },
    { gate: 'ISO 17025 laboratory water analysis', done: !!f.hasLabWaterAnalysis },
  ];
  const frr = Math.round((frrGates.filter(g => g.done).length / frrGates.length) * 100);

  // ══ C — MOBILISATION AUTHORISATION GATE ══
  const mandatoryDone = !!f.hasFieldERT && !!f.hasFieldPeg && !!f.hasHydrogeologistSignoff && !!f.hasWRAAuthorisation && auditFailedCount === 0;
  let mag: MAGStatus;
  let magReason: string;
  if (auditFailedCount > 0 || ddtr < 55) {
    mag = 'BLOCKED';
    magReason = auditFailedCount > 0
      ? 'Unresolved critical contradiction(s) in the consistency validator — target cannot be released.'
      : `DDTR ${ddtr}/100 is below the 55 threshold for a preliminary desktop target.`;
  } else if (mandatoryDone && frr >= 80) {
    mag = 'RELEASED FOR DRILLING';
    magReason = 'All mandatory field, professional and regulatory gates verified.';
  } else {
    mag = 'CONDITIONALLY RELEASED';
    magReason = 'Desktop target is sufficiently supported for ACCELERATED FIELD CONFIRMATION only. Drilling mobilisation remains subject to the outstanding field and regulatory gates below.';
  }

  const conclusion =
    `GLOBAL MULTI-SOURCE DESKTOP ASSESSMENT COMPLETE. The proposed target has achieved a Desktop Drill-Target Readiness score of ${ddtr}/100 and is classified as ${ddtrClass}. ` +
    (mag === 'CONDITIONALLY RELEASED'
      ? 'The target is sufficiently supported for accelerated field confirmation. '
      : mag === 'RELEASED FOR DRILLING'
        ? 'All field and regulatory gates are verified. '
        : 'The target is not yet released. ') +
    'This report does not constitute drilling mobilisation authority. The exact drill peg, final depth, completion design and pump selection remain subject to field geophysics, survey-grade coordinate verification, professional sign-off, applicable approvals, drilling records, pump testing and accredited laboratory analysis.';

  return {
    ddtr, ddtrBase, ddtrClass, categories, penalties,
    evidenceFamilies: [...families], evidenceFamilyCount: families.size,
    frr, frrGates, mag, magReason, criticalContradictions, conclusion,
  };
}
