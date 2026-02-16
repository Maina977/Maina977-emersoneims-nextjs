'use client';

/**
 * ALL 9 CONTROLLER WIRING DIAGRAMS
 * Complete professional wiring diagrams with color codes and terminal markings
 *
 * Controllers: DSE, ComAp, Woodward, SmartGen, CAT PowerWizard, Datakom, Lovato, Siemens, ENKO
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// WIRE COLOR CODES - INTERNATIONAL STANDARDS
// ═══════════════════════════════════════════════════════════════════════════════
export const WIRE_COLOR_CODES = {
  // DC Power
  'DC+': { color: '#EF4444', name: 'Red', hex: '#EF4444', usage: 'Positive DC Supply (+12V/+24V)' },
  'DC-': { color: '#1E293B', name: 'Black', hex: '#1E293B', usage: 'Negative DC / Ground (0V)' },

  // AC Power - IEC Standard
  'L1': { color: '#92400E', name: 'Brown', hex: '#92400E', usage: 'AC Line 1 / Live' },
  'L2': { color: '#1E293B', name: 'Black', hex: '#1E293B', usage: 'AC Line 2' },
  'L3': { color: '#6B7280', name: 'Grey', hex: '#6B7280', usage: 'AC Line 3' },
  'N': { color: '#3B82F6', name: 'Blue', hex: '#3B82F6', usage: 'Neutral' },
  'PE': { color: '#22C55E', name: 'Green/Yellow', hex: '#22C55E', usage: 'Protective Earth' },

  // Control Signals
  'START': { color: '#10B981', name: 'Green', hex: '#10B981', usage: 'Start Signal' },
  'STOP': { color: '#EF4444', name: 'Red', hex: '#EF4444', usage: 'Stop/Emergency Signal' },
  'COMMON': { color: '#FBBF24', name: 'Yellow', hex: '#FBBF24', usage: 'Common Return' },
  'SIGNAL': { color: '#8B5CF6', name: 'Violet', hex: '#8B5CF6', usage: 'Analog/Digital Signal' },
  'SENSOR': { color: '#F97316', name: 'Orange', hex: '#F97316', usage: 'Sensor Input' },
  'ALARM': { color: '#EC4899', name: 'Pink', hex: '#EC4899', usage: 'Alarm Output' },
  'RS485-A': { color: '#06B6D4', name: 'Cyan', hex: '#06B6D4', usage: 'RS485 Data A' },
  'RS485-B': { color: '#A855F7', name: 'Purple', hex: '#A855F7', usage: 'RS485 Data B' },
  'CAN-H': { color: '#FBBF24', name: 'Yellow', hex: '#FBBF24', usage: 'CAN High' },
  'CAN-L': { color: '#22C55E', name: 'Green', hex: '#22C55E', usage: 'CAN Low' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTROLLER WIRING DATA - ALL 9 BRANDS
// ═══════════════════════════════════════════════════════════════════════════════
export interface ControllerWiring {
  id: string;
  brand: string;
  model: string;
  description: string;
  color: string;
  terminals: {
    name: string;
    number: string;
    function: string;
    wireColor: string;
    notes: string;
  }[];
  connections: {
    from: string;
    to: string;
    wire: string;
    color: string;
    description: string;
  }[];
  notes: string[];
}

export const CONTROLLER_WIRING_DATA: ControllerWiring[] = [
  // ═══════════════════════════════════════════════════════════════
  // 1. DSE (DeepSea Electronics)
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'dse-7320',
    brand: 'DeepSea Electronics (DSE)',
    model: 'DSE 7320 MKII',
    description: 'Auto Mains Failure Controller with advanced protection',
    color: '#1E40AF',
    terminals: [
      { name: 'B+', number: '1', function: 'Battery Positive +12/24V DC', wireColor: 'Red', notes: 'Fused 5A max' },
      { name: 'B-', number: '2', function: 'Battery Negative / Ground', wireColor: 'Black', notes: 'Main ground reference' },
      { name: 'CHARGE', number: '3', function: 'Alternator W Terminal', wireColor: 'Yellow', notes: 'Charge fail detection' },
      { name: 'OIL', number: '4', function: 'Oil Pressure Sender', wireColor: 'Orange', notes: 'VDO/Datcon compatible' },
      { name: 'TEMP', number: '5', function: 'Coolant Temp Sender', wireColor: 'Orange', notes: 'VDO/Datcon compatible' },
      { name: 'FUEL', number: '6', function: 'Fuel Level Sender', wireColor: 'Orange', notes: 'VDO/Datcon compatible' },
      { name: 'MPU+', number: '7', function: 'Magnetic Pickup +', wireColor: 'White', notes: 'Speed sensor positive' },
      { name: 'MPU-', number: '8', function: 'Magnetic Pickup -', wireColor: 'White/Black', notes: 'Speed sensor negative' },
      { name: 'START', number: '9', function: 'Start Output', wireColor: 'Green', notes: 'To starter relay coil' },
      { name: 'FUEL SOL', number: '10', function: 'Fuel Solenoid', wireColor: 'Brown', notes: 'Fuel run solenoid' },
      { name: 'GEN L1', number: '11', function: 'Generator L1 Sensing', wireColor: 'Brown', notes: 'CT or direct 50-300VAC' },
      { name: 'GEN L2', number: '12', function: 'Generator L2 Sensing', wireColor: 'Black', notes: 'CT or direct' },
      { name: 'GEN L3', number: '13', function: 'Generator L3 Sensing', wireColor: 'Grey', notes: 'CT or direct' },
      { name: 'GEN N', number: '14', function: 'Generator Neutral', wireColor: 'Blue', notes: 'Voltage reference' },
      { name: 'MAINS L1', number: '15', function: 'Mains L1 Sensing', wireColor: 'Brown', notes: 'Via PT or direct' },
      { name: 'MAINS N', number: '16', function: 'Mains Neutral', wireColor: 'Blue', notes: 'Mains reference' },
      { name: 'CT1', number: '17', function: 'Current Transformer L1', wireColor: 'Red', notes: '1A or 5A secondary' },
      { name: 'CT2', number: '18', function: 'Current Transformer L2', wireColor: 'Red', notes: '1A or 5A secondary' },
      { name: 'CT3', number: '19', function: 'Current Transformer L3', wireColor: 'Red', notes: '1A or 5A secondary' },
      { name: 'CT COM', number: '20', function: 'CT Common', wireColor: 'Black', notes: 'CT secondary common' },
      { name: 'RS485 A', number: '21', function: 'RS485 Data A (+)', wireColor: 'Cyan', notes: 'Communication' },
      { name: 'RS485 B', number: '22', function: 'RS485 Data B (-)', wireColor: 'Purple', notes: 'Communication' },
      { name: 'RS485 GND', number: '23', function: 'RS485 Ground', wireColor: 'Black', notes: 'Signal ground' },
    ],
    connections: [
      { from: 'Battery +', to: 'Terminal 1 (B+)', wire: '2.5mm²', color: '#EF4444', description: 'Main DC supply from battery positive' },
      { from: 'Battery -', to: 'Terminal 2 (B-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground connection to battery negative' },
      { from: 'Oil Pressure Sender', to: 'Terminal 4 (OIL)', wire: '1.0mm²', color: '#F97316', description: 'Variable resistance sender' },
      { from: 'Coolant Temp Sender', to: 'Terminal 5 (TEMP)', wire: '1.0mm²', color: '#F97316', description: 'Variable resistance sender' },
      { from: 'Starter Relay Coil', to: 'Terminal 9 (START)', wire: '1.5mm²', color: '#10B981', description: 'Start signal to relay' },
      { from: 'Fuel Solenoid', to: 'Terminal 10 (FUEL SOL)', wire: '1.5mm²', color: '#92400E', description: 'Fuel run solenoid control' },
      { from: 'Generator L1', to: 'Terminal 11', wire: '2.5mm²', color: '#92400E', description: 'Generator voltage sensing' },
      { from: 'Generator N', to: 'Terminal 14', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral reference' },
    ],
    notes: [
      'All sensor inputs share common ground at Terminal 2',
      'Use shielded cable for RS485 communication - shield to Terminal 23',
      'CT wiring must be continuous - never open-circuit a live CT',
      'Maximum DC supply voltage: 35V DC',
      'Generator voltage sensing accepts 50-300V AC directly or via PT',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 2. ComAp
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'comap-intelilite',
    brand: 'ComAp',
    model: 'InteliLite IL-NT AMF 25',
    description: 'Compact AMF controller with integrated protection',
    color: '#DC2626',
    terminals: [
      { name: 'DC+', number: 'J1-1', function: 'Supply Voltage +8-36V DC', wireColor: 'Red', notes: 'Wide voltage range' },
      { name: 'DC-', number: 'J1-2', function: 'Supply Ground', wireColor: 'Black', notes: 'Common ground' },
      { name: 'W', number: 'J1-3', function: 'Alternator W Terminal', wireColor: 'Yellow', notes: 'Charge monitoring' },
      { name: 'D+', number: 'J1-4', function: 'Alternator D+ Output', wireColor: 'Yellow', notes: 'Battery charging' },
      { name: 'FUEL', number: 'J2-1', function: 'Fuel Output', wireColor: 'Brown', notes: 'Fuel solenoid' },
      { name: 'START', number: 'J2-2', function: 'Start Output', wireColor: 'Green', notes: 'Crank relay' },
      { name: 'OIL', number: 'J3-1', function: 'Oil Pressure Sender', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'TEMP', number: 'J3-2', function: 'Temperature Sender', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'FUEL LEVEL', number: 'J3-3', function: 'Fuel Level Sender', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'SNDR GND', number: 'J3-4', function: 'Sender Ground', wireColor: 'Black', notes: 'Sensor return' },
      { name: 'GEN L1', number: 'J4-1', function: 'Generator Phase L1', wireColor: 'Brown', notes: 'Voltage sensing' },
      { name: 'GEN L2', number: 'J4-2', function: 'Generator Phase L2', wireColor: 'Black', notes: 'Voltage sensing' },
      { name: 'GEN L3', number: 'J4-3', function: 'Generator Phase L3', wireColor: 'Grey', notes: 'Voltage sensing' },
      { name: 'GEN N', number: 'J4-4', function: 'Generator Neutral', wireColor: 'Blue', notes: 'Reference' },
      { name: 'MAINS L1', number: 'J5-1', function: 'Mains Phase L1', wireColor: 'Brown', notes: 'Mains sensing' },
      { name: 'MAINS N', number: 'J5-2', function: 'Mains Neutral', wireColor: 'Blue', notes: 'Reference' },
      { name: 'MPU A', number: 'J6-1', function: 'Speed Sensor +', wireColor: 'White', notes: 'MPU positive' },
      { name: 'MPU B', number: 'J6-2', function: 'Speed Sensor -', wireColor: 'White/Black', notes: 'MPU negative' },
      { name: 'RS232 TX', number: 'J7-1', function: 'Serial Transmit', wireColor: 'Green', notes: 'Communication' },
      { name: 'RS232 RX', number: 'J7-2', function: 'Serial Receive', wireColor: 'Yellow', notes: 'Communication' },
      { name: 'RS232 GND', number: 'J7-3', function: 'Serial Ground', wireColor: 'Black', notes: 'Signal ground' },
    ],
    connections: [
      { from: 'Battery +', to: 'J1-1 (DC+)', wire: '2.5mm²', color: '#EF4444', description: 'Power supply 8-36V DC' },
      { from: 'Battery -', to: 'J1-2 (DC-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground reference' },
      { from: 'Oil Pressure Sender', to: 'J3-1 (OIL)', wire: '1.0mm²', color: '#F97316', description: '0-10 bar sender' },
      { from: 'Coolant Temp Sender', to: 'J3-2 (TEMP)', wire: '1.0mm²', color: '#F97316', description: '40-120°C sender' },
      { from: 'Starter Relay', to: 'J2-2 (START)', wire: '1.5mm²', color: '#10B981', description: 'Crank control' },
      { from: 'Fuel Solenoid', to: 'J2-1 (FUEL)', wire: '1.5mm²', color: '#92400E', description: 'Run control' },
      { from: 'Generator L1', to: 'J4-1', wire: '2.5mm²', color: '#92400E', description: 'Phase voltage sensing' },
      { from: 'Generator N', to: 'J4-4', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral reference' },
    ],
    notes: [
      'InteliConfig PC software required for configuration',
      'Binary inputs are active LOW (connect to ground to activate)',
      'Use twisted pair for speed sensor wiring',
      'Maximum cable length for RS232: 15 meters',
      'Supports VDO, Datcon, and Murphy sender types',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 3. Woodward
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'woodward-easygen3500',
    brand: 'Woodward',
    model: 'EasyGen-3500',
    description: 'Advanced generator paralleling and load sharing controller',
    color: '#059669',
    terminals: [
      { name: '+V', number: 'TB1-1', function: 'Power Supply +10-32V DC', wireColor: 'Red', notes: 'Reverse polarity protected' },
      { name: '-V', number: 'TB1-2', function: 'Power Ground', wireColor: 'Black', notes: 'Main ground' },
      { name: 'START', number: 'TB2-1', function: 'Start Relay Output', wireColor: 'Green', notes: '2A max' },
      { name: 'STOP', number: 'TB2-2', function: 'Stop Relay Output', wireColor: 'Red', notes: 'Fuel shutoff' },
      { name: 'GCB', number: 'TB2-3', function: 'Generator Breaker Control', wireColor: 'Orange', notes: 'Close/trip' },
      { name: 'MCB', number: 'TB2-4', function: 'Mains Breaker Control', wireColor: 'Orange', notes: 'Close/trip' },
      { name: 'AIN1', number: 'TB3-1', function: 'Analog Input 1 - Oil Pressure', wireColor: 'Orange', notes: '4-20mA or resistance' },
      { name: 'AIN2', number: 'TB3-2', function: 'Analog Input 2 - Coolant Temp', wireColor: 'Orange', notes: '4-20mA or resistance' },
      { name: 'AIN3', number: 'TB3-3', function: 'Analog Input 3 - Fuel Level', wireColor: 'Orange', notes: '4-20mA or resistance' },
      { name: 'AIN4', number: 'TB3-4', function: 'Analog Input 4 - Configurable', wireColor: 'Orange', notes: 'User defined' },
      { name: 'AIN GND', number: 'TB3-5', function: 'Analog Ground', wireColor: 'Black', notes: 'Sensor return' },
      { name: 'GEN UA', number: 'TB4-1', function: 'Generator Phase A', wireColor: 'Brown', notes: '15-600V AC' },
      { name: 'GEN UB', number: 'TB4-2', function: 'Generator Phase B', wireColor: 'Black', notes: '15-600V AC' },
      { name: 'GEN UC', number: 'TB4-3', function: 'Generator Phase C', wireColor: 'Grey', notes: '15-600V AC' },
      { name: 'GEN UN', number: 'TB4-4', function: 'Generator Neutral', wireColor: 'Blue', notes: 'Neutral reference' },
      { name: 'BUS UA', number: 'TB5-1', function: 'Bus/Mains Phase A', wireColor: 'Brown', notes: '15-600V AC' },
      { name: 'BUS UB', number: 'TB5-2', function: 'Bus/Mains Phase B', wireColor: 'Black', notes: '15-600V AC' },
      { name: 'BUS UC', number: 'TB5-3', function: 'Bus/Mains Phase C', wireColor: 'Grey', notes: '15-600V AC' },
      { name: 'BUS UN', number: 'TB5-4', function: 'Bus/Mains Neutral', wireColor: 'Blue', notes: 'Reference' },
      { name: 'CT1', number: 'TB6-1', function: 'Generator CT Phase A', wireColor: 'Red', notes: '1A or 5A sec' },
      { name: 'CT2', number: 'TB6-2', function: 'Generator CT Phase B', wireColor: 'Red', notes: '1A or 5A sec' },
      { name: 'CT3', number: 'TB6-3', function: 'Generator CT Phase C', wireColor: 'Red', notes: '1A or 5A sec' },
      { name: 'CT C', number: 'TB6-4', function: 'CT Common', wireColor: 'Black', notes: 'CT secondary common' },
      { name: 'MPU+', number: 'TB7-1', function: 'Speed Sensor Positive', wireColor: 'White', notes: 'Magnetic pickup' },
      { name: 'MPU-', number: 'TB7-2', function: 'Speed Sensor Negative', wireColor: 'White/Black', notes: 'Magnetic pickup' },
      { name: 'CAN-H', number: 'TB8-1', function: 'CAN Bus High', wireColor: 'Yellow', notes: 'J1939/CANopen' },
      { name: 'CAN-L', number: 'TB8-2', function: 'CAN Bus Low', wireColor: 'Green', notes: 'J1939/CANopen' },
      { name: 'CAN GND', number: 'TB8-3', function: 'CAN Ground', wireColor: 'Black', notes: 'Shield' },
    ],
    connections: [
      { from: 'Battery +', to: 'TB1-1 (+V)', wire: '2.5mm²', color: '#EF4444', description: '10-32V DC supply' },
      { from: 'Battery -', to: 'TB1-2 (-V)', wire: '2.5mm²', color: '#1E293B', description: 'Common ground' },
      { from: 'Oil Pressure Sender', to: 'TB3-1 (AIN1)', wire: '1.0mm² shielded', color: '#F97316', description: '4-20mA transducer' },
      { from: 'Coolant Temp Sender', to: 'TB3-2 (AIN2)', wire: '1.0mm² shielded', color: '#F97316', description: 'PT100 or NTC' },
      { from: 'Start Relay', to: 'TB2-1 (START)', wire: '1.5mm²', color: '#10B981', description: 'Crank solenoid' },
      { from: 'Fuel Valve', to: 'TB2-2 (STOP)', wire: '1.5mm²', color: '#EF4444', description: 'Run solenoid' },
      { from: 'Gen Phase A', to: 'TB4-1 (GEN UA)', wire: '2.5mm²', color: '#92400E', description: 'Via PT if >300V' },
      { from: 'Gen Neutral', to: 'TB4-4 (GEN UN)', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral sensing' },
      { from: 'Engine J1939', to: 'TB8 CAN', wire: 'Twisted pair', color: '#FBBF24', description: 'Engine communication' },
    ],
    notes: [
      'Woodward Toolkit PC software required for configuration',
      'CAN bus requires 120Ω termination at each end',
      'Supports generator paralleling up to 32 units',
      'Use shielded cables for all analog inputs',
      'Configurable for load sharing with droop or isochronous control',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 4. SmartGen
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'smartgen-hgm9510',
    brand: 'SmartGen',
    model: 'HGM9510',
    description: 'Generator Controller with Color LCD',
    color: '#7C3AED',
    terminals: [
      { name: 'DC+', number: '1', function: 'DC Supply +8-35V', wireColor: 'Red', notes: 'Main power' },
      { name: 'DC-', number: '2', function: 'DC Ground', wireColor: 'Black', notes: 'Common ground' },
      { name: 'W', number: '3', function: 'Charge Lamp', wireColor: 'Yellow', notes: 'Alternator W' },
      { name: 'OIL P', number: '4', function: 'Oil Pressure', wireColor: 'Orange', notes: 'VDO type' },
      { name: 'WATER T', number: '5', function: 'Water Temp', wireColor: 'Orange', notes: 'VDO type' },
      { name: 'FUEL L', number: '6', function: 'Fuel Level', wireColor: 'Orange', notes: 'VDO type' },
      { name: 'SENDER-', number: '7', function: 'Sender Ground', wireColor: 'Black', notes: 'Sensor return' },
      { name: 'MPU+', number: '8', function: 'Speed Sensor +', wireColor: 'White', notes: 'Magnetic pickup' },
      { name: 'MPU-', number: '9', function: 'Speed Sensor -', wireColor: 'White/Black', notes: 'Magnetic pickup' },
      { name: 'START', number: '10', function: 'Start Output', wireColor: 'Green', notes: 'To starter relay' },
      { name: 'STOP', number: '11', function: 'Stop Output', wireColor: 'Red', notes: 'Fuel solenoid' },
      { name: 'IDLE', number: '12', function: 'Idle Speed Control', wireColor: 'Blue', notes: 'Governor control' },
      { name: 'GEN L1', number: '13', function: 'Generator L1', wireColor: 'Brown', notes: 'Voltage sensing' },
      { name: 'GEN L2', number: '14', function: 'Generator L2', wireColor: 'Black', notes: 'Voltage sensing' },
      { name: 'GEN L3', number: '15', function: 'Generator L3', wireColor: 'Grey', notes: 'Voltage sensing' },
      { name: 'GEN N', number: '16', function: 'Generator N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'MAINS L1', number: '17', function: 'Mains L1', wireColor: 'Brown', notes: 'Mains sensing' },
      { name: 'MAINS N', number: '18', function: 'Mains N', wireColor: 'Blue', notes: 'Mains neutral' },
      { name: 'CT1', number: '19', function: 'CT Phase 1', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT2', number: '20', function: 'CT Phase 2', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT3', number: '21', function: 'CT Phase 3', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT-', number: '22', function: 'CT Common', wireColor: 'Black', notes: 'CT return' },
      { name: 'RS485+', number: '23', function: 'RS485 A', wireColor: 'Cyan', notes: 'Data +' },
      { name: 'RS485-', number: '24', function: 'RS485 B', wireColor: 'Purple', notes: 'Data -' },
    ],
    connections: [
      { from: 'Battery +', to: 'Terminal 1 (DC+)', wire: '2.5mm²', color: '#EF4444', description: '8-35V DC supply' },
      { from: 'Battery -', to: 'Terminal 2 (DC-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground' },
      { from: 'Oil Pressure Sender', to: 'Terminal 4', wire: '1.0mm²', color: '#F97316', description: 'VDO compatible' },
      { from: 'Coolant Temp Sender', to: 'Terminal 5', wire: '1.0mm²', color: '#F97316', description: 'VDO compatible' },
      { from: 'Starter Relay', to: 'Terminal 10', wire: '1.5mm²', color: '#10B981', description: 'Start control' },
      { from: 'Fuel Solenoid', to: 'Terminal 11', wire: '1.5mm²', color: '#EF4444', description: 'Run control' },
      { from: 'Generator L1', to: 'Terminal 13', wire: '2.5mm²', color: '#92400E', description: 'Phase sensing' },
      { from: 'Generator N', to: 'Terminal 16', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral sensing' },
    ],
    notes: [
      'SG72 software required for advanced configuration',
      'Supports color LCD display for parameters',
      'Maximum 400V AC direct voltage sensing',
      'Compatible with J1939 CAN protocol on select models',
      'Configurable protection parameters via PC software',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 5. CAT PowerWizard
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cat-powerwizard2',
    brand: 'CAT (Caterpillar)',
    model: 'PowerWizard 2.0',
    description: 'Advanced Generator Set Controller',
    color: '#F59E0B',
    terminals: [
      { name: 'BATT+', number: 'J1-A', function: 'Battery +12/24V DC', wireColor: 'Red', notes: 'Fused supply' },
      { name: 'BATT-', number: 'J1-B', function: 'Battery Negative', wireColor: 'Black', notes: 'Ground' },
      { name: 'START', number: 'J2-A', function: 'Start Relay', wireColor: 'Green', notes: 'Crank output' },
      { name: 'RUN', number: 'J2-B', function: 'Run/Fuel Relay', wireColor: 'Brown', notes: 'Fuel solenoid' },
      { name: 'PRELUBE', number: 'J2-C', function: 'Prelube Output', wireColor: 'Blue', notes: 'Oil pump' },
      { name: 'GCB CLS', number: 'J3-A', function: 'GCB Close', wireColor: 'Orange', notes: 'Breaker close' },
      { name: 'GCB TRP', number: 'J3-B', function: 'GCB Trip', wireColor: 'Pink', notes: 'Breaker trip' },
      { name: 'MCB CLS', number: 'J3-C', function: 'MCB Close', wireColor: 'Orange', notes: 'Mains close' },
      { name: 'MCB TRP', number: 'J3-D', function: 'MCB Trip', wireColor: 'Pink', notes: 'Mains trip' },
      { name: 'CAN-H', number: 'J4-A', function: 'J1939 CAN High', wireColor: 'Yellow', notes: 'Engine CAN' },
      { name: 'CAN-L', number: 'J4-B', function: 'J1939 CAN Low', wireColor: 'Green', notes: 'Engine CAN' },
      { name: 'CAN-GND', number: 'J4-C', function: 'CAN Shield', wireColor: 'Black', notes: 'Shield/drain' },
      { name: 'GEN L1', number: 'J5-A', function: 'Generator L1', wireColor: 'Brown', notes: 'Via PT' },
      { name: 'GEN L2', number: 'J5-B', function: 'Generator L2', wireColor: 'Black', notes: 'Via PT' },
      { name: 'GEN L3', number: 'J5-C', function: 'Generator L3', wireColor: 'Grey', notes: 'Via PT' },
      { name: 'GEN N', number: 'J5-D', function: 'Generator N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'CT1', number: 'J6-A', function: 'Generator CT L1', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT2', number: 'J6-B', function: 'Generator CT L2', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT3', number: 'J6-C', function: 'Generator CT L3', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT COM', number: 'J6-D', function: 'CT Common', wireColor: 'Black', notes: 'CT return' },
      { name: 'MAINS L1', number: 'J7-A', function: 'Mains L1', wireColor: 'Brown', notes: 'Via PT' },
      { name: 'MAINS N', number: 'J7-B', function: 'Mains N', wireColor: 'Blue', notes: 'Neutral' },
    ],
    connections: [
      { from: 'Battery +', to: 'J1-A (BATT+)', wire: '4.0mm²', color: '#EF4444', description: '12/24V DC supply' },
      { from: 'Battery -', to: 'J1-B (BATT-)', wire: '4.0mm²', color: '#1E293B', description: 'Ground reference' },
      { from: 'Engine ECM J1939', to: 'J4 CAN', wire: 'Twisted pair shielded', color: '#FBBF24', description: 'Engine communication' },
      { from: 'Starter Relay', to: 'J2-A', wire: '2.5mm²', color: '#10B981', description: 'Crank control' },
      { from: 'Fuel Solenoid', to: 'J2-B', wire: '2.5mm²', color: '#92400E', description: 'Run control' },
      { from: 'Gen PT L1', to: 'J5-A', wire: '2.5mm²', color: '#92400E', description: 'Phase A via PT' },
      { from: 'Gen PT N', to: 'J5-D', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral sensing' },
    ],
    notes: [
      'CAT Electronic Technician (CAT ET) software required',
      'Integrated J1939 CAN communication with CAT engines',
      'Engine parameters obtained via CAN - minimal discrete sensors',
      'CAN bus must have 120Ω termination resistors',
      'Voltage sensing via external PTs for high voltage applications',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 6. Datakom
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'datakom-d500',
    brand: 'Datakom',
    model: 'D-500',
    description: 'Multi-function Generator Controller',
    color: '#0891B2',
    terminals: [
      { name: 'DC+', number: '1', function: 'Supply +8-35V DC', wireColor: 'Red', notes: 'Main power' },
      { name: 'DC-', number: '2', function: 'Supply Ground', wireColor: 'Black', notes: 'Ground' },
      { name: 'W', number: '3', function: 'Charge Fail Input', wireColor: 'Yellow', notes: 'Alternator W' },
      { name: 'OIL P', number: '4', function: 'Oil Pressure Input', wireColor: 'Orange', notes: 'Resistance sender' },
      { name: 'TEMP', number: '5', function: 'Temperature Input', wireColor: 'Orange', notes: 'Resistance sender' },
      { name: 'FUEL', number: '6', function: 'Fuel Level Input', wireColor: 'Orange', notes: 'Resistance sender' },
      { name: 'SENDER COM', number: '7', function: 'Sender Common', wireColor: 'Black', notes: 'Sensor ground' },
      { name: 'MPU+', number: '8', function: 'Speed Sensor +', wireColor: 'White', notes: 'Magnetic pickup' },
      { name: 'MPU-', number: '9', function: 'Speed Sensor -', wireColor: 'White/Black', notes: 'MPU return' },
      { name: 'START OUT', number: '10', function: 'Start Relay', wireColor: 'Green', notes: '5A output' },
      { name: 'FUEL OUT', number: '11', function: 'Fuel Relay', wireColor: 'Brown', notes: '5A output' },
      { name: 'ALARM', number: '12', function: 'Alarm Relay', wireColor: 'Pink', notes: 'Configurable' },
      { name: 'HORN', number: '13', function: 'Horn Output', wireColor: 'Pink', notes: 'Warning horn' },
      { name: 'GCB', number: '14', function: 'Generator Breaker', wireColor: 'Orange', notes: 'Close/Trip' },
      { name: 'MCB', number: '15', function: 'Mains Breaker', wireColor: 'Orange', notes: 'Close/Trip' },
      { name: 'GEN L1', number: '16', function: 'Generator L1', wireColor: 'Brown', notes: '30-530V AC' },
      { name: 'GEN L2', number: '17', function: 'Generator L2', wireColor: 'Black', notes: '30-530V AC' },
      { name: 'GEN L3', number: '18', function: 'Generator L3', wireColor: 'Grey', notes: '30-530V AC' },
      { name: 'GEN N', number: '19', function: 'Generator Neutral', wireColor: 'Blue', notes: 'Reference' },
      { name: 'MAINS L1', number: '20', function: 'Mains L1', wireColor: 'Brown', notes: '30-530V AC' },
      { name: 'MAINS N', number: '21', function: 'Mains Neutral', wireColor: 'Blue', notes: 'Reference' },
      { name: 'CT1', number: '22', function: 'CT Phase L1', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT2', number: '23', function: 'CT Phase L2', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT3', number: '24', function: 'CT Phase L3', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT COM', number: '25', function: 'CT Common', wireColor: 'Black', notes: 'CT return' },
      { name: 'RS485 A', number: '26', function: 'RS485 A (+)', wireColor: 'Cyan', notes: 'Modbus RTU' },
      { name: 'RS485 B', number: '27', function: 'RS485 B (-)', wireColor: 'Purple', notes: 'Modbus RTU' },
      { name: 'USB', number: 'Front', function: 'USB Connection', wireColor: 'N/A', notes: 'Configuration' },
    ],
    connections: [
      { from: 'Battery +', to: 'Terminal 1 (DC+)', wire: '2.5mm²', color: '#EF4444', description: '8-35V DC supply' },
      { from: 'Battery -', to: 'Terminal 2 (DC-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground' },
      { from: 'Oil Pressure Sender', to: 'Terminal 4', wire: '1.0mm²', color: '#F97316', description: 'VDO/Datcon type' },
      { from: 'Coolant Temp Sender', to: 'Terminal 5', wire: '1.0mm²', color: '#F97316', description: 'VDO/Datcon type' },
      { from: 'Starter Relay', to: 'Terminal 10', wire: '1.5mm²', color: '#10B981', description: 'Start control' },
      { from: 'Fuel Solenoid', to: 'Terminal 11', wire: '1.5mm²', color: '#92400E', description: 'Run control' },
      { from: 'Generator L1', to: 'Terminal 16', wire: '2.5mm²', color: '#92400E', description: 'Direct 30-530V' },
      { from: 'Generator N', to: 'Terminal 19', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral sensing' },
    ],
    notes: [
      'Rainbow Plus PC software for configuration',
      'Supports Modbus RTU communication protocol',
      'Direct voltage sensing up to 530V AC',
      'Built-in event logger for diagnostics',
      'USB port for easy PC connection',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 7. Lovato
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'lovato-rgk800',
    brand: 'Lovato Electric',
    model: 'RGK800',
    description: 'Generator Set Controller with ATS Function',
    color: '#EA580C',
    terminals: [
      { name: 'VCC+', number: 'X1-1', function: 'Supply +9-36V DC', wireColor: 'Red', notes: 'Power supply' },
      { name: 'VCC-', number: 'X1-2', function: 'Supply Ground', wireColor: 'Black', notes: 'Negative' },
      { name: 'CHARGE', number: 'X1-3', function: 'Charge Lamp', wireColor: 'Yellow', notes: 'D+ monitoring' },
      { name: 'OIL', number: 'X2-1', function: 'Oil Pressure', wireColor: 'Orange', notes: 'Configurable type' },
      { name: 'TEMP', number: 'X2-2', function: 'Temperature', wireColor: 'Orange', notes: 'Configurable type' },
      { name: 'FUEL', number: 'X2-3', function: 'Fuel Level', wireColor: 'Orange', notes: 'Configurable type' },
      { name: 'GND SEN', number: 'X2-4', function: 'Sensor Ground', wireColor: 'Black', notes: 'Sender common' },
      { name: 'PICKUP+', number: 'X3-1', function: 'Speed Sensor +', wireColor: 'White', notes: 'MPU positive' },
      { name: 'PICKUP-', number: 'X3-2', function: 'Speed Sensor -', wireColor: 'White/Black', notes: 'MPU negative' },
      { name: 'K1 START', number: 'X4-1', function: 'Start Relay', wireColor: 'Green', notes: 'Crank output' },
      { name: 'K2 FUEL', number: 'X4-2', function: 'Fuel Relay', wireColor: 'Brown', notes: 'Run relay' },
      { name: 'K3 PREHEAT', number: 'X4-3', function: 'Preheat Relay', wireColor: 'Orange', notes: 'Glow plugs' },
      { name: 'K4 GCB', number: 'X4-4', function: 'Generator CB', wireColor: 'Orange', notes: 'GCB control' },
      { name: 'K5 MCB', number: 'X4-5', function: 'Mains CB', wireColor: 'Orange', notes: 'MCB control' },
      { name: 'K6 ALARM', number: 'X4-6', function: 'Alarm Output', wireColor: 'Pink', notes: 'Configurable' },
      { name: 'GEN L1', number: 'X5-1', function: 'Generator L1', wireColor: 'Brown', notes: '50-480V AC' },
      { name: 'GEN L2', number: 'X5-2', function: 'Generator L2', wireColor: 'Black', notes: '50-480V AC' },
      { name: 'GEN L3', number: 'X5-3', function: 'Generator L3', wireColor: 'Grey', notes: '50-480V AC' },
      { name: 'GEN N', number: 'X5-4', function: 'Generator N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'MAINS L1', number: 'X6-1', function: 'Mains L1', wireColor: 'Brown', notes: '50-480V AC' },
      { name: 'MAINS L2', number: 'X6-2', function: 'Mains L2', wireColor: 'Black', notes: '50-480V AC' },
      { name: 'MAINS L3', number: 'X6-3', function: 'Mains L3', wireColor: 'Grey', notes: '50-480V AC' },
      { name: 'MAINS N', number: 'X6-4', function: 'Mains N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'CT1', number: 'X7-1', function: 'CT L1', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT2', number: 'X7-2', function: 'CT L2', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT3', number: 'X7-3', function: 'CT L3', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT-', number: 'X7-4', function: 'CT Common', wireColor: 'Black', notes: 'CT return' },
      { name: 'RS485 A', number: 'X8-1', function: 'RS485 Data A', wireColor: 'Cyan', notes: 'Modbus' },
      { name: 'RS485 B', number: 'X8-2', function: 'RS485 Data B', wireColor: 'Purple', notes: 'Modbus' },
      { name: 'RS485 GND', number: 'X8-3', function: 'RS485 Ground', wireColor: 'Black', notes: 'Shield' },
    ],
    connections: [
      { from: 'Battery +', to: 'X1-1 (VCC+)', wire: '2.5mm²', color: '#EF4444', description: '9-36V DC supply' },
      { from: 'Battery -', to: 'X1-2 (VCC-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground' },
      { from: 'Oil Pressure', to: 'X2-1', wire: '1.0mm²', color: '#F97316', description: 'Resistance sender' },
      { from: 'Coolant Temp', to: 'X2-2', wire: '1.0mm²', color: '#F97316', description: 'Resistance sender' },
      { from: 'Start Relay', to: 'X4-1', wire: '1.5mm²', color: '#10B981', description: 'Cranking control' },
      { from: 'Fuel Relay', to: 'X4-2', wire: '1.5mm²', color: '#92400E', description: 'Run solenoid' },
      { from: 'Generator L1', to: 'X5-1', wire: '2.5mm²', color: '#92400E', description: 'Phase sensing' },
      { from: 'Generator N', to: 'X5-4', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral' },
    ],
    notes: [
      'RGK800soft PC software for configuration',
      'Supports three-phase mains sensing for complete ATS function',
      'Multiple sensor curve types configurable',
      'USB and RS485 communication interfaces',
      'Event log with timestamp for troubleshooting',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 8. Siemens
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'siemens-sentron',
    brand: 'Siemens',
    model: 'SENTRON PAC4200',
    description: 'Power Monitoring Device with Generator Functions',
    color: '#009999',
    terminals: [
      { name: 'L+', number: 'T1-1', function: 'Supply 24V DC+', wireColor: 'Red', notes: 'Power supply' },
      { name: 'M', number: 'T1-2', function: 'Supply Ground', wireColor: 'Black', notes: '0V reference' },
      { name: 'PE', number: 'T1-3', function: 'Protective Earth', wireColor: 'Green/Yellow', notes: 'Safety ground' },
      { name: 'U L1', number: 'T2-1', function: 'Voltage Input L1', wireColor: 'Brown', notes: 'Phase A' },
      { name: 'U L2', number: 'T2-2', function: 'Voltage Input L2', wireColor: 'Black', notes: 'Phase B' },
      { name: 'U L3', number: 'T2-3', function: 'Voltage Input L3', wireColor: 'Grey', notes: 'Phase C' },
      { name: 'U N', number: 'T2-4', function: 'Voltage Neutral', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'I L1/k', number: 'T3-1', function: 'CT L1 Input k', wireColor: 'Red', notes: 'CT primary' },
      { name: 'I L1/l', number: 'T3-2', function: 'CT L1 Output l', wireColor: 'Black', notes: 'CT secondary' },
      { name: 'I L2/k', number: 'T3-3', function: 'CT L2 Input k', wireColor: 'Red', notes: 'CT primary' },
      { name: 'I L2/l', number: 'T3-4', function: 'CT L2 Output l', wireColor: 'Black', notes: 'CT secondary' },
      { name: 'I L3/k', number: 'T3-5', function: 'CT L3 Input k', wireColor: 'Red', notes: 'CT primary' },
      { name: 'I L3/l', number: 'T3-6', function: 'CT L3 Output l', wireColor: 'Black', notes: 'CT secondary' },
      { name: 'DI1+', number: 'T4-1', function: 'Digital Input 1+', wireColor: 'White', notes: 'Active high' },
      { name: 'DI1-', number: 'T4-2', function: 'Digital Input 1-', wireColor: 'Blue', notes: 'Common' },
      { name: 'DI2+', number: 'T4-3', function: 'Digital Input 2+', wireColor: 'White', notes: 'Active high' },
      { name: 'DI2-', number: 'T4-4', function: 'Digital Input 2-', wireColor: 'Blue', notes: 'Common' },
      { name: 'DO1 NO', number: 'T5-1', function: 'Relay 1 NO', wireColor: 'Red', notes: 'Normally open' },
      { name: 'DO1 COM', number: 'T5-2', function: 'Relay 1 Common', wireColor: 'White', notes: 'Common' },
      { name: 'DO1 NC', number: 'T5-3', function: 'Relay 1 NC', wireColor: 'Blue', notes: 'Normally closed' },
      { name: 'PROFINET P1', number: 'RJ45-1', function: 'PROFINET Port 1', wireColor: 'N/A', notes: 'Ethernet' },
      { name: 'PROFINET P2', number: 'RJ45-2', function: 'PROFINET Port 2', wireColor: 'N/A', notes: 'Ethernet' },
      { name: 'MODBUS+', number: 'T6-1', function: 'Modbus RS485 A', wireColor: 'Cyan', notes: 'Data +' },
      { name: 'MODBUS-', number: 'T6-2', function: 'Modbus RS485 B', wireColor: 'Purple', notes: 'Data -' },
      { name: 'MODBUS GND', number: 'T6-3', function: 'Modbus Ground', wireColor: 'Black', notes: 'Shield' },
    ],
    connections: [
      { from: 'DC Supply +', to: 'T1-1 (L+)', wire: '1.5mm²', color: '#EF4444', description: '24V DC nominal' },
      { from: 'DC Supply -', to: 'T1-2 (M)', wire: '1.5mm²', color: '#1E293B', description: 'Ground reference' },
      { from: 'Phase L1', to: 'T2-1 (U L1)', wire: '2.5mm²', color: '#92400E', description: 'Voltage sensing' },
      { from: 'Phase L2', to: 'T2-2 (U L2)', wire: '2.5mm²', color: '#1E293B', description: 'Voltage sensing' },
      { from: 'Phase L3', to: 'T2-3 (U L3)', wire: '2.5mm²', color: '#6B7280', description: 'Voltage sensing' },
      { from: 'Neutral', to: 'T2-4 (U N)', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral' },
      { from: 'CT L1', to: 'T3-1/2', wire: '2.5mm²', color: '#EF4444', description: 'Current sensing L1' },
      { from: 'CT L2', to: 'T3-3/4', wire: '2.5mm²', color: '#EF4444', description: 'Current sensing L2' },
      { from: 'CT L3', to: 'T3-5/6', wire: '2.5mm²', color: '#EF4444', description: 'Current sensing L3' },
    ],
    notes: [
      'DIGSI software required for SIPROTEC devices',
      'SENTRON powerconfig for PAC series configuration',
      'PROFINET support for industrial automation integration',
      'Modbus RTU and Modbus TCP protocols supported',
      'IEC 61850 communication available on some models',
    ]
  },

  // ═══════════════════════════════════════════════════════════════
  // 9. ENKO
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'enko-gcu300',
    brand: 'ENKO',
    model: 'GCU-300',
    description: 'Generator Control Unit with LCD Display',
    color: '#7C3AED',
    terminals: [
      { name: 'DC+', number: '1', function: 'Supply +9-32V DC', wireColor: 'Red', notes: 'Battery positive' },
      { name: 'DC-', number: '2', function: 'Supply Ground', wireColor: 'Black', notes: 'Battery negative' },
      { name: 'W', number: '3', function: 'Alternator W', wireColor: 'Yellow', notes: 'Charge monitoring' },
      { name: 'OIL P', number: '4', function: 'Oil Pressure', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'WATER T', number: '5', function: 'Water Temperature', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'FUEL L', number: '6', function: 'Fuel Level', wireColor: 'Orange', notes: 'Analog input' },
      { name: 'AUX1', number: '7', function: 'Auxiliary Input 1', wireColor: 'White', notes: 'Configurable' },
      { name: 'AUX2', number: '8', function: 'Auxiliary Input 2', wireColor: 'White', notes: 'Configurable' },
      { name: 'SENSOR GND', number: '9', function: 'Sensor Ground', wireColor: 'Black', notes: 'Sender return' },
      { name: 'MPU+', number: '10', function: 'Speed Pickup +', wireColor: 'White', notes: 'Magnetic pickup' },
      { name: 'MPU-', number: '11', function: 'Speed Pickup -', wireColor: 'White/Black', notes: 'MPU return' },
      { name: 'START', number: '12', function: 'Start Output', wireColor: 'Green', notes: 'To starter relay' },
      { name: 'FUEL/RUN', number: '13', function: 'Fuel/Run Output', wireColor: 'Brown', notes: 'Fuel solenoid' },
      { name: 'PREHEAT', number: '14', function: 'Preheat Output', wireColor: 'Orange', notes: 'Glow plugs' },
      { name: 'GCB', number: '15', function: 'Generator Breaker', wireColor: 'Orange', notes: 'Close/Trip' },
      { name: 'MCB', number: '16', function: 'Mains Breaker', wireColor: 'Orange', notes: 'Close/Trip' },
      { name: 'ALARM', number: '17', function: 'Alarm Output', wireColor: 'Pink', notes: 'Common alarm' },
      { name: 'GEN L1', number: '18', function: 'Generator L1', wireColor: 'Brown', notes: '50-500V AC' },
      { name: 'GEN L2', number: '19', function: 'Generator L2', wireColor: 'Black', notes: '50-500V AC' },
      { name: 'GEN L3', number: '20', function: 'Generator L3', wireColor: 'Grey', notes: '50-500V AC' },
      { name: 'GEN N', number: '21', function: 'Generator N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'MAINS L1', number: '22', function: 'Mains L1', wireColor: 'Brown', notes: '50-500V AC' },
      { name: 'MAINS N', number: '23', function: 'Mains N', wireColor: 'Blue', notes: 'Neutral' },
      { name: 'CT1', number: '24', function: 'CT L1', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT2', number: '25', function: 'CT L2', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT3', number: '26', function: 'CT L3', wireColor: 'Red', notes: '5A secondary' },
      { name: 'CT-', number: '27', function: 'CT Common', wireColor: 'Black', notes: 'CT return' },
      { name: 'RS485 A', number: '28', function: 'RS485 Data A', wireColor: 'Cyan', notes: 'Communication' },
      { name: 'RS485 B', number: '29', function: 'RS485 Data B', wireColor: 'Purple', notes: 'Communication' },
    ],
    connections: [
      { from: 'Battery +', to: 'Terminal 1 (DC+)', wire: '2.5mm²', color: '#EF4444', description: '9-32V DC supply' },
      { from: 'Battery -', to: 'Terminal 2 (DC-)', wire: '2.5mm²', color: '#1E293B', description: 'Ground' },
      { from: 'Oil Pressure', to: 'Terminal 4', wire: '1.0mm²', color: '#F97316', description: 'Sender input' },
      { from: 'Coolant Temp', to: 'Terminal 5', wire: '1.0mm²', color: '#F97316', description: 'Sender input' },
      { from: 'Start Relay', to: 'Terminal 12', wire: '1.5mm²', color: '#10B981', description: 'Cranking control' },
      { from: 'Fuel Solenoid', to: 'Terminal 13', wire: '1.5mm²', color: '#92400E', description: 'Run control' },
      { from: 'Generator L1', to: 'Terminal 18', wire: '2.5mm²', color: '#92400E', description: 'Phase sensing' },
      { from: 'Generator N', to: 'Terminal 21', wire: '2.5mm²', color: '#3B82F6', description: 'Neutral sensing' },
    ],
    notes: [
      'ENKO Software Suite for configuration',
      'LCD display shows all parameters locally',
      'Configurable sensor curves for different sender types',
      'Modbus RTU protocol for remote monitoring',
      'Event logging with date/time stamp',
    ]
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// WIRING DIAGRAM COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface AllControllerWiringDiagramsProps {
  className?: string;
}

export default function AllControllerWiringDiagrams({ className = '' }: AllControllerWiringDiagramsProps) {
  const [selectedController, setSelectedController] = useState(CONTROLLER_WIRING_DATA[0].id);
  const [showColorLegend, setShowColorLegend] = useState(true);

  const controller = CONTROLLER_WIRING_DATA.find(c => c.id === selectedController) || CONTROLLER_WIRING_DATA[0];

  return (
    <div className={`bg-slate-900 rounded-xl overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📐</span> All 9 Controller Wiring Diagrams
        </h2>
        <p className="text-cyan-100 text-sm mt-1">
          Complete terminal pinouts with IEC color codes for DSE, ComAp, Woodward, SmartGen, CAT, Datakom, Lovato, Siemens, ENKO
        </p>
      </div>

      {/* Controller Selector */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex flex-wrap gap-2">
          {CONTROLLER_WIRING_DATA.map((ctrl) => (
            <button
              key={ctrl.id}
              onClick={() => setSelectedController(ctrl.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedController === ctrl.id
                  ? 'text-white shadow-lg'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
              style={{
                backgroundColor: selectedController === ctrl.id ? ctrl.color : undefined,
              }}
            >
              {ctrl.brand.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Wire Color Legend Toggle */}
      <div className="px-4 py-2 border-b border-slate-700 flex items-center justify-between">
        <span className="text-slate-400 text-sm">IEC Wire Color Standards</span>
        <button
          onClick={() => setShowColorLegend(!showColorLegend)}
          className="px-3 py-1 bg-slate-800 text-slate-300 rounded text-sm hover:bg-slate-700"
        >
          {showColorLegend ? 'Hide' : 'Show'} Color Legend
        </button>
      </div>

      {/* Color Legend */}
      <AnimatePresence>
        {showColorLegend && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-slate-800/50 border-b border-slate-700">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {Object.entries(WIRE_COLOR_CODES).map(([key, wire]) => (
                  <div key={key} className="flex items-center gap-2 p-2 bg-slate-900/50 rounded">
                    <div
                      className="w-6 h-3 rounded border border-slate-600"
                      style={{ backgroundColor: wire.hex }}
                    />
                    <div>
                      <div className="text-xs font-bold text-white">{key}</div>
                      <div className="text-[10px] text-slate-400">{wire.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controller Details */}
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: controller.color }}
            />
            <h3 className="text-lg font-bold text-white">{controller.brand}</h3>
          </div>
          <p className="text-cyan-400 font-medium">{controller.model}</p>
          <p className="text-slate-400 text-sm">{controller.description}</p>
        </div>

        {/* Terminal Pinout Table */}
        <div className="mb-6">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>📍</span> Terminal Pinout
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800">
                  <th className="px-3 py-2 text-left text-slate-400">Terminal</th>
                  <th className="px-3 py-2 text-left text-slate-400">Name</th>
                  <th className="px-3 py-2 text-left text-slate-400">Function</th>
                  <th className="px-3 py-2 text-left text-slate-400">Wire Color</th>
                  <th className="px-3 py-2 text-left text-slate-400">Notes</th>
                </tr>
              </thead>
              <tbody>
                {controller.terminals.map((term, idx) => {
                  const wireColor = Object.values(WIRE_COLOR_CODES).find(
                    w => w.name.toLowerCase().includes(term.wireColor.toLowerCase())
                  );
                  return (
                    <tr key={idx} className="border-b border-slate-700">
                      <td className="px-3 py-2 text-cyan-400 font-mono font-bold">{term.number}</td>
                      <td className="px-3 py-2 text-white font-medium">{term.name}</td>
                      <td className="px-3 py-2 text-slate-300">{term.function}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-2 rounded border border-slate-600"
                            style={{ backgroundColor: wireColor?.hex || '#6B7280' }}
                          />
                          <span className="text-slate-300">{term.wireColor}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-slate-400 text-xs">{term.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Connection Diagram */}
        <div className="mb-6">
          <h4 className="text-white font-bold mb-2 flex items-center gap-2">
            <span>🔌</span> Connection Diagram
          </h4>
          <div className="bg-slate-800/50 rounded-lg p-4">
            <svg viewBox="0 0 800 400" className="w-full h-auto">
              <rect width="800" height="400" fill="#0f172a" />

              {/* Controller Box */}
              <g transform="translate(300, 50)">
                <rect
                  width="200"
                  height="300"
                  fill="#1e293b"
                  stroke={controller.color}
                  strokeWidth="3"
                  rx="10"
                />
                <text x="100" y="30" fill={controller.color} fontSize="14" fontWeight="bold" textAnchor="middle">
                  {controller.brand.split(' ')[0]}
                </text>
                <text x="100" y="50" fill="#94a3b8" fontSize="10" textAnchor="middle">
                  {controller.model}
                </text>

                {/* Terminal indicators */}
                {controller.terminals.slice(0, 12).map((term, idx) => (
                  <g key={idx} transform={`translate(20, ${70 + idx * 18})`}>
                    <circle cx="0" cy="0" r="4" fill={controller.color} />
                    <text x="10" y="4" fill="#e2e8f0" fontSize="8">
                      {term.number}: {term.name}
                    </text>
                  </g>
                ))}
              </g>

              {/* External Components */}
              {/* Battery */}
              <g transform="translate(50, 80)">
                <rect width="80" height="40" fill="#1e293b" stroke="#22c55e" strokeWidth="2" rx="5" />
                <text x="40" y="25" fill="#22c55e" fontSize="10" textAnchor="middle">BATTERY</text>
                <text x="40" y="55" fill="#94a3b8" fontSize="8" textAnchor="middle">12/24V DC</text>
              </g>
              <line x1="130" y1="100" x2="280" y2="90" stroke="#ef4444" strokeWidth="2" />
              <line x1="130" y1="105" x2="280" y2="108" stroke="#1e293b" strokeWidth="2" />

              {/* Engine */}
              <g transform="translate(50, 180)">
                <rect width="80" height="60" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" rx="5" />
                <text x="40" y="25" fill="#f59e0b" fontSize="10" textAnchor="middle">ENGINE</text>
                <text x="40" y="40" fill="#94a3b8" fontSize="8" textAnchor="middle">Oil/Temp</text>
                <text x="40" y="52" fill="#94a3b8" fontSize="8" textAnchor="middle">Sensors</text>
              </g>
              <line x1="130" y1="200" x2="280" y2="145" stroke="#f97316" strokeWidth="2" />
              <line x1="130" y1="220" x2="280" y2="163" stroke="#f97316" strokeWidth="2" />

              {/* Generator */}
              <g transform="translate(600, 80)">
                <rect width="100" height="80" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="5" />
                <text x="50" y="25" fill="#3b82f6" fontSize="10" textAnchor="middle">GENERATOR</text>
                <text x="50" y="45" fill="#94a3b8" fontSize="8" textAnchor="middle">L1 L2 L3 N</text>
                <text x="50" y="60" fill="#94a3b8" fontSize="8" textAnchor="middle">400V AC</text>
              </g>
              <line x1="520" y1="120" x2="600" y2="110" stroke="#92400e" strokeWidth="2" />
              <line x1="520" y1="135" x2="600" y2="130" stroke="#3b82f6" strokeWidth="2" />

              {/* Mains */}
              <g transform="translate(600, 200)">
                <rect width="100" height="60" fill="#1e293b" stroke="#a855f7" strokeWidth="2" rx="5" />
                <text x="50" y="25" fill="#a855f7" fontSize="10" textAnchor="middle">MAINS</text>
                <text x="50" y="45" fill="#94a3b8" fontSize="8" textAnchor="middle">KPLC/Utility</text>
              </g>
              <line x1="520" y1="200" x2="600" y2="220" stroke="#92400e" strokeWidth="2" />

              {/* Starter Relay */}
              <g transform="translate(50, 300)">
                <rect width="80" height="40" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="5" />
                <text x="40" y="25" fill="#10b981" fontSize="10" textAnchor="middle">STARTER</text>
              </g>
              <line x1="130" y1="320" x2="280" y2="250" stroke="#10b981" strokeWidth="2" />

              {/* Legend */}
              <g transform="translate(50, 370)">
                <text x="0" y="0" fill="#94a3b8" fontSize="10">Wire Colors: </text>
                <rect x="80" y="-8" width="15" height="8" fill="#ef4444" />
                <text x="100" y="0" fill="#94a3b8" fontSize="8">DC+</text>
                <rect x="130" y="-8" width="15" height="8" fill="#1e293b" stroke="#64748b" />
                <text x="150" y="0" fill="#94a3b8" fontSize="8">DC-</text>
                <rect x="180" y="-8" width="15" height="8" fill="#92400e" />
                <text x="200" y="0" fill="#94a3b8" fontSize="8">L1</text>
                <rect x="220" y="-8" width="15" height="8" fill="#3b82f6" />
                <text x="240" y="0" fill="#94a3b8" fontSize="8">N</text>
                <rect x="260" y="-8" width="15" height="8" fill="#f97316" />
                <text x="280" y="0" fill="#94a3b8" fontSize="8">Sensor</text>
                <rect x="320" y="-8" width="15" height="8" fill="#10b981" />
                <text x="340" y="0" fill="#94a3b8" fontSize="8">Start</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Wiring Notes */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
          <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
            <span>⚠️</span> Important Wiring Notes
          </h4>
          <ul className="space-y-1">
            {controller.notes.map((note, idx) => (
              <li key={idx} className="text-amber-200 text-sm flex gap-2">
                <span>•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
