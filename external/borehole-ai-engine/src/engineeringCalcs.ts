/**
 * Engineering Calculations Module — Professional-Grade Borehole Engineering
 *
 * Contains every calculation a licensed Professional Engineer (PE) and
 * Professional Geologist (PG) needs for borehole feasibility and design.
 *
 * References:
 *   Langelier, W.F. (1936) "The analytical control of anti-corrosion water treatment"
 *   Ryznar, J.W. (1944) "A new index for determining amount of calcium carbonate scale"
 *   Carrier, W.D. (2003) "Goodbye, Hazen; Hello, Kozeny-Carman" J. Geotech. & Geoenviro. Eng.
 *   Driscoll, F.G. (1986) Groundwater and Wells, 2nd ed.
 *   Hydraulic Institute (2018) ANSI/HI 9.6.1 — NPSH Margin
 *   API RP 65 — Cementing Shallow Water Flow Zones
 *   WHO (2006) Guidelines for Drinking-water Quality, 4th ed.
 *   ASTM D4382 — Standard Practice for Determining Chemical Compatibility
 *   Todd & Mays (2005) Groundwater Hydrology, 3rd ed.
 *   Kruseman & de Ridder (1994) Analysis and Evaluation of Pumping Test Data
 *   Freeze & Cherry (1979) Groundwater
 */

// ════════════════════════════════════════════════════════════
// 1. WATER CHEMISTRY INDICES (LSI, RSI, AI, Corrosion Rate)
// ════════════════════════════════════════════════════════════

export interface WaterChemistryInput {
  pH: number;
  temperature_C: number;
  tds_mgL: number;
  calcium_mgL?: number;
  alkalinity_mgL_CaCO3?: number;
  hardness_mgL_CaCO3?: number;
  iron_mgL?: number;
  manganese_mgL?: number;
  sulfate_mgL?: number;
  chloride_mgL?: number;
  fluoride_mgL?: number;
  arsenic_ugL?: number;
  nitrate_mgL?: number;
  dissolvedOxygen_mgL?: number;
  h2s_detected?: boolean;
}

export interface WaterChemistryResult {
  langelierSaturationIndex: number;
  langelierInterpretation: string;
  ryznarStabilityIndex: number;
  ryznarInterpretation: string;
  aggressiveIndex: number;
  aggressiveInterpretation: string;
  corrosionRisk: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  scalingRisk: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  pipeRecommendation: string;
  designLife_years: number;
  ironBacteriaRisk: string;
  salinityClass: string;
  ionicStrength: number;
  treatmentRequired: string[];
  warnings: string[];
}

/**
 * Langelier Saturation Index (LSI)
 * LSI = pH - pHs
 * pHs = (9.3 + A + B) - (C + D)
 * where: A = (log10(TDS) - 1)/10, B = -13.12 × log10(°C + 273) + 34.55
 *         C = log10(Ca as CaCO3) - 0.4, D = log10(Alkalinity as CaCO3)
 *
 * Ryznar Stability Index (RSI) = 2×pHs - pH
 * Aggressive Index (AI) = pH + log10(Alk × Hardness)
 */
export function computeWaterChemistry(input: WaterChemistryInput): WaterChemistryResult {
  const warnings: string[] = [];
  const treatmentRequired: string[] = [];

  // Estimate Ca and alkalinity from TDS if not provided (Hem, 1985 correlations).
  // AUDIT FIX (2026-07-10): unit consistency -- the Langelier C-term below
  // requires calcium AS CaCO3. Hem's ~8%-of-TDS is ELEMENTAL Ca, so the
  // fallback converts (x2.5); supplied calcium_mgL is treated as CaCO3
  // (matching the LSI numeric convention verified against textbook values).
  // Total hardness ≈ calcium hardness x1.2 (Mg allowance) -- the old x2.5
  // double-applied the element→CaCO3 factor and biased AI by ~+0.4.
  const Ca = input.calcium_mgL ?? input.tds_mgL * 0.08 * 2.5; // as CaCO3
  const Alk = input.alkalinity_mgL_CaCO3 ?? input.tds_mgL * 0.35; // ~35% as CaCO3
  const Hard = input.hardness_mgL_CaCO3 ?? Ca * 1.2; // total hardness as CaCO3
  const T = input.temperature_C;
  const TDS = input.tds_mgL;

  if (!input.calcium_mgL) warnings.push('Calcium estimated from TDS (Hem 1985). Lab analysis recommended.');
  if (!input.alkalinity_mgL_CaCO3) warnings.push('Alkalinity estimated from TDS. Lab analysis recommended.');

  // pHs calculation (Langelier 1936)
  const A = (Math.log10(Math.max(1, TDS)) - 1) / 10;
  const B = -13.12 * Math.log10(T + 273) + 34.55;
  const C = Math.log10(Math.max(0.1, Ca)) - 0.4;
  const D = Math.log10(Math.max(0.1, Alk));
  const pHs = (9.3 + A + B) - (C + D);

  // LSI
  const LSI = Math.round((input.pH - pHs) * 100) / 100;
  let lsiInterp: string;
  if (LSI > 1.0) lsiInterp = 'Heavy scale-forming. CaCO₃ will precipitate aggressively. Screen incrustation likely.';
  else if (LSI > 0.5) lsiInterp = 'Moderately scale-forming. Minor CaCO₃ deposition expected.';
  else if (LSI > 0) lsiInterp = 'Slightly scale-forming. Balanced to slightly depositing.';
  else if (LSI > -0.5) lsiInterp = 'Slightly corrosive. Mild metal dissolution expected.';
  else if (LSI > -1.0) lsiInterp = 'Moderately corrosive. Pipe linings or resistant materials required.';
  else lsiInterp = 'Highly corrosive. Aggressive water will dissolve metal pipes rapidly. Stainless steel or HDPE mandatory.';

  // RSI (Ryznar 1944)
  const RSI = Math.round((2 * pHs - input.pH) * 100) / 100;
  let rsiInterp: string;
  if (RSI < 5.5) rsiInterp = 'Heavy scaling. Anticipate 0.5-2mm/yr CaCO₃ buildup on screens.';
  else if (RSI < 6.2) rsiInterp = 'Scale-forming. Periodic acid treatment of screens required.';
  else if (RSI < 6.8) rsiInterp = 'Slight scale. Minimal maintenance.';
  else if (RSI < 8.5) rsiInterp = 'Corrosive. Pipe corrosion expected.';
  else rsiInterp = 'Very aggressive. Rapid metal dissolution. Use HDPE or stainless only.';

  // Aggressive Index (AI) -- uses CALCIUM hardness (as CaCO3), not total
  // hardness (AWWA C400 definition; audit fix 2026-07-10)
  const AI = Math.round((input.pH + Math.log10(Math.max(0.1, Alk) * Math.max(0.1, Ca))) * 100) / 100;
  let aiInterp: string;
  if (AI >= 12) aiInterp = 'Non-aggressive. Cement mortar linings stable.';
  else if (AI >= 10) aiInterp = 'Moderately aggressive. Cement mortar will slowly deteriorate.';
  else aiInterp = 'Highly aggressive. Cement grout integrity at risk. Use sulfate-resistant cement.';

  // Corrosion risk
  let corrosionRisk: WaterChemistryResult['corrosionRisk'];
  if (LSI < -1.0 || RSI > 8.5 || (input.h2s_detected)) corrosionRisk = 'severe';
  else if (LSI < -0.5 || RSI > 7.5) corrosionRisk = 'high';
  else if (LSI < 0 || RSI > 6.8) corrosionRisk = 'moderate';
  else if (LSI < 0.3) corrosionRisk = 'low';
  else corrosionRisk = 'none';

  // Scaling risk
  let scalingRisk: WaterChemistryResult['scalingRisk'];
  if (LSI > 1.5 || RSI < 5.0) scalingRisk = 'severe';
  else if (LSI > 1.0 || RSI < 5.5) scalingRisk = 'high';
  else if (LSI > 0.5 || RSI < 6.2) scalingRisk = 'moderate';
  else if (LSI > 0) scalingRisk = 'low';
  else scalingRisk = 'none';

  // Pipe material recommendation
  let pipeRec: string;
  let designLife: number;
  if (corrosionRisk === 'severe' || input.h2s_detected) {
    pipeRec = 'HDPE PN16 or Stainless Steel 316L. GI steel prohibited. Mild steel prohibited.';
    designLife = 50; // HDPE
  } else if (corrosionRisk === 'high') {
    pipeRec = 'HDPE PN16 preferred. uPVC acceptable. GI steel will fail within 5-10 years.';
    designLife = 40;
  } else if (scalingRisk === 'severe' || scalingRisk === 'high') {
    pipeRec = 'Stainless Steel 304/316 or uPVC. Periodic acid flushing required. Avoid narrow-slot screens.';
    designLife = 30;
  } else if (corrosionRisk === 'moderate') {
    pipeRec = 'uPVC Class 12+ or HDPE. GI acceptable with 10-15mm corrosion allowance.';
    designLife = 30;
  } else {
    pipeRec = 'uPVC, HDPE, or GI (galvanized iron) all acceptable. Standard materials.';
    designLife = 25;
  }

  // Iron bacteria risk (Cullimore, 2007: Iron-Related Bacteria)
  // ISQ = [Fe²⁺]² / [O₂] — if > 1, high risk
  const Fe = input.iron_mgL ?? 0;
  const DO = input.dissolvedOxygen_mgL ?? 5;
  const ISQ = (Fe * Fe) / Math.max(0.1, DO);
  let ironBacRisk: string;
  if (Fe > 0.3 && ISQ > 1) {
    ironBacRisk = `HIGH (ISQ=${ISQ.toFixed(2)}). Iron bacteria will colonize screen within 6-18 months. Require periodic chlorination and jetting.`;
    treatmentRequired.push('Iron removal: aeration + sand filter or catalytic media (Birm/Greensand)');
    warnings.push(`Iron bacteria risk HIGH (Fe=${Fe}mg/L, ISQ=${ISQ.toFixed(1)}). Screen clogging expected. Include biocide in development plan.`);
  } else if (Fe > 0.3) {
    ironBacRisk = `MODERATE (Fe=${Fe}mg/L). Periodic jetting recommended every 2-3 years.`;
    treatmentRequired.push('Iron treatment may be needed (Fe > 0.3 mg/L WHO guideline)');
  } else {
    ironBacRisk = 'LOW. No significant iron bacteria risk.';
  }

  // Manganese check
  if ((input.manganese_mgL ?? 0) > 0.1) {
    warnings.push(`Manganese ${input.manganese_mgL}mg/L exceeds WHO guideline (0.1mg/L). Oxidation filter required.`);
    treatmentRequired.push('Manganese removal: oxidation + filtration');
  }

  // Salinity classification (ASTM D4382)
  let salinityClass: string;
  if (TDS < 500) salinityClass = 'Fresh (<500 mg/L). Suitable for drinking.';
  else if (TDS < 1000) salinityClass = 'Fresh-Brackish (500-1000 mg/L). Potable with treatment.';
  else if (TDS < 3000) salinityClass = 'Brackish (1000-3000 mg/L). Requires desalination for drinking.';
  else if (TDS < 10000) salinityClass = 'Moderately saline (3000-10000 mg/L). RO required.';
  else if (TDS < 35000) salinityClass = 'Saline (10000-35000 mg/L). Only suitable for industrial use.';
  else salinityClass = 'Brine (>35000 mg/L). Not usable without major desalination.';

  // Ionic strength: I = 0.5 × Σ(Ci × Zi²)  — simplified from TDS
  // Approximation: I ≈ 2.5 × 10⁻⁵ × TDS (Langelier)
  const ionicStrength = Math.round(2.5e-5 * TDS * 1000) / 1000;

  // Fluoride check
  if ((input.fluoride_mgL ?? 0) > 1.5) {
    warnings.push(`Fluoride ${input.fluoride_mgL}mg/L exceeds WHO guideline (1.5mg/L). Defluorination required.`);
    treatmentRequired.push('Defluorination: activated alumina or bone char filter');
  }

  // Arsenic check
  if ((input.arsenic_ugL ?? 0) > 10) {
    warnings.push(`Arsenic ${input.arsenic_ugL}μg/L exceeds WHO guideline (10μg/L). Arsenic removal system required.`);
    treatmentRequired.push('Arsenic removal: co-precipitation with Fe³⁺ or adsorption (GFH/GFO media)');
  }

  // Nitrate check
  if ((input.nitrate_mgL ?? 0) > 50) {
    warnings.push(`Nitrate ${input.nitrate_mgL}mg/L exceeds WHO guideline (50mg/L as NO₃). Source investigation required.`);
    treatmentRequired.push('Nitrate removal: ion exchange or biological denitrification');
  }

  // Sulfate check
  if ((input.sulfate_mgL ?? 0) > 250) {
    warnings.push(`Sulfate ${input.sulfate_mgL}mg/L exceeds WHO aesthetic guideline (250mg/L). Taste/laxative issues.`);
  }
  if ((input.sulfate_mgL ?? 0) > 1500) {
    warnings.push(`Sulfate ${input.sulfate_mgL}mg/L — use sulfate-resistant cement (Type V / SRPC) for borehole grouting.`);
  }

  // H2S
  if (input.h2s_detected) {
    warnings.push('Hydrogen sulfide (H₂S) detected. Highly corrosive to steel. Odor complaints likely. Aeration treatment required.');
    treatmentRequired.push('H₂S removal: aeration tower or catalytic carbon filter');
  }

  return {
    langelierSaturationIndex: LSI,
    langelierInterpretation: lsiInterp,
    ryznarStabilityIndex: RSI,
    ryznarInterpretation: rsiInterp,
    aggressiveIndex: AI,
    aggressiveInterpretation: aiInterp,
    corrosionRisk,
    scalingRisk,
    pipeRecommendation: pipeRec,
    designLife_years: designLife,
    ironBacteriaRisk: ironBacRisk,
    salinityClass,
    ionicStrength,
    treatmentRequired,
    warnings,
  };
}

