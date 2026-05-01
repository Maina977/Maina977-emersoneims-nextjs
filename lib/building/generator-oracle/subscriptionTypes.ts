/**
 * GENERATOR ORACLE - SUBSCRIPTION TYPES & CONSTANTS
 * Client-safe types and constants for subscription management
 * (No database imports - safe for browser)
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION PLANS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  priceKES: number;
  priceUSD: number;
  interval: 'monthly' | 'yearly';
  features: string[];
  limits: {
    diagnosesPerMonth: number;
    aiDiagnosesPerMonth: number;
    reportsPerMonth: number;
    teamMembers: number;
    supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
  };
  isPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic access for occasional use',
    priceKES: 0,
    priceUSD: 0,
    interval: 'monthly',
    features: [
      '5 diagnoses per month',
      'Basic fault code lookup',
      'Community support',
    ],
    limits: {
      diagnosesPerMonth: 5,
      aiDiagnosesPerMonth: 0,
      reportsPerMonth: 1,
      teamMembers: 1,
      supportLevel: 'community',
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'For individual technicians',
    priceKES: 1500,
    priceUSD: 12,
    interval: 'monthly',
    features: [
      '50 diagnoses per month',
      '10 AI-powered diagnoses',
      '10 PDF reports',
      'Email support',
      'Offline access',
    ],
    limits: {
      diagnosesPerMonth: 50,
      aiDiagnosesPerMonth: 10,
      reportsPerMonth: 10,
      teamMembers: 1,
      supportLevel: 'email',
    },
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'For busy technicians & small teams',
    priceKES: 4500,
    priceUSD: 35,
    interval: 'monthly',
    features: [
      'Unlimited diagnoses',
      '100 AI-powered diagnoses',
      'Unlimited PDF reports',
      'Priority support',
      'Team access (up to 5)',
      'Parts ordering',
      'Customer database',
    ],
    limits: {
      diagnosesPerMonth: -1, // Unlimited
      aiDiagnosesPerMonth: 100,
      reportsPerMonth: -1,
      teamMembers: 5,
      supportLevel: 'priority',
    },
    isPopular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For service companies & dealers',
    priceKES: 15000,
    priceUSD: 120,
    interval: 'monthly',
    features: [
      'Everything in Pro',
      'Unlimited AI diagnoses',
      'Unlimited team members',
      'Dedicated support',
      'Custom branding',
      'API access',
      'Analytics dashboard',
      'White-label reports',
    ],
    limits: {
      diagnosesPerMonth: -1,
      aiDiagnosesPerMonth: -1,
      reportsPerMonth: -1,
      teamMembers: -1,
      supportLevel: 'dedicated',
    },
  },
];

// Yearly plans (20% discount)
export const YEARLY_PLANS: SubscriptionPlan[] = SUBSCRIPTION_PLANS.filter(p => p.id !== 'free').map(plan => ({
  ...plan,
  id: `${plan.id}_yearly`,
  interval: 'yearly' as const,
  priceKES: Math.round(plan.priceKES * 12 * 0.8),
  priceUSD: Math.round(plan.priceUSD * 12 * 0.8),
  features: [...plan.features, '20% yearly discount'],
}));

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface UserSubscription {
  id: number;
  userId: number;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  mpesaReceiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsageRecord {
  id: number;
  userId: number;
  periodStart: string;
  periodEnd: string;
  diagnosesUsed: number;
  aiDiagnosesUsed: number;
  reportsGenerated: number;
}

export interface PaymentTransaction {
  id: number;
  userId: number;
  subscriptionId?: number;
  amount: number;
  currency: 'KES' | 'USD';
  paymentMethod: 'mpesa' | 'stripe' | 'paypal';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  mpesaReceiptNumber?: string;
  stripePaymentIntentId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

// Helper function to get plan by ID
export function getPlanById(planId: string): SubscriptionPlan | undefined {
  return [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(p => p.id === planId);
}
