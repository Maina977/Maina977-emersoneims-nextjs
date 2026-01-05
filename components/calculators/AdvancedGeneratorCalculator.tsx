'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// TYPES & INTERFACES
// =====================================================
interface Appliance {
  id: string;
  name: string;
  quantity: number;
  watts: number;
  startingMultiplier: number;
  hoursPerDay: number;
  priority: 'critical' | 'essential' | 'non-essential';
  type: 'resistive' | 'inductive' | 'capacitive';
}

interface CalculationResults {
  totalRunningLoad: number;
  totalStartingLoad: number;
  apparentPower: number;
  recommendedSize: number;
  optimalSize: number;
  fuelConsumption: {
    perHour: number;
    perDay: number;
    perWeek: number;
    perMonth: number;
  };
  operatingCost: {
    perHour: number;
    perDay: number;
    perMonth: number;
  };
  deratedCapacity: number;
  efficiency: number;
  criticalLoad: number;
  essentialLoad: number;
  nonEssentialLoad: number;
}

// =====================================================
// PRESET APPLIANCES DATABASE
// =====================================================
const PRESET_APPLIANCES = [
  // Residential
  { name: 'LED Lights (10W each)', watts: 10, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Ceiling Fan', watts: 75, startingMultiplier: 3, type: 'inductive' as const },
  { name: 'Refrigerator', watts: 150, startingMultiplier: 5, type: 'inductive' as const },
  { name: 'Air Conditioner (1.5 Ton)', watts: 1800, startingMultiplier: 4, type: 'inductive' as const },
  { name: 'Air Conditioner (2 Ton)', watts: 2400, startingMultiplier: 4, type: 'inductive' as const },
  { name: 'Water Heater', watts: 2000, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Washing Machine', watts: 500, startingMultiplier: 3, type: 'inductive' as const },
  { name: 'Microwave Oven', watts: 1200, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Electric Kettle', watts: 1500, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Television (LED 55")', watts: 120, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Computer/Desktop', watts: 300, startingMultiplier: 1.5, type: 'resistive' as const },
  { name: 'Laptop', watts: 65, startingMultiplier: 1, type: 'resistive' as const },
  // Commercial/Industrial
  { name: 'Elevator Motor (10HP)', watts: 7500, startingMultiplier: 6, type: 'inductive' as const },
  { name: 'Water Pump (1HP)', watts: 750, startingMultiplier: 5, type: 'inductive' as const },
  { name: 'Water Pump (3HP)', watts: 2250, startingMultiplier: 5, type: 'inductive' as const },
  { name: 'Compressor (5HP)', watts: 3750, startingMultiplier: 6, type: 'inductive' as const },
  { name: 'Welding Machine', watts: 5000, startingMultiplier: 3, type: 'resistive' as const },
  { name: 'CNC Machine', watts: 15000, startingMultiplier: 4, type: 'inductive' as const },
  // Medical
  { name: 'ICU Ventilator', watts: 400, startingMultiplier: 2, type: 'resistive' as const },
  { name: 'X-Ray Machine', watts: 5000, startingMultiplier: 3, type: 'resistive' as const },
  { name: 'MRI Machine', watts: 50000, startingMultiplier: 4, type: 'inductive' as const },
  { name: 'Operating Theater Lights', watts: 1000, startingMultiplier: 1, type: 'resistive' as const },
  { name: 'Medical Refrigerator', watts: 300, startingMultiplier: 4, type: 'inductive' as const },
];

// =====================================================
// FUEL CONSUMPTION RATES (Liters per kWh at load %)
// =====================================================
const FUEL_CONSUMPTION = {
  diesel: { 25: 0.30, 50: 0.26, 75: 0.24, 100: 0.28 },
  petrol: { 25: 0.45, 50: 0.38, 75: 0.35, 100: 0.40 },
  naturalGas: { 25: 0.35, 50: 0.30, 75: 0.28, 100: 0.32 },
  lpg: { 25: 0.38, 50: 0.32, 75: 0.30, 100: 0.34 },
};

// =====================================================
// FUEL PRICES (KES per Liter/m³)
// =====================================================
const FUEL_PRICES = {
  diesel: 180,
  petrol: 195,
  naturalGas: 85,
  lpg: 120,
};

// =====================================================
// DERATING FACTORS
// =====================================================
const ALTITUDE_DERATING = [
  { altitude: 0, factor: 1.00 },
  { altitude: 500, factor: 0.97 },
  { altitude: 1000, factor: 0.94 },
  { altitude: 1500, factor: 0.91 },
  { altitude: 2000, factor: 0.88 },
  { altitude: 2500, factor: 0.85 },
  { altitude: 3000, factor: 0.82 },
];

const TEMPERATURE_DERATING = [
  { temp: 25, factor: 1.00 },
  { temp: 30, factor: 0.98 },
  { temp: 35, factor: 0.96 },
  { temp: 40, factor: 0.94 },
  { temp: 45, factor: 0.91 },
  { temp: 50, factor: 0.88 },
];

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function AdvancedGeneratorCalculator() {
  // State
  const [activeTab, setActiveTab] = useState<'loads' | 'settings' | 'results' | 'comparison'>('loads');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    watts: '',
    quantity: '1',
    startingMultiplier: '3',
    hoursPerDay: '8',
    priority: 'essential' as 'critical' | 'essential' | 'non-essential',
    type: 'inductive' as 'resistive' | 'inductive' | 'capacitive',
  });
  
  // Settings
  const [settings, setSettings] = useState({
    phase: 'three' as 'single' | 'three',
    voltage: 400,
    frequency: 50 as 50 | 60,
    powerFactor: 0.8,
    safetyMargin: 25,
    altitude: 1500,
    ambientTemp: 30,
    fuelType: 'diesel' as keyof typeof FUEL_CONSUMPTION,
    loadPercentage: 75,
    efficiency: 92,
    runHoursPerDay: 8,
  });

  // Add appliance from preset
  const addPresetAppliance = (preset: typeof PRESET_APPLIANCES[0]) => {
    const newAppliance: Appliance = {
      id: `${Date.now()}-${Math.random()}`,
      name: preset.name,
      quantity: 1,
      watts: preset.watts,
      startingMultiplier: preset.startingMultiplier,
      hoursPerDay: 8,
      priority: 'essential',
      type: preset.type,
    };
    setAppliances([...appliances, newAppliance]);
  };

  // Add custom appliance
  const addCustomAppliance = () => {
    if (!customAppliance.name || !customAppliance.watts) return;
    
    const newAppliance: Appliance = {
      id: `${Date.now()}-${Math.random()}`,
      name: customAppliance.name,
      quantity: parseInt(customAppliance.quantity) || 1,
      watts: parseFloat(customAppliance.watts) || 0,
      startingMultiplier: parseFloat(customAppliance.startingMultiplier) || 1,
      hoursPerDay: parseFloat(customAppliance.hoursPerDay) || 8,
      priority: customAppliance.priority,
      type: customAppliance.type,
    };
    setAppliances([...appliances, newAppliance]);
    setCustomAppliance({
      name: '',
      watts: '',
      quantity: '1',
      startingMultiplier: '3',
      hoursPerDay: '8',
      priority: 'essential',
      type: 'inductive',
    });
  };

  // Update appliance
  const updateAppliance = (id: string, field: keyof Appliance, value: number | string) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  // Remove appliance
  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  // Calculate results
  const results = useMemo((): CalculationResults | null => {
    if (appliances.length === 0) return null;

    // Calculate loads by priority
    const criticalLoad = appliances
      .filter(a => a.priority === 'critical')
      .reduce((sum, a) => sum + (a.watts * a.quantity), 0);
    const essentialLoad = appliances
      .filter(a => a.priority === 'essential')
      .reduce((sum, a) => sum + (a.watts * a.quantity), 0);
    const nonEssentialLoad = appliances
      .filter(a => a.priority === 'non-essential')
      .reduce((sum, a) => sum + (a.watts * a.quantity), 0);

    // Total running load (kW)
    const totalRunningLoad = appliances.reduce((sum, a) => 
      sum + (a.watts * a.quantity), 0) / 1000;

    // Total starting load (accounts for motor inrush currents)
    const maxStartingLoad = Math.max(...appliances.map(a => 
      a.watts * a.quantity * a.startingMultiplier
    )) / 1000;
    const totalStartingLoad = totalRunningLoad + maxStartingLoad - 
      (Math.max(...appliances.map(a => a.watts * a.quantity)) / 1000);

    // Apparent power (kVA)
    const apparentPower = totalRunningLoad / settings.powerFactor;

    // Apply derating factors
    const altitudeFactor = ALTITUDE_DERATING.find(a => a.altitude >= settings.altitude)?.factor || 0.82;
    const tempFactor = TEMPERATURE_DERATING.find(t => t.temp >= settings.ambientTemp)?.factor || 0.88;
    const totalDerating = altitudeFactor * tempFactor;

    // Safety margin
    const safetyMultiplier = 1 + (settings.safetyMargin / 100);

    // Recommended size (minimum)
    const recommendedSize = Math.ceil((totalStartingLoad * safetyMultiplier) / (settings.powerFactor * totalDerating));
    
    // Optimal size (with headroom for future expansion)
    const optimalSize = Math.ceil(recommendedSize * 1.2 / 10) * 10; // Round to nearest 10kVA

    // Derated capacity
    const deratedCapacity = optimalSize * totalDerating;

    // Fuel consumption
    const fuelRate = FUEL_CONSUMPTION[settings.fuelType][settings.loadPercentage as keyof typeof FUEL_CONSUMPTION.diesel];
    const hourlyConsumption = totalRunningLoad * fuelRate;
    
    const fuelConsumption = {
      perHour: hourlyConsumption,
      perDay: hourlyConsumption * settings.runHoursPerDay,
      perWeek: hourlyConsumption * settings.runHoursPerDay * 7,
      perMonth: hourlyConsumption * settings.runHoursPerDay * 30,
    };

    // Operating cost
    const fuelPrice = FUEL_PRICES[settings.fuelType];
    const operatingCost = {
      perHour: fuelConsumption.perHour * fuelPrice,
      perDay: fuelConsumption.perDay * fuelPrice,
      perMonth: fuelConsumption.perMonth * fuelPrice,
    };

    return {
      totalRunningLoad,
      totalStartingLoad,
      apparentPower,
      recommendedSize,
      optimalSize,
      fuelConsumption,
      operatingCost,
      deratedCapacity,
      efficiency: settings.efficiency,
      criticalLoad: criticalLoad / 1000,
      essentialLoad: essentialLoad / 1000,
      nonEssentialLoad: nonEssentialLoad / 1000,
    };
  }, [appliances, settings]);

  return (
    <div className="bg-gray-900 rounded-xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-4 border-b border-cyan-500/30">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <span>⚡</span> Advanced Generator Sizing Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Professional load analysis with derating, fuel consumption & cost estimation
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'loads', label: '📋 Load Entry', count: appliances.length },
          { id: 'settings', label: '⚙️ Settings' },
          { id: 'results', label: '📊 Results' },
          { id: 'comparison', label: '💰 Cost Analysis' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 bg-cyan-500/30 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {/* LOADS TAB */}
          {activeTab === 'loads' && (
            <motion.div
              key="loads"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Preset Appliances */}
              <div>
                <h4 className="text-sm font-bold text-cyan-400 mb-3">QUICK ADD - COMMON APPLIANCES</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {PRESET_APPLIANCES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => addPresetAppliance(preset)}
                      className="p-2 text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs transition-colors"
                    >
                      <div className="text-white font-medium truncate">{preset.name}</div>
                      <div className="text-gray-400">{preset.watts}W</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Appliance Form */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-cyan-400 mb-3">ADD CUSTOM APPLIANCE</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Name</label>
                    <input
                      type="text"
                      value={customAppliance.name}
                      onChange={(e) => setCustomAppliance({...customAppliance, name: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="e.g., Server"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Watts (W)</label>
                    <input
                      type="number"
                      value={customAppliance.watts}
                      onChange={(e) => setCustomAppliance({...customAppliance, watts: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Quantity</label>
                    <input
                      type="number"
                      value={customAppliance.quantity}
                      onChange={(e) => setCustomAppliance({...customAppliance, quantity: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      min="1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Starting Multiplier</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customAppliance.startingMultiplier}
                      onChange={(e) => setCustomAppliance({...customAppliance, startingMultiplier: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="3"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Hours/Day</label>
                    <input
                      type="number"
                      value={customAppliance.hoursPerDay}
                      onChange={(e) => setCustomAppliance({...customAppliance, hoursPerDay: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Priority</label>
                    <select
                      value={customAppliance.priority}
                      onChange={(e) => setCustomAppliance({...customAppliance, priority: e.target.value as 'critical' | 'essential' | 'non-essential'})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="critical">Critical</option>
                      <option value="essential">Essential</option>
                      <option value="non-essential">Non-Essential</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Load Type</label>
                    <select
                      value={customAppliance.type}
                      onChange={(e) => setCustomAppliance({...customAppliance, type: e.target.value as 'resistive' | 'inductive' | 'capacitive'})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    >
                      <option value="resistive">Resistive (Heaters)</option>
                      <option value="inductive">Inductive (Motors)</option>
                      <option value="capacitive">Capacitive</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={addCustomAppliance}
                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded font-bold transition-colors"
                >
                  + Add Appliance
                </button>
              </div>

              {/* Appliances List */}
              {appliances.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-cyan-400 mb-3">CONNECTED LOADS ({appliances.length})</h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {appliances.map((app) => (
                      <div 
                        key={app.id}
                        className={`flex items-center gap-3 p-3 rounded border ${
                          app.priority === 'critical' ? 'bg-red-900/20 border-red-500/30' :
                          app.priority === 'essential' ? 'bg-yellow-900/20 border-yellow-500/30' :
                          'bg-gray-800 border-gray-700'
                        }`}
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{app.name}</div>
                          <div className="text-gray-400 text-xs">
                            {app.watts}W × {app.quantity} = {(app.watts * app.quantity / 1000).toFixed(2)}kW
                            <span className="mx-2">|</span>
                            Starting: {(app.watts * app.quantity * app.startingMultiplier / 1000).toFixed(2)}kW
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={app.quantity}
                            onChange={(e) => updateAppliance(app.id, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16 bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
                            min="1"
                          />
                          <select
                            value={app.priority}
                            onChange={(e) => updateAppliance(app.id, 'priority', e.target.value)}
                            className="bg-black border border-gray-600 rounded px-2 py-1 text-white text-xs"
                          >
                            <option value="critical">Critical</option>
                            <option value="essential">Essential</option>
                            <option value="non-essential">Non-Essential</option>
                          </select>
                          <button
                            onClick={() => removeAppliance(app.id)}
                            className="text-red-400 hover:text-red-300 p-1"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SETTINGS TAB */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Phase & Voltage */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Phase Configuration</label>
                  <select
                    value={settings.phase}
                    onChange={(e) => setSettings({...settings, phase: e.target.value as 'single' | 'three'})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="single">Single Phase</option>
                    <option value="three">Three Phase</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Voltage (V)</label>
                  <select
                    value={settings.voltage}
                    onChange={(e) => setSettings({...settings, voltage: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {settings.phase === 'single' 
                      ? [120, 220, 230, 240].map(v => <option key={v} value={v}>{v}V</option>)
                      : [380, 400, 415, 480].map(v => <option key={v} value={v}>{v}V</option>)
                    }
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Frequency</label>
                  <select
                    value={settings.frequency}
                    onChange={(e) => setSettings({...settings, frequency: parseInt(e.target.value) as 50 | 60})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={50}>50 Hz (Africa/Europe/Asia)</option>
                    <option value={60}>60 Hz (Americas)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Power Factor</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="1"
                    value={settings.powerFactor}
                    onChange={(e) => setSettings({...settings, powerFactor: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Derating Factors */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">⚠️ DERATING FACTORS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Altitude (m)</label>
                    <input
                      type="number"
                      value={settings.altitude}
                      onChange={(e) => setSettings({...settings, altitude: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                    <div className="text-xs text-yellow-500 mt-1">
                      Derating: {(100 - (ALTITUDE_DERATING.find(a => a.altitude >= settings.altitude)?.factor || 0.82) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Ambient Temp (°C)</label>
                    <input
                      type="number"
                      value={settings.ambientTemp}
                      onChange={(e) => setSettings({...settings, ambientTemp: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                    <div className="text-xs text-yellow-500 mt-1">
                      Derating: {(100 - (TEMPERATURE_DERATING.find(t => t.temp >= settings.ambientTemp)?.factor || 0.88) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Safety Margin (%)</label>
                    <input
                      type="number"
                      min="10"
                      max="50"
                      value={settings.safetyMargin}
                      onChange={(e) => setSettings({...settings, safetyMargin: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Efficiency (%)</label>
                    <input
                      type="number"
                      min="80"
                      max="98"
                      value={settings.efficiency}
                      onChange={(e) => setSettings({...settings, efficiency: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Fuel & Operation */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-green-400 mb-3">⛽ FUEL & OPERATION</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Fuel Type</label>
                    <select
                      value={settings.fuelType}
                      onChange={(e) => setSettings({...settings, fuelType: e.target.value as keyof typeof FUEL_CONSUMPTION})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="diesel">Diesel (KES {FUEL_PRICES.diesel}/L)</option>
                      <option value="petrol">Petrol (KES {FUEL_PRICES.petrol}/L)</option>
                      <option value="naturalGas">Natural Gas (KES {FUEL_PRICES.naturalGas}/m³)</option>
                      <option value="lpg">LPG (KES {FUEL_PRICES.lpg}/L)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Load Percentage (%)</label>
                    <select
                      value={settings.loadPercentage}
                      onChange={(e) => setSettings({...settings, loadPercentage: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value={25}>25% Load</option>
                      <option value={50}>50% Load</option>
                      <option value={75}>75% Load (Optimal)</option>
                      <option value={100}>100% Load</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Run Hours/Day</label>
                    <input
                      type="number"
                      min="1"
                      max="24"
                      value={settings.runHoursPerDay}
                      onChange={(e) => setSettings({...settings, runHoursPerDay: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* RESULTS TAB */}
          {activeTab === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {results ? (
                <>
                  {/* Main Sizing Results */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-lg p-4 border border-cyan-500/30 text-center">
                      <div className="text-3xl font-bold text-cyan-400">{results.totalRunningLoad.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Total Running Load (kW)</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-4 border border-orange-500/30 text-center">
                      <div className="text-3xl font-bold text-orange-400">{results.totalStartingLoad.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Peak Starting Load (kW)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-3xl font-bold text-green-400">{results.recommendedSize}</div>
                      <div className="text-xs text-gray-400">Minimum Size (kVA)</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30 text-center">
                      <div className="text-3xl font-bold text-purple-400">{results.optimalSize}</div>
                      <div className="text-xs text-gray-400">Optimal Size (kVA)</div>
                    </div>
                  </div>

                  {/* Load Breakdown by Priority */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-cyan-400 mb-3">LOAD BREAKDOWN BY PRIORITY</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-red-400 flex items-center gap-2">🔴 Critical Loads</span>
                        <span className="text-white font-mono">{results.criticalLoad.toFixed(2)} kW</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: `${(results.criticalLoad / results.totalRunningLoad) * 100}%`}} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-yellow-400 flex items-center gap-2">🟡 Essential Loads</span>
                        <span className="text-white font-mono">{results.essentialLoad.toFixed(2)} kW</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${(results.essentialLoad / results.totalRunningLoad) * 100}%`}} />
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-gray-400 flex items-center gap-2">⚪ Non-Essential Loads</span>
                        <span className="text-white font-mono">{results.nonEssentialLoad.toFixed(2)} kW</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{width: `${(results.nonEssentialLoad / results.totalRunningLoad) * 100}%`}} />
                      </div>
                    </div>
                  </div>

                  {/* Technical Details */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-cyan-400 mb-3">TECHNICAL SPECIFICATIONS</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Apparent Power (kVA)</span>
                        <span className="text-white font-mono">{results.apparentPower.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Derated Capacity (kVA)</span>
                        <span className="text-white font-mono">{results.deratedCapacity.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Power Factor</span>
                        <span className="text-white font-mono">{settings.powerFactor}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Efficiency</span>
                        <span className="text-white font-mono">{settings.efficiency}%</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Phase Configuration</span>
                        <span className="text-white font-mono">{settings.phase === 'three' ? '3-Phase' : '1-Phase'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-700 pb-2">
                        <span className="text-gray-400">Voltage / Frequency</span>
                        <span className="text-white font-mono">{settings.voltage}V / {settings.frequency}Hz</span>
                      </div>
                    </div>
                  </div>

                  {/* Generator Recommendation */}
                  <div className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 rounded-lg p-4 border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-400 mb-2">✅ RECOMMENDED GENERATOR</h4>
                    <div className="text-2xl font-bold text-white mb-2">
                      {results.optimalSize} kVA {settings.phase === 'three' ? 'Three-Phase' : 'Single-Phase'} Generator
                    </div>
                    <p className="text-gray-400 text-sm">
                      Based on your {results.totalRunningLoad.toFixed(1)} kW running load with {settings.safetyMargin}% safety margin,
                      altitude derating at {settings.altitude}m, and ambient temperature of {settings.ambientTemp}°C.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">📋</div>
                  <div className="text-lg">Add appliances in the &quot;Load Entry&quot; tab to see results</div>
                </div>
              )}
            </motion.div>
          )}

          {/* COST ANALYSIS TAB */}
          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {results ? (
                <>
                  {/* Fuel Consumption */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-yellow-400 mb-3">⛽ FUEL CONSUMPTION PROJECTION</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{results.fuelConsumption.perHour.toFixed(2)}</div>
                        <div className="text-xs text-gray-400">Liters/Hour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{results.fuelConsumption.perDay.toFixed(1)}</div>
                        <div className="text-xs text-gray-400">Liters/Day</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{results.fuelConsumption.perWeek.toFixed(0)}</div>
                        <div className="text-xs text-gray-400">Liters/Week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{results.fuelConsumption.perMonth.toFixed(0)}</div>
                        <div className="text-xs text-gray-400">Liters/Month</div>
                      </div>
                    </div>
                  </div>

                  {/* Operating Costs */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-green-400 mb-3">💰 OPERATING COST ESTIMATION ({settings.fuelType.toUpperCase()})</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-green-900/20 rounded-lg p-4 text-center border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400">KES {results.operatingCost.perHour.toFixed(0)}</div>
                        <div className="text-xs text-gray-400">Cost per Hour</div>
                      </div>
                      <div className="bg-green-900/20 rounded-lg p-4 text-center border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400">KES {results.operatingCost.perDay.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Cost per Day</div>
                      </div>
                      <div className="bg-green-900/20 rounded-lg p-4 text-center border border-green-500/30">
                        <div className="text-2xl font-bold text-green-400">KES {results.operatingCost.perMonth.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">Cost per Month</div>
                      </div>
                    </div>
                  </div>

                  {/* Fuel Type Comparison */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-cyan-400 mb-3">📊 FUEL TYPE COMPARISON (Monthly Cost at {settings.runHoursPerDay}h/day)</h4>
                    <div className="space-y-3">
                      {Object.entries(FUEL_CONSUMPTION).map(([fuelType, rates]) => {
                        const rate = rates[settings.loadPercentage as keyof typeof rates];
                        const monthlyConsumption = results.totalRunningLoad * rate * settings.runHoursPerDay * 30;
                        const monthlyCost = monthlyConsumption * FUEL_PRICES[fuelType as keyof typeof FUEL_PRICES];
                        const isSelected = fuelType === settings.fuelType;
                        
                        return (
                          <div 
                            key={fuelType}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isSelected ? 'bg-cyan-900/30 border border-cyan-500/30' : 'bg-gray-700/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">
                                {fuelType === 'diesel' ? '🛢️' : fuelType === 'petrol' ? '⛽' : fuelType === 'naturalGas' ? '🔥' : '💨'}
                              </span>
                              <div>
                                <div className="text-white font-medium capitalize">{fuelType.replace(/([A-Z])/g, ' $1')}</div>
                                <div className="text-xs text-gray-400">{monthlyConsumption.toFixed(0)} L/month @ KES {FUEL_PRICES[fuelType as keyof typeof FUEL_PRICES]}/L</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${isSelected ? 'text-cyan-400' : 'text-white'}`}>
                                KES {monthlyCost.toLocaleString()}
                              </div>
                              {isSelected && <span className="text-xs text-cyan-400">✓ Selected</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Compliance Note */}
                  <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
                    <h4 className="text-sm font-bold text-blue-400 mb-2">⚡ SAFETY & COMPLIANCE</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      <li>• Overload protection: Install breakers rated at 125% of generator capacity</li>
                      <li>• Earth leakage protection: 30mA ELCB/RCCB recommended for personnel safety</li>
                      <li>• Reference: IEC 60364, KEBS KS 1347, IEEE Std 446</li>
                      <li>• Synchronization: Required if connecting multiple generators (DSE/ComAp controllers)</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">💰</div>
                  <div className="text-lg">Add appliances to see cost analysis</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Summary Footer */}
      {results && (
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-gray-400">Total Load: <span className="text-cyan-400 font-bold">{results.totalRunningLoad.toFixed(1)} kW</span></span>
            <span className="text-gray-400">Recommended: <span className="text-green-400 font-bold">{results.optimalSize} kVA</span></span>
          </div>
          <a 
            href="https://wa.me/0768860665?text=I%20need%20a%20quote%20for%20a%20{results.optimalSize}kVA%20generator"
            target="_blank"
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
          >
            📱 Get Quote on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
