// ═══════════════════════════════════════════════════════════════════════════
// LITHOLOGY LOGGER — Structured Depth-by-Depth Rock Logging System
// Captures: rock type, color, hardness, fractures, water strikes, casing
// Feeds AI model for future depth/yield prediction improvement
// ═══════════════════════════════════════════════════════════════════════════

export interface LithologyEntry {
  depthFrom_m: number;
  depthTo_m: number;
  rockType: string;           // granite, sandstone, clay, laterite, etc.
  description: string;        // field description
  color: string;              // brown, grey, red, white, etc.
  hardness: 'very_soft' | 'soft' | 'medium' | 'hard' | 'very_hard';
  grainSize?: 'clay' | 'silt' | 'fine_sand' | 'medium_sand' | 'coarse_sand' | 'gravel' | 'cobble' | 'boulder';
  weathering?: 'fresh' | 'slightly' | 'moderately' | 'highly' | 'completely';
  fractures?: number;         // fracture count in this interval
  fractureAperture_mm?: number;
  waterStrike?: boolean;      // did water enter the borehole here?
  waterStrikeYield_m3hr?: number;
  waterLevel_m?: number;      // water level after this strike
  casing?: 'open' | 'solid_casing' | 'screen' | 'gravel_pack';
  mineralogy?: string[];      // quartz, feldspar, mica, calcite, etc.
  porosity_pct?: number;      // estimated or measured
  rqd_pct?: number;           // Rock Quality Designation (0-100%)
}

export interface LithologyLog {
  boreholeId: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  totalDepth_m: number;
  dateDrilled: string;
  driller?: string;
  drillMethod?: 'rotary_air' | 'rotary_mud' | 'DTH' | 'cable_tool' | 'hand_auger' | 'percussion';
  casingDiameter_mm?: number;
  entries: LithologyEntry[];
  waterStrikes: WaterStrikeRecord[];
  finalYield_m3hr?: number;
  staticWaterLevel_m?: number;
  notes?: string;
}

export interface WaterStrikeRecord {
  depth_m: number;
  yield_m3hr: number;
  rockType: string;
  isMajor: boolean;
  cumYield_m3hr: number;  // cumulative yield from surface to this depth
}

export interface LithologyAnalysis {
  // Stratigraphic summary
  totalLayers: number;
  totalDepth_m: number;
  dominantRockType: string;
  dominantRockPct: number;
  
  // Water-bearing zones
  waterStrikes: WaterStrikeRecord[];
  primaryAquiferDepth_m: number;
  primaryAquiferThickness_m: number;
  primaryAquiferRockType: string;
  totalYield_m3hr: number;
  
  // Fracture analysis
  totalFractures: number;
  fractureDensity_per_m: number;
  mostFracturedZone: { depthFrom: number; depthTo: number; count: number } | null;
  fractureYieldCorrelation: number; // -1 to 1
  
  // Rock quality
  averageRQD_pct: number;
  weatheringProfile: { zone: string; depthFrom: number; depthTo: number }[];
  bedrockDepth_m: number;
  overburdenThickness_m: number;
  
  // Drilling recommendations
  casingRecommendation: { solidFrom: number; solidTo: number; screenFrom: number; screenTo: number };
  groutSealDepth_m: number;
  
  // AI training features
  featureVector: number[];   // for ML model training
  predictedYieldFromLithology_m3hr: number;
  predictedSustainability: 'high' | 'moderate' | 'low';
  
  // Comparison to prediction
  accuracyVsPrediction?: {
    predictedDepth_m: number;
    actualDepth_m: number;
    depthError_pct: number;
    predictedYield_m3hr: number;
    actualYield_m3hr: number;
    yieldError_pct: number;
  };
  
  // Hydrogeological interpretation
  interpretation: string;
  formationSequence: { formation: string; thickness_m: number; hydroRole: string }[];
}

