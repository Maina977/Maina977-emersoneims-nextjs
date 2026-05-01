/**
 * DIGITAL SUBSURFACE TWIN
 * 
 * Creates a physics-informed, multi-source subsurface model that predicts:
 * 1. Lithological layers (soil → weathered rock → fractured zone → fresh rock)
 * 2. Hydrogeological properties per layer (K, porosity, storativity)
 * 3. Aquifer geometry (depth, thickness, lateral extent)
 * 4. Drilling prognosis (expected formations at each depth interval)
 * 
 * Fuses: Remote sensing + Geological maps + Geophysical surveys + Nearby boreholes
 * Output: Layered subsurface model with uncertainty bounds
 * 
 * This replaces the old desktop-only extrapolation with a proper
 * Bayesian layered earth model that updates with each data source.
 */

import type { FieldValidationData } from './types';

/* ─── Subsurface Layer ─── */
export interface SubsurfaceLayer {
  topDepthM: number;
  bottomDepthM: number;
  thicknessM: number;
  lithology: string;
  lithologyCode: 'soil' | 'alluvium' | 'weathered' | 'fractured' | 'fresh_rock' | 'clay' | 'sand' | 'gravel' | 'limestone' | 'sandstone' | 'shale' | 'granite' | 'basalt' | 'gneiss' | 'schist';
  porosity: number;              // 0-1
  hydraulicConductivity_m_day: number;
  storativity: number;
  isAquifer: boolean;
  waterBearing: boolean;
  confidence: number;            // 0-1
  dataSourcesUsed: string[];
}

/* ─── Complete Subsurface Twin Model ─── */
export interface SubsurfaceTwinModel {
  layers: SubsurfaceLayer[];
  totalDepthM: number;
  primaryAquiferIndex: number;   // index into layers[]
  estimatedYield_m3hr: number;
  estimatedWaterLevel_m: number;
  drillingPrognosis: DrillingPrognosis[];
  modelConfidence: number;       // 0-1
  dataSourceCount: number;
  methodology: string;
  uncertaintyBounds: {
    depthRange_m: [number, number];
    yieldRange_m3hr: [number, number];
    waterLevelRange_m: [number, number];
  };
}

export interface DrillingPrognosis {
  depthFrom_m: number;
  depthTo_m: number;
  expectedFormation: string;
  drillingDifficulty: 'easy' | 'moderate' | 'hard' | 'very_hard';
  expectedPenetrationRate_m_hr: number;
  notes: string;
}

/* ─── Input data from all sources ─── */
interface TwinInputData {
  lat: number;
  lon: number;
  rockType?: string;
  weatheringDepthM?: number;
  slopePercent?: number;
  elevationM?: number;
  soilType?: string;
  rechargeEstimate_mm_yr?: number;
  fieldData?: FieldValidationData;
  nearbyBoreholes?: { depth_m: number; yield_m3hr: number; waterLevel_m: number; litholog?: string }[];
  graceTrend_cm_yr?: number;
}

/* ─── Default rock properties (Freeze & Cherry, 1979; Domenico & Schwartz, 1990) ─── */
const ROCK_PROPERTIES: Record<string, { porosity: number; K_m_day: number; storativity: number }> = {
  soil:       { porosity: 0.45, K_m_day: 1.0,    storativity: 0.15 },
  alluvium:   { porosity: 0.35, K_m_day: 10.0,   storativity: 0.12 },
  weathered:  { porosity: 0.25, K_m_day: 0.5,    storativity: 0.05 },
  fractured:  { porosity: 0.10, K_m_day: 5.0,    storativity: 0.02 },
  fresh_rock: { porosity: 0.02, K_m_day: 0.001,  storativity: 0.001 },
  clay:       { porosity: 0.50, K_m_day: 0.0001, storativity: 0.20 },
  sand:       { porosity: 0.30, K_m_day: 15.0,   storativity: 0.10 },
  gravel:     { porosity: 0.25, K_m_day: 100.0,  storativity: 0.08 },
  limestone:  { porosity: 0.15, K_m_day: 1.0,    storativity: 0.03 },
  sandstone:  { porosity: 0.20, K_m_day: 3.0,    storativity: 0.05 },
  shale:      { porosity: 0.10, K_m_day: 0.0001, storativity: 0.01 },
  granite:    { porosity: 0.02, K_m_day: 0.001,  storativity: 0.001 },
  basalt:     { porosity: 0.05, K_m_day: 0.01,   storativity: 0.005 },
  gneiss:     { porosity: 0.03, K_m_day: 0.005,  storativity: 0.002 },
  schist:     { porosity: 0.04, K_m_day: 0.01,   storativity: 0.003 },
};

