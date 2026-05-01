/**
 * AI SCANNER ORCHESTRATOR
 * ───────────────────────
 * Master controller for the AquaScan Pro AI Image Scanner.
 * Orchestrates all scanning subsystems into a single pipeline:
 *
 *   1. Soil Color Analysis (Munsell color charts → soil type)
 *   2. Vegetation & Phreatophyte Detection (ExG/GRVI + MobileNet → water indicators)
 *   3. Terrain Feature Analysis (existing ImageDetector pixel pipeline)
 *   4. Zone Mapping (generates annotated 2D map zones)
 *   5. Subsurface Layer Estimation (from soil + rock + water table data)
 *   6. 2D/3D Visualization Coordination
 *
 * 100% real analysis — no stubs, no fakes.
 */

import { analyzeSoilColor, analyzeSoilColorFromRGB, type SoilColorResult } from './soilColorEngine';
import { detectVegetationAndPhreatophytes, analyzeVegetationPixels, type VegetationDetectionResult } from './vegetationDetector';
import { type MapZone, type SubsurfaceLayer } from './terrainMapper';

// ═══════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════

export interface ScannerInput {
  /** The uploaded image element */
  imageElement: HTMLImageElement;
  /** MobileNet classification labels (from ImageDetector) */
  mobilenetLabels: { className: string; probability: number }[];
  /** Pixel analysis from ImageDetector */
  pixelAnalysis?: {
    greenRatio: number;
    blueRatio: number;
    redRatio: number;
    brightness: number;
    vegetationIndex: number;
    waterIndex: number;
    soilExposureIndex: number;
    rockExposureIndex: number;
    dominantColorClass: string;
  };
  /** Rock classification result (from boreholeAnalyzer) */
  rockType?: string;
  /** Estimated depth from main analysis */
  estimatedDepth_m?: number;
  /** GPS coordinates if available */
  coordinates?: { latitude: number; longitude: number };
}

export interface AIScanResult {
  /** Scan timestamp */
  timestamp: string;
  /** Overall scan confidence (0-1) */
  overallConfidence: number;

  // ── Analysis Results ──
  /** Soil color and type analysis */
  soilAnalysis: SoilColorResult;
  /** Vegetation and phreatophyte detection */
  vegetationAnalysis: VegetationDetectionResult;
  /** Scene classification summary */
  sceneClassification: {
    primaryScene: string;
    isOutdoor: boolean;
    terrainType: string;
    confidence: number;
  };

  // ── Synthesized Assessment ──
  /** Combined groundwater assessment from all evidence */
  groundwaterSynthesis: {
    overallLikelihood: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
    combinedConfidence: number;
    estimatedDepthRange_m: [number, number];
    evidenceSources: { source: string; finding: string; confidence: number; supports: boolean }[];
    recommendation: string;
  };

  // ── Visualization Data ──
  /** 2D map zones for overlay rendering */
  mapZones: MapZone[];
  /** Subsurface layer model */
  subsurfaceLayers: SubsurfaceLayer[];
  /** Estimated water table depth for visualization */
  waterTableDepth_m: number;

  // ── Metadata ──
  /** Processing time in ms */
  processingTime_ms: number;
  /** Which subsystems contributed */
  activeSystems: string[];
  /** Warnings or caveats */
  warnings: string[];
}

// ═══════════════════════════════════════════════════════════════
// SCENE CLASSIFICATION
// ═══════════════════════════════════════════════════════════════

