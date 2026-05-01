// Predictive AI Engine for Generator Failure Prediction

export type UrgencyLevel = 'immediate' | 'within-week' | 'within-month' | 'scheduled';
export type SymptomCategory = 'oil' | 'exhaust' | 'temperature' | 'power' | 'starting' | 'noise' | 'vibration' | 'fuel';

export interface PredictiveRule {
  id: string;
  symptom: string;
  inputField: string;
  category: SymptomCategory;
  threshold: { warning: number | string; critical: number | string };
  prediction: string;
  probability: number;
  urgency: UrgencyLevel;
  consequence: string;
  preventiveAction: string;
  estimatedRepairCost: { min: number; max: number };
  estimatedDowntimeCost: number;
  linkedParts: string[];
  linkedGuides: string[];
  linkedFaultCodes: string[];
}

export interface SymptomInput {
  // Oil related
  oilConsumptionRate?: number; // L/hour
  oilCondition?: 'clean' | 'dark' | 'milky' | 'metallic';
  oilPressure?: number; // bar

  // Exhaust related
  exhaustSmokeColor?: 'none' | 'white' | 'blue' | 'black' | 'grey';
  exhaustSmokeAmount?: 'none' | 'light' | 'moderate' | 'heavy';
  exhaustSmokeTiming?: 'startup' | 'idle' | 'load' | 'constant';

  // Temperature related
  coolantTemp?: number; // °C
  tempRiseRate?: 'normal' | 'fast' | 'very-fast';
  ambientTemp?: number; // °C

  // Power related
  maxLoadCapacity?: number; // percentage (can it reach 100%?)
  voltageStability?: 'stable' | 'fluctuating' | 'dropping';
  frequencyStability?: 'stable' | 'fluctuating' | 'hunting';

  // Starting related
  startingBehavior?: 'instant' | 'slow' | 'difficult' | 'no-start';
  crankingSpeed?: 'normal' | 'slow' | 'very-slow';
  startsRequired?: number; // attempts before starting

  // Noise related
  noiseLevel?: 'normal' | 'increased' | 'excessive';
  noiseType?: 'none' | 'knocking' | 'rattling' | 'whistling' | 'grinding';
  noiseLocation?: 'engine' | 'turbo' | 'alternator' | 'exhaust' | 'unknown';

  // Vibration related
  vibrationLevel?: 'normal' | 'increased' | 'excessive';
  vibrationSource?: 'engine' | 'alternator' | 'coupling' | 'unknown';

  // Fuel related
  fuelConsumption?: number; // L/hour at specified load
  fuelLoadPercentage?: number; // load when measuring consumption

  // General
  engineHours?: number;
  lastServiceHours?: number;
  generatorAge?: number; // years
}

export interface PredictionResult {
  prediction: string;
  probability: number;
  urgency: UrgencyLevel;
  consequence: string;
  preventiveAction: string;
  estimatedRepairCost: { min: number; max: number };
  estimatedDowntimeCost: number;
  savingsIfFixedNow: number;
  linkedParts: string[];
  linkedGuides: string[];
  linkedFaultCodes: string[];
  riskScore: number; // 0-100
}

