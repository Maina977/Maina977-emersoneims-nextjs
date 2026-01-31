'use client';

/**
 * Generator Oracle - Ultra-Premium Cockpit Interface
 * Inspired by: Mercedes EQS Hyperscreen, Tesla Model S Plaid, Airbus A380 Cockpit
 * Gulfstream G700, Concorde, Cadillac Celestiq, Aston Martin Lagonda
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface GeneratorParameters {
  // Engine Parameters
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

  // Electrical - Voltage
  voltageL1N: number | null;
  voltageL2N: number | null;
  voltageL3N: number | null;
  voltageL1L2: number | null;
  voltageL2L3: number | null;
  voltageL3L1: number | null;

  // Electrical - Current
  currentL1: number | null;
  currentL2: number | null;
  currentL3: number | null;
  currentNeutral: number | null;

  // Electrical - Power
  activePowerKw: number | null;
  reactivePowerKvar: number | null;
  apparentPowerKva: number | null;
  powerFactor: number | null;
  frequency: number | null;

  // Generator
  loadPercent: number | null;
  runningHours: number | null;
  startAttempts: number | null;

  // Battery & Charger
  batteryVoltage: number | null;
  chargerCurrent: number | null;
  chargerStatus: 'charging' | 'float' | 'off' | null;

  // Fuel System
  fuelLevel: number | null;
  fuelConsumptionRate: number | null;
  fuelUsedTotal: number | null;

  // Environment
  ambientTemp: number | null;
  controllerTemp: number | null;
}

const DEFAULT_PARAMETERS: GeneratorParameters = {
  rpm: null, oilPressure: null, oilTemperature: null, coolantTemp: null, coolantPressure: null,
  fuelPressure: null, engineHours: null, intakeAirTemp: null, exhaustTemp: null, turboBoostPressure: null,
  voltageL1N: null, voltageL2N: null, voltageL3N: null, voltageL1L2: null, voltageL2L3: null, voltageL3L1: null,
  currentL1: null, currentL2: null, currentL3: null, currentNeutral: null,
  activePowerKw: null, reactivePowerKvar: null, apparentPowerKva: null, powerFactor: null, frequency: null,
  loadPercent: null, runningHours: null, startAttempts: null,
  batteryVoltage: null, chargerCurrent: null, chargerStatus: null,
  fuelLevel: null, fuelConsumptionRate: null, fuelUsedTotal: null,
  ambientTemp: null, controllerTemp: null,
};

// ==================== AMBIENT BACKGROUND ====================
function AmbientBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0f]">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0d1117] via-[#0a0a0f] to-[#050508]" />

      {/* Horizontal scan lines */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Radial glow from center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(6,182,212,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(245,158,11,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_80%,rgba(139,92,246,0.05),transparent_50%)]" />

      {/* Animated pulse rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/10 rounded-full"
          style={{
            width: `${40 + i * 30}%`,
            height: `${40 + i * 30}%`,
          }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Corner brackets */}
      <svg className="absolute top-4 left-4 w-24 h-24 text-cyan-500/30">
        <path d="M0 40 L0 0 L40 0" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M0 60 L0 0 L60 0" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.5" />
      </svg>
      <svg className="absolute top-4 right-4 w-24 h-24 text-cyan-500/30 rotate-90">
        <path d="M0 40 L0 0 L40 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 left-4 w-24 h-24 text-cyan-500/30 -rotate-90">
        <path d="M0 40 L0 0 L40 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-4 right-4 w-24 h-24 text-cyan-500/30 rotate-180">
        <path d="M0 40 L0 0 L40 0" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>

      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-0.5 h-0.5 bg-cyan-400/50 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -20, -40],
          }}
          transition={{
            duration: 3 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// ==================== GLASS PANEL ====================
function GlassPanel({
  children,
  className = '',
  title,
  subtitle,
  icon,
  accentColor = 'cyan',
  glowIntensity = 'medium',
  noPadding = false,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  accentColor?: 'cyan' | 'amber' | 'purple' | 'green' | 'red';
  glowIntensity?: 'low' | 'medium' | 'high';
  noPadding?: boolean;
}) {
  const glowColors = {
    cyan: 'rgba(6,182,212,VAR)',
    amber: 'rgba(245,158,11,VAR)',
    purple: 'rgba(139,92,246,VAR)',
    green: 'rgba(34,197,94,VAR)',
    red: 'rgba(239,68,68,VAR)',
  };

  const intensityValues = {
    low: 0.1,
    medium: 0.2,
    high: 0.35,
  };

  const glowColor = glowColors[accentColor].replace('VAR', intensityValues[glowIntensity].toString());
  const borderColor = glowColors[accentColor].replace('VAR', '0.3');

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-2xl backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(10,10,15,0.95) 100%)`,
          boxShadow: `0 0 40px ${glowColor}, inset 0 1px 1px rgba(255,255,255,0.05)`,
        }}
      />

      {/* Gradient border */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${borderColor}, transparent 50%, ${borderColor})`,
          padding: '1px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-${accentColor}-500/50 rounded-tl-2xl`} />
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-${accentColor}-500/50 rounded-tr-2xl`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-${accentColor}-500/50 rounded-bl-2xl`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-${accentColor}-500/50 rounded-br-2xl`} />

      {/* Content */}
      <div className={`relative z-10 ${noPadding ? '' : 'p-6'}`}>
        {(title || icon) && (
          <div className="flex items-center gap-3 mb-4">
            {icon && <span className="text-2xl">{icon}</span>}
            <div>
              {title && (
                <h3 className={`text-sm font-bold uppercase tracking-[0.2em] text-${accentColor}-400`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

// ==================== CIRCULAR GAUGE (Aircraft Style) ====================
function AircraftGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  size = 140,
  warningThreshold,
  criticalThreshold,
  decimals = 0,
  showArc = true,
  accentColor = 'cyan',
}: {
  value: number | null;
  min?: number;
  max?: number;
  label: string;
  unit: string;
  size?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  decimals?: number;
  showArc?: boolean;
  accentColor?: 'cyan' | 'amber' | 'green' | 'purple' | 'red';
}) {
  const percentage = value !== null ? Math.min(Math.max((value - min) / (max - min) * 100, 0), 100) : 0;
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const getStatus = () => {
    if (value === null) return 'inactive';
    if (criticalThreshold !== undefined && value >= criticalThreshold) return 'critical';
    if (warningThreshold !== undefined && value >= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = getStatus();
  const statusColors = {
    inactive: { stroke: '#334155', text: 'text-slate-500', glow: 'transparent' },
    normal: { stroke: `var(--color-${accentColor}-500)`, text: `text-${accentColor}-400`, glow: `var(--color-${accentColor}-500)` },
    warning: { stroke: '#f59e0b', text: 'text-amber-400', glow: '#f59e0b' },
    critical: { stroke: '#ef4444', text: 'text-red-400', glow: '#ef4444' },
  };

  const colors = statusColors[status];

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(51,65,85,0.5)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />

        {/* Tick marks */}
        {[...Array(10)].map((_, i) => {
          const angle = (i / 9) * 270 - 135;
          const rad = (angle * Math.PI) / 180;
          const innerR = radius - 12;
          const outerR = radius - 6;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * Math.cos(rad)}
              y1={size / 2 + innerR * Math.sin(rad)}
              x2={size / 2 + outerR * Math.cos(rad)}
              y2={size / 2 + outerR * Math.sin(rad)}
              stroke={i <= percentage / 11 ? colors.stroke : 'rgba(100,116,139,0.3)'}
              strokeWidth="2"
              className="transform rotate-[135deg] origin-center"
              style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
            />
          );
        })}

        {/* Progress arc */}
        {showArc && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${colors.glow})`,
            }}
          />
        )}

        {/* Glow effect */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.glow}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          opacity="0.15"
          style={{ filter: 'blur(8px)' }}
        />
      </svg>

      {/* Center display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-bold font-mono ${colors.text}`} style={{ textShadow: `0 0 20px ${colors.glow}` }}>
          {value !== null ? value.toFixed(decimals) : '--'}
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-wider">{unit}</span>
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
      </div>

      {/* Status indicator */}
      {status !== 'inactive' && status !== 'normal' && (
        <motion.div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ boxShadow: `0 0 10px ${status === 'warning' ? '#f59e0b' : '#ef4444'}` }}
        />
      )}
    </div>
  );
}

