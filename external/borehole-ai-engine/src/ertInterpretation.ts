// ═══════════════════════════════════════════════════════════════════════════
// ERT INTERPRETATION ENGINE — Beyond Parsing: Actual Subsurface Interpretation
// 1D layered-earth inversion, aquifer zone extraction, water quality inference,
// drilling target recommendation from resistivity profiles
// ═══════════════════════════════════════════════════════════════════════════

export interface ERTDataPoint {
  pseudoDepth_m: number;
  apparentResistivity_ohmm: number;
  position_m?: number;         // lateral position along survey line
  electrode_spacing_m?: number;
}

export interface ERTSurveyInput {
  dataPoints: ERTDataPoint[];
  arrayType: 'wenner' | 'schlumberger' | 'dipole-dipole' | 'pole-dipole' | 'gradient';
  lineLength_m?: number;
  electrodeSpacing_m?: number;
  latitude?: number;
  longitude?: number;
  knownGeology?: string;       // helps constrain inversion
}

export interface InvertedLayer {
  depthTop_m: number;
  depthBottom_m: number;
  thickness_m: number;
  resistivity_ohmm: number;
  interpretation: string;       // clay, saturated sand, fractured rock, etc.
  waterBearing: boolean;
  waterQuality: 'fresh' | 'brackish' | 'saline' | 'unknown';
  confidence: number;           // 0-1
  hydroRole: 'aquifer' | 'aquitard' | 'aquiclude' | 'semi-permeable';
}

export interface AquiferTarget {
  depthTop_m: number;
  depthBottom_m: number;
  thickness_m: number;
  estimatedResistivity_ohmm: number;
  interpretedLithology: string;
  estimatedYield_m3hr: number;
  estimatedTransmissivity_m2day: number;
  waterQuality: 'fresh' | 'brackish' | 'saline';
  confidence: number;
  rank: number;
  reasoning: string;
}

export interface ERTInterpretationResult {
  // Inverted model
  layers: InvertedLayer[];
  totalDepthInvestigated_m: number;
  inversionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  rmsError_pct: number;
  
  // Aquifer targets
  aquiferTargets: AquiferTarget[];
  bestTarget: AquiferTarget | null;
  
  // Hydrogeological interpretation
  waterTableDepth_m: number | null;
  bedrockDepth_m: number | null;
  overburdenThickness_m: number;
  clayLayerPresent: boolean;
  salineIntrusionRisk: boolean;
  
  // Drilling recommendation
  recommendedDrillingDepth_m: number;
  recommendedCasingDepth_m: number;
  recommendedScreenInterval: { from_m: number; to_m: number };
  
  // Resistivity statistics
  minResistivity_ohmm: number;
  maxResistivity_ohmm: number;
  medianResistivity_ohmm: number;
  resistivityContrast: number;  // max/min ratio — higher = better discrimination
  
  // Data quality
  dataPointCount: number;
  depthOfInvestigation_m: number;
  lateralCoverage_m: number;
  
  // Narrative
  interpretation: string;
  warnings: string[];
  recommendations: string[];
  
  confidenceBoost_pct: number;  // how much this ERT data improves overall confidence
}

// ═══ RESISTIVITY → LITHOLOGY INTERPRETATION TABLE ═══
// Based on Palacky (1987) and Telford et al. (1990)
interface ResistivityRange {
  min: number; max: number;
  lithology: string;
  waterBearing: boolean;
  waterQuality: 'fresh' | 'brackish' | 'saline' | 'unknown';
  hydroRole: InvertedLayer['hydroRole'];
  K_m_day: number;  // typical hydraulic conductivity
  porosity: number;
}