// Rock type → hydraulic properties lookup
const ROCK_HYDRAULICS: Record<string, { K_m_day: number; porosity: number; specificYield: number; aquiferPotential: number }> = {
  'topsoil':     { K_m_day: 1.0,   porosity: 0.40, specificYield: 0.20, aquiferPotential: 0.1 },
  'laterite':    { K_m_day: 0.5,   porosity: 0.35, specificYield: 0.10, aquiferPotential: 0.3 },
  'clay':        { K_m_day: 0.001, porosity: 0.50, specificYield: 0.03, aquiferPotential: 0.0 },
  'silt':        { K_m_day: 0.1,   porosity: 0.45, specificYield: 0.08, aquiferPotential: 0.2 },
  'sand':        { K_m_day: 10.0,  porosity: 0.35, specificYield: 0.25, aquiferPotential: 0.9 },
  'gravel':      { K_m_day: 100.0, porosity: 0.30, specificYield: 0.22, aquiferPotential: 1.0 },
  'sandstone':   { K_m_day: 5.0,   porosity: 0.25, specificYield: 0.15, aquiferPotential: 0.7 },
  'limestone':   { K_m_day: 10.0,  porosity: 0.20, specificYield: 0.14, aquiferPotential: 0.8 },
  'dolomite':    { K_m_day: 5.0,   porosity: 0.15, specificYield: 0.12, aquiferPotential: 0.7 },
  'shale':       { K_m_day: 0.0001,porosity: 0.10, specificYield: 0.02, aquiferPotential: 0.0 },
  'mudstone':    { K_m_day: 0.001, porosity: 0.12, specificYield: 0.02, aquiferPotential: 0.0 },
  'granite':     { K_m_day: 0.01,  porosity: 0.02, specificYield: 0.01, aquiferPotential: 0.1 },
  'gneiss':      { K_m_day: 0.01,  porosity: 0.02, specificYield: 0.01, aquiferPotential: 0.1 },
  'basalt':      { K_m_day: 0.1,   porosity: 0.10, specificYield: 0.05, aquiferPotential: 0.3 },
  'quartzite':   { K_m_day: 0.001, porosity: 0.03, specificYield: 0.01, aquiferPotential: 0.1 },
  'schist':      { K_m_day: 0.05,  porosity: 0.05, specificYield: 0.02, aquiferPotential: 0.2 },
  'marble':      { K_m_day: 1.0,   porosity: 0.10, specificYield: 0.08, aquiferPotential: 0.5 },
  'conglomerate':{ K_m_day: 8.0,   porosity: 0.25, specificYield: 0.18, aquiferPotential: 0.7 },
  'alluvium':    { K_m_day: 20.0,  porosity: 0.35, specificYield: 0.20, aquiferPotential: 0.9 },
  'weathered_basement': { K_m_day: 1.0, porosity: 0.15, specificYield: 0.05, aquiferPotential: 0.5 },
  'fractured_rock':     { K_m_day: 5.0, porosity: 0.08, specificYield: 0.03, aquiferPotential: 0.6 },
};

const STORAGE_KEY = 'aquascan_lithology_logs';

// ═══ PERSISTENCE ═══
export function saveLithologyLog(log: LithologyLog): void {
  const logs = getAllLithologyLogs();
  const idx = logs.findIndex(l => l.boreholeId === log.boreholeId);
  if (idx >= 0) logs[idx] = log;
  else logs.push(log);
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // storage full — trim oldest
    if (logs.length > 10) {
      logs.splice(0, logs.length - 10);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }
  }
}

export function getAllLithologyLogs(): LithologyLog[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch { return []; }
}

export function getLithologyLogById(id: string): LithologyLog | null {
  return getAllLithologyLogs().find(l => l.boreholeId === id) || null;
}

