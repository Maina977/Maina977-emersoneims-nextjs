'use client';

/**
 * Engine Control Panel - Aircraft Cockpit Style
 * All engine parameters with detailed visualization
 */

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

// ==================== AIRCRAFT DIAL GAUGE ====================
function AircraftDial({
  value,
  min,
  max,
  label,
  unit,
  size = 160,
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

  // Generate tick marks
  const ticks = [...Array(tickCount + 1)].map((_, i) => {
    const tickAngle = -135 + (i / tickCount) * 270;
    const rad = (tickAngle * Math.PI) / 180;
    const innerR = radius - 15;
    const outerR = radius - 5;
    const tickValue = min + (i / tickCount) * (max - min);
    const labelR = radius - 28;

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
        {/* Outer bezel */}
        <defs>
          <linearGradient id={`bezel-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
          <filter id={`glow-${label}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer ring */}
        <circle
          cx={center}
          cy={center}
          r={radius + 15}
          fill={`url(#bezel-${label})`}
          stroke="rgba(100,116,139,0.3)"
          strokeWidth="1"
        />

        {/* Inner face */}
        <circle
          cx={center}
          cy={center}
          r={radius + 5}
          fill="#0a0a0f"
          stroke="rgba(6,182,212,0.2)"
          strokeWidth="1"
        />

        {/* Color zones */}
        {zones?.map((zone, idx) => {
          const startAngle = -135 + ((zone.start - min) / (max - min)) * 270;
          const endAngle = -135 + ((zone.end - min) / (max - min)) * 270;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const arcRadius = radius - 2;

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
              strokeWidth="8"
              opacity="0.6"
            />
          );
        })}

        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <g key={i}>
            <line
              x1={tick.x1}
              y1={tick.y1}
              x2={tick.x2}
              y2={tick.y2}
              stroke={tick.isMajor ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)'}
              strokeWidth={tick.isMajor ? 2 : 1}
            />
            {tick.isMajor && (
              <text
                x={tick.labelX}
                y={tick.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(255,255,255,0.6)"
                fontSize="9"
                fontFamily="monospace"
              >
                {Math.round(tick.value)}
              </text>
            )}
          </g>
        ))}

        {/* Needle pivot point shadow */}
        <circle
          cx={center}
          cy={center}
          r="8"
          fill="rgba(0,0,0,0.5)"
        />

        {/* Needle */}
        <motion.g
          initial={{ rotate: -135 }}
          animate={{ rotate: angle }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        >
          {/* Needle glow */}
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center - radius + 20}
            stroke="rgba(239,68,68,0.5)"
            strokeWidth="6"
            strokeLinecap="round"
            filter={`url(#glow-${label})`}
          />
          {/* Main needle */}
          <polygon
            points={`
              ${center - 3},${center + 10}
              ${center + 3},${center + 10}
              ${center + 1.5},${center - radius + 20}
              ${center - 1.5},${center - radius + 20}
            `}
            fill="#ef4444"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="0.5"
          />
        </motion.g>

        {/* Center cap */}
        <circle
          cx={center}
          cy={center}
          r="6"
          fill="linear-gradient(135deg, #334155, #1e293b)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Unit label at bottom */}
        <text
          x={center}
          y={center + 30}
          textAnchor="middle"
          fill="rgba(6,182,212,0.8)"
          fontSize="11"
          fontFamily="monospace"
        >
          {unit}
        </text>
      </svg>

      {/* Digital readout */}
      <div className="mt-2 px-3 py-1 bg-slate-950/80 rounded border border-slate-700/50">
        <span className="text-lg font-mono font-bold text-cyan-400">
          {value !== null ? value.toFixed(decimals) : '--'}
        </span>
        <span className="text-xs text-slate-500 ml-1">{unit}</span>
      </div>

      {/* Label */}
      <span className="mt-1 text-xs text-slate-400 uppercase tracking-wider">{label}</span>
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
  height = 150,
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
    <div className="flex flex-col items-center gap-2">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>

      <div className="relative" style={{ height, width: 40 }}>
        {/* Background */}
        <div className="absolute inset-0 bg-slate-900/80 rounded-lg border border-slate-700/50 overflow-hidden">
          {/* Tick marks */}
          {[...Array(11)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 h-px bg-slate-700/50"
              style={{ bottom: `${i * 10}%` }}
            />
          ))}

          {/* Fill */}
          <motion.div
            className={`absolute bottom-0 left-1 right-1 rounded-b ${getColor()}`}
            initial={{ height: 0 }}
            animate={{ height: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              boxShadow: value !== null ? `0 0 20px ${color === 'cyan' ? 'rgba(6,182,212,0.5)' : 'rgba(245,158,11,0.5)'}` : 'none',
            }}
          />

          {/* Pointer */}
          <motion.div
            className="absolute left-0 right-0 flex items-center"
            initial={{ bottom: 0 }}
            animate={{ bottom: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="w-2 h-2 bg-white rotate-45 -translate-x-1" />
          </motion.div>
        </div>

        {/* Scale labels */}
        <div className="absolute -right-6 top-0 bottom-0 flex flex-col justify-between text-[8px] text-slate-500 font-mono">
          <span>{max}</span>
          <span>{Math.round((max + min) / 2)}</span>
          <span>{min}</span>
        </div>
      </div>

      {/* Value display */}
      <div className="text-center">
        <span className="text-sm font-mono text-cyan-400">{value ?? '--'}</span>
        <span className="text-[10px] text-slate-500 ml-0.5">{unit}</span>
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
    <div className="relative p-6 bg-slate-950/50 rounded-xl border border-cyan-500/20">
      <svg viewBox="0 0 400 250" className="w-full h-auto">
        {/* Engine block outline */}
        <rect
          x="100"
          y="50"
          width="200"
          height="150"
          rx="10"
          fill="none"
          stroke="rgba(6,182,212,0.3)"
          strokeWidth="2"
        />

        {/* Cylinders */}
        {[0, 1, 2, 3].map(i => (
          <g key={i}>
            <rect
              x={120 + i * 45}
              y="70"
              width="35"
              height="60"
              rx="5"
              fill="rgba(30,41,59,0.8)"
              stroke="rgba(100,116,139,0.5)"
              strokeWidth="1"
            />
            {/* Piston animation */}
            <motion.rect
              x={125 + i * 45}
              width="25"
              height="20"
              rx="3"
              fill="rgba(100,116,139,0.8)"
              animate={{ y: [85, 95, 85] }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.125 }}
            />
          </g>
        ))}

        {/* Oil system */}
        <g>
          <path
            d="M 100 180 L 50 180 L 50 220 L 100 220"
            fill="none"
            stroke="rgba(245,158,11,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="200" r="15" className={getStatusColor(params.oilPressure, 30, 20, false)} />
          <text x="50" y="204" textAnchor="middle" fontSize="8" fill="white">OIL</text>
        </g>

        {/* Coolant system */}
        <g>
          <path
            d="M 300 80 L 350 80 L 350 120 L 300 120"
            fill="none"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="350" cy="100" r="15" className={getStatusColor(params.coolantTemp, 90, 100)} />
          <text x="350" y="104" textAnchor="middle" fontSize="8" fill="white">COOL</text>
        </g>

        {/* Exhaust */}
        <g>
          <path
            d="M 300 160 L 380 160 L 380 200"
            fill="none"
            stroke="rgba(239,68,68,0.5)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <motion.circle
            cx="380"
            cy="200"
            r="8"
            fill="rgba(239,68,68,0.3)"
            animate={{ r: [8, 12, 8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <text x="380" y="220" textAnchor="middle" fontSize="8" fill="rgba(239,68,68,0.8)">EXH</text>
        </g>

        {/* Turbo */}
        {params.turboBoostPressure !== null && (
          <g>
            <motion.circle
              cx="60"
              cy="100"
              r="20"
              fill="rgba(139,92,246,0.2)"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth="2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '60px 100px' }}
            />
            <text x="60" y="104" textAnchor="middle" fontSize="8" fill="rgba(139,92,246,0.8)">TURBO</text>
          </g>
        )}

        {/* RPM indicator */}
        <text x="200" y="35" textAnchor="middle" fontSize="12" fill="rgba(6,182,212,0.8)" fontFamily="monospace">
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚙️</span>
          <div>
            <h2 className="text-xl font-bold text-amber-400 uppercase tracking-wider">Engine Control Panel</h2>
            <p className="text-sm text-slate-500">Real-time engine monitoring and diagnostics</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-sm text-green-400 uppercase tracking-wider">Monitoring Active</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Primary Dials */}
        <div className="col-span-12 lg:col-span-4">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-amber-500/20">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Primary Indicators</h3>
            <div className="grid grid-cols-2 gap-4">
              <AircraftDial
                value={parameters.rpm}
                min={0}
                max={2000}
                label="Tachometer"
                unit="RPM"
                size={150}
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
                size={150}
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
                size={150}
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
                size={150}
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
        </div>

        {/* Center - Engine Schematic & Data */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <EngineSchematic params={parameters} />

          {/* Additional Parameters */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/20">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Secondary Parameters</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-3 bg-slate-950/50 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Fuel Pressure</div>
                <div className="text-xl font-mono text-cyan-400">{parameters.fuelPressure ?? '--'}</div>
                <div className="text-[10px] text-slate-500">PSI</div>
              </div>
              <div className="text-center p-3 bg-slate-950/50 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Intake Air</div>
                <div className="text-xl font-mono text-cyan-400">{parameters.intakeAirTemp ?? '--'}</div>
                <div className="text-[10px] text-slate-500">°C</div>
              </div>
              <div className="text-center p-3 bg-slate-950/50 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Exhaust</div>
                <div className="text-xl font-mono text-red-400">{parameters.exhaustTemp ?? '--'}</div>
                <div className="text-[10px] text-slate-500">°C</div>
              </div>
              <div className="text-center p-3 bg-slate-950/50 rounded-lg">
                <div className="text-[10px] text-slate-500 uppercase">Turbo Boost</div>
                <div className="text-xl font-mono text-purple-400">{parameters.turboBoostPressure ?? '--'}</div>
                <div className="text-[10px] text-slate-500">PSI</div>
              </div>
            </div>
          </div>

          {/* Engine Hours */}
          <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">Total Engine Hours</div>
                <div className="text-4xl font-mono font-bold text-purple-400" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                  {parameters.engineHours !== null ? parameters.engineHours.toLocaleString() : '--'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 uppercase">Service Due</div>
                <div className="text-lg font-mono text-amber-400">
                  {parameters.engineHours !== null ? Math.max(0, 500 - (parameters.engineHours % 500)) : '--'} hrs
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right - Vertical Bars */}
        <div className="col-span-12 lg:col-span-3">
          <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/20 h-full">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-6 text-center">Level Indicators</h3>
            <div className="flex justify-around">
              <VerticalBarIndicator
                value={parameters.oilPressure}
                min={0}
                max={100}
                label="Oil Press"
                unit="PSI"
                height={180}
                warningMin={25}
                criticalMin={15}
                color="amber"
              />
              <VerticalBarIndicator
                value={parameters.coolantTemp}
                min={0}
                max={120}
                label="Coolant"
                unit="°C"
                height={180}
                warningMax={95}
                criticalMax={105}
                color="cyan"
              />
              <VerticalBarIndicator
                value={parameters.fuelPressure}
                min={0}
                max={60}
                label="Fuel Press"
                unit="PSI"
                height={180}
                warningMin={20}
                criticalMin={10}
                color="green"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
