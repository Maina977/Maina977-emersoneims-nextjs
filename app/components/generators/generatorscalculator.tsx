"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function GeneratorCalculator() {
  const [loadKW, setLoadKW] = useState<number>(100);
  const [runtimeHours, setRuntimeHours] = useState<number>(8);
  const [fuelCostPerLitre, setFuelCostPerLitre] = useState<number>(180);
  const [maintenanceCostPerYear, setMaintenanceCostPerYear] = useState<number>(200000);
  const containerRef = useRef<HTMLDivElement>(null);

  const efficiency = 0.3;
  const roiYears = 5;

  const fuelConsumptionLitres = loadKW * runtimeHours * efficiency;
  const fuelCost = fuelConsumptionLitres * fuelCostPerLitre;
  const annualCost = fuelCost * 365 + maintenanceCostPerYear;
  const roiProjection = Array.from({ length: roiYears }, (_, i) => annualCost * (i + 1));

  const recommendedKVA = Math.ceil(loadKW / 0.8);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ROI Projection Chart
  const roiChartData = {
    labels: Array.from({ length: roiYears }, (_, i) => `Year ${i + 1}`),
    datasets: [
      {
        label: "Cumulative Cost (KSh)",
        data: roiProjection,
        borderColor: "#fbbf24",
        backgroundColor: "rgba(251, 191, 36, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#fbbf24",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  // Cost Breakdown Chart
  const costBreakdownData = {
    labels: ['Fuel Cost', 'Maintenance Cost'],
    datasets: [
      {
        label: 'Annual Costs (KSh)',
        data: [fuelCost * 365, maintenanceCostPerYear],
        backgroundColor: [
          'rgba(251, 191, 36, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          '#fbbf24',
          '#ef4444',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Efficiency Analysis Chart
  const efficiencyData = {
    labels: ['Current Efficiency', 'Optimal Efficiency', 'Industry Average'],
    datasets: [
      {
        label: 'Efficiency (%)',
        data: [efficiency * 100, 85, 75],
        backgroundColor: [
          'rgba(251, 191, 36, 0.6)',
          'rgba(34, 197, 94, 0.6)',
          'rgba(156, 163, 175, 0.6)',
        ],
        borderColor: [
          '#fbbf24',
          '#22c55e',
          '#9ca3af',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: { family: 'monospace', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 12,
        borderColor: "rgba(251, 191, 36, 0.5)",
        borderWidth: 2,
        titleColor: "#fbbf24",
        bodyColor: "#fff",
        titleFont: { family: 'monospace', size: 14, weight: 700 },
        bodyFont: { family: 'monospace', size: 12 },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#fff", font: { family: 'monospace' } },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "#fff",
          font: { family: 'monospace' },
          callback: function(value: string | number) {
            const numericValue = typeof value === 'number' ? value : Number(value);
            return 'KSh ' + (numericValue / 1000000).toFixed(1) + 'M';
          },
        },
      },
    },
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function(value: string | number) {
            const numericValue = typeof value === 'number' ? value : Number(value);
            return 'KSh ' + (numericValue / 1000).toFixed(0) + 'K';
          },
        },
      },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="relative w-full p-8 bg-gradient-to-br from-gray-950 via-black to-gray-950 rounded-2xl border-2 border-amber-500/30 shadow-[0_0_40px_rgba(251,191,36,0.4)] overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Holographic Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(251,191,36,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(251,191,36,0.1) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px'
      }} />
      
      {/* Glowing Corner Accents */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-amber-400 opacity-50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-amber-400 opacity-50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-amber-400 opacity-50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-400 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-amber-400" />
          <h2 className="text-3xl md:text-4xl font-display font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 bg-clip-text text-transparent tracking-tight">
            Generator Sizing & ROI Calculator
          </h2>
        </div>
        <p className="text-gray-300 mb-8 text-lg">Enter your load and costs to get instant sizing and ROI estimates with premium visualizations.</p>

        {/* Input Form - Enhanced */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm text-amber-300 mb-2 font-mono tracking-wide">
              Load (kW)
            </label>
            <input
              type="number"
              value={loadKW}
              onChange={(e) => setLoadKW(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-black/60 border-2 border-amber-500/30 text-white font-mono backdrop-blur-sm hover:border-amber-400/50 focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
              min="0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm text-amber-300 mb-2 font-mono tracking-wide">
              Runtime (hours/day)
            </label>
            <input
              type="number"
              value={runtimeHours}
              onChange={(e) => setRuntimeHours(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-black/60 border-2 border-amber-500/30 text-white font-mono backdrop-blur-sm hover:border-amber-400/50 focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
              min="0"
              max="24"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm text-amber-300 mb-2 font-mono tracking-wide">
              Fuel cost (KSh per litre)
            </label>
            <input
              type="number"
              value={fuelCostPerLitre}
              onChange={(e) => setFuelCostPerLitre(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-black/60 border-2 border-amber-500/30 text-white font-mono backdrop-blur-sm hover:border-amber-400/50 focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
              min="0"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm text-amber-300 mb-2 font-mono tracking-wide">
              Annual maintenance cost (KSh)
            </label>
            <input
              type="number"
              value={maintenanceCostPerYear}
              onChange={(e) => setMaintenanceCostPerYear(Number(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-black/60 border-2 border-amber-500/30 text-white font-mono backdrop-blur-sm hover:border-amber-400/50 focus:border-amber-400 focus:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all"
              min="0"
            />
          </motion.div>
        </div>

        {/* Results - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 p-6 rounded-xl bg-black/60 border-2 border-green-500/40 backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        >
          <h3 className="text-xl font-semibold text-green-400 mb-4 font-mono tracking-wide flex items-center gap-2">
            <span className="w-1 h-6 bg-green-400" />
            CALCULATION RESULTS
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-900/60 border border-green-500/20 rounded-lg">
              <div className="text-xs text-gray-400 font-mono mb-1">Recommended Size</div>
              <div className="text-2xl font-bold text-green-400 font-mono">{recommendedKVA} kVA</div>
            </div>
            <div className="p-4 bg-gray-900/60 border border-green-500/20 rounded-lg">
              <div className="text-xs text-gray-400 font-mono mb-1">Daily Fuel</div>
              <div className="text-2xl font-bold text-green-400 font-mono">{fuelConsumptionLitres.toFixed(1)} L</div>
            </div>
            <div className="p-4 bg-gray-900/60 border border-green-500/20 rounded-lg">
              <div className="text-xs text-gray-400 font-mono mb-1">Daily Cost</div>
              <div className="text-2xl font-bold text-green-400 font-mono">KSh {fuelCost.toFixed(0)}</div>
            </div>
            <div className="p-4 bg-gray-900/60 border border-green-500/20 rounded-lg">
              <div className="text-xs text-gray-400 font-mono mb-1">Annual Cost</div>
              <div className="text-2xl font-bold text-green-400 font-mono">KSh {(annualCost / 1000000).toFixed(1)}M</div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* ROI Projection Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-black/60 border-2 border-amber-500/30 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-amber-400 mb-4 font-mono tracking-wide">5-Year ROI Projection</h3>
            <div className="h-64">
              <Line data={roiChartData} options={chartOptions} />
            </div>
          </motion.div>

          {/* Cost Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-black/60 border-2 border-amber-500/30 rounded-xl backdrop-blur-sm"
          >
            <h3 className="text-lg font-bold text-amber-400 mb-4 font-mono tracking-wide">Annual Cost Breakdown</h3>
            <div className="h-64">
              <Bar data={costBreakdownData} options={barChartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Efficiency Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 bg-black/60 border-2 border-amber-500/30 rounded-xl backdrop-blur-sm"
        >
          <h3 className="text-lg font-bold text-amber-400 mb-4 font-mono tracking-wide">Efficiency Analysis</h3>
          <div className="h-64">
            <Bar data={efficiencyData} options={barChartOptions} />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
