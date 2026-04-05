/**
 * M-PESA DARAJA API - Real Mobile Money Payments
 * Safaricom Daraja API Integration for Kenya
 * https://developer.safaricom.co.ke/
 *
 * Supports:
 * - STK Push (Lipa Na M-Pesa Online)
 * - Transaction Status Query
 * - Account Balance Query
 */

import { NextRequest, NextResponse } from 'next/server';

interface MpesaSTKRequest {
  phoneNumber: string;      // Format: 254XXXXXXXXX
  amount: number;
  accountReference: string;
  transactionDesc?: string;
}

interface MpesaSTKResponse {
  success: boolean;
  data?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
  error?: string;
  configRequired?: boolean;
}

// Daraja API endpoints
const DARAJA_SANDBOX_URL = 'https://sandbox.safaricom.co.ke';
const DARAJA_PRODUCTION_URL = 'https://api.safaricom.co.ke';

function getBaseUrl(): string {
  return process.env.MPESA_ENVIRONMENT === 'production'
    ? DARAJA_PRODUCTION_URL
    : DARAJA_SANDBOX_URL;
}

// Get OAuth access token
async function getAccessToken(): Promise<string | null> {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    return null;
  }

  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await fetch(
      `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data.access_token;
    }
  } catch (error) {
    console.error('[M-Pesa] Failed to get access token:', error);
  }

  return null;
}

// Generate timestamp in format YYYYMMDDHHmmss
function getTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate password for STK Push
function generatePassword(timestamp: string): string {
  const shortcode = process.env.MPESA_SHORTCODE || '';
  const passkey = process.env.MPESA_PASSKEY || '';
  return Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');
}

// Format phone number to 254XXXXXXXXX
function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/\D/g, '');

  if (formatted.startsWith('0')) {
    formatted = '254' + formatted.substring(1);
  } else if (formatted.startsWith('+')) {
    formatted = formatted.substring(1);
  } else if (!formatted.startsWith('254')) {
    formatted = '254' + formatted;
  }

  return formatted;
}

export async function POST(request: NextRequest) {
  try {
    const body: MpesaSTKRequest = await request.json();
    const { phoneNumber, amount, accountReference, transactionDesc } = body;

    // Check configuration
    const requiredEnvVars = [
      'MPESA_CONSUMER_KEY',
      'MPESA_CONSUMER_SECRET',
      'MPESA_PASSKEY',
      'MPESA_SHORTCODE',
      'MPESA_CALLBACK_URL',
    ];

    const missingVars = requiredEnvVars.filter(v => !process.env[v]);

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `M-Pesa not configured. Missing: ${missingVars.join(', ')}`,
          configRequired: true,
        },
        { status: 503 }
      );
    }

    // Validate input
    if (!phoneNumber || !amount || !accountReference) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: phoneNumber, amount, accountReference' },
        { status: 400 }
      );
    }

    if (amount < 1 || amount > 150000) {
      return NextResponse.json(
        { success: false, error: 'Amount must be between KES 1 and KES 150,000' },
        { status: 400 }
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Failed to authenticate with M-Pesa API' },
        { status: 500 }
      );
    }

    // Prepare STK Push request
    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const stkPushRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: formattedPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: accountReference.substring(0, 12), // Max 12 chars
      TransactionDesc: (transactionDesc || 'SolarGenius Pro Payment').substring(0, 13), // Max 13 chars
    };

    console.log(`[M-Pesa] Initiating STK Push for ${formattedPhone}, KES ${amount}`);

    const response = await fetch(
      `${getBaseUrl()}/mpesa/stkpush/v1/processrequest`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(stkPushRequest),
        signal: AbortSignal.timeout(30000),
      }
    );

    const data = await response.json();

    if (data.ResponseCode === '0') {
      console.log(`[M-Pesa] STK Push initiated: ${data.CheckoutRequestID}`);

      return NextResponse.json({
        success: true,
        data: {
          MerchantRequestID: data.MerchantRequestID,
          CheckoutRequestID: data.CheckoutRequestID,
          ResponseCode: data.ResponseCode,
          ResponseDescription: data.ResponseDescription,
          CustomerMessage: data.CustomerMessage,
        },
      });
    } else {
      console.error('[M-Pesa] STK Push failed:', data);
      return NextResponse.json(
        {
          success: false,
          error: data.errorMessage || data.ResponseDescription || 'STK Push failed',
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('[M-Pesa] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'M-Pesa transaction failed'
      },
      { status: 500 }
    );
  }
}

// Query transaction status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const checkoutRequestId = searchParams.get('checkoutRequestId');

  if (!checkoutRequestId) {
    return NextResponse.json(
      { success: false, error: 'Missing checkoutRequestId parameter' },
      { status: 400 }
    );
  }

  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: 'Failed to authenticate with M-Pesa API' },
        { status: 500 }
      );
    }

    const timestamp = getTimestamp();
    const password = generatePassword(timestamp);

    const queryRequest = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    };

    const response = await fetch(
      `${getBaseUrl()}/mpesa/stkpushquery/v1/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryRequest),
        signal: AbortSignal.timeout(10000),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: data.ResultCode === '0',
      data: {
        ResultCode: data.ResultCode,
        ResultDesc: data.ResultDesc,
        MerchantRequestID: data.MerchantRequestID,
        CheckoutRequestID: data.CheckoutRequestID,
      },
    });

  } catch (error) {
    console.error('[M-Pesa] Query error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to query transaction'
      },
      { status: 500 }
    );
  }
}
