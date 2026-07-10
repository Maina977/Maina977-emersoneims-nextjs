/* ═══════════════════════════════════════════════════════════════════════
   RISK-BASED DECISION ENGINE
   Not just "Drill here" but probabilistic success/failure/risk breakdown
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface RiskDecisionInput {
  // Core predictions
  probability: number;
  predictedDepth_m: number;
  predictedYield_m3hr: number;
  confidence: number;

  // Geological context
  rockType?: string;
  aquiferType?: string;
  bedrockDepth_m?: number;
  weatheredZoneThickness_m?: number;
  fractureDensity?: number;

  // Environmental
  precipitation_mmYr?: number;
  rechargeRate_mmYr?: number;
  waterTableDepth_m?: number;
  waterTableTrend?: 'rising' | 'stable' | 'declining' | 'rapidly_declining';

  // Data quality
  dataSourceCount?: number;
  sourceAgreement?: number;    // 0-1
  hasFieldGeophysics?: boolean;
  hasPumpTest?: boolean;
  hasBoreholeDBRecords?: boolean;
  nearbyBoreholeSuccess?: number;  // regional success rate

  // Site conditions
  slopeDeg?: number;
  contaminationRiskLevel?: number;  // 0-1
  accessibilityScore?: number;      // 0-1 (1 = easy access)
  distanceToRoad_km?: number;

  // Financial
  estimatedCost_USD?: number;
  costPerMeter_USD?: number;
}

export interface RiskCategory {
  name: string;
  probability: number;     // 0-1
  impact: 'low' | 'moderate' | 'high' | 'critical';
  description: string;
  mitigation: string[];
  costImplication_USD?: number;
}

export interface DecisionRecommendation {
  action: 'DRILL' | 'SURVEY_FIRST' | 'RELOCATE' | 'ABANDON';
  confidence: number;
  headline: string;
  reasoning: string[];
}

export interface RiskDecisionResult {
  // Success / Failure breakdown
  successProbability: number;         // % chance of productive borehole
  lowYieldProbability: number;        // % chance of low but usable yield
  dryBoreholeProbability: number;     // % chance of dry hole
  poorQualityProbability: number;     // % chance of bad water quality
  collapseRiskProbability: number;    // % chance of borehole collapse

  // Risk categories
  risks: RiskCategory[];
  overallRiskLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  riskScore: number;                  // 0-100 (0 = no risk, 100 = extreme)

  // Decision
  recommendation: DecisionRecommendation;
  alternativeActions: DecisionRecommendation[];

  // Financial risk
  expectedValue_USD: number;          // E[V] = P(success) × value - cost
  worstCase_USD: number;
  bestCase_USD: number;
  roi: number;                        // expected return on investment
  paybackMonths: number;

  // Scenario analysis
  scenarios: {
    name: string;
    probability: number;
    depth_m: number;
    yield_m3hr: number;
    cost_USD: number;
    outcome: string;
  }[];

  // Data quality warning
  dataQualityWarning?: string;
  confidenceGrade: 'A' | 'B' | 'C' | 'D' | 'F';

  methodology: string;
}

/* ── Risk Calculation Functions ────────────────────────────── */

function calcDryBoreholeProbability(input: RiskDecisionInput): number {
  let baseDry = 1 - input.probability;

  // Adjustments
  if (input.waterTableTrend === 'rapidly_declining') baseDry *= 1.3;
  if (input.waterTableTrend === 'declining') baseDry *= 1.1;
  if (input.rockType?.toLowerCase().includes('granite') && !input.fractureDensity) baseDry *= 1.2;
  if (input.hasFieldGeophysics) baseDry *= 0.7; // geophysics reduces dry risk
  if (input.hasPumpTest) baseDry *= 0.3; // pump test = nearly eliminates dry risk
  if (input.nearbyBoreholeSuccess != null && input.nearbyBoreholeSuccess > 0.8) baseDry *= 0.8;

  return Math.max(0.01, Math.min(0.9, baseDry));
}

function calcLowYieldProbability(input: RiskDecisionInput): number {
  let baseRisk = 0.15; // 15% base

  if (input.predictedYield_m3hr < 0.5) baseRisk = 0.4;
  else if (input.predictedYield_m3hr < 1) baseRisk = 0.25;
  else if (input.predictedYield_m3hr > 5) baseRisk = 0.05;

  if (input.aquiferType === 'perched') baseRisk *= 2;
  if (input.aquiferType === 'fractured_rock') baseRisk *= 1.3;
  if (input.rechargeRate_mmYr != null && input.rechargeRate_mmYr < 50) baseRisk *= 1.5;
  if (input.waterTableTrend === 'declining') baseRisk *= 1.2;

  return Math.max(0.02, Math.min(0.6, baseRisk));
}

