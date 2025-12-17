'use client';

import { useEffect, useRef } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function MaintenanceCharts() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Maintenance Schedule Data
  const scheduleData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Scheduled Maintenance',
        data: [12, 15, 18, 14, 20, 16, 22, 19, 17, 21, 18, 15],
        backgroundColor: 'rgba(255, 209, 102, 0.6)',
        borderColor: '#FFD166',
        borderWidth: 2,
      },
      {
        label: 'Emergency Repairs',
        data: [2, 1, 3, 2, 1, 4, 2, 3, 1, 2, 3, 2],
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: '#ef4444',
        borderWidth: 2,
      },
    ],
  };

  // Maintenance Cost Trend
  const costData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Maintenance Cost (KSh)',
        data: [450000, 380000, 420000, 350000],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#fff' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(255, 209, 102, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af' },
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#fff' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af' },
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { 
          color: '#9ca3af',
          callback: (value: any) => `KSh ${(value / 1000).toFixed(0)}K`,
        },
      },
    },
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 50 },
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="space-y-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Maintenance Schedule Chart */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_30px_rgba(255,209,102,0.1)]">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
          Maintenance Schedule Overview
        </h3>
        <div className="h-64">
          <Bar data={scheduleData} options={barOptions} />
        </div>
      </div>

      {/* Cost Trend Chart */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
          Maintenance Cost Trend
        </h3>
        <div className="h-64">
          <Line data={costData} options={lineOptions} />
        </div>
      </div>
    </motion.div>
  );
}

