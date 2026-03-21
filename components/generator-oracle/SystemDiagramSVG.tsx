'use client';

/**
 * Interactive SVG System Diagrams for Generator Oracle
 * Visual schematics with clickable components
 */

import { motion } from 'framer-motion';

interface DiagramProps {
  onComponentClick: (componentId: string) => void;
  selectedComponent?: string;
  highlightColor?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FUEL SYSTEM DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

export function FuelSystemDiagram({ onComponentClick, selectedComponent, highlightColor = '#f59e0b' }: DiagramProps) {
  const isSelected = (id: string) => selectedComponent === id;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <defs>
        <linearGradient id="fuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0.6" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
        </marker>
      </defs>

      {/* Background */}
      <rect x="0" y="0" width="800" height="400" fill="#0f172a" rx="8" />

      {/* Flow arrows */}
      <path d="M 120 200 L 180 200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M 260 200 L 320 200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M 400 200 L 460 200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M 540 200 L 600 200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
      </path>
      <path d="M 680 200 L 740 200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#arrowhead)" strokeDasharray="5,5">
        <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Return line */}
      <path d="M 680 240 L 680 320 L 80 320 L 80 240" stroke="#64748b" strokeWidth="2" fill="none" strokeDasharray="8,4" />
      <text x="380" y="340" fill="#64748b" fontSize="12" textAnchor="middle">Return to Tank</text>

      {/* Fuel Tank */}
      <motion.g
        onClick={() => onComponentClick('fuel-tank')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('fuel-tank') ? 'url(#glow)' : undefined}
      >
        <rect x="40" y="150" width="80" height="100" rx="8" fill={isSelected('fuel-tank') ? highlightColor : '#1e293b'} stroke={isSelected('fuel-tank') ? highlightColor : '#475569'} strokeWidth="2" />
        <rect x="50" y="170" width="60" height="50" fill="url(#fuelGradient)" rx="4" />
        <text x="80" y="250" fill="#94a3b8" fontSize="11" textAnchor="middle">Fuel Tank</text>
        <circle cx="105" cy="160" r="6" fill="#22c55e" />
      </motion.g>

      {/* Primary Filter */}
      <motion.g
        onClick={() => onComponentClick('primary-filter')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('primary-filter') ? 'url(#glow)' : undefined}
      >
        <rect x="180" y="160" width="70" height="80" rx="6" fill={isSelected('primary-filter') ? highlightColor : '#1e293b'} stroke={isSelected('primary-filter') ? highlightColor : '#475569'} strokeWidth="2" />
        <rect x="195" y="175" width="40" height="50" fill="#334155" rx="4" />
        <line x1="195" y1="190" x2="235" y2="190" stroke="#64748b" strokeWidth="1" />
        <line x1="195" y1="205" x2="235" y2="205" stroke="#64748b" strokeWidth="1" />
        <circle cx="215" y="235" r="8" fill="#3b82f6" />
        <text x="215" y="260" fill="#94a3b8" fontSize="10" textAnchor="middle">Primary</text>
        <text x="215" y="272" fill="#94a3b8" fontSize="10" textAnchor="middle">Filter</text>
      </motion.g>

      {/* Lift Pump */}
      <motion.g
        onClick={() => onComponentClick('lift-pump')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('lift-pump') ? 'url(#glow)' : undefined}
      >
        <circle cx="355" cy="200" r="35" fill={isSelected('lift-pump') ? highlightColor : '#1e293b'} stroke={isSelected('lift-pump') ? highlightColor : '#475569'} strokeWidth="2" />
        <circle cx="355" cy="200" r="20" fill="#334155" />
        <path d="M 345 190 L 365 200 L 345 210 Z" fill="#f59e0b" />
        <text x="355" y="255" fill="#94a3b8" fontSize="10" textAnchor="middle">Lift Pump</text>
      </motion.g>