/** Classify the scene type from MobileNet labels and pixel data */
function classifyScene(
  labels: { className: string; probability: number }[],
  pixelAnalysis?: ScannerInput['pixelAnalysis'],
): AIScanResult['sceneClassification'] {
  const labelStr = labels.map(l => l.className.toLowerCase()).join(' ');

  // Terrain type detection
  const terrainKeywords: Record<string, string[]> = {
    'Desert/Arid': ['desert', 'sand', 'dune', 'arid', 'sandbar', 'cliff'],
    'Grassland/Savanna': ['savanna', 'grassland', 'meadow', 'prairie', 'field', 'hay'],
    'Forest/Woodland': ['forest', 'jungle', 'rainforest', 'tree', 'wood', 'grove'],
    'Wetland/Marsh': ['marsh', 'swamp', 'wetland', 'bog', 'lakeside'],
    'Rocky/Mountain': ['mountain', 'cliff', 'rock', 'volcano', 'ridge', 'promontory', 'alp'],
    'Agricultural': ['farm', 'crop', 'paddy', 'vineyard', 'orchard', 'plantation'],
    'Riverine/Aquatic': ['river', 'lake', 'stream', 'pond', 'water', 'dam', 'reservoir'],
    'Urban/Built': ['building', 'house', 'street', 'city', 'bridge', 'church'],
  };

  let bestTerrain = 'Unknown';
  let bestScore = 0;
  for (const [terrain, keywords] of Object.entries(terrainKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      for (const l of labels) {
        if (l.className.toLowerCase().includes(kw)) {
          score += l.probability;
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestTerrain = terrain;
    }
  }

  // Supplement with pixel analysis
  if (pixelAnalysis) {
    if (pixelAnalysis.vegetationIndex > 0.5 && bestScore < 0.3) bestTerrain = 'Vegetated Land';
    if (pixelAnalysis.waterIndex > 0.4 && bestScore < 0.3) bestTerrain = 'Aquatic/Wet';
    if (pixelAnalysis.soilExposureIndex > 0.5 && bestScore < 0.3) bestTerrain = 'Exposed Soil';
    if (pixelAnalysis.rockExposureIndex > 0.5 && bestScore < 0.3) bestTerrain = 'Rocky Terrain';
  }

  // Outdoor check
  const indoorWords = ['room', 'bedroom', 'kitchen', 'office', 'studio', 'screen', 'monitor', 'desktop'];
  const isOutdoor = !indoorWords.some(w => labelStr.includes(w));

  return {
    primaryScene: labels[0]?.className || 'Unknown',
    isOutdoor,
    terrainType: bestTerrain,
    confidence: Math.min(1, bestScore + (pixelAnalysis ? 0.1 : 0)),
  };
}

// ═══════════════════════════════════════════════════════════════
// ZONE GENERATION — Converts analysis into map overlay zones
// ═══════════════════════════════════════════════════════════════

function generateMapZones(
  soilResult: SoilColorResult,
  vegResult: VegetationDetectionResult,
  scene: AIScanResult['sceneClassification'],
): MapZone[] {
  const zones: MapZone[] = [];

  // Soil zones — from dominant colors, placed in lower portion of image
  if (soilResult.dominantColors && soilResult.dominantColors.length > 0) {
    const soilColors = soilResult.dominantColors;
    const totalPct = soilColors.reduce((s, c) => s + c.percentage, 0);
    let xOffset = 0;

    for (const sc of soilColors) {
      const widthFrac = Math.max(0.1, sc.percentage / totalPct * 0.9);
      const [r, g, b] = sc.rgb;
      const soilInfo = analyzeSoilColorFromRGB(r, g, b);

      zones.push({
        type: 'soil',
        x: xOffset + 0.05,
        y: 0.55,
        width: widthFrac * 0.9,
        height: 0.40,
        label: soilInfo.soilType || 'Soil Zone',
        color: `rgb(${r},${g},${b})`,
        opacity: 0.25,
        info: soilInfo.munsell ? `Munsell: ${soilInfo.munsell}` : undefined,
      });
      xOffset += widthFrac;
    }
  }

  // Vegetation zones — based on vegetation detection
  const veg = vegResult.pixelStats;
  if (veg.vegetationCover > 0.05) {
    const vegZone: MapZone = {
      type: 'vegetation',
      x: veg.distribution === 'Riparian corridor' ? 0.15 : 0.05,
      y: veg.distribution === 'Riparian corridor' ? 0.20 : 0.05,
      width: veg.distribution === 'Riparian corridor' ? 0.70 : Math.min(0.90, veg.vegetationCover + 0.1),
      height: veg.distribution === 'Riparian corridor' ? 0.25 : Math.min(0.50, veg.vegetationCover * 0.8),
      label: `${veg.vigor} Vegetation (${Math.round(veg.vegetationCover * 100)}%)`,
      color: '#2E7D32',
      opacity: 0.20,
      info: `ExG=${veg.avgExG.toFixed(0)} GRVI=${veg.avgGRVI.toFixed(2)}`,
    };
    zones.push(vegZone);
  }

  // Water indicator zones — from phreatophyte matches
  for (const ph of vegResult.phreatophytes.slice(0, 3)) {
    if (ph.matchConfidence > 0.3) {
      zones.push({
        type: 'water_indicator',
        x: 0.60,
        y: 0.05 + vegResult.phreatophytes.indexOf(ph) * 0.12,
        width: 0.35,
        height: 0.10,
        label: ph.species,
        color: '#1565C0',
        opacity: 0.30,
        info: `GW: ${ph.waterDepthRange_m[0]}-${ph.waterDepthRange_m[1]}m (${(ph.gwConfidence * 100).toFixed(0)}%)`,
      });
    }
  }

  // Green-in-dry pattern (spring/seep indicator)
  if (veg.greenInDryPattern) {
    zones.push({
      type: 'spring',
      x: 0.30,
      y: 0.30,
      width: 0.40,
      height: 0.30,
      label: 'Possible Spring/Seep Zone',
      color: '#0277BD',
      opacity: 0.25,
      info: 'Green-in-dry pattern indicates shallow water',
    });
  }

  // Wetland indicator
  if (scene.terrainType.includes('Wetland') || scene.terrainType.includes('Aquatic')) {
    zones.push({
      type: 'wetland',
      x: 0.10,
      y: 0.40,
      width: 0.80,
      height: 0.20,
      label: 'Wetland / Saturated Zone',
      color: '#00838F',
      opacity: 0.20,
    });
  }

  return zones;
}

// ═══════════════════════════════════════════════════════════════
// SUBSURFACE LAYER ESTIMATION
// ═══════════════════════════════════════════════════════════════

function estimateSubsurfaceLayers(
  soilResult: SoilColorResult,
  rockType?: string,
  estimatedDepth_m?: number,
  waterTableDepth?: number,
): SubsurfaceLayer[] {
  const totalDepth = estimatedDepth_m || 60;
  const wtDepth = waterTableDepth || totalDepth * 0.4;
  const layers: SubsurfaceLayer[] = [];

  // Layer 1: Topsoil (from soil analysis)
  const topsoilThickness = soilResult.organicMatter.level === 'High' ? 2.5
    : soilResult.organicMatter.level === 'Moderate' ? 1.5 : 0.5;
  layers.push({
    topDepth_m: 0,
    bottomDepth_m: topsoilThickness,
    name: `Topsoil (${soilResult.soilType || 'Mixed'})`,
    color: soilResult.dominantColors?.[0]
      ? `rgb(${soilResult.dominantColors[0].rgb.join(',')})`
      : '#8B6914',
    pattern: 'dots',
    isAquifer: false,
    waterBearing: false,
  });

  // Layer 2: Subsoil / weathered zone
  const subsoilBottom = topsoilThickness + Math.min(totalDepth * 0.15, 8);
  const subsoilColor = soilResult.ironOxides.level === 'High' ? '#B7410E'
    : soilResult.drainage === 'Poor (gleyed)' ? '#708090'
    : '#A0522D';
  layers.push({
    topDepth_m: topsoilThickness,
    bottomDepth_m: subsoilBottom,
    name: soilResult.ironOxides.level === 'High' ? 'Laterite / Iron-rich subsoil'
      : soilResult.drainage === 'Poor (gleyed)' ? 'Gleyed subsoil (waterlogged)'
      : 'Weathered subsoil',
    color: subsoilColor,
    pattern: 'diagonal',
    isAquifer: false,
    waterBearing: soilResult.drainage === 'Poor (gleyed)',
  });

  // Layer 3: Saprolite / deeply weathered rock
  const saproliteBottom = subsoilBottom + Math.min(totalDepth * 0.20, 15);
  layers.push({
    topDepth_m: subsoilBottom,
    bottomDepth_m: saproliteBottom,
    name: 'Saprolite (weathered rock)',
    color: '#C4A882',
    pattern: 'cross',
    isAquifer: wtDepth >= subsoilBottom && wtDepth <= saproliteBottom,
    waterBearing: wtDepth >= subsoilBottom && wtDepth <= saproliteBottom,
  });

  // Layer 4: Fractured bedrock (main aquifer zone if applicable)
  const fracturedBottom = saproliteBottom + Math.min(totalDepth * 0.25, 20);
  const rockColor = getRockColor(rockType);
  layers.push({
    topDepth_m: saproliteBottom,
    bottomDepth_m: fracturedBottom,
    name: `Fractured ${rockType || 'Bedrock'}`,
    color: rockColor,
    pattern: 'dashes',
    isAquifer: wtDepth <= fracturedBottom,
    waterBearing: wtDepth <= fracturedBottom,
  });

  // Layer 5: Competent bedrock
  layers.push({
    topDepth_m: fracturedBottom,
    bottomDepth_m: totalDepth,
    name: `Competent ${rockType || 'Bedrock'}`,
    color: adjustColor(rockColor, -30),
    pattern: 'solid',
    isAquifer: false,
    waterBearing: false,
  });

  return layers;
}

function getRockColor(rockType?: string): string {
  if (!rockType) return '#808080';
  const rt = rockType.toLowerCase();
  if (rt.includes('granite')) return '#C0A888';
  if (rt.includes('basalt')) return '#4A4A4A';
  if (rt.includes('sandstone')) return '#D2B48C';
  if (rt.includes('limestone')) return '#D4CFC0';
  if (rt.includes('shale')) return '#636B6F';
  if (rt.includes('gneiss')) return '#9E9687';
  if (rt.includes('schist')) return '#7B8A6E';
  if (rt.includes('quartzite')) return '#E8E0D4';
  if (rt.includes('marble')) return '#EEECE8';
  if (rt.includes('dolomite')) return '#C8B89A';
  return '#808080';
}

function adjustColor(hex: string, amount: number): string {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1, 3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3, 5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5, 7), 16) + amount));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// ═══════════════════════════════════════════════════════════════
// GROUNDWATER SYNTHESIS — Fuses all evidence sources
// ═══════════════════════════════════════════════════════════════

