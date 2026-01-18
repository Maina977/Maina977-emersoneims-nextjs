'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from '../effects/GlassmorphicCard';
import kenyanProducts from '@/app/data/kenyanMarketProducts.json';

interface Appliance {
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
}

const COMMON_APPLIANCES = [
  { name: 'LED Bulb 15W', watts: 15 },
  { name: 'LED Bulb 20W', watts: 20 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Laptop', watts: 65 },
  { name: 'Desktop Computer', watts: 200 },
  { name: 'TV 32"', watts: 60 },
  { name: 'TV 55"', watts: 150 },
  { name: 'Refrigerator (Inverter)', watts: 150 },
  { name: 'Refrigerator (Standard)', watts: 250 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Electric Kettle', watts: 1500 },
  { name: 'Iron Box', watts: 1200 },
  { name: 'Water Pump 0.5HP', watts: 370 },
  { name: 'Water Pump 1HP', watts: 746 },
  { name: 'Air Conditioner 1.0HP', watts: 850 },
  { name: 'Air Conditioner 1.5HP', watts: 1200 },
  { name: 'Air Conditioner 2.0HP', watts: 1600 },
  { name: 'Borehole Pump 3HP', watts: 2238 },
  { name: 'Welding Machine', watts: 3000 },
  { name: 'Deep Freezer', watts: 300 },
  { name: 'Electric Cooker (1 Plate)', watts: 1500 },
  { name: 'Electric Cooker (2 Plates)', watts: 3000 },
];

export default function SolarSystemCalculator() {
  const [step, setStep] = useState(1);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [selectedCounty, setSelectedCounty] = useState('Nairobi');
  const [batteryBackupHours, setBatteryBackupHours] = useState(6);
  const [systemType, setSystemType] = useState<'grid-tie' | 'hybrid' | 'off-grid'>('hybrid');

  const addAppliance = (name: string, watts: number) => {
    const existing = appliances.find(a => a.name === name);
    if (existing) {
      setAppliances(appliances.map(a => 
        a.name === name ? { ...a, quantity: a.quantity + 1 } : a
      ));
    } else {
      setAppliances([...appliances, { name, watts, quantity: 1, hoursPerDay: 6 }]);
    }
  };

  const updateAppliance = (name: string, field: 'quantity' | 'hoursPerDay', value: number) => {
    setAppliances(appliances.map(a =>
      a.name === name ? { ...a, [field]: Math.max(0, value) } : a
    ));
  };

  const removeAppliance = (name: string) => {
    setAppliances(appliances.filter(a => a.name !== name));
  };

  const calculations = useMemo(() => {
    // Get county solar data
    const countyData = kenyanProducts.kenyanCountySolarData.find(c => c.county === selectedCounty);
    const peakSunHours = countyData?.peakSunHours || 5.5;

    // Calculate total daily energy consumption (Wh/day)
    const dailyEnergyWh = appliances.reduce((sum, app) => 
      sum + (app.watts * app.quantity * app.hoursPerDay), 0
    );

    // Calculate peak power requirement (W)
    const peakPowerW = appliances.reduce((sum, app) => 
      sum + (app.watts * app.quantity), 0
    );

    // Solar array sizing (account for losses: 25% derating for dirt, temperature, inverter efficiency)
    const solarArrayKW = (dailyEnergyWh / (peakSunHours * 1000 * 0.75));
    const panelsNeeded = Math.ceil(solarArrayKW * 1000 / 450); // Assuming 450W panels

    // Inverter sizing (20% headroom for surge)
    const inverterKW = (peakPowerW / 1000) * 1.2;

    // Battery sizing (based on backup hours and depth of discharge)
    const batteryKWh = (peakPowerW / 1000) * batteryBackupHours / 0.85; // 85% DoD for LiFePO4

    // System voltage selection (based on power)
    const systemVoltage = inverterKW <= 3 ? 24 : inverterKW <= 7 ? 48 : 96;

    // Product recommendations
    const recommendedPanels = kenyanProducts.solarPanels
      .filter(p => p.power >= 400)
      .sort((a, b) => a.priceKES - b.priceKES)
      .slice(0, 3);

    const recommendedInverters = kenyanProducts.inverters
      .filter(i => i.power >= inverterKW * 1000 && i.inputVoltage === systemVoltage)
      .sort((a, b) => a.priceKES - b.priceKES)
      .slice(0, 3);

    const recommendedBatteries = kenyanProducts.batteries
      .filter(b => b.capacity >= batteryKWh && b.voltage === systemVoltage)
      .sort((a, b) => a.priceKES - b.priceKES)
      .slice(0, 3);

    // Cost calculations
    const panelCost = (recommendedPanels[0]?.priceKES || 18500) * panelsNeeded;
    const inverterCost = recommendedInverters[0]?.priceKES || 200000;
    const batteryCost = recommendedBatteries[0]?.priceKES || 400000;
    const installationCost = (panelCost + inverterCost + batteryCost) * 0.15; // 15% installation
    const totalCost = panelCost + inverterCost + batteryCost + installationCost;

    // ROI Calculations
    const currentGridCostKES = (dailyEnergyWh / 1000) * 30 * 25; // KES 25/kWh average
    const monthlySavings = currentGridCostKES;
    const annualSavings = monthlySavings * 12;
    const paybackYears = totalCost / annualSavings;
    const savings10Years = (annualSavings * 10) - totalCost;

    return {
      dailyEnergyWh,
      dailyEnergyKWh: dailyEnergyWh / 1000,
      peakPowerW,
      peakPowerKW: peakPowerW / 1000,
      solarArrayKW,
      panelsNeeded,
      inverterKW,
      batteryKWh,
      systemVoltage,
      recommendedPanels,
      recommendedInverters,
      recommendedBatteries,
      panelCost,
      inverterCost,
      batteryCost,
      installationCost,
      totalCost,
      monthlySavings,
      annualSavings,
      paybackYears,
      savings10Years,
      peakSunHours,
    };
  }, [appliances, selectedCounty, batteryBackupHours, systemType]);

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
            ☀️ Solar System Designer
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional solar system calculator with real Kenyan market products, accurate sizing, and ROI projections
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: 'Appliances' },
              { num: 2, label: 'Location' },
              { num: 3, label: 'Backup' },
              { num: 4, label: 'Results' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black scale-110'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {s.num}
                </button>
                <span className={`ml-2 font-semibold ${step >= s.num ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {s.label}
                </span>
                {i < 3 && <div className="w-12 h-0.5 mx-4 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Appliances */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-yellow-400">Select Your Appliances</h2>
                
                {/* Quick Add Buttons */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Add Common Appliances:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {COMMON_APPLIANCES.map(app => (
                      <button
                        key={app.name}
                        onClick={() => addAppliance(app.name, app.watts)}
                        className="px-4 py-3 bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 rounded-lg text-left transition-all duration-300"
                      >
                        <div className="font-semibold text-sm">{app.name}</div>
                        <div className="text-xs text-gray-400">{app.watts}W</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Appliances */}
                {appliances.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400">Your Selected Appliances:</h3>
                    <div className="space-y-3">
                      {appliances.map(app => (
                        <div key={app.name} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-semibold">{app.name}</div>
                              <div className="text-sm text-gray-400">{app.watts}W × {app.quantity} = {app.watts * app.quantity}W</div>
                            </div>
                            <button
                              onClick={() => removeAppliance(app.name)}
                              className="px-3 py-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-sm transition-all"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Quantity</label>
                              <input
                                type="number"
                                min="1"
                                value={app.quantity}
                                onChange={(e) => updateAppliance(app.name, 'quantity', Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-400 block mb-1">Hours/Day</label>
                              <input
                                type="number"
                                min="0"
                                max="24"
                                step="0.5"
                                value={app.hoursPerDay}
                                onChange={(e) => updateAppliance(app.name, 'hoursPerDay', Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-yellow-400">{calculations.peakPowerKW.toFixed(2)} kW</div>
                          <div className="text-sm text-gray-300">Peak Power</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-yellow-400">{calculations.dailyEnergyKWh.toFixed(2)} kWh</div>
                          <div className="text-sm text-gray-300">Daily Energy</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={appliances.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Next: Location →
                  </button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-yellow-400">Select Your County</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
                  {kenyanProducts.kenyanCountySolarData.map(county => (
                    <button
                      key={county.county}
                      onClick={() => setSelectedCounty(county.county)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedCounty === county.county
                          ? 'bg-yellow-500/20 border-yellow-500 scale-105'
                          : 'bg-white/5 border-white/10 hover:border-yellow-500/50'
                      }`}
                    >
                      <div className="font-bold text-lg">{county.county}</div>
                      <div className="text-xs text-gray-400 mt-1">{county.irradiance} kWh/m²/day</div>
                      <div className="text-xs text-gray-500">{county.averageTemp}°C avg</div>
                    </button>
                  ))}
                </div>

                {/* Solar Potential */}
                <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Solar Potential in {selectedCounty}</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">{calculations.peakSunHours}</div>
                      <div className="text-sm text-gray-300">Peak Sun Hours</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">{calculations.solarArrayKW.toFixed(2)} kW</div>
                      <div className="text-sm text-gray-300">Solar Array Needed</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">{calculations.panelsNeeded}</div>
                      <div className="text-sm text-gray-300">Solar Panels (450W)</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Next: Backup →
                  </button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* STEP 3: Backup Configuration */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-yellow-400">Battery Backup Configuration</h2>
                
                {/* System Type */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">System Type:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'grid-tie' as const, label: 'Grid Tie', desc: 'No batteries, grid as backup' },
                      { type: 'hybrid' as const, label: 'Hybrid', desc: 'Solar + Battery + Grid' },
                      { type: 'off-grid' as const, label: 'Off-Grid', desc: 'Solar + Battery only' },
                    ].map(sys => (
                      <button
                        key={sys.type}
                        onClick={() => setSystemType(sys.type)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          systemType === sys.type
                            ? 'bg-yellow-500/20 border-yellow-500 scale-105'
                            : 'bg-white/5 border-white/10 hover:border-yellow-500/50'
                        }`}
                      >
                        <div className="font-bold">{sys.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{sys.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Backup Hours Slider */}
                {systemType !== 'grid-tie' && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Backup Hours Required:</h3>
                    <div className="relative">
                      <input
                        type="range"
                        min="2"
                        max="24"
                        step="2"
                        value={batteryBackupHours}
                        onChange={(e) => setBatteryBackupHours(Number(e.target.value))}
                        className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-yellow-400 [&::-webkit-slider-thumb]:to-amber-500"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-400">
                        <span>2 hours</span>
                        <span className="text-2xl font-bold text-yellow-400">{batteryBackupHours} hours</span>
                        <span>24 hours</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Battery Summary */}
                {systemType !== 'grid-tie' && (
                  <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg mb-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">Battery Requirements</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-3xl font-bold text-blue-400">{calculations.batteryKWh.toFixed(1)} kWh</div>
                        <div className="text-sm text-gray-300">Battery Capacity</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-400">{calculations.systemVoltage}V</div>
                        <div className="text-sm text-gray-300">System Voltage</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-blue-400">{batteryBackupHours}h</div>
                        <div className="text-sm text-gray-300">Backup Duration</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Calculate System →
                  </button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* STEP 4: Results */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* System Overview */}
              <GlassmorphicCard intensity="heavy" className="p-8">
                <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Your Custom Solar System
                </h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border border-yellow-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">☀️</div>
                    <div className="text-3xl font-bold text-yellow-400">{calculations.solarArrayKW.toFixed(2)} kW</div>
                    <div className="text-sm text-gray-300 mt-1">Solar Array</div>
                    <div className="text-xs text-gray-400 mt-1">{calculations.panelsNeeded} × 450W panels</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-green-400">{calculations.inverterKW.toFixed(1)} kW</div>
                    <div className="text-sm text-gray-300 mt-1">Inverter</div>
                    <div className="text-xs text-gray-400 mt-1">{calculations.systemVoltage}V {systemType}</div>
                  </div>
                  {systemType !== 'grid-tie' && (
                    <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl text-center">
                      <div className="text-4xl mb-2">🔋</div>
                      <div className="text-3xl font-bold text-blue-400">{calculations.batteryKWh.toFixed(1)} kWh</div>
                      <div className="text-sm text-gray-300 mt-1">Battery Storage</div>
                      <div className="text-xs text-gray-400 mt-1">{batteryBackupHours}h backup</div>
                    </div>
                  )}
                  <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-3xl font-bold text-purple-400">KES {(calculations.totalCost / 1000000).toFixed(2)}M</div>
                    <div className="text-sm text-gray-300 mt-1">Total Investment</div>
                    <div className="text-xs text-gray-400 mt-1">Inc. installation</div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-6">
                  <h3 className="text-xl font-bold mb-4 text-yellow-400">Cost Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Solar Panels ({calculations.panelsNeeded} units)</span>
                      <span className="font-bold text-white">KES {calculations.panelCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Inverter ({calculations.inverterKW.toFixed(1)}kW)</span>
                      <span className="font-bold text-white">KES {calculations.inverterCost.toLocaleString()}</span>
                    </div>
                    {systemType !== 'grid-tie' && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Battery Storage ({calculations.batteryKWh.toFixed(1)}kWh)</span>
                        <span className="font-bold text-white">KES {calculations.batteryCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Installation & Commissioning</span>
                      <span className="font-bold text-white">KES {calculations.installationCost.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/20 my-2" />
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-yellow-400">Total Investment</span>
                      <span className="font-bold text-yellow-400">KES {calculations.totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* ROI Projections */}
                <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-green-400">Return on Investment</h3>
                  <div className="grid md:grid-cols-4 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-green-400">KES {calculations.monthlySavings.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Monthly Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">KES {calculations.annualSavings.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Annual Savings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{calculations.paybackYears.toFixed(1)} years</div>
                      <div className="text-sm text-gray-300">Payback Period</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">KES {(calculations.savings10Years / 1000000).toFixed(2)}M</div>
                      <div className="text-sm text-gray-300">10-Year Savings</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400 text-center">
                    * Based on KES 25/kWh average grid tariff. Actual savings may vary based on your current tariff and usage patterns.
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Recommended Solar Panels */}
              {calculations.recommendedPanels.length > 0 && (
                <GlassmorphicCard intensity="medium" className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-yellow-400">☀️ Recommended Solar Panels</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {calculations.recommendedPanels.map((panel, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 hover:border-yellow-500/50 rounded-xl transition-all duration-300 hover:scale-105">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-lg text-yellow-400">{panel.brand}</div>
                            <div className="text-sm text-gray-400">{panel.model}</div>
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">BEST VALUE</span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power:</span>
                            <span className="font-semibold text-white">{panel.power}W</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="font-semibold text-white">{panel.efficiency}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Warranty:</span>
                            <span className="font-semibold text-white">{panel.warranty.performance} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price/unit:</span>
                            <span className="font-semibold text-white">KES {panel.priceKES.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Total ({calculations.panelsNeeded} units):</span>
                            <span className="font-bold text-yellow-400">KES {(panel.priceKES * calculations.panelsNeeded).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          <div><strong>Available from:</strong> EmersonEIMS</div>
                          <div><strong>Contact:</strong> +254768860665 | +254782914717</div>
                          <div><strong>Status:</strong> <span className="text-green-400">{panel.availability}</span></div>
                        </div>
                        <button className="w-full py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg font-semibold transition-all">
                          Select This Panel
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              )}

              {/* Recommended Inverters */}
              {calculations.recommendedInverters.length > 0 && (
                <GlassmorphicCard intensity="medium" className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-green-400">⚡ Recommended Inverters</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {calculations.recommendedInverters.map((inverter, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 hover:border-green-500/50 rounded-xl transition-all duration-300 hover:scale-105">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-lg text-green-400">{inverter.brand}</div>
                            <div className="text-sm text-gray-400">{inverter.model}</div>
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">RECOMMENDED</span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power:</span>
                            <span className="font-semibold text-white">{(inverter.power / 1000).toFixed(1)}kW</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Type:</span>
                            <span className="font-semibold text-white">{inverter.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Efficiency:</span>
                            <span className="font-semibold text-white">{inverter.efficiency}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Voltage:</span>
                            <span className="font-semibold text-white">{inverter.inputVoltage}V DC</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Warranty:</span>
                            <span className="font-semibold text-white">{inverter.warranty} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price:</span>
                            <span className="font-bold text-green-400">KES {inverter.priceKES.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          <div><strong>Features:</strong> {inverter.features.slice(0, 3).join(', ')}</div>
                          <div className="mt-1"><strong>Available from:</strong> EmersonEIMS | +254768860665</div>
                          <div><strong>Status:</strong> <span className="text-green-400">{inverter.availability}</span></div>
                        </div>
                        <button className="w-full py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg font-semibold transition-all">
                          Select This Inverter
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              )}

              {/* Recommended Batteries */}
              {systemType !== 'grid-tie' && calculations.recommendedBatteries.length > 0 && (
                <GlassmorphicCard intensity="medium" className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400">🔋 Recommended Battery Systems</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {calculations.recommendedBatteries.map((battery, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all duration-300 hover:scale-105">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-lg text-blue-400">{battery.brand}</div>
                            <div className="text-sm text-gray-400">{battery.model}</div>
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">TOP PICK</span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Capacity:</span>
                            <span className="font-semibold text-white">{battery.capacity}kWh</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Chemistry:</span>
                            <span className="font-semibold text-white">{battery.chemistry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Cycles:</span>
                            <span className="font-semibold text-white">{battery.cycles.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">DoD:</span>
                            <span className="font-semibold text-white">{battery.dod}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Warranty:</span>
                            <span className="font-semibold text-white">{battery.warranty} years</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Price:</span>
                            <span className="font-bold text-blue-400">KES {battery.priceKES.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          <div><strong>Features:</strong> {battery.features.slice(0, 3).join(', ')}</div>
                          <div className="mt-1"><strong>Available from:</strong> EmersonEIMS | +254768860665</div>
                          <div><strong>Status:</strong> <span className="text-green-400">{battery.availability}</span></div>
                        </div>
                        <button className="w-full py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg font-semibold transition-all">
                          Select This Battery
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              )}

              {/* CTA Buttons */}
              <GlassmorphicCard intensity="heavy" className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">Ready to Go Solar?</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <a href="/contact?type=solar-quote" className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-green-500/50 text-center">
                    📞 Request Quote
                  </a>
                  <a href="/contact?type=site-visit&service=solar" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-blue-500/50 text-center">
                    📅 Schedule Site Visit
                  </a>
                  <a href="/contact?type=pdf-report&service=solar" className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/50 text-center">
                    📄 Download PDF Report
                  </a>
                </div>
                <div className="mt-6 text-center text-gray-400 text-sm">
                  <p>💚 Financing available from 20% deposit | 🛡️ 25-year performance warranty | ⚡ Professional installation by certified engineers</p>
                </div>
              </GlassmorphicCard>

              {/* Start Over Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setAppliances([]);
                  }}
                  className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all"
                >
                  ← Start New Calculation
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
