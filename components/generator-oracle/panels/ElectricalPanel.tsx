'use client';

/**
 * Electrical Control Panel - Power Grid Style Interface
 * Comprehensive electrical monitoring with phase visualization
 */

import { motion } from 'framer-motion';

interface ElectricalParameters {
  // Voltage Phase-to-Neutral
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
  // Voltage Phase-to-Phase
  voltageL1L2: number | null;
  voltageL2L3: number | null;
  voltageL3L1: number | null;
  // Current
  currentL1: number | null;
  currentL2: number | null;
  currentL3: number | null;
  currentNeutral: number | null;
  // Power
  activePowerKw: number | null;
  reactivePowerKvar: number | null;
  apparentPowerKva: number | null;
  powerFactor: number | null;
  frequency: number | null;
}

// ==================== PHASE METER ====================
function PhaseMeter({
  phase,
  voltage,
  current,
  color,
}: {
  phase: string;
  voltage: number | null;
  current: number | null;
  color: string;
}) {
  const voltagePercent = voltage !== null ? Math.min((voltage / 280) * 100, 100) : 0;
  const currentPercent = current !== null ? Math.min((current / 500) * 100, 100) : 0;

  return (
    <div className="relative p-4 bg-slate-950/80 rounded-xl border border-slate-700/50">
      {/* Phase indicator */}
      <div className="flex items-center gap-3 mb-4">
        <motion.div
          className={`w-4 h-4 rounded-full ${color}`}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ boxShadow: `0 0 10px ${color.includes('red') ? '#ef4444' : color.includes('yellow') ? '#eab308' : '#3b82f6'}` }}
        />
        <span className="text-lg font-bold text-white">{phase}</span>
      </div>

      {/* Voltage */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 uppercase">Voltage</span>
          <span className="text-lg font-mono text-cyan-400">{voltage ?? '--'} <span className="text-xs text-slate-500">V</span></span>
        </div>
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${voltagePercent}%` }}
            transition={{ duration: 0.8 }}
            style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
          />
          {/* Warning marker at 264V (10% over) */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50" style={{ left: '94%' }} />
        </div>
      </div>

      {/* Current */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500 uppercase">Current</span>
          <span className="text-lg font-mono text-amber-400">{current ?? '--'} <span className="text-xs text-slate-500">A</span></span>
        </div>
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${currentPercent}%` }}
            transition={{ duration: 0.8 }}
            style={{ boxShadow: '0 0 10px rgba(245,158,11,0.5)' }}
          />
        </div>
      </div>
    </div>
  );
}

