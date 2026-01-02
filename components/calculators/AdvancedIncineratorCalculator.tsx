'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// =====================================================
// ADVANCED HOSPITAL INCINERATOR CALCULATOR
// =====================================================

const WASTE_CATEGORIES = [
  { category: 'General Healthcare Waste', heatValue: 15, priceMultiplier: 1.0, description: 'Non-hazardous medical waste' },
  { category: 'Infectious Waste', heatValue: 18, priceMultiplier: 1.2, description: 'Blood, cultures, sharps' },
  { category: 'Pathological Waste', heatValue: 20, priceMultiplier: 1.5, description: 'Body parts, organs, tissues' },
  { category: 'Pharmaceutical Waste', heatValue: 25, priceMultiplier: 1.3, description: 'Expired drugs, cytotoxic' },
  { category: 'Chemical Waste', heatValue: 30, priceMultiplier: 1.8, description: 'Lab chemicals, disinfectants' },
  { category: 'Radioactive Waste', heatValue: 15, priceMultiplier: 3.0, description: 'Low-level radioactive materials' },
];

const INCINERATOR_TYPES = [
  { type: 'Single Chamber', minCapacity: 10, maxCapacity: 50, efficiency: 0.85, pricePerKg: 3500 },
  { type: 'Dual Chamber', minCapacity: 20, maxCapacity: 200, efficiency: 0.95, pricePerKg: 4500 },
  { type: 'Rotary Kiln', minCapacity: 100, maxCapacity: 500, efficiency: 0.98, pricePerKg: 6000 },
  { type: 'Pyrolytic', minCapacity: 50, maxCapacity: 300, efficiency: 0.96, pricePerKg: 5500 },
];

const FUEL_TYPES = [
  { fuel: 'Diesel', heatValue: 45, price: 180, unit: 'L' },
  { fuel: 'LPG', heatValue: 50, price: 150, unit: 'kg' },
  { fuel: 'Natural Gas', heatValue: 55, price: 100, unit: 'm³' },
  { fuel: 'Electricity', heatValue: 0, price: 25, unit: 'kWh' },
];

const EMISSION_STANDARDS = [
  { standard: 'NEMA Kenya', particulate: 100, co: 100, nox: 400, sox: 200 },
  { standard: 'EU Standard', particulate: 10, co: 50, nox: 200, sox: 50 },
  { standard: 'WHO Guidelines', particulate: 30, co: 75, nox: 300, sox: 100 },
];

const HOSPITAL_SIZES = [
  { beds: 50, dailyWaste: 25, category: 'Small Clinic' },
  { beds: 100, dailyWaste: 60, category: 'Health Center' },
  { beds: 200, dailyWaste: 140, category: 'District Hospital' },
  { beds: 500, dailyWaste: 400, category: 'Regional Hospital' },
  { beds: 1000, dailyWaste: 900, category: 'National/Teaching Hospital' },
];