// ════════════════════════════════════════════════════════════
// 2. NPSH (Net Positive Suction Head) CALCULATION
//    NPSH_a = Patm/ρg - h_lift - hf - Pvapor/ρg
//    ANSI/HI 9.6.1: NPSH_a > NPSH_r + 0.5m margin
// ════════════════════════════════════════════════════════════

export interface NPSHResult {
  npshAvailable_m: number;
  npshRequired_m: number;
  npshMargin_m: number;
  isSafe: boolean;
  cavitationRisk: 'none' | 'low' | 'moderate' | 'high';
  atmosphericPressure_kPa: number;
  vaporPressure_kPa: number;
  recommendation: string;
}

/**
 * NPSH calculation per ANSI/HI 9.6.1
 * @param elevation_m Site elevation above sea level
 * @param waterTemp_C Water temperature
 * @param pumpDepth_m Pump installation depth below ground level
 * @param dynamicWL_m Dynamic water level (meters below ground)
 * @param frictionLoss_m Total friction loss in suction line
 * @param pumpMinFlow_m3hr Minimum recommended flow for pump (below → overheating)
 * @param designFlow_m3hr Actual design flow
 */
export function computeNPSH(
  elevation_m: number,
  waterTemp_C: number,
  pumpDepth_m: number,
  dynamicWL_m: number,
  frictionLoss_m: number,
  pumpMinFlow_m3hr: number,
  designFlow_m3hr: number
): NPSHResult {
  // Atmospheric pressure decreases ~1.2 kPa per 100m elevation
  const Patm_kPa = 101.325 * Math.pow(1 - 2.25577e-5 * elevation_m, 5.25588);
  const Patm_m = Patm_kPa / 9.81; // meters of water head

  // Vapor pressure of water (Antoine equation approximation)
  // Pvap = 10^(8.07131 - 1730.63/(233.426 + T)) mmHg → convert to kPa
  const Pvap_mmHg = Math.pow(10, 8.07131 - 1730.63 / (233.426 + waterTemp_C));
  const Pvap_kPa = Pvap_mmHg * 0.133322;
  const Pvap_m = Pvap_kPa / 9.81;

  // For submersible pump: it sits BELOW the dynamic water level
  // So submersion = pumpDepth - dynamicWL (positive = submerged = good)
  const submersion_m = pumpDepth_m - dynamicWL_m;

  // NPSH_available = Patm/ρg + submersion - friction_loss - Pvap/ρg
  const NPSH_a = Patm_m + submersion_m - frictionLoss_m - Pvap_m;

  // NPSH_required typical for submersible pumps: 2-5m depending on design
  // Conservative: use 3m for standard, 5m for high-capacity
  const NPSH_r = designFlow_m3hr > 15 ? 5.0 : designFlow_m3hr > 5 ? 3.5 : 2.5;

  const margin = NPSH_a - NPSH_r;
  let cavRisk: NPSHResult['cavitationRisk'];
  let recommendation: string;

  if (margin > 3) {
    cavRisk = 'none';
    recommendation = `NPSH margin ${margin.toFixed(1)}m > 3m. No cavitation risk. Pump installation depth adequate.`;
  } else if (margin > 1) {
    cavRisk = 'low';
    recommendation = `NPSH margin ${margin.toFixed(1)}m. Acceptable but monitor for vibration/noise at startup.`;
  } else if (margin > 0) {
    cavRisk = 'moderate';
    recommendation = `NPSH margin only ${margin.toFixed(1)}m. Risk of intermittent cavitation at peak flow. Consider deeper pump setting or reducing flow rate.`;
  } else {
    cavRisk = 'high';
    recommendation = `NPSH DEFICIT of ${Math.abs(margin).toFixed(1)}m. PUMP WILL CAVITATE. Deepen pump by at least ${(Math.abs(margin) + 2).toFixed(0)}m or reduce flow.`;
  }

  // Min flow check
  if (designFlow_m3hr < pumpMinFlow_m3hr * 0.8) {
    recommendation += ` WARNING: Design flow (${designFlow_m3hr} m³/hr) below pump minimum (${pumpMinFlow_m3hr} m³/hr). Pump motor overheating risk.`;
    cavRisk = 'high';
  }

  return {
    npshAvailable_m: Math.round(NPSH_a * 100) / 100,
    npshRequired_m: NPSH_r,
    npshMargin_m: Math.round(margin * 100) / 100,
    isSafe: margin > 0.5,
    cavitationRisk: cavRisk,
    atmosphericPressure_kPa: Math.round(Patm_kPa * 10) / 10,
    vaporPressure_kPa: Math.round(Pvap_kPa * 100) / 100,
    recommendation,
  };
}

