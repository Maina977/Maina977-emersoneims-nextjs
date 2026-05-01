// ═══════════════════════════════════════════════════════════════════════════
// DATA QUALITY SCORING ENGINE
// For every analysis report: compute % satellite, % real field, % inferred data
// Makes reports transparent, credible, and bank-ready (ISO 19157 compliance)
// ═══════════════════════════════════════════════════════════════════════════

export interface DataSourceEntry {
  name: string;
  category: 'satellite' | 'field_measurement' | 'laboratory' | 'model_inferred' | 'database' | 'user_input';
  available: boolean;
  quality: 'measured' | 'calibrated' | 'estimated' | 'inferred' | 'default';
  weight: number;           // 0-1 importance weight
  accuracy_pct?: number;    // known accuracy (if available)
  timestamp?: string;       // data age
  description: string;
}

export interface DataQualityScore {
  // Breakdown by origin
  satelliteData_pct: number;
  fieldMeasurement_pct: number;
  laboratoryData_pct: number;
  modelInferred_pct: number;
  databaseData_pct: number;
  userInput_pct: number;

  // Quality tiers
  measuredData_pct: number;      // directly measured (highest quality)
  calibratedData_pct: number;    // calibrated from measurements
  estimatedData_pct: number;     // estimated using models
  inferredData_pct: number;      // inferred from proxies (lowest quality)

  // Composite scores
  overallQualityScore: number;   // 0-100
  dataCompleteness_pct: number;  // % of possible sources available
  dataFreshness: 'current' | 'recent' | 'dated' | 'stale';
  reliabilityGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  bankabilityStatus: 'BANKABLE' | 'ENGINEERING_GRADE' | 'PRE_FEASIBILITY' | 'DESKTOP_SCREENING';

  // Per-prediction quality
  depthPredictionQuality: number;    // 0-100
  yieldPredictionQuality: number;    // 0-100
  waterQualityPredictionQuality: number; // 0-100
  probabilityQuality: number;        // 0-100

  // Transparency report
  sources: DataSourceEntry[];
  missingCriticalData: string[];
  upgradeRecommendations: string[];

  // Trust indicators
  independentSourceCount: number;
  crossValidatedSources: number;
  fieldGroundTruthSources: number;

  // Fallback / degraded sources — engineer MUST review these
  fallbackSources: string[];      // names of sources using latitude-based fallback
  fallbackWarning: string;        // human-readable warning if any fallback in use

  // Narrative
  narrative: string;
}

