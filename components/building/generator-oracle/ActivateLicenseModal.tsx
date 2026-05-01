'use client';

/**
 * ActivateLicenseModal - Modal for entering and activating a license key
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  activateLicense,
  isValidLicenseFormat,
} from '@/lib/generator-oracle/licensing';

interface ActivateLicenseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function ActivateLicenseModal({
  onClose,
  onSuccess,
}: ActivateLicenseModalProps) {
  const [licenseKey, setLicenseKey] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'key' | 'details'>('key');

  const formatLicenseKey = (value: string): string => {
    // Remove all non-alphanumeric characters
    const clean = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

    // Format as EIMS-XXXX-XXXX-XXXX
    if (clean.length <= 4) {
      if (clean.startsWith('EIMS')) return clean;
      return clean;
    }

    const parts: string[] = [];
    if (clean.startsWith('EIMS')) {
      parts.push('EIMS');
      const rest = clean.slice(4);
      for (let i = 0; i < rest.length; i += 4) {
        parts.push(rest.slice(i, i + 4));
      }
    } else {
      for (let i = 0; i < clean.length; i += 4) {
        parts.push(clean.slice(i, i + 4));
      }
    }

    return parts.join('-').slice(0, 19); // EIMS-XXXX-XXXX-XXXX = 19 chars
  };

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatLicenseKey(e.target.value);
    setLicenseKey(formatted);
    setError('');
  };

  const handleKeySubmit = () => {
    if (!isValidLicenseFormat(licenseKey)) {
      setError('Invalid license key format. Should be EIMS-XXXX-XXXX-XXXX');
      return;
    }
    setStep('details');
  };

  const handleActivate = async () => {
    if (!email.trim() || !phone.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await activateLicense(licenseKey, email.trim(), phone.trim());

      if (result.success) {
        onSuccess();
      } else {
        setError(result.message);
      }
    } catch {
      setError('Failed to activate license. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-b border-cyan-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔑</span>
              <h2 className="text-lg font-bold text-white">Activate License</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'key' ? (
            <div className="space-y-4">
              <p className="text-slate-400 text-sm">
                Enter your license key exactly as received via SMS or email.
              </p>

              <div>
                <label className="block text-sm text-slate-300 mb-2">License Key</label>
                <input
                  type="text"
                  value={licenseKey}
                  onChange={handleKeyChange}
                  placeholder="EIMS-XXXX-XXXX-XXXX"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-cyan-400 font-mono text-lg text-center tracking-wider focus:outline-none focus:border-cyan-500 uppercase"
                  maxLength={19}
                  autoFocus
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleKeySubmit}
                disabled={licenseKey.length !== 19}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setStep('key')}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sm text-slate-400">
                  License: <span className="text-cyan-400 font-mono">{licenseKey}</span>
                </span>
              </div>

              <p className="text-slate-400 text-sm">
                Please provide your contact details for license registration.
              </p>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setError(''); }}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                >
                  {error}
                </motion.p>
              )}

              <button
                onClick={handleActivate}
                disabled={isLoading || !email.trim() || !phone.trim()}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                    Activating...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Activate License
                  </>
                )}
              </button>
            </div>
          )}

          {/* Help Text */}
          <div className="mt-6 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-500 text-center">
              Don't have a license?{' '}
              <a
                href="/generator-oracle/purchase"
                className="text-cyan-400 hover:text-cyan-300"
              >
                Purchase here
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
