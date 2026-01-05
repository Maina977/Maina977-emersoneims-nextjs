'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// TYPES & INTERFACES
// =====================================================
interface Appliance {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
  daysPerWeek: number;
}

interface SolarResults {
  dailyEnergyRequired: number;
  monthlyEnergyRequired: number;
  panelWattage: number;
  panelsRequired: number;
  totalPanelCapacity: number;
  batteryCapacity: number;
  batteryCount: number;
  inverterSize: number;
  chargeControllerSize: number;
  systemCost: {
    panels: number;
    batteries: number;
    inverter: number;
    chargeController: number;
    installation: number;
    total: number;
  };
  paybackPeriod: number;
  monthlySavings: number;
  co2Savings: number;
  roofArea: number;
}

// =====================================================
// CONSTANTS
// =====================================================
const PANEL_OPTIONS = [
  { watts: 150, price: 8500, width: 0.7, height: 1.0 },
  { watts: 250, price: 12000, width: 1.0, height: 1.3 },
  { watts: 330, price: 15000, width: 1.0, height: 1.7 },
  { watts: 400, price: 18000, width: 1.0, height: 1.9 },
  { watts: 450, price: 20000, width: 1.1, height: 2.0 },
  { watts: 550, price: 25000, width: 1.1, height: 2.3 },
];

const BATTERY_OPTIONS = [
  { name: 'Lead Acid (100Ah 12V)', ah: 100, voltage: 12, dod: 50, cycles: 500, price: 15000 },
  { name: 'AGM (100Ah 12V)', ah: 100, voltage: 12, dod: 60, cycles: 800, price: 25000 },
  { name: 'Gel (200Ah 12V)', ah: 200, voltage: 12, dod: 65, cycles: 1000, price: 45000 },
  { name: 'Lithium LiFePO4 (100Ah 12V)', ah: 100, voltage: 12, dod: 90, cycles: 4000, price: 85000 },
  { name: 'Lithium LiFePO4 (200Ah 48V)', ah: 200, voltage: 48, dod: 95, cycles: 6000, price: 280000 },
];

const INVERTER_OPTIONS = [
  { watts: 1000, price: 12000 },
  { watts: 2000, price: 20000 },
  { watts: 3000, price: 30000 },
  { watts: 5000, price: 45000 },
  { watts: 8000, price: 70000 },
  { watts: 10000, price: 90000 },
  { watts: 15000, price: 130000 },
];

const PRESET_APPLIANCES = [
  { name: 'LED Bulb (9W)', watts: 9, hoursPerDay: 6 },
  { name: 'Ceiling Fan', watts: 75, hoursPerDay: 8 },
  { name: 'TV (LED 43")', watts: 60, hoursPerDay: 5 },
  { name: 'Laptop', watts: 65, hoursPerDay: 6 },
  { name: 'Desktop Computer', watts: 200, hoursPerDay: 8 },
  { name: 'WiFi Router', watts: 10, hoursPerDay: 24 },
  { name: 'Phone Charger', watts: 15, hoursPerDay: 2 },
  { name: 'Refrigerator', watts: 150, hoursPerDay: 8 },
  { name: 'Freezer', watts: 200, hoursPerDay: 8 },
  { name: 'Water Pump (0.5HP)', watts: 370, hoursPerDay: 2 },
  { name: 'Washing Machine', watts: 500, hoursPerDay: 1 },
  { name: 'Iron Box', watts: 1000, hoursPerDay: 0.5 },
  { name: 'Microwave', watts: 1200, hoursPerDay: 0.3 },
  { name: 'Electric Kettle', watts: 1500, hoursPerDay: 0.2 },
  { name: 'Air Conditioner (1 Ton)', watts: 1200, hoursPerDay: 6 },
  { name: 'Air Conditioner (1.5 Ton)', watts: 1800, hoursPerDay: 6 },
  { name: 'CCTV System (4 cameras)', watts: 50, hoursPerDay: 24 },
  { name: 'Security Lights', watts: 30, hoursPerDay: 12 },
];

