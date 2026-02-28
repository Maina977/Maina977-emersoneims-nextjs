/**
 * GENERATOR ORACLE - SUBSCRIPTION SERVICE
 * Manages subscription plans, usage tracking, and billing
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { getPostgresPool } from '@/lib/db';

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

// ═══════════════════════════════════════════════════════════════════════════════
// DATABASE INITIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function initSubscriptionTables(): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    // Subscriptions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        plan_id VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        cancel_at_period_end BOOLEAN DEFAULT FALSE,
        stripe_subscription_id VARCHAR(100),
        stripe_customer_id VARCHAR(100),
        mpesa_receipt_number VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    // Usage tracking table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_usage (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        period_start TIMESTAMP WITH TIME ZONE NOT NULL,
        period_end TIMESTAMP WITH TIME ZONE NOT NULL,
        diagnoses_used INTEGER DEFAULT 0,
        ai_diagnoses_used INTEGER DEFAULT 0,
        reports_generated INTEGER DEFAULT 0,
        UNIQUE(user_id, period_start)
      )
    `);

    // Payment transactions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS oracle_payments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        subscription_id INTEGER,
        amount DECIMAL(12, 2) NOT NULL,
        currency VARCHAR(3) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        transaction_id VARCHAR(100) UNIQUE,
        mpesa_receipt_number VARCHAR(50),
        mpesa_checkout_request_id VARCHAR(100),
        stripe_payment_intent_id VARCHAR(100),
        stripe_invoice_id VARCHAR(100),
        phone_number VARCHAR(20),
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP WITH TIME ZONE
      )
    `);

    // Create indexes
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON oracle_subscriptions(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON oracle_subscriptions(status)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_usage_user ON oracle_usage(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_payments_user ON oracle_payments(user_id)`);
    await pool.query(`CREATE INDEX IF NOT EXISTS idx_payments_status ON oracle_payments(status)`);

    return true;
  } catch (error) {
    console.error('Failed to init subscription tables:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get user's current subscription
 */
