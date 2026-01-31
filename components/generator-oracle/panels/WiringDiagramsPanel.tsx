'use client';

/**
 * WIRING & SCHEMATIC DIAGRAMS PANEL
 * Interactive electrical diagrams for troubleshooting
 *
 * Features:
 * 1. Interactive Wiring Diagrams - Zoomable, pannable, searchable
 * 2. Schematic Diagrams - Logical circuit flow
 * 3. Component Location Maps - Physical locations on generator
 * 4. Connector Pin-outs - Pin assignments
 * 5. Wire Color Code Reference - Brand-specific color standards
 * 6. Fault-to-Circuit Linking - Highlights relevant circuits for each fault
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface WireConnection {
  id: string;
  from: { x: number; y: number; component: string; pin: string };
  to: { x: number; y: number; component: string; pin: string };
  color: string;
  colorName: string;
  gauge: string;
  circuit: string;
  description: string;
}

interface Component {
  id: string;
  name: string;
  type: 'controller' | 'sensor' | 'relay' | 'actuator' | 'connector' | 'fuse' | 'ground' | 'power';
  x: number;
  y: number;
  width: number;
  height: number;
  pins: { id: string; name: string; x: number; y: number }[];
  description: string;
}

interface DiagramType {
  id: string;
  name: string;
  icon: string;
  category: 'wiring' | 'schematic' | 'location' | 'pinout';
}

// ==================== SAMPLE DATA ====================
const DIAGRAM_TYPES: DiagramType[] = [
  { id: 'main-power', name: 'Main Power Circuit', icon: '⚡', category: 'wiring' },
  { id: 'charging', name: 'Battery Charging', icon: '🔋', category: 'wiring' },
  { id: 'starting', name: 'Starting Circuit', icon: '🔑', category: 'wiring' },
  { id: 'fuel-system', name: 'Fuel System', icon: '⛽', category: 'wiring' },
  { id: 'cooling', name: 'Cooling System', icon: '❄️', category: 'wiring' },
  { id: 'oil-pressure', name: 'Oil Pressure Circuit', icon: '🛢️', category: 'wiring' },
  { id: 'speed-sensing', name: 'Speed Sensing', icon: '🔄', category: 'wiring' },
  { id: 'alternator', name: 'Alternator Output', icon: '⚙️', category: 'wiring' },
  { id: 'control-logic', name: 'Controller Logic', icon: '🧠', category: 'schematic' },
  { id: 'protection', name: 'Protection Circuits', icon: '🛡️', category: 'schematic' },
  { id: 'avr', name: 'AVR Circuit', icon: '📊', category: 'schematic' },
  { id: 'component-map', name: 'Component Locations', icon: '📍', category: 'location' },
  { id: 'dse-pinout', name: 'DSE Controller Pinout', icon: '🔌', category: 'pinout' },
  { id: 'comap-pinout', name: 'ComAp Controller Pinout', icon: '🔌', category: 'pinout' },
];

const WIRE_COLORS: { [key: string]: { hex: string; name: string; usage: string } } = {
  'red': { hex: '#ef4444', name: 'Red', usage: 'Battery positive, main power' },
  'black': { hex: '#1f2937', name: 'Black', usage: 'Ground, negative' },
  'yellow': { hex: '#eab308', name: 'Yellow', usage: 'Alternator charge, accessories' },
  'blue': { hex: '#3b82f6', name: 'Blue', usage: 'Sensors, signals' },
  'green': { hex: '#22c55e', name: 'Green', usage: 'Ground, safety' },
  'white': { hex: '#f8fafc', name: 'White', usage: 'Neutral, return' },
  'orange': { hex: '#f97316', name: 'Orange', usage: 'Fuel solenoid, actuators' },
  'purple': { hex: '#a855f7', name: 'Purple', usage: 'Starter signal' },
  'brown': { hex: '#92400e', name: 'Brown', usage: 'Oil pressure, temperature' },
  'pink': { hex: '#ec4899', name: 'Pink', usage: 'Speed sensor' },
  'gray': { hex: '#6b7280', name: 'Gray', usage: 'Communication, CAN bus' },
};

// Sample components for the main power diagram
const SAMPLE_COMPONENTS: Component[] = [
  {
    id: 'battery',
    name: 'Battery 24V',
    type: 'power',
    x: 50,
    y: 200,
    width: 80,
    height: 50,
    pins: [
      { id: 'pos', name: '+', x: 90, y: 215 },
      { id: 'neg', name: '-', x: 90, y: 235 },
    ],
    description: '24V DC Battery Bank',
  },
  {
    id: 'controller',
    name: 'DSE 7320',
    type: 'controller',
    x: 300,
    y: 150,
    width: 120,
    height: 150,
    pins: [
      { id: 'b+', name: 'B+', x: 300, y: 170 },
      { id: 'b-', name: 'B-', x: 300, y: 190 },
      { id: 'start', name: 'START', x: 300, y: 210 },
      { id: 'fuel', name: 'FUEL', x: 300, y: 230 },
      { id: 'oil-p', name: 'OIL-P', x: 420, y: 170 },
      { id: 'temp', name: 'TEMP', x: 420, y: 190 },
      { id: 'speed', name: 'SPEED', x: 420, y: 210 },
      { id: 'gen-l1', name: 'GEN-L1', x: 420, y: 230 },
    ],
    description: 'Deep Sea Electronics Controller',
  },
  {
    id: 'starter',
    name: 'Starter Motor',
    type: 'actuator',
    x: 500,
    y: 80,
    width: 70,
    height: 40,
    pins: [
      { id: 's', name: 'S', x: 500, y: 95 },
      { id: 'm', name: 'M', x: 500, y: 110 },
    ],
    description: '24V Starter Motor',
  },
  {
    id: 'fuel-solenoid',
    name: 'Fuel Solenoid',
    type: 'actuator',
    x: 500,
    y: 150,
    width: 70,
    height: 40,
    pins: [
      { id: 'coil', name: 'COIL', x: 500, y: 165 },
      { id: 'gnd', name: 'GND', x: 500, y: 180 },
    ],
    description: 'Fuel Run Solenoid',
  },
  {
    id: 'oil-sensor',
    name: 'Oil Pressure',
    type: 'sensor',
    x: 550,
    y: 220,
    width: 60,
    height: 35,
    pins: [
      { id: 'sig', name: 'SIG', x: 550, y: 235 },
      { id: 'gnd', name: 'GND', x: 590, y: 235 },
    ],
    description: 'Oil Pressure Sender 0-10 bar',
  },
  {
    id: 'temp-sensor',
    name: 'Coolant Temp',
    type: 'sensor',
    x: 550,
    y: 280,
    width: 60,
    height: 35,
    pins: [
      { id: 'sig', name: 'SIG', x: 550, y: 295 },
      { id: 'gnd', name: 'GND', x: 590, y: 295 },
    ],
    description: 'Coolant Temperature Sender',
  },
  {
    id: 'speed-sensor',
    name: 'MPU Speed',
    type: 'sensor',
    x: 550,
    y: 340,
    width: 60,
    height: 35,
    pins: [
      { id: 'sig', name: 'SIG', x: 550, y: 355 },
      { id: 'gnd', name: 'GND', x: 590, y: 355 },
    ],
    description: 'Magnetic Pickup Speed Sensor',
  },
  {
    id: 'fuse-box',
    name: 'Fuse Box',
    type: 'fuse',
    x: 180,
    y: 100,
    width: 60,
    height: 80,
    pins: [
      { id: 'f1-in', name: 'F1', x: 180, y: 120 },
      { id: 'f2-in', name: 'F2', x: 180, y: 140 },
      { id: 'f3-in', name: 'F3', x: 180, y: 160 },
      { id: 'f1-out', name: 'F1', x: 240, y: 120 },
      { id: 'f2-out', name: 'F2', x: 240, y: 140 },
      { id: 'f3-out', name: 'F3', x: 240, y: 160 },
    ],
    description: 'Main Fuse Box 10A/15A/20A',
  },
  {
    id: 'ground-bus',
    name: 'Ground Bus',
    type: 'ground',
    x: 300,
    y: 380,
    width: 150,
    height: 20,
    pins: [
      { id: 'g1', name: 'G1', x: 320, y: 380 },
      { id: 'g2', name: 'G2', x: 360, y: 380 },
      { id: 'g3', name: 'G3', x: 400, y: 380 },
      { id: 'g4', name: 'G4', x: 440, y: 380 },
    ],
    description: 'Main Ground Bus Bar',
  },
];

const SAMPLE_WIRES: WireConnection[] = [
  {
    id: 'w1',
    from: { x: 130, y: 215, component: 'battery', pin: 'pos' },
    to: { x: 180, y: 120, component: 'fuse-box', pin: 'f1-in' },
    color: '#ef4444',
    colorName: 'Red',
    gauge: '8 AWG',
    circuit: 'Main Power',
    description: 'Battery positive to fuse box',
  },
  {
    id: 'w2',
    from: { x: 240, y: 120, component: 'fuse-box', pin: 'f1-out' },
    to: { x: 300, y: 170, component: 'controller', pin: 'b+' },
    color: '#ef4444',
    colorName: 'Red',
    gauge: '10 AWG',
    circuit: 'Controller Power',
    description: 'Fused power to controller B+',
  },
  {
    id: 'w3',
    from: { x: 130, y: 235, component: 'battery', pin: 'neg' },
    to: { x: 300, y: 380, component: 'ground-bus', pin: 'g1' },
    color: '#1f2937',
    colorName: 'Black',
    gauge: '8 AWG',
    circuit: 'Main Ground',
    description: 'Battery negative to ground bus',
  },
  {
    id: 'w4',
    from: { x: 300, y: 190, component: 'controller', pin: 'b-' },
    to: { x: 320, y: 380, component: 'ground-bus', pin: 'g1' },
    color: '#1f2937',
    colorName: 'Black',
    gauge: '12 AWG',
    circuit: 'Controller Ground',
    description: 'Controller B- to ground',
  },
  {
    id: 'w5',
    from: { x: 300, y: 210, component: 'controller', pin: 'start' },
    to: { x: 500, y: 95, component: 'starter', pin: 's' },
    color: '#a855f7',
    colorName: 'Purple',
    gauge: '14 AWG',
    circuit: 'Start Signal',
    description: 'Start output to starter solenoid',
  },
  {
    id: 'w6',
    from: { x: 300, y: 230, component: 'controller', pin: 'fuel' },
    to: { x: 500, y: 165, component: 'fuel-solenoid', pin: 'coil' },
    color: '#f97316',
    colorName: 'Orange',
    gauge: '14 AWG',
    circuit: 'Fuel Control',
    description: 'Fuel output to run solenoid',
  },
  {
    id: 'w7',
    from: { x: 420, y: 170, component: 'controller', pin: 'oil-p' },
    to: { x: 550, y: 235, component: 'oil-sensor', pin: 'sig' },
    color: '#92400e',
    colorName: 'Brown',
    gauge: '18 AWG',
    circuit: 'Oil Pressure',
    description: 'Oil pressure sensor signal',
  },
  {
    id: 'w8',
    from: { x: 420, y: 190, component: 'controller', pin: 'temp' },
    to: { x: 550, y: 295, component: 'temp-sensor', pin: 'sig' },
    color: '#3b82f6',
    colorName: 'Blue',
    gauge: '18 AWG',
    circuit: 'Temperature',
    description: 'Coolant temp sensor signal',
  },
  {
    id: 'w9',
    from: { x: 420, y: 210, component: 'controller', pin: 'speed' },
    to: { x: 550, y: 355, component: 'speed-sensor', pin: 'sig' },
    color: '#ec4899',
    colorName: 'Pink',
    gauge: '18 AWG',
    circuit: 'Speed Sensing',
    description: 'MPU speed sensor signal',
  },
];

// ==================== INTERACTIVE DIAGRAM VIEWER ====================
function InteractiveDiagram({
  components,
  wires,
  highlightedCircuit,
  onWireClick,
  onComponentClick,
}: {
  components: Component[];
  wires: WireConnection[];
  highlightedCircuit: string | null;
  onWireClick: (wire: WireConnection) => void;
  onComponentClick: (component: Component) => void;
}) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev * delta)));
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  const getComponentIcon = (type: Component['type']) => {
    const icons = {
      controller: '🖥️',
      sensor: '📡',
      relay: '🔲',
      actuator: '⚙️',
      connector: '🔌',
      fuse: '⚡',
      ground: '⏚',
      power: '🔋',
    };
    return icons[type] || '📦';
  };

  return (
    <div
      ref={containerRef}
      className="relative h-[500px] bg-slate-950 rounded-xl overflow-hidden cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setZoom(prev => Math.min(3, prev * 1.2))}
          className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white hover:bg-slate-700"
        >
          +
        </button>
        <div className="text-center text-xs text-slate-400">{Math.round(zoom * 100)}%</div>
        <button
          onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
          className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white hover:bg-slate-700"
        >
          -
        </button>
        <button
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="w-8 h-8 bg-slate-800 rounded flex items-center justify-center text-white hover:bg-slate-700 text-xs"
        >
          ⟲
        </button>
      </div>

      {/* Grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,116,139,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,116,139,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />

      {/* SVG Diagram */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
          </marker>
        </defs>

        {/* Wires */}
        {wires.map((wire) => {
          const isHighlighted = highlightedCircuit === wire.circuit || highlightedCircuit === null;
          const midX = (wire.from.x + wire.to.x) / 2;
          const midY = (wire.from.y + wire.to.y) / 2;

          return (
            <g key={wire.id}>
              {/* Wire path with curves */}
              <motion.path
                d={`M ${wire.from.x} ${wire.from.y}
                    C ${wire.from.x + 50} ${wire.from.y},
                      ${wire.to.x - 50} ${wire.to.y},
                      ${wire.to.x} ${wire.to.y}`}
                fill="none"
                stroke={wire.color}
                strokeWidth={isHighlighted ? 3 : 1.5}
                opacity={isHighlighted ? 1 : 0.3}
                className="cursor-pointer"
                onClick={() => onWireClick(wire)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, delay: 0.1 }}
              />
              {/* Wire label */}
              {isHighlighted && (
                <text
                  x={midX}
                  y={midY - 8}
                  fill={wire.color}
                  fontSize="10"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  {wire.gauge}
                </text>
              )}
            </g>
          );
        })}

        {/* Components */}
        {components.map((comp) => {
          const isHighlighted = highlightedCircuit === null ||
            wires.some(w =>
              (w.from.component === comp.id || w.to.component === comp.id) &&
              w.circuit === highlightedCircuit
            );

          return (
            <g
              key={comp.id}
              className="cursor-pointer"
              onClick={() => onComponentClick(comp)}
              opacity={isHighlighted ? 1 : 0.4}
            >
              {/* Component box */}
              <rect
                x={comp.x}
                y={comp.y}
                width={comp.width}
                height={comp.height}
                rx="5"
                fill="rgba(30,41,59,0.9)"
                stroke={isHighlighted ? '#06b6d4' : '#475569'}
                strokeWidth={isHighlighted ? 2 : 1}
              />
              {/* Component name */}
              <text
                x={comp.x + comp.width / 2}
                y={comp.y + comp.height / 2}
                fill="#fff"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {comp.name}
              </text>
              {/* Component type icon */}
              <text
                x={comp.x + 10}
                y={comp.y + 15}
                fontSize="12"
              >
                {getComponentIcon(comp.type)}
              </text>
              {/* Pins */}
              {comp.pins.map((pin) => (
                <g key={pin.id}>
                  <circle
                    cx={pin.x}
                    cy={pin.y}
                    r="4"
                    fill="#1e293b"
                    stroke="#06b6d4"
                    strokeWidth="1"
                  />
                  <text
                    x={pin.x}
                    y={pin.y - 8}
                    fill="#94a3b8"
                    fontSize="7"
                    textAnchor="middle"
                  >
                    {pin.name}
                  </text>
                </g>
              ))}
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 bg-slate-900/90 rounded-lg border border-slate-700">
        <div className="text-xs text-slate-400 mb-2">Wire Colors</div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(WIRE_COLORS).slice(0, 6).map(([key, { hex, name }]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-4 h-1 rounded" style={{ backgroundColor: hex }} />
              <span className="text-[10px] text-slate-400">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== COMPONENT DETAIL PANEL ====================
function ComponentDetail({ component, onClose }: { component: Component; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/30"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-cyan-400">{component.name}</h4>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Type:</span>
          <span className="text-white capitalize">{component.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Description:</span>
          <span className="text-white">{component.description}</span>
        </div>
        <div className="mt-3">
          <span className="text-slate-500 text-xs uppercase">Pin Configuration:</span>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {component.pins.map((pin) => (
              <div key={pin.id} className="px-2 py-1 bg-slate-800 rounded text-xs">
                <span className="text-cyan-400 font-mono">{pin.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== WIRE DETAIL PANEL ====================
function WireDetail({ wire, onClose }: { wire: WireConnection; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-4 bg-slate-900/90 rounded-xl border border-amber-500/30"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-2 rounded" style={{ backgroundColor: wire.color }} />
          <h4 className="text-lg font-bold text-amber-400">{wire.circuit}</h4>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Color:</span>
          <span className="text-white">{wire.colorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Gauge:</span>
          <span className="text-white font-mono">{wire.gauge}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">From:</span>
          <span className="text-cyan-400">{wire.from.component} ({wire.from.pin})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">To:</span>
          <span className="text-cyan-400">{wire.to.component} ({wire.to.pin})</span>
        </div>
        <div className="mt-3 p-2 bg-slate-800 rounded">
          <span className="text-slate-400 text-xs">{wire.description}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== WIRE COLOR REFERENCE ====================
function WireColorReference() {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
        <span>🎨</span> Wire Color Standards
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(WIRE_COLORS).map(([key, { hex, name, usage }]) => (
          <div key={key} className="p-2 bg-slate-800/50 rounded flex items-start gap-2">
            <div className="w-4 h-4 rounded mt-0.5 flex-shrink-0" style={{ backgroundColor: hex, border: key === 'black' ? '1px solid #475569' : 'none' }} />
            <div>
              <div className="text-xs font-medium text-white">{name}</div>
              <div className="text-[10px] text-slate-500">{usage}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== CIRCUIT FILTER ====================
function CircuitFilter({
  circuits,
  selected,
  onSelect,
}: {
  circuits: string[];
  selected: string | null;
  onSelect: (circuit: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1 rounded text-xs transition-all ${
          selected === null
            ? 'bg-cyan-500 text-white'
            : 'bg-slate-800 text-slate-400 hover:text-white'
        }`}
      >
        All Circuits
      </button>
      {circuits.map((circuit) => (
        <button
          key={circuit}
          onClick={() => onSelect(circuit)}
          className={`px-3 py-1 rounded text-xs transition-all ${
            selected === circuit
              ? 'bg-cyan-500 text-white'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {circuit}
        </button>
      ))}
    </div>
  );
}

// ==================== MAIN WIRING DIAGRAMS PANEL ====================
export default function WiringDiagramsPanel() {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>(DIAGRAM_TYPES[0]);
  const [highlightedCircuit, setHighlightedCircuit] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedWire, setSelectedWire] = useState<WireConnection | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const circuits = [...new Set(SAMPLE_WIRES.map((w) => w.circuit))];

  const filteredDiagrams = DIAGRAM_TYPES.filter(
    (d) => d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <p className="text-sm text-slate-500">Interactive electrical diagrams • Zoomable • Searchable</p>
          </div>
        </div>

        <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg">
          <span className="text-xs text-blue-400 uppercase tracking-wider">DSE • ComAp • Woodward</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Diagram Selection */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diagrams..."
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>

          {/* Diagram List */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {['wiring', 'schematic', 'location', 'pinout'].map((category) => (
              <div key={category}>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider px-2 py-1">
                  {category === 'wiring' && '📄 Wiring Diagrams'}
                  {category === 'schematic' && '📊 Schematics'}
                  {category === 'location' && '📍 Locations'}
                  {category === 'pinout' && '🔌 Pinouts'}
                </div>
                {filteredDiagrams
                  .filter((d) => d.category === category)
                  .map((diagram) => (
                    <motion.button
                      key={diagram.id}
                      onClick={() => setSelectedDiagram(diagram)}
                      whileHover={{ scale: 1.02 }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-all flex items-center gap-2 ${
                        selectedDiagram.id === diagram.id
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                          : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <span>{diagram.icon}</span>
                      <span>{diagram.name}</span>
                    </motion.button>
                  ))}
              </div>
            ))}
          </div>

          {/* Wire Color Reference */}
          <WireColorReference />
        </div>

        {/* Center - Diagram Viewer */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          {/* Diagram Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedDiagram.icon}</span>
              <h3 className="text-lg font-bold text-white">{selectedDiagram.name}</h3>
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

          {/* Circuit Filter */}
          <CircuitFilter
            circuits={circuits}
            selected={highlightedCircuit}
            onSelect={setHighlightedCircuit}
          />

          {/* Interactive Diagram */}
          <InteractiveDiagram
            components={SAMPLE_COMPONENTS}
            wires={SAMPLE_WIRES}
            highlightedCircuit={highlightedCircuit}
            onWireClick={(wire) => { setSelectedWire(wire); setSelectedComponent(null); }}
            onComponentClick={(comp) => { setSelectedComponent(comp); setSelectedWire(null); }}
          />

          {/* Instructions */}
          <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 text-xs text-slate-400">
            <span className="text-cyan-400">💡 Tip:</span> Scroll to zoom • Drag to pan • Click components or wires for details • Use filters to highlight specific circuits
          </div>
        </div>

        {/* Right - Details Panel */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <AnimatePresence mode="wait">
            {selectedComponent && (
              <ComponentDetail
                key="component"
                component={selectedComponent}
                onClose={() => setSelectedComponent(null)}
              />
            )}
            {selectedWire && (
              <WireDetail
                key="wire"
                wire={selectedWire}
                onClose={() => setSelectedWire(null)}
              />
            )}
          </AnimatePresence>

          {!selectedComponent && !selectedWire && (
            <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
              <div className="text-4xl mb-2">👆</div>
              <div className="text-sm text-slate-400">Click a component or wire to see details</div>
            </div>
          )}

          {/* Quick Reference */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h4 className="text-sm font-bold text-white mb-3">Quick Reference</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-cyan-500/20 border border-cyan-500/50" />
                <span className="text-slate-400">Controller</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/50" />
                <span className="text-slate-400">Sensor</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500/50" />
                <span className="text-slate-400">Actuator</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/50" />
                <span className="text-slate-400">Power/Fuse</span>
              </div>
            </div>
          </div>

          {/* Related Faults */}
          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/30">
            <h4 className="text-sm font-bold text-amber-400 mb-2">Related Fault Codes</h4>
            <div className="space-y-1">
              {['E1234 - Low Oil Pressure', 'W2045 - High Temp Warning', 'E3456 - Speed Sensor'].map((fault) => (
                <div key={fault} className="text-xs text-slate-400 hover:text-white cursor-pointer">
                  {fault}
                </div>
              ))}
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
              <div className="text-sm font-bold text-white">Complete Electrical Documentation</div>
              <div className="text-xs text-slate-400">Interactive diagrams for DSE, ComAp, Woodward, SmartGen controllers</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="px-2 py-1 bg-slate-800/50 rounded text-[10px] text-slate-400">Zoomable</span>
            <span className="px-2 py-1 bg-slate-800/50 rounded text-[10px] text-slate-400">Searchable</span>
            <span className="px-2 py-1 bg-slate-800/50 rounded text-[10px] text-slate-400">Printable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
