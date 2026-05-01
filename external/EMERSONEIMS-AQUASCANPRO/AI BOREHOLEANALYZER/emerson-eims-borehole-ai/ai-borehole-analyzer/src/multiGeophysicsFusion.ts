/* ═══════════════════════════════════════════════════════════════════════
   MULTI-GEOPHYSICS FUSION ENGINE
   ERT + EM/TDEM + Seismic → AI Fusion → Unified Subsurface Model
   ═══════════════════════════════════════════════════════════════════════ */

import type { FieldValidationData } from './types';

/* ── Types ─────────────────────────────────────────────────── */

export interface GeophysicalLayer {
  topDepth_m: number;
  bottomDepth_m: number;
  thickness_m: number;
  resistivity_ohmM?: number;
  conductivity_mS_m?: number;
  vpVelocity_ms?: number;
  vsVelocity_ms?: number;
  interpretation: string;
  lithology: string;
  waterBearing: boolean;
  confidence: number;
  dataSources: string[];
}

export interface AquiferZone {
  topDepth_m: number;
  bottomDepth_m: number;
  thickness_m: number;
  type: 'unconfined' | 'confined' | 'semi-confined' | 'fractured' | 'perched';
  estimatedTransmissivity_m2day: number;
  estimatedStorativity: number;
  estimatedYield_m3hr: number;
  confidence: number;
  supportingMethods: string[];
  resistivityRange_ohmM?: [number, number];
  velocityRange_ms?: [number, number];
}

export interface FusionResult {
  unifiedLayers: GeophysicalLayer[];
  aquiferZones: AquiferZone[];
  bedrockDepth_m: number;
  weatheredZoneThickness_m: number;
  waterTableDepth_m: number;
  fractureZones: { depth_m: number; thickness_m: number; confidence: number; method: string }[];
  overallConfidence: number;
  confidenceBoost: number;
  methodsUsed: string[];
  methodAgreement: number;   // 0-1 how much methods agree
  fusionQuality: 'excellent' | 'good' | 'moderate' | 'limited';
  diagnostics: string[];
  recommendedDrillingDepth_m: number;
  recommendedCasingDepth_m: number;
  expectedYield_m3hr: [number, number];
}

/* ── Resistivity interpretation tables ─────────────────────── */

interface ResistivityInterpretation {
  minOhmM: number;
  maxOhmM: number;
  lithology: string;
  waterBearing: boolean;
  aquiferType: string;
  porosity: [number, number];
  ksat_m_day: [number, number];
}

const RESISTIVITY_TABLE: ResistivityInterpretation[] = [
  { minOhmM: 0.5, maxOhmM: 5, lithology: 'clay (saturated)', waterBearing: false, aquiferType: 'aquitard', porosity: [0.4, 0.6], ksat_m_day: [0.0001, 0.01] },
  { minOhmM: 5, maxOhmM: 15, lithology: 'clayey sand / sandy clay', waterBearing: true, aquiferType: 'semi-confined', porosity: [0.25, 0.4], ksat_m_day: [0.01, 0.5] },
  { minOhmM: 15, maxOhmM: 40, lithology: 'saturated sand / gravel', waterBearing: true, aquiferType: 'unconfined', porosity: [0.2, 0.35], ksat_m_day: [1, 50] },
  { minOhmM: 40, maxOhmM: 100, lithology: 'moist sand / weathered rock', waterBearing: true, aquiferType: 'unconfined', porosity: [0.1, 0.25], ksat_m_day: [0.1, 10] },
  { minOhmM: 100, maxOhmM: 250, lithology: 'weathered/fractured bedrock', waterBearing: true, aquiferType: 'fractured', porosity: [0.05, 0.15], ksat_m_day: [0.01, 5] },
  { minOhmM: 250, maxOhmM: 600, lithology: 'slightly weathered rock', waterBearing: false, aquiferType: 'fractured_minor', porosity: [0.02, 0.08], ksat_m_day: [0.001, 0.1] },
  { minOhmM: 600, maxOhmM: 2000, lithology: 'fresh bedrock (dry)', waterBearing: false, aquiferType: 'basement', porosity: [0.005, 0.02], ksat_m_day: [0.00001, 0.001] },
  { minOhmM: 2000, maxOhmM: 100000, lithology: 'competent crystalline rock', waterBearing: false, aquiferType: 'impermeable', porosity: [0.001, 0.005], ksat_m_day: [0, 0.0001] },
];

