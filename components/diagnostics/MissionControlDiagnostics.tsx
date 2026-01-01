'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Mission Control Aerospace-Style Diagnostic Module
 * Futuristic interface for system monitoring and diagnostics
 * Inspired by modern spacecraft mission control interfaces
 */

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: 'nominal' | 'warning' | 'critical' | 'offline';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface SystemModule {
  id: string;
  name: string;
  status: 'online' | 'standby' | 'offline' | 'error';
  health: number;
  lastCheck: Date;
}

interface DiagnosticLog {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  module: string;
  message: string;
}

// Status color mapping
const statusColors = {
  nominal: { bg: 'bg-cyan-500/20', border: 'border-cyan-500', text: 'text-cyan-400', glow: 'shadow-cyan-500/50' },
  warning: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/50' },
  critical: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' },
  offline: { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-400', glow: 'shadow-slate-500/50' },
  online: { bg: 'bg-emerald-500/20', border: 'border-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/50' },
  standby: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/50' },
  error: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' },
};

// Animated grid background
const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Horizontal scan line */}
    <motion.div
      className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
    />
    {/* Grid pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-10">
      <defs>
        <pattern id="cockpit-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-cyan-500" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#cockpit-grid)" />
    </svg>
    {/* Corner brackets */}
    <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-cyan-500/50" />
    <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-cyan-500/50" />
    <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-cyan-500/50" />
    <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-cyan-500/50" />
  </div>
);

// Circular gauge component
const CircularGauge = ({ value, max = 100, size = 120, label, status }: {
  value: number;
  max?: number;
  size?: number;
  label: string;
  status: 'nominal' | 'warning' | 'critical' | 'offline';
}) => {
  const percentage = (value / max) * 100;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;
  
  const colors = statusColors[status];
  
  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700/50"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={colors.text}
          style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
        />
        {/* Tick marks */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1={size / 2}
            y1={strokeWidth}
            x2={size / 2}
            y2={strokeWidth + 4}
            stroke="currentColor"
            strokeWidth="1"
            className="text-slate-500/50"
            transform={`rotate(${i * 30} ${size / 2} ${size / 2})`}
          />
        ))}
      </svg>
      {/* Center value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={value}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-2xl font-mono font-bold ${colors.text}`}
        >
          {value.toFixed(0)}
        </motion.span>
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
    </div>
  );
};

// Mini sparkline chart
const Sparkline = ({ data, color = 'cyan' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 30;
  const width = 100;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`sparkline-gradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity="0.3" />
          <stop offset="100%" stopColor={`rgb(var(--color-${color}-500))`} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        className={`fill-${color}-500/20`}
      />
      {/* Line */}
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={`text-${color}-400`}
        style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
      />
      {/* End dot */}
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        className={`fill-${color}-400`}
        style={{ filter: 'drop-shadow(0 0 6px currentColor)' }}
      />
    </svg>
  );
};

// Status indicator pill
const StatusPill = ({ status, pulse = false }: { status: string; pulse?: boolean }) => {
  const colors = statusColors[status as keyof typeof statusColors] || statusColors.offline;
  
  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colors.bg} border ${colors.border}`}>
      <div className="relative">
        <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`} />
        {pulse && (
          <motion.div
            className={`absolute inset-0 w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')}`}
            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>
      <span className={`text-xs font-mono uppercase tracking-wider ${colors.text}`}>
        {status}
      </span>
    </div>
  );
};