function synthesizeGroundwaterAssessment(
  soilResult: SoilColorResult,
  vegResult: VegetationDetectionResult,
  scene: AIScanResult['sceneClassification'],
  rockType?: string,
  estimatedDepth_m?: number,
): AIScanResult['groundwaterSynthesis'] {
  const evidence: AIScanResult['groundwaterSynthesis']['evidenceSources'] = [];
  let totalScore = 0;
  let totalWeight = 0;
  let depthEstimates: [number, number][] = [];

  // 1. Soil color evidence
  if (soilResult.groundwaterIndicator) {
    const gwInd = soilResult.groundwaterIndicator.likelihood.toLowerCase();
    const soilSupports = gwInd.includes('shallow') || gwInd.includes('high') || gwInd.includes('saturated');
    const soilConf = soilResult.confidence;
    evidence.push({
      source: 'Soil Color (Munsell)',
      finding: `${soilResult.soilType} — ${soilResult.groundwaterIndicator.reasoning || soilResult.groundwaterIndicator.likelihood}`,
      confidence: soilConf,
      supports: soilSupports,
    });
    totalScore += soilSupports ? soilConf * 0.7 : (1 - soilConf) * 0.3;
    totalWeight += 0.7;

    if (soilResult.drainage === 'Poor (gleyed)') {
      depthEstimates.push([0, 5]);
    } else if (soilResult.moisture.level === 'High') {
      depthEstimates.push([0, 10]);
    }
  }

  // 2. Vegetation evidence
  const vegGw = vegResult.groundwaterAssessment;
  evidence.push({
    source: 'Vegetation & Phreatophytes',
    finding: `${vegGw.likelihood} likelihood — ${vegResult.phreatophytes.length} indicator species detected`,
    confidence: vegGw.confidence,
    supports: vegGw.confidence > 0.35,
  });
  totalScore += vegGw.confidence * 0.8;
  totalWeight += 0.8;
  if (vegGw.estimatedDepthRange_m[0] < 100) {
    depthEstimates.push(vegGw.estimatedDepthRange_m);
  }

  // 3. Scene/terrain evidence
  const terrainSupports = scene.terrainType.includes('Wetland') ||
    scene.terrainType.includes('Riverine') ||
    scene.terrainType.includes('Aquatic');
  evidence.push({
    source: 'Terrain Classification',
    finding: `${scene.terrainType} — ${terrainSupports ? 'water-associated terrain' : 'no direct water indication'}`,
    confidence: scene.confidence,
    supports: terrainSupports,
  });
  totalScore += terrainSupports ? scene.confidence * 0.5 : 0;
  totalWeight += 0.5;

  if (terrainSupports) depthEstimates.push([0, 15]);

  // 4. Rock type evidence (if available)
  if (rockType) {
    const rtLower = rockType.toLowerCase();
    const goodAquifer = rtLower.includes('sandstone') || rtLower.includes('limestone') ||
      rtLower.includes('dolomite') || rtLower.includes('gravel');
    evidence.push({
      source: 'Rock Type',
      finding: `${rockType} — ${goodAquifer ? 'good aquifer potential' : 'lower primary porosity'}`,
      confidence: 0.7,
      supports: goodAquifer,
    });
    totalScore += goodAquifer ? 0.5 : 0.1;
    totalWeight += 0.6;
  }

  // 5. Existing depth estimate
  if (estimatedDepth_m) {
    depthEstimates.push([estimatedDepth_m * 0.3, estimatedDepth_m * 0.7]);
  }

  // Combine scores
  const combinedConfidence = totalWeight > 0 ? Math.min(1, totalScore / totalWeight) : 0;

  // Combine depth estimates (weighted average of ranges)
  let finalDepthMin = 5, finalDepthMax = 50;
  if (depthEstimates.length > 0) {
    finalDepthMin = depthEstimates.reduce((s, d) => s + d[0], 0) / depthEstimates.length;
    finalDepthMax = depthEstimates.reduce((s, d) => s + d[1], 0) / depthEstimates.length;
    finalDepthMin = Math.max(0, Math.round(finalDepthMin));
    finalDepthMax = Math.max(finalDepthMin + 5, Math.round(finalDepthMax));
  }

  // Likelihood
  const likelihood: AIScanResult['groundwaterSynthesis']['overallLikelihood'] =
    combinedConfidence > 0.75 ? 'Very High' :
    combinedConfidence > 0.55 ? 'High' :
    combinedConfidence > 0.35 ? 'Moderate' :
    combinedConfidence > 0.15 ? 'Low' : 'Very Low';

  // Recommendation
  const positiveCount = evidence.filter(e => e.supports).length;
  let recommendation = '';
  if (likelihood === 'Very High' || likelihood === 'High') {
    recommendation = `Strong multi-source evidence for groundwater at ${finalDepthMin}-${finalDepthMax}m. ` +
      `${positiveCount}/${evidence.length} indicators positive. Recommend geophysical survey to confirm.`;
  } else if (likelihood === 'Moderate') {
    recommendation = `Mixed evidence for groundwater. Estimated depth ${finalDepthMin}-${finalDepthMax}m if present. ` +
      `Consider ERT or EM survey before drilling.`;
  } else {
    recommendation = `Limited surface evidence for shallow groundwater. ` +
      `Deeper drilling (>${finalDepthMax}m) or alternative site may be needed. Professional hydrogeological survey recommended.`;
  }

  return {
    overallLikelihood: likelihood,
    combinedConfidence: Math.round(combinedConfidence * 100) / 100,
    estimatedDepthRange_m: [finalDepthMin, finalDepthMax],
    evidenceSources: evidence,
    recommendation,
  };
}

