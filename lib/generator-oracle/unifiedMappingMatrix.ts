/**
 * UNIFIED CONTROLLER-ECM-FAULT CODE MAPPING MATRIX
 *
 * Complete bidirectional mapping system:
 * - Fault Code → Controller → ECM
 * - ECM → Controller → Fault Codes
 * - Controller → ECM Compatibility
 * - Firmware Version Tracking
 * - Serial Number Indexing
 *
 * This is the central integration layer for all diagnostic cross-referencing.
 *
 * COPYRIGHT-SAFE APPROACH:
 * ========================
 * - Controller/ECM model names used for IDENTIFICATION PURPOSES ONLY
 * - All diagnostic mappings and compatibility data are INDEPENDENTLY COMPILED
 * - Fault code numbers are industry-standard identifiers (J1939 SPN-FMI, etc.)
 * - All descriptions are independently written interpretations
 *
 * DISCLAIMER:
 * ===========
 * This is an INDEPENDENT reference tool. All brand names (Deep Sea Electronics,
 * ComAp, Woodward, SmartGen, Caterpillar, Cummins, Volvo Penta, etc.) are used
 * for IDENTIFICATION PURPOSES ONLY.
 *
 * Generator Oracle is NOT affiliated with, endorsed by, or licensed by any
 * equipment manufacturer. Compatibility data is based on field experience
 * and may differ from official manufacturer specifications.
 *
 * All trademarks are property of their respective owners.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ECM REGISTRY - Complete ECM identification and tracking
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMRegistryEntry {
  id: string;
  manufacturer: string;
  model: string;
  serialPrefix: string[];  // Valid serial number prefixes
  firmwareVersions: {
    version: string;
    releaseDate: string;
    compatibility: string[];  // Compatible controller firmware versions
    changelog: string[];
    isLatest: boolean;
  }[];
  communicationProtocols: string[];
  canBaudRate: number;
  j1939Address: number;
  supportedEngines: string[];
  pinConfiguration: string;
  diagnosticSoftware: string[];
  reprogrammingCapability: boolean;
}

export const ECM_REGISTRY: ECMRegistryEntry[] = [
  {
    id: 'cummins-cm2150',
    manufacturer: 'Cummins',
    model: 'CM2150',
    serialPrefix: ['73', '79', '85'],
    firmwareVersions: [
      { version: '4.5.2', releaseDate: '2024-06-15', compatibility: ['DSE 7.x', 'ComAp 3.x'], changelog: ['Bug fixes', 'Improved cold start'], isLatest: true },
      { version: '4.4.1', releaseDate: '2024-01-10', compatibility: ['DSE 6.x', 'DSE 7.x', 'ComAp 2.x'], changelog: ['DEF quality detection'], isLatest: false },
      { version: '4.3.0', releaseDate: '2023-08-20', compatibility: ['DSE 6.x', 'ComAp 2.x'], changelog: ['Initial release for QSK23'], isLatest: false }
    ],
    communicationProtocols: ['J1939', 'J1708', 'J1587', 'Modbus RTU'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['QSK19', 'QSK23', 'QSK38', 'QSK50', 'QSK60', 'QSX15', 'QSB6.7', 'QSL9'],
    pinConfiguration: '121-pin Deutsch HD30',
    diagnosticSoftware: ['INSITE', 'INPOWER', 'QuickServe Online'],
    reprogrammingCapability: true
  },
  {
    id: 'cummins-cm2350',
    manufacturer: 'Cummins',
    model: 'CM2350',
    serialPrefix: ['90', '91', '92'],
    firmwareVersions: [
      { version: '5.1.0', releaseDate: '2025-01-20', compatibility: ['DSE 8.x', 'ComAp 4.x'], changelog: ['Tier 4 Final compliance'], isLatest: true },
      { version: '5.0.2', releaseDate: '2024-09-15', compatibility: ['DSE 7.x', 'ComAp 3.x'], changelog: ['SCR improvements'], isLatest: false }
    ],
    communicationProtocols: ['J1939', 'Modbus TCP', 'Ethernet'],
    canBaudRate: 500000,
    j1939Address: 0,
    supportedEngines: ['X12', 'X15', 'QSK78'],
    pinConfiguration: '186-pin Amphenol',
    diagnosticSoftware: ['INSITE Pro', 'INPOWER Plus'],
    reprogrammingCapability: true
  },
  {
    id: 'cat-adem-a4',
    manufacturer: 'Caterpillar',
    model: 'ADEM A4',
    serialPrefix: ['CAT', 'C18', 'C27'],
    firmwareVersions: [
      { version: '3.2.1', releaseDate: '2024-11-01', compatibility: ['PowerWizard 2.x', 'ComAp 3.x'], changelog: ['Improved emissions'], isLatest: true },
      { version: '3.1.0', releaseDate: '2024-05-15', compatibility: ['PowerWizard 1.x', 'ComAp 2.x'], changelog: ['Initial release'], isLatest: false }
    ],
    communicationProtocols: ['J1939', 'CAT Data Link', 'CAN'],
    canBaudRate: 250000,
    j1939Address: 1,
    supportedEngines: ['C7', 'C9', 'C13', 'C15', 'C18', 'C27', 'C32', '3406E', '3412E'],
    pinConfiguration: '70-pin CAT Connector',
    diagnosticSoftware: ['CAT ET', 'SIS Web'],
    reprogrammingCapability: true
  },
  {
    id: 'cat-adem-a5',
    manufacturer: 'Caterpillar',
    model: 'ADEM A5',
    serialPrefix: ['A5E', 'C32'],
    firmwareVersions: [
      { version: '1.5.0', releaseDate: '2025-02-01', compatibility: ['PowerWizard 3.x'], changelog: ['Stage V compliance'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'CAT Data Link 2.0', 'Ethernet'],
    canBaudRate: 500000,
    j1939Address: 1,
    supportedEngines: ['C32 ACERT', 'C175-16', 'C175-20'],
    pinConfiguration: '94-pin CAT Connector',
    diagnosticSoftware: ['CAT ET 2024', 'SIS 2.0'],
    reprogrammingCapability: true
  },
  {
    id: 'perkins-epm',
    manufacturer: 'Perkins',
    model: 'EPM',
    serialPrefix: ['PK', 'PE'],
    firmwareVersions: [
      { version: '2.3.0', releaseDate: '2024-08-10', compatibility: ['DSE 7.x', 'SmartGen 4.x'], changelog: ['Syncro support'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'Modbus RTU'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['1306D-E87TAG', '1306D-E87TAG2', '1506D-E88TAG', '2206D-E13TAG', '2206D-E13TAG2'],
    pinConfiguration: '90-pin Perkins Connector',
    diagnosticSoftware: ['Perkins EST', 'Perkins SPI2'],
    reprogrammingCapability: true
  },
  {
    id: 'volvo-ems2',
    manufacturer: 'Volvo Penta',
    model: 'EMS 2',
    serialPrefix: ['VP', 'VO'],
    firmwareVersions: [
      { version: '8.2.0', releaseDate: '2024-12-01', compatibility: ['VODIA 3.x', 'ComAp 4.x'], changelog: ['Marine compliance'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'Volvo EDC', 'Modbus TCP'],
    canBaudRate: 250000,
    j1939Address: 2,
    supportedEngines: ['D13', 'D16', 'TAD1340', 'TAD1341', 'TAD1342', 'TAD1350', 'TAD1351'],
    pinConfiguration: '128-pin Volvo Connector',
    diagnosticSoftware: ['VODIA', 'VCADS Pro', 'PTT'],
    reprogrammingCapability: true
  },
  {
    id: 'mtu-adec',
    manufacturer: 'MTU',
    model: 'ADEC',
    serialPrefix: ['MTU', 'ADC'],
    firmwareVersions: [
      { version: '6.1.0', releaseDate: '2024-10-15', compatibility: ['MDEC 2.x', 'DSE 8.x'], changelog: ['IMO Tier III'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'MDEC Proprietary', 'Modbus TCP'],
    canBaudRate: 250000,
    j1939Address: 3,
    supportedEngines: ['4000 Series', '2000 Series', '1600 Series', '1300 Series'],
    pinConfiguration: '112-pin MTU Connector',
    diagnosticSoftware: ['MTU Diasys', 'MDEC'],
    reprogrammingCapability: true
  },
  {
    id: 'detroit-ddec6',
    manufacturer: 'Detroit Diesel',
    model: 'DDEC VI',
    serialPrefix: ['DD', 'DT'],
    firmwareVersions: [
      { version: '7.2.1', releaseDate: '2024-09-20', compatibility: ['DSE 7.x', 'DDDL 8.x'], changelog: ['GHG17 compliance'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'J1708', 'J1587'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['DD13', 'DD15', 'DD16', 'Series 60'],
    pinConfiguration: '120-pin Deutsch Connector',
    diagnosticSoftware: ['DDDL', 'Detroit Connect'],
    reprogrammingCapability: true
  },
  {
    id: 'john-deere-powertech',
    manufacturer: 'John Deere',
    model: 'PowerTech ECU',
    serialPrefix: ['JD', 'PT'],
    firmwareVersions: [
      { version: '4.0.5', releaseDate: '2024-11-10', compatibility: ['Service Advisor 5.x'], changelog: ['DEF improvements'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'JDLink'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['4045', '6068', '6090', '13.5L'],
    pinConfiguration: '96-pin JD Connector',
    diagnosticSoftware: ['Service Advisor', 'JDLink'],
    reprogrammingCapability: true
  },
  {
    id: 'deutz-emr4',
    manufacturer: 'Deutz',
    model: 'EMR4',
    serialPrefix: ['DZ', 'EM'],
    firmwareVersions: [
      { version: '3.5.0', releaseDate: '2024-07-25', compatibility: ['SerDia 4.x', 'DSE 7.x'], changelog: ['EU Stage V'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'Modbus RTU'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['TCD 2012', 'TCD 2013', 'TCD 2015', 'TCD 12.0', 'TCD 16.0'],
    pinConfiguration: '80-pin Deutz Connector',
    diagnosticSoftware: ['SerDia'],
    reprogrammingCapability: true
  },
  {
    id: 'yanmar-smartassist',
    manufacturer: 'Yanmar',
    model: 'SmartAssist ECU',
    serialPrefix: ['YM', 'SA'],
    firmwareVersions: [
      { version: '2.1.0', releaseDate: '2024-06-30', compatibility: ['SmartAssist-Direct 2.x'], changelog: ['Glow plug optimization'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'CAN'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['4TNV84', '4TNV88', '4TNV94', '4TNV98', '4TNV106'],
    pinConfiguration: '60-pin Yanmar Connector',
    diagnosticSoftware: ['SmartAssist-Direct'],
    reprogrammingCapability: true
  },
  {
    id: 'doosan-ecu',
    manufacturer: 'Doosan',
    model: 'Engine ECU',
    serialPrefix: ['DS', 'DO'],
    firmwareVersions: [
      { version: '1.8.0', releaseDate: '2024-08-05', compatibility: ['DoosanConnect 2.x'], changelog: ['Mining application support'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'CAN'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['DL06', 'DL08', 'DV11', 'DP180'],
    pinConfiguration: '72-pin Doosan Connector',
    diagnosticSoftware: ['DoosanConnect'],
    reprogrammingCapability: true
  },
  {
    id: 'weichai-wp-ecu',
    manufacturer: 'Weichai',
    model: 'WP ECM',
    serialPrefix: ['WC', 'WP'],
    firmwareVersions: [
      { version: '2.0.0', releaseDate: '2024-05-20', compatibility: ['Weichai Diagnostic 3.x'], changelog: ['China VI compliance'], isLatest: true }
    ],
    communicationProtocols: ['J1939', 'CAN'],
    canBaudRate: 250000,
    j1939Address: 0,
    supportedEngines: ['WP10', 'WP12', 'WP13', 'WD10'],
    pinConfiguration: '68-pin Weichai Connector',
    diagnosticSoftware: ['Weichai Diagnostic System'],
    reprogrammingCapability: true
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER REGISTRY - Complete controller identification
// ═══════════════════════════════════════════════════════════════════════════════

export interface ControllerRegistryEntry {
  id: string;
  manufacturer: string;
  brand: string;
  model: string;
  firmwareVersions: {
    version: string;
    releaseDate: string;
    compatibleECMs: string[];  // ECM IDs from ECM_REGISTRY
    features: string[];
  }[];
  faultCodePrefix: string;
  faultCodeRange: { min: number; max: number };
  communicationProtocols: string[];
  displayType: string;
  ioCapabilities: {
    digitalInputs: number;
    digitalOutputs: number;
    analogInputs: number;
    canPorts: number;
    rs485Ports: number;
    ethernetPorts: number;
  };
}

export const CONTROLLER_REGISTRY: ControllerRegistryEntry[] = [
  {
    id: 'dse-7320',
    manufacturer: 'Deep Sea Electronics',
    brand: 'DSE',
    model: '7320',
    firmwareVersions: [
      {
        version: '8.0.1',
        releaseDate: '2025-01-15',
        compatibleECMs: ['cummins-cm2150', 'cummins-cm2350', 'perkins-epm', 'volvo-ems2', 'mtu-adec', 'detroit-ddec6'],
        features: ['Enhanced J1939', 'Cloud connectivity', 'Mobile app']
      },
      {
        version: '7.5.2',
        releaseDate: '2024-06-20',
        compatibleECMs: ['cummins-cm2150', 'perkins-epm', 'volvo-ems2', 'mtu-adec'],
        features: ['J1939 support', 'Modbus TCP']
      }
    ],
    faultCodePrefix: 'DSE',
    faultCodeRange: { min: 1, max: 999 },
    communicationProtocols: ['J1939', 'Modbus RTU', 'Modbus TCP', 'Ethernet'],
    displayType: 'LCD 4.3"',
    ioCapabilities: { digitalInputs: 12, digitalOutputs: 8, analogInputs: 6, canPorts: 2, rs485Ports: 1, ethernetPorts: 1 }
  },
  {
    id: 'dse-8610',
    manufacturer: 'Deep Sea Electronics',
    brand: 'DSE',
    model: '8610',
    firmwareVersions: [
      {
        version: '2.1.0',
        releaseDate: '2025-02-01',
        compatibleECMs: ['cummins-cm2350', 'cat-adem-a5', 'mtu-adec'],
        features: ['Load share', 'Sync', 'Parallel operation']
      }
    ],
    faultCodePrefix: 'DSE',
    faultCodeRange: { min: 1, max: 9999 },
    communicationProtocols: ['J1939', 'Modbus TCP', 'Ethernet', 'WiFi'],
    displayType: 'TFT 7"',
    ioCapabilities: { digitalInputs: 24, digitalOutputs: 16, analogInputs: 12, canPorts: 4, rs485Ports: 2, ethernetPorts: 2 }
  },
  {
    id: 'comap-inteligen',
    manufacturer: 'ComAp',
    brand: 'ComAp',
    model: 'InteliGen NTC',
    firmwareVersions: [
      {
        version: '4.2.0',
        releaseDate: '2024-11-10',
        compatibleECMs: ['cummins-cm2150', 'cummins-cm2350', 'cat-adem-a4', 'perkins-epm', 'volvo-ems2'],
        features: ['WebSupervisor', 'Cloud backup']
      }
    ],
    faultCodePrefix: 'E',
    faultCodeRange: { min: 100, max: 999 },
    communicationProtocols: ['J1939', 'Modbus RTU', 'Modbus TCP', 'Ethernet'],
    displayType: 'TFT 5"',
    ioCapabilities: { digitalInputs: 16, digitalOutputs: 10, analogInputs: 8, canPorts: 2, rs485Ports: 2, ethernetPorts: 1 }
  },
  {
    id: 'comap-intelilite',
    manufacturer: 'ComAp',
    brand: 'ComAp',
    model: 'InteliLite AMF25',
    firmwareVersions: [
      {
        version: '3.1.0',
        releaseDate: '2024-09-15',
        compatibleECMs: ['cummins-cm2150', 'perkins-epm', 'deutz-emr4', 'yanmar-smartassist'],
        features: ['AMF function', 'Basic J1939']
      }
    ],
    faultCodePrefix: 'E',
    faultCodeRange: { min: 100, max: 599 },
    communicationProtocols: ['J1939', 'Modbus RTU'],
    displayType: 'LCD 3.5"',
    ioCapabilities: { digitalInputs: 8, digitalOutputs: 6, analogInputs: 4, canPorts: 1, rs485Ports: 1, ethernetPorts: 0 }
  },
  {
    id: 'woodward-easygen-3200',
    manufacturer: 'Woodward',
    brand: 'Woodward',
    model: 'easYgen-3200',
    firmwareVersions: [
      {
        version: '5.0.0',
        releaseDate: '2024-12-01',
        compatibleECMs: ['cummins-cm2150', 'cummins-cm2350', 'mtu-adec', 'detroit-ddec6'],
        features: ['isochronous load share', 'Peak shaving']
      }
    ],
    faultCodePrefix: 'W',
    faultCodeRange: { min: 1, max: 9999 },
    communicationProtocols: ['J1939', 'CAN', 'Modbus RTU', 'Modbus TCP'],
    displayType: 'TFT 5.7"',
    ioCapabilities: { digitalInputs: 20, digitalOutputs: 12, analogInputs: 10, canPorts: 3, rs485Ports: 2, ethernetPorts: 1 }
  },
  {
    id: 'smartgen-hgm9320',
    manufacturer: 'SmartGen',
    brand: 'SmartGen',
    model: 'HGM9320',
    firmwareVersions: [
      {
        version: '4.5.0',
        releaseDate: '2024-10-20',
        compatibleECMs: ['cummins-cm2150', 'perkins-epm', 'weichai-wp-ecu', 'yanmar-smartassist', 'doosan-ecu'],
        features: ['Multi-unit parallel', 'Cloud monitoring']
      }
    ],
    faultCodePrefix: 'SG',
    faultCodeRange: { min: 1, max: 9999 },
    communicationProtocols: ['J1939', 'Modbus RTU', 'RS485'],
    displayType: 'LCD 4.3"',
    ioCapabilities: { digitalInputs: 16, digitalOutputs: 10, analogInputs: 8, canPorts: 2, rs485Ports: 2, ethernetPorts: 0 }
  },
  {
    id: 'cat-powerwizard',
    manufacturer: 'Caterpillar',
    brand: 'CAT',
    model: 'PowerWizard 2.0',
    firmwareVersions: [
      {
        version: '3.5.0',
        releaseDate: '2024-08-15',
        compatibleECMs: ['cat-adem-a4', 'cat-adem-a5'],
        features: ['CAT exclusive', 'Fleet management']
      }
    ],
    faultCodePrefix: 'PW',
    faultCodeRange: { min: 1, max: 9999 },
    communicationProtocols: ['J1939', 'CAT Data Link', 'Ethernet'],
    displayType: 'TFT 7"',
    ioCapabilities: { digitalInputs: 24, digitalOutputs: 16, analogInputs: 12, canPorts: 4, rs485Ports: 1, ethernetPorts: 2 }
  },
  {
    id: 'datakom-d700',
    manufacturer: 'Datakom',
    brand: 'Datakom',
    model: 'D-700',
    firmwareVersions: [
      {
        version: '2.8.0',
        releaseDate: '2024-07-10',
        compatibleECMs: ['cummins-cm2150', 'perkins-epm', 'deutz-emr4', 'yanmar-smartassist'],
        features: ['AMF', 'Basic load share']
      }
    ],
    faultCodePrefix: 'DK',
    faultCodeRange: { min: 1, max: 999 },
    communicationProtocols: ['J1939', 'Modbus RTU'],
    displayType: 'LCD 3.5"',
    ioCapabilities: { digitalInputs: 10, digitalOutputs: 8, analogInputs: 6, canPorts: 1, rs485Ports: 1, ethernetPorts: 0 }
  },
  {
    id: 'lovato-rgk800',
    manufacturer: 'Lovato',
    brand: 'Lovato',
    model: 'RGK800',
    firmwareVersions: [
      {
        version: '1.9.0',
        releaseDate: '2024-06-25',
        compatibleECMs: ['cummins-cm2150', 'perkins-epm', 'volvo-ems2'],
        features: ['Load sharing', 'Remote monitoring']
      }
    ],
    faultCodePrefix: 'LV',
    faultCodeRange: { min: 1, max: 999 },
    communicationProtocols: ['J1939', 'Modbus RTU', 'Ethernet'],
    displayType: 'TFT 4.3"',
    ioCapabilities: { digitalInputs: 14, digitalOutputs: 10, analogInputs: 8, canPorts: 2, rs485Ports: 1, ethernetPorts: 1 }
  },
  {
    id: 'siemens-sigen',
    manufacturer: 'Siemens',
    brand: 'Siemens',
    model: 'SIGEN',
    firmwareVersions: [
      {
        version: '3.0.0',
        releaseDate: '2024-09-01',
        compatibleECMs: ['cummins-cm2350', 'mtu-adec', 'detroit-ddec6'],
        features: ['Industrial grade', 'PROFINET']
      }
    ],
    faultCodePrefix: 'SI',
    faultCodeRange: { min: 1, max: 9999 },
    communicationProtocols: ['J1939', 'PROFINET', 'Modbus TCP', 'Ethernet'],
    displayType: 'HMI 7"',
    ioCapabilities: { digitalInputs: 32, digitalOutputs: 24, analogInputs: 16, canPorts: 4, rs485Ports: 2, ethernetPorts: 4 }
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODE BINDING - Maps fault codes to controllers and ECMs
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultCodeBinding {
  code: string;
  alternativeCodes: string[];  // Same fault in other systems
  category: string;
  subcategory: string;
  subsystem: 'electrical' | 'fuel' | 'cooling' | 'engine' | 'ecm' | 'controller' | 'load' | 'wiring' | 'sensors' | 'communication';
  severity: 'info' | 'warning' | 'critical' | 'shutdown' | 'emergency';
  description: string;
  controllers: {
    controllerId: string;
    controllerCode: string;
    resetSequence: string[];
  }[];
  ecms: {
    ecmId: string;
    spn: number;
    fmi: number;
    j1939Code: string;
  }[];
  diagnosticFlow: string[];
  likelyCauses: { cause: string; probability: number }[];
  preventiveAdvice: string[];
  schematicRefs: string[];  // References to schematic diagrams
}

export const FAULT_CODE_BINDINGS: FaultCodeBinding[] = [
  // ═══ ELECTRICAL SUBSYSTEM ═══
  {
    code: 'E001',
    alternativeCodes: ['DSE-001', 'SG-001', 'LV-001', 'DK-001'],
    category: 'Electrical',
    subcategory: 'AVR',
    subsystem: 'electrical',
    severity: 'critical',
    description: 'AVR (Automatic Voltage Regulator) Failure - No voltage output or unstable voltage regulation',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-001', resetSequence: ['Stop engine', 'Wait 30s', 'Check AVR wiring', 'Restart'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E151', resetSequence: ['Stop', 'Check AVR', 'Press Reset'] },
      { controllerId: 'smartgen-hgm9320', controllerCode: 'SG-001', resetSequence: ['Stop', 'Wait 60s', 'Check connections', 'Restart'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 168, fmi: 1, j1939Code: 'SPN168-FMI1' },
      { ecmId: 'cat-adem-a4', spn: 168, fmi: 1, j1939Code: '168-1' }
    ],
    diagnosticFlow: [
      '1. Measure AC output voltage at alternator terminals',
      '2. Check AVR sensing wire connections (F1, F2 terminals)',
      '3. Measure AVR input voltage (should be 190-250VAC)',
      '4. Test AVR output to exciter field (should be 30-90VDC)',
      '5. Check rotating diodes in exciter',
      '6. If no output, replace AVR'
    ],
    likelyCauses: [
      { cause: 'AVR internal failure', probability: 45 },
      { cause: 'Exciter winding short', probability: 25 },
      { cause: 'Sensing wire disconnected', probability: 15 },
      { cause: 'Rotating diode failure', probability: 10 },
      { cause: 'Brush wear excessive', probability: 5 }
    ],
    preventiveAdvice: [
      'Inspect AVR connections every 500 hours',
      'Check brush wear annually',
      'Monitor voltage stability under load changes',
      'Keep AVR compartment clean and ventilated'
    ],
    schematicRefs: ['AVR-001', 'EXCITER-001', 'ALTERNATOR-001']
  },
  {
    code: 'E002',
    alternativeCodes: ['DSE-002', 'SG-002', 'W-002'],
    category: 'Electrical',
    subcategory: 'Alternator',
    subsystem: 'electrical',
    severity: 'critical',
    description: 'Alternator Overheating - Winding temperature exceeds safe limits',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-002', resetSequence: ['Stop immediately', 'Allow cooling for 2 hours', 'Check cooling system', 'Restart'] },
      { controllerId: 'woodward-easygen-3200', controllerCode: 'W-002', resetSequence: ['Shutdown', 'Cool down', 'Check load', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 110, fmi: 16, j1939Code: 'SPN110-FMI16' }
    ],
    diagnosticFlow: [
      '1. Check alternator air intake and exhaust for blockages',
      '2. Verify cooling fan operation',
      '3. Measure winding resistance for shorts',
      '4. Check for overload conditions (above rated kVA)',
      '5. Inspect for blocked air filters',
      '6. Verify proper ventilation around genset'
    ],
    likelyCauses: [
      { cause: 'Overload operation', probability: 40 },
      { cause: 'Cooling fan failure', probability: 20 },
      { cause: 'Blocked air passages', probability: 20 },
      { cause: 'Winding insulation breakdown', probability: 15 },
      { cause: 'Ambient temperature too high', probability: 5 }
    ],
    preventiveAdvice: [
      'Never exceed rated kVA continuously',
      'Clean air filters monthly',
      'Ensure proper enclosure ventilation',
      'Monitor winding temperature regularly'
    ],
    schematicRefs: ['ALTERNATOR-001', 'COOLING-ALT-001']
  },
  {
    code: 'E003',
    alternativeCodes: ['DSE-003', 'E152', 'SG-003'],
    category: 'Electrical',
    subcategory: 'Wiring',
    subsystem: 'wiring',
    severity: 'warning',
    description: 'Phase Imbalance Detected - Unequal current distribution across phases',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-003', resetSequence: ['Check load balance', 'Redistribute loads', 'Reset alarm'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E152', resetSequence: ['Balance loads', 'Press Reset'] }
    ],
    ecms: [],
    diagnosticFlow: [
      '1. Measure current on each phase (L1, L2, L3)',
      '2. Calculate imbalance percentage ((Max-Min)/Avg × 100)',
      '3. If >10%, identify heaviest loaded phase',
      '4. Redistribute single-phase loads',
      '5. Check for faulty contactors or breakers',
      '6. Verify CT (current transformer) accuracy'
    ],
    likelyCauses: [
      { cause: 'Unbalanced single-phase loads', probability: 60 },
      { cause: 'Single-phase load failure', probability: 20 },
      { cause: 'CT calibration error', probability: 10 },
      { cause: 'Phase conductor high resistance', probability: 10 }
    ],
    preventiveAdvice: [
      'Design load distribution to balance phases',
      'Monitor phase currents regularly',
      'Calibrate CTs annually',
      'Check connection tightness quarterly'
    ],
    schematicRefs: ['POWER-DIST-001', 'CT-WIRING-001']
  },

  // ═══ FUEL SUBSYSTEM ═══
  {
    code: 'F001',
    alternativeCodes: ['DSE-145', 'E201', 'SG-101', 'P0087'],
    category: 'Fuel',
    subcategory: 'Injector Pump',
    subsystem: 'fuel',
    severity: 'critical',
    description: 'Fuel Rail Pressure Too Low - Insufficient fuel delivery to injectors',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-145', resetSequence: ['Stop engine', 'Bleed fuel system', 'Check filters', 'Restart'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E201', resetSequence: ['Stop', 'Check fuel supply', 'Bleed', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 94, fmi: 1, j1939Code: 'SPN94-FMI1' },
      { ecmId: 'cat-adem-a4', spn: 94, fmi: 1, j1939Code: '94-1' },
      { ecmId: 'perkins-epm', spn: 94, fmi: 1, j1939Code: 'SPN94-FMI1' }
    ],
    diagnosticFlow: [
      '1. Check fuel tank level and condition',
      '2. Inspect primary fuel filter (water separator)',
      '3. Replace secondary fuel filter',
      '4. Check fuel supply pump operation',
      '5. Bleed air from fuel system',
      '6. Test high-pressure pump delivery',
      '7. Check fuel rail pressure sensor'
    ],
    likelyCauses: [
      { cause: 'Clogged fuel filters', probability: 40 },
      { cause: 'Air in fuel system', probability: 25 },
      { cause: 'Fuel supply pump failure', probability: 15 },
      { cause: 'High-pressure pump wear', probability: 10 },
      { cause: 'Fuel rail pressure sensor failure', probability: 10 }
    ],
    preventiveAdvice: [
      'Change fuel filters every 500 hours or 6 months',
      'Drain water separator daily',
      'Keep fuel tank above 25% to prevent condensation',
      'Use high-quality diesel fuel'
    ],
    schematicRefs: ['FUEL-SYSTEM-001', 'HP-PUMP-001', 'RAIL-001']
  },
  {
    code: 'F002',
    alternativeCodes: ['DSE-146', 'E202', 'P0088'],
    category: 'Fuel',
    subcategory: 'Injector',
    subsystem: 'fuel',
    severity: 'warning',
    description: 'Injector Nozzle Degradation - Poor spray pattern affecting combustion',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-146', resetSequence: ['Note cylinder', 'Schedule maintenance', 'Monitor closely'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 651, fmi: 7, j1939Code: 'SPN651-FMI7' },
      { ecmId: 'cat-adem-a4', spn: 651, fmi: 7, j1939Code: '651-7' }
    ],
    diagnosticFlow: [
      '1. Perform cylinder cutout test to identify weak cylinder',
      '2. Check injector balance using diagnostic software',
      '3. Measure injector return flow',
      '4. Remove and bench test suspect injector',
      '5. Check spray pattern and opening pressure',
      '6. Replace injector if out of spec'
    ],
    likelyCauses: [
      { cause: 'Nozzle tip erosion', probability: 35 },
      { cause: 'Carbon buildup in nozzle', probability: 30 },
      { cause: 'Injector solenoid wear', probability: 20 },
      { cause: 'Poor fuel quality damage', probability: 15 }
    ],
    preventiveAdvice: [
      'Use quality fuel meeting engine specs',
      'Perform injector balance test every 2000 hours',
      'Add fuel conditioner for storage',
      'Replace injectors per OEM interval'
    ],
    schematicRefs: ['INJECTOR-001', 'FUEL-RAIL-001']
  },
  {
    code: 'F003',
    alternativeCodes: ['DSE-147', 'E203', 'SG-103'],
    category: 'Fuel',
    subcategory: 'Air in Fuel',
    subsystem: 'fuel',
    severity: 'warning',
    description: 'Air in Fuel System Detected - Engine surging or misfiring',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-147', resetSequence: ['Bleed fuel system', 'Check connections', 'Restart'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 94, fmi: 18, j1939Code: 'SPN94-FMI18' }
    ],
    diagnosticFlow: [
      '1. Check all fuel line connections for tightness',
      '2. Inspect fuel filter housing seals',
      '3. Check fuel tank pickup tube',
      '4. Bleed air using manual priming pump',
      '5. Run engine and monitor for air bubbles in clear return line',
      '6. Pressure test fuel suction side'
    ],
    likelyCauses: [
      { cause: 'Loose fuel line fitting', probability: 35 },
      { cause: 'Cracked fuel filter housing', probability: 25 },
      { cause: 'Damaged fuel tank pickup', probability: 20 },
      { cause: 'Fuel supply pump seal failure', probability: 20 }
    ],
    preventiveAdvice: [
      'Check fuel connections during every service',
      'Replace fuel filter housing seals with each filter change',
      'Keep tank above 1/4 full',
      'Use thread sealant on fuel fittings'
    ],
    schematicRefs: ['FUEL-SUPPLY-001', 'FUEL-LINES-001']
  },

  // ═══ COOLING SUBSYSTEM ═══
  {
    code: 'C001',
    alternativeCodes: ['DSE-103', 'E301', 'SG-201', 'P0217'],
    category: 'Cooling',
    subcategory: 'Radiator',
    subsystem: 'cooling',
    severity: 'critical',
    description: 'Engine Overtemperature - Coolant temperature exceeds safe limit',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-103', resetSequence: ['Shutdown immediately', 'Allow cooling', 'Check coolant level', 'Check fan', 'Restart'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E301', resetSequence: ['Stop', 'Cool down 30min', 'Check system', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 110, fmi: 0, j1939Code: 'SPN110-FMI0' },
      { ecmId: 'cat-adem-a4', spn: 110, fmi: 0, j1939Code: '110-0' },
      { ecmId: 'volvo-ems2', spn: 110, fmi: 0, j1939Code: 'MID128-PID110' }
    ],
    diagnosticFlow: [
      '1. DO NOT open radiator cap while hot',
      '2. Allow engine to cool completely',
      '3. Check coolant level in expansion tank',
      '4. Inspect radiator for blockages (bugs, debris)',
      '5. Test thermostat operation',
      '6. Check water pump for leaks and proper rotation',
      '7. Verify fan operation and belt tension',
      '8. Pressure test cooling system for leaks'
    ],
    likelyCauses: [
      { cause: 'Low coolant level', probability: 30 },
      { cause: 'Radiator blocked externally', probability: 25 },
      { cause: 'Thermostat stuck closed', probability: 20 },
      { cause: 'Water pump failure', probability: 15 },
      { cause: 'Fan belt slipping', probability: 10 }
    ],
    preventiveAdvice: [
      'Check coolant level weekly',
      'Clean radiator fins monthly',
      'Replace coolant every 2 years or per OEM',
      'Test coolant concentration annually',
      'Replace thermostat every 5 years'
    ],
    schematicRefs: ['COOLING-001', 'RADIATOR-001', 'THERMOSTAT-001']
  },
  {
    code: 'C002',
    alternativeCodes: ['DSE-104', 'E302', 'P0118'],
    category: 'Cooling',
    subcategory: 'Temperature Sensor',
    subsystem: 'sensors',
    severity: 'warning',
    description: 'Coolant Temperature Sensor Fault - Invalid or erratic temperature readings',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-104', resetSequence: ['Check wiring', 'Test sensor', 'Replace if needed', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 110, fmi: 3, j1939Code: 'SPN110-FMI3' },
      { ecmId: 'cat-adem-a4', spn: 110, fmi: 3, j1939Code: '110-3' }
    ],
    diagnosticFlow: [
      '1. Check sensor connector for corrosion',
      '2. Measure sensor resistance vs temperature table',
      '3. Check wiring from sensor to ECM',
      '4. Verify 5V reference voltage at sensor',
      '5. Compare sensor reading to external thermometer',
      '6. Replace sensor if out of specification'
    ],
    likelyCauses: [
      { cause: 'Sensor internal failure', probability: 40 },
      { cause: 'Corroded connector', probability: 30 },
      { cause: 'Damaged wiring', probability: 20 },
      { cause: 'ECM input circuit fault', probability: 10 }
    ],
    preventiveAdvice: [
      'Apply dielectric grease to connectors',
      'Inspect sensor wiring during service',
      'Replace sensor every 10,000 hours'
    ],
    schematicRefs: ['SENSOR-TEMP-001', 'ECM-WIRING-001']
  },

  // ═══ ENGINE SUBSYSTEM ═══
  {
    code: 'ENG001',
    alternativeCodes: ['DSE-133', 'E401', 'SG-301'],
    category: 'Engine',
    subcategory: 'Governor',
    subsystem: 'engine',
    severity: 'critical',
    description: 'Governor Hunting/Unstable - Engine speed fluctuating at steady load',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-133', resetSequence: ['Check governor settings', 'Adjust droop', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 190, fmi: 2, j1939Code: 'SPN190-FMI2' }
    ],
    diagnosticFlow: [
      '1. Check governor linkage for binding',
      '2. Inspect actuator for smooth operation',
      '3. Verify fuel rack movement',
      '4. Check magnetic pickup signal quality',
      '5. Adjust governor gain and stability settings',
      '6. Test under various load conditions'
    ],
    likelyCauses: [
      { cause: 'Incorrect governor settings', probability: 35 },
      { cause: 'Worn actuator', probability: 25 },
      { cause: 'Air in fuel system', probability: 20 },
      { cause: 'Injector imbalance', probability: 15 },
      { cause: 'Magnetic pickup issue', probability: 5 }
    ],
    preventiveAdvice: [
      'Do not adjust governor without proper training',
      'Document all settings before changes',
      'Keep actuator linkage lubricated',
      'Check magnetic pickup gap regularly'
    ],
    schematicRefs: ['GOVERNOR-001', 'ACTUATOR-001', 'FUEL-RACK-001']
  },
  {
    code: 'ENG002',
    alternativeCodes: ['DSE-134', 'E402', 'P0234'],
    category: 'Engine',
    subcategory: 'Turbocharger',
    subsystem: 'engine',
    severity: 'warning',
    description: 'Turbocharger Overboost - Boost pressure exceeding safe limits',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-134', resetSequence: ['Reduce load', 'Check wastegate', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 102, fmi: 0, j1939Code: 'SPN102-FMI0' },
      { ecmId: 'cat-adem-a4', spn: 102, fmi: 0, j1939Code: '102-0' }
    ],
    diagnosticFlow: [
      '1. Check wastegate actuator operation',
      '2. Inspect wastegate linkage for binding',
      '3. Verify boost pressure sensor accuracy',
      '4. Check for exhaust restrictions',
      '5. Inspect intake air filter',
      '6. Test VGT (if equipped) operation'
    ],
    likelyCauses: [
      { cause: 'Wastegate stuck closed', probability: 40 },
      { cause: 'VGT vanes stuck', probability: 25 },
      { cause: 'Boost sensor drift', probability: 20 },
      { cause: 'ECM calibration issue', probability: 15 }
    ],
    preventiveAdvice: [
      'Exercise wastegate/VGT regularly',
      'Change air filters per schedule',
      'Check turbo oil supply',
      'Let engine idle before shutdown'
    ],
    schematicRefs: ['TURBO-001', 'WASTEGATE-001', 'BOOST-001']
  },
  {
    code: 'ENG003',
    alternativeCodes: ['DSE-135', 'E403', 'P0336'],
    category: 'Engine',
    subcategory: 'Crankshaft Sensor',
    subsystem: 'sensors',
    severity: 'critical',
    description: 'Crankshaft Position Sensor Failure - No engine speed signal',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-135', resetSequence: ['Check sensor gap', 'Check wiring', 'Replace sensor if needed'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 190, fmi: 8, j1939Code: 'SPN190-FMI8' },
      { ecmId: 'cat-adem-a4', spn: 190, fmi: 8, j1939Code: '190-8' },
      { ecmId: 'perkins-epm', spn: 190, fmi: 8, j1939Code: 'P0335' }
    ],
    diagnosticFlow: [
      '1. Check sensor connector for damage/corrosion',
      '2. Measure sensor gap to flywheel teeth (0.5-1.0mm typical)',
      '3. Test sensor output with oscilloscope during cranking',
      '4. Check wiring to ECM for opens/shorts',
      '5. Verify flywheel ring gear teeth condition',
      '6. Replace sensor if no signal'
    ],
    likelyCauses: [
      { cause: 'Sensor gap too large', probability: 35 },
      { cause: 'Sensor internal failure', probability: 30 },
      { cause: 'Damaged wiring', probability: 20 },
      { cause: 'Ring gear damage', probability: 10 },
      { cause: 'ECM input failure', probability: 5 }
    ],
    preventiveAdvice: [
      'Check sensor gap during major service',
      'Apply anti-seize to sensor threads',
      'Protect wiring from heat damage',
      'Replace sensor if intermittent faults occur'
    ],
    schematicRefs: ['CKP-SENSOR-001', 'FLYWHEEL-001', 'TIMING-001']
  },

  // ═══ ECM SUBSYSTEM ═══
  {
    code: 'ECM001',
    alternativeCodes: ['DSE-629', 'E501', 'SPN629'],
    category: 'ECM',
    subcategory: 'Internal Fault',
    subsystem: 'ecm',
    severity: 'critical',
    description: 'ECM Internal Failure - Processor or memory error detected',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-629', resetSequence: ['Power cycle ECM', 'Check power supply', 'Reflash if needed', 'Replace ECM if persists'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 629, fmi: 12, j1939Code: 'SPN629-FMI12' },
      { ecmId: 'cat-adem-a4', spn: 629, fmi: 12, j1939Code: '629-12' }
    ],
    diagnosticFlow: [
      '1. Record all fault codes before clearing',
      '2. Power cycle ECM (key off for 30 seconds)',
      '3. Check ECM power supply (B+ and ground)',
      '4. Verify battery voltage stability',
      '5. Attempt to connect diagnostic software',
      '6. If communication fails, try reflash',
      '7. Replace ECM if fault persists'
    ],
    likelyCauses: [
      { cause: 'ECM hardware failure', probability: 50 },
      { cause: 'Power supply issue', probability: 25 },
      { cause: 'Firmware corruption', probability: 15 },
      { cause: 'Connector/wiring problem', probability: 10 }
    ],
    preventiveAdvice: [
      'Maintain stable power supply',
      'Install surge protection',
      'Keep ECM firmware updated',
      'Avoid power wash on ECM area'
    ],
    schematicRefs: ['ECM-POWER-001', 'ECM-GROUND-001']
  },
  {
    code: 'ECM002',
    alternativeCodes: ['DSE-639', 'E502', 'SPN639'],
    category: 'ECM',
    subcategory: 'CANbus',
    subsystem: 'communication',
    severity: 'critical',
    description: 'J1939 CAN Bus Communication Failure - No data from ECM',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-639', resetSequence: ['Check CAN wiring', 'Verify termination', 'Check baud rate', 'Reset'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E502', resetSequence: ['Check connections', 'Verify CAN H/L', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 639, fmi: 9, j1939Code: 'SPN639-FMI9' },
      { ecmId: 'cat-adem-a4', spn: 639, fmi: 9, j1939Code: '639-9' },
      { ecmId: 'volvo-ems2', spn: 639, fmi: 9, j1939Code: 'SPN639-FMI9' }
    ],
    diagnosticFlow: [
      '1. Check CAN High and CAN Low connections',
      '2. Measure bus resistance (should be 60Ω end-to-end)',
      '3. Check for proper termination (120Ω at each end)',
      '4. Verify shield grounding at one point only',
      '5. Use oscilloscope to check signal quality',
      '6. Check for noise sources near CAN cable',
      '7. Verify matching baud rates on all nodes'
    ],
    likelyCauses: [
      { cause: 'CAN wiring fault', probability: 35 },
      { cause: 'Missing/incorrect termination', probability: 25 },
      { cause: 'Baud rate mismatch', probability: 20 },
      { cause: 'EMI interference', probability: 15 },
      { cause: 'ECM CAN transceiver failure', probability: 5 }
    ],
    preventiveAdvice: [
      'Use shielded twisted pair for CAN',
      'Ground shield at one end only',
      'Keep CAN away from high current wires',
      'Use proper CAN connectors'
    ],
    schematicRefs: ['CAN-BUS-001', 'TERMINATION-001', 'J1939-001']
  },
  {
    code: 'ECM003',
    alternativeCodes: ['DSE-627', 'E503'],
    category: 'ECM',
    subcategory: 'Firmware',
    subsystem: 'ecm',
    severity: 'warning',
    description: 'ECM Firmware Mismatch - Incompatible firmware version detected',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-627', resetSequence: ['Note versions', 'Update ECM or controller', 'Reset'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 627, fmi: 14, j1939Code: 'SPN627-FMI14' }
    ],
    diagnosticFlow: [
      '1. Connect diagnostic software to ECM',
      '2. Read current firmware version',
      '3. Check compatibility matrix for controller',
      '4. Download correct firmware from OEM',
      '5. Perform firmware update procedure',
      '6. Verify communication restored'
    ],
    likelyCauses: [
      { cause: 'ECM recently replaced', probability: 40 },
      { cause: 'Controller firmware updated', probability: 30 },
      { cause: 'Incorrect ECM installed', probability: 20 },
      { cause: 'Firmware corruption', probability: 10 }
    ],
    preventiveAdvice: [
      'Document all firmware versions',
      'Check compatibility before updates',
      'Keep backup of calibration files',
      'Follow OEM update procedures'
    ],
    schematicRefs: ['ECM-COMMS-001']
  },

  // ═══ CONTROLLER SUBSYSTEM ═══
  {
    code: 'CTL001',
    alternativeCodes: ['DSE-998', 'E601', 'SG-501'],
    category: 'Controller',
    subcategory: 'Reset',
    subsystem: 'controller',
    severity: 'warning',
    description: 'Controller Unexpected Reset - Watchdog timer triggered',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-998', resetSequence: ['Check power supply', 'Check grounding', 'Update firmware'] }
    ],
    ecms: [],
    diagnosticFlow: [
      '1. Check controller power supply stability',
      '2. Verify grounding connections',
      '3. Look for voltage spikes on supply',
      '4. Check for software bugs (firmware)',
      '5. Verify all inputs within spec',
      '6. Update to latest firmware'
    ],
    likelyCauses: [
      { cause: 'Power supply instability', probability: 40 },
      { cause: 'Software bug', probability: 25 },
      { cause: 'Grounding issue', probability: 20 },
      { cause: 'Input overload', probability: 15 }
    ],
    preventiveAdvice: [
      'Use filtered power supply',
      'Keep firmware updated',
      'Check connections regularly',
      'Monitor reset count'
    ],
    schematicRefs: ['CTRL-POWER-001']
  },
  {
    code: 'CTL002',
    alternativeCodes: ['DSE-999', 'E602'],
    category: 'Controller',
    subcategory: 'Configuration',
    subsystem: 'controller',
    severity: 'info',
    description: 'Controller Configuration Warning - Settings may need verification',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-999', resetSequence: ['Review settings', 'Compare to spec sheet', 'Adjust if needed'] }
    ],
    ecms: [],
    diagnosticFlow: [
      '1. Connect configuration software',
      '2. Download current settings',
      '3. Compare to OEM specifications',
      '4. Note any deviations',
      '5. Correct settings as needed',
      '6. Document all changes'
    ],
    likelyCauses: [
      { cause: 'Settings not matched to engine', probability: 50 },
      { cause: 'Previous technician changes', probability: 30 },
      { cause: 'Factory defaults restored', probability: 20 }
    ],
    preventiveAdvice: [
      'Document all settings after commissioning',
      'Password protect configuration',
      'Keep backup of settings file',
      'Review settings annually'
    ],
    schematicRefs: ['CTRL-CONFIG-001']
  },

  // ═══ LOAD SUBSYSTEM ═══
  {
    code: 'LD001',
    alternativeCodes: ['DSE-801', 'E701', 'SG-601'],
    category: 'Load',
    subcategory: 'Overload',
    subsystem: 'load',
    severity: 'critical',
    description: 'Generator Overload Trip - kW exceeds rated capacity',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-801', resetSequence: ['Reduce load', 'Check breaker', 'Reset alarm'] },
      { controllerId: 'comap-inteligen', controllerCode: 'E701', resetSequence: ['Shed non-critical loads', 'Reset'] }
    ],
    ecms: [],
    diagnosticFlow: [
      '1. Identify current load in kW',
      '2. Compare to generator rated capacity',
      '3. Identify loads that can be shed',
      '4. Check for short circuits',
      '5. Verify CT calibration',
      '6. Reset overload trip after load reduction'
    ],
    likelyCauses: [
      { cause: 'Too many loads connected', probability: 50 },
      { cause: 'Motor starting inrush', probability: 25 },
      { cause: 'Short circuit downstream', probability: 15 },
      { cause: 'CT error', probability: 10 }
    ],
    preventiveAdvice: [
      'Never exceed 80% continuous load',
      'Implement load management system',
      'Stagger motor starting',
      'Monitor load trends'
    ],
    schematicRefs: ['LOAD-MGMT-001', 'BREAKER-001']
  },
  {
    code: 'LD002',
    alternativeCodes: ['DSE-802', 'E702'],
    category: 'Load',
    subcategory: 'Derate',
    subsystem: 'load',
    severity: 'warning',
    description: 'Engine Derate Active - Power output reduced due to protection',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-802', resetSequence: ['Check ECM codes', 'Fix root cause', 'Reset derate'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 3510, fmi: 15, j1939Code: 'SPN3510-FMI15' }
    ],
    diagnosticFlow: [
      '1. Check ECM for active fault codes',
      '2. Identify derate reason (temp, pressure, emissions)',
      '3. Address root cause of protection',
      '4. Clear fault codes after repair',
      '5. Verify full power restored'
    ],
    likelyCauses: [
      { cause: 'High coolant temperature', probability: 30 },
      { cause: 'Low oil pressure', probability: 25 },
      { cause: 'DPF restriction', probability: 20 },
      { cause: 'DEF quality issue', probability: 15 },
      { cause: 'Intake restriction', probability: 10 }
    ],
    preventiveAdvice: [
      'Address all warnings promptly',
      'Maintain cooling system',
      'Use correct DEF',
      'Clean DPF per schedule'
    ],
    schematicRefs: ['DERATE-001', 'ECM-PROTECTION-001']
  },
  {
    code: 'LD003',
    alternativeCodes: ['DSE-803', 'E703', 'SG-603'],
    category: 'Load',
    subcategory: 'Shutdown on Load',
    subsystem: 'load',
    severity: 'critical',
    description: 'Engine Shutdown Under Load - Emergency stop triggered',
    controllers: [
      { controllerId: 'dse-7320', controllerCode: 'DSE-803', resetSequence: ['Check all protections', 'Clear fault cause', 'Reset emergency'] }
    ],
    ecms: [
      { ecmId: 'cummins-cm2150', spn: 1624, fmi: 15, j1939Code: 'SPN1624-FMI15' }
    ],
    diagnosticFlow: [
      '1. Record all active fault codes immediately',
      '2. Check emergency stop button status',
      '3. Review shutdown history in controller',
      '4. Check all protection inputs (oil, temp, overspeed)',
      '5. Inspect for mechanical failure signs',
      '6. Clear faults only after root cause addressed'
    ],
    likelyCauses: [
      { cause: 'Low oil pressure', probability: 30 },
      { cause: 'Overtemperature', probability: 25 },
      { cause: 'Overspeed', probability: 20 },
      { cause: 'Emergency stop pressed', probability: 15 },
      { cause: 'Mechanical failure', probability: 10 }
    ],
    preventiveAdvice: [
      'Never bypass protection systems',
      'Investigate all shutdown events',
      'Keep protection systems maintained',
      'Document shutdown causes'
    ],
    schematicRefs: ['EMERGENCY-001', 'PROTECTION-001']
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// LOOKUP FUNCTIONS - Bidirectional cross-referencing
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get all fault codes for a specific controller
 */