export const predictiveRules: PredictiveRule[] = [
  // Oil System Predictions
  {
    id: 'high-oil-consumption',
    symptom: 'Oil consumption rate exceeds 0.5L per running hour',
    inputField: 'oilConsumptionRate',
    category: 'oil',
    threshold: { warning: 0.3, critical: 0.5 },
    prediction: 'Piston rings likely worn. High probability of failure within 200 running hours if not addressed.',
    probability: 85,
    urgency: 'within-week',
    consequence: 'Continued operation will lead to complete ring failure, potential cylinder scoring, and catastrophic engine damage costing 3-5x the repair cost.',
    preventiveAction: 'Schedule engine overhaul including piston ring replacement. Test compression before proceeding.',
    estimatedRepairCost: { min: 150000, max: 350000 },
    estimatedDowntimeCost: 45000,
    linkedParts: ['piston-ring-set-4cyl', 'piston-ring-set-6cyl', 'valve-seal-set'],
    linkedGuides: ['piston-ring-compression', 'oil-leak-valve-seals'],
    linkedFaultCodes: ['DSE-1441', 'DSE-1442', 'CUM-145']
  },
  {
    id: 'low-oil-pressure',
    symptom: 'Oil pressure below 2 bar at operating temperature',
    inputField: 'oilPressure',
    category: 'oil',
    threshold: { warning: 2.5, critical: 2.0 },
    prediction: 'Main bearings or oil pump showing wear. Engine internals at risk.',
    probability: 75,
    urgency: 'immediate',
    consequence: 'Running with low oil pressure causes rapid bearing wear, potential crankshaft damage, and risk of engine seizure.',
    preventiveAction: 'Stop generator immediately. Inspect oil pump, main bearings, and check for oil leaks.',
    estimatedRepairCost: { min: 80000, max: 250000 },
    estimatedDowntimeCost: 75000,
    linkedParts: ['main-bearing-set', 'oil-filter'],
    linkedGuides: ['generator-wont-start'],
    linkedFaultCodes: ['DSE-1411', 'DSE-1412', 'CUM-141', 'CUM-142']
  },
  {
    id: 'milky-oil',
    symptom: 'Engine oil appears milky or has water contamination',
    inputField: 'oilCondition',
    category: 'oil',
    threshold: { warning: 'dark', critical: 'milky' },
    prediction: 'Head gasket failure or cracked cylinder head allowing coolant into oil system.',
    probability: 90,
    urgency: 'immediate',
    consequence: 'Water in oil destroys bearing surfaces rapidly. Continued operation will cause complete engine failure.',
    preventiveAction: 'Do not run engine. Drain oil, pressure test cooling system, inspect head gasket.',
    estimatedRepairCost: { min: 45000, max: 180000 },
    estimatedDowntimeCost: 85000,
    linkedParts: ['head-gasket-4cyl'],
    linkedGuides: ['overheating'],
    linkedFaultCodes: ['DSE-2158', 'DSE-2159', 'CUM-361']
  },
  {
    id: 'metallic-oil',
    symptom: 'Metal particles visible in engine oil',
    inputField: 'oilCondition',
    category: 'oil',
    threshold: { warning: 'dark', critical: 'metallic' },
    prediction: 'Active wear of internal components - bearings, rings, or gears degrading.',
    probability: 95,
    urgency: 'immediate',
    consequence: 'Metal particles cause accelerated wear throughout the engine, leading to rapid failure.',
    preventiveAction: 'Stop engine. Send oil sample for analysis to identify wear source. Plan for major repair.',
    estimatedRepairCost: { min: 200000, max: 500000 },
    estimatedDowntimeCost: 120000,
    linkedParts: ['main-bearing-set', 'piston-ring-set-6cyl'],
    linkedGuides: ['piston-ring-compression'],
    linkedFaultCodes: ['DSE-1524', 'DSE-1525', 'CUM-215', 'CUM-216']
  },

  // Exhaust Smoke Predictions
  {
    id: 'blue-smoke-startup',
    symptom: 'Blue/grey smoke at startup that clears after warming',
    inputField: 'exhaustSmokeColor',
    category: 'exhaust',
    threshold: { warning: 'grey', critical: 'blue' },
    prediction: 'Valve stem seals wearing, allowing oil to seep past valves when engine is cold.',
    probability: 80,
    urgency: 'within-month',
    consequence: 'Progressive oil consumption increase. Eventually causes spark plug/injector fouling and catalytic damage if equipped.',
    preventiveAction: 'Schedule valve seal replacement during next planned maintenance.',
    estimatedRepairCost: { min: 35000, max: 85000 },
    estimatedDowntimeCost: 25000,
    linkedParts: ['valve-seal-set'],
    linkedGuides: ['oil-leak-valve-seals'],
    linkedFaultCodes: ['DSE-1443', 'CUM-148']
  },
  {
    id: 'blue-smoke-constant',
    symptom: 'Constant blue smoke during operation',
    inputField: 'exhaustSmokeColor',
    category: 'exhaust',
    threshold: { warning: 'grey', critical: 'blue' },
    prediction: 'Piston rings or turbocharger seals failed. Oil entering combustion chamber continuously.',
    probability: 85,
    urgency: 'within-week',
    consequence: 'Rapid oil consumption, environmental violations, and risk of complete engine failure.',
    preventiveAction: 'Perform compression test and turbo inspection to isolate cause before repair.',
    estimatedRepairCost: { min: 150000, max: 400000 },
    estimatedDowntimeCost: 65000,
    linkedParts: ['piston-ring-set-6cyl', 'valve-seal-set'],
    linkedGuides: ['piston-ring-compression', 'turbo-inspection'],
    linkedFaultCodes: ['DSE-1441', 'DSE-2261', 'CUM-145', 'CUM-431']
  },
  {
    id: 'black-smoke',
    symptom: 'Black smoke under load indicates incomplete combustion',
    inputField: 'exhaustSmokeColor',
    category: 'exhaust',
    threshold: { warning: 'grey', critical: 'black' },
    prediction: 'Fuel system issue - likely clogged injectors, air filter restriction, or turbo underperformance.',
    probability: 75,
    urgency: 'within-week',
    consequence: 'Poor fuel economy, reduced power, accelerated engine wear from unburned fuel washing cylinders.',
    preventiveAction: 'Check air filter restriction, test turbo boost, clean or test injectors.',
    estimatedRepairCost: { min: 25000, max: 150000 },
    estimatedDowntimeCost: 35000,
    linkedParts: ['fuel-injector', 'air-filter', 'fuel-filter-secondary'],
    linkedGuides: ['black-smoke-exhaust'],
    linkedFaultCodes: ['DSE-1611', 'DSE-2261', 'CUM-271', 'CUM-431']
  },
  {
    id: 'white-smoke',
    symptom: 'White smoke (steam) from exhaust',
    inputField: 'exhaustSmokeColor',
    category: 'exhaust',
    threshold: { warning: 'none', critical: 'white' },
    prediction: 'Coolant entering combustion chamber - head gasket failure or cracked head.',
    probability: 90,
    urgency: 'immediate',
    consequence: 'Coolant loss leads to overheating. Water in cylinders can cause hydrolock and catastrophic damage.',
    preventiveAction: 'Stop engine immediately. Pressure test cooling system. Inspect for head gasket failure.',
    estimatedRepairCost: { min: 45000, max: 200000 },
    estimatedDowntimeCost: 95000,
    linkedParts: ['head-gasket-4cyl'],
    linkedGuides: ['overheating'],
    linkedFaultCodes: ['DSE-2158', 'DSE-2159', 'CUM-361']
  },

  // Temperature Predictions
  {
    id: 'fast-temp-rise',
    symptom: 'Engine temperature rising faster than normal',
    inputField: 'tempRiseRate',
    category: 'temperature',
    threshold: { warning: 'fast', critical: 'very-fast' },
    prediction: 'Cooling system efficiency degraded - possible thermostat, water pump, or radiator issue.',
    probability: 70,
    urgency: 'within-week',
    consequence: 'Progressive overheating will cause head gasket failure, warped head, or engine seizure.',
    preventiveAction: 'Inspect cooling system: check coolant level, thermostat operation, water pump, radiator blockage.',
    estimatedRepairCost: { min: 15000, max: 95000 },
    estimatedDowntimeCost: 45000,
    linkedParts: ['water-pump', 'thermostat', 'radiator-hose-upper'],
    linkedGuides: ['overheating'],
    linkedFaultCodes: ['DSE-2151', 'DSE-2153', 'DSE-2155', 'CUM-351', 'CUM-354']
  },
  {
    id: 'high-coolant-temp',
    symptom: 'Coolant temperature exceeding 95°C under normal load',
    inputField: 'coolantTemp',
    category: 'temperature',
    threshold: { warning: 92, critical: 98 },
    prediction: 'Cooling system unable to maintain safe operating temperature.',
    probability: 80,
    urgency: 'within-week',
    consequence: 'Overheating causes thermal stress, accelerated wear, and risk of catastrophic failure.',
    preventiveAction: 'Full cooling system inspection and service. Check radiator fins, fan operation, coolant condition.',
    estimatedRepairCost: { min: 25000, max: 120000 },
    estimatedDowntimeCost: 55000,
    linkedParts: ['water-pump', 'thermostat', 'fan-belt-v', 'coolant-additive'],
    linkedGuides: ['overheating'],
    linkedFaultCodes: ['DSE-2151', 'DSE-2152', 'CUM-351']
  },

  // Power Output Predictions
  {
    id: 'reduced-load-capacity',
    symptom: 'Generator cannot reach 100% rated load',
    inputField: 'maxLoadCapacity',
    category: 'power',
    threshold: { warning: 90, critical: 75 },
    prediction: 'Multiple possible causes: fuel restriction (60%), turbo issue (25%), or electrical fault (15%).',
    probability: 65,
    urgency: 'within-week',
    consequence: 'Cannot meet load demands. Risk of overloading engine and causing further damage.',
    preventiveAction: 'Systematic check: fuel filters, turbo boost, injector condition, air filter, electrical output.',
    estimatedRepairCost: { min: 15000, max: 180000 },
    estimatedDowntimeCost: 75000,
    linkedParts: ['fuel-filter-primary', 'fuel-filter-secondary', 'air-filter', 'avr-unit'],
    linkedGuides: ['low-power-output', 'black-smoke-exhaust'],
    linkedFaultCodes: ['DSE-3141', 'DSE-3142', 'DSE-2261']
  },
  {
    id: 'voltage-instability',
    symptom: 'Output voltage fluctuating or dropping under load',
    inputField: 'voltageStability',
    category: 'power',
    threshold: { warning: 'fluctuating', critical: 'dropping' },
    prediction: 'AVR fault or alternator excitation issue. Electrical system needs attention.',
    probability: 80,
    urgency: 'within-week',
    consequence: 'Unstable power damages connected equipment. Risk of complete power loss under load.',
    preventiveAction: 'Check AVR adjustment, brush wear, excitation circuit, and alternator windings.',
    estimatedRepairCost: { min: 25000, max: 150000 },
    estimatedDowntimeCost: 85000,
    linkedParts: ['avr-unit', 'carbon-brush-set', 'rectifier-diode-kit'],
    linkedGuides: ['low-power-output'],
    linkedFaultCodes: ['DSE-3141', 'DSE-3142', 'DSE-3143', 'CUM-541']
  },
  {
    id: 'frequency-hunting',
    symptom: 'Frequency unstable or hunting (varying ±2Hz or more)',
    inputField: 'frequencyStability',
    category: 'power',
    threshold: { warning: 'fluctuating', critical: 'hunting' },
    prediction: 'Governor or speed sensing issue - MPU, actuator, or governor settings.',
    probability: 75,
    urgency: 'within-week',
    consequence: 'Unstable frequency damages motors and sensitive equipment. Creates harmonic issues.',
    preventiveAction: 'Check magnetic pickup signal, governor actuator, and governor gain settings.',
    estimatedRepairCost: { min: 15000, max: 85000 },
    estimatedDowntimeCost: 65000,
    linkedParts: ['magnetic-pickup'],
    linkedGuides: ['mpu-replacement'],
    linkedFaultCodes: ['DSE-4211', 'DSE-4212', 'CUM-115']
  },

  // Starting Predictions
  {
    id: 'difficult-starting',
    symptom: 'Engine requires multiple attempts to start',
    inputField: 'startingBehavior',
    category: 'starting',
    threshold: { warning: 'slow', critical: 'difficult' },
    prediction: 'Fuel system, battery, or compression issue affecting cold start capability.',
    probability: 70,
    urgency: 'within-week',
    consequence: 'Starting reliability compromised. Risk of no-start condition at critical time.',
    preventiveAction: 'Check battery condition, fuel priming, glow plugs (if equipped), and compression.',
    estimatedRepairCost: { min: 8000, max: 65000 },
    estimatedDowntimeCost: 55000,
    linkedParts: ['fuel-filter-primary', 'fuel-solenoid', 'starter-motor', 'battery-charger'],
    linkedGuides: ['generator-wont-start'],
    linkedFaultCodes: ['DSE-4261', 'DSE-4271', 'DSE-1621']
  },
  {
    id: 'slow-cranking',
    symptom: 'Engine cranking slowly during start attempts',
    inputField: 'crankingSpeed',
    category: 'starting',
    threshold: { warning: 'slow', critical: 'very-slow' },
    prediction: 'Battery weak, starter motor failing, or engine mechanical resistance increased.',
    probability: 75,
    urgency: 'within-week',
    consequence: 'Slow cranking prevents proper fuel injection timing, causing hard starting and potential no-start.',
    preventiveAction: 'Load test battery, check starter motor current draw, verify engine turns freely.',
    estimatedRepairCost: { min: 15000, max: 95000 },
    estimatedDowntimeCost: 45000,
    linkedParts: ['starter-motor', 'battery-charger'],
    linkedGuides: ['generator-wont-start'],
    linkedFaultCodes: ['DSE-4261', 'DSE-4262', 'CUM-621']
  },

  // Noise Predictions
  {
    id: 'knocking-noise',
    symptom: 'Knocking or banging noise from engine',
    inputField: 'noiseType',
    category: 'noise',
    threshold: { warning: 'rattling', critical: 'knocking' },
    prediction: 'Bearing wear, loose connecting rod, or piston slap indicating serious internal wear.',
    probability: 85,
    urgency: 'immediate',
    consequence: 'Knocking indicates imminent failure - continued operation risks catastrophic engine damage.',
    preventiveAction: 'Stop engine immediately. Inspect bearings, connecting rods, and pistons before further operation.',
    estimatedRepairCost: { min: 150000, max: 450000 },
    estimatedDowntimeCost: 150000,
    linkedParts: ['main-bearing-set', 'piston-ring-set-6cyl'],
    linkedGuides: ['piston-ring-compression'],
    linkedFaultCodes: ['DSE-1524', 'DSE-1525', 'CUM-215', 'CUM-216']
  },
  {
    id: 'turbo-whistle-change',
    symptom: 'Turbocharger whistle has changed pitch or character',
    inputField: 'noiseType',
    category: 'noise',
    threshold: { warning: 'rattling', critical: 'whistling' },
    prediction: 'Turbo bearing wear, impeller damage, or boost leak affecting turbo operation.',
    probability: 70,
    urgency: 'within-week',
    consequence: 'Failing turbo can shed debris into engine, causing cylinder damage. Performance loss.',
    preventiveAction: 'Inspect turbo shaft play, check for boost leaks, examine impeller for damage.',
    estimatedRepairCost: { min: 85000, max: 350000 },
    estimatedDowntimeCost: 75000,
    linkedParts: [],
    linkedGuides: ['turbo-inspection'],
    linkedFaultCodes: ['DSE-2261', 'DSE-2262', 'CUM-431', 'CUM-432']
  },
  {
    id: 'grinding-noise',
    symptom: 'Grinding noise from starter or alternator area',
    inputField: 'noiseType',
    category: 'noise',
    threshold: { warning: 'rattling', critical: 'grinding' },
    prediction: 'Starter bendix or alternator bearings failing.',
    probability: 80,
    urgency: 'within-week',
    consequence: 'Complete starter or alternator failure causing no-start or loss of power generation.',
    preventiveAction: 'Identify source - if starter, check bendix engagement. If alternator, check bearing play.',
    estimatedRepairCost: { min: 35000, max: 150000 },
    estimatedDowntimeCost: 55000,
    linkedParts: ['starter-motor', 'carbon-brush-set'],
    linkedGuides: ['generator-wont-start'],
    linkedFaultCodes: ['DSE-4261', 'DSE-3111']
  },

  // Vibration Predictions
  {
    id: 'excessive-vibration',
    symptom: 'Excessive vibration during operation',
    inputField: 'vibrationLevel',
    category: 'vibration',
    threshold: { warning: 'increased', critical: 'excessive' },
    prediction: 'Engine mounts worn, coupling misalignment, or internal imbalance issue.',
    probability: 65,
    urgency: 'within-week',
    consequence: 'Excessive vibration causes accelerated wear on all components and potential structural damage.',
    preventiveAction: 'Check engine mounts, coupling alignment, and look for cylinder misfiring.',
    estimatedRepairCost: { min: 25000, max: 120000 },
    estimatedDowntimeCost: 45000,
    linkedParts: [],
    linkedGuides: ['generator-wont-start'],
    linkedFaultCodes: ['DSE-1611', 'CUM-271']
  },

  // Fuel Consumption Predictions
  {
    id: 'high-fuel-consumption',
    symptom: 'Fuel consumption higher than rated specifications',
    inputField: 'fuelConsumption',
    category: 'fuel',
    threshold: { warning: 1.1, critical: 1.25 }, // multiplier of rated
    prediction: 'Efficiency loss from injectors, air restriction, or engine wear.',
    probability: 70,
    urgency: 'within-month',
    consequence: 'Increased operating costs. May indicate developing problems that will worsen.',
    preventiveAction: 'Service fuel system, check injector spray patterns, verify air filter condition.',
    estimatedRepairCost: { min: 15000, max: 85000 },
    estimatedDowntimeCost: 25000,
    linkedParts: ['fuel-injector', 'fuel-filter-primary', 'fuel-filter-secondary', 'air-filter'],
    linkedGuides: ['black-smoke-exhaust'],
    linkedFaultCodes: ['DSE-1611', 'DSE-1631', 'CUM-271', 'CUM-291']
  }
];

