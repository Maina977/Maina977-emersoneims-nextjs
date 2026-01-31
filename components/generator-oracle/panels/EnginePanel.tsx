'use client';

/**
 * Engine Control Panel - Aircraft Cockpit Style with Editable Inputs
 * All engine parameters with detailed visualization AND input fields
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface EngineParameters {
  rpm: number | null;
  oilPressure: number | null;
  oilTemperature: number | null;
  coolantTemp: number | null;
  coolantPressure: number | null;
  fuelPressure: number | null;
  engineHours: number | null;
  intakeAirTemp: number | null;
  exhaustTemp: number | null;
  turboBoostPressure: number | null;
}

// ==================== EDITABLE INPUT FIELD ====================
function EditableInput({
  label,
  value,
  unit,
  min,
  max,
  step = 1,
  onChange,
  color = 'cyan',
  icon,
}: {
  label: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number | null) => void;
  color?: 'cyan' | 'amber' | 'green' | 'red' | 'purple';
  icon?: string;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const colorClasses = {
    cyan: 'border-cyan-500/50 focus:border-cyan-400 text-cyan-400',
    amber: 'border-amber-500/50 focus:border-amber-400 text-amber-400',
    green: 'border-green-500/50 focus:border-green-400 text-green-400',
    red: 'border-red-500/50 focus:border-red-400 text-red-400',
    purple: 'border-purple-500/50 focus:border-purple-400 text-purple-400',
  };

  const glowColors = {
    cyan: 'rgba(6,182,212,0.3)',
    amber: 'rgba(245,158,11,0.3)',
    green: 'rgba(34,197,94,0.3)',
    red: 'rgba(239,68,68,0.3)',
    purple: 'rgba(139,92,246,0.3)',
  };

  return (
    <div className="relative">
      <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value === '' ? null : parseFloat(e.target.value);
            onChange(val);
          }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          min={min}
          max={max}
          step={step}
          placeholder="--"
          className={`w-full px-3 py-2 bg-slate-950/80 rounded-lg border ${colorClasses[color]} font-mono text-lg transition-all outline-none placeholder-slate-600`}
          style={{
            boxShadow: isFocused ? `0 0 15px ${glowColors[color]}` : 'none',
          }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
          {unit}
        </span>
      </div>
      <div className="flex justify-between mt-1 text-[9px] text-slate-600">
        <span>Min: {min}</span>
        <span>Max: {max}</span>
      </div>
    </div>
  );
}

// ==================== AIRCRAFT DIAL GAUGE ====================
function AircraftDial({
  value,
  min,
  max,
  label,
  unit,
  size = 140,
  zones,
  tickCount = 10,
  decimals = 0,
}: {
  value: number | null;
  min: number;
  max: number;
  label: string;
  unit: string;
  size?: number;
  zones?: { start: number; end: number; color: string }[];
  tickCount?: number;
  decimals?: number;
}) {
  const percentage = value !== null ? Math.min(Math.max((value - min) / (max - min), 0), 1) : 0;
  const angle = -135 + percentage * 270;
  const center = size / 2;
  const radius = (size - 40) / 2;

  const ticks = [...Array(tickCount + 1)].map((_, i) => {
    const tickAngle = -135 + (i / tickCount) * 270;
    const rad = (tickAngle * Math.PI) / 180;
    const innerR = radius - 12;
    const outerR = radius - 4;
    const tickValue = min + (i / tickCount) * (max - min);
    const labelR = radius - 24;

    return {
      x1: center + innerR * Math.cos(rad),
      y1: center + innerR * Math.sin(rad),
      x2: center + outerR * Math.cos(rad),
      y2: center + outerR * Math.sin(rad),
      labelX: center + labelR * Math.cos(rad),
      labelY: center + labelR * Math.sin(rad),
      value: tickValue,
      isMajor: i % 2 === 0,
    };
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size}>
        <defs>
          <linearGradient id={`bezel-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle cx={center} cy={center} r={radius + 12} fill={`url(#bezel-${label})`} stroke="rgba(100,116,139,0.3)" strokeWidth="1" />
        <circle cx={center} cy={center} r={radius + 4} fill="#0a0a0f" stroke="rgba(6,182,212,0.2)" strokeWidth="1" />

        {zones?.map((zone, idx) => {
          const startAngle = -135 + ((zone.start - min) / (max - min)) * 270;
          const endAngle = -135 + ((zone.end - min) / (max - min)) * 270;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const arcRadius = radius - 1;

          const x1 = center + arcRadius * Math.cos(startRad);
          const y1 = center + arcRadius * Math.sin(startRad);
          const x2 = center + arcRadius * Math.cos(endRad);
          const y2 = center + arcRadius * Math.sin(endRad);
          const largeArc = endAngle - startAngle > 180 ? 1 : 0;

          return (
            <path
              key={idx}
              d={`M ${x1} ${y1} A ${arcRadius} ${arcRadius} 0 ${largeArc} 1 ${x2} ${y2}`}
              fill="none"
              stroke={zone.color}
              strokeWidth="6"
              opacity="0.6"
            />
          );
        })}

        {ticks.map((tick, i) => (
          <g key={i}>
            <line x1={tick.x1} y1={tick.y1} x2={tick.x2} y2={tick.y2} stroke={tick.isMajor ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'} strokeWidth={tick.isMajor ? 2 : 1} />
            {tick.isMajor && (
              <text x={tick.labelX} y={tick.labelY} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize="8" fontFamily="monospace">
                {Math.round(tick.value)}
              </text>
            )}
          </g>
        ))}

        <circle cx={center} cy={center} r="6" fill="rgba(0,0,0,0.5)" />

        <motion.g
          initial={{ rotate: -135 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          <line x1={center} y1={center} x2={center} y2={center - radius + 18} stroke="rgba(239,68,68,0.5)" strokeWidth="4" strokeLinecap="round" filter={`url(#glow-${label})`} />
          <polygon
            points={`${center - 2},${center + 8} ${center + 2},${center + 8} ${center + 1},${center - radius + 18} ${center - 1},${center - radius + 18}`}
            fill="#ef4444"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
        </motion.g>

        <circle cx={center} cy={center} r="5" fill="#334155" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

        <text x={center} y={center + 24} textAnchor="middle" fill="rgba(6,182,212,0.8)" fontSize="9" fontFamily="monospace">
          {unit}
        </text>
      </svg>

      <span className="mt-1 text-[10px] text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );
}

// ==================== VERTICAL BAR INDICATOR ====================
function VerticalBarIndicator({
  value,
  min,
  max,
  label,
  unit,
  height = 120,
  warningMin,
  warningMax,
  criticalMin,
  criticalMax,
  color = 'cyan',
}: {
  value: number | null;
  min: number;
  max: number;
  label: string;
  unit: string;
  height?: number;
  warningMin?: number;
  warningMax?: number;
  criticalMin?: number;
  criticalMax?: number;
  color?: 'cyan' | 'amber' | 'green' | 'red';
}) {
  const percentage = value !== null ? Math.min(Math.max((value - min) / (max - min) * 100, 0), 100) : 0;

  const getColor = () => {
    if (value === null) return 'bg-slate-700';
    if (criticalMin !== undefined && value <= criticalMin) return 'bg-red-500';
    if (criticalMax !== undefined && value >= criticalMax) return 'bg-red-500';
    if (warningMin !== undefined && value <= warningMin) return 'bg-amber-500';
    if (warningMax !== undefined && value >= warningMax) return 'bg-amber-500';
    return `bg-${color}-500`;
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{label}</span>
      <div className="relative" style={{ height, width: 32 }}>
        <div className="absolute inset-0 bg-slate-900/80 rounded-lg border border-slate-700/50 overflow-hidden">
          {[...Array(11)].map((_, i) => (
            <div key={i} className="absolute left-0 right-0 h-px bg-slate-700/50" style={{ bottom: `${i * 10}%` }} />
          ))}
          <motion.div
            className={`absolute bottom-0 left-1 right-1 rounded-b ${getColor()}`}
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>
        <div className="absolute -right-5 top-0 bottom-0 flex flex-col justify-between text-[7px] text-slate-500 font-mono">
          <span>{max}</span>
          <span>{min}</span>
        </div>
      </div>
      <div className="text-center">
        <span className="text-xs font-mono text-cyan-400">{value ?? '--'}</span>
        <span className="text-[8px] text-slate-500 ml-0.5">{unit}</span>
      </div>
    </div>
  );
}

// ==================== ENGINE SCHEMATIC ====================
function EngineSchematic({ params }: { params: EngineParameters }) {
  const getStatusColor = (value: number | null, warning: number, critical: number, isHigh = true) => {
    if (value === null) return 'fill-slate-600';
    if (isHigh) {
      if (value >= critical) return 'fill-red-500';
      if (value >= warning) return 'fill-amber-500';
    } else {
      if (value <= critical) return 'fill-red-500';
      if (value <= warning) return 'fill-amber-500';
    }
    return 'fill-green-500';
  };

  return (
    <div className="relative p-4 bg-slate-950/50 rounded-xl border border-cyan-500/20">
      <svg viewBox="0 0 400 200" className="w-full h-auto">
        <rect x="100" y="40" width="200" height="120" rx="10" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="2" />

        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect x={120 + i * 45} y="55" width="35" height="50" rx="5" fill="rgba(30,41,59,0.8)" stroke="rgba(100,116,139,0.5)" strokeWidth="1" />
            <motion.rect
              x={125 + i * 45}
              width="25"
              height="16"
              rx="3"
              fill="rgba(100,116,139,0.8)"
              animate={{ y: [70, 78, 70] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.125 }}
            />
          </g>
        ))}

        <g>
          <path d="M 100 140 L 55 140 L 55 175 L 100 175" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="55" cy="157" r="12" className={getStatusColor(params.oilPressure, 30, 20, false)} />
          <text x="55" y="160" textAnchor="middle" fontSize="7" fill="white">OIL</text>
        </g>

        <g>
          <path d="M 300 60 L 340 60 L 340 95 L 300 95" fill="none" stroke="rgba(6,182,212,0.5)" strokeWidth="3" strokeLinecap="round" />
          <circle cx="340" cy="77" r="12" className={getStatusColor(params.coolantTemp, 90, 100)} />
          <text x="340" y="80" textAnchor="middle" fontSize="7" fill="white">COOL</text>
        </g>

        <g>
          <path d="M 300 130 L 360 130 L 360 165" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="3" strokeLinecap="round" />
          <motion.circle cx="360" cy="165" r="6" fill="rgba(239,68,68,0.3)" animate={{ r: [6, 10, 6], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
          <text x="360" y="182" textAnchor="middle" fontSize="7" fill="rgba(239,68,68,0.8)">EXH</text>
        </g>

        {params.turboBoostPressure !== null && (
          <g>
            <motion.circle cx="55" cy="77" r="15" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="2" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '55px 77px' }} />
            <text x="55" y="80" textAnchor="middle" fontSize="7" fill="rgba(139,92,246,0.8)">TURBO</text>
          </g>
        )}

        <text x="200" y="28" textAnchor="middle" fontSize="11" fill="rgba(6,182,212,0.8)" fontFamily="monospace">
          {params.rpm ? `${params.rpm} RPM` : '-- RPM'}
        </text>
      </svg>
    </div>
  );
}

// ==================== MAIN ENGINE PANEL ====================
export default function EnginePanel({
  parameters,
  onParameterChange,
}: {
  parameters: EngineParameters;
  onParameterChange: <K extends keyof EngineParameters>(key: K, value: EngineParameters[K]) => void;
}) {
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <div>
            <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wider">Engine Control Panel</h2>
            <p className="text-sm text-slate-500">Enter engine parameters for diagnostics</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              isEditMode
                ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                : 'bg-slate-800/50 border border-slate-700 text-slate-400'
            }`}
          >
            {isEditMode ? '✏️ Edit Mode' : '👁️ View Mode'}
          </button>
          <div className="flex items-center gap-2">
            <motion.div className="w-3 h-3 rounded-full bg-green-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <span className="text-sm text-green-400 uppercase tracking-wider">Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Input Fields */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-amber-500/20">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span>📝</span> Enter Engine Parameters
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <EditableInput
                label="Engine RPM"
                value={parameters.rpm}
                unit="RPM"
                min={0}
                max={2500}
                step={10}
                onChange={(val) => onParameterChange('rpm', val)}
                color="amber"
                icon="🔄"
              />
              <EditableInput
                label="Oil Pressure"
                value={parameters.oilPressure}
                unit="PSI"
                min={0}
                max={100}
                step={1}
                onChange={(val) => onParameterChange('oilPressure', val)}
                color="amber"
                icon="🛢️"
              />
              <EditableInput
                label="Oil Temperature"
                value={parameters.oilTemperature}
                unit="°C"
                min={0}
                max={150}
                step={1}
                onChange={(val) => onParameterChange('oilTemperature', val)}
                color="red"
                icon="🌡️"
              />
              <EditableInput
                label="Coolant Temp"
                value={parameters.coolantTemp}
                unit="°C"
                min={0}
                max={120}
                step={1}
                onChange={(val) => onParameterChange('coolantTemp', val)}
                color="cyan"
                icon="❄️"
              />
              <EditableInput
                label="Coolant Pressure"
                value={parameters.coolantPressure}
                unit="PSI"
                min={0}
                max={30}
                step={0.5}
                onChange={(val) => onParameterChange('coolantPressure', val)}
                color="cyan"
                icon="💧"
              />
              <EditableInput
                label="Fuel Pressure"
                value={parameters.fuelPressure}
                unit="PSI"
                min={0}
                max={80}
                step={1}
                onChange={(val) => onParameterChange('fuelPressure', val)}
                color="green"
                icon="⛽"
              />
              <EditableInput
                label="Intake Air Temp"
                value={parameters.intakeAirTemp}
                unit="°C"
                min={-20}
                max={80}
                step={1}
                onChange={(val) => onParameterChange('intakeAirTemp', val)}
                color="cyan"
                icon="💨"
              />
              <EditableInput
                label="Exhaust Temp"
                value={parameters.exhaustTemp}
                unit="°C"
                min={0}
                max={800}
                step={5}
                onChange={(val) => onParameterChange('exhaustTemp', val)}
                color="red"
                icon="🔥"
              />
              <EditableInput
                label="Turbo Boost"
                value={parameters.turboBoostPressure}
                unit="PSI"
                min={0}
                max={40}
                step={0.5}
                onChange={(val) => onParameterChange('turboBoostPressure', val)}
                color="purple"
                icon="🌀"
              />
              <EditableInput
                label="Engine Hours"
                value={parameters.engineHours}
                unit="hrs"
                min={0}
                max={100000}
                step={1}
                onChange={(val) => onParameterChange('engineHours', val)}
                color="purple"
                icon="⏱️"
              />
            </div>
          </div>
        </div>

        {/* Center - Gauges */}
        <div className="col-span-12 lg:col-span-5">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/20 mb-6">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Live Gauges</h3>
            <div className="grid grid-cols-2 gap-4">
              <AircraftDial
                value={parameters.rpm}
                min={0}
                max={2000}
                label="Tachometer"
                unit="RPM"
                size={130}
                tickCount={10}
                zones={[
                  { start: 0, end: 800, color: '#22c55e' },
                  { start: 800, end: 1600, color: '#22c55e' },
                  { start: 1600, end: 1800, color: '#f59e0b' },
                  { start: 1800, end: 2000, color: '#ef4444' },
                ]}
              />
              <AircraftDial
                value={parameters.oilPressure}
                min={0}
                max={100}
                label="Oil Pressure"
                unit="PSI"
                size={130}
                tickCount={10}
                zones={[
                  { start: 0, end: 20, color: '#ef4444' },
                  { start: 20, end: 30, color: '#f59e0b' },
                  { start: 30, end: 70, color: '#22c55e' },
                  { start: 70, end: 100, color: '#22c55e' },
                ]}
              />
              <AircraftDial
                value={parameters.coolantTemp}
                min={0}
                max={120}
                label="Coolant Temp"
                unit="°C"
                size={130}
                tickCount={12}
                zones={[
                  { start: 0, end: 40, color: '#3b82f6' },
                  { start: 40, end: 90, color: '#22c55e' },
                  { start: 90, end: 100, color: '#f59e0b' },
                  { start: 100, end: 120, color: '#ef4444' },
                ]}
              />
              <AircraftDial
                value={parameters.oilTemperature}
                min={0}
                max={150}
                label="Oil Temp"
                unit="°C"
                size={130}
                tickCount={10}
                zones={[
                  { start: 0, end: 60, color: '#3b82f6' },
                  { start: 60, end: 110, color: '#22c55e' },
                  { start: 110, end: 130, color: '#f59e0b' },
                  { start: 130, end: 150, color: '#ef4444' },
                ]}
              />
            </div>
          </div>

          <EngineSchematic params={parameters} />
        </div>

        {/* Right - Vertical Bars & Summary */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <div className="p-4 bg-slate-900/50 rounded-xl border border-cyan-500/20">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Level Indicators</h3>
            <div className="flex justify-around">
              <VerticalBarIndicator value={parameters.oilPressure} min={0} max={100} label="Oil Press" unit="PSI" height={140} warningMin={25} criticalMin={15} color="amber" />
              <VerticalBarIndicator value={parameters.coolantTemp} min={0} max={120} label="Coolant" unit="°C" height={140} warningMax={95} criticalMax={105} color="cyan" />
              <VerticalBarIndicator value={parameters.fuelPressure} min={0} max={60} label="Fuel Press" unit="PSI" height={140} warningMin={20} criticalMin={10} color="green" />
            </div>
          </div>

          {/* Engine Hours Summary */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
            <div className="text-center">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Engine Hours</div>
              <div className="text-3xl font-mono font-bold text-purple-400 mt-1" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                {parameters.engineHours !== null ? parameters.engineHours.toLocaleString() : '--'}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-700">
                <div className="text-[10px] text-slate-500 uppercase">Next Service</div>
                <div className="text-lg font-mono text-amber-400">
                  {parameters.engineHours !== null ? Math.max(0, 500 - (parameters.engineHours % 500)) : '--'} hrs
                </div>
              </div>
            </div>
          </div>

          {/* Quick Values */}
          <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3">Quick Values</h3>
            <div className="space-y-2">
              {[
                { label: 'Intake Air', value: parameters.intakeAirTemp, unit: '°C', color: 'text-cyan-400' },
                { label: 'Exhaust', value: parameters.exhaustTemp, unit: '°C', color: 'text-red-400' },
                { label: 'Turbo Boost', value: parameters.turboBoostPressure, unit: 'PSI', color: 'text-purple-400' },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center p-2 bg-slate-950/50 rounded">
                  <span className="text-xs text-slate-500">{item.label}</span>
                  <span className={`font-mono text-sm ${item.color}`}>
                    {item.value ?? '--'} {item.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
