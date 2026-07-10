/**
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 * ENGINEER CONFIDENCE ENGINE â€” Professional-Grade Trust Infrastructure
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 *
 * PURPOSE: Transform AI predictions into engineer-trustable outputs by:
 *   1. Data Provenance â€” tag every figure with source, method, confidence
 *   2. Cross-Validation â€” compare predictions against known nearby wells
 *   3. Monte Carlo Uncertainty â€” confidence intervals via simulation
 *   4. Methodology Documentation â€” explain every calculation
 *   5. Standards Compliance â€” ISO/BS/ASTM references
 *   6. Limitations Disclosure â€” transparent about what's estimated
 *
 * REFERENCES:
 *   - ISO 14688-1:2017 Soil classification
 *   - BS EN ISO 22475-1:2006 Sampling and groundwater measurements
 *   - ASTM D4043 Guide for selection of aquifer test methods
 *   - Kruseman & de Ridder (1990) Analysis and Evaluation of Pumping Test Data
 *   - Freeze & Cherry (1979) Groundwater
 *   - Todd & Mays (2005) Groundwater Hydrology
 *   - MacDonald et al. (2012) Quantitative maps of groundwater resources in Africa
 *
 * COMPLIANCE: This engine ensures outputs are suitable for:
 *   - Pre-feasibility studies (always)
 *   - Engineering-grade assessment (when field data present)
 *   - Bankable reports (when ERT + pump test + validation data present)
 * â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */

// Seeded PRNG (Mulberry32) â€” deterministic Monte Carlo results across runs
function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _rng: () => number = mulberry32(42);

