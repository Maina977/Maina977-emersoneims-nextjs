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
  // Datakom Controllers
  { id: 'datakom-d500', brand: 'Datakom', model: 'D-500', type: 'genset', features: ['AMF', 'Load Share', 'CAN'], pinCount: 36, voltage: '8-35V DC' },
  { id: 'datakom-d700', brand: 'Datakom', model: 'D-700', type: 'load-share', features: ['Sync', 'PMS', 'Advanced'], pinCount: 44, voltage: '8-35V DC' },
  { id: 'datakom-dkg309', brand: 'Datakom', model: 'DKG-309', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'datakom-dkg517', brand: 'Datakom', model: 'DKG-517', type: 'genset', features: ['CAN', 'J1939'], pinCount: 32, voltage: '8-35V DC' },
  // Lovato Electric Controllers
  { id: 'lovato-rgk800', brand: 'Lovato', model: 'RGK800', type: 'genset', features: ['AMF', 'CAN'], pinCount: 32, voltage: '8-35V DC' },
  { id: 'lovato-rgk900', brand: 'Lovato', model: 'RGK900', type: 'load-share', features: ['Sync', 'Load Share'], pinCount: 40, voltage: '8-35V DC' },
  { id: 'lovato-atl800', brand: 'Lovato', model: 'ATL800', type: 'ats', features: ['ATS', 'Mains Monitor'], pinCount: 28, voltage: '8-35V DC' },
  // Siemens Controllers
  { id: 'siemens-sicam', brand: 'Siemens', model: 'SICAM A8000', type: 'genset', features: ['Advanced', 'SCADA'], pinCount: 48, voltage: '24-60V DC' },
  { id: 'siemens-sentron', brand: 'Siemens', model: 'SENTRON PAC', type: 'genset', features: ['Power Metering', 'Modbus'], pinCount: 24, voltage: '24V DC' },
  { id: 'siemens-siprotec', brand: 'Siemens', model: 'SIPROTEC 7SJ', type: 'genset', features: ['Protection', 'IEC 61850'], pinCount: 36, voltage: '24-250V DC' },
  // ENKO Controllers
  { id: 'enko-gcu300', brand: 'ENKO', model: 'GCU-300', type: 'genset', features: ['AMF', 'Basic'], pinCount: 24, voltage: '8-35V DC' },
  { id: 'enko-gcu500', brand: 'ENKO', model: 'GCU-500', type: 'genset', features: ['AMF', 'Load Share'], pinCount: 32, voltage: '8-35V DC' },
  { id: 'enko-sync200', brand: 'ENKO', model: 'SYNC-200', type: 'load-share', features: ['Sync', 'PMS'], pinCount: 40, voltage: '8-35V DC' },
  // Volvo Penta VODIA Controllers
  { id: 'vodia-vodia5', brand: 'VODIA', model: 'VODIA5', type: 'genset', features: ['Diagnostics', 'Engine'], pinCount: 16, voltage: '12-24V DC' },
  { id: 'vodia-vodia6', brand: 'VODIA', model: 'VODIA6', type: 'genset', features: ['Advanced Diagnostics', 'Full Fleet'], pinCount: 16, voltage: '12-24V DC' },
  { id: 'vodia-ecu', brand: 'VODIA', model: 'D13 ECU', type: 'genset', features: ['Engine Control', 'J1939'], pinCount: 96, voltage: '24V DC' },
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

// ==================== DIAGNOSTIC TROUBLESHOOTING FLOWS ====================
interface DiagnosticStep {
  id: string;
  title: string;
  description: string;
  testPoint: { location: string; probes: string };
  expectedValue: string;
  failureIndicates: string;
  solution: string[];
  nextIfPass: string | null;
  nextIfFail: string | null;
  tools: string[];
  safetyWarning?: string;
}

interface DiagnosticFlow {
  id: string;
  symptom: string;
  description: string;
  category: string;
  estimatedTime: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  steps: DiagnosticStep[];
  commonCauses: { cause: string; probability: number }[];
  partsNeeded: { name: string; partNumber: string; estimated: string }[];
}

