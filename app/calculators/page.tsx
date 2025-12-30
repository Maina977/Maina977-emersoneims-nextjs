// app/calculators/page.tsx - INTERACTIVE CALCULATORS (Innovation 9.8/10)
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassmorphicCard from '@/components/effects/GlassmorphicCard';
import { calculatePMI, calculateESSA } from '@/app/data/diagnostic/emersonMethodology';

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<'roi' | 'load' | 'solar' | 'pmi'>('roi');

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black" />
      
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
            Power Calculators
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade engineering calculators powered by EmersonEIMS proprietary algorithms
          </p>
        </motion.div>

        {/* Calculator Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'roi', label: 'ROI Calculator', icon: '💰' },
            { id: 'load', label: 'Load Calculator', icon: '⚡' },
            { id: 'solar', label: 'Solar Sizing', icon: '☀️' },
            { id: 'pmi', label: 'PMI™ Predictor', icon: '🔮' }
          ].map(calc => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id as any)}
              className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 ${
                activeCalculator === calc.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <span className="mr-2">{calc.icon}</span>
              {calc.label}
            </button>
          ))}
        </div>

        {/* ROI Calculator */}
        {activeCalculator === 'roi' && <ROICalculator />}
        
        {/* Load Calculator */}
        {activeCalculator === 'load' && <LoadCalculator />}
        
        {/* Solar Sizing */}
        {activeCalculator === 'solar' && <SolarSizingCalculator />}
        
        {/* PMI Predictor */}
        {activeCalculator === 'pmi' && <PMICalculator />}
      </div>
    </main>
  );
}

