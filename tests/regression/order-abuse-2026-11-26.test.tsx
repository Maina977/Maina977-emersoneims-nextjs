/**
 * Order-abuse hotfix 2026-11-26 (CA-42 limiter, CA-43 server-side pricing).
 * Through the real /api/orders/create handler and the real checkout page.
 * The mailer is mocked (nothing is ever sent) and fetch is stubbed. TEST data.
 * This file imports only modules that exist on production 67107788, so every
 * test here can be run against the old code (negative control).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

const mailer = vi.hoisted(() => ({ calls: [] as unknown[][], fail: false }));
vi.mock('@/lib/email/emailService', () => ({
  sendOrderConfirmation: async (...args: unknown[]) => {
    mailer.calls.push(args);
    if (mailer.fail) throw new Error(`Resend rejected recipient ${String(args[0])}`);
    return { success: true };
  },
}));

import { POST as createOrder } from '@/app/api/orders/create/route';
import CheckoutPage from '@/app/marketplace/checkout/page';

// ABR-1 is in lib/parts/inventory-2026-07-22.csv at KES 1,153; ABR-2 at KES 1,634.
const ABR1 = 1153;
const ABR2 = 1634;

let seq = 0;
const uniq = () => `${Date.now()}${++seq}`;
const body = (over: Record<string, unknown> = {}) => ({
  customerId: `CUST-${uniq()}`,
  customerPhone: '0712345678',
  customerEmail: `buyer${uniq()}@test.example`,
  customerName: 'TEST Buyer',
  shippingLocation: 'Nairobi',
  paymentMethod: 'mpesa',
  items: [{ partCode: 'ABR-1', partName: 'TEST disc', quantity: 2, unitPrice: 1, subtotal: 2 }],
  website: '',
  formStartedAt: Date.now() - 60_000,
  ...over,
});
const post = (b: unknown, ip = `198.51.100.${(++seq % 250) + 1}`) =>
  createOrder(new Request('https://site.test/api/orders/create', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': `${ip}, 10.0.0.1` },
    body: JSON.stringify(b),
  }));
const ipFor = (tag: string) => `203.0.113.${tag}`;

beforeEach(() => { mailer.calls.length = 0; mailer.fail = false; vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('no network in tests'); })); });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); localStorage.clear(); });

describe('CA-43 server-side pricing', () => {
  it('a legitimate order is priced from the stock file, never the client price', async () => {
    const res = await post(body({ items: [{ partCode: 'ABR-1', partName: 'x', quantity: 2, unitPrice: 1, subtotal: 2 }, { partCode: 'ABR-2', quantity: 1, unitPrice: 999999 }] }));
    expect(res.status).toBe(200);
    const d = await res.json();
    const subtotal = ABR1 * 2 + ABR2;
    expect(d.priceConfirmed).toBe(true);
    expect(d.subtotal).toBe(subtotal);
    expect(d.tax).toBe(Math.round(subtotal * 0.16));
    expect(d.total).toBe(subtotal + Math.round(subtotal * 0.16) + 500);
    expect(mailer.calls).toHaveLength(1);
    expect(mailer.calls[0][3]).toBe(d.total); // the emailed total is the server's
  });
  it('an unknown part code is "price to be confirmed": no total stated, no email', async () => {
    const res = await post(body({ items: [{ partCode: 'NOT-A-REAL-CODE', partName: 'x', quantity: 1, unitPrice: 5, subtotal: 5 }] }));
    expect(res.status).toBe(200);
    const d = await res.json();
    expect(d.priceConfirmed).toBe(false);
    expect(d.message).toContain('Price to be confirmed by EmersonEIMS');
    expect(d.total).toBeUndefined();
    expect(d.subtotal).toBeUndefined();
    expect(mailer.calls).toHaveLength(0);
  });
});

describe('CA-42 abuse protection: rejected submissions send no email', () => {
  const generic = async (res: Response) => {
    expect(res.status).toBe(429);
    const d = await res.json();
    expect(d.error).toMatch(/Please wait a few minutes and try again/);
    expect(d.error).not.toMatch(/\d/); // reveals no limit or window
    expect(Object.keys(d)).toEqual(['error']);
  };
  it('honeypot filled -> generic 429, no email', async () => {
    await generic(await post(body({ website: 'https://spam.example' })));
    expect(mailer.calls).toHaveLength(0);
  });
  it('form sent too fast, or without the timestamp, or with a future one -> generic 429, no email', async () => {
    await generic(await post(body({ formStartedAt: Date.now() - 500 })));
    await generic(await post(body({ formStartedAt: undefined })));
    await generic(await post(body({ formStartedAt: Date.now() + 60_000 })));
    expect(mailer.calls).toHaveLength(0);
  });
  it('validation failures -> 400, no email', async () => {
    for (const over of [{ customerEmail: 'nope' }, { customerName: '<a href=x>y</a>' }, { items: [] }, { items: [{ partCode: 'ABR-1', quantity: 0 }] }, { items: [{ partCode: 'ABR-1', quantity: 1, unitPrice: 'NaN' }] }, { items: [{ partCode: 'ABR-1', quantity: 1, unitPrice: -1 }] }]) {
      expect((await post(body(over))).status).toBe(400);
    }
    expect(mailer.calls).toHaveLength(0);
  });
  it('one IP: 5 orders per 10 minutes, then a generic 429 and no further email', async () => {
    const ip = ipFor('11');
    for (let i = 0; i < 5; i++) expect((await post(body(), ip)).status, `order ${i + 1}`).toBe(200);
    await generic(await post(body(), ip));
    await generic(await post(body(), ip));
    expect(mailer.calls).toHaveLength(5);
  });
  it('one recipient: 3 confirmation emails per hour, even from different IPs', async () => {
    const email = `victim${uniq()}@test.example`;
    for (let i = 0; i < 3; i++) expect((await post(body({ customerEmail: email }), ipFor(`${20 + i}`))).status).toBe(200);
    await generic(await post(body({ customerEmail: email.toUpperCase() }), ipFor('30')));
    expect(mailer.calls).toHaveLength(3);
  });
  it('CONCURRENT: 20 parallel orders from one IP let exactly 5 through on this instance', async () => {
    const ip = ipFor('40');
    const results = await Promise.all(Array.from({ length: 20 }, () => post(body(), ip)));
    const statuses = results.map((r) => r.status);
    expect(statuses.filter((s) => s === 200)).toHaveLength(5);
    expect(statuses.filter((s) => s === 429)).toHaveLength(15);
    expect(mailer.calls).toHaveLength(5);
  });
  it('CONCURRENT: 10 parallel orders to one recipient from 10 IPs send exactly 3 emails', async () => {
    const email = `victim${uniq()}@test.example`;
    const results = await Promise.all(Array.from({ length: 10 }, (_, i) => post(body({ customerEmail: email }), ipFor(`${50 + i}`))));
    expect(results.filter((r) => r.status === 200)).toHaveLength(3);
    expect(mailer.calls).toHaveLength(3);
  });
});

describe('no customer data in logs', () => {
  it('a failing mailer and an order leave no email, name or phone in console output', async () => {
    const lines: string[] = [];
    for (const m of ['log', 'warn', 'error', 'info'] as const) vi.spyOn(console, m).mockImplementation((...a: unknown[]) => { lines.push(a.map((x) => (x instanceof Error ? `${x.name} ${x.message}` : String(x))).join(' ')); });
    mailer.fail = true;
    const email = `private${uniq()}@test.example`;
    expect((await post(body({ customerEmail: email, customerName: 'TEST Secretname', customerPhone: '0799888777' }), ipFor('70'))).status).toBe(200);
    await new Promise((r) => setTimeout(r, 10));
    const all = lines.join('\n');
    expect(all).not.toContain(email);
    expect(all).not.toContain('Secretname');
    expect(all).not.toContain('0799888777');
  });
});

describe('checkout page', () => {
  const cart = () => localStorage.setItem('cart', JSON.stringify([{ part: { id: 'p1', code: 'ABR-1', name: 'TEST disc', sellingPrice: 1 }, quantity: 2 }]));
  const fillAndPlace = async () => {
    fireEvent.click(await screen.findByText(/Continue to Shipping/));
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'TEST Buyer' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: `buyer${uniq()}@test.example` } });
    fireEvent.change(screen.getByPlaceholderText('0712345678'), { target: { value: '0712345678' } });
    fireEvent.click(screen.getByText(/Review Order/));
    fireEvent.click(screen.getByText(/Place Order & Pay/));
  };

  it('places a real order through the route: sends the honeypot and fill time, shows the SERVER total', async () => {
    cart();
    let sent: Record<string, unknown> = {};
    const t0 = Date.now();
    vi.stubGlobal('fetch', vi.fn(async (_u: unknown, init?: RequestInit) => {
      sent = JSON.parse(String(init?.body));
      vi.spyOn(Date, 'now').mockReturnValue(t0 + 10_000); // the customer took 10 s
      return createOrder(new Request('https://site.test/api/orders/create', { ...init, headers: { ...(init?.headers as Record<string, string>), 'x-forwarded-for': ipFor('80') } }));
    }));
    render(<CheckoutPage />);
    await fillAndPlace();
    await waitFor(() => expect(screen.getByText('Order Created Successfully!')).toBeInTheDocument());
    expect(sent.website).toBe('');
    expect(typeof sent.formStartedAt).toBe('number');
    const serverTotal = ABR1 * 2 + Math.round(ABR1 * 2 * 0.16) + 500;
    expect(screen.getByText(`KES ${serverTotal.toLocaleString()}`)).toBeInTheDocument();
    expect(mailer.calls).toHaveLength(1);
  });
  it('shows "Price to be confirmed by EmersonEIMS" (no amount) when the server cannot price', async () => {
    cart();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true, orderId: 'ORD-20261126-0001', priceConfirmed: false, message: 'Price to be confirmed by EmersonEIMS.' }), { status: 200, headers: { 'content-type': 'application/json' } })));
    render(<CheckoutPage />);
    await fillAndPlace();
    expect(await screen.findByText('Price to be confirmed by EmersonEIMS')).toBeInTheDocument();
    expect(screen.queryByText(/Total Amount Due/)).toBeNull();
    expect(screen.queryByText(/Complete Payment with M-Pesa/)).toBeNull();
  });
  it('shows the generic 429 message without the "check your details" hint', async () => {
    cart();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ error: 'We could not take this order right now. Please wait a few minutes and try again, or contact us.' }), { status: 429, headers: { 'content-type': 'application/json' } })));
    render(<CheckoutPage />);
    await fillAndPlace();
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Please wait a few minutes and try again');
    expect(alert).not.toHaveTextContent('Please check your name');
  });
});