const KENYA_CITIES_SUNHOURS = [
  { city: 'Nairobi', sunHours: 5.5, irradiance: 5.2 },
  { city: 'Mombasa', sunHours: 6.0, irradiance: 5.8 },
  { city: 'Kisumu', sunHours: 5.8, irradiance: 5.5 },
  { city: 'Nakuru', sunHours: 5.3, irradiance: 5.0 },
  { city: 'Eldoret', sunHours: 5.0, irradiance: 4.8 },
  { city: 'Turkana', sunHours: 6.5, irradiance: 6.2 },
  { city: 'Garissa', sunHours: 6.3, irradiance: 6.0 },
  { city: 'Malindi', sunHours: 6.2, irradiance: 5.9 },
];

// =====================================================
// MAIN COMPONENT
// =====================================================
export default function AdvancedSolarCalculator() {
  const [activeTab, setActiveTab] = useState<'loads' | 'system' | 'results' | 'roi'>('loads');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  
  // Custom appliance form
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    watts: '',
    quantity: '1',
    hoursPerDay: '8',
    daysPerWeek: '7',
  });
  
  // System settings
  const [settings, setSettings] = useState({
    location: 'Nairobi',
    sunHours: 5.5,
    systemVoltage: 48,
    autonomyDays: 2,
    panelWattage: 400,
    batteryType: 3, // Lithium LiFePO4 index
    systemType: 'hybrid' as 'off-grid' | 'grid-tie' | 'hybrid',
    gridElectricityRate: 25, // KES per kWh
    installationType: 'rooftop' as 'rooftop' | 'ground',
    panelTilt: 15,
    efficiency: {
      panel: 85, // accounts for dust, heat loss
      inverter: 93,
      battery: 95,
      wiring: 97,
    },
  });

  // Add preset appliance
  const addPresetAppliance = (preset: typeof PRESET_APPLIANCES[0]) => {
    const newAppliance: Appliance = {
      id: `${Date.now()}-${Math.random()}`,
      name: preset.name,
      watts: preset.watts,
      quantity: 1,
      hoursPerDay: preset.hoursPerDay,
      daysPerWeek: 7,
    };
    setAppliances([...appliances, newAppliance]);
  };

  // Add custom appliance
  const addCustomAppliance = () => {
    if (!customAppliance.name || !customAppliance.watts) return;
    
    const newAppliance: Appliance = {
      id: `${Date.now()}-${Math.random()}`,
      name: customAppliance.name,
      watts: parseFloat(customAppliance.watts),
      quantity: parseInt(customAppliance.quantity) || 1,
      hoursPerDay: parseFloat(customAppliance.hoursPerDay) || 8,
      daysPerWeek: parseInt(customAppliance.daysPerWeek) || 7,
    };
    setAppliances([...appliances, newAppliance]);
    setCustomAppliance({ name: '', watts: '', quantity: '1', hoursPerDay: '8', daysPerWeek: '7' });
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
  const results = useMemo((): SolarResults | null => {
    if (appliances.length === 0) return null;

    // Calculate daily energy consumption (Wh)
    const dailyEnergyWh = appliances.reduce((sum, app) => 
      sum + (app.watts * app.quantity * app.hoursPerDay * (app.daysPerWeek / 7)), 0
    );
    const dailyEnergyRequired = dailyEnergyWh / 1000; // kWh

    // Monthly energy
    const monthlyEnergyRequired = dailyEnergyRequired * 30;

    // System efficiency
    const totalEfficiency = (settings.efficiency.panel / 100) * 
                           (settings.efficiency.inverter / 100) * 
                           (settings.efficiency.battery / 100) * 
                           (settings.efficiency.wiring / 100);

    // Panel calculations
    const selectedPanel = PANEL_OPTIONS.find(p => p.watts === settings.panelWattage) || PANEL_OPTIONS[3];
    const panelOutputPerDay = selectedPanel.watts * settings.sunHours * (settings.efficiency.panel / 100) / 1000; // kWh
    const panelsRequired = Math.ceil((dailyEnergyRequired / totalEfficiency) / panelOutputPerDay);
    const totalPanelCapacity = panelsRequired * selectedPanel.watts;

    // Battery calculations
    const selectedBattery = BATTERY_OPTIONS[settings.batteryType];
    const batteryEnergyNeeded = (dailyEnergyRequired * settings.autonomyDays * 1000) / (selectedBattery.dod / 100); // Wh
    const batteryCapacity = batteryEnergyNeeded / settings.systemVoltage; // Ah
    const batteryCount = Math.ceil(batteryCapacity / selectedBattery.ah);

    // Inverter sizing (peak load + 25% margin)
    const peakLoad = appliances.reduce((sum, app) => sum + (app.watts * app.quantity), 0);
    const inverterRequired = peakLoad * 1.25;
    const selectedInverter = INVERTER_OPTIONS.find(i => i.watts >= inverterRequired) || INVERTER_OPTIONS[INVERTER_OPTIONS.length - 1];

    // Charge controller sizing (panel watts / system voltage * 1.25)
    const chargeControllerSize = Math.ceil((totalPanelCapacity / settings.systemVoltage) * 1.25);

    // Cost calculation
    const panelCost = panelsRequired * selectedPanel.price;
    const batteryCost = batteryCount * selectedBattery.price;
    const inverterCost = selectedInverter.price;
    const chargeControllerCost = chargeControllerSize * 800; // ~800 KES per amp for MPPT
    const installationCost = (panelCost + batteryCost + inverterCost) * 0.15; // 15% installation
    const totalCost = panelCost + batteryCost + inverterCost + chargeControllerCost + installationCost;

    // ROI calculations
    const monthlySavings = monthlyEnergyRequired * settings.gridElectricityRate;
    const paybackPeriod = totalCost / (monthlySavings * 12);

    // CO2 savings (0.5 kg CO2 per kWh for Kenya grid)
    const co2Savings = monthlyEnergyRequired * 12 * 0.5;

    // Roof area required
    const roofArea = panelsRequired * selectedPanel.width * selectedPanel.height * 1.3; // 30% spacing

    return {
      dailyEnergyRequired,
      monthlyEnergyRequired,
      panelWattage: selectedPanel.watts,
      panelsRequired,
      totalPanelCapacity,
      batteryCapacity,
      batteryCount,
      inverterSize: selectedInverter.watts,
      chargeControllerSize,
      systemCost: {
        panels: panelCost,
        batteries: batteryCost,
        inverter: inverterCost,
        chargeController: chargeControllerCost,
        installation: installationCost,
        total: totalCost,
      },
      paybackPeriod,
      monthlySavings,
      co2Savings,
      roofArea,
    };
  }, [appliances, settings]);

  return (
    <div className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 p-4 border-b border-yellow-500/30">
        <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <span>☀️</span> Advanced Solar System Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete solar sizing with battery storage, ROI analysis & system costing
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'loads', label: '📋 Load Analysis', count: appliances.length },
          { id: 'system', label: '⚙️ System Config' },
          { id: 'results', label: '📊 System Size' },
          { id: 'roi', label: '💰 ROI Analysis' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-yellow-500/20 text-yellow-400 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-500/30 rounded-full text-xs">{tab.count}</span>
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
                <h4 className="text-sm font-bold text-yellow-400 mb-3">QUICK ADD - COMMON APPLIANCES</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
                  {PRESET_APPLIANCES.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => addPresetAppliance(preset)}
                      className="p-2 text-left bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-xs transition-colors"
                    >
                      <div className="text-white font-medium truncate">{preset.name}</div>
                      <div className="text-gray-400">{preset.watts}W × {preset.hoursPerDay}h</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Appliance Form */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">ADD CUSTOM APPLIANCE</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Appliance Name</label>
                    <input
                      type="text"
                      value={customAppliance.name}
                      onChange={(e) => setCustomAppliance({...customAppliance, name: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="e.g., Printer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Watts (W)</label>
                    <input
                      type="number"
                      value={customAppliance.watts}
                      onChange={(e) => setCustomAppliance({...customAppliance, watts: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      placeholder="100"
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
                    <label className="text-xs text-gray-400 block mb-1">Hours/Day</label>
                    <input
                      type="number"
                      step="0.5"
                      value={customAppliance.hoursPerDay}
                      onChange={(e) => setCustomAppliance({...customAppliance, hoursPerDay: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Days/Week</label>
                    <input
                      type="number"
                      value={customAppliance.daysPerWeek}
                      onChange={(e) => setCustomAppliance({...customAppliance, daysPerWeek: e.target.value})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                      min="1"
                      max="7"
                    />
                  </div>
                </div>
                <button
                  onClick={addCustomAppliance}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-2 rounded font-bold transition-colors"
                >
                  + Add Appliance
                </button>
              </div>

              {/* Appliances List */}
              {appliances.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-yellow-400 mb-3">
                    YOUR LOADS ({appliances.length} appliances)
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {appliances.map((app) => (
                      <div 
                        key={app.id}
                        className="flex items-center gap-3 p-3 bg-gray-800 rounded border border-gray-700"
                      >
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">{app.name}</div>
                          <div className="text-gray-400 text-xs">
                            {app.watts}W × {app.quantity} × {app.hoursPerDay}h/day = 
                            <span className="text-yellow-400 ml-1">
                              {((app.watts * app.quantity * app.hoursPerDay) / 1000).toFixed(2)} kWh/day
                            </span>
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
                          <input
                            type="number"
                            value={app.hoursPerDay}
                            onChange={(e) => updateAppliance(app.id, 'hoursPerDay', parseFloat(e.target.value) || 1)}
                            className="w-16 bg-black border border-gray-600 rounded px-2 py-1 text-white text-sm text-center"
                            step="0.5"
                            min="0.5"
                            max="24"
                          />
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
                  
                  {/* Total Summary */}
                  <div className="mt-4 p-3 bg-yellow-900/20 rounded border border-yellow-500/30">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Peak Load:</span>
                      <span className="text-yellow-400 font-bold">
                        {(appliances.reduce((sum, a) => sum + (a.watts * a.quantity), 0) / 1000).toFixed(2)} kW
                      </span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Daily Energy:</span>
                      <span className="text-yellow-400 font-bold">
                        {(appliances.reduce((sum, a) => sum + (a.watts * a.quantity * a.hoursPerDay * (a.daysPerWeek / 7)), 0) / 1000).toFixed(2)} kWh
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* SYSTEM CONFIG TAB */}
          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Location & Sun Hours */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">☀️ LOCATION & SOLAR RESOURCE</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Location</label>
                    <select
                      value={settings.location}
                      onChange={(e) => {
                        const city = KENYA_CITIES_SUNHOURS.find(c => c.city === e.target.value);
                        setSettings({
                          ...settings, 
                          location: e.target.value,
                          sunHours: city?.sunHours || 5.5
                        });
                      }}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {KENYA_CITIES_SUNHOURS.map(city => (
                        <option key={city.city} value={city.city}>{city.city} ({city.sunHours}h)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Peak Sun Hours</label>
                    <input
                      type="number"
                      step="0.1"
                      value={settings.sunHours}
                      onChange={(e) => setSettings({...settings, sunHours: parseFloat(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Panel Tilt Angle (°)</label>
                    <input
                      type="number"
                      value={settings.panelTilt}
                      onChange={(e) => setSettings({...settings, panelTilt: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* System Type */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">🔋 SYSTEM CONFIGURATION</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">System Type</label>
                    <select
                      value={settings.systemType}
                      onChange={(e) => setSettings({...settings, systemType: e.target.value as typeof settings.systemType})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value="off-grid">Off-Grid (Standalone)</option>
                      <option value="grid-tie">Grid-Tie (No Battery)</option>
                      <option value="hybrid">Hybrid (Grid + Battery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">System Voltage</label>
                    <select
                      value={settings.systemVoltage}
                      onChange={(e) => setSettings({...settings, systemVoltage: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      <option value={12}>12V (Small Systems)</option>
                      <option value={24}>24V (Medium Systems)</option>
                      <option value={48}>48V (Large Systems)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Autonomy Days</label>
                    <input
                      type="number"
                      min="1"
                      max="7"
                      value={settings.autonomyDays}
                      onChange={(e) => setSettings({...settings, autonomyDays: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Panel Wattage</label>
                    <select
                      value={settings.panelWattage}
                      onChange={(e) => setSettings({...settings, panelWattage: parseInt(e.target.value)})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    >
                      {PANEL_OPTIONS.map(p => (
                        <option key={p.watts} value={p.watts}>{p.watts}W Panel</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Battery Type */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">🔋 BATTERY SELECTION</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BATTERY_OPTIONS.map((battery, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSettings({...settings, batteryType: idx})}
                      className={`p-3 text-left rounded border transition-colors ${
                        settings.batteryType === idx
                          ? 'bg-yellow-900/30 border-yellow-500'
                          : 'bg-gray-800 border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="text-white font-medium text-sm">{battery.name}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        DoD: {battery.dod}% | Cycles: {battery.cycles.toLocaleString()} | KES {battery.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Efficiency Settings */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">⚡ EFFICIENCY FACTORS</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Panel Efficiency (%)</label>
                    <input
                      type="number"
                      value={settings.efficiency.panel}
                      onChange={(e) => setSettings({
                        ...settings, 
                        efficiency: {...settings.efficiency, panel: parseInt(e.target.value)}
                      })}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Inverter Efficiency (%)</label>
                    <input
                      type="number"
                      value={settings.efficiency.inverter}
                      onChange={(e) => setSettings({
                        ...settings, 
                        efficiency: {...settings.efficiency, inverter: parseInt(e.target.value)}
                      })}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Battery Efficiency (%)</label>
                    <input
                      type="number"
                      value={settings.efficiency.battery}
                      onChange={(e) => setSettings({
                        ...settings, 
                        efficiency: {...settings.efficiency, battery: parseInt(e.target.value)}
                      })}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Grid Rate (KES/kWh)</label>
                    <input
                      type="number"
                      value={settings.gridElectricityRate}
                      onChange={(e) => setSettings({...settings, gridElectricityRate: parseInt(e.target.value)})}
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
                  {/* Energy Requirements */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-4 border border-yellow-500/30 text-center">
                      <div className="text-3xl font-bold text-yellow-400">{results.dailyEnergyRequired.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Daily Energy (kWh)</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-4 border border-orange-500/30 text-center">
                      <div className="text-3xl font-bold text-orange-400">{results.monthlyEnergyRequired.toFixed(0)}</div>
                      <div className="text-xs text-gray-400">Monthly Energy (kWh)</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-3xl font-bold text-green-400">{(results.totalPanelCapacity / 1000).toFixed(1)}</div>
                      <div className="text-xs text-gray-400">System Size (kWp)</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-lg p-4 border border-blue-500/30 text-center">
                      <div className="text-3xl font-bold text-blue-400">{results.roofArea.toFixed(0)}</div>
                      <div className="text-xs text-gray-400">Roof Area (m²)</div>
                    </div>
                  </div>

                  {/* Component Specifications */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-yellow-400 mb-3">📋 SYSTEM COMPONENTS</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">☀️ Solar Panels</span>
                          <span className="text-white font-mono">{results.panelsRequired} × {results.panelWattage}W</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">⚡ Total Panel Capacity</span>
                          <span className="text-white font-mono">{(results.totalPanelCapacity / 1000).toFixed(2)} kWp</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">🔋 Batteries</span>
                          <span className="text-white font-mono">{results.batteryCount} units</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">💾 Battery Bank Capacity</span>
                          <span className="text-white font-mono">{results.batteryCapacity.toFixed(0)} Ah</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">🔌 Inverter</span>
                          <span className="text-white font-mono">{(results.inverterSize / 1000).toFixed(1)} kW</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">🎛️ Charge Controller (MPPT)</span>
                          <span className="text-white font-mono">{results.chargeControllerSize}A</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">🔋 System Voltage</span>
                          <span className="text-white font-mono">{settings.systemVoltage}V DC</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                          <span className="text-gray-400 flex items-center gap-2">⏱️ Backup Duration</span>
                          <span className="text-white font-mono">{settings.autonomyDays} days</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Recommendation */}
                  <div className="bg-gradient-to-r from-green-900/30 to-yellow-900/30 rounded-lg p-4 border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-400 mb-2">✅ RECOMMENDED SYSTEM</h4>
                    <div className="text-2xl font-bold text-white mb-2">
                      {(results.totalPanelCapacity / 1000).toFixed(1)} kWp {settings.systemType.replace('-', ' ').toUpperCase()} Solar System
                    </div>
                    <p className="text-gray-400 text-sm">
                      {results.panelsRequired} × {results.panelWattage}W panels | {results.batteryCount} × {BATTERY_OPTIONS[settings.batteryType].name} | 
                      {(results.inverterSize / 1000).toFixed(1)}kW inverter | {results.chargeControllerSize}A MPPT controller
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">☀️</div>
                  <div className="text-lg">Add appliances in the &quot;Load Analysis&quot; tab to see results</div>
                </div>
              )}
            </motion.div>
          )}

          {/* ROI TAB */}
          {activeTab === 'roi' && (
            <motion.div
              key="roi"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {results ? (
                <>
                  {/* Cost Breakdown */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-green-400 mb-3">💰 SYSTEM COST BREAKDOWN</h4>
                    <div className="space-y-3">
                      {[
                        { label: '☀️ Solar Panels', cost: results.systemCost.panels },
                        { label: '🔋 Batteries', cost: results.systemCost.batteries },
                        { label: '🔌 Inverter', cost: results.systemCost.inverter },
                        { label: '🎛️ Charge Controller', cost: results.systemCost.chargeController },
                        { label: '🔧 Installation', cost: results.systemCost.installation },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-gray-400">{item.label}</span>
                          <span className="text-white font-mono">KES {item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-600 pt-3 flex justify-between items-center">
                        <span className="text-green-400 font-bold">TOTAL INVESTMENT</span>
                        <span className="text-green-400 font-bold text-xl">KES {results.systemCost.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* ROI Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-green-900/50 to-teal-900/50 rounded-lg p-4 border border-green-500/30 text-center">
                      <div className="text-3xl font-bold text-green-400">KES {results.monthlySavings.toLocaleString()}</div>
                      <div className="text-xs text-gray-400">Monthly Savings</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 rounded-lg p-4 border border-yellow-500/30 text-center">
                      <div className="text-3xl font-bold text-yellow-400">{results.paybackPeriod.toFixed(1)}</div>
                      <div className="text-xs text-gray-400">Payback (Years)</div>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 rounded-lg p-4 border border-cyan-500/30 text-center">
                      <div className="text-3xl font-bold text-cyan-400">KES {(results.monthlySavings * 12 * 25).toLocaleString()}</div>
                      <div className="text-xs text-gray-400">25-Year Savings</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-lg p-4 border border-purple-500/30 text-center">
                      <div className="text-3xl font-bold text-purple-400">{results.co2Savings.toFixed(0)} kg</div>
                      <div className="text-xs text-gray-400">CO2 Saved/Year</div>
                    </div>
                  </div>

                  {/* Savings Timeline */}
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-sm font-bold text-green-400 mb-3">📈 CUMULATIVE SAVINGS PROJECTION</h4>
                    <div className="space-y-2">
                      {[1, 3, 5, 10, 15, 25].map(year => {
                        const savings = results.monthlySavings * 12 * year;
                        const netSavings = savings - results.systemCost.total;
                        const isPositive = netSavings > 0;
                        
                        return (
                          <div key={year} className="flex items-center gap-4">
                            <span className="text-gray-400 w-20">Year {year}</span>
                            <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                              <div 
                                className={`h-4 rounded-full ${isPositive ? 'bg-green-500' : 'bg-yellow-500'}`}
                                style={{ width: `${Math.min((savings / (results.monthlySavings * 12 * 25)) * 100, 100)}%` }}
                              />
                            </div>
                            <span className={`w-32 text-right font-mono ${isPositive ? 'text-green-400' : 'text-yellow-400'}`}>
                              KES {netSavings.toLocaleString()}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-4 border border-green-500/30">
                    <h4 className="text-lg font-bold text-green-400 mb-2">🌍 ENVIRONMENTAL IMPACT</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-green-400">{(results.co2Savings * 25).toLocaleString()} kg</div>
                        <div className="text-xs text-gray-400">CO2 Avoided (25 years)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{Math.round(results.co2Savings * 25 / 21)}</div>
                        <div className="text-xs text-gray-400">Trees Equivalent</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-400">{Math.round(results.monthlyEnergyRequired * 12 * 25)}</div>
                        <div className="text-xs text-gray-400">kWh Clean Energy</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-5xl mb-4">💰</div>
                  <div className="text-lg">Add appliances to see ROI analysis</div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      {results && (
        <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
          <div className="flex gap-6">
            <span className="text-gray-400">System: <span className="text-yellow-400 font-bold">{(results.totalPanelCapacity / 1000).toFixed(1)} kWp</span></span>
            <span className="text-gray-400">Cost: <span className="text-green-400 font-bold">KES {results.systemCost.total.toLocaleString()}</span></span>
          </div>
          <a 
            href={`https://wa.me/0768860665?text=I%20need%20a%20quote%20for%20a%20${(results.totalPanelCapacity / 1000).toFixed(1)}kWp%20solar%20system`}
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
