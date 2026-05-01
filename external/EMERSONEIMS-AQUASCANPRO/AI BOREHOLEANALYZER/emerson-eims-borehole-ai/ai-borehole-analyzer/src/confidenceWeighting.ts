/* ═══════════════════════════════════════════════════════════════════════
   CONFIDENCE WEIGHTED BY DATA QUALITY ENGINE
   Confidence = f(data density + agreement + validation + method quality)
   Honest uncertainty quantification for every prediction
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface DataSourceQuality {
  name: string;
  category: 'satellite' | 'terrain' | 'geological' | 'geophysical' | 'field' | 'historical' | 'model';
  available: boolean;
  qualityScore: number;     // 0-1
  spatialResolution_m?: number;
  temporalCoverage_years?: number;
  uncertainty_pct?: number;
  weight: number;            // contribution weight to final confidence
  notes?: string;
}

export interface AgreementMetrics {
  sourceCount: number;
  pairwiseAgreement: number;  // 0-1 average pairwise agreement
  majorityConsensus: boolean;
  outlierSources: string[];
  agreementOnDepth: number;
  agreementOnYield: number;
  agreementOnRockType: number;
}

export interface UncertaintyBounds {
  depth_m: { lower: number; upper: number; confidence: number };
  yield_m3hr: { lower: number; upper: number; confidence: number };
  probability: { lower: number; upper: number };
}

export interface ConfidenceWeightResult {
  // Overall confidence
  overallConfidence: number;   // 0-1 weighted composite
  confidenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  gradeDescription: string;

  // Breakdown
  dataQualityScore: number;    // 0-1 quality of input data
  dataCompletenessScore: number; // 0-1 how much data available
  sourceAgreementScore: number;  // 0-1 how well sources agree
  validationScore: number;       // 0-1 has this been validated
  methodQualityScore: number;    // 0-1 quality of analysis methods used

  // Source analysis
  sources: DataSourceQuality[];
  agreement: AgreementMetrics;

  // Uncertainty bounds
  uncertaintyBounds: UncertaintyBounds;

  // Recommendations for improvement
  improvements: {
    action: string;
    expectedGainPct: number;
    cost: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }[];

  // Final adjusted values
  adjustedProbability: number;
  adjustedDepth_m: number;
  adjustedYield_m3hr: number;

  methodology: string;
}

/* ── Source Quality Weights ────────────────────────────────── */

const SOURCE_WEIGHTS: Record<string, { baseQuality: number; weight: number; category: DataSourceQuality['category'] }> = {
  // Field data (highest value)
  'ert_survey':         { baseQuality: 0.90, weight: 0.20, category: 'geophysical' },
  'seismic_survey':     { baseQuality: 0.88, weight: 0.15, category: 'geophysical' },
  'tdem_survey':        { baseQuality: 0.85, weight: 0.12, category: 'geophysical' },
  'pump_test':          { baseQuality: 0.95, weight: 0.25, category: 'field' },
  'nearby_boreholes':   { baseQuality: 0.85, weight: 0.18, category: 'historical' },

  // Remote sensing (moderate value)
  'dem_terrain':        { baseQuality: 0.65, weight: 0.05, category: 'terrain' },
  'satellite_imagery':  { baseQuality: 0.55, weight: 0.04, category: 'satellite' },
  'insar':              { baseQuality: 0.60, weight: 0.04, category: 'satellite' },
  'ndvi_vegetation':    { baseQuality: 0.50, weight: 0.03, category: 'satellite' },
  'precipitation_data': { baseQuality: 0.70, weight: 0.05, category: 'model' },

  // Desktop data (lower value but always available)
  'geological_map':     { baseQuality: 0.50, weight: 0.06, category: 'geological' },
  'soil_data':          { baseQuality: 0.45, weight: 0.04, category: 'geological' },
  'macrostrat_geology': { baseQuality: 0.55, weight: 0.05, category: 'geological' },
  'regional_statistics': { baseQuality: 0.40, weight: 0.04, category: 'historical' },
};

/* ── Main Confidence Calculation ──────────────────────────── */

export interface ConfidenceInput {
  // Available data sources (true/false for each)
  hasERT: boolean;
  hasSeismic: boolean;
  hasTDEM: boolean;
  hasPumpTest: boolean;
  hasNearbyBoreholes: boolean;
  hasDEM: boolean;
  hasSatelliteImagery: boolean;
  hasInSAR: boolean;
  hasNDVI: boolean;
  hasPrecipitationData: boolean;
  hasGeologicalMap: boolean;
  hasSoilData: boolean;
  hasMacrostrat: boolean;
  hasRegionalStats: boolean;

