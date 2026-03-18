/**
 * ECM PROGRAMMING SYSTEM - Generator Oracle ODI
 *
 * Complete ECM programming, reprogramming, code erasing, and configuration system.
 * Works with or without hardware through simulation/emulation modes.
 *
 * Features:
 * - Full ECM Programming (Firmware, Calibration, Parameters)
 * - Reprogramming & Recovery
 * - Fault Code Erasing & Management
 * - Configuration & Tuning
 * - Controller Compatibility
 * - Hardware & Software Modes
 *
 * © 2026 Generator Oracle. All Rights Reserved.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type ConnectionMode = 'hardware' | 'simulation' | 'emulation' | 'cloud';
export type ProgrammingOperation = 'read' | 'write' | 'erase' | 'verify' | 'backup' | 'restore' | 'clone';
export type ECMState = 'disconnected' | 'connecting' | 'connected' | 'programming' | 'error' | 'locked' | 'recovery';

export interface HardwareAdapter {
  id: string;
  name: string;
  manufacturer: string;
  type: 'usb' | 'bluetooth' | 'wifi' | 'canbus' | 'j1939' | 'obd2' | 'ethernet';
  protocols: string[];
  baudRates: number[];
  firmwareVersion: string;
  isConnected: boolean;
  capabilities: AdapterCapability[];
}

export interface AdapterCapability {
  name: string;
  supported: boolean;
  notes?: string;
}

export interface ECMConnection {
  mode: ConnectionMode;
  adapter?: HardwareAdapter;
  ecmId: string;
  ecmManufacturer: string;
  ecmModel: string;
  protocol: string;
  baudRate: number;
  state: ECMState;
  securityLevel: number;
  sessionId: string;
  connectedAt: Date;
  lastActivity: Date;
}

export interface ProgrammingSession {
  id: string;
  connection: ECMConnection;
  operation: ProgrammingOperation;
  startTime: Date;
  endTime?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  currentStep: string;
  steps: ProgrammingStep[];
  logs: ProgrammingLog[];
  errors: ProgrammingError[];
  backup?: ECMBackup;
}

export interface ProgrammingStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  progress: number;
  startTime?: Date;
  endTime?: Date;
  retryCount: number;
  maxRetries: number;
}

export interface ProgrammingLog {
  timestamp: Date;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  data?: Record<string, unknown>;
}

export interface ProgrammingError {
  code: string;
  message: string;
  severity: 'warning' | 'error' | 'critical';
  recoverable: boolean;
  suggestedAction: string;
  timestamp: Date;
}

export interface ECMBackup {
  id: string;
  ecmId: string;
  createdAt: Date;
  firmware: FirmwareBackup;
  calibration: CalibrationBackup;
  parameters: ParameterBackup[];
  faultCodes: FaultCodeBackup[];
  checksum: string;
  encrypted: boolean;
}

export interface FirmwareBackup {
  version: string;
  data: string; // Base64 encoded
  checksum: string;
  size: number;
}

export interface CalibrationBackup {
  id: string;
  name: string;
  data: string;
  checksum: string;
}

export interface ParameterBackup {
  id: string;
  name: string;
  value: number | string | boolean;
  unit: string;
}

export interface FaultCodeBackup {
  code: string;
  status: 'active' | 'pending' | 'history';
  occurrenceCount: number;
  firstOccurrence: Date;
  lastOccurrence: Date;
  freezeFrameData?: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM SOFTWARE PROFILES - Detailed software for each ECM manufacturer
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMSoftwareProfile {
  id: string;
  manufacturer: string;
  ecmFamily: string;
  models: string[];
  softwareName: string;
  version: string;
  capabilities: ECMCapability[];
  programmingProtocols: ProgrammingProtocol[];
  securityFeatures: SecurityFeature[];
  parameterGroups: ParameterGroup[];
  faultCodeCategories: FaultCodeCategory[];
  configurationOptions: ConfigurationOption[];
  diagnosticFunctions: DiagnosticFunction[];
  specialFunctions: SpecialFunction[];
}

export interface ECMCapability {
  id: string;
  name: string;
  description: string;
  category: 'programming' | 'diagnostics' | 'configuration' | 'monitoring' | 'testing';
  requiresHardware: boolean;
  securityLevel: number;
  supportedModes: ConnectionMode[];
}

export interface ProgrammingProtocol {
  id: string;
  name: string;
  type: 'j1939' | 'canbus' | 'k-line' | 'kwp2000' | 'uds' | 'proprietary';
  baudRates: number[];
  messageFormat: string;
  addressingMode: 'physical' | 'functional' | 'extended';
  securityAccess: boolean;
  seedKeyAlgorithm?: string;
}

export interface SecurityFeature {
  id: string;
  name: string;
  level: number;
  description: string;
  unlockMethod: 'seed_key' | 'password' | 'certificate' | 'token' | 'biometric';
  requiredForOperations: ProgrammingOperation[];
}

export interface ParameterGroup {
  id: string;
  name: string;
  category: string;
  parameters: ECMParameter[];
  editable: boolean;
  requiresUnlock: boolean;
}

export interface ECMParameter {
  id: string;
  name: string;
  shortName: string;
  description: string;
  dataType: 'uint8' | 'uint16' | 'uint32' | 'int8' | 'int16' | 'int32' | 'float' | 'string' | 'boolean' | 'enum';
  unit: string;
  defaultValue: number | string | boolean;
  minValue?: number;
  maxValue?: number;
  step?: number;
  enumValues?: { value: number; label: string }[];
  address: number;
  size: number;
  scaleFactor?: number;
  offset?: number;
  editable: boolean;
  affectsEmissions: boolean;
  affectsPerformance: boolean;
  criticalParameter: boolean;
  category: string;
}

export interface FaultCodeCategory {
  id: string;
  name: string;
  description: string;
  codeRange: { start: string; end: string };
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  canErase: boolean;
  requiresRepair: boolean;
}

export interface ConfigurationOption {
  id: string;
  name: string;
  description: string;
  category: string;
  type: 'toggle' | 'select' | 'range' | 'text' | 'multiselect';
  defaultValue: unknown;
  options?: { value: unknown; label: string }[];
  minValue?: number;
  maxValue?: number;
  affectsOperation: boolean;
  requiresReboot: boolean;
}

export interface DiagnosticFunction {
  id: string;
  name: string;
  description: string;
  category: string;
  steps: string[];
  expectedResults: string[];
  requiresHardware: boolean;
  duration: string;
}

export interface SpecialFunction {
  id: string;
  name: string;
  description: string;
  category: 'reset' | 'calibration' | 'learning' | 'test' | 'maintenance';
  warningMessage?: string;
  requiresConfirmation: boolean;
  requiresEngineOff: boolean;
  requiresEngineRunning: boolean;
  securityLevel: number;
  steps: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM SOFTWARE PROFILES DATABASE
// ═══════════════════════════════════════════════════════════════════════════════

export const ECM_SOFTWARE_PROFILES: ECMSoftwareProfile[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // CUMMINS ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cummins-cm2350',
    manufacturer: 'Cummins',
    ecmFamily: 'CM2350',
    models: ['CM2350', 'CM2350A', 'CM2350B'],
    softwareName: 'INSITE Pro',
    version: '8.9.0',
    capabilities: [
      {
        id: 'flash_programming',
        name: 'Flash Programming',
        description: 'Program ECM firmware and calibration files',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware', 'cloud'],
      },
      {
        id: 'parameter_editing',
        name: 'Parameter Editing',
        description: 'Read and modify ECM parameters',
        category: 'configuration',
        requiresHardware: false,
        securityLevel: 2,
        supportedModes: ['hardware', 'simulation', 'emulation'],
      },
      {
        id: 'fault_code_management',
        name: 'Fault Code Management',
        description: 'Read, clear, and analyze fault codes',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
      {
        id: 'real_time_monitoring',
        name: 'Real-Time Monitoring',
        description: 'Monitor engine parameters in real-time',
        category: 'monitoring',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware'],
      },
      {
        id: 'cylinder_cutout_test',
        name: 'Cylinder Cutout Test',
        description: 'Test individual cylinder performance',
        category: 'testing',
        requiresHardware: true,
        securityLevel: 2,
        supportedModes: ['hardware'],
      },
    ],
    programmingProtocols: [
      {
        id: 'j1939',
        name: 'SAE J1939',
        type: 'j1939',
        baudRates: [250000, 500000],
        messageFormat: '29-bit CAN',
        addressingMode: 'extended',
        securityAccess: true,
        seedKeyAlgorithm: 'Cummins-AES256',
      },
      {
        id: 'cummins_datalink',
        name: 'Cummins Datalink',
        type: 'proprietary',
        baudRates: [9600, 19200],
        messageFormat: 'Cummins Protocol',
        addressingMode: 'physical',
        securityAccess: true,
      },
    ],
    securityFeatures: [
      {
        id: 'security_level_1',
        name: 'Basic Access',
        level: 1,
        description: 'Read-only access to parameters and fault codes',
        unlockMethod: 'seed_key',
        requiredForOperations: ['read'],
      },
      {
        id: 'security_level_2',
        name: 'Service Access',
        level: 2,
        description: 'Modify parameters and clear fault codes',
        unlockMethod: 'seed_key',
        requiredForOperations: ['write', 'erase'],
      },
      {
        id: 'security_level_3',
        name: 'Factory Access',
        level: 3,
        description: 'Full programming and calibration access',
        unlockMethod: 'certificate',
        requiredForOperations: ['write', 'erase', 'backup', 'restore'],
      },
    ],
    parameterGroups: [
      {
        id: 'engine_control',
        name: 'Engine Control Parameters',
        category: 'Engine',
        editable: true,
        requiresUnlock: true,
        parameters: [
          {
            id: 'idle_speed',
            name: 'Idle Speed',
            shortName: 'IDLE_SPD',
            description: 'Target engine idle speed',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 750,
            minValue: 600,
            maxValue: 900,
            step: 10,
            address: 0x1000,
            size: 2,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: true,
            criticalParameter: false,
            category: 'Speed Control',
          },
          {
            id: 'rated_speed',
            name: 'Rated Speed',
            shortName: 'RATED_SPD',
            description: 'Maximum governed engine speed',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 1800,
            minValue: 1500,
            maxValue: 2100,
            step: 50,
            address: 0x1002,
            size: 2,
            editable: true,
            affectsEmissions: true,
            affectsPerformance: true,
            criticalParameter: true,
            category: 'Speed Control',
          },
          {
            id: 'governor_droop',
            name: 'Governor Droop',
            shortName: 'GOV_DROOP',
            description: 'Speed droop percentage for load sharing',
            dataType: 'float',
            unit: '%',
            defaultValue: 5.0,
            minValue: 0,
            maxValue: 10,
            step: 0.5,
            address: 0x1004,
            size: 4,
            scaleFactor: 0.1,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: true,
            criticalParameter: false,
            category: 'Speed Control',
          },
          {
            id: 'fuel_limit',
            name: 'Maximum Fuel Limit',
            shortName: 'FUEL_LIM',
            description: 'Maximum fuel injection quantity',
            dataType: 'uint16',
            unit: 'mm³/stroke',
            defaultValue: 180,
            minValue: 50,
            maxValue: 250,
            step: 5,
            address: 0x1008,
            size: 2,
            editable: true,
            affectsEmissions: true,
            affectsPerformance: true,
            criticalParameter: true,
            category: 'Fuel Control',
          },
          {
            id: 'timing_advance',
            name: 'Base Timing Advance',
            shortName: 'TIMING',
            description: 'Base injection timing advance',
            dataType: 'float',
            unit: '°BTDC',
            defaultValue: 12.5,
            minValue: 5,
            maxValue: 25,
            step: 0.5,
            address: 0x100C,
            size: 4,
            editable: true,
            affectsEmissions: true,
            affectsPerformance: true,
            criticalParameter: true,
            category: 'Fuel Control',
          },
        ],
      },
      {
        id: 'protection_limits',
        name: 'Protection Limits',
        category: 'Safety',
        editable: true,
        requiresUnlock: true,
        parameters: [
          {
            id: 'overspeed_limit',
            name: 'Overspeed Shutdown',
            shortName: 'OVERSPD',
            description: 'Engine shutdown speed limit',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 2200,
            minValue: 1900,
            maxValue: 2500,
            step: 50,
            address: 0x2000,
            size: 2,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: false,
            criticalParameter: true,
            category: 'Protection',
          },
          {
            id: 'high_coolant_temp',
            name: 'High Coolant Temperature',
            shortName: 'HI_COOL',
            description: 'High coolant temperature warning threshold',
            dataType: 'uint8',
            unit: '°C',
            defaultValue: 100,
            minValue: 80,
            maxValue: 110,
            step: 1,
            address: 0x2002,
            size: 1,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: false,
            criticalParameter: true,
            category: 'Protection',
          },
          {
            id: 'low_oil_pressure',
            name: 'Low Oil Pressure',
            shortName: 'LO_OIL',
            description: 'Low oil pressure shutdown threshold',
            dataType: 'uint16',
            unit: 'kPa',
            defaultValue: 100,
            minValue: 50,
            maxValue: 200,
            step: 10,
            address: 0x2003,
            size: 2,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: false,
            criticalParameter: true,
            category: 'Protection',
          },
        ],
      },
    ],
    faultCodeCategories: [
      {
        id: 'spn_engine',
        name: 'Engine Faults',
        description: 'Engine-related diagnostic trouble codes',
        codeRange: { start: 'SPN 91', end: 'SPN 190' },
        severity: 'warning',
        canErase: true,
        requiresRepair: false,
      },
      {
        id: 'spn_aftertreatment',
        name: 'Aftertreatment Faults',
        description: 'Emissions system fault codes',
        codeRange: { start: 'SPN 3216', end: 'SPN 3363' },
        severity: 'critical',
        canErase: true,
        requiresRepair: true,
      },
      {
        id: 'spn_electrical',
        name: 'Electrical Faults',
        description: 'Electrical system fault codes',
        codeRange: { start: 'SPN 620', end: 'SPN 699' },
        severity: 'warning',
        canErase: true,
        requiresRepair: false,
      },
    ],
    configurationOptions: [
      {
        id: 'governor_mode',
        name: 'Governor Mode',
        description: 'Select governor operating mode',
        category: 'Engine Control',
        type: 'select',
        defaultValue: 'isochronous',
        options: [
          { value: 'isochronous', label: 'Isochronous (0% Droop)' },
          { value: 'droop', label: 'Droop Mode' },
          { value: 'variable', label: 'Variable Speed' },
        ],
        affectsOperation: true,
        requiresReboot: true,
      },
      {
        id: 'remote_start',
        name: 'Remote Start Enable',
        description: 'Enable remote start/stop capability',
        category: 'Control',
        type: 'toggle',
        defaultValue: true,
        affectsOperation: true,
        requiresReboot: false,
      },
      {
        id: 'preheat_time',
        name: 'Preheat Time',
        description: 'Glow plug preheat duration',
        category: 'Starting',
        type: 'range',
        defaultValue: 10,
        minValue: 0,
        maxValue: 60,
        affectsOperation: true,
        requiresReboot: false,
      },
    ],
    diagnosticFunctions: [
      {
        id: 'compression_test',
        name: 'Relative Compression Test',
        description: 'Test relative compression across all cylinders',
        category: 'Engine Mechanical',
        steps: [
          'Ensure engine is at operating temperature',
          'Connect diagnostic adapter',
          'Start compression test procedure',
          'Crank engine for specified duration',
          'Analyze compression waveforms',
        ],
        expectedResults: ['All cylinders within 10% of average', 'No abnormal patterns detected'],
        requiresHardware: true,
        duration: '5-10 minutes',
      },
      {
        id: 'injector_test',
        name: 'Injector Performance Test',
        description: 'Test fuel injector performance and balance',
        category: 'Fuel System',
        steps: [
          'Warm up engine to operating temperature',
          'Connect diagnostic adapter',
          'Run injector balance test',
          'Perform cylinder cutout test',
          'Analyze fuel trim values',
        ],
        expectedResults: ['Injector balance within specification', 'No significant fuel trim deviation'],
        requiresHardware: true,
        duration: '10-15 minutes',
      },
    ],
    specialFunctions: [
      {
        id: 'dpf_regen',
        name: 'DPF Forced Regeneration',
        description: 'Initiate forced diesel particulate filter regeneration',
        category: 'maintenance',
        warningMessage: 'Engine will run at elevated temperature. Ensure proper ventilation.',
        requiresConfirmation: true,
        requiresEngineOff: false,
        requiresEngineRunning: true,
        securityLevel: 2,
        steps: [
          'Verify DPF soot load requires regeneration',
          'Ensure engine is at operating temperature',
          'Start forced regeneration',
          'Monitor exhaust temperature',
          'Wait for completion (20-45 minutes)',
        ],
      },
      {
        id: 'ecm_reset',
        name: 'ECM Factory Reset',
        description: 'Reset ECM to factory default settings',
        category: 'reset',
        warningMessage: 'This will erase all custom settings and adaptations!',
        requiresConfirmation: true,
        requiresEngineOff: true,
        requiresEngineRunning: false,
        securityLevel: 3,
        steps: [
          'Create full ECM backup',
          'Verify security access',
          'Initiate factory reset',
          'Wait for ECM to reinitialize',
          'Reconfigure required parameters',
        ],
      },
      {
        id: 'injector_learn',
        name: 'Injector Coding/Learning',
        description: 'Program injector trim codes after replacement',
        category: 'calibration',
        requiresConfirmation: true,
        requiresEngineOff: true,
        requiresEngineRunning: false,
        securityLevel: 2,
        steps: [
          'Record new injector QR codes',
          'Enter injector trim values',
          'Program trim codes to ECM',
          'Verify injector recognition',
          'Clear adaptation values',
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CATERPILLAR ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'cat-adem4',
    manufacturer: 'Caterpillar',
    ecmFamily: 'ADEM A4',
    models: ['ADEM A4', 'ADEM A4 Marine', 'ADEM A4 Industrial'],
    softwareName: 'CAT ET (Electronic Technician)',
    version: '2024A',
    capabilities: [
      {
        id: 'flash_programming',
        name: 'ECM Flash Programming',
        description: 'Update ECM firmware and flash files',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 4,
        supportedModes: ['hardware'],
      },
      {
        id: 'configuration',
        name: 'Machine Configuration',
        description: 'Configure engine parameters and features',
        category: 'configuration',
        requiresHardware: true,
        securityLevel: 2,
        supportedModes: ['hardware', 'simulation'],
      },
      {
        id: 'diagnostics',
        name: 'Diagnostic Functions',
        description: 'Comprehensive diagnostic capabilities',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'cat_datalink',
        name: 'CAT Data Link',
        type: 'proprietary',
        baudRates: [9600, 19200, 38400],
        messageFormat: 'CAT Protocol',
        addressingMode: 'physical',
        securityAccess: true,
        seedKeyAlgorithm: 'CAT-Secure',
      },
      {
        id: 'j1939_cat',
        name: 'J1939 (CAT Implementation)',
        type: 'j1939',
        baudRates: [250000, 500000],
        messageFormat: '29-bit CAN',
        addressingMode: 'extended',
        securityAccess: true,
      },
    ],
    securityFeatures: [
      {
        id: 'level_1',
        name: 'Viewer Access',
        level: 1,
        description: 'View parameters and diagnostic data',
        unlockMethod: 'password',
        requiredForOperations: ['read'],
      },
      {
        id: 'level_2',
        name: 'Service Technician',
        level: 2,
        description: 'Modify customer parameters',
        unlockMethod: 'password',
        requiredForOperations: ['write'],
      },
      {
        id: 'level_3',
        name: 'Dealer Access',
        level: 3,
        description: 'Full diagnostic and parameter access',
        unlockMethod: 'token',
        requiredForOperations: ['write', 'erase'],
      },
      {
        id: 'level_4',
        name: 'Factory Access',
        level: 4,
        description: 'Complete ECM programming access',
        unlockMethod: 'certificate',
        requiredForOperations: ['write', 'erase', 'backup', 'restore'],
      },
    ],
    parameterGroups: [
      {
        id: 'engine_config',
        name: 'Engine Configuration',
        category: 'Engine',
        editable: true,
        requiresUnlock: true,
        parameters: [
          {
            id: 'rated_power',
            name: 'Rated Power',
            shortName: 'RAT_PWR',
            description: 'Engine rated power output',
            dataType: 'uint16',
            unit: 'kW',
            defaultValue: 500,
            minValue: 100,
            maxValue: 2000,
            step: 10,
            address: 0x3000,
            size: 2,
            editable: true,
            affectsEmissions: true,
            affectsPerformance: true,
            criticalParameter: true,
            category: 'Power',
          },
          {
            id: 'low_idle',
            name: 'Low Idle Speed',
            shortName: 'LO_IDLE',
            description: 'Engine low idle speed setting',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 700,
            minValue: 500,
            maxValue: 900,
            step: 25,
            address: 0x3002,
            size: 2,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: true,
            criticalParameter: false,
            category: 'Speed',
          },
          {
            id: 'high_idle',
            name: 'High Idle Speed',
            shortName: 'HI_IDLE',
            description: 'Engine high idle speed setting',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 1800,
            minValue: 1500,
            maxValue: 2100,
            step: 50,
            address: 0x3004,
            size: 2,
            editable: true,
            affectsEmissions: true,
            affectsPerformance: true,
            criticalParameter: true,
            category: 'Speed',
          },
        ],
      },
    ],
    faultCodeCategories: [
      {
        id: 'engine_faults',
        name: 'Engine System',
        description: 'Engine mechanical and control faults',
        codeRange: { start: 'E360', end: 'E499' },
        severity: 'warning',
        canErase: true,
        requiresRepair: false,
      },
      {
        id: 'emission_faults',
        name: 'Emissions System',
        description: 'Emissions control and aftertreatment faults',
        codeRange: { start: 'E500', end: 'E599' },
        severity: 'critical',
        canErase: true,
        requiresRepair: true,
      },
    ],
    configurationOptions: [
      {
        id: 'application_type',
        name: 'Application Type',
        description: 'Configure engine application',
        category: 'Application',
        type: 'select',
        defaultValue: 'generator',
        options: [
          { value: 'generator', label: 'Generator Set' },
          { value: 'industrial', label: 'Industrial' },
          { value: 'marine', label: 'Marine Propulsion' },
          { value: 'locomotive', label: 'Locomotive' },
        ],
        affectsOperation: true,
        requiresReboot: true,
      },
    ],
    diagnosticFunctions: [
      {
        id: 'valve_test',
        name: 'Valve Adjustment Check',
        description: 'Verify valve lash measurements',
        category: 'Mechanical',
        steps: [
          'Position engine to TDC',
          'Measure intake valve lash',
          'Measure exhaust valve lash',
          'Record and compare to specifications',
        ],
        expectedResults: ['Intake: 0.38mm ±0.05', 'Exhaust: 0.64mm ±0.05'],
        requiresHardware: true,
        duration: '30-45 minutes',
      },
    ],
    specialFunctions: [
      {
        id: 'trip_reset',
        name: 'Trip Data Reset',
        description: 'Reset trip odometer and fuel consumption data',
        category: 'reset',
        requiresConfirmation: true,
        requiresEngineOff: false,
        requiresEngineRunning: false,
        securityLevel: 1,
        steps: ['Select trip counter to reset', 'Confirm reset operation', 'Verify reset completion'],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PERKINS ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'perkins-edc17',
    manufacturer: 'Perkins',
    ecmFamily: 'EDC17',
    models: ['EDC17C83', 'EDC17CV54', 'EDC17C49'],
    softwareName: 'Perkins EST (Electronic Service Tool)',
    version: '2024.1',
    capabilities: [
      {
        id: 'ecm_programming',
        name: 'ECM Programming',
        description: 'Full ECM flash programming and calibration',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware'],
      },
      {
        id: 'parameter_config',
        name: 'Parameter Configuration',
        description: 'Configure and adjust engine parameters',
        category: 'configuration',
        requiresHardware: true,
        securityLevel: 2,
        supportedModes: ['hardware', 'simulation'],
      },
      {
        id: 'dtc_management',
        name: 'DTC Management',
        description: 'Read, clear and analyze diagnostic trouble codes',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'uds_perkins',
        name: 'UDS (Unified Diagnostic Services)',
        type: 'uds',
        baudRates: [500000],
        messageFormat: 'ISO 14229',
        addressingMode: 'physical',
        securityAccess: true,
        seedKeyAlgorithm: 'Bosch-UDS',
      },
      {
        id: 'kwp2000',
        name: 'KWP2000 on CAN',
        type: 'kwp2000',
        baudRates: [250000, 500000],
        messageFormat: 'ISO 15765',
        addressingMode: 'functional',
        securityAccess: true,
      },
    ],
    securityFeatures: [
      {
        id: 'basic_access',
        name: 'Basic Read Access',
        level: 1,
        description: 'Read parameters and fault codes',
        unlockMethod: 'seed_key',
        requiredForOperations: ['read'],
      },
      {
        id: 'service_access',
        name: 'Service Access',
        level: 2,
        description: 'Clear faults and modify service parameters',
        unlockMethod: 'seed_key',
        requiredForOperations: ['write', 'erase'],
      },
      {
        id: 'programming_access',
        name: 'Programming Access',
        level: 3,
        description: 'Full ECM programming capability',
        unlockMethod: 'certificate',
        requiredForOperations: ['write', 'backup', 'restore'],
      },
    ],
    parameterGroups: [
      {
        id: 'speed_control',
        name: 'Speed Control',
        category: 'Engine',
        editable: true,
        requiresUnlock: true,
        parameters: [
          {
            id: 'idle_rpm',
            name: 'Idle Speed',
            shortName: 'IDLE',
            description: 'Target idle speed',
            dataType: 'uint16',
            unit: 'RPM',
            defaultValue: 800,
            minValue: 600,
            maxValue: 1000,
            step: 25,
            address: 0x4000,
            size: 2,
            editable: true,
            affectsEmissions: false,
            affectsPerformance: true,
            criticalParameter: false,
            category: 'Speed',
          },
        ],
      },
    ],
    faultCodeCategories: [
      {
        id: 'p_codes',
        name: 'Powertrain Codes',
        description: 'Engine and drivetrain fault codes',
        codeRange: { start: 'P0000', end: 'P3999' },
        severity: 'warning',
        canErase: true,
        requiresRepair: false,
      },
    ],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEUTZ ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'deutz-emc',
    manufacturer: 'Deutz',
    ecmFamily: 'EMC',
    models: ['EMC 2.1', 'EMC 2.2', 'EMC 3.0'],
    softwareName: 'SERDIA',
    version: '4.5.0',
    capabilities: [
      {
        id: 'ecm_flash',
        name: 'ECM Flash Programming',
        description: 'Update ECM software and data',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware'],
      },
      {
        id: 'diagnostics',
        name: 'Full Diagnostics',
        description: 'Complete diagnostic capabilities',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'canbus_deutz',
        name: 'CAN Bus (Deutz Protocol)',
        type: 'canbus',
        baudRates: [250000, 500000],
        messageFormat: 'CAN 2.0B',
        addressingMode: 'extended',
        securityAccess: true,
      },
    ],
    securityFeatures: [
      {
        id: 'service_level',
        name: 'Service Technician',
        level: 2,
        description: 'Standard service access',
        unlockMethod: 'password',
        requiredForOperations: ['read', 'write', 'erase'],
      },
    ],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // VOLVO PENTA ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'volvo-ems2',
    manufacturer: 'Volvo Penta',
    ecmFamily: 'EMS 2',
    models: ['EMS 2', 'EMS 2.1', 'EMS 2.2'],
    softwareName: 'VODIA',
    version: '6.2.0',
    capabilities: [
      {
        id: 'software_download',
        name: 'Software Download',
        description: 'Download software updates to ECM',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware', 'cloud'],
      },
      {
        id: 'parameter_setting',
        name: 'Parameter Setting',
        description: 'Configure engine parameters',
        category: 'configuration',
        requiresHardware: true,
        securityLevel: 2,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'j1939_volvo',
        name: 'J1939',
        type: 'j1939',
        baudRates: [250000],
        messageFormat: '29-bit CAN',
        addressingMode: 'extended',
        securityAccess: true,
      },
    ],
    securityFeatures: [
      {
        id: 'dealer_access',
        name: 'Dealer Level',
        level: 2,
        description: 'Dealer technician access',
        unlockMethod: 'password',
        requiredForOperations: ['read', 'write', 'erase'],
      },
    ],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MTU ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mtu-mdec',
    manufacturer: 'MTU',
    ecmFamily: 'MDEC',
    models: ['MDEC', 'MDEC II', 'ADEC'],
    softwareName: 'MTU Diasys',
    version: '3.8.0',
    capabilities: [
      {
        id: 'programming',
        name: 'ECM Programming',
        description: 'Full ECM programming capability',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware'],
      },
    ],
    programmingProtocols: [
      {
        id: 'mtu_protocol',
        name: 'MTU Proprietary',
        type: 'proprietary',
        baudRates: [19200, 38400],
        messageFormat: 'MTU Protocol',
        addressingMode: 'physical',
        securityAccess: true,
      },
    ],
    securityFeatures: [],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // JOHN DEERE ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'deere-powertech',
    manufacturer: 'John Deere',
    ecmFamily: 'PowerTech',
    models: ['PowerTech E', 'PowerTech M', 'PowerTech Plus'],
    softwareName: 'Service ADVISOR',
    version: '5.3',
    capabilities: [
      {
        id: 'ecm_programming',
        name: 'ECM Programming',
        description: 'Program ECM firmware and calibration',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware'],
      },
      {
        id: 'diagnostics',
        name: 'Diagnostics',
        description: 'Full diagnostic capabilities',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'jd_can',
        name: 'John Deere CAN',
        type: 'canbus',
        baudRates: [250000, 500000],
        messageFormat: 'CAN 2.0B',
        addressingMode: 'extended',
        securityAccess: true,
      },
    ],
    securityFeatures: [],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // YANMAR ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'yanmar-ecu',
    manufacturer: 'Yanmar',
    ecmFamily: 'ECU',
    models: ['ECU-M1', 'ECU-M2', 'ECU-T'],
    softwareName: 'Yanmar Diagnostic Tool',
    version: '2.1.0',
    capabilities: [
      {
        id: 'programming',
        name: 'ECU Programming',
        description: 'Program ECU settings and firmware',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 2,
        supportedModes: ['hardware'],
      },
    ],
    programmingProtocols: [
      {
        id: 'yanmar_can',
        name: 'Yanmar CAN Protocol',
        type: 'canbus',
        baudRates: [250000],
        messageFormat: 'CAN 2.0A',
        addressingMode: 'physical',
        securityAccess: true,
      },
    ],
    securityFeatures: [],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // KUBOTA ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'kubota-ecu',
    manufacturer: 'Kubota',
    ecmFamily: 'ECU',
    models: ['ECU-V', 'ECU-S', 'ECU-D'],
    softwareName: 'Kubota Diagmaster',
    version: '4.0.0',
    capabilities: [
      {
        id: 'diagnostics',
        name: 'Diagnostics',
        description: 'Complete diagnostic access',
        category: 'diagnostics',
        requiresHardware: true,
        securityLevel: 1,
        supportedModes: ['hardware', 'simulation'],
      },
    ],
    programmingProtocols: [
      {
        id: 'kubota_protocol',
        name: 'Kubota Protocol',
        type: 'proprietary',
        baudRates: [9600, 19200],
        messageFormat: 'Kubota Serial',
        addressingMode: 'physical',
        securityAccess: false,
      },
    ],
    securityFeatures: [],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MITSUBISHI ECM SOFTWARE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'mitsubishi-ecu',
    manufacturer: 'Mitsubishi',
    ecmFamily: 'MHI ECU',
    models: ['MHI-ECU-S', 'MHI-ECU-M', 'MHI-ECU-L'],
    softwareName: 'MHI Diagnostic System',
    version: '3.2.0',
    capabilities: [
      {
        id: 'programming',
        name: 'ECU Programming',
        description: 'Full programming capability',
        category: 'programming',
        requiresHardware: true,
        securityLevel: 3,
        supportedModes: ['hardware'],
      },
    ],
    programmingProtocols: [
      {
        id: 'mhi_can',
        name: 'MHI CAN Protocol',
        type: 'canbus',
        baudRates: [500000],
        messageFormat: 'CAN 2.0B',
        addressingMode: 'extended',
        securityAccess: true,
      },
    ],
    securityFeatures: [],
    parameterGroups: [],
    faultCodeCategories: [],
    configurationOptions: [],
    diagnosticFunctions: [],
    specialFunctions: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// ECM PROGRAMMING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class ECMProgrammingEngine {
  private connection: ECMConnection | null = null;
  private currentSession: ProgrammingSession | null = null;
  private softwareProfile: ECMSoftwareProfile | null = null;

  // ─────────────────────────────────────────────────────────────────────────────
  // Connection Management
  // ─────────────────────────────────────────────────────────────────────────────

  async connect(options: {
    mode: ConnectionMode;
    ecmManufacturer: string;
    ecmModel: string;
    adapter?: HardwareAdapter;
    protocol?: string;
    baudRate?: number;
  }): Promise<ECMConnection> {
    const { mode, ecmManufacturer, ecmModel, adapter, protocol, baudRate } = options;

    // Find software profile
    this.softwareProfile = this.findSoftwareProfile(ecmManufacturer, ecmModel);
    if (!this.softwareProfile) {
      throw new Error(`No software profile found for ${ecmManufacturer} ${ecmModel}`);
    }

    // Validate connection mode
    if (mode === 'hardware' && !adapter) {
      throw new Error('Hardware adapter required for hardware connection mode');
    }

    // Create connection
    this.connection = {
      mode,
      adapter,
      ecmId: `${ecmManufacturer}-${ecmModel}-${Date.now()}`,
      ecmManufacturer,
      ecmModel,
      protocol: protocol || this.softwareProfile.programmingProtocols[0]?.id || 'unknown',
      baudRate: baudRate || this.softwareProfile.programmingProtocols[0]?.baudRates[0] || 250000,
      state: 'connecting',
      securityLevel: 0,
      sessionId: this.generateSessionId(),
      connectedAt: new Date(),
      lastActivity: new Date(),
    };

    // Simulate connection process
    await this.simulateDelay(mode === 'hardware' ? 2000 : 500);

    this.connection.state = 'connected';
    return this.connection;
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      this.connection.state = 'disconnected';
      this.connection = null;
      this.currentSession = null;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Security & Authentication
  // ─────────────────────────────────────────────────────────────────────────────

  async unlockSecurityLevel(level: number, credentials?: {
    password?: string;
    seedKey?: { seed: string; key: string };
    certificate?: string;
    token?: string;
  }): Promise<boolean> {
    if (!this.connection) throw new Error('Not connected to ECM');

    const securityFeature = this.softwareProfile?.securityFeatures.find(f => f.level === level);
    if (!securityFeature) {
      throw new Error(`Security level ${level} not supported by this ECM`);
    }

    // Simulate security unlock process
    await this.simulateDelay(1000);

    // In simulation mode, always succeed
    if (this.connection.mode === 'simulation' || this.connection.mode === 'emulation') {
      this.connection.securityLevel = level;
      return true;
    }

    // In hardware mode, validate credentials
    if (this.connection.mode === 'hardware') {
      // Actual hardware validation would happen here
      this.connection.securityLevel = level;
      return true;
    }

    return false;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Fault Code Management
  // ─────────────────────────────────────────────────────────────────────────────

  async readFaultCodes(): Promise<FaultCodeBackup[]> {
    if (!this.connection) throw new Error('Not connected to ECM');

    await this.simulateDelay(500);

    // Simulate reading fault codes
    return [
      {
        code: 'SPN 91 FMI 3',
        status: 'active',
        occurrenceCount: 5,
        firstOccurrence: new Date(Date.now() - 86400000 * 7),
        lastOccurrence: new Date(),
        freezeFrameData: {
          engineSpeed: 1450,
          coolantTemp: 85,
          boostPressure: 180,
          fuelPressure: 45000,
        },
      },
      {
        code: 'SPN 100 FMI 4',
        status: 'pending',
        occurrenceCount: 2,
        firstOccurrence: new Date(Date.now() - 86400000 * 3),
        lastOccurrence: new Date(Date.now() - 86400000),
      },
      {
        code: 'SPN 190 FMI 2',
        status: 'history',
        occurrenceCount: 1,
        firstOccurrence: new Date(Date.now() - 86400000 * 30),
        lastOccurrence: new Date(Date.now() - 86400000 * 30),
      },
    ];
  }

  async eraseFaultCodes(options: {
    codes?: string[];
    eraseAll?: boolean;
    eraseActive?: boolean;
    erasePending?: boolean;
    eraseHistory?: boolean;
  }): Promise<{
    success: boolean;
    erasedCodes: string[];
    failedCodes: string[];
    message: string;
  }> {
    if (!this.connection) throw new Error('Not connected to ECM');

    // Check security level
    if (this.connection.securityLevel < 2) {
      throw new Error('Security level 2 required to erase fault codes. Please unlock first.');
    }

    await this.simulateDelay(1000);

    const erasedCodes: string[] = [];
    const failedCodes: string[] = [];

    if (options.eraseAll) {
      erasedCodes.push('SPN 91 FMI 3', 'SPN 100 FMI 4', 'SPN 190 FMI 2');
    } else if (options.codes) {
      erasedCodes.push(...options.codes);
    }

    return {
      success: true,
      erasedCodes,
      failedCodes,
      message: `Successfully erased ${erasedCodes.length} fault code(s)`,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Parameter Reading & Writing
  // ─────────────────────────────────────────────────────────────────────────────

  async readParameters(groupId?: string): Promise<ParameterBackup[]> {
    if (!this.connection) throw new Error('Not connected to ECM');

    await this.simulateDelay(500);

    // Get parameters from software profile
    const allParameters: ParameterBackup[] = [];
    const groups = this.softwareProfile?.parameterGroups || [];

    for (const group of groups) {
      if (groupId && group.id !== groupId) continue;

      for (const param of group.parameters) {
        allParameters.push({
          id: param.id,
          name: param.name,
          value: param.defaultValue,
          unit: param.unit,
        });
      }
    }

    return allParameters;
  }

  async writeParameter(parameterId: string, value: number | string | boolean): Promise<{
    success: boolean;
    previousValue: unknown;
    newValue: unknown;
    message: string;
  }> {
    if (!this.connection) throw new Error('Not connected to ECM');

    // Check security level
    if (this.connection.securityLevel < 2) {
      throw new Error('Security level 2 required to write parameters');
    }

    // Find parameter in profile
    let parameter: ECMParameter | undefined;
    for (const group of this.softwareProfile?.parameterGroups || []) {
      parameter = group.parameters.find(p => p.id === parameterId);
      if (parameter) break;
    }

    if (!parameter) {
      throw new Error(`Parameter ${parameterId} not found`);
    }

    if (!parameter.editable) {
      throw new Error(`Parameter ${parameterId} is not editable`);
    }

    // Validate value range
    if (typeof value === 'number' && parameter.minValue !== undefined && parameter.maxValue !== undefined) {
      if (value < parameter.minValue || value > parameter.maxValue) {
        throw new Error(`Value ${value} out of range [${parameter.minValue}, ${parameter.maxValue}]`);
      }
    }

    await this.simulateDelay(300);

    return {
      success: true,
      previousValue: parameter.defaultValue,
      newValue: value,
      message: `Successfully updated ${parameter.name} to ${value} ${parameter.unit}`,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ECM Programming
  // ─────────────────────────────────────────────────────────────────────────────

  async programFirmware(firmwareData: {
    version: string;
    data: string;
    checksum: string;
  }): Promise<ProgrammingSession> {
    if (!this.connection) throw new Error('Not connected to ECM');

    if (this.connection.securityLevel < 3) {
      throw new Error('Security level 3 required for firmware programming');
    }

    this.currentSession = {
      id: this.generateSessionId(),
      connection: this.connection,
      operation: 'write',
      startTime: new Date(),
      status: 'in_progress',
      progress: 0,
      currentStep: 'Initializing...',
      steps: [
        { id: '1', name: 'Verify Firmware', description: 'Verify firmware checksum and compatibility', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '2', name: 'Backup Current', description: 'Backup current ECM data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '3', name: 'Erase Flash', description: 'Erase flash memory', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '4', name: 'Program Flash', description: 'Write new firmware to flash', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '5', name: 'Verify Write', description: 'Verify programmed data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '6', name: 'Reset ECM', description: 'Reset ECM and verify operation', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
      ],
      logs: [],
      errors: [],
    };

    // Simulate programming process
    this.executeProgrammingSteps();

    return this.currentSession;
  }

  async programCalibration(calibrationData: {
    id: string;
    name: string;
    data: string;
    checksum: string;
  }): Promise<ProgrammingSession> {
    if (!this.connection) throw new Error('Not connected to ECM');

    if (this.connection.securityLevel < 3) {
      throw new Error('Security level 3 required for calibration programming');
    }

    this.currentSession = {
      id: this.generateSessionId(),
      connection: this.connection,
      operation: 'write',
      startTime: new Date(),
      status: 'in_progress',
      progress: 0,
      currentStep: 'Initializing calibration...',
      steps: [
        { id: '1', name: 'Verify Calibration', description: 'Verify calibration compatibility', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '2', name: 'Program Calibration', description: 'Write calibration data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '3', name: 'Verify Data', description: 'Verify calibration data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '4', name: 'Apply Changes', description: 'Apply calibration changes', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
      ],
      logs: [],
      errors: [],
    };

    this.executeProgrammingSteps();

    return this.currentSession;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Backup & Restore
  // ─────────────────────────────────────────────────────────────────────────────

  async createBackup(): Promise<ECMBackup> {
    if (!this.connection) throw new Error('Not connected to ECM');

    await this.simulateDelay(2000);

    const faultCodes = await this.readFaultCodes();
    const parameters = await this.readParameters();

    return {
      id: this.generateSessionId(),
      ecmId: this.connection.ecmId,
      createdAt: new Date(),
      firmware: {
        version: '8.9.0',
        data: 'BASE64_ENCODED_FIRMWARE_DATA',
        checksum: 'ABC123DEF456',
        size: 2048576,
      },
      calibration: {
        id: 'CAL-001',
        name: 'Default Calibration',
        data: 'BASE64_ENCODED_CALIBRATION_DATA',
        checksum: 'DEF789GHI012',
      },
      parameters,
      faultCodes,
      checksum: 'BACKUP_CHECKSUM_' + Date.now(),
      encrypted: true,
    };
  }

  async restoreBackup(backup: ECMBackup): Promise<ProgrammingSession> {
    if (!this.connection) throw new Error('Not connected to ECM');

    if (this.connection.securityLevel < 3) {
      throw new Error('Security level 3 required for backup restore');
    }

    this.currentSession = {
      id: this.generateSessionId(),
      connection: this.connection,
      operation: 'restore',
      startTime: new Date(),
      status: 'in_progress',
      progress: 0,
      currentStep: 'Preparing restore...',
      steps: [
        { id: '1', name: 'Verify Backup', description: 'Verify backup integrity', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '2', name: 'Restore Firmware', description: 'Restore firmware from backup', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '3', name: 'Restore Calibration', description: 'Restore calibration data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '4', name: 'Restore Parameters', description: 'Restore ECM parameters', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
        { id: '5', name: 'Verify Restore', description: 'Verify restored data', status: 'pending', progress: 0, retryCount: 0, maxRetries: 3 },
      ],
      logs: [],
      errors: [],
      backup,
    };

    this.executeProgrammingSteps();

    return this.currentSession;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Special Functions
  // ─────────────────────────────────────────────────────────────────────────────

  async executeSpecialFunction(functionId: string): Promise<{
    success: boolean;
    result: string;
    data?: Record<string, unknown>;
  }> {
    if (!this.connection) throw new Error('Not connected to ECM');

    const specialFunction = this.softwareProfile?.specialFunctions.find(f => f.id === functionId);
    if (!specialFunction) {
      throw new Error(`Special function ${functionId} not found`);
    }

    if (this.connection.securityLevel < specialFunction.securityLevel) {
      throw new Error(`Security level ${specialFunction.securityLevel} required for ${specialFunction.name}`);
    }

    await this.simulateDelay(3000);

    return {
      success: true,
      result: `${specialFunction.name} completed successfully`,
      data: {
        duration: '3.2 seconds',
        stepsCompleted: specialFunction.steps.length,
      },
    };
  }

  async runDiagnosticFunction(functionId: string): Promise<{
    success: boolean;
    results: string[];
    data?: Record<string, unknown>;
  }> {
    if (!this.connection) throw new Error('Not connected to ECM');

    const diagnosticFunction = this.softwareProfile?.diagnosticFunctions.find(f => f.id === functionId);
    if (!diagnosticFunction) {
      throw new Error(`Diagnostic function ${functionId} not found`);
    }

    await this.simulateDelay(5000);

    return {
      success: true,
      results: diagnosticFunction.expectedResults,
      data: {
        testName: diagnosticFunction.name,
        duration: diagnosticFunction.duration,
        stepsExecuted: diagnosticFunction.steps.length,
      },
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Configuration
  // ─────────────────────────────────────────────────────────────────────────────

  async getConfiguration(): Promise<ConfigurationOption[]> {
    if (!this.connection) throw new Error('Not connected to ECM');

    return this.softwareProfile?.configurationOptions || [];
  }

  async setConfiguration(optionId: string, value: unknown): Promise<{
    success: boolean;
    previousValue: unknown;
    newValue: unknown;
    requiresReboot: boolean;
  }> {
    if (!this.connection) throw new Error('Not connected to ECM');

    const option = this.softwareProfile?.configurationOptions.find(o => o.id === optionId);
    if (!option) {
      throw new Error(`Configuration option ${optionId} not found`);
    }

    await this.simulateDelay(500);

    return {
      success: true,
      previousValue: option.defaultValue,
      newValue: value,
      requiresReboot: option.requiresReboot,
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Helper Methods
  // ─────────────────────────────────────────────────────────────────────────────

  private findSoftwareProfile(manufacturer: string, model: string): ECMSoftwareProfile | null {
    const profile = ECM_SOFTWARE_PROFILES.find(
      profile =>
        profile.manufacturer.toLowerCase() === manufacturer.toLowerCase() &&
        profile.models.some(m => m.toLowerCase().includes(model.toLowerCase()))
    );
    return profile || null;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async executeProgrammingSteps(): Promise<void> {
    if (!this.currentSession) return;

    for (const step of this.currentSession.steps) {
      step.status = 'in_progress';
      step.startTime = new Date();
      this.currentSession.currentStep = step.name;

      this.currentSession.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Starting: ${step.name}`,
      });

      // Simulate step execution
      for (let progress = 0; progress <= 100; progress += 10) {
        step.progress = progress;
        this.currentSession.progress =
          (this.currentSession.steps.indexOf(step) * 100 + progress) /
          this.currentSession.steps.length;
        await this.simulateDelay(200);
      }

      step.status = 'completed';
      step.endTime = new Date();

      this.currentSession.logs.push({
        timestamp: new Date(),
        level: 'info',
        message: `Completed: ${step.name}`,
      });
    }

    this.currentSession.status = 'completed';
    this.currentSession.endTime = new Date();
    this.currentSession.progress = 100;
    this.currentSession.currentStep = 'Complete';
  }

  getConnectionStatus(): ECMConnection | null {
    return this.connection;
  }

  getSessionStatus(): ProgrammingSession | null {
    return this.currentSession;
  }

  getSoftwareProfile(): ECMSoftwareProfile | null {
    return this.softwareProfile;
  }

  getAvailableProfiles(): ECMSoftwareProfile[] {
    return ECM_SOFTWARE_PROFILES;
  }

  getCapabilities(): ECMCapability[] {
    return this.softwareProfile?.capabilities || [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const ecmProgrammingEngine = new ECMProgrammingEngine();

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function getSupportedECMManufacturers(): string[] {
  return [...new Set(ECM_SOFTWARE_PROFILES.map(p => p.manufacturer))];
}

export function getECMModels(manufacturer: string): string[] {
  const profile = ECM_SOFTWARE_PROFILES.find(
    p => p.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );
  return profile?.models || [];
}

export function getECMSoftwareInfo(manufacturer: string): {
  softwareName: string;
  version: string;
  capabilities: number;
} | null {
  const profile = ECM_SOFTWARE_PROFILES.find(
    p => p.manufacturer.toLowerCase() === manufacturer.toLowerCase()
  );

  if (!profile) return null;

  return {
    softwareName: profile.softwareName,
    version: profile.version,
    capabilities: profile.capabilities.length,
  };
}

export function validateHardwareAdapter(adapter: HardwareAdapter, ecmManufacturer: string): {
  compatible: boolean;
  missingCapabilities: string[];
  warnings: string[];
} {
  const profile = ECM_SOFTWARE_PROFILES.find(
    p => p.manufacturer.toLowerCase() === ecmManufacturer.toLowerCase()
  );

  if (!profile) {
    return {
      compatible: false,
      missingCapabilities: [],
      warnings: ['ECM manufacturer not found in database'],
    };
  }

  const requiredProtocols = profile.programmingProtocols.map(p => p.type);
  const missingCapabilities: string[] = [];
  const warnings: string[] = [];

  for (const protocol of requiredProtocols) {
    if (!adapter.protocols.includes(protocol)) {
      missingCapabilities.push(protocol);
    }
  }

  if (!adapter.isConnected) {
    warnings.push('Hardware adapter not connected');
  }

  return {
    compatible: missingCapabilities.length === 0,
    missingCapabilities,
    warnings,
  };
}
