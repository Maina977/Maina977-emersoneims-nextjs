'use client';

/**
 * PaymentGate Component
 * Shows 70% of report clearly, locks 30% behind payment
 * Supports M-Pesa, Flutterwave, Paystack (configurable)
 */

import React, { useState } from 'react';

export interface PaymentGateProps {
  isUnlocked: boolean;
  onUnlock: () => void;
  productName: string;
  price: number;
  currency?: string;
  reportId?: string;
  children: React.ReactNode;
  lockedContent?: React.ReactNode;
}

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  productName: string;
  price: number;
  currency?: string;
  reportId?: string;
}

// Payment Modal Component
export function PaymentModal({
  isOpen,
  onClose,
  onPaymentSuccess,
  productName,
  price,
  currency = 'KES',
  reportId,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'select' | 'details' | 'processing' | 'success'>('select');

  if (!isOpen) return null;

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      alert('Please enter a valid phone number');
      return;
    }

    setIsProcessing(true);
    setStep('processing');

    // Simulate M-Pesa STK Push - Replace with actual API call
    // TODO: Integrate with actual M-Pesa API
    setTimeout(() => {
      setStep('success');
      setIsProcessing(false);
      // In production, this would be triggered by webhook callback
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 3000);
  };

  const handleCardPayment = async () => {
    setIsProcessing(true);
    setStep('processing');

    // TODO: Integrate with Flutterwave or Paystack
    setTimeout(() => {
      setStep('success');
      setIsProcessing(false);
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Unlock Full Report</h2>
              <p className="text-emerald-100 text-sm mt-1">{productName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* What You Get */}
          {step === 'select' && (
            <>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">What you'll unlock:</h3>
                <ul className="space-y-2">
                  {[
                    'Complete detailed analysis',
                    'All charts, graphs & visualizations',
                    'Satellite & geophysical data',
                    'Financial projections & ROI',
                    'Risk assessment & mitigation',
                    'Professional recommendations',
                    'Downloadable PDF report',
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-center">
                <p className="text-gray-500 text-sm">One-time payment</p>
                <p className="text-3xl font-bold text-gray-900">
                  {currency} {price.toLocaleString()}
                </p>
                {reportId && (
                  <p className="text-xs text-gray-400 mt-1">Report ID: {reportId}</p>
                )}
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <button
                  onClick={() => { setPaymentMethod('mpesa'); setStep('details'); }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition"
                >
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    M
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">M-Pesa</p>
                    <p className="text-sm text-gray-500">Pay with mobile money</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => { setPaymentMethod('card'); setStep('details'); }}
                  className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
                >
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-800">Card Payment</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}

          {/* M-Pesa Details */}
          {step === 'details' && paymentMethod === 'mpesa' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('select')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    M
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">M-Pesa Payment</p>
                    <p className="text-sm text-green-600">{currency} {price.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g., 0712345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  You will receive an STK push on this number
                </p>
              </div>

              <button
                onClick={handleMpesaPayment}
                disabled={!phoneNumber || phoneNumber.length < 10}
                className={`w-full py-4 rounded-xl font-bold text-white transition ${
                  phoneNumber && phoneNumber.length >= 10
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Pay {currency} {price.toLocaleString()} via M-Pesa
              </button>
            </div>
          )}

          {/* Card Details */}
          {step === 'details' && paymentMethod === 'card' && (
            <div className="space-y-4">
              <button
                onClick={() => setStep('select')}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <p className="text-blue-800">
                  Card payment integration coming soon.
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Please use M-Pesa for now.
                </p>
              </div>

              <button
                onClick={handleCardPayment}
                className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition"
              >
                Continue to Card Payment
              </button>
            </div>
          )}

          {/* Processing */}
          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800">Processing Payment</h3>
              <p className="text-gray-500 mt-2">
                {paymentMethod === 'mpesa'
                  ? 'Please check your phone for the M-Pesa prompt...'
                  : 'Please wait while we process your payment...'
                }
              </p>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Payment Successful!</h3>
              <p className="text-gray-500 mt-2">Unlocking your full report...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t">
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>Secure Payment</span>
            <span>|</span>
            <span>SSL Encrypted</span>
            <span>|</span>
            <span>Instant Delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Locked Content Overlay
export function LockedOverlay({
  onUnlock,
  price,
  currency = 'KES',
  sectionsLocked = 8,
}: {
  onUnlock: () => void;
  price: number;
  currency?: string;
  sectionsLocked?: number;
}) {
  return (
    <div className="relative">
      {/* Semi-transparent overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white z-10" />

      {/* Lock message */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center border border-gray-200">
          {/* Lock Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Unlock Full Report
          </h3>

          <p className="text-gray-600 mb-4">
            You've seen 70% of your analysis. Unlock the remaining <strong>{sectionsLocked} premium sections</strong> including detailed charts, financial projections, and expert recommendations.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500">One-time payment</p>
            <p className="text-3xl font-bold text-gray-900">
              {currency} {price.toLocaleString()}
            </p>
          </div>

          <button
            onClick={onUnlock}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-600 transition shadow-lg shadow-emerald-500/30"
          >
            Unlock Now - {currency} {price.toLocaleString()}
          </button>

          <p className="text-xs text-gray-400 mt-4">
            Secure payment via M-Pesa or Card
          </p>
        </div>
      </div>
    </div>
  );
}

// Main PaymentGate wrapper component
export function PaymentGate({
  isUnlocked,
  onUnlock,
  productName,
  price,
  currency = 'KES',
  reportId,
  children,
  lockedContent,
}: PaymentGateProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handleUnlockClick = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    onUnlock();
    setShowPaymentModal(false);
  };

  return (
    <>
      {/* Free content (70%) */}
      {children}

      {/* Locked content (30%) */}
      {!isUnlocked && lockedContent && (
        <div className="relative min-h-[400px]">
          {/* Blurred preview of locked content */}
          <div className="opacity-30 pointer-events-none select-none">
            {lockedContent}
          </div>

          {/* Overlay */}
          <LockedOverlay
            onUnlock={handleUnlockClick}
            price={price}
            currency={currency}
          />
        </div>
      )}

      {/* Unlocked content */}
      {isUnlocked && lockedContent}

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
        productName={productName}
        price={price}
        currency={currency}
        reportId={reportId}
      />
    </>
  );
}

export default PaymentGate;
