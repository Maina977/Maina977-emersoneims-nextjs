/**
 * GENERATOR ORACLE - PAYMENT MODAL
 * M-Pesa STK Push payment flow
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Phone,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  CreditCard,
  Smartphone,
} from 'lucide-react';
import { type SubscriptionPlan } from '@/lib/generator-oracle/subscriptionService';

interface PaymentModalProps {
  plan: SubscriptionPlan;
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

type PaymentStatus = 'idle' | 'processing' | 'pending' | 'success' | 'failed';

export default function PaymentModal({
  plan,
  userId,
  onClose,
  onSuccess,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll for payment status
  useEffect(() => {
    if (status !== 'pending' || !checkoutRequestId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/generator-oracle/payments/mpesa?checkoutRequestId=${checkoutRequestId}`
        );
        const data = await response.json();

        if (data.success) {
          setStatus('success');
          clearInterval(interval);
          setTimeout(onSuccess, 2000);
        } else if (data.resultCode && data.resultCode !== 0) {
          setStatus('failed');
          setError(data.resultDesc || 'Payment was cancelled or failed');
          clearInterval(interval);
        }

        setPollCount(prev => prev + 1);

        // Stop polling after 2 minutes
        if (pollCount > 24) {
          clearInterval(interval);
          setStatus('failed');
          setError('Payment verification timed out. If you completed the payment, please contact support.');
        }
      } catch {
        // Continue polling on error
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [status, checkoutRequestId, pollCount, onSuccess]);

  // Initiate M-Pesa payment
  const initiateMpesaPayment = useCallback(async () => {
    if (!phoneNumber) {
      setError('Please enter your M-Pesa phone number');
      return;
    }

    setStatus('processing');
    setError(null);

    try {
      const response = await fetch('/api/generator-oracle/payments/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pay',
          userId,
          planId: plan.id,
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setCheckoutRequestId(data.checkoutRequestId);
        setStatus('pending');
        setPollCount(0);
      } else {
        setStatus('failed');
        setError(data.error || 'Failed to initiate payment');
      }
    } catch {
      setStatus('failed');
      setError('Network error. Please try again.');
    }
  }, [phoneNumber, userId, plan.id]);

  // Retry payment
  const handleRetry = useCallback(() => {
    setStatus('idle');
    setError(null);
    setCheckoutRequestId(null);
    setPollCount(0);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div>
            <h2 className="text-lg font-bold text-white">Subscribe to {plan.name}</h2>
            <p className="text-sm text-gray-400">
              KES {plan.priceKES.toLocaleString()} / {plan.interval}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={status === 'processing' || status === 'pending'}
            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Idle / Input State */}
          {status === 'idle' && (
            <>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('mpesa')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'mpesa'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-green-500" />
                    <span className="font-semibold text-green-500">M-PESA</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold text-blue-500">Card</span>
                  </button>
                </div>
              </div>

              {/* M-Pesa Phone Input */}
              {paymentMethod === 'mpesa' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="0712 345 678"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You will receive an STK push on this number
                  </p>
                </div>
              )}

              {/* Card Payment (Coming Soon) */}
              {paymentMethod === 'card' && (
                <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center">
                  <CreditCard className="w-12 h-12 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-400">Card payments coming soon</p>
                  <p className="text-sm text-gray-500">Use M-Pesa for now</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              {/* Pay Button */}
              <button
                onClick={initiateMpesaPayment}
                disabled={paymentMethod === 'card'}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay KES {plan.priceKES.toLocaleString()} with M-Pesa
              </button>
            </>
          )}

          {/* Processing State */}
          {status === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Initiating Payment...
              </h3>
              <p className="text-gray-400">
                Please wait while we connect to M-Pesa
              </p>
            </div>
          )}

          {/* Pending State - Waiting for PIN */}
          {status === 'pending' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-500 animate-pulse" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Check Your Phone
              </h3>
              <p className="text-gray-400 mb-4">
                Enter your M-Pesa PIN to complete the payment
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for confirmation...
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Payment Successful!
              </h3>
              <p className="text-gray-400 mb-4">
                Your {plan.name} plan is now active
              </p>
              <p className="text-sm text-green-400">
                Redirecting...
              </p>
            </div>
          )}

          {/* Failed State */}
          {status === 'failed' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Payment Failed
              </h3>
              <p className="text-gray-400 mb-4">
                {error || 'The payment could not be completed'}
              </p>
              <button
                onClick={handleRetry}
                className="flex items-center gap-2 mx-auto px-4 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 text-center">
          <p className="text-xs text-gray-500">
            Secured by Safaricom M-Pesa
          </p>
        </div>
      </div>
    </div>
  );
}
