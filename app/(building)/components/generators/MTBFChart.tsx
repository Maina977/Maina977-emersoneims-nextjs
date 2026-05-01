"use client";

import { useEffect, useRef } from 'react';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import type { ChartOptions, TooltipItem } from 'chart.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function MTBFChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const data = {
    labels: ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"],
    datasets: [
      {
        label: "Cummins",
        data: [1500, 1600, 1700, 1800, 1900],
        borderColor: "#FFD166",
        backgroundColor: "rgba(255, 209, 102, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#FFD166",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverBackgroundColor: "#FFD166",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 3,
      },
      {
        label: "Competitor A",
        data: [1200, 1250, 1300, 1350, 1400],
        borderColor: "#FF6B6B",
        backgroundColor: "rgba(255, 107, 107, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#FF6B6B",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "Competitor B",
        data: [1000, 1050, 1100, 1150, 1200],
        borderColor: "#0BD3D3",
        backgroundColor: "rgba(11, 211, 211, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: "#0BD3D3",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: "#fff",
          font: {
            size: 12,
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 700,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(255, 209, 102, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.dataset.label}: ${context.parsed.y} hours`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: false,
        min: 800,
        max: 2000,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: "#9ca3af",
          font: {
            size: 11,
          },
          callback: (value: string | number) => `${value}h`,
        },
        title: {
          display: true,
          text: "Hours Between Failures",
          color: "#fff",
          font: {
            size: 13,
          },
        },
      },
    },
  };

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        {
          opacity: 0,
          y: 50,
          scale: 0.95,
        },
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

  return (
    <motion.div
      ref={containerRef}
      className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_30px_rgba(255,209,102,0.1)] overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* WebGL Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 30% 30%, rgba(255, 209, 102, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(11, 211, 211, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Holographic Grid Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 209, 102, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 209, 102, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            MTBF Comparison
          </h3>
          <p className="text-gray-400 text-sm">
            Mean Time Between Failures - 5 Year Reliability Analysis
          </p>
        </div>

        {/* Chart Container */}
        <div ref={chartRef} className="h-80 mb-6">
          <Line data={data} options={options} />
        </div>

        {/* Key Insight */}
        <motion.div
          className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-l-4 border-amber-500 rounded-r-lg p-4"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm text-white/90 leading-relaxed">
            <span className="font-bold text-amber-400">Key Insight:</span>{' '}
            Cummins generators demonstrate superior reliability with 25-30% longer MTBF compared to competitors, ensuring maximum uptime and reduced maintenance costs.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}