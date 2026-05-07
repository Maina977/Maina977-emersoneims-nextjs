/**
 * Generator Oracle — Client-safe metadata
 *
 * This file contains ONLY:
 *   - the TypeScript types/interfaces for fault-code records
 *   - the small static `CONTROLLER_BRANDS` configuration (10 brands, ~80 models)
 *   - the small static `FAULT_CATEGORIES` configuration (~16 categories)
 *
 * It MUST NOT import any of the heavy brand-curated data files or the
 * 451k-record generation logic from `controllerFaultCodes.ts`. That keeps
 * client bundles tiny: importing this file pulls < 5 KB of JS, regardless
 * of how many fault codes the diagnostic engine holds server-side.
 *
 * The full server-side dataset and search engine live in:
 *   - `lib/generator-oracle/controllerFaultCodes.ts` (server-only)
 *   - `lib/generator-oracle/server/faultIndex.ts`   (server-only wrapper)
 *
 * Client code must use the typed API client at
 * `lib/generator-oracle/client/oracleClient.ts` for any data access.
 */

// ==================== TYPES ====================

export interface TriggerParameter {
  parameter: string;
  condition: 'below' | 'above' | 'equals' | 'range';
  thresholdValue: number;
  unit: string;
  delay: number;
}

export interface PossibleCause {
  likelihood: 'high' | 'medium' | 'low';
  cause: string;
  verification: string;
}

export interface DiagnosticStep {
  step: number;
  action: string;
  expectedResult: string;
  tools?: string[];
}

export interface ResetStep {
  stepNumber: number;
  action: string;
  keySequence?: string[];
  menuPath?: string[];
  expectedResponse: string;
}

export interface ResetPathway {
  method: 'auto' | 'manual' | 'keypad' | 'software';
  applicableFirmware: string[];
  requiresCondition: string[];
  steps: ResetStep[];
  successIndicator: string;
}

export interface SparePart {
  name: string;
  partNumber: string;
  alternatePartNumbers?: string[];
  manufacturer: string;
  category: 'electrical' | 'mechanical' | 'sensor' | 'filter' | 'gasket' | 'belt' | 'bearing' | 'consumable' | 'controller';
  estimatedCost: { min: number; max: number; currency: string };
  leadTime?: string;
  criticalSpare: boolean;
  quantity: number;
  specifications?: string;
  compatibleModels?: string[];
  suppliers?: { name: string; location: string; contact?: string }[];
}

export interface ManualReference {
  type: 'parts' | 'service' | 'operation' | 'troubleshooting' | 'wiring';
  title: string;
  documentNumber?: string;
  manufacturer: string;
  section: string;
  page?: string;
  figureNumber?: string;
  downloadUrl?: string;
  isbn?: string;
  edition?: string;
  notes?: string;
}

export interface ControllerNavigation {
  brand: string;
  model: string;
  accessPath: {
    step: number;
    button: string;
    display: string;
    holdTime?: number;
    notes?: string;
  }[];
  menuPath: string[];
  passwordRequired?: boolean;
  defaultPassword?: string;
  firmwareNotes?: string;
  alternativeMethod?: string;
  screenshotUrl?: string;
}

export interface VerificationStep {
  step: number;
  action: string;
  expectedResult: string;
  measurement?: {
    parameter: string;
    expectedValue: string;
    unit: string;
    tolerance?: string;
  };
  waitTime?: number;
  tools?: string[];
  failureAction: string;
  passIndicator: string;
}

export interface RequiredTool {
  name: string;
  specification?: string;
  category: 'hand' | 'power' | 'diagnostic' | 'safety' | 'special' | 'calibration' | 'consumable';
  essential: boolean;
  alternativeTools?: string[];
  rentalAvailable?: boolean;
  estimatedCost?: { min: number; max: number; currency: string };
}

