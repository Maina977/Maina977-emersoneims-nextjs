/**
 * COMPREHENSIVE GENERATOR CONTROLLER SCHEMATICS DATABASE
 *
 * Complete wiring diagrams, pin configurations, and repair guides for:
 * - DeepSea Electronics (DSE)
 * - ComAp
 * - Woodward
 * - SmartGen
 * - Datakom
 * - Lovato
 * - Siemens
 * - Caterpillar EMCP
 * - Cummins PowerCommand
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface WireConnection {
  id: string;
  fromTerminal: string;
  toComponent: string;
  toTerminal: string;
  wireColor: string;
  wireGauge: string;
  function: string;
  voltage?: string;
  current?: string;
}

export interface ControllerTerminal {
  id: string;
  name: string;
  type: 'input' | 'output' | 'power' | 'communication' | 'ground';
  pinNumber: string;
  function: string;
  voltage?: string;
  current?: string;
  connections: WireConnection[];
}

export interface ControllerSchematic {
  id: string;
  manufacturer: string;
  model: string;
  fullName: string;
  image: string;
  description: string;
  applications: string[];
  features: string[];
  specifications: {
    supplyVoltage: string;
    operatingTemp: string;
    displayType: string;
    communication: string[];
    inputs: number;
    outputs: number;
    dimensions: string;
    weight: string;
  };
  terminals: ControllerTerminal[];
  wiringDiagram: WiringDiagram;
  faultCodes: string[];
  troubleshooting: TroubleshootingGuide[];
  installationGuide: InstallationStep[];
  maintenanceGuide: MaintenanceTask[];
  repairGuide: RepairProcedure[];
  price: { min: number; max: number };
  spareParts: SparePart[];
}

export interface WiringDiagram {
  svgPath: string;
  layers: SchematicLayer[];
  connections: DiagramConnection[];
  components: DiagramComponent[];
}

export interface SchematicLayer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

export interface DiagramConnection {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  wireColor: string;
  label: string;
  type: 'power' | 'signal' | 'ground' | 'communication';
}

export interface DiagramComponent {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  type: string;
  terminals: string[];
}

export interface TroubleshootingGuide {
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  solution: string;
  tools: string[];
  time: string;
}

export interface InstallationStep {
  step: number;
  title: string;
  description: string;
  warnings: string[];
  tips: string[];
  image?: string;
}

export interface MaintenanceTask {
  task: string;
  interval: string;
  procedure: string[];
  tools: string[];
  parts?: string[];
}

export interface RepairProcedure {
  issue: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced' | 'Expert';
  tools: string[];
  parts: string[];
  steps: string[];
  testProcedure: string[];
  safetyWarnings: string[];
  estimatedTime: string;
  estimatedCost: string;
}

export interface SparePart {
  partNumber: string;
  name: string;
  price: { min: number; max: number };
  availability: 'In Stock' | 'Order' | 'Discontinued';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEEPSEA ELECTRONICS CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

export const DSE_CONTROLLERS: ControllerSchematic[] = [
  {
    id: 'dse-4520',
    manufacturer: 'DeepSea Electronics',
    model: 'DSE4520',
    fullName: 'DSE4520 Auto Mains Failure Controller',
    image: '/images/controllers/dse4520.jpg',
    description: 'Entry-level automatic mains failure (AMF) controller for single generator applications. Features automatic start/stop on mains failure with comprehensive engine protection.',
    applications: ['Standby generators', 'Small commercial', 'Residential backup'],
    features: [
      'Automatic mains failure operation',
      'LCD display with backlight',
      'Engine protection (low oil pressure, high temperature)',
      'Configurable via front panel',
      'Remote start capability',
      'Event logging (50 events)'
    ],
    specifications: {
      supplyVoltage: '8-35V DC',
      operatingTemp: '-30°C to +70°C',
      displayType: 'LCD with LED indicators',
      communication: ['RS232', 'RS485'],
      inputs: 8,
      outputs: 6,
      dimensions: '240mm x 181mm x 54mm',
      weight: '0.8kg'
    },
    terminals: [
      {
        id: 'dse4520-b+',
        name: 'B+ (Battery Positive)',
        type: 'power',
        pinNumber: 'A1',
        function: 'Main DC power supply from battery',
        voltage: '8-35V DC',
        current: '100mA typical, 500mA max',
        connections: [
          { id: 'b+1', fromTerminal: 'A1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '2.5mm²', function: 'Power supply', voltage: '12/24V DC', current: '500mA' }
        ]
      },
      {
        id: 'dse4520-b-',
        name: 'B- (Battery Negative)',
        type: 'ground',
        pinNumber: 'A2',
        function: 'DC ground reference',
        voltage: '0V',
        connections: [
          { id: 'b-1', fromTerminal: 'A2', toComponent: 'Battery', toTerminal: '-', wireColor: 'Black', wireGauge: '2.5mm²', function: 'Ground', voltage: '0V' }
        ]
      },
      {
        id: 'dse4520-start',
        name: 'Start Output',
        type: 'output',
        pinNumber: 'B1',
        function: 'Cranking signal to starter motor relay',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'start1', fromTerminal: 'B1', toComponent: 'Starter Relay', toTerminal: 'Coil+', wireColor: 'Yellow', wireGauge: '1.5mm²', function: 'Crank signal' }
        ]
      },
      {
        id: 'dse4520-fuel',
        name: 'Fuel Solenoid',
        type: 'output',
        pinNumber: 'B2',
        function: 'Fuel solenoid/run relay control',
        voltage: 'Battery voltage',
        current: '3A max',
        connections: [
          { id: 'fuel1', fromTerminal: 'B2', toComponent: 'Fuel Solenoid', toTerminal: 'Coil', wireColor: 'Orange', wireGauge: '1.5mm²', function: 'Run control' }
        ]
      },
      {
        id: 'dse4520-oilp',
        name: 'Oil Pressure Input',
        type: 'input',
        pinNumber: 'C1',
        function: 'Engine oil pressure sensor input',
        voltage: '0-5V or sender',
        connections: [
          { id: 'oilp1', fromTerminal: 'C1', toComponent: 'Oil Pressure Sender', toTerminal: 'Signal', wireColor: 'Pink', wireGauge: '0.75mm²', function: 'Oil pressure signal' }
        ]
      },
      {
        id: 'dse4520-temp',
        name: 'Coolant Temperature',
        type: 'input',
        pinNumber: 'C2',
        function: 'Engine temperature sensor input',
        voltage: 'Resistance input',
        connections: [
          { id: 'temp1', fromTerminal: 'C2', toComponent: 'Temperature Sender', toTerminal: 'Signal', wireColor: 'Green', wireGauge: '0.75mm²', function: 'Temperature signal' }
        ]
      },
      {
        id: 'dse4520-mpu',
        name: 'MPU / Speed Sensor',
        type: 'input',
        pinNumber: 'C3',
        function: 'Magnetic pickup for engine speed',
        voltage: 'AC signal',
        connections: [
          { id: 'mpu1', fromTerminal: 'C3', toComponent: 'Magnetic Pickup', toTerminal: 'Signal', wireColor: 'White', wireGauge: '0.75mm²', function: 'Speed signal' }
        ]
      },
      {
        id: 'dse4520-mains-l1',
        name: 'Mains L1',
        type: 'input',
        pinNumber: 'D1',
        function: 'Mains voltage sensing - Phase L1',
        voltage: '0-300V AC',
        connections: [
          { id: 'mainsl1', fromTerminal: 'D1', toComponent: 'Mains MCB', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Mains sensing' }
        ]
      },
      {
        id: 'dse4520-gen-l1',
        name: 'Generator L1',
        type: 'input',
        pinNumber: 'E1',
        function: 'Generator voltage sensing - Phase L1',
        voltage: '0-300V AC',
        connections: [
          { id: 'genl1', fromTerminal: 'E1', toComponent: 'Generator MCB', toTerminal: 'L1', wireColor: 'Brown', wireGauge: '1.5mm²', function: 'Generator sensing' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/dse4520-wiring.svg',
      layers: [
        { id: 'power', name: 'Power Circuits', color: '#EF4444', visible: true },
        { id: 'control', name: 'Control Signals', color: '#3B82F6', visible: true },
        { id: 'sensing', name: 'Sensing Inputs', color: '#10B981', visible: true },
        { id: 'output', name: 'Output Relays', color: '#F59E0B', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 50, y: 100 }, to: { x: 150, y: 100 }, wireColor: 'red', label: 'B+ Supply', type: 'power' },
        { id: 'w2', from: { x: 50, y: 120 }, to: { x: 150, y: 120 }, wireColor: 'black', label: 'Ground', type: 'ground' },
        { id: 'w3', from: { x: 250, y: 80 }, to: { x: 350, y: 80 }, wireColor: 'yellow', label: 'Start Signal', type: 'signal' },
        { id: 'w4', from: { x: 250, y: 100 }, to: { x: 350, y: 100 }, wireColor: 'orange', label: 'Fuel Solenoid', type: 'signal' }
      ],
      components: [
        { id: 'battery', name: 'Battery', position: { x: 20, y: 90 }, size: { width: 30, height: 40 }, type: 'battery', terminals: ['B+', 'B-'] },
        { id: 'controller', name: 'DSE4520', position: { x: 150, y: 50 }, size: { width: 100, height: 120 }, type: 'controller', terminals: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'C3', 'D1', 'E1'] },
        { id: 'starter', name: 'Starter Relay', position: { x: 350, y: 70 }, size: { width: 40, height: 30 }, type: 'relay', terminals: ['Coil+', 'Coil-', 'NO', 'COM'] },
        { id: 'fuel', name: 'Fuel Solenoid', position: { x: 350, y: 110 }, size: { width: 40, height: 30 }, type: 'solenoid', terminals: ['Coil', 'COM'] }
      ]
    },
    faultCodes: ['DSE-1411', 'DSE-1412', 'DSE-2151', 'DSE-2152', 'DSE-3111', 'DSE-4111', 'DSE-4112'],
    troubleshooting: [
      {
        symptom: 'Controller display blank - no power',
        possibleCauses: [
          'Battery disconnected or dead',
          'Blown fuse in B+ supply',
          'Damaged wiring to controller',
          'Internal controller fault'
        ],
        diagnosticSteps: [
          'Check battery voltage with multimeter (should be 12V or 24V)',
          'Verify fuse in B+ line is intact',
          'Check voltage at controller terminals A1 and A2',
          'Inspect wiring for damage or loose connections'
        ],
        solution: 'Replace fuse, repair wiring, or replace controller if internal fault confirmed',
        tools: ['Multimeter', 'Fuse tester', 'Wire strippers'],
        time: '30 minutes - 2 hours'
      },
      {
        symptom: 'Engine cranks but does not start',
        possibleCauses: [
          'Fuel solenoid not energizing',
          'Low fuel / air in fuel system',
          'Faulty fuel solenoid wiring',
          'Controller output failure'
        ],
        diagnosticSteps: [
          'Listen for fuel solenoid click during start attempt',
          'Check voltage at fuel solenoid terminal during crank',
          'Verify fuel level and bleed fuel system',
          'Test fuel solenoid coil resistance (typically 10-50 ohms)'
        ],
        solution: 'Repair wiring, replace fuel solenoid, or bleed fuel system',
        tools: ['Multimeter', 'Fuel bleeding kit', 'Test light'],
        time: '30 minutes - 3 hours'
      },
      {
        symptom: 'Generator starts but trips on overspeed',
        possibleCauses: [
          'MPU pickup gap too wide',
          'Governor malfunction',
          'Incorrect MPU wiring',
          'Wrong number of flywheel teeth configured'
        ],
        diagnosticSteps: [
          'Check MPU gap (typically 0.5-1.0mm)',
          'Verify MPU signal on oscilloscope',
          'Check flywheel teeth count in controller settings',
          'Test governor actuator response'
        ],
        solution: 'Adjust MPU gap, configure correct teeth count, or repair governor',
        tools: ['Feeler gauge', 'Oscilloscope', 'Programming interface'],
        time: '1-4 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Mount the Controller',
        description: 'Mount DSE4520 on control panel using four M4 screws. Ensure adequate ventilation around the unit.',
        warnings: ['Ensure power is disconnected before mounting', 'Do not over-tighten mounting screws'],
        tips: ['Use rubber grommets to reduce vibration', 'Leave 50mm clearance for wiring']
      },
      {
        step: 2,
        title: 'Connect DC Power Supply',
        description: 'Connect B+ (terminal A1) to battery positive through a 5A fuse. Connect B- (terminal A2) to battery negative.',
        warnings: ['Observe correct polarity - reverse polarity will damage the controller', 'Use appropriate fuse rating'],
        tips: ['Use crimped ring terminals for secure connections', 'Route power cables away from signal wires']
      },
      {
        step: 3,
        title: 'Connect Engine Sensors',
        description: 'Wire oil pressure sender to C1, temperature sender to C2, and magnetic pickup to C3.',
        warnings: ['Ensure sensors are compatible with controller input ranges'],
        tips: ['Use shielded cable for MPU signal', 'Ground shield at controller end only']
      },
      {
        step: 4,
        title: 'Connect Mains and Generator Sensing',
        description: 'Wire mains voltage sensing to D terminals and generator voltage sensing to E terminals.',
        warnings: ['High voltage - ensure proper isolation and safety procedures', 'Use voltage-rated connectors'],
        tips: ['Install voltage sensing through MCB for isolation', 'Verify phase rotation']
      },
      {
        step: 5,
        title: 'Connect Output Relays',
        description: 'Wire start output (B1) to starter relay, fuel solenoid output (B2) to run relay.',
        warnings: ['Use relay for loads exceeding 3A'],
        tips: ['Add flyback diodes across relay coils', 'Use relay sockets for easy replacement']
      },
      {
        step: 6,
        title: 'Configure Controller Settings',
        description: 'Program engine parameters, protection settings, and timers using front panel or PC software.',
        warnings: ['Record all settings before making changes'],
        tips: ['Start with factory defaults and adjust as needed', 'Test all protections before commissioning']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Visual Inspection',
        interval: 'Monthly',
        procedure: ['Check for loose connections', 'Inspect for corrosion or damage', 'Verify LED indicators are functional', 'Clean display screen'],
        tools: ['Inspection mirror', 'Flashlight']
      },
      {
        task: 'Terminal Tightness Check',
        interval: 'Every 6 months',
        procedure: ['Power down system', 'Check all terminal screws for tightness', 'Re-torque to specification', 'Check wire insulation condition'],
        tools: ['Screwdriver set', 'Torque screwdriver']
      },
      {
        task: 'Functional Test',
        interval: 'Monthly',
        procedure: ['Initiate manual start test', 'Verify all readings are accurate', 'Test auto start on mains fail simulation', 'Check alarm functions'],
        tools: ['Test equipment', 'Mains simulator']
      },
      {
        task: 'Firmware Update Check',
        interval: 'Annually',
        procedure: ['Connect to PC software', 'Check current firmware version', 'Download and install updates if available', 'Verify settings after update'],
        tools: ['PC with DSE software', 'USB cable']
      }
    ],
    repairGuide: [
      {
        issue: 'Damaged display screen',
        difficulty: 'Medium',
        tools: ['Screwdriver set', 'Anti-static wrist strap', 'Soldering iron'],
        parts: ['Display module DSE4520-DISP'],
        steps: [
          'Disconnect all power to the controller',
          'Remove the front panel screws',
          'Carefully disconnect the display ribbon cable',
          'Remove damaged display module',
          'Install new display module',
          'Reconnect ribbon cable',
          'Reassemble front panel',
          'Test display operation'
        ],
        testProcedure: ['Power on and verify all segments display', 'Check backlight operation', 'Test button response'],
        safetyWarnings: ['Work in ESD-safe environment', 'Do not touch PCB components with bare hands'],
        estimatedTime: '1-2 hours',
        estimatedCost: 'KES 15,000 - 25,000'
      },
      {
        issue: 'Failed output relay',
        difficulty: 'Advanced',
        tools: ['Soldering station', 'Desoldering pump', 'Multimeter', 'Magnifying glass'],
        parts: ['Relay 12V/24V 10A', 'Solder', 'Flux'],
        steps: [
          'Identify the failed output by testing relay coil resistance',
          'Disconnect all power',
          'Remove controller from panel',
          'Open controller enclosure',
          'Locate the failed relay on PCB',
          'Desolder the relay carefully',
          'Clean pads with solder wick',
          'Solder new relay in place',
          'Inspect solder joints',
          'Reassemble and test'
        ],
        testProcedure: ['Test relay coil resistance', 'Test contact continuity when energized', 'Load test output'],
        safetyWarnings: ['Component level repair may void warranty', 'Use correct relay rating', 'Avoid PCB damage'],
        estimatedTime: '2-4 hours',
        estimatedCost: 'KES 5,000 - 10,000 (parts) + labor'
      }
    ],
    price: { min: 45000, max: 65000 },
    spareParts: [
      { partNumber: 'DSE4520-DISP', name: 'Display Module', price: { min: 12000, max: 18000 }, availability: 'In Stock' },
      { partNumber: 'DSE4520-KB', name: 'Keypad Membrane', price: { min: 5000, max: 8000 }, availability: 'In Stock' },
      { partNumber: 'DSE4520-PWR', name: 'Power Supply Board', price: { min: 15000, max: 22000 }, availability: 'Order' },
      { partNumber: 'DSE4520-CONN', name: 'Connector Kit', price: { min: 3000, max: 5000 }, availability: 'In Stock' }
    ]
  },
  {
    id: 'dse-7320',
    manufacturer: 'DeepSea Electronics',
    model: 'DSE7320',
    fullName: 'DSE7320 Auto Mains Failure Controller',
    image: '/images/controllers/dse7320.jpg',
    description: 'Advanced auto mains failure controller with comprehensive protection, synchronizing capability, and remote monitoring via Ethernet/GSM.',
    applications: ['Commercial standby', 'Industrial backup', 'Data centers', 'Hospitals', 'Critical infrastructure'],
    features: [
      'Full color TFT display',
      'Automatic mains failure with synchronizing',
      'Comprehensive engine and alternator protection',
      'Ethernet and GPRS/GSM connectivity',
      'MODBUS, SNMP, and HTTP protocols',
      'Event logging (200+ events)',
      'Password protection',
      'Automatic load shedding',
      'Parallel operation capability',
      'J1939 CAN bus for engine communication'
    ],
    specifications: {
      supplyVoltage: '8-35V DC',
      operatingTemp: '-30°C to +70°C',
      displayType: '4.3" Color TFT LCD',
      communication: ['Ethernet', 'RS232', 'RS485', 'CAN J1939', 'USB'],
      inputs: 16,
      outputs: 10,
      dimensions: '240mm x 181mm x 54mm',
      weight: '1.1kg'
    },
    terminals: [
      {
        id: 'dse7320-b+',
        name: 'B+ (Battery Positive)',
        type: 'power',
        pinNumber: 'A1',
        function: 'Main DC power supply',
        voltage: '8-35V DC',
        current: '200mA typical, 1A max',
        connections: [
          { id: 'b+1', fromTerminal: 'A1', toComponent: 'Battery', toTerminal: '+', wireColor: 'Red', wireGauge: '4mm²', function: 'Power supply', voltage: '24V DC', current: '1A' }
        ]
      },
      {
        id: 'dse7320-b-',
        name: 'B- (Battery Negative)',
        type: 'ground',
        pinNumber: 'A2',
        function: 'DC ground reference',
        voltage: '0V',
        connections: [
          { id: 'b-1', fromTerminal: 'A2', toComponent: 'Battery', toTerminal: '-', wireColor: 'Black', wireGauge: '4mm²', function: 'Ground' }
        ]
      },
      {
        id: 'dse7320-can-h',
        name: 'CAN High',
        type: 'communication',
        pinNumber: 'J1',
        function: 'J1939 CAN bus high signal',
        voltage: '2.5-3.5V differential',
        connections: [
          { id: 'canh1', fromTerminal: 'J1', toComponent: 'ECM', toTerminal: 'CAN-H', wireColor: 'Yellow', wireGauge: '0.75mm²', function: 'CAN communication' }
        ]
      },
      {
        id: 'dse7320-can-l',
        name: 'CAN Low',
        type: 'communication',
        pinNumber: 'J2',
        function: 'J1939 CAN bus low signal',
        voltage: '1.5-2.5V differential',
        connections: [
          { id: 'canl1', fromTerminal: 'J2', toComponent: 'ECM', toTerminal: 'CAN-L', wireColor: 'Green', wireGauge: '0.75mm²', function: 'CAN communication' }
        ]
      },
      {
        id: 'dse7320-gen-ct',
        name: 'Generator CT Input',
        type: 'input',
        pinNumber: 'CT1',
        function: 'Current transformer input for power metering',
        current: '5A nominal',
        connections: [
          { id: 'ct1', fromTerminal: 'CT1', toComponent: 'CT L1', toTerminal: 'S1/S2', wireColor: 'Blue', wireGauge: '2.5mm²', function: 'Current sensing' }
        ]
      },
      {
        id: 'dse7320-eth',
        name: 'Ethernet',
        type: 'communication',
        pinNumber: 'ETH',
        function: 'Network connectivity for remote monitoring',
        connections: [
          { id: 'eth1', fromTerminal: 'ETH', toComponent: 'Network Switch', toTerminal: 'Port', wireColor: 'CAT5e', wireGauge: 'CAT5e', function: 'Network data' }
        ]
      }
    ],
    wiringDiagram: {
      svgPath: '/schematics/dse7320-wiring.svg',
      layers: [
        { id: 'power', name: 'Power Circuits', color: '#EF4444', visible: true },
        { id: 'control', name: 'Control Signals', color: '#3B82F6', visible: true },
        { id: 'sensing', name: 'Sensing Inputs', color: '#10B981', visible: true },
        { id: 'output', name: 'Output Relays', color: '#F59E0B', visible: true },
        { id: 'can', name: 'CAN Bus', color: '#8B5CF6', visible: true },
        { id: 'network', name: 'Network', color: '#EC4899', visible: true }
      ],
      connections: [
        { id: 'w1', from: { x: 30, y: 150 }, to: { x: 130, y: 150 }, wireColor: 'red', label: 'B+ 24VDC', type: 'power' },
        { id: 'w2', from: { x: 30, y: 170 }, to: { x: 130, y: 170 }, wireColor: 'black', label: 'Ground', type: 'ground' },
        { id: 'w3', from: { x: 230, y: 50 }, to: { x: 330, y: 50 }, wireColor: 'yellow', label: 'CAN-H', type: 'communication' },
        { id: 'w4', from: { x: 230, y: 70 }, to: { x: 330, y: 70 }, wireColor: 'green', label: 'CAN-L', type: 'communication' },
        { id: 'w5', from: { x: 230, y: 100 }, to: { x: 400, y: 100 }, wireColor: 'yellow', label: 'Start Output', type: 'signal' },
        { id: 'w6', from: { x: 230, y: 120 }, to: { x: 400, y: 120 }, wireColor: 'orange', label: 'Fuel Output', type: 'signal' },
        { id: 'w7', from: { x: 230, y: 200 }, to: { x: 400, y: 200 }, wireColor: 'blue', label: 'GCB Close', type: 'signal' },
        { id: 'w8', from: { x: 230, y: 220 }, to: { x: 400, y: 220 }, wireColor: 'purple', label: 'MCB Close', type: 'signal' }
      ],
      components: [
        { id: 'battery', name: '24V Battery', position: { x: 10, y: 140 }, size: { width: 40, height: 50 }, type: 'battery', terminals: ['B+', 'B-'] },
        { id: 'controller', name: 'DSE7320', position: { x: 130, y: 30 }, size: { width: 100, height: 200 }, type: 'controller', terminals: ['A1', 'A2', 'J1', 'J2', 'B1', 'B2', 'D1', 'D2'] },
        { id: 'ecm', name: 'Engine ECM', position: { x: 330, y: 30 }, size: { width: 70, height: 60 }, type: 'ecm', terminals: ['CAN-H', 'CAN-L', 'Power', 'Ground'] },
        { id: 'gcb', name: 'GCB', position: { x: 400, y: 180 }, size: { width: 50, height: 60 }, type: 'breaker', terminals: ['Coil', 'Aux'] },
        { id: 'mcb', name: 'MCB', position: { x: 400, y: 260 }, size: { width: 50, height: 60 }, type: 'breaker', terminals: ['Coil', 'Aux'] }
      ]
    },
    faultCodes: ['DSE-1411', 'DSE-1412', 'DSE-2151', 'DSE-2152', 'DSE-2153', 'DSE-3111', 'DSE-3112', 'DSE-3141', 'DSE-3142', 'DSE-4111', 'DSE-4112', 'DSE-4211', 'DSE-4212'],
    troubleshooting: [
      {
        symptom: 'No CAN communication with ECM',
        possibleCauses: [
          'Incorrect CAN wiring or termination',
          'CAN baud rate mismatch',
          'ECM address conflict',
          'Damaged CAN transceiver'
        ],
        diagnosticSteps: [
          'Verify CAN-H and CAN-L wiring (not crossed)',
          'Check 120 ohm termination resistor at each end of bus',
          'Measure CAN bus resistance (should be 60 ohms between H and L)',
          'Verify J1939 source address settings match ECM',
          'Check CAN baud rate (usually 250kbps for J1939)'
        ],
        solution: 'Correct wiring, add termination, or configure matching addresses',
        tools: ['Multimeter', 'CAN bus analyzer', 'Oscilloscope'],
        time: '1-4 hours'
      },
      {
        symptom: 'Generator breaker fails to close',
        possibleCauses: [
          'Voltage/frequency out of range',
          'Breaker coil failure',
          'Output relay failure in controller',
          'Protection lockout active'
        ],
        diagnosticSteps: [
          'Check generator voltage and frequency readings',
          'Verify no active alarms preventing close',
          'Test output relay with multimeter',
          'Measure voltage at breaker coil during close command',
          'Test breaker operation manually'
        ],
        solution: 'Adjust voltage/frequency, repair wiring, or replace breaker',
        tools: ['Multimeter', 'Test leads', 'Breaker tester'],
        time: '1-3 hours'
      }
    ],
    installationGuide: [
      {
        step: 1,
        title: 'Panel Preparation',
        description: 'Cut 220mm x 160mm aperture in panel door. Ensure proper grounding of panel enclosure.',
        warnings: ['Wear appropriate PPE when cutting metal', 'De-burr all cut edges'],
        tips: ['Use template provided with controller', 'Allow space for cable entry']
      },
      {
        step: 2,
        title: 'Controller Mounting',
        description: 'Insert controller from front of panel. Secure with four mounting clips from behind.',
        warnings: ['Do not over-tighten clips'],
        tips: ['Ensure gasket is properly seated for IP65 rating']
      },
      {
        step: 3,
        title: 'DC Power Connection',
        description: 'Connect 24VDC supply to A1 (+) and A2 (-) through 10A fuse.',
        warnings: ['Verify polarity before connecting', 'Use appropriate wire gauge for cable length'],
        tips: ['Install main isolator for service disconnection']
      },
      {
        step: 4,
        title: 'CAN Bus Wiring',
        description: 'Connect CAN-H to J1 and CAN-L to J2. Use twisted pair shielded cable.',
        warnings: ['Install 120 ohm termination at last device', 'Do not exceed 40m total bus length'],
        tips: ['Use dedicated CAN cable, not standard wire', 'Ground shield at one end only']
      },
      {
        step: 5,
        title: 'CT and PT Connections',
        description: 'Wire current transformers to CT inputs, voltage sensing to PT inputs.',
        warnings: ['Never open-circuit a CT secondary while primary is energized'],
        tips: ['Verify CT ratio matches controller configuration', 'Use correct polarity marking']
      },
      {
        step: 6,
        title: 'Network Configuration',
        description: 'Connect Ethernet cable. Configure IP address via front panel or DHCP.',
        warnings: ['Use quality CAT5e or CAT6 cable', 'Ensure network security'],
        tips: ['Document IP address for remote access', 'Configure firewall rules']
      }
    ],
    maintenanceGuide: [
      {
        task: 'Display and Indicator Check',
        interval: 'Weekly',
        procedure: ['Verify all display segments visible', 'Check LED indicators', 'Test alarm horn/buzzer', 'Verify readings match external meters'],
        tools: ['None required']
      },
      {
        task: 'Connection Inspection',
        interval: 'Monthly',
        procedure: ['Check terminal tightness', 'Inspect for corrosion', 'Verify cable gland seals', 'Check ventilation openings'],
        tools: ['Screwdriver set', 'Inspection mirror']
      },
      {
        task: 'Communication Test',
        interval: 'Monthly',
        procedure: ['Verify CAN communication active', 'Test Ethernet connectivity', 'Check remote monitoring access', 'Verify SNMP responses'],
        tools: ['Laptop', 'Network cable', 'DSE software']
      },
      {
        task: 'Protection Testing',
        interval: 'Quarterly',
        procedure: ['Test emergency stop function', 'Simulate low oil pressure alarm', 'Test high temperature shutdown', 'Verify overcurrent protection'],
        tools: ['Test equipment', 'Simulation kit'],
        parts: ['None typically required']
      },
      {
        task: 'Firmware Update',
        interval: 'Annually or as released',
        procedure: ['Backup current configuration', 'Download latest firmware', 'Install via USB or Ethernet', 'Verify operation after update'],
        tools: ['USB drive', 'PC with DSE software']
      }
    ],
    repairGuide: [
      {
        issue: 'TFT Display failure',
        difficulty: 'Medium',
        tools: ['Torx screwdriver', 'Anti-static wrist strap', 'Isopropyl alcohol'],
        parts: ['DSE7320 Display Assembly'],
        steps: [
          'Power down and isolate the controller',
          'Remove four corner screws from front bezel',
          'Carefully separate front assembly from main unit',
          'Disconnect display ribbon cable',
          'Remove failed display module',
          'Clean connector contacts with isopropyl',
          'Install new display assembly',
          'Reconnect ribbon cable - ensure proper seating',
          'Reassemble front bezel',
          'Power on and calibrate touchscreen if applicable'
        ],
        testProcedure: ['Verify all display areas functional', 'Test touch response if equipped', 'Check backlight brightness levels'],
        safetyWarnings: ['ESD sensitive components', 'Handle display carefully to avoid damage'],
        estimatedTime: '1-2 hours',
        estimatedCost: 'KES 35,000 - 55,000'
      },
      {
        issue: 'Ethernet port not working',
        difficulty: 'Advanced',
        tools: ['Soldering station', 'Hot air rework', 'Magnifying lamp', 'ESD mat'],
        parts: ['RJ45 connector', 'Ethernet PHY IC (if required)'],
        steps: [
          'Test port with known good cable and network',
          'Check for physical damage to RJ45 connector',
          'Open controller enclosure',
          'Inspect PCB for damaged traces or components',
          'If connector damaged, desolder and replace',
          'If PHY IC failed, this requires specialist repair',
          'Reassemble and test with network analyzer'
        ],
        testProcedure: ['Link light active', 'Ping response successful', 'Web interface accessible'],
        safetyWarnings: ['PCB repair requires expertise', 'May void warranty'],
        estimatedTime: '2-4 hours',
        estimatedCost: 'KES 10,000 - 30,000'
      }
    ],
    price: { min: 120000, max: 180000 },
    spareParts: [
      { partNumber: 'DSE7320-DISP', name: 'Display Assembly', price: { min: 35000, max: 50000 }, availability: 'In Stock' },
      { partNumber: 'DSE7320-MB', name: 'Main Board', price: { min: 65000, max: 95000 }, availability: 'Order' },
      { partNumber: 'DSE7320-PSU', name: 'Power Supply Module', price: { min: 18000, max: 28000 }, availability: 'In Stock' },
      { partNumber: 'DSE7320-CONN', name: 'Complete Connector Set', price: { min: 8000, max: 12000 }, availability: 'In Stock' },
      { partNumber: 'DSE7320-BEZEL', name: 'Front Bezel/Keypad', price: { min: 12000, max: 18000 }, availability: 'In Stock' }
    ]
  }
];

// Export all controllers
export * from './comap-controllers';
export * from './woodward-controllers';
export * from './smartgen-controllers';
export * from './datakom-controllers';

// Get controller by ID
export function getControllerById(id: string): ControllerSchematic | undefined {
  return DSE_CONTROLLERS.find(c => c.id === id);
}

// Get all controllers by manufacturer
export function getControllersByManufacturer(manufacturer: string): ControllerSchematic[] {
  return DSE_CONTROLLERS.filter(c => c.manufacturer.toLowerCase().includes(manufacturer.toLowerCase()));
}

// Search controllers
export function searchControllers(query: string): ControllerSchematic[] {
  const q = query.toLowerCase();
  return DSE_CONTROLLERS.filter(c =>
    c.model.toLowerCase().includes(q) ||
    c.fullName.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.applications.some(a => a.toLowerCase().includes(q))
  );
}
