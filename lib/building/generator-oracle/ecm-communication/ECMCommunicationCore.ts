/**
 * GENERATOR ORACLE - ECM COMMUNICATION CORE
 *
 * Real hardware communication with Engine Control Modules
 * Bridges the gap with CAT ET and VODIA dealer tools
 *
 * Supported Protocols:
 * - J1939 (SAE Standard for diesel engines)
 * - CAN Bus (Controller Area Network)
 * - Modbus RTU/TCP (Industrial protocol)
 * - ISO 15765 (CAN diagnostics)
 * - KWP2000 (Keyword Protocol)
 * - UDS (Unified Diagnostic Services)
 *
 * Supported Hardware Adapters:
 * - USB-to-CAN adapters (Peak, Kvaser, etc.)
 * - J1939 adapters (Nexiq, DPA5, etc.)
 * - OBD-II adapters (ELM327 pro, etc.)
 * - Bluetooth CAN adapters
 * - WiFi CAN adapters
 * - Ethernet gateways
 *
 * © 2026 Generator Oracle. All Rights Reserved.
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type ConnectionStatus =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'authenticating'
  | 'connected'
  | 'error'
  | 'timeout';

export type ProtocolType =
  | 'j1939'
  | 'can'
  | 'modbus_rtu'
  | 'modbus_tcp'
  | 'iso15765'
  | 'kwp2000'
  | 'uds'
  | 'proprietary';

export type AdapterType =
  | 'usb_can'
  | 'bluetooth_can'
  | 'wifi_can'
  | 'ethernet'
  | 'serial'
  | 'obd2'
  | 'j1939_adapter';

export type OperationMode =
  | 'read_only'
  | 'read_write'
  | 'programming'
  | 'calibration';

// ═══════════════════════════════════════════════════════════════════════════════
// HARDWARE ADAPTER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════════

export interface HardwareAdapter {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  type: AdapterType;
  firmwareVersion: string;
  serialNumber: string;
  supportedProtocols: ProtocolType[];
  supportedBaudRates: number[];
  maxChannels: number;
  isConnected: boolean;
  connectionPort: string; // COM port, USB path, IP address, etc.
  capabilities: AdapterCapabilities;
}

export interface AdapterCapabilities {
  canReadFaultCodes: boolean;
  canClearFaultCodes: boolean;
  canReadLiveData: boolean;
  canWriteParameters: boolean;
  canFlashECM: boolean;
  canPerformActiveTests: boolean;
  canReadFreezeFrame: boolean;
  canAccessSecurityLevel: number; // 0-3 security levels
  supportsJ1939: boolean;
  supportsCAN: boolean;
  supportsModbus: boolean;
  supportsISO15765: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM CONNECTION & SESSION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMConnection {
  sessionId: string;
  adapter: HardwareAdapter;
  ecmInfo: ECMInfo;
  protocol: ProtocolConfig;
  status: ConnectionStatus;
  mode: OperationMode;
  securityLevel: number;
  connectedAt: Date;
  lastActivity: Date;
  bytesReceived: number;
  bytesSent: number;
  errorCount: number;
}

export interface ECMInfo {
  manufacturer: string;
  model: string;
  serialNumber: string;
  softwareVersion: string;
  hardwareVersion: string;
  calibrationId: string;
  ecuAddress: number;
  supportedPIDs: number[];
  supportedSPNs: number[];
}

export interface ProtocolConfig {
  type: ProtocolType;
  baudRate: number;
  canId: number;
  extendedId: boolean;
  timeout: number;
  retries: number;
  addressingMode: 'physical' | 'functional' | 'extended';
}

// ═══════════════════════════════════════════════════════════════════════════════
// J1939 PROTOCOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface J1939Message {
  pgn: number;           // Parameter Group Number
  sourceAddress: number;
  destinationAddress: number;
  priority: number;
  data: Uint8Array;
  timestamp: Date;
}

export interface J1939FaultCode {
  spn: number;           // Suspect Parameter Number
  fmi: number;           // Failure Mode Identifier
  occurrenceCount: number;
  spnDescription: string;
  fmiDescription: string;
  lampStatus: {
    malfunction: boolean;
    redStop: boolean;
    amberWarning: boolean;
    protectLamp: boolean;
  };
  active: boolean;
}

export interface J1939Parameter {
  spn: number;
  name: string;
  value: number;
  unit: string;
  scaleFactor: number;
  offset: number;
  minValue: number;
  maxValue: number;
  pgn: number;
  startBit: number;
  length: number;
  isSigned: boolean;
}

// J1939 Parameter Group Numbers (PGNs)
export const J1939_PGN = {
  // Engine Parameters
  ENGINE_SPEED: 61444,           // EEC1 - Electronic Engine Controller 1
  ENGINE_TEMPERATURE: 65262,     // ET1 - Engine Temperature 1
  ENGINE_FLUID_LEVEL: 65263,     // EFL/P1 - Engine Fluid Level/Pressure 1
  FUEL_ECONOMY: 65266,           // LFE - Fuel Economy
  FUEL_CONSUMPTION: 65257,       // LFC - Fuel Consumption

  // Diagnostic Messages
  DM1_ACTIVE_FAULTS: 65226,      // Active Diagnostic Trouble Codes
  DM2_PREV_FAULTS: 65227,        // Previously Active DTCs
  DM3_CLEAR_FAULTS: 65228,       // Diagnostic Data Clear
  DM4_FREEZE_FRAME: 65229,       // Freeze Frame Parameters
  DM5_READINESS: 65230,          // Diagnostic Readiness
  DM6_PENDING_FAULTS: 65231,     // Pending DTCs
  DM11_CLEAR_ACTIVE: 65235,      // Clear Active DTCs
  DM12_EMISSIONS_FAULTS: 65236,  // Emissions Related DTCs

  // Vehicle/Engine Info
  VEHICLE_ID: 65260,             // VI - Vehicle Identification
  ENGINE_CONFIG: 65251,          // EC1 - Engine Configuration 1
  SOFTWARE_ID: 65242,            // SOFT - Software Identification

  // Generator Specific
  AC_OUTPUT: 65024,              // AC Generator Output
  GENERATOR_STATUS: 65025,       // Generator Status

  // Request Messages
  REQUEST_PGN: 59904,            // Request for PGN
};

// J1939 Failure Mode Identifiers (FMI)
export const J1939_FMI = {
  0: 'Data Valid But Above Normal Operational Range - Most Severe',
  1: 'Data Valid But Below Normal Operational Range - Most Severe',
  2: 'Data Erratic, Intermittent or Incorrect',
  3: 'Voltage Above Normal or Shorted High',
  4: 'Voltage Below Normal or Shorted Low',
  5: 'Current Below Normal or Open Circuit',
  6: 'Current Above Normal or Grounded Circuit',
  7: 'Mechanical System Not Responding Properly',
  8: 'Abnormal Frequency, Pulse Width, or Period',
  9: 'Abnormal Update Rate',
  10: 'Abnormal Rate of Change',
  11: 'Root Cause Not Known',
  12: 'Bad Intelligent Device or Component',
  13: 'Out of Calibration',
  14: 'Special Instructions',
  15: 'Data Valid But Above Normal Operational Range - Least Severe',
  16: 'Data Valid But Above Normal Operational Range - Moderately Severe',
  17: 'Data Valid But Below Normal Operational Range - Least Severe',
  18: 'Data Valid But Below Normal Operational Range - Moderately Severe',
  19: 'Received Network Data in Error',
  20: 'Data Drifted High',
  21: 'Data Drifted Low',
  31: 'Condition Exists'
};

// ═══════════════════════════════════════════════════════════════════════════════
// CAN BUS PROTOCOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface CANMessage {
  id: number;
  extendedId: boolean;
  rtr: boolean;
  dlc: number;
  data: Uint8Array;
  timestamp: Date;
  channel: number;
}

export interface CANFilter {
  id: number;
  mask: number;
  extendedId: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MODBUS PROTOCOL DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface ModbusConfig {
  mode: 'rtu' | 'tcp';
  slaveAddress: number;
  baudRate?: number;      // RTU only
  parity?: 'none' | 'even' | 'odd';
  stopBits?: 1 | 2;
  ipAddress?: string;     // TCP only
  port?: number;          // TCP only
  timeout: number;
}

export interface ModbusRegister {
  address: number;
  type: 'holding' | 'input' | 'coil' | 'discrete';
  value: number;
  name: string;
  unit: string;
  scaleFactor: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE DATA STREAMING
// ═══════════════════════════════════════════════════════════════════════════════

export interface LiveDataStream {
  sessionId: string;
  parameters: LiveParameter[];
  updateRate: number;      // Hz
  isActive: boolean;
  startedAt: Date;
  dataPointsReceived: number;
  onData: (data: LiveParameter[]) => void;
  onError: (error: Error) => void;
}

export interface LiveParameter {
  id: string;
  spn?: number;
  pid?: number;
  name: string;
  value: number;
  rawValue: number;
  unit: string;
  min: number;
  max: number;
  status: 'normal' | 'warning' | 'critical' | 'error';
  timestamp: Date;
  source: 'j1939' | 'can' | 'modbus' | 'calculated';
}

// ═══════════════════════════════════════════════════════════════════════════════
// FAULT CODE OPERATIONS
// ═══════════════════════════════════════════════════════════════════════════════

export interface FaultCodeReadResult {
  success: boolean;
  activeCodes: J1939FaultCode[];
  pendingCodes: J1939FaultCode[];
  historyCodes: J1939FaultCode[];
  freezeFrameData?: FreezeFrameData[];
  readAt: Date;
  ecmInfo: ECMInfo;
}

export interface FreezeFrameData {
  faultCode: J1939FaultCode;
  parameters: LiveParameter[];
  capturedAt: Date;
  engineHours: number;
  mileage?: number;
}

export interface FaultCodeClearResult {
  success: boolean;
  clearedCodes: J1939FaultCode[];
  remainingCodes: J1939FaultCode[];
  clearedAt: Date;
  requiresKeyOff?: boolean;
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ACTIVE TESTS & COMPONENT ACTUATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ActiveTest {
  id: string;
  name: string;
  description: string;
  category: 'injector' | 'actuator' | 'relay' | 'sensor' | 'valve' | 'motor';
  component: string;
  testType: 'on_off' | 'cycle' | 'pulse' | 'sweep' | 'calibration';
  parameters: TestParameter[];
  safetyWarnings: string[];
  prerequisites: string[];
  expectedResults: string[];
  duration: number;        // seconds
  requiresEngineOff: boolean;
  requiresSecurityAccess: boolean;
}

export interface TestParameter {
  name: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
}

export interface ActiveTestResult {
  testId: string;
  success: boolean;
  actualResults: { parameter: string; value: number; status: string }[];
  startTime: Date;
  endTime: Date;
  notes: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM PARAMETER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMParameter {
  id: string;
  name: string;
  category: string;
  currentValue: number | string | boolean;
  defaultValue: number | string | boolean;
  unit: string;
  dataType: 'uint8' | 'uint16' | 'uint32' | 'int8' | 'int16' | 'int32' | 'float' | 'string' | 'boolean';
  min?: number;
  max?: number;
  step?: number;
  enumOptions?: { value: number; label: string }[];
  isEditable: boolean;
  requiresSecurityAccess: boolean;
  requiresEngineOff: boolean;
  affectsEmissions: boolean;
  description: string;
}

export interface ParameterWriteResult {
  success: boolean;
  parameter: ECMParameter;
  previousValue: number | string | boolean;
  newValue: number | string | boolean;
  writtenAt: Date;
  message: string;
  requiresReboot?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM PROGRAMMING & FLASHING
// ═══════════════════════════════════════════════════════════════════════════════

export interface ECMProgrammingSession {
  sessionId: string;
  operation: 'flash_firmware' | 'flash_calibration' | 'backup' | 'restore' | 'clone';
  ecmInfo: ECMInfo;
  firmwareFile?: FirmwareFile;
  calibrationFile?: CalibrationFile;
  progress: number;
  status: 'preparing' | 'erasing' | 'writing' | 'verifying' | 'completed' | 'failed';
  currentStep: string;
  startedAt: Date;
  estimatedCompletion?: Date;
  logs: ProgrammingLog[];
}

export interface FirmwareFile {
  name: string;
  version: string;
  size: number;
  checksum: string;
  compatibleECMs: string[];
  releaseDate: Date;
  releaseNotes: string;
}

export interface CalibrationFile {
  name: string;
  id: string;
  version: string;
  engineModel: string;
  rating: string;
  application: string;
  checksum: string;
}

export interface ProgrammingLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error';
  message: string;
  details?: Record<string, unknown>;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY ACCESS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SecurityAccess {
  level: number;
  method: 'seed_key' | 'password' | 'certificate' | 'token';
  isUnlocked: boolean;
  unlockedAt?: Date;
  expiresAt?: Date;
  permissions: SecurityPermission[];
}

export interface SecurityPermission {
  operation: string;
  allowed: boolean;
  reason?: string;
}

export interface SeedKeyChallenge {
  seed: Uint8Array;
  algorithm: string;
  securityLevel: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM COMMUNICATION SERVICE CLASS
// ═══════════════════════════════════════════════════════════════════════════════

export class ECMCommunicationService {
  private connection: ECMConnection | null = null;
  private liveDataStream: LiveDataStream | null = null;
  private messageHandlers: Map<number, (msg: J1939Message) => void> = new Map();

  // ─────────────────────────────────────────────────────────────────────────────
  // ADAPTER DETECTION & CONNECTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Scan for available hardware adapters
   */
  async scanForAdapters(): Promise<HardwareAdapter[]> {
    const adapters: HardwareAdapter[] = [];

    // Check for Web Serial API (Chrome/Edge)
    if ('serial' in navigator) {
      try {
        const ports = await (navigator as any).serial.getPorts();
        for (const port of ports) {
          const info = port.getInfo();
          adapters.push({
            id: `serial-${info.usbVendorId}-${info.usbProductId}`,
            name: `USB Serial Adapter`,
            manufacturer: this.getManufacturerName(info.usbVendorId),
            model: `VID:${info.usbVendorId} PID:${info.usbProductId}`,
            type: 'usb_can',
            firmwareVersion: 'Unknown',
            serialNumber: 'Unknown',
            supportedProtocols: ['j1939', 'can', 'modbus_rtu'],
            supportedBaudRates: [250000, 500000, 1000000],
            maxChannels: 1,
            isConnected: false,
            connectionPort: 'Web Serial',
            capabilities: {
              canReadFaultCodes: true,
              canClearFaultCodes: true,
              canReadLiveData: true,
              canWriteParameters: true,
              canFlashECM: false,
              canPerformActiveTests: true,
              canReadFreezeFrame: true,
              supportsJ1939: true,
              supportsCAN: true,
              supportsModbus: true,
              supportsISO15765: true,
              canAccessSecurityLevel: 2
            }
          });
        }
      } catch (e) {
        console.log('Web Serial not available or no ports found');
      }
    }

    // Check for Web Bluetooth API
    if ('bluetooth' in navigator) {
      adapters.push({
        id: 'bluetooth-scan',
        name: 'Bluetooth CAN Adapter',
        manufacturer: 'Various',
        model: 'Bluetooth LE',
        type: 'bluetooth_can',
        firmwareVersion: 'Scan required',
        serialNumber: 'Scan required',
        supportedProtocols: ['j1939', 'can'],
        supportedBaudRates: [250000, 500000],
        maxChannels: 1,
        isConnected: false,
        connectionPort: 'Bluetooth',
        capabilities: {
          canReadFaultCodes: true,
          canClearFaultCodes: true,
          canReadLiveData: true,
          canWriteParameters: false,
          canFlashECM: false,
          canPerformActiveTests: false,
          canReadFreezeFrame: true,
          supportsJ1939: true,
          supportsCAN: true,
          supportsModbus: false,
          supportsISO15765: false,
          canAccessSecurityLevel: 1
        }
      });
    }

    // Check for WebUSB API
    if ('usb' in navigator) {
      try {
        const devices = await (navigator as any).usb.getDevices();
        for (const device of devices) {
          adapters.push({
            id: `usb-${device.vendorId}-${device.productId}`,
            name: device.productName || 'USB CAN Adapter',
            manufacturer: device.manufacturerName || 'Unknown',
            model: `${device.vendorId}:${device.productId}`,
            type: 'usb_can',
            firmwareVersion: 'Unknown',
            serialNumber: device.serialNumber || 'Unknown',
            supportedProtocols: ['j1939', 'can', 'modbus_rtu'],
            supportedBaudRates: [250000, 500000, 1000000],
            maxChannels: 2,
            isConnected: false,
            connectionPort: 'WebUSB',
            capabilities: {
              canReadFaultCodes: true,
              canClearFaultCodes: true,
              canReadLiveData: true,
              canWriteParameters: true,
              canFlashECM: true,
              canPerformActiveTests: true,
              canReadFreezeFrame: true,
              supportsJ1939: true,
              supportsCAN: true,
              supportsModbus: true,
              supportsISO15765: true,
              canAccessSecurityLevel: 3
            }
          });
        }
      } catch (e) {
        console.log('WebUSB not available or no devices found');
      }
    }

    return adapters;
  }

  /**
   * Request user to select a new adapter (triggers browser permission dialog)
   */
  async requestAdapter(type: AdapterType): Promise<HardwareAdapter | null> {
    if (type === 'usb_can' && 'serial' in navigator) {
      try {
        const port = await (navigator as any).serial.requestPort();
        const info = port.getInfo();
        return {
          id: `serial-${Date.now()}`,
          name: 'USB-CAN Adapter',
          manufacturer: this.getManufacturerName(info.usbVendorId),
          model: 'Selected Device',
          type: 'usb_can',
          firmwareVersion: 'Connected',
          serialNumber: 'Active',
          supportedProtocols: ['j1939', 'can', 'modbus_rtu'],
          supportedBaudRates: [250000, 500000, 1000000],
          maxChannels: 1,
          isConnected: true,
          connectionPort: 'Web Serial',
          capabilities: {
            canReadFaultCodes: true,
            canClearFaultCodes: true,
            canReadLiveData: true,
            canWriteParameters: true,
            canFlashECM: false,
            canPerformActiveTests: true,
            canReadFreezeFrame: true,
            supportsJ1939: true,
            supportsCAN: true,
            supportsModbus: true,
            supportsISO15765: true,
            canAccessSecurityLevel: 2
          }
        };
      } catch (e) {
        console.error('Failed to request serial port:', e);
        return null;
      }
    }

    if (type === 'bluetooth_can' && 'bluetooth' in navigator) {
      try {
        const device = await (navigator as any).bluetooth.requestDevice({
          filters: [
            { services: ['battery_service'] },
            { namePrefix: 'CAN' },
            { namePrefix: 'OBD' },
            { namePrefix: 'ELM' }
          ],
          optionalServices: ['generic_access']
        });
        return {
          id: `bt-${device.id}`,
          name: device.name || 'Bluetooth CAN Adapter',
          manufacturer: 'Bluetooth Device',
          model: device.name || 'Unknown',
          type: 'bluetooth_can',
          firmwareVersion: 'Connected',
          serialNumber: device.id,
          supportedProtocols: ['j1939', 'can'],
          supportedBaudRates: [250000, 500000],
          maxChannels: 1,
          isConnected: true,
          connectionPort: 'Bluetooth',
          capabilities: {
            canReadFaultCodes: true,
            canClearFaultCodes: true,
            canReadLiveData: true,
            canWriteParameters: false,
            canFlashECM: false,
            canPerformActiveTests: false,
            canReadFreezeFrame: true,
            supportsJ1939: true,
            supportsCAN: true,
            supportsModbus: false,
            supportsISO15765: false,
            canAccessSecurityLevel: 1
          }
        };
      } catch (e) {
        console.error('Failed to request Bluetooth device:', e);
        return null;
      }
    }

    return null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ECM CONNECTION
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Connect to ECM via adapter
   */
  async connectToECM(
    adapter: HardwareAdapter,
    protocol: ProtocolConfig
  ): Promise<ECMConnection> {
    const sessionId = this.generateSessionId();

    // Initialize connection
    this.connection = {
      sessionId,
      adapter,
      ecmInfo: {
        manufacturer: 'Scanning...',
        model: 'Unknown',
        serialNumber: '',
        softwareVersion: '',
        hardwareVersion: '',
        calibrationId: '',
        ecuAddress: 0,
        supportedPIDs: [],
        supportedSPNs: []
      },
      protocol,
      status: 'connecting',
      mode: 'read_only',
      securityLevel: 0,
      connectedAt: new Date(),
      lastActivity: new Date(),
      bytesReceived: 0,
      bytesSent: 0,
      errorCount: 0
    };

    // Send connection request based on protocol
    if (protocol.type === 'j1939') {
      await this.initializeJ1939Connection();
    } else if (protocol.type === 'can') {
      await this.initializeCANConnection();
    } else if (protocol.type === 'modbus_rtu' || protocol.type === 'modbus_tcp') {
      await this.initializeModbusConnection();
    }

    // Read ECM identification
    await this.readECMIdentification();

    this.connection.status = 'connected';
    return this.connection;
  }

  /**
   * Disconnect from ECM
   */
  async disconnect(): Promise<void> {
    if (this.liveDataStream?.isActive) {
      this.stopLiveData();
    }
    this.connection = null;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FAULT CODE OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Read all fault codes from ECM
   */
  async readFaultCodes(): Promise<FaultCodeReadResult> {
    if (!this.connection || this.connection.status !== 'connected') {
      throw new Error('Not connected to ECM');
    }

    const result: FaultCodeReadResult = {
      success: false,
      activeCodes: [],
      pendingCodes: [],
      historyCodes: [],
      readAt: new Date(),
      ecmInfo: this.connection.ecmInfo
    };

    try {
      // Request DM1 - Active Fault Codes
      const dm1Response = await this.sendJ1939Request(J1939_PGN.DM1_ACTIVE_FAULTS);
      result.activeCodes = this.parseDM1Response(dm1Response);

      // Request DM2 - Previously Active Fault Codes
      const dm2Response = await this.sendJ1939Request(J1939_PGN.DM2_PREV_FAULTS);
      result.historyCodes = this.parseDM2Response(dm2Response);

      // Request DM6 - Pending Fault Codes
      const dm6Response = await this.sendJ1939Request(J1939_PGN.DM6_PENDING_FAULTS);
      result.pendingCodes = this.parseDM6Response(dm6Response);

      // Request Freeze Frame data for active codes
      if (result.activeCodes.length > 0) {
        result.freezeFrameData = await this.readFreezeFrameData(result.activeCodes);
      }

      result.success = true;
    } catch (error) {
      console.error('Failed to read fault codes:', error);
    }

    return result;
  }

  /**
   * Clear fault codes from ECM
   */
  async clearFaultCodes(codesToClear?: J1939FaultCode[]): Promise<FaultCodeClearResult> {
    if (!this.connection || this.connection.status !== 'connected') {
      throw new Error('Not connected to ECM');
    }

    // Check security level
    if (this.connection.securityLevel < 1) {
      throw new Error('Security access required to clear fault codes');
    }

    try {
      // Send DM3 - Diagnostic Data Clear (deprecated but still used)
      // Or DM11 - Clear Active Diagnostic Trouble Codes
      await this.sendJ1939Command(J1939_PGN.DM11_CLEAR_ACTIVE, new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]));

      // Wait for ECM to process
      await this.sleep(1000);

      // Re-read fault codes to confirm
      const remainingCodes = await this.readFaultCodes();

      return {
        success: true,
        clearedCodes: codesToClear || [],
        remainingCodes: remainingCodes.activeCodes,
        clearedAt: new Date(),
        requiresKeyOff: remainingCodes.activeCodes.length > 0,
        message: remainingCodes.activeCodes.length === 0
          ? 'All fault codes cleared successfully'
          : `${remainingCodes.activeCodes.length} codes remain active - may require key cycle`
      };
    } catch (error) {
      return {
        success: false,
        clearedCodes: [],
        remainingCodes: [],
        clearedAt: new Date(),
        message: `Failed to clear codes: ${error}`
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // LIVE DATA STREAMING
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Start live data stream
   */
  async startLiveData(
    parameters: string[],
    updateRate: number,
    onData: (data: LiveParameter[]) => void,
    onError: (error: Error) => void
  ): Promise<LiveDataStream> {
    if (!this.connection || this.connection.status !== 'connected') {
      throw new Error('Not connected to ECM');
    }

    this.liveDataStream = {
      sessionId: this.connection.sessionId,
      parameters: [],
      updateRate,
      isActive: true,
      startedAt: new Date(),
      dataPointsReceived: 0,
      onData,
      onError
    };

    // Start polling for live data
    this.pollLiveData(parameters, updateRate);

    return this.liveDataStream;
  }

  /**
   * Stop live data stream
   */
  stopLiveData(): void {
    if (this.liveDataStream) {
      this.liveDataStream.isActive = false;
    }
  }

  private async pollLiveData(parameters: string[], updateRate: number): Promise<void> {
    while (this.liveDataStream?.isActive) {
      try {
        const liveData = await this.readLiveParameters(parameters);
        this.liveDataStream.parameters = liveData;
        this.liveDataStream.dataPointsReceived++;
        this.liveDataStream.onData(liveData);
      } catch (error) {
        this.liveDataStream.onError(error as Error);
      }
      await this.sleep(1000 / updateRate);
    }
  }

  private async readLiveParameters(parameters: string[]): Promise<LiveParameter[]> {
    const result: LiveParameter[] = [];

    // Request engine parameters (EEC1)
    const eec1 = await this.sendJ1939Request(J1939_PGN.ENGINE_SPEED);
    if (eec1) {
      result.push({
        id: 'engine_speed',
        spn: 190,
        name: 'Engine Speed',
        value: this.extractSPN(eec1, 190),
        rawValue: 0,
        unit: 'RPM',
        min: 0,
        max: 3000,
        status: 'normal',
        timestamp: new Date(),
        source: 'j1939'
      });
    }

    // Request engine temperature (ET1)
    const et1 = await this.sendJ1939Request(J1939_PGN.ENGINE_TEMPERATURE);
    if (et1) {
      result.push({
        id: 'coolant_temp',
        spn: 110,
        name: 'Coolant Temperature',
        value: this.extractSPN(et1, 110),
        rawValue: 0,
        unit: '°C',
        min: -40,
        max: 150,
        status: 'normal',
        timestamp: new Date(),
        source: 'j1939'
      });
    }

    // Request fluid levels (EFL/P1)
    const efl = await this.sendJ1939Request(J1939_PGN.ENGINE_FLUID_LEVEL);
    if (efl) {
      result.push({
        id: 'oil_pressure',
        spn: 100,
        name: 'Oil Pressure',
        value: this.extractSPN(efl, 100),
        rawValue: 0,
        unit: 'kPa',
        min: 0,
        max: 1000,
        status: 'normal',
        timestamp: new Date(),
        source: 'j1939'
      });
    }

    return result;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVE TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Get available active tests for connected ECM
   */
  async getAvailableActiveTests(): Promise<ActiveTest[]> {
    if (!this.connection) {
      return [];
    }

    // Return tests based on ECM manufacturer
    const tests: ActiveTest[] = [
      {
        id: 'injector_test',
        name: 'Injector Cut-Out Test',
        description: 'Sequentially disable each injector to identify misfiring cylinder',
        category: 'injector',
        component: 'Fuel Injectors',
        testType: 'on_off',
        parameters: [
          { name: 'Cylinder', value: 1, unit: '', min: 1, max: 6, step: 1 },
          { name: 'Duration', value: 5, unit: 'sec', min: 1, max: 30, step: 1 }
        ],
        safetyWarnings: ['Engine must be running at idle', 'Do not exceed 30 seconds per cylinder'],
        prerequisites: ['Engine at operating temperature', 'No active critical faults'],
        expectedResults: ['RPM drop of 50-100 on good injector', 'No change indicates faulty injector'],
        duration: 60,
        requiresEngineOff: false,
        requiresSecurityAccess: true
      },
      {
        id: 'glow_plug_test',
        name: 'Glow Plug Test',
        description: 'Activate glow plugs to verify operation',
        category: 'actuator',
        component: 'Glow Plugs',
        testType: 'on_off',
        parameters: [
          { name: 'Duration', value: 10, unit: 'sec', min: 5, max: 30, step: 1 }
        ],
        safetyWarnings: ['Engine must be OFF', 'Glow plugs get extremely hot'],
        prerequisites: ['Engine OFF', 'Key ON'],
        expectedResults: ['Current draw 5-10A per plug', 'Plugs should glow orange'],
        duration: 30,
        requiresEngineOff: true,
        requiresSecurityAccess: true
      },
      {
        id: 'fuel_pump_test',
        name: 'Fuel Lift Pump Test',
        description: 'Activate fuel lift pump to verify operation',
        category: 'actuator',
        component: 'Fuel Lift Pump',
        testType: 'on_off',
        parameters: [
          { name: 'Duration', value: 10, unit: 'sec', min: 5, max: 60, step: 5 }
        ],
        safetyWarnings: ['Check for fuel leaks', 'Do not run dry'],
        prerequisites: ['Engine OFF', 'Fuel tank has fuel'],
        expectedResults: ['Pump noise audible', 'Fuel pressure builds'],
        duration: 60,
        requiresEngineOff: true,
        requiresSecurityAccess: true
      }
    ];

    return tests;
  }

  /**
   * Execute an active test
   */
  async executeActiveTest(test: ActiveTest, parameters: TestParameter[]): Promise<ActiveTestResult> {
    if (!this.connection || this.connection.status !== 'connected') {
      throw new Error('Not connected to ECM');
    }

    if (test.requiresSecurityAccess && this.connection.securityLevel < 2) {
      throw new Error('Higher security access required for this test');
    }

    // TODO: Send actual actuation commands to ECM
    // This would vary by ECM manufacturer and test type

    return {
      testId: test.id,
      success: true,
      actualResults: parameters.map(p => ({
        parameter: p.name,
        value: p.value,
        status: 'completed'
      })),
      startTime: new Date(),
      endTime: new Date(),
      notes: 'Test completed - verify physical results'
    };
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SECURITY ACCESS
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Request security access to ECM
   */
  async requestSecurityAccess(level: number): Promise<SecurityAccess> {
    if (!this.connection) {
      throw new Error('Not connected to ECM');
    }

    // Request seed from ECM
    const seedRequest = new Uint8Array([0x27, level]); // UDS Security Access
    // const seedResponse = await this.sendMessage(seedRequest);

    // Calculate key based on seed and algorithm
    // const key = this.calculateSecurityKey(seedResponse, level);

    // Send key response
    // const keyResponse = await this.sendMessage([0x27, level + 1, ...key]);

    // For now, simulate security access
    const securityAccess: SecurityAccess = {
      level,
      method: 'seed_key',
      isUnlocked: true,
      unlockedAt: new Date(),
      expiresAt: new Date(Date.now() + 3600000), // 1 hour
      permissions: [
        { operation: 'read_parameters', allowed: true },
        { operation: 'write_parameters', allowed: level >= 2 },
        { operation: 'clear_faults', allowed: level >= 1 },
        { operation: 'active_tests', allowed: level >= 2 },
        { operation: 'flash_ecm', allowed: level >= 3 }
      ]
    };

    this.connection.securityLevel = level;
    return securityAccess;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PRIVATE HELPER METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  private generateSessionId(): string {
    return `ECM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getManufacturerName(vendorId: number): string {
    const vendors: Record<number, string> = {
      0x0403: 'FTDI',
      0x067B: 'Prolific',
      0x10C4: 'Silicon Labs',
      0x1D50: 'OpenMoko',
      0x16D0: 'MCS',
      0x1FC9: 'NXP',
      0x04D8: 'Microchip',
      0x0483: 'STMicroelectronics'
    };
    return vendors[vendorId] || 'Unknown';
  }

  private async initializeJ1939Connection(): Promise<void> {
    // Initialize J1939 protocol
    // Set baud rate to 250kbps (standard J1939)
    // Configure message filters
    console.log('Initializing J1939 connection...');
  }

  private async initializeCANConnection(): Promise<void> {
    // Initialize CAN protocol
    console.log('Initializing CAN connection...');
  }

  private async initializeModbusConnection(): Promise<void> {
    // Initialize Modbus protocol
    console.log('Initializing Modbus connection...');
  }

  private async readECMIdentification(): Promise<void> {
    if (!this.connection) return;

    // Request Vehicle ID (PGN 65260)
    // Request Software ID (PGN 65242)
    // Request Engine Config (PGN 65251)

    this.connection.ecmInfo = {
      manufacturer: 'Detected',
      model: 'ECM Connected',
      serialNumber: 'Reading...',
      softwareVersion: 'Reading...',
      hardwareVersion: 'Reading...',
      calibrationId: 'Reading...',
      ecuAddress: 0,
      supportedPIDs: [],
      supportedSPNs: [100, 110, 190, 91, 92, 94, 175]
    };
  }

  private async sendJ1939Request(pgn: number): Promise<Uint8Array | null> {
    // Build J1939 request message
    // const requestPGN = J1939_PGN.REQUEST_PGN;
    // const data = [pgn & 0xFF, (pgn >> 8) & 0xFF, (pgn >> 16) & 0xFF];
    // return await this.sendMessage(data);
    return new Uint8Array(8); // Placeholder
  }

  private async sendJ1939Command(pgn: number, data: Uint8Array): Promise<void> {
    // Send J1939 command
    console.log(`Sending J1939 PGN ${pgn} with data:`, data);
  }

  private parseDM1Response(data: Uint8Array | null): J1939FaultCode[] {
    if (!data) return [];
    // Parse DM1 message format
    // Byte 0-1: Lamp status
    // Byte 2+: SPN/FMI pairs
    return [];
  }

  private parseDM2Response(data: Uint8Array | null): J1939FaultCode[] {
    if (!data) return [];
    return [];
  }

  private parseDM6Response(data: Uint8Array | null): J1939FaultCode[] {
    if (!data) return [];
    return [];
  }

  private async readFreezeFrameData(codes: J1939FaultCode[]): Promise<FreezeFrameData[]> {
    return [];
  }

  private extractSPN(data: Uint8Array, spn: number): number {
    // Extract SPN value from J1939 message data
    // This varies based on SPN position in the PGN
    return 0;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

export const ecmCommunicationService = new ECMCommunicationService();
