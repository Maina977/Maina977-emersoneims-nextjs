/**
 * GENERATOR ORACLE M-PESA CALLBACK
 * Receives payment confirmation from Safaricom
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 *
 * Security sweep 2026-11-26: this URL is public and Safaricom's callback is
 * not signed, so a forged "ResultCode 0" body for a known CheckoutRequestID
 * (the payer gets their own id back from /payments/mpesa) used to mark the
 * payment completed with a made-up receipt and activate the paid plan. A
 * success is now acted on only when (1) the payment is still pending,
 * (2) the callback amount equals the stored amount, and (3) Safaricom itself
 * confirms the CheckoutRequestID as paid (STK Push Query). The full callback
 * body (payer phone) is no longer logged.
 */

import { NextRequest, NextResponse } from 'next/server';
import { parseSTKCallback, querySTKPushStatus } from '@/lib/generator-oracle/mpesaService';
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
        const pending = payment.status === 'pending';

        if (resultCode === 0) {
          // Payment successful: only for a pending payment, the stored amount,
          // and when Safaricom confirms it (a callback body alone proves nothing).
          const receiptNumber = callbackMetadata?.mpesaReceiptNumber;
          const amountMatches = Number(callbackMetadata?.amount) === Number(payment.amount);
          if (!pending || !amountMatches) {
            console.warn('M-Pesa callback ignored: payment not pending or amount mismatch');
            return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
          }
          const confirmed = await querySTKPushStatus(checkoutRequestId);
          if (!confirmed.success) {
            console.warn('M-Pesa callback ignored: Safaricom did not confirm the payment');
            return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' });
          }

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
        } else if (pending) {
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