export function deleteLithologyLog(id: string): void {
  const logs = getAllLithologyLogs().filter(l => l.boreholeId !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
}

// ═══ NEARBY LOG QUERY ═══
export function queryNearbyLithologyLogs(lat: number, lon: number, radiusKm: number = 25): LithologyLog[] {
  const logs = getAllLithologyLogs();
  return logs.filter(log => {
    const dLat = (log.latitude - lat) * Math.PI / 180;
    const dLon = (log.longitude - lon) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat * Math.PI / 180) * Math.cos(log.latitude * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return dist <= radiusKm;
  });
}

// ═══ CORE ANALYSIS ═══
export function analyzeLithologyLog(log: LithologyLog, prediction?: { depth_m: number; yield_m3hr: number }): LithologyAnalysis {
  const entries = [...log.entries].sort((a, b) => a.depthFrom_m - b.depthFrom_m);
  
  if (entries.length === 0) {
    return emptyAnalysis(log);
  }
  
  // Stratigraphic summary
  const rockCounts: Record<string, number> = {};
  let totalThickness = 0;
  
  for (const e of entries) {
    const thick = e.depthTo_m - e.depthFrom_m;
    const rock = e.rockType.toLowerCase();
    rockCounts[rock] = (rockCounts[rock] || 0) + thick;
    totalThickness += thick;
  }
  
  const dominant = Object.entries(rockCounts).sort((a, b) => b[1] - a[1])[0];
  const dominantRockType = dominant?.[0] || 'unknown';
  const dominantRockPct = totalThickness > 0 ? ((dominant?.[1] || 0) / totalThickness) * 100 : 0;
  
  // Water strikes
  const waterStrikes: WaterStrikeRecord[] = [];
  let cumYield = 0;
  for (const e of entries) {
    if (e.waterStrike) {
      cumYield += e.waterStrikeYield_m3hr || 0;
      waterStrikes.push({
        depth_m: e.depthFrom_m,
        yield_m3hr: e.waterStrikeYield_m3hr || 0,
        rockType: e.rockType,
        isMajor: (e.waterStrikeYield_m3hr || 0) > cumYield * 0.3,
        cumYield_m3hr: cumYield
      });
    }
  }
  // Also add explicitly logged strikes
  for (const ws of (log.waterStrikes || [])) {
    if (!waterStrikes.some(w => Math.abs(w.depth_m - ws.depth_m) < 0.5)) {
      waterStrikes.push(ws);
    }
  }
  waterStrikes.sort((a, b) => a.depth_m - b.depth_m);
  
  // Primary aquifer
  const majorStrike = waterStrikes.reduce((best, ws) => ws.yield_m3hr > (best?.yield_m3hr || 0) ? ws : best, waterStrikes[0]);
  const aquiferEntry = majorStrike ? entries.find(e => e.depthFrom_m <= majorStrike.depth_m && e.depthTo_m >= majorStrike.depth_m) : null;
  
  // Fracture analysis
  let totalFractures = 0;
  let fracZones: { depthFrom: number; depthTo: number; count: number }[] = [];
  
  for (const e of entries) {
    if (e.fractures && e.fractures > 0) {
      totalFractures += e.fractures;
      fracZones.push({ depthFrom: e.depthFrom_m, depthTo: e.depthTo_m, count: e.fractures });
    }
  }
  
  const mostFractured = fracZones.sort((a, b) => b.count - a.count)[0] || null;
  const fractureDensity = totalThickness > 0 ? totalFractures / totalThickness : 0;
  
  // Fracture-yield correlation
  let fractureYieldCorr = 0;
  if (waterStrikes.length >= 2 && fracZones.length >= 2) {
    const wsDepths = waterStrikes.map(w => w.depth_m);
    const fracDepths = fracZones.map(f => (f.depthFrom + f.depthTo) / 2);
    // Simple: how many water strikes coincide with fractured zones
    let coincident = 0;
    for (const wd of wsDepths) {
      for (const fz of fracZones) {
        if (wd >= fz.depthFrom && wd <= fz.depthTo) { coincident++; break; }
      }
    }
    fractureYieldCorr = waterStrikes.length > 0 ? coincident / waterStrikes.length : 0;
  }
  
  // Rock quality (RQD)
  const rqdEntries = entries.filter(e => e.rqd_pct !== undefined);
  const avgRQD = rqdEntries.length > 0 ? rqdEntries.reduce((s, e) => s + (e.rqd_pct || 0), 0) / rqdEntries.length : 50;
  
  // Weathering profile
  const weatheringProfile: { zone: string; depthFrom: number; depthTo: number }[] = [];
  let currentWeathering = '';
  let weatherStart = 0;
  for (const e of entries) {
    const w = e.weathering || 'unknown';
    if (w !== currentWeathering) {
      if (currentWeathering) {
        weatheringProfile.push({ zone: currentWeathering, depthFrom: weatherStart, depthTo: e.depthFrom_m });
      }
      currentWeathering = w;
      weatherStart = e.depthFrom_m;
    }
  }
  if (currentWeathering) {
    weatheringProfile.push({ zone: currentWeathering, depthFrom: weatherStart, depthTo: entries[entries.length - 1].depthTo_m });
  }
  
  // Bedrock and overburden
  const softRocks = ['topsoil', 'clay', 'silt', 'sand', 'gravel', 'laterite', 'alluvium'];
  let bedrockDepth = 0;
  for (const e of entries) {
    if (!softRocks.includes(e.rockType.toLowerCase()) && e.hardness !== 'very_soft' && e.hardness !== 'soft') {
      bedrockDepth = e.depthFrom_m;
      break;
    }
    bedrockDepth = e.depthTo_m;
  }
  
  // Casing recommendation
  const solidCasingTo = Math.max(bedrockDepth + 3, 6); // 3m into bedrock or minimum 6m
  const screenFrom = majorStrike ? majorStrike.depth_m - 2 : solidCasingTo;
  const screenTo = majorStrike
    ? Math.min(majorStrike.depth_m + (aquiferEntry ? (aquiferEntry.depthTo_m - aquiferEntry.depthFrom_m) : 6), log.totalDepth_m)
    : log.totalDepth_m;
  
  // Formation sequence with hydro roles
  const formationSequence: { formation: string; thickness_m: number; hydroRole: string }[] = [];
  for (const e of entries) {
    const thick = e.depthTo_m - e.depthFrom_m;
    const rock = e.rockType.toLowerCase();
    const props = ROCK_HYDRAULICS[rock] || ROCK_HYDRAULICS['granite'];
    
    let role = 'aquitard';
    if (e.waterStrike) role = 'aquifer (water strike)';
    else if (props.aquiferPotential > 0.6) role = 'aquifer';
    else if (props.aquiferPotential > 0.3) role = 'semi-permeable';
    else if (props.K_m_day < 0.01) role = 'confining layer';
    
    formationSequence.push({
      formation: `${e.rockType} (${e.depthFrom_m}–${e.depthTo_m}m)`,
      thickness_m: thick,
      hydroRole: role
    });
  }
  
  // AI feature vector for ML training
  const featureVector = generateFeatureVector(log, entries, waterStrikes, totalFractures, bedrockDepth, avgRQD);
  
  // Predicted yield from lithology
  let predictedYield = 0;
  for (const e of entries) {
    const rock = e.rockType.toLowerCase();
    const props = ROCK_HYDRAULICS[rock] || ROCK_HYDRAULICS['granite'];
    const thick = e.depthTo_m - e.depthFrom_m;
    const T = props.K_m_day * thick;
    // Fracture enhancement
    const fracEnhance = e.fractures ? 1 + e.fractures * 0.5 : 1;
    predictedYield += T * 0.02 * fracEnhance; // simplified yield from transmissivity
  }
  predictedYield = Math.max(0.01, predictedYield);
  
  // Sustainability from rock type
  const sustainableRocks = entries.filter(e => {
    const p = ROCK_HYDRAULICS[e.rockType.toLowerCase()];
    return p && p.specificYield > 0.05;
  });
  const sustainPct = totalThickness > 0 ? sustainableRocks.reduce((s, e) => s + (e.depthTo_m - e.depthFrom_m), 0) / totalThickness : 0;
  const predictedSustainability: LithologyAnalysis['predictedSustainability'] = 
    sustainPct > 0.4 ? 'high' : sustainPct > 0.15 ? 'moderate' : 'low';
  
  // Accuracy comparison
  let accuracyVsPrediction: LithologyAnalysis['accuracyVsPrediction'];
  if (prediction) {
    const actualDepth = majorStrike?.depth_m || log.totalDepth_m;
    const actualYield = log.finalYield_m3hr || (waterStrikes.reduce((s, w) => s + w.yield_m3hr, 0));
    accuracyVsPrediction = {
      predictedDepth_m: prediction.depth_m,
      actualDepth_m: actualDepth,
      depthError_pct: prediction.depth_m > 0 ? Math.abs(actualDepth - prediction.depth_m) / prediction.depth_m * 100 : 0,
      predictedYield_m3hr: prediction.yield_m3hr,
      actualYield_m3hr: actualYield,
      yieldError_pct: prediction.yield_m3hr > 0 ? Math.abs(actualYield - prediction.yield_m3hr) / prediction.yield_m3hr * 100 : 0
    };
  }
  
  // Interpretation narrative
  const interpretation = generateInterpretation(entries, waterStrikes, bedrockDepth, totalFractures, dominantRockType, log);
  
  return {
    totalLayers: entries.length,
    totalDepth_m: log.totalDepth_m,
    dominantRockType,
    dominantRockPct: Math.round(dominantRockPct),
    waterStrikes,
    primaryAquiferDepth_m: majorStrike?.depth_m || 0,
    primaryAquiferThickness_m: aquiferEntry ? (aquiferEntry.depthTo_m - aquiferEntry.depthFrom_m) : 0,
    primaryAquiferRockType: majorStrike?.rockType || 'unknown',
    totalYield_m3hr: waterStrikes.reduce((s, w) => s + w.yield_m3hr, 0),
    totalFractures,
    fractureDensity_per_m: fractureDensity,
    mostFracturedZone: mostFractured,
    fractureYieldCorrelation: fractureYieldCorr,
    averageRQD_pct: Math.round(avgRQD),
    weatheringProfile,
    bedrockDepth_m: bedrockDepth,
    overburdenThickness_m: bedrockDepth,
    casingRecommendation: {
      solidFrom: 0,
      solidTo: Math.round(solidCasingTo),
      screenFrom: Math.round(screenFrom),
      screenTo: Math.round(screenTo)
    },
    groutSealDepth_m: Math.min(solidCasingTo, 6),
    featureVector,
    predictedYieldFromLithology_m3hr: Math.round(predictedYield * 100) / 100,
    predictedSustainability,
    accuracyVsPrediction,
    interpretation,
    formationSequence
  };
}

function generateFeatureVector(log: LithologyLog, entries: LithologyEntry[], waterStrikes: WaterStrikeRecord[], totalFractures: number, bedrockDepth: number, avgRQD: number): number[] {
  const totalDepth = log.totalDepth_m;
  const numEntries = entries.length;
  
  // 20-feature vector
  return [
    log.latitude,
    log.longitude,
    totalDepth,
    numEntries,
    bedrockDepth,
    bedrockDepth / Math.max(totalDepth, 1),
    waterStrikes.length,
    waterStrikes.reduce((s, w) => s + w.yield_m3hr, 0),
    waterStrikes.length > 0 ? waterStrikes[0].depth_m : totalDepth,
    totalFractures,
    totalFractures / Math.max(totalDepth, 1),
    avgRQD / 100,
    entries.filter(e => ROCK_HYDRAULICS[e.rockType.toLowerCase()]?.aquiferPotential > 0.5).length / Math.max(numEntries, 1),
    entries.filter(e => e.hardness === 'hard' || e.hardness === 'very_hard').length / Math.max(numEntries, 1),
    entries.filter(e => e.weathering === 'highly' || e.weathering === 'completely').length / Math.max(numEntries, 1),
    log.staticWaterLevel_m || 0,
    log.finalYield_m3hr || 0,
    log.drillMethod === 'DTH' ? 1 : log.drillMethod === 'rotary_air' ? 0.8 : 0.5,
    log.casingDiameter_mm ? log.casingDiameter_mm / 200 : 0.75,
    log.elevation_m || 0
  ];
}

function generateInterpretation(entries: LithologyEntry[], waterStrikes: WaterStrikeRecord[], bedrockDepth: number, totalFractures: number, dominantRock: string, log: LithologyLog): string {
  const parts: string[] = [];
  
  parts.push(`Borehole drilled to ${log.totalDepth_m}m depth.`);
  
  if (bedrockDepth > 0 && bedrockDepth < log.totalDepth_m) {
    parts.push(`Overburden extends to ${bedrockDepth}m, underlain by ${dominantRock}.`);
  }
  
  if (waterStrikes.length > 0) {
    const mainStrike = waterStrikes.reduce((best, ws) => ws.yield_m3hr > best.yield_m3hr ? ws : best, waterStrikes[0]);
    parts.push(`${waterStrikes.length} water strike(s) encountered. Primary strike at ${mainStrike.depth_m}m in ${mainStrike.rockType} yielding ${mainStrike.yield_m3hr.toFixed(1)} m³/hr.`);
    
    if (waterStrikes.length > 1) {
      const totalY = waterStrikes.reduce((s, w) => s + w.yield_m3hr, 0);
      parts.push(`Total cumulative yield: ${totalY.toFixed(1)} m³/hr from ${waterStrikes.length} zones.`);
    }
  } else {
    parts.push('No water strikes recorded — borehole may be dry or water bearing zones were missed.');
  }
  
  if (totalFractures > 0) {
    parts.push(`${totalFractures} fractures logged (density: ${(totalFractures / log.totalDepth_m).toFixed(2)}/m).`);
    
    // Fracture-water correlation
    const fracWaterZones = waterStrikes.filter(ws => {
      return entries.some(e => e.depthFrom_m <= ws.depth_m && e.depthTo_m >= ws.depth_m && e.fractures && e.fractures > 0);
    });
    if (fracWaterZones.length > 0) {
      parts.push(`${fracWaterZones.length} of ${waterStrikes.length} water strikes are associated with fractured zones — confirming fracture-controlled groundwater flow.`);
    }
  }
  
  // Hydrogeological interpretation
  const props = ROCK_HYDRAULICS[dominantRock.toLowerCase()];
  if (props) {
    if (props.aquiferPotential > 0.6) {
      parts.push(`Dominant ${dominantRock} has good aquifer potential (K ≈ ${props.K_m_day} m/day).`);
    } else if (props.aquiferPotential < 0.2) {
      parts.push(`Dominant ${dominantRock} has low primary porosity — groundwater flow likely fracture-controlled.`);
    }
  }
  
  return parts.join(' ');
}

function emptyAnalysis(log: LithologyLog): LithologyAnalysis {
  return {
    totalLayers: 0,
    totalDepth_m: log.totalDepth_m,
    dominantRockType: 'unknown',
    dominantRockPct: 0,
    waterStrikes: [],
    primaryAquiferDepth_m: 0,
    primaryAquiferThickness_m: 0,
    primaryAquiferRockType: 'unknown',
    totalYield_m3hr: 0,
    totalFractures: 0,
    fractureDensity_per_m: 0,
    mostFracturedZone: null,
    fractureYieldCorrelation: 0,
    averageRQD_pct: 0,
    weatheringProfile: [],
    bedrockDepth_m: 0,
    overburdenThickness_m: 0,
    casingRecommendation: { solidFrom: 0, solidTo: 6, screenFrom: 6, screenTo: log.totalDepth_m },
    groutSealDepth_m: 6,
    featureVector: [],
    predictedYieldFromLithology_m3hr: 0,
    predictedSustainability: 'low',
    interpretation: 'No lithology data available.',
    formationSequence: []
  };
}

// ═══ IMPORT/EXPORT ═══
export function exportLithologyCSV(log: LithologyLog): string {
  const headers = ['Depth From (m)', 'Depth To (m)', 'Rock Type', 'Description', 'Color', 'Hardness', 'Grain Size', 'Weathering', 'Fractures', 'Water Strike', 'Yield (m³/hr)', 'Casing'];
  const rows = log.entries.map(e => [
    e.depthFrom_m, e.depthTo_m, e.rockType, e.description, e.color, e.hardness,
    e.grainSize || '', e.weathering || '', e.fractures || 0,
    e.waterStrike ? 'YES' : 'NO', e.waterStrikeYield_m3hr || '', e.casing || 'open'
  ].join(','));
  return [headers.join(','), ...rows].join('\n');
}

export function importLithologyCSV(csv: string, boreholeId: string, lat: number, lon: number): LithologyLog {
  const lines = csv.trim().split('\n');
  const entries: LithologyEntry[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',').map(c => c.trim());
    if (cols.length < 6) continue;
    
    entries.push({
      depthFrom_m: parseFloat(cols[0]) || 0,
      depthTo_m: parseFloat(cols[1]) || 0,
      rockType: cols[2] || 'unknown',
      description: cols[3] || '',
      color: cols[4] || 'grey',
      hardness: (['very_soft', 'soft', 'medium', 'hard', 'very_hard'].includes(cols[5]) ? cols[5] : 'medium') as LithologyEntry['hardness'],
      grainSize: cols[6] as LithologyEntry['grainSize'] || undefined,
      weathering: cols[7] as LithologyEntry['weathering'] || undefined,
      fractures: parseInt(cols[8]) || 0,
      waterStrike: cols[9]?.toUpperCase() === 'YES',
      waterStrikeYield_m3hr: parseFloat(cols[10]) || 0,
      casing: (['open', 'solid_casing', 'screen', 'gravel_pack'].includes(cols[11]) ? cols[11] : 'open') as LithologyEntry['casing']
    });
  }
  
  const maxDepth = entries.length > 0 ? Math.max(...entries.map(e => e.depthTo_m)) : 0;
  
  return {
    boreholeId,
    latitude: lat,
    longitude: lon,
    totalDepth_m: maxDepth,
    dateDrilled: new Date().toISOString().split('T')[0],
    entries,
    waterStrikes: entries.filter(e => e.waterStrike).map((e, _i, arr) => ({
      depth_m: e.depthFrom_m,
      yield_m3hr: e.waterStrikeYield_m3hr || 0,
      rockType: e.rockType,
      isMajor: (e.waterStrikeYield_m3hr || 0) > 0.5,
      cumYield_m3hr: arr.filter(a => a.depthFrom_m <= e.depthFrom_m).reduce((s, a) => s + (a.waterStrikeYield_m3hr || 0), 0)
    }))
  };
}

