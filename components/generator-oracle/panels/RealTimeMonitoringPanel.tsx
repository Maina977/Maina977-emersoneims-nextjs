'use client';

/**
 * REAL-TIME MONITORING PANEL
 * Live monitoring of voltage, frequency, load, fuel consumption, oil pressure
 * With animated gauges, live graphs, and threshold alerts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface MonitoringData {
  voltage: { L1N: number; L2N: number; L3N: number; L1L2: number; L2L3: number; L3L1: number };
  current: { L1: number; L2: number; L3: number; N: number };
  frequency: number;
  power: { active: number; reactive: number; apparent: number; factor: number };
  load: number;
  fuel: { level: number; consumption: number; remaining: number };
  oil: { pressure: number; temperature: number };
  coolant: { temperature: number; pressure: number };
  battery: { voltage: number; current: number; status: string };
  engine: { rpm: number; hours: number; starts: number };
  exhaust: { temperature: number };
  ambient: { temperature: number };
}

interface HistoricalDataPoint {
  timestamp: number;
  voltage: number;
  frequency: number;
  load: number;
  fuel: number;
}

// ==================== ANIMATED CIRCULAR GAUGE ====================
function CircularGauge({
  value,
  max,
  min = 0,
  unit,
  label,
  thresholds,
  size = 'md',
  decimals = 1,
}: {
  value: number;
  max: number;
  min?: number;
  unit: string;
  label: string;
  thresholds: { warning: number; danger: number };
  size?: 'sm' | 'md' | 'lg';
  decimals?: number;
}) {
  const percentage = ((value - min) / (max - min)) * 100;
  const angle = (percentage / 100) * 270 - 135; // -135 to 135 degrees

  const getColor = () => {
    if (value >= thresholds.danger) return { stroke: '#ef4444', glow: 'rgba(239,68,68,0.5)', text: 'text-red-400' };
    if (value >= thresholds.warning) return { stroke: '#f59e0b', glow: 'rgba(245,158,11,0.5)', text: 'text-amber-400' };
    return { stroke: '#22c55e', glow: 'rgba(34,197,94,0.5)', text: 'text-green-400' };
  };

  const colors = getColor();
  const sizes = {
    sm: { container: 'w-24 h-24', value: 'text-lg', label: 'text-[8px]', stroke: 6 },
    md: { container: 'w-32 h-32', value: 'text-xl', label: 'text-[10px]', stroke: 8 },
    lg: { container: 'w-40 h-40', value: 'text-2xl', label: 'text-xs', stroke: 10 },
  };

  const config = sizes[size];
  const radius = 45;
  const circumference = 2 * Math.PI * radius * (270 / 360);

  return (
    <div className={`${config.container} relative`}>
      <svg className="w-full h-full transform -rotate-[135deg]" viewBox="0 0 100 100">
        {/* Background arc */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(51,65,85,0.5)"
          strokeWidth={config.stroke}
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          strokeLinecap="round"
        />

        {/* Value arc */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={config.stroke}
          strokeDasharray={`${(percentage / 100) * circumference} ${2 * Math.PI * radius}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 6px ${colors.glow})` }}
        />

        {/* Threshold markers */}
        <circle
          cx={50 + radius * Math.cos(((thresholds.warning - min) / (max - min) * 270 - 135) * Math.PI / 180)}
          cy={50 + radius * Math.sin(((thresholds.warning - min) / (max - min) * 270 - 135) * Math.PI / 180)}
          r="2"
          fill="#f59e0b"
        />
        <circle
          cx={50 + radius * Math.cos(((thresholds.danger - min) / (max - min) * 270 - 135) * Math.PI / 180)}
          cy={50 + radius * Math.sin(((thresholds.danger - min) / (max - min) * 270 - 135) * Math.PI / 180)}
          r="2"
          fill="#ef4444"
        />
      </svg>

      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`${config.value} font-mono font-bold ${colors.text}`}
          key={value}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
        >
          {value.toFixed(decimals)}
        </motion.span>
        <span className="text-[10px] text-slate-500">{unit}</span>
        <span className={`${config.label} text-slate-400 mt-1 uppercase tracking-wider`}>{label}</span>
      </div>
    </div>
  );
}

