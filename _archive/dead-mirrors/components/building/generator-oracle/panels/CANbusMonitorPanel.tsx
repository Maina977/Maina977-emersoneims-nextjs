'use client';

/**
 * CANBUS MONITOR PANEL
 *
 * Comprehensive J1939/CANbus monitoring interface:
 * - Real-time CAN message decoding
 * - J1939 PGN/SPN interpretation
 * - Traffic recording and playback
 * - Node health monitoring
 * - Bus load analysis
 * - Fault detection
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CANMessage {
  id: string;
  timestamp: number;
  pgn: number;
  sourceAddress: number;
  destinationAddress: number;
  priority: number;
  dataBytes: number[];
  decoded?: {
    spns: Array<{
      spn: number;
      name: string;
      value: number;
      unit: string;
      status: 'normal' | 'warning' | 'critical';
    }>;
  };
}

interface CANNode {
  address: number;
  name: string;
  manufacturer?: string;
  lastSeen: number;
  messageCount: number;
  status: 'active' | 'inactive' | 'error';
}

interface BusStatistics {
  totalMessages: number;
  messagesPerSecond: number;
  busLoad: number;
  errorFrames: number;
  dominantNodes: { address: number; percentage: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// J1939 DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const J1939_PGNS: Record<number, { name: string; category: string; spns: Array<{ spn: number; name: string; startBit: number; length: number; scale: number; offset: number; unit: string; normalRange?: { min: number; max: number } }> }> = {
  // ═══════════════════════════════════════════════════════════════════════════════
  // ENGINE CONTROL
  // ═══════════════════════════════════════════════════════════════════════════════

  // Engine Controller #1 (EEC1)
  61444: {
    name: 'Electronic Engine Controller 1',
    category: 'engine',
    spns: [
      { spn: 190, name: 'Engine Speed', startBit: 24, length: 16, scale: 0.125, offset: 0, unit: 'rpm', normalRange: { min: 600, max: 2000 } },
      { spn: 899, name: 'Engine Torque Mode', startBit: 0, length: 4, scale: 1, offset: 0, unit: '' },
      { spn: 512, name: 'Driver Demand Engine Torque', startBit: 8, length: 8, scale: 1, offset: -125, unit: '%' },
      { spn: 513, name: 'Actual Engine Torque', startBit: 16, length: 8, scale: 1, offset: -125, unit: '%', normalRange: { min: 0, max: 100 } }
    ]
  },

  // Engine Controller #2 (EEC2)
  61443: {
    name: 'Electronic Engine Controller 2',
    category: 'engine',
    spns: [
      { spn: 91, name: 'Accelerator Pedal Position 1', startBit: 8, length: 8, scale: 0.4, offset: 0, unit: '%' },
      { spn: 92, name: 'Engine Load at Current Speed', startBit: 16, length: 8, scale: 1, offset: 0, unit: '%', normalRange: { min: 0, max: 100 } },
      { spn: 974, name: 'Remote Accelerator Pedal Position', startBit: 24, length: 8, scale: 0.4, offset: 0, unit: '%' }
    ]
  },

  // Engine Controller #3 (EEC3)
  65247: {
    name: 'Electronic Engine Controller 3',
    category: 'engine',
    spns: [
      { spn: 514, name: 'Nominal Friction - Percent Torque', startBit: 0, length: 8, scale: 1, offset: -125, unit: '%' },
      { spn: 515, name: 'Engine Desired Operating Speed', startBit: 8, length: 16, scale: 0.125, offset: 0, unit: 'rpm' },
      { spn: 519, name: 'Engine Desired Operating Speed Asymmetry Adjust', startBit: 24, length: 8, scale: 1, offset: 0, unit: '' }
    ]
  },

  // Engine Temperature #1 (ET1)
  65262: {
    name: 'Engine Temperature 1',
    category: 'temperature',
    spns: [
      { spn: 110, name: 'Engine Coolant Temperature', startBit: 0, length: 8, scale: 1, offset: -40, unit: '°C', normalRange: { min: 70, max: 95 } },
      { spn: 174, name: 'Fuel Temperature', startBit: 8, length: 8, scale: 1, offset: -40, unit: '°C', normalRange: { min: 20, max: 60 } },
      { spn: 175, name: 'Engine Oil Temperature', startBit: 16, length: 16, scale: 0.03125, offset: -273, unit: '°C', normalRange: { min: 80, max: 120 } },
      { spn: 176, name: 'Turbo Oil Temperature', startBit: 32, length: 16, scale: 0.03125, offset: -273, unit: '°C' }
    ]
  },

  // Engine Fluid Level/Pressure #1 (EFL/P1)
  65263: {
    name: 'Engine Fluid Level/Pressure 1',
    category: 'pressure',
    spns: [
      { spn: 94, name: 'Fuel Delivery Pressure', startBit: 0, length: 8, scale: 4, offset: 0, unit: 'kPa', normalRange: { min: 200, max: 500 } },
      { spn: 22, name: 'Extended Crankcase Blow-by Pressure', startBit: 8, length: 8, scale: 0.05, offset: 0, unit: 'kPa' },
      { spn: 98, name: 'Engine Oil Level', startBit: 16, length: 8, scale: 0.4, offset: 0, unit: '%', normalRange: { min: 70, max: 100 } },
      { spn: 100, name: 'Engine Oil Pressure', startBit: 24, length: 8, scale: 4, offset: 0, unit: 'kPa', normalRange: { min: 200, max: 600 } },
      { spn: 101, name: 'Crankcase Pressure', startBit: 32, length: 16, scale: 0.0078125, offset: -250, unit: 'kPa' },
      { spn: 109, name: 'Coolant Pressure', startBit: 48, length: 8, scale: 2, offset: 0, unit: 'kPa', normalRange: { min: 50, max: 200 } }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // FUEL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  // Fuel Economy (LFE)
  65266: {
    name: 'Fuel Economy',
    category: 'fuel',
    spns: [
      { spn: 183, name: 'Fuel Rate', startBit: 0, length: 16, scale: 0.05, offset: 0, unit: 'L/h', normalRange: { min: 5, max: 100 } },
      { spn: 184, name: 'Instantaneous Fuel Economy', startBit: 16, length: 16, scale: 0.001953125, offset: 0, unit: 'km/L' },
      { spn: 185, name: 'Average Fuel Economy', startBit: 32, length: 16, scale: 0.001953125, offset: 0, unit: 'km/L' },
      { spn: 186, name: 'Throttle Position', startBit: 48, length: 8, scale: 0.4, offset: 0, unit: '%' }
    ]
  },

  // Fuel Consumption (FC)
  65257: {
    name: 'Fuel Consumption',
    category: 'fuel',
    spns: [
      { spn: 250, name: 'Total Fuel Used', startBit: 0, length: 32, scale: 0.5, offset: 0, unit: 'L' },
      { spn: 251, name: 'Trip Fuel', startBit: 32, length: 32, scale: 0.5, offset: 0, unit: 'L' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // INTAKE/EXHAUST
  // ═══════════════════════════════════════════════════════════════════════════════

  // Intake/Exhaust Conditions #1 (IC1)
  65270: {
    name: 'Intake/Exhaust Conditions 1',
    category: 'intake',
    spns: [
      { spn: 102, name: 'Boost Pressure', startBit: 8, length: 8, scale: 2, offset: 0, unit: 'kPa', normalRange: { min: 100, max: 250 } },
      { spn: 105, name: 'Intake Manifold Temperature', startBit: 16, length: 8, scale: 1, offset: -40, unit: '°C', normalRange: { min: 20, max: 70 } },
      { spn: 106, name: 'Air Inlet Pressure', startBit: 24, length: 8, scale: 2, offset: 0, unit: 'kPa' },
      { spn: 107, name: 'Air Filter Differential Pressure', startBit: 32, length: 8, scale: 0.05, offset: 0, unit: 'kPa', normalRange: { min: 0, max: 6 } }
    ]
  },

  // Exhaust Gas Temperature (EGT)
  65277: {
    name: 'Exhaust Gas Temperature',
    category: 'exhaust',
    spns: [
      { spn: 2791, name: 'Exhaust Gas Port 1 Temperature', startBit: 0, length: 16, scale: 0.03125, offset: -273, unit: '°C', normalRange: { min: 200, max: 650 } },
      { spn: 2792, name: 'Exhaust Gas Port 2 Temperature', startBit: 16, length: 16, scale: 0.03125, offset: -273, unit: '°C' },
      { spn: 2793, name: 'Exhaust Gas Port 3 Temperature', startBit: 32, length: 16, scale: 0.03125, offset: -273, unit: '°C' },
      { spn: 2794, name: 'Exhaust Gas Port 4 Temperature', startBit: 48, length: 16, scale: 0.03125, offset: -273, unit: '°C' }
    ]
  },

  // Aftertreatment 1 Diesel Exhaust Fluid (AT1DEF)
  65110: {
    name: 'Aftertreatment DEF Tank 1',
    category: 'exhaust',
    spns: [
      { spn: 1761, name: 'Aftertreatment 1 DEF Tank Level', startBit: 0, length: 8, scale: 0.4, offset: 0, unit: '%', normalRange: { min: 20, max: 100 } },
      { spn: 3031, name: 'Aftertreatment 1 DEF Tank Temperature', startBit: 8, length: 8, scale: 1, offset: -40, unit: '°C' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ELECTRICAL SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  // Vehicle Electrical Power #1 (VEP1)
  65271: {
    name: 'Vehicle Electrical Power 1',
    category: 'electrical',
    spns: [
      { spn: 114, name: 'Net Battery Current', startBit: 0, length: 8, scale: 1, offset: -125, unit: 'A' },
      { spn: 115, name: 'Alternator Current', startBit: 8, length: 8, scale: 1, offset: 0, unit: 'A', normalRange: { min: 0, max: 100 } },
      { spn: 167, name: 'Charging System Potential', startBit: 16, length: 16, scale: 0.05, offset: 0, unit: 'V', normalRange: { min: 13.5, max: 14.5 } },
      { spn: 168, name: 'Battery Potential', startBit: 32, length: 16, scale: 0.05, offset: 0, unit: 'V', normalRange: { min: 12, max: 14.5 } },
      { spn: 158, name: 'Keyswitch Battery Potential', startBit: 48, length: 16, scale: 0.05, offset: 0, unit: 'V' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERATOR SPECIFIC
  // ═══════════════════════════════════════════════════════════════════════════════

  // AC Generator Output (ACGO)
  65027: {
    name: 'AC Generator Output',
    category: 'generator',
    spns: [
      { spn: 2814, name: 'Generator AC Output Voltage L1-N', startBit: 0, length: 16, scale: 0.05, offset: 0, unit: 'V', normalRange: { min: 220, max: 240 } },
      { spn: 2815, name: 'Generator AC Output Voltage L2-N', startBit: 16, length: 16, scale: 0.05, offset: 0, unit: 'V' },
      { spn: 2816, name: 'Generator AC Output Voltage L3-N', startBit: 32, length: 16, scale: 0.05, offset: 0, unit: 'V' },
      { spn: 2817, name: 'Generator Frequency', startBit: 48, length: 16, scale: 0.0078125, offset: 0, unit: 'Hz', normalRange: { min: 49.5, max: 50.5 } }
    ]
  },

  // AC Generator Current (ACGC)
  65028: {
    name: 'AC Generator Current',
    category: 'generator',
    spns: [
      { spn: 2818, name: 'Generator AC Output Current L1', startBit: 0, length: 16, scale: 0.05, offset: 0, unit: 'A' },
      { spn: 2819, name: 'Generator AC Output Current L2', startBit: 16, length: 16, scale: 0.05, offset: 0, unit: 'A' },
      { spn: 2820, name: 'Generator AC Output Current L3', startBit: 32, length: 16, scale: 0.05, offset: 0, unit: 'A' },
      { spn: 2821, name: 'Generator Power Factor', startBit: 48, length: 8, scale: 0.01, offset: -1, unit: '', normalRange: { min: 0.8, max: 1.0 } }
    ]
  },

  // Generator Set Control (GSC)
  65029: {
    name: 'Generator Set Control',
    category: 'generator',
    spns: [
      { spn: 2822, name: 'Generator Set Running Status', startBit: 0, length: 4, scale: 1, offset: 0, unit: '' },
      { spn: 2823, name: 'Generator Set Mode', startBit: 4, length: 4, scale: 1, offset: 0, unit: '' },
      { spn: 2824, name: 'Generator Real Power', startBit: 8, length: 16, scale: 1, offset: 0, unit: 'kW' },
      { spn: 2825, name: 'Generator Reactive Power', startBit: 24, length: 16, scale: 1, offset: 0, unit: 'kVAR' }
    ]
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIAGNOSTICS
  // ═══════════════════════════════════════════════════════════════════════════════

  // Diagnostic Message 1 (DM1) - Active Trouble Codes
  65226: {
    name: 'Active Diagnostic Trouble Codes',
    category: 'diagnostic',
    spns: [
      { spn: 1213, name: 'Malfunction Indicator Lamp', startBit: 0, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 623, name: 'Red Stop Lamp', startBit: 2, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 624, name: 'Amber Warning Lamp', startBit: 4, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 987, name: 'Protect Lamp', startBit: 6, length: 2, scale: 1, offset: 0, unit: '' }
    ]
  },

  // Diagnostic Message 2 (DM2) - Previously Active Trouble Codes
  65227: {
    name: 'Previously Active Diagnostic Trouble Codes',
    category: 'diagnostic',
    spns: [
      { spn: 1213, name: 'Malfunction Indicator Lamp Status', startBit: 0, length: 2, scale: 1, offset: 0, unit: '' }
    ]
  },

  // Engine Hours (HOURS)
  65253: {
    name: 'Engine Hours, Revolutions',
    category: 'counters',
    spns: [
      { spn: 247, name: 'Engine Total Hours of Operation', startBit: 0, length: 32, scale: 0.05, offset: 0, unit: 'hours' },
      { spn: 249, name: 'Engine Total Revolutions', startBit: 32, length: 32, scale: 1000, offset: 0, unit: 'rev' }
    ]
  },

  // Engine Starter (ES)
  65069: {
    name: 'Engine Starter',
    category: 'starter',
    spns: [
      { spn: 677, name: 'Engine Starter Motor Reason for Override', startBit: 0, length: 8, scale: 1, offset: 0, unit: '' },
      { spn: 1675, name: 'Engine Starter Mode', startBit: 8, length: 4, scale: 1, offset: 0, unit: '' },
      { spn: 3044, name: 'Starter Motor Duration', startBit: 16, length: 16, scale: 1, offset: 0, unit: 's' }
    ]
  },

  // Ambient Conditions (AMB)
  65269: {
    name: 'Ambient Conditions',
    category: 'environment',
    spns: [
      { spn: 108, name: 'Barometric Pressure', startBit: 0, length: 8, scale: 0.5, offset: 0, unit: 'kPa', normalRange: { min: 95, max: 105 } },
      { spn: 170, name: 'Cab Interior Temperature', startBit: 8, length: 16, scale: 0.03125, offset: -273, unit: '°C' },
      { spn: 171, name: 'Ambient Air Temperature', startBit: 24, length: 16, scale: 0.03125, offset: -273, unit: '°C', normalRange: { min: -20, max: 50 } },
      { spn: 172, name: 'Air Inlet Temperature', startBit: 40, length: 8, scale: 1, offset: -40, unit: '°C' }
    ]
  },

  // Turbocharger (TC1)
  65242: {
    name: 'Turbocharger',
    category: 'engine',
    spns: [
      { spn: 103, name: 'Turbocharger 1 Speed', startBit: 0, length: 16, scale: 4, offset: 0, unit: 'rpm', normalRange: { min: 0, max: 150000 } },
      { spn: 104, name: 'Turbocharger 2 Speed', startBit: 16, length: 16, scale: 4, offset: 0, unit: 'rpm' },
      { spn: 1188, name: 'Turbo Compressor Inlet Temperature', startBit: 32, length: 8, scale: 1, offset: -40, unit: '°C' },
      { spn: 1189, name: 'Turbo Compressor Outlet Temperature', startBit: 40, length: 8, scale: 1, offset: -40, unit: '°C' }
    ]
  },

  // Oil Pressure (OP)
  65272: {
    name: 'Engine Oil Pressure',
    category: 'pressure',
    spns: [
      { spn: 100, name: 'Engine Oil Pressure', startBit: 0, length: 8, scale: 4, offset: 0, unit: 'kPa', normalRange: { min: 200, max: 600 } },
      { spn: 5840, name: 'Engine Oil Pressure High Resolution', startBit: 8, length: 16, scale: 0.1, offset: 0, unit: 'kPa' }
    ]
  },

  // Water in Fuel Indicator (WFI)
  65279: {
    name: 'Water in Fuel Indicator',
    category: 'fuel',
    spns: [
      { spn: 97, name: 'Water in Fuel Indicator', startBit: 0, length: 2, scale: 1, offset: 0, unit: '' }
    ]
  },

  // Idle Operation (IO)
  64789: {
    name: 'Idle Operation',
    category: 'engine',
    spns: [
      { spn: 1682, name: 'Engine Idle Increment Switch', startBit: 0, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 1683, name: 'Engine Idle Decrement Switch', startBit: 2, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 2837, name: 'Engine Desired Idle Speed', startBit: 8, length: 16, scale: 0.125, offset: 0, unit: 'rpm' }
    ]
  },

  // Time/Date (TD)
  65254: {
    name: 'Time/Date',
    category: 'system',
    spns: [
      { spn: 963, name: 'Seconds', startBit: 0, length: 8, scale: 0.25, offset: 0, unit: 's' },
      { spn: 964, name: 'Minutes', startBit: 8, length: 8, scale: 1, offset: 0, unit: 'min' },
      { spn: 965, name: 'Hours', startBit: 16, length: 8, scale: 1, offset: 0, unit: 'hr' },
      { spn: 966, name: 'Day', startBit: 32, length: 8, scale: 0.25, offset: 0, unit: '' },
      { spn: 967, name: 'Month', startBit: 24, length: 8, scale: 1, offset: 0, unit: '' },
      { spn: 968, name: 'Year', startBit: 40, length: 8, scale: 1, offset: 1985, unit: '' }
    ]
  }
};

const J1939_SOURCE_ADDRESSES: Record<number, string> = {
  0: 'Engine #1 (ECM)',
  1: 'Engine #2',
  2: 'Turbocharger',
  3: 'Transmission',
  5: 'Shift Console',
  11: 'Brakes - System Controller',
  15: 'Retarder - Engine',
  17: 'Cruise Control',
  21: 'Cab Controller - Primary',
  23: 'Fuel System Controller',
  25: 'Steering Controller',
  27: 'Auxiliary Heater #1',
  29: 'Hydraulic Pump Controller',
  31: 'Suspension - Drive Axle #1',
  33: 'Body Controller',
  35: 'Auxiliary Valve Control',
  37: 'Instrument Cluster #1',
  39: 'Instrument Cluster #2',
  41: 'Tachograph',
  43: 'Door Controller',
  45: 'Lighting Operator Controls',
  47: 'Sleep Controller',
  49: 'Climate Control #1',
  51: 'Climate Control #2',
  55: 'Intersection Warning System',
  57: 'Engine Retarder Display',
  61: 'Headway Controller',
  63: 'On-Board Axle Group Scale',
  65: 'Exhaust Emission Controller',
  67: 'Tire Pressure Controller',
  69: 'Engine Valve Controller',
  71: 'Auxiliary Power Unit (APU)',
  73: 'Off-Vehicle Gateway',
  75: 'Virtual Terminal',
  // Generator-Specific Addresses
  128: 'Generator Set Controller #1',
  129: 'Generator Set Controller #2',
  130: 'Transfer Switch Controller',
  131: 'Utility Connection Controller',
  132: 'Load Bank Controller',
  133: 'Paralleling Controller',
  134: 'Generator AVR',
  135: 'Generator Governor',
  136: 'Battery Charger/Monitor',
  137: 'Fuel Management System',
  138: 'Remote Monitoring Unit',
  139: 'Generator Protection Relay',
  140: 'Synchronizer Module',
  // Diagnostic/Service Tools
  243: 'Off-Board Diagnostic Tool #1',
  244: 'On-Board Data Logger',
  245: 'PC Keyboard',
  246: 'Cab Display #1',
  247: 'Cab Display #2',
  248: 'Reserved for OEM',
  249: 'Service Tool #1',
  250: 'Service Tool #2',
  251: 'Information System Controller #1',
  252: 'File Server / Printer',
  253: 'Reserved',
  254: 'Null Address (Any Source)',
  255: 'Global (Broadcast)'
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMMON CAN BUS PROBLEMS AND SOLUTIONS
// ═══════════════════════════════════════════════════════════════════════════════

interface TroubleshootingScenario {
  id: string;
  symptom: string;
  possibleCauses: string[];
  diagnosticSteps: string[];
  solutions: string[];
  testPoints: { description: string; expectedValue: string; actualValue?: string }[];
  relatedPGNs: number[];
}

const CAN_TROUBLESHOOTING_SCENARIOS: TroubleshootingScenario[] = [
  {
    id: 'no-comm',
    symptom: 'No CAN Communication - Complete Bus Failure',
    possibleCauses: [
      'Open circuit in CAN H or CAN L wire',
      'Missing termination resistors (120Ω at each end)',
      'Short circuit between CAN H and CAN L',
      'Short to ground on CAN H or CAN L',
      'Short to 12V/24V on CAN H or CAN L',
      'Failed CAN transceiver in ECM or controller',
      'Incorrect baud rate configuration'
    ],
    diagnosticSteps: [
      'Disconnect all nodes from the bus',
      'Measure resistance between CAN H and CAN L at connector',
      'Check for shorts to ground on each wire',
      'Check for shorts to battery positive on each wire',
      'Verify termination at both ends of bus',
      'Reconnect nodes one at a time to identify faulty node'
    ],
    solutions: [
      'Repair any damaged wiring',
      'Install 120Ω termination resistors at each end of bus',
      'Replace faulty CAN transceiver or ECM',
      'Verify all nodes configured for same baud rate (250k for J1939)'
    ],
    testPoints: [
      { description: 'CAN H to CAN L resistance (both terminators)', expectedValue: '60Ω ±5%' },
      { description: 'CAN H to GND resistance', expectedValue: '>10kΩ' },
      { description: 'CAN L to GND resistance', expectedValue: '>10kΩ' },
      { description: 'CAN H to Battery+', expectedValue: '>10kΩ' },
      { description: 'CAN H idle voltage', expectedValue: '2.5V DC' },
      { description: 'CAN L idle voltage', expectedValue: '2.5V DC' }
    ],
    relatedPGNs: []
  },
  {
    id: 'intermittent',
    symptom: 'Intermittent Communication - Random Dropouts',
    possibleCauses: [
      'Loose connector pins or corroded terminals',
      'Damaged wiring insulation causing intermittent shorts',
      'Poor shield grounding causing EMI interference',
      'Marginal termination resistance',
      'Vibration-related connection issues',
      'Water ingress in connectors',
      'CAN transceiver operating at temperature limits'
    ],
    diagnosticSteps: [
      'Wiggle test all CAN connectors while monitoring',
      'Inspect all connector pins for corrosion or damage',
      'Check wiring harness routing near high-current cables',
      'Verify shield is grounded at one point only',
      'Monitor bus during vibration/temperature changes',
      'Check for error frame count increase'
    ],
    solutions: [
      'Clean and reseat all CAN connectors',
      'Replace damaged connector pins',
      'Re-route CAN wiring away from high-current sources',
      'Ground shield at ECM end only',
      'Apply dielectric grease to connectors in harsh environments',
      'Replace suspect wiring harness section'
    ],
    testPoints: [
      { description: 'Connector pin retention force', expectedValue: 'Per manufacturer spec' },
      { description: 'Shield continuity', expectedValue: '<1Ω' },
      { description: 'CAN wiring to starter motor wire spacing', expectedValue: '>100mm' },
      { description: 'Error frame count during test', expectedValue: '<1 per 1000 messages' }
    ],
    relatedPGNs: [65226, 65227]
  },
  {
    id: 'high-error',
    symptom: 'High Error Rate - Frequent Retransmissions',
    possibleCauses: [
      'Bus load exceeding 70% capacity',
      'One or more nodes transmitting too frequently',
      'Mismatched baud rates between nodes',
      'Ground potential difference between nodes',
      'Excessive cable length without proper termination',
      'Incorrect twisted pair wiring',
      'EMI from nearby inverters or VFDs'
    ],
    diagnosticSteps: [
      'Monitor bus load percentage',
      'Identify which node is transmitting most frequently',
      'Verify all nodes configured for 250kbps',
      'Measure ground potential between nodes',
      'Check total CAN bus cable length',
      'Verify twisted pair throughout entire bus'
    ],
    solutions: [
      'Reduce transmission rate on high-traffic nodes',
      'Reconfigure node parameters to reduce traffic',
      'Add star ground point for all CAN nodes',
      'Add intermediate termination for long runs',
      'Use proper shielded twisted pair cable',
      'Install CAN bus filter/isolator near EMI sources'
    ],
    testPoints: [
      { description: 'Bus load percentage', expectedValue: '<70%' },
      { description: 'Ground potential between nodes', expectedValue: '<200mV' },
      { description: 'Total bus length', expectedValue: '<40m at 250k' },
      { description: 'Bit error rate', expectedValue: '<1e-6' }
    ],
    relatedPGNs: [65226]
  },
  {
    id: 'single-node-fail',
    symptom: 'Single Node Not Communicating',
    possibleCauses: [
      'Node power supply failure',
      'Node fuse blown',
      'CAN connector disconnected at node',
      'Internal CAN transceiver failure',
      'Node firmware crash',
      'Node address conflict with another device',
      'Node in bus-off state due to errors'
    ],
    diagnosticSteps: [
      'Check power supply voltage at node',
      'Verify fuses and circuit breakers',
      'Inspect CAN connector at node',
      'Check for activity LEDs on node',
      'Attempt to ping node if supported',
      'Power cycle the node',
      'Check for duplicate addresses on bus'
    ],
    solutions: [
      'Restore power supply to node',
      'Replace blown fuse',
      'Reconnect/replace CAN connector',
      'Replace failed CAN transceiver or node',
      'Reset node to clear bus-off state',
      'Reconfigure node address to avoid conflict'
    ],
    testPoints: [
      { description: 'Node supply voltage', expectedValue: '12-14V or 24-28V' },
      { description: 'Node current draw', expectedValue: 'Per node specification' },
      { description: 'CAN H/L voltage at node', expectedValue: '2.5V idle' },
      { description: 'TXD pin activity (oscilloscope)', expectedValue: 'Square wave during TX' }
    ],
    relatedPGNs: []
  },
  {
    id: 'wrong-data',
    symptom: 'Incorrect or Corrupt Data Values',
    possibleCauses: [
      'Sensor failure sending bad data to ECM',
      'Parameter scaling mismatch in receiving device',
      'Byte order (endianness) mismatch',
      'Firmware version incompatibility',
      'Corrupted ECM configuration',
      'Signal reflection due to impedance mismatch'
    ],
    diagnosticSteps: [
      'Compare raw CAN data with decoded values',
      'Verify sensor readings with multimeter',
      'Check parameter configuration in both devices',
      'Verify firmware versions are compatible',
      'Check ECM configuration against specification',
      'Monitor signal quality with oscilloscope'
    ],
    solutions: [
      'Replace faulty sensor',
      'Reconfigure parameter scaling to match',
      'Update firmware to compatible versions',
      'Reload ECM configuration from factory defaults',
      'Adjust termination to eliminate reflections'
    ],
    testPoints: [
      { description: 'Raw CAN data bytes', expectedValue: 'Match decoded values' },
      { description: 'Sensor output voltage', expectedValue: 'Per sensor specification' },
      { description: 'Eye diagram quality', expectedValue: 'Clean transitions, no ringing' }
    ],
    relatedPGNs: [61444, 65262, 65263, 65270, 65271]
  },
  {
    id: 'speed-signal',
    symptom: 'Engine Speed Signal Missing or Erratic',
    possibleCauses: [
      'Magnetic pickup (MPU) sensor failure',
      'MPU air gap too large or too small',
      'Damaged flywheel teeth',
      'MPU wiring short or open circuit',
      'ECM speed input circuit failure',
      'EMI interference on MPU signal'
    ],
    diagnosticSteps: [
      'Check MPU AC voltage output during cranking',
      'Measure MPU air gap',
      'Inspect flywheel teeth condition',
      'Check MPU wiring for damage',
      'Verify MPU resistance',
      'Check shield grounding on MPU cable'
    ],
    solutions: [
      'Adjust MPU air gap to specification (0.5-1.0mm typical)',
      'Replace damaged MPU sensor',
      'Repair or replace damaged flywheel',
      'Repair MPU wiring and connectors',
      'Replace ECM if input circuit failed',
      'Add ferrite choke to MPU cable if EMI present'
    ],
    testPoints: [
      { description: 'MPU AC voltage (cranking)', expectedValue: '1-5V AC' },
      { description: 'MPU air gap', expectedValue: '0.5-1.0mm' },
      { description: 'MPU resistance', expectedValue: '200-400Ω' },
      { description: 'MPU signal frequency at 1500rpm', expectedValue: 'Teeth × 25Hz' }
    ],
    relatedPGNs: [61444, 61443]
  }
];

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATED CAN DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

function generateSimulatedCANMessage(): CANMessage {
  const pgns = Object.keys(J1939_PGNS).map(Number);
  const pgn = pgns[Math.floor(Math.random() * pgns.length)];
  const pgnInfo = J1939_PGNS[pgn];

  // Generate realistic data bytes based on PGN
  const dataBytes = new Array(8).fill(0).map(() => Math.floor(Math.random() * 256));

  // Decode SPNs
  const decoded = {
    spns: pgnInfo.spns.map(spnDef => {
      // Simulate realistic values
      let value: number;
      switch (spnDef.spn) {
        case 190: // Engine Speed
          value = 1450 + Math.random() * 100;
          break;
        case 110: // Coolant Temp
          value = 75 + Math.random() * 20;
          break;
        case 100: // Oil Pressure
          value = 350 + Math.random() * 100;
          break;
        case 102: // Boost Pressure
          value = 150 + Math.random() * 50;
          break;
        case 168: // Battery Voltage
          value = 27 + Math.random() * 2;
          break;
        case 247: // Engine Hours
          value = 5000 + Math.random() * 100;
          break;
        default:
          value = Math.random() * 100;
      }

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      // Set status based on value ranges
      if (spnDef.spn === 110 && value > 95) status = 'critical';
      else if (spnDef.spn === 110 && value > 90) status = 'warning';
      else if (spnDef.spn === 100 && value < 200) status = 'critical';
      else if (spnDef.spn === 100 && value < 300) status = 'warning';

      return {
        spn: spnDef.spn,
        name: spnDef.name,
        value: Math.round(value * 100) / 100,
        unit: spnDef.unit,
        status
      };
    })
  };

  return {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    pgn,
    sourceAddress: [0, 128, 37, 130][Math.floor(Math.random() * 4)],
    destinationAddress: 255,
    priority: Math.floor(Math.random() * 8),
    dataBytes,
    decoded
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CANbusMonitorPanel() {
  // State
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [messages, setMessages] = useState<CANMessage[]>([]);
  const [nodes, setNodes] = useState<CANNode[]>([]);
  const [statistics, setStatistics] = useState<BusStatistics>({
    totalMessages: 0,
    messagesPerSecond: 0,
    busLoad: 0,
    errorFrames: 0,
    dominantNodes: []
  });
  const [activeTab, setActiveTab] = useState<'live' | 'decoded' | 'nodes' | 'diagnostics'>('live');
  const [filterPGN, setFilterPGN] = useState<number | null>(null);
  const [filterAddress, setFilterAddress] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMessages, setRecordedMessages] = useState<CANMessage[]>([]);

  // Simulation effect
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newMessage = generateSimulatedCANMessage();

      setMessages(prev => {
        const updated = [newMessage, ...prev].slice(0, 100); // Keep last 100 messages
        return updated;
      });

      // Update nodes
      setNodes(prev => {
        const existing = prev.find(n => n.address === newMessage.sourceAddress);
        if (existing) {
          return prev.map(n =>
            n.address === newMessage.sourceAddress
              ? { ...n, lastSeen: Date.now(), messageCount: n.messageCount + 1 }
              : n
          );
        }
        return [...prev, {
          address: newMessage.sourceAddress,
          name: J1939_SOURCE_ADDRESSES[newMessage.sourceAddress] || `Unknown (${newMessage.sourceAddress})`,
          lastSeen: Date.now(),
          messageCount: 1,
          status: 'active'
        }];
      });

      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        messagesPerSecond: Math.round(Math.random() * 50 + 50),
        busLoad: Math.round(Math.random() * 30 + 10),
        errorFrames: Math.floor(Math.random() * 3),
        dominantNodes: nodes.slice(0, 3).map(n => ({
          address: n.address,
          percentage: Math.round(Math.random() * 30 + 10)
        }))
      }));

      // Record if recording
      if (isRecording) {
        setRecordedMessages(prev => [...prev, newMessage]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMonitoring, isRecording, nodes]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      if (filterPGN !== null && msg.pgn !== filterPGN) return false;
      if (filterAddress !== null && msg.sourceAddress !== filterAddress) return false;
      return true;
    });
  }, [messages, filterPGN, filterAddress]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(!isMonitoring);
    if (isMonitoring) {
      setIsRecording(false);
    }
  }, [isMonitoring]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      setRecordedMessages([]);
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setRecordedMessages([]);
  }, []);

  // Export recording
  const exportRecording = useCallback(() => {
    const blob = new Blob([JSON.stringify(recordedMessages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `can-recording-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [recordedMessages]);

  // Render Live Tab
  const renderLiveTab = () => (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isMonitoring
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {isMonitoring ? '⏹ Stop' : '▶ Start'} Monitoring
        </button>
        <button
          onClick={toggleRecording}
          disabled={!isMonitoring}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } ${!isMonitoring && 'opacity-50 cursor-not-allowed'}`}
        >
          {isRecording ? '🔴 Recording...' : '⏺ Record'}
        </button>
        <button
          onClick={clearMessages}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        {recordedMessages.length > 0 && (
          <button
            onClick={exportRecording}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Export ({recordedMessages.length} msgs)
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterPGN ?? ''}
          onChange={(e) => setFilterPGN(e.target.value ? Number(e.target.value) : null)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
        >
          <option value="">All PGNs</option>
          {Object.entries(J1939_PGNS).map(([pgn, info]) => (
            <option key={pgn} value={pgn}>{pgn} - {info.name}</option>
          ))}
        </select>
        <select
          value={filterAddress ?? ''}
          onChange={(e) => setFilterAddress(e.target.value ? Number(e.target.value) : null)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
        >
          <option value="">All Addresses</option>
          {Object.entries(J1939_SOURCE_ADDRESSES).map(([addr, name]) => (
            <option key={addr} value={addr}>{addr} - {name}</option>
          ))}
        </select>
      </div>

      {/* Message List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-gray-800">
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">PGN</th>
                <th className="text-left py-2 px-2">Source</th>
                <th className="text-left py-2 px-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-1 px-2 text-gray-500">
                    {new Date(msg.timestamp).toISOString().substr(11, 12)}
                  </td>
                  <td className="py-1 px-2 text-amber-400">
                    {msg.pgn} ({J1939_PGNS[msg.pgn]?.name.substr(0, 20) || 'Unknown'})
                  </td>
                  <td className="py-1 px-2 text-cyan-400">
                    {msg.sourceAddress} ({J1939_SOURCE_ADDRESSES[msg.sourceAddress]?.substr(0, 15) || 'Unknown'})
                  </td>
                  <td className="py-1 px-2 text-gray-300">
                    {msg.dataBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Decoded Tab
  const renderDecodedTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Decoded Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {messages.slice(0, 6).map((msg) => (
          <div key={msg.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-medium text-sm">
                  {J1939_PGNS[msg.pgn]?.name || `PGN ${msg.pgn}`}
                </h4>
                <p className="text-gray-500 text-xs">
                  From: {J1939_SOURCE_ADDRESSES[msg.sourceAddress] || `Address ${msg.sourceAddress}`}
                </p>
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-2">
              {msg.decoded?.spns.map((spn) => (
                <div key={spn.spn} className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">{spn.name}</span>
                  <span className={`text-sm font-mono ${
                    spn.status === 'critical' ? 'text-red-400' :
                    spn.status === 'warning' ? 'text-amber-400' :
                    'text-green-400'
                  }`}>
                    {spn.value} {spn.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Nodes Tab
  const renderNodesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">CAN Bus Nodes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const timeSinceLastSeen = (Date.now() - node.lastSeen) / 1000;
          const isStale = timeSinceLastSeen > 5;

          return (
            <div
              key={node.address}
              className={`bg-gray-800/50 rounded-xl p-4 border ${
                isStale ? 'border-gray-700' : 'border-green-500/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{node.name}</h4>
                  <p className="text-gray-500 text-sm">Address: 0x{node.address.toString(16).toUpperCase()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  isStale ? 'bg-gray-700 text-gray-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {isStale ? 'Inactive' : 'Active'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Messages:</span>
                  <span className="text-white ml-2">{node.messageCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Seen:</span>
                  <span className="text-white ml-2">
                    {isStale ? `${Math.round(timeSinceLastSeen)}s ago` : 'Now'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {nodes.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No nodes detected. Start monitoring to discover CAN bus nodes.
          </div>
        )}
      </div>
    </div>
  );

  // State for selected troubleshooting scenario
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Render Diagnostics Tab
  const renderDiagnosticsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Bus Diagnostics & Troubleshooting</h3>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{statistics.totalMessages}</p>
          <p className="text-gray-500 text-sm">Total Messages</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-cyan-400">{statistics.messagesPerSecond}</p>
          <p className="text-gray-500 text-sm">Messages/Second</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className={`text-3xl font-bold ${
            statistics.busLoad > 70 ? 'text-red-400' :
            statistics.busLoad > 50 ? 'text-amber-400' :
            'text-green-400'
          }`}>
            {statistics.busLoad}%
          </p>
          <p className="text-gray-500 text-sm">Bus Load</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className={`text-3xl font-bold ${
            statistics.errorFrames > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {statistics.errorFrames}
          </p>
          <p className="text-gray-500 text-sm">Error Frames</p>
        </div>
      </div>

      {/* Bus Health */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-4">🔌 Bus Health Checks</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-900/50 rounded-lg text-center">
            <div className="text-green-400 font-mono font-bold">60Ω</div>
            <div className="text-xs text-gray-500">Termination</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg text-center">
            <div className="text-green-400 font-mono font-bold">Good</div>
            <div className="text-xs text-gray-500">Signal Quality</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg text-center">
            <div className="text-blue-400 font-mono font-bold">250k</div>
            <div className="text-xs text-gray-500">Baud Rate</div>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg text-center">
            <div className="text-cyan-400 font-mono font-bold">{nodes.length}</div>
            <div className="text-xs text-gray-500">Active Nodes</div>
          </div>
        </div>
      </div>

      {/* Troubleshooting Scenarios */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-4">🔧 Troubleshooting Scenarios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
          {CAN_TROUBLESHOOTING_SCENARIOS.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(selectedScenario === scenario.id ? null : scenario.id)}
              className={`p-3 rounded-lg text-left transition-all ${
                selectedScenario === scenario.id
                  ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-400'
                  : 'bg-gray-900/50 border border-gray-700 text-gray-300 hover:border-gray-600'
              }`}
            >
              <div className="text-sm font-medium truncate">{scenario.symptom}</div>
            </button>
          ))}
        </div>

        {/* Selected Scenario Details */}
        <AnimatePresence>
          {selectedScenario && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {CAN_TROUBLESHOOTING_SCENARIOS.filter(s => s.id === selectedScenario).map(scenario => (
                <div key={scenario.id} className="space-y-4 pt-4 border-t border-gray-700">
                  <h5 className="text-lg font-bold text-amber-400">{scenario.symptom}</h5>

                  {/* Possible Causes */}
                  <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                    <h6 className="text-red-400 font-medium mb-2">⚠️ Possible Causes</h6>
                    <ul className="space-y-1">
                      {scenario.possibleCauses.map((cause, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-red-400">•</span> {cause}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Diagnostic Steps */}
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                    <h6 className="text-blue-400 font-medium mb-2">🔍 Diagnostic Steps</h6>
                    <ol className="space-y-1">
                      {scenario.diagnosticSteps.map((step, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-blue-400 font-mono">{idx + 1}.</span> {step}
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Test Points */}
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-lg p-4">
                    <h6 className="text-cyan-400 font-medium mb-2">📊 Test Points & Expected Values</h6>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500">
                            <th className="pb-2">Measurement</th>
                            <th className="pb-2">Expected Value</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          {scenario.testPoints.map((point, idx) => (
                            <tr key={idx} className="border-t border-gray-700/50">
                              <td className="py-2">{point.description}</td>
                              <td className="py-2 font-mono text-cyan-400">{point.expectedValue}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Solutions */}
                  <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
                    <h6 className="text-green-400 font-medium mb-2">✅ Solutions</h6>
                    <ul className="space-y-1">
                      {scenario.solutions.map((solution, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-green-400">✓</span> {solution}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Related PGNs */}
                  {scenario.relatedPGNs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-gray-500 text-sm">Related PGNs:</span>
                      {scenario.relatedPGNs.map(pgn => (
                        <button
                          key={pgn}
                          onClick={() => {
                            setFilterPGN(pgn);
                            setActiveTab('live');
                          }}
                          className="px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400 text-xs hover:bg-amber-500/20"
                        >
                          PGN {pgn}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Reference */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-4">📋 J1939 Quick Reference</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h5 className="text-cyan-400 font-medium">Wire Colors (Standard)</h5>
            <div className="space-y-1 text-gray-300">
              <div>🟡 <span className="text-yellow-400">CAN H</span> - Yellow</div>
              <div>🟢 <span className="text-green-400">CAN L</span> - Green</div>
              <div>⚫ <span className="text-gray-400">Shield/GND</span> - Black/Drain</div>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-cyan-400 font-medium">Voltage Levels</h5>
            <div className="space-y-1 text-gray-300">
              <div>Idle: CAN H = CAN L = <span className="text-cyan-400">2.5V</span></div>
              <div>Dominant: CAN H = <span className="text-cyan-400">3.5V</span>, CAN L = <span className="text-cyan-400">1.5V</span></div>
              <div>Differential: <span className="text-cyan-400">2.0V</span> (dominant)</div>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-cyan-400 font-medium">Baud Rates</h5>
            <div className="space-y-1 text-gray-300">
              <div>J1939 (Heavy Duty): <span className="text-cyan-400">250 kbps</span></div>
              <div>J1939-FMS: <span className="text-cyan-400">250 kbps</span></div>
              <div>ISO 11898 (Car): <span className="text-cyan-400">500 kbps</span></div>
            </div>
          </div>
          <div className="space-y-2">
            <h5 className="text-cyan-400 font-medium">Cable Specifications</h5>
            <div className="space-y-1 text-gray-300">
              <div>Max Length: <span className="text-cyan-400">40m</span> @ 250k</div>
              <div>Impedance: <span className="text-cyan-400">120Ω ±10%</span></div>
              <div>Twist: <span className="text-cyan-400">1 turn per 25mm</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">CANbus Monitor</h2>
          <p className="text-gray-400 text-sm">J1939 Protocol Analysis & Diagnostics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-gray-400 text-sm">{isMonitoring ? 'Monitoring' : 'Idle'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {[
          { id: 'live', label: 'Live Traffic', icon: '📡' },
          { id: 'decoded', label: 'Decoded Data', icon: '📊' },
          { id: 'nodes', label: 'Nodes', icon: '🔌' },
          { id: 'diagnostics', label: 'Diagnostics', icon: '🔧' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'live' && renderLiveTab()}
          {activeTab === 'decoded' && renderDecodedTab()}
          {activeTab === 'nodes' && renderNodesTab()}
          {activeTab === 'diagnostics' && renderDiagnosticsTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
