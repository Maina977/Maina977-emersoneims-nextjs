// ═══════════════════════════════════════════════════════════════════════════
// HYDROCHEMICAL PREDICTION & VALIDATION ENGINE
// Predicts water quality from geology, depth, aquifer type, and regional data.
// Then validates predictions against actual lab water analysis.
// WHO drinking water guidelines + treatment recommendations.
// ═══════════════════════════════════════════════════════════════════════════

export interface HydroChemPredictionInput {
  rockType: string;
  aquiferType?: 'unconfined' | 'confined' | 'semi-confined' | 'fractured_rock' | 'karst' | 'alluvial';
  depth_m: number;
  latitude: number;
  longitude: number;
  rainfall_mm_year?: number;
  distanceToCoast_km?: number;
  nearbyContamination?: string[];    // 'agricultural', 'industrial', 'sewage', 'mining', 'landfill'
  ertResistivity_ohmm?: number;      // can infer salinity from resistivity
  soilType?: string;
}

export interface LabWaterAnalysis {
  pH?: number;
  EC_uScm?: number;               // electrical conductivity µS/cm
  TDS_mgL?: number;               // total dissolved solids
  turbidity_NTU?: number;
  hardness_mgL_CaCO3?: number;
  
  // Major ions
  calcium_mgL?: number;
  magnesium_mgL?: number;
  sodium_mgL?: number;
  potassium_mgL?: number;
  bicarbonate_mgL?: number;
  chloride_mgL?: number;
  sulfate_mgL?: number;
  
  // Nutrients
  nitrate_mgL?: number;
  nitrite_mgL?: number;
  ammonium_mgL?: number;
  phosphate_mgL?: number;
  
  // Metals
  iron_mgL?: number;
  manganese_mgL?: number;
  arsenic_ugL?: number;
  fluoride_mgL?: number;
  lead_ugL?: number;
  
  // Microbiological
  totalColiform_cfu100mL?: number;
  eColiColiform_cfu100mL?: number;
  
  // Misc
  dissolvedOxygen_mgL?: number;
  temperature_c?: number;
}

export interface ParameterPrediction {
  parameter: string;
  predictedValue: number;
  unit: string;
  whoGuideline: number;
  exceedsGuideline: boolean;
  confidence: number;          // 0-1
  reasoning: string;
  healthRisk: 'none' | 'low' | 'moderate' | 'high' | 'critical';
}

export interface ValidationComparison {
  parameter: string;
  predicted: number;
  actual: number;
  error_pct: number;
  unit: string;
  whoGuideline: number;
  predictedExceeds: boolean;
  actualExceeds: boolean;
  predictionAccurate: boolean;   // within 30% of actual
}

export interface HydroChemResult {
  // Predicted water quality
  predictions: ParameterPrediction[];
  overallQuality: 'excellent' | 'good' | 'acceptable' | 'poor' | 'non_potable';
  potabilityScore: number;       // 0-100 (100 = perfect drinking water)
  
  // Water type classification (Piper diagram logic)
  waterType: string;             // e.g., "Ca-HCO3" (calcium bicarbonate)
  waterTypeDescription: string;
  
  // Key concerns
  primaryConcerns: string[];
  treatmentRequired: string[];
  treatmentCost: 'none' | 'low' | 'moderate' | 'high' | 'very_high';
  
  // Validation (if lab data provided)
  validation: ValidationComparison[] | null;
  validationScore_pct: number | null;   // overall prediction accuracy
  
  // Recommendations
  parametersToTest: string[];     // which lab tests are most important
  monitoringFrequency: string;
  recommendations: string[];
  
  // Narrative
  narrative: string;
  confidence: number;
}

