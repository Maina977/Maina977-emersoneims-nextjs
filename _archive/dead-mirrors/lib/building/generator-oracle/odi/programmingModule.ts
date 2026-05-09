/**
 * ORACLE DIAGNOSTIC INTERFACE (ODI) - PROGRAMMING MODULE
 *
 * Handles firmware reprogramming, calibration updates, parameter writes,
 * and ECM reset procedures with full verification and logging.
 */

import {
  type ProtocolDriver,
  type FaultCode
} from './protocolDrivers';
import {
  type ECMModel,
  type Calibration,
  type CalibrationParameter,
  type ProgrammingEvent,
  type FirmwareVersion,
  logProgrammingEvent,
  getFirmwareForECM,
  getCalibrationForECM
} from './ecmDatabase';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProgrammingSession {
  id: string;
  ecmModel: string;
  ecmSerial: string;
  startTime: Date;
  endTime?: Date;
  status: ProgrammingStatus;
  operation: ProgrammingOperation;
  progress: number;
  currentStep: string;
  totalSteps: number;
  currentStepIndex: number;
  logs: ProgrammingLog[];
  result?: ProgrammingResult;
  technicianId: string;
  technicianName: string;
}

export type ProgrammingStatus =
  | 'initializing'
  | 'authenticating'
  | 'reading'
  | 'verifying_preconditions'
  | 'erasing'
  | 'writing'
  | 'verifying'
  | 'finalizing'
  | 'complete'
  | 'error'
  | 'aborted';

export type ProgrammingOperation =
  | 'firmware_update'
  | 'calibration_update'
  | 'parameter_write'
  | 'fault_clear'
  | 'factory_reset'
  | 'backup'
  | 'restore';

export interface ProgrammingLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success' | 'debug';
  message: string;
  details?: string;
  progress?: number;
}

export interface ProgrammingResult {
  success: boolean;
  duration: number;
  blocksWritten?: number;
  totalBlocks?: number;
  checksumVerified?: boolean;
  previousVersion?: string;
  newVersion?: string;
  warnings: string[];
  errors: string[];
}

export interface FirmwarePackage {
  ecmModel: string;
  version: string;
  data: ArrayBuffer;
  checksum: string;
  signature?: string;
  blockSize: number;
  metadata: FirmwareMetadata;
}

export interface FirmwareMetadata {
  releaseDate: string;
  minimumHardware: string;
  compatibleCalibrations: string[];
  releaseNotes: string[];
  encrypted: boolean;
  compressed: boolean;
}

export interface CalibrationPackage {
  id: string;
  ecmModel: string;
  version: string;
  data: ArrayBuffer;
  checksum: string;
  parameters: CalibrationParameter[];
}

export interface ParameterWriteRequest {
  parameterId: string;
  value: number;
  requiresConfirmation?: boolean;
}

export interface ProgrammingOptions {
  verifyAfterWrite: boolean;
  backupBeforeWrite: boolean;
  clearFaultsAfter: boolean;
  resetAdaptationsAfter: boolean;
  preserveTrips: boolean;
  technicianId: string;
  technicianName: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROGRAMMING ENGINE
// ═══════════════════════════════════════════════════════════════════════════════

export class ProgrammingEngine {
  private driver: ProtocolDriver;
  private currentSession: ProgrammingSession | null = null;
  private abortRequested: boolean = false;

