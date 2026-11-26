/**
 * POST /api/orders/create
 * Creates a new order from shopping cart + sends confirmation email
 *
 * Security hotfix 2026-11-26: every field is type- and length-checked before
 * use. The customer's name and delivery location are written into the HTML
 * confirmation email sent to the address given, so the name may not contain
 * < or > and the location must be one of the checkout's options; line
 * subtotals are recomputed from quantity x unit price. The order is not
 * stored (it never was), and the answer contains only this order's id and
 * totals. Errors no longer echo internal messages.
 */

import { orderService, type OrderItem } from '@/lib/orders/orderService';
import { sendOrderConfirmation } from '@/lib/email/emailService';

// The delivery options offered by app/marketplace/checkout/page.tsx.
const SHIPPING_LOCATIONS = new Set(['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Naivasha', 'other']);
const PAYMENT_METHODS = new Set(['mpesa', 'bank-transfer', 'cash-on-delivery']);
const MAX_ITEMS = 100;

const isStr = (v: unknown, min: number, max: number): v is string =>
  typeof v === 'string' && v.trim().length >= min && v.length <= max;

function validItems(raw: unknown): OrderItem[] | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_ITEMS) return null;
  const out: OrderItem[] = [];
  for (const it of raw) {
    if (!it || typeof it !== 'object') return null;
    const { partCode, partName, quantity, unitPrice } = it as Record<string, unknown>;
    if (!isStr(partCode, 1, 64) || !isStr(partName, 1, 200)) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return null;
    if (typeof unitPrice !== 'number' || !Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 1e9) return null;
    out.push({ partCode, partName, quantity, unitPrice, subtotal: unitPrice * quantity });
  }
  return out;
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    if (!body || typeof body !== 'object') {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
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

    const cleanItems = validItems(items);
    const method = paymentMethod === undefined || paymentMethod === null || paymentMethod === '' ? 'mpesa' : paymentMethod;
    if (
      !isStr(customerId, 1, 64) || !/^[A-Za-z0-9_-]+$/.test(customerId) ||
      !isStr(customerName, 1, 100) || /[<>]/.test(customerName) ||
      !isStr(customerEmail, 3, 254) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(customerEmail) ||
      !isStr(customerPhone, 7, 20) || !/^\+?[0-9 ()-]{7,20}$/.test(customerPhone) ||
      typeof shippingLocation !== 'string' || !SHIPPING_LOCATIONS.has(shippingLocation) ||
      typeof method !== 'string' || !PAYMENT_METHODS.has(method) ||
      !cleanItems
    ) {
      return Response.json({ error: 'Invalid order details' }, { status: 400 });
    }

    // Create order
    const order = orderService.createOrder({
      customerId,
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerName: customerName.trim(),
      items: cleanItems,
      shippingLocation,
      paymentMethod: method
    });

    // Send confirmation email (async, don't wait)
    sendOrderConfirmation(
      order.customerEmail,
      order.customerName,
      order.orderId,
      order.total,
      shippingLocation
    ).catch(err => console.error('Email send failed:', err));

    return Response.json({
      success: true,
      orderId: order.orderId,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      message: `Order ${order.orderId} created successfully. Confirmation email sent.`
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
