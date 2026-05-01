/**
 * 🚀 WORLD-CLASS UPS CALCULATOR WITH CHART.JS
 *
 * THE MOST ADVANCED UPS SIZING CALCULATOR IN THE INDUSTRY
 *
 * Features:
 * ✅ Real-time circular pressure gauges for battery SOC & load utilization
 * ✅ Live Chart.js visualizations (Line, Bar, Doughnut, Radar)
 * ✅ Battery runtime projections with discharge curves
 * ✅ Detailed engineering-grade UPS calculations
 * ✅ Interactive cost breakdowns with lifecycle analysis
 * ✅ Professional glassmorphic UI
 *
 * NO COMPETITOR IN KENYA OR AFRICA HAS THIS LEVEL OF DETAIL!
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

// =====================================================
// CONSTANTS
// =====================================================
const COMMON_LOADS = [
  { name: 'Desktop Computer', watts: 300, pf: 0.8, critical: true },
  { name: 'Laptop', watts: 65, pf: 0.95, critical: true },
  { name: 'Monitor (24")', watts: 40, pf: 0.9, critical: false },
  { name: 'Server (Tower)', watts: 500, pf: 0.85, critical: true },
  { name: 'Server (Rack 1U)', watts: 350, pf: 0.9, critical: true },
  { name: 'Network Switch (24-port)', watts: 25, pf: 0.8, critical: true },
  { name: 'Router', watts: 15, pf: 0.8, critical: true },
  { name: 'CCTV DVR', watts: 30, pf: 0.8, critical: true },
  { name: 'Cash Register/POS', watts: 200, pf: 0.85, critical: true },
  { name: 'Printer (Laser)', watts: 500, pf: 0.6, critical: false },
  { name: 'Printer (Inkjet)', watts: 50, pf: 0.7, critical: false },
  { name: 'LED TV (55")', watts: 100, pf: 0.9, critical: false },
  { name: 'Medical Equipment', watts: 300, pf: 0.85, critical: true },
  { name: 'Laboratory Instrument', watts: 400, pf: 0.8, critical: true },
];

const UPS_TYPES = [
  { type: 'Offline/Standby', efficiency: 0.90, switchTime: 10, protection: 'Basic', priceMultiplier: 0.5 },
  { type: 'Line Interactive', efficiency: 0.95, switchTime: 5, protection: 'Medium', priceMultiplier: 1.0 },
  { type: 'Online Double-Conversion', efficiency: 0.92, switchTime: 0, protection: 'Maximum', priceMultiplier: 2.0 },
  { type: 'Online Transformer-Based', efficiency: 0.90, switchTime: 0, protection: 'Industrial', priceMultiplier: 3.0 },
];

const BATTERY_TYPES = [
  { type: 'Lead-Acid VRLA', voltage: 12, capacity: 7, cycles: 500, pricePerAh: 8, lifeYears: 3 },
  { type: 'AGM Deep Cycle', voltage: 12, capacity: 100, cycles: 800, pricePerAh: 12, lifeYears: 5 },
  { type: 'Gel', voltage: 12, capacity: 100, cycles: 1000, pricePerAh: 15, lifeYears: 6 },
  { type: 'Lithium Iron Phosphate', voltage: 12, capacity: 100, cycles: 3000, pricePerAh: 35, lifeYears: 10 },
];

const STANDARD_UPS_SIZES = [
  { va: 650, watts: 400, price: 8000 },
  { va: 1000, watts: 600, price: 15000 },
  { va: 1500, watts: 900, price: 22000 },
  { va: 2000, watts: 1200, price: 30000 },
  { va: 3000, watts: 1800, price: 45000 },
  { va: 5000, watts: 3500, price: 80000 },
  { va: 6000, watts: 4200, price: 95000 },
  { va: 10000, watts: 7000, price: 180000 },
  { va: 20000, watts: 16000, price: 400000 },
];

export default function AdvancedUPSCalculator() {
  const [activeTab, setActiveTab] = useState<'loads' | 'battery' | 'sizing' | 'cost'>('loads');
  const [selectedLoads, setSelectedLoads] = useState<{name: string, watts: number, pf: number, qty: number, critical: boolean}[]>([
    { name: 'Desktop Computer', watts: 300, pf: 0.8, qty: 2, critical: true },
    { name: 'Monitor (24")', watts: 40, pf: 0.9, qty: 2, critical: false },
    { name: 'Router', watts: 15, pf: 0.8, qty: 1, critical: true },
  ]);
  const [customLoad, setCustomLoad] = useState({ name: '', watts: 0, pf: 0.8, qty: 1 });

  const [config, setConfig] = useState({
    upsType: 'Line Interactive',
    backupMinutes: 30,
    batteryType: 'AGM Deep Cycle',
    safetyMargin: 30, // %
    batteryVoltage: 12,
    batteriesInSeries: 2, // 24V system
  });

  const addPresetLoad = (load: typeof COMMON_LOADS[0]) => {
    const existing = selectedLoads.find(l => l.name === load.name);
    if (existing) {
      setSelectedLoads(selectedLoads.map(l =>
        l.name === load.name ? {...l, qty: l.qty + 1} : l
      ));
    } else {
      setSelectedLoads([...selectedLoads, { ...load, qty: 1 }]);
    }
  };

  const addCustomLoad = () => {
    if (customLoad.name && customLoad.watts > 0) {
      setSelectedLoads([...selectedLoads, { ...customLoad, critical: true }]);
      setCustomLoad({ name: '', watts: 0, pf: 0.8, qty: 1 });
    }
  };

  const removeLoad = (name: string) => {
    setSelectedLoads(selectedLoads.filter(l => l.name !== name));
  };

  const updateQty = (name: string, qty: number) => {
    setSelectedLoads(selectedLoads.map(l =>
      l.name === name ? {...l, qty: Math.max(0, qty)} : l
    ));
  };

  const results = useMemo(() => {
    // Calculate total load
    const totalWatts = selectedLoads.reduce((sum, l) => sum + (l.watts * l.qty), 0);
    const criticalWatts = selectedLoads.filter(l => l.critical).reduce((sum, l) => sum + (l.watts * l.qty), 0);

    // Calculate weighted power factor
    const weightedPF = selectedLoads.reduce((sum, l) => sum + (l.watts * l.qty * l.pf), 0) / totalWatts || 0.8;

    // Calculate VA
    const totalVA = totalWatts / weightedPF;

    // Add safety margin
    const designVA = totalVA * (1 + config.safetyMargin / 100);
    const designWatts = totalWatts * (1 + config.safetyMargin / 100);

    // Select UPS size
    const upsTypeData = UPS_TYPES.find(u => u.type === config.upsType) || UPS_TYPES[1];
    const selectedUPS = STANDARD_UPS_SIZES.find(u => u.va >= designVA) || STANDARD_UPS_SIZES[STANDARD_UPS_SIZES.length - 1];

    // Battery calculations
    const batteryData = BATTERY_TYPES.find(b => b.type === config.batteryType) || BATTERY_TYPES[1];
    const systemVoltage = config.batteryVoltage * config.batteriesInSeries;

    // Calculate battery capacity needed
    // Ah = (Watts × Hours) / (Voltage × Efficiency × DOD)
    const backupHours = config.backupMinutes / 60;
    const dod = config.batteryType.includes('Lithium') ? 0.8 : 0.5; // Depth of discharge
    const batteryAh = (designWatts * backupHours) / (systemVoltage * upsTypeData.efficiency * dod);

    // Calculate number of batteries
    const standardAh = batteryData.capacity;
    const parallelStrings = Math.ceil(batteryAh / standardAh);
    const totalBatteries = parallelStrings * config.batteriesInSeries;

    // Calculate actual runtime
    const actualRuntime = (standardAh * parallelStrings * systemVoltage * upsTypeData.efficiency * dod) / designWatts * 60;

    // Cost calculations
    const upsCost = selectedUPS.price * upsTypeData.priceMultiplier;
    const batteryCostPerUnit = standardAh * batteryData.pricePerAh;
    const totalBatteryCost = batteryCostPerUnit * totalBatteries;
    const installationCost = (upsCost + totalBatteryCost) * 0.1;

    // Operating costs
    const dailyKwh = (designWatts / 1000) * 8; // 8 hours active use
    const monthlyElectricity = dailyKwh * 30 * 25; // KES 25/kWh
    const annualBatteryReplacement = totalBatteryCost / batteryData.lifeYears;

    return {
      totalWatts,
      criticalWatts,
      weightedPF,
      totalVA,
      designVA,
      designWatts,
      selectedUPS,
      upsTypeData,
      batteryData,
      systemVoltage,
      batteryAh,
      parallelStrings,
      totalBatteries,
      actualRuntime,
      upsCost,
      batteryCostPerUnit,
      totalBatteryCost,
      installationCost,
      totalCost: upsCost + totalBatteryCost + installationCost,
      monthlyElectricity,
      annualBatteryReplacement,
      loadUtilization: (designVA / selectedUPS.va) * 100,
    };
  }, [selectedLoads, config]);

  return (
    <div className="bg-gray-900 rounded-xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 p-4 border-b border-purple-500/30">
        <h3 className="text-xl font-bold text-purple-400 flex items-center gap-2">
          <span>🔋</span> World-Class UPS Sizing Calculator with Chart.js
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete backup power system design • Pressure gauges • Runtime analysis • Engineering-grade calculations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'loads', label: '💻 Loads' },
          { id: 'battery', label: '🔋 Battery' },
          { id: 'sizing', label: '⚡ Results & Charts' },
          { id: 'cost', label: '💰 Costs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-500/20 text-purple-400 border-b-2 border-purple-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'loads' && (
            <motion.div
              key="loads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Quick Add */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-3">Quick Add Common Loads</h4>
                <div className="flex flex-wrap gap-2">
                  {COMMON_LOADS.slice(0, 8).map(load => (
                    <button
                      key={load.name}
                      onClick={() => addPresetLoad(load)}
                      className="px-3 py-1 bg-gray-700 hover:bg-purple-600 text-gray-300 hover:text-white text-xs rounded transition-colors"
                    >
                      + {load.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Loads */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-3">Connected Loads</h4>
                {selectedLoads.length === 0 ? (
                  <p className="text-gray-500 text-sm">No loads added yet</p>
                ) : (
                  <div className="space-y-2">
                    {selectedLoads.map(load => (
                      <div key={load.name} className="flex items-center gap-3 bg-gray-900/50 p-2 rounded">
                        <span className={`text-xs px-2 py-0.5 rounded ${load.critical ? 'bg-red-900/50 text-red-400' : 'bg-gray-700 text-gray-400'}`}>
                          {load.critical ? 'CRITICAL' : 'NORMAL'}
                        </span>
                        <span className="flex-1 text-white text-sm">{load.name}</span>
                        <span className="text-gray-400 text-xs">{load.watts}W</span>
                        <input
                          type="number"
                          value={load.qty}
                          onChange={(e) => updateQty(load.name, parseInt(e.target.value))}
                          className="w-16 bg-black border border-gray-600 rounded px-2 py-1 text-white text-center text-sm"
                        />
                        <button
                          onClick={() => removeLoad(load.name)}
                          className="text-red-500 hover:text-red-400"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Load */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-3">Add Custom Load</h4>
                <div className="flex gap-2">
                  <input
                    placeholder="Equipment name"
                    value={customLoad.name}
                    onChange={(e) => setCustomLoad({...customLoad, name: e.target.value})}
                    className="flex-1 bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Watts"
                    value={customLoad.watts || ''}
                    onChange={(e) => setCustomLoad({...customLoad, watts: parseInt(e.target.value)})}
                    className="w-24 bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  />
                  <button
                    onClick={addCustomLoad}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-500/30">
                  <div className="text-2xl font-bold text-purple-400">{results.totalWatts.toLocaleString()}W</div>
                  <div className="text-xs text-gray-400">Total Load</div>
                </div>
                <div className="bg-red-900/30 rounded-lg p-4 text-center border border-red-500/30">
                  <div className="text-2xl font-bold text-red-400">{results.criticalWatts.toLocaleString()}W</div>
                  <div className="text-xs text-gray-400">Critical Load</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">{results.totalVA.toFixed(0)} VA</div>
                  <div className="text-xs text-gray-400">Apparent Power</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'battery' && (
            <motion.div
              key="battery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">UPS Type</label>
                  <select
                    value={config.upsType}
                    onChange={(e) => setConfig({...config, upsType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {UPS_TYPES.map(u => (
                      <option key={u.type} value={u.type}>{u.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Required Backup Time</label>
                  <select
                    value={config.backupMinutes}
                    onChange={(e) => setConfig({...config, backupMinutes: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[5, 10, 15, 20, 30, 45, 60, 90, 120, 180, 240].map(m => (
                      <option key={m} value={m}>{m} minutes ({(m/60).toFixed(1)}h)</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Battery Type</label>
                  <select
                    value={config.batteryType}
                    onChange={(e) => setConfig({...config, batteryType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {BATTERY_TYPES.map(b => (
                      <option key={b.type} value={b.type}>{b.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">System Voltage</label>
                  <select
                    value={config.batteriesInSeries}
                    onChange={(e) => setConfig({...config, batteriesInSeries: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={1}>12V (1 battery series)</option>
                    <option value={2}>24V (2 batteries series)</option>
                    <option value={4}>48V (4 batteries series)</option>
                    <option value={8}>96V (8 batteries series)</option>
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-green-400 mb-4">🔋 BATTERY SIZING RESULTS</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-400">{results.batteryAh.toFixed(0)} Ah</div>
                    <div className="text-xs text-gray-400">Required Capacity</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-yellow-400">{results.totalBatteries}</div>
                    <div className="text-xs text-gray-400">Total Batteries Needed</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-cyan-400">{results.systemVoltage}V</div>
                    <div className="text-xs text-gray-400">System Voltage</div>
                  </div>
                  <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400">{results.actualRuntime.toFixed(0)} min</div>
                    <div className="text-xs text-gray-400">Actual Runtime</div>
                  </div>
                </div>
              </div>

              <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                <p className="text-sm text-gray-300">
                  <strong className="text-purple-400">Configuration:</strong> {results.parallelStrings} parallel string(s) × {config.batteriesInSeries} batteries in series = {results.totalBatteries} × {results.batteryData.capacity}Ah {config.batteryType} batteries
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'sizing' && (
            <motion.div
              key="sizing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* CIRCULAR PRESSURE GAUGES */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <CircularGauge
                  label="Load Utilization"
                  value={results.loadUtilization}
                  max={100}
                  unit="%"
                  color="from-purple-500 to-pink-600"
                />
                <CircularGauge
                  label="UPS Efficiency"
                  value={results.upsTypeData.efficiency * 100}
                  max={100}
                  unit="%"
                  color="from-green-500 to-emerald-600"
                />
                <CircularGauge
                  label="Power Factor"
                  value={results.weightedPF * 100}
                  max={100}
                  unit="%"
                  color="from-cyan-500 to-blue-600"
                />
                <CircularGauge
                  label="Battery Runtime"
                  value={results.actualRuntime}
                  max={config.backupMinutes * 1.5}
                  unit="min"
                  color="from-orange-500 to-red-600"
                />
              </div>

              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-purple-500/30">
                <h4 className="text-lg font-bold text-purple-400 mb-2">✅ RECOMMENDED UPS</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {results.selectedUPS.va.toLocaleString()} VA / {results.selectedUPS.watts.toLocaleString()} W
                </div>
                <p className="text-gray-400">{config.upsType}</p>
              </div>

              {/* CHART.JS VISUALIZATIONS */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Load Distribution Doughnut */}
                <ChartCard title="Load Distribution" icon="⚡">
                  <Doughnut
                    data={{
                      labels: ['Critical Load', 'Non-Critical Load', 'Reserve Capacity'],
                      datasets: [{
                        data: [
                          results.criticalWatts,
                          results.totalWatts - results.criticalWatts,
                          results.selectedUPS.watts - results.totalWatts
                        ],
                        backgroundColor: [
                          'rgba(239, 68, 68, 0.8)',
                          'rgba(251, 191, 36, 0.8)',
                          'rgba(34, 197, 94, 0.8)'
                        ],
                        borderColor: [
                          'rgb(239, 68, 68)',
                          'rgb(251, 191, 36)',
                          'rgb(34, 197, 94)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: '#ffffff', padding: 10, font: { size: 11 } }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Battery Discharge Curve Line Chart */}
                <ChartCard title="Battery Discharge Curve" icon="🔋">
                  <Line
                    data={{
                      labels: Array.from({ length: 11 }, (_, i) => `${i * 10}%`),
                      datasets: [{
                        label: 'Battery Voltage (V)',
                        data: Array.from({ length: 11 }, (_, i) => {
                          const soc = 100 - (i * 10);
                          return results.systemVoltage * (0.85 + (soc / 100) * 0.15);
                        }),
                        borderColor: 'rgb(168, 85, 247)',
                        backgroundColor: 'rgba(168, 85, 247, 0.1)',
                        fill: true,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' },
                          title: { display: true, text: 'State of Charge', color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* Runtime vs Load Bar Chart */}
                <ChartCard title="Runtime vs Different Loads" icon="⏱️">
                  <Bar
                    data={{
                      labels: ['25% Load', '50% Load', '75% Load', '100% Load'],
                      datasets: [{
                        label: 'Runtime (minutes)',
                        data: [
                          results.actualRuntime * 4,
                          results.actualRuntime * 2,
                          results.actualRuntime * 1.33,
                          results.actualRuntime
                        ],
                        backgroundColor: 'rgba(59, 130, 246, 0.8)',
                        borderColor: 'rgb(59, 130, 246)',
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>

                {/* UPS Performance Radar */}
                <ChartCard title="UPS Performance Metrics" icon="📊">
                  <Radar
                    data={{
                      labels: ['Efficiency', 'Protection', 'Transfer Speed', 'Load Support', 'Battery Life'],
                      datasets: [{
                        label: 'Performance',
                        data: [
                          results.upsTypeData.efficiency * 100,
                          results.upsTypeData.protection === 'Maximum' ? 100 :
                          results.upsTypeData.protection === 'Industrial' ? 95 :
                          results.upsTypeData.protection === 'Medium' ? 70 : 50,
                          100 - (results.upsTypeData.switchTime * 5),
                          Math.min((results.selectedUPS.watts / results.totalWatts) * 50, 100),
                          (results.batteryData.lifeYears / 10) * 100
                        ],
                        backgroundColor: 'rgba(168, 85, 247, 0.2)',
                        borderColor: 'rgb(168, 85, 247)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgb(168, 85, 247)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(168, 85, 247)'
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        r: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af', backdropColor: 'transparent' },
                          pointLabels: { color: '#ffffff', font: { size: 10 } }
                        }
                      }
                    }}
                  />
                </ChartCard>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">{results.designVA.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Required VA</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">{results.loadUtilization.toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Load Utilization</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">{results.upsTypeData.switchTime}ms</div>
                  <div className="text-xs text-gray-400">Transfer Time</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400">{(results.upsTypeData.efficiency * 100).toFixed(0)}%</div>
                  <div className="text-xs text-gray-400">Efficiency</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cost' && (
            <motion.div
              key="cost"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 CAPITAL COSTS</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">UPS Unit ({results.selectedUPS.va.toLocaleString()} VA {config.upsType})</span>
                    <span className="text-white">KES {results.upsCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Batteries ({results.totalBatteries} × {results.batteryData.capacity}Ah {config.batteryType})</span>
                    <span className="text-white">KES {results.totalBatteryCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Installation & Cabling</span>
                    <span className="text-white">KES {results.installationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL INVESTMENT</span>
                    <span className="text-green-400">KES {results.totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* CHART.JS Cost Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <ChartCard title="Cost Breakdown" icon="💰">
                  <Doughnut
                    data={{
                      labels: ['UPS Unit', 'Batteries', 'Installation'],
                      datasets: [{
                        data: [
                          results.upsCost,
                          results.totalBatteryCost,
                          results.installationCost
                        ],
                        backgroundColor: [
                          'rgba(168, 85, 247, 0.8)',
                          'rgba(59, 130, 246, 0.8)',
                          'rgba(34, 197, 94, 0.8)'
                        ],
                        borderColor: [
                          'rgb(168, 85, 247)',
                          'rgb(59, 130, 246)',
                          'rgb(34, 197, 94)'
                        ],
                        borderWidth: 2
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom',
                          labels: { color: '#ffffff', padding: 10, font: { size: 11 } }
                        }
                      }
                    }}
                  />
                </ChartCard>

                <ChartCard title="10-Year Lifecycle Cost" icon="📈">
                  <Line
                    data={{
                      labels: Array.from({ length: 11 }, (_, i) => `Y${i}`),
                      datasets: [{
                        label: 'Cumulative Cost (KES)',
                        data: Array.from({ length: 11 }, (_, year) => {
                          const batteryCycles = Math.floor(year / results.batteryData.lifeYears);
                          return results.totalCost + (batteryCycles * results.totalBatteryCost) +
                                 (results.monthlyElectricity * 12 * year);
                        }),
                        borderColor: 'rgb(239, 68, 68)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        fill: true,
                        tension: 0.4
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { labels: { color: '#ffffff' } }
                      },
                      scales: {
                        y: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: {
                            color: '#9ca3af',
                            callback: (value) => `${(Number(value) / 1000).toFixed(0)}K`
                          }
                        },
                        x: {
                          grid: { color: 'rgba(255,255,255,0.1)' },
                          ticks: { color: '#9ca3af' }
                        }
                      }
                    }}
                  />
                </ChartCard>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="text-sm font-bold text-yellow-400 mb-2">📊 OPERATING COSTS</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly Electricity:</span>
                      <span className="text-white">KES {results.monthlyElectricity.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Annual Battery Reserve:</span>
                      <span className="text-white">KES {results.annualBatteryReplacement.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
                  <h4 className="text-sm font-bold text-purple-400 mb-2">🔄 BATTERY LIFECYCLE</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Battery Life:</span>
                      <span className="text-white">{results.batteryData.lifeYears} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Replacement Cost:</span>
                      <span className="text-white">KES {results.totalBatteryCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {results.selectedUPS.va.toLocaleString()} VA | {results.actualRuntime.toFixed(0)} min runtime | {results.totalBatteries} batteries
        </div>
        <a
          href={`https://wa.me/254768860665?text=I%20need%20a%20quote%20for%20a%20${results.selectedUPS.va}VA%20UPS%20system`}
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}

// =====================================================
// CIRCULAR GAUGE COMPONENT (SVG-BASED PRESSURE METER)
// =====================================================
function CircularGauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const circumference = 2 * Math.PI * 85;
  const offset = circumference * (1 - percentage / 100);

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
      <div className="relative w-full aspect-square">
        <svg viewBox="0 0 200 200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r="85"
            fill="none"
            stroke="url(#gradient-ups)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-500"
          />
          <defs>
            <linearGradient id="gradient-ups" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-3xl font-bold text-white">
            {value.toFixed(1)}{unit}
          </span>
          <span className="text-xs text-gray-400 mt-1">{label}</span>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// CHART CARD WRAPPER COMPONENT
// =====================================================
function ChartCard({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-4 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>
      <div className="h-64">
        {children}
      </div>
    </div>
  );
}
