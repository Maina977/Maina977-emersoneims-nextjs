/**
 * Well Design Engine v3 — Professional Engineering-Grade Borehole Design
 *
 * Complete engineering module suitable for licensed PE/PG review.
 *
 * CAPABILITIES:
 *  1. Real sieve analysis: full grain-size distribution, D10/D30/D50/D60/Cu/Cc
 *  2. Real pump test integration: field T, S override satellite estimates
 *  3. Step-drawdown analysis (Jacob): s = BQ + CQ² for real well loss coefficient
 *  4. Hazen-Williams friction loss: hf = 10.67·L·Q^1.852 / (C^1.852·D^4.87)
 *  5. Pump curve database: real Q-H-eff curves for common pump families
 *  6. Geological boundary-based core sampling from lithological column
 *  7. Location-adjusted cost model with 45+ country multipliers
 *  8. NPSH verification (ANSI/HI 9.6.1) — pump cavitation safety
 *  9. Annular grout volume calculation (API RP 65)
 * 10. Water chemistry indices: LSI, RSI, AI (Langelier 1936, Ryznar 1944)
 * 11. Environmental setback analysis with travel time (WHO/GOD method)
 * 12. Drilling method selection and timeline with phase-by-phase schedule
 * 13. Demand analysis and 20-year sustainability projection
 * 14. Monitoring & O&M plan with lifecycle cost (NPV)
 * 15. Pump test protocol generation (USGS-standard)
 * 16. Wellhead completion specification
 * 17. Well abandonment/decommissioning protocol
 * 18. Aquifer boundary assessment (Theis limitation flags)
 *
 * References:
 *   Driscoll, F.G. (1986) Groundwater and Wells, 2nd ed.
 *   Roscoe Moss Co. (1990) Handbook of Ground Water Development
 *   Kruseman & de Ridder (1994) Analysis and Evaluation of Pumping Test Data
 *   Todd & Mays (2005) Groundwater Hydrology, 3rd ed.
 *   BS EN ISO 22475-1:2006 Geotechnical investigation
 *   ASTM D5092-04 — Design & Installation of Monitoring Wells
 *   WHO (2006) Protecting Groundwater for Health
 *   Langelier, W.F. (1936) Analytical control of anti-corrosion water treatment
 *   Ryznar, J.W. (1944) New index for CaCO₃ scale formed by water
 *   API RP 65 — Cementing Shallow Water Flow Zones
 *   ANSI/HI 9.6.1 — Rotodynamic Pumps for NPSH Margin
 *   Foster et al. (2002) GOD aquifer vulnerability method
 *   Freeze & Cherry (1979) Groundwater
 */

import {
  computeWaterChemistry, computeNPSH, computeGroutDesign,
  computeSetbackAnalysis, computeDrillingPlan, computeDemandAnalysis,
  computeMonitoringPlan, computeLifecycleCost, assessAquiferBoundaries,
  generatePumpTestProtocol, computeWellheadSpec, computeAbandonmentProtocol,
  type WaterChemistryResult, type NPSHResult, type GroutDesignResult,
  type SetbackAnalysis, type DrillingPlan, type DemandAnalysis,
  type MonitoringPlan, type LifecycleCost, type BoundaryAssessment,
  type PumpTestProtocol, type WellheadSpec, type AbandonmentProtocol,
  type WaterChemistryInput,
} from './engineeringCalcs';

// ════════════════════════════════════════════════════════════
// NEW FIELD DATA TYPES
// ════════════════════════════════════════════════════════════

/** Full grain-size distribution from lab sieve analysis */
export interface SieveAnalysisData {
  /** Each entry: { sieveMM: aperture in mm, passingPct: cumulative % passing } */
  curve: { sieveMM: number; passingPct: number }[];
  labName?: string;
  sampleDepth_m?: number;
  sampleDate?: string;
}

/** Step-drawdown test data (Hantush-Bierschenk / Jacob method) */
export interface StepDrawdownTest {
  steps: { pumpingRate_m3hr: number; drawdown_m: number; duration_min: number }[];
  staticWaterLevel_m: number;
  wellRadius_m?: number;
  testDate?: string;
}

/** Geological layer boundary from subsurface model */
export interface GeoLayerBoundary {
  topDepthM: number;
  bottomDepthM: number;
  lithology: string;
  isAquifer: boolean;
  aquiferType?: string;
  hydraulicConductivity?: number;
  porosity?: number;
  sand?: number;
  silt?: number;
  clay?: number;
}

// ════════════════════════════════════════════════════════════
// OUTPUT TYPES (unchanged — preserves PDF/UI compatibility)
// ════════════════════════════════════════════════════════════

export interface CasingDesign {
  material: 'uPVC Class 12' | 'uPVC Class 16' | 'Steel (API J55)' | 'Steel (API N80)' | 'Stainless Steel 304';
  outerDiameter_mm: number;
  outerDiameter_inches: string;
  wallThickness_mm: number;
  collapseStrength_kPa: number;
  depth_m: [number, number];
  purpose: string;
  jointType: string;
}

export interface ScreenDesign {
  type: 'Wire-wound (Johnson)' | 'Slotted PVC' | 'Bridge-slot' | 'Continuous-slot SS';
  material: string;
  outerDiameter_mm: number;
  slotSize_mm: number;
  slotSize_inches: string;
  openAreaPercent: number;
  length_m: number;
  depth_m: [number, number];
  entranceVelocity_m_s: number;
  maxEntranceVelocity_m_s: number;
  selectionBasis: string;
}

export interface GravelPackDesign {
  required: boolean;
  grainSize_mm: [number, number];
  filterRatio: string;
  thickness_mm: number;
  material: string;
  volume_m3: number;
  placementMethod: string;
  selectionBasis: string;
}

export interface PumpDesign {
  type: string;
  make_model_suggestion: string;
  motorRating_kW: number;
  motorRating_hp: number;
  installationDepth_m: number;
  inletDepth_m: number;
  designFlow_m3hr: number;
  totalDynamicHead_m: number;
  pumpEfficiency_pct: number;
  powerSource: string;
  solarPanels_kW?: number;
  riserPipe: { material: string; diameter_mm: number; length_m: number };
  estimatedCost_usd: [number, number];
}

export interface WellDevelopmentPlan {
  primaryMethod: string;
  secondaryMethod: string;
  estimatedDuration_hr: number;
  successCriteria: string[];
  equipment: string[];
  steps: string[];
}

export interface DrawdownAnalysis {
  designPumpingRate_m3hr: number;
  designPumpingRate_m3day: number;
  theis_drawdown_m: number;
  cooperJacob_drawdown_m: number;
  wellLoss_m: number;
  wellLossCoefficient_C?: number;
  wellLossSource: string;
  totalDrawdown_m: number;
  dynamicWaterLevel_m: number;
  availableDrawdown_m: number;
  drawdownMargin_pct: number;
  specificCapacity_m3_day_m: number;
  specificCapacity_class: string;
  pumpingDuration_hr: number;
  safetyFactor: number;
}

export interface CoreSamplingPlan {
  recommended: boolean;
  intervals: { from_m: number; to_m: number; purpose: string; method: string }[];
  totalCoreLengths_m: number;
  estimatedCost_usd: [number, number];
  analyses: string[];
  thinSectionRequired: boolean;
  thinSectionIntervals: string[];
}

export interface BoreholeLogTemplate {
  projectInfo: { field: string; instruction: string }[];
  logColumns: string[];
  depthIntervals_m: number;
  totalDepth_m: number;
  waterStrikeFields: string[];
  completionFields: string[];
}

export interface WellDesignResult {
  boreholeSpecifications: {
    drillingMethod: string;
    drillingDiameter_mm: number;
    drillingDiameter_inches: string;
    totalDepth_m: number;
    ratHole_m: number;
    pilotHole: boolean;
    estimatedDrillingDays: [number, number];
    drillingCostPerMeter_usd: [number, number];
  };
  casing: CasingDesign[];
  screen: ScreenDesign;
  gravelPack: GravelPackDesign;
  sanitary_seal: {
    type: string;
    depth_m: number;
    material: string;
    purpose: string;
  };
  pump: PumpDesign;
  wellDevelopment: WellDevelopmentPlan;
  drawdown: DrawdownAnalysis;
  coreSampling: CoreSamplingPlan;
  boreholeLogTemplate: BoreholeLogTemplate;
  designStandards: string[];
  designNotes: string[];
  designConfidence: 'HIGH' | 'MODERATE' | 'LOW';
  confidenceNote: string;
  /** v2: Tracks exactly which parameters came from field data vs estimates */
  dataProvenance: { parameter: string; source: 'field_measured' | 'lab_tested' | 'estimated' | 'published_literature'; note: string }[];
  /** v3: Water chemistry indices (LSI, RSI, AI, corrosion/scaling risk) */
  waterChemistryIndices?: WaterChemistryResult;
  /** v3: NPSH verification per ANSI/HI 9.6.1 */
  npshCheck?: NPSHResult;
  /** v3: Annular grout design per API RP 65 */
  groutDesign?: GroutDesignResult;
  /** v3: Environmental setback analysis with travel time */
  setbackAnalysis?: SetbackAnalysis;
  /** v3: Detailed drilling plan with timeline */
  drillingPlan?: DrillingPlan;
  /** v3: Demand analysis and sustainability projection */
  demandAnalysis?: DemandAnalysis;
  /** v3: Monitoring & O&M plan */
  monitoringPlan?: MonitoringPlan;
  /** v3: 20-year lifecycle cost (NPV) */
  lifecycleCost?: LifecycleCost;
  /** v3: Aquifer boundary assessment (Theis assumptions check) */
  boundaryAssessment?: BoundaryAssessment;
  /** v3: Pump test protocol (USGS standard) */
  pumpTestProtocol?: PumpTestProtocol;
  /** v3: Wellhead completion specification */
  wellheadSpec?: WellheadSpec;
  /** v3: Well abandonment/decommissioning protocol */
  abandonmentProtocol?: AbandonmentProtocol;
}

// ════════════════════════════════════════════════════════════
// EXPANDED INPUT
// ════════════════════════════════════════════════════════════

export interface WellDesignInput {
  recommendedDepth_m: number;
  estimatedYield_m3hr: number;
  staticWaterLevel_m: number;
  aquiferType: string;
  primaryRockType: string;
  soilType: string;
  transmissivity_m2day?: number;
  storativity?: number;
  hydraulicConductivity_m_day?: number;
  aquiferThickness_m?: number;
  meanGrainSize_mm?: number;
  uniformityCoeff?: number;
  hasPumpTestData: boolean;
  /** Published regional tested-yield band [lo,hi] m³/hr for the aquifer province
   *  (e.g. Kenya BASEMENT [0.5,3]). Used to reconcile a low/high-outlier desktop
   *  transmissivity to a value consistent with real drilled outcomes, so yield,
   *  drawdown, specific capacity and pump all derive from ONE consistent T.
   *  Ignored when hasPumpTestData is true (field data always wins). */
  regionalTestedYieldBand_m3hr?: [number, number];
  precipitation_mm_yr?: number;
  isFieldValidated: boolean;

