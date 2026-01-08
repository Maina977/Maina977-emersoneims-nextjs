'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassmorphicCard from '../effects/GlassmorphicCard';
import kenyanProducts from '@/app/data/kenyanMarketProducts.json';

interface Load {
  name: string;
  runningWatts: number;
  startingWatts: number;
  quantity: number;
  hoursPerDay: number;
}

const COMMON_LOADS = [
  { name: 'Lights (LED 20W)', running: 20, starting: 25 },
  { name: 'Ceiling Fan', running: 75, starting: 150 },
  { name: 'Desktop Computer', running: 200, starting: 400 },
  { name: 'Laptop', running: 65, starting: 80 },
  { name: 'TV 32"', running: 60, starting: 100 },
  { name: 'TV 55"', running: 150, starting: 250 },
  { name: 'Refrigerator (Standard)', running: 250, starting: 750 },
  { name: 'Refrigerator (Inverter)', running: 150, starting: 300 },
  { name: 'Deep Freezer', running: 300, starting: 900 },
  { name: 'Microwave 1000W', running: 1000, starting: 1500 },
  { name: 'Electric Kettle', running: 1500, starting: 1800 },
  { name: 'Iron Box', running: 1200, starting: 1500 },
  { name: 'Washing Machine', running: 500, starting: 1500 },
  { name: 'Water Pump 0.5HP', running: 370, starting: 1110 },
  { name: 'Water Pump 1HP', running: 746, starting: 2238 },
  { name: 'Water Pump 2HP', running: 1492, starting: 4476 },
  { name: 'AC 1.0HP Split', running: 850, starting: 2550 },
  { name: 'AC 1.5HP Split', running: 1200, starting: 3600 },
  { name: 'AC 2.0HP Split', running: 1600, starting: 4800 },
  { name: 'Borehole Pump 3HP', running: 2238, starting: 6714 },
  { name: 'Borehole Pump 5HP', running: 3730, starting: 11190 },
  { name: 'Welding Machine 200A', running: 3000, starting: 6000 },
  { name: 'Compressor 2HP', running: 1492, starting: 4476 },
  { name: 'Electric Cooker (2 Plates)', running: 3000, starting: 3500 },
];

