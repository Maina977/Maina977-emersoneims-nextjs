/**
 * GENERATOR ORACLE M-PESA CALLBACK
 * Receives payment confirmation from Safaricom
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseSTKCallback } from '@/lib/generator-oracle/mpesaService';
import {
  updatePaymentStatus,
  createSubscription,
} from '@/lib/generator-oracle/subscriptionService';
import { getPostgresPool } from '@/lib/db';

// ═══════════════════════════════════════════════════════════════════════════════
// POST - M-Pesa Callback
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

    const callbackData = parseSTKCallback(body);

    if (!callbackData) {
      console.error('Failed to parse M-Pesa callback');
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    }

    const { checkoutRequestId, resultCode, resultDesc, callbackMetadata } = callbackData;

    // Get payment record by checkout request ID
    const pool = await getPostgresPool();

    if (pool) {
      const paymentResult = await pool.query(
        `SELECT * FROM oracle_payments WHERE mpesa_checkout_request_id = $1`,
        [checkoutRequestId]
      );

      if (paymentResult.rows.length > 0) {
        const payment = paymentResult.rows[0] as Record<string, unknown>;
        const metadata = payment.metadata as Record<string, unknown>;
        const planId = metadata?.planId as string;
        const userId = payment.user_id as number;

        if (resultCode === 0) {
          // Payment successful
          const receiptNumber = callbackMetadata?.mpesaReceiptNumber;

          // Update payment status
          await updatePaymentStatus(
            payment.transaction_id as string,
            'completed',
            receiptNumber
          );

          // Activate subscription
          if (planId && userId) {
            await createSubscription(userId, planId, {
              mpesaReceiptNumber: receiptNumber,
            });

            console.log(`Subscription activated for user ${userId}: ${planId}`);
          }
        } else {
          // Payment failed
          await updatePaymentStatus(
            payment.transaction_id as string,
            'failed'
          );

          console.log(`Payment failed for user ${userId}: ${resultDesc}`);
        }
      }
    }

    // Always respond with success to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully',
    });
  } catch (error) {
    console.error('M-Pesa callback error:', error);

    // Still respond with success to avoid retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
    });
  }
}

// Allow GET for testing
export async function GET() {
  return NextResponse.json({
    message: 'M-Pesa callback endpoint is active',
    timestamp: new Date().toISOString(),
  });
}
