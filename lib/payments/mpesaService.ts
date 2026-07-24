/**
 * M-Pesa Daraja API Integration
 * Handles STK Push, payment verification, and webhooks
 */

export interface PaymentInitiation {
  phoneNumber: string; // 254793573208 format
  amount: number; // KES
  orderId: string;
  accountRef: string; // Order number or description
}

export interface PaymentVerification {
  CheckoutRequestID: string;
  ResultCode: number;
  ResultDesc: string;
  Amount?: number;
  TransactionTimestamp?: string;
}

export interface MpesaTransaction {
  orderId: string;
  phoneNumber: string;
  amount: number;
  transactionId?: string;
  checkoutRequestId: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  timestamp: Date;
  verifiedAt?: Date;
}

class MpesaService {
  private businessShortCode = '174379'; // Sandbox: 174379, Production: your code
  private consumerKey = process.env.MPESA_CONSUMER_KEY || '';
  private consumerSecret = process.env.MPESA_CONSUMER_SECRET || '';
  private passkey = process.env.MPESA_PASSKEY || '';
  private callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://emersoneims.com/api/payments/callback';
  private environment = process.env.NODE_ENV === 'production' ? 'production' : 'sandbox';

  /**
   * Get OAuth token from M-Pesa
   */
  async getAccessToken(): Promise<string> {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      const response = await fetch(
        `https://${this.environment === 'production' ? 'api.safaricom.co.ke' : 'sandbox.safaricom.co.ke'}/oauth/v1/generate?grant_type=client_credentials`,
        {
          method: 'GET',
          headers: { Authorization: `Basic ${auth}` }
        }
      );

      if (!response.ok) throw new Error('Failed to get access token');
      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('M-Pesa token error:', error);
      throw error;
    }
  }

  /**
   * Initiate STK Push (prompt user to enter M-Pesa PIN)
   */
  async initiateSTKPush(payment: PaymentInitiation): Promise<{
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
  }> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = Buffer.from(`${this.businessShortCode}${this.passkey}${timestamp}`).toString('base64');

      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: payment.amount,
        PartyA: this.formatPhoneNumber(payment.phoneNumber),
        PartyB: this.businessShortCode,
        PhoneNumber: this.formatPhoneNumber(payment.phoneNumber),
        CallBackURL: this.callbackUrl,
        AccountReference: payment.accountRef,
        TransactionDesc: `Order ${payment.orderId}`
      };

      const response = await fetch(
        `https://${this.environment === 'production' ? 'api.safaricom.co.ke' : 'sandbox.safaricom.co.ke'}/mpesa/stkpush/v1/processrequest`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error('STK Push failed');
      const data = await response.json();

      return {
        CheckoutRequestID: data.CheckoutRequestID,
        ResponseCode: data.ResponseCode,
        ResponseDescription: data.ResponseDescription
      };
    } catch (error) {
      console.error('STK Push error:', error);
      throw error;
    }
  }

  /**
   * Query transaction status
   */
  async queryTransaction(checkoutRequestId: string): Promise<PaymentVerification> {
    try {
      const token = await this.getAccessToken();
      const timestamp = this.getTimestamp();
      const password = Buffer.from(`${this.businessShortCode}${this.passkey}${timestamp}`).toString('base64');

      const payload = {
        BusinessShortCode: this.businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await fetch(
        `https://${this.environment === 'production' ? 'api.safaricom.co.ke' : 'sandbox.safaricom.co.ke'}/mpesa/stkpushquery/v1/query`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) throw new Error('Transaction query failed');
      return await response.json();
    } catch (error) {
      console.error('Query transaction error:', error);
      throw error;
    }
  }

  /**
   * Process M-Pesa callback webhook
   */
  processCallback(body: any): { orderId: string; status: string; transactionId?: string } {
    try {
      const stk = body.Body?.stkCallback;
      if (!stk) throw new Error('Invalid callback structure');

      const resultCode = stk.ResultCode;
      const accountRef = stk.CallbackMetadata?.Item?.find((item: any) => item.Name === 'AccountReference')?.Value;
      const transactionId = stk.CallbackMetadata?.Item?.find((item: any) => item.Name === 'MpesaReceiptNumber')?.Value;

      return {
        orderId: accountRef,
        status: resultCode === 0 ? 'success' : 'failed',
        transactionId
      };
    } catch (error) {
      console.error('Callback processing error:', error);
      throw error;
    }
  }

  /**
   * Verify payment was successful
   */
  isPaymentSuccessful(resultCode: number): boolean {
    return resultCode === 0;
  }

  /**
   * Helper: Format phone number to 254XXXXXXXXX
   */
  private formatPhoneNumber(phone: string): string {
    let formatted = phone.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (!formatted.startsWith('254')) {
      formatted = '254' + formatted;
    }
    return formatted;
  }

  /**
   * Helper: Get current timestamp in format YYYYMMDDHHmmss
   */
  private getTimestamp(): string {
    const date = new Date();
    return date.toISOString().replace(/[-:T]/g, '').split('.')[0];
  }
}

export const mpesaService = new MpesaService();
