'use client';

/**
 * PROFESSIONAL WIRING & SCHEMATIC DIAGRAMS PANEL
 * Industry-grade electrical documentation with detailed schematics
 *
 * Features:
 * - IEEE/IEC standard electrical symbols
 * - Complete wiring runs with junction points
 * - Interactive circuit tracing with current flow animation
 * - Detailed component specifications
 * - Terminal block diagrams
 * - Full pinout with wire gauges and colors
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== ELECTRICAL SYMBOLS (SVG) ====================
const ElectricalSymbols = {
  // Power Sources
  battery: (x: number, y: number, voltage: string = '24V') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="0" y1="-15" x2="0" y2="-8" stroke="#ef4444" strokeWidth="2" />
      <line x1="-12" y1="-8" x2="12" y2="-8" stroke="#ef4444" strokeWidth="3" />
      <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#ef4444" strokeWidth="2" />
      <line x1="-12" y1="2" x2="12" y2="2" stroke="#ef4444" strokeWidth="3" />
      <line x1="-6" y1="7" x2="6" y2="7" stroke="#ef4444" strokeWidth="2" />
      <line x1="0" y1="7" x2="0" y2="15" stroke="#ef4444" strokeWidth="2" />
      <text x="18" y="0" fill="#94a3b8" fontSize="9" fontWeight="bold">{voltage}</text>
      <text x="-8" y="-18" fill="#22c55e" fontSize="8">+</text>
      <text x="-8" y="22" fill="#64748b" fontSize="8">-</text>
    </g>
  ),

  // Ground Symbol
  ground: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="0" y1="-10" x2="0" y2="0" stroke="#22c55e" strokeWidth="2" />
      <line x1="-12" y1="0" x2="12" y2="0" stroke="#22c55e" strokeWidth="2" />
      <line x1="-8" y1="4" x2="8" y2="4" stroke="#22c55e" strokeWidth="2" />
      <line x1="-4" y1="8" x2="4" y2="8" stroke="#22c55e" strokeWidth="2" />
    </g>
  ),

  // Fuse Symbol
  fuse: (x: number, y: number, rating: string = '15A') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-15" y="-6" width="30" height="12" rx="2" fill="none" stroke="#f59e0b" strokeWidth="2" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2,2" />
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="#f59e0b" strokeWidth="2" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="#f59e0b" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">{rating}</text>
    </g>
  ),

  // Relay Coil
  relayCoil: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-20" y="-15" width="40" height="30" rx="3" fill="none" stroke="#8b5cf6" strokeWidth="2" />
      <ellipse cx="0" cy="0" rx="10" ry="8" fill="none" stroke="#8b5cf6" strokeWidth="1.5" />
      <line x1="-20" y1="-8" x2="-30" y2="-8" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-20" y1="8" x2="-30" y2="8" stroke="#8b5cf6" strokeWidth="2" />
      <text x="0" y="25" textAnchor="middle" fill="#a78bfa" fontSize="9" fontWeight="bold">{label}</text>
    </g>
  ),

  // Relay Contact (NO)
  relayContactNO: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-8" y1="0" x2="6" y2="-10" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="2" fill="#8b5cf6" />
      <circle cx="8" cy="0" r="2" fill="#8b5cf6" />
      <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Relay Contact (NC)
  relayContactNC: (x: number, y: number, label: string = 'K1') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#8b5cf6" strokeWidth="2" />
      <line x1="-8" y1="5" x2="8" y2="-5" stroke="#8b5cf6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="2" fill="#8b5cf6" />
      <circle cx="8" cy="0" r="2" fill="#8b5cf6" />
      <line x1="0" y1="-8" x2="0" y2="-3" stroke="#8b5cf6" strokeWidth="1" />
      <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Solenoid
  solenoid: (x: number, y: number, label: string = 'SOL') => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-18" y="-12" width="36" height="24" rx="2" fill="none" stroke="#f97316" strokeWidth="2" />
      {[...Array(4)].map((_, i) => (
        <path key={i} d={`M ${-12 + i*8} -6 Q ${-8 + i*8} 0, ${-12 + i*8} 6`} fill="none" stroke="#f97316" strokeWidth="1.5" />
      ))}
      <line x1="-18" y1="0" x2="-28" y2="0" stroke="#f97316" strokeWidth="2" />
      <line x1="18" y1="0" x2="28" y2="0" stroke="#f97316" strokeWidth="2" />
      <text x="0" y="22" textAnchor="middle" fill="#fb923c" fontSize="8">{label}</text>
    </g>
  ),

  // Motor/Starter
  motor: (x: number, y: number, label: string = 'M') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="18" fill="none" stroke="#06b6d4" strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fill="#06b6d4" fontSize="14" fontWeight="bold">{label}</text>
      <line x1="-18" y1="0" x2="-28" y2="0" stroke="#06b6d4" strokeWidth="2" />
      <line x1="18" y1="0" x2="28" y2="0" stroke="#06b6d4" strokeWidth="2" />
    </g>
  ),

  // Sensor (Generic)
  sensor: (x: number, y: number, label: string = 'S', type: string = 'temp') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="12" fill="none" stroke="#3b82f6" strokeWidth="2" />
      <text x="0" y="4" textAnchor="middle" fill="#3b82f6" fontSize="10">{label}</text>
      <line x1="0" y1="-12" x2="0" y2="-22" stroke="#3b82f6" strokeWidth="2" />
      <line x1="0" y1="12" x2="0" y2="22" stroke="#3b82f6" strokeWidth="2" />
      <text x="0" y="32" textAnchor="middle" fill="#94a3b8" fontSize="7">{type}</text>
    </g>
  ),

  // Resistor (for sensors)
  resistor: (x: number, y: number, value: string = '') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-25" y1="0" x2="-18" y2="0" stroke="#eab308" strokeWidth="2" />
      <path d="M -18 0 L -15 -6 L -9 6 L -3 -6 L 3 6 L 9 -6 L 15 6 L 18 0" fill="none" stroke="#eab308" strokeWidth="2" />
      <line x1="18" y1="0" x2="25" y2="0" stroke="#eab308" strokeWidth="2" />
      {value && <text x="0" y="15" textAnchor="middle" fill="#94a3b8" fontSize="7">{value}</text>}
    </g>
  ),

  // Capacitor
  capacitor: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-4" y2="0" stroke="#10b981" strokeWidth="2" />
      <line x1="-4" y1="-10" x2="-4" y2="10" stroke="#10b981" strokeWidth="2" />
      <line x1="4" y1="-10" x2="4" y2="10" stroke="#10b981" strokeWidth="2" />
      <line x1="4" y1="0" x2="20" y2="0" stroke="#10b981" strokeWidth="2" />
    </g>
  ),

  // Diode
  diode: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#ec4899" strokeWidth="2" />
      <polygon points="-8,-8 -8,8 8,0" fill="none" stroke="#ec4899" strokeWidth="2" />
      <line x1="8" y1="-8" x2="8" y2="8" stroke="#ec4899" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#ec4899" strokeWidth="2" />
    </g>
  ),

  // Switch (SPST)
  switchSPST: (x: number, y: number, label: string = 'SW') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#14b8a6" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#14b8a6" strokeWidth="2" />
      <circle cx="-8" cy="0" r="3" fill="#14b8a6" />
      <circle cx="8" cy="0" r="3" fill="none" stroke="#14b8a6" strokeWidth="2" />
      <line x1="-6" y1="-2" x2="6" y2="-10" stroke="#14b8a6" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#94a3b8" fontSize="8">{label}</text>
    </g>
  ),

  // Push Button (NO)
  pushButtonNO: (x: number, y: number, label: string = 'PB') => (
    <g transform={`translate(${x}, ${y})`}>
      <line x1="-20" y1="0" x2="-8" y2="0" stroke="#ef4444" strokeWidth="2" />
      <line x1="8" y1="0" x2="20" y2="0" stroke="#ef4444" strokeWidth="2" />
      <circle cx="-8" cy="0" r="3" fill="#ef4444" />
      <circle cx="8" cy="0" r="3" fill="none" stroke="#ef4444" strokeWidth="2" />
      <line x1="-8" y1="-12" x2="8" y2="-12" stroke="#ef4444" strokeWidth="2" />
      <line x1="0" y1="-12" x2="0" y2="-5" stroke="#ef4444" strokeWidth="2" />
      <text x="0" y="18" textAnchor="middle" fill="#fca5a5" fontSize="8">{label}</text>
    </g>
  ),

  // E-Stop Button
  eStop: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#991b1b" strokeWidth="3" />
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="#fff" strokeWidth="3" />
      <line x1="8" y1="-8" x2="-8" y2="8" stroke="#fff" strokeWidth="3" />
      <text x="0" y="28" textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">E-STOP</text>
    </g>
  ),

  // Terminal Block
  terminalBlock: (x: number, y: number, terminals: string[]) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x="-30" y={-terminals.length * 10} width="60" height={terminals.length * 20} fill="#1e293b" stroke="#475569" strokeWidth="2" />
      {terminals.map((t, i) => (
        <g key={i} transform={`translate(0, ${-terminals.length * 10 + 10 + i * 20})`}>
          <rect x="-25" y="-7" width="50" height="14" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <circle cx="-35" cy="0" r="4" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <circle cx="35" cy="0" r="4" fill="#475569" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="4" textAnchor="middle" fill="#94a3b8" fontSize="8">{t}</text>
        </g>
      ))}
    </g>
  ),

  // CT (Current Transformer)
  currentTransformer: (x: number, y: number, label: string = 'CT') => (
    <g transform={`translate(${x}, ${y})`}>
      <circle cx="0" cy="0" r="15" fill="none" stroke="#a855f7" strokeWidth="2" />
      <circle cx="0" cy="0" r="10" fill="none" stroke="#a855f7" strokeWidth="1" />
      <line x1="-25" y1="0" x2="-15" y2="0" stroke="#a855f7" strokeWidth="3" />
      <line x1="15" y1="0" x2="25" y2="0" stroke="#a855f7" strokeWidth="3" />
      <line x1="0" y1="15" x2="0" y2="25" stroke="#a855f7" strokeWidth="2" />
      <line x1="0" y1="-15" x2="0" y2="-25" stroke="#a855f7" strokeWidth="2" />
      <text x="0" y="35" textAnchor="middle" fill="#c4b5fd" fontSize="8">{label}</text>
    </g>
  ),

  // Controller Box
  controller: (x: number, y: number, w: number, h: number, label: string, pins: {name: string, y: number, side: 'left'|'right'}[]) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-w/2} y={-h/2} width={w} height={h} rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
      <rect x={-w/2+5} y={-h/2+5} width={w-10} height={25} rx="4" fill="#1e293b" />
      <text x="0" y={-h/2+20} textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">{label}</text>
      {pins.map((pin, i) => (
        <g key={i}>
          <circle
            cx={pin.side === 'left' ? -w/2 : w/2}
            cy={pin.y}
            r="4"
            fill="#1e293b"
            stroke="#06b6d4"
            strokeWidth="2"
          />
          <text
            x={pin.side === 'left' ? -w/2 + 10 : w/2 - 10}
            y={pin.y + 3}
            textAnchor={pin.side === 'left' ? 'start' : 'end'}
            fill="#94a3b8"
            fontSize="7"
          >
            {pin.name}
          </text>
        </g>
      ))}
    </g>
  ),

  // Wire Junction (Dot)
  junction: (x: number, y: number) => (
    <circle cx={x} cy={y} r="4" fill="#f59e0b" />
  ),

  // Wire Crossover (No connection)
  crossover: (x: number, y: number) => (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -10 0 Q 0 -8, 10 0" fill="none" stroke="#64748b" strokeWidth="2" />
    </g>
  ),
};

// ==================== DETAILED SCHEMATIC DATA ====================
interface SchematicComponent {
  id: string;
  type: 'battery' | 'fuse' | 'relay' | 'solenoid' | 'motor' | 'sensor' | 'switch' | 'ground' | 'terminal' | 'ct' | 'controller' | 'resistor' | 'diode' | 'estop' | 'capacitor';
  x: number;
  y: number;
  label: string;
  value?: string;
  specs?: string;
}

interface WireRun {
  id: string;
  from: { component: string; terminal: string };
  to: { component: string; terminal: string };
  color: string;
  gauge: string;
  path: string; // SVG path
  junctions?: { x: number; y: number }[];
}

interface DetailedCircuit {
  id: string;
  name: string;
  description: string;
  components: SchematicComponent[];
  wires: WireRun[];
  notes: string[];
}

// ==================== CONTROLLER DATABASE ====================
interface ControllerModel {
  id: string;
  brand: string;
  model: string;
  type: 'genset' | 'ats' | 'load-share' | 'mains';
  features: string[];
  pinCount: number;
  voltage: string;
  dimensions?: string;
}

const CONTROLLERS: ControllerModel[] = [
  // DSE Controllers
  { id: 'dse-7320', brand: 'DSE', model: '7320 MKII', type: 'genset', features: ['AMF', 'Load Share', 'CAN', 'J1939'], pinCount: 32, voltage: '8-35V DC' },
  { id: 'dse-7310', brand: 'DSE', model: '7310 MKII', type: 'genset', features: ['AMF', 'CAN'], pinCount: 28, voltage: '8-35V DC' },
  { id: 'dse-6020', brand: 'DSE', model: '6020 MKII', type: 'genset', features: ['Manual', 'Auto'], pinCount: 20, voltage: '8-35V DC' },
  { id: 'dse-6120', brand: 'DSE', model: '6120 MKII', type: 'genset', features: ['AMF', 'Auto'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'dse-4520', brand: 'DSE', model: '4520', type: 'genset', features: ['Compact', 'Basic'], pinCount: 16, voltage: '8-35V DC' },
  { id: 'dse-8610', brand: 'DSE', model: '8610 MKII', type: 'load-share', features: ['Load Share', 'Sync', 'CAN'], pinCount: 40, voltage: '8-35V DC' },
  { id: 'dse-8660', brand: 'DSE', model: '8660 MKII', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 44, voltage: '8-35V DC' },
  // ComAp Controllers
  { id: 'comap-intelilite', brand: 'ComAp', model: 'InteliLite NT', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-36V DC' },
  { id: 'comap-inteligen', brand: 'ComAp', model: 'InteliGen NT', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 36, voltage: '8-36V DC' },
  { id: 'comap-intelisys', brand: 'ComAp', model: 'InteliSys NT', type: 'load-share', features: ['Advanced Sync', 'PMS'], pinCount: 48, voltage: '8-36V DC' },
  { id: 'comap-intelimains', brand: 'ComAp', model: 'InteliMains NT', type: 'mains', features: ['Mains Decoupling'], pinCount: 20, voltage: '8-36V DC' },
  // Woodward Controllers
  { id: 'woodward-easygen3000', brand: 'Woodward', model: 'easYgen 3000', type: 'genset', features: ['AMF', 'Load Share', 'Modbus'], pinCount: 40, voltage: '8-32V DC' },
  { id: 'woodward-easygen2000', brand: 'Woodward', model: 'easYgen 2000', type: 'genset', features: ['AMF', 'Basic'], pinCount: 28, voltage: '8-32V DC' },
  { id: 'woodward-dtsc200', brand: 'Woodward', model: 'DTSC-200', type: 'genset', features: ['Digital', 'CAN'], pinCount: 24, voltage: '9-32V DC' },
  // SmartGen Controllers
  { id: 'smartgen-hgm6120', brand: 'SmartGen', model: 'HGM6120', type: 'genset', features: ['AMF', 'Basic'], pinCount: 20, voltage: '8-35V DC' },
  { id: 'smartgen-hgm7220', brand: 'SmartGen', model: 'HGM7220', type: 'genset', features: ['AMF', 'CAN'], pinCount: 28, voltage: '8-35V DC' },
  { id: 'smartgen-hgm9320', brand: 'SmartGen', model: 'HGM9320', type: 'genset', features: ['AMF', 'Load Share'], pinCount: 36, voltage: '8-35V DC' },
  { id: 'smartgen-hgm9510', brand: 'SmartGen', model: 'HGM9510', type: 'load-share', features: ['Sync', 'PMS'], pinCount: 44, voltage: '8-35V DC' },
  // PowerWizard Controllers
  { id: 'powerwizard-10', brand: 'PowerWizard', model: '1.0', type: 'genset', features: ['Basic', 'CAT'], pinCount: 20, voltage: '9-32V DC' },
  { id: 'powerwizard-11', brand: 'PowerWizard', model: '1.1', type: 'genset', features: ['AMF', 'CAT'], pinCount: 24, voltage: '9-32V DC' },
  { id: 'powerwizard-20', brand: 'PowerWizard', model: '2.0', type: 'genset', features: ['Advanced', 'Load Share'], pinCount: 32, voltage: '9-32V DC' },
];

// ==================== CIRCUIT CATEGORIES ====================
const CIRCUIT_CATEGORIES = [
  { id: 'power', name: 'Power Supply', icon: '🔋', color: '#ef4444' },
  { id: 'starting', name: 'Starting System', icon: '🔑', color: '#a855f7' },
  { id: 'fuel', name: 'Fuel System', icon: '⛽', color: '#f97316' },
  { id: 'cooling', name: 'Cooling System', icon: '❄️', color: '#06b6d4' },
  { id: 'sensing', name: 'Engine Sensing', icon: '📡', color: '#3b82f6' },
  { id: 'generator', name: 'Generator Output', icon: '⚡', color: '#eab308' },
  { id: 'protection', name: 'Protection', icon: '🛡️', color: '#22c55e' },
  { id: 'communication', name: 'Communication', icon: '🔗', color: '#14b8a6' },
];

// ==================== WIRE COLOR STANDARDS ====================
const WIRE_COLORS: { [key: string]: { hex: string; name: string; usage: string } } = {
  'red': { hex: '#ef4444', name: 'Red', usage: 'Battery +, Unswitched power' },
  'black': { hex: '#1f2937', name: 'Black', usage: 'Ground, Battery -' },
  'green': { hex: '#22c55e', name: 'Green', usage: 'Earth ground, CAN-H' },
  'green-yellow': { hex: '#84cc16', name: 'Green/Yellow', usage: 'Protective earth' },
  'blue': { hex: '#3b82f6', name: 'Blue', usage: 'Sensor signals, Phase L3' },
  'brown': { hex: '#92400e', name: 'Brown', usage: 'Temperature sensors, Phase L1' },
  'yellow': { hex: '#eab308', name: 'Yellow', usage: 'Oil pressure, CAN-L, Phase L2' },
  'orange': { hex: '#f97316', name: 'Orange', usage: 'Fuel control, RS485-B' },
  'purple': { hex: '#a855f7', name: 'Purple', usage: 'Start circuit' },
  'pink': { hex: '#ec4899', name: 'Pink', usage: 'Stop/Shutdown' },
  'white': { hex: '#f8fafc', name: 'White', usage: 'Neutral, Signal return' },
  'gray': { hex: '#6b7280', name: 'Gray', usage: 'Digital I/O, Shield' },
  'cyan': { hex: '#06b6d4', name: 'Cyan', usage: 'Speed sensor' },
};

// ==================== COMPLETE PIN CONFIGURATIONS ====================
interface PinConfig {
  pin: string;
  name: string;
  function: string;
  wireColor: string;
  wireGauge: string;
  circuit: string;
  voltage?: string;
  current?: string;
}

const CONTROLLER_PINS: { [key: string]: PinConfig[] } = {
  'dse-7320': [
    // Power Supply
    { pin: '1', name: 'B+', function: 'Battery Positive Input', wireColor: 'Red', wireGauge: '2.5mm²', circuit: 'power', voltage: '8-35V DC', current: '2A max' },
    { pin: '2', name: 'B-', function: 'Battery Negative/Ground', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: '3', name: 'CHASSIS', function: 'Chassis Ground', wireColor: 'Green/Yellow', wireGauge: '2.5mm²', circuit: 'power' },
    // Starting Circuit
    { pin: '4', name: 'START', function: 'Crank/Start Output', wireColor: 'Purple', wireGauge: '1.5mm²', circuit: 'starting', voltage: 'B+', current: '3A max' },
    { pin: '5', name: 'START-RET', function: 'Start Return', wireColor: 'Purple/White', wireGauge: '1.5mm²', circuit: 'starting' },
    // Fuel System
    { pin: '6', name: 'FUEL', function: 'Fuel Solenoid Output', wireColor: 'Orange', wireGauge: '1.5mm²', circuit: 'fuel', voltage: 'B+', current: '5A max' },
    { pin: '7', name: 'FUEL-RET', function: 'Fuel Return', wireColor: 'Orange/White', wireGauge: '1.5mm²', circuit: 'fuel' },
    // Stop Circuit
    { pin: '8', name: 'STOP', function: 'Stop Solenoid Output', wireColor: 'Pink', wireGauge: '1.5mm²', circuit: 'protection', voltage: 'B+', current: '3A max' },
    // Glow Plug
    { pin: '9', name: 'PRE-HEAT', function: 'Glow Plug Relay Output', wireColor: 'Orange/Black', wireGauge: '1.5mm²', circuit: 'starting', current: '3A max' },
    // Sensing Inputs
    { pin: '10', name: 'OIL-P', function: 'Oil Pressure Sender (VDO/Datcon)', wireColor: 'Yellow', wireGauge: '0.75mm²', circuit: 'sensing', voltage: '0-5V' },
    { pin: '11', name: 'OIL-GND', function: 'Oil Pressure Ground', wireColor: 'Yellow/Black', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '12', name: 'TEMP', function: 'Coolant Temp Sender (NTC/PT100)', wireColor: 'Brown', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '13', name: 'TEMP-GND', function: 'Coolant Temp Ground', wireColor: 'Brown/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '14', name: 'FUEL-LVL', function: 'Fuel Level Sender (Resistive)', wireColor: 'Green', wireGauge: '0.75mm²', circuit: 'sensing', voltage: '0-90Ω / 0-180Ω' },
    { pin: '15', name: 'FUEL-GND', function: 'Fuel Level Ground', wireColor: 'Green/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    // Speed Sensing
    { pin: '16', name: 'MPU+', function: 'Magnetic Pickup Positive', wireColor: 'Cyan', wireGauge: '0.75mm²', circuit: 'sensing', voltage: '0.5-70V AC' },
    { pin: '17', name: 'MPU-', function: 'Magnetic Pickup Negative', wireColor: 'Cyan/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '18', name: 'MPU-SH', function: 'MPU Shield/Screen', wireColor: 'Gray', wireGauge: '0.5mm²', circuit: 'sensing' },
    // Generator Voltage Sensing
    { pin: '19', name: 'GEN-L1', function: 'Generator Voltage L1 (Phase A)', wireColor: 'Red', wireGauge: '1.0mm²', circuit: 'generator', voltage: '0-300V AC' },
    { pin: '20', name: 'GEN-L2', function: 'Generator Voltage L2 (Phase B)', wireColor: 'Yellow', wireGauge: '1.0mm²', circuit: 'generator', voltage: '0-300V AC' },
    { pin: '21', name: 'GEN-L3', function: 'Generator Voltage L3 (Phase C)', wireColor: 'Blue', wireGauge: '1.0mm²', circuit: 'generator', voltage: '0-300V AC' },
    { pin: '22', name: 'GEN-N', function: 'Generator Neutral', wireColor: 'White', wireGauge: '1.0mm²', circuit: 'generator' },
    // Current Transformers
    { pin: '23', name: 'CT-L1-S1', function: 'CT L1 Secondary S1', wireColor: 'Red/White', wireGauge: '1.0mm²', circuit: 'generator', current: '5A secondary' },
    { pin: '24', name: 'CT-L1-S2', function: 'CT L1 Secondary S2', wireColor: 'Red/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '25', name: 'CT-L2-S1', function: 'CT L2 Secondary S1', wireColor: 'Yellow/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '26', name: 'CT-L2-S2', function: 'CT L2 Secondary S2', wireColor: 'Yellow/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '27', name: 'CT-L3-S1', function: 'CT L3 Secondary S1', wireColor: 'Blue/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '28', name: 'CT-L3-S2', function: 'CT L3 Secondary S2', wireColor: 'Blue/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    // CAN Bus
    { pin: '29', name: 'CAN-H', function: 'CAN Bus High (J1939)', wireColor: 'Green', wireGauge: '0.5mm² Twisted', circuit: 'communication' },
    { pin: '30', name: 'CAN-L', function: 'CAN Bus Low (J1939)', wireColor: 'Yellow', wireGauge: '0.5mm² Twisted', circuit: 'communication' },
    { pin: '31', name: 'CAN-SH', function: 'CAN Shield', wireColor: 'Gray', wireGauge: 'Braid', circuit: 'communication' },
    // Digital I/O
    { pin: '32', name: 'E-STOP', function: 'Emergency Stop Input (NC)', wireColor: 'Red/Yellow', wireGauge: '1.0mm²', circuit: 'protection' },
  ],
  'comap-inteligen': [
    // Power
    { pin: 'A1', name: 'B+', function: 'Power Supply Positive', wireColor: 'Red', wireGauge: '2.5mm²', circuit: 'power', voltage: '8-36V DC' },
    { pin: 'A2', name: 'B-', function: 'Power Supply Negative', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: 'A3', name: 'PE', function: 'Protective Earth', wireColor: 'Green/Yellow', wireGauge: '2.5mm²', circuit: 'power' },
    // Outputs
    { pin: 'B1', name: 'CRANK', function: 'Starter Output', wireColor: 'Purple', wireGauge: '1.5mm²', circuit: 'starting', current: '2A' },
    { pin: 'B2', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', wireGauge: '1.5mm²', circuit: 'fuel', current: '4A' },
    { pin: 'B3', name: 'IDLE', function: 'Idle Solenoid', wireColor: 'Yellow/Orange', wireGauge: '1.5mm²', circuit: 'fuel', current: '2A' },
    { pin: 'B4', name: 'STOP', function: 'Stop Output', wireColor: 'Pink', wireGauge: '1.5mm²', circuit: 'protection', current: '2A' },
    { pin: 'B5', name: 'PREHEAT', function: 'Preheat Relay', wireColor: 'Orange/Black', wireGauge: '1.5mm²', circuit: 'starting', current: '2A' },
    { pin: 'B6', name: 'GCB', function: 'Gen Breaker Close', wireColor: 'Gray', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    { pin: 'B7', name: 'MCB', function: 'Mains Breaker Close', wireColor: 'Gray/White', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    // Analog Inputs
    { pin: 'C1', name: 'OIL', function: 'Oil Pressure 4-20mA', wireColor: 'Brown', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'C2', name: 'COOL', function: 'Coolant Temp PT100/NTC', wireColor: 'Blue', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'C3', name: 'FUEL-S', function: 'Fuel Level 0-10V', wireColor: 'Green', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'C4', name: 'AIN1', function: 'Analog Input 1', wireColor: 'White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'C5', name: 'AIN2', function: 'Analog Input 2', wireColor: 'White/Black', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'C6', name: 'A-GND', function: 'Analog Ground', wireColor: 'Black/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    // Speed Input
    { pin: 'D1', name: 'SPEED+', function: 'Speed Pickup +', wireColor: 'Cyan', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'D2', name: 'SPEED-', function: 'Speed Pickup -', wireColor: 'Cyan/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    // Generator Sensing
    { pin: 'E1', name: 'GEN-L1', function: 'Gen Voltage L1-N', wireColor: 'Red', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'E2', name: 'GEN-L2', function: 'Gen Voltage L2-N', wireColor: 'Yellow', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'E3', name: 'GEN-L3', function: 'Gen Voltage L3-N', wireColor: 'Blue', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'E4', name: 'GEN-N', function: 'Gen Neutral', wireColor: 'White', wireGauge: '1.0mm²', circuit: 'generator' },
    // CT Inputs
    { pin: 'F1', name: 'CT1-S1', function: 'CT1 Secondary S1', wireColor: 'Red/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'F2', name: 'CT1-S2', function: 'CT1 Secondary S2', wireColor: 'Red/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'F3', name: 'CT2-S1', function: 'CT2 Secondary S1', wireColor: 'Yellow/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'F4', name: 'CT2-S2', function: 'CT2 Secondary S2', wireColor: 'Yellow/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'F5', name: 'CT3-S1', function: 'CT3 Secondary S1', wireColor: 'Blue/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'F6', name: 'CT3-S2', function: 'CT3 Secondary S2', wireColor: 'Blue/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    // CAN Bus
    { pin: 'G1', name: 'CAN1-H', function: 'CAN Bus 1 High', wireColor: 'Green', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'G2', name: 'CAN1-L', function: 'CAN Bus 1 Low', wireColor: 'Yellow', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'G3', name: 'CAN2-H', function: 'CAN Bus 2 High', wireColor: 'Green/White', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'G4', name: 'CAN2-L', function: 'CAN Bus 2 Low', wireColor: 'Yellow/White', wireGauge: '0.5mm²', circuit: 'communication' },
    // RS485
    { pin: 'H1', name: 'RS485-A', function: 'RS485 Data A (+)', wireColor: 'Blue', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'H2', name: 'RS485-B', function: 'RS485 Data B (-)', wireColor: 'Orange', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'H3', name: 'RS-GND', function: 'RS485 Ground', wireColor: 'Black', wireGauge: '0.5mm²', circuit: 'communication' },
  ],
  'smartgen-hgm9320': [
    { pin: '1', name: 'DC+', function: 'Power Supply +', wireColor: 'Red', wireGauge: '2.5mm²', circuit: 'power', voltage: '8-35V DC' },
    { pin: '2', name: 'DC-', function: 'Power Supply -', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: '3', name: 'START', function: 'Start Relay', wireColor: 'Purple', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: '4', name: 'STOP', function: 'Stop Relay', wireColor: 'Pink', wireGauge: '1.5mm²', circuit: 'protection', current: '3A' },
    { pin: '5', name: 'FUEL', function: 'Fuel Valve', wireColor: 'Orange', wireGauge: '1.5mm²', circuit: 'fuel', current: '5A' },
    { pin: '6', name: 'PREHEAT', function: 'Preheat Relay', wireColor: 'Orange/Black', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: '7', name: 'IDLE', function: 'Idle Control', wireColor: 'Yellow/Orange', wireGauge: '1.0mm²', circuit: 'fuel', current: '2A' },
    { pin: '8', name: 'GCB-CL', function: 'Gen Breaker Close', wireColor: 'Gray', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    { pin: '9', name: 'MCB-CL', function: 'Mains Breaker Close', wireColor: 'Gray/White', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    { pin: '10', name: 'OIL-P', function: 'Oil Pressure Input', wireColor: 'Brown', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '11', name: 'WATER-T', function: 'Water Temp Input', wireColor: 'Blue', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '12', name: 'FUEL-L', function: 'Fuel Level', wireColor: 'Green', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '13', name: 'SPEED+', function: 'Speed Sensor +', wireColor: 'Cyan', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '14', name: 'SPEED-', function: 'Speed Sensor -', wireColor: 'Cyan/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '15', name: 'A-GND', function: 'Analog Ground', wireColor: 'Black/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: '16', name: 'GEN-L1', function: 'Generator L1', wireColor: 'Red', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '17', name: 'GEN-L2', function: 'Generator L2', wireColor: 'Yellow', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '18', name: 'GEN-L3', function: 'Generator L3', wireColor: 'Blue', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '19', name: 'GEN-N', function: 'Generator N', wireColor: 'White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '20', name: 'CT1+', function: 'CT1 S1', wireColor: 'Red/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '21', name: 'CT1-', function: 'CT1 S2', wireColor: 'Red/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: '22', name: 'CAN-H', function: 'CAN High', wireColor: 'Green', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: '23', name: 'CAN-L', function: 'CAN Low', wireColor: 'Yellow', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: '24', name: 'E-STOP', function: 'Emergency Stop', wireColor: 'Red/Yellow', wireGauge: '1.0mm²', circuit: 'protection' },
  ],
  'woodward-easygen3000': [
    { pin: 'X1:1', name: '+UB', function: 'Power Supply +', wireColor: 'Red', wireGauge: '2.5mm²', circuit: 'power', voltage: '8-32V DC' },
    { pin: 'X1:2', name: '-UB', function: 'Power Supply -', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: 'X1:3', name: 'PE', function: 'Protective Earth', wireColor: 'Green/Yellow', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: 'X2:1', name: 'DO1', function: 'Start Output', wireColor: 'Purple', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: 'X2:2', name: 'DO2', function: 'Fuel Output', wireColor: 'Orange', wireGauge: '1.5mm²', circuit: 'fuel', current: '5A' },
    { pin: 'X2:3', name: 'DO3', function: 'GCB Close', wireColor: 'Gray', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    { pin: 'X2:4', name: 'DO4', function: 'MCB Close', wireColor: 'Gray/White', wireGauge: '1.0mm²', circuit: 'protection', current: '2A' },
    { pin: 'X2:5', name: 'DO5', function: 'Preheat', wireColor: 'Orange/Black', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: 'X2:6', name: 'DO-COM', function: 'DO Common', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: 'X3:1', name: 'MPU+', function: 'Speed Pickup +', wireColor: 'Cyan', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X3:2', name: 'MPU-', function: 'Speed Pickup -', wireColor: 'Cyan/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X3:3', name: 'SH', function: 'MPU Shield', wireColor: 'Gray', wireGauge: 'Braid', circuit: 'sensing' },
    { pin: 'X4:1', name: 'AI1', function: 'Oil Pressure 4-20mA', wireColor: 'Brown', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X4:2', name: 'AI2', function: 'Coolant Temp PT100', wireColor: 'Blue', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X4:3', name: 'AI3', function: 'Fuel Level 0-10V', wireColor: 'Green', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X4:4', name: 'AI4', function: 'Auxiliary Input', wireColor: 'White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X4:5', name: 'A-GND', function: 'Analog Ground', wireColor: 'Black/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'X5:1', name: 'L1-N', function: 'Gen Voltage L1', wireColor: 'Red', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'X5:2', name: 'L2-N', function: 'Gen Voltage L2', wireColor: 'Yellow', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'X5:3', name: 'L3-N', function: 'Gen Voltage L3', wireColor: 'Blue', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'X5:4', name: 'N', function: 'Gen Neutral', wireColor: 'White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'X6:1', name: 'CAN-H', function: 'CAN High', wireColor: 'Green', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'X6:2', name: 'CAN-L', function: 'CAN Low', wireColor: 'Yellow', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'X6:3', name: 'CAN-GND', function: 'CAN Ground', wireColor: 'Black', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'X7:1', name: 'RS485-A', function: 'Modbus A (+)', wireColor: 'Blue', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'X7:2', name: 'RS485-B', function: 'Modbus B (-)', wireColor: 'Orange', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'X7:3', name: 'RS-GND', function: 'Modbus GND', wireColor: 'Black', wireGauge: '0.5mm²', circuit: 'communication' },
  ],
  'powerwizard-20': [
    { pin: 'J1-1', name: 'BATT+', function: 'Battery Positive', wireColor: 'Red', wireGauge: '2.5mm²', circuit: 'power', voltage: '9-32V DC' },
    { pin: 'J1-2', name: 'BATT-', function: 'Battery Negative', wireColor: 'Black', wireGauge: '2.5mm²', circuit: 'power' },
    { pin: 'J1-3', name: 'CRANK', function: 'Crank Relay', wireColor: 'Purple', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: 'J1-4', name: 'FUEL', function: 'Fuel Solenoid', wireColor: 'Orange', wireGauge: '1.5mm²', circuit: 'fuel', current: '5A' },
    { pin: 'J1-5', name: 'RUN', function: 'Run Relay', wireColor: 'Green', wireGauge: '1.5mm²', circuit: 'fuel', current: '3A' },
    { pin: 'J1-6', name: 'PREHEAT', function: 'Preheat Relay', wireColor: 'Orange/Black', wireGauge: '1.5mm²', circuit: 'starting', current: '3A' },
    { pin: 'J2-1', name: 'OIL-P', function: 'Oil Pressure Sender', wireColor: 'Brown', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J2-2', name: 'COOL-T', function: 'Coolant Temp Sender', wireColor: 'Blue', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J2-3', name: 'FUEL-L', function: 'Fuel Level', wireColor: 'Green', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J2-4', name: 'A-GND', function: 'Analog Ground', wireColor: 'Black/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J3-1', name: 'MPU+', function: 'Speed Sensor +', wireColor: 'Cyan', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J3-2', name: 'MPU-', function: 'Speed Sensor -', wireColor: 'Cyan/White', wireGauge: '0.75mm²', circuit: 'sensing' },
    { pin: 'J4-1', name: 'GEN-L1', function: 'Gen Voltage L1', wireColor: 'Red', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J4-2', name: 'GEN-L2', function: 'Gen Voltage L2', wireColor: 'Yellow', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J4-3', name: 'GEN-L3', function: 'Gen Voltage L3', wireColor: 'Blue', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J4-4', name: 'GEN-N', function: 'Gen Neutral', wireColor: 'White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J5-1', name: 'CT1-S1', function: 'CT1 Secondary S1', wireColor: 'Red/White', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J5-2', name: 'CT1-S2', function: 'CT1 Secondary S2', wireColor: 'Red/Black', wireGauge: '1.0mm²', circuit: 'generator' },
    { pin: 'J6-1', name: 'CAN-H', function: 'CAT Data Link +', wireColor: 'Green', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'J6-2', name: 'CAN-L', function: 'CAT Data Link -', wireColor: 'Yellow', wireGauge: '0.5mm²', circuit: 'communication' },
    { pin: 'J7-1', name: 'E-STOP', function: 'Emergency Stop', wireColor: 'Red/Yellow', wireGauge: '1.0mm²', circuit: 'protection' },
  ],
};

// ==================== DETAILED SCHEMATIC DIAGRAMS ====================
const DETAILED_SCHEMATICS: { [circuitId: string]: { svgContent: (controller: ControllerModel) => JSX.Element; notes: string[] } } = {
  'power': {
    svgContent: (controller) => (
      <>
        {/* Battery */}
        {ElectricalSymbols.battery(80, 150, '24V')}

        {/* Main Fuse */}
        {ElectricalSymbols.fuse(180, 100, '30A')}

        {/* Battery Isolator Switch */}
        {ElectricalSymbols.switchSPST(280, 100, 'S1')}

        {/* Auxiliary Fuse Box */}
        {ElectricalSymbols.fuse(380, 60, '15A')}
        {ElectricalSymbols.fuse(380, 100, '10A')}
        {ElectricalSymbols.fuse(380, 140, '5A')}

        {/* Controller */}
        <g transform="translate(550, 150)">
          <rect x="-60" y="-80" width="120" height="160" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <rect x="-55" y="-75" width="110" height="25" rx="4" fill="#1e293b" />
          <text x="0" y="-58" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{controller.model}</text>
          <text x="0" y="-45" textAnchor="middle" fill="#64748b" fontSize="8">{controller.brand}</text>
          {/* Pins */}
          <circle cx="-60" cy="-30" r="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <text x="-50" y="-27" fill="#ef4444" fontSize="8">B+</text>
          <circle cx="-60" cy="0" r="4" fill="#1e293b" stroke="#1f2937" strokeWidth="2" />
          <text x="-50" y="3" fill="#94a3b8" fontSize="8">B-</text>
          <circle cx="-60" cy="30" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="-50" y="33" fill="#22c55e" fontSize="8">PE</text>
        </g>

        {/* Charging Alternator */}
        <g transform="translate(550, 320)">
          <circle cx="0" cy="0" r="25" fill="none" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#eab308" fontSize="14" fontWeight="bold">G</text>
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8">Alternator</text>
          <line x1="0" y1="-25" x2="0" y2="-40" stroke="#eab308" strokeWidth="2" />
          <text x="10" y="-30" fill="#eab308" fontSize="7">D+</text>
        </g>

        {/* Ground Symbols */}
        {ElectricalSymbols.ground(80, 250)}
        {ElectricalSymbols.ground(550, 390)}

        {/* Wiring Runs */}
        {/* Battery + to Fuse */}
        <motion.path
          d="M 80 135 L 80 100 L 155 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
        />
        {/* Fuse to Switch */}
        <motion.path
          d="M 205 100 L 260 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        />
        {/* Switch to Fuse Box */}
        <motion.path
          d="M 300 100 L 355 100"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        {/* Junction */}
        {ElectricalSymbols.junction(340, 100)}
        {/* Branch to other fuses */}
        <line x1="340" y1="100" x2="340" y2="60" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="60" x2="355" y2="60" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="100" x2="340" y2="140" stroke="#ef4444" strokeWidth="2" />
        <line x1="340" y1="140" x2="355" y2="140" stroke="#ef4444" strokeWidth="2" />

        {/* Controller Power */}
        <motion.path
          d="M 405 100 L 450 100 L 450 120 L 490 120"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Ground connections */}
        <motion.path
          d="M 80 165 L 80 250"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        />
        <motion.path
          d="M 490 150 L 450 150 L 450 250 L 80 250"
          fill="none"
          stroke="#1f2937"
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />

        {/* Wire labels */}
        <text x="120" y="90" fill="#ef4444" fontSize="7">RED 2.5mm²</text>
        <text x="230" y="90" fill="#ef4444" fontSize="7">RED 2.5mm²</text>
        <text x="120" y="265" fill="#64748b" fontSize="7">BLACK 2.5mm²</text>

        {/* Component Labels */}
        <text x="80" y="185" textAnchor="middle" fill="#94a3b8" fontSize="8">24V Battery</text>
        <text x="180" y="125" textAnchor="middle" fill="#94a3b8" fontSize="8">Main Fuse</text>
        <text x="280" y="125" textAnchor="middle" fill="#94a3b8" fontSize="8">Isolator</text>
        <text x="380" y="165" textAnchor="middle" fill="#94a3b8" fontSize="8">Aux Fuses</text>
      </>
    ),
    notes: [
      'Main power supply from 24V battery system',
      'Main fuse rated 30A for short circuit protection',
      'Battery isolator switch for maintenance disconnect',
      'Auxiliary fuse block for branch circuit protection',
      'Controller requires 8-35V DC input',
      'Use minimum 2.5mm² cable for power circuits',
      'Ensure proper torque on all terminal connections',
    ],
  },
  'starting': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(150, 180)">
          <rect x="-50" y="-70" width="100" height="140" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="0" y="-50" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="bold">{controller.model}</text>
          <circle cx="50" cy="-20" r="4" fill="#1e293b" stroke="#a855f7" strokeWidth="2" />
          <text x="40" y="-17" textAnchor="end" fill="#a855f7" fontSize="7">START</text>
          <circle cx="50" cy="10" r="4" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
          <text x="40" y="13" textAnchor="end" fill="#f97316" fontSize="7">PREHEAT</text>
          <circle cx="50" cy="40" r="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
          <text x="40" y="43" textAnchor="end" fill="#ef4444" fontSize="7">B+</text>
        </g>

        {/* Start Relay */}
        {ElectricalSymbols.relayCoil(320, 120, 'K1')}
        {ElectricalSymbols.relayContactNO(320, 200, 'K1')}

        {/* Preheat Relay */}
        {ElectricalSymbols.relayCoil(320, 280, 'K2')}
        {ElectricalSymbols.relayContactNO(320, 350, 'K2')}

        {/* Starter Motor */}
        {ElectricalSymbols.motor(520, 200, 'M')}
        <text x="520" y="235" textAnchor="middle" fill="#06b6d4" fontSize="8">Starter Motor</text>

        {/* Glow Plugs */}
        <g transform="translate(520, 350)">
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(${(i - 1.5) * 25}, 0)`}>
              <rect x="-8" y="-15" width="16" height="30" rx="3" fill="none" stroke="#f97316" strokeWidth="2" />
              <path d="M -4 -8 Q 0 0, -4 8 M 4 -8 Q 0 0, 4 8" fill="none" stroke="#f97316" strokeWidth="1" />
            </g>
          ))}
          <text x="0" y="35" textAnchor="middle" fill="#f97316" fontSize="8">Glow Plugs</text>
        </g>

        {/* Heavy Cable - Battery to Starter */}
        <g transform="translate(620, 80)">
          <rect x="-15" y="-10" width="30" height="20" fill="none" stroke="#ef4444" strokeWidth="3" />
          <text x="0" y="4" textAnchor="middle" fill="#ef4444" fontSize="8">B+</text>
          <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="7">From Battery</text>
        </g>

        {/* Solenoid on Starter */}
        <g transform="translate(520, 140)">
          <rect x="-25" y="-15" width="50" height="30" rx="3" fill="none" stroke="#a855f7" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#a855f7" fontSize="8">SOL</text>
        </g>

        {/* Wiring */}
        {/* Controller to Start Relay */}
        <motion.path
          d="M 200 160 L 250 160 L 250 112 L 290 112"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Start Relay to Solenoid */}
        <motion.path
          d="M 340 200 L 420 200 L 420 140 L 495 140"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Controller to Preheat Relay */}
        <motion.path
          d="M 200 190 L 230 190 L 230 272 L 290 272"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* Preheat Relay to Glow Plugs */}
        <motion.path
          d="M 340 350 L 420 350 L 420 350 L 480 350"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* B+ Bus */}
        <motion.path
          d="M 620 90 L 620 200 L 548 200"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        />

        {/* B+ to relays */}
        <line x1="620" y1="120" x2="350" y2="120" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />
        <line x1="620" y1="280" x2="350" y2="280" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,3" />

        {/* Ground */}
        {ElectricalSymbols.ground(520, 250)}
        {ElectricalSymbols.ground(560, 380)}

        {/* Wire Labels */}
        <text x="225" y="150" fill="#a855f7" fontSize="7">PURPLE 1.5mm²</text>
        <text x="380" y="190" fill="#a855f7" fontSize="7">PURPLE 1.5mm²</text>
        <text x="225" y="260" fill="#f97316" fontSize="7">ORANGE 1.5mm²</text>
        <text x="640" y="150" fill="#ef4444" fontSize="7">RED 16mm²</text>
      </>
    ),
    notes: [
      'Start relay K1 energized by controller START output',
      'Preheat relay K2 controls glow plug circuit',
      'Starter solenoid requires heavy gauge cable (16mm² min)',
      'Preheat time controlled by controller based on temp',
      'Crank disconnect prevents over-cranking',
      'E-Stop interrupts start circuit for safety',
    ],
  },
  'fuel': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(100, 200)">
          <rect x="-40" y="-60" width="80" height="120" rx="6" fill="#0f172a" stroke="#06b6d4" strokeWidth="2" />
          <text x="0" y="-42" textAnchor="middle" fill="#06b6d4" fontSize="9" fontWeight="bold">{controller.model}</text>
          <circle cx="40" cy="-20" r="4" fill="#1e293b" stroke="#f97316" strokeWidth="2" />
          <text x="30" y="-17" textAnchor="end" fill="#f97316" fontSize="7">FUEL</text>
          <circle cx="40" cy="10" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="30" y="13" textAnchor="end" fill="#22c55e" fontSize="7">FUEL-LVL</text>
          <circle cx="40" cy="40" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="30" y="43" textAnchor="end" fill="#64748b" fontSize="7">GND</text>
        </g>

        {/* Fuel Solenoid */}
        {ElectricalSymbols.solenoid(280, 180, 'FUEL SOL')}

        {/* Fuel Pump */}
        <g transform="translate(450, 180)">
          <circle cx="0" cy="0" r="22" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#f97316" fontSize="12" fontWeight="bold">P</text>
          <line x1="-22" y1="0" x2="-35" y2="0" stroke="#f97316" strokeWidth="2" />
          <line x1="22" y1="0" x2="35" y2="0" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="38" textAnchor="middle" fill="#94a3b8" fontSize="8">Fuel Pump</text>
        </g>

        {/* Fuel Tank with Level Sender */}
        <g transform="translate(350, 320)">
          <rect x="-60" y="-40" width="120" height="80" rx="5" fill="none" stroke="#64748b" strokeWidth="2" />
          <rect x="-55" y="-10" width="110" height="45" fill="#f97316" fillOpacity="0.3" />
          <text x="0" y="-25" textAnchor="middle" fill="#94a3b8" fontSize="8">FUEL TANK</text>
          {/* Level Sender */}
          <g transform="translate(40, -20)">
            <line x1="0" y1="0" x2="0" y2="50" stroke="#22c55e" strokeWidth="2" />
            <circle cx="0" cy="35" r="8" fill="none" stroke="#22c55e" strokeWidth="2" />
            <text x="15" y="40" fill="#22c55e" fontSize="7">SENDER</text>
          </g>
        </g>

        {/* Injector Rail (simplified) */}
        <g transform="translate(580, 180)">
          <rect x="-20" y="-50" width="40" height="100" rx="3" fill="none" stroke="#f97316" strokeWidth="2" />
          {[0, 1, 2, 3].map(i => (
            <g key={i} transform={`translate(0, ${-35 + i * 25})`}>
              <rect x="-12" y="-8" width="24" height="16" fill="none" stroke="#f97316" strokeWidth="1" />
            </g>
          ))}
          <text x="0" y="65" textAnchor="middle" fill="#94a3b8" fontSize="7">Injectors</text>
        </g>

        {/* Wiring */}
        {/* Controller to Fuel Solenoid */}
        <motion.path
          d="M 140 180 L 200 180 L 200 180 L 252 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Fuel Solenoid to Pump (Fuel Line - dashed) */}
        <motion.path
          d="M 308 180 L 415 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="8,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Pump to Injectors (Fuel Line) */}
        <motion.path
          d="M 485 180 L 560 180"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeDasharray="8,4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />

        {/* Fuel Level Signal */}
        <motion.path
          d="M 140 210 L 180 210 L 180 300 L 390 300"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
        />

        {/* Ground */}
        {ElectricalSymbols.ground(280, 240)}
        {ElectricalSymbols.ground(450, 240)}

        {/* Labels */}
        <text x="170" y="170" fill="#f97316" fontSize="7">ORANGE 1.5mm²</text>
        <text x="350" y="170" fill="#64748b" fontSize="7">FUEL LINE</text>
        <text x="180" y="290" fill="#22c55e" fontSize="7">GREEN 0.75mm²</text>

        {/* Low Fuel Switch */}
        <g transform="translate(250, 350)">
          <circle cx="0" cy="0" r="10" fill="none" stroke="#ef4444" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#ef4444" fontSize="8">!</text>
          <text x="0" y="20" textAnchor="middle" fill="#94a3b8" fontSize="7">Low Fuel</text>
        </g>
      </>
    ),
    notes: [
      'Fuel solenoid opens when FUEL output energized',
      'Electric fuel pump for fuel injection systems',
      'Fuel level sender: 0-90Ω (empty-full) or 0-180Ω',
      'Low fuel switch provides warning input',
      'Use fuel-rated wiring for pump connections',
      'Ensure proper fuel line routing and support',
    ],
  },
  'sensing': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(350, 200)">
          <rect x="-80" y="-100" width="160" height="200" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-80" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{controller.model}</text>
          {/* Left side pins - Analog inputs */}
          <circle cx="-80" cy="-50" r="4" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          <text x="-70" y="-47" fill="#eab308" fontSize="7">OIL-P</text>
          <circle cx="-80" cy="-20" r="4" fill="#1e293b" stroke="#92400e" strokeWidth="2" />
          <text x="-70" y="-17" fill="#92400e" fontSize="7">TEMP</text>
          <circle cx="-80" cy="10" r="4" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="-70" y="13" fill="#22c55e" fontSize="7">FUEL-LVL</text>
          <circle cx="-80" cy="40" r="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <text x="-70" y="43" fill="#06b6d4" fontSize="7">MPU+</text>
          <circle cx="-80" cy="60" r="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <text x="-70" y="63" fill="#06b6d4" fontSize="7">MPU-</text>
          <circle cx="-80" cy="80" r="4" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="-70" y="83" fill="#64748b" fontSize="7">A-GND</text>
        </g>

        {/* Oil Pressure Sender */}
        <g transform="translate(100, 120)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#eab308" strokeWidth="2" />
          {ElectricalSymbols.resistor(0, 0, 'VDO')}
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Oil Pressure</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">10-180Ω</text>
        </g>

        {/* Coolant Temp Sender */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="20" fill="none" stroke="#92400e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#92400e" fontSize="10">NTC</text>
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Coolant Temp</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">PT100/NTC</text>
        </g>

        {/* Fuel Level */}
        <g transform="translate(100, 280)">
          <rect x="-25" y="-20" width="50" height="40" fill="none" stroke="#22c55e" strokeWidth="2" />
          <line x1="-15" y1="0" x2="15" y2="-10" stroke="#22c55e" strokeWidth="2" />
          <circle cx="-15" cy="0" r="4" fill="#22c55e" />
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="8">Fuel Level</text>
          <text x="0" y="47" textAnchor="middle" fill="#64748b" fontSize="7">0-90Ω</text>
        </g>

        {/* MPU Speed Sensor */}
        <g transform="translate(100, 380)">
          <rect x="-30" y="-25" width="60" height="50" rx="5" fill="none" stroke="#06b6d4" strokeWidth="2" />
          <path d="M -15 -10 Q 0 0, -15 10 M 0 -10 Q 15 0, 0 10" fill="none" stroke="#06b6d4" strokeWidth="1.5" />
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="8">Magnetic Pickup</text>
          <text x="0" y="52" textAnchor="middle" fill="#64748b" fontSize="7">0.5-70V AC</text>
        </g>

        {/* Flywheel Ring Gear */}
        <g transform="translate(100, 450)">
          <circle cx="0" cy="0" r="30" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4,2" />
          <text x="0" y="5" textAnchor="middle" fill="#64748b" fontSize="8">Flywheel</text>
          <text x="0" y="50" textAnchor="middle" fill="#64748b" fontSize="7">Ring Gear</text>
        </g>

        {/* Wiring runs */}
        {/* Oil Pressure */}
        <motion.path
          d="M 120 120 L 200 120 L 200 150 L 270 150"
          fill="none"
          stroke="#eab308"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Coolant Temp */}
        <motion.path
          d="M 120 200 L 200 200 L 200 180 L 270 180"
          fill="none"
          stroke="#92400e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Fuel Level */}
        <motion.path
          d="M 125 280 L 200 280 L 200 210 L 270 210"
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* MPU+ */}
        <motion.path
          d="M 130 365 L 200 365 L 200 240 L 270 240"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        {/* MPU- */}
        <motion.path
          d="M 130 395 L 210 395 L 210 260 L 270 260"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="1.5"
          strokeDasharray="4,2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        />

        {/* Ground bus */}
        <line x1="80" y1="140" x2="80" y2="420" stroke="#1f2937" strokeWidth="2" />
        {ElectricalSymbols.ground(80, 420)}

        {/* Wire labels */}
        <text x="160" y="110" fill="#eab308" fontSize="6">YELLOW 0.75mm²</text>
        <text x="160" y="190" fill="#92400e" fontSize="6">BROWN 0.75mm²</text>
        <text x="160" y="270" fill="#22c55e" fontSize="6">GREEN 0.75mm²</text>
        <text x="160" y="355" fill="#06b6d4" fontSize="6">CYAN (Shielded)</text>

        {/* Shielding note */}
        <g transform="translate(550, 400)">
          <rect x="-60" y="-30" width="120" height="60" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-10" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SHIELDING</text>
          <text x="0" y="5" textAnchor="middle" fill="#64748b" fontSize="7">MPU cable must be</text>
          <text x="0" y="17" textAnchor="middle" fill="#64748b" fontSize="7">shielded twisted pair</text>
        </g>
      </>
    ),
    notes: [
      'Oil pressure sender: VDO/Datcon compatible (10-180Ω)',
      'Coolant temp: PT100 or NTC thermistor',
      'Fuel level: Resistive type 0-90Ω or 0-180Ω',
      'MPU: Shielded cable essential for noise immunity',
      'Shield connected to controller A-GND only',
      'Keep sensor wiring away from power cables',
      'Use twisted pair for all analog signals',
    ],
  },
  'generator': {
    svgContent: (controller) => (
      <>
        {/* Generator/Alternator */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="50" fill="none" stroke="#eab308" strokeWidth="3" />
          <circle cx="0" cy="0" r="35" fill="none" stroke="#eab308" strokeWidth="1" />
          <text x="0" y="8" textAnchor="middle" fill="#eab308" fontSize="20" fontWeight="bold">G</text>
          <text x="0" y="70" textAnchor="middle" fill="#94a3b8" fontSize="9">Alternator</text>
          {/* Output terminals */}
          <circle cx="35" cy="-35" r="5" fill="#ef4444" stroke="#ef4444" strokeWidth="2" />
          <text x="50" y="-32" fill="#ef4444" fontSize="7">L1</text>
          <circle cx="50" cy="0" r="5" fill="#eab308" stroke="#eab308" strokeWidth="2" />
          <text x="65" y="3" fill="#eab308" fontSize="7">L2</text>
          <circle cx="35" cy="35" r="5" fill="#3b82f6" stroke="#3b82f6" strokeWidth="2" />
          <text x="50" y="38" fill="#3b82f6" fontSize="7">L3</text>
          <circle cx="0" cy="50" r="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
          <text x="0" y="63" fill="#64748b" fontSize="7">N</text>
        </g>

        {/* Current Transformers */}
        <g transform="translate(250, 120)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT1')}
          <text x="0" y="-35" textAnchor="middle" fill="#ef4444" fontSize="7">L1</text>
        </g>
        <g transform="translate(250, 200)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT2')}
          <text x="0" y="-35" textAnchor="middle" fill="#eab308" fontSize="7">L2</text>
        </g>
        <g transform="translate(250, 280)">
          {ElectricalSymbols.currentTransformer(0, 0, 'CT3')}
          <text x="0" y="-35" textAnchor="middle" fill="#3b82f6" fontSize="7">L3</text>
        </g>

        {/* Controller */}
        <g transform="translate(500, 200)">
          <rect x="-70" y="-120" width="140" height="240" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-100" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{controller.model}</text>
          {/* Voltage inputs */}
          <text x="-60" y="-75" fill="#94a3b8" fontSize="7">VOLTAGE</text>
          <circle cx="-70" cy="-55" r="4" fill="#ef4444" />
          <text x="-60" y="-52" fill="#ef4444" fontSize="7">L1</text>
          <circle cx="-70" cy="-35" r="4" fill="#eab308" />
          <text x="-60" y="-32" fill="#eab308" fontSize="7">L2</text>
          <circle cx="-70" cy="-15" r="4" fill="#3b82f6" />
          <text x="-60" y="-12" fill="#3b82f6" fontSize="7">L3</text>
          <circle cx="-70" cy="5" r="4" fill="#f8fafc" stroke="#64748b" />
          <text x="-60" y="8" fill="#64748b" fontSize="7">N</text>
          {/* CT inputs */}
          <text x="-60" y="30" fill="#94a3b8" fontSize="7">CT INPUTS</text>
          <circle cx="-70" cy="50" r="4" fill="#a855f7" />
          <text x="-60" y="53" fill="#a855f7" fontSize="7">CT1-S1</text>
          <circle cx="-70" cy="70" r="4" fill="#a855f7" />
          <text x="-60" y="73" fill="#a855f7" fontSize="7">CT1-S2</text>
          <circle cx="-70" cy="90" r="4" fill="#a855f7" />
          <text x="-60" y="93" fill="#a855f7" fontSize="7">CT2-S1</text>
        </g>

        {/* Main Breaker */}
        <g transform="translate(380, 350)">
          <rect x="-40" y="-30" width="80" height="60" rx="5" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="10" fontWeight="bold">MCB</text>
          <text x="0" y="50" textAnchor="middle" fill="#94a3b8" fontSize="8">Main Breaker</text>
        </g>

        {/* Load Bus */}
        <g transform="translate(550, 350)">
          <rect x="-30" y="-40" width="60" height="80" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#f8fafc" fontSize="8">LOAD</text>
          <text x="0" y="20" textAnchor="middle" fill="#f8fafc" fontSize="8">BUS</text>
        </g>

        {/* Wiring - Generator to CTs */}
        <motion.path d="M 135 165 L 225 120" fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
        <motion.path d="M 150 200 L 225 200" fill="none" stroke="#eab308" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.1 }} />
        <motion.path d="M 135 235 L 225 280" fill="none" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.2 }} />

        {/* CTs to Breaker */}
        <motion.path d="M 275 120 L 340 120 L 340 330" fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.4 }} />
        <motion.path d="M 275 200 L 360 200 L 360 320" fill="none" stroke="#eab308" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
        <motion.path d="M 275 280 L 380 280 L 380 320" fill="none" stroke="#3b82f6" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />

        {/* CT Secondary to Controller */}
        <motion.path d="M 250 145 L 250 160 L 350 160 L 350 250 L 430 250" fill="none" stroke="#a855f7" strokeWidth="1.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.8 }} />

        {/* Voltage sensing */}
        <motion.path d="M 300 120 L 300 145 L 430 145" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 1 }} />

        {/* Labels */}
        <text x="180" y="155" fill="#ef4444" fontSize="7">L1 (Phase A)</text>
        <text x="180" y="190" fill="#eab308" fontSize="7">L2 (Phase B)</text>
        <text x="180" y="270" fill="#3b82f6" fontSize="7">L3 (Phase C)</text>
        <text x="300" y="175" fill="#a855f7" fontSize="6">CT Secondary 5A</text>

        {/* CT Ratio box */}
        <g transform="translate(250, 380)">
          <rect x="-50" y="-25" width="100" height="50" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-8" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">CT RATIO</text>
          <text x="0" y="8" textAnchor="middle" fill="#a855f7" fontSize="9">XXX/5A</text>
          <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="7">Match to load</text>
        </g>
      </>
    ),
    notes: [
      'CT ratio must match maximum load current',
      'Common CT ratios: 100/5A, 200/5A, 400/5A, 800/5A',
      'CT secondary MUST be shorted when primary is live',
      'Voltage sensing uses fused connections',
      'Phase sequence: L1-L2-L3 (clockwise rotation)',
      'Neutral-Earth bond at single point only',
      'Use 1.0mm² minimum for CT secondary wiring',
    ],
  },
  'communication': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(300, 200)">
          <rect x="-80" y="-90" width="160" height="180" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-70" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{controller.model}</text>
          {/* CAN */}
          <text x="-70" y="-45" fill="#22c55e" fontSize="8">CAN BUS</text>
          <circle cx="-80" cy="-25" r="4" fill="#22c55e" />
          <text x="-70" y="-22" fill="#22c55e" fontSize="7">CAN-H</text>
          <circle cx="-80" cy="-5" r="4" fill="#eab308" />
          <text x="-70" y="-2" fill="#eab308" fontSize="7">CAN-L</text>
          <circle cx="-80" cy="15" r="4" fill="#1f2937" stroke="#64748b" />
          <text x="-70" y="18" fill="#64748b" fontSize="7">CAN-GND</text>
          {/* RS485 */}
          <text x="-70" y="40" fill="#3b82f6" fontSize="8">RS485</text>
          <circle cx="-80" cy="60" r="4" fill="#3b82f6" />
          <text x="-70" y="63" fill="#3b82f6" fontSize="7">A (+)</text>
          <circle cx="-80" cy="80" r="4" fill="#f97316" />
          <text x="-70" y="83" fill="#f97316" fontSize="7">B (-)</text>
        </g>

        {/* CAN Bus Devices */}
        {/* Engine ECU */}
        <g transform="translate(100, 100)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="-10" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">ENGINE</text>
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">ECU</text>
          <text x="0" y="20" textAnchor="middle" fill="#64748b" fontSize="7">J1939</text>
        </g>

        {/* Load Share Module */}
        <g transform="translate(100, 220)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="-5" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">LOAD</text>
          <text x="0" y="10" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="bold">SHARE</text>
        </g>

        {/* Display Panel */}
        <g transform="translate(100, 340)">
          <rect x="-45" y="-30" width="90" height="60" rx="5" fill="#1e293b" stroke="#22c55e" strokeWidth="2" />
          <rect x="-35" y="-20" width="70" height="35" fill="#0f172a" />
          <text x="0" y="25" textAnchor="middle" fill="#22c55e" fontSize="8">Display</text>
        </g>

        {/* CAN Bus Line */}
        <line x1="100" y1="70" x2="100" y2="380" stroke="#22c55e" strokeWidth="3" />
        <line x1="98" y1="70" x2="98" y2="380" stroke="#eab308" strokeWidth="2" />

        {/* Connections to CAN bus */}
        <line x1="100" y1="100" x2="145" y2="100" stroke="#22c55e" strokeWidth="2" />
        <line x1="100" y1="220" x2="145" y2="220" stroke="#22c55e" strokeWidth="2" />
        <line x1="100" y1="340" x2="145" y2="340" stroke="#22c55e" strokeWidth="2" />

        {/* Controller CAN connection */}
        <motion.path
          d="M 100 175 L 180 175 L 180 175 L 220 175"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <motion.path
          d="M 100 195 L 180 195 L 180 195 L 220 195"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Termination Resistors */}
        <g transform="translate(100, 60)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
          <text x="0" y="-15" textAnchor="middle" fill="#94a3b8" fontSize="7">TERM</text>
        </g>
        <g transform="translate(100, 390)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
          <text x="0" y="25" textAnchor="middle" fill="#94a3b8" fontSize="7">TERM</text>
        </g>

        {/* RS485 Devices */}
        {/* SCADA/BMS */}
        <g transform="translate(500, 150)">
          <rect x="-50" y="-35" width="100" height="70" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-10" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">SCADA</text>
          <text x="0" y="5" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">BMS</text>
          <text x="0" y="22" textAnchor="middle" fill="#64748b" fontSize="7">Modbus RTU</text>
        </g>

        {/* Remote Display */}
        <g transform="translate(500, 280)">
          <rect x="-50" y="-35" width="100" height="70" rx="5" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
          <text x="0" y="-5" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">REMOTE</text>
          <text x="0" y="10" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">HMI</text>
        </g>

        {/* RS485 Bus */}
        <line x1="500" y1="115" x2="500" y2="350" stroke="#3b82f6" strokeWidth="2" />
        <line x1="502" y1="115" x2="502" y2="350" stroke="#f97316" strokeWidth="2" />

        {/* Controller RS485 connection */}
        <motion.path
          d="M 380 260 L 440 260 L 440 200 L 500 200"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.path
          d="M 380 280 L 450 280 L 450 210 L 502 210"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* RS485 Termination */}
        <g transform="translate(500, 105)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
        </g>
        <g transform="translate(500, 360)">
          {ElectricalSymbols.resistor(0, 0, '120Ω')}
        </g>

        {/* Labels */}
        <text x="60" y="180" fill="#22c55e" fontSize="7">CAN-H (Green)</text>
        <text x="60" y="205" fill="#eab308" fontSize="7">CAN-L (Yellow)</text>
        <text x="400" y="250" fill="#3b82f6" fontSize="7">RS485-A (Blue)</text>
        <text x="400" y="295" fill="#f97316" fontSize="7">RS485-B (Orange)</text>

        {/* Shield note */}
        <g transform="translate(300, 380)">
          <rect x="-80" y="-20" width="160" height="40" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-2" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SHIELDED CABLE</text>
          <text x="0" y="12" textAnchor="middle" fill="#64748b" fontSize="7">Connect shield at ONE end only</text>
        </g>
      </>
    ),
    notes: [
      'CAN bus requires 120Ω termination at each end',
      'J1939 standard baud rate: 250 kbps',
      'RS485: Twisted pair, max 1200m at 9600 baud',
      'Shield connected at controller end only',
      'Bias resistors may be required for RS485',
      'Max 32 devices on single CAN segment',
      'Use CAT5e or better for Ethernet',
    ],
  },
  'protection': {
    svgContent: (controller) => (
      <>
        {/* Controller */}
        <g transform="translate(400, 200)">
          <rect x="-70" y="-100" width="140" height="200" rx="8" fill="#0f172a" stroke="#06b6d4" strokeWidth="3" />
          <text x="0" y="-80" textAnchor="middle" fill="#06b6d4" fontSize="10" fontWeight="bold">{controller.model}</text>
          {/* Protection inputs */}
          <circle cx="-70" cy="-50" r="4" fill="#ef4444" />
          <text x="-60" y="-47" fill="#ef4444" fontSize="7">E-STOP</text>
          <circle cx="-70" cy="-25" r="4" fill="#f97316" />
          <text x="-60" y="-22" fill="#f97316" fontSize="7">LOW OIL</text>
          <circle cx="-70" cy="0" r="4" fill="#eab308" />
          <text x="-60" y="3" fill="#eab308" fontSize="7">HIGH TEMP</text>
          <circle cx="-70" cy="25" r="4" fill="#22c55e" />
          <text x="-60" y="28" fill="#22c55e" fontSize="7">OVERSPEED</text>
          <circle cx="-70" cy="50" r="4" fill="#3b82f6" />
          <text x="-60" y="53" fill="#3b82f6" fontSize="7">GCB-AUX</text>
          {/* Outputs */}
          <circle cx="70" cy="-25" r="4" fill="#a855f7" />
          <text x="60" y="-22" textAnchor="end" fill="#a855f7" fontSize="7">STOP</text>
          <circle cx="70" cy="0" r="4" fill="#22c55e" />
          <text x="60" y="3" textAnchor="end" fill="#22c55e" fontSize="7">ALARM</text>
          <circle cx="70" cy="25" r="4" fill="#06b6d4" />
          <text x="60" y="28" textAnchor="end" fill="#06b6d4" fontSize="7">GCB-TRIP</text>
        </g>

        {/* E-Stop Button */}
        <g transform="translate(100, 130)">
          {ElectricalSymbols.eStop(0, 0)}
        </g>

        {/* Low Oil Pressure Switch */}
        <g transform="translate(100, 200)">
          <circle cx="0" cy="0" r="15" fill="none" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#f97316" fontSize="10">P</text>
          <line x1="15" y1="0" x2="35" y2="0" stroke="#f97316" strokeWidth="2" />
          <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">Low Oil SW</text>
        </g>

        {/* High Temp Switch */}
        <g transform="translate(100, 270)">
          <circle cx="0" cy="0" r="15" fill="none" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="4" textAnchor="middle" fill="#eab308" fontSize="10">T</text>
          <line x1="15" y1="0" x2="35" y2="0" stroke="#eab308" strokeWidth="2" />
          <text x="0" y="28" textAnchor="middle" fill="#94a3b8" fontSize="7">High Temp SW</text>
        </g>

        {/* Overspeed Switch */}
        <g transform="translate(100, 340)">
          <rect x="-20" y="-15" width="40" height="30" rx="3" fill="none" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="5" textAnchor="middle" fill="#22c55e" fontSize="9">OS</text>
          <line x1="20" y1="0" x2="40" y2="0" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="30" textAnchor="middle" fill="#94a3b8" fontSize="7">Overspeed</text>
        </g>

        {/* Stop Solenoid */}
        <g transform="translate(580, 180)">
          {ElectricalSymbols.solenoid(0, 0, 'STOP SOL')}
        </g>

        {/* Alarm Horn */}
        <g transform="translate(580, 240)">
          <path d="M -15 -10 L 0 -10 L 15 -20 L 15 20 L 0 10 L -15 10 Z" fill="none" stroke="#22c55e" strokeWidth="2" />
          <line x1="-25" y1="0" x2="-15" y2="0" stroke="#22c55e" strokeWidth="2" />
          <text x="0" y="35" textAnchor="middle" fill="#94a3b8" fontSize="7">Alarm</text>
        </g>

        {/* GCB Trip Coil */}
        <g transform="translate(580, 310)">
          {ElectricalSymbols.relayCoil(0, 0, 'GCB-TC')}
          <text x="0" y="40" textAnchor="middle" fill="#94a3b8" fontSize="7">Trip Coil</text>
        </g>

        {/* Wiring */}
        {/* E-Stop to Controller */}
        <motion.path
          d="M 116 130 L 200 130 L 200 150 L 330 150"
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Low Oil to Controller */}
        <motion.path
          d="M 135 200 L 200 200 L 200 175 L 330 175"
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* High Temp to Controller */}
        <motion.path
          d="M 135 270 L 220 270 L 220 200 L 330 200"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* Overspeed to Controller */}
        <motion.path
          d="M 140 340 L 240 340 L 240 225 L 330 225"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Controller outputs */}
        {/* Stop output */}
        <motion.path
          d="M 470 175 L 520 175 L 520 180 L 552 180"
          fill="none"
          stroke="#a855f7"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        />

        {/* Alarm output */}
        <motion.path
          d="M 470 200 L 530 200 L 530 240 L 555 240"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />

        {/* GCB Trip output */}
        <motion.path
          d="M 470 225 L 510 225 L 510 302 L 550 302"
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        />

        {/* Ground */}
        {ElectricalSymbols.ground(100, 400)}
        <line x1="100" y1="360" x2="100" y2="390" stroke="#1f2937" strokeWidth="2" />

        {/* Wire labels */}
        <text x="160" y="120" fill="#ef4444" fontSize="6">RED/YELLOW 1.0mm²</text>
        <text x="160" y="190" fill="#f97316" fontSize="6">ORANGE 0.75mm²</text>
        <text x="160" y="260" fill="#eab308" fontSize="6">YELLOW 0.75mm²</text>
        <text x="160" y="330" fill="#22c55e" fontSize="6">GREEN 0.75mm²</text>

        {/* NC/NO Legend */}
        <g transform="translate(250, 380)">
          <rect x="-60" y="-25" width="120" height="50" rx="5" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
          <text x="0" y="-8" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">INPUT TYPE</text>
          <text x="-40" y="10" fill="#ef4444" fontSize="7">E-STOP: NC</text>
          <text x="40" y="10" fill="#f97316" fontSize="7">OIL: NC</text>
          <text x="0" y="25" fill="#64748b" fontSize="7">NC = Normally Closed (fail-safe)</text>
        </g>
      </>
    ),
    notes: [
      'E-Stop uses NC contacts for fail-safe operation',
      'Low oil/High temp switches are NC type',
      'All protection inputs should be NC (fail-safe)',
      'Stop solenoid de-energizes to stop engine',
      'GCB trip coil requires pulse, not continuous',
      'Alarm output can drive horn, beacon, or relay',
      'Test all protection circuits regularly',
    ],
  },
};

// ==================== PINOUT TABLE COMPONENT ====================
function PinoutTable({ controller }: { controller: ControllerModel }) {
  const [filter, setFilter] = useState('');
  const [selectedCircuit, setSelectedCircuit] = useState<string | null>(null);
  const pins = CONTROLLER_PINS[controller.id] || [];

  const filteredPins = pins.filter(pin => {
    const matchesFilter = filter === '' ||
      pin.name.toLowerCase().includes(filter.toLowerCase()) ||
      pin.function.toLowerCase().includes(filter.toLowerCase());
    const matchesCircuit = !selectedCircuit || pin.circuit === selectedCircuit;
    return matchesFilter && matchesCircuit;
  });

  const circuits = [...new Set(pins.map(p => p.circuit))];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search pins..."
          className="flex-1 min-w-[200px] px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        />
        <select
          value={selectedCircuit || ''}
          onChange={(e) => setSelectedCircuit(e.target.value || null)}
          className="px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:border-cyan-500 focus:outline-none"
        >
          <option value="">All Circuits</option>
          {circuits.map(c => (
            <option key={c} value={c}>{CIRCUIT_CATEGORIES.find(cat => cat.id === c)?.name || c}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="flex gap-4 text-sm">
        <span className="text-slate-400">Total: <span className="text-cyan-400 font-bold">{pins.length}</span> pins</span>
        <span className="text-slate-400">Showing: <span className="text-amber-400 font-bold">{filteredPins.length}</span></span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800/80">
            <tr>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">PIN</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">NAME</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">FUNCTION</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">WIRE</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">GAUGE</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">CIRCUIT</th>
              <th className="px-3 py-2 text-left text-cyan-400 font-bold">SPECS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredPins.map((pin, idx) => {
              const circuitCat = CIRCUIT_CATEGORIES.find(c => c.id === pin.circuit);
              const wireColor = WIRE_COLORS[pin.wireColor.toLowerCase().replace('/', '-')] || WIRE_COLORS['gray'];
              return (
                <tr key={pin.pin} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-3 py-2 font-mono text-cyan-400 font-bold">{pin.pin}</td>
                  <td className="px-3 py-2 font-medium text-white">{pin.name}</td>
                  <td className="px-3 py-2 text-slate-300">{pin.function}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border border-slate-600"
                        style={{ backgroundColor: wireColor?.hex || '#6b7280' }}
                      />
                      <span className="text-slate-400">{pin.wireColor}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-slate-400 font-mono text-xs">{pin.wireGauge}</td>
                  <td className="px-3 py-2">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${circuitCat?.color}20`,
                        color: circuitCat?.color,
                        border: `1px solid ${circuitCat?.color}40`
                      }}
                    >
                      {circuitCat?.name || pin.circuit}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-500 text-xs">
                    {pin.voltage && <span className="mr-2">{pin.voltage}</span>}
                    {pin.current && <span>{pin.current}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ==================== DETAILED SCHEMATIC VIEW ====================
function DetailedSchematicView({
  circuitId,
  controller
}: {
  circuitId: string;
  controller: ControllerModel;
}) {
  const schematic = DETAILED_SCHEMATICS[circuitId];
  const [showNotes, setShowNotes] = useState(true);

  if (!schematic) {
    return (
      <div className="h-[500px] flex items-center justify-center text-slate-500">
        Schematic diagram not available for this circuit
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Schematic SVG */}
      <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(100,116,139,0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(100,116,139,0.2) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Title Bar */}
        <div className="absolute top-0 left-0 right-0 bg-slate-900/90 backdrop-blur px-4 py-2 border-b border-slate-800 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xl">{CIRCUIT_CATEGORIES.find(c => c.id === circuitId)?.icon}</span>
            <div>
              <h3 className="text-white font-bold">{CIRCUIT_CATEGORIES.find(c => c.id === circuitId)?.name} - Schematic</h3>
              <p className="text-xs text-slate-500">{controller.brand} {controller.model}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                showNotes ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Notes
            </button>
            <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white">
              🔍 Zoom
            </button>
            <button className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white">
              📥 Export
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <svg
          viewBox="0 0 700 450"
          className="w-full h-[500px] pt-12"
          style={{ minHeight: '500px' }}
        >
          {schematic.svgContent(controller)}
        </svg>
      </div>

      {/* Notes Panel */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4"
          >
            <h4 className="text-amber-400 font-bold text-sm mb-3 flex items-center gap-2">
              <span>📋</span> Technical Notes & Specifications
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {schematic.notes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-cyan-500 mt-1">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== WIRE COLOR REFERENCE ====================
function WireColorReference() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {Object.entries(WIRE_COLORS).map(([key, { hex, name, usage }]) => (
        <div key={key} className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex-shrink-0 shadow-lg"
              style={{
                backgroundColor: hex,
                border: key.includes('black') || key.includes('white') ? '1px solid #475569' : 'none'
              }}
            />
            <div>
              <div className="font-bold text-white text-sm">{name}</div>
              <div className="text-xs text-slate-400">{usage}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== MAIN PANEL COMPONENT ====================
export default function WiringDiagramsPanel() {
  const [selectedBrand, setSelectedBrand] = useState('DSE');
  const [selectedController, setSelectedController] = useState(CONTROLLERS[0]);
  const [selectedCircuit, setSelectedCircuit] = useState('power');
  const [viewMode, setViewMode] = useState<'schematic' | 'pinout' | 'colors'>('schematic');

  const brands = [...new Set(CONTROLLERS.map(c => c.brand))];
  const brandControllers = CONTROLLERS.filter(c => c.brand === selectedBrand);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 flex items-center justify-center shadow-xl shadow-cyan-500/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <span className="text-3xl">📐</span>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-wider">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Professional Schematics
              </span>
            </h2>
            <p className="text-slate-500 text-sm">
              IEEE/IEC standard diagrams • Complete wiring documentation • {CONTROLLERS.length} controllers
            </p>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex gap-2 bg-slate-900/50 p-1 rounded-xl">
          {[
            { id: 'schematic', label: 'Schematics', icon: '📊' },
            { id: 'pinout', label: 'Pinout', icon: '🔌' },
            { id: 'colors', label: 'Wire Colors', icon: '🎨' },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setViewMode(id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                viewMode === id
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Selection */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Brand Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Controller Brand</h3>
            <div className="grid grid-cols-2 gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => {
                    setSelectedBrand(brand);
                    const firstController = CONTROLLERS.find(c => c.brand === brand);
                    if (firstController) setSelectedController(firstController);
                  }}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedBrand === brand
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 shadow-lg shadow-cyan-500/10'
                      : 'bg-slate-800/50 text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selection */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Controller Model</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
              {brandControllers.map((ctrl) => (
                <button
                  key={ctrl.id}
                  onClick={() => setSelectedController(ctrl)}
                  className={`w-full px-3 py-2 rounded-lg text-left transition-all ${
                    selectedController.id === ctrl.id
                      ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                      : 'bg-slate-800/30 text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="font-bold text-sm">{ctrl.model}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{ctrl.features.join(' • ')}</div>
                  <div className="text-xs text-slate-600 mt-0.5">{ctrl.pinCount} pins • {ctrl.voltage}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Circuit Selection (only for schematic view) */}
          {viewMode === 'schematic' && (
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 font-bold">Circuit Type</h3>
              <div className="space-y-1">
                {CIRCUIT_CATEGORIES.map((circuit) => (
                  <button
                    key={circuit.id}
                    onClick={() => setSelectedCircuit(circuit.id)}
                    className={`w-full px-3 py-2 rounded-lg text-left text-sm flex items-center gap-3 transition-all ${
                      selectedCircuit === circuit.id
                        ? 'text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                    style={{
                      backgroundColor: selectedCircuit === circuit.id ? `${circuit.color}20` : undefined,
                      borderLeft: selectedCircuit === circuit.id ? `3px solid ${circuit.color}` : '3px solid transparent',
                    }}
                  >
                    <span className="text-lg">{circuit.icon}</span>
                    <span className="font-medium">{circuit.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="col-span-12 lg:col-span-9">
          <AnimatePresence mode="wait">
            {viewMode === 'schematic' && (
              <motion.div
                key="schematic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <DetailedSchematicView circuitId={selectedCircuit} controller={selectedController} />
              </motion.div>
            )}

            {viewMode === 'pinout' && (
              <motion.div
                key="pinout"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedController.brand} {selectedController.model}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">Complete terminal pinout with wire specifications</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-bold">
                      {selectedController.pinCount} Pins
                    </span>
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg text-sm">
                      {selectedController.voltage}
                    </span>
                  </div>
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
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white">Wire Color Standards</h3>
                  <p className="text-slate-500 text-sm mt-1">Industry-standard wire color coding for generator control systems</p>
                </div>
                <WireColorReference />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🏭</div>
              <div className="text-2xl font-black text-cyan-400">{CONTROLLERS.length}</div>
              <div className="text-xs text-slate-500">Controllers</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-black text-amber-400">{CIRCUIT_CATEGORIES.length}</div>
              <div className="text-xs text-slate-500">Circuit Types</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🔌</div>
              <div className="text-2xl font-black text-green-400">{Object.values(CONTROLLER_PINS).flat().length}</div>
              <div className="text-xs text-slate-500">Pin Configs</div>
            </div>
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-3xl mb-2">🎨</div>
              <div className="text-2xl font-black text-purple-400">{Object.keys(WIRE_COLORS).length}</div>
              <div className="text-xs text-slate-500">Wire Colors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-3xl">📐</span>
            <div>
              <div className="font-bold text-white">Professional-Grade Electrical Documentation</div>
              <div className="text-sm text-slate-400">
                IEEE/IEC standard symbols • Complete wiring runs • Technical specifications
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2">
              <span>📥</span> Export PDF
            </button>
            <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2">
              <span>🖨️</span> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