export interface Solution {
  difficulty: 'easy' | 'moderate' | 'advanced' | 'expert';
  timeEstimate: string;
  procedureSteps: string[];
  tools: string[];
  parts: string[];
  estimatedCost: { min: number; max: number; currency: string };
  spareParts?: SparePart[];
  requiredTools?: RequiredTool[];
  manualReferences?: ManualReference[];
  controllerNavigation?: ControllerNavigation;
  verificationSteps?: VerificationStep[];
  safetyPrecautions?: string[];
  technicianLevel?: 'apprentice' | 'journeyman' | 'master' | 'specialist';
  certificationRequired?: string[];
  specialNotes?: string;
}

export interface ControllerFaultCode {
  id: string;
  code: string;
  brand: string;
  model: string;
  firmwareVersions: string[];
  category: string;
  subcategory: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  alarmType: 'warning' | 'trip' | 'shutdown' | 'lockout';
  title: string;
  description: string;
  triggerParameters: TriggerParameter[];
  symptoms: string[];
  possibleCauses: PossibleCause[];
  diagnosticSteps: DiagnosticStep[];
  resetPathways: ResetPathway[];
  solutions: Solution[];
  safetyWarnings: string[];
  preventiveMeasures: string[];
  interactiveQuestions?: string[];
  verified: boolean;
  lastUpdated: string;
}

// ==================== STATIC BRAND CONFIG (small) ====================

export const CONTROLLER_BRANDS = {
  DSE: {
    name: 'DeepSea Electronics',
    models: ['DSE 4510', 'DSE 4610', 'DSE 4410', 'DSE 5110', 'DSE 5210', 'DSE 7320', 'DSE 7510', 'DSE 7560', 'DSE 8610', 'DSE 8660'],
    logo: '/brands/deepsea.png',
    color: '#1E40AF',
  },
  COMAP: {
    name: 'ComAp',
    models: ['InteliLite IL-NT AMF25', 'InteliGen NTC BaseBox', 'InteliSys NTC', 'InteliDrive'],
    logo: '/brands/comap.png',
    color: '#DC2626',
  },
  WOODWARD: {
    name: 'Woodward',
    models: ['EasyGen 3000', 'EasyGen 3500', 'LS-5 Load Share', 'GCP-30'],
    logo: '/brands/woodward.png',
    color: '#059669',
  },
  SMARTGEN: {
    name: 'SmartGen',
    models: ['HGM6100', 'HGM9500', 'HGM420', 'HGM5310'],
    logo: '/brands/smartgen.png',
    color: '#7C3AED',
  },
  POWERWIZARD: {
    name: 'CAT PowerWizard',
    models: ['PowerWizard 1.0', 'PowerWizard 2.0', 'PowerWizard 4.1'],
    logo: '/brands/cat.png',
    color: '#F59E0B',
  },
  DATAKOM: {
    name: 'Datakom',
    models: ['DKG-109', 'DKG-207', 'DKG-307', 'DKG-309', 'DKG-329', 'DKG-509', 'DKG-517', 'DKG-527', 'D-100', 'D-200', 'D-300', 'D-500', 'D-700'],
    logo: '/brands/datakom.png',
    color: '#0891B2',
  },
  LOVATO: {
    name: 'Lovato Electric',
    models: ['RGK600', 'RGK700', 'RGK800', 'RGK900', 'ATL600', 'ATL800', 'ATL900', 'EXP series', 'ATXP40'],
    logo: '/brands/lovato.png',
    color: '#EA580C',
  },
  SIEMENS: {
    name: 'Siemens',
    models: ['SICAM A8000', 'SICAM PAS', 'SIPROTEC 7SJ', 'SIPROTEC 7SD', 'SIPROTEC 7SL', 'SIPROTEC 7UT', 'SIPROTEC 7SA', 'SENTRON PAC'],
    logo: '/brands/siemens.png',
    color: '#009999',
  },
  ENKO: {
    name: 'ENKO',
    models: ['GCU-100', 'GCU-200', 'GCU-300', 'GCU-400', 'GCU-500', 'AMF-100', 'AMF-200', 'SYNC-100', 'SYNC-200'],
    logo: '/brands/enko.png',
    color: '#7C3AED',
  },
  VODIA: {
    name: 'Volvo Penta VODIA',
    models: ['VODIA5', 'VODIA6', 'D5', 'D7', 'D11', 'D13', 'D16', 'TAD530', 'TAD730', 'TAD1140', 'TAD1150', 'TAD1640', 'TAD1650', 'TWD740', 'TWD1030', 'TWD1210', 'TWD1620'],
    logo: '/brands/volvo-penta.png',
    color: '#003057',
  },
} as const;