/**
 * Build a Digital Subsurface Twin from all available data sources.
 */
export function buildSubsurfaceTwin(input: TwinInputData): SubsurfaceTwinModel {
  const sources: string[] = [];
  const layers: SubsurfaceLayer[] = [];

  // Step 1: Build initial layered model from rock classification
  const baseModel = buildBaseLayerModel(input);
  layers.push(...baseModel.layers);
  sources.push('Rock classification');

  // Step 2: Constrain with field geophysics data
  if (input.fieldData) {
    constrainWithFieldData(layers, input.fieldData, sources);
  }

  // Step 3: Update with nearby borehole data (empirical Bayesian update)
  if (input.nearbyBoreholes && input.nearbyBoreholes.length > 0) {
    constrainWithBoreholes(layers, input.nearbyBoreholes, sources);
  }

  // Step 4: Identify primary aquifer
  const aquiferIdx = layers.findIndex(l => l.isAquifer && l.waterBearing);
  const primaryAquifer = aquiferIdx >= 0 ? layers[aquiferIdx] : layers.find(l => l.hydraulicConductivity_m_day > 0.1) || layers[Math.floor(layers.length / 2)];
  const primaryIdx = aquiferIdx >= 0 ? aquiferIdx : layers.indexOf(primaryAquifer);

  // Step 5: Estimate yield using Dupuit-Thiem (simplified)
  const T = primaryAquifer.hydraulicConductivity_m_day * primaryAquifer.thicknessM; // transmissivity
  const estimatedYield = estimateYieldFromT(T);

  // Step 6: Estimate water level
  const waterLevel = estimateWaterLevel(layers, input);

  // Step 7: Generate drilling prognosis
  const prognosis = generateDrillingPrognosis(layers);

  // Step 8: Calculate model confidence
  const modelConf = calculateModelConfidence(sources, input);

  // Step 9: Uncertainty bounds
  const depthCenter = primaryAquifer.topDepthM + primaryAquifer.thicknessM / 2;
  const uncFactor = 1 - modelConf;

  return {
    layers,
    totalDepthM: layers[layers.length - 1].bottomDepthM,
    primaryAquiferIndex: primaryIdx,
    estimatedYield_m3hr: Math.round(estimatedYield * 100) / 100,
    estimatedWaterLevel_m: Math.round(waterLevel * 10) / 10,
    drillingPrognosis: prognosis,
    modelConfidence: Math.round(modelConf * 100) / 100,
    dataSourceCount: sources.length,
    methodology: 'Bayesian layered earth model with empirical property tables (Freeze & Cherry 1979). Updated with field geophysics and nearby borehole data. Yield from Dupuit-Thiem approximation.',
    uncertaintyBounds: {
      depthRange_m: [
        Math.max(0, Math.round(depthCenter * (1 - uncFactor * 0.3))),
        Math.round(depthCenter * (1 + uncFactor * 0.3)),
      ],
      yieldRange_m3hr: [
        Math.round(estimatedYield * (1 - uncFactor * 0.5) * 100) / 100,
        Math.round(estimatedYield * (1 + uncFactor * 0.5) * 100) / 100,
      ],
      waterLevelRange_m: [
        Math.round(waterLevel * (1 - uncFactor * 0.2) * 10) / 10,
        Math.round(waterLevel * (1 + uncFactor * 0.2) * 10) / 10,
      ],
    },
  };
}