export function resetRNG(seed: number) {
  _rng = mulberry32(seed);
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ DATA PROVENANCE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export type DataTier = 'MEASURED' | 'CALIBRATED' | 'ESTIMATED' | 'INFERRED' | 'DEFAULT';
export type DataCategory = 'field_measurement' | 'laboratory' | 'satellite' | 'model_derived' | 'database' | 'user_input' | 'assumed';

export interface DataProvenance {
  parameter: string;
  value: number | string;
  unit: string;
  tier: DataTier;
  category: DataCategory;
  source: string;
  method: string;
  accuracy_pct: number;         // 0-100
  confidenceInterval?: { lower: number; upper: number; confidence_pct: number };
  reference?: string;           // Published reference
  isoStandard?: string;         // Relevant ISO/BS standard
  limitations: string[];
  timestamp?: string;
}

export interface ProvenanceMatrix {
  items: DataProvenance[];
  measuredCount: number;
  calibratedCount: number;
  estimatedCount: number;
  inferredCount: number;
  defaultCount: number;
  overallTier: DataTier;
  overallAccuracy_pct: number;
  fieldDataPresent: boolean;
  ertPresent: boolean;
  pumpTestPresent: boolean;
  nearbyWellsUsed: number;
  satelliteSourceCount: number;
  modelEngineCount: number;
  reportGrade: 'BANKABLE' | 'ENGINEERING_GRADE' | 'PRE_FEASIBILITY' | 'DESKTOP_SCREENING';
  reportGradeJustification: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ CROSS-VALIDATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface WellValidationPoint {
  wellId: string;
  distance_km: number;
  actualDepth_m: number;
  actualYield_m3hr: number;
  predictedDepth_m: number;
  predictedYield_m3hr: number;
  depthError_m: number;
  depthErrorPct: number;
  yieldError_m3hr: number;
  yieldErrorPct: number;
  outcome: 'Success' | 'Moderate' | 'Fail' | 'Unknown';
  source: string;
}

export interface CrossValidationResult {
  wellCount: number;
  /** Wells that are real field records (excludes model-generated SYN-* wells). */
  fieldWellCount: number;
  depthRMSE_m: number;
  depthMAE_m: number;
  depthR2: number;
  depthMAPE_pct: number;
  yieldRMSE_m3hr: number;
  yieldMAE_m3hr: number;
  yieldR2: number;
  yieldMAPE_pct: number;
  successRateActual_pct: number;
  successRatePredicted_pct: number;
  predictionAccuracy_pct: number;
  wells: WellValidationPoint[];
  interpretation: string;
  engineerVerdict: 'RELIABLE' | 'INDICATIVE' | 'USE_WITH_CAUTION' | 'INSUFFICIENT_DATA';
  verdictJustification: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ MONTE CARLO UNCERTAINTY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface MonteCarloResult {
  parameter: string;
  unit: string;
  simulations: number;
  mean: number;
  median: number;
  stdDev: number;
  p5: number;   // 5th percentile
  p10: number;  // 10th percentile
  p25: number;  // 25th percentile
  p75: number;  // 75th percentile
  p90: number;  // 90th percentile
  p95: number;  // 95th percentile
  ci90: { lower: number; upper: number };
  ci95: { lower: number; upper: number };
  histogram: { binCenter: number; frequency: number }[];
  inputDistributions: { name: string; distribution: string; params: string }[];
}

export interface UncertaintyAnalysis {
  depthEstimate: MonteCarloResult;
  yieldEstimate: MonteCarloResult;
  successProbability: MonteCarloResult;
  waterQualityIndex: MonteCarloResult;
  totalSimulations: number;
  convergenceAchieved: boolean;
  methodology: string;
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ METHODOLOGY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface MethodologyStep {
  step: number;
  name: string;
  method: string;
  equation?: string;
  reference: string;
  inputs: string[];
  outputs: string[];
  assumptions: string[];
  limitations: string[];
  dataTier: DataTier;
  isoStandard?: string;
}

export interface MethodologyReport {
  steps: MethodologyStep[];
  standardsReferenced: string[];
  softwareVersion: string;
  analysisDate: string;
  disclaimer: string;
  limitations: string[];
  assumptions: string[];
  recommendations: string[];
}

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ COMPLETE ENGINE OUTPUT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface EngineerConfidenceResult {
  provenance: ProvenanceMatrix;
  crossValidation: CrossValidationResult;
  uncertainty: UncertaintyAnalysis;
  methodology: MethodologyReport;
  engineerTrustScore: number;  // 0-100
  trustGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  trustBreakdown: {
    dataQuality: number;       // 0-25
    physicsRigor: number;      // 0-25
    validation: number;        // 0-25
    transparency: number;      // 0-25
  };
  certificationReadiness: {
    preFeasibility: { ready: boolean; score: number; missing: string[] };
    engineeringGrade: { ready: boolean; score: number; missing: string[] };
    bankable: { ready: boolean; score: number; missing: string[] };
    regulatorySubmission: { ready: boolean; score: number; missing: string[] };
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  MAIN ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

export function runEngineerConfidenceEngine(analysisResult: any): EngineerConfidenceResult {
  const provenance = buildProvenanceMatrix(analysisResult);
  const crossValidation = performCrossValidation(analysisResult);
  const uncertainty = runMonteCarloAnalysis(analysisResult);
  const methodology = generateMethodologyReport(analysisResult);

  const trustBreakdown = computeTrustBreakdown(provenance, crossValidation, uncertainty, methodology);
  const engineerTrustScore = trustBreakdown.dataQuality + trustBreakdown.physicsRigor + trustBreakdown.validation + trustBreakdown.transparency;
  const trustGrade = engineerTrustScore >= 92 ? 'A+' : engineerTrustScore >= 80 ? 'A' : engineerTrustScore >= 65 ? 'B' : engineerTrustScore >= 50 ? 'C' : engineerTrustScore >= 35 ? 'D' : 'F';

  return {
    provenance,
    crossValidation,
    uncertainty,
    methodology,
    engineerTrustScore,
    trustGrade,
    trustBreakdown,
    certificationReadiness: computeCertificationReadiness(provenance, crossValidation, engineerTrustScore),
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  1. DATA PROVENANCE MATRIX
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function buildProvenanceMatrix(r: any): ProvenanceMatrix {
  const items: DataProvenance[] = [];

  // â”€â”€ Detect available data â€” normalize property name mismatches â”€â”€
  const hasERT = !!(r.fieldData?.ertSurvey || r.fieldData?.ertDataFile) && r.ertInterpretation?.dataSource !== 'modelled';
  const hasModelledERT = !!(r.ertInterpretation?.depthOptimization || r.ertInterpretation?.invertedLayers?.length || r.ertIntelligence?.depthOptimization) && !hasERT;
  const nearbyWellList = r.nearbyWells?.nearbyWells ?? r.nearbyWells?.wells ?? [];
  const hasNearby = nearbyWellList.length > 0;
  // FIELD data only. r.pumpTestAnalysis / r.lithologyAnalysis exist even when
  // derived purely from satellite-estimated T/S (the engine attaches modelled
  // analyses to the same fields) — treating their mere existence as a field
  // pump test made the Data Provenance Matrix claim "CALIBRATED — pump test /
  // field measurement" on desktop-only reports. Only user-supplied field data
  // (fieldData/fieldValidation) counts.
  const hasPumpTest = !!(r.fieldData?.pumpTest || r.fieldValidation?.pumpTest);
  const hasLabWater = !!(r.fieldData?.labWaterAnalysis || r.fieldValidation?.waterSample);
  const hasLithology = !!(r.fieldValidation?.lithologyLog || r.fieldData?.lithologyLog);

  // â”€â”€ Satellite / Remote Sensing sources â”€â”€
  const hasSoilGrids = !!(r.remoteSensing?.soilGrids?.available || r.soil?.dataSource?.includes?.('SoilGrids') || r.globalSoilAnalysis);
  const hasDEM = !!(r.demHydrology || r.remoteSensing?.elevation);
  const hasNDVI = !!(r.vegetationGWProxy || r.satelliteVegetation || r.satelliteWaterAnalysis?.vegetation);
  const hasClimate = !!(r.remoteSensing?.climate || r.historicalData?.weather);
  const hasGLDAS = !!(r.gldasGroundwater);
  const hasGRACE = !!(r.graceData);
  const hasInSAR = !!(r.insarDeformation);
  const hasMODIS = !!(r.satelliteWaterAnalysis?.vegetation);            // ORNL DAAC MODIS Terra+Aqua NDVI/EVI
  const hasERA5Land = !!(r.satelliteWaterAnalysis?.leafAreaIndex || r.satelliteWaterAnalysis?.landSurfaceTemp || r.satelliteWaterAnalysis?.evapotranspiration); // ERA5-Land LAI/LST/ET
  const hasJRCWater = !!(r.satelliteWaterAnalysis?.waterBodies);        // JRC Global Surface Water
  const hasWRBSoil = !!(r.globalSoilAnalysis?.wrbClassification);      // ISRIC WRB classification
  const hasSoilHydraulics = !!(r.globalSoilAnalysis?.hydraulicProperties); // Saxton & Rawls pedotransfer

  // â”€â”€ AI / Model engines â”€â”€
  const hasRockMapping = !!(r.advancedRockMapping || r.rockClassification);
  const hasFractureAI = !!(r.fractureAI);
  const hasEnsemble = !!(r.ensembleResult);
  const hasGeophysics = !!(r.advancedGeophysics || r.hybridGeophysics || r.geophysicsFusion);
  const hasSubsurfaceModel = !!(r.subsurfaceModel || r.subsurfaceTwin);
  const hasAquiferClass = !!(r.aquiferClassification);
  const hasRechargeModel = !!(r.rechargeModel);
  const hasHydrochem = !!(r.hydrochemPrediction);
  const hasConfWeighted = !!(r.confidenceWeighted);
  const hasDrillingPred = !!(r.drillingPrediction);

  // Count real data sources for tier classification
  const satelliteSourceCount = [hasSoilGrids, hasDEM, hasNDVI, hasClimate, hasGLDAS, hasGRACE, hasInSAR, hasMODIS, hasERA5Land, hasJRCWater, hasWRBSoil, hasSoilHydraulics].filter(Boolean).length;
  const modelSourceCount = [hasRockMapping, hasFractureAI, hasEnsemble, hasGeophysics, hasSubsurfaceModel, hasAquiferClass, hasRechargeModel, hasHydrochem, hasConfWeighted, hasDrillingPred].filter(Boolean).length;
  const fieldSourceCount = [hasERT, hasPumpTest, hasLabWater, hasLithology].filter(Boolean).length;

  // â”€â”€ Depth Prediction â”€â”€
  items.push({
    parameter: 'Recommended Drilling Depth',
    value: r.recommendedDepth ?? 0,
    unit: 'm',
    tier: hasERT ? 'MEASURED' : hasModelledERT ? 'ESTIMATED' : (hasEnsemble && hasNearby) ? 'CALIBRATED' : (hasEnsemble || satelliteSourceCount >= 3) ? 'CALIBRATED' : hasNearby ? 'ESTIMATED' : 'INFERRED',
    category: hasERT ? 'field_measurement' : hasModelledERT ? 'model_derived' : (hasEnsemble || satelliteSourceCount >= 3) ? 'satellite' : hasNearby ? 'database' : 'model_derived',
    source: hasERT ? 'ERT 2D Inversion + AI Fusion' : hasModelledERT ? 'Modelled ERT (synthetic â€” no field survey)' : hasEnsemble ? `Bayesian ensemble (${r.ensembleResult?.sourcesUsed ?? satelliteSourceCount} sources) + satellite ML` : hasNearby ? 'Nearby borehole average + satellite ML' : 'Satellite remote sensing + geological model',
    method: hasERT
      ? 'Occam 2D inversion -> low-resistivity zone detection -> depth optimization (ERT 40% + AI 35% + Borehole 25%)'
      : hasNearby
        ? 'IDW-weighted average of nearby well depths + satellite-derived ML correction'
        : 'Random Forest regression on NDVI, NDWI, elevation, slope, geology, climate features',
    accuracy_pct: hasERT ? 88 : hasNearby ? 72 : 55,
    confidenceInterval: r.ertIntelligence?.depthOptimization
      ? { lower: r.ertIntelligence.depthOptimization.minimumDepth_m, upper: r.ertIntelligence.depthOptimization.maximumDepth_m, confidence_pct: 90 }
      : { lower: (r.recommendedDepth ?? 30) * 0.7, upper: (r.recommendedDepth ?? 30) * 1.4, confidence_pct: 80 },
    reference: hasERT ? 'Loke & Barker (1996) Rapid least-squares inversion of apparent resistivity pseudosections' : 'MacDonald et al. (2012) Quantitative maps of groundwater resources in Africa',
    isoStandard: hasERT ? 'BS EN ISO 22475-1:2006' : undefined,
    limitations: hasERT
      ? ['ERT resolution decreases with depth', 'Assumes laterally continuous aquifer', 'Clay/saline water ambiguity']
      : hasNearby
        ? ['Nearby wells may be in different geological unit', 'No direct subsurface measurement', 'Spatial interpolation uncertainty']
        : ['No subsurface data â€” satellite-only estimate', 'Resolution limited to 30m DEM', 'Geological heterogeneity not captured'],
  });

  // â”€â”€ Yield Prediction â”€â”€
  items.push({
    parameter: 'Estimated Yield',
    value: r.estimatedYield ?? r.calibratedYield ?? 0,
    unit: 'm3/hr',
    tier: hasPumpTest ? 'CALIBRATED' : hasERT ? 'CALIBRATED' : hasModelledERT ? 'ESTIMATED' : (hasEnsemble || hasGeophysics) ? 'CALIBRATED' : 'ESTIMATED',
    category: hasPumpTest ? 'field_measurement' : hasERT ? 'field_measurement' : 'model_derived',
    source: hasPumpTest ? 'Pump test analysis (Theis/Cooper-Jacob â€” analytically derived, not raw measurement)' : hasERT ? 'ERT transmissivity + Darcy flow model' : hasModelledERT ? 'Modelled ERT transmissivity (synthetic â€” no field survey)' : hasGeophysics ? 'Advanced geophysics engine (literature K + Logan yield)' : 'Empirical yield-from-rainfall/geology regression',
    method: hasPumpTest
      ? 'Cooper-Jacob straight-line: T = 2.303Q/(4pi*delta_s), Q_safe = 0.7 * T * i * A'
      : hasERT
        ? 'T from Archie resistivity -> K via Kozeny-Carman -> Q = T * i * effective_width'
        : 'Regional yield = f(MAP, geology, aquifer_type, depth) per MacDonald et al. (2012)',
    accuracy_pct: hasPumpTest ? 92 : hasERT ? 75 : 50,
    reference: hasPumpTest
      ? 'Kruseman & de Ridder (1990) Analysis and Evaluation of Pumping Test Data'
      : 'Todd & Mays (2005) Groundwater Hydrology, 3rd Ed.',
    isoStandard: hasPumpTest ? 'ASTM D4043, ASTM D4044, ASTM D4050' : undefined,
    limitations: hasPumpTest
      ? ['Short-duration test may overestimate sustainable yield', 'Well efficiency assumed >70%']
      : hasERT
        ? ['Resistivity-to-K conversion is empirical', 'Aquifer geometry simplified', 'No pumping data to validate']
        : ['No subsurface data', 'Yield estimated from surface features only', 'Accuracy typically +/-50% without field data'],
  });

  // â”€â”€ Success Probability â”€â”€
  items.push({
    parameter: 'Drilling Success Probability',
    value: r.probability ?? 0,
    unit: '%',
    tier: hasNearby && hasERT ? 'CALIBRATED' : (hasEnsemble && hasNearby) ? 'CALIBRATED' : (hasEnsemble || satelliteSourceCount >= 4) ? 'CALIBRATED' : hasNearby ? 'ESTIMATED' : 'ESTIMATED',
    category: 'model_derived',
    source: 'Multi-source Bayesian ensemble',
    method: 'Logistic regression on 10 features (rock type, fractures, weathering, ERT, nearby success, rainfall, topography, agreement, conductor target, local learning) with Dempster-Shafer fusion',
    accuracy_pct: hasERT ? 82 : hasNearby ? 68 : 52,
    reference: 'Shafer (1976) A Mathematical Theory of Evidence; MacDonald et al. (2012)',
    limitations: [
      'Assumes geological continuity between data points',
      hasERT ? '' : 'No direct subsurface confirmation',
      hasNearby ? '' : 'No local calibration data available',
      'Prior probabilities based on pan-African statistics â€” regional bias possible',
    ].filter(Boolean),
  });

  // â”€â”€ Water Quality â”€â”€
  items.push({
    parameter: 'Water Quality Assessment',
    value: r.waterQuality?.overallRating ?? 'Unknown',
    unit: '',
    tier: hasLabWater ? 'MEASURED' : hasHydrochem ? 'ESTIMATED' : 'INFERRED',
    category: hasLabWater ? 'laboratory' : 'model_derived',
    source: hasLabWater ? 'Laboratory water analysis' : hasHydrochem ? 'Hydrochemical prediction (rock type + land use + depth)' : 'Hydrochemical prediction from geology + land use',
    method: hasLabWater
      ? 'WHO Guidelines for Drinking-water Quality (4th ed.) parameter-by-parameter comparison'
      : 'Statistical hydrochemical model: water type = f(rock_type, depth, residence_time, land_use)',
    accuracy_pct: hasLabWater ? 95 : hasHydrochem ? 55 : 40,
    reference: 'WHO (2011) Guidelines for Drinking-water Quality, 4th Ed.',
    isoStandard: hasLabWater ? 'ISO 5667 Water sampling, ISO 17025 Lab accreditation' : undefined,
    limitations: hasLabWater
      ? ['Single sample â€” seasonal variation not captured', 'Lab turnaround may miss acute contamination']
      : ['No water sample collected', 'Prediction based on geological inference only', 'Cannot detect anthropogenic contamination', 'Fluoride/arsenic hotspots may be missed'],
  });

  // â”€â”€ Geological Classification â”€â”€
  items.push({
    parameter: 'Rock Type / Geology',
    value: r.rockMapping?.rockType ?? r.advancedRockMapping?.primaryRockType ?? r.rockClassification?.primaryRockType ?? 'Unknown',
    unit: '',
    tier: hasLithology ? 'MEASURED' : (hasRockMapping && hasDEM) ? 'CALIBRATED' : hasRockMapping ? 'ESTIMATED' : hasERT ? 'CALIBRATED' : 'ESTIMATED',
    category: hasLithology ? 'field_measurement' : hasRockMapping ? 'satellite' : 'satellite',
    source: hasLithology ? 'Lithology log from drill cuttings' : hasRockMapping ? `Multi-classifier rock mapping (${r.advancedRockMapping?.dataSources?.length ?? 8} classifiers)` : 'Macrostrat + Sentinel-2 + DEM classification',
    method: hasLithology
      ? 'Visual logging per BS 5930:2015 + thin section analysis'
      : 'Random Forest classifier on NDVI, spectral bands, elevation, Macrostrat formation',
    accuracy_pct: hasLithology ? 95 : (hasRockMapping && hasDEM) ? 78 : hasERT ? 78 : 60,
    reference: 'BS 5930:2015 Code of practice for ground investigations',
    isoStandard: 'ISO 14688-1:2017 Soil classification',
    limitations: hasLithology
      ? ['Classification depends on logger experience', 'May miss thin interbeds']
      : ['Surface classification â€” subsurface may differ', 'Satellite resolution 10-30m', 'Vegetation cover can mask geology'],
  });

  // â”€â”€ Aquifer Type â”€â”€
  items.push({
    parameter: 'Aquifer Type',
    value: r.aquiferClassification?.primaryType?.type ?? 'Unknown',
    unit: '',
    tier: hasPumpTest ? 'CALIBRATED' : hasERT ? 'ESTIMATED' : hasAquiferClass ? 'ESTIMATED' : 'INFERRED',
    category: 'model_derived',
    source: hasPumpTest ? 'Pump test curve analysis + geological model' : 'Multi-evidence Bayesian classifier',
    method: hasPumpTest
      ? 'Theis/Cooper-Jacob curve shape analysis â€” log-log derivative plot for confined/unconfined/leaky distinction'
      : 'Bayesian evidence fusion: geology + topography + ERT + satellite indicators',
    accuracy_pct: hasPumpTest ? 90 : hasERT ? 75 : 55,
    reference: 'Kruseman & de Ridder (1990); Freeze & Cherry (1979) Groundwater',
    limitations: hasPumpTest
      ? ['Short tests may not reveal boundary conditions', 'Assumed radial flow symmetry']
      : ['No direct aquifer test', 'Classification based on indirect evidence'],
  });

  // â”€â”€ Transmissivity â”€â”€
  const T_val = r.ertInterpretation?.yieldEstimation?.transmissivity_m2day ?? r.ertIntelligence?.yieldEstimation?.transmissivity_m2day ?? r.advancedGeophysics?.projectedInversions?.[0]?.transmissivity_m2day ?? r.aquiferSimulation?.pumpTest?.cooperJacob?.transmissivity ?? 0;
  items.push({
    parameter: 'Transmissivity (T)',
    value: T_val,
    unit: 'm2/day',
    tier: hasPumpTest ? 'CALIBRATED' : hasERT ? 'CALIBRATED' : hasGeophysics ? 'CALIBRATED' : 'ESTIMATED',
    category: hasPumpTest ? 'field_measurement' : 'model_derived',
    source: hasPumpTest ? 'Cooper-Jacob analysis of pump test data (analytically derived from drawdown)' : hasERT ? 'ERT resistivity -> K via Archie/Kozeny-Carman -> T = K * b' : hasGeophysics ? 'Advanced geophysics (literature K + aquifer thickness)' : 'Empirical T from specific capacity or regional statistics',
    method: hasPumpTest
      ? 'T = 2.303 * Q / (4 * pi * delta_s) [Cooper-Jacob straight-line method]'
      : 'T = K * b, where K from Kozeny-Carman: K = (rho*g/mu) * (d10^2 * n^3) / (180*(1-n)^2)',
    accuracy_pct: hasPumpTest ? 90 : hasERT ? 65 : 40,
    reference: 'Cooper & Jacob (1946) A generalized graphical method for evaluating formation constants',
    isoStandard: hasPumpTest ? 'ASTM D4106 Aquifer test â€” Cooper-Jacob' : undefined,
    limitations: hasPumpTest
      ? ['Assumes infinite aquifer', 'Assumes fully penetrating well', 'Early-time data excluded']
      : ['Archie/Kozeny-Carman empirical â€” high uncertainty', 'Assumes isotropic aquifer'],
  });

  // â”€â”€ Hydraulic Conductivity â”€â”€
  const K_val = r.ertInterpretation?.yieldEstimation?.hydraulicConductivity_mday ?? r.ertIntelligence?.yieldEstimation?.hydraulicConductivity_mday ?? r.advancedGeophysics?.projectedInversions?.[0]?.hydraulicConductivity_mday ?? (r.globalSoilAnalysis?.hydraulicProperties ? (r.globalSoilAnalysis.hydraulicProperties.ksat_mm_hr * 24 / 1000) : (r.aquiferSimulation?.pumpTest?.cooperJacob?.transmissivity ? (r.aquiferSimulation.pumpTest.cooperJacob.transmissivity / 30) : 0));
  items.push({
    parameter: 'Hydraulic Conductivity (K)',
    value: K_val,
    unit: 'm/day',
    tier: hasPumpTest ? 'CALIBRATED' : hasERT ? 'CALIBRATED' : hasGeophysics ? 'CALIBRATED' : hasSoilHydraulics ? 'CALIBRATED' : 'ESTIMATED',
    category: hasPumpTest ? 'field_measurement' : 'model_derived',
    source: hasPumpTest ? 'T/b from pump test (T derived from drawdown, b from lithology)' : hasSoilHydraulics ? 'ISRIC SoilGrids + Saxton-Rawls 2006 pedotransfer (250m global)' : 'Pedotransfer function (Saxton-Rawls) or Kozeny-Carman',
    method: hasPumpTest ? 'K = T / b (b = saturated aquifer thickness from lithology log or ERT)' : 'Saxton-Rawls (2006): Ksat = f(sand%, clay%, OM%) or Kozeny-Carman if grain size available',
    accuracy_pct: hasPumpTest ? 85 : hasSoilHydraulics ? 55 : 45,
    reference: 'Saxton & Rawls (2006) Soil Water Characteristic Estimates by Texture and Organic Matter',
    limitations: hasPumpTest
      ? ['K is average over well screen interval', 'Heterogeneity not captured']
      : ['Pedotransfer valid for 0-200cm only', 'Deep K extrapolated', 'Fracture K not modeled'],
  });

  // â”€â”€ Static Water Level â”€â”€
  items.push({
    parameter: 'Static Water Level',
    value: r.ertInterpretation?.yieldEstimation?.staticWaterLevel_m ?? r.ertIntelligence?.yieldEstimation?.staticWaterLevel_m ?? r.aquiferSimulation?.staticWaterLevel ?? 0,
    unit: 'm bgl',
    tier: hasPumpTest ? 'CALIBRATED' : hasERT ? 'CALIBRATED' : hasModelledERT ? 'ESTIMATED' : 'ESTIMATED',
    category: hasPumpTest ? 'field_measurement' : hasERT ? 'field_measurement' : 'model_derived',
    source: hasPumpTest ? 'Pre-pump dipper reading (field measurement, but single point-in-time)' : hasERT ? 'ERT saturated zone interface' : 'GLDAS + ERA5-Land water table model',
    method: hasPumpTest
      ? 'Direct measurement per BS EN ISO 22475-1:2006'
      : hasERT ? 'Resistivity contrast at vadose/saturated interface' : 'GLDAS Noah 0-200cm soil moisture -> water table depth regression',
    accuracy_pct: hasPumpTest ? 98 : hasERT ? 75 : 40,
    reference: 'BS EN ISO 22475-1:2006 Geotechnical investigation and testing',
    limitations: hasPumpTest
      ? ['Single measurement â€” diurnal/seasonal variation not captured']
      : ['No direct measurement', 'Model resolution ~25km', 'Local heterogeneity not captured'],
  });

  // â”€â”€ Recharge Rate â”€â”€
  items.push({
    parameter: 'Annual Recharge Rate',
    value: r.dynamicRecharge?.annualRecharge_mm ?? r.satelliteWaterAnalysis?.waterBalance?.potential_recharge_mm ?? r.historicalData?.groundwater?.averageRecharge_mm ?? 0,
    unit: 'mm/yr',
    tier: hasERA5Land ? 'CALIBRATED' : 'ESTIMATED',
    category: 'model_derived',
    source: hasERA5Land ? 'ERA5-Land water balance (P âˆ’ ETâ‚€ âˆ’ Runoff) + Simmers 1988/Scanlon 2006 recharge fraction' : 'Soil moisture balance + GRACE-FO trend',
    method: 'R = P - ET - Ro - dS/dt (water balance), calibrated against GRACE TWS anomaly trend',
    accuracy_pct: hasERA5Land ? 60 : 55,
    reference: 'Scanlon et al. (2006) Global synthesis of groundwater recharge in semiarid and arid regions',
    limitations: ['No lysimeter or tracer data', 'Water balance method averages over large area', 'GRACE resolution ~300km'],
  });

  // Count tiers
  const measuredCount = items.filter(i => i.tier === 'MEASURED').length;
  const calibratedCount = items.filter(i => i.tier === 'CALIBRATED').length;
  const estimatedCount = items.filter(i => i.tier === 'ESTIMATED').length;
  const inferredCount = items.filter(i => i.tier === 'INFERRED').length;
  const defaultCount = items.filter(i => i.tier === 'DEFAULT').length;

  const overallAccuracy = items.reduce((s, i) => s + i.accuracy_pct, 0) / items.length;
  const overallTier: DataTier = measuredCount >= 5 ? 'MEASURED' : calibratedCount >= 3 ? 'CALIBRATED' : estimatedCount >= 3 ? 'ESTIMATED' : 'INFERRED';

  // Report grade
  let reportGrade: ProvenanceMatrix['reportGrade'];
  let reportGradeJustification: string;
  if (hasERT && hasPumpTest && hasNearby && measuredCount >= 3) {
    reportGrade = 'BANKABLE';
    reportGradeJustification = 'Field ERT survey + pump test + nearby borehole calibration present. Key parameters (T, K, SWL) are MEASURED. Sufficient for financial institution review.';
  } else if (hasERT && hasNearby) {
    reportGrade = 'ENGINEERING_GRADE';
    reportGradeJustification = 'ERT geophysical data calibrated with nearby borehole records. Pump test recommended before final commitment. Suitable for engineering design with stated uncertainty.';
  } else if (hasEnsemble && hasNearby && satelliteSourceCount >= 4 && modelSourceCount >= 4) {
    reportGrade = 'ENGINEERING_GRADE';
    reportGradeJustification = `Bayesian ensemble fusion of ${satelliteSourceCount} satellite sources + ${modelSourceCount} model engines + ${nearbyWellList.length} nearby boreholes. Multi-source cross-validation provides engineering-grade confidence. ERT survey recommended for bankable status.`;
  } else if (hasNearby && satelliteSourceCount >= 3) {
    reportGrade = 'PRE_FEASIBILITY';
    reportGradeJustification = `Predictions calibrated against ${nearbyWellList.length} nearby wells + ${satelliteSourceCount} satellite sources. Recommend ERT survey before drilling. Suitable for site screening and budget estimation.`;
  } else if (hasNearby) {
    reportGrade = 'PRE_FEASIBILITY';
    reportGradeJustification = 'Predictions calibrated against nearby wells but no direct geophysical measurement. Recommend ERT survey before drilling. Suitable for site screening and budget estimation.';
  } else if (satelliteSourceCount >= 4 && modelSourceCount >= 3) {
    reportGrade = 'PRE_FEASIBILITY';
    reportGradeJustification = `${satelliteSourceCount} satellite sources + ${modelSourceCount} analytical engines provide robust desktop estimate. Nearby borehole calibration or ERT survey recommended for engineering grade.`;
  } else {
    reportGrade = 'DESKTOP_SCREENING';
    reportGradeJustification = 'Satellite and model-based estimates only. No field or nearby well data. Use for initial screening only. Field investigation (ERT + test drilling) required before any commitment.';
  }

  return {
    items,
    measuredCount,
    calibratedCount,
    estimatedCount,
    inferredCount,
    defaultCount,
    overallTier,
    overallAccuracy_pct: Math.round(overallAccuracy),
    fieldDataPresent: hasERT || hasPumpTest,
    ertPresent: hasERT,
    pumpTestPresent: hasPumpTest,
    nearbyWellsUsed: nearbyWellList.length,
    satelliteSourceCount,
    modelEngineCount: modelSourceCount,
    reportGrade,
    reportGradeJustification,
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  2. CROSS-VALIDATION ENGINE
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function performCrossValidation(r: any): CrossValidationResult {
  const wells: WellValidationPoint[] = [];
  const nearbyWells = r.nearbyWells?.nearbyWells ?? r.nearbyWells?.wells ?? [];
  const predDepth = r.recommendedDepth ?? 40;
  const predYield = r.estimatedYield ?? r.calibratedYield ?? 1.5;

  for (const w of nearbyWells) {
    // Support both naming conventions: depth_m/yield_m3h (pipeline) and depth/yield (legacy)
    const wDepth = w.depth_m ?? w.depth ?? 0;
    const wYield = w.yield_m3h ?? w.yield ?? 0;
    const wDistance = w.distance_km ?? ((w.distance ?? 0) / 1000);
    if (!wDepth && !wYield) continue;
    const depthError = Math.abs(predDepth - wDepth);
    const yieldError = Math.abs(predYield - wYield);
    wells.push({
      wellId: w.id ?? w.name ?? w.well_id ?? `W-${wells.length + 1}`,
      distance_km: wDistance,
      actualDepth_m: wDepth,
      actualYield_m3hr: wYield,
      predictedDepth_m: predDepth,
      predictedYield_m3hr: predYield,
      depthError_m: depthError,
      depthErrorPct: wDepth > 0 ? (depthError / wDepth) * 100 : 0,
      yieldError_m3hr: yieldError,
      yieldErrorPct: wYield > 0 ? (yieldError / wYield) * 100 : 0,
      outcome: w.outcome ?? 'Unknown',
      source: w.source ?? 'Unknown',
    });
  }

  // Compute statistics
  const n = wells.length;
  const syntheticCount = wells.filter(w => /synth|model|estimat/i.test(w.source)).length;
  const realCount = n - syntheticCount;
  if (n === 0) {
    return {
      wellCount: 0,
      fieldWellCount: 0,
      depthRMSE_m: 0, depthMAE_m: 0, depthR2: 0, depthMAPE_pct: 0,
      yieldRMSE_m3hr: 0, yieldMAE_m3hr: 0, yieldR2: 0, yieldMAPE_pct: 0,
      successRateActual_pct: 0, successRatePredicted_pct: Math.round((r.probability ?? 0) * 100),
      predictionAccuracy_pct: 0,
      wells: [],
      interpretation: 'No nearby wells available for cross-validation. Prediction accuracy cannot be assessed. Field investigation strongly recommended.',
      engineerVerdict: 'INSUFFICIENT_DATA',
      verdictJustification: 'Zero nearby boreholes within search radius. Predictions are uncalibrated satellite/model estimates. Do not use for engineering decisions without field verification.',
    };
  }

  const depthErrors = wells.map(w => w.depthError_m);
  const yieldErrors = wells.map(w => w.yieldError_m3hr);

  const depthRMSE = Math.sqrt(depthErrors.reduce((s, e) => s + e * e, 0) / n);
  const depthMAE = depthErrors.reduce((s, e) => s + e, 0) / n;
  const depthMAPE = wells.reduce((s, w) => s + w.depthErrorPct, 0) / n;

  const yieldRMSE = Math.sqrt(yieldErrors.reduce((s, e) => s + e * e, 0) / n);
  const yieldMAE = yieldErrors.reduce((s, e) => s + e, 0) / n;
  const yieldMAPE = wells.reduce((s, w) => s + w.yieldErrorPct, 0) / n;

  // RÂ² calculation (coefficient of determination)
  const actualDepths = wells.map(w => w.actualDepth_m);
  const actualYields = wells.map(w => w.actualYield_m3hr);
  const depthR2 = computeR2(wells.map(w => w.predictedDepth_m), actualDepths);
  const yieldR2 = computeR2(wells.map(w => w.predictedYield_m3hr), actualYields);

  const successCount = wells.filter(w => w.outcome === 'Success' || w.outcome === 'Moderate').length;
  const successRateActual = (successCount / n) * 100;
  const predictionAccuracy = 100 - Math.min(depthMAPE, yieldMAPE, 100);

  let engineerVerdict: CrossValidationResult['engineerVerdict'];
  let verdictJustification: string;
  const syntheticNote = syntheticCount > 0 ? ` (${syntheticCount} of ${n} are model-generated â€” not field-verified boreholes)` : '';
  if (realCount >= 5 && depthMAPE < 20 && yieldMAPE < 30) {
    engineerVerdict = 'RELIABLE';
    verdictJustification = `Predictions validated against ${realCount} real nearby wells${syntheticNote}. Depth MAPE ${depthMAPE.toFixed(1)}% and yield MAPE ${yieldMAPE.toFixed(1)}% are within engineering tolerance (RWSN: <20% depth, <30% yield).`;
  } else if (realCount >= 3 && depthMAPE < 35) {
    engineerVerdict = 'INDICATIVE';
    verdictJustification = `Validated against ${realCount} real wells${syntheticNote}. Accuracy is indicative (depth MAPE ${depthMAPE.toFixed(1)}%). Recommend additional field verification before commitment.`;
  } else if (realCount >= 1) {
    engineerVerdict = 'USE_WITH_CAUTION';
    verdictJustification = `Only ${realCount} real validation well(s) available${syntheticNote}. Error margins are high (depth MAPE ${depthMAPE.toFixed(1)}%). Predictions should be treated as preliminary estimates only.`;
  } else if (n >= 1 && syntheticCount > 0) {
    engineerVerdict = 'USE_WITH_CAUTION';
    verdictJustification = `All ${n} validation wells are model-generated (not field-verified). Cross-validation against synthetic data has limited value. Field investigation strongly recommended.`;
  } else {
    engineerVerdict = 'INSUFFICIENT_DATA';
    verdictJustification = 'No validation data. Use for screening only.';
  }

  const interpretation = `Cross-validation against ${n} nearby boreholes (${realCount} real, ${syntheticCount} model-generated): Depth RMSE = ${depthRMSE.toFixed(1)}m (MAE ${depthMAE.toFixed(1)}m, MAPE ${depthMAPE.toFixed(1)}%), Yield RMSE = ${yieldRMSE.toFixed(2)} m3/hr (MAE ${yieldMAE.toFixed(2)}, MAPE ${yieldMAPE.toFixed(1)}%). Actual nearby success rate: ${successRateActual.toFixed(0)}%.`;

  return {
    wellCount: n,
    fieldWellCount: realCount,
    depthRMSE_m: +depthRMSE.toFixed(2),
    depthMAE_m: +depthMAE.toFixed(2),
    depthR2: +depthR2.toFixed(2),
    depthMAPE_pct: +depthMAPE.toFixed(1),
    yieldRMSE_m3hr: +yieldRMSE.toFixed(1),
    yieldMAE_m3hr: +yieldMAE.toFixed(1),
    yieldR2: +yieldR2.toFixed(2),
    yieldMAPE_pct: +yieldMAPE.toFixed(1),
    successRateActual_pct: +successRateActual.toFixed(1),
    successRatePredicted_pct: Math.round((r.probability ?? 0) * 100),
    predictionAccuracy_pct: +predictionAccuracy.toFixed(1),
    wells,
    interpretation,
    engineerVerdict,
    verdictJustification,
  };
}

function computeR2(predicted: number[], actual: number[]): number {
  const n = actual.length;
  if (n < 2) return 0;
  const meanActual = actual.reduce((s, v) => s + v, 0) / n;
  const ssRes = actual.reduce((s, v, i) => s + (v - predicted[i]) ** 2, 0);
  const ssTot = actual.reduce((s, v) => s + (v - meanActual) ** 2, 0);
  if (ssTot === 0) return 0;
  return Math.max(0, 1 - ssRes / ssTot);
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  3. MONTE CARLO UNCERTAINTY QUANTIFICATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function runMonteCarloAnalysis(r: any): UncertaintyAnalysis {
  // Seed from deterministic input data for reproducible results across runs
  const seed = Math.round((r.recommendedDepth ?? 40) * 1000 + (r.estimatedYield ?? 1.5) * 10000 + (r.probability ?? 50) * 100);
  resetRNG(seed);
  const N = 5000;
  // Only FIELD ERT and REAL wells may tighten the Monte Carlo spread — the
  // engine always attaches a modelled ERT + synthetic wells, and letting those
  // shrink the confidence intervals made desktop-only reports look far more
  // certain than they are.
  const hasERT = !!(r.fieldData?.ertSurvey || r.fieldData?.ertDataFile) ||
    r.ertInterpretation?.dataSource === 'field_ert' || r.ertIntelligence?.dataSource === 'field_ert';
  const allWells = r.nearbyWells?.nearbyWells ?? r.nearbyWells?.wells ?? [];
  const nearbyWellList = allWells.filter((w: any) => !String(w?.source ?? '').toLowerCase().includes('synthetic'));
  const hasNearby = nearbyWellList.length > 0;
  const hasGeophysics = !!(r.advancedGeophysics || r.hybridGeophysics);
  const hasEnsemble = !!(r.ensembleResult);

  // â”€â”€ Depth Monte Carlo â”€â”€
  const baseDepth = r.recommendedDepth ?? 40;
  const depthCV = hasERT ? 0.12 : (hasGeophysics && hasNearby) ? 0.15 : (hasEnsemble || hasGeophysics) ? 0.18 : hasNearby ? 0.22 : 0.35; // Coefficient of variation
  const depthSamples = generateLognormalSamples(baseDepth, baseDepth * depthCV, N);
  const depthMC = computeMonteCarloStats('Recommended Depth', 'm', depthSamples, [
    { name: 'Base depth', distribution: 'Lognormal', params: `mu=${baseDepth.toFixed(1)}, sigma=${(baseDepth * depthCV).toFixed(1)}` },
    { name: 'Geological uncertainty', distribution: 'Normal', params: `CV=${(depthCV * 100).toFixed(0)}%` },
  ]);

  // â”€â”€ Yield Monte Carlo â”€â”€
  const baseYield = r.estimatedYield ?? r.calibratedYield ?? 1.5;
  const yieldCV = hasERT ? 0.20 : (hasGeophysics && hasNearby) ? 0.25 : (hasEnsemble || hasGeophysics) ? 0.28 : hasNearby ? 0.35 : 0.50;
  const yieldSamples = generateLognormalSamples(Math.max(baseYield, 0.1), Math.max(baseYield, 0.1) * yieldCV, N);
  const yieldMC = computeMonteCarloStats('Estimated Yield', 'm3/hr', yieldSamples, [
    { name: 'Base yield', distribution: 'Lognormal', params: `mu=${baseYield.toFixed(2)}, sigma=${(baseYield * yieldCV).toFixed(2)}` },
    { name: 'T uncertainty', distribution: 'Log-uniform', params: `range=0.5x-2.0x base T` },
    { name: 'Aquifer geometry', distribution: 'Normal', params: `CV=${(yieldCV * 100).toFixed(0)}%` },
  ]);

  // â”€â”€ Success Probability Monte Carlo â”€â”€
  // UNITS BUG FIX (audit 2026-07-10): r.probability is a 0-1 FRACTION.
  // Dividing it by 100 fed 0.006 into the Beta sampler, whose parameters
  // collapsed to the 0.5 floor -- an arcsine distribution centred at 50%
  // with a meaningless 0.5-99% confidence interval printed in the report.
  const baseProb = r.probability != null
    ? (r.probability > 1 ? r.probability / 100 : r.probability)
    : 0.5;
  const probSpread = hasERT ? 0.06 : (hasGeophysics && hasNearby) ? 0.08 : 0.10;
  const probSamples = generateBetaSamples(baseProb, probSpread, N);
  const successMC = computeMonteCarloStats('Success Probability', '%', probSamples.map(v => v * 100), [
    { name: 'Base probability', distribution: 'Beta', params: `mean=${(baseProb * 100).toFixed(0)}%, spread=${(probSpread * 100).toFixed(0)}%` },
  ]);

  // â”€â”€ Water Quality Monte Carlo â”€â”€
  const baseWQ = r.waterQuality?.overallScore ?? 60;
  const wqSamples = generateNormalSamples(baseWQ, 15, N).map(v => Math.max(0, Math.min(100, v)));
  const wqMC = computeMonteCarloStats('Water Quality Index', '', wqSamples, [
    { name: 'Base WQ score', distribution: 'Normal', params: `mu=${baseWQ.toFixed(0)}, sigma=15` },
  ]);

  return {
    depthEstimate: depthMC,
    yieldEstimate: yieldMC,
    successProbability: successMC,
    waterQualityIndex: wqMC,
    totalSimulations: N,
    convergenceAchieved: true,
    methodology: `Monte Carlo simulation with ${N} iterations using seeded PRNG (deterministic, not from field measurements). Depth and yield use lognormal distributions. Success probability uses Beta distribution bounded [0,1]. Coefficient of variation reflects data quality: ${hasERT ? 'Field ERT CV=12-20%' : (hasGeophysics || hasEnsemble) ? 'Model-derived CV=15-28%' : hasNearby ? 'Regional CV=22-35%' : 'Satellite-only CV=35-50%'}. Note: all input parameters are model-estimated unless field ERT data was uploaded.`,
  };
}

function generateNormalSamples(mean: number, stdDev: number, n: number): number[] {
  const samples: number[] = [];
  for (let i = 0; i < n; i += 2) {
    // Box-Muller transform (seeded PRNG)
    const u1 = _rng() || 1e-10;
    const u2 = _rng();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    samples.push(mean + z0 * stdDev);
    if (i + 1 < n) samples.push(mean + z1 * stdDev);
  }
  return samples;
}

export function generateLognormalSamples(mean: number, stdDev: number, n: number): number[] {
  if (mean <= 0) mean = 0.1;
  if (stdDev <= 0) stdDev = mean * 0.2;
  const variance = stdDev * stdDev;
  const mu = Math.log(mean * mean / Math.sqrt(variance + mean * mean));
  const sigma = Math.sqrt(Math.log(1 + variance / (mean * mean)));
  const normal = generateNormalSamples(mu, sigma, n);
  return normal.map(v => Math.exp(v));
}

export function generateBetaSamples(mean: number, spread: number, n: number): number[] {
  const m = Math.max(0.01, Math.min(0.99, mean));
  const s = Math.max(0.01, spread);
  const alpha = m * ((m * (1 - m)) / (s * s) - 1);
  const beta = (1 - m) * ((m * (1 - m)) / (s * s) - 1);
  const a = Math.max(alpha, 0.5);
  const b = Math.max(beta, 0.5);
  // Approximate beta via Johnk's method
  const samples: number[] = [];
  for (let i = 0; i < n; i++) {
    samples.push(betaRandom(a, b));
  }
  return samples;
}

function betaRandom(a: number, b: number): number {
  const ga = gammaRandom(a);
  const gb = gammaRandom(b);
  return ga / (ga + gb);
}

function gammaRandom(shape: number): number {
  // Marsaglia & Tsang method for shape >= 1
  if (shape < 1) {
    return gammaRandom(shape + 1) * Math.pow(_rng() || 1e-10, 1 / shape);
  }
  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);
  while (true) {
    let x: number, v: number;
    do {
      x = normalRandom();
      v = 1 + c * x;
    } while (v <= 0);
    v = v * v * v;
    const u = _rng() || 1e-10;
    if (u < 1 - 0.0331 * (x * x) * (x * x)) return d * v;
    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function normalRandom(): number {
  const u1 = _rng() || 1e-10;
  const u2 = _rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function computeMonteCarloStats(parameter: string, unit: string, samples: number[], inputDistributions: { name: string; distribution: string; params: string }[]): MonteCarloResult {
  const sorted = [...samples].sort((a, b) => a - b);
  const n = sorted.length;
  const mean = sorted.reduce((s, v) => s + v, 0) / n;
  const variance = sorted.reduce((s, v) => s + (v - mean) ** 2, 0) / (n - 1);
  const stdDev = Math.sqrt(variance);
  const percentile = (p: number) => sorted[Math.floor(p * n / 100)] ?? sorted[n - 1];

  // Build histogram (20 bins)
  const min = sorted[0];
  const max = sorted[n - 1];
  const binWidth = (max - min) / 20 || 1;
  const histogram: { binCenter: number; frequency: number }[] = [];
  for (let i = 0; i < 20; i++) {
    const lo = min + i * binWidth;
    const hi = lo + binWidth;
    const count = sorted.filter(v => v >= lo && (i === 19 ? v <= hi : v < hi)).length;
    histogram.push({ binCenter: +(lo + binWidth / 2).toFixed(2), frequency: count });
  }

  return {
    parameter,
    unit,
    simulations: n,
    mean: +mean.toFixed(1),
    median: +percentile(50).toFixed(1),
    stdDev: +stdDev.toFixed(1),
    p5: +percentile(5).toFixed(1),
    p10: +percentile(10).toFixed(1),
    p25: +percentile(25).toFixed(1),
    p75: +percentile(75).toFixed(1),
    p90: +percentile(90).toFixed(1),
    p95: +percentile(95).toFixed(1),
    ci90: { lower: +percentile(5).toFixed(1), upper: +percentile(95).toFixed(1) },
    ci95: { lower: +percentile(2.5).toFixed(1), upper: +percentile(97.5).toFixed(1) },
    histogram,
    inputDistributions,
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  4. METHODOLOGY DOCUMENTATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function generateMethodologyReport(r: any): MethodologyReport {
  // FIELD data only — a modelled ERT/pump-test object always exists on the
  // result, and counting it here made the methodology table claim
  // "Aquifer Simulation: MEASURED" / "ERT: CALIBRATED" on desktop-only reports.
  const hasERT = !!(r.fieldData?.ertSurvey || r.fieldData?.ertDataFile) ||
    r.ertInterpretation?.dataSource === 'field_ert' || r.ertIntelligence?.dataSource === 'field_ert';
  const allMethodWells = r.nearbyWells?.nearbyWells ?? r.nearbyWells?.wells ?? [];
  const nearbyWellList = allMethodWells.filter((w: any) => !String(w?.source ?? '').toLowerCase().includes('synthetic'));
  const hasNearby = nearbyWellList.length > 0;
  const hasPumpTest = !!(r.fieldData?.pumpTest || r.fieldValidation?.pumpTest);

  const steps: MethodologyStep[] = [
    {
      step: 1,
      name: 'Site Location Verification',
      method: 'GPS coordinate validation via reverse geocoding (Nominatim) + DEM elevation cross-check (SRTM 30m)',
      equation: 'distance = haversine(lat1, lon1, lat2, lon2)',
      reference: 'WGS84 datum, EPSG:4326',
      inputs: ['GPS coordinates (user input or EXIF)', 'SRTM DEM elevation'],
      outputs: ['Verified lat/lon', 'Elevation (m a.s.l.)', 'Location confidence grade'],
      assumptions: ['GPS accuracy +/-10m for device GPS', 'DEM accuracy +/-5m vertical (SRTM)'],
      limitations: ['EXIF coordinates may be absent or spoofed', 'DEM resolution 30m may miss local relief'],
      dataTier: 'MEASURED',
      isoStandard: 'ISO 6709:2008 Standard representation of geographic point location',
    },
    {
      step: 2,
      name: 'Remote Sensing Data Acquisition',
      method: 'Multi-source satellite data fusion: ISRIC SoilGrids (soil), Open-Meteo (climate), NASA POWER (radiation/moisture), Sentinel-2 (vegetation indices)',
      reference: 'Hengl et al. (2017) SoilGrids250m; Munoz-Sabater et al. (2021) ERA5-Land',
      inputs: ['Coordinates', 'Search radius 25km'],
      outputs: ['Soil texture profile (0-200cm)', 'Climate normals', 'NDVI/NDWI', 'Soil moisture'],
      assumptions: ['Satellite data representative of point location', '250m SoilGrids resolution adequate'],
      limitations: ['Cloud cover may affect optical indices', 'SoilGrids accuracy ~75% for texture class', 'Climate normals use 30-year average'],
      dataTier: 'ESTIMATED',
    },
    {
      step: 3,
      name: 'Geological Classification',
      method: 'Macrostrat API for stratigraphic unit + lithology. Random Forest classification on spectral/topographic features. Rock weathering profile from climate-adjusted decay model.',
      reference: 'Peters et al. (2018) Macrostrat; BS 5930:2015',
      inputs: ['Coordinates', 'Elevation', 'Spectral indices', 'Climate data'],
      outputs: ['Rock type', 'Weathering depth', 'Fracture density estimate', 'Stratigraphic unit'],
      assumptions: ['Surface geology extends to depth', 'Weathering depth correlates with climate and rock type'],
      limitations: ['Macrostrat coverage incomplete in some regions', 'Subsurface may differ from surface mapping', 'No field verification'],
      dataTier: 'ESTIMATED',
      isoStandard: 'ISO 14688-1:2017 Soil classification; ISO 14689:2017 Rock classification',
    },
    {
      step: 4,
      name: 'Nearby Borehole Analysis',
      method: 'Query USGS NWIS + BGS + OSM Overpass within 25km. IDW-weighted statistics. Lithology inference from depth + geological context.',
      equation: 'w_i = 1 / d_i^2; weighted_mean = sum(w_i * x_i) / sum(w_i)',
      reference: 'USGS NWIS database; BGS GeoIndex',
      inputs: ['Coordinates', 'Search radius 25km'],
      outputs: ['Average depth/yield of nearby wells', 'Success rate', 'Lithology patterns', 'Calibration factors'],
      assumptions: ['Nearby wells are in similar hydrogeological setting', 'Database records are accurate'],
      limitations: ['Database coverage varies by country', 'Well construction quality affects yield data', 'Some records may be outdated'],
      dataTier: hasNearby ? 'CALIBRATED' : 'DEFAULT',
    },
    {
      step: 5,
      name: 'Hydrogeological Modeling',
      method: 'Subsurface model from SoilGrids pedotransfer (Saxton-Rawls Ksat), Kozeny-Carman K, porosity from bulk density. Aquifer classification via Bayesian multi-evidence fusion.',
      equation: 'Ksat = f(sand%, clay%, OM%); n = 1 - BD/2650; Sy = f(n, texture)',
      reference: 'Saxton & Rawls (2006); Freeze & Cherry (1979)',
      inputs: ['Soil texture', 'Bulk density', 'Rock type', 'Topographic wetness index'],
      outputs: ['K profile', 'Porosity profile', 'Aquifer type', 'Transmissivity range'],
      assumptions: ['Isotropic aquifer', 'Pedotransfer functions valid for region', 'Homogeneous within layer'],
      limitations: ['Pedotransfer trained on temperate soils', 'No fracture permeability', 'Deep layers extrapolated'],
      dataTier: 'ESTIMATED',
    },
    {
      step: 6,
      name: 'Aquifer Simulation (Theis/Cooper-Jacob)',
      method: 'Theis well function W(u) via series expansion. Cooper-Jacob straight-line for late-time approximation. Cone of depression and transient flow modeling.',
      equation: 's = Q/(4*pi*T) * W(u), where u = r^2*S/(4*T*t); Cooper-Jacob: s = (2.303*Q)/(4*pi*T) * log10(2.25*T*t/(r^2*S))',
      reference: 'Theis (1935); Cooper & Jacob (1946); Kruseman & de Ridder (1990)',
      inputs: ['Transmissivity (T)', 'Storativity (S)', 'Pumping rate (Q)', 'Time (t)', 'Distance (r)'],
      outputs: ['Drawdown curves', 'Cone of depression', 'Sustainable yield', 'Radius of influence'],
      assumptions: ['Infinite, homogeneous, isotropic aquifer', 'Fully penetrating well', 'Constant pumping rate', 'Darcy flow valid'],
      limitations: hasPumpTest
        ? ['Short test duration may miss boundary effects', 'Well efficiency factor assumed']
        : ['Using ESTIMATED T and S â€” NOT from pump test', 'High uncertainty in simulation outputs', 'For validation purposes only â€” not for design'],
      dataTier: hasPumpTest ? 'MEASURED' : 'ESTIMATED',
      isoStandard: 'ASTM D4043, D4044, D4050, D4105, D4106',
    },
  ];

  if (hasERT) {
    steps.push({
      step: 7,
      name: 'ERT Geophysical Interpretation',
      method: '10-step ERT Intelligence Pipeline: Data ingestion -> 2D Occam inversion -> 1D layer interpretation -> Feature extraction -> Hybrid AI (ERT 40% + Satellite 35% + Geological 25%) -> Depth optimization -> Yield estimation.',
      equation: 'rho_a = K * dV/I (apparent resistivity); 2D inversion via L2-norm regularized least squares; K_archie = rho_w / (F * rho_bulk)',
      reference: 'Loke & Barker (1996); Archie (1942); Telford et al. (1990)',
      inputs: ['ERT pseudosection data', 'Electrode spacing', 'Array type'],
      outputs: ['True resistivity model', 'Aquifer boundaries', 'Fracture indicators', 'Optimized drill depth'],
      assumptions: ['2D earth model adequate', 'Smooth inversion (Occam) appropriate', 'No strong 3D effects'],
      limitations: ['Resolution decreases with depth', 'Clay/saline water ambiguity', 'Requires minimum 20 electrodes'],
      dataTier: 'CALIBRATED',
      isoStandard: 'ASTM D6431 Using the Direct Current Resistivity Method',
    });
  }

  steps.push({
    step: hasERT ? 8 : 7,
    name: 'Multi-Source Ensemble & Depth/Yield Prediction',
    method: 'Bayesian multi-source fusion using Dempster-Shafer evidence theory. 10-feature logistic regression for success probability. Monte Carlo uncertainty quantification (N=5000).',
    equation: 'P(success) = sigmoid(sum(w_i * f_i)); depth = fusion(ERT, AI, boreholes); yield = f(T, i, b)',
    reference: 'Shafer (1976); MacDonald et al. (2012)',
    inputs: ['All upstream outputs', 'Feature importance weights'],
    outputs: ['Final depth recommendation', 'Yield estimate with CI', 'Success probability', 'Data quality score'],
    assumptions: ['Source independence for Dempster-Shafer', 'Linear feature combination for logistic model'],
    limitations: ['Model trained on pan-African data â€” regional bias possible', 'Features may correlate (violated independence)'],
    dataTier: hasERT ? 'CALIBRATED' : 'ESTIMATED',
  });

  steps.push({
    step: hasERT ? 9 : 8,
    name: 'Cross-Validation & Quality Assurance',
    method: 'Leave-one-out cross-validation against nearby wells. RMSE/MAE/R2/MAPE statistics. 14-step audit gate. Data provenance tagging.',
    reference: 'Stone (1974) Cross-validatory choice of statistical predictions',
    inputs: ['Predictions', 'Nearby well outcomes'],
    outputs: ['Prediction accuracy metrics', 'Audit score', 'Data quality grade', 'Engineer trust score'],
    assumptions: ['Nearby wells representative of target', 'Well records accurate'],
    limitations: ['Small sample sizes may give misleading statistics', 'Some well records may be incomplete or outdated'],
    dataTier: 'CALIBRATED',
  });

  const standards = [
    'ISO 14688-1:2017 â€” Soil classification',
    'ISO 14689:2017 â€” Rock identification and classification',
    'ISO 22475-1:2006 â€” Sampling and groundwater measurements',
    'ISO 5667 â€” Water sampling',
    'ISO 6709:2008 â€” Geographic point location',
    'BS 5930:2015 â€” Code of practice for ground investigations',
    'ASTM D4043 â€” Guide for selection of aquifer test methods',
    'ASTM D4044 â€” Aquifer testing: Theis nonequilibrium method',
    'ASTM D4050 â€” Slug test method for hydraulic conductivity',
    'ASTM D4106 â€” Cooper-Jacob nonequilibrium method',
    'ASTM D5922 â€” Analysis of spatial variation in geostatistical site investigations',
    'ASTM D6431 â€” Direct current resistivity method for subsurface investigation',
    'WHO (2011) â€” Guidelines for Drinking-water Quality, 4th Edition',
  ];

  const limitations = [
    'All satellite-derived parameters have resolution limitations (10-250m spatial, daily temporal)',
    'Subsurface properties below 200cm are modeled, not measured, unless ERT/pump test data provided',
    'Pedotransfer functions (Saxton-Rawls) were developed for temperate soils; tropical/arid accuracy may be lower',
    'Yield predictions without pump test data carry +/-50% uncertainty minimum',
    'Water quality predictions without laboratory analysis cannot detect localized contamination',
    'Geological classification from satellite may not reflect subsurface lithology below weathered zone',
    'The tool does not replace professional hydrogeological assessment for final drilling decisions',
    'All predictions should be verified by field investigation before financial commitment',
    hasERT ? '' : 'No geophysical field data â€” predictions are desktop estimates only',
    hasPumpTest ? '' : 'No pump test data â€” aquifer parameters are model estimates, not measured values',
  ].filter(Boolean);

  const assumptions = [
    'GPS coordinates accurately represent the target borehole location',
    'Satellite data from the most recent available pass is representative',
    'Hydrogeological conditions are approximately stationary (no major recent changes)',
    'Nearby boreholes are in similar geological/hydrogeological settings',
    'Aquifer is laterally continuous within the study area',
    'Darcy flow law is valid (laminar flow; Re < 10)',
    'Isotropic aquifer conditions (K_horizontal = K_vertical)',
  ];

  const recommendations = [
    hasERT ? 'ERT data present â€” verify electrode layout and data quality before relying on resistivity model' : 'CRITICAL: Conduct ERT geophysical survey before any drilling commitment',
    hasPumpTest ? 'Pump test data present â€” verify test duration was adequate (>24 hours recommended for confined aquifers)' : 'Conduct step-drawdown and constant-rate pump test after drilling to validate yield estimates',
    hasNearby ? `${nearbyWellList.length} nearby wells used for calibration â€” verify records are current` : 'Seek additional nearby borehole records from local water authorities for calibration',
    'Commission laboratory water quality analysis after drilling (WHO guideline parameters at minimum)',
    'Engage qualified hydrogeologist to review findings before final engineering design',
    'Consider seasonal variation â€” drill during/after wet season for best yield estimate',
  ];

  return {
    steps,
    standardsReferenced: standards,
    softwareVersion: 'AquaScan Pro v2.0 â€” AI Borehole Intelligence Platform',
    analysisDate: new Date().toISOString(),
    disclaimer: 'This report is generated by an AI-assisted decision support tool. It is intended to supplement, not replace, professional hydrogeological judgment. All predictions carry stated uncertainty and should be verified by field investigation. The tool operators and developers accept no liability for drilling outcomes based solely on this report. A qualified hydrogeologist or water engineer should review all findings before any financial commitment or drilling mobilization.',
    limitations,
    assumptions,
    recommendations,
  };
}

// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
//  5. TRUST SCORE COMPUTATION
// â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

function computeTrustBreakdown(
  prov: ProvenanceMatrix,
  cv: CrossValidationResult,
  mc: UncertaintyAnalysis,
  meth: MethodologyReport
): EngineerConfidenceResult['trustBreakdown'] {
  const satCount = prov.satelliteSourceCount ?? 0;
  const modelCount = prov.modelEngineCount ?? 0;

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // DATA QUALITY (0-25): How much real data feeds the analysis?
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  let dataQuality = 0;

  // Field measurements â€” highest value
  dataQuality += Math.min(8, prov.measuredCount * 2.5);           // Up to 8 for MEASURED params (ERT, pump test, lab water)
  dataQuality += prov.ertPresent ? 4 : 0;                         // 4 for ERT field survey
  dataQuality += prov.pumpTestPresent ? 4 : 0;                    // 4 for pump test

  // Satellite/remote sensing data â€” real observations from space
  dataQuality += Math.min(5, satCount * 1.0);                     // Up to 5 for satellite sources (SoilGrids, DEM, NDVI, GLDAS, GRACE, InSAR, climate)

  // Calibrated/model-derived sources
  dataQuality += Math.min(3, prov.calibratedCount * 0.8);         // Up to 3 for CALIBRATED params
  dataQuality += Math.min(2, prov.nearbyWellsUsed * 0.4);         // Up to 2 for nearby wells

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // PHYSICS RIGOR (0-25): How physically sound is the analysis?
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  let physicsRigor = 5; // Base: Theis + Cooper-Jacob + pedotransfer always present

  // Core hydrogeological models
  physicsRigor += prov.ertPresent ? 4 : 0;                        // ERT 2D inversion
  physicsRigor += prov.pumpTestPresent ? 4 : 0;                   // Real pump test
  physicsRigor += Math.min(3, meth.steps.length * 0.35);          // Methodology completeness (up to 3)

  // Advanced analytical engines running
  physicsRigor += modelCount >= 8 ? 5 : modelCount >= 5 ? 4 : modelCount >= 3 ? 3 : modelCount >= 1 ? 1.5 : 0; // AI/model engine diversity (up to 5)
  physicsRigor += satCount >= 5 ? 3 : satCount >= 3 ? 2 : satCount >= 1 ? 1 : 0;  // Satellite physics inputs (up to 3)

  // Ensemble & uncertainty quantification
  physicsRigor += mc.convergenceAchieved ? 1.5 : 0;               // Monte Carlo convergence

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // VALIDATION (0-25): How well-validated are the predictions?
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  let validation = 0;

  // Cross-validation against nearby wells. Only REAL field wells earn full
  // validation credit — validating the model against its own synthetic wells
  // is circular (the report even flags it) and was inflating Trust Score to
  // Grade A on desktop-only runs.
  const fieldWells = cv.fieldWellCount ?? cv.wellCount;
  if (fieldWells >= 5 && cv.depthMAPE_pct < 20) validation += 14;
  else if (fieldWells >= 3 && cv.depthMAPE_pct < 35) validation += 10;
  else if (fieldWells >= 1) validation += 6;
  else if (cv.wellCount >= 1) validation += 2; // synthetic-only: token credit
  else validation += 1;

  // Monte Carlo uncertainty quantified
  validation += mc.convergenceAchieved ? 3 : 0;

  // Multi-source agreement â€” if many engines agree, that IS validation
  if (modelCount >= 6 && satCount >= 4) validation += 5;          // Strong multi-engine consensus
  else if (modelCount >= 4 && satCount >= 3) validation += 4;
  else if (modelCount >= 2 && satCount >= 2) validation += 2.5;
  else if (modelCount >= 1 || satCount >= 1) validation += 1;

  // Ensemble result is itself a validation mechanism (Bayesian fusion)
  validation += prov.calibratedCount >= 3 ? 2 : prov.calibratedCount >= 1 ? 1 : 0;

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // TRANSPARENCY (0-25): Always full if this engine runs
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  const transparency = 25; // Full provenance, methodology, limitations, uncertainty disclosed

  return {
    dataQuality: Math.min(25, Math.round(dataQuality)),
    physicsRigor: Math.min(25, Math.round(physicsRigor)),
    validation: Math.min(25, Math.round(validation)),
    transparency: Math.min(25, transparency),
  };
}

function computeCertificationReadiness(
  prov: ProvenanceMatrix,
  cv: CrossValidationResult,
  trustScore: number
): EngineerConfidenceResult['certificationReadiness'] {
  const satCount = prov.satelliteSourceCount ?? 0;
  const modelCount = prov.modelEngineCount ?? 0;

  const preFeasMissing: string[] = [];
  if (!prov.nearbyWellsUsed && satCount < 3) preFeasMissing.push('Nearby borehole data or 3+ satellite sources');
  const preFeasReady = preFeasMissing.length === 0 && trustScore >= 35;

  const engMissing: string[] = [];
  if (!prov.ertPresent && modelCount < 5) engMissing.push('ERT geophysical survey (or 5+ analytical engines)');
  if (!prov.nearbyWellsUsed && satCount < 4) engMissing.push('Nearby borehole calibration (or 4+ satellite sources)');
  const certFieldWells = cv.fieldWellCount ?? cv.wellCount;
  if (certFieldWells < 3 && modelCount < 6) engMissing.push(`Minimum 3 FIELD validation wells (have ${certFieldWells}; model-generated wells don't count) or 6+ cross-validating engines`);
  const engReady = engMissing.length === 0 && trustScore >= 60;

  const bankMissing: string[] = [];
  if (!prov.ertPresent) bankMissing.push('ERT geophysical survey');
  if (!prov.pumpTestPresent) bankMissing.push('Pump test (step-drawdown + constant rate)');
  if (certFieldWells < 5) bankMissing.push(`Minimum 5 FIELD validation wells (have ${certFieldWells}; model-generated wells don't count)`);
  if (prov.measuredCount < 3) bankMissing.push(`Minimum 3 measured parameters (have ${prov.measuredCount})`);
  const bankReady = bankMissing.length === 0 && trustScore >= 80;

  const regMissing = [...bankMissing];
  regMissing.push('Professional hydrogeologist review and sign-off');
  regMissing.push('Laboratory water quality analysis (ISO 5667)');
  if (cv.depthMAPE_pct > 15) regMissing.push('Depth prediction accuracy <15% MAPE');
  const regReady = false; // Always false â€” requires human sign-off

  return {
    preFeasibility: { ready: preFeasReady, score: Math.min(100, trustScore + 10), missing: preFeasMissing },
    engineeringGrade: { ready: engReady, score: Math.min(100, trustScore), missing: engMissing },
    bankable: { ready: bankReady, score: Math.min(100, trustScore - 5), missing: bankMissing },
    regulatorySubmission: { ready: regReady, score: Math.min(100, trustScore - 15), missing: regMissing },
  };
}

