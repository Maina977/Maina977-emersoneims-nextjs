/* ═══════════════════════════════════════════════════════════════════════
   AQUIFER TYPE CLASSIFICATION ENGINE
   Identifies: Unconfined | Confined | Semi-confined | Fractured Rock | Perched
   Each type has different behavior → affects depth, yield, sustainability
   ═══════════════════════════════════════════════════════════════════════ */

/* ── Types ─────────────────────────────────────────────────── */

export interface AquiferClassificationInput {
  latitude: number;
  longitude: number;
  rockType?: string;
  soilType?: string;

  // Geophysical indicators
  resistivity_ohmM?: number;
  bedrockDepth_m?: number;
  weatheredZoneThickness_m?: number;
  waterTableDepth_m?: number;
  staticWaterLevel_m?: number;

  // Structural
  fractureDensity?: number;
  faultProximity_km?: number;

  // Regional data
  regionalAquiferTypes?: string[];  // from boreholeDatabase
  precipitation_mmYr?: number;
  elevation_m?: number;
  slope_deg?: number;
  twi?: number;

  // Pump test indicators
  pumpTestDrawdown_m?: number;
  pumpTestRecovery_pct?: number;
  storativity?: number;
  transmissivity_m2day?: number;

  // Subsurface layers (from digital twin or geophysics fusion)
  subsurfaceLayers?: {
    lithology: string;
    topDepth_m: number;
    bottomDepth_m: number;
    isAquifer: boolean;
    waterBearing: boolean;
    porosity: number;
    hydraulicConductivity_m_day: number;
  }[];
}

export interface AquiferType {
  type: 'unconfined' | 'confined' | 'semi-confined' | 'fractured_rock' | 'perched' | 'karst';
  probability: number;       // 0-1
  confidence: number;        // 0-1
}

export interface AquiferCharacteristics {
  type: AquiferType['type'];
  name: string;
  description: string;

  // Physical properties
  typicalDepthRange_m: [number, number];
  typicalYieldRange_m3hr: [number, number];
  typicalTransmissivity_m2day: [number, number];
  typicalStorativity: [number, number];
  rechargeRate: 'high' | 'moderate' | 'low' | 'very_low';
  vulnerabilityToContamination: 'high' | 'moderate' | 'low';

  // Drilling implications
  recommendedDrillMethod: string;
  casingRequirements: string;
  screenDesign: string;
  expectedPumpTestBehavior: string;
  sustainabilityOutlook: string;

  // Risk profile
  depletionRisk: 'low' | 'moderate' | 'high';
  qualityVariability: 'low' | 'moderate' | 'high';
  seasonalVariation: 'none' | 'slight' | 'moderate' | 'significant';
}

export interface AquiferClassificationResult {
  // Primary classification
  primaryType: AquiferType;
  secondaryType?: AquiferType;
  allTypes: AquiferType[];

  // Detailed characteristics
  characteristics: AquiferCharacteristics;

  // Evidence
  evidenceSources: { source: string; supports: string; weight: number }[];
  confidenceBreakdown: { factor: string; score: number }[];

  // Hydrogeological model
  conceptualModel: string;     // text description of the aquifer system
  waterBudgetImplication: string;
  rechargeZone: string;
  dischargeZone: string;

  // Actionable output
  recommendedDepth_m: [number, number];
  expectedYield_m3hr: [number, number];
  drillingStrategy: string;
  monitoringRequirements: string[];

  overallConfidence: number;
  methodology: string;
}

/* ── Aquifer Properties Database ──────────────────────────── */