// ═══ WHO DRINKING WATER GUIDELINES (2022) ═══
const WHO_GUIDELINES: Record<string, { limit: number; unit: string; health: boolean; aesthetic: boolean }> = {
  'pH':           { limit: 8.5, unit: '', health: false, aesthetic: true },
  'TDS':          { limit: 1000, unit: 'mg/L', health: false, aesthetic: true },
  'EC':           { limit: 1500, unit: 'µS/cm', health: false, aesthetic: true },
  'turbidity':    { limit: 5, unit: 'NTU', health: true, aesthetic: true },
  'hardness':     { limit: 500, unit: 'mg/L CaCO3', health: false, aesthetic: true },
  'calcium':      { limit: 200, unit: 'mg/L', health: false, aesthetic: true },
  'magnesium':    { limit: 150, unit: 'mg/L', health: false, aesthetic: true },
  'sodium':       { limit: 200, unit: 'mg/L', health: false, aesthetic: true },
  'chloride':     { limit: 250, unit: 'mg/L', health: false, aesthetic: true },
  'sulfate':      { limit: 250, unit: 'mg/L', health: false, aesthetic: true },
  'nitrate':      { limit: 50, unit: 'mg/L', health: true, aesthetic: false },
  'nitrite':      { limit: 3, unit: 'mg/L', health: true, aesthetic: false },
  'iron':         { limit: 0.3, unit: 'mg/L', health: false, aesthetic: true },
  'manganese':    { limit: 0.1, unit: 'mg/L', health: true, aesthetic: true },
  'arsenic':      { limit: 10, unit: 'µg/L', health: true, aesthetic: false },
  'fluoride':     { limit: 1.5, unit: 'mg/L', health: true, aesthetic: false },
  'lead':         { limit: 10, unit: 'µg/L', health: true, aesthetic: false },
  'totalColiform': { limit: 0, unit: 'CFU/100mL', health: true, aesthetic: false },
  'eColi':        { limit: 0, unit: 'CFU/100mL', health: true, aesthetic: false },
};

// ═══ ROCK → WATER CHEMISTRY PREDICTION TABLE ═══
// Based on Hem (1985), Appelo & Postma (2005)
interface RockChemistry {
  pH: [number, number];
  TDS: [number, number];
  hardness: [number, number];
  iron: [number, number];
  fluoride: [number, number];
  arsenic: [number, number];      // µg/L
  nitrate: [number, number];
  chloride: [number, number];
  sulfate: [number, number];
  manganese: [number, number];
  dominantCation: string;
  dominantAnion: string;
}