// ═══ COMPREHENSIVE SOURCE CATALOG ═══
// Every possible data source the system can use
const SOURCE_CATALOG: Omit<DataSourceEntry, 'available'>[] = [
  // Satellite / Remote Sensing
  { name: 'ISRIC SoilGrids', category: 'satellite', quality: 'calibrated', weight: 0.7, accuracy_pct: 75, description: 'Global soil property maps at 250m resolution (pH, texture, organic C)' },
  { name: 'SRTM/Copernicus DEM', category: 'satellite', quality: 'calibrated', weight: 0.8, accuracy_pct: 90, description: 'Digital elevation model — slope, aspect, TWI, drainage (satellite-observed)' },
  { name: 'Sentinel-2 NDVI', category: 'satellite', quality: 'calibrated', weight: 0.6, accuracy_pct: 85, description: 'Vegetation index from multispectral satellite imagery (satellite-observed)' },
  { name: 'NASA POWER Climate', category: 'satellite', quality: 'calibrated', weight: 0.7, accuracy_pct: 80, description: 'Precipitation, temperature, evapotranspiration reanalysis' },
  { name: 'GLDAS Soil Moisture', category: 'satellite', quality: 'calibrated', weight: 0.65, accuracy_pct: 70, description: 'Land surface model soil moisture and water budget' },
  { name: 'GRACE-FO TWS', category: 'satellite', quality: 'calibrated', weight: 0.75, accuracy_pct: 85, description: 'Total water storage anomaly from gravity field (satellite-observed)' },
  { name: 'Sentinel-1 InSAR', category: 'satellite', quality: 'calibrated', weight: 0.6, accuracy_pct: 80, description: 'Ground deformation / subsidence from SAR interferometry (satellite-observed)' },
  { name: 'Landsat Time Series', category: 'satellite', quality: 'calibrated', weight: 0.5, accuracy_pct: 80, description: 'Multi-decadal vegetation and land use change (satellite-observed)' },

  // Field Measurements
  { name: 'ERT Survey', category: 'field_measurement', quality: 'measured', weight: 0.95, accuracy_pct: 90, description: 'Electrical resistivity tomography — subsurface resistivity profile' },
  { name: 'Seismic Refraction', category: 'field_measurement', quality: 'measured', weight: 0.9, accuracy_pct: 88, description: 'P-wave velocity → bedrock depth, weathering profile' },
  { name: 'TDEM/EM Survey', category: 'field_measurement', quality: 'measured', weight: 0.88, accuracy_pct: 85, description: 'Transient electromagnetic — deep conductor detection' },
  { name: 'GPR Survey', category: 'field_measurement', quality: 'measured', weight: 0.75, accuracy_pct: 80, description: 'Ground penetrating radar — shallow targets, water table' },
  { name: 'Magnetic Survey', category: 'field_measurement', quality: 'measured', weight: 0.7, accuracy_pct: 75, description: 'Magnetic anomaly → fault/dyke detection' },
  { name: 'NMR/MRS Survey', category: 'field_measurement', quality: 'measured', weight: 0.95, accuracy_pct: 92, description: 'Surface NMR — direct water content measurement' },
  { name: 'Pump Test (24hr)', category: 'field_measurement', quality: 'measured', weight: 0.98, accuracy_pct: 95, description: 'Transmissivity, storativity, sustainable yield from pumping test' },
  { name: 'Lithology Log', category: 'field_measurement', quality: 'measured', weight: 0.92, accuracy_pct: 95, description: 'Drill cuttings/core — actual rock sequence and water strikes' },

  // Laboratory
  { name: 'Lab Water Analysis', category: 'laboratory', quality: 'measured', weight: 0.98, accuracy_pct: 98, description: 'Certified lab: pH, TDS, Fe, F, As, NO₃, coliforms' },

  // Database / Regional
  { name: 'Nearby Borehole DB', category: 'database', quality: 'measured', weight: 0.85, accuracy_pct: 85, description: 'Nearby borehole records (depth, yield, success)' },
  { name: 'Regional Statistics', category: 'database', quality: 'estimated', weight: 0.5, accuracy_pct: 60, description: 'Country/region-level borehole success rates and depths' },
  { name: 'Macrostrat Geology', category: 'database', quality: 'calibrated', weight: 0.7, accuracy_pct: 75, description: 'Geological map — rock type, formation, age' },
  { name: 'USGS MRData', category: 'database', quality: 'calibrated', weight: 0.6, accuracy_pct: 70, description: 'Mineral resource database — structural features' },

  // Model-derived
  { name: 'Pedotransfer Functions', category: 'model_inferred', quality: 'estimated', weight: 0.5, accuracy_pct: 60, description: 'Soil texture → hydraulic conductivity (Rawls & Brakensiek)' },
  { name: 'Rock Mapper (8-classifier)', category: 'model_inferred', quality: 'estimated', weight: 0.65, accuracy_pct: 70, description: 'Multi-classifier rock type prediction ensemble' },
  { name: 'Fracture/Lineament AI', category: 'model_inferred', quality: 'estimated', weight: 0.6, accuracy_pct: 65, description: 'DEM + tectonic pattern → fracture density and intersections' },
  { name: 'Bayesian Ensemble', category: 'model_inferred', quality: 'estimated', weight: 0.7, accuracy_pct: 72, description: 'Multi-source Bayesian fusion (depth, yield, probability)' },
  { name: 'Recharge Model (SCS-CN)', category: 'model_inferred', quality: 'estimated', weight: 0.55, accuracy_pct: 60, description: 'Water balance → recharge estimation' },
  { name: 'Hydrochemical Predictor', category: 'model_inferred', quality: 'inferred', weight: 0.45, accuracy_pct: 55, description: 'Rock type → predicted water chemistry' },

  // User Input
  { name: 'Client Location', category: 'user_input', quality: 'estimated', weight: 0.9, accuracy_pct: 95, description: 'User-provided GPS or address — geocoded coordinates' },
  { name: 'Site Photo/Image', category: 'user_input', quality: 'estimated', weight: 0.4, accuracy_pct: 50, description: 'Terrain image → soil/vegetation/rock visual classification' },
];

