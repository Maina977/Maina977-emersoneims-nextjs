// ═══════════════════════════════════════════════════════════════
// pathTo97Engine.ts — "Path to 97%" Confidence Checklist
// ═══════════════════════════════════════════════════════════════
// Generates a prioritized, actionable checklist showing exactly
// what minimal field actions are needed to push confidence from
// current desktop level (55-72%) up to 97% bankable grade.
//
// Each action item includes:
//   - Current confidence contribution
//   - Potential confidence gain
//   - Cost estimate (USD)
//   - Time estimate (hours)
//   - Priority ranking
//   - Dependencies
// ═══════════════════════════════════════════════════════════════

import type { AnalysisResult } from './types';

export interface PathTo97Result {
  currentConfidence: number;       // Current % (0-100)
  targetConfidence: 97;            // Fixed target
  gap: number;                     // Points needed
  achievable: boolean;             // Can we reach 97 with all actions?
  maxAchievable: number;           // Max possible with all actions
  estimatedCostUSD: number;        // Total cost of remaining actions
  estimatedTimeDays: number;       // Total time
  estimatedCostToTarget: number;   // Cost to reach 97% specifically

  // Confidence breakdown by layer
  layerBreakdown: {
    layer: string;
    currentScore: number;          // 0-100
    maxScore: number;
    gap: number;
    actions: string[];
  }[];

  // Prioritized action checklist
  checklist: PathAction[];

  // Uncertainty zones — where confidence is lowest
  uncertaintyZones: {
    zone: string;
    confidence: number;
    reason: string;
    mitigation: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
  }[];

  // Progress milestones
  milestones: {
    confidence: number;
    label: string;
    grade: string;
    actionsNeeded: string[];
    estimatedCostUSD: number;
    useCases: string[];
  }[];

  methodology: string;
}

export interface PathAction {
  id: number;
  action: string;
  description: string;
  category: 'field_survey' | 'laboratory' | 'data_collection' | 'analysis' | 'validation';
  status: 'completed' | 'available' | 'recommended' | 'required' | 'not_applicable';
  currentContribution: number;     // What this already contributes (0-100 scale)
  potentialGain: number;           // Additional gain if completed
  costUSD: number;
  timeHours: number;
  priority: number;                // 1 = highest
  confidenceAfter: number;         // Expected confidence after this action
  dependencies: number[];          // IDs of prerequisite actions
  dataSource: string;
  standard: string;                // ISO/ASTM reference
  costPerConfidencePoint: number;  // Cost efficiency metric
}