function calcPoorQualityProbability(input: RiskDecisionInput): number {
  let baseRisk = 0.1;

  if (input.contaminationRiskLevel != null && input.contaminationRiskLevel > 0.5) baseRisk = 0.3;
  if (input.aquiferType === 'unconfined') baseRisk *= 1.5; // more vulnerable
  if (input.aquiferType === 'confined') baseRisk *= 0.5; // protected
  if (input.aquiferType === 'karst') baseRisk *= 2; // very vulnerable

  // Geological water quality risks
  const rock = (input.rockType || '').toLowerCase();
  if (rock.includes('shale')) baseRisk += 0.1; // high fluoride risk
  if (rock.includes('basalt')) baseRisk += 0.08; // fluoride
  if (rock.includes('granite')) baseRisk += 0.05; // elevated minerals

  return Math.max(0.02, Math.min(0.5, baseRisk));
}

function calcCollapseRisk(input: RiskDecisionInput): number {
  let baseRisk = 0.03;

  const rock = (input.rockType || '').toLowerCase();
  if (rock.includes('laterite')) baseRisk = 0.08;
  if (rock.includes('alluvium')) baseRisk = 0.1;
  if (rock.includes('sandstone') && input.predictedDepth_m > 80) baseRisk = 0.07;
  if (input.weatheredZoneThickness_m && input.weatheredZoneThickness_m > 30) baseRisk += 0.05;

  return Math.max(0.01, Math.min(0.3, baseRisk));
}

/* ── Main Risk Assessment ─────────────────────────────────── */