export default function GeneratorSizingCalculator() {
  const [step, setStep] = useState(1);
  const [loads, setLoads] = useState<Load[]>([]);
  const [usageType, setUsageType] = useState<'home' | 'business' | 'industrial'>('home');
  const [runHours, setRunHours] = useState(8);
  const [fuelPriceKES, setFuelPriceKES] = useState(180);
  const [needsCanopy, setNeedsCanopy] = useState(true);
  const [needsATS, setNeedsATS] = useState(false);

  const addLoad = (name: string, running: number, starting: number) => {
    const existing = loads.find(l => l.name === name);
    if (existing) {
      setLoads(loads.map(l => 
        l.name === name ? { ...l, quantity: l.quantity + 1 } : l
      ));
    } else {
      setLoads([...loads, { name, runningWatts: running, startingWatts: starting, quantity: 1, hoursPerDay: runHours }]);
    }
  };

  const updateLoad = (name: string, field: 'quantity' | 'hoursPerDay', value: number) => {
    setLoads(loads.map(l =>
      l.name === name ? { ...l, [field]: Math.max(0, value) } : l
    ));
  };

  const removeLoad = (name: string) => {
    setLoads(loads.filter(l => l.name !== name));
  };

  const calculations = useMemo(() => {
    // Calculate total running watts
    const totalRunningW = loads.reduce((sum, load) => 
      sum + (load.runningWatts * load.quantity), 0
    );

    // Calculate total starting watts (highest motor start + all continuous loads)
    const motorLoads = loads.map(l => l.startingWatts * l.quantity).sort((a, b) => b - a);
    const largestMotorStart = motorLoads[0] || 0;
    const otherLoads = totalRunningW - (motorLoads[0] || 0);
    const totalStartingW = largestMotorStart + otherLoads;

    // Generator sizing with 25% safety margin
    const requiredKW = Math.max(totalRunningW, totalStartingW) / 1000;
    const recommendedKVA = Math.ceil((requiredKW * 1.25) / 5) * 5; // Round up to nearest 5 kVA

    // Fuel consumption estimation (based on load percentage)
    const loadPercentage = (requiredKW / recommendedKVA) * 100;
    const fuelConsumptionLPH = recommendedKVA <= 50 
      ? (0.25 * recommendedKVA * (loadPercentage / 100)) + 1
      : (0.22 * recommendedKVA * (loadPercentage / 100)) + 2;

    const dailyFuelL = fuelConsumptionLPH * runHours;
    const monthlyFuelL = dailyFuelL * 30;
    const dailyFuelCostKES = dailyFuelL * fuelPriceKES;
    const monthlyFuelCostKES = monthlyFuelL * fuelPriceKES;
    const annualFuelCostKES = monthlyFuelCostKES * 12;

    // Product recommendations
    const recommendedGenerators = kenyanProducts.generators
      .filter(g => g.power >= recommendedKVA && g.power <= recommendedKVA * 1.3)
      .sort((a, b) => a.priceKES - b.priceKES)
      .slice(0, 3);

    const recommendedCanopies = needsCanopy 
      ? kenyanProducts.canopyAccessories
          .filter(c => {
            const range = c.suitableFor.split('-').map(x => parseInt(x.replace('kVA', '')));
            return recommendedKVA >= range[0] && recommendedKVA <= range[1];
          })
          .sort((a, b) => b.soundReduction.split('-')[1].localeCompare(a.soundReduction.split('-')[1]))
      : [];

    // Cost summary
    const generatorCost = recommendedGenerators[0]?.priceKES || 2000000;
    const canopyCost = needsCanopy ? (recommendedGenerators[0]?.canopyPrice || 250000) : 0;
    const atsCost = needsATS ? 185000 : 0;
    const installationCost = (generatorCost + canopyCost + atsCost) * 0.10; // 10% installation
    const totalInvestment = generatorCost + canopyCost + atsCost + installationCost;

    // Maintenance schedule
    const maintenanceSchedule = [
      { interval: 'Daily', task: 'Check oil level, coolant level, fuel level', cost: 0 },
      { interval: '50 hours', task: 'Engine oil change', cost: 8500 },
      { interval: '200 hours', task: 'Oil & fuel filter replacement', cost: 15000 },
      { interval: '400 hours', task: 'Air filter, oil change, coolant top-up', cost: 22000 },
      { interval: '800 hours', task: 'Major service - all filters, belts, coolant flush', cost: 45000 },
      { interval: 'Annual', task: 'Load bank test, battery check, governor calibration', cost: 35000 },
    ];

    return {
      totalRunningW,
      totalRunningKW: totalRunningW / 1000,
      totalStartingW,
      totalStartingKW: totalStartingW / 1000,
      requiredKW,
      recommendedKVA,
      loadPercentage,
      fuelConsumptionLPH,
      dailyFuelL,
      monthlyFuelL,
      dailyFuelCostKES,
      monthlyFuelCostKES,
      annualFuelCostKES,
      recommendedGenerators,
      recommendedCanopies,
      generatorCost,
      canopyCost,
      atsCost,
      installationCost,
      totalInvestment,
      maintenanceSchedule,
    };
  }, [loads, runHours, fuelPriceKES, needsCanopy, needsATS]);

  return (
    <div className="min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
            ⚡ Generator Sizing Calculator
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Professional generator sizing with accurate load calculation, fuel costs, and real Kenyan market products
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[
              { num: 1, label: 'Loads' },
              { num: 2, label: 'Usage' },
              { num: 3, label: 'Options' },
              { num: 4, label: 'Results' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => setStep(s.num)}
                  className={`w-12 h-12 rounded-full font-bold transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-gradient-to-r from-orange-400 to-red-500 text-black scale-110'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {s.num}
                </button>
                <span className={`ml-2 font-semibold ${step >= s.num ? 'text-orange-400' : 'text-gray-500'}`}>
                  {s.label}
                </span>
                {i < 3 && <div className="w-12 h-0.5 mx-4 bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Load Selection */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-orange-400">Select Your Electrical Loads</h2>
                
                {/* Quick Add Buttons */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Quick Add Common Loads:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {COMMON_LOADS.map(load => (
                      <button
                        key={load.name}
                        onClick={() => addLoad(load.name, load.running, load.starting)}
                        className="px-4 py-3 bg-white/5 hover:bg-orange-500/20 border border-white/10 hover:border-orange-500/50 rounded-lg text-left transition-all duration-300"
                      >
                        <div className="font-semibold text-sm">{load.name}</div>
                        <div className="text-xs text-gray-400">Run: {load.running}W</div>
                        <div className="text-xs text-gray-500">Start: {load.starting}W</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Loads */}
                {loads.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-orange-400">Your Selected Loads:</h3>
                    <div className="space-y-3">
                      {loads.map(load => (
                        <div key={load.name} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-semibold">{load.name}</div>
                              <div className="text-sm text-gray-400">
                                Running: {load.runningWatts * load.quantity}W | Starting: {load.startingWatts * load.quantity}W
                              </div>
                            </div>
                            <button
                              onClick={() => removeLoad(load.name)}
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
                                value={load.quantity}
                                onChange={(e) => updateLoad(load.name, 'quantity', Number(e.target.value))}
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
                                value={load.hoursPerDay}
                                onChange={(e) => updateLoad(load.name, 'hoursPerDay', Number(e.target.value))}
                                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-3xl font-bold text-orange-400">{calculations.totalRunningKW.toFixed(2)} kW</div>
                          <div className="text-sm text-gray-300">Running Load</div>
                        </div>
                        <div>
                          <div className="text-3xl font-bold text-red-400">{calculations.totalStartingKW.toFixed(2)} kW</div>
                          <div className="text-sm text-gray-300">Starting Load</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    disabled={loads.length === 0}
                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                  >
                    Next: Usage Pattern →
                  </button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* STEP 2: Usage Pattern */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-orange-400">Usage Pattern & Fuel Cost</h2>
                
                {/* Usage Type */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Application Type:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'home' as const, label: 'Home/Residential', desc: 'Backup power for homes' },
                      { type: 'business' as const, label: 'Business/Office', desc: 'Commercial operations' },
                      { type: 'industrial' as const, label: 'Industrial', desc: 'Heavy-duty applications' },
                    ].map(app => (
                      <button
                        key={app.type}
                        onClick={() => setUsageType(app.type)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          usageType === app.type
                            ? 'bg-orange-500/20 border-orange-500 scale-105'
                            : 'bg-white/5 border-white/10 hover:border-orange-500/50'
                        }`}
                      >
                        <div className="font-bold">{app.label}</div>
                        <div className="text-xs text-gray-400 mt-1">{app.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Run Hours Slider */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Average Daily Runtime:</h3>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="24"
                      step="1"
                      value={runHours}
                      onChange={(e) => setRunHours(Number(e.target.value))}
                      className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-orange-400 [&::-webkit-slider-thumb]:to-red-500"
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                      <span>1 hour</span>
                      <span className="text-2xl font-bold text-orange-400">{runHours} hours/day</span>
                      <span>24 hours</span>
                    </div>
                  </div>
                </div>

                {/* Fuel Price */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-300">Current Diesel Price (KES/Liter):</h3>
                  <input
                    type="number"
                    min="100"
                    max="300"
                    step="5"
                    value={fuelPriceKES}
                    onChange={(e) => setFuelPriceKES(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-2xl font-bold text-center"
                  />
                  <div className="text-sm text-gray-400 text-center mt-2">Current market average: KES 175-185/L</div>
                </div>

                {/* Fuel Cost Estimate */}
                <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-4 text-orange-400">Estimated Fuel Costs</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-orange-400">KES {calculations.dailyFuelCostKES.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Daily Cost</div>
                      <div className="text-xs text-gray-500">{calculations.dailyFuelL.toFixed(1)}L</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">KES {calculations.monthlyFuelCostKES.toLocaleString()}</div>
                      <div className="text-sm text-gray-300">Monthly Cost</div>
                      <div className="text-xs text-gray-500">{calculations.monthlyFuelL.toFixed(0)}L</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-400">KES {(calculations.annualFuelCostKES / 1000000).toFixed(2)}M</div>
                      <div className="text-sm text-gray-300">Annual Cost</div>
                      <div className="text-xs text-gray-500">{(calculations.monthlyFuelL * 12).toFixed(0)}L</div>
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
                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    Next: Options →
                  </button>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* STEP 3: Options */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <GlassmorphicCard intensity="medium" className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-orange-400">Additional Options</h2>
                
                {/* Canopy Option */}
                <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">🔇 Sound Attenuated Canopy</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Reduces noise by 15-30 dB, protects from weather, improves aesthetics
                      </p>
                      <div className="text-sm text-gray-500">
                        Recommended for residential areas and noise-sensitive environments
                      </div>
                    </div>
                    <button
                      onClick={() => setNeedsCanopy(!needsCanopy)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        needsCanopy
                          ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                          : 'bg-white/5 text-gray-400 border-2 border-white/10'
                      }`}
                    >
                      {needsCanopy ? '✓ Included' : 'Add'}
                    </button>
                  </div>
                  {needsCanopy && (
                    <div className="text-sm text-green-400">
                      + KES {calculations.canopyCost.toLocaleString()} added to total cost
                    </div>
                  )}
                </div>

                {/* ATS Option */}
                <div className="mb-6 p-6 bg-white/5 border border-white/10 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">🔄 Automatic Transfer Switch (ATS)</h3>
                      <p className="text-gray-400 text-sm mb-2">
                        Automatic switching between grid and generator power (10-15 sec transfer time)
                      </p>
                      <div className="text-sm text-gray-500">
                        Essential for critical loads - hospitals, data centers, businesses
                      </div>
                    </div>
                    <button
                      onClick={() => setNeedsATS(!needsATS)}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                        needsATS
                          ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                          : 'bg-white/5 text-gray-400 border-2 border-white/10'
                      }`}
                    >
                      {needsATS ? '✓ Included' : 'Add'}
                    </button>
                  </div>
                  {needsATS && (
                    <div className="text-sm text-green-400">
                      + KES {calculations.atsCost.toLocaleString()} added to total cost
                    </div>
                  )}
                </div>

                {/* Generator Size Recommendation */}
                <div className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-lg mb-6">
                  <h3 className="text-xl font-bold mb-4 text-orange-400">Recommended Generator Size</h3>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-orange-400 mb-2">{calculations.recommendedKVA} kVA</div>
                    <div className="text-gray-300 mb-4">
                      Based on {calculations.totalStartingKW.toFixed(2)}kW peak load + 25% safety margin
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-gray-400">Load Factor</div>
                        <div className="text-xl font-bold text-white">{calculations.loadPercentage.toFixed(0)}%</div>
                      </div>
                      <div className="p-3 bg-white/5 rounded-lg">
                        <div className="text-gray-400">Fuel Efficiency</div>
                        <div className="text-xl font-bold text-white">{calculations.fuelConsumptionLPH.toFixed(1)} L/h</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    className="px-8 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold rounded-full hover:scale-105 transition-transform"
                  >
                    View Recommendations →
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
                <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 bg-clip-text text-transparent">
                  Your Custom Generator Solution
                </h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">⚡</div>
                    <div className="text-3xl font-bold text-orange-400">{calculations.recommendedKVA} kVA</div>
                    <div className="text-sm text-gray-300 mt-1">Generator Size</div>
                    <div className="text-xs text-gray-400 mt-1">{calculations.loadPercentage.toFixed(0)}% loaded</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">⛽</div>
                    <div className="text-3xl font-bold text-blue-400">{calculations.fuelConsumptionLPH.toFixed(1)} L/h</div>
                    <div className="text-sm text-gray-300 mt-1">Fuel Consumption</div>
                    <div className="text-xs text-gray-400 mt-1">At {calculations.loadPercentage.toFixed(0)}% load</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">💰</div>
                    <div className="text-3xl font-bold text-green-400">KES {(calculations.monthlyFuelCostKES / 1000).toFixed(0)}K</div>
                    <div className="text-sm text-gray-300 mt-1">Monthly Fuel Cost</div>
                    <div className="text-xs text-gray-400 mt-1">{runHours}h/day usage</div>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl text-center">
                    <div className="text-4xl mb-2">🔧</div>
                    <div className="text-3xl font-bold text-purple-400">KES {(calculations.totalInvestment / 1000000).toFixed(2)}M</div>
                    <div className="text-sm text-gray-300 mt-1">Total Investment</div>
                    <div className="text-xs text-gray-400 mt-1">Turn-key solution</div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl mb-6">
                  <h3 className="text-xl font-bold mb-4 text-orange-400">Investment Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Generator Unit ({calculations.recommendedKVA}kVA)</span>
                      <span className="font-bold text-white">KES {calculations.generatorCost.toLocaleString()}</span>
                    </div>
                    {needsCanopy && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Sound Attenuated Canopy</span>
                        <span className="font-bold text-white">KES {calculations.canopyCost.toLocaleString()}</span>
                      </div>
                    )}
                    {needsATS && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Automatic Transfer Switch (ATS)</span>
                        <span className="font-bold text-white">KES {calculations.atsCost.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Installation & Commissioning</span>
                      <span className="font-bold text-white">KES {calculations.installationCost.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/20 my-2" />
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold text-orange-400">Total Investment</span>
                      <span className="font-bold text-orange-400">KES {calculations.totalInvestment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Operating Costs */}
                <div className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl">
                  <h3 className="text-xl font-bold mb-4 text-blue-400">Annual Operating Costs (Estimated)</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="text-2xl font-bold text-blue-400">KES {(calculations.annualFuelCostKES / 1000000).toFixed(2)}M</div>
                      <div className="text-sm text-gray-300">Fuel Cost</div>
                      <div className="text-xs text-gray-500">{runHours}h/day × 365 days</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">KES 125K</div>
                      <div className="text-sm text-gray-300">Maintenance</div>
                      <div className="text-xs text-gray-500">Regular servicing</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-400">KES {((calculations.annualFuelCostKES + 125000) / 1000000).toFixed(2)}M</div>
                      <div className="text-sm text-gray-300">Total Operating Cost</div>
                      <div className="text-xs text-gray-500">Per year</div>
                    </div>
                  </div>
                </div>
              </GlassmorphicCard>

              {/* Recommended Generators */}
              {calculations.recommendedGenerators.length > 0 && (
                <GlassmorphicCard intensity="medium" className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-orange-400">⚡ Recommended Generators</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {calculations.recommendedGenerators.map((gen, i) => (
                      <div key={i} className="p-6 bg-white/5 border border-white/10 hover:border-orange-500/50 rounded-xl transition-all duration-300 hover:scale-105">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="font-bold text-lg text-orange-400">{gen.brand}</div>
                            <div className="text-sm text-gray-400">{gen.model}</div>
                          </div>
                          {i === 0 && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">BEST VALUE</span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm mb-4">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Power:</span>
                            <span className="font-semibold text-white">{gen.power}kVA / {gen.powerKW}kW</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Engine:</span>
                            <span className="font-semibold text-white">{gen.engine}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Fuel Tank:</span>
                            <span className="font-semibold text-white">{gen.tankCapacity}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Runtime (75%):</span>
                            <span className="font-semibold text-white">{gen.runtime['75%']}h</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Noise (Canopy):</span>
                            <span className="font-semibold text-white">{gen.soundLevelCanopy} dB(A)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Generator:</span>
                            <span className="font-bold text-orange-400">KES {gen.priceKES.toLocaleString()}</span>
                          </div>
                          {needsCanopy && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">+ Canopy:</span>
                              <span className="font-bold text-orange-400">KES {gen.canopyPrice.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          <div><strong>Available from:</strong> EmersonEIMS</div>
                          <div><strong>Contact:</strong> +254768860665 | +254782914717</div>
                          <div><strong>Status:</strong> <span className="text-green-400">{gen.availability}</span></div>
                          <div><strong>Lead Time:</strong> {gen.leadTime}</div>
                        </div>
                        <button className="w-full py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 rounded-lg font-semibold transition-all">
                          Select This Generator
                        </button>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              )}

              {/* Maintenance Schedule */}
              <GlassmorphicCard intensity="medium" className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-blue-400">🔧 Maintenance Schedule</h3>
                <div className="space-y-3">
                  {calculations.maintenanceSchedule.map((item, i) => (
                    <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center">
                      <div className="flex-1">
                        <div className="font-bold text-white">{item.interval}</div>
                        <div className="text-sm text-gray-400">{item.task}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-400">
                          {item.cost === 0 ? 'Free' : `KES ${item.cost.toLocaleString()}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="text-sm text-gray-400 mb-2">
                    📋 <strong>Annual maintenance cost:</strong> Approximately KES 125,000 - 150,000 depending on usage
                  </div>
                  <div className="text-sm text-gray-400">
                    💡 <strong>Tip:</strong> Regular maintenance extends generator life from 15,000h to 25,000+ hours
                  </div>
                </div>
              </GlassmorphicCard>

              {/* CTA Buttons */}
              <GlassmorphicCard intensity="heavy" className="p-8">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">Get Your Generator Installed</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-green-500/50">
                    📞 Request Quote
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-orange-500/50">
                    📅 Schedule Site Survey
                  </button>
                  <button className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full hover:scale-105 transition-transform shadow-lg shadow-purple-500/50">
                    📄 Download Full Report
                  </button>
                </div>
                <div className="mt-6 text-center text-gray-400 text-sm">
                  <p>⚡ Installation within 5-10 days | 🛡️ 2-year warranty | 🔧 24/7 emergency support | 📱 Free load bank testing</p>
                </div>
              </GlassmorphicCard>

              {/* Start Over Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setStep(1);
                    setLoads([]);
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
