/**
 * Review of 0421aa80 (blocking): address forms that one Gmail inbox treats as the same mailbox but the per-recipient
 * limiter keyed separately — quoted local parts, a trailing-dot domain, an address literal — are refused by order
 * validation (400) before the limiter and before any email. Ordinary addresses still order normally.
 * Mailer mocked, no network, TEST data only.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mailer = vi.hoisted(() => ({ calls: [] as unknown[][] }));
vi.mock('@/lib/email/emailService', () => ({ sendOrderConfirmation: async (...a: unknown[]) => { mailer.calls.push(a); return { success: true }; } }));
import { POST } from '@/app/api/orders/create/route';

let n = 0;
const u = () => `${Date.now()}${++n}`;
const body = (o: Record<string, unknown> = {}) => ({
  customerId: `CUST-${u()}`, customerPhone: '0712345678', customerEmail: `buyer${u()}@test.example`, customerName: 'TEST Buyer',
  shippingLocation: 'Nairobi', paymentMethod: 'mpesa', items: [{ partCode: 'ABR-1', quantity: 1 }], website: '', formStartedAt: Date.now() - 60_000, ...o,
});
const send = async (b: unknown) => {
  const res = await POST(new Request('http://localhost/api/orders/create', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json', 'x-real-ip': `198.51.100.${(n++ % 250) + 1}` } }));
  return res.status;
};
beforeEach(() => { mailer.calls.length = 0; });

describe('order email forms that would dodge the per-inbox limit are refused', () => {
  it('quoted local parts, a trailing-dot domain, an address literal and a backslash: 400, no email', async () => {
    const id = u();
    const forms = [`"victim${id}"@gmail.com`, `"v.ictim${id}+x"@gmail.com`, `victim${id}@gmail.com.`, `victim${id}@[gmail.com]`, `vic\\tim${id}@gmail.com`, `victim${id}@gmail..`];
    for (const e of forms) expect(await send(body({ customerEmail: e })), e).toBe(400);
    expect(mailer.calls).toEqual([]);
  });
  it('ordinary addresses (dots, hyphens, sub-domains, plus-tags) still order normally', async () => {
    const id = u();
    for (const e of [`jane.doe${id}@example.co.ke`, `j-doe${id}@mail.example.com`, `jane${id}+shop@gmail.com`]) expect(await send(body({ customerEmail: e })), e).toBe(200);
    expect(mailer.calls).toHaveLength(3);
  });
});
