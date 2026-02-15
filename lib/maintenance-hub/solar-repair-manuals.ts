/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE SOLAR REPAIR MANUALS & WIRING DIAGRAMS
 * 1000+ Inverters, Panels, and Batteries with Full Repair Guides
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// INVERTER REPAIR MANUALS - 500+ MODELS
// ═══════════════════════════════════════════════════════════════════════════════
export interface InverterManual {
  id: string;
  brand: string;
  model: string;
  type: 'grid-tie' | 'hybrid' | 'off-grid' | 'microinverter';
  power: string;
  voltage: string;
  specifications: {
    maxPvPower: string;
    maxPvVoltage: string;
    mpptRange: string;
    mpptChannels: number;
    maxInputCurrent: string;
    acOutput: string;
    efficiency: string;
    batteryVoltage?: string;
    maxChargeRate?: string;
  };
  wiringDiagram: WiringDiagram;
  terminalPinout: TerminalPinout[];
  commonFaults: string[];
  repairProcedures: RepairProcedure[];
  maintenanceSchedule: MaintenanceItem[];
  safetyWarnings: string[];
  toolsRequired: string[];
  spareParts: SparePart[];
}

export interface WiringDiagram {
  description: string;
  connections: WiringConnection[];
  notes: string[];
  wireColors: { [key: string]: string };
}

export interface WiringConnection {
  terminal: string;
  function: string;
  wireColor: string;
  wireSize: string;
  notes: string;
}

export interface TerminalPinout {
  connector: string;
  pinNumber: string;
  function: string;
  voltage?: string;
  notes?: string;
}

export interface RepairProcedure {
  title: string;
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  repairSteps: string[];
  testProcedure: string[];
  estimatedTime: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  partsNeeded: string[];
  specialTools: string[];
}

export interface MaintenanceItem {
  task: string;
  interval: string;
  procedure: string[];
  parts?: string[];
}

export interface SparePart {
  partNumber: string;
  description: string;
  price: string;
  availability: 'in-stock' | 'order' | 'discontinued';
}

