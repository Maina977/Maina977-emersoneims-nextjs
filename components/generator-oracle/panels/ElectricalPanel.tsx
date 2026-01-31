'use client';

/**
 * Electrical Control Panel - Power Grid Style Interface with Editable Inputs
 * Comprehensive electrical monitoring with phase visualization AND input fields
 */

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ElectricalParameters {
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
  voltageL1L2: number | null;
  voltageL2L3: number | null;
  voltageL3L1: number | null;
  currentL1: number | null;
  currentL2: number | null;
  currentL3: number | null;
  currentNeutral: number | null;
  activePowerKw: number | null;
  reactivePowerKvar: number | null;
  apparentPowerKva: number | null;
  powerFactor: number | null;
  frequency: number | null;
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
  compact = false,
}: {
  label: string;
  value: number | null;
  unit: string;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number | null) => void;
  color?: 'cyan' | 'amber' | 'green' | 'red' | 'purple' | 'blue' | 'yellow';
  icon?: string;
  compact?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  const colorClasses: Record<string, string> = {
    cyan: 'border-cyan-500/50 focus:border-cyan-400 text-cyan-400',
    amber: 'border-amber-500/50 focus:border-amber-400 text-amber-400',
    green: 'border-green-500/50 focus:border-green-400 text-green-400',
    red: 'border-red-500/50 focus:border-red-400 text-red-400',
    purple: 'border-purple-500/50 focus:border-purple-400 text-purple-400',
    blue: 'border-blue-500/50 focus:border-blue-400 text-blue-400',
    yellow: 'border-yellow-500/50 focus:border-yellow-400 text-yellow-400',
  };

  const glowColors: Record<string, string> = {
    cyan: 'rgba(6,182,212,0.3)',
    amber: 'rgba(245,158,11,0.3)',
    green: 'rgba(34,197,94,0.3)',
    red: 'rgba(239,68,68,0.3)',
    purple: 'rgba(139,92,246,0.3)',
    blue: 'rgba(59,130,246,0.3)',
    yellow: 'rgba(234,179,8,0.3)',
  };

  return (
    <div className="relative">
      <label className={`block text-slate-500 uppercase tracking-wider mb-1 ${compact ? 'text-[9px]' : 'text-[10px]'}`}>
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
          className={`w-full ${compact ? 'px-2 py-1.5 text-base' : 'px-3 py-2 text-lg'} bg-slate-950/80 rounded-lg border ${colorClasses[color]} font-mono transition-all outline-none placeholder-slate-600`}
          style={{
            boxShadow: isFocused ? `0 0 15px ${glowColors[color]}` : 'none',
          }}
        />
        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>
          {unit}
        </span>
      </div>
    </div>
  );
}

