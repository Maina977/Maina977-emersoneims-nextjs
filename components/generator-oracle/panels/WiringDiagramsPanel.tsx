'use client';

/**
 * COMPREHENSIVE WIRING & SCHEMATIC DIAGRAMS PANEL
 * Complete electrical documentation for ALL controller brands and models
 *
 * Supported Controllers:
 * - DSE: 7320, 7310, 6020, 6120, 4520, 8610, 8660
 * - ComAp: InteliLite NT, InteliGen NT, InteliSys NT, InteliMains NT
 * - Woodward: easYgen 3000, easYgen 2000, DTSC-200
 * - SmartGen: HGM6120, HGM7220, HGM9320, HGM9510
 * - PowerWizard 1.0, 1.1, 2.0
 *
 * Diagram Types:
 * - Main Power & Battery
 * - Starting Circuits
 * - Charging Systems
 * - Fuel Control
 * - Cooling Systems
 * - Oil Pressure Circuits
 * - Temperature Sensing
 * - Speed Sensing (MPU)
 * - Generator Output (CT/VT)
 * - Communication (CAN, RS485, Modbus)
 * - Protection Circuits
 * - AVR Connections
 * - Load Sharing
 * - Remote Start/Stop
 * - Emergency Stop
 */

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== CONTROLLER DATABASE ====================
interface ControllerModel {
  id: string;
  brand: string;
  model: string;
  type: 'genset' | 'ats' | 'load-share' | 'mains';
  features: string[];
  pinCount: number;
}

const CONTROLLERS: ControllerModel[] = [
  // DSE Controllers
  { id: 'dse-7320', brand: 'DSE', model: '7320 MKII', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 32 },
  { id: 'dse-7310', brand: 'DSE', model: '7310 MKII', type: 'genset', features: ['AMF', 'CAN'], pinCount: 28 },
  { id: 'dse-6020', brand: 'DSE', model: '6020 MKII', type: 'genset', features: ['Manual', 'Auto'], pinCount: 20 },
  { id: 'dse-6120', brand: 'DSE', model: '6120 MKII', type: 'genset', features: ['AMF', 'Auto'], pinCount: 24 },
  { id: 'dse-4520', brand: 'DSE', model: '4520', type: 'genset', features: ['Compact', 'Basic'], pinCount: 16 },
  { id: 'dse-8610', brand: 'DSE', model: '8610 MKII', type: 'load-share', features: ['Load Share', 'Sync', 'CAN'], pinCount: 40 },
  { id: 'dse-8660', brand: 'DSE', model: '8660 MKII', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 44 },

  // ComAp Controllers
  { id: 'comap-intelilite', brand: 'ComAp', model: 'InteliLite NT', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24 },
  { id: 'comap-inteligen', brand: 'ComAp', model: 'InteliGen NT', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 36 },
  { id: 'comap-intelisys', brand: 'ComAp', model: 'InteliSys NT', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 48 },
  { id: 'comap-intelimains', brand: 'ComAp', model: 'InteliMains NT', type: 'mains', features: ['Mains Decoupling'], pinCount: 20 },

  // Woodward Controllers
  { id: 'woodward-easygen3000', brand: 'Woodward', model: 'easYgen 3000', type: 'genset', features: ['AMF', 'Load Share', 'Modbus'], pinCount: 40 },
  { id: 'woodward-easygen2000', brand: 'Woodward', model: 'easYgen 2000', type: 'genset', features: ['AMF', 'Basic'], pinCount: 28 },
  { id: 'woodward-dtsc200', brand: 'Woodward', model: 'DTSC-200', type: 'genset', features: ['Digital', 'CAN'], pinCount: 24 },

  // SmartGen Controllers
  { id: 'smartgen-hgm6120', brand: 'SmartGen', model: 'HGM6120', type: 'genset', features: ['AMF', 'Basic'], pinCount: 20 },
  { id: 'smartgen-hgm7220', brand: 'SmartGen', model: 'HGM7220', type: 'genset', features: ['AMF', 'CAN'], pinCount: 28 },
  { id: 'smartgen-hgm9320', brand: 'SmartGen', model: 'HGM9320', type: 'genset', features: ['AMF', 'Load Share'], pinCount: 36 },
  { id: 'smartgen-hgm9510', brand: 'SmartGen', model: 'HGM9510', type: 'load-share', features: ['Sync', 'PMS'], pinCount: 44 },

  // PowerWizard Controllers
  { id: 'powerwizard-10', brand: 'PowerWizard', model: '1.0', type: 'genset', features: ['Basic', 'CAT'], pinCount: 20 },
  { id: 'powerwizard-11', brand: 'PowerWizard', model: '1.1', type: 'genset', features: ['AMF', 'CAT'], pinCount: 24 },
  { id: 'powerwizard-20', brand: 'PowerWizard', model: '2.0', type: 'genset', features: ['Advanced', 'Load Share'], pinCount: 32 },
];

