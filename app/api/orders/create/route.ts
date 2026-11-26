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
 *
 * Order-abuse hotfix 2026-11-26:
 *  - Prices come from the server, never the request: every line is priced
 *    from the stock file the marketplace lists from (lib/orders/trustedPrices.ts).
 *    Any unpriceable line makes the order "price to be confirmed by
 *    EmersonEIMS": no total is stated and no confirmation email is sent.
 *  - Abuse protection before any email (lib/orders/orderAbuseGuard.ts):
 *    honeypot, minimum form-fill time, per-IP and per-recipient limits, all
 *    refused with one generic 429. Logs carry no customer data.
 */

import { orderService } from '@/lib/orders/orderService';
import { sendOrderConfirmation } from '@/lib/email/emailService';
import { loadPriceBook, priceLines, PRICE_TO_BE_CONFIRMED } from '@/lib/orders/trustedPrices';
import { allowIp, allowRecipient, clientIp, looksAutomated, TOO_MANY } from '@/lib/orders/orderAbuseGuard';

// The delivery options offered by app/marketplace/checkout/page.tsx.
const SHIPPING_LOCATIONS = new Set(['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Naivasha', 'other']);
const PAYMENT_METHODS = new Set(['mpesa', 'bank-transfer', 'cash-on-delivery']);
const MAX_ITEMS = 100;

const isStr = (v: unknown, min: number, max: number): v is string =>
  typeof v === 'string' && v.trim().length >= min && v.length <= max;

// Only the part code and quantity are taken from the request. A client
// partName/unitPrice/subtotal may be sent (the checkout does) but is ignored.
function validItems(raw: unknown): Array<{ partCode: string; quantity: number }> | null {
  if (!Array.isArray(raw) || raw.length === 0 || raw.length > MAX_ITEMS) return null;
  const out: Array<{ partCode: string; quantity: number }> = [];
  for (const it of raw) {
    if (!it || typeof it !== 'object') return null;
    const { partCode, quantity } = it as Record<string, unknown>;
    if (!isStr(partCode, 1, 64)) return null;
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1 || quantity > 1000) return null;
    out.push({ partCode: partCode.trim(), quantity });
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

    // Abuse checks (same generic 429 for each; see lib/orders/orderAbuseGuard.ts).
    if (looksAutomated(body) || !allowIp(clientIp(request))) {
      return Response.json(TOO_MANY, { status: 429, headers: { 'Cache-Control': 'no-store' } });
    }

    // Server-side prices only.
    const priced = priceLines(cleanItems, loadPriceBook());
    if (!priced) {
      // Not priceable from the trusted record: no total is stated and no email
      // is sent. The order number is a reference for the customer to quote.
      const ref = orderService.createOrder({
        customerId, customerPhone: customerPhone.trim(), customerEmail: customerEmail.trim(), customerName: customerName.trim(),
        items: cleanItems.map((i) => ({ partCode: i.partCode, partName: i.partCode, quantity: i.quantity, unitPrice: 0, subtotal: 0 })),
        shippingLocation, paymentMethod: method,
      });
      return Response.json({
        success: true,
        orderId: ref.orderId,
        priceConfirmed: false,
        message: `${PRICE_TO_BE_CONFIRMED}. Quote order ${ref.orderId} when you contact us.`,
      });
    }

    if (!allowRecipient(customerEmail)) {
      return Response.json(TOO_MANY, { status: 429, headers: { 'Cache-Control': 'no-store' } });
    }

    // Create order
    const order = orderService.createOrder({
      customerId,
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      customerName: customerName.trim(),
      items: priced,
      shippingLocation,
      paymentMethod: method
    });

    // Send confirmation email (async, don't wait). No customer data in logs.
    sendOrderConfirmation(
      order.customerEmail,
      order.customerName,
      order.orderId,
      order.total,
      shippingLocation
    ).catch(() => console.error('Order confirmation email failed'));

    return Response.json({
      success: true,
      orderId: order.orderId,
      priceConfirmed: true,
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      message: `Order ${order.orderId} created.`
    });
  } catch (error) {
    console.error('Order creation error:', error instanceof Error ? error.name : 'unknown');
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