// ==================== LINEAR GAUGE ====================
function LinearGauge({
  value,
  max,
  min = 0,
  label,
  unit,
  thresholds,
  icon,
}: {
  value: number;
  max: number;
  min?: number;
  label: string;
  unit: string;
  thresholds: { warning: number; danger: number };
  icon: string;
}) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const getColor = () => {
    if (value >= thresholds.danger) return 'from-red-500 to-red-600';
    if (value >= thresholds.warning) return 'from-amber-500 to-amber-600';
    return 'from-green-500 to-emerald-600';
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-lg font-mono font-bold text-white">
          {value.toFixed(1)} <span className="text-xs text-slate-500">{unit}</span>
        </span>
      </div>

      <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />

        {/* Warning threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-amber-500/50"
          style={{ left: `${((thresholds.warning - min) / (max - min)) * 100}%` }}
        />

        {/* Danger threshold marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500/50"
          style={{ left: `${((thresholds.danger - min) / (max - min)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between mt-1 text-[10px] text-slate-600">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ==================== VOLTAGE TRIANGLE DIAGRAM ====================
function VoltageTriangle({ voltages }: { voltages: { L1L2: number; L2L3: number; L3L1: number } }) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-cyan-500/30">
      <h4 className="text-xs text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-lg">⚡</span> Line Voltages
      </h4>

      <div className="relative h-40 flex items-center justify-center">
        <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
          {/* Triangle */}
          <motion.path
            d="M 100 20 L 180 160 L 20 160 Z"
            fill="none"
            stroke="rgba(6,182,212,0.5)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1 }}
          />

          {/* Phase nodes */}
          {[
            { cx: 100, cy: 20, label: 'L1', color: '#ef4444' },
            { cx: 180, cy: 160, label: 'L2', color: '#f59e0b' },
            { cx: 20, cy: 160, label: 'L3', color: '#22c55e' },
          ].map((node) => (
            <g key={node.label}>
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r="12"
                fill={node.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                style={{ filter: `drop-shadow(0 0 8px ${node.color})` }}
              />
              <text
                x={node.cx}
                y={node.cy + 4}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="bold"
              >
                {node.label}
              </text>
            </g>
          ))}

          {/* Voltage labels on edges */}
          <text x="145" y="80" fill="#06b6d4" fontSize="12" fontWeight="bold">{voltages.L1L2}V</text>
          <text x="90" y="170" fill="#06b6d4" fontSize="12" fontWeight="bold">{voltages.L2L3}V</text>
          <text x="35" y="80" fill="#06b6d4" fontSize="12" fontWeight="bold">{voltages.L3L1}V</text>
        </svg>
      </div>

      {/* Average */}
      <div className="text-center mt-2">
        <span className="text-xs text-slate-500">Average: </span>
        <span className="text-sm font-mono text-cyan-400">
          {((voltages.L1L2 + voltages.L2L3 + voltages.L3L1) / 3).toFixed(1)}V
        </span>
      </div>
    </div>
  );
}

// ==================== LIVE TREND GRAPH ====================
function LiveTrendGraph({
  data,
  label,
  color,
  unit,
  height = 120,
}: {
  data: number[];
  label: string;
  color: string;
  unit: string;
  height?: number;
}) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono" style={{ color }}>
          {data[data.length - 1]?.toFixed(1) || '0'} {unit}
        </span>
      </div>

      <svg
        className="w-full"
        style={{ height }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="rgba(51,65,85,0.3)"
            strokeWidth="0.5"
          />
        ))}

        {/* Area fill */}
        <motion.path
          d={`M 0,100 L 0,${100 - ((data[0] - min) / range) * 100} ${points} L 100,100 Z`}
          fill={`${color}20`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1 }}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />

        {/* Latest point */}
        <motion.circle
          cx="100"
          cy={100 - ((data[data.length - 1] - min) / range) * 100}
          r="3"
          fill={color}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </svg>

      {/* Time axis */}
      <div className="flex justify-between mt-1 text-[10px] text-slate-600">
        <span>-60s</span>
        <span>-30s</span>
        <span>Now</span>
      </div>
    </div>
  );
}

