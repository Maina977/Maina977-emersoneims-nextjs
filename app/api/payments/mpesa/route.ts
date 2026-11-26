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
import { verifyOrderToken } from '@/lib/payments/orderToken';
import { allow, clientIp, hashKey, tooMany } from '@/lib/security/requestGuard';

const MPESA_IP_LIMIT = 5; // STK prompts started per IP per 10 minutes
const MPESA_PHONE_LIMIT = 3; // STK prompts per phone per hour
const MPESA_QUERY_LIMIT = 20; // status queries per IP per minute

/** One generic refusal: never says which check failed. */
function refused() {
  return NextResponse.json({ success: false, error: 'Payment could not be started.' }, { status: 400 });
}

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
    // Security sweep 2026-11-26 (H7). This route used to take the phone and
    // the amount from the request with no sign-in, so anyone could send an
    // M-Pesa prompt for up to KES 150,000 to any phone. Now:
    //  - per-IP limit before anything else (generic 429);
    //  - the amount comes only from a server-issued order token
    //    (lib/payments/orderToken.ts: HMAC over a server-priced order); no
    //    valid token -> generic 400. No token issuer is wired yet and
    //    ORDER_TOKEN_SECRET is not set, so every request is refused today:
    //    payments stay inactive and no payment configuration is changed;
    //  - Kenyan mobile number required, and a per-phone limit (hashed);
    //  - no phone number in logs, no configuration details in answers.
    if (!allow('mpesa-stk-ip', clientIp(request), MPESA_IP_LIMIT, 600)) return tooMany();

    let body: Record<string, unknown>;
    try { body = await request.json(); } catch { return refused(); }
    if (!body || typeof body !== 'object') return refused();

    const order = verifyOrderToken(body.orderToken);
    if (!order) return refused();

    const phoneNumber = typeof body.phoneNumber === 'string' ? body.phoneNumber : '';
    const formattedPhone = formatPhoneNumber(phoneNumber);
    if (phoneNumber.length > 20 || !/^254(7|1)\d{8}$/.test(formattedPhone)) return refused();

    const requiredEnvVars = [
      'MPESA_CONSUMER_KEY',
      'MPESA_CONSUMER_SECRET',
      'MPESA_PASSKEY',
      'MPESA_SHORTCODE',
      'MPESA_CALLBACK_URL',
    ];
    if (requiredEnvVars.some(v => !process.env[v])) {
      return NextResponse.json(
        { success: false, error: 'Payments are not available right now.', configRequired: true },
        { status: 503 }
      );
    }

    if (!allow('mpesa-stk-phone', hashKey(formattedPhone), MPESA_PHONE_LIMIT, 3600)) return tooMany();

    const amount = order.amount; // server-priced, from the token
    const accountReference = order.orderId;
    const transactionDesc = 'EmersonEIMS order';

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
      TransactionDesc: transactionDesc.substring(0, 13), // Max 13 chars
    };

    console.log(`[M-Pesa] Initiating STK Push for order ${order.orderId}, KES ${amount}`);

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
      console.error('[M-Pesa] STK Push failed:', typeof data?.ResponseCode === 'string' ? data.ResponseCode : 'no code');
      return refused();
    }

  } catch (error) {
    console.error('[M-Pesa] Error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Payment could not be started.' },
      { status: 500 }
    );
  }
}

// Query transaction status
export async function GET(request: NextRequest) {
  if (!allow('mpesa-query-ip', clientIp(request), MPESA_QUERY_LIMIT, 60)) return tooMany();
  const { searchParams } = new URL(request.url);
  const checkoutRequestId = searchParams.get('checkoutRequestId');

  if (!checkoutRequestId || !/^[A-Za-z0-9_-]{1,64}$/.test(checkoutRequestId)) {
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
    console.error('[M-Pesa] Query error:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json(
      { success: false, error: 'Failed to query transaction' },
      { status: 500 }
    );
  }
}