  // Predicted values (from pipeline)
  predictedDepth_m: number;
  predictedYield_m3hr: number;
  predictedProbability: number;

  // Depth estimates from each source (for agreement calculation)
  depthEstimates?: { source: string; depth_m: number }[];
  yieldEstimates?: { source: string; yield_m3hr: number }[];
  rockTypeEstimates?: { source: string; rockType: string }[];

  // Calibration data
  calibrationEntryCount?: number;
  calibrationAccuracy?: number;

  // Regional context
  latitude?: number;
  longitude?: number;
}

export function calculateConfidenceWeighted(input: ConfidenceInput): ConfidenceWeightResult {
  // 1. Build source quality list
  const sources = buildSourceList(input);
  const availableSources = sources.filter(s => s.available);

  // 2. Data completeness score
  const totalPossibleWeight = sources.reduce((a, s) => a + s.weight, 0);
  const availableWeight = availableSources.reduce((a, s) => a + s.weight, 0);
  const dataCompletenessScore = Math.min(1, availableWeight / totalPossibleWeight);

  // 3. Data quality score (weighted average of available source qualities)
  const dataQualityScore = availableSources.length > 0
    ? availableSources.reduce((a, s) => a + s.qualityScore * s.weight, 0) / availableWeight
    : 0.2;

  // 4. Source agreement score
  const agreement = calculateAgreement(input);
  const sourceAgreementScore = agreement.pairwiseAgreement;

  // 5. Validation score
  const validationScore = calcValidationScore(input);

  // 6. Method quality score
  const hasFieldData = input.hasERT || input.hasSeismic || input.hasTDEM || input.hasPumpTest;
  const hasRemoteData = input.hasDEM || input.hasSatelliteImagery || input.hasInSAR;
  const hasGeoData = input.hasGeologicalMap || input.hasMacrostrat || input.hasSoilData;
  const methodQualityScore = Math.min(1,
    (hasFieldData ? 0.40 : 0) +
    (hasRemoteData ? 0.20 : 0) +
    (hasGeoData ? 0.15 : 0) +
    (input.hasNearbyBoreholes ? 0.15 : 0) +
    (input.hasPrecipitationData ? 0.10 : 0));

  // 7. Overall confidence (weighted composite)
  const overallConfidence = Math.min(0.98, Math.max(0.15,
    dataQualityScore * 0.25 +
    dataCompletenessScore * 0.20 +
    sourceAgreementScore * 0.20 +
    validationScore * 0.15 +
    methodQualityScore * 0.20));

  // 8. Confidence grade
  const { grade, description } = gradeConfidence(overallConfidence, hasFieldData);

  // 9. Uncertainty bounds
  const uncertaintyBounds = calcUncertaintyBounds(input, overallConfidence);

  // 10. Improvements
  const improvements = suggestImprovements(input, sources);

  // 11. Adjusted values (conservative adjustment based on confidence)
  const conservatismFactor = 1 - (1 - overallConfidence) * 0.3; // slight conservative pull
  const adjustedProbability = Math.max(0.05, Math.min(0.95, input.predictedProbability * conservatismFactor));
  const adjustedDepth = input.predictedDepth_m; // depth not adjusted, uncertainty expressed in bounds
  const adjustedYield = input.predictedYield_m3hr * conservatismFactor;

  return {
    overallConfidence: Math.round(overallConfidence * 1000) / 1000,
    confidenceGrade: grade,
    gradeDescription: description,
    dataQualityScore: Math.round(dataQualityScore * 100) / 100,
    dataCompletenessScore: Math.round(dataCompletenessScore * 100) / 100,
    sourceAgreementScore: Math.round(sourceAgreementScore * 100) / 100,
    validationScore: Math.round(validationScore * 100) / 100,
    methodQualityScore: Math.round(methodQualityScore * 100) / 100,
    sources,
    agreement,
    uncertaintyBounds,
    improvements,
    adjustedProbability: Math.round(adjustedProbability * 1000) / 1000,
    adjustedDepth_m: Math.round(adjustedDepth * 10) / 10,
    adjustedYield_m3hr: Math.round(adjustedYield * 100) / 100,
    methodology: 'Multi-criteria confidence model: quality × completeness × agreement × validation × method (ISO 19157 spatial data quality)',
  };
}