// ==================== CIRCUIT TYPES ====================
interface CircuitType {
  id: string;
  name: string;
  icon: string;
  category: 'power' | 'control' | 'sensing' | 'communication' | 'protection' | 'output';
  description: string;
  components: string[];
}

const CIRCUIT_TYPES: CircuitType[] = [
  // Power Circuits
  { id: 'main-power', name: 'Main Power Supply', icon: '🔋', category: 'power', description: 'Battery to controller power circuit', components: ['Battery', 'Main Fuse', 'Isolator Switch', 'Controller B+/B-'] },
  { id: 'charging', name: 'Battery Charging', icon: '⚡', category: 'power', description: 'Alternator charging circuit', components: ['Alternator D+', 'Charge Lamp', 'Controller Charge Input'] },
  { id: 'dc-supply', name: 'DC Auxiliary Supply', icon: '🔌', category: 'power', description: '12V/24V auxiliary power', components: ['DC-DC Converter', 'Auxiliary Fuses', 'Peripheral Power'] },

  // Control Circuits
  { id: 'starting', name: 'Engine Starting', icon: '🔑', category: 'control', description: 'Starter motor control circuit', components: ['Start Relay', 'Starter Motor', 'Crank Disconnect', 'Start Limit Timer'] },
  { id: 'fuel-control', name: 'Fuel System', icon: '⛽', category: 'control', description: 'Fuel solenoid and pump control', components: ['Fuel Solenoid', 'Fuel Pump', 'Fuel Level Sender', 'Low Fuel Switch'] },
  { id: 'cooling', name: 'Cooling System', icon: '❄️', category: 'control', description: 'Radiator fan and coolant control', components: ['Radiator Fan', 'Coolant Heater', 'Thermostat', 'Water Pump'] },
  { id: 'glow-plug', name: 'Glow Plug/Preheat', icon: '🔥', category: 'control', description: 'Cold start preheat circuit', components: ['Glow Plug Relay', 'Glow Plugs', 'Preheat Timer'] },
  { id: 'emergency-stop', name: 'Emergency Stop', icon: '🛑', category: 'control', description: 'E-stop and safety shutdown', components: ['E-Stop Button', 'Safety Relay', 'Fuel Cutoff', 'Air Shutoff'] },
  { id: 'remote-start', name: 'Remote Start/Stop', icon: '📡', category: 'control', description: 'Remote control interface', components: ['Remote Start Input', 'Remote Stop Input', 'Mode Select', 'Status Output'] },

  // Sensing Circuits
  { id: 'oil-pressure', name: 'Oil Pressure', icon: '🛢️', category: 'sensing', description: 'Engine oil pressure monitoring', components: ['Oil Pressure Sender', 'Low Oil Switch', 'Oil Pressure Gauge'] },
  { id: 'coolant-temp', name: 'Coolant Temperature', icon: '🌡️', category: 'sensing', description: 'Engine temperature monitoring', components: ['Temp Sender', 'High Temp Switch', 'Temp Gauge'] },
  { id: 'speed-sensing', name: 'Speed Sensing (MPU)', icon: '🔄', category: 'sensing', description: 'Engine RPM pickup', components: ['Magnetic Pickup', 'Flywheel Ring Gear', 'Speed Input'] },
  { id: 'fuel-level', name: 'Fuel Level', icon: '⛽', category: 'sensing', description: 'Fuel tank level monitoring', components: ['Fuel Level Sender', 'Low Fuel Float', 'Fuel Gauge'] },
  { id: 'battery-voltage', name: 'Battery Monitoring', icon: '🔋', category: 'sensing', description: 'Battery voltage sensing', components: ['Voltage Divider', 'Battery Sense Input'] },

  // Generator Output
  { id: 'generator-output', name: 'Generator Output (CT/VT)', icon: '⚙️', category: 'output', description: 'Current and voltage transformers', components: ['CT (L1/L2/L3)', 'VT (Phase Voltage)', 'Neutral CT', 'Earth Fault CT'] },
  { id: 'avr-circuit', name: 'AVR Connection', icon: '📊', category: 'output', description: 'Automatic voltage regulator', components: ['AVR', 'Exciter Field', 'Sensing Voltage', 'PMG'] },
  { id: 'load-output', name: 'Load Connections', icon: '💡', category: 'output', description: 'Main generator output', components: ['Main Breaker', 'Bus Bars', 'Load Terminals', 'Neutral Bar'] },

  // Communication
  { id: 'can-bus', name: 'CAN Bus Network', icon: '🔗', category: 'communication', description: 'Controller area network', components: ['CAN-H', 'CAN-L', 'Termination Resistor', 'CAN Shield'] },
  { id: 'rs485', name: 'RS485/Modbus', icon: '📶', category: 'communication', description: 'Serial communication', components: ['RS485-A', 'RS485-B', 'RS485 GND', 'Bias Resistors'] },
  { id: 'ethernet', name: 'Ethernet/IP', icon: '🌐', category: 'communication', description: 'Network communication', components: ['RJ45 Port', 'Network Switch', 'IP Gateway'] },

  // Protection
  { id: 'earth-fault', name: 'Earth Fault Protection', icon: '⚠️', category: 'protection', description: 'Ground fault detection', components: ['Earth Fault CT', 'Earth Fault Relay', 'Trip Circuit'] },
  { id: 'overcurrent', name: 'Overcurrent Protection', icon: '🛡️', category: 'protection', description: 'Current overload protection', components: ['Overcurrent CT', 'OCR Relay', 'Trip Coil'] },
  { id: 'reverse-power', name: 'Reverse Power', icon: '↩️', category: 'protection', description: 'Reverse power protection', components: ['Power Direction Relay', 'Wattmetric Element'] },
];

