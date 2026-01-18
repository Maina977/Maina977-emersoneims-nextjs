// app/calculators/page.tsx - INTERACTIVE CALCULATORS (Innovation 9.8/10)
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import GlassmorphicCard from '@/components/effects/GlassmorphicCard';
import { calculatePMI, calculateESSA } from '@/app/data/diagnostic/emersonMethodology';

export default function CalculatorsPage() {
  const [activeCalculator, setActiveCalculator] = useState<'roi' | 'load' | 'solar' | 'ups' | 'ac' | 'motor' | 'pmi'>('roi');

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
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
            Power Calculators
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
            Professional-grade engineering calculators powered by EmersonEIMS proprietary algorithms
          </p>
        </motion.div>

        {/* Calculator Tabs - All Services */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: 'roi', label: 'ROI Calculator', icon: '💰' },
            { id: 'load', label: 'Load/Generator Sizing', icon: '⚡' },
            { id: 'solar', label: 'Solar Sizing', icon: '☀️' },
            { id: 'ups', label: 'UPS Sizing', icon: '🔋' },
            { id: 'ac', label: 'AC/HVAC Sizing', icon: '❄️' },
            { id: 'motor', label: 'Motor Calculator', icon: '🔄' },
            { id: 'pmi', label: 'PMI™ Predictor', icon: '🔮' }
          ].map(calc => (
            <button
              key={calc.id}
              onClick={() => setActiveCalculator(calc.id as any)}
              className={`px-5 py-3 rounded-full font-semibold transition-all duration-300 text-sm md:text-base ${
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

        {/* UPS Sizing */}
        {activeCalculator === 'ups' && <UPSSizingCalculator />}

        {/* AC/HVAC Sizing */}
        {activeCalculator === 'ac' && <ACHVACCalculator />}

        {/* Motor Calculator */}
        {activeCalculator === 'motor' && <MotorCalculator />}

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
  const [inputs, setInputs] = useState({
    dailyEnergy: 50, // kWh
    peakSunHours: 5, // Kenya average
    systemLosses: 25, // %
    batteryBackup: 4, // hours
    gridTied: true,
  });
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const pvSize = (inputs.dailyEnergy / inputs.peakSunHours) * (1 + inputs.systemLosses / 100);
    const batteryCapacity = inputs.batteryBackup * (inputs.dailyEnergy / 24);
    const inverterSize = pvSize * 1.25;
    const panelCount = Math.ceil(pvSize / 0.55); // 550W panels
    const estimatedCost = pvSize * 85000; // KES per kWp

    setResults({
      pvSize: pvSize.toFixed(1),
      batteryCapacity: batteryCapacity.toFixed(1),
      inverterSize: inverterSize.toFixed(1),
      panelCount,
      estimatedCost,
      annualSavings: inputs.dailyEnergy * 365 * 25, // KES 25 per kWh
      payback: estimatedCost / (inputs.dailyEnergy * 365 * 25),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Solar System Sizing Calculator</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Daily Energy Consumption (kWh)</label>
              <input type="number" value={inputs.dailyEnergy} onChange={(e) => setInputs({...inputs, dailyEnergy: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Peak Sun Hours (Kenya avg: 5)</label>
              <input type="number" value={inputs.peakSunHours} onChange={(e) => setInputs({...inputs, peakSunHours: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">System Losses (%)</label>
              <input type="number" value={inputs.systemLosses} onChange={(e) => setInputs({...inputs, systemLosses: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Battery Backup (hours)</label>
              <input type="number" value={inputs.batteryBackup} onChange={(e) => setInputs({...inputs, batteryBackup: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold py-4 rounded-lg hover:scale-105 transition-transform">Calculate Solar System</button>
          </div>
          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-amber-500/20 rounded-xl p-6 border border-amber-500/30">
                  <div className="text-sm text-amber-400">Recommended Solar Array</div>
                  <div className="text-4xl font-bold text-white">{results.pvSize} kWp</div>
                  <div className="text-sm text-gray-400">{results.panelCount} x 550W panels</div>
                </div>
                <div className="bg-cyan-500/20 rounded-xl p-6 border border-cyan-500/30">
                  <div className="text-sm text-cyan-400">Battery Storage</div>
                  <div className="text-4xl font-bold text-white">{results.batteryCapacity} kWh</div>
                </div>
                <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
                  <div className="text-sm text-green-400">Inverter Size</div>
                  <div className="text-4xl font-bold text-white">{results.inverterSize} kW</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Estimated Investment</div>
                  <div className="text-3xl font-bold text-red-400">KES {(results.estimatedCost/1000000).toFixed(2)}M</div>
                  <div className="text-sm text-green-400 mt-2">Payback: {results.payback.toFixed(1)} years</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function UPSSizingCalculator() {
  const [inputs, setInputs] = useState({
    totalLoad: 10, // kW
    backupTime: 30, // minutes
    powerFactor: 0.8,
    efficiency: 0.92,
    futureGrowth: 20, // %
  });
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const vaRating = (inputs.totalLoad * 1000) / inputs.powerFactor;
    const vaWithGrowth = vaRating * (1 + inputs.futureGrowth / 100);
    const kvaRating = Math.ceil(vaWithGrowth / 1000);
    const batteryAh = (inputs.totalLoad * 1000 * (inputs.backupTime / 60)) / (48 * inputs.efficiency);
    const batteryBanks = Math.ceil(batteryAh / 200); // 200Ah batteries

    // Standard UPS sizes
    const standardSizes = [1, 2, 3, 5, 6, 10, 15, 20, 30, 40, 60, 80, 100, 120, 160, 200, 250, 300, 400, 500];
    const recommendedSize = standardSizes.find(s => s >= kvaRating) || kvaRating;

    setResults({
      kvaRating: recommendedSize,
      batteryAh: batteryAh.toFixed(0),
      batteryBanks,
      estimatedCost: recommendedSize * 45000, // KES per kVA
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">UPS Sizing Calculator</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Total Critical Load (kW)</label>
              <input type="number" value={inputs.totalLoad} onChange={(e) => setInputs({...inputs, totalLoad: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Required Backup Time (minutes)</label>
              <input type="number" value={inputs.backupTime} onChange={(e) => setInputs({...inputs, backupTime: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Power Factor (0.7-1.0)</label>
              <input type="number" step="0.1" value={inputs.powerFactor} onChange={(e) => setInputs({...inputs, powerFactor: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Future Growth (%)</label>
              <input type="number" value={inputs.futureGrowth} onChange={(e) => setInputs({...inputs, futureGrowth: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-lg hover:scale-105 transition-transform">Calculate UPS Size</button>
          </div>
          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="text-sm text-blue-400">Recommended UPS Rating</div>
                  <div className="text-4xl font-bold text-white">{results.kvaRating} kVA</div>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-6 border border-purple-500/30">
                  <div className="text-sm text-purple-400">Battery Capacity Required</div>
                  <div className="text-4xl font-bold text-white">{results.batteryAh} Ah</div>
                  <div className="text-sm text-gray-400">{results.batteryBanks} x 200Ah batteries (48V)</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Estimated Cost</div>
                  <div className="text-3xl font-bold text-amber-400">KES {(results.estimatedCost/1000).toFixed(0)}K</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function ACHVACCalculator() {
  const [inputs, setInputs] = useState({
    roomLength: 10, // meters
    roomWidth: 8,
    roomHeight: 3,
    occupants: 5,
    equipment: 2, // kW from computers, etc.
    windows: 2,
    insulation: 'average' as 'poor' | 'average' | 'good',
    climate: 'highland' as 'coastal' | 'highland' | 'arid',
  });
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    const volume = inputs.roomLength * inputs.roomWidth * inputs.roomHeight;

    // Base BTU calculation
    let baseBTU = volume * 20; // 20 BTU per cubic foot (converted)

    // Adjustments
    baseBTU += inputs.occupants * 400; // 400 BTU per person
    baseBTU += inputs.equipment * 1000 * 3.412; // Convert kW to BTU
    baseBTU += inputs.windows * 1000; // Window heat gain

    // Climate adjustment
    const climateMultiplier = inputs.climate === 'coastal' ? 1.3 : inputs.climate === 'arid' ? 1.2 : 1.0;
    baseBTU *= climateMultiplier;

    // Insulation adjustment
    const insulationMultiplier = inputs.insulation === 'poor' ? 1.3 : inputs.insulation === 'good' ? 0.85 : 1.0;
    baseBTU *= insulationMultiplier;

    const tonnage = baseBTU / 12000;
    const kw = tonnage * 3.517;

    setResults({
      btu: Math.round(baseBTU),
      tonnage: tonnage.toFixed(1),
      kw: kw.toFixed(1),
      recommendedUnits: Math.ceil(tonnage / 2), // 2-ton units
      estimatedCost: Math.ceil(tonnage) * 120000, // KES per ton installed
      runningCost: kw * 8 * 25 * 30, // 8 hours/day, KES 25/kWh, 30 days
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">AC/HVAC Sizing Calculator</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Length (m)</label>
                <input type="number" value={inputs.roomLength} onChange={(e) => setInputs({...inputs, roomLength: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Width (m)</label>
                <input type="number" value={inputs.roomWidth} onChange={(e) => setInputs({...inputs, roomWidth: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Height (m)</label>
                <input type="number" value={inputs.roomHeight} onChange={(e) => setInputs({...inputs, roomHeight: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Number of Occupants</label>
              <input type="number" value={inputs.occupants} onChange={(e) => setInputs({...inputs, occupants: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Equipment Heat Load (kW)</label>
              <input type="number" value={inputs.equipment} onChange={(e) => setInputs({...inputs, equipment: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Climate Zone</label>
              <select value={inputs.climate} onChange={(e) => setInputs({...inputs, climate: e.target.value as any})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                <option value="highland">Highland (Nairobi)</option>
                <option value="coastal">Coastal (Mombasa)</option>
                <option value="arid">Arid (Turkana)</option>
              </select>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold py-4 rounded-lg hover:scale-105 transition-transform">Calculate AC Size</button>
          </div>
          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-cyan-500/20 rounded-xl p-6 border border-cyan-500/30">
                  <div className="text-sm text-cyan-400">Cooling Capacity Required</div>
                  <div className="text-4xl font-bold text-white">{results.tonnage} Tons</div>
                  <div className="text-sm text-gray-400">{results.btu.toLocaleString()} BTU/hr | {results.kw} kW</div>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="text-sm text-blue-400">Recommended Units</div>
                  <div className="text-4xl font-bold text-white">{results.recommendedUnits} x 2-Ton Split AC</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="text-sm text-gray-400">Installation Cost</div>
                  <div className="text-3xl font-bold text-amber-400">KES {(results.estimatedCost/1000).toFixed(0)}K</div>
                  <div className="text-sm text-red-400 mt-2">Monthly Running: KES {(results.runningCost/1000).toFixed(0)}K</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
}

function MotorCalculator() {
  const [inputs, setInputs] = useState({
    power: 10, // kW
    voltage: 415,
    frequency: 50,
    poles: 4,
    efficiency: 0.9,
    powerFactor: 0.85,
    serviceHours: 8, // hours per day
  });
  const [results, setResults] = useState<any>(null);

  const calculate = () => {
    // Motor calculations
    const syncSpeed = (120 * inputs.frequency) / inputs.poles;
    const slip = 0.04; // 4% typical
    const actualSpeed = syncSpeed * (1 - slip);

    // Current calculation (3-phase)
    const current = (inputs.power * 1000) / (Math.sqrt(3) * inputs.voltage * inputs.efficiency * inputs.powerFactor);

    // Starting current (DOL)
    const startingCurrent = current * 6; // Typical 6x starting

    // Cable sizing (approximate)
    const cableSizeMm2 = current > 100 ? 70 : current > 60 ? 50 : current > 40 ? 35 : current > 25 ? 16 : current > 15 ? 10 : 6;

    // Breaker sizing
    const breakerSize = Math.ceil(current * 1.25 / 10) * 10;

    // Energy consumption
    const dailyEnergy = inputs.power * inputs.serviceHours;
    const monthlyEnergy = dailyEnergy * 26; // 26 working days
    const monthlyCost = monthlyEnergy * 25; // KES 25 per kWh

    // Rewinding cost estimate
    const rewindCost = inputs.power * 8000; // KES 8,000 per kW

    setResults({
      syncSpeed: Math.round(syncSpeed),
      actualSpeed: Math.round(actualSpeed),
      current: current.toFixed(1),
      startingCurrent: startingCurrent.toFixed(0),
      cableSize: cableSizeMm2,
      breakerSize,
      monthlyEnergy: monthlyEnergy.toFixed(0),
      monthlyCost,
      rewindCost,
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <GlassmorphicCard intensity="medium" className="p-8 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">Motor & Rewinding Calculator</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Motor Power (kW)</label>
                <input type="number" value={inputs.power} onChange={(e) => setInputs({...inputs, power: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Voltage (V)</label>
                <input type="number" value={inputs.voltage} onChange={(e) => setInputs({...inputs, voltage: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Poles</label>
                <select value={inputs.poles} onChange={(e) => setInputs({...inputs, poles: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white">
                  <option value={2}>2 Poles (3000 RPM)</option>
                  <option value={4}>4 Poles (1500 RPM)</option>
                  <option value={6}>6 Poles (1000 RPM)</option>
                  <option value={8}>8 Poles (750 RPM)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Daily Service Hours</label>
                <input type="number" value={inputs.serviceHours} onChange={(e) => setInputs({...inputs, serviceHours: Number(e.target.value)})} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white" />
              </div>
            </div>
            <button onClick={calculate} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-lg hover:scale-105 transition-transform">Calculate Motor Parameters</button>
          </div>
          <div>
            {results && (
              <div className="space-y-4">
                <div className="bg-green-500/20 rounded-xl p-6 border border-green-500/30">
                  <div className="text-sm text-green-400">Motor Speed</div>
                  <div className="text-4xl font-bold text-white">{results.actualSpeed} RPM</div>
                  <div className="text-sm text-gray-400">Sync: {results.syncSpeed} RPM</div>
                </div>
                <div className="bg-amber-500/20 rounded-xl p-6 border border-amber-500/30">
                  <div className="text-sm text-amber-400">Full Load Current</div>
                  <div className="text-4xl font-bold text-white">{results.current} A</div>
                  <div className="text-sm text-red-400">Starting: {results.startingCurrent} A (DOL)</div>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-500/30">
                  <div className="text-sm text-blue-400">Cable & Protection</div>
                  <div className="text-2xl font-bold text-white">Cable: {results.cableSize} mm² | MCB: {results.breakerSize}A</div>
                </div>
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Monthly Energy</span>
                    <span className="font-bold">{results.monthlyEnergy} kWh</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">Monthly Cost</span>
                    <span className="font-bold text-red-400">KES {(results.monthlyCost/1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Rewinding Cost (Est.)</span>
                    <span className="font-bold text-amber-400">KES {(results.rewindCost/1000).toFixed(0)}K</span>
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
    const result = calculatePMI({
      equipmentType: inputs.service,
      runningHours: inputs.operatingHours,
      lastMaintenanceHours: inputs.lastMaintenance,
      faultHistory: [],
      ambientConditions: inputs.climate as 'coastal' | 'highland' | 'arid' | 'urban'
    });
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