/* ── Seismic velocity interpretation ──────────────────────── */

interface VelocityInterpretation {
  minVp_ms: number;
  maxVp_ms: number;
  lithology: string;
  weatheringState: string;
  bedrockIndicator: boolean;
}

const VELOCITY_TABLE: VelocityInterpretation[] = [
  { minVp_ms: 200, maxVp_ms: 600, lithology: 'topsoil / loose fill', weatheringState: 'completely_weathered', bedrockIndicator: false },
  { minVp_ms: 600, maxVp_ms: 1200, lithology: 'alluvium / soft clay', weatheringState: 'highly_weathered', bedrockIndicator: false },
  { minVp_ms: 1200, maxVp_ms: 2000, lithology: 'dense sand / stiff clay', weatheringState: 'moderately_weathered', bedrockIndicator: false },
  { minVp_ms: 2000, maxVp_ms: 3000, lithology: 'weathered rock / saprolite', weatheringState: 'slightly_weathered', bedrockIndicator: false },
  { minVp_ms: 3000, maxVp_ms: 4500, lithology: 'fractured bedrock', weatheringState: 'fresh_fractured', bedrockIndicator: true },
  { minVp_ms: 4500, maxVp_ms: 6500, lithology: 'competent bedrock', weatheringState: 'fresh', bedrockIndicator: true },
];

/* ── EM/TDEM conductivity interpretation ──────────────────── */

function interpretConductivity(sigma_mS_m: number): { lithology: string; waterBearing: boolean } {
  if (sigma_mS_m > 200) return { lithology: 'saline water / brine', waterBearing: true };
  if (sigma_mS_m > 100) return { lithology: 'clay / shale (wet)', waterBearing: false };
  if (sigma_mS_m > 50) return { lithology: 'saturated clayey sand', waterBearing: true };
  if (sigma_mS_m > 20) return { lithology: 'saturated sand / gravel', waterBearing: true };
  if (sigma_mS_m > 5) return { lithology: 'weathered rock (moist)', waterBearing: true };
  if (sigma_mS_m > 1) return { lithology: 'fractured bedrock', waterBearing: false };
  return { lithology: 'fresh crystalline rock', waterBearing: false };
}

/* ── ERT Layer Builder ────────────────────────────────────── */

