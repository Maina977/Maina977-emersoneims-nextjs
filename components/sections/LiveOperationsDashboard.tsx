'use client';

/**
 * LIVE OPERATIONS DASHBOARD - PERFORMANCE OPTIMIZED
 * Real-time system status display - Tesla/SpaceX Mission Control style
 * Reduced update frequency for better performance
 */

import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

// Optimized real-time metrics with reduced update frequency
const useRealTimeMetrics = () => {
  const [metrics, setMetrics] = useState({
    activeGenerators: 312,
    totalKWGenerated: 45678,
    systemsOnline: 98.7,
    activeAlerts: 2,
    techniciansClockedIn: 12,
    pendingServiceCalls: 8,
    avgResponseTime: 47, // minutes
    customerSatisfaction: 99.2,
  });

  useEffect(() => {
    // Update every 10 seconds instead of 3 seconds
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalKWGenerated: prev.totalKWGenerated + Math.floor(Math.random() * 100),
        activeGenerators: 312 + Math.floor(Math.random() * 10) - 5,
        systemsOnline: 98.5 + Math.random() * 1,
        techniciansClockedIn: 10 + Math.floor(Math.random() * 5),
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export default function LiveOperationsDashboard() {
  const metrics = useRealTimeMetrics();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time after mount
    setCurrentTime(new Date());
    // Update time every 5 seconds instead of every second
    const timer = setInterval(() => setCurrentTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  // Memoize time display to prevent unnecessary re-renders
  const timeDisplay = useMemo(() => {
    if (!currentTime) return '--:--:--';
    return currentTime.toLocaleTimeString('en-US', { hour12: false });
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
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-mono uppercase tracking-wider">
                Operations Center - Live
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Real-Time System Status
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">System Time (EAT)</div>
            <div className="text-2xl font-mono text-cyan-400">
              {timeDisplay}
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Active Systems */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400 uppercase tracking-wider">Systems Online</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {metrics.systemsOnline.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">
              {metrics.activeGenerators} generators monitored
            </div>
          </motion.div>

          {/* Power Generated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-500">⚡</span>
              <span className="text-xs text-amber-400 uppercase tracking-wider">Power Generated Today</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {metrics.totalKWGenerated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">kWh across all systems</div>
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
              <span className="text-xs text-cyan-400 uppercase tracking-wider">Avg Response Time</span>
            </div>
            <div className="text-4xl font-bold text-white mb-1">
              {metrics.avgResponseTime}<span className="text-xl text-gray-400">min</span>
            </div>
            <div className="text-sm text-gray-500">Emergency callouts</div>
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
              {metrics.customerSatisfaction}%
            </div>
            <div className="text-sm text-gray-500">Based on 127 reviews</div>
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
              <span className="text-white font-semibold">{metrics.techniciansClockedIn}</span>
              <span className="text-gray-500 text-sm">Technicians Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500">🔧</span>
              <span className="text-white font-semibold">{metrics.pendingServiceCalls}</span>
              <span className="text-gray-500 text-sm">Pending Service Calls</span>
            </div>
            {metrics.activeAlerts > 0 && (
              <div className="flex items-center gap-2">
                <motion.span 
                  className="text-red-500"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  ⚠️
                </motion.span>
                <span className="text-red-400 font-semibold">{metrics.activeAlerts}</span>
                <span className="text-gray-500 text-sm">Active Alerts</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {currentTime?.toLocaleTimeString() ?? 'Loading...'}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