export function assessDrillingRisk(input: RiskDecisionInput): RiskDecisionResult {
  // Calculate probabilities
  const dryProb = calcDryBoreholeProbability(input);
  const lowYieldProb = calcLowYieldProbability(input);
  const poorQualityProb = calcPoorQualityProbability(input);
  const collapseProb = calcCollapseRisk(input);

  // AUDIT FIX (2026-07-10): this engine used to RE-DERIVE a second success
  // probability (multiplying non-exclusive risk factors) that contradicted
  // the pipeline's fused probability in the same report (e.g. 55% here vs
  // 70% in the Executive Summary). The governing probability is the fused
  // input; the dry/low-yield/quality/collapse figures below are
  // NON-EXCLUSIVE conditional risk flags, not a probability partition.
  const successProb = Math.max(0.05, Math.min(0.98, input.probability));

  // Risk categories
  const risks: RiskCategory[] = [
    {
      name: 'Dry Borehole',
      probability: dryProb,
      impact: dryProb > 0.3 ? 'critical' : dryProb > 0.15 ? 'high' : 'moderate',
      description: `${(dryProb * 100).toFixed(0)}% chance of no water at predicted depth`,
      mitigation: [
        dryProb > 0.3 ? 'CRITICAL: Conduct ERT survey before drilling' : 'Consider geophysical survey',
        'Drill deeper into bedrock (fracture zone targeting)',
        'Have contingency budget for deepening',
      ],
      costImplication_USD: input.estimatedCost_USD,
    },
    {
      name: 'Low Yield',
      probability: lowYieldProb,
      impact: lowYieldProb > 0.3 ? 'high' : 'moderate',
      description: `${(lowYieldProb * 100).toFixed(0)}% chance of yield < 0.5 m³/hr (insufficient for community)`,
      mitigation: [
        'Target fracture intersections for higher yield',
        'Consider hydro-fracturing (borehole stimulation)',
        'Design for storage tank + intermittent pumping',
      ],
    },
    {
      name: 'Poor Water Quality',
      probability: poorQualityProb,
      impact: poorQualityProb > 0.25 ? 'high' : 'low',
      description: `${(poorQualityProb * 100).toFixed(0)}% chance of water requiring treatment`,
      mitigation: [
        'Budget for water quality testing post-drilling',
        'Include treatment system in project costs (iron removal, fluoride filter)',
        'Monitor seasonally for quality changes',
      ],
    },
    {
      name: 'Borehole Collapse',
      probability: collapseProb,
      impact: collapseProb > 0.1 ? 'critical' : 'low',
      description: `${(collapseProb * 100).toFixed(0)}% chance of borehole wall collapse during/after drilling`,
      mitigation: [
        'Use appropriate casing through unstable zones',
        'Consider gravel packing in sandy formations',
        'Monitor for sand production during development',
      ],
    },
    {
      name: 'Financial Overrun',
      probability: Math.min(0.4, dryProb * 0.5 + 0.1 * (input.predictedDepth_m > 100 ? 1 : 0)),
      impact: 'moderate',
      description: 'Risk of costs exceeding budget due to deeper drilling or complications',
      mitigation: [
        'Include 20-30% contingency in budget',
        'Agree on cost caps with driller',
        'Stage drilling: pilot hole first, then ream',
      ],
    },
  ];

  // Overall risk score
  const riskScore = Math.round(
    dryProb * 35 +          // dry borehole is biggest risk
    lowYieldProb * 25 +
    poorQualityProb * 15 +
    collapseProb * 15 +
    (1 - (input.confidence || 0.5)) * 10
  );

  const overallRiskLevel: RiskDecisionResult['overallRiskLevel'] =
    riskScore < 15 ? 'very_low'
    : riskScore < 30 ? 'low'
    : riskScore < 50 ? 'moderate'
    : riskScore < 70 ? 'high'
    : 'very_high';

  // Decision recommendation
  const recommendation = makeDecision(successProb, riskScore, input);
  const alternativeActions = makeAlternatives(recommendation.action, riskScore, input);

  // Financial analysis
  // Default aligned with computeCanonicalEconomics 'unknown' rate (Kenya July 2026)
  const cost = input.estimatedCost_USD ?? input.predictedDepth_m * (input.costPerMeter_USD ?? 75);
  const waterValue = input.predictedYield_m3hr * 24 * 365 * 0.5; // $0.50/m³ community water
  const expectedValue = successProb * waterValue - cost;
  const worstCase = -cost;
  const bestCase = waterValue * 1.5 - cost;
  const roi = cost > 0 ? expectedValue / cost : 0;
  const paybackMonths = waterValue > 0 ? Math.round(cost / (waterValue / 12)) : 999;

  // Scenarios
  const scenarios = [
    {
      name: 'Best Case',
      probability: successProb * 0.3,
      depth_m: input.predictedDepth_m * 0.8,
      yield_m3hr: input.predictedYield_m3hr * 1.5,
      cost_USD: cost * 0.85,
      outcome: 'High-yield productive borehole',
    },
    {
      name: 'Expected Case',
      probability: successProb * 0.5,
      depth_m: input.predictedDepth_m,
      yield_m3hr: input.predictedYield_m3hr,
      cost_USD: cost,
      outcome: 'Normal productive borehole',
    },
    {
      name: 'Low Yield',
      probability: lowYieldProb,
      depth_m: input.predictedDepth_m * 1.1,
      yield_m3hr: input.predictedYield_m3hr * 0.3,
      cost_USD: cost * 1.1,
      outcome: 'Low yield — needs storage system',
    },
    {
      name: 'Dry Hole',
      probability: dryProb,
      depth_m: input.predictedDepth_m * 1.2,
      yield_m3hr: 0,
      cost_USD: cost * 0.7, // less cost if abandoned early
      outcome: 'No water — complete loss',
    },
  ];

  // Data quality warning
  let dataQualityWarning: string | undefined;
  if (!input.hasFieldGeophysics && !input.hasPumpTest && !input.hasBoreholeDBRecords) {
    dataQualityWarning = 'WARNING: This assessment is based entirely on desktop data (satellite, terrain, remote sensing). No field geophysical data available. Recommend ERT survey before drilling to reduce risk by 15-25%.';
  }

  // Confidence grade
  const confScore = (input.confidence || 0.5) * 40 + (input.dataSourceCount ?? 3) * 5 + (input.hasFieldGeophysics ? 15 : 0) + (input.hasPumpTest ? 15 : 0) + (input.sourceAgreement ?? 0.5) * 10;
  const confidenceGrade: RiskDecisionResult['confidenceGrade'] =
    confScore >= 80 ? 'A' : confScore >= 65 ? 'B' : confScore >= 50 ? 'C' : confScore >= 35 ? 'D' : 'F';

  return {
    successProbability: Math.round(successProb * 1000) / 10,
    lowYieldProbability: Math.round(lowYieldProb * 1000) / 10,
    dryBoreholeProbability: Math.round(dryProb * 1000) / 10,
    poorQualityProbability: Math.round(poorQualityProb * 1000) / 10,
    collapseRiskProbability: Math.round(collapseProb * 1000) / 10,
    risks,
    overallRiskLevel,
    riskScore,
    recommendation,
    alternativeActions,
    expectedValue_USD: Math.round(expectedValue),
    worstCase_USD: Math.round(worstCase),
    bestCase_USD: Math.round(bestCase),
    roi: Math.round(roi * 100) / 100,
    paybackMonths,
    scenarios,
    dataQualityWarning,
    confidenceGrade,
    methodology: 'Multi-factor probabilistic risk model with Bayesian prior adjustment from regional data (ISO 31000 framework)',
  };
}

