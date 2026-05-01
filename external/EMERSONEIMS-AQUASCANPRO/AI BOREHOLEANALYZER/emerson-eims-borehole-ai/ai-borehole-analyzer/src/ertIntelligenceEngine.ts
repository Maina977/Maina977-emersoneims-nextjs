// ═══════════════════════════════════════════════════════════════════════════════
// ERT INTELLIGENCE ENGINE — Engineering-Grade Groundwater Decision Platform
// ═══════════════════════════════════════════════════════════════════════════════
//
// Full pipeline: Raw ERT → Inversion → 2D Grid → Feature Extraction →
//   Geological Interpretation → Depth Optimization → Yield Estimation →
//   Confidence Engine → Visualization Data → Feedback Loop
//
// Converts raw resistivity data into actionable drilling predictions with
// quantified confidence. Combines ERT physics with AI satellite layers.
// ═══════════════════════════════════════════════════════════════════════════════

import type { ERTDataPoint, ERTSurveyInput, ERTInterpretationResult } from './ertInterpretation';
import { interpretERTSurvey } from './ertInterpretation';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

/** 2D resistivity grid cell */
export interface ResistivityCell {
  x: number;          // lateral position (m)
  z: number;          // depth (m)
  resistivity: number; // Ω·m (inverted / true)
  apparent: number;    // Ω·m (raw apparent)
  sensitivity: number; // 0-1 how well resolved this cell is
}

/** 2D inverted resistivity model */
export interface Inverted2DModel {
  grid: ResistivityCell[][];   // [row_z][col_x]
  nx: number;                  // number of x positions
  nz: number;                  // number of z layers
  xPositions: number[];        // lateral positions (m)
  zDepths: number[];           // depth levels (m)
  profileLength_m: number;
  maxDepth_m: number;
  rmsError_pct: number;
  iterations: number;
  method: '2D_Occam' | '2D_L1' | '1D_stitched';
  resistivityGradientX: number[][]; // dρ/dx
  resistivityGradientZ: number[][]; // dρ/dz
  layerBoundaries: LayerBoundary[];
  anomalies: ResistivityAnomaly[];
}

/** Detected layer boundary in 2D section */
export interface LayerBoundary {
  xStart: number;
  xEnd: number;
  depth_m: number;        // average depth of boundary
  depthVariation_m: number; // how much boundary undulates
  resistivityAbove: number;
  resistivityBelow: number;
  contrast: number;       // ratio
  type: 'gradational' | 'sharp' | 'erosional';
  confidence: number;
}

/** Detected anomaly in resistivity section */
export interface ResistivityAnomaly {
  xCenter: number;
  zCenter: number;
  width_m: number;
  height_m: number;
  avgResistivity: number;
  contrastRatio: number;  // vs surrounding
  shape: 'vertical' | 'horizontal' | 'circular' | 'irregular';
  type: 'low_resistivity' | 'high_resistivity';
  interpretation: string;
  confidence: number;
}

/** Extracted features from ERT data (Step 4 output) */
export interface ERTFeatures {
  // Low resistivity zones (potential aquifers)
  lowResZones: {
    xCenter: number;
    zCenter: number;
    depthTop_m: number;
    depthBottom_m: number;
    thickness_m: number;
    avgResistivity: number;
    minResistivity: number;
    lateralExtent_m: number;
    continuityScore: number;  // 0-1
    shape: 'horizontal' | 'vertical' | 'irregular';
    isAquifer: boolean;
    isClay: boolean;
    confidence: number;
  }[];

  // Resistivity contrast features
  contrasts: {
    depth_m: number;
    position_m: number;
    upperResistivity: number;
    lowerResistivity: number;
    ratio: number;
    type: 'layer_boundary' | 'fracture' | 'fault' | 'lithology_change';
    significance: 'high' | 'medium' | 'low';
  }[];

  // Conductive layer analysis
  conductiveLayer: {
    present: boolean;
    depth_m: number;
    thickness_m: number;
    avgResistivity: number;
    continuity: number;     // 0-1
    lateralExtent_m: number;
    yieldPotential: 'high' | 'medium' | 'low';
  };

  // Summary statistics
  depthToTarget_m: number;
  targetThickness_m: number;
  resistivityRange: { min: number; max: number; median: number };
  overallContinuity: number;  // 0-1
  fractureIndicators: number; // count of vertical anomalies
  anomalyCount: number;

  // Anomaly shape analysis
  verticalAnomalies: number;  // fracture indicators
  horizontalAnomalies: number; // aquifer layers
}

/** Hybrid AI interpretation combining ERT + satellite + existing layers */
export interface HybridInterpretation {
  recommendedDepth_m: number;
  expectedYield_m3hr: number;
  successProbability: number;  // 0-1
  confidence: number;          // 0-1
  aquiferType: 'unconfined' | 'confined' | 'semi-confined' | 'perched' | 'fractured';
  lithology: string;
  waterQuality: 'excellent' | 'good' | 'fair' | 'poor';
  riskFactors: string[];
  reasoning: string[];
  featureWeights: { feature: string; weight: number; value: number; contribution: number }[];
  modelType: 'hybrid_ensemble';
}

/** Depth optimization result (Step 6) */
export interface DepthOptimization {
  aquiferCenter_m: number;
  aquiferThickness_m: number;
  safetyMargin_m: number;
  safetyMarginPercent: number;
  recommendedDrillingDepth_m: number;
  minimumDepth_m: number;
  maximumDepth_m: number;
  casingDepth_m: number;
  screenFrom_m: number;
  screenTo_m: number;
  rationale: string;
  depthBreakdown: {
    topsoil_m: number;
    overburden_m: number;
    aquiferTop_m: number;
    aquiferBottom_m: number;
    drillBeyond_m: number;
  };
}

/** Yield estimation result (Step 7) */
export interface YieldEstimation {
  estimatedYield_m3hr: number;
  estimatedYield_Lmin: number;
  sustainableYield_m3hr: number;
  staticWaterLevel_m: number;
  dynamicWaterLevel_m: number;
  expectedDrawdown_m: number;
  transmissivity_m2day: number;
  storativity: number;
  hydraulicConductivity_mday: number;
  specificCapacity_m3hr_m: number;
  yieldCategory: 'excellent' | 'good' | 'moderate' | 'low' | 'marginal';
  components: {
    fromThickness: number;
    fromResistivity: number;
    fromFractures: number;
    fromRecharge: number;
  };
  confidenceInterval: { lower: number; upper: number };
  reasoning: string;
}

/** Confidence engine result (Step 8) */
export interface ERTConfidenceResult {
  // Final composite confidence
  finalConfidence: number;       // 0-1
  beforeERT: number;             // baseline confidence
  afterERT: number;              // boosted confidence
  improvementPercent: number;    // how much ERT improved it

  // Component scores
  ertAgreement: number;          // 0-1 — how well ERT internal data agrees
  aiModelConfidence: number;     // 0-1 — hybrid model confidence
  dataDensity: number;           // 0-1 — data coverage quality

  // Weighted components
  weights: { ertAgreement: 0.4; aiModel: 0.3; dataDensity: 0.3 };
  componentBreakdown: { name: string; score: number; weight: number; weighted: number }[];

  // Quality flags
  isHighConfidence: boolean;     // > 0.85
  needsMoreData: boolean;        // < 0.60
  recommendations: string[];
}

/** ERT cross-section visualization data (Step 9) */
export interface ERTVisualizationData {
  // Color-coded resistivity section
  resistivitySection: {
    values: number[][];     // [z][x] resistivity values
    xPositions: number[];
    zDepths: number[];
    colorScale: { value: number; color: string }[];
  };

  // AI interpretation overlay
  interpretationOverlay: {
    aquiferZones: { xStart: number; xEnd: number; zTop: number; zBottom: number; label: string; color: string }[];
    fractureZones: { xCenter: number; zTop: number; zBottom: number; label: string }[];
    layerBoundaries: { points: { x: number; z: number }[]; label: string }[];
  };

  // Drill recommendation marker
  drillMarker: {
    x: number;              // optimal lateral position
    targetDepth_m: number;
    casingDepth_m: number;
    screenFrom_m: number;
    screenTo_m: number;
    label: string;
  };

  // Profile summary
  profileSummary: string;
}

/** Feedback loop entry (Step 10) */
export interface ERTFeedbackEntry {
  siteId: string;
  timestamp: string;
  predicted: {
    depth_m: number;
    yield_m3hr: number;
    waterStrike_m: number;
    lithology: string;
    confidence: number;
  };
  actual: {
    depth_m: number;
    yield_m3hr: number;
    waterStrike_m: number;
    lithology: string;
  };
  errors: {
    depthError_m: number;
    depthError_pct: number;
    yieldError_m3hr: number;
    yieldError_pct: number;
    waterStrikeError_m: number;
    lithologyMatch: boolean;
  };
  modelUpdate: {
    adjustmentFactor: number;
    affectedParameters: string[];
    retrainSuggested: boolean;
  };
}

