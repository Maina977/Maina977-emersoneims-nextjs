/**
 * AquaScan: one unavailable data source must not stall the analysis
 * (measured 2026-11-13, Nairobi, 241 s to "Analysis Complete").
 *
 * ISRIC SoilGrids was down: the relay answered 502 after 50-72 s, direct calls
 * aborted at 30 s. The browser layer retried each request twice through the
 * relay (which had already retried it) and three more times directly, and
 * every SoilGrids request paid that again.
 *
 * Also: the JRC surface-water endpoint refuses browser calls (CORS), so it
 * failed on every analysis, yet the report printed "No significant surface
 * water ... flood risk low", credited JRC and counted it as a data source.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

const SOIL_A = 'https://rest.isric.org/soilgrids/v2.0/properties/query?lon=36.8&lat=-1.29&property=clay';
const SOIL_B = 'https://rest.isric.org/soilgrids/v2.0/classification/query?lon=36.8&lat=-1.29&number_classes=3';
const METEO = 'https://archive-api.open-meteo.com/v1/archive?latitude=-1.29&longitude=36.8';

describe('browser fetch layer (reliableFetch)', () => {
  let calls: string[];
  let realFetch: typeof window.fetch;

  beforeEach(() => {
    vi.resetModules();
    calls = [];
    realFetch = window.fetch;
  });
  afterEach(() => { window.fetch = realFetch; });

  async function install(answer: (url: string) => Response | Promise<Response>) {
    window.fetch = (async (input: RequestInfo | URL) => {
      const u = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      calls.push(u);
      return answer(u);
    }) as typeof window.fetch;
    const mod = await import('@/external/borehole-ai-engine/src/reliableFetch');
    mod.installReliableFetch();
  }

  it('takes the relay\'s outage answer as final: no relay retry, no direct retries', async () => {
    await install(() => new Response('{"error":"source did not answer"}', { status: 502 }));
    const r = await window.fetch(SOIL_A);
    expect(r.status).toBe(502);
    expect(calls).toHaveLength(1);
    expect(calls[0]).toContain('/api/borehole/data-relay?u=');
  });

  it('skips a source that just failed instead of waiting again for each request', async () => {
    await install(() => new Response('{}', { status: 502 }));
    await window.fetch(SOIL_A);
    const r = await window.fetch(SOIL_B);
    expect(r.status).toBe(503);
    expect(await r.text()).toMatch(/unavailable/);
    expect(calls).toHaveLength(1); // the second request never left the browser
  });

  it('does not skip other sources when one is down', async () => {
    await install((u) => (u.includes('isric') ? new Response('{}', { status: 502 }) : new Response('{"ok":1}', { status: 200 })));
    await window.fetch(SOIL_A);
    const r = await window.fetch(METEO);
    expect(r.status).toBe(200);
    expect(await r.json()).toEqual({ ok: 1 });
  });

  it('goes direct, once, only when the relay itself is unreachable', async () => {
    await install((u) => {
      if (u.includes('/api/borehole/data-relay')) throw new TypeError('relay unreachable');
      return new Response('{"direct":1}', { status: 200 });
    });
    const r = await window.fetch(METEO);
    expect(await r.json()).toEqual({ direct: 1 });
    expect(calls).toHaveLength(2);
  });

  it('a bad request (4xx) is not treated as an outage', async () => {
    await install(() => new Response('{"error":"bad"}', { status: 422 }));
    await window.fetch(SOIL_A);
    await window.fetch(SOIL_B);
    expect(calls).toHaveLength(2);
  });

  it('passes successful data through unchanged and reuses it in the session', async () => {
    await install(() => new Response('{"v":42}', { status: 200 }));
    expect(await (await window.fetch(METEO)).json()).toEqual({ v: 42 });
    expect(await (await window.fetch(METEO)).json()).toEqual({ v: 42 });
    expect(calls).toHaveLength(1);
  });
});

describe('server data relay', () => {
  let realFetch: typeof globalThis.fetch;
  beforeEach(() => { vi.resetModules(); realFetch = globalThis.fetch; vi.useFakeTimers({ toFake: ['setTimeout', 'Date'] }); });
  afterEach(() => { globalThis.fetch = realFetch; vi.useRealTimers(); });

  const req = (u: string) => new NextRequest(`http://localhost/api/borehole/data-relay?u=${encodeURIComponent(u)}`, { headers: { 'x-forwarded-for': '10.0.0.1' } });

  async function run<T>(p: Promise<T>): Promise<T> {
    let done = false;
    p.finally(() => { done = true; });
    for (let i = 0; i < 200 && !done; i++) await vi.advanceTimersByTimeAsync(1000);
    return p;
  }

  it('after retries fail, answers the same source at once for 2 minutes, then tries again', async () => {
    let upstream = 0;
    globalThis.fetch = (async () => { upstream++; return new Response('down', { status: 503 }); }) as typeof fetch;
    const { GET } = await import('@/app/api/borehole/data-relay/route');

    const first = await run(GET(req(SOIL_A)));
    expect(first.status).toBe(503);
    const afterFirst = upstream;
    expect(afterFirst).toBeGreaterThan(1); // the relay did retry

    const second = await run(GET(req(SOIL_B)));
    expect(second.status).toBe(503);
    expect(await second.text()).toMatch(/unavailable/);
    expect(upstream).toBe(afterFirst); // no new upstream call

    await vi.advanceTimersByTimeAsync(2 * 60_000 + 1000);
    await run(GET(req(SOIL_B)));
    expect(upstream).toBeGreaterThan(afterFirst); // tried again after the pause
  });

  it('an outage of one source does not block another', async () => {
    globalThis.fetch = (async (u: RequestInfo | URL) => (String(u).includes('isric') ? new Response('down', { status: 503 }) : new Response('{"ok":1}', { status: 200 }))) as typeof fetch;
    const { GET } = await import('@/app/api/borehole/data-relay/route');
    await run(GET(req(SOIL_A)));
    const r = await run(GET(req(METEO)));
    expect(r.status).toBe(200);
  });
});

describe('server data relay: dropped connections', () => {
  it('cuts a hung SoilGrids attempt at 12 s and retries it, instead of waiting out the whole budget', async () => {
    vi.resetModules();
    const realFetch = globalThis.fetch;
    let attempts = 0;
    globalThis.fetch = ((_u: RequestInfo | URL, init?: RequestInit) => {
      attempts++;
      if (attempts === 1) {
        // The dropped connection: never answers until aborted.
        return new Promise<Response>((_res, rej) => init?.signal?.addEventListener('abort', () => rej(new Error('aborted'))));
      }
      return Promise.resolve(new Response('{"properties":{}}', { status: 200 }));
    }) as typeof fetch;
    try {
      const { GET } = await import('@/app/api/borehole/data-relay/route');
      const t0 = Date.now();
      const r = await GET(new NextRequest(`http://localhost/api/borehole/data-relay?u=${encodeURIComponent(SOIL_A)}`, { headers: { 'x-forwarded-for': '10.0.0.2' } }));
      const ms = Date.now() - t0;
      expect(r.status).toBe(200);
      expect(attempts).toBe(2);
      expect(ms).toBeLessThan(20_000); // 12 s cut + 1 s back-off, not 55 s
    } finally {
      globalThis.fetch = realFetch;
    }
  }, 30_000);

  it('answers within the 55 s budget when every attempt hangs (no wasted wait after the last one)', async () => {
    vi.resetModules();
    const realFetch = globalThis.fetch;
    globalThis.fetch = ((_u: RequestInfo | URL, init?: RequestInit) =>
      new Promise<Response>((_res, rej) => init?.signal?.addEventListener('abort', () => rej(new Error('aborted'))))) as typeof fetch;
    try {
      const { GET } = await import('@/app/api/borehole/data-relay/route');
      const t0 = Date.now();
      const r = await GET(new NextRequest(`http://localhost/api/borehole/data-relay?u=${encodeURIComponent(SOIL_B)}`, { headers: { 'x-forwarded-for': '10.0.0.3' } }));
      expect(r.status).toBe(502);
      expect(Date.now() - t0).toBeLessThan(56_000); // was ~63 s: past the browser's 65 s limit under load
    } finally {
      globalThis.fetch = realFetch;
    }
  }, 80_000);
});

describe('JRC surface water', () => {
  it('reports no result (not "no surface water") when JRC does not answer', async () => {
    const realFetch = globalThis.fetch;
    globalThis.fetch = (async () => { throw new TypeError('Failed to fetch (CORS)'); }) as typeof fetch;
    try {
      const { fetchSatelliteWaterAnalysis } = await import('@/external/borehole-ai-engine/src/satelliteWaterEngine');
      const out = await fetchSatelliteWaterAnalysis(-1.2921, 36.8219, 900);
      expect(out.waterBodies).toBeNull();
    } finally {
      globalThis.fetch = realFetch;
    }
  });
});
