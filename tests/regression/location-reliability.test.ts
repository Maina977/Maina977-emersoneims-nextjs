import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { geocodeSearch, geocodeReverse, NOMINATIM_USER_AGENT, _resetNominatimForTests } from '@/lib/data-sources/nominatim';
import { overpassQuery, lookupStatus, overpassBreakerOpen, _resetOverpassForTests } from '@/lib/data-sources/overpass';
import { geocodeSearchUrl, geocodeReverseUrl } from '@/lib/data-sources/geocodeClient';

// Release 4 (location reliability, 2026-11-14): Nominatim usage policy applied
// centrally; SERVICE UNAVAILABLE / NO MATCH FOUND / INSUFFICIENT EVIDENCE kept
// apart; no repeated waits on a failing Overpass; no assumed site values.

beforeEach(() => { _resetNominatimForTests(); _resetOverpassForTests(); vi.stubEnv('VERCEL_ENV', ''); });
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });

const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { 'content-type': 'application/json' } });

describe('Nominatim client', () => {
  it('identifies the application by website (no personal mailbox) and sends a Referer', async () => {
    const f = vi.fn(async () => json([{ lat: '1.0', lon: '35.0', display_name: 'Kitale' }]));
    const r = await geocodeSearch('Kitale', { fetchImpl: f as unknown as typeof fetch });
    expect(r.status).toBe('OK');
    const init = (f.mock.calls[0] as unknown as [string, RequestInit])[1];
    const h = new Headers(init.headers);
    expect(h.get('user-agent')).toBe(NOMINATIM_USER_AGENT);
    expect(NOMINATIM_USER_AGENT).toMatch(/emersoneims\.com/);
    expect(NOMINATIM_USER_AGENT).not.toMatch(/@/);
    expect(h.get('referer')).toMatch(/emersoneims\.com/);
  });
  it('caches: the same lookup twice makes one upstream request', async () => {
    const f = vi.fn(async () => json([{ lat: '1', lon: '35', display_name: 'X' }]));
    await geocodeSearch('Eldoret', { fetchImpl: f as unknown as typeof fetch });
    const second = await geocodeSearch('Eldoret', { fetchImpl: f as unknown as typeof fetch });
    expect(f).toHaveBeenCalledTimes(1);
    expect(second.cached).toBe(true);
  });
  it('spaces upstream requests at least 1.1 s apart (1 request/second policy)', async () => {
    const times: number[] = [];
    const f = vi.fn(async () => { times.push(Date.now()); return json([]); });
    await Promise.all([geocodeSearch('Nakuru', { fetchImpl: f as unknown as typeof fetch }), geocodeSearch('Kisumu', { fetchImpl: f as unknown as typeof fetch })]);
    expect(times).toHaveLength(2);
    expect(times[1] - times[0]).toBeGreaterThanOrEqual(1050);
  });
  it('keeps the outcomes apart: [] → NO MATCH FOUND; HTTP error or timeout → SERVICE UNAVAILABLE', async () => {
    expect((await geocodeSearch('Nowhere-xyz', { fetchImpl: (async () => json([])) as unknown as typeof fetch })).status).toBe('NO MATCH FOUND');
    _resetNominatimForTests();
    expect((await geocodeSearch('Garissa', { fetchImpl: (async () => json({}, 503)) as unknown as typeof fetch })).status).toBe('SERVICE UNAVAILABLE');
    _resetNominatimForTests();
    expect((await geocodeReverse(0, 0, { fetchImpl: (async () => json({ error: 'Unable to geocode' })) as unknown as typeof fetch })).status).toBe('NO MATCH FOUND');
    _resetNominatimForTests();
    expect((await geocodeReverse(1, 35, { fetchImpl: (async () => { throw new Error('timeout'); }) as unknown as typeof fetch })).status).toBe('SERVICE UNAVAILABLE');
  });
  it('browser URLs point at the site endpoint, never at nominatim.openstreetmap.org', () => {
    expect(geocodeSearchUrl('Kitale')).toMatch(/\/api\/geocode\?/);
    expect(geocodeSearchUrl('Kitale')).not.toMatch(/nominatim\.openstreetmap\.org/);
    expect(geocodeReverseUrl(1, 35)).toMatch(/\/api\/geocode\?lat=1&lon=35/);
  });
});