// Metric card component
const MetricCard = ({ metric }: { metric: SystemMetric }) => {
  const colors = statusColors[metric.status];
  const TrendIcon = metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-lg bg-slate-900/80 border ${colors.border} backdrop-blur-sm overflow-hidden`}
      style={{ boxShadow: `0 0 20px ${colors.glow.replace('shadow-', '').replace('/50', '')}` }}
    >
      {/* Background glow */}
      <div className={`absolute inset-0 ${colors.bg} opacity-30`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">
            {metric.label}
          </span>
          <StatusPill status={metric.status} pulse={metric.status === 'warning' || metric.status === 'critical'} />
        </div>
        
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <motion.span
              key={metric.value}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-3xl font-mono font-bold ${colors.text}`}
            >
              {metric.value.toFixed(1)}
            </motion.span>
            <span className="text-sm text-slate-500">{metric.unit}</span>
            <span className={`ml-2 text-sm ${
              metric.trend === 'up' ? 'text-emerald-400' : 
              metric.trend === 'down' ? 'text-red-400' : 'text-slate-400'
            }`}>
              {TrendIcon}
            </span>
          </div>
        </div>
        
        <div className="mt-3">
          <Sparkline data={metric.history} color={colors.text.includes('cyan') ? 'cyan' : colors.text.includes('amber') ? 'amber' : 'cyan'} />
        </div>
      </div>
    </motion.div>
  );
};

