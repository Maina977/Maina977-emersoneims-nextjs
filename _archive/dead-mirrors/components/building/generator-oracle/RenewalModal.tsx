'use client';

/**
 * RenewalModal - License renewal payment flow
 * Extends license by 1 year upon payment verification
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type License } from '@/lib/generator-oracle/licensing';

// Business Details
const BUSINESS = {
  company: 'Emerson Industrial Maintenance Services Limited',
  phone: '0782914717',
  whatsapp: '254782914717',
};

const PAYMENT_INFO = {
  mpesa: {
    sendTo: '0782914717',
    instructions: 'M-Pesa > Send Money > 0782914717 > Amount: 20,000',
  },
  bank: {
    bank: 'Equity Bank',
    branch: 'Embakasi Branch',
    accountName: 'Emerson Industrial Maintenance Services Limited',
    accountNumber: '1320285133753',
  },
};

interface RenewalModalProps {
  license: License | null;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'payment' | 'verification' | 'success';
type PaymentMethod = 'mpesa' | 'bank';

export default function RenewalModal({ license, onClose, onSuccess }: RenewalModalProps) {
  const [step, setStep] = useState<Step>('payment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [transactionCode, setTransactionCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitRenewal = async () => {
    if (!transactionCode.trim()) {
      setError('Please enter the transaction code');
      return;
    }

    if (!license) {
      setError('No license found');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/generator-oracle/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionCode: transactionCode.trim().toUpperCase(),
          phone: license.phone,
          email: license.email,
          paymentMethod,
          amount: 20000,
          currency: 'KES',
          // Mark as renewal
          isRenewal: true,
          existingLicenseKey: license.key,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Failed to submit renewal request');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h2 className="text-lg font-bold text-white">Renew License</h2>
                <p className="text-amber-400 text-sm">Extend your subscription by 1 year</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Payment Instructions */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Price */}
                <div className="text-center p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="text-3xl font-bold text-white">KES 20,000</div>
                  <div className="text-amber-400 text-sm">Annual Renewal</div>
                </div>

                {/* Current License Info */}
                {license && (
                  <div className="p-3 bg-slate-800/50 rounded-lg text-sm">
                    <div className="flex justify-between text-slate-400">
                      <span>Current License:</span>
                      <span className="font-mono text-slate-300">{license.key.substring(0, 9)}...</span>
                    </div>
                    {license.expiresAt && (
                      <div className="flex justify-between text-slate-400 mt-1">
                        <span>Expires:</span>
                        <span className="text-red-400">{new Date(license.expiresAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Payment Method Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      paymentMethod === 'mpesa'
                        ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    📱 M-Pesa
                  </button>
                  <button
                    onClick={() => setPaymentMethod('bank')}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                      paymentMethod === 'bank'
                        ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    🏦 Bank
                  </button>
                </div>

                {/* Payment Details */}
                <div className="bg-slate-950/50 rounded-lg p-4">
                  {paymentMethod === 'mpesa' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Send to:</span>
                        <span className="text-white font-mono font-bold">{PAYMENT_INFO.mpesa.sendTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-amber-400 font-bold">KES 20,000</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">
                        {PAYMENT_INFO.mpesa.instructions}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bank:</span>
                        <span className="text-white">{PAYMENT_INFO.bank.bank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Branch:</span>
                        <span className="text-white">{PAYMENT_INFO.bank.branch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Account:</span>
                        <span className="text-white font-mono">{PAYMENT_INFO.bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Amount:</span>
                        <span className="text-amber-400 font-bold">KES 20,000</span>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setStep('verification')}
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                >
                  I've Made the Payment
                </button>
              </motion.div>
            )}

            {/* Step 2: Enter Transaction Code */}
            {step === 'verification' && (
              <motion.div
                key="verification"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-white">Enter Transaction Code</h3>
                  <p className="text-slate-400 text-sm">
                    From your {paymentMethod === 'mpesa' ? 'M-Pesa confirmation SMS' : 'bank transfer receipt'}
                  </p>
                </div>

                <input
                  type="text"
                  value={transactionCode}
                  onChange={e => {
                    setTransactionCode(e.target.value.toUpperCase());
                    setError('');
                  }}
                  placeholder={paymentMethod === 'mpesa' ? 'e.g., QJK4ABCDEF' : 'e.g., REF123456'}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-lg tracking-wider focus:outline-none focus:border-amber-500 uppercase"
                  autoFocus
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('payment')}
                    className="px-4 py-3 text-slate-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmitRenewal}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        Submitting...
                      </>
                    ) : (
                      'Submit for Verification'
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <motion.div
                  className="w-20 h-20 mx-auto rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring' }}
                >
                  <span className="text-4xl">✓</span>
                </motion.div>

                <h3 className="text-xl font-bold text-white">Renewal Request Submitted!</h3>

                <p className="text-slate-400">
                  We'll verify your payment within 1-24 hours. Your license will be extended by 1 year once verified.
                </p>

                <div className="bg-slate-800/50 rounded-lg p-4 text-left text-sm">
                  <div className="text-slate-400 mb-2">What happens next:</div>
                  <ol className="space-y-2 text-slate-300">
                    <li className="flex gap-2">
                      <span className="text-green-400">1.</span>
                      We verify your payment
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">2.</span>
                      Your license is extended by 1 year
                    </li>
                    <li className="flex gap-2">
                      <span className="text-green-400">3.</span>
                      Confirmation sent via WhatsApp/Email
                    </li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onSuccess}
                    className="flex-1 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-all"
                  >
                    Continue Using Oracle
                  </button>
                  <a
                    href={`https://wa.me/${BUSINESS.whatsapp}?text=Hi,%20I%20just%20submitted%20a%20renewal%20payment%20for%20Generator%20Oracle.%20Transaction:%20${transactionCode}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-green-500/20 text-green-400 font-medium rounded-xl hover:bg-green-500/30 transition-all border border-green-500/30 flex items-center justify-center gap-2"
                  >
                    💬 WhatsApp
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
