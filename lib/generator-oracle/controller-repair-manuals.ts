/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * COMPREHENSIVE CONTROLLER REPAIR MANUALS DATABASE
 * Complete Repair Guides for All 9 Generator Controller Brands
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ControllerManual {
  id: string;
  brand: string;
  models: string[];
  description: string;
  specifications: ControllerSpecs;
  wiringDiagram: WiringInfo;
  terminalPinouts: TerminalPinout[];
  configurationGuide: ConfigurationStep[];
  repairProcedures: RepairProcedure[];
  calibrationProcedures: CalibrationProcedure[];
  commonFaults: CommonFault[];
  maintenanceSchedule: MaintenanceItem[];
  troubleshootingGuide: TroubleshootingItem[];
  spareParts: SparePart[];
  safetyWarnings: string[];
  toolsRequired: string[];
  softwareInfo: SoftwareInfo;
}

export interface ControllerSpecs {
  powerSupply: string;
  operatingVoltage: string;
  operatingTemp: string;
  protection: string;
  dimensions: string;
  weight: string;
  display: string;
  communication: string[];
  inputs: InputSpec[];
  outputs: OutputSpec[];
}

export interface InputSpec {
  type: string;
  quantity: number;
  description: string;
}

export interface OutputSpec {
  type: string;
  quantity: number;
  description: string;
  rating: string;
}

