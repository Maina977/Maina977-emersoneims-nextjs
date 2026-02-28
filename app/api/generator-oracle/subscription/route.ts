/**
 * GENERATOR ORACLE SUBSCRIPTION API
 * Manages user subscriptions and usage
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getUserSubscription,
  getUserUsage,
  checkUsageLimit,
  incrementUsage,
  cancelSubscription,
  createSubscription,
  getUserPayments,
  SUBSCRIPTION_PLANS,
  YEARLY_PLANS,
  getPlanById,
} from '@/lib/generator-oracle/subscriptionService';

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Get subscription info
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const action = searchParams.get('action');

    // Get plans
    if (action === 'plans') {
      const interval = searchParams.get('interval') || 'monthly';

      return NextResponse.json({
        success: true,
        plans: interval === 'yearly' ? YEARLY_PLANS : SUBSCRIPTION_PLANS,
      });
    }

    // Check usage limit
    if (action === 'check-limit' && userId) {
      const type = searchParams.get('type') as 'diagnosis' | 'ai_diagnosis' | 'report';

      if (!type) {
        return NextResponse.json(
          { success: false, error: 'Type required' },
          { status: 400 }
        );
      }

      const result = await checkUsageLimit(parseInt(userId), type);
      return NextResponse.json({
        success: true,
        ...result,
      });
    }

    // Get payment history
    if (action === 'payments' && userId) {
      const payments = await getUserPayments(parseInt(userId));
      return NextResponse.json({
        success: true,
        payments,
      });
    }

    // Get subscription and usage
    if (userId) {
      const [subscription, usage] = await Promise.all([
        getUserSubscription(parseInt(userId)),
        getUserUsage(parseInt(userId)),
      ]);

      const plan = getPlanById(subscription?.planId || 'free');

      return NextResponse.json({
        success: true,
        subscription,
        usage,
        plan,
      });
    }

    return NextResponse.json(
      { success: false, error: 'User ID required' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Subscription GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get subscription info' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Subscription actions
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    // Increment usage
    if (action === 'increment-usage') {
      const { type } = body;

      if (!type) {
        return NextResponse.json(
          { success: false, error: 'Type required' },
          { status: 400 }
        );
      }

      // Check limit first
      const limit = await checkUsageLimit(parseInt(userId), type);

      if (!limit.allowed) {
        return NextResponse.json({
          success: false,
          error: 'Usage limit reached',
          limit: limit.limit,
          remaining: limit.remaining,
          upgradeRequired: true,
        });
      }

      await incrementUsage(parseInt(userId), type);

      return NextResponse.json({
        success: true,
        remaining: limit.remaining - 1,
        limit: limit.limit,
      });
    }

    // Activate free plan (for new users)
    if (action === 'activate-free') {
      const subscription = await createSubscription(parseInt(userId), 'free');

      return NextResponse.json({
        success: true,
        subscription,
        message: 'Free plan activated',
      });
    }

    // Cancel subscription
    if (action === 'cancel') {
      const { immediate } = body;
      const success = await cancelSubscription(parseInt(userId), immediate);

      return NextResponse.json({
        success,
        message: immediate
          ? 'Subscription cancelled immediately'
          : 'Subscription will cancel at end of billing period',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Subscription POST error:', error);
    return NextResponse.json(
      { success: false, error: 'Subscription action failed' },
      { status: 500 }
    );
  }
}