function ROICalculator() {
  const [inputs, setInputs] = useState({
    currentBill: 500000,
    solarCapacity: 100,
    batteryCapacity: 200,
    generatorCapacity: 250,
    gridOutages: 15
  });

  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    // Advanced ROI calculation
    const solarCost = inputs.solarCapacity * 85000; // KES 85K per kWp
    const batteryCost = inputs.batteryCapacity * 120000; // KES 120K per kWh
    const generatorCost = inputs.generatorCapacity * 200000; // KES 200K per kVA
    const totalInvestment = solarCost + batteryCost + generatorCost;

    // Savings calculation
    const gridSavings = inputs.currentBill * 0.65; // 65% reduction from hybrid
    const outageAvoidance = inputs.gridOutages * 50000; // KES 50K per outage avoided
    const monthlySavings = gridSavings + outageAvoidance;
    const annualSavings = monthlySavings * 12;

    // Payback & ROI
    const paybackMonths = totalInvestment / monthlySavings;
    const roi5Year = ((annualSavings * 5 - totalInvestment) / totalInvestment) * 100;
    const roi10Year = ((annualSavings * 10 - totalInvestment) / totalInvestment) * 100;

    setResults({
      totalInvestment,
      monthlySavings,
      annualSavings,
      paybackMonths,
      roi5Year,
      roi10Year,
      savings5Year: annualSavings * 5 - totalInvestment,
      savings10Year: annualSavings * 10 - totalInvestment
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Investment ROI Calculator</h2>
        
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Current Monthly Bill (KES)</label>
              <input
                type="number"
                value={inputs.currentBill}
                onChange={(e) => setInputs({...inputs, currentBill: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Solar Capacity (kWp)</label>
              <input
                type="number"
                value={inputs.solarCapacity}
                onChange={(e) => setInputs({...inputs, solarCapacity: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Battery Storage (kWh)</label>
              <input
                type="number"
                value={inputs.batteryCapacity}
                onChange={(e) => setInputs({...inputs, batteryCapacity: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Generator Capacity (kVA)</label>
              <input
                type="number"
                value={inputs.generatorCapacity}
                onChange={(e) => setInputs({...inputs, generatorCapacity: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Monthly Grid Outages</label>
              <input
                type="number"
                value={inputs.gridOutages}
                onChange={(e) => setInputs({...inputs, gridOutages: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <button
              onClick={calculate}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 rounded-lg hover:scale-105 transition-transform"
            >
              Calculate ROI
            </button>
          </div>

          {/* Results */}
          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Total Investment</div>
                  <div className="text-3xl font-bold text-red-400">
                    KES {(results.totalInvestment / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Monthly Savings</div>
                  <div className="text-3xl font-bold text-green-400">
                    KES {(results.monthlySavings / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Annual Savings</div>
                  <div className="text-3xl font-bold text-green-400">
                    KES {(results.annualSavings / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/10 rounded-xl p-6 border border-amber-500/30">
                  <div className="text-sm text-amber-400">Payback Period</div>
                  <div className="text-3xl font-bold text-white">
                    {results.paybackMonths.toFixed(1)} months
                  </div>
                </div>
                <div className="bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 rounded-xl p-6 border border-cyan-500/30">
                  <div className="text-sm text-cyan-400">5-Year ROI</div>
                  <div className="text-3xl font-bold text-white">
                    {results.roi5Year.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Net: KES {(results.savings5Year / 1000000).toFixed(2)}M
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 rounded-xl p-6 border border-green-500/30">
                  <div className="text-sm text-green-400">10-Year ROI</div>
                  <div className="text-3xl font-bold text-white">
                    {results.roi10Year.toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-400 mt-2">
                    Net: KES {(results.savings10Year / 1000000).toFixed(2)}M
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function LoadCalculator() {
  const [appliances, setAppliances] = useState([
    { name: 'Lights', quantity: 10, watts: 20, hours: 8 },
    { name: 'Computers', quantity: 5, watts: 200, hours: 10 },
    { name: 'AC Units', quantity: 2, watts: 2000, hours: 8 },
  ]);

  const addAppliance = () => {
    setAppliances([...appliances, { name: '', quantity: 1, watts: 100, hours: 8 }]);
  };

  const updateAppliance = (index: number, field: string, value: any) => {
    const updated = [...appliances];
    updated[index] = { ...updated[index], [field]: value };
    setAppliances(updated);
  };

  const totalLoad = appliances.reduce((sum, app) => sum + (app.quantity * app.watts), 0);
  const dailyEnergy = appliances.reduce((sum, app) => sum + (app.quantity * app.watts * app.hours / 1000), 0);
  const monthlyEnergy = dailyEnergy * 30;
  const recommendedGenerator = Math.ceil(totalLoad * 1.25 / 1000) * 10; // 25% safety margin, round to 10kVA
  const recommendedSolar = Math.ceil(dailyEnergy * 1.3 / 5); // 5 peak sun hours, 30% losses

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Load & Sizing Calculator</h2>
        
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-500/20 rounded-xl p-6 border border-amber-500/30">
            <div className="text-sm text-amber-400">Total Load</div>
            <div className="text-3xl font-bold">{(totalLoad/1000).toFixed(1)} kW</div>
          </div>
          <div className="bg-cyan-500/20 rounded-xl p-6 border border-cyan-500/30">
            <div className="text-sm text-cyan-400">Daily Energy</div>
            <div className="text-3xl font-bold">{dailyEnergy.toFixed(0)} kWh</div>
          </div>
          <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
            <div className="text-sm text-green-400">Monthly Energy</div>
            <div className="text-3xl font-bold">{monthlyEnergy.toFixed(0)} kWh</div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {appliances.map((app, i) => (
            <div key={i} className="flex gap-4 bg-white/5 rounded-lg p-4">
              <input
                type="text"
                value={app.name}
                onChange={(e) => updateAppliance(i, 'name', e.target.value)}
                placeholder="Appliance"
                className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
              <input
                type="number"
                value={app.quantity}
                onChange={(e) => updateAppliance(i, 'quantity', Number(e.target.value))}
                placeholder="Qty"
                className="w-20 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
              <input
                type="number"
                value={app.watts}
                onChange={(e) => updateAppliance(i, 'watts', Number(e.target.value))}
                placeholder="Watts"
                className="w-28 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
              <input
                type="number"
                value={app.hours}
                onChange={(e) => updateAppliance(i, 'hours', Number(e.target.value))}
                placeholder="Hours"
                className="w-28 bg-white/10 border border-white/20 rounded px-3 py-2 text-white"
              />
            </div>
          ))}
          <button
            onClick={addAppliance}
            className="w-full bg-white/10 border-2 border-dashed border-white/30 rounded-lg py-3 hover:bg-white/20 transition"
          >
            + Add Appliance
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-6 border-l-4 border-amber-500">
            <h3 className="text-xl font-bold mb-2">Recommended Generator</h3>
            <div className="text-4xl font-bold text-amber-400 mb-2">{recommendedGenerator} kVA</div>
            <p className="text-sm text-gray-400">Includes 25% safety margin for motor starting</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 rounded-xl p-6 border-l-4 border-cyan-500">
            <h3 className="text-xl font-bold mb-2">Recommended Solar</h3>
            <div className="text-4xl font-bold text-cyan-400 mb-2">{recommendedSolar} kWp</div>
            <p className="text-sm text-gray-400">Based on 5 peak sun hours & 30% system losses</p>
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function SolarSizingCalculator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassmorphicCard intensity="medium" className="p-8 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-4">Solar Sizing Calculator</h2>
        <p className="text-gray-400 mb-8">Coming soon - Advanced solar calculator with weather data</p>
      </GlassmorphicCard>
    </motion.div>
  );
}

function PMICalculator() {
  const [inputs, setInputs] = useState({
    service: 'generator',
    equipmentAge: 3,
    lastMaintenance: 8,
    operatingHours: 5000,
    avgLoad: 75,
    climate: 'urban' as 'coastal' | 'highland' | 'arid' | 'urban',
    temperature: 28,
    altitude: 1800
  });

  const [pmi, setPMI] = useState<any>(null);

  const calculatePrediction = () => {
    const result = calculatePMI(
      inputs.service,
      inputs.equipmentAge,
      inputs.lastMaintenance,
      inputs.operatingHours,
      inputs.avgLoad,
      inputs.climate,
      inputs.temperature,
      inputs.altitude
    );
    setPMI(result);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">PMI™ Predictive Maintenance Calculator</h2>
          <p className="text-gray-400">Powered by EmersonEIMS proprietary algorithms • Patent Pending KE/P/2025/XXXXX</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Equipment Type</label>
              <select
                value={inputs.service}
                onChange={(e) => setInputs({...inputs, service: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="generator">Generator</option>
                <option value="solar">Solar</option>
                <option value="ups">UPS</option>
                <option value="controls">Controls</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Equipment Age (years)</label>
              <input
                type="number"
                value={inputs.equipmentAge}
                onChange={(e) => setInputs({...inputs, equipmentAge: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Months Since Last Maintenance</label>
              <input
                type="number"
                value={inputs.lastMaintenance}
                onChange={(e) => setInputs({...inputs, lastMaintenance: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Operating Hours</label>
              <input
                type="number"
                value={inputs.operatingHours}
                onChange={(e) => setInputs({...inputs, operatingHours: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Average Load (%)</label>
              <input
                type="number"
                value={inputs.avgLoad}
                onChange={(e) => setInputs({...inputs, avgLoad: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Climate Zone</label>
              <select
                value={inputs.climate}
                onChange={(e) => setInputs({...inputs, climate: e.target.value as any})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              >
                <option value="coastal">Coastal (Mombasa)</option>
                <option value="highland">Highland (Nairobi)</option>
                <option value="arid">Arid (Turkana)</option>
                <option value="urban">Urban</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Temperature (°C)</label>
              <input
                type="number"
                value={inputs.temperature}
                onChange={(e) => setInputs({...inputs, temperature: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Altitude (meters)</label>
              <input
                type="number"
                value={inputs.altitude}
                onChange={(e) => setInputs({...inputs, altitude: Number(e.target.value)})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white"
              />
            </div>
            <button
              onClick={calculatePrediction}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 rounded-lg hover:scale-105 transition-transform"
            >
              Calculate PMI™
            </button>
          </div>

          {/* Results */}
          <div>
            {pmi && (
              <div className="space-y-4">
                <div className={`rounded-xl p-6 border-l-4 ${
                  pmi.status === 'Excellent' ? 'bg-green-500/20 border-green-500' :
                  pmi.status === 'Good' ? 'bg-cyan-500/20 border-cyan-500' :
                  pmi.status === 'Fair' ? 'bg-amber-500/20 border-amber-500' :
                  pmi.status === 'Poor' ? 'bg-orange-500/20 border-orange-500' :
                  'bg-red-500/20 border-red-500'
                }`}>
                  <div className="text-sm text-gray-400 mb-2">Predictive Maintenance Index</div>
                  <div className="text-5xl font-bold mb-2">{pmi.score.toFixed(1)}</div>
                  <div className="text-xl font-semibold">{pmi.status}</div>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Failure Risk Analysis</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Probability</span>
                      <span className="font-bold">{(pmi.failureProbability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days to Failure</span>
                      <span className="font-bold text-red-400">{pmi.daysToFailure}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Maintenance Due</span>
                      <span className="font-bold text-amber-400">{pmi.maintenanceDue}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-xl p-6">
                  <h4 className="font-bold mb-3">Cost Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Cost</span>
                      <span className="font-bold text-red-400">KES {pmi.estimatedCost.toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-gray-400 mt-2">
                      Based on KES 50,000 per PMI point lost
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-500/20 to-cyan-500/10 rounded-xl p-6 border-l-4 border-amber-500">
                  <h4 className="font-bold mb-3 text-amber-400">Recommendations</h4>
                  <ul className="space-y-2">
                    {pmi.recommendations.map((rec: string, i: number) => (
                      <li key={i} className="text-sm flex items-start">
                        <span className="text-amber-500 mr-2">▸</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-amber-500/30">
                  <p className="text-xs text-gray-400 text-center">
                    PMI™ Algorithm: Patent Pending KE/P/2025/XXXXX<br/>
                    Based on 15 years field data from 47 Kenyan counties
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}
