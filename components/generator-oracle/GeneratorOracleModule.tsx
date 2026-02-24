'use client';

/**
 * Generator Oracle - ULTRA-PREMIUM COCKPIT INTERFACE v3.0
 * The World's Most Advanced Generator Diagnostic System
 *
 * Design Inspirations:
 * - Tesla Model S Plaid Dashboard
 * - Airbus A380 Flight Deck
 * - Mercedes-AMG EQS Hyperscreen
 * - Gulfstream G700 Symmetry Cockpit
 * - Sci-Fi Movie Interfaces (Iron Man, Tron, Avatar)
 * - SpaceX Dragon Crew Interface
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  getAllFaultCodes,
  searchFaultCodes,
  getFaultCodesByBrand,
  getFaultCodesByModel,
  getTotalFaultCodeCount,
  CONTROLLER_BRANDS,
  type ControllerFaultCode,
} from '@/lib/generator-oracle/controllerFaultCodes';
import {
  getOracleTranslation,
  SUPPORTED_ORACLE_LANGUAGES,
  type OracleTranslations,
} from '@/lib/generator-oracle/oracleTranslations';
import {
  initDatabase,
  getSetting,
  saveSetting,
  isDatabaseAvailable,
  initializeOfflineData,
  getDiagnosisHistory,
  saveDiagnosisHistory,
  saveFeedback,
  type DiagnosisHistoryEntry,
} from '@/lib/generator-oracle/indexedDBService';
import LicenseGate from './LicenseGate';
import InstallPrompt from './InstallPrompt';
import EnginePanel from './panels/EnginePanel';
import ElectricalPanel from './panels/ElectricalPanel';
import FaultDiagnosticsPanel from './panels/FaultDiagnosticsPanel';
import TechnicianAssistantPanel from './panels/TechnicianAssistantPanel';
import AdvancedDiagnosticsPanel from './panels/AdvancedDiagnosticsPanel';
import WiringDiagramsPanel from './panels/WiringDiagramsPanel';
import ControllerSimulator, { CONTROLLER_TYPES } from './ControllerSimulator';
import DetailedFaultDisplay, { DETAILED_FAULT_CODES } from './DetailedFaultDisplay';
import { AnalogClock, AnalogCalendar } from '@/components/ui/AnalogWidgets';
import AllControllerWiringDiagrams from './AllControllerWiringDiagrams';
import TechnicianInputDiagnostics from './TechnicianInputDiagnostics';
// New Advanced Panels
import RealTimeMonitoringPanel from './panels/RealTimeMonitoringPanel';
import OBDProtocolPanel from './panels/OBDProtocolPanel';
import RemoteConnectivityPanel from './panels/RemoteConnectivityPanel';
import PredictiveMaintenancePanel from './panels/PredictiveMaintenancePanel';
import DataRecordingPanel from './panels/DataRecordingPanel';
import ControllerRepairManualsPanel from './panels/ControllerRepairManualsPanel';

// ==================== TYPES ====================
interface GeneratorParameters {
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
  loadPercent: number | null;
  runningHours: number | null;
  startAttempts: number | null;
  batteryVoltage: number | null;
  chargerCurrent: number | null;
  chargerStatus: 'charging' | 'float' | 'off' | null;
  fuelLevel: number | null;
  fuelConsumptionRate: number | null;
  fuelUsedTotal: number | null;
  ambientTemp: number | null;
  controllerTemp: number | null;
}

const DEFAULT_PARAMETERS: GeneratorParameters = {
  rpm: 1500, oilPressure: 45, oilTemperature: 85, coolantTemp: 78, coolantPressure: 15,
  fuelPressure: 35, engineHours: 2847.5, intakeAirTemp: 32, exhaustTemp: 420, turboBoostPressure: 18,
  voltageL1N: 230, voltageL2N: 232, voltageL3N: 229, voltageL1L2: 400, voltageL2L3: 402, voltageL3L1: 398,
  currentL1: 125, currentL2: 128, currentL3: 122, currentNeutral: 8,
  activePowerKw: 85, reactivePowerKvar: 32, apparentPowerKva: 91, powerFactor: 0.93, frequency: 50.02,
  loadPercent: 72, runningHours: 1847, startAttempts: 342,
  batteryVoltage: 13.8, chargerCurrent: 2.5, chargerStatus: 'float',
  fuelLevel: 78, fuelConsumptionRate: 18.5, fuelUsedTotal: 12450,
  ambientTemp: 28, controllerTemp: 42,
};

// ==================== HEXAGONAL GRID BACKGROUND ====================
function HexagonalGrid() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hexagons" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1)">
          <path
            d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100"
            fill="none"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="0.5"
          />
          <path
            d="M28 0L56 16L56 50L28 66L0 50L0 16Z"
            fill="none"
            stroke="rgba(6,182,212,0.3)"
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagons)" />
    </svg>
  );
}

// ==================== ULTRA-PREMIUM COCKPIT BACKGROUND ====================
function UltraCockpitBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#020205]">
      {/* Deep space gradient with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14] via-[#030306] to-[#000002]" />
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/5 via-transparent to-purple-950/5" />

      {/* Hexagonal grid overlay */}
      <HexagonalGrid />

      {/* Animated holographic grid */}
      <motion.div
        className="absolute inset-0 opacity-[0.02]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      {/* Multiple radial glows - Aurora effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(6,182,212,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_50%,rgba(245,158,11,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_50%,rgba(139,92,246,0.08),transparent_45%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(34,197,94,0.06),transparent_50%)]" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,rgba(6,182,212,0.1),transparent_40%)]"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Primary scanning beam - horizontal */}
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
        animate={{ top: ['-5%', '105%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 40px 15px rgba(6,182,212,0.3), 0 0 80px 30px rgba(6,182,212,0.15)' }}
      />

      {/* Secondary scanning beam - slower */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"
        animate={{ top: ['105%', '-5%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 30px 10px rgba(245,158,11,0.2)' }}
      />

      {/* Vertical scanning beam */}
      <motion.div
        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"
        animate={{ left: ['-5%', '105%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
        style={{ boxShadow: '0 0 20px 8px rgba(139,92,246,0.2)' }}
      />

      {/* Premium corner HUD brackets */}
      {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
        <div
          key={corner}
          className={`absolute ${
            corner === 'top-left' ? 'top-4 left-4' :
            corner === 'top-right' ? 'top-4 right-4' :
            corner === 'bottom-left' ? 'bottom-4 left-4' :
            'bottom-4 right-4'
          }`}
        >
          <svg
            className={`w-40 h-40 text-cyan-500/20 ${
              corner === 'top-right' ? 'rotate-90' :
              corner === 'bottom-left' ? '-rotate-90' :
              corner === 'bottom-right' ? 'rotate-180' : ''
            }`}
          >
            <motion.path
              d="M0 80 L0 0 L80 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M0 100 L0 0 L100 0"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            <motion.circle
              cx="15" cy="15" r="4"
              fill="currentColor"
              opacity="0.6"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx="35" cy="5" r="2"
              fill="currentColor"
              opacity="0.4"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle
              cx="5" cy="35" r="2"
              fill="currentColor"
              opacity="0.4"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
            />
          </svg>
        </div>
      ))}

      {/* Floating holographic particles */}
      {[...Array(60)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${
            i % 3 === 0 ? 'w-1 h-1 bg-cyan-400/50' :
            i % 3 === 1 ? 'w-0.5 h-0.5 bg-amber-400/40' :
            'w-0.5 h-0.5 bg-purple-400/40'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            y: [0, -40, -80],
            x: [0, (Math.random() - 0.5) * 20],
            scale: [0, 1.2, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 6,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* Holographic data streams */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            left: 0,
            right: 0,
          }}
          animate={{
            opacity: [0, 0.5, 0],
            scaleX: [0, 1, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.8,
          }}
        />
      ))}

      {/* Ambient pulse rings */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-cyan-500/5 rounded-full pointer-events-none"
          style={{
            width: `${30 + i * 20}%`,
            height: `${30 + i * 20}%`,
          }}
          animate={{
            opacity: [0.03, 0.08, 0.03],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 5 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
}

// ==================== PREMIUM STATUS LED ====================
function PremiumStatusLED({
  status,
  label,
  size = 'md'
}: {
  status: 'online' | 'offline' | 'warning' | 'error' | 'processing';
  label: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  const colors = {
    online: { bg: 'bg-green-500', glow: '#22c55e', ring: 'ring-green-500/30' },
    offline: { bg: 'bg-slate-600', glow: 'transparent', ring: 'ring-slate-600/20' },
    warning: { bg: 'bg-amber-500', glow: '#f59e0b', ring: 'ring-amber-500/30' },
    error: { bg: 'bg-red-500', glow: '#ef4444', ring: 'ring-red-500/30' },
    processing: { bg: 'bg-cyan-500', glow: '#06b6d4', ring: 'ring-cyan-500/30' },
  };

  const sizes = {
    sm: { dot: 'w-1.5 h-1.5', text: 'text-[9px]' },
    md: { dot: 'w-2.5 h-2.5', text: 'text-[10px]' },
    lg: { dot: 'w-3 h-3', text: 'text-xs' },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.div
          className={`${sizes[size].dot} rounded-full ${colors[status].bg} ring-2 ${colors[status].ring}`}
          animate={status !== 'offline' ? {
            opacity: [1, 0.5, 1],
            scale: status === 'processing' ? [1, 1.2, 1] : [1, 1.05, 1],
          } : {}}
          transition={{
            duration: status === 'error' ? 0.5 : status === 'processing' ? 0.8 : 2,
            repeat: Infinity
          }}
          style={{ boxShadow: `0 0 12px ${colors[status].glow}, 0 0 24px ${colors[status].glow}40` }}
        />
        {status !== 'offline' && (
          <motion.div
            className={`absolute inset-0 rounded-full ${colors[status].bg}`}
            animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`${sizes[size].text} text-slate-400 uppercase tracking-[0.15em] font-medium`}>{label}</span>
    </div>
  );
}

// ==================== HOLOGRAPHIC GLASS PANEL ====================
function HolographicGlassPanel({
  children,
  className = '',
  title,
  subtitle,
  icon,
  accentColor = 'cyan',
  variant = 'default',
  floating = false,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  accentColor?: 'cyan' | 'amber' | 'purple' | 'green' | 'red';
  variant?: 'default' | 'glow' | 'holographic';
  floating?: boolean;
}) {
  const colors = {
    cyan: { border: 'border-cyan-500/30', glow: 'rgba(6,182,212,0.15)', text: 'text-cyan-400', bg: 'from-cyan-500/10' },
    amber: { border: 'border-amber-500/30', glow: 'rgba(245,158,11,0.15)', text: 'text-amber-400', bg: 'from-amber-500/10' },
    purple: { border: 'border-purple-500/30', glow: 'rgba(139,92,246,0.15)', text: 'text-purple-400', bg: 'from-purple-500/10' },
    green: { border: 'border-green-500/30', glow: 'rgba(34,197,94,0.15)', text: 'text-green-400', bg: 'from-green-500/10' },
    red: { border: 'border-red-500/30', glow: 'rgba(239,68,68,0.15)', text: 'text-red-400', bg: 'from-red-500/10' },
  };

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      whileHover={floating ? { y: -4, transition: { duration: 0.3 } } : {}}
    >
      {/* Multi-layer glass background */}
      <div
        className={`absolute inset-0 rounded-2xl backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-slate-900/95 border ${colors[accentColor].border}`}
        style={{
          boxShadow: variant === 'glow'
            ? `0 0 60px ${colors[accentColor].glow}, inset 0 1px 1px rgba(255,255,255,0.05)`
            : `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.03)`,
        }}
      />

      {/* Holographic shimmer effect */}
      {variant === 'holographic' && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, transparent 0%, ${colors[accentColor].glow} 50%, transparent 100%)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
      )}

      {/* Top glow line */}
      <div className={`absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent ${colors[accentColor].bg} to-transparent`} />

      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 ${colors[accentColor].border.replace('/30', '/60')} rounded-tl-2xl`} />
      <div className={`absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 ${colors[accentColor].border.replace('/30', '/60')} rounded-tr-2xl`} />
      <div className={`absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 ${colors[accentColor].border.replace('/30', '/60')} rounded-bl-2xl`} />
      <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 ${colors[accentColor].border.replace('/30', '/60')} rounded-br-2xl`} />

      {/* Content */}
      <div className="relative z-10 p-6">
        {(title || icon) && (
          <div className="flex items-center gap-3 mb-5">
            {icon && (
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {icon}
              </motion.span>
            )}
            <div>
              {title && (
                <h3 className={`text-sm font-bold uppercase tracking-[0.2em] ${colors[accentColor].text}`}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-slate-500 mt-0.5 tracking-wider">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        {children}
      </div>
    </motion.div>
  );
}

// ==================== 3D CIRCULAR GAUGE ====================
function Gauge3D({
  value,
  min = 0,
  max = 100,
  label,
  unit,
  size = 160,
  warningThreshold,
  criticalThreshold,
  decimals = 0,
  accentColor = 'cyan',
  showNeedle = true,
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
  accentColor?: 'cyan' | 'amber' | 'green' | 'purple' | 'red';
  showNeedle?: boolean;
}) {
  const percentage = value !== null ? Math.min(Math.max((value - min) / (max - min) * 100, 0), 100) : 0;
  const radius = (size - 30) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270 degree arc
  const strokeDashoffset = circumference * (1 - percentage / 100);
  const needleAngle = -135 + (percentage / 100) * 270;

  const getStatus = () => {
    if (value === null) return 'inactive';
    if (criticalThreshold !== undefined && value >= criticalThreshold) return 'critical';
    if (warningThreshold !== undefined && value >= warningThreshold) return 'warning';
    return 'normal';
  };

  const status = getStatus();

  const colorMap = {
    cyan: { main: '#06b6d4', glow: 'rgba(6,182,212,0.6)' },
    amber: { main: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
    green: { main: '#22c55e', glow: 'rgba(34,197,94,0.6)' },
    purple: { main: '#a855f7', glow: 'rgba(168,85,247,0.6)' },
    red: { main: '#ef4444', glow: 'rgba(239,68,68,0.6)' },
  };

  const statusColors = {
    inactive: { main: '#334155', glow: 'transparent' },
    normal: colorMap[accentColor],
    warning: { main: '#f59e0b', glow: 'rgba(245,158,11,0.6)' },
    critical: { main: '#ef4444', glow: 'rgba(239,68,68,0.6)' },
  };

  const colors = statusColors[status];

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glow ring */}
      <div
        className="absolute rounded-full"
        style={{
          width: size + 20,
          height: size + 20,
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          background: `radial-gradient(circle, ${colors.glow}20 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="transform -rotate-[135deg]">
        {/* Background track with 3D effect */}
        <defs>
          <linearGradient id={`gauge-bg-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(51,65,85,0.6)" />
            <stop offset="100%" stopColor="rgba(30,41,59,0.3)" />
          </linearGradient>
          <linearGradient id={`gauge-progress-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.main} />
            <stop offset="100%" stopColor={colors.main} stopOpacity="0.7" />
          </linearGradient>
          <filter id={`gauge-glow-${label}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-bg-${label})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />

        {/* Tick marks */}
        {[...Array(28)].map((_, i) => {
          const angle = (i / 27) * 270;
          const rad = ((angle - 135) * Math.PI) / 180;
          const innerR = i % 3 === 0 ? radius - 18 : radius - 14;
          const outerR = radius - 8;
          const isActive = (i / 27) * 100 <= percentage;
          return (
            <line
              key={i}
              x1={size / 2 + innerR * Math.cos(rad + (135 * Math.PI / 180))}
              y1={size / 2 + innerR * Math.sin(rad + (135 * Math.PI / 180))}
              x2={size / 2 + outerR * Math.cos(rad + (135 * Math.PI / 180))}
              y2={size / 2 + outerR * Math.sin(rad + (135 * Math.PI / 180))}
              stroke={isActive ? colors.main : 'rgba(100,116,139,0.3)'}
              strokeWidth={i % 3 === 0 ? 2 : 1}
              opacity={isActive ? 1 : 0.5}
            />
          );
        })}

        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#gauge-progress-${label})`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          filter={`url(#gauge-glow-${label})`}
        />

        {/* Outer glow */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors.main}
          strokeWidth="16"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset }}
          opacity="0.15"
          style={{ filter: 'blur(8px)' }}
        />
      </svg>

      {/* Needle */}
      {showNeedle && value !== null && (
        <motion.div
          className="absolute"
          style={{
            width: 4,
            height: radius - 20,
            background: `linear-gradient(to top, ${colors.main}, ${colors.main}80)`,
            borderRadius: 2,
            top: '50%',
            left: '50%',
            transformOrigin: 'bottom center',
            boxShadow: `0 0 10px ${colors.glow}`,
          }}
          initial={{ rotate: -135 }}
          animate={{ rotate: needleAngle }}
          transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
        />
      )}

      {/* Center hub */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 0.45,
          height: size * 0.45,
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          boxShadow: `inset 0 2px 4px rgba(0,0,0,0.5), 0 0 20px ${colors.glow}30`,
          border: `2px solid ${colors.main}30`,
        }}
      />

      {/* Center display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-bold font-mono"
          style={{
            color: colors.main,
            textShadow: `0 0 20px ${colors.glow}`,
          }}
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {value !== null ? value.toFixed(decimals) : '--'}
        </motion.span>
        <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">{unit}</span>
      </div>

      {/* Label */}
      <div className="mt-3 text-center">
        <span className="text-xs text-slate-400 uppercase tracking-[0.15em] font-medium">{label}</span>
      </div>

      {/* Status indicator */}
      {status !== 'inactive' && status !== 'normal' && (
        <motion.div
          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          style={{ boxShadow: `0 0 15px ${status === 'warning' ? '#f59e0b' : '#ef4444'}` }}
        />
      )}
    </div>
  );
}

// ==================== ADVANCED ANALYTICS CARD ====================
function AnalyticsCard({
  title,
  value,
  change,
  trend,
  icon,
  color = 'cyan',
}: {
  title: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: string;
  color?: 'cyan' | 'amber' | 'green' | 'purple' | 'red';
}) {
  const colors = {
    cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    amber: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    green: { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
    red: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    stable: 'text-slate-400',
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <motion.div
      className={`p-4 rounded-xl ${colors[color].bg} border ${colors[color].border} backdrop-blur-sm`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-sm font-bold ${trendColors[trend]}`}>
            {trendIcons[trend]} {change}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono ${colors[color].text} mb-1`}>{value}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider">{title}</div>
    </motion.div>
  );
}

// ==================== AI DIAGNOSTICS ENGINE DISPLAY ====================
function AIDiagnosticsEngine({
  isActive,
  confidence,
  prediction,
}: {
  isActive: boolean;
  confidence: number;
  prediction: string;
}) {
  return (
    <HolographicGlassPanel
      title="AI Diagnostics Engine"
      subtitle="Neural Network Analysis"
      icon="🧠"
      accentColor="purple"
      variant="holographic"
    >
      <div className="space-y-4">
        {/* AI Status */}
        <div className="flex items-center justify-between p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-violet-600/30 flex items-center justify-center"
              animate={isActive ? {
                boxShadow: ['0 0 20px rgba(139,92,246,0.3)', '0 0 40px rgba(139,92,246,0.6)', '0 0 20px rgba(139,92,246,0.3)']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.span
                className="text-2xl"
                animate={isActive ? { rotate: [0, 360] } : {}}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                🔮
              </motion.span>
            </motion.div>
            <div>
              <div className="text-sm font-medium text-white">Neural Engine</div>
              <div className={`text-xs ${isActive ? 'text-green-400' : 'text-slate-500'}`}>
                {isActive ? 'PROCESSING' : 'STANDBY'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-mono text-purple-400">{confidence}%</div>
            <div className="text-[10px] text-slate-500 uppercase">Confidence</div>
          </div>
        </div>

        {/* Processing animation */}
        {isActive && (
          <div className="relative h-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-500"
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              style={{ width: '50%' }}
            />
          </div>
        )}

        {/* Prediction */}
        <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">AI Prediction</div>
          <div className="text-sm text-white">{prediction}</div>
        </div>

        {/* Neural network visualization */}
        <div className="flex justify-center gap-4 py-4">
          {[...Array(5)].map((_, layer) => (
            <div key={layer} className="flex flex-col gap-2">
              {[...Array(3 + (layer === 2 ? 2 : 0))].map((_, node) => (
                <motion.div
                  key={node}
                  className="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-500/50"
                  animate={isActive ? {
                    backgroundColor: ['rgba(139,92,246,0.3)', 'rgba(139,92,246,0.8)', 'rgba(139,92,246,0.3)'],
                    boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 15px rgba(139,92,246,0.5)', '0 0 0 rgba(139,92,246,0)'],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: layer * 0.2 + node * 0.1
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </HolographicGlassPanel>
  );
}

// ==================== VOICE COMMAND & AR INDICATORS ====================
function FeatureIndicators() {
  return (
    <div className="flex items-center gap-4">
      {/* Voice Command */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg"
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="text-lg"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🎤
        </motion.span>
        <span className="text-xs text-blue-400 uppercase tracking-wider font-medium">Voice Ready</span>
      </motion.div>

      {/* AR Mode */}
      <motion.div
        className="flex items-center gap-2 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-lg"
        whileHover={{ scale: 1.05 }}
      >
        <motion.span
          className="text-lg"
          animate={{ rotateY: [0, 180, 360] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          👓
        </motion.span>
        <span className="text-xs text-violet-400 uppercase tracking-wider font-medium">AR Mode</span>
      </motion.div>
    </div>
  );
}

// ==================== SYSTEM HEALTH SCORE ====================
function SystemHealthScore({ score }: { score: number }) {
  const getColor = () => {
    if (score >= 90) return { text: 'text-green-400', glow: '#22c55e', bg: 'from-green-500/20' };
    if (score >= 70) return { text: 'text-amber-400', glow: '#f59e0b', bg: 'from-amber-500/20' };
    return { text: 'text-red-400', glow: '#ef4444', bg: 'from-red-500/20' };
  };

  const colors = getColor();

  return (
    <motion.div
      className={`relative p-6 rounded-2xl bg-gradient-to-br ${colors.bg} to-transparent border border-slate-700/50 overflow-hidden`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{ background: `radial-gradient(circle at center, ${colors.glow}40, transparent 70%)` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative z-10 text-center">
        <div className="text-xs text-slate-500 uppercase tracking-[0.2em] mb-2">System Health</div>
        <motion.div
          className={`text-6xl font-bold font-mono ${colors.text}`}
          style={{ textShadow: `0 0 30px ${colors.glow}` }}
          key={score}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.div>
        <div className="text-slate-400 text-sm mt-1">/ 100</div>

        {/* Health bar */}
        <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${colors.glow}80, ${colors.glow})` }}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ==================== LIVE DATA STREAM DISPLAY ====================
function LiveDataStream() {
  const [data, setData] = useState<number[]>([65, 72, 68, 75, 70, 78, 73, 80, 76, 82, 79, 85]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = [...prev.slice(1), Math.random() * 30 + 60];
        return newData;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-24 bg-slate-900/50 rounded-xl border border-cyan-500/20 p-4 overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-4 opacity-20">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="absolute left-0 right-0 h-px bg-cyan-500/30" style={{ top: `${i * 33}%` }} />
        ))}
      </div>

      {/* Data visualization */}
      <svg className="absolute inset-4" preserveAspectRatio="none">
        <defs>
          <linearGradient id="streamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(6,182,212,0.5)" />
            <stop offset="100%" stopColor="rgba(6,182,212,0)" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <motion.path
          d={`M 0,100 ${data.map((d, i) => `L ${(i / (data.length - 1)) * 100},${100 - d}`).join(' ')} L 100,100 Z`}
          fill="url(#streamGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Line */}
        <motion.path
          d={`M ${data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - d}`).join(' L ')}`}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Data points */}
        {data.map((d, i) => (
          <motion.circle
            key={i}
            cx={`${(i / (data.length - 1)) * 100}%`}
            cy={`${100 - d}%`}
            r="3"
            fill="#06b6d4"
            initial={{ scale: 0 }}
            animate={{ scale: i === data.length - 1 ? [1, 1.5, 1] : 1 }}
            transition={i === data.length - 1 ? { duration: 1, repeat: Infinity } : {}}
          />
        ))}
      </svg>

      {/* Current value */}
      <div className="absolute top-2 right-3 text-right">
        <div className="text-lg font-mono text-cyan-400">{data[data.length - 1].toFixed(1)}%</div>
        <div className="text-[9px] text-slate-500 uppercase">Live Load</div>
      </div>
    </div>
  );
}

// ==================== PREMIUM NAVIGATION TAB ====================
function PremiumNavTab({
  icon,
  label,
  active,
  onClick,
  badge,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative px-5 py-3 rounded-xl transition-all ${
        active
          ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/50'
          : 'hover:bg-slate-800/50 border border-transparent hover:border-slate-700/50'
      }`}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-3">
        <motion.span
          className="text-xl"
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {icon}
        </motion.span>
        <span className={`text-sm font-medium uppercase tracking-wider ${active ? 'text-cyan-400' : 'text-slate-400'}`}>
          {label}
        </span>
      </div>

      {badge !== undefined && badge > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ boxShadow: '0 0 10px rgba(239,68,68,0.5)' }}
        >
          {badge}
        </motion.span>
      )}

      {active && (
        <>
          <motion.div
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500"
            layoutId="activeTab"
            style={{ boxShadow: '0 0 15px rgba(6,182,212,0.5)' }}
          />
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              boxShadow: ['inset 0 0 20px rgba(6,182,212,0.1)', 'inset 0 0 30px rgba(6,182,212,0.2)', 'inset 0 0 20px rgba(6,182,212,0.1)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </>
      )}
    </motion.button>
  );
}

// ==================== MAIN MODULE ====================
export default function GeneratorOracleModule() {
  // Core state
  const [language, setLanguage] = useState('en');
  const [t, setT] = useState<OracleTranslations>(getOracleTranslation('en'));
  const [isRTL, setIsRTL] = useState(false);
  const [activeScreen, setActiveScreen] = useState<'command' | 'engine' | 'electrical' | 'faults' | 'advanced' | 'wiring' | 'assistant' | 'history' | 'settings' | 'simulator' | 'faultanalysis' | 'allwiring' | 'techinput' | 'realtime' | 'obd' | 'remote' | 'predictive' | 'recording' | 'manuals'>('command');

  // Controller type for simulator
  type ControllerType = keyof typeof CONTROLLER_TYPES;
  const [simulatorController, setSimulatorController] = useState<ControllerType>('DSE');

  // Controller selection
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  // Parameters with demo values
  const [parameters, setParameters] = useState<GeneratorParameters>(DEFAULT_PARAMETERS);
  const [generatorStatus, setGeneratorStatus] = useState<'running' | 'standby' | 'fault' | 'off'>('running');

  // Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ControllerFaultCode[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // System
  const [systemTime, setSystemTime] = useState(new Date());
  const [isOffline, setIsOffline] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [totalCodes, setTotalCodes] = useState(0);
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisHistoryEntry[]>([]);

  // AI Diagnostics state
  const [aiActive, setAiActive] = useState(true);
  const [aiConfidence, setAiConfidence] = useState(94);
  const [systemHealth, setSystemHealth] = useState(87);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setParameters(prev => ({
        ...prev,
        rpm: 1500 + Math.random() * 20 - 10,
        frequency: 50 + Math.random() * 0.1 - 0.05,
        loadPercent: 70 + Math.random() * 8 - 4,
        voltageL1N: 230 + Math.random() * 4 - 2,
        voltageL2N: 232 + Math.random() * 4 - 2,
        voltageL3N: 229 + Math.random() * 4 - 2,
        currentL1: 125 + Math.random() * 6 - 3,
        currentL2: 128 + Math.random() * 6 - 3,
        currentL3: 122 + Math.random() * 6 - 3,
        coolantTemp: 78 + Math.random() * 3 - 1.5,
        oilPressure: 45 + Math.random() * 4 - 2,
      }));
      setAiConfidence(prev => Math.min(99, Math.max(85, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // System clock
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize
  useEffect(() => {
    const init = async () => {
      setIsOffline(!navigator.onLine);
      window.addEventListener('online', () => setIsOffline(false));
      window.addEventListener('offline', () => setIsOffline(true));

      setTotalCodes(getTotalFaultCodeCount());

      if (isDatabaseAvailable()) {
        try {
          await initDatabase();
          const savedLang = await getSetting('language');
          if (savedLang) {
            setLanguage(savedLang);
            setT(getOracleTranslation(savedLang));
            setIsRTL(SUPPORTED_ORACLE_LANGUAGES.find(l => l.code === savedLang)?.rtl || false);
          }

          const savedBrand = await getSetting('lastSelectedBrand');
          const savedModel = await getSetting('lastSelectedModel');
          if (savedBrand) setSelectedBrand(savedBrand);
          if (savedModel) setSelectedModel(savedModel);

          const offlineLoaded = await getSetting('offlineDataLoaded');
          if (offlineLoaded) {
            setOfflineReady(true);
          } else {
            await initializeOfflineData(getAllFaultCodes(), () => {});
            setOfflineReady(true);
          }

          const history = await getDiagnosisHistory(20);
          setDiagnosisHistory(history);
        } catch (error) {
          console.error('Failed to initialize:', error);
        }
      }
    };

    init();
  }, []);

  // Handlers
  const handleLanguageChange = useCallback(async (langCode: string) => {
    setLanguage(langCode);
    setT(getOracleTranslation(langCode));
    setIsRTL(SUPPORTED_ORACLE_LANGUAGES.find(l => l.code === langCode)?.rtl || false);
    if (isDatabaseAvailable()) {
      await saveSetting('language', langCode);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let results: ControllerFaultCode[];
      if (selectedModel) {
        const modelCodes = getFaultCodesByModel(selectedModel);
        const q = query.toLowerCase();
        results = modelCodes.filter(code =>
          code.code.toLowerCase().includes(q) ||
          code.title.toLowerCase().includes(q) ||
          code.description.toLowerCase().includes(q)
        );
      } else if (selectedBrand) {
        const brandCodes = getFaultCodesByBrand(selectedBrand);
        const q = query.toLowerCase();
        results = brandCodes.filter(code =>
          code.code.toLowerCase().includes(q) ||
          code.title.toLowerCase().includes(q) ||
          code.description.toLowerCase().includes(q)
        );
      } else {
        results = searchFaultCodes(query);
      }
      setSearchResults(results.slice(0, 100));
    } finally {
      setIsSearching(false);
    }
  }, [selectedBrand, selectedModel]);

  const handleBrandSelect = useCallback(async (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedBrand', brand);
    }
  }, []);

  const handleModelSelect = useCallback(async (model: string) => {
    setSelectedModel(model);
    if (isDatabaseAvailable()) {
      await saveSetting('lastSelectedModel', model);
    }
  }, []);

  const updateParameter = useCallback(<K extends keyof GeneratorParameters>(key: K, value: GeneratorParameters[K]) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  }, []);

  const availableModels = useMemo(() => {
    if (!selectedBrand) return [];
    const brand = Object.values(CONTROLLER_BRANDS).find(b =>
      b.name.toLowerCase().includes(selectedBrand.toLowerCase())
    );
    return brand?.models || [];
  }, [selectedBrand]);

  return (
    <LicenseGate>
      <div className={`text-white ${isRTL ? 'rtl' : 'ltr'}`} style={{ minHeight: '100vh' }}>
        <UltraCockpitBackground />
        <InstallPrompt />

        {/* Copy protection */}
        <style jsx global>{`
          .protected-content { user-select: none; -webkit-user-select: none; }
          input, button, textarea, a { user-select: auto !important; -webkit-user-select: auto !important; }
          html, body { overflow-x: hidden; }
        `}</style>

        <div className="relative z-10 pb-32">
          {/* ==================== ULTRA-PREMIUM COMMAND HEADER ==================== */}
          <header className="flex-shrink-0 bg-slate-950/90 backdrop-blur-2xl border-b border-cyan-500/20">
            <div className="max-w-[1920px] mx-auto px-4 lg:px-6">
              {/* Top Status Bar */}
              <div className="flex items-center justify-between py-2 border-b border-slate-800/50 text-xs">
                <div className="flex items-center gap-4 lg:gap-8">
                  <PremiumStatusLED
                    status={generatorStatus === 'running' ? 'online' : generatorStatus === 'fault' ? 'error' : 'offline'}
                    label="Generator"
                    size="md"
                  />
                  <PremiumStatusLED status={isOffline ? 'offline' : 'online'} label="Network" size="sm" />
                  <PremiumStatusLED status={offlineReady ? 'online' : 'processing'} label="Database" size="sm" />
                  <PremiumStatusLED status={aiActive ? 'processing' : 'offline'} label="AI Engine" size="sm" />
                </div>

                <div className="flex items-center gap-4">
                  {/* Feature Indicators */}
                  <div className="hidden xl:block">
                    <FeatureIndicators />
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-4 px-4 py-1.5 bg-slate-900/60 rounded-lg border border-slate-700/50">
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{t.faultCodes}</span>
                      <div className="font-mono text-cyan-400 text-sm">{totalCodes.toLocaleString()}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700" />
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{t.controllers}</span>
                      <div className="font-mono text-cyan-400 text-sm">{selectedModel || 'All'}</div>
                    </div>
                    <div className="w-px h-8 bg-slate-700" />
                    <div className="text-center">
                      <span className="text-[9px] text-slate-500 uppercase tracking-wider">{t.severity}</span>
                      <div className="font-mono text-green-400 text-sm">{systemHealth}%</div>
                    </div>
                  </div>

                  {/* Language with Flags */}
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="bg-slate-900/60 text-cyan-400 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-medium cursor-pointer hover:border-cyan-500/50 transition-colors"
                  >
                    {SUPPORTED_ORACLE_LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>

                  {/* Time Display */}
                  <div className="flex items-center gap-3 px-4 py-1.5 bg-slate-900/60 rounded-lg border border-slate-700/50">
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{ boxShadow: '0 0 10px #22c55e' }}
                    />
                    <span className="font-mono text-cyan-400 text-sm tracking-wider">
                      {systemTime.toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <span className="text-slate-500 text-xs">
                      {systemTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Header */}
              <div className="flex items-center justify-between py-4">
                {/* Logo */}
                <div className="flex items-center gap-5">
                  <motion.div
                    className="relative w-14 h-14 lg:w-16 lg:h-16"
                    style={{ perspective: 1000 }}
                  >
                    <motion.div
                      className="absolute inset-0"
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400 via-cyan-600 to-blue-700 flex items-center justify-center"
                        style={{
                          boxShadow: '0 0 40px rgba(6,182,212,0.5), inset 0 0 20px rgba(255,255,255,0.1)',
                          transform: 'translateZ(0)',
                        }}
                      >
                        <motion.span
                          className="text-3xl"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          ⚡
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Orbiting particles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                        }}
                        animate={{
                          x: [0, 30 * Math.cos((i * 120) * Math.PI / 180), 0],
                          y: [0, 30 * Math.sin((i * 120) * Math.PI / 180), 0],
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 1,
                        }}
                      />
                    ))}
                  </motion.div>

                  <div>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-wider">
                      <motion.span
                        className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        style={{ backgroundSize: '200% 200%' }}
                      >
                        GENERATOR ORACLE
                      </motion.span>
                    </h1>
                    <p className="text-[10px] lg:text-xs text-slate-500 uppercase tracking-[0.3em] mt-1">
                      Ultra-Premium Diagnostic System v3.0
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="hidden xl:flex items-center gap-1 p-1.5 bg-slate-900/60 rounded-2xl border border-slate-700/50 flex-wrap">
                  <PremiumNavTab icon="🎛️" label={t.navCommand} active={activeScreen === 'command'} onClick={() => setActiveScreen('command')} />
                  <PremiumNavTab icon="⚙️" label={t.navEngine} active={activeScreen === 'engine'} onClick={() => setActiveScreen('engine')} />
                  <PremiumNavTab icon="⚡" label={t.navElectrical} active={activeScreen === 'electrical'} onClick={() => setActiveScreen('electrical')} />
                  <PremiumNavTab icon="🔧" label={t.navFaults} active={activeScreen === 'faults'} onClick={() => setActiveScreen('faults')} badge={2} />
                  <PremiumNavTab icon="🔍" label={t.navFaultAnalysis} active={activeScreen === 'faultanalysis'} onClick={() => setActiveScreen('faultanalysis')} />
                  <PremiumNavTab icon="🖥️" label={t.navSimulator} active={activeScreen === 'simulator'} onClick={() => setActiveScreen('simulator')} />
                  <PremiumNavTab icon="📐" label={t.navDiagrams} active={activeScreen === 'wiring'} onClick={() => setActiveScreen('wiring')} />
                  <PremiumNavTab icon="🔌" label={t.navAllWiring} active={activeScreen === 'allwiring'} onClick={() => setActiveScreen('allwiring')} />
                  <PremiumNavTab icon="📊" label={t.navInput} active={activeScreen === 'techinput'} onClick={() => setActiveScreen('techinput')} />
                  <PremiumNavTab icon="🧠" label={t.navAI} active={activeScreen === 'advanced'} onClick={() => setActiveScreen('advanced')} />
                  <PremiumNavTab icon="🛠️" label={t.navAssistant} active={activeScreen === 'assistant'} onClick={() => setActiveScreen('assistant')} />
                  <PremiumNavTab icon="📊" label={t.navLiveMonitor} active={activeScreen === 'realtime'} onClick={() => setActiveScreen('realtime')} />
                  <PremiumNavTab icon="🔌" label={t.navOBD} active={activeScreen === 'obd'} onClick={() => setActiveScreen('obd')} />
                  <PremiumNavTab icon="🌐" label={t.navRemote} active={activeScreen === 'remote'} onClick={() => setActiveScreen('remote')} />
                  <PremiumNavTab icon="🔮" label={t.navPredictive} active={activeScreen === 'predictive'} onClick={() => setActiveScreen('predictive')} />
                  <PremiumNavTab icon="📈" label={t.navRecording} active={activeScreen === 'recording'} onClick={() => setActiveScreen('recording')} />
                  <PremiumNavTab icon="📚" label={t.navManuals} active={activeScreen === 'manuals'} onClick={() => setActiveScreen('manuals')} />
                  <PremiumNavTab icon="📋" label={t.tabHistory} active={activeScreen === 'history'} onClick={() => setActiveScreen('history')} />
                  <PremiumNavTab icon="⚙️" label={t.tabSettings} active={activeScreen === 'settings'} onClick={() => setActiveScreen('settings')} />
                </nav>

                {/* Mobile nav */}
                <div className="xl:hidden">
                  <select
                    value={activeScreen}
                    onChange={(e) => setActiveScreen(e.target.value as typeof activeScreen)}
                    className="bg-slate-900/60 text-cyan-400 px-4 py-2.5 rounded-xl border border-cyan-500/30 font-medium"
                  >
                    <option value="command">🎛️ {t.navCommand}</option>
                    <option value="engine">⚙️ {t.navEngine}</option>
                    <option value="electrical">⚡ {t.navElectrical}</option>
                    <option value="faults">🔧 {t.navFaults}</option>
                    <option value="faultanalysis">🔍 {t.navFaultAnalysis}</option>
                    <option value="simulator">🖥️ {t.navSimulator}</option>
                    <option value="wiring">📐 {t.navDiagrams}</option>
                    <option value="allwiring">🔌 {t.navAllWiring}</option>
                    <option value="techinput">📊 {t.navInput}</option>
                    <option value="advanced">🧠 {t.navAI}</option>
                    <option value="assistant">🛠️ {t.navAssistant}</option>
                    <option value="realtime">📊 {t.navLiveMonitor}</option>
                    <option value="obd">🔌 {t.navOBD}</option>
                    <option value="remote">🌐 {t.navRemote}</option>
                    <option value="predictive">🔮 {t.navPredictive}</option>
                    <option value="recording">📈 {t.navRecording}</option>
                    <option value="manuals">📚 {t.navManuals}</option>
                    <option value="history">📋 {t.tabHistory}</option>
                    <option value="settings">⚙️ {t.tabSettings}</option>
                  </select>
                </div>

                {/* Emergency Stop */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden lg:flex px-6 py-3 bg-gradient-to-br from-red-600 via-red-700 to-red-800 rounded-xl font-bold uppercase tracking-wider text-white items-center gap-2"
                  style={{
                    boxShadow: '0 0 30px rgba(239,68,68,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                  }}
                >
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  >
                    ⚠️
                  </motion.span>
                  <span className="text-sm">E-STOP</span>
                </motion.button>
              </div>
            </div>
          </header>

          {/* ==================== MAIN CONTENT ==================== */}
          <main className="flex-1 p-4 lg:p-6">
            <div className="max-w-[1920px] mx-auto pb-10">
              <AnimatePresence mode="wait">
                {/* COMMAND CENTER */}
                {activeScreen === 'command' && (
                  <motion.div
                    key="command"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Top Analytics Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      <AnalyticsCard title="Active Power" value={`${parameters.activePowerKw?.toFixed(1) || '--'} kW`} change="+2.3%" trend="up" icon="⚡" color="cyan" />
                      <AnalyticsCard title="Load Factor" value={`${parameters.loadPercent?.toFixed(0) || '--'}%`} change="-1.2%" trend="down" icon="📊" color="amber" />
                      <AnalyticsCard title="Fuel Level" value={`${parameters.fuelLevel || '--'}%`} change="stable" trend="stable" icon="⛽" color="green" />
                      <AnalyticsCard title="Engine Hours" value={`${parameters.engineHours?.toFixed(0) || '--'}`} change="+24h" trend="up" icon="⏱️" color="purple" />
                      <AnalyticsCard title="Efficiency" value="94.2%" change="+0.8%" trend="up" icon="🎯" color="green" />
                      <AnalyticsCard title="CO2 Saved" value="12.4 kg" change="+15%" trend="up" icon="🌿" color="green" />
                    </div>

                    {/* Main Dashboard Grid */}
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left Column - Gauges */}
                      <div className="col-span-12 lg:col-span-4 space-y-6">
                        <HolographicGlassPanel title="Engine Vitals" subtitle="Real-time Monitoring" icon="⚙️" accentColor="amber" variant="glow">
                          <div className="grid grid-cols-2 gap-6">
                            <Gauge3D
                              value={parameters.rpm}
                              min={0}
                              max={2000}
                              label="RPM"
                              unit="rpm"
                              size={140}
                              warningThreshold={1700}
                              criticalThreshold={1900}
                              accentColor="amber"
                            />
                            <Gauge3D
                              value={parameters.oilPressure}
                              min={0}
                              max={80}
                              label="Oil Press"
                              unit="PSI"
                              size={140}
                              warningThreshold={20}
                              criticalThreshold={15}
                              accentColor="green"
                            />
                            <Gauge3D
                              value={parameters.coolantTemp}
                              min={0}
                              max={120}
                              label="Coolant"
                              unit="C"
                              size={140}
                              warningThreshold={95}
                              criticalThreshold={105}
                              accentColor="cyan"
                            />
                            <Gauge3D
                              value={parameters.loadPercent}
                              min={0}
                              max={100}
                              label="Load"
                              unit="%"
                              size={140}
                              warningThreshold={85}
                              criticalThreshold={95}
                              accentColor="purple"
                            />
                          </div>
                        </HolographicGlassPanel>

                        <SystemHealthScore score={systemHealth} />
                      </div>

                      {/* Center Column - Main Display */}
                      <div className="col-span-12 lg:col-span-5 space-y-6">
                        {/* Generator Status */}
                        <HolographicGlassPanel accentColor="cyan" variant="glow">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                              <motion.div
                                className={`w-5 h-5 rounded-full ${
                                  generatorStatus === 'running' ? 'bg-green-500' :
                                  generatorStatus === 'fault' ? 'bg-red-500' :
                                  'bg-blue-500'
                                }`}
                                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                style={{ boxShadow: `0 0 20px ${generatorStatus === 'running' ? '#22c55e' : generatorStatus === 'fault' ? '#ef4444' : '#3b82f6'}` }}
                              />
                              <div>
                                <h2 className="text-xl font-bold uppercase tracking-wider text-white">Generator Status</h2>
                                <p className={`text-sm uppercase tracking-wider ${
                                  generatorStatus === 'running' ? 'text-green-400' :
                                  generatorStatus === 'fault' ? 'text-red-400' :
                                  'text-blue-400'
                                }`}>
                                  {generatorStatus.toUpperCase()} - NOMINAL
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setGeneratorStatus('running')}
                                className="px-4 py-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg font-medium uppercase tracking-wider text-white text-sm"
                              >
                                Start
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setGeneratorStatus('standby')}
                                className="px-4 py-2 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg font-medium uppercase tracking-wider text-white text-sm"
                              >
                                Stop
                              </motion.button>
                            </div>
                          </div>

                          {/* Power Display Grid */}
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                              { label: 'Active Power', value: parameters.activePowerKw, unit: 'kW', color: 'cyan' },
                              { label: 'Apparent Power', value: parameters.apparentPowerKva, unit: 'kVA', color: 'purple' },
                              { label: 'Reactive Power', value: parameters.reactivePowerKvar, unit: 'kVAr', color: 'amber' },
                              { label: 'Power Factor', value: parameters.powerFactor, unit: 'PF', color: 'green' },
                            ].map((item) => (
                              <div key={item.label} className="text-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/30">
                                <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{item.label}</div>
                                <motion.div
                                  className={`text-2xl font-bold font-mono text-${item.color}-400`}
                                  key={item.value}
                                  initial={{ scale: 0.9 }}
                                  animate={{ scale: 1 }}
                                >
                                  {item.value?.toFixed(item.unit === 'PF' ? 2 : 1) || '--'}
                                </motion.div>
                                <div className="text-xs text-slate-500">{item.unit}</div>
                              </div>
                            ))}
                          </div>

                          {/* Voltage & Frequency */}
                          <div className="grid grid-cols-4 gap-3 p-4 bg-slate-950/50 rounded-xl border border-cyan-500/20">
                            {[
                              { label: 'L1-N', value: parameters.voltageL1N },
                              { label: 'L2-N', value: parameters.voltageL2N },
                              { label: 'L3-N', value: parameters.voltageL3N },
                              { label: 'Freq', value: parameters.frequency, unit: 'Hz', color: 'amber' },
                            ].map((item, i) => (
                              <div key={i} className="text-center">
                                <div className="text-[9px] text-slate-500 uppercase">{item.label}</div>
                                <div className={`text-xl font-mono ${item.color ? `text-${item.color}-400` : 'text-cyan-400'}`}>
                                  {item.value?.toFixed(item.unit === 'Hz' ? 2 : 0) ?? '--'}
                                  <span className="text-xs text-slate-500 ml-0.5">{item.unit || 'V'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </HolographicGlassPanel>

                        {/* Live Data Stream */}
                        <HolographicGlassPanel title="Live Performance" subtitle="Real-time Data Stream" icon="📈" accentColor="cyan">
                          <LiveDataStream />
                        </HolographicGlassPanel>

                        {/* Quick Search */}
                        <HolographicGlassPanel title={t.faultCode} subtitle={`${totalCodes.toLocaleString()}+ ${t.faultCodes}`} icon="🔍" accentColor="purple">
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                              placeholder={t.searchPlaceholder}
                              className="flex-1 px-4 py-3 bg-slate-950/80 border border-purple-500/30 rounded-xl text-cyan-300 font-mono placeholder-slate-600 focus:outline-none focus:border-purple-500/60 transition-colors"
                            />
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSearch(searchQuery)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium rounded-xl"
                            >
                              {t.searchButton}
                            </motion.button>
                          </div>

                          {searchResults.length > 0 && (
                            <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
                              {searchResults.slice(0, 5).map((fault) => (
                                <motion.div
                                  key={fault.id}
                                  className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 cursor-pointer hover:border-purple-500/50"
                                  whileHover={{ x: 4 }}
                                  onClick={() => setActiveScreen('faults')}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="px-2 py-1 bg-slate-800 rounded font-mono text-cyan-400 text-sm">{fault.code}</span>
                                    <span className="text-white text-sm flex-1">{fault.title}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                      fault.severity === 'shutdown' ? 'bg-red-500/20 text-red-400' :
                                      fault.severity === 'critical' ? 'bg-orange-500/20 text-orange-400' :
                                      'bg-amber-500/20 text-amber-400'
                                    }`}>
                                      {fault.severity}
                                    </span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )}
                        </HolographicGlassPanel>
                      </div>

                      {/* Right Column - AI & Support */}
                      <div className="col-span-12 lg:col-span-3 space-y-6">
                        <AIDiagnosticsEngine
                          isActive={aiActive}
                          confidence={Math.round(aiConfidence)}
                          prediction="System operating within optimal parameters. No immediate maintenance required."
                        />

                        {/* Controller Selection Mini */}
                        <HolographicGlassPanel title="Controller" icon="🎛️" accentColor="cyan">
                          <div className="grid grid-cols-3 gap-2">
                            {Object.entries(CONTROLLER_BRANDS).slice(0, 6).map(([key, brand]) => (
                              <motion.button
                                key={key}
                                onClick={() => handleBrandSelect(brand.name)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-2 rounded-lg text-center transition-all ${
                                  selectedBrand === brand.name
                                    ? 'bg-cyan-500/20 border border-cyan-500'
                                    : 'bg-slate-900/50 border border-slate-700 hover:border-cyan-500/50'
                                }`}
                              >
                                <div className="text-[10px] text-slate-300 truncate">{brand.name}</div>
                              </motion.button>
                            ))}
                          </div>
                        </HolographicGlassPanel>

                        {/* Support */}
                        <HolographicGlassPanel title={t.needHelp} icon="💬" accentColor="green">
                          <div className="space-y-3">
                            <a
                              href="tel:+254782914717"
                              className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl hover:bg-blue-500/20 transition-colors"
                            >
                              <span className="text-xl">📞</span>
                              <div className="flex-1">
                                <div className="text-sm text-blue-400 font-medium">{t.callSupport}</div>
                                <div className="text-xs text-slate-500">+254 782 914 717</div>
                              </div>
                            </a>
                            <a
                              href="https://wa.me/254768860665"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-xl hover:bg-green-500/20 transition-colors"
                            >
                              <span className="text-xl">💬</span>
                              <div className="flex-1">
                                <div className="text-sm text-green-400 font-medium">{t.whatsappSupport}</div>
                                <div className="text-xs text-slate-500">24/7</div>
                              </div>
                            </a>
                          </div>
                        </HolographicGlassPanel>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ENGINE PANEL */}
                {activeScreen === 'engine' && (
                  <motion.div
                    key="engine"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <EnginePanel
                      parameters={{
                        rpm: parameters.rpm,
                        oilPressure: parameters.oilPressure,
                        oilTemperature: parameters.oilTemperature,
                        coolantTemp: parameters.coolantTemp,
                        coolantPressure: parameters.coolantPressure,
                        fuelPressure: parameters.fuelPressure,
                        engineHours: parameters.engineHours,
                        intakeAirTemp: parameters.intakeAirTemp,
                        exhaustTemp: parameters.exhaustTemp,
                        turboBoostPressure: parameters.turboBoostPressure,
                      }}
                      onParameterChange={updateParameter}
                    />
                  </motion.div>
                )}

                {/* ELECTRICAL PANEL */}
                {activeScreen === 'electrical' && (
                  <motion.div
                    key="electrical"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ElectricalPanel
                      parameters={{
                        voltageL1N: parameters.voltageL1N,
                        voltageL2N: parameters.voltageL2N,
                        voltageL3N: parameters.voltageL3N,
                        voltageL1L2: parameters.voltageL1L2,
                        voltageL2L3: parameters.voltageL2L3,
                        voltageL3L1: parameters.voltageL3L1,
                        currentL1: parameters.currentL1,
                        currentL2: parameters.currentL2,
                        currentL3: parameters.currentL3,
                        currentNeutral: parameters.currentNeutral,
                        activePowerKw: parameters.activePowerKw,
                        reactivePowerKvar: parameters.reactivePowerKvar,
                        apparentPowerKva: parameters.apparentPowerKva,
                        powerFactor: parameters.powerFactor,
                        frequency: parameters.frequency,
                      }}
                      onParameterChange={updateParameter}
                    />
                  </motion.div>
                )}

                {/* FAULTS PANEL */}
                {activeScreen === 'faults' && (
                  <motion.div
                    key="faults"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <FaultDiagnosticsPanel
                      onSearch={handleSearch}
                      searchResults={searchResults as any}
                      isSearching={isSearching}
                    />
                  </motion.div>
                )}

                {/* ADVANCED DIAGNOSTICS */}
                {activeScreen === 'advanced' && (
                  <motion.div
                    key="advanced"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <AdvancedDiagnosticsPanel />
                  </motion.div>
                )}

                {/* WIRING DIAGRAMS */}
                {activeScreen === 'wiring' && (
                  <motion.div
                    key="wiring"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <WiringDiagramsPanel />
                  </motion.div>
                )}

                {/* ALL 9 CONTROLLERS WIRING DIAGRAMS */}
                {activeScreen === 'allwiring' && (
                  <motion.div
                    key="allwiring"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <HolographicGlassPanel
                      title="All 10 Controllers - Complete Wiring Reference"
                      subtitle="DSE • ComAp • Woodward • SmartGen • CAT PowerWizard • Datakom • Lovato • Siemens • ENKO • VODIA"
                      icon="🔌"
                      accentColor="cyan"
                      variant="glow"
                    >
                      <p className="text-slate-300 text-sm mb-4">
                        Complete terminal pinouts, wire color codes (IEC Standard), and connection diagrams for all 9 major generator controller brands.
                        Professional-grade reference for technicians and engineers.
                      </p>
                    </HolographicGlassPanel>
                    <AllControllerWiringDiagrams />
                  </motion.div>
                )}

                {/* TECHNICIAN INPUT DIAGNOSTICS */}
                {activeScreen === 'techinput' && (
                  <motion.div
                    key="techinput"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <HolographicGlassPanel
                      title="Technician Input Diagnostics"
                      subtitle="Enter Your Readings - Get Instant Analysis"
                      icon="📊"
                      accentColor="purple"
                      variant="glow"
                    >
                      <p className="text-slate-300 text-sm">
                        Input your meter readings and the system will instantly analyze each parameter, identify problems,
                        provide possible causes, and recommend immediate actions plus long-term solutions.
                        This is where the diagnostic magic happens!
                      </p>
                    </HolographicGlassPanel>
                    <TechnicianInputDiagnostics />
                  </motion.div>
                )}

                {/* REAL-TIME MONITORING PANEL */}
                {activeScreen === 'realtime' && (
                  <motion.div
                    key="realtime"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <RealTimeMonitoringPanel />
                  </motion.div>
                )}

                {/* OBD-II / CAN PROTOCOL PANEL */}
                {activeScreen === 'obd' && (
                  <motion.div
                    key="obd"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <OBDProtocolPanel />
                  </motion.div>
                )}

                {/* REMOTE CONNECTIVITY PANEL */}
                {activeScreen === 'remote' && (
                  <motion.div
                    key="remote"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <RemoteConnectivityPanel />
                  </motion.div>
                )}

                {/* PREDICTIVE MAINTENANCE PANEL */}
                {activeScreen === 'predictive' && (
                  <motion.div
                    key="predictive"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <PredictiveMaintenancePanel />
                  </motion.div>
                )}

                {/* DATA RECORDING & GRAPHING PANEL */}
                {activeScreen === 'recording' && (
                  <motion.div
                    key="recording"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <DataRecordingPanel />
                  </motion.div>
                )}

                {/* CONTROLLER REPAIR MANUALS PANEL */}
                {activeScreen === 'manuals' && (
                  <motion.div
                    key="manuals"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ControllerRepairManualsPanel />
                  </motion.div>
                )}

                {/* CONTROLLER SIMULATOR */}
                {activeScreen === 'simulator' && (
                  <motion.div
                    key="simulator"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <HolographicGlassPanel title="Controller Simulator" subtitle="Interactive Display Emulation" icon="🖥️" accentColor="cyan" variant="glow">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {(Object.keys(CONTROLLER_TYPES) as ControllerType[]).map(type => (
                          <motion.button
                            key={type}
                            onClick={() => setSimulatorController(type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              simulatorController === type
                                ? 'bg-cyan-500 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            {CONTROLLER_TYPES[type].shortName || type}
                          </motion.button>
                        ))}
                      </div>
                    </HolographicGlassPanel>

                    <ControllerSimulator controllerType={simulatorController} />
                  </motion.div>
                )}

                {/* DETAILED FAULT ANALYSIS */}
                {activeScreen === 'faultanalysis' && (
                  <motion.div
                    key="faultanalysis"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <HolographicGlassPanel title="Detailed Fault Analysis" subtitle="Comprehensive Diagnostic Reports" icon="🔍" accentColor="purple" variant="glow">
                      <p className="text-slate-400 mb-6">
                        Each fault code includes comprehensive multi-paragraph descriptions, diagnostic procedures,
                        step-by-step reset instructions, and expert repair solutions.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[
                          { icon: '📝', title: 'Detailed Descriptions', desc: '4+ paragraph explanations' },
                          { icon: '🔧', title: 'Step-by-Step Fixes', desc: 'Expert repair procedures' },
                          { icon: '🔄', title: 'Reset Instructions', desc: 'Clear fault clearing guides' },
                        ].map((item) => (
                          <div key={item.title} className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                            <div className="text-2xl mb-2">{item.icon}</div>
                            <div className="text-white font-medium">{item.title}</div>
                            <div className="text-sm text-slate-400">{item.desc}</div>
                          </div>
                        ))}
                      </div>
                    </HolographicGlassPanel>

                    <DetailedFaultDisplay faultCode={DETAILED_FAULT_CODES['190-0']} />
                  </motion.div>
                )}

                {/* TECHNICIAN ASSISTANT */}
                {activeScreen === 'assistant' && (
                  <motion.div
                    key="assistant"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <TechnicianAssistantPanel />
                  </motion.div>
                )}

                {/* HISTORY */}
                {activeScreen === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <HolographicGlassPanel title={t.tabHistory} subtitle={t.diagnosisResults} icon="📋" accentColor="purple" variant="glow">
                      {diagnosisHistory.length === 0 ? (
                        <div className="text-center py-12">
                          <motion.div
                            className="text-6xl mb-4"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            📋
                          </motion.div>
                          <div className="text-slate-400 text-lg">{t.noFaultsDetected}</div>
                          <div className="text-sm text-slate-600 mt-2">{t.runDiagnosis}</div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {diagnosisHistory.map((entry, idx) => (
                            <motion.div
                              key={entry.id || idx}
                              className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-purple-500/50 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="font-mono text-cyan-400">{entry.faultCode}</span>
                                  <span className="text-white ml-3">{entry.faultTitle}</span>
                                </div>
                                <span className="text-xs text-slate-500">
                                  {new Date(entry.timestamp).toLocaleDateString()}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </HolographicGlassPanel>
                  </motion.div>
                )}

                {/* SETTINGS */}
                {activeScreen === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <HolographicGlassPanel title={t.tabSettings} subtitle={t.tabSettings} icon="⚙️" accentColor="cyan" variant="glow">
                      <div className="space-y-6">
                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                          <div className="text-sm text-slate-400 mb-3">🌐 Language / Lugha / Langue / لغة / भाषा / 语言</div>
                          <select
                            value={language}
                            onChange={(e) => handleLanguageChange(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-lg"
                          >
                            {SUPPORTED_ORACLE_LANGUAGES.map(lang => (
                              <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">{t.offlineMode}</span>
                            <span className={offlineReady ? 'text-green-400 font-medium' : 'text-amber-400'}>
                              {offlineReady ? `${totalCodes.toLocaleString()} ${t.faultCodes}` : t.syncPending}
                            </span>
                          </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl">
                          <div className="flex items-center gap-3 text-amber-400 mb-2">
                            <motion.span
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              🎁
                            </motion.span>
                            <span className="font-bold text-lg">FREE Access Period</span>
                          </div>
                          <div className="text-slate-300">
                            Full premium access until <strong className="text-white">March 1st, 2026</strong>
                          </div>
                          <div className="text-sm text-slate-500 mt-1">
                            After trial: KES 20,000/year for unlimited access
                          </div>
                        </div>
                      </div>
                    </HolographicGlassPanel>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* ==================== PREMIUM FOOTER ==================== */}
          <footer className="flex-shrink-0 bg-slate-950/90 backdrop-blur-2xl border-t border-cyan-500/20 py-3 px-4 lg:px-6">
            <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
              <div className="flex items-center gap-4">
                <motion.span
                  className="text-cyan-400 font-medium"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Generator Oracle v3.0
                </motion.span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">DSE | ComAp | Woodward | SmartGen | PowerWizard Compatible</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">FREE until March 1, 2026</span>
                <motion.span
                  className="px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 rounded-full text-xs font-medium border border-green-500/30"
                  animate={{ boxShadow: ['0 0 0 rgba(34,197,94,0)', '0 0 15px rgba(34,197,94,0.3)', '0 0 0 rgba(34,197,94,0)'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  PREMIUM ACTIVE
                </motion.span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </LicenseGate>
  );
}
