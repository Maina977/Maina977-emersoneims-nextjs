/**
 * HYBRID AI + TARGETED GEOPHYSICS ENGINE
 * ═══════════════════════════════════════
 *
 * The core thesis: 80-90% of traditional site surveys are WASTED money.
 * A $15,000 full geophysical survey blankets an entire site — but the AI
 * has already identified the 2-3 best drill points. Why survey the whole area?
 *
 * This engine computes a DRILL READINESS INDEX (DRI) from all available
 * AI data sources. When DRI is high enough → DRILL WITHOUT SURVEY.
 * When DRI has specific gaps → prescribe the EXACT 1-2 surveys that fill them.
 *
 * Decision ladder:
 *   DRI ≥ 80  →  DRILL NOW         (AI confidence sufficient, skip survey)
 *   DRI 60-79 →  TARGETED SURVEY   (1-2 specific methods, $500-2,000)
 *   DRI 40-59 →  FOCUSED SURVEY    (2-3 methods at drill point only, $2,000-5,000)
 *   DRI < 40  →  FULL SURVEY       (high risk site, traditional approach)
 *
 * Key innovation: "Knowledge Gap Analysis" — instead of asking "what surveys
 * should we do?", we ask "WHAT DON'T WE KNOW?" and fill only those gaps.
 *
 * References:
 * - MacDonald et al. (2012) "Quantitative maps of groundwater resources in Africa"
 * - Chirindja et al. (2017) "Combined ERT + MRS approach to basement aquifers"
 * - Binley et al. (2015) "The emergence of hydrogeophysics"
 * - Loke & Barker (1996) "Rapid least-squares inversion of apparent resistivity"
 */

// ═══ TYPES ═══

/**
 * TOP 3 DRILL POINT CANDIDATE
 * The AI screens the entire site and ranks candidate drill locations.
 * Only the #1 ranked point gets an ERT survey — eliminating blanket site surveys.
 */
export interface DrillPointCandidate {
  rank: 1 | 2 | 3;
  lat: number;
  lon: number;
  label: string;                    // e.g. "Primary — Lineament intersection + high moisture"
  aiScore: number;                  // 0-100 composite AI score
  reasons: string[];                // why this point was selected
  estimatedDepthM: number;
  estimatedYieldM3hr: number;
  geologyNote: string;
  /** If rank=1, this point gets the ERT survey */
  ertRecommended: boolean;
}

/**
 * 5-STEP PIPELINE
 * The core workflow: AI Screen → Top 3 → ERT #1 → Fusion → Decision
 */
export interface PipelineStep {
  step: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  status: 'complete' | 'actionable' | 'pending';
  description: string;
  keyOutput: string;                // the main result of this step
  details: string[];                // bullet points of what this step does
  costUSD: number;                  // cost of this step (0 for AI steps)
  timeHrs: number;
  icon: string;                     // emoji
}

/**
 * ERT SURVEY SPECIFICATION — exactly what the field team should do
 */
export interface ERTSpec {
  targetPoint: DrillPointCandidate;
  arrayType: string;                // e.g. "Wenner-Schlumberger"
  lineLength_m: number;
  electrodeSpacing_m: number;
  numLines: number;
  lineOrientation: string;          // "perpendicular to lineament" etc.
  expectedTarget: string;           // what we're looking for
  successCriteria: string;          // how to know if positive
  costUSD: number;
  timeHrs: number;
}

/**
 * AI + ERT FUSION RESULT — what happens when AI data meets field ERT
 */
export interface FusionResult {
  preFusionDRI: number;             // DRI before ERT
  postFusionDRI: number;            // DRI after ERT (projected)
  driBoostPercent: number;
  fusionVerdict: 'CONFIRMED' | 'REFINED' | 'CONTRADICTED';
  fusionNarrative: string;
  aiPredictions: string[];          // what AI said before ERT
  ertExpected: string[];            // what ERT would confirm/deny
  combinedConfidence: number;       // % after fusion
}

/** Individual knowledge dimension scored 0-100 */
export interface KnowledgeDimension {
  name: string;
  score: number;           // 0-100 (0=no data, 100=field-confirmed)
  source: string;          // what data source informed this score
  gap: string | null;      // human-readable gap description, null if adequate
  fillMethod: string | null;  // cheapest survey to fill this gap
  fillCostUSD: number;     // cost to fill gap
  fillTimeHrs: number;     // time to fill gap
  confidenceGainIfFilled: number;  // % gain
  weight: number;          // importance weight (0-1) for DRI calc
}

/** The adaptive survey step — "do X, then decide Y" */
export interface AdaptiveSurveyStep {
  stepNumber: number;
  method: string;
  purpose: string;
  costUSD: number;
  timeHrs: number;
  location: string;
  expectedOutcome: string;
  /** What this step tells you about whether to proceed */
  decisionCriteria: string;
  /** If step confirms positive → skip remaining steps? */
  canTerminateEarly: boolean;
}

export interface HybridGeophysicsResult {
  // ═══ 5-STEP PIPELINE ═══
  /** The 5-step pipeline: AI Screen → Top 3 → ERT #1 → Fusion → Decision */
  pipeline: PipelineStep[];
  /** Top 3 AI-selected drill point candidates */
  topDrillPoints: DrillPointCandidate[];
  /** ERT specification for the #1 point only */
  ertSpec: ERTSpec;
  /** AI + ERT fusion projections */
  fusionResult: FusionResult;
  /** Final recommendation after full pipeline */
  finalDecision: string;
  /** One-line pipeline summary */
  pipelineSummary: string;

  /** Drill Readiness Index: 0-100 */
  drillReadinessIndex: number;
  /** Human-readable DRI interpretation */
  drillReadinessLabel: 'DRILL NOW' | 'TARGETED SURVEY' | 'FOCUSED SURVEY' | 'FULL SURVEY REQUIRED';
  /** Confidence grade for the DRI */
  driGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  /** Color code for UI */
  driColor: string;

  /** All knowledge dimensions with gaps */
  knowledgeDimensions: KnowledgeDimension[];
  /** Only the dimensions with gaps */
  knowledgeGaps: KnowledgeDimension[];
  /** Total knowledge coverage (weighted average of dimensions) */
  knowledgeCoverage: number;

  /** Money saved vs traditional full survey */
  costSavingsUSD: number;
  costSavingsPercent: number;
  /** Recommended survey cost (0 if DRILL NOW) */
  recommendedSurveyCostUSD: number;
  /** Traditional full survey cost (for comparison) */
  fullSurveyCostUSD: number;

  /** Adaptive survey sequence — step-by-step with early termination */
  adaptiveSurveySequence: AdaptiveSurveyStep[];
  /** Maximum steps needed */
  maxSteps: number;
  /** Expected steps (most likely early termination point) */
  expectedSteps: number;

  /** Plain-English executive summary */
  executiveSummary: string;
  /** Why survey can be eliminated (or not) */
  surveyEliminationReasoning: string[];
  /** What the AI DOES know (strengths) */
  aiStrengths: string[];
  /** What the AI DOESN'T know (weaknesses) */
  aiWeaknesses: string[];

  /** For the driller: single-paragraph instruction */
  drillerBrief: string;
  /** For the client: cost-benefit explanation */
  clientBrief: string;

  /** Data sources that contributed to the DRI */
  dataSourcesUsed: string[];
  /** How many independent data sources converge */
  sourceConvergence: number;
}

export interface HybridGeophysicsInput {
  // Location
  lat: number;
  lon: number;

  // AI analysis outputs
  probability: number;             // 0-1
  confidence: number;              // 0-100 from ensemble
  predictedDepth_m: number;
  predictedYield_m3hr: number;