// Analyze symptoms and generate predictions
export function analyzeSymptoms(input: SymptomInput): PredictionResult[] {
  const results: PredictionResult[] = [];

  // Oil consumption analysis
  if (input.oilConsumptionRate !== undefined) {
    const rule = predictiveRules.find(r => r.id === 'high-oil-consumption');
    if (rule && input.oilConsumptionRate >= (rule.threshold.critical as number)) {
      results.push(createResult(rule, 1.0));
    } else if (rule && input.oilConsumptionRate >= (rule.threshold.warning as number)) {
      results.push(createResult(rule, 0.7));
    }
  }

  // Oil pressure analysis
  if (input.oilPressure !== undefined) {
    const rule = predictiveRules.find(r => r.id === 'low-oil-pressure');
    if (rule && input.oilPressure <= (rule.threshold.critical as number)) {
      results.push(createResult(rule, 1.0));
    } else if (rule && input.oilPressure <= (rule.threshold.warning as number)) {
      results.push(createResult(rule, 0.7));
    }
  }

  // Oil condition analysis
  if (input.oilCondition) {
    if (input.oilCondition === 'milky') {
      const rule = predictiveRules.find(r => r.id === 'milky-oil');
      if (rule) results.push(createResult(rule, 1.0));
    } else if (input.oilCondition === 'metallic') {
      const rule = predictiveRules.find(r => r.id === 'metallic-oil');
      if (rule) results.push(createResult(rule, 1.0));
    }
  }

  // Exhaust smoke analysis
  if (input.exhaustSmokeColor && input.exhaustSmokeColor !== 'none') {
    if (input.exhaustSmokeColor === 'blue') {
      const timing = input.exhaustSmokeTiming;
      if (timing === 'startup') {
        const rule = predictiveRules.find(r => r.id === 'blue-smoke-startup');
        if (rule) results.push(createResult(rule, 1.0));
      } else {
        const rule = predictiveRules.find(r => r.id === 'blue-smoke-constant');
        if (rule) results.push(createResult(rule, 1.0));
      }
    } else if (input.exhaustSmokeColor === 'black') {
      const rule = predictiveRules.find(r => r.id === 'black-smoke');
      if (rule) results.push(createResult(rule, 1.0));
    } else if (input.exhaustSmokeColor === 'white') {
      const rule = predictiveRules.find(r => r.id === 'white-smoke');
      if (rule) results.push(createResult(rule, 1.0));
    }
  }

  // Temperature analysis
  if (input.coolantTemp !== undefined) {
    const rule = predictiveRules.find(r => r.id === 'high-coolant-temp');
    if (rule && input.coolantTemp >= (rule.threshold.critical as number)) {
      results.push(createResult(rule, 1.0));
    } else if (rule && input.coolantTemp >= (rule.threshold.warning as number)) {
      results.push(createResult(rule, 0.7));
    }
  }

  if (input.tempRiseRate && input.tempRiseRate !== 'normal') {
    const rule = predictiveRules.find(r => r.id === 'fast-temp-rise');
    if (rule) {
      const severity = input.tempRiseRate === 'very-fast' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  // Power output analysis
  if (input.maxLoadCapacity !== undefined) {
    const rule = predictiveRules.find(r => r.id === 'reduced-load-capacity');
    if (rule && input.maxLoadCapacity <= (rule.threshold.critical as number)) {
      results.push(createResult(rule, 1.0));
    } else if (rule && input.maxLoadCapacity <= (rule.threshold.warning as number)) {
      results.push(createResult(rule, 0.7));
    }
  }

  if (input.voltageStability && input.voltageStability !== 'stable') {
    const rule = predictiveRules.find(r => r.id === 'voltage-instability');
    if (rule) {
      const severity = input.voltageStability === 'dropping' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  if (input.frequencyStability && input.frequencyStability !== 'stable') {
    const rule = predictiveRules.find(r => r.id === 'frequency-hunting');
    if (rule) {
      const severity = input.frequencyStability === 'hunting' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  // Starting analysis
  if (input.startingBehavior && input.startingBehavior !== 'instant') {
    const rule = predictiveRules.find(r => r.id === 'difficult-starting');
    if (rule) {
      const severity = input.startingBehavior === 'difficult' || input.startingBehavior === 'no-start' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  if (input.crankingSpeed && input.crankingSpeed !== 'normal') {
    const rule = predictiveRules.find(r => r.id === 'slow-cranking');
    if (rule) {
      const severity = input.crankingSpeed === 'very-slow' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  // Noise analysis
  if (input.noiseType && input.noiseType !== 'none') {
    if (input.noiseType === 'knocking') {
      const rule = predictiveRules.find(r => r.id === 'knocking-noise');
      if (rule) results.push(createResult(rule, 1.0));
    } else if (input.noiseType === 'whistling' && input.noiseLocation === 'turbo') {
      const rule = predictiveRules.find(r => r.id === 'turbo-whistle-change');
      if (rule) results.push(createResult(rule, 1.0));
    } else if (input.noiseType === 'grinding') {
      const rule = predictiveRules.find(r => r.id === 'grinding-noise');
      if (rule) results.push(createResult(rule, 1.0));
    }
  }

  // Vibration analysis
  if (input.vibrationLevel && input.vibrationLevel !== 'normal') {
    const rule = predictiveRules.find(r => r.id === 'excessive-vibration');
    if (rule) {
      const severity = input.vibrationLevel === 'excessive' ? 1.0 : 0.7;
      results.push(createResult(rule, severity));
    }
  }

  // Sort by risk score (urgency + probability)
  return results.sort((a, b) => b.riskScore - a.riskScore);
}

function createResult(rule: PredictiveRule, severityMultiplier: number): PredictionResult {
  const adjustedProbability = Math.round(rule.probability * severityMultiplier);
  const riskScore = calculateRiskScore(rule.urgency, adjustedProbability);
  const savingsIfFixedNow = calculateSavings(rule, severityMultiplier);

  return {
    prediction: rule.prediction,
    probability: adjustedProbability,
    urgency: rule.urgency,
    consequence: rule.consequence,
    preventiveAction: rule.preventiveAction,
    estimatedRepairCost: rule.estimatedRepairCost,
    estimatedDowntimeCost: rule.estimatedDowntimeCost,
    savingsIfFixedNow,
    linkedParts: rule.linkedParts,
    linkedGuides: rule.linkedGuides,
    linkedFaultCodes: rule.linkedFaultCodes,
    riskScore
  };
}

function calculateRiskScore(urgency: UrgencyLevel, probability: number): number {
  const urgencyScore: Record<UrgencyLevel, number> = {
    'immediate': 40,
    'within-week': 30,
    'within-month': 20,
    'scheduled': 10
  };
  return urgencyScore[urgency] + (probability * 0.6);
}

function calculateSavings(rule: PredictiveRule, severityMultiplier: number): number {
  // Estimate: if ignored, repair cost increases 2-4x plus downtime cost
  const currentRepairCost = (rule.estimatedRepairCost.min + rule.estimatedRepairCost.max) / 2;
  const futureRepairCost = currentRepairCost * (2 + severityMultiplier);
  const additionalDowntime = rule.estimatedDowntimeCost * severityMultiplier;
  return Math.round(futureRepairCost + additionalDowntime - currentRepairCost);
}

// Urgency colors and labels
export const urgencyColors: Record<UrgencyLevel, string> = {
  'immediate': '#EF4444', // Red
  'within-week': '#F59E0B', // Amber
  'within-month': '#3B82F6', // Blue
  'scheduled': '#10B981' // Green
};

export const urgencyLabels: Record<UrgencyLevel, string> = {
  'immediate': 'Immediate Action Required',
  'within-week': 'Address Within 1 Week',
  'within-month': 'Schedule Within 1 Month',
  'scheduled': 'Add to Scheduled Maintenance'
};