const AQUIFER_PROPERTIES: Record<AquiferType['type'], AquiferCharacteristics> = {
  unconfined: {
    type: 'unconfined',
    name: 'Unconfined (Water Table) Aquifer',
    description: 'Water table aquifer with direct connection to surface. Recharged directly by rainfall infiltration. Water level fluctuates with seasons.',
    typicalDepthRange_m: [5, 50],
    typicalYieldRange_m3hr: [0.5, 10],
    typicalTransmissivity_m2day: [5, 500],
    typicalStorativity: [0.05, 0.3],
    rechargeRate: 'high',
    vulnerabilityToContamination: 'high',
    recommendedDrillMethod: 'Rotary or percussion; standard open-hole completion',
    casingRequirements: 'Surface casing through topsoil (3-6m), sanitary seal required',
    screenDesign: 'Slotted PVC screen across saturated zone; gravel pack recommended',
    expectedPumpTestBehavior: 'Delayed yield response (Boulton 1963); S typically 0.05-0.3',
    sustainabilityOutlook: 'Sustainable if pumping < recharge; seasonal drawdown expected',
    depletionRisk: 'moderate',
    qualityVariability: 'moderate',
    seasonalVariation: 'significant',
  },
  confined: {
    type: 'confined',
    name: 'Confined (Artesian) Aquifer',
    description: 'Aquifer sandwiched between impermeable clay/rock layers. Water is under pressure (may be artesian). Protected from surface contamination.',
    typicalDepthRange_m: [30, 300],
    typicalYieldRange_m3hr: [1, 30],
    typicalTransmissivity_m2day: [50, 5000],
    typicalStorativity: [0.0001, 0.005],
    rechargeRate: 'low',
    vulnerabilityToContamination: 'low',
    recommendedDrillMethod: 'Rotary drilling; steel casing through confining layer',
    casingRequirements: 'Steel casing sealed into confining layer; cement grout essential',
    screenDesign: 'Stainless steel screen; gravel pack; sealed above confining layer',
    expectedPumpTestBehavior: 'Classic Theis curve; rapid drawdown, no delayed yield; S < 0.005',
    sustainabilityOutlook: 'Long-term sustainable but slow recharge; monitor piezometric level',
    depletionRisk: 'low',
    qualityVariability: 'low',
    seasonalVariation: 'none',
  },
  'semi-confined': {
    type: 'semi-confined',
    name: 'Semi-Confined (Leaky) Aquifer',
    description: 'Aquifer partially confined by a semi-permeable layer (e.g., silty clay). Receives leakage from above or below.',
    typicalDepthRange_m: [15, 100],
    typicalYieldRange_m3hr: [0.5, 15],
    typicalTransmissivity_m2day: [10, 1000],
    typicalStorativity: [0.005, 0.05],
    rechargeRate: 'moderate',
    vulnerabilityToContamination: 'moderate',
    recommendedDrillMethod: 'Rotary drilling; casing through semi-confining layer',
    casingRequirements: 'Casing through semi-confining layer; grouted annulus',
    screenDesign: 'Screen in aquifer zone; gravel pack; seal semi-confining layer',
    expectedPumpTestBehavior: 'Hantush-Jacob (1955) leaky aquifer curve; transition from confined to steady-state',
    sustainabilityOutlook: 'Good sustainability due to vertical leakage; moderate seasonal impact',
    depletionRisk: 'low',
    qualityVariability: 'moderate',
    seasonalVariation: 'slight',
  },
  fractured_rock: {
    type: 'fractured_rock',
    name: 'Fractured Rock Aquifer',
    description: 'Water flows through fractures, joints, and faults in otherwise impermeable rock. Highly heterogeneous — yield varies dramatically over short distances.',
    typicalDepthRange_m: [20, 150],
    typicalYieldRange_m3hr: [0.1, 20],
    typicalTransmissivity_m2day: [0.1, 100],
    typicalStorativity: [0.001, 0.01],
    rechargeRate: 'low',
    vulnerabilityToContamination: 'moderate',
    recommendedDrillMethod: 'DTH (Down-The-Hole) percussion; precise siting on fracture zones critical',
    casingRequirements: 'Casing through weathered zone; open-hole in fractured bedrock',
    screenDesign: 'Open-hole completion below casing; no screen needed in competent rock',
    expectedPumpTestBehavior: 'Double-porosity response (Warren & Root 1963); initial rapid drawdown, then stabilization as matrix feeds fractures',
    sustainabilityOutlook: 'Uncertain — depends on fracture connectivity and recharge path; monitor carefully',
    depletionRisk: 'high',
    qualityVariability: 'high',
    seasonalVariation: 'moderate',
  },
  perched: {
    type: 'perched',
    name: 'Perched Aquifer',
    description: 'Small, shallow water body sitting above the main water table on an impermeable clay lens. Limited volume, often seasonal.',
    typicalDepthRange_m: [2, 15],
    typicalYieldRange_m3hr: [0.05, 1],
    typicalTransmissivity_m2day: [0.5, 50],
    typicalStorativity: [0.1, 0.35],
    rechargeRate: 'high',
    vulnerabilityToContamination: 'high',
    recommendedDrillMethod: 'Hand-dug well or shallow borehole; consider drilling deeper to main aquifer',
    casingRequirements: 'Full casing; sanitary seal; consider deepening to main aquifer',
    screenDesign: 'Short screen section; often better to bypass perched zone and target deeper aquifer',
    expectedPumpTestBehavior: 'Rapid drawdown, limited recovery; finite aquifer (Hantush 1960)',
    sustainabilityOutlook: 'NOT sustainable for community supply; seasonal and limited volume',
    depletionRisk: 'high',
    qualityVariability: 'high',
    seasonalVariation: 'significant',
  },
  karst: {
    type: 'karst',
    name: 'Karst (Solution) Aquifer',
    description: 'Limestone/dolomite aquifer with solution-enlarged fractures, conduits, and caves. Extremely high yield potential but highly unpredictable.',
    typicalDepthRange_m: [10, 200],
    typicalYieldRange_m3hr: [1, 100],
    typicalTransmissivity_m2day: [100, 50000],
    typicalStorativity: [0.01, 0.3],
    rechargeRate: 'high',
    vulnerabilityToContamination: 'high',
    recommendedDrillMethod: 'Rotary with lost-circulation materials; air-percussion for hard zones',
    casingRequirements: 'Surface casing; may need stabilization through cavity zones',
    screenDesign: 'Open-hole in limestone; may need slot screens to prevent sand entry from conduits',
    expectedPumpTestBehavior: 'Non-Darcian flow; turbulent losses; step-drawdown test essential',
    sustainabilityOutlook: 'High yield but vulnerable to drought and contamination; seasonal springs may indicate discharge',
    depletionRisk: 'moderate',
    qualityVariability: 'high',
    seasonalVariation: 'moderate',
  },
};