export function computePathTo97(result: AnalysisResult): PathTo97Result {
  // ── Assess current data availability ──
  const hasERT = !!(result.ertInterpretation || (result as any).ertIntelligence);
  const hasPumpTest = !!(result.pumpTestAnalysis || result.fieldData?.pumpTest);
  const hasLabWater = !!(result.fieldData?.labWaterAnalysis);
  const hasLithology = !!(result.lithologyAnalysis || (result.fieldData as any)?.lithologyLog);
  const hasNearby = (result.nearbyWells?.sampleSize ?? 0) > 0;
  const hasSatellite = !!(result.remoteSensing || (result as any).satelliteWaterAnalysis);
  const hasGLDAS = !!(result.gldasGroundwater);
  const hasGRACE = !!(result.graceData);
  const hasDEM = !!(result.demHydrology);
  const hasSoilGrids = !!(result.remoteSensing?.soilGrids || (result as any).globalSoilAnalysis);
  const hasEnsemble = !!(result.ensembleResult);
  const hasInSAR = !!(result.insarDeformation);
  const hasFieldData = !!(result.fieldData);
  const hasAdvGeo = !!(result.advancedGeophysics || result.hybridGeophysics);
  const hasMODIS = !!((result as any).satelliteWaterAnalysis?.vegetation);
  const hasERA5 = !!((result as any).satelliteWaterAnalysis?.evapotranspiration);
  const hasWRB = !!((result as any).globalSoilAnalysis?.wrbClassification);
  const hasHydraulics = !!((result as any).globalSoilAnalysis?.hydraulicProperties);
  const hasSubsurface = !!(result.subsurfaceTwin || result.subsurfaceModel);
  const nearbyCount = result.nearbyWells?.sampleSize ?? 0;

  // ── Compute current confidence by layer ──
  // Data Layer (max 25)
  let dataScore = 0;
  if (hasSatellite) dataScore += 2;
  if (hasSoilGrids) dataScore += 2;
  if (hasDEM) dataScore += 1.5;
  if (hasGLDAS) dataScore += 2;
  if (hasGRACE) dataScore += 1.5;
  if (hasInSAR) dataScore += 1;
  if (hasMODIS) dataScore += 2;
  if (hasERA5) dataScore += 2;
  if (hasWRB) dataScore += 1.5;
  if (hasHydraulics) dataScore += 1.5;
  if (hasNearby) dataScore += Math.min(3, nearbyCount * 0.5);
  if (hasERT) dataScore += 4;
  if (hasPumpTest) dataScore += 4;
  if (hasLabWater) dataScore += 2;
  dataScore = Math.min(25, dataScore);

  // AI/ML Layer (max 25)
  let aiScore = 5; // Base: always have physics-informed analysis
  if (hasEnsemble) aiScore += 3;
  if (hasAdvGeo) aiScore += 3;
  if (hasSubsurface) aiScore += 2;
  if (hasSatellite && hasGLDAS && hasDEM) aiScore += 3; // Multi-source fusion
  if (hasNearby && nearbyCount >= 3) aiScore += 2;
  if (hasERT) aiScore += 4;
  if (hasPumpTest) aiScore += 3;
  aiScore = Math.min(25, aiScore);

  // Validation Layer (max 25)
  let validationScore = 2; // Base: self-consistency check
  if (nearbyCount >= 5) validationScore += 8;
  else if (nearbyCount >= 3) validationScore += 5;
  else if (nearbyCount >= 1) validationScore += 3;
  if (hasERT) validationScore += 5;
  if (hasPumpTest) validationScore += 5;
  if (hasLabWater) validationScore += 3;
  if (hasLithology) validationScore += 2;
  if (hasEnsemble && hasSatellite) validationScore += 2; // Cross-validation
  validationScore = Math.min(25, validationScore);

  // Transparency Layer (max 25) — always full when engine runs
  const transparencyScore = 25;

  const currentConfidence = Math.round(dataScore + aiScore + validationScore + transparencyScore);

  // ── Build action checklist ──
  const actions: PathAction[] = [];
  let runningConfidence = currentConfidence;
  let actionId = 1;

  // Helper to add action
  const addAction = (
    action: string, desc: string, category: PathAction['category'],
    status: PathAction['status'], current: number, gain: number,
    cost: number, hours: number, deps: number[], source: string, standard: string
  ) => {
    runningConfidence += gain;
    actions.push({
      id: actionId,
      action,
      description: desc,
      category,
      status,
      currentContribution: current,
      potentialGain: gain,
      costUSD: cost,
      timeHours: hours,
      priority: actionId,
      confidenceAfter: Math.min(100, runningConfidence),
      dependencies: deps,
      dataSource: source,
      standard,
      costPerConfidencePoint: gain > 0 ? Math.round(cost / gain) : Infinity,
    });
    actionId++;
  };

  // ── DATA LAYER ACTIONS ──
  addAction(
    'Satellite Remote Sensing Analysis',
    'MODIS NDVI/EVI, ERA5-Land soil moisture, GRACE-FO TWS, JRC water bodies, SRTM DEM, SoilGrids',
    'data_collection',
    hasSatellite && hasGLDAS && hasMODIS ? 'completed' : 'available',
    hasSatellite ? 8 : 0,
    hasSatellite && hasGLDAS && hasMODIS ? 0 : 8,
    0, 0.5, [],
    'ORNL DAAC, ERA5-Land, NASA POWER, ISRIC, JRC',
    'N/A — automated satellite analysis'
  );

  addAction(
    'Regional Borehole Database Query',
    'Search WPDx, USGS NWIS, BGS, national geological surveys for nearby wells with depth/yield/outcome data',
    'data_collection',
    hasNearby ? 'completed' : 'available',
    hasNearby ? Math.min(5, nearbyCount) : 0,
    hasNearby ? 0 : 5,
    0, 0.5, [],
    'WPDx+, USGS NWIS, BGS WFS, OSM Overpass',
    'N/A — database query'
  );

  addAction(
    'Electrical Resistivity Tomography (ERT) Survey',
    '2D resistivity imaging to map subsurface layers, water table, fracture zones. Wenner-Schlumberger array, 200m profile.',
    'field_survey',
    hasERT ? 'completed' : 'recommended',
    hasERT ? 12 : 0,
    hasERT ? 0 : 12,
    hasERT ? 0 : 2500, 8, [],
    'Field measurement — Wenner-Schlumberger array',
    'ASTM D6431 Standard Guide for ERT Surveys'
  );

  addAction(
    'Step-Drawdown Pump Test (4 hours)',
    '4-step drawdown test to determine well efficiency, specific capacity, sustainable yield, and aquifer parameters.',
    'field_survey',
    hasPumpTest ? 'completed' : 'recommended',
    hasPumpTest ? 10 : 0,
    hasPumpTest ? 0 : 10,
    hasPumpTest ? 0 : 3000, 6, [3],
    'Field measurement — pump test',
    'BS EN ISO 22282-4:2012 Pumping tests'
  );

  addAction(
    'Constant-Rate Pump Test (24-72 hours)',
    'Extended pumping test for transmissivity, storativity, boundary conditions. Cooper-Jacob + Theis analysis.',
    'field_survey',
    hasPumpTest ? 'completed' : 'required',
    hasPumpTest ? 8 : 0,
    hasPumpTest ? 0 : 8,
    hasPumpTest ? 0 : 5000, 72, [4],
    'Field measurement — constant rate test',
    'ASTM D4106 Standard Test Method — Cooper-Jacob'
  );

  addAction(
    'Laboratory Water Quality Analysis',
    'Full hydrochemical suite: pH, TDS, EC, major ions, Fe, Mn, F, As, NO₃, coliforms, turbidity. WHO/KEBS comparison.',
    'laboratory',
    hasLabWater ? 'completed' : 'required',
    hasLabWater ? 5 : 0,
    hasLabWater ? 0 : 5,
    hasLabWater ? 0 : 800, 120, [4],
    'ISO 5667 certified laboratory',
    'ISO 5667 Water Quality Sampling; WHO Guidelines for Drinking Water'
  );

  addAction(
    'Borehole Lithology Logging',
    'Record drill cuttings every 1m. Identify formations, weathering zones, aquifer contacts, fractures.',
    'field_survey',
    hasLithology ? 'completed' : 'required',
    hasLithology ? 4 : 0,
    hasLithology ? 0 : 4,
    hasLithology ? 0 : 500, 8, [3],
    'Drill cutting analysis + geologist log',
    'BS 5930 Code of Practice for Ground Investigation'
  );

  addAction(
    'Observation Well Monitoring (3+ wells)',
    'Install 3+ piezometers within 500m. Monitor water levels during pump test for storativity & boundary detection.',
    'field_survey',
    'recommended',
    0,
    nearbyCount >= 3 ? 3 : 6,
    4000, 48, [5],
    'Piezometer network',
    'ASTM D4750 Observation Well Installation'
  );

  addAction(
    'Geophysical Cross-Validation (TDEM or Seismic)',
    'Independent geophysical method to validate ERT interpretation. TDEM preferred for deep targets, seismic for rock interface.',
    'field_survey',
    'recommended',
    hasAdvGeo ? 3 : 0,
    hasAdvGeo ? 0 : 5,
    hasAdvGeo ? 0 : 3500, 8, [3],
    'Time-domain EM or seismic refraction',
    'ASTM D6820 TDEM / ASTM D5777 Seismic Refraction'
  );

  addAction(
    'Professional Hydrogeologist Review',
    'Registered hydrogeologist review, sign-off, and professional opinion letter. Required for regulatory submission.',
    'validation',
    'required',
    0, 4,
    2000, 16, [3, 5, 6],
    'Professional review',
    'National registration requirements; ISO 14688'
  );

  // ── Compute running totals ──
  const maxAchievable = Math.min(100, currentConfidence + actions.filter(a => a.status !== 'completed').reduce((s, a) => s + a.potentialGain, 0));
  const gap = Math.max(0, 97 - currentConfidence);
  const achievable = maxAchievable >= 97;

  // Cost to reach 97
  let costToTarget = 0;
  let confidenceAcc = currentConfidence;
  const sortedActions = [...actions]
    .filter(a => a.status !== 'completed' && a.potentialGain > 0)
    .sort((a, b) => a.costPerConfidencePoint - b.costPerConfidencePoint); // Best value first
  for (const a of sortedActions) {
    if (confidenceAcc >= 97) break;
    costToTarget += a.costUSD;
    confidenceAcc += a.potentialGain;
  }

  // ── Uncertainty zones ──
  const zones: PathTo97Result['uncertaintyZones'] = [];

  if (!hasERT) {
    zones.push({
      zone: 'Subsurface Structure',
      confidence: 35,
      reason: 'No direct subsurface imaging — layer boundaries and fracture zones are inferred from satellite data only',
      mitigation: 'ERT 2D survey (200m profile, Wenner-Schlumberger array) — $2,500, 1 day',
      priority: 'critical',
    });
  }
  if (!hasPumpTest) {
    zones.push({
      zone: 'Aquifer Parameters',
      confidence: 30,
      reason: 'Transmissivity, storativity, and sustainable yield are model-estimated, not field-measured',
      mitigation: 'Step-drawdown + 24hr constant-rate pump test — $8,000, 4 days',
      priority: 'critical',
    });
  }
  if (!hasLabWater) {
    zones.push({
      zone: 'Water Quality',
      confidence: 25,
      reason: 'No laboratory analysis — quality predictions based on geological inference only',
      mitigation: 'Laboratory hydrochemical suite (ISO 5667) — $800, 5 days',
      priority: 'high',
    });
  }
  if (nearbyCount < 3) {
    zones.push({
      zone: 'Spatial Calibration',
      confidence: nearbyCount > 0 ? 50 : 20,
      reason: nearbyCount > 0 ? `Only ${nearbyCount} nearby well(s) — insufficient for robust spatial calibration` : 'No nearby well data — predictions cannot be locally calibrated',
      mitigation: 'Extended database search + field reconnaissance of existing wells within 10km',
      priority: nearbyCount > 0 ? 'medium' : 'high',
    });
  }
  if (!hasLithology) {
    zones.push({
      zone: 'Geological Model',
      confidence: 40,
      reason: 'No drill cutting log — lithological column based on regional inference',
      mitigation: 'Record drill cuttings during borehole construction — $500, included in drilling',
      priority: 'medium',
    });
  }
  if (!hasSatellite) {
    zones.push({
      zone: 'Vegetation & Moisture',
      confidence: 30,
      reason: 'No satellite data — NDVI, soil moisture, and water bodies not analyzed',
      mitigation: 'Run automated satellite analysis (free, <1 minute)',
      priority: 'high',
    });
  }

  // ── Milestones ──
  const milestones: PathTo97Result['milestones'] = [
    {
      confidence: 35,
      label: 'Pre-Feasibility',
      grade: 'D',
      actionsNeeded: ['Satellite remote sensing', 'Regional borehole database'],
      estimatedCostUSD: 0,
      useCases: ['Initial site screening', 'Feasibility decision', 'Budget estimation'],
    },
    {
      confidence: 55,
      label: 'Preliminary Assessment',
      grade: 'C',
      actionsNeeded: ['Satellite analysis', 'Borehole database', 'GLDAS/GRACE analysis'],
      estimatedCostUSD: 0,
      useCases: ['Project planning', 'Comparative site ranking', 'Desktop feasibility report'],
    },
    {
      confidence: 72,
      label: 'Engineering Desktop',
      grade: 'B',
      actionsNeeded: ['+ ERT survey'],
      estimatedCostUSD: 2500,
      useCases: ['Drilling decision', 'Budget approval', 'Contractor procurement'],
    },
    {
      confidence: 85,
      label: 'Engineering Grade',
      grade: 'A',
      actionsNeeded: ['+ Pump test (step + constant)', '+ Lab water quality'],
      estimatedCostUSD: 11300,
      useCases: ['Financial institution lending', 'Government water authority approval', 'NGO project reporting'],
    },
    {
      confidence: 97,
      label: 'Bankable / Regulatory',
      grade: 'A+',
      actionsNeeded: ['+ Observation wells', '+ Geophysical cross-validation', '+ Professional sign-off'],
      estimatedCostUSD: 20800,
      useCases: ['Regulatory submission', 'Large-scale water supply design', 'Municipal water authority', 'International development bank financing'],
    },
  ];

  // Layer breakdown
  const layerBreakdown = [
    { layer: 'Data Layer (GRACE, Sentinel, GLDAS, DEM, Boreholes)', currentScore: Math.round(dataScore * 4), maxScore: 100, gap: Math.round((25 - dataScore) * 4), actions: dataScore < 25 ? ['ERT survey', 'Lab water quality', 'More nearby wells'] : ['All data sources active'] },
    { layer: 'AI/ML Layer (PINN, Bayesian, CNN, SHAP)', currentScore: Math.round(aiScore * 4), maxScore: 100, gap: Math.round((25 - aiScore) * 4), actions: aiScore < 25 ? ['ERT-calibrated inversion', 'Pump test parameters'] : ['All engines active'] },
    { layer: 'Validation Layer (Cross-validation, Ensemble, QC)', currentScore: Math.round(validationScore * 4), maxScore: 100, gap: Math.round((25 - validationScore) * 4), actions: validationScore < 25 ? ['Pump test', 'Observation wells', 'Lab analysis'] : ['Fully validated'] },
    { layer: 'Transparency Layer (Provenance, Methods, Limits)', currentScore: Math.round(transparencyScore * 4), maxScore: 100, gap: 0, actions: ['Full transparency maintained'] },
  ];

  return {
    currentConfidence,
    targetConfidence: 97,
    gap,
    achievable,
    maxAchievable: Math.min(100, maxAchievable),
    estimatedCostUSD: actions.filter(a => a.status !== 'completed').reduce((s, a) => s + a.costUSD, 0),
    estimatedTimeDays: Math.ceil(actions.filter(a => a.status !== 'completed').reduce((s, a) => s + a.timeHours, 0) / 8),
    estimatedCostToTarget: costToTarget,
    layerBreakdown,
    checklist: actions,
    uncertaintyZones: zones.sort((a, b) => {
      const p = { critical: 0, high: 1, medium: 2, low: 3 };
      return p[a.priority] - p[b.priority];
    }),
    milestones,
    methodology: 'Path to 97% computed by: (1) Auditing all available data sources and field measurements, ' +
      '(2) Computing per-layer confidence scores across 4 dimensions (Data, AI/ML, Validation, Transparency), ' +
      '(3) Identifying the most cost-effective field actions to close the confidence gap, ' +
      '(4) Ranking actions by cost-per-confidence-point for optimal budget allocation. ' +
      'Confidence targets: 35% Pre-Feasibility, 55% Desktop, 72% Engineering, 85% Bankable, 97% Regulatory.',
  };
}
