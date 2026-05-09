'use client';

/**
 * ExpiryWarningBanner - Shows warning when license is close to expiring
 * Displayed 30 days before expiry
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ExpiryWarningBannerProps {
  daysRemaining: number;
  onRenewClick: () => void;
}

export default function ExpiryWarningBanner({ daysRemaining, onRenewClick }: ExpiryWarningBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Determine urgency level
  const isUrgent = daysRemaining <= 7;
  const isWarning = daysRemaining <= 14;

  const bgColor = isUrgent
    ? 'from-red-600 via-red-500 to-red-600'
    : isWarning
    ? 'from-amber-600 via-orange-500 to-amber-600'
    : 'from-amber-500 via-yellow-500 to-amber-500';

  const textColor = isUrgent ? 'text-red-100' : 'text-amber-100';

  return (
    <>
      {/* Top Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r ${bgColor} text-white py-2 px-4 shadow-lg`}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
          <span className="font-bold">
            {isUrgent ? '⚠️ URGENT:' : '⏰'}
          </span>
          <span className={textColor}>
            Your license expires in <strong>{daysRemaining}</strong> day{daysRemaining !== 1 ? 's' : ''}
          </span>
          <span className="hidden sm:inline">•</span>
          <button
            onClick={onRenewClick}
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all"
          >
            Renew Now
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 p-1 hover:bg-white/20 rounded transition-all"
            title="Dismiss"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </motion.div>

      {/* Spacer for fixed banner */}
      <div className="h-10 sm:h-8" />

      {/* Floating Reminder Card */}
      <FloatingExpiryCard daysRemaining={daysRemaining} onRenewClick={onRenewClick} />
    </>
  );
}

/**
 * Floating card with more details about expiry
 */
function FloatingExpiryCard({
  daysRemaining,
  onRenewClick,
}: {
  daysRemaining: number;
  onRenewClick: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const isUrgent = daysRemaining <= 7;

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-sm transition-all ${
          isUrgent
            ? 'bg-red-500/20 border border-red-500/30 hover:border-red-400/50'
            : 'bg-amber-500/20 border border-amber-500/30 hover:border-amber-400/50'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.span
          className="text-2xl"
          animate={{ scale: isUrgent ? [1, 1.2, 1] : [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          {isUrgent ? '⚠️' : '⏰'}
        </motion.span>
        <div className="text-left">
          <div className={`text-xs font-bold ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
            {isUrgent ? 'EXPIRES SOON' : 'RENEW SOON'}
          </div>
          <div className="text-white text-sm font-medium">
            {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
          </div>
        </div>
        <motion.svg
          className={`w-4 h-4 ml-2 ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          animate={{ rotate: expanded ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className={`absolute bottom-full left-0 mb-2 w-72 p-4 bg-slate-900/95 border rounded-xl backdrop-blur-sm ${
              isUrgent ? 'border-red-500/30' : 'border-amber-500/30'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{isUrgent ? '⚠️' : '⏰'}</span>
                <div>
                  <div className="text-white font-bold">License Expiring</div>
                  <div className={`text-sm ${isUrgent ? 'text-red-400' : 'text-amber-400'}`}>
                    {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} remaining
                  </div>
                </div>
              </div>

              <div className={`rounded-lg p-3 ${
                isUrgent ? 'bg-red-500/10 border border-red-500/30' : 'bg-amber-500/10 border border-amber-500/30'
              }`}>
                <p className={`text-sm ${isUrgent ? 'text-red-300' : 'text-amber-300'}`}>
                  {isUrgent
                    ? 'Your access will be blocked when the license expires. Renew now to avoid interruption.'
                    : 'Renew before expiry to ensure uninterrupted access to all diagnostic features.'
                  }
                </p>
              </div>

              <div className="border-t border-slate-700 pt-3">
                <div className="text-slate-400 text-xs mb-2">Renewal price:</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-amber-400">KES 20,000</span>
                  <span className="text-slate-400">/year</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={onRenewClick}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  Renew Now
                </button>
                <Link
                  href="/generator-oracle/purchase"
                  className="block w-full py-2 text-center text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all"
                >
                  View payment options
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