function buildERTLayers(ert: NonNullable<FieldValidationData['ertSurvey']>, ertFile?: FieldValidationData['ertDataFile']): GeophysicalLayer[] {
  const layers: GeophysicalLayer[] = [];

  // If raw data file available, build pseudo-section layers
  if (ertFile && ertFile.apparentResistivities.length > 0) {
    // Group by n-level (pseudo-depth)
    const byLevel = new Map<number, number[]>();
    for (const dp of ertFile.apparentResistivities) {
      const arr = byLevel.get(dp.n) || [];
      arr.push(dp.rhoA);
      byLevel.set(dp.n, arr);
    }

    const sortedLevels = [...byLevel.keys()].sort((a, b) => a - b);
    let topDepth = 0;
    const spacing = ertFile.electrodeSpacing_m || 5;

    for (const n of sortedLevels) {
      const rhoValues = byLevel.get(n)!;
      const avgRho = rhoValues.reduce((s, v) => s + v, 0) / rhoValues.length;
      // Edwards (1977) depth factor: ~0.5 × n × spacing for Wenner
      const depthFactor = ertFile.arrayType === 'DipoleDipole' ? 0.195 : ertFile.arrayType === 'Schlumberger' ? 0.4 : 0.5;
      const bottomDepth = n * spacing * depthFactor;
      const interp = interpretResistivity(avgRho);

      layers.push({
        topDepth_m: topDepth,
        bottomDepth_m: bottomDepth,
        thickness_m: bottomDepth - topDepth,
        resistivity_ohmM: avgRho,
        interpretation: interp.lithology,
        lithology: interp.lithology,
        waterBearing: interp.waterBearing,
        confidence: 0.85,
        dataSources: ['ERT_raw_data'],
      });
      topDepth = bottomDepth;
    }
  } else {
    // Simple 3-layer model from survey summary
    const aqTop = ert.aquiferDepthM;
    const aqBottom = aqTop + ert.aquiferThicknessM;
    const rho = ert.resistivityOhmM;
    const interpAbove = interpretResistivity(rho * 3);
    const interpAq = interpretResistivity(rho);
    const interpBelow = interpretResistivity(rho * 8);

    layers.push(
      { topDepth_m: 0, bottomDepth_m: aqTop, thickness_m: aqTop, resistivity_ohmM: rho * 3, interpretation: interpAbove.lithology, lithology: interpAbove.lithology, waterBearing: false, confidence: 0.7, dataSources: ['ERT_survey'] },
      { topDepth_m: aqTop, bottomDepth_m: aqBottom, thickness_m: ert.aquiferThicknessM, resistivity_ohmM: rho, interpretation: interpAq.lithology, lithology: interpAq.lithology, waterBearing: true, confidence: 0.85, dataSources: ['ERT_survey'] },
      { topDepth_m: aqBottom, bottomDepth_m: aqBottom + 20, thickness_m: 20, resistivity_ohmM: rho * 8, interpretation: interpBelow.lithology, lithology: interpBelow.lithology, waterBearing: false, confidence: 0.6, dataSources: ['ERT_survey'] },
    );
  }

  return layers;
}

function interpretResistivity(rho: number): ResistivityInterpretation {
  for (const row of RESISTIVITY_TABLE) {
    if (rho >= row.minOhmM && rho < row.maxOhmM) return row;
  }
  return RESISTIVITY_TABLE[RESISTIVITY_TABLE.length - 1];
}

/* ── TDEM/EM Layer Builder ────────────────────────────────── */

function buildTDEMLayers(em: NonNullable<FieldValidationData['emTdemSurvey']>): GeophysicalLayer[] {
  const layers: GeophysicalLayer[] = [];
  const condTop = em.conductiveLayerTopM;
  const condBot = em.conductiveLayerBottomM;
  const sigma = em.conductivity_mS_m;

  // Overburden
  if (condTop > 0) {
    layers.push({
      topDepth_m: 0, bottomDepth_m: condTop, thickness_m: condTop,
      conductivity_mS_m: sigma * 0.2,
      interpretation: 'overburden (resistive)',
      lithology: 'dry overburden', waterBearing: false, confidence: 0.7,
      dataSources: [`TDEM_${em.method}`],
    });
  }

  // Conductive layer (potential aquifer)
  const condInterp = interpretConductivity(sigma);
  layers.push({
    topDepth_m: condTop, bottomDepth_m: condBot, thickness_m: condBot - condTop,
    conductivity_mS_m: sigma,
    resistivity_ohmM: 1000 / sigma,
    interpretation: condInterp.lithology,
    lithology: condInterp.lithology,
    waterBearing: em.interpretedAquifer || condInterp.waterBearing,
    confidence: 0.8,
    dataSources: [`TDEM_${em.method}`],
  });

  // Below conductive layer
  if (condBot < em.maxDepthM) {
    layers.push({
      topDepth_m: condBot, bottomDepth_m: em.maxDepthM, thickness_m: em.maxDepthM - condBot,
      conductivity_mS_m: sigma * 0.1,
      interpretation: 'resistive basement',
      lithology: 'bedrock', waterBearing: false, confidence: 0.6,
      dataSources: [`TDEM_${em.method}`],
    });
  }

  return layers;
}

