"use client";

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

export default function MTBFChart() {
  const data = {
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    datasets: [
      {
        label: "Cummins",
        data: [1500, 1600, 1700, 1800, 1900],
        borderColor: "#FFD166",
        backgroundColor: "rgba(255,209,102,0.3)",
        tension: 0.3,
      },
      {
        label: "Competitor A",
        data: [1200, 1250, 1300, 1350, 1400],
        borderColor: "#FF6B6B",
        backgroundColor: "rgba(255,107,107,0.3)",
        tension: 0.3,
      },
      {
        label: "Competitor B",
        data: [1000, 1050, 1100, 1150, 1200],
        borderColor: "#0BD3D3",
        backgroundColor: "rgba(11,211,211,0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { labels: { color: "#fff" } },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { ticks: { color: "#fff" } },
      y: { 
        ticks: { color: "#fff" }, 
        title: { 
          display: true, 
          text: "Hours Between Failures", 
          color: "#fff" 
        } 
      },
    },
  };

  return (
    <div className="bg-black/60 p-6 rounded-lg border border-white/10 shadow-neon">
      <h3 className="text-xl font-semibold text-brand-gold mb-4">MTBF Comparison (Mean Time Between Failures)</h3>
      <Line data={data} options={options} />
      <p className="mt-4 text-sm text-white/60">
        Cummins generators demonstrate superior reliability with 25-30% longer MTBF compared to competitors.
      </p>
    </div>
  );
}