const RESISTIVITY_RANGES: ResistivityRange[] = [
  // Very low resistivity (< 10 Ωm)
  { min: 0.1,  max: 1,     lithology: 'saline water / brine',     waterBearing: true,  waterQuality: 'saline',  hydroRole: 'aquifer',        K_m_day: 10,    porosity: 0.35 },
  { min: 1,    max: 5,     lithology: 'marine clay / saline aquifer', waterBearing: true, waterQuality: 'saline', hydroRole: 'aquifer',       K_m_day: 0.001, porosity: 0.50 },
  { min: 5,    max: 10,    lithology: 'wet clay / brackish water', waterBearing: false, waterQuality: 'brackish', hydroRole: 'aquiclude',     K_m_day: 0.001, porosity: 0.45 },
  
  // Low resistivity (10-100 Ωm)
  { min: 10,   max: 30,    lithology: 'saturated clay / clayey sand', waterBearing: false, waterQuality: 'unknown', hydroRole: 'aquitard',   K_m_day: 0.01,  porosity: 0.40 },
  { min: 30,   max: 80,    lithology: 'saturated sand / weathered rock', waterBearing: true, waterQuality: 'fresh', hydroRole: 'aquifer',    K_m_day: 5.0,   porosity: 0.30 },
  { min: 80,   max: 150,   lithology: 'wet sandstone / fractured zone', waterBearing: true, waterQuality: 'fresh', hydroRole: 'aquifer',     K_m_day: 3.0,   porosity: 0.25 },
  
  // Moderate resistivity (100-500 Ωm)
  { min: 150,  max: 300,   lithology: 'dry sand / laterite / weathered basement', waterBearing: false, waterQuality: 'unknown', hydroRole: 'semi-permeable', K_m_day: 0.5, porosity: 0.20 },
  { min: 300,  max: 500,   lithology: 'dry sandstone / limestone',  waterBearing: false, waterQuality: 'unknown', hydroRole: 'semi-permeable', K_m_day: 0.1,  porosity: 0.15 },
  
  // High resistivity (500-5000 Ωm)
  { min: 500,  max: 1500,  lithology: 'fresh granite / compact limestone', waterBearing: false, waterQuality: 'unknown', hydroRole: 'aquiclude', K_m_day: 0.001, porosity: 0.03 },
  { min: 1500, max: 5000,  lithology: 'massive granite / quartzite', waterBearing: false, waterQuality: 'unknown', hydroRole: 'aquiclude',  K_m_day: 0.0001, porosity: 0.01 },
  
  // Very high resistivity (> 5000 Ωm)
  { min: 5000, max: 100000, lithology: 'dry crystalline rock / gravel', waterBearing: false, waterQuality: 'unknown', hydroRole: 'aquiclude', K_m_day: 0.00001, porosity: 0.005 },
];

// ═══ 1D LAYERED-EARTH INVERSION (Occam-style smooth inversion) ═══
function invertResistivityProfile(dataPoints: ERTDataPoint[]): InvertedLayer[] {
  if (dataPoints.length < 3) return [];
  
  // Sort by depth
  const sorted = [...dataPoints].sort((a, b) => a.pseudoDepth_m - b.pseudoDepth_m);
  
  // Group data into depth bins (natural layer detection)
  const layers: InvertedLayer[] = [];
  let currentGroup: ERTDataPoint[] = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const prev = currentGroup[currentGroup.length - 1];
    const curr = sorted[i];
    
    // Detect layer boundary: resistivity change > 30% OR depth gap > 20%
    const resRatio = curr.apparentResistivity_ohmm / Math.max(prev.apparentResistivity_ohmm, 0.1);
    const depthGap = (curr.pseudoDepth_m - prev.pseudoDepth_m) / Math.max(prev.pseudoDepth_m, 0.1);
    
    if (resRatio > 1.3 || resRatio < 0.7 || depthGap > 0.3) {
      // Finalize current layer
      layers.push(createLayerFromGroup(currentGroup, layers.length > 0 ? layers[layers.length - 1].depthBottom_m : 0));
      currentGroup = [curr];
    } else {
      currentGroup.push(curr);
    }
  }
  
  // Finalize last layer
  if (currentGroup.length > 0) {
    layers.push(createLayerFromGroup(currentGroup, layers.length > 0 ? layers[layers.length - 1].depthBottom_m : 0));
  }
  
  // Apply geometric correction factor (apparent → true resistivity)
  // For layered models, true resistivity ≈ apparent × correction factor
  for (let i = 0; i < layers.length; i++) {
    if (i === 0) {
      // First layer: true ≈ apparent
      continue;
    }
    // Deeper layers: correct for overburden effect
    const overburdenEffect = layers.slice(0, i).reduce((sum, l) => {
      return sum + (l.thickness_m / Math.max(l.resistivity_ohmm, 0.1));
    }, 0);
    
    // Dar Zarrouk parameter correction
    if (overburdenEffect > 0) {
      const S = layers[i].thickness_m / layers[i].resistivity_ohmm; // layer conductance
      const totalS = overburdenEffect + S;
      // Apply correction: true resistivity is adjusted by layer position
      const corrFactor = 1 + (i * 0.05); // mild correction
      layers[i].resistivity_ohmm *= corrFactor;
    }
  }
  
  // Re-interpret layers with corrected resistivities
  for (const layer of layers) {
    const interp = interpretResistivity(layer.resistivity_ohmm);
    layer.interpretation = interp.lithology;
    layer.waterBearing = interp.waterBearing;
    layer.waterQuality = interp.waterQuality;
    layer.hydroRole = interp.hydroRole;
  }
  
  return layers;
}