/* ─── Step 1: Base layer model from rock type ─── */
function buildBaseLayerModel(input: TwinInputData): { layers: SubsurfaceLayer[] } {
  const rock = (input.rockType ?? 'granite').toLowerCase();
  const weatheringDepth = input.weatheringDepthM ?? estimateWeatheringDepth(rock, input.lat);
  const layers: SubsurfaceLayer[] = [];

  // Layer 1: Soil/overburden
  const soilDepth = Math.min(weatheringDepth * 0.2, 5);
  layers.push(makeLayer(0, soilDepth, input.soilType ?? 'soil', 'soil', ['Rock classification']));

  // Layer 2: Weathered zone
  if (weatheringDepth > soilDepth) {
    layers.push(makeLayer(soilDepth, weatheringDepth, `Weathered ${rock}`, 'weathered', ['Rock classification']));
  }

  // Layer 3: Fractured zone (typically 1/3 of weathering depth below weathered zone)
  const fractureThickness = Math.max(5, weatheringDepth * 0.3);
  const fractureBottom = weatheringDepth + fractureThickness;
  layers.push(makeLayer(weatheringDepth, fractureBottom, `Fractured ${rock}`, 'fractured', ['Rock classification']));

  // Layer 4: Fresh rock (extends to arbitrary depth)
  const totalDepth = fractureBottom + 30;
  layers.push(makeLayer(fractureBottom, totalDepth, `Fresh ${rock}`, 'fresh_rock', ['Rock classification']));

  // Mark aquifer — fractured zone in crystalline, weathered zone in sedimentary
  const isSedimentary = ['sandstone', 'limestone', 'shale', 'alluvium', 'sand', 'gravel'].some(s => rock.includes(s));
  if (isSedimentary) {
    // In sedimentary terrain, weathered zone is primary aquifer
    const weatheredLayer = layers.find(l => l.lithologyCode === 'weathered' || l.lithologyCode === 'sandstone');
    if (weatheredLayer) {
      weatheredLayer.isAquifer = true;
      weatheredLayer.waterBearing = true;
    }
  } else {
    // In crystalline terrain, fractured zone is primary aquifer
    const fracturedLayer = layers.find(l => l.lithologyCode === 'fractured');
    if (fracturedLayer) {
      fracturedLayer.isAquifer = true;
      fracturedLayer.waterBearing = true;
    }
  }

  return { layers };
}

function makeLayer(top: number, bottom: number, lithology: string, code: SubsurfaceLayer['lithologyCode'], dataSources: string[]): SubsurfaceLayer {
  const props = ROCK_PROPERTIES[code] ?? ROCK_PROPERTIES.weathered;
  return {
    topDepthM: Math.round(top * 10) / 10,
    bottomDepthM: Math.round(bottom * 10) / 10,
    thicknessM: Math.round((bottom - top) * 10) / 10,
    lithology,
    lithologyCode: code,
    porosity: props.porosity,
    hydraulicConductivity_m_day: props.K_m_day,
    storativity: props.storativity,
    isAquifer: false,
    waterBearing: false,
    confidence: 0.4, // Base desktop-only confidence
    dataSourcesUsed: [...dataSources],
  };
}