// ==================== WIRE COLOR STANDARDS ====================
const WIRE_COLORS = {
  // Power
  'battery-positive': { hex: '#ef4444', name: 'Red', usage: 'Battery +, Main power' },
  'battery-negative': { hex: '#1f2937', name: 'Black', usage: 'Battery -, Ground' },
  'ground': { hex: '#22c55e', name: 'Green/Yellow', usage: 'Protective earth' },

  // Control
  'start-signal': { hex: '#a855f7', name: 'Purple', usage: 'Start output' },
  'fuel-control': { hex: '#f97316', name: 'Orange', usage: 'Fuel solenoid' },
  'stop-signal': { hex: '#ec4899', name: 'Pink', usage: 'Stop/shutdown' },

  // Sensing
  'sensor-signal': { hex: '#3b82f6', name: 'Blue', usage: 'Sensor signals' },
  'temp-sender': { hex: '#92400e', name: 'Brown', usage: 'Temperature' },
  'oil-sender': { hex: '#eab308', name: 'Yellow', usage: 'Oil pressure' },
  'speed-signal': { hex: '#14b8a6', name: 'Cyan', usage: 'Speed/MPU' },

  // Generator
  'phase-l1': { hex: '#ef4444', name: 'Red/Brown', usage: 'Phase L1' },
  'phase-l2': { hex: '#eab308', name: 'Yellow', usage: 'Phase L2' },
  'phase-l3': { hex: '#3b82f6', name: 'Blue', usage: 'Phase L3' },
  'neutral': { hex: '#f8fafc', name: 'White/Black', usage: 'Neutral' },

  // Communication
  'can-high': { hex: '#22c55e', name: 'Green', usage: 'CAN-H' },
  'can-low': { hex: '#eab308', name: 'Yellow/Orange', usage: 'CAN-L' },
  'rs485-a': { hex: '#3b82f6', name: 'Blue', usage: 'RS485-A (+)' },
  'rs485-b': { hex: '#f97316', name: 'Orange', usage: 'RS485-B (-)' },

  // Shielding
  'shield': { hex: '#6b7280', name: 'Gray', usage: 'Shielding' },
};

// ==================== PIN CONFIGURATION DATA ====================
interface PinConfig {
  pin: string;
  name: string;
  function: string;
  wireColor: string;
  circuit: string;
}