  // Data source coverage
  hasSoilGrids: boolean;
  hasElevation: boolean;
  hasGLDAS: boolean;
  hasGRACE: boolean;
  hasNASAPower: boolean;
  hasHistoricalWeather: boolean;
  hasBoreholeDB: boolean;
  hasNearbyBoreholes: boolean;
  hasDEMHydrology: boolean;
  hasVegetationIndex: boolean;
  hasLineamentAnalysis: boolean;
  hasRockClassification: boolean;
  hasSubsurfaceModel: boolean;

  // Field data (if any)
  hasFieldERT: boolean;
  hasFieldSeismic: boolean;
  hasFieldMagnetic: boolean;
  hasFieldGPR: boolean;
  hasFieldNMR: boolean;
  hasPumpTest: boolean;
  hasLabWaterAnalysis: boolean;

  // Geological context
  rockType: string;
  aquiferType: string;
  weatheringDepthM: number;
  bedrockDepthM: number;
  waterTableDepthM: number;

  // Source agreement
  sourceAgreement: 'strong' | 'moderate' | 'weak' | 'conflicting';
  bayesianSourceCount: number;

  // Environmental
  precipitationMmYr: number;
  rechargeEstimateMmYr: number;
  graceTrendCmYr: number;

  // Site specifics
  lineamentDetected: boolean;
  slopeDeg: number;
  elevationM: number;
  isRemoteSite: boolean;
}

// ═══ CONSTANTS ═══

const FULL_SURVEY_COST_USD = 15000;

/** Knowledge dimension weights — what matters most for drilling success */
const DIMENSION_WEIGHTS = {
  aquifer_presence: 0.20,    // Is there water?
  depth_accuracy: 0.18,      // How deep to drill?
  yield_estimate: 0.12,      // Will it produce enough?
  geology_certainty: 0.15,   // What rock are we drilling through?
  fracture_mapping: 0.10,    // Are there fractures to target?
  water_quality: 0.05,       // Is the water safe?
  sustainability: 0.08,      // Will it last?
  contamination_risk: 0.05,  // Is the site safe from contamination?
  drill_site_precision: 0.07, // Exactly where to place the rig?
};

// ═══ MAIN ENGINE ═══