/* ── Seismic Layer Builder ────────────────────────────────── */

function buildSeismicLayers(seis: NonNullable<FieldValidationData['seismicSurvey']>): GeophysicalLayer[] {
  const layers: GeophysicalLayer[] = [];

  // Weathered zone
  const wzThick = seis.weatheredZoneThicknessM;
  const wzInterp = VELOCITY_TABLE.find(v => seis.vpTopLayer_ms >= v.minVp_ms && seis.vpTopLayer_ms < v.maxVp_ms) || VELOCITY_TABLE[0];

  layers.push({
    topDepth_m: 0, bottomDepth_m: wzThick, thickness_m: wzThick,
    vpVelocity_ms: seis.vpTopLayer_ms,
    vsVelocity_ms: seis.vsTopLayer_ms,
    interpretation: wzInterp.lithology,
    lithology: wzInterp.lithology,
    waterBearing: seis.vpTopLayer_ms > 1400, // saturated when Vp > ~1400 m/s (water table)
    confidence: 0.85,
    dataSources: [`Seismic_${seis.method}`],
  });

  // Fracture zone (if detected)
  if (seis.fractureZoneDepthM != null && seis.fractureZoneThicknessM != null) {
    const fzTop = seis.fractureZoneDepthM;
    const fzThick = seis.fractureZoneThicknessM;
    // Transition layer between weathered and fracture
    if (fzTop > wzThick) {
      layers.push({
        topDepth_m: wzThick, bottomDepth_m: fzTop, thickness_m: fzTop - wzThick,
        vpVelocity_ms: (seis.vpTopLayer_ms + seis.vpBedrock_ms) / 2,
        interpretation: 'partially weathered rock',
        lithology: 'saprolite', waterBearing: false, confidence: 0.7,
        dataSources: [`Seismic_${seis.method}`],
      });
    }
    layers.push({
      topDepth_m: fzTop, bottomDepth_m: fzTop + fzThick, thickness_m: fzThick,
      vpVelocity_ms: seis.vpBedrock_ms * 0.7, // fractured = lower velocity
      interpretation: 'fractured bedrock (potential aquifer)',
      lithology: 'fractured rock',
      waterBearing: true,
      confidence: 0.8,
      dataSources: [`Seismic_${seis.method}`],
    });
  }

  // Bedrock
  const bedrockInterp = VELOCITY_TABLE.find(v => seis.vpBedrock_ms >= v.minVp_ms && seis.vpBedrock_ms < v.maxVp_ms) || VELOCITY_TABLE[VELOCITY_TABLE.length - 1];
  const bedrockTop = seis.fractureZoneDepthM != null && seis.fractureZoneThicknessM != null
    ? seis.fractureZoneDepthM + seis.fractureZoneThicknessM
    : seis.bedrockDepthM;

  layers.push({
    topDepth_m: bedrockTop, bottomDepth_m: bedrockTop + 30, thickness_m: 30,
    vpVelocity_ms: seis.vpBedrock_ms,
    vsVelocity_ms: seis.vsBedrock_ms,
    interpretation: bedrockInterp.lithology,
    lithology: bedrockInterp.lithology,
    waterBearing: false,
    confidence: 0.85,
    dataSources: [`Seismic_${seis.method}`],
  });

  return layers;
}

/* ── Layer Fusion (Dempster-Shafer inspired) ──────────────── */