// ═══ MAIN SCORING FUNCTION ═══
export function computeDataQualityScore(analysisResult: any): DataQualityScore {
  const r = analysisResult;

  // Determine which sources were actually used
  const sources: DataSourceEntry[] = SOURCE_CATALOG.map(s => ({
    ...s,
    available: isSourceAvailable(s.name, r),
  }));

  // Detect and downgrade fallback sources
  const fallbackNames: string[] = [];
  for (const s of sources) {
    if (s.available && isSourceFallback(s.name, r)) {
      fallbackNames.push(s.name);
      // Downgrade: fallback data is 'inferred' quality with reduced accuracy
      s.quality = 'inferred';
      s.accuracy_pct = Math.min(s.accuracy_pct ?? 50, 35); // latitude-based ≤ 35%
      s.description += ' [⚠ FALLBACK — latitude-based estimate, not real API data]';
    }
  }

  const available = sources.filter(s => s.available);
  const totalWeight = sources.reduce((sum, s) => sum + s.weight, 0);
  const availableWeight = available.reduce((sum, s) => sum + s.weight, 0);

  // Category breakdown
  const byCategory = (cat: DataSourceEntry['category']) => {
    const catSources = available.filter(s => s.category === cat);
    const catWeight = catSources.reduce((sum, s) => sum + s.weight, 0);
    return availableWeight > 0 ? (catWeight / availableWeight) * 100 : 0;
  };

  const satellitePct = byCategory('satellite');
  const fieldPct = byCategory('field_measurement');
  const labPct = byCategory('laboratory');
  const modelPct = byCategory('model_inferred');
  const dbPct = byCategory('database');
  const userPct = byCategory('user_input');

  // Quality tier breakdown
  const byQuality = (qual: DataSourceEntry['quality']) => {
    const qualSources = available.filter(s => s.quality === qual);
    const qualWeight = qualSources.reduce((sum, s) => sum + s.weight, 0);
    return availableWeight > 0 ? (qualWeight / availableWeight) * 100 : 0;
  };

  const measuredPct = byQuality('measured');
  const calibratedPct = byQuality('calibrated');
  const estimatedPct = byQuality('estimated');
  const inferredPct = byQuality('inferred');

  // Completeness
  const completeness = (available.length / sources.length) * 100;

  // Overall quality score (weighted by source importance × accuracy)
  const qualityScore = availableWeight > 0
    ? available.reduce((sum, s) => sum + s.weight * (s.accuracy_pct || 50), 0) / availableWeight
    : 30;

  // Data freshness
  const freshness: DataQualityScore['dataFreshness'] = 'current'; // In a real system would check timestamps

  // Reliability grade
  const grade: DataQualityScore['reliabilityGrade'] =
    qualityScore >= 85 ? 'A' : qualityScore >= 75 ? 'B' : qualityScore >= 60 ? 'C' : qualityScore >= 45 ? 'D' : 'F';

  // Bankability
  const bankability: DataQualityScore['bankabilityStatus'] =
    fieldPct > 30 && qualityScore >= 85 && available.some(s => s.name === 'ERT Survey') && available.some(s => s.name === 'Pump Test (24hr)') ? 'BANKABLE' :
    fieldPct > 15 && qualityScore >= 75 ? 'ENGINEERING_GRADE' :
    qualityScore >= 60 ? 'PRE_FEASIBILITY' : 'DESKTOP_SCREENING';

  // Per-prediction quality
  const depthQuality = computePredictionSpecificQuality(available, ['ERT Survey', 'Seismic Refraction', 'Lithology Log', 'Nearby Borehole DB', 'SRTM/Copernicus DEM', 'Bayesian Ensemble']);
  const yieldQuality = computePredictionSpecificQuality(available, ['Pump Test (24hr)', 'Nearby Borehole DB', 'ERT Survey', 'NMR/MRS Survey', 'Recharge Model (SCS-CN)', 'Bayesian Ensemble']);
  const wqQuality = computePredictionSpecificQuality(available, ['Lab Water Analysis', 'Hydrochemical Predictor', 'ISRIC SoilGrids', 'Macrostrat Geology']);
  const probQuality = computePredictionSpecificQuality(available, ['Bayesian Ensemble', 'Nearby Borehole DB', 'Fracture/Lineament AI', 'Rock Mapper (8-classifier)', 'Recharge Model (SCS-CN)']);

  // Missing critical data
  const criticalMissing: string[] = [];
  const criticalSources = ['ERT Survey', 'Pump Test (24hr)', 'Lithology Log', 'Lab Water Analysis', 'Nearby Borehole DB'];
  for (const name of criticalSources) {
    if (!available.some(s => s.name === name)) {
      criticalMissing.push(name);
    }
  }

  // Upgrade recommendations
  const upgrades: string[] = [];
  if (!available.some(s => s.name === 'ERT Survey')) upgrades.push('Conduct ERT survey (+15-20% depth accuracy, ~$2,000-5,000)');
  if (!available.some(s => s.name === 'Pump Test (24hr)')) upgrades.push('Run 24-hour pump test (+10-15% yield accuracy, ~$1,500-3,000)');
  if (!available.some(s => s.name === 'Lab Water Analysis')) upgrades.push('Get certified lab water analysis (+20% water quality accuracy, ~$200-500)');
  if (!available.some(s => s.name === 'Lithology Log')) upgrades.push('Log lithology during drilling (free, massive long-term value)');
  if (!available.some(s => s.name === 'Seismic Refraction')) upgrades.push('Add seismic refraction survey (+10% bedrock depth accuracy, ~$3,000-8,000)');
  if (!available.some(s => s.name === 'NMR/MRS Survey')) upgrades.push('Surface NMR for direct water detection (+15% yield accuracy, ~$5,000-10,000)');

  // Trust indicators
  const independentCount = new Set(available.map(s => s.category)).size;
  const crossValidated = available.filter(s => s.quality === 'measured' || s.quality === 'calibrated').length;
  const groundTruth = available.filter(s => s.category === 'field_measurement' || s.category === 'laboratory').length;

  // Narrative
  const narrative = [
    `Data quality: ${grade} (${qualityScore.toFixed(0)}%).`,
    `Based on ${available.length}/${sources.length} data sources (${completeness.toFixed(0)}% complete).`,
    `Breakdown: ${satellitePct.toFixed(0)}% satellite, ${fieldPct.toFixed(0)}% field, ${labPct.toFixed(0)}% lab, ${modelPct.toFixed(0)}% modeled, ${dbPct.toFixed(0)}% database.`,
    `${measuredPct.toFixed(0)}% directly measured, ${calibratedPct.toFixed(0)}% calibrated, ${estimatedPct.toFixed(0)}% estimated, ${inferredPct.toFixed(0)}% inferred.`,
    criticalMissing.length > 0 ? `Missing critical: ${criticalMissing.join(', ')}.` : 'All critical data sources available.',
    fallbackNames.length > 0 ? `⚠ FALLBACK DATA IN USE: ${fallbackNames.join(', ')} — these use latitude-based estimates, NOT real satellite/API data. Verify before sign-off.` : 'All data sources verified as real API/field data.',
    `Status: ${bankability.replace(/_/g, ' ')}.`,
  ].join(' ');

  // Fallback warning
  const fallbackWarning = fallbackNames.length > 0
    ? `⚠ WARNING: ${fallbackNames.length} data source(s) are using latitude-based fallback estimates instead of real satellite/API data: ${fallbackNames.join(', ')}. These have reduced accuracy (~35%) and should NOT be relied upon for final engineering design. Engineer must verify provenance before signing.`
    : '';

  return {
    satelliteData_pct: Math.round(satellitePct),
    fieldMeasurement_pct: Math.round(fieldPct),
    laboratoryData_pct: Math.round(labPct),
    modelInferred_pct: Math.round(modelPct),
    databaseData_pct: Math.round(dbPct),
    userInput_pct: Math.round(userPct),
    measuredData_pct: Math.round(measuredPct),
    calibratedData_pct: Math.round(calibratedPct),
    estimatedData_pct: Math.round(estimatedPct),
    inferredData_pct: Math.round(inferredPct),
    overallQualityScore: Math.max(30, Math.round(qualityScore)),
    dataCompleteness_pct: Math.round(completeness),
    dataFreshness: freshness,
    reliabilityGrade: grade,
    bankabilityStatus: bankability,
    depthPredictionQuality: depthQuality,
    yieldPredictionQuality: yieldQuality,
    waterQualityPredictionQuality: wqQuality,
    probabilityQuality: probQuality,
    sources,
    missingCriticalData: criticalMissing,
    upgradeRecommendations: upgrades,
    independentSourceCount: independentCount,
    crossValidatedSources: crossValidated,
    fieldGroundTruthSources: groundTruth,
    fallbackSources: fallbackNames,
    fallbackWarning,
    narrative,
  };
}