const DIAGNOSTIC_TROUBLESHOOTING: { [circuitId: string]: DiagnosticFlow[] } = {
  'power': [
    {
      id: 'no-power',
      symptom: 'Controller has no power / display blank',
      description: 'Generator controller shows no signs of life - no LEDs, no display, completely dead',
      category: 'Power Supply',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage at Battery Terminals',
          description: 'Measure voltage directly at battery terminals to verify battery condition',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: '12.4-14.4V (12V system) or 24.8-28.8V (24V system)',
          failureIndicates: 'Dead/discharged battery or charging system failure',
          solution: [
            'If voltage < 12V (12V system) or < 24V (24V system): Battery is discharged',
            'Check battery age - typical life is 3-5 years',
            'Load test battery: Should maintain >9.6V under 200A load for 12V systems',
            'Check alternator/charger output while engine running',
            'Replace battery if fails load test or is >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect battery before any major work. Hydrogen gas may be present - no sparks near battery.'
        },
        {
          id: 'step2',
          title: 'Check Voltage at Main Fuse Input',
          description: 'Verify power is reaching the main fuse from battery',
          testPoint: { location: 'Main fuse input terminal', probes: 'Red to fuse input, Black to chassis ground' },
          expectedValue: 'Same as battery voltage (within 0.2V)',
          failureIndicates: 'Open circuit between battery and fuse box - damaged cable or loose connection',
          solution: [
            'Inspect battery cable for damage, corrosion, or loose terminals',
            'Check battery isolator switch if equipped - ensure it is ON',
            'Clean and tighten all connections',
            'Check for corroded or burnt cable at terminals',
            'Replace battery cable if damaged (use minimum 2.5mm² / 14 AWG)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush', '10mm wrench']
        },
        {
          id: 'step3',
          title: 'Check Voltage at Main Fuse Output',
          description: 'Verify main fuse is not blown',
          testPoint: { location: 'Main fuse output terminal', probes: 'Red to fuse output, Black to chassis ground' },
          expectedValue: 'Same as input voltage (fuse intact)',
          failureIndicates: 'Blown main fuse - indicates short circuit or overload occurred',
          solution: [
            'DO NOT just replace fuse - find the cause first!',
            'Disconnect all loads from fuse output',
            'Check for short circuit to ground on output wiring',
            'Inspect wiring harness for chafed insulation',
            'Check controller for signs of damage/burning',
            'Once cause found and fixed, replace fuse with correct rating (typically 30A)'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Fuse puller'],
          safetyWarning: 'Never replace fuse with higher rating. This can cause fire.'
        },
        {
          id: 'step4',
          title: 'Check Voltage at Controller B+ Terminal',
          description: 'Verify power is reaching controller power input',
          testPoint: { location: 'Controller terminal B+ (Pin 1 typically)', probes: 'Red to B+ pin, Black to B- pin' },
          expectedValue: '8-35V DC (check controller spec)',
          failureIndicates: 'Open circuit between fuse and controller',
          solution: [
            'Trace wiring from fuse output to controller',
            'Check for damaged wire, loose connector, or corroded terminal',
            'Inspect any intermediate fuses or circuit breakers',
            'Check connector pins for pushed-out or damaged contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: minimum 2.5mm² for power supply'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Connector pin tool']
        },
        {
          id: 'step5',
          title: 'Verify Ground Connection',
          description: 'Check controller ground circuit integrity',
          testPoint: { location: 'Controller B- to chassis', probes: 'Measure resistance between B- and engine block' },
          expectedValue: '< 0.5 Ohms (near zero resistance)',
          failureIndicates: 'Poor ground connection causing controller malfunction',
          solution: [
            'Clean ground connection at chassis/engine block',
            'Check ground cable for damage or corrosion',
            'Ensure ground bolt is tight and making good metal contact',
            'Add secondary ground if primary is questionable',
            'Ground should be to unpainted metal surface'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter set to Ohms', 'Wire brush', 'Wrench']
        }
      ],
      commonCauses: [
        { cause: 'Dead or discharged battery', probability: 35 },
        { cause: 'Blown main fuse', probability: 25 },
        { cause: 'Loose or corroded battery terminal', probability: 20 },
        { cause: 'Faulty battery isolator switch', probability: 10 },
        { cause: 'Damaged power cable', probability: 7 },
        { cause: 'Failed controller (internal fault)', probability: 3 }
      ],
      partsNeeded: [
        { name: 'Main Fuse 30A', partNumber: 'MIDI-30A', estimated: 'KES 500-800' },
        { name: 'Battery Cable 2.5mm²', partNumber: 'BAT-CABLE-25', estimated: 'KES 300/m' },
        { name: 'Battery Terminal Clamp', partNumber: 'BAT-TERM-UNI', estimated: 'KES 400-600' }
      ]
    },
    {
      id: 'low-voltage',
      symptom: 'Controller resets / erratic behavior / dim display',
      description: 'Controller powers on but behaves erratically, resets randomly, or display is dim',
      category: 'Power Supply',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage Under Load',
          description: 'Measure voltage while cranking or with loads active',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should not drop below 10V (12V) or 20V (24V) while cranking',
          failureIndicates: 'Weak battery or poor connections causing voltage drop',
          solution: [
            'Battery capacity test required - replace if fails',
            'Check battery age (>4 years = suspect)',
            'Verify battery is correct capacity for application',
            'Check charging system output',
            'Look for parasitic drain when engine off'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check for Voltage Drop in Supply Circuit',
          description: 'Measure voltage drop across each connection point while loaded',
          testPoint: { location: 'Each connection from battery to controller', probes: 'Across each connection' },
          expectedValue: '< 0.2V drop at each connection point',
          failureIndicates: 'High resistance connection causing power loss',
          solution: [
            'Clean and tighten the connection showing high drop',
            'Apply dielectric grease after cleaning',
            'Replace terminals if corroded beyond cleaning',
            'Upgrade wire gauge if voltage drop persists',
            'Consider adding parallel power feed for long runs'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Charging Alternator Output',
          description: 'Verify alternator is charging battery properly when engine runs',
          testPoint: { location: 'Battery terminals with engine running', probes: 'Red to B+, Black to B-' },
          expectedValue: '13.8-14.4V (12V) or 27.6-28.8V (24V) at 1500 RPM',
          failureIndicates: 'Alternator not charging - battery will discharge',
          solution: [
            'Check alternator belt tension and condition',
            'Test alternator diodes with multimeter diode test',
            'Check D+ (field excite) wire connection',
            'Verify voltage regulator operation',
            'Replace alternator if output is low/absent'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Belt tension gauge']
        }
      ],
      commonCauses: [
        { cause: 'Weak/failing battery', probability: 40 },
        { cause: 'High resistance in power connections', probability: 25 },
        { cause: 'Faulty alternator/charger', probability: 20 },
        { cause: 'Undersized power wiring', probability: 10 },
        { cause: 'Excessive electrical load', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Battery (as specified)', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Terminals', partNumber: 'BAT-TERM-HD', estimated: 'KES 800-1,200' },
        { name: 'Alternator Belt', partNumber: 'Engine-specific', estimated: 'KES 2,000-5,000' }
      ]
    }
  ],
  'starting': [
    {
      id: 'no-crank',
      symptom: 'Engine does not crank when start command given',
      description: 'Start button pressed or auto-start commanded, but engine does not turn over at all',
      category: 'Starting System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Start Command from Controller',
          description: 'Check if controller is outputting start signal',
          testPoint: { location: 'Controller START output pin', probes: 'Red to START pin, Black to B-' },
          expectedValue: 'Battery voltage (B+) when start commanded',
          failureIndicates: 'Controller not sending start signal - check configuration or input conditions',
          solution: [
            'Check controller is in AUTO or MANUAL RUN mode',
            'Verify no active alarms blocking start (check fault codes)',
            'Check E-Stop is not engaged',
            'Verify run signal input if using external start',
            'Check controller programming - start parameters',
            'Reset controller if necessary'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Ensure engine cannot start unexpectedly during testing. Remove fuel shut-off connection if needed.'
        },
        {
          id: 'step2',
          title: 'Check Start Relay Coil Activation',
          description: 'Verify start relay coil is receiving power',
          testPoint: { location: 'Start relay coil terminals K1', probes: 'Across relay coil terminals' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between controller and relay',
          solution: [
            'Check wiring from controller START output to relay coil',
            'Inspect connectors for corrosion or damage',
            'Check for blown inline fuse if present',
            'Verify relay coil resistance (typical 50-150 ohms)',
            'Bypass controller output temporarily to test (jumper wire)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Start Relay Contact Operation',
          description: 'Verify relay contacts are closing when coil energized',
          testPoint: { location: 'Start relay output contacts', probes: 'Across N/O contacts' },
          expectedValue: '< 0.5 Ohms when coil energized (contacts closed)',
          failureIndicates: 'Relay contacts burnt/welded or relay failed',
          solution: [
            'Manually press relay to check mechanical operation',
            'Listen for relay click when coil energized',
            'Check contact resistance - should be near zero',
            'If contacts burnt, replace relay',
            'Use correct relay rating: minimum 30A for starter circuit'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Relay puller']
        },
        {
          id: 'step4',
          title: 'Check Voltage at Starter Solenoid',
          description: 'Verify battery voltage reaches starter solenoid S terminal',
          testPoint: { location: 'Starter solenoid S (signal) terminal', probes: 'Red to S terminal, Black to engine block' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Open circuit between start relay and starter solenoid',
          solution: [
            'Check wiring from relay to solenoid for damage',
            'Verify all connections are tight and clean',
            'Check for neutral safety switch in circuit (if equipped)',
            'Inspect solenoid terminal for corrosion',
            'Bypass suspected switches to isolate fault'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step5',
          title: 'Test Starter Motor Directly',
          description: 'Apply battery voltage directly to starter solenoid to test motor',
          testPoint: { location: 'Starter solenoid', probes: 'Jumper from B+ to S terminal' },
          expectedValue: 'Engine should crank',
          failureIndicates: 'Starter motor or solenoid failure',
          solution: [
            'Check battery cables to starter - must handle 200+ amps',
            'Verify ground strap from engine to chassis',
            'Check starter mounting bolts are tight',
            'Test starter on bench if accessible',
            'Check ring gear for damage',
            'Replace starter if confirmed faulty'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Heavy jumper wire (10mm² min)', 'Wrench set'],
          safetyWarning: 'Engine will crank! Ensure in neutral, parking brake set, clear of rotating parts.'
        }
      ],
      commonCauses: [
        { cause: 'Faulty start relay', probability: 25 },
        { cause: 'Controller in wrong mode / alarm active', probability: 20 },
        { cause: 'Poor electrical connections', probability: 20 },
        { cause: 'Failed starter motor', probability: 15 },
        { cause: 'Neutral safety switch fault', probability: 10 },
        { cause: 'E-Stop engaged', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Start Relay 30A', partNumber: 'RELAY-30A-12V', estimated: 'KES 1,500-2,500' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' },
        { name: 'Starter Solenoid', partNumber: 'Engine-specific', estimated: 'KES 5,000-12,000' }
      ]
    },
    {
      id: 'slow-crank',
      symptom: 'Engine cranks slowly or struggles to turn over',
      description: 'Starter engages but engine turns over slowly, may not reach starting RPM',
      category: 'Starting System',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Battery Voltage During Cranking',
          description: 'Monitor voltage drop while engine is cranking',
          testPoint: { location: 'Battery terminals', probes: 'Red to B+, Black to B-' },
          expectedValue: 'Should stay above 10V (12V system) or 20V (24V system)',
          failureIndicates: 'Weak battery - cannot deliver required cranking current',
          solution: [
            'Perform battery load test',
            'Check battery specific gravity if accessible',
            'Verify battery is correct CCA rating for engine',
            'Check for parasitic drain',
            'Replace battery if fails test or >4 years old'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Battery load tester']
        },
        {
          id: 'step2',
          title: 'Check Voltage Drop on Positive Cable',
          description: 'Measure voltage loss in positive battery cable during cranking',
          testPoint: { location: 'Battery B+ to Starter B+', probes: 'Red at battery, Black at starter' },
          expectedValue: '< 0.5V drop during cranking',
          failureIndicates: 'High resistance in positive cable or connections',
          solution: [
            'Clean battery terminal and starter connection',
            'Check cable for internal corrosion (green color)',
            'Verify correct cable gauge (minimum 16mm² / 6 AWG)',
            'Replace cable if corroded or undersized',
            'Ensure terminals are crimped/soldered properly'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Ground Circuit Voltage Drop',
          description: 'Measure voltage loss in ground circuit during cranking',
          testPoint: { location: 'Engine block to Battery B-', probes: 'Red at engine, Black at battery' },
          expectedValue: '< 0.3V drop during cranking',
          failureIndicates: 'Poor ground connection restricting current flow',
          solution: [
            'Clean ground connection at engine block',
            'Check ground strap for damage or corrosion',
            'Verify ground is to clean, unpainted surface',
            'Add additional ground strap if needed',
            'Check battery negative terminal condition'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Wire brush']
        },
        {
          id: 'step4',
          title: 'Check Engine Mechanical Resistance',
          description: 'Verify engine is not mechanically seized or tight',
          testPoint: { location: 'Crankshaft bolt', probes: 'Manual rotation test' },
          expectedValue: 'Engine should turn freely by hand with socket on crank',
          failureIndicates: 'Mechanical engine problem - hydro-lock, bearing failure, etc.',
          solution: [
            'Remove glow plugs/injectors and retry cranking',
            'If easier, check for hydro-lock (coolant/oil in cylinder)',
            'Inspect for mechanical damage',
            'Check valve timing if recently serviced',
            'Engine repair may be required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Large socket and breaker bar', 'Wrench set'],
          safetyWarning: 'Ensure engine cannot start. Remove fuel and ignition connections.'
        }
      ],
      commonCauses: [
        { cause: 'Weak/discharged battery', probability: 40 },
        { cause: 'Poor battery cable connections', probability: 25 },
        { cause: 'Undersized battery cables', probability: 15 },
        { cause: 'Starter motor wear', probability: 12 },
        { cause: 'Engine mechanical issue', probability: 8 }
      ],
      partsNeeded: [
        { name: 'Battery', partNumber: 'Engine-specific', estimated: 'KES 15,000-35,000' },
        { name: 'Battery Cables', partNumber: '16mm² Cable', estimated: 'KES 500/m' },
        { name: 'Starter Motor', partNumber: 'Engine-specific', estimated: 'KES 25,000-60,000' }
      ]
    }
  ],
  'sensing': [
    {
      id: 'oil-pressure-fault',
      symptom: 'Low Oil Pressure warning/shutdown',
      description: 'Controller shows low oil pressure alarm or shuts down due to oil pressure fault',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Actual Oil Level',
          description: 'Check engine oil level on dipstick - most common cause',
          testPoint: { location: 'Engine dipstick', probes: 'Visual inspection' },
          expectedValue: 'Oil level between MIN and MAX marks',
          failureIndicates: 'Low oil level - add oil immediately',
          solution: [
            'Add correct grade oil (typically 15W-40 for diesel generators)',
            'Check for oil leaks under engine',
            'Inspect oil cooler connections',
            'Check turbo oil feed/drain lines',
            'Monitor consumption - should be <0.5L per 100 hours'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Clean rag', 'Correct grade oil'],
          safetyWarning: 'Allow engine to cool 5 minutes for accurate reading. Hot oil can burn.'
        },
        {
          id: 'step2',
          title: 'Test Oil Pressure Sensor Resistance',
          description: 'Check sensor output at atmospheric pressure (engine off)',
          testPoint: { location: 'Oil pressure sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: '10-20 Ohms at 0 PSI (VDO type) or 240 Ohms (US type)',
          failureIndicates: 'Sensor failure - stuck or damaged',
          solution: [
            'Compare reading to sensor specification sheet',
            'If open circuit (OL) or short circuit (0 Ohms) - replace sensor',
            'Clean sensor connector and retry',
            'Check for oil contamination of connector',
            'Replace sensor if out of spec'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step3',
          title: 'Check Wiring from Sensor to Controller',
          description: 'Verify wiring integrity',
          testPoint: { location: 'Controller OIL input', probes: 'Measure resistance from controller to sensor' },
          expectedValue: 'Same as sensor reading (< 2 Ohms difference)',
          failureIndicates: 'Wiring fault - open or high resistance',
          solution: [
            'Inspect wiring for damage, chafing, or corrosion',
            'Check connector pins for pushed out or bent contacts',
            'Repair or replace damaged wiring',
            'Use correct wire gauge: 0.75mm² minimum'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step4',
          title: 'Verify Actual Oil Pressure with Mechanical Gauge',
          description: 'Install test gauge to measure real oil pressure',
          testPoint: { location: 'Oil pressure sensor port', probes: 'Mechanical gauge installation' },
          expectedValue: '25-65 PSI at operating temperature (varies by engine)',
          failureIndicates: 'Actual low oil pressure - engine problem!',
          solution: [
            'DO NOT RUN ENGINE with actual low oil pressure',
            'Check oil pump drive gear/chain',
            'Inspect oil pump pickup screen for blockage',
            'Check oil filter condition - replace if overdue',
            'Verify correct oil viscosity for temperature',
            'Internal engine wear may require rebuild'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Mechanical oil pressure gauge', 'Appropriate fitting'],
          safetyWarning: 'Running engine with low oil pressure will cause catastrophic damage in minutes.'
        }
      ],
      commonCauses: [
        { cause: 'Low oil level', probability: 35 },
        { cause: 'Faulty oil pressure sensor', probability: 30 },
        { cause: 'Wiring/connector problem', probability: 15 },
        { cause: 'Clogged oil filter', probability: 10 },
        { cause: 'Actual low oil pressure (pump/engine wear)', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Oil Pressure Sensor', partNumber: 'VDO 360-081-030-003', estimated: 'KES 4,000-7,000' },
        { name: 'Oil Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Engine Oil 15W-40 5L', partNumber: 'Shell Rimula R4', estimated: 'KES 4,000-6,000' }
      ]
    },
    {
      id: 'coolant-temp-fault',
      symptom: 'High Temperature warning/shutdown or wrong temp reading',
      description: 'Controller shows overtemp alarm, shuts down, or displays incorrect temperature',
      category: 'Engine Sensing',
      estimatedTime: '30-60 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Visual Inspection of Cooling System',
          description: 'Check coolant level, radiator condition, and for leaks',
          testPoint: { location: 'Radiator and expansion tank', probes: 'Visual inspection' },
          expectedValue: 'Coolant at correct level, no leaks, radiator clean',
          failureIndicates: 'Cooling system problem - actual overheating risk',
          solution: [
            'Top up coolant if low (50/50 antifreeze mix)',
            'Check for leaks at hoses, radiator, water pump',
            'Clean radiator fins if blocked with debris',
            'Check fan belt tension and condition',
            'Verify fan is spinning when engine hot'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Flashlight', 'Coolant pressure tester'],
          safetyWarning: 'Never open radiator cap when hot! Steam can cause severe burns.'
        },
        {
          id: 'step2',
          title: 'Test Coolant Temperature Sensor Resistance',
          description: 'Measure sensor resistance at known temperature',
          testPoint: { location: 'Coolant temp sensor terminals', probes: 'Across sensor terminals' },
          expectedValue: 'NTC type: ~2500 Ohms at 20C, ~300 Ohms at 80C (varies by sensor)',
          failureIndicates: 'Sensor failure - incorrect readings',
          solution: [
            'Compare to sensor resistance chart for your sensor',
            'If reading is way off spec - replace sensor',
            'Clean connector contacts',
            'Check for coolant contamination of connector',
            'Replace sensor if out of specification'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Infrared thermometer']
        },
        {
          id: 'step3',
          title: 'Verify Controller Calibration',
          description: 'Check controller is configured for correct sensor type',
          testPoint: { location: 'Controller configuration', probes: 'Software/configuration check' },
          expectedValue: 'Sensor type matches installed sensor (NTC, PT100, etc.)',
          failureIndicates: 'Configuration mismatch causing wrong readings',
          solution: [
            'Check controller configuration for sensor type',
            'Verify sensor curve/range settings',
            'Match controller to actual sensor installed',
            'Use DSE/ComAp configuration software if needed',
            'Factory reset and reconfigure if necessary'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Configuration software', 'USB cable']
        },
        {
          id: 'step4',
          title: 'Verify Actual Engine Temperature',
          description: 'Use infrared thermometer to check real temperature',
          testPoint: { location: 'Thermostat housing', probes: 'IR thermometer aim' },
          expectedValue: '80-95C at operating temperature (varies by engine)',
          failureIndicates: 'If high: Actual overheating. If normal: Sensor/wiring fault',
          solution: [
            'If actually overheating: Stop engine, investigate cooling system',
            'Check thermostat is opening (housing should get hot)',
            'Verify water pump operation (flow in radiator)',
            'Check radiator cap seal',
            'Flush cooling system if contaminated'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Infrared thermometer']
        }
      ],
      commonCauses: [
        { cause: 'Low coolant level', probability: 25 },
        { cause: 'Faulty temperature sensor', probability: 25 },
        { cause: 'Blocked radiator', probability: 15 },
        { cause: 'Failed thermostat', probability: 15 },
        { cause: 'Wiring/connector problem', probability: 10 },
        { cause: 'Fan belt slip/failure', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Coolant Temperature Sensor', partNumber: 'Engine-specific NTC', estimated: 'KES 2,000-5,000' },
        { name: 'Thermostat', partNumber: 'Engine-specific', estimated: 'KES 3,000-8,000' },
        { name: 'Radiator Hose Set', partNumber: 'Engine-specific', estimated: 'KES 4,000-10,000' }
      ]
    },
    {
      id: 'speed-sensor-fault',
      symptom: 'No RPM reading / Overspeed fault / Erratic RPM display',
      description: 'Controller shows 0 RPM, false overspeed, or jumpy speed reading',
      category: 'Engine Sensing',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Check MPU Sensor Air Gap',
          description: 'Verify magnetic pickup sensor is correctly positioned',
          testPoint: { location: 'MPU sensor tip to flywheel teeth', probes: 'Feeler gauge' },
          expectedValue: '0.5-1.0mm (0.020-0.040") air gap typical',
          failureIndicates: 'Gap too large = weak signal, too small = sensor damage risk',
          solution: [
            'Adjust MPU position - thread in until touches tooth, back off 1/2 turn',
            'Use feeler gauge for precise adjustment',
            'Check for flywheel teeth damage',
            'Ensure sensor is tight after adjustment',
            'Clean any metal debris from sensor tip'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Feeler gauge set', 'Appropriate wrench']
        },
        {
          id: 'step2',
          title: 'Test MPU Sensor Output',
          description: 'Measure AC voltage output while cranking',
          testPoint: { location: 'MPU sensor terminals', probes: 'AC Voltage, across sensor wires' },
          expectedValue: '0.5-5V AC while cranking (varies by sensor and speed)',
          failureIndicates: 'Weak or no signal - sensor failure',
          solution: [
            'Check sensor resistance (typically 200-2000 Ohms)',
            'Verify polarity connection (some controllers are polarity sensitive)',
            'Check for damaged sensor cable',
            'Replace sensor if no output',
            'Verify correct sensor type for controller'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter set to AC Volts']
        },
        {
          id: 'step3',
          title: 'Check Shielded Cable and Grounding',
          description: 'Verify MPU cable shielding is correctly connected',
          testPoint: { location: 'MPU shield wire', probes: 'Continuity check' },
          expectedValue: 'Shield connected to controller ground ONLY (not both ends)',
          failureIndicates: 'Ground loop causing interference',
          solution: [
            'Connect shield at controller end only',
            'Ensure shield is not touching engine ground at sensor end',
            'Route cable away from high-current wires',
            'Use twisted pair + shield cable',
            'Keep cable as short as practical'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter']
        },
        {
          id: 'step4',
          title: 'Check Controller Speed Settings',
          description: 'Verify flywheel teeth count and pickup configuration',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'Teeth count matches actual flywheel',
          failureIndicates: 'Wrong teeth count = wrong RPM display',
          solution: [
            'Count actual flywheel teeth (common: 113, 124, 140)',
            'Configure controller for correct teeth count',
            'Check pickup type setting (MPU/VR vs Hall effect)',
            'Verify pickup threshold voltage setting',
            'Save configuration and test'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Flashlight for counting teeth']
        }
      ],
      commonCauses: [
        { cause: 'Incorrect sensor air gap', probability: 30 },
        { cause: 'Faulty MPU sensor', probability: 25 },
        { cause: 'Shielding/grounding problem', probability: 20 },
        { cause: 'Wrong teeth count configuration', probability: 15 },
        { cause: 'Damaged sensor cable', probability: 10 }
      ],
      partsNeeded: [
        { name: 'Magnetic Pickup Sensor', partNumber: 'MPU-5/8-18-UNF', estimated: 'KES 8,000-15,000' },
        { name: 'Shielded Cable 0.75mm²', partNumber: '2C-SHIELD-075', estimated: 'KES 400/m' }
      ]
    }
  ],
  'fuel': [
    {
      id: 'no-fuel',
      symptom: 'Engine cranks but does not start - no fuel',
      description: 'Engine turns over normally but will not fire. Fuel system suspect.',
      category: 'Fuel System',
      estimatedTime: '20-45 minutes',
      difficulty: 'Intermediate',
      steps: [
        {
          id: 'step1',
          title: 'Verify Fuel Tank Level',
          description: 'Check actual fuel level in tank',
          testPoint: { location: 'Fuel tank', probes: 'Visual or gauge check' },
          expectedValue: 'Minimum 1/4 tank for reliable operation',
          failureIndicates: 'Out of fuel or fuel gauge inaccurate',
          solution: [
            'Add fuel if tank is empty',
            'Check fuel gauge sender operation',
            'Bleed fuel system after running dry (diesel)',
            'Prime fuel pump if equipped with manual primer'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Fuel container if needed']
        },
        {
          id: 'step2',
          title: 'Check Fuel Solenoid Operation',
          description: 'Verify fuel solenoid opens when engine running',
          testPoint: { location: 'Fuel solenoid terminals', probes: 'DC Voltage during cranking' },
          expectedValue: 'Battery voltage when start commanded',
          failureIndicates: 'Solenoid not energized - wiring or controller issue',
          solution: [
            'Check FUEL output from controller',
            'Verify solenoid coil continuity (typical 8-30 Ohms)',
            'Check for seized solenoid plunger',
            'Listen for solenoid click when energized',
            'Manually open solenoid to test (remove wire, apply B+)'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test light']
        },
        {
          id: 'step3',
          title: 'Check Fuel Supply to Injection Pump',
          description: 'Verify fuel is reaching the injection pump',
          testPoint: { location: 'Injection pump inlet', probes: 'Crack fitting and crank' },
          expectedValue: 'Steady flow of fuel when cranking',
          failureIndicates: 'Fuel supply blockage or pump failure',
          solution: [
            'Check fuel filter condition - replace if overdue',
            'Inspect fuel lines for kinks or damage',
            'Verify fuel lift pump operation',
            'Check for air in fuel system - bleed as needed',
            'Check fuel tank pickup/strainer'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Open-end wrench', 'Container for fuel'],
          safetyWarning: 'Fuel is flammable. No smoking. Contain spills immediately.'
        },
        {
          id: 'step4',
          title: 'Check Injection Pump and Injectors',
          description: 'Verify injection pump is delivering fuel to injectors',
          testPoint: { location: 'Injector line union', probes: 'Crack fitting and crank' },
          expectedValue: 'Fuel spurts from loosened injector line',
          failureIndicates: 'Injection pump failure or timing issue',
          solution: [
            'If no fuel at injector - check injection pump timing',
            'Verify pump is mechanically driven (gear/belt)',
            'Check pump spline/coupling',
            'Injection pump may need professional service',
            'Check injector spray pattern'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Injector line wrench', 'Container'],
          safetyWarning: 'Diesel under high pressure can penetrate skin. Keep clear of spray.'
        }
      ],
      commonCauses: [
        { cause: 'Fuel solenoid not opening', probability: 30 },
        { cause: 'Clogged fuel filter', probability: 25 },
        { cause: 'Air in fuel system', probability: 20 },
        { cause: 'Empty fuel tank', probability: 10 },
        { cause: 'Fuel lift pump failure', probability: 10 },
        { cause: 'Injection pump failure', probability: 5 }
      ],
      partsNeeded: [
        { name: 'Fuel Filter', partNumber: 'Engine-specific', estimated: 'KES 1,500-4,000' },
        { name: 'Fuel Solenoid', partNumber: 'Engine-specific', estimated: 'KES 8,000-20,000' },
        { name: 'Fuel Lift Pump', partNumber: 'Engine-specific', estimated: 'KES 10,000-25,000' }
      ]
    }
  ],
  'generator': [
    {
      id: 'no-voltage',
      symptom: 'Generator produces no voltage output',
      description: 'Engine runs at correct speed but generator output is 0V or very low',
      category: 'Generator Output',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check Generator Voltage at Output Terminals',
          description: 'Measure voltage directly at generator output terminals',
          testPoint: { location: 'Generator output terminals L1-N', probes: 'AC Voltage L1 to Neutral' },
          expectedValue: '220-240V AC at rated speed (50Hz: 1500RPM, 60Hz: 1800RPM)',
          failureIndicates: 'No/low voltage at generator output',
          solution: [
            'Verify engine is running at correct speed (1500/1800 RPM)',
            'Check AVR (Automatic Voltage Regulator) condition',
            'Verify excitation supply to AVR',
            'Check for field flash procedure if generator was dormant'
          ],
          nextIfPass: 'step2',
          nextIfFail: 'step3',
          tools: ['AC Voltmeter', 'Tachometer/frequency meter']
        },
        {
          id: 'step2',
          title: 'Check Voltage at Controller Input',
          description: 'Verify voltage is reaching the controller sensing inputs',
          testPoint: { location: 'Controller GEN-L1 to GEN-N', probes: 'AC Voltage' },
          expectedValue: 'Same as generator output (±5V)',
          failureIndicates: 'Sensing circuit fault - fuses, wiring',
          solution: [
            'Check voltage sensing fuses (usually 1-2A)',
            'Inspect wiring from generator to controller',
            'Verify correct phase connection',
            'Check for loose terminals'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step3',
          title: 'Check AVR Power Supply',
          description: 'Verify AVR is receiving power',
          testPoint: { location: 'AVR input terminals', probes: 'AC Voltage at AVR input' },
          expectedValue: 'Auxiliary winding voltage or PMG output (varies by system)',
          failureIndicates: 'No power to AVR - cannot regulate',
          solution: [
            'Check auxiliary winding output',
            'If PMG equipped, verify PMG output',
            'Check AVR fuses and connections',
            'Inspect wiring to AVR',
            'AVR may need replacement if input OK but no output'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['AC Voltmeter']
        },
        {
          id: 'step4',
          title: 'Check Field Circuit and Brushes',
          description: 'Verify excitation field circuit is complete',
          testPoint: { location: 'Field winding at slip rings', probes: 'Resistance measurement' },
          expectedValue: 'Typically 5-15 Ohms (check generator data)',
          failureIndicates: 'Open field winding or worn brushes',
          solution: [
            'Inspect brush condition and spring pressure',
            'Check slip ring surface condition',
            'Measure field winding resistance',
            'Check diode pack if brushless type',
            'Replace brushes if worn below limit'
          ],
          nextIfPass: 'step5',
          nextIfFail: null,
          tools: ['Ohmmeter', 'Brush wear gauge']
        },
        {
          id: 'step5',
          title: 'Field Flash Procedure',
          description: 'Re-establish residual magnetism',
          testPoint: { location: 'Field terminals', probes: 'Apply DC voltage briefly' },
          expectedValue: 'Generator should start producing voltage',
          failureIndicates: 'May indicate deeper winding issue',
          solution: [
            'Disconnect AVR field output wires',
            'Apply 12V DC to field F+ and F- briefly (2-3 seconds)',
            'Observe polarity (check generator manual)',
            'Reconnect AVR and test',
            'If still no output - stator/rotor winding test required'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['12V DC source', 'Test leads'],
          safetyWarning: 'Field flashing must be done with engine stopped or at low speed. Observe correct polarity.'
        }
      ],
      commonCauses: [
        { cause: 'Lost residual magnetism', probability: 25 },
        { cause: 'AVR failure', probability: 25 },
        { cause: 'Worn brushes/slip rings', probability: 20 },
        { cause: 'Blown voltage sensing fuses', probability: 15 },
        { cause: 'Field winding open circuit', probability: 10 },
        { cause: 'Engine underspeed', probability: 5 }
      ],
      partsNeeded: [
        { name: 'AVR (Automatic Voltage Regulator)', partNumber: 'Generator-specific', estimated: 'KES 15,000-45,000' },
        { name: 'Brush Set', partNumber: 'Generator-specific', estimated: 'KES 5,000-12,000' },
        { name: 'Voltage Sensing Fuses', partNumber: '2A Glass Fuse', estimated: 'KES 200-500' }
      ]
    }
  ],
  'protection': [
    {
      id: 'e-stop-fault',
      symptom: 'Engine will not start - E-Stop indication or protection fault',
      description: 'Controller shows E-Stop active or protection input triggered preventing start',
      category: 'Protection',
      estimatedTime: '15-30 minutes',
      difficulty: 'Basic',
      steps: [
        {
          id: 'step1',
          title: 'Check Physical E-Stop Button',
          description: 'Verify E-Stop button is not pressed/latched',
          testPoint: { location: 'E-Stop button', probes: 'Physical inspection' },
          expectedValue: 'Button should be in released (OUT) position',
          failureIndicates: 'E-Stop engaged - system working correctly',
          solution: [
            'Twist/pull to release mushroom head type',
            'Turn key to release if key-reset type',
            'Replace button if stuck or damaged',
            'Clear fault on controller after releasing'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['None']
        },
        {
          id: 'step2',
          title: 'Check E-Stop Circuit Continuity',
          description: 'Verify E-Stop circuit is complete (NC contacts)',
          testPoint: { location: 'E-Stop terminals at controller', probes: 'Continuity across E-Stop input' },
          expectedValue: '< 1 Ohm (circuit closed) when E-Stop released',
          failureIndicates: 'Open circuit - wiring fault or switch failure',
          solution: [
            'Check wiring from E-Stop to controller',
            'Verify NC (Normally Closed) contacts are used',
            'Check for damaged cable',
            'Test E-Stop switch continuity directly',
            'Repair/replace damaged wiring'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Test leads']
        },
        {
          id: 'step3',
          title: 'Check for Multiple E-Stop Loops',
          description: 'Verify all E-Stops in series are released',
          testPoint: { location: 'All E-Stop stations', probes: 'Physical and electrical check' },
          expectedValue: 'All E-Stop buttons released, circuit complete',
          failureIndicates: 'One of multiple E-Stops is engaged',
          solution: [
            'Locate all E-Stop stations on genset',
            'Release any engaged E-Stop',
            'Check for remote E-Stop connections',
            'Verify end-of-line resistor if used'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Wiring diagram']
        },
        {
          id: 'step4',
          title: 'Check Controller E-Stop Configuration',
          description: 'Verify E-Stop input is configured correctly',
          testPoint: { location: 'Controller configuration', probes: 'Software check' },
          expectedValue: 'E-Stop input configured as Normally Closed (NC)',
          failureIndicates: 'Wrong configuration - NO vs NC',
          solution: [
            'Check controller configuration for E-Stop input type',
            'Should be set to NC (Normally Closed) for safety',
            'Reconfigure if set incorrectly',
            'Verify input voltage threshold settings'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'Controller manual']
        }
      ],
      commonCauses: [
        { cause: 'E-Stop button engaged', probability: 40 },
        { cause: 'Broken wire in E-Stop circuit', probability: 25 },
        { cause: 'Faulty E-Stop switch', probability: 15 },
        { cause: 'Multiple E-Stop loop issue', probability: 10 },
        { cause: 'Controller configuration error', probability: 10 }
      ],
      partsNeeded: [
        { name: 'E-Stop Button Assembly', partNumber: 'E-STOP-MUSHROOM-NC', estimated: 'KES 2,000-5,000' },
        { name: 'E-Stop Cable', partNumber: '2-CORE-1.0MM', estimated: 'KES 200/m' }
      ]
    }
  ],
  'communication': [
    {
      id: 'can-fault',
      symptom: 'CAN communication fault / No data from ECU',
      description: 'Controller shows CAN error, no engine data on J1939, or ECU communication failure',
      category: 'Communication',
      estimatedTime: '30-60 minutes',
      difficulty: 'Advanced',
      steps: [
        {
          id: 'step1',
          title: 'Check CAN Bus Termination',
          description: 'Verify 120 Ohm termination resistors are present',
          testPoint: { location: 'CAN-H to CAN-L at network ends', probes: 'Resistance measurement (network powered off)' },
          expectedValue: '60 Ohms (two 120 Ohm resistors in parallel)',
          failureIndicates: 'Missing or extra termination',
          solution: [
            'Should have exactly TWO 120 Ohm terminators - one at each end',
            'Measure: 60 Ohms = correct, 120 Ohms = one terminator, 40 Ohms = three, Open = none',
            'Add or remove terminators as needed',
            'Terminators often built into ECU and controller'
          ],
          nextIfPass: 'step2',
          nextIfFail: null,
          tools: ['Digital Multimeter'],
          safetyWarning: 'Disconnect power before measuring CAN termination.'
        },
        {
          id: 'step2',
          title: 'Check CAN Bus Wiring',
          description: 'Verify CAN-H and CAN-L wiring integrity',
          testPoint: { location: 'CAN connectors', probes: 'Visual and continuity check' },
          expectedValue: 'Twisted pair, shielded cable, no shorts or opens',
          failureIndicates: 'Wiring fault disrupting communication',
          solution: [
            'Check for continuity from ECU to controller',
            'Verify no short between CAN-H and CAN-L',
            'Verify no short to ground or power',
            'Use twisted pair cable rated for CAN bus',
            'Maximum cable length: 40m for 250kbps J1939'
          ],
          nextIfPass: 'step3',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Cable tester']
        },
        {
          id: 'step3',
          title: 'Check CAN Bus Voltage Levels',
          description: 'Measure CAN bus voltages during operation',
          testPoint: { location: 'CAN-H and CAN-L to ground', probes: 'DC Voltage' },
          expectedValue: 'CAN-H: 2.5-3.5V, CAN-L: 1.5-2.5V (recessive state)',
          failureIndicates: 'Bus driver fault or short circuit',
          solution: [
            'If CAN-H stuck high or low - check for short',
            'If CAN-L stuck - same',
            'Disconnect devices one by one to find fault',
            'Check for damaged transceiver chip',
            'Verify ground reference between devices'
          ],
          nextIfPass: 'step4',
          nextIfFail: null,
          tools: ['Digital Multimeter', 'Oscilloscope (advanced)']
        },
        {
          id: 'step4',
          title: 'Verify J1939 Source Addresses',
          description: 'Check for address conflicts on the bus',
          testPoint: { location: 'Controller diagnostics', probes: 'Software check' },
          expectedValue: 'Each device should have unique source address',
          failureIndicates: 'Address conflict preventing communication',
          solution: [
            'Typical addresses: Engine ECU=0, Controller=128',
            'Check controller J1939 configuration',
            'Verify baud rate matches (J1939 = 250 kbps)',
            'Check protocol: J1939 vs proprietary',
            'Use CAN bus analyzer to monitor traffic'
          ],
          nextIfPass: null,
          nextIfFail: null,
          tools: ['Configuration software', 'CAN analyzer (advanced)']
        }
      ],
      commonCauses: [
        { cause: 'Wrong or missing termination', probability: 30 },
        { cause: 'Wiring fault (short/open)', probability: 25 },
        { cause: 'Baud rate mismatch', probability: 15 },
        { cause: 'Address conflict', probability: 10 },
        { cause: 'Failed CAN transceiver', probability: 10 },
        { cause: 'Ground potential difference', probability: 10 }
      ],
      partsNeeded: [
        { name: 'CAN Termination Resistor', partNumber: '120-OHM-0.25W', estimated: 'KES 100-200' },
        { name: 'CAN Bus Cable (Twisted Pair)', partNumber: 'CAN-2X0.5-SHLD', estimated: 'KES 300/m' }
      ]
    }
  ]
};

// ==================== DIAGNOSTIC FLOW COMPONENT ====================
function DiagnosticFlowPanel({
  circuitId,
  controller
}: {
  circuitId: string;
  controller: ControllerModel;
}) {
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticFlow | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [stepResults, setStepResults] = useState<{ [stepId: string]: 'pass' | 'fail' | null }>({});

  const diagnostics = DIAGNOSTIC_TROUBLESHOOTING[circuitId] || [];

  const handleStepResult = (stepId: string, result: 'pass' | 'fail') => {
    setStepResults(prev => ({ ...prev, [stepId]: result }));
    setCompletedSteps(prev => new Set([...prev, stepId]));

    const step = selectedDiagnostic?.steps[currentStep];
    if (step) {
      const nextStepId = result === 'pass' ? step.nextIfPass : step.nextIfFail;
      if (nextStepId) {
        const nextIndex = selectedDiagnostic?.steps.findIndex(s => s.id === nextStepId);
        if (nextIndex !== undefined && nextIndex >= 0) {
          setCurrentStep(nextIndex);
        }
      }
    }
  };

  const resetDiagnostic = () => {
    setCurrentStep(0);
    setCompletedSteps(new Set());
    setStepResults({});
  };

  if (diagnostics.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        <span className="text-4xl mb-4 block">🔧</span>
        No diagnostic flows available for this circuit yet.
        <p className="text-sm mt-2">Select another circuit or use the schematic view.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Diagnostic Selection */}
      {!selectedDiagnostic ? (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            Select Your Symptom
          </h3>
          <p className="text-slate-400 text-sm">
            Choose the symptom you are experiencing for step-by-step diagnostic guidance
          </p>
          <div className="grid gap-4">
            {diagnostics.map((diag) => (
              <motion.button
                key={diag.id}
                onClick={() => { setSelectedDiagnostic(diag); resetDiagnostic(); }}
                className="p-5 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/50 text-left transition-all group"
                whileHover={{ scale: 1.01, x: 5 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg group-hover:text-cyan-400 transition-colors">
                      {diag.symptom}
                    </h4>
                    <p className="text-slate-400 text-sm mt-1">{diag.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-lg">
                        {diag.estimatedTime}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-lg ${
                        diag.difficulty === 'Basic' ? 'bg-green-500/20 text-green-400' :
                        diag.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {diag.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-lg">
                        {diag.steps.length} Steps
                      </span>
                    </div>
                  </div>
                  <span className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header with back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedDiagnostic(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <span>←</span> Back to Symptoms
            </button>
            <button
              onClick={resetDiagnostic}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700"
            >
              Restart Diagnostic
            </button>
          </div>

          {/* Diagnostic Title */}
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30 rounded-xl">
            <h3 className="text-xl font-bold text-white">{selectedDiagnostic.symptom}</h3>
            <p className="text-slate-400 text-sm mt-1">{selectedDiagnostic.description}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {selectedDiagnostic.steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  completedSteps.has(step.id)
                    ? stepResults[step.id] === 'pass' ? 'bg-green-500' : 'bg-red-500'
                    : idx === currentStep
                      ? 'bg-cyan-500'
                      : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-slate-400">
            Step {currentStep + 1} of {selectedDiagnostic.steps.length}
          </div>

          {/* Current Step Card */}
          {selectedDiagnostic.steps[currentStep] && (
            <motion.div
              key={selectedDiagnostic.steps[currentStep].id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 bg-slate-900/80 rounded-xl border border-slate-700/50 space-y-5"
            >
              {/* Step Header */}
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-sm">
                    {currentStep + 1}
                  </span>
                  <h4 className="text-lg font-bold text-white">{selectedDiagnostic.steps[currentStep].title}</h4>
                </div>
                <p className="text-slate-300">{selectedDiagnostic.steps[currentStep].description}</p>
              </div>

              {/* Safety Warning */}
              {selectedDiagnostic.steps[currentStep].safetyWarning && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-1">
                    <span>⚠️</span> SAFETY WARNING
                  </div>
                  <p className="text-red-300 text-sm">{selectedDiagnostic.steps[currentStep].safetyWarning}</p>
                </div>
              )}

              {/* Test Point */}
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <div className="text-amber-400 font-bold text-sm mb-2">🎯 TEST POINT</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.location}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Probes:</span>
                    <p className="text-white font-medium">{selectedDiagnostic.steps[currentStep].testPoint.probes}</p>
                  </div>
                </div>
              </div>

              {/* Expected Value */}
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="text-green-400 font-bold text-sm mb-1">✓ EXPECTED VALUE</div>
                <p className="text-green-300 font-medium">{selectedDiagnostic.steps[currentStep].expectedValue}</p>
              </div>

              {/* Tools Needed */}
              <div className="flex flex-wrap gap-2">
                <span className="text-slate-400 text-sm">Tools needed:</span>
                {selectedDiagnostic.steps[currentStep].tools.map((tool, idx) => (
                  <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-300 text-xs rounded-lg">
                    🔧 {tool}
                  </span>
                ))}
              </div>

              {/* Result Buttons */}
              <div className="border-t border-slate-700 pt-4 mt-4">
                <p className="text-slate-400 text-sm mb-3">What was your measurement result?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      handleStepResult(selectedDiagnostic.steps[currentStep].id, 'pass');
                      if (currentStep < selectedDiagnostic.steps.length - 1 && selectedDiagnostic.steps[currentStep].nextIfPass) {
                        // Already handled in handleStepResult
                      } else if (currentStep < selectedDiagnostic.steps.length - 1) {
                        setCurrentStep(currentStep + 1);
                      }
                    }}
                    className="flex-1 py-3 bg-green-500/20 text-green-400 rounded-lg font-bold hover:bg-green-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✓</span> PASS - Value is Good
                  </button>
                  <button
                    onClick={() => handleStepResult(selectedDiagnostic.steps[currentStep].id, 'fail')}
                    className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-lg font-bold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>✗</span> FAIL - Problem Found
                  </button>
                </div>
              </div>

              {/* Solution (shown when FAIL) */}
              {stepResults[selectedDiagnostic.steps[currentStep].id] === 'fail' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                >
                  <div className="text-red-400 font-bold mb-2">
                    🔴 {selectedDiagnostic.steps[currentStep].failureIndicates}
                  </div>
                  <div className="text-white font-bold mb-2 text-sm">SOLUTION:</div>
                  <ul className="space-y-2">
                    {selectedDiagnostic.steps[currentStep].solution.map((sol, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-cyan-400 mt-0.5">{idx + 1}.</span>
                        {sol}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Common Causes */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>📊</span> Common Causes (Probability)
            </h4>
            <div className="space-y-2">
              {selectedDiagnostic.commonCauses.map((cause, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-teal-500"
                      style={{ width: `${cause.probability}%` }}
                    />
                  </div>
                  <span className="text-slate-300 text-sm whitespace-nowrap w-32">{cause.cause}</span>
                  <span className="text-cyan-400 font-bold text-sm w-12">{cause.probability}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Parts Needed */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <span>🛒</span> Parts You May Need
            </h4>
            <div className="grid gap-2">
              {selectedDiagnostic.partsNeeded.map((part, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{part.name}</div>
                    <div className="text-slate-500 text-xs">P/N: {part.partNumber}</div>
                  </div>
                  <div className="text-amber-400 font-bold text-sm">{part.estimated}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  controller,
  onExport
}: {
  circuitId: string;
  controller: ControllerModel;
  onExport: () => void;
}) {
  const schematic = DETAILED_SCHEMATICS[circuitId];
  const [showNotes, setShowNotes] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

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
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              className={`px-3 py-1 rounded text-xs hover:text-white ${isZoomed ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}
            >
              🔍 {isZoomed ? 'Reset' : 'Zoom'}
            </button>
            <button
              onClick={onExport}
              className="px-3 py-1 bg-slate-800 text-slate-400 rounded text-xs hover:text-white"
            >
              📥 Export
            </button>
          </div>
        </div>

        {/* SVG Canvas */}
        <svg
          viewBox="0 0 700 450"
          className={`w-full pt-12 transition-all duration-300 ${isZoomed ? 'h-[800px] scale-110' : 'h-[500px]'}`}
          style={{ minHeight: isZoomed ? '800px' : '500px' }}
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
  const [viewMode, setViewMode] = useState<'schematic' | 'diagnostics' | 'pinout' | 'colors'>('schematic');

  const brands = [...new Set(CONTROLLERS.map(c => c.brand))];
  const brandControllers = CONTROLLERS.filter(c => c.brand === selectedBrand);

  // Get current pin configuration
  const currentPins = CONTROLLER_PINS[selectedController.id] || CONTROLLER_PINS['dse-7320'];

  // Export to PDF function
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to download PDF');
      return;
    }

    const pinRows = currentPins.map(pin => `
      <tr>
        <td style="padding: 8px; border: 1px solid #334155; font-weight: bold;">${pin.pin}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.name}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.function}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.wireColor}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.wireGauge}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${pin.circuit}</td>
      </tr>
    `).join('');

    const wireColorRows = Object.entries(WIRE_COLORS).map(([code, info]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #334155; background: ${info.hex}; color: ${info.hex === '#000000' || info.hex === '#1e3a8a' ? '#fff' : '#000'}; font-weight: bold;">${code}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${info.name}</td>
        <td style="padding: 8px; border: 1px solid #334155;">${info.usage}</td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Wiring Diagram - ${selectedController.model}</title>
        <style>
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #0f172a; color: #e2e8f0; margin: 0; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #0ea5e9; }
          .header h1 { color: #0ea5e9; margin: 0 0 10px 0; font-size: 28px; }
          .header h2 { color: #94a3b8; margin: 0; font-size: 18px; font-weight: normal; }
          .section { margin-bottom: 30px; }
          .section h3 { color: #22d3ee; margin-bottom: 15px; font-size: 18px; border-left: 4px solid #0ea5e9; padding-left: 12px; }
          table { width: 100%; border-collapse: collapse; background: #1e293b; font-size: 12px; }
          th { background: #334155; color: #0ea5e9; padding: 12px 8px; text-align: left; font-weight: bold; border: 1px solid #475569; }
          td { color: #cbd5e1; }
          .specs-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
          .spec-box { background: #1e293b; padding: 15px; border-radius: 8px; border: 1px solid #334155; }
          .spec-label { color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; }
          .spec-value { color: #0ea5e9; font-size: 16px; font-weight: bold; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #334155; text-align: center; color: #64748b; font-size: 11px; }
          .logo { font-size: 24px; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">📐 Generator Oracle</div>
          <h1>Wiring Diagram Documentation</h1>
          <h2>${selectedController.brand} ${selectedController.model}</h2>
        </div>

        <div class="section">
          <h3>Controller Specifications</h3>
          <div class="specs-grid">
            <div class="spec-box">
              <div class="spec-label">Model</div>
              <div class="spec-value">${selectedController.model}</div>
            </div>
            <div class="spec-box">
              <div class="spec-label">Brand</div>
              <div class="spec-value">${selectedController.brand}</div>
            </div>
            <div class="spec-box">
              <div class="spec-label">Total Pins</div>
              <div class="spec-value">${currentPins.length}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Pin Configuration</h3>
          <table>
            <thead>
              <tr>
                <th>Pin</th>
                <th>Name</th>
                <th>Function</th>
                <th>Wire Color</th>
                <th>Gauge</th>
                <th>Circuit</th>
              </tr>
            </thead>
            <tbody>
              ${pinRows}
            </tbody>
          </table>
        </div>

        <div class="section" style="page-break-before: always;">
          <h3>Wire Color Standards (IEC 60446)</h3>
          <table>
            <thead>
              <tr>
                <th>Color Code</th>
                <th>Color Name</th>
                <th>Standard Usage</th>
              </tr>
            </thead>
            <tbody>
              ${wireColorRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>Generated by Generator Oracle - Ajira Power Solutions Ltd</p>
          <p>Professional Electrical Documentation • IEEE/IEC Standards</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
  };

  // Print function
  const handlePrint = () => {
    exportToPDF();
  };

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
            { id: 'diagnostics', label: 'Diagnostics', icon: '🔍' },
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

          {/* Circuit Selection (for schematic and diagnostics view) */}
          {(viewMode === 'schematic' || viewMode === 'diagnostics') && (
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
                <DetailedSchematicView circuitId={selectedCircuit} controller={selectedController} onExport={exportToPDF} />
              </motion.div>
            )}

            {viewMode === 'diagnostics' && (
              <motion.div
                key="diagnostics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-slate-700/50"
              >
                <DiagnosticFlowPanel circuitId={selectedCircuit} controller={selectedController} />
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
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <div className="text-3xl mb-2">🔍</div>
              <div className="text-2xl font-black text-red-400">{Object.values(DIAGNOSTIC_TROUBLESHOOTING).flat().length}</div>
              <div className="text-xs text-slate-500">Diagnostic Flows</div>
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
              <div className="font-bold text-white">Professional-Grade Electrical Documentation & Diagnostics</div>
              <div className="text-sm text-slate-400">
                IEEE/IEC standard symbols • Step-by-step troubleshooting • Test points with expected values • Complete solutions
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportToPDF}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <span>📥</span> Export PDF
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <span>🖨️</span> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
