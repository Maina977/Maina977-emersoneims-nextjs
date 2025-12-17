'use client';

import { useEffect, useRef } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
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
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

export default function DiagnosticCharts() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Error Distribution Chart
  const errorDistributionData = {
    labels: ['Low Fuel', 'Battery', 'Overload', 'Coolant', 'Oil Pressure', 'Other'],
    datasets: [
      {
        label: 'Error Frequency',
        data: [35, 28, 22, 15, 12, 8],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(234, 179, 8, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#3b82f6',
          '#9ca3af',
        ],
        borderWidth: 2,
      },
    ],
  };

  // System Performance Trend
  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Uptime %',
        data: [98.5, 99.2, 98.8, 99.5, 99.1, 98.9, 99.3],
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Efficiency %',
        data: [85, 87, 86, 89, 88, 87, 90],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  // Service Distribution
  const serviceDistributionData = {
    labels: ['Solar', 'Generators', 'Controls', 'AC/UPS', 'Automation'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 209, 102, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          '#FFD166',
          '#22c55e',
          '#3b82f6',
          '#a855f7',
          '#ef4444',
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
        labels: { color: '#fff' },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
      className="grid md:grid-cols-2 gap-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {/* Error Distribution */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
        <h3 className="text-xl font-bold mb-6 text-white">Error Distribution</h3>
        <div className="h-64">
          <Bar data={errorDistributionData} options={chartOptions} />
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
        <h3 className="text-xl font-bold mb-6 text-white">Performance Trend</h3>
        <div className="h-64">
          <Line data={performanceData} options={chartOptions} />
        </div>
      </div>

      {/* Service Distribution */}
      <div className="md:col-span-2 bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-amber-500/20 shadow-[0_0_30px_rgba(255,209,102,0.1)]">
        <h3 className="text-xl font-bold mb-6 text-white">Service Distribution</h3>
        <div className="h-64">
          <Doughnut data={serviceDistributionData} options={chartOptions} />
        </div>
      </div>
    </motion.div>
  );
}

