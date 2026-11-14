import { describe, it, expect, vi, afterEach } from 'vitest';
import { licensedOpenMeteoUrl, openMeteoMode, isOpenMeteoHost } from '@/lib/data-sources/openMeteo';

// Compliance 2026-11-14: Open-Meteo's free API is non-commercial only.
const ARCHIVE = 'https://archive-api.open-meteo.com/v1/archive?latitude=-1.29&longitude=36.82&daily=precipitation_sum';

describe('Open-Meteo licence policy', () => {
  it('no licence configured → disabled; Open-Meteo URLs get no route', () => {
    expect(openMeteoMode({})).toBe('disabled');
    expect(licensedOpenMeteoUrl(ARCHIVE, {})).toBeNull();
    expect(licensedOpenMeteoUrl('https://flood-api.open-meteo.com/v1/flood?x=1', {})).toBeNull();
  });
  it('other hosts are untouched', () => {
    expect(licensedOpenMeteoUrl('https://power.larc.nasa.gov/api/x?y=1', {})).toBe('https://power.larc.nasa.gov/api/x?y=1');
  });
  it('commercial key → customer host with the key (kept server-side)', () => {
    const u = new URL(licensedOpenMeteoUrl(ARCHIVE, { OPEN_METEO_API_KEY: 'k123' })!);
    expect(u.hostname).toBe('customer-archive-api.open-meteo.com');
    expect(u.searchParams.get('apikey')).toBe('k123');
    expect(u.searchParams.get('daily')).toBe('precipitation_sum');
  });
  it('self-hosted instance → same path and query on the company host, service kept', () => {
    expect(licensedOpenMeteoUrl(ARCHIVE, { OPEN_METEO_SELF_HOSTED_URL: 'https://weather.example.internal/om/' }))
      .toBe('https://weather.example.internal/om/archive-api/v1/archive?latitude=-1.29&longitude=36.82&daily=precipitation_sum');
  });
  it('host detection covers every Open-Meteo service and nothing else', () => {
    for (const h of ['api.open-meteo.com', 'archive-api.open-meteo.com', 'flood-api.open-meteo.com', 'customer-api.open-meteo.com']) expect(isOpenMeteoHost(h)).toBe(true);
    for (const h of ['open-meteo.com.evil.example', 'power.larc.nasa.gov', 'example.com']) expect(isOpenMeteoHost(h)).toBe(false);
  });
});

describe('data relay enforces the licence', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
  const call = async (u: string, headers: Record<string, string> = { 'sec-fetch-site': 'same-origin' }) => {
    const { GET } = await import('@/app/api/borehole/data-relay/route');
    const { NextRequest } = await import('next/server');
    return GET(new NextRequest(`http://localhost/api/borehole/data-relay?u=${encodeURIComponent(u)}`, { headers }));
  };
  it('without a licence: 451 and the free endpoint is never called', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    vi.stubEnv('OPEN_METEO_SELF_HOSTED_URL', '');
    const spy = vi.fn(async () => new Response('{}'));
    vi.stubGlobal('fetch', spy);
    const r = await call(ARCHIVE);
    expect(r.status).toBe(451);
    expect((await r.json()).licence).toBe('open-meteo-not-licensed');
    expect(spy).not.toHaveBeenCalled();
  });
  it('flood API is now relayed (and therefore gated) instead of called from the browser', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    vi.stubGlobal('fetch', vi.fn());
    expect((await call('https://flood-api.open-meteo.com/v1/flood?latitude=0&longitude=37&daily=river_discharge')).status).toBe(451);
  });
  it('with a commercial key: the customer host is called with the key', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', 'k123');
    const spy = vi.fn(async () => new Response('{"daily":{}}', { status: 200, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', spy);
    const r = await call(ARCHIVE + '&uniq=1');
    expect(r.status).toBe(200);
    const called = String((spy.mock.calls[0] as unknown[])[0]);
    expect(called).toMatch(/^https:\/\/customer-archive-api\.open-meteo\.com\//);
    expect(called).toMatch(/apikey=k123/);
  });
  it('with a key, cross-site requests are refused (the licence serves this site only)', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', 'k123');
    vi.stubGlobal('fetch', vi.fn());
    expect((await call(ARCHIVE + '&uniq=2', { 'sec-fetch-site': 'cross-site' })).status).toBe(403);
  });
  it('NASA POWER is unaffected by the gate', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    const spy = vi.fn(async () => new Response('{"ok":1}', { status: 200, headers: { 'content-type': 'application/json' } }));
    vi.stubGlobal('fetch', spy);
    expect((await call('https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M&uniq=3')).status).toBe(200);
  });
});

describe('weather route enforces the licence', () => {
  afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); vi.resetModules(); });
  it('without a licence: Open-Meteo is never called; MET Norway is used, and its failure is reported, not filled', async () => {
    vi.stubEnv('OPEN_METEO_API_KEY', '');
    const spy = vi.fn(async () => new Response('', { status: 503 }));
    vi.stubGlobal('fetch', spy);
    const { GET } = await import('@/app/api/weather/[lat]/[lon]/route');
    const { NextRequest } = await import('next/server');
    const r = await GET(new NextRequest('http://localhost/api/weather/-1.29/36.82'), { params: Promise.resolve({ lat: '-1.29', lon: '36.82' }) });
    expect(r.status).toBe(502);
    expect((await r.json()).error).toMatch(/Weather unavailable/);
    expect(spy.mock.calls.every((c) => !String((c as unknown[])[0]).includes('open-meteo'))).toBe(true);
    expect(String((spy.mock.calls[0] as unknown[])[0])).toMatch(/api\.met\.no/);
  });
});