function fuseLayers(allLayers: GeophysicalLayer[][]): GeophysicalLayer[] {
  if (allLayers.length === 0) return [];
  if (allLayers.length === 1) return allLayers[0];

  // Build depth grid: collect all unique depth boundaries
  const depthSet = new Set<number>();
  for (const stack of allLayers) {
    for (const l of stack) {
      depthSet.add(Math.round(l.topDepth_m * 10) / 10);
      depthSet.add(Math.round(l.bottomDepth_m * 10) / 10);
    }
  }
  const depths = [...depthSet].sort((a, b) => a - b);

  const fused: GeophysicalLayer[] = [];

  for (let i = 0; i < depths.length - 1; i++) {
    const top = depths[i];
    const bot = depths[i + 1];
    if (bot - top < 0.1) continue; // skip negligible thickness

    // Find overlapping layers from each method
    const overlapping: GeophysicalLayer[] = [];
    for (const stack of allLayers) {
      for (const l of stack) {
        if (l.topDepth_m <= top + 0.5 && l.bottomDepth_m >= bot - 0.5) {
          overlapping.push(l);
        }
      }
    }

    if (overlapping.length === 0) continue;

    // Weighted consensus
    let totalWeight = 0;
    let waterVotes = 0;
    let totalWaterWeight = 0;
    const resistivities: number[] = [];
    const velocities: number[] = [];
    const conductivities: number[] = [];
    const sources: string[] = [];
    const lithologies: Map<string, number> = new Map();

    for (const ol of overlapping) {
      const w = ol.confidence;
      totalWeight += w;
      if (ol.waterBearing) { waterVotes++; totalWaterWeight += w; }
      if (ol.resistivity_ohmM) resistivities.push(ol.resistivity_ohmM);
      if (ol.vpVelocity_ms) velocities.push(ol.vpVelocity_ms);
      if (ol.conductivity_mS_m) conductivities.push(ol.conductivity_mS_m);
      sources.push(...ol.dataSources);
      lithologies.set(ol.lithology, (lithologies.get(ol.lithology) || 0) + w);
    }

    // Most-voted lithology
    let bestLith = overlapping[0].lithology;
    let bestLithW = 0;
    for (const [lith, w] of lithologies) {
      if (w > bestLithW) { bestLith = lith; bestLithW = w; }
    }

    // Water bearing: weighted vote
    const isWater = totalWaterWeight / totalWeight > 0.45;

    // Confidence: increases with more agreeing methods
    const uniqueSources = [...new Set(sources)];
    const methodCount = uniqueSources.length;
    const agreement = overlapping.filter(o => o.waterBearing === isWater).length / overlapping.length;
    const fusedConf = Math.min(0.98, (totalWeight / overlapping.length) * (0.7 + 0.3 * agreement) * (1 + 0.1 * (methodCount - 1)));

    fused.push({
      topDepth_m: top,
      bottomDepth_m: bot,
      thickness_m: bot - top,
      resistivity_ohmM: resistivities.length > 0 ? resistivities.reduce((a, b) => a + b) / resistivities.length : undefined,
      conductivity_mS_m: conductivities.length > 0 ? conductivities.reduce((a, b) => a + b) / conductivities.length : undefined,
      vpVelocity_ms: velocities.length > 0 ? velocities.reduce((a, b) => a + b) / velocities.length : undefined,
      interpretation: bestLith + (isWater ? ' (water-bearing)' : ''),
      lithology: bestLith,
      waterBearing: isWater,
      confidence: fusedConf,
      dataSources: uniqueSources,
    });
  }

  // Merge adjacent layers with same lithology
  const merged: GeophysicalLayer[] = [];
  for (const layer of fused) {
    const prev = merged[merged.length - 1];
    if (prev && prev.lithology === layer.lithology && prev.waterBearing === layer.waterBearing) {
      prev.bottomDepth_m = layer.bottomDepth_m;
      prev.thickness_m = prev.bottomDepth_m - prev.topDepth_m;
      prev.confidence = Math.max(prev.confidence, layer.confidence);
      prev.dataSources = [...new Set([...prev.dataSources, ...layer.dataSources])];
    } else {
      merged.push({ ...layer });
    }
  }

  return merged;
}