// ==================== FUEL TANK VISUALIZATION ====================
function FuelTank({ level, consumption, remaining }: { level: number; consumption: number; remaining: number }) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⛽</span>
        <div>
          <h4 className="text-sm font-bold text-amber-400">Fuel System</h4>
          <p className="text-[10px] text-slate-500">Real-time fuel monitoring</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Tank visualization */}
        <div className="relative w-16 h-32 bg-slate-800 rounded-lg overflow-hidden border-2 border-slate-600">
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-amber-600 to-amber-400"
            initial={{ height: 0 }}
            animate={{ height: `${level}%` }}
            transition={{ duration: 1 }}
            style={{
              boxShadow: 'inset 0 0 20px rgba(245,158,11,0.3)',
            }}
          />

          {/* Level markers */}
          {[25, 50, 75].map((mark) => (
            <div
              key={mark}
              className="absolute left-0 right-0 border-t border-slate-600/50"
              style={{ bottom: `${mark}%` }}
            >
              <span className="absolute -right-8 -top-2 text-[8px] text-slate-500">{mark}%</span>
            </div>
          ))}

          {/* Current level indicator */}
          <div
            className="absolute left-0 right-0 h-0.5 bg-white"
            style={{ bottom: `${level}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="p-2 bg-slate-950/50 rounded-lg">
            <div className="text-[10px] text-slate-500 uppercase">Level</div>
            <div className="text-xl font-mono font-bold text-amber-400">{level.toFixed(0)}%</div>
          </div>

          <div className="p-2 bg-slate-950/50 rounded-lg">
            <div className="text-[10px] text-slate-500 uppercase">Consumption</div>
            <div className="text-lg font-mono text-white">{consumption.toFixed(1)} <span className="text-xs text-slate-500">L/hr</span></div>
          </div>

          <div className="p-2 bg-slate-950/50 rounded-lg">
            <div className="text-[10px] text-slate-500 uppercase">Run Time Left</div>
            <div className="text-lg font-mono text-green-400">{remaining.toFixed(1)} <span className="text-xs text-slate-500">hrs</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== POWER METER ====================
function PowerMeter({ power }: { power: { active: number; reactive: number; apparent: number; factor: number } }) {
  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-purple-500/30">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">⚡</span>
        <h4 className="text-sm font-bold text-purple-400">Power Analysis</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-slate-950/50 rounded-lg text-center">
          <div className="text-2xl font-mono font-bold text-green-400">{power.active.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 uppercase">kW Active</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-lg text-center">
          <div className="text-2xl font-mono font-bold text-amber-400">{power.reactive.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 uppercase">kVAR Reactive</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-lg text-center">
          <div className="text-2xl font-mono font-bold text-purple-400">{power.apparent.toFixed(1)}</div>
          <div className="text-[10px] text-slate-500 uppercase">kVA Apparent</div>
        </div>

        <div className="p-3 bg-slate-950/50 rounded-lg text-center">
          <div className="text-2xl font-mono font-bold text-cyan-400">{power.factor.toFixed(2)}</div>
          <div className="text-[10px] text-slate-500 uppercase">Power Factor</div>
        </div>
      </div>

      {/* Power triangle visualization */}
      <div className="mt-4 h-20 relative">
        <svg viewBox="0 0 200 80" className="w-full h-full">
          <motion.path
            d="M 10 70 L 150 70 L 150 20 Z"
            fill="rgba(139,92,246,0.1)"
            stroke="rgba(139,92,246,0.5)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
          />
          <text x="70" y="85" fill="#94a3b8" fontSize="10">kW ({power.active})</text>
          <text x="155" y="50" fill="#94a3b8" fontSize="10">kVAR</text>
          <text x="60" y="40" fill="#a855f7" fontSize="10">kVA ({power.apparent})</text>
        </svg>
      </div>
    </div>
  );
}

// ==================== MAIN REAL-TIME MONITORING PANEL ====================
export default function RealTimeMonitoringPanel() {
  const [data, setData] = useState<MonitoringData>({
    voltage: { L1N: 230, L2N: 232, L3N: 229, L1L2: 400, L2L3: 402, L3L1: 398 },
    current: { L1: 125, L2: 128, L3: 122, N: 8 },
    frequency: 50.02,
    power: { active: 85, reactive: 32, apparent: 91, factor: 0.93 },
    load: 72,
    fuel: { level: 78, consumption: 18.5, remaining: 8.4 },
    oil: { pressure: 45, temperature: 85 },
    coolant: { temperature: 78, pressure: 15 },
    battery: { voltage: 13.8, current: 2.5, status: 'Float Charge' },
    engine: { rpm: 1500, hours: 2847.5, starts: 342 },
    exhaust: { temperature: 420 },
    ambient: { temperature: 28 },
  });

  const [history, setHistory] = useState<{
    voltage: number[];
    frequency: number[];
    load: number[];
    fuel: number[];
  }>({
    voltage: Array(60).fill(230),
    frequency: Array(60).fill(50),
    load: Array(60).fill(70),
    fuel: Array(60).fill(80),
  });

  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        voltage: {
          L1N: 228 + Math.random() * 4,
          L2N: 230 + Math.random() * 4,
          L3N: 227 + Math.random() * 4,
          L1L2: 398 + Math.random() * 6,
          L2L3: 400 + Math.random() * 6,
          L3L1: 396 + Math.random() * 6,
        },
        current: {
          L1: 120 + Math.random() * 15,
          L2: 122 + Math.random() * 15,
          L3: 118 + Math.random() * 15,
          N: 5 + Math.random() * 8,
        },
        frequency: 49.95 + Math.random() * 0.1,
        power: {
          active: 80 + Math.random() * 15,
          reactive: 28 + Math.random() * 10,
          apparent: 88 + Math.random() * 10,
          factor: 0.9 + Math.random() * 0.08,
        },
        load: 68 + Math.random() * 10,
        fuel: {
          ...prev.fuel,
          level: Math.max(0, prev.fuel.level - 0.001),
          consumption: 17 + Math.random() * 3,
        },
        oil: {
          pressure: 42 + Math.random() * 8,
          temperature: 82 + Math.random() * 8,
        },
        engine: {
          ...prev.engine,
          rpm: 1498 + Math.random() * 5,
        },
      }));

      setHistory(prev => ({
        voltage: [...prev.voltage.slice(1), 228 + Math.random() * 4],
        frequency: [...prev.frequency.slice(1), 49.95 + Math.random() * 0.1],
        load: [...prev.load.slice(1), 68 + Math.random() * 10],
        fuel: [...prev.fuel.slice(1), data.fuel.level],
      }));

      setLastUpdate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [data.fuel.level]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center"
            animate={{ boxShadow: ['0 0 20px rgba(6,182,212,0.5)', '0 0 40px rgba(6,182,212,0.3)', '0 0 20px rgba(6,182,212,0.5)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-3xl">📊</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Real-Time Monitoring</h2>
            <p className="text-sm text-slate-500">Live voltage, frequency, load & fuel monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <motion.div
              className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-slate-400">{isConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>
          <span className="text-xs text-slate-500">
            Updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Gauges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.voltage.L1N}
            max={260}
            min={200}
            unit="V"
            label="L1-N"
            thresholds={{ warning: 245, danger: 255 }}
            size="md"
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.frequency}
            max={52}
            min={48}
            unit="Hz"
            label="Frequency"
            thresholds={{ warning: 51, danger: 51.5 }}
            size="md"
            decimals={2}
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.load}
            max={100}
            min={0}
            unit="%"
            label="Load"
            thresholds={{ warning: 80, danger: 95 }}
            size="md"
            decimals={0}
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.engine.rpm}
            max={1800}
            min={0}
            unit="RPM"
            label="Engine"
            thresholds={{ warning: 1600, danger: 1700 }}
            size="md"
            decimals={0}
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.oil.pressure}
            max={80}
            min={0}
            unit="PSI"
            label="Oil Press"
            thresholds={{ warning: 60, danger: 70 }}
            size="md"
          />
        </div>
        <div className="flex flex-col items-center">
          <CircularGauge
            value={data.coolant.temperature}
            max={110}
            min={0}
            unit="°C"
            label="Coolant"
            thresholds={{ warning: 95, danger: 105 }}
            size="md"
            decimals={0}
          />
        </div>
      </div>

      {/* Detailed Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Voltage Triangle */}
        <VoltageTriangle voltages={data.voltage} />

        {/* Power Analysis */}
        <PowerMeter power={data.power} />

        {/* Fuel Tank */}
        <FuelTank
          level={data.fuel.level}
          consumption={data.fuel.consumption}
          remaining={data.fuel.remaining}
        />
      </div>

      {/* Live Graphs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveTrendGraph data={history.voltage} label="Voltage Trend" color="#06b6d4" unit="V" />
        <LiveTrendGraph data={history.frequency} label="Frequency Trend" color="#22c55e" unit="Hz" />
        <LiveTrendGraph data={history.load} label="Load Trend" color="#f59e0b" unit="%" />
        <LiveTrendGraph data={history.fuel} label="Fuel Trend" color="#a855f7" unit="%" />
      </div>

      {/* Linear Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LinearGauge
          value={data.oil.temperature}
          max={120}
          min={0}
          label="Oil Temperature"
          unit="°C"
          thresholds={{ warning: 95, danger: 110 }}
          icon="🛢️"
        />
        <LinearGauge
          value={data.exhaust.temperature}
          max={600}
          min={0}
          label="Exhaust Temp"
          unit="°C"
          thresholds={{ warning: 500, danger: 550 }}
          icon="💨"
        />
        <LinearGauge
          value={data.battery.voltage}
          max={15}
          min={10}
          label="Battery"
          unit="V"
          thresholds={{ warning: 14.2, danger: 14.8 }}
          icon="🔋"
        />
        <LinearGauge
          value={data.ambient.temperature}
          max={50}
          min={0}
          label="Ambient Temp"
          unit="°C"
          thresholds={{ warning: 40, danger: 45 }}
          icon="🌡️"
        />
      </div>

      {/* Engine Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl font-mono font-bold text-cyan-400">{data.engine.hours.toLocaleString()}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Engine Hours</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl font-mono font-bold text-green-400">{data.engine.starts}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Total Starts</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl font-mono font-bold text-amber-400">{data.battery.status}</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Charger Status</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
          <div className="text-3xl font-mono font-bold text-purple-400">{data.battery.current}A</div>
          <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Charge Current</div>
        </div>
      </div>
    </div>
  );
}
