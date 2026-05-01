/**
 * SMART SURVEY PLANNER
 * 
 * AI-driven survey optimization that answers:
 * "WHICH geophysical surveys should I run, and WHERE?"
 * 
 * Instead of blanketing a site with every survey method:
 * 1. AI screens the site (remote sensing, geology, vegetation)
 * 2. Identifies TOP 1-3 drilling candidates
 * 3. Recommends TARGETED geophysics only where needed
 * 4. Result: 80% cost reduction vs traditional full-site surveys
 * 
 * Philosophy: "You don't beat geophysics. You OPTIMIZE IT WITH AI."
 * 
 * Tier 1 ($):   AI Screening only → 70% accuracy
 * Tier 2 ($$):  AI + Targeted ERT (1-2 lines) → 85% accuracy  
 * Tier 3 ($$$): AI + ERT + Pump Test + Lab → 90-95% accuracy
 */

export interface SurveyRecommendation {
  method: string;
  priority: 'essential' | 'recommended' | 'optional' | 'not_needed';
  reason: string;
  costEstimateUSD: number;
  timeEstimateHrs: number;
  /** Where to deploy: GPS coordinates or description */
  deploymentLocation: string;
  /** Expected confidence gain (%) */
  expectedConfidenceGain: number;
  /** Cost per % confidence gain */
  costPerConfidencePercent: number;
}

export interface SmartSurveyPlan {
  /** Tier recommendation */
  recommendedTier: 1 | 2 | 3;
  tierName: string;
  tierDescription: string;
  /** Total estimated cost */
  totalCostUSD: number;
  /** Estimated time to complete all surveys */
  totalTimeHrs: number;
  /** Expected final confidence */
  expectedConfidence: number;
  /** Cost savings vs full survey */
  costSavingsPercent: number;
  /** Individual survey recommendations */
  surveys: SurveyRecommendation[];
  /** AI reasoning */
  reasoning: string[];
  /** Where to drill (GPS coordinates) */
  recommendedDrillPoints: { lat: number; lon: number; rank: number; confidence: number; reason: string }[];
  /** Risk factors that affect survey needs */
  riskFactors: string[];
}

export interface SurveyPlannerInput {
  lat: number;
  lon: number;
  /** Current AI-only confidence (0-100) */
  aiConfidence: number;
  /** Rock type from classifier */
  rockType?: string;
  /** Terrain slope % */
  slopePercent?: number;
  /** Recharge estimate mm/yr */
  rechargeEstimate_mm_yr?: number;
  /** Weathering depth m */
  weatheringDepthM?: number;
  /** Water table depth estimate m */
  waterTableDepthM?: number;
  /** Client's required yield m³/hr */
  requiredYield_m3hr?: number;
  /** Budget constraint USD */
  budgetUSD?: number;
  /** Target confidence level (70-95) */
  targetConfidence?: number;
  /** Top candidate drill sites from AI */
  candidateSites?: { lat: number; lon: number; score: number }[];
  /** Any existing field data */
  existingFieldData?: string[];
  /** Lineament detected */
  lineamentDetected?: boolean;
  /** GRACE TWS trend */
  graceTrend_cm_yr?: number;
}

/* ─── Survey cost database (typical Southern/East Africa prices) ─── */
const SURVEY_COSTS: Record<string, { baseCostUSD: number; perStationUSD: number; timeHrs: number; typicalStations: number }> = {
  ert_short:       { baseCostUSD: 800,  perStationUSD: 15,  timeHrs: 4,  typicalStations: 48 },
  ert_long:        { baseCostUSD: 1200, perStationUSD: 15,  timeHrs: 8,  typicalStations: 96 },
  em_tdem:         { baseCostUSD: 600,  perStationUSD: 40,  timeHrs: 4,  typicalStations: 10 },
  seismic_refrac:  { baseCostUSD: 1500, perStationUSD: 25,  timeHrs: 8,  typicalStations: 24 },
  seismic_masw:    { baseCostUSD: 1200, perStationUSD: 30,  timeHrs: 6,  typicalStations: 24 },
  gpr:             { baseCostUSD: 500,  perStationUSD: 5,   timeHrs: 3,  typicalStations: 100 },
  magnetic:        { baseCostUSD: 400,  perStationUSD: 8,   timeHrs: 4,  typicalStations: 50 },
  gravity:         { baseCostUSD: 2000, perStationUSD: 50,  timeHrs: 12, typicalStations: 30 },
  nmr_surface:     { baseCostUSD: 5000, perStationUSD: 200, timeHrs: 16, typicalStations: 5 },
  pump_test_24hr:  { baseCostUSD: 3000, perStationUSD: 0,   timeHrs: 30, typicalStations: 1 },
  lab_water:       { baseCostUSD: 300,  perStationUSD: 0,   timeHrs: 72, typicalStations: 1 },
};