// ═══════════════════════════════════════════════════════════════
// MAIN SCANNER ENTRY POINT
// ═══════════════════════════════════════════════════════════════

/**
 * Run the full AI Scanner pipeline on an uploaded image.
 *
 * @param input - Image + MobileNet labels + optional context from existing analysis
 * @returns Comprehensive scan result with soil, vegetation, groundwater synthesis,
 *          and visualization data for 2D/3D rendering.
 */
export async function runAIScanner(input: ScannerInput): Promise<AIScanResult> {
  const startTime = performance.now();
  const warnings: string[] = [];
  const activeSystems: string[] = [];

  // ── 1. Soil Color Analysis ──
  let soilResult: SoilColorResult;
  try {
    soilResult = analyzeSoilColor(input.imageElement);
    activeSystems.push('Soil Color Engine (Munsell)');
  } catch (e) {
    warnings.push(`Soil color analysis failed: ${e instanceof Error ? e.message : String(e)}`);
    // Minimal fallback
    soilResult = {
      munsell: { hue: '', value: 0, chroma: 0, notation: 'N/A' }, colorName: 'Unknown', soilType: 'Unknown',
      organicMatter: { estimate: 0, level: 'Unknown' }, moisture: { level: 'Unknown', saturation: 0 }, ironOxides: { level: 'Unknown', type: 'Unknown' },
      parentMaterial: 'Unknown', drainage: 'Unknown', groundwaterIndicator: { likelihood: 'Unknown', reasoning: 'Insufficient data' },
      confidence: 0, dominantColors: [],
    };
  }

  // ── 2. Vegetation & Phreatophyte Detection ──
  let vegResult: VegetationDetectionResult;
  try {
    vegResult = detectVegetationAndPhreatophytes(
      input.imageElement,
      input.mobilenetLabels,
      soilResult.dominantColors?.map(c => ({
        rgb: c.rgb as [number, number, number],
        percentage: c.percentage,
      })),
    );
    activeSystems.push('Vegetation & Phreatophyte Detector');
  } catch (e) {
    warnings.push(`Vegetation detection failed: ${e instanceof Error ? e.message : String(e)}`);
    vegResult = {
      pixelStats: {
        vegetationCover: 0, avgExG: 0, avgGRVI: 0,
        vigor: 'None', greenInDryPattern: false, distribution: 'Sparse scattered',
      },
      phreatophytes: [],
      groundwaterAssessment: {
        likelihood: 'Very Low', estimatedDepthRange_m: [10, 50],
        confidence: 0, reasoning: [], vegetationEvidence: [],
      },
      sceneLabels: [],
      zones: [],
    };
  }

  // ── 3. Scene Classification ──
  const scene = classifyScene(input.mobilenetLabels, input.pixelAnalysis);
  activeSystems.push('Scene Classifier');

  if (!scene.isOutdoor) {
    warnings.push('Image appears to be an indoor scene — terrain analysis may be unreliable');
  }

  // ── 4. Generate Map Zones ──
  const mapZones = generateMapZones(soilResult, vegResult, scene);
  activeSystems.push('Zone Mapper');

  // ── 5. Estimate Subsurface Layers ──
  const waterTableEst = vegResult.groundwaterAssessment.estimatedDepthRange_m[0] +
    (vegResult.groundwaterAssessment.estimatedDepthRange_m[1] - vegResult.groundwaterAssessment.estimatedDepthRange_m[0]) * 0.4;
  const subsurfaceLayers = estimateSubsurfaceLayers(
    soilResult, input.rockType, input.estimatedDepth_m, waterTableEst,
  );
  activeSystems.push('Subsurface Layer Estimator');

  // ── 6. Synthesize Groundwater Assessment ──
  const groundwaterSynthesis = synthesizeGroundwaterAssessment(
    soilResult, vegResult, scene, input.rockType, input.estimatedDepth_m,
  );
  activeSystems.push('Groundwater Evidence Fusion');

  // ── Overall confidence ──
  const overallConfidence = Math.round(
    (soilResult.confidence * 0.25 +
     vegResult.groundwaterAssessment.confidence * 0.30 +
     groundwaterSynthesis.combinedConfidence * 0.30 +
     scene.confidence * 0.15) * 100
  ) / 100;

  const processingTime_ms = Math.round(performance.now() - startTime);

  return {
    timestamp: new Date().toISOString(),
    overallConfidence,
    soilAnalysis: soilResult,
    vegetationAnalysis: vegResult,
    sceneClassification: scene,
    groundwaterSynthesis,
    mapZones,
    subsurfaceLayers,
    waterTableDepth_m: Math.round(waterTableEst * 10) / 10,
    processingTime_ms,
    activeSystems,
    warnings,
  };
}