  // v2 — real field data inputs
  sieveAnalysis?: SieveAnalysisData;
  stepDrawdownTest?: StepDrawdownTest;
  geologicalLayers?: GeoLayerBoundary[];
  /** Field pump test T (overrides satellite estimate) */
  fieldTransmissivity_m2day?: number;
  /** Field pump test S (overrides satellite estimate) */
  fieldStorativity?: number;
  /** Country ISO code for cost adjustment */
  countryCode?: string;
  /** Delivery head above ground (m) */
  deliveryHead_m?: number;
  /** Riser pipe length if different from installation depth */
  riserPipeLength_m?: number;
  /** Riser pipe internal diameter (mm) */
  riserPipeID_mm?: number;
  /** Well radius (m) */
  wellRadius_m?: number;
  /** Water quality pH for casing material selection */
  waterQualityPH?: number;
  /** Sulfate concentration mg/L for corrosion check */
  waterQualitySulfate_mgL?: number;
  /** H2S detected in water */
  waterQualityH2S?: boolean;
  /** How yield was derived (displayed in provenance) */
  yieldSource?: string;
  // v3 — engineering analysis inputs
  /** Site elevation above sea level (m) for NPSH calculation */
  elevation_m?: number;
  /** True only if elevation came from a survey instrument (not SRTM/DEM). */
  elevationIsFieldMeasured?: boolean;
  /** Water temperature (°C) */
  waterTemperature_C?: number;
  /** Full water chemistry for LSI/RSI analysis */
  waterChemistry?: WaterChemistryInput;
  /** True only if waterChemistry is from an accredited lab (not modelled). */
  waterChemistryIsLab?: boolean;
  /** Nearby contamination sources for setback analysis */
  contaminationSources?: { type: string; estimatedDistance_m: number }[];
  /** Hydraulic gradient for travel time calculation */
  hydraulicGradient?: number;
  /** Effective porosity of vadose zone */
  effectivePorosity?: number;
  /** Population to be served */
  populationServed?: number;
  /** Population growth rate (%/yr) */
  growthRate_pct?: number;
  /** Per capita water demand (liters/person/day) */
  perCapitaDemand_Lpd?: number;
  /** Annual recharge (mm/yr) */
  annualRecharge_mm?: number;
  /** Catchment area (km²) */
  catchmentArea_km2?: number;
  /** GRACE groundwater trend (cm/yr, negative = declining) */
  graceTrend_cmYr?: number;
  /** Nearby geological/hydrological features for boundary assessment */
  nearbyFeatures?: { type: string; distance_m: number }[];
  /** Whether site is remote (affects mobilization cost/time) */
  isRemoteSite?: boolean;
}

// ════════════════════════════════════════════════════════════
// FIX #1: SIEVE ANALYSIS — Real grain-size computation
// ════════════════════════════════════════════════════════════

interface GrainSizeParams {
  D10: number; D30: number; D50: number; D60: number;
  Cu: number; Cc: number;
  source: 'lab_tested' | 'estimated';
  note: string;
}

/** Interpolate grain size at a given percent passing from sieve curve */
function interpolateSieve(curve: { sieveMM: number; passingPct: number }[], pctPassing: number): number {
  const sorted = [...curve].sort((a, b) => a.passingPct - b.passingPct);
  if (pctPassing <= sorted[0].passingPct) return sorted[0].sieveMM;
  if (pctPassing >= sorted[sorted.length - 1].passingPct) return sorted[sorted.length - 1].sieveMM;
  for (let i = 0; i < sorted.length - 1; i++) {
    if (sorted[i].passingPct <= pctPassing && sorted[i + 1].passingPct >= pctPassing) {
      // Log-linear interpolation (standard for grain size)
      const frac = (pctPassing - sorted[i].passingPct) / (sorted[i + 1].passingPct - sorted[i].passingPct);
      const logD = Math.log(sorted[i].sieveMM) + frac * (Math.log(sorted[i + 1].sieveMM) - Math.log(sorted[i].sieveMM));
      return Math.exp(logD);
    }
  }
  return sorted[Math.floor(sorted.length / 2)].sieveMM;
}

/** Compute D10, D30, D50, D60, Cu, Cc from sieve curve or estimate from soil type */
function computeGrainSize(input: WellDesignInput): GrainSizeParams {
  if (input.sieveAnalysis && input.sieveAnalysis.curve.length >= 3) {
    const c = input.sieveAnalysis.curve;
    const D10 = interpolateSieve(c, 10);
    const D30 = interpolateSieve(c, 30);
    const D50 = interpolateSieve(c, 50);
    const D60 = interpolateSieve(c, 60);
    const Cu = D60 / Math.max(0.001, D10);
    const Cc = (D30 * D30) / (Math.max(0.001, D10) * Math.max(0.001, D60));
    return {
      D10, D30, D50, D60, Cu, Cc,
      source: 'lab_tested',
      note: `Lab sieve analysis${input.sieveAnalysis.labName ? ' by ' + input.sieveAnalysis.labName : ''}. D10=${D10.toFixed(3)}mm, Cu=${Cu.toFixed(1)}, Cc=${Cc.toFixed(1)}`,
    };
  }

  // Published grain-size distributions by soil type (USDA/USCS classification)
  // Sources: Coduto (2001) Geotechnical Engineering, Bowles (1997) Foundation Analysis & Design
  const PUBLISHED: Record<string, { D10: number; D30: number; D50: number; D60: number }> = {
    'gravel':       { D10: 4.0,  D30: 8.0,  D50: 12.0, D60: 16.0 },
    'sandy_gravel': { D10: 1.5,  D30: 3.5,  D50: 6.0,  D60: 8.0  },
    'coarse_sand':  { D10: 0.5,  D30: 1.0,  D50: 1.5,  D60: 2.0  },
    'sand':         { D10: 0.15, D30: 0.3,  D50: 0.5,  D60: 0.7  },
    'sandy':        { D10: 0.15, D30: 0.3,  D50: 0.5,  D60: 0.7  },
    'medium_sand':  { D10: 0.15, D30: 0.3,  D50: 0.5,  D60: 0.7  },
    'fine_sand':    { D10: 0.07, D30: 0.12, D50: 0.18, D60: 0.25 },
    'silty_sand':   { D10: 0.04, D30: 0.08, D50: 0.15, D60: 0.20 },
    'silt':         { D10: 0.005, D30: 0.015, D50: 0.03, D60: 0.04 },
    'clay':         { D10: 0.001, D30: 0.003, D50: 0.006, D60: 0.008 },
    'silty_clay':   { D10: 0.002, D30: 0.005, D50: 0.01,  D60: 0.015 },
    'laterite':     { D10: 0.05,  D30: 0.2,  D50: 0.8,  D60: 1.5 },
    'rocky':        { D10: 0.5,   D30: 2.0,  D50: 5.0,  D60: 8.0 },
    'granite':      { D10: 1.0,  D30: 3.0,  D50: 5.0,  D60: 8.0  },
    'sandstone':    { D10: 0.08, D30: 0.15, D50: 0.25, D60: 0.35 },
    'limestone':    { D10: 0.1,  D30: 0.3,  D50: 0.6,  D60: 0.9  },
    'basalt':       { D10: 0.8,  D30: 2.5,  D50: 5.0,  D60: 7.0  },
    'alluvium':     { D10: 0.1,  D30: 0.4,  D50: 1.0,  D60: 2.0  },
  };

  const key = Object.keys(PUBLISHED).find(
    k => input.soilType.toLowerCase().includes(k) || input.primaryRockType.toLowerCase().includes(k)
  ) ?? 'sand';
  const pub = PUBLISHED[key];

  // If user provided D50 and Cu, override
  if (input.meanGrainSize_mm && input.uniformityCoeff) {
    const D50 = input.meanGrainSize_mm;
    const Cu = input.uniformityCoeff;
    const D60 = D50 * 1.2;
    const D10 = D60 / Cu;
    const D30 = Math.sqrt(D10 * D60);
    return {
      D10, D30, D50, D60, Cu,
      Cc: (D30 * D30) / (D10 * D60),
      source: 'estimated',
      note: `D50=${D50.toFixed(2)}mm and Cu=${Cu.toFixed(1)} provided by user. D10/D30/D60 derived. NO LAB SIEVE — confirm with lab testing.`,
    };
  }

  const Cu = pub.D60 / Math.max(0.001, pub.D10);
  const Cc = (pub.D30 * pub.D30) / (Math.max(0.001, pub.D10) * Math.max(0.001, pub.D60));
  return {
    ...pub, Cu, Cc,
    source: 'estimated',
    note: `Grain size estimated from published ${key} distribution (Coduto 2001 / Bowles 1997). NO LAB SIEVE DATA — values are indicative only. Lab sieve analysis REQUIRED for final design.`,
  };
}

// ════════════════════════════════════════════════════════════
// FIX #3: STEP-DRAWDOWN ANALYSIS (Jacob method)
// s = BQ + CQ²  where B = aquifer loss, C = well loss coefficient
// ════════════════════════════════════════════════════════════

interface WellLossResult {
  B: number;
  C: number;
  wellLoss_m: number;
  aquiferLoss_m: number;
  source: 'step_test' | 'empirical';
  note: string;
}

/** Least-squares regression on s/Q = B + CQ from step test data */
function computeWellLoss(input: WellDesignInput, Q_m3day: number): WellLossResult {
  if (input.stepDrawdownTest && input.stepDrawdownTest.steps.length >= 3) {
    const steps = input.stepDrawdownTest.steps;
    const n = steps.length;
    const data = steps.map(s => ({
      Q: s.pumpingRate_m3hr * 24,
      s_over_Q: s.drawdown_m / (s.pumpingRate_m3hr * 24),
    }));

    const sumQ = data.reduce((s, d) => s + d.Q, 0);
    const sumSQ = data.reduce((s, d) => s + d.s_over_Q, 0);
    const sumQQ = data.reduce((s, d) => s + d.Q * d.Q, 0);
    const sumQSQ = data.reduce((s, d) => s + d.Q * d.s_over_Q, 0);

    const denom = n * sumQQ - sumQ * sumQ;
    const C = denom !== 0 ? (n * sumQSQ - sumQ * sumSQ) / denom : 0;
    const B = (sumSQ - C * sumQ) / n;

    const B_pos = Math.max(0, B);
    const C_pos = Math.max(0, C);
    const efficiency = B_pos > 0 ? (B_pos / (B_pos + C_pos * Q_m3day) * 100) : 50;

    return {
      B: B_pos,
      C: C_pos,
      aquiferLoss_m: B_pos * Q_m3day,
      wellLoss_m: C_pos * Q_m3day * Q_m3day,
      source: 'step_test',
      note: `Step-drawdown test (${n} steps, Jacob method). B=${B_pos.toExponential(3)} day/m², C=${C_pos.toExponential(3)} day²/m⁵. Well efficiency = ${efficiency.toFixed(0)}%.`,
    };
  }

  // Empirical well loss ranges: Kruseman & de Ridder (1994), Table 13.1
  const EMPIRICAL_C: Record<string, { C_low: number; C_high: number }> = {
    alluvial:    { C_low: 5e-6,  C_high: 5e-5  },
    sedimentary: { C_low: 8e-6,  C_high: 8e-5  },
    weathered:   { C_low: 1e-5,  C_high: 1e-4  },
    fractured:   { C_low: 1e-5,  C_high: 1.5e-4 },
    karst:       { C_low: 3e-6,  C_high: 3e-5  },
    unknown:     { C_low: 1e-5,  C_high: 1e-4  },
  };

  const aqKey = Object.keys(EMPIRICAL_C).find(k => input.aquiferType.toLowerCase().includes(k)) ?? 'unknown';
  const emp = EMPIRICAL_C[aqKey];
  const C_mid = (emp.C_low + emp.C_high) / 2;
  const T = input.fieldTransmissivity_m2day ?? input.transmissivity_m2day ?? 50;
  const rw = input.wellRadius_m ?? 0.1;
  const S = input.fieldStorativity ?? input.storativity ?? 0.05;
  const B_est = (1 / (4 * Math.PI * T)) * Math.log(2.25 * T * 1 / (rw * rw * S));

  return {
    B: Math.max(0, B_est),
    C: C_mid,
    aquiferLoss_m: Math.max(0, B_est) * Q_m3day,
    wellLoss_m: C_mid * Q_m3day * Q_m3day,
    source: 'empirical',
    note: `No step-drawdown test. C estimated from Kruseman & de Ridder (1994) for ${aqKey}: C=${C_mid.toExponential(2)} day²/m⁵ (range: ${emp.C_low.toExponential(1)} to ${emp.C_high.toExponential(1)}). STEP TEST REQUIRED for final design.`,
  };
}

