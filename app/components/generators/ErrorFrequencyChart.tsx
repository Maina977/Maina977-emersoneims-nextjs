'use client';

import React, { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ErrorFrequencyChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Awwwards SOTD quality error frequency data
  const errorData = [
    { error: 'Low Fuel', frequency: 35, color: '#ef4444' },
    { error: 'Battery Failure', frequency: 28, color: '#f97316' },
    { error: 'Overload', frequency: 22, color: '#eab308' },
    { error: 'Coolant Temp', frequency: 15, color: '#22c55e' },
  ];

  const maxFrequency = Math.max(...errorData.map(d => d.frequency));

  const chartData = {
    labels: errorData.map(d => d.error),
    datasets: [
      {
        label: 'Error Frequency (%)',
        data: errorData.map(d => d.frequency),
        backgroundColor: errorData.map(d => `${d.color}80`),
        borderColor: errorData.map(d => d.color),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        borderColor: 'rgba(251, 191, 36, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context: any) => `${context.parsed.y}% frequency`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: Math.ceil(maxFrequency * 1.2),
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
          drawBorder: false,
        },
        ticks: {
          color: '#9ca3af',
          font: {
            size: 11,
          },
          callback: (value: any) => `${value}%`,
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
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Animate bars
      gsap.fromTo(
        '.error-bar',
        {
          scaleX: 0,
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power2.out',
          stagger: 0.1,
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
      className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_30px_rgba(251,191,36,0.1)] overflow-hidden"
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
              radial-gradient(circle at 20% 50%, rgba(251, 191, 36, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Holographic Grid Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
            Error Frequency Analysis
          </h3>
          <p className="text-gray-400 text-sm">
            Real-time error frequency tracking across generator systems
          </p>
        </div>

        {/* Chart Container */}
        <div ref={chartRef} className="h-64 mb-6">
          <Bar data={chartData} options={chartOptions} />
        </div>

        {/* Detailed Breakdown */}
        <div className="space-y-3">
          {errorData.map((item, index) => (
            <motion.div
              key={index}
              className="error-bar"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-medium text-white/90">
                    {item.error}
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-400">
                  {item.frequency}%
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: item.color,
                    width: `${(item.frequency / maxFrequency) * 100}%`,
                  }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(item.frequency / maxFrequency) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

