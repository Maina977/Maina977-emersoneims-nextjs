'use client';

/**
 * COMPANY ACHIEVEMENTS DASHBOARD
 * Displays verified company statistics and achievements
 * All numbers are accurate business metrics - NOT fake live data
 */

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Verified company statistics - These are real business achievements
const COMPANY_STATS = {
  projectsCompleted: 500,
  systemUptime: 98.7,
  countiesServed: 47,
  yearsExperience: 12,
  techniciansOnTeam: 15,
  avgResponseTimeNairobi: 2, // hours
  customerSatisfaction: 96,
  generatorBrands: 12,
};

export default function LiveOperationsDashboard() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time after mount
    setCurrentTime(new Date());
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Memoize time display to prevent unnecessary re-renders
  const timeDisplay = useMemo(() => {
    if (!currentTime) return '--:--';
    return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }, [currentTime]);

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Grid background - simplified for performance */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4 mb-12"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="text-amber-400 text-sm font-mono uppercase tracking-wider">
                Company Achievements
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Our Track Record
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Local Time (EAT)</div>
            <div className="text-2xl font-mono text-cyan-400">
              {timeDisplay}
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Projects Completed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-green-500">✓</span>
              <span className="text-xs text-green-400 uppercase tracking-wider">Projects Completed</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {COMPANY_STATS.projectsCompleted}+
            </div>
            <div className="text-sm text-gray-500">
              Since 2012
            </div>
          </motion.div>

          {/* System Uptime */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500">⚡</span>
              <span className="text-xs text-amber-400 uppercase tracking-wider">System Uptime</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {COMPANY_STATS.systemUptime}%
            </div>
            <div className="text-sm text-gray-500">Average across all installations</div>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-transparent border border-cyan-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-cyan-500">🚀</span>
              <span className="text-xs text-cyan-400 uppercase tracking-wider">Response Time</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              &lt;{COMPANY_STATS.avgResponseTimeNairobi}<span className="text-xl text-gray-400">hrs</span>
            </div>
            <div className="text-sm text-gray-500">Nairobi emergency calls</div>
          </motion.div>

          {/* Customer Satisfaction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-purple-500">⭐</span>
              <span className="text-xs text-purple-400 uppercase tracking-wider">Satisfaction Rate</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {COMPANY_STATS.customerSatisfaction}%
            </div>
            <div className="text-sm text-gray-500">Based on client feedback</div>
          </motion.div>
        </div>

        {/* Team Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-green-500">👷</span>
              <span className="text-white font-semibold">{COMPANY_STATS.techniciansOnTeam}+</span>
              <span className="text-gray-500 text-sm">Certified Technicians</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🌍</span>
              <span className="text-white font-semibold">{COMPANY_STATS.countiesServed}</span>
              <span className="text-gray-500 text-sm">Counties Served</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-cyan-500">🔧</span>
              <span className="text-white font-semibold">{COMPANY_STATS.generatorBrands}</span>
              <span className="text-gray-500 text-sm">Generator Brands</span>
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {COMPANY_STATS.yearsExperience}+ years of experience
          </div>
        </motion.div>
      </div>
    </section>
  );
}