// ==================== LINEAR BAR GAUGE ====================
function LinearBarGauge({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  width = 200,
  warningThreshold,
  criticalThreshold,
  showValue = true,
  accentColor = 'cyan',
  orientation = 'horizontal',
}: {
  value: number | null;
  min?: number;
  max?: number;
  label: string;
  unit: string;
  width?: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  showValue?: boolean;
  accentColor?: 'cyan' | 'amber' | 'green' | 'purple';
  orientation?: 'horizontal' | 'vertical';
}) {
  const percentage = value !== null ? Math.min(Math.max((value - min) / (max - min) * 100, 0), 100) : 0;

  const getColor = () => {
    if (value === null) return 'bg-slate-700';
    if (criticalThreshold !== undefined && value >= criticalThreshold) return 'bg-red-500';
    if (warningThreshold !== undefined && value >= warningThreshold) return 'bg-amber-500';
    return `bg-${accentColor}-500`;
  };

  const getGlow = () => {
    if (value === null) return 'transparent';
    if (criticalThreshold !== undefined && value >= criticalThreshold) return 'rgba(239,68,68,0.5)';
    if (warningThreshold !== undefined && value >= warningThreshold) return 'rgba(245,158,11,0.5)';
    return `rgba(6,182,212,0.5)`;
  };

  return (
    <div className={`flex ${orientation === 'vertical' ? 'flex-col items-center' : 'items-center gap-4'}`}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-400 uppercase tracking-wider truncate">{label}</span>
          {showValue && (
            <span className="text-sm font-mono text-cyan-400">
              {value !== null ? `${value.toFixed(1)} ${unit}` : `-- ${unit}`}
            </span>
          )}
        </div>
        <div
          className="relative h-2 bg-slate-800/50 rounded-full overflow-hidden"
          style={{ width: orientation === 'horizontal' ? width : '100%' }}
        >
          {/* Track marks */}
          <div className="absolute inset-0 flex justify-between px-0.5">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-px h-full bg-slate-700/50" />
            ))}
          </div>

          {/* Progress bar */}
          <motion.div
            className={`h-full rounded-full ${getColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ boxShadow: `0 0 15px ${getGlow()}` }}
          />

          {/* Warning/Critical markers */}
          {warningThreshold !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50"
              style={{ left: `${((warningThreshold - min) / (max - min)) * 100}%` }}
            />
          )}
          {criticalThreshold !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500/50"
              style={{ left: `${((criticalThreshold - min) / (max - min)) * 100}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ==================== DIGITAL READOUT ====================
function DigitalReadout({
  value,
  label,
  unit,
  decimals = 1,
  size = 'md',
  status = 'normal',
}: {
  value: number | null;
  label: string;
  unit: string;
  decimals?: number;
  size?: 'sm' | 'md' | 'lg';
  status?: 'normal' | 'warning' | 'critical' | 'inactive';
}) {
  const sizeClasses = {
    sm: { value: 'text-lg', label: 'text-[10px]' },
    md: { value: 'text-2xl', label: 'text-xs' },
    lg: { value: 'text-4xl', label: 'text-sm' },
  };

  const statusColors = {
    normal: 'text-cyan-400',
    warning: 'text-amber-400',
    critical: 'text-red-400',
    inactive: 'text-slate-600',
  };

  const glowColors = {
    normal: '0 0 20px rgba(6,182,212,0.5)',
    warning: '0 0 20px rgba(245,158,11,0.5)',
    critical: '0 0 20px rgba(239,68,68,0.5)',
    inactive: 'none',
  };

  return (
    <div className="flex flex-col items-center">
      <span className={`${sizeClasses[size].label} text-slate-500 uppercase tracking-[0.15em] mb-1`}>
        {label}
      </span>
      <div
        className="px-4 py-2 bg-slate-950/80 rounded-lg border border-slate-700/50 backdrop-blur-sm"
        style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)' }}
      >
        <span
          className={`${sizeClasses[size].value} font-mono font-bold ${statusColors[status]}`}
          style={{ textShadow: glowColors[status] }}
        >
          {value !== null ? value.toFixed(decimals) : '--'}
        </span>
        <span className={`${sizeClasses[size].label} text-slate-500 ml-1`}>{unit}</span>
      </div>
    </div>
  );
}

