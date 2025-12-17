'use client';

import { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GeneratorHealthIndex() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [healthScore, setHealthScore] = useState(87);

  // Health Index Data
  const healthData = {
    labels: ['Excellent', 'Good', 'Fair', 'Needs Attention'],
    datasets: [
      {
        data: [healthScore, 100 - healthScore, 0, 0],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(255, 209, 102, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          '#22c55e',
          '#FFD166',
          '#ef4444',
          '#9ca3af',
        ],
        borderWidth: 2,
      },
    ],
  };

  const healthOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#fff',
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
      },
    },
  };

  // Health Metrics
  const healthMetrics = [
    { label: 'Engine Health', value: 92, color: 'green' },
    { label: 'Alternator Status', value: 88, color: 'green' },
    { label: 'Cooling System', value: 85, color: 'yellow' },
    { label: 'Fuel System', value: 90, color: 'green' },
    { label: 'Battery Status', value: 78, color: 'yellow' },
    { label: 'Control System', value: 95, color: 'green' },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
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

      // Animate health score
      gsap.to({ value: healthScore }, {
        value: healthScore,
        duration: 2,
        ease: 'power2.out',
        onUpdate: function() {
          setHealthScore(Math.round(this.targets()[0].value));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Attention';
  };

  return (
    <motion.div
      ref={containerRef}
      className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
        Generator Health Index
      </h3>

      {/* Overall Health Score */}
      <div className="mb-8 text-center">
        <div className="relative inline-block">
          <div className="h-48 w-48">
            <Doughnut data={healthData} options={healthOptions} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-5xl font-bold ${getHealthColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-sm text-gray-400 mt-2">
                {getHealthLabel(healthScore)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="space-y-4">
        {healthMetrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            className="space-y-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">{metric.label}</span>
              <span className={`font-bold ${getHealthColor(metric.value)}`}>
                {metric.value}%
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  metric.color === 'green' ? 'bg-green-500' :
                  metric.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                initial={{ width: 0 }}
                whileInView={{ width: `${metric.value}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Health Recommendations */}
      <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <h4 className="text-sm font-bold text-blue-400 mb-2">Recommendations</h4>
        <ul className="space-y-1 text-sm text-gray-300">
          <li>• Schedule cooling system inspection</li>
          <li>• Replace battery within 3 months</li>
          <li>• Continue regular maintenance schedule</li>
        </ul>
      </div>
    </motion.div>
  );
}

