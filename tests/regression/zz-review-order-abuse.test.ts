/** Independent reviewer: order-abuse hotfix (6c63b6f5). Mailer mocked, no network, TEST data only. */
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mailer = vi.hoisted(() => ({ calls: [] as unknown[][] }));
vi.mock('@/lib/email/emailService', () => ({ sendOrderConfirmation: async (...a: unknown[]) => { mailer.calls.push(a); return { success: true }; } }));
import { POST } from '@/app/api/orders/create/route';
import { clientIp } from '@/lib/orders/orderAbuseGuard';

let n = 0;
const u = () => `${Date.now()}${++n}`;
const body = (o: Record<string, unknown> = {}) => ({
  customerId: `CUST-${u()}`, customerPhone: '0712345678', customerEmail: `buyer${u()}@test.example`, customerName: 'TEST Buyer',
  shippingLocation: 'Nairobi', paymentMethod: 'mpesa', items: [{ partCode: 'ABR-1', quantity: 2, unitPrice: 1 }], website: '', formStartedAt: Date.now() - 60_000, ...o,
});
const send = async (b: unknown, headers: Record<string, string> = {}) => {
  const res = await POST(new Request('http://localhost/api/orders/create', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json', ...headers } }));
  return { status: res.status, j: await res.json() };
};
const ip = () => ({ 'x-forwarded-for': `203.0.113.${(n++ % 250) + 1}, 10.0.0.${n % 250}` });
beforeEach(() => { mailer.calls.length = 0; });

describe('pricing from the trusted file only', () => {
  it('client price ignored; total = CSV price x qty + 16 % + shipping', async () => {
    const { status, j } = await send(body({ items: [{ partCode: 'ABR-1', quantity: 3, unitPrice: 0 }] }), ip());
    expect(status).toBe(200);
    expect(j.subtotal).toBe(1153 * 3);
    expect(j.total).toBe(j.subtotal + j.tax + j.shippingCost);
    expect(mailer.calls).toHaveLength(1);
  });
  it('part-code injection / look-alikes are unpriced: no total, no email', async () => {
    for (const code of ['__proto__', 'constructor', 'abr-1', 'ABR-1​', 'ABR-1 x', 'ABR‑1', "ABR-1' OR 1=1", 'ＡＢＲ-1']) {
      const { status, j } = await send(body({ items: [{ partCode: code, quantity: 1 }] }), ip());
      expect(status, code).toBe(200);
      expect(j.priceConfirmed, code).toBe(false);
      expect(j.total, code).toBeUndefined();
    }
    expect(mailer.calls).toEqual([]);
  });
  it('one unpriced line makes the whole order unpriced (no partial total, no email)', async () => {
    const { j } = await send(body({ items: [{ partCode: 'ABR-1', quantity: 1 }, { partCode: 'NOPE-0', quantity: 1 }] }), ip());
    expect([j.priceConfirmed, j.total]).toEqual([false, undefined]);
    expect(mailer.calls).toEqual([]);
  });
  it('quantity overflow and non-integers are 400 with no email', async () => {
    for (const q of [0, -1, 1001, 1e308, 1.5, Number.MAX_SAFE_INTEGER, '2']) expect((await send(body({ items: [{ partCode: 'ABR-1', quantity: q }] }), ip())).status, String(q)).toBe(400);
    expect((await send(body({ items: Array.from({ length: 101 }, () => ({ partCode: 'ABR-1', quantity: 1 })) }), ip())).status).toBe(400);
    expect(mailer.calls).toEqual([]);
  });
});

describe('automation checks', () => {
  it('honeypot, missing/stringy/future/too-recent/ancient formStartedAt → 429 and no email', async () => {
    const now = Date.now();
    for (const o of [{ website: 'x' }, { website: ' ' }, { website: 0 }, { formStartedAt: undefined }, { formStartedAt: String(now - 60_000) }, { formStartedAt: now + 5_000 }, { formStartedAt: now - 1_000 }, { formStartedAt: now - 25 * 3600_000 }, { formStartedAt: NaN }]) {
      expect((await send(body(o), ip())).status, JSON.stringify(o)).toBe(429);
    }
    expect(mailer.calls).toEqual([]);
  });
  it('INFO: a scripted client that back-dates formStartedAt passes (documented limitation)', async () => {
    expect((await send(body({ formStartedAt: Date.now() - 4_000 }), ip())).status).toBe(200);
  });
});

describe('IP key', () => {
  it('uses the first x-forwarded-for entry; falls back to x-real-ip, then a shared "unknown" bucket', () => {
    const r = (h: Record<string, string>) => clientIp(new Request('http://x', { headers: h }));
    expect(r({ 'x-forwarded-for': '198.51.100.7, 10.0.0.1' })).toBe('198.51.100.7');
    expect(r({ 'x-forwarded-for': ' , 10.0.0.1', 'x-real-ip': '198.51.100.8' })).toBe('198.51.100.8');
    expect(r({})).toBe('unknown');
  });
  it('concurrency: 25 parallel orders from one IP → exactly 5 accepted and 5 emails', async () => {
    const h = { 'x-forwarded-for': '192.0.2.77' };
    const res = await Promise.all(Array.from({ length: 25 }, () => send(body(), h)));
    expect(res.filter((r) => r.status === 200)).toHaveLength(5);
    expect(res.filter((r) => r.status === 429)).toHaveLength(20);
    expect(mailer.calls).toHaveLength(5);
  });
});

describe('per-recipient limit', () => {
  it('concurrency: 12 parallel orders to one address from different IPs → exactly 3 emails', async () => {
    const to = `victim${u()}@test.example`;
    const res = await Promise.all(Array.from({ length: 12 }, () => send(body({ customerEmail: to }), ip())));
    expect(res.filter((r) => r.status === 200)).toHaveLength(3);
    expect(mailer.calls).toHaveLength(3);
  });
  it('case and surrounding spaces do not dodge it', async () => {
    const base = `victim${u()}@test.example`;
    const vs = [base, base.toUpperCase(), ` ${base} `, base.replace('victim', 'VicTim'), base];
    let ok = 0; for (const e of vs) if ((await send(body({ customerEmail: e }), ip())).status === 200) ok++;
    expect(ok).toBe(3);
  });
  it('INFO + check: plus-addressing and Gmail dots reach the same inbox; do they dodge the limit?', async () => {
    const id = u();
    const vs = Array.from({ length: 6 }, (_, i) => `victim${id}+${i}@gmail.com`).concat([`v.ictim${id}@gmail.com`, `vi.ctim${id}@gmail.com`]);
    let ok = 0; for (const e of vs) if ((await send(body({ customerEmail: e }), ip())).status === 200) ok++;
    process.stdout.write(`PLUS-ADDRESS accepted ${ok} of ${vs.length} to one Gmail inbox (limit 3)\n`);
    expect(ok).toBeLessThanOrEqual(3);
  });
});

describe('logs', () => {
  it('no email, name or phone in any console output on success, refusal or mailer error', async () => {
    const out: string[] = [];
    const spies = (['log', 'info', 'warn', 'error', 'debug'] as const).map((k) => vi.spyOn(console, k).mockImplementation((...a: unknown[]) => { out.push(a.map(String).join(' ')); }));
    await send(body({ customerEmail: 'pii.check@test.example', customerName: 'TEST Piiname', customerPhone: '0799111222' }), ip());
    await send(body({ customerEmail: 'pii.check@test.example', website: 'bot' }), ip());
    await send({ ...body({ customerEmail: 'pii.check@test.example' }), items: 'x' }, ip());
    spies.forEach((s) => s.mockRestore());
    expect(out.join('\n')).not.toMatch(/pii\.check|Piiname|0799111222/);
  });
});