// ════════════════════════════════════════════════════════════
// FIX #4: HAZEN-WILLIAMS FRICTION LOSS
// hf = 10.67 × L × Q^1.852 / (C^1.852 × D^4.87)
// ════════════════════════════════════════════════════════════

interface FrictionResult {
  headLoss_m: number;
  method: string;
  C_coefficient: number;
  velocity_m_s: number;
  note: string;
}

const HW_COEFFICIENTS: Record<string, number> = {
  'HDPE': 150, 'uPVC': 150, 'GI_new': 120, 'GI_10yr': 100,
  'GI_20yr': 85, 'GI': 100, 'Steel_new': 130, 'Steel_10yr': 110,
  'Cast_iron': 100, 'Stainless': 140,
};

function computeFrictionLoss(
  Q_m3s: number, pipeID_m: number, pipeLength_m: number,
  pipeMaterial: string, fittingsCount: number = 5
): FrictionResult {
  const matKey = Object.keys(HW_COEFFICIENTS).find(
    k => pipeMaterial.toLowerCase().includes(k.toLowerCase().replace('_', ' '))
  ) ?? 'HDPE';
  const C = HW_COEFFICIENTS[matKey] ?? 150;

  // Hazen-Williams
  const hf_pipe = 10.67 * pipeLength_m * Math.pow(Math.max(1e-8, Q_m3s), 1.852) / (Math.pow(C, 1.852) * Math.pow(Math.max(0.01, pipeID_m), 4.87));
  const hf_fittings = hf_pipe * (fittingsCount / 5) * 0.1;
  const velocity = Q_m3s / (Math.PI * (pipeID_m / 2) ** 2);

  return {
    headLoss_m: Math.round((hf_pipe + hf_fittings) * 100) / 100,
    method: 'Hazen-Williams',
    C_coefficient: C,
    velocity_m_s: Math.round(velocity * 100) / 100,
    note: `hf = ${(hf_pipe + hf_fittings).toFixed(2)}m (pipe: ${hf_pipe.toFixed(2)}m + fittings: ${hf_fittings.toFixed(2)}m). C=${C} (${matKey}), v=${velocity.toFixed(2)} m/s.`,
  };
}

// ════════════════════════════════════════════════════════════
// FIX #5: PUMP CURVE DATABASE
// ════════════════════════════════════════════════════════════

interface PumpCurvePoint { Q_m3hr: number; H_m: number; eff_pct: number; }
interface PumpFamily {
  name: string;
  type: string;
  powerSource: string;
  curve: PumpCurvePoint[];
  motorRange_kW: [number, number];
  costRange_usd: [number, number];
}

const PUMP_DATABASE: PumpFamily[] = [
  {
    name: 'Grundfos SP 2A (0.37–1.5 kW)',
    type: 'Submersible (single-phase, 220V)',
    powerSource: 'Single-phase mains / generator',
    curve: [
      { Q_m3hr: 0.5, H_m: 120, eff_pct: 35 }, { Q_m3hr: 1.0, H_m: 110, eff_pct: 45 },
      { Q_m3hr: 1.5, H_m: 95,  eff_pct: 52 }, { Q_m3hr: 2.0, H_m: 78,  eff_pct: 55 },
      { Q_m3hr: 2.5, H_m: 58,  eff_pct: 50 }, { Q_m3hr: 3.0, H_m: 35,  eff_pct: 40 },
    ],
    motorRange_kW: [0.37, 1.5], costRange_usd: [1500, 4000],
  },
  {
    name: 'Grundfos SP 5A (1.5–4.0 kW)',
    type: 'Submersible (single-phase, 220V)',
    powerSource: 'Single-phase mains / generator',
    curve: [
      { Q_m3hr: 2.0, H_m: 160, eff_pct: 45 }, { Q_m3hr: 3.0, H_m: 145, eff_pct: 55 },
      { Q_m3hr: 4.0, H_m: 125, eff_pct: 62 }, { Q_m3hr: 5.0, H_m: 100, eff_pct: 65 },
      { Q_m3hr: 6.0, H_m: 75,  eff_pct: 60 }, { Q_m3hr: 7.0, H_m: 45,  eff_pct: 48 },
    ],
    motorRange_kW: [1.5, 4.0], costRange_usd: [3000, 8000],
  },
  {
    name: 'Grundfos SP 17 (4.0–11 kW)',
    type: 'Submersible (3-phase, 380V)',
    powerSource: '3-phase mains / generator',
    curve: [
      { Q_m3hr: 8.0,  H_m: 180, eff_pct: 55 }, { Q_m3hr: 10.0, H_m: 165, eff_pct: 65 },
      { Q_m3hr: 12.0, H_m: 145, eff_pct: 72 }, { Q_m3hr: 15.0, H_m: 120, eff_pct: 75 },
      { Q_m3hr: 18.0, H_m: 90,  eff_pct: 70 }, { Q_m3hr: 20.0, H_m: 60,  eff_pct: 58 },
    ],
    motorRange_kW: [4.0, 11.0], costRange_usd: [8000, 20000],
  },
  {
    name: 'Grundfos SP 30 (7.5–22 kW)',
    type: 'Submersible (3-phase, 380V)',
    powerSource: '3-phase mains / generator',
    curve: [
      { Q_m3hr: 15.0, H_m: 200, eff_pct: 58 }, { Q_m3hr: 20.0, H_m: 180, eff_pct: 68 },
      { Q_m3hr: 25.0, H_m: 155, eff_pct: 75 }, { Q_m3hr: 30.0, H_m: 125, eff_pct: 77 },
      { Q_m3hr: 35.0, H_m: 90,  eff_pct: 72 }, { Q_m3hr: 40.0, H_m: 50,  eff_pct: 55 },
    ],
    motorRange_kW: [7.5, 22.0], costRange_usd: [15000, 35000],
  },
  {
    name: 'Lorentz PS2-150 / PS2-600 (Solar)',
    type: 'Submersible (solar DC)',
    powerSource: 'Solar PV array',
    curve: [
      { Q_m3hr: 0.3, H_m: 100, eff_pct: 30 }, { Q_m3hr: 0.5, H_m: 90,  eff_pct: 38 },
      { Q_m3hr: 1.0, H_m: 70,  eff_pct: 45 }, { Q_m3hr: 1.5, H_m: 55,  eff_pct: 50 },
      { Q_m3hr: 2.0, H_m: 40,  eff_pct: 48 }, { Q_m3hr: 2.5, H_m: 25,  eff_pct: 40 },
    ],
    motorRange_kW: [0.15, 0.6], costRange_usd: [3000, 7000],
  },
  {
    name: 'Grundfos SQFlex (Solar, 0.3–2.5 kW)',
    type: 'Submersible (solar DC / single-phase AC)',
    powerSource: 'Solar PV array / single-phase mains',
    curve: [
      { Q_m3hr: 0.5, H_m: 140, eff_pct: 32 }, { Q_m3hr: 1.0, H_m: 120, eff_pct: 42 },
      { Q_m3hr: 2.0, H_m: 90,  eff_pct: 52 }, { Q_m3hr: 3.0, H_m: 60,  eff_pct: 55 },
      { Q_m3hr: 4.0, H_m: 35,  eff_pct: 48 }, { Q_m3hr: 5.0, H_m: 15,  eff_pct: 35 },
    ],
    motorRange_kW: [0.3, 2.5], costRange_usd: [4000, 10000],
  },
  {
    name: 'Afridev Hand Pump',
    type: 'Hand pump (community water point)',
    powerSource: 'Manual',
    curve: [
      { Q_m3hr: 0.3, H_m: 45, eff_pct: 60 }, { Q_m3hr: 0.5, H_m: 35, eff_pct: 55 },
      { Q_m3hr: 0.7, H_m: 25, eff_pct: 45 }, { Q_m3hr: 0.9, H_m: 15, eff_pct: 35 },
    ],
    motorRange_kW: [0, 0], costRange_usd: [2000, 4500],
  },
];

interface PumpSelection { pump: PumpFamily; operatingPoint: PumpCurvePoint; matchScore: number; }

function selectPump(Q_m3hr: number, TDH_m: number): PumpSelection {
  let best: PumpSelection | null = null;

  for (const pump of PUMP_DATABASE) {
    // Reject grossly OVERSIZED pumps. A pump family whose smallest rated flow is
    // far above the design flow can nominally deliver a trickle at its top-of-curve
    // head, but specifying an 8–20 m³/hr / 4–11 kW pump for a 0.45 m³/hr borehole is
    // physically absurd and was the source of the "Grundfos SP17 for 0.11 kW" bug.
    // Only consider a pump if the design flow is within (or just below) its rated band.
    const minCurveQ = pump.curve[0].Q_m3hr;
    if (Q_m3hr < minCurveQ * 0.5) continue;
    for (let i = 0; i < pump.curve.length - 1; i++) {
      const p1 = pump.curve[i];
      const p2 = pump.curve[i + 1];
      if (Q_m3hr >= p1.Q_m3hr && Q_m3hr <= p2.Q_m3hr) {
        const frac = (Q_m3hr - p1.Q_m3hr) / (p2.Q_m3hr - p1.Q_m3hr);
        const H_at_Q = p1.H_m + frac * (p2.H_m - p1.H_m);
        const eff_at_Q = p1.eff_pct + frac * (p2.eff_pct - p1.eff_pct);
        if (H_at_Q >= TDH_m) {
          const score = eff_at_Q - Math.abs(H_at_Q - TDH_m) * 0.1;
          if (!best || score > best.matchScore) {
            best = {
              pump,
              operatingPoint: {
                Q_m3hr: Math.round(Q_m3hr * 100) / 100,
                H_m: Math.round(H_at_Q * 10) / 10,
                eff_pct: Math.round(eff_at_Q * 10) / 10,
              },
              matchScore: score,
            };
          }
        }
      }
    }
    // Check last point range
    const last = pump.curve[pump.curve.length - 1];
    if (Q_m3hr <= last.Q_m3hr * 1.05 && last.H_m >= TDH_m) {
      const score = last.eff_pct - 10;
      if (!best || score > best.matchScore) {
        best = { pump, operatingPoint: last, matchScore: score };
      }
    }
  }

  if (!best) {
    // No exact head/flow match — pick the pump family whose rated flow band is
    // CLOSEST to the design flow (never default to an oversized 3-phase unit for a
    // low-yield borehole). Final pump make/model is anyway deferred to the pump test.
    const fb = [...PUMP_DATABASE].sort((a, b) => {
      const am = (a.curve[0].Q_m3hr + a.curve[a.curve.length - 1].Q_m3hr) / 2;
      const bm = (b.curve[0].Q_m3hr + b.curve[b.curve.length - 1].Q_m3hr) / 2;
      return Math.abs(am - Q_m3hr) - Math.abs(bm - Q_m3hr);
    })[0];
    const mid = fb.curve.reduce((p, c) => Math.abs(c.Q_m3hr - Q_m3hr) < Math.abs(p.Q_m3hr - Q_m3hr) ? c : p, fb.curve[0]);
    best = { pump: fb, operatingPoint: mid, matchScore: 0 };
  }
  return best;
}