// ════════════════════════════════════════════════════════════
// 3. ANNULAR GROUT / CEMENT VOLUME CALCULATION
//    V = π(R_hole² - R_casing²) × depth × waste_factor
//    Per API RP 65 — Cementing practices
// ════════════════════════════════════════════════════════════

export interface GroutDesignResult {
  groutVolume_m3: number;
  groutVolume_liters: number;
  cementBags_50kg: number;
  bentoniteBags_25kg: number;
  waterVolume_liters: number;
  groutType: string;
  mixRatio: string;
  compressiveStrength_28day_MPa: number;
  waitOnCement_hours: number;
  placementMethod: string;
  sealDepth_m: [number, number];
  specification: string;
  warnings: string[];
}

export function computeGroutDesign(
  boreholeRadius_m: number,
  casingRadius_m: number,
  sealFromDepth_m: number,
  sealToDepth_m: number,
  sulfateLevel_mgL: number,
  aquiferConfined: boolean
): GroutDesignResult {
  const warnings: string[] = [];

  // Annular volume
  const annularArea = Math.PI * (boreholeRadius_m ** 2 - casingRadius_m ** 2);
  const sealLength = sealToDepth_m - sealFromDepth_m;
  const netVolume = annularArea * sealLength;
  const wasteFactor = 1.25; // 25% excess for washouts, irregularities (API RP 65)
  const totalVolume = netVolume * wasteFactor;

  // Cement type selection
  let cementType: string;
  let compStr: number;
  if (sulfateLevel_mgL > 1500) {
    cementType = 'Type V (High Sulfate Resistant) + 5% bentonite';
    compStr = 18;
    warnings.push('Sulfate-resistant cement (Type V / SRPC) required due to high sulfate groundwater.');
  } else if (sulfateLevel_mgL > 250) {
    cementType = 'Type II (Moderate Sulfate Resistant) + 3-5% bentonite';
    compStr = 20;
  } else {
    cementType = 'Type I Portland + 3-5% bentonite';
    compStr = 22;
  }

  // Mix ratio: w/c = 0.46, bentonite 3-5% by weight of cement
  // 1 bag (50kg) cement + 23L water + 1.5-2.5kg bentonite → ~37L grout
  const groutYieldPerBag_L = 37;
  const totalVolumeLiters = totalVolume * 1000;
  const cementBags = Math.ceil(totalVolumeLiters / groutYieldPerBag_L);
  const waterLiters = Math.round(cementBags * 23);
  const bentoniteBags = Math.ceil(cementBags * 2 / 25); // 2kg per bag cement, 25kg bags

  // Minimum seal for confined aquifers (WHO 2006, BGS guidelines)
  if (aquiferConfined && sealLength < 6) {
    warnings.push(`Sanitary seal length (${sealLength}m) below 6m minimum for confined aquifers. Extend seal to prevent cross-contamination.`);
  }
  if (sealLength < 3) {
    warnings.push(`Sanitary seal length (${sealLength}m) below absolute minimum (3m). Contamination risk HIGH.`);
  }

  // WOC time based on temperature (assume 20°C for tropical, longer for cold)
  const wocHours = 24; // 24hr minimum per API

  return {
    groutVolume_m3: Math.round(totalVolume * 1000) / 1000,
    groutVolume_liters: Math.round(totalVolumeLiters),
    cementBags_50kg: cementBags,
    bentoniteBags_25kg: bentoniteBags,
    waterVolume_liters: waterLiters,
    groutType: cementType,
    mixRatio: 'w/c = 0.46, bentonite 3-5% by weight of cement',
    compressiveStrength_28day_MPa: compStr,
    waitOnCement_hours: wocHours,
    placementMethod: sealToDepth_m > 30 ? 'Tremie pipe (bottom-up placement)' : 'Gravity pour with tremie verification',
    sealDepth_m: [sealFromDepth_m, sealToDepth_m],
    specification: 'API RP 65 / ASTM C150. Minimum 3.5 MPa at 24hr, ≥' + compStr + ' MPa at 28 days.',
    warnings,
  };
}

// ════════════════════════════════════════════════════════════
// 4. ENVIRONMENTAL SETBACK CALCULATIONS
//    Distance-based AND travel-time-based (Freeze & Cherry 1979)
// ════════════════════════════════════════════════════════════

export interface SetbackSource {
  type: string;
  baseSetback_m: number;
  adjustedSetback_m: number;
  /** The (assumed or surveyed) distance from the borehole to this source.
   *  Previously never stored, so the report's "Actual (m)" column echoed the
   *  minimum setback and contradicted its own risk text. */
  estimatedDistance_m: number;
  travelTime_days: number;
  isCompliant: boolean;
  regulation: string;
  riskIfNonCompliant: string;
}

export interface SetbackAnalysis {
  sources: SetbackSource[];
  overallCompliance: boolean;
  vulnerabilityClass: 'very_high' | 'high' | 'moderate' | 'low';
  eiaRequired: boolean;
  eiaThreshold_m3day: number;
  abstractionPermitRequired: boolean;
  protectedAreaFlag: boolean;
  recommendations: string[];
}

/**
 * Aquifer vulnerability classification (Foster et al., 2002 — GOD method)
 * G = Groundwater occurrence (confined=1, semi=2, unconfined=3)
 * O = Overall lithology of vadose zone (clay=1, silt=2, sand=3, gravel=4, karst=5)
 * D = Depth to water table (>50m=1, 20-50=2, 5-20=3, <5=4)
 */
function classifyVulnerability(
  aquiferType: string,
  vadoseLithology: string,
  depthToWater_m: number
): SetbackAnalysis['vulnerabilityClass'] {
  // AUDIT FIX (2026-07-10): Foster's GOD method rates each factor on a 0-1
  // scale (product also 0-1) -- the old ordinal 1-3/1-5/1-4 product with a
  // homemade >=36/>=18/>=6 ladder was not Foster and over-classified (e.g.
  // unconfined+sand+15m: Foster ~0.29 moderate, old code "high").
  const G = aquiferType.toLowerCase().includes('confined') ? 0.2 :
    aquiferType.toLowerCase().includes('semi') ? 0.4 : 0.9; // unconfined
  const litho = vadoseLithology.toLowerCase();
  const O = litho.includes('clay') ? 0.4 : litho.includes('silt') ? 0.5 :
    litho.includes('sand') ? 0.7 :
    litho.includes('gravel') ? 0.8 :
    litho.includes('karst') || litho.includes('limestone') ? 0.9 : 0.6;
  const D = depthToWater_m > 50 ? 0.6 : depthToWater_m > 20 ? 0.7 : depthToWater_m > 5 ? 0.8 : 0.9;
  const GOD = G * O * D; // 0-1 per Foster et al. (2002)
  if (GOD >= 0.7) return 'very_high';
  if (GOD >= 0.5) return 'high';
  if (GOD >= 0.3) return 'moderate';
  return 'low';
}

/**
 * Contaminant travel time: t = d × n / (K × i)
 * d = distance, n = effective porosity, K = hydraulic conductivity, i = gradient
 * Freeze & Cherry (1979), Fetter (2001)
 */
function computeTravelTime(
  distance_m: number,
  K_m_day: number,
  gradient: number,
  porosity: number
): number {
  const velocity_m_day = (K_m_day * gradient) / porosity;
  return velocity_m_day > 0 ? distance_m / velocity_m_day : 999999;
}

// WHO / EPA setback distance tables (by vulnerability class)
const SETBACK_MATRIX: Record<string, Record<string, number>> = {
  // Source type → vulnerability class → minimum setback (m)
  septic_tank:    { very_high: 75,  high: 50, moderate: 30, low: 15 },
  pit_latrine:    { very_high: 100, high: 75, moderate: 50, low: 30 },
  sewage_works:   { very_high: 400, high: 250, moderate: 150, low: 100 },
  livestock:      { very_high: 300, high: 200, moderate: 150, low: 100 },
  cemetery:       { very_high: 250, high: 150, moderate: 100, low: 50 },
  landfill:       { very_high: 1000, high: 700, moderate: 500, low: 300 },
  fuel_station:   { very_high: 500, high: 300, moderate: 200, low: 100 },
  industrial:     { very_high: 800, high: 500, moderate: 300, low: 200 },
  agriculture:    { very_high: 500, high: 300, moderate: 200, low: 100 },
  mining:         { very_high: 1000, high: 700, moderate: 500, low: 300 },
  sewage:         { very_high: 400, high: 250, moderate: 150, low: 100 },
  factory:        { very_high: 800, high: 500, moderate: 300, low: 200 },
};

