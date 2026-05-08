/**
 * Generator Oracle — Client-safe ECM/Controller catalogue + helpers
 *
 * Static reference data and pure helpers that DO NOT depend on the 451k-record
 * fault-code dataset. Safe to import from any client component.
 *
 * Heavy diagnostic operations (`searchAllFaultCodes`, `getAllFaultCodeStats`,
 * `getFaultCodesByBrand`, `getTotalFaultCodeCount`, `lookupFaultCode`,
 * `correlateFaultCodes`, `performIntegratedDiagnosis`) live in the server-only
 * `integratedDiagnosticService.ts` and are reachable from the client via
 * `lib/generator-oracle/client/oracleClient.ts`.
 */

import type { GeneratorReadings, AIAnalysisResult } from './ai-diagnostic-engine';
import type { EnhancedFaultCode } from './enhanced-fault-database';

// ═══════════════════════════════════════════════════════════════════════════════
// ECM DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMEntry {
  id: string;
  name: string;
  manufacturer: string;
  category: 'diesel' | 'gas' | 'dual-fuel' | 'marine';
  description: string[];
  workingPrinciple: string[];
  installation: string[];
  specifications: Record<string, string>;
  pinout: string;
  wiringDiagram: string;
  troubleshooting: {
    symptoms: string[];
    causes: string[];
    diagnosticSteps: string[];
    solutions: string[];
    tools: string[];
  };
  faultCodes: {
    controller: string;
    codes: { code: string; description: string; severity: string }[];
  }[];
  partNumbers: { manufacturer: string; partNumber: string; description: string }[];
  compatibleEngines: string[];
  j1939SPNs?: { spn: number; description: string; fmi: number[] }[];
  communicationProtocols?: string[];
  diagnosticSoftware?: string[];
}