/* ── Classification Logic ─────────────────────────────────── */

export function classifyAquiferType(input: AquiferClassificationInput): AquiferClassificationResult {
  const evidence: AquiferClassificationResult['evidenceSources'] = [];
  const scores: Record<AquiferType['type'], number> = {
    unconfined: 0, confined: 0, 'semi-confined': 0, fractured_rock: 0, perched: 0, karst: 0,
  };

  // ── 1. Rock type evidence ──────────────────────────────
  const rock = (input.rockType || '').toLowerCase();
  if (rock) {
    if (rock.includes('granite') || rock.includes('gneiss') || rock.includes('quartzite') || rock.includes('basalt') || rock.includes('dolerite')) {
      scores.fractured_rock += 3;
      evidence.push({ source: 'Rock type', supports: `fractured_rock (${rock} = crystalline)`, weight: 3 });
    }
    if (rock.includes('sandstone') || rock.includes('alluvium')) {
      scores.unconfined += 2;
      scores.confined += 1.5;
      evidence.push({ source: 'Rock type', supports: 'unconfined/confined (sedimentary)', weight: 2 });
    }
    if (rock.includes('limestone') || rock.includes('dolomite')) {
      scores.karst += 3;
      scores.confined += 1;
      evidence.push({ source: 'Rock type', supports: `karst (${rock} = carbonate)`, weight: 3 });
    }
    if (rock.includes('shale') || rock.includes('mudstone')) {
      scores['semi-confined'] += 2;
      evidence.push({ source: 'Rock type', supports: 'semi-confined (shale = semi-permeable)', weight: 2 });
    }
    if (rock.includes('laterite')) {
      scores.perched += 2;
      scores.unconfined += 1;
      evidence.push({ source: 'Rock type', supports: 'perched/unconfined (laterite cap)', weight: 2 });
    }
  }

  // ── 2. Depth indicators ────────────────────────────────
  const wt = input.waterTableDepth_m ?? input.staticWaterLevel_m;
  if (wt != null) {
    if (wt < 5) {
      scores.unconfined += 2;
      scores.perched += 1.5;
      evidence.push({ source: 'Water table depth', supports: `shallow (${wt}m) → unconfined/perched`, weight: 2 });
    } else if (wt < 20) {
      scores.unconfined += 2;
      scores['semi-confined'] += 1;
      evidence.push({ source: 'Water table depth', supports: `moderate (${wt}m) → unconfined`, weight: 2 });
    } else if (wt < 50) {
      scores.confined += 1.5;
      scores['semi-confined'] += 1.5;
      scores.fractured_rock += 1;
      evidence.push({ source: 'Water table depth', supports: `deep (${wt}m) → confined/semi-confined`, weight: 1.5 });
    } else {
      scores.confined += 2.5;
      scores.fractured_rock += 1.5;
      evidence.push({ source: 'Water table depth', supports: `very deep (${wt}m) → confined`, weight: 2.5 });
    }
  }

  // ── 3. Storativity evidence (pump test gold standard) ──
  if (input.storativity != null) {
    const S = input.storativity;
    if (S > 0.05) {
      scores.unconfined += 4;
      evidence.push({ source: 'Storativity (pump test)', supports: `S=${S} → unconfined (S > 0.05)`, weight: 4 });
    } else if (S > 0.005) {
      scores['semi-confined'] += 4;
      evidence.push({ source: 'Storativity (pump test)', supports: `S=${S} → semi-confined`, weight: 4 });
    } else if (S > 0.0005) {
      scores.confined += 4;
      evidence.push({ source: 'Storativity (pump test)', supports: `S=${S} → confined (0.0005 < S < 0.005)`, weight: 4 });
    } else {
      scores.fractured_rock += 3;
      scores.confined += 2;
      evidence.push({ source: 'Storativity (pump test)', supports: `S=${S} → fractured rock or tightly confined`, weight: 3 });
    }
  }

  // ── 4. Resistivity evidence ────────────────────────────
  if (input.resistivity_ohmM != null) {
    const rho = input.resistivity_ohmM;
    if (rho > 250) {
      scores.fractured_rock += 2;
      evidence.push({ source: 'Resistivity', supports: `${rho} Ωm → resistive = fractured rock`, weight: 2 });
    } else if (rho > 40) {
      scores.unconfined += 1.5;
      evidence.push({ source: 'Resistivity', supports: `${rho} Ωm → moderate = unconfined sand`, weight: 1.5 });
    } else if (rho > 10) {
      scores.confined += 1;
      scores['semi-confined'] += 1;
      evidence.push({ source: 'Resistivity', supports: `${rho} Ωm → low-moderate = confined/leaky`, weight: 1 });
    } else {
      scores.confined += 2;
      evidence.push({ source: 'Resistivity', supports: `${rho} Ωm → very low = clay-confined`, weight: 2 });
    }
  }

  // ── 5. Subsurface layer analysis ───────────────────────
  if (input.subsurfaceLayers && input.subsurfaceLayers.length > 0) {
    const layers = input.subsurfaceLayers;
    const aquiferLayers = layers.filter(l => l.isAquifer || l.waterBearing);

    // Check for confining layers above aquifer
    for (const aq of aquiferLayers) {
      const above = layers.filter(l => l.bottomDepth_m <= aq.topDepth_m + 1);
      const hasClayAbove = above.some(l => l.lithology.toLowerCase().includes('clay') && l.hydraulicConductivity_m_day < 0.01);
      if (hasClayAbove) {
        scores.confined += 2;
        evidence.push({ source: 'Subsurface layers', supports: `Clay confining layer above aquifer at ${aq.topDepth_m}m`, weight: 2 });
      }

      const hasSemiPermAbove = above.some(l => l.hydraulicConductivity_m_day >= 0.01 && l.hydraulicConductivity_m_day < 0.5);
      if (hasSemiPermAbove && !hasClayAbove) {
        scores['semi-confined'] += 2;
        evidence.push({ source: 'Subsurface layers', supports: 'Semi-permeable layer above aquifer → leaky', weight: 2 });
      }
    }

    // Check for fractures
    const fracLayers = layers.filter(l => l.lithology.toLowerCase().includes('fractur'));
    if (fracLayers.length > 0) {
      scores.fractured_rock += 2;
      evidence.push({ source: 'Subsurface layers', supports: `${fracLayers.length} fractured layer(s) detected`, weight: 2 });
    }
  }

  // ── 6. Fracture density evidence ───────────────────────
  if (input.fractureDensity != null) {
    if (input.fractureDensity > 2) {
      scores.fractured_rock += 2;
      evidence.push({ source: 'Fracture density', supports: `${input.fractureDensity}/km² → fractured rock`, weight: 2 });
    }
  }

  // ── 7. Regional data ───────────────────────────────────
  if (input.regionalAquiferTypes) {
    for (const type of input.regionalAquiferTypes) {
      const t = type.toLowerCase();
      if (t.includes('unconfined') || t.includes('water table')) scores.unconfined += 1;
      if (t.includes('confined') || t.includes('artesian')) scores.confined += 1;
      if (t.includes('fractured') || t.includes('crystalline') || t.includes('basement')) scores.fractured_rock += 1;
      if (t.includes('karst') || t.includes('limestone')) scores.karst += 1;
    }
    evidence.push({ source: 'Regional database', supports: `Regional types: ${input.regionalAquiferTypes.join(', ')}`, weight: 1 });
  }

  // ── 8. Terrain indicators ──────────────────────────────
  if (input.elevation_m != null && input.slope_deg != null) {
    if (input.slope_deg < 3 && input.elevation_m < 500) {
      scores.unconfined += 1;
      evidence.push({ source: 'Terrain', supports: 'Flat, low elevation → likely alluvial unconfined', weight: 1 });
    }
    if (input.slope_deg > 15) {
      scores.fractured_rock += 1;
      evidence.push({ source: 'Terrain', supports: 'Steep slope → likely fractured bedrock', weight: 1 });
    }
  }

  // ── Normalize and rank ─────────────────────────────────
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
  const allTypes: AquiferType[] = Object.entries(scores)
    .map(([type, score]) => ({
      type: type as AquiferType['type'],
      probability: totalScore > 0 ? score / totalScore : 1 / 6,
      confidence: Math.min(0.95, 0.3 + evidence.length * 0.08),
    }))
    .sort((a, b) => b.probability - a.probability);

  const primaryType = allTypes[0];
  const secondaryType = allTypes[1].probability > 0.15 ? allTypes[1] : undefined;
  const characteristics = AQUIFER_PROPERTIES[primaryType.type];

  // Confidence breakdown
  const confidenceBreakdown = [
    { factor: 'Rock type', score: rock ? 0.2 : 0 },
    { factor: 'Storativity', score: input.storativity != null ? 0.3 : 0 },
    { factor: 'Resistivity', score: input.resistivity_ohmM != null ? 0.15 : 0 },
    { factor: 'Subsurface model', score: input.subsurfaceLayers ? 0.15 : 0 },
    { factor: 'Regional data', score: input.regionalAquiferTypes ? 0.1 : 0 },
    { factor: 'Terrain', score: (input.elevation_m != null && input.slope_deg != null) ? 0.05 : 0 },
    { factor: 'Fracture data', score: input.fractureDensity != null ? 0.1 : 0 },
  ].filter(f => f.score > 0);

  const overallConfidence = Math.min(0.95, confidenceBreakdown.reduce((s, f) => s + f.score, 0) + 0.3);

  // Recommended depth based on type
  const recDepth: [number, number] = [
    characteristics.typicalDepthRange_m[0],
    Math.min(characteristics.typicalDepthRange_m[1], (input.bedrockDepth_m ?? 200) + 20),
  ];

  // Conceptual model narrative
  const conceptualModel = buildConceptualModel(primaryType.type, input);

  return {
    primaryType,
    secondaryType,
    allTypes,
    characteristics,
    evidenceSources: evidence,
    confidenceBreakdown,
    conceptualModel,
    waterBudgetImplication: getWaterBudgetImplication(primaryType.type),
    rechargeZone: getRechargeZone(primaryType.type, input),
    dischargeZone: getDischargeZone(primaryType.type),
    recommendedDepth_m: recDepth,
    expectedYield_m3hr: characteristics.typicalYieldRange_m3hr,
    drillingStrategy: characteristics.recommendedDrillMethod,
    monitoringRequirements: getMonitoringReqs(primaryType.type),
    overallConfidence,
    methodology: 'Multi-evidence Bayesian classification using rock type, geophysics, pump test, subsurface model, and regional data (Freeze & Cherry 1979, Kruseman & de Ridder 1994)',
  };
}

