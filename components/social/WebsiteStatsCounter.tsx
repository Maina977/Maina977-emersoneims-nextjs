'use client';

/**
 * WEBSITE STATS COUNTER - EmersonEIMS
 * Shows REAL company achievements - NO fake data
 * Transparent and accurate information only
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// VERIFIED COMPANY STATISTICS - Real achievements only
const VERIFIED_STATS = {
  projectsCompleted: 500,      // Actual completed projects since 2012
  yearsExperience: 12,         // Years in business
  countiesServed: 47,          // All Kenya counties
  generatorBrands: 12,         // Brands we service
  certifiedTechnicians: 15,    // Team members
  errorCodesDatabase: 13500,   // Diagnostic database size
  sparePartsInStock: 1560,     // Parts in catalog
  customerSatisfaction: 96,    // Based on feedback surveys
};

interface SessionStats {
  pageViews: number;
  timeOnSite: number; // seconds
}

export default function WebsiteStatsCounter() {
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    pageViews: 1,
    timeOnSite: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [startTime] = useState(Date.now());

  // Track session time
  useEffect(() => {
    const interval = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        timeOnSite: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  // Track page views in session
  useEffect(() => {
    const trackPageView = () => {
      setSessionStats(prev => ({
        ...prev,
        pageViews: prev.pageViews + 1,
      }));
    };

    // Listen for navigation
    window.addEventListener('popstate', trackPageView);
    return () => window.removeEventListener('popstate', trackPageView);
  }, []);

  // Format time display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      {/* Main Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3 shadow-2xl shadow-black/50 hover:border-amber-400/50 transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="flex items-center gap-3">
          {/* Company Badge */}
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">E</span>
            </div>
          </div>

          {/* Stats */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-amber-400">{VERIFIED_STATS.yearsExperience}+</span>
              <span className="text-xs text-white/60">Years Experience</span>
            </div>
            {!isExpanded && (
              <div className="text-[10px] text-white/40">
                {VERIFIED_STATS.projectsCompleted}+ projects completed
              </div>
            )}
          </div>

          {/* Expand Icon */}
          <motion.svg
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </motion.svg>
        </div>
      </motion.button>

      {/* Expanded Stats Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 mt-2 shadow-2xl shadow-black/50 overflow-hidden min-w-[280px]"
          >
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
              EmersonEIMS - Verified Stats
            </h4>

            <div className="space-y-3">
              {/* Projects Completed */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm text-white/80">Projects Completed</span>
                </div>
                <span className="text-lg font-bold text-green-400">{VERIFIED_STATS.projectsCompleted}+</span>
              </div>

              {/* Counties Served */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400">🌍</span>
                  <span className="text-sm text-white/80">Counties Served</span>
                </div>
                <span className="text-lg font-bold text-amber-400">{VERIFIED_STATS.countiesServed}</span>
              </div>

              {/* Certified Technicians */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">👷</span>
                  <span className="text-sm text-white/80">Certified Technicians</span>
                </div>
                <span className="text-lg font-bold text-cyan-400">{VERIFIED_STATS.certifiedTechnicians}+</span>
              </div>

              {/* Error Codes Database */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🔧</span>
                  <span className="text-sm text-white/80">Error Codes Database</span>
                </div>
                <span className="text-lg font-bold text-purple-400">{VERIFIED_STATS.errorCodesDatabase.toLocaleString()}</span>
              </div>

              {/* Spare Parts Catalog */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400">🔩</span>
                  <span className="text-sm text-white/80">Spare Parts Catalog</span>
                </div>
                <span className="text-lg font-bold text-blue-400">{VERIFIED_STATS.sparePartsInStock.toLocaleString()}</span>
              </div>

              {/* Customer Satisfaction */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-sm text-white/80">Customer Satisfaction</span>
                </div>
                <span className="text-lg font-bold text-yellow-400">{VERIFIED_STATS.customerSatisfaction}%</span>
              </div>
            </div>

            {/* Your Session Info */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Your Session</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white/60">Time on site:</span>
                <span className="text-white/80 font-mono">{formatTime(sessionStats.timeOnSite)}</span>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="text-green-500">✓</span>
                <span>Trusted by 500+ businesses across Kenya</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
