"use client";

import { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function GeneratorCalculator() {
  const [loadKW, setLoadKW] = useState<number>(100);
  const [runtimeHours, setRuntimeHours] = useState<number>(8);
  const [fuelCostPerLitre, setFuelCostPerLitre] = useState<number>(180);
  const [maintenanceCostPerYear, setMaintenanceCostPerYear] = useState<number>(200000);

  const efficiency = 0.3;
  const roiYears = 5;

  const fuelConsumptionLitres = loadKW * runtimeHours * efficiency;
  const fuelCost = fuelConsumptionLitres * fuelCostPerLitre;
  const annualCost = fuelCost * 365 + maintenanceCostPerYear;
  const roiProjection = Array.from({ length: roiYears }, (_, i) => annualCost * (i + 1));

  const recommendedKVA = Math.ceil(loadKW / 0.8);

  const chartData = {
    labels: Array.from({ length: roiYears }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Cumulative Cost (Fuel + Maintenance)",
        data: roiProjection,
        borderColor: "#FFD166",
        backgroundColor: "rgba(255,209,102,0.3)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { ticks: { color: "#fff" } },
    },
  };

  return (
    <section className="w-full p-6 bg-black/60 rounded-xl border border-white/10 shadow-neon">
      <h2 className="text-2xl md:text-3xl font-display text-brand-gold">Generator Sizing & ROI Calculator</h2>
      <p className="mt-2 text-white/80">Enter your load and costs to get instant sizing and ROI estimates.</p>

      <form className="mt-6 grid gap-4">
        <label className="text-sm text-white/80">
          Load (kW)
          <input 
            type="number" 
            value={loadKW} 
            onChange={(e) => setLoadKW(Number(e.target.value))}
            className="mt-2 w-full rounded bg-black/50 border border-white/20 px-3 py-2 text-white" 
            min="0"
          />
        </label>
        
        <label className="text-sm text-white/80">
          Runtime (hours/day)
          <input 
            type="number" 
            value={runtimeHours} 
            onChange={(e) => setRuntimeHours(Number(e.target.value))}
            className="mt-2 w-full rounded bg-black/50 border border-white/20 px-3 py-2 text-white"
            min="0"
            max="24"
          />
        </label>
        
        <label className="text-sm text-white/80">
          Fuel cost (KSh per litre)
          <input 
            type="number" 
            value={fuelCostPerLitre} 
            onChange={(e) => setFuelCostPerLitre(Number(e.target.value))}
            className="mt-2 w-full rounded bg-black/50 border border-white/20 px-3 py-2 text-white"
            min="0"
          />
        </label>
        
        <label className="text-sm text-white/80">
          Annual maintenance cost (KSh)
          <input 
            type="number" 
            value={maintenanceCostPerYear} 
            onChange={(e) => setMaintenanceCostPerYear(Number(e.target.value))}
            className="mt-2 w-full rounded bg-black/50 border border-white/20 px-3 py-2 text-white"
            min="0"
          />
        </label>
      </form>

      <div className="mt-8 p-6 rounded-lg bg-black/40 border border-white/10">
        <h3 className="text-xl font-semibold text-brand-gold">Results</h3>
        <p className="mt-2 text-white/80">Recommended Generator Size: <span className="text-brand-gold">{recommendedKVA} kVA</span></p>
        <p className="mt-2 text-white/80">Daily Fuel Consumption: <span className="text-brand-gold">{fuelConsumptionLitres.toFixed(1)} litres</span></p>
        <p className="mt-2 text-white/80">Daily Fuel Cost: <span className="text-brand-gold">KSh {fuelCost.toFixed(0)}</span></p>
        <p className="mt-2 text-white/80">Annual Cost (Fuel + Maintenance): <span className="text-brand-gold">KSh {annualCost.toFixed(0)}</span></p>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-brand-gold">5-Year ROI Projection</h3>
        <div className="mt-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </section>
  );
}