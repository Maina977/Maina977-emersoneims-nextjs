/**
 * Security sweep 2026-11-26, second commit: H7 (M-Pesa STK route) and the
 * Medium findings exposed now. Through the real handlers; fetch is stubbed
 * (no Safaricom, no provider, no email), TEST values only.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

import { POST as mpesaPost, GET as mpesaGet } from '@/app/api/payments/mpesa/route';
import { issueOrderToken } from '@/lib/payments/orderToken';
import * as newLead from '@/app/api/notifications/new-lead/route';
import * as reportDownload from '@/app/api/reports/[reportId]/download/route';
import * as oracleSuppliers from '@/app/api/generator-oracle/suppliers/route';
import * as oracleMedia from '@/app/api/generator-oracle/media/upload/route';
import { POST as roofAutofill } from '@/app/api/solar/roof-autofill/route';
import { GET as weatherGet } from '@/app/api/weather/[lat]/[lon]/route';
import { POST as gldasPost, GET as gldasGet } from '@/app/api/borehole/nasa-gldas/route';
import { POST as solarWeatherPost } from '@/app/api/solar/weather/route';
import { POST as solarElevationPost } from '@/app/api/solar/elevation/route';
import { POST as climatePost } from '@/app/api/building/climate/route';
import { POST as floodPost } from '@/app/api/building/flood/route';
import { POST as siteAnalysisPost } from '@/app/api/building/site-analysis/route';

const SEVEN = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
type H = (...a: unknown[]) => Promise<Response> | Response;
const call = (h: unknown, ...a: unknown[]) => Promise.resolve((h as H)(...a));
let n = 0;
const ip = () => `198.51.100.${(++n % 250) + 1}`;
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });

let fetchSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fetchSpy = vi.fn(async () => { throw new Error('no network in tests'); });
  vi.stubGlobal('fetch', fetchSpy);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

describe('H7 /api/payments/mpesa: amount only from a server-issued order token', () => {
  const SECRET = 'TEST-ORDER-TOKEN-SECRET-0123456789abcdef';
  const env = () => {
    for (const [k, v] of Object.entries({ MPESA_CONSUMER_KEY: 'k', MPESA_CONSUMER_SECRET: 's', MPESA_PASSKEY: 'p', MPESA_SHORTCODE: '174379', MPESA_CALLBACK_URL: 'https://site.test/cb', ORDER_TOKEN_SECRET: SECRET })) vi.stubEnv(k, v);
  };
  const safaricom = () => fetchSpy.mockImplementation(async (url: unknown) => {
    const u = String(url);
    if (u.includes('/oauth/')) return json({ access_token: 'TEST' });
    if (u.includes('/stkpush/')) return json({ ResponseCode: '0', MerchantRequestID: 'm', CheckoutRequestID: 'ws_CO_TEST', ResponseDescription: 'ok', CustomerMessage: 'ok' });
    throw new Error(`unexpected ${u}`);
  });
  const post = (body: unknown, from = ip()) => mpesaPost(new NextRequest('https://site.test/api/payments/mpesa', {
    method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': from }, body: JSON.stringify(body),
  }));
  const token = (amount = 2306, orderId = 'ORD-20261126-0042', exp = Date.now() + 600_000) => issueOrderToken({ orderId, amount, exp })!;
  const stkCalls = () => fetchSpy.mock.calls.filter((c) => String(c[0]).includes('/stkpush/'));

  it('client phone + amount without an order token: generic 400, no Safaricom call', async () => {
    env(); safaricom();
    const res = await post({ phoneNumber: '0712345678', amount: 150000, accountReference: 'EIMS' });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ success: false, error: 'Payment could not be started.' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('tampered, expired, foreign-key or malformed tokens: 400, no call', async () => {
    env(); safaricom();
    const t = token();
    const [v, payload, sig] = t.split('.');
    const forged = Buffer.from(JSON.stringify({ orderId: 'ORD-1', amount: 1, exp: Date.now() + 1e6 })).toString('base64url');
    for (const bad of [`${v}.${forged}.${sig}`, token(2306, 'ORD-1', Date.now() - 1), `${v}.${payload}.AAAA`, 'v1.x.y', 'x'.repeat(700), 12345]) {
      expect((await post({ orderToken: bad, phoneNumber: '0712345678' })).status).toBe(400);
    }
    vi.stubEnv('ORDER_TOKEN_SECRET', 'another-secret-another-secret-another-secret');
    expect((await post({ orderToken: t, phoneNumber: '0712345678' })).status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('a valid token starts the prompt for the TOKEN amount, never the body amount; no phone in logs', async () => {
    env(); safaricom();
    const lines: string[] = [];
    for (const m of ['log', 'warn', 'error', 'info'] as const) vi.spyOn(console, m).mockImplementation((...a: unknown[]) => { lines.push(a.map(String).join(' ')); });
    const res = await post({ orderToken: token(2306), phoneNumber: '0712 345 678', amount: 1, accountReference: 'HACK' });
    expect(res.status).toBe(200);
    const sent = JSON.parse(String((stkCalls()[0][1] as RequestInit).body));
    expect(sent.Amount).toBe(2306);
    expect(sent.PhoneNumber).toBe('254712345678');
    expect(sent.AccountReference).toBe('ORD-20261126'); // the order id (12-char Daraja limit), not the body's
    expect(lines.join('\n')).not.toMatch(/712345678/);
  });
  it('not a Kenyan mobile number: 400, no call', async () => {
    env(); safaricom();
    for (const phone of ['020123456', 'call me', '+44 7700 900123', '07123456789012345678901']) expect((await post({ orderToken: token(), phoneNumber: phone })).status, phone).toBe(400);
    expect(stkCalls()).toHaveLength(0);
  });
  it('no ORDER_TOKEN_SECRET configured: nothing can be paid (400)', async () => {
    env(); safaricom();
    const t = token();
    vi.stubEnv('ORDER_TOKEN_SECRET', '');
    expect((await post({ orderToken: t, phoneNumber: '0712345678' })).status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('per IP: 5 prompts per 10 minutes, then a generic 429', async () => {
    env(); safaricom();
    const from = '203.0.113.77';
    for (let i = 0; i < 5; i++) expect((await post({ orderToken: token(), phoneNumber: `07123400${10 + i}` }, from)).status).toBe(200);
    const res = await post({ orderToken: token(), phoneNumber: '0712340099' }, from);
    expect(res.status).toBe(429);
    expect(JSON.stringify(await res.json())).not.toMatch(/\d/);
    expect(stkCalls()).toHaveLength(5);
  });
  it('per phone: 3 prompts per hour even from different IPs, then 429', async () => {
    env(); safaricom();
    for (let i = 0; i < 3; i++) expect((await post({ orderToken: token(), phoneNumber: '0799000111' })).status).toBe(200);
    expect((await post({ orderToken: token(), phoneNumber: '+254 799 000 111' })).status).toBe(429);
    expect(stkCalls()).toHaveLength(3);
  });
  it('configuration state is not revealed', async () => {
    vi.stubEnv('ORDER_TOKEN_SECRET', SECRET); // token valid, M-Pesa not configured
    const res = await post({ orderToken: token(), phoneNumber: '0712345678' });
    expect(JSON.stringify(await res.json())).not.toMatch(/MPESA_|Missing/);
  });
  it('status query: malformed checkoutRequestId refused before any call', async () => {
    env(); safaricom();
    const res = await mpesaGet(new NextRequest(`https://site.test/api/payments/mpesa?checkoutRequestId=${encodeURIComponent('x"} ,{"a')}`, { headers: { 'x-forwarded-for': ip() } }));
    expect(res.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('retired: new-lead alerts, report download, Oracle suppliers, Oracle media (all 7 methods, 410, nothing sent)', () => {
  const routes: Array<[string, Record<string, unknown>, string]> = [
    ['notifications/new-lead', newLead as Record<string, unknown>, 'https://site.test/api/notifications/new-lead'],
    ['reports/[id]/download', reportDownload as Record<string, unknown>, 'https://site.test/api/reports/ANYTHING/download'],
    ['generator-oracle/suppliers', oracleSuppliers as Record<string, unknown>, 'https://site.test/api/generator-oracle/suppliers'],
    ['generator-oracle/media/upload', oracleMedia as Record<string, unknown>, 'https://site.test/api/generator-oracle/media/upload?id=1'],
  ];
  for (const [name, mod, url] of routes) {
    it(name, async () => {
      vi.stubEnv('VERCEL_ENV', 'production');
      vi.stubEnv('SLACK_WEBHOOK_URL', 'https://hooks.test/x'); vi.stubEnv('EMAIL_SERVICE_URL', 'https://mail.test/x'); vi.stubEnv('SMS_SERVICE_URL', 'https://sms.test/x');
      expect(Object.keys(mod).filter((k) => /^[A-Z]+$/.test(k)).sort()).toEqual(SEVEN);
      for (const m of SEVEN) {
        const res = await call(mod[m], new NextRequest(url, { method: m, ...(m === 'GET' || m === 'HEAD' ? {} : { body: JSON.stringify({ conversionType: 'form_submit', visitorId: '<a href=x>', id: 1 }) }) }), { params: Promise.resolve({ reportId: 'ANYTHING' }) });
        expect(res.status, m).toBe(410);
        expect(res.headers.get('content-type') || '').not.toMatch(/pdf/);
        expect(await res.text()).not.toMatch(/isVerified|rating|confirms/);
      }
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  }
});

describe('roof-autofill: no Overpass query injection', () => {
  const post = (b: unknown) => roofAutofill(new NextRequest('https://site.test/api/solar/roof-autofill', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(b) }));
  it('injected or out-of-range radius / pitch / coordinates: 400 before any query', async () => {
    for (const bad of [
      { lat: -1.29, lon: 36.82, searchRadiusM: '50,-1.29,36.82);node(1);out;(way(around:1' },
      { lat: -1.29, lon: 36.82, searchRadiusM: 100000 },
      { lat: -1.29, lon: 36.82, searchRadiusM: -5 },
      { lat: -1.29, lon: 36.82, assumedPitchDegrees: '<b>' },
      { lat: 999, lon: 36.82 },
    ]) expect((await post(bad)).status, JSON.stringify(bad)).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
  it('a normal request still queries OpenStreetMap', async () => {
    fetchSpy.mockImplementation(async () => json({ elements: [] }));
    const res = await post({ lat: -1.29, lon: 36.82, searchRadiusM: 60 });
    expect(res.status).toBe(200);
    expect(fetchSpy).toHaveBeenCalled();
    expect(String((fetchSpy.mock.calls[0][1] as RequestInit)?.body ?? fetchSpy.mock.calls[0][0])).toMatch(/around(:|%3A)60/);
  });
});

describe('paid-key routes: per-IP limit, generic 429', () => {
  const body = { latitude: -1.29, longitude: 36.82, lat: -1.29, lng: 36.82, lon: 36.82, location: { latitude: -1.29, longitude: 36.82 } };
  const postReq = (url: string, from: string) => new NextRequest(url, { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': from }, body: JSON.stringify(body) });
  const cases: Array<[string, number, (from: string) => Promise<Response>]> = [
    ['weather/[lat]/[lon]', 30, (from) => weatherGet(new NextRequest('https://site.test/api/weather/-1.29/36.82', { headers: { 'x-forwarded-for': from } }), { params: Promise.resolve({ lat: '-1.29', lon: '36.82' }) })],
    ['borehole/nasa-gldas', 20, (from) => gldasPost(postReq('https://site.test/api/borehole/nasa-gldas', from))],
    ['solar/weather', 30, (from) => solarWeatherPost(postReq('https://site.test/api/solar/weather', from))],
    ['solar/elevation', 20, (from) => solarElevationPost(postReq('https://site.test/api/solar/elevation', from))],
    ['building/climate', 60, (from) => climatePost(postReq('https://site.test/api/building/climate', from))],
    ['building/flood', 60, (from) => floodPost(postReq('https://site.test/api/building/flood', from))],
    ['building/site-analysis', 10, (from) => siteAnalysisPost(postReq('https://site.test/api/building/site-analysis', from))],
  ];
  for (const [name, limit, hit] of cases) {
    it(`${name}: ${limit} per minute per IP, then 429; another IP unaffected`, async () => {
      vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'warn').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
      const from = `192.0.2.${limit + name.length}`;
      for (let i = 0; i < limit; i++) expect((await hit(from)).status, `${name} #${i + 1}`).not.toBe(429);
      const res = await hit(from);
      expect(res.status).toBe(429);
      expect(JSON.stringify(await res.json())).not.toMatch(/\d/);
      expect((await hit(`192.0.2.${200 + limit}`)).status).not.toBe(429);
    }, 60_000);
  }
  it('the GET form passes the caller IP through (nasa-gldas GET counts per caller, not one shared bucket)', async () => {
    vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
    const get = (from: string) => gldasGet(new NextRequest('https://site.test/api/borehole/nasa-gldas?lat=-1.29&lon=36.82', { headers: { 'x-forwarded-for': from } }));
    for (let i = 0; i < 20; i++) await get('192.0.2.150');
    expect((await get('192.0.2.150')).status).toBe(429);
    expect((await get('192.0.2.151')).status).not.toBe(429);
  }, 60_000);
});
