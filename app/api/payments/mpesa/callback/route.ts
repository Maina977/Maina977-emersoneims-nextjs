/**
 * M-PESA Callback Handler
 * Receives payment confirmation from Safaricom
 */

import { NextRequest, NextResponse } from 'next/server';

interface MpesaCallback {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item: Array<{
          Name: string;
          Value?: string | number;
        }>;
      };
    };
  };
}

interface PaymentRecord {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  amount?: number;
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  phoneNumber?: string;
  status: 'success' | 'failed' | 'cancelled';
  timestamp: string;
}

// In production, store this in a database
const paymentRecords: Map<string, PaymentRecord> = new Map();

export async function POST(request: NextRequest) {
  try {
    const callback: MpesaCallback = await request.json();

    console.log('[M-Pesa Callback] Received:', JSON.stringify(callback, null, 2));

    const { stkCallback } = callback.Body;
    const {
      MerchantRequestID,
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = stkCallback;

    // Parse callback metadata
    let amount: number | undefined;
    let mpesaReceiptNumber: string | undefined;
    let transactionDate: string | undefined;
    let phoneNumber: string | undefined;

    if (CallbackMetadata?.Item) {
      CallbackMetadata.Item.forEach((item) => {
        switch (item.Name) {
          case 'Amount':
            amount = item.Value as number;
            break;
          case 'MpesaReceiptNumber':
            mpesaReceiptNumber = item.Value as string;
            break;
          case 'TransactionDate':
            transactionDate = String(item.Value);
            break;
          case 'PhoneNumber':
            phoneNumber = String(item.Value);
            break;
        }
      });
    }

    // Determine payment status
    let status: 'success' | 'failed' | 'cancelled';
    if (ResultCode === 0) {
      status = 'success';
    } else if (ResultCode === 1032) {
      status = 'cancelled'; // User cancelled
    } else {
      status = 'failed';
    }

    // Store payment record
    const paymentRecord: PaymentRecord = {
      merchantRequestId: MerchantRequestID,
      checkoutRequestId: CheckoutRequestID,
      resultCode: ResultCode,
      resultDesc: ResultDesc,
      amount,
      mpesaReceiptNumber,
      transactionDate,
      phoneNumber,
      status,
      timestamp: new Date().toISOString(),
    };

    paymentRecords.set(CheckoutRequestID, paymentRecord);

    console.log(`[M-Pesa Callback] Payment ${status}:`, {
      checkoutRequestId: CheckoutRequestID,
      amount,
      receipt: mpesaReceiptNumber,
    });

    // TODO: In production:
    // 1. Store in database
    // 2. Send email/SMS confirmation
    // 3. Update order/quote status
    // 4. Trigger webhook to your system

    // Send success response to Safaricom
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback received successfully',
    });

  } catch (error) {
    console.error('[M-Pesa Callback] Error:', error);

    // Still return success to Safaricom to prevent retries
    return NextResponse.json({
      ResultCode: 0,
      ResultDesc: 'Callback processed',
    });
  }
}

// Endpoint to check payment status from frontend
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkoutRequestId = searchParams.get('checkoutRequestId');

  if (!checkoutRequestId) {
    return NextResponse.json(
      { success: false, error: 'Missing checkoutRequestId' },
      { status: 400 }
    );
  }

  const record = paymentRecords.get(checkoutRequestId);

  if (!record) {
    return NextResponse.json({
      success: true,
      data: {
        status: 'pending',
        message: 'Payment not yet confirmed',
      },
    });
  }

  return NextResponse.json({
    success: true,
    data: {
      status: record.status,
      amount: record.amount,
      receipt: record.mpesaReceiptNumber,
      timestamp: record.timestamp,
      message: record.resultDesc,
    },
  });
}
