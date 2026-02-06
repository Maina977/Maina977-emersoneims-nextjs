'use client';

/**
 * Wiring Diagrams Component
 * Interactive, labeled wiring diagrams for all 5 controller types
 * Shows numbered connections, fuses, breakers, relays, starters, chargers
 * Includes programming guidance without laptop
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

// Controller Wiring Configurations
const WIRING_CONFIGS = {
  TYPE_A: {
    name: 'Series A Controller Wiring',
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
  TYPE_B: {
    name: 'Series B Controller Wiring',
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
  TYPE_C: {
    name: 'Series C Controller Wiring',
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
  TYPE_D: {
    name: 'Series D Controller Wiring',
    color: '#EA580C',
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
  TYPE_E: {
    name: 'Series E Controller Wiring',
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
};

// Programming Instructions
const PROGRAMMING_INSTRUCTIONS = {
  TYPE_A: {
    title: 'Series A Controller Programming (Without Laptop)',
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
  TYPE_B: {
    title: 'Series B Controller Programming (Without Laptop)',
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
  TYPE_C: {
    title: 'Series C Controller Programming (Without Laptop)',
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
  TYPE_D: {
    title: 'Series D Controller Programming (Without Laptop)',
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
  TYPE_E: {
    title: 'Series E Controller Programming (Without Laptop)',
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
