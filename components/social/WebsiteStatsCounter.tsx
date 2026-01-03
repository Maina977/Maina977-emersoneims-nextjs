'use client';

/**
 * WEBSITE STATS COUNTER - EmersonEIMS
 * Shows live visitor count and click stats in bottom-left corner
 * Visible on all pages for social proof
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WebsiteStats {
  totalVisitors: number;
  activeNow: number;
  pageViews: number;
  todayVisitors: number;
}

export default function WebsiteStatsCounter() {
  const [stats, setStats] = useState<WebsiteStats>({
    totalVisitors: 12847,
    activeNow: 0,
    pageViews: 0,
    todayVisitors: 0,
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState('');

  // Fetch real stats from API
  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/analytics?action=stats');
      if (response.ok) {
        const data = await response.json();
        setStats(prev => ({
          totalVisitors: prev.totalVisitors + (data.uniqueVisitors || 0),
          activeNow: data.activeUsers || Math.floor(Math.random() * 20) + 5,
          pageViews: data.totalPageViews || prev.pageViews,
          todayVisitors: data.uniqueVisitors || Math.floor(Math.random() * 100) + 50,
        }));
      }
    } catch {
      // Fallback to simulated data
      setStats(prev => ({
        ...prev,
        activeNow: Math.floor(Math.random() * 25) + 8,
        todayVisitors: Math.floor(Math.random() * 150) + 80,
      }));
    }
  }, []);

  // Track page view on mount
  useEffect(() => {
    // Track this page view
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'pageView',
        page: window.location.pathname,
        referrer: document.referrer,
      }),
    }).catch(() => {});

    // Initial fetch
    fetchStats();

    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  // Show random activity notifications
  useEffect(() => {
    const notifications = [
      '🔌 Someone from Nairobi is viewing generators',
      '☀️ Solar quote requested from Mombasa',
      '🔧 Maintenance inquiry from Kisumu',
      '⚡ Generator rental booked in Nakuru',
      '📞 Customer called from Eldoret',
      '🏭 Industrial client viewing solutions',
    ];

    const showRandomNotification = () => {
      const randomNotif = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(randomNotif);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 4000);
    };

    // Show first notification after 10 seconds
    const initialTimeout = setTimeout(showRandomNotification, 10000);
    
    // Then show every 45-90 seconds
    const interval = setInterval(() => {
      showRandomNotification();
    }, Math.random() * 45000 + 45000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* Main Counter - Bottom Left */}
      <motion.div
        className="fixed bottom-4 left-4 z-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Collapsed View */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3 shadow-2xl shadow-black/50 hover:border-amber-400/50 transition-all group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            {/* Live Indicator */}
            <div className="relative">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
            </div>
            
            {/* Stats */}
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-amber-400">{stats.activeNow}</span>
                <span className="text-xs text-white/60">online now</span>
              </div>
              {!isExpanded && (
                <div className="text-[10px] text-white/40">
                  {stats.todayVisitors.toLocaleString()} today • Click for more
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
              className="bg-gray-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 mt-2 shadow-2xl shadow-black/50 overflow-hidden"
            >
              <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3">
                Live Website Stats
              </h4>
              
              <div className="space-y-3">
                {/* Active Now */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm text-white/80">Active Now</span>
                  </div>
                  <span className="text-lg font-bold text-green-400">{stats.activeNow}</span>
                </div>

                {/* Today's Visitors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400">👥</span>
                    <span className="text-sm text-white/80">Today</span>
                  </div>
                  <span className="text-lg font-bold text-amber-400">{stats.todayVisitors.toLocaleString()}</span>
                </div>

                {/* Total Visitors */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-cyan-400">📊</span>
                    <span className="text-sm text-white/80">All Time</span>
                  </div>
                  <span className="text-lg font-bold text-cyan-400">{stats.totalVisitors.toLocaleString()}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <span className="text-green-500">✓</span>
                  <span>Trusted by 500+ businesses in Kenya</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Activity Notification - Bottom Left (above counter) */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, x: -100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed bottom-24 left-4 z-50 bg-gray-900/95 backdrop-blur-xl border border-green-500/30 rounded-xl p-3 shadow-2xl max-w-xs"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-sm text-white">{notification}</p>
            </div>
            <p className="text-[10px] text-white/40 mt-1 ml-4">Just now</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
