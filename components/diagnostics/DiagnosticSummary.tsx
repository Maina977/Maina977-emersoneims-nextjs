'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DiagnosticSummary() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    totalSystems: 0,
    activeAlerts: 0,
    avgUptime: 0,
    resolvedIssues: 0,
  });

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

      // Animate stats
      gsap.to({}, {
        duration: 2,
        onUpdate: function() {
          setStats({
            totalSystems: 1247,
            activeAlerts: 3,
            avgUptime: 98.7,
            resolvedIssues: 184,
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const summaryCards = [
    {
      label: 'Total Systems',
      value: stats.totalSystems.toLocaleString(),
      icon: '⚡',
      color: 'from-blue-500 to-blue-600',
      change: '+12',
    },
    {
      label: 'Active Alerts',
      value: stats.activeAlerts,
      icon: '⚠️',
      color: 'from-red-500 to-red-600',
      change: '-2',
    },
    {
      label: 'Avg Uptime',
      value: `${stats.avgUptime.toFixed(1)}%`,
      icon: '📊',
      color: 'from-green-500 to-green-600',
      change: '+0.3%',
    },
    {
      label: 'Resolved Issues',
      value: stats.resolvedIssues,
      icon: '✅',
      color: 'from-purple-500 to-purple-600',
      change: '+24',
    },
  ];

  return (
    <motion.div
      ref={containerRef}
      className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 border border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
        Diagnostic Summary
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((card, index) => (
          <motion.div
            key={card.label}
            className="bg-gradient-to-br from-gray-800 to-black rounded-xl p-4 border border-gray-700"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                card.change.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {card.change}
              </span>
            </div>
            <div className={`text-2xl font-bold bg-gradient-to-r ${card.color} bg-clip-text text-transparent mb-1`}>
              {card.value}
            </div>
            <div className="text-xs text-gray-400">{card.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid md:grid-cols-3 gap-4">
        <button className="px-4 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition-all text-sm font-semibold">
          Export Report
        </button>
        <button className="px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/30 transition-all text-sm font-semibold">
          Schedule Maintenance
        </button>
        <button className="px-4 py-3 bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 hover:bg-amber-500/30 transition-all text-sm font-semibold">
          View Details
        </button>
      </div>
    </motion.div>
  );
}