export function computeSetbackAnalysis(
  contaminationSources: { type: string; estimatedDistance_m: number }[],
  aquiferType: string,
  vadoseLithology: string,
  depthToWater_m: number,
  K_m_day: number,
  gradient: number,
  porosity: number,
  yield_m3day: number,
  countryCode?: string,
): SetbackAnalysis {
  const vulnClass = classifyVulnerability(aquiferType, vadoseLithology, depthToWater_m);
  const recommendations: string[] = [];
  const sources: SetbackSource[] = [];
  let overallCompliant = true;

  for (const src of contaminationSources) {
    const srcType = src.type.toLowerCase().replace(/\s+/g, '_');
    const matrix = SETBACK_MATRIX[srcType] ?? SETBACK_MATRIX['industrial'];
    const minSetback = matrix[vulnClass] ?? 200;

    // Travel time calculation
    const travelDays = computeTravelTime(src.estimatedDistance_m, K_m_day, gradient, porosity);

    // Gradient direction adjustment: if source is up-gradient, risk is HIGHER
    // Minimum 50-day travel time for pathogen die-off (WHO 2006)
    const isCompliant = src.estimatedDistance_m >= minSetback && travelDays >= 50;
    if (!isCompliant) overallCompliant = false;

    sources.push({
      type: src.type,
      baseSetback_m: minSetback,
      adjustedSetback_m: minSetback,
      estimatedDistance_m: src.estimatedDistance_m,
      travelTime_days: Math.round(travelDays),
      isCompliant,
      regulation: `WHO (2006) + GOD vulnerability class: ${vulnClass}`,
      riskIfNonCompliant: !isCompliant
        ? travelDays < 50
          ? `Travel time ${Math.round(travelDays)} days < 50-day pathogen survival threshold. Contamination probable.`
          : `Distance ${src.estimatedDistance_m}m < ${minSetback}m minimum for ${vulnClass} vulnerability aquifer.`
        : 'Compliant — within acceptable limits.',
    });
  }

  // EIA threshold (varies by country, typical 100-500 m³/day)
  const EIA_THRESHOLDS: Record<string, number> = {
    'ZA': 100, 'KE': 500, 'NG': 200, 'TZ': 300, 'UG': 200,
    'IN': 100, 'US': 1000, 'GB': 200, 'AU': 500, 'DEFAULT': 200,
  };
  const eiaThreshold = EIA_THRESHOLDS[countryCode?.toUpperCase() ?? ''] ?? EIA_THRESHOLDS['DEFAULT'];
  const eiaRequired = yield_m3day > eiaThreshold;
  const permitRequired = yield_m3day > eiaThreshold * 0.5; // Typically permit required at lower threshold

  if (eiaRequired) {
    recommendations.push(`Abstraction ${Math.round(yield_m3day)} m³/day exceeds EIA threshold (${eiaThreshold} m³/day for ${countryCode ?? 'this region'}). Environmental Impact Assessment REQUIRED.`);
  }
  if (permitRequired) {
    recommendations.push(`Groundwater abstraction permit likely required for ${Math.round(yield_m3day)} m³/day. Contact water authority.`);
  }
  if (!overallCompliant) {
    recommendations.push('One or more contamination sources fail setback requirements. Consider alternative site or deeper casing seal.');
  }
  if (vulnClass === 'very_high' || vulnClass === 'high') {
    recommendations.push(`Aquifer vulnerability is ${vulnClass.toUpperCase()}. Enhanced wellhead protection zone required (minimum 50m radius).`);
  }

  return {
    sources,
    overallCompliance: overallCompliant,
    vulnerabilityClass: vulnClass,
    eiaRequired,
    eiaThreshold_m3day: eiaThreshold,
    abstractionPermitRequired: permitRequired,
    protectedAreaFlag: false, // Would need GIS data
    recommendations,
  };
}

// ════════════════════════════════════════════════════════════
// 5. DRILLING METHOD SELECTION & TIMELINE
// ════════════════════════════════════════════════════════════

export interface DrillingPlan {
  primaryMethod: string;
  alternativeMethod: string;
  methodology: string;
  rigType: string;
  rigCapacity_m: number;
  bitType: string;
  drillingFluid: string;
  fluidVolume_liters: number;
  penetrationRate_m_hr: [number, number]; // [min, max]
  estimatedDays: [number, number];
  mobilizationDays: number;
  timeline: { phase: string; duration_days: [number, number]; description: string }[];
  safetyRequirements: string[];
  artesianRisk: boolean;
  artesianPrecautions: string[];
  estimatedFuelConsumption_liters: number;
  crewSize: number;
  warnings: string[];
}

export function computeDrillingPlan(
  depth_m: number,
  primaryRock: string,
  soilType: string,
  aquiferType: string,
  swl_m: number,
  boreholeDiameter_mm: number,
  isRemoteSite: boolean
): DrillingPlan {
  const warnings: string[] = [];
  const rock = primaryRock.toLowerCase();
  const soil = soilType.toLowerCase();

  // Rock hardness classification
  const isHardRock = ['granite', 'basalt', 'gneiss', 'quartzite', 'dolerite', 'rhyolite', 'diorite', 'gabbro'].some(r => rock.includes(r));
  const isMediumRock = ['sandstone', 'limestone', 'dolomite', 'schist', 'marble', 'slate', 'shale'].some(r => rock.includes(r));
  const isSoft = ['alluvium', 'sand', 'clay', 'laterite', 'silt', 'gravel', 'loam'].some(r => rock.includes(r) || soil.includes(r));
  const isKarst = ['limestone', 'dolomite', 'karst', 'chalk'].some(r => rock.includes(r));

  // Method selection
  let method: string, altMethod: string, methodology: string, rigType: string;
  let bitType: string, fluid: string, penRate: [number, number];
  let rigCap: number;

  if (isHardRock) {
    method = 'Down-The-Hole (DTH) Air Hammer';
    altMethod = 'Rotary (tricone) with foam if water ingress >5 L/s';
    methodology = 'DTH percussion with compressed air flush. Produces dry cuttings for accurate lithological logging. Air compressor must deliver ≥17 bar at bit face.';
    rigType = depth_m > 150 ? 'Truck-mounted rotary/DTH (e.g., Schramm T685, Atlas Copco CT20)' : 'Truck-mounted DTH (e.g., Ingersoll Rand T4W, Atlas Copco RD20)';
    rigCap = depth_m > 150 ? 300 : 200;
    bitType = `DTH hammer bit ${boreholeDiameter_mm}mm (carbide button — flat face for granite, concave for weathered rock)`;
    fluid = 'Compressed air (oil-free). Add foam (0.5-1% biodegradable surfactant) if water ingress significant.';
    penRate = [2, 8]; // m/hr in hard rock
  } else if (isMediumRock) {
    method = 'Rotary (tricone roller cone)';
    altMethod = 'DTH if formation very hard or abrasive';
    methodology = 'Rotary drilling with mud or foam flush. Tricone bit for variable hardness. Monitor torque for formation changes.';
    rigType = 'Truck-mounted rotary (e.g., Massenza MI8, Prakla RB50)';
    rigCap = 200;
    bitType = `Tricone roller cone ${boreholeDiameter_mm}mm (insert type for medium-hard, milled tooth for soft sections)`;
    fluid = 'Bentonite drilling mud (spec gravity 1.05-1.10, Marsh funnel 40-50 sec). Use polymer (PAC) for aquifer sections to reduce formation damage.';
    penRate = [5, 15];
  } else {
    method = 'Mud Rotary (direct circulation)';
    altMethod = 'Reverse circulation if diameter >12" or collapse-prone sand';
    methodology = 'Direct rotary with bentonite drilling mud. Maintain positive mud head for hole stability. Switch to polymer for aquifer zone to minimize skin damage.';
    rigType = depth_m > 100 ? 'Truck-mounted rotary (e.g., Massenza MI12, Dando Watertec 24/30)' : 'Light truck/trailer rotary (e.g., Dando Mintec 12)';
    rigCap = depth_m > 100 ? 200 : 120;
    bitType = `Drag bit (3-wing or 4-wing) ${boreholeDiameter_mm}mm for overburden; PDC if cemented layers`;
    fluid = 'Bentonite drilling mud (spec gravity 1.05-1.15). Add polymer if sands collapse. Reduce mud weight for aquifer zone.';
    penRate = [8, 25];
  }

  // Fluid volume: ~1.5× borehole volume + 20% losses
  const boreholeVolume_L = Math.PI * (boreholeDiameter_mm / 2000) ** 2 * depth_m * 1000;
  const fluidVol = Math.round(boreholeVolume_L * 1.5 * 1.2);

  // Timeline
  const drillingHours: [number, number] = [depth_m / penRate[1], depth_m / penRate[0]];
  const drillingDays: [number, number] = [Math.ceil(drillingHours[0] / 8), Math.ceil(drillingHours[1] / 8)]; // 8hr productive day

  const timeline: DrillingPlan['timeline'] = [
    { phase: 'Mobilization', duration_days: [isRemoteSite ? 2 : 1, isRemoteSite ? 4 : 2], description: 'Rig transport, site preparation, water supply setup' },
    { phase: 'Surface casing', duration_days: [0.5, 1], description: `Install conductor/surface casing to ${Math.round(depth_m * 0.1)}m. Grout annulus.` },
    { phase: 'Main drilling', duration_days: drillingDays, description: `Drill ${boreholeDiameter_mm}mm hole to ${depth_m}m. Log cuttings every 1m. Record water strikes.` },
    { phase: 'Geophysical logging', duration_days: [0.5, 1], description: 'Caliper, gamma, resistivity, SP, temperature logs (if available).' },
    { phase: 'Casing & screen installation', duration_days: [0.5, 1], description: 'Lower casing string with centralizers. Install screen in aquifer zone.' },
    { phase: 'Gravel packing', duration_days: [0.5, 1], description: 'Place gravel pack around screen. Verify with caliper/tagged depth.' },
    { phase: 'Grouting/sealing', duration_days: [1, 1.5], description: 'Tremie grout annulus above gravel pack. Wait on cement 24hr minimum.' },
    { phase: 'Well development', duration_days: [1, 2], description: 'Airlift/surge until sand <5mg/L and yield stable.' },
    { phase: 'Pump test', duration_days: [2, 3], description: 'Step test (4-5 steps × 1hr) + 24hr constant-rate test + recovery.' },
    { phase: 'Disinfection & sampling', duration_days: [1, 1.5], description: 'Chlorinate (50ppm × 24hr), flush, collect water samples for lab.' },
    { phase: 'Completion', duration_days: [0.5, 1], description: 'Install pump, headworks, concrete apron, drainage channel.' },
    { phase: 'Demobilization', duration_days: [isRemoteSite ? 1 : 0.5, isRemoteSite ? 2 : 1], description: 'Clean site, remove equipment.' },
  ];

  const totalMin = timeline.reduce((s, t) => s + t.duration_days[0], 0);
  const totalMax = timeline.reduce((s, t) => s + t.duration_days[1], 0);

  // Artesian risk
  const artesian = aquiferType.toLowerCase().includes('confined') && swl_m < 2;
  const artesianPrec: string[] = [];
  if (artesian) {
    artesianPrec.push('Install flow diverter / wellhead control valve before penetrating aquifer.');
    artesianPrec.push('Prepare emergency shut-off supplies (bentonite plugs, cement).');
    artesianPrec.push('Never leave artesian borehole unattended during drilling.');
    warnings.push('ARTESIAN CONDITIONS LIKELY. Pre-plan flow control equipment.');
  }

  // Karst risk
  if (isKarst) {
    warnings.push('KARST TERRAIN: Risk of sudden void intersection, casing collapse, and lost circulation. Have casing ready and cement for emergency sealing. Limit drill rate in known cavity zones.');
  }

  // Fuel estimate: ~40-80 L/hr for truck-mounted rig
  const fuelRate = isHardRock ? 70 : isMediumRock ? 55 : 40; // L/hr
  const drillingHoursAvg = (drillingHours[0] + drillingHours[1]) / 2;
  const totalFuel = Math.round((drillingHoursAvg + 20) * fuelRate); // +20hr for non-drilling operations

  return {
    primaryMethod: method,
    alternativeMethod: altMethod,
    methodology,
    rigType,
    rigCapacity_m: rigCap,
    bitType,
    drillingFluid: fluid,
    fluidVolume_liters: fluidVol,
    penetrationRate_m_hr: penRate,
    estimatedDays: [Math.ceil(totalMin), Math.ceil(totalMax)],
    mobilizationDays: isRemoteSite ? 3 : 1,
    timeline,
    safetyRequirements: [
      'Hard hat, safety boots, eye protection, ear protection for all personnel',
      'Fire extinguisher on rig (CO₂ + dry powder)',
      'First aid kit with snake bite kit (if applicable)',
      'Emergency communication equipment (if remote)',
      'Spill containment for fuel and drilling fluids',
      'Safe operating radius: 5m clear zone around mast',
      'Mast must be fully raised or fully lowered — never left partially raised',
      ...(artesian ? ['Artesian flow control equipment'] : []),
    ],
    artesianRisk: artesian,
    artesianPrecautions: artesianPrec,
    estimatedFuelConsumption_liters: totalFuel,
    crewSize: isHardRock ? 4 : 3,
    warnings,
  };
}

