/**
 * Paystack Payment API
 * https://paystack.com/docs/api/
 *
 * Supports:
 * - Card payments
 * - Bank transfers
 * - Mobile money
 * - USSD
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface PaystackRequest {
  amount: number;           // In smallest currency unit (kobo for NGN, cents for KES)
  currency?: string;        // NGN, KES, USD, GHS, ZAR
  email: string;
  reference?: string;
  callbackUrl?: string;
  metadata?: Record<string, any>;
  channels?: ('card' | 'bank' | 'ussd' | 'mobile_money' | 'bank_transfer')[];
}

interface PaystackResponse {
  success: boolean;
  data?: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
  };
  error?: string;
  configRequired?: boolean;
}

const PAYSTACK_API = 'https://api.paystack.co';

function generateReference(): string {
  return `SGP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaystackRequest = await request.json();
    const {
      amount,
      currency = 'KES',
      email,
      reference,
      callbackUrl,
      metadata,
      channels,
    } = body;

    // Check configuration
    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paystack not configured. Add PAYSTACK_SECRET_KEY to environment variables.',
          configRequired: true,
        },
        { status: 503 }
      );
    }

    // Validate input
    if (!amount || !email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, email' },
        { status: 400 }
      );
    }

    // Paystack expects amount in smallest unit (kobo/cents)
    // If amount looks like it's already in major unit, convert
    const amountInSmallestUnit = amount < 1000 ? amount * 100 : amount;

    const payload: any = {
      email,
      amount: Math.round(amountInSmallestUnit),
      currency,
      reference: reference || generateReference(),
      callback_url: callbackUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
      metadata: {
        source: 'solargenius-pro',
        ...metadata,
      },
    };

    if (channels && channels.length > 0) {
      payload.channels = channels;
    }

    console.log(`[Paystack] Initializing transaction: ${payload.reference}, ${currency} ${amount}`);

    const response = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();

    if (data.status === true && data.data) {
      return NextResponse.json({
        success: true,
        data: {
          authorizationUrl: data.data.authorization_url,
          accessCode: data.data.access_code,
          reference: data.data.reference,
        },
      });
    } else {
      console.error('[Paystack] Transaction init failed:', data);
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to initialize transaction',
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Paystack] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Transaction initialization failed'
      },
      { status: 500 }
    );
  }
}

// Verify transaction
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.json(
      { success: false, error: 'Missing reference parameter' },
      { status: 400 }
    );
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { success: false, error: 'Paystack not configured' },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(`${PAYSTACK_API}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    if (data.status === true && data.data) {
      const txData = data.data;

      return NextResponse.json({
        success: true,
        data: {
          status: txData.status,  // 'success', 'failed', 'abandoned'
          amount: txData.amount / 100,  // Convert back to major unit
          currency: txData.currency,
          reference: txData.reference,
          channel: txData.channel,
          customer: {
            email: txData.customer?.email,
            firstName: txData.customer?.first_name,
            lastName: txData.customer?.last_name,
          },
          paidAt: txData.paid_at,
          gatewayResponse: txData.gateway_response,
        },
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Transaction not found',
        },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('[Paystack] Verify error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      },
      { status: 500 }
    );
  }
}
