/**
 * ECM Communication Module
 *
 * Provides real hardware communication with Engine Control Modules
 * via Web Serial, Bluetooth, and USB APIs.
 *
 * This module bridges the gap between Generator Oracle and dealer diagnostic
 * tools like CAT ET and VODIA by enabling direct ECM communication.
 *
 * (c) 2026 Generator Oracle. All Rights Reserved.
 */

export * from './ECMCommunicationCore';

// Re-export service singleton for convenience
export { ecmCommunicationService } from './ECMCommunicationCore';