      {/* Secondary Filter */}
      <motion.g
        onClick={() => onComponentClick('secondary-filter')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('secondary-filter') ? 'url(#glow)' : undefined}
      >
        <rect x="460" y="165" width="60" height="70" rx="6" fill={isSelected('secondary-filter') ? highlightColor : '#1e293b'} stroke={isSelected('secondary-filter') ? highlightColor : '#475569'} strokeWidth="2" />
        <rect x="472" y="178" width="36" height="44" fill="#334155" rx="4" />
        <line x1="472" y1="190" x2="508" y2="190" stroke="#64748b" strokeWidth="1" />
        <line x1="472" y1="200" x2="508" y2="200" stroke="#64748b" strokeWidth="1" />
        <line x1="472" y1="210" x2="508" y2="210" stroke="#64748b" strokeWidth="1" />
        <text x="490" y="255" fill="#94a3b8" fontSize="10" textAnchor="middle">Secondary</text>
        <text x="490" y="267" fill="#94a3b8" fontSize="10" textAnchor="middle">Filter</text>
      </motion.g>

      {/* Injection Pump */}
      <motion.g
        onClick={() => onComponentClick('injection-pump')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('injection-pump') ? 'url(#glow)' : undefined}
      >
        <rect x="600" y="150" width="80" height="100" rx="8" fill={isSelected('injection-pump') ? highlightColor : '#1e293b'} stroke={isSelected('injection-pump') ? highlightColor : '#475569'} strokeWidth="2" />
        <circle cx="640" cy="190" r="25" fill="#334155" />
        <circle cx="640" cy="190" r="15" fill="#475569" />
        <rect x="620" y="220" width="40" height="15" fill="#334155" rx="2" />
        <text x="640" y="270" fill="#94a3b8" fontSize="10" textAnchor="middle">Injection</text>
        <text x="640" y="282" fill="#94a3b8" fontSize="10" textAnchor="middle">Pump</text>
      </motion.g>

      {/* Injectors */}
      <motion.g
        onClick={() => onComponentClick('injectors')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('injectors') ? 'url(#glow)' : undefined}
      >
        <rect x="720" y="130" width="60" height="140" rx="6" fill={isSelected('injectors') ? highlightColor : '#1e293b'} stroke={isSelected('injectors') ? highlightColor : '#475569'} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="730" y={145 + i * 30} width="40" height="20" fill="#334155" rx="2" />
            <circle cx="735" cy={155 + i * 30} r="3" fill="#f59e0b" />
          </g>
        ))}
        <text x="750" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">Injectors</text>
      </motion.g>

      {/* Title */}
      <text x="400" y="30" fill="#f8fafc" fontSize="18" fontWeight="bold" textAnchor="middle">Fuel System Flow Diagram</text>
      <text x="400" y="50" fill="#64748b" fontSize="12" textAnchor="middle">Click any component for detailed diagnostics</text>

      {/* Legend */}
      <g transform="translate(30, 360)">
        <circle cx="10" cy="0" r="6" fill="#22c55e" />
        <text x="25" y="4" fill="#94a3b8" fontSize="10">Normal</text>
        <circle cx="100" cy="0" r="6" fill="#f59e0b" />
        <text x="115" y="4" fill="#94a3b8" fontSize="10">Warning</text>
        <circle cx="190" cy="0" r="6" fill="#ef4444" />
        <text x="205" y="4" fill="#94a3b8" fontSize="10">Critical</text>
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STARTING SYSTEM DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