// ==================== PHASE METER WITH INPUT ====================
function PhaseMeterWithInput({
  phase,
  voltage,
  current,
  color,
  phaseColor,
  onVoltageChange,
  onCurrentChange,
}: {
  phase: string;
  voltage: number | null;
  current: number | null;
  color: string;
  phaseColor: 'red' | 'yellow' | 'blue';
  onVoltageChange: (value: number | null) => void;
  onCurrentChange: (value: number | null) => void;
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
          style={{ boxShadow: `0 0 10px ${phaseColor === 'red' ? '#ef4444' : phaseColor === 'yellow' ? '#eab308' : '#3b82f6'}` }}
        />
        <span className="text-lg font-bold text-white">{phase}</span>
      </div>

      {/* Voltage Input & Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <EditableInput
            label="Voltage"
            value={voltage}
            unit="V"
            min={0}
            max={280}
            step={1}
            onChange={onVoltageChange}
            color="cyan"
            compact
          />
        </div>
        <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${voltagePercent}%` }}
            transition={{ duration: 0.8 }}
            style={{ boxShadow: '0 0 10px rgba(6,182,212,0.5)' }}
          />
          <div className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50" style={{ left: '94%' }} />
        </div>
      </div>

      {/* Current Input & Bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <EditableInput
            label="Current"
            value={current}
            unit="A"
            min={0}
            max={500}
            step={0.1}
            onChange={onCurrentChange}
            color="amber"
            compact
          />
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
    <div className="p-4 bg-slate-950/50 rounded-xl border border-purple-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Power Triangle</h3>

      <div className="relative w-full h-40 flex items-center justify-center">
        <svg viewBox="0 0 200 130" className="w-full h-full max-w-[260px]">
          {[...Array(5)].map((_, i) => (
            <line key={`h-${i}`} x1="20" y1={20 + i * 22} x2="180" y2={20 + i * 22} stroke="rgba(100,116,139,0.1)" strokeWidth="1" />
          ))}
          {[...Array(7)].map((_, i) => (
            <line key={`v-${i}`} x1={20 + i * 27} y1="20" x2={20 + i * 27} y2="110" stroke="rgba(100,116,139,0.1)" strokeWidth="1" />
          ))}

          <motion.path d="M 30 105 L 150 105 L 150 40 Z" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.5)" strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} />

          <motion.line x1="30" y1="105" x2="150" y2="105" stroke="#22c55e" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
          <text x="90" y="122" textAnchor="middle" fill="#22c55e" fontSize="9" fontFamily="monospace">P = {activePower ?? '--'} kW</text>

          <motion.line x1="150" y1="105" x2="150" y2="40" stroke="#f59e0b" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.3 }} />
          <text x="168" y="72" textAnchor="start" fill="#f59e0b" fontSize="9" fontFamily="monospace">Q={reactivePower ?? '--'}</text>

          <motion.line x1="30" y1="105" x2="150" y2="40" stroke="#06b6d4" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.6 }} />
          <text x="72" y="62" textAnchor="middle" fill="#06b6d4" fontSize="9" fontFamily="monospace" transform="rotate(-28 72 62)">S = {apparentPower ?? '--'} kVA</text>

          <motion.path d={`M 48 105 A 18 18 0 0 0 ${48 + 15 * Math.cos(-angle * Math.PI / 180)} ${105 + 15 * Math.sin(-angle * Math.PI / 180)}`} fill="none" stroke="#a855f7" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.9 }} />
          <text x="66" y="95" fill="#a855f7" fontSize="8" fontFamily="monospace">φ={angle.toFixed(1)}°</text>
        </svg>
      </div>

      <div className="mt-2 text-center">
        <div className="inline-block px-4 py-2 bg-slate-900/80 rounded-lg border border-purple-500/30">
          <div className="text-[10px] text-slate-500 uppercase mb-1">Power Factor</div>
          <div className="text-2xl font-mono font-bold text-purple-400" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
            {powerFactor !== null ? powerFactor.toFixed(3) : '--'}
          </div>
          <div className={`text-[10px] mt-1 ${powerFactor === null ? 'text-slate-500' : powerFactor >= 0.95 ? 'text-green-400' : powerFactor >= 0.85 ? 'text-amber-400' : 'text-red-400'}`}>
            {powerFactor === null ? 'No Data' : powerFactor >= 0.95 ? 'EXCELLENT' : powerFactor >= 0.85 ? 'ACCEPTABLE' : 'POOR'}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== FREQUENCY DISPLAY ====================
function FrequencyDisplay({ frequency, onFrequencyChange }: { frequency: number | null; onFrequencyChange: (value: number | null) => void }) {
  const normalizedFreq = frequency !== null ? ((frequency - 45) / 20) * 100 : 50;

  return (
    <div className="p-4 bg-slate-950/50 rounded-xl border border-cyan-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Frequency</h3>

      <div className="relative h-20">
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-4 bg-slate-800 rounded-full">
          <div className="absolute h-full w-[20%] left-0 bg-red-500/20 rounded-l-full" />
          <div className="absolute h-full w-[20%] left-[20%] bg-amber-500/20" />
          <div className="absolute h-full w-[20%] left-[40%] bg-green-500/20" />
          <div className="absolute h-full w-[20%] left-[60%] bg-amber-500/20" />
          <div className="absolute h-full w-[20%] right-0 bg-red-500/20 rounded-r-full" />

          {[45, 48, 50, 52, 55, 60, 65].map((freq) => (
            <div key={freq} className="absolute top-full mt-1 transform -translate-x-1/2" style={{ left: `${((freq - 45) / 20) * 100}%` }}>
              <div className="w-px h-2 bg-slate-600 mx-auto" />
              <span className="text-[8px] text-slate-500 font-mono">{freq}</span>
            </div>
          ))}

          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-1 h-7 bg-white rounded-full"
            initial={{ left: '50%' }}
            animate={{ left: `${normalizedFreq}%` }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            style={{ boxShadow: '0 0 10px rgba(255,255,255,0.8)', transform: 'translateX(-50%) translateY(-50%)' }}
          />
        </div>
      </div>

      <div className="text-center mt-6">
        <div className="inline-block">
          <EditableInput
            label="Enter Frequency"
            value={frequency}
            unit="Hz"
            min={45}
            max={65}
            step={0.01}
            onChange={onFrequencyChange}
            color="cyan"
          />
        </div>
      </div>
    </div>
  );
}

// ==================== PHASOR DIAGRAM ====================
function PhasorDiagram({ voltageL1N, voltageL2N, voltageL3N }: { voltageL1N: number | null; voltageL2N: number | null; voltageL3N: number | null }) {
  const maxVoltage = 280;
  const scale = 55 / maxVoltage;
  const l1Length = (voltageL1N ?? 0) * scale;
  const l2Length = (voltageL2N ?? 0) * scale;
  const l3Length = (voltageL3N ?? 0) * scale;
  const l1Angle = 90, l2Angle = 210, l3Angle = 330;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  return (
    <div className="p-4 bg-slate-950/50 rounded-xl border border-cyan-500/30">
      <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 text-center">Phasor Diagram</h3>

      <div className="relative w-full h-40 flex items-center justify-center">
        <svg viewBox="0 0 140 140" className="w-full h-full max-w-[180px]">
          {[18, 36, 55].map(r => (
            <circle key={r} cx="70" cy="70" r={r} fill="none" stroke="rgba(100,116,139,0.2)" strokeWidth="1" strokeDasharray="4 4" />
          ))}

          <line x1="70" y1="10" x2="70" y2="130" stroke="rgba(100,116,139,0.1)" strokeWidth="1" />
          <line x1="10" y1="70" x2="130" y2="70" stroke="rgba(100,116,139,0.1)" strokeWidth="1" />

          <motion.line x1="70" y1="70" x2={70 + l1Length * Math.cos(toRad(l1Angle - 90))} y2={70 - l1Length * Math.sin(toRad(l1Angle - 90))} stroke="#ef4444" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
          <motion.circle cx={70 + l1Length * Math.cos(toRad(l1Angle - 90))} cy={70 - l1Length * Math.sin(toRad(l1Angle - 90))} r="3" fill="#ef4444" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
          <text x={70 + (l1Length + 10) * Math.cos(toRad(l1Angle - 90))} y={70 - (l1Length + 10) * Math.sin(toRad(l1Angle - 90))} fill="#ef4444" fontSize="9" textAnchor="middle">L1</text>

          <motion.line x1="70" y1="70" x2={70 + l2Length * Math.cos(toRad(l2Angle - 90))} y2={70 - l2Length * Math.sin(toRad(l2Angle - 90))} stroke="#eab308" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.2 }} />
          <motion.circle cx={70 + l2Length * Math.cos(toRad(l2Angle - 90))} cy={70 - l2Length * Math.sin(toRad(l2Angle - 90))} r="3" fill="#eab308" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
          <text x={70 + (l2Length + 10) * Math.cos(toRad(l2Angle - 90))} y={70 - (l2Length + 10) * Math.sin(toRad(l2Angle - 90))} fill="#eab308" fontSize="9" textAnchor="middle">L2</text>

          <motion.line x1="70" y1="70" x2={70 + l3Length * Math.cos(toRad(l3Angle - 90))} y2={70 - l3Length * Math.sin(toRad(l3Angle - 90))} stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.4 }} />
          <motion.circle cx={70 + l3Length * Math.cos(toRad(l3Angle - 90))} cy={70 - l3Length * Math.sin(toRad(l3Angle - 90))} r="3" fill="#3b82f6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }} />
          <text x={70 + (l3Length + 10) * Math.cos(toRad(l3Angle - 90))} y={70 - (l3Length + 10) * Math.sin(toRad(l3Angle - 90))} fill="#3b82f6" fontSize="9" textAnchor="middle">L3</text>

          <circle cx="70" cy="70" r="2" fill="rgba(255,255,255,0.8)" />

          <motion.g animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} style={{ transformOrigin: '70px 70px' }}>
            <circle cx="70" cy="70" r="62" fill="none" stroke="rgba(6,182,212,0.1)" strokeWidth="1" strokeDasharray="2 8" />
          </motion.g>
        </svg>
      </div>

      <div className="flex justify-center gap-3 mt-2">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-slate-400">L1:{voltageL1N ?? '--'}V</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /><span className="text-[10px] text-slate-400">L2:{voltageL2N ?? '--'}V</span></div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[10px] text-slate-400">L3:{voltageL3N ?? '--'}V</span></div>
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
  const [isEditMode, setIsEditMode] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">⚡</span>
          <div>
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Electrical Control Panel</h2>
            <p className="text-sm text-slate-500">Enter electrical parameters for analysis</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isEditMode ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400' : 'bg-slate-800/50 border border-slate-700 text-slate-400'}`}
          >
            {isEditMode ? '✏️ Edit Mode' : '👁️ View Mode'}
          </button>
          <div className="flex items-center gap-2">
            <motion.div className="w-2 h-2 rounded-full bg-green-500" animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            <span className="text-xs text-slate-400">SYNC</span>
          </div>
          <div className="px-3 py-1 bg-slate-800/50 rounded border border-slate-700/50">
            <span className="text-xs text-cyan-400 font-mono">3Φ 4W</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left - Phase Meters with Inputs */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <h3 className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-2">
            <span>📝</span> Phase Monitoring (Editable)
          </h3>
          <PhaseMeterWithInput
            phase="L1 (R)"
            voltage={parameters.voltageL1N}
            current={parameters.currentL1}
            color="bg-red-500"
            phaseColor="red"
            onVoltageChange={(val) => onParameterChange('voltageL1N', val)}
            onCurrentChange={(val) => onParameterChange('currentL1', val)}
          />
          <PhaseMeterWithInput
            phase="L2 (Y)"
            voltage={parameters.voltageL2N}
            current={parameters.currentL2}
            color="bg-yellow-500"
            phaseColor="yellow"
            onVoltageChange={(val) => onParameterChange('voltageL2N', val)}
            onCurrentChange={(val) => onParameterChange('currentL2', val)}
          />
          <PhaseMeterWithInput
            phase="L3 (B)"
            voltage={parameters.voltageL3N}
            current={parameters.currentL3}
            color="bg-blue-500"
            phaseColor="blue"
            onVoltageChange={(val) => onParameterChange('voltageL3N', val)}
            onCurrentChange={(val) => onParameterChange('currentL3', val)}
          />

          {/* Neutral Current */}
          <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-700/50">
            <EditableInput
              label="Neutral Current"
              value={parameters.currentNeutral}
              unit="A"
              min={0}
              max={200}
              step={0.1}
              onChange={(val) => onParameterChange('currentNeutral', val)}
              color="amber"
              icon="⚪"
            />
          </div>
        </div>

        {/* Center - Frequency & Power Triangle */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <FrequencyDisplay frequency={parameters.frequency} onFrequencyChange={(val) => onParameterChange('frequency', val)} />
          <PowerTriangle activePower={parameters.activePowerKw} reactivePower={parameters.reactivePowerKvar} apparentPower={parameters.apparentPowerKva} powerFactor={parameters.powerFactor} />
        </div>

        {/* Right - Phasor & Line-to-Line Inputs */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <PhasorDiagram voltageL1N={parameters.voltageL1N} voltageL2N={parameters.voltageL2N} voltageL3N={parameters.voltageL3N} />

          {/* Line-to-Line Voltage Inputs */}
          <div className="p-4 bg-slate-950/50 rounded-xl border border-amber-500/30">
            <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>📊</span> Line-to-Line Voltage
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-red-500" />
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-yellow-500" />
                </div>
                <div className="flex-1">
                  <EditableInput label="L1-L2" value={parameters.voltageL1L2} unit="V" min={0} max={480} step={1} onChange={(val) => onParameterChange('voltageL1L2', val)} color="amber" compact />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-blue-500" />
                </div>
                <div className="flex-1">
                  <EditableInput label="L2-L3" value={parameters.voltageL2L3} unit="V" min={0} max={480} step={1} onChange={(val) => onParameterChange('voltageL2L3', val)} color="amber" compact />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-blue-500" />
                  <div className="w-3 h-3 rounded-full border-2 border-slate-900 bg-red-500" />
                </div>
                <div className="flex-1">
                  <EditableInput label="L3-L1" value={parameters.voltageL3L1} unit="V" min={0} max={480} step={1} onChange={(val) => onParameterChange('voltageL3L1', val)} color="amber" compact />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom - Power Inputs */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/20">
        <h3 className="text-xs text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>⚡</span> Power Parameters (Editable)
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <EditableInput
            label="Active Power"
            value={parameters.activePowerKw}
            unit="kW"
            min={0}
            max={5000}
            step={0.1}
            onChange={(val) => onParameterChange('activePowerKw', val)}
            color="green"
            icon="⚡"
          />
          <EditableInput
            label="Reactive Power"
            value={parameters.reactivePowerKvar}
            unit="kVAr"
            min={-2000}
            max={2000}
            step={0.1}
            onChange={(val) => onParameterChange('reactivePowerKvar', val)}
            color="amber"
            icon="〰️"
          />
          <EditableInput
            label="Apparent Power"
            value={parameters.apparentPowerKva}
            unit="kVA"
            min={0}
            max={5000}
            step={0.1}
            onChange={(val) => onParameterChange('apparentPowerKva', val)}
            color="cyan"
            icon="📊"
          />
          <EditableInput
            label="Power Factor"
            value={parameters.powerFactor}
            unit="PF"
            min={0}
            max={1}
            step={0.001}
            onChange={(val) => onParameterChange('powerFactor', val)}
            color="purple"
            icon="φ"
          />
        </div>
      </div>

      {/* Quick Summary */}
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
