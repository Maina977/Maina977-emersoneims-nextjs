// Schematic Data for Interactive Generator Diagrams

export type GeneratorSystem = 'engine' | 'fuel' | 'cooling' | 'exhaust' | 'electrical' | 'control';

export interface SchematicPart {
  id: string;
  name: string;
  system: GeneratorSystem;
  position: { x: number; y: number };
  partNumber: string;
  estimatedPrice: { min: number; max: number };
  lifespan: string;
  failureSymptoms: string[];
  linkedFaultCodes: string[];
  replacementGuideId: string;
  description: string;
  criticalLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface SystemLayer {
  id: GeneratorSystem;
  name: string;
  color: string;
  description: string;
  parts: SchematicPart[];
}

// Engine System Parts
const engineParts: SchematicPart[] = [
  {
    id: 'piston-rings',
    name: 'Piston Rings',
    system: 'engine',
    position: { x: 45, y: 35 },
    partNumber: 'PR-4089500',
    estimatedPrice: { min: 15000, max: 45000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Excessive oil consumption', 'Blue smoke from exhaust', 'Loss of compression', 'Increased blow-by'],
    linkedFaultCodes: ['DSE-1441', 'DSE-1442', 'CUM-145'],
    replacementGuideId: 'piston-ring-replacement',
    description: 'Sealing rings between piston and cylinder wall. Critical for compression and oil control.',
    criticalLevel: 'high'
  },
  {
    id: 'valve-seals',
    name: 'Valve Seals',
    system: 'engine',
    position: { x: 55, y: 25 },
    partNumber: 'VS-3802820',
    estimatedPrice: { min: 8000, max: 25000 },
    lifespan: '6,000 - 10,000 hours',
    failureSymptoms: ['Blue smoke at startup', 'Oil consumption increase', 'Rough idle'],
    linkedFaultCodes: ['DSE-1443', 'CUM-148'],
    replacementGuideId: 'valve-seal-replacement',
    description: 'Seals on valve stems preventing oil from entering combustion chamber.',
    criticalLevel: 'medium'
  },
  {
    id: 'crankshaft',
    name: 'Crankshaft',
    system: 'engine',
    position: { x: 50, y: 65 },
    partNumber: 'CS-3965010',
    estimatedPrice: { min: 150000, max: 450000 },
    lifespan: '20,000+ hours',
    failureSymptoms: ['Knocking noise', 'Excessive vibration', 'Oil pressure drop', 'Metal particles in oil'],
    linkedFaultCodes: ['DSE-1524', 'DSE-1525', 'CUM-215'],
    replacementGuideId: 'crankshaft-inspection',
    description: 'Main rotating shaft converting linear piston motion to rotational force.',
    criticalLevel: 'critical'
  },
  {
    id: 'cylinder-head',
    name: 'Cylinder Head',
    system: 'engine',
    position: { x: 50, y: 20 },
    partNumber: 'CH-4089478',
    estimatedPrice: { min: 120000, max: 350000 },
    lifespan: '15,000+ hours',
    failureSymptoms: ['Coolant in oil', 'White smoke', 'Overheating', 'Loss of coolant'],
    linkedFaultCodes: ['DSE-1531', 'DSE-2158', 'CUM-352'],
    replacementGuideId: 'cylinder-head-inspection',
    description: 'Houses valves, injectors, and forms combustion chamber ceiling.',
    criticalLevel: 'critical'
  },
  {
    id: 'head-gasket',
    name: 'Head Gasket',
    system: 'engine',
    position: { x: 50, y: 28 },
    partNumber: 'HG-4089349',
    estimatedPrice: { min: 12000, max: 35000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Coolant mixing with oil', 'White exhaust smoke', 'Overheating', 'Bubbles in coolant'],
    linkedFaultCodes: ['DSE-2158', 'DSE-2159', 'CUM-361'],
    replacementGuideId: 'head-gasket-replacement',
    description: 'Seals the junction between engine block and cylinder head.',
    criticalLevel: 'high'
  },
  {
    id: 'main-bearings',
    name: 'Main Bearings',
    system: 'engine',
    position: { x: 45, y: 60 },
    partNumber: 'MB-3802070',
    estimatedPrice: { min: 25000, max: 75000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Low oil pressure', 'Knocking at low RPM', 'Metal in oil', 'Increased engine noise'],
    linkedFaultCodes: ['DSE-1411', 'DSE-1524', 'CUM-143'],
    replacementGuideId: 'bearing-replacement',
    description: 'Support the crankshaft and allow smooth rotation.',
    criticalLevel: 'critical'
  },
  {
    id: 'connecting-rod',
    name: 'Connecting Rod',
    system: 'engine',
    position: { x: 48, y: 50 },
    partNumber: 'CR-3934566',
    estimatedPrice: { min: 35000, max: 95000 },
    lifespan: '15,000+ hours',
    failureSymptoms: ['Knocking noise', 'Vibration', 'Sudden power loss'],
    linkedFaultCodes: ['DSE-1525', 'CUM-216'],
    replacementGuideId: 'connecting-rod-inspection',
    description: 'Links piston to crankshaft, converting linear to rotational motion.',
    criticalLevel: 'critical'
  },
  {
    id: 'oil-pump',
    name: 'Oil Pump',
    system: 'engine',
    position: { x: 35, y: 70 },
    partNumber: 'OP-4935792',
    estimatedPrice: { min: 45000, max: 120000 },
    lifespan: '12,000 - 18,000 hours',
    failureSymptoms: ['Low oil pressure', 'Engine noise', 'Oil pressure warning'],
    linkedFaultCodes: ['DSE-1411', 'DSE-1412', 'CUM-142'],
    replacementGuideId: 'oil-pump-replacement',
    description: 'Circulates oil throughout the engine for lubrication.',
    criticalLevel: 'high'
  }
];

// Fuel System Parts
const fuelParts: SchematicPart[] = [
  {
    id: 'injector-nozzle',
    name: 'Fuel Injector Nozzle',
    system: 'fuel',
    position: { x: 60, y: 25 },
    partNumber: 'FI-4928990',
    estimatedPrice: { min: 25000, max: 85000 },
    lifespan: '6,000 - 10,000 hours',
    failureSymptoms: ['Black smoke', 'Rough running', 'Power loss', 'Poor fuel economy', 'Misfiring'],
    linkedFaultCodes: ['DSE-1611', 'DSE-1612', 'CUM-271', 'CUM-272'],
    replacementGuideId: 'injector-replacement',
    description: 'Atomizes fuel for combustion. Critical for efficiency and emissions.',
    criticalLevel: 'high'
  },
  {
    id: 'fuel-pump',
    name: 'Fuel Injection Pump',
    system: 'fuel',
    position: { x: 30, y: 40 },
    partNumber: 'FP-4954200',
    estimatedPrice: { min: 150000, max: 450000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Hard starting', 'Power fluctuation', 'Engine stalling', 'Fuel leaks'],
    linkedFaultCodes: ['DSE-1621', 'DSE-1622', 'CUM-284', 'CUM-285'],
    replacementGuideId: 'fuel-pump-overhaul',
    description: 'High-pressure pump delivering fuel to injectors at precise timing.',
    criticalLevel: 'critical'
  },
  {
    id: 'fuel-filter-primary',
    name: 'Primary Fuel Filter',
    system: 'fuel',
    position: { x: 20, y: 50 },
    partNumber: 'FF-3890017',
    estimatedPrice: { min: 2500, max: 8000 },
    lifespan: '500 - 1,000 hours',
    failureSymptoms: ['Power loss under load', 'Hard starting', 'Engine surging'],
    linkedFaultCodes: ['DSE-1631', 'CUM-291'],
    replacementGuideId: 'fuel-filter-replacement',
    description: 'First-stage fuel filtration removing larger particles.',
    criticalLevel: 'low'
  },
  {
    id: 'fuel-filter-secondary',
    name: 'Secondary Fuel Filter',
    system: 'fuel',
    position: { x: 25, y: 45 },
    partNumber: 'FF-3890018',
    estimatedPrice: { min: 3500, max: 12000 },
    lifespan: '500 - 1,000 hours',
    failureSymptoms: ['Power loss', 'Rough idle', 'Injector damage signs'],
    linkedFaultCodes: ['DSE-1632', 'CUM-292'],
    replacementGuideId: 'fuel-filter-replacement',
    description: 'Fine filtration protecting injectors from contamination.',
    criticalLevel: 'medium'
  },
  {
    id: 'fuel-lines',
    name: 'High Pressure Fuel Lines',
    system: 'fuel',
    position: { x: 40, y: 35 },
    partNumber: 'FL-3944842',
    estimatedPrice: { min: 8000, max: 25000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Fuel leaks', 'Fuel smell', 'Hard starting', 'Fire hazard'],
    linkedFaultCodes: ['DSE-1641', 'CUM-297'],
    replacementGuideId: 'fuel-line-replacement',
    description: 'High-pressure lines from pump to injectors.',
    criticalLevel: 'high'
  },
  {
    id: 'priming-pump',
    name: 'Fuel Priming Pump',
    system: 'fuel',
    position: { x: 15, y: 55 },
    partNumber: 'PP-4937766',
    estimatedPrice: { min: 5000, max: 15000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['Hard priming', 'Air in fuel system', 'Difficulty starting after service'],
    linkedFaultCodes: ['DSE-1651'],
    replacementGuideId: 'priming-pump-replacement',
    description: 'Manual pump for bleeding air from fuel system.',
    criticalLevel: 'low'
  }
];

// Cooling System Parts
const coolingParts: SchematicPart[] = [
  {
    id: 'radiator',
    name: 'Radiator',
    system: 'cooling',
    position: { x: 15, y: 30 },
    partNumber: 'RAD-3970185',
    estimatedPrice: { min: 85000, max: 250000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Overheating', 'Coolant loss', 'Visible leaks', 'Coolant smell'],
    linkedFaultCodes: ['DSE-2151', 'DSE-2152', 'CUM-351'],
    replacementGuideId: 'radiator-replacement',
    description: 'Heat exchanger dissipating engine heat to atmosphere.',
    criticalLevel: 'high'
  },
  {
    id: 'water-pump',
    name: 'Water Pump',
    system: 'cooling',
    position: { x: 40, y: 45 },
    partNumber: 'WP-4891252',
    estimatedPrice: { min: 35000, max: 95000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Overheating', 'Coolant leak at pump', 'Bearing noise', 'Steam from engine'],
    linkedFaultCodes: ['DSE-2153', 'DSE-2154', 'CUM-354'],
    replacementGuideId: 'water-pump-replacement',
    description: 'Circulates coolant through engine and radiator.',
    criticalLevel: 'high'
  },
  {
    id: 'thermostat',
    name: 'Thermostat',
    system: 'cooling',
    position: { x: 55, y: 40 },
    partNumber: 'TH-3076489',
    estimatedPrice: { min: 3500, max: 12000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['Overheating', 'Engine running cold', 'Slow warm-up', 'Temperature fluctuation'],
    linkedFaultCodes: ['DSE-2155', 'DSE-2156', 'CUM-356'],
    replacementGuideId: 'thermostat-replacement',
    description: 'Regulates coolant flow based on engine temperature.',
    criticalLevel: 'medium'
  },
  {
    id: 'coolant-hoses',
    name: 'Coolant Hoses',
    system: 'cooling',
    position: { x: 30, y: 35 },
    partNumber: 'CH-3920709',
    estimatedPrice: { min: 5000, max: 18000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['Coolant leaks', 'Soft or swollen hoses', 'Cracks', 'Overheating'],
    linkedFaultCodes: ['DSE-2157', 'CUM-358'],
    replacementGuideId: 'coolant-hose-replacement',
    description: 'Rubber hoses connecting cooling system components.',
    criticalLevel: 'medium'
  },
  {
    id: 'fan-belt',
    name: 'Fan Belt / Drive Belt',
    system: 'cooling',
    position: { x: 20, y: 55 },
    partNumber: 'FB-3911562',
    estimatedPrice: { min: 2500, max: 8000 },
    lifespan: '3,000 - 5,000 hours',
    failureSymptoms: ['Squealing noise', 'Overheating', 'Belt wear/cracks', 'Battery not charging'],
    linkedFaultCodes: ['DSE-2161', 'CUM-362'],
    replacementGuideId: 'fan-belt-replacement',
    description: 'Drives cooling fan and often alternator.',
    criticalLevel: 'medium'
  },
  {
    id: 'cooling-fan',
    name: 'Cooling Fan',
    system: 'cooling',
    position: { x: 10, y: 35 },
    partNumber: 'CF-3970521',
    estimatedPrice: { min: 25000, max: 75000 },
    lifespan: '10,000+ hours',
    failureSymptoms: ['Overheating at low RPM', 'Fan blade damage', 'Vibration'],
    linkedFaultCodes: ['DSE-2162', 'CUM-363'],
    replacementGuideId: 'cooling-fan-replacement',
    description: 'Pulls air through radiator for cooling.',
    criticalLevel: 'medium'
  }
];

// Exhaust System Parts
const exhaustParts: SchematicPart[] = [
  {
    id: 'exhaust-manifold',
    name: 'Exhaust Manifold',
    system: 'exhaust',
    position: { x: 70, y: 30 },
    partNumber: 'EM-3937477',
    estimatedPrice: { min: 45000, max: 120000 },
    lifespan: '12,000+ hours',
    failureSymptoms: ['Exhaust leak noise', 'Power loss', 'Exhaust smell in enclosure', 'Cracks'],
    linkedFaultCodes: ['DSE-2251', 'CUM-421'],
    replacementGuideId: 'exhaust-manifold-inspection',
    description: 'Collects exhaust from cylinders and directs to turbo/muffler.',
    criticalLevel: 'medium'
  },
  {
    id: 'turbocharger',
    name: 'Turbocharger',
    system: 'exhaust',
    position: { x: 75, y: 35 },
    partNumber: 'TC-4955305',
    estimatedPrice: { min: 180000, max: 450000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Black smoke', 'Loss of power', 'Whistling noise change', 'Oil in exhaust', 'Slow spool-up'],
    linkedFaultCodes: ['DSE-2261', 'DSE-2262', 'CUM-431', 'CUM-432'],
    replacementGuideId: 'turbo-inspection',
    description: 'Uses exhaust energy to compress intake air for more power.',
    criticalLevel: 'high'
  },
  {
    id: 'muffler',
    name: 'Exhaust Muffler',
    system: 'exhaust',
    position: { x: 85, y: 45 },
    partNumber: 'MF-3949159',
    estimatedPrice: { min: 35000, max: 95000 },
    lifespan: '10,000+ hours',
    failureSymptoms: ['Loud exhaust', 'Rust/holes', 'Exhaust smell', 'Backpressure issues'],
    linkedFaultCodes: ['DSE-2271'],
    replacementGuideId: 'muffler-replacement',
    description: 'Reduces exhaust noise and directs gases safely.',
    criticalLevel: 'low'
  },
  {
    id: 'exhaust-valves',
    name: 'Exhaust Valves',
    system: 'exhaust',
    position: { x: 58, y: 22 },
    partNumber: 'EV-3802359',
    estimatedPrice: { min: 15000, max: 45000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Loss of compression', 'Burnt valve sound', 'Power loss', 'Black exhaust'],
    linkedFaultCodes: ['DSE-2281', 'CUM-441'],
    replacementGuideId: 'valve-replacement',
    description: 'Opens to release exhaust gases from combustion chamber.',
    criticalLevel: 'high'
  },
  {
    id: 'inlet-valves',
    name: 'Inlet Valves',
    system: 'exhaust',
    position: { x: 52, y: 22 },
    partNumber: 'IV-3802358',
    estimatedPrice: { min: 12000, max: 38000 },
    lifespan: '10,000 - 15,000 hours',
    failureSymptoms: ['Poor idle', 'Loss of power', 'Carbon buildup', 'Compression loss'],
    linkedFaultCodes: ['DSE-2282', 'CUM-442'],
    replacementGuideId: 'valve-replacement',
    description: 'Opens to allow air/fuel mixture into combustion chamber.',
    criticalLevel: 'high'
  }
];

// Electrical System Parts
const electricalParts: SchematicPart[] = [
  {
    id: 'alternator',
    name: 'Alternator / Generator Head',
    system: 'electrical',
    position: { x: 75, y: 55 },
    partNumber: 'ALT-4936879',
    estimatedPrice: { min: 250000, max: 850000 },
    lifespan: '15,000+ hours',
    failureSymptoms: ['No output', 'Voltage fluctuation', 'Overheating', 'Bearing noise'],
    linkedFaultCodes: ['DSE-3111', 'DSE-3112', 'CUM-511'],
    replacementGuideId: 'alternator-inspection',
    description: 'Converts mechanical energy to electrical power.',
    criticalLevel: 'critical'
  },
  {
    id: 'stator',
    name: 'Stator Winding',
    system: 'electrical',
    position: { x: 78, y: 52 },
    partNumber: 'ST-4936880',
    estimatedPrice: { min: 120000, max: 350000 },
    lifespan: '12,000+ hours',
    failureSymptoms: ['Reduced output', 'Overheating', 'Insulation breakdown', 'Phase imbalance'],
    linkedFaultCodes: ['DSE-3121', 'DSE-3122', 'CUM-521'],
    replacementGuideId: 'stator-testing',
    description: 'Stationary windings where power is generated.',
    criticalLevel: 'critical'
  },
  {
    id: 'rotor',
    name: 'Rotor / Exciter',
    system: 'electrical',
    position: { x: 72, y: 52 },
    partNumber: 'RT-4936881',
    estimatedPrice: { min: 85000, max: 250000 },
    lifespan: '12,000+ hours',
    failureSymptoms: ['No excitation', 'Voltage instability', 'Bearing noise'],
    linkedFaultCodes: ['DSE-3131', 'DSE-3132', 'CUM-531'],
    replacementGuideId: 'rotor-inspection',
    description: 'Rotating component providing magnetic field for generation.',
    criticalLevel: 'critical'
  },
  {
    id: 'avr',
    name: 'Automatic Voltage Regulator (AVR)',
    system: 'electrical',
    position: { x: 82, y: 60 },
    partNumber: 'AVR-4936882',
    estimatedPrice: { min: 35000, max: 150000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Voltage hunting', 'Over/under voltage', 'Unstable output', 'Generator trips'],
    linkedFaultCodes: ['DSE-3141', 'DSE-3142', 'DSE-3143', 'CUM-541'],
    replacementGuideId: 'avr-replacement',
    description: 'Regulates output voltage by controlling excitation.',
    criticalLevel: 'high'
  },
  {
    id: 'rectifier',
    name: 'Rectifier / Diode Bridge',
    system: 'electrical',
    position: { x: 80, y: 65 },
    partNumber: 'REC-4936883',
    estimatedPrice: { min: 15000, max: 55000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Low output', 'AC in DC circuit', 'Overheating', 'Diode failure'],
    linkedFaultCodes: ['DSE-3151', 'CUM-551'],
    replacementGuideId: 'rectifier-replacement',
    description: 'Converts AC to DC for excitation and battery charging.',
    criticalLevel: 'medium'
  },
  {
    id: 'brushes',
    name: 'Carbon Brushes',
    system: 'electrical',
    position: { x: 76, y: 58 },
    partNumber: 'BR-4936884',
    estimatedPrice: { min: 5000, max: 18000 },
    lifespan: '4,000 - 6,000 hours',
    failureSymptoms: ['Sparking', 'Voltage fluctuation', 'Brush dust', 'No excitation'],
    linkedFaultCodes: ['DSE-3161', 'CUM-561'],
    replacementGuideId: 'brush-replacement',
    description: 'Transfers current to rotating rotor (in brushed designs).',
    criticalLevel: 'medium'
  },
  {
    id: 'wiring-harness',
    name: 'Main Wiring Harness',
    system: 'electrical',
    position: { x: 65, y: 70 },
    partNumber: 'WH-4936885',
    estimatedPrice: { min: 25000, max: 85000 },
    lifespan: '10,000+ hours',
    failureSymptoms: ['Intermittent faults', 'Burnt wires', 'Loose connections', 'Multiple errors'],
    linkedFaultCodes: ['DSE-3171', 'DSE-3172'],
    replacementGuideId: 'wiring-inspection',
    description: 'Main electrical distribution throughout generator.',
    criticalLevel: 'high'
  }
];

// Control System Parts
const controlParts: SchematicPart[] = [
  {
    id: 'controller-panel',
    name: 'Generator Controller',
    system: 'control',
    position: { x: 90, y: 30 },
    partNumber: 'DSE-7320',
    estimatedPrice: { min: 85000, max: 350000 },
    lifespan: '10,000+ hours',
    failureSymptoms: ['No display', 'Communication errors', 'Erratic behavior', 'No start signal'],
    linkedFaultCodes: ['DSE-4111', 'DSE-4112', 'DSE-4113'],
    replacementGuideId: 'controller-replacement',
    description: 'Main brain of the generator - monitors and controls all functions.',
    criticalLevel: 'critical'
  },
  {
    id: 'magnetic-pickup',
    name: 'Magnetic Pickup / Speed Sensor',
    system: 'control',
    position: { x: 55, y: 70 },
    partNumber: 'MPU-3034572',
    estimatedPrice: { min: 8000, max: 25000 },
    lifespan: '6,000 - 10,000 hours',
    failureSymptoms: ['Speed reading errors', 'Erratic frequency', 'No start', 'Overspeed trips'],
    linkedFaultCodes: ['DSE-4211', 'DSE-4212', 'CUM-115'],
    replacementGuideId: 'mpu-replacement',
    description: 'Senses engine RPM for speed/frequency control.',
    criticalLevel: 'high'
  },
  {
    id: 'oil-pressure-sensor',
    name: 'Oil Pressure Sensor',
    system: 'control',
    position: { x: 40, y: 75 },
    partNumber: 'OPS-3015237',
    estimatedPrice: { min: 5000, max: 18000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['False low oil alarms', 'No oil pressure reading', 'Erratic readings'],
    linkedFaultCodes: ['DSE-4221', 'DSE-1411', 'CUM-141'],
    replacementGuideId: 'sensor-replacement',
    description: 'Monitors engine oil pressure for protection.',
    criticalLevel: 'medium'
  },
  {
    id: 'temp-sensor',
    name: 'Coolant Temperature Sensor',
    system: 'control',
    position: { x: 45, y: 40 },
    partNumber: 'CTS-3015236',
    estimatedPrice: { min: 4000, max: 15000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['False high temp alarms', 'No temp reading', 'Erratic readings'],
    linkedFaultCodes: ['DSE-4231', 'DSE-2151', 'CUM-151'],
    replacementGuideId: 'sensor-replacement',
    description: 'Monitors engine temperature for overheat protection.',
    criticalLevel: 'medium'
  },
  {
    id: 'fuel-level-sensor',
    name: 'Fuel Level Sensor',
    system: 'control',
    position: { x: 18, y: 60 },
    partNumber: 'FLS-3015238',
    estimatedPrice: { min: 6000, max: 20000 },
    lifespan: '5,000 - 8,000 hours',
    failureSymptoms: ['Incorrect fuel reading', 'No fuel level display', 'False low fuel alarms'],
    linkedFaultCodes: ['DSE-4241', 'DSE-1681'],
    replacementGuideId: 'sensor-replacement',
    description: 'Monitors fuel tank level for low fuel warnings.',
    criticalLevel: 'low'
  },
  {
    id: 'battery-charger',
    name: 'Battery Charger',
    system: 'control',
    position: { x: 88, y: 45 },
    partNumber: 'BC-4936886',
    estimatedPrice: { min: 15000, max: 45000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['Battery not charging', 'Overcharging', 'Low battery voltage'],
    linkedFaultCodes: ['DSE-4251', 'DSE-4252', 'CUM-611'],
    replacementGuideId: 'charger-replacement',
    description: 'Keeps starter battery charged when generator is running.',
    criticalLevel: 'medium'
  },
  {
    id: 'starter-motor',
    name: 'Starter Motor',
    system: 'control',
    position: { x: 35, y: 55 },
    partNumber: 'SM-3957597',
    estimatedPrice: { min: 45000, max: 120000 },
    lifespan: '8,000 - 12,000 hours',
    failureSymptoms: ['No cranking', 'Slow cranking', 'Grinding noise', 'Starter stuck'],
    linkedFaultCodes: ['DSE-4261', 'DSE-4262', 'CUM-621'],
    replacementGuideId: 'starter-replacement',
    description: 'Electric motor that cranks engine for starting.',
    criticalLevel: 'high'
  },
  {
    id: 'solenoid',
    name: 'Fuel Solenoid / Run Solenoid',
    system: 'control',
    position: { x: 28, y: 48 },
    partNumber: 'SOL-3935649',
    estimatedPrice: { min: 12000, max: 35000 },
    lifespan: '6,000 - 10,000 hours',
    failureSymptoms: ['Engine won\'t stop', 'Engine won\'t start', 'Intermittent running'],
    linkedFaultCodes: ['DSE-4271', 'CUM-631'],
    replacementGuideId: 'solenoid-replacement',
    description: 'Controls fuel flow to engine for starting and stopping.',
    criticalLevel: 'medium'
  }
];

// Complete System Layers
export const systemLayers: SystemLayer[] = [
  {
    id: 'engine',
    name: 'Engine Block',
    color: '#EF4444', // Red
    description: 'Core mechanical components including pistons, crankshaft, and bearings',
    parts: engineParts
  },
  {
    id: 'fuel',
    name: 'Fuel System',
    color: '#F59E0B', // Amber
    description: 'Fuel delivery from tank through filters to injectors',
    parts: fuelParts
  },
  {
    id: 'cooling',
    name: 'Cooling System',
    color: '#06B6D4', // Cyan
    description: 'Temperature regulation via radiator, pump, and thermostat',
    parts: coolingParts
  },
  {
    id: 'exhaust',
    name: 'Exhaust System',
    color: '#8B5CF6', // Purple
    description: 'Exhaust gas flow from manifold through turbo to muffler',
    parts: exhaustParts
  },
  {
    id: 'electrical',
    name: 'Electrical System',
    color: '#10B981', // Emerald
    description: 'Power generation including alternator, stator, and AVR',
    parts: electricalParts
  },
  {
    id: 'control',
    name: 'Control System',
    color: '#3B82F6', // Blue
    description: 'Sensors, controller, and protective devices',
    parts: controlParts
  }
];

// Get all parts as flat array
export const getAllParts = (): SchematicPart[] => {
  return systemLayers.flatMap(layer => layer.parts);
};

// Get parts by system
export const getPartsBySystem = (system: GeneratorSystem): SchematicPart[] => {
  return systemLayers.find(layer => layer.id === system)?.parts || [];
};

// Get part by ID
export const getPartById = (id: string): SchematicPart | undefined => {
  return getAllParts().find(part => part.id === id);
};

// Search parts
export const searchParts = (query: string): SchematicPart[] => {
  const lowercaseQuery = query.toLowerCase();
  return getAllParts().filter(part =>
    part.name.toLowerCase().includes(lowercaseQuery) ||
    part.partNumber.toLowerCase().includes(lowercaseQuery) ||
    part.description.toLowerCase().includes(lowercaseQuery) ||
    part.failureSymptoms.some(symptom => symptom.toLowerCase().includes(lowercaseQuery))
  );
};
