/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * INDEPENDENT CONTROLLER REFERENCE DATABASE
 * Community-Sourced Troubleshooting Guides for Generator Controllers
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * DISCLAIMER: This is an INDEPENDENT reference database created for educational
 * and troubleshooting purposes. All brand names, model numbers, product names,
 * and trademarks are the property of their respective owners.
 *
 * This database is NOT affiliated with, endorsed by, or officially associated
 * with any controller manufacturer. All information is independently compiled
 * from publicly available sources and field experience.
 *
 * For official documentation, warranty service, or certified repairs, always
 * consult the manufacturer's authorized service centers and official manuals.
 *
 * All trademarks mentioned are property of their respective owners including:
 * Deep Sea Electronics®, ComAp®, Woodward®, SmartGen®, Datakom®, Lovato®,
 * Siemens®, Caterpillar®, Volvo Penta®, and others.
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
  colorCodeStandard?: string;
  schematicSections?: SchematicSection[];
  terminalBlocks?: TerminalBlock[];
  groundingRequirements?: string[];
  cableSpecifications?: CableSpec[];
}

export interface WiringConnection {
  terminal: string;
  function: string;
  wireColor: string;
  wireSize: string;
  notes: string;
  pinType?: 'input' | 'output' | 'power' | 'ground' | 'signal' | 'communication';
  voltage?: string;
  maxCurrent?: string;
}

export interface SchematicSection {
  name: string;
  description: string;
  connections: string[];
  diagram?: string;
}

export interface TerminalBlock {
  blockId: string;
  name: string;
  pins: TerminalPin[];
  location?: string;
}

export interface TerminalPin {
  pin: string;
  function: string;
  wireColor: string;
  wireSize: string;
  signalType: string;
  voltage?: string;
  notes?: string;
}