// ════════════════════════════════════════════════════════════
// 6. DEMAND ANALYSIS & SUSTAINABILITY
// ════════════════════════════════════════════════════════════

export interface DemandAnalysis {
  currentPopulation: number;
  projectedPopulation_10yr: number;
  projectedPopulation_20yr: number;
  dailyDemand_current_m3: number;
  dailyDemand_10yr_m3: number;
  dailyDemand_20yr_m3: number;
  yieldAdequacy_current: string;
  yieldAdequacy_10yr: string;
  yieldAdequacy_20yr: string;
  pumpingHoursPerDay: number;
  storageRequired_m3: number;
  sustainabilityAssessment: string;
  rechargeBalance_m3yr: number;
  graceTrend_interpretation: string;
  adaptationActions: string[];
}

export function computeDemandAnalysis(
  yield_m3hr: number,
  populationServed: number,
  growthRate_pct: number,
  perCapitaDemand_Lpd: number,
  annualRecharge_mm: number,
  catchmentArea_km2: number,
  graceTrend_cmYr?: number,
  pumpingHoursPerDay: number = 8,
): DemandAnalysis {
  // Population projections (geometric growth)
  const pop10 = Math.round(populationServed * Math.pow(1 + growthRate_pct / 100, 10));
  const pop20 = Math.round(populationServed * Math.pow(1 + growthRate_pct / 100, 20));

  // Daily demand
  const demand_now = populationServed * perCapitaDemand_Lpd / 1000; // m³/day
  const demand_10 = pop10 * perCapitaDemand_Lpd / 1000;
  const demand_20 = pop20 * perCapitaDemand_Lpd / 1000;

  // Available supply (m³/day based on pumping hours)
  const supply = yield_m3hr * pumpingHoursPerDay;

  // Adequacy
  const assess = (demand: number) =>
    supply >= demand * 1.5 ? 'ADEQUATE (>150% of demand)' :
      supply >= demand * 1.2 ? 'MARGINAL (120-150% of demand). Consider standby source.' :
        supply >= demand ? 'TIGHT (100-120% of demand). Additional source recommended.' :
          `INSUFFICIENT (supply ${supply.toFixed(0)} m³/day < demand ${demand.toFixed(0)} m³/day). Multiple boreholes required.`;

  // Storage: minimum 3 days supply for community water (WHO)
  const storage = Math.round(demand_now * 3);

  // Recharge balance
  const rechargeRate = (annualRecharge_mm / 1000) * catchmentArea_km2 * 1e6; // m³/yr
  const abstractionRate = supply * 365;
  const balance = rechargeRate - abstractionRate;

  // GRACE trend interpretation
  let graceInterp: string;
  const adaptations: string[] = [];
  if (graceTrend_cmYr !== undefined) {
    if (graceTrend_cmYr < -1) {
      graceInterp = `DECLINING (${graceTrend_cmYr} cm/yr). Groundwater storage depleting significantly. Yield may decrease 15-30% within 10 years.`;
      adaptations.push('Reduce abstraction rate or implement managed aquifer recharge (MAR).');
      adaptations.push('Drill deeper standby borehole (additional 20-30% depth) for future proofing.');
      adaptations.push('Implement rainwater harvesting to supplement groundwater.');
    } else if (graceTrend_cmYr < -0.3) {
      graceInterp = `SLIGHT DECLINE (${graceTrend_cmYr} cm/yr). Minor depletion trend. Monitor water levels quarterly.`;
      adaptations.push('Quarterly water level monitoring to detect early decline.');
    } else if (graceTrend_cmYr > 0.3) {
      graceInterp = `RISING (${graceTrend_cmYr} cm/yr). Groundwater levels recovering. Positive sustainability indicator.`;
    } else {
      graceInterp = `STABLE (${graceTrend_cmYr} cm/yr). No significant depletion trend. Sustainable within current extraction.`;
    }
  } else {
    graceInterp = 'No GRACE data available. Sustainability assessment limited to recharge balance.';
  }

  let sustainAssess: string;
  if (balance > abstractionRate * 0.5) {
    sustainAssess = 'SUSTAINABLE. Recharge greatly exceeds abstraction. Long-term viability confirmed.';
  } else if (balance > 0) {
    sustainAssess = 'LIKELY SUSTAINABLE. Recharge exceeds abstraction, but margin is narrow. Monitor trends.';
  } else {
    sustainAssess = `UNSUSTAINABLE at current rate. Abstraction (${Math.round(abstractionRate)} m³/yr) exceeds recharge (${Math.round(rechargeRate)} m³/yr). Aquifer mining occurring.`;
    adaptations.push('Reduce pumping rate to match recharge or find supplementary source.');
  }

  return {
    currentPopulation: populationServed,
    projectedPopulation_10yr: pop10,
    projectedPopulation_20yr: pop20,
    dailyDemand_current_m3: Math.round(demand_now * 10) / 10,
    dailyDemand_10yr_m3: Math.round(demand_10 * 10) / 10,
    dailyDemand_20yr_m3: Math.round(demand_20 * 10) / 10,
    yieldAdequacy_current: assess(demand_now),
    yieldAdequacy_10yr: assess(demand_10),
    yieldAdequacy_20yr: assess(demand_20),
    pumpingHoursPerDay,
    storageRequired_m3: storage,
    sustainabilityAssessment: sustainAssess,
    rechargeBalance_m3yr: Math.round(balance),
    graceTrend_interpretation: graceInterp,
    adaptationActions: adaptations,
  };
}