describe('/api/geocode', () => {
  async function get(qs: string, ip = '198.51.100.7') {
    vi.resetModules();
    const { GET } = await import('@/app/api/geocode/route');
    const { NextRequest } = await import('next/server');
    const r = await GET(new NextRequest(`http://x/api/geocode?${qs}`, { headers: { 'x-forwarded-for': ip } }));
    return { status: r.status, h: r.headers, j: await r.json() };
  }
  it('forward search keeps its summary shape; format=nominatim gives the raw array', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json([{ lat: '1.0157', lon: '35.0062', display_name: 'Kitale, Trans-Nzoia', class: 'place', type: 'town' }])));
    const a = await get('q=Kitale');
    expect(a.status).toBe(200);
    expect(a.h.get('x-geocode-status')).toBe('OK');
    expect(a.j[0]).toMatchObject({ displayName: 'Kitale, Trans-Nzoia', lat: 1.0157 });
    const b = await get('q=Kitale&format=nominatim', '198.51.100.8');
    expect(b.j[0].display_name).toBe('Kitale, Trans-Nzoia');
  });
  it('upstream down → 503 SERVICE UNAVAILABLE (not "no place found")', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json({}, 502)));
    const r = await get('q=Machakos', '198.51.100.9');
    expect(r.status).toBe(503);
    expect(r.j.status).toBe('SERVICE UNAVAILABLE');
  });
  it('per-visitor limit blocks autocomplete-style bursts (15 a minute)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => json([])));
    vi.resetModules();
    const { GET } = await import('@/app/api/geocode/route');
    const { NextRequest } = await import('next/server');
    const codes: number[] = [];
    for (let i = 0; i < 17; i++) {
      const r = await GET(new NextRequest(`http://x/api/geocode?q=Na${'i'.repeat(i)}robi`, { headers: { 'x-forwarded-for': '203.0.113.50' } }));
      codes.push(r.status);
    }
    expect(codes.filter((c) => c === 429).length).toBeGreaterThanOrEqual(2);
  }, 30000);
});

describe('Overpass: no repeated waits; outcomes kept apart', () => {
  it('after every server fails, the next call answers SERVICE UNAVAILABLE at once (breaker)', async () => {
    const down = vi.fn(async () => new Response('', { status: 504 }));
    expect(await overpassQuery('q1', { fetchImpl: down as unknown as typeof fetch })).toBeNull();
    expect(overpassBreakerOpen()).toBe(true);
    const calls = down.mock.calls.length;
    const t0 = Date.now();
    expect(lookupStatus(await overpassQuery('q2', { fetchImpl: down as unknown as typeof fetch }))).toBe('SERVICE UNAVAILABLE');
    expect(Date.now() - t0).toBeLessThan(50);
    expect(down.mock.calls.length).toBe(calls); // no new upstream request
  });
  it('answered with nothing → NO MATCH FOUND; repeated query served from cache', async () => {
    const f = vi.fn(async () => json({ elements: [] }));
    const a = await overpassQuery('q3', { fetchImpl: f as unknown as typeof fetch });
    expect(lookupStatus(a)).toBe('NO MATCH FOUND');
    const b = await overpassQuery('q3', { fetchImpl: f as unknown as typeof fetch });
    expect(b?.cached).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
  });
});

describe('site analysis: no assumed country, seismic zone or zoning rules', () => {
  it('geocoding down → country null (was "KE"); seismic and zoning null with the authority to ask', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 503 })));
    vi.resetModules();
    const { POST } = await import('@/app/api/building/site-analysis/route');
    const { NextRequest } = await import('next/server');
    const r = await POST(new NextRequest('http://x/api/building/site-analysis', { method: 'POST', body: JSON.stringify({ latitude: -1.29, longitude: 36.82 }) }));
    const d = (await r.json()).data;
    expect(d.location.country).toBeNull();
    expect(d.location.lookupStatus).toBe('SERVICE UNAVAILABLE');
    expect(d.insufficientEvidence.join(' ')).toMatch(/address: SERVICE UNAVAILABLE/);
    expect(d.seismic).toMatchObject({ zone: null, pga: null });
    expect(d.seismic.note).toMatch(/seismic code/);
    expect(d.legal).toMatchObject({ zoning: null, maxHeight: null, maxCoverage: null, setbacks: null });
    expect(d.legal.note).toMatch(/county physical planning/);
    expect(JSON.stringify(d)).not.toMatch(/R1 - Low Density|Seismic Zone 2/);
  });
});