// ==================== POWER TRIANGLE ====================
function PowerTriangle({
  activePower,
  reactivePower,
  apparentPower,
  powerFactor,
}: {
  activePower: number | null;
  reactivePower: number | null;
  apparentPower: number | null;
  powerFactor: number | null;
}) {
  const angle = powerFactor !== null ? Math.acos(Math.min(powerFactor, 1)) * (180 / Math.PI) : 0;

  return (
    <div className="p-6 bg-slate-950/50 rounded-xl border border-purple-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Power Triangle</h3>

      <div className="relative w-full h-48 flex items-center justify-center">
        <svg viewBox="0 0 200 150" className="w-full h-full max-w-[280px]">
          {/* Grid lines */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="20"
              y1={30 + i * 25}
              x2="180"
              y2={30 + i * 25}
              stroke="rgba(100,116,139,0.1)"
              strokeWidth="1"
            />
          ))}
          {[...Array(7)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={20 + i * 27}
              y1="30"
              x2={20 + i * 27}
              y2="130"
              stroke="rgba(100,116,139,0.1)"
              strokeWidth="1"
            />
          ))}

          {/* Triangle */}
          <motion.path
            d="M 30 120 L 160 120 L 160 50 Z"
            fill="rgba(139,92,246,0.1)"
            stroke="rgba(139,92,246,0.5)"
            strokeWidth="2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Active Power (horizontal) */}
          <motion.line
            x1="30"
            y1="120"
            x2="160"
            y2="120"
            stroke="#22c55e"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8 }}
          />
          <text x="95" y="140" textAnchor="middle" fill="#22c55e" fontSize="10" fontFamily="monospace">
            P = {activePower ?? '--'} kW
          </text>

          {/* Reactive Power (vertical) */}
          <motion.line
            x1="160"
            y1="120"
            x2="160"
            y2="50"
            stroke="#f59e0b"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          <text x="180" y="85" textAnchor="start" fill="#f59e0b" fontSize="10" fontFamily="monospace">
            Q = {reactivePower ?? '--'}
          </text>
          <text x="180" y="97" textAnchor="start" fill="#f59e0b" fontSize="10" fontFamily="monospace">
            kVAr
          </text>

          {/* Apparent Power (hypotenuse) */}
          <motion.line
            x1="30"
            y1="120"
            x2="160"
            y2="50"
            stroke="#06b6d4"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          />
          <text x="75" y="75" textAnchor="middle" fill="#06b6d4" fontSize="10" fontFamily="monospace" transform="rotate(-28 75 75)">
            S = {apparentPower ?? '--'} kVA
          </text>

          {/* Angle arc */}
          <motion.path
            d={`M 50 120 A 20 20 0 0 0 ${50 + 17 * Math.cos(-angle * Math.PI / 180)} ${120 + 17 * Math.sin(-angle * Math.PI / 180)}`}
            fill="none"
            stroke="#a855f7"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          />
          <text x="70" y="108" fill="#a855f7" fontSize="9" fontFamily="monospace">
            φ = {angle.toFixed(1)}°
          </text>
        </svg>
      </div>

      {/* Power Factor Display */}
      <div className="mt-4 text-center">
        <div className="inline-block px-6 py-3 bg-slate-900/80 rounded-lg border border-purple-500/30">
          <div className="text-xs text-slate-500 uppercase mb-1">Power Factor</div>
          <div className="text-3xl font-mono font-bold text-purple-400" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
            {powerFactor !== null ? powerFactor.toFixed(3) : '--'}
          </div>
          <div className={`text-xs mt-1 ${
            powerFactor === null ? 'text-slate-500' :
            powerFactor >= 0.95 ? 'text-green-400' :
            powerFactor >= 0.85 ? 'text-amber-400' :
            'text-red-400'
          }`}>
            {powerFactor === null ? 'No Data' :
             powerFactor >= 0.95 ? 'EXCELLENT' :
             powerFactor >= 0.85 ? 'ACCEPTABLE' :
             'POOR'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== FREQUENCY DISPLAY ====================
function FrequencyDisplay({ frequency }: { frequency: number | null }) {
  const normalizedFreq = frequency !== null ? ((frequency - 45) / 20) * 100 : 50; // 45-65 Hz range

  return (
    <div className="p-6 bg-slate-950/50 rounded-xl border border-cyan-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Frequency</h3>

      <div className="relative h-24">
        {/* Frequency bar */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-4 bg-slate-800 rounded-full">
          {/* Zone indicators */}
          <div className="absolute h-full w-[20%] left-0 bg-red-500/20 rounded-l-full" />
          <div className="absolute h-full w-[20%] left-[20%] bg-amber-500/20" />
          <div className="absolute h-full w-[20%] left-[40%] bg-green-500/20" />
          <div className="absolute h-full w-[20%] left-[60%] bg-amber-500/20" />
          <div className="absolute h-full w-[20%] right-0 bg-red-500/20 rounded-r-full" />

          {/* Scale markers */}
          {[45, 48, 50, 52, 55, 60, 65].map((freq, i) => (
            <div
              key={freq}
              className="absolute top-full mt-1 transform -translate-x-1/2"
              style={{ left: `${((freq - 45) / 20) * 100}%` }}
            >
              <div className="w-px h-2 bg-slate-600 mx-auto" />
              <span className="text-[9px] text-slate-500 font-mono">{freq}</span>
            </div>
          ))}

          {/* Needle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"
            initial={{ left: '50%' }}
            animate={{ left: `${normalizedFreq}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            style={{
              boxShadow: '0 0 10px rgba(255,255,255,0.8)',
              transform: 'translateX(-50%) translateY(-50%)',
            }}
          />
        </div>
      </div>

      {/* Digital display */}
      <div className="text-center mt-8">
        <motion.div
          className="inline-block px-8 py-4 bg-slate-900/80 rounded-lg border border-cyan-500/30"
          animate={{
            borderColor: frequency !== null && (frequency < 49 || frequency > 51)
              ? ['rgba(6,182,212,0.3)', 'rgba(245,158,11,0.5)', 'rgba(6,182,212,0.3)']
              : 'rgba(6,182,212,0.3)'
          }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <div className="text-5xl font-mono font-bold text-cyan-400" style={{ textShadow: '0 0 30px rgba(6,182,212,0.5)' }}>
            {frequency !== null ? frequency.toFixed(2) : '--'}
          </div>
          <div className="text-sm text-slate-500 mt-1">Hz</div>
        </motion.div>
      </div>
    </div>
  );
}

// ==================== VOLTAGE PHASOR DIAGRAM ====================
function PhasorDiagram({
  voltageL1N,
  voltageL2N,
  voltageL3N,
}: {
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
}) {
  const maxVoltage = 280;
  const scale = 60 / maxVoltage;

  const l1Length = (voltageL1N ?? 0) * scale;
  const l2Length = (voltageL2N ?? 0) * scale;
  const l3Length = (voltageL3N ?? 0) * scale;

  // Phasor angles (120° apart)
  const l1Angle = 90; // Pointing up
  const l2Angle = 210; // 120° from L1
  const l3Angle = 330; // 240° from L1

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <div className="p-6 bg-slate-950/50 rounded-xl border border-cyan-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 text-center">Voltage Phasor Diagram</h3>

      <div className="relative w-full h-48 flex items-center justify-center">
        <svg viewBox="0 0 160 160" className="w-full h-full max-w-[200px]">
          {/* Background circles */}
          {[20, 40, 60].map(r => (
            <circle
              key={r}
              cx="80"
              cy="80"
              r={r}
              fill="none"
              stroke="rgba(100,116,139,0.2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Axis lines */}
          <line x1="80" y1="10" x2="80" y2="150" stroke="rgba(100,116,139,0.1)" strokeWidth="1" />
          <line x1="10" y1="80" x2="150" y2="80" stroke="rgba(100,116,139,0.1)" strokeWidth="1" />

          {/* L1 Phasor (Red) */}
          <motion.line
            x1="80"
            y1="80"
            x2={80 + l1Length * Math.cos(toRad(l1Angle - 90))}
            y2={80 - l1Length * Math.sin(toRad(l1Angle - 90))}
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.circle
            cx={80 + l1Length * Math.cos(toRad(l1Angle - 90))}
            cy={80 - l1Length * Math.sin(toRad(l1Angle - 90))}
            r="4"
            fill="#ef4444"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          />
          <text
            x={80 + (l1Length + 12) * Math.cos(toRad(l1Angle - 90))}
            y={80 - (l1Length + 12) * Math.sin(toRad(l1Angle - 90))}
            fill="#ef4444"
            fontSize="10"
            textAnchor="middle"
          >
            L1
          </text>

          {/* L2 Phasor (Yellow) */}
          <motion.line
            x1="80"
            y1="80"
            x2={80 + l2Length * Math.cos(toRad(l2Angle - 90))}
            y2={80 - l2Length * Math.sin(toRad(l2Angle - 90))}
            stroke="#eab308"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.circle
            cx={80 + l2Length * Math.cos(toRad(l2Angle - 90))}
            cy={80 - l2Length * Math.sin(toRad(l2Angle - 90))}
            r="4"
            fill="#eab308"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
          />
          <text
            x={80 + (l2Length + 12) * Math.cos(toRad(l2Angle - 90))}
            y={80 - (l2Length + 12) * Math.sin(toRad(l2Angle - 90))}
            fill="#eab308"
            fontSize="10"
            textAnchor="middle"
          >
            L2
          </text>

          {/* L3 Phasor (Blue) */}
          <motion.line
            x1="80"
            y1="80"
            x2={80 + l3Length * Math.cos(toRad(l3Angle - 90))}
            y2={80 - l3Length * Math.sin(toRad(l3Angle - 90))}
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.circle
            cx={80 + l3Length * Math.cos(toRad(l3Angle - 90))}
            cy={80 - l3Length * Math.sin(toRad(l3Angle - 90))}
            r="4"
            fill="#3b82f6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.9 }}
          />
          <text
            x={80 + (l3Length + 12) * Math.cos(toRad(l3Angle - 90))}
            y={80 - (l3Length + 12) * Math.sin(toRad(l3Angle - 90))}
            fill="#3b82f6"
            fontSize="10"
            textAnchor="middle"
          >
            L3
          </text>

          {/* Center dot */}
          <circle cx="80" cy="80" r="3" fill="rgba(255,255,255,0.8)" />

          {/* Rotating reference */}
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '80px 80px' }}
          >
            <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="2 8" />
          </motion.g>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-xs text-slate-400">L1: {voltageL1N ?? '--'}V</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-xs text-slate-400">L2: {voltageL2N ?? '--'}V</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-slate-400">L3: {voltageL3N ?? '--'}V</span>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN ELECTRICAL PANEL ====================
export default function ElectricalPanel({
  parameters,
  onParameterChange,
}: {
  parameters: ElectricalParameters;
  onParameterChange: <K extends keyof ElectricalParameters>(key: K, value: ElectricalParameters[K]) => void;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Electrical Control Panel</h2>
            <p className="text-sm text-slate-500">Three-phase power monitoring and analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-slate-400">SYNC</span>
          </div>
          <div className="px-3 py-1 bg-slate-800/50 rounded border border-slate-700/50">
            <span className="text-xs text-cyan-400 font-mono">3Φ 4W</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Phase Meters */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider">Phase Monitoring</h3>
          <PhaseMeter
            phase="L1"
            voltage={parameters.voltageL1N}
            current={parameters.currentL1}
            color="bg-red-500"
          />
          <PhaseMeter
            phase="L2"
            voltage={parameters.voltageL2N}
            current={parameters.currentL2}
            color="bg-yellow-500"
          />
          <PhaseMeter
            phase="L3"
            voltage={parameters.voltageL3N}
            current={parameters.currentL3}
            color="bg-blue-500"
          />

          {/* Neutral Current */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-700/50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 uppercase">Neutral Current</span>
              <span className="text-lg font-mono text-slate-400">{parameters.currentNeutral ?? '--'} <span className="text-xs">A</span></span>
            </div>
          </div>
        </div>

        {/* Center - Power Triangle & Frequency */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <FrequencyDisplay frequency={parameters.frequency} />
          <PowerTriangle
            activePower={parameters.activePowerKw}
            reactivePower={parameters.reactivePowerKvar}
            apparentPower={parameters.apparentPowerKva}
            powerFactor={parameters.powerFactor}
          />
        </div>

        {/* Right - Phasor & Line-to-Line */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PhasorDiagram
            voltageL1N={parameters.voltageL1N}
            voltageL2N={parameters.voltageL2N}
            voltageL3N={parameters.voltageL3N}
          />

          {/* Line-to-Line Voltages */}
          <div className="p-6 bg-slate-950/50 rounded-xl border border-amber-500/30">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4">Line-to-Line Voltage</h3>
            <div className="space-y-3">
              {[
                { label: 'L1-L2', value: parameters.voltageL1L2, colors: ['#ef4444', '#eab308'] },
                { label: 'L2-L3', value: parameters.voltageL2L3, colors: ['#eab308', '#3b82f6'] },
                { label: 'L3-L1', value: parameters.voltageL3L1, colors: ['#3b82f6', '#ef4444'] },
              ].map(({ label, value, colors }) => (
                <div key={label} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-3 h-3 rounded-full border-2 border-slate-900" style={{ backgroundColor: colors[0] }} />
                      <div className="w-3 h-3 rounded-full border-2 border-slate-900" style={{ backgroundColor: colors[1] }} />
                    </div>
                    <span className="text-sm text-slate-400">{label}</span>
                  </div>
                  <span className="text-lg font-mono text-amber-400">{value ?? '--'} <span className="text-xs text-slate-500">V</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Power Summary */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Power', value: parameters.activePowerKw, unit: 'kW', color: 'text-green-400', icon: '⚡' },
          { label: 'Reactive Power', value: parameters.reactivePowerKvar, unit: 'kVAr', color: 'text-amber-400', icon: '〰️' },
          { label: 'Apparent Power', value: parameters.apparentPowerKva, unit: 'kVA', color: 'text-cyan-400', icon: '📊' },
          { label: 'Power Factor', value: parameters.powerFactor, unit: 'PF', color: 'text-purple-400', icon: 'φ', decimals: 3 },
        ].map((item) => (
          <div key={item.label} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
            <div className="text-2xl mb-2">{item.icon}</div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">{item.label}</div>
            <div className={`text-2xl font-mono font-bold ${item.color}`}>
              {item.value !== null ? item.value.toFixed(item.decimals ?? 1) : '--'}
            </div>
            <div className="text-xs text-slate-500">{item.unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