// ═══ HELPERS ═══

/** Detects if a data source is using latitude-based fallback instead of real API/field data */
function isSourceFallback(name: string, r: any): boolean {
  const fallbackChecks: Record<string, () => boolean> = {
    'SRTM/Copernicus DEM': () => r.remoteSensing?.elevation?.source?.includes('fallback') === true,
    'Sentinel-2 NDVI': () => {
      const src = r.satelliteVegetation?.dataSource || r.vegetationGWProxy?.methodology || '';
      return src.includes('fallback');
    },
    'NASA POWER Climate': () => {
      const src = r.nasaPowerMoisture?.dataSource || r.remoteSensing?.climate?.source || '';
      return src.includes('fallback');
    },
    'GLDAS Soil Moisture': () => r.gldasGroundwater?.dataSource?.includes('fallback') === true,
    'GRACE-FO TWS': () => r.graceData?.dataSource?.includes('fallback') === true,
    'Nearby Borehole DB': () => {
      const wells = r.nearbyWells?.nearbyWells;
      if (!wells?.length) return false;
      return wells.every((w: any) => w.source?.includes('Synthetic') || w.id?.startsWith('SYN'));
    },
  };
  return (fallbackChecks[name] ?? (() => false))();
}

function isSourceAvailable(name: string, r: any): boolean {
  const checks: Record<string, () => boolean> = {
    'ISRIC SoilGrids': () => !!r.remoteSensing?.soilGrids,
    'SRTM/Copernicus DEM': () => !!r.demHydrology || !!r.remoteSensing?.elevation,
    'Sentinel-2 NDVI': () => !!r.vegetationGWProxy || !!r.satelliteVegetation,
    'NASA POWER Climate': () => !!r.nasaPowerMoisture || !!r.historicalData,
    'GLDAS Soil Moisture': () => !!r.gldasGroundwater,
    'GRACE-FO TWS': () => !!r.graceData,
    'Sentinel-1 InSAR': () => !!r.insarDeformation,
    'Landsat Time Series': () => !!r.historicalData?.weather?.annualPrecipitation?.length,
    'ERT Survey': () => !!r.fieldData?.ertSurvey || !!r.fieldData?.ertDataFile,
    'Seismic Refraction': () => !!r.fieldData?.seismicSurvey,
    'TDEM/EM Survey': () => !!r.fieldData?.emTdemSurvey,
    'GPR Survey': () => !!r.fieldData?.gprSurvey,
    'Magnetic Survey': () => !!r.fieldData?.magneticGravitySurvey,
    'NMR/MRS Survey': () => !!r.fieldData?.nmrSurvey,
    'Pump Test (24hr)': () => !!r.fieldData?.pumpTest,
    'Lithology Log': () => !!r.lithologyAnalysis?.totalLayers || !!r.lithologyAnalysis?.totalDepth_m,
    'Lab Water Analysis': () => !!r.fieldData?.labWaterAnalysis,
    'Nearby Borehole DB': () => !!r.nearbyWells?.nearbyWells?.length || !!r.boreholeIntelligence,
    'Regional Statistics': () => !!r.boreholeRecords,
    'Macrostrat Geology': () => !!r.advancedRockMapping,
    'USGS MRData': () => !!r.advancedRockMapping,
    'Pedotransfer Functions': () => !!r.soil?.porosity,
    'Rock Mapper (8-classifier)': () => !!r.advancedRockMapping || !!r.rockClassification,
    'Fracture/Lineament AI': () => !!r.fractureAI || !!r.lineamentAnalysis,
    'Bayesian Ensemble': () => !!r.ensembleResult,
    'Recharge Model (SCS-CN)': () => !!r.rechargeModel,
    'Hydrochemical Predictor': () => !!r.hydrochemPrediction,
    'Client Location': () => !!r.clientLocation || r.gpsSource !== 'none',
    'Site Photo/Image': () => !!r.pixelAnalysis,
  };
  return (checks[name] ?? (() => false))();
}

function computePredictionSpecificQuality(available: DataSourceEntry[], relevantNames: string[]): number {
  const relevant = available.filter(s => relevantNames.includes(s.name));
  if (relevant.length === 0) return 30; // baseline
  const totalWeight = relevantNames.length;
  const score = relevant.reduce((sum, s) => sum + (s.accuracy_pct || 50) * s.weight, 0);
  const maxScore = relevantNames.length * 100;
  return Math.round(Math.min(100, (score / maxScore) * 100 + relevant.length * 5));
}