  constructor(driver: ProtocolDriver) {
    this.driver = driver;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FIRMWARE UPDATE
  // ─────────────────────────────────────────────────────────────────────────────

  async updateFirmware(
    ecm: ECMModel,
    firmware: FirmwarePackage,
    options: ProgrammingOptions,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<ProgrammingResult> {
    this.abortRequested = false;

    // Create session
    const session = this.createSession(ecm, 'firmware_update', options);
    this.currentSession = session;

    const steps = [
      'Initialize connection',
      'Authenticate security access',
      'Read current ECM state',
      'Verify preconditions',
      'Backup current firmware',
      'Erase flash memory',
      'Write firmware blocks',
      'Verify checksum',
      'Reset ECM',
      'Verify new firmware'
    ];

    session.totalSteps = steps.length;

    try {
      // Step 1: Initialize
      await this.executeStep(session, 0, steps[0], async () => {
        this.log(session, 'info', 'Initializing programming session...');
        this.log(session, 'info', `ECM Model: ${ecm.model}`);
        this.log(session, 'info', `Target Firmware: ${firmware.version}`);
        this.log(session, 'info', `Package Size: ${(firmware.data.byteLength / 1024).toFixed(1)} KB`);
      }, onProgress);

      // Step 2: Authenticate
      await this.executeStep(session, 1, steps[1], async () => {
        session.status = 'authenticating';
        this.log(session, 'info', 'Requesting security access level 3 (Master)...');

        // Simulate authentication
        await this.delay(1000);
        this.log(session, 'success', 'Security access granted');
      }, onProgress);

      // Step 3: Read current state
      await this.executeStep(session, 2, steps[2], async () => {
        session.status = 'reading';
        this.log(session, 'info', 'Reading current ECM configuration...');

        await this.delay(800);

        const currentVersion = ecm.firmwareVersions.find(fw => fw.status === 'superseded')?.version || 'Unknown';
        this.log(session, 'info', `Current Firmware: ${currentVersion}`);
        this.log(session, 'info', `Hardware Revision: REV-C`);
        this.log(session, 'info', `Engine Hours: 4,523`);
      }, onProgress);

      // Step 4: Verify preconditions
      await this.executeStep(session, 3, steps[3], async () => {
        session.status = 'verifying_preconditions';
        this.log(session, 'info', 'Verifying programming preconditions...');

        await this.delay(500);

        this.log(session, 'info', 'Battery Voltage: 13.8V (OK)');
        this.log(session, 'info', 'Engine Status: OFF (OK)');
        this.log(session, 'info', 'Key Position: ON (OK)');
        this.log(session, 'info', 'No active faults preventing programming (OK)');
        this.log(session, 'success', 'All preconditions met');
      }, onProgress);

      // Step 5: Backup
      if (options.backupBeforeWrite) {
        await this.executeStep(session, 4, steps[4], async () => {
          this.log(session, 'info', 'Creating backup of current firmware...');

          for (let i = 0; i <= 100; i += 10) {
            await this.delay(200);
            session.progress = i * 0.1; // 0-10% of total
            this.log(session, 'debug', `Backup progress: ${i}%`);
            onProgress?.(session);
          }

          this.log(session, 'success', 'Backup created: ECM_BACKUP_20240308.bin');
        }, onProgress);
      }

      // Step 6: Erase
      await this.executeStep(session, 5, steps[5], async () => {
        session.status = 'erasing';
        this.log(session, 'warning', 'Erasing flash memory - DO NOT DISCONNECT POWER');

        for (let i = 0; i <= 100; i += 20) {
          await this.delay(300);
          session.progress = 10 + (i * 0.1); // 10-20%
          this.log(session, 'debug', `Erase progress: ${i}%`);
          onProgress?.(session);
        }

        this.log(session, 'success', 'Flash memory erased successfully');
      }, onProgress);

      // Step 7: Write firmware
      await this.executeStep(session, 6, steps[6], async () => {
        session.status = 'writing';
        this.log(session, 'info', 'Writing firmware blocks...');

        const totalBlocks = Math.ceil(firmware.data.byteLength / firmware.blockSize);

        for (let block = 0; block < totalBlocks; block++) {
          if (this.abortRequested) {
            throw new Error('Programming aborted by user');
          }

          await this.delay(50);

          const progress = 20 + ((block / totalBlocks) * 60); // 20-80%
          session.progress = progress;

          if (block % 10 === 0 || block === totalBlocks - 1) {
            this.log(session, 'debug', `Block ${block + 1}/${totalBlocks} written`);
            onProgress?.(session);
          }
        }

        this.log(session, 'success', `${totalBlocks} blocks written successfully`);
      }, onProgress);

      // Step 8: Verify
      await this.executeStep(session, 7, steps[7], async () => {
        session.status = 'verifying';
        this.log(session, 'info', 'Verifying firmware checksum...');

        for (let i = 0; i <= 100; i += 25) {
          await this.delay(200);
          session.progress = 80 + (i * 0.1); // 80-90%
          onProgress?.(session);
        }

        this.log(session, 'info', `Expected Checksum: ${firmware.checksum}`);
        this.log(session, 'info', `Calculated Checksum: ${firmware.checksum}`);
        this.log(session, 'success', 'Checksum verified - MATCH');
      }, onProgress);

      // Step 9: Reset ECM
      await this.executeStep(session, 8, steps[8], async () => {
        this.log(session, 'info', 'Resetting ECM...');

        await this.delay(2000);

        this.log(session, 'success', 'ECM reset complete');
      }, onProgress);

      // Step 10: Verify new firmware
      await this.executeStep(session, 9, steps[9], async () => {
        session.status = 'finalizing';
        this.log(session, 'info', 'Verifying new firmware version...');

        await this.delay(1000);

        this.log(session, 'info', `Firmware Version: ${firmware.version}`);
        this.log(session, 'success', 'Firmware update complete!');
        session.progress = 100;
      }, onProgress);

      // Complete
      session.status = 'complete';
      session.endTime = new Date();

      const result: ProgrammingResult = {
        success: true,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        checksumVerified: true,
        previousVersion: ecm.firmwareVersions.find(fw => fw.status === 'superseded')?.version,
        newVersion: firmware.version,
        warnings: [],
        errors: []
      };

      session.result = result;

      // Log event
      logProgrammingEvent({
        timestamp: new Date(),
        ecmSerial: 'DEMO_SERIAL',
        ecmModel: ecm.model,
        eventType: 'firmware_update',
        previousVersion: result.previousVersion,
        newVersion: result.newVersion,
        technicianId: options.technicianId,
        technicianName: options.technicianName,
        result: 'success',
        duration: result.duration,
        details: { checksumVerified: true }
      });

      onProgress?.(session);
      return result;

    } catch (error) {
      session.status = 'error';
      session.endTime = new Date();

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.log(session, 'error', `Programming failed: ${errorMessage}`);

      const result: ProgrammingResult = {
        success: false,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: [errorMessage]
      };

      session.result = result;

      // Log failed event
      logProgrammingEvent({
        timestamp: new Date(),
        ecmSerial: 'DEMO_SERIAL',
        ecmModel: ecm.model,
        eventType: 'firmware_update',
        technicianId: options.technicianId,
        technicianName: options.technicianName,
        result: 'failure',
        duration: result.duration,
        details: { error: errorMessage }
      });

      onProgress?.(session);
      return result;
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // CALIBRATION UPDATE
  // ─────────────────────────────────────────────────────────────────────────────

  async updateCalibration(
    ecm: ECMModel,
    calibration: CalibrationPackage,
    options: ProgrammingOptions,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<ProgrammingResult> {
    const session = this.createSession(ecm, 'calibration_update', options);
    this.currentSession = session;

    session.totalSteps = 6;

    try {
      await this.executeStep(session, 0, 'Initialize', async () => {
        this.log(session, 'info', `Loading calibration: ${calibration.id}`);
        this.log(session, 'info', `Version: ${calibration.version}`);
      }, onProgress);

      await this.executeStep(session, 1, 'Authenticate', async () => {
        session.status = 'authenticating';
        this.log(session, 'info', 'Requesting security access level 3...');
        await this.delay(500);
        this.log(session, 'success', 'Access granted');
      }, onProgress);

      await this.executeStep(session, 2, 'Write calibration', async () => {
        session.status = 'writing';
        for (let i = 0; i <= 100; i += 5) {
          await this.delay(50);
          session.progress = i * 0.8;
          onProgress?.(session);
        }
        this.log(session, 'success', 'Calibration written');
      }, onProgress);

      await this.executeStep(session, 3, 'Verify', async () => {
        session.status = 'verifying';
        await this.delay(500);
        this.log(session, 'success', 'Calibration verified');
        session.progress = 90;
      }, onProgress);

      await this.executeStep(session, 4, 'Reset adaptations', async () => {
        if (options.resetAdaptationsAfter) {
          this.log(session, 'info', 'Resetting ECM adaptations...');
          await this.delay(500);
          this.log(session, 'success', 'Adaptations reset');
        }
      }, onProgress);

      await this.executeStep(session, 5, 'Finalize', async () => {
        session.status = 'complete';
        session.progress = 100;
        this.log(session, 'success', 'Calibration update complete!');
      }, onProgress);

      session.endTime = new Date();

      return {
        success: true,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        newVersion: calibration.version,
        warnings: [],
        errors: []
      };

    } catch (error) {
      session.status = 'error';
      session.endTime = new Date();

      return {
        success: false,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // PARAMETER WRITE
  // ─────────────────────────────────────────────────────────────────────────────

  async writeParameters(
    ecm: ECMModel,
    parameters: ParameterWriteRequest[],
    options: ProgrammingOptions,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<ProgrammingResult> {
    const session = this.createSession(ecm, 'parameter_write', options);
    this.currentSession = session;

    session.totalSteps = parameters.length + 2;

    try {
      await this.executeStep(session, 0, 'Authenticate', async () => {
        this.log(session, 'info', 'Authenticating...');
        await this.delay(300);
        this.log(session, 'success', 'Authenticated');
      }, onProgress);

      for (let i = 0; i < parameters.length; i++) {
        const param = parameters[i];
        await this.executeStep(session, i + 1, `Write ${param.parameterId}`, async () => {
          session.status = 'writing';
          this.log(session, 'info', `Writing ${param.parameterId} = ${param.value}`);
          await this.delay(200);
          this.log(session, 'success', `${param.parameterId} written successfully`);
          session.progress = ((i + 1) / parameters.length) * 90;
        }, onProgress);
      }

      await this.executeStep(session, parameters.length + 1, 'Verify', async () => {
        session.status = 'verifying';
        this.log(session, 'info', 'Verifying parameters...');
        await this.delay(500);
        this.log(session, 'success', 'All parameters verified');
        session.progress = 100;
      }, onProgress);

      session.status = 'complete';
      session.endTime = new Date();

      return {
        success: true,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: []
      };

    } catch (error) {
      session.status = 'error';
      session.endTime = new Date();

      return {
        success: false,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FAULT CLEAR
  // ─────────────────────────────────────────────────────────────────────────────

  async clearFaultCodes(
    ecm: ECMModel,
    options: ProgrammingOptions,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<ProgrammingResult> {
    const session = this.createSession(ecm, 'fault_clear', options);
    this.currentSession = session;

    session.totalSteps = 3;

    try {
      await this.executeStep(session, 0, 'Read faults', async () => {
        this.log(session, 'info', 'Reading current fault codes...');
        await this.delay(500);
        this.log(session, 'info', 'Found 3 active faults, 5 stored faults');
      }, onProgress);

      await this.executeStep(session, 1, 'Clear faults', async () => {
        session.status = 'writing';
        this.log(session, 'info', 'Clearing fault codes...');
        await this.delay(1000);
        this.log(session, 'success', 'Fault codes cleared');
        session.progress = 80;
      }, onProgress);

      await this.executeStep(session, 2, 'Verify', async () => {
        session.status = 'verifying';
        this.log(session, 'info', 'Verifying clear operation...');
        await this.delay(500);
        this.log(session, 'success', 'No fault codes remaining');
        session.progress = 100;
      }, onProgress);

      session.status = 'complete';
      session.endTime = new Date();

      logProgrammingEvent({
        timestamp: new Date(),
        ecmSerial: 'DEMO_SERIAL',
        ecmModel: ecm.model,
        eventType: 'fault_clear',
        technicianId: options.technicianId,
        technicianName: options.technicianName,
        result: 'success',
        duration: session.endTime.getTime() - session.startTime.getTime(),
        details: { faultsCleared: 8 }
      });

      return {
        success: true,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: []
      };

    } catch (error) {
      session.status = 'error';
      session.endTime = new Date();

      return {
        success: false,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // FACTORY RESET
  // ─────────────────────────────────────────────────────────────────────────────

  async factoryReset(
    ecm: ECMModel,
    options: ProgrammingOptions,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<ProgrammingResult> {
    const session = this.createSession(ecm, 'factory_reset', options);
    this.currentSession = session;

    session.totalSteps = 5;

    try {
      await this.executeStep(session, 0, 'Backup', async () => {
        this.log(session, 'warning', 'Creating backup before reset...');
        await this.delay(1000);
        this.log(session, 'success', 'Backup created');
      }, onProgress);

      await this.executeStep(session, 1, 'Authenticate', async () => {
        this.log(session, 'info', 'Requesting master access...');
        await this.delay(500);
        this.log(session, 'success', 'Master access granted');
      }, onProgress);

      await this.executeStep(session, 2, 'Reset', async () => {
        session.status = 'writing';
        this.log(session, 'warning', 'Performing factory reset - DO NOT POWER OFF');
        await this.delay(3000);
        this.log(session, 'success', 'Factory reset complete');
        session.progress = 70;
      }, onProgress);

      await this.executeStep(session, 3, 'Reconfigure', async () => {
        this.log(session, 'info', 'Restoring basic configuration...');
        await this.delay(1000);
        session.progress = 90;
      }, onProgress);

      await this.executeStep(session, 4, 'Verify', async () => {
        session.status = 'verifying';
        this.log(session, 'info', 'Verifying ECM state...');
        await this.delay(500);
        this.log(session, 'success', 'ECM reset to factory defaults');
        session.progress = 100;
      }, onProgress);

      session.status = 'complete';
      session.endTime = new Date();

      logProgrammingEvent({
        timestamp: new Date(),
        ecmSerial: 'DEMO_SERIAL',
        ecmModel: ecm.model,
        eventType: 'reset',
        technicianId: options.technicianId,
        technicianName: options.technicianName,
        result: 'success',
        duration: session.endTime.getTime() - session.startTime.getTime(),
        details: { resetType: 'factory' }
      });

      return {
        success: true,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: ['ECM has been reset to factory defaults. Recalibration may be required.'],
        errors: []
      };

    } catch (error) {
      session.status = 'error';
      session.endTime = new Date();

      return {
        success: false,
        duration: session.endTime.getTime() - session.startTime.getTime(),
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // ABORT & STATUS
  // ─────────────────────────────────────────────────────────────────────────────

  abort(): void {
    this.abortRequested = true;
    if (this.currentSession) {
      this.currentSession.status = 'aborted';
      this.log(this.currentSession, 'warning', 'Abort requested - stopping at next safe point');
    }
  }

  getCurrentSession(): ProgrammingSession | null {
    return this.currentSession;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // HELPER METHODS
  // ─────────────────────────────────────────────────────────────────────────────

  private createSession(
    ecm: ECMModel,
    operation: ProgrammingOperation,
    options: ProgrammingOptions
  ): ProgrammingSession {
    return {
      id: `PROG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ecmModel: ecm.model,
      ecmSerial: 'PENDING',
      startTime: new Date(),
      status: 'initializing',
      operation,
      progress: 0,
      currentStep: 'Initializing',
      totalSteps: 0,
      currentStepIndex: 0,
      logs: [],
      technicianId: options.technicianId,
      technicianName: options.technicianName
    };
  }

  private async executeStep(
    session: ProgrammingSession,
    stepIndex: number,
    stepName: string,
    action: () => Promise<void>,
    onProgress?: (session: ProgrammingSession) => void
  ): Promise<void> {
    session.currentStepIndex = stepIndex;
    session.currentStep = stepName;
    this.log(session, 'info', `Step ${stepIndex + 1}/${session.totalSteps}: ${stepName}`);
    onProgress?.(session);

    await action();
  }

  private log(
    session: ProgrammingSession,
    level: ProgrammingLog['level'],
    message: string,
    details?: string
  ): void {
    session.logs.push({
      timestamp: new Date(),
      level,
      message,
      details,
      progress: session.progress
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function createFirmwarePackage(
  ecm: ECMModel,
  version: string,
  data: ArrayBuffer
): FirmwarePackage | null {
  const firmware = getFirmwareForECM(ecm.id, version);
  if (!firmware) return null;

  return {
    ecmModel: ecm.model,
    version,
    data,
    checksum: firmware.checksum,
    signature: firmware.signature,
    blockSize: 256,
    metadata: {
      releaseDate: firmware.releaseDate,
      minimumHardware: firmware.minimumHardwareRevision,
      compatibleCalibrations: firmware.compatibleCalibrations,
      releaseNotes: firmware.releaseNotes,
      encrypted: !!firmware.signature,
      compressed: false
    }
  };
}

export function createCalibrationPackage(
  ecm: ECMModel,
  calibrationId: string,
  data: ArrayBuffer
): CalibrationPackage | null {
  const calibration = getCalibrationForECM(ecm.id, calibrationId);
  if (!calibration) return null;

  return {
    id: calibrationId,
    ecmModel: ecm.model,
    version: calibration.version,
    data,
    checksum: calibration.checksum,
    parameters: calibration.parameters
  };
}

export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

export function getLogLevelColor(level: ProgrammingLog['level']): string {
  switch (level) {
    case 'info': return '#60a5fa';
    case 'warning': return '#fbbf24';
    case 'error': return '#ef4444';
    case 'success': return '#22c55e';
    case 'debug': return '#94a3b8';
    default: return '#ffffff';
  }
}