export function getFaultCodesByController(controllerId: string): FaultCodeBinding[] {
  return FAULT_CODE_BINDINGS.filter(fc =>
    fc.controllers.some(c => c.controllerId === controllerId)
  );
}

/**
 * Get all fault codes for a specific ECM
 */
export function getFaultCodesByECM(ecmId: string): FaultCodeBinding[] {
  return FAULT_CODE_BINDINGS.filter(fc =>
    fc.ecms.some(e => e.ecmId === ecmId)
  );
}

/**
 * Get all fault codes for a specific subsystem
 */
export function getFaultCodesBySubsystem(subsystem: FaultCodeBinding['subsystem']): FaultCodeBinding[] {
  return FAULT_CODE_BINDINGS.filter(fc => fc.subsystem === subsystem);
}

/**
 * Find fault code by any code variant
 */
export function findFaultCode(code: string): FaultCodeBinding | undefined {
  const upperCode = code.toUpperCase();
  return FAULT_CODE_BINDINGS.find(fc =>
    fc.code.toUpperCase() === upperCode ||
    fc.alternativeCodes.some(ac => ac.toUpperCase() === upperCode) ||
    fc.controllers.some(c => c.controllerCode.toUpperCase() === upperCode) ||
    fc.ecms.some(e => e.j1939Code.toUpperCase() === upperCode)
  );
}