// ════════════════════════════════════════════════════════════
// 7. MONITORING & O&M PLAN
// ════════════════════════════════════════════════════════════

export interface MonitoringPlan {
  waterLevelMonitoring: { frequency: string; method: string; parameters: string[] };
  waterQualityMonitoring: { frequency: string; parameters: string[]; labRequirements: string };
  pumpPerformance: { frequency: string; checks: string[] };
  maintenanceSchedule: { task: string; frequency: string; estimatedCost_usd: number }[];
  emergencyProcedures: string[];
  annualMonitoringCost_usd: number;
  sparePartsInventory: string[];
  reportingRequirements: string[];
}

export function computeMonitoringPlan(
  yield_m3hr: number,
  pumpType: string,
  ironRisk: boolean,
  depth_m: number,
  countryMultiplier: number
): MonitoringPlan {
  const cm = countryMultiplier;

  const maintenanceItems: MonitoringPlan['maintenanceSchedule'] = [
    { task: 'Pump inspection & bearing check', frequency: 'Annual', estimatedCost_usd: Math.round(200 * cm) },
    { task: 'Water quality lab analysis (full chemical)', frequency: 'Annual', estimatedCost_usd: Math.round(250 * cm) },
    { task: 'Bacteriological test (E. coli + total coliforms)', frequency: 'Quarterly', estimatedCost_usd: Math.round(50 * cm) },
    { task: 'Water level measurement & logging', frequency: 'Monthly', estimatedCost_usd: Math.round(20 * cm) },
    { task: 'Wellhead integrity inspection', frequency: 'Quarterly', estimatedCost_usd: Math.round(30 * cm) },
    { task: 'Pump efficiency test (compare to baseline)', frequency: 'Annual', estimatedCost_usd: Math.round(150 * cm) },
    { task: 'Rising main/pipe inspection for leaks', frequency: 'Bi-annual', estimatedCost_usd: Math.round(100 * cm) },
    { task: 'Electrical system check (motor insulation, cable)', frequency: 'Annual', estimatedCost_usd: Math.round(80 * cm) },
  ];

  if (ironRisk) {
    maintenanceItems.push(
      { task: 'Screen jetting / chemical rehabilitation (iron bacteria)', frequency: 'Every 2-3 years', estimatedCost_usd: Math.round(800 * cm) },
      { task: 'Video inspection of screen condition', frequency: 'Every 3 years', estimatedCost_usd: Math.round(500 * cm) },
    );
  }

  if (pumpType.toLowerCase().includes('solar')) {
    maintenanceItems.push(
      { task: 'Solar panel cleaning', frequency: 'Monthly', estimatedCost_usd: Math.round(10 * cm) },
      { task: 'Controller/inverter inspection', frequency: 'Annual', estimatedCost_usd: Math.round(60 * cm) },
      { task: 'Battery replacement (if applicable)', frequency: 'Every 5-7 years', estimatedCost_usd: Math.round(400 * cm) },
    );
  }

  maintenanceItems.push(
    { task: 'Pump motor replacement', frequency: 'Every 8-12 years', estimatedCost_usd: Math.round(1500 * cm) },
    { task: 'Rising main replacement (HDPE)', frequency: 'Every 20-25 years', estimatedCost_usd: Math.round(depth_m * 15 * cm) },
  );

  const annualCost = maintenanceItems
    .filter(m => m.frequency.includes('Annual') || m.frequency.includes('Monthly') || m.frequency.includes('Quarterly'))
    .reduce((s, m) => {
      if (m.frequency.includes('Monthly')) return s + m.estimatedCost_usd * 12;
      if (m.frequency.includes('Quarterly')) return s + m.estimatedCost_usd * 4;
      return s + m.estimatedCost_usd;
    }, 0);

  return {
    waterLevelMonitoring: {
      frequency: 'Monthly (manual dip), continuous if data logger installed',
      method: 'Electric contact tape (dip meter) or pressure transducer with data logger',
      parameters: ['Static water level (m bgl)', 'Pumping water level (m bgl)', 'Recovery time (min)', 'Specific capacity trend'],
    },
    waterQualityMonitoring: {
      frequency: 'Bacteriological: quarterly. Full chemical: annually. Field parameters (pH/EC/T): monthly.',
      parameters: [
        'Field: pH, EC, temperature, turbidity',
        'Lab (annual): full major ions (Ca, Mg, Na, K, HCO₃, SO₄, Cl, NO₃)',
        'Lab (annual): trace metals (Fe, Mn, As, F)',
        'Lab (quarterly): E. coli, total coliforms',
        'Lab (baseline only): stable isotopes (δ¹⁸O, δ²H) if recharge source uncertain',
      ],
      labRequirements: 'ISO 17025 accredited laboratory. Chain of custody required for all samples.',
    },
    pumpPerformance: {
      frequency: 'Monthly visual check, annual performance test',
      checks: [
        'Flow rate at operating point (compare to baseline)',
        'Discharge pressure / head',
        'Motor current draw (compare to nameplate)',
        'Vibration / unusual noise',
        'Sand content of discharge (<5 mg/L)',
        'Specific capacity (Q/s) — if declining >10%, investigate screen clogging',
      ],
    },
    maintenanceSchedule: maintenanceItems,
    emergencyProcedures: [
      'If yield drops >30% suddenly → check for pump damage, screen collapse, or regional drawdown event',
      'If water turbidity increases → cease pumping, check for casing breach or gravel pack failure',
      'If E. coli detected → superchlorinate (200 ppm × 24hr), re-test. If persistent, investigate surface contamination pathway',
      'If pump fails → isolate electrical, arrange replacement. Do NOT operate motor with inadequate submersion (overheating risk)',
      'If water level drops below pump → shut down immediately. Running dry will destroy motor seals.',
      'If artesian pressure increases → ensure wellhead valve is functional. Call driller if uncontrolled flow.',
    ],
    annualMonitoringCost_usd: Math.round(annualCost),
    sparePartsInventory: [
      'Pump motor seal kit (2 sets)',
      'Pressure switch / control box',
      'Non-return valve (check valve)',
      `Rising main couplings (${yield_m3hr > 5 ? '75mm' : '50mm'}, 5 pieces)`,
      'Electrical cable splice kit',
      ...(pumpType.toLowerCase().includes('solar') ? ['Charge controller', 'MC4 connectors', 'Fuse holders'] : []),
      ...(ironRisk ? ['Jetting nozzle kit', 'Hydrochloric acid (10L) for chemical treatment'] : []),
    ],
    reportingRequirements: [
      'Monthly water level report (tabulated + trend graph)',
      'Quarterly bacteriological results with compliance status',
      'Annual performance report: yield trend, water quality trend, maintenance performed, costs',
      'Any water quality exceedance: immediate notification to health authority',
      'Five-year aquifer status review (compare current vs. baseline, project 10-year outlook)',
    ],
  };
}

// ════════════════════════════════════════════════════════════
// 8. LIFECYCLE COST ANALYSIS
// ════════════════════════════════════════════════════════════

export interface LifecycleCost {
  capitalCost: { item: string; cost_usd: [number, number] }[];
  totalCapital_usd: [number, number];
  annualOperating_usd: number;
  majorReplacements: { item: string; year: number; cost_usd: number }[];
  npv_20yr_usd: number;
  costPerM3_usd: number;
  contingency_pct: number;
  inflationRate_pct: number;
}

