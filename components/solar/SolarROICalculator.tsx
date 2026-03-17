'use client';

/**
 * SOLAR ROI CALCULATOR
 * Calculate return on investment for solar systems in Kenya
 */

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, DollarSign, Sun, Battery, Zap,
  Calendar, PiggyBank, Leaf, BarChart3, ArrowRight
} from 'lucide-react';

// Kenya electricity rates (KES per kWh)
const KPLC_RATES = {
  domestic: { tier1: 12.00, tier2: 15.80, tier3: 20.57, tier4: 22.00 },
  commercial: 18.50,
  industrial: 14.20,
};

// Solar system pricing in Kenya (KES per Watt installed)
const SOLAR_PRICING = {
  budget: 85,      // Basic off-grid
  standard: 120,   // Quality hybrid
  premium: 160,    // Premium brands
};

// Kenya-specific factors
const KENYA_SOLAR = {
  avgSunHours: 5.5,
  degradationRate: 0.005, // 0.5% per year
  maintenanceCostPercent: 0.01, // 1% of system cost per year
  inflationRate: 0.07, // 7% electricity price increase
};

export default function SolarROICalculator() {
  // User inputs
  const [monthlyBill, setMonthlyBill] = useState(15000);
  const [customerType, setCustomerType] = useState<'domestic' | 'commercial' | 'industrial'>('domestic');
  const [systemSize, setSystemSize] = useState(5); // kW
  const [systemQuality, setSystemQuality] = useState<'budget' | 'standard' | 'premium'>('standard');
  const [includesBattery, setIncludesBattery] = useState(true);
  const [batteryCapacity, setBatteryCapacity] = useState(10); // kWh

  // Calculate ROI metrics
  const calculations = useMemo(() => {
    // Get electricity rate
    const rate = customerType === 'domestic' ? 18.5 : KPLC_RATES[customerType]; // Average domestic

    // Monthly consumption estimate
    const monthlyConsumption = monthlyBill / rate; // kWh

    // Solar system cost
    const panelCost = systemSize * 1000 * SOLAR_PRICING[systemQuality];
    const batteryCost = includesBattery ? batteryCapacity * 15000 : 0; // ~15,000 KES per kWh
    const installationCost = (panelCost + batteryCost) * 0.15; // 15% installation
    const totalSystemCost = panelCost + batteryCost + installationCost;

    // Daily production
    const dailyProduction = systemSize * KENYA_SOLAR.avgSunHours * 0.8; // 80% efficiency
    const monthlyProduction = dailyProduction * 30;
    const annualProduction = dailyProduction * 365;

    // Coverage calculation
    const coveragePercent = Math.min(100, (monthlyProduction / monthlyConsumption) * 100);

    // Monthly savings
    const energySaved = Math.min(monthlyProduction, monthlyConsumption);
    const monthlySavings = energySaved * rate;
    const annualSavings = monthlySavings * 12;

    // Payback period (simple)
    const simplePayback = totalSystemCost / annualSavings;

    // 25-year analysis with inflation and degradation
    let cumulativeSavings = 0;
    let cumulativeCost = totalSystemCost;
    let paybackYear = 0;
    const yearlyData = [];

    for (let year = 1; year <= 25; year++) {
      const degradationFactor = Math.pow(1 - KENYA_SOLAR.degradationRate, year - 1);
      const inflationFactor = Math.pow(1 + KENYA_SOLAR.inflationRate, year - 1);
      const yearSavings = annualSavings * degradationFactor * inflationFactor;
      const yearMaintenance = totalSystemCost * KENYA_SOLAR.maintenanceCostPercent;
      const netSavings = yearSavings - yearMaintenance;

      cumulativeSavings += netSavings;

      if (cumulativeSavings >= totalSystemCost && paybackYear === 0) {
        paybackYear = year;
      }

      yearlyData.push({
        year,
        savings: netSavings,
        cumulative: cumulativeSavings,
        gridCost: (monthlyBill * 12) * inflationFactor,
      });
    }

    const totalROI = ((cumulativeSavings - totalSystemCost) / totalSystemCost) * 100;
    const lifetimeSavings = cumulativeSavings - totalSystemCost;

    // Carbon offset (Kenya grid: ~0.35 kg CO2/kWh)
    const annualCO2Offset = annualProduction * 0.35;
    const lifetimeCO2Offset = annualCO2Offset * 25;

    return {
      totalSystemCost,
      panelCost,
      batteryCost,
      installationCost,
      monthlyConsumption: Math.round(monthlyConsumption),
      monthlyProduction: Math.round(monthlyProduction),
      coveragePercent: Math.round(coveragePercent),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      simplePayback: simplePayback.toFixed(1),
      paybackYear,
      totalROI: Math.round(totalROI),
      lifetimeSavings: Math.round(lifetimeSavings),
      annualCO2Offset: Math.round(annualCO2Offset),
      lifetimeCO2Offset: Math.round(lifetimeCO2Offset / 1000), // tonnes
      yearlyData,
    };
  }, [monthlyBill, customerType, systemSize, systemQuality, includesBattery, batteryCapacity]);

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-7 h-7 text-green-400" />
        Solar ROI Calculator
      </h2>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-amber-400">Your Details</h3>

          {/* Monthly Bill */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">Monthly Electricity Bill (KES)</label>
            <input
              type="number"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none"
            />
            <p className="text-slate-500 text-xs mt-1">
              Estimated consumption: ~{calculations.monthlyConsumption} kWh/month
            </p>
          </div>

          {/* Customer Type */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">Customer Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['domestic', 'commercial', 'industrial'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setCustomerType(type)}
                  className={`py-2 px-3 rounded-lg text-sm capitalize transition-all ${
                    customerType === type
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* System Size */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">
              System Size: {systemSize} kW
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={systemSize}
              onChange={(e) => setSystemSize(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-slate-500 text-xs">
              <span>1 kW</span>
              <span>25 kW</span>
              <span>50 kW</span>
            </div>
          </div>

          {/* System Quality */}
          <div>
            <label className="block text-slate-300 text-sm mb-2">System Quality</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'budget', label: 'Budget', price: 'KES 85/W' },
                { id: 'standard', label: 'Standard', price: 'KES 120/W' },
                { id: 'premium', label: 'Premium', price: 'KES 160/W' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSystemQuality(opt.id as any)}
                  className={`py-2 px-3 rounded-lg text-sm transition-all ${
                    systemQuality === opt.id
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <div className="font-medium">{opt.label}</div>
                  <div className="text-xs opacity-80">{opt.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Battery */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includesBattery}
                onChange={(e) => setIncludesBattery(e.target.checked)}
                className="w-5 h-5 rounded accent-amber-500"
              />
              <span className="text-slate-300">Include Battery Storage</span>
            </label>
            {includesBattery && (
              <div className="mt-3">
                <label className="block text-slate-400 text-sm mb-2">
                  Battery Capacity: {batteryCapacity} kWh
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  value={batteryCapacity}
                  onChange={(e) => setBatteryCapacity(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-green-400">Your Savings</h3>

          {/* System Cost */}
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-slate-400">Total System Cost</span>
              <span className="text-2xl font-bold text-white">
                KES {calculations.totalSystemCost.toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-slate-500 space-y-1">
              <div className="flex justify-between">
                <span>Solar Panels ({systemSize}kW)</span>
                <span>KES {calculations.panelCost.toLocaleString()}</span>
              </div>
              {includesBattery && (
                <div className="flex justify-between">
                  <span>Battery ({batteryCapacity}kWh)</span>
                  <span>KES {calculations.batteryCost.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Installation</span>
                <span>KES {calculations.installationCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <PiggyBank className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">
                KES {calculations.monthlySavings.toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">Monthly Savings</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">
                {calculations.paybackYear} Years
              </p>
              <p className="text-slate-400 text-sm">Payback Period</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">
                {calculations.totalROI}%
              </p>
              <p className="text-slate-400 text-sm">25-Year ROI</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">
                KES {(calculations.lifetimeSavings / 1000000).toFixed(1)}M
              </p>
              <p className="text-slate-400 text-sm">Lifetime Savings</p>
            </div>
          </div>

          {/* Coverage */}
          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Energy Coverage</span>
              <span className="text-white font-bold">{calculations.coveragePercent}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-amber-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, calculations.coveragePercent)}%` }}
              />
            </div>
            <p className="text-slate-500 text-sm mt-2">
              System produces ~{calculations.monthlyProduction} kWh/month
            </p>
          </div>

          {/* Environmental Impact */}
          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Annual CO2 Offset</p>
                <p className="text-white font-bold">{calculations.annualCO2Offset} kg</p>
              </div>
              <div>
                <p className="text-slate-400">25-Year CO2 Offset</p>
                <p className="text-white font-bold">{calculations.lifetimeCO2Offset} tonnes</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <a
            href={`https://wa.me/254793573208?text=${encodeURIComponent(
              `Hi, I'm interested in a ${systemSize}kW solar system.\n\nMy details:\n- Monthly bill: KES ${monthlyBill.toLocaleString()}\n- Customer type: ${customerType}\n- Quality: ${systemQuality}\n- Battery: ${includesBattery ? `${batteryCapacity}kWh` : 'No'}\n\nEstimated cost: KES ${calculations.totalSystemCost.toLocaleString()}\nPayback: ${calculations.paybackYear} years\n\nPlease provide a detailed quote.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-center"
          >
            Get Free Quote via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
