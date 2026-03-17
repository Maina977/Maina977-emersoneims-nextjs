/**
 * Generator Oracle - Parts Compatibility Matrix
 *
 * EMERSON EIMS PROPRIETARY SYSTEM
 * All parts purchasing directed to Emerson EIMS Parts Department
 * No external supplier marketing
 *
 * Cross-reference system for generator parts:
 * - OEM part numbers to aftermarket equivalents
 * - Compatibility across brands and models
 * - Integration with fault code diagnostics
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PartNumber {
  number: string;
  brand: string;
  type: 'oem' | 'aftermarket' | 'generic';
}

export interface PartSupplier {
  name: string;
  location: string;
  priceKES: number;
  inStock: boolean;
  leadTimeDays: number;
  verified: boolean;
}

export interface GeneratorPart {
  id: string;
  name: string;
  category: PartCategory;
  description: string;
  technicalDetails: string;
  partNumbers: PartNumber[];
  compatibleModels: CompatibleModel[];
  specifications: Record<string, string>;
  installationNotes: string[];
  priceRange: 'budget' | 'mid-range' | 'premium';
  availability: 'in_stock' | 'order' | 'special_order';
  relatedParts: string[];
  relatedFaultCodes: string[];
  failureSymptoms: string[];
  diagnosticTips: string[];
  criticalPart: boolean;
  avgPriceKES?: number;
  suppliers?: PartSupplier[];
}

export type PartCategory =
  | 'filters'
  | 'belts'
  | 'electrical'
  | 'fuel_system'
  | 'cooling'
  | 'exhaust'
  | 'engine_internal'
  | 'alternator'
  | 'controller'
  | 'sensors'
  | 'gaskets_seals'
  | 'bearings'
  | 'starter'
  | 'actuators'
  | 'safety';

export interface CompatibleModel {
  brand: string;
  model: string;
  years?: string;
  notes?: string;
}

export interface PartSearchResult {
  part: GeneratorPart;
  matchScore: number;
  matchReason: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const PART_CATEGORIES: Record<PartCategory, { name: string; icon: string; description: string; seoKeywords: string[] }> = {
  filters: {
    name: 'Filters',
    icon: '🔲',
    description: 'Oil, fuel, air, and hydraulic filters for diesel generators',
    seoKeywords: ['oil filter Kenya', 'fuel filter generator', 'air filter diesel']
  },
  belts: {
    name: 'Belts & Hoses',
    icon: '🔗',
    description: 'Drive belts, fan belts, coolant hoses, and fuel lines',
    seoKeywords: ['generator belt Kenya', 'fan belt diesel', 'coolant hose']
  },
  electrical: {
    name: 'Electrical Components',
    icon: '⚡',
    description: 'Wiring, connectors, relays, and electrical components',
    seoKeywords: ['generator wiring Kenya', 'electrical parts', 'relay generator']
  },
  fuel_system: {
    name: 'Fuel System',
    icon: '⛽',
    description: 'Fuel pumps, injectors, lines, and delivery components',
    seoKeywords: ['fuel pump Kenya', 'diesel injector', 'fuel system parts']
  },
  cooling: {
    name: 'Cooling System',
    icon: '❄️',
    description: 'Radiators, water pumps, thermostats, and cooling components',
    seoKeywords: ['radiator Kenya', 'water pump generator', 'thermostat diesel']
  },
  exhaust: {
    name: 'Exhaust System',
    icon: '💨',
    description: 'Exhaust manifolds, mufflers, gaskets, and turbocharger components',
    seoKeywords: ['exhaust manifold Kenya', 'muffler generator', 'turbo parts']
  },
  engine_internal: {
    name: 'Engine Internal',
    icon: '⚙️',
    description: 'Pistons, rings, bearings, valves, and internal engine components',
    seoKeywords: ['piston rings Kenya', 'engine bearings', 'valve diesel']
  },
  alternator: {
    name: 'Alternator & AVR',
    icon: '🔌',
    description: 'AVR modules, brushes, bearings, and alternator components',
    seoKeywords: ['AVR Kenya', 'alternator parts', 'generator brushes']
  },
  controller: {
    name: 'Controllers & Modules',
    icon: '📟',
    description: 'DSE, ComAp, Cummins controllers and electronic modules',
    seoKeywords: ['DSE controller Kenya', 'ComAp module', 'generator controller']
  },
  sensors: {
    name: 'Sensors',
    icon: '📡',
    description: 'Temperature, pressure, speed, and level sensors',
    seoKeywords: ['temperature sensor Kenya', 'oil pressure sender', 'MPU sensor']
  },
  gaskets_seals: {
    name: 'Gaskets & Seals',
    icon: '🔘',
    description: 'Head gaskets, oil seals, O-rings, and sealing components',
    seoKeywords: ['head gasket Kenya', 'oil seal diesel', 'gasket set generator']
  },
  bearings: {
    name: 'Bearings',
    icon: '🎯',
    description: 'Engine and alternator bearings, bushings',
    seoKeywords: ['main bearing Kenya', 'alternator bearing', 'con rod bearing']
  },
  starter: {
    name: 'Starting System',
    icon: '🔋',
    description: 'Starter motors, solenoids, batteries, and charging components',
    seoKeywords: ['starter motor Kenya', 'battery generator', 'solenoid starter']
  },
  actuators: {
    name: 'Actuators & Governors',
    icon: '🎚️',
    description: 'Electronic actuators, governor assemblies, and speed control',
    seoKeywords: ['actuator Kenya', 'governor diesel', 'speed control generator']
  },
  safety: {
    name: 'Safety Devices',
    icon: '🛡️',
    description: 'Emergency stops, shutdown devices, and protection equipment',
    seoKeywords: ['emergency stop Kenya', 'safety relay', 'shutdown solenoid']
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS DATABASE - All purchasing directed to Emerson EIMS
// ═══════════════════════════════════════════════════════════════════════════════

export const PARTS_DATABASE: GeneratorPart[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'OIL_FILTER_001',
    name: 'Engine Oil Filter - Spin-On Type',
    category: 'filters',
    description: 'High-efficiency spin-on oil filter for diesel generator engines. Designed to remove contaminants down to 23 microns, protecting bearings, journals, and internal components from premature wear.',
    technicalDetails: 'This filter employs a cellulose and synthetic blend media with anti-drainback valve to prevent dry starts. The filter housing is constructed from corrosion-resistant steel with a heavy-duty gasket for reliable sealing.',
    partNumbers: [
      { number: '2654407', brand: 'Perkins', type: 'oem' },
      { number: 'LF3349', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'B7275', brand: 'Baldwin', type: 'aftermarket' },
      { number: '51348', brand: 'WIX', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '400 Series', years: '2008-2024' },
      { brand: 'Perkins', model: '1100 Series', years: '2010-2024' },
      { brand: 'FG Wilson', model: 'P50-P150', years: '2010-2024' }
    ],
    specifications: {
      'Thread Size': 'M22 x 1.5',
      'Overall Height': '95mm',
      'Outer Diameter': '76mm',
      'Bypass Valve Setting': '12 PSI',
      'Filtration Rating': '23 microns'
    },
    installationNotes: [
      'Clean filter mounting surface thoroughly before installation',
      'Apply thin film of clean engine oil to gasket surface',
      'Thread filter on until gasket contacts mounting surface',
      'Tighten additional 3/4 turn by hand - do not use tools',
      'Start engine and check for leaks at operating temperature',
      'Verify oil pressure is within normal range after installation'
    ],
    priceRange: 'budget',
    availability: 'in_stock',
    relatedParts: ['FUEL_FILTER_001', 'AIR_FILTER_001'],
    relatedFaultCodes: ['Low Oil Pressure', 'Oil Contamination', 'Bearing Failure'],
    failureSymptoms: [
      'Low oil pressure warning or shutdown',
      'Increased engine noise from bearings',
      'Contaminated oil on dipstick',
      'Shorter oil change intervals required'
    ],
    diagnosticTips: [
      'If low oil pressure occurs after filter change, verify correct filter was used',
      'Cut open old filter to inspect media for metal particles',
      'Black, gritty oil indicates filter capacity exhausted'
    ],
    criticalPart: true
  },
  {
    id: 'FUEL_FILTER_001',
    name: 'Primary Fuel Filter with Water Separator',
    category: 'filters',
    description: 'Primary fuel filtration element incorporating water separation capability. This critical component protects high-pressure fuel injection equipment from water damage and particulate contamination.',
    technicalDetails: 'The filter utilizes a coalescing media that causes small water droplets to combine into larger droplets that settle to the collection bowl. A drain valve allows periodic water removal. Filter media provides 10-micron particulate filtration.',
    partNumbers: [
      { number: '26560163', brand: 'Perkins', type: 'oem' },
      { number: 'FS19531', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'BF7675-D', brand: 'Baldwin', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '400-1100 Series', years: '2006-2024' },
      { brand: 'FG Wilson', model: 'P50-P220', years: '2008-2024' },
      { brand: 'SDMO', model: 'J Series', years: '2010-2024' }
    ],
    specifications: {
      'Thread Size': '1/2-14 NPT',
      'Overall Height': '145mm',
      'Outer Diameter': '93mm',
      'Water Separation': 'Yes - with drain',
      'Filtration Rating': '10 microns'
    },
    installationNotes: [
      'Drain water from existing filter bowl before removal',
      'Fill new filter with clean diesel fuel before installation',
      'Prime fuel system and bleed air from high-pressure lines',
      'Check water separator bowl for accumulation after 24 hours operation',
      'Never run engine without fuel filters installed'
    ],
    priceRange: 'budget',
    availability: 'in_stock',
    relatedParts: ['OIL_FILTER_001', 'FUEL_FILTER_002'],
    relatedFaultCodes: ['Fuel System Fault', 'Low Fuel Pressure', 'Water in Fuel', 'Fail to Start'],
    failureSymptoms: [
      'Hard starting or failure to start',
      'Engine surging or hunting',
      'Loss of power under load',
      'Injector damage (long-term neglect)'
    ],
    diagnosticTips: [
      'Check filter bowl for water accumulation before other fuel system tests',
      'Restricted filter causes vacuum at lift pump outlet',
      'White milky appearance in bowl indicates water contamination'
    ],
    criticalPart: true
  },
  {
    id: 'AIR_FILTER_001',
    name: 'Primary Air Filter Element',
    category: 'filters',
    description: 'Heavy-duty primary air filter element engineered for diesel generator applications in challenging environments. Provides 99.9% filtration efficiency to protect the engine from airborne contaminants.',
    technicalDetails: 'Radial seal design ensures positive sealing in the air cleaner housing. The pleated cellulose media provides maximum surface area for extended service life. Recommended service interval varies based on operating environment.',
    partNumbers: [
      { number: '26510342', brand: 'Perkins', type: 'oem' },
      { number: 'AF25539', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'PA2705', brand: 'Baldwin', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1000-1100 Series', years: '2008-2024' },
      { brand: 'FG Wilson', model: 'P65-P220', years: '2010-2024' },
      { brand: 'Cummins', model: 'C Series', years: '2008-2024' }
    ],
    specifications: {
      'Type': 'Radial Seal',
      'Overall Height': '350mm',
      'Outer Diameter': '210mm',
      'Inner Diameter': '120mm',
      'Filtration Efficiency': '99.9%'
    },
    installationNotes: [
      'Inspect housing and sealing surfaces before installing new element',
      'Never attempt to clean and reuse disposable filters',
      'Install safety element every third primary element change',
      'Reset service indicator if equipped',
      'Ensure filter is fully seated with no bypass gaps'
    ],
    priceRange: 'mid-range',
    availability: 'in_stock',
    relatedParts: ['AIR_FILTER_SAFETY_001'],
    relatedFaultCodes: ['Air Filter Restricted', 'Engine Derate', 'Black Smoke'],
    failureSymptoms: [
      'Black exhaust smoke under load',
      'Loss of power output',
      'Increased fuel consumption',
      'Air filter restriction indicator activated'
    ],
    diagnosticTips: [
      'In dusty Kenya conditions, check filter more frequently than standard intervals',
      'Hold filter up to light - visible light through media indicates remaining life',
      'Dust tracks on clean side of filter indicate seal leakage'
    ],
    criticalPart: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'TEMP_SENSOR_001',
    name: 'Coolant Temperature Sensor - NTC Thermistor',
    category: 'sensors',
    description: 'Precision coolant temperature sensing device for engine protection systems. This NTC thermistor provides accurate temperature measurement for controller monitoring and protection activation.',
    technicalDetails: 'The sensor uses a negative temperature coefficient thermistor element that decreases in resistance as temperature increases. Resistance at 20°C is approximately 2500 ohms, decreasing to approximately 100 ohms at 100°C.',
    partNumbers: [
      { number: '2848A127', brand: 'Perkins', type: 'oem' },
      { number: 'VDO 323-803-001-004D', brand: 'VDO', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '2000-2024' },
      { brand: 'Cummins', model: 'B/C Series', years: '2005-2024' },
      { brand: 'FG Wilson', model: 'All Models', years: '2005-2024' }
    ],
    specifications: {
      'Thread': '1/4" NPT',
      'Resistance at 20°C': '2000-3000 ohms',
      'Resistance at 100°C': '80-150 ohms',
      'Operating Range': '-40 to 150°C',
      'Sensor Type': 'NTC Thermistor'
    },
    installationNotes: [
      'Apply appropriate thread sealant rated for coolant exposure',
      'Do not use PTFE tape - use paste sealant instead',
      'Torque to specified value - over-tightening damages sensing element',
      'Ensure sensor tip contacts coolant flow',
      'Calibrate or verify controller reading after installation'
    ],
    priceRange: 'mid-range',
    availability: 'in_stock',
    relatedParts: ['OIL_PRESSURE_SENSOR_001', 'MPU_SENSOR_001'],
    relatedFaultCodes: ['High Temperature', 'Temp Sensor Open', 'Temp Sensor Short', 'Cooling System Fault'],
    failureSymptoms: [
      'Incorrect temperature display on controller',
      'High temperature shutdown with cold engine',
      'No temperature reading displayed',
      'Erratic temperature indications'
    ],
    diagnosticTips: [
      'Measure sensor resistance and compare to temperature/resistance chart',
      'Infinite resistance indicates open circuit - failed sensor',
      'Zero or very low resistance indicates shorted sensor',
      'Compare controller reading to infrared thermometer measurement'
    ],
    criticalPart: true
  },
  {
    id: 'OIL_PRESSURE_SENSOR_001',
    name: 'Oil Pressure Sensor - Variable Resistance',
    category: 'sensors',
    description: 'Engine oil pressure monitoring sensor providing continuous pressure indication to the generator controller. Essential for lubrication system protection and engine health monitoring.',
    technicalDetails: 'This variable resistance sender uses a diaphragm and wiper mechanism to change resistance proportional to applied pressure. Typical range is 10 ohms at zero pressure increasing to 180 ohms at maximum pressure.',
    partNumbers: [
      { number: '185246190', brand: 'Perkins', type: 'oem' },
      { number: 'VDO 360-081-030-014C', brand: 'VDO', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '1995-2024' },
      { brand: 'Cummins', model: 'All Series', years: '2000-2024' },
      { brand: 'John Deere', model: 'PowerTech', years: '2005-2024' }
    ],
    specifications: {
      'Thread': '1/8" NPT',
      'Pressure Range': '0-10 bar',
      'Resistance Range': '10-180 ohms',
      'Warning Point': '0.5 bar',
      'Shutdown Point': '0.3 bar'
    },
    installationNotes: [
      'Use appropriate thread sealant on sensor threads',
      'Install in location with direct oil gallery access',
      'Do not over-torque - damages internal diaphragm',
      'Verify pressure reading with mechanical gauge after installation',
      'Check for leaks with engine running'
    ],
    priceRange: 'mid-range',
    availability: 'in_stock',
    relatedParts: ['TEMP_SENSOR_001', 'OIL_FILTER_001'],
    relatedFaultCodes: ['Low Oil Pressure', 'Oil Pressure Sensor Fault', 'Lubrication System Warning'],
    failureSymptoms: [
      'Low oil pressure alarm with adequate oil level',
      'No oil pressure indication on gauge',
      'Erratic oil pressure readings',
      'Oil pressure alarm only at certain engine speeds'
    ],
    diagnosticTips: [
      'Always verify actual oil pressure with mechanical gauge first',
      'Check sensor wiring before condemning sensor',
      'Low readings may indicate genuine low pressure - check oil level'
    ],
    criticalPart: true
  },
  {
    id: 'MPU_SENSOR_001',
    name: 'Magnetic Pickup Unit (MPU) Speed Sensor',
    category: 'sensors',
    description: 'Engine speed sensing device that reads flywheel teeth to provide RPM signal for the controller and electronic governor. Critical for speed control, protection, and synchronization functions.',
    technicalDetails: 'The MPU generates an AC voltage as ferrous teeth pass the magnetic sensor tip. Voltage amplitude and frequency increase with engine speed. Output is typically 0.5-1.5V at cranking speed and 5-40V at rated speed.',
    partNumbers: [
      { number: 'MSP6714', brand: 'Cummins', type: 'oem' },
      { number: '3034572', brand: 'Cummins', type: 'oem' },
      { number: 'GAC MSP676', brand: 'GAC', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Cummins', model: 'All Series', years: '1990-2024' },
      { brand: 'Caterpillar', model: '3300-3400 Series', years: '1995-2024' },
      { brand: 'Perkins', model: '1000-2000 Series', years: '2000-2024' }
    ],
    specifications: {
      'Thread': '5/8-18 UNF',
      'Output Voltage': '1-150 VAC',
      'Air Gap': '0.5-1.0mm',
      'Resistance': '880-1200 ohms',
      'Frequency Range': '0-10kHz'
    },
    installationNotes: [
      'Set air gap to specification using feeler gauge (0.5-1.0mm typical)',
      'Thread sensor in until it contacts tooth, then back out 1/2-1 turn',
      'Apply thread locker to prevent vibration loosening',
      'Route cable away from high-voltage ignition/injection wiring',
      'Verify signal with oscilloscope if starting problems persist'
    ],
    priceRange: 'mid-range',
    availability: 'in_stock',
    relatedParts: ['ACTUATOR_001'],
    relatedFaultCodes: ['No Speed Signal', 'Speed Sensor Fault', 'Fail to Start', 'Over Speed', 'Under Speed'],
    failureSymptoms: [
      'Engine cranks but does not start (no speed signal)',
      'Speed reading erratic or missing',
      'Overspeed shutdown with engine at normal speed',
      'Governor hunting or surging'
    ],
    diagnosticTips: [
      'Check sensor resistance - should be 880-1200 ohms',
      'Measure AC voltage while cranking - should be >0.5V',
      'Weak signal at crank speed may indicate excessive air gap'
    ],
    criticalPart: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ACTUATORS & GOVERNORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ACTUATOR_001',
    name: 'Electronic Governor Actuator',
    category: 'actuators',
    description: 'Proportional electronic actuator for diesel engine fuel control. Receives PWM signal from electronic governor controller and positions fuel rack for precise speed regulation.',
    technicalDetails: 'The actuator uses a brushed DC motor with integral position feedback. Response time is typically 50-100ms for full stroke. Output torque must overcome fuel rack friction and return spring forces.',
    partNumbers: [
      { number: 'ADC120', brand: 'GAC', type: 'oem' },
      { number: 'ADD175', brand: 'Woodward', type: 'oem' },
      { number: 'ACD175', brand: 'Generic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Universal', model: 'Electronic Governor Systems', notes: 'Verify actuator specifications match engine requirements' }
    ],
    specifications: {
      'Input Signal': 'PWM or 20-180mA',
      'Operating Voltage': '12V or 24V DC',
      'Rotation': '30-40 degrees',
      'Response Time': '<100ms',
      'Operating Temperature': '-40 to +85°C'
    },
    installationNotes: [
      'Verify actuator voltage matches system voltage',
      'Adjust linkage for proper travel - actuator should not bottom out',
      'Set minimum fuel stop so engine can shut down completely',
      'Set maximum fuel stop to prevent overfueling',
      'Calibrate governor controller after actuator replacement'
    ],
    priceRange: 'premium',
    availability: 'order',
    relatedParts: ['MPU_SENSOR_001', 'CONTROLLER_001'],
    relatedFaultCodes: ['Actuator Fault', 'Governor Fault', 'Speed Control Error', 'Engine Hunting'],
    failureSymptoms: [
      'Engine speed hunting or surging',
      'Unable to reach rated speed',
      'Engine runs away (stuck open)',
      'Engine will not shut down (stuck open)'
    ],
    diagnosticTips: [
      'Check actuator coil resistance - compare to specification',
      'Verify linkage moves freely without binding',
      'Monitor position feedback signal if equipped',
      'Many actuator problems are actually linkage issues'
    ],
    criticalPart: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AVR & ALTERNATOR
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'AVR_001',
    name: 'Automatic Voltage Regulator (AVR)',
    category: 'alternator',
    description: 'Electronic voltage regulation module that maintains stable generator output voltage by controlling alternator excitation current. Essential for voltage quality and equipment protection.',
    technicalDetails: 'The AVR senses generator output voltage and compares it to an internal reference. Error signal drives output stage to adjust excitation current, maintaining voltage within +/- 1% under varying load conditions.',
    partNumbers: [
      { number: 'R250', brand: 'Leroy Somer', type: 'oem' },
      { number: 'MX341', brand: 'Stamford', type: 'oem' },
      { number: 'SE350', brand: 'Marathon', type: 'oem' },
      { number: 'EA05A', brand: 'Generic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Leroy Somer', model: 'LSA Series', years: '2000-2024' },
      { brand: 'Stamford', model: 'UC/HC Series', years: '2000-2024' },
      { brand: 'Marathon', model: 'DVR Series', years: '2005-2024' }
    ],
    specifications: {
      'Input Voltage': '95-130 VAC sensing',
      'Output Voltage': '0-110 VDC',
      'Regulation Accuracy': '+/- 1%',
      'Sensing Mode': '1-phase or 3-phase',
      'Adjustment Range': '+/- 5%'
    },
    installationNotes: [
      'Match AVR to alternator brand and model - not interchangeable',
      'Connect sensing leads to correct phase(s)',
      'Adjust voltage potentiometer with calibrated voltmeter',
      'Set stability adjustment to mid-range initially',
      'Test under load to verify regulation performance'
    ],
    priceRange: 'premium',
    availability: 'order',
    relatedParts: ['CARBON_BRUSHES_001', 'DIODE_SET_001'],
    relatedFaultCodes: ['Under Voltage', 'Over Voltage', 'AVR Fault', 'Excitation Fault'],
    failureSymptoms: [
      'No voltage output from generator',
      'Voltage too high or too low',
      'Voltage fluctuating or hunting',
      'Voltage spikes damaging connected equipment'
    ],
    diagnosticTips: [
      'Verify AVR has power and sensing voltage before condemning',
      'Test by applying manual excitation (field flashing)',
      'Check for loss of residual magnetism if no output',
      'Inspect carbon brushes and slip rings on brushed alternators'
    ],
    criticalPart: true
  },
  {
    id: 'CARBON_BRUSHES_001',
    name: 'Carbon Brush Set - Alternator',
    category: 'alternator',
    description: 'Replacement carbon brushes for alternator exciter circuits. These wear items require periodic replacement based on running hours and operating conditions.',
    technicalDetails: 'Electrographite composition brushes designed for slip ring contact applications. Spring-loaded holders maintain proper contact pressure as brushes wear. Wear indicators show remaining service life.',
    partNumbers: [
      { number: 'E0001', brand: 'Stamford', type: 'oem' },
      { number: '33-2103', brand: 'Leroy Somer', type: 'oem' },
      { number: 'CB-EG332', brand: 'Generic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Stamford', model: 'All brushed models', years: '1990-2024' },
      { brand: 'Leroy Somer', model: 'All brushed models', years: '1990-2024' }
    ],
    specifications: {
      'Material': 'Electrographite',
      'Typical Size': '32 x 16 x 12.5mm',
      'Spring Pressure': '180-250 g/cm²',
      'Grade': 'EG332 or equivalent'
    },
    installationNotes: [
      'Check brush holder condition and replace if damaged',
      'Verify spring pressure is within specification',
      'Bed new brushes to slip ring curvature if possible',
      'Inspect slip ring surface - resurface if grooved',
      'Replace brushes when worn to indicator line'
    ],
    priceRange: 'budget',
    availability: 'in_stock',
    relatedParts: ['AVR_001', 'SLIP_RINGS_001'],
    relatedFaultCodes: ['Under Voltage', 'Excitation Fault', 'Voltage Fluctuation'],
    failureSymptoms: [
      'Intermittent voltage output',
      'Sparking visible at brush holder area',
      'Voltage drops under load',
      'Complete loss of excitation'
    ],
    diagnosticTips: [
      'Brushes worn past indicator line need immediate replacement',
      'Check brush movement in holder - should slide freely',
      'Inspect slip ring surface for grooves or discoloration'
    ],
    criticalPart: false
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'WATER_PUMP_001',
    name: 'Engine Water Pump Assembly',
    category: 'cooling',
    description: 'Centrifugal coolant circulation pump that moves coolant through the engine and radiator. Maintains proper cooling system flow for engine temperature control.',
    technicalDetails: 'The pump uses a cast impeller driven by the engine through belt or gear. A mechanical face seal prevents coolant leakage past the shaft. Weep hole indicates seal failure before catastrophic leakage.',
    partNumbers: [
      { number: 'U5MW0194', brand: 'Perkins', type: 'oem' },
      { number: '4131A062', brand: 'Perkins', type: 'oem' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1100 Series', years: '2006-2024' },
      { brand: 'FG Wilson', model: 'P65-P150', years: '2008-2024' }
    ],
    specifications: {
      'Drive': 'Belt driven',
      'Bearing Type': 'Sealed for life',
      'Impeller Material': 'Cast iron',
      'Seal Type': 'Mechanical face seal',
      'Flow Rate': '150 L/min @ 2500 RPM'
    },
    installationNotes: [
      'Replace gasket with new - do not reuse old gasket',
      'Check belt tension and condition after installation',
      'Fill cooling system completely and bleed air pockets',
      'Run engine to operating temperature and recheck level',
      'Inspect for leaks at all connection points'
    ],
    priceRange: 'premium',
    availability: 'order',
    relatedParts: ['THERMOSTAT_001', 'FAN_BELT_001'],
    relatedFaultCodes: ['High Temperature', 'Low Coolant Flow', 'Coolant Leak'],
    failureSymptoms: [
      'Engine overheating at normal load',
      'Coolant leaking from weep hole',
      'Bearing noise from water pump area',
      'Coolant visible under generator'
    ],
    diagnosticTips: [
      'Check weep hole for coolant - indicates failing seal',
      'Feel for pump shaft play indicating bearing wear',
      'Compare upper and lower hose temperatures',
      'Restricted flow causes upper hose to be much hotter than lower'
    ],
    criticalPart: true
  },
  {
    id: 'THERMOSTAT_001',
    name: 'Engine Thermostat',
    category: 'cooling',
    description: 'Wax-element thermostat that regulates coolant flow to maintain optimal engine operating temperature. Remains closed when engine is cold, opening progressively as temperature rises.',
    technicalDetails: 'The thermostat contains a wax pellet that expands when heated, pushing a piston to open the valve. Opening temperature is calibrated at manufacture. Bypass provision allows coolant circulation through engine while thermostat is closed.',
    partNumbers: [
      { number: '2485C026', brand: 'Perkins', type: 'oem' },
      { number: '145206320', brand: 'Perkins', type: 'oem' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '1990-2024' },
      { brand: 'Cummins', model: 'B Series', years: '1995-2024' }
    ],
    specifications: {
      'Opening Temperature': '82°C',
      'Full Open Temperature': '95°C',
      'Valve Lift': '8-10mm',
      'Type': 'Wax pellet with bypass'
    },
    installationNotes: [
      'Test thermostat in hot water before installation if possible',
      'Note any directional markings - install correctly oriented',
      'Replace housing gasket with new',
      'Bleed air from cooling system after installation',
      'Verify temperature stabilizes at correct level'
    ],
    priceRange: 'budget',
    availability: 'in_stock',
    relatedParts: ['WATER_PUMP_001', 'TEMP_SENSOR_001'],
    relatedFaultCodes: ['High Temperature', 'Overcooling', 'Temperature Unstable'],
    failureSymptoms: [
      'Engine overheating - thermostat stuck closed',
      'Engine runs too cool - thermostat stuck open',
      'Temperature gauge fluctuates widely',
      'Poor heater output (if equipped)'
    ],
    diagnosticTips: [
      'Feel both radiator hoses when warm - should both be hot if thermostat open',
      'Stuck closed: upper hose hot, lower hose cold',
      'Stuck open: engine takes very long to warm up'
    ],
    criticalPart: true
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STARTER SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'STARTER_MOTOR_001',
    name: 'Starter Motor - 24V Heavy Duty',
    category: 'starter',
    description: 'Heavy-duty starter motor engineered for diesel generator starting applications. Designed for high-torque cranking and frequent start cycles typical of standby generator duty.',
    technicalDetails: 'This gear-reduction starter motor provides high cranking torque while reducing current draw compared to direct-drive designs. The solenoid engages the pinion with the flywheel ring gear before energizing the main motor.',
    partNumbers: [
      { number: '2873K404', brand: 'Perkins', type: 'oem' },
      { number: 'M93R3001SE', brand: 'Prestolite', type: 'oem' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1100-1300 Series', years: '2005-2024' },
      { brand: 'Cummins', model: 'B5.9-C8.3', years: '2000-2024' },
      { brand: 'FG Wilson', model: 'P100-P300', years: '2005-2024' }
    ],
    specifications: {
      'Voltage': '24V DC',
      'Power': '5.5 kW',
      'Pinion Teeth': '10',
      'Rotation': 'CW from pinion end',
      'Mounting': '3-bolt flange'
    },
    installationNotes: [
      'Disconnect battery negative terminal before removal',
      'Inspect flywheel ring gear for damaged teeth',
      'Apply anti-seize compound to mounting bolts',
      'Verify proper pinion engagement depth',
      'Test cranking current draw after installation'
    ],
    priceRange: 'premium',
    availability: 'order',
    relatedParts: ['STARTER_SOLENOID_001', 'BATTERY_001'],
    relatedFaultCodes: ['Fail to Start', 'Cranking Fault', 'Low Cranking Speed', 'Starter Fault'],
    failureSymptoms: [
      'No cranking when start commanded',
      'Slow cranking speed',
      'Grinding noise during cranking',
      'Click but no motor rotation'
    ],
    diagnosticTips: [
      'Check battery voltage and connections first',
      'Measure voltage at starter terminal during crank attempt',
      'High current draw indicates worn motor or engine problem',
      'Grinding may indicate worn ring gear teeth'
    ],
    criticalPart: true
  },
  {
    id: 'BATTERY_001',
    name: 'Starting Battery - Deep Cycle',
    category: 'starter',
    description: 'Deep-cycle starting battery designed for generator standby and starting applications. Provides reliable starting power and withstands frequent charge/discharge cycles.',
    technicalDetails: 'Flooded lead-acid battery with heavy-duty plates designed for high cranking current and deep discharge tolerance. Maintenance requirements include periodic water addition and terminal cleaning.',
    partNumbers: [
      { number: 'N100', brand: 'Chloride Exide', type: 'oem' },
      { number: '31-900', brand: 'Trojan', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Universal', model: '12V Generator Systems', notes: 'Use 2 in series for 24V systems' }
    ],
    specifications: {
      'Voltage': '12V',
      'Capacity': '100Ah @ 20hr rate',
      'CCA': '800A',
      'Type': 'Flooded Lead Acid',
      'Terminal Type': 'Automotive post'
    },
    installationNotes: [
      'Check polarity before connecting - reverse polarity damages equipment',
      'Apply terminal grease after connecting cables',
      'Verify battery charger output voltage is correct for battery type',
      'Set float charge voltage to 13.6-13.8V per 12V battery',
      'Check electrolyte level monthly in flooded batteries'
    ],
    priceRange: 'mid-range',
    availability: 'in_stock',
    relatedParts: ['BATTERY_CHARGER_001', 'STARTER_MOTOR_001'],
    relatedFaultCodes: ['Low Battery', 'Fail to Start', 'Battery Charger Fault', 'Cranking Fault'],
    failureSymptoms: [
      'Slow cranking or failure to crank',
      'Low battery alarm on controller',
      'Generator fails to start in auto mode',
      'Battery will not hold charge'
    ],
    diagnosticTips: [
      'Load test battery - should maintain >10.5V under load',
      'Check specific gravity in each cell (flooded type)',
      'Verify charger is functioning and providing correct voltage',
      'Replace batteries every 3-5 years regardless of condition'
    ],
    criticalPart: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS SERVICE FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

class PartsCompatibilityService {
  searchByPartNumber(partNumber: string): PartSearchResult[] {
    const normalizedQuery = partNumber.toUpperCase().replace(/[-\s]/g, '');
    const results: PartSearchResult[] = [];

    for (const part of PARTS_DATABASE) {
      for (const pn of part.partNumbers) {
        const normalizedPN = pn.number.toUpperCase().replace(/[-\s]/g, '');
        if (normalizedPN.includes(normalizedQuery) || normalizedQuery.includes(normalizedPN)) {
          results.push({
            part,
            matchScore: normalizedPN === normalizedQuery ? 100 : 80,
            matchReason: `Part number match: ${pn.brand} ${pn.number}`
          });
          break;
        }
      }
    }

    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  searchByModel(brand: string, model: string): PartSearchResult[] {
    const normalizedBrand = brand.toLowerCase();
    const normalizedModel = model.toLowerCase();
    const results: PartSearchResult[] = [];

    for (const part of PARTS_DATABASE) {
      for (const cm of part.compatibleModels) {
        if (
          cm.brand.toLowerCase().includes(normalizedBrand) ||
          cm.model.toLowerCase().includes(normalizedModel)
        ) {
          results.push({
            part,
            matchScore: 90,
            matchReason: `Compatible with ${cm.brand} ${cm.model}`
          });
          break;
        }
      }
    }

    return results;
  }

  searchBySymptom(symptom: string): PartSearchResult[] {
    const normalizedSymptom = symptom.toLowerCase();
    const results: PartSearchResult[] = [];

    for (const part of PARTS_DATABASE) {
      for (const failureSymptom of part.failureSymptoms) {
        if (failureSymptom.toLowerCase().includes(normalizedSymptom)) {
          results.push({
            part,
            matchScore: 85,
            matchReason: `Related symptom: ${failureSymptom}`
          });
          break;
        }
      }
    }

    return results;
  }

  searchByFaultCode(faultCode: string): PartSearchResult[] {
    const normalizedFault = faultCode.toLowerCase();
    const results: PartSearchResult[] = [];

    for (const part of PARTS_DATABASE) {
      for (const fc of part.relatedFaultCodes) {
        if (fc.toLowerCase().includes(normalizedFault)) {
          results.push({
            part,
            matchScore: 95,
            matchReason: `Related to fault: ${fc}`
          });
          break;
        }
      }
    }

    return results;
  }

  searchByCategory(category: PartCategory): GeneratorPart[] {
    return PARTS_DATABASE.filter(p => p.category === category);
  }

  getPartById(id: string): GeneratorPart | undefined {
    return PARTS_DATABASE.find(p => p.id === id);
  }

  getRelatedParts(partId: string): GeneratorPart[] {
    const part = this.getPartById(partId);
    if (!part) return [];
    return part.relatedParts
      .map(id => this.getPartById(id))
      .filter((p): p is GeneratorPart => p !== undefined);
  }

  getCriticalParts(): GeneratorPart[] {
    return PARTS_DATABASE.filter(p => p.criticalPart);
  }

  findCrossReference(partNumber: string): PartNumber[] {
    const results: PartNumber[] = [];
    for (const part of PARTS_DATABASE) {
      if (part.partNumbers.some(pn =>
        pn.number.toUpperCase().replace(/[-\s]/g, '') === partNumber.toUpperCase().replace(/[-\s]/g, '')
      )) {
        results.push(...part.partNumbers);
      }
    }
    return results;
  }
}

// Singleton instance
let partsService: PartsCompatibilityService | null = null;

export function getPartsCompatibilityService(): PartsCompatibilityService {
  if (!partsService) {
    partsService = new PartsCompatibilityService();
  }
  return partsService;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT SALES FUNCTION - All purchases through Emerson EIMS
// ═══════════════════════════════════════════════════════════════════════════════

export function getPartsContactInfo(): {
  phone: string;
  email: string;
  whatsapp: string;
  partsPageUrl: string;
} {
  return {
    phone: '+254-XXX-XXX-XXX', // Update with actual
    email: 'parts@emersoneims.com',
    whatsapp: '+254-XXX-XXX-XXX',
    partsPageUrl: '/parts'
  };
}

/**
 * Get price range description
 */
export function getPriceRangeLabel(range: GeneratorPart['priceRange']): string {
  switch (range) {
    case 'budget': return 'Contact for pricing';
    case 'mid-range': return 'Contact for pricing';
    case 'premium': return 'Contact for pricing';
    default: return 'Contact sales';
  }
}

/**
 * Get availability description
 */
export function getAvailabilityLabel(availability: GeneratorPart['availability']): string {
  switch (availability) {
    case 'in_stock': return 'Usually in stock';
    case 'order': return 'Available to order';
    case 'special_order': return 'Special order item';
    default: return 'Contact for availability';
  }
}

export function getAvailabilityColor(availability: GeneratorPart['availability']): string {
  switch (availability) {
    case 'in_stock': return 'text-green-500';
    case 'order': return 'text-yellow-500';
    case 'special_order': return 'text-orange-500';
    default: return 'text-gray-500';
  }
}

/**
 * Format price with currency
 */
export function formatPrice(amount: number, currency: 'KES' | 'USD' = 'KES'): string {
  if (!amount || amount <= 0) return 'Contact for price';

  const exchangeRate = 130; // Approximate KES/USD rate

  if (currency === 'USD') {
    const usdAmount = amount / exchangeRate;
    return `$${usdAmount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }

  return `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