/* ── Aquifer Zone Extraction ──────────────────────────────── */

function extractAquiferZones(layers: GeophysicalLayer[]): AquiferZone[] {
  const zones: AquiferZone[] = [];

  for (const layer of layers) {
    if (!layer.waterBearing) continue;

    const rho = layer.resistivity_ohmM;
    const interp = rho ? interpretResistivity(rho) : null;

    let aqType: AquiferZone['type'] = 'unconfined';
    if (layer.lithology.includes('fractured')) aqType = 'fractured';
    else if (layer.topDepth_m > 30 && layers.some(l => l.bottomDepth_m <= layer.topDepth_m && !l.waterBearing && l.lithology.includes('clay'))) aqType = 'confined';
    else if (layer.topDepth_m > 10) aqType = 'semi-confined';

    const porosity = interp ? (interp.porosity[0] + interp.porosity[1]) / 2 : 0.15;
    const ksat = interp ? (interp.ksat_m_day[0] + interp.ksat_m_day[1]) / 2 : 1;
    const T = ksat * layer.thickness_m;
    const S = aqType === 'confined' ? 0.0003 : porosity * 0.1;

    // Yield estimate: Q ≈ T × i × A / t (simplified), or specific capacity approach
    // Cooper-Jacob: Q = 4πT×s / W(u) ≈ for 5m drawdown
    const drawdown = 5;
    const yieldM3day = 2 * Math.PI * T * drawdown / Math.log(500 / 0.1); // Thiem steady-state
    const yieldM3hr = yieldM3day / 24;

    zones.push({
      topDepth_m: layer.topDepth_m,
      bottomDepth_m: layer.bottomDepth_m,
      thickness_m: layer.thickness_m,
      type: aqType,
      estimatedTransmissivity_m2day: T,
      estimatedStorativity: S,
      estimatedYield_m3hr: Math.max(0.1, yieldM3hr),
      confidence: layer.confidence,
      supportingMethods: layer.dataSources,
      resistivityRange_ohmM: rho ? [rho * 0.7, rho * 1.3] : undefined,
      velocityRange_ms: layer.vpVelocity_ms ? [layer.vpVelocity_ms * 0.9, layer.vpVelocity_ms * 1.1] : undefined,
    });
  }

  return zones;
}

/* ── Main Fusion Function ─────────────────────────────────── */