export const FAULT_CATEGORIES = {
  ELECTRICAL: { name: 'Electrical', subcategories: ['Voltage', 'Current', 'Frequency', 'Power Factor', 'Phase', 'Earth Fault', 'Power', 'Protection'] },
  ENGINE: { name: 'Engine', subcategories: ['Oil Pressure', 'Coolant', 'Speed', 'Fuel', 'Temperature', 'Starting', 'Charging', 'Battery', 'Emergency', 'Auxiliary'] },
  CONTROL: { name: 'Control', subcategories: ['Communication', 'Memory', 'Configuration', 'Display', 'Input/Output', 'Hardware', 'Maintenance'] },
  SYNCHRONIZATION: { name: 'Synchronization', subcategories: ['Sync', 'Load Sharing', 'Breaker', 'Phase Matching', 'Frequency Matching'] },
  MAINS: { name: 'Mains', subcategories: ['Supply', 'Voltage', 'Frequency', 'Phase'] },
  PROTECTION: { name: 'Protection', subcategories: ['Shutdown', 'Lockout', 'Trip', 'Alarm'] },
  ECM: { name: 'ECM/Engine Control', subcategories: ['Communication', 'J1939', 'Injector', 'Rail Pressure', 'EGR', 'SCR', 'DPF', 'VGT', 'Timing', 'Power Supply'] },
  COOLING: { name: 'Cooling System', subcategories: ['Coolant Flow', 'Thermostat', 'Water Pump', 'Fan', 'Radiator', 'Heat Exchanger', 'Heater'] },
  LUBRICATION: { name: 'Lubrication System', subcategories: ['Oil Flow', 'Oil Filter', 'Oil Cooler', 'Oil Quality', 'Gallery Pressure', 'Bypass'] },
  AIR_SYSTEM: { name: 'Air System', subcategories: ['Air Filter', 'Intake Manifold', 'Charge Air', 'Turbocharger', 'Compressor', 'Wastegate'] },
  EXHAUST: { name: 'Exhaust System', subcategories: ['Exhaust Temp', 'Back Pressure', 'Aftertreatment', 'Catalyst', 'Muffler', 'Pyrometer'] },
  WIRING: { name: 'Wiring & Harness', subcategories: ['Harness', 'Connector', 'Short Circuit', 'Open Circuit', 'Shield', 'Termination'] },
  SENSORS: { name: 'Sensors', subcategories: ['Pressure', 'Temperature', 'Position', 'Speed', 'Level', 'Flow', 'Calibration'] },
  PREDICTIVE: { name: 'Predictive Maintenance', subcategories: ['Oil Life', 'Filter Life', 'Wear Analysis', 'Trend Analysis', 'Service Due'] },
  LOAD: { name: 'Load Management', subcategories: ['Load Profile', 'Load Factor', 'Load Acceptance', 'Load Rejection', 'Load Balance'] },
  PROGRAMMING: { name: 'Programming & Config', subcategories: ['Parameters', 'Setpoints', 'Logic', 'Timers', 'Network', 'Protocol'] },
} as const;

export type ControllerBrandKey = keyof typeof CONTROLLER_BRANDS;
export type FaultCategoryKey = keyof typeof FAULT_CATEGORIES;