export function StartingSystemDiagram({ onComponentClick, selectedComponent, highlightColor = '#22c55e' }: DiagramProps) {
  const isSelected = (id: string) => selectedComponent === id;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <defs>
        <linearGradient id="electricGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <filter id="glowGreen">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <rect x="0" y="0" width="800" height="400" fill="#0f172a" rx="8" />

      {/* Electrical flow lines */}
      <path d="M 160 200 L 280 200" stroke="#22c55e" strokeWidth="3" strokeDasharray="10,5">
        <animate attributeName="stroke-dashoffset" from="15" to="0" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M 360 200 L 480 200" stroke="#22c55e" strokeWidth="3" strokeDasharray="10,5">
        <animate attributeName="stroke-dashoffset" from="15" to="0" dur="0.5s" repeatCount="indefinite" />
      </path>
      <path d="M 560 200 L 650 200" stroke="#22c55e" strokeWidth="3" strokeDasharray="10,5">
        <animate attributeName="stroke-dashoffset" from="15" to="0" dur="0.5s" repeatCount="indefinite" />
      </path>

      {/* Ground line */}
      <path d="M 120 280 L 120 350 L 700 350 L 700 280" stroke="#64748b" strokeWidth="2" />
      <text x="400" y="370" fill="#64748b" fontSize="12" textAnchor="middle">Chassis Ground</text>

      {/* Battery Bank */}
      <motion.g
        onClick={() => onComponentClick('starter-battery')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('starter-battery') ? 'url(#glowGreen)' : undefined}
      >
        <rect x="40" y="140" width="120" height="120" rx="8" fill={isSelected('starter-battery') ? highlightColor : '#1e293b'} stroke={isSelected('starter-battery') ? highlightColor : '#475569'} strokeWidth="2" />
        {/* Battery cells */}
        <rect x="55" y="160" width="40" height="60" fill="#334155" stroke="#475569" rx="2" />
        <rect x="105" y="160" width="40" height="60" fill="#334155" stroke="#475569" rx="2" />
        <rect x="55" y="230" width="40" height="20" fill="#ef4444" rx="2" />
        <text x="75" y="244" fill="white" fontSize="8" textAnchor="middle">+</text>
        <rect x="105" y="230" width="40" height="20" fill="#1e293b" stroke="#475569" rx="2" />
        <text x="125" y="244" fill="#94a3b8" fontSize="8" textAnchor="middle">-</text>
        <text x="100" y="285" fill="#94a3b8" fontSize="11" textAnchor="middle">Battery Bank</text>
        <text x="100" y="300" fill="#22c55e" fontSize="10" textAnchor="middle">24V 200Ah</text>
      </motion.g>

      {/* Starter Relay */}
      <motion.g
        onClick={() => onComponentClick('starter-relay')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('starter-relay') ? 'url(#glowGreen)' : undefined}
      >
        <rect x="280" y="160" width="80" height="80" rx="8" fill={isSelected('starter-relay') ? highlightColor : '#1e293b'} stroke={isSelected('starter-relay') ? highlightColor : '#475569'} strokeWidth="2" />
        <rect x="295" y="175" width="50" height="30" fill="#334155" rx="4" />
        <circle cx="305" cy="220" r="8" fill="#475569" />
        <circle cx="335" cy="220" r="8" fill="#475569" />
        <line x1="305" y1="190" x2="335" y2="190" stroke="#22c55e" strokeWidth="2" />
        <text x="320" y="260" fill="#94a3b8" fontSize="10" textAnchor="middle">Starter</text>
        <text x="320" y="272" fill="#94a3b8" fontSize="10" textAnchor="middle">Relay</text>
      </motion.g>

      {/* Starter Motor */}
      <motion.g
        onClick={() => onComponentClick('starter-motor')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('starter-motor') ? 'url(#glowGreen)' : undefined}
      >
        <rect x="480" y="130" width="100" height="140" rx="8" fill={isSelected('starter-motor') ? highlightColor : '#1e293b'} stroke={isSelected('starter-motor') ? highlightColor : '#475569'} strokeWidth="2" />
        <circle cx="530" cy="190" r="40" fill="#334155" />
        <circle cx="530" cy="190" r="25" fill="#475569" />
        <path d="M 515 175 L 545 190 L 515 205 Z" fill="#22c55e">
          <animateTransform attributeName="transform" type="rotate" from="0 530 190" to="360 530 190" dur="2s" repeatCount="indefinite" />
        </path>
        <rect x="570" y="170" width="15" height="40" fill="#334155" rx="2" />
        <text x="530" y="255" fill="#94a3b8" fontSize="11" textAnchor="middle">Starter Motor</text>
        <text x="530" y="270" fill="#22c55e" fontSize="10" textAnchor="middle">5.5 kW</text>
      </motion.g>

      {/* Ring Gear/Flywheel */}
      <motion.g
        onClick={() => onComponentClick('starter-motor')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
      >
        <circle cx="680" cy="200" r="60" fill="none" stroke="#475569" strokeWidth="3" />
        <circle cx="680" cy="200" r="50" fill="#1e293b" stroke="#334155" strokeWidth="2" />
        <circle cx="680" cy="200" r="20" fill="#334155" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <line
            key={angle}
            x1={680 + 45 * Math.cos(angle * Math.PI / 180)}
            y1={200 + 45 * Math.sin(angle * Math.PI / 180)}
            x2={680 + 55 * Math.cos(angle * Math.PI / 180)}
            y2={200 + 55 * Math.sin(angle * Math.PI / 180)}
            stroke="#475569"
            strokeWidth="4"
          />
        ))}
        <text x="680" y="285" fill="#94a3b8" fontSize="11" textAnchor="middle">Ring Gear</text>
      </motion.g>

      {/* Glow Plugs */}
      <motion.g
        onClick={() => onComponentClick('glow-plugs')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('glow-plugs') ? 'url(#glowGreen)' : undefined}
      >
        <rect x="320" y="40" width="160" height="70" rx="8" fill={isSelected('glow-plugs') ? highlightColor : '#1e293b'} stroke={isSelected('glow-plugs') ? highlightColor : '#475569'} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={340 + i * 35} y="55" width="20" height="40" fill="#334155" rx="2" />
            <circle cx={350 + i * 35} cy="60" r="5" fill="#f97316">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        <text x="400" y="130" fill="#94a3b8" fontSize="11" textAnchor="middle">Glow Plug System</text>
      </motion.g>

      {/* Control signal from controller */}
      <path d="M 320 100 L 280 100 L 280 160" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" />
      <text x="240" y="130" fill="#3b82f6" fontSize="10" textAnchor="middle">Control</text>
      <text x="240" y="142" fill="#3b82f6" fontSize="10" textAnchor="middle">Signal</text>

      {/* Title */}
      <text x="400" y="30" fill="#f8fafc" fontSize="18" fontWeight="bold" textAnchor="middle">Starting System Diagram</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// AIR INTAKE & TURBO DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

