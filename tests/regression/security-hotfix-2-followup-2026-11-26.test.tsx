/**
 * Security hotfix 2 follow-up (independent review of 5b2eb01d), 2026-11-26.
 * Through the real route handlers and page, with fetch stubbed (no provider,
 * no production request) and TEST keys only:
 *  - Paystack / Flutterwave verify refuse traversal and injection before any
 *    fetch, encode what they send, and return no customer PII;
 *  - /api/v1/payments/verify refuses bad ids and passes on no PII;
 *  - checkout shows the server's error when an order is refused.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NextRequest } from 'next/server';
import { GET as paystackVerify } from '@/app/api/payments/paystack/route';
import { GET as flutterwaveVerify } from '@/app/api/payments/flutterwave/route';
import { GET as v1Verify } from '@/app/api/v1/payments/verify/[payment_id]/route';
import { POST as createOrder } from '@/app/api/orders/create/route';
import CheckoutPage from '@/app/marketplace/checkout/page';

vi.mock('@/lib/email/emailService', () => ({ sendOrderConfirmation: async () => ({ success: false }) }));

const PII = ['victim@test.example', 'TEST Victim', 'Person', '254700111222'];
const noPII = (text: string) => { for (const v of PII) expect(text).not.toContain(v); };

// What a provider answers: a real transaction including the customer's details.
const paystackTx = { status: true, data: { status: 'success', amount: 150000, currency: 'KES', reference: 'SGP-1764100000000-ABCD1234', channel: 'card', customer: { email: PII[0], first_name: PII[1], last_name: PII[2] }, paid_at: '2026-11-26', gateway_response: 'Approved' } };
const flwTx = { status: 'success', data: { id: 4567, status: 'successful', amount: 1500, currency: 'KES', tx_ref: 'pay_1764100000000', payment_type: 'card', customer: { email: PII[0], name: `${PII[1]} ${PII[2]}`, phone_number: PII[3] }, created_at: '2026-11-26' } };

let fetchSpy: ReturnType<typeof vi.fn>;
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });
beforeEach(() => {
  vi.stubEnv('PAYSTACK_SECRET_KEY', 'sk_test_TEST_ONLY');
  vi.stubEnv('FLUTTERWAVE_SECRET_KEY', 'FLWSECK_TEST-TEST_ONLY');
  fetchSpy = vi.fn(async (url: unknown) => {
    const u = String(url);
    if (u.startsWith('https://api.paystack.co/')) return json(paystackTx);
    if (u.startsWith('https://api.flutterwave.com/')) return json(flwTx);
    // The v1 facade's self-calls go through the real provider routes.
    if (u.startsWith('https://www.emersoneims.com/api/payments/paystack')) return paystackVerify(new NextRequest(u));
    if (u.startsWith('https://www.emersoneims.com/api/payments/flutterwave')) return flutterwaveVerify(new NextRequest(u));
    throw new Error(`unexpected fetch ${u}`);
  });
  vi.stubGlobal('fetch', fetchSpy);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); localStorage.clear(); });

const BAD_REFS = ['../../transaction/123', '..', '.', 'a/b', '/transaction/export', 'a?perPage=100', 'a#b', 'a%2F..%2F', 'a&status=success', ' a', 'a b', 'x'.repeat(101), 'a\r\nX: y'];

describe('Paystack verify', () => {
  const get = (q: string) => paystackVerify(new NextRequest(`https://www.emersoneims.com/api/payments/paystack?${q}`));
  it('traversal / injection references: 400 before any fetch', async () => {
    for (const r of BAD_REFS) expect((await get(`reference=${encodeURIComponent(r)}`)).status, r).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('a legitimate reference still verifies; the reference is encoded; no PII returned', async () => {
    const res = await get('reference=SGP-1764100000000-ABCD1234');
    expect(res.status).toBe(200);
    expect(String(fetchSpy.mock.calls[0][0])).toBe('https://api.paystack.co/transaction/verify/SGP-1764100000000-ABCD1234');
    const body = await res.json();
    expect(body).toEqual({ success: true, data: { status: 'success', amount: 1500, currency: 'KES', reference: 'SGP-1764100000000-ABCD1234' } });
    noPII(JSON.stringify(body));
    await get('reference=SGP%3D1');
    expect(String(fetchSpy.mock.calls[1][0])).toBe('https://api.paystack.co/transaction/verify/SGP%3D1');
  });
});

describe('Flutterwave verify', () => {
  const get = (q: string) => flutterwaveVerify(new NextRequest(`https://www.emersoneims.com/api/payments/flutterwave?${q}`));
  it('bad transaction_id or tx_ref: 400 before any fetch', async () => {
    for (const t of ['123/../../x', '../4567', '1;2', 'abc', '-1', '1'.repeat(21)]) expect((await get(`transaction_id=${encodeURIComponent(t)}`)).status, t).toBe(400);
    for (const r of BAD_REFS) expect((await get(`tx_ref=${encodeURIComponent(r)}`)).status, r).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('legitimate ids still verify, encoded, with no email, name or phone', async () => {
    const a = await get('transaction_id=4567');
    expect(a.status).toBe(200);
    expect(String(fetchSpy.mock.calls[0][0])).toBe('https://api.flutterwave.com/v3/transactions/4567/verify');
    const b = await get('tx_ref=pay_1764100000000');
    expect(String(fetchSpy.mock.calls[1][0])).toBe('https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=pay_1764100000000');
    await get('tx_ref=abc%3D%3D');
    expect(String(fetchSpy.mock.calls[2][0])).toBe('https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=abc%3D%3D');
    for (const res of [a, b]) {
      const body = await res.json();
      expect(body).toEqual({ success: true, data: { status: 'successful', amount: 1500, currency: 'KES', reference: 'pay_1764100000000' } });
      noPII(JSON.stringify(body));
    }
  });
});

describe('/api/v1/payments/verify facade', () => {
  const verify = (id: string) => v1Verify(
    new NextRequest(`https://www.emersoneims.com/api/v1/payments/verify/${encodeURIComponent(id)}`, { headers: { 'x-forwarded-host': 'www.emersoneims.com' } }),
    { params: Promise.resolve({ payment_id: encodeURIComponent(id) }) },
  );
  it('refuses traversal ids before any fetch', async () => {
    for (const id of ['psk:../../transaction/123', 'flw:a&status=successful', 'psk:..', 'flw:a/b']) expect((await verify(id)).status, id).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('a malformed escape (/verify/%25 -> "%") is a clean 400, not an unhandled 500', async () => {
    const res = await v1Verify(
      new NextRequest('https://www.emersoneims.com/api/v1/payments/verify/%25', { headers: { 'x-forwarded-host': 'www.emersoneims.com' } }),
      { params: Promise.resolve({ payment_id: '%' }) },
    );
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('Invalid payment_id format. Expected "<provider>:<id>".');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('legitimate ids still verify and pass on no PII', async () => {
    for (const [id, status] of [['psk:SGP-1764100000000-ABCD1234', 'completed'], ['flw:pay_1764100000000', 'completed']] as const) {
      const res = await verify(id);
      const body = await res.json();
      expect(body.status, id).toBe(status);
      noPII(JSON.stringify(body));
    }
  });
});

describe('checkout shows a refused order', () => {
  it('a 400 from the server is shown to the customer', async () => {
    localStorage.setItem('cart', JSON.stringify([{ part: { id: 'p1', code: 'TEST-P3', name: 'TEST injector', sellingPrice: 2500 }, quantity: 1 }]));
    fetchSpy.mockImplementation(async (_url: unknown, init?: RequestInit) => createOrder(new Request('https://site.test/api/orders/create', init)));
    render(<CheckoutPage />);
    fireEvent.click(await screen.findByText(/Continue to Shipping/));
    fireEvent.change(screen.getByPlaceholderText('John Doe'), { target: { value: 'TEST Buyer' } });
    fireEvent.change(screen.getByPlaceholderText('john@example.com'), { target: { value: 'buyer@test.example' } });
    fireEvent.change(screen.getByPlaceholderText('0712345678'), { target: { value: 'call me' } });
    fireEvent.click(screen.getByText(/Review Order/));
    fireEvent.click(screen.getByText(/Place Order & Pay/));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Invalid order details');
    expect(screen.queryByText('Order Created Successfully!')).toBeNull();
  });
});
