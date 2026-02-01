// Parts Database for Generator Maintenance Companion

export type PartAvailability = 'in-stock' | 'order' | 'special-order';
export type PartSystem = 'engine' | 'fuel' | 'cooling' | 'exhaust' | 'electrical' | 'control' | 'filters' | 'consumables';

export interface GeneratorPart {
  id: string;
  name: string;
  partNumber: string;
  alternateNumbers: string[];
  system: PartSystem;
  compatibleModels: string[];
  compatibleBrands: string[];
  priceRange: { min: number; max: number; currency: string };
  availability: PartAvailability;
  leadTime: string;
  oem: boolean;
  image?: string;
  specifications: Record<string, string>;
  replacementInterval?: string;
  failureIndicators: string[];
  description: string;
  category: string;
  weight?: string;
  dimensions?: string;
}

export const partsDatabase: GeneratorPart[] = [
  // Engine Parts
  {
    id: 'piston-ring-set-4cyl',
    name: 'Piston Ring Set - 4 Cylinder',
    partNumber: 'PR-4089500',
    alternateNumbers: ['4089500', 'AR-73298', 'RE-507920'],
    system: 'engine',
    compatibleModels: ['4BT3.9', '4BTA3.9', 'QSB4.5'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 25000, max: 45000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 business days',
    oem: true,
    specifications: {
      'Material': 'Chrome-plated steel',
      'Ring Count per Piston': '3 (2 compression + 1 oil)',
      'Bore Size': '102mm',
      'Ring Gap': '0.35-0.55mm'
    },
    replacementInterval: '8,000-12,000 hours or at overhaul',
    failureIndicators: ['Oil consumption >0.5L/hr', 'Blue exhaust smoke', 'Low compression'],
    description: 'Complete piston ring set for 4-cylinder engines. Includes compression rings and oil control rings.',
    category: 'Engine Rebuild',
    weight: '1.2kg'
  },
  {
    id: 'piston-ring-set-6cyl',
    name: 'Piston Ring Set - 6 Cylinder',
    partNumber: 'PR-4089501',
    alternateNumbers: ['4089501', 'AR-73299', 'RE-507921'],
    system: 'engine',
    compatibleModels: ['6BT5.9', '6BTA5.9', 'QSB6.7', 'QSL9'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 35000, max: 65000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 business days',
    oem: true,
    specifications: {
      'Material': 'Chrome-plated steel',
      'Ring Count per Piston': '3 (2 compression + 1 oil)',
      'Bore Size': '107mm',
      'Ring Gap': '0.40-0.60mm'
    },
    replacementInterval: '8,000-12,000 hours or at overhaul',
    failureIndicators: ['Oil consumption >0.5L/hr', 'Blue exhaust smoke', 'Low compression'],
    description: 'Complete piston ring set for 6-cylinder engines. Premium quality for extended life.',
    category: 'Engine Rebuild',
    weight: '1.8kg'
  },
  {
    id: 'valve-seal-set',
    name: 'Valve Stem Seal Set',
    partNumber: 'VS-3802820',
    alternateNumbers: ['3802820', 'VSS-102', 'VM-4890'],
    system: 'engine',
    compatibleModels: ['4BT', '6BT', '4BTA', '6BTA', 'QSB'],
    compatibleBrands: ['Cummins', 'Perkins', 'Deutz'],
    priceRange: { min: 8000, max: 25000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Material': 'Viton fluorocarbon',
      'Temperature Range': '-40°C to 230°C',
      'Quantity': '12 or 24 per set'
    },
    replacementInterval: '6,000-10,000 hours',
    failureIndicators: ['Blue smoke at startup', 'Oil on spark plugs', 'Increased oil consumption'],
    description: 'High-quality valve stem seals to prevent oil entering combustion chamber.',
    category: 'Engine Seals',
    weight: '0.2kg'
  },
  {
    id: 'head-gasket-4cyl',
    name: 'Cylinder Head Gasket - 4 Cylinder',
    partNumber: 'HG-4089349',
    alternateNumbers: ['4089349', 'CH-7891', 'HG-4B'],
    system: 'engine',
    compatibleModels: ['4BT3.9', '4BTA3.9'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 12000, max: 28000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Material': 'Multi-layer steel (MLS)',
      'Thickness': '1.4mm',
      'Bore Diameter': '102mm'
    },
    replacementInterval: 'At overhaul or head removal',
    failureIndicators: ['Coolant in oil (milky)', 'Oil in coolant', 'Overheating', 'White exhaust'],
    description: 'Premium multi-layer steel head gasket for reliable sealing.',
    category: 'Engine Gaskets',
    weight: '0.5kg'
  },
  {
    id: 'main-bearing-set',
    name: 'Main Bearing Set',
    partNumber: 'MB-3802070',
    alternateNumbers: ['3802070', 'MB-STD', 'BE-4567'],
    system: 'engine',
    compatibleModels: ['4BT', '6BT', '4BTA', '6BTA'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 25000, max: 55000, currency: 'KES' },
    availability: 'order',
    leadTime: '3-5 business days',
    oem: true,
    specifications: {
      'Material': 'Tri-metal (steel/copper/babbitt)',
      'Sizes Available': 'STD, 0.25mm, 0.50mm, 0.75mm',
      'Quantity': '7 pairs (6-cyl) or 5 pairs (4-cyl)'
    },
    replacementInterval: '10,000-15,000 hours or at overhaul',
    failureIndicators: ['Low oil pressure', 'Knocking at idle', 'Metal in oil'],
    description: 'OEM quality main bearing set for crankshaft support.',
    category: 'Engine Bearings',
    weight: '1.5kg'
  },

  // Fuel System Parts
  {
    id: 'fuel-injector',
    name: 'Fuel Injector Nozzle Assembly',
    partNumber: 'FI-4928990',
    alternateNumbers: ['4928990', 'INJ-1080', 'DLLA-150P'],
    system: 'fuel',
    compatibleModels: ['QSB4.5', 'QSB6.7', 'ISB', 'ISC'],
    compatibleBrands: ['Cummins', 'Bosch'],
    priceRange: { min: 35000, max: 85000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Type': 'Common rail solenoid',
      'Spray Holes': '7 x 0.14mm',
      'Opening Pressure': '1800 bar',
      'Flow Rate': '870 cc/30s @ 100 bar'
    },
    replacementInterval: '6,000-10,000 hours',
    failureIndicators: ['Black smoke', 'Rough running', 'Misfiring', 'Poor fuel economy'],
    description: 'Precision fuel injector for common rail diesel engines.',
    category: 'Fuel Injection',
    weight: '0.8kg'
  },
  {
    id: 'fuel-filter-primary',
    name: 'Primary Fuel Filter',
    partNumber: 'FF-3890017',
    alternateNumbers: ['3890017', 'FS1212', 'FF5052'],
    system: 'filters',
    compatibleModels: ['All Cummins B/C Series'],
    compatibleBrands: ['Cummins', 'Fleetguard', 'Donaldson'],
    priceRange: { min: 2500, max: 5500, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Micron Rating': '30 micron',
      'With Water Separator': 'Yes',
      'Height': '150mm',
      'Thread': '1-14 UNS'
    },
    replacementInterval: '500-1,000 hours',
    failureIndicators: ['Power loss under load', 'Hard starting', 'Engine surging'],
    description: 'Primary fuel filter with water separator for pre-filtration.',
    category: 'Filters',
    weight: '0.4kg'
  },
  {
    id: 'fuel-filter-secondary',
    name: 'Secondary Fuel Filter',
    partNumber: 'FF-3890018',
    alternateNumbers: ['3890018', 'FF5018', 'P551318'],
    system: 'filters',
    compatibleModels: ['All Cummins B/C Series'],
    compatibleBrands: ['Cummins', 'Fleetguard', 'Donaldson'],
    priceRange: { min: 3500, max: 8000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Micron Rating': '5 micron',
      'Efficiency': '98.7% @ 5 micron',
      'Height': '120mm',
      'Thread': '3/4-16 UNF'
    },
    replacementInterval: '500-1,000 hours',
    failureIndicators: ['Power loss', 'Rough idle', 'Injector damage'],
    description: 'Fine secondary filter protecting injectors from contamination.',
    category: 'Filters',
    weight: '0.3kg'
  },
  {
    id: 'fuel-pump-assembly',
    name: 'Fuel Injection Pump Assembly',
    partNumber: 'FP-4954200',
    alternateNumbers: ['4954200', 'VE4/12', 'DB4-3500'],
    system: 'fuel',
    compatibleModels: ['4BT3.9', '4BTA3.9'],
    compatibleBrands: ['Cummins', 'Bosch'],
    priceRange: { min: 180000, max: 350000, currency: 'KES' },
    availability: 'order',
    leadTime: '7-14 business days',
    oem: true,
    specifications: {
      'Type': 'Rotary VE',
      'Cylinders': '4',
      'Delivery': '85mm³/stroke',
      'Governor': 'Mechanical RSV'
    },
    replacementInterval: '10,000-15,000 hours or at overhaul',
    failureIndicators: ['Hard starting', 'Power fluctuation', 'Fuel leaks', 'Timing issues'],
    description: 'Complete fuel injection pump assembly with governor.',
    category: 'Fuel Injection',
    weight: '12kg'
  },

  // Cooling System Parts
  {
    id: 'water-pump',
    name: 'Water Pump Assembly',
    partNumber: 'WP-4891252',
    alternateNumbers: ['4891252', 'WP-4B', '3286277'],
    system: 'cooling',
    compatibleModels: ['4BT', '4BTA', '6BT', '6BTA'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 35000, max: 75000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Type': 'Centrifugal',
      'Drive': 'Belt-driven',
      'Flow Rate': '200 L/min',
      'Bearing': 'Double-sealed'
    },
    replacementInterval: '8,000-12,000 hours',
    failureIndicators: ['Coolant leak at weep hole', 'Bearing noise', 'Overheating'],
    description: 'Heavy-duty water pump with integrated bearing and seal.',
    category: 'Cooling',
    weight: '4.5kg'
  },
  {
    id: 'thermostat',
    name: 'Thermostat',
    partNumber: 'TH-3076489',
    alternateNumbers: ['3076489', 'TH-82', 'TS-180'],
    system: 'cooling',
    compatibleModels: ['All Cummins B/C/L Series'],
    compatibleBrands: ['Cummins', 'Perkins', 'Caterpillar'],
    priceRange: { min: 3500, max: 9000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Opening Temperature': '82°C / 180°F',
      'Full Open': '95°C / 203°F',
      'Lift': '10mm minimum'
    },
    replacementInterval: '5,000-8,000 hours',
    failureIndicators: ['Overheating', 'Running cold', 'Temperature fluctuation'],
    description: 'Wax-pellet thermostat for precise engine temperature control.',
    category: 'Cooling',
    weight: '0.2kg'
  },
  {
    id: 'radiator-hose-upper',
    name: 'Upper Radiator Hose',
    partNumber: 'RH-3920709',
    alternateNumbers: ['3920709', 'UH-4B', 'RH-TOP'],
    system: 'cooling',
    compatibleModels: ['4BT', '4BTA', '6BT', '6BTA'],
    compatibleBrands: ['Cummins'],
    priceRange: { min: 3500, max: 8000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Material': 'EPDM rubber',
      'ID': '50mm',
      'Length': '400mm',
      'Max Temp': '120°C'
    },
    replacementInterval: '5,000-8,000 hours',
    failureIndicators: ['Coolant leaks', 'Swelling', 'Cracking', 'Soft/mushy feel'],
    description: 'Reinforced upper radiator hose with high temperature rating.',
    category: 'Cooling',
    weight: '0.5kg'
  },
  {
    id: 'fan-belt-v',
    name: 'V-Belt / Drive Belt',
    partNumber: 'FB-3911562',
    alternateNumbers: ['3911562', 'AVX13x1175', 'B45'],
    system: 'cooling',
    compatibleModels: ['Various - size specific'],
    compatibleBrands: ['Universal'],
    priceRange: { min: 1500, max: 4500, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Type': 'Cogged V-belt',
      'Width': '13mm',
      'Length': '1175mm',
      'Angle': '40°'
    },
    replacementInterval: '3,000-5,000 hours',
    failureIndicators: ['Squealing', 'Cracking', 'Glazing', 'Battery not charging'],
    description: 'Heavy-duty cogged V-belt for fan and alternator drive.',
    category: 'Belts',
    weight: '0.2kg'
  },

  // Electrical System Parts
  {
    id: 'avr-unit',
    name: 'Automatic Voltage Regulator (AVR)',
    partNumber: 'AVR-4936882',
    alternateNumbers: ['SX460', 'AS440', 'R449'],
    system: 'electrical',
    compatibleModels: ['Stamford', 'Leroy Somer', 'Mecc Alte'],
    compatibleBrands: ['Stamford', 'Leroy Somer', 'Mecc Alte'],
    priceRange: { min: 45000, max: 150000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Input Voltage': '95-132 VAC',
      'Output Current': '5A continuous',
      'Regulation': '±0.5%',
      'Sensing': 'RMS sensing'
    },
    replacementInterval: '8,000-12,000 hours',
    failureIndicators: ['Voltage hunting', 'Over/under voltage', 'Output instability'],
    description: 'Digital AVR for precise voltage regulation in synchronous generators.',
    category: 'Electrical',
    weight: '0.8kg'
  },
  {
    id: 'carbon-brush-set',
    name: 'Carbon Brush Set',
    partNumber: 'BR-4936884',
    alternateNumbers: ['CB-32', 'EG332', 'NCC634'],
    system: 'electrical',
    compatibleModels: ['Stamford alternators'],
    compatibleBrands: ['Stamford', 'Leroy Somer'],
    priceRange: { min: 5000, max: 15000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Dimensions': '32 x 16 x 40mm',
      'Material': 'Electrographite EG332',
      'Current Density': '10 A/cm²',
      'Quantity': '2 or 4 per set'
    },
    replacementInterval: '4,000-6,000 hours',
    failureIndicators: ['Sparking at brushes', 'Voltage fluctuation', 'Brush wear indicator'],
    description: 'Premium electrographite brushes for slip ring excitation.',
    category: 'Electrical',
    weight: '0.3kg'
  },
  {
    id: 'rectifier-diode-kit',
    name: 'Rectifier Diode Kit',
    partNumber: 'REC-4936883',
    alternateNumbers: ['RSK-5001', 'DRSK-100', 'KIT-RECT'],
    system: 'electrical',
    compatibleModels: ['All brushless alternators'],
    compatibleBrands: ['Stamford', 'Leroy Somer', 'Mecc Alte'],
    priceRange: { min: 15000, max: 45000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Rating': '100A / 1000V',
      'Type': 'Press-fit stud',
      'Quantity': '6 diodes per kit',
      'PRV': '1000V'
    },
    replacementInterval: '8,000-12,000 hours',
    failureIndicators: ['Low output', 'AC in DC circuit', 'Overheating diodes'],
    description: 'Complete rectifier diode replacement kit for rotating rectifier.',
    category: 'Electrical',
    weight: '0.5kg'
  },
  {
    id: 'battery-charger',
    name: 'Battery Charger Module',
    partNumber: 'BC-4936886',
    alternateNumbers: ['DSE9130', 'BAC06A', 'CH-12/10'],
    system: 'control',
    compatibleModels: ['All 12V/24V systems'],
    compatibleBrands: ['DSE', 'ComAp', 'Woodward'],
    priceRange: { min: 18000, max: 45000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Input': '100-240 VAC or Generator AC',
      'Output': '12V or 24V DC',
      'Charge Current': '6A / 10A',
      'Type': 'Float/Boost automatic'
    },
    replacementInterval: '8,000-12,000 hours',
    failureIndicators: ['Battery not charging', 'Overcharging', 'Low battery voltage'],
    description: 'Intelligent battery charger with float/boost charging.',
    category: 'Electrical',
    weight: '1.2kg'
  },

  // Control System Parts
  {
    id: 'magnetic-pickup',
    name: 'Magnetic Pickup Sensor (MPU)',
    partNumber: 'MPU-3034572',
    alternateNumbers: ['3034572', 'MPU-100', 'MSP6714'],
    system: 'control',
    compatibleModels: ['All generators with flywheel sensing'],
    compatibleBrands: ['Cummins', 'CAT', 'Perkins'],
    priceRange: { min: 8000, max: 22000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Output': 'AC voltage (varies with speed)',
      'Resistance': '200-800 ohms',
      'Air Gap': '0.5-1.0mm',
      'Thread': 'M16 x 1.5'
    },
    replacementInterval: '6,000-10,000 hours',
    failureIndicators: ['Speed reading errors', 'Frequency fluctuation', 'Overspeed trips'],
    description: 'Variable reluctance speed sensor for engine RPM detection.',
    category: 'Sensors',
    weight: '0.15kg'
  },
  {
    id: 'oil-pressure-sensor',
    name: 'Oil Pressure Sensor',
    partNumber: 'OPS-3015237',
    alternateNumbers: ['3015237', 'VDO-360-081', 'OPS-10BAR'],
    system: 'control',
    compatibleModels: ['All diesel engines'],
    compatibleBrands: ['Cummins', 'CAT', 'Perkins', 'Deutz'],
    priceRange: { min: 5000, max: 15000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Range': '0-10 bar',
      'Output': '0-5V or 4-20mA',
      'Thread': '1/8 NPT',
      'Accuracy': '±2%'
    },
    replacementInterval: '5,000-8,000 hours',
    failureIndicators: ['False low oil alarms', 'No reading', 'Erratic display'],
    description: 'Pressure transducer for engine oil pressure monitoring.',
    category: 'Sensors',
    weight: '0.1kg'
  },
  {
    id: 'coolant-temp-sensor',
    name: 'Coolant Temperature Sensor',
    partNumber: 'CTS-3015236',
    alternateNumbers: ['3015236', 'VDO-323-805', 'CTS-NTC'],
    system: 'control',
    compatibleModels: ['All liquid-cooled engines'],
    compatibleBrands: ['Cummins', 'CAT', 'Perkins', 'Deutz'],
    priceRange: { min: 4000, max: 12000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Type': 'NTC thermistor',
      'Range': '-40°C to 150°C',
      'Thread': '1/4 NPT',
      'Resistance': '2.5kΩ @ 20°C'
    },
    replacementInterval: '5,000-8,000 hours',
    failureIndicators: ['False high temp alarms', 'No reading', 'Erratic display'],
    description: 'NTC thermistor sensor for coolant temperature monitoring.',
    category: 'Sensors',
    weight: '0.08kg'
  },
  {
    id: 'fuel-solenoid',
    name: 'Fuel Shutoff Solenoid',
    partNumber: 'SOL-3935649',
    alternateNumbers: ['3935649', 'SA-4752-12', '0330001015'],
    system: 'control',
    compatibleModels: ['Cummins B/C Series'],
    compatibleBrands: ['Cummins', 'Bosch'],
    priceRange: { min: 12000, max: 32000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: true,
    specifications: {
      'Voltage': '12V or 24V DC',
      'Type': 'Pull/Hold type',
      'Pull Current': '40A',
      'Hold Current': '4A'
    },
    replacementInterval: '6,000-10,000 hours',
    failureIndicators: ['Engine won\'t stop', 'Engine won\'t start', 'Intermittent running'],
    description: 'Fuel shutoff solenoid for engine start/stop control.',
    category: 'Control',
    weight: '0.4kg'
  },
  {
    id: 'starter-motor',
    name: 'Starter Motor Assembly',
    partNumber: 'SM-3957597',
    alternateNumbers: ['3957597', 'IS1070', 'JS-1251'],
    system: 'control',
    compatibleModels: ['Cummins 4BT, 6BT'],
    compatibleBrands: ['Cummins', 'Delco', 'Bosch'],
    priceRange: { min: 45000, max: 95000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Voltage': '24V',
      'Power': '5.5 kW',
      'Rotation': 'CW from drive end',
      'Teeth': '10'
    },
    replacementInterval: '8,000-12,000 hours',
    failureIndicators: ['No cranking', 'Slow cranking', 'Grinding noise', 'Starter stuck'],
    description: 'Heavy-duty gear reduction starter motor for reliable starting.',
    category: 'Starting',
    weight: '8.5kg'
  },

  // Consumables and Filters
  {
    id: 'oil-filter',
    name: 'Engine Oil Filter',
    partNumber: 'OF-LF9009',
    alternateNumbers: ['LF9009', 'P550428', 'B7030'],
    system: 'filters',
    compatibleModels: ['Cummins B/C/L Series'],
    compatibleBrands: ['Cummins', 'Fleetguard', 'Donaldson'],
    priceRange: { min: 2000, max: 5000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Micron Rating': '21 micron',
      'Efficiency': '98% @ 21 micron',
      'Thread': '1-12 UNF',
      'Bypass Valve': '15 PSI'
    },
    replacementInterval: '250-500 hours',
    failureIndicators: ['Low oil pressure', 'Dirty oil', 'Bypass indicator (if equipped)'],
    description: 'Full-flow oil filter with premium filter media.',
    category: 'Filters',
    weight: '0.6kg'
  },
  {
    id: 'air-filter',
    name: 'Air Filter Element',
    partNumber: 'AF-AH1141',
    alternateNumbers: ['AH1141', 'P181063', 'RS3544'],
    system: 'filters',
    compatibleModels: ['Medium generators 50-500kVA'],
    compatibleBrands: ['Fleetguard', 'Donaldson', 'Mann'],
    priceRange: { min: 3500, max: 9000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Type': 'Radial seal',
      'Height': '280mm',
      'OD': '200mm',
      'Efficiency': '99.9%'
    },
    replacementInterval: '500-1,000 hours (check restriction)',
    failureIndicators: ['High restriction', 'Black smoke', 'Power loss'],
    description: 'Primary air filter element for engine intake.',
    category: 'Filters',
    weight: '1.2kg'
  },
  {
    id: 'coolant-additive',
    name: 'Coolant Conditioner (SCA)',
    partNumber: 'CC-DCA4',
    alternateNumbers: ['DCA4', 'CC2878', 'SCA-1'],
    system: 'consumables',
    compatibleModels: ['All diesel engines'],
    compatibleBrands: ['Fleetguard', 'Cummins', 'CAT'],
    priceRange: { min: 1500, max: 4000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Type': 'Supplemental coolant additive',
      'Volume': '1 liter',
      'SCA Level': 'Maintains 3-6%'
    },
    replacementInterval: 'Check every 500 hours',
    failureIndicators: ['Liner pitting', 'Corrosion', 'Low SCA test'],
    description: 'Coolant additive to prevent liner pitting and corrosion.',
    category: 'Consumables',
    weight: '1.1kg'
  },
  {
    id: 'engine-oil-15w40',
    name: 'Engine Oil 15W-40',
    partNumber: 'EO-15W40',
    alternateNumbers: ['Delo 400', 'Rotella T4', 'Delvac MX'],
    system: 'consumables',
    compatibleModels: ['All diesel engines'],
    compatibleBrands: ['Shell', 'Chevron', 'Mobil'],
    priceRange: { min: 4500, max: 8000, currency: 'KES' },
    availability: 'in-stock',
    leadTime: 'Same day',
    oem: false,
    specifications: {
      'Viscosity': '15W-40',
      'API': 'CK-4 / CJ-4',
      'Volume': '20 liters',
      'TBN': '10+'
    },
    replacementInterval: '250-500 hours',
    failureIndicators: ['Oil analysis failure', 'Visible contamination', 'Over interval'],
    description: 'Premium heavy-duty diesel engine oil for generator applications.',
    category: 'Consumables',
    weight: '18kg'
  }
];

// Get part by ID
export const getPartById = (id: string): GeneratorPart | undefined => {
  return partsDatabase.find(part => part.id === id);
};

// Get parts by system
export const getPartsBySystem = (system: PartSystem): GeneratorPart[] => {
  return partsDatabase.filter(part => part.system === system);
};

// Get parts by availability
export const getPartsByAvailability = (availability: PartAvailability): GeneratorPart[] => {
  return partsDatabase.filter(part => part.availability === availability);
};

// Search parts
export const searchParts = (query: string): GeneratorPart[] => {
  const lowercaseQuery = query.toLowerCase();
  return partsDatabase.filter(part =>
    part.name.toLowerCase().includes(lowercaseQuery) ||
    part.partNumber.toLowerCase().includes(lowercaseQuery) ||
    part.alternateNumbers.some(num => num.toLowerCase().includes(lowercaseQuery)) ||
    part.description.toLowerCase().includes(lowercaseQuery) ||
    part.category.toLowerCase().includes(lowercaseQuery)
  );
};

// Get compatible parts for a model
export const getPartsForModel = (model: string): GeneratorPart[] => {
  return partsDatabase.filter(part =>
    part.compatibleModels.some(m => m.toLowerCase().includes(model.toLowerCase()))
  );
};

// Availability colors
export const availabilityColors: Record<PartAvailability, string> = {
  'in-stock': '#10B981', // Emerald
  'order': '#F59E0B', // Amber
  'special-order': '#EF4444' // Red
};

export const availabilityLabels: Record<PartAvailability, string> = {
  'in-stock': 'In Stock',
  'order': 'Available to Order',
  'special-order': 'Special Order Required'
};