export const ECM_DATABASE: ECMEntry[] = [
  {
    id: 'cummins-powercommand',
    name: 'Cummins PowerCommand ECM',
    manufacturer: 'Cummins',
    category: 'diesel',
    description: ['The Cummins PowerCommand Electronic Control Module (ECM) represents the pinnacle of diesel engine management technology.'],
    workingPrinciple: ['Closed-loop control architecture with real-time fuel mapping.'],
    installation: ['Mount in clean, dry location away from heat sources.'],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Processor': '32-bit ARM Cortex-M4 @ 400MHz',
      'Communication': 'J1939 CAN, J1708/J1587, RS-485',
      'Protection Rating': 'IP67',
    },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine cranks but does not start', 'Intermittent power loss', 'ECM communication fault'],
      causes: ['Faulty crankshaft sensor', 'Damaged wiring harness', 'ECM internal failure'],
      diagnosticSteps: ['Connect INSITE diagnostic software', 'Read fault codes', 'Check power supply'],
      solutions: ['Replace faulty sensor', 'Repair wiring', 'Replace ECM if internal failure'],
      tools: ['INSITE software', 'Multimeter', 'Oscilloscope'],
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [
          { code: 'SPN-629', description: 'ECM Internal Failure', severity: 'critical' },
          { code: 'SPN-627', description: 'ECM Processor Fault', severity: 'critical' },
          { code: 'SPN-625', description: 'ECM Memory Error', severity: 'warning' },
        ],
      },
      {
        controller: 'ComAp',
        codes: [
          { code: 'E151', description: 'ECM Communication Lost', severity: 'critical' },
          { code: 'E152', description: 'ECM Data Timeout', severity: 'warning' },
        ],
      },
    ],
    partNumbers: [
      { manufacturer: 'Cummins', partNumber: '4921776', description: 'PowerCommand ECM Module' },
      { manufacturer: 'Cummins', partNumber: '4984988', description: 'ECM Wiring Harness' },
    ],
    compatibleEngines: ['QSK19', 'QSK23', 'QSK38', 'QSK50', 'QSK60', 'QSK78', 'QSX15', 'QSB6.7', 'QSL9'],
    j1939SPNs: [
      { spn: 629, description: 'Controller #1 Configuration', fmi: [2, 12, 13, 14] },
      { spn: 627, description: 'Controller #1 Proprietary Data Link', fmi: [2, 9, 12] },
      { spn: 625, description: 'Controller #1 Software Identification', fmi: [13, 14] },
    ],
    communicationProtocols: ['J1939', 'J1708', 'J1587', 'Modbus RTU'],
    diagnosticSoftware: ['INSITE', 'INPOWER', 'QuickServe Online'],
  },
  {
    id: 'cat-adem',
    name: 'Caterpillar ADEM A4 ECM',
    manufacturer: 'Caterpillar',
    category: 'diesel',
    description: ['Advanced Diesel Engine Management for CAT C-series engines.'],
    workingPrinciple: ['Multi-pulse injection with adaptive learning.'],
    installation: ['Follow CAT installation guidelines.'],
    specifications: {
      'Operating Voltage': '18-32 VDC',
      'Processor': 'Dual-core proprietary @ 350MHz',
      'Communication': 'J1939 CAN, CAT Data Link',
      'Protection Rating': 'IP67',
    },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine derate', 'Yellow warning lamp', 'Communication fault'],
      causes: ['Sensor failure', 'Wiring issues', 'ECM failure'],
      diagnosticSteps: ['Connect CAT ET', 'Read fault codes', 'Check sensors'],
      solutions: ['Replace sensors', 'Repair wiring', 'Flash ECM'],
      tools: ['CAT ET', 'Communication Adapter', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'CAT',
        codes: [
          { code: '168-0', description: 'System Voltage Low', severity: 'warning' },
          { code: '168-1', description: 'System Voltage High', severity: 'warning' },
          { code: '190-0', description: 'Engine Overspeed', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Caterpillar', partNumber: '348-2380', description: 'ADEM A4 ECM' }],
    compatibleEngines: ['C7', 'C9', 'C13', 'C15', 'C18', 'C27', 'C32', '3406E', '3412E'],
    j1939SPNs: [
      { spn: 168, description: 'Battery Potential / Power Input', fmi: [0, 1, 3, 4] },
      { spn: 190, description: 'Engine Speed', fmi: [0, 1, 2, 15, 16] },
    ],
    communicationProtocols: ['J1939', 'CAT Data Link'],
    diagnosticSoftware: ['CAT ET', 'SIS Web'],
  },
  {
    id: 'perkins-ecm',
    name: 'Perkins 1300 Series ECM',
    manufacturer: 'Perkins',
    category: 'diesel',
    description: ['Electronic control for Perkins industrial engines.'],
    workingPrinciple: ['Common rail fuel injection control.'],
    installation: ['Standard diesel ECM installation.'],
    specifications: { 'Operating Voltage': '9-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP65' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['No start', 'Power loss', 'Fault lamp'],
      causes: ['Sensor faults', 'Wiring damage', 'ECM failure'],
      diagnosticSteps: ['Connect EST', 'Read codes', 'Check connections'],
      solutions: ['Replace sensors', 'Repair harness', 'Replace ECM'],
      tools: ['Perkins EST', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'DSE',
        codes: [{ code: 'P0335', description: 'Crankshaft Position Sensor Circuit', severity: 'critical' }],
      },
    ],
    partNumbers: [{ manufacturer: 'Perkins', partNumber: 'T400391', description: 'ECM Module' }],
    compatibleEngines: ['1306D-E87TAG', '1306D-E87TAG2', '1506D-E88TAG'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['Perkins EST', 'Perkins SPI2'],
  },
  {
    id: 'volvo-ems2',
    name: 'Volvo EMS 2 ECU',
    manufacturer: 'Volvo Penta',
    category: 'diesel',
    description: ['Engine Management System for Volvo Penta engines.'],
    workingPrinciple: ['Electronic unit injection control.'],
    installation: ['Marine/Industrial rated installation.'],
    specifications: { 'Operating Voltage': '18-32 VDC', 'Communication': 'J1939 CAN, Volvo Proprietary', 'Protection Rating': 'IP67' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine warning', 'Power reduction', 'No communication'],
      causes: ['Sensor failure', 'Harness damage', 'ECU fault'],
      diagnosticSteps: ['Connect VODIA', 'Read parameters', 'Check sensors'],
      solutions: ['Replace sensors', 'Repair wiring', 'Update software'],
      tools: ['VODIA', 'VCADS Pro'],
    },
    faultCodes: [
      {
        controller: 'Volvo',
        codes: [{ code: 'MID 128 PID 110', description: 'Coolant Temperature High', severity: 'critical' }],
      },
    ],
    partNumbers: [{ manufacturer: 'Volvo Penta', partNumber: '21900852', description: 'EMS 2 ECU' }],
    compatibleEngines: ['D13', 'D16', 'TAD1340', 'TAD1341', 'TAD1342', 'TAD1350', 'TAD1351'],
    communicationProtocols: ['J1939', 'Volvo EDC'],
    diagnosticSoftware: ['VODIA', 'VCADS Pro', 'PTT'],
  },
  {
    id: 'mtu-adec',
    name: 'MTU ADEC ECU',
    manufacturer: 'MTU',
    category: 'diesel',
    description: ['Advanced Diesel Engine Control for MTU Series engines.'],
    workingPrinciple: ['Multi-point fuel injection with emissions control.'],
    installation: ['Heavy-duty industrial installation.'],
    specifications: { 'Operating Voltage': '18-32 VDC', 'Communication': 'J1939 CAN, MTU Proprietary', 'Protection Rating': 'IP67' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine fault lamp', 'Power derate', 'Communication loss'],
      causes: ['Sensor failures', 'Wiring issues', 'ECU internal fault'],
      diagnosticSteps: ['Connect MDEC', 'Read fault memory', 'Check parameters'],
      solutions: ['Calibrate sensors', 'Repair connections', 'Replace ECU'],
      tools: ['MDEC Diagnostic System', 'MTU Diasys'],
    },
    faultCodes: [
      {
        controller: 'MTU',
        codes: [
          { code: 'SPN 100', description: 'Oil Pressure Low', severity: 'critical' },
          { code: 'SPN 110', description: 'Coolant Temperature High', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'MTU', partNumber: 'X00045677', description: 'ADEC Control Unit' }],
    compatibleEngines: ['4000 Series', '2000 Series', '1600 Series', '1300 Series'],
    communicationProtocols: ['J1939', 'MDEC Proprietary'],
    diagnosticSoftware: ['MTU Diasys', 'MDEC'],
  },
  {
    id: 'detroit-ddec',
    name: 'Detroit Diesel DDEC VI ECM',
    manufacturer: 'Detroit Diesel',
    category: 'diesel',
    description: ['Detroit Diesel Electronic Controls for DD series engines.'],
    workingPrinciple: ['Amplified common rail injection control.'],
    installation: ['Heavy-duty truck/genset installation.'],
    specifications: { 'Operating Voltage': '18-32 VDC', 'Communication': 'J1939 CAN, J1587', 'Protection Rating': 'IP67' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Check engine light', 'Derate mode', 'Starting issues'],
      causes: ['Sensor faults', 'Injector issues', 'ECM failure'],
      diagnosticSteps: ['Connect DDDL', 'Read fault codes', 'Monitor parameters'],
      solutions: ['Replace sensors', 'Clean/replace injectors', 'Reflash ECM'],
      tools: ['Detroit Diesel Diagnostic Link (DDDL)', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'DDEC',
        codes: [
          { code: 'SPN 94', description: 'Fuel Delivery Pressure', severity: 'warning' },
          { code: 'SPN 100', description: 'Engine Oil Pressure', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Detroit Diesel', partNumber: 'A0014467435', description: 'DDEC VI ECM' }],
    compatibleEngines: ['DD13', 'DD15', 'DD16', 'Series 60'],
    communicationProtocols: ['J1939', 'J1587', 'J1708'],
    diagnosticSoftware: ['DDDL', 'Detroit Connect'],
  },
  {
    id: 'john-deere-powertech',
    name: 'John Deere PowerTech ECU',
    manufacturer: 'John Deere',
    category: 'diesel',
    description: ['Electronic control for John Deere PowerTech engines.'],
    workingPrinciple: ['High-pressure common rail with exhaust aftertreatment control.'],
    installation: ['Agricultural/Industrial installation.'],
    specifications: { 'Operating Voltage': '9-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP67' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine warning light', 'Reduced power', 'DPF regeneration issues'],
      causes: ['DEF quality', 'Sensor failures', 'DPF blockage'],
      diagnosticSteps: ['Connect Service Advisor', 'Read codes', 'Check DEF system'],
      solutions: ['Replace DEF', 'Clean DPF', 'Replace sensors'],
      tools: ['John Deere Service Advisor', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'JD',
        codes: [
          { code: 'SPN 3226', description: 'Aftertreatment DEF Tank Level Low', severity: 'warning' },
          { code: 'SPN 3251', description: 'Aftertreatment SCR Catalyst Conversion', severity: 'warning' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'John Deere', partNumber: 'RE532628', description: 'PowerTech ECU' }],
    compatibleEngines: ['4045', '6068', '6090', '13.5L'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['Service Advisor', 'JDLink'],
  },
  {
    id: 'deutz-emr4',
    name: 'Deutz EMR4 Controller',
    manufacturer: 'Deutz',
    category: 'diesel',
    description: ['Engine Management Regulator for Deutz TCD engines.'],
    workingPrinciple: ['Electronic governor with common rail control.'],
    installation: ['Industrial/Marine installation.'],
    specifications: { 'Operating Voltage': '9-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP65' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine stops', 'No power increase', 'Warning lamp'],
      causes: ['Rail pressure issues', 'Sensor faults', 'Wiring damage'],
      diagnosticSteps: ['Connect SerDia', 'Read fault codes', 'Check rail pressure'],
      solutions: ['Replace high pressure pump', 'Repair wiring', 'Replace sensors'],
      tools: ['Deutz SerDia', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'Deutz',
        codes: [
          { code: 'P0087', description: 'Fuel Rail Pressure Too Low', severity: 'critical' },
          { code: 'P0088', description: 'Fuel Rail Pressure Too High', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Deutz', partNumber: '04286251', description: 'EMR4 Controller' }],
    compatibleEngines: ['TCD 2012', 'TCD 2013', 'TCD 2015', 'TCD 12.0', 'TCD 16.0'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['SerDia'],
  },
  {
    id: 'yanmar-smartassist',
    name: 'Yanmar SmartAssist ECU',
    manufacturer: 'Yanmar',
    category: 'diesel',
    description: ['Electronic control for Yanmar industrial diesel engines.'],
    workingPrinciple: ['Direct injection control with emissions management.'],
    installation: ['Compact equipment installation.'],
    specifications: { 'Operating Voltage': '9-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP65' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Check engine', 'Power loss', 'Hard starting'],
      causes: ['Glow plug failure', 'Fuel system issues', 'Sensor faults'],
      diagnosticSteps: ['Connect SmartAssist', 'Read DTC', 'Check glow plugs'],
      solutions: ['Replace glow plugs', 'Clean fuel system', 'Replace sensors'],
      tools: ['Yanmar SmartAssist', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'Yanmar',
        codes: [
          { code: 'E003', description: 'Coolant Temperature Sensor Fault', severity: 'warning' },
          { code: 'E006', description: 'Oil Pressure Low', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Yanmar', partNumber: '129A00-77310', description: 'SmartAssist ECU' }],
    compatibleEngines: ['4TNV84', '4TNV88', '4TNV94', '4TNV98', '4TNV106'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['SmartAssist-Direct'],
  },
  {
    id: 'doosan-ecu',
    name: 'Doosan Engine Control Unit',
    manufacturer: 'Doosan',
    category: 'diesel',
    description: ['Electronic control for Doosan industrial engines.'],
    workingPrinciple: ['Common rail fuel injection control.'],
    installation: ['Industrial equipment installation.'],
    specifications: { 'Operating Voltage': '18-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP67' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine fault', 'Derate', 'No start'],
      causes: ['Fuel pressure issues', 'Sensor failures', 'ECU fault'],
      diagnosticSteps: ['Connect DoosanConnect', 'Read faults', 'Monitor parameters'],
      solutions: ['Service fuel system', 'Replace sensors', 'Update ECU'],
      tools: ['DoosanConnect', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'Doosan',
        codes: [
          { code: 'P0089', description: 'Fuel Pressure Regulator Performance', severity: 'critical' },
          { code: 'P0091', description: 'Fuel Pressure Regulator Control Circuit Low', severity: 'warning' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Doosan', partNumber: '65.11201-6007', description: 'Engine ECU' }],
    compatibleEngines: ['DL06', 'DL08', 'DV11', 'DP180'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['DoosanConnect'],
  },
  {
    id: 'weichai-wp10',
    name: 'Weichai WP10 ECM',
    manufacturer: 'Weichai',
    category: 'diesel',
    description: ['Electronic control for Weichai WP series engines.'],
    workingPrinciple: ['High pressure common rail with EGR control.'],
    installation: ['Industrial/Genset installation.'],
    specifications: { 'Operating Voltage': '18-32 VDC', 'Communication': 'J1939 CAN', 'Protection Rating': 'IP65' },
    pinout: 'See ECMDiagnosticsPanel for full pinout',
    wiringDiagram: 'See ECMDiagnosticsPanel for full diagram',
    troubleshooting: {
      symptoms: ['Engine warning', 'Power loss', 'High exhaust temperature'],
      causes: ['EGR blockage', 'Turbo issues', 'Sensor failures'],
      diagnosticSteps: ['Connect Weichai diagnostic tool', 'Read fault codes', 'Check EGR'],
      solutions: ['Clean EGR', 'Replace turbo', 'Calibrate sensors'],
      tools: ['Weichai Diagnostic Tool', 'Multimeter'],
    },
    faultCodes: [
      {
        controller: 'Weichai',
        codes: [
          { code: 'E0403', description: 'EGR Valve Position Error', severity: 'warning' },
          { code: 'E0234', description: 'Turbo Overboost', severity: 'critical' },
        ],
      },
    ],
    partNumbers: [{ manufacturer: 'Weichai', partNumber: '612600190458', description: 'WP10 ECM' }],
    compatibleEngines: ['WP10', 'WP12', 'WP13', 'WD10'],
    communicationProtocols: ['J1939'],
    diagnosticSoftware: ['Weichai Diagnostic System'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export interface ControllerInfo {
  id: string;
  name: string;
  manufacturer: string;
  communicationProtocols: string[];
  compatibleECMs: string[];
  faultCodePrefix: string;
  diagnosticSoftware: string[];
}

export const CONTROLLER_DATABASE: ControllerInfo[] = [
  {
    id: 'dse-7320',
    name: 'DSE 7320',
    manufacturer: 'Deep Sea Electronics',
    communicationProtocols: ['J1939', 'Modbus', 'Ethernet'],
    compatibleECMs: ['cummins-powercommand', 'perkins-ecm', 'volvo-ems2', 'mtu-adec'],
    faultCodePrefix: 'DSE',
    diagnosticSoftware: ['DSE Configuration Suite'],
  },
  {
    id: 'comap-inteligen',
    name: 'ComAp InteliGen',
    manufacturer: 'ComAp',
    communicationProtocols: ['J1939', 'Modbus', 'Ethernet'],
    compatibleECMs: ['cummins-powercommand', 'cat-adem', 'perkins-ecm', 'volvo-ems2'],
    faultCodePrefix: 'E',
    diagnosticSoftware: ['InteliConfig', 'WebSupervisor'],
  },
  {
    id: 'woodward-easygen',
    name: 'Woodward easYgen-3000',
    manufacturer: 'Woodward',
    communicationProtocols: ['J1939', 'CAN', 'Modbus'],
    compatibleECMs: ['cummins-powercommand', 'mtu-adec', 'detroit-ddec'],
    faultCodePrefix: 'W',
    diagnosticSoftware: ['ToolKit', 'GAP'],
  },
  {
    id: 'smartgen-hgm9320',
    name: 'SmartGen HGM9320',
    manufacturer: 'SmartGen',
    communicationProtocols: ['J1939', 'Modbus', 'RS485'],
    compatibleECMs: ['cummins-powercommand', 'perkins-ecm', 'weichai-wp10', 'yanmar-smartassist'],
    faultCodePrefix: 'SG',
    diagnosticSoftware: ['SG-Configuration Tool'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// REQUEST/RESPONSE TYPES (used by panels for typing only)
// ═══════════════════════════════════════════════════════════════════════════════

export interface TechnicianInput {
  faultCodes?: string[];
  symptoms?: string;
  ecmManufacturer?: string;
  ecmModel?: string;
  controllerBrand?: string;
  controllerModel?: string;
  engineBrand?: string;
  engineModel?: string;
  engineSerialNumber?: string;
  generatorKva?: number;
  engineHours?: number;
  readings?: GeneratorReadings;
  recentMaintenance?: string;
  environmentalConditions?: string;
  loadConditions?: string;
}

export interface IntegratedDiagnosisResult {
  timestamp: string;
  diagnosisId: string;
  ecmInfo?: {
    ecm: ECMEntry;
    relevantFaultCodes: { code: string; description: string; severity: string }[];
    diagnosticSteps: string[];
    pinoutDiagram: string;
    wiringDiagram: string;
    requiredTools: string[];
    diagnosticSoftware: string[];
  };
  controllerInfo?: {
    controller: ControllerInfo;
    compatibleWithECM: boolean;
    communicationStatus: 'verified' | 'needs-check' | 'incompatible';
  };
  faultCodeAnalysis: {
    codesFound: number;
    codeDetails: Array<{
      code: string;
      found: boolean;
      faultInfo?: EnhancedFaultCode;
      ecmSpecificInfo?: { code: string; description: string; severity: string };
      severity: string;
      category: string;
    }>;
    correlatedFaults: string[];
    rootCauseProbability: Array<{ cause: string; probability: number; affectedCodes: string[] }>;
  };
  aiAnalysis?: AIAnalysisResult;
  solution: {
    primaryDiagnosis: string;
    confidence: number;
    immediateActions: string[];
    stepByStepProcedure: Array<{
      step: number;
      action: string;
      details: string;
      safetyWarning?: string;
      tools?: string[];
      timeEstimate: string;
    }>;
    partsRequired: Array<{ name: string; partNumber: string; quantity: number; estimatedCostKES: number; source: string[] }>;
    estimatedRepairTime: string;
    estimatedCostKES: { min: number; max: number };
    preventiveMeasures: string[];
  };
  resources: {
    serviceManuals: string[];
    technicalBulletins: string[];
    trainingVideos: string[];
    supportContacts: Array<{ name: string; phone: string; email: string }>;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIGHT HELPERS — pure functions over the static catalogues above.
// No fault-code dataset access.
// ═══════════════════════════════════════════════════════════════════════════════

export function findECM(manufacturer?: string, model?: string): ECMEntry | undefined {
  if (!manufacturer && !model) return undefined;
  return ECM_DATABASE.find((ecm) => {
    const m = !manufacturer || ecm.manufacturer.toLowerCase().includes(manufacturer.toLowerCase());
    const md =
      !model ||
      ecm.name.toLowerCase().includes(model.toLowerCase()) ||
      ecm.id.toLowerCase().includes(model.toLowerCase());
    return m && md;
  });
}

export function findController(brand?: string, model?: string): ControllerInfo | undefined {
  if (!brand && !model) return undefined;
  return CONTROLLER_DATABASE.find((c) => {
    const m = !brand || c.manufacturer.toLowerCase().includes(brand.toLowerCase());
    const md =
      !model ||
      c.name.toLowerCase().includes(model.toLowerCase()) ||
      c.id.toLowerCase().includes(model.toLowerCase());
    return m && md;
  });
}

export function getECMFaultCodes(
  ecmId: string,
  controllerName?: string,
): { code: string; description: string; severity: string }[] {
  const ecm = ECM_DATABASE.find((e) => e.id === ecmId);
  if (!ecm) return [];
  if (controllerName) {
    const cf = ecm.faultCodes.find((fc) => fc.controller.toLowerCase().includes(controllerName.toLowerCase()));
    return cf?.codes || [];
  }
  return ecm.faultCodes.flatMap((fc) => fc.codes);
}

export const getECMManufacturers = (): string[] => [...new Set(ECM_DATABASE.map((e) => e.manufacturer))];
export const getControllerBrands = (): string[] => [...new Set(CONTROLLER_DATABASE.map((c) => c.manufacturer))];
export const getECMsByManufacturer = (manufacturer: string): ECMEntry[] =>
  ECM_DATABASE.filter((e) => e.manufacturer.toLowerCase() === manufacturer.toLowerCase());
export const searchECMs = (query: string): ECMEntry[] => {
  const q = query.toLowerCase();
  return ECM_DATABASE.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.manufacturer.toLowerCase().includes(q) ||
      e.compatibleEngines.some((eng) => eng.toLowerCase().includes(q)),
  );
};