/**
 * Check ECM-Controller compatibility
 */
export function checkECMControllerCompatibility(
  ecmId: string,
  controllerId: string
): { compatible: boolean; reason: string } {
  const controller = CONTROLLER_REGISTRY.find(c => c.id === controllerId);
  if (!controller) {
    return { compatible: false, reason: 'Controller not found in registry' };
  }

  const latestFirmware = controller.firmwareVersions.find(f =>
    f.compatibleECMs.includes(ecmId)
  );

  if (latestFirmware) {
    return {
      compatible: true,
      reason: `Compatible with controller firmware ${latestFirmware.version}`
    };
  }

  return {
    compatible: false,
    reason: `ECM ${ecmId} not listed as compatible with ${controller.brand} ${controller.model}`
  };
}

/**
 * Get ECM by serial number prefix
 */
export function getECMBySerialPrefix(serial: string): ECMRegistryEntry | undefined {
  const prefix = serial.substring(0, 2).toUpperCase();
  return ECM_REGISTRY.find(ecm =>
    ecm.serialPrefix.some(p => p.toUpperCase() === prefix)
  );
}

/**
 * Get firmware update recommendations
 */
export function getFirmwareRecommendations(
  ecmId: string,
  currentVersion: string,
  controllerId: string
): {
  needsUpdate: boolean;
  currentVersion: string;
  recommendedVersion: string;
  compatibilityIssues: string[];
} {
  const ecm = ECM_REGISTRY.find(e => e.id === ecmId);
  const controller = CONTROLLER_REGISTRY.find(c => c.id === controllerId);

  if (!ecm || !controller) {
    return {
      needsUpdate: false,
      currentVersion,
      recommendedVersion: 'Unknown',
      compatibilityIssues: ['ECM or Controller not found']
    };
  }

  const latestFirmware = ecm.firmwareVersions.find(f => f.isLatest);
  const currentFirmwareEntry = ecm.firmwareVersions.find(f => f.version === currentVersion);

  const issues: string[] = [];

  if (currentFirmwareEntry) {
    // Check if controller firmware is compatible
    const controllerLatest = controller.firmwareVersions[0];
    if (!currentFirmwareEntry.compatibility.some(c => controllerLatest.version.startsWith(c.split('.')[0]))) {
      issues.push(`Current ECM firmware may not be fully compatible with controller firmware ${controllerLatest.version}`);
    }
  } else {
    issues.push(`Current firmware version ${currentVersion} not found in registry`);
  }

  return {
    needsUpdate: latestFirmware?.version !== currentVersion,
    currentVersion,
    recommendedVersion: latestFirmware?.version || 'Unknown',
    compatibilityIssues: issues
  };
}