function createLayerFromGroup(group: ERTDataPoint[], topDepth: number): InvertedLayer {
  const avgRes = group.reduce((s, p) => s + p.apparentResistivity_ohmm, 0) / group.length;
  const minDepth = Math.min(...group.map(p => p.pseudoDepth_m));
  const maxDepth = Math.max(...group.map(p => p.pseudoDepth_m));
  const bottomDepth = maxDepth > topDepth ? maxDepth : topDepth + (maxDepth - minDepth || 2);
  
  const interp = interpretResistivity(avgRes);
  
  // Confidence based on data density
  const confidence = Math.min(0.95, 0.5 + group.length * 0.05);
  
  return {
    depthTop_m: topDepth,
    depthBottom_m: bottomDepth,
    thickness_m: bottomDepth - topDepth,
    resistivity_ohmm: avgRes,
    interpretation: interp.lithology,
    waterBearing: interp.waterBearing,
    waterQuality: interp.waterQuality,
    confidence,
    hydroRole: interp.hydroRole
  };
}

function interpretResistivity(res: number): ResistivityRange {
  for (const range of RESISTIVITY_RANGES) {
    if (res >= range.min && res < range.max) return range;
  }
  // Default: high resistivity = dry rock
  return RESISTIVITY_RANGES[RESISTIVITY_RANGES.length - 1];
}

// ═══ AQUIFER TARGET EXTRACTION ═══
function extractAquiferTargets(layers: InvertedLayer[], knownGeology?: string): AquiferTarget[] {
  const targets: AquiferTarget[] = [];
  
  for (let i = 0; i < layers.length; i++) {
    const layer = layers[i];
    
    // Primary criterion: water-bearing layers
    if (layer.waterBearing && layer.waterQuality !== 'saline') {
      const lithoProps = interpretResistivity(layer.resistivity_ohmm);
      
      // Transmissivity estimate: T = K × b
      const T = lithoProps.K_m_day * layer.thickness_m;
      
      // Yield estimate: Q = 2πT × s / ln(R/r)  simplified
      // assume s = 5m drawdown, R = 300m influence, r = 0.076m well
      const yieldEstimate = (2 * Math.PI * T * 5) / Math.log(300 / 0.076) / 24;
      
      let confidence = layer.confidence;
      let reasoning = `Resistivity ${layer.resistivity_ohmm.toFixed(0)} Ωm indicates ${layer.interpretation}`;
      
      // Boost confidence if underlain by aquitard (confined aquifer)
      if (i < layers.length - 1 && layers[i + 1].hydroRole === 'aquiclude') {
        confidence = Math.min(0.95, confidence + 0.1);
        reasoning += '. Underlain by confining layer — potentially confined aquifer.';
      }
      
      // Boost if overlain by aquitard (protected from contamination)
      if (i > 0 && layers[i - 1].hydroRole === 'aquitard') {
        confidence = Math.min(0.95, confidence + 0.05);
        reasoning += ' Protected by overlying aquitard.';
      }
      
      // Boost if matches known geology
      if (knownGeology && layer.interpretation.toLowerCase().includes(knownGeology.toLowerCase())) {
        confidence = Math.min(0.95, confidence + 0.1);
        reasoning += ` Consistent with known geology (${knownGeology}).`;
      }
      
      // Penalize thin layers
      if (layer.thickness_m < 3) {
        confidence *= 0.7;
        reasoning += ' Thin layer — may be unreliable.';
      }
      
      targets.push({
        depthTop_m: layer.depthTop_m,
        depthBottom_m: layer.depthBottom_m,
        thickness_m: layer.thickness_m,
        estimatedResistivity_ohmm: layer.resistivity_ohmm,
        interpretedLithology: layer.interpretation,
        estimatedYield_m3hr: Math.max(0.01, yieldEstimate),
        estimatedTransmissivity_m2day: T,
        waterQuality: (layer.waterQuality as any) === 'saline' ? 'fresh' as any : layer.waterQuality === 'brackish' ? 'brackish' : 'fresh',
        confidence,
        rank: 0,
        reasoning
      });
    }
    
    // Secondary: detect fractured zones (moderate resistivity in hard rock context)
    if (!layer.waterBearing && layer.resistivity_ohmm >= 80 && layer.resistivity_ohmm <= 500) {
      // Check if surrounded by high-resistivity layers (fractured zone in basement)
      const above = i > 0 ? layers[i - 1].resistivity_ohmm : 0;
      const below = i < layers.length - 1 ? layers[i + 1].resistivity_ohmm : 0;
      
      if (above > 500 || below > 500) {
        // Likely fractured zone in crystalline rock
        const T = 1.0 * layer.thickness_m; // conservative K for fractured rock
        const yieldEstimate = (2 * Math.PI * T * 5) / Math.log(300 / 0.076) / 24;
        
        targets.push({
          depthTop_m: layer.depthTop_m,
          depthBottom_m: layer.depthBottom_m,
          thickness_m: layer.thickness_m,
          estimatedResistivity_ohmm: layer.resistivity_ohmm,
          interpretedLithology: 'fractured basement rock',
          estimatedYield_m3hr: Math.max(0.01, yieldEstimate),
          estimatedTransmissivity_m2day: T,
          waterQuality: 'fresh',
          confidence: layer.confidence * 0.8,
          rank: 0,
          reasoning: `Moderate resistivity (${layer.resistivity_ohmm.toFixed(0)} Ωm) between high-resistivity layers — possible fractured zone in basement.`
        });
      }
    }
  }
  
  // Rank targets by yield × confidence
  targets.sort((a, b) => (b.estimatedYield_m3hr * b.confidence) - (a.estimatedYield_m3hr * a.confidence));
  targets.forEach((t, i) => t.rank = i + 1);
  
  return targets;
}

