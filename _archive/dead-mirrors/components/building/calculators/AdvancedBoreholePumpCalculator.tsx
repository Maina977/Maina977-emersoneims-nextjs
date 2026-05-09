'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED BOREHOLE PUMP CALCULATOR
// =====================================================

const PUMP_TYPES = [
  { type: 'Submersible (AC)', efficiency: 0.65, minHead: 10, maxHead: 300, priceMultiplier: 1.0 },
  { type: 'Submersible (Solar DC)', efficiency: 0.75, minHead: 10, maxHead: 200, priceMultiplier: 1.5 },
  { type: 'Surface Jet Pump', efficiency: 0.55, minHead: 0, maxHead: 40, priceMultiplier: 0.6 },
  { type: 'Helical Rotor (Solar)', efficiency: 0.80, minHead: 20, maxHead: 150, priceMultiplier: 2.0 },
];

const PIPE_SIZES = [
  { size: '1"', diameter: 25, frictionFactor: 0.024 },
  { size: '1.25"', diameter: 32, frictionFactor: 0.022 },
  { size: '1.5"', diameter: 40, frictionFactor: 0.020 },
  { size: '2"', diameter: 50, frictionFactor: 0.018 },
  { size: '2.5"', diameter: 63, frictionFactor: 0.016 },
  { size: '3"', diameter: 75, frictionFactor: 0.015 },
  { size: '4"', diameter: 100, frictionFactor: 0.014 },
];

const WATER_USAGE = [
  { category: 'Domestic (per person/day)', liters: 150 },
  { category: 'Livestock - Cattle (per head/day)', liters: 50 },
  { category: 'Livestock - Goats/Sheep (per head/day)', liters: 10 },
  { category: 'Poultry (per 100 birds/day)', liters: 30 },
  { category: 'Irrigation - Drip (per hectare/day)', liters: 25000 },
  { category: 'Irrigation - Sprinkler (per hectare/day)', liters: 40000 },
  { category: 'Small Garden (per m²/day)', liters: 5 },
];

const TANK_SIZES = [
  { liters: 1000, type: 'Plastic Tank 1000L' },
  { liters: 2000, type: 'Plastic Tank 2000L' },
  { liters: 5000, type: 'Plastic Tank 5000L' },
  { liters: 10000, type: 'Plastic Tank 10000L' },
  { liters: 20000, type: 'Steel Tank 20000L' },
  { liters: 50000, type: 'Steel/Concrete Tank 50000L' },
];