/* ── Build Source List ────────────────────────────────────── */

function buildSourceList(input: ConfidenceInput): DataSourceQuality[] {
  const mapping: [string, boolean][] = [
    ['ert_survey', input.hasERT],
    ['seismic_survey', input.hasSeismic],
    ['tdem_survey', input.hasTDEM],
    ['pump_test', input.hasPumpTest],
    ['nearby_boreholes', input.hasNearbyBoreholes],
    ['dem_terrain', input.hasDEM],
    ['satellite_imagery', input.hasSatelliteImagery],
    ['insar', input.hasInSAR],
    ['ndvi_vegetation', input.hasNDVI],
    ['precipitation_data', input.hasPrecipitationData],
    ['geological_map', input.hasGeologicalMap],
    ['soil_data', input.hasSoilData],
    ['macrostrat_geology', input.hasMacrostrat],
    ['regional_statistics', input.hasRegionalStats],
  ];

  return mapping.map(([name, available]) => {
    const sw = SOURCE_WEIGHTS[name];
    return {
      name,
      category: sw.category,
      available,
      qualityScore: available ? sw.baseQuality : 0,
      weight: sw.weight,
    };
  });
}

/* ── Agreement Calculation ────────────────────────────────── */

function calculateAgreement(input: ConfidenceInput): AgreementMetrics {
  const de = input.depthEstimates || [];
  const ye = input.yieldEstimates || [];
  const re = input.rockTypeEstimates || [];

  let agreementOnDepth = 0.5;
  let agreementOnYield = 0.5;
  let agreementOnRockType = 0.5;
  const outlierSources: string[] = [];

  // Depth agreement (coefficient of variation)
  if (de.length >= 2) {
    const depths = de.map(e => e.depth_m);
    const mean = depths.reduce((a, b) => a + b) / depths.length;
    const std = Math.sqrt(depths.reduce((a, d) => a + (d - mean) ** 2, 0) / depths.length);
    const cv = mean > 0 ? std / mean : 1;
    agreementOnDepth = Math.max(0, 1 - cv * 2); // CV < 0.5 → good agreement

    // Find outliers (> 1.5 std from mean)
    for (const e of de) {
      if (Math.abs(e.depth_m - mean) > 1.5 * std) outlierSources.push(e.source);
    }
  }

  // Yield agreement
  if (ye.length >= 2) {
    const yields = ye.map(e => e.yield_m3hr);
    const mean = yields.reduce((a, b) => a + b) / yields.length;
    const std = Math.sqrt(yields.reduce((a, y) => a + (y - mean) ** 2, 0) / yields.length);
    const cv = mean > 0 ? std / mean : 1;
    agreementOnYield = Math.max(0, 1 - cv * 2);
  }

  // Rock type agreement (mode percentage)
  if (re.length >= 2) {
    const counts = new Map<string, number>();
    for (const e of re) {
      const k = e.rockType.toLowerCase();
      counts.set(k, (counts.get(k) || 0) + 1);
    }
    const maxCount = Math.max(...counts.values());
    agreementOnRockType = maxCount / re.length;
  }

  const pairwiseAgreement = (agreementOnDepth * 0.4 + agreementOnYield * 0.3 + agreementOnRockType * 0.3);
  const sourceCount = (input.depthEstimates?.length ?? 0) + (input.yieldEstimates?.length ?? 0) + (input.rockTypeEstimates?.length ?? 0);

  return {
    sourceCount,
    pairwiseAgreement: Math.round(pairwiseAgreement * 100) / 100,
    majorityConsensus: pairwiseAgreement > 0.6,
    outlierSources: [...new Set(outlierSources)],
    agreementOnDepth: Math.round(agreementOnDepth * 100) / 100,
    agreementOnYield: Math.round(agreementOnYield * 100) / 100,
    agreementOnRockType: Math.round(agreementOnRockType * 100) / 100,
  };
}

/* ── Validation Score ─────────────────────────────────────── */

function calcValidationScore(input: ConfidenceInput): number {
  let score = 0.3; // base: unvalidated prediction
  if (input.calibrationEntryCount && input.calibrationEntryCount > 0) {
    score += Math.min(0.3, input.calibrationEntryCount * 0.015); // up to 0.3 from having calibration data
  }
  if (input.calibrationAccuracy && input.calibrationAccuracy > 70) {
    score += (input.calibrationAccuracy - 70) / 100; // bonus for good calibration
  }
  if (input.hasNearbyBoreholes) score += 0.1;
  if (input.hasPumpTest) score += 0.15;
  return Math.min(1, score);
}