// ════════════════════════════════════════════════════════════
// FIX #6: GEOLOGICAL BOUNDARY-BASED CORE SAMPLING
// ════════════════════════════════════════════════════════════

function computeCoreSampling(input: WellDesignInput, depth: number, isRock: boolean): CoreSamplingPlan {
  const intervals: CoreSamplingPlan['intervals'] = [];

  if (input.geologicalLayers && input.geologicalLayers.length >= 2) {
    const layers = input.geologicalLayers;

    // Always sample overburden (first layer)
    intervals.push({
      from_m: layers[0].topDepthM,
      to_m: Math.min(layers[0].bottomDepthM, layers[0].topDepthM + 6),
      purpose: `Overburden (${layers[0].lithology}) — sanitary seal design, shallow contamination risk`,
      method: 'Disturbed sample (split spoon / drive tube)',
    });

    // Sample at EACH major lithology transition
    for (let i = 0; i < layers.length - 1; i++) {
      const curr = layers[i];
      const next = layers[i + 1];
      if (curr.lithology !== next.lithology || curr.isAquifer !== next.isAquifer) {
        const bnd = curr.bottomDepthM;
        intervals.push({
          from_m: Math.max(0, bnd - 2),
          to_m: Math.min(depth, bnd + 2),
          purpose: `Boundary: ${curr.lithology} → ${next.lithology} (${bnd}m) — confirm transition, K contrast`,
          method: isRock ? 'Core barrel (NQ/HQ)' : 'Drive tube / Shelby tube',
        });
      }
    }

    // Sample each aquifer zone
    layers.filter(l => l.isAquifer).forEach(aq => {
      const midStart = Math.round(aq.topDepthM + (aq.bottomDepthM - aq.topDepthM) * 0.3);
      const midEnd = Math.round(aq.topDepthM + (aq.bottomDepthM - aq.topDepthM) * 0.7);
      if (midEnd > midStart) {
        intervals.push({
          from_m: midStart,
          to_m: midEnd,
          purpose: `Aquifer (${aq.lithology}, ${aq.topDepthM}-${aq.bottomDepthM}m) — grain size for screen/gravel pack`,
          method: isRock ? 'Core barrel (NQ/HQ) — continuous core' : 'Shelby tube (undisturbed)',
        });
      }
    });

    // Near TD
    const last = layers[layers.length - 1];
    intervals.push({
      from_m: Math.max(0, Math.min(last.bottomDepthM, depth) - 3),
      to_m: Math.min(last.bottomDepthM, depth),
      purpose: `Near TD (${last.lithology}) — confirm base of production zone`,
      method: isRock ? 'Core barrel (NQ/HQ)' : 'Disturbed sample',
    });
  } else {
    // Fallback: systematic depth-based (clearly flagged)
    intervals.push({ from_m: 0, to_m: Math.min(6, Math.round(depth * 0.05)),
      purpose: 'Overburden — sanitary seal [ESTIMATED INTERVAL — no geological column]',
      method: 'Disturbed sample (split spoon / drive tube)' });
    intervals.push({ from_m: Math.round(depth * 0.1), to_m: Math.round(depth * 0.2),
      purpose: 'Weathered zone [ESTIMATED — confirm during drilling]',
      method: isRock ? 'Core barrel (NQ/HQ)' : 'Drive tube / Shelby tube' });
    intervals.push({ from_m: Math.round(depth * 0.5), to_m: Math.round(depth * 0.7),
      purpose: 'Target aquifer [ESTIMATED DEPTH — adjust from drill cuttings]',
      method: isRock ? 'Core barrel (NQ/HQ) — continuous core' : 'Shelby tube' });
    intervals.push({ from_m: Math.round(depth * 0.85), to_m: Math.round(depth * 0.95),
      purpose: 'Confining layer [ESTIMATED — adjust from drill cuttings]',
      method: isRock ? 'Core barrel (NQ/HQ)' : 'Disturbed sample' });
  }

  // De-duplicate overlapping intervals
  const merged = intervals.reduce<CoreSamplingPlan['intervals']>((acc, iv) => {
    const ov = acc.find(a => a.from_m < iv.to_m && a.to_m > iv.from_m);
    if (ov) { ov.from_m = Math.min(ov.from_m, iv.from_m); ov.to_m = Math.max(ov.to_m, iv.to_m); ov.purpose += ' + ' + iv.purpose; }
    else { acc.push({ ...iv }); }
    return acc;
  }, []);

  const totalCore = merged.reduce((s, i) => s + (i.to_m - i.from_m), 0);

  const thinIntervals: string[] = [];
  if (isRock && input.geologicalLayers) {
    input.geologicalLayers.filter(l => l.isAquifer).forEach(aq => {
      thinIntervals.push(`${aq.topDepthM}-${Math.min(aq.topDepthM + 5, aq.bottomDepthM)}m (${aq.lithology} — mineral ID, fracture fill)`);
    });
  } else if (isRock) {
    thinIntervals.push(`${Math.round(depth * 0.5)}-${Math.round(depth * 0.55)}m (estimated aquifer zone)`);
  }

  return {
    recommended: true,
    intervals: merged,
    totalCoreLengths_m: Math.round(totalCore),
    estimatedCost_usd: [Math.round(totalCore * 80), Math.round(totalCore * 150)],
    analyses: [
      'Grain size distribution (sieve + hydrometer per ASTM D422)',
      'Moisture content (ASTM D2216)',
      'Atterberg limits (if clay present — ASTM D4318)',
      'Permeability test (falling head / constant head — ASTM D5084)',
      'Porosity (volumetric — ASTM D7263)',
      'Specific gravity (ASTM D854)',
      ...(isRock ? [
        'Unconfined compressive strength (UCS — ASTM D7012)',
        'Rock Quality Designation (RQD — ASTM D6032)',
        'Point load test (ISRM)',
      ] : []),
    ],
    thinSectionRequired: isRock,
    thinSectionIntervals: thinIntervals,
  };
}

// ════════════════════════════════════════════════════════════
// FIX #7: LOCATION-ADJUSTED COST MODEL
// ════════════════════════════════════════════════════════════

const REGIONAL_COST: Record<string, number> = {
  'ZA': 1.0, 'BW': 1.1, 'NA': 1.15, 'ZW': 0.85, 'MZ': 0.9,
  'KE': 0.95, 'TZ': 0.9, 'UG': 0.85, 'ET': 0.8, 'NG': 1.1,
  'GH': 1.0, 'SN': 0.95, 'ML': 0.85, 'NE': 0.9, 'TD': 0.95,
  'MW': 0.8, 'ZM': 0.9, 'AO': 1.3, 'CD': 0.85, 'CM': 0.95,
  'IN': 0.55, 'PK': 0.5, 'BD': 0.45, 'LK': 0.6, 'NP': 0.55,
  'MM': 0.5, 'VN': 0.6, 'TH': 0.75, 'ID': 0.65, 'PH': 0.7,
  'CN': 0.8, 'AF': 0.7,
  'SA': 1.4, 'AE': 1.5, 'OM': 1.3, 'YE': 0.9, 'JO': 1.2,
  'US': 2.0, 'CA': 1.9, 'MX': 0.8, 'BR': 1.0, 'CO': 0.75,
  'PE': 0.7, 'CL': 1.1, 'AR': 0.85,
  'GB': 2.2, 'DE': 2.0, 'FR': 1.9, 'ES': 1.5, 'IT': 1.6,
  'AU': 2.3, 'NZ': 2.0,
};

function getCostMultiplier(cc?: string): { multiplier: number; source: string } {
  if (cc && REGIONAL_COST[cc.toUpperCase()]) {
    return { multiplier: REGIONAL_COST[cc.toUpperCase()], source: `Country-adjusted (${cc.toUpperCase()})` };
  }
  return { multiplier: 1.0, source: 'Baseline (Southern Africa). Set country code for location-adjusted cost.' };
}

// ════════════════════════════════════════════════════════════
// MAIN ENGINE v2
// ════════════════════════════════════════════════════════════

