/** Independent reviewer, security hotfix 2 (5b2eb01d). No network, no production requests. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const fetchSpy = vi.fn(async (..._a: unknown[]) => new Response(JSON.stringify({ id: 'x', status: true, data: {} }), { status: 200, headers: { 'content-type': 'application/json' } }));
beforeEach(() => { fetchSpy.mockClear(); vi.stubGlobal('fetch', fetchSpy); });
afterEach(() => { vi.unstubAllEnvs(); });

const SEVEN = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
const methodsOf = (m: Record<string, unknown>) => Object.keys(m).filter((k) => /^[A-Z]+$/.test(k)).sort();

describe('retired routes: method coverage (management: 410 on all 7)', () => {
  it('INFO + check: exported methods per retired route', async () => {
    const routes: Record<string, Record<string, unknown>> = {
      proxy: await import('@/app/api/src/app/api/proxy/[...path]/route'),
      order: await import('@/app/api/orders/[orderId]/route'),
      customerOrders: await import('@/app/api/customers/[customerId]/orders/route'),
    };
    const out: Record<string, string[]> = {};
    for (const [n, m] of Object.entries(routes)) out[n] = methodsOf(m);
    process.stdout.write(`METHODS ${JSON.stringify(out)}\n`);
    for (const [n, list] of Object.entries(out)) expect(list, n).toEqual(SEVEN);
  });
});

describe('proxy fetches nothing', () => {
  const targets = ['https://api.nasa.gov.attacker.example/x', 'https://api.nasa.gov@evil.example/', 'http://169.254.169.254/latest/meta-data/', 'http://2852039166/', 'http://[::ffff:a9fe:a9fe]/', 'http://0x7f000001/', 'https://api.nasa.gov/planetary/apod', 'file:///etc/passwd'];
  it('every exported method, every target: 410, no fetch, no CORS header', async () => {
    const m = await import('@/app/api/src/app/api/proxy/[...path]/route') as Record<string, (...a: unknown[]) => Response | Promise<Response>>;
    for (const name of methodsOf(m)) for (const t of targets) {
      const req = new NextRequest(`http://localhost/api/src/app/api/proxy/a?target=${encodeURIComponent(t)}`, { method: name, ...(name === 'GET' || name === 'HEAD' ? {} : { body: '{}' }) });
      const res = await m[name](req, { params: Promise.resolve({ path: ['a'] }) });
      expect(res.status, `${name} ${t}`).toBe(410);
      expect(res.headers.get('access-control-allow-origin')).toBeNull();
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('order routes: no data, identical for every id', () => {
  it('410 and byte-identical bodies for any id', async () => {
    const o = await import('@/app/api/orders/[orderId]/route') as any;
    const c = await import('@/app/api/customers/[customerId]/orders/route') as any;
    const bodies = new Set<string>();
    for (const id of ['ORD-20261126-0001', 'x', '../../etc', '<script>']) {
      const r1 = await o.GET(new NextRequest(`http://localhost/api/orders/${encodeURIComponent(id)}`), { params: Promise.resolve({ orderId: id }) });
      const r2 = await c.GET(new NextRequest(`http://localhost/api/customers/${encodeURIComponent(id)}/orders`), { params: Promise.resolve({ customerId: id }) });
      expect([r1.status, r2.status]).toEqual([410, 410]);
      bodies.add('o' + (await r1.text())); bodies.add('c' + (await r2.text()));
    }
    expect(bodies.size).toBe(2);
  });
});

describe('order create: validation and email HTML', () => {
  // Adapted for the order-abuse hotfix (CA-42/43): a real stock code priced by
  // the server (ABR-1, KES 1,153) and the checkout's honeypot + fill time.
  const good = { customerId: 'CUST-1795700000000', customerPhone: '0712 345 678', customerEmail: 'test@example.com', customerName: 'TEST Wanjiku', items: [{ partCode: 'ABR-1', partName: 'Filter', quantity: 2, unitPrice: 1500, subtotal: 1 }], shippingLocation: 'Nairobi', paymentMethod: 'mpesa', website: '', formStartedAt: Date.now() - 60_000 };
  const post = async (b: unknown, raw?: string) => {
    const { POST } = await import('@/app/api/orders/create/route');
    const res = await POST(new Request('http://localhost/api/orders/create', { method: 'POST', body: raw ?? JSON.stringify(b), headers: { 'content-type': 'application/json' } }));
    return { status: res.status, j: await res.json().catch(() => null) };
  };
  it('checkout shape accepted; subtotal recomputed server-side', async () => {
    const { status, j } = await post(good);
    expect(status).toBe(200);
    expect(j.subtotal).toBe(2 * 1153); // server price, not the client's
  });
  it('rejects injection / bad shapes', async () => {
    const bad: unknown[] = [
      { ...good, customerName: '<img src=x onerror=alert(1)>' },
      { ...good, customerName: 'a"><b' },
      { ...good, shippingLocation: '<b>x</b>' },
      { ...good, customerEmail: 'a@b.c\r\nBcc: victim@example.com' },
      { ...good, customerEmail: 'x' },
      { ...good, customerPhone: 'abc' },
      { ...good, items: [] },
      { ...good, items: [{ ...good.items[0], quantity: 1.5 }] },
      { ...good, items: [{ ...good.items[0], unitPrice: -1 }] },
      { ...good, items: [{ ...good.items[0], unitPrice: 'NaN' }] },
      { ...good, customerId: '../x' },
      { ...good, paymentMethod: 'free' },
      null, [1], 'x',
    ];
    for (const b of bad) expect((await post(b)).status, JSON.stringify(b)).toBe(400);
    expect((await post(undefined, '{bad')).status).toBe(400);
  });
  it('email html: name and location are inert text (production + key set, fetch captured)', async () => {
    vi.stubEnv('RESEND_API_KEY', 'TEST'); vi.stubEnv('VERCEL_ENV', 'production'); vi.stubEnv('NODE_ENV', 'production');
    await post({ ...good, customerName: 'TEST &amp; Co" onclick=x' });
    await new Promise((r) => setTimeout(r, 20));
    const call = fetchSpy.mock.calls.find((c) => String(c[0]).includes('resend'));
    if (call) {
      const html = JSON.parse(String((call[1] as RequestInit).body)).html as string;
      process.stdout.write(`EMAIL name fragment: ${html.match(/Hi [^<]*</)?.[0]}\n`);
      expect(html).not.toMatch(/<[a-z]+[^>]*onclick/i);
    } else process.stdout.write('EMAIL not sent in test env (liveDeliveryAllowed false)\n');
  });
});

describe('payment self-call host allowlist', () => {
  const load = async () => (await import('@/lib/security/selfOrigin')).trustedSelfOrigin;
  const req = (h: Record<string, string>) => new NextRequest('http://localhost/api/v1/payments/initialize', { headers: h });
  it('bypass attempts are refused on Vercel; legitimate hosts work', async () => {
    vi.stubEnv('VERCEL', '1'); vi.stubEnv('VERCEL_URL', 'my-app-abc123-team.vercel.app'); vi.stubEnv('VERCEL_BRANCH_URL', 'my-app-git-main-team.vercel.app'); vi.stubEnv('VERCEL_PROJECT_PRODUCTION_URL', 'www.emersoneims.com');
    const f = await load();
    const refused = ['attacker.example', 'www.emersoneims.com.attacker.example', 'www.emersoneims.com.', 'www.emersoneims.com:443', 'evil.vercel.app', 'my-app-abc123-team.vercel.app.evil.example', 'xmy-app-abc123-team.vercel.app', 'localhost:3000', '127.0.0.1', 'www.emersoneims.com@evil.example', 'www.emersoneims.com/evil', ' '];
    for (const h of refused) expect(f(req({ 'x-forwarded-host': h })), h).toBeNull();
    expect(f(req({ 'x-forwarded-host': 'attacker.example', host: 'www.emersoneims.com' }))).toBeNull();
    expect(f(req({ 'x-forwarded-host': 'attacker.example, www.emersoneims.com' }))).toBeNull();
    for (const h of ['www.emersoneims.com', 'EmersonEIMS.com', 'my-app-abc123-team.vercel.app', 'my-app-git-main-team.vercel.app']) expect(f(req({ 'x-forwarded-host': h })), h).toBe(`https://${h.toLowerCase()}`);
    expect(f(req({ 'x-forwarded-host': 'www.emersoneims.com, attacker.example' }))).toBe('https://www.emersoneims.com');
  });
  it('off Vercel only localhost/127.0.0.1 get http', async () => {
    vi.stubEnv('VERCEL', '');
    const f = await load();
    expect(f(req({ host: 'localhost:3000' }))).toBe('http://localhost:3000');
    expect(f(req({ host: 'localhost.evil.example' }))).toBeNull();
    expect(f(req({ host: '127.0.0.1.nip.io' }))).toBeNull();
  });
});