export interface CableSpec {
  cableType: string;
  cores: number;
  size: string;
  shielded: boolean;
  maxLength: string;
  application: string;
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
    description: 'DSE7320 Complete Wiring Diagram - Auto Mains Failure Controller',
    colorCodeStandard: 'IEC 60446 / BS 7671 (European Standard)',
    connections: [
      // Power Supply Block A
      { terminal: 'A1', function: 'Battery +ve (DC Supply)', wireColor: 'Red', wireSize: '2.5mm²', notes: 'Connect via 15A fuse, 8-35V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '2A continuous' },
      { terminal: 'A2', function: 'Battery -ve (DC Ground)', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Connect to chassis ground via star point', pinType: 'ground' },
      { terminal: 'A3', function: 'Charge Alternator W+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator W terminal for charge fail detection', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'A4', function: 'Auxiliary +ve Output', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Switched DC output for accessories', pinType: 'output', voltage: '12/24V DC', maxCurrent: '1A' },
      // Generator Voltage Sensing Block B
      { terminal: 'B1', function: 'Generator L1 Voltage Sense', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'B2', function: 'Generator L2 Voltage Sense', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'B3', function: 'Generator L3 Voltage Sense', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'B4', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Common neutral reference', pinType: 'input', voltage: '0V reference' },
      // Mains Voltage Sensing Block C
      { terminal: 'C1', function: 'Mains L1 Voltage Sense', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'C2', function: 'Mains L2 Voltage Sense', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'C3', function: 'Mains L3 Voltage Sense', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT if >300V, fuse 2A', pinType: 'input', voltage: '0-300V AC' },
      { terminal: 'C4', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Common neutral reference', pinType: 'input' },
      // Current Transformer Block D
      { terminal: 'D1', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT, observe polarity K→L', pinType: 'input', voltage: '0-5A AC' },
      { terminal: 'D2', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT secondary return, short if unused', pinType: 'input' },
      { terminal: 'D3', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '0-5A AC' },
      { terminal: 'D4', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT secondary return', pinType: 'input' },
      { terminal: 'D5', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '0-5A AC' },
      { terminal: 'D6', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT secondary return', pinType: 'input' },
      // Analog Sender Inputs Block E
      { terminal: 'E1', function: 'Oil Pressure Sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'VDO 10-184Ω or 0-10V/4-20mA configurable', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'E2', function: 'Coolant Temp Sender', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'VDO 10-184Ω or 0-10V/4-20mA configurable', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'E3', function: 'Fuel Level Sender', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'VDO 10-184Ω or 0-10V/4-20mA configurable', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'E4', function: 'Auxiliary Sender 1', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Configurable analog input', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'E5', function: 'Auxiliary Sender 2', wireColor: 'Green/Blue', wireSize: '1.0mm²', notes: 'Configurable analog input', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'E6', function: 'Sender Common Ground', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Common ground for all senders', pinType: 'ground' },
      // Magnetic Pickup Block F
      { terminal: 'F1', function: 'MPU Signal +ve (Magnetic Pickup)', wireColor: 'White', wireSize: '1.0mm²', notes: 'Twisted shielded pair, 0.5-50V AC', pinType: 'signal', voltage: '0.5-50V AC' },
      { terminal: 'F2', function: 'MPU Signal -ve (Shield)', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'Shield grounded at controller end ONLY', pinType: 'signal' },
      { terminal: 'F3', function: 'Auxiliary Speed Input', wireColor: 'White/Red', wireSize: '1.0mm²', notes: 'Alternative speed input or W terminal', pinType: 'signal' },
      // Relay Outputs Block G
      { terminal: 'G1', function: 'Start Relay Output NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'To starter solenoid via relay, 5A max', pinType: 'output', voltage: '12/24V DC', maxCurrent: '5A' },
      { terminal: 'G2', function: 'Start Relay Output COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Common for start relay', pinType: 'output' },
      { terminal: 'G3', function: 'Fuel Relay Output NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'To fuel solenoid, 5A max', pinType: 'output', voltage: '12/24V DC', maxCurrent: '5A' },
      { terminal: 'G4', function: 'Fuel Relay Output COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Common for fuel relay', pinType: 'output' },
      { terminal: 'G5', function: 'Gen Breaker Close NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Generator contactor close signal', pinType: 'output', voltage: '12/24V DC', maxCurrent: '5A' },
      { terminal: 'G6', function: 'Gen Breaker Close COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', notes: 'Common for gen breaker', pinType: 'output' },
      { terminal: 'G7', function: 'Mains Breaker Close NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains contactor close signal', pinType: 'output', voltage: '12/24V DC', maxCurrent: '5A' },
      { terminal: 'G8', function: 'Mains Breaker Close COM', wireColor: 'Violet/Black', wireSize: '2.5mm²', notes: 'Common for mains breaker', pinType: 'output' },
      { terminal: 'G9', function: 'Configurable Output 1 NO', wireColor: 'Grey/Pink', wireSize: '2.5mm²', notes: 'Programmable relay output', pinType: 'output', maxCurrent: '5A' },
      { terminal: 'G10', function: 'Configurable Output 2 NO', wireColor: 'Grey/Purple', wireSize: '2.5mm²', notes: 'Programmable relay output', pinType: 'output', maxCurrent: '5A' },
      // Digital Inputs Block H
      { terminal: 'H1', function: 'Emergency Stop Input', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact to ground, breaks circuit to stop', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H2', function: 'Remote Start Input', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO contact, close to start', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H3', function: 'Gen Breaker Aux Contact', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker position feedback', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H4', function: 'Mains Breaker Aux Contact', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Breaker position feedback', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H5', function: 'Low Fuel Level Switch', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'NC contact, opens on low fuel', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H6', function: 'High Coolant Temp Switch', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'NC contact, opens on high temp', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H7', function: 'Low Oil Pressure Switch', wireColor: 'Brown/Green', wireSize: '1.0mm²', notes: 'NC contact, opens on low pressure', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H8', function: 'Configurable Input 1', wireColor: 'Grey/White', wireSize: '1.0mm²', notes: 'Programmable digital input', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'H9', function: 'Digital Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Common ground for digital inputs', pinType: 'ground' },
    ],
    schematicSections: [
      {
        name: 'Power Supply Circuit',
        description: 'DC power input with reverse polarity and overvoltage protection',
        connections: ['A1→Fuse 15A→Battery +ve', 'A2→Chassis Ground Star Point', 'Internal: 12V/5V/3.3V regulators'],
        diagram: 'BATTERY(+)──[15A FUSE]──A1──[REVERSE DIODE]──[REGULATOR]──INTERNAL\n                            │\nBATTERY(-)─────────────────A2──[GND STAR]──CHASSIS'
      },
      {
        name: 'Generator Voltage Sensing',
        description: '3-phase voltage measurement with optional VT for HV applications',
        connections: ['B1/B2/B3→Phase L1/L2/L3 via 2A fuses', 'B4→Neutral reference', 'VT ratio configured in software'],
        diagram: 'GEN L1──[2A FUSE]──[VT 1:1 or ratio]──B1\nGEN L2──[2A FUSE]──[VT 1:1 or ratio]──B2\nGEN L3──[2A FUSE]──[VT 1:1 or ratio]──B3\nGEN N ────────────────────────────────B4'
      },
      {
        name: 'Current Transformer Circuit',
        description: '5A secondary CT input for power and energy metering',
        connections: ['CT installed on phase conductors', 'CT polarity K(P1)→L(P2) direction of current flow', 'Short unused CT secondaries'],
        diagram: 'PHASE L1─┬──[CT 5A]──┬─LOAD\n         │    │ │    │\n         │    K L    │\n         │    │ │    │\n         └────D1 D2──┘'
      },
      {
        name: 'Analog Sender Inputs',
        description: 'Configurable resistance or voltage/current inputs for engine sensors',
        connections: ['Resistive: 10-184Ω VDO standard', 'Voltage: 0-5V or 0-10V', 'Current: 4-20mA'],
        diagram: 'OIL SENDER──E1────┐\nTEMP SENDER──E2───┤\nFUEL SENDER──E3───┼──E6 (COMMON GND)\nAUX1 SENDER──E4───┤\nAUX2 SENDER──E5───┘'
      },
      {
        name: 'Engine Speed Input (MPU)',
        description: 'Magnetic pickup speed sensing from flywheel ring gear',
        connections: ['Twisted shielded pair required', 'Shield grounded at controller only', 'Typical 50-200 teeth', 'Gap 0.5-1.0mm'],
        diagram: 'FLYWHEEL RING GEAR\n        ↓\n[MAGNETIC PICKUP]──SHIELD──┐\n        │                  │\n       F1 (+)             GND\n       F2 (-)'
      },
      {
        name: 'Output Relay Connections',
        description: 'Configurable relay outputs for engine and breaker control',
        connections: ['Start: G1/G2 to starter solenoid relay', 'Fuel: G3/G4 to fuel solenoid', 'Gen Breaker: G5/G6', 'Mains Breaker: G7/G8'],
        diagram: 'BAT+──[FUSE]──[RELAY COIL]──G1 (NO)\n                    │\n              G2 (COM)──STARTER SOLENOID'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB-A',
        name: 'Power Supply Terminal Block',
        location: 'Top left of controller',
        pins: [
          { pin: 'A1', function: 'DC+ Supply', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-35V DC', notes: 'Fused 15A' },
          { pin: 'A2', function: 'DC- Ground', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground', notes: 'Star ground point' },
          { pin: 'A3', function: 'Charge W+', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Input', voltage: '0-35V DC' },
          { pin: 'A4', function: 'Aux DC Out', wireColor: 'Red/White', wireSize: '1.5mm²', signalType: 'Output', voltage: '12/24V DC' }
        ]
      },
      {
        blockId: 'TB-B',
        name: 'Generator Voltage Sensing',
        location: 'Top center',
        pins: [
          { pin: 'B1', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'B2', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'B3', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'B4', function: 'Gen Neutral', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB-C',
        name: 'Mains Voltage Sensing',
        location: 'Top center-right',
        pins: [
          { pin: 'C1', function: 'Mains L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'C2', function: 'Mains L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'C3', function: 'Mains L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Voltage', voltage: '0-300V AC' },
          { pin: 'C4', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB-D',
        name: 'Current Transformer Inputs',
        location: 'Middle row',
        pins: [
          { pin: 'D1', function: 'CT1 S1(k)', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT Input', voltage: '5A sec' },
          { pin: 'D2', function: 'CT1 S2(l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT Return' },
          { pin: 'D3', function: 'CT2 S1(k)', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT Input', voltage: '5A sec' },
          { pin: 'D4', function: 'CT2 S2(l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT Return' },
          { pin: 'D5', function: 'CT3 S1(k)', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT Input', voltage: '5A sec' },
          { pin: 'D6', function: 'CT3 S2(l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT Return' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply Cable', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery to controller DC supply' },
      { cableType: 'Generator Voltage Sensing', cores: 4, size: '1.5mm²', shielded: false, maxLength: '25m', application: '3-phase + neutral voltage sensing' },
      { cableType: 'Current Transformer Cable', cores: 6, size: '1.5mm²', shielded: true, maxLength: '15m', application: 'CT secondary connections' },
      { cableType: 'MPU Speed Sensor Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Magnetic pickup twisted pair' },
      { cableType: 'Analog Sensor Cable', cores: 6, size: '1.0mm²', shielded: true, maxLength: '20m', application: 'Oil pressure, temp, fuel senders' },
      { cableType: 'Digital Input Cable', cores: 10, size: '1.0mm²', shielded: false, maxLength: '25m', application: 'Switches and contact inputs' },
      { cableType: 'Relay Output Cable', cores: 12, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Relay output connections' },
      { cableType: 'RS485 Communication', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Modbus RTU communication' },
      { cableType: 'CAN Bus Cable', cores: 2, size: '0.5mm²', shielded: true, maxLength: '250m', application: 'J1939 CAN communication' },
      { cableType: 'Ethernet Cable', cores: 8, size: 'Cat5e/Cat6', shielded: true, maxLength: '100m', application: 'Network/SCADA communication' }
    ],
    groundingRequirements: [
      'Single point grounding (star configuration) at controller chassis',
      'Shield grounds connected at controller end ONLY to prevent ground loops',
      'Generator frame bonded to system ground via 16mm² green/yellow conductor',
      'Control panel metalwork bonded to genset frame',
      'Earth electrode resistance ≤10Ω for safety ground',
      'CT secondary circuits must NOT be grounded except at designated point',
      'EMC compliance requires 360° cable shield termination at connectors'
    ],
    notes: [
      'Always use shielded cable for MPU and analog sensor connections',
      'CT polarity must be correct - K(P1) toward source, L(P2) toward load',
      'Voltage sensing must be connected BEFORE the generator breaker',
      'Use HRC fuses rated for AC fault current on all power circuits',
      'Ground shield at controller end only to prevent ground loops',
      'Maintain minimum 100mm separation between power and signal cables',
      'Use cable glands rated IP65 or better for outdoor installations',
      'Voltage transformers required for generator voltage >300V AC',
      'Configure CT ratio in software to match installed CTs',
      'All unused CT secondaries MUST be shorted - never leave open circuit'
    ],
    wireColors: {
      'DC Supply +ve': 'Red',
      'DC Supply -ve': 'Black',
      'AC Phase L1': 'Brown (IEC) / Black (NEC)',
      'AC Phase L2': 'Black (IEC) / Red (NEC)',
      'AC Phase L3': 'Grey (IEC) / Blue (NEC)',
      'Neutral': 'Blue (IEC) / White (NEC)',
      'Earth/Ground': 'Green/Yellow striped',
      'Control Circuit': 'Orange',
      'Alarm/Warning': 'Yellow',
      'Start Circuit': 'Orange',
      'Stop Circuit': 'Red/White',
      'Interlock': 'Purple',
      'Analog Signal': 'Green',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Communication': 'Grey'
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
    description: 'InteliGen NT Complete Wiring Diagram - Multi-function Generator Controller',
    colorCodeStandard: 'IEC 60446 / BS 7671 (European Standard)',
    connections: [
      // Power Supply TB1
      { terminal: 'TB1-1', function: 'DC Power Supply +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A HRC fused, 8-36V DC input', pinType: 'power', voltage: '12/24V DC', maxCurrent: '3A peak' },
      { terminal: 'TB1-2', function: 'DC Power Supply -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Star point ground connection', pinType: 'ground' },
      { terminal: 'TB1-3', function: 'Charge Fail W+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator W terminal input', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'TB1-4', function: 'Switched +ve Output', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Accessory power output', pinType: 'output', maxCurrent: '2A' },
      // Generator Voltage TB2
      { terminal: 'TB2-1', function: 'Generator L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct <480V or via PT', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-2', function: 'Generator L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct <480V or via PT', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-3', function: 'Generator L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct <480V or via PT', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-4', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference point', pinType: 'input' },
      // Mains Voltage TB2 (continued)
      { terminal: 'TB2-5', function: 'Mains L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility supply L1', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-6', function: 'Mains L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Utility supply L2', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-7', function: 'Mains L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Utility supply L3', pinType: 'input', voltage: '0-480V AC' },
      { terminal: 'TB2-8', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility neutral', pinType: 'input' },
      // Current Transformers TB3
      { terminal: 'TB3-1', function: 'CT1 S1 (k) - L1', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary CT, polarity K→L', pinType: 'input', voltage: '5A sec' },
      { terminal: 'TB3-2', function: 'CT1 S2 (l) Common', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT secondary common', pinType: 'input' },
      { terminal: 'TB3-3', function: 'CT2 S1 (k) - L2', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '5A sec' },
      { terminal: 'TB3-4', function: 'CT2 S2 (l) Common', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT secondary common', pinType: 'input' },
      { terminal: 'TB3-5', function: 'CT3 S1 (k) - L3', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '5A sec' },
      { terminal: 'TB3-6', function: 'CT3 S2 (l) Common', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT secondary common', pinType: 'input' },
      // Speed Sensing TB4
      { terminal: 'TB4-1', function: 'MPU Speed Signal +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup positive', pinType: 'signal', voltage: '0.5-50V AC' },
      { terminal: 'TB4-2', function: 'MPU Speed Signal -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU negative/shield', pinType: 'signal' },
      { terminal: 'TB4-3', function: 'Secondary Speed Input', wireColor: 'White/Red', wireSize: '1.0mm²', notes: 'Backup speed or W terminal', pinType: 'signal' },
      // Analog Inputs TB5
      { terminal: 'TB5-1', function: 'Oil Pressure Input', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω or 4-20mA', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'TB5-2', function: 'Coolant Temperature', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω or 4-20mA', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'TB5-3', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω or 4-20mA', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'TB5-4', function: 'Auxiliary Analog 1', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Configurable analog input', pinType: 'input' },
      { terminal: 'TB5-5', function: 'Auxiliary Analog 2', wireColor: 'Green/Blue', wireSize: '1.0mm²', notes: 'Configurable analog input', pinType: 'input' },
      { terminal: 'TB5-6', function: 'Auxiliary Analog 3', wireColor: 'Green/Yellow', wireSize: '1.0mm²', notes: 'Configurable analog input', pinType: 'input' },
      { terminal: 'TB5-7', function: 'Analog Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Sensor ground reference', pinType: 'ground' },
      // Binary Inputs TB6
      { terminal: 'TB6-1', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact, opens to stop', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'TB6-2', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO contact, close to start', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'TB6-3', function: 'Gen CB Feedback', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Generator breaker position', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'TB6-4', function: 'Mains CB Feedback', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Mains breaker position', pinType: 'input', voltage: '0-35V DC' },
      { terminal: 'TB6-5', function: 'Binary Input 5', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'TB6-6', function: 'Binary Input 6', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'TB6-7', function: 'Binary Input 7', wireColor: 'Brown/Green', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'TB6-8', function: 'Binary Input 8', wireColor: 'Brown/Blue', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'TB6-9', function: 'Binary Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Digital input ground', pinType: 'ground' },
      // Relay Outputs TB7
      { terminal: 'TB7-1', function: 'Starter Relay NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Engine start output', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-2', function: 'Starter Relay COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Relay common', pinType: 'output' },
      { terminal: 'TB7-3', function: 'Fuel Solenoid NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel run output', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-4', function: 'Fuel Solenoid COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Relay common', pinType: 'output' },
      { terminal: 'TB7-5', function: 'Gen CB Close NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Generator breaker close', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-6', function: 'Gen CB Trip NO', wireColor: 'Purple/White', wireSize: '2.5mm²', notes: 'Generator breaker trip', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-7', function: 'Mains CB Close NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains breaker close', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-8', function: 'Mains CB Trip NO', wireColor: 'Violet/White', wireSize: '2.5mm²', notes: 'Mains breaker trip', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-9', function: 'Common Alarm NO', wireColor: 'Yellow/Red', wireSize: '2.5mm²', notes: 'Warning output', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'TB7-10', function: 'Shutdown Alarm NO', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'Shutdown output', pinType: 'output', maxCurrent: '8A' },
    ],
    schematicSections: [
      {
        name: 'DC Power Supply',
        description: 'Wide range DC input with protection circuitry',
        connections: ['TB1-1: +ve via 10A fuse', 'TB1-2: -ve to chassis star point', 'Internal regulation to 12V/5V/3.3V'],
        diagram: 'BATTERY(+)──[10A FUSE]──TB1-1──[REVERSE PROTECT]──[DC-DC]──INTERNAL\n                              │\nBATTERY(-)────────────────TB1-2──[STAR GND]──CHASSIS'
      },
      {
        name: 'Generator Voltage Measurement',
        description: 'Three-phase voltage sensing with optional PT ratio',
        connections: ['TB2-1/2/3: Phase L1/L2/L3', 'TB2-4: Neutral reference', 'Max direct: 480V AC'],
        diagram: 'GEN L1──[2A FUSE]──[PT if>480V]──TB2-1\nGEN L2──[2A FUSE]──[PT if>480V]──TB2-2\nGEN L3──[2A FUSE]──[PT if>480V]──TB2-3\nGEN N ────────────────────────TB2-4'
      },
      {
        name: 'Current Measurement',
        description: 'Three-phase CT input for power and protection',
        connections: ['5A secondary standard', 'Observe CT polarity K→L', 'Star connection at TB3-2/4/6'],
        diagram: 'PHASE─┬──[CT]──┬─LOAD\n      │  k│ │l │\n      │   │ │  │\n      └──TB3-1 TB3-2(COM)'
      },
      {
        name: 'Engine Speed Sensing',
        description: 'Magnetic pickup with shielded cable',
        connections: ['TB4-1: MPU +ve', 'TB4-2: MPU -ve and shield', 'Twisted pair required'],
        diagram: 'FLYWHEEL TEETH\n      ↓\n[MPU SENSOR]──SHIELD──┐\n     │                │\n    TB4-1 (+)         GND\n    TB4-2 (-)'
      },
      {
        name: 'Binary Inputs',
        description: 'Voltage-free contact or +ve voltage inputs',
        connections: ['Configurable polarity in InteliConfig', 'NC for safety inputs', 'NO for command inputs'],
        diagram: '+VE INPUT: Switch between TB6-x and +SUPPLY\n-VE INPUT: Switch between TB6-x and TB6-9(COM)'
      },
      {
        name: 'Relay Outputs',
        description: 'Heavy duty relay outputs for contactors',
        connections: ['8A @ 250VAC / 30VDC rating', 'Suppression diodes required for DC coils', 'Interposing relay for higher loads'],
        diagram: 'SUPPLY──[FUSE]──TB7-2(COM)\n                  │\n            [RELAY]\n                  │\n              TB7-1(NO)──LOAD──GND'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB1',
        name: 'Power Supply',
        location: 'Top left',
        pins: [
          { pin: '1', function: 'DC +ve', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-36V DC' },
          { pin: '2', function: 'DC -ve', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'W+ Input', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Input' },
          { pin: '4', function: 'Aux +ve', wireColor: 'Red/White', wireSize: '1.5mm²', signalType: 'Output' }
        ]
      },
      {
        blockId: 'TB2',
        name: 'Voltage Sensing',
        location: 'Top center',
        pins: [
          { pin: '1', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '2', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '3', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '4', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' },
          { pin: '5', function: 'Mains L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '6', function: 'Mains L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '7', function: 'Mains L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-480V' },
          { pin: '8', function: 'Mains N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB3',
        name: 'CT Inputs',
        location: 'Middle left',
        pins: [
          { pin: '1', function: 'CT1 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '2', function: 'CT COM', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' },
          { pin: '3', function: 'CT2 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '4', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' },
          { pin: '5', function: 'CT3 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '6', function: 'CT3 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Cable', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery DC supply' },
      { cableType: 'Generator Voltage', cores: 4, size: '1.5mm²', shielded: false, maxLength: '30m', application: 'AC voltage sensing' },
      { cableType: 'CT Cable', cores: 6, size: '2.5mm²', shielded: true, maxLength: '20m', application: 'Current transformer secondaries' },
      { cableType: 'MPU Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Speed sensing twisted pair' },
      { cableType: 'Analog Sensor', cores: 7, size: '1.0mm²', shielded: true, maxLength: '25m', application: 'Engine sensors' },
      { cableType: 'Binary Input', cores: 12, size: '1.0mm²', shielded: false, maxLength: '30m', application: 'Contact inputs' },
      { cableType: 'Relay Output', cores: 12, size: '2.5mm²', shielded: false, maxLength: '20m', application: 'Output wiring' },
      { cableType: 'CAN Bus', cores: 2, size: '0.75mm²', shielded: true, maxLength: '250m', application: 'J1939 CAN network' },
      { cableType: 'Ethernet', cores: 8, size: 'Cat5e', shielded: true, maxLength: '100m', application: 'Network connection' }
    ],
    groundingRequirements: [
      'Star point grounding at controller chassis',
      'Shield grounding at controller end only',
      'Generator frame earthed via 16mm² conductor',
      'Control panel bonded to genset frame',
      'CT secondaries NOT to be grounded separately',
      'Use equipotential bonding for EMC compliance'
    ],
    notes: [
      'Use shielded twisted pair for speed sensing',
      'CT polarity essential for correct power measurement',
      'Separate control and power cables by 100mm minimum',
      'Use suppression diodes on all DC inductive loads',
      'Voltage transformers required above 480V',
      'Configure CT ratio in InteliConfig to match installed CTs',
      'Ground shields at controller end only to prevent loops',
      'Use ferrules on all stranded wire terminations'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'AC Phase L1': 'Brown',
      'AC Phase L2': 'Black',
      'AC Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Control Output': 'Orange',
      'Alarm': 'Yellow/Red',
      'Communication': 'Grey'
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
    description: 'easYgen-3200 Complete Wiring - Industrial Generator Controller with Paralleling',
    colorCodeStandard: 'IEC 60446 and ANSI/NEMA compatible',
    connections: [
      // Power Supply X1
      { terminal: 'X1:1', function: 'DC Supply +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '15A fused, 8-32V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '4A' },
      { terminal: 'X1:2', function: 'DC Supply -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Star point ground', pinType: 'ground' },
      { terminal: 'X1:3', function: 'Switched DC Output', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Accessory power 1A', pinType: 'output', maxCurrent: '1A' },
      { terminal: 'X1:4', function: 'Charge Fail Input', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator W+', pinType: 'input' },
      // Generator Voltage X2
      { terminal: 'X2:1', function: 'Generator L1/A Phase', wireColor: 'Brown', wireSize: '1.5mm²', notes: '0-600V AC direct', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X2:2', function: 'Generator L2/B Phase', wireColor: 'Black', wireSize: '1.5mm²', notes: '0-600V AC direct', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X2:3', function: 'Generator L3/C Phase', wireColor: 'Grey', wireSize: '1.5mm²', notes: '0-600V AC direct', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X2:4', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference', pinType: 'input' },
      // Bus Voltage X3 (for paralleling)
      { terminal: 'X3:1', function: 'Bus L1/A Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Paralleling bus sense', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X3:2', function: 'Bus L2/B Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Paralleling bus sense', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X3:3', function: 'Bus L3/C Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Paralleling bus sense', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'X3:4', function: 'Bus Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Bus neutral', pinType: 'input' },
      // Current Transformers X4
      { terminal: 'X4:1', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary, polarity K→L', pinType: 'input', voltage: '5A sec' },
      { terminal: 'X4:2', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT1 return', pinType: 'input' },
      { terminal: 'X4:3', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary', pinType: 'input', voltage: '5A sec' },
      { terminal: 'X4:4', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT2 return', pinType: 'input' },
      { terminal: 'X4:5', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '5A secondary', pinType: 'input', voltage: '5A sec' },
      { terminal: 'X4:6', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT3 return', pinType: 'input' },
      // Speed Input X5
      { terminal: 'X5:1', function: 'MPU1 Speed +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Primary speed input', pinType: 'signal', voltage: '0.5-50V AC' },
      { terminal: 'X5:2', function: 'MPU1 Speed -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU1 return/shield', pinType: 'signal' },
      { terminal: 'X5:3', function: 'MPU2 Speed +', wireColor: 'White/Red', wireSize: '1.0mm²', notes: 'Backup speed input', pinType: 'signal', voltage: '0.5-50V AC' },
      { terminal: 'X5:4', function: 'MPU2 Speed -', wireColor: 'White/Blue', wireSize: '1.0mm²', notes: 'MPU2 return/shield', pinType: 'signal' },
      // Analog Inputs X6
      { terminal: 'X6:1', function: 'Oil Pressure Sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Resistive/4-20mA/0-10V', pinType: 'input', voltage: '0-10V DC' },
      { terminal: 'X6:2', function: 'Coolant Temperature', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Resistive/4-20mA/0-10V', pinType: 'input', voltage: '0-10V DC' },
      { terminal: 'X6:3', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Resistive/4-20mA/0-10V', pinType: 'input', voltage: '0-10V DC' },
      { terminal: 'X6:4', function: 'Aux Analog 1', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Configurable analog', pinType: 'input' },
      { terminal: 'X6:5', function: 'Aux Analog 2', wireColor: 'Green/Blue', wireSize: '1.0mm²', notes: 'Configurable analog', pinType: 'input' },
      { terminal: 'X6:6', function: 'Aux Analog 3', wireColor: 'Green/Yellow', wireSize: '1.0mm²', notes: 'Configurable analog', pinType: 'input' },
      { terminal: 'X6:7', function: 'Aux Analog 4', wireColor: 'Green/Brown', wireSize: '1.0mm²', notes: 'Configurable analog', pinType: 'input' },
      { terminal: 'X6:8', function: 'Aux Analog 5', wireColor: 'Green/Grey', wireSize: '1.0mm²', notes: 'Configurable analog', pinType: 'input' },
      { terminal: 'X6:9', function: 'Analog Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Sensor ground', pinType: 'ground' },
      // Digital Inputs X7
      { terminal: 'X7:1', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC safety input', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:2', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO start command', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:3', function: 'Gen CB Feedback', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker aux contact', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:4', function: 'Bus CB Feedback', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Bus breaker position', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:5', function: 'Sync Enable', wireColor: 'Purple/White', wireSize: '1.0mm²', notes: 'Permit synchronization', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:6', function: 'Load Share Enable', wireColor: 'Purple/Black', wireSize: '1.0mm²', notes: 'Enable load sharing', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:7-16', function: 'Digital Inputs 7-16', wireColor: 'Various', wireSize: '1.0mm²', notes: 'Configurable inputs', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'X7:17', function: 'Digital Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input ground reference', pinType: 'ground' },
      // Relay Outputs X8
      { terminal: 'X8:1', function: 'Starter Output NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Engine start relay', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X8:2', function: 'Starter Output NC', wireColor: 'Orange/White', wireSize: '2.5mm²', notes: 'Start relay NC', pinType: 'output' },
      { terminal: 'X8:3', function: 'Starter Output COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start relay common', pinType: 'output' },
      { terminal: 'X8:4', function: 'Fuel Solenoid NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel run output', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X8:5', function: 'Fuel Solenoid NC', wireColor: 'Pink/White', wireSize: '2.5mm²', notes: 'Fuel NC contact', pinType: 'output' },
      { terminal: 'X8:6', function: 'Fuel Solenoid COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel common', pinType: 'output' },
      { terminal: 'X8:7', function: 'Gen CB Close NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Gen breaker close', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X8:8', function: 'Gen CB Trip NO', wireColor: 'Purple/Red', wireSize: '2.5mm²', notes: 'Gen breaker trip', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X8:9', function: 'Governor/AVR Raise', wireColor: 'Grey/Red', wireSize: '2.5mm²', notes: 'Speed/voltage raise', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X8:10', function: 'Governor/AVR Lower', wireColor: 'Grey/Black', wireSize: '2.5mm²', notes: 'Speed/voltage lower', pinType: 'output', maxCurrent: '10A' },
      // Analog Outputs X9
      { terminal: 'X9:1', function: 'Analog Out 1+', wireColor: 'Grey', wireSize: '1.0mm²', notes: '4-20mA governor control', pinType: 'output', maxCurrent: '20mA' },
      { terminal: 'X9:2', function: 'Analog Out 1-', wireColor: 'Grey/White', wireSize: '1.0mm²', notes: 'Analog out return', pinType: 'output' },
      { terminal: 'X9:3', function: 'Analog Out 2+', wireColor: 'Grey/Red', wireSize: '1.0mm²', notes: '4-20mA AVR control', pinType: 'output', maxCurrent: '20mA' },
      { terminal: 'X9:4', function: 'Analog Out 2-', wireColor: 'Grey/Black', wireSize: '1.0mm²', notes: 'Analog out return', pinType: 'output' },
    ],
    schematicSections: [
      {
        name: 'Power Supply',
        description: 'Wide-range DC input with redundant protection',
        connections: ['X1:1 +ve via 15A fuse', 'X1:2 -ve to star ground', 'Internal protection against reverse polarity'],
        diagram: 'BATTERY(+)──[15A FUSE]──X1:1──[REVERSE PROT]──[DC-DC]──INTERNAL\n                              │\nBATTERY(-)────────────────X1:2──[STAR GND]──CHASSIS'
      },
      {
        name: 'Generator Voltage Sensing',
        description: 'Direct sensing up to 600V AC, 3-phase + neutral',
        connections: ['X2:1-3 Phase L1/L2/L3 via 2A fuses', 'X2:4 Neutral', 'Optional VT for >600V'],
        diagram: 'GEN L1──[2A FUSE]──X2:1\nGEN L2──[2A FUSE]──X2:2\nGEN L3──[2A FUSE]──X2:3\nGEN N ────────────X2:4'
      },
      {
        name: 'Bus Voltage for Paralleling',
        description: 'Bus sensing for synchronization and parallel operation',
        connections: ['X3:1-3 Bus phases', 'X3:4 Bus neutral', 'Connect after bus breaker'],
        diagram: 'BUS L1──[2A FUSE]──X3:1\nBUS L2──[2A FUSE]──X3:2\nBUS L3──[2A FUSE]──X3:3\nBUS N ────────────X3:4'
      },
      {
        name: 'Current Transformer Circuit',
        description: 'Three-phase CT measurement for protection and metering',
        connections: ['5A secondary CTs', 'K→L polarity toward load', 'Star CT secondaries at controller'],
        diagram: 'PHASE─┬──[CT 5A]──┬─LOAD\n      │   k │ l   │\n      │     │     │\n      └───X4:1  X4:2(COM)'
      },
      {
        name: 'Engine Speed MPU',
        description: 'Dual redundant speed sensing',
        connections: ['X5:1-2 Primary MPU', 'X5:3-4 Backup MPU', 'Shielded twisted pairs'],
        diagram: 'PRIMARY MPU──X5:1 (+)\n              X5:2 (-/SHIELD)\nBACKUP MPU───X5:3 (+)\n              X5:4 (-/SHIELD)'
      },
      {
        name: 'Governor/AVR Control',
        description: '4-20mA isolated analog outputs',
        connections: ['X9:1-2 Governor speed control', 'X9:3-4 AVR voltage control', 'Isolated outputs'],
        diagram: 'GOVERNOR──[+]──X9:1\n           [−]──X9:2\nAVR───────[+]──X9:3\n           [−]──X9:4'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'X1',
        name: 'Power Supply',
        location: 'Left side top',
        pins: [
          { pin: '1', function: 'DC +ve', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-32V DC' },
          { pin: '2', function: 'DC -ve', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'Aux +ve Out', wireColor: 'Red/White', wireSize: '1.5mm²', signalType: 'Output' },
          { pin: '4', function: 'W+ Input', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Input' }
        ]
      },
      {
        blockId: 'X2',
        name: 'Generator Voltage',
        location: 'Left side center',
        pins: [
          { pin: '1', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-600V' },
          { pin: '2', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-600V' },
          { pin: '3', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-600V' },
          { pin: '4', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'X4',
        name: 'CT Inputs',
        location: 'Middle row',
        pins: [
          { pin: '1', function: 'CT1 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '2', function: 'CT1 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' },
          { pin: '3', function: 'CT2 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '4', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' },
          { pin: '5', function: 'CT3 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '6', function: 'CT3 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Battery DC supply' },
      { cableType: 'Generator Voltage', cores: 4, size: '1.5mm²', shielded: false, maxLength: '30m', application: 'AC voltage sensing' },
      { cableType: 'Bus Voltage', cores: 4, size: '1.5mm²', shielded: false, maxLength: '50m', application: 'Paralleling bus sense' },
      { cableType: 'CT Secondary', cores: 6, size: '2.5mm²', shielded: true, maxLength: '20m', application: 'Current transformer' },
      { cableType: 'MPU Speed', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Magnetic pickup' },
      { cableType: 'Analog Sensors', cores: 9, size: '1.0mm²', shielded: true, maxLength: '30m', application: 'Engine sensors' },
      { cableType: 'Digital Inputs', cores: 18, size: '1.0mm²', shielded: false, maxLength: '30m', application: 'Contact inputs' },
      { cableType: 'Relay Outputs', cores: 12, size: '2.5mm²', shielded: false, maxLength: '25m', application: 'Relay wiring' },
      { cableType: 'Analog Outputs', cores: 4, size: '1.0mm²', shielded: true, maxLength: '100m', application: 'Gov/AVR control' },
      { cableType: 'CAN Bus', cores: 2, size: '0.75mm²', shielded: true, maxLength: '250m', application: 'J1939 CAN network' },
      { cableType: 'Profibus', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Process bus' }
    ],
    groundingRequirements: [
      'Single point star grounding at controller',
      'Shield grounds at controller end only',
      'Generator frame bonded to system ground 16mm²',
      'Use equipotential bonding per IEC 60364-4-41',
      'CT secondaries NOT to be separately grounded',
      '360° shield termination for EMC compliance',
      'Minimum 10Ω ground electrode resistance'
    ],
    notes: [
      'Follow Woodward EMC installation guidelines',
      'Separate analog and digital cables minimum 100mm',
      'Use shielded cables for all communications',
      'Ground shields at controller end only',
      'CT polarity: K (P1) toward source, L (P2) toward load',
      'Use ferrules on all stranded terminations',
      'Max voltage sensing 600V AC direct',
      'Configure CT/PT ratios in ToolKit software',
      'Relay contacts rated 10A resistive, derate for inductive',
      'Use external interposing relays for high-current loads'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'AC Phase A/L1': 'Brown (IEC) / Black (ANSI)',
      'AC Phase B/L2': 'Black (IEC) / Red (ANSI)',
      'AC Phase C/L3': 'Grey (IEC) / Blue (ANSI)',
      'Neutral': 'Blue (IEC) / White (ANSI)',
      'Earth/Ground': 'Green/Yellow',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Control Output': 'Orange',
      'Alarm': 'Yellow',
      'Analog Signal': 'Grey',
      'Communication': 'Grey shielded'
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
    description: 'SmartGen HGM6320/HGM9320 Complete Wiring Diagram - AMF Generator Controller',
    colorCodeStandard: 'IEC 60446 / Chinese GB Standard',
    connections: [
      // Power Supply
      { terminal: '1', function: 'DC Power +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A fused, 8-35V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '2A' },
      { terminal: '2', function: 'DC Power -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'System ground', pinType: 'ground' },
      // Generator Voltage Sensing
      { terminal: '3', function: 'Generator L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '4', function: 'Generator L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '5', function: 'Generator L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '6', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference', pinType: 'input' },
      // Mains Voltage Sensing
      { terminal: '7', function: 'Mains L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility L1 sensing', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '8', function: 'Mains L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Utility L2 sensing', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '9', function: 'Mains L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Utility L3 sensing', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '10', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility neutral', pinType: 'input' },
      // Current Transformer Inputs
      { terminal: '11', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '12', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT1 return', pinType: 'input' },
      { terminal: '13', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '14', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT2 return', pinType: 'input' },
      { terminal: '15', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A secondary CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '16', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT3 return', pinType: 'input' },
      // Speed Input
      { terminal: '17', function: 'MPU Speed Signal +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup positive', pinType: 'signal', voltage: '1-50V AC' },
      { terminal: '18', function: 'MPU Speed Signal -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU negative/shield', pinType: 'signal' },
      // Analog Sensor Inputs
      { terminal: '19', function: 'Oil Pressure Sender', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '20', function: 'Coolant Temperature', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '21', function: 'Fuel Level Sender', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '22', function: 'Auxiliary Analog Input', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Configurable resistive', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '23', function: 'Sensor Common Ground', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Ground for all senders', pinType: 'ground' },
      // Digital Inputs
      { terminal: '24', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact to ground', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '25', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO contact close to start', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '26', function: 'Gen Breaker Feedback', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker aux contact', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '27', function: 'Mains Breaker Feedback', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Mains breaker aux', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '28', function: 'Configurable Input 1', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '29', function: 'Configurable Input 2', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '30', function: 'Digital Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input common ground', pinType: 'ground' },
      // Relay Outputs
      { terminal: '31', function: 'Starter Output NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Start solenoid', pinType: 'output', maxCurrent: '5A' },
      { terminal: '32', function: 'Starter Output COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start relay common', pinType: 'output' },
      { terminal: '33', function: 'Fuel Solenoid NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel run output', pinType: 'output', maxCurrent: '5A' },
      { terminal: '34', function: 'Fuel Solenoid COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel relay common', pinType: 'output' },
      { terminal: '35', function: 'Gen Breaker Close NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Gen contactor close', pinType: 'output', maxCurrent: '5A' },
      { terminal: '36', function: 'Gen Breaker Close COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', notes: 'Gen relay common', pinType: 'output' },
      { terminal: '37', function: 'Mains Breaker Close NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains contactor close', pinType: 'output', maxCurrent: '5A' },
      { terminal: '38', function: 'Mains Breaker Close COM', wireColor: 'Violet/Black', wireSize: '2.5mm²', notes: 'Mains relay common', pinType: 'output' },
      { terminal: '39', function: 'Common Alarm NO', wireColor: 'Yellow', wireSize: '2.5mm²', notes: 'Warning output', pinType: 'output', maxCurrent: '5A' },
      { terminal: '40', function: 'Shutdown Alarm NO', wireColor: 'Yellow/Red', wireSize: '2.5mm²', notes: 'Shutdown output', pinType: 'output', maxCurrent: '5A' },
      // Charge Alternator
      { terminal: '41', function: 'Charge Alt W+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator W terminal', pinType: 'input', voltage: '0-35V DC' },
    ],
    schematicSections: [
      {
        name: 'DC Power Supply',
        description: 'Wide range DC input with protection',
        connections: ['Pin 1: +ve via 10A fuse', 'Pin 2: -ve to chassis ground', 'Internal: 5V/3.3V regulators'],
        diagram: 'BATTERY(+)──[10A FUSE]──PIN1──[PROTECTION]──INTERNAL\n                            │\nBATTERY(-)─────────────────PIN2──CHASSIS GND'
      },
      {
        name: 'Generator & Mains Voltage',
        description: 'Three-phase voltage measurement for generator and utility',
        connections: ['Pins 3-6: Generator L1/L2/L3/N', 'Pins 7-10: Mains L1/L2/L3/N', 'Via PT if >300V'],
        diagram: 'GEN L1──[2A FUSE]──PIN3      MAINS L1──[2A FUSE]──PIN7\nGEN L2──[2A FUSE]──PIN4      MAINS L2──[2A FUSE]──PIN8\nGEN L3──[2A FUSE]──PIN5      MAINS L3──[2A FUSE]──PIN9\nGEN N ────────────PIN6      MAINS N ────────────PIN10'
      },
      {
        name: 'Current Transformers',
        description: '5A secondary CT inputs for power metering',
        connections: ['3 CTs, 5A secondary', 'Polarity K(P1)→L(P2) toward load', 'Short unused CTs'],
        diagram: 'L1 PHASE──[CT 5A]──LOAD\n           k │ l\n             │\n          PIN11 PIN12(COM)'
      },
      {
        name: 'Engine Speed MPU',
        description: 'Magnetic pickup for flywheel speed',
        connections: ['Pins 17-18: Twisted shielded pair', 'Gap 0.5-1.0mm', 'Shield at controller'],
        diagram: 'RING GEAR\n    ↓\n[MPU]──SHIELD──GND\n  │\n PIN17(+)\n PIN18(-)'
      },
      {
        name: 'Analog Sensors',
        description: 'VDO-compatible resistive sensor inputs',
        connections: ['Pins 19-22: Sensor signals', 'Pin 23: Sensor ground', 'Resistive 10-184Ω'],
        diagram: 'OIL SENDER──PIN19──┐\nTEMP SENDER─PIN20──┤\nFUEL SENDER─PIN21──┼──PIN23 (GND)\nAUX SENDER──PIN22──┘'
      },
      {
        name: 'Relay Outputs',
        description: 'Engine and breaker control outputs',
        connections: ['Start: 31-32', 'Fuel: 33-34', 'Gen CB: 35-36', 'Mains CB: 37-38'],
        diagram: '+VE──[FUSE]──PIN32(COM)──[RELAY]──PIN31(NO)──STARTER'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB-POWER',
        name: 'Power & Voltage',
        location: 'Top row',
        pins: [
          { pin: '1', function: 'DC +ve', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-35V DC' },
          { pin: '2', function: 'DC -ve', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-300V' },
          { pin: '4', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-300V' },
          { pin: '5', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC Input', voltage: '0-300V' },
          { pin: '6', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB-CT',
        name: 'Current Transformers',
        location: 'Middle row',
        pins: [
          { pin: '11', function: 'CT1 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '12', function: 'CT1 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' },
          { pin: '13', function: 'CT2 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '14', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' },
          { pin: '15', function: 'CT3 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '16', function: 'CT3 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' }
        ]
      },
      {
        blockId: 'TB-OUTPUT',
        name: 'Relay Outputs',
        location: 'Bottom row',
        pins: [
          { pin: '31', function: 'Start NO', wireColor: 'Orange', wireSize: '2.5mm²', signalType: 'Output', notes: '5A' },
          { pin: '32', function: 'Start COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', signalType: 'Output' },
          { pin: '33', function: 'Fuel NO', wireColor: 'Pink', wireSize: '2.5mm²', signalType: 'Output', notes: '5A' },
          { pin: '34', function: 'Fuel COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', signalType: 'Output' },
          { pin: '35', function: 'Gen CB NO', wireColor: 'Purple', wireSize: '2.5mm²', signalType: 'Output', notes: '5A' },
          { pin: '36', function: 'Gen CB COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', signalType: 'Output' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery DC' },
      { cableType: 'Voltage Sensing', cores: 8, size: '1.5mm²', shielded: false, maxLength: '25m', application: 'Gen + Mains voltage' },
      { cableType: 'CT Cable', cores: 6, size: '1.5mm²', shielded: true, maxLength: '15m', application: 'CT secondaries' },
      { cableType: 'MPU Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Speed sensing' },
      { cableType: 'Sensor Cable', cores: 5, size: '1.0mm²', shielded: true, maxLength: '20m', application: 'Analog sensors' },
      { cableType: 'Digital Input', cores: 8, size: '1.0mm²', shielded: false, maxLength: '25m', application: 'Contact inputs' },
      { cableType: 'Relay Output', cores: 12, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Relay wiring' },
      { cableType: 'RS485', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Modbus communication' }
    ],
    groundingRequirements: [
      'Star point ground at controller',
      'Shield grounded at controller end only',
      'Generator frame bonded to ground',
      'CT secondaries not separately grounded',
      'Use equipotential bonding'
    ],
    notes: [
      'Use shielded cable for MPU speed sensor',
      'CT polarity: K toward source, L toward load',
      'Voltage transformers required above 300V',
      'Configure CT ratio in software',
      'Ground shields at controller only',
      'Use ferrules on stranded wires',
      'Budget-friendly with standard connectors',
      'Relay outputs 5A max - use interposing relay for higher loads'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'Phase L1': 'Brown',
      'Phase L2': 'Black',
      'Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Analog Signal': 'Green',
      'Control Output': 'Orange',
      'Alarm': 'Yellow'
    },
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
    description: 'Caterpillar PowerWizard 2.0/2.1 Complete Wiring Diagram',
    colorCodeStandard: 'Caterpillar SEBU Standard / SAE J1128',
    connections: [
      // Power Supply J1
      { terminal: 'J1-1', function: 'Battery +ve Supply', wireColor: 'Red', wireSize: '2.5mm²', notes: '15A fused, 10-32V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '5A' },
      { terminal: 'J1-2', function: 'Battery -ve Ground', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Connect to engine block ground', pinType: 'ground' },
      { terminal: 'J1-3', function: 'Key Switch Input', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Ignition switch signal', pinType: 'input', voltage: '12/24V DC' },
      { terminal: 'J1-4', function: 'Charge Alternator D+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Charge excitation', pinType: 'output', maxCurrent: '3A' },
      // CAN Bus J2 (Engine ECM Communication)
      { terminal: 'J2-1', function: 'CAN High (J1939)', wireColor: 'Yellow', wireSize: '0.75mm²', notes: 'ECM communication CAN_H', pinType: 'communication', voltage: '2.5-3.5V' },
      { terminal: 'J2-2', function: 'CAN Low (J1939)', wireColor: 'Green', wireSize: '0.75mm²', notes: 'ECM communication CAN_L', pinType: 'communication', voltage: '1.5-2.5V' },
      { terminal: 'J2-3', function: 'CAN Shield/Ground', wireColor: 'Black', wireSize: '0.75mm²', notes: 'Shield drain wire', pinType: 'ground' },
      // Generator Voltage J3
      { terminal: 'J3-1', function: 'Generator L1/A Phase', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct 0-600V or via PT', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-2', function: 'Generator L2/B Phase', wireColor: 'Orange', wireSize: '1.5mm²', notes: 'Direct 0-600V or via PT', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-3', function: 'Generator L3/C Phase', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Direct 0-600V or via PT', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-4', function: 'Generator Neutral', wireColor: 'White', wireSize: '1.5mm²', notes: 'Neutral reference', pinType: 'input' },
      // Mains/Utility Voltage J3 (continued)
      { terminal: 'J3-5', function: 'Utility L1/A Phase', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility supply sensing', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-6', function: 'Utility L2/B Phase', wireColor: 'Orange', wireSize: '1.5mm²', notes: 'Utility supply sensing', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-7', function: 'Utility L3/C Phase', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility supply sensing', pinType: 'input', voltage: '0-600V AC' },
      { terminal: 'J3-8', function: 'Utility Neutral', wireColor: 'White', wireSize: '1.5mm²', notes: 'Utility neutral', pinType: 'input' },
      // Current Transformers J4
      { terminal: 'J4-1', function: 'CT L1 S1 (X1)', wireColor: 'Black', wireSize: '2.5mm²', notes: '5A CT, polarity X1→X2', pinType: 'input', voltage: '5A sec' },
      { terminal: 'J4-2', function: 'CT L1 S2 (X2)', wireColor: 'White', wireSize: '2.5mm²', notes: 'CT1 secondary return', pinType: 'input' },
      { terminal: 'J4-3', function: 'CT L2 S1 (X1)', wireColor: 'Black', wireSize: '2.5mm²', notes: '5A CT secondary', pinType: 'input', voltage: '5A sec' },
      { terminal: 'J4-4', function: 'CT L2 S2 (X2)', wireColor: 'White', wireSize: '2.5mm²', notes: 'CT2 secondary return', pinType: 'input' },
      { terminal: 'J4-5', function: 'CT L3 S1 (X1)', wireColor: 'Black', wireSize: '2.5mm²', notes: '5A CT secondary', pinType: 'input', voltage: '5A sec' },
      { terminal: 'J4-6', function: 'CT L3 S2 (X2)', wireColor: 'White', wireSize: '2.5mm²', notes: 'CT3 secondary return', pinType: 'input' },
      // Digital Inputs J5
      { terminal: 'J5-1', function: 'Emergency Stop', wireColor: 'Red', wireSize: '1.0mm²', notes: 'NC contact, Category 0 stop', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-2', function: 'Remote Start', wireColor: 'Pink', wireSize: '1.0mm²', notes: 'NO contact, close to start', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-3', function: 'Gen Breaker Aux', wireColor: 'Purple', wireSize: '1.0mm²', notes: 'Breaker position 52a', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-4', function: 'Utility Breaker Aux', wireColor: 'Blue', wireSize: '1.0mm²', notes: 'Utility breaker position', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-5', function: 'Low Fuel Level', wireColor: 'Tan', wireSize: '1.0mm²', notes: 'NC contact, opens low fuel', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-6', function: 'High Coolant Temp', wireColor: 'Tan/White', wireSize: '1.0mm²', notes: 'NC contact, opens high temp', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-7', function: 'Configurable Input 1', wireColor: 'Grey', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-8', function: 'Configurable Input 2', wireColor: 'Grey/White', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-9', function: 'Configurable Input 3', wireColor: 'Grey/Black', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-10', function: 'Configurable Input 4', wireColor: 'Grey/Red', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '0-32V DC' },
      { terminal: 'J5-11', function: 'Digital Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input ground reference', pinType: 'ground' },
      // Relay Outputs J6
      { terminal: 'J6-1', function: 'Starter Relay NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Start solenoid drive', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-2', function: 'Starter Relay COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start relay common', pinType: 'output' },
      { terminal: 'J6-3', function: 'Fuel Solenoid NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Run solenoid', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-4', function: 'Fuel Solenoid COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel common', pinType: 'output' },
      { terminal: 'J6-5', function: 'Gen Breaker Close', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Generator 52C', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-6', function: 'Gen Breaker Trip', wireColor: 'Purple/White', wireSize: '2.5mm²', notes: 'Generator 52T', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-7', function: 'Utility Breaker Close', wireColor: 'Blue', wireSize: '2.5mm²', notes: 'Utility 52C', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-8', function: 'Utility Breaker Trip', wireColor: 'Blue/White', wireSize: '2.5mm²', notes: 'Utility 52T', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-9', function: 'Warning Alarm', wireColor: 'Yellow', wireSize: '2.5mm²', notes: 'Warning output', pinType: 'output', maxCurrent: '8A' },
      { terminal: 'J6-10', function: 'Shutdown Alarm', wireColor: 'Yellow/Red', wireSize: '2.5mm²', notes: 'Shutdown output', pinType: 'output', maxCurrent: '8A' },
      // Analog Sensors J7
      { terminal: 'J7-1', function: 'Oil Pressure (Backup)', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Resistive sender backup', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'J7-2', function: 'Coolant Temp (Backup)', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Resistive sender backup', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'J7-3', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Resistive fuel sender', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'J7-4', function: 'Coolant Level', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Resistive level sender', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'J7-5', function: 'Auxiliary Analog 1', wireColor: 'Green/Blue', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'J7-6', function: 'Auxiliary Analog 2', wireColor: 'Green/Yellow', wireSize: '1.0mm²', notes: 'Configurable input', pinType: 'input' },
      { terminal: 'J7-7', function: 'Sensor Ground', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Sensor common ground', pinType: 'ground' },
      // Communication J8
      { terminal: 'J8-1', function: 'RS485 A (+)', wireColor: 'Blue', wireSize: '0.5mm²', notes: 'Modbus data +', pinType: 'communication' },
      { terminal: 'J8-2', function: 'RS485 B (-)', wireColor: 'White', wireSize: '0.5mm²', notes: 'Modbus data -', pinType: 'communication' },
      { terminal: 'J8-3', function: 'RS485 Ground', wireColor: 'Black', wireSize: '0.5mm²', notes: 'Communication ground', pinType: 'ground' },
    ],
    schematicSections: [
      {
        name: 'DC Power Supply',
        description: 'Wide range DC input for 12V/24V systems',
        connections: ['J1-1: Battery +ve via 15A fuse', 'J1-2: Battery -ve to engine block', 'J1-3: Key switch ignition'],
        diagram: 'BATTERY(+)──[15A FUSE]──J1-1──[INTERNAL PROTECTION]──MCU\n                              │\nBATTERY(-)────────────────J1-2──ENGINE BLOCK GND'
      },
      {
        name: 'Engine ECM CAN Bus',
        description: 'J1939 CAN communication with Cat ECM',
        connections: ['J2-1: CAN_H Yellow', 'J2-2: CAN_L Green', 'J2-3: Shield/GND', '120Ω termination at each end'],
        diagram: 'POWERWIZARD──[120Ω]──CAN_H (J2-1)──────ECM\n                     CAN_L (J2-2)──────ECM\n                     SHIELD (J2-3)─────GND'
      },
      {
        name: 'AC Voltage Sensing',
        description: 'Generator and utility voltage measurement',
        connections: ['J3-1 to J3-4: Generator L1/L2/L3/N', 'J3-5 to J3-8: Utility L1/L2/L3/N', 'Max 600V direct'],
        diagram: 'GEN L1──[2A FUSE]──J3-1    UTIL L1──[2A FUSE]──J3-5\nGEN L2──[2A FUSE]──J3-2    UTIL L2──[2A FUSE]──J3-6\nGEN L3──[2A FUSE]──J3-3    UTIL L3──[2A FUSE]──J3-7\nGEN N ────────────J3-4    UTIL N ────────────J3-8'
      },
      {
        name: 'Current Transformer',
        description: 'Three-phase CT measurement (5A secondary)',
        connections: ['J4-1/2: CT L1', 'J4-3/4: CT L2', 'J4-5/6: CT L3', 'X1→X2 polarity toward load'],
        diagram: 'PHASE─┬──[CT 5A]──┬─LOAD\n      │  X1 │ X2  │\n      │     │     │\n      └───J4-1  J4-2'
      },
      {
        name: 'Relay Outputs',
        description: 'Engine and breaker control relays',
        connections: ['Start: J6-1/2', 'Fuel: J6-3/4', 'Gen CB: J6-5/6', 'Util CB: J6-7/8', 'Alarms: J6-9/10'],
        diagram: '+BAT──[FUSE]──J6-2(COM)──[RELAY]──J6-1(NO)──STARTER SOLENOID'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'J1',
        name: 'Power Supply',
        location: 'Left side',
        pins: [
          { pin: '1', function: 'Batt +', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '10-32V DC' },
          { pin: '2', function: 'Batt -', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'Key Sw', wireColor: 'Red/White', wireSize: '1.5mm²', signalType: 'Input' },
          { pin: '4', function: 'D+ Exc', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Output' }
        ]
      },
      {
        blockId: 'J2',
        name: 'CAN Bus',
        location: 'Left side',
        pins: [
          { pin: '1', function: 'CAN_H', wireColor: 'Yellow', wireSize: '0.75mm²', signalType: 'CAN', voltage: '2.5-3.5V' },
          { pin: '2', function: 'CAN_L', wireColor: 'Green', wireSize: '0.75mm²', signalType: 'CAN', voltage: '1.5-2.5V' },
          { pin: '3', function: 'Shield', wireColor: 'Black', wireSize: '0.75mm²', signalType: 'Ground' }
        ]
      },
      {
        blockId: 'J3',
        name: 'AC Voltage',
        location: 'Center',
        pins: [
          { pin: '1', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-600V' },
          { pin: '2', function: 'Gen L2', wireColor: 'Orange', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-600V' },
          { pin: '3', function: 'Gen L3', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-600V' },
          { pin: '4', function: 'Gen N', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Battery DC' },
      { cableType: 'CAN Bus', cores: 2, size: '0.75mm²', shielded: true, maxLength: '40m', application: 'ECM communication' },
      { cableType: 'AC Voltage', cores: 8, size: '1.5mm²', shielded: false, maxLength: '30m', application: 'Gen + Utility sensing' },
      { cableType: 'CT Secondary', cores: 6, size: '2.5mm²', shielded: true, maxLength: '20m', application: 'Current transformers' },
      { cableType: 'Digital Input', cores: 12, size: '1.0mm²', shielded: false, maxLength: '30m', application: 'Contact inputs' },
      { cableType: 'Relay Output', cores: 12, size: '2.5mm²', shielded: false, maxLength: '25m', application: 'Relay wiring' },
      { cableType: 'Analog Sensor', cores: 8, size: '1.0mm²', shielded: true, maxLength: '25m', application: 'Backup sensors' },
      { cableType: 'RS485', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Modbus communication' },
      { cableType: 'Ethernet', cores: 8, size: 'Cat5e', shielded: true, maxLength: '100m', application: 'Network (PW 2.x)' }
    ],
    groundingRequirements: [
      'Ground battery negative directly to engine block',
      'Single point star grounding at controller',
      'CAN bus shield grounded at one end only',
      'Generator frame bonded to ground bus',
      'CT secondaries star connected at controller',
      '120Ω termination resistor at each end of CAN bus'
    ],
    notes: [
      'Factory configured for specific Cat engine - do not modify without Cat ET',
      'CAN bus requires 120Ω termination at both ends',
      'Use Cat ET software for configuration and diagnostics',
      'CT polarity X1 toward source, X2 toward load',
      'Engine data comes via CAN - backup analog sensors optional',
      'Only Cat-trained technicians should modify configuration',
      'Relay outputs 8A max - use interposing relay for higher loads',
      'Max voltage sensing 600V AC direct, use PT for higher'
    ],
    wireColors: {
      'Battery +ve': 'Red',
      'Battery -ve': 'Black',
      'CAN High': 'Yellow',
      'CAN Low': 'Green',
      'AC Phase A/L1': 'Brown (IEC) / Black (SAE)',
      'AC Phase B/L2': 'Orange (SAE)',
      'AC Phase C/L3': 'Blue',
      'Neutral': 'White',
      'Earth/Ground': 'Green/Yellow',
      'CT Secondary': 'Black/White',
      'Control': 'Orange',
      'Emergency': 'Red',
      'Alarm': 'Yellow',
      'Analog': 'Green'
    },
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
    description: 'Datakom DKG-509 / D-500 Complete Wiring Diagram',
    colorCodeStandard: 'IEC 60446 / European Standard',
    connections: [
      // Power Supply
      { terminal: '1', function: 'DC Power +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A fused, 8-35V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '3A' },
      { terminal: '2', function: 'DC Power -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'Chassis ground', pinType: 'ground' },
      { terminal: '3', function: 'Charge Alt W+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator excite', pinType: 'input', voltage: '0-35V DC' },
      // Generator Voltage
      { terminal: '4', function: 'Generator L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct <300V, via PT >300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '5', function: 'Generator L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct <300V, via PT >300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '6', function: 'Generator L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct <300V, via PT >300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '7', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference', pinType: 'input' },
      // Mains Voltage
      { terminal: '8', function: 'Mains L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility L1', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '9', function: 'Mains L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Utility L2', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '10', function: 'Mains L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Utility L3', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '11', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility neutral', pinType: 'input' },
      // Current Transformers
      { terminal: '12', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT, polarity K→L', pinType: 'input', voltage: '5A sec' },
      { terminal: '13', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT1 return', pinType: 'input' },
      { terminal: '14', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '15', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT2 return', pinType: 'input' },
      { terminal: '16', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '17', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT3 return', pinType: 'input' },
      // Speed Input
      { terminal: '18', function: 'MPU Speed +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup signal', pinType: 'signal', voltage: '1-50V AC' },
      { terminal: '19', function: 'MPU Speed -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU return/shield', pinType: 'signal' },
      // Analog Inputs
      { terminal: '20', function: 'Oil Pressure', wireColor: 'Green', wireSize: '1.0mm²', notes: 'VDO 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '21', function: 'Coolant Temperature', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'VDO 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '22', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'VDO 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '23', function: 'Aux Analog', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Configurable', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '24', function: 'Sensor Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Sensor ground', pinType: 'ground' },
      // Digital Inputs
      { terminal: '25', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '26', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO contact', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '27', function: 'Gen CB Feedback', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker aux', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '28', function: 'Mains CB Feedback', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Mains breaker aux', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '29', function: 'Digital Input 5', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'Configurable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '30', function: 'Digital Input 6', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'Configurable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '31', function: 'Digital Input 7', wireColor: 'Brown/Green', wireSize: '1.0mm²', notes: 'Configurable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '32', function: 'Digital Input 8', wireColor: 'Brown/Blue', wireSize: '1.0mm²', notes: 'Configurable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '33', function: 'Digital Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input ground', pinType: 'ground' },
      // Relay Outputs
      { terminal: '34', function: 'Start Output NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Starter relay', pinType: 'output', maxCurrent: '5A' },
      { terminal: '35', function: 'Start Output COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start common', pinType: 'output' },
      { terminal: '36', function: 'Fuel Output NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel solenoid', pinType: 'output', maxCurrent: '5A' },
      { terminal: '37', function: 'Fuel Output COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel common', pinType: 'output' },
      { terminal: '38', function: 'Gen CB Close NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Gen contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '39', function: 'Gen CB Close COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', notes: 'Gen CB common', pinType: 'output' },
      { terminal: '40', function: 'Mains CB Close NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '41', function: 'Mains CB Close COM', wireColor: 'Violet/Black', wireSize: '2.5mm²', notes: 'Mains CB common', pinType: 'output' },
      { terminal: '42', function: 'Common Alarm NO', wireColor: 'Yellow', wireSize: '2.5mm²', notes: 'Warning output', pinType: 'output', maxCurrent: '5A' },
      { terminal: '43', function: 'Shutdown Alarm NO', wireColor: 'Yellow/Red', wireSize: '2.5mm²', notes: 'Shutdown output', pinType: 'output', maxCurrent: '5A' },
    ],
    schematicSections: [
      {
        name: 'DC Power Supply',
        description: 'Wide range DC input with protection',
        connections: ['Pin 1: +ve via 10A fuse', 'Pin 2: -ve to chassis', 'Pin 3: W+ charge fail detect'],
        diagram: 'BATTERY(+)──[10A FUSE]──PIN1──[PROTECTION]──INTERNAL\n                            │\nBATTERY(-)────────────────PIN2──CHASSIS GND'
      },
      {
        name: 'Generator & Mains Voltage',
        description: 'Three-phase voltage sensing',
        connections: ['Pins 4-7: Generator L1/L2/L3/N', 'Pins 8-11: Mains L1/L2/L3/N', 'Via PT if >300V'],
        diagram: 'GEN L1──[2A FUSE]──PIN4     MAINS L1──[2A FUSE]──PIN8\nGEN L2──[2A FUSE]──PIN5     MAINS L2──[2A FUSE]──PIN9\nGEN L3──[2A FUSE]──PIN6     MAINS L3──[2A FUSE]──PIN10\nGEN N ────────────PIN7     MAINS N ────────────PIN11'
      },
      {
        name: 'Current Transformers',
        description: 'Three-phase CT measurement',
        connections: ['5A secondary', 'K→L polarity toward load', 'Star CT secondaries'],
        diagram: 'PHASE─┬──[CT 5A]──┬─LOAD\n      │  k │ l   │\n      └──PIN12  PIN13'
      },
      {
        name: 'Analog Sensors',
        description: 'VDO-compatible resistive inputs',
        connections: ['Pins 20-23: Oil, Temp, Fuel, Aux', 'Pin 24: Common ground', 'Resistive 10-184Ω'],
        diagram: 'OIL───PIN20──┐\nTEMP──PIN21──┤\nFUEL──PIN22──┼──PIN24 (GND)\nAUX───PIN23──┘'
      },
      {
        name: 'Engine Speed MPU',
        description: 'Magnetic pickup sensing',
        connections: ['Pins 18-19: Twisted shielded pair', 'Shield at controller end'],
        diagram: 'RING GEAR\n    ↓\n[MPU]──SHIELD──GND\n  │\nPIN18(+)\nPIN19(-)'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB-POWER',
        name: 'Power Supply',
        location: 'Top left',
        pins: [
          { pin: '1', function: 'DC +ve', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-35V DC' },
          { pin: '2', function: 'DC -ve', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'W+', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Input' }
        ]
      },
      {
        blockId: 'TB-VOLTAGE',
        name: 'AC Voltage',
        location: 'Top center',
        pins: [
          { pin: '4', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '5', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '6', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '7', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB-CT',
        name: 'CT Inputs',
        location: 'Middle row',
        pins: [
          { pin: '12', function: 'CT1 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '13', function: 'CT1 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' },
          { pin: '14', function: 'CT2 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '15', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' },
          { pin: '16', function: 'CT3 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '17', function: 'CT3 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery DC' },
      { cableType: 'Voltage Sensing', cores: 8, size: '1.5mm²', shielded: false, maxLength: '25m', application: 'Gen + Mains' },
      { cableType: 'CT Cable', cores: 6, size: '1.5mm²', shielded: true, maxLength: '15m', application: 'CT secondaries' },
      { cableType: 'MPU Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Speed sensing' },
      { cableType: 'Sensor Cable', cores: 5, size: '1.0mm²', shielded: true, maxLength: '20m', application: 'Analog sensors' },
      { cableType: 'Digital Input', cores: 10, size: '1.0mm²', shielded: false, maxLength: '25m', application: 'Contact inputs' },
      { cableType: 'Relay Output', cores: 12, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Relay wiring' },
      { cableType: 'RS485', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Modbus' },
      { cableType: 'Ethernet', cores: 8, size: 'Cat5e', shielded: true, maxLength: '100m', application: 'D-series only' }
    ],
    groundingRequirements: [
      'Star point ground at controller',
      'Shield grounded at controller only',
      'Generator frame bonded to ground',
      'CT secondaries not separately grounded',
      'Use equipotential bonding'
    ],
    notes: [
      'Standard European terminal layout',
      'Use shielded cable for MPU',
      'CT polarity K→L toward load',
      'Max voltage sensing 300V direct',
      'Voltage transformers required >300V',
      'Configure CT ratio in software',
      'Ground shields at controller only',
      'Use ferrules on all stranded wires',
      'Relay outputs 5A max'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'Phase L1': 'Brown',
      'Phase L2': 'Black',
      'Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Analog': 'Green',
      'Control': 'Orange',
      'Alarm': 'Yellow'
    },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [
    {
      id: 'datakom-keypad-stuck',
      title: 'Keypad Buttons Stuck or Not Responding',
      symptom: 'One or more front panel buttons are stuck, unresponsive, or require excessive pressure',
      possibleCauses: [
        'Membrane keypad wear after years of use',
        'Moisture ingress causing corrosion under membrane',
        'Flex cable connector loose or oxidized',
        'Debris or contamination under rubber membrane',
        'Static discharge damage to keypad matrix circuit',
        'PCB trace damage under button contacts'
      ],
      diagnosticSteps: [
        'Power off controller and disconnect battery supply',
        'Remove front panel screws (usually 4x M3 Phillips)',
        'Carefully separate front panel from main enclosure',
        'Inspect membrane keypad for visible damage, bubbles, or contamination',
        'Check flex cable connection for corrosion or loose pins',
        'Use multimeter in continuity mode to test button matrix',
        'Each button should show open circuit when released, short when pressed',
        'Check PCB traces under membrane for corrosion or damage',
        'Test button response in Rainbow software diagnostic mode'
      ],
      repairSteps: [
        'Clean membrane underside with isopropyl alcohol (99%)',
        'Clean PCB button contacts with electronics cleaner spray',
        'If flex cable oxidized, clean contacts with pencil eraser then IPA',
        'Re-seat flex cable connector firmly ensuring all pins aligned',
        'For stuck buttons, carefully flex membrane to free mechanism',
        'If membrane damaged, order replacement membrane keypad assembly',
        'Apply thin layer of silicone grease to rubber button guides',
        'Reassemble ensuring gasket seals properly',
        'Test all buttons before final assembly'
      ],
      testProcedure: [
        'Enter Rainbow software diagnostic mode',
        'Press each button and verify response on screen',
        'Test button combinations (Start+Stop, etc.)',
        'Verify display shows correct button presses',
        'Test button response time - should be immediate',
        'Check for ghost presses (buttons triggering without pressing)'
      ],
      estimatedTime: '45-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Membrane keypad assembly (if damaged)', 'Silicone grease', 'Replacement gasket'],
      specialTools: ['Phillips screwdriver set', 'Plastic spudger', 'Isopropyl alcohol 99%', 'Electronics contact cleaner', 'ESD wrist strap'],
      safetyPrecautions: ['Disconnect ALL power before opening', 'Use ESD protection - static can damage electronics', 'Do not force membrane - it tears easily', 'Keep moisture away from open controller']
    },
    {
      id: 'datakom-display-failure',
      title: 'LCD Display Blank, Dim, or Showing Artifacts',
      symptom: 'Display shows no content, partial content, strange characters, or very dim backlight',
      possibleCauses: [
        'Backlight LED failure (common after 50,000+ hours)',
        'LCD ribbon cable loose or damaged',
        'LCD controller IC failure on display module',
        'Main PCB display driver circuit fault',
        'Power supply 5V rail failure or low voltage',
        'Extreme temperature damage to LCD fluid',
        'Static discharge damage to LCD controller'
      ],
      diagnosticSteps: [
        'Check if backlight glows at all - shine flashlight at angle to see faint text',
        'Measure 5V supply at LCD connector (should be 4.9-5.1V)',
        'Check contrast setting in configuration - may be set too low',
        'Inspect LCD ribbon cable for cracks, especially at fold points',
        'Check for corrosion at LCD connector pins',
        'Test with known-good display module if available',
        'Check display in Rainbow software - data should update even if LCD dead',
        'Measure display contrast control voltage (typically 0-5V variable)'
      ],
      repairSteps: [
        'If backlight only: LED backlight strip can be replaced separately',
        'Clean LCD connector with electronics cleaner',
        'Re-seat ribbon cable, ensure latching mechanism engaged',
        'If ribbon damaged, replace entire LCD module',
        'Check and re-solder any cold joints on display connector',
        'Replace LCD contrast trimmer pot if erratic',
        'For LCD module replacement: transfer any configuration first',
        'Adjust contrast after replacement for optimal viewing angle',
        'Calibrate brightness for installation environment'
      ],
      testProcedure: [
        'Power on and observe boot sequence on display',
        'Check all display segments illuminate during self-test',
        'Navigate through all menu screens',
        'Test display at viewing angles (should be readable ±30°)',
        'Check display updates in real-time with parameter changes',
        'Test contrast across temperature range if possible'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['LCD display module', 'LCD ribbon cable', 'LED backlight strip', 'Contrast potentiometer'],
      specialTools: ['Fine-tip soldering iron', 'Hot air rework station (for SMD)', 'Multimeter', 'Oscilloscope (for advanced diagnosis)'],
      safetyPrecautions: ['Handle LCD carefully - glass breaks easily', 'Do not touch LCD surface with bare fingers', 'Keep polarizer protected from scratches', 'Avoid excessive heat on LCD - damages liquid crystal']
    },
    {
      id: 'datakom-pcb-power-circuit',
      title: 'Controller Power Circuit Failure - No Power or Intermittent',
      symptom: 'Controller does not power on, powers intermittently, or resets randomly',
      possibleCauses: [
        'Input protection diode failed (reverse polarity damage)',
        'Main fuse or PTC thermistor open',
        'DC-DC converter IC failed',
        'Electrolytic capacitors dried out or bulging',
        'Voltage regulator IC overheated or failed',
        'Input power connector corroded or loose',
        'PCB trace burned due to overcurrent',
        'ESD damage to power management IC'
      ],
      diagnosticSteps: [
        'Measure input voltage at controller terminals (should be 8-35V DC)',
        'Check input fuse/PTC continuity',
        'Verify reverse polarity protection diode is not shorted',
        'Measure voltage after input protection circuit',
        'Check 5V and 3.3V regulated supply rails',
        'Look for bulging or leaking electrolytic capacitors',
        'Feel for excessively hot components (careful - may be hot)',
        'Check for burned PCB traces near power input',
        'Measure current draw - no load should be 50-150mA typical',
        'Listen for high-pitched whine indicating switching regulator issues'
      ],
      repairSteps: [
        'Replace any visibly damaged components (burned, bulging)',
        'Replace all electrolytic capacitors over 5 years old',
        'If input diode shorted, replace with appropriate rated Schottky',
        'For regulator IC failure, replace with exact part number',
        'Repair burned traces with jumper wire of appropriate gauge',
        'Clean and re-tin all power connector pins',
        'Apply conformal coating to prevent future corrosion',
        'Add transient suppression if source is electrically noisy',
        'Test power consumption after repair'
      ],
      testProcedure: [
        'Connect to variable power supply with current limiting',
        'Slowly increase voltage from 0V monitoring current',
        'Normal startup current briefly spikes then settles to 50-150mA',
        'Test full operating voltage range (8V to 35V)',
        'Run for extended period monitoring for overheating',
        'Test power cycling - should start reliably every time',
        'Verify watchdog timer functions correctly'
      ],
      estimatedTime: '60-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Electrolytic capacitor kit', 'Schottky diodes', 'Voltage regulator ICs', 'PTC fuses'],
      specialTools: ['Digital oscilloscope', 'ESR meter for capacitors', 'SMD soldering station', 'Thermal camera or IR thermometer', 'Current-limited power supply'],
      safetyPrecautions: ['Capacitors may hold charge - discharge before working', 'Failed switching regulators can be VERY hot', 'Verify polarity before reconnecting power', 'Do not exceed voltage ratings during testing']
    },
    {
      id: 'datakom-communication-port',
      title: 'RS485/RS232/USB Communication Port Not Working',
      symptom: 'Cannot connect to controller via communication ports, intermittent connection, garbled data',
      possibleCauses: [
        'ESD damage to RS485/RS232 transceiver IC',
        'Incorrect baud rate or protocol settings',
        'Cable pinout incorrect or cable damaged',
        'Termination resistor missing or wrong value',
        'Ground loop issues causing noise',
        'USB interface IC failure',
        'Protocol converter fault (if using RS485-USB adapter)'
      ],
      diagnosticSteps: [
        'Verify communication settings match between devices',
        'Test with short cable first to eliminate cable issues',
        'Check RS485 A/B line voltage (idle should be 200mV-5V differential)',
        'Use oscilloscope to view waveforms during communication attempt',
        'Test RS485 transceiver IC with multimeter (pin voltages)',
        'Verify USB device enumerates in computer device manager',
        'Try different USB cable and port',
        'Test loopback by shorting TX to RX'
      ],
      repairSteps: [
        'Replace damaged transceiver IC (common: MAX485, SP485)',
        'Check and replace TVS protection diodes on comm lines',
        'Clean communication port connector pins',
        'Verify termination: 120Ω between A and B for long runs',
        'Install proper grounding to prevent ground loops',
        'For USB, replace USB interface IC if device not enumerating',
        'Update USB drivers on computer',
        'Re-flash controller firmware if communication protocol corrupted'
      ],
      testProcedure: [
        'Connect communication cable',
        'Open Rainbow software and attempt connection',
        'Verify real-time data updates properly',
        'Test configuration read/write',
        'Test event log download',
        'Verify Modbus register access if used for SCADA',
        'Test at maximum cable length specified'
      ],
      estimatedTime: '30-90 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['RS485 transceiver IC', 'TVS diodes', 'USB interface IC', '120Ω termination resistor'],
      specialTools: ['Oscilloscope', 'Protocol analyzer (optional)', 'USB cable tester', 'RS485 breakout board'],
      safetyPrecautions: ['ESD protection essential when handling ICs', 'Disconnect power before component replacement', 'Verify correct IC orientation before soldering']
    },
    {
      id: 'datakom-relay-failure',
      title: 'Output Relay Stuck On, Stuck Off, or Chattering',
      symptom: 'Relay outputs not activating, staying on permanently, or chattering rapidly',
      possibleCauses: [
        'Relay coil open circuit',
        'Relay contacts welded closed (overcurrent)',
        'Relay contacts pitted or burned (arc damage)',
        'Relay driver transistor failed',
        'Flyback diode failed allowing voltage spikes',
        'Relay socket contact corrosion',
        'Power supply to relay circuit failed',
        'Control logic output stuck (firmware issue)'
      ],
      diagnosticSteps: [
        'Listen for relay click when output should activate',
        'Measure relay coil voltage when activated (should match relay rating)',
        'Check relay coil resistance (typically 150-500Ω)',
        'Measure relay contact continuity when activated',
        'Check if relay removable - test on bench with external voltage',
        'Verify driver transistor switches properly',
        'Check flyback diode is not shorted',
        'Test in Rainbow software manual output mode'
      ],
      repairSteps: [
        'If relay removable, replace with same type and rating',
        'For PCB-mounted relays, desolder and replace',
        'Replace failed driver transistor',
        'Replace damaged flyback diode',
        'Clean relay socket contacts if applicable',
        'Upgrade relay contact rating if loads are heavy',
        'Install external relay module for high-current loads',
        'Add arc suppression across contacts for inductive loads'
      ],
      testProcedure: [
        'Use Rainbow software to toggle each output',
        'Listen for distinct click from each relay',
        'Measure contact closure with multimeter',
        'Test with actual load connected',
        'Verify timing is correct for start/stop sequences',
        'Run multiple on/off cycles to verify reliability'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement relay (match exactly)', 'Driver transistors', 'Flyback diodes', 'Relay socket'],
      specialTools: ['Soldering station', 'Desoldering pump/wick', 'Relay tester', 'Inrush current clamp'],
      safetyPrecautions: ['Relay contacts may carry dangerous voltages', 'Disconnect load circuits before testing', 'Verify relay ratings match application', 'Watch for back-EMF from inductive loads']
    }
  ],
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
    {
      code: 'F02',
      title: 'Low Oil Pressure',
      description: 'Oil pressure below safety threshold',
      severity: 'shutdown',
      causes: ['Low oil level', 'Oil pump failure', 'Sender fault', 'Wiring issue'],
      solutions: ['Check oil level', 'Inspect oil pump', 'Test sender', 'Check wiring'],
      resetProcedure: ['Clear alarm after correcting issue', 'Press RESET button'],
    },
    {
      code: 'F03',
      title: 'High Coolant Temperature',
      description: 'Engine temperature exceeded safe limit',
      severity: 'shutdown',
      causes: ['Low coolant', 'Radiator blocked', 'Fan failure', 'Thermostat stuck', 'Water pump failure'],
      solutions: ['Check coolant level', 'Clean radiator', 'Test fan operation', 'Replace thermostat'],
      resetProcedure: ['Allow engine to cool', 'Fix root cause', 'Reset controller'],
    }
  ],
  maintenanceSchedule: [
    {
      task: 'Visual Inspection',
      interval: 'Monthly',
      procedure: ['Check for loose connections', 'Inspect for corrosion', 'Verify display clarity', 'Check indicator LEDs'],
    },
    {
      task: 'Firmware Update Check',
      interval: 'Quarterly',
      procedure: ['Connect to Rainbow software', 'Check current firmware version', 'Download latest from Datakom website', 'Update if newer version available'],
    },
    {
      task: 'Full Calibration',
      interval: 'Annually',
      procedure: ['Verify voltage readings against reference', 'Check CT ratio settings', 'Calibrate analog inputs', 'Test protection setpoints'],
    }
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'DKG-509', description: 'DKG-509 Controller', price: 'KES 65,000', availability: 'in-stock' },
    { partNumber: 'D-500', description: 'D-500 Controller', price: 'KES 85,000', availability: 'in-stock' },
    { partNumber: 'DKG-LCD', description: 'LCD Display Module', price: 'KES 12,000', availability: 'order', leadTime: '2 weeks' },
    { partNumber: 'DKG-KEYPAD', description: 'Membrane Keypad Assembly', price: 'KES 8,000', availability: 'order', leadTime: '2 weeks' },
    { partNumber: 'DKG-RELAY', description: 'Output Relay Set (4pcs)', price: 'KES 3,500', availability: 'in-stock' },
  ],
  safetyWarnings: ['Verify voltage before connection', 'Use ESD protection when handling', 'Disconnect power before opening enclosure', 'Relay outputs may carry dangerous voltages'],
  toolsRequired: ['Datakom Rainbow software', 'USB cable', 'Phillips screwdriver set', 'Multimeter', 'ESD wrist strap'],
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
    description: 'Lovato RGK800/RGK900 Complete Wiring Diagram - Italian Quality Generator Controller',
    colorCodeStandard: 'IEC 60446 / CEI European Standard',
    connections: [
      // Power Supply
      { terminal: '1', function: 'DC Power +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '10A fused, 8-35V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '2.5A' },
      { terminal: '2', function: 'DC Power -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'System ground', pinType: 'ground' },
      { terminal: '3', function: 'Charge Fail W+', wireColor: 'White', wireSize: '1.5mm²', notes: 'Alternator W terminal', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '4', function: 'Aux DC Output', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Switched DC out', pinType: 'output', maxCurrent: '1A' },
      // Generator Voltage
      { terminal: '5', function: 'Generator L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '6', function: 'Generator L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '7', function: 'Generator L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct 0-300V or via PT', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '8', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral reference', pinType: 'input' },
      // Mains Voltage
      { terminal: '9', function: 'Mains L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility L1', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '10', function: 'Mains L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Utility L2', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '11', function: 'Mains L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Utility L3', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '12', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility neutral', pinType: 'input' },
      // Current Transformers
      { terminal: '13', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT, K→L polarity', pinType: 'input', voltage: '5A sec' },
      { terminal: '14', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT1 return', pinType: 'input' },
      { terminal: '15', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '16', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT2 return', pinType: 'input' },
      { terminal: '17', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '1.5mm²', notes: '5A CT', pinType: 'input', voltage: '5A sec' },
      { terminal: '18', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '1.5mm²', notes: 'CT3 return', pinType: 'input' },
      // Speed Input
      { terminal: '19', function: 'MPU Speed +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup signal', pinType: 'signal', voltage: '1-50V AC' },
      { terminal: '20', function: 'MPU Speed -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU return/shield', pinType: 'signal' },
      // Analog Inputs
      { terminal: '21', function: 'Oil Pressure', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Universal: 0-10V/4-20mA/Res', pinType: 'input', voltage: '0-10V DC' },
      { terminal: '22', function: 'Coolant Temperature', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Universal: 0-10V/4-20mA/Res', pinType: 'input', voltage: '0-10V DC' },
      { terminal: '23', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Universal: 0-10V/4-20mA/Res', pinType: 'input', voltage: '0-10V DC' },
      { terminal: '24', function: 'Aux Analog', wireColor: 'Green/Red', wireSize: '1.0mm²', notes: 'Universal configurable', pinType: 'input', voltage: '0-10V DC' },
      { terminal: '25', function: 'Sensor Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Sensor ground', pinType: 'ground' },
      // Digital Inputs
      { terminal: '26', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC safety contact', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '27', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO start command', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '28', function: 'Gen CB Feedback', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker position', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '29', function: 'Mains CB Feedback', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Mains breaker', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '30', function: 'Digital Input 5', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'Programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '31', function: 'Digital Input 6', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'Programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '32', function: 'Digital Input 7', wireColor: 'Brown/Green', wireSize: '1.0mm²', notes: 'Programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '33', function: 'Digital Input 8', wireColor: 'Brown/Blue', wireSize: '1.0mm²', notes: 'Programmable', pinType: 'input', voltage: '0-35V DC' },
      { terminal: '34', function: 'Digital Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input ground', pinType: 'ground' },
      // Relay Outputs
      { terminal: '35', function: 'Start Output NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Starter relay', pinType: 'output', maxCurrent: '5A' },
      { terminal: '36', function: 'Start Output COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start common', pinType: 'output' },
      { terminal: '37', function: 'Fuel Output NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel solenoid', pinType: 'output', maxCurrent: '5A' },
      { terminal: '38', function: 'Fuel Output COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel common', pinType: 'output' },
      { terminal: '39', function: 'Gen CB NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Gen contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '40', function: 'Gen CB COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', notes: 'Gen CB common', pinType: 'output' },
      { terminal: '41', function: 'Mains CB NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '42', function: 'Mains CB COM', wireColor: 'Violet/Black', wireSize: '2.5mm²', notes: 'Mains CB common', pinType: 'output' },
      { terminal: '43', function: 'Warning NO', wireColor: 'Yellow', wireSize: '2.5mm²', notes: 'Warning relay', pinType: 'output', maxCurrent: '5A' },
      { terminal: '44', function: 'Shutdown NO', wireColor: 'Yellow/Red', wireSize: '2.5mm²', notes: 'Shutdown relay', pinType: 'output', maxCurrent: '5A' },
    ],
    schematicSections: [
      {
        name: 'DC Power Supply',
        description: 'Wide range DC input with Italian quality protection',
        connections: ['Pin 1: +ve via 10A fuse', 'Pin 2: -ve to chassis', 'Internal protection circuits'],
        diagram: 'BATTERY(+)──[10A FUSE]──PIN1──[PROTECTION]──INTERNAL\n                            │\nBATTERY(-)────────────────PIN2──CHASSIS GND'
      },
      {
        name: 'Generator & Mains Voltage',
        description: 'Three-phase voltage measurement',
        connections: ['Pins 5-8: Generator', 'Pins 9-12: Mains', 'PT required >300V'],
        diagram: 'GEN L1──[2A]──PIN5     MAINS L1──[2A]──PIN9\nGEN L2──[2A]──PIN6     MAINS L2──[2A]──PIN10\nGEN L3──[2A]──PIN7     MAINS L3──[2A]──PIN11\nGEN N ────────PIN8     MAINS N ────────PIN12'
      },
      {
        name: 'Current Transformers',
        description: '5A CT inputs for metering',
        connections: ['Pins 13-18: CT L1/L2/L3', 'K→L polarity', 'Star at controller'],
        diagram: 'PHASE─┬──[CT 5A]──┬─LOAD\n      │  k │ l   │\n      └──PIN13  PIN14'
      },
      {
        name: 'Universal Analog Inputs',
        description: 'Configurable for voltage, current, or resistance',
        connections: ['Pins 21-24: Analog inputs', 'Pin 25: Common', 'Set type in Synergy'],
        diagram: 'OIL───PIN21──┐\nTEMP──PIN22──┤\nFUEL──PIN23──┼──PIN25 (GND)\nAUX───PIN24──┘'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB-PWR',
        name: 'Power Supply',
        location: 'Top left',
        pins: [
          { pin: '1', function: 'DC +ve', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-35V DC' },
          { pin: '2', function: 'DC -ve', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'W+', wireColor: 'White', wireSize: '1.5mm²', signalType: 'Input' },
          { pin: '4', function: 'Aux Out', wireColor: 'Red/White', wireSize: '1.5mm²', signalType: 'Output' }
        ]
      },
      {
        blockId: 'TB-VOLT',
        name: 'AC Voltage',
        location: 'Top center',
        pins: [
          { pin: '5', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '6', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '7', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '8', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'TB-CT',
        name: 'CT Inputs',
        location: 'Middle',
        pins: [
          { pin: '13', function: 'CT1 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '14', function: 'CT1 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' },
          { pin: '15', function: 'CT2 k', wireColor: 'Yellow', wireSize: '1.5mm²', signalType: 'CT', voltage: '5A' },
          { pin: '16', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '1.5mm²', signalType: 'CT' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery DC' },
      { cableType: 'Voltage Sensing', cores: 8, size: '1.5mm²', shielded: false, maxLength: '25m', application: 'Gen + Mains' },
      { cableType: 'CT Cable', cores: 6, size: '1.5mm²', shielded: true, maxLength: '15m', application: 'CT secondaries' },
      { cableType: 'MPU Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '5m', application: 'Speed sensing' },
      { cableType: 'Sensor Cable', cores: 5, size: '1.0mm²', shielded: true, maxLength: '20m', application: 'Universal inputs' },
      { cableType: 'Digital Input', cores: 10, size: '1.0mm²', shielded: false, maxLength: '25m', application: 'Contacts' },
      { cableType: 'Relay Output', cores: 12, size: '2.5mm²', shielded: false, maxLength: '15m', application: 'Relay wiring' },
      { cableType: 'RS485', cores: 2, size: '0.5mm²', shielded: true, maxLength: '1200m', application: 'Modbus' },
      { cableType: 'Ethernet', cores: 8, size: 'Cat5e', shielded: true, maxLength: '100m', application: 'Network' }
    ],
    groundingRequirements: [
      'Italian quality connectors for reliable grounding',
      'Star point ground at controller chassis',
      'Shield grounded at controller end only',
      'Generator frame bonded to ground',
      'CT secondaries not separately grounded'
    ],
    notes: [
      'Italian quality connectors for reliability',
      'Universal analog inputs - configurable in Synergy',
      'Use shielded cable for MPU',
      'CT polarity K→L toward load',
      'Max voltage 300V direct, PT for higher',
      'Configure in Lovato Synergy software',
      'Ground shields at controller only',
      'Use ferrules on all terminations',
      'Relay outputs 5A max'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'Phase L1': 'Brown',
      'Phase L2': 'Black',
      'Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'CT Secondary': 'Yellow',
      'Speed Sensor': 'White',
      'Analog': 'Green',
      'Control': 'Orange',
      'Alarm': 'Yellow'
    },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [
    {
      id: 'lovato-touchscreen-calibration',
      title: 'Touchscreen Not Responding or Miscalibrated',
      symptom: 'Touch inputs not registering, wrong location detection, or erratic touch behavior',
      possibleCauses: [
        'Touchscreen needs recalibration after firmware update',
        'Resistive touch layer degradation',
        'Flex cable connector loose',
        'Moisture under touchscreen surface',
        'ESD damage to touch controller IC',
        'Screen protector interfering with touch'
      ],
      diagnosticSteps: [
        'Access touchscreen calibration menu (hold corner 10 seconds on boot)',
        'Check if touch works in some areas but not others',
        'Inspect screen surface for damage or contamination',
        'Remove any screen protector and test',
        'Check flex cable connection inside unit',
        'Test with stylus vs finger - resistive screens respond to pressure'
      ],
      repairSteps: [
        'Run touchscreen calibration routine from service menu',
        'Touch all four corners and center when prompted',
        'Clean screen with electronics-safe glass cleaner',
        'If calibration fails, re-seat touch panel flex cable',
        'Replace touchscreen assembly if digitizer damaged',
        'Apply Lovato-approved screen protector only',
        'Update firmware to latest version after replacement'
      ],
      testProcedure: [
        'Test touch response in all four corners',
        'Draw diagonal lines across screen - should be smooth',
        'Test all menu buttons respond correctly',
        'Verify touch works with wet fingers (RGK800/900)',
        'Test touch accuracy on small UI elements'
      ],
      estimatedTime: '15-45 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Touchscreen assembly (if damaged)', 'Screen protector'],
      specialTools: ['Plastic spudger', 'Microfiber cloth', 'IPA cleaner'],
      safetyPrecautions: ['Power off before opening', 'Do not press hard on LCD', 'Handle flex cables gently']
    },
    {
      id: 'lovato-input-circuit-failure',
      title: 'Analog/Digital Input Not Reading Correctly',
      symptom: 'Sensor readings incorrect, input stuck high/low, or intermittent input failures',
      possibleCauses: [
        'Input protection TVS diode shorted',
        'Input resistor divider network damage',
        'ADC reference voltage drift',
        'Input connector corrosion',
        'Sensor wiring fault',
        'Input multiplexer IC failure',
        'Ground loop interference'
      ],
      diagnosticSteps: [
        'Disconnect sensor and measure input voltage directly',
        'Check input impedance matches specification',
        'Verify input scaling configuration in Synergy',
        'Measure reference voltages on PCB',
        'Test with calibrated signal source',
        'Check for cross-talk between adjacent inputs',
        'Verify ground connections are solid'
      ],
      repairSteps: [
        'Replace shorted protection components',
        'Clean input connectors with contact cleaner',
        'Re-calibrate input using Synergy software',
        'Replace input conditioning circuitry if damaged',
        'Verify and correct wiring if needed',
        'Install proper shielding for sensitive inputs',
        'Add filtering capacitors if noise issues persist'
      ],
      testProcedure: [
        'Apply known voltage/resistance and verify reading',
        'Test full scale range of input',
        'Check linearity with multiple test points',
        'Verify alarm setpoints trigger correctly',
        'Test with actual sensor connected'
      ],
      estimatedTime: '45-90 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['TVS diodes', 'Precision resistors', 'Filter capacitors'],
      specialTools: ['Calibrated multimeter', 'Signal generator', 'Oscilloscope', 'Synergy software'],
      safetyPrecautions: ['Disconnect external sensors before testing', 'Use ESD protection', 'Verify input voltage limits']
    },
    {
      id: 'lovato-memory-corruption',
      title: 'Configuration Lost or Corrupted After Power Cycle',
      symptom: 'Settings reset to defaults, event log cleared, or random configuration changes',
      possibleCauses: [
        'EEPROM/Flash memory wear-out',
        'Battery backup failed (RTC battery)',
        'Power supply brownout during save',
        'Firmware corruption',
        'EMI interference during write operations',
        'Memory IC failure'
      ],
      diagnosticSteps: [
        'Check RTC battery voltage (should be 3.0V)',
        'Read/compare configuration multiple times',
        'Check event log for power interruption records',
        'Verify power supply stability with oscilloscope',
        'Test by making small change and power cycling',
        'Check for EMI sources near controller'
      ],
      repairSteps: [
        'Replace RTC battery (CR2032 typical)',
        'Export configuration backup before any work',
        'Re-flash firmware if corruption suspected',
        'Factory reset and reconfigure if persistent',
        'Install UPS or power conditioning if supply unstable',
        'Replace controller if memory IC failed',
        'Move away from EMI sources'
      ],
      testProcedure: [
        'Make configuration change and save',
        'Power cycle multiple times',
        'Verify settings retained each time',
        'Check RTC maintains time after power off',
        'Test event log storage and retrieval'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['CR2032 battery', 'Backup configuration file'],
      specialTools: ['Synergy software', 'Oscilloscope', 'Battery tester'],
      safetyPrecautions: ['Back up configuration before any work', 'Use quality replacement batteries', 'Allow capacitors to discharge before battery replacement']
    }
  ],
  calibrationProcedures: [],
  commonFaults: [
    { code: 'A001', title: 'Low Oil Pressure', description: 'Oil pressure below setpoint', severity: 'shutdown', causes: ['Low oil', 'Sensor fault', 'Engine damage'], solutions: ['Check oil level', 'Replace sensor', 'Inspect engine'], resetProcedure: ['Fix issue', 'Press RESET'] },
    { code: 'A002', title: 'High Temperature', description: 'Coolant temperature too high', severity: 'shutdown', causes: ['Low coolant', 'Fan fault', 'Blocked radiator'], solutions: ['Add coolant', 'Fix fan', 'Clean radiator'], resetProcedure: ['Cool engine', 'Press RESET'] },
    { code: 'A003', title: 'Over Speed', description: 'Engine RPM exceeded limit', severity: 'shutdown', causes: ['Governor fault', 'Load rejection'], solutions: ['Check governor', 'Verify fuel system'], resetProcedure: ['Press RESET'] }
  ],
  maintenanceSchedule: [
    { task: 'Firmware Check', interval: 'Quarterly', procedure: ['Check Lovato website for updates', 'Download via Synergy', 'Install and verify'] },
    { task: 'Battery Test', interval: 'Annually', procedure: ['Measure RTC battery voltage', 'Replace if below 2.8V'] }
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'RGK800', description: 'RGK800 Controller', price: 'KES 95,000', availability: 'in-stock' },
    { partNumber: 'RGK-LCD', description: 'LCD Touchscreen Assembly', price: 'KES 25,000', availability: 'order', leadTime: '3 weeks' },
    { partNumber: 'RGK-BAT', description: 'RTC Backup Battery', price: 'KES 500', availability: 'in-stock' },
  ],
  safetyWarnings: ['Use proper grounding', 'ESD protection required', 'Back up configuration before repairs'],
  toolsRequired: ['Synergy software', 'USB cable', 'Multimeter', 'CR2032 battery'],
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
    description: 'Siemens SICAM MIC/AK3 Complete Wiring - Industrial Grade Power Automation',
    colorCodeStandard: 'IEC 60446 / DIN VDE German Standard',
    connections: [
      // Power Supply X1
      { terminal: 'X1:1', function: '24V DC+ Power Supply', wireColor: 'Red', wireSize: '2.5mm²', notes: '24V DC ±20%, 10A fused', pinType: 'power', voltage: '24V DC', maxCurrent: '5A' },
      { terminal: 'X1:2', function: '24V DC- Ground', wireColor: 'Blue', wireSize: '2.5mm²', notes: 'System 0V reference', pinType: 'ground' },
      { terminal: 'X1:3', function: 'PE Protective Earth', wireColor: 'Green/Yellow', wireSize: '4mm²', notes: 'Bonded to chassis', pinType: 'ground' },
      { terminal: 'X1:4', function: 'Redundant 24V DC+', wireColor: 'Red/White', wireSize: '2.5mm²', notes: 'Secondary power input', pinType: 'power', voltage: '24V DC' },
      // Generator Voltage X2
      { terminal: 'X2:1', function: 'Generator L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT 100:1 typical', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X2:2', function: 'Generator L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT 100:1 typical', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X2:3', function: 'Generator L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT 100:1 typical', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X2:4', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'VT secondary neutral', pinType: 'input' },
      { terminal: 'X2:5', function: 'VT Secondary Ground', wireColor: 'Green/Yellow', wireSize: '1.5mm²', notes: 'VT secondary grounding', pinType: 'ground' },
      // Bus/Mains Voltage X3
      { terminal: 'X3:1', function: 'Bus L1 Voltage', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Via VT 100:1', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X3:2', function: 'Bus L2 Voltage', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Via VT 100:1', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X3:3', function: 'Bus L3 Voltage', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Via VT 100:1', pinType: 'input', voltage: '0-120V AC sec' },
      { terminal: 'X3:4', function: 'Bus Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Bus VT neutral', pinType: 'input' },
      // Current Transformers X4
      { terminal: 'X4:1', function: 'CT L1 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '1A/5A CT, IEC polarity', pinType: 'input', voltage: '1A/5A sec' },
      { terminal: 'X4:2', function: 'CT L1 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT1 secondary return', pinType: 'input' },
      { terminal: 'X4:3', function: 'CT L2 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '1A/5A CT', pinType: 'input', voltage: '1A/5A sec' },
      { terminal: 'X4:4', function: 'CT L2 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT2 secondary return', pinType: 'input' },
      { terminal: 'X4:5', function: 'CT L3 S1 (k)', wireColor: 'Yellow', wireSize: '2.5mm²', notes: '1A/5A CT', pinType: 'input', voltage: '1A/5A sec' },
      { terminal: 'X4:6', function: 'CT L3 S2 (l)', wireColor: 'Yellow/Black', wireSize: '2.5mm²', notes: 'CT3 secondary return', pinType: 'input' },
      { terminal: 'X4:7', function: 'CT Neutral S1', wireColor: 'Yellow/White', wireSize: '2.5mm²', notes: 'Ground fault CT', pinType: 'input' },
      { terminal: 'X4:8', function: 'CT Neutral S2', wireColor: 'Yellow/Blue', wireSize: '2.5mm²', notes: 'GF CT return', pinType: 'input' },
      // Digital Inputs X5 (32 channels typical)
      { terminal: 'X5:1', function: 'Emergency Stop', wireColor: 'Red', wireSize: '1.0mm²', notes: 'NC safety input', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:2', function: 'CB52a Gen Breaker', wireColor: 'Purple', wireSize: '1.0mm²', notes: 'Breaker position', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:3', function: 'CB52b Gen Breaker', wireColor: 'Purple/White', wireSize: '1.0mm²', notes: 'Breaker NC contact', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:4', function: 'CB Ready', wireColor: 'Purple/Black', wireSize: '1.0mm²', notes: 'Breaker ready signal', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:5', function: 'Protection Trip', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'External trip input', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:6-32', function: 'Configurable Inputs', wireColor: 'Various', wireSize: '1.0mm²', notes: 'User programmable', pinType: 'input', voltage: '24V DC' },
      { terminal: 'X5:33', function: 'Digital Input Common', wireColor: 'Blue', wireSize: '2.5mm²', notes: 'Input return 0V', pinType: 'ground' },
      // Relay Outputs X6 (16 channels)
      { terminal: 'X6:1', function: 'CB Close Command NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Breaker close', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X6:2', function: 'CB Close Command COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Close relay common', pinType: 'output' },
      { terminal: 'X6:3', function: 'CB Trip Command NO', wireColor: 'Orange/Red', wireSize: '2.5mm²', notes: 'Breaker trip', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X6:4', function: 'CB Trip Command COM', wireColor: 'Orange/Blue', wireSize: '2.5mm²', notes: 'Trip relay common', pinType: 'output' },
      { terminal: 'X6:5', function: 'Start Output NO', wireColor: 'Green', wireSize: '2.5mm²', notes: 'Engine start', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X6:6', function: 'Stop Output NO', wireColor: 'Green/Red', wireSize: '2.5mm²', notes: 'Engine stop', pinType: 'output', maxCurrent: '10A' },
      { terminal: 'X6:7-16', function: 'Configurable Outputs', wireColor: 'Various', wireSize: '2.5mm²', notes: 'User programmable', pinType: 'output', maxCurrent: '10A' },
      // Analog Inputs X7 (16 channels)
      { terminal: 'X7:1', function: 'Analog Input 1+', wireColor: 'White', wireSize: '1.0mm²', notes: '4-20mA or 0-10V', pinType: 'input', voltage: '0-10V DC' },
      { terminal: 'X7:2', function: 'Analog Input 1-', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'AI1 return', pinType: 'input' },
      { terminal: 'X7:3-32', function: 'Analog Inputs 2-16', wireColor: 'Various', wireSize: '1.0mm²', notes: 'Configurable AI', pinType: 'input' },
      // Communication X8
      { terminal: 'X8:1', function: 'Profinet Port 1 RJ45', wireColor: 'Cat6 Shielded', wireSize: 'Cat6', notes: 'Profinet IO', pinType: 'communication' },
      { terminal: 'X8:2', function: 'Profinet Port 2 RJ45', wireColor: 'Cat6 Shielded', wireSize: 'Cat6', notes: 'Ring redundancy', pinType: 'communication' },
      { terminal: 'X8:3', function: 'IEC 61850 Ethernet', wireColor: 'Cat6 Shielded', wireSize: 'Cat6', notes: 'Substation automation', pinType: 'communication' },
      { terminal: 'X8:4', function: 'Modbus TCP Ethernet', wireColor: 'Cat6 Shielded', wireSize: 'Cat6', notes: 'SCADA connection', pinType: 'communication' },
    ],
    schematicSections: [
      {
        name: '24V DC Power Supply',
        description: 'Industrial 24V DC with redundancy option',
        connections: ['X1:1 +24V via 10A MCB', 'X1:2 0V reference', 'X1:3 PE to chassis', 'X1:4 Redundant supply'],
        diagram: '24V PSU1──[10A MCB]──X1:1──[PROTECTION]──INTERNAL\n24V PSU2──[10A MCB]──X1:4──[REDUNDANCY]──INTERNAL\n              0V────X1:2\n              PE────X1:3──CHASSIS'
      },
      {
        name: 'Voltage Transformer Inputs',
        description: 'Secondary VT inputs for MV/HV applications',
        connections: ['X2:1-4 Generator VT secondaries', 'X3:1-4 Bus VT secondaries', 'Typical 100:1 ratio'],
        diagram: 'GEN VT SEC ─┬─X2:1 (L1)\n             ├─X2:2 (L2)\n             ├─X2:3 (L3)\n             └─X2:4 (N)──X2:5 (GND)'
      },
      {
        name: 'Current Transformer Inputs',
        description: '1A or 5A CT inputs for protection and metering',
        connections: ['X4:1-6 Phase CTs', 'X4:7-8 Neutral/Ground CT', 'IEC standard polarity'],
        diagram: 'PHASE─┬──[CT 1A/5A]──┬─LOAD\n      │   k │ l    │\n      │     │      │\n      └───X4:1  X4:2──STAR'
      },
      {
        name: 'Protection and Control',
        description: 'Digital inputs for protection scheme',
        connections: ['X5:1 Emergency stop', 'X5:2-4 CB status', 'X5:5 Trip input'],
        diagram: 'CB──52a──X5:2\n  └─52b──X5:3\n  └─RDY──X5:4'
      },
      {
        name: 'Communication Networks',
        description: 'Industrial Ethernet protocols',
        connections: ['Profinet for I/O', 'IEC 61850 for substation', 'Modbus TCP for SCADA'],
        diagram: 'SICAM──X8:1──[PROFINET SWITCH]──PLCs\n      └─X8:3──[IEC61850 NET]──IEDs\n      └─X8:4──[MODBUS TCP]──SCADA'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'X1',
        name: 'Power Supply',
        location: 'Left side top',
        pins: [
          { pin: '1', function: '+24V DC', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '24V DC' },
          { pin: '2', function: '0V', wireColor: 'Blue', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'PE', wireColor: 'Green/Yellow', wireSize: '4mm²', signalType: 'Earth' },
          { pin: '4', function: '+24V Red', wireColor: 'Red/White', wireSize: '2.5mm²', signalType: 'Power' }
        ]
      },
      {
        blockId: 'X2',
        name: 'Gen VT Inputs',
        location: 'Center top',
        pins: [
          { pin: '1', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'VT', voltage: '0-120V' },
          { pin: '2', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'VT', voltage: '0-120V' },
          { pin: '3', function: 'Gen L3', wireColor: 'Grey', wireSize: '1.5mm²', signalType: 'VT', voltage: '0-120V' },
          { pin: '4', function: 'Gen N', wireColor: 'Blue', wireSize: '1.5mm²', signalType: 'Reference' }
        ]
      },
      {
        blockId: 'X4',
        name: 'CT Inputs',
        location: 'Center',
        pins: [
          { pin: '1', function: 'CT1 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '1A/5A' },
          { pin: '2', function: 'CT1 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' },
          { pin: '3', function: 'CT2 k', wireColor: 'Yellow', wireSize: '2.5mm²', signalType: 'CT', voltage: '1A/5A' },
          { pin: '4', function: 'CT2 l', wireColor: 'Yellow/Black', wireSize: '2.5mm²', signalType: 'CT' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: '24V Power', cores: 2, size: '2.5mm²', shielded: false, maxLength: '50m', application: 'DC power supply' },
      { cableType: 'VT Secondary', cores: 4, size: '1.5mm²', shielded: true, maxLength: '50m', application: 'Voltage transformers' },
      { cableType: 'CT Secondary', cores: 8, size: '2.5mm²', shielded: true, maxLength: '50m', application: 'Current transformers' },
      { cableType: 'Digital Input', cores: 37, size: '1.0mm²', shielded: false, maxLength: '100m', application: 'Binary inputs' },
      { cableType: 'Relay Output', cores: 18, size: '2.5mm²', shielded: false, maxLength: '50m', application: 'Control outputs' },
      { cableType: 'Analog Input', cores: 32, size: '1.0mm²', shielded: true, maxLength: '100m', application: '4-20mA/0-10V' },
      { cableType: 'Profinet', cores: 4, size: 'Cat6', shielded: true, maxLength: '100m', application: 'Industrial Ethernet' },
      { cableType: 'IEC 61850', cores: 4, size: 'Cat6', shielded: true, maxLength: '100m', application: 'Substation network' }
    ],
    groundingRequirements: [
      'Follow Siemens EMC guidelines strictly',
      'PE connection mandatory on X1:3',
      'Use 360° shield termination at all connectors',
      'VT secondary neutral grounded at one point only',
      'CT star point grounded at CT cabinet',
      'Equipotential bonding per IEC 61936-1',
      'Minimum 10mm² bonding conductor',
      'Use proper cable glands rated IP65+'
    ],
    notes: [
      'Follow Siemens wiring standards per SICAM manual',
      'Use proper cable glands rated IP65 minimum',
      'Siemens certified technicians required for configuration',
      'DIGSI/WinCC software for commissioning',
      'VT and CT ratios configured in SICAM',
      'IEC 61850 GOOSE messaging for fast tripping',
      'Profinet for I/O extension modules',
      'Redundant power supply recommended',
      'Heavy duty 10A relay outputs'
    ],
    wireColors: {
      '+24V DC': 'Red',
      '0V DC': 'Blue',
      'PE Earth': 'Green/Yellow',
      'VT Phase L1': 'Brown',
      'VT Phase L2': 'Black',
      'VT Phase L3': 'Grey',
      'VT Neutral': 'Blue',
      'CT Secondary': 'Yellow',
      'Digital Input': 'White',
      'Relay Output': 'Orange',
      'Analog': 'Grey',
      'Communication': 'Cat6 Shielded'
    },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [
    {
      id: 'siemens-ethernet-port-failure',
      title: 'Profinet/Ethernet Communication Port Not Working',
      symptom: 'No network connection, link LED off, SCADA communication lost, or intermittent drops',
      possibleCauses: [
        'RJ45 port physical damage',
        'Ethernet PHY chip failure',
        'Network isolation transformer damage from lightning',
        'Incorrect IP configuration',
        'Network switch port failure',
        'Cable fault or wrong cable type',
        'EMI interference on network cable'
      ],
      diagnosticSteps: [
        'Check link LED status on both controller and switch',
        'Try different Ethernet cable (Cat6 shielded recommended)',
        'Connect laptop directly to controller port',
        'Ping controller IP address from network',
        'Check IP configuration in DIGSI software',
        'Inspect RJ45 port for bent or corroded pins',
        'Test port with Ethernet cable tester',
        'Check for surge damage on network isolation components'
      ],
      repairSteps: [
        'Replace RJ45 connector module if physically damaged',
        'Re-solder or replace network isolation transformer',
        'Replace Ethernet PHY IC (requires SMD rework station)',
        'Update network driver firmware via USB/serial',
        'Install surge protector on Ethernet line',
        'Use shielded Cat6 cable with proper grounding',
        'Replace communication module if port completely failed',
        'Contact Siemens service for PHY chip replacement'
      ],
      testProcedure: [
        'Verify link LED illuminates when cable connected',
        'Ping controller from multiple network locations',
        'Test sustained data transfer for 1 hour',
        'Verify SCADA communication restores automatically',
        'Test under high network traffic conditions',
        'Confirm Profinet/Modbus TCP communication works'
      ],
      estimatedTime: '60-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['RJ45 connector module', 'Network isolation transformer', 'Ethernet PHY IC', 'Shielded Ethernet cable'],
      specialTools: ['SMD rework station', 'Network cable tester', 'Oscilloscope', 'DIGSI software', 'Siemens programming cable'],
      safetyPrecautions: ['Disconnect power before board work', 'Use ESD protection', 'Siemens certified technicians recommended for IC replacement']
    },
    {
      id: 'siemens-touchscreen-failure',
      title: 'Touchscreen Display Blank, Flickering, or Unresponsive',
      symptom: 'Display not showing, backlight failure, touch not registering, or screen artifacts',
      possibleCauses: [
        'Backlight inverter failure',
        'LCD panel damage',
        'Display ribbon cable loose or damaged',
        'Display driver board failure',
        'Touch controller IC malfunction',
        'Power supply to display insufficient',
        'Firmware display driver corruption'
      ],
      diagnosticSteps: [
        'Check if backlight comes on (shine flashlight at screen)',
        'Listen for inverter whine indicating partial function',
        'Check display ribbon cable connections',
        'Test display with external monitor if available',
        'Access controller via DIGSI to check display config',
        'Measure display power rails (typically 12V, 5V, 3.3V)',
        'Check for visual damage to LCD panel'
      ],
      repairSteps: [
        'Re-seat display ribbon cable connections',
        'Replace backlight inverter board',
        'Replace CCFL tubes or LED backlight strip',
        'Replace complete LCD assembly',
        'Replace touch controller board',
        'Re-flash display firmware via DIGSI',
        'Replace display power supply circuitry',
        'Order Siemens replacement HMI module'
      ],
      testProcedure: [
        'Verify full screen illumination uniformity',
        'Test touch response in all areas of screen',
        'Run display test pattern from service menu',
        'Operate for extended period to check stability',
        'Test at various brightness levels',
        'Verify all menu screens display correctly'
      ],
      estimatedTime: '90-240 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['LCD assembly', 'Backlight inverter', 'Touch controller board', 'Display ribbon cable'],
      specialTools: ['Anti-static mat', 'Torx screwdrivers', 'DIGSI software', 'Multimeter', 'Replacement display module'],
      safetyPrecautions: ['High voltage on backlight inverter - disconnect power', 'Handle LCD carefully to prevent cracking', 'Use ESD protection']
    },
    {
      id: 'siemens-io-module-failure',
      title: 'Digital/Analog I/O Module Not Responding',
      symptom: 'Input/output channels not working, module LED errors, or intermittent I/O failures',
      possibleCauses: [
        'I/O module not seated properly in backplane',
        'Backplane connector damage',
        'Module internal failure from overvoltage',
        'Field wiring fault damaging input circuit',
        'Module firmware corruption',
        'Power supply to I/O bus insufficient',
        'Profibus/Profinet communication to module lost'
      ],
      diagnosticSteps: [
        'Check module status LEDs for error codes',
        'Inspect module seating in backplane',
        'Use DIGSI to read module diagnostics',
        'Test I/O module with known good field signals',
        'Swap suspected module with known good spare',
        'Check backplane bus voltage and communication',
        'Measure field wiring for shorts or overvoltage',
        'Review event log for I/O fault timestamps'
      ],
      repairSteps: [
        'Re-seat I/O module firmly in backplane',
        'Clean backplane connector contacts',
        'Replace damaged I/O module with spare',
        'Update module firmware via DIGSI',
        'Repair field wiring causing damage',
        'Install transient protection on field inputs',
        'Replace backplane if connector damaged',
        'Configure replacement module with saved parameters'
      ],
      testProcedure: [
        'Verify all channels read/write correctly',
        'Test with simulated inputs across full range',
        'Operate all outputs and verify field response',
        'Monitor for intermittent faults over time',
        'Confirm module appears healthy in DIGSI',
        'Test under load conditions'
      ],
      estimatedTime: '30-120 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement I/O module', 'Backplane connector', 'Transient suppressors'],
      specialTools: ['DIGSI software', 'Module extraction tool', 'Signal generator', 'Multimeter'],
      safetyPrecautions: ['Power down system before module removal', 'Handle modules by edges only', 'Use ESD protection']
    },
    {
      id: 'siemens-firmware-corruption',
      title: 'Controller Firmware Corrupted or Boot Failure',
      symptom: 'Controller stuck in boot loop, firmware checksum errors, or incomplete startup',
      possibleCauses: [
        'Power loss during firmware update',
        'Corrupted firmware file uploaded',
        'Flash memory degradation',
        'EMI during firmware write operation',
        'Battery backup failure losing boot config',
        'Malicious firmware modification attempt'
      ],
      diagnosticSteps: [
        'Observe boot LED sequence for error patterns',
        'Check if recovery mode accessible',
        'Connect via serial console for boot messages',
        'Verify firmware file integrity (checksum)',
        'Check battery backup voltage',
        'Review update history in DIGSI logs',
        'Test flash memory diagnostics if available'
      ],
      repairSteps: [
        'Enter recovery/service mode (hold specific keys at boot)',
        'Re-flash firmware using DIGSI recovery procedure',
        'Use Siemens factory recovery USB if available',
        'Replace flash memory chip if degraded',
        'Restore configuration from backup after re-flash',
        'Replace battery backup',
        'Contact Siemens support for bricked units',
        'Factory reset if all else fails'
      ],
      testProcedure: [
        'Verify complete boot sequence succeeds',
        'Check firmware version matches expected',
        'Test all controller functions post-recovery',
        'Verify configuration restored correctly',
        'Monitor for any boot issues over multiple cycles',
        'Run full system diagnostics'
      ],
      estimatedTime: '60-240 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Firmware recovery USB', 'Flash memory chip (if replacing)', 'Battery backup'],
      specialTools: ['DIGSI software', 'Serial console cable', 'Recovery USB drive', 'Programming cable'],
      safetyPrecautions: ['Ensure stable power during firmware operations', 'Back up all configuration before attempting', 'Use only official Siemens firmware files']
    },
    {
      id: 'siemens-power-supply-failure',
      title: 'Internal Power Supply Failure or Instability',
      symptom: 'Controller not powering on, random reboots, or unstable operation',
      possibleCauses: [
        'Input fuse blown',
        'DC-DC converter failure',
        'Capacitor degradation (bulging/leaking)',
        'Voltage regulator overheating',
        'Input overvoltage/undervoltage condition',
        'Power connector corrosion',
        'Inrush current damage'
      ],
      diagnosticSteps: [
        'Measure input voltage at controller terminals',
        'Check input fuse continuity',
        'Measure all internal voltage rails (24V, 12V, 5V, 3.3V)',
        'Inspect capacitors for bulging or leakage',
        'Check power connector for corrosion or damage',
        'Test with known good external power supply',
        'Monitor voltage stability with oscilloscope',
        'Check thermal condition of regulators'
      ],
      repairSteps: [
        'Replace blown fuse with correct rating',
        'Replace failed capacitors with high-quality replacements',
        'Replace DC-DC converter module',
        'Re-solder loose power connections',
        'Clean and treat corroded connectors',
        'Install external voltage regulator if needed',
        'Add inrush current limiting',
        'Replace power supply board if major failure'
      ],
      testProcedure: [
        'Verify all voltage rails within specification',
        'Test under full load conditions',
        'Monitor for voltage ripple with oscilloscope',
        'Operate for extended period checking stability',
        'Test startup and shutdown cycles',
        'Verify power consumption normal'
      ],
      estimatedTime: '45-180 minutes',
      difficultyLevel: 'advanced',
      partsNeeded: ['Fuses', 'Electrolytic capacitors', 'DC-DC converter module', 'Voltage regulators'],
      specialTools: ['Oscilloscope', 'Multimeter', 'Soldering station', 'Thermal camera', 'Variable power supply'],
      safetyPrecautions: ['Capacitors hold charge - discharge before work', 'Verify no power before repairs', 'Use proper voltage rated components']
    }
  ],
  calibrationProcedures: [],
  commonFaults: [
    { code: 'E001', title: 'Communication Timeout', description: 'Network communication lost', severity: 'warning', causes: ['Network fault', 'Cable issue'], solutions: ['Check cables', 'Verify network config'], resetProcedure: ['Fix issue', 'Auto-reset'] },
    { code: 'E002', title: 'Module Fault', description: 'I/O module not responding', severity: 'critical', causes: ['Module failure', 'Backplane issue'], solutions: ['Re-seat module', 'Replace module'], resetProcedure: ['Fix module', 'Restart system'] },
    { code: 'E003', title: 'Watchdog Reset', description: 'System watchdog triggered', severity: 'warning', causes: ['Firmware hang', 'High CPU load'], solutions: ['Update firmware', 'Check load'], resetProcedure: ['Automatic restart'] }
  ],
  maintenanceSchedule: [
    { task: 'Firmware Update Check', interval: 'Quarterly', procedure: ['Check Siemens portal for updates', 'Review release notes', 'Plan update window'] },
    { task: 'System Backup', interval: 'Monthly', procedure: ['Export configuration via DIGSI', 'Store backup securely', 'Verify restore capability'] },
    { task: 'Hardware Inspection', interval: 'Annually', procedure: ['Inspect all connections', 'Check cooling fans', 'Verify power supply stability'] }
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'SICAM-MIC', description: 'SICAM MIC Controller', price: 'KES 350,000', availability: 'order', leadTime: '6-8 weeks' },
    { partNumber: 'SICAM-PS', description: 'Power Supply Module', price: 'KES 45,000', availability: 'order', leadTime: '4 weeks' },
    { partNumber: 'SICAM-IO16', description: 'Digital I/O Module 16ch', price: 'KES 85,000', availability: 'order', leadTime: '4 weeks' },
    { partNumber: 'SICAM-HMI', description: 'Touchscreen HMI Module', price: 'KES 120,000', availability: 'order', leadTime: '6 weeks' },
  ],
  safetyWarnings: ['Siemens certified technicians only', 'Follow IEC safety standards', 'Use proper lockout/tagout procedures'],
  toolsRequired: ['DIGSI software', 'Siemens programming cable', 'Multimeter', 'Oscilloscope', 'ESD protection kit'],
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
    description: 'Enko EK3000/EK5000 Complete Wiring - Budget Generator Controller',
    colorCodeStandard: 'IEC 60446 / Turkish Standard',
    connections: [
      // Power Supply
      { terminal: '1', function: 'DC Power +ve', wireColor: 'Red', wireSize: '2.5mm²', notes: '5A fused, 8-32V DC', pinType: 'power', voltage: '12/24V DC', maxCurrent: '1.5A' },
      { terminal: '2', function: 'DC Power -ve', wireColor: 'Black', wireSize: '2.5mm²', notes: 'System ground', pinType: 'ground' },
      // Generator Voltage
      { terminal: '3', function: 'Generator L1', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Direct 0-300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '4', function: 'Generator L2', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Direct 0-300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '5', function: 'Generator L3', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Direct 0-300V', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '6', function: 'Generator Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Neutral ref', pinType: 'input' },
      // Mains Voltage
      { terminal: '7', function: 'Mains L1', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'Utility L1', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '8', function: 'Mains L2', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Utility L2', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '9', function: 'Mains L3', wireColor: 'Grey', wireSize: '1.5mm²', notes: 'Utility L3', pinType: 'input', voltage: '0-300V AC' },
      { terminal: '10', function: 'Mains Neutral', wireColor: 'Blue', wireSize: '1.5mm²', notes: 'Utility N', pinType: 'input' },
      // Speed Input
      { terminal: '11', function: 'MPU Speed +', wireColor: 'White', wireSize: '1.0mm²', notes: 'Magnetic pickup', pinType: 'signal', voltage: '1-30V AC' },
      { terminal: '12', function: 'MPU Speed -', wireColor: 'White/Black', wireSize: '1.0mm²', notes: 'MPU return', pinType: 'signal' },
      // Analog Inputs
      { terminal: '13', function: 'Oil Pressure', wireColor: 'Green', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '14', function: 'Coolant Temp', wireColor: 'Green/White', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '15', function: 'Fuel Level', wireColor: 'Green/Black', wireSize: '1.0mm²', notes: 'Resistive 10-184Ω', pinType: 'input', voltage: '0-5V DC' },
      { terminal: '16', function: 'Sensor Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Ground', pinType: 'ground' },
      // Digital Inputs
      { terminal: '17', function: 'Emergency Stop', wireColor: 'Red/White', wireSize: '1.0mm²', notes: 'NC contact', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '18', function: 'Remote Start', wireColor: 'Red/Black', wireSize: '1.0mm²', notes: 'NO contact', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '19', function: 'Gen CB Aux', wireColor: 'Blue/White', wireSize: '1.0mm²', notes: 'Breaker pos', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '20', function: 'Mains CB Aux', wireColor: 'Blue/Black', wireSize: '1.0mm²', notes: 'Mains pos', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '21', function: 'Configurable 1', wireColor: 'Brown/White', wireSize: '1.0mm²', notes: 'User input', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '22', function: 'Configurable 2', wireColor: 'Brown/Black', wireSize: '1.0mm²', notes: 'User input', pinType: 'input', voltage: '0-32V DC' },
      { terminal: '23', function: 'Input Common', wireColor: 'Black', wireSize: '1.0mm²', notes: 'Input ground', pinType: 'ground' },
      // Relay Outputs
      { terminal: '24', function: 'Start NO', wireColor: 'Orange', wireSize: '2.5mm²', notes: 'Starter', pinType: 'output', maxCurrent: '5A' },
      { terminal: '25', function: 'Start COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Common', pinType: 'output' },
      { terminal: '26', function: 'Fuel NO', wireColor: 'Pink', wireSize: '2.5mm²', notes: 'Fuel solenoid', pinType: 'output', maxCurrent: '5A' },
      { terminal: '27', function: 'Fuel COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Common', pinType: 'output' },
      { terminal: '28', function: 'Gen CB NO', wireColor: 'Purple', wireSize: '2.5mm²', notes: 'Gen contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '29', function: 'Gen CB COM', wireColor: 'Purple/Black', wireSize: '2.5mm²', notes: 'Common', pinType: 'output' },
      { terminal: '30', function: 'Mains CB NO', wireColor: 'Violet', wireSize: '2.5mm²', notes: 'Mains contactor', pinType: 'output', maxCurrent: '5A' },
      { terminal: '31', function: 'Mains CB COM', wireColor: 'Violet/Black', wireSize: '2.5mm²', notes: 'Common', pinType: 'output' },
    ],
    schematicSections: [
      {
        name: 'DC Power',
        description: 'Simple DC power input',
        connections: ['Pin 1: +ve via 5A fuse', 'Pin 2: -ve ground'],
        diagram: 'BATTERY(+)──[5A FUSE]──PIN1──CONTROLLER\n                           │\nBATTERY(-)───────────────PIN2──GND'
      },
      {
        name: 'Voltage Sensing',
        description: 'Generator and mains voltage',
        connections: ['Pins 3-6: Generator', 'Pins 7-10: Mains', 'Direct <300V only'],
        diagram: 'GEN L1──[2A]──PIN3\nGEN L2──[2A]──PIN4\nGEN L3──[2A]──PIN5\nGEN N ────────PIN6'
      },
      {
        name: 'Sensors',
        description: 'VDO-type resistive sensors',
        connections: ['Pins 13-15: Oil, Temp, Fuel', 'Pin 16: Common ground'],
        diagram: 'OIL───PIN13──┐\nTEMP──PIN14──┼──PIN16\nFUEL──PIN15──┘'
      },
      {
        name: 'Outputs',
        description: 'Basic relay outputs',
        connections: ['Pins 24-25: Start', 'Pins 26-27: Fuel', 'Pins 28-31: CB'],
        diagram: '+VE──[FUSE]──PIN25──[RELAY]──PIN24──STARTER'
      }
    ],
    terminalBlocks: [
      {
        blockId: 'TB1',
        name: 'Power & Voltage',
        location: 'Top row',
        pins: [
          { pin: '1', function: 'DC+', wireColor: 'Red', wireSize: '2.5mm²', signalType: 'Power', voltage: '8-32V DC' },
          { pin: '2', function: 'DC-', wireColor: 'Black', wireSize: '2.5mm²', signalType: 'Ground' },
          { pin: '3', function: 'Gen L1', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' },
          { pin: '4', function: 'Gen L2', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'AC', voltage: '0-300V' }
        ]
      },
      {
        blockId: 'TB2',
        name: 'Outputs',
        location: 'Bottom row',
        pins: [
          { pin: '24', function: 'Start NO', wireColor: 'Orange', wireSize: '2.5mm²', signalType: 'Output', notes: '5A' },
          { pin: '25', function: 'Start COM', wireColor: 'Orange/Black', wireSize: '2.5mm²', signalType: 'Output' },
          { pin: '26', function: 'Fuel NO', wireColor: 'Pink', wireSize: '2.5mm²', signalType: 'Output', notes: '5A' },
          { pin: '27', function: 'Fuel COM', wireColor: 'Pink/Black', wireSize: '2.5mm²', signalType: 'Output' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'Power Supply', cores: 2, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Battery DC' },
      { cableType: 'Voltage Sensing', cores: 8, size: '1.5mm²', shielded: false, maxLength: '20m', application: 'Gen + Mains' },
      { cableType: 'MPU Cable', cores: 2, size: '1.0mm²', shielded: true, maxLength: '3m', application: 'Speed sensor' },
      { cableType: 'Sensor Cable', cores: 4, size: '1.0mm²', shielded: false, maxLength: '15m', application: 'Analog sensors' },
      { cableType: 'Digital Input', cores: 8, size: '1.0mm²', shielded: false, maxLength: '20m', application: 'Contacts' },
      { cableType: 'Relay Output', cores: 8, size: '2.5mm²', shielded: false, maxLength: '10m', application: 'Relay wiring' },
      { cableType: 'RS232', cores: 3, size: '0.5mm²', shielded: true, maxLength: '15m', application: 'PC connection' }
    ],
    groundingRequirements: [
      'Simple grounding at controller',
      'Generator frame bonded to ground',
      'Shield grounded if used'
    ],
    notes: [
      'Simple wiring for basic applications',
      'Budget-friendly controller',
      'Direct voltage sensing max 300V',
      'Use PT for higher voltages',
      'MPU shielded cable recommended',
      'Relay outputs 5A max',
      'Configure via RS232 and PC software'
    ],
    wireColors: {
      'DC +ve': 'Red',
      'DC -ve': 'Black',
      'Phase L1': 'Brown',
      'Phase L2': 'Black',
      'Phase L3': 'Grey',
      'Neutral': 'Blue',
      'Earth': 'Green/Yellow',
      'Speed': 'White',
      'Analog': 'Green',
      'Output': 'Orange'
    },
  },
  terminalPinouts: [],
  configurationGuide: [],
  repairProcedures: [
    {
      id: 'enko-lcd-display-failure',
      title: 'LCD Display Not Working, Dim, or Showing Partial Text',
      symptom: 'Display blank, faded text, missing segments, or flickering display',
      possibleCauses: [
        'LCD module failure',
        'Display ribbon cable loose',
        'Contrast adjustment incorrect',
        'LCD driver IC failure',
        'Backlight LED failure (if equipped)',
        'Power supply to LCD insufficient',
        'Cold temperature affecting LCD response'
      ],
      diagnosticSteps: [
        'Check if display shows anything at power-on',
        'Adjust contrast potentiometer (if accessible)',
        'Verify DC power supply voltage is correct',
        'Check display ribbon cable connection',
        'Test at room temperature if cold environment',
        'Listen for relay clicks indicating controller is running',
        'Connect via RS232 to verify controller is responsive'
      ],
      repairSteps: [
        'Re-seat LCD ribbon cable connector',
        'Adjust contrast potentiometer clockwise/counterclockwise',
        'Replace LCD module (common failure point)',
        'Clean ribbon cable contacts with IPA',
        'Check and repair display power supply circuit',
        'Replace backlight LEDs if equipped and failed',
        'Warm controller if cold-related issue'
      ],
      testProcedure: [
        'Verify all text segments visible',
        'Check display updates when values change',
        'Test at minimum and maximum contrast',
        'Verify display at different viewing angles',
        'Test in cold conditions if applicable'
      ],
      estimatedTime: '20-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['LCD module', 'Ribbon cable', 'Contrast potentiometer'],
      specialTools: ['Small screwdriver for contrast adjustment', 'Multimeter', 'IPA cleaner'],
      safetyPrecautions: ['Disconnect battery before opening', 'Handle LCD glass carefully']
    },
    {
      id: 'enko-keypad-not-responding',
      title: 'Keypad Buttons Stuck, Not Working, or Erratic Response',
      symptom: 'Buttons unresponsive, multiple button presses required, or ghost button presses',
      possibleCauses: [
        'Membrane keypad worn out',
        'Keypad flex cable disconnected',
        'Button contact corrosion',
        'Keypad matrix scanning IC failure',
        'Moisture ingress under keypad',
        'Physical damage to buttons',
        'Debris under keypad membrane'
      ],
      diagnosticSteps: [
        'Test each button individually',
        'Check for stuck buttons by feeling resistance',
        'Inspect keypad surface for damage or wear',
        'Open unit and check flex cable connection',
        'Look for moisture or corrosion on PCB',
        'Test button resistance with multimeter',
        'Check if issue is worse with certain buttons'
      ],
      repairSteps: [
        'Clean button contacts with IPA and cotton swab',
        'Re-seat keypad flex cable connector',
        'Replace membrane keypad overlay',
        'Clean PCB button contacts',
        'Apply silicone lubricant to stuck buttons',
        'Replace entire keypad assembly if worn',
        'Dry out moisture and apply conformal coating',
        'Replace if physical damage present'
      ],
      testProcedure: [
        'Test all buttons multiple times',
        'Verify button labels match function',
        'Test rapid button pressing',
        'Verify no false button triggers',
        'Test button operation through all menus'
      ],
      estimatedTime: '20-45 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['Membrane keypad overlay', 'Keypad flex cable', 'Contact cleaner'],
      specialTools: ['IPA cleaner', 'Small brush', 'Multimeter', 'Plastic spudger'],
      safetyPrecautions: ['Power off before opening', 'Do not damage flex cable']
    },
    {
      id: 'enko-sensor-input-failure',
      title: 'Analog Sensor Input Reading Incorrectly or Stuck',
      symptom: 'Temperature, pressure, or other sensor readings wrong, stuck at 0, or erratic values',
      possibleCauses: [
        'Sensor wiring fault (open or short)',
        'Input terminal corrosion',
        'Sensor failure (external)',
        'Input protection component failed',
        'ADC failure on controller',
        'Incorrect sensor type configured',
        'Ground loop interference'
      ],
      diagnosticSteps: [
        'Measure sensor output at controller terminals',
        'Verify sensor configuration matches installed sensor',
        'Check wiring for breaks or shorts',
        'Measure sensor directly to confirm good output',
        'Inspect input terminals for corrosion',
        'Test with known good sensor or signal simulator',
        'Check ground connections'
      ],
      repairSteps: [
        'Clean and tighten terminal connections',
        'Replace sensor wiring if damaged',
        'Replace external sensor if faulty',
        'Correct sensor type configuration',
        'Replace input protection components if shorted',
        'Install shielded cable if interference present',
        'Add separate ground for sensor circuit'
      ],
      testProcedure: [
        'Apply known temperature/pressure and verify reading',
        'Test across full sensor range',
        'Monitor reading stability over time',
        'Verify alarm setpoints trigger correctly',
        'Test with engine running for vibration interference'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement sensor', 'Terminal connectors', 'Shielded cable'],
      specialTools: ['Multimeter', 'Temperature probe', 'Signal simulator'],
      safetyPrecautions: ['Disconnect battery before terminal work', 'Verify sensor voltage levels']
    },
    {
      id: 'enko-relay-output-failure',
      title: 'Relay Output Not Switching or Stuck On/Off',
      symptom: 'Start relay not energizing, fuel solenoid not activating, or relay stuck closed',
      possibleCauses: [
        'Relay coil burned out',
        'Relay contacts welded closed',
        'Output transistor/driver failure',
        'Wiring fault to load',
        'Load drawing too much current',
        'Flyback diode missing causing damage',
        'Relay socket corrosion'
      ],
      diagnosticSteps: [
        'Listen for relay click when activated via menu',
        'Measure voltage at relay output terminals',
        'Check relay coil continuity with multimeter',
        'Inspect relay contacts for welding/pitting',
        'Measure load current draw',
        'Check output transistor with diode test',
        'Verify software output state matches physical'
      ],
      repairSteps: [
        'Replace failed relay (match ratings)',
        'Replace output driver transistor',
        'Clean relay socket contacts',
        'Add flyback/snubber diode across relay coil',
        'Install external relay for high-current loads',
        'Reduce load current if exceeding rating',
        'Replace entire output board if multiple failures'
      ],
      testProcedure: [
        'Manually activate each output via test menu',
        'Measure output voltage/continuity',
        'Test with actual load connected',
        'Verify relay releases cleanly',
        'Test rapid on/off cycling',
        'Monitor relay temperature during operation'
      ],
      estimatedTime: '30-60 minutes',
      difficultyLevel: 'intermediate',
      partsNeeded: ['Replacement relay', 'Output transistor', 'Flyback diode', 'Relay socket'],
      specialTools: ['Multimeter', 'Soldering iron', 'Relay extraction tool'],
      safetyPrecautions: ['Disconnect all loads before testing', 'Verify relay voltage/current ratings', 'Use proper relay for inductive loads']
    },
    {
      id: 'enko-rs232-communication-failure',
      title: 'RS232/RS485 Communication Port Not Working',
      symptom: 'Cannot connect via PC software, no data transmission, or garbled data',
      possibleCauses: [
        'Wrong COM port selected in software',
        'Baud rate mismatch',
        'RS232 level converter IC failure',
        'Serial cable fault or wrong pinout',
        'USB-RS232 adapter driver issue',
        'TX/RX lines swapped',
        'EMI interference on serial line'
      ],
      diagnosticSteps: [
        'Verify COM port in Windows Device Manager',
        'Check cable continuity pin-to-pin',
        'Verify TX/RX pinout matches documentation',
        'Try different USB-RS232 adapter',
        'Check baud rate setting (usually 9600 or 19200)',
        'Measure RS232 voltage levels (should be ±3-15V)',
        'Test with serial terminal program'
      ],
      repairSteps: [
        'Install correct USB-RS232 driver',
        'Make cable with correct pinout (2-3-5 or custom)',
        'Replace MAX232 or similar level converter IC',
        'Clean serial port connector',
        'Set correct baud rate in controller and software',
        'Use shielded serial cable',
        'Replace serial port connector if damaged'
      ],
      testProcedure: [
        'Send and receive test commands',
        'Verify Enko software connects successfully',
        'Read and write parameters',
        'Test data transfer at various baud rates',
        'Confirm stable communication over extended period'
      ],
      estimatedTime: '20-60 minutes',
      difficultyLevel: 'beginner',
      partsNeeded: ['RS232 cable', 'MAX232 IC', 'USB-RS232 adapter', 'DB9 connector'],
      specialTools: ['Serial cable tester', 'Oscilloscope', 'Enko configurator software', 'Serial terminal program'],
      safetyPrecautions: ['RS232 voltages can damage TTL devices', 'Verify pinout before connecting']
    }
  ],
  calibrationProcedures: [],
  commonFaults: [
    { code: 'E01', title: 'Low Oil Pressure', description: 'Oil pressure below minimum', severity: 'shutdown', causes: ['Low oil', 'Sensor fault'], solutions: ['Add oil', 'Check sensor'], resetProcedure: ['Fix issue', 'Press RESET'] },
    { code: 'E02', title: 'High Temperature', description: 'Engine overheat', severity: 'shutdown', causes: ['Low coolant', 'Fan fault'], solutions: ['Add coolant', 'Check fan'], resetProcedure: ['Cool engine', 'Press RESET'] },
    { code: 'E03', title: 'Fail to Start', description: 'Engine did not start', severity: 'critical', causes: ['Fuel issue', 'Starter fault'], solutions: ['Check fuel', 'Check starter'], resetProcedure: ['Fix issue', 'Retry'] },
    { code: 'E04', title: 'Over Speed', description: 'Engine RPM too high', severity: 'shutdown', causes: ['Governor fault'], solutions: ['Check governor'], resetProcedure: ['Press RESET'] },
    { code: 'E05', title: 'Under Speed', description: 'Engine RPM too low', severity: 'warning', causes: ['Load too high', 'Fuel issue'], solutions: ['Reduce load', 'Check fuel'], resetProcedure: ['Fix issue', 'Auto-reset'] }
  ],
  maintenanceSchedule: [
    { task: 'Connection Check', interval: 'Monthly', procedure: ['Inspect all terminals', 'Tighten connections', 'Check for corrosion'] },
    { task: 'Software Backup', interval: 'Quarterly', procedure: ['Connect via RS232', 'Export parameters', 'Store backup file'] },
    { task: 'Relay Test', interval: 'Semi-annually', procedure: ['Test each output relay', 'Check contact condition', 'Replace if worn'] }
  ],
  troubleshootingGuide: [],
  spareParts: [
    { partNumber: 'EK3000', description: 'EK3000 Controller', price: 'KES 18,000', availability: 'in-stock' },
    { partNumber: 'EK-LCD', description: 'LCD Display Module', price: 'KES 3,500', availability: 'in-stock' },
    { partNumber: 'EK-KEYPAD', description: 'Membrane Keypad', price: 'KES 2,000', availability: 'in-stock' },
    { partNumber: 'EK-RELAY', description: 'Output Relay Set (4pcs)', price: 'KES 1,500', availability: 'in-stock' },
    { partNumber: 'EK-CABLE', description: 'RS232 Programming Cable', price: 'KES 800', availability: 'in-stock' },
  ],
  safetyWarnings: ['Basic safety precautions', 'Disconnect battery before repairs', 'Verify wiring before power-on'],
  toolsRequired: ['Enko software', 'RS232 cable', 'Multimeter', 'Basic hand tools'],
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
  description: 'Volvo Penta Compatible Diagnostic Interface for marine and industrial engines. Comprehensive engine diagnostics, parameter adjustment, and fault code reading for all Volvo Penta electronic engines.',
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
    description: 'Volvo Penta VODIA Complete Wiring - Engine Diagnostic Interface & ECU Connections',
    colorCodeStandard: 'SAE J1939 / Volvo Penta Standard',
    connections: [
      // 9-Pin Diagnostic Connector
      { terminal: 'Pin 1', function: 'CAN High (J1939)', wireColor: 'Yellow/Green', wireSize: '0.75mm²', notes: 'Primary CAN bus high', pinType: 'communication', voltage: '2.5-3.5V' },
      { terminal: 'Pin 2', function: 'CAN Low (J1939)', wireColor: 'Yellow/Brown', wireSize: '0.75mm²', notes: 'Primary CAN bus low', pinType: 'communication', voltage: '1.5-2.5V' },
      { terminal: 'Pin 3', function: 'Signal Ground', wireColor: 'Brown', wireSize: '1.5mm²', notes: 'CAN reference ground', pinType: 'ground' },
      { terminal: 'Pin 4', function: 'K-Line (ISO 9141)', wireColor: 'White', wireSize: '0.75mm²', notes: 'Legacy protocol for older engines', pinType: 'communication', voltage: '0-12V' },
      { terminal: 'Pin 5', function: 'Reserved', wireColor: '-', wireSize: '-', notes: 'Not connected', pinType: 'signal' },
      { terminal: 'Pin 6', function: 'Battery +ve (12/24V)', wireColor: 'Red', wireSize: '1.5mm²', notes: 'VODIA interface power', pinType: 'power', voltage: '12-24V DC', maxCurrent: '0.5A' },
      { terminal: 'Pin 7', function: 'Power Ground', wireColor: 'Black', wireSize: '1.5mm²', notes: 'Power return', pinType: 'ground' },
      { terminal: 'Pin 8', function: 'CAN High 2 (Auxiliary)', wireColor: 'Pink', wireSize: '0.75mm²', notes: 'Secondary CAN bus for accessories', pinType: 'communication', voltage: '2.5-3.5V' },
      { terminal: 'Pin 9', function: 'CAN Low 2 (Auxiliary)', wireColor: 'Grey', wireSize: '0.75mm²', notes: 'Secondary CAN bus low', pinType: 'communication', voltage: '1.5-2.5V' },
      // ECU Main Connector (89-pin)
      { terminal: 'ECU-A1', function: 'Battery +ve Main', wireColor: 'Red', wireSize: '6mm²', notes: 'ECU main power', pinType: 'power', voltage: '12/24V DC', maxCurrent: '30A' },
      { terminal: 'ECU-A2', function: 'Battery -ve Main', wireColor: 'Black', wireSize: '6mm²', notes: 'ECU main ground', pinType: 'ground' },
      { terminal: 'ECU-A3', function: 'Ignition/Key Switch', wireColor: 'Red/White', wireSize: '1.5mm²', notes: 'Key position signal', pinType: 'input', voltage: '12/24V DC' },
      { terminal: 'ECU-A4', function: 'Start Signal', wireColor: 'Orange', wireSize: '1.5mm²', notes: 'Start command from key', pinType: 'input', voltage: '12/24V DC' },
      { terminal: 'ECU-B1', function: 'J1939 CAN-H', wireColor: 'Yellow/Green', wireSize: '0.75mm²', notes: 'Engine CAN high', pinType: 'communication' },
      { terminal: 'ECU-B2', function: 'J1939 CAN-L', wireColor: 'Yellow/Brown', wireSize: '0.75mm²', notes: 'Engine CAN low', pinType: 'communication' },
      { terminal: 'ECU-C1', function: 'Crankshaft Position +', wireColor: 'Blue', wireSize: '0.75mm²', notes: 'Crankshaft sensor', pinType: 'signal' },
      { terminal: 'ECU-C2', function: 'Crankshaft Position -', wireColor: 'Blue/Black', wireSize: '0.75mm²', notes: 'Crankshaft return', pinType: 'signal' },
      { terminal: 'ECU-C3', function: 'Camshaft Position +', wireColor: 'Green', wireSize: '0.75mm²', notes: 'Camshaft sensor', pinType: 'signal' },
      { terminal: 'ECU-C4', function: 'Camshaft Position -', wireColor: 'Green/Black', wireSize: '0.75mm²', notes: 'Camshaft return', pinType: 'signal' },
      { terminal: 'ECU-D1', function: 'Boost Pressure Sensor', wireColor: 'Violet', wireSize: '0.75mm²', notes: 'Turbo pressure', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'ECU-D2', function: 'Coolant Temp Sensor', wireColor: 'Brown/Green', wireSize: '0.75mm²', notes: 'Engine temp', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'ECU-D3', function: 'Oil Pressure Sensor', wireColor: 'Brown/Red', wireSize: '0.75mm²', notes: 'Oil pressure', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'ECU-D4', function: 'Fuel Pressure Sensor', wireColor: 'Brown/Blue', wireSize: '0.75mm²', notes: 'Common rail pressure', pinType: 'input', voltage: '0-5V DC' },
      { terminal: 'ECU-E1', function: 'Injector 1', wireColor: 'Black/Yellow', wireSize: '1.5mm²', notes: 'Cylinder 1 injector', pinType: 'output', maxCurrent: '20A peak' },
      { terminal: 'ECU-E2', function: 'Injector 2', wireColor: 'Black/Red', wireSize: '1.5mm²', notes: 'Cylinder 2 injector', pinType: 'output', maxCurrent: '20A peak' },
      { terminal: 'ECU-E3', function: 'Injector 3', wireColor: 'Black/Blue', wireSize: '1.5mm²', notes: 'Cylinder 3 injector', pinType: 'output', maxCurrent: '20A peak' },
      { terminal: 'ECU-E4', function: 'Injector 4', wireColor: 'Black/Green', wireSize: '1.5mm²', notes: 'Cylinder 4 injector', pinType: 'output', maxCurrent: '20A peak' },
      { terminal: 'ECU-F1', function: 'Starter Relay Output', wireColor: 'Orange/Black', wireSize: '2.5mm²', notes: 'Start relay control', pinType: 'output', maxCurrent: '5A' },
      { terminal: 'ECU-F2', function: 'Engine Stop Solenoid', wireColor: 'Pink/Black', wireSize: '2.5mm²', notes: 'Fuel shutoff', pinType: 'output', maxCurrent: '5A' },
    ],
    schematicSections: [
      {
        name: 'VODIA Diagnostic Interface',
        description: '9-pin diagnostic connector for VODIA tool connection',
        connections: ['Pins 1-2: Primary J1939 CAN', 'Pins 8-9: Secondary CAN', 'Pin 6-7: Power', 'Pin 4: K-Line'],
        diagram: 'VODIA TOOL──USB──PC\n     │\n     └──[9-PIN]──ENGINE ECU\n          1─CAN_H──┐\n          2─CAN_L──┼──ECU CAN BUS\n          6─+12V───┘\n          7─GND'
      },
      {
        name: 'J1939 CAN Bus Network',
        description: 'High-speed CAN network connecting ECU to displays and accessories',
        connections: ['250 kbps standard J1939', '120Ω termination at each end', 'Twisted shielded pair'],
        diagram: 'ECU──[120Ω]──CAN_H──┬──DISPLAY──┬──VODIA\n              CAN_L──┤           │\n                     └───────[120Ω]'
      },
      {
        name: 'Engine Sensor Inputs',
        description: 'Crankshaft/camshaft position and analog sensors',
        connections: ['Hall effect or VR position sensors', '4-20mA or 0-5V analog sensors'],
        diagram: 'CRANKSHAFT──[SENSOR]──ECU-C1/C2\nCAMSHAFT────[SENSOR]──ECU-C3/C4\nBOOST───────[0-5V]────ECU-D1\nTEMP────────[NTC]─────ECU-D2'
      },
      {
        name: 'Injector Outputs',
        description: 'Common rail injector drivers (high current)',
        connections: ['Peak current 20A', 'Hold current 8A', 'Grouped common rail supply'],
        diagram: 'RAIL PRESSURE──[HP PUMP]──COMMON RAIL──INJ1/2/3/4\n                                         │\n                            ECU────────[DRIVERS]'
      },
      {
        name: 'Engine Control Outputs',
        description: 'Starter and stop solenoid control',
        connections: ['ECU-F1: Start relay', 'ECU-F2: Stop solenoid'],
        diagram: 'BATTERY──[STARTER]──GND\n              │\n         ECU-F1 (RELAY)──START MOTOR\n         ECU-F2──────────FUEL SHUTOFF'
      }
    ],
    terminalBlocks: [
      {
        blockId: '9-PIN DIAG',
        name: 'VODIA Diagnostic Port',
        location: 'Engine harness',
        pins: [
          { pin: '1', function: 'CAN-H', wireColor: 'Yellow/Green', wireSize: '0.75mm²', signalType: 'CAN', voltage: '2.5-3.5V' },
          { pin: '2', function: 'CAN-L', wireColor: 'Yellow/Brown', wireSize: '0.75mm²', signalType: 'CAN', voltage: '1.5-2.5V' },
          { pin: '3', function: 'SIG GND', wireColor: 'Brown', wireSize: '1.5mm²', signalType: 'Ground' },
          { pin: '4', function: 'K-Line', wireColor: 'White', wireSize: '0.75mm²', signalType: 'Serial' },
          { pin: '6', function: '+12/24V', wireColor: 'Red', wireSize: '1.5mm²', signalType: 'Power', voltage: '12-24V DC' },
          { pin: '7', function: 'PWR GND', wireColor: 'Black', wireSize: '1.5mm²', signalType: 'Ground' },
          { pin: '8', function: 'CAN2-H', wireColor: 'Pink', wireSize: '0.75mm²', signalType: 'CAN' },
          { pin: '9', function: 'CAN2-L', wireColor: 'Grey', wireSize: '0.75mm²', signalType: 'CAN' }
        ]
      },
      {
        blockId: 'ECU-MAIN',
        name: 'ECU Main Connector',
        location: 'Engine ECU',
        pins: [
          { pin: 'A1', function: 'Batt +', wireColor: 'Red', wireSize: '6mm²', signalType: 'Power', voltage: '12/24V' },
          { pin: 'A2', function: 'Batt -', wireColor: 'Black', wireSize: '6mm²', signalType: 'Ground' },
          { pin: 'B1', function: 'CAN-H', wireColor: 'Yellow/Green', wireSize: '0.75mm²', signalType: 'CAN' },
          { pin: 'B2', function: 'CAN-L', wireColor: 'Yellow/Brown', wireSize: '0.75mm²', signalType: 'CAN' }
        ]
      }
    ],
    cableSpecifications: [
      { cableType: 'VODIA Cable', cores: 9, size: '0.75-1.5mm²', shielded: true, maxLength: '3m', application: 'Diagnostic connection' },
      { cableType: 'J1939 CAN', cores: 2, size: '0.75mm²', shielded: true, maxLength: '40m', application: 'CAN network backbone' },
      { cableType: 'ECU Power', cores: 2, size: '6mm²', shielded: false, maxLength: '5m', application: 'ECU main power' },
      { cableType: 'Sensor Cable', cores: 4, size: '0.75mm²', shielded: true, maxLength: '10m', application: 'Engine sensors' },
      { cableType: 'Injector Cable', cores: 8, size: '1.5mm²', shielded: true, maxLength: '3m', application: 'Injector drivers' },
      { cableType: 'USB Cable', cores: 4, size: 'USB 2.0', shielded: true, maxLength: '5m', application: 'PC connection' }
    ],
    groundingRequirements: [
      'Use only genuine Volvo Penta diagnostic cables',
      'Engine block is primary ground reference',
      'ECU ground must connect directly to battery negative',
      'CAN shield grounded at one end only',
      '120Ω termination resistor at each end of CAN bus',
      'For marine: verify ground isolation from seawater'
    ],
    notes: [
      'Use only genuine Volvo Penta diagnostic cables',
      'Ensure ignition is ON before connecting VODIA',
      'Do not disconnect while software update is in progress',
      'CAN bus termination is built into the interface',
      'For marine applications, ensure all batteries are fully charged',
      'Always update VODIA software to latest version before diagnosis',
      'J1939 CAN bus operates at 250 kbps',
      'ECU requires stable battery voltage for programming',
      'Volvo Penta trained technicians only for ECU work',
      'Record fault codes before clearing'
    ],
    wireColors: {
      'CAN High': 'Yellow/Green',
      'CAN Low': 'Yellow/Brown',
      'Signal Ground': 'Brown',
      'Power Ground': 'Black',
      'Battery +': 'Red',
      'K-Line': 'White',
      'Injector': 'Black/Color',
      'Sensor +': 'Various',
      'Sensor -': 'Black/Color',
      'Start': 'Orange',
      'Stop': 'Pink'
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
    configSoftware: 'VODIA (Manufacturer Diagnostic Software)',
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
