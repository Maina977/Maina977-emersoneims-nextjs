'use client';

/**
 * Generator Oracle Purchase Page
 * Complete purchase flow with payment verification
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { generateDeviceFingerprint } from '@/lib/generator-oracle/licensing';

type PaymentMethod = 'mpesa' | 'bank';
type Step = 'payment' | 'verification' | 'success';

const PAYMENT_INFO = {
  mpesa: {
    paybill: '247247',
    account: 'ORACLE',
    name: 'M-Pesa Paybill',
  },
  bank: {
    bank: 'Equity Bank',
    accountName: 'Emerson EIMS Ltd',
    accountNumber: '1234567890',
    branch: 'Nairobi CBD',
    swiftCode: 'EABORBI',
  },
};

export default function PurchasePage() {
  const [step, setStep] = useState<Step>('payment');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [formData, setFormData] = useState({
    transactionCode: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmitVerification = async () => {
    // Validate inputs
    if (!formData.transactionCode.trim()) {
      setError('Please enter the transaction code');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const deviceId = await generateDeviceFingerprint();

      const response = await fetch('/api/generator-oracle/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionCode: formData.transactionCode.trim().toUpperCase(),
          phone: formData.phone.trim(),
          email: formData.email.trim().toLowerCase(),
          paymentMethod,
          deviceId,
          amount: 5000,
          currency: 'KES',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Failed to submit verification request');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Back Link */}
        <Link
          href="/generator-oracle"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Generator Oracle
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {['payment', 'verification', 'success'].map((s, idx) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  step === s
                    ? 'bg-amber-500 text-white'
                    : idx < ['payment', 'verification', 'success'].indexOf(step)
                    ? 'bg-green-500 text-white'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {idx < ['payment', 'verification', 'success'].indexOf(step) ? '✓' : idx + 1}
              </div>
              {idx < 2 && (
                <div
                  className={`w-12 h-1 rounded ${
                    idx < ['payment', 'verification', 'success'].indexOf(step)
                      ? 'bg-green-500'
                      : 'bg-slate-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Payment */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Complete Your Purchase</h1>
                <p className="text-slate-400">Generator Oracle PRO - Lifetime Access</p>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-2 border-amber-500/50 rounded-2xl p-6 mb-6 text-center">
                <div className="text-4xl font-bold text-white mb-1">KES 5,000</div>
                <div className="text-amber-400">One-time payment • Lifetime access</div>
              </div>

              {/* Payment Method Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === 'mpesa'
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">📱</span>
                  M-Pesa
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                    paymentMethod === 'bank'
                      ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500'
                      : 'bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <span className="text-xl">🏦</span>
                  Bank Transfer
                </button>
              </div>

              {/* Payment Instructions */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 mb-6">
                {paymentMethod === 'mpesa' ? (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-green-400">📱</span> M-Pesa Payment
                    </h3>

                    <ol className="space-y-3 text-slate-300">
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                        <span>Go to M-Pesa on your phone</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                        <span>Select <strong>Lipa na M-Pesa</strong> → <strong>Pay Bill</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                        <div>
                          Enter Business Number: <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded">{PAYMENT_INFO.mpesa.paybill}</span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">4</span>
                        <div>
                          Enter Account Number: <span className="font-mono font-bold text-white bg-slate-800 px-2 py-1 rounded">{PAYMENT_INFO.mpesa.account}</span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">5</span>
                        <div>
                          Enter Amount: <span className="font-mono font-bold text-amber-400 bg-slate-800 px-2 py-1 rounded">5000</span>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-bold flex-shrink-0">6</span>
                        <span>Enter your M-Pesa PIN and confirm</span>
                      </li>
                    </ol>

                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <p className="text-sm text-green-400">
                        ✓ You will receive an M-Pesa confirmation SMS with a transaction code starting with letters (e.g., <span className="font-mono">QJK4XXXXX</span>)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <span className="text-blue-400">🏦</span> Bank Transfer
                    </h3>

                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">Bank Name</span>
                        <span className="text-white font-medium">{PAYMENT_INFO.bank.bank}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">Account Name</span>
                        <span className="text-white font-medium">{PAYMENT_INFO.bank.accountName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">Account Number</span>
                        <span className="text-white font-mono font-bold">{PAYMENT_INFO.bank.accountNumber}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">Branch</span>
                        <span className="text-white">{PAYMENT_INFO.bank.branch}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-slate-700">
                        <span className="text-slate-400">SWIFT Code</span>
                        <span className="text-white font-mono">{PAYMENT_INFO.bank.swiftCode}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-slate-400">Amount</span>
                        <span className="text-amber-400 font-bold">KES 5,000</span>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-400">
                        ✓ Use your bank's reference/transaction number for verification
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button
                onClick={() => setStep('verification')}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
              >
                I've Made the Payment - Continue
              </button>
            </motion.div>
          )}

          {/* Step 2: Verification */}
          {step === 'verification' && (
            <motion.div
              key="verification"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Verify Your Payment</h1>
                <p className="text-slate-400">Enter your payment details for verification</p>
              </div>

              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 space-y-6">
                {/* Transaction Code */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    {paymentMethod === 'mpesa' ? 'M-Pesa Transaction Code' : 'Bank Reference Number'}
                  </label>
                  <input
                    type="text"
                    value={formData.transactionCode}
                    onChange={e => handleInputChange('transactionCode', e.target.value.toUpperCase())}
                    placeholder={paymentMethod === 'mpesa' ? 'e.g., QJK4ABCDEF' : 'e.g., REF123456'}
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono text-lg tracking-wider focus:outline-none focus:border-amber-500 uppercase"
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    {paymentMethod === 'mpesa'
                      ? 'From your M-Pesa confirmation SMS'
                      : 'From your bank transfer receipt'}
                  </p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    License key will be sent to this number via SMS/WhatsApp
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    License key will also be sent here
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
                  >
                    <p className="text-red-400 text-sm">{error}</p>
                  </motion.div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setStep('payment')}
                    className="px-6 py-3 text-slate-400 hover:text-white transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmitVerification}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      <>
                        Submit for Verification
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
              >
                <motion.span
                  className="text-5xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ✓
                </motion.span>
              </motion.div>

              <h1 className="text-3xl font-bold text-white mb-4">
                Verification Request Submitted!
              </h1>

              <div className="bg-slate-900/80 border border-green-500/30 rounded-xl p-6 mb-6 text-left">
                <h3 className="text-lg font-bold text-white mb-4">What happens next?</h3>
                <ol className="space-y-4">
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                    <div>
                      <div className="text-white font-medium">Payment Verification</div>
                      <div className="text-slate-400 text-sm">We'll verify your payment within 1-24 hours</div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                    <div>
                      <div className="text-white font-medium">License Key Delivery</div>
                      <div className="text-slate-400 text-sm">Your license key will be sent via SMS and email to:
                        <div className="font-mono text-cyan-400 mt-1">{formData.phone}</div>
                        <div className="font-mono text-cyan-400">{formData.email}</div>
                      </div>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                    <div>
                      <div className="text-white font-medium">Activate & Use</div>
                      <div className="text-slate-400 text-sm">Enter your license key to unlock full access</div>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/generator-oracle"
                  className="flex-1 py-3 bg-slate-800 text-white font-medium rounded-xl hover:bg-slate-700 transition-all border border-slate-600"
                >
                  Return to Generator Oracle
                </Link>
                <a
                  href="https://wa.me/254768860665?text=Hi,%20I%20just%20submitted%20a%20payment%20verification%20for%20Generator%20Oracle.%20Transaction:%20"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-green-500/20 text-green-400 font-medium rounded-xl hover:bg-green-500/30 transition-all border border-green-500/30 flex items-center justify-center gap-2"
                >
                  <span>💬</span> Chat on WhatsApp
                </a>
              </div>

              <p className="text-slate-500 text-sm mt-6">
                Questions? Contact us at{' '}
                <a href="mailto:support@emersoneims.com" className="text-cyan-400">
                  support@emersoneims.com
                </a>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