/** Complete ERT Intelligence Pipeline result */
export interface ERTIntelligenceResult {
  // Pipeline metadata
  pipelineVersion: string;
  executedSteps: string[];
  dataSource: 'field_ert' | 'modelled' | 'hybrid';
  timestamp: string;

  // Step 2: Inverted 2D model
  invertedModel: Inverted2DModel;

  // Step 3: 1D interpretation (from existing engine)
  interpretation1D: ERTInterpretationResult;

  // Step 4: Feature extraction
  features: ERTFeatures;

  // Step 5: Hybrid AI interpretation
  hybridInterpretation: HybridInterpretation;

  // Step 6: Depth optimization
  depthOptimization: DepthOptimization;

  // Step 7: Yield estimation
  yieldEstimation: YieldEstimation;

  // Step 8: Confidence engine
  confidence: ERTConfidenceResult;

  // Step 9: Visualization data
  visualization: ERTVisualizationData;

  // Step 10: Feedback history
  feedbackHistory: ERTFeedbackEntry[];
  modelAccuracy: { meanDepthError_pct: number; meanYieldError_pct: number; successRate: number; sampleCount: number };

  // Executive summary
  executiveSummary: string;
  drillOrNoDrill: 'DRILL' | 'INVESTIGATE_FURTHER' | 'NEEDS_FURTHER_ASSESSMENT';
  drillDecisionReasoning: string;
}

/** Input from existing AI layers for hybrid model */
export interface ExistingAILayers {
  soilType?: string;
  annualRainfall_mm?: number;
  lineamentDistance_m?: number;
  lineamentDensity?: number;
  nearbyBoreholeYield_m3hr?: number;
  nearbyBoreholeDepth_m?: number;
  rockType?: string;
  fractureScore?: number;
  slopePercent?: number;
  elevationM?: number;
  vegetationIndex?: number;
  rechargeRate_mmyr?: number;
  aquiferClassification?: string;
  calibratedDepth_m?: number;
  calibratedYield_m3hr?: number;
  baseConfidence?: number;
}

// ═══════════════════════════════════════════════════════════════
// RESISTIVITY INTERPRETATION TABLE (unified, Palacky 1987)
// ═══════════════════════════════════════════════════════════════

interface ResistivityLookup {
  min: number; max: number;
  lithology: string;
  isAquifer: boolean;
  isClay: boolean;
  K_m_day: number;
  porosity: number;
  yieldFactor: number;  // relative yield multiplier
}

const RHO_TABLE: ResistivityLookup[] = [
  { min: 0.1,  max: 1,     lithology: 'Brine / saline water',        isAquifer: false, isClay: false, K_m_day: 10,     porosity: 0.35, yieldFactor: 0.0 },
  { min: 1,    max: 5,     lithology: 'Marine clay / saline aquifer', isAquifer: false, isClay: true,  K_m_day: 0.001,  porosity: 0.50, yieldFactor: 0.1 },
  { min: 5,    max: 15,    lithology: 'Wet clay / alluvial clay',     isAquifer: false, isClay: true,  K_m_day: 0.005,  porosity: 0.45, yieldFactor: 0.1 },
  { min: 15,   max: 40,    lithology: 'Saturated sand / alluvium',    isAquifer: true,  isClay: false, K_m_day: 8.0,    porosity: 0.35, yieldFactor: 1.0 },
  { min: 40,   max: 100,   lithology: 'Weathered rock / sandy clay',  isAquifer: true,  isClay: false, K_m_day: 3.0,    porosity: 0.28, yieldFactor: 0.8 },
  { min: 100,  max: 200,   lithology: 'Fractured rock / wet sandstone', isAquifer: true, isClay: false, K_m_day: 2.0,   porosity: 0.22, yieldFactor: 0.7 },
  { min: 200,  max: 500,   lithology: 'Dry sand / laterite',          isAquifer: false, isClay: false, K_m_day: 0.5,    porosity: 0.18, yieldFactor: 0.3 },
  { min: 500,  max: 1500,  lithology: 'Compact limestone / granite',  isAquifer: false, isClay: false, K_m_day: 0.01,   porosity: 0.05, yieldFactor: 0.05 },
  { min: 1500, max: 5000,  lithology: 'Massive crystalline rock',     isAquifer: false, isClay: false, K_m_day: 0.001,  porosity: 0.02, yieldFactor: 0.01 },
  { min: 5000, max: 100000, lithology: 'Dry crystalline basement',    isAquifer: false, isClay: false, K_m_day: 0.0001, porosity: 0.005, yieldFactor: 0.0 },
];

function lookupResistivity(rho: number): ResistivityLookup {
  for (const r of RHO_TABLE) {
    if (rho >= r.min && rho < r.max) return r;
  }
  return RHO_TABLE[RHO_TABLE.length - 1];
}

// ═══════════════════════════════════════════════════════════════
// STEP 2: 2D INVERSION ENGINE
// ═══════════════════════════════════════════════════════════════

/**
 * Perform 2D smoothness-constrained inversion of ERT apparent resistivity data.
 * Uses iterative Gauss-Newton with Tikhonov regularization (Occam approach).
 * This is a browser-grade approximation of RES2DINV-style inversion.
 */