const ROCK_CHEMISTRY: Record<string, RockChemistry> = {
  'granite':    { pH: [6.5, 7.5], TDS: [100, 400], hardness: [50, 200], iron: [0.1, 1.0], fluoride: [0.5, 3.0], arsenic: [1, 15], nitrate: [0, 5], chloride: [5, 50], sulfate: [5, 50], manganese: [0.01, 0.2], dominantCation: 'Na', dominantAnion: 'HCO3' },
  'gneiss':     { pH: [6.5, 7.8], TDS: [80, 350], hardness: [40, 180], iron: [0.1, 0.8], fluoride: [0.3, 2.5], arsenic: [1, 10], nitrate: [0, 5], chloride: [5, 40], sulfate: [5, 40], manganese: [0.01, 0.15], dominantCation: 'Na', dominantAnion: 'HCO3' },
  'basalt':     { pH: [7.0, 8.5], TDS: [100, 500], hardness: [80, 300], iron: [0.05, 0.5], fluoride: [0.5, 5.0], arsenic: [1, 5], nitrate: [0, 3], chloride: [5, 30], sulfate: [5, 40], manganese: [0.01, 0.1], dominantCation: 'Ca-Mg', dominantAnion: 'HCO3' },
  'sandstone':  { pH: [6.0, 7.5], TDS: [50, 300], hardness: [30, 150], iron: [0.2, 2.0], fluoride: [0.1, 0.5], arsenic: [1, 5], nitrate: [5, 30], chloride: [5, 80], sulfate: [5, 50], manganese: [0.02, 0.3], dominantCation: 'Ca', dominantAnion: 'HCO3' },
  'limestone':  { pH: [7.0, 8.5], TDS: [200, 800], hardness: [150, 500], iron: [0.01, 0.2], fluoride: [0.1, 0.5], arsenic: [1, 3], nitrate: [5, 20], chloride: [10, 100], sulfate: [20, 200], manganese: [0.01, 0.05], dominantCation: 'Ca', dominantAnion: 'HCO3-SO4' },
  'dolomite':   { pH: [7.2, 8.5], TDS: [200, 700], hardness: [200, 600], iron: [0.01, 0.1], fluoride: [0.1, 0.3], arsenic: [1, 3], nitrate: [3, 15], chloride: [10, 80], sulfate: [15, 150], manganese: [0.01, 0.05], dominantCation: 'Ca-Mg', dominantAnion: 'HCO3' },
  'shale':      { pH: [6.5, 8.0], TDS: [200, 1500], hardness: [100, 400], iron: [0.5, 5.0], fluoride: [0.2, 1.0], arsenic: [5, 50], nitrate: [0, 5], chloride: [20, 300], sulfate: [20, 500], manganese: [0.1, 1.0], dominantCation: 'Na', dominantAnion: 'Cl-SO4' },
  'schist':     { pH: [6.5, 7.5], TDS: [80, 400], hardness: [50, 200], iron: [0.1, 1.5], fluoride: [0.3, 2.0], arsenic: [2, 20], nitrate: [0, 5], chloride: [5, 50], sulfate: [5, 60], manganese: [0.02, 0.3], dominantCation: 'Na-Ca', dominantAnion: 'HCO3' },
  'quartzite':  { pH: [5.5, 7.0], TDS: [20, 100], hardness: [10, 50], iron: [0.01, 0.3], fluoride: [0.05, 0.2], arsenic: [1, 3], nitrate: [0, 5], chloride: [2, 20], sulfate: [2, 20], manganese: [0.01, 0.05], dominantCation: 'Na', dominantAnion: 'HCO3' },
  'laterite':   { pH: [5.0, 6.5], TDS: [30, 200], hardness: [20, 100], iron: [0.5, 10.0], fluoride: [0.1, 0.5], arsenic: [2, 15], nitrate: [5, 40], chloride: [5, 40], sulfate: [5, 40], manganese: [0.1, 1.0], dominantCation: 'Fe', dominantAnion: 'HCO3' },
  'alluvium':   { pH: [6.5, 7.5], TDS: [100, 600], hardness: [50, 300], iron: [0.1, 2.0], fluoride: [0.2, 1.0], arsenic: [1, 30], nitrate: [10, 50], chloride: [10, 100], sulfate: [10, 100], manganese: [0.05, 0.5], dominantCation: 'Ca-Na', dominantAnion: 'HCO3' },
  'clay':       { pH: [6.0, 7.5], TDS: [200, 1000], hardness: [100, 400], iron: [1.0, 10.0], fluoride: [0.2, 1.5], arsenic: [5, 50], nitrate: [0, 5], chloride: [20, 200], sulfate: [20, 300], manganese: [0.2, 2.0], dominantCation: 'Na', dominantAnion: 'Cl' },
  'sand':       { pH: [6.0, 7.0], TDS: [50, 300], hardness: [30, 150], iron: [0.1, 1.0], fluoride: [0.1, 0.3], arsenic: [1, 5], nitrate: [10, 60], chloride: [5, 50], sulfate: [5, 40], manganese: [0.02, 0.2], dominantCation: 'Ca', dominantAnion: 'HCO3' },
  'gravel':     { pH: [6.5, 7.5], TDS: [50, 250], hardness: [40, 200], iron: [0.05, 0.5], fluoride: [0.1, 0.3], arsenic: [1, 3], nitrate: [5, 40], chloride: [5, 40], sulfate: [5, 30], manganese: [0.01, 0.1], dominantCation: 'Ca', dominantAnion: 'HCO3' },
};

