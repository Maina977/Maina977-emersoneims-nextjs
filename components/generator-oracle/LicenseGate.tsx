'use client';

/**
 * LicenseGate - Wraps the Oracle module and checks for valid license
 * Shows PurchaseOverlay if user is not licensed
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getLicenseStatus, type License } from '@/lib/generator-oracle/licensing';
import PurchaseOverlay from './PurchaseOverlay';
import ActivateLicenseModal from './ActivateLicenseModal';

interface LicenseGateProps {
  children: ReactNode;
}

export default function LicenseGate({ children }: LicenseGateProps) {
  const [licensed, setLicensed] = useState<boolean | null>(null);
  const [license, setLicense] = useState<License | null>(null);
  const [reason, setReason] = useState<string>('');
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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

  // Licensed - show the actual Oracle module with license indicator
  return (
    <div className="relative">
      {/* License Status Indicator */}
      <LicenseIndicator license={license} />
      {children}
    </div>
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