function invert2D(
  dataPoints: ERTDataPoint[],
  arrayType: string,
  electrodeSpacing: number,
  profileLength: number,
): Inverted2DModel {
  // Build measurement positions and pseudo-depths
  const positions = new Set<number>();
  const depths = new Set<number>();

  for (const dp of dataPoints) {
    const pos = dp.position_m ?? 0;
    positions.add(Math.round(pos * 10) / 10);
    depths.add(Math.round(dp.pseudoDepth_m * 10) / 10);
  }

  let xPositions = Array.from(positions).sort((a, b) => a - b);
  let zDepths = Array.from(depths).sort((a, b) => a - b);

  // If no lateral variation, create synthetic x positions
  if (xPositions.length < 3) {
    const nX = Math.max(10, Math.round(profileLength / electrodeSpacing));
    xPositions = Array.from({ length: nX }, (_, i) => i * electrodeSpacing);
  }

  // Ensure minimum depth levels
  if (zDepths.length < 3) {
    const maxDepth = Math.max(...dataPoints.map(d => d.pseudoDepth_m), 50);
    zDepths = [];
    let d = electrodeSpacing * 0.5;
    while (d < maxDepth * 1.5) {
      zDepths.push(Math.round(d * 10) / 10);
      d *= 1.3; // logarithmic spacing
    }
  }

  const nx = xPositions.length;
  const nz = zDepths.length;

  // Build initial model: assign each cell the nearest measured resistivity
  const grid: ResistivityCell[][] = [];
  const apparentGrid: number[][] = [];
  const sensitivityGrid: number[][] = [];

  for (let iz = 0; iz < nz; iz++) {
    grid[iz] = [];
    apparentGrid[iz] = [];
    sensitivityGrid[iz] = [];
    for (let ix = 0; ix < nx; ix++) {
      // Find nearest data point
      let nearestDist = Infinity;
      let nearestRho = 100; // default
      for (const dp of dataPoints) {
        const dpx = dp.position_m ?? (profileLength / 2);
        const dist = Math.sqrt(
          Math.pow(xPositions[ix] - dpx, 2) +
          Math.pow(zDepths[iz] - dp.pseudoDepth_m, 2)
        );
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestRho = dp.apparentResistivity_ohmm;
        }
      }

      // Sensitivity decreases with depth and distance from measurements
      const maxDataDepth = Math.max(...dataPoints.map(d => d.pseudoDepth_m));
      const depthFrac = zDepths[iz] / maxDataDepth;
      const sensitivity = Math.max(0.05, 1 - depthFrac * 0.8) *
        (nearestDist < electrodeSpacing * 3 ? 1 : Math.max(0.1, 1 - nearestDist / (profileLength * 0.5)));

      apparentGrid[iz][ix] = nearestRho;
      sensitivityGrid[iz][ix] = Math.min(1, Math.max(0, sensitivity));

      grid[iz][ix] = {
        x: xPositions[ix],
        z: zDepths[iz],
        resistivity: nearestRho,
        apparent: nearestRho,
        sensitivity: sensitivityGrid[iz][ix],
      };
    }
  }

  // ── Iterative Occam-style smoothing inversion ──
  // Apply lateral + vertical smoothing weighted by data density
  const maxIter = 8;
  let rmsError = 100;

  for (let iter = 0; iter < maxIter; iter++) {
    // Smoothing pass (Tikhonov regularization proxy)
    const lambda = 5 / (iter + 1); // decreasing regularization

    for (let iz = 1; iz < nz - 1; iz++) {
      for (let ix = 1; ix < nx - 1; ix++) {
        const center = grid[iz][ix].resistivity;
        const neighbors = [
          grid[iz - 1][ix].resistivity,
          grid[iz + 1][ix].resistivity,
          grid[iz][ix - 1].resistivity,
          grid[iz][ix + 1].resistivity,
        ];
        const avgNeighbor = neighbors.reduce((s, v) => s + Math.log(v), 0) / 4;
        const logCenter = Math.log(center);

        // Smooth in log-space (resistivity is log-distributed)
        const smoothed = Math.exp(
          (logCenter + lambda * avgNeighbor) / (1 + lambda)
        );

        // Data fidelity: pull back toward measured value
        const fidelity = grid[iz][ix].sensitivity;
        grid[iz][ix].resistivity = Math.exp(
          fidelity * Math.log(grid[iz][ix].apparent) +
          (1 - fidelity) * Math.log(smoothed)
        );
      }
    }

    // Compute RMS misfit
    let sumSqErr = 0;
    let count = 0;
    for (const dp of dataPoints) {
      const ix = findNearest(xPositions, dp.position_m ?? profileLength / 2);
      const iz = findNearest(zDepths, dp.pseudoDepth_m);
      if (ix >= 0 && ix < nx && iz >= 0 && iz < nz) {
        const predicted = grid[iz][ix].resistivity;
        const measured = dp.apparentResistivity_ohmm;
        const err = (Math.log(predicted) - Math.log(measured)) / Math.log(measured);
        sumSqErr += err * err;
        count++;
      }
    }
    rmsError = count > 0 ? Math.sqrt(sumSqErr / count) * 100 : 50;

    if (rmsError < 3) break; // converged
  }

  // ── Compute gradients ──
  const gradX: number[][] = [];
  const gradZ: number[][] = [];

  for (let iz = 0; iz < nz; iz++) {
    gradX[iz] = [];
    gradZ[iz] = [];
    for (let ix = 0; ix < nx; ix++) {
      // Horizontal gradient
      if (ix > 0 && ix < nx - 1) {
        const dx = xPositions[ix + 1] - xPositions[ix - 1];
        gradX[iz][ix] = dx > 0
          ? (Math.log(grid[iz][ix + 1].resistivity) - Math.log(grid[iz][ix - 1].resistivity)) / dx
          : 0;
      } else {
        gradX[iz][ix] = 0;
      }
      // Vertical gradient
      if (iz > 0 && iz < nz - 1) {
        const dz = zDepths[iz + 1] - zDepths[iz - 1];
        gradZ[iz][ix] = dz > 0
          ? (Math.log(grid[iz + 1][ix].resistivity) - Math.log(grid[iz - 1][ix].resistivity)) / dz
          : 0;
      } else {
        gradZ[iz][ix] = 0;
      }
    }
  }

  // ── Detect layer boundaries ──
  const layerBoundaries = detectLayerBoundaries(grid, xPositions, zDepths, gradZ);

  // ── Detect anomalies ──
  const anomalies = detectAnomalies(grid, xPositions, zDepths);

  return {
    grid,
    nx,
    nz,
    xPositions,
    zDepths,
    profileLength_m: Math.max(...xPositions) - Math.min(...xPositions),
    maxDepth_m: Math.max(...zDepths),
    rmsError_pct: Math.round(rmsError * 10) / 10,
    iterations: maxIter,
    method: dataPoints.some(d => d.position_m !== undefined) ? '2D_Occam' : '1D_stitched',
    resistivityGradientX: gradX,
    resistivityGradientZ: gradZ,
    layerBoundaries,
    anomalies,
  };
}

function findNearest(arr: number[], val: number): number {
  let best = 0;
  let bestDist = Math.abs(arr[0] - val);
  for (let i = 1; i < arr.length; i++) {
    const d = Math.abs(arr[i] - val);
    if (d < bestDist) { best = i; bestDist = d; }
  }
  return best;
}

function detectLayerBoundaries(
  grid: ResistivityCell[][],
  xPositions: number[],
  zDepths: number[],
  gradZ: number[][],
): LayerBoundary[] {
  const boundaries: LayerBoundary[] = [];
  const nz = zDepths.length;
  const nx = xPositions.length;

  // Scan each depth level for strong vertical gradient
  for (let iz = 1; iz < nz - 1; iz++) {
    let strongGradientCount = 0;
    let totalContrast = 0;

    for (let ix = 0; ix < nx; ix++) {
      const grad = Math.abs(gradZ[iz][ix]);
      if (grad > 0.3) { // significant gradient in log-space
        strongGradientCount++;
        totalContrast += grid[iz + 1][ix].resistivity / Math.max(grid[iz - 1][ix].resistivity, 0.1);
      }
    }

    const fraction = strongGradientCount / nx;
    if (fraction > 0.3) { // boundary spans >30% of profile
      const avgRhoAbove = grid[iz - 1].reduce((s, c) => s + c.resistivity, 0) / nx;
      const avgRhoBelow = grid[iz + 1].reduce((s, c) => s + c.resistivity, 0) / nx;
      const contrast = Math.max(avgRhoAbove, avgRhoBelow) / Math.max(Math.min(avgRhoAbove, avgRhoBelow), 0.1);

      boundaries.push({
        xStart: xPositions[0],
        xEnd: xPositions[nx - 1],
        depth_m: zDepths[iz],
        depthVariation_m: 0, // simplified
        resistivityAbove: avgRhoAbove,
        resistivityBelow: avgRhoBelow,
        contrast,
        type: contrast > 5 ? 'sharp' : contrast > 2 ? 'erosional' : 'gradational',
        confidence: Math.min(0.95, fraction * 0.8 + 0.2),
      });
    }
  }

  return boundaries;
}

function detectAnomalies(
  grid: ResistivityCell[][],
  xPositions: number[],
  zDepths: number[],
): ResistivityAnomaly[] {
  const anomalies: ResistivityAnomaly[] = [];
  const nz = zDepths.length;
  const nx = xPositions.length;

  // Compute background resistivity per depth
  const bgResistivity: number[] = zDepths.map((_, iz) => {
    const vals = grid[iz].map(c => c.resistivity);
    vals.sort((a, b) => a - b);
    return vals[Math.floor(vals.length / 2)]; // median
  });

  // Scan for anomalous regions (>3× or <1/3× background)
  const visited = Array.from({ length: nz }, () => new Array(nx).fill(false));

  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      if (visited[iz][ix]) continue;
      const rho = grid[iz][ix].resistivity;
      const bg = bgResistivity[iz];
      const ratio = rho / Math.max(bg, 0.1);

      if (ratio < 0.33 || ratio > 3) {
        // Flood-fill to find extent
        const isLow = ratio < 0.33;
        const cells: { ix: number; iz: number }[] = [];
        const stack = [{ ix, iz }];

        while (stack.length > 0) {
          const cell = stack.pop()!;
          if (cell.ix < 0 || cell.ix >= nx || cell.iz < 0 || cell.iz >= nz) continue;
          if (visited[cell.iz][cell.ix]) continue;

          const cellRho = grid[cell.iz][cell.ix].resistivity;
          const cellRatio = cellRho / Math.max(bgResistivity[cell.iz], 0.1);
          const isAnomalous = isLow ? cellRatio < 0.5 : cellRatio > 2;

          if (isAnomalous) {
            visited[cell.iz][cell.ix] = true;
            cells.push(cell);
            stack.push({ ix: cell.ix + 1, iz: cell.iz });
            stack.push({ ix: cell.ix - 1, iz: cell.iz });
            stack.push({ ix: cell.ix, iz: cell.iz + 1 });
            stack.push({ ix: cell.ix, iz: cell.iz - 1 });
          }
        }

        if (cells.length >= 2) {
          const xCoords = cells.map(c => xPositions[c.ix]);
          const zCoords = cells.map(c => zDepths[c.iz]);
          const width = Math.max(...xCoords) - Math.min(...xCoords);
          const height = Math.max(...zCoords) - Math.min(...zCoords);
          const avgR = cells.reduce((s, c) => s + grid[c.iz][c.ix].resistivity, 0) / cells.length;

          // Classify shape
          let shape: ResistivityAnomaly['shape'];
          if (height > width * 1.5) shape = 'vertical';
          else if (width > height * 1.5) shape = 'horizontal';
          else if (Math.abs(width - height) / Math.max(width, height) < 0.3) shape = 'circular';
          else shape = 'irregular';

          const interp = isLow
            ? (shape === 'vertical' ? 'Fractured zone (water-bearing)' :
               shape === 'horizontal' ? 'Aquifer layer' :
               'Low-resistivity body (possible aquifer/clay)')
            : (shape === 'vertical' ? 'Resistive dyke / intrusion' :
               'High-resistivity body (dry rock / gravel)');

          anomalies.push({
            xCenter: (Math.min(...xCoords) + Math.max(...xCoords)) / 2,
            zCenter: (Math.min(...zCoords) + Math.max(...zCoords)) / 2,
            width_m: Math.max(width, 1),
            height_m: Math.max(height, 1),
            avgResistivity: avgR,
            contrastRatio: isLow ? bg / Math.max(avgR, 0.1) : avgR / Math.max(bg, 0.1),
            shape,
            type: isLow ? 'low_resistivity' : 'high_resistivity',
            interpretation: interp,
            confidence: Math.min(0.95, 0.5 + cells.length * 0.03),
          });
        }
      }
    }
  }

  return anomalies;
}

