'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED UPS SIZING CALCULATOR
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
          <span>🔋</span> Advanced UPS Sizing Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete backup power system design with runtime & cost analysis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'loads', label: '💻 Loads' },
          { id: 'battery', label: '🔋 Battery' },
          { id: 'sizing', label: '⚡ UPS Size' },
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
              className="space-y-4"
            >
              <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-6 border border-purple-500/30">
                <h4 className="text-lg font-bold text-purple-400 mb-2">✅ RECOMMENDED UPS</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {results.selectedUPS.va.toLocaleString()} VA / {results.selectedUPS.watts.toLocaleString()} W
                </div>
                <p className="text-gray-400">{config.upsType}</p>
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

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">📋 UPS TYPE COMPARISON</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-left">
                        <th className="p-2">Type</th>
                        <th className="p-2">Transfer</th>
                        <th className="p-2">Efficiency</th>
                        <th className="p-2">Protection</th>
                      </tr>
                    </thead>
                    <tbody>
                      {UPS_TYPES.map(u => (
                        <tr 
                          key={u.type} 
                          className={`border-t border-gray-700 ${u.type === config.upsType ? 'bg-purple-900/30' : ''}`}
                        >
                          <td className="p-2 text-white">{u.type}</td>
                          <td className="p-2 text-gray-400">{u.switchTime}ms</td>
                          <td className="p-2 text-gray-400">{(u.efficiency * 100).toFixed(0)}%</td>
                          <td className="p-2 text-gray-400">{u.protection}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          href="https://wa.me/254768860655?text=I%20need%20UPS%20system"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}