export function runMultiGeophysicsFusion(fieldData: FieldValidationData): FusionResult | null {
  const allLayerSets: GeophysicalLayer[][] = [];
  const methodsUsed: string[] = [];
  const diagnostics: string[] = [];

  // 1. ERT layers
  if (fieldData.ertSurvey) {
    const ertLayers = buildERTLayers(fieldData.ertSurvey, fieldData.ertDataFile);
    allLayerSets.push(ertLayers);
    methodsUsed.push('ERT');
    diagnostics.push(`ERT: ${ertLayers.length} layers, aquifer at ${fieldData.ertSurvey.aquiferDepthM}m, ρ=${fieldData.ertSurvey.resistivityOhmM} Ωm`);
  }

  // 2. EM/TDEM layers
  if (fieldData.emTdemSurvey) {
    const tdemLayers = buildTDEMLayers(fieldData.emTdemSurvey);
    allLayerSets.push(tdemLayers);
    methodsUsed.push(`TDEM (${fieldData.emTdemSurvey.method})`);
    diagnostics.push(`TDEM: ${tdemLayers.length} layers, conductive zone ${fieldData.emTdemSurvey.conductiveLayerTopM}-${fieldData.emTdemSurvey.conductiveLayerBottomM}m, σ=${fieldData.emTdemSurvey.conductivity_mS_m} mS/m`);
  }

  // 3. Seismic layers
  if (fieldData.seismicSurvey) {
    const seisLayers = buildSeismicLayers(fieldData.seismicSurvey);
    allLayerSets.push(seisLayers);
    methodsUsed.push(`Seismic (${fieldData.seismicSurvey.method})`);
    diagnostics.push(`Seismic: bedrock at ${fieldData.seismicSurvey.bedrockDepthM}m, Vp=${fieldData.seismicSurvey.vpBedrock_ms} m/s`);
  }

  // 4. GPR shallow layers
  if (fieldData.gprSurvey) {
    const gprLayers: GeophysicalLayer[] = [];
    if (fieldData.gprSurvey.clayLayerDepthM) {
      gprLayers.push({
        topDepth_m: 0, bottomDepth_m: fieldData.gprSurvey.clayLayerDepthM,
        thickness_m: fieldData.gprSurvey.clayLayerDepthM,
        interpretation: 'clay layer (GPR reflector)',
        lithology: 'clay', waterBearing: false, confidence: 0.75,
        dataSources: ['GPR'],
      });
    }
    if (fieldData.gprSurvey.waterTableDepthM) {
      gprLayers.push({
        topDepth_m: fieldData.gprSurvey.waterTableDepthM,
        bottomDepth_m: fieldData.gprSurvey.waterTableDepthM + 5,
        thickness_m: 5,
        interpretation: 'water table zone (GPR)',
        lithology: 'saturated zone', waterBearing: true, confidence: 0.7,
        dataSources: ['GPR'],
      });
    }
    if (gprLayers.length > 0) {
      allLayerSets.push(gprLayers);
      methodsUsed.push('GPR');
      diagnostics.push(`GPR: water table at ${fieldData.gprSurvey.waterTableDepthM ?? '?'}m, max penetration ${fieldData.gprSurvey.maxPenetrationM}m`);
    }
  }

  // 5. NMR direct water detection
  if (fieldData.nmrSurvey) {
    const nmrLayers: GeophysicalLayer[] = [{
      topDepth_m: fieldData.nmrSurvey.freeWaterDepthM,
      bottomDepth_m: fieldData.nmrSurvey.freeWaterDepthM + fieldData.nmrSurvey.freeWaterThicknessM,
      thickness_m: fieldData.nmrSurvey.freeWaterThicknessM,
      interpretation: `free water (${fieldData.nmrSurvey.waterContentPercent}% water content)`,
      lithology: 'saturated aquifer (NMR confirmed)',
      waterBearing: true,
      confidence: 0.95, // NMR is the gold standard for water detection
      dataSources: ['NMR'],
    }];
    allLayerSets.push(nmrLayers);
    methodsUsed.push('NMR/MRS');
    diagnostics.push(`NMR: ${fieldData.nmrSurvey.waterContentPercent}% water at ${fieldData.nmrSurvey.freeWaterDepthM}m, K=${fieldData.nmrSurvey.hydraulicConductivity_m_day ?? '?'} m/day`);
  }

  // 6. Magnetic/Gravity structural
  if (fieldData.magneticGravitySurvey) {
    const mg = fieldData.magneticGravitySurvey;
    if (mg.basementDepthM) {
      allLayerSets.push([{
        topDepth_m: mg.basementDepthM, bottomDepth_m: mg.basementDepthM + 50,
        thickness_m: 50,
        interpretation: `basement (gravity-derived, Bouguer=${mg.bouguerAnomaly_mGal ?? '?'} mGal)`,
        lithology: 'crystalline basement',
        waterBearing: false, confidence: 0.7,
        dataSources: ['Magnetic/Gravity'],
      }]);
      methodsUsed.push('Magnetic/Gravity');
      diagnostics.push(`Gravity: basement at ${mg.basementDepthM}m, fault=${mg.faultLineDetected}`);
    }
  }

  if (allLayerSets.length === 0) return null;

  // Fuse all methods
  const unifiedLayers = fuseLayers(allLayerSets);
  const aquiferZones = extractAquiferZones(unifiedLayers);

  // Bedrock depth: deepest non-water-bearing layer top, or seismic bedrock
  const bedrockDepth = fieldData.seismicSurvey?.bedrockDepthM
    ?? unifiedLayers.filter(l => !l.waterBearing && l.topDepth_m > 5).map(l => l.topDepth_m).pop()
    ?? 30;

  // Water table: shallowest water-bearing layer top
  const waterTable = unifiedLayers.find(l => l.waterBearing)?.topDepth_m ?? 10;

  // Weathered zone: from surface to bedrock
  const weatheredThickness = Math.min(bedrockDepth, fieldData.seismicSurvey?.weatheredZoneThicknessM ?? bedrockDepth);

  // Fracture zones
  const fractureZones: FusionResult['fractureZones'] = [];
  if (fieldData.seismicSurvey?.fractureZoneDepthM != null) {
    fractureZones.push({
      depth_m: fieldData.seismicSurvey.fractureZoneDepthM,
      thickness_m: fieldData.seismicSurvey.fractureZoneThicknessM ?? 5,
      confidence: 0.85,
      method: 'Seismic',
    });
  }
  if (fieldData.magneticGravitySurvey?.faultLineDetected) {
    fractureZones.push({
      depth_m: fieldData.magneticGravitySurvey.basementDepthM ?? bedrockDepth,
      thickness_m: 10,
      confidence: 0.7,
      method: 'Magnetic',
    });
  }

  // Method agreement
  const methodCount = methodsUsed.length;
  const waterBearingLayers = unifiedLayers.filter(l => l.waterBearing);
  const avgAqConf = waterBearingLayers.length > 0
    ? waterBearingLayers.reduce((s, l) => s + l.confidence, 0) / waterBearingLayers.length
    : 0.5;

  // Confidence boost from multi-method fusion
  const baseConfBoost = methodCount === 1 ? 0.08
    : methodCount === 2 ? 0.15
    : methodCount === 3 ? 0.22
    : methodCount === 4 ? 0.28
    : 0.32;

  const methodAgreement = avgAqConf;
  const overallConfidence = Math.min(0.98, 0.6 + baseConfBoost + methodAgreement * 0.15);

  const fusionQuality: FusionResult['fusionQuality'] =
    methodCount >= 3 && methodAgreement > 0.7 ? 'excellent'
    : methodCount >= 2 && methodAgreement > 0.6 ? 'good'
    : methodCount >= 2 ? 'moderate'
    : 'limited';

  // Recommended drilling depth: target deepest aquifer bottom + 5m safety
  const deepestAquifer = aquiferZones.length > 0
    ? Math.max(...aquiferZones.map(z => z.bottomDepth_m))
    : bedrockDepth;
  const recommendedDrillingDepth = deepestAquifer + 5;

  // Casing depth: above aquifer zone (through overburden + weathered zone)
  const shallowestAquifer = aquiferZones.length > 0
    ? Math.min(...aquiferZones.map(z => z.topDepth_m))
    : waterTable;
  const recommendedCasing = Math.max(6, shallowestAquifer - 2);

  // Expected yield: sum of all aquifer zone yields
  const totalYield = aquiferZones.reduce((s, z) => s + z.estimatedYield_m3hr, 0);
  const expectedYield: [number, number] = [totalYield * 0.5, totalYield * 1.5];

  return {
    unifiedLayers,
    aquiferZones,
    bedrockDepth_m: bedrockDepth,
    weatheredZoneThickness_m: weatheredThickness,
    waterTableDepth_m: waterTable,
    fractureZones,
    overallConfidence,
    confidenceBoost: baseConfBoost,
    methodsUsed,
    methodAgreement,
    fusionQuality,
    diagnostics,
    recommendedDrillingDepth_m: recommendedDrillingDepth,
    recommendedCasingDepth_m: recommendedCasing,
    expectedYield_m3hr: expectedYield,
  };
}
