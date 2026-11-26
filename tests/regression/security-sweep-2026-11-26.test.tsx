/**
 * Security sweep 2026-11-26 (production 67107788): fixes for the High
 * findings, through the real route handlers and pages. fetch is stubbed (no
 * network), the database is a fake pool, M-Pesa is mocked. TEST data only.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { NextRequest } from 'next/server';

const fx = vi.hoisted(() => ({
  payment: null as Record<string, unknown> | null,
  confirmed: false,
  updates: [] as unknown[][],
  subs: [] as unknown[][],
  registered: [] as Record<string, unknown>[],
}));
vi.mock('@/lib/db', () => ({
  getPostgresPool: async () => ({ query: async () => ({ rows: fx.payment ? [fx.payment] : [], rowCount: fx.payment ? 1 : 0 }) }),
}));
vi.mock('@/lib/generator-oracle/subscriptionService', () => ({
  updatePaymentStatus: async (...a: unknown[]) => { fx.updates.push(a); return true; },
  createSubscription: async (...a: unknown[]) => { fx.subs.push(a); return null; },
}));
vi.mock('@/lib/generator-oracle/mpesaService', async (orig) => ({
  ...(await orig<typeof import('@/lib/generator-oracle/mpesaService')>()),
  querySTKPushStatus: async () => ({ success: fx.confirmed, resultCode: fx.confirmed ? 0 : 1032 }),
}));
vi.mock('@/lib/generator-oracle/authService', async (orig) => ({
  ...(await orig<typeof import('@/lib/generator-oracle/authService')>()),
  registerUser: async (data: Record<string, unknown>) => { fx.registered.push(data); return { success: true, user: { id: 1, email: data.email, role: 'technician' } }; },
}));

import { GET as partsSearch } from '@/app/api/parts/search/route';
import * as mlImage from '@/app/api/ml/analyze-image/route';
import * as mlVideo from '@/app/api/ml/analyze-video/route';
import * as mlBoq from '@/app/api/ml/parse-boq/route';
import * as satellite from '@/app/api/borehole/satellite/route';
import { POST as engproPost } from '@/app/api/engpro/[...path]/route';
import { POST as oracleRegister } from '@/app/api/generator-oracle/auth/register/route';
import { POST as oracleCallback } from '@/app/api/generator-oracle/payments/mpesa/callback/route';
import MarketplacePartsPage from '@/app/marketplace/parts/page';
import SparePartsPage from '@/app/generators/spare-parts/page';

const SEVEN = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT'];
type H = (...a: unknown[]) => Promise<Response> | Response;
const call = (h: unknown, ...a: unknown[]) => Promise.resolve((h as H)(...a));

let fetchSpy: ReturnType<typeof vi.fn>;
beforeEach(() => {
  fx.payment = null; fx.confirmed = false; fx.updates.length = 0; fx.subs.length = 0; fx.registered.length = 0;
  fetchSpy = vi.fn(async () => { throw new Error('no network in tests'); });
  vi.stubGlobal('fetch', fetchSpy);
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.restoreAllMocks(); });

const INTERNAL = ['costPrice', 'margin', 'reorderLevel', 'location', 'rating', 'reviews'];

describe('parts search: no cost, margin, reorder or location data; no invented ratings', () => {
  it('?limit=100000 returns no internal fields and is clamped', async () => {
    const res = await partsSearch(new Request('https://site.test/api/parts/search?limit=100000'));
    const d = await res.json();
    expect(res.status).toBe(200);
    expect(d.limit).toBeLessThanOrEqual(20000);
    expect(d.parts.length).toBeGreaterThan(1000);
    const text = JSON.stringify(d.parts);
    for (const k of INTERNAL) expect(text.includes(`"${k}":`), k).toBe(false);
    expect(d.parts[0]).toHaveProperty('sellingPrice');
    expect(d.parts[0]).toHaveProperty('quantity');
  }, 30_000);
  it('bad page/limit values fall back to sane defaults', async () => {
    const d = await (await partsSearch(new Request('https://site.test/api/parts/search?limit=-5&page=0'))).json();
    expect(d.limit).toBe(20);
    expect(d.page).toBe(1);
    expect(d.parts).toHaveLength(20);
  });
});

describe('parts pages show no margin and no invented rating', () => {
  const viaRealApi = (rewrite?: (u: URL) => void) => vi.fn(async (url: unknown) => {
    const u = new URL(String(url), 'https://site.test');
    rewrite?.(u);
    return partsSearch(new Request(u.toString()));
  });
  it('marketplace parts page', async () => {
    vi.stubGlobal('fetch', viaRealApi());
    render(<MarketplacePartsPage />);
    await waitFor(() => expect(screen.getAllByText(/^KES /).length).toBeGreaterThan(0));
    expect(screen.queryByText(/Margin:/)).toBeNull();
    expect(screen.queryByText('★')).toBeNull();
    expect(screen.queryByRole('option', { name: 'Top Rated' })).toBeNull();
  });
  it('generators spare-parts page', async () => {
    vi.stubGlobal('fetch', viaRealApi((u) => u.searchParams.set('limit', '12')));
    render(<SparePartsPage />);
    await waitFor(() => expect(screen.getAllByText(/^KES /).length).toBeGreaterThan(0));
    expect(screen.queryByText(/\/5$/)).toBeNull();
    expect(screen.queryByText('Minimum Rating')).toBeNull();
    expect(screen.queryByRole('option', { name: 'Sort: Best Rated' })).toBeNull();
  });
});

describe('OpenAI routes retired (no unauthenticated spend)', () => {
  for (const [name, mod] of [['analyze-image', mlImage], ['analyze-video', mlVideo], ['parse-boq', mlBoq]] as const) {
    it(`${name}: exactly 7 methods, all 410, nothing fetched, key state not revealed`, async () => {
      vi.stubEnv('OPENAI_API_KEY', 'sk-TEST-ONLY');
      expect(Object.keys(mod).filter((k) => /^[A-Z]+$/.test(k)).sort()).toEqual(SEVEN);
      for (const m of SEVEN) {
        const res = await call((mod as Record<string, unknown>)[m], new NextRequest(`https://site.test/api/ml/${name}`, { method: m, ...(m === 'GET' || m === 'HEAD' ? {} : { body: JSON.stringify({ image: 'https://x.example/a.jpg', document: 'x', frameUrls: ['https://x.example/a.jpg'] }) }) }));
        expect(res.status, m).toBe(410);
        expect(await res.text()).not.toMatch(/configured/i);
      }
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  }
});

describe('borehole/satellite retired (no fabricated "satellite" indices)', () => {
  it('exactly 7 methods, all 410, nothing fetched, no NDVI in the body', async () => {
    expect(Object.keys(satellite).filter((k) => /^[A-Z]+$/.test(k)).sort()).toEqual(SEVEN);
    for (const m of SEVEN) {
      const res = await call((satellite as Record<string, unknown>)[m], new NextRequest('https://site.test/api/borehole/satellite?lat=-1.29&lon=36.82', { method: m, ...(m === 'GET' || m === 'HEAD' ? {} : { body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }) }));
      expect(res.status, m).toBe(410);
      expect(await res.text()).not.toMatch(/ndvi|qualityScore|favorability/i);
    }
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('engpro client-portal endpoints are admin only; calculators stay public', () => {
  const post = (p: string, b: unknown, headers: Record<string, string> = {}) =>
    engproPost(new NextRequest(`https://site.test/api/engpro/${p}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(b) }), { params: Promise.resolve({ path: [p] }) });
  it('portal-jwt / portal-revoke / portal-verify without the admin key: 404, nothing stored', async () => {
    vi.stubEnv('ADMIN_API_KEY', 'TEST-ADMIN-KEY-0123456789');
    for (const p of ['portal-jwt', 'portal-revoke', 'portal-verify', 'PORTAL-JWT']) {
      const res = await post(p, { projectId: 'x'.repeat(1000), clientName: 'TEST', jti: 'any' });
      expect(res.status, p).toBe(404);
    }
    const wrong = await post('portal-jwt', { projectId: 'x' }, { authorization: 'Bearer wrong-key' });
    expect(wrong.status).toBe(404);
  });
  it('a calculator (earth-electrode) still answers without sign-in', async () => {
    const res = await post('earth-electrode', { soilResistivity: 100, rodLength: 2.4, rodDiameter: 0.016 });
    expect(res.status).not.toBe(404);
  });
});

describe('Generator Oracle registration never sets its own role, organisation or licence', () => {
  it('role/organizationId/licenseKey from the body are not passed on', async () => {
    const res = await oracleRegister(new NextRequest('https://site.test/api/generator-oracle/auth/register', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: 'x@test.example', password: 'Passw0rd1', name: 'TEST', role: 'admin', organizationId: 1, licenseKey: 'ABCD-EFGH-IJKL-MNOP' }),
    }));
    expect(res.status).toBe(200);
    expect(fx.registered).toHaveLength(1);
    const passed = fx.registered[0];
    expect(passed).not.toHaveProperty('role');
    expect(passed).not.toHaveProperty('organizationId');
    expect(passed).not.toHaveProperty('licenseKey');
    expect(passed.email).toBe('x@test.example');
  });
});

describe('Generator Oracle M-Pesa callback: a forged success activates nothing', () => {
  const PHONE = '254700999888';
  const cb = (amount: number, resultCode = 0) => oracleCallback(new NextRequest('https://site.test/api/generator-oracle/payments/mpesa/callback', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ Body: { stkCallback: { MerchantRequestID: 'm', CheckoutRequestID: 'ws_CO_TEST', ResultCode: resultCode, ResultDesc: 'ok', CallbackMetadata: { Item: [{ Name: 'Amount', Value: amount }, { Name: 'MpesaReceiptNumber', Value: 'FAKE123' }, { Name: 'PhoneNumber', Value: PHONE }] } } } }),
  }));
  const pending = () => ({ transaction_id: 'T1', user_id: 7, amount: '5000.00', status: 'pending', metadata: { planId: 'pro-yearly' } });

  it('Safaricom does not confirm -> no completion, no subscription', async () => {
    fx.payment = pending(); fx.confirmed = false;
    expect((await cb(5000)).status).toBe(200);
    expect(fx.updates).toHaveLength(0);
    expect(fx.subs).toHaveLength(0);
  });
  it('amount differs from the stored amount -> nothing, even if Safaricom confirms', async () => {
    fx.payment = pending(); fx.confirmed = true;
    await cb(1);
    expect(fx.updates).toHaveLength(0);
    expect(fx.subs).toHaveLength(0);
  });
  it('payment no longer pending (replay) -> nothing', async () => {
    fx.payment = { ...pending(), status: 'completed' }; fx.confirmed = true;
    await cb(5000);
    await cb(5000, 1032);
    expect(fx.updates).toHaveLength(0);
    expect(fx.subs).toHaveLength(0);
  });
  it('a genuine, confirmed, matching payment still activates the plan; the payer phone is not logged', async () => {
    const lines: string[] = [];
    for (const m of ['log', 'warn', 'error', 'info'] as const) vi.spyOn(console, m).mockImplementation((...a: unknown[]) => { lines.push(a.map(String).join(' ')); });
    fx.payment = pending(); fx.confirmed = true;
    await cb(5000);
    expect(fx.updates).toEqual([['T1', 'completed', 'FAKE123']]);
    expect(fx.subs).toHaveLength(1);
    expect(fx.subs[0][0]).toBe(7);
    expect(fx.subs[0][1]).toBe('pro-yearly');
    expect(lines.join('\n')).not.toContain(PHONE);
  });
});
