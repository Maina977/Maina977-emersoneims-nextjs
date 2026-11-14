import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { overpassQuery, OVERPASS_USER_AGENT, OVERPASS_ENDPOINTS, _resetOverpassForTests } from '@/lib/data-sources/overpass';

// 2026-11-14: overpass-api.de answers 406 to Node's default User-Agent, so every
// server-side Overpass call failed. Callers then reported "no water", "no
// boreholes" or a default 120 m² roof, and nearby-boreholes invented boreholes.

beforeEach(() => { _resetOverpassForTests(); });
afterEach(() => { vi.unstubAllGlobals(); });

const ua = (init?: RequestInit) => new Headers(init?.headers).get('user-agent');

describe('Overpass client', () => {
  it('sends an identifying User-Agent', async () => {
    const f = vi.fn(async (_u: string, init?: RequestInit) => new Response(JSON.stringify({ elements: [{ id: 1 }] })));
    const r = await overpassQuery('[out:json];node(1);out;', { fetchImpl: f as unknown as typeof fetch });
    expect(r?.elements).toHaveLength(1);
    expect(ua(f.mock.calls[0][1])).toBe(OVERPASS_USER_AGENT);
    expect(OVERPASS_USER_AGENT).toMatch(/emersoneims\.com/);
  });
  it('406 or overload on the main server → next mirror', async () => {
    const seen: string[] = [];
    const f = vi.fn(async (u: string) => {
      seen.push(u);
      if (u === OVERPASS_ENDPOINTS[0]) return new Response('Not Acceptable', { status: 406 });
      if (u === OVERPASS_ENDPOINTS[1]) return new Response('# 502 at capacity', { status: 502 });
      return new Response(JSON.stringify({ elements: [] }));
    });
    const r = await overpassQuery('q', { fetchImpl: f as unknown as typeof fetch });
    expect(seen).toEqual(OVERPASS_ENDPOINTS);
    expect(r).toEqual({ elements: [], endpoint: OVERPASS_ENDPOINTS[2], status: 'NO MATCH FOUND' }); // answered, nothing found
  });
  it('stays inside its overall budget when every server hangs', async () => {
    const hang = vi.fn((_u: string, init?: RequestInit) => new Promise<Response>((_, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
    }));
    const t0 = Date.now();
    expect(await overpassQuery('q', { fetchImpl: hang as unknown as typeof fetch, timeoutMs: 15000, budgetMs: 3000 })).toBeNull();
    expect(Date.now() - t0).toBeLessThan(3500);
    expect(hang.mock.calls.length).toBeLessThan(3); // no new attempt once < 1.5 s remains
  });
  it('no server answers (or non-JSON) → null, never an empty result', async () => {
    const f = vi.fn(async () => new Response('<html>busy</html>', { status: 200 }));
    expect(await overpassQuery('q', { fetchImpl: f as unknown as typeof fetch })).toBeNull();
    const down = vi.fn(async () => { throw new Error('timeout'); });
    expect(await overpassQuery('q', { fetchImpl: down as unknown as typeof fetch })).toBeNull();
  });
});

async function post(route: string, body: unknown) {
  vi.resetModules();
  const { POST } = await import(`@/app/api/${route}/route`);
  const { NextRequest } = await import('next/server');
  const r = await POST(new NextRequest(`http://x/api/${route}`, { method: 'POST', body: JSON.stringify(body) }));
  return { status: r.status as number, j: await r.json() };
}

describe('nearby boreholes: OpenStreetMap points only', () => {
  it('Overpass down → SERVICE UNAVAILABLE (was a ring of invented "Borehole A, B, C…")', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 504 })));
    const { status, j } = await post('borehole/nearby-boreholes', { latitude: -1.29, longitude: 36.82 });
    expect(status).toBe(503);
    expect(j.status).toBe('SERVICE UNAVAILABLE');
  });
  it('nothing mapped → empty list, null statistics, no drilling depth, no invented records', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ elements: [] }))));
    const { status, j } = await post('borehole/nearby-boreholes', { latitude: -1.29, longitude: 36.82, limit: 20 });
    expect(status).toBe(200);
    expect(j.data.boreholes).toEqual([]);
    expect(j.data.statistics.averageDepth).toBeNull();
    expect(j.data.statistics.successRate).toBeNull();
    expect(JSON.stringify(j)).not.toMatch(/Regional Database|recommended drilling depth/);
  });
  it('mapped points: only tagged values, missing tags are null, distances real', async () => {
    const elements = [
      { id: 11, lat: -1.29, lon: 36.83, tags: { man_made: 'water_well', depth: '120 m', name: 'Church well' } },
      { id: 12, lat: -1.30, lon: 36.82, tags: { pump: 'manual' } },
    ];
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ elements }))));
    const { j } = await post('borehole/nearby-boreholes', { latitude: -1.29, longitude: 36.82, limit: 20 });
    expect(j.data.boreholes).toHaveLength(2);
    const [a, b] = j.data.boreholes;
    expect(a.depth).toBe(120);
    expect(a.distance).toBeCloseTo(1.11, 1);
    expect(b.depth).toBeNull();
    expect(b.yield).toBeNull();
    expect(b.year).toBeNull(); // was 2020 when untagged
    expect(j.data.statistics.averageDepth).toBe(120);
    expect(j.data.statistics.pointsWithDepth).toBe(1);
  });
});

describe('solar roof autofill', () => {
  it('no footprint or no answer → roof area null (was a default 120 m² roof)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ elements: [] }))));
    const none = await post('solar/roof-autofill', { lat: -1.29, lon: 36.82 });
    expect(none.j.found).toBe(false);
    expect(none.j.roofAreaM2).toBeNull();
    expect(none.j.usableRoofM2).toBeNull();
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 502 })));
    const down = await post('solar/roof-autofill', { lat: -1.29, lon: 36.82 });
    expect(down.j.roofAreaM2).toBeNull();
  });
  it('a mapped 10 m × 10 m footprint → about 100 m², credited to OSM', async () => {
    const d = 10 / 111320; // 10 m in degrees at the equator
    const geometry = [{ lat: 0, lon: 0 }, { lat: 0, lon: d }, { lat: d, lon: d }, { lat: d, lon: 0 }, { lat: 0, lon: 0 }];
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ elements: [{ type: 'way', id: 5, geometry, tags: { building: 'yes' } }] }))));
    const { j } = await post('solar/roof-autofill', { lat: 0, lon: 0 });
    expect(j.found).toBe(true);
    expect(j.roofAreaM2).toBeGreaterThan(97);
    expect(j.roofAreaM2).toBeLessThan(103);
    expect(j.attribution).toMatch(/OpenStreetMap/);
  });
});
