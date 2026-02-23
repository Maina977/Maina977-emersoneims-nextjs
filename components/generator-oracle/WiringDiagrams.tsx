'use client';

/**
 * Wiring Diagrams Component
 * Interactive, labeled wiring diagrams compatible with 10 controller types
 * Shows numbered connections, fuses, breakers, relays, starters, chargers
 * Includes programming guidance without laptop
 *
 * DISCLAIMER: Generator Oracle is an independently developed diagnostic tool.
 * It is NOT affiliated with, endorsed by, or sponsored by any controller manufacturer.
 * All brand names mentioned are trademarks of their respective owners.
 * "Compatible with" indicates the tool works with these controller types.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Terminal/Connection Types
interface Terminal {
  id: string;
  label: string;
  description: string;
  wireColor: string;
  wireGauge: string;
  maxCurrent?: string;
  connectedTo: string;
  function: string;
}

interface Component {
  id: string;
  name: string;
  type: 'fuse' | 'relay' | 'breaker' | 'sensor' | 'actuator' | 'power' | 'signal' | 'ground';
  rating?: string;
  terminals: Terminal[];
  location: string;
  troubleshooting: string[];
}

// Controller Wiring Configurations - Compatible with 10 Controller Types
const WIRING_CONFIGS = {
  DSE: {
    name: 'Compatible with DSE Controllers',
    color: '#1E40AF',
    components: [
      {
        id: 'BATT',
        name: 'Battery Connection',
        type: 'power' as const,
        rating: '12/24V DC',
        terminals: [
          { id: 'B+', label: 'B+', description: 'Battery Positive', wireColor: 'RED', wireGauge: '10 AWG', maxCurrent: '30A', connectedTo: 'Battery +ve terminal', function: 'Main power supply' },
          { id: 'B-', label: 'B-', description: 'Battery Negative', wireColor: 'BLACK', wireGauge: '10 AWG', maxCurrent: '30A', connectedTo: 'Battery -ve / Chassis Ground', function: 'Ground reference' },
        ],
        location: 'Terminals 1-2',
        troubleshooting: ['Check battery voltage (should be 12-14V or 24-28V)', 'Inspect for corrosion on terminals', 'Verify polarity - reverse polarity will damage controller'],
      },
      {
        id: 'CHARGE',
        name: 'Charge Alternator',
        type: 'power' as const,
        rating: '14V/28V DC',
        terminals: [
          { id: 'W', label: 'W', description: 'Charge Warning', wireColor: 'YELLOW', wireGauge: '16 AWG', connectedTo: 'Alternator W terminal', function: 'Charge lamp/warning signal' },
          { id: 'D+', label: 'D+', description: 'Charge Output', wireColor: 'BROWN', wireGauge: '14 AWG', maxCurrent: '10A', connectedTo: 'Alternator D+ terminal', function: 'Charging current sense' },
        ],
        location: 'Terminals 3-4',
        troubleshooting: ['Measure D+ voltage with engine running (should be 14V/28V)', 'W terminal should show 0V when charging, 12V when not charging', 'Check alternator belt tension'],
      },
      {
        id: 'FUEL',
        name: 'Fuel Solenoid',
        type: 'actuator' as const,
        rating: '12/24V DC, 8A max',
        terminals: [
          { id: 'FS', label: 'FS', description: 'Fuel Solenoid Output', wireColor: 'ORANGE', wireGauge: '14 AWG', maxCurrent: '8A', connectedTo: 'Fuel solenoid coil', function: 'Fuel shutoff control' },
        ],
        location: 'Terminal 5',
        troubleshooting: ['Measure voltage when engine starting (should be battery voltage)', 'Check solenoid resistance (typically 10-30 ohms)', 'Listen for solenoid click when activated'],
      },
      {
        id: 'START',
        name: 'Starter Motor',
        type: 'relay' as const,
        rating: '12/24V DC, 10A',
        terminals: [
          { id: 'ST', label: 'ST', description: 'Starter Output', wireColor: 'PURPLE', wireGauge: '12 AWG', maxCurrent: '10A', connectedTo: 'Starter relay coil', function: 'Activates starter motor' },
        ],
        location: 'Terminal 6',
        troubleshooting: ['Output should show battery voltage during crank cycle', 'Check for 3-second crank duration', 'Verify starter relay coil resistance (typically 50-150 ohms)'],
      },
      {
        id: 'OIL',
        name: 'Oil Pressure Sensor',
        type: 'sensor' as const,
        rating: '0-10 bar',
        terminals: [
          { id: 'OPS', label: 'OPS', description: 'Oil Pressure Signal', wireColor: 'BLUE', wireGauge: '18 AWG', connectedTo: 'Oil pressure sender', function: 'Engine oil pressure monitoring' },
          { id: 'OPG', label: 'OPG', description: 'Oil Pressure Ground', wireColor: 'BLACK', wireGauge: '18 AWG', connectedTo: 'Sensor ground', function: 'Signal reference ground' },
        ],
        location: 'Terminals 7-8',
        troubleshooting: ['At idle: 25-40 PSI typical', 'At full load: 40-60 PSI typical', 'Check sender resistance: 10Ω (high pressure) to 180Ω (low pressure)'],
      },
      {
        id: 'TEMP',
        name: 'Coolant Temperature',
        type: 'sensor' as const,
        rating: '40-120°C',
        terminals: [
          { id: 'CTS', label: 'CTS', description: 'Coolant Temp Signal', wireColor: 'GREEN', wireGauge: '18 AWG', connectedTo: 'Coolant temp sender', function: 'Engine temperature monitoring' },
          { id: 'CTG', label: 'CTG', description: 'Coolant Temp Ground', wireColor: 'BLACK', wireGauge: '18 AWG', connectedTo: 'Sensor ground', function: 'Signal reference ground' },
        ],
        location: 'Terminals 9-10',
        troubleshooting: ['Cold engine: high resistance (2-3kΩ)', 'Hot engine (90°C): low resistance (200-300Ω)', 'Check for coolant leaks around sensor'],
      },
      {
        id: 'MPU',
        name: 'Magnetic Pickup (Speed)',
        type: 'sensor' as const,
        rating: '1-50V AC',
        terminals: [
          { id: 'MPU+', label: 'MPU+', description: 'MPU Positive', wireColor: 'WHITE', wireGauge: '18 AWG', connectedTo: 'MPU + terminal', function: 'Engine speed signal positive' },
          { id: 'MPU-', label: 'MPU-', description: 'MPU Negative', wireColor: 'WHITE/BLACK', wireGauge: '18 AWG', connectedTo: 'MPU - terminal', function: 'Engine speed signal negative' },
        ],
        location: 'Terminals 11-12',
        troubleshooting: ['MPU air gap: 0.5-1.0mm from flywheel teeth', 'At cranking: 1-3V AC', 'At running: 5-30V AC depending on speed'],
      },
      {
        id: 'FUSE1',
        name: 'Main Controller Fuse',
        type: 'fuse' as const,
        rating: '10A',
        terminals: [
          { id: 'F1+', label: 'F1+', description: 'Fuse Input', wireColor: 'RED', wireGauge: '12 AWG', connectedTo: 'Battery B+', function: 'Main power protection' },
          { id: 'F1-', label: 'F1-', description: 'Fuse Output', wireColor: 'RED', wireGauge: '12 AWG', connectedTo: 'Controller power input', function: 'Protected power to controller' },
        ],
        location: 'Fuse Block Position 1',
        troubleshooting: ['Visual inspection for blown fuse', 'Measure continuity across fuse', 'Check for short circuits if fuse keeps blowing'],
      },
      {
        id: 'GEN_VOLT',
        name: 'Generator Voltage Sensing',
        type: 'signal' as const,
        rating: '0-600V AC',
        terminals: [
          { id: 'L1', label: 'L1', description: 'Phase L1 Sensing', wireColor: 'RED', wireGauge: '16 AWG', connectedTo: 'Generator L1 output', function: 'Voltage/frequency sensing' },
          { id: 'L2', label: 'L2', description: 'Phase L2 Sensing', wireColor: 'YELLOW', wireGauge: '16 AWG', connectedTo: 'Generator L2 output', function: 'Voltage/frequency sensing' },
          { id: 'L3', label: 'L3', description: 'Phase L3 Sensing', wireColor: 'BLUE', wireGauge: '16 AWG', connectedTo: 'Generator L3 output', function: 'Voltage/frequency sensing' },
          { id: 'N', label: 'N', description: 'Neutral', wireColor: 'BLACK', wireGauge: '16 AWG', connectedTo: 'Generator Neutral', function: 'Neutral reference' },
        ],
        location: 'Terminals 13-16',
        troubleshooting: ['Measure phase-to-phase voltage (380-415V typical)', 'Measure phase-to-neutral voltage (220-240V typical)', 'Check for voltage imbalance between phases'],
      },
      {
        id: 'RELAY_OUT',
        name: 'Configurable Relay Outputs',
        type: 'relay' as const,
        rating: '8A @ 250V AC / 8A @ 30V DC',
        terminals: [
          { id: 'K1C', label: 'K1-C', description: 'Relay 1 Common', wireColor: 'VARIES', wireGauge: '14 AWG', connectedTo: 'Load common', function: 'Configurable alarm/control output' },
          { id: 'K1NO', label: 'K1-NO', description: 'Relay 1 Normally Open', wireColor: 'VARIES', wireGauge: '14 AWG', connectedTo: 'Load when active', function: 'Closes when relay energized' },
          { id: 'K1NC', label: 'K1-NC', description: 'Relay 1 Normally Closed', wireColor: 'VARIES', wireGauge: '14 AWG', connectedTo: 'Load when inactive', function: 'Opens when relay energized' },
        ],
        location: 'Terminals 17-19',
        troubleshooting: ['Listen for relay click when activated', 'Measure continuity between C and NO/NC', 'Check relay coil voltage when commanded'],
      },
    ],
  },
  COMAP: {
    name: 'Compatible with ComAp Controllers',
    color: '#DC2626',
    components: [
      {
        id: 'BATT',
        name: 'Battery Connection',
        type: 'power' as const,
        rating: '8-36V DC',
        terminals: [
          { id: 'B+', label: '+Vbat', description: 'Battery Positive', wireColor: 'RED', wireGauge: '10 AWG', maxCurrent: '30A', connectedTo: 'Battery +ve terminal', function: 'Main power supply (wide voltage range)' },
          { id: 'B-', label: 'GND', description: 'Ground', wireColor: 'BLACK', wireGauge: '10 AWG', maxCurrent: '30A', connectedTo: 'Battery -ve / Chassis Ground', function: 'Common ground reference' },
        ],
        location: 'Terminals A1-A2',
        troubleshooting: ['Wide input range 8-36V DC', 'Check for stable power supply', 'Verify ground connection integrity'],
      },
      {
        id: 'CAN',
        name: 'CAN Bus Interface',
        type: 'signal' as const,
        rating: '250kbps',
        terminals: [
          { id: 'CANH', label: 'CAN-H', description: 'CAN High', wireColor: 'YELLOW', wireGauge: '22 AWG', connectedTo: 'CAN network high', function: 'J1939/CANopen high signal' },
          { id: 'CANL', label: 'CAN-L', description: 'CAN Low', wireColor: 'GREEN', wireGauge: '22 AWG', connectedTo: 'CAN network low', function: 'J1939/CANopen low signal' },
          { id: 'CANG', label: 'CAN-GND', description: 'CAN Ground', wireColor: 'BLACK', wireGauge: '22 AWG', connectedTo: 'CAN shield/ground', function: 'CAN reference ground' },
        ],
        location: 'Terminals C1-C3',
        troubleshooting: ['CAN-H should be 2.5-3.5V', 'CAN-L should be 1.5-2.5V', 'Check 120Ω termination resistors', 'Use twisted pair cable'],
      },
      {
        id: 'ECU',
        name: 'ECU Interface',
        type: 'signal' as const,
        rating: 'J1939 Protocol',
        terminals: [
          { id: 'ECU_TX', label: 'ECU-TX', description: 'ECU Transmit', wireColor: 'WHITE', wireGauge: '22 AWG', connectedTo: 'Engine ECU', function: 'Commands to engine ECU' },
          { id: 'ECU_RX', label: 'ECU-RX', description: 'ECU Receive', wireColor: 'BROWN', wireGauge: '22 AWG', connectedTo: 'Engine ECU', function: 'Data from engine ECU' },
        ],
        location: 'Via CAN Bus',
        troubleshooting: ['Verify ECU is J1939 compatible', 'Check baud rate matches (250kbps)', 'Monitor for communication errors'],
      },
    ],
  },
  WOODWARD: {
    name: 'Compatible with Woodward Controllers',
    color: '#059669',
    components: [
      {
        id: 'BATT',
        name: 'Power Supply',
        type: 'power' as const,
        rating: '9.5-32V DC',
        terminals: [
          { id: 'PWR+', label: 'PWR+', description: 'Power Positive', wireColor: 'RED', wireGauge: '12 AWG', maxCurrent: '15A', connectedTo: 'Battery positive via fuse', function: 'Controller power input' },
          { id: 'PWR-', label: 'PWR-', description: 'Power Negative', wireColor: 'BLACK', wireGauge: '12 AWG', maxCurrent: '15A', connectedTo: 'Battery negative', function: 'Power return' },
        ],
        location: 'Connector J1, Pins 1-2',
        troubleshooting: ['Operating range: 9.5-32V DC', 'Typical consumption: 200mA standby, 2A running', 'Check fuse rating: 5A recommended'],
      },
      {
        id: 'SYNC',
        name: 'Synchronization',
        type: 'signal' as const,
        rating: '0-300V AC',
        terminals: [
          { id: 'BUS_L1', label: 'BUS-L1', description: 'Bus Phase L1', wireColor: 'RED', wireGauge: '18 AWG', connectedTo: 'Busbar L1', function: 'Sync reference L1' },
          { id: 'BUS_L2', label: 'BUS-L2', description: 'Bus Phase L2', wireColor: 'YELLOW', wireGauge: '18 AWG', connectedTo: 'Busbar L2', function: 'Sync reference L2' },
          { id: 'BUS_L3', label: 'BUS-L3', description: 'Bus Phase L3', wireColor: 'BLUE', wireGauge: '18 AWG', connectedTo: 'Busbar L3', function: 'Sync reference L3' },
        ],
        location: 'Connector J3, Pins 1-3',
        troubleshooting: ['Used for paralleling applications', 'Verify PT ratio if using transformers', 'Check phase sequence matches generator'],
      },
    ],
  },
  SMARTGEN: {
    name: 'Compatible with SmartGen Controllers',
    color: '#7C3AED',
    components: [
      {
        id: 'BATT',
        name: 'DC Power Input',
        type: 'power' as const,
        rating: '8-35V DC',
        terminals: [
          { id: 'VCC', label: 'VCC', description: 'Positive Supply', wireColor: 'RED', wireGauge: '14 AWG', maxCurrent: '10A', connectedTo: 'Battery positive', function: 'Main DC power' },
          { id: 'GND', label: 'GND', description: 'Ground', wireColor: 'BLACK', wireGauge: '14 AWG', maxCurrent: '10A', connectedTo: 'Battery negative', function: 'Ground reference' },
        ],
        location: 'Terminal Block TB1',
        troubleshooting: ['Wide input range for global compatibility', 'Built-in reverse polarity protection', 'Check for voltage drops under load'],
      },
      {
        id: 'RS485',
        name: 'RS485 Communication',
        type: 'signal' as const,
        rating: '9600-115200 baud',
        terminals: [
          { id: 'RS485A', label: 'A+', description: 'RS485 A', wireColor: 'GREEN', wireGauge: '22 AWG', connectedTo: 'RS485 network A', function: 'Data line A' },
          { id: 'RS485B', label: 'B-', description: 'RS485 B', wireColor: 'YELLOW', wireGauge: '22 AWG', connectedTo: 'RS485 network B', function: 'Data line B' },
          { id: 'RS485G', label: 'SG', description: 'Signal Ground', wireColor: 'BLACK', wireGauge: '22 AWG', connectedTo: 'Signal ground', function: 'Reference ground' },
        ],
        location: 'Terminal Block TB2',
        troubleshooting: ['Use shielded twisted pair', 'Termination: 120Ω at each end', 'Max cable length: 1200m'],
      },
    ],
  },
  POWERWIZARD: {
    name: 'Compatible with PowerWizard Controllers',
    color: '#CA8A04',
    components: [
      {
        id: 'BATT',
        name: 'Battery Power',
        type: 'power' as const,
        rating: '12/24V DC Nominal',
        terminals: [
          { id: 'VBAT', label: 'VBAT', description: 'Battery Voltage', wireColor: 'RED', wireGauge: '10 AWG', maxCurrent: '25A', connectedTo: 'Battery positive', function: 'Primary power input' },
          { id: 'GRND', label: 'GND', description: 'Battery Ground', wireColor: 'BLACK', wireGauge: '10 AWG', maxCurrent: '25A', connectedTo: 'Battery negative', function: 'System ground' },
        ],
        location: 'Main Connector J1',
        troubleshooting: ['12V system: 10.5-16V operating range', '24V system: 21-32V operating range', 'Check for voltage sag during cranking'],
      },
      {
        id: 'DATA_LINK',
        name: 'CAT Data Link',
        type: 'signal' as const,
        rating: 'CAT Proprietary',
        terminals: [
          { id: 'DL+', label: 'Data+', description: 'Data Link Positive', wireColor: 'WHITE', wireGauge: '22 AWG', connectedTo: 'Engine ECM', function: 'Serial data positive' },
          { id: 'DL-', label: 'Data-', description: 'Data Link Negative', wireColor: 'BLACK/WHITE', wireGauge: '22 AWG', connectedTo: 'Engine ECM', function: 'Serial data negative' },
        ],
        location: 'Diagnostic Connector',
        troubleshooting: ['Use CAT-specified cables only', 'Data link provides all engine parameters', 'Check ECM software version compatibility'],
      },
    ],
  },
  DATAKOM: {
    name: 'Compatible with Datakom Controllers',
    color: '#0891B2',
    components: [
      {
        id: 'BATT',
        name: 'DC Power Supply',
        type: 'power' as const,
        rating: '8-35V DC',
        terminals: [
          { id: 'V+', label: 'V+', description: 'Positive Supply', wireColor: 'RED', wireGauge: '12 AWG', maxCurrent: '20A', connectedTo: 'Battery positive', function: 'Main power input' },
          { id: 'V-', label: 'V-', description: 'Negative/Ground', wireColor: 'BLACK', wireGauge: '12 AWG', maxCurrent: '20A', connectedTo: 'Battery negative', function: 'Ground reference' },
        ],
        location: 'Terminals 1-2',
        troubleshooting: ['Operating range 8-35V DC', 'Check fuse F1 (10A) if no power', 'Verify polarity before connecting'],
      },
      {
        id: 'ENGINE',
        name: 'Engine Control',
        type: 'actuator' as const,
        rating: '12/24V DC, 10A',
        terminals: [
          { id: 'FUEL', label: 'FUEL', description: 'Fuel Solenoid', wireColor: 'ORANGE', wireGauge: '14 AWG', maxCurrent: '8A', connectedTo: 'Fuel solenoid', function: 'Fuel shutoff control' },
          { id: 'START', label: 'START', description: 'Starter Output', wireColor: 'PURPLE', wireGauge: '12 AWG', maxCurrent: '10A', connectedTo: 'Starter relay', function: 'Cranking motor control' },
          { id: 'PREHEAT', label: 'PREHEAT', description: 'Glow Plugs', wireColor: 'BROWN', wireGauge: '12 AWG', maxCurrent: '15A', connectedTo: 'Glow plug relay', function: 'Cold start assist' },
        ],
        location: 'Terminals 3-5',
        troubleshooting: ['Check output voltage during operation', 'Verify relay coil resistance', 'Test with manual override if available'],
      },
      {
        id: 'SENSORS',
        name: 'Analog Sensors',
        type: 'sensor' as const,
        rating: 'Various',
        terminals: [
          { id: 'OIL_P', label: 'OIL-P', description: 'Oil Pressure', wireColor: 'BLUE', wireGauge: '18 AWG', connectedTo: 'Oil pressure sender', function: 'Oil pressure monitoring' },
          { id: 'TEMP', label: 'TEMP', description: 'Coolant Temperature', wireColor: 'GREEN', wireGauge: '18 AWG', connectedTo: 'Temperature sender', function: 'Temperature monitoring' },
          { id: 'FUEL_LVL', label: 'FUEL-L', description: 'Fuel Level', wireColor: 'YELLOW', wireGauge: '18 AWG', connectedTo: 'Fuel sender', function: 'Fuel level indication' },
        ],
        location: 'Terminals 6-8',
        troubleshooting: ['Check sender resistance ranges', 'Verify ground connections', 'Test with known good sender'],
      },
      {
        id: 'MODBUS',
        name: 'Modbus RTU Communication',
        type: 'signal' as const,
        rating: '9600-38400 baud',
        terminals: [
          { id: 'RS485_A', label: 'A+', description: 'RS485 A', wireColor: 'GREEN', wireGauge: '22 AWG', connectedTo: 'Modbus network A', function: 'Data positive' },
          { id: 'RS485_B', label: 'B-', description: 'RS485 B', wireColor: 'YELLOW', wireGauge: '22 AWG', connectedTo: 'Modbus network B', function: 'Data negative' },
          { id: 'RS485_GND', label: 'GND', description: 'Signal Ground', wireColor: 'BLACK', wireGauge: '22 AWG', connectedTo: 'Shield ground', function: 'Reference ground' },
        ],
        location: 'Communication Port',
        troubleshooting: ['Use shielded twisted pair cable', 'Check termination resistors (120Ω)', 'Verify address settings'],
      },
    ],
  },
  LOVATO: {
    name: 'Compatible with Lovato Controllers',
    color: '#DC2626',
    components: [
      {
        id: 'BATT',
        name: 'Power Supply',
        type: 'power' as const,
        rating: '12/24V DC',
        terminals: [
          { id: 'PWR+', label: '+Vdc', description: 'Positive Input', wireColor: 'RED', wireGauge: '12 AWG', maxCurrent: '15A', connectedTo: 'Battery positive via fuse', function: 'Controller power' },
          { id: 'PWR-', label: '-Vdc', description: 'Negative Input', wireColor: 'BLACK', wireGauge: '12 AWG', maxCurrent: '15A', connectedTo: 'Battery negative', function: 'Power return' },
        ],
        location: 'Terminals X1-X2',
        troubleshooting: ['Check 10A inline fuse', 'Measure voltage at terminals', 'Verify no voltage drop under load'],
      },
      {
        id: 'GEN_SENSE',
        name: 'Generator Voltage Sensing',
        type: 'signal' as const,
        rating: '0-500V AC',
        terminals: [
          { id: 'L1', label: 'L1', description: 'Phase 1', wireColor: 'RED', wireGauge: '16 AWG', connectedTo: 'Generator L1', function: 'Voltage sensing phase 1' },
          { id: 'L2', label: 'L2', description: 'Phase 2', wireColor: 'YELLOW', wireGauge: '16 AWG', connectedTo: 'Generator L2', function: 'Voltage sensing phase 2' },
          { id: 'L3', label: 'L3', description: 'Phase 3', wireColor: 'BLUE', wireGauge: '16 AWG', connectedTo: 'Generator L3', function: 'Voltage sensing phase 3' },
          { id: 'N', label: 'N', description: 'Neutral', wireColor: 'BLACK', wireGauge: '16 AWG', connectedTo: 'Generator Neutral', function: 'Neutral reference' },
        ],
        location: 'Terminals Y1-Y4',
        troubleshooting: ['Check PT connections if using transformers', 'Verify phase sequence', 'Measure phase-to-phase and phase-to-neutral'],
      },
      {
        id: 'OUTPUTS',
        name: 'Control Outputs',
        type: 'relay' as const,
        rating: '5A @ 250V AC',
        terminals: [
          { id: 'K1', label: 'K1', description: 'Fuel/Run', wireColor: 'ORANGE', wireGauge: '14 AWG', maxCurrent: '5A', connectedTo: 'Fuel solenoid', function: 'Engine run control' },
          { id: 'K2', label: 'K2', description: 'Start', wireColor: 'PURPLE', wireGauge: '14 AWG', maxCurrent: '5A', connectedTo: 'Starter relay', function: 'Crank control' },
          { id: 'K3', label: 'K3', description: 'Alarm', wireColor: 'WHITE', wireGauge: '14 AWG', maxCurrent: '5A', connectedTo: 'Alarm horn/beacon', function: 'Common alarm output' },
        ],
        location: 'Relay Block K1-K3',
        troubleshooting: ['Check relay click during operation', 'Verify contact ratings', 'Test continuity when energized'],
      },
      {
        id: 'USB',
        name: 'USB Configuration Port',
        type: 'signal' as const,
        rating: 'USB 2.0',
        terminals: [
          { id: 'USB', label: 'USB', description: 'USB Port', wireColor: 'N/A', wireGauge: 'N/A', connectedTo: 'PC/Laptop', function: 'Configuration and monitoring' },
        ],
        location: 'Front Panel',
        troubleshooting: ['Use Lovato software for configuration', 'Check USB driver installation', 'Try different USB cable if no connection'],
      },
    ],
  },
  SIEMENS: {
    name: 'Compatible with Siemens Controllers',
    color: '#0EA5E9',
    components: [
      {
        id: 'BATT',
        name: 'DC Power Supply',
        type: 'power' as const,
        rating: '18-32V DC',
        terminals: [
          { id: 'L+', label: 'L+', description: 'Power Positive', wireColor: 'RED', wireGauge: '10 AWG', maxCurrent: '25A', connectedTo: 'Battery positive', function: 'Main DC supply' },
          { id: 'M', label: 'M', description: 'Power Ground', wireColor: 'BLACK', wireGauge: '10 AWG', maxCurrent: '25A', connectedTo: 'Battery negative', function: 'System ground' },
          { id: 'PE', label: 'PE', description: 'Protective Earth', wireColor: 'GREEN/YELLOW', wireGauge: '10 AWG', connectedTo: 'Chassis ground', function: 'Safety earth' },
        ],
        location: 'Terminal Block X1',
        troubleshooting: ['Operating voltage 18-32V DC nominal', 'Check PE connection for safety', 'Verify no ground faults'],
      },
      {
        id: 'DIGITAL_IN',
        name: 'Digital Inputs',
        type: 'sensor' as const,
        rating: '24V DC',
        terminals: [
          { id: 'DI1', label: 'DI1', description: 'Emergency Stop', wireColor: 'RED', wireGauge: '18 AWG', connectedTo: 'E-Stop circuit', function: 'Emergency shutdown input' },
          { id: 'DI2', label: 'DI2', description: 'Remote Start', wireColor: 'WHITE', wireGauge: '18 AWG', connectedTo: 'Remote start contact', function: 'External start command' },
          { id: 'DI3', label: 'DI3', description: 'Load Request', wireColor: 'BROWN', wireGauge: '18 AWG', connectedTo: 'ATS/Load signal', function: 'Load demand input' },
          { id: 'DI4', label: 'DI4', description: 'Configurable', wireColor: 'GREY', wireGauge: '18 AWG', connectedTo: 'User defined', function: 'Programmable input' },
        ],
        location: 'Terminal Block X2',
        troubleshooting: ['Inputs require 24V DC signal', 'Check for open circuit on NC inputs', 'Verify input LED indicators'],
      },
      {
        id: 'PROFINET',
        name: 'PROFINET Interface',
        type: 'signal' as const,
        rating: '100 Mbps',
        terminals: [
          { id: 'PN1', label: 'P1', description: 'PROFINET Port 1', wireColor: 'N/A', wireGauge: 'CAT5e', connectedTo: 'PLC/SCADA', function: 'Industrial Ethernet' },
          { id: 'PN2', label: 'P2', description: 'PROFINET Port 2', wireColor: 'N/A', wireGauge: 'CAT5e', connectedTo: 'Network switch', function: 'Daisy chain connection' },
        ],
        location: 'RJ45 Ports',
        troubleshooting: ['Use shielded CAT5e or better', 'Check link/activity LEDs', 'Verify IP address configuration'],
      },
      {
        id: 'ANALOG_OUT',
        name: 'Analog Outputs',
        type: 'actuator' as const,
        rating: '0-10V / 4-20mA',
        terminals: [
          { id: 'AO1', label: 'AO1', description: 'Speed Setpoint', wireColor: 'WHITE', wireGauge: '18 AWG', connectedTo: 'Governor', function: 'Speed control output' },
          { id: 'AO2', label: 'AO2', description: 'Voltage Setpoint', wireColor: 'YELLOW', wireGauge: '18 AWG', connectedTo: 'AVR', function: 'Voltage control output' },
        ],
        location: 'Terminal Block X3',
        troubleshooting: ['Configure for voltage or current mode', 'Check load impedance', 'Calibrate output range'],
      },
    ],
  },
  ENKO: {
    name: 'Compatible with ENKO Controllers',
    color: '#16A34A',
    components: [
      {
        id: 'BATT',
        name: 'Battery Power',
        type: 'power' as const,
        rating: '9-36V DC',
        terminals: [
          { id: 'BAT+', label: 'BAT+', description: 'Battery Positive', wireColor: 'RED', wireGauge: '12 AWG', maxCurrent: '20A', connectedTo: 'Battery +12/24V', function: 'Power supply input' },
          { id: 'BAT-', label: 'BAT-', description: 'Battery Negative', wireColor: 'BLACK', wireGauge: '12 AWG', maxCurrent: '20A', connectedTo: 'Battery negative', function: 'Ground return' },
        ],
        location: 'Terminals 1-2',
        troubleshooting: ['Wide input range 9-36V DC', 'Internal protection against reverse polarity', 'Check main fuse rating'],
      },
      {
        id: 'ENGINE_CTRL',
        name: 'Engine Control',
        type: 'actuator' as const,
        rating: '8A max per output',
        terminals: [
          { id: 'FUEL', label: 'FUEL', description: 'Fuel Solenoid', wireColor: 'ORANGE', wireGauge: '14 AWG', maxCurrent: '8A', connectedTo: 'Fuel shutoff valve', function: 'Engine run control' },
          { id: 'CRANK', label: 'CRANK', description: 'Starter Motor', wireColor: 'PURPLE', wireGauge: '14 AWG', maxCurrent: '8A', connectedTo: 'Starter solenoid', function: 'Engine cranking' },
          { id: 'GLOW', label: 'GLOW', description: 'Preheat', wireColor: 'BROWN', wireGauge: '14 AWG', maxCurrent: '8A', connectedTo: 'Glow plug relay', function: 'Cold start preheat' },
        ],
        location: 'Terminals 3-5',
        troubleshooting: ['Outputs are high-side switches', 'Check for short circuits if fuse blows', 'Verify output timing in config'],
      },
      {
        id: 'SENSORS',
        name: 'Engine Sensors',
        type: 'sensor' as const,
        rating: '0-5V / Resistive',
        terminals: [
          { id: 'OIL', label: 'OIL', description: 'Oil Pressure', wireColor: 'BLUE', wireGauge: '18 AWG', connectedTo: 'Oil pressure sender', function: 'Oil pressure input' },
          { id: 'COOL', label: 'COOL', description: 'Coolant Temp', wireColor: 'GREEN', wireGauge: '18 AWG', connectedTo: 'Temp sender', function: 'Temperature input' },
          { id: 'RPM', label: 'RPM', description: 'Speed Pickup', wireColor: 'WHITE', wireGauge: '18 AWG', connectedTo: 'MPU/W terminal', function: 'Engine speed input' },
          { id: 'SGND', label: 'SGND', description: 'Sensor Ground', wireColor: 'BLACK', wireGauge: '18 AWG', connectedTo: 'Common ground', function: 'Sensor reference' },
        ],
        location: 'Terminals 6-9',
        troubleshooting: ['Configure sensor type in settings', 'Check sender resistance values', 'Verify clean ground connection'],
      },
      {
        id: 'GEN_VOLT',
        name: 'Generator Sensing',
        type: 'signal' as const,
        rating: '0-300V AC',
        terminals: [
          { id: 'GEN_L', label: 'GEN-L', description: 'Generator Line', wireColor: 'RED', wireGauge: '16 AWG', connectedTo: 'Generator output', function: 'AC voltage sensing' },
          { id: 'GEN_N', label: 'GEN-N', description: 'Generator Neutral', wireColor: 'BLACK', wireGauge: '16 AWG', connectedTo: 'Generator neutral', function: 'Neutral reference' },
        ],
        location: 'Terminals 10-11',
        troubleshooting: ['Connect after generator circuit breaker', 'Verify voltage matches controller rating', 'Check for voltage fluctuations'],
      },
      {
        id: 'GSM',
        name: 'GSM/GPRS Module',
        type: 'signal' as const,
        rating: '2G/3G',
        terminals: [
          { id: 'ANT', label: 'ANT', description: 'Antenna', wireColor: 'N/A', wireGauge: 'Coax', connectedTo: 'External antenna', function: 'Cellular connection' },
          { id: 'SIM', label: 'SIM', description: 'SIM Card Slot', wireColor: 'N/A', wireGauge: 'N/A', connectedTo: 'SIM card', function: 'Network authentication' },
        ],
        location: 'Internal Module',
        troubleshooting: ['Check SIM card is inserted correctly', 'Verify antenna connection', 'Check signal strength indicator'],
      },
    ],
  },
  VODIA: {
    name: 'Compatible with Volvo Penta VODIA',
    color: '#003057',
    components: [
      {
        id: 'DIAG',
        name: 'Diagnostic Connection',
        type: 'signal' as const,
        rating: 'J1939 CAN Bus',
        terminals: [
          { id: 'CAN_H', label: 'CAN-H', description: 'J1939 CAN High', wireColor: 'YELLOW', wireGauge: '18 AWG', connectedTo: 'ECU J1939 port', function: 'Diagnostic communication' },
          { id: 'CAN_L', label: 'CAN-L', description: 'J1939 CAN Low', wireColor: 'GREEN', wireGauge: '18 AWG', connectedTo: 'ECU J1939 port', function: 'Diagnostic communication' },
          { id: 'CAN_GND', label: 'SHIELD', description: 'CAN Shield', wireColor: 'BLACK', wireGauge: '18 AWG', connectedTo: 'ECU ground', function: 'Shield drain' },
        ],
        location: '9-Pin Diagnostic Connector',
        troubleshooting: ['Use genuine Volvo Penta diagnostic cable', 'Check CAN bus termination (60 ohms)', 'Verify ECU power before connecting'],
      },
      {
        id: 'POWER',
        name: 'ECU Power Supply',
        type: 'power' as const,
        rating: '24V DC',
        terminals: [
          { id: 'BATT+', label: 'BATT+', description: 'Battery Positive', wireColor: 'RED', wireGauge: '6 AWG', maxCurrent: '50A', connectedTo: 'Battery +24V', function: 'ECU main power' },
          { id: 'BATT-', label: 'BATT-', description: 'Battery Negative', wireColor: 'BLACK', wireGauge: '6 AWG', maxCurrent: '50A', connectedTo: 'Battery ground', function: 'ECU ground' },
          { id: 'KEY', label: 'KEY', description: 'Key Switch', wireColor: 'ORANGE', wireGauge: '14 AWG', connectedTo: 'Ignition switch', function: 'ECU wake signal' },
        ],
        location: 'ECU Main Connector',
        troubleshooting: ['Check battery voltage (24-28V)', 'Verify key switch signal when ON', 'Check main fuses 50A and 10A'],
      },
      {
        id: 'SENSORS',
        name: 'Engine Sensors',
        type: 'sensor' as const,
        rating: '0.5-4.5V / NTC',
        terminals: [
          { id: 'OIL_P', label: 'OIL-P', description: 'Oil Pressure', wireColor: 'ORANGE', wireGauge: '18 AWG', connectedTo: 'Oil pressure sensor', function: 'Pressure monitoring' },
          { id: 'COOL_T', label: 'COOL-T', description: 'Coolant Temp', wireColor: 'ORANGE', wireGauge: '18 AWG', connectedTo: 'Coolant sensor', function: 'Temperature monitoring' },
          { id: 'BOOST', label: 'BOOST', description: 'Boost Pressure', wireColor: 'ORANGE', wireGauge: '18 AWG', connectedTo: 'Boost sensor', function: 'Turbo monitoring' },
          { id: 'FUEL_T', label: 'FUEL-T', description: 'Fuel Temperature', wireColor: 'ORANGE', wireGauge: '18 AWG', connectedTo: 'Fuel temp sensor', function: 'Fuel monitoring' },
        ],
        location: 'ECU Sensor Connector',
        troubleshooting: ['Sensors are 0.5-4.5V ratiometric', 'NTC sensors for temperature', 'Check sensor grounds'],
      },
      {
        id: 'SPEED',
        name: 'Speed Sensors',
        type: 'sensor' as const,
        rating: 'Inductive/Hall',
        terminals: [
          { id: 'RPM+', label: 'RPM+', description: 'Crankshaft +', wireColor: 'WHITE', wireGauge: '18 AWG', connectedTo: 'Crank sensor +', function: 'Engine speed' },
          { id: 'RPM-', label: 'RPM-', description: 'Crankshaft -', wireColor: 'WHITE/BLACK', wireGauge: '18 AWG', connectedTo: 'Crank sensor -', function: 'Speed reference' },
          { id: 'CAM+', label: 'CAM+', description: 'Camshaft +', wireColor: 'GREY', wireGauge: '18 AWG', connectedTo: 'Cam sensor +', function: 'Position signal' },
          { id: 'CAM-', label: 'CAM-', description: 'Camshaft -', wireColor: 'GREY/BLACK', wireGauge: '18 AWG', connectedTo: 'Cam sensor -', function: 'Position reference' },
        ],
        location: 'ECU Sensor Connector',
        troubleshooting: ['Use shielded cable for speed sensors', 'Check air gap (0.5-1.5mm)', 'Verify sensor resistance'],
      },
      {
        id: 'INJECTORS',
        name: 'Fuel Injectors',
        type: 'actuator' as const,
        rating: '24V High Pressure',
        terminals: [
          { id: 'INJ1', label: 'INJ1', description: 'Injector Cyl 1', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 1', function: 'Fuel injection' },
          { id: 'INJ2', label: 'INJ2', description: 'Injector Cyl 2', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 2', function: 'Fuel injection' },
          { id: 'INJ3', label: 'INJ3', description: 'Injector Cyl 3', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 3', function: 'Fuel injection' },
          { id: 'INJ4', label: 'INJ4', description: 'Injector Cyl 4', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 4', function: 'Fuel injection' },
          { id: 'INJ5', label: 'INJ5', description: 'Injector Cyl 5', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 5', function: 'Fuel injection' },
          { id: 'INJ6', label: 'INJ6', description: 'Injector Cyl 6', wireColor: 'BROWN', wireGauge: '14 AWG', connectedTo: 'Injector 6', function: 'Fuel injection' },
        ],
        location: 'ECU Injector Connector',
        troubleshooting: ['Injector resistance 0.3-0.5 ohms', 'Check IQA codes programmed in VODIA', 'Verify rail pressure'],
      },
    ],
  },
};

// Programming Instructions - Compatible with 10 Controller Types
const PROGRAMMING_INSTRUCTIONS = {
  DSE: {
    title: 'Programming Guide - Compatible with DSE Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Configuration Mode',
        instructions: 'Press and hold STOP + AUTO buttons together for 5 seconds. Display will show "CONFIG" when ready.',
        keySequence: ['STOP', 'AUTO', 'HOLD 5s'],
      },
      {
        step: 2,
        title: 'Navigate to Parameter',
        instructions: 'Use UP/DOWN arrows to scroll through parameter groups. Press ENTER to select a group.',
        keySequence: ['▲', '▼', 'ENTER'],
      },
      {
        step: 3,
        title: 'Modify Parameter Value',
        instructions: 'With parameter selected, press ENTER to edit. Use UP/DOWN to change value. Press ENTER to confirm.',
        keySequence: ['ENTER', '▲/▼', 'ENTER'],
      },
      {
        step: 4,
        title: 'Save Changes',
        instructions: 'Press STOP to exit edit mode. Press and hold ENTER for 3 seconds to save all changes.',
        keySequence: ['STOP', 'ENTER (HOLD 3s)'],
      },
      {
        step: 5,
        title: 'Exit Configuration',
        instructions: 'Press STOP twice to exit configuration mode. Controller will restart with new settings.',
        keySequence: ['STOP', 'STOP'],
      },
    ],
    commonParameters: [
      { param: 'P001', name: 'Crank Duration', range: '1-30 seconds', default: '10' },
      { param: 'P002', name: 'Crank Rest Time', range: '5-60 seconds', default: '10' },
      { param: 'P003', name: 'Max Crank Attempts', range: '1-10', default: '3' },
      { param: 'P010', name: 'Warm Up Time', range: '0-600 seconds', default: '30' },
      { param: 'P011', name: 'Cool Down Time', range: '0-600 seconds', default: '60' },
      { param: 'P020', name: 'Oil Pressure Trip', range: '0-10 bar', default: '0.8' },
      { param: 'P021', name: 'High Temp Trip', range: '50-120°C', default: '98' },
      { param: 'P030', name: 'Over Speed Trip', range: '1000-2000 RPM', default: '1650' },
      { param: 'P031', name: 'Under Speed Trip', range: '1000-2000 RPM', default: '1350' },
    ],
  },
  COMAP: {
    title: 'Programming Guide - Compatible with ComAp Controllers',
    steps: [
      {
        step: 1,
        title: 'Access Main Menu',
        instructions: 'Press MENU button to enter main menu. Use navigation buttons to move between options.',
        keySequence: ['MENU'],
      },
      {
        step: 2,
        title: 'Enter Setpoints',
        instructions: 'Navigate to "Setpoints" menu. Enter password if prompted (default: 0000).',
        keySequence: ['▲/▼', 'ENTER', 'PASSWORD'],
      },
      {
        step: 3,
        title: 'Select Parameter Group',
        instructions: 'Groups include: Engine, Generator, Protection, Timers, Communication.',
        keySequence: ['▲/▼', 'ENTER'],
      },
      {
        step: 4,
        title: 'Modify Values',
        instructions: 'Select parameter with ENTER. Modify using arrow keys. Press ENTER to confirm.',
        keySequence: ['ENTER', '▲/▼/◄/►', 'ENTER'],
      },
      {
        step: 5,
        title: 'Save and Exit',
        instructions: 'Press ESC multiple times to return to main screen. Changes save automatically.',
        keySequence: ['ESC', 'ESC', 'ESC'],
      },
    ],
    commonParameters: [
      { param: 'Eng.CrnkTime', name: 'Crank Time', range: '1-60s', default: '10' },
      { param: 'Eng.CrnkPause', name: 'Crank Pause', range: '5-120s', default: '15' },
      { param: 'Eng.CrnkAtt', name: 'Crank Attempts', range: '1-9', default: '3' },
      { param: 'Eng.WarmUp', name: 'Warm Up Time', range: '0-3600s', default: '30' },
      { param: 'Prot.OilPres', name: 'Oil Pressure Limit', range: '0-1000 kPa', default: '80' },
      { param: 'Prot.CoolTemp', name: 'Coolant Temp Limit', range: '0-150°C', default: '98' },
    ],
  },
  WOODWARD: {
    title: 'Programming Guide - Compatible with Woodward Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Setup Mode',
        instructions: 'With engine OFF, press and hold ENTER + UP for 3 seconds. Display shows "SETUP".',
        keySequence: ['ENTER + ▲', 'HOLD 3s'],
      },
      {
        step: 2,
        title: 'Navigate Menu Tree',
        instructions: 'Use scroll wheel to navigate. Press wheel to select. Menu structure is hierarchical.',
        keySequence: ['SCROLL', 'PRESS'],
      },
      {
        step: 3,
        title: 'Edit Parameters',
        instructions: 'In edit mode, rotate wheel to change value. Press wheel to confirm. Hold wheel to cancel.',
        keySequence: ['ROTATE', 'PRESS/HOLD'],
      },
      {
        step: 4,
        title: 'Navigate to Different Levels',
        instructions: 'Press ESC to go up one level. Repeat until at main setup menu.',
        keySequence: ['ESC'],
      },
      {
        step: 5,
        title: 'Save Configuration',
        instructions: 'Navigate to "Save Config" and confirm. Controller will store settings to memory.',
        keySequence: ['Save Config', 'CONFIRM'],
      },
    ],
    commonParameters: [
      { param: '01.01', name: 'Start Mode', range: 'MAN/AUTO', default: 'AUTO' },
      { param: '02.05', name: 'Crank Time', range: '1-60s', default: '12' },
      { param: '03.10', name: 'Oil Pressure Low', range: '0-10 bar', default: '1.0' },
      { param: '03.15', name: 'Water Temp High', range: '50-120°C', default: '95' },
      { param: '04.01', name: 'Nominal Frequency', range: '45-65 Hz', default: '50' },
    ],
  },
  SMARTGEN: {
    title: 'Programming Guide - Compatible with SmartGen Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Program Mode',
        instructions: 'Press MENU, then enter access code (default: 1234). Select "Parameters".',
        keySequence: ['MENU', '1234', 'Parameters'],
      },
      {
        step: 2,
        title: 'Select Parameter Category',
        instructions: 'Categories: System, Engine, Generator, Protection, Communication, Display.',
        keySequence: ['▲/▼', 'OK'],
      },
      {
        step: 3,
        title: 'Modify Parameter',
        instructions: 'Navigate to parameter. Press OK to edit. Use arrow keys to adjust. Press OK to save.',
        keySequence: ['▲/▼', 'OK', '▲/▼', 'OK'],
      },
      {
        step: 4,
        title: 'Apply Changes',
        instructions: 'Some parameters require controller restart. Exit menu and cycle power if prompted.',
        keySequence: ['ESC', 'Power Cycle'],
      },
    ],
    commonParameters: [
      { param: 'SYS-001', name: 'Language', range: 'EN/CN/RU/ES', default: 'EN' },
      { param: 'ENG-010', name: 'Crank Time', range: '1-30s', default: '8' },
      { param: 'ENG-015', name: 'Idle Time', range: '0-600s', default: '30' },
      { param: 'PRO-001', name: 'Low Oil Pressure', range: '0-1000 kPa', default: '100' },
      { param: 'PRO-010', name: 'High Temperature', range: '50-150°C', default: '100' },
    ],
  },
  POWERWIZARD: {
    title: 'Programming Guide - Compatible with PowerWizard Controllers',
    steps: [
      {
        step: 1,
        title: 'Access Service Menu',
        instructions: 'Press and hold SERVICE button for 5 seconds. Enter service password if prompted.',
        keySequence: ['SERVICE', 'HOLD 5s', 'PASSWORD'],
      },
      {
        step: 2,
        title: 'Navigate to Configuration',
        instructions: 'Use soft keys to navigate. Select "Configuration" from service menu.',
        keySequence: ['SOFT KEY', 'Configuration'],
      },
      {
        step: 3,
        title: 'Select System',
        instructions: 'Choose between Engine Config, Generator Config, Protection Config, or System Config.',
        keySequence: ['Select System', 'OK'],
      },
      {
        step: 4,
        title: 'Modify Settings',
        instructions: 'Scroll to parameter. Press OK to edit. Use arrows to change. Press OK to accept.',
        keySequence: ['SCROLL', 'OK', '▲/▼', 'OK'],
      },
      {
        step: 5,
        title: 'Exit and Save',
        instructions: 'Press BACK to exit menus. Select "Save Configuration" when prompted.',
        keySequence: ['BACK', 'Save Configuration'],
      },
    ],
    commonParameters: [
      { param: 'ENG001', name: 'Crank Duration', range: '1-60 sec', default: '15' },
      { param: 'ENG010', name: 'Warm Up Time', range: '0-900 sec', default: '45' },
      { param: 'ENG020', name: 'Cool Down Time', range: '0-900 sec', default: '120' },
      { param: 'PRO001', name: 'Low Oil Pressure', range: '0-150 PSI', default: '15' },
      { param: 'PRO010', name: 'High Coolant Temp', range: '100-250°F', default: '210' },
    ],
  },
  DATAKOM: {
    title: 'Programming Guide - Compatible with Datakom Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Settings Mode',
        instructions: 'Press MENU button. Navigate to "Settings" and press ENTER. Default password: 0000.',
        keySequence: ['MENU', 'Settings', '0000'],
      },
      {
        step: 2,
        title: 'Select Parameter Group',
        instructions: 'Groups: Engine, Generator, Protection, Timers, Modbus, Display.',
        keySequence: ['▲/▼', 'ENTER'],
      },
      {
        step: 3,
        title: 'Edit Parameter',
        instructions: 'Navigate to parameter. Press ENTER to edit. Use +/- to change value.',
        keySequence: ['▲/▼', 'ENTER', '+/-'],
      },
      {
        step: 4,
        title: 'Confirm and Save',
        instructions: 'Press ENTER to confirm. Press ESC to return. Changes save automatically.',
        keySequence: ['ENTER', 'ESC'],
      },
    ],
    commonParameters: [
      { param: 'E01', name: 'Crank Time', range: '1-30s', default: '10' },
      { param: 'E02', name: 'Crank Rest', range: '5-60s', default: '10' },
      { param: 'E03', name: 'Crank Attempts', range: '1-5', default: '3' },
      { param: 'P01', name: 'Low Oil Pressure', range: '0-10 bar', default: '0.8' },
      { param: 'P02', name: 'High Coolant Temp', range: '50-120°C', default: '98' },
      { param: 'T01', name: 'Warm Up Time', range: '0-600s', default: '30' },
    ],
  },
  LOVATO: {
    title: 'Programming Guide - Compatible with Lovato Controllers',
    steps: [
      {
        step: 1,
        title: 'Access Programming Mode',
        instructions: 'Press PROG button. Enter access code (default: 1111) using arrow keys.',
        keySequence: ['PROG', '1111'],
      },
      {
        step: 2,
        title: 'Navigate Menu Structure',
        instructions: 'Use UP/DOWN to navigate menus. Press OK to enter submenu.',
        keySequence: ['▲/▼', 'OK'],
      },
      {
        step: 3,
        title: 'Modify Parameters',
        instructions: 'Select parameter and press OK. Use LEFT/RIGHT to change digits. Press OK to confirm.',
        keySequence: ['OK', '◄/►', 'OK'],
      },
      {
        step: 4,
        title: 'Exit and Save',
        instructions: 'Press PROG to exit. Select "Save" when prompted. Controller stores settings.',
        keySequence: ['PROG', 'Save'],
      },
    ],
    commonParameters: [
      { param: 'Par.01', name: 'Crank Duration', range: '1-60s', default: '12' },
      { param: 'Par.02', name: 'Pause Between Cranks', range: '5-120s', default: '15' },
      { param: 'Par.03', name: 'Max Crank Attempts', range: '1-10', default: '3' },
      { param: 'Par.10', name: 'Oil Pressure Limit', range: '0-10 bar', default: '0.8' },
      { param: 'Par.11', name: 'Temperature Limit', range: '50-120°C', default: '95' },
    ],
  },
  SIEMENS: {
    title: 'Programming Guide - Compatible with Siemens Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Service Mode',
        instructions: 'Press and hold ESC + ENTER for 5 seconds. Enter service password (default: 9999).',
        keySequence: ['ESC + ENTER', 'HOLD 5s', '9999'],
      },
      {
        step: 2,
        title: 'Navigate to Parameters',
        instructions: 'Select "Parameters" from service menu. Navigate using F1-F4 soft keys.',
        keySequence: ['Parameters', 'F1-F4'],
      },
      {
        step: 3,
        title: 'Select and Edit',
        instructions: 'Navigate to parameter. Press F3 to edit. Use arrow keys to adjust value.',
        keySequence: ['▲/▼', 'F3', '▲/▼'],
      },
      {
        step: 4,
        title: 'Confirm Changes',
        instructions: 'Press F4 to confirm. Press ESC repeatedly to exit. Cycle power to apply.',
        keySequence: ['F4', 'ESC', 'Power Cycle'],
      },
    ],
    commonParameters: [
      { param: 'r0010', name: 'Crank Time', range: '1-30s', default: '10' },
      { param: 'r0011', name: 'Crank Pause', range: '5-60s', default: '15' },
      { param: 'r0020', name: 'Oil Pressure Alarm', range: '0-1000 kPa', default: '80' },
      { param: 'r0021', name: 'Temperature Alarm', range: '50-150°C', default: '98' },
      { param: 'r0030', name: 'Overspeed Trip', range: '1500-2000 RPM', default: '1650' },
    ],
  },
  ENKO: {
    title: 'Programming Guide - Compatible with ENKO Controllers',
    steps: [
      {
        step: 1,
        title: 'Enter Setup Menu',
        instructions: 'Press MENU for 3 seconds. Display shows "SETUP". Enter PIN (default: 1234).',
        keySequence: ['MENU (HOLD 3s)', '1234'],
      },
      {
        step: 2,
        title: 'Browse Parameters',
        instructions: 'Use arrow keys to navigate parameter groups. Press OK to enter group.',
        keySequence: ['▲/▼', 'OK'],
      },
      {
        step: 3,
        title: 'Change Values',
        instructions: 'Select parameter. Press OK to edit. Use +/- or arrows to change. Press OK to save.',
        keySequence: ['OK', '+/-', 'OK'],
      },
      {
        step: 4,
        title: 'Exit Setup',
        instructions: 'Press MENU to exit. Select "Save All" when prompted. Wait for confirmation.',
        keySequence: ['MENU', 'Save All'],
      },
    ],
    commonParameters: [
      { param: 'CFG-01', name: 'Crank Duration', range: '1-30s', default: '10' },
      { param: 'CFG-02', name: 'Crank Rest Period', range: '5-60s', default: '12' },
      { param: 'CFG-03', name: 'Start Attempts', range: '1-5', default: '3' },
      { param: 'PRT-01', name: 'Low Oil Pressure', range: '0-10 bar', default: '0.8' },
      { param: 'PRT-02', name: 'High Temperature', range: '50-120°C', default: '95' },
      { param: 'TMR-01', name: 'Warm Up Timer', range: '0-600s', default: '30' },
    ],
  },
  VODIA: {
    title: 'Programming Guide - Compatible with Volvo Penta VODIA',
    steps: [
      {
        step: 1,
        title: 'Connect VODIA Tool',
        instructions: 'Connect VODIA diagnostic adapter to engine 9-pin diagnostic port. Launch VODIA software on laptop.',
        keySequence: ['Connect Cable', 'Open VODIA'],
      },
      {
        step: 2,
        title: 'Establish Communication',
        instructions: 'Click "Connect" in VODIA. Software will detect ECU type. Wait for full communication.',
        keySequence: ['Connect', 'Wait for ECU'],
      },
      {
        step: 3,
        title: 'Read Current Parameters',
        instructions: 'Navigate to Parameters menu. Read all current values before making changes.',
        keySequence: ['Parameters', 'Read All'],
      },
      {
        step: 4,
        title: 'Modify Parameters',
        instructions: 'Select parameter to change. Enter new value. Changes are stored temporarily.',
        keySequence: ['Select', 'Edit', 'Enter Value'],
      },
      {
        step: 5,
        title: 'Write to ECU',
        instructions: 'Click "Write" to program changes to ECU. Key must be ON. Wait for confirmation.',
        keySequence: ['Write', 'Confirm'],
      },
    ],
    commonParameters: [
      { param: 'EMS-001', name: 'Idle Speed', range: '600-900 RPM', default: '750' },
      { param: 'EMS-010', name: 'High Idle Speed', range: '1500-1800 RPM', default: '1500' },
      { param: 'EMS-020', name: 'Low Oil Pressure Alarm', range: '50-200 kPa', default: '100' },
      { param: 'EMS-021', name: 'High Coolant Temp Alarm', range: '90-110°C', default: '102' },
      { param: 'EMS-030', name: 'Overspeed Limit', range: '1800-2200 RPM', default: '1950' },
      { param: 'EMS-040', name: 'Start Motor Timeout', range: '5-30s', default: '15' },
    ],
  },
};

interface WiringDiagramsProps {
  controllerType: keyof typeof WIRING_CONFIGS;
  className?: string;
}

export default function WiringDiagrams({ controllerType, className = '' }: WiringDiagramsProps) {
  const [activeTab, setActiveTab] = useState<'wiring' | 'programming'>('wiring');
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['BATT']);

  const config = WIRING_CONFIGS[controllerType];
  const programming = PROGRAMMING_INSTRUCTIONS[controllerType];

  const toggleGroup = (id: string) => {
    setExpandedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div
        className="p-4 border-b border-slate-700"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <h3 className="text-lg font-bold text-white">{config.name}</h3>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => setActiveTab('wiring')}
            className={`px-4 py-1 rounded text-sm font-medium transition-all ${
              activeTab === 'wiring'
                ? 'bg-white text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Wiring Diagram
          </button>
          <button
            onClick={() => setActiveTab('programming')}
            className={`px-4 py-1 rounded text-sm font-medium transition-all ${
              activeTab === 'programming'
                ? 'bg-white text-slate-900'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            Programming Guide
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'wiring' ? (
            <motion.div
              key="wiring"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* Wiring Components List */}
              <div className="space-y-2">
                {config.components.map((component) => (
                  <div
                    key={component.id}
                    className="border border-slate-700 rounded-lg overflow-hidden"
                  >
                    {/* Component Header */}
                    <button
                      onClick={() => toggleGroup(component.id)}
                      className="w-full p-3 flex items-center justify-between bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ComponentIcon type={component.type} />
                        <div className="text-left">
                          <div className="text-white font-medium">{component.name}</div>
                          <div className="text-slate-400 text-xs">{component.location} | {component.rating}</div>
                        </div>
                      </div>
                      <motion.svg
                        className="w-5 h-5 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: expandedGroups.includes(component.id) ? 180 : 0 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </motion.svg>
                    </button>

                    {/* Component Details */}
                    <AnimatePresence>
                      {expandedGroups.includes(component.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-slate-700"
                        >
                          <div className="p-3 space-y-3">
                            {/* Terminals Table */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead className="bg-slate-800">
                                  <tr>
                                    <th className="p-2 text-left text-slate-400">Terminal</th>
                                    <th className="p-2 text-left text-slate-400">Description</th>
                                    <th className="p-2 text-left text-slate-400">Wire</th>
                                    <th className="p-2 text-left text-slate-400">Connected To</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {component.terminals.map((terminal) => (
                                    <tr key={terminal.id} className="border-t border-slate-700">
                                      <td className="p-2">
                                        <span className="font-mono font-bold text-cyan-400">{terminal.label}</span>
                                      </td>
                                      <td className="p-2 text-slate-300">{terminal.description}</td>
                                      <td className="p-2">
                                        <div className="flex items-center gap-1">
                                          <div
                                            className="w-4 h-2 rounded"
                                            style={{ backgroundColor: getWireColor(terminal.wireColor) }}
                                          />
                                          <span className="text-slate-400">{terminal.wireColor}</span>
                                        </div>
                                        <span className="text-slate-500 text-[10px]">{terminal.wireGauge}</span>
                                      </td>
                                      <td className="p-2 text-slate-300">{terminal.connectedTo}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Troubleshooting Tips */}
                            <div className="bg-amber-500/10 border border-amber-500/30 rounded p-2">
                              <div className="text-amber-400 font-bold text-xs mb-1">Troubleshooting:</div>
                              <ul className="text-slate-300 text-xs space-y-1">
                                {component.troubleshooting.map((tip, idx) => (
                                  <li key={idx} className="flex gap-2">
                                    <span className="text-amber-400">•</span>
                                    {tip}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="programming"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Programming Guide */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-white">{programming.title}</h4>

                {/* Steps */}
                <div className="space-y-3">
                  {programming.steps.map((step) => (
                    <div key={step.step} className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-start gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ backgroundColor: config.color }}
                        >
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{step.title}</div>
                          <div className="text-slate-400 text-sm mt-1">{step.instructions}</div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {step.keySequence.map((key, idx) => (
                              <span key={idx}>
                                <kbd className="px-2 py-1 bg-slate-700 text-cyan-400 rounded text-xs font-mono">
                                  {key}
                                </kbd>
                                {idx < step.keySequence.length - 1 && (
                                  <span className="text-slate-500 mx-1">→</span>
                                )}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Common Parameters */}
                <div className="mt-4">
                  <h5 className="text-white font-bold mb-2">Common Parameters</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead className="bg-slate-800">
                        <tr>
                          <th className="p-2 text-left text-slate-400">Parameter</th>
                          <th className="p-2 text-left text-slate-400">Name</th>
                          <th className="p-2 text-left text-slate-400">Range</th>
                          <th className="p-2 text-left text-slate-400">Default</th>
                        </tr>
                      </thead>
                      <tbody>
                        {programming.commonParameters.map((param, idx) => (
                          <tr key={idx} className="border-t border-slate-700">
                            <td className="p-2 font-mono text-cyan-400">{param.param}</td>
                            <td className="p-2 text-slate-300">{param.name}</td>
                            <td className="p-2 text-slate-400">{param.range}</td>
                            <td className="p-2 text-green-400">{param.default}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Component Icon
function ComponentIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    power: '⚡',
    fuse: '🔌',
    relay: '🔲',
    breaker: '⬛',
    sensor: '📡',
    actuator: '⚙️',
    signal: '📶',
    ground: '⏚',
  };

  return (
    <span className="text-xl">{icons[type] || '🔧'}</span>
  );
}

// Wire Color Helper
function getWireColor(color: string): string {
  const colors: Record<string, string> = {
    RED: '#ef4444',
    BLACK: '#1f2937',
    BLUE: '#3b82f6',
    GREEN: '#22c55e',
    YELLOW: '#eab308',
    ORANGE: '#f97316',
    WHITE: '#f5f5f5',
    BROWN: '#92400e',
    PURPLE: '#a855f7',
    PINK: '#ec4899',
    GREY: '#6b7280',
    'WHITE/BLACK': '#9ca3af',
    'BLACK/WHITE': '#4b5563',
  };

  return colors[color.toUpperCase()] || '#6b7280';
}