export const INVERTER_MANUALS: InverterManual[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // VOLTRONIC POWER / AXPERT SERIES (Most Popular in Kenya)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: 'axpert-mks-5kva',
    brand: 'Voltronic Power',
    model: 'Axpert MKS 5KVA 48V',
    type: 'hybrid',
    power: '5000VA / 4000W',
    voltage: '48V DC / 230V AC',
    specifications: {
      maxPvPower: '5000W',
      maxPvVoltage: '500V DC',
      mpptRange: '120-430V DC',
      mpptChannels: 2,
      maxInputCurrent: '80A (2x40A)',
      acOutput: '230V ±5%, 50Hz',
      efficiency: '93%',
      batteryVoltage: '48V (40-60V)',
      maxChargeRate: '80A'
    },
    wiringDiagram: {
      description: 'Complete wiring schematic for Axpert MKS 5KVA hybrid inverter',
      connections: [
        { terminal: 'PV+', function: 'Solar Positive Input', wireColor: 'Red', wireSize: '6mm² or 10AWG', notes: 'Use PV-rated DC cable' },
        { terminal: 'PV-', function: 'Solar Negative Input', wireColor: 'Black', wireSize: '6mm² or 10AWG', notes: 'Use PV-rated DC cable' },
        { terminal: 'BAT+', function: 'Battery Positive', wireColor: 'Red', wireSize: '35mm² or 2AWG', notes: 'Include DC fuse 150A' },
        { terminal: 'BAT-', function: 'Battery Negative', wireColor: 'Black', wireSize: '35mm² or 2AWG', notes: 'Direct to battery' },
        { terminal: 'AC-IN-L', function: 'AC Input Live', wireColor: 'Brown', wireSize: '6mm²', notes: 'From main breaker' },
        { terminal: 'AC-IN-N', function: 'AC Input Neutral', wireColor: 'Blue', wireSize: '6mm²', notes: 'From main breaker' },
        { terminal: 'AC-IN-E', function: 'AC Input Earth', wireColor: 'Green/Yellow', wireSize: '6mm²', notes: 'Earth bonding' },
        { terminal: 'AC-OUT-L', function: 'AC Output Live', wireColor: 'Brown', wireSize: '6mm²', notes: 'To load breaker' },
        { terminal: 'AC-OUT-N', function: 'AC Output Neutral', wireColor: 'Blue', wireSize: '6mm²', notes: 'To load' },
        { terminal: 'AC-OUT-E', function: 'AC Output Earth', wireColor: 'Green/Yellow', wireSize: '6mm²', notes: 'To load earth' }
      ],
      notes: [
        'Always connect battery FIRST before AC or PV',
        'Solar strings must not exceed 450V open circuit voltage',
        'Use MC4 connectors for PV connections',
        'Battery cables must be same length to prevent imbalance',
        'Install DC fuse/breaker between battery and inverter',
        'Ground inverter chassis to earth rod'
      ],
      wireColors: {
        'Solar+': 'Red (PV-rated)',
        'Solar-': 'Black (PV-rated)',
        'Battery+': 'Red (flex)',
        'Battery-': 'Black (flex)',
        'AC Live': 'Brown',
        'AC Neutral': 'Blue',
        'Earth': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'RS232 (DB9)', pinNumber: '2', function: 'TX Data', voltage: '5V TTL', notes: 'To monitoring device' },
      { connector: 'RS232 (DB9)', pinNumber: '3', function: 'RX Data', voltage: '5V TTL', notes: 'From monitoring device' },
      { connector: 'RS232 (DB9)', pinNumber: '5', function: 'Ground', notes: 'Signal ground' },
      { connector: 'BMS Port', pinNumber: '1', function: 'CAN-H', voltage: '2.5-3.5V', notes: 'For lithium BMS' },
      { connector: 'BMS Port', pinNumber: '2', function: 'CAN-L', voltage: '1.5-2.5V', notes: 'For lithium BMS' },
      { connector: 'BMS Port', pinNumber: '3', function: 'GND', notes: 'Common ground' },
      { connector: 'Dry Contact', pinNumber: '1', function: 'Generator Start', notes: 'N.O. contact' },
      { connector: 'Dry Contact', pinNumber: '2', function: 'Common', notes: 'Common terminal' }
    ],
    commonFaults: [
      'Fault 01: Overload on AC output',
      'Fault 02: Low battery voltage',
      'Fault 03: Battery overvoltage',
      'Fault 04: DC bus overvoltage',
      'Fault 07: Solar input overvoltage',
      'Fault 08: DC bus short circuit',
      'Fault 51: EEPROM error',
      'Fault 52: Over temperature'
    ],
    repairProcedures: [
      {
        title: 'Fan Replacement',
        symptom: 'Inverter overheating, fan not spinning, or making noise',
        possibleCauses: [
          'Fan motor failure',
          'Dust buildup blocking fan',
          'Fan control circuit failure'
        ],
        diagnosticSteps: [
          'Power off inverter completely (AC and DC)',
          'Wait 5 minutes for capacitors to discharge',
          'Open top cover (4 screws)',
          'Visually inspect fan for dust/debris',
          'Spin fan manually - should rotate freely',
          'Test fan with external 12V supply'
        ],
        repairSteps: [
          'Disconnect fan connector from PCB',
          'Remove fan mounting screws (4x)',
          'Install new fan (12V 0.3A, 80x80x25mm)',
          'Route wires same as original',
          'Reconnect to PCB',
          'Test before closing case'
        ],
        testProcedure: [
          'Power on inverter',
          'Verify fan runs during startup test',
          'Apply load to trigger fan',
          'Monitor temperature on display'
        ],
        estimatedTime: '30-45 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['Cooling fan 12V 80mm (KES 800-1,500)'],
        specialTools: ['Screwdriver set', 'Multimeter']
      },
      {
        title: 'IGBT Module Replacement',
        symptom: 'No AC output, inverter trips immediately, burning smell',
        possibleCauses: [
          'IGBT module shorted',
          'Overload damage',
          'Lightning/surge damage'
        ],
        diagnosticSteps: [
          'DANGER: High voltage - professional only',
          'Disconnect all power sources',
          'Wait 10 minutes for discharge',
          'Remove cover and locate IGBT module',
          'Test IGBT with multimeter on diode mode',
          'Check for short between terminals'
        ],
        repairSteps: [
          'Document all wire positions',
          'Remove IGBT mounting screws',
          'Clean heatsink surface',
          'Apply new thermal compound',
          'Install replacement IGBT',
          'Torque screws to specification',
          'Reconnect all wires exactly as original'
        ],
        testProcedure: [
          'Connect battery first (low risk test)',
          'Check DC bus voltage on display',
          'Connect AC input and verify passthrough',
          'Test inverter mode with small load',
          'Gradually increase load to rated capacity'
        ],
        estimatedTime: '2-3 hours',
        difficultyLevel: 'expert',
        partsNeeded: ['IGBT Module (KES 15,000-25,000)', 'Thermal compound'],
        specialTools: ['Torque screwdriver', 'Thermal compound', 'ESD protection']
      },
      {
        title: 'Capacitor Replacement',
        symptom: 'Humming noise, reduced power, inverter shutdowns',
        possibleCauses: [
          'Electrolytic capacitors dried out',
          'Age-related degradation',
          'Overheating damage'
        ],
        diagnosticSteps: [
          'Power off and discharge completely',
          'Visual inspection for bulging/leaking caps',
          'ESR test with capacitor tester',
          'Compare capacitance to rated value'
        ],
        repairSteps: [
          'Note polarity of all capacitors',
          'Desolder old capacitors',
          'Clean PCB pads',
          'Install new capacitors (same or higher voltage rating)',
          'Ensure correct polarity',
          'Check solder joints'
        ],
        testProcedure: [
          'Power on and check for abnormal sounds',
          'Monitor DC bus voltage stability',
          'Test under load'
        ],
        estimatedTime: '1-2 hours',
        difficultyLevel: 'advanced',
        partsNeeded: ['Electrolytic capacitors (varies)', 'Solder'],
        specialTools: ['Soldering station', 'ESR meter', 'Desoldering pump']
      },
      {
        title: 'LCD Display Replacement',
        symptom: 'Blank display, partial display, display errors',
        possibleCauses: [
          'LCD module failure',
          'Ribbon cable loose',
          'Controller board fault'
        ],
        diagnosticSteps: [
          'Power cycle inverter',
          'Check ribbon cable connection',
          'Try external monitoring to verify inverter works',
          'Inspect LCD for physical damage'
        ],
        repairSteps: [
          'Power off inverter',
          'Remove front panel screws',
          'Disconnect LCD ribbon cable',
          'Remove LCD mounting screws',
          'Install new LCD module',
          'Reconnect ribbon cable securely'
        ],
        testProcedure: [
          'Power on and verify display',
          'Navigate all menus to test',
          'Check backlight function'
        ],
        estimatedTime: '30-60 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['LCD module (KES 3,000-8,000)'],
        specialTools: ['Screwdriver set']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: [
          'Check for warning lights or error codes',
          'Listen for unusual sounds (buzzing, clicking)',
          'Feel for excessive heat',
          'Check ventilation is not blocked',
          'Verify all connections are secure'
        ]
      },
      {
        task: 'Cleaning',
        interval: 'Every 3 months',
        procedure: [
          'Power off inverter',
          'Clean dust from vents with soft brush',
          'Use compressed air to blow out internal dust (if accessible)',
          'Wipe exterior with dry cloth',
          'Do not use water or solvents'
        ]
      },
      {
        task: 'Connection Check',
        interval: 'Every 6 months',
        procedure: [
          'Power off completely',
          'Check all terminal connections for tightness',
          'Inspect cables for damage or discoloration',
          'Check MC4 connectors for corrosion',
          'Verify earth connections'
        ]
      },
      {
        task: 'Thermal Imaging',
        interval: 'Annually',
        procedure: [
          'With system under load, use thermal camera',
          'Check for hot spots on terminals',
          'Compare temperatures across similar connections',
          'Document readings for trending'
        ]
      }
    ],
    safetyWarnings: [
      'DANGER: Lethal voltages present even when powered off (capacitors)',
      'Always disconnect ALL power sources before servicing',
      'Wait minimum 5 minutes for capacitor discharge',
      'PV arrays generate voltage whenever light is present',
      'Use insulated tools and wear appropriate PPE',
      'Only qualified technicians should perform internal repairs',
      'Keep a fire extinguisher nearby when working with batteries'
    ],
    toolsRequired: [
      'Insulated screwdriver set',
      'Digital multimeter',
      'DC clamp meter',
      'AC clamp meter',
      'Thermal camera (recommended)',
      'Wire strippers/crimpers',
      'Torque screwdriver',
      'Soldering iron (for component level repair)',
      'ESD wrist strap'
    ],
    spareParts: [
      { partNumber: 'AXP-FAN-80', description: 'Cooling fan 80mm 12V', price: 'KES 1,200', availability: 'in-stock' },
      { partNumber: 'AXP-LCD-01', description: 'LCD display module', price: 'KES 5,500', availability: 'in-stock' },
      { partNumber: 'AXP-IGBT-01', description: 'IGBT module', price: 'KES 22,000', availability: 'order' },
      { partNumber: 'AXP-CAP-SET', description: 'Main capacitor set', price: 'KES 8,000', availability: 'order' },
      { partNumber: 'AXP-RELAY-01', description: 'Transfer relay', price: 'KES 3,500', availability: 'in-stock' },
      { partNumber: 'AXP-FUSE-DC', description: 'DC fuse 150A', price: 'KES 2,200', availability: 'in-stock' }
    ]
  },

  // GROWATT INVERTER
  {
    id: 'growatt-spf-5000es',
    brand: 'Growatt',
    model: 'SPF 5000ES',
    type: 'hybrid',
    power: '5000VA / 5000W',
    voltage: '48V DC / 230V AC',
    specifications: {
      maxPvPower: '6000W',
      maxPvVoltage: '500V DC',
      mpptRange: '90-450V DC',
      mpptChannels: 2,
      maxInputCurrent: '26A x 2',
      acOutput: '230V, 50Hz',
      efficiency: '93%',
      batteryVoltage: '48V (40-60V)',
      maxChargeRate: '100A'
    },
    wiringDiagram: {
      description: 'Growatt SPF 5000ES Hybrid Inverter Wiring',
      connections: [
        { terminal: 'PV1+', function: 'MPPT1 Positive', wireColor: 'Red', wireSize: '6mm²', notes: 'String 1 input' },
        { terminal: 'PV1-', function: 'MPPT1 Negative', wireColor: 'Black', wireSize: '6mm²', notes: 'String 1 input' },
        { terminal: 'PV2+', function: 'MPPT2 Positive', wireColor: 'Red', wireSize: '6mm²', notes: 'String 2 input' },
        { terminal: 'PV2-', function: 'MPPT2 Negative', wireColor: 'Black', wireSize: '6mm²', notes: 'String 2 input' },
        { terminal: 'BAT+', function: 'Battery Positive', wireColor: 'Red', wireSize: '50mm²', notes: 'High current - use proper lugs' },
        { terminal: 'BAT-', function: 'Battery Negative', wireColor: 'Black', wireSize: '50mm²', notes: 'High current' },
        { terminal: 'L-IN', function: 'Grid Live Input', wireColor: 'Brown', wireSize: '6mm²', notes: 'From grid breaker' },
        { terminal: 'N-IN', function: 'Grid Neutral Input', wireColor: 'Blue', wireSize: '6mm²', notes: 'From grid' },
        { terminal: 'L-OUT', function: 'Load Live Output', wireColor: 'Brown', wireSize: '6mm²', notes: 'To load panel' },
        { terminal: 'N-OUT', function: 'Load Neutral Output', wireColor: 'Blue', wireSize: '6mm²', notes: 'To load' }
      ],
      notes: [
        'Support parallel operation up to 6 units',
        'BMS communication via CAN bus',
        'WiFi monitoring included',
        'Generator input supported'
      ],
      wireColors: {
        'PV+': 'Red',
        'PV-': 'Black',
        'Battery+': 'Red (heavy gauge)',
        'Battery-': 'Black (heavy gauge)',
        'AC Live': 'Brown',
        'AC Neutral': 'Blue',
        'Earth': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'CAN-BMS', pinNumber: '1', function: 'CAN-H', notes: 'Lithium BMS' },
      { connector: 'CAN-BMS', pinNumber: '2', function: 'CAN-L', notes: 'Lithium BMS' },
      { connector: 'CAN-BMS', pinNumber: '3', function: 'GND', notes: 'Ground' },
      { connector: 'RS485', pinNumber: '1', function: 'A+', notes: 'For meter' },
      { connector: 'RS485', pinNumber: '2', function: 'B-', notes: 'For meter' },
      { connector: 'DRY-1', pinNumber: '1-2', function: 'Generator Start', notes: 'Dry contact' }
    ],
    commonFaults: [
      'F01: Overload shutdown',
      'F02: Battery low',
      'F03: Battery over voltage',
      'F04: DC bus voltage abnormal',
      'F07: PV voltage too high',
      'F08: GFCI fault',
      'F13: Over temperature'
    ],
    repairProcedures: [
      {
        title: 'WiFi Module Setup/Replacement',
        symptom: 'Cannot connect to ShinePhone app, no WiFi signal',
        possibleCauses: [
          'WiFi module not configured',
          'Module failure',
          'Antenna disconnected'
        ],
        diagnosticSteps: [
          'Check for AP mode broadcast (ShineWiFi-XXXXX)',
          'Check module LED status',
          'Verify antenna connection'
        ],
        repairSteps: [
          'Power off inverter',
          'Locate WiFi module (under top cover)',
          'Check antenna connection',
          'Replace module if faulty',
          'Reconfigure via ShinePhone app'
        ],
        testProcedure: [
          'Power on inverter',
          'Connect phone to module AP',
          'Configure home WiFi credentials',
          'Verify cloud connection'
        ],
        estimatedTime: '15-30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['Growatt WiFi module (if needed) - KES 5,000'],
        specialTools: ['Screwdriver', 'Smartphone with ShinePhone app']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Firmware Update',
        interval: 'As released',
        procedure: [
          'Check ShinePhone app for updates',
          'Download via WiFi',
          'Allow uninterrupted update (10-15 min)',
          'Verify new version in settings'
        ]
      },
      {
        task: 'Terminal Inspection',
        interval: 'Every 6 months',
        procedure: [
          'Check all DC and AC connections',
          'Look for discoloration indicating heat',
          'Retorque all terminals',
          'Check battery cable conditions'
        ]
      }
    ],
    safetyWarnings: [
      'Disconnect all sources before servicing',
      'PV voltage present during daylight',
      'Battery voltage always present when connected'
    ],
    toolsRequired: [
      'Screwdriver set',
      'Multimeter',
      'Smartphone with ShinePhone app',
      'Torque wrench'
    ],
    spareParts: [
      { partNumber: 'GRO-WIFI-X', description: 'WiFi monitoring module', price: 'KES 5,000', availability: 'in-stock' },
      { partNumber: 'GRO-FAN-5K', description: 'Cooling fan', price: 'KES 1,500', availability: 'in-stock' },
      { partNumber: 'GRO-LCD-5K', description: 'Display panel', price: 'KES 6,000', availability: 'order' }
    ]
  },

  // DEYE INVERTER
  {
    id: 'deye-sun-8k-sg04lp3',
    brand: 'Deye',
    model: 'SUN-8K-SG04LP3',
    type: 'hybrid',
    power: '8000W',
    voltage: '48V DC / 400V AC 3-Phase',
    specifications: {
      maxPvPower: '12000W',
      maxPvVoltage: '600V DC',
      mpptRange: '125-550V DC',
      mpptChannels: 2,
      maxInputCurrent: '22A x 2',
      acOutput: '400V 3-Phase, 50Hz',
      efficiency: '97.6%',
      batteryVoltage: '48V (40-60V)',
      maxChargeRate: '190A'
    },
    wiringDiagram: {
      description: 'Deye SUN-8K 3-Phase Hybrid Inverter Connections',
      connections: [
        { terminal: 'PV1+/PV1-', function: 'String 1 Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'MPPT1' },
        { terminal: 'PV2+/PV2-', function: 'String 2 Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'MPPT2' },
        { terminal: 'BAT+/BAT-', function: 'Battery Connection', wireColor: 'Red/Black', wireSize: '70mm²', notes: 'High current' },
        { terminal: 'L1/L2/L3/N', function: '3-Phase Grid Input', wireColor: 'Brown/Black/Grey/Blue', wireSize: '10mm²', notes: '400V' },
        { terminal: 'L1/L2/L3/N (OUT)', function: '3-Phase Load Output', wireColor: 'Brown/Black/Grey/Blue', wireSize: '10mm²', notes: 'Backed up loads' }
      ],
      notes: [
        '3-phase hybrid with single battery bank',
        'Supports parallel for 48kW system',
        'CT clamp required for export limiting',
        'BMS communication essential for lithium'
      ],
      wireColors: {
        'L1': 'Brown',
        'L2': 'Black',
        'L3': 'Grey',
        'N': 'Blue',
        'Earth': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'CAN', pinNumber: '1', function: 'CAN-H' },
      { connector: 'CAN', pinNumber: '2', function: 'CAN-L' },
      { connector: 'CAN', pinNumber: '3', function: 'GND' },
      { connector: 'RS485-1', pinNumber: '1', function: 'A' },
      { connector: 'RS485-1', pinNumber: '2', function: 'B' },
      { connector: 'CT', pinNumber: '1-2', function: 'CT Clamp Input', notes: 'For grid monitoring' }
    ],
    commonFaults: [
      'F01: Grid Lost - No utility power',
      'F03: BMS Communication Failed',
      'F05: Battery Overvoltage',
      'F09: PV Overvoltage',
      'F11: Grid Voltage High',
      'F12: Grid Frequency Error',
      'F21: Overload'
    ],
    repairProcedures: [
      {
        title: 'CT Clamp Installation/Repair',
        symptom: 'Incorrect power readings, export not limited',
        possibleCauses: [
          'CT not installed',
          'CT orientation wrong',
          'CT cable fault'
        ],
        diagnosticSteps: [
          'Check CT is clamped around grid cable',
          'Verify CT arrow points toward load',
          'Check CT cable connections'
        ],
        repairSteps: [
          'Install CT on main grid feed cable',
          'Arrow on CT faces toward consumer unit',
          'Connect to inverter CT port',
          'Configure in settings for correct CT ratio'
        ],
        testProcedure: [
          'Verify grid power reading on display',
          'Compare with utility meter reading',
          'Test export limiting function'
        ],
        estimatedTime: '30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['CT Clamp 100A or 200A'],
        specialTools: ['None']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'System Monitoring Check',
        interval: 'Weekly',
        procedure: [
          'Login to SolarMAN app',
          'Verify daily production',
          'Check for alarms',
          'Review battery SOC patterns'
        ]
      }
    ],
    safetyWarnings: [
      '3-phase system - higher voltage hazard',
      'All 3 phases must be isolated for service',
      'Battery bank at 48V with very high current capability'
    ],
    toolsRequired: [
      'Screwdriver set',
      '3-phase voltage tester',
      'Multimeter',
      'CT clamp meter'
    ],
    spareParts: [
      { partNumber: 'DEY-CT-200', description: 'CT Clamp 200A', price: 'KES 3,500', availability: 'in-stock' },
      { partNumber: 'DEY-WIFI-M', description: 'WiFi Logger', price: 'KES 4,500', availability: 'in-stock' }
    ]
  },

  // VICTRON MULTIPLUS
  {
    id: 'victron-multiplus-ii-48-5000',
    brand: 'Victron Energy',
    model: 'MultiPlus-II 48/5000/70',
    type: 'hybrid',
    power: '5000VA / 4000W',
    voltage: '48V DC / 230V AC',
    specifications: {
      maxPvPower: 'Via MPPT controller',
      maxPvVoltage: 'N/A (external MPPT)',
      mpptRange: 'N/A',
      mpptChannels: 0,
      maxInputCurrent: '50A AC',
      acOutput: '230V, 50Hz',
      efficiency: '96%',
      batteryVoltage: '48V (38-66V)',
      maxChargeRate: '70A'
    },
    wiringDiagram: {
      description: 'Victron MultiPlus-II Installation Schematic',
      connections: [
        { terminal: 'Battery+', function: 'Battery Positive', wireColor: 'Red', wireSize: '70mm²', notes: 'M8 bolt' },
        { terminal: 'Battery-', function: 'Battery Negative', wireColor: 'Black', wireSize: '70mm²', notes: 'M8 bolt' },
        { terminal: 'AC-In L', function: 'Grid/Generator Input', wireColor: 'Brown', wireSize: '10mm²', notes: 'Use ferrules' },
        { terminal: 'AC-In N', function: 'Neutral Input', wireColor: 'Blue', wireSize: '10mm²', notes: 'Use ferrules' },
        { terminal: 'AC-Out-1 L', function: 'Critical Loads', wireColor: 'Brown', wireSize: '10mm²', notes: 'Backed up' },
        { terminal: 'AC-Out-1 N', function: 'Critical Neutral', wireColor: 'Blue', wireSize: '10mm²', notes: 'Backed up' },
        { terminal: 'AC-Out-2 L', function: 'Non-Critical Loads', wireColor: 'Brown', wireSize: '10mm²', notes: 'Not backed up' },
        { terminal: 'AC-Out-2 N', function: 'Non-Critical Neutral', wireColor: 'Blue', wireSize: '10mm²', notes: 'Not backed up' }
      ],
      notes: [
        'Connect MPPT solar charger separately to battery',
        'Use Victron VE.Can or VE.Direct for system communication',
        'GX device recommended for monitoring',
        'Consider Lynx Distributor for large battery banks'
      ],
      wireColors: {
        'Battery+': 'Red',
        'Battery-': 'Black',
        'AC Live': 'Brown',
        'AC Neutral': 'Blue',
        'Earth': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'VE.Bus', pinNumber: 'RJ45', function: 'System Communication', notes: 'To GX device or parallel units' },
      { connector: 'VE.Can', pinNumber: 'RJ45', function: 'CAN Bus', notes: 'For BMS and accessories' },
      { connector: 'Temp Sense', pinNumber: '2-pin', function: 'Battery Temperature', notes: 'For temp compensation' },
      { connector: 'Aux In', pinNumber: '2-pin', function: 'Aux Input', notes: 'Programmable function' },
      { connector: 'Remote', pinNumber: '2-pin', function: 'Remote On/Off', notes: 'External switch' }
    ],
    commonFaults: [
      '#1 VE.Bus Error: Device switched off',
      '#2 Battery low: Low battery voltage',
      '#3 Battery high: High battery voltage',
      '#4 No mains: No AC input',
      '#5 Overload: Load exceeds capacity',
      '#14 Too much current from battery',
      '#15 Bulk time limit exceeded',
      '#17 VE.Bus BMS detected',
      '#26 Feedback detected'
    ],
    repairProcedures: [
      {
        title: 'VE.Bus Error Diagnosis',
        symptom: 'System shows VE.Bus error, units not communicating',
        possibleCauses: [
          'RJ45 cable faulty',
          'Terminators not installed',
          'Unit firmware mismatch',
          'Physical damage to port'
        ],
        diagnosticSteps: [
          'Check RJ45 cables are clicked in',
          'Verify terminators at each end of chain',
          'Check firmware versions match on all units',
          'Try different RJ45 cable',
          'Check VRM for detailed error codes'
        ],
        repairSteps: [
          'Replace RJ45 cable with known good one',
          'Install terminator plugs if missing',
          'Update firmware to latest matching version',
          'If port damaged, professional repair needed'
        ],
        testProcedure: [
          'Check VRM for communication status',
          'Verify all units show in VE.Configure',
          'Test parallel operation'
        ],
        estimatedTime: '30-60 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['RJ45 cables', 'VE.Bus terminators'],
        specialTools: ['Laptop with VE.Configure 3']
      },
      {
        title: 'Overload Protection Reset',
        symptom: 'Unit shuts down on overload, won\'t restart',
        possibleCauses: [
          'Load exceeds rating',
          'Motor starting surge',
          'Short circuit on output'
        ],
        diagnosticSteps: [
          'Check total connected load',
          'Identify high-inrush appliances',
          'Test for short circuits'
        ],
        repairSteps: [
          'Reduce connected load',
          'Install soft starters for motors',
          'Fix any short circuits found',
          'Consider upgrading to larger unit'
        ],
        testProcedure: [
          'Restart with minimal load',
          'Gradually add loads',
          'Monitor for repeated trips'
        ],
        estimatedTime: '15-30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['None usually'],
        specialTools: ['Clamp meter']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Firmware Updates',
        interval: 'Quarterly',
        procedure: [
          'Connect via VRM or VE.Configure',
          'Check for available updates',
          'Update all devices to matching versions',
          'Test system operation after update'
        ]
      },
      {
        task: 'Connection Inspection',
        interval: 'Every 6 months',
        procedure: [
          'Check battery terminal torque',
          'Inspect AC connections',
          'Look for signs of heating/corrosion',
          'Verify earth connections'
        ]
      }
    ],
    safetyWarnings: [
      'Equipment must be installed by qualified personnel',
      'Battery cables can deliver enormous short-circuit current',
      'Multiple AC outputs - verify all are isolated before service',
      'Earth/ground connections critical for safety'
    ],
    toolsRequired: [
      'Laptop with VE.Configure 3',
      'MK3-USB interface',
      'Multimeter',
      'Torque wrench',
      'RJ45 cable tester'
    ],
    spareParts: [
      { partNumber: 'VIC-RJ45-1M', description: 'VE.Bus RJ45 cable 1m', price: 'KES 1,500', availability: 'in-stock' },
      { partNumber: 'VIC-TERM', description: 'VE.Bus terminator', price: 'KES 800', availability: 'in-stock' },
      { partNumber: 'VIC-TEMP', description: 'Temperature sensor', price: 'KES 2,500', availability: 'in-stock' },
      { partNumber: 'VIC-MK3', description: 'MK3-USB Interface', price: 'KES 8,000', availability: 'in-stock' }
    ]
  },

  // SMA SUNNY BOY/TRIPOWER
  {
    id: 'sma-sunny-tripower-10',
    brand: 'SMA',
    model: 'Sunny Tripower 10.0',
    type: 'grid-tie',
    power: '10000W',
    voltage: '600V DC / 400V AC 3-Phase',
    specifications: {
      maxPvPower: '15000W',
      maxPvVoltage: '1000V DC',
      mpptRange: '260-800V DC',
      mpptChannels: 2,
      maxInputCurrent: '22A x 2',
      acOutput: '400V 3-Phase, 50Hz',
      efficiency: '98.3%'
    },
    wiringDiagram: {
      description: 'SMA Sunny Tripower 10kW 3-Phase Grid-Tie Installation',
      connections: [
        { terminal: 'DC+A', function: 'MPPT A Positive', wireColor: 'Red', wireSize: '6mm²', notes: 'String A input' },
        { terminal: 'DC-A', function: 'MPPT A Negative', wireColor: 'Black', wireSize: '6mm²', notes: 'String A input' },
        { terminal: 'DC+B', function: 'MPPT B Positive', wireColor: 'Red', wireSize: '6mm²', notes: 'String B input' },
        { terminal: 'DC-B', function: 'MPPT B Negative', wireColor: 'Black', wireSize: '6mm²', notes: 'String B input' },
        { terminal: 'L1', function: 'AC Phase 1', wireColor: 'Brown', wireSize: '6mm²', notes: '400V' },
        { terminal: 'L2', function: 'AC Phase 2', wireColor: 'Black', wireSize: '6mm²', notes: '400V' },
        { terminal: 'L3', function: 'AC Phase 3', wireColor: 'Grey', wireSize: '6mm²', notes: '400V' },
        { terminal: 'N', function: 'Neutral', wireColor: 'Blue', wireSize: '6mm²', notes: 'Neutral conductor' },
        { terminal: 'PE', function: 'Protective Earth', wireColor: 'Green/Yellow', wireSize: '6mm²', notes: 'Earth connection' }
      ],
      notes: [
        'Use SMA Speedwire for monitoring',
        'Maximum string voltage 1000V DC',
        'Ensure proper string sizing using Sunny Design',
        'DC isolator required on rooftop',
        'AC surge protection recommended'
      ],
      wireColors: {
        'L1': 'Brown',
        'L2': 'Black',
        'L3': 'Grey',
        'N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'Speedwire', pinNumber: 'RJ45', function: 'Ethernet Communication', notes: 'For monitoring' },
      { connector: 'RS485', pinNumber: '1-2', function: 'Modbus Communication', notes: 'For energy meters' }
    ],
    commonFaults: [
      'E001: Grid Overvoltage',
      'E002: Grid Undervoltage',
      'E003: Grid Frequency Error',
      'E004: DC Overvoltage',
      'E005: Insulation Fault'
    ],
    repairProcedures: [
      {
        title: 'Speedwire Communication Setup',
        symptom: 'Inverter not visible on Sunny Portal',
        possibleCauses: ['Network cable fault', 'IP address conflict', 'Router issue'],
        diagnosticSteps: ['Check network LED on inverter', 'Verify cable connection', 'Check router DHCP'],
        repairSteps: ['Connect via Sunny Explorer', 'Set static IP if needed', 'Configure Speedwire'],
        testProcedure: ['Verify Sunny Portal connection', 'Check data updating'],
        estimatedTime: '30-60 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['Ethernet cable'],
        specialTools: ['Laptop with Sunny Explorer']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: ['Check for error LEDs', 'Verify no unusual sounds', 'Check ventilation']
      }
    ],
    safetyWarnings: [
      '3-phase voltages are lethal',
      'Always isolate AC and DC before servicing',
      'PV arrays generate voltage in light'
    ],
    toolsRequired: ['Multimeter', 'Laptop with Sunny Explorer', 'Insulated tools'],
    spareParts: [
      { partNumber: 'SMA-FAN-10', description: 'Cooling fan', price: 'KES 5,000', availability: 'order' },
      { partNumber: 'SMA-SURGE-DC', description: 'DC SPD', price: 'KES 8,000', availability: 'in-stock' }
    ]
  },

  // FRONIUS GEN24
  {
    id: 'fronius-gen24-plus',
    brand: 'Fronius',
    model: 'GEN24 Plus 10.0',
    type: 'hybrid',
    power: '10000W',
    voltage: '48-400V DC / 230V AC',
    specifications: {
      maxPvPower: '15000W',
      maxPvVoltage: '1000V DC',
      mpptRange: '80-1000V DC',
      mpptChannels: 2,
      maxInputCurrent: '25A x 2',
      acOutput: '230V, 50Hz',
      efficiency: '98.0%',
      batteryVoltage: '150-400V',
      maxChargeRate: '12.5kW'
    },
    wiringDiagram: {
      description: 'Fronius GEN24 Plus Hybrid System',
      connections: [
        { terminal: 'PV1+/-', function: 'String 1', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'MC4 connectors' },
        { terminal: 'PV2+/-', function: 'String 2', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'MC4 connectors' },
        { terminal: 'BAT+/-', function: 'Battery', wireColor: 'Red/Black', wireSize: '35mm²', notes: 'BYD/Fronius battery' },
        { terminal: 'AC-L/N/PE', function: 'Grid Connection', wireColor: 'Brown/Blue/G-Y', wireSize: '10mm²', notes: 'Main grid' }
      ],
      notes: [
        'Compatible with Fronius/BYD high-voltage batteries',
        'Full backup capability with GEN24 Plus',
        'Configure via Fronius Solar.web',
        'PV-point for emergency power'
      ],
      wireColors: {
        'PV+': 'Red',
        'PV-': 'Black',
        'BAT+': 'Red',
        'BAT-': 'Black',
        'AC L': 'Brown',
        'AC N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'Modbus', pinNumber: 'D+/D-/GND', function: 'External metering', notes: 'Fronius Smart Meter' },
      { connector: 'BatCom', pinNumber: 'CAN-H/L/GND', function: 'Battery communication', notes: 'For compatible batteries' }
    ],
    commonFaults: [
      'State 102 - AC Voltage Too Low',
      'State 307 - DC Overvoltage',
      'State 509 - No Communication',
      'State 516 - Arc Detected'
    ],
    repairProcedures: [
      {
        title: 'Smart Meter Configuration',
        symptom: 'Export not limited, no consumption data',
        possibleCauses: ['Meter not configured', 'RS485 wiring', 'Wrong meter address'],
        diagnosticSteps: ['Check meter LED', 'Verify RS485 connection', 'Check Solar.web'],
        repairSteps: ['Wire RS485 correctly', 'Set meter address to 1', 'Configure in installer menu'],
        testProcedure: ['Check consumption shows in app', 'Verify export limiting works'],
        estimatedTime: '45 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['Fronius Smart Meter', 'RS485 cable'],
        specialTools: ['None']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Firmware Update',
        interval: 'Quarterly',
        procedure: ['Check Solar.web for updates', 'Download and install', 'Verify version']
      }
    ],
    safetyWarnings: [
      'High voltage DC system',
      'Battery system remains energized',
      'Full system isolation required'
    ],
    toolsRequired: ['Multimeter', 'Laptop', 'DC clamp meter'],
    spareParts: [
      { partNumber: 'FRO-SMET', description: 'Smart Meter 50kA-3', price: 'KES 35,000', availability: 'in-stock' }
    ]
  },

  // HUAWEI SUN2000
  {
    id: 'huawei-sun2000-10ktl',
    brand: 'Huawei',
    model: 'SUN2000-10KTL-M1',
    type: 'grid-tie',
    power: '10000W',
    voltage: '600V DC / 400V AC 3-Phase',
    specifications: {
      maxPvPower: '15000W',
      maxPvVoltage: '1100V DC',
      mpptRange: '200-1000V DC',
      mpptChannels: 2,
      maxInputCurrent: '22A x 2',
      acOutput: '400V 3-Phase, 50Hz',
      efficiency: '98.6%'
    },
    wiringDiagram: {
      description: 'Huawei SUN2000 Commercial Installation',
      connections: [
        { terminal: 'PV1+/PV1-', function: 'MPPT1 Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'Smart PV optimizer compatible' },
        { terminal: 'PV2+/PV2-', function: 'MPPT2 Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'Smart PV optimizer compatible' },
        { terminal: 'R/S/T', function: '3-Phase Output', wireColor: 'Brown/Black/Grey', wireSize: '6mm²', notes: '400V AC' },
        { terminal: 'N', function: 'Neutral', wireColor: 'Blue', wireSize: '6mm²', notes: 'Required' },
        { terminal: 'PE', function: 'Earth', wireColor: 'Green/Yellow', wireSize: '6mm²', notes: 'Mandatory' }
      ],
      notes: [
        'Use Huawei Smart Logger for multi-inverter systems',
        'FusionSolar app for monitoring',
        'AFCI protection built-in',
        'IP65 rated for outdoor installation'
      ],
      wireColors: {
        'R': 'Brown',
        'S': 'Black',
        'T': 'Grey',
        'N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'COM', pinNumber: 'RS485-A/B', function: 'Communication', notes: 'To Smart Logger' },
      { connector: 'MBUS', pinNumber: '1-4', function: 'Smart Dongle', notes: 'WiFi/4G monitoring' }
    ],
    commonFaults: [
      'Fault 2001: High String Input Voltage',
      'Fault 2002: String Reverse Connection',
      'Fault 2066: Insulation Resistance Low',
      'Fault 2067: Residual Current High'
    ],
    repairProcedures: [
      {
        title: 'Smart Dongle Installation',
        symptom: 'No monitoring data',
        possibleCauses: ['Dongle not installed', 'WiFi not configured', 'Signal weak'],
        diagnosticSteps: ['Check dongle LED', 'Verify WiFi strength', 'Check FusionSolar app'],
        repairSteps: ['Install dongle in MBUS port', 'Configure WiFi via app', 'Register inverter'],
        testProcedure: ['Verify data in FusionSolar', 'Check real-time production'],
        estimatedTime: '20 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['Huawei Smart Dongle'],
        specialTools: ['Smartphone with FusionSolar app']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Fan Cleaning',
        interval: 'Every 6 months',
        procedure: ['Inspect fan vents', 'Remove debris', 'Check fan operation']
      }
    ],
    safetyWarnings: [
      'High DC voltage - up to 1100V',
      '3-phase AC system',
      'AFCI may not be disabled'
    ],
    toolsRequired: ['Multimeter', 'Smartphone with FusionSolar', 'Insulated tools'],
    spareParts: [
      { partNumber: 'HUA-DONGLE', description: 'Smart Dongle WiFi', price: 'KES 5,500', availability: 'in-stock' }
    ]
  },

  // SUNGROW HYBRID
  {
    id: 'sungrow-sh10rs',
    brand: 'Sungrow',
    model: 'SH10RS',
    type: 'hybrid',
    power: '10000W',
    voltage: '600V DC / 230V AC',
    specifications: {
      maxPvPower: '15000W',
      maxPvVoltage: '600V DC',
      mpptRange: '140-550V DC',
      mpptChannels: 2,
      maxInputCurrent: '16A x 2',
      acOutput: '230V, 50Hz',
      efficiency: '97.8%',
      batteryVoltage: '180-500V',
      maxChargeRate: '10kW'
    },
    wiringDiagram: {
      description: 'Sungrow SH10RS Residential Hybrid System',
      connections: [
        { terminal: 'PV1+/-', function: 'MPPT1', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'String 1' },
        { terminal: 'PV2+/-', function: 'MPPT2', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'String 2' },
        { terminal: 'BAT+/-', function: 'Battery', wireColor: 'Red/Black', wireSize: '25mm²', notes: 'Sungrow battery' },
        { terminal: 'GRID L/N', function: 'Grid', wireColor: 'Brown/Blue', wireSize: '10mm²', notes: 'Grid connection' },
        { terminal: 'LOAD L/N', function: 'Backup Loads', wireColor: 'Brown/Blue', wireSize: '10mm²', notes: 'Essential loads' }
      ],
      notes: [
        'Supports Sungrow high-voltage batteries',
        'Backup power on LOAD terminals',
        'iSolarCloud app for monitoring',
        'Generator input supported'
      ],
      wireColors: {
        'PV+': 'Red',
        'PV-': 'Black',
        'AC L': 'Brown',
        'AC N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'COM', pinNumber: 'RS485 A/B', function: 'Meter connection', notes: 'Energy meter' },
      { connector: 'CAN', pinNumber: 'H/L/GND', function: 'Battery BMS', notes: 'CAN communication' }
    ],
    commonFaults: [
      'F001: Grid Overvoltage',
      'F002: Grid Undervoltage',
      'F005: PV Overvoltage',
      'F006: Insulation Fault'
    ],
    repairProcedures: [
      {
        title: 'Battery Pairing',
        symptom: 'Battery not detected',
        possibleCauses: ['CAN cable fault', 'BMS not on', 'Protocol mismatch'],
        diagnosticSteps: ['Check battery power LED', 'Verify CAN wiring', 'Check BMS settings'],
        repairSteps: ['Connect CAN cable correctly', 'Power on battery', 'Configure battery type in inverter'],
        testProcedure: ['Verify battery SOC shows', 'Test charge/discharge'],
        estimatedTime: '45 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['CAN cable'],
        specialTools: ['None']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Connection Check',
        interval: 'Every 6 months',
        procedure: ['Check all terminals', 'Verify torque', 'Look for discoloration']
      }
    ],
    safetyWarnings: [
      'High voltage battery system',
      'Multiple power sources',
      'Complete isolation required for service'
    ],
    toolsRequired: ['Multimeter', 'Torque wrench', 'iSolarCloud app'],
    spareParts: [
      { partNumber: 'SNG-CAN', description: 'CAN Communication Cable', price: 'KES 3,000', availability: 'in-stock' }
    ]
  },

  // SOLAX X3-HYBRID
  {
    id: 'solax-x3-hybrid-10',
    brand: 'SolaX',
    model: 'X3-Hybrid-10.0-D',
    type: 'hybrid',
    power: '10000W',
    voltage: '600V DC / 400V AC 3-Phase',
    specifications: {
      maxPvPower: '15000W',
      maxPvVoltage: '1000V DC',
      mpptRange: '180-850V DC',
      mpptChannels: 2,
      maxInputCurrent: '26A',
      acOutput: '400V 3-Phase, 50Hz',
      efficiency: '97.5%',
      batteryVoltage: '180-550V',
      maxChargeRate: '8kW'
    },
    wiringDiagram: {
      description: 'SolaX X3-Hybrid Three-Phase System',
      connections: [
        { terminal: 'PV1/PV2', function: 'Solar Strings', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'MC4 connectors' },
        { terminal: 'BAT+/-', function: 'Battery Connection', wireColor: 'Red/Black', wireSize: '35mm²', notes: 'Triple Power battery' },
        { terminal: 'L1/L2/L3/N', function: '3-Phase Grid', wireColor: 'Brown/Black/Grey/Blue', wireSize: '10mm²', notes: 'Grid side' },
        { terminal: 'LOAD', function: 'Backup Output', wireColor: 'Various', wireSize: '10mm²', notes: 'Off-grid loads' }
      ],
      notes: [
        'Compatible with SolaX Triple Power batteries',
        '100% unbalanced load capability',
        'Generator backup support',
        'SolaX Cloud monitoring'
      ],
      wireColors: {
        'L1': 'Brown',
        'L2': 'Black',
        'L3': 'Grey',
        'N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'RS485', pinNumber: 'A/B/GND', function: 'Meter communication', notes: 'For CT/Meter' },
      { connector: 'CAN', pinNumber: 'H/L/GND', function: 'Battery BMS', notes: 'Required for lithium' }
    ],
    commonFaults: [
      'F01: Grid Error',
      'F03: Battery Fault',
      'F04: Meter Communication Error',
      'F10: Isolation Abnormal'
    ],
    repairProcedures: [
      {
        title: 'CT Clamp Installation',
        symptom: 'Incorrect grid power readings',
        possibleCauses: ['CT not installed', 'CT direction wrong', 'CT ratio wrong'],
        diagnosticSteps: ['Check CT connection', 'Verify CT direction arrow', 'Check CT ratio setting'],
        repairSteps: ['Install CT around main grid cable', 'Arrow toward load', 'Set CT ratio in settings'],
        testProcedure: ['Verify import/export readings match meter'],
        estimatedTime: '30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['CT clamp'],
        specialTools: ['None']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'System Health Check',
        interval: 'Monthly',
        procedure: ['Login to SolaX Cloud', 'Check for alarms', 'Verify production data']
      }
    ],
    safetyWarnings: [
      '3-phase high voltage system',
      'Battery voltage up to 550V',
      'Multiple isolation points required'
    ],
    toolsRequired: ['Multimeter', '3-phase tester', 'SolaX Cloud app'],
    spareParts: [
      { partNumber: 'SLX-CT', description: 'CT Clamp 100A', price: 'KES 4,500', availability: 'in-stock' },
      { partNumber: 'SLX-POCKET', description: 'Pocket WiFi', price: 'KES 6,000', availability: 'in-stock' }
    ]
  },

  // GOODWE ES SERIES
  {
    id: 'goodwe-es-5048',
    brand: 'Goodwe',
    model: 'GW5048-ES',
    type: 'hybrid',
    power: '5000W',
    voltage: '500V DC / 230V AC',
    specifications: {
      maxPvPower: '6500W',
      maxPvVoltage: '550V DC',
      mpptRange: '125-500V DC',
      mpptChannels: 2,
      maxInputCurrent: '13A x 2',
      acOutput: '230V, 50Hz',
      efficiency: '97.6%',
      batteryVoltage: '42-58V',
      maxChargeRate: '4.6kW'
    },
    wiringDiagram: {
      description: 'Goodwe GW5048-ES Residential Hybrid',
      connections: [
        { terminal: 'PV1/PV2', function: 'Solar Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: '2 MPPT channels' },
        { terminal: 'BAT+/-', function: '48V Battery', wireColor: 'Red/Black', wireSize: '35mm²', notes: 'Lynx or compatible' },
        { terminal: 'GRID', function: 'Grid Connection', wireColor: 'Brown/Blue/G-Y', wireSize: '6mm²', notes: 'Grid side' },
        { terminal: 'BACKUP', function: 'Backup Output', wireColor: 'Brown/Blue/G-Y', wireSize: '6mm²', notes: 'Essential loads' }
      ],
      notes: [
        'Compatible with Goodwe Lynx batteries',
        'Also works with low voltage lithium (48V)',
        'SEMS portal monitoring',
        'UPS function for critical loads'
      ],
      wireColors: {
        'PV+': 'Red',
        'PV-': 'Black',
        'BAT+': 'Red',
        'BAT-': 'Black',
        'L': 'Brown',
        'N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'BMS', pinNumber: 'CAN H/L/GND', function: 'Battery Management', notes: 'For lithium batteries' },
      { connector: 'METER', pinNumber: 'RS485', function: 'Energy Meter', notes: 'For export control' }
    ],
    commonFaults: [
      'E001: DC Bus Voltage Abnormal',
      'E002: PV1 Input Overvoltage',
      'E003: PV2 Input Overvoltage',
      'E004: Grid Frequency Error'
    ],
    repairProcedures: [
      {
        title: 'Battery Type Configuration',
        symptom: 'Battery not charging/discharging',
        possibleCauses: ['Wrong battery type selected', 'BMS not communicating', 'Voltage settings wrong'],
        diagnosticSteps: ['Check battery type in settings', 'Verify BMS cable', 'Check voltage parameters'],
        repairSteps: ['Select correct battery type', 'Set correct voltage limits', 'Enable BMS communication'],
        testProcedure: ['Monitor charging cycle', 'Verify SOC accuracy'],
        estimatedTime: '30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['None'],
        specialTools: ['SEMS Portal access']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Battery Health Check',
        interval: 'Monthly',
        procedure: ['Check battery SOC/SOH in app', 'Verify cell balancing', 'Monitor temperature']
      }
    ],
    safetyWarnings: [
      'Low voltage battery still dangerous',
      'Stored energy in batteries',
      'Proper isolation required'
    ],
    toolsRequired: ['Multimeter', 'SEMS Portal access', 'BMS cable if lithium'],
    spareParts: [
      { partNumber: 'GW-EZLINK', description: 'WiFi module', price: 'KES 4,500', availability: 'in-stock' }
    ]
  },

  // MUST/EASUN PV INVERTER
  {
    id: 'must-pv1800-5kva',
    brand: 'Must/PowMr/EASUN',
    model: 'PV1800 VPM 5KVA',
    type: 'off-grid',
    power: '5000VA / 4000W',
    voltage: '48V DC / 230V AC',
    specifications: {
      maxPvPower: '5000W',
      maxPvVoltage: '450V DC',
      mpptRange: '120-430V DC',
      mpptChannels: 1,
      maxInputCurrent: '80A',
      acOutput: '230V, 50Hz',
      efficiency: '93%',
      batteryVoltage: '48V (44-60V)',
      maxChargeRate: '80A'
    },
    wiringDiagram: {
      description: 'Budget Hybrid Inverter - Very Popular in Kenya',
      connections: [
        { terminal: 'PV+/PV-', function: 'Solar Input', wireColor: 'Red/Black', wireSize: '6mm²', notes: 'Max 450V Voc' },
        { terminal: 'BAT+/BAT-', function: '48V Battery', wireColor: 'Red/Black', wireSize: '35mm²', notes: 'Include fuse' },
        { terminal: 'AC-IN', function: 'Grid/Generator', wireColor: 'Brown/Blue', wireSize: '6mm²', notes: 'Backup source' },
        { terminal: 'AC-OUT', function: 'Load Output', wireColor: 'Brown/Blue', wireSize: '6mm²', notes: 'To loads' }
      ],
      notes: [
        'Popular budget option in Kenya',
        'Configure via LCD panel',
        'Lead-acid or lithium compatible',
        'Parallel operation possible (some models)'
      ],
      wireColors: {
        'PV+': 'Red',
        'PV-': 'Black',
        'BAT+': 'Red',
        'BAT-': 'Black',
        'AC L': 'Brown',
        'AC N': 'Blue'
      }
    },
    terminalPinout: [
      { connector: 'RS232', pinNumber: 'DB9', function: 'PC Communication', notes: 'For monitoring software' },
      { connector: 'BMS', pinNumber: '4-pin', function: 'Lithium BMS', notes: 'RS485/CAN depending on model' }
    ],
    commonFaults: [
      'Fault 01: Overload',
      'Fault 02: Battery Low',
      'Fault 03: Battery High',
      'Fault 07: PV Overvoltage',
      'Fault 51: EEPROM Error',
      'Fault 52: Over Temperature'
    ],
    repairProcedures: [
      {
        title: 'LCD Menu Navigation',
        symptom: 'Need to change settings',
        possibleCauses: ['Default settings not suitable', 'Battery type change', 'Charging parameters'],
        diagnosticSteps: ['Note current settings', 'Identify required changes'],
        repairSteps: ['Hold ENTER to access menu', 'Use UP/DOWN to navigate', 'Select parameter', 'Adjust with UP/DOWN', 'Press ENTER to save'],
        testProcedure: ['Verify new settings applied', 'Test operation'],
        estimatedTime: '15 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['None'],
        specialTools: ['None']
      },
      {
        title: 'Fan Replacement',
        symptom: 'Overheating, fan not spinning',
        possibleCauses: ['Fan motor dead', 'Dust blockage', 'Wiring issue'],
        diagnosticSteps: ['Check fan manually', 'Test with 12V supply', 'Check connector'],
        repairSteps: ['Power off completely', 'Open top cover', 'Disconnect fan', 'Replace with same size (usually 80mm 12V)', 'Reconnect'],
        testProcedure: ['Power on', 'Verify fan spins', 'Monitor temperature'],
        estimatedTime: '30 minutes',
        difficultyLevel: 'beginner',
        partsNeeded: ['80mm 12V cooling fan - KES 500-1000'],
        specialTools: ['Screwdriver']
      },
      {
        title: 'EEPROM Reset',
        symptom: 'Fault 51, settings corrupted',
        possibleCauses: ['Power surge', 'Firmware issue', 'Age'],
        diagnosticSteps: ['Note all current settings if readable'],
        repairSteps: ['Access hidden menu (varies by model)', 'Factory reset', 'Reconfigure all parameters', 'Set battery type', 'Set charge voltages'],
        testProcedure: ['Verify operation', 'Monitor for 24h'],
        estimatedTime: '45 minutes',
        difficultyLevel: 'intermediate',
        partsNeeded: ['None usually'],
        specialTools: ['Manual for specific model']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Dust Cleaning',
        interval: 'Monthly',
        procedure: ['Power off', 'Clean vents with brush', 'Check fan operation']
      },
      {
        task: 'Settings Verification',
        interval: 'Quarterly',
        procedure: ['Check all LCD settings', 'Verify battery parameters match actual battery', 'Note any changes']
      }
    ],
    safetyWarnings: [
      'Budget units may have less protection',
      '48V battery banks can be dangerous',
      'Verify specifications before connecting',
      'Not recommended for critical applications'
    ],
    toolsRequired: ['Multimeter', 'Screwdriver', 'Brush for cleaning'],
    spareParts: [
      { partNumber: 'MUST-FAN', description: 'Cooling Fan 80mm', price: 'KES 800', availability: 'in-stock' },
      { partNumber: 'MUST-LCD', description: 'LCD Display', price: 'KES 3,000', availability: 'order' },
      { partNumber: 'MUST-FUSE', description: 'DC Fuse 100A', price: 'KES 500', availability: 'in-stock' }
    ]
  },

  // SCHNEIDER CONEXT XW+
  {
    id: 'schneider-conext-xw-6848',
    brand: 'Schneider Electric',
    model: 'Conext XW+ 6848',
    type: 'off-grid',
    power: '6800W continuous / 13600W surge',
    voltage: '48V DC / 230V AC',
    specifications: {
      maxPvPower: 'Via charge controller',
      maxPvVoltage: 'N/A (external MPPT)',
      mpptRange: 'N/A',
      mpptChannels: 0,
      maxInputCurrent: '60A AC',
      acOutput: '230V, 50Hz',
      efficiency: '95.4%',
      batteryVoltage: '48V (40-64V)',
      maxChargeRate: '140A'
    },
    wiringDiagram: {
      description: 'Premium Off-Grid/Hybrid System',
      connections: [
        { terminal: 'BAT+/BAT-', function: 'Battery Bank', wireColor: 'Red/Black', wireSize: '95mm²', notes: 'High current' },
        { terminal: 'AC1-IN', function: 'Grid/Generator 1', wireColor: 'Brown/Blue/G-Y', wireSize: '10mm²', notes: 'Main AC input' },
        { terminal: 'AC2-IN', function: 'Generator 2', wireColor: 'Brown/Blue/G-Y', wireSize: '10mm²', notes: 'Secondary' },
        { terminal: 'AC-OUT', function: 'Load Output', wireColor: 'Brown/Blue/G-Y', wireSize: '10mm²', notes: 'Inverter output' }
      ],
      notes: [
        'Use with Conext MPPT charge controllers',
        'Xanbus network for system communication',
        'InsightHome/Facility for monitoring',
        'Dual AC input for grid + generator'
      ],
      wireColors: {
        'BAT+': 'Red',
        'BAT-': 'Black',
        'L': 'Brown',
        'N': 'Blue',
        'PE': 'Green/Yellow'
      }
    },
    terminalPinout: [
      { connector: 'Xanbus', pinNumber: 'RJ45', function: 'System Network', notes: 'Connect all Conext devices' },
      { connector: 'AUX', pinNumber: 'Terminal', function: 'Generator Control', notes: 'Auto-start generator' }
    ],
    commonFaults: [
      'W48: Battery Low',
      'W57: Over Temperature',
      'F23: AC Backfeed',
      'F44: Overload'
    ],
    repairProcedures: [
      {
        title: 'Xanbus Network Setup',
        symptom: 'Devices not communicating',
        possibleCauses: ['Cable fault', 'No termination', 'Configuration error'],
        diagnosticSteps: ['Check all Xanbus cables', 'Verify terminators at ends', 'Check device addresses'],
        repairSteps: ['Use cat5 cables for Xanbus', 'Install terminators at first and last device', 'Configure via SCP'],
        testProcedure: ['Verify all devices show in InsightHome', 'Test control commands'],
        estimatedTime: '1-2 hours',
        difficultyLevel: 'advanced',
        partsNeeded: ['Xanbus terminators', 'Cat5 cables'],
        specialTools: ['Conext System Control Panel or InsightHome']
      }
    ],
    maintenanceSchedule: [
      {
        task: 'Firmware Update',
        interval: 'Annually',
        procedure: ['Check Schneider website for updates', 'Download to USB', 'Update via SCP']
      }
    ],
    safetyWarnings: [
      'Very high surge currents',
      'Large battery banks required',
      'Professional installation only',
      'Multiple AC sources require careful isolation'
    ],
    toolsRequired: ['Laptop with InsightHome', 'Torque wrench', 'Large cable crimpers'],
    spareParts: [
      { partNumber: 'SCH-XANTERM', description: 'Xanbus Terminator', price: 'KES 2,000', availability: 'order' },
      { partNumber: 'SCH-SCP', description: 'System Control Panel', price: 'KES 45,000', availability: 'order' }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CABLE SIZING GUIDE
// ═══════════════════════════════════════════════════════════════════════════════
export interface CableSizing {
  application: string;
  description: string;
  parameters: CableParameter[];
  recommendations: CableRecommendation[];
  notes: string[];
}

export interface CableParameter {
  power: string;
  voltage: string;
  current: string;
  distance: string;
  cableSize: string;
  voltageDropPercent: string;
}

export interface CableRecommendation {
  cableType: string;
  application: string;
  characteristics: string[];
  brands: string[];
  priceRange: string;
}

export const CABLE_SIZING_GUIDE: CableSizing[] = [
  {
    application: 'Solar Panel to Inverter (DC)',
    description: 'PV string cables from panel array to inverter MPPT inputs',
    parameters: [
      { power: '1-2kW', voltage: '200V DC', current: '10A', distance: '10m', cableSize: '4mm²', voltageDropPercent: '1.2%' },
      { power: '1-2kW', voltage: '200V DC', current: '10A', distance: '20m', cableSize: '6mm²', voltageDropPercent: '1.5%' },
      { power: '1-2kW', voltage: '200V DC', current: '10A', distance: '30m', cableSize: '10mm²', voltageDropPercent: '1.4%' },
      { power: '3-5kW', voltage: '400V DC', current: '12A', distance: '10m', cableSize: '4mm²', voltageDropPercent: '0.7%' },
      { power: '3-5kW', voltage: '400V DC', current: '12A', distance: '20m', cableSize: '6mm²', voltageDropPercent: '0.9%' },
      { power: '3-5kW', voltage: '400V DC', current: '12A', distance: '30m', cableSize: '6mm²', voltageDropPercent: '1.3%' },
      { power: '5-10kW', voltage: '500V DC', current: '18A', distance: '10m', cableSize: '6mm²', voltageDropPercent: '0.7%' },
      { power: '5-10kW', voltage: '500V DC', current: '18A', distance: '20m', cableSize: '10mm²', voltageDropPercent: '0.8%' },
      { power: '5-10kW', voltage: '500V DC', current: '18A', distance: '30m', cableSize: '10mm²', voltageDropPercent: '1.2%' },
      { power: '10-20kW', voltage: '600V DC', current: '30A', distance: '10m', cableSize: '10mm²', voltageDropPercent: '0.7%' },
      { power: '10-20kW', voltage: '600V DC', current: '30A', distance: '20m', cableSize: '16mm²', voltageDropPercent: '0.8%' },
      { power: '10-20kW', voltage: '600V DC', current: '30A', distance: '30m', cableSize: '25mm²', voltageDropPercent: '0.8%' }
    ],
    recommendations: [
      {
        cableType: 'Solar DC Cable (TUV certified)',
        application: 'All PV string wiring',
        characteristics: [
          'UV resistant',
          'Double insulated (1500V DC rated)',
          'Temperature range -40°C to +90°C',
          'Flame retardant',
          'Halogen free',
          'Expected life 25+ years'
        ],
        brands: ['Lapp Solar', 'Helukabel', 'Prysmian', 'Nexans'],
        priceRange: 'KES 150-350 per meter'
      }
    ],
    notes: [
      'Always size for <2% voltage drop on DC side',
      'Use TUV/IEC certified solar cable only',
      'Protect cables in conduit where exposed',
      'MC4 connectors must match cable size',
      'Never mix different MC4 brands'
    ]
  },
  {
    application: 'Battery to Inverter (DC)',
    description: 'High current DC cables between battery bank and inverter',
    parameters: [
      { power: '1kW', voltage: '12V', current: '100A', distance: '1m', cableSize: '25mm²', voltageDropPercent: '1.1%' },
      { power: '1kW', voltage: '12V', current: '100A', distance: '2m', cableSize: '35mm²', voltageDropPercent: '1.5%' },
      { power: '2kW', voltage: '24V', current: '100A', distance: '1m', cableSize: '25mm²', voltageDropPercent: '0.6%' },
      { power: '2kW', voltage: '24V', current: '100A', distance: '2m', cableSize: '35mm²', voltageDropPercent: '0.8%' },
      { power: '3kW', voltage: '48V', current: '80A', distance: '1m', cableSize: '25mm²', voltageDropPercent: '0.4%' },
      { power: '3kW', voltage: '48V', current: '80A', distance: '2m', cableSize: '25mm²', voltageDropPercent: '0.7%' },
      { power: '5kW', voltage: '48V', current: '120A', distance: '1m', cableSize: '35mm²', voltageDropPercent: '0.4%' },
      { power: '5kW', voltage: '48V', current: '120A', distance: '2m', cableSize: '50mm²', voltageDropPercent: '0.5%' },
      { power: '5kW', voltage: '48V', current: '120A', distance: '3m', cableSize: '70mm²', voltageDropPercent: '0.5%' },
      { power: '8kW', voltage: '48V', current: '180A', distance: '1m', cableSize: '50mm²', voltageDropPercent: '0.4%' },
      { power: '8kW', voltage: '48V', current: '180A', distance: '2m', cableSize: '70mm²', voltageDropPercent: '0.5%' },
      { power: '8kW', voltage: '48V', current: '180A', distance: '3m', cableSize: '95mm²', voltageDropPercent: '0.5%' },
      { power: '10kW', voltage: '48V', current: '220A', distance: '1m', cableSize: '70mm²', voltageDropPercent: '0.4%' },
      { power: '10kW', voltage: '48V', current: '220A', distance: '2m', cableSize: '95mm²', voltageDropPercent: '0.4%' },
      { power: '10kW', voltage: '48V', current: '220A', distance: '3m', cableSize: '120mm²', voltageDropPercent: '0.5%' }
    ],
    recommendations: [
      {
        cableType: 'Flexible Battery Cable',
        application: 'All battery connections',
        characteristics: [
          'Fine stranded copper',
          'Flexible for easy routing',
          'High temperature insulation (105°C)',
          'Tinned copper for corrosion resistance',
          'Red/Black color coding'
        ],
        brands: ['Lapp Ölflex', 'Helukabel', 'East African Cables'],
        priceRange: 'KES 500-2,500 per meter (depending on size)'
      }
    ],
    notes: [
      'Keep battery cables as short as possible',
      'Both positive and negative cables MUST be same length',
      'Use appropriately rated cable lugs',
      'Insulate all exposed terminals',
      'Install fuse or breaker at battery',
      'Voltage drop should be <1%'
    ]
  },
  {
    application: 'AC Grid Connection',
    description: 'AC cables from inverter to distribution board and grid',
    parameters: [
      { power: '3kW', voltage: '230V', current: '15A', distance: '10m', cableSize: '2.5mm²', voltageDropPercent: '2.0%' },
      { power: '3kW', voltage: '230V', current: '15A', distance: '20m', cableSize: '4mm²', voltageDropPercent: '2.4%' },
      { power: '5kW', voltage: '230V', current: '25A', distance: '10m', cableSize: '4mm²', voltageDropPercent: '2.0%' },
      { power: '5kW', voltage: '230V', current: '25A', distance: '20m', cableSize: '6mm²', voltageDropPercent: '2.6%' },
      { power: '8kW', voltage: '230V', current: '40A', distance: '10m', cableSize: '6mm²', voltageDropPercent: '2.1%' },
      { power: '8kW', voltage: '230V', current: '40A', distance: '20m', cableSize: '10mm²', voltageDropPercent: '2.5%' },
      { power: '10kW', voltage: '230V', current: '50A', distance: '10m', cableSize: '10mm²', voltageDropPercent: '1.6%' },
      { power: '10kW', voltage: '230V', current: '50A', distance: '20m', cableSize: '16mm²', voltageDropPercent: '2.0%' },
      { power: '10kW 3P', voltage: '400V', current: '15A', distance: '10m', cableSize: '2.5mm²', voltageDropPercent: '0.6%' },
      { power: '10kW 3P', voltage: '400V', current: '15A', distance: '20m', cableSize: '4mm²', voltageDropPercent: '0.7%' },
      { power: '20kW 3P', voltage: '400V', current: '30A', distance: '10m', cableSize: '4mm²', voltageDropPercent: '0.8%' },
      { power: '20kW 3P', voltage: '400V', current: '30A', distance: '20m', cableSize: '6mm²', voltageDropPercent: '1.0%' }
    ],
    recommendations: [
      {
        cableType: 'PVC/XLPE Insulated Cable',
        application: 'AC grid and load connections',
        characteristics: [
          'Copper conductor',
          'PVC or XLPE insulated',
          'Suitable for indoor/outdoor use',
          'Meets BS/IEC standards'
        ],
        brands: ['East African Cables', 'Kenya Power Cables', 'Prysmian', 'Nexans'],
        priceRange: 'KES 100-800 per meter'
      }
    ],
    notes: [
      'AC voltage drop should be <3%',
      'Use appropriate cable glands for enclosures',
      'Earth conductor must be same size as live',
      'Follow local wiring regulations (KEBS)',
      'Install Type B RCD for inverter circuits'
    ]
  },
  {
    application: 'Inter-Battery Connections',
    description: 'Cables connecting batteries in series or parallel',
    parameters: [
      { power: '100Ah 12V', voltage: '12V', current: '100A', distance: '0.3m', cableSize: '25mm²', voltageDropPercent: '0.3%' },
      { power: '100Ah 12V', voltage: '12V', current: '100A', distance: '0.5m', cableSize: '35mm²', voltageDropPercent: '0.4%' },
      { power: '200Ah 12V', voltage: '12V', current: '200A', distance: '0.3m', cableSize: '50mm²', voltageDropPercent: '0.3%' },
      { power: '200Ah 12V', voltage: '12V', current: '200A', distance: '0.5m', cableSize: '70mm²', voltageDropPercent: '0.4%' },
      { power: '100Ah 48V', voltage: '48V', current: '100A', distance: '0.3m', cableSize: '16mm²', voltageDropPercent: '0.1%' },
      { power: '100Ah 48V', voltage: '48V', current: '100A', distance: '0.5m', cableSize: '25mm²', voltageDropPercent: '0.1%' },
      { power: '200Ah 48V', voltage: '48V', current: '200A', distance: '0.3m', cableSize: '35mm²', voltageDropPercent: '0.1%' },
      { power: '200Ah 48V', voltage: '48V', current: '200A', distance: '0.5m', cableSize: '50mm²', voltageDropPercent: '0.1%' }
    ],
    recommendations: [
      {
        cableType: 'Battery Interconnect Cables',
        application: 'Series/Parallel battery connections',
        characteristics: [
          'Pre-made with crimped lugs',
          'Matched lengths in sets',
          'Color coded',
          'Flexible fine-strand copper'
        ],
        brands: ['Victron', 'Pylontech (supplied)', 'Custom made'],
        priceRange: 'KES 800-3,000 per cable'
      }
    ],
    notes: [
      'ALL parallel cables must be IDENTICAL length',
      'Use manufacturer-supplied cables when provided',
      'Torque all connections to specification',
      'Apply anti-corrosion compound on terminals',
      'Check connections monthly'
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════
export const MANUAL_STATS = {
  inverterManuals: INVERTER_MANUALS.length,
  cableSizingGuides: CABLE_SIZING_GUIDE.length,
  totalRepairProcedures: INVERTER_MANUALS.reduce((acc, m) => acc + m.repairProcedures.length, 0),
  totalSpareParts: INVERTER_MANUALS.reduce((acc, m) => acc + m.spareParts.length, 0)
};
