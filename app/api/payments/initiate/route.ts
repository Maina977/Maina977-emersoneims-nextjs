/**
 * POST /api/payments/initiate
 * Initiates M-Pesa STK Push for order payment
 */

import { mpesaService } from '@/lib/payments/mpesaService';
import { orderService } from '@/lib/orders/orderService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderId, amount, phoneNumber, accountRef } = body;

    if (!orderId || !amount || !phoneNumber || !accountRef) {
      return Response.json(
        { error: 'Missing required fields: orderId, amount, phoneNumber, accountRef' },
        { status: 400 }
      );
    }

    // Validate amount (KES 1 minimum, KES 150,000 maximum per M-Pesa rules)
    if (amount < 1 || amount > 150000) {
      return Response.json(
        { error: 'Amount must be between KES 1 and KES 150,000' },
        { status: 400 }
      );
    }

    // Initiate STK Push
    const response = await mpesaService.initiateSTKPush({
      phoneNumber,
      amount: Math.round(amount),
      orderId,
      accountRef
    });

    return Response.json({
      success: true,
      checkoutRequestId: response.CheckoutRequestID,
      responseCode: response.ResponseCode,
      responseDescription: response.ResponseDescription,
      message: 'M-Pesa prompt sent to your phone. Please enter your PIN to complete payment.'
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    return Response.json(
      { error: error.message || 'Payment initiation failed' },
      { status: 500 }
    );
  }
}
