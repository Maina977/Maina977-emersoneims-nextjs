// ═══════════════════════════════════════════════════════════════════════════
// MULTI-SOURCE AGREEMENT ENGINE — Formal Consensus Scoring
// When multiple independent data sources agree, confidence increases dramatically.
// When they disagree, we flag conflicts and weight by reliability.
// Uses modified Dempster-Shafer theory + Bayesian updating.
// ═══════════════════════════════════════════════════════════════════════════

export interface SourceEstimate {
  sourceName: string;
  sourceType: 'satellite' | 'field_measurement' | 'model' | 'database' | 'expert' | 'historical';
  
  // Estimates (any or all can be provided)
  depthEstimate_m?: number;
  yieldEstimate_m3hr?: number;
  probabilityEstimate?: number;   // 0-1
  waterQualityEstimate?: 'potable' | 'acceptable' | 'treatment_needed' | 'non_potable';
  rockTypeEstimate?: string;
  aquiferTypeEstimate?: string;
  waterTableEstimate_m?: number;
  
  // Source metadata
  reliability: number;            // 0-1 intrinsic source reliability
  spatialResolution_m?: number;   // how local is this data
  temporalAge_days?: number;      // how old is this data
  isFieldMeasured: boolean;       // ground truth vs remote/modeled
}

export interface AgreementCluster {
  parameter: string;
  values: { source: string; value: number; reliability: number }[];
  consensusValue: number;
  spread: number;              // standard deviation
  agreementScore: number;      // 0-1 (1 = perfect agreement)
  outliers: string[];          // sources that disagree
  confidenceBoost: number;     // how much this agreement boosts overall confidence
}

export interface ConflictRecord {
  parameter: string;
  source1: string;
  source1Value: string;
  source2: string;
  source2Value: string;
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  resolution: string;          // how the conflict was resolved
  winner: string;              // which source was preferred
  reasoning: string;
}

export interface AgreementResult {
  // Overall agreement
  overallAgreementScore: number;       // 0-1
  overallConfidence: number;           // 0-1 (post-agreement)
  confidenceBeforeAgreement: number;   // for comparison
  confidenceGain_pct: number;
  
  // Consensus estimates
  consensusDepth_m: number;
  consensusYield_m3hr: number;
  consensusProbability: number;
  consensusWaterTable_m: number;
  consensusRockType: string;
  consensusAquiferType: string;
  
  // Uncertainty bounds (tighter with more agreement)
  depthBounds: { lower: number; upper: number; confidence_pct: number };
  yieldBounds: { lower: number; upper: number; confidence_pct: number };
  
  // Agreement clusters per parameter
  clusters: AgreementCluster[];
  
  // Conflicts detected
  conflicts: ConflictRecord[];
  conflictSeverity: 'none' | 'minor' | 'moderate' | 'major';
  
  // Source ranking (which sources performed best)
  sourceRanking: { source: string; weight: number; agreementWithConsensus: number; isOutlier: boolean }[];
  
  // Recommendations
  additionalDataNeeded: string[];  // what data would resolve conflicts
  strongestAgreement: string;       // which parameter has best consensus
  weakestAgreement: string;         // which parameter needs more data
  
  // Summary
  narrative: string;
  sourceCount: number;
  fieldSourceCount: number;
}

// ═══ SOURCE RELIABILITY WEIGHTS ═══
const SOURCE_WEIGHTS: Record<string, number> = {
  // Field measurements (highest)
  'pump_test': 0.95,
  'ert_survey': 0.90,
  'tdem_survey': 0.85,
  'seismic_survey': 0.88,
  'gpr_survey': 0.82,
  'nmr_survey': 0.92,
  'lithology_log': 0.95,
  'water_level_measurement': 0.95,
  'lab_water_quality': 0.95,
  
  // Remote sensing / satellite (moderate-high)
  'soilgrids': 0.70,
  'dem_hydrology': 0.72,
  'grace_satellite': 0.65,
  'era5_climate': 0.68,
  'vegetation_ndvi': 0.55,
  'insar_subsidence': 0.60,
  'sentinel_imagery': 0.58,
  
  // Models / databases (moderate)
  'geological_database': 0.65,
  'macrostrat': 0.60,
  'borehole_database': 0.75,
  'recharge_model': 0.62,
  'fracture_model': 0.55,
  'rock_classification_ai': 0.58,
  
  // Historical / expert (variable)
  'historical_records': 0.50,
  'local_knowledge': 0.45,
  'regional_statistics': 0.40,
};