/* ── Helper Functions ─────────────────────────────────────── */

function buildConceptualModel(type: AquiferType['type'], input: AquiferClassificationInput): string {
  const depth = input.waterTableDepth_m ?? input.staticWaterLevel_m ?? 10;
  switch (type) {
    case 'unconfined':
      return `Unconfined aquifer system with water table at ~${depth}m depth. Direct rainfall recharge through permeable soil/rock. Water table responds to seasonal precipitation. Vulnerable to surface contamination — sanitary protection zone required.`;
    case 'confined':
      return `Confined aquifer beneath impermeable confining layer. Water under artesian pressure at ~${depth}m depth. Recharge occurs at distant outcrop area. Protected from surface contamination by confining layer. Long-term storage but slow replenishment.`;
    case 'semi-confined':
      return `Semi-confined (leaky) aquifer with partial clay/silt confining layer at ~${depth}m. Receives vertical leakage from overlying unconfined zone. Partially protected from surface contamination. Moderate seasonal response.`;
    case 'fractured_rock':
      return `Fractured rock aquifer in ${input.rockType || 'crystalline bedrock'}. Groundwater flows through fracture networks, joints, and weathered zones. Highly heterogeneous — yield varies dramatically over short distances. Precise siting on fracture intersections essential.`;
    case 'perched':
      return `Perched water body at ~${depth}m depth above main water table, sitting on a clay lens or laterite cap. Limited volume, seasonal. NOT suitable as sole water supply — recommend drilling deeper to main aquifer.`;
    case 'karst':
      return `Karst aquifer in ${input.rockType || 'carbonate rock'} with solution-enlarged fractures and conduits. Extremely variable transmissivity. High contamination vulnerability through sinkholes. Step-drawdown test essential to quantify turbulent losses.`;
  }
}