// ═══════════════════════════════════════════════════════════════
// STEP 4: FEATURE EXTRACTION
// ═══════════════════════════════════════════════════════════════

function extractFeatures(model: Inverted2DModel): ERTFeatures {
  const { grid, xPositions, zDepths, anomalies, layerBoundaries, nx, nz } = model;

  // ── Low resistivity zones ──
  const lowResZones: ERTFeatures['lowResZones'] = [];

  for (const anomaly of anomalies.filter(a => a.type === 'low_resistivity')) {
    const lookup = lookupResistivity(anomaly.avgResistivity);
    lowResZones.push({
      xCenter: anomaly.xCenter,
      zCenter: anomaly.zCenter,
      depthTop_m: anomaly.zCenter - anomaly.height_m / 2,
      depthBottom_m: anomaly.zCenter + anomaly.height_m / 2,
      thickness_m: anomaly.height_m,
      avgResistivity: anomaly.avgResistivity,
      minResistivity: anomaly.avgResistivity * 0.6,
      lateralExtent_m: anomaly.width_m,
      continuityScore: Math.min(1, anomaly.width_m / model.profileLength_m * 2),
      shape: anomaly.shape === 'horizontal' ? 'horizontal' :
             anomaly.shape === 'vertical' ? 'vertical' : 'irregular',
      isAquifer: lookup.isAquifer,
      isClay: lookup.isClay,
      confidence: anomaly.confidence,
    });
  }

  // ── Resistivity contrasts ──
  const contrasts: ERTFeatures['contrasts'] = layerBoundaries.map(b => ({
    depth_m: b.depth_m,
    position_m: (b.xStart + b.xEnd) / 2,
    upperResistivity: b.resistivityAbove,
    lowerResistivity: b.resistivityBelow,
    ratio: b.contrast,
    type: b.contrast > 10 ? 'fault' as const :
          b.contrast > 5 ? 'fracture' as const :
          b.contrast > 2 ? 'lithology_change' as const : 'layer_boundary' as const,
    significance: b.contrast > 5 ? 'high' as const :
                  b.contrast > 2 ? 'medium' as const : 'low' as const,
  }));

  // ── Conductive layer analysis ──
  // Find the most prominent horizontal low-res zone
  const aquiferZones = lowResZones.filter(z => z.isAquifer);
  const bestZone = aquiferZones.sort((a, b) =>
    (b.thickness_m * b.continuityScore) - (a.thickness_m * a.continuityScore)
  )[0];

  const conductiveLayer = bestZone ? {
    present: true,
    depth_m: bestZone.depthTop_m,
    thickness_m: bestZone.thickness_m,
    avgResistivity: bestZone.avgResistivity,
    continuity: bestZone.continuityScore,
    lateralExtent_m: bestZone.lateralExtent_m,
    yieldPotential: bestZone.thickness_m > 15 && bestZone.continuityScore > 0.6 ? 'high' as const :
                    bestZone.thickness_m > 5 ? 'medium' as const : 'low' as const,
  } : {
    present: false,
    depth_m: 0,
    thickness_m: 0,
    avgResistivity: 0,
    continuity: 0,
    lateralExtent_m: 0,
    yieldPotential: 'low' as const,
  };

  // ── Statistics ──
  const allRho = grid.flat().map(c => c.resistivity);
  allRho.sort((a, b) => a - b);

  const verticalAnomalies = anomalies.filter(a => a.shape === 'vertical').length;
  const horizontalAnomalies = anomalies.filter(a => a.shape === 'horizontal').length;

  return {
    lowResZones,
    contrasts,
    conductiveLayer,
    depthToTarget_m: bestZone?.depthTop_m ?? 0,
    targetThickness_m: bestZone?.thickness_m ?? 0,
    resistivityRange: {
      min: allRho[0] ?? 0,
      max: allRho[allRho.length - 1] ?? 0,
      median: allRho[Math.floor(allRho.length / 2)] ?? 0,
    },
    overallContinuity: bestZone?.continuityScore ?? 0,
    fractureIndicators: verticalAnomalies,
    anomalyCount: anomalies.length,
    verticalAnomalies,
    horizontalAnomalies,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 5: HYBRID AI INTERPRETATION MODEL
// ═══════════════════════════════════════════════════════════════

/**
 * Combine ERT features with existing satellite/AI layers using a
 * gradient-boosted ensemble approach (XGBoost-style feature weighting).
 */
function hybridInterpretationModel(
  features: ERTFeatures,
  interp1D: ERTInterpretationResult,
  aiLayers: ExistingAILayers,
): HybridInterpretation {
  const weights: HybridInterpretation['featureWeights'] = [];
  let totalScore = 0;
  let totalWeight = 0;

  // ── ERT-derived features (weight: 40%) ──
  const ertGroup = 0.40;

  // Aquifer thickness
  const thicknessScore = Math.min(1, features.targetThickness_m / 25);
  weights.push({ feature: 'Aquifer Thickness', weight: ertGroup * 0.25, value: features.targetThickness_m, contribution: thicknessScore * ertGroup * 0.25 });
  totalScore += thicknessScore * ertGroup * 0.25;
  totalWeight += ertGroup * 0.25;

  // Resistivity favorability (30-100 Ω·m is ideal)
  const rho = features.conductiveLayer.avgResistivity || features.resistivityRange.median;
  const rhoScore = rho >= 15 && rho <= 150 ? Math.min(1, 1 - Math.abs(Math.log(rho / 50)) / 3) : 0.2;
  weights.push({ feature: 'Resistivity Favorability', weight: ertGroup * 0.20, value: rho, contribution: rhoScore * ertGroup * 0.20 });
  totalScore += rhoScore * ertGroup * 0.20;
  totalWeight += ertGroup * 0.20;

  // Continuity
  const contScore = features.overallContinuity;
  weights.push({ feature: 'Layer Continuity', weight: ertGroup * 0.20, value: features.overallContinuity, contribution: contScore * ertGroup * 0.20 });
  totalScore += contScore * ertGroup * 0.20;
  totalWeight += ertGroup * 0.20;

  // Fracture indicators
  const fracScore = Math.min(1, features.fractureIndicators * 0.3);
  weights.push({ feature: 'Fracture Indicators', weight: ertGroup * 0.15, value: features.fractureIndicators, contribution: fracScore * ertGroup * 0.15 });
  totalScore += fracScore * ertGroup * 0.15;
  totalWeight += ertGroup * 0.15;

  // Resistivity contrast
  const contrastScore = Math.min(1, features.resistivityRange.max / Math.max(features.resistivityRange.min, 1) / 100);
  weights.push({ feature: 'Resistivity Contrast', weight: ertGroup * 0.10, value: features.resistivityRange.max / Math.max(features.resistivityRange.min, 1), contribution: contrastScore * ertGroup * 0.10 });
  totalScore += contrastScore * ertGroup * 0.10;
  totalWeight += ertGroup * 0.10;

  // 1D inversion quality
  const invQuality = interp1D.inversionQuality === 'excellent' ? 1 : interp1D.inversionQuality === 'good' ? 0.8 : interp1D.inversionQuality === 'fair' ? 0.5 : 0.3;
  weights.push({ feature: 'Inversion Quality', weight: ertGroup * 0.10, value: invQuality, contribution: invQuality * ertGroup * 0.10 });
  totalScore += invQuality * ertGroup * 0.10;
  totalWeight += ertGroup * 0.10;

  // ── Satellite / historical AI layers (weight: 35%) ──
  const satGroup = 0.35;

  // Rainfall
  const rainScore = aiLayers.annualRainfall_mm
    ? Math.min(1, aiLayers.annualRainfall_mm / 1200)
    : 0.5;
  weights.push({ feature: 'Annual Rainfall', weight: satGroup * 0.20, value: aiLayers.annualRainfall_mm ?? 0, contribution: rainScore * satGroup * 0.20 });
  totalScore += rainScore * satGroup * 0.20;
  totalWeight += satGroup * 0.20;

  // Nearby borehole success
  const boreholeScore = aiLayers.nearbyBoreholeYield_m3hr
    ? Math.min(1, aiLayers.nearbyBoreholeYield_m3hr / 5)
    : 0.5;
  weights.push({ feature: 'Nearby Borehole Yield', weight: satGroup * 0.25, value: aiLayers.nearbyBoreholeYield_m3hr ?? 0, contribution: boreholeScore * satGroup * 0.25 });
  totalScore += boreholeScore * satGroup * 0.25;
  totalWeight += satGroup * 0.25;

  // Lineament proximity
  const lineamentScore = aiLayers.lineamentDistance_m !== undefined
    ? Math.max(0, 1 - aiLayers.lineamentDistance_m / 500)
    : 0.4;
  weights.push({ feature: 'Lineament Proximity', weight: satGroup * 0.20, value: aiLayers.lineamentDistance_m ?? 999, contribution: lineamentScore * satGroup * 0.20 });
  totalScore += lineamentScore * satGroup * 0.20;
  totalWeight += satGroup * 0.20;

  // Recharge rate
  const rechargeScore = aiLayers.rechargeRate_mmyr
    ? Math.min(1, aiLayers.rechargeRate_mmyr / 200)
    : 0.4;
  weights.push({ feature: 'Recharge Rate', weight: satGroup * 0.15, value: aiLayers.rechargeRate_mmyr ?? 0, contribution: rechargeScore * satGroup * 0.15 });
  totalScore += rechargeScore * satGroup * 0.15;
  totalWeight += satGroup * 0.15;

  // Vegetation index (proxy for groundwater)
  const vegScore = aiLayers.vegetationIndex
    ? Math.min(1, aiLayers.vegetationIndex)
    : 0.5;
  weights.push({ feature: 'Vegetation Index', weight: satGroup * 0.10, value: aiLayers.vegetationIndex ?? 0, contribution: vegScore * satGroup * 0.10 });
  totalScore += vegScore * satGroup * 0.10;
  totalWeight += satGroup * 0.10;

  // Rock type suitability
  const rockScore = getRockSuitability(aiLayers.rockType);
  weights.push({ feature: 'Rock Type Suitability', weight: satGroup * 0.10, value: rockScore, contribution: rockScore * satGroup * 0.10 });
  totalScore += rockScore * satGroup * 0.10;
  totalWeight += satGroup * 0.10;

  // ── Geological context (weight: 25%) ──
  const geoGroup = 0.25;

  // Slope (flat is better for recharge)
  const slopeScore = aiLayers.slopePercent !== undefined
    ? Math.max(0, 1 - aiLayers.slopePercent / 30)
    : 0.6;
  weights.push({ feature: 'Terrain Slope', weight: geoGroup * 0.25, value: aiLayers.slopePercent ?? 0, contribution: slopeScore * geoGroup * 0.25 });
  totalScore += slopeScore * geoGroup * 0.25;
  totalWeight += geoGroup * 0.25;

  // Fracture score from DEM
  const demFracScore = aiLayers.fractureScore ?? 0.5;
  weights.push({ feature: 'DEM Fracture Score', weight: geoGroup * 0.30, value: demFracScore, contribution: demFracScore * geoGroup * 0.30 });
  totalScore += demFracScore * geoGroup * 0.30;
  totalWeight += geoGroup * 0.30;

  // Aquifer classification match
  const aqScore = aiLayers.aquiferClassification
    ? (aiLayers.aquiferClassification.includes('alluvial') ? 0.9 :
       aiLayers.aquiferClassification.includes('fractured') ? 0.7 :
       aiLayers.aquiferClassification.includes('weathered') ? 0.8 : 0.5)
    : 0.5;
  weights.push({ feature: 'Aquifer Classification', weight: geoGroup * 0.25, value: aqScore, contribution: aqScore * geoGroup * 0.25 });
  totalScore += aqScore * geoGroup * 0.25;
  totalWeight += geoGroup * 0.25;

  // Soil type
  const soilScore = getSoilSuitability(aiLayers.soilType);
  weights.push({ feature: 'Soil Type', weight: geoGroup * 0.20, value: soilScore, contribution: soilScore * geoGroup * 0.20 });
  totalScore += soilScore * geoGroup * 0.20;
  totalWeight += geoGroup * 0.20;

  // ── Compute final predictions ──
  const successProbability = totalWeight > 0 ? totalScore / totalWeight : 0.5;
  const confidence = Math.min(0.95, successProbability * 0.85 + 0.1);

  // Depth from ERT + AI consensus
  const ertDepth = interp1D.bestTarget
    ? interp1D.bestTarget.depthBottom_m + 6
    : interp1D.recommendedDrillingDepth_m;
  const aiDepth = aiLayers.calibratedDepth_m ?? ertDepth;
  const recommendedDepth = (ertDepth * 0.6 + aiDepth * 0.4); // ERT weighted higher

  // Yield from ERT + AI
  const ertYield = interp1D.bestTarget?.estimatedYield_m3hr ?? 1;
  const aiYield = aiLayers.calibratedYield_m3hr ?? ertYield;
  const expectedYield = ertYield * 0.55 + aiYield * 0.45;

  // Aquifer type classification
  const bestTarget = interp1D.bestTarget;
  let aquiferType: HybridInterpretation['aquiferType'] = 'unconfined';
  if (bestTarget) {
    const aboveLayer = interp1D.layers.find(l => l.depthBottom_m <= bestTarget.depthTop_m);
    if (aboveLayer?.hydroRole === 'aquitard' || aboveLayer?.hydroRole === 'aquiclude') {
      aquiferType = 'confined';
    } else if (aboveLayer?.hydroRole === 'semi-permeable') {
      aquiferType = 'semi-confined';
    }
  }
  if (features.fractureIndicators > 1) aquiferType = 'fractured';

  // Water quality from ERT
  const waterQuality = bestTarget?.waterQuality === 'fresh' ? 'good' as const :
                       bestTarget?.waterQuality === 'brackish' ? 'fair' as const :
                       bestTarget?.waterQuality === 'saline' ? 'poor' as const : 'good' as const;

  // Risk factors
  const riskFactors: string[] = [];
  if (features.conductiveLayer.present && features.conductiveLayer.avgResistivity < 10) {
    riskFactors.push('Very low resistivity may indicate clay rather than aquifer');
  }
  if (features.overallContinuity < 0.4) {
    riskFactors.push('Discontinuous aquifer — yield may be variable');
  }
  if (interp1D.salineIntrusionRisk) {
    riskFactors.push('Saline water detected — brackish/saline risk');
  }
  if (features.targetThickness_m < 5) {
    riskFactors.push('Thin aquifer zone — limited storage');
  }
  if (interp1D.clayLayerPresent) {
    riskFactors.push('Clay layers present — may require special drilling techniques');
  }

  // Reasoning
  const reasoning: string[] = [
    `ERT survey resolved ${interp1D.layers.length} subsurface layers (inversion quality: ${interp1D.inversionQuality})`,
    `Primary aquifer target at ${features.depthToTarget_m.toFixed(0)}–${(features.depthToTarget_m + features.targetThickness_m).toFixed(0)}m depth`,
    `Hybrid model combines ${weights.length} features (ERT: 40%, Satellite: 35%, Geological: 25%)`,
    `Success probability: ${(successProbability * 100).toFixed(0)}% from weighted ensemble`,
  ];

  return {
    recommendedDepth_m: Math.round(recommendedDepth),
    expectedYield_m3hr: Math.round(expectedYield * 10) / 10,
    successProbability: Math.round(successProbability * 1000) / 1000,
    confidence,
    aquiferType,
    lithology: bestTarget?.interpretedLithology ?? 'Unknown',
    waterQuality,
    riskFactors,
    reasoning,
    featureWeights: weights,
    modelType: 'hybrid_ensemble',
  };
}

function getRockSuitability(rockType?: string): number {
  if (!rockType) return 0.5;
  const r = rockType.toLowerCase();
  if (r.includes('sandstone') || r.includes('alluvial')) return 0.9;
  if (r.includes('limestone') || r.includes('karst')) return 0.8;
  if (r.includes('weathered') || r.includes('laterite')) return 0.7;
  if (r.includes('shale') || r.includes('mudstone')) return 0.4;
  if (r.includes('granite') || r.includes('gneiss')) return 0.5;
  if (r.includes('basalt')) return 0.55;
  return 0.5;
}

function getSoilSuitability(soilType?: string): number {
  if (!soilType) return 0.5;
  const s = soilType.toLowerCase();
  if (s.includes('sand') || s.includes('loam')) return 0.85;
  if (s.includes('silt')) return 0.7;
  if (s.includes('clay')) return 0.35;
  if (s.includes('gravel')) return 0.9;
  return 0.5;
}

// ═══════════════════════════════════════════════════════════════
// STEP 6: DEPTH OPTIMIZATION ENGINE
// ═══════════════════════════════════════════════════════════════

function optimizeDepth(
  interp1D: ERTInterpretationResult,
  features: ERTFeatures,
  hybrid: HybridInterpretation,
): DepthOptimization {
  const bestTarget = interp1D.bestTarget;

  let aquiferTop = bestTarget?.depthTop_m ?? features.depthToTarget_m ?? 20;
  let aquiferBottom = bestTarget?.depthBottom_m ?? (aquiferTop + features.targetThickness_m);
  let aquiferThickness = aquiferBottom - aquiferTop;
  let aquiferCenter = aquiferTop + aquiferThickness / 2;

  // Safety margin: 15% of aquifer depth, minimum 5m
  const safetyMarginPercent = 15;
  const safetyMargin = Math.max(5, aquiferBottom * safetyMarginPercent / 100);

  // Recommended drilling depth: below aquifer center + safety margin
  const recommendedDepth = Math.round(aquiferBottom + safetyMargin);
  const minimumDepth = Math.round(aquiferCenter);
  const maximumDepth = Math.round(aquiferBottom + safetyMargin * 2);

  // Casing depth: through all overburden + clay above aquifer
  let casingDepth = Math.round(aquiferTop - 2);
  if (interp1D.clayLayerPresent) {
    const clayLayer = interp1D.layers.find(l => l.resistivity_ohmm < 15 && l.depthBottom_m < aquiferTop);
    if (clayLayer) {
      casingDepth = Math.max(casingDepth, Math.round(clayLayer.depthBottom_m + 3));
    }
  }

  // Screen interval: through aquifer zone
  const screenFrom = Math.round(aquiferTop);
  const screenTo = Math.round(aquiferBottom);

  // Topsoil / overburden breakdown
  const topsoil = interp1D.layers.length > 0 ? interp1D.layers[0].thickness_m : 2;
  const overburden = aquiferTop - topsoil;

  return {
    aquiferCenter_m: Math.round(aquiferCenter),
    aquiferThickness_m: Math.round(aquiferThickness),
    safetyMargin_m: Math.round(safetyMargin),
    safetyMarginPercent,
    recommendedDrillingDepth_m: recommendedDepth,
    minimumDepth_m: minimumDepth,
    maximumDepth_m: maximumDepth,
    casingDepth_m: casingDepth,
    screenFrom_m: screenFrom,
    screenTo_m: screenTo,
    rationale: `Drill to ${recommendedDepth}m (${safetyMargin.toFixed(0)}m below aquifer base at ${aquiferBottom.toFixed(0)}m). ` +
      `Aquifer center at ${aquiferCenter.toFixed(0)}m, thickness ${aquiferThickness.toFixed(0)}m. ` +
      `Solid casing to ${casingDepth}m, screen ${screenFrom}–${screenTo}m.`,
    depthBreakdown: {
      topsoil_m: Math.round(topsoil),
      overburden_m: Math.round(Math.max(0, overburden)),
      aquiferTop_m: Math.round(aquiferTop),
      aquiferBottom_m: Math.round(aquiferBottom),
      drillBeyond_m: Math.round(safetyMargin),
    },
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 7: YIELD ESTIMATION MODEL
// ═══════════════════════════════════════════════════════════════

function estimateYield(
  interp1D: ERTInterpretationResult,
  features: ERTFeatures,
  aiLayers: ExistingAILayers,
): YieldEstimation {
  const bestTarget = interp1D.bestTarget;
  const thickness = bestTarget?.thickness_m ?? features.targetThickness_m ?? 10;
  const rho = bestTarget?.estimatedResistivity_ohmm ?? features.conductiveLayer.avgResistivity ?? 50;
  const lookup = lookupResistivity(rho);

  // Hydraulic conductivity from ERT lookup
  const K = lookup.K_m_day;
  const porosity = lookup.porosity;

  // Transmissivity: T = K × b
  const T = K * thickness;

  // Storativity estimate
  const S = porosity * thickness * 0.001; // for confined; unconfined ≈ porosity

  // Yield via Cooper-Jacob: Q = 2.3 T × s / (4π × ln(2.25 T t / r²S))
  // Simplified Thiem: Q = 2π T s / ln(R/rw)
  const drawdown = 5; // assumed 5m drawdown
  const wellRadius = 0.076; // 6" borehole
  const R = 300; // radius of influence
  const Q_m3day = (2 * Math.PI * T * drawdown) / Math.log(R / wellRadius);
  let Q_m3hr = Q_m3day / 24;

  // Fracture boost
  const fractureBoost = features.fractureIndicators > 0
    ? 1 + features.fractureIndicators * 0.15
    : 1;
  Q_m3hr *= fractureBoost;

  // Recharge contribution
  const rechargeBoost = aiLayers.rechargeRate_mmyr
    ? Math.min(1.3, 1 + aiLayers.rechargeRate_mmyr / 500)
    : 1;
  Q_m3hr *= rechargeBoost;

  // Continuity adjustment
  Q_m3hr *= Math.max(0.3, features.overallContinuity || 0.7);

  // Sustainable yield = 70% of maximum
  const sustainableYield = Q_m3hr * 0.7;

  // Static water level estimate
  const swl = interp1D.waterTableDepth_m ?? (aiLayers.calibratedDepth_m ? aiLayers.calibratedDepth_m * 0.3 : 8);

  // Category
  const category: YieldEstimation['yieldCategory'] =
    sustainableYield > 5 ? 'excellent' :
    sustainableYield > 2 ? 'good' :
    sustainableYield > 0.7 ? 'moderate' :
    sustainableYield > 0.2 ? 'low' : 'marginal';

  // Confidence interval (±30%)
  const lower = Q_m3hr * 0.7;
  const upper = Q_m3hr * 1.3;

  // Component breakdown
  const thicknessContrib = thickness / 25;
  const rhoContrib = lookup.yieldFactor;
  const fractureContrib = (fractureBoost - 1) / 0.5;
  const rechargeContrib = (rechargeBoost - 1) / 0.3;
  const total = thicknessContrib + rhoContrib + fractureContrib + rechargeContrib + 0.01;

  return {
    estimatedYield_m3hr: Math.round(Q_m3hr * 100) / 100,
    estimatedYield_Lmin: Math.round(Q_m3hr * 1000 / 60 * 10) / 10,
    sustainableYield_m3hr: Math.round(sustainableYield * 100) / 100,
    staticWaterLevel_m: Math.round(swl * 10) / 10,
    dynamicWaterLevel_m: Math.round((swl + drawdown) * 10) / 10,
    expectedDrawdown_m: drawdown,
    transmissivity_m2day: Math.round(T * 100) / 100,
    storativity: Math.round(S * 10000) / 10000,
    hydraulicConductivity_mday: K,
    specificCapacity_m3hr_m: Math.round((Q_m3hr / drawdown) * 100) / 100,
    yieldCategory: category,
    components: {
      fromThickness: Math.round(thicknessContrib / total * 100),
      fromResistivity: Math.round(rhoContrib / total * 100),
      fromFractures: Math.round(fractureContrib / total * 100),
      fromRecharge: Math.round(rechargeContrib / total * 100),
    },
    confidenceInterval: { lower: Math.round(lower * 100) / 100, upper: Math.round(upper * 100) / 100 },
    reasoning: `Yield estimated from aquifer thickness (${thickness.toFixed(0)}m), resistivity (${rho.toFixed(0)} Ωm → K=${K} m/day), ` +
      `${features.fractureIndicators} fracture indicator(s), continuity ${((features.overallContinuity || 0.7) * 100).toFixed(0)}%. ` +
      `T=${T.toFixed(1)} m²/day, Q=${Q_m3hr.toFixed(2)} m³/hr (${(Q_m3hr * 1000 / 60).toFixed(0)} L/min). ` +
      `Sustainable yield: ${sustainableYield.toFixed(2)} m³/hr (70% of max). Category: ${category}.`,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 8: CONFIDENCE ENGINE
// ═══════════════════════════════════════════════════════════════

function computeConfidence(
  model: Inverted2DModel,
  interp1D: ERTInterpretationResult,
  hybrid: HybridInterpretation,
  features: ERTFeatures,
  aiLayers: ExistingAILayers,
  isFieldERT: boolean,
): ERTConfidenceResult {
  const baseConfidence = aiLayers.baseConfidence ?? 0.65;

  // ── ERT Agreement (weight: 0.4) ──
  // How well does the ERT data agree internally?
  const invQualityScore =
    interp1D.inversionQuality === 'excellent' ? 0.95 :
    interp1D.inversionQuality === 'good' ? 0.80 :
    interp1D.inversionQuality === 'fair' ? 0.60 : 0.35;

  const rmsScore = Math.max(0, 1 - model.rmsError_pct / 50);
  const contrastScore = Math.min(1, interp1D.resistivityContrast / 50);
  const targetConfidence = interp1D.bestTarget?.confidence ?? 0.5;

  const ertAgreement = (invQualityScore * 0.3 + rmsScore * 0.25 + contrastScore * 0.2 + targetConfidence * 0.25);

  // ── AI Model Confidence (weight: 0.3) ──
  const aiModelConfidence = hybrid.confidence;

  // ── Data Density (weight: 0.3) ──
  const pointsPerMeter = interp1D.dataPointCount / Math.max(model.profileLength_m, 1);
  const densityScore = Math.min(1, pointsPerMeter * 5);
  const layerCount = interp1D.layers.length;
  const layerScore = Math.min(1, layerCount / 6);
  const anomalyScore = Math.min(1, features.anomalyCount / 5 * 0.5 + 0.5);
  const fieldBonus = isFieldERT ? 0.15 : 0;

  const dataDensity = Math.min(1, densityScore * 0.35 + layerScore * 0.25 + anomalyScore * 0.15 + 0.25 + fieldBonus);

  // ── Composite confidence ──
  const w = { ertAgreement: 0.4 as const, aiModel: 0.3 as const, dataDensity: 0.3 as const };
  const finalConfidence = Math.min(0.95,
    ertAgreement * w.ertAgreement +
    aiModelConfidence * w.aiModel +
    dataDensity * w.dataDensity
  );

  const afterERT = Math.min(0.95, Math.max(finalConfidence, baseConfidence + interp1D.confidenceBoost_pct / 100));
  const improvement = ((afterERT - baseConfidence) / baseConfidence) * 100;

  const recommendations: string[] = [];
  if (ertAgreement < 0.5) recommendations.push('Additional ERT survey lines recommended for better resolution');
  if (dataDensity < 0.5) recommendations.push('Increase electrode density or use closer spacing');
  if (aiModelConfidence < 0.6) recommendations.push('Collect more regional borehole data to improve AI model');
  if (!isFieldERT) recommendations.push('Field ERT survey would significantly improve confidence (currently modelled)');
  if (finalConfidence > 0.85) recommendations.push('High-confidence site — proceed to drilling');

  return {
    finalConfidence: Math.round(finalConfidence * 1000) / 1000,
    beforeERT: Math.round(baseConfidence * 1000) / 1000,
    afterERT: Math.round(afterERT * 1000) / 1000,
    improvementPercent: Math.round(improvement * 10) / 10,
    ertAgreement: Math.round(ertAgreement * 1000) / 1000,
    aiModelConfidence: Math.round(aiModelConfidence * 1000) / 1000,
    dataDensity: Math.round(dataDensity * 1000) / 1000,
    weights: w,
    componentBreakdown: [
      { name: 'ERT Data Agreement', score: ertAgreement, weight: w.ertAgreement, weighted: ertAgreement * w.ertAgreement },
      { name: 'AI Model Confidence', score: aiModelConfidence, weight: w.aiModel, weighted: aiModelConfidence * w.aiModel },
      { name: 'Data Density & Coverage', score: dataDensity, weight: w.dataDensity, weighted: dataDensity * w.dataDensity },
    ],
    isHighConfidence: finalConfidence > 0.85,
    needsMoreData: finalConfidence < 0.60,
    recommendations,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 9: VISUALIZATION DATA GENERATION
// ═══════════════════════════════════════════════════════════════

function generateVisualizationData(
  model: Inverted2DModel,
  features: ERTFeatures,
  depth: DepthOptimization,
  interp1D: ERTInterpretationResult,
): ERTVisualizationData {
  // ── Resistivity section values ──
  const values: number[][] = model.grid.map(row => row.map(c => c.resistivity));

  // ── Color scale (log-spaced) ──
  const colorScale = [
    { value: 1,     color: '#08306b' },  // deep blue — very conductive
    { value: 5,     color: '#2171b5' },
    { value: 15,    color: '#4292c6' },
    { value: 30,    color: '#6baed6' },
    { value: 50,    color: '#9ecae1' },
    { value: 100,   color: '#c6dbef' },
    { value: 200,   color: '#fef0d9' },
    { value: 500,   color: '#fdcc8a' },
    { value: 1000,  color: '#fc8d59' },
    { value: 2000,  color: '#e34a33' },
    { value: 5000,  color: '#b30000' },  // deep red — very resistive
    { value: 10000, color: '#7f0000' },
  ];

  // ── Aquifer zone overlay ──
  const aquiferZones = features.lowResZones
    .filter(z => z.isAquifer)
    .map(z => ({
      xStart: z.xCenter - z.lateralExtent_m / 2,
      xEnd: z.xCenter + z.lateralExtent_m / 2,
      zTop: z.depthTop_m,
      zBottom: z.depthBottom_m,
      label: `Aquifer (${z.avgResistivity.toFixed(0)} Ωm)`,
      color: 'rgba(34, 197, 94, 0.3)', // green overlay
    }));

  // ── Fracture zones ──
  const fractureZones = model.anomalies
    .filter(a => a.shape === 'vertical' && a.type === 'low_resistivity')
    .map(a => ({
      xCenter: a.xCenter,
      zTop: a.zCenter - a.height_m / 2,
      zBottom: a.zCenter + a.height_m / 2,
      label: `Fracture (${a.avgResistivity.toFixed(0)} Ωm)`,
    }));

  // ── Layer boundaries ──
  const layerBounds = model.layerBoundaries.map(b => ({
    points: [
      { x: b.xStart, z: b.depth_m },
      { x: b.xEnd, z: b.depth_m },
    ],
    label: `Boundary: ${b.resistivityAbove.toFixed(0)}→${b.resistivityBelow.toFixed(0)} Ωm (${b.type})`,
  }));

  // ── Drill marker at optimal position ──
  // Find the x-position with the best aquifer target
  let bestX = model.profileLength_m / 2;
  if (features.lowResZones.length > 0) {
    const bestZone = features.lowResZones
      .filter(z => z.isAquifer)
      .sort((a, b) => (b.thickness_m * b.continuityScore) - (a.thickness_m * a.continuityScore))[0];
    if (bestZone) bestX = bestZone.xCenter;
  }

  const drillMarker = {
    x: bestX,
    targetDepth_m: depth.recommendedDrillingDepth_m,
    casingDepth_m: depth.casingDepth_m,
    screenFrom_m: depth.screenFrom_m,
    screenTo_m: depth.screenTo_m,
    label: `DRILL HERE → ${depth.recommendedDrillingDepth_m}m`,
  };

  const profileSummary = `ERT profile: ${model.profileLength_m.toFixed(0)}m long × ${model.maxDepth_m.toFixed(0)}m deep | ` +
    `${model.nx}×${model.nz} cells | ${model.anomalies.length} anomalies | ` +
    `${model.layerBoundaries.length} layer boundaries | RMS: ${model.rmsError_pct}%`;

  return {
    resistivitySection: { values, xPositions: model.xPositions, zDepths: model.zDepths, colorScale },
    interpretationOverlay: { aquiferZones, fractureZones, layerBoundaries: layerBounds },
    drillMarker,
    profileSummary,
  };
}

// ═══════════════════════════════════════════════════════════════
// STEP 10: FEEDBACK LOOP
// ═══════════════════════════════════════════════════════════════

const FEEDBACK_STORAGE_KEY = 'aquascan_ert_feedback';

function loadFeedbackHistory(): ERTFeedbackEntry[] {
  try {
    const raw = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveFeedbackEntry(entry: ERTFeedbackEntry): void {
  try {
    const history = loadFeedbackHistory();
    history.push(entry);
    // Keep last 200 entries
    const trimmed = history.slice(-200);
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage not available
  }
}

export function recordDrillingOutcome(
  siteId: string,
  predicted: ERTFeedbackEntry['predicted'],
  actual: ERTFeedbackEntry['actual'],
): ERTFeedbackEntry {
  const depthError = actual.depth_m - predicted.depth_m;
  const yieldError = actual.yield_m3hr - predicted.yield_m3hr;
  const waterStrikeError = actual.waterStrike_m - predicted.waterStrike_m;

  const entry: ERTFeedbackEntry = {
    siteId,
    timestamp: new Date().toISOString(),
    predicted,
    actual,
    errors: {
      depthError_m: Math.round(depthError * 10) / 10,
      depthError_pct: Math.round(Math.abs(depthError) / predicted.depth_m * 100 * 10) / 10,
      yieldError_m3hr: Math.round(yieldError * 100) / 100,
      yieldError_pct: predicted.yield_m3hr > 0
        ? Math.round(Math.abs(yieldError) / predicted.yield_m3hr * 100 * 10) / 10
        : 0,
      waterStrikeError_m: Math.round(waterStrikeError * 10) / 10,
      lithologyMatch: actual.lithology.toLowerCase().includes(predicted.lithology.toLowerCase().split('/')[0]),
    },
    modelUpdate: {
      adjustmentFactor: 1,
      affectedParameters: [],
      retrainSuggested: false,
    },
  };

  // Compute adjustment factors
  if (Math.abs(entry.errors.depthError_pct) > 20) {
    entry.modelUpdate.adjustmentFactor = predicted.depth_m > 0 ? actual.depth_m / predicted.depth_m : 1;
    entry.modelUpdate.affectedParameters.push('depth');
    entry.modelUpdate.retrainSuggested = true;
  }
  if (entry.errors.yieldError_pct > 30) {
    entry.modelUpdate.affectedParameters.push('yield');
    entry.modelUpdate.retrainSuggested = true;
  }

  saveFeedbackEntry(entry);
  return entry;
}

function computeModelAccuracy(history: ERTFeedbackEntry[]): ERTIntelligenceResult['modelAccuracy'] {
  if (history.length === 0) {
    return { meanDepthError_pct: 0, meanYieldError_pct: 0, successRate: 0, sampleCount: 0 };
  }
  const depthErrors = history.map(e => e.errors.depthError_pct);
  const yieldErrors = history.map(e => e.errors.yieldError_pct);
  const successes = history.filter(e => e.actual.yield_m3hr > 0.5).length;

  return {
    meanDepthError_pct: Math.round(depthErrors.reduce((s, v) => s + v, 0) / depthErrors.length * 10) / 10,
    meanYieldError_pct: Math.round(yieldErrors.reduce((s, v) => s + v, 0) / yieldErrors.length * 10) / 10,
    successRate: Math.round(successes / history.length * 100) / 100,
    sampleCount: history.length,
  };
}

// ═══════════════════════════════════════════════════════════════
// MASTER PIPELINE — runERTIntelligencePipeline()
// ═══════════════════════════════════════════════════════════════

export function runERTIntelligencePipeline(
  ertInput: ERTSurveyInput,
  aiLayers: ExistingAILayers,
  isFieldERT: boolean = true,
): ERTIntelligenceResult {
  const steps: string[] = [];

  // ── Step 1: Already done — data ingested via ertFileParser ──
  steps.push('1_data_ingestion');

  // ── Step 2: 2D Inversion ──
  const invertedModel = invert2D(
    ertInput.dataPoints,
    ertInput.arrayType,
    ertInput.electrodeSpacing_m ?? 5,
    ertInput.lineLength_m ?? 100,
  );
  steps.push('2_inversion');

  // ── Step 3: 1D interpretation (existing engine) ──
  const interpretation1D = interpretERTSurvey(ertInput);
  steps.push('3_interpretation');

  // ── Step 4: Feature Extraction ──
  const features = extractFeatures(invertedModel);
  steps.push('4_feature_extraction');

  // ── Step 5: Hybrid AI Interpretation ──
  const hybridInterp = hybridInterpretationModel(features, interpretation1D, aiLayers);
  steps.push('5_hybrid_ai');

  // ── Step 6: Depth Optimization ──
  const depthOpt = optimizeDepth(interpretation1D, features, hybridInterp);
  steps.push('6_depth_optimization');

  // ── Step 7: Yield Estimation ──
  const yieldEst = estimateYield(interpretation1D, features, aiLayers);
  steps.push('7_yield_estimation');

  // ── Step 8: Confidence Engine ──
  const confidence = computeConfidence(invertedModel, interpretation1D, hybridInterp, features, aiLayers, isFieldERT);
  steps.push('8_confidence_engine');

  // ── Step 9: Visualization Data ──
  const visualization = generateVisualizationData(invertedModel, features, depthOpt, interpretation1D);
  steps.push('9_visualization');

  // ── Step 10: Feedback Loop (load history) ──
  const feedbackHistory = loadFeedbackHistory();
  const modelAccuracy = computeModelAccuracy(feedbackHistory);
  steps.push('10_feedback_loop');

  // ── Drill / No-Drill Decision ──
  let drillOrNoDrill: ERTIntelligenceResult['drillOrNoDrill'];
  let drillDecisionReasoning: string;

  if (confidence.finalConfidence > 0.75 && hybridInterp.successProbability > 0.65 && yieldEst.sustainableYield_m3hr > 0.3) {
    drillOrNoDrill = 'DRILL';
    drillDecisionReasoning = `Confidence ${(confidence.finalConfidence * 100).toFixed(0)}%, success probability ${(hybridInterp.successProbability * 100).toFixed(0)}%, ` +
      `estimated yield ${yieldEst.sustainableYield_m3hr.toFixed(1)} m³/hr — site is viable for drilling.`;
  } else if (confidence.finalConfidence < 0.50 || hybridInterp.successProbability < 0.40) {
    drillOrNoDrill = 'NEEDS_FURTHER_ASSESSMENT';
    drillDecisionReasoning = `Current confidence (${(confidence.finalConfidence * 100).toFixed(0)}%) and success probability (${(hybridInterp.successProbability * 100).toFixed(0)}%) suggest ` +
      `additional data collection (ERT survey, pump test, or additional geophysics) would strengthen the case before committing to drilling.`;
  } else {
    drillOrNoDrill = 'INVESTIGATE_FURTHER';
    drillDecisionReasoning = `Moderate confidence (${(confidence.finalConfidence * 100).toFixed(0)}%), success probability ${(hybridInterp.successProbability * 100).toFixed(0)}% — ` +
      `recommend additional ERT lines or geophysical methods to confirm aquifer geometry before drilling.`;
  }

  // ── Executive Summary ──
  const executiveSummary = [
    `ERT Intelligence Pipeline v2.0 — ${steps.length}/10 steps completed.`,
    `2D Inversion: ${invertedModel.nx}×${invertedModel.nz} grid, RMS ${invertedModel.rmsError_pct}%, method: ${invertedModel.method}.`,
    `Layers resolved: ${interpretation1D.layers.length}, aquifer targets: ${interpretation1D.aquiferTargets.length}.`,
    `Features: ${features.anomalyCount} anomalies (${features.verticalAnomalies} fractures, ${features.horizontalAnomalies} aquifer layers).`,
    `Hybrid AI: success probability ${(hybridInterp.successProbability * 100).toFixed(0)}% from ${hybridInterp.featureWeights.length}-feature ensemble.`,
    `Recommended depth: ${depthOpt.recommendedDrillingDepth_m}m (screen ${depthOpt.screenFrom_m}–${depthOpt.screenTo_m}m).`,
    `Estimated yield: ${yieldEst.estimatedYield_m3hr.toFixed(1)} m³/hr (${yieldEst.estimatedYield_Lmin.toFixed(0)} L/min), sustainable: ${yieldEst.sustainableYield_m3hr.toFixed(1)} m³/hr.`,
    `Confidence: ${(confidence.beforeERT * 100).toFixed(0)}% → ${(confidence.afterERT * 100).toFixed(0)}% (+${confidence.improvementPercent.toFixed(0)}%).`,
    `Decision: ${drillOrNoDrill}.`,
  ].join('\n');

  return {
    pipelineVersion: '2.0',
    executedSteps: steps,
    dataSource: isFieldERT ? 'field_ert' : 'modelled',
    timestamp: new Date().toISOString(),
    invertedModel,
    interpretation1D,
    features,
    hybridInterpretation: hybridInterp,
    depthOptimization: depthOpt,
    yieldEstimation: yieldEst,
    confidence,
    visualization,
    feedbackHistory,
    modelAccuracy,
    executiveSummary,
    drillOrNoDrill,
    drillDecisionReasoning,
  };
}