export function computeWellDesign(input: WellDesignInput): WellDesignResult {
  const {
    recommendedDepth_m: depth,
    estimatedYield_m3hr: yield_m3hr,
    staticWaterLevel_m: swl,
    aquiferType,
    primaryRockType,
    soilType,
    hasPumpTestData,
    isFieldValidated,
  } = input;

  const provenance: WellDesignResult['dataProvenance'] = [];
  const notes: string[] = [];
  const yield_m3day = yield_m3hr * 24;

  // ─── YIELD PROVENANCE ───
  provenance.push({
    parameter: 'Estimated yield',
    source: hasPumpTestData ? 'field_measured' : 'estimated',
    note: input.yieldSource ?? (hasPumpTestData ? `${yield_m3hr} m³/hr from pump test` : `${yield_m3hr} m³/hr — ESTIMATED (image analysis + regional statistics). Pump test REQUIRED.`),
  });
  if (!hasPumpTestData) {
    notes.push(`CRITICAL: Design yield (${yield_m3hr} m³/hr) is estimated from satellite imagery and regional statistics, NOT from a pump test. 24-hour constant-rate pump test MANDATORY before procurement.`);
  }

  // ─── RESOLVE T, S: prefer field data ───
  const hasFieldT = !!(input.fieldTransmissivity_m2day && input.fieldTransmissivity_m2day > 0);
  const hasFieldS = !!(input.fieldStorativity && input.fieldStorativity > 0);
  const T_eff = input.fieldTransmissivity_m2day ?? input.transmissivity_m2day ?? 50;
  const S_eff = input.fieldStorativity ?? input.storativity ?? 0.05;
  const b_eff = input.aquiferThickness_m ?? 20;

  if (hasFieldT) {
    provenance.push({ parameter: 'Transmissivity', source: 'field_measured', note: `T = ${T_eff} m²/day from field pump test` });
  } else if (input.transmissivity_m2day) {
    provenance.push({ parameter: 'Transmissivity', source: 'estimated', note: `T = ${T_eff} m²/day from satellite model. NOT field-verified.` });
  } else {
    provenance.push({ parameter: 'Transmissivity', source: 'estimated', note: `T = 50 m²/day (DEFAULT). PUMP TEST REQUIRED.` });
    notes.push('CRITICAL: Transmissivity is a default value (50 m²/day). Conduct pump test for real T before procurement.');
  }

  if (hasFieldS) {
    provenance.push({ parameter: 'Storativity', source: 'field_measured', note: `S = ${S_eff} from field pump test` });
  } else {
    provenance.push({ parameter: 'Storativity', source: 'estimated', note: `S = ${S_eff} (${input.storativity ? 'satellite-derived' : 'DEFAULT'})` });
  }

  // ─── GRAIN SIZE: FIX #1 ───
  const grainSize = computeGrainSize(input);
  provenance.push({ parameter: 'Grain size distribution', source: grainSize.source, note: grainSize.note });
  if (grainSize.source === 'estimated') {
    notes.push('Grain size estimated from published literature — sieve analysis REQUIRED during drilling for final screen/gravel pack design.');
  }

  // ─── ROCK/SOIL ───
  const isRock = ['granite', 'basalt', 'gneiss', 'quartzite', 'dolerite', 'rhyolite'].some(r => primaryRockType.toLowerCase().includes(r));
  const isSoft = ['sandstone', 'alluvium', 'sand', 'clay', 'laterite', 'silt'].some(r => primaryRockType.toLowerCase().includes(r) || soilType.toLowerCase().includes(r));
  const drillingMethod = isRock ? 'Down-The-Hole (DTH) Air Hammer' : isSoft ? 'Mud Rotary' : 'DTH Air Hammer / Mud Rotary Combination';

  // ─── BOREHOLE DIAMETER ───
  const needsLarge = yield_m3hr > 5;
  const casingOD_mm = needsLarge ? 219 : 165;
  const casingOD_inches = needsLarge ? '8"(219mm)' : '6"(165mm)';
  const gpThickness = 50;
  const drillDiaMM = casingOD_mm + 2 * gpThickness + 20;
  const drillDiaInches = drillDiaMM >= 300 ? '12"(311mm)' : drillDiaMM >= 240 ? '10"(254mm)' : '8"(203mm)';
  const actualDrill = drillDiaMM >= 300 ? 311 : drillDiaMM >= 240 ? 254 : 203;
  const ratHole = Math.max(3, Math.round(depth * 0.05));
  const rw = input.wellRadius_m ?? (actualDrill / 2000);

  // ─── CASING (considers water chemistry for material selection) ───
  const surfCasingD = Math.min(12, Math.max(6, Math.round(depth * 0.1)));
  const casingKpa = depth * 9.81;
  const wqPH = input.waterQualityPH;
  const wqSulfate = input.waterQualitySulfate_mgL;
  const wqH2S = input.waterQualityH2S;

  // Material selection logic: depth + rock type + water chemistry
  let prodMat: CasingDesign['material'];
  let casingChemNote = '';
  if (wqPH !== undefined && wqPH < 5) {
    prodMat = 'Stainless Steel 304';
    casingChemNote = `Low pH water (${wqPH}) — uPVC and mild steel unsuitable. Stainless steel required.`;
    notes.push(`CASING: Acidic groundwater (pH=${wqPH}). Standard uPVC and GI steel will corrode. Stainless steel 304 specified.`);
  } else if (wqH2S || (wqSulfate !== undefined && wqSulfate > 1000)) {
    prodMat = 'Stainless Steel 304';
    casingChemNote = `${wqH2S ? 'H₂S detected' : `High sulfate (${wqSulfate} mg/L)`} — corrosion risk to standard steel.`;
    notes.push(`CASING: ${casingChemNote} Stainless steel specified.`);
  } else if (depth > 120 || isRock) {
    prodMat = 'Steel (API J55)';
    casingChemNote = 'Deep borehole / rock formation — steel required for structural integrity.';
  } else if (casingKpa > 800) {
    prodMat = 'uPVC Class 16';
    casingChemNote = 'High external pressure — Class 16 uPVC for collapse resistance.';
  } else {
    prodMat = 'uPVC Class 12';
    casingChemNote = 'Standard conditions — uPVC Class 12 adequate.';
  }
  if (wqPH === undefined) {
    notes.push('CASING: No water chemistry data provided. Casing material assumes neutral pH. Lab water analysis REQUIRED to confirm material suitability.');
  }
  // Casing material is an ENGINEERING SELECTION from (mostly modelled) water
  // chemistry -- it is never a field measurement (reviewer fix 2026-07-11).
  provenance.push({ parameter: 'Casing material', source: input.waterChemistryIsLab === true ? 'lab_tested' : 'estimated', note: casingChemNote + (wqPH === undefined ? ' Water chemistry NOT checked.' : input.waterChemistryIsLab === true ? '' : ' Based on modelled water chemistry — confirm with lab analysis.') });
  const wallT = prodMat.includes('Steel') || prodMat.includes('Stainless') ? 6.4 : prodMat.includes('16') ? 9.5 : 7.8;

  const casings: CasingDesign[] = [
    {
      material: 'Steel (API J55)', outerDiameter_mm: needsLarge ? 273 : 219,
      outerDiameter_inches: needsLarge ? '10"(273mm)' : '8"(219mm)',
      wallThickness_mm: 8.9, collapseStrength_kPa: 2400,
      depth_m: [0, surfCasingD],
      purpose: 'Surface protection — prevent collapse, seal shallow contamination',
      jointType: 'Threaded & coupled',
    },
    {
      material: prodMat, outerDiameter_mm: casingOD_mm, outerDiameter_inches: casingOD_inches,
      wallThickness_mm: wallT,
      collapseStrength_kPa: prodMat.includes('Steel') ? 2200 : prodMat.includes('16') ? 1600 : 1200,
      depth_m: [0, Math.round(depth * 0.55)],
      purpose: 'Production casing — structural integrity through overburden',
      jointType: prodMat.includes('Steel') ? 'Threaded & coupled (API)' : 'Solvent-welded / threaded',
    },
  ];

  // ─── SCREEN (uses real D10) ───
  const slotMM = Math.max(0.5, Math.min(3.0, Math.round(grainSize.D10 * 10) / 10));
  const slotInch = (slotMM / 25.4).toFixed(3) + '"';
  const scrType: ScreenDesign['type'] = yield_m3hr > 5 ? 'Wire-wound (Johnson)' : isRock ? 'Slotted PVC' : aquiferType.includes('alluvial') ? 'Wire-wound (Johnson)' : 'Slotted PVC';
  const scrMat = scrType.includes('Johnson') ? 'Stainless Steel 304 / 316' : 'uPVC Class 12';
  const scrLen = Math.max(3, Math.min(b_eff * 0.7, Math.round(depth * 0.3)));
  const scrTop = Math.round(depth * 0.55);
  const scrBot = Math.round(scrTop + scrLen);
  const openPct = scrType.includes('Johnson') ? 30 : 15;
  const scrArea = Math.PI * (casingOD_mm / 1000) * scrLen;
  const openArea = scrArea * openPct / 100;
  const entVel = (yield_m3hr / 3600) / openArea;

  // Material-specific entrance velocity limits (Driscoll 1986, Table 6-2)
  // Fine sand: 0.03 m/s, Medium sand: 0.04 m/s, Coarse sand/gravel: 0.05-0.06 m/s
  const maxEntVel = grainSize.D50 < 0.25 ? 0.03 : grainSize.D50 < 0.5 ? 0.04 : grainSize.D50 < 2.0 ? 0.05 : 0.06;

  const slotBasis = grainSize.source === 'lab_tested'
    ? `Slot = D10 from lab sieve: D10=${grainSize.D10.toFixed(3)}mm (Driscoll 1986).`
    : `[PROVISIONAL] Slot from ESTIMATED D10=${grainSize.D10.toFixed(3)}mm. DO NOT PROCURE SCREEN until lab sieve analysis (ASTM D422) confirms D10.`;

  const screen: ScreenDesign = {
    type: scrType, material: scrMat, outerDiameter_mm: casingOD_mm,
    slotSize_mm: slotMM, slotSize_inches: slotInch,
    openAreaPercent: openPct, length_m: scrLen, depth_m: [scrTop, scrBot],
    entranceVelocity_m_s: Math.round(entVel * 10000) / 10000,
    maxEntranceVelocity_m_s: maxEntVel,
    selectionBasis: slotBasis,
  };
  if (entVel > maxEntVel) notes.push(`Screen entrance velocity (${(entVel * 1000).toFixed(1)} mm/s) EXCEEDS ${maxEntVel * 1000} mm/s limit for D50=${grainSize.D50.toFixed(2)}mm material (Driscoll Table 6-2). Increase screen length or diameter.`);
  if (grainSize.source !== 'lab_tested') notes.push('SCREEN SLOT SIZE IS PROVISIONAL. Lab sieve analysis (ASTM D422) required before screen procurement.');

  // ─── GRAVEL PACK (real Cu) ───
  const isUniform = grainSize.Cu < 3;
  const frLow = isUniform ? 4 : 6;
  const frHigh = isUniform ? 6 : 9;
  const frLabel = `${frLow}-${frHigh} (${isUniform ? 'uniform' : 'graded'}, Cu=${grainSize.Cu.toFixed(1)})`;
  const pkMin = grainSize.D50 * frLow;
  const pkMax = grainSize.D50 * frHigh;
  const annVol = Math.PI * ((actualDrill / 2000) ** 2 - (casingOD_mm / 2000) ** 2) * scrLen;
  const gpReq = !isRock || aquiferType.includes('alluvial') || soilType.includes('sand');

  const gravelPack: GravelPackDesign = {
    required: gpReq,
    grainSize_mm: [Math.round(pkMin * 10) / 10, Math.round(pkMax * 10) / 10],
    filterRatio: frLabel, thickness_mm: gpThickness,
    material: 'Rounded silica gravel (washed, chlorine-disinfected)',
    volume_m3: Math.round(annVol * 1.3 * 100) / 100,
    placementMethod: depth > 60 ? 'Tremie pipe — bottom-up' : 'Gravity feed with agitation',
    selectionBasis: grainSize.source === 'lab_tested'
      ? `From lab sieve: D50(pack)=${((pkMin + pkMax) / 2).toFixed(1)}mm, ratio ${frLabel} (Driscoll 1986).`
      : `ESTIMATED from literature. Lab sieve REQUIRED. Ratio ${frLabel}.`,
  };

  // ─── SANITARY SEAL ───
  const sealD = Math.max(6, surfCasingD);
  const sanitarySeal = {
    type: 'Cement-bentonite grout', depth_m: sealD,
    material: 'Portland cement + 3-5% bentonite (w/c ratio 0.45-0.50)',
    purpose: `Seal 0-${sealD}m annular space (WHO 2006)`,
  };

  // ─── WELL LOSS: FIX #3 ───
  const wlResult = computeWellLoss(input, yield_m3day);
  provenance.push({ parameter: 'Well loss coefficient', source: wlResult.source === 'step_test' ? 'field_measured' : 'estimated', note: wlResult.note });
  if (wlResult.source === 'empirical') notes.push('Well loss empirically estimated. Step-drawdown test (≥3 steps) REQUIRED for accurate well loss.');

  // ─── DRAWDOWN ───
  const tSec = 24 * 3600;
  // Theis well function W(u). AUDIT FIX (2026-07-10): the u>=0.01 branch
  // previously used the A&S 5.1.53 SMALL-x polynomial coefficients inside
  // the LARGE-x rational form (a ~24x discontinuity). 5.1.53 is now applied
  // in its correct form (u<=1) and 5.1.56 for u>1.
  const wellFn = (uu: number) => uu < 0.01
    ? -0.5772 - Math.log(uu)
    : uu <= 1
      ? -0.5772 - Math.log(uu) + 0.99999193 * uu - 0.24991055 * uu ** 2 + 0.05519968 * uu ** 3 - 0.00976004 * uu ** 4 + 0.00107857 * uu ** 5
      : (Math.exp(-uu) / uu) *
        ((uu ** 4 + 8.5733287401 * uu ** 3 + 18.059016973 * uu ** 2 + 8.6347608925 * uu + 0.2677737343) /
         (uu ** 4 + 9.5733223454 * uu ** 3 + 25.6329561486 * uu ** 2 + 21.0996530827 * uu + 3.9584969228));
  const u = (S_eff * rw * rw) / (4 * T_eff * (tSec / 86400));
  const Wu = wellFn(u);

  // ─── PHYSICAL SANITY: the borehole geometry CAPS the pumping rate ───
  // CRITICAL FIX (2026-07-11): a low modelled transmissivity used to make
  // Theis/Cooper-Jacob return a drawdown of HUNDREDS of metres, and the pump
  // was then "installed" below the bottom of a 64 m hole (reviewer: 459 m
  // drawdown / 482 m pump depth). Physically, you cannot draw the water down
  // past the pump intake -- if the requested rate needs more drawdown than
  // the borehole can offer, the AQUIFER CANNOT SUSTAIN THAT RATE. So we cap
  // the design rate to what the available drawdown allows and warn loudly.
  const availDD = Math.max(1, depth - swl - 5); // usable drawdown to a 5 m pump-submergence margin
  const usableDD = availDD * 0.7;               // design to 70% of available (operating reserve)
  const cCoef = Math.max(0, wlResult.C);                 // well-loss coeff (day²/m⁵)
  // helper: max sustainable discharge (m³/hr) from geometry at a given T
  const qMaxAtT = (T: number): number => {
    const lg = Math.max(0.3, Math.log10(2.25 * T * (tSec / 86400) / (S_eff * rw * rw)));
    const a = (2.3 / (4 * Math.PI * T)) * lg;
    const qDay = cCoef > 1e-9
      ? (-a + Math.sqrt(a * a + 4 * cCoef * usableDD)) / (2 * cCoef)
      : usableDD / Math.max(1e-6, a);
    return Math.max(0.1, qDay / 24);
  };

  // ── ROOT-CAUSE TRANSMISSIVITY RECONCILIATION (2026-07-12 surgical audit) ──
  // A single desktop transmissivity is frequently the low-outlier that makes a
  // basement site look worthless (T=0.1 m²/day → 0.28 m³/hr) — or, from a
  // different engine, a high-outlier (146 m²/day → 18 m³/hr). Rather than patch
  // the YIELD downstream (a symptom), reconcile the DISEASE — T itself — against
  // the published regional tested-yield band, then derive yield, drawdown,
  // specific capacity and pump from that ONE consistent T. Field pump-test data
  // always overrides this (hasPumpTestData short-circuits it).
  let T_recon = T_eff;
  const band = input.regionalTestedYieldBand_m3hr;
  const qMaxModel = qMaxAtT(T_eff);
  if (band && band[0] > 0 && !input.hasPumpTestData) {
    if (qMaxModel < band[0] && yield_m3hr >= band[0]) {
      // low-T outlier: lift T so the regional floor becomes sustainable
      T_recon = T_eff * (band[0] / Math.max(1e-6, qMaxModel));
      notes.push(
        `TRANSMISSIVITY RECONCILED: the modelled T (${T_eff.toFixed(2)} m²/day) implied only ${qMaxModel.toFixed(2)} m³/hr — below the published ${band[0]}–${band[1]} m³/hr regional tested-yield floor. T revised to ${T_recon.toFixed(1)} m²/day so yield, drawdown and pump are consistent with real drilled outcomes. CONFIRM with a 24-h pump test.`,
      );
    }
  }

  // Cooper-Jacob term (for design-rate drawdown) from the RECONCILED T
  const cjLog = Math.max(0.3, Math.log10(2.25 * T_recon * (tSec / 86400) / (S_eff * rw * rw)));
  let qMaxSustainable_m3hr = qMaxAtT(T_recon);
  // high-T outlier: never advertise beyond the published regional ceiling
  if (band && band[1] > 0 && !input.hasPumpTestData && qMaxSustainable_m3hr > band[1]) {
    qMaxSustainable_m3hr = band[1];
  }

  // Design rate = min(requested, aquifer-limited)
  const aquiferLimited = yield_m3hr > qMaxSustainable_m3hr * 1.02;
  const designQ_m3hr = aquiferLimited ? Math.round(qMaxSustainable_m3hr * 100) / 100 : yield_m3hr;
  const designQ_m3day = designQ_m3hr * 24;
  if (aquiferLimited) {
    notes.push(
      `AQUIFER-LIMITED YIELD: transmissivity ${T_recon.toFixed(1)} m²/day sustains ~${qMaxSustainable_m3hr.toFixed(2)} m³/hr within the borehole's available drawdown (${availDD.toFixed(1)} m). Design rate set to ${designQ_m3hr} m³/hr. CONFIRM with a constant-rate pump test before selecting the pump.`,
    );
  }

  // Drawdown at the (capped) design rate, hard-limited to available drawdown
  const uDesign = (S_eff * rw * rw) / (4 * T_recon * (tSec / 86400));
  const theisDD = (designQ_m3day / (4 * Math.PI * T_recon)) * Math.max(0, wellFn(uDesign));
  const cjDD = (2.3 * designQ_m3day) / (4 * Math.PI * T_recon) * cjLog;
  const wellLossDesign = cCoef * designQ_m3day * designQ_m3day; // C·Q² at the design rate
  const aqDD = Math.min(availDD, Math.max(theisDD, cjDD));
  const totalDD = Math.min(availDD, aqDD + wellLossDesign);
  const dynWL = Math.min(depth - 3, swl + totalDD); // dynamic level can never sink below the hole
  // All downstream sizing uses the geometry-capped design rate
  const yield_m3hr_design = designQ_m3hr;
  const yield_m3day_design = designQ_m3day;

  // ─── FRICTION: FIX #4 (uses geometry-capped design rate) ───
  const Qm3s = yield_m3hr_design / 3600;
  const rpDia = input.riserPipeID_mm ?? (yield_m3hr_design > 10 ? 75 : yield_m3hr_design > 3 ? 50 : 40);
  const rpLen = input.riserPipeLength_m ?? Math.round(dynWL + 5);
  const rpMat = dynWL > 80 ? 'GI' : 'HDPE';
  const friction = computeFrictionLoss(Qm3s, rpDia / 1000, rpLen, rpMat);
  provenance.push({ parameter: 'Friction loss', source: 'published_literature', note: friction.note });

  // ─── TDH ───
  const delHead = input.deliveryHead_m ?? 5;
  const TDH = dynWL + friction.headLoss_m + delHead;

  // ─── PUMP: FIX #5 (sized for the sustainable design rate) ───
  const pSel = selectPump(yield_m3hr_design, TDH);
  const realEff = pSel.operatingPoint.eff_pct;
  provenance.push({ parameter: 'Pump efficiency', source: 'published_literature', note: `${realEff}% at Q=${pSel.operatingPoint.Q_m3hr} m³/hr, H=${pSel.operatingPoint.H_m}m from ${pSel.pump.name} curve.` });

  const motorkW = (Qm3s * 1000 * 9.81 * TDH) / ((realEff / 100) * 1000);
  const motorHP = motorkW * 1.341;
  const solar = pSel.pump.powerSource.includes('Solar') ? Math.round(motorkW * 1.5 * 10) / 10 : undefined;

  // ─── COST: FIX #7 ───
  const costAdj = getCostMultiplier(input.countryCode);
  provenance.push({ parameter: 'Cost estimates', source: input.countryCode ? 'published_literature' : 'estimated', note: `Multiplier: ${costAdj.multiplier}x. ${costAdj.source}` });
  const pCost: [number, number] = [Math.round(pSel.pump.costRange_usd[0] * costAdj.multiplier), Math.round(pSel.pump.costRange_usd[1] * costAdj.multiplier)];

  const pump: PumpDesign = {
    type: pSel.pump.type, make_model_suggestion: pSel.pump.name,
    motorRating_kW: Math.round(motorkW * 100) / 100, motorRating_hp: Math.round(motorHP * 100) / 100,
    // Installation/inlet depths are hard-bounded to the borehole (never below TD)
    installationDepth_m: Math.min(depth - 1, Math.round(dynWL + 5)),
    inletDepth_m: Math.min(depth - 1, Math.round(dynWL + 3)),
    designFlow_m3hr: yield_m3hr_design, totalDynamicHead_m: Math.round(TDH * 10) / 10,
    pumpEfficiency_pct: realEff, powerSource: pSel.pump.powerSource,
    solarPanels_kW: solar,
    riserPipe: { material: rpMat === 'GI' ? 'GI (galvanized iron)' : 'HDPE PN16', diameter_mm: rpDia, length_m: Math.min(depth, rpLen) },
    estimatedCost_usd: pCost,
  };

  // ─── DRAWDOWN RESULT ───
  const sc = totalDD > 0 ? yield_m3day_design / totalDD : 0;
  const scCls = sc > 100 ? 'Excellent' : sc > 50 ? 'Good' : sc > 10 ? 'Moderate' : sc > 1 ? 'Poor' : 'Very Poor';
  const margin = availDD > 0 ? Math.round((1 - totalDD / availDD) * 100) : 0;
  if (margin < 20 && margin >= 0) notes.push(`Low drawdown margin (${margin}%). Design rate is close to the aquifer's sustainable limit -- confirm with a pump test before committing to the pump.`);

  const drawdown: DrawdownAnalysis = {
    designPumpingRate_m3hr: yield_m3hr_design, designPumpingRate_m3day: Math.round(yield_m3day_design * 10) / 10,
    theis_drawdown_m: Math.round(Math.max(0, theisDD) * 100) / 100,
    cooperJacob_drawdown_m: Math.round(Math.max(0, cjDD) * 100) / 100,
    wellLoss_m: Math.round(wellLossDesign * 100) / 100,
    wellLossCoefficient_C: wlResult.C,
    wellLossSource: wlResult.source === 'step_test'
      ? `Step test (Jacob): C=${wlResult.C.toExponential(3)} day²/m⁵`
      : `Empirical (Kruseman & de Ridder 1994). STEP TEST REQUIRED.`,
    totalDrawdown_m: Math.round(Math.max(0, totalDD) * 100) / 100,
    dynamicWaterLevel_m: Math.round(Math.max(0, dynWL) * 100) / 100,
    availableDrawdown_m: Math.round(Math.max(0, availDD) * 100) / 100,
    drawdownMargin_pct: margin,
    specificCapacity_m3_day_m: Math.round(sc * 100) / 100,
    specificCapacity_class: scCls,
    pumpingDuration_hr: 24, safetyFactor: 1.5,
  };

  // ─── WELL DEVELOPMENT ───
  const devMeth = isRock ? 'Air-lift development' : gpReq ? 'Surging + airlifting (develop gravel pack)' : 'Airlift pumping with surge blocks';
  const wellDevelopment: WellDevelopmentPlan = {
    primaryMethod: devMeth,
    secondaryMethod: isRock ? 'Jetting at fracture zones' : 'Over-pumping at 150% design rate',
    estimatedDuration_hr: isRock ? 12 : 8,
    successCriteria: [
      'Sand content < 5 mg/L (NTU < 5)', 'Specific capacity stable for 2+ hours',
      'Yield within 10% of design rate', `Drawdown < ${Math.round(totalDD * 1.2)}m`,
    ],
    equipment: [
      `Air compressor (${Math.round(depth * 1.5)} CFM at ${Math.round(depth * 0.1)} bar)`,
      'Surge block (sized for casing ID)', 'Jetting tool (if needed)',
      'Sand trap / settling tank', 'Turbidity meter (NTU)',
      'Flow meter (electromagnetic)', 'Timer / data logger',
    ],
    steps: [
      'Install temporary airline and eductor pipe',
      `Airlift bottom-up (${Math.round(depth)}m to ${Math.round(depth * 0.5)}m)`,
      'Surge in screen zone (5-10 cycles per 3m interval)',
      `Pump at 50% (${(yield_m3hr * 0.5).toFixed(1)} m³/hr) for 2 hours`,
      `Increase to 100% (${yield_m3hr.toFixed(1)} m³/hr) for 2 hours`,
      `Increase to 150% (${(yield_m3hr * 1.5).toFixed(1)} m³/hr) for 1 hour`,
      'Monitor sand content and specific capacity at each step',
      'Continue until sand < 5 mg/L and yield stable',
    ],
  };

  // ─── CORE SAMPLING: FIX #6 ───
  const coreSampling = computeCoreSampling(input, depth, isRock);

  // ─── BOREHOLE LOG TEMPLATE ───
  const boreholeLogTemplate: BoreholeLogTemplate = {
    projectInfo: [
      { field: 'Project Name', instruction: 'Full project/client name' },
      { field: 'Borehole ID', instruction: 'Unique identifier (e.g., BH-001)' },
      { field: 'Date Started', instruction: 'DD/MM/YYYY' },
      { field: 'Date Completed', instruction: 'DD/MM/YYYY' },
      { field: 'GPS Coordinates', instruction: 'WGS84, decimal degrees, 6 places' },
      { field: 'Elevation (m a.s.l.)', instruction: 'GPS or survey datum' },
      { field: 'Drilling Company', instruction: 'Name, contact, license #' },
      { field: 'Drilling Method', instruction: drillingMethod },
      { field: 'Rig Type', instruction: 'Make, model, capacity' },
      { field: 'Bit Size', instruction: `${actualDrill}mm (${drillDiaInches})` },
      { field: 'Geologist Name', instruction: 'Name, registration #' },
      { field: 'Weather Conditions', instruction: 'Temp, humidity, rain' },
    ],
    logColumns: [
      'Depth From (m)', 'Depth To (m)', 'Rate of Penetration (m/hr)',
      'Lithology Description', 'Color (Munsell)', 'Grain Size',
      'Weathering Grade (I-VI)', 'Fractures (Y/N, orientation)',
      'Water Strike (m bgl)', 'Blow Yield (m³/hr)',
      'Drilling Fluid Loss/Gain', 'Casing/Screen',
      'Core Recovery %', 'RQD %', 'Sample Number', 'Remarks',
    ],
    depthIntervals_m: 1, totalDepth_m: depth + ratHole,
    waterStrikeFields: [
      'Depth of first strike (m bgl)', 'Depth of main strike (m bgl)',
      'Static water level (m bgl) after 24hr', 'Blow yield at strike (m³/hr)',
      'Water temperature (°C)', 'pH (field kit)', 'EC (µS/cm)', 'TDS (mg/L)',
    ],
    completionFields: [
      'Total drilled depth (m)', 'Final SWL (m bgl)',
      'Casing material and diameter', 'Screen type, length, slot size',
      'Gravel pack interval and size', 'Cement seal depth',
      'Development method and duration', 'Final yield (m³/hr)',
      'Specific capacity (m³/day/m)', 'Water sample taken (Y/N)',
      'Well head protection installed (Y/N)',
    ],
  };

  // ─── DRILLING COST (adjusted) ───
  const baseCost: [number, number] = isRock ? [80, 150] : [40, 90];
  const adjCost: [number, number] = [Math.round(baseCost[0] * costAdj.multiplier), Math.round(baseCost[1] * costAdj.multiplier)];
  const drillRate = isRock ? [3, 8] : [8, 20];
  const drillDays: [number, number] = [Math.round((depth + ratHole) / drillRate[1]), Math.round((depth + ratHole) / drillRate[0])];

  // ─── CONFIDENCE (strict scoring) ───
  const hasLabSieve = grainSize.source === 'lab_tested';
  const hasStepTest = wlResult.source === 'step_test';
  const hasGeoCol = !!(input.geologicalLayers && input.geologicalLayers.length >= 2);
  const fieldCount = [hasFieldT, hasFieldS, hasLabSieve, hasStepTest, hasGeoCol, hasPumpTestData, isFieldValidated].filter(Boolean).length;

  const confidence: WellDesignResult['designConfidence'] = fieldCount >= 5 ? 'HIGH' : fieldCount >= 3 ? 'MODERATE' : 'LOW';
  const missing = [!hasFieldT ? 'pump test (T,S)' : '', !hasLabSieve ? 'sieve analysis' : '', !hasStepTest ? 'step-drawdown test' : '', !hasGeoCol ? 'geological column' : ''].filter(Boolean);

  const confNote = confidence === 'HIGH'
    ? `Design based on ${fieldCount}/7 field-verified parameters. Suitable for detailed engineering.`
    : confidence === 'MODERATE'
      ? `${fieldCount}/7 field parameters verified. Missing: ${missing.join(', ')}.`
      : `PRE-FEASIBILITY SCREENING ONLY (${fieldCount}/7 field parameters). Missing: ${missing.join(', ')}. ALL values must be confirmed by field investigation.`;

  if (!hasPumpTestData) notes.push('CRITICAL: 24-hour constant-rate pump test required before finalizing pump selection.');
  if (!hasStepTest) notes.push('Step-drawdown test (≥3 steps) required for actual well loss coefficient.');
  if (!hasLabSieve) notes.push('Lab sieve analysis (ASTM D422) required for final screen slot size and gravel pack.');
  notes.push(`Costs: ${costAdj.source}. Obtain contractor quotations for final budgeting.`);
  notes.push('Assumes single-aquifer production. Revise screen placement if multiple aquifers intersected.');

  // ═══════════════════════════════════════════════════════════
  // v3: COMPREHENSIVE ENGINEERING CALCULATIONS
  // All sections compute ALWAYS — using lab data when available, smart estimates when not.
  // Every result is provenance-tagged so PE/PG knows what's measured vs estimated.
  // ═══════════════════════════════════════════════════════════

  // ─── WATER CHEMISTRY INDICES (LSI/RSI/AI) ─── ALWAYS COMPUTED
  // FIX (reviewer 2026-07-11): only accredited-lab chemistry counts as
  // lab_tested. A modelled waterChemistry object (built from remote-sensing
  // water quality) must NOT be labelled "From certified lab data".
  const hasLabChem = !!input.waterChemistry && input.waterChemistryIsLab === true;
  const hasPHOnly = !hasLabChem && input.waterQualityPH !== undefined;
  const chemInput: WaterChemistryInput = input.waterChemistry ?? {
    pH: input.waterQualityPH ?? 7.0,
    temperature_C: input.waterTemperature_C ?? 22,
    tds_mgL: 400, // Default fresh groundwater
    sulfate_mgL: input.waterQualitySulfate_mgL,
    h2s_detected: input.waterQualityH2S,
  };
  const waterChemResult = computeWaterChemistry(chemInput);
  provenance.push({
    parameter: 'Water chemistry indices (LSI/RSI/AI)',
    source: hasLabChem ? 'lab_tested' : hasPHOnly ? 'estimated' : 'estimated',
    note: `LSI=${waterChemResult.langelierSaturationIndex}, RSI=${waterChemResult.ryznarStabilityIndex}. ${
      hasLabChem ? 'From certified lab data.'
      : hasPHOnly ? 'From field-measured pH. Full lab analysis recommended for confirmation.'
      : 'ESTIMATED from default pH 7.0, TDS 400 mg/L. Lab water analysis REQUIRED for accurate corrosion/scaling assessment and casing material selection.'
    }`,
  });
  waterChemResult.warnings.forEach(w => notes.push(w));
  if (!hasLabChem) {
    notes.push(hasPHOnly
      ? 'WATER CHEMISTRY: Indices computed from field pH only. Full lab analysis recommended to confirm casing material and treatment needs.'
      : 'WATER CHEMISTRY: Indices estimated from default values (pH 7.0, TDS 400 mg/L). Lab water analysis REQUIRED before final design. Casing material selection is PROVISIONAL.'
    );
  }

  // ─── LSI-BASED CASING MATERIAL OVERRIDE ───
  // Audit fix #4: If LSI < -1.0 (corrosive), upgrade casing material regardless of depth/rock logic
  const computedLSI = waterChemResult.langelierSaturationIndex ?? 0;
  if (computedLSI < -1.0 && prodMat === 'Steel (API J55)') {
    if (computedLSI < -2.0) {
      prodMat = 'Stainless Steel 316L' as any;
      casingChemNote = `CORROSION OVERRIDE: LSI = ${computedLSI} (severely corrosive). Standard steel will fail prematurely. SS316L required.`;
      notes.push(`CASING: LSI = ${computedLSI} (severely corrosive). Standard API J55 steel REJECTED. Stainless Steel 316L specified — higher upfront cost but prevents early casing failure.`);
    } else {
      prodMat = 'HDPE (PE100 SDR11)' as any;
      casingChemNote = `CORROSION OVERRIDE: LSI = ${computedLSI} (moderately corrosive). HDPE specified instead of steel.`;
      notes.push(`CASING: LSI = ${computedLSI} (moderately corrosive). Standard API J55 steel not recommended. HDPE (PE100 SDR11) specified.`);
    }
    // Update the production casing entry
    for (const c of casings) {
      if (c.depth_m[0] !== 0 || c.depth_m[1] > surfCasingD) {
        c.material = prodMat;
      }
    }
  }

  // ─── NPSH VERIFICATION ───
  const elevation = input.elevation_m ?? 1200; // Default sub-Saharan Africa plateau
  const waterTemp = input.waterTemperature_C ?? 22;
  const pumpMinFlow = yield_m3hr_design * 0.3; // Typical minimum flow = 30% of rated
  const npshResult = computeNPSH(
    elevation, waterTemp, pump.installationDepth_m,
    dynWL, friction.headLoss_m, pumpMinFlow, yield_m3hr_design
  );
  provenance.push({
    parameter: 'NPSH (pump cavitation check)',
    // FIX (reviewer 2026-07-11): NPSH is a CALCULATION from modelled inputs
    // (SRTM elevation is satellite-derived, not surveyed) -- never
    // "field_measured" unless a real survey elevation was supplied.
    source: input.elevationIsFieldMeasured === true ? 'field_measured' : 'estimated',
    note: npshResult.recommendation + (input.elevationIsFieldMeasured === true ? '' : ' (elevation from SRTM DEM, not surveyed — calculation is a desktop estimate).'),
  });
  if (!npshResult.isSafe) {
    notes.push(`CRITICAL: ${npshResult.recommendation}`);
  }

  // ─── ANNULAR GROUT DESIGN ───
  const sulfateForGrout = input.waterQualitySulfate_mgL ?? 0;
  const isConfined = aquiferType.toLowerCase().includes('confined');
  const groutResult = computeGroutDesign(
    actualDrill / 2000, casingOD_mm / 2000,
    0, sealD,
    sulfateForGrout, isConfined
  );
  groutResult.warnings.forEach(w => notes.push(w));

  // ─── ENVIRONMENTAL SETBACK ANALYSIS ─── ALWAYS COMPUTED
  // Use user-provided sources, or generate typical rural contamination scenario
  const hasUserContSources = input.contaminationSources && input.contaminationSources.length > 0;
  const contSources = hasUserContSources ? input.contaminationSources! : [
    { type: 'pit_latrine', estimatedDistance_m: 30 },
    { type: 'septic_tank', estimatedDistance_m: 25 },
    { type: 'agriculture', estimatedDistance_m: 100 },
    { type: 'livestock', estimatedDistance_m: 50 },
  ];
  const K_eff_setback = input.hydraulicConductivity_m_day ?? T_eff / b_eff;
  const gradient_setback = input.hydraulicGradient ?? 0.01;
  const porosity_setback = input.effectivePorosity ?? 0.2;
  const setbackResult = computeSetbackAnalysis(
    contSources, aquiferType,
    soilType, swl, K_eff_setback, gradient_setback, porosity_setback,
    yield_m3day, input.countryCode
  );
  setbackResult.recommendations.forEach(r => notes.push(r));
  if (!setbackResult.overallCompliance) {
    notes.push('WARNING: Setback distance requirements NOT MET for assumed contamination sources. Contamination risk is elevated. Site survey required to confirm actual distances.');
  }
  if (!hasUserContSources) {
    notes.push('SETBACK: Analysis based on ASSUMED typical rural contamination sources (pit latrine 30m, septic 25m, agriculture 100m, livestock 50m). Conduct site reconnaissance to confirm actual contamination source locations and distances.');
  }
  provenance.push({
    parameter: 'Environmental setback analysis',
    source: hasUserContSources ? 'field_measured' : 'estimated',
    note: hasUserContSources
      ? `Based on ${input.contaminationSources!.length} identified sources. GOD vulnerability: ${setbackResult.vulnerabilityClass}.`
      : 'ESTIMATED — Typical rural contamination scenario assumed. Site survey needed to verify actual source locations.',
  });

  // ─── DRILLING PLAN ───
  const drillingPlan = computeDrillingPlan(
    depth, primaryRockType, soilType, aquiferType,
    swl, actualDrill, input.isRemoteSite ?? false
  );
  drillingPlan.warnings.forEach(w => notes.push(w));

  // ─── DEMAND & SUSTAINABILITY ANALYSIS ─── ALWAYS COMPUTED
  // Estimate population if not provided (typical rural community = 500)
  const estPopulation = input.populationServed ?? 500;
  const hasUserPop = !!input.populationServed;
  const demandResult = computeDemandAnalysis(
    yield_m3hr,
    estPopulation,
    input.growthRate_pct ?? 2.5,
    input.perCapitaDemand_Lpd ?? 50,
    input.annualRecharge_mm ?? (input.precipitation_mm_yr ? input.precipitation_mm_yr * 0.15 : 100),
    input.catchmentArea_km2 ?? 5,
    input.graceTrend_cmYr,
    8 // pumping hours/day
  );
  if (demandResult.yieldAdequacy_current.includes('INSUFFICIENT')) {
    notes.push(`DEMAND: Current supply insufficient. ${demandResult.yieldAdequacy_current}`);
  }
  demandResult.adaptationActions.forEach(a => notes.push(`SUSTAINABILITY: ${a}`));
  if (!hasUserPop) {
    notes.push('DEMAND: Population assumed 500 (typical rural community). Adjust for actual served population. Demand projections are PROVISIONAL until population is confirmed.');
  }
  provenance.push({
    parameter: 'Demand & sustainability analysis',
    source: hasUserPop ? 'estimated' : 'estimated',
    note: hasUserPop
      ? `Based on ${input.populationServed} persons at ${input.perCapitaDemand_Lpd ?? 50} L/p/d. Growth rate: ${input.growthRate_pct ?? 2.5}%/yr.`
      : 'ESTIMATED — Population 500 assumed. Per capita demand 50 L/p/d (WHO minimum). Growth rate 2.5%/yr. Update with actual demographic data.',
  });

  // ─── AQUIFER BOUNDARY ASSESSMENT ─── ALWAYS COMPUTED
  // Infer boundary features from geological layers when no user data
  const userFeatures = input.nearbyFeatures ?? [];
  const inferredFeatures: { type: string; distance_m: number }[] = [...userFeatures];
  if (inferredFeatures.length === 0 && input.geologicalLayers) {
    // Infer from geology: clay layers suggest barrier, fractured zones suggest leaky boundary
    const layers = input.geologicalLayers;
    const hasThickClay = layers.some(l =>
      l.lithology.toLowerCase().includes('clay') && (l.bottomDepthM - l.topDepthM) > 5
    );
    const hasFault = layers.some(l =>
      l.lithology.toLowerCase().includes('fault') || l.lithology.toLowerCase().includes('fracture')
    );
    if (hasThickClay) inferredFeatures.push({ type: 'clay_boundary', distance_m: 500 });
    if (hasFault) inferredFeatures.push({ type: 'fault', distance_m: 300 });
    if (aquiferType.toLowerCase().includes('unconfined')) {
      inferredFeatures.push({ type: 'river', distance_m: 1000 }); // Assume recharge boundary
    }
  }
  const boundaryResult = assessAquiferBoundaries(
    aquiferType, inferredFeatures, 24, T_eff, S_eff
  );
  boundaryResult.warnings.forEach(w => notes.push(w));
  if (boundaryResult.yieldAdjustmentFactor !== 1.0) {
    notes.push(`BOUNDARY: ${boundaryResult.correctionMethod} Yield adjustment factor: ${boundaryResult.yieldAdjustmentFactor}.`);
  }
  if (userFeatures.length === 0) {
    notes.push('BOUNDARY: Assessment based on inferred geological features. Field reconnaissance should confirm proximity to rivers, faults, or impermeable boundaries.');
  }
  provenance.push({
    parameter: 'Aquifer boundary assessment',
    source: userFeatures.length > 0 ? 'field_measured' : 'estimated',
    note: `Boundary type: ${boundaryResult.boundaryType}. Yield factor: ${boundaryResult.yieldAdjustmentFactor}. ${
      userFeatures.length > 0 ? 'Based on surveyed features.' : 'Inferred from geological model — verify in field.'
    }`,
  });

  // ─── MONITORING & O&M PLAN ───
  const ironRisk = (waterChemResult?.ironBacteriaRisk ?? '').includes('HIGH') || (waterChemResult?.ironBacteriaRisk ?? '').includes('MODERATE');
  const monitoringResult = computeMonitoringPlan(
    yield_m3hr, pSel.pump.type, ironRisk, depth, costAdj.multiplier
  );

  // ─── LIFECYCLE COST ───
  const treatmentCostEst = (waterChemResult?.treatmentRequired ?? []).length > 0 ? 1500 * costAdj.multiplier : 0;
  const lifecycleResult = computeLifecycleCost(
    depth, adjCost, pCost, treatmentCostEst,
    yield_m3hr, monitoringResult.annualMonitoringCost_usd,
    costAdj.multiplier, 8
  );

  // ─── PUMP TEST PROTOCOL ───
  // Pump-test rates MUST be driven by the aquifer-reconciled design yield, not the
  // raw ensemble input yield. Passing the un-reconciled yield_m3hr produced step
  // rates (e.g. 1.2→6.1 m³/hr) an order of magnitude above a low-yield borehole's
  // sustainable rate — a schedule that would dewater the hole and yield nonsense.
  const pumpTestProto = generatePumpTestProtocol(yield_m3hr_design, depth, aquiferType);

  // ─── WELLHEAD SPEC ───
  const wellheadResult = computeWellheadSpec(pSel.pump.type, yield_m3hr);

  // ─── ABANDONMENT PROTOCOL ───
  const abandonResult = computeAbandonmentProtocol(depth, casingOD_mm, costAdj.multiplier);

  return {
    boreholeSpecifications: {
      drillingMethod, drillingDiameter_mm: actualDrill, drillingDiameter_inches: drillDiaInches,
      totalDepth_m: depth + ratHole, ratHole_m: ratHole, pilotHole: depth > 80,
      estimatedDrillingDays: drillDays, drillingCostPerMeter_usd: adjCost,
    },
    casing: casings, screen, gravelPack, sanitary_seal: sanitarySeal,
    pump, wellDevelopment, drawdown, coreSampling, boreholeLogTemplate,
    designStandards: [
      'BS EN ISO 22475-1:2006 — Geotechnical investigation and testing',
      'ASTM D5092-04 — Design and installation of monitoring wells',
      'ASTM D422 — Particle-size analysis of soils',
      'Driscoll, F.G. (1986) Groundwater and Wells, 2nd ed.',
      'Kruseman & de Ridder (1994) Analysis and Evaluation of Pumping Test Data',
      'Roscoe Moss (1990) Handbook of Ground Water Development',
      'Todd & Mays (2005) Groundwater Hydrology, 3rd ed.',
      'WHO (2006) Protecting Groundwater for Health',
      'Langelier, W.F. (1936) Analytical control of anti-corrosion water treatment',
      'Ryznar, J.W. (1944) New index for CaCO₃ scale',
      'API RP 65 — Cementing Shallow Water Flow Zones',
      'ANSI/HI 9.6.1 — Rotodynamic Pumps NPSH Margin',
      'Foster et al. (2002) GOD vulnerability method',
      'ASTM D5299 — Decommissioning of Ground Water Wells',
      'ASTM D5521 — Development of ground-water monitoring wells',
      'ISO 14686 — Hydrometric determinations, pumping tests',
      ...(isRock ? ['ISRM (1981) Rock Characterization Testing and Monitoring'] : []),
    ],
    designNotes: notes,
    designConfidence: confidence,
    confidenceNote: confNote,
    dataProvenance: provenance,
    // v3 engineering results
    waterChemistryIndices: waterChemResult,
    npshCheck: npshResult,
    groutDesign: groutResult,
    setbackAnalysis: setbackResult,
    drillingPlan,
    demandAnalysis: demandResult,
    monitoringPlan: monitoringResult,
    lifecycleCost: lifecycleResult,
    boundaryAssessment: boundaryResult,
    pumpTestProtocol: pumpTestProto,
    wellheadSpec: wellheadResult,
    abandonmentProtocol: abandonResult,
  };
}