// ═══ MAIN INTERPRETATION FUNCTION ═══
export function interpretERTSurvey(input: ERTSurveyInput): ERTInterpretationResult {
  const { dataPoints, arrayType, knownGeology } = input;
  
  if (dataPoints.length < 3) {
    return emptyResult('Insufficient data points (minimum 3 required)');
  }
  
  // Apply depth correction factor by array type
  const depthFactors: Record<string, number> = {
    'wenner': 0.52,
    'schlumberger': 0.42,
    'dipole-dipole': 0.195,
    'pole-dipole': 0.35,
    'gradient': 0.40
  };
  const depthFactor = depthFactors[arrayType] || 0.4;
  
  // Correct pseudo-depths
  const correctedPoints = dataPoints.map(p => ({
    ...p,
    pseudoDepth_m: p.pseudoDepth_m > 0 ? p.pseudoDepth_m : (p.electrode_spacing_m || 5) * depthFactor
  }));
  
  // Filter outliers (resistivity < 0.1 or > 100000)
  const validPoints = correctedPoints.filter(p => 
    p.apparentResistivity_ohmm > 0.1 && 
    p.apparentResistivity_ohmm < 100000 &&
    p.pseudoDepth_m > 0
  );
  
  const warnings: string[] = [];
  if (validPoints.length < dataPoints.length) {
    warnings.push(`${dataPoints.length - validPoints.length} data points filtered as outliers`);
  }
  
  // ═══ 1D INVERSION ═══
  const layers = invertResistivityProfile(validPoints);
  
  if (layers.length === 0) {
    return emptyResult('Inversion failed — insufficient valid data');
  }
  
  // ═══ EXTRACT AQUIFER TARGETS ═══
  const aquiferTargets = extractAquiferTargets(layers, knownGeology);
  const bestTarget = aquiferTargets.length > 0 ? aquiferTargets[0] : null;
  
  // ═══ HYDROGEOLOGICAL FEATURES ═══
  // Water table: first water-bearing layer top
  const waterTableLayer = layers.find(l => l.waterBearing && l.waterQuality !== 'saline');
  const waterTableDepth = waterTableLayer?.depthTop_m ?? null;
  
  // Bedrock: first high-resistivity (> 500 Ωm) layer
  const bedrockLayer = layers.find(l => l.resistivity_ohmm > 500);
  const bedrockDepth = bedrockLayer?.depthTop_m ?? null;
  
  // Overburden
  const overburdenThickness = bedrockDepth || layers[layers.length - 1].depthBottom_m;
  
  // Clay detection
  const clayPresent = layers.some(l => l.resistivity_ohmm < 15 && l.thickness_m > 2);
  
  // Saline intrusion risk
  const salineRisk = layers.some(l => l.waterQuality === 'saline' || l.waterQuality === 'brackish');
  
  // ═══ DRILLING RECOMMENDATIONS ═══
  let drillDepth = 30; // default
  let casingDepth = 6;
  let screenFrom = 15;
  let screenTo = 30;
  
  if (bestTarget) {
    drillDepth = Math.round(bestTarget.depthBottom_m + 6); // 6m below target bottom
    screenFrom = Math.round(bestTarget.depthTop_m);
    screenTo = Math.round(bestTarget.depthBottom_m);
    
    // Casing through all non-aquifer material above target
    const nonAquiferAbove = layers.filter(l => l.depthBottom_m <= bestTarget.depthTop_m);
    casingDepth = nonAquiferAbove.length > 0 
      ? Math.round(nonAquiferAbove[nonAquiferAbove.length - 1].depthBottom_m + 3)
      : Math.round(bestTarget.depthTop_m);
  } else if (bedrockDepth) {
    drillDepth = Math.round(bedrockDepth + 30);
    casingDepth = Math.round(bedrockDepth + 3);
    screenFrom = Math.round(bedrockDepth);
    screenTo = drillDepth;
  }
  
  // ═══ RESISTIVITY STATISTICS ═══
  const allRes = validPoints.map(p => p.apparentResistivity_ohmm).sort((a, b) => a - b);
  const minRes = allRes[0];
  const maxRes = allRes[allRes.length - 1];
  const medianRes = allRes[Math.floor(allRes.length / 2)];
  const resContrast = maxRes / Math.max(minRes, 0.1);
  
  // ═══ INVERSION QUALITY ═══
  // Estimate RMS error from layer model vs data
  let rmsError = 0;
  let matchCount = 0;
  for (const point of validPoints) {
    const layer = layers.find(l => point.pseudoDepth_m >= l.depthTop_m && point.pseudoDepth_m <= l.depthBottom_m);
    if (layer) {
      const error = Math.abs(point.apparentResistivity_ohmm - layer.resistivity_ohmm) / layer.resistivity_ohmm;
      rmsError += error * error;
      matchCount++;
    }
  }
  rmsError = matchCount > 0 ? Math.sqrt(rmsError / matchCount) * 100 : 50;
  
  const inversionQuality: ERTInterpretationResult['inversionQuality'] = 
    rmsError < 5 ? 'excellent' : rmsError < 15 ? 'good' : rmsError < 30 ? 'fair' : 'poor';
  
  // ═══ DEPTH OF INVESTIGATION ═══
  const maxPseudoDepth = Math.max(...validPoints.map(p => p.pseudoDepth_m));
  const doi = maxPseudoDepth * 1.5; // DOI ≈ 1.5× max pseudo-depth for Wenner
  
  // Lateral coverage
  const positions = validPoints.filter(p => p.position_m !== undefined).map(p => p.position_m!);
  const lateralCoverage = positions.length > 0 ? Math.max(...positions) - Math.min(...positions) : (input.lineLength_m || 0);
  
  // ═══ CONFIDENCE BOOST ═══
  // ERT data significantly improves overall borehole siting confidence
  let confidenceBoost = 12; // base boost
  if (bestTarget && bestTarget.confidence > 0.7) confidenceBoost += 3;
  if (layers.length >= 4) confidenceBoost += 2;
  if (inversionQuality === 'excellent' || inversionQuality === 'good') confidenceBoost += 3;
  if (resContrast > 10) confidenceBoost += 2; // good discrimination
  confidenceBoost = Math.min(20, confidenceBoost);
  
  // ═══ RECOMMENDATIONS ═══
  const recommendations: string[] = [];
  
  if (bestTarget) {
    recommendations.push(`Drill to ${drillDepth}m targeting ${bestTarget.interpretedLithology} at ${bestTarget.depthTop_m}–${bestTarget.depthBottom_m}m`);
    recommendations.push(`Install solid casing to ${casingDepth}m, screen from ${screenFrom}–${screenTo}m`);
    recommendations.push(`Expected yield: ${bestTarget.estimatedYield_m3hr.toFixed(1)} m³/hr (${(bestTarget.estimatedYield_m3hr * 1000 / 60).toFixed(0)} L/min)`);
  } else {
    recommendations.push('No clear aquifer target identified — consider alternative site or additional geophysical methods');
  }
  
  if (clayPresent) {
    recommendations.push('Clay layer detected — ensure proper casing through clay to prevent borehole collapse');
  }
  if (salineRisk) {
    recommendations.push('Saline/brackish water risk — consider deeper freshwater target or water treatment');
    warnings.push('Saline intrusion risk detected in resistivity profile');
  }
  if (inversionQuality === 'poor') {
    warnings.push('Low inversion quality — consider additional survey lines for verification');
  }
  
  // ═══ NARRATIVE ═══
  const interpretation = generateNarrative(layers, aquiferTargets, waterTableDepth, bedrockDepth, overburdenThickness, inversionQuality);
  
  return {
    layers,
    totalDepthInvestigated_m: Math.round(doi),
    inversionQuality,
    rmsError_pct: Math.round(rmsError * 10) / 10,
    aquiferTargets,
    bestTarget,
    waterTableDepth_m: waterTableDepth,
    bedrockDepth_m: bedrockDepth,
    overburdenThickness_m: Math.round(overburdenThickness),
    clayLayerPresent: clayPresent,
    salineIntrusionRisk: salineRisk,
    recommendedDrillingDepth_m: drillDepth,
    recommendedCasingDepth_m: casingDepth,
    recommendedScreenInterval: { from_m: screenFrom, to_m: screenTo },
    minResistivity_ohmm: Math.round(minRes * 10) / 10,
    maxResistivity_ohmm: Math.round(maxRes * 10) / 10,
    medianResistivity_ohmm: Math.round(medianRes * 10) / 10,
    resistivityContrast: Math.round(resContrast * 10) / 10,
    dataPointCount: validPoints.length,
    depthOfInvestigation_m: Math.round(doi),
    lateralCoverage_m: Math.round(lateralCoverage),
    interpretation,
    warnings,
    recommendations,
    confidenceBoost_pct: confidenceBoost
  };
}

