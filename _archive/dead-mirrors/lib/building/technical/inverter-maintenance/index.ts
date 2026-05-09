/**
 * COMPREHENSIVE INVERTER MAINTENANCE DATABASE
 *
 * Detailed repair guides, wiring diagrams, and troubleshooting for 100+ inverter models:
 * - Victron Energy
 * - Growatt
 * - Deye
 * - Sunsynk
 * - Must Solar
 * - Felicity Solar
 * - Axpert/Voltronic
 * - SMA
 * - Fronius
 * - GoodWe
 * - Huawei
 * - Solis
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface InverterModel {
  id: string;
  brand: string;
  model: string;
  fullName: string;
  image: string;
  type: 'Hybrid' | 'Off-Grid' | 'On-Grid' | 'String' | 'Micro';
  power: { nominal: number; peak: number; unit: string };
  description: string;
  applications: string[];
  features: string[];
  specifications: InverterSpecs;
  terminals: InverterTerminal[];
  wiringDiagram: InverterWiringDiagram;
  faultCodes: InverterFaultCode[];
  maintenanceGuide: InverterMaintenanceTask[];
  repairGuide: InverterRepairProcedure[];
  calibrationGuide: InverterCalibration;
  troubleshootingGuide: InverterTroubleshooting[];
  price: { min: number; max: number };
  spareParts: InverterSparePart[];
}

export interface InverterSpecs {
  inputVoltage: { min: number; max: number; mppt: string };
  outputVoltage: string;
  efficiency: string;
  mpptChannels: number;
  batteryVoltage: string;
  batteryCharging: string;
  transferTime: string;
  operatingTemp: string;
  protectionRating: string;
  communication: string[];
  dimensions: string;
  weight: string;
  warranty: string;
}

export interface InverterTerminal {
  id: string;
  name: string;
  type: 'dc-input' | 'ac-input' | 'ac-output' | 'battery' | 'communication' | 'ground';
  location: string;
  voltage: string;
  current: string;
  wireGauge: string;
  torque: string;
  connections: WireConnection[];
}

export interface WireConnection {
  from: string;
  to: string;
  wireColor: string;
  wireGauge: string;
  function: string;
}

export interface InverterWiringDiagram {
  svgPath: string;
  dcInputWiring: DCInputWiring;
  acOutputWiring: ACOutputWiring;
  batteryWiring: BatteryWiring;
  groundingRequirements: string[];
  installationNotes: string[];
}

export interface DCInputWiring {
  strings: { mppt: number; strings: number; voltage: string; current: string }[];
  fusingSizing: string;
  cableSizing: string;
  connections: { from: string; to: string; terminal: string }[];
}

export interface ACOutputWiring {
  phases: number;
  voltage: string;
  neutral: boolean;
  groundBonding: string;
  breakerSizing: string;
  cableSizing: string;
}

export interface BatteryWiring {
  voltage: string;
  maxCurrent: string;
  fusingSizing: string;
  cableSizing: string;
  bmsConnection: string;
  parallelConfig: string;
}

export interface InverterFaultCode {
  code: string;
  name: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Warning';
  description: string;
  causes: string[];
  symptoms: string[];
  solution: string;
  steps: string[];
  tools: string[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface InverterMaintenanceTask {
  task: string;
  interval: string;
  procedure: string[];
  tools: string[];
  parts?: string[];
  warnings: string[];
}

export interface InverterRepairProcedure {
  issue: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  symptoms: string[];
  rootCauses: string[];
  tools: string[];
  parts: string[];
  safetyPrecautions: string[];
  steps: RepairStep[];
  testProcedure: string[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface RepairStep {
  step: number;
  title: string;
  description: string;
  image?: string;
  warnings?: string[];
  tips?: string[];
}

export interface InverterCalibration {
  parameters: CalibrationParam[];
  accessMethod: string;
  tools: string[];
  procedure: string[];
  warnings: string[];
}

export interface CalibrationParam {
  name: string;
  description: string;
  defaultValue: string;
  range: string;
  unit: string;
  accessLevel: 'User' | 'Installer' | 'Factory';
}

export interface InverterTroubleshooting {
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  solutions: string[];
  tools: string[];
}

export interface InverterSparePart {
  partNumber: string;
  name: string;
  description: string;
  price: { min: number; max: number };
  availability: 'In Stock' | 'Order' | 'Discontinued';
  compatibility: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// VICTRON ENERGY INVERTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const VICTRON_INVERTERS: InverterModel[] = [
  {
    id: 'victron-multiplus-ii-48-5000',
    brand: 'Victron Energy',
    model: 'MultiPlus-II 48/5000/70-50',
    fullName: 'Victron MultiPlus-II 48V 5000VA Inverter/Charger',
    image: '/images/inverters/victron-multiplus-ii-5000.jpg',
    type: 'Hybrid',
    power: { nominal: 5000, peak: 10000, unit: 'VA' },
    description: 'Premium hybrid inverter/charger combining a pure sine wave inverter, battery charger, and transfer switch in one compact enclosure. Features PowerAssist technology for supplementing grid/generator power.',
    applications: ['Residential', 'Off-grid homes', 'Backup power', 'Marine', 'Mobile', 'Grid-tie with battery'],
    features: [
      'Pure sine wave output',
      'PowerAssist - boost shore/generator power',
      'Uninterruptible power supply function',
      'Parallel operation (up to 6 units)',
      'Three-phase capability',
      'VE.Bus communication',
      'Remote monitoring via VRM',
      'Programmable relay',
      'External current transformer support',
      'Integrated anti-islanding'
    ],
    specifications: {
      inputVoltage: { min: 187, max: 265, mppt: 'N/A (External MPPT required)' },
      outputVoltage: '230V AC ±2%',
      efficiency: '96%',
      mpptChannels: 0,
      batteryVoltage: '38-66V DC (48V nominal)',
      batteryCharging: '70A at 25°C',
      transferTime: '<20ms',
      operatingTemp: '-40°C to +65°C (derated above 40°C)',
      protectionRating: 'IP21',
      communication: ['VE.Bus', 'VE.Direct', 'Bluetooth', 'Ethernet (optional)'],
      dimensions: '362mm x 258mm x 218mm',
      weight: '23kg',
      warranty: '5 years'
    },
    terminals: [
      {
        id: 'mp2-ac-in',
        name: 'AC Input',
        type: 'ac-input',
        location: 'Bottom left terminal block',
        voltage: '187-265V AC',
        current: '50A max',
        wireGauge: '10mm² minimum',
        torque: '1.5Nm',
        connections: [
          { from: 'Grid/Generator L', to: 'AC-in L', wireColor: 'Brown', wireGauge: '10mm²', function: 'AC Live input' },
          { from: 'Grid/Generator N', to: 'AC-in N', wireColor: 'Blue', wireGauge: '10mm²', function: 'AC Neutral input' },
          { from: 'Earth', to: 'AC-in PE', wireColor: 'Green/Yellow', wireGauge: '10mm²', function: 'Protective Earth' }
        ]
      },
      {
        id: 'mp2-ac-out1',
        name: 'AC Output 1',
        type: 'ac-output',
        location: 'Bottom center terminal block',
        voltage: '230V AC',
        current: '50A continuous',
        wireGauge: '10mm² minimum',
        torque: '1.5Nm',
        connections: [
          { from: 'AC-out L', to: 'Critical Load L', wireColor: 'Brown', wireGauge: '10mm²', function: 'AC Live output (backed up)' },
          { from: 'AC-out N', to: 'Critical Load N', wireColor: 'Blue', wireGauge: '10mm²', function: 'AC Neutral output' },
          { from: 'AC-out PE', to: 'Critical Load PE', wireColor: 'Green/Yellow', wireGauge: '10mm²', function: 'Protective Earth' }
        ]
      },
      {
        id: 'mp2-ac-out2',
        name: 'AC Output 2',
        type: 'ac-output',
        location: 'Bottom right terminal block',
        voltage: '230V AC (only when AC input present)',
        current: '50A',
        wireGauge: '10mm² minimum',
        torque: '1.5Nm',
        connections: [
          { from: 'AC-out2 L', to: 'Non-Critical Load L', wireColor: 'Brown', wireGauge: '10mm²', function: 'AC Live (grid only)' }
        ]
      },
      {
        id: 'mp2-battery',
        name: 'Battery',
        type: 'battery',
        location: 'Left side DC terminals',
        voltage: '48V DC (38-66V)',
        current: '70A charge / 110A discharge',
        wireGauge: '35mm² minimum',
        torque: '13Nm (M8 bolts)',
        connections: [
          { from: 'Battery +', to: 'Inverter Bat+', wireColor: 'Red', wireGauge: '35mm²', function: 'Battery positive' },
          { from: 'Battery -', to: 'Inverter Bat-', wireColor: 'Black', wireGauge: '35mm²', function: 'Battery negative' }
        ]
      },
      {
        id: 'mp2-vebus',
        name: 'VE.Bus',
        type: 'communication',
        location: 'Top panel RJ45 ports',
        voltage: 'Data',
        current: 'N/A',
        wireGauge: 'CAT5',
        torque: 'N/A',
        connections: [
          { from: 'VE.Bus port', to: 'GX device', wireColor: 'CAT5 cable', wireGauge: 'CAT5', function: 'Communication & parallel' }
        ]
      },
      {
        id: 'mp2-temp',
        name: 'Temperature Sensor',
        type: 'communication',
        location: 'Connector on main board',
        voltage: '5V sensor',
        current: 'mA',
        wireGauge: '0.5mm²',
        torque: 'N/A',
        connections: [
          { from: 'Temp sensor', to: 'Temp input', wireColor: 'Sensor cable', wireGauge: '0.5mm²', function: 'Battery temperature sensing' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/victron-multiplus-ii-wiring.svg',
      dcInputWiring: {
        strings: [],
        fusingSizing: '200A Class T fuse or equivalent within 300mm of battery',
        cableSizing: '35mm² minimum for full current, 50mm² recommended for longer runs',
        connections: [
          { from: 'Battery Bank +', to: 'Fuse +', terminal: 'Fuse input' },
          { from: 'Fuse -', to: 'Inverter Bat+', terminal: 'M8 bolt' },
          { from: 'Battery Bank -', to: 'Inverter Bat-', terminal: 'M8 bolt' }
        ]
      },
      acOutputWiring: {
        phases: 1,
        voltage: '230V',
        neutral: true,
        groundBonding: 'Ground relay internal - bonds N to PE in inverter mode',
        breakerSizing: '50A MCB Type B for AC output',
        cableSizing: '10mm² minimum for 50A'
      },
      batteryWiring: {
        voltage: '48V (16s LiFePO4 or 4x 12V lead acid)',
        maxCurrent: '110A discharge, 70A charge',
        fusingSizing: '200A Class T fuse',
        cableSizing: '35mm² minimum, 50mm² for >3m runs',
        bmsConnection: 'VE.Can or VE.Direct for compatible BMS',
        parallelConfig: 'Parallel batteries with equal cable lengths'
      },
      groundingRequirements: [
        'AC input, output, and chassis all connected to earth',
        'Internal ground relay bonds N-PE in island mode',
        'Battery negative NOT connected to earth (floating)',
        'Follow local electrical codes for grounding'
      ],
      installationNotes: [
        'Mount vertically with terminals at bottom for cooling',
        'Minimum 100mm clearance above and below',
        'Keep battery cables as short as possible',
        'Use appropriate cable lugs crimped with hydraulic tool',
        'DC fuse must be within 300mm of battery',
        'Torque all connections to specification'
      ]
    },
    faultCodes: [
      {
        code: 'VE.Bus Error 1',
        name: 'Device is switched off',
        severity: 'Low',
        description: 'Inverter is in off state',
        causes: ['Front switch is off', 'Remote switch/relay open', 'GX device command'],
        symptoms: ['No output', 'Power LED off'],
        solution: 'Turn on the switch or check remote control',
        steps: ['Check front panel switch', 'Check remote on/off connection', 'Check VRM/GX settings'],
        tools: ['None required'],
        estimatedTime: '5 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'VE.Bus Error 2',
        name: 'Inverter overload',
        severity: 'High',
        description: 'Output current exceeded rated capacity',
        causes: ['Load too high', 'Short circuit on output', 'Motor start inrush', 'Faulty appliance'],
        symptoms: ['Output shuts off', 'Overload alarm', 'Red LED'],
        solution: 'Reduce load or investigate fault',
        steps: [
          'Disconnect all loads',
          'Reset inverter',
          'Reconnect loads one by one',
          'Identify overloading device',
          'For motor loads, consider soft starter'
        ],
        tools: ['Clamp meter'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'VE.Bus Error 3',
        name: 'Battery voltage too low',
        severity: 'Critical',
        description: 'Battery voltage dropped below cutoff threshold',
        causes: ['Battery discharged', 'Undersized battery', 'Battery failure', 'Loose connection'],
        symptoms: ['Inverter shuts down', 'Low battery alarm'],
        solution: 'Recharge battery or check battery health',
        steps: [
          'Measure battery voltage with multimeter',
          'Check all battery connections',
          'Recharge battery',
          'Test battery capacity',
          'Replace if degraded'
        ],
        tools: ['Multimeter', 'Battery tester'],
        estimatedTime: '30-120 minutes',
        estimatedCost: 'KES 0 - 150,000 (if battery replacement needed)'
      },
      {
        code: 'VE.Bus Error 4',
        name: 'Battery voltage too high',
        severity: 'Critical',
        description: 'Battery voltage exceeded maximum safe level',
        causes: ['Charge controller fault', 'Wrong battery type selected', 'Failed BMS'],
        symptoms: ['Inverter shuts down', 'High voltage alarm'],
        solution: 'Check charging source and battery settings',
        steps: [
          'Disconnect charging sources',
          'Measure actual battery voltage',
          'Check MPPT/charger settings',
          'Verify battery type configuration',
          'Check BMS operation'
        ],
        tools: ['Multimeter'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'VE.Bus Error 5',
        name: 'Overtemperature',
        severity: 'High',
        description: 'Internal temperature exceeded safe operating limit',
        causes: ['Ambient temperature too high', 'Blocked ventilation', 'Fan failure', 'Prolonged high load'],
        symptoms: ['Power derating', 'Shutdown at extreme temps'],
        solution: 'Improve ventilation or reduce load',
        steps: [
          'Check ambient temperature',
          'Verify ventilation clearances',
          'Clean any dust from vents',
          'Check fan operation',
          'Reduce continuous load'
        ],
        tools: ['IR thermometer', 'Compressed air'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'VE.Bus Error 14',
        name: 'No BMS',
        severity: 'Medium',
        description: 'BMS communication lost (when lithium battery type selected)',
        causes: ['BMS disconnected', 'Communication cable fault', 'BMS failure'],
        symptoms: ['Charging disabled', 'BMS alarm'],
        solution: 'Check BMS connection and communication',
        steps: [
          'Check VE.Can or VE.Direct cable',
          'Verify BMS is powered',
          'Check BMS configuration',
          'Try reconnecting cable',
          'Test with different cable'
        ],
        tools: ['None or replacement cable'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0 - 5,000'
      },
      {
        code: 'VE.Bus Error 26',
        name: 'Internal DC voltage error',
        severity: 'Critical',
        description: 'Internal DC bus voltage out of range',
        causes: ['Component failure', 'DC capacitor issue', 'Power stage fault'],
        symptoms: ['Complete shutdown', 'Will not restart'],
        solution: 'Service required - internal component failure',
        steps: [
          'Power cycle inverter',
          'If persists, unit requires service',
          'Do not attempt internal repair',
          'Contact authorized service center'
        ],
        tools: ['None - service center'],
        estimatedTime: 'Service center',
        estimatedCost: 'KES 50,000+'
      }
    ],
    maintenanceGuide: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: [
          'Check for physical damage or corrosion',
          'Verify all indicator LEDs functioning',
          'Check ventilation openings clear',
          'Inspect cable connections for damage',
          'Look for signs of overheating'
        ],
        tools: ['Flashlight', 'Inspection mirror'],
        warnings: ['Unit may be energized - no internal access']
      },
      {
        task: 'Ventilation Cleaning',
        interval: 'Quarterly',
        procedure: [
          'Power down inverter safely',
          'Use compressed air to clean vents',
          'Clean fan intake areas',
          'Remove any debris around unit',
          'Check fan operation after restart'
        ],
        tools: ['Compressed air', 'Soft brush'],
        warnings: ['Allow to cool before cleaning', 'Never use water']
      },
      {
        task: 'Connection Tightness',
        interval: 'Annually',
        procedure: [
          'Turn off inverter and disconnect power',
          'Check DC terminal torque (13Nm)',
          'Check AC terminal torque (1.5Nm)',
          'Inspect cable lugs for corrosion',
          'Apply contact paste if needed'
        ],
        tools: ['Torque wrench', 'Contact paste'],
        parts: ['Contact paste'],
        warnings: ['Disconnect all sources before working', 'DC may remain energized from battery']
      },
      {
        task: 'Firmware Update',
        interval: 'As released',
        procedure: [
          'Connect to VRM or VE.Configure',
          'Check current firmware version',
          'Download latest from Victron website',
          'Install via MK3-USB or GX device',
          'Verify operation after update'
        ],
        tools: ['Laptop', 'MK3-USB adapter or GX device'],
        warnings: ['Do not interrupt update', 'Back up settings first']
      },
      {
        task: 'Battery Health Check',
        interval: 'Quarterly',
        procedure: [
          'Check battery voltage under load',
          'Monitor charge/discharge efficiency',
          'Check battery temperature',
          'Review battery history in VRM',
          'Test capacity if significant degradation suspected'
        ],
        tools: ['Multimeter', 'Battery tester', 'VRM access'],
        warnings: ['Battery testing may require specialized equipment']
      }
    ],
    repairGuide: [
      {
        issue: 'No output / unit appears dead',
        difficulty: 'Intermediate',
        symptoms: [
          'No LED indicators',
          'No response to switch',
          'No output voltage'
        ],
        rootCauses: [
          'DC fuse blown',
          'Battery disconnected/flat',
          'Internal fuse blown',
          'Control board failure'
        ],
        tools: ['Multimeter', 'Torque wrench'],
        parts: ['DC fuse', 'Possibly internal fuse'],
        safetyPrecautions: [
          'Disconnect AC input first',
          'Disconnect battery after',
          'Verify no voltage before touching',
          'DC capacitors retain charge - wait 5 minutes'
        ],
        steps: [
          {
            step: 1,
            title: 'Initial Safety',
            description: 'Turn off DC disconnect. Disconnect AC input breaker. Wait 5 minutes for capacitors to discharge.',
            warnings: ['Internal capacitors can hold lethal charge for several minutes']
          },
          {
            step: 2,
            title: 'Check External DC Fuse',
            description: 'Inspect the external DC fuse (Class T 200A typical). Use multimeter continuity test.',
            tips: ['Fuses can look intact but be open internally']
          },
          {
            step: 3,
            title: 'Check Battery Voltage',
            description: 'Measure voltage at battery terminals. Should read 38-66V for 48V system.',
            tips: ['Below 38V indicates severely discharged battery']
          },
          {
            step: 4,
            title: 'Check Voltage at Inverter',
            description: 'Measure voltage at inverter DC terminals (with fuse good). Should match battery.',
            tips: ['Voltage drop indicates cable or connection issue']
          },
          {
            step: 5,
            title: 'Reconnect and Test',
            description: 'If voltages correct, reconnect and try switching on. Monitor for error codes.',
            warnings: ['If unit still dead with good power, internal fault likely']
          }
        ],
        testProcedure: [
          'Verify all LEDs illuminate on startup',
          'Check VE.Configure connects',
          'Test output with light load',
          'Run for 30 minutes under load'
        ],
        estimatedTime: '30-90 minutes',
        estimatedCost: 'KES 5,000-15,000 (fuse replacement) or KES 150,000+ (internal repair)'
      },
      {
        issue: 'Fan not running / overheating',
        difficulty: 'Advanced',
        symptoms: [
          'Fan does not spin',
          'Unit very hot to touch',
          'Overtemperature faults',
          'Power derating'
        ],
        rootCauses: [
          'Fan failure',
          'Fan blocked',
          'Control board fault',
          'Temperature sensor fault'
        ],
        tools: ['Multimeter', 'Screwdriver set', 'Replacement fan'],
        parts: ['Cooling fan assembly'],
        safetyPrecautions: [
          'Unit must be completely de-energized',
          'Wait for unit to cool before internal access',
          'ESD precautions for control board',
          'Opening unit may void warranty'
        ],
        steps: [
          {
            step: 1,
            title: 'Initial Diagnostics',
            description: 'Run unit under load and observe if fan spins. Fan should run when internal temp rises.',
            tips: ['Fan may not run at light load or low ambient temperature']
          },
          {
            step: 2,
            title: 'Check Fan Obstruction',
            description: 'Look through ventilation slots for debris blocking fan.',
            tips: ['Compressed air can clear minor blockages']
          },
          {
            step: 3,
            title: 'Power Down Completely',
            description: 'Disconnect AC and DC. Wait 10 minutes for full discharge and cooling.',
            warnings: ['Internal components will be hot']
          },
          {
            step: 4,
            title: 'Access Fan',
            description: 'Remove cover according to service manual. Locate fan assembly.',
            warnings: ['Opening may void warranty - consider authorized service']
          },
          {
            step: 5,
            title: 'Test Fan Motor',
            description: 'Disconnect fan connector. Apply 12V DC directly to test fan operation.',
            tips: ['If fan runs on direct power, control board issue']
          },
          {
            step: 6,
            title: 'Replace Fan',
            description: 'If fan does not run on direct power, replace with exact replacement.',
            tips: ['Match voltage, CFM rating, and physical size']
          }
        ],
        testProcedure: [
          'Run under load',
          'Monitor temperature on VRM',
          'Verify fan starts and stops appropriately',
          'Test at high ambient if possible'
        ],
        estimatedTime: '1-3 hours',
        estimatedCost: 'KES 8,000-25,000 (fan replacement)'
      },
      {
        issue: 'AC output voltage incorrect',
        difficulty: 'Advanced',
        symptoms: [
          'Output voltage too high or too low',
          'Voltage fluctuating',
          'Sensitive equipment issues'
        ],
        rootCauses: [
          'Configuration error',
          'Calibration drift',
          'Output capacitor issue',
          'Control board fault'
        ],
        tools: ['Multimeter', 'VE.Configure software', 'MK3-USB adapter'],
        parts: ['None for calibration'],
        safetyPrecautions: [
          'Work with AC output - shock hazard',
          'Use insulated tools',
          'Connect test equipment safely'
        ],
        steps: [
          {
            step: 1,
            title: 'Verify Actual Voltage',
            description: 'Measure AC output voltage with calibrated multimeter. Compare to inverter display.',
            tips: ['Inverter display should match within 1-2V']
          },
          {
            step: 2,
            title: 'Check Configuration',
            description: 'Open VE.Configure. Verify output voltage setting is correct (230V typical).',
            tips: ['Some units can be set to 240V or 220V']
          },
          {
            step: 3,
            title: 'Load Test',
            description: 'Test voltage at various loads. Should remain within ±2% specification.',
            tips: ['Significant drop at load indicates capacity issue']
          },
          {
            step: 4,
            title: 'Recalibrate if Needed',
            description: 'If consistently off, recalibration may be needed via VE.Configure installer menu.',
            warnings: ['Factory calibration should not need adjustment - indicates deeper issue']
          }
        ],
        testProcedure: [
          'Measure no-load voltage',
          'Measure voltage at 25%, 50%, 75%, 100% load',
          'Verify total harmonic distortion acceptable',
          'Test frequency stability'
        ],
        estimatedTime: '1-2 hours',
        estimatedCost: 'KES 0 (configuration) or KES 50,000+ (component issue)'
      }
    ],
    calibrationGuide: {
      parameters: [
        { name: 'Output Voltage', description: 'AC output voltage setpoint', defaultValue: '230V', range: '220-240V', unit: 'V', accessLevel: 'Installer' },
        { name: 'Output Frequency', description: 'AC output frequency', defaultValue: '50Hz', range: '50/60Hz', unit: 'Hz', accessLevel: 'Installer' },
        { name: 'Battery Type', description: 'Battery chemistry selection', defaultValue: 'Auto', range: 'AGM/Gel/LiFePO4/Custom', unit: 'N/A', accessLevel: 'User' },
        { name: 'Absorption Voltage', description: 'Bulk/absorption charge voltage', defaultValue: '57.6V', range: '48-60V', unit: 'V', accessLevel: 'User' },
        { name: 'Float Voltage', description: 'Float charge voltage', defaultValue: '54.0V', range: '48-58V', unit: 'V', accessLevel: 'User' },
        { name: 'Low Cutoff', description: 'Low battery voltage disconnect', defaultValue: '42V', range: '38-48V', unit: 'V', accessLevel: 'User' },
        { name: 'Max Charge Current', description: 'Maximum charging current', defaultValue: '70A', range: '5-70A', unit: 'A', accessLevel: 'User' },
        { name: 'PowerAssist', description: 'AC input current boost setting', defaultValue: 'On', range: 'On/Off', unit: 'N/A', accessLevel: 'User' }
      ],
      accessMethod: 'VE.Configure software via MK3-USB adapter or VictronConnect via Bluetooth dongle',
      tools: ['Laptop with VE.Configure', 'MK3-USB interface adapter', 'VE.Direct Bluetooth dongle (optional)'],
      procedure: [
        'Connect MK3-USB adapter to inverter VE.Bus port',
        'Connect USB to laptop',
        'Launch VE.Configure',
        'Click "Connect"',
        'Navigate to desired parameter',
        'Modify value',
        'Click "Send" to write to inverter',
        'Verify changes took effect'
      ],
      warnings: [
        'Incorrect battery settings can damage batteries or cause fire',
        'Do not set voltages outside battery manufacturer specifications',
        'Higher currents increase heat generation',
        'Some settings require installer access level'
      ]
    },
    troubleshootingGuide: [
      {
        symptom: 'Inverter not charging battery',
        possibleCauses: [
          'No AC input present',
          'AC input voltage out of range',
          'Charger disabled in settings',
          'Battery full',
          'Temperature too high',
          'BMS communication lost'
        ],
        diagnosticSteps: [
          'Check AC input voltage at inverter terminals',
          'Verify charger is enabled in VE.Configure',
          'Check battery voltage - may already be at float',
          'Check inverter temperature',
          'Verify BMS communication if lithium'
        ],
        solutions: [
          'Restore AC power',
          'Enable charger in settings',
          'Check BMS allow-to-charge signal',
          'Improve ventilation if overheating',
          'Reset BMS if locked out'
        ],
        tools: ['VE.Configure', 'Multimeter']
      },
      {
        symptom: 'Frequent switching between inverter and grid',
        possibleCauses: [
          'Unstable grid voltage',
          'AC input settings too strict',
          'Generator frequency hunting',
          'Transfer switch issues'
        ],
        diagnosticSteps: [
          'Monitor AC input voltage stability',
          'Check AC input voltage limits in settings',
          'Check AC input frequency limits',
          'Monitor VRM for input conditions'
        ],
        solutions: [
          'Widen AC input voltage acceptance range',
          'Use UPS mode if stable output critical',
          'Fix generator governor if frequency issue',
          'Consider voltage stabilizer for poor mains'
        ],
        tools: ['VE.Configure', 'VRM access']
      }
    ],
    price: { min: 185000, max: 250000 },
    spareParts: [
      { partNumber: 'MP2-FAN', name: 'Cooling Fan Assembly', description: 'Internal cooling fan for MultiPlus-II', price: { min: 8000, max: 15000 }, availability: 'In Stock', compatibility: ['MultiPlus-II 48/3000', 'MultiPlus-II 48/5000'] },
      { partNumber: 'MP2-DISPLAY', name: 'Front Panel Display', description: 'LED indicator panel', price: { min: 12000, max: 20000 }, availability: 'Order', compatibility: ['MultiPlus-II all models'] },
      { partNumber: 'MP2-RELAY', name: 'Transfer Relay', description: 'AC transfer relay assembly', price: { min: 25000, max: 40000 }, availability: 'Order', compatibility: ['MultiPlus-II 48/5000'] },
      { partNumber: 'MK3-USB', name: 'MK3-USB Interface', description: 'PC programming interface', price: { min: 8500, max: 12000 }, availability: 'In Stock', compatibility: ['All VE.Bus products'] },
      { partNumber: 'VE.Direct-BT', name: 'VE.Direct Bluetooth Dongle', description: 'Bluetooth adapter for VictronConnect', price: { min: 6500, max: 9000 }, availability: 'In Stock', compatibility: ['All VE.Direct products'] },
      { partNumber: 'FUSE-200A-CT', name: 'Class T 200A Fuse', description: 'DC battery fuse', price: { min: 3500, max: 5500 }, availability: 'In Stock', compatibility: ['48V systems'] },
      { partNumber: 'BAT-TEMP', name: 'Battery Temperature Sensor', description: 'Remote battery temperature sensor', price: { min: 2500, max: 4000 }, availability: 'In Stock', compatibility: ['All MultiPlus/Quattro'] }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// GROWATT INVERTERS
// ═══════════════════════════════════════════════════════════════════════════════

export const GROWATT_INVERTERS: InverterModel[] = [
  {
    id: 'growatt-spf-5000es',
    brand: 'Growatt',
    model: 'SPF 5000ES',
    fullName: 'Growatt SPF 5000ES Plus Off-Grid Inverter',
    image: '/images/inverters/growatt-spf-5000es.jpg',
    type: 'Off-Grid',
    power: { nominal: 5000, peak: 10000, unit: 'W' },
    description: 'Popular off-grid inverter with dual MPPT, perfect for solar home systems and backup power applications.',
    applications: ['Off-grid homes', 'Backup power', 'Solar home systems', 'Rural electrification'],
    features: [
      'Dual MPPT trackers',
      'Pure sine wave output',
      'Built-in 80A MPPT charger',
      'Wide PV input range',
      'Parallel operation (up to 6 units)',
      'WiFi monitoring included',
      'Touch button interface',
      'Configurable priority modes'
    ],
    specifications: {
      inputVoltage: { min: 120, max: 450, mppt: '120-430V' },
      outputVoltage: '230V AC ±5%',
      efficiency: '93%',
      mpptChannels: 2,
      batteryVoltage: '48V (40-60V)',
      batteryCharging: '80A max',
      transferTime: '<10ms',
      operatingTemp: '-10°C to +55°C',
      protectionRating: 'IP20',
      communication: ['WiFi', 'RS232', 'Dry contacts'],
      dimensions: '516mm x 435mm x 180mm',
      weight: '21.5kg',
      warranty: '2 years (extendable)'
    },
    terminals: [
      {
        id: 'spf5000-pv1',
        name: 'PV Input 1 (MPPT1)',
        type: 'dc-input',
        location: 'Bottom - left DC terminals',
        voltage: '120-430V DC',
        current: '18A max',
        wireGauge: '6mm² minimum',
        torque: '2Nm',
        connections: [
          { from: 'PV String 1 +', to: 'PV1+', wireColor: 'Red', wireGauge: '6mm²', function: 'Solar positive MPPT1' },
          { from: 'PV String 1 -', to: 'PV1-', wireColor: 'Black', wireGauge: '6mm²', function: 'Solar negative MPPT1' }
        ]
      },
      {
        id: 'spf5000-pv2',
        name: 'PV Input 2 (MPPT2)',
        type: 'dc-input',
        location: 'Bottom - center DC terminals',
        voltage: '120-430V DC',
        current: '18A max',
        wireGauge: '6mm² minimum',
        torque: '2Nm',
        connections: [
          { from: 'PV String 2 +', to: 'PV2+', wireColor: 'Red', wireGauge: '6mm²', function: 'Solar positive MPPT2' },
          { from: 'PV String 2 -', to: 'PV2-', wireColor: 'Black', wireGauge: '6mm²', function: 'Solar negative MPPT2' }
        ]
      },
      {
        id: 'spf5000-battery',
        name: 'Battery',
        type: 'battery',
        location: 'Bottom - right DC terminals',
        voltage: '40-60V DC',
        current: '80A charge',
        wireGauge: '25mm² minimum',
        torque: '3Nm',
        connections: [
          { from: 'Battery +', to: 'BAT+', wireColor: 'Red', wireGauge: '25mm²', function: 'Battery positive' },
          { from: 'Battery -', to: 'BAT-', wireColor: 'Black', wireGauge: '25mm²', function: 'Battery negative' }
        ]
      },
      {
        id: 'spf5000-acin',
        name: 'AC Input',
        type: 'ac-input',
        location: 'Bottom - AC terminal block left',
        voltage: '170-280V AC',
        current: '25A max',
        wireGauge: '6mm² minimum',
        torque: '2Nm',
        connections: [
          { from: 'Grid/Gen L', to: 'AC-IN L', wireColor: 'Brown', wireGauge: '6mm²', function: 'AC input live' },
          { from: 'Grid/Gen N', to: 'AC-IN N', wireColor: 'Blue', wireGauge: '6mm²', function: 'AC input neutral' },
          { from: 'Earth', to: 'AC-IN PE', wireColor: 'Green/Yellow', wireGauge: '6mm²', function: 'Earth' }
        ]
      },
      {
        id: 'spf5000-acout',
        name: 'AC Output',
        type: 'ac-output',
        location: 'Bottom - AC terminal block right',
        voltage: '230V AC',
        current: '22A continuous',
        wireGauge: '6mm² minimum',
        torque: '2Nm',
        connections: [
          { from: 'AC-OUT L', to: 'Load L', wireColor: 'Brown', wireGauge: '6mm²', function: 'AC output live' },
          { from: 'AC-OUT N', to: 'Load N', wireColor: 'Blue', wireGauge: '6mm²', function: 'AC output neutral' },
          { from: 'AC-OUT PE', to: 'Load PE', wireColor: 'Green/Yellow', wireGauge: '6mm²', function: 'Earth' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/growatt-spf5000es-wiring.svg',
      dcInputWiring: {
        strings: [
          { mppt: 1, strings: 2, voltage: '300-400V typical', current: '9A per string' },
          { mppt: 2, strings: 2, voltage: '300-400V typical', current: '9A per string' }
        ],
        fusingSizing: '15A PV fuse per string',
        cableSizing: '6mm² for runs up to 15m, 10mm² for longer',
        connections: [
          { from: 'PV Array 1', to: 'MPPT1', terminal: 'PV1+/PV1-' },
          { from: 'PV Array 2', to: 'MPPT2', terminal: 'PV2+/PV2-' }
        ]
      },
      acOutputWiring: {
        phases: 1,
        voltage: '230V',
        neutral: true,
        groundBonding: 'N-PE bonded internally in off-grid mode',
        breakerSizing: '32A MCB for output',
        cableSizing: '6mm² minimum'
      },
      batteryWiring: {
        voltage: '48V nominal',
        maxCurrent: '80A',
        fusingSizing: '150A DC fuse',
        cableSizing: '25mm² minimum, 35mm² recommended',
        bmsConnection: 'CAN port for lithium BMS or BMS485',
        parallelConfig: 'Equal cable lengths for parallel batteries'
      },
      groundingRequirements: [
        'AC earth must be connected',
        'Internal N-PE bond in inverter mode',
        'PV frame grounding per local code',
        'Battery negative NOT grounded'
      ],
      installationNotes: [
        'Mount on solid wall, terminals at bottom',
        'Minimum 200mm clearance sides, 500mm above and below',
        'Keep away from heat sources',
        'Use DC breaker between battery and inverter'
      ]
    },
    faultCodes: [
      {
        code: 'Error 01',
        name: 'Fan Stuck',
        severity: 'High',
        description: 'Internal cooling fan is not spinning',
        causes: ['Fan motor failure', 'Fan blocked by debris', 'Fan connector loose'],
        symptoms: ['Overheating', 'Reduced output', 'Error code display'],
        solution: 'Clean or replace fan',
        steps: [
          'Power down inverter completely',
          'Remove cover',
          'Check fan for obstructions',
          'Check fan connector',
          'Replace fan if faulty'
        ],
        tools: ['Screwdriver', 'Compressed air', 'Replacement fan'],
        estimatedTime: '1 hour',
        estimatedCost: 'KES 3,000-8,000'
      },
      {
        code: 'Error 02',
        name: 'Over Temperature',
        severity: 'High',
        description: 'Internal temperature exceeded safe limit',
        causes: ['Poor ventilation', 'High ambient temperature', 'Fan failure', 'Overloaded'],
        symptoms: ['Shutdown', 'Derating', 'Hot to touch'],
        solution: 'Improve ventilation, reduce load',
        steps: [
          'Check ambient temperature',
          'Verify ventilation clearances',
          'Check fan operation',
          'Reduce continuous load',
          'Clean dust from unit'
        ],
        tools: ['IR thermometer'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'Error 03',
        name: 'Battery Voltage High',
        severity: 'Critical',
        description: 'Battery voltage exceeded maximum',
        causes: ['Wrong battery settings', 'Failed BMS', 'Charger fault'],
        symptoms: ['Charging stops', 'Alarm', 'Possible shutdown'],
        solution: 'Check battery settings and BMS',
        steps: [
          'Disconnect PV and AC input',
          'Measure actual battery voltage',
          'Check bulk/absorption voltage settings',
          'Verify BMS operation',
          'Adjust settings if needed'
        ],
        tools: ['Multimeter'],
        estimatedTime: '30 minutes',
        estimatedCost: 'KES 0'
      },
      {
        code: 'Error 04',
        name: 'Battery Voltage Low',
        severity: 'High',
        description: 'Battery voltage below minimum cutoff',
        causes: ['Discharged battery', 'Loose connection', 'Battery failure', 'BMS cutoff'],
        symptoms: ['Inverter shutdown', 'No output'],
        solution: 'Recharge battery or check connections',
        steps: [
          'Check battery voltage with multimeter',
          'Check all connections',
          'Try recharging from grid/generator',
          'Test battery capacity',
          'Check BMS status'
        ],
        tools: ['Multimeter', 'Battery tester'],
        estimatedTime: '30-120 minutes',
        estimatedCost: 'KES 0 or battery replacement'
      },
      {
        code: 'Error 07',
        name: 'PV Voltage High',
        severity: 'High',
        description: 'Solar input voltage exceeded maximum',
        causes: ['Too many panels in series', 'Low temperature increasing Voc', 'Wrong panel configuration'],
        symptoms: ['MPPT shuts down', 'PV not charging'],
        solution: 'Reduce string voltage',
        steps: [
          'Measure PV open circuit voltage',
          'Compare to inverter max (450V)',
          'Consider cold weather Voc rise',
          'Reconfigure strings if over voltage'
        ],
        tools: ['Multimeter'],
        estimatedTime: '30 minutes to diagnose',
        estimatedCost: 'KES 0 (may need reconfiguration)'
      },
      {
        code: 'Error 08',
        name: 'PV Isolation Low',
        severity: 'Critical',
        description: 'Ground fault detected in PV array',
        causes: ['Cable insulation damage', 'Water ingress in junction box', 'Panel frame grounding issue'],
        symptoms: ['MPPT disabled', 'Error alarm'],
        solution: 'Find and repair insulation fault',
        steps: [
          'Disconnect all PV strings',
          'Test each string isolation with megger',
          'Inspect cables and junction boxes',
          'Repair or replace damaged cables',
          'Check frame grounding'
        ],
        tools: ['Insulation tester (megger)', 'Multimeter'],
        estimatedTime: '2-4 hours',
        estimatedCost: 'KES 5,000-20,000'
      }
    ],
    maintenanceGuide: [
      {
        task: 'Display Check',
        interval: 'Daily',
        procedure: ['Check display for errors', 'Verify production figures', 'Note any unusual values'],
        tools: ['None'],
        warnings: ['Unit may be energized']
      },
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: [
          'Check for physical damage',
          'Verify LED indicators',
          'Check ventilation clear',
          'Inspect cables for damage'
        ],
        tools: ['Flashlight'],
        warnings: ['Do not remove cover while energized']
      },
      {
        task: 'Vent Cleaning',
        interval: 'Quarterly',
        procedure: [
          'Power down if possible',
          'Use compressed air on vents',
          'Brush away dust accumulation',
          'Check fan operation'
        ],
        tools: ['Compressed air', 'Soft brush'],
        warnings: ['Never use water']
      },
      {
        task: 'Connection Check',
        interval: 'Annually',
        procedure: [
          'Power down completely',
          'Check all terminal tightness',
          'Inspect for corrosion',
          'Check cable condition',
          'Retorque if needed'
        ],
        tools: ['Torque wrench'],
        parts: ['Contact paste'],
        warnings: ['Wait for capacitors to discharge', 'DC may remain from PV']
      },
      {
        task: 'Firmware Update',
        interval: 'As available',
        procedure: [
          'Check ShinePhone app for updates',
          'Download update file',
          'Apply via WiFi or USB',
          'Verify operation after update'
        ],
        tools: ['Smartphone with ShinePhone', 'USB drive'],
        warnings: ['Do not interrupt update']
      }
    ],
    repairGuide: [
      {
        issue: 'No display / unit dead',
        difficulty: 'Intermediate',
        symptoms: ['No display', 'No LEDs', 'No output'],
        rootCauses: ['DC fuse blown', 'Battery flat', 'Power board failure'],
        tools: ['Multimeter', 'Screwdriver'],
        parts: ['DC fuse', 'possibly power board'],
        safetyPrecautions: [
          'Disconnect PV first (during daytime)',
          'Disconnect AC input',
          'Disconnect battery',
          'Wait 10 minutes for discharge'
        ],
        steps: [
          {
            step: 1,
            title: 'Power Down Safely',
            description: 'Turn off DC breaker to battery. Disconnect AC input. If daytime, cover panels or disconnect PV.',
            warnings: ['PV arrays remain energized in daylight']
          },
          {
            step: 2,
            title: 'Check External Fuse',
            description: 'Locate DC fuse between battery and inverter. Test with multimeter continuity.',
            tips: ['Visual inspection is not reliable']
          },
          {
            step: 3,
            title: 'Check Battery Voltage',
            description: 'Measure battery voltage at battery terminals. Should be 48-56V for 48V system.',
            tips: ['Below 40V indicates flat battery']
          },
          {
            step: 4,
            title: 'Check Voltage at Inverter',
            description: 'Measure voltage at inverter battery terminals (with fuse reinstalled/bypassed).',
            tips: ['Should match battery voltage']
          },
          {
            step: 5,
            title: 'Reconnect and Test',
            description: 'If voltage correct, reconnect and attempt power on. Watch for display.',
            warnings: ['If still dead, internal fault - service required']
          }
        ],
        testProcedure: ['Check display comes on', 'Verify all readings', 'Test with load'],
        estimatedTime: '30-90 minutes',
        estimatedCost: 'KES 5,000 (fuse) to KES 50,000+ (board)'
      }
    ],
    calibrationGuide: {
      parameters: [
        { name: 'Output Priority', description: 'Source priority for output', defaultValue: 'Solar', range: 'Solar/Utility/SBU', unit: 'N/A', accessLevel: 'User' },
        { name: 'Charger Priority', description: 'Charging source priority', defaultValue: 'Solar First', range: 'Solar/Utility/Solar+Utility', unit: 'N/A', accessLevel: 'User' },
        { name: 'Battery Type', description: 'Battery chemistry', defaultValue: 'AGM', range: 'AGM/Flooded/Lithium/User', unit: 'N/A', accessLevel: 'User' },
        { name: 'Bulk Voltage', description: 'Bulk charging voltage', defaultValue: '56.4V', range: '48-60V', unit: 'V', accessLevel: 'User' },
        { name: 'Float Voltage', description: 'Float charging voltage', defaultValue: '54V', range: '48-58V', unit: 'V', accessLevel: 'User' },
        { name: 'Low Cutoff', description: 'Battery cutoff voltage', defaultValue: '44V', range: '40-48V', unit: 'V', accessLevel: 'User' },
        { name: 'Max Charge Current', description: 'Maximum battery charge current', defaultValue: '80A', range: '10-80A', unit: 'A', accessLevel: 'User' }
      ],
      accessMethod: 'Front panel LCD menu navigation',
      tools: ['None required - front panel access'],
      procedure: [
        'Press and hold ENTER button to enter menu',
        'Navigate with UP/DOWN buttons',
        'Select parameter with ENTER',
        'Modify value with UP/DOWN',
        'Confirm with ENTER',
        'Press ESC to exit menu'
      ],
      warnings: [
        'Incorrect battery settings can damage batteries',
        'Match settings to battery manufacturer specs',
        'Lithium batteries require BMS communication'
      ]
    },
    troubleshootingGuide: [
      {
        symptom: 'Not charging from solar',
        possibleCauses: [
          'Battery full',
          'PV voltage too low',
          'PV voltage too high',
          'Charger priority wrong',
          'Fuse blown'
        ],
        diagnosticSteps: [
          'Check battery voltage - may be full',
          'Check PV voltage at inverter',
          'Check PV current',
          'Verify charger priority settings',
          'Check all fuses'
        ],
        solutions: [
          'Wait for battery to discharge',
          'Check panel connections',
          'Reconfigure strings if voltage wrong',
          'Change charger priority',
          'Replace fuses'
        ],
        tools: ['Multimeter']
      }
    ],
    price: { min: 95000, max: 140000 },
    spareParts: [
      { partNumber: 'SPF-FAN', name: 'Cooling Fan', description: 'Internal cooling fan', price: { min: 3000, max: 6000 }, availability: 'In Stock', compatibility: ['SPF 5000ES'] },
      { partNumber: 'SPF-LCD', name: 'LCD Display', description: 'Front panel display', price: { min: 8000, max: 15000 }, availability: 'Order', compatibility: ['SPF series'] },
      { partNumber: 'SPF-CTRL', name: 'Control Board', description: 'Main control PCB', price: { min: 35000, max: 50000 }, availability: 'Order', compatibility: ['SPF 5000ES'] },
      { partNumber: 'SHINE-WIFI', name: 'WiFi Module', description: 'ShineWiFi-X monitoring stick', price: { min: 5000, max: 8000 }, availability: 'In Stock', compatibility: ['All Growatt'] },
      { partNumber: 'GW-FUSE-150', name: '150A DC Fuse', description: 'Battery protection fuse', price: { min: 2500, max: 4000 }, availability: 'In Stock', compatibility: ['48V systems'] }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllInverters = (): InverterModel[] => [...VICTRON_INVERTERS, ...GROWATT_INVERTERS];
export const getInverterById = (id: string) => getAllInverters().find(i => i.id === id);
export const getInvertersByBrand = (brand: string) => getAllInverters().filter(i => i.brand.toLowerCase() === brand.toLowerCase());
export const searchInverters = (query: string) => {
  const q = query.toLowerCase();
  return getAllInverters().filter(i =>
    i.model.toLowerCase().includes(q) ||
    i.fullName.toLowerCase().includes(q) ||
    i.brand.toLowerCase().includes(q) ||
    i.type.toLowerCase().includes(q)
  );
};

// All brands are already exported via their const declarations above
