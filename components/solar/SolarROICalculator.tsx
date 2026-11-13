'use client';

/**
 * SOLAR ROI CALCULATOR
 * Return on investment for a solar system in Kenya, from the customer's own
 * figures.
 *
 * Price policy (management decision 2026-11-13): no unsourced prices and no
 * assumed tariffs. The installed cost comes from verified prices
 * (lib/solar/sizing.ts PRICE_BASIS) or the customer's quotation; the tariff
 * is the customer's own (bill total ÷ kWh). Both are shown as user-provided
 * assumptions. Before this, the tool priced systems from typical mid-2026
 * rates with no source and assumed KES 25/kWh (18 industrial).
 */

import { useState, useMemo } from 'react';
import { estimateInstalledCost, pricesVerified, customerRate, REQUEST_QUOTATION, PERFORMANCE_RATIO, BATTERY_DOD, BATTERY_EFFICIENCY } from '@/lib/solar/sizing';
import {
  TrendingUp, DollarSign,
  Calendar, PiggyBank, Leaf
} from 'lucide-react';

// Kenya-specific factors, shared with the calculator where it has them.
const KENYA_SOLAR = {
  avgSunHours: 5.5,
  degradationRate: 0.005, // 0.5% per year
  maintenanceCostPercent: 0.01, // 1% of system cost per year
  tariffGrowth: 0, // tariffs held flat: no assumed price rises
  gridKgCo2PerKwh: 0.213, // Kenya grid (Climate Watch / KPLC 2023), as the sustainability tool
};

const inputCls = 'w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:border-amber-500 focus:outline-none';