export function predictHydroChemistry(input: HydroChemPredictionInput, labData?: LabWaterAnalysis): HydroChemResult {
  const rock = input.rockType.toLowerCase().replace(/[_\s]+/g, '');
  const rockChem = ROCK_CHEMISTRY[rock] || ROCK_CHEMISTRY['granite'];
  
  // ═══ DEPTH MODIFIER ═══
  // Deeper water tends to have higher TDS, lower nitrate, higher fluoride
  const depthFactor = input.depth_m / 50; // normalized to 50m
  const tdsDepthMod = 1 + depthFactor * 0.15;
  const nitrateDepthMod = Math.max(0.1, 1 - depthFactor * 0.3);
  const fluorideDepthMod = 1 + depthFactor * 0.2;
  
  // ═══ AQUIFER TYPE MODIFIER ═══
  const confinedMod = input.aquiferType === 'confined' || input.aquiferType === 'semi-confined';
  const ironConfMod = confinedMod ? 2.0 : 1.0;     // confined → higher iron (reducing conditions)
  const nitrateConfMod = confinedMod ? 0.3 : 1.0;   // confined → lower nitrate (denitrification)
  const arsenicConfMod = confinedMod ? 1.5 : 1.0;   // confined → higher arsenic (reducing conditions)
  
  // ═══ CONTAMINATION MODIFIER ═══
  let nitrateContamMod = 1.0;
  let coliformMod = 0;
  if (input.nearbyContamination) {
    if (input.nearbyContamination.includes('agricultural')) { nitrateContamMod = 2.5; coliformMod = 50; }
    if (input.nearbyContamination.includes('sewage')) { nitrateContamMod = 3.0; coliformMod = 200; }
    if (input.nearbyContamination.includes('industrial')) { nitrateContamMod = 1.5; }
  }
  
  // ═══ COASTAL MODIFIER ═══
  let chlorideCoastalMod = 1.0;
  if (input.distanceToCoast_km !== undefined && input.distanceToCoast_km < 20) {
    chlorideCoastalMod = 1 + (20 - input.distanceToCoast_km) / 10;
  }
  
  // ═══ ERT RESISTIVITY → TDS ESTIMATE ═══
  // Archie's law approximation: TDS ≈ 10000 / ρ (for saturated formation)
  let ertTDS: number | null = null;
  if (input.ertResistivity_ohmm && input.ertResistivity_ohmm > 0) {
    ertTDS = Math.min(5000, 8000 / input.ertResistivity_ohmm);
  }
  
  // ═══ GENERATE PREDICTIONS ═══
  const predictions: ParameterPrediction[] = [];
  
  function addPrediction(param: string, range: [number, number], modifier: number, reasoning: string) {
    const mid = (range[0] + range[1]) / 2;
    const val = mid * modifier;
    const guideline = WHO_GUIDELINES[param];
    const exceeds = guideline ? val > guideline.limit : false;
    const healthRisk: ParameterPrediction['healthRisk'] = !guideline ? 'none' :
      exceeds && guideline.health ? (val > guideline.limit * 2 ? 'high' : 'moderate') :
      exceeds ? 'low' : 'none';
    
    predictions.push({
      parameter: param,
      predictedValue: Math.round(val * 100) / 100,
      unit: guideline?.unit || '',
      whoGuideline: guideline?.limit || 0,
      exceedsGuideline: exceeds,
      confidence: Math.max(0.3, Math.min(0.85, 0.6 + (modifier === 1 ? 0.1 : -0.05))),
      reasoning,
      healthRisk
    });
  }
  
  const pHMid = (rockChem.pH[0] + rockChem.pH[1]) / 2;
  predictions.push({
    parameter: 'pH', predictedValue: Math.round(pHMid * 10) / 10, unit: '',
    whoGuideline: 8.5, exceedsGuideline: pHMid > 8.5 || pHMid < 6.5,
    confidence: 0.7, reasoning: `${input.rockType} typically produces ${pHMid < 7 ? 'slightly acidic' : 'neutral to alkaline'} water`,
    healthRisk: pHMid < 6.5 ? 'low' : 'none'
  });
  
  addPrediction('TDS', rockChem.TDS, tdsDepthMod * (ertTDS ? ertTDS / ((rockChem.TDS[0] + rockChem.TDS[1]) / 2) : 1), 
    `${input.rockType} at ${input.depth_m}m depth${ertTDS ? `, ERT-calibrated TDS ≈ ${ertTDS.toFixed(0)} mg/L` : ''}`);
  addPrediction('hardness', rockChem.hardness, tdsDepthMod, `Mineral dissolution from ${input.rockType}`);
  addPrediction('iron', rockChem.iron, ironConfMod, `${confinedMod ? 'Confined aquifer (reducing)' : 'Unconfined'} in ${input.rockType}`);
  addPrediction('fluoride', rockChem.fluoride, fluorideDepthMod, `${input.rockType} at depth ${input.depth_m}m`);
  addPrediction('arsenic', rockChem.arsenic, arsenicConfMod, `${input.rockType}${confinedMod ? ' (confined, reducing conditions)' : ''}`);
  addPrediction('nitrate', rockChem.nitrate, nitrateDepthMod * nitrateConfMod * nitrateContamMod,
    `Depth ${input.depth_m}m${input.nearbyContamination?.length ? ', nearby contamination sources' : ''}`);
  addPrediction('manganese', rockChem.manganese, ironConfMod * 0.8, `${input.rockType}${confinedMod ? ' (reducing conditions)' : ''}`);
  addPrediction('chloride', rockChem.chloride, chlorideCoastalMod, 
    `${input.rockType}${input.distanceToCoast_km !== undefined && input.distanceToCoast_km < 20 ? ', coastal influence' : ''}`);
  addPrediction('sulfate', rockChem.sulfate, tdsDepthMod, `Mineral dissolution from ${input.rockType}`);
  
  // Microbiological
  const baseColiform = (input.aquiferType === 'unconfined' ? 10 : 0) + coliformMod;
  const coliformDepthMod = Math.max(0, 1 - input.depth_m / 50);
  predictions.push({
    parameter: 'totalColiform', 
    predictedValue: Math.round(baseColiform * coliformDepthMod),
    unit: 'CFU/100mL', whoGuideline: 0, 
    exceedsGuideline: baseColiform * coliformDepthMod > 0,
    confidence: 0.5,
    reasoning: `${input.aquiferType || 'unknown'} aquifer at ${input.depth_m}m${coliformMod > 0 ? ', contamination nearby' : ''}`,
    healthRisk: baseColiform * coliformDepthMod > 0 ? 'moderate' : 'none'
  });
  
  // ═══ WATER TYPE CLASSIFICATION ═══
  const waterType = `${rockChem.dominantCation}-${rockChem.dominantAnion}`;
  const typeDescriptions: Record<string, string> = {
    'Ca-HCO3': 'Calcium bicarbonate — typical fresh groundwater from limestone/sedimentary rocks. Generally good quality.',
    'Ca-Mg-HCO3': 'Calcium-magnesium bicarbonate — from dolomite or mafic rocks. Hard but potable.',
    'Na-HCO3': 'Sodium bicarbonate — from weathered granite/gneiss. Soft water, may have elevated fluoride.',
    'Na-Cl': 'Sodium chloride — connate water or saline intrusion. May indicate long residence time or sea water mixing.',
    'Ca-SO4': 'Calcium sulfate — from gypsum dissolution. Unpleasant taste above 250 mg/L sulfate.',
    'Na-Cl-SO4': 'Sodium chloride-sulfate — evolved water from deep confined aquifers. High TDS likely.',
    'Fe-HCO3': 'Iron-rich bicarbonate — from laterite/ironstone. Requires iron removal treatment.',
    'Ca-Na-HCO3': 'Mixed cation bicarbonate — from mixed sediments. Moderate mineralization.',
    'Na-Ca-HCO3': 'Sodium-calcium bicarbonate — transitional water type.',
  };
  
  const waterTypeDesc = typeDescriptions[waterType] || `${waterType} type water — moderate mineralization expected.`;
  
  // ═══ OVERALL QUALITY ═══
  const healthExceedances = predictions.filter(p => p.exceedsGuideline && p.healthRisk !== 'none' && p.healthRisk !== 'low');
  const aestheticExceedances = predictions.filter(p => p.exceedsGuideline && p.healthRisk === 'low');
  
  let overallQuality: HydroChemResult['overallQuality'] = 'excellent';
  if (healthExceedances.length >= 2) overallQuality = 'non_potable';
  else if (healthExceedances.length === 1) overallQuality = 'poor';
  else if (aestheticExceedances.length >= 3) overallQuality = 'acceptable';
  else if (aestheticExceedances.length >= 1) overallQuality = 'good';
  
  const potabilityScore = Math.max(0, 100 - healthExceedances.length * 25 - aestheticExceedances.length * 10);
  
  // ═══ KEY CONCERNS ═══
  const concerns = predictions.filter(p => p.exceedsGuideline).map(p => 
    `${p.parameter}: ${p.predictedValue} ${p.unit} (WHO: ${p.whoGuideline} ${p.unit})`
  );
  
  // ═══ TREATMENT RECOMMENDATIONS ═══
  const treatments: string[] = [];
  if (predictions.find(p => p.parameter === 'iron' && p.exceedsGuideline)) treatments.push('Iron removal (aeration + sand filtration)');
  if (predictions.find(p => p.parameter === 'manganese' && p.exceedsGuideline)) treatments.push('Manganese removal (oxidation + filtration)');
  if (predictions.find(p => p.parameter === 'fluoride' && p.exceedsGuideline)) treatments.push('Defluoridation (bone char / activated alumina)');
  if (predictions.find(p => p.parameter === 'arsenic' && p.exceedsGuideline)) treatments.push('Arsenic removal (coagulation + filtration or RO)');
  if (predictions.find(p => p.parameter === 'nitrate' && p.exceedsGuideline)) treatments.push('Denitrification (ion exchange or biological treatment)');
  if (predictions.find(p => p.parameter === 'hardness' && p.exceedsGuideline)) treatments.push('Water softening (ion exchange)');
  if (predictions.find(p => p.parameter === 'TDS' && p.predictedValue > 1500)) treatments.push('Reverse osmosis (high TDS)');
  if (predictions.find(p => p.parameter === 'totalColiform' && p.exceedsGuideline)) treatments.push('Disinfection (chlorination / UV / ozone)');
  
  const treatmentCost: HydroChemResult['treatmentCost'] =
    treatments.length === 0 ? 'none' :
    treatments.length <= 1 && !treatments.some(t => t.includes('RO') || t.includes('Arsenic')) ? 'low' :
    treatments.length <= 2 ? 'moderate' :
    treatments.some(t => t.includes('RO')) ? 'very_high' : 'high';
  
  // ═══ VALIDATION ═══
  let validation: ValidationComparison[] | null = null;
  let validationScore: number | null = null;
  
  if (labData) {
    validation = [];
    const paramMap: [string, number | undefined, number | undefined][] = [
      ['pH', predictions.find(p => p.parameter === 'pH')?.predictedValue, labData.pH],
      ['TDS', predictions.find(p => p.parameter === 'TDS')?.predictedValue, labData.TDS_mgL],
      ['iron', predictions.find(p => p.parameter === 'iron')?.predictedValue, labData.iron_mgL],
      ['fluoride', predictions.find(p => p.parameter === 'fluoride')?.predictedValue, labData.fluoride_mgL],
      ['nitrate', predictions.find(p => p.parameter === 'nitrate')?.predictedValue, labData.nitrate_mgL],
      ['manganese', predictions.find(p => p.parameter === 'manganese')?.predictedValue, labData.manganese_mgL],
      ['chloride', predictions.find(p => p.parameter === 'chloride')?.predictedValue, labData.chloride_mgL],
      ['sulfate', predictions.find(p => p.parameter === 'sulfate')?.predictedValue, labData.sulfate_mgL],
      ['hardness', predictions.find(p => p.parameter === 'hardness')?.predictedValue, labData.hardness_mgL_CaCO3],
      ['arsenic', predictions.find(p => p.parameter === 'arsenic')?.predictedValue, labData.arsenic_ugL],
    ];
    
    for (const [param, pred, actual] of paramMap) {
      if (pred !== undefined && actual !== undefined) {
        const guideline = WHO_GUIDELINES[param]?.limit || 0;
        const error = actual > 0 ? Math.abs(pred - actual) / actual * 100 : (pred > 0 ? 100 : 0);
        validation.push({
          parameter: param,
          predicted: pred,
          actual,
          error_pct: Math.round(error * 10) / 10,
          unit: WHO_GUIDELINES[param]?.unit || '',
          whoGuideline: guideline,
          predictedExceeds: pred > guideline,
          actualExceeds: actual > guideline,
          predictionAccurate: error < 30
        });
      }
    }
    
    if (validation.length > 0) {
      validationScore = Math.round(validation.filter(v => v.predictionAccurate).length / validation.length * 100);
    }
  }
  
  // ═══ PRIORITY TESTS ═══
  const parametersToTest: string[] = [];
  const highRiskParams = predictions.filter(p => p.healthRisk === 'high' || p.healthRisk === 'moderate');
  parametersToTest.push(...highRiskParams.map(p => p.parameter));
  parametersToTest.push('totalColiform', 'eColi');
  if (!parametersToTest.includes('fluoride') && (rock === 'granite' || rock === 'gneiss' || rock === 'basalt')) {
    parametersToTest.push('fluoride');
  }
  if (!parametersToTest.includes('arsenic') && confinedMod) {
    parametersToTest.push('arsenic');
  }
  
  // Monitoring frequency
  const monFreq = overallQuality === 'excellent' ? 'Annual' :
                   overallQuality === 'good' ? 'Bi-annual' :
                   overallQuality === 'acceptable' ? 'Quarterly' : 'Monthly';
  
  // ═══ RECOMMENDATIONS ═══
  const recs: string[] = [];
  recs.push(`Water type: ${waterType} — ${overallQuality} quality predicted`);
  if (treatments.length > 0) recs.push(`Treatment needed: ${treatments.join('; ')}`);
  recs.push(`Priority lab tests: ${parametersToTest.slice(0, 5).join(', ')}`);
  recs.push(`Monitoring frequency: ${monFreq}`);
  if (validationScore !== null) {
    recs.push(`Prediction accuracy: ${validationScore}% (${validation!.length} parameters compared)`);
  }
  
  // ═══ NARRATIVE ═══
  const narrative = [
    `Predicted water type: ${waterType} (${waterTypeDesc.split('.')[0]}).`,
    `Overall quality: ${overallQuality}${concerns.length > 0 ? `. Concerns: ${concerns.slice(0, 3).join('; ')}` : ''}.`,
    treatments.length > 0 ? `Treatment required: ${treatments.slice(0, 2).join('; ')}.` : 'No treatment expected.',
    validationScore !== null ? `Lab validation: ${validationScore}% of predictions within 30% of actual values.` : 'No lab data provided for validation.',
    `Confidence: ${(predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length * 100).toFixed(0)}%.`
  ].join(' ');
  
  const avgConf = predictions.length > 0 ? predictions.reduce((s, p) => s + p.confidence, 0) / predictions.length : 0.5;
  
  return {
    predictions,
    overallQuality,
    potabilityScore,
    waterType,
    waterTypeDescription: waterTypeDesc,
    primaryConcerns: concerns,
    treatmentRequired: treatments,
    treatmentCost,
    validation,
    validationScore_pct: validationScore,
    parametersToTest: [...new Set(parametersToTest)],
    monitoringFrequency: monFreq,
    recommendations: recs,
    narrative,
    confidence: Math.round(avgConf * 100) / 100
  };
}
