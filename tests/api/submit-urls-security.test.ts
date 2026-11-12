/**
 * Change Set A (2026-11-12): /api/seo/submit-urls is admin-only, validated and
 * throttled. Every outbound call is stubbed: nothing reaches IndexNow.
 */
import { describe, it, expect, vi, beforeAll, beforeEach } from 'vitest';
import { parseSubmitBody, cooldownRemaining, MAX_BODY_BYTES, MAX_URLS, COOLDOWN_MS } from '@/lib/seo/indexnowRequest';

const SITE = 'https://www.emersoneims.com';
const KEY = 'test-admin-key-not-real';

describe('parseSubmitBody', () => {
  it('accepts the three legitimate request shapes', () => {
    expect(parseSubmitBody('', SITE)).toEqual({ ok: true, mode: 'critical', urls: [] });
    expect(parseSubmitBody('{"comprehensiveSubmit":true}', SITE)).toEqual({ ok: true, mode: 'sitemap', urls: [] });
    expect(parseSubmitBody(JSON.stringify({ urls: [`${SITE}/generators`, `${SITE}/generators`, `${SITE}/contact#x`] }), SITE))
      .toEqual({ ok: true, mode: 'custom', urls: [`${SITE}/generators`, `${SITE}/contact`] });
  });
  it('rejects malformed JSON instead of falling through to a default submission', () => {
    expect(parseSubmitBody('{not json', SITE)).toMatchObject({ ok: false, status: 400 });
    expect(parseSubmitBody('[1,2]', SITE)).toMatchObject({ ok: false, status: 400 });
  });
  it('rejects other hosts, http, non-strings, empty and oversized lists', () => {
    for (const urls of [['https://evil.example/x'], ['http://www.emersoneims.com/x'], ['https://emersoneims.com/x'], [42], [], ['not a url']]) {
      expect(parseSubmitBody(JSON.stringify({ urls }), SITE), JSON.stringify(urls)).toMatchObject({ ok: false, status: 400 });
    }
    const many = Array.from({ length: MAX_URLS + 1 }, (_, i) => `${SITE}/p${i}`);
    expect(parseSubmitBody(JSON.stringify({ urls: many }), SITE)).toMatchObject({ ok: false, status: 400 });
  });
  it('rejects bodies over the size limit with 413', () => {
    expect(parseSubmitBody('x'.repeat(MAX_BODY_BYTES + 1), SITE)).toMatchObject({ ok: false, status: 413 });
  });
  it('cooldown blocks a second call within a minute', () => {
    expect(cooldownRemaining(0, 1_000_000)).toBe(0);
    expect(cooldownRemaining(1_000_000, 1_000_000 + 10_000)).toBe(COOLDOWN_MS - 10_000);
  });
});

describe('route', () => {
  const fetchMock = vi.fn(async (u: string, _init?: RequestInit) => {
    if (String(u).endsWith('/sitemap.xml')) return new Response(`<urlset><url><loc>${SITE}/</loc></url></urlset>`, { status: 200 });
    return new Response('', { status: 200 });
  });
  let POST: (r: import('next/server').NextRequest) => Promise<Response>;
  let GET: (r: import('next/server').NextRequest) => Promise<Response>;
  let NextRequest: typeof import('next/server').NextRequest;

  beforeAll(async () => {
    vi.stubEnv('ADMIN_API_KEY', KEY);
    vi.stubGlobal('fetch', fetchMock);
    ({ NextRequest } = await import('next/server'));
    ({ POST, GET } = (await import('@/app/api/seo/submit-urls/route')) as never);
  });
  beforeEach(() => fetchMock.mockClear());

  const req = (method: 'GET' | 'POST', body?: unknown, auth = true) => new NextRequest(`${SITE}/api/seo/submit-urls`, {
    method,
    headers: auth ? { authorization: `Bearer ${KEY}` } : {},
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  it('anonymous GET and POST get 404 and trigger no outbound call', async () => {
    expect((await POST(req('POST', { comprehensiveSubmit: true }, false))).status).toBe(404);
    expect((await GET(req('GET', undefined, false))).status).toBe(404);
    const wrong = new NextRequest(`${SITE}/api/seo/submit-urls`, { method: 'POST', headers: { authorization: 'Bearer wrong' }, body: '{}' });
    expect((await POST(wrong)).status).toBe(404);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('admin with a bad body gets 400 and nothing is submitted', async () => {
    expect((await POST(req('POST', { urls: ['https://evil.example/x'] }))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('admin submission sends only our URLs, then the cooldown applies', async () => {
    const res = await POST(req('POST', { urls: [`${SITE}/generators/used`] }));
    expect(res.status).toBe(200);
    const indexnowBodies = fetchMock.mock.calls
      .filter(([u]) => /indexnow/.test(String(u)))
      .map(([, init]) => String((init as RequestInit | undefined)?.body ?? ''));
    expect(indexnowBodies.length).toBeGreaterThan(0);
    for (const b of indexnowBodies) expect(b).toContain(`${SITE}/generators/used`);
    expect((await POST(req('POST', { urls: [`${SITE}/contact`] }))).status).toBe(429);
  });

  it('cookie-authorised POST from another site is refused; same-site is accepted past the origin check', async () => {
    const cookieReq = (origin?: string) => new NextRequest(`${SITE}/api/seo/submit-urls`, {
      method: 'POST',
      headers: { cookie: `admin_session=${KEY}`, ...(origin ? { origin } : {}) },
      body: JSON.stringify({ urls: ['https://evil.example/x'] }),
    });
    expect((await POST(cookieReq('https://evil.example'))).status).toBe(404);
    expect((await POST(cookieReq())).status).toBe(404);
    // Same origin passes the origin check and then fails validation (400): proves the order of checks.
    expect((await POST(cookieReq(SITE))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('a declared oversized body is refused before it is read', async () => {
    const big = new NextRequest(`${SITE}/api/seo/submit-urls`, {
      method: 'POST',
      headers: { authorization: `Bearer ${KEY}`, 'content-length': String(10 * 1024 * 1024) },
      body: '{}',
    });
    expect((await POST(big)).status).toBe(413);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('admin GET still works (status page)', async () => {
    expect((await GET(req('GET'))).status).toBe(200);
  });
});