export default function SolarROICalculator() {
  // User inputs
  const [monthlyBill, setMonthlyBill] = useState(15000);
  const [tariffInput, setTariffInput] = useState('');
  const [systemSize, setSystemSize] = useState(5); // kW
  const [quotedCostInput, setQuotedCostInput] = useState('');
  const [batteryReplacementInput, setBatteryReplacementInput] = useState('');
  const [includesBattery, setIncludesBattery] = useState(true);
  const [batteryCapacity, setBatteryCapacity] = useState(10); // kWh

  const calculations = useMemo(() => {
    const rate = customerRate(tariffInput);
    const quotedCost = customerRate(quotedCostInput);
    const type = includesBattery ? 'hybrid' : 'grid-tied';
    const battery = includesBattery ? batteryCapacity : 0;
    const verifiedCost = pricesVerified() ? estimateInstalledCost(systemSize, systemSize, battery, type).midKes : null;
    const totalSystemCost = quotedCost ?? verifiedCost; // null = request a quotation

    // Consumption from the bill needs the customer's tariff.
    const monthlyConsumption = rate ? monthlyBill / rate : null; // kWh

    const dailyProduction = systemSize * KENYA_SOLAR.avgSunHours * PERFORMANCE_RATIO;
    const monthlyProduction = dailyProduction * 30;

    const coveragePercent = monthlyConsumption && monthlyConsumption > 0
      ? Math.min(100, (monthlyProduction / monthlyConsumption) * 100) : null;

    // Not all solar is used on site. Daytime loads (about half) are met
    // directly, ~75% of them; a battery moves surplus into the evening up to
    // its usable capacity; overall capped at ~90% (as the calculator).
    let energySaved = 0;
    if (monthlyConsumption) {
      const direct = Math.min(monthlyProduction, monthlyConsumption * 0.5) * 0.75;
      const stored = includesBattery
        ? Math.min((monthlyProduction - direct) * BATTERY_EFFICIENCY, monthlyConsumption - direct, batteryCapacity * BATTERY_DOD * 30)
        : 0;
      energySaved = includesBattery
        ? Math.min(direct + Math.max(0, stored), Math.min(monthlyProduction, monthlyConsumption) * 0.9)
        : direct;
    }
    const monthlySavings = rate ? energySaved * rate : null;
    const annualSavings = monthlySavings === null ? null : monthlySavings * 12;

    // Battery replacement in year 12 only at the customer's quoted price.
    const batteryReplacementYear = 12;
    const batteryReplacementKes = includesBattery ? customerRate(batteryReplacementInput) ?? 0 : 0;

    let paybackYear: number | null = null;
    let lifetimeSavings: number | null = null;
    let totalROI: number | null = null;
    if (totalSystemCost && annualSavings !== null) {
      let cumulativeSavings = 0;
      for (let year = 1; year <= 25; year++) {
        const degradationFactor = Math.pow(1 - KENYA_SOLAR.degradationRate, year - 1);
        const inflationFactor = Math.pow(1 + KENYA_SOLAR.tariffGrowth, year - 1);
        const yearSavings = annualSavings * degradationFactor * inflationFactor;
        const yearMaintenance = totalSystemCost * KENYA_SOLAR.maintenanceCostPercent;
        cumulativeSavings += yearSavings - yearMaintenance - (year === batteryReplacementYear ? batteryReplacementKes : 0);
        if (cumulativeSavings >= totalSystemCost && paybackYear === null) paybackYear = year;
      }
      totalROI = Math.round(((cumulativeSavings - totalSystemCost) / totalSystemCost) * 100);
      lifetimeSavings = Math.round(cumulativeSavings - totalSystemCost);
    }

    const annualCO2Offset = energySaved * 12 * KENYA_SOLAR.gridKgCo2PerKwh;
    return {
      rate,
      quotedCost,
      totalSystemCost,
      monthlyConsumption: monthlyConsumption === null ? null : Math.round(monthlyConsumption),
      monthlyProduction: Math.round(monthlyProduction),
      coveragePercent: coveragePercent == null ? null : Math.round(coveragePercent),
      monthlySavings: monthlySavings === null ? null : Math.round(monthlySavings),
      paybackYear,
      totalROI,
      lifetimeSavings,
      batteryReplacementKes,
      annualCO2Offset: Math.round(annualCO2Offset),
      lifetimeCO2Offset: Math.round((annualCO2Offset * 25) / 1000), // tonnes
    };
  }, [monthlyBill, tariffInput, systemSize, quotedCostInput, batteryReplacementInput, includesBattery, batteryCapacity]);

  const needCost = calculations.totalSystemCost === null;
  const needTariff = calculations.rate === null;
  const missing = needTariff && needCost ? 'Enter your tariff and a quoted cost' : needTariff ? 'Enter your tariff' : needCost ? 'Enter a quoted cost' : '';

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

          <div>
            <label htmlFor="roi-bill" className="block text-slate-300 text-sm mb-2">Monthly Electricity Bill (KES)</label>
            <input id="roi-bill" type="number" min={0} value={monthlyBill}
              onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value) || 0))} className={inputCls} />
          </div>

          <div>
            <label htmlFor="roi-tariff" className="block text-slate-300 text-sm mb-2">Your tariff (KES per kWh)</label>
            <input id="roi-tariff" type="number" min={1} value={tariffInput} placeholder="bill total ÷ kWh on the bill"
              onChange={(e) => setTariffInput(e.target.value)} className={inputCls} />
            <p className="text-slate-500 text-xs mt-1">
              {calculations.monthlyConsumption !== null ? `Estimated consumption: ~${calculations.monthlyConsumption} kWh/month` : 'Your bill total divided by the kWh on it.'}
            </p>
          </div>

          <div>
            <label htmlFor="roi-size" className="block text-slate-300 text-sm mb-2">System Size: {systemSize} kW</label>
            <input id="roi-size" type="range" min="1" max="50" value={systemSize}
              onChange={(e) => setSystemSize(Number(e.target.value))} className="w-full accent-amber-500" />
            <div className="flex justify-between text-slate-500 text-xs">
              <span>1 kW</span><span>25 kW</span><span>50 kW</span>
            </div>
          </div>

          <div>
            <label htmlFor="roi-cost" className="block text-slate-300 text-sm mb-2">Quoted installed cost (KES)</label>
            <input id="roi-cost" type="number" min={0} value={quotedCostInput} placeholder="from a quotation"
              onChange={(e) => setQuotedCostInput(e.target.value)} className={inputCls} />
            <p className="text-slate-500 text-xs mt-1">We do not show estimated prices. Ask us for a quotation for your site.</p>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={includesBattery} onChange={(e) => setIncludesBattery(e.target.checked)} className="w-5 h-5 rounded accent-amber-500" />
              <span className="text-slate-300">Include Battery Storage</span>
            </label>
            {includesBattery && (
              <div className="mt-3 space-y-3">
                <div>
                  <label htmlFor="roi-battery" className="block text-slate-400 text-sm mb-2">Battery Capacity: {batteryCapacity} kWh</label>
                  <input id="roi-battery" type="range" min="5" max="50" value={batteryCapacity}
                    onChange={(e) => setBatteryCapacity(Number(e.target.value))} className="w-full accent-amber-500" />
                </div>
                <div>
                  <label htmlFor="roi-battery-repl" className="block text-slate-400 text-sm mb-2">Quoted battery replacement in year 12 (KES, optional)</label>
                  <input id="roi-battery-repl" type="number" min={0} value={batteryReplacementInput} placeholder="from a quotation"
                    onChange={(e) => setBatteryReplacementInput(e.target.value)} className={inputCls} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-green-400">Your Savings</h3>

          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400">Installed cost</span>
              <span className="text-2xl font-bold text-white">
                {calculations.totalSystemCost !== null ? `KES ${calculations.totalSystemCost.toLocaleString()}` : REQUEST_QUOTATION}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {calculations.quotedCost ? 'Your quoted cost: a user-provided assumption, not an EmersonEIMS price.' : 'Enter a quoted cost to see payback, or ask us for a quotation.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <PiggyBank className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-400">
                {calculations.monthlySavings !== null ? `KES ${calculations.monthlySavings.toLocaleString()}` : 'Enter your tariff'}
              </p>
              <p className="text-slate-400 text-sm">Monthly Savings</p>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-center">
              <Calendar className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-amber-400">
                {missing || (calculations.paybackYear != null ? `${calculations.paybackYear} Years` : 'Not within 25 years')}
              </p>
              <p className="text-slate-400 text-sm">Payback Period</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-400">{calculations.totalROI !== null ? `${calculations.totalROI}%` : '—'}</p>
              <p className="text-slate-400 text-sm">25-Year ROI</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-400">
                {calculations.lifetimeSavings !== null ? `KES ${(calculations.lifetimeSavings / 1000000).toFixed(1)}M` : '—'}
              </p>
              <p className="text-slate-400 text-sm">25-Year Net Savings</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            How this is worked out: savings are the solar energy used on site times your tariff (your bill ÷ your
            tariff gives the consumption). Panel output falls 0.5% a year, maintenance is 1% of the system cost a
            year and tariffs are held flat.
            {calculations.batteryReplacementKes > 0 ? ` The battery is replaced once, in year 12, at your quoted KES ${calculations.batteryReplacementKes.toLocaleString()}.` : includesBattery ? ' Battery replacement (around year 10-12) is not included until you enter a quoted price.' : ''}
            {' '}Payback is the first year the running total of net savings passes the cost. Your tariff and quotes are
            user-provided assumptions. Estimates only.
          </p>

          <div className="bg-slate-900 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300">Energy Coverage</span>
              <span className="text-white font-bold">{calculations.coveragePercent != null ? `${calculations.coveragePercent}%` : 'Enter your bill and tariff'}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div className="bg-gradient-to-r from-amber-500 to-green-500 h-3 rounded-full transition-all"
                style={{ width: `${Math.min(100, calculations.coveragePercent ?? 0)}%` }} />
            </div>
            <p className="text-slate-500 text-sm mt-2">System produces ~{calculations.monthlyProduction} kWh/month</p>
          </div>

          <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Environmental Impact</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Annual CO2 Offset</p>
                <p className="text-white font-bold">{calculations.rate ? `${calculations.annualCO2Offset} kg` : 'Enter your tariff'}</p>
              </div>
              <div>
                <p className="text-slate-400">25-Year CO2 Offset</p>
                <p className="text-white font-bold">{calculations.rate ? `${calculations.lifetimeCO2Offset} tonnes` : '—'}</p>
              </div>
            </div>
          </div>

          <a
            href={`https://wa.me/254768860665?text=${encodeURIComponent(
              `Hi, I'm interested in a ${systemSize}kW solar system.\n\nMy details:\n- Monthly bill: KES ${monthlyBill.toLocaleString()}${calculations.rate ? `\n- Tariff: KES ${calculations.rate}/kWh` : ''}\n- Battery: ${includesBattery ? `${batteryCapacity}kWh` : 'No'}\n\nPlease provide a quotation.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-center"
          >
            Request a quotation via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
