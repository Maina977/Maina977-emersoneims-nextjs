/**
 * POST /api/payments/callback
 * Receives M-Pesa payment confirmation webhook
 */

import { mpesaService } from '@/lib/payments/mpesaService';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log the callback (important for debugging)
    console.log('M-Pesa Callback received:', JSON.stringify(body, null, 2));

    // Process callback
    const result = mpesaService.processCallback(body);

    // In production, you would:
    // 1. Update order status in database
    // 2. Send order confirmation email
    // 3. Trigger fulfillment process
    // 4. Update inventory
    // 5. Send SMS to customer

    // Return 200 to acknowledge receipt (M-Pesa requires this)
    return Response.json({
      ResultCode: 0,
      ResultDesc: 'Accepted',
      orderId: result.orderId,
      status: result.status,
      transactionId: result.transactionId
    });
  } catch (error: any) {
    console.error('Callback processing error:', error);
    // Still return 200 to avoid M-Pesa retry
    return Response.json({
      ResultCode: 1,
      ResultDesc: 'Processing error'
    });
  }
}