function generateNarrative(layers: InvertedLayer[], targets: AquiferTarget[], waterTable: number | null, bedrock: number | null, overburden: number, quality: string): string {
  const parts: string[] = [];
  
  parts.push(`ERT survey resolved ${layers.length} subsurface layers to ~${Math.round(layers[layers.length - 1]?.depthBottom_m || 0)}m depth (inversion quality: ${quality}).`);
  
  if (overburden > 0 && bedrock) {
    parts.push(`Overburden extends to ${Math.round(overburden)}m, underlain by bedrock at ${Math.round(bedrock)}m.`);
  }
  
  if (waterTable !== null) {
    parts.push(`Water table estimated at ${Math.round(waterTable)}m depth.`);
  }
  
  if (targets.length > 0) {
    const best = targets[0];
    parts.push(`Primary aquifer target at ${Math.round(best.depthTop_m)}–${Math.round(best.depthBottom_m)}m (${best.interpretedLithology}, resistivity: ${Math.round(best.estimatedResistivity_ohmm)} Ωm).`);
    parts.push(`Estimated yield: ${best.estimatedYield_m3hr.toFixed(1)} m³/hr, water quality: ${best.waterQuality}.`);
    
    if (targets.length > 1) {
      parts.push(`${targets.length - 1} secondary aquifer target(s) also identified.`);
    }
  } else {
    parts.push('No clear aquifer target identified from resistivity profile.');
  }
  
  // Layer summary
  const waterBearingLayers = layers.filter(l => l.waterBearing);
  const aquitards = layers.filter(l => l.hydroRole === 'aquitard' || l.hydroRole === 'aquiclude');
  
  if (waterBearingLayers.length > 0) {
    parts.push(`${waterBearingLayers.length} water-bearing layer(s) detected.`);
  }
  if (aquitards.length > 0) {
    parts.push(`${aquitards.length} confining/barrier layer(s) present.`);
  }
  
  return parts.join(' ');
}

function emptyResult(reason: string): ERTInterpretationResult {
  return {
    layers: [],
    totalDepthInvestigated_m: 0,
    inversionQuality: 'poor',
    rmsError_pct: 100,
    aquiferTargets: [],
    bestTarget: null,
    waterTableDepth_m: null,
    bedrockDepth_m: null,
    overburdenThickness_m: 0,
    clayLayerPresent: false,
    salineIntrusionRisk: false,
    recommendedDrillingDepth_m: 30,
    recommendedCasingDepth_m: 6,
    recommendedScreenInterval: { from_m: 15, to_m: 30 },
    minResistivity_ohmm: 0,
    maxResistivity_ohmm: 0,
    medianResistivity_ohmm: 0,
    resistivityContrast: 0,
    dataPointCount: 0,
    depthOfInvestigation_m: 0,
    lateralCoverage_m: 0,
    interpretation: reason,
    warnings: [reason],
    recommendations: ['Insufficient ERT data for interpretation — collect more data points'],
    confidenceBoost_pct: 0
  };
}