/* ── Confidence Grade ─────────────────────────────────────── */

function gradeConfidence(confidence: number, hasFieldData: boolean): { grade: ConfidenceWeightResult['confidenceGrade']; description: string } {
  if (confidence >= 0.80 && hasFieldData) {
    return { grade: 'A', description: 'BANKABLE — High confidence with field validation. Suitable for investment decisions.' };
  }
  if (confidence >= 0.65) {
    return { grade: 'B', description: 'ENGINEERING GRADE — Good confidence from multiple data sources. Drilling recommended with normal risk.' };
  }
  if (confidence >= 0.50) {
    return { grade: 'C', description: 'PRE-FEASIBILITY — Moderate confidence. Consider additional survey before committing.' };
  }
  if (confidence >= 0.35) {
    return { grade: 'D', description: 'STANDARD ASSESSMENT — Limited data coverage. ERT integration recommended to improve confidence.' };
  }
  return { grade: 'F', description: 'INSUFFICIENT — Very limited data. Not reliable for drilling decisions. Full survey programme required.' };
}

/* ── Uncertainty Bounds ───────────────────────────────────── */

function calcUncertaintyBounds(input: ConfidenceInput, confidence: number): UncertaintyBounds {
  // Uncertainty range inversely proportional to confidence
  const depthUncertainty = (1 - confidence) * 0.4; // up to ±40% at zero confidence
  const yieldUncertainty = (1 - confidence) * 0.6; // yield more uncertain
  const probUncertainty = (1 - confidence) * 0.3;

  return {
    depth_m: {
      lower: Math.max(5, Math.round(input.predictedDepth_m * (1 - depthUncertainty))),
      upper: Math.round(input.predictedDepth_m * (1 + depthUncertainty)),
      confidence: Math.round((1 - depthUncertainty * 2) * 100) / 100,
    },
    yield_m3hr: {
      lower: Math.max(0.01, Math.round(input.predictedYield_m3hr * (1 - yieldUncertainty) * 100) / 100),
      upper: Math.round(input.predictedYield_m3hr * (1 + yieldUncertainty) * 100) / 100,
      confidence: Math.round((1 - yieldUncertainty * 2) * 100) / 100,
    },
    probability: {
      lower: Math.max(0.05, Math.round((input.predictedProbability - probUncertainty) * 100) / 100),
      upper: Math.min(0.98, Math.round((input.predictedProbability + probUncertainty) * 100) / 100),
    },
  };
}

/* ── Improvement Suggestions ──────────────────────────────── */

function suggestImprovements(input: ConfidenceInput, sources: DataSourceQuality[]): ConfidenceWeightResult['improvements'] {
  const improvements: ConfidenceWeightResult['improvements'] = [];

  if (!input.hasERT) {
    improvements.push({
      action: 'Conduct ERT (Electrical Resistivity Tomography) survey',
      expectedGainPct: 18,
      cost: '$500 – $2,000',
      priority: 'critical',
    });
  }
  if (!input.hasSeismic && input.hasDEM) {
    improvements.push({
      action: 'Add seismic refraction survey to confirm bedrock depth',
      expectedGainPct: 12,
      cost: '$1,000 – $3,000',
      priority: 'high',
    });
  }
  if (!input.hasNearbyBoreholes) {
    improvements.push({
      action: 'Collect data from nearby boreholes (government records, drillers)',
      expectedGainPct: 10,
      cost: '$0 – $200 (data collection)',
      priority: 'high',
    });
  }
  if (!input.hasTDEM && input.hasERT) {
    improvements.push({
      action: 'Add TDEM (Time-Domain EM) for deeper investigation',
      expectedGainPct: 8,
      cost: '$800 – $1,500',
      priority: 'medium',
    });
  }
  if (!input.hasPrecipitationData) {
    improvements.push({
      action: 'Include historical precipitation analysis for recharge estimation',
      expectedGainPct: 5,
      cost: '$0 (free open data)',
      priority: 'medium',
    });
  }
  if (!input.hasInSAR) {
    improvements.push({
      action: 'Add InSAR deformation analysis for subsidence detection',
      expectedGainPct: 4,
      cost: '$0 – $500',
      priority: 'low',
    });
  }

  return improvements.sort((a, b) => {
    const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return pOrder[a.priority] - pOrder[b.priority];
  });
}