/* ─── Step 2: Constrain with field geophysics ─── */
function constrainWithFieldData(layers: SubsurfaceLayer[], fd: FieldValidationData, sources: string[]) {
  // ERT → depth to aquifer and rock type from resistivity
  if (fd.ertSurvey) {
    const ert = fd.ertSurvey;
    adjustLayerBoundary(layers, ert.aquiferDepthM, ert.aquiferDepthM + ert.aquiferThicknessM, true);
    layers.forEach(l => {
      if (l.isAquifer) {
        l.confidence = Math.min(0.85, l.confidence + 0.25);
        l.dataSourcesUsed.push('ERT survey');
      }
    });
    sources.push('ERT survey');
  }

  // EM/TDEM → conductive layer = potential aquifer
  if (fd.emTdemSurvey) {
    const em = fd.emTdemSurvey;
    if (em.interpretedAquifer) {
      adjustLayerBoundary(layers, em.conductiveLayerTopM, em.conductiveLayerBottomM, true);
    }
    layers.forEach(l => { if (l.isAquifer) { l.confidence = Math.min(0.85, l.confidence + 0.2); l.dataSourcesUsed.push('EM/TDEM'); } });
    sources.push('EM/TDEM survey');
  }

  // Seismic → bedrock depth, weathering thickness
  if (fd.seismicSurvey) {
    const ss = fd.seismicSurvey;
    // Update weathered zone boundary
    const weatheredLayer = layers.find(l => l.lithologyCode === 'weathered');
    if (weatheredLayer) {
      weatheredLayer.bottomDepthM = ss.bedrockDepthM;
      weatheredLayer.thicknessM = weatheredLayer.bottomDepthM - weatheredLayer.topDepthM;
      weatheredLayer.confidence = Math.min(0.9, weatheredLayer.confidence + 0.3);
      weatheredLayer.dataSourcesUsed.push('Seismic refraction');
    }
    // Fracture zone from seismic
    if (ss.fractureZoneDepthM != null) {
      const fracLayer = layers.find(l => l.lithologyCode === 'fractured');
      if (fracLayer) {
        fracLayer.topDepthM = ss.fractureZoneDepthM;
        fracLayer.bottomDepthM = ss.fractureZoneDepthM + (ss.fractureZoneThicknessM ?? 10);
        fracLayer.thicknessM = fracLayer.bottomDepthM - fracLayer.topDepthM;
        fracLayer.isAquifer = true;
        fracLayer.waterBearing = true;
        fracLayer.confidence = Math.min(0.9, fracLayer.confidence + 0.35);
        fracLayer.dataSourcesUsed.push('Seismic fracture detection');
      }
    }
    sources.push('Seismic survey');
  }

  // GPR → shallow features
  if (fd.gprSurvey) {
    const gpr = fd.gprSurvey;
    if (gpr.waterTableDepthM != null) {
      // Water table constrains which layers are water-bearing
      layers.forEach(l => {
        if (l.topDepthM >= gpr.waterTableDepthM!) {
          l.waterBearing = true;
        }
        l.confidence = Math.min(0.85, l.confidence + 0.1);
      });
    }
    if (gpr.clayLayerDepthM != null) {
      // Insert clay layer if detected
      insertLayer(layers, gpr.clayLayerDepthM, gpr.clayLayerDepthM + 3, 'Clay confining layer', 'clay', ['GPR']);
    }
    sources.push('GPR survey');
  }

  // Magnetic/Gravity → structural features
  if (fd.magneticGravitySurvey) {
    const mg = fd.magneticGravitySurvey;
    if (mg.basementDepthM != null) {
      const freshRock = layers.find(l => l.lithologyCode === 'fresh_rock');
      if (freshRock) {
        freshRock.topDepthM = mg.basementDepthM;
        freshRock.thicknessM = freshRock.bottomDepthM - freshRock.topDepthM;
        freshRock.confidence = Math.min(0.85, freshRock.confidence + 0.2);
        freshRock.dataSourcesUsed.push('Gravity basement mapping');
      }
    }
    if (mg.faultLineDetected) {
      // Faults increase fracture permeability
      const fracLayer = layers.find(l => l.lithologyCode === 'fractured');
      if (fracLayer) {
        fracLayer.hydraulicConductivity_m_day *= 5; // Fault zone K boost
        fracLayer.porosity = Math.min(0.25, fracLayer.porosity * 1.5);
        fracLayer.isAquifer = true;
        fracLayer.waterBearing = true;
        fracLayer.dataSourcesUsed.push('Magnetic fault detection');
      }
    }
    sources.push('Magnetic/Gravity survey');
  }

  // NMR → direct water detection (overrides everything)
  if (fd.nmrSurvey) {
    const nmr = fd.nmrSurvey;
    adjustLayerBoundary(layers, nmr.freeWaterDepthM, nmr.freeWaterDepthM + nmr.freeWaterThicknessM, true);
    const aquiferLayer = layers.find(l => l.isAquifer);
    if (aquiferLayer) {
      aquiferLayer.porosity = (nmr.porosityPercent ?? aquiferLayer.porosity * 100) / 100;
      if (nmr.hydraulicConductivity_m_day != null) {
        aquiferLayer.hydraulicConductivity_m_day = nmr.hydraulicConductivity_m_day;
      }
      aquiferLayer.confidence = Math.min(0.95, aquiferLayer.confidence + 0.40);
      aquiferLayer.dataSourcesUsed.push('NMR direct detection');
    }
    sources.push('NMR survey (direct water detection)');
  }

  // Pump test → direct aquifer parameters
  if (fd.pumpTest) {
    const pt = fd.pumpTest;
    const aquiferLayer = layers.find(l => l.isAquifer);
    if (aquiferLayer) {
      // T = K × b → K = T / b
      aquiferLayer.hydraulicConductivity_m_day = pt.transmissivityM2Day / aquiferLayer.thicknessM;
      aquiferLayer.storativity = pt.storativity;
      aquiferLayer.confidence = Math.min(0.95, aquiferLayer.confidence + 0.35);
      aquiferLayer.dataSourcesUsed.push('Pump test');
    }
    sources.push('Pump test');
  }
}