export default function AdvancedIncineratorCalculator() {
  const [activeTab, setActiveTab] = useState<'waste' | 'sizing' | 'emissions' | 'cost'>('waste');
  
  const [wasteProfile, setWasteProfile] = useState({
    hospitalBeds: 100,
    wastePerBed: 0.6, // kg per bed per day
    infectiousPercent: 25,
    pathologicalPercent: 5,
    pharmaceuticalPercent: 5,
    chemicalPercent: 3,
    generalPercent: 62,
    operatingDays: 7, // days per week
    operatingHours: 8, // hours per day
  });

  const [systemConfig, setSystemConfig] = useState({
    incineratorType: 'Dual Chamber',
    fuelType: 'Diesel',
    emissionStandard: 'NEMA Kenya',
    safetyFactor: 1.3,
    primaryTemp: 850, // °C
    secondaryTemp: 1100, // °C
    residenceTime: 2, // seconds
    hasAPC: true, // Air pollution control
    hasWHR: false, // Waste heat recovery
    hasContinuousMonitoring: false,
  });

  const results = useMemo(() => {
    // Calculate daily waste generation
    const totalDailyWaste = wasteProfile.hospitalBeds * wasteProfile.wastePerBed;
    
    // Waste composition breakdown
    const infectiousWaste = totalDailyWaste * (wasteProfile.infectiousPercent / 100);
    const pathologicalWaste = totalDailyWaste * (wasteProfile.pathologicalPercent / 100);
    const pharmaceuticalWaste = totalDailyWaste * (wasteProfile.pharmaceuticalPercent / 100);
    const chemicalWaste = totalDailyWaste * (wasteProfile.chemicalPercent / 100);
    const generalWaste = totalDailyWaste * (wasteProfile.generalPercent / 100);
    
    // Calculate weighted heat value
    const weightedHeatValue = 
      (infectiousWaste * 18 + pathologicalWaste * 20 + pharmaceuticalWaste * 25 + 
       chemicalWaste * 30 + generalWaste * 15) / totalDailyWaste;
    
    // Calculate hourly capacity needed
    const hourlyCapacity = (totalDailyWaste * systemConfig.safetyFactor) / wasteProfile.operatingHours;
    
    // Select incinerator type
    const incineratorData = INCINERATOR_TYPES.find(i => i.type === systemConfig.incineratorType) || INCINERATOR_TYPES[1];
    
    // Calculate actual capacity (round up to standard sizes)
    const standardCapacities = [10, 15, 20, 25, 30, 40, 50, 75, 100, 150, 200, 300, 500];
    const selectedCapacity = standardCapacities.find(c => c >= hourlyCapacity) || standardCapacities[standardCapacities.length - 1];
    
    // Fuel consumption
    const fuelData = FUEL_TYPES.find(f => f.fuel === systemConfig.fuelType) || FUEL_TYPES[0];
    const heatRequired = totalDailyWaste * weightedHeatValue * 1000 / incineratorData.efficiency; // kJ
    let fuelConsumption = 0;
    
    if (fuelData.fuel === 'Electricity') {
      // Electric heating
      fuelConsumption = heatRequired / 3600; // kWh
    } else {
      fuelConsumption = heatRequired / (fuelData.heatValue * 1000); // L or kg or m³
    }
    
    // Emission calculations (mg/Nm³)
    const emissionData = EMISSION_STANDARDS.find(e => e.standard === systemConfig.emissionStandard) || EMISSION_STANDARDS[0];
    const flueGasVolume = totalDailyWaste * 6; // Nm³ per kg waste
    
    // Ash generation (5-10% of input)
    const ashGeneration = totalDailyWaste * 0.07;
    
    // Capital cost
    const incineratorCost = selectedCapacity * incineratorData.pricePerKg * 1000;
    const apcCost = systemConfig.hasAPC ? incineratorCost * 0.3 : 0;
    const whrCost = systemConfig.hasWHR ? incineratorCost * 0.15 : 0;
    const monitoringCost = systemConfig.hasContinuousMonitoring ? 2000000 : 0;
    const installationCost = (incineratorCost + apcCost + whrCost) * 0.2;
    const civilWorksCost = incineratorCost * 0.15;
    
    const totalCapitalCost = incineratorCost + apcCost + whrCost + monitoringCost + installationCost + civilWorksCost;
    
    // Operating cost
    const dailyFuelCost = fuelConsumption * fuelData.price;
    const monthlyFuelCost = dailyFuelCost * wasteProfile.operatingDays * 4.33;
    const monthlyLaborCost = 80000; // 2 operators
    const monthlyMaintenanceCost = incineratorCost * 0.002; // 0.2% of capital monthly
    const monthlyAshDisposal = ashGeneration * 30 * 100; // KES 100 per kg
    
    const monthlyOperatingCost = monthlyFuelCost + monthlyLaborCost + monthlyMaintenanceCost + monthlyAshDisposal;
    
    // Cost per kg waste
    const costPerKgWaste = (monthlyOperatingCost / (totalDailyWaste * wasteProfile.operatingDays * 4.33));
    
    return {
      totalDailyWaste,
      wasteBreakdown: {
        infectious: infectiousWaste,
        pathological: pathologicalWaste,
        pharmaceutical: pharmaceuticalWaste,
        chemical: chemicalWaste,
        general: generalWaste,
      },
      weightedHeatValue,
      hourlyCapacity,
      selectedCapacity,
      incineratorData,
      fuelConsumption,
      fuelData,
      ashGeneration,
      flueGasVolume,
      emissionData,
      incineratorCost,
      apcCost,
      whrCost,
      totalCapitalCost,
      dailyFuelCost,
      monthlyFuelCost,
      monthlyOperatingCost,
      costPerKgWaste,
    };
  }, [wasteProfile, systemConfig]);

  return (
    <div className="bg-gray-900 rounded-xl border border-red-500/30 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 p-4 border-b border-red-500/30">
        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
          <span>🔥</span> Hospital Incinerator Calculator
        </h3>
        <p className="text-gray-400 text-sm mt-1">
          Medical waste management system design with emissions compliance
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'waste', label: '🏥 Waste Profile' },
          { id: 'sizing', label: '🔥 Sizing' },
          { id: 'emissions', label: '💨 Emissions' },
          { id: 'cost', label: '💰 Costs' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-400 border-b-2 border-red-500'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'waste' && (
            <motion.div
              key="waste"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Quick Select Hospital Size */}
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-gray-400 mb-3">Quick Select Hospital Size</h4>
                <div className="flex flex-wrap gap-2">
                  {HOSPITAL_SIZES.map(h => (
                    <button
                      key={h.beds}
                      onClick={() => setWasteProfile({...wasteProfile, hospitalBeds: h.beds, wastePerBed: h.dailyWaste / h.beds})}
                      className={`px-3 py-1 text-xs rounded transition-colors ${
                        wasteProfile.hospitalBeds === h.beds 
                          ? 'bg-red-600 text-white' 
                          : 'bg-gray-700 hover:bg-red-600 text-gray-300 hover:text-white'
                      }`}
                    >
                      {h.category} ({h.beds} beds)
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Hospital Beds</label>
                  <input
                    type="number"
                    value={wasteProfile.hospitalBeds}
                    onChange={(e) => setWasteProfile({...wasteProfile, hospitalBeds: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Waste per Bed (kg/day)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={wasteProfile.wastePerBed}
                    onChange={(e) => setWasteProfile({...wasteProfile, wastePerBed: parseFloat(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Operating Days/Week</label>
                  <select
                    value={wasteProfile.operatingDays}
                    onChange={(e) => setWasteProfile({...wasteProfile, operatingDays: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[5, 6, 7].map(d => (
                      <option key={d} value={d}>{d} days</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Operating Hours/Day</label>
                  <select
                    value={wasteProfile.operatingHours}
                    onChange={(e) => setWasteProfile({...wasteProfile, operatingHours: parseInt(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[4, 6, 8, 10, 12, 16, 24].map(h => (
                      <option key={h} value={h}>{h} hours</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-yellow-400 mb-3">⚠️ WASTE COMPOSITION (%)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">General</label>
                    <input
                      type="number"
                      value={wasteProfile.generalPercent}
                      onChange={(e) => setWasteProfile({...wasteProfile, generalPercent: parseInt(e.target.value) || 0})}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-red-400 block mb-1">Infectious</label>
                    <input
                      type="number"
                      value={wasteProfile.infectiousPercent}
                      onChange={(e) => setWasteProfile({...wasteProfile, infectiousPercent: parseInt(e.target.value) || 0})}
                      className="w-full bg-black border border-red-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-orange-400 block mb-1">Pathological</label>
                    <input
                      type="number"
                      value={wasteProfile.pathologicalPercent}
                      onChange={(e) => setWasteProfile({...wasteProfile, pathologicalPercent: parseInt(e.target.value) || 0})}
                      className="w-full bg-black border border-orange-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-purple-400 block mb-1">Pharmaceutical</label>
                    <input
                      type="number"
                      value={wasteProfile.pharmaceuticalPercent}
                      onChange={(e) => setWasteProfile({...wasteProfile, pharmaceuticalPercent: parseInt(e.target.value) || 0})}
                      className="w-full bg-black border border-purple-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-yellow-400 block mb-1">Chemical</label>
                    <input
                      type="number"
                      value={wasteProfile.chemicalPercent}
                      onChange={(e) => setWasteProfile({...wasteProfile, chemicalPercent: parseInt(e.target.value) || 0})}
                      className="w-full bg-black border border-yellow-600 rounded px-3 py-2 text-white text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                <h4 className="text-sm font-bold text-red-400 mb-2">📊 DAILY WASTE GENERATION</h4>
                <div className="text-4xl font-bold text-white">{results.totalDailyWaste.toFixed(1)} kg/day</div>
                <p className="text-gray-400 text-sm mt-1">
                  Weekly: {(results.totalDailyWaste * wasteProfile.operatingDays).toFixed(0)} kg | 
                  Monthly: {(results.totalDailyWaste * wasteProfile.operatingDays * 4.33).toFixed(0)} kg
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Incinerator Type</label>
                  <select
                    value={systemConfig.incineratorType}
                    onChange={(e) => setSystemConfig({...systemConfig, incineratorType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {INCINERATOR_TYPES.map(i => (
                      <option key={i.type} value={i.type}>{i.type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Fuel Type</label>
                  <select
                    value={systemConfig.fuelType}
                    onChange={(e) => setSystemConfig({...systemConfig, fuelType: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white text-sm"
                  >
                    {FUEL_TYPES.map(f => (
                      <option key={f.fuel} value={f.fuel}>{f.fuel}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Primary Temp (°C)</label>
                  <input
                    type="number"
                    value={systemConfig.primaryTemp}
                    onChange={(e) => setSystemConfig({...systemConfig, primaryTemp: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Secondary Temp (°C)</label>
                  <input
                    type="number"
                    value={systemConfig.secondaryTemp}
                    onChange={(e) => setSystemConfig({...systemConfig, secondaryTemp: parseInt(e.target.value) || 0})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={systemConfig.hasAPC} onChange={(e) => setSystemConfig({...systemConfig, hasAPC: e.target.checked})} className="rounded" />
                  Air Pollution Control (APC)
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={systemConfig.hasWHR} onChange={(e) => setSystemConfig({...systemConfig, hasWHR: e.target.checked})} className="rounded" />
                  Waste Heat Recovery
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <input type="checkbox" checked={systemConfig.hasContinuousMonitoring} onChange={(e) => setSystemConfig({...systemConfig, hasContinuousMonitoring: e.target.checked})} className="rounded" />
                  Continuous Emission Monitoring (CEMS)
                </label>
              </div>

              <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
                <h4 className="text-lg font-bold text-red-400 mb-2">✅ RECOMMENDED INCINERATOR</h4>
                <div className="text-4xl font-bold text-white mb-2">
                  {results.selectedCapacity} kg/hr {results.incineratorData.type}
                </div>
                <p className="text-gray-400">
                  Required: {results.hourlyCapacity.toFixed(1)} kg/hr | Efficiency: {(results.incineratorData.efficiency * 100).toFixed(0)}%
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-white">{results.totalDailyWaste.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Daily Waste (kg)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-yellow-400">{results.fuelConsumption.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Fuel ({results.fuelData.unit}/day)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-orange-400">{results.ashGeneration.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Ash (kg/day)</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center border border-gray-700">
                  <div className="text-2xl font-bold text-cyan-400">{results.weightedHeatValue.toFixed(0)}</div>
                  <div className="text-xs text-gray-400">Heat Value (MJ/kg)</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'emissions' && (
            <motion.div
              key="emissions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Emission Standard</label>
                  <select
                    value={systemConfig.emissionStandard}
                    onChange={(e) => setSystemConfig({...systemConfig, emissionStandard: e.target.value})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {EMISSION_STANDARDS.map(e => (
                      <option key={e.standard} value={e.standard}>{e.standard}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Residence Time (s)</label>
                  <select
                    value={systemConfig.residenceTime}
                    onChange={(e) => setSystemConfig({...systemConfig, residenceTime: parseFloat(e.target.value)})}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white"
                  >
                    {[1, 1.5, 2, 2.5, 3].map(t => (
                      <option key={t} value={t}>{t} seconds</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <h4 className="text-sm font-bold text-cyan-400 mb-3">💨 EMISSION LIMITS ({systemConfig.emissionStandard})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-left">
                        <th className="p-2">Pollutant</th>
                        <th className="p-2">Limit (mg/Nm³)</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="p-2 text-white">Particulate Matter</td>
                        <td className="p-2 text-white">{results.emissionData.particulate}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${systemConfig.hasAPC ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {systemConfig.hasAPC ? 'Compliant' : 'APC Required'}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="p-2 text-white">Carbon Monoxide (CO)</td>
                        <td className="p-2 text-white">{results.emissionData.co}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${systemConfig.secondaryTemp >= 1000 ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                            {systemConfig.secondaryTemp >= 1000 ? 'Compliant' : 'Increase Temp'}
                          </span>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="p-2 text-white">NOx</td>
                        <td className="p-2 text-white">{results.emissionData.nox}</td>
                        <td className="p-2"><span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400">Monitoring</span></td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="p-2 text-white">SOx</td>
                        <td className="p-2 text-white">{results.emissionData.sox}</td>
                        <td className="p-2"><span className="px-2 py-1 rounded text-xs bg-green-900/50 text-green-400">Monitoring</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                <h4 className="text-sm font-bold text-yellow-400 mb-2">📋 COMPLIANCE CHECKLIST</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className={systemConfig.primaryTemp >= 800 ? 'text-green-400' : 'text-red-400'}>{systemConfig.primaryTemp >= 800 ? '✓' : '✗'}</span>
                    Primary chamber ≥800°C (Current: {systemConfig.primaryTemp}°C)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={systemConfig.secondaryTemp >= 1000 ? 'text-green-400' : 'text-red-400'}>{systemConfig.secondaryTemp >= 1000 ? '✓' : '✗'}</span>
                    Secondary chamber ≥1000°C (Current: {systemConfig.secondaryTemp}°C)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={systemConfig.residenceTime >= 2 ? 'text-green-400' : 'text-red-400'}>{systemConfig.residenceTime >= 2 ? '✓' : '✗'}</span>
                    Residence time ≥2 seconds (Current: {systemConfig.residenceTime}s)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className={systemConfig.hasAPC ? 'text-green-400' : 'text-red-400'}>{systemConfig.hasAPC ? '✓' : '✗'}</span>
                    Air pollution control system
                  </li>
                </ul>
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
                <h4 className="text-lg font-bold text-green-400 mb-4">💰 CAPITAL INVESTMENT</h4>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Incinerator ({results.selectedCapacity} kg/hr {systemConfig.incineratorType})</span>
                    <span className="text-white">KES {results.incineratorCost.toLocaleString()}</span>
                  </div>
                  {systemConfig.hasAPC && (
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Air Pollution Control (APC)</span>
                      <span className="text-white">KES {results.apcCost.toLocaleString()}</span>
                    </div>
                  )}
                  {systemConfig.hasWHR && (
                    <div className="flex justify-between py-2 border-b border-gray-700">
                      <span className="text-gray-400">Waste Heat Recovery</span>
                      <span className="text-white">KES {results.whrCost.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400">Civil Works & Installation</span>
                    <span className="text-white">KES {((results.totalCapitalCost - results.incineratorCost - results.apcCost - results.whrCost) * 0.6).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-3 text-lg font-bold">
                    <span className="text-green-400">TOTAL CAPITAL COST</span>
                    <span className="text-green-400">KES {results.totalCapitalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-900/20 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="text-sm font-bold text-yellow-400 mb-2">📊 MONTHLY OPERATING COST</h4>
                  <div className="text-2xl font-bold text-white">KES {results.monthlyOperatingCost.toLocaleString()}</div>
                  <div className="text-sm text-gray-400 mt-2 space-y-1">
                    <div>Fuel: KES {results.monthlyFuelCost.toLocaleString()}</div>
                    <div>Labor: KES 80,000</div>
                    <div>Maintenance: KES {(results.incineratorCost * 0.002).toLocaleString()}</div>
                  </div>
                </div>
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <h4 className="text-sm font-bold text-red-400 mb-2">💵 COST PER KG WASTE</h4>
                  <div className="text-2xl font-bold text-white">KES {results.costPerKgWaste.toFixed(0)}/kg</div>
                  <p className="text-gray-400 text-sm mt-2">
                    Operating cost only (excludes depreciation)
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 border-t border-gray-700 p-4 flex items-center justify-between text-sm">
        <div className="text-gray-400">
          {results.selectedCapacity} kg/hr | {results.totalDailyWaste.toFixed(0)} kg/day | {systemConfig.incineratorType}
        </div>
        <a 
          href="https://wa.me/254768860655?text=I%20need%20incinerator%20quote"
          target="_blank"
          className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded font-bold"
        >
          📱 Get Quote
        </a>
      </div>
    </div>
  );
}