// ==================== STATUS INDICATOR ====================
function StatusIndicator({
  status,
  label,
  size = 'md',
}: {
  status: 'online' | 'offline' | 'warning' | 'error' | 'standby';
  label: string;
  size?: 'sm' | 'md';
}) {
  const statusConfig = {
    online: { color: 'bg-green-500', glow: '#22c55e', text: 'ONLINE' },
    offline: { color: 'bg-slate-600', glow: 'transparent', text: 'OFFLINE' },
    warning: { color: 'bg-amber-500', glow: '#f59e0b', text: 'WARNING' },
    error: { color: 'bg-red-500', glow: '#ef4444', text: 'ERROR' },
    standby: { color: 'bg-blue-500', glow: '#3b82f6', text: 'STANDBY' },
  };

  const config = statusConfig[status];
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`${dotSize} rounded-full ${config.color}`}
        animate={status !== 'offline' ? { opacity: [1, 0.4, 1] } : {}}
        transition={{ duration: status === 'error' ? 0.5 : 1.5, repeat: Infinity }}
        style={{ boxShadow: `0 0 10px ${config.glow}` }}
      />
      <span className={`${size === 'sm' ? 'text-[10px]' : 'text-xs'} text-slate-400 uppercase tracking-wider`}>
        {label}
      </span>
    </div>
  );
}