// Module status card
const ModuleCard = ({ module }: { module: SystemModule }) => {
  const colors = statusColors[module.status as keyof typeof statusColors];
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm hover:border-slate-600 transition-colors`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-sm text-white">{module.name}</span>
        <StatusPill status={module.status} pulse={module.status === 'online'} />
      </div>
      
      {/* Health bar */}
      <div className="relative h-1 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${module.health}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`absolute inset-y-0 left-0 ${colors.text.replace('text-', 'bg-')}`}
          style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
        />
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <span className="text-[10px] text-slate-500 uppercase">Health</span>
        <span className={`text-xs font-mono ${colors.text}`}>{module.health}%</span>
      </div>
    </motion.div>
  );
};

// Log entry component
const LogEntry = ({ log }: { log: DiagnosticLog }) => {
  const levelColors = {
    info: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    error: 'text-red-400 bg-red-500/10 border-red-500/30',
    success: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-start gap-3 p-2 rounded border ${levelColors[log.level]} font-mono text-xs`}
    >
      <span className="text-slate-500 whitespace-nowrap">
        {log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
      </span>
      <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${levelColors[log.level]}`}>
        {log.level}
      </span>
      <span className="text-slate-400">[{log.module}]</span>
      <span className="text-slate-300">{log.message}</span>
    </motion.div>
  );
};

// Main diagnostic component
export default function MissionControlDiagnostics() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'modules' | 'logs' | 'network'>('overview');
  const [systemTime, setSystemTime] = useState(new Date());
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { id: 'cpu', label: 'CPU Load', value: 45, unit: '%', status: 'nominal', trend: 'stable', history: [42, 45, 43, 47, 45, 44, 46, 45] },
    { id: 'memory', label: 'Memory Usage', value: 62, unit: '%', status: 'nominal', trend: 'up', history: [55, 58, 60, 59, 61, 62, 62, 62] },
    { id: 'network', label: 'Network I/O', value: 125, unit: 'MB/s', status: 'nominal', trend: 'down', history: [150, 145, 140, 135, 130, 128, 126, 125] },
    { id: 'latency', label: 'Response Time', value: 23, unit: 'ms', status: 'nominal', trend: 'stable', history: [25, 24, 23, 24, 23, 22, 23, 23] },
    { id: 'requests', label: 'Requests/sec', value: 1240, unit: 'req', status: 'nominal', trend: 'up', history: [1100, 1150, 1180, 1200, 1220, 1235, 1238, 1240] },
    { id: 'errors', label: 'Error Rate', value: 0.02, unit: '%', status: 'nominal', trend: 'down', history: [0.05, 0.04, 0.04, 0.03, 0.03, 0.02, 0.02, 0.02] },
  ]);
  
  const [modules, setModules] = useState<SystemModule[]>([
    { id: 'api', name: 'API Gateway', status: 'online', health: 98, lastCheck: new Date() },
    { id: 'db', name: 'Database Cluster', status: 'online', health: 100, lastCheck: new Date() },
    { id: 'cache', name: 'Cache Layer', status: 'online', health: 95, lastCheck: new Date() },
    { id: 'cdn', name: 'CDN Edge', status: 'online', health: 100, lastCheck: new Date() },
    { id: 'auth', name: 'Auth Service', status: 'online', health: 99, lastCheck: new Date() },
    { id: 'queue', name: 'Message Queue', status: 'standby', health: 100, lastCheck: new Date() },
    { id: 'ml', name: 'ML Pipeline', status: 'online', health: 92, lastCheck: new Date() },
    { id: 'backup', name: 'Backup System', status: 'standby', health: 100, lastCheck: new Date() },
  ]);
  
  const [logs, setLogs] = useState<DiagnosticLog[]>([
    { id: '1', timestamp: new Date(), level: 'success', module: 'SYSTEM', message: 'All systems operational' },
    { id: '2', timestamp: new Date(Date.now() - 5000), level: 'info', module: 'API', message: 'Request throughput stable at 1.2K/s' },
    { id: '3', timestamp: new Date(Date.now() - 10000), level: 'info', module: 'CACHE', message: 'Cache hit ratio: 94.2%' },
    { id: '4', timestamp: new Date(Date.now() - 15000), level: 'info', module: 'DB', message: 'Query optimization complete' },
  ]);
  
  // Update system time
  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => prev.map(metric => {
        const change = (Math.random() - 0.5) * 5;
        const newValue = Math.max(0, Math.min(metric.unit === '%' ? 100 : metric.value * 1.5, metric.value + change));
        const newHistory = [...metric.history.slice(1), newValue];
        const trend = newValue > metric.history[metric.history.length - 1] ? 'up' : newValue < metric.history[metric.history.length - 1] ? 'down' : 'stable';
        
        let status: SystemMetric['status'] = 'nominal';
        if (metric.unit === '%' && newValue > 80) status = 'warning';
        if (metric.unit === '%' && newValue > 95) status = 'critical';
        if (metric.id === 'errors' && newValue > 1) status = 'warning';
        if (metric.id === 'errors' && newValue > 5) status = 'critical';
        
        return { ...metric, value: newValue, history: newHistory, trend, status };
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Run diagnostic scan
  const runDiagnostic = useCallback(() => {
    const newLog: DiagnosticLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level: 'info',
      module: 'DIAGNOSTIC',
      message: 'Running full system diagnostic scan...',
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50));
    
    setTimeout(() => {
      const resultLog: DiagnosticLog = {
        id: (Date.now() + 1).toString(),
        timestamp: new Date(),
        level: 'success',
        module: 'DIAGNOSTIC',
        message: 'Scan complete. All systems nominal.',
      };
      setLogs(prev => [resultLog, ...prev].slice(0, 50));
    }, 2000);
  }, []);
  
  const overallHealth = Math.round(modules.reduce((acc, m) => acc + m.health, 0) / modules.length);
  const onlineCount = modules.filter(m => m.status === 'online').length;
  
  return (
    <div className={`relative bg-slate-950 text-white ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-2xl'} overflow-hidden`}>
      <GridBackground />
      
      {/* Header */}
      <div className="relative z-10 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Logo / Title */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-950"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider">MISSION CONTROL</h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">System Diagnostics v2.0</p>
              </div>
            </div>
          </div>
          
          {/* System clock */}
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="font-mono text-xl text-cyan-400" style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)' }}>
                {systemTime.toLocaleTimeString('en-US', { hour12: false })}
              </div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                {systemTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} UTC
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={runDiagnostic}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 text-xs font-mono uppercase tracking-wider hover:bg-cyan-500/30 transition-colors"
              >
                Run Scan
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isFullscreen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="flex gap-1 px-6 pb-2">
          {(['overview', 'modules', 'logs', 'network'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-slate-800/80 text-cyan-400 border-t border-x border-cyan-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 p-6 overflow-auto" style={{ maxHeight: isFullscreen ? 'calc(100vh - 140px)' : '600px' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Status summary */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <CircularGauge value={overallHealth} label="System Health" status={overallHealth > 90 ? 'nominal' : overallHealth > 70 ? 'warning' : 'critical'} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <CircularGauge value={onlineCount} max={modules.length} label="Modules Online" status="nominal" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <CircularGauge value={metrics.find(m => m.id === 'cpu')?.value || 0} label="CPU" status={metrics.find(m => m.id === 'cpu')?.status || 'nominal'} />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <CircularGauge value={metrics.find(m => m.id === 'memory')?.value || 0} label="Memory" status={metrics.find(m => m.id === 'memory')?.status || 'nominal'} />
                  </div>
                </div>
              </div>
              
              {/* Metrics grid */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  System Metrics
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {metrics.map(metric => (
                    <MetricCard key={metric.id} metric={metric} />
                  ))}
                </div>
              </div>
              
              {/* Recent logs */}
              <div>
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Recent Activity
                </h2>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {logs.slice(0, 5).map(log => (
                    <LogEntry key={log.id} log={log} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                System Modules ({onlineCount}/{modules.length} Online)
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {modules.map(module => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  System Logs
                </h2>
                <button
                  onClick={() => setLogs([])}
                  className="px-3 py-1 rounded text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1 max-h-96 overflow-auto">
                {logs.map(log => (
                  <LogEntry key={log.id} log={log} />
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'network' && (
            <motion.div
              key="network"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Network Topology
              </h2>
              
              {/* Network visualization */}
              <div className="relative h-80 rounded-xl bg-slate-900/60 border border-slate-700/50 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Central node */}
                  <motion.div
                    className="relative z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500 flex items-center justify-center">
                      <span className="text-xs font-mono text-cyan-400">CORE</span>
                    </div>
                  </motion.div>
                  
                  {/* Orbital nodes */}
                  {modules.slice(0, 6).map((module, index) => {
                    const angle = (index * 60 - 90) * (Math.PI / 180);
                    const radius = 120;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const colors = statusColors[module.status as keyof typeof statusColors];
                    
                    return (
                      <motion.div
                        key={module.id}
                        className="absolute"
                        style={{ left: `calc(50% + ${x}px - 30px)`, top: `calc(50% + ${y}px - 30px)` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {/* Connection line */}
                        <svg className="absolute" style={{ width: radius, height: 2, left: x < 0 ? 30 : -radius + 30, top: 29, transform: `rotate(${angle * (180 / Math.PI)}deg)`, transformOrigin: x < 0 ? 'right center' : 'left center' }}>
                          <line x1="0" y1="1" x2={radius - 30} y2="1" stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" className={colors.text} opacity="0.5" />
                        </svg>
                        
                        <div className={`w-14 h-14 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <span className="text-[8px] font-mono text-center leading-tight px-1 ${colors.text}">
                            {module.name.split(' ')[0]}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Data flow animation */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                      initial={{ x: '50%', y: '50%', opacity: 0 }}
                      animate={{
                        x: ['50%', `${30 + Math.random() * 40}%`, '50%'],
                        y: ['50%', `${30 + Math.random() * 40}%`, '50%'],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ filter: 'drop-shadow(0 0 4px currentColor)' }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Network stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Inbound', value: '245 MB/s', status: 'nominal' },
                  { label: 'Outbound', value: '128 MB/s', status: 'nominal' },
                  { label: 'Active Connections', value: '12,847', status: 'nominal' },
                  { label: 'Packet Loss', value: '0.001%', status: 'nominal' },
                ].map((stat, index) => (
                  <div key={index} className="p-4 rounded-lg bg-slate-900/60 border border-slate-700/50">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{stat.label}</div>
                    <div className="text-lg font-mono text-cyan-400">{stat.value}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Footer status bar */}
      <div className="relative z-10 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm px-6 py-2">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-4">
            <span>UPTIME: 99.99%</span>
            <span>•</span>
            <span>LAST SYNC: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>REGION: US-WEST-2</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