export function AirIntakeDiagram({ onComponentClick, selectedComponent, highlightColor = '#06b6d4' }: DiagramProps) {
  const isSelected = (id: string) => selectedComponent === id;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <defs>
        <linearGradient id="airGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0891b2" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="800" height="400" fill="#0f172a" rx="8" />

      {/* Air flow path */}
      <path d="M 100 200 Q 200 200 250 180 L 350 180 Q 400 180 420 160 L 500 160 Q 550 160 580 180 L 700 180"
            stroke="#06b6d4" strokeWidth="30" fill="none" opacity="0.2">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Air Filter */}
      <motion.g
        onClick={() => onComponentClick('air-filter')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('air-filter') ? 'url(#glow)' : undefined}
      >
        <rect x="40" y="140" width="100" height="120" rx="8" fill={isSelected('air-filter') ? highlightColor : '#1e293b'} stroke={isSelected('air-filter') ? highlightColor : '#475569'} strokeWidth="2" />
        <ellipse cx="90" cy="200" rx="35" ry="45" fill="#334155" />
        <ellipse cx="90" cy="200" rx="25" ry="35" fill="url(#airGradient)" />
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1="65" y1={165 + i * 18} x2="115" y2={165 + i * 18} stroke="#475569" strokeWidth="1" />
        ))}
        <text x="90" y="280" fill="#94a3b8" fontSize="11" textAnchor="middle">Air Filter</text>
      </motion.g>

      {/* Turbocharger */}
      <motion.g
        onClick={() => onComponentClick('turbocharger')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('turbocharger') ? 'url(#glow)' : undefined}
      >
        <rect x="200" y="120" width="150" height="160" rx="8" fill={isSelected('turbocharger') ? highlightColor : '#1e293b'} stroke={isSelected('turbocharger') ? highlightColor : '#475569'} strokeWidth="2" />
        {/* Compressor side */}
        <circle cx="250" cy="180" r="35" fill="#334155" />
        <g>
          <path d="M 235 165 L 265 180 L 235 195 Z" fill="#06b6d4">
            <animateTransform attributeName="transform" type="rotate" from="0 250 180" to="360 250 180" dur="0.5s" repeatCount="indefinite" />
          </path>
        </g>
        <text x="250" y="230" fill="#06b6d4" fontSize="9" textAnchor="middle">Compressor</text>

        {/* Turbine side */}
        <circle cx="300" cy="180" r="35" fill="#334155" />
        <g>
          <path d="M 285 165 L 315 180 L 285 195 Z" fill="#ef4444">
            <animateTransform attributeName="transform" type="rotate" from="0 300 180" to="360 300 180" dur="0.5s" repeatCount="indefinite" />
          </path>
        </g>
        <text x="300" y="230" fill="#ef4444" fontSize="9" textAnchor="middle">Turbine</text>

        {/* Shaft */}
        <rect x="265" y="175" width="20" height="10" fill="#475569" />

        <text x="275" y="295" fill="#94a3b8" fontSize="11" textAnchor="middle">Turbocharger</text>
      </motion.g>

      {/* Intercooler */}
      <motion.g
        onClick={() => onComponentClick('intercooler')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('intercooler') ? 'url(#glow)' : undefined}
      >
        <rect x="420" y="130" width="120" height="100" rx="8" fill={isSelected('intercooler') ? highlightColor : '#1e293b'} stroke={isSelected('intercooler') ? highlightColor : '#475569'} strokeWidth="2" />
        {/* Cooling fins */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <rect key={i} x={430 + i * 11} y="145" width="8" height="70" fill="#334155" rx="1" />
        ))}
        <text x="480" y="250" fill="#94a3b8" fontSize="11" textAnchor="middle">Intercooler</text>
        <text x="480" y="265" fill="#06b6d4" fontSize="10" textAnchor="middle">-60°C</text>
      </motion.g>

      {/* Intake Manifold */}
      <motion.g
        onClick={() => onComponentClick('turbocharger')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
      >
        <rect x="600" y="130" width="80" height="140" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="615" y={145 + i * 30} width="50" height="20" fill="#334155" rx="4" />
        ))}
        <text x="640" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">Intake</text>
        <text x="640" y="302" fill="#94a3b8" fontSize="10" textAnchor="middle">Manifold</text>
      </motion.g>

      {/* Wastegate */}
      <motion.g
        onClick={() => onComponentClick('wastegate')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('wastegate') ? 'url(#glow)' : undefined}
      >
        <circle cx="275" cy="320" r="30" fill={isSelected('wastegate') ? highlightColor : '#1e293b'} stroke={isSelected('wastegate') ? highlightColor : '#475569'} strokeWidth="2" />
        <path d="M 260 305 L 290 320 L 260 335 Z" fill="#f59e0b" />
        <text x="275" y="365" fill="#94a3b8" fontSize="10" textAnchor="middle">Wastegate</text>
      </motion.g>

      {/* Exhaust flow to turbine */}
      <path d="M 350 320 L 300 250" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" />
      <text x="380" y="330" fill="#ef4444" fontSize="10">Exhaust</text>

      {/* Boost pressure indicator */}
      <rect x="700" y="150" width="80" height="50" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="1" />
      <text x="740" y="170" fill="#06b6d4" fontSize="10" textAnchor="middle">Boost</text>
      <text x="740" y="188" fill="#22c55e" fontSize="14" fontWeight="bold" textAnchor="middle">1.8 bar</text>

      {/* Title */}
      <text x="400" y="30" fill="#f8fafc" fontSize="18" fontWeight="bold" textAnchor="middle">Air Intake & Turbo System</text>
      <text x="400" y="50" fill="#64748b" fontSize="12" textAnchor="middle">Ambient Air → Filter → Turbo → Intercooler → Engine</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXHAUST SYSTEM DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