/* ─── Step 3: Nearby borehole constraint ─── */
function constrainWithBoreholes(layers: SubsurfaceLayer[], boreholes: { depth_m: number; yield_m3hr: number; waterLevel_m: number }[], sources: string[]) {
  const avgDepth = boreholes.reduce((s, b) => s + b.depth_m, 0) / boreholes.length;
  const avgYield = boreholes.reduce((s, b) => s + b.yield_m3hr, 0) / boreholes.length;

  // Use nearby borehole depth to validate model
  const aquiferLayer = layers.find(l => l.isAquifer);
  if (aquiferLayer) {
    // Bayesian-like weighted average: 70% model, 30% nearby data
    const modelCenter = aquiferLayer.topDepthM + aquiferLayer.thicknessM / 2;
    const blended = modelCenter * 0.7 + avgDepth * 0.3;
    const halfThickness = aquiferLayer.thicknessM / 2;
    aquiferLayer.topDepthM = Math.round((blended - halfThickness) * 10) / 10;
    aquiferLayer.bottomDepthM = Math.round((blended + halfThickness) * 10) / 10;
    aquiferLayer.confidence = Math.min(0.9, aquiferLayer.confidence + 0.15);
    aquiferLayer.dataSourcesUsed.push(`${boreholes.length} nearby boreholes`);
  }

  sources.push(`${boreholes.length} nearby boreholes (avg depth ${avgDepth.toFixed(0)}m, avg yield ${avgYield.toFixed(1)} m³/hr)`);
}

/* ─── Helper: Adjust layer boundary to match aquifer ─── */
function adjustLayerBoundary(layers: SubsurfaceLayer[], aquiferTop: number, aquiferBottom: number, markAquifer: boolean) {
  // Find the layer that contains the aquifer top
  for (const layer of layers) {
    if (layer.topDepthM <= aquiferTop && layer.bottomDepthM >= aquiferTop) {
      if (markAquifer) {
        layer.isAquifer = true;
        layer.waterBearing = true;
      }
      // Adjust if the field data gives a tighter constraint
      if (aquiferTop > layer.topDepthM) {
        layer.topDepthM = aquiferTop;
        layer.thicknessM = layer.bottomDepthM - layer.topDepthM;
      }
      if (aquiferBottom < layer.bottomDepthM && aquiferBottom > aquiferTop) {
        layer.bottomDepthM = aquiferBottom;
        layer.thicknessM = layer.bottomDepthM - layer.topDepthM;
      }
      break;
    }
  }
}

/* ─── Helper: Insert a new layer ─── */
function insertLayer(layers: SubsurfaceLayer[], top: number, bottom: number, lithology: string, code: SubsurfaceLayer['lithologyCode'], dataSources: string[]) {
  const newLayer = makeLayer(top, bottom, lithology, code, dataSources);
  // Insert in correct position
  const insertIdx = layers.findIndex(l => l.topDepthM > top);
  if (insertIdx >= 0) {
    layers.splice(insertIdx, 0, newLayer);
  } else {
    layers.push(newLayer);
  }
}

/* ─── Estimate weathering depth by rock type and latitude ─── */
function estimateWeatheringDepth(rock: string, lat: number): number {
  // Tropical weathering is deeper (Bazilevskaya et al. 2013)
  const tropicalFactor = Math.abs(lat) < 25 ? 1.5 : Math.abs(lat) < 40 ? 1.0 : 0.7;
  
  const baseDepths: Record<string, number> = {
    granite: 25, gneiss: 20, basalt: 15, schist: 18,
    sandstone: 12, limestone: 30, shale: 8,
    quartzite: 10, dolomite: 25,
  };
  const base = Object.entries(baseDepths).find(([k]) => rock.includes(k))?.[1] ?? 15;
  return base * tropicalFactor;
}

/* ─── Yield from transmissivity (Logan 1964 approximation) ─── */
function estimateYieldFromT(T_m2_day: number): number {
  // Q ≈ 1.32 × T (Logan 1964, for 8-hour pumping, s/2r specific capacity)
  // Returns m³/hr
  return Math.max(0.1, (1.32 * T_m2_day) / 24);
}

