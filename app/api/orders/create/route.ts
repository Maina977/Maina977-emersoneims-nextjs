/**
 * POST /api/orders/create
 * Creates a new order from shopping cart
 */

import { orderService } from '@/lib/orders/orderService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerId,
      customerPhone,
      customerEmail,
      customerName,
      items,
      shippingLocation,
      paymentMethod
    } = body;

    if (!customerId || !customerPhone || !customerEmail || !customerName || !items || !shippingLocation) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Create order
    const order = orderService.createOrder({
      customerId,
      customerPhone,
      customerEmail,
      customerName,
      items,
      shippingLocation,
      paymentMethod: paymentMethod || 'mpesa'
    });

    // In production, save to database
    // await db.orders.insert(order);

    return Response.json({
      success: true,
      orderId: order.orderId,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      message: `Order ${order.orderId} created successfully. Ready for payment.`
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return Response.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
