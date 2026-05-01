/**
 * GENERATOR ORACLE UNIVERSAL DIAGNOSTIC INTERFACE (GOUDI)
 *
 * A complete, manufacturer-independent diagnostic and programming platform
 * that replaces the need for:
 * - CAT ET (Caterpillar Electronic Technician)
 * - Cummins INSITE
 * - Volvo VODIA
 * - Perkins EST
 * - John Deere Service Advisor
 * - Deutz SERDIA
 * - MTU Diasys
 * - And ALL other proprietary tools
 *
 * ONE TOOL FOR ALL GENERATORS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// HARDWARE ADAPTER SPECIFICATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface HardwareAdapterSpec {
  name: string;
  version: string;
  protocols: ProtocolSpec[];
  connectors: ConnectorSpec[];
  communication: CommunicationSpec;
  powerSpec: PowerSpec;
  enclosure: EnclosureSpec;
}

export interface ProtocolSpec {
  name: string;
  type: 'CAN' | 'J1939' | 'J1708' | 'RS485' | 'RS232' | 'MODBUS' | 'ISO9141' | 'KWP2000';
  baudRates: number[];
  maxNodes?: number;
  description: string;
}

export interface ConnectorSpec {
  name: string;
  type: string;
  pins: number;
  compatibleECMs: string[];
  pinout: PinDefinition[];
}

export interface PinDefinition {
  pin: number;
  signal: string;
  direction: 'in' | 'out' | 'bidirectional';
  description: string;
}

export interface CommunicationSpec {
  interfaces: ('USB' | 'Ethernet' | 'WiFi' | 'Bluetooth')[];
  usbSpec: string;
  ethernetSpeed: string;
  wifiSpec: string;
  bluetoothSpec: string;
}

export interface PowerSpec {
  inputVoltage: string;
  inputCurrent: string;
  powerSource: ('USB' | 'Vehicle' | 'External')[];
  isolation: boolean;
}

export interface EnclosureSpec {
  ipRating: string;
  material: string;
  dimensions: { length: number; width: number; height: number };
  weight: number;
  temperatureRange: { min: number; max: number };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GOUDI HARDWARE ADAPTER DEFINITION
// ═══════════════════════════════════════════════════════════════════════════════

export const GOUDI_ADAPTER: HardwareAdapterSpec = {
  name: 'Generator Oracle Universal Diagnostic Interface',
  version: '1.0',
  protocols: [
    {
      name: 'J1939 CAN',
      type: 'J1939',
      baudRates: [250000, 500000],
      maxNodes: 254,
      description: 'SAE J1939 over CAN 2.0B - Standard for modern diesel ECMs'
    },
    {
      name: 'CAN 2.0',
      type: 'CAN',
      baudRates: [125000, 250000, 500000, 1000000],
      maxNodes: 127,
      description: 'Generic CAN bus for proprietary protocols'
    },
    {
      name: 'J1708/J1587',
      type: 'J1708',
      baudRates: [9600],
      maxNodes: 128,
      description: 'Legacy heavy-duty vehicle protocol'
    },
    {
      name: 'RS-485 Modbus',
      type: 'MODBUS',
      baudRates: [9600, 19200, 38400, 57600, 115200],
      maxNodes: 247,
      description: 'Industrial Modbus RTU for sensors and controllers'
    },
    {
      name: 'RS-232',
      type: 'RS232',
      baudRates: [9600, 19200, 38400, 57600, 115200, 230400],
      description: 'Serial connection for legacy controllers'
    },
    {
      name: 'ISO 9141-2',
      type: 'ISO9141',
      baudRates: [10400],
      description: 'K-Line protocol for older ECMs'
    },
    {
      name: 'ISO 14230 KWP2000',
      type: 'KWP2000',
      baudRates: [10400],
      description: 'Keyword Protocol 2000 for diagnostics'
    }
  ],
  connectors: [
    {
      name: 'Universal 40-Pin Main',
      type: 'Deutsch HD36-24-31PE',
      pins: 40,
      compatibleECMs: ['All via adapter cables'],
      pinout: [
        { pin: 1, signal: 'CAN_H_1', direction: 'bidirectional', description: 'CAN Bus 1 High' },
        { pin: 2, signal: 'CAN_L_1', direction: 'bidirectional', description: 'CAN Bus 1 Low' },
        { pin: 3, signal: 'CAN_H_2', direction: 'bidirectional', description: 'CAN Bus 2 High' },
        { pin: 4, signal: 'CAN_L_2', direction: 'bidirectional', description: 'CAN Bus 2 Low' },
        { pin: 5, signal: 'J1708_A', direction: 'bidirectional', description: 'J1708 Data A' },
        { pin: 6, signal: 'J1708_B', direction: 'bidirectional', description: 'J1708 Data B' },
        { pin: 7, signal: 'RS485_A', direction: 'bidirectional', description: 'RS-485 Data A+' },
        { pin: 8, signal: 'RS485_B', direction: 'bidirectional', description: 'RS-485 Data B-' },
        { pin: 9, signal: 'RS232_TX', direction: 'out', description: 'RS-232 Transmit' },
        { pin: 10, signal: 'RS232_RX', direction: 'in', description: 'RS-232 Receive' },
        { pin: 11, signal: 'K_LINE', direction: 'bidirectional', description: 'ISO 9141 K-Line' },
        { pin: 12, signal: 'L_LINE', direction: 'out', description: 'ISO 9141 L-Line' },
        { pin: 13, signal: 'VBAT', direction: 'in', description: 'Vehicle Battery +' },
        { pin: 14, signal: 'GND', direction: 'in', description: 'Ground' },
        { pin: 15, signal: 'IGN', direction: 'in', description: 'Ignition Sense' },
        // ... additional pins for future expansion
      ]
    }
  ],
  communication: {
    interfaces: ['USB', 'Ethernet', 'WiFi', 'Bluetooth'],
    usbSpec: 'USB 3.0 Type-C, 5Gbps',
    ethernetSpeed: '100Mbps',
    wifiSpec: '802.11ac dual-band',
    bluetoothSpec: 'Bluetooth 5.0 LE'
  },
  powerSpec: {
    inputVoltage: '8-32V DC',
    inputCurrent: '500mA max',
    powerSource: ['USB', 'Vehicle'],
    isolation: true
  },
  enclosure: {
    ipRating: 'IP67',
    material: 'Reinforced ABS with aluminum heat sink',
    dimensions: { length: 180, width: 120, height: 45 },
    weight: 450,
    temperatureRange: { min: -40, max: 85 }
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// OEM ADAPTER CABLES
// ═══════════════════════════════════════════════════════════════════════════════

export interface AdapterCable {
  id: string;
  name: string;
  oem: string;
  connectorType: string;
  pins: number;
  compatibleModels: string[];
  protocols: string[];
  pinMapping: Record<string, number>;
}

export const ADAPTER_CABLES: AdapterCable[] = [
  {
    id: 'CAT_14PIN',
    name: 'Caterpillar 14-Pin Adapter',
    oem: 'Caterpillar',
    connectorType: 'CAT Service Port',
    pins: 14,
    compatibleModels: ['C-series', '3500 series', '3400 series', 'C4.4', 'C7', 'C9', 'C13', 'C15', 'C18', 'C27', 'C32'],
    protocols: ['J1939', 'CAT Proprietary'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'GND': 3,
      'VBAT': 4,
      'J1939_SHIELD': 5
    }
  },
  {
    id: 'CUMMINS_9PIN',
    name: 'Cummins 9-Pin Adapter',
    oem: 'Cummins',
    connectorType: 'Deutsch 9-Pin',
    pins: 9,
    compatibleModels: ['ISB', 'ISC', 'ISL', 'ISM', 'ISX', 'QSB', 'QSC', 'QSL', 'QSM', 'QSX', 'QSK', 'QST'],
    protocols: ['J1939', 'J1708'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'J1708_A': 4,
      'J1708_B': 5,
      'GND': 6,
      'VBAT': 9
    }
  },
  {
    id: 'VOLVO_8PIN',
    name: 'Volvo Penta 8-Pin Adapter',
    oem: 'Volvo Penta',
    connectorType: 'Volvo Diagnostic',
    pins: 8,
    compatibleModels: ['TAD series', 'TWD series', 'D5', 'D7', 'D11', 'D13', 'D16'],
    protocols: ['J1939', 'Volvo VODIA'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'K_LINE': 3,
      'GND': 4,
      'VBAT': 8
    }
  },
  {
    id: 'PERKINS_9PIN',
    name: 'Perkins 9-Pin Adapter',
    oem: 'Perkins',
    connectorType: 'Perkins Diagnostic',
    pins: 9,
    compatibleModels: ['400 series', '800 series', '1100 series', '1200 series', '1500 series', '2000 series', '4000 series'],
    protocols: ['J1939'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'GND': 3,
      'VBAT': 9
    }
  },
  {
    id: 'DEERE_9PIN',
    name: 'John Deere 9-Pin Adapter',
    oem: 'John Deere',
    connectorType: 'Deere Diagnostic',
    pins: 9,
    compatibleModels: ['4045', '6068', '6090', 'PowerTech'],
    protocols: ['J1939', 'JD Proprietary'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'GND': 4,
      'VBAT': 9
    }
  },
  {
    id: 'DEUTZ_12PIN',
    name: 'Deutz 12-Pin Adapter',
    oem: 'Deutz',
    connectorType: 'Deutsch HD10-12',
    pins: 12,
    compatibleModels: ['TCD series', 'BFM series'],
    protocols: ['J1939', 'Deutz SERDIA'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'RS232_TX': 5,
      'RS232_RX': 6,
      'GND': 7,
      'VBAT': 12
    }
  },
  {
    id: 'MTU_14PIN',
    name: 'MTU 14-Pin Adapter',
    oem: 'MTU',
    connectorType: 'MTU Diagnostic',
    pins: 14,
    compatibleModels: ['2000 series', '4000 series'],
    protocols: ['J1939', 'MTU Diasys'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'CAN_H_2': 3,
      'CAN_L_2': 4,
      'GND': 7,
      'VBAT': 14
    }
  },
  {
    id: 'DSE_6PIN',
    name: 'DSE Controller 6-Pin',
    oem: 'Deep Sea Electronics',
    connectorType: 'RJ45 + DB9',
    pins: 6,
    compatibleModels: ['DSE 7xxx', 'DSE 8xxx', 'DSE 6xxx', 'DSE 5xxx'],
    protocols: ['RS232', 'Modbus RTU', 'J1939'],
    pinMapping: {
      'RS232_TX': 2,
      'RS232_RX': 3,
      'GND': 5,
      'CAN_H': 6,
      'CAN_L': 7
    }
  },
  {
    id: 'COMAP_USB',
    name: 'ComAp USB Adapter',
    oem: 'ComAp',
    connectorType: 'USB + CAN',
    pins: 4,
    compatibleModels: ['InteliGen', 'InteliLite', 'InteliSys', 'InteliDrive'],
    protocols: ['USB', 'J1939'],
    pinMapping: {
      'USB_D+': 1,
      'USB_D-': 2,
      'CAN_H': 3,
      'CAN_L': 4
    }
  },
  {
    id: 'YANMAR_6PIN',
    name: 'Yanmar 6-Pin Adapter',
    oem: 'Yanmar',
    connectorType: 'Yanmar Diagnostic',
    pins: 6,
    compatibleModels: ['TNV series', 'TNM series'],
    protocols: ['J1939', 'ISO9141'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'K_LINE': 3,
      'GND': 4,
      'VBAT': 6
    }
  },
  {
    id: 'DOOSAN_12PIN',
    name: 'Doosan 12-Pin Adapter',
    oem: 'Doosan',
    connectorType: 'Doosan Diagnostic',
    pins: 12,
    compatibleModels: ['DV series', 'DP series'],
    protocols: ['J1939'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'GND': 6,
      'VBAT': 12
    }
  },
  {
    id: 'MAN_16PIN',
    name: 'MAN 16-Pin Adapter',
    oem: 'MAN',
    connectorType: 'MAN Diagnostic',
    pins: 16,
    compatibleModels: ['D series', 'E series'],
    protocols: ['J1939', 'MAN CATS'],
    pinMapping: {
      'CAN_H': 6,
      'CAN_L': 14,
      'GND': 4,
      'VBAT': 16
    }
  },
  {
    id: 'IVECO_38PIN',
    name: 'Iveco/FPT 38-Pin Adapter',
    oem: 'Iveco/FPT',
    connectorType: 'Iveco Diagnostic',
    pins: 38,
    compatibleModels: ['Cursor series', 'NEF series', 'F series'],
    protocols: ['J1939', 'Iveco EASY'],
    pinMapping: {
      'CAN_H': 6,
      'CAN_L': 14,
      'GND': 31,
      'VBAT': 16
    }
  },
  {
    id: 'WEICHAI_12PIN',
    name: 'Weichai 12-Pin Adapter',
    oem: 'Weichai',
    connectorType: 'Weichai Diagnostic',
    pins: 12,
    compatibleModels: ['WP series', 'WD series'],
    protocols: ['J1939'],
    pinMapping: {
      'CAN_H': 1,
      'CAN_L': 2,
      'GND': 6,
      'VBAT': 12
    }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROTOCOL ABSTRACTION LAYER
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProtocolDriver {
  id: string;
  name: string;
  protocol: string;
  initialize: () => Promise<boolean>;
  connect: (config: ConnectionConfig) => Promise<ConnectionResult>;
  disconnect: () => Promise<void>;
  sendMessage: (message: DiagnosticMessage) => Promise<DiagnosticResponse>;
  readParameters: (pgns: number[]) => Promise<ParameterData[]>;
  writeParameter: (spn: number, value: number) => Promise<boolean>;
  readFaultCodes: () => Promise<FaultCode[]>;
  clearFaultCodes: () => Promise<boolean>;
  uploadFirmware: (firmware: FirmwarePackage) => Promise<FirmwareResult>;
  downloadCalibration: () => Promise<CalibrationData>;
  uploadCalibration: (calibration: CalibrationData) => Promise<boolean>;
}

export interface ConnectionConfig {
  protocol: string;
  baudRate: number;
  canId?: number;
  sourceAddress?: number;
  targetAddress?: number;
  timeout?: number;
}

export interface ConnectionResult {
  success: boolean;
  ecmInfo?: ECMInfo;
  error?: string;
}

export interface ECMInfo {
  manufacturer: string;
  model: string;
  serialNumber: string;
  firmwareVersion: string;
  hardwareVersion: string;
  calibrationId: string;
  engineType: string;
  productionDate: string;
  totalHours: number;
}

export interface DiagnosticMessage {
  pgn: number;
  data: Uint8Array;
  priority?: number;
  destinationAddress?: number;
}

export interface DiagnosticResponse {
  success: boolean;
  pgn: number;
  data: Uint8Array;
  sourceAddress: number;
  timestamp: number;
}

export interface ParameterData {
  spn: number;
  name: string;
  value: number;
  unit: string;
  rawValue: number;
  status: 'valid' | 'error' | 'not_available';
}

export interface FaultCode {
  spn: number;
  fmi: number;
  occurrenceCount: number;
  lampStatus: 'off' | 'amber' | 'red' | 'protect';
  description: string;
  firstOccurrence?: Date;
  lastOccurrence?: Date;
  active: boolean;
}

export interface FirmwarePackage {
  ecmModel: string;
  version: string;
  checksum: string;
  data: ArrayBuffer;
  blockSize: number;
  totalBlocks: number;
}

export interface FirmwareResult {
  success: boolean;
  blocksWritten: number;
  totalBlocks: number;
  verificationPassed: boolean;
  error?: string;
}

export interface CalibrationData {
  ecmModel: string;
  calibrationId: string;
  parameters: CalibrationParameter[];
  checksum: string;
}

export interface CalibrationParameter {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  defaultValue: number;
  description: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMDatabase {
  id: string;
  manufacturer: string;
  model: string;
  variants: string[];
  engineModels: string[];
  protocols: string[];
  firmwareVersions: FirmwareVersion[];
  calibrationFiles: CalibrationFile[];
  parameterList: ECMParameter[];
  faultCodeList: ECMFaultCode[];
  compatibleControllers: string[];
  wiringDiagram: string;
  serviceManual: string;
}

export interface FirmwareVersion {
  version: string;
  releaseDate: string;
  releaseNotes: string[];
  bugFixes: string[];
  newFeatures: string[];
  compatibility: string[];
  downloadUrl?: string;
  checksum: string;
  size: number;
}

export interface CalibrationFile {
  id: string;
  name: string;
  engineApplication: string;
  ratingKw: number;
  ratingRpm: number;
  emissionStandard: string;
  version: string;
  checksum: string;
}

export interface ECMParameter {
  spn: number;
  name: string;
  category: string;
  description: string;
  unit: string;
  dataType: 'uint8' | 'uint16' | 'uint32' | 'int8' | 'int16' | 'int32' | 'float';
  resolution: number;
  offset: number;
  min: number;
  max: number;
  defaultValue: number;
  readOnly: boolean;
  affectsEmissions: boolean;
  requiresPassword: boolean;
}

export interface ECMFaultCode {
  spn: number;
  fmi: number;
  description: string;
  severity: 'warning' | 'derate' | 'shutdown';
  possibleCauses: string[];
  diagnosticProcedure: string[];
  repairProcedure: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM DATABASE ENTRIES
// ═══════════════════════════════════════════════════════════════════════════════

export const ECM_DATABASE: ECMDatabase[] = [
  {
    id: 'CUMMINS_CM2350',
    manufacturer: 'Cummins',
    model: 'CM2350',
    variants: ['CM2350A', 'CM2350B', 'CM2350C'],
    engineModels: ['QSB6.7', 'QSL9', 'QSX15', 'X12', 'X15'],
    protocols: ['J1939', 'J1708'],
    firmwareVersions: [
      {
        version: '6.32.0',
        releaseDate: '2024-01-15',
        releaseNotes: ['Improved cold start performance', 'Enhanced DPF regeneration'],
        bugFixes: ['Fixed intermittent SPN 3719 fault', 'Corrected boost pressure calculation'],
        newFeatures: ['OBD compliance update', 'New aftertreatment monitoring'],
        compatibility: ['QSB6.7 Tier 4F', 'QSL9 Tier 4F'],
        checksum: 'A1B2C3D4E5F6',
        size: 4194304
      }
    ],
    calibrationFiles: [
      {
        id: 'QSB67_250HP_1800',
        name: 'QSB6.7 250HP @ 1800RPM Generator',
        engineApplication: 'Generator Prime Power',
        ratingKw: 186,
        ratingRpm: 1800,
        emissionStandard: 'EPA Tier 4 Final',
        version: '3.2.1',
        checksum: 'F1E2D3C4B5A6'
      },
      {
        id: 'QSB67_200HP_1500',
        name: 'QSB6.7 200HP @ 1500RPM Generator',
        engineApplication: 'Generator Standby',
        ratingKw: 149,
        ratingRpm: 1500,
        emissionStandard: 'EPA Tier 4 Final',
        version: '3.2.1',
        checksum: 'A6B5C4D3E2F1'
      }
    ],
    parameterList: [
      {
        spn: 190,
        name: 'Engine Speed',
        category: 'Engine',
        description: 'Actual engine speed',
        unit: 'rpm',
        dataType: 'uint16',
        resolution: 0.125,
        offset: 0,
        min: 0,
        max: 8191.875,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      },
      {
        spn: 91,
        name: 'Throttle Position',
        category: 'Engine',
        description: 'Accelerator pedal position',
        unit: '%',
        dataType: 'uint8',
        resolution: 0.4,
        offset: 0,
        min: 0,
        max: 100,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      },
      {
        spn: 100,
        name: 'Oil Pressure',
        category: 'Engine',
        description: 'Engine oil pressure',
        unit: 'kPa',
        dataType: 'uint8',
        resolution: 4,
        offset: 0,
        min: 0,
        max: 1000,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      },
      {
        spn: 110,
        name: 'Coolant Temperature',
        category: 'Engine',
        description: 'Engine coolant temperature',
        unit: 'C',
        dataType: 'uint8',
        resolution: 1,
        offset: -40,
        min: -40,
        max: 215,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      },
      {
        spn: 513,
        name: 'Actual Engine Torque',
        category: 'Engine',
        description: 'Actual engine output torque',
        unit: '%',
        dataType: 'uint8',
        resolution: 1,
        offset: -125,
        min: -125,
        max: 125,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      },
      {
        spn: 1639,
        name: 'High Idle Speed',
        category: 'Configuration',
        description: 'Maximum engine speed limit',
        unit: 'rpm',
        dataType: 'uint16',
        resolution: 0.125,
        offset: 0,
        min: 1000,
        max: 2400,
        defaultValue: 1800,
        readOnly: false,
        affectsEmissions: true,
        requiresPassword: true
      },
      {
        spn: 1640,
        name: 'Low Idle Speed',
        category: 'Configuration',
        description: 'Minimum engine speed limit',
        unit: 'rpm',
        dataType: 'uint16',
        resolution: 0.125,
        offset: 0,
        min: 500,
        max: 1000,
        defaultValue: 700,
        readOnly: false,
        affectsEmissions: true,
        requiresPassword: true
      }
    ],
    faultCodeList: [
      {
        spn: 100,
        fmi: 1,
        description: 'Engine Oil Pressure Low',
        severity: 'shutdown',
        possibleCauses: [
          'Low oil level',
          'Oil pump failure',
          'Oil pressure sensor fault',
          'Oil filter blocked',
          'Bearing wear'
        ],
        diagnosticProcedure: [
          'Check oil level on dipstick',
          'Inspect for oil leaks',
          'Verify oil pressure with mechanical gauge',
          'Check oil pump operation',
          'Inspect oil pressure sensor wiring'
        ],
        repairProcedure: [
          'Add oil to correct level if low',
          'Replace oil filter',
          'Replace oil pressure sensor if faulty',
          'Replace oil pump if damaged',
          'Repair bearings if worn'
        ]
      },
      {
        spn: 110,
        fmi: 0,
        description: 'Engine Coolant Temperature High',
        severity: 'derate',
        possibleCauses: [
          'Low coolant level',
          'Thermostat stuck closed',
          'Radiator blocked',
          'Water pump failure',
          'Fan not operating',
          'Coolant temperature sensor fault'
        ],
        diagnosticProcedure: [
          'Check coolant level',
          'Verify radiator airflow',
          'Check thermostat operation',
          'Inspect water pump belt',
          'Verify fan operation'
        ],
        repairProcedure: [
          'Add coolant if low',
          'Clean or replace radiator',
          'Replace thermostat',
          'Replace water pump',
          'Repair fan circuit'
        ]
      }
    ],
    compatibleControllers: ['DSE 7xxx', 'DSE 8xxx', 'ComAp InteliGen', 'Woodward EasyGen'],
    wiringDiagram: '/diagrams/cummins_cm2350_wiring.svg',
    serviceManual: '/manuals/cummins_cm2350_service.pdf'
  },
  {
    id: 'CAT_A5E2',
    manufacturer: 'Caterpillar',
    model: 'A5E2',
    variants: ['A5E2', 'A5E2:31'],
    engineModels: ['C7.1', 'C9', 'C9.3', 'C13', 'C15', 'C18'],
    protocols: ['J1939', 'CAT Proprietary'],
    firmwareVersions: [
      {
        version: '9.21.0',
        releaseDate: '2024-02-20',
        releaseNotes: ['Enhanced Tier 4 Final compliance', 'Improved fuel economy maps'],
        bugFixes: ['Fixed SPN 168 intermittent fault'],
        newFeatures: ['New idle shutdown timer options'],
        compatibility: ['C9.3 ACERT', 'C13 ACERT'],
        checksum: 'CAT92100',
        size: 8388608
      }
    ],
    calibrationFiles: [
      {
        id: 'C13_400HP_1800',
        name: 'C13 400HP @ 1800RPM Generator',
        engineApplication: 'Generator Prime Power',
        ratingKw: 298,
        ratingRpm: 1800,
        emissionStandard: 'EPA Tier 4 Final',
        version: '2.1.0',
        checksum: 'CAT21000'
      }
    ],
    parameterList: [
      {
        spn: 190,
        name: 'Engine Speed',
        category: 'Engine',
        description: 'Actual engine speed',
        unit: 'rpm',
        dataType: 'uint16',
        resolution: 0.125,
        offset: 0,
        min: 0,
        max: 8191.875,
        defaultValue: 0,
        readOnly: true,
        affectsEmissions: false,
        requiresPassword: false
      }
    ],
    faultCodeList: [
      {
        spn: 168,
        fmi: 1,
        description: 'Battery Voltage Low',
        severity: 'warning',
        possibleCauses: ['Battery discharged', 'Alternator failure', 'Wiring issue'],
        diagnosticProcedure: ['Check battery voltage', 'Test alternator output', 'Inspect wiring'],
        repairProcedure: ['Charge/replace battery', 'Replace alternator', 'Repair wiring']
      }
    ],
    compatibleControllers: ['EMCP 4.4', 'DSE 7xxx', 'ComAp'],
    wiringDiagram: '/diagrams/cat_a5e2_wiring.svg',
    serviceManual: '/manuals/cat_a5e2_service.pdf'
  },
  {
    id: 'VOLVO_EMS2',
    manufacturer: 'Volvo Penta',
    model: 'EMS2',
    variants: ['EMS2', 'EMS2.3'],
    engineModels: ['TAD530', 'TAD730', 'TAD940', 'TAD1340', 'TAD1640'],
    protocols: ['J1939', 'Volvo VODIA'],
    firmwareVersions: [
      {
        version: '4.15.0',
        releaseDate: '2024-01-10',
        releaseNotes: ['Stage V compliance', 'Improved SCR efficiency'],
        bugFixes: ['Fixed aftertreatment fault codes'],
        newFeatures: ['Remote diagnostics support'],
        compatibility: ['TAD series Stage V'],
        checksum: 'VOLVO415',
        size: 6291456
      }
    ],
    calibrationFiles: [
      {
        id: 'TAD1340_400HP',
        name: 'TAD1340GE 400HP Generator',
        engineApplication: 'Generator Prime Power',
        ratingKw: 298,
        ratingRpm: 1500,
        emissionStandard: 'EU Stage V',
        version: '1.3.0',
        checksum: 'VOLVO130'
      }
    ],
    parameterList: [],
    faultCodeList: [],
    compatibleControllers: ['DSE 7xxx', 'DSE 8xxx', 'ComAp InteliGen'],
    wiringDiagram: '/diagrams/volvo_ems2_wiring.svg',
    serviceManual: '/manuals/volvo_ems2_service.pdf'
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAMMING SESSION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProgrammingSession {
  id: string;
  ecmModel: string;
  ecmSerial: string;
  startTime: Date;
  status: 'initializing' | 'reading' | 'writing' | 'verifying' | 'complete' | 'error';
  progress: number;
  operation: 'firmware' | 'calibration' | 'parameters' | 'fault_clear';
  currentBlock?: number;
  totalBlocks?: number;
  errorMessage?: string;
  log: ProgrammingLogEntry[];
}

export interface ProgrammingLogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  details?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTO-DETECTION SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

export interface DetectionResult {
  detected: boolean;
  protocol: string;
  ecmType: string;
  ecmInfo?: ECMInfo;
  adapterCable?: string;
  confidence: number;
}

export async function autoDetectECM(): Promise<DetectionResult> {
  // This would communicate with the hardware adapter
  // For now, return a mock result
  return {
    detected: true,
    protocol: 'J1939',
    ecmType: 'Cummins CM2350',
    ecmInfo: {
      manufacturer: 'Cummins',
      model: 'CM2350A',
      serialNumber: 'CPL1234567',
      firmwareVersion: '6.32.0',
      hardwareVersion: 'REV-C',
      calibrationId: 'QSB67_250HP_1800',
      engineType: 'QSB6.7 250HP',
      productionDate: '2023-06-15',
      totalHours: 4523
    },
    adapterCable: 'CUMMINS_9PIN',
    confidence: 98
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY & ACCESS CONTROL
// ═══════════════════════════════════════════════════════════════════════════════

export interface SecurityLevel {
  level: number;
  name: string;
  description: string;
  capabilities: string[];
  passwordRequired: boolean;
}

export const SECURITY_LEVELS: SecurityLevel[] = [
  {
    level: 0,
    name: 'Basic Read',
    description: 'Read-only access to basic parameters and fault codes',
    capabilities: ['Read Parameters', 'Read Fault Codes', 'Read ECM Info'],
    passwordRequired: false
  },
  {
    level: 1,
    name: 'Technician',
    description: 'Standard technician access for diagnostics',
    capabilities: ['Level 0', 'Clear Fault Codes', 'Reset Adaptations', 'Read Calibration'],
    passwordRequired: true
  },
  {
    level: 2,
    name: 'Advanced',
    description: 'Advanced access for parameter adjustment',
    capabilities: ['Level 1', 'Write Parameters', 'Adjust Limits', 'Forced Regeneration'],
    passwordRequired: true
  },
  {
    level: 3,
    name: 'Master',
    description: 'Full access including firmware and calibration',
    capabilities: ['Level 2', 'Firmware Upload', 'Calibration Upload', 'ECM Reset'],
    passwordRequired: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getECMByModel(model: string): ECMDatabase | undefined {
  return ECM_DATABASE.find(ecm =>
    ecm.model.toLowerCase() === model.toLowerCase() ||
    ecm.variants.some(v => v.toLowerCase() === model.toLowerCase())
  );
}

export function getECMByManufacturer(manufacturer: string): ECMDatabase[] {
  return ECM_DATABASE.filter(ecm =>
    ecm.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
}

export function getAdapterCableForECM(ecmManufacturer: string): AdapterCable | undefined {
  return ADAPTER_CABLES.find(cable =>
    cable.oem.toLowerCase() === ecmManufacturer.toLowerCase()
  );
}

export function getAllSupportedManufacturers(): string[] {
  return [...new Set(ECM_DATABASE.map(ecm => ecm.manufacturer))];
}

export function getAllSupportedProtocols(): string[] {
  return [...new Set(ECM_DATABASE.flatMap(ecm => ecm.protocols))];
}

export function calculateChecksum(data: ArrayBuffer): string {
  // Simple checksum for demonstration
  const view = new Uint8Array(data);
  let sum = 0;
  for (let i = 0; i < view.length; i++) {
    sum = (sum + view[i]) & 0xFFFFFFFF;
  }
  return sum.toString(16).toUpperCase().padStart(8, '0');
}

export function validateFirmwarePackage(pkg: FirmwarePackage): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!pkg.ecmModel) errors.push('ECM model is required');
  if (!pkg.version) errors.push('Firmware version is required');
  if (!pkg.checksum) errors.push('Checksum is required');
  if (!pkg.data || pkg.data.byteLength === 0) errors.push('Firmware data is empty');

  // Verify checksum
  if (pkg.data) {
    const calculatedChecksum = calculateChecksum(pkg.data);
    if (calculatedChecksum !== pkg.checksum) {
      errors.push(`Checksum mismatch: expected ${pkg.checksum}, got ${calculatedChecksum}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
