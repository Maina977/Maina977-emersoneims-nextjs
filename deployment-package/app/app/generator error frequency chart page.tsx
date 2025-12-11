"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ErrorFrequencyChart() {
  const data = {
    labels: ["Low Oil Pressure", "High Coolant Temp", "Overspeed", "CAN Comms Lost", "AVR Fault"],
    datasets: [
      {
        label: "DeepSea",
        data: [12, 9, 7, 5, 4],
        backgroundColor: "rgba(255,209,102,0.6)",
        borderColor: "#FFD166",
        borderWidth: 1,
      },
      {
        label: "PowerWizard",
        data: [15, 11, 10, 8, 6],
        backgroundColor: "rgba(11,211,211,0.6)",
        borderColor: "#0BD3D3",
        borderWidth: 1,
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
          text: "Occurrences per Year", 
          color: "#fff" 
        } 
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
      <p className="mt-4 text-sm text-white/60">
        Data based on 12-month performance monitoring of 500+ installed units
      </p>
    </div>
  );
}