export default function AdvancedBoreholePumpCalculator() {
  const [activeTab, setActiveTab] = useState<'demand' | 'borehole' | 'pump' | 'system'>('demand');
  
  const [demand, setDemand] = useState({
    people: 10,
    cattle: 0,
    goats: 0,
    poultry: 0,
    irrigationHectares: 0,
    irrigationType: 'Drip',
    gardenArea: 50,
    otherDaily: 0,
    peakFactor: 1.5,
    storageDays: 2,
  });

  const [borehole, setBorehole] = useState({
    staticLevel: 30, // meters
    dynamicLevel: 50, // meters (pumping level)
    yield: 3, // m³/hr
    pipeLength: 100, // meters to tank
    pipeSize: '2"',
    tankElevation: 10, // meters above ground
  });

  const [config, setConfig] = useState({
    pumpType: 'Submersible (AC)',
    operatingHours: 8,
    solarPanels: 0,
    voltage: 220,
    useVFD: false,
    electricityRate: 25, // KES per kWh
  });

  const results = useMemo(() => {
    // Calculate daily demand
    const domesticDemand = demand.people * 150;
    const cattleDemand = demand.cattle * 50;
    const goatsDemand = demand.goats * 10;
    const poultryDemand = (demand.poultry / 100) * 30;
    const irrigationDemand = demand.irrigationHectares * (demand.irrigationType === 'Drip' ? 25000 : 40000);
    const gardenDemand = demand.gardenArea * 5;
    
    const baseDailyDemand = domesticDemand + cattleDemand + goatsDemand + poultryDemand + irrigationDemand + gardenDemand + demand.otherDaily;
    const peakDailyDemand = baseDailyDemand * demand.peakFactor;
    
    // Calculate required flow rate
    const requiredFlowRate = peakDailyDemand / (config.operatingHours * 1000); // m³/hr
    
    // Check against borehole yield
    const flowRateLimited = Math.min(requiredFlowRate, borehole.yield);
    const actualOperatingHours = requiredFlowRate <= borehole.yield 
      ? config.operatingHours 
      : Math.ceil(peakDailyDemand / (borehole.yield * 1000));
    
    // Calculate Total Dynamic Head (TDH)
    const staticHead = borehole.dynamicLevel; // Depth to pumping water level
    const deliveryHead = borehole.tankElevation; // Height to discharge point
    
    // Friction losses (Hazen-Williams approximation)
    const pipeData = PIPE_SIZES.find(p => p.size === borehole.pipeSize) || PIPE_SIZES[3];
    const velocity = (flowRateLimited * 1000 / 3600) / (Math.PI * Math.pow(pipeData.diameter / 2000, 2));
    const frictionLoss = pipeData.frictionFactor * (borehole.pipeLength / (pipeData.diameter / 1000)) * Math.pow(velocity, 2) / (2 * 9.81);
    
    // Minor losses (fittings, valves) - estimate 10% of friction
    const minorLosses = frictionLoss * 0.1;
    
    const totalDynamicHead = staticHead + deliveryHead + frictionLoss + minorLosses;
    
    // Calculate pump power
    const pumpTypeData = PUMP_TYPES.find(p => p.type === config.pumpType) || PUMP_TYPES[0];
    const hydraulicPower = (flowRateLimited * 1000 * 9.81 * totalDynamicHead) / 3600000; // kW
    const shaftPower = hydraulicPower / pumpTypeData.efficiency;
    const motorPower = shaftPower * 1.15; // 15% margin for motor
    
    // Standard motor sizes
    const standardMotors = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3.0, 4.0, 5.5, 7.5, 11, 15, 18.5, 22, 30];
    const selectedMotorPower = standardMotors.find(m => m >= motorPower) || standardMotors[standardMotors.length - 1];
    
    // Storage tank sizing
    const requiredStorage = peakDailyDemand * demand.storageDays;
    const selectedTank = TANK_SIZES.find(t => t.liters >= requiredStorage) || TANK_SIZES[TANK_SIZES.length - 1];
    
    // Solar pumping calculation
    const solarPeakHours = 5; // Average peak sun hours
    const solarPanelWatts = 400;
    const requiredSolarPower = selectedMotorPower * 1.3 * 1000; // 30% extra for inefficiencies
    const requiredPanels = Math.ceil(requiredSolarPower / (solarPanelWatts * 0.8));
    
    // Cost calculations
    const pumpCost = selectedMotorPower * 25000 * pumpTypeData.priceMultiplier; // KES per kW
    const pipingCost = borehole.pipeLength * (pipeData.diameter * 4); // KES per meter
    const tankCost = selectedTank.liters * 2; // KES per liter
    const installationCost = (pumpCost + pipingCost + tankCost) * 0.2;
    
    const solarPanelCost = requiredPanels * 15000;
    const controllerCost = selectedMotorPower * 8000;
    const solarTotalCost = solarPanelCost + controllerCost;
    
    // Operating costs
    const dailyKwh = selectedMotorPower * actualOperatingHours;
    const monthlyKwh = dailyKwh * 30;
    const monthlyElectricityCost = monthlyKwh * config.electricityRate;
    
    return {
      baseDailyDemand,
      peakDailyDemand,
      requiredFlowRate,
      flowRateLimited,
      actualOperatingHours,
      staticHead,
      deliveryHead,
      frictionLoss,
      totalDynamicHead,
      hydraulicPower,
      shaftPower,
      motorPower,
      selectedMotorPower,
      pumpTypeData,
      requiredStorage,
      selectedTank,
      requiredPanels,
      requiredSolarPower,
      pumpCost,
      pipingCost,
      tankCost,
      installationCost,
      totalCost: pumpCost + pipingCost + tankCost + installationCost,
      solarTotalCost,
      monthlyElectricityCost,
      velocity,
      yieldSufficient: borehole.yield >= requiredFlowRate,
      demandBreakdown: {
        domestic: domesticDemand,
        cattle: cattleDemand,
        goats: goatsDemand,
        poultry: poultryDemand,
        irrigation: irrigationDemand,
        garden: gardenDemand,
        other: demand.otherDaily,
      },
    };
  }, [demand, borehole, config]);

  return (
    <div className="bg-gray-900 rounded-xl border border-cyan-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 p-4 border-b border-cyan-500/30">
        <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
          <span>💧</span> Advanced Borehole Pump Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Complete water system design with TDH calculation & solar pumping options
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'demand', label: '🚰 Demand' },
          { id: 'borehole', label: '🕳️ Borehole' },
          { id: 'pump', label: '⚡ Pump' },
          { id: 'system', label: '💰 System' },
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
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'demand' && (
            <motion.div
              key="demand"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">People</label>
                  <input
                    type="number"
                    value={demand.people}
                    onChange={(e) => setDemand({...demand, people: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">×150L/day</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Cattle</label>
                  <input
                    type="number"
                    value={demand.cattle}
                    onChange={(e) => setDemand({...demand, cattle: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">×50L/day</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Goats/Sheep</label>
                  <input
                    type="number"
                    value={demand.goats}
                    onChange={(e) => setDemand({...demand, goats: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">×10L/day</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Poultry (birds)</label>
                  <input
                    type="number"
                    value={demand.poultry}
                    onChange={(e) => setDemand({...demand, poultry: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">30L/100birds</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Irrigation (hectares)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={demand.irrigationHectares}
                    onChange={(e) => setDemand({...demand, irrigationHectares: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Irrigation Type</label>
                  <select
                    value={demand.irrigationType}
                    onChange={(e) => setDemand({...demand, irrigationType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value="Drip">Drip (25m³/ha)</option>
                    <option value="Sprinkler">Sprinkler (40m³/ha)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Garden Area (m²)</label>
                  <input
                    type="number"
                    value={demand.gardenArea}
                    onChange={(e) => setDemand({...demand, gardenArea: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Other Daily (L)</label>
                  <input
                    type="number"
                    value={demand.otherDaily}
                    onChange={(e) => setDemand({...demand, otherDaily: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Peak Factor</label>
                  <select
                    value={demand.peakFactor}
                    onChange={(e) => setDemand({...demand, peakFactor: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    <option value={1.2}>1.2× (Low)</option>
                    <option value={1.5}>1.5× (Normal)</option>
                    <option value={2.0}>2.0× (High)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Storage Days</label>
                  <select
                    value={demand.storageDays}
                    onChange={(e) => setDemand({...demand, storageDays: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[1, 2, 3, 5, 7].map(d => (
                      <option key={d} value={d}>{d} day(s)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-cyan-900/30 rounded-lg p-4 border border-cyan-500/30">
                <h4 className="text-sm font-bold text-cyan-400 mb-3">📊 DAILY DEMAND SUMMARY</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold text-white">{(results.baseDailyDemand / 1000).toFixed(1)} m³</div>
                    <div className="text-xs text-gray-400">Base Daily Demand</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-cyan-400">{(results.peakDailyDemand / 1000).toFixed(1)} m³</div>
                    <div className="text-xs text-gray-400">Peak Daily Demand</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'borehole' && (
            <motion.div
              key="borehole"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Static Water Level (m)</label>
                  <input
                    type="number"
                    value={borehole.staticLevel}
                    onChange={(e) => setBorehole({...borehole, staticLevel: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">Depth when not pumping</span>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pumping Level (m)</label>
                  <input
                    type="number"
                    value={borehole.dynamicLevel}
                    onChange={(e) => setBorehole({...borehole, dynamicLevel: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-xs text-gray-500">Depth when pumping</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Borehole Yield (m³/hr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={borehole.yield}
                    onChange={(e) => setBorehole({...borehole, yield: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Tank Elevation (m)</label>
                  <input
                    type="number"
                    value={borehole.tankElevation}
                    onChange={(e) => setBorehole({...borehole, tankElevation: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pipe Length (m)</label>
                  <input
                    type="number"
                    value={borehole.pipeLength}
                    onChange={(e) => setBorehole({...borehole, pipeLength: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pipe Size</label>
                  <select
                    value={borehole.pipeSize}
                    onChange={(e) => setBorehole({...borehole, pipeSize: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {PIPE_SIZES.map(p => (
                      <option key={p.size} value={p.size}>{p.size} ({p.diameter}mm)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">📐 HEAD CALCULATION</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Static Head (Pumping Level):</span>
                    <span className="text-white">{results.staticHead.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Delivery Head (Tank Elevation):</span>
                    <span className="text-white">{results.deliveryHead.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Friction Losses:</span>
                    <span className="text-white">{results.frictionLoss.toFixed(1)} m</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-600 font-bold">
                    <span className="text-cyan-400">Total Dynamic Head (TDH):</span>
                    <span className="text-cyan-400">{results.totalDynamicHead.toFixed(1)} m</span>
                  </div>
                </div>
              </div>

              {!results.yieldSufficient && (
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                  <p className="text-red-400 text-sm">
                    ⚠️ <strong>Warning:</strong> Borehole yield ({borehole.yield} m³/hr) is less than required flow rate ({results.requiredFlowRate.toFixed(2)} m³/hr). Extended pumping hours required.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'pump' && (
            <motion.div
              key="pump"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Pump Type</label>
                  <select
                    value={config.pumpType}
                    onChange={(e) => setConfig({...config, pumpType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {PUMP_TYPES.map(p => (
                      <option key={p.type} value={p.type}>{p.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Operating Hours/Day</label>
                  <input
                    type="number"
                    value={config.operatingHours}
                    onChange={(e) => setConfig({...config, operatingHours: parseInt(e.target.value) || 8})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 border border-cyan-500/30">
                <h4 className="text-lg font-bold text-cyan-400 mb-2">✅ RECOMMENDED PUMP</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {results.selectedMotorPower} kW {config.pumpType}
                </div>
                <p className="text-gray-400">
                  Flow: {results.flowRateLimited.toFixed(2)} m³/hr | TDH: {results.totalDynamicHead.toFixed(1)} m
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">{results.requiredFlowRate.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Required m³/hr</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">{results.totalDynamicHead.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">TDH (meters)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400">{results.motorPower.toFixed(2)}</div>
                  <div className="text-xs text-gray-400">Calc. Power (kW)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-green-400">{results.actualOperatingHours}</div>
                  <div className="text-xs text-gray-400">Hours/Day</div>
                </div>
              </div>

              {config.pumpType.includes('Solar') && (
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="text-sm font-bold text-yellow-400 mb-2">☀️ SOLAR PUMPING SYSTEM</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Required Solar Panels:</span>
                      <span className="text-white ml-2">{results.requiredPanels} × 400W</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Total Solar Array:</span>
                      <span className="text-white ml-2">{(results.requiredPanels * 0.4).toFixed(1)} kW</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'system' && (
            <motion.div
              key="system"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-green-400 mb-3">💧 STORAGE TANK</h4>
                <div className="text-2xl font-bold text-white">{results.selectedTank.type}</div>
                <p className="text-gray-400 text-sm mt-1">
                  Required: {(results.requiredStorage / 1000).toFixed(1)} m³ for {demand.storageDays} days reserve
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 COST ESTIMATION</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Pump ({results.selectedMotorPower} kW {config.pumpType})</span>
                    <span className="text-white">KES {results.pumpCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Piping ({borehole.pipeLength}m × {borehole.pipeSize})</span>
                    <span className="text-white">KES {results.pipingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Storage Tank ({results.selectedTank.type})</span>
                    <span className="text-white">KES {results.tankCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Installation & Accessories</span>
                    <span className="text-white">KES {results.installationCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL (AC SYSTEM)</span>
                    <span className="text-green-400">KES {results.totalCost.toLocaleString()}</span>
                  </div>
                  {config.pumpType.includes('Solar') && (
                    <div className="flex justify-between py-3 text-lg font-bold border-t border-gray-700">
                      <span className="text-yellow-400">TOTAL (SOLAR SYSTEM)</span>
                      <span className="text-yellow-400">KES {(results.totalCost + results.solarTotalCost).toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">📊 MONTHLY OPERATING COST</h4>
                <div className="text-2xl font-bold text-white">
                  KES {results.monthlyElectricityCost.toLocaleString()}/month
                </div>
                <p className="text-gray-400 text-sm">
                  Based on {(results.selectedMotorPower * results.actualOperatingHours * 30).toFixed(0)} kWh @ KES {config.electricityRate}/kWh
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {results.selectedMotorPower} kW | {results.flowRateLimited.toFixed(1)} m³/hr | TDH: {results.totalDynamicHead.toFixed(0)}m
        </div>
        <a 
          href="https://wa.me/254768860665?text=I%20need%20borehole%20pump%20installation"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}