export function computeLifecycleCost(
  depth_m: number,
  drillingCostPerM: [number, number],
  pumpCost: [number, number],
  treatmentCost: number,
  yield_m3hr: number,
  annualOpCost: number,
  countryMultiplier: number,
  pumpingHoursPerDay: number = 8,
): LifecycleCost {
  const cm = countryMultiplier;
  const contingency = 0.20; // 20% contingency
  const inflation = 0.03; // 3% annual

  const capitalItems: LifecycleCost['capitalCost'] = [
    { item: 'Mobilization & site preparation', cost_usd: [Math.round(800 * cm), Math.round(2000 * cm)] },
    { item: `Drilling (${depth_m}m)`, cost_usd: [Math.round(depth_m * drillingCostPerM[0]), Math.round(depth_m * drillingCostPerM[1])] },
    { item: 'Casing & screen (supply + install)', cost_usd: [Math.round(depth_m * 25 * cm), Math.round(depth_m * 55 * cm)] },
    { item: 'Gravel pack (supply + install)', cost_usd: [Math.round(300 * cm), Math.round(800 * cm)] },
    { item: 'Cement/grout (sanitary seal)', cost_usd: [Math.round(200 * cm), Math.round(500 * cm)] },
    { item: 'Well development', cost_usd: [Math.round(500 * cm), Math.round(1200 * cm)] },
    { item: 'Pump test (step + 24hr constant rate)', cost_usd: [Math.round(800 * cm), Math.round(2000 * cm)] },
    { item: 'Pump, motor, controller', cost_usd: pumpCost },
    { item: 'Rising main + fittings', cost_usd: [Math.round(depth_m * 10 * cm), Math.round(depth_m * 20 * cm)] },
    { item: 'Wellhead completion (apron, fence, drainage)', cost_usd: [Math.round(400 * cm), Math.round(1200 * cm)] },
    { item: 'Water quality analysis (full lab)', cost_usd: [Math.round(200 * cm), Math.round(400 * cm)] },
    { item: 'Geophysical logging (if available)', cost_usd: [Math.round(300 * cm), Math.round(800 * cm)] },
  ];

  if (treatmentCost > 0) {
    capitalItems.push({ item: 'Water treatment system', cost_usd: [Math.round(treatmentCost * 0.8), Math.round(treatmentCost * 1.2)] });
  }

  const totalLow = capitalItems.reduce((s, i) => s + i.cost_usd[0], 0);
  const totalHigh = capitalItems.reduce((s, i) => s + i.cost_usd[1], 0);
  const totalWithContingency: [number, number] = [
    Math.round(totalLow * (1 + contingency)),
    Math.round(totalHigh * (1 + contingency)),
  ];

  // Major replacements over 20-year lifecycle
  const replacements: LifecycleCost['majorReplacements'] = [
    { item: 'Pump motor replacement', year: 10, cost_usd: Math.round(1500 * cm) },
    { item: 'Rising main replacement', year: 20, cost_usd: Math.round(depth_m * 15 * cm) },
    { item: 'Treatment media replacement', year: 5, cost_usd: Math.round(treatmentCost * 0.3) },
    { item: 'Treatment media replacement', year: 10, cost_usd: Math.round(treatmentCost * 0.3) },
    { item: 'Treatment media replacement', year: 15, cost_usd: Math.round(treatmentCost * 0.3) },
    { item: 'Wellhead refurbishment', year: 15, cost_usd: Math.round(500 * cm) },
  ];

  // NPV calculation (discount rate = 8% typical for developing countries)
  const discountRate = 0.08;
  let npv = (totalWithContingency[0] + totalWithContingency[1]) / 2; // Average capital cost

  for (let year = 1; year <= 20; year++) {
    const opCost = annualOpCost * Math.pow(1 + inflation, year);
    npv += opCost / Math.pow(1 + discountRate, year);
    const replacement = replacements.find(r => r.year === year);
    if (replacement) {
      npv += (replacement.cost_usd * Math.pow(1 + inflation, year)) / Math.pow(1 + discountRate, year);
    }
  }

  // Cost per m³
  const annualProduction = yield_m3hr * pumpingHoursPerDay * 365;
  const costPerM3 = annualProduction > 0 ? npv / (annualProduction * 20) : 0;

  return {
    capitalCost: capitalItems,
    totalCapital_usd: totalWithContingency,
    annualOperating_usd: Math.round(annualOpCost),
    majorReplacements: replacements.filter(r => r.cost_usd > 0),
    npv_20yr_usd: Math.round(npv),
    costPerM3_usd: Math.round(costPerM3 * 100) / 100,
    contingency_pct: contingency * 100,
    inflationRate_pct: inflation * 100,
  };
}

// ════════════════════════════════════════════════════════════
// 9. AQUIFER BOUNDARY DETECTION
//    Flags when Theis assumptions may not apply
// ════════════════════════════════════════════════════════════

export interface BoundaryAssessment {
  boundaryType: 'infinite' | 'recharge_boundary' | 'barrier_boundary' | 'leaky' | 'unconfined_delayed';
  confidence: 'confirmed' | 'suspected' | 'assumed';
  distanceToNearest_m?: number;
  correctionMethod: string;
  yieldAdjustmentFactor: number; // 1.0 = no change, >1 = more yield, <1 = less yield
  warnings: string[];
}

export function assessAquiferBoundaries(
  aquiferType: string,
  nearbyFeatures: { type: string; distance_m: number }[],
  pumpTestDuration_hr: number,
  transmissivity: number,
  storativity: number,
): BoundaryAssessment {
  const warnings: string[] = [];
  const aq = aquiferType.toLowerCase();

  // Check for nearby recharge boundaries (rivers, lakes)
  const rechargeFeature = nearbyFeatures.find(f =>
    ['river', 'stream', 'lake', 'reservoir', 'canal', 'dam'].some(w => f.type.toLowerCase().includes(w))
  );

  // Check for barrier boundaries (faults, impermeable contacts)
  const barrierFeature = nearbyFeatures.find(f =>
    ['fault', 'dyke', 'dike', 'impermeable', 'granite_contact', 'shear_zone'].some(w => f.type.toLowerCase().includes(w))
  );

  // Radius of influence at pump test duration
  const t_days = pumpTestDuration_hr / 24;
  const ROI = Math.sqrt(2.25 * transmissivity * t_days / storativity);

  let boundary: BoundaryAssessment;

  if (rechargeFeature && rechargeFeature.distance_m < ROI * 1.5) {
    boundary = {
      boundaryType: 'recharge_boundary',
      confidence: rechargeFeature.distance_m < ROI ? 'confirmed' : 'suspected',
      distanceToNearest_m: rechargeFeature.distance_m,
      correctionMethod: `Image well method (Theis mirroring). ${rechargeFeature.type} at ${rechargeFeature.distance_m}m acts as recharge boundary. Drawdown will stabilize sooner than Theis predicts.`,
      yieldAdjustmentFactor: 1.2, // Recharge boundary → more sustainable yield
      warnings: [`Recharge boundary (${rechargeFeature.type}) at ${rechargeFeature.distance_m}m. Steady-state may be reached during pump test. Theis analysis will UNDERESTIMATE sustainable yield.`],
    };
  } else if (barrierFeature && barrierFeature.distance_m < ROI * 2) {
    boundary = {
      boundaryType: 'barrier_boundary',
      confidence: barrierFeature.distance_m < ROI ? 'confirmed' : 'suspected',
      distanceToNearest_m: barrierFeature.distance_m,
      correctionMethod: `Image well method (barrier). ${barrierFeature.type} at ${barrierFeature.distance_m}m acts as no-flow boundary. Actual drawdown will be GREATER than Theis predicts.`,
      yieldAdjustmentFactor: 0.7, // Barrier → less yield
      warnings: [`No-flow boundary (${barrierFeature.type}) at ${barrierFeature.distance_m}m. Theis analysis will OVERESTIMATE sustainable yield by ~30%. Apply safety factor.`],
    };
  } else if (aq.includes('leaky') || aq.includes('semi')) {
    boundary = {
      boundaryType: 'leaky',
      confidence: 'suspected',
      correctionMethod: 'Hantush-Jacob (1955) leaky aquifer solution. Vertical leakage from confining layer provides additional recharge.',
      yieldAdjustmentFactor: 1.1,
      warnings: ['Leaky/semi-confined aquifer suspected. Theis analysis may slightly underestimate long-term yield due to vertical leakage.'],
    };
  } else if (aq.includes('unconfined') || aq.includes('water table')) {
    boundary = {
      boundaryType: 'unconfined_delayed',
      confidence: 'suspected',
      correctionMethod: 'Neuman (1975) delayed yield solution. Early time data uses elastic S, late time uses specific yield Sy.',
      yieldAdjustmentFactor: 1.0,
      warnings: ['Unconfined aquifer: delayed yield effect expected. Type-curve analysis should use Neuman method, not standard Theis.'],
    };
  } else {
    boundary = {
      boundaryType: 'infinite',
      confidence: 'assumed',
      correctionMethod: 'Standard Theis / Cooper-Jacob. No boundary effects detected within radius of influence.',
      yieldAdjustmentFactor: 1.0,
      warnings: [],
    };
  }

  if (ROI > 1000) {
    warnings.push(`Radius of influence ${Math.round(ROI)}m is very large. Other wells within this radius may experience interference.`);
  }

  boundary.warnings.push(...warnings);
  return boundary;
}

// ════════════════════════════════════════════════════════════
// 10. PUMP TEST PROTOCOL GENERATOR
// ════════════════════════════════════════════════════════════

export interface PumpTestProtocol {
  stepTest: {
    numberOfSteps: number;
    stepDuration_min: number;
    rates_m3hr: number[];
    measurements: string[];
    equipment: string[];
  };
  constantRateTest: {
    rate_m3hr: number;
    duration_hr: number;
    measurementSchedule: { time: string; frequency: string }[];
    equipment: string[];
  };
  recoveryTest: {
    duration_hr: number;
    measurementSchedule: { time: string; frequency: string }[];
  };
  observationWells: { distance_m: number; purpose: string }[];
  datasheets: string[];
  qualityControl: string[];
  reportRequirements: string[];
}