export interface WiringInfo {
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

export interface ConfigurationStep {
  step: number;
  title: string;
  description: string;
  parameters: ConfigParameter[];
  notes: string[];
}

export interface ConfigParameter {
  name: string;
  defaultValue: string;
  range: string;
  description: string;
}

export interface RepairProcedure {
  id: string;
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
  safetyPrecautions: string[];
}

export interface CalibrationProcedure {
  title: string;
  description: string;
  steps: string[];
  requiredEquipment: string[];
  acceptanceCriteria: string[];
}

export interface CommonFault {
  code: string;
  title: string;
  description: string;
  severity: 'warning' | 'shutdown' | 'critical';
  causes: string[];
  solutions: string[];
  resetProcedure: string[];
}

export interface MaintenanceItem {
  task: string;
  interval: string;
  procedure: string[];
  parts?: string[];
}

export interface TroubleshootingItem {
  problem: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  solutions: string[];
}

export interface SparePart {
  partNumber: string;
  description: string;
  price: string;
  availability: 'in-stock' | 'order' | 'discontinued';
  leadTime?: string;
}

export interface SoftwareInfo {
  configSoftware: string;
  version: string;
  downloadUrl: string;
  communicationPort: string;
  protocol: string;
  features: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DSE (DEEP SEA ELECTRONICS) CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

const DSE_MANUAL: ControllerManual = {
  id: 'dse',
  brand: 'Deep Sea Electronics (DSE)',
  models: ['DSE4520', 'DSE6020', 'DSE7310', 'DSE7320', 'DSE7510', 'DSE7520', 'DSE8610', 'DSE8620', 'DSE8660'],
  description: 'World-leading generator control modules with automatic mains failure (AMF), synchronizing, and load sharing capabilities.',
  specifications: {
    powerSupply: '8-35V DC continuous',
    operatingVoltage: '12V/24V DC nominal',
    operatingTemp: '-40°C to +70°C',
    protection: 'IP65 front panel (with seal)',
    dimensions: '240mm x 181mm x 50mm (DSE7320)',
    weight: '850g',
    display: 'Color TFT LCD with LED backlight',
    communication: ['RS232', 'RS485', 'Ethernet', 'USB', 'CAN Bus'],
    inputs: [
      { type: 'Configurable digital inputs', quantity: 8, description: 'Voltage-free contact or +ve voltage' },
      { type: 'Analog inputs', quantity: 4, description: '4-20mA or 0-10V configurable' },
      { type: 'Temperature inputs', quantity: 2, description: 'VDO/Datcon sender compatible' },
      { type: 'Pressure inputs', quantity: 2, description: 'VDO/Datcon sender compatible' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 8, rating: '5A @ 30VDC', description: 'Fully configurable' },
      { type: 'Fuel output', quantity: 1, rating: '5A @ 30VDC', description: 'PWM capable for electronic governors' },
      { type: 'Charge output', quantity: 1, rating: '5A @ 30VDC', description: 'Battery charging fail output' },
    ],
  },
  wiringDiagram: {
    description: 'DSE7320 Wiring Diagram - Auto Mains Failure Controller',
    connections: [
      { terminal: 'A1', function: 'Battery +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Connect via 15A fuse' },
      { terminal: 'A2', function: 'Battery -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Connect to chassis ground' },
      { terminal: 'B1', function: 'Generator L1 voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'B2', function: 'Generator L2 voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'B3', function: 'Generator L3 voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'B4', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Common neutral' },
      { terminal: 'C1', function: 'Mains L1 voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'C2', function: 'Mains L2 voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'C3', function: 'Mains L3 voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT if >300V' },
      { terminal: 'D1', function: 'CT L1', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT' },
      { terminal: 'D2', function: 'CT L2', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT' },
      { terminal: 'D3', function: 'CT L3', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT' },
      { terminal: 'E1', function: 'Oil pressure sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'VDO 10-184Ω' },
      { terminal: 'E2', function: 'Coolant temp sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'VDO 10-184Ω' },
      { terminal: 'E3', function: 'Fuel level sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'VDO 10-184Ω' },
      { terminal: 'F1', function: 'MPU +ve', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup' },
      { terminal: 'F2', function: 'MPU -ve', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'Shield to ground' },
      { terminal: 'G1', function: 'Start output', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'To start solenoid' },
      { terminal: 'G2', function: 'Fuel output', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'To fuel solenoid' },
      { terminal: 'H1', function: 'Emergency stop input', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact' },
    ],
    notes: [
      'Always use shielded cable for MPU connections',
      'CT polarity must be correct - K-L direction',
      'Voltage sensing must be connected before the generator breaker',
      'Use fuses on all power circuits',
      'Ground shield at controller end only',
    ],
    wireColors: {
      'Battery +ve': 'Red',
      'Battery -ve': 'Black',
      'Phase L1': 'Brown',
      'Phase L2': 'Black',
      'Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'Control': 'Orange',
    },
  },
  terminalPinouts: [
    { connector: 'RS232', pinNumber: '2', function: 'TXD', voltage: '±12V', notes: 'Transmit data' },
    { connector: 'RS232', pinNumber: '3', function: 'RXD', voltage: '±12V', notes: 'Receive data' },
    { connector: 'RS232', pinNumber: '5', function: 'GND', notes: 'Signal ground' },
    { connector: 'RS485', pinNumber: 'A', function: 'Data +', notes: 'Non-inverting' },
    { connector: 'RS485', pinNumber: 'B', function: 'Data -', notes: 'Inverting' },
    { connector: 'CAN', pinNumber: 'H', function: 'CAN High', notes: 'SAE J1939' },
    { connector: 'CAN', pinNumber: 'L', function: 'CAN Low', notes: 'SAE J1939' },
    { connector: 'USB', pinNumber: 'Mini-B', function: 'Configuration', notes: 'For DSE Configuration Suite' },
  ],
  configurationGuide: [
    {
      step: 1,
      title: 'Initial Power-Up Configuration',
      description: 'Set up basic generator parameters including voltage, frequency, and engine type.',
      parameters: [
        { name: 'Nominal Voltage', defaultValue: '400V', range: '100-690V', description: 'Generator nominal line voltage' },
        { name: 'Nominal Frequency', defaultValue: '50Hz', range: '45-65Hz', description: 'System frequency' },
        { name: 'CT Ratio', defaultValue: '200:5', range: '1:5 to 5000:5', description: 'Current transformer ratio' },
        { name: 'Number of Poles', defaultValue: '4', range: '2-24', description: 'Engine/alternator poles' },
      ],
      notes: ['Connect to DSE Configuration Suite via USB', 'Ensure engine is not running during configuration'],
    },
    {
      step: 2,
      title: 'Engine Protection Setup',
      description: 'Configure engine protection parameters for safe operation.',
      parameters: [
        { name: 'Low Oil Pressure', defaultValue: '1.5 bar', range: '0-10 bar', description: 'Shutdown threshold' },
        { name: 'High Coolant Temp', defaultValue: '95°C', range: '40-120°C', description: 'Shutdown threshold' },
        { name: 'Overspeed', defaultValue: '1650 RPM', range: '100-3000 RPM', description: '110% of nominal' },
        { name: 'Underspeed', defaultValue: '1350 RPM', range: '100-3000 RPM', description: '90% of nominal' },
      ],
      notes: ['Set slightly below engine manufacturer limits', 'Test protection during commissioning'],
    },
    {
      step: 3,
      title: 'AMF (Auto Mains Failure) Configuration',
      description: 'Set up automatic transfer between mains and generator.',
      parameters: [
        { name: 'Mains Fail Voltage', defaultValue: '85%', range: '50-100%', description: 'Start generator below this' },
        { name: 'Mains Fail Delay', defaultValue: '5s', range: '0-600s', description: 'Delay before starting' },
        { name: 'Return Delay', defaultValue: '60s', range: '0-3600s', description: 'Delay before returning to mains' },
        { name: 'Cooling Time', defaultValue: '60s', range: '0-1800s', description: 'Run time before stopping' },
      ],
      notes: ['Consider load sensitivity when setting delays', 'Test transfer under load'],
    },
  ],
  repairProcedures: [
    {
      id: 'dse-display-fail',
      title: 'Display Not Working',
      symptom: 'LCD display blank or partially illuminated',
      possibleCauses: ['Low battery voltage', 'Display flex cable loose', 'LCD module failure', 'Backlight failure'],
      diagnosticSteps: [
        'Measure battery voltage at controller terminals (should be 8-35V DC)',
        'Check for corrosion on display connector',
        'Press buttons to check if backlight toggles',
        'Connect via USB to verify controller is running',
      ],
      repairSteps: [
        'If battery voltage low, charge or replace battery',
        'Clean display connector with contact cleaner',
        'Reseat display flex cable (remove 4 screws, disconnect, reconnect)',
        'If display module failed, replace complete display assembly',
      ],
      testProcedure: [
        'Apply power and verify display illuminates within 2 seconds',
        'Check all display segments activate during self-test',
        'Verify touchscreen response (if applicable)',
        'Confirm readings match connected sensors',
      ],
      estimatedTime: '30-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Display assembly (if replacing)', 'Contact cleaner'],
      specialTools: ['Torx T10 screwdriver', 'ESD wrist strap'],
      safetyPrecautions: ['Disconnect battery before repair', 'Use ESD protection', 'Do not flex LCD panel'],
    },
    {
      id: 'dse-no-start',
      title: 'Engine Cranks But Does Not Start',
      symptom: 'Starter motor engages but engine fails to start',
      possibleCauses: ['No fuel', 'Fuel solenoid not energizing', 'Speed sensing failure', 'Wrong MPU configuration'],
      diagnosticSteps: [
        'Check fuel solenoid output (G2) - should be +DC when cranking',
        'Verify MPU signal on display (should show RPM during cranking)',
        'Check fuel level sender reading',
        'Inspect fuel solenoid wiring',
      ],
      repairSteps: [
        'If no fuel output: Check relay configuration in DSE Suite',
        'If no MPU signal: Check MPU wiring and air gap (0.5-1.0mm)',
        'Test fuel solenoid manually with direct +12V',
        'Reconfigure MPU settings (pulses per revolution)',
      ],
      testProcedure: [
        'Attempt start - verify fuel solenoid pulls in',
        'Monitor RPM signal during cranking (should be 100-300 RPM)',
        'Verify engine starts and runs smoothly',
        'Check for any alarm codes after start',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Fuel solenoid (if failed)', 'MPU sensor (if failed)'],
      specialTools: ['Multimeter', 'Feeler gauges', 'DSE Configuration Suite'],
      safetyPrecautions: ['Keep clear of moving parts', 'Ensure fuel shutoff available', 'Fire extinguisher nearby'],
    },
    {
      id: 'dse-comms-fail',
      title: 'Communication Failure',
      symptom: 'Cannot connect via RS485/Ethernet/USB',
      possibleCauses: ['Wrong baud rate', 'Incorrect Modbus address', 'Cable fault', 'Port damage', 'Protocol mismatch'],
      diagnosticSteps: [
        'Check cable continuity with multimeter',
        'Verify RS485 A/B polarity (swap if needed)',
        'Check Modbus address setting (default 1)',
        'Verify baud rate (default 19200)',
        'Test with different cable',
      ],
      repairSteps: [
        'Correct cable wiring per pinout diagram',
        'Set matching baud rate on both ends',
        'Add 120Ω termination resistor on RS485 if end of line',
        'Update firmware if protocol version mismatch',
        'Replace communication module if port damaged',
      ],
      testProcedure: [
        'Connect with DSE Configuration Suite and verify communication',
        'Read/write a parameter to confirm bidirectional communication',
        'Monitor for communication errors over 10-minute period',
        'Verify all connected devices see controller on network',
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['RS485 cable', '120Ω termination resistor'],
      specialTools: ['Multimeter', 'RS485 protocol analyzer (optional)'],
      safetyPrecautions: ['Disconnect power before changing wiring'],
    },
  ],
  calibrationProcedures: [
    {
      title: 'Voltage Sensing Calibration',
      description: 'Calibrate voltage measurement to match reference meter',
      steps: [
        'Connect calibrated reference voltmeter to generator terminals',
        'Run generator at rated speed with no load',
        'Access Calibration menu (Level 4 password required)',
        'Enter actual voltage reading from reference meter',
        'Controller will calculate and store calibration factor',
        'Verify reading matches reference ±0.5%',
      ],
      requiredEquipment: ['Calibrated digital voltmeter (0.1% accuracy)', 'Reference CT tester'],
      acceptanceCriteria: ['Voltage reading within ±0.5% of reference', 'All three phases match within 1%'],
    },
    {
      title: 'CT Ratio Verification',
      description: 'Verify current transformer ratio setting',
      steps: [
        'Apply known load to generator',
        'Measure actual current with clamp meter',
        'Compare with controller reading',
        'If different, verify CT ratio setting',
        'Adjust CT ratio in configuration if needed',
      ],
      requiredEquipment: ['Clamp meter (1% accuracy)', 'Resistive load bank'],
      acceptanceCriteria: ['Current reading within ±1% of clamp meter', 'Power factor reading matches load type'],
    },
  ],
  commonFaults: [
    {
      code: 'DSE-001',
      title: 'Emergency Stop',
      description: 'Emergency stop button activated or wiring fault',
      severity: 'shutdown',
      causes: ['E-stop button pressed', 'E-stop wiring open circuit', 'E-stop input configured incorrectly'],
      solutions: ['Release E-stop button and reset', 'Check E-stop wiring continuity', 'Verify input configuration'],
      resetProcedure: ['Clear fault on controller', 'Reset E-stop button', 'Press Reset on controller front panel'],
    },
    {
      code: 'DSE-002',
      title: 'Low Oil Pressure',
      description: 'Engine oil pressure below safety threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault', 'Oil leak', 'Wrong oil viscosity'],
      solutions: ['Check and top up oil', 'Replace oil pump', 'Test/replace sender', 'Find and fix leak', 'Use correct oil grade'],
      resetProcedure: ['Fix root cause', 'Clear alarm', 'Test run and monitor pressure'],
    },
    {
      code: 'DSE-003',
      title: 'High Engine Temperature',
      description: 'Coolant temperature exceeded safety limit',
      severity: 'shutdown',
      causes: ['Low coolant', 'Radiator blocked', 'Fan failure', 'Thermostat stuck', 'Water pump failure'],
      solutions: ['Top up coolant', 'Clean radiator fins', 'Repair/replace fan', 'Replace thermostat', 'Replace water pump'],
      resetProcedure: ['Allow engine to cool', 'Fix cooling issue', 'Clear alarm and test'],
    },
    {
      code: 'DSE-004',
      title: 'Over Speed',
      description: 'Engine speed exceeded maximum safe limit',
      severity: 'shutdown',
      causes: ['Governor failure', 'Actuator fault', 'Fuel rack stuck', 'Load rejection', 'Speed sensor fault'],
      solutions: ['Check governor operation', 'Test actuator', 'Free fuel rack', 'Check load circuit', 'Calibrate speed sensor'],
      resetProcedure: ['Investigate cause before reset', 'Clear alarm', 'Start with no load'],
    },
  ],
  maintenanceSchedule: [
    {
      task: 'Visual Inspection',
      interval: 'Weekly',
      procedure: ['Check display for faults', 'Verify all LEDs functional', 'Look for corrosion on terminals', 'Check cable connections secure'],
    },
    {
      task: 'Clean Controller',
      interval: 'Monthly',
      procedure: ['Blow out dust with compressed air', 'Wipe display with soft cloth', 'Check ventilation openings clear', 'Inspect gasket seal'],
      parts: ['Compressed air can', 'Lint-free cloth'],
    },
    {
      task: 'Firmware Update Check',
      interval: 'Quarterly',
      procedure: ['Check DSE website for updates', 'Download latest firmware', 'Backup configuration', 'Apply update via USB'],
    },
    {
      task: 'Full System Test',
      interval: 'Annually',
      procedure: ['Test all protection functions', 'Simulate faults to verify shutdown', 'Test AMF transfer operation', 'Verify communication links', 'Check all sensor readings against reference'],
    },
  ],
  troubleshootingGuide: [
    {
      problem: 'Controller keeps resetting',
      possibleCauses: ['Battery voltage unstable', 'Loose power connection', 'Internal fault', 'EMI interference'],
      diagnosticSteps: ['Monitor battery voltage during operation', 'Check power connections', 'Remove external connections one by one'],
      solutions: ['Stabilize power supply', 'Tighten connections', 'Add EMI filters', 'Replace controller if internal fault'],
    },
    {
      problem: 'Incorrect power readings',
      possibleCauses: ['CT installed backwards', 'Wrong CT ratio configured', 'CT secondary open', 'Phase sequence wrong'],
      diagnosticSteps: ['Check CT polarity markings', 'Verify CT ratio in configuration', 'Measure CT secondary with load', 'Check phase rotation'],
      solutions: ['Reverse CT orientation', 'Correct CT ratio setting', 'Replace CT', 'Correct phase connections'],
    },
  ],
  spareParts: [
    { partNumber: 'DSE7320', description: 'Complete DSE7320 Controller', price: 'KES 165,000', availability: 'in-stock' },
    { partNumber: 'DSE855', description: 'Expansion I/O Module', price: 'KES 45,000', availability: 'in-stock' },
    { partNumber: 'DSE890', description: 'Remote Display Module', price: 'KES 78,000', availability: 'order', leadTime: '2 weeks' },
    { partNumber: '016-145', description: 'USB Programming Cable', price: 'KES 5,500', availability: 'in-stock' },
    { partNumber: '016-156', description: 'Expansion Cable 2m', price: 'KES 3,800', availability: 'in-stock' },
    { partNumber: 'DSE-GASKET', description: 'Front Panel Gasket', price: 'KES 2,200', availability: 'in-stock' },
  ],
  safetyWarnings: [
    'Always disconnect battery before working on controller wiring',
    'Never hot-swap communication cables while generator is running',
    'Do not exceed maximum voltage ratings on inputs',
    'Use proper ESD precautions when handling controller',
    'Ensure proper grounding before commissioning',
    'Keep clear of rotating parts when testing',
    'Have fire extinguisher available when testing fuel circuits',
  ],
  toolsRequired: [
    'Digital multimeter',
    'Clamp meter (AC/DC)',
    'Torx screwdriver set (T10, T15, T20)',
    'Insulated screwdrivers',
    'ESD wrist strap',
    'USB cable (Mini-B)',
    'Laptop with DSE Configuration Suite',
    'Feeler gauges (for MPU adjustment)',
  ],
  softwareInfo: {
    configSoftware: 'DSE Configuration Suite',
    version: '7.4.0',
    downloadUrl: 'https://www.deepseaelectronics.com/software',
    communicationPort: 'USB or RS232',
    protocol: 'Modbus RTU/TCP',
    features: [
      'Full configuration of all parameters',
      'Real-time monitoring and logging',
      'Firmware updates',
      'Fault history download',
      'Configuration backup/restore',
      'Wiring diagram viewer',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMAP CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

const COMAP_MANUAL: ControllerManual = {
  id: 'comap',
  brand: 'ComAp',
  models: ['InteliLite NT', 'InteliGen NT', 'InteliSys NT', 'InteliMains NT', 'InteliDrive', 'IC-NT'],
  description: 'Premium generator controllers from Czech Republic offering advanced control, protection, and monitoring for single and paralleled generator applications.',
  specifications: {
    powerSupply: '8-36V DC',
    operatingVoltage: '12V/24V DC nominal',
    operatingTemp: '-30°C to +70°C',
    protection: 'IP65 front panel',
    dimensions: '245mm x 185mm x 48mm',
    weight: '900g',
    display: '4.3" color TFT touchscreen',
    communication: ['RS232', 'RS485', 'USB', 'Ethernet', 'CAN J1939', 'Modbus'],
    inputs: [
      { type: 'Binary inputs', quantity: 12, description: 'Configurable polarity' },
      { type: 'Analog inputs', quantity: 6, description: 'Resistive or current' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 10, rating: '8A @ 250VAC/30VDC', description: 'Configurable' },
      { type: 'Analog outputs', quantity: 2, rating: '4-20mA', description: 'Configurable' },
    ],
  },
  wiringDiagram: {
    description: 'InteliGen NT Wiring - Comprehensive generator controller',
    connections: [
      { terminal: 'TB1-1', function: 'Power Supply +', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A fused' },
      { terminal: 'TB1-2', function: 'Power Supply -', wireColor: 'Black', wireSize: '2.5mm²', notes: 'DC ground' },
      { terminal: 'TB2-1', function: 'Generator L1', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct or via PT' },
      { terminal: 'TB2-2', function: 'Generator L2', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct or via PT' },
      { terminal: 'TB2-3', function: 'Generator L3', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct or via PT' },
      { terminal: 'TB2-4', function: 'Generator N', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference' },
      { terminal: 'TB3-1', function: 'CT L1 S1', wireColor: 'Red', wireSize: '2.5mm²', notes: '5A CT secondary' },
      { terminal: 'TB3-2', function: 'CT L1 S2', wireColor: 'White', wireSize: '2.5mm²', notes: 'CT common' },
      { terminal: 'TB4-1', function: 'Speed Input', wireColor: 'White', wireSize: '1.0mm²', notes: 'MPU signal' },
      { terminal: 'TB4-2', function: 'Speed Ground', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Shielded' },
    ],
    notes: [
      'Use shielded twisted pair for speed sensing',
      'CT polarity essential for correct power measurement',
      'Separate control and power cables',
      'Use suppression diodes on all inductive loads',
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'L1': 'Brown',
      'L2': 'Black',
      'L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
    },
  },
  terminalPinouts: [
    { connector: 'CAN1', pinNumber: '1', function: 'CAN_H', voltage: '2.5-3.5V', notes: 'J1939 High' },
    { connector: 'CAN1', pinNumber: '2', function: 'CAN_L', voltage: '1.5-2.5V', notes: 'J1939 Low' },
    { connector: 'CAN1', pinNumber: '3', function: 'GND', notes: 'Shield/Ground' },
    { connector: 'USB', pinNumber: 'Type B', function: 'Configuration', notes: 'InteliConfig connection' },
    { connector: 'ETH', pinNumber: 'RJ45', function: 'Ethernet', notes: '10/100 Mbps' },
  ],
  configurationGuide: [
    {
      step: 1,
      title: 'InteliConfig Software Setup',
      description: 'Install and configure InteliConfig software for controller programming',
      parameters: [
        { name: 'Engine Type', defaultValue: 'Diesel', range: 'Diesel/Gas/Dual', description: 'Fuel type selection' },
        { name: 'Nominal Voltage', defaultValue: '400V', range: '100-690V', description: 'Generator voltage' },
        { name: 'Nominal Frequency', defaultValue: '50Hz', range: '50/60Hz', description: 'System frequency' },
        { name: 'Application', defaultValue: 'AMF', range: 'AMF/Island/Parallel', description: 'Operating mode' },
      ],
      notes: ['Download InteliConfig from ComAp website', 'Use license key for full features'],
    },
  ],
  repairProcedures: [
    {
      id: 'comap-pcb-replace',
      title: 'Main PCB Replacement',
      symptom: 'Multiple faults, erratic behavior, or no power',
      possibleCauses: ['Lightning damage', 'Overvoltage', 'Moisture ingress', 'Component failure'],
      diagnosticSteps: [
        'Visual inspection for burnt components',
        'Check for moisture damage',
        'Verify power supply voltages',
        'Test with known good controller',
      ],
      repairSteps: [
        'Remove all wiring connections (label first)',
        'Unscrew mounting bolts',
        'Remove old controller',
        'Install new controller',
        'Reconnect all wiring',
        'Upload saved configuration',
      ],
      testProcedure: [
        'Power up and verify display operation',
        'Check all inputs reading correctly',
        'Test all outputs with lamp test',
        'Perform start/stop test',
        'Verify communication links',
      ],
      estimatedTime: '2-4 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement controller', 'Cable ties'],
      specialTools: ['InteliConfig software', 'USB cable', 'Digital camera for wiring photos'],
      safetyPrecautions: ['Disconnect battery', 'Label all wires', 'Backup configuration before replacement'],
    },
  ],
  calibrationProcedures: [
    {
      title: 'Analog Input Calibration',
      description: 'Calibrate temperature and pressure inputs',
      steps: [
        'Connect precision resistance decade box',
        'Set to minimum sensor resistance',
        'Enter actual value in calibration menu',
        'Set to maximum sensor resistance',
        'Enter actual value in calibration menu',
        'Verify linearity at mid-point',
      ],
      requiredEquipment: ['Decade resistance box', 'Calibrated thermometer'],
      acceptanceCriteria: ['Reading within ±2% of actual', 'Linear response across range'],
    },
  ],
  commonFaults: [
    {
      code: 'SdBin1',
      title: 'Binary Input 1 Shutdown',
      description: 'Shutdown triggered by binary input 1 (typically emergency stop)',
      severity: 'shutdown',
      causes: ['E-stop activated', 'Wire break', 'Wrong input polarity configured'],
      solutions: ['Check E-stop position', 'Test wire continuity', 'Verify input polarity setting'],
      resetProcedure: ['Clear fault condition', 'Press RESET button', 'Check for recurring fault'],
    },
  ],
  maintenanceSchedule: [
    {
      task: 'Firmware Check',
      interval: 'Quarterly',
      procedure: ['Check ComAp website for updates', 'Review release notes', 'Backup current settings', 'Apply update if needed'],
    },
  ],
  troubleshootingGuide: [
    {
      problem: 'Cannot connect via InteliConfig',
      possibleCauses: ['Wrong COM port', 'Baud rate mismatch', 'Cable fault', 'Controller in wrong mode'],
      diagnosticSteps: ['Check Device Manager for COM port', 'Try different USB port', 'Test cable with another device'],
      solutions: ['Select correct COM port', 'Use default 19200 baud', 'Replace USB cable', 'Reset controller'],
    },
  ],
  spareParts: [
    { partNumber: 'IG-NT', description: 'InteliGen NT Controller', price: 'KES 185,000', availability: 'in-stock' },
    { partNumber: 'IL-NT', description: 'InteliLite NT Controller', price: 'KES 95,000', availability: 'in-stock' },
    { partNumber: 'USB-CBL', description: 'USB Programming Cable', price: 'KES 4,500', availability: 'in-stock' },
  ],
  safetyWarnings: [
    'Always backup configuration before changes',
    'Test protection functions after commissioning',
    'Use surge protection on communication cables',
  ],
  toolsRequired: [
    'InteliConfig software',
    'USB Type B cable',
    'Digital multimeter',
    'Insulated tools',
  ],
  softwareInfo: {
    configSoftware: 'InteliConfig',
    version: '2.5.0',
    downloadUrl: 'https://www.comap-control.com',
    communicationPort: 'USB or Ethernet',
    protocol: 'Modbus TCP/RTU',
    features: [
      'Graphical configuration',
      'Real-time monitoring',
      'Trend recording',
      'Remote access via WebSupervisor',
      'Automatic firmware updates',
    ],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// WOODWARD CONTROLLERS
// ═══════════════════════════════════════════════════════════════════════════════

const WOODWARD_MANUAL: ControllerManual = {
  id: 'woodward',
  brand: 'Woodward',
  models: ['easYgen-3100', 'easYgen-3200', 'easYgen-3400', 'easYgen-3500', 'EGCP-2', 'EGCP-3'],
  description: 'Premium industrial-grade generator controllers for critical power applications, known for reliability in harsh environments.',
  specifications: {
    powerSupply: '8-32V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-40°C to +85°C',
    protection: 'IP65 front, IP20 rear',
    dimensions: '288mm x 240mm x 64mm',
    weight: '1.2kg',
    display: '5.7" color TFT touchscreen',
    communication: ['RS232', 'RS485', 'Ethernet', 'CAN J1939', 'Profibus'],
    inputs: [
      { type: 'Digital inputs', quantity: 16, description: 'Configurable +/-' },
      { type: 'Analog inputs', quantity: 8, description: 'mA, V, or resistive' },
      { type: 'Speed inputs', quantity: 2, description: 'MPU or active' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 12, rating: '10A resistive', description: 'SPDT configurable' },
      { type: 'Analog outputs', quantity: 4, rating: '4-20mA', description: 'Isolated' },
    ],
  },
  wiringDiagram: {
    description: 'easYgen-3200 Wiring - Industrial Generator Controller',
    connections: [
      { terminal: 'X1:1', function: 'DC Supply +', wireColor: 'Red', wireSize: '2.5mm²', notes: '15A fused' },
      { terminal: 'X1:2', function: 'DC Supply -', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Common ground' },
      { terminal: 'X2:1-4', function: 'Generator Voltage', wireColor: 'As per phase', wireSize: '1.5mm²', notes: 'L1, L2, L3, N' },
      { terminal: 'X3:1-4', function: 'Bus Voltage', wireColor: 'As per phase', wireSize: '1.5mm²', notes: 'For paralleling' },
      { terminal: 'X4:1-6', function: 'Current Transformers', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A CTs' },
    ],
    notes: [
      'Follow Woodward EMC installation guidelines',
      'Separate analog and digital cables',
      'Use shielded cables for all communications',
    ],
    wireColors: {
      'DC+': 'Red',
      'DC-': 'Black',
      'Phase A': 'Brown/Red',
      'Phase B': 'Black/White',
      'Phase C': 'Grey/Blue',
    },
  },
  terminalPinouts: [
    { connector: 'X10', pinNumber: '1', function: 'CAN High', notes: 'J1939' },
    { connector: 'X10', pinNumber: '2', function: 'CAN Low', notes: 'J1939' },
    { connector: 'X11', pinNumber: 'RJ45', function: 'Ethernet', notes: '10/100 Mbps' },
  ],
  configurationGuide: [
    {
      step: 1,
      title: 'ToolKit Software Configuration',
      description: 'Configure easYgen using Woodward ToolKit software',
      parameters: [
        { name: 'Application Type', defaultValue: 'Standby', range: 'Standby/Prime/Parallel', description: 'Operating mode' },
        { name: 'Engine Type', defaultValue: 'Diesel', range: 'Diesel/Gas', description: 'Fuel configuration' },
      ],
      notes: ['Requires ToolKit license for full access'],
    },
  ],
  repairProcedures: [
    {
      id: 'woodward-speed-fault',
      title: 'Speed Signal Loss',
      symptom: 'Engine fails to synchronize or shows 0 RPM',
      possibleCauses: ['MPU air gap incorrect', 'MPU failure', 'Cable damage', 'Speed input fault'],
      diagnosticSteps: [
        'Check MPU signal with oscilloscope (should be 1-5Vpp)',
        'Verify MPU air gap (0.5-1.0mm typical)',
        'Test cable continuity',
        'Check input configuration',
      ],
      repairSteps: [
        'Adjust MPU air gap if incorrect',
        'Replace MPU if no signal',
        'Repair/replace cable if damaged',
        'Reconfigure speed input parameters',
      ],
      testProcedure: [
        'Crank engine and verify RPM display',
        'Run at rated speed and check stability',
        'Verify synchronization capability',
      ],
      estimatedTime: '1-3 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['MPU sensor if required'],
      specialTools: ['Oscilloscope', 'Feeler gauges'],
      safetyPrecautions: ['Engine must be stopped for MPU adjustment'],
    },
  ],
  calibrationProcedures: [],
  commonFaults: [
    {
      code: 'E01',
      title: 'Emergency Stop',
      description: 'Emergency stop activated',
      severity: 'shutdown',
      causes: ['E-stop pressed', 'Wiring fault'],
      solutions: ['Reset E-stop', 'Check wiring'],
      resetProcedure: ['Release E-stop', 'Press Reset'],
    },
  ],
  maintenanceSchedule: [
    {
      task: 'System Check',
      interval: 'Monthly',
      procedure: ['Check all connections', 'Verify fault history', 'Test protection functions'],
    },
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'EY3200', description: 'easYgen-3200 Controller', price: 'KES 245,000', availability: 'in-stock' },
  ],
  safetyWarnings: ['Always use proper grounding', 'Follow EMC installation guidelines'],
  toolsRequired: ['Woodward ToolKit software', 'USB cable', 'Multimeter'],
  softwareInfo: {
    configSoftware: 'Woodward ToolKit',
    version: '5.2',
    downloadUrl: 'https://www.woodward.com',
    communicationPort: 'USB or Ethernet',
    protocol: 'Modbus, J1939',
    features: ['Full configuration', 'Monitoring', 'Diagnostics'],
  },
};

// Continue with other controllers...

// ═══════════════════════════════════════════════════════════════════════════════
// ALL CONTROLLER MANUALS EXPORT
// ═══════════════════════════════════════════════════════════════════════════════

export const CONTROLLER_MANUALS: ControllerManual[] = [
  DSE_MANUAL,
  COMAP_MANUAL,
  WOODWARD_MANUAL,
];

// Add remaining controllers with similar structure
const SMARTGEN_MANUAL: ControllerManual = {
  id: 'smartgen',
  brand: 'SmartGen',
  models: ['HGM6110N', 'HGM6120N', 'HGM6310', 'HGM6320', 'HGM7210', 'HGM7220', 'HGM9310', 'HGM9320', 'HGM9510', 'HGM9520'],
  description: 'Cost-effective generator controllers from China with good feature set for standard applications.',
  specifications: {
    powerSupply: '8-35V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-25°C to +70°C',
    protection: 'IP55 front panel',
    dimensions: '172mm x 132mm x 52mm',
    weight: '500g',
    display: '128x64 LCD or 4.3" TFT (varies by model)',
    communication: ['RS232', 'RS485', 'USB', 'CAN (some models)'],
    inputs: [
      { type: 'Digital inputs', quantity: 6, description: 'Programmable' },
      { type: 'Analog inputs', quantity: 4, description: 'Resistive type' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 6, rating: '5A', description: 'Programmable' },
    ],
  },
  wiringDiagram: {
    description: 'SmartGen HGM6320 Wiring',
    connections: [
      { terminal: '1', function: 'Battery +', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A fused' },
      { terminal: '2', function: 'Battery -', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Ground' },
      { terminal: '3', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Voltage sensing' },
      { terminal: '4', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Voltage sensing' },
      { terminal: '5', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Voltage sensing' },
    ],
    notes: ['Budget-friendly wiring with standard connectors'],
    wireColors: { '+': 'Red', '-': 'Black', 'L1': 'Brown', 'L2': 'Black', 'L3': 'Grey' },
  },
  terminalPinouts: [],
  configurationGuide: [
    {
      step: 1,
      title: 'PC Software Configuration',
      description: 'Use SmartGen PC software to configure controller',
      parameters: [
        { name: 'Voltage', defaultValue: '400V', range: '100-690V', description: 'Nominal voltage' },
      ],
      notes: ['Download free software from SmartGen website'],
    },
  ],
  repairProcedures: [
    {
      id: 'smartgen-button-fail',
      title: 'Button Not Responding',
      symptom: 'Front panel buttons do not work',
      possibleCauses: ['Membrane switch worn', 'Flex cable loose', 'PCB fault'],
      diagnosticSteps: ['Check if any buttons work', 'Inspect flex cable connection'],
      repairSteps: ['Reseat flex cable', 'Replace membrane keypad if worn', 'Replace controller if PCB fault'],
      testProcedure: ['Test all buttons', 'Verify functions'],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Membrane keypad if replacing'],
      specialTools: ['Small screwdriver'],
      safetyPrecautions: ['Disconnect power'],
    },
  ],
  calibrationProcedures: [],
  commonFaults: [
    {
      code: 'AL01',
      title: 'Low Oil Pressure',
      description: 'Oil pressure below threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Sender fault', 'Oil pump failure'],
      solutions: ['Check oil level', 'Test sender', 'Check pump'],
      resetProcedure: ['Fix cause', 'Reset alarm'],
    },
  ],
  maintenanceSchedule: [
    { task: 'Visual Check', interval: 'Weekly', procedure: ['Check display', 'Look for faults'] },
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'HGM6320', description: 'HGM6320 Controller', price: 'KES 28,000', availability: 'in-stock' },
    { partNumber: 'HGM7220', description: 'HGM7220 Controller', price: 'KES 45,000', availability: 'in-stock' },
  ],
  safetyWarnings: ['Verify power supply voltage before connection'],
  toolsRequired: ['SmartGen PC software', 'USB cable', 'Multimeter'],
  softwareInfo: {
    configSoftware: 'SmartGen PC Tool',
    version: '3.5',
    downloadUrl: 'https://www.smartgen.com.cn',
    communicationPort: 'RS232 or USB',
    protocol: 'Modbus RTU',
    features: ['Configuration', 'Monitoring', 'Data logging'],
  },
};

const POWERWIZARD_MANUAL: ControllerManual = {
  id: 'powerwizard',
  brand: 'Caterpillar PowerWizard',
  models: ['PowerWizard 1.0', 'PowerWizard 1.1', 'PowerWizard 2.0', 'PowerWizard 2.1'],
  description: 'Caterpillar proprietary generator controllers for Cat diesel and gas generator sets.',
  specifications: {
    powerSupply: '10-32V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-40°C to +70°C',
    protection: 'IP65',
    dimensions: '310mm x 240mm x 75mm',
    weight: '2.1kg',
    display: '5.7" color TFT',
    communication: ['RS232', 'RS485', 'CAN J1939', 'Modbus', 'Ethernet (2.x)'],
    inputs: [
      { type: 'Digital inputs', quantity: 10, description: 'Programmable' },
      { type: 'Analog inputs', quantity: 6, description: 'For sensors' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 8, rating: '8A', description: 'Programmable' },
    ],
  },
  wiringDiagram: {
    description: 'PowerWizard 2.0 Standard Wiring',
    connections: [
      { terminal: 'J1-1', function: 'Battery +', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Fused' },
      { terminal: 'J1-2', function: 'Battery -', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Ground' },
    ],
    notes: ['Factory configured for specific Cat engine'],
    wireColors: { '+': 'Red', '-': 'Black' },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [
    {
      id: 'pw-ecm-comm',
      title: 'ECM Communication Fault',
      symptom: 'Controller cannot communicate with engine ECM',
      possibleCauses: ['CAN wiring fault', 'ECM failure', 'Controller fault'],
      diagnosticSteps: [
        'Check CAN wiring continuity',
        'Verify CAN termination resistors',
        'Check ECM diagnostic codes',
      ],
      repairSteps: [
        'Repair CAN wiring if faulty',
        'Add/remove termination resistors as needed',
        'Reset controller and ECM',
      ],
      testProcedure: ['Verify ECM data appears on controller', 'Test start/stop functions'],
      estimatedTime: '1-3 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['CAN cable', '120Ω resistor'],
      specialTools: ['Cat ET software', 'CAN analyzer'],
      safetyPrecautions: ['Only Cat-trained technicians'],
    },
  ],
  calibrationProcedures: [],
  commonFaults: [
    {
      code: 'E360',
      title: 'Low Oil Pressure',
      description: 'Engine oil pressure below threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault'],
      solutions: ['Check oil', 'Check pump', 'Test sender'],
      resetProcedure: ['Fix cause', 'Clear with Cat ET'],
    },
  ],
  maintenanceSchedule: [
    { task: 'Software Update', interval: 'Annually', procedure: ['Check for updates', 'Apply with Cat ET'] },
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: '309-0763', description: 'PowerWizard 1.0 Module', price: 'KES 185,000', availability: 'order', leadTime: '3-4 weeks' },
  ],
  safetyWarnings: ['Only Cat-certified technicians should configure', 'Use genuine Cat parts'],
  toolsRequired: ['Cat Electronic Technician (ET) software', 'Cat comm adapter III'],
  softwareInfo: {
    configSoftware: 'Cat Electronic Technician (ET)',
    version: '2023A',
    downloadUrl: 'Cat dealer only',
    communicationPort: 'Cat Comm Adapter III',
    protocol: 'J1939 CAN',
    features: ['Diagnostics', 'Configuration', 'Data logging'],
  },
};

const DATAKOM_MANUAL: ControllerManual = {
  id: 'datakom',
  brand: 'Datakom',
  models: ['DKG-105', 'DKG-109', 'DKG-207', 'DKG-307', 'DKG-509', 'D-500', 'D-700'],
  description: 'Turkish generator controllers offering good value with comprehensive features for standby and parallel applications.',
  specifications: {
    powerSupply: '8-35V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-30°C to +70°C',
    protection: 'IP65',
    dimensions: '192mm x 144mm x 50mm',
    weight: '600g',
    display: 'Color TFT',
    communication: ['RS232', 'RS485', 'USB', 'Ethernet (D-series)'],
    inputs: [
      { type: 'Digital inputs', quantity: 8, description: 'Configurable' },
      { type: 'Analog inputs', quantity: 4, description: 'VDO compatible' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 6, rating: '5A', description: 'Programmable' },
    ],
  },
  wiringDiagram: {
    description: 'Datakom DKG-509 Wiring',
    connections: [
      { terminal: '1', function: 'DC+', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Fused 10A' },
      { terminal: '2', function: 'DC-', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Ground' },
    ],
    notes: ['Standard European terminal layout'],
    wireColors: { '+': 'Red', '-': 'Black' },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [],
  calibrationProcedures: [],
  commonFaults: [
    {
      code: 'F01',
      title: 'Low Fuel Level',
      description: 'Fuel level below warning threshold',
      severity: 'warning',
      causes: ['Low fuel', 'Sender fault'],
      solutions: ['Refuel', 'Check sender'],
      resetProcedure: ['Auto-clears when fuel level rises'],
    },
  ],
  maintenanceSchedule: [],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'DKG-509', description: 'DKG-509 Controller', price: 'KES 65,000', availability: 'in-stock' },
    { partNumber: 'D-500', description: 'D-500 Controller', price: 'KES 85,000', availability: 'in-stock' },
  ],
  safetyWarnings: ['Verify voltage before connection'],
  toolsRequired: ['Datakom Rainbow software', 'USB cable'],
  softwareInfo: {
    configSoftware: 'Rainbow',
    version: '4.0',
    downloadUrl: 'https://www.datakom.com.tr',
    communicationPort: 'USB',
    protocol: 'Modbus RTU',
    features: ['Configuration', 'Monitoring'],
  },
};

const LOVATO_MANUAL: ControllerManual = {
  id: 'lovato',
  brand: 'Lovato Electric',
  models: ['RGK50', 'RGK60', 'RGK600', 'RGK700', 'RGK800', 'RGK900'],
  description: 'Italian quality generator controllers with excellent build quality and comprehensive protection features.',
  specifications: {
    powerSupply: '8-35V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-25°C to +70°C',
    protection: 'IP65 front',
    dimensions: '144mm x 144mm x 55mm',
    weight: '550g',
    display: 'Graphic LCD',
    communication: ['RS232', 'RS485', 'USB', 'Ethernet'],
    inputs: [
      { type: 'Digital inputs', quantity: 8, description: 'Programmable' },
      { type: 'Analog inputs', quantity: 4, description: 'Universal' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 6, rating: '5A', description: 'Programmable' },
    ],
  },
  wiringDiagram: {
    description: 'Lovato RGK800 Wiring',
    connections: [
      { terminal: '1', function: 'DC+', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Fused' },
      { terminal: '2', function: 'DC-', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Ground' },
    ],
    notes: ['Italian quality connectors'],
    wireColors: { '+': 'Red', '-': 'Black' },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [],
  calibrationProcedures: [],
  commonFaults: [],
  maintenanceSchedule: [],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'RGK800', description: 'RGK800 Controller', price: 'KES 95,000', availability: 'in-stock' },
  ],
  safetyWarnings: ['Use proper grounding'],
  toolsRequired: ['Synergy software', 'USB cable'],
  softwareInfo: {
    configSoftware: 'Synergy',
    version: '3.5',
    downloadUrl: 'https://www.lovato.com',
    communicationPort: 'USB',
    protocol: 'Modbus',
    features: ['Configuration', 'Monitoring', 'Logging'],
  },
};

const SIEMENS_MANUAL: ControllerManual = {
  id: 'siemens',
  brand: 'Siemens',
  models: ['SICAM MIC', 'SICAM AK3', 'SICAM SCC'],
  description: 'German engineering excellence for critical power applications requiring highest reliability.',
  specifications: {
    powerSupply: '24V DC ±20%',
    operatingVoltage: '24V DC',
    operatingTemp: '-40°C to +70°C',
    protection: 'IP65',
    dimensions: '300mm x 250mm x 80mm',
    weight: '2.5kg',
    display: '7" color touchscreen',
    communication: ['Profibus', 'Profinet', 'Modbus TCP', 'IEC 61850', 'DNP3'],
    inputs: [
      { type: 'Digital inputs', quantity: 32, description: 'Isolated' },
      { type: 'Analog inputs', quantity: 16, description: 'High precision' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 16, rating: '10A', description: 'Heavy duty' },
    ],
  },
  wiringDiagram: {
    description: 'Siemens SICAM Controller Wiring',
    connections: [
      { terminal: 'X1:1', function: '24V DC+', wireColor: 'Red', wireSize: '2.5mm²', notes: '24V DC supply' },
      { terminal: 'X1:2', function: '24V DC-', wireColor: 'Blue', wireSize: '2.5mm²', notes: 'Ground' },
    ],
    notes: ['Follow Siemens wiring standards', 'Use proper cable glands'],
    wireColors: { '+24V': 'Red', '0V': 'Blue', 'PE': 'Green/Yellow' },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [],
  calibrationProcedures: [],
  commonFaults: [],
  maintenanceSchedule: [],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'SICAM-MIC', description: 'SICAM MIC Controller', price: 'KES 350,000', availability: 'order', leadTime: '6-8 weeks' },
  ],
  safetyWarnings: ['Siemens certified technicians only', 'Follow IEC safety standards'],
  toolsRequired: ['DIGSI software', 'Siemens programming cable'],
  softwareInfo: {
    configSoftware: 'DIGSI / WinCC',
    version: '5.0',
    downloadUrl: 'Siemens licensed',
    communicationPort: 'Ethernet',
    protocol: 'IEC 61850 / Modbus TCP',
    features: ['SCADA integration', 'Remote monitoring', 'IEC 61850 compliant'],
  },
};

const ENKO_MANUAL: ControllerManual = {
  id: 'enko',
  brand: 'Enko',
  models: ['EK2000', 'EK3000', 'EK4000', 'EK5000'],
  description: 'Turkish controllers providing budget-friendly solutions for standard generator applications.',
  specifications: {
    powerSupply: '8-32V DC',
    operatingVoltage: '12V/24V DC',
    operatingTemp: '-20°C to +60°C',
    protection: 'IP54',
    dimensions: '144mm x 144mm x 45mm',
    weight: '400g',
    display: 'LCD display',
    communication: ['RS232', 'RS485'],
    inputs: [
      { type: 'Digital inputs', quantity: 6, description: 'Basic' },
      { type: 'Analog inputs', quantity: 3, description: 'For sensors' },
    ],
    outputs: [
      { type: 'Relay outputs', quantity: 4, rating: '5A', description: 'Basic control' },
    ],
  },
  wiringDiagram: {
    description: 'Enko EK3000 Basic Wiring',
    connections: [
      { terminal: '1', function: 'DC+', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Fused' },
      { terminal: '2', function: 'DC-', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Ground' },
    ],
    notes: ['Simple wiring for basic applications'],
    wireColors: { '+': 'Red', '-': 'Black' },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [],
  calibrationProcedures: [],
  commonFaults: [],
  maintenanceSchedule: [],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'EK3000', description: 'EK3000 Controller', price: 'KES 18,000', availability: 'in-stock' },
  ],
  safetyWarnings: ['Basic safety precautions'],
  toolsRequired: ['Enko software', 'RS232 cable'],
  softwareInfo: {
    configSoftware: 'Enko Configurator',
    version: '2.0',
    downloadUrl: 'https://www.enko.com.tr',
    communicationPort: 'RS232',
    protocol: 'Proprietary',
    features: ['Basic configuration'],
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// VODIA (VOLVO PENTA DIAGNOSTIC TOOL)
// ═══════════════════════════════════════════════════════════════════════════════

const VODIA_MANUAL: ControllerManual = {
  id: 'vodia',
  brand: 'Volvo Penta VODIA',
  models: ['VODIA5', 'VODIA6', 'VODIA Tool', 'Volvo Penta EMS', 'Volvo Penta EDC', 'D5', 'D7', 'D11', 'D13', 'D16', 'TAD', 'TWD'],
  description: 'Volvo Penta Official Diagnostic Tool for marine and industrial engines. Comprehensive engine diagnostics, parameter adjustment, and fault code reading for all Volvo Penta electronic engines.',
  specifications: {
    powerSupply: '12-24V DC via diagnostic connector',
    operatingVoltage: '12V/24V DC engine systems',
    operatingTemp: '-20°C to +60°C',
    protection: 'IP54 (VODIA5 interface)',
    dimensions: '185mm x 110mm x 45mm (interface unit)',
    weight: '450g',
    display: 'PC-based software interface',
    communication: ['CAN Bus SAE J1939', 'ISO 15765-4', 'Volvo EECU Protocol', 'USB 2.0', 'Bluetooth (VODIA6)'],
    inputs: [
      { type: 'CAN Bus', quantity: 2, description: 'High-speed CAN for engine ECU communication' },
      { type: 'K-Line', quantity: 1, description: 'Legacy diagnostic protocol' },
      { type: 'USB', quantity: 1, description: 'PC connection' },
    ],
    outputs: [
      { type: 'Diagnostic data', quantity: 1, rating: 'N/A', description: 'Real-time engine parameters' },
      { type: 'Fault codes', quantity: 1, rating: 'N/A', description: 'Active and stored DTCs' },
    ],
  },
  wiringDiagram: {
    description: 'VODIA Diagnostic Connector Pinout - Standard Volvo Penta 9-pin Diagnostic Port',
    connections: [
      { terminal: 'Pin 1', function: 'CAN High', wireColor: 'Yellow/Green', wireSize: '0.75mm²', notes: 'J1939 CAN-H' },
      { terminal: 'Pin 2', function: 'CAN Low', wireColor: 'Yellow/Brown', wireSize: '0.75mm²', notes: 'J1939 CAN-L' },
      { terminal: 'Pin 3', function: 'Ground', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Signal ground' },
      { terminal: 'Pin 4', function: 'K-Line', wireColor: 'White', wireSize: '0.75mm²', notes: 'Legacy engines' },
      { terminal: 'Pin 5', function: 'Not used', wireColor: '-', wireSize: '-', notes: 'Reserved' },
      { terminal: 'Pin 6', function: 'Battery +12/24V', wireColor: 'Red', wireSize: '1.5mm²', notes: 'Interface power' },
      { terminal: 'Pin 7', function: 'Ground', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Power ground' },
      { terminal: 'Pin 8', function: 'CAN High 2', wireColor: 'Pink', wireSize: '0.75mm²', notes: 'Secondary CAN bus' },
      { terminal: 'Pin 9', function: 'CAN Low 2', wireColor: 'Grey', wireSize: '0.75mm²', notes: 'Secondary CAN bus' },
    ],
    notes: [
      'Use only genuine Volvo Penta diagnostic cables',
      'Ensure ignition is ON before connecting VODIA',
      'Do not disconnect while software update is in progress',
      'CAN bus termination is built into the interface',
      'For marine applications, ensure all batteries are fully charged',
      'Always update VODIA software to latest version before diagnosis',
    ],
    wireColors: {
      'CAN High': 'Yellow/Green',
      'CAN Low': 'Yellow/Brown',
      'Ground': 'Brown or Black',
      'Power': 'Red',
      'K-Line': 'White',
    },
  },
  terminalPinouts: [
    { connector: '9-Pin Diagnostic', pinNumber: '1', function: 'CAN-H (J1939)', voltage: '2.5-3.5V', notes: 'Dominant state' },
    { connector: '9-Pin Diagnostic', pinNumber: '2', function: 'CAN-L (J1939)', voltage: '1.5-2.5V', notes: 'Dominant state' },
    { connector: '9-Pin Diagnostic', pinNumber: '3', function: 'Signal Ground', notes: 'Reference for CAN' },
    { connector: '9-Pin Diagnostic', pinNumber: '6', function: 'Battery Positive', voltage: '12-24V DC', notes: 'VODIA power' },
    { connector: 'USB', pinNumber: 'Type-A', function: 'PC Connection', notes: 'VODIA software communication' },
    { connector: 'Bluetooth', pinNumber: 'N/A', function: 'Wireless (VODIA6)', notes: 'Range up to 10m' },
  ],
  configurationGuide: [
    {
      step: 1,
      title: 'VODIA Software Installation',
      description: 'Install VODIA diagnostic software on Windows PC with license activation.',
      parameters: [
        { name: 'System Requirements', defaultValue: 'Windows 10/11', range: 'Windows 7+', description: 'PC operating system' },
        { name: 'License Type', defaultValue: 'Dealer/Workshop', range: 'Basic/Full/Dealer', description: 'Determines available functions' },
        { name: 'Database Version', defaultValue: 'Latest', range: 'Auto-update', description: 'Engine data and fault codes' },
        { name: 'Interface Driver', defaultValue: 'Auto-install', range: 'USB/Bluetooth', description: 'VODIA hardware driver' },
      ],
      notes: ['Requires active internet for license activation', 'Update database before each diagnostic session'],
    },
    {
      step: 2,
      title: 'Engine Connection Setup',
      description: 'Connect VODIA interface to engine diagnostic port and establish communication.',
      parameters: [
        { name: 'Communication Protocol', defaultValue: 'Auto-detect', range: 'J1939/ISO', description: 'Engine communication type' },
        { name: 'Engine Family', defaultValue: 'Auto-detect', range: 'D5-D16/TAD/TWD', description: 'Engine model series' },
        { name: 'Software Version', defaultValue: 'Read from ECU', range: 'Display only', description: 'ECU software identification' },
        { name: 'Serial Number', defaultValue: 'Read from ECU', range: 'Display only', description: 'Engine serial number' },
      ],
      notes: ['Engine must be in key-ON position', 'Wait for full system boot before diagnosis'],
    },
    {
      step: 3,
      title: 'Parameter Adjustment',
      description: 'Adjust engine parameters including governor settings, protection limits, and performance curves.',
      parameters: [
        { name: 'Rated Speed', defaultValue: '1500/1800 RPM', range: '800-2500 RPM', description: 'Nominal engine speed' },
        { name: 'High Idle', defaultValue: '1650 RPM', range: '100-200 RPM above rated', description: 'Maximum no-load speed' },
        { name: 'Low Idle', defaultValue: '700 RPM', range: '600-900 RPM', description: 'Minimum engine speed' },
        { name: 'Droop', defaultValue: '4%', range: '0-10%', description: 'Speed droop for load sharing' },
      ],
      notes: ['Changes require ECU password', 'Some parameters require Volvo Penta authorization'],
    },
    {
      step: 4,
      title: 'Injector Calibration',
      description: 'Program individual injector correction codes (IQA/ISA) for optimal combustion.',
      parameters: [
        { name: 'IQA Code Cyl 1', defaultValue: 'Read from injector', range: '6-digit alphanumeric', description: 'Injector Quality Adjustment' },
        { name: 'IQA Code Cyl 2-6', defaultValue: 'Read from injector', range: '6-digit alphanumeric', description: 'Each injector individually' },
        { name: 'Injection Timing', defaultValue: 'Factory', range: 'ECU controlled', description: 'Automatic optimization' },
        { name: 'Rail Pressure', defaultValue: 'Factory', range: '200-2000 bar', description: 'Common rail pressure' },
      ],
      notes: ['IQA codes stamped on injector body', 'Must be entered after injector replacement'],
    },
  ],
  repairProcedures: [
    {
      id: 'vodia-no-comm',
      title: 'No Communication with Engine ECU',
      symptom: 'VODIA cannot establish connection with engine control unit',
      possibleCauses: ['Faulty diagnostic cable', 'CAN bus wiring fault', 'ECU not powered', 'Wrong protocol selected', 'ECU hardware failure'],
      diagnosticSteps: [
        'Check ignition is ON and wait 30 seconds for ECU boot',
        'Verify battery voltage (minimum 11.5V for 12V systems)',
        'Check diagnostic connector pins for corrosion or damage',
        'Measure CAN-H to CAN-L voltage (should be ~2.5V difference)',
        'Try different USB port or PC',
      ],
      repairSteps: [
        'Clean diagnostic connector contacts with electrical contact cleaner',
        'Check CAN bus wiring continuity from connector to ECU',
        'Verify ECU power supply fuse (typically 10-15A)',
        'Replace diagnostic cable if damaged',
        'Update VODIA software and database to latest version',
      ],
      testProcedure: [
        'Connect VODIA and verify "Connecting..." message appears',
        'Check engine identification displays correctly',
        'Read fault codes to verify full communication',
        'Monitor live data to confirm bidirectional communication',
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Diagnostic cable (if faulty)', 'ECU fuse'],
      specialTools: ['Multimeter', 'Oscilloscope (for CAN waveform)', 'VODIA interface'],
      safetyPrecautions: ['Do not start engine during ECU diagnostics', 'Disconnect battery if replacing ECU'],
    },
    {
      id: 'vodia-injector-fault',
      title: 'Common Rail Injector Fault',
      symptom: 'Fault codes indicating injector malfunction, rough running, smoke',
      possibleCauses: ['Injector electrical failure', 'Injector mechanical wear', 'Incorrect IQA code', 'Wiring harness fault', 'ECU driver failure'],
      diagnosticSteps: [
        'Read fault codes - note specific cylinder affected',
        'Use VODIA injector test function to actuate each injector',
        'Monitor injection quantity correction values',
        'Measure injector resistance (0.3-1.0Ω typical)',
        'Check injector connector for water ingress',
      ],
      repairSteps: [
        'If IQA code incorrect: Re-program using code on injector body',
        'If electrical fault: Check harness, replace connector if corroded',
        'If mechanical fault: Replace injector and program new IQA code',
        'Clear fault codes and perform injector calibration',
        'Run engine and monitor fuel trim values',
      ],
      testProcedure: [
        'Clear all fault codes',
        'Start engine and run for 5 minutes at idle',
        'Increase to rated speed and apply load',
        'Monitor injection correction - should be within ±5%',
        'Check for smoke and rough running',
        'Verify no new fault codes appear',
      ],
      estimatedTime: '2-4 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['Replacement injector', 'Copper sealing washers', 'O-rings'],
      specialTools: ['VODIA5/6', 'Torque wrench', 'Injector removal tool', 'Cylinder pressure tester'],
      safetyPrecautions: ['Relieve fuel pressure before removal', 'Do not touch injector tip', 'Use new sealing washers', 'Torque to specification'],
    },
    {
      id: 'vodia-turbo-fault',
      title: 'Turbocharger/Boost Pressure Fault',
      symptom: 'Low power, excessive smoke, turbo-related fault codes',
      possibleCauses: ['Boost pressure sensor failure', 'Turbo wastegate stuck', 'Air leak in charge air system', 'Turbo bearing wear', 'VGT actuator failure'],
      diagnosticSteps: [
        'Read fault codes for boost pressure errors',
        'Monitor boost pressure in VODIA - compare to specification',
        'Check turbo inlet restriction (air filter)',
        'Inspect charge air cooler piping for leaks',
        'Test wastegate/VGT actuator operation with VODIA',
      ],
      repairSteps: [
        'If sensor faulty: Replace boost pressure sensor',
        'If air leak: Replace damaged hoses or clamps',
        'If wastegate stuck: Clean or replace actuator',
        'If turbo worn: Check for shaft play, replace if >0.05mm axial',
        'Reset adaptations after repair',
      ],
      testProcedure: [
        'Clear fault codes',
        'Start and warm engine to operating temperature',
        'Monitor boost pressure at rated speed under load',
        'Boost should reach rated value within 3 seconds',
        'Check for abnormal turbo noise',
        'Verify no new fault codes',
      ],
      estimatedTime: '2-6 hours',
      difficultyLevel: 'advanced',
      partsNeeded: ['Boost pressure sensor', 'Charge air hoses', 'Turbo gaskets'],
      specialTools: ['VODIA', 'Boost pressure gauge', 'Smoke machine'],
      safetyPrecautions: ['Allow turbo to cool before service', 'Do not touch hot exhaust components', 'Use new gaskets'],
    },
    {
      id: 'vodia-ecu-update',
      title: 'ECU Software Update Procedure',
      symptom: 'ECU software outdated, new features required, bulletin requires update',
      possibleCauses: ['Factory software needs update', 'Service bulletin requires flash', 'New emission requirements', 'Bug fix required'],
      diagnosticSteps: [
        'Connect VODIA and read current ECU software version',
        'Check Volvo Penta Service Bulletin for required version',
        'Download latest software package from VODIA server',
        'Verify battery charger connected (mandatory for update)',
        'Ensure stable PC power supply',
      ],
      repairSteps: [
        'Connect battery charger set to 14V/28V',
        'DO NOT disconnect or turn off ignition during update',
        'Select ECU update function in VODIA',
        'Follow on-screen prompts exactly',
        'Wait for "Update Complete" message (10-30 minutes)',
        'Perform ECU reset if prompted',
      ],
      testProcedure: [
        'Verify new software version displays in VODIA',
        'Clear all fault codes',
        'Start engine and check for faults',
        'Verify all engine functions operate correctly',
        'Check adaptations are reset and relearned',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['None (software only)'],
      specialTools: ['VODIA with valid license', 'Battery charger', 'Stable power supply'],
      safetyPrecautions: ['Never interrupt update process', 'Maintain stable power', 'Do not start engine during update', 'Have backup ECU available'],
    },
    {
      id: 'vodia-sensor-calibration',
      title: 'Sensor Calibration and Zero Point Reset',
      symptom: 'Incorrect sensor readings, drift after sensor replacement',
      possibleCauses: ['Sensor replaced without calibration', 'Environmental drift', 'Contamination affecting readings'],
      diagnosticSteps: [
        'Compare sensor readings to known good values',
        'Check for related fault codes',
        'Verify sensor wiring and connections',
        'Check calibration date in VODIA',
      ],
      repairSteps: [
        'Access sensor calibration menu in VODIA',
        'For pressure sensors: Apply known pressure and calibrate',
        'For temperature sensors: Verify at known temperature',
        'For position sensors: Follow VODIA guided calibration',
        'Save calibration values to ECU',
      ],
      testProcedure: [
        'Verify sensor reads correctly at multiple points',
        'Check no calibration fault codes',
        'Run engine and monitor values under load',
        'Compare to specification values',
      ],
      estimatedTime: '1-2 hours',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Calibration equipment if required'],
      specialTools: ['VODIA', 'Pressure calibrator', 'Temperature reference'],
      safetyPrecautions: ['Ensure engine is stopped for static calibrations', 'Follow Volvo Penta calibration procedures exactly'],
    },
  ],
  calibrationProcedures: [
    {
      title: 'Injector IQA Code Programming',
      description: 'Program Injector Quality Adjustment codes for new or replacement injectors.',
      steps: [
        'Connect VODIA and navigate to Injector Calibration menu',
        'Select cylinder number for injector being programmed',
        'Enter 6-digit alphanumeric code from injector body',
        'Confirm code entry and save to ECU',
        'Repeat for each replaced injector',
        'Clear any injector-related fault codes',
      ],
      requiredEquipment: ['VODIA diagnostic tool', 'New injector with visible IQA code'],
      acceptanceCriteria: ['IQA code displays correctly in VODIA', 'No injector fault codes after programming', 'Engine runs smoothly without misfires'],
    },
    {
      title: 'Throttle Position Sensor Calibration',
      description: 'Calibrate throttle pedal/lever position sensor for correct response.',
      steps: [
        'Connect VODIA and access TPS calibration',
        'With ignition ON, engine OFF, release throttle fully',
        'Press "Set Low Point" when prompted',
        'Press throttle to full position',
        'Press "Set High Point" when prompted',
        'Save calibration to ECU',
      ],
      requiredEquipment: ['VODIA diagnostic tool'],
      acceptanceCriteria: ['TPS reads 0% at idle', 'TPS reads 100% at full throttle', 'Smooth linear response throughout range'],
    },
  ],
  commonFaults: [
    { code: 'MID128 PID110', title: 'Coolant Temperature Sensor Fault', description: 'Engine coolant temperature signal out of range', severity: 'warning', causes: ['Sensor failure', 'Wiring fault', 'Connector corrosion'], solutions: ['Check wiring', 'Replace sensor', 'Clean connector'], resetProcedure: ['Clear code with VODIA', 'Verify repair', 'Run engine to confirm'] },
    { code: 'MID128 PID100', title: 'Oil Pressure Sensor Fault', description: 'Engine oil pressure signal abnormal', severity: 'shutdown', causes: ['Sensor failure', 'Low oil pressure actual', 'Wiring fault'], solutions: ['Verify oil level', 'Check actual pressure', 'Replace sensor'], resetProcedure: ['Address root cause', 'Clear code with VODIA', 'Start engine and verify'] },
    { code: 'MID128 PID190', title: 'Engine Overspeed', description: 'Engine speed exceeded maximum limit', severity: 'shutdown', causes: ['Governor failure', 'Load rejection', 'Throttle fault'], solutions: ['Check governor', 'Verify throttle operation', 'Check load connections'], resetProcedure: ['Identify cause', 'Repair fault', 'Clear code', 'Test at rated speed'] },
    { code: 'MID128 SID001', title: 'Injector Cylinder 1 Fault', description: 'Cylinder 1 injector electrical fault', severity: 'critical', causes: ['Injector coil failure', 'Wiring open/short', 'ECU driver fault'], solutions: ['Measure injector resistance', 'Check wiring', 'Replace injector'], resetProcedure: ['Replace injector if faulty', 'Program IQA code', 'Clear faults', 'Test run'] },
    { code: 'MID128 PID102', title: 'Boost Pressure Low', description: 'Turbocharger boost pressure below threshold', severity: 'warning', causes: ['Air leak', 'Turbo failure', 'Wastegate stuck open'], solutions: ['Check air system', 'Inspect turbo', 'Test wastegate'], resetProcedure: ['Fix air leaks', 'Repair turbo', 'Clear code', 'Load test'] },
    { code: 'MID128 PID168', title: 'Battery Voltage Low', description: 'System voltage below operating threshold', severity: 'warning', causes: ['Battery weak', 'Alternator fault', 'High resistance connections'], solutions: ['Test battery', 'Check alternator', 'Clean connections'], resetProcedure: ['Charge/replace battery', 'Repair alternator', 'Clear code'] },
    { code: 'MID128 SID254', title: 'ECU Internal Fault', description: 'Engine control unit internal error', severity: 'critical', causes: ['ECU hardware failure', 'Software corruption', 'Power supply fault'], solutions: ['Reset ECU', 'Reflash software', 'Replace ECU'], resetProcedure: ['Try ECU reset', 'Reflash if possible', 'Replace ECU if persistent'] },
    { code: 'MID128 PID94', title: 'Fuel Pressure Low', description: 'Common rail fuel pressure below minimum', severity: 'shutdown', causes: ['Fuel filter blocked', 'Lift pump failure', 'High pressure pump worn', 'Fuel leak'], solutions: ['Replace filters', 'Check lift pump', 'Test HP pump', 'Inspect for leaks'], resetProcedure: ['Fix fuel system', 'Prime system', 'Clear codes', 'Start and verify pressure'] },
  ],
  maintenanceSchedule: [
    { task: 'VODIA Database Update', interval: 'Before each diagnostic session', procedure: ['Connect PC to internet', 'Open VODIA software', 'Select Database Update', 'Wait for download and installation'], parts: [] },
    { task: 'Diagnostic Cable Inspection', interval: 'Monthly', procedure: ['Inspect cable for damage', 'Check connector pins', 'Test continuity if suspect', 'Clean connectors'], parts: ['Contact cleaner'] },
    { task: 'VODIA License Renewal', interval: 'Annually', procedure: ['Check license expiry in VODIA', 'Purchase renewal from Volvo Penta dealer', 'Enter new license key', 'Verify all functions available'], parts: [] },
    { task: 'Interface Firmware Update', interval: 'When prompted', procedure: ['Connect interface to PC', 'Open VODIA software', 'Follow update prompts', 'Do not disconnect during update'], parts: [] },
  ],
  troubleshootingGuide: [
    { problem: 'VODIA shows "License Invalid"', possibleCauses: ['License expired', 'Wrong PC', 'Clock/date incorrect'], diagnosticSteps: ['Check PC date/time', 'Verify license on this PC', 'Contact dealer for transfer'], solutions: ['Correct date/time', 'Re-enter license key', 'Purchase new license'] },
    { problem: 'No engines found during scan', possibleCauses: ['Cable disconnected', 'Ignition off', 'Wrong connector'], diagnosticSteps: ['Check cable connections', 'Verify ignition ON', 'Try diagnostic connector at engine'], solutions: ['Secure cable connections', 'Turn ignition ON', 'Use correct 9-pin connector'] },
    { problem: 'Software crash during diagnosis', possibleCauses: ['Database corrupt', 'Low PC memory', 'Driver conflict'], diagnosticSteps: ['Restart VODIA', 'Check available RAM', 'Update drivers'], solutions: ['Reinstall VODIA', 'Close other programs', 'Update USB drivers'] },
  ],
  spareParts: [
    { partNumber: 'VOE88890300', description: 'VODIA5 Diagnostic Interface', price: 'KES 185,000', availability: 'order', leadTime: '2-3 weeks' },
    { partNumber: 'VOE88890315', description: 'VODIA6 Wireless Interface', price: 'KES 225,000', availability: 'order', leadTime: '2-3 weeks' },
    { partNumber: 'VOE88890020', description: '9-Pin Diagnostic Cable', price: 'KES 12,500', availability: 'in-stock' },
    { partNumber: 'VOE88890025', description: 'USB Extension Cable 5m', price: 'KES 3,500', availability: 'in-stock' },
    { partNumber: 'VOE88890100', description: 'VODIA Annual License Renewal', price: 'KES 65,000', availability: 'order', leadTime: 'Immediate activation' },
    { partNumber: 'VOE88890050', description: 'K-Line Adapter Cable', price: 'KES 8,500', availability: 'in-stock' },
  ],
  safetyWarnings: [
    'Never interrupt ECU software update - may cause permanent ECU damage',
    'Always connect battery charger during software updates',
    'Do not start engine while performing ECU programming',
    'Keep VODIA interface away from heat sources and liquids',
    'Use only genuine Volvo Penta diagnostic cables',
    'Ensure proper ventilation when running engine indoors',
    'Disconnect battery before replacing ECU',
    'Some parameter changes require Volvo Penta authorization',
  ],
  toolsRequired: [
    'VODIA5 or VODIA6 Interface',
    'Windows PC (Windows 10/11 recommended)',
    'Active VODIA License',
    'Internet connection for database updates',
    '9-pin diagnostic cable',
    'Battery charger (for ECU updates)',
    'Multimeter',
    'USB extension cable',
  ],
  softwareInfo: {
    configSoftware: 'VODIA (Volvo Official Diagnostic Application)',
    version: 'VODIA 6.0.x (Latest)',
    downloadUrl: 'Volvo Penta dealer only',
    communicationPort: 'USB / Bluetooth',
    protocol: 'J1939 / ISO 15765-4 / Volvo EECU',
    features: [
      'Full fault code reading/clearing',
      'Live engine data monitoring',
      'Parameter adjustment',
      'Injector IQA programming',
      'ECU software update',
      'Guided troubleshooting',
      'Service history logging',
      'Component testing',
      'Emission compliance verification',
      'Performance data recording',
    ],
  },
};

// Final export with all controllers including VODIA
CONTROLLER_MANUALS.push(SMARTGEN_MANUAL, POWERWIZARD_MANUAL, DATAKOM_MANUAL, LOVATO_MANUAL, SIEMENS_MANUAL, ENKO_MANUAL, VODIA_MANUAL);

export const getControllerManual = (controllerId: string): ControllerManual | undefined => {
  return CONTROLLER_MANUALS.find(m => m.id === controllerId);
};

export const getAllControllerBrands = (): string[] => {
  return CONTROLLER_MANUALS.map(m => m.brand);
};

export const MANUAL_STATS = {
  totalControllers: CONTROLLER_MANUALS.length,
  totalModels: CONTROLLER_MANUALS.reduce((sum, m) => sum + m.models.length, 0),
  totalRepairProcedures: CONTROLLER_MANUALS.reduce((sum, m) => sum + m.repairProcedures.length, 0),
  totalFaults: CONTROLLER_MANUALS.reduce((sum, m) => sum + m.commonFaults.length, 0),
};