/* ── Decision Logic ───────────────────────────────────────── */

function makeDecision(successProb: number, riskScore: number, input: RiskDecisionInput): DecisionRecommendation {
  if (successProb > 0.75 && riskScore < 30) {
    return {
      action: 'DRILL',
      confidence: Math.min(0.95, successProb),
      headline: `${(successProb * 100).toFixed(0)}% success probability — PROCEED with drilling`,
      reasoning: [
        `High success probability (${(successProb * 100).toFixed(0)}%)`,
        `Low overall risk score (${riskScore}/100)`,
        input.hasFieldGeophysics ? 'Supported by field geophysics data' : 'Consider adding ERT for higher confidence',
        `Expected depth: ${input.predictedDepth_m}m, Expected yield: ${input.predictedYield_m3hr.toFixed(1)} m³/hr`,
      ],
    };
  }

  if (successProb > 0.5 && riskScore < 50) {
    return {
      action: 'SURVEY_FIRST',
      confidence: successProb * 0.8,
      headline: `${(successProb * 100).toFixed(0)}% probability — RECOMMEND geophysical survey before drilling`,
      reasoning: [
        `Moderate success probability (${(successProb * 100).toFixed(0)}%)`,
        `Moderate risk (${riskScore}/100) — additional data will reduce uncertainty`,
        'ERT survey recommended to confirm aquifer location and depth',
        'Survey cost (~$500-2000) justified by reduced drilling failure risk',
      ],
    };
  }

  if (successProb > 0.3) {
    return {
      action: 'RELOCATE',
      confidence: 0.6,
      headline: `${(successProb * 100).toFixed(0)}% probability — CONSIDER alternative site`,
      reasoning: [
        `Low success probability at this location (${(successProb * 100).toFixed(0)}%)`,
        `High risk score (${riskScore}/100)`,
        'Look for fracture intersections, valley positions, or nearby successful boreholes',
        'If must drill here: mandatory ERT + seismic survey first',
      ],
    };
  }

  return {
    action: 'ABANDON',
    confidence: 0.7,
    headline: `${(successProb * 100).toFixed(0)}% probability — NOT RECOMMENDED for drilling`,
    reasoning: [
      `Very low success probability (${(successProb * 100).toFixed(0)}%)`,
      `Very high risk (${riskScore}/100)`,
      'Multiple risk factors indicate this site is unsuitable',
      'Recommend comprehensive regional survey to identify better locations',
    ],
  };
}

function makeAlternatives(primaryAction: DecisionRecommendation['action'], riskScore: number, input: RiskDecisionInput): DecisionRecommendation[] {
  const alts: DecisionRecommendation[] = [];

  if (primaryAction !== 'DRILL') {
    alts.push({
      action: 'SURVEY_FIRST',
      confidence: 0.7,
      headline: 'Conduct geophysical survey before drilling decision',
      reasoning: [
        'ERT: $500-1500 — maps water-bearing zones',
        'Seismic: $1000-3000 — confirms bedrock depth',
        'Survey will reduce uncertainty by 15-25%',
      ],
    });
  }

  if (primaryAction !== 'RELOCATE') {
    alts.push({
      action: 'RELOCATE',
      confidence: 0.5,
      headline: 'Evaluate alternative drilling point within 500m',
      reasoning: [
        'Target fracture intersections or valley positions',
        'Use probabilistic drilling map to find optimal point',
        'Even 100m shift can significantly change success probability',
      ],
    });
  }

  return alts;
}
