/**
 * GENERATOR ORACLE - PRICING PLANS
 * Subscription plan selection and pricing display
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

'use client';

import React, { useState } from 'react';
import {
  Check,
  Star,
  Zap,
  Shield,
  Users,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, YEARLY_PLANS, type SubscriptionPlan } from '@/lib/generator-oracle/subscriptionService';

interface PricingPlansProps {
  currentPlanId?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
  isLoading?: boolean;
}

export default function PricingPlans({
  currentPlanId,
  onSelectPlan,
  isLoading = false,
}: PricingPlansProps) {
  const [interval, setInterval] = useState<'monthly' | 'yearly'>('monthly');

  const plans = interval === 'yearly'
    ? [...SUBSCRIPTION_PLANS.filter(p => p.id === 'free'), ...YEARLY_PLANS]
    : SUBSCRIPTION_PLANS;

  const getIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'basic':
      case 'basic_yearly':
        return <Shield className="w-6 h-6" />;
      case 'pro':
      case 'pro_yearly':
        return <Star className="w-6 h-6" />;
      case 'enterprise':
      case 'enterprise_yearly':
        return <Users className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  const formatPrice = (plan: SubscriptionPlan, currency: 'KES' | 'USD' = 'KES') => {
    const price = currency === 'KES' ? plan.priceKES : plan.priceUSD;
    if (price === 0) return 'Free';

    const formatted = currency === 'KES'
      ? `KES ${price.toLocaleString()}`
      : `$${price}`;

    return formatted;
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Choose Your Plan
        </h2>
        <p className="text-gray-400">
          Unlock the full power of Generator Oracle
        </p>
      </div>

      {/* Interval Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setInterval('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'monthly'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              interval === 'yearly'
                ? 'bg-orange-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Yearly
            <span className="ml-1 text-xs text-green-400">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlanId === plan.id;
          const isPro = plan.id === 'pro' || plan.id === 'pro_yearly';

          return (
            <div
              key={plan.id}
              className={`relative bg-gray-900 rounded-xl border-2 p-6 flex flex-col ${
                isPro
                  ? 'border-orange-500 shadow-lg shadow-orange-500/20'
                  : 'border-gray-700'
              }`}
            >
              {/* Popular badge */}
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="text-center mb-6">
                <div className={`inline-flex p-3 rounded-full mb-3 ${
                  isPro ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-800 text-gray-400'
                }`}>
                  {getIcon(plan.id)}
                </div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-white">
                  {formatPrice(plan)}
                </div>
                {plan.priceKES > 0 && (
                  <div className="text-sm text-gray-500">
                    {formatPrice(plan, 'USD')} USD
                  </div>
                )}
                <div className="text-sm text-gray-400">
                  {plan.priceKES > 0 ? `per ${plan.interval === 'yearly' ? 'year' : 'month'}` : 'forever'}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => onSelectPlan(plan)}
                disabled={isLoading || isCurrentPlan}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                  isCurrentPlan
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : isPro
                    ? 'bg-orange-600 text-white hover:bg-orange-500'
                    : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : plan.priceKES === 0 ? (
                  'Get Started'
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Payment methods */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-400 mb-2">Secure payment via</p>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
            <span className="text-green-500 font-bold">M-PESA</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
            <span className="text-blue-500 font-bold">VISA</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
            <span className="text-yellow-500 font-bold">Mastercard</span>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="text-center mt-6">
        <a
          href="https://wa.me/254720123456"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <MessageCircle className="w-4 h-4" />
          Need help? Chat with us on WhatsApp
        </a>
      </div>
    </div>
  );
}
