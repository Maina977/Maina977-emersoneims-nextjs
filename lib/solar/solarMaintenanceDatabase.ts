/**
 * COMPREHENSIVE SOLAR MAINTENANCE DATABASE
 * Complete repair guides for inverters, panels, and batteries
 * 20+ brands sold in Kenya with error codes and solutions
 *
 * © 2026 EmersonEIMS - Kenya's #1 Solar Service Provider
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER BRANDS DATABASE - 20+ Major Brands in Kenya
// ═══════════════════════════════════════════════════════════════════════════════

export interface InverterBrand {
  id: string;
  name: string;
  country: string;
  logo?: string;
  website: string;
  types: ('hybrid' | 'off-grid' | 'on-grid' | 'micro')[];
  powerRange: string;
  warranty: string;
  popularity: 'high' | 'medium' | 'low';
  priceRange: string;
  features: string[];
  commonIssues: string[];
  supportInKenya: boolean;
}

export const INVERTER_BRANDS: InverterBrand[] = [
  {
    id: 'victron',
    name: 'Victron Energy',
    country: 'Netherlands',
    website: 'https://www.victronenergy.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '500W - 15kW',
    warranty: '5 years',
    popularity: 'high',
    priceRange: 'KES 45,000 - 850,000',
    features: ['Bluetooth monitoring', 'VRM Portal', 'Modular design', 'Wide input voltage'],
    commonIssues: ['VE.Bus communication errors', 'Overload shutdown', 'Battery sync issues'],
    supportInKenya: true,
  },
  {
    id: 'growatt',
    name: 'Growatt',
    country: 'China',
    website: 'https://www.growatt.com',
    types: ['hybrid', 'on-grid', 'off-grid'],
    powerRange: '1kW - 100kW',
    warranty: '5-10 years',
    popularity: 'high',
    priceRange: 'KES 25,000 - 500,000',
    features: ['ShinePhone app', 'WiFi monitoring', 'Wide MPPT range', 'IP65 rating'],
    commonIssues: ['WiFi connectivity', 'PV isolation fault', 'Grid frequency errors'],
    supportInKenya: true,
  },
  {
    id: 'sma',
    name: 'SMA Solar',
    country: 'Germany',
    website: 'https://www.sma.de',
    types: ['hybrid', 'on-grid'],
    powerRange: '2kW - 2500kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 80,000 - 2,000,000',
    features: ['Sunny Portal', 'OptiTrac MPPT', 'Grid management', 'ShadeFix'],
    commonIssues: ['Grid code compliance', 'Insulation resistance', 'DC arc detection'],
    supportInKenya: true,
  },
  {
    id: 'fronius',
    name: 'Fronius',
    country: 'Austria',
    website: 'https://www.fronius.com',
    types: ['hybrid', 'on-grid'],
    powerRange: '1.5kW - 27kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 90,000 - 1,200,000',
    features: ['Fronius Solar.web', 'SnapINverter', 'Dynamic Peak Manager', 'Arc fault protection'],
    commonIssues: ['State 102 errors', 'DC input issues', 'Grid connection problems'],
    supportInKenya: true,
  },
  {
    id: 'huawei',
    name: 'Huawei Solar',
    country: 'China',
    website: 'https://solar.huawei.com',
    types: ['hybrid', 'on-grid'],
    powerRange: '2kW - 100kW',
    warranty: '10 years',
    popularity: 'high',
    priceRange: 'KES 50,000 - 800,000',
    features: ['FusionSolar app', 'AI optimization', 'AFCI protection', 'SUN2000 series'],
    commonIssues: ['Firmware updates', 'PID protection trips', 'AFCI false alarms'],
    supportInKenya: true,
  },
  {
    id: 'deye',
    name: 'Deye',
    country: 'China',
    website: 'https://www.deyeinverter.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '3kW - 50kW',
    warranty: '5 years',
    popularity: 'high',
    priceRange: 'KES 35,000 - 600,000',
    features: ['SunSynk compatible', 'Parallel operation', 'Generator input', 'Battery flexible'],
    commonIssues: ['Communication errors', 'BMS compatibility', 'Fan noise'],
    supportInKenya: true,
  },
  {
    id: 'sunsynk',
    name: 'Sunsynk',
    country: 'China/South Africa',
    website: 'https://www.sunsynk.com',
    types: ['hybrid'],
    powerRange: '3kW - 16kW',
    warranty: '5 years',
    popularity: 'high',
    priceRange: 'KES 45,000 - 450,000',
    features: ['Sunsynk Connect app', 'Built-in WiFi', 'Time of use', 'Generator support'],
    commonIssues: ['CT clamp setup', 'Grid tie failures', 'Battery charge limits'],
    supportInKenya: true,
  },
  {
    id: 'goodwe',
    name: 'GoodWe',
    country: 'China',
    website: 'https://www.goodwe.com',
    types: ['hybrid', 'on-grid', 'off-grid'],
    powerRange: '0.7kW - 100kW',
    warranty: '5-10 years',
    popularity: 'high',
    priceRange: 'KES 30,000 - 700,000',
    features: ['SEMS Portal', 'ES/EM series', 'Arc fault detection', 'PID recovery'],
    commonIssues: ['SEMS connectivity', 'PV string imbalance', 'Overtemperature'],
    supportInKenya: true,
  },
  {
    id: 'solax',
    name: 'SolaX Power',
    country: 'China',
    website: 'https://www.solaxpower.com',
    types: ['hybrid', 'on-grid'],
    powerRange: '1kW - 150kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 35,000 - 500,000',
    features: ['SolaX Cloud', 'X-Hybrid series', 'EPS function', 'Force charge'],
    commonIssues: ['Grid code settings', 'EPS switching', 'Meter communication'],
    supportInKenya: true,
  },
  {
    id: 'must',
    name: 'Must Energy',
    country: 'China',
    website: 'https://www.must-energy.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '1kW - 12kW',
    warranty: '2 years',
    popularity: 'high',
    priceRange: 'KES 15,000 - 200,000',
    features: ['Low cost', 'LCD display', 'Parallel capable', 'Generator compatible'],
    commonIssues: ['Fan failures', 'Overload protection', 'Battery charging issues'],
    supportInKenya: true,
  },
  {
    id: 'felicity',
    name: 'Felicity Solar',
    country: 'China',
    website: 'https://www.felicitysolar.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '1kW - 10kW',
    warranty: '2 years',
    popularity: 'high',
    priceRange: 'KES 12,000 - 180,000',
    features: ['Budget friendly', 'Simple operation', 'PWM/MPPT options', 'LCD screen'],
    commonIssues: ['Cooling fan issues', 'LCD display failures', 'Charging problems'],
    supportInKenya: true,
  },
  {
    id: 'solis',
    name: 'Solis',
    country: 'China',
    website: 'https://www.solisinverters.com',
    types: ['hybrid', 'on-grid'],
    powerRange: '0.7kW - 255kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 25,000 - 600,000',
    features: ['SolisCloud', 'Wide voltage range', 'S6 series', 'RHI series'],
    commonIssues: ['WiFi stick issues', 'DC switch problems', 'String faults'],
    supportInKenya: true,
  },
  {
    id: 'sofar',
    name: 'Sofar Solar',
    country: 'China',
    website: 'https://www.sofarsolar.com',
    types: ['hybrid', 'on-grid'],
    powerRange: '1kW - 255kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 28,000 - 550,000',
    features: ['SolarMan app', 'HYD series', 'Wide MPPT', 'IP65'],
    commonIssues: ['WiFi logger issues', 'Grid detection', 'BMS communication'],
    supportInKenya: true,
  },
  {
    id: 'phocos',
    name: 'Phocos',
    country: 'Germany',
    website: 'https://www.phocos.com',
    types: ['off-grid'],
    powerRange: '150W - 5kW',
    warranty: '5 years',
    popularity: 'medium',
    priceRange: 'KES 20,000 - 300,000',
    features: ['Any-Grid series', 'Robust design', 'Remote monitoring', 'Wide temp range'],
    commonIssues: ['Firmware updates', 'Battery compatibility', 'Display issues'],
    supportInKenya: true,
  },
  {
    id: 'schneider',
    name: 'Schneider Electric',
    country: 'France',
    website: 'https://www.se.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '1kW - 100kW',
    warranty: '5-10 years',
    popularity: 'medium',
    priceRange: 'KES 80,000 - 1,500,000',
    features: ['Conext series', 'Industrial grade', 'Modbus communication', 'Stackable'],
    commonIssues: ['Configuration complexity', 'Firmware issues', 'Communication errors'],
    supportInKenya: true,
  },
  {
    id: 'outback',
    name: 'OutBack Power',
    country: 'USA',
    website: 'https://www.outbackpower.com',
    types: ['off-grid', 'hybrid'],
    powerRange: '2kW - 36kW',
    warranty: '5-10 years',
    popularity: 'low',
    priceRange: 'KES 150,000 - 2,000,000',
    features: ['FX series', 'Radian series', 'MATE controller', 'Stackable'],
    commonIssues: ['MATE communication', 'Stacking issues', 'FET failures'],
    supportInKenya: false,
  },
  {
    id: 'studer',
    name: 'Studer Innotec',
    country: 'Switzerland',
    website: 'https://www.studer-innotec.com',
    types: ['off-grid', 'hybrid'],
    powerRange: '0.2kW - 72kW',
    warranty: '5 years',
    popularity: 'low',
    priceRange: 'KES 200,000 - 3,000,000',
    features: ['Xtender series', 'Swiss quality', 'Modular design', 'Smart boost'],
    commonIssues: ['Parameter setup', 'Battery sync', 'Communication bus'],
    supportInKenya: false,
  },
  {
    id: 'voltronic',
    name: 'Voltronic Power',
    country: 'Taiwan',
    website: 'https://www.voltronicpower.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '1kW - 12kW',
    warranty: '2 years',
    popularity: 'high',
    priceRange: 'KES 18,000 - 250,000',
    features: ['Axpert series', 'Wide compatibility', 'Parallel ready', 'Budget option'],
    commonIssues: ['Fan failures', 'Output relay', 'Charging issues'],
    supportInKenya: true,
  },
  {
    id: 'mecer',
    name: 'Mecer',
    country: 'South Africa',
    website: 'https://www.mecer.co.za',
    types: ['hybrid', 'off-grid'],
    powerRange: '1kW - 10kW',
    warranty: '2 years',
    popularity: 'medium',
    priceRange: 'KES 25,000 - 300,000',
    features: ['SOL-I-AX series', 'African support', 'Parallel capable', 'LCD display'],
    commonIssues: ['Battery calibration', 'Overload trips', 'Display errors'],
    supportInKenya: true,
  },
  {
    id: 'kodak',
    name: 'Kodak Solar',
    country: 'South Africa',
    website: 'https://www.kodaksolar.com',
    types: ['hybrid', 'off-grid'],
    powerRange: '3kW - 10kW',
    warranty: '5 years',
    popularity: 'medium',
    priceRange: 'KES 45,000 - 350,000',
    features: ['King series', 'African design', 'Wide voltage', 'App monitoring'],
    commonIssues: ['WiFi connection', 'Battery settings', 'Overtemperature'],
    supportInKenya: true,
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER ERROR CODES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export interface InverterError {
  code: string;
  brand: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  causes: string[];
  solutions: string[];
  tools: string[];
  safetyWarning?: string;
  videoGuide?: string;
}

export const INVERTER_ERRORS: InverterError[] = [
  // GROWATT ERRORS
  {
    code: 'Error 101',
    brand: 'Growatt',
    description: 'Grid Lost / No AC Input',
    severity: 'warning',
    causes: [
      'Power outage from utility',
      'Loose AC input connections',
      'Tripped AC breaker',
      'Damaged AC cables',
      'Grid voltage out of range'
    ],
    solutions: [
      'Check if utility power is available at the meter',
      'Inspect and tighten all AC input terminals',
      'Reset any tripped breakers',
      'Measure AC voltage at input - should be 220-240V',
      'Check grid frequency (50Hz in Kenya)',
      'If persistent, adjust grid voltage range in settings'
    ],
    tools: ['Multimeter', 'Screwdriver set', 'Insulated gloves'],
    safetyWarning: 'Always turn off AC breaker before inspecting connections'
  },
  {
    code: 'Error 102',
    brand: 'Growatt',
    description: 'PV Input Over Voltage',
    severity: 'critical',
    causes: [
      'Too many panels in series',
      'Cold morning conditions increasing voltage',
      'Wrong panel configuration',
      'Faulty panel with high Voc'
    ],
    solutions: [
      'Calculate total Voc of string (add all panel Voc values)',
      'Ensure total Voc is below inverter max DC voltage',
      'Reduce panels in series or reconfigure',
      'Check individual panel voltages',
      'Account for temperature coefficient'
    ],
    tools: ['DC clamp meter', 'Panel datasheet', 'Calculator'],
    safetyWarning: 'DC voltage can be lethal! Never touch exposed DC connections'
  },
  {
    code: 'Error 103',
    brand: 'Growatt',
    description: 'PV Input Under Voltage',
    severity: 'warning',
    causes: [
      'Insufficient sunlight',
      'Shading on panels',
      'Dirty panels',
      'Faulty panel',
      'Loose DC connections'
    ],
    solutions: [
      'Wait for better sunlight conditions',
      'Remove shading obstacles',
      'Clean panels with water and soft cloth',
      'Check each panel voltage individually',
      'Inspect and tighten DC connections',
      'Test with known good panel'
    ],
    tools: ['DC clamp meter', 'Cleaning equipment', 'Screwdriver'],
  },
  {
    code: 'Error 104',
    brand: 'Growatt',
    description: 'Isolation Fault / Ground Fault',
    severity: 'critical',
    causes: [
      'Water ingress in junction boxes',
      'Damaged cable insulation',
      'Rodent damage to cables',
      'Faulty panel with internal short',
      'Moisture in connectors'
    ],
    solutions: [
      'Disconnect all strings and test isolation of each',
      'Inspect all junction boxes for water',
      'Check all cables for physical damage',
      'Use insulation tester (megger) on each string',
      'Replace any damaged components',
      'Ensure all connections are properly sealed'
    ],
    tools: ['Insulation tester (Megger)', 'DC clamp meter', 'Silicone sealant'],
    safetyWarning: 'Ground faults can cause fires! Do not operate until resolved'
  },
  {
    code: 'Error 105',
    brand: 'Growatt',
    description: 'Grid Frequency Error',
    severity: 'warning',
    causes: [
      'Unstable grid supply',
      'Generator frequency fluctuation',
      'Incorrect grid code settings',
      'Grid quality issues'
    ],
    solutions: [
      'Check grid frequency with meter (should be 49.5-50.5Hz)',
      'Widen frequency range in inverter settings if allowed',
      'Install grid stabilizer if problem persists',
      'Contact utility if issue is widespread',
      'For generator: adjust governor settings'
    ],
    tools: ['Frequency meter', 'Laptop with monitoring software'],
  },
  {
    code: 'Error 201',
    brand: 'Growatt',
    description: 'Battery Over Voltage',
    severity: 'critical',
    causes: [
      'Faulty charge controller',
      'Wrong battery voltage setting',
      'Failed BMS',
      'Incorrect battery type selection'
    ],
    solutions: [
      'Check battery voltage with multimeter',
      'Verify battery type setting matches actual battery',
      'Check BMS communication and status',
      'Reset inverter and reconfigure',
      'Check charging parameters (absorption, float voltages)'
    ],
    tools: ['Multimeter', 'BMS monitor app', 'Laptop'],
    safetyWarning: 'Overcharged batteries can explode! Ventilate area'
  },

  // VICTRON ERRORS
  {
    code: 'VE.Bus Error 1',
    brand: 'Victron',
    description: 'Device Switched Off',
    severity: 'info',
    causes: [
      'Manual switch-off via VRM or switch',
      'Remote control signal',
      'Low battery pre-alarm'
    ],
    solutions: [
      'Check physical switch position',
      'Check VRM portal for remote commands',
      'Check VE.Configure settings',
      'Verify no external switch is controlling the unit'
    ],
    tools: ['VRM access', 'VE.Configure software'],
  },
  {
    code: 'VE.Bus Error 2',
    brand: 'Victron',
    description: 'Inverter Overload',
    severity: 'critical',
    causes: [
      'Connected load exceeds inverter capacity',
      'Motor startup surge',
      'Short circuit in wiring',
      'Faulty appliance'
    ],
    solutions: [
      'Reduce connected load immediately',
      'Check for short circuits',
      'Disconnect loads one by one to find problem',
      'Check inverter temperature',
      'Allow cooldown before restart',
      'Consider upgrading inverter size'
    ],
    tools: ['Clamp meter', 'Load calculator'],
    safetyWarning: 'Overload can damage inverter permanently'
  },
  {
    code: 'VE.Bus Error 3',
    brand: 'Victron',
    description: 'DC Ripple Too High',
    severity: 'warning',
    causes: [
      'Poor battery connection',
      'Battery cables too thin',
      'Battery nearing end of life',
      'High resistance in DC path'
    ],
    solutions: [
      'Check and tighten all battery connections',
      'Measure voltage drop under load',
      'Upgrade battery cables if undersized',
      'Test battery capacity',
      'Clean all terminal connections'
    ],
    tools: ['Multimeter', 'Battery tester', 'Cable sizing chart'],
  },
  {
    code: 'VE.Bus Error 4',
    brand: 'Victron',
    description: 'Battery Low Voltage Pre-Alarm',
    severity: 'warning',
    causes: [
      'Battery discharged below set threshold',
      'Excessive load for battery size',
      'Insufficient charging',
      'Battery aging'
    ],
    solutions: [
      'Reduce loads or turn off non-essential items',
      'Start generator or connect to grid',
      'Check solar input is functioning',
      'Review battery capacity vs load requirements',
      'Test battery health'
    ],
    tools: ['Battery monitor', 'Load analyzer'],
  },
  {
    code: 'VE.Bus Error 5',
    brand: 'Victron',
    description: 'Battery Low Voltage Shutdown',
    severity: 'critical',
    causes: [
      'Battery critically discharged',
      'Failed to respond to pre-alarm',
      'Sudden high load demand',
      'Battery failure'
    ],
    solutions: [
      'Connect external charging source immediately',
      'Do not restart until battery is charged above threshold',
      'Check for parasitic loads draining battery',
      'Review system sizing',
      'Consider adding battery capacity'
    ],
    tools: ['Charger', 'Multimeter'],
    safetyWarning: 'Deep discharge damages batteries permanently'
  },

  // DEYE / SUNSYNK ERRORS
  {
    code: 'F01',
    brand: 'Deye',
    description: 'Grid Over Voltage',
    severity: 'warning',
    causes: [
      'Utility voltage too high',
      'Transformer tap setting wrong',
      'Light load on transformer',
      'Long distance from transformer'
    ],
    solutions: [
      'Measure grid voltage at meter',
      'Contact utility if consistently over 253V',
      'Adjust grid voltage range if safe to do so',
      'Install automatic voltage regulator',
      'Check for nearby industrial loads affecting grid'
    ],
    tools: ['Multimeter', 'Data logger'],
  },
  {
    code: 'F02',
    brand: 'Deye',
    description: 'Grid Under Voltage',
    severity: 'warning',
    causes: [
      'Weak grid supply',
      'Overloaded local transformer',
      'Poor wiring from meter',
      'High demand period'
    ],
    solutions: [
      'Measure voltage at different times of day',
      'Check wiring from meter to inverter',
      'Report to utility if persistent',
      'Consider voltage stabilizer',
      'Reduce load during low voltage periods'
    ],
    tools: ['Multimeter', 'Voltage logger'],
  },
  {
    code: 'F03',
    brand: 'Deye',
    description: 'Grid Over Frequency',
    severity: 'warning',
    causes: [
      'Generator speed too high',
      'Grid instability',
      'Wrong frequency setting'
    ],
    solutions: [
      'If on generator: reduce engine speed',
      'Check frequency setting matches grid (50Hz Kenya)',
      'Monitor grid frequency over time',
      'Contact utility if grid frequency unstable'
    ],
    tools: ['Frequency meter'],
  },
  {
    code: 'F04',
    brand: 'Deye',
    description: 'Grid Under Frequency',
    severity: 'warning',
    causes: [
      'Generator speed too low',
      'Grid overloaded',
      'Wrong frequency setting'
    ],
    solutions: [
      'If on generator: increase engine speed',
      'Verify 50Hz grid setting',
      'Reduce heavy loads during grid stress',
      'Contact utility if widespread issue'
    ],
    tools: ['Frequency meter'],
  },
  {
    code: 'F05',
    brand: 'Deye',
    description: 'PV Over Voltage',
    severity: 'critical',
    causes: [
      'Excessive panels in series',
      'Cold weather increasing Voc',
      'Panel mismatch'
    ],
    solutions: [
      'Reduce panels per string',
      'Check Voc against inverter maximum',
      'Account for -0.3%/°C temperature coefficient',
      'Reconfigure array'
    ],
    tools: ['DC meter', 'Calculator'],
    safetyWarning: 'High DC voltage is extremely dangerous!'
  },
  {
    code: 'F06',
    brand: 'Deye',
    description: 'Battery Over Voltage',
    severity: 'critical',
    causes: [
      'Wrong battery type selected',
      'BMS failure',
      'Charging voltage set too high'
    ],
    solutions: [
      'Verify battery type setting',
      'Check BMS status and communication',
      'Reduce charge voltage setting',
      'Check battery specifications'
    ],
    tools: ['Multimeter', 'BMS app'],
    safetyWarning: 'Risk of battery thermal runaway!'
  },
  {
    code: 'F07',
    brand: 'Deye',
    description: 'Battery Low Voltage',
    severity: 'warning',
    causes: [
      'Over-discharge',
      'Battery aging',
      'BMS cutoff',
      'High load demand'
    ],
    solutions: [
      'Reduce loads immediately',
      'Start charging from grid or generator',
      'Check battery health',
      'Review discharge settings'
    ],
    tools: ['Battery monitor'],
  },

  // GOODWE ERRORS
  {
    code: 'Fault 35',
    brand: 'GoodWe',
    description: 'Bus Voltage High',
    severity: 'critical',
    causes: [
      'DC bus capacitor failure',
      'Control board issue',
      'Excessive PV input'
    ],
    solutions: [
      'Power cycle the inverter',
      'Check PV input voltage',
      'Contact GoodWe support if persistent',
      'May require board replacement'
    ],
    tools: ['DC meter'],
    safetyWarning: 'Do not open inverter - internal capacitors hold lethal charge'
  },
  {
    code: 'Fault 36',
    brand: 'GoodWe',
    description: 'Bus Voltage Low',
    severity: 'warning',
    causes: [
      'Insufficient PV power',
      'Internal component failure',
      'DC fuse blown'
    ],
    solutions: [
      'Check PV string voltages',
      'Inspect DC fuses',
      'Verify all connections',
      'Power cycle inverter'
    ],
    tools: ['DC meter', 'Fuse tester'],
  },

  // MUST / AXPERT ERRORS
  {
    code: 'Fault 01',
    brand: 'Must/Voltronic',
    description: 'Fan Stuck',
    severity: 'warning',
    causes: [
      'Fan motor failure',
      'Dust accumulation blocking fan',
      'Fan connector loose',
      'Control circuit failure'
    ],
    solutions: [
      'Clean fan blades and housing',
      'Check fan connector',
      'Test fan by applying 12V directly',
      'Replace fan if faulty',
      'Ensure adequate ventilation around inverter'
    ],
    tools: ['Compressed air', '12V power source', 'Replacement fan'],
  },
  {
    code: 'Fault 02',
    brand: 'Must/Voltronic',
    description: 'Over Temperature',
    severity: 'critical',
    causes: [
      'Blocked ventilation',
      'High ambient temperature',
      'Overloading',
      'Fan failure',
      'Dust buildup inside'
    ],
    solutions: [
      'Turn off and let cool down',
      'Clean all vents and internal components',
      'Check fan operation',
      'Reduce load',
      'Improve installation ventilation',
      'Consider relocation to cooler area'
    ],
    tools: ['Compressed air', 'Thermometer', 'Vacuum cleaner'],
    safetyWarning: 'Allow minimum 30 minutes cooling before restart'
  },
  {
    code: 'Fault 03',
    brand: 'Must/Voltronic',
    description: 'Battery Voltage Too High',
    severity: 'critical',
    causes: [
      'Wrong battery type setting',
      'Charging voltage too high',
      'Battery BMS failure',
      'Charger malfunction'
    ],
    solutions: [
      'Verify battery type selection (AGM/Gel/Flooded/Lithium)',
      'Check and adjust charging voltages',
      'Measure actual battery voltage',
      'Disconnect solar and let battery rest',
      'Check BMS if lithium'
    ],
    tools: ['Multimeter', 'Programming cable'],
  },
  {
    code: 'Fault 04',
    brand: 'Must/Voltronic',
    description: 'Battery Voltage Too Low',
    severity: 'warning',
    causes: [
      'Over-discharge',
      'Battery failure',
      'High loads exceeding capacity',
      'Poor connections'
    ],
    solutions: [
      'Reduce or disconnect loads',
      'Check battery terminal connections',
      'Charge battery from grid or generator',
      'Test battery capacity',
      'Check low voltage cutoff setting'
    ],
    tools: ['Multimeter', 'Battery tester'],
  },
  {
    code: 'Fault 05',
    brand: 'Must/Voltronic',
    description: 'Output Short Circuit',
    severity: 'critical',
    causes: [
      'Short in output wiring',
      'Faulty appliance',
      'Damaged extension cord',
      'Water ingress in outlet'
    ],
    solutions: [
      'Disconnect all loads',
      'Check output wiring for shorts',
      'Test each circuit individually',
      'Inspect all outlets and connections',
      'Use cable tracer if needed'
    ],
    tools: ['Multimeter', 'Cable tracer', 'Insulation tester'],
    safetyWarning: 'Short circuits can cause fires! Do not reconnect until fault is found'
  },
  {
    code: 'Fault 06',
    brand: 'Must/Voltronic',
    description: 'Inverter Over Load',
    severity: 'critical',
    causes: [
      'Load exceeds inverter capacity',
      'Motor startup surge',
      'Multiple heavy loads starting simultaneously'
    ],
    solutions: [
      'Reduce connected loads',
      'Stagger startup of large appliances',
      'Check actual load with clamp meter',
      'Consider load management device',
      'Upgrade to larger inverter if needed'
    ],
    tools: ['Clamp meter', 'Load calculator'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING DIAGRAMS AND CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface WiringGuide {
  id: string;
  title: string;
  systemType: string;
  description: string;
  components: string[];
  steps: string[];
  calculations: {
    formula: string;
    description: string;
    example: string;
  }[];
  safetyNotes: string[];
  cableSizes: {
    current: string;
    cableSize: string;
    maxLength: string;
  }[];
}

export const WIRING_GUIDES: WiringGuide[] = [
  {
    id: 'basic-offgrid',
    title: 'Basic Off-Grid Solar System Wiring',
    systemType: 'Off-Grid',
    description: 'Complete wiring guide for a basic off-grid system with panels, charge controller, batteries, and inverter.',
    components: [
      'Solar Panels',
      'MC4 Connectors',
      'DC Isolator (PV side)',
      'MPPT/PWM Charge Controller',
      'Battery Bank',
      'Battery Fuse/Breaker',
      'DC Isolator (Battery side)',
      'Inverter',
      'AC Distribution Board',
      'Earth Rod'
    ],
    steps: [
      '1. Install earth rod and run earth cable to all equipment',
      '2. Mount solar panels securely on roof or ground mount',
      '3. Connect panels in series or parallel as per design',
      '4. Run DC cable from panels to DC isolator',
      '5. Connect DC isolator to charge controller PV input',
      '6. Connect batteries in series/parallel as required',
      '7. Install battery fuse close to battery positive',
      '8. Connect charge controller to battery bank',
      '9. Connect inverter to battery through DC isolator',
      '10. Connect inverter AC output to distribution board',
      '11. Test all connections before energizing',
      '12. Commission system and verify operation'
    ],
    calculations: [
      {
        formula: 'Voc (total) = Voc (panel) × Number in series',
        description: 'Calculate total open circuit voltage of string',
        example: 'If panel Voc = 45V and 4 panels in series: 45V × 4 = 180V DC'
      },
      {
        formula: 'Isc (total) = Isc (panel) × Number in parallel',
        description: 'Calculate total short circuit current',
        example: 'If panel Isc = 10A and 2 strings in parallel: 10A × 2 = 20A'
      },
      {
        formula: 'Cable size = (2 × L × I) / (VD% × Vs × 56)',
        description: 'Calculate minimum copper cable cross-section',
        example: 'L=10m, I=30A, VD=3%, Vs=48V: (2×10×30)/(0.03×48×56) = 7.4mm² → Use 10mm²'
      }
    ],
    safetyNotes: [
      'Never work on live DC circuits - PV produces power in daylight',
      'Cover panels with opaque material when working on DC side',
      'Use insulated tools rated for DC voltage',
      'Ensure all equipment is properly earthed',
      'Install DC-rated fuses and isolators',
      'Label all cables clearly'
    ],
    cableSizes: [
      { current: '10A', cableSize: '2.5mm²', maxLength: '10m' },
      { current: '20A', cableSize: '4mm²', maxLength: '8m' },
      { current: '30A', cableSize: '6mm²', maxLength: '7m' },
      { current: '40A', cableSize: '10mm²', maxLength: '8m' },
      { current: '60A', cableSize: '16mm²', maxLength: '7m' },
      { current: '80A', cableSize: '25mm²', maxLength: '7m' },
      { current: '100A', cableSize: '35mm²', maxLength: '8m' },
    ]
  },
  {
    id: 'hybrid-grid-tie',
    title: 'Hybrid Grid-Tied System Wiring',
    systemType: 'Hybrid',
    description: 'Wiring guide for hybrid systems that can operate on grid, solar, and battery with seamless switching.',
    components: [
      'Solar Array',
      'DC Isolator (PV)',
      'Hybrid Inverter',
      'Battery Bank with BMS',
      'DC Isolator (Battery)',
      'Grid Connection Point',
      'AC Isolator (Grid)',
      'CT Clamp (for feedback prevention)',
      'Distribution Board',
      'Essential/Non-Essential Load Separation',
      'Earth Leakage Protection'
    ],
    steps: [
      '1. Plan essential vs non-essential load separation',
      '2. Install main AC isolator at grid connection point',
      '3. Install CT clamp on grid supply cable (before inverter)',
      '4. Mount hybrid inverter in ventilated location',
      '5. Connect grid AC input to inverter',
      '6. Connect PV array through DC isolator',
      '7. Connect battery bank with BMS through DC isolator',
      '8. Connect inverter output to essential loads DB',
      '9. Configure grid feedback prevention settings',
      '10. Program time-of-use settings if applicable',
      '11. Test grid failure simulation',
      '12. Verify anti-islanding protection works'
    ],
    calculations: [
      {
        formula: 'Battery Ah = (Daily Load kWh × Autonomy Days × 1000) / (Battery V × DoD × Efficiency)',
        description: 'Calculate required battery capacity',
        example: 'Load=10kWh, 1 day autonomy, 48V, 80% DoD, 90% eff: (10×1×1000)/(48×0.8×0.9) = 289Ah'
      },
      {
        formula: 'PV Size kW = Daily Load kWh / (Peak Sun Hours × System Efficiency)',
        description: 'Calculate minimum PV array size',
        example: 'Load=10kWh, 5 sun hours, 75% efficiency: 10/(5×0.75) = 2.67kW minimum'
      }
    ],
    safetyNotes: [
      'Ensure anti-islanding is functional before grid connection',
      'CT clamp must be correctly oriented for proper metering',
      'Use appropriately rated AC protection',
      'Ground fault protection is mandatory',
      'Verify grid code compliance for your utility'
    ],
    cableSizes: [
      { current: '20A', cableSize: '4mm²', maxLength: '20m' },
      { current: '32A', cableSize: '6mm²', maxLength: '18m' },
      { current: '40A', cableSize: '10mm²', maxLength: '25m' },
      { current: '63A', cableSize: '16mm²', maxLength: '22m' },
      { current: '80A', cableSize: '25mm²', maxLength: '25m' },
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// BATTERY TYPES AND MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════════════

export interface BatteryType {
  id: string;
  name: string;
  chemistry: string;
  brands: string[];
  voltages: string[];
  lifespan: string;
  dod: string; // Depth of Discharge
  efficiency: string;
  chargingVoltages: {
    bulk: string;
    absorption: string;
    float: string;
    equalization?: string;
  };
  maintenance: string[];
  warnings: string[];
  idealFor: string[];
  priceRange: string;
}

export const BATTERY_TYPES: BatteryType[] = [
  {
    id: 'lead-acid-flooded',
    name: 'Flooded Lead Acid',
    chemistry: 'Lead-Acid (FLA)',
    brands: ['Trojan', 'Chloride Exide', 'Rolls', 'Crown', 'US Battery'],
    voltages: ['6V', '12V'],
    lifespan: '3-7 years (1000-1500 cycles)',
    dod: '50% recommended, 80% maximum',
    efficiency: '80-85%',
    chargingVoltages: {
      bulk: '14.4-14.8V (per 12V)',
      absorption: '14.4-14.6V (per 12V)',
      float: '13.2-13.5V (per 12V)',
      equalization: '15.5-16.0V (per 12V)'
    },
    maintenance: [
      'Check water level monthly - add distilled water if low',
      'Clean terminals with baking soda solution quarterly',
      'Equalize monthly to prevent stratification',
      'Check specific gravity with hydrometer',
      'Ensure adequate ventilation for hydrogen gas',
      'Keep tops clean and dry',
      'Tighten connections quarterly'
    ],
    warnings: [
      'Produces hydrogen gas - explosive! Ensure ventilation',
      'Contains sulfuric acid - wear protective gear',
      'Never add tap water - only distilled',
      'Never add acid - only water',
      'Do not overcharge - causes water loss and damage'
    ],
    idealFor: ['Off-grid homes', 'Budget installations', 'Areas with maintenance capability'],
    priceRange: 'KES 15,000 - 80,000 per battery'
  },
  {
    id: 'agm',
    name: 'AGM (Absorbent Glass Mat)',
    chemistry: 'Lead-Acid (VRLA-AGM)',
    brands: ['Victron', 'Trojan', 'Deka', 'Ritar', 'Leoch', 'Vision'],
    voltages: ['6V', '12V'],
    lifespan: '4-8 years (500-1200 cycles)',
    dod: '50% recommended, 80% maximum',
    efficiency: '85-90%',
    chargingVoltages: {
      bulk: '14.4-14.7V (per 12V)',
      absorption: '14.4-14.6V (per 12V)',
      float: '13.5-13.8V (per 12V)'
    },
    maintenance: [
      'Keep terminals clean and tight',
      'Check voltage monthly',
      'Ensure proper ventilation',
      'Avoid deep discharge below 50%',
      'Do not overcharge - damages plates',
      'Store fully charged in cool place'
    ],
    warnings: [
      'Sealed but can vent if overcharged - maintain ventilation',
      'Sensitive to overcharging - use correct charge profile',
      'Cannot add water - do not attempt to open',
      'Temperature sensitive - avoid extreme heat'
    ],
    idealFor: ['Solar backup systems', 'Clean installations', 'Limited maintenance environments'],
    priceRange: 'KES 25,000 - 150,000 per battery'
  },
  {
    id: 'gel',
    name: 'Gel Battery',
    chemistry: 'Lead-Acid (VRLA-Gel)',
    brands: ['Victron', 'BAE', 'Hoppecke', 'Sonnenschein'],
    voltages: ['6V', '12V'],
    lifespan: '5-10 years (800-1500 cycles)',
    dod: '60% recommended, 80% maximum',
    efficiency: '85-90%',
    chargingVoltages: {
      bulk: '14.1-14.4V (per 12V)',
      absorption: '14.0-14.2V (per 12V)',
      float: '13.5-13.8V (per 12V)'
    },
    maintenance: [
      'Keep terminals clean',
      'Check voltage regularly',
      'Ensure adequate ventilation',
      'Use correct gel battery charge profile',
      'Avoid fast charging',
      'Store in cool, dry location'
    ],
    warnings: [
      'Very sensitive to overcharging - can permanently damage',
      'Lower charge voltage than AGM - verify settings',
      'Do not use flooded battery charger',
      'Cannot be recovered once damaged'
    ],
    idealFor: ['Deep cycle applications', 'Hot climates', 'Sensitive equipment'],
    priceRange: 'KES 35,000 - 200,000 per battery'
  },
  {
    id: 'lithium-lfp',
    name: 'Lithium Iron Phosphate (LiFePO4)',
    chemistry: 'Lithium (LFP)',
    brands: ['BYD', 'Pylontech', 'Dyness', 'Freedom Won', 'Hubble', 'Shoto', 'Narada', 'CATL'],
    voltages: ['48V', '51.2V (common)', '96V', 'High Voltage'],
    lifespan: '10-15 years (4000-6000 cycles)',
    dod: '80% recommended, 90-95% maximum',
    efficiency: '95-98%',
    chargingVoltages: {
      bulk: '56.0-57.6V (per 48V nominal)',
      absorption: '56.0-57.6V (per 48V nominal)',
      float: '54.0-55.0V (per 48V nominal)'
    },
    maintenance: [
      'Check BMS status via app monthly',
      'Verify cell balancing is working',
      'Keep connections clean and tight',
      'Monitor cycle count',
      'Ensure firmware is updated',
      'Check communication cables',
      'Verify temperature readings'
    ],
    warnings: [
      'Requires compatible inverter with lithium settings',
      'BMS communication essential - do not bypass',
      'Do not exceed charge/discharge current limits',
      'Store between 30-70% SoC if unused',
      'Fire risk if damaged - do not puncture or crush'
    ],
    idealFor: ['Daily cycling', 'Long-term installations', 'Professional systems'],
    priceRange: 'KES 80,000 - 600,000 per battery module'
  },
  {
    id: 'lithium-nmc',
    name: 'Lithium NMC',
    chemistry: 'Lithium (NMC/NCM)',
    brands: ['Tesla Powerwall', 'LG Chem', 'Samsung SDI'],
    voltages: ['48V', 'High Voltage'],
    lifespan: '8-12 years (3000-5000 cycles)',
    dod: '80% recommended, 90% maximum',
    efficiency: '94-96%',
    chargingVoltages: {
      bulk: '57.0-58.8V (per 48V nominal)',
      absorption: '57.0-58.8V (per 48V nominal)',
      float: '54.0-55.0V (per 48V nominal)'
    },
    maintenance: [
      'Monitor via manufacturer app',
      'Keep cooling system clear',
      'Check for firmware updates',
      'Annual professional inspection recommended',
      'Verify ambient temperature within limits'
    ],
    warnings: [
      'Higher energy density means higher fire risk if mishandled',
      'Thermal management critical - do not obstruct vents',
      'Professional installation required',
      'More sensitive to high temperatures than LFP'
    ],
    idealFor: ['Residential storage', 'Space-constrained installations', 'Grid-tied systems'],
    priceRange: 'KES 150,000 - 800,000'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SOLAR PANEL MAINTENANCE
// ═══════════════════════════════════════════════════════════════════════════════

export interface PanelMaintenanceGuide {
  id: string;
  task: string;
  frequency: string;
  description: string;
  steps: string[];
  tools: string[];
  warnings: string[];
}

export const PANEL_MAINTENANCE: PanelMaintenanceGuide[] = [
  {
    id: 'cleaning',
    task: 'Panel Cleaning',
    frequency: 'Monthly or as needed',
    description: 'Regular cleaning maintains optimal power output. Dust, bird droppings, and pollen can reduce output by 5-25%.',
    steps: [
      'Clean early morning or late afternoon when panels are cool',
      'Turn off inverter or cover panels if possible',
      'Rinse with clean water to remove loose debris',
      'Use soft brush or sponge with mild soap solution',
      'Rinse thoroughly with clean water',
      'Allow to dry naturally',
      'Check for any damage while cleaning'
    ],
    tools: ['Soft brush', 'Bucket', 'Mild soap', 'Garden hose', 'Squeegee (optional)'],
    warnings: [
      'Never clean hot panels - thermal shock can crack glass',
      'Never use abrasive materials or pressure washer',
      'Do not walk on panels',
      'Do not use harsh chemicals',
      'Be careful on roof - use proper safety equipment'
    ]
  },
  {
    id: 'visual-inspection',
    task: 'Visual Inspection',
    frequency: 'Monthly',
    description: 'Regular visual inspection helps catch problems early before they cause system failures.',
    steps: [
      'Check for cracked or damaged glass',
      'Look for discoloration, hot spots, or brown marks',
      'Inspect frame for corrosion or damage',
      'Check mounting system for loose bolts',
      'Examine cables for damage or rodent bites',
      'Verify junction boxes are sealed',
      'Look for debris accumulation',
      'Check for shading from new growth or structures'
    ],
    tools: ['Binoculars (for roof inspection)', 'Camera', 'Notebook', 'Flashlight'],
    warnings: [
      'Do not touch electrical connections',
      'Use proper fall protection on roof',
      'Document any issues with photos'
    ]
  },
  {
    id: 'electrical-check',
    task: 'Electrical Testing',
    frequency: 'Quarterly',
    description: 'Verify panels are producing expected power and connections are sound.',
    steps: [
      'Record ambient temperature and irradiance',
      'Measure Voc of each string (disconnect from inverter)',
      'Measure Isc if equipment available',
      'Check for significant voltage differences between strings',
      'Inspect all connections for tightness and corrosion',
      'Check DC cable insulation',
      'Verify fuses are intact',
      'Compare production to expected values'
    ],
    tools: ['DC clamp meter', 'Multimeter', 'Torque wrench', 'Irradiance meter (optional)'],
    warnings: [
      'DC voltage is dangerous - use proper PPE',
      'Never short circuit panels',
      'Cover panels if working on DC connections',
      'Use DC-rated test equipment'
    ]
  },
  {
    id: 'thermal-imaging',
    task: 'Thermal Imaging Inspection',
    frequency: 'Annually',
    description: 'Thermal imaging reveals hot spots, cell failures, and connection issues not visible to the eye.',
    steps: [
      'Perform during peak sun hours (10am-2pm)',
      'System must be operating under load',
      'Scan each panel systematically',
      'Note any hot cells or connection points',
      'Compare temperature differentials',
      'Document findings with images',
      'Correlate with electrical performance data'
    ],
    tools: ['Thermal camera', 'Ladder/Drone', 'Safety equipment', 'Documentation software'],
    warnings: [
      'Requires specialized equipment and training',
      'System must be under load for accurate reading',
      'Hot spots over 30°C above surrounding cells indicate problems',
      'Consider professional service for this inspection'
    ]
  },
  {
    id: 'connection-maintenance',
    task: 'Connection Tightening',
    frequency: 'Annually',
    description: 'Loose connections cause resistance, heating, and can be fire hazards.',
    steps: [
      'Turn off all isolators and cover panels',
      'Check all MC4 connections are fully clicked',
      'Tighten all terminal screws to specified torque',
      'Inspect for any signs of heating (discoloration)',
      'Check earth connections',
      'Apply anti-oxidant to terminals if needed',
      'Verify cable clamps are secure',
      'Re-check routing - no sharp bends or stress'
    ],
    tools: ['Insulated screwdrivers', 'Torque screwdriver', 'Anti-oxidant compound', 'Insulated gloves'],
    warnings: [
      'Always isolate before working on connections',
      'DC systems remain live when illuminated',
      'Do not overtorque - damages terminals',
      'Replace any damaged connectors'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON REPAIRS AND PARTS
// ═══════════════════════════════════════════════════════════════════════════════

export interface RepairPart {
  id: string;
  name: string;
  category: 'inverter' | 'panel' | 'battery' | 'wiring' | 'protection';
  description: string;
  commonFailures: string[];
  symptoms: string[];
  repairDifficulty: 'easy' | 'moderate' | 'difficult' | 'professional';
  estimatedCost: string;
  diyPossible: boolean;
  replacementSteps: string[];
}

export const REPAIR_PARTS: RepairPart[] = [
  {
    id: 'inverter-fan',
    name: 'Inverter Cooling Fan',
    category: 'inverter',
    description: 'Internal fans that cool inverter components. Failure causes overheating.',
    commonFailures: ['Bearing wear', 'Dust accumulation', 'Motor burnout'],
    symptoms: ['Overtemperature errors', 'Loud noise', 'No fan spin', 'Inverter shutdown'],
    repairDifficulty: 'moderate',
    estimatedCost: 'KES 500 - 3,000',
    diyPossible: true,
    replacementSteps: [
      'Power off and isolate inverter completely',
      'Open inverter case (note: may void warranty)',
      'Identify fan model number',
      'Disconnect fan connector',
      'Remove mounting screws',
      'Install new fan in same orientation',
      'Reconnect and test before closing'
    ]
  },
  {
    id: 'mc4-connector',
    name: 'MC4 Connectors',
    category: 'wiring',
    description: 'Standard solar panel connectors. Damaged connectors cause arcing and power loss.',
    commonFailures: ['Water ingress', 'UV degradation', 'Poor crimping', 'Arcing damage'],
    symptoms: ['Intermittent power', 'Hot connections', 'Visible damage', 'Burnt smell'],
    repairDifficulty: 'easy',
    estimatedCost: 'KES 100 - 500 per pair',
    diyPossible: true,
    replacementSteps: [
      'Cover panels or work at night',
      'Cut damaged connector off',
      'Strip cable 8mm',
      'Crimp new contact to cable',
      'Insert into connector housing',
      'Ensure correct polarity',
      'Test connection before re-energizing'
    ]
  },
  {
    id: 'dc-fuse',
    name: 'DC Fuse / Fuse Holder',
    category: 'protection',
    description: 'Protects system from overcurrent. Blown fuses indicate problems.',
    commonFailures: ['Overcurrent', 'Age deterioration', 'Vibration', 'Corrosion'],
    symptoms: ['No power from string', 'Intermittent power', 'Visible damage to fuse'],
    repairDifficulty: 'easy',
    estimatedCost: 'KES 200 - 2,000',
    diyPossible: true,
    replacementSteps: [
      'Identify fuse rating (check original)',
      'Turn off all isolators',
      'Remove blown fuse',
      'Inspect holder for damage',
      'Install correctly rated replacement',
      'Re-energize and monitor'
    ]
  },
  {
    id: 'battery-terminal',
    name: 'Battery Terminals / Lugs',
    category: 'battery',
    description: 'Connection points between batteries and cables. Corrosion causes resistance.',
    commonFailures: ['Corrosion', 'Loose connection', 'Undersized lugs', 'Poor crimping'],
    symptoms: ['Hot connections', 'Voltage drop', 'Green/white corrosion', 'Burning smell'],
    repairDifficulty: 'easy',
    estimatedCost: 'KES 100 - 500 per lug',
    diyPossible: true,
    replacementSteps: [
      'Disconnect battery bank (negative first)',
      'Remove old terminal',
      'Clean battery post thoroughly',
      'Crimp or solder new lug to cable',
      'Apply anti-oxidant to surfaces',
      'Tighten to correct torque',
      'Apply protective spray'
    ]
  },
  {
    id: 'charge-controller',
    name: 'Charge Controller',
    category: 'inverter',
    description: 'Regulates charging from solar to battery. Can be separate or built into inverter.',
    commonFailures: ['Surge damage', 'Overheating', 'Component failure', 'Lightning damage'],
    symptoms: ['No charging', 'Overcharging', 'Display errors', 'Erratic operation'],
    repairDifficulty: 'moderate',
    estimatedCost: 'KES 5,000 - 50,000 (replacement)',
    diyPossible: true,
    replacementSteps: [
      'Document all settings if possible',
      'Disconnect PV input first',
      'Disconnect battery',
      'Remove old controller',
      'Install new controller',
      'Connect battery first',
      'Connect PV',
      'Configure settings',
      'Test operation'
    ]
  },
  {
    id: 'surge-protector',
    name: 'Surge Protection Device (SPD)',
    category: 'protection',
    description: 'Protects against lightning and surge damage. Essential in Kenya during rain season.',
    commonFailures: ['Surge events', 'Age', 'Direct lightning strike'],
    symptoms: ['Indicator shows fault', 'System damage after storm', 'No protection light'],
    repairDifficulty: 'easy',
    estimatedCost: 'KES 2,000 - 15,000',
    diyPossible: true,
    replacementSteps: [
      'Turn off all isolators',
      'Remove old SPD module',
      'Check earth connection is sound',
      'Install new module',
      'Verify indicator shows protected',
      'Test system operation'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// TROUBLESHOOTING DECISION TREE
// ═══════════════════════════════════════════════════════════════════════════════

export interface TroubleshootingNode {
  id: string;
  question: string;
  options: {
    answer: string;
    nextNodeId?: string;
    solution?: string;
    severity?: 'info' | 'warning' | 'critical';
  }[];
}

export const TROUBLESHOOTING_TREES: { [key: string]: TroubleshootingNode[] } = {
  'no-power': [
    {
      id: 'start',
      question: 'Is the inverter display showing anything?',
      options: [
        { answer: 'Yes, display is on', nextNodeId: 'display-on' },
        { answer: 'No, display is completely off', nextNodeId: 'display-off' }
      ]
    },
    {
      id: 'display-off',
      question: 'Is battery voltage present at inverter input?',
      options: [
        { answer: 'Yes, battery voltage is present', nextNodeId: 'voltage-present' },
        { answer: 'No voltage at inverter', nextNodeId: 'no-voltage' }
      ]
    },
    {
      id: 'no-voltage',
      question: 'Is the battery fuse/breaker intact?',
      options: [
        { answer: 'Yes, fuse is good', nextNodeId: 'check-cables' },
        { answer: 'Fuse is blown', solution: 'Replace fuse with same rating. If it blows again, check for short circuit.', severity: 'warning' }
      ]
    },
    {
      id: 'check-cables',
      question: 'Are all DC cables connected and undamaged?',
      options: [
        { answer: 'Yes, cables look fine', solution: 'Check battery voltage directly. If battery is dead, charge from external source.', severity: 'warning' },
        { answer: 'Cables are loose or damaged', solution: 'Repair or replace damaged cables. Ensure proper crimping and torque.', severity: 'warning' }
      ]
    },
    {
      id: 'voltage-present',
      question: 'Is the inverter switch in the ON position?',
      options: [
        { answer: 'Yes, switch is ON', solution: 'Internal inverter fault. Check for error codes when powered. May need professional service.', severity: 'critical' },
        { answer: 'Switch was OFF', solution: 'Turn switch ON and wait for startup sequence.', severity: 'info' }
      ]
    },
    {
      id: 'display-on',
      question: 'Is there an error code displayed?',
      options: [
        { answer: 'Yes, showing error code', solution: 'Note the error code and look up in the error codes database for specific solution.', severity: 'warning' },
        { answer: 'No error, but no output', nextNodeId: 'no-output' }
      ]
    },
    {
      id: 'no-output',
      question: 'Is the inverter in standby/bypass mode?',
      options: [
        { answer: 'Yes, in standby', solution: 'Check mode settings. May need to switch to inverter mode manually.', severity: 'info' },
        { answer: 'Should be in inverter mode', solution: 'Check output breaker and wiring. Test with known working load.', severity: 'warning' }
      ]
    }
  ],
  'low-production': [
    {
      id: 'start',
      question: 'When did you notice the low production?',
      options: [
        { answer: 'Sudden drop', nextNodeId: 'sudden-drop' },
        { answer: 'Gradual decline', nextNodeId: 'gradual-decline' },
        { answer: 'Always lower than expected', nextNodeId: 'always-low' }
      ]
    },
    {
      id: 'sudden-drop',
      question: 'Did anything change recently (weather, construction, trees)?',
      options: [
        { answer: 'New shading observed', solution: 'Identify shading source. Trim trees or relocate panels if possible. Consider optimizers or microinverters.', severity: 'warning' },
        { answer: 'No visible changes', nextNodeId: 'check-components' }
      ]
    },
    {
      id: 'check-components',
      question: 'Check inverter - any error codes?',
      options: [
        { answer: 'Yes, error codes present', solution: 'Address error codes first. Common causes: ground fault, string imbalance, communication error.', severity: 'warning' },
        { answer: 'No errors showing', nextNodeId: 'check-strings' }
      ]
    },
    {
      id: 'check-strings',
      question: 'Measure voltage of each PV string. Are they similar?',
      options: [
        { answer: 'One string significantly lower', solution: 'Check that string for: damaged panel, loose connector, failed optimizer, blown fuse.', severity: 'warning' },
        { answer: 'All strings similar but low', solution: 'Possible soiling, panel degradation, or system-wide issue. Clean panels and retest.', severity: 'info' }
      ]
    },
    {
      id: 'gradual-decline',
      question: 'When were panels last cleaned?',
      options: [
        { answer: 'Over 3 months ago', solution: 'Clean panels thoroughly. Soiling can reduce output 5-25%. Schedule regular cleaning.', severity: 'info' },
        { answer: 'Recently cleaned', nextNodeId: 'check-degradation' }
      ]
    },
    {
      id: 'check-degradation',
      question: 'How old is the system?',
      options: [
        { answer: 'Over 10 years', solution: 'Normal panel degradation (~0.5%/year). Consider thermal imaging to find failed cells.', severity: 'info' },
        { answer: 'Under 10 years', solution: 'Premature degradation possible. Check panel warranty and consider professional inspection.', severity: 'warning' }
      ]
    },
    {
      id: 'always-low',
      question: 'Was the system designed correctly for your load?',
      options: [
        { answer: 'Not sure', solution: 'Review system sizing. Calculate daily kWh need and compare to expected production (kW × sun hours × 0.75).', severity: 'info' },
        { answer: 'Yes, was designed correctly', solution: 'Check orientation, tilt angle, and any shading issues. Use monitoring to compare actual vs expected.', severity: 'warning' }
      ]
    }
  ]
};

export default {
  INVERTER_BRANDS,
  INVERTER_ERRORS,
  WIRING_GUIDES,
  BATTERY_TYPES,
  PANEL_MAINTENANCE,
  REPAIR_PARTS,
  TROUBLESHOOTING_TREES
};