/* ─── Estimate water level from layers ─── */
function estimateWaterLevel(layers: SubsurfaceLayer[], input: TwinInputData): number {
  // Use recharge and elevation to estimate water table
  const recharge = input.rechargeEstimate_mm_yr ?? 50;
  const slope = input.slopePercent ?? 5;

  // Higher recharge = shallower water table; steeper slope = deeper water table
  const baseLevel = 10; // default 10m bgl
  const rechargeAdj = (recharge - 50) * -0.05; // 100mm/yr → 2.5m shallower
  const slopeAdj = slope * 0.3; // 10% slope → 3m deeper
  
  const estimated = Math.max(1, baseLevel + rechargeAdj + slopeAdj);
  
  // Override with nearby borehole data if available
  if (input.nearbyBoreholes && input.nearbyBoreholes.length > 0) {
    const avgWL = input.nearbyBoreholes.reduce((s, b) => s + b.waterLevel_m, 0) / input.nearbyBoreholes.length;
    if (avgWL > 0) return estimated * 0.5 + avgWL * 0.5; // blend
  }

  return estimated;
}

/* ─── Drilling Prognosis ─── */
function generateDrillingPrognosis(layers: SubsurfaceLayer[]): DrillingPrognosis[] {
  return layers.map(l => {
    const difficulty = getDrillingDifficulty(l.lithologyCode);
    return {
      depthFrom_m: l.topDepthM,
      depthTo_m: l.bottomDepthM,
      expectedFormation: l.lithology,
      drillingDifficulty: difficulty.level,
      expectedPenetrationRate_m_hr: difficulty.rate,
      notes: difficulty.notes + (l.isAquifer ? ' — TARGET AQUIFER' : ''),
    };
  });
}

function getDrillingDifficulty(code: string): { level: DrillingPrognosis['drillingDifficulty']; rate: number; notes: string } {
  switch (code) {
    case 'soil': return { level: 'easy', rate: 8, notes: 'Soft overburden, auger or rotary' };
    case 'alluvium': return { level: 'easy', rate: 6, notes: 'Unconsolidated, may need casing support' };
    case 'weathered': return { level: 'moderate', rate: 3, notes: 'Decomposed rock, rotary drilling' };
    case 'fractured': return { level: 'moderate', rate: 2, notes: 'Fractured zone — expect water inflow, reduced ROP' };
    case 'clay': return { level: 'easy', rate: 5, notes: 'Soft but sticky, may clog bit' };
    case 'sand': return { level: 'easy', rate: 7, notes: 'Loose — screen completion required' };
    case 'gravel': return { level: 'moderate', rate: 4, notes: 'Gravel pack completion, potential high yield' };
    case 'limestone': return { level: 'moderate', rate: 2.5, notes: 'May encounter karst voids, use caution' };
    case 'sandstone': return { level: 'moderate', rate: 2, notes: 'Consolidated, steady drilling' };
    case 'shale': return { level: 'easy', rate: 4, notes: 'Soft but may swell, use inhibitive mud' };
    case 'fresh_rock':
    case 'granite':
    case 'basalt':
    case 'gneiss':
    case 'schist':
      return { level: 'very_hard', rate: 0.5, notes: 'Hard rock — DTH hammer recommended, slow ROP' };
    default: return { level: 'moderate', rate: 2, notes: 'Unknown formation' };
  }
}

/* ─── Model confidence ─── */
function calculateModelConfidence(sources: string[], input: TwinInputData): number {
  let conf = 0.30; // base desktop confidence
  
  // Each data source adds confidence
  conf += Math.min(0.3, sources.length * 0.06);
  
  // Field geophysics is worth more
  if (input.fieldData?.ertSurvey) conf += 0.10;
  if (input.fieldData?.emTdemSurvey) conf += 0.08;
  if (input.fieldData?.seismicSurvey) conf += 0.09;
  if (input.fieldData?.gprSurvey) conf += 0.05;
  if (input.fieldData?.magneticGravitySurvey) conf += 0.07;
  if (input.fieldData?.nmrSurvey) conf += 0.15; // NMR is the gold standard
  if (input.fieldData?.pumpTest) conf += 0.12;
  if (input.nearbyBoreholes && input.nearbyBoreholes.length >= 3) conf += 0.10;
  
  return Math.min(0.95, conf);
}
