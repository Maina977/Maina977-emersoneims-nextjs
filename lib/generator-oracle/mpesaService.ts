/**
 * GENERATOR ORACLE - M-PESA SERVICE
 * Safaricom Daraja API integration for M-Pesa payments
 *
 * @copyright 2026 Generator Oracle / EmersonEIMS
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || '';
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || '';
const MPESA_PASSKEY = process.env.MPESA_PASSKEY || '';
const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE || '';
const MPESA_ENVIRONMENT = process.env.MPESA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'

const BASE_URL = MPESA_ENVIRONMENT === 'production'
  ? 'https://api.safaricom.co.ke'
  : 'https://sandbox.safaricom.co.ke';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface STKPushRequest {
  phoneNumber: string; // Format: 254XXXXXXXXX
  amount: number;
  accountReference: string;
  transactionDesc: string;
  callbackUrl: string;
}

export interface STKPushResponse {
  success: boolean;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  responseCode?: string;
  responseDescription?: string;
  customerMessage?: string;
  error?: string;
}

export interface STKCallbackData {
  merchantRequestId: string;
  checkoutRequestId: string;
  resultCode: number;
  resultDesc: string;
  callbackMetadata?: {
    amount?: number;
    mpesaReceiptNumber?: string;
    transactionDate?: string;
    phoneNumber?: string;
  };
}

export interface TransactionStatus {
  success: boolean;
  resultCode?: number;
  resultDesc?: string;
  transactionId?: string;
  error?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

/**
 * Get OAuth access token from Safaricom
 */
export async function getMpesaAccessToken(): Promise<string | null> {
  // Return cached token if still valid
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
    console.error('M-Pesa credentials not configured');
    return null;
  }

  try {
    const auth = Buffer.from(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`).toString('base64');

    const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data = await response.json();

    // Cache token (expires in ~1 hour, we'll refresh at 50 minutes)
    cachedAccessToken = {
      token: data.access_token,
      expiresAt: Date.now() + (50 * 60 * 1000), // 50 minutes
    };

    return data.access_token;
  } catch (error) {
    console.error('Failed to get M-Pesa access token:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// STK PUSH (Lipa Na M-Pesa Online)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate password for STK Push
 */
function generatePassword(): { password: string; timestamp: string } {
  const timestamp = new Date().toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14);

  const password = Buffer.from(
    `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`
  ).toString('base64');

  return { password, timestamp };
}

/**
 * Format phone number to 254XXXXXXXXX format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove spaces, dashes, and plus signs
  let cleaned = phone.replace(/[\s\-\+]/g, '');

  // Handle different formats
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  } else if (cleaned.startsWith('+254')) {
    cleaned = cleaned.slice(1);
  }

  return cleaned;
}

/**
 * Validate Kenyan phone number
 */
export function isValidKenyanPhone(phone: string): boolean {
  const formatted = formatPhoneNumber(phone);
  // Must be 12 digits starting with 254, followed by 7 or 1
  return /^254[71]\d{8}$/.test(formatted);
}

/**
 * Initiate STK Push (Lipa Na M-Pesa Online)
 */
export async function initiateSTKPush(request: STKPushRequest): Promise<STKPushResponse> {
  const accessToken = await getMpesaAccessToken();

  if (!accessToken) {
    return {
      success: false,
      error: 'Failed to authenticate with M-Pesa',
    };
  }

  if (!isValidKenyanPhone(request.phoneNumber)) {
    return {
      success: false,
      error: 'Invalid phone number. Use format: 0712345678 or 254712345678',
    };
  }

  const { password, timestamp } = generatePassword();
  const phoneNumber = formatPhoneNumber(request.phoneNumber);

  try {
    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(request.amount), // Must be whole number
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: request.callbackUrl,
        AccountReference: request.accountReference.slice(0, 12), // Max 12 chars
        TransactionDesc: request.transactionDesc.slice(0, 13), // Max 13 chars
      }),
    });

    const data = await response.json();

    if (data.ResponseCode === '0') {
      return {
        success: true,
        merchantRequestId: data.MerchantRequestID,
        checkoutRequestId: data.CheckoutRequestID,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription,
        customerMessage: data.CustomerMessage,
      };
    } else {
      return {
        success: false,
        responseCode: data.ResponseCode,
        responseDescription: data.ResponseDescription || data.errorMessage,
        error: data.ResponseDescription || data.errorMessage || 'STK Push failed',
      };
    }
  } catch (error) {
    console.error('STK Push error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'STK Push request failed',
    };
  }
}

/**
 * Query STK Push transaction status
 */
export async function querySTKPushStatus(checkoutRequestId: string): Promise<TransactionStatus> {
  const accessToken = await getMpesaAccessToken();

  if (!accessToken) {
    return {
      success: false,
      error: 'Failed to authenticate with M-Pesa',
    };
  }

  const { password, timestamp } = generatePassword();

  try {
    const response = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    });

    const data = await response.json();

    return {
      success: data.ResultCode === '0' || data.ResultCode === 0,
      resultCode: parseInt(data.ResultCode),
      resultDesc: data.ResultDesc,
      transactionId: data.MpesaReceiptNumber,
    };
  } catch (error) {
    console.error('STK Query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Query failed',
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CALLBACK PROCESSING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Parse STK Push callback data
 */
export function parseSTKCallback(body: Record<string, unknown>): STKCallbackData | null {
  try {
    const stkCallback = (body.Body as Record<string, unknown>)?.stkCallback as Record<string, unknown>;

    if (!stkCallback) {
      return null;
    }

    const result: STKCallbackData = {
      merchantRequestId: stkCallback.MerchantRequestID as string,
      checkoutRequestId: stkCallback.CheckoutRequestID as string,
      resultCode: stkCallback.ResultCode as number,
      resultDesc: stkCallback.ResultDesc as string,
    };

    // Parse callback metadata if payment was successful
    if (result.resultCode === 0 && stkCallback.CallbackMetadata) {
      const metadata = (stkCallback.CallbackMetadata as Record<string, unknown>).Item as Array<{
        Name: string;
        Value: string | number;
      }>;

      result.callbackMetadata = {};

      for (const item of metadata) {
        switch (item.Name) {
          case 'Amount':
            result.callbackMetadata.amount = item.Value as number;
            break;
          case 'MpesaReceiptNumber':
            result.callbackMetadata.mpesaReceiptNumber = item.Value as string;
            break;
          case 'TransactionDate':
            result.callbackMetadata.transactionDate = String(item.Value);
            break;
          case 'PhoneNumber':
            result.callbackMetadata.phoneNumber = String(item.Value);
            break;
        }
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to parse STK callback:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if M-Pesa is configured
 */
export function isMpesaConfigured(): boolean {
  return !!(
    MPESA_CONSUMER_KEY &&
    MPESA_CONSUMER_SECRET &&
    MPESA_PASSKEY &&
    MPESA_SHORTCODE
  );
}

/**
 * Get M-Pesa configuration status
 */
export function getMpesaStatus(): {
  configured: boolean;
  environment: string;
  shortcode: string;
} {
  return {
    configured: isMpesaConfigured(),
    environment: MPESA_ENVIRONMENT,
    shortcode: MPESA_SHORTCODE ? `${MPESA_SHORTCODE.slice(0, 3)}***` : 'Not set',
  };
}

/**
 * Generate unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `GO-${timestamp}-${random}`.toUpperCase();
}
