/**
 * GENERATOR ORACLE - SUBSCRIPTION MANAGER
 * Displays subscription status, usage, and upgrade options
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  Zap,
  TrendingUp,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Loader2,
  CheckCircle,
  X,
  CreditCard,
  History,
} from 'lucide-react';
import PricingPlans from './PricingPlans';
import PaymentModal from './PaymentModal';
import {
  type SubscriptionPlan,
  type UserSubscription,
  type UsageRecord,
  SUBSCRIPTION_PLANS,
} from '@/lib/generator-oracle/subscriptionService';

interface SubscriptionManagerProps {
  userId: number;
  onSubscriptionChange?: () => void;
}

export default function SubscriptionManager({
  userId,
  onSubscriptionChange,
}: SubscriptionManagerProps) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UsageRecord | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    try {
      const response = await fetch(`/api/generator-oracle/subscription?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setSubscription(data.subscription);
        setUsage(data.usage);
        setPlan(data.plan);
      }
    } catch (error) {
      console.error('Failed to fetch subscription:', error);
    }
    setIsLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Handle plan selection
  const handleSelectPlan = useCallback((selectedPlan: SubscriptionPlan) => {
    if (selectedPlan.priceKES === 0) {
      // Free plan - just activate
      setShowPlans(false);
      return;
    }

    setSelectedPlan(selectedPlan);
    setShowPayment(true);
  }, []);

  // Handle successful payment
  const handlePaymentSuccess = useCallback(() => {
    setShowPayment(false);
    setShowPlans(false);
    fetchSubscription();
    onSubscriptionChange?.();
  }, [fetchSubscription, onSubscriptionChange]);

  // Calculate usage percentage
  const getUsagePercentage = (used: number, limit: number): number => {
    if (limit === -1) return 0; // Unlimited
    return Math.min(100, Math.round((used / limit) * 100));
  };

  // Format date
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Days remaining in period
  const getDaysRemaining = (): number => {
    if (!subscription?.currentPeriodEnd) return 0;
    const end = new Date(subscription.currentPeriodEnd);
    const now = new Date();
    return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-white">Subscription</h3>
          </div>
          {plan && plan.id !== 'free' && (
            <span className="px-2 py-1 bg-orange-500/20 text-orange-500 text-xs font-medium rounded">
              {plan.name}
            </span>
          )}
        </div>

        <div className="p-4 space-y-4">
          {/* Current Plan */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">{plan?.name || 'Free'} Plan</p>
              <p className="text-sm text-gray-400">
                {subscription?.status === 'active' ? (
                  <>Renews {formatDate(subscription.currentPeriodEnd)}</>
                ) : (
                  'No active subscription'
                )}
              </p>
            </div>
            {plan && plan.id === 'free' && (
              <button
                onClick={() => setShowPlans(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-500"
              >
                Upgrade
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Usage Stats */}
          {plan && usage && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">This Month's Usage</h4>

              {/* Diagnoses */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Diagnoses</span>
                  <span className="text-white">
                    {usage.diagnosesUsed}
                    {plan.limits.diagnosesPerMonth !== -1 && (
                      <span className="text-gray-500"> / {plan.limits.diagnosesPerMonth}</span>
                    )}
                    {plan.limits.diagnosesPerMonth === -1 && (
                      <span className="text-gray-500"> (Unlimited)</span>
                    )}
                  </span>
                </div>
                {plan.limits.diagnosesPerMonth !== -1 && (
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        getUsagePercentage(usage.diagnosesUsed, plan.limits.diagnosesPerMonth) > 80
                          ? 'bg-red-500'
                          : 'bg-orange-500'
                      }`}
                      style={{
                        width: `${getUsagePercentage(usage.diagnosesUsed, plan.limits.diagnosesPerMonth)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* AI Diagnoses */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">AI Diagnoses</span>
                  <span className="text-white">
                    {usage.aiDiagnosesUsed}
                    {plan.limits.aiDiagnosesPerMonth !== -1 && (
                      <span className="text-gray-500"> / {plan.limits.aiDiagnosesPerMonth}</span>
                    )}
                    {plan.limits.aiDiagnosesPerMonth === -1 && (
                      <span className="text-gray-500"> (Unlimited)</span>
                    )}
                  </span>
                </div>
                {plan.limits.aiDiagnosesPerMonth !== -1 && (
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        getUsagePercentage(usage.aiDiagnosesUsed, plan.limits.aiDiagnosesPerMonth) > 80
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${getUsagePercentage(usage.aiDiagnosesUsed, plan.limits.aiDiagnosesPerMonth)}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Reports */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">PDF Reports</span>
                  <span className="text-white">
                    {usage.reportsGenerated}
                    {plan.limits.reportsPerMonth !== -1 && (
                      <span className="text-gray-500"> / {plan.limits.reportsPerMonth}</span>
                    )}
                    {plan.limits.reportsPerMonth === -1 && (
                      <span className="text-gray-500"> (Unlimited)</span>
                    )}
                  </span>
                </div>
                {plan.limits.reportsPerMonth !== -1 && (
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        getUsagePercentage(usage.reportsGenerated, plan.limits.reportsPerMonth) > 80
                          ? 'bg-red-500'
                          : 'bg-green-500'
                      }`}
                      style={{
                        width: `${getUsagePercentage(usage.reportsGenerated, plan.limits.reportsPerMonth)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Low usage warning */}
          {plan && plan.id !== 'free' && getDaysRemaining() <= 7 && (
            <div className="flex items-center gap-2 p-3 bg-yellow-900/30 border border-yellow-700 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-400 font-medium">
                  {getDaysRemaining()} days remaining
                </p>
                <p className="text-yellow-400/70">
                  Your subscription renews on {formatDate(subscription?.currentPeriodEnd || '')}
                </p>
              </div>
            </div>
          )}

          {/* Upgrade prompt for free users */}
          {plan && plan.id === 'free' && (
            <div className="p-4 bg-gradient-to-r from-orange-900/30 to-red-900/30 border border-orange-700/50 rounded-lg">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-orange-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-white mb-1">
                    Unlock More Features
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Upgrade to get unlimited diagnoses, AI-powered analysis, and professional reports.
                  </p>
                  <button
                    onClick={() => setShowPlans(true)}
                    className="flex items-center gap-1 text-sm text-orange-500 font-medium hover:text-orange-400"
                  >
                    View Plans
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowPlans(true)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm hover:bg-gray-600"
            >
              <TrendingUp className="w-4 h-4" />
              {plan?.id === 'free' ? 'View Plans' : 'Change Plan'}
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-white text-sm hover:bg-gray-600">
              <History className="w-4 h-4" />
              History
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Plans Modal */}
      {showPlans && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-6xl my-8">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Choose Your Plan</h2>
              <button
                onClick={() => setShowPlans(false)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <PricingPlans
              currentPlanId={subscription?.planId}
              onSelectPlan={handleSelectPlan}
            />
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPayment && selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          userId={userId}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
