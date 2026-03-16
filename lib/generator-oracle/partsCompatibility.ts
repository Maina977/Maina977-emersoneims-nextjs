/**
 * Generator Oracle - Parts Compatibility Matrix
 *
 * Cross-reference system for generator parts:
 * - OEM part numbers to aftermarket equivalents
 * - Compatibility across brands and models
 * - Pricing and availability information
 * - Kenya supplier integration
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface PartNumber {
  number: string;
  brand: string;
  type: 'oem' | 'aftermarket' | 'generic';
}

export interface GeneratorPart {
  id: string;
  name: string;
  category: PartCategory;
  description: string;
  partNumbers: PartNumber[];
  compatibleModels: CompatibleModel[];
  specifications: Record<string, string>;
  installationNotes?: string[];
  imageUrl?: string;
  avgPriceKES: number;
  avgPriceUSD: number;
  availability: 'in_stock' | 'order' | 'discontinued';
  leadTimeDays?: number;
  suppliers: PartSupplier[];
  relatedParts: string[];
  criticalPart: boolean;
  failureSymptoms: string[];
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
  | 'safety';

export interface CompatibleModel {
  brand: string;
  model: string;
  years?: string;
  notes?: string;
}

export interface PartSupplier {
  name: string;
  location: string;
  priceKES: number;
  inStock: boolean;
  leadTimeDays: number;
  contact?: string;
  verified: boolean;
}

export interface PartSearchResult {
  part: GeneratorPart;
  matchScore: number;
  matchReason: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PART CATEGORIES
// ═══════════════════════════════════════════════════════════════════════════════

export const PART_CATEGORIES: Record<PartCategory, { name: string; icon: string; description: string }> = {
  filters: {
    name: 'Filters',
    icon: '🔲',
    description: 'Oil, fuel, and air filters'
  },
  belts: {
    name: 'Belts & Hoses',
    icon: '🔗',
    description: 'Drive belts, fan belts, and hoses'
  },
  electrical: {
    name: 'Electrical',
    icon: '⚡',
    description: 'Wiring, connectors, and electrical components'
  },
  fuel_system: {
    name: 'Fuel System',
    icon: '⛽',
    description: 'Injectors, pumps, and fuel components'
  },
  cooling: {
    name: 'Cooling System',
    icon: '❄️',
    description: 'Radiators, water pumps, thermostats'
  },
  exhaust: {
    name: 'Exhaust',
    icon: '💨',
    description: 'Exhaust manifolds, mufflers, gaskets'
  },
  engine_internal: {
    name: 'Engine Internal',
    icon: '⚙️',
    description: 'Pistons, rings, bearings, valves'
  },
  alternator: {
    name: 'Alternator',
    icon: '🔌',
    description: 'AVR, stator, rotor, brushes'
  },
  controller: {
    name: 'Controllers',
    icon: '📟',
    description: 'Control panels and modules'
  },
  sensors: {
    name: 'Sensors',
    icon: '📡',
    description: 'Temperature, pressure, speed sensors'
  },
  gaskets_seals: {
    name: 'Gaskets & Seals',
    icon: '🔘',
    description: 'Head gaskets, oil seals, O-rings'
  },
  bearings: {
    name: 'Bearings',
    icon: '🎯',
    description: 'Engine and alternator bearings'
  },
  starter: {
    name: 'Starter System',
    icon: '🔋',
    description: 'Starter motors, solenoids, batteries'
  },
  safety: {
    name: 'Safety Devices',
    icon: '🛡️',
    description: 'Emergency stops, shutdown devices'
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const PARTS_DATABASE: GeneratorPart[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FILTERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'OIL_FILTER_001',
    name: 'Engine Oil Filter',
    category: 'filters',
    description: 'High-quality spin-on oil filter for diesel generators. Removes contaminants to protect engine bearings and components.',
    partNumbers: [
      { number: '2654407', brand: 'Perkins', type: 'oem' },
      { number: 'LF3349', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'B7275', brand: 'Baldwin', type: 'aftermarket' },
      { number: '51348', brand: 'WIX', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '400 Series', years: '2008-2024' },
      { brand: 'Perkins', model: '1100 Series', years: '2010-2024' },
      { brand: 'FG Wilson', model: 'P50-P150', years: '2010-2024' },
      { brand: 'Caterpillar', model: 'DE50-DE150', years: '2012-2024' }
    ],
    specifications: {
      'Thread Size': 'M22 x 1.5',
      'Height': '95mm',
      'Diameter': '76mm',
      'Bypass Valve': 'Yes, 12 PSI',
      'Micron Rating': '23 microns'
    },
    installationNotes: [
      'Apply thin film of clean oil to gasket before installation',
      'Tighten hand-tight plus 3/4 turn',
      'Check for leaks after starting',
      'Replace every 250-500 hours'
    ],
    avgPriceKES: 2500,
    avgPriceUSD: 18,
    availability: 'in_stock',
    suppliers: [
      { name: 'Mantrac Kenya', location: 'Nairobi', priceKES: 3200, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Auto Parts Kenya', location: 'Nairobi', priceKES: 2100, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Mombasa Motors', location: 'Mombasa', priceKES: 2400, inStock: true, leadTimeDays: 2, verified: true }
    ],
    relatedParts: ['FUEL_FILTER_001', 'AIR_FILTER_001'],
    criticalPart: true,
    failureSymptoms: ['Low oil pressure', 'Engine noise', 'Oil contamination']
  },
  {
    id: 'FUEL_FILTER_001',
    name: 'Fuel Filter / Water Separator',
    category: 'filters',
    description: 'Primary fuel filter with water separator. Essential for protecting injectors from water and contaminants.',
    partNumbers: [
      { number: '26560163', brand: 'Perkins', type: 'oem' },
      { number: 'FS19531', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'BF7675-D', brand: 'Baldwin', type: 'aftermarket' },
      { number: '33358', brand: 'WIX', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '400-1100 Series', years: '2006-2024' },
      { brand: 'FG Wilson', model: 'P50-P220', years: '2008-2024' },
      { brand: 'SDMO', model: 'J Series', years: '2010-2024' }
    ],
    specifications: {
      'Thread Size': '1/2-14 NPT',
      'Height': '145mm',
      'Diameter': '93mm',
      'Water Separator': 'Yes',
      'Micron Rating': '10 microns'
    },
    installationNotes: [
      'Drain water from old filter before removal',
      'Prime new filter with clean diesel before installation',
      'Bleed fuel system after installation',
      'Replace every 250-500 hours or when warning light activates'
    ],
    avgPriceKES: 3500,
    avgPriceUSD: 25,
    availability: 'in_stock',
    suppliers: [
      { name: 'Mantrac Kenya', location: 'Nairobi', priceKES: 4200, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Diesel Parts Kenya', location: 'Nairobi', priceKES: 3200, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['OIL_FILTER_001', 'AIR_FILTER_001'],
    criticalPart: true,
    failureSymptoms: ['Hard starting', 'Engine misfiring', 'Loss of power', 'Injector damage']
  },
  {
    id: 'AIR_FILTER_001',
    name: 'Primary Air Filter Element',
    category: 'filters',
    description: 'Heavy-duty air filter for diesel generator applications. Designed for dusty Kenya conditions.',
    partNumbers: [
      { number: '26510342', brand: 'Perkins', type: 'oem' },
      { number: 'AF25539', brand: 'Fleetguard', type: 'aftermarket' },
      { number: 'PA2705', brand: 'Baldwin', type: 'aftermarket' },
      { number: '46562', brand: 'WIX', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1000-1100 Series', years: '2008-2024' },
      { brand: 'FG Wilson', model: 'P65-P220', years: '2010-2024' },
      { brand: 'Cummins', model: 'C Series', years: '2008-2024' }
    ],
    specifications: {
      'Type': 'Radial Seal',
      'Height': '350mm',
      'OD': '210mm',
      'ID': '120mm',
      'Efficiency': '99.9%'
    },
    installationNotes: [
      'Never clean and reuse - always replace',
      'Check housing seal for damage',
      'Replace safety element every 3 primary changes',
      'Replace when restriction indicator shows red'
    ],
    avgPriceKES: 4500,
    avgPriceUSD: 32,
    availability: 'in_stock',
    suppliers: [
      { name: 'Mantrac Kenya', location: 'Nairobi', priceKES: 5500, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Filter House Kenya', location: 'Nairobi', priceKES: 4200, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['AIR_FILTER_SAFETY_001'],
    criticalPart: true,
    failureSymptoms: ['Black smoke', 'Loss of power', 'High fuel consumption', 'Engine wear']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENSORS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'TEMP_SENSOR_001',
    name: 'Coolant Temperature Sensor',
    category: 'sensors',
    description: 'Precision temperature sensor for engine coolant monitoring. Provides signal to controller for overheat protection.',
    partNumbers: [
      { number: '2848A127', brand: 'Perkins', type: 'oem' },
      { number: 'VDO 323-803-001-004D', brand: 'VDO', type: 'aftermarket' },
      { number: 'DSE 7320', brand: 'Deep Sea', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '2000-2024' },
      { brand: 'Cummins', model: 'B/C Series', years: '2005-2024' },
      { brand: 'FG Wilson', model: 'All Models', years: '2005-2024' }
    ],
    specifications: {
      'Thread': '1/4 NPT',
      'Resistance at 20°C': '1200 ohms',
      'Resistance at 100°C': '52 ohms',
      'Operating Range': '-40 to 150°C',
      'Output Type': 'Variable Resistance'
    },
    installationNotes: [
      'Apply thread sealant (not Teflon tape)',
      'Torque to 15-18 Nm',
      'Calibrate controller after replacement',
      'Test reading against known temperature'
    ],
    avgPriceKES: 8500,
    avgPriceUSD: 60,
    availability: 'in_stock',
    suppliers: [
      { name: 'Generator Spares Kenya', location: 'Nairobi', priceKES: 9200, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Industrial Electronics', location: 'Nairobi', priceKES: 8000, inStock: false, leadTimeDays: 7, verified: true }
    ],
    relatedParts: ['OIL_PRESSURE_SENSOR_001', 'MPU_SENSOR_001'],
    criticalPart: true,
    failureSymptoms: ['No temperature reading', 'Incorrect temperature', 'Overheat shutdown', 'Temperature gauge erratic']
  },
  {
    id: 'OIL_PRESSURE_SENSOR_001',
    name: 'Oil Pressure Sensor',
    category: 'sensors',
    description: 'Engine oil pressure sensor for protection system. Triggers shutdown on low oil pressure condition.',
    partNumbers: [
      { number: '185246190', brand: 'Perkins', type: 'oem' },
      { number: 'VDO 360-081-030-014C', brand: 'VDO', type: 'aftermarket' },
      { number: 'DSE 7310', brand: 'Deep Sea', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '1995-2024' },
      { brand: 'Cummins', model: 'All Series', years: '2000-2024' },
      { brand: 'John Deere', model: 'PowerTech', years: '2005-2024' }
    ],
    specifications: {
      'Thread': '1/8 NPT',
      'Range': '0-10 bar',
      'Output': '0-180 ohms',
      'Warning Point': '0.5 bar',
      'Shutdown Point': '0.3 bar'
    },
    installationNotes: [
      'Use Teflon tape on threads',
      'Install in port with direct oil gallery access',
      'Torque to 12-15 Nm',
      'Verify operation before starting under load'
    ],
    avgPriceKES: 6500,
    avgPriceUSD: 46,
    availability: 'in_stock',
    suppliers: [
      { name: 'Generator Spares Kenya', location: 'Nairobi', priceKES: 7000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Industrial Sensors Ltd', location: 'Nairobi', priceKES: 6200, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['TEMP_SENSOR_001', 'OIL_FILTER_001'],
    criticalPart: true,
    failureSymptoms: ['Low oil pressure alarm', 'No oil pressure reading', 'Erratic oil pressure display', 'Engine shutdown']
  },
  {
    id: 'MPU_SENSOR_001',
    name: 'Magnetic Pickup Unit (Speed Sensor)',
    category: 'sensors',
    description: 'Engine speed sensor that reads flywheel teeth for RPM measurement. Critical for governor control.',
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
      'Output': '1-150 VAC',
      'Air Gap': '0.5-1.0mm',
      'Resistance': '880-1200 ohms',
      'Frequency': '0-10kHz'
    },
    installationNotes: [
      'Set air gap to 0.5-1.0mm (0.020-0.040")',
      'Use feeler gauge for accurate gap setting',
      'Apply threadlocker to prevent loosening',
      'Check signal with oscilloscope if available'
    ],
    avgPriceKES: 12000,
    avgPriceUSD: 85,
    availability: 'in_stock',
    suppliers: [
      { name: 'Cummins East Africa', location: 'Nairobi', priceKES: 15000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Generator Spares Kenya', location: 'Nairobi', priceKES: 11500, inStock: true, leadTimeDays: 3, verified: true }
    ],
    relatedParts: ['GOVERNOR_ACTUATOR_001'],
    criticalPart: true,
    failureSymptoms: ['No engine speed reading', 'Fail to start', 'Overspeed shutdown', 'Erratic governor operation']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ELECTRICAL
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'AVR_001',
    name: 'Automatic Voltage Regulator (AVR)',
    category: 'alternator',
    description: 'Electronic voltage regulator for brushless alternators. Maintains stable output voltage under varying loads.',
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
      'Input Voltage': '95-130 VAC',
      'Output Voltage': '0-110 VDC',
      'Regulation': '+/- 1%',
      'Sensing': '3-phase or single-phase',
      'Stability': '0.5%'
    },
    installationNotes: [
      'Match AVR to alternator brand/model',
      'Connect sensing leads correctly',
      'Adjust voltage potentiometer carefully',
      'Set stability pot to mid-range initially',
      'Load test after installation'
    ],
    avgPriceKES: 25000,
    avgPriceUSD: 180,
    availability: 'order',
    leadTimeDays: 14,
    suppliers: [
      { name: 'Electrical Systems Kenya', location: 'Nairobi', priceKES: 28000, inStock: false, leadTimeDays: 14, verified: true },
      { name: 'Generator Parts Direct', location: 'Nairobi', priceKES: 24000, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['CARBON_BRUSHES_001', 'DIODE_SET_001'],
    criticalPart: true,
    failureSymptoms: ['No voltage output', 'Low voltage', 'High voltage', 'Voltage hunting', 'Voltage spikes']
  },
  {
    id: 'CARBON_BRUSHES_001',
    name: 'Carbon Brush Set',
    category: 'alternator',
    description: 'Replacement carbon brushes for alternator exciter. Wears over time and requires periodic replacement.',
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
      'Size (typical)': '32 x 16 x 12.5mm',
      'Spring Pressure': '180-250 g/cm²',
      'Grade': 'EG332'
    },
    installationNotes: [
      'Check brush holder condition',
      'Ensure proper spring pressure',
      'Bed brushes to slip ring curvature',
      'Check slip ring surface condition',
      'Replace brushes when worn to indicator line'
    ],
    avgPriceKES: 5500,
    avgPriceUSD: 40,
    availability: 'in_stock',
    suppliers: [
      { name: 'Alternator Parts Kenya', location: 'Nairobi', priceKES: 6000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Industrial Brushes Ltd', location: 'Nairobi', priceKES: 5200, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['AVR_001', 'SLIP_RINGS_001'],
    criticalPart: false,
    failureSymptoms: ['Low voltage', 'Voltage fluctuation', 'Sparking at brushes', 'No excitation']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // STARTER SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'STARTER_MOTOR_001',
    name: 'Starter Motor 24V',
    category: 'starter',
    description: 'Heavy-duty starter motor for diesel generator starting. Designed for frequent start cycles.',
    partNumbers: [
      { number: '2873K404', brand: 'Perkins', type: 'oem' },
      { number: 'M93R3001SE', brand: 'Prestolite', type: 'oem' },
      { number: 'SM1-4218', brand: 'Bosch', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1100-1300 Series', years: '2005-2024' },
      { brand: 'Cummins', model: 'B5.9-C8.3', years: '2000-2024' },
      { brand: 'FG Wilson', model: 'P100-P300', years: '2005-2024' }
    ],
    specifications: {
      'Voltage': '24V DC',
      'Power': '5.5 kW',
      'Teeth': '10',
      'Rotation': 'CW from pinion end',
      'Mounting': '3-bolt'
    },
    installationNotes: [
      'Disconnect battery before removal',
      'Check ring gear condition',
      'Apply anti-seize to mounting bolts',
      'Verify proper engagement depth',
      'Test cranking current draw'
    ],
    avgPriceKES: 85000,
    avgPriceUSD: 600,
    availability: 'order',
    leadTimeDays: 21,
    suppliers: [
      { name: 'Mantrac Kenya', location: 'Nairobi', priceKES: 95000, inStock: false, leadTimeDays: 21, verified: true },
      { name: 'Starter Rebuilders Kenya', location: 'Nairobi', priceKES: 55000, inStock: true, leadTimeDays: 0, contact: '+254-720-XXX-XXX', verified: true, notes: 'Rebuilt unit' } as PartSupplier & { notes: string }
    ],
    relatedParts: ['STARTER_SOLENOID_001', 'BATTERY_001'],
    criticalPart: true,
    failureSymptoms: ['No crank', 'Slow crank', 'Grinding noise', 'Click but no crank']
  },
  {
    id: 'BATTERY_001',
    name: 'Starting Battery 12V 100Ah',
    category: 'starter',
    description: 'Heavy-duty deep cycle starting battery for generators. Designed for standby applications.',
    partNumbers: [
      { number: 'N100', brand: 'Chloride Exide', type: 'oem' },
      { number: '31-900', brand: 'Trojan', type: 'aftermarket' },
      { number: 'LC-X12100P', brand: 'Panasonic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Universal', model: '12V Generator Systems', notes: 'Use 2 in series for 24V systems' }
    ],
    specifications: {
      'Voltage': '12V',
      'Capacity': '100Ah @ 20hr',
      'CCA': '800A',
      'Type': 'Flooded Lead Acid',
      'Terminals': 'Automotive post'
    },
    installationNotes: [
      'Check polarity before connecting',
      'Apply terminal grease after installation',
      'Verify battery charger output',
      'Set float charge to 13.6-13.8V per battery',
      'Check electrolyte level monthly'
    ],
    avgPriceKES: 25000,
    avgPriceUSD: 180,
    availability: 'in_stock',
    suppliers: [
      { name: 'Chloride Exide Kenya', location: 'Nairobi', priceKES: 26000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Battery Centre Kenya', location: 'Nairobi', priceKES: 24000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Auto Parts Mombasa', location: 'Mombasa', priceKES: 25500, inStock: true, leadTimeDays: 2, verified: true }
    ],
    relatedParts: ['BATTERY_CHARGER_001', 'STARTER_MOTOR_001'],
    criticalPart: true,
    failureSymptoms: ['Fail to start', 'Slow cranking', 'Low voltage alarm', 'Battery charger fault']
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // COOLING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'WATER_PUMP_001',
    name: 'Engine Water Pump',
    category: 'cooling',
    description: 'Centrifugal water pump for engine cooling system. Circulates coolant through engine and radiator.',
    partNumbers: [
      { number: 'U5MW0194', brand: 'Perkins', type: 'oem' },
      { number: '4131A062', brand: 'Perkins', type: 'oem' },
      { number: 'WP-4131', brand: 'Generic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: '1100 Series', years: '2006-2024' },
      { brand: 'FG Wilson', model: 'P65-P150', years: '2008-2024' }
    ],
    specifications: {
      'Drive': 'Belt driven',
      'Bearing': 'Sealed for life',
      'Impeller': 'Cast iron',
      'Seal': 'Mechanical face seal',
      'Flow Rate': '150 L/min @ 2500 RPM'
    },
    installationNotes: [
      'Replace gasket with new',
      'Check belt tension after installation',
      'Fill system and bleed air',
      'Check for leaks at operating temperature',
      'Use correct coolant type'
    ],
    avgPriceKES: 35000,
    avgPriceUSD: 250,
    availability: 'order',
    leadTimeDays: 14,
    suppliers: [
      { name: 'Mantrac Kenya', location: 'Nairobi', priceKES: 42000, inStock: false, leadTimeDays: 14, verified: true },
      { name: 'Engine Parts Kenya', location: 'Nairobi', priceKES: 32000, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['THERMOSTAT_001', 'FAN_BELT_001'],
    criticalPart: true,
    failureSymptoms: ['Overheating', 'Coolant leak', 'Bearing noise', 'Low coolant flow']
  },
  {
    id: 'THERMOSTAT_001',
    name: 'Engine Thermostat',
    category: 'cooling',
    description: 'Wax-type thermostat for engine temperature regulation. Controls coolant flow to radiator.',
    partNumbers: [
      { number: '2485C026', brand: 'Perkins', type: 'oem' },
      { number: '145206320', brand: 'Perkins', type: 'oem' },
      { number: 'TH-82', brand: 'Generic', type: 'aftermarket' }
    ],
    compatibleModels: [
      { brand: 'Perkins', model: 'All Series', years: '1990-2024' },
      { brand: 'Cummins', model: 'B Series', years: '1995-2024' }
    ],
    specifications: {
      'Opening Temperature': '82°C',
      'Full Open Temperature': '95°C',
      'Type': 'Wax pellet',
      'Bypass': 'Integral'
    },
    installationNotes: [
      'Test thermostat in hot water before installation',
      'Install with air bleed facing up',
      'Replace housing gasket',
      'Bleed air from system after filling'
    ],
    avgPriceKES: 4500,
    avgPriceUSD: 32,
    availability: 'in_stock',
    suppliers: [
      { name: 'Cooling Systems Kenya', location: 'Nairobi', priceKES: 5000, inStock: true, leadTimeDays: 0, verified: true },
      { name: 'Auto Parts Kenya', location: 'Nairobi', priceKES: 4200, inStock: true, leadTimeDays: 0, verified: true }
    ],
    relatedParts: ['WATER_PUMP_001', 'TEMP_SENSOR_001'],
    criticalPart: true,
    failureSymptoms: ['Overcooling', 'Overheating', 'Temperature fluctuation', 'No heat from engine']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PARTS SERVICE
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

  getPartsWithLowStock(): GeneratorPart[] {
    return PARTS_DATABASE.filter(p => p.availability === 'order');
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

  getSuppliersByLocation(location: string): Array<{ supplier: PartSupplier; part: GeneratorPart }> {
    const results: Array<{ supplier: PartSupplier; part: GeneratorPart }> = [];
    const normalizedLocation = location.toLowerCase();

    for (const part of PARTS_DATABASE) {
      for (const supplier of part.suppliers) {
        if (supplier.location.toLowerCase().includes(normalizedLocation)) {
          results.push({ supplier, part });
        }
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
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function formatPrice(priceKES: number, currency: 'KES' | 'USD' = 'KES'): string {
  if (currency === 'USD') {
    return `$${(priceKES / 140).toFixed(0)}`; // Approximate conversion
  }
  return `KES ${priceKES.toLocaleString()}`;
}

export function getAvailabilityColor(availability: GeneratorPart['availability']): string {
  switch (availability) {
    case 'in_stock': return 'text-green-500';
    case 'order': return 'text-yellow-500';
    case 'discontinued': return 'text-red-500';
    default: return 'text-gray-500';
  }
}

export function getAvailabilityLabel(availability: GeneratorPart['availability']): string {
  switch (availability) {
    case 'in_stock': return 'In Stock';
    case 'order': return 'Special Order';
    case 'discontinued': return 'Discontinued';
    default: return 'Unknown';
  }
}