// ═══ REGIONAL LEARNING FROM LOGS ═══
export function getRegionalLithologyInsight(lat: number, lon: number, radiusKm: number = 50): {
  commonRockSequence: string[];
  avgWaterStrikeDepth_m: number;
  avgYield_m3hr: number;
  successRate_pct: number;
  bestRockForWater: string;
  avgBedrockDepth_m: number;
  totalLogs: number;
} {
  const nearbyLogs = queryNearbyLithologyLogs(lat, lon, radiusKm);
  
  if (nearbyLogs.length === 0) {
    return {
      commonRockSequence: [],
      avgWaterStrikeDepth_m: 0,
      avgYield_m3hr: 0,
      successRate_pct: 0,
      bestRockForWater: 'unknown',
      totalLogs: 0,
      avgBedrockDepth_m: 0
    };
  }
  
  // Analyze all nearby logs
  const allAnalyses = nearbyLogs.map(l => analyzeLithologyLog(l));
  
  const waterStrikeDepths = allAnalyses.flatMap(a => a.waterStrikes.map(w => w.depth_m));
  const yields = allAnalyses.map(a => a.totalYield_m3hr).filter(y => y > 0);
  const successCount = allAnalyses.filter(a => a.totalYield_m3hr > 0.3).length;
  
  // Most common rock at water strike depth
  const wsRocks: Record<string, number> = {};
  for (const a of allAnalyses) {
    for (const ws of a.waterStrikes) {
      wsRocks[ws.rockType] = (wsRocks[ws.rockType] || 0) + ws.yield_m3hr;
    }
  }
  const bestRock = Object.entries(wsRocks).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown';
  
  // Common rock sequence (top 5 most common at each depth tier)
  const commonSequence: string[] = [];
  const tiers = [0, 5, 15, 30, 60];
  for (let t = 0; t < tiers.length - 1; t++) {
    const rocks: Record<string, number> = {};
    for (const log of nearbyLogs) {
      for (const e of log.entries) {
        if (e.depthFrom_m >= tiers[t] && e.depthFrom_m < tiers[t + 1]) {
          rocks[e.rockType] = (rocks[e.rockType] || 0) + 1;
        }
      }
    }
    const top = Object.entries(rocks).sort((a, b) => b[1] - a[1])[0];
    if (top) commonSequence.push(`${tiers[t]}–${tiers[t + 1]}m: ${top[0]}`);
  }
  
  return {
    commonRockSequence: commonSequence,
    avgWaterStrikeDepth_m: waterStrikeDepths.length > 0 ? waterStrikeDepths.reduce((a, b) => a + b, 0) / waterStrikeDepths.length : 0,
    avgYield_m3hr: yields.length > 0 ? yields.reduce((a, b) => a + b, 0) / yields.length : 0,
    successRate_pct: nearbyLogs.length > 0 ? (successCount / nearbyLogs.length) * 100 : 0,
    bestRockForWater: bestRock,
    avgBedrockDepth_m: allAnalyses.reduce((s, a) => s + a.bedrockDepth_m, 0) / allAnalyses.length,
    totalLogs: nearbyLogs.length
  };
}