export function ExhaustSystemDiagram({ onComponentClick, selectedComponent, highlightColor = '#ef4444' }: DiagramProps) {
  const isSelected = (id: string) => selectedComponent === id;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <rect x="0" y="0" width="800" height="400" fill="#0f172a" rx="8" />

      {/* Exhaust flow */}
      <path d="M 120 200 L 780 200" stroke="#ef4444" strokeWidth="20" fill="none" opacity="0.15" />

      {/* Exhaust Manifold */}
      <motion.g
        onClick={() => onComponentClick('exhaust-manifold')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('exhaust-manifold') ? 'url(#glow)' : undefined}
      >
        <rect x="40" y="130" width="100" height="140" rx="8" fill={isSelected('exhaust-manifold') ? highlightColor : '#1e293b'} stroke={isSelected('exhaust-manifold') ? highlightColor : '#475569'} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="50" y={145 + i * 30} width="30" height="20" fill="#334155" rx="2" />
            <path d={`M 80 ${155 + i * 30} Q 100 ${155 + i * 30} 115 200`} stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.5" />
          </g>
        ))}
        <text x="90" y="290" fill="#94a3b8" fontSize="10" textAnchor="middle">Exhaust</text>
        <text x="90" y="302" fill="#94a3b8" fontSize="10" textAnchor="middle">Manifold</text>
        <text x="90" y="320" fill="#ef4444" fontSize="9" textAnchor="middle">650°C</text>
      </motion.g>

      {/* Turbo (simplified) */}
      <circle cx="200" cy="200" r="40" fill="#1e293b" stroke="#475569" strokeWidth="2" />
      <circle cx="200" cy="200" r="25" fill="#334155" />
      <text x="200" y="260" fill="#64748b" fontSize="10" textAnchor="middle">Turbo</text>

      {/* DPF */}
      <motion.g
        onClick={() => onComponentClick('dpf')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('dpf') ? 'url(#glow)' : undefined}
      >
        <rect x="300" y="140" width="140" height="120" rx="8" fill={isSelected('dpf') ? highlightColor : '#1e293b'} stroke={isSelected('dpf') ? highlightColor : '#475569'} strokeWidth="2" />
        {/* Honeycomb pattern */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          [0, 1, 2, 3, 4].map((j) => (
            <rect key={`${i}-${j}`} x={315 + i * 18} y={155 + j * 18} width="12" height="12" fill="#334155" rx="1" />
          ))
        ))}
        <text x="370" y="280" fill="#94a3b8" fontSize="11" textAnchor="middle">DPF</text>
        <rect x="310" y="290" width="120" height="20" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" />
        <rect x="312" y="292" width="70" height="16" rx="2" fill="#f59e0b" opacity="0.7" />
        <text x="370" y="304" fill="#1e293b" fontSize="8" textAnchor="middle">Soot: 65%</text>
      </motion.g>

      {/* SCR */}
      <motion.g
        onClick={() => onComponentClick('scr')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('scr') ? 'url(#glow)' : undefined}
      >
        <rect x="500" y="140" width="120" height="120" rx="8" fill={isSelected('scr') ? highlightColor : '#1e293b'} stroke={isSelected('scr') ? highlightColor : '#475569'} strokeWidth="2" />
        {/* Catalyst structure */}
        <rect x="515" y="155" width="90" height="60" fill="#334155" rx="4" />
        {[0, 1, 2].map((i) => (
          <line key={i} x1="520" y1={170 + i * 15} x2="600" y2={170 + i * 15} stroke="#06b6d4" strokeWidth="2" />
        ))}
        {/* DEF injector */}
        <rect x="540" y="125" width="40" height="20" fill="#3b82f6" rx="2" />
        <text x="560" y="138" fill="white" fontSize="8" textAnchor="middle">DEF</text>
        <text x="560" y="235" fill="#94a3b8" fontSize="11" textAnchor="middle">SCR Catalyst</text>
        <text x="560" y="250" fill="#22c55e" fontSize="10" textAnchor="middle">NOx: -92%</text>
      </motion.g>

      {/* Silencer */}
      <motion.g
        onClick={() => onComponentClick('silencer')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('silencer') ? 'url(#glow)' : undefined}
      >
        <ellipse cx="700" cy="200" rx="50" ry="60" fill={isSelected('silencer') ? highlightColor : '#1e293b'} stroke={isSelected('silencer') ? highlightColor : '#475569'} strokeWidth="2" />
        <ellipse cx="700" cy="200" rx="35" ry="45" fill="#334155" />
        <rect x="745" y="185" width="35" height="30" fill="#1e293b" stroke="#475569" strokeWidth="2" rx="2" />
        <text x="700" y="280" fill="#94a3b8" fontSize="10" textAnchor="middle">Silencer</text>
        <text x="700" y="295" fill="#22c55e" fontSize="9" textAnchor="middle">-30 dB</text>
      </motion.g>

      {/* Flow arrows */}
      <path d="M 145 200 L 155 200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 245 200 L 295 200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 445 200 L 495 200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />
      <path d="M 625 200 L 645 200" stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Temperature indicators */}
      <g transform="translate(200, 320)">
        <text x="0" y="0" fill="#64748b" fontSize="10">Temperature Profile:</text>
        <text x="80" y="0" fill="#ef4444" fontSize="10">650°C</text>
        <text x="130" y="0" fill="#f59e0b" fontSize="10">→ 550°C</text>
        <text x="200" y="0" fill="#22c55e" fontSize="10">→ 350°C</text>
        <text x="270" y="0" fill="#06b6d4" fontSize="10">→ 200°C</text>
      </g>

      {/* Title */}
      <text x="400" y="30" fill="#f8fafc" fontSize="18" fontWeight="bold" textAnchor="middle">Exhaust & Aftertreatment System</text>
      <text x="400" y="50" fill="#64748b" fontSize="12" textAnchor="middle">Manifold → Turbo → DPF → SCR → Silencer → Atmosphere</text>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ECM SYSTEM DIAGRAM