const CONTROLLER_PINS: { [key: string]: PinConfig[] } = {
  'dse-7320': [
    { pin: '1', name: 'B+', function: 'Battery Positive', wireColor: 'Red', circuit: 'main-power' },
    { pin: '2', name: 'B-', function: 'Battery Negative', wireColor: 'Black', circuit: 'main-power' },
    { pin: '3', name: 'START', function: 'Crank Output', wireColor: 'Purple', circuit: 'starting' },
    { pin: '4', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', circuit: 'fuel-control' },
    { pin: '5', name: 'STOP', function: 'Stop Solenoid', wireColor: 'Pink', circuit: 'emergency-stop' },
    { pin: '6', name: 'OIL-P', function: 'Oil Pressure Sender', wireColor: 'Yellow', circuit: 'oil-pressure' },
    { pin: '7', name: 'TEMP', function: 'Coolant Temp Sender', wireColor: 'Brown', circuit: 'coolant-temp' },
    { pin: '8', name: 'MPU', function: 'Magnetic Pickup', wireColor: 'Cyan', circuit: 'speed-sensing' },
    { pin: '9', name: 'MPU-', function: 'MPU Return', wireColor: 'White', circuit: 'speed-sensing' },
    { pin: '10', name: 'FUEL-LVL', function: 'Fuel Level Sender', wireColor: 'Blue', circuit: 'fuel-level' },
    { pin: '11', name: 'CT-L1', function: 'Current Transformer L1', wireColor: 'Red', circuit: 'generator-output' },
    { pin: '12', name: 'CT-L2', function: 'Current Transformer L2', wireColor: 'Yellow', circuit: 'generator-output' },
    { pin: '13', name: 'CT-L3', function: 'Current Transformer L3', wireColor: 'Blue', circuit: 'generator-output' },
    { pin: '14', name: 'CT-COM', function: 'CT Common', wireColor: 'Black', circuit: 'generator-output' },
    { pin: '15', name: 'GEN-L1', function: 'Generator Voltage L1', wireColor: 'Red', circuit: 'generator-output' },
    { pin: '16', name: 'GEN-L2', function: 'Generator Voltage L2', wireColor: 'Yellow', circuit: 'generator-output' },
    { pin: '17', name: 'GEN-L3', function: 'Generator Voltage L3', wireColor: 'Blue', circuit: 'generator-output' },
    { pin: '18', name: 'GEN-N', function: 'Generator Neutral', wireColor: 'White', circuit: 'generator-output' },
    { pin: '19', name: 'MAINS-L1', function: 'Mains Voltage L1', wireColor: 'Red', circuit: 'generator-output' },
    { pin: '20', name: 'MAINS-N', function: 'Mains Neutral', wireColor: 'White', circuit: 'generator-output' },
    { pin: '21', name: 'CAN-H', function: 'CAN Bus High', wireColor: 'Green', circuit: 'can-bus' },
    { pin: '22', name: 'CAN-L', function: 'CAN Bus Low', wireColor: 'Yellow', circuit: 'can-bus' },
    { pin: '23', name: 'RS485-A', function: 'RS485 Data+', wireColor: 'Blue', circuit: 'rs485' },
    { pin: '24', name: 'RS485-B', function: 'RS485 Data-', wireColor: 'Orange', circuit: 'rs485' },
    { pin: '25', name: 'DI-1', function: 'Digital Input 1', wireColor: 'Gray', circuit: 'remote-start' },
    { pin: '26', name: 'DI-2', function: 'Digital Input 2', wireColor: 'Gray', circuit: 'remote-start' },
    { pin: '27', name: 'DO-1', function: 'Digital Output 1', wireColor: 'Gray', circuit: 'remote-start' },
    { pin: '28', name: 'DO-2', function: 'Digital Output 2', wireColor: 'Gray', circuit: 'remote-start' },
    { pin: '29', name: 'CHARGE', function: 'Charge Alternator D+', wireColor: 'Blue', circuit: 'charging' },
    { pin: '30', name: 'PRE-HEAT', function: 'Glow Plug Output', wireColor: 'Orange', circuit: 'glow-plug' },
    { pin: '31', name: 'AUX-OUT', function: 'Auxiliary Output', wireColor: 'Gray', circuit: 'cooling' },
    { pin: '32', name: 'E-STOP', function: 'Emergency Stop Input', wireColor: 'Red', circuit: 'emergency-stop' },
  ],
  'comap-inteligen': [
    { pin: 'A1', name: 'B+', function: 'Battery Positive 9-36VDC', wireColor: 'Red', circuit: 'main-power' },
    { pin: 'A2', name: 'B-', function: 'Battery Negative', wireColor: 'Black', circuit: 'main-power' },
    { pin: 'A3', name: 'CRANK', function: 'Starter Output', wireColor: 'Purple', circuit: 'starting' },
    { pin: 'A4', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', circuit: 'fuel-control' },
    { pin: 'A5', name: 'IDLE', function: 'Idle Solenoid', wireColor: 'Yellow', circuit: 'fuel-control' },
    { pin: 'B1', name: 'OIL', function: 'Oil Pressure 4-20mA', wireColor: 'Brown', circuit: 'oil-pressure' },
    { pin: 'B2', name: 'COOL', function: 'Coolant Temp NTC/PT100', wireColor: 'Blue', circuit: 'coolant-temp' },
    { pin: 'B3', name: 'FUEL-S', function: 'Fuel Level 0-10V', wireColor: 'Green', circuit: 'fuel-level' },
    { pin: 'B4', name: 'SPEED', function: 'Speed Pickup W', wireColor: 'Cyan', circuit: 'speed-sensing' },
    { pin: 'B5', name: 'SPEED-', function: 'Speed Pickup Return', wireColor: 'White', circuit: 'speed-sensing' },
    { pin: 'C1', name: 'GEN-L1', function: 'Gen Voltage L1-N', wireColor: 'Red', circuit: 'generator-output' },
    { pin: 'C2', name: 'GEN-L2', function: 'Gen Voltage L2-N', wireColor: 'Yellow', circuit: 'generator-output' },
    { pin: 'C3', name: 'GEN-L3', function: 'Gen Voltage L3-N', wireColor: 'Blue', circuit: 'generator-output' },
    { pin: 'C4', name: 'GEN-N', function: 'Gen Neutral', wireColor: 'White', circuit: 'generator-output' },
    { pin: 'D1', name: 'CAN1-H', function: 'CAN Bus 1 High', wireColor: 'Green', circuit: 'can-bus' },
    { pin: 'D2', name: 'CAN1-L', function: 'CAN Bus 1 Low', wireColor: 'Yellow', circuit: 'can-bus' },
    { pin: 'D3', name: 'CAN2-H', function: 'CAN Bus 2 High', wireColor: 'Green', circuit: 'can-bus' },
    { pin: 'D4', name: 'CAN2-L', function: 'CAN Bus 2 Low', wireColor: 'Yellow', circuit: 'can-bus' },
  ],
  'smartgen-hgm9320': [
    { pin: '1', name: 'DC+', function: 'Power Supply +', wireColor: 'Red', circuit: 'main-power' },
    { pin: '2', name: 'DC-', function: 'Power Supply -', wireColor: 'Black', circuit: 'main-power' },
    { pin: '3', name: 'START', function: 'Start Relay', wireColor: 'Purple', circuit: 'starting' },
    { pin: '4', name: 'STOP', function: 'Stop Relay', wireColor: 'Pink', circuit: 'emergency-stop' },
    { pin: '5', name: 'FUEL', function: 'Fuel Valve', wireColor: 'Orange', circuit: 'fuel-control' },
    { pin: '6', name: 'PREHEAT', function: 'Preheat Relay', wireColor: 'Yellow', circuit: 'glow-plug' },
    { pin: '7', name: 'OIL-P', function: 'Oil Pressure Input', wireColor: 'Brown', circuit: 'oil-pressure' },
    { pin: '8', name: 'WATER-T', function: 'Water Temp Input', wireColor: 'Blue', circuit: 'coolant-temp' },
    { pin: '9', name: 'SPEED', function: 'Speed Sensor+', wireColor: 'Cyan', circuit: 'speed-sensing' },
    { pin: '10', name: 'SPEED-', function: 'Speed Sensor-', wireColor: 'White', circuit: 'speed-sensing' },
    { pin: '11', name: 'FUEL-L', function: 'Fuel Level', wireColor: 'Green', circuit: 'fuel-level' },
    { pin: '12', name: 'AIN1', function: 'Analog Input 1', wireColor: 'Gray', circuit: 'sensing' },
  ],
  'woodward-easygen3000': [
    { pin: 'X1:1', name: '+UB', function: 'Power Supply +', wireColor: 'Red', circuit: 'main-power' },
    { pin: 'X1:2', name: '-UB', function: 'Power Supply -', wireColor: 'Black', circuit: 'main-power' },
    { pin: 'X2:1', name: 'START', function: 'Starter Relay', wireColor: 'Purple', circuit: 'starting' },
    { pin: 'X2:2', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', circuit: 'fuel-control' },
    { pin: 'X2:3', name: 'GCB', function: 'Gen Circuit Breaker', wireColor: 'Gray', circuit: 'protection' },
    { pin: 'X2:4', name: 'MCB', function: 'Mains Circuit Breaker', wireColor: 'Gray', circuit: 'protection' },
    { pin: 'X3:1', name: 'MPU+', function: 'Speed Pickup +', wireColor: 'Cyan', circuit: 'speed-sensing' },
    { pin: 'X3:2', name: 'MPU-', function: 'Speed Pickup -', wireColor: 'White', circuit: 'speed-sensing' },
    { pin: 'X4:1', name: 'OIL', function: 'Oil Pressure 4-20mA', wireColor: 'Brown', circuit: 'oil-pressure' },
    { pin: 'X4:2', name: 'TEMP', function: 'Coolant Temp', wireColor: 'Blue', circuit: 'coolant-temp' },
    { pin: 'X5:1', name: 'CAN-H', function: 'CAN High', wireColor: 'Green', circuit: 'can-bus' },
    { pin: 'X5:2', name: 'CAN-L', function: 'CAN Low', wireColor: 'Yellow', circuit: 'can-bus' },
    { pin: 'X5:3', name: 'CAN-GND', function: 'CAN Ground', wireColor: 'Black', circuit: 'can-bus' },
  ],
  'powerwizard-20': [
    { pin: 'J1-1', name: 'BATT+', function: 'Battery Positive', wireColor: 'Red', circuit: 'main-power' },
    { pin: 'J1-2', name: 'BATT-', function: 'Battery Negative', wireColor: 'Black', circuit: 'main-power' },
    { pin: 'J1-3', name: 'CRANK', function: 'Crank Relay', wireColor: 'Purple', circuit: 'starting' },
    { pin: 'J1-4', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', circuit: 'fuel-control' },
    { pin: 'J2-1', name: 'OIL-P', function: 'Oil Pressure Sender', wireColor: 'Brown', circuit: 'oil-pressure' },
    { pin: 'J2-2', name: 'COOL-T', function: 'Coolant Temp Sender', wireColor: 'Blue', circuit: 'coolant-temp' },
    { pin: 'J2-3', name: 'FUEL-L', function: 'Fuel Level', wireColor: 'Green', circuit: 'fuel-level' },
    { pin: 'J3-1', name: 'MPU+', function: 'Speed Sensor +', wireColor: 'Cyan', circuit: 'speed-sensing' },
    { pin: 'J3-2', name: 'MPU-', function: 'Speed Sensor -', wireColor: 'White', circuit: 'speed-sensing' },
    { pin: 'J4-1', name: 'GEN-L1', function: 'Gen Voltage L1', wireColor: 'Red', circuit: 'generator-output' },
    { pin: 'J4-2', name: 'GEN-L2', function: 'Gen Voltage L2', wireColor: 'Yellow', circuit: 'generator-output' },
    { pin: 'J4-3', name: 'GEN-L3', function: 'Gen Voltage L3', wireColor: 'Blue', circuit: 'generator-output' },
    { pin: 'J4-4', name: 'GEN-N', function: 'Gen Neutral', wireColor: 'White', circuit: 'generator-output' },
  ],
};

// ==================== INTERACTIVE DIAGRAM COMPONENT ====================
function CircuitDiagram({
  circuit,
  controller
}: {
  circuit: CircuitType;
  controller: ControllerModel;
}) {
  const pins = CONTROLLER_PINS[controller.id] || CONTROLLER_PINS['dse-7320'];
  const relevantPins = pins.filter(p => p.circuit === circuit.id);

  return (
    <div className="relative h-[450px] bg-slate-950 rounded-xl overflow-hidden p-6">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Circuit Title */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{circuit.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">{circuit.name}</h3>
            <p className="text-xs text-slate-400">{circuit.description}</p>
          </div>
        </div>
      </div>

      {/* Controller Info */}
      <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded">
        <span className="text-xs text-cyan-400">{controller.brand} {controller.model}</span>
      </div>

      {/* SVG Diagram */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
        {/* Controller Box */}
        <rect x="300" y="100" width="200" height="200" rx="10" fill="rgba(30,41,59,0.9)" stroke="#06b6d4" strokeWidth="2" />
        <text x="400" y="130" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">{controller.model}</text>
        <text x="400" y="150" textAnchor="middle" fill="#64748b" fontSize="10">{controller.brand} Controller</text>

        {/* Component Boxes */}
        {circuit.components.map((comp, idx) => {
          const isLeft = idx < circuit.components.length / 2;
          const yPos = 120 + (idx % Math.ceil(circuit.components.length / 2)) * 60;
          const xPos = isLeft ? 80 : 620;

          return (
            <g key={comp}>
              <rect
                x={xPos}
                y={yPos}
                width="120"
                height="40"
                rx="5"
                fill="rgba(30,41,59,0.8)"
                stroke="#f59e0b"
                strokeWidth="1"
              />
              <text x={xPos + 60} y={yPos + 25} textAnchor="middle" fill="#fff" fontSize="10">
                {comp}
              </text>

              {/* Connection line */}
              <motion.path
                d={isLeft
                  ? `M ${xPos + 120} ${yPos + 20} C ${xPos + 200} ${yPos + 20}, ${240} ${180 + idx * 20}, 300 ${180 + idx * 20}`
                  : `M ${xPos} ${yPos + 20} C ${xPos - 80} ${yPos + 20}, ${560} ${180 + (idx - Math.ceil(circuit.components.length / 2)) * 20}, 500 ${180 + (idx - Math.ceil(circuit.components.length / 2)) * 20}`
                }
                fill="none"
                stroke={Object.values(WIRE_COLORS)[idx % Object.keys(WIRE_COLORS).length].hex}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: idx * 0.2 }}
              />
            </g>
          );
        })}

        {/* Relevant Pins */}
        {relevantPins.map((pin, idx) => (
          <g key={pin.pin}>
            <circle
              cx={300}
              cy={170 + idx * 25}
              r="6"
              fill="#1e293b"
              stroke="#06b6d4"
              strokeWidth="2"
            />
            <text x="290" y={174 + idx * 25} textAnchor="end" fill="#94a3b8" fontSize="9">
              {pin.pin}: {pin.name}
            </text>
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(50, 340)">
          <text x="0" y="0" fill="#64748b" fontSize="10" fontWeight="bold">Wire Colors:</text>
          {Object.entries(WIRE_COLORS).slice(0, 6).map(([key, { hex, name }], idx) => (
            <g key={key} transform={`translate(${idx * 100}, 15)`}>
              <rect x="0" y="0" width="15" height="8" rx="2" fill={hex} />
              <text x="20" y="8" fill="#94a3b8" fontSize="8">{name}</text>
            </g>
          ))}
        </g>
      </svg>

      {/* Pin List Overlay */}
      <div className="absolute bottom-4 right-4 p-3 bg-slate-900/90 rounded-lg border border-slate-700 max-w-xs max-h-40 overflow-y-auto">
        <div className="text-xs text-slate-400 mb-2">Relevant Pins:</div>
        <div className="space-y-1">
          {relevantPins.map((pin) => (
            <div key={pin.pin} className="flex items-center gap-2 text-xs">
              <span className="font-mono text-cyan-400 w-10">{pin.pin}</span>
              <span className="text-white">{pin.name}</span>
              <span className="text-slate-500">- {pin.wireColor}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== PINOUT TABLE ====================
function PinoutTable({ controller }: { controller: ControllerModel }) {
  const pins = CONTROLLER_PINS[controller.id] || [];
  const [filter, setFilter] = useState<string>('');

  const filteredPins = pins.filter(pin =>
    pin.name.toLowerCase().includes(filter.toLowerCase()) ||
    pin.function.toLowerCase().includes(filter.toLowerCase()) ||
    pin.circuit.toLowerCase().includes(filter.toLowerCase())
  );

  // Group by circuit
  const groupedPins = filteredPins.reduce((acc, pin) => {
    if (!acc[pin.circuit]) acc[pin.circuit] = [];
    acc[pin.circuit].push(pin);
    return acc;
  }, {} as { [key: string]: PinConfig[] });

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Search pins..."
        className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm"
      />

      <div className="max-h-96 overflow-y-auto space-y-4">
        {Object.entries(groupedPins).map(([circuit, pins]) => (
          <div key={circuit} className="bg-slate-900/50 rounded-lg border border-slate-700/50 overflow-hidden">
            <div className="px-3 py-2 bg-slate-800/50 border-b border-slate-700/50">
              <span className="text-xs text-cyan-400 uppercase font-bold">
                {CIRCUIT_TYPES.find(c => c.id === circuit)?.name || circuit}
              </span>
            </div>
            <div className="divide-y divide-slate-800">
              {pins.map((pin) => (
                <div key={pin.pin} className="px-3 py-2 flex items-center gap-3 text-sm hover:bg-slate-800/30">
                  <span className="font-mono text-cyan-400 w-12">{pin.pin}</span>
                  <span className="font-medium text-white w-20">{pin.name}</span>
                  <span className="text-slate-400 flex-1">{pin.function}</span>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-3 h-3 rounded"
                      style={{
                        backgroundColor: Object.values(WIRE_COLORS).find(w => w.name.includes(pin.wireColor))?.hex || '#6b7280'
                      }}
                    />
                    <span className="text-xs text-slate-500">{pin.wireColor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN PANEL ====================
export default function WiringDiagramsPanel() {
  const [selectedBrand, setSelectedBrand] = useState<string>('DSE');
  const [selectedController, setSelectedController] = useState<ControllerModel>(CONTROLLERS[0]);
  const [selectedCircuit, setSelectedCircuit] = useState<CircuitType>(CIRCUIT_TYPES[0]);
  const [viewMode, setViewMode] = useState<'diagram' | 'pinout' | 'colors'>('diagram');

  const brands = [...new Set(CONTROLLERS.map(c => c.brand))];
  const brandControllers = CONTROLLERS.filter(c => c.brand === selectedBrand);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-3xl">📐</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Wiring & Schematic Diagrams
              </span>
            </h2>
            <p className="text-sm text-slate-500">Complete electrical documentation • All controllers • All circuits</p>
          </div>
        </div>

        <div className="flex gap-2">
          {['diagram', 'pinout', 'colors'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === mode
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {mode === 'diagram' && '📊 Diagram'}
              {mode === 'pinout' && '🔌 Pinout'}
              {mode === 'colors' && '🎨 Colors'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Selection */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Brand Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Controller Brand</h3>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    setSelectedController(CONTROLLERS.find(c => c.brand === brand)!);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Controller Model</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {brandControllers.map((ctrl) => (
                <button
                  key={ctrl.id}
                  onClick={() => setSelectedController(ctrl)}
                  className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    selectedController.id === ctrl.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-medium">{ctrl.model}</div>
                  <div className="text-xs text-slate-500">{ctrl.features.join(' • ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Circuit Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Circuit Type</h3>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {['power', 'control', 'sensing', 'output', 'communication', 'protection'].map((category) => (
                <div key={category}>
                  <div className="text-[10px] text-slate-600 uppercase mt-2 mb-1 px-2">
                    {category}
                  </div>
                  {CIRCUIT_TYPES.filter(c => c.category === category).map((circuit) => (
                    <button
                      key={circuit.id}
                      onClick={() => setSelectedCircuit(circuit)}
                      className={`w-full px-3 py-1.5 rounded text-left text-xs flex items-center gap-2 transition-all ${
                        selectedCircuit.id === circuit.id
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <span>{circuit.icon}</span>
                      <span>{circuit.name}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right - Content */}
        <div className="col-span-12 lg:col-span-9">
          <AnimatePresence mode="wait">
            {viewMode === 'diagram' && (
              <motion.div
                key="diagram"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <CircuitDiagram circuit={selectedCircuit} controller={selectedController} />
              </motion.div>
            )}

            {viewMode === 'pinout' && (
              <motion.div
                key="pinout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">
                    {selectedController.brand} {selectedController.model} - Complete Pinout
                  </h3>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">
                    {selectedController.pinCount} Pins
                  </span>
                </div>
                <PinoutTable controller={selectedController} />
              </motion.div>
            )}

            {viewMode === 'colors' && (
              <motion.div
                key="colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <h3 className="text-lg font-bold text-white mb-4">Wire Color Standards</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(WIRE_COLORS).map(([key, { hex, name, usage }]) => (
                    <div key={key} className="p-4 bg-slate-800/50 rounded-lg flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: hex, border: key.includes('black') ? '1px solid #475569' : 'none' }}
                      />
                      <div>
                        <div className="font-medium text-white">{name}</div>
                        <div className="text-xs text-slate-400">{usage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🏭</div>
              <div className="text-2xl font-bold text-cyan-400">{CONTROLLERS.length}</div>
              <div className="text-xs text-slate-500">Controllers Supported</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-amber-400">{CIRCUIT_TYPES.length}</div>
              <div className="text-xs text-slate-500">Circuit Types</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-2xl font-bold text-green-400">{Object.keys(WIRE_COLORS).length}</div>
              <div className="text-xs text-slate-500">Wire Colors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">📐</span>
            <div>
              <div className="text-sm font-bold text-white">Complete Wiring Documentation</div>
              <div className="text-xs text-slate-400">
                DSE • ComAp • Woodward • SmartGen • PowerWizard - All models covered
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white">
              📥 Download PDF
            </button>
            <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white">
              🖨️ Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