function getWaterBudgetImplication(type: AquiferType['type']): string {
  switch (type) {
    case 'unconfined': return 'Direct recharge from precipitation; sustainable pumping must be < recharge rate';
    case 'confined': return 'Slow recharge through confining layer; pumping from storage — monitor piezometric decline';
    case 'semi-confined': return 'Mixed recharge: direct infiltration + vertical leakage; moderate sustainability';
    case 'fractured_rock': return 'Recharge through fracture intersecting surface; limited storage in fractures';
    case 'perched': return 'Very limited storage; seasonal recharge only; not sustainable for continuous supply';
    case 'karst': return 'High recharge through sinkholes but rapid throughflow; spring monitoring recommended';
  }
}

function getRechargeZone(type: AquiferType['type'], input: AquiferClassificationInput): string {
  if (type === 'confined') return 'Distant outcrop area (may be 10-100 km away)';
  if (type === 'karst') return 'Sinkholes, dolines, and exposed limestone within catchment';
  if (type === 'fractured_rock') return `Fracture zones intersecting surface, weathered zone above ${input.rockType || 'bedrock'}`;
  if (type === 'perched') return 'Local rainfall infiltration above clay lens';
  return 'Direct precipitation infiltration across aquifer outcrop area';
}

function getDischargeZone(type: AquiferType['type']): string {
  switch (type) {
    case 'unconfined': return 'Springs, rivers, wetlands, and evapotranspiration';
    case 'confined': return 'Artesian springs, upward leakage to overlying aquifer';
    case 'semi-confined': return 'Rivers, vertical leakage to/from adjacent aquifers';
    case 'fractured_rock': return 'Fracture-controlled springs, seepage in valleys';
    case 'perched': return 'Seasonal springs, lateral seepage at clay lens edge';
    case 'karst': return 'Large springs, cave systems, river sinks';
  }
}

function getMonitoringReqs(type: AquiferType['type']): string[] {
  const base = ['Monthly static water level measurement', 'Annual water quality sampling'];
  switch (type) {
    case 'unconfined': return [...base, 'Seasonal bacteriological testing (contamination vulnerability)', 'Rainfall correlation monitoring'];
    case 'confined': return [...base, 'Quarterly piezometric head measurement', 'Monitor for declining pressure trend'];
    case 'semi-confined': return [...base, 'Monitor vertical head gradient (leakage indicator)', 'Semi-annual quality check'];
    case 'fractured_rock': return [...base, 'Monitor for yield decline (fracture dewatering)', 'Radon or temperature profiling for fracture flow'];
    case 'perched': return [...base, 'Monthly water level (seasonal depletion risk)', 'Consider deepening to main aquifer'];
    case 'karst': return [...base, 'Continuous turbidity monitoring (conduit contamination)', 'Spring flow measurement', 'Dye tracing for vulnerability mapping'];
  }
}
