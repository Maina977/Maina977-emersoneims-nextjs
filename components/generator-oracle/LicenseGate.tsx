'use client';

/**
 * LicenseGate - Wraps the Oracle module and checks for valid license
 * FREE ACCESS until March 1st, 2026
 * From March 2nd, 2026: KES 20,000/year for full access
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLicenseStatus, type License } from '@/lib/generator-oracle/licensing';
import PurchaseOverlay from './PurchaseOverlay';
import ActivateLicenseModal from './ActivateLicenseModal';
import Link from 'next/link';

interface LicenseGateProps {
  children: ReactNode;
}

// Free trial end date: March 1st, 2026 at midnight
const FREE_TRIAL_END_DATE = new Date('2026-03-02T00:00:00');

// Check if we're in free trial period
function isFreeTrial(): boolean {
  return new Date() < FREE_TRIAL_END_DATE;
}

// Get days remaining in free trial
function getDaysRemaining(): number {
  const now = new Date();
  const diff = FREE_TRIAL_END_DATE.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function LicenseGate({ children }: LicenseGateProps) {
  const [licensed, setLicensed] = useState<boolean | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [reason, setReason] = useState<string>('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [freeTrial, setFreeTrial] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);

  useEffect(() => {
    // Check free trial status
    setFreeTrial(isFreeTrial());
    setDaysLeft(getDaysRemaining());

    // If in free trial, no need to check license
    if (isFreeTrial()) {
      setLicensed(true);
      setIsLoading(false);
      return;
    }

    checkLicense();
  }, []);

  const checkLicense = async () => {
    setIsLoading(true);
    try {
      const status = await getLicenseStatus();
      setLicensed(status.isLicensed);
      setLicense(status.license);
      setReason(status.reason || '');
    } catch (error) {
      console.error('Error checking license:', error);
      setLicensed(false);
      setReason('Error checking license status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivationSuccess = () => {
    setShowActivateModal(false);
    checkLicense();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-4">
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-cyan-500/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-4 rounded-full bg-cyan-500/10 flex items-center justify-center">
              <span className="text-2xl">🔮</span>
            </div>
          </div>
          <p className="text-cyan-400 font-mono text-sm">Verifying License...</p>
        </motion.div>
      </div>
    );
  }

  // Not licensed - show purchase overlay
  if (!licensed) {
    return (
      <>
        <PurchaseOverlay
          onActivateClick={() => setShowActivateModal(true)}
          pendingLicense={license?.status === 'pending' ? license : undefined}
          statusReason={reason}
        />

        <AnimatePresence>
          {showActivateModal && (
            <ActivateLicenseModal
              onClose={() => setShowActivateModal(false)}
              onSuccess={handleActivationSuccess}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Licensed or Free Trial - show the actual Oracle module
  return (
    <div className="relative">
      {/* Free Trial Banner or License Indicator */}
      {freeTrial ? (
        <FreeTrialBanner daysLeft={daysLeft} />
      ) : (
        <LicenseIndicator license={license} />
      )}
      {children}
    </div>
  );
}

/**
 * Free Trial Banner - Shows countdown and pricing info
 */
function FreeTrialBanner({ daysLeft }: { daysLeft: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Top Banner */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 via-emerald-500 to-green-600 text-white py-2 px-4 text-center shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base">
          <span className="font-bold">🎉 FREE ACCESS!</span>
          <span>Generator Oracle is FREE until March 1st, 2026</span>
          <span className="hidden sm:inline">•</span>
          <span className="font-bold text-yellow-200">{daysLeft} days remaining</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-green-100">Then KES 20,000/year</span>
        </div>
      </motion.div>

      {/* Spacer for fixed banner */}
      <div className="h-10 sm:h-8" />

      {/* Floating Info Card */}
      <motion.div
        className="fixed bottom-4 right-4 z-40"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-2xl">🎁</span>
          <div className="text-left">
            <div className="text-green-400 text-xs font-bold">FREE TRIAL</div>
            <div className="text-white text-sm font-medium">{daysLeft} days left</div>
          </div>
          <motion.svg
            className="w-4 h-4 text-green-400 ml-2"
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
              className="absolute bottom-full right-0 mb-2 w-72 p-4 bg-slate-900/95 border border-green-500/30 rounded-xl backdrop-blur-sm"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <div>
                    <div className="text-white font-bold">Free Trial Period</div>
                    <div className="text-green-400 text-sm">Full access - No credit card</div>
                  </div>
                </div>

                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">{daysLeft}</div>
                    <div className="text-green-400 text-sm">Days Remaining</div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-3">
                  <div className="text-slate-400 text-xs mb-2">After March 1st, 2026:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-amber-400">KES 20,000</span>
                    <span className="text-slate-400">/year</span>
                  </div>
                  <div className="text-slate-500 text-xs mt-1">Full access to 20,000+ fault codes</div>
                </div>

                <Link
                  href="/generator-oracle/purchase"
                  className="block w-full py-2 text-center text-sm text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all"
                >
                  Learn about PRO subscription →
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

/**
 * License status indicator shown in the corner
 */
function LicenseIndicator({ license }: { license: License | null }) {
  const [expanded, setExpanded] = useState(false);

  if (!license) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <motion.button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-lg backdrop-blur-sm hover:border-green-400/50 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          className="w-2 h-2 bg-green-500 rounded-full"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-green-400 text-xs font-mono">PRO Licensed</span>
        <motion.svg
          className="w-3 h-3 text-green-400"
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
            className="absolute bottom-full right-0 mb-2 w-64 p-4 bg-slate-900/95 border border-green-500/30 rounded-xl backdrop-blur-sm"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔮</span>
                <div>
                  <div className="text-white font-medium text-sm">Generator Oracle PRO</div>
                  <div className="text-green-400 text-xs">Fully Licensed</div>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">License Key</span>
                  <span className="text-slate-300 font-mono">{license.key.substring(0, 9)}...</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Activated</span>
                  <span className="text-slate-300">
                    {new Date(license.activatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400 font-medium capitalize">{license.status}</span>
                </div>
                {license.expiresAt ? (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Expires</span>
                    <span className="text-slate-300">
                      {new Date(license.expiresAt).toLocaleDateString()}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Validity</span>
                    <span className="text-amber-400 font-medium">Lifetime Access</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <a
                  href="mailto:support@emersoneims.com?subject=Generator Oracle License"
                  className="flex-1 py-1.5 text-center text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all"
                >
                  Support
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