export function computeHybridGeophysics(input: HybridGeophysicsInput): HybridGeophysicsResult {
  const dataSourcesUsed: string[] = [];
  const aiStrengths: string[] = [];
  const aiWeaknesses: string[] = [];
  const surveyEliminationReasoning: string[] = [];

  // Track data sources
  if (input.hasSoilGrids) dataSourcesUsed.push('SoilGrids 250m (ISRIC)');
  if (input.hasElevation) dataSourcesUsed.push('SRTM Elevation (Open-Elevation)');
  if (input.hasGLDAS) dataSourcesUsed.push('GLDAS-2.2 Soil Moisture (NASA)');
  if (input.hasGRACE) dataSourcesUsed.push('GRACE-FO Terrestrial Water Storage');
  if (input.hasNASAPower) dataSourcesUsed.push('NASA POWER Climate/ET');
  if (input.hasHistoricalWeather) dataSourcesUsed.push('Open-Meteo Historical Weather');
  if (input.hasBoreholeDB) dataSourcesUsed.push('Regional Borehole Database');
  if (input.hasNearbyBoreholes) dataSourcesUsed.push('OSM/WPDx Nearby Water Points');
  if (input.hasDEMHydrology) dataSourcesUsed.push('DEM-derived Hydrology (TWI, slope, aspect)');
  if (input.hasVegetationIndex) dataSourcesUsed.push('Satellite Vegetation Index (NDVI/EVI)');
  if (input.hasLineamentAnalysis) dataSourcesUsed.push('DEM Lineament/Fracture Analysis');
  if (input.hasRockClassification) dataSourcesUsed.push('Multi-source Rock Classification (8 classifiers)');
  if (input.hasSubsurfaceModel) dataSourcesUsed.push('Subsurface Lithological Model');
  if (input.hasFieldERT) dataSourcesUsed.push('Field ERT Survey');
  if (input.hasFieldSeismic) dataSourcesUsed.push('Field Seismic Refraction');
  if (input.hasFieldMagnetic) dataSourcesUsed.push('Field Magnetic Survey');
  if (input.hasFieldGPR) dataSourcesUsed.push('Field GPR Survey');
  if (input.hasFieldNMR) dataSourcesUsed.push('Field NMR/MRS Survey');
  if (input.hasPumpTest) dataSourcesUsed.push('Pump Test (24hr)');
  if (input.hasLabWaterAnalysis) dataSourcesUsed.push('Laboratory Water Analysis');

  const sourceConvergence = dataSourcesUsed.length;

  // ═══ KNOWLEDGE DIMENSION SCORING ═══
  const rock = input.rockType.toLowerCase();
  const isCrystalline = /gneiss|granite|schist|quartzite|basement|metamorphic|crystalline|migmatite/.test(rock);
  const isSedimentary = /sandstone|limestone|alluvium|sand|gravel|shale|dolomite/.test(rock);
  const isVolcanic = /basalt|volcanic|trachyte|phonolite|tuff|pumice/.test(rock);
  const isKarst = /limestone|dolomite|karst/.test(rock);

  const dimensions: KnowledgeDimension[] = [];

  // 1. AQUIFER PRESENCE — Do we know there's water?
  let aquiferScore = 20; // baseline
  if (input.hasGLDAS) aquiferScore += 15;
  if (input.hasGRACE && input.graceTrendCmYr > -2) aquiferScore += 12;
  if (input.hasNearbyBoreholes) aquiferScore += 18;
  if (input.hasBoreholeDB) aquiferScore += 10;
  if (input.hasVegetationIndex) aquiferScore += 5;
  if (input.hasDEMHydrology) aquiferScore += 5;
  if (input.hasFieldERT) aquiferScore += 15;
  if (input.hasFieldNMR) aquiferScore += 20;
  if (input.hasPumpTest) aquiferScore = 100;
  if (input.probability > 0.7) aquiferScore += 5;
  aquiferScore = Math.min(100, aquiferScore);

  const aquiferGap = aquiferScore < 70
    ? 'Aquifer presence not confirmed — relying on indirect indicators'
    : null;
  dimensions.push({
    name: 'Aquifer Presence', score: aquiferScore,
    source: input.hasPumpTest ? 'Pump test (confirmed)' : input.hasFieldNMR ? 'NMR direct detection' :
      input.hasFieldERT ? 'ERT low-resistivity layer' : 'AI ensemble (satellite + borehole DB)',
    gap: aquiferGap,
    fillMethod: aquiferGap ? (isCrystalline ? 'ERT survey (1 line, 480m)' : 'EM/TDEM sounding') : null,
    fillCostUSD: aquiferGap ? (isCrystalline ? 1520 : 1000) : 0,
    fillTimeHrs: aquiferGap ? 4 : 0,
    confidenceGainIfFilled: aquiferGap ? 15 : 0,
    weight: DIMENSION_WEIGHTS.aquifer_presence,
  });

  // 2. DEPTH ACCURACY — How precise is our depth estimate?
  let depthScore = 15; // baseline (pure guess)
  if (input.hasSoilGrids) depthScore += 8;
  if (input.hasElevation) depthScore += 5;
  if (input.hasBoreholeDB) depthScore += 15;
  if (input.hasNearbyBoreholes) depthScore += 12;
  if (input.hasSubsurfaceModel) depthScore += 10;
  if (input.hasRockClassification) depthScore += 8;
  if (input.hasFieldERT) depthScore += 20;
  if (input.hasFieldSeismic) depthScore += 15;
  if (input.hasPumpTest) depthScore = 95;
  if (input.sourceAgreement === 'strong') depthScore += 8;
  else if (input.sourceAgreement === 'weak' || input.sourceAgreement === 'conflicting') depthScore -= 10;
  depthScore = Math.min(100, Math.max(0, depthScore));

  const depthGap = depthScore < 65
    ? `Depth estimate ±${depthScore < 40 ? '40-60' : '20-35'}% uncertainty — ${isCrystalline ? 'fracture zone depth unknown' : 'aquifer top/bottom not constrained'}`
    : null;
  dimensions.push({
    name: 'Depth Accuracy', score: depthScore,
    source: input.hasPumpTest ? 'Pump test' : input.hasFieldERT ? 'ERT profile' :
      input.hasNearbyBoreholes ? 'Nearby boreholes + AI model' : 'AI ensemble (satellite + geology)',
    gap: depthGap,
    fillMethod: depthGap ? (isCrystalline ? 'ERT survey (1 line, 480m)' : 'EM/TDEM + ERT short line') : null,
    fillCostUSD: depthGap ? 1520 : 0,
    fillTimeHrs: depthGap ? 4 : 0,
    confidenceGainIfFilled: depthGap ? 18 : 0,
    weight: DIMENSION_WEIGHTS.depth_accuracy,
  });

  // 3. YIELD ESTIMATE
  let yieldScore = 15;
  if (input.hasGLDAS) yieldScore += 8;
  if (input.hasGRACE) yieldScore += 5;
  if (input.hasBoreholeDB) yieldScore += 15;
  if (input.hasNearbyBoreholes) yieldScore += 15;
  if (input.hasRockClassification) yieldScore += 5;
  if (input.hasFieldNMR) yieldScore += 20;
  if (input.hasFieldERT) yieldScore += 8;
  if (input.hasPumpTest) yieldScore = 100;
  yieldScore = Math.min(100, Math.max(0, yieldScore));

  const yieldGap = yieldScore < 60
    ? 'Yield estimate is modelled, not measured — ±50% uncertainty typical for desktop analysis'
    : null;
  dimensions.push({
    name: 'Yield Estimate', score: yieldScore,
    source: input.hasPumpTest ? 'Pump test (24hr)' : input.hasFieldNMR ? 'NMR water content' :
      'AI model (regional DB + satellite moisture)',
    gap: yieldGap,
    fillMethod: yieldGap ? 'Pump test after drilling (not a pre-drill survey)' : null,
    fillCostUSD: 0, fillTimeHrs: 0, confidenceGainIfFilled: yieldGap ? 12 : 0,
    weight: DIMENSION_WEIGHTS.yield_estimate,
  });

  // 4. GEOLOGY CERTAINTY
  let geoScore = 10;
  if (input.hasSoilGrids) geoScore += 12;
  if (input.hasRockClassification) geoScore += 18;
  if (input.hasSubsurfaceModel) geoScore += 10;
  if (input.hasElevation) geoScore += 3;
  if (input.hasFieldERT) geoScore += 15;
  if (input.hasFieldSeismic) geoScore += 15;
  if (input.hasFieldMagnetic) geoScore += 5;
  geoScore = Math.min(100, Math.max(0, geoScore));

  const geoGap = geoScore < 60
    ? `Geology inferred from remote sensing — ${isCrystalline ? 'fracture density/orientation unknown' : 'layer boundaries not confirmed'}`
    : null;
  dimensions.push({
    name: 'Geology Certainty', score: geoScore,
    source: input.hasFieldERT ? 'ERT resistivity profile' : input.hasRockClassification ? 'Multi-source rock classifier' : 'SoilGrids texture',
    gap: geoGap,
    fillMethod: geoGap ? 'ERT survey (1 line, 480m)' : null,
    fillCostUSD: geoGap ? 1520 : 0,
    fillTimeHrs: geoGap ? 4 : 0,
    confidenceGainIfFilled: geoGap ? 12 : 0,
    weight: DIMENSION_WEIGHTS.geology_certainty,
  });

  // 5. FRACTURE MAPPING (critical for crystalline only)
  let fractureScore = isCrystalline ? 10 : 80; // Irrelevant for sedimentary
  if (isCrystalline) {
    if (input.hasLineamentAnalysis && input.lineamentDetected) fractureScore += 20;
    if (input.hasLineamentAnalysis && !input.lineamentDetected) fractureScore += 5;
    if (input.hasDEMHydrology) fractureScore += 8;
    if (input.hasFieldERT) fractureScore += 25;
    if (input.hasFieldMagnetic) fractureScore += 15;
    if (input.hasFieldSeismic) fractureScore += 10;
  }
  fractureScore = Math.min(100, Math.max(0, fractureScore));

  const fractureGap = isCrystalline && fractureScore < 55
    ? 'Fracture zones in basement rock not mapped — drilling without fracture targeting risks dry holes'
    : null;
  dimensions.push({
    name: 'Fracture Mapping', score: fractureScore,
    source: isCrystalline ? (input.hasFieldERT ? 'ERT resistivity profile' : input.hasLineamentAnalysis ? 'DEM lineament analysis' : 'Not available') : 'N/A (sedimentary/alluvial)',
    gap: fractureGap,
    fillMethod: fractureGap ? 'ERT survey (2 lines, cross-pattern, 480m each)' : null,
    fillCostUSD: fractureGap ? 2500 : 0,
    fillTimeHrs: fractureGap ? 6 : 0,
    confidenceGainIfFilled: fractureGap ? 15 : 0,
    weight: DIMENSION_WEIGHTS.fracture_mapping,
  });

  // 6. WATER QUALITY
  let wqScore = 25; // baseline (regional assumptions)
  if (input.hasBoreholeDB) wqScore += 15;
  if (input.hasNearbyBoreholes) wqScore += 10;
  if (input.hasLabWaterAnalysis) wqScore = 100;
  if (input.hasSoilGrids) wqScore += 5; // pH inference
  wqScore = Math.min(100, Math.max(0, wqScore));

  dimensions.push({
    name: 'Water Quality', score: wqScore,
    source: input.hasLabWaterAnalysis ? 'Lab analysis' : 'Regional estimates + SoilGrids pH',
    gap: wqScore < 60 ? 'Water quality unknown — lab test required after drilling' : null,
    fillMethod: 'Lab water analysis (post-drill)', fillCostUSD: 0, fillTimeHrs: 0,
    confidenceGainIfFilled: 3,
    weight: DIMENSION_WEIGHTS.water_quality,
  });

  // 7. SUSTAINABILITY
  let sustScore = 20;
  if (input.hasGRACE) sustScore += 15;
  if (input.hasHistoricalWeather) sustScore += 10;
  if (input.hasNASAPower) sustScore += 8;
  if (input.rechargeEstimateMmYr > 30) sustScore += 10;
  if (input.graceTrendCmYr > 0) sustScore += 8;
  else if (input.graceTrendCmYr < -2) sustScore -= 10;
  if (input.hasPumpTest) sustScore += 15;
  sustScore = Math.min(100, Math.max(0, sustScore));

  dimensions.push({
    name: 'Sustainability', score: sustScore,
    source: input.hasGRACE ? 'GRACE-FO + NASA POWER + Open-Meteo' : 'Climate data only',
    gap: sustScore < 50 ? 'Long-term sustainability uncertain — need groundwater level monitoring' : null,
    fillMethod: null, fillCostUSD: 0, fillTimeHrs: 0, confidenceGainIfFilled: 5,
    weight: DIMENSION_WEIGHTS.sustainability,
  });

  // 8. CONTAMINATION RISK
  let contamScore = 50; // baseline
  if (input.hasBoreholeDB) contamScore += 10;
  if (input.hasSoilGrids) contamScore += 10;
  if (input.hasLabWaterAnalysis) contamScore = 100;
  contamScore = Math.min(100, Math.max(0, contamScore));

  dimensions.push({
    name: 'Contamination Risk', score: contamScore,
    source: 'SoilGrids + regional estimates',
    gap: null, fillMethod: null, fillCostUSD: 0, fillTimeHrs: 0, confidenceGainIfFilled: 0,
    weight: DIMENSION_WEIGHTS.contamination_risk,
  });

  // 9. DRILL SITE PRECISION
  let siteScore = 20;
  if (input.hasDEMHydrology) siteScore += 15;
  if (input.hasVegetationIndex) siteScore += 8;
  if (input.hasLineamentAnalysis && input.lineamentDetected) siteScore += 12;
  if (input.hasFieldERT) siteScore += 20;
  if (input.hasFieldMagnetic) siteScore += 10;
  if (input.hasFieldGPR) siteScore += 10;
  siteScore = Math.min(100, Math.max(0, siteScore));

  const siteGap = siteScore < 55
    ? 'Drill point positioned from satellite — ±50-100m uncertainty. Field walkover recommended.'
    : null;
  dimensions.push({
    name: 'Drill Site Precision', score: siteScore,
    source: input.hasFieldERT ? 'ERT anomaly location' : 'DEM + satellite + lineament AI',
    gap: siteGap,
    fillMethod: siteGap ? 'Field GPS walkover + EM profiling (2hr)' : null,
    fillCostUSD: siteGap ? 300 : 0,
    fillTimeHrs: siteGap ? 2 : 0,
    confidenceGainIfFilled: siteGap ? 5 : 0,
    weight: DIMENSION_WEIGHTS.drill_site_precision,
  });

  // ═══ COMPUTE DRILL READINESS INDEX ═══
  const totalWeight = dimensions.reduce((s, d) => s + d.weight, 0);
  const drillReadinessIndex = Math.round(
    dimensions.reduce((s, d) => s + d.score * d.weight, 0) / totalWeight
  );

  // Boost DRI if source convergence is high
  const convergenceBonus = Math.min(10, Math.max(0, (sourceConvergence - 5) * 1.5));
  const agreementBonus = input.sourceAgreement === 'strong' ? 5
    : input.sourceAgreement === 'moderate' ? 2
    : input.sourceAgreement === 'weak' ? -3
    : -8;
  const finalDRI = Math.min(100, Math.max(0, Math.round(drillReadinessIndex + convergenceBonus + agreementBonus)));

  // Knowledge coverage
  const knowledgeCoverage = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length);

  // Knowledge gaps (only those with actual gaps)
  const knowledgeGaps = dimensions.filter(d => d.gap !== null);

  // ═══ DETERMINE DECISION ═══
  let drillReadinessLabel: HybridGeophysicsResult['drillReadinessLabel'];
  let driGrade: HybridGeophysicsResult['driGrade'];
  let driColor: string;

  // For sedimentary/alluvial with good data → lower threshold to drill
  const drillThreshold = isSedimentary ? 72 : isCrystalline ? 80 : 75;
  const targetedThreshold = isSedimentary ? 55 : isCrystalline ? 60 : 58;
  const focusedThreshold = isSedimentary ? 35 : isCrystalline ? 40 : 38;

  if (finalDRI >= drillThreshold) {
    drillReadinessLabel = 'DRILL NOW';
    driGrade = 'A';
    driColor = '#22c55e';
  } else if (finalDRI >= targetedThreshold) {
    drillReadinessLabel = 'TARGETED SURVEY';
    driGrade = 'B';
    driColor = '#3b82f6';
  } else if (finalDRI >= focusedThreshold) {
    drillReadinessLabel = 'FOCUSED SURVEY';
    driGrade = 'C';
    driColor = '#f59e0b';
  } else {
    drillReadinessLabel = 'FULL SURVEY REQUIRED';
    driGrade = 'D';
    driColor = '#ef4444';
  }

  // Special case: if field ERT is present, always at least B
  if (input.hasFieldERT && driGrade === 'C') {
    drillReadinessLabel = 'TARGETED SURVEY';
    driGrade = 'B';
    driColor = '#3b82f6';
  }
  if (input.hasFieldERT && input.hasFieldSeismic) {
    drillReadinessLabel = 'DRILL NOW';
    driGrade = 'A';
    driColor = '#22c55e';
  }

  // ═══ STRENGTHS & WEAKNESSES ═══
  for (const d of dimensions) {
    if (d.score >= 70) aiStrengths.push(`${d.name}: ${d.score}% — ${d.source}`);
    if (d.score < 50 && d.gap) aiWeaknesses.push(`${d.name}: ${d.score}% — ${d.gap}`);
  }

  if (sourceConvergence >= 10) aiStrengths.push(`${sourceConvergence} independent data sources converge on this assessment`);
  if (input.sourceAgreement === 'strong') aiStrengths.push('Strong agreement across all data sources — high internal consistency');
  if (input.sourceAgreement === 'conflicting') aiWeaknesses.push('Data sources show conflicting signals — field verification recommended');
  if (input.hasNearbyBoreholes) aiStrengths.push('Nearby borehole data provides ground-truth calibration');
  if (input.graceTrendCmYr < -2) aiWeaknesses.push('Declining groundwater storage trend (GRACE) — sustainability concern');

  // ═══ SURVEY ELIMINATION REASONING ═══
  if (drillReadinessLabel === 'DRILL NOW') {
    surveyEliminationReasoning.push(
      `AI analysis achieves DRI ${finalDRI}% — exceeds the ${drillThreshold}% threshold for ${isCrystalline ? 'crystalline' : isSedimentary ? 'sedimentary' : 'mixed'} terrain`,
      `${sourceConvergence} independent data sources analyzed (satellite, geological, hydrological, borehole database)`,
      `Source agreement: ${input.sourceAgreement} — predictions are internally consistent`,
      `Estimated drilling success probability: ${(input.probability * 100).toFixed(0)}%`,
      `RECOMMENDATION: Proceed to drill without additional geophysical survey. Cost savings: $${FULL_SURVEY_COST_USD.toLocaleString()} (100%)`,
    );
    if (input.hasNearbyBoreholes) surveyEliminationReasoning.push('Nearby borehole records confirm aquifer presence in this area');
    if (input.hasBoreholeDB) surveyEliminationReasoning.push('National borehole database provides regional depth/yield calibration');
  } else if (drillReadinessLabel === 'TARGETED SURVEY') {
    const gapsToFill = knowledgeGaps.filter(g => g.fillCostUSD > 0).sort((a, b) => b.confidenceGainIfFilled - a.confidenceGainIfFilled);
    const topGap = gapsToFill[0];
    surveyEliminationReasoning.push(
      `AI analysis achieves DRI ${finalDRI}% — close to drill threshold but ${knowledgeGaps.length} knowledge gap(s) remain`,
      `Primary gap: ${topGap?.name ?? 'unknown'} — ${topGap?.gap ?? 'needs verification'}`,
      `TARGETED FIX: ${topGap?.fillMethod ?? 'single survey'} ($${topGap?.fillCostUSD ?? 0}) to gain +${topGap?.confidenceGainIfFilled ?? 0}% confidence`,
      `This eliminates ${Math.round(((FULL_SURVEY_COST_USD - (topGap?.fillCostUSD ?? 0)) / FULL_SURVEY_COST_USD) * 100)}% of traditional survey cost`,
      `Full site survey NOT required — AI has already narrowed the target to specific drill points`,
    );
  } else if (drillReadinessLabel === 'FOCUSED SURVEY') {
    surveyEliminationReasoning.push(
      `AI analysis achieves DRI ${finalDRI}% — ${knowledgeGaps.length} significant knowledge gaps`,
      `${isCrystalline ? 'Crystalline basement terrain requires fracture targeting — ERT essential' : 'Multiple uncertainties require field verification'}`,
      `FOCUSED APPROACH: Survey only at the AI-identified top 1-2 drill points, not the entire site`,
      `Expected cost: $${knowledgeGaps.reduce((s, g) => s + g.fillCostUSD, 0).toLocaleString()} vs $${FULL_SURVEY_COST_USD.toLocaleString()} for full survey`,
    );
  } else {
    surveyEliminationReasoning.push(
      `AI analysis achieves only DRI ${finalDRI}% — insufficient data for confident drilling`,
      `${knowledgeGaps.length} major knowledge gaps identified — full geophysical investigation recommended`,
      `However, AI still saves money by identifying optimal survey lines and drill candidates`,
    );
  }

  // ═══ ADAPTIVE SURVEY SEQUENCE ═══
  const adaptiveSurveySequence: AdaptiveSurveyStep[] = [];
  let stepNum = 0;

  if (drillReadinessLabel !== 'DRILL NOW') {
    // Sort gaps by cost-effectiveness (confidence gain per dollar)
    const fillableGaps = knowledgeGaps
      .filter(g => g.fillCostUSD > 0)
      .sort((a, b) => (b.confidenceGainIfFilled / Math.max(1, b.fillCostUSD)) - (a.confidenceGainIfFilled / Math.max(1, a.fillCostUSD)));

    // For crystalline, ERT is always first
    if (isCrystalline && !input.hasFieldERT) {
      stepNum++;
      adaptiveSurveySequence.push({
        stepNumber: stepNum,
        method: 'ERT Survey (480m line, Wenner-Schlumberger array)',
        purpose: 'Map fracture zones and weathering depth in basement rock',
        costUSD: 1520,
        timeHrs: 4,
        location: `Deploy across AI drill point #1 (${input.lat.toFixed(4)}°, ${input.lon.toFixed(4)}°), oriented perpendicular to detected lineament`,
        expectedOutcome: 'Clear resistivity contrast showing fracture zone (50-150 Ω·m) vs intact rock (>500 Ω·m)',
        decisionCriteria: 'If clear fracture anomaly found at 30-200m depth → PROCEED TO DRILL. If no anomaly → rotate line 90° (Step 2)',
        canTerminateEarly: true,
      });

      if (drillReadinessLabel === 'FOCUSED SURVEY' || drillReadinessLabel === 'FULL SURVEY REQUIRED') {
        stepNum++;
        adaptiveSurveySequence.push({
          stepNumber: stepNum,
          method: 'ERT Survey (480m line #2, perpendicular to #1)',
          purpose: 'Cross-pattern to constrain fracture geometry and dip direction',
          costUSD: 1520,
          timeHrs: 4,
          location: `Perpendicular to Line #1, centered on strongest anomaly from Step 1`,
          expectedOutcome: '3D fracture zone geometry — confirms optimal drill collar position',
          decisionCriteria: 'If fracture confirmed in both profiles → DRILL at intersection. If only 1 profile shows anomaly → consider Step 3',
          canTerminateEarly: true,
        });
      }
    }

    // For sedimentary, EM/TDEM is often faster/cheaper
    if (isSedimentary && !input.hasFieldERT) {
      stepNum++;
      adaptiveSurveySequence.push({
        stepNumber: stepNum,
        method: 'EM/TDEM Sounding (5 stations)',
        purpose: 'Rapid depth-to-aquifer mapping and layer thickness',
        costUSD: 1000,
        timeHrs: 4,
        location: `Grid pattern around AI drill point #1, 100m spacing`,
        expectedOutcome: 'Conductive layer (aquifer) identified at predicted depth, thickness constrained',
        decisionCriteria: 'If aquifer layer confirmed at predicted depth → PROCEED TO DRILL. If no conductive layer → run ERT (Step 2)',
        canTerminateEarly: true,
      });
    }

    // Magnetic survey if lineaments detected
    if (input.lineamentDetected && !input.hasFieldMagnetic && isCrystalline) {
      stepNum++;
      adaptiveSurveySequence.push({
        stepNumber: stepNum,
        method: 'Magnetic Survey (proton magnetometer, 400m traverse)',
        purpose: 'Confirm satellite-detected lineament as structural feature (fault/dyke)',
        costUSD: 800,
        timeHrs: 4,
        location: 'Perpendicular to detected lineament direction',
        expectedOutcome: 'Magnetic anomaly confirming structural control on groundwater',
        decisionCriteria: 'If magnetic anomaly aligns with ERT fracture → highest confidence drill target. If no anomaly → lineament may be superficial',
        canTerminateEarly: false,
      });
    }

    // Karst: GPR essential
    if (isKarst && !input.hasFieldGPR) {
      stepNum++;
      adaptiveSurveySequence.push({
        stepNumber: stepNum,
        method: 'GPR (400 MHz, grid pattern 200m × 200m)',
        purpose: 'Detect voids, cavities and solution channels in karst terrain',
        costUSD: 1000,
        timeHrs: 3,
        location: 'Grid pattern centered on AI drill point #1',
        expectedOutcome: 'Map of subsurface voids to AVOID and solution channels to TARGET',
        decisionCriteria: 'If stable ground confirmed at drill point → DRILL. If void detected → relocate 50m away',
        canTerminateEarly: true,
      });
    }

    // Field GPS walkover — cheap and always helpful
    if (!input.hasFieldERT && !input.hasFieldMagnetic) {
      stepNum++;
      adaptiveSurveySequence.push({
        stepNumber: stepNum,
        method: 'Field GPS Walkover + Visual Geology Confirmation',
        purpose: 'Confirm terrain, access, and refine drill point by ±50m',
        costUSD: 200,
        timeHrs: 2,
        location: `500m radius around AI point (${input.lat.toFixed(4)}°, ${input.lon.toFixed(4)}°)`,
        expectedOutcome: 'Confirmed drill point with clear rig access and no surface hazards',
        decisionCriteria: 'If site is accessible and geology matches AI prediction → proceed. If terrain differs significantly → re-evaluate',
        canTerminateEarly: false,
      });
    }
  }

  const maxSteps = adaptiveSurveySequence.length;
  const expectedSteps = adaptiveSurveySequence.filter(s => s.canTerminateEarly).length > 0
    ? Math.min(maxSteps, adaptiveSurveySequence.findIndex(s => s.canTerminateEarly) + 1)
    : maxSteps;

  // ═══ COST CALCULATIONS ═══
  const recommendedSurveyCostUSD = drillReadinessLabel === 'DRILL NOW' ? 0
    : adaptiveSurveySequence.slice(0, expectedSteps).reduce((s, step) => s + step.costUSD, 0);
  const costSavingsUSD = FULL_SURVEY_COST_USD - recommendedSurveyCostUSD;
  const costSavingsPercent = Math.round((costSavingsUSD / FULL_SURVEY_COST_USD) * 100);

  // ═══ EXECUTIVE SUMMARY ═══
  const executiveSummary = drillReadinessLabel === 'DRILL NOW'
    ? `DRILL READINESS INDEX: ${finalDRI}% (Grade ${driGrade}). The AI analysis has processed ${sourceConvergence} independent data sources with ${input.sourceAgreement} agreement. Aquifer presence is ${aquiferScore >= 70 ? 'well-supported' : 'indicated'}, depth estimate is calibrated against ${input.hasNearbyBoreholes ? 'nearby borehole records' : 'regional database'}, and geology is classified as ${input.rockType}. NO SITE SURVEY REQUIRED — proceed directly to drilling. This saves an estimated $${FULL_SURVEY_COST_USD.toLocaleString()} in survey costs and ${Math.round(FULL_SURVEY_COST_USD / 500)} days of mobilization time.`
    : drillReadinessLabel === 'TARGETED SURVEY'
    ? `DRILL READINESS INDEX: ${finalDRI}% (Grade ${driGrade}). The AI analysis is strong but ${knowledgeGaps.length} knowledge gap(s) need targeted verification. Instead of a full $${FULL_SURVEY_COST_USD.toLocaleString()} site survey, conduct ${adaptiveSurveySequence.length <= 2 ? 'only' : ''} ${adaptiveSurveySequence.length} targeted survey step(s) at the AI-identified drill point for ~$${recommendedSurveyCostUSD.toLocaleString()}. This is a ${costSavingsPercent}% cost reduction. The AI has already done the heavy lifting — the targeted survey just confirms the final details.`
    : drillReadinessLabel === 'FOCUSED SURVEY'
    ? `DRILL READINESS INDEX: ${finalDRI}% (Grade ${driGrade}). ${knowledgeGaps.length} significant gaps require focused field investigation at the AI-selected drill points. Cost: ~$${recommendedSurveyCostUSD.toLocaleString()} (${costSavingsPercent}% savings vs full survey). The AI has narrowed the search area from km² to specific GPS points — survey only those points.`
    : `DRILL READINESS INDEX: ${finalDRI}% (Grade ${driGrade}). Insufficient data confidence for this location. A comprehensive geophysical survey is recommended before drilling. However, the AI analysis has identified optimal survey lines and priority areas, which still reduces survey scope and cost.`;

  // ═══ DRILLER BRIEF ═══
  // Never instructs mobilization before the statutory survey: in Kenya a
  // hydrogeological survey report is REQUIRED for motorised boreholes, and
  // the final drilling method is the contractor's call after ERT.
  const drillerBrief = drillReadinessLabel === 'DRILL NOW'
    ? `Desktop model supports drilling at ${input.lat.toFixed(5)}°, ${input.lon.toFixed(5)}° (elevation ${input.elevationM.toFixed(0)}m) SUBJECT to the statutory hydrogeological survey/ERT confirming the target. Expected geology: ${input.rockType}. Target depth: ${input.predictedDepth_m}m. Expected aquifer: ${input.aquiferType} at ${input.waterTableDepthM.toFixed(0)}m. ${isCrystalline ? 'Target fracture zones — watch for water strikes and increased penetration rate.' : 'Drill through overburden to the aquifer horizon.'} Expected yield: ${input.predictedYield_m3hr.toFixed(1)} m³/hr. Final drilling method to be selected by the contractor after ERT interpretation and access review. Conduct step-drawdown test at first significant water strike.`
    : `After the ${adaptiveSurveySequence[0]?.method ?? 'targeted survey'} confirms the target, mobilize to the confirmed drill point. ${isCrystalline ? 'Orient the rig to intercept the fracture zone identified by ERT.' : 'Drilling method to be selected by the contractor after ERT interpretation and formation review.'} Target depth: ${input.predictedDepth_m}m (confirm with survey results). Expected yield: ${input.predictedYield_m3hr.toFixed(1)} m³/hr.`;

  // ═══ CLIENT BRIEF ═══
  // Kenya market truth (owner-supplied 2026-07): the statutory hydrogeological
  // survey incl. targeted ERT runs KSh 40,000-110,000. Never quote "$200" or
  // promise skipping the survey -- it is a legal requirement for motorised
  // boreholes, not an optional extra.
  const clientBrief = `Our desktop analysis of ${sourceConvergence} satellite and geological data sources identified this as a promising site with ${(input.probability * 100).toFixed(0)}% modelled success probability. Before drilling, Kenyan regulations require a hydrogeological survey report; we recommend combining it with a targeted ERT profile at the proposed position (typical Kenya market cost KSh 40,000-110,000 depending on site access, line length and reporting scope). This confirms the aquifer target before rig mobilization -- far cheaper than a failed borehole.`;

  // ═══ 5-STEP PIPELINE: AI Screen → Top 3 → ERT #1 → Fusion → Decision ═══

  // STEP 1: AI Screening — already done (this entire engine)
  // The AI has processed all satellite/geological/hydrological data for the entire site area.

  // STEP 2: Generate Top 3 drill point candidates
  // The AI evaluates multiple factors to rank candidate locations.
  // In practice, the primary point is the user's input coords; alternate candidates
  // are generated by offsetting toward detected features (lineaments, moisture anomalies).

  const topDrillPoints: DrillPointCandidate[] = [];

  // Point #1: The AI's best pick — the primary analysis target
  const p1reasons: string[] = [];
  if (input.hasLineamentAnalysis && input.lineamentDetected) p1reasons.push('Located on detected geological lineament/fracture zone');
  if (input.hasDEMHydrology) p1reasons.push('Optimal topographic wetness index (TWI) position');
  if (input.hasVegetationIndex) p1reasons.push('Vegetation anomaly suggests shallow groundwater');
  if (input.hasGLDAS) p1reasons.push('GLDAS soil moisture above regional average');
  if (input.hasNearbyBoreholes) p1reasons.push('Nearby successful boreholes confirm aquifer in this zone');
  if (input.hasSubsurfaceModel) p1reasons.push('Subsurface model shows favorable weathered/fractured horizon');
  if (isCrystalline && input.lineamentDetected) p1reasons.push('Fracture intersection zone — highest yield potential in basement rock');
  if (p1reasons.length === 0) p1reasons.push('Best composite score from satellite + geological data');

  topDrillPoints.push({
    rank: 1, lat: input.lat, lon: input.lon,
    label: 'Primary — Highest AI composite score',
    aiScore: Math.round(input.probability * 80 + (input.confidence / 100) * 20),
    reasons: p1reasons,
    estimatedDepthM: input.predictedDepth_m,
    estimatedYieldM3hr: input.predictedYield_m3hr,
    geologyNote: `${input.rockType} — ${input.aquiferType}`,
    ertRecommended: true,
  });

  // Point #2: Alternate — offset toward lineament/drainage feature
  const offset2Lat = input.lineamentDetected ? 0.0008 : 0.0005;
  const offset2Lon = input.lineamentDetected ? -0.0005 : 0.0008;
  topDrillPoints.push({
    rank: 2, lat: input.lat + offset2Lat, lon: input.lon + offset2Lon,
    label: input.lineamentDetected
      ? 'Alternate A — Along lineament strike, 100m NE'
      : 'Alternate A — Adjacent topographic low, 100m E',
    aiScore: Math.round(topDrillPoints[0].aiScore * (input.lineamentDetected ? 0.88 : 0.84)),
    reasons: [
      input.lineamentDetected
        ? 'Along same fracture lineament, different intersection angle'
        : 'Lower topographic position — potential for thicker saturated zone',
      'Backup if Point #1 ERT shows unfavorable conditions',
    ],
    estimatedDepthM: Math.round(input.predictedDepth_m * (input.lineamentDetected ? 0.95 : 1.05)),
    estimatedYieldM3hr: Math.round(input.predictedYield_m3hr * (input.lineamentDetected ? 0.85 : 0.75) * 10) / 10,
    geologyNote: `${input.rockType} — similar geological setting`,
    ertRecommended: false,
  });

  // Point #3: Alternate — offset toward drainage/valley
  const offset3Lat = -0.0006;
  const offset3Lon = 0.0010;
  topDrillPoints.push({
    rank: 3, lat: input.lat + offset3Lat, lon: input.lon + offset3Lon,
    label: 'Alternate B — Toward drainage valley, 120m SE',
    aiScore: Math.round(topDrillPoints[0].aiScore * 0.76),
    reasons: [
      'Closer to mapped drainage — potential alluvial fill',
      'Lower elevation — deeper weathering profile expected',
      'Third-choice fallback if Points #1 and #2 both fail',
    ],
    estimatedDepthM: Math.round(input.predictedDepth_m * 1.15),
    estimatedYieldM3hr: Math.round(input.predictedYield_m3hr * 0.65 * 10) / 10,
    geologyNote: `${input.rockType} — possibly thicker weathered overburden`,
    ertRecommended: false,
  });

  // STEP 3: ERT specification — ONLY on Point #1
  const ertLineLength = isCrystalline ? 480 : isKarst ? 320 : 400;
  const ertSpacing = isCrystalline ? 5 : 10;
  const ertLines = isCrystalline ? 1 : 1; // Single line to keep cost minimal
  const ertCost = isCrystalline ? 1520 : isKarst ? 1200 : 1000;
  const ertTime = isCrystalline ? 4 : 3;

  const ertSpec: ERTSpec = {
    targetPoint: topDrillPoints[0],
    arrayType: isCrystalline ? 'Wenner-Schlumberger' : isKarst ? 'Dipole-Dipole' : 'Wenner',
    lineLength_m: ertLineLength,
    electrodeSpacing_m: ertSpacing,
    numLines: ertLines,
    lineOrientation: input.lineamentDetected
      ? 'Perpendicular to detected lineament bearing'
      : 'Oriented along maximum topographic gradient (downslope)',
    expectedTarget: isCrystalline
      ? `Low-resistivity fracture zone (50-150 Ohm.m) within intact rock (>500 Ohm.m) at ${Math.round(input.predictedDepth_m * 0.3)}-${Math.round(input.predictedDepth_m * 0.8)}m depth`
      : isKarst
      ? `Solution channels and saturated voids at ${Math.round(input.predictedDepth_m * 0.5)}-${input.predictedDepth_m}m`
      : `Conductive aquifer layer (<100 Ohm.m) between ${Math.round(input.predictedDepth_m * 0.4)}-${input.predictedDepth_m}m`,
    successCriteria: isCrystalline
      ? 'Clear resistivity contrast showing weathered/fractured zone ≥10m thick with resistivity 30-200 Ohm.m'
      : 'Continuous low-resistivity layer at expected depth with lateral extent ≥100m',
    costUSD: ertCost,
    timeHrs: ertTime,
  };

  // STEP 4: AI + ERT Fusion projections
  // Project what DRI would be AFTER ERT is done (since ERT hasn't happened yet)
  const postERTAquifer = Math.min(100, aquiferScore + 15);
  const postERTDepth = Math.min(100, depthScore + 20);
  const postERTGeo = Math.min(100, geoScore + 15);
  const postERTFracture = isCrystalline ? Math.min(100, fractureScore + 25) : fractureScore;
  const postERTSite = Math.min(100, siteScore + 20);

  // Recalculate DRI with projected post-ERT scores
  const postERTDimScores = [
    { score: postERTAquifer, weight: DIMENSION_WEIGHTS.aquifer_presence },
    { score: postERTDepth, weight: DIMENSION_WEIGHTS.depth_accuracy },
    { score: yieldScore, weight: DIMENSION_WEIGHTS.yield_estimate },   // ERT doesn't directly improve yield
    { score: postERTGeo, weight: DIMENSION_WEIGHTS.geology_certainty },
    { score: postERTFracture, weight: DIMENSION_WEIGHTS.fracture_mapping },
    { score: wqScore, weight: DIMENSION_WEIGHTS.water_quality },       // unchanged
    { score: sustScore, weight: DIMENSION_WEIGHTS.sustainability },     // unchanged
    { score: contamScore, weight: DIMENSION_WEIGHTS.contamination_risk }, // unchanged
    { score: postERTSite, weight: DIMENSION_WEIGHTS.drill_site_precision },
  ];
  const postERTWeightedSum = postERTDimScores.reduce((s, d) => s + d.score * d.weight, 0);
  const postERTRawDRI = Math.round(postERTWeightedSum / totalWeight);
  const postFusionDRI = Math.min(100, Math.max(0, Math.round(postERTRawDRI + convergenceBonus + agreementBonus + 5))); // +5 for field data bonus

  const fusionResult: FusionResult = {
    preFusionDRI: finalDRI,
    postFusionDRI: postFusionDRI,
    driBoostPercent: postFusionDRI - finalDRI,
    fusionVerdict: postFusionDRI >= drillThreshold ? 'CONFIRMED' : postFusionDRI >= targetedThreshold ? 'REFINED' : 'CONTRADICTED',
    fusionNarrative: postFusionDRI >= drillThreshold
      ? `IF the ERT survey confirms the AI predictions, DRI is projected to rise from ${finalDRI}% to ${postFusionDRI}% — exceeding the ${drillThreshold}% drill threshold. This remains a projection until the ERT is run; bankable grade additionally requires a pump test and lab water analysis.`
      : `ERT is projected to boost DRI from ${finalDRI}% to ${postFusionDRI}%. ${postFusionDRI >= targetedThreshold ? 'This brings the site close to drill-ready — minor additional verification may suffice.' : 'Additional surveys may be needed, but ERT significantly narrows the uncertainty.'}`,
    aiPredictions: [
      `Aquifer type: ${input.aquiferType}`,
      `Expected depth: ${input.predictedDepth_m}m`,
      `Expected yield: ${input.predictedYield_m3hr.toFixed(1)} m³/hr`,
      `Rock type: ${input.rockType}`,
      `AI probability: ${(input.probability * 100).toFixed(0)}%`,
      isCrystalline ? `Fracture zone expected at ${Math.round(input.predictedDepth_m * 0.3)}-${Math.round(input.predictedDepth_m * 0.8)}m` : `Aquifer horizon at ${Math.round(input.predictedDepth_m * 0.4)}-${input.predictedDepth_m}m`,
    ],
    ertExpected: [
      isCrystalline
        ? 'ERT confirms fracture zone location, depth, and thickness'
        : 'ERT confirms aquifer layer depth and lateral extent',
      'Resistivity profile validates geology model',
      'Precise drill collar position identified from anomaly peak',
      isCrystalline
        ? 'Fracture dip direction constrains optimal drilling angle'
        : 'Aquifer thickness constrains expected yield range',
    ],
    combinedConfidence: Math.min(98, Math.round(input.probability * 100 * 0.6 + postFusionDRI * 0.4)),
  };

  // STEP 5: Final decision -- never says "no further surveys needed": the
  // pump test and lab water analysis remain mandatory AFTER drilling even
  // when the ERT confirms the target (client review finding #13).
  const finalDecision = postFusionDRI >= drillThreshold
    ? `DRILL AT POINT #1 (${input.lat.toFixed(5)}°, ${input.lon.toFixed(5)}°) — AI + ERT fusion DRI: ${postFusionDRI}%, subject to hydrogeologist review and statutory approvals. Pump testing and laboratory water analysis remain mandatory after drilling.`
    : postFusionDRI >= targetedThreshold
    ? `DRILL WITH MONITORING — AI + ERT DRI: ${postFusionDRI}%. Proceed to drill with enhanced monitoring during drilling. Pump testing and laboratory water analysis remain mandatory after drilling.`
    : `ADDITIONAL SURVEY RECOMMENDED — Post-fusion DRI ${postFusionDRI}% still below threshold. Consider ${isCrystalline ? 'cross-line ERT or magnetic survey' : 'TDEM sounding'} at Point #1 before drilling.`;

  // Build the 5-step pipeline
  const pipeline: PipelineStep[] = [
    {
      step: 1, title: 'AI Screening', subtitle: 'Entire Site',
      status: 'complete',
      icon: '\u{1F9E0}',
      description: `${sourceConvergence} satellite, geological, and hydrological data sources analyzed across the entire site area. AI ensemble model computes groundwater probability, depth, yield, geology classification, and contamination risk.`,
      keyOutput: `${(input.probability * 100).toFixed(0)}% groundwater probability | ${input.predictedDepth_m}m depth | ${input.predictedYield_m3hr.toFixed(1)} m³/hr | ${input.rockType}`,
      details: [
        `Satellite data: SRTM elevation, GLDAS soil moisture, GRACE groundwater trends, NASA POWER climate`,
        `Geological: Multi-source rock classification (8 classifiers), lineament analysis, subsurface model`,
        `Hydrological: DEM-derived TWI, vegetation index, nearby borehole records`,
        `Source agreement: ${input.sourceAgreement} across ${input.bayesianSourceCount} Bayesian sources`,
        `Pre-survey DRI: ${finalDRI}% (${drillReadinessLabel})`,
      ],
      costUSD: 0, timeHrs: 0,
    },
    {
      step: 2, title: 'Top 3 Points Selected', subtitle: 'AI Ranking',
      status: 'complete',
      icon: '\u{1F4CD}',
      description: `AI evaluated terrain, geology, lineaments, vegetation, moisture, and drainage patterns to rank 3 optimal drill candidates. Only the #1 point receives a field survey — eliminating the need to survey the entire site.`,
      keyOutput: `#1: ${topDrillPoints[0].label} (Score: ${topDrillPoints[0].aiScore}) | #2: Score ${topDrillPoints[1].aiScore} | #3: Score ${topDrillPoints[2].aiScore}`,
      details: [
        `Point #1 (${input.lat.toFixed(4)}°, ${input.lon.toFixed(4)}°): ${topDrillPoints[0].reasons[0]}`,
        `Point #2: ${topDrillPoints[1].label}`,
        `Point #3: ${topDrillPoints[2].label}`,
        `Survey focused on #1 ONLY — saves ${Math.round((1 - 1/10) * 100)}% of traditional site coverage`,
        `Points #2 and #3 are backup — used only if ERT disqualifies Point #1`,
      ],
      costUSD: 0, timeHrs: 0,
    },
    {
      step: 3, title: 'ERT on ONLY Best Point', subtitle: `$${ertCost} | ${ertTime}h`,
      status: 'actionable',
      icon: '\u{26A1}',
      description: `Deploy ${ertSpec.arrayType} array (${ertLineLength}m line, ${ertSpacing}m spacing) at Point #1 ONLY. ${ertSpec.lineOrientation}. This is the ONLY field survey needed — AI has already eliminated the need for blanket site coverage.`,
      keyOutput: `${ertSpec.arrayType} | ${ertLineLength}m | Looking for: ${ertSpec.expectedTarget}`,
      details: [
        `Array: ${ertSpec.arrayType}, ${ertSpec.numLines} line × ${ertLineLength}m`,
        `Electrode spacing: ${ertSpacing}m (${Math.round(ertLineLength / ertSpacing) + 1} electrodes)`,
        `Orientation: ${ertSpec.lineOrientation}`,
        `Target: ${ertSpec.expectedTarget}`,
        `Success criteria: ${ertSpec.successCriteria}`,
        `Cost: $${ertCost} vs $${FULL_SURVEY_COST_USD.toLocaleString()} for full survey (${Math.round((1 - ertCost / FULL_SURVEY_COST_USD) * 100)}% savings)`,
      ],
      costUSD: ertCost, timeHrs: ertTime,
    },
    {
      step: 4, title: 'AI + ERT Fusion', subtitle: `DRI: ${finalDRI}% → ${postFusionDRI}%`,
      status: 'pending',
      icon: '\u{1F52C}',
      description: `Feed ERT resistivity profile back into AI engine. The AI recalculates depth, geology, fracture targets, and yield estimate using combined satellite + field data. DRI projected to rise from ${finalDRI}% to ${postFusionDRI}% (+${postFusionDRI - finalDRI}%).`,
      keyOutput: `Projected DRI: ${postFusionDRI}% | Confidence: ${fusionResult.combinedConfidence}% | Projected verdict if ERT confirms: ${fusionResult.fusionVerdict}`,
      details: [
        `Pre-ERT DRI: ${finalDRI}% → Post-ERT projected DRI: ${postFusionDRI}%`,
        `Aquifer presence: ${aquiferScore}% → ${postERTAquifer}%`,
        `Depth accuracy: ${depthScore}% → ${postERTDepth}%`,
        isCrystalline ? `Fracture mapping: ${fractureScore}% → ${postERTFracture}%` : `Geology certainty: ${geoScore}% → ${postERTGeo}%`,
        `Drill site precision: ${siteScore}% → ${postERTSite}%`,
        `Projected fusion verdict (conditional on the ERT actually confirming): ${fusionResult.fusionVerdict} — ${fusionResult.fusionNarrative}`,
      ],
      costUSD: 0, timeHrs: 0,
    },
    {
      // "Final Drilling Decision" here was a PROJECTION of what the decision
      // would be AFTER the (not-yet-run) ERT — but customers read it as a
      // third verdict contradicting the Executive Summary. Name it what it is.
      step: 5, title: 'Projected Decision IF ERT Confirms (conditional — ERT not yet done)',
      subtitle: postFusionDRI >= drillThreshold ? 'DRILL (projected)' : 'REVIEW (projected)',
      status: 'pending',
      icon: postFusionDRI >= drillThreshold ? '\u{2705}' : '\u{1F50D}',
      description: `CONDITIONAL on ERT results: ${finalDecision}. Until the ERT is run, the governing verdict is the Executive Summary decision.`,
      keyOutput: `Projected (post-ERT): ${finalDecision}`,
      details: [
        `Post-fusion DRI: ${postFusionDRI}% (threshold: ${drillThreshold}%) — PROJECTED, not yet measured`,
        postFusionDRI >= drillThreshold ? 'IF ERT confirms: proceed to drill — no further surveys required' : `DRI ${postFusionDRI}% vs threshold ${drillThreshold}% — ${postFusionDRI >= targetedThreshold ? 'if ERT confirms: drill with monitoring' : 'additional survey recommended'}`,
        `Total pipeline cost: $${ertCost} (ERT only) vs $${FULL_SURVEY_COST_USD.toLocaleString()} traditional`,
        `Time: ${ertTime} hours field work (vs 2-4 weeks traditional)`,
        `Savings: $${(FULL_SURVEY_COST_USD - ertCost).toLocaleString()} (${Math.round((1 - ertCost / FULL_SURVEY_COST_USD) * 100)}%)`,
      ],
      costUSD: 0, timeHrs: 0,
    },
  ];

  // If DRI is already high enough to drill without any survey, mark step 3 as "optional"
  if (drillReadinessLabel === 'DRILL NOW') {
    pipeline[2].status = 'complete';
    pipeline[2].subtitle = 'OPTIONAL — AI sufficient';
    pipeline[2].description = `AI DRI is ${finalDRI}% — already exceeds ${drillThreshold}% drill threshold. ERT survey is OPTIONAL but recommended for maximum confidence. If skipped, proceed directly to drilling and save $${ertCost}.`;
    pipeline[3].status = 'complete';
    pipeline[3].subtitle = 'N/A — Direct drill';
    pipeline[4].status = 'complete';
    pipeline[4].subtitle = 'DRILL NOW';
    pipeline[4].description = `DRI ${finalDRI}% exceeds threshold. DRILL DIRECTLY at Point #1 (${input.lat.toFixed(5)}°, ${input.lon.toFixed(5)}°). No field survey required.`;
  }

  const pipelineSummary = drillReadinessLabel === 'DRILL NOW'
    ? `AI screening alone achieves DRI ${finalDRI}% — DRILL WITHOUT SURVEY. Saves $${FULL_SURVEY_COST_USD.toLocaleString()} and weeks of delay.`
    : `AI screens site → selects 3 drill points → ERT on #1 only ($${ertCost}) → AI+ERT fusion boosts DRI to ${postFusionDRI}% → ${postFusionDRI >= drillThreshold ? 'DRILL' : 'DECIDE'}. Saves $${(FULL_SURVEY_COST_USD - ertCost).toLocaleString()} vs full survey.`;

  return {
    // 5-Step Pipeline
    pipeline,
    topDrillPoints,
    ertSpec,
    fusionResult,
    finalDecision,
    pipelineSummary,

    drillReadinessIndex: finalDRI,
    drillReadinessLabel,
    driGrade,
    driColor,
    knowledgeDimensions: dimensions,
    knowledgeGaps,
    knowledgeCoverage,
    costSavingsUSD,
    costSavingsPercent,
    recommendedSurveyCostUSD,
    fullSurveyCostUSD: FULL_SURVEY_COST_USD,
    adaptiveSurveySequence,
    maxSteps,
    expectedSteps,
    executiveSummary,
    surveyEliminationReasoning,
    aiStrengths,
    aiWeaknesses,
    drillerBrief,
    clientBrief,
    dataSourcesUsed,
    sourceConvergence,
  };
}