export async function getUserSubscription(userId: number): Promise<UserSubscription | null> {
  const pool = await getPostgresPool();
  if (!pool) return getDefaultSubscription(userId);

  try {
    await initSubscriptionTables();

    const result = await pool.query(
      `SELECT * FROM oracle_subscriptions
       WHERE user_id = $1 AND status IN ('active', 'past_due')
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );

    if (result.rows.length === 0) {
      return getDefaultSubscription(userId);
    }

    const row = result.rows[0] as Record<string, unknown>;
    return mapSubscriptionRow(row);
  } catch (error) {
    console.error('Failed to get subscription:', error);
    return getDefaultSubscription(userId);
  }
}

/**
 * Create or update subscription
 */
export async function createSubscription(
  userId: number,
  planId: string,
  paymentDetails?: {
    stripeSubscriptionId?: string;
    stripeCustomerId?: string;
    mpesaReceiptNumber?: string;
  }
): Promise<UserSubscription | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  const plan = [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(p => p.id === planId);
  if (!plan) return null;

  const now = new Date();
  const periodEnd = new Date(now);
  if (plan.interval === 'yearly') {
    periodEnd.setFullYear(periodEnd.getFullYear() + 1);
  } else {
    periodEnd.setMonth(periodEnd.getMonth() + 1);
  }

  try {
    await initSubscriptionTables();

    // Cancel existing subscription
    await pool.query(
      `UPDATE oracle_subscriptions SET status = 'cancelled', updated_at = NOW()
       WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );

    // Create new subscription
    const result = await pool.query(
      `INSERT INTO oracle_subscriptions (
        user_id, plan_id, status, current_period_start, current_period_end,
        stripe_subscription_id, stripe_customer_id, mpesa_receipt_number
      ) VALUES ($1, $2, 'active', $3, $4, $5, $6, $7)
      RETURNING *`,
      [
        userId,
        planId,
        now.toISOString(),
        periodEnd.toISOString(),
        paymentDetails?.stripeSubscriptionId || null,
        paymentDetails?.stripeCustomerId || null,
        paymentDetails?.mpesaReceiptNumber || null,
      ]
    );

    // Reset usage for new period
    await resetUserUsage(userId, now, periodEnd);

    return mapSubscriptionRow(result.rows[0] as Record<string, unknown>);
  } catch (error) {
    console.error('Failed to create subscription:', error);
    return null;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  userId: number,
  immediate: boolean = false
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    if (immediate) {
      await pool.query(
        `UPDATE oracle_subscriptions SET status = 'cancelled', updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );
    } else {
      await pool.query(
        `UPDATE oracle_subscriptions SET cancel_at_period_end = TRUE, updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );
    }
    return true;
  } catch {
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// USAGE TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get current usage for user
 */
export async function getUserUsage(userId: number): Promise<UsageRecord | null> {
  const pool = await getPostgresPool();
  if (!pool) return getDefaultUsage(userId);

  try {
    await initSubscriptionTables();

    const now = new Date();
    const result = await pool.query(
      `SELECT * FROM oracle_usage
       WHERE user_id = $1 AND period_start <= $2 AND period_end > $2`,
      [userId, now.toISOString()]
    );

    if (result.rows.length === 0) {
      // Create usage record for current period
      const subscription = await getUserSubscription(userId);
      const periodStart = subscription?.currentPeriodStart
        ? new Date(subscription.currentPeriodStart)
        : getMonthStart(now);
      const periodEnd = subscription?.currentPeriodEnd
        ? new Date(subscription.currentPeriodEnd)
        : getMonthEnd(now);

      return await resetUserUsage(userId, periodStart, periodEnd);
    }

    const row = result.rows[0] as Record<string, unknown>;
    return {
      id: row.id as number,
      userId: row.user_id as number,
      periodStart: (row.period_start as Date).toISOString(),
      periodEnd: (row.period_end as Date).toISOString(),
      diagnosesUsed: row.diagnoses_used as number,
      aiDiagnosesUsed: row.ai_diagnoses_used as number,
      reportsGenerated: row.reports_generated as number,
    };
  } catch (error) {
    console.error('Failed to get usage:', error);
    return getDefaultUsage(userId);
  }
}

/**
 * Increment usage counter
 */
export async function incrementUsage(
  userId: number,
  type: 'diagnosis' | 'ai_diagnosis' | 'report'
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return true; // Allow in offline mode

  try {
    const column = type === 'diagnosis' ? 'diagnoses_used'
      : type === 'ai_diagnosis' ? 'ai_diagnoses_used'
      : 'reports_generated';

    const now = new Date();
    await pool.query(
      `UPDATE oracle_usage SET ${column} = ${column} + 1
       WHERE user_id = $1 AND period_start <= $2 AND period_end > $2`,
      [userId, now.toISOString()]
    );

    return true;
  } catch {
    return false;
  }
}

/**
 * Check if user can perform action based on limits
 */
export async function checkUsageLimit(
  userId: number,
  type: 'diagnosis' | 'ai_diagnosis' | 'report'
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const subscription = await getUserSubscription(userId);
  const usage = await getUserUsage(userId);
  const plan = [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(
    p => p.id === subscription?.planId
  ) || SUBSCRIPTION_PLANS[0];

  const limit = type === 'diagnosis' ? plan.limits.diagnosesPerMonth
    : type === 'ai_diagnosis' ? plan.limits.aiDiagnosesPerMonth
    : plan.limits.reportsPerMonth;

  const used = type === 'diagnosis' ? (usage?.diagnosesUsed || 0)
    : type === 'ai_diagnosis' ? (usage?.aiDiagnosesUsed || 0)
    : (usage?.reportsGenerated || 0);

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, remaining: -1, limit: -1 };
  }

  const remaining = Math.max(0, limit - used);
  return {
    allowed: remaining > 0,
    remaining,
    limit,
  };
}

/**
 * Reset usage for new period
 */
async function resetUserUsage(
  userId: number,
  periodStart: Date,
  periodEnd: Date
): Promise<UsageRecord> {
  const pool = await getPostgresPool();

  const defaultUsage: UsageRecord = {
    id: 0,
    userId,
    periodStart: periodStart.toISOString(),
    periodEnd: periodEnd.toISOString(),
    diagnosesUsed: 0,
    aiDiagnosesUsed: 0,
    reportsGenerated: 0,
  };

  if (!pool) return defaultUsage;

  try {
    const result = await pool.query(
      `INSERT INTO oracle_usage (user_id, period_start, period_end)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, period_start) DO UPDATE SET
         period_end = EXCLUDED.period_end
       RETURNING *`,
      [userId, periodStart.toISOString(), periodEnd.toISOString()]
    );

    const row = result.rows[0] as Record<string, unknown>;
    return {
      id: row.id as number,
      userId: row.user_id as number,
      periodStart: (row.period_start as Date).toISOString(),
      periodEnd: (row.period_end as Date).toISOString(),
      diagnosesUsed: row.diagnoses_used as number,
      aiDiagnosesUsed: row.ai_diagnoses_used as number,
      reportsGenerated: row.reports_generated as number,
    };
  } catch {
    return defaultUsage;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT TRANSACTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Create payment record
 */
export async function createPaymentRecord(payment: {
  userId: number;
  subscriptionId?: number;
  amount: number;
  currency: 'KES' | 'USD';
  paymentMethod: 'mpesa' | 'stripe' | 'paypal';
  transactionId: string;
  phoneNumber?: string;
  mpesaCheckoutRequestId?: string;
  metadata?: Record<string, unknown>;
}): Promise<number | null> {
  const pool = await getPostgresPool();
  if (!pool) return null;

  try {
    await initSubscriptionTables();

    const result = await pool.query(
      `INSERT INTO oracle_payments (
        user_id, subscription_id, amount, currency, payment_method,
        status, transaction_id, phone_number, mpesa_checkout_request_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)
      RETURNING id`,
      [
        payment.userId,
        payment.subscriptionId || null,
        payment.amount,
        payment.currency,
        payment.paymentMethod,
        payment.transactionId,
        payment.phoneNumber || null,
        payment.mpesaCheckoutRequestId || null,
        JSON.stringify(payment.metadata || {}),
      ]
    );

    return result.rows[0].id as number;
  } catch (error) {
    console.error('Failed to create payment record:', error);
    return null;
  }
}

/**
 * Update payment status
 */
export async function updatePaymentStatus(
  transactionId: string,
  status: 'completed' | 'failed' | 'refunded',
  receiptNumber?: string
): Promise<boolean> {
  const pool = await getPostgresPool();
  if (!pool) return false;

  try {
    await pool.query(
      `UPDATE oracle_payments SET
        status = $1,
        mpesa_receipt_number = COALESCE($2, mpesa_receipt_number),
        completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END
       WHERE transaction_id = $3`,
      [status, receiptNumber, transactionId]
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * Get user's payment history
 */
export async function getUserPayments(userId: number, limit: number = 20): Promise<PaymentTransaction[]> {
  const pool = await getPostgresPool();
  if (!pool) return [];

  try {
    const result = await pool.query(
      `SELECT * FROM oracle_payments WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
      [userId, limit]
    );

    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as number,
      userId: row.user_id as number,
      subscriptionId: row.subscription_id as number | undefined,
      amount: parseFloat(row.amount as string),
      currency: row.currency as 'KES' | 'USD',
      paymentMethod: row.payment_method as 'mpesa' | 'stripe' | 'paypal',
      status: row.status as 'pending' | 'completed' | 'failed' | 'refunded',
      transactionId: row.transaction_id as string,
      mpesaReceiptNumber: row.mpesa_receipt_number as string | undefined,
      stripePaymentIntentId: row.stripe_payment_intent_id as string | undefined,
      metadata: row.metadata as Record<string, unknown> | undefined,
      createdAt: (row.created_at as Date).toISOString(),
    }));
  } catch {
    return [];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

function getDefaultSubscription(userId: number): UserSubscription {
  const now = new Date();
  return {
    id: 0,
    userId,
    planId: 'free',
    status: 'active',
    currentPeriodStart: getMonthStart(now).toISOString(),
    currentPeriodEnd: getMonthEnd(now).toISOString(),
    cancelAtPeriodEnd: false,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

function getDefaultUsage(userId: number): UsageRecord {
  const now = new Date();
  return {
    id: 0,
    userId,
    periodStart: getMonthStart(now).toISOString(),
    periodEnd: getMonthEnd(now).toISOString(),
    diagnosesUsed: 0,
    aiDiagnosesUsed: 0,
    reportsGenerated: 0,
  };
}

function mapSubscriptionRow(row: Record<string, unknown>): UserSubscription {
  return {
    id: row.id as number,
    userId: row.user_id as number,
    planId: row.plan_id as string,
    status: row.status as UserSubscription['status'],
    currentPeriodStart: (row.current_period_start as Date).toISOString(),
    currentPeriodEnd: (row.current_period_end as Date).toISOString(),
    cancelAtPeriodEnd: row.cancel_at_period_end as boolean,
    stripeSubscriptionId: row.stripe_subscription_id as string | undefined,
    mpesaReceiptNumber: row.mpesa_receipt_number as string | undefined,
    createdAt: (row.created_at as Date).toISOString(),
    updatedAt: (row.updated_at as Date).toISOString(),
  };
}

function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * Get plan by ID
 */
export function getPlanById(planId: string): SubscriptionPlan | null {
  return [...SUBSCRIPTION_PLANS, ...YEARLY_PLANS].find(p => p.id === planId) || null;
}
