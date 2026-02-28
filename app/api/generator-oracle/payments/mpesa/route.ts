/**
 * GENERATOR ORACLE M-PESA PAYMENT API
 * Handles M-Pesa STK Push payments
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  initiateSTKPush,
  querySTKPushStatus,
  parseSTKCallback,
  isMpesaConfigured,
  getMpesaStatus,
  generateTransactionId,
  formatPhoneNumber,
  isValidKenyanPhone,
} from '@/lib/generator-oracle/mpesaService';
import {
  createPaymentRecord,
  updatePaymentStatus,
  createSubscription,
  getPlanById,
} from '@/lib/generator-oracle/subscriptionService';

// ═══════════════════════════════════════════════════════════════════════════════
// POST - Initiate M-Pesa Payment
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Check M-Pesa status
    if (action === 'status') {
      return NextResponse.json({
        success: true,
        mpesa: getMpesaStatus(),
      });
    }

    // Query transaction status
    if (action === 'query') {
      const { checkoutRequestId } = body;

      if (!checkoutRequestId) {
        return NextResponse.json(
          { success: false, error: 'Checkout request ID required' },
          { status: 400 }
        );
      }

      const status = await querySTKPushStatus(checkoutRequestId);
      return NextResponse.json(status);
    }

    // Initiate STK Push
    if (action === 'pay') {
      const { userId, planId, phoneNumber } = body;

      if (!userId || !planId || !phoneNumber) {
        return NextResponse.json(
          { success: false, error: 'Missing required fields: userId, planId, phoneNumber' },
          { status: 400 }
        );
      }

      if (!isMpesaConfigured()) {
        return NextResponse.json(
          { success: false, error: 'M-Pesa is not configured. Contact support.' },
          { status: 503 }
        );
      }

      if (!isValidKenyanPhone(phoneNumber)) {
        return NextResponse.json(
          { success: false, error: 'Invalid phone number. Use format: 0712345678' },
          { status: 400 }
        );
      }

      const plan = getPlanById(planId);
      if (!plan) {
        return NextResponse.json(
          { success: false, error: 'Invalid plan' },
          { status: 400 }
        );
      }

      if (plan.priceKES === 0) {
        return NextResponse.json(
          { success: false, error: 'Free plan does not require payment' },
          { status: 400 }
        );
      }

      const transactionId = generateTransactionId();
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.emersoneims.com';

      // Initiate STK Push
      const result = await initiateSTKPush({
        phoneNumber: formatPhoneNumber(phoneNumber),
        amount: plan.priceKES,
        accountReference: `GO-${planId.toUpperCase()}`,
        transactionDesc: `${plan.name} Plan`,
        callbackUrl: `${baseUrl}/api/generator-oracle/payments/mpesa/callback`,
      });

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error || 'Failed to initiate payment',
        });
      }

      // Create payment record
      await createPaymentRecord({
        userId: parseInt(userId),
        amount: plan.priceKES,
        currency: 'KES',
        paymentMethod: 'mpesa',
        transactionId,
        phoneNumber: formatPhoneNumber(phoneNumber),
        mpesaCheckoutRequestId: result.checkoutRequestId,
        metadata: {
          planId,
          merchantRequestId: result.merchantRequestId,
        },
      });

      return NextResponse.json({
        success: true,
        transactionId,
        checkoutRequestId: result.checkoutRequestId,
        customerMessage: result.customerMessage,
        message: 'Please check your phone and enter your M-Pesa PIN to complete the payment',
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('M-Pesa payment error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment request failed' },
      { status: 500 }
    );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// GET - Check payment status
// ═══════════════════════════════════════════════════════════════════════════════

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const checkoutRequestId = searchParams.get('checkoutRequestId');

  if (!checkoutRequestId) {
    return NextResponse.json({
      success: true,
      mpesa: getMpesaStatus(),
    });
  }

  const status = await querySTKPushStatus(checkoutRequestId);
  return NextResponse.json(status);
}