// ==================== PARAMETER INPUT ====================
function ParameterInput({
  label,
  value,
  onChange,
  unit,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value ? parseFloat(e.target.value) : null)}
          min={min}
          max={max}
          step={step}
          placeholder="--"
          className="w-full px-3 py-2 bg-slate-950/80 border border-slate-700/50 rounded-lg text-cyan-400 font-mono text-sm focus:outline-none focus:border-cyan-500/50 placeholder-slate-600"
          style={{ boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)' }}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{unit}</span>
      </div>
    </div>
  );
}

// ==================== CONTROL BUTTON ====================
function ControlButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
}) {
  const variants = {
    primary: 'from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 shadow-cyan-500/25',
    secondary: 'from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 shadow-slate-500/10',
    danger: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-500/25',
    success: 'from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 shadow-green-500/25',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative ${sizes[size]} rounded-lg font-medium uppercase tracking-wider
        bg-gradient-to-br ${variants[variant]} shadow-lg
        transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        overflow-hidden
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2 text-white">
        {icon && <span>{icon}</span>}
        {loading ? (
          <motion.div
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        ) : children}
      </span>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
}

// ==================== MAIN COCKPIT INTERFACE ====================
export default function CockpitInterface({
  onFaultSearch,
  onResetGuidance,
  controllerModel,
  totalFaultCodes,
}: {
  onFaultSearch: (query: string) => void;
  onResetGuidance: (faultCode: string) => void;
  controllerModel: string | null;
  totalFaultCodes: number;
}) {
  const [parameters, setParameters] = useState<GeneratorParameters>(DEFAULT_PARAMETERS);
  const [activeScreen, setActiveScreen] = useState<'command' | 'engine' | 'electrical' | 'fuel' | 'faults' | 'settings'>('command');
  const [systemTime, setSystemTime] = useState(new Date());
  const [generatorStatus, setGeneratorStatus] = useState<'running' | 'standby' | 'fault' | 'off'>('standby');
  const [searchQuery, setSearchQuery] = useState('');

  // System clock
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Update single parameter
  const updateParam = useCallback(<K extends keyof GeneratorParameters>(
    key: K,
    value: GeneratorParameters[K]
  ) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  }, []);

  return (
    <div className="min-h-screen text-white overflow-hidden">
      <AmbientBackground />

      <div className="relative z-10 flex flex-col h-screen">
        {/* ==================== TOP COMMAND BAR ==================== */}
        <header className="flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/20">
          <div className="max-w-[1920px] mx-auto px-6">
            {/* Primary Status Bar */}
            <div className="flex items-center justify-between py-2 border-b border-slate-800/50">
              <div className="flex items-center gap-6">
                <StatusIndicator status={generatorStatus === 'running' ? 'online' : generatorStatus === 'fault' ? 'error' : 'standby'} label="Generator" />
                <StatusIndicator status="online" label="Controller" size="sm" />
                <StatusIndicator status="online" label="Network" size="sm" />
                <StatusIndicator status="online" label="Database" size="sm" />
              </div>

              <div className="flex items-center gap-6">
                {/* Quick Stats */}
                <div className="hidden lg:flex items-center gap-4 px-4 py-1 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Codes</div>
                    <div className="text-sm font-mono text-cyan-400">{totalFaultCodes.toLocaleString()}</div>
                  </div>
                  <div className="w-px h-6 bg-slate-700" />
                  <div className="text-center">
                    <div className="text-[10px] text-slate-500 uppercase">Controller</div>
                    <div className="text-sm font-mono text-cyan-400">{controllerModel || 'None'}</div>
                  </div>
                </div>

                {/* System Time */}
                <div className="flex items-center gap-2 px-4 py-1 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-mono text-sm text-cyan-400">
                    {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                  </span>
                </div>
              </div>
            </div>

            {/* Main Header */}
            <div className="flex items-center justify-between py-4">
              {/* Logo & Title */}
              <div className="flex items-center gap-4">
                <motion.div
                  className="relative w-14 h-14"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700 flex items-center justify-center"
                    style={{ boxShadow: '0 0 30px rgba(6,182,212,0.5)' }}
                  >
                    <span className="text-2xl">⚡</span>
                  </div>
                </motion.div>

                <div>
                  <h1 className="text-2xl font-bold tracking-wider">
                    <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      GENERATOR ORACLE
                    </span>
                  </h1>
                  <p className="text-xs text-slate-500 uppercase tracking-[0.3em]">Professional Diagnostic System</p>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/50 rounded-xl border border-slate-700/50">
                {[
                  { id: 'command', label: 'Command', icon: '🎛️' },
                  { id: 'engine', label: 'Engine', icon: '⚙️' },
                  { id: 'electrical', label: 'Electrical', icon: '⚡' },
                  { id: 'fuel', label: 'Fuel', icon: '⛽' },
                  { id: 'faults', label: 'Faults', icon: '🔧' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveScreen(tab.id as typeof activeScreen)}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium uppercase tracking-wider transition-all
                      ${activeScreen === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}
                    `}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>

              {/* Emergency Stop */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-br from-red-600 to-red-800 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg shadow-red-500/30"
              >
                <span className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  E-STOP
                </span>
              </motion.button>
            </div>
          </div>
        </header>

        {/* ==================== MAIN CONTENT AREA ==================== */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-[1920px] mx-auto">
            <AnimatePresence mode="wait">
              {/* ==================== COMMAND CENTER ==================== */}
              {activeScreen === 'command' && (
                <motion.div
                  key="command"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-12 gap-6"
                >
                  {/* Left Panel - Primary Gauges */}
                  <div className="col-span-12 lg:col-span-3 space-y-6">
                    <GlassPanel title="Engine Vitals" icon="⚙️" accentColor="amber">
                      <div className="grid grid-cols-2 gap-4">
                        <AircraftGauge
                          value={parameters.rpm}
                          min={0}
                          max={2000}
                          label="RPM"
                          unit="rpm"
                          size={120}
                          warningThreshold={1600}
                          criticalThreshold={1800}
                          decimals={0}
                          accentColor="amber"
                        />
                        <AircraftGauge
                          value={parameters.oilPressure}
                          min={0}
                          max={100}
                          label="Oil Press"
                          unit="PSI"
                          size={120}
                          warningThreshold={20}
                          criticalThreshold={10}
                          accentColor="green"
                        />
                        <AircraftGauge
                          value={parameters.coolantTemp}
                          min={0}
                          max={120}
                          label="Coolant"
                          unit="°C"
                          size={120}
                          warningThreshold={95}
                          criticalThreshold={105}
                          accentColor="cyan"
                        />
                        <AircraftGauge
                          value={parameters.loadPercent}
                          min={0}
                          max={100}
                          label="Load"
                          unit="%"
                          size={120}
                          warningThreshold={85}
                          criticalThreshold={95}
                          accentColor="purple"
                        />
                      </div>
                    </GlassPanel>

                    <GlassPanel title="Fuel System" icon="⛽" accentColor="amber">
                      <div className="space-y-4">
                        <div className="relative h-32 bg-slate-950/50 rounded-xl border border-amber-500/30 overflow-hidden">
                          {/* Fuel tank visualization */}
                          <motion.div
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400"
                            initial={{ height: 0 }}
                            animate={{ height: `${parameters.fuelLevel || 0}%` }}
                            transition={{ duration: 1 }}
                            style={{ boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold font-mono text-white drop-shadow-lg">
                              {parameters.fuelLevel !== null ? `${parameters.fuelLevel}%` : '--'}
                            </span>
                          </div>
                          {/* Level marks */}
                          {[25, 50, 75].map(level => (
                            <div
                              key={level}
                              className="absolute left-0 right-0 border-t border-dashed border-slate-600/50"
                              style={{ bottom: `${level}%` }}
                            >
                              <span className="absolute right-2 -top-2 text-[10px] text-slate-500">{level}%</span>
                            </div>
                          ))}
                        </div>
                        <LinearBarGauge
                          value={parameters.fuelConsumptionRate}
                          min={0}
                          max={50}
                          label="Consumption Rate"
                          unit="L/hr"
                          accentColor="amber"
                        />
                      </div>
                    </GlassPanel>
                  </div>

                  {/* Center Panel - Main Display */}
                  <div className="col-span-12 lg:col-span-6 space-y-6">
                    {/* Generator Status Display */}
                    <GlassPanel accentColor="cyan" glowIntensity="high" noPadding>
                      <div className="p-6">
                        {/* Status Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className={`w-4 h-4 rounded-full ${
                                generatorStatus === 'running' ? 'bg-green-500' :
                                generatorStatus === 'fault' ? 'bg-red-500' :
                                'bg-blue-500'
                              }`}
                              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              style={{ boxShadow: `0 0 15px ${generatorStatus === 'running' ? '#22c55e' : generatorStatus === 'fault' ? '#ef4444' : '#3b82f6'}` }}
                            />
                            <div>
                              <h2 className="text-xl font-bold uppercase tracking-wider text-white">Generator Status</h2>
                              <p className={`text-sm uppercase tracking-wider ${
                                generatorStatus === 'running' ? 'text-green-400' :
                                generatorStatus === 'fault' ? 'text-red-400' :
                                'text-blue-400'
                              }`}>
                                {generatorStatus.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          {/* Control Buttons */}
                          <div className="flex gap-3">
                            <ControlButton
                              variant="success"
                              icon="▶️"
                              onClick={() => setGeneratorStatus('running')}
                            >
                              Start
                            </ControlButton>
                            <ControlButton
                              variant="secondary"
                              icon="⏹️"
                              onClick={() => setGeneratorStatus('standby')}
                            >
                              Stop
                            </ControlButton>
                          </div>
                        </div>

                        {/* Main Power Display */}
                        <div className="grid grid-cols-4 gap-6 mb-6">
                          <DigitalReadout
                            value={parameters.activePowerKw}
                            label="Active Power"
                            unit="kW"
                            size="lg"
                          />
                          <DigitalReadout
                            value={parameters.apparentPowerKva}
                            label="Apparent Power"
                            unit="kVA"
                            size="lg"
                          />
                          <DigitalReadout
                            value={parameters.reactivePowerKvar}
                            label="Reactive Power"
                            unit="kVAr"
                            size="lg"
                          />
                          <DigitalReadout
                            value={parameters.powerFactor}
                            label="Power Factor"
                            unit="PF"
                            size="lg"
                            decimals={2}
                          />
                        </div>

                        {/* Voltage & Frequency Bar */}
                        <div className="grid grid-cols-4 gap-4 p-4 bg-slate-950/50 rounded-xl border border-cyan-500/20">
                          <div className="text-center">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">Voltage L1-N</div>
                            <div className="text-2xl font-mono text-cyan-400">{parameters.voltageL1N ?? '--'}<span className="text-sm text-slate-500 ml-1">V</span></div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">Voltage L2-N</div>
                            <div className="text-2xl font-mono text-cyan-400">{parameters.voltageL2N ?? '--'}<span className="text-sm text-slate-500 ml-1">V</span></div>
                          </div>
                          <div className="text-center">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">Voltage L3-N</div>
                            <div className="text-2xl font-mono text-cyan-400">{parameters.voltageL3N ?? '--'}<span className="text-sm text-slate-500 ml-1">V</span></div>
                          </div>
                          <div className="text-center border-l border-slate-700">
                            <div className="text-[10px] text-slate-500 uppercase mb-1">Frequency</div>
                            <div className="text-2xl font-mono text-amber-400">{parameters.frequency ?? '--'}<span className="text-sm text-slate-500 ml-1">Hz</span></div>
                          </div>
                        </div>
                      </div>
                    </GlassPanel>

                    {/* Quick Fault Search */}
                    <GlassPanel title="Fault Code Search" icon="🔍" accentColor="purple">
                      <div className="space-y-4">
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onFaultSearch(searchQuery)}
                            placeholder="Enter fault code or description..."
                            className="w-full px-4 py-3 bg-slate-950/80 border border-purple-500/30 rounded-xl text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/50"
                            style={{ boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)' }}
                          />
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onFaultSearch(searchQuery)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg border border-purple-500/30 text-sm font-medium"
                          >
                            Search
                          </motion.button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {['E1234', 'Low Oil', 'Over Speed', 'High Temp', 'Battery'].map(tag => (
                            <button
                              key={tag}
                              onClick={() => {
                                setSearchQuery(tag);
                                onFaultSearch(tag);
                              }}
                              className="px-3 py-1 bg-slate-800/50 text-slate-400 rounded-lg border border-slate-700/50 text-xs hover:bg-slate-700/50 hover:text-white transition-all"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </GlassPanel>

                    {/* Parameter Input Grid */}
                    <GlassPanel title="Live Parameter Input" icon="📊" accentColor="green">
                      <div className="grid grid-cols-5 gap-4">
                        <ParameterInput
                          label="Voltage L1-N"
                          value={parameters.voltageL1N}
                          onChange={(v) => updateParam('voltageL1N', v)}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <ParameterInput
                          label="Voltage L2-N"
                          value={parameters.voltageL2N}
                          onChange={(v) => updateParam('voltageL2N', v)}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <ParameterInput
                          label="Voltage L3-N"
                          value={parameters.voltageL3N}
                          onChange={(v) => updateParam('voltageL3N', v)}
                          unit="V"
                          min={0}
                          max={500}
                        />
                        <ParameterInput
                          label="Frequency"
                          value={parameters.frequency}
                          onChange={(v) => updateParam('frequency', v)}
                          unit="Hz"
                          min={45}
                          max={65}
                          step={0.1}
                        />
                        <ParameterInput
                          label="RPM"
                          value={parameters.rpm}
                          onChange={(v) => updateParam('rpm', v)}
                          unit="rpm"
                          min={0}
                          max={2000}
                        />
                        <ParameterInput
                          label="Oil Pressure"
                          value={parameters.oilPressure}
                          onChange={(v) => updateParam('oilPressure', v)}
                          unit="PSI"
                          min={0}
                          max={100}
                        />
                        <ParameterInput
                          label="Coolant Temp"
                          value={parameters.coolantTemp}
                          onChange={(v) => updateParam('coolantTemp', v)}
                          unit="°C"
                          min={0}
                          max={120}
                        />
                        <ParameterInput
                          label="Load %"
                          value={parameters.loadPercent}
                          onChange={(v) => updateParam('loadPercent', v)}
                          unit="%"
                          min={0}
                          max={100}
                        />
                        <ParameterInput
                          label="Battery"
                          value={parameters.batteryVoltage}
                          onChange={(v) => updateParam('batteryVoltage', v)}
                          unit="V"
                          min={0}
                          max={30}
                          step={0.1}
                        />
                        <ParameterInput
                          label="Fuel Level"
                          value={parameters.fuelLevel}
                          onChange={(v) => updateParam('fuelLevel', v)}
                          unit="%"
                          min={0}
                          max={100}
                        />
                      </div>

                      <div className="mt-4 flex justify-end">
                        <ControlButton variant="primary" icon="🔍">
                          Run Diagnosis
                        </ControlButton>
                      </div>
                    </GlassPanel>
                  </div>

                  {/* Right Panel - Electrical */}
                  <div className="col-span-12 lg:col-span-3 space-y-6">
                    <GlassPanel title="Electrical Output" icon="⚡" accentColor="cyan">
                      <div className="space-y-4">
                        {/* Current readings */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: 'L1', value: parameters.currentL1 },
                            { label: 'L2', value: parameters.currentL2 },
                            { label: 'L3', value: parameters.currentL3 },
                          ].map(({ label, value }) => (
                            <div key={label} className="text-center p-3 bg-slate-950/50 rounded-lg border border-cyan-500/20">
                              <div className="text-[10px] text-slate-500 uppercase">Current {label}</div>
                              <div className="text-lg font-mono text-cyan-400">{value ?? '--'}<span className="text-xs text-slate-500 ml-0.5">A</span></div>
                            </div>
                          ))}
                        </div>

                        {/* Line-to-Line Voltages */}
                        <div className="p-3 bg-slate-950/50 rounded-lg border border-cyan-500/20">
                          <div className="text-[10px] text-slate-500 uppercase mb-2">Line-to-Line Voltage</div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-xs text-slate-400">L1-L2</div>
                              <div className="font-mono text-cyan-400">{parameters.voltageL1L2 ?? '--'}V</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">L2-L3</div>
                              <div className="font-mono text-cyan-400">{parameters.voltageL2L3 ?? '--'}V</div>
                            </div>
                            <div>
                              <div className="text-xs text-slate-400">L3-L1</div>
                              <div className="font-mono text-cyan-400">{parameters.voltageL3L1 ?? '--'}V</div>
                            </div>
                          </div>
                        </div>

                        {/* Load bar */}
                        <LinearBarGauge
                          value={parameters.loadPercent}
                          min={0}
                          max={100}
                          label="Generator Load"
                          unit="%"
                          warningThreshold={80}
                          criticalThreshold={95}
                        />
                      </div>
                    </GlassPanel>

                    <GlassPanel title="Battery System" icon="🔋" accentColor="green">
                      <div className="space-y-4">
                        <AircraftGauge
                          value={parameters.batteryVoltage}
                          min={0}
                          max={30}
                          label="Battery"
                          unit="V"
                          size={140}
                          warningThreshold={11}
                          criticalThreshold={10}
                          decimals={1}
                          accentColor="green"
                        />

                        <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-green-500/20">
                          <span className="text-xs text-slate-400">Charger Status</span>
                          <span className={`text-sm font-medium ${
                            parameters.chargerStatus === 'charging' ? 'text-amber-400' :
                            parameters.chargerStatus === 'float' ? 'text-green-400' :
                            'text-slate-500'
                          }`}>
                            {parameters.chargerStatus?.toUpperCase() || 'OFF'}
                          </span>
                        </div>

                        <LinearBarGauge
                          value={parameters.chargerCurrent}
                          min={0}
                          max={20}
                          label="Charger Current"
                          unit="A"
                          accentColor="green"
                        />
                      </div>
                    </GlassPanel>

                    <GlassPanel title="Run Time" icon="⏱️" accentColor="purple">
                      <div className="text-center">
                        <div className="text-4xl font-mono text-purple-400 mb-2" style={{ textShadow: '0 0 20px rgba(139,92,246,0.5)' }}>
                          {parameters.engineHours !== null ? parameters.engineHours.toFixed(1) : '--'}
                        </div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider">Engine Hours</div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="text-center p-2 bg-slate-950/50 rounded-lg">
                          <div className="text-sm font-mono text-slate-300">{parameters.runningHours ?? '--'}</div>
                          <div className="text-[10px] text-slate-500">Running Hrs</div>
                        </div>
                        <div className="text-center p-2 bg-slate-950/50 rounded-lg">
                          <div className="text-sm font-mono text-slate-300">{parameters.startAttempts ?? '--'}</div>
                          <div className="text-[10px] text-slate-500">Start Count</div>
                        </div>
                      </div>
                    </GlassPanel>
                  </div>
                </motion.div>
              )}

              {/* Other screens will be implemented similarly */}
              {activeScreen !== 'command' && (
                <motion.div
                  key={activeScreen}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-center h-[60vh]"
                >
                  <GlassPanel accentColor="cyan">
                    <div className="text-center py-12 px-20">
                      <div className="text-6xl mb-4">🚧</div>
                      <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-wider mb-2">
                        {activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)} Panel
                      </h2>
                      <p className="text-slate-400">
                        This advanced control panel is being configured...
                      </p>
                    </div>
                  </GlassPanel>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        {/* ==================== BOTTOM STATUS BAR ==================== */}
        <footer className="flex-shrink-0 bg-slate-950/80 backdrop-blur-xl border-t border-cyan-500/20 py-2 px-6">
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>Generator Oracle v2.0</span>
              <span>•</span>
              <span>Compatible with DSE, ComAp, Woodward, SmartGen, PowerWizard</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500">FREE until March 1, 2026</span>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs font-medium">TRIAL ACTIVE</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