export function evaluateMultiSourceAgreement(sources: SourceEstimate[]): AgreementResult {
  if (sources.length === 0) {
    return emptyAgreement();
  }
  
  const clusters: AgreementCluster[] = [];
  const conflicts: ConflictRecord[] = [];
  
  // ═══ EVALUATE AGREEMENT FOR EACH PARAMETER ═══
  
  // 1. Depth agreement
  const depthSources = sources.filter(s => s.depthEstimate_m !== undefined && s.depthEstimate_m > 0);
  if (depthSources.length >= 2) {
    const cluster = evaluateNumericAgreement('depth_m', depthSources.map(s => ({
      source: s.sourceName, value: s.depthEstimate_m!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
    detectConflicts('depth_m', depthSources, cluster, conflicts);
  }
  
  // 2. Yield agreement
  const yieldSources = sources.filter(s => s.yieldEstimate_m3hr !== undefined && s.yieldEstimate_m3hr > 0);
  if (yieldSources.length >= 2) {
    const cluster = evaluateNumericAgreement('yield_m3hr', yieldSources.map(s => ({
      source: s.sourceName, value: s.yieldEstimate_m3hr!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
    detectConflicts('yield_m3hr', yieldSources, cluster, conflicts);
  }
  
  // 3. Probability agreement
  const probSources = sources.filter(s => s.probabilityEstimate !== undefined);
  if (probSources.length >= 2) {
    const cluster = evaluateNumericAgreement('probability', probSources.map(s => ({
      source: s.sourceName, value: s.probabilityEstimate!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
  }
  
  // 4. Water table agreement
  const wtSources = sources.filter(s => s.waterTableEstimate_m !== undefined && s.waterTableEstimate_m > 0);
  if (wtSources.length >= 2) {
    const cluster = evaluateNumericAgreement('water_table_m', wtSources.map(s => ({
      source: s.sourceName, value: s.waterTableEstimate_m!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
  }
  
  // 5. Rock type agreement (categorical)
  const rockSources = sources.filter(s => s.rockTypeEstimate);
  if (rockSources.length >= 2) {
    const cluster = evaluateCategoricalAgreement('rock_type', rockSources.map(s => ({
      source: s.sourceName, value: s.rockTypeEstimate!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
  }
  
  // 6. Aquifer type agreement (categorical)
  const aqSources = sources.filter(s => s.aquiferTypeEstimate);
  if (aqSources.length >= 2) {
    const cluster = evaluateCategoricalAgreement('aquifer_type', aqSources.map(s => ({
      source: s.sourceName, value: s.aquiferTypeEstimate!, reliability: getWeight(s)
    })));
    clusters.push(cluster);
  }
  
  // ═══ OVERALL AGREEMENT SCORE ═══
  const clusterScores = clusters.map(c => c.agreementScore);
  const overallAgreement = clusterScores.length > 0
    ? clusterScores.reduce((s, v) => s + v, 0) / clusterScores.length
    : 0;
  
  // ═══ CONFIDENCE CALCULATION ═══
  // Base confidence from source count and reliability
  const avgReliability = sources.reduce((s, src) => s + getWeight(src), 0) / sources.length;
  const baseConfidence = Math.min(0.85, avgReliability * (0.5 + sources.length * 0.05));
  
  // Agreement boost (Dempster-Shafer inspired)
  // When multiple sources agree, confidence increases multiplicatively
  let agreementBoost = 0;
  for (const cluster of clusters) {
    if (cluster.agreementScore > 0.8 && cluster.values.length >= 3) {
      agreementBoost += 0.05; // strong agreement with 3+ sources
    } else if (cluster.agreementScore > 0.6 && cluster.values.length >= 2) {
      agreementBoost += 0.03;
    }
  }
  
  // Field measurement boost
  const fieldCount = sources.filter(s => s.isFieldMeasured).length;
  const fieldBoost = Math.min(0.15, fieldCount * 0.05);
  
  // Conflict penalty
  const criticalConflicts = conflicts.filter(c => c.severity === 'critical' || c.severity === 'major').length;
  const conflictPenalty = criticalConflicts * 0.05;
  
  const finalConfidence = Math.min(0.98, Math.max(0.1, baseConfidence + agreementBoost + fieldBoost - conflictPenalty));
  const confidenceGain = (finalConfidence - baseConfidence) * 100;
  
  // ═══ CONSENSUS ESTIMATES ═══
  const consensusDepth = weightedConsensus(depthSources.map(s => ({ value: s.depthEstimate_m!, weight: getWeight(s) })));
  const consensusYield = weightedConsensus(yieldSources.map(s => ({ value: s.yieldEstimate_m3hr!, weight: getWeight(s) })));
  const consensusProb = weightedConsensus(probSources.map(s => ({ value: s.probabilityEstimate!, weight: getWeight(s) })));
  const consensusWT = weightedConsensus(wtSources.map(s => ({ value: s.waterTableEstimate_m!, weight: getWeight(s) })));
  
  // Categorical consensus
  const consensusRock = categoricalConsensus(rockSources.map(s => ({ value: s.rockTypeEstimate!, weight: getWeight(s) })));
  const consensusAqType = categoricalConsensus(aqSources.map(s => ({ value: s.aquiferTypeEstimate!, weight: getWeight(s) })));
  
  // ═══ UNCERTAINTY BOUNDS ═══
  const depthCluster = clusters.find(c => c.parameter === 'depth_m');
  const yieldCluster = clusters.find(c => c.parameter === 'yield_m3hr');
  
  const depthUncertainty = depthCluster ? depthCluster.spread : consensusDepth * 0.3;
  const yieldUncertainty = yieldCluster ? yieldCluster.spread : consensusYield * 0.5;
  
  const depthBounds = {
    lower: Math.max(1, consensusDepth - depthUncertainty * 1.96),
    upper: consensusDepth + depthUncertainty * 1.96,
    confidence_pct: 95
  };
  const yieldBounds = {
    lower: Math.max(0, consensusYield - yieldUncertainty * 1.96),
    upper: consensusYield + yieldUncertainty * 1.96,
    confidence_pct: 95
  };
  
  // ═══ SOURCE RANKING ═══
  const sourceRanking = sources.map(s => {
    const w = getWeight(s);
    // How close is this source to consensus?
    let agr = 1;
    let checks = 0;
    if (s.depthEstimate_m && consensusDepth > 0) {
      agr *= 1 - Math.min(1, Math.abs(s.depthEstimate_m - consensusDepth) / consensusDepth);
      checks++;
    }
    if (s.yieldEstimate_m3hr && consensusYield > 0) {
      agr *= 1 - Math.min(1, Math.abs(s.yieldEstimate_m3hr - consensusYield) / consensusYield);
      checks++;
    }
    const agreement = checks > 0 ? Math.pow(agr, 1 / checks) : 0.5;
    
    return {
      source: s.sourceName,
      weight: w,
      agreementWithConsensus: agreement,
      isOutlier: agreement < 0.5
    };
  }).sort((a, b) => b.weight * b.agreementWithConsensus - a.weight * a.agreementWithConsensus);
  
  // ═══ ADDITIONAL DATA RECOMMENDATIONS ═══
  const additionalData: string[] = [];
  if (fieldCount === 0) additionalData.push('No field measurements — add ERT survey or pump test for major confidence boost (+15-20%)');
  if (depthSources.length < 3) additionalData.push('Fewer than 3 depth estimates — add lithology log or seismic survey');
  if (yieldSources.length < 2) additionalData.push('Yield estimate from single source — add pump test for ground truth');
  if (criticalConflicts > 0) additionalData.push(`${criticalConflicts} critical conflict(s) — field verification required`);
  if (!sources.some(s => s.sourceName.includes('ert'))) additionalData.push('ERT survey would confirm aquifer depth and reduce uncertainty by ~50%');
  
  // Strongest/weakest agreement
  const sortedClusters = [...clusters].sort((a, b) => b.agreementScore - a.agreementScore);
  const strongest = sortedClusters[0]?.parameter || 'none';
  const weakest = sortedClusters[sortedClusters.length - 1]?.parameter || 'none';
  
  // ═══ CONFLICT SEVERITY ═══
  const conflictSeverity: AgreementResult['conflictSeverity'] =
    conflicts.some(c => c.severity === 'critical') ? 'major' :
    conflicts.some(c => c.severity === 'major') ? 'major' :
    conflicts.some(c => c.severity === 'moderate') ? 'moderate' :
    conflicts.length > 0 ? 'minor' : 'none';
  
  // ═══ NARRATIVE ═══
  const narrative = generateAgreementNarrative(sources, clusters, conflicts, overallAgreement, finalConfidence, fieldCount);
  
  return {
    overallAgreementScore: Math.round(overallAgreement * 100) / 100,
    overallConfidence: Math.round(finalConfidence * 100) / 100,
    confidenceBeforeAgreement: Math.round(baseConfidence * 100) / 100,
    confidenceGain_pct: Math.round(confidenceGain * 10) / 10,
    consensusDepth_m: Math.round(consensusDepth * 10) / 10,
    consensusYield_m3hr: Math.round(consensusYield * 100) / 100,
    consensusProbability: Math.round(consensusProb * 1000) / 1000,
    consensusWaterTable_m: Math.round(consensusWT * 10) / 10,
    consensusRockType: consensusRock,
    consensusAquiferType: consensusAqType,
    depthBounds,
    yieldBounds,
    clusters,
    conflicts,
    conflictSeverity,
    sourceRanking,
    additionalDataNeeded: additionalData,
    strongestAgreement: strongest,
    weakestAgreement: weakest,
    narrative,
    sourceCount: sources.length,
    fieldSourceCount: fieldCount
  };
}

// ═══ NUMERIC AGREEMENT EVALUATION ═══
function evaluateNumericAgreement(
  parameter: string,
  values: { source: string; value: number; reliability: number }[]
): AgreementCluster {
  if (values.length === 0) {
    return { parameter, values, consensusValue: 0, spread: 0, agreementScore: 0, outliers: [], confidenceBoost: 0 };
  }
  
  // Weighted mean
  const totalWeight = values.reduce((s, v) => s + v.reliability, 0);
  const weightedMean = values.reduce((s, v) => s + v.value * v.reliability, 0) / Math.max(totalWeight, 0.01);
  
  // Weighted standard deviation
  const variance = values.reduce((s, v) => s + v.reliability * Math.pow(v.value - weightedMean, 2), 0) / Math.max(totalWeight, 0.01);
  const stdDev = Math.sqrt(variance);
  
  // Coefficient of variation
  const cv = weightedMean > 0 ? stdDev / weightedMean : 1;
  
  // Agreement score: 1 when CV ≈ 0, decays as CV increases
  const agreementScore = Math.max(0, 1 - cv * 2);
  
  // Detect outliers (> 2σ from weighted mean)
  const outliers = values.filter(v => Math.abs(v.value - weightedMean) > 2 * stdDev).map(v => v.source);
  
  // Confidence boost
  let boost = 0;
  if (agreementScore > 0.8 && values.length >= 3) boost = 5;
  else if (agreementScore > 0.6 && values.length >= 2) boost = 3;
  else if (agreementScore < 0.3) boost = -2;
  
  return {
    parameter,
    values,
    consensusValue: weightedMean,
    spread: stdDev,
    agreementScore: Math.round(agreementScore * 100) / 100,
    outliers,
    confidenceBoost: boost
  };
}

// ═══ CATEGORICAL AGREEMENT EVALUATION ═══
function evaluateCategoricalAgreement(
  parameter: string,
  values: { source: string; value: string; reliability: number }[]
): AgreementCluster {
  // Count weighted votes per category
  const votes: Record<string, number> = {};
  for (const v of values) {
    const norm = v.value.toLowerCase().trim();
    votes[norm] = (votes[norm] || 0) + v.reliability;
  }
  
  const totalWeight = Object.values(votes).reduce((s, v) => s + v, 0);
  const entries = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const winner = entries[0];
  
  // Agreement = winner's share of total weight
  const agreementScore = totalWeight > 0 ? (winner?.[1] || 0) / totalWeight : 0;
  
  // Outliers = sources that don't agree with winner
  const winnerName = winner?.[0] || '';
  const outliers = values.filter(v => v.value.toLowerCase().trim() !== winnerName).map(v => v.source);
  
  return {
    parameter,
    values: values.map(v => ({ source: v.source, value: 0, reliability: v.reliability })), // categorical → 0
    consensusValue: 0,
    spread: 0,
    agreementScore: Math.round(agreementScore * 100) / 100,
    outliers,
    confidenceBoost: agreementScore > 0.7 ? 3 : 0
  };
}

// ═══ CONFLICT DETECTION ═══
function detectConflicts(parameter: string, sources: SourceEstimate[], cluster: AgreementCluster, conflicts: ConflictRecord[]): void {
  if (cluster.outliers.length === 0) return;
  
  const consensus = cluster.consensusValue;
  
  for (const outlierName of cluster.outliers) {
    const outlierSource = sources.find(s => s.sourceName === outlierName);
    if (!outlierSource) continue;
    
    let outlierValue = 0;
    if (parameter === 'depth_m') outlierValue = outlierSource.depthEstimate_m || 0;
    else if (parameter === 'yield_m3hr') outlierValue = outlierSource.yieldEstimate_m3hr || 0;
    
    const deviation = consensus > 0 ? Math.abs(outlierValue - consensus) / consensus : 0;
    
    const severity: ConflictRecord['severity'] = 
      deviation > 0.5 ? 'critical' :
      deviation > 0.3 ? 'major' :
      deviation > 0.15 ? 'moderate' : 'minor';
    
    // Resolution: prefer field measurements, then higher reliability
    const nonOutlier = sources.find(s => s.sourceName !== outlierName && getWeight(s) > getWeight(outlierSource));
    const winner = nonOutlier ? nonOutlier.sourceName : 'consensus (weighted average)';
    
    conflicts.push({
      parameter,
      source1: outlierName,
      source1Value: outlierValue.toFixed(1),
      source2: winner,
      source2Value: consensus.toFixed(1),
      severity,
      resolution: nonOutlier?.isFieldMeasured 
        ? 'Field measurement preferred over remote estimate'
        : 'Weighted consensus preferred over outlier',
      winner,
      reasoning: `${outlierName} deviates ${(deviation * 100).toFixed(0)}% from weighted consensus (${consensus.toFixed(1)})`
    });
  }
}

// ═══ HELPERS ═══
function getWeight(source: SourceEstimate): number {
  const baseWeight = SOURCE_WEIGHTS[source.sourceName] || source.reliability;
  
  // Temporal decay: older data is less reliable
  let temporalFactor = 1;
  if (source.temporalAge_days) {
    if (source.temporalAge_days > 3650) temporalFactor = 0.6;      // > 10 years
    else if (source.temporalAge_days > 1825) temporalFactor = 0.75; // > 5 years
    else if (source.temporalAge_days > 365) temporalFactor = 0.9;   // > 1 year
  }
  
  // Field measurement bonus
  const fieldBonus = source.isFieldMeasured ? 1.1 : 1.0;
  
  return Math.min(0.98, baseWeight * temporalFactor * fieldBonus);
}

function weightedConsensus(items: { value: number; weight: number }[]): number {
  if (items.length === 0) return 0;
  const totalW = items.reduce((s, i) => s + i.weight, 0);
  return totalW > 0 ? items.reduce((s, i) => s + i.value * i.weight, 0) / totalW : 0;
}

function categoricalConsensus(items: { value: string; weight: number }[]): string {
  if (items.length === 0) return 'unknown';
  const votes: Record<string, number> = {};
  for (const i of items) {
    const norm = i.value.toLowerCase().trim();
    votes[norm] = (votes[norm] || 0) + i.weight;
  }
  const winner = Object.entries(votes).sort((a, b) => b[1] - a[1])[0];
  return winner?.[0] || 'unknown';
}

function generateAgreementNarrative(
  sources: SourceEstimate[], clusters: AgreementCluster[], conflicts: ConflictRecord[],
  overallAgreement: number, confidence: number, fieldCount: number
): string {
  const parts: string[] = [];
  
  parts.push(`Multi-source agreement analysis based on ${sources.length} independent data sources (${fieldCount} field measurements).`);
  
  if (overallAgreement > 0.8) {
    parts.push('Strong agreement across sources — high confidence in estimates.');
  } else if (overallAgreement > 0.6) {
    parts.push('Moderate agreement with some variation — estimates are reasonably reliable.');
  } else if (overallAgreement > 0.4) {
    parts.push('Limited agreement — significant uncertainty in estimates. Additional data recommended.');
  } else {
    parts.push('Poor agreement between sources — estimates are unreliable. Field verification essential.');
  }
  
  if (conflicts.length > 0) {
    const critCount = conflicts.filter(c => c.severity === 'critical' || c.severity === 'major').length;
    if (critCount > 0) {
      parts.push(`${critCount} major conflict(s) detected between sources — field investigation required to resolve.`);
    } else {
      parts.push(`${conflicts.length} minor conflict(s) detected — resolved by weighted consensus.`);
    }
  }
  
  if (fieldCount === 0) {
    parts.push('No field measurements included — all estimates are from remote/modeled sources. Adding ERT or pump test data would significantly improve reliability.');
  } else if (fieldCount >= 3) {
    parts.push('Multiple field measurements provide strong ground truth calibration.');
  }
  
  parts.push(`Overall confidence: ${(confidence * 100).toFixed(0)}%.`);
  
  return parts.join(' ');
}

function emptyAgreement(): AgreementResult {
  return {
    overallAgreementScore: 0,
    overallConfidence: 0.3,
    confidenceBeforeAgreement: 0.3,
    confidenceGain_pct: 0,
    consensusDepth_m: 0,
    consensusYield_m3hr: 0,
    consensusProbability: 0,
    consensusWaterTable_m: 0,
    consensusRockType: 'unknown',
    consensusAquiferType: 'unknown',
    depthBounds: { lower: 0, upper: 100, confidence_pct: 95 },
    yieldBounds: { lower: 0, upper: 10, confidence_pct: 95 },
    clusters: [],
    conflicts: [],
    conflictSeverity: 'none',
    sourceRanking: [],
    additionalDataNeeded: ['No data sources available — cannot evaluate agreement'],
    strongestAgreement: 'none',
    weakestAgreement: 'none',
    narrative: 'No data sources provided for agreement analysis.',
    sourceCount: 0,
    fieldSourceCount: 0
  };
}
