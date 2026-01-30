'use client';

/**
 * DiagnosticDashboard - Premium Sci-Fi Diagnostic Interface
 * Real-time visualization, charts, and analytics
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ParameterTrendChart,
  FaultDistributionChart,
  HealthRadarChart,
  FaultHistoryChart,
  CircularGauge,
  DataStreamIndicator,
  HolographicPanel,
} from './DiagnosticCharts';
import type { LiveParameters } from '@/lib/generator-oracle/parameterThresholds';

interface DiagnosticDashboardProps {
  parameters: LiveParameters;
  controllerModel: string | null;
  totalFaultCodes: number;
}

export default function DiagnosticDashboard({
  parameters,
  controllerModel,
  totalFaultCodes,
}: DiagnosticDashboardProps) {
  const [voltageHistory, setVoltageHistory] = useState<number[]>([]);
  const [frequencyHistory, setFrequencyHistory] = useState<number[]>([]);
  const [loadHistory, setLoadHistory] = useState<number[]>([]);
  const [systemTime, setSystemTime] = useState(new Date());
  const [activeView, setActiveView] = useState<'overview' | 'trends' | 'analysis'>('overview');

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemTime(new Date());

      // Add to history arrays (keep last 12 points)
      setVoltageHistory(prev => {
        const newVal = parameters.voltageL1N || 220 + (Math.random() - 0.5) * 10;
        return [...prev.slice(-11), newVal];
      });
      setFrequencyHistory(prev => {
        const newVal = parameters.frequency || 50 + (Math.random() - 0.5) * 2;
        return [...prev.slice(-11), newVal];
      });
      setLoadHistory(prev => {
        const newVal = parameters.loadPercent || 60 + (Math.random() - 0.5) * 20;
        return [...prev.slice(-11), newVal];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [parameters]);

  // Sample data for charts
  const faultDistribution = {
    data: [35, 25, 20, 15, 5],
    labels: ['Electrical', 'Engine', 'Fuel', 'Cooling', 'Other'],
  };

  const healthMetrics = [
    { label: 'Voltage', value: parameters.voltageL1N || 230, max: 280 },
    { label: 'Frequency', value: parameters.frequency || 50, max: 55 },
    { label: 'Oil Press', value: parameters.oilPressure || 45, max: 80 },
    { label: 'Coolant', value: parameters.coolantTemp || 75, max: 110 },
    { label: 'Battery', value: parameters.batteryVoltage || 13.5, max: 15 },
    { label: 'Load', value: parameters.loadPercent || 65, max: 100 },
  ];

  const monthlyFaults = {
    data: [3, 5, 2, 8, 4, 1, 6, 3, 2, 4, 1, 2],
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Diagnostic Dashboard</h2>
          <DataStreamIndicator active={true} />
        </div>

        {/* View Selector */}
        <div className="flex gap-1 p-1 bg-slate-900/50 rounded-lg border border-slate-700">
          {(['overview', 'trends', 'analysis'] as const).map(view => (
            <button
              key={view}
              onClick={() => setActiveView(view)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeView === view
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* System Time */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/50 rounded border border-slate-700">
          <span className="text-xs text-slate-500">SYSTEM TIME</span>
          <span className="text-cyan-400 font-mono text-sm">
            {systemTime.toLocaleTimeString('en-US', { hour12: false })}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Overview View */}
        {activeView === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Live Gauges */}
            <HolographicPanel title="Live Parameters" icon="📊" className="lg:col-span-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                <CircularGauge
                  value={parameters.voltageL1N || 230}
                  max={280}
                  label="Voltage L1"
                  unit="V"
                  thresholds={{ warning: 85, critical: 95 }}
                />
                <CircularGauge
                  value={parameters.frequency || 50}
                  max={55}
                  label="Frequency"
                  unit="Hz"
                  thresholds={{ warning: 90, critical: 98 }}
                />
                <CircularGauge
                  value={parameters.oilPressure || 45}
                  max={80}
                  label="Oil Pressure"
                  unit="PSI"
                  thresholds={{ warning: 30, critical: 20 }}
                />
                <CircularGauge
                  value={parameters.coolantTemp || 75}
                  max={110}
                  label="Coolant"
                  unit="°C"
                  thresholds={{ warning: 80, critical: 95 }}
                />
                <CircularGauge
                  value={parameters.loadPercent || 65}
                  max={100}
                  label="Load"
                  unit="%"
                  thresholds={{ warning: 80, critical: 95 }}
                />
              </div>
            </HolographicPanel>

            {/* Quick Stats */}
            <HolographicPanel title="System Status" icon="⚡">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🔮</span>
                    <div>
                      <div className="text-sm text-slate-400">Total Codes</div>
                      <div className="text-xl font-bold text-cyan-400">{totalFaultCodes.toLocaleString()}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🎛️</span>
                    <div>
                      <div className="text-sm text-slate-400">Controller</div>
                      <div className="text-lg font-medium text-white">{controllerModel || 'Not Selected'}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="text-2xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✅
                    </motion.span>
                    <div>
                      <div className="text-sm text-slate-400">System Health</div>
                      <div className="text-lg font-bold text-green-400">OPERATIONAL</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  <div className="flex items-center gap-2 text-amber-400 text-sm font-medium mb-2">
                    <span>🎁</span> FREE ACCESS PERIOD
                  </div>
                  <div className="text-xs text-slate-400">
                    Full access until March 1st, 2026
                  </div>
                </div>
              </div>
            </HolographicPanel>
          </motion.div>
        )}

        {/* Trends View */}
        {activeView === 'trends' && (
          <motion.div
            key="trends"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <HolographicPanel title="Voltage Trend" icon="⚡">
              <ParameterTrendChart
                data={voltageHistory.length > 0 ? voltageHistory : [230, 228, 232, 229, 231, 227, 233, 230, 228, 231, 229, 230]}
                label="Voltage L1-N (V)"
                color="cyan"
                height={220}
              />
            </HolographicPanel>

            <HolographicPanel title="Frequency Trend" icon="📈">
              <ParameterTrendChart
                data={frequencyHistory.length > 0 ? frequencyHistory : [50, 49.8, 50.2, 50.1, 49.9, 50, 50.3, 49.7, 50.1, 50, 49.9, 50.2]}
                label="Frequency (Hz)"
                color="amber"
                height={220}
              />
            </HolographicPanel>

            <HolographicPanel title="Load Trend" icon="📊">
              <ParameterTrendChart
                data={loadHistory.length > 0 ? loadHistory : [60, 65, 55, 70, 62, 58, 72, 68, 61, 67, 63, 59]}
                label="Load (%)"
                color="green"
                height={220}
              />
            </HolographicPanel>

            <HolographicPanel title="Monthly Fault History" icon="📅">
              <FaultHistoryChart
                data={monthlyFaults.data}
                labels={monthlyFaults.labels}
                height={220}
              />
            </HolographicPanel>
          </motion.div>
        )}

        {/* Analysis View */}
        {activeView === 'analysis' && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <HolographicPanel title="Fault Distribution" icon="🔴">
              <FaultDistributionChart
                data={faultDistribution.data}
                labels={faultDistribution.labels}
                height={280}
              />
            </HolographicPanel>

            <HolographicPanel title="System Health Radar" icon="🎯">
              <HealthRadarChart metrics={healthMetrics} height={280} />
            </HolographicPanel>

            {/* Analysis Summary */}
            <HolographicPanel title="Analysis Summary" icon="📋" className="lg:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnalysisCard
                  title="Most Common Faults"
                  value="Electrical"
                  subtext="35% of all faults"
                  color="red"
                  icon="⚡"
                />
                <AnalysisCard
                  title="Avg. Resolution Time"
                  value="2.4 hrs"
                  subtext="Down from 3.1 hrs"
                  color="green"
                  icon="⏱️"
                />
                <AnalysisCard
                  title="Predicted Issues"
                  value="2"
                  subtext="Next 30 days"
                  color="amber"
                  icon="🔮"
                />
                <AnalysisCard
                  title="System Efficiency"
                  value="94.2%"
                  subtext="Above target"
                  color="cyan"
                  icon="📊"
                />
              </div>
            </HolographicPanel>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AnalysisCard({
  title,
  value,
  subtext,
  color,
  icon,
}: {
  title: string;
  value: string;
  subtext: string;
  color: 'cyan' | 'amber' | 'green' | 'red';
  icon: string;
}) {
  const colorClasses = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
    red: 'text-red-400 bg-red-500/10 border-red-500/30',
  };

  return (
    <motion.div
      className={`p-4 rounded-xl border ${colorClasses[color]}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${colorClasses[color]}`}>
          {color === 'green' ? '↑' : color === 'red' ? '↓' : '→'}
        </span>
      </div>
      <div className="text-xs text-slate-400 mb-1">{title}</div>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{subtext}</div>
    </motion.div>
  );
}
