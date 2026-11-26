/**
 * Security hotfix 2, 2026-11-26. Through the real route handlers and pages:
 *  - the generic proxy is retired (410 on every method) and never fetches,
 *    including for prefix-matching attacker hosts;
 *  - order lookup and customer order history are retired and never return
 *    PII, whether or not the order exists;
 *  - /api/orders/create validates input, returns only this order's totals and
 *    no longer lets HTML into the confirmation email;
 *  - the payment facade never builds its self-call URL from a foreign Host;
 *  - the marketplace order pages explain the change instead of breaking.
 * TEST data only. No network: fetch is stubbed in every test.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NextRequest } from 'next/server';

const sent = vi.hoisted(() => [] as unknown[][]);
vi.mock('@/lib/email/emailService', () => ({
  sendOrderConfirmation: async (...args: unknown[]) => { sent.push(args); return { success: false }; },
}));

import * as proxyRoute from '@/app/api/src/app/api/proxy/[...path]/route';
import * as orderRoute from '@/app/api/orders/[orderId]/route';
import * as customerOrdersRoute from '@/app/api/customers/[customerId]/orders/route';
import { POST as createOrder } from '@/app/api/orders/create/route';
import { POST as initPayment } from '@/app/api/v1/payments/initialize/route';
import { GET as verifyPayment } from '@/app/api/v1/payments/verify/[payment_id]/route';
import { GET as dataRelay } from '@/app/api/borehole/data-relay/route';
import { ordersRepository } from '@/lib/db/orders';
import type { Order } from '@/lib/orders/orderService';
import OrderTracker from '@/components/orders/OrderTracker';
import OrdersPage from '@/app/marketplace/orders/page';
import CheckoutPage from '@/app/marketplace/checkout/page';

type Handler = (...a: unknown[]) => Promise<Response> | Response;
const call = (h: unknown, ...a: unknown[]) => Promise.resolve((h as Handler)(...a));

const PII = { name: 'TEST Victim Person', phone: '0700111222', email: 'victim@test.example' };
const seeded: Order = {
  orderId: 'ORD-20261126-0042',
  customerId: 'CUST-1764000000000',
  customerPhone: PII.phone,
  customerEmail: PII.email,
  customerName: PII.name,
  items: [{ partCode: 'TEST-P1', partName: 'TEST filter', quantity: 1, unitPrice: 1000, subtotal: 1000 }],
  subtotal: 1000, tax: 160, shippingCost: 500, total: 1660,
  paymentMethod: 'mpesa', paymentStatus: 'pending', status: 'pending', createdAt: new Date('2026-11-26T08:00:00Z'),
};

let fetchSpy: ReturnType<typeof vi.fn>;
beforeEach(async () => {
  sent.length = 0;
  fetchSpy = vi.fn(async () => new Response(JSON.stringify({ success: true, data: {} }), { status: 200, headers: { 'content-type': 'application/json' } }));
  vi.stubGlobal('fetch', fetchSpy);
  // Simulates a future change that starts storing orders: the routes must still not expose them.
  if (!(await ordersRepository.findById(seeded.orderId))) await ordersRepository.create({ ...seeded });
});
afterEach(() => { vi.unstubAllGlobals(); localStorage.clear(); });

const noPII = (text: string) => {
  for (const v of Object.values(PII)) expect(text).not.toContain(v);
};

describe('generic proxy: retired, never fetches', () => {
  const targets = [
    'https://api.nasa.gov.attacker.example/steal',
    'https://jsonplaceholder.typicode.com.attacker.example/',
    'https://api.nasa.gov@attacker.example/', // userinfo trick: passes startsWith, host is attacker.example
    'https://api.nasa.gov/planetary/apod',
  ];
  for (const method of ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const) {
    it(`${method} answers 410 for every target and makes no outbound request`, async () => {
      for (const t of targets) {
        const req = new NextRequest(`https://site.test/api/src/app/api/proxy/x?target=${encodeURIComponent(t)}`, {
          method, body: method === 'GET' ? undefined : '{"a":1}', headers: { 'content-type': 'application/json' },
        });
        const res = await call((proxyRoute as Record<string, unknown>)[method], req);
        expect(res.status).toBe(410);
        expect(res.headers.get('access-control-allow-origin')).toBeNull();
      }
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  }
});

describe('order lookup and customer history: no PII without proof of ownership', () => {
  it('an existing order id returns 410 with no PII', async () => {
    const req = new Request(`https://site.test/api/orders/${seeded.orderId}`);
    const res = await call(orderRoute.GET, req, { params: { orderId: seeded.orderId } });
    expect(res.status).toBe(410);
    noPII(await res.text());
  });
  it('existing and unknown ids get byte-identical answers (existence not leaked)', async () => {
    const a = await call(orderRoute.GET, new Request('https://site.test/x'), { params: { orderId: seeded.orderId } });
    const b = await call(orderRoute.GET, new Request('https://site.test/x'), { params: { orderId: 'ORD-20261126-9999' } });
    expect(a.status).toBe(b.status);
    expect(await a.text()).toBe(await b.text());
  });
  it('customer order history is closed (410, no orders, no PII)', async () => {
    const res = await call(customerOrdersRoute.GET, new Request('https://site.test/x'), { params: { customerId: seeded.customerId } });
    expect(res.status).toBe(410);
    const text = await res.text();
    noPII(text);
    expect(text).not.toContain(seeded.orderId);
  });
});

describe('/api/orders/create: validated, returns only this order', () => {
  const body = (over: Record<string, unknown> = {}) => ({
    customerId: 'CUST-1764100000000', customerPhone: '0712345678', customerEmail: 'buyer@test.example',
    customerName: 'TEST Buyer', shippingLocation: 'Nairobi', paymentMethod: 'mpesa',
    items: [{ partCode: 'TEST-P2', partName: 'TEST belt', quantity: 2, unitPrice: 1500, subtotal: 1 }],
    ...over,
  });
  const post = (b: unknown) => createOrder(new Request('https://site.test/api/orders/create', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: typeof b === 'string' ? b : JSON.stringify(b),
  }));

  it('a checkout-shaped order succeeds; totals from quantity x price; no other customer data', async () => {
    const res = await post(body());
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Object.keys(data).sort()).toEqual(['message', 'orderId', 'shippingCost', 'subtotal', 'success', 'tax', 'total']);
    expect(data.subtotal).toBe(3000);
    expect(data.total).toBe(3000 + 480 + 500);
    noPII(JSON.stringify(data));
    expect(sent).toHaveLength(1);
    expect(sent[0][0]).toBe('buyer@test.example');
  });
  it('"other" delivery location (offered by checkout) is accepted', async () => {
    expect((await post(body({ shippingLocation: 'other' }))).status).toBe(200);
  });
  it('HTML in the name or location never reaches the confirmation email', async () => {
    for (const over of [
      { customerName: '<a href="https://evil.example">Claim refund</a>' },
      { shippingLocation: '<img src=x onerror=alert(1)>' },
    ]) {
      const res = await post(body(over));
      expect(res.status).toBe(400);
    }
    expect(sent).toHaveLength(0);
  });
  it('rejects malformed input', async () => {
    const bad: Record<string, unknown>[] = [
      { customerEmail: 'not-an-email' },
      { customerPhone: 'call me' },
      { customerId: { $ne: null } },
      { paymentMethod: 'free' },
      { items: [{ partCode: 'X', partName: 'Y', quantity: -3, unitPrice: 100 }] },
      { items: [{ partCode: 'X', partName: 'Y', quantity: 1, unitPrice: 'NaN' }] },
      { items: new Array(101).fill({ partCode: 'X', partName: 'Y', quantity: 1, unitPrice: 1 }) },
    ];
    for (const over of bad) expect((await post(body(over))).status).toBe(400);
    expect((await post('{not json')).status).toBe(400);
    expect(sent).toHaveLength(0);
  });
});

describe('payment facade: self-call never goes to a host from the request', () => {
  const init = (host: string) => new NextRequest('https://site.test/api/v1/payments/initialize', {
    method: 'POST',
    headers: { 'content-type': 'application/json', host, 'x-forwarded-host': host, 'x-forwarded-proto': 'https' },
    body: JSON.stringify({ provider: 'mpesa', amount: 100, customer_email: 'buyer@test.example', customer_phone: '254712345678', customer_name: 'TEST Buyer' }),
  });
  it('a foreign x-forwarded-host is refused before any fetch', async () => {
    const res = await initPayment(init('attacker.example'));
    expect(res.status).toBe(400);
    const res2 = await verifyPayment(
      new NextRequest('https://site.test/api/v1/payments/verify/psk%3Aabc', { headers: { 'x-forwarded-host': 'www.emersoneims.com.attacker.example' } }),
      { params: Promise.resolve({ payment_id: 'psk:abc' }) },
    );
    expect(res2.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('the site\'s own host is still used', async () => {
    await initPayment(init('www.emersoneims.com'));
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(String(fetchSpy.mock.calls[0][0])).toBe('https://www.emersoneims.com/api/payments/mpesa');
  });
});

describe('AquaScan data relay (unchanged; confirms exact-host check)', () => {
  it('prefix/suffix look-alike hosts are refused without fetching', async () => {
    for (const u of ['https://api.open-meteo.com.attacker.example/v1', 'https://power.larc.nasa.gov@attacker.example/', 'https://attacker.example/?power.larc.nasa.gov']) {
      const res = await dataRelay(new NextRequest(`https://site.test/api/borehole/data-relay?u=${encodeURIComponent(u)}`));
      expect(res.status).toBe(400);
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('marketplace pages handle the retired routes', () => {
  const gone = () => new Response(JSON.stringify({ success: false, error: 'retired' }), { status: 410, headers: { 'content-type': 'application/json' } });

  it('OrderTracker shows a notice on 410 and stops polling', async () => {
    fetchSpy.mockImplementation(async () => gone());
    render(<OrderTracker orderId="ORD-20261126-0042" />);
    expect(await screen.findByText(/Online order tracking is not available/)).toBeInTheDocument();
    expect(screen.queryByText('Order not found')).toBeNull();
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
  it('orders page with a stored customer id explains, on 410, that history needs an account', async () => {
    localStorage.setItem('customerId', 'CUST-1764000000000');
    fetchSpy.mockImplementation(async () => gone());
    render(<OrdersPage />);
    expect(await screen.findByText(/Order history needs an account/)).toBeInTheDocument();
    expect(screen.queryByText('No Orders Yet')).toBeNull();
  });
  it('orders page without a customer id shows the same notice and a working contact link (no dead Sign In)', async () => {
    render(<OrdersPage />);
    expect(await screen.findByText(/Order history needs an account/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute('href', '/contact');
    expect(screen.queryByRole('button', { name: 'Sign In' })).toBeNull();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('checkout still places an order through the real create route', async () => {
    localStorage.setItem('cart', JSON.stringify([{ part: { id: 'p1', code: 'TEST-P3', name: 'TEST injector', sellingPrice: 2500 }, quantity: 2 }]));
    fetchSpy.mockImplementation(async (url: unknown, initArg?: RequestInit) => {
      expect(String(url)).toBe('/api/orders/create');
      return createOrder(new Request('https://site.test/api/orders/create', initArg));
    });
    render(<CheckoutPage />);
    fireEvent.click(await screen.findByText(/Continue to Shipping/));
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'TEST Buyer' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'buyer@test.example' } });
    fireEvent.change(screen.getByPlaceholderText('0712345678'), { target: { value: '0712345678' } });
    fireEvent.click(screen.getByText(/Review Order/));
    fireEvent.click(screen.getByText(/Place Order & Pay/));
    await waitFor(() => expect(screen.getByText('Order Created Successfully!')).toBeInTheDocument());
    expect(screen.getByText(/^ORD-\d{8}-\d{4}$/)).toBeInTheDocument();
  });
});