const FULL_SURVEY_COST_USD = 15000; // Typical cost for full geophysical investigation

/**
 * Generate an AI-optimized survey plan.
 */
export function generateSmartSurveyPlan(input: SurveyPlannerInput): SmartSurveyPlan {
  const surveys: SurveyRecommendation[] = [];
  const reasoning: string[] = [];
  const riskFactors: string[] = [];

  const rock = (input.rockType ?? 'unknown').toLowerCase();
  const aiConf = input.aiConfidence;
  const targetConf = input.targetConfidence ?? 85;
  const budget = input.budgetUSD ?? Infinity;

  // ─── Terrain & Geology Assessment ───
  const isCrystalline = ['granite', 'gneiss', 'basalt', 'schist', 'quartzite', 'dolerite'].some(r => rock.includes(r));
  const isSedimentary = ['sandstone', 'limestone', 'shale', 'alluvium', 'sand', 'gravel', 'dolomite'].some(r => rock.includes(r));
  const isKarst = rock.includes('limestone') || rock.includes('dolomite');
  const isDeepWeathering = (input.weatheringDepthM ?? 15) > 25;
  const isShallowWater = (input.waterTableDepthM ?? 15) < 10;
  const isHighYieldNeeded = (input.requiredYield_m3hr ?? 1) > 5;

  // Risk assessment
  if (isCrystalline && !isDeepWeathering) riskFactors.push('Shallow weathering in crystalline terrain — higher drilling risk');
  if (isKarst) riskFactors.push('Karst terrain — void risk, unpredictable aquifer geometry');
  if (input.graceTrend_cm_yr != null && input.graceTrend_cm_yr < -1) riskFactors.push('Declining groundwater storage (GRACE) — sustainability concern');
  if ((input.slopePercent ?? 0) > 15) riskFactors.push('Steep terrain — limited drill rig access');
  if (isHighYieldNeeded) riskFactors.push('High yield requirement — needs confirmed aquifer properties');

  // ─── Survey Recommendations ───

  // 1. ERT — Almost always recommended for groundwater
  const ertPriority = isCrystalline || isHighYieldNeeded || aiConf < 70 ? 'essential' : 'recommended';
  const ertType = isDeepWeathering || (input.waterTableDepthM ?? 15) > 50 ? 'ert_long' : 'ert_short';
  const ertCost = SURVEY_COSTS[ertType];
  const site0 = input.candidateSites?.[0];
  const ertLocation = site0 && typeof site0.lat === 'number' && typeof site0.lon === 'number'
    ? `Along AI-selected drill point #1 (${site0.lat.toFixed(4)}, ${site0.lon.toFixed(4)})`
    : `Across primary target zone at (${input.lat.toFixed(4)}, ${input.lon.toFixed(4)})`;
  
  surveys.push({
    method: `ERT (${ertType === 'ert_long' ? '960m' : '480m'} line)`,
    priority: ertPriority,
    reason: isCrystalline
      ? 'Essential for fracture zone detection in crystalline rock'
      : 'Maps aquifer geometry and water-bearing layers',
    costEstimateUSD: ertCost.baseCostUSD + ertCost.perStationUSD * ertCost.typicalStations,
    timeEstimateHrs: ertCost.timeHrs,
    deploymentLocation: ertLocation,
    expectedConfidenceGain: 15,
    costPerConfidencePercent: Math.round((ertCost.baseCostUSD + ertCost.perStationUSD * ertCost.typicalStations) / 15),
  });
  reasoning.push(`ERT ${ertPriority}: ${ertType === 'ert_long' ? 'Deep investigation needed' : 'Standard depth sufficient'} for ${rock} terrain`);

  // 2. EM/TDEM — Good complement to ERT
  if (isCrystalline || isDeepWeathering) {
    const emCost = SURVEY_COSTS.em_tdem;
    surveys.push({
      method: 'EM/TDEM (5-10 soundings)',
      priority: isCrystalline ? 'recommended' : 'optional',
      reason: 'Rapid depth-to-bedrock mapping, complements ERT for fracture detection',
      costEstimateUSD: emCost.baseCostUSD + emCost.perStationUSD * emCost.typicalStations,
      timeEstimateHrs: emCost.timeHrs,
      deploymentLocation: 'Grid around top 2 AI drill candidates',
      expectedConfidenceGain: 8,
      costPerConfidencePercent: Math.round((emCost.baseCostUSD + emCost.perStationUSD * emCost.typicalStations) / 8),
    });
    reasoning.push('EM/TDEM: Rapid mapping of conductive layers in crystalline terrain');
  }

  // 3. Seismic — For deep bedrock and fracture characterization
  if (isCrystalline && !isDeepWeathering) {
    const seisCost = SURVEY_COSTS.seismic_refrac;
    surveys.push({
      method: 'Seismic Refraction (24 geophones)',
      priority: 'recommended',
      reason: 'Precise bedrock depth and fracture zone detection in hard rock',
      costEstimateUSD: seisCost.baseCostUSD + seisCost.perStationUSD * seisCost.typicalStations,
      timeEstimateHrs: seisCost.timeHrs,
      deploymentLocation: 'Parallel to ERT line, offset 20m',
      expectedConfidenceGain: 9,
      costPerConfidencePercent: Math.round((seisCost.baseCostUSD + seisCost.perStationUSD * seisCost.typicalStations) / 9),
    });
    reasoning.push('Seismic: Hard rock with shallow weathering — need precise bedrock/fracture depth');
  } else {
    surveys.push({
      method: 'Seismic Refraction',
      priority: 'not_needed',
      reason: isSedimentary ? 'Not cost-effective for sedimentary terrain (ERT sufficient)' : 'Deep weathering provides adequate aquifer without seismic',
      costEstimateUSD: 0,
      timeEstimateHrs: 0,
      deploymentLocation: 'N/A',
      expectedConfidenceGain: 0,
      costPerConfidencePercent: 0,
    });
  }

  // 4. GPR — For shallow features and karst
  if (isKarst || isShallowWater) {
    const gprCost = SURVEY_COSTS.gpr;
    surveys.push({
      method: 'GPR (400 MHz antenna)',
      priority: isKarst ? 'essential' : 'recommended',
      reason: isKarst ? 'Critical for void/cavity detection in karst terrain' : 'Shallow water table confirmation',
      costEstimateUSD: gprCost.baseCostUSD + gprCost.perStationUSD * gprCost.typicalStations,
      timeEstimateHrs: gprCost.timeHrs,
      deploymentLocation: 'Grid pattern over top AI candidate, 200m × 200m',
      expectedConfidenceGain: isKarst ? 8 : 5,
      costPerConfidencePercent: Math.round((gprCost.baseCostUSD + gprCost.perStationUSD * gprCost.typicalStations) / (isKarst ? 8 : 5)),
    });
    reasoning.push(isKarst ? 'GPR essential: Karst terrain requires void detection before drilling' : 'GPR: Confirm shallow water table');
  } else {
    surveys.push({
      method: 'GPR',
      priority: 'not_needed',
      reason: 'Water table too deep for GPR penetration (>15m in most soils)',
      costEstimateUSD: 0,
      timeEstimateHrs: 0,
      deploymentLocation: 'N/A',
      expectedConfidenceGain: 0,
      costPerConfidencePercent: 0,
    });
  }

  // 5. Magnetic survey — For fault/dyke detection
  if (input.lineamentDetected || isCrystalline) {
    const magCost = SURVEY_COSTS.magnetic;
    surveys.push({
      method: 'Magnetic Survey (proton magnetometer)',
      priority: input.lineamentDetected ? 'recommended' : 'optional',
      reason: 'Lineament/fault detection — structural controls on groundwater flow',
      costEstimateUSD: magCost.baseCostUSD + magCost.perStationUSD * magCost.typicalStations,
      timeEstimateHrs: magCost.timeHrs,
      deploymentLocation: 'Perpendicular to satellite-detected lineament direction',
      expectedConfidenceGain: 7,
      costPerConfidencePercent: Math.round((magCost.baseCostUSD + magCost.perStationUSD * magCost.typicalStations) / 7),
    });
    reasoning.push('Magnetic survey: Confirm satellite-detected lineaments as structural features');
  }

  // 6. NMR — Only for high-value or high-risk projects
  if (isHighYieldNeeded && budget > 8000) {
    const nmrCost = SURVEY_COSTS.nmr_surface;
    surveys.push({
      method: 'Surface NMR (MRS)',
      priority: 'optional',
      reason: 'Direct water detection — only method that sees water molecules. High cost but eliminates guesswork.',
      costEstimateUSD: nmrCost.baseCostUSD + nmrCost.perStationUSD * nmrCost.typicalStations,
      timeEstimateHrs: nmrCost.timeHrs,
      deploymentLocation: 'Single sounding at AI top-ranked drill point',
      expectedConfidenceGain: 15,
      costPerConfidencePercent: Math.round((nmrCost.baseCostUSD + nmrCost.perStationUSD * nmrCost.typicalStations) / 15),
    });
    reasoning.push('Surface NMR: High yield requirement justifies direct water detection');
  }

  // 7. Pump test — Always recommended for production boreholes
  if (isHighYieldNeeded || targetConf >= 90) {
    const ptCost = SURVEY_COSTS.pump_test_24hr;
    surveys.push({
      method: '24-hour Pump Test',
      priority: targetConf >= 90 ? 'essential' : 'recommended',
      reason: 'Confirms sustainable yield and aquifer properties — required for bankable reports',
      costEstimateUSD: ptCost.baseCostUSD,
      timeEstimateHrs: ptCost.timeHrs,
      deploymentLocation: 'At completed borehole',
      expectedConfidenceGain: 12,
      costPerConfidencePercent: Math.round(ptCost.baseCostUSD / 12),
    });
  }

  // 8. Lab water analysis — Essential for drinking water projects
  surveys.push({
    method: 'Laboratory Water Analysis',
    priority: 'essential',
    reason: 'WHO compliance testing required for any water supply project',
    costEstimateUSD: SURVEY_COSTS.lab_water.baseCostUSD,
    timeEstimateHrs: SURVEY_COSTS.lab_water.timeHrs,
    deploymentLocation: 'Sample from completed borehole',
    expectedConfidenceGain: 3,
    costPerConfidencePercent: Math.round(SURVEY_COSTS.lab_water.baseCostUSD / 3),
  });

  // ─── Calculate Totals ───
  const activeSurveys = surveys.filter(s => s.priority !== 'not_needed');
  const essentialSurveys = activeSurveys.filter(s => s.priority === 'essential');
  const recommendedSurveys = activeSurveys.filter(s => s.priority === 'essential' || s.priority === 'recommended');

  // ─── Determine Tier ───
  let recommendedTier: 1 | 2 | 3;
  let tierSurveys: SurveyRecommendation[];

  if (targetConf >= 90 || isHighYieldNeeded) {
    recommendedTier = 3;
    tierSurveys = recommendedSurveys;
  } else if (targetConf >= 80 || aiConf < 65) {
    recommendedTier = 2;
    tierSurveys = essentialSurveys;
  } else {
    recommendedTier = 1;
    tierSurveys = [];
  }

  // Apply budget constraint
  if (budget < Infinity) {
    tierSurveys = tierSurveys.filter(s => s.costEstimateUSD <= budget);
    // Sort by cost-effectiveness (lowest cost per confidence %)
    tierSurveys.sort((a, b) => a.costPerConfidencePercent - b.costPerConfidencePercent);
    let cumCost = 0;
    tierSurveys = tierSurveys.filter(s => {
      cumCost += s.costEstimateUSD;
      return cumCost <= budget;
    });
  }

  const totalCost = tierSurveys.reduce((s, sv) => s + sv.costEstimateUSD, 0);
  const totalTime = Math.max(...tierSurveys.map(s => s.timeEstimateHrs), 0); // Parallel deployment
  const expectedConf = Math.min(95, aiConf + tierSurveys.reduce((s, sv) => s + sv.expectedConfidenceGain, 0));
  const costSavings = Math.round((1 - totalCost / FULL_SURVEY_COST_USD) * 100);

  // Drill points
  const drillPoints = (input.candidateSites ?? [{ lat: input.lat, lon: input.lon, score: aiConf }])
    .slice(0, 3)
    .map((s, i) => ({
      lat: s.lat,
      lon: s.lon,
      rank: i + 1,
      confidence: Math.min(95, s.score + tierSurveys.reduce((sum, sv) => sum + sv.expectedConfidenceGain, 0) * 0.3),
      reason: i === 0 ? 'Highest AI-ranked site — primary target' :
              i === 1 ? 'Secondary target — backup or comparison' : 'Tertiary target — additional option',
    }));

  const tierNames = {
    1: 'AI Screening Only',
    2: 'AI + Targeted Survey',
    3: 'Bankable Investigation',
  };

  const tierDescs = {
    1: 'Desktop AI analysis using satellite data, geological models, and machine learning. No field surveys. ~70% accuracy.',
    2: 'AI screening + targeted ERT/EM at top drill candidates. 80% survey cost reduction. ~85% accuracy.',
    3: 'Full geophysical investigation with pump test and lab analysis. Bankable confidence. ~90-95% accuracy.',
  };

  return {
    recommendedTier,
    tierName: tierNames[recommendedTier],
    tierDescription: tierDescs[recommendedTier],
    totalCostUSD: totalCost,
    totalTimeHrs: totalTime,
    expectedConfidence: Math.round(expectedConf),
    costSavingsPercent: Math.max(0, costSavings),
    surveys,
    reasoning,
    recommendedDrillPoints: drillPoints,
    riskFactors,
  };
}