// ═══════════════════════════════════════════════════════════════════════════════

export function ECMSystemDiagram({ onComponentClick, selectedComponent, highlightColor = '#a855f7' }: DiagramProps) {
  const isSelected = (id: string) => selectedComponent === id;

  return (
    <svg viewBox="0 0 800 400" className="w-full h-auto">
      <rect x="0" y="0" width="800" height="400" fill="#0f172a" rx="8" />

      {/* Central ECM */}
      <motion.g
        onClick={() => onComponentClick('ecm-module')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
        filter={isSelected('ecm-module') ? 'url(#glow)' : undefined}
      >
        <rect x="300" y="130" width="200" height="140" rx="12" fill={isSelected('ecm-module') ? highlightColor : '#1e293b'} stroke={isSelected('ecm-module') ? highlightColor : '#a855f7'} strokeWidth="3" />
        <rect x="320" y="150" width="160" height="80" fill="#0f172a" rx="4" />
        <text x="400" y="180" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">ENGINE CONTROL</text>
        <text x="400" y="198" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">MODULE (ECM)</text>
        <text x="400" y="220" fill="#64748b" fontSize="10" textAnchor="middle">Cummins CM2250</text>
        {/* Processing indicator */}
        <rect x="340" y="240" width="120" height="15" rx="4" fill="#0f172a" />
        <rect x="342" y="242" width="80" height="11" rx="2" fill="#22c55e">
          <animate attributeName="width" values="20;80;20" dur="2s" repeatCount="indefinite" />
        </rect>
        <text x="400" y="285" fill="#94a3b8" fontSize="10" textAnchor="middle">Processing...</text>
      </motion.g>

      {/* Sensors (left side) */}
      <motion.g
        onClick={() => onComponentClick('sensors')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('sensors') ? 'url(#glow)' : undefined}
      >
        <rect x="40" y="100" width="180" height="200" rx="8" fill={isSelected('sensors') ? highlightColor : '#1e293b'} stroke={isSelected('sensors') ? highlightColor : '#475569'} strokeWidth="2" />
        <text x="130" y="125" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">SENSOR INPUTS</text>

        {[
          { name: 'Oil Pressure', value: '4.2 bar', color: '#22c55e' },
          { name: 'Coolant Temp', value: '85°C', color: '#22c55e' },
          { name: 'Rail Pressure', value: '1850 bar', color: '#22c55e' },
          { name: 'Boost', value: '1.8 bar', color: '#22c55e' },
          { name: 'Cam Position', value: 'OK', color: '#22c55e' },
          { name: 'Crank Speed', value: '1500 RPM', color: '#22c55e' },
        ].map((sensor, i) => (
          <g key={i}>
            <rect x="55" y={140 + i * 25} width="150" height="20" fill="#0f172a" rx="2" />
            <text x="65" y={154 + i * 25} fill="#94a3b8" fontSize="9">{sensor.name}</text>
            <text x="195" y={154 + i * 25} fill={sensor.color} fontSize="9" textAnchor="end">{sensor.value}</text>
          </g>
        ))}
      </motion.g>

      {/* Injectors (right side) */}
      <motion.g
        onClick={() => onComponentClick('injectors')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.05 }}
        filter={isSelected('injectors') ? 'url(#glow)' : undefined}
      >
        <rect x="580" y="100" width="180" height="200" rx="8" fill={isSelected('injectors') ? highlightColor : '#1e293b'} stroke={isSelected('injectors') ? highlightColor : '#475569'} strokeWidth="2" />
        <text x="670" y="125" fill="#a855f7" fontSize="12" fontWeight="bold" textAnchor="middle">ACTUATOR OUTPUTS</text>

        {[
          { name: 'Injector 1', value: 'FIRING', color: '#f59e0b' },
          { name: 'Injector 2', value: 'READY', color: '#22c55e' },
          { name: 'Injector 3', value: 'READY', color: '#22c55e' },
          { name: 'Injector 4', value: 'READY', color: '#22c55e' },
          { name: 'Injector 5', value: 'READY', color: '#22c55e' },
          { name: 'Injector 6', value: 'READY', color: '#22c55e' },
        ].map((inj, i) => (
          <g key={i}>
            <rect x="595" y={140 + i * 25} width="150" height="20" fill="#0f172a" rx="2" />
            <text x="605" y={154 + i * 25} fill="#94a3b8" fontSize="9">{inj.name}</text>
            <circle cx="745" cy={150 + i * 25} r="5" fill={inj.color}>
              {inj.value === 'FIRING' && <animate attributeName="opacity" values="1;0.3;1" dur="0.2s" repeatCount="indefinite" />}
            </circle>
          </g>
        ))}
      </motion.g>

      {/* CAN Bus */}
      <motion.g
        onClick={() => onComponentClick('canbus')}
        style={{ cursor: 'pointer' }}
        whileHover={{ scale: 1.02 }}
        filter={isSelected('canbus') ? 'url(#glow)' : undefined}
      >
        <rect x="280" y="320" width="240" height="60" rx="8" fill={isSelected('canbus') ? highlightColor : '#1e293b'} stroke={isSelected('canbus') ? highlightColor : '#22c55e'} strokeWidth="2" />
        <text x="400" y="345" fill="#22c55e" fontSize="12" fontWeight="bold" textAnchor="middle">J1939 CAN BUS</text>
        <text x="400" y="365" fill="#64748b" fontSize="10" textAnchor="middle">250 kbps • Node Address: 0x00</text>

        {/* Data flowing */}
        <rect x="295" y="355" width="8" height="8" fill="#22c55e" rx="1">
          <animate attributeName="x" values="295;495;295" dur="1s" repeatCount="indefinite" />
        </rect>
      </motion.g>

      {/* Connection lines */}
      <path d="M 220 200 L 300 200" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 500 200 L 580 200" stroke="#a855f7" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M 400 270 L 400 320" stroke="#22c55e" strokeWidth="2" />

      {/* Controller connection */}
      <rect x="550" y="340" width="100" height="30" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" rx="4" />
      <text x="600" y="360" fill="#3b82f6" fontSize="10" textAnchor="middle">Controller</text>
      <path d="M 520 355 L 550 355" stroke="#22c55e" strokeWidth="2" />

      {/* Diagnostic port */}
      <rect x="150" y="340" width="100" height="30" fill="#1e293b" stroke="#f59e0b" strokeWidth="1" rx="4" />
      <text x="200" y="360" fill="#f59e0b" fontSize="10" textAnchor="middle">Service Tool</text>
      <path d="M 250 355 L 280 355" stroke="#22c55e" strokeWidth="2" />

      {/* Title */}
      <text x="400" y="30" fill="#f8fafc" fontSize="18" fontWeight="bold" textAnchor="middle">ECM & Electronics Architecture</text>
      <text x="400" y="50" fill="#64748b" fontSize="12" textAnchor="middle">Sensors → ECM Processing → Actuators • J1939 Communication</text>

      {/* Fault code indicator */}
      <rect x="680" y="40" width="100" height="40" rx="4" fill="#1e293b" stroke="#22c55e" strokeWidth="1" />
      <text x="730" y="55" fill="#22c55e" fontSize="10" textAnchor="middle">Active Faults</text>
      <text x="730" y="72" fill="#22c55e" fontSize="16" fontWeight="bold" textAnchor="middle">0</text>
    </svg>
  );
}

// Export all diagrams
export const SYSTEM_DIAGRAMS: Record<string, React.FC<DiagramProps>> = {
  'fuel': FuelSystemDiagram,
  'starting': StartingSystemDiagram,
  'airintake': AirIntakeDiagram,
  'exhaust': ExhaustSystemDiagram,
  'ecm': ECMSystemDiagram,
};

export default SYSTEM_DIAGRAMS;
