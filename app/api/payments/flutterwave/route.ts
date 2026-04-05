/**
 * Flutterwave Payment API
 * https://developer.flutterwave.com/
 *
 * Supports multiple payment methods:
 * - Card payments
 * - Mobile money (M-Pesa, Airtel Money)
 * - Bank transfers
 * - USSD
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface FlutterwaveRequest {
  amount: number;
  currency?: string;        // KES, USD, NGN, etc.
  email: string;
  phone?: string;
  name: string;
  paymentMethod?: 'card' | 'mpesa' | 'mobilemoney' | 'ussd' | 'banktransfer';
  reference?: string;
  description?: string;
  redirectUrl?: string;
}

interface FlutterwaveResponse {
  success: boolean;
  data?: {
    link: string;           // Payment link to redirect user
    transactionRef: string;
    status: string;
  };
  error?: string;
  configRequired?: boolean;
}

const FLUTTERWAVE_API = 'https://api.flutterwave.com/v3';

function generateTransactionRef(): string {
  return `SGP-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body: FlutterwaveRequest = await request.json();
    const {
      amount,
      currency = 'KES',
      email,
      phone,
      name,
      paymentMethod,
      reference,
      description,
      redirectUrl,
    } = body;

    // Check configuration
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    const publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;

    if (!secretKey || !publicKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Flutterwave not configured. Add FLUTTERWAVE_SECRET_KEY and FLUTTERWAVE_PUBLIC_KEY to environment variables.',
          configRequired: true,
        },
        { status: 503 }
      );
    }

    // Validate input
    if (!amount || !email || !name) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, email, name' },
        { status: 400 }
      );
    }

    const txRef = reference || generateTransactionRef();

    // Build payment payload
    const payload: any = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_SITE_URL}/payment/callback`,
      customer: {
        email: email,
        phonenumber: phone,
        name: name,
      },
      customizations: {
        title: 'SolarGenius Pro',
        description: description || 'Solar System Quote Payment',
        logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
      },
      meta: {
        source: 'solargenius-pro',
        timestamp: new Date().toISOString(),
      },
    };

    // Add payment method specific options
    if (paymentMethod === 'mpesa') {
      payload.payment_options = 'mpesa';
    } else if (paymentMethod === 'card') {
      payload.payment_options = 'card';
    } else if (paymentMethod === 'banktransfer') {
      payload.payment_options = 'banktransfer';
    }
    // If no specific method, allow all options

    console.log(`[Flutterwave] Creating payment: ${txRef}, ${currency} ${amount}`);

    const response = await fetch(`${FLUTTERWAVE_API}/payments`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json();

    if (data.status === 'success' && data.data?.link) {
      return NextResponse.json({
        success: true,
        data: {
          link: data.data.link,
          transactionRef: txRef,
          status: 'pending',
        },
      });
    } else {
      console.error('[Flutterwave] Payment creation failed:', data);
      return NextResponse.json(
        {
          success: false,
          error: data.message || 'Failed to create payment',
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[Flutterwave] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      },
      { status: 500 }
    );
  }
}

// Verify transaction
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transaction_id');
  const txRef = searchParams.get('tx_ref');

  if (!transactionId && !txRef) {
    return NextResponse.json(
      { success: false, error: 'Missing transaction_id or tx_ref parameter' },
      { status: 400 }
    );
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { success: false, error: 'Flutterwave not configured' },
      { status: 503 }
    );
  }

  try {
    let verifyUrl = `${FLUTTERWAVE_API}/transactions/`;

    if (transactionId) {
      verifyUrl += `${transactionId}/verify`;
    } else {
      verifyUrl += `verify_by_reference?tx_ref=${txRef}`;
    }

    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${secretKey}`,
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();

    if (data.status === 'success') {
      const txData = data.data;

      return NextResponse.json({
        success: true,
        data: {
          status: txData.status,  // 'successful', 'failed', 'pending'
          amount: txData.amount,
          currency: txData.currency,
          transactionId: txData.id,
          txRef: txData.tx_ref,
          paymentType: txData.payment_type,
          customer: {
            email: txData.customer?.email,
            name: txData.customer?.name,
            phone: txData.customer?.phone_number,
          },
          paidAt: txData.created_at,
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
    console.error('[Flutterwave] Verify error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Verification failed'
      },
      { status: 500 }
    );
  }
}