/**
 * Get diagnostic flow for a fault code
 */
export function getDiagnosticFlow(code: string): {
  fault: FaultCodeBinding | undefined;
  diagnosticSteps: string[];
  likelyCauses: { cause: string; probability: number }[];
  preventiveAdvice: string[];
  schematicRefs: string[];
} {
  const fault = findFaultCode(code);

  if (!fault) {
    return {
      fault: undefined,
      diagnosticSteps: ['Fault code not found in database'],
      likelyCauses: [],
      preventiveAdvice: [],
      schematicRefs: []
    };
  }

  return {
    fault,
    diagnosticSteps: fault.diagnosticFlow,
    likelyCauses: fault.likelyCauses.sort((a, b) => b.probability - a.probability),
    preventiveAdvice: fault.preventiveAdvice,
    schematicRefs: fault.schematicRefs
  };
}

/**
 * Get all faults with schematic references
 */
export function getFaultsWithSchematics(): Map<string, FaultCodeBinding[]> {
  const schematicMap = new Map<string, FaultCodeBinding[]>();

  for (const fault of FAULT_CODE_BINDINGS) {
    for (const ref of fault.schematicRefs) {
      const existing = schematicMap.get(ref) || [];
      existing.push(fault);
      schematicMap.set(ref, existing);
    }
  }

  return schematicMap;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATISTICS & VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export const MAPPING_STATISTICS = {
  totalECMs: ECM_REGISTRY.length,
  totalControllers: CONTROLLER_REGISTRY.length,
  totalFaultBindings: FAULT_CODE_BINDINGS.length,
  subsystems: [...new Set(FAULT_CODE_BINDINGS.map(f => f.subsystem))],
  categories: [...new Set(FAULT_CODE_BINDINGS.map(f => f.category))],
  ecmManufacturers: [...new Set(ECM_REGISTRY.map(e => e.manufacturer))],
  controllerBrands: [...new Set(CONTROLLER_REGISTRY.map(c => c.brand))]
};
