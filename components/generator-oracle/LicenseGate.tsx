'use client';

/**
 * LicenseGate - Wraps the Oracle module and checks for valid license
 * FREE ACCESS until March 1st, 2026
 * From March 2nd, 2026: KES 20,000/year for full access
 *
 * Features:
 * - Free trial until March 2nd, 2026
 * - Expiry enforcement with renewal warning 30 days before
 * - Server validation with heartbeat
 * - ONE device per license enforcement
 */

import { useState, useEffect, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getLicenseStatus,
  validateLicenseWithServer,
  getLicenseInfo,
  isLicenseExpired,
  needsRenewalWarning,
  getDaysUntilExpiry,
  type License,
} from '@/lib/generator-oracle/licensing';
import PurchaseOverlay from './PurchaseOverlay';
import ActivateLicenseModal from './ActivateLicenseModal';
import ExpiryWarningBanner from './ExpiryWarningBanner';
import RenewalModal from './RenewalModal';
import Link from 'next/link';

interface LicenseGateProps {
  children: ReactNode;
}

// Free trial end date: March 2nd, 2026 at midnight (free until March 1st)
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

// Heartbeat interval: 24 hours
const HEARTBEAT_INTERVAL_MS = 24 * 60 * 60 * 1000;

export default function LicenseGate({ children }: LicenseGateProps) {
  const [licensed, setLicensed] = useState<boolean | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [reason, setReason] = useState<string>('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [freeTrial, setFreeTrial] = useState(true);
  const [daysLeft, setDaysLeft] = useState(0);
  const [licenseDaysLeft, setLicenseDaysLeft] = useState<number>(Infinity);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const checkLicense = useCallback(async (forceServerCheck = false) => {
    setIsLoading(true);
    try {
      // First check local status
      const status = await getLicenseStatus();

      if (!status.isLicensed) {
        setLicensed(false);
        setLicense(status.license);
        setReason(status.reason || '');
        setIsLoading(false);
        return;
      }

      // Validate with server (includes heartbeat)
      const serverValidation = await validateLicenseWithServer(forceServerCheck);

      setLicensed(serverValidation.valid);
      setLicense(serverValidation.license);
      setReason(serverValidation.reason || '');

      // Check expiry status
      if (serverValidation.license) {
        const expired = isLicenseExpired(serverValidation.license);
        const daysRemaining = getDaysUntilExpiry(serverValidation.license);
        const needsWarning = needsRenewalWarning(serverValidation.license);

        setIsExpired(expired);
        setLicenseDaysLeft(daysRemaining);
        setShowExpiryWarning(needsWarning && !expired);

        // If expired, mark as not licensed
        if (expired) {
          setLicensed(false);
          setReason('License has expired. Please renew to continue.');
        }
      }
    } catch (error) {
      console.error('Error checking license:', error);
      setLicensed(false);
      setReason('Error checking license status');
    } finally {
      setIsLoading(false);
    }
  }, []);

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

    // Check license
    checkLicense(true); // Force server check on initial load

    // Set up periodic heartbeat check
    const heartbeatInterval = setInterval(() => {
      checkLicense(false); // Regular check (only hits server if heartbeat is stale)
    }, HEARTBEAT_INTERVAL_MS / 24); // Check more frequently, but only ping server when needed

    return () => clearInterval(heartbeatInterval);
  }, [checkLicense]);

  const handleActivationSuccess = () => {
    setShowActivateModal(false);
    checkLicense(true);
  };

  const handleRenewalSuccess = () => {
    setShowRenewalModal(false);
    setShowExpiryWarning(false);
    setIsExpired(false);
    checkLicense(true);
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

  // Not licensed - show purchase overlay or expired overlay
  if (!licensed) {
    return (
      <>
        {isExpired ? (
          // License expired - show renewal-focused overlay
          <ExpiredOverlay
            license={license}
            onRenewClick={() => setShowRenewalModal(true)}
            onActivateClick={() => setShowActivateModal(true)}
          />
        ) : (
          <PurchaseOverlay
            onActivateClick={() => setShowActivateModal(true)}
            pendingLicense={license?.status === 'pending' ? license : undefined}
            statusReason={reason}
          />
        )}

        <AnimatePresence>
          {showActivateModal && (
            <ActivateLicenseModal
              onClose={() => setShowActivateModal(false)}
              onSuccess={handleActivationSuccess}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showRenewalModal && (
            <RenewalModal
              license={license}
              onClose={() => setShowRenewalModal(false)}
              onSuccess={handleRenewalSuccess}
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
        <>
          <LicenseIndicator license={license} />
          {/* Expiry Warning Banner - shows 30 days before expiry */}
          {showExpiryWarning && license && (
            <ExpiryWarningBanner
              daysRemaining={licenseDaysLeft}
              onRenewClick={() => setShowRenewalModal(true)}
            />
          )}
        </>
      )}

      {children}

      {/* Renewal Modal */}
      <AnimatePresence>
        {showRenewalModal && (
          <RenewalModal
            license={license}
            onClose={() => setShowRenewalModal(false)}
            onSuccess={handleRenewalSuccess}
          />
        )}
      </AnimatePresence>
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
                  <div className="text-slate-500 text-xs mt-1">Full access to 230,000+ fault codes</div>
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

/**
 * Expired License Overlay - Shows when license has expired
 */
function ExpiredOverlay({
  license,
  onRenewClick,
  onActivateClick,
}: {
  license: License | null;
  onRenewClick: () => void;
  onActivateClick: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-slate-900/90 border border-red-500/30 rounded-2xl p-8 text-center"
      >
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 border-2 border-red-500/50 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-4xl">⏰</span>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">License Expired</h2>
        <p className="text-red-400 mb-6">
          Your Generator Oracle license has expired. Please renew to continue using the diagnostic system.
        </p>

        {license && (
          <div className="bg-slate-800/50 rounded-lg p-4 mb-6 text-left">
            <div className="text-sm text-slate-400 mb-2">License Details:</div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">License Key:</span>
                <span className="text-slate-300 font-mono">{license.key.substring(0, 9)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expired:</span>
                <span className="text-red-400">
                  {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={onRenewClick}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
          >
            Renew License - KES 20,000/year
          </button>

          <button
            onClick={onActivateClick}
            className="w-full py-3 bg-slate-800 text-cyan-400 font-medium rounded-xl hover:bg-slate-700 transition-all border border-cyan-500/30"
          >
            Enter New License Key
          </button>

          <a
            href="https://wa.me/254782914717?text=Hi,%20my%20Generator%20Oracle%20license%20has%20expired.%20I%20would%20like%20to%20renew."
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 bg-green-500/20 text-green-400 font-medium rounded-xl hover:bg-green-500/30 transition-all border border-green-500/30"
          >
            Contact Support on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}