export function generatePumpTestProtocol(
  estimatedYield_m3hr: number,
  depth_m: number,
  aquiferType: string,
): PumpTestProtocol {
  // Step test: 5 steps at 25%, 50%, 75%, 100%, 125% of estimated yield
  const stepRates = [0.25, 0.50, 0.75, 1.00, 1.25].map(f => Math.round(estimatedYield_m3hr * f * 10) / 10);

  return {
    stepTest: {
      numberOfSteps: 5,
      stepDuration_min: 60,
      rates_m3hr: stepRates,
      measurements: [
        'Water level (m bgl) — at 0, 1, 2, 3, 4, 5, 7, 10, 15, 20, 30, 45, 60 min per step',
        'Flow rate (m³/hr) — confirm stable within ±5% using V-notch weir or electromagnetic flowmeter',
        'Discharge water: pH, EC, temperature, turbidity at start and end of each step',
        'Sand content (mg/L) — at end of each step using Imhoff cone',
      ],
      equipment: [
        'Electric dip meter (± 1mm accuracy)',
        'Data logger + pressure transducer (if available)',
        'V-notch weir or electromagnetic flowmeter (±2% accuracy)',
        'pH/EC/Temp multi-parameter meter (calibrated)',
        'Turbidity meter (NTU)',
        'Imhoff cone (1000mL) for sand content',
        'Stopwatch, measuring tape, data sheets',
        'Portable generator (if no mains power)',
        `Test pump rated for ${Math.round(estimatedYield_m3hr * 1.3)} m³/hr at ${Math.round(depth_m * 0.8)}m`,
      ],
    },
    constantRateTest: {
      rate_m3hr: Math.round(estimatedYield_m3hr * 0.8 * 10) / 10, // 80% of max step
      duration_hr: 24,
      measurementSchedule: [
        { time: '0-5 min', frequency: 'Every 30 seconds' },
        { time: '5-15 min', frequency: 'Every 1 minute' },
        { time: '15-60 min', frequency: 'Every 5 minutes' },
        { time: '1-3 hours', frequency: 'Every 15 minutes' },
        { time: '3-8 hours', frequency: 'Every 30 minutes' },
        { time: '8-24 hours', frequency: 'Every 60 minutes' },
      ],
      equipment: [
        'Same as step test',
        'Water discharge to approved disposal point (>30m from borehole)',
        '24-hour crew rotation schedule (2 shifts × 12 hours)',
        'Night lighting (if rural site)',
        'Water sample bottles (sterile, preserved) for lab analysis',
      ],
    },
    recoveryTest: {
      duration_hr: Math.min(24, Math.max(4, Math.round(depth_m * 0.1))),
      measurementSchedule: [
        { time: '0-5 min', frequency: 'Every 30 seconds' },
        { time: '5-30 min', frequency: 'Every 1 minute' },
        { time: '30-120 min', frequency: 'Every 5 minutes' },
        { time: '2+ hours', frequency: 'Every 15 minutes until >95% recovery' },
      ],
    },
    observationWells: [
      { distance_m: 10, purpose: 'Near-field storativity estimation' },
      { distance_m: 50, purpose: 'Transmissivity confirmation + boundary detection' },
      { distance_m: 200, purpose: 'Far-field interference assessment (if feasible)' },
    ],
    datasheets: [
      'Step test datasheet (time, water level, flow rate, field parameters)',
      'Constant-rate test datasheet (same columns + sand content)',
      'Recovery test datasheet (time since pump off, residual drawdown)',
      'Water sample chain-of-custody form',
      'Equipment calibration records',
      'Weather/rainfall record for test duration',
    ],
    qualityControl: [
      'Calibrate dip meter against known depth before test',
      'Calibrate flowmeter against volumetric method (timed bucket fill)',
      'Record barometric pressure hourly (correct for barometric efficiency if confined)',
      'Photograph setup, equipment, water discharge point',
      'Duplicate water samples: 1 field blank + 1 duplicate per batch',
    ],
    reportRequirements: [
      'Semi-log plot: drawdown vs. time (Theis analysis)',
      'Linear plot: drawdown vs. log(time) (Cooper-Jacob analysis)',
      's/Q vs. Q plot for step test (Jacob method — determine B and C)',
      'Recovery plot: residual drawdown vs. t/t\' (Theis recovery)',
      'Transmissivity (T) and Storativity (S) calculations with method stated',
      'Specific capacity at each step',
      'Well efficiency at each step',
      'Recommended sustainable yield (≤80% of maximum step test yield)',
      'Full water quality results with WHO comparison table',
    ],
  };
}

// ════════════════════════════════════════════════════════════
// 11. WELLHEAD COMPLETION SPECIFICATION
// ════════════════════════════════════════════════════════════

export interface WellheadSpec {
  type: string;
  apron: { material: string; dimensions_m: string; slope_pct: number; thickness_mm: number };
  drainage: string;
  fencing: { type: string; radius_m: number; height_m: number };
  lockableCap: string;
  ventPipe: string;
  samplingPort: boolean;
  pressureGauge: boolean;
  flowMeter: boolean;
  nonReturnValve: boolean;
  sanitaryCompletion: string[];
}

export function computeWellheadSpec(pumpType: string, yield_m3hr: number): WellheadSpec {
  const isHandPump = pumpType.toLowerCase().includes('hand') || pumpType.toLowerCase().includes('manual');
  const isCommunity = yield_m3hr < 2;

  return {
    type: isHandPump ? 'India Mark III / Afridev pedestal with concrete apron' : 'Steel headplate with flanged connections and lockable cover',
    apron: {
      material: 'Reinforced concrete (C25/30, 6mm rebar mesh)',
      dimensions_m: '3m × 3m (minimum)',
      slope_pct: 2,
      thickness_mm: 150,
    },
    drainage: 'Concrete drainage channel (150mm wide × 100mm deep) sloping away from wellhead to soakaway pit at ≥5m distance',
    fencing: {
      type: isCommunity ? 'Chain-link fence with lockable gate' : 'Weld-mesh fence or masonry wall',
      radius_m: isCommunity ? 3 : 5,
      height_m: 1.8,
    },
    lockableCap: 'Vandal-proof lockable well cap (galvanized steel or stainless steel)',
    ventPipe: '25mm downward-pointing screened vent pipe (insect mesh) extending 0.5m above cap',
    samplingPort: yield_m3hr > 1,
    pressureGauge: yield_m3hr > 5,
    flowMeter: yield_m3hr > 3,
    nonReturnValve: true,
    sanitaryCompletion: [
      'Casing extends ≥0.3m above ground level (prevent surface water entry)',
      'Concrete apron around casing with no cracks (waterproof seal)',
      'No animal access within fenced perimeter',
      'Drainage channel functional and clear of debris',
      'No latrine, rubbish pit, or animal pen within 30m',
      'No stagnant water within 10m of wellhead',
      'Lockable cover present and functional',
      'Vent pipe present and screened (no insect entry)',
      ...(yield_m3hr > 3 ? ['Electromagnetic flowmeter installed on discharge line'] : []),
      ...(yield_m3hr > 1 ? ['Sampling tap installed upstream of any treatment'] : []),
    ],
  };
}

// ════════════════════════════════════════════════════════════
// 12. WELL ABANDONMENT / DECOMMISSIONING PROTOCOL
// ════════════════════════════════════════════════════════════

export interface AbandonmentProtocol {
  procedure: string[];
  materials: { item: string; quantity: string }[];
  estimatedCost_usd: [number, number];
  regulation: string;
}

export function computeAbandonmentProtocol(depth_m: number, casingDiameter_mm: number, countryMultiplier: number): AbandonmentProtocol {
  const casingArea = Math.PI * (casingDiameter_mm / 2000) ** 2;
  const groutVolume_m3 = casingArea * depth_m;
  const cementBags = Math.ceil(groutVolume_m3 * 1000 / 37); // 37L per bag

  return {
    procedure: [
      '1. Remove pump, rising main, and all downhole equipment',
      '2. Measure final water level and record borehole condition',
      '3. If screen present: fill screen zone with clean sand or gravel',
      `4. Tremie-grout from bottom of borehole to 3m below ground level with cement-bentonite slurry`,
      '5. Fill top 3m with compacted bentonite pellets',
      '6. Cap with concrete slab flush with ground surface (minimum 150mm thick)',
      '7. Mark location with permanent marker post showing "ABANDONED BOREHOLE — [date]"',
      '8. File abandonment report with regulatory authority',
    ],
    materials: [
      { item: 'Portland cement (50kg bags)', quantity: `${cementBags} bags` },
      { item: 'Bentonite pellets (25kg bags)', quantity: `${Math.ceil(depth_m * 0.05)} bags` },
      { item: 'Concrete (top slab)', quantity: '0.5 m³' },
      { item: 'Tremie pipe', quantity: `${depth_m}m` },
    ],
    estimatedCost_usd: [
      Math.round((cementBags * 15 + 500) * countryMultiplier),
      Math.round((cementBags * 20 + 1000) * countryMultiplier),
    ],
    regulation: 'ASTM D5299 — Standard Guide for Decommissioning of Ground Water Wells. Local regulations may impose additional requirements.',
  };
}
