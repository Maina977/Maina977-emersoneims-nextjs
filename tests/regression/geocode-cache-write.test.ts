import { describe, it, expect, vi, beforeEach } from 'vitest';

// Release 4.1 (2026-11-15): the shared cache write is awaited. Live on Release 4
// every repeat lookup missed: the fire-and-forget INSERT did not complete after
// the response on Vercel, so other instances never found the shared copy.

const rows = new Map<string, unknown>();
const visitors = new Map<string, number>();
let insertsCompleted = 0;
const fakePool = {
  query: async (text: string, params: unknown[] = []) => {
    if (/CREATE TABLE/.test(text)) return { rows: [] };
    if (/INSERT INTO geocode_visitor/.test(text)) { const k = params[0] as string; const n = (visitors.get(k) ?? 0) + 1; visitors.set(k, n); return { rows: [{ n }] }; }
    if (/DELETE FROM geocode_visitor/.test(text)) return { rows: [] };
    if (/UPDATE nominatim_slot/.test(text)) return { rows: [{ '?column?': 1 }] };
    if (/SELECT body FROM geocode_cache/.test(text)) { const b = rows.get(params[0] as string); return { rows: b ? [{ body: b }] : [] }; }
    if (/INSERT INTO geocode_cache/.test(text)) {
      await new Promise((r) => setTimeout(r, 150)); // a slow database write
      rows.set(params[0] as string, JSON.parse(params[1] as string));
      insertsCompleted++;
      return { rows: [] };
    }
    return { rows: [] };
  },
  end: async () => {},
};
vi.mock('@/lib/db', () => ({ getPostgresPool: async () => fakePool }));

beforeEach(() => { vi.stubEnv('VERCEL_ENV', 'production'); rows.clear(); visitors.clear(); insertsCompleted = 0; });

describe('per-visitor limit across instances (Release 4.1)', () => {
  it('holds when every request lands on a fresh instance (in-memory limit empty each time)', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('[]')));
    const codes: number[] = [];
    for (let i = 0; i < 17; i++) {
      vi.resetModules(); // new instance: fresh in-memory limiter and caches
      const { GET } = await import('@/app/api/geocode/route');
      const { NextRequest } = await import('next/server');
      const r = await GET(new NextRequest('http://x/api/geocode?q=Malindi', { headers: { 'x-forwarded-for': '203.0.113.77' } }));
      codes.push(r.status);
    }
    expect(codes.slice(0, 15).every((c) => c === 200)).toBe(true);
    expect(codes.slice(15)).toEqual([429, 429]);
    // Only a hash is stored, never the address.
    expect([...visitors.keys()].some((k) => k.includes('203.0.113.77'))).toBe(false);
    vi.unstubAllGlobals();
  }, 60000);
});

describe('shared geocode cache write (Release 4.1)', () => {
  it('the database write has completed when the lookup returns, so another instance hits at once', async () => {
    const m = await import('@/lib/data-sources/nominatim');
    m._resetNominatimForTests();
    const f = vi.fn(async () => new Response(JSON.stringify([{ lat: '1', lon: '35', display_name: 'Kitale' }])));
    await m.geocodeSearch('Kitale', { fetchImpl: f as unknown as typeof fetch });
    expect(insertsCompleted).toBe(1); // not still pending
    m._resetNominatimForTests();       // another instance: empty memory
    const again = await m.geocodeSearch('Kitale', { fetchImpl: f as unknown as typeof fetch });
    expect(again.cached).toBe(true);
    expect(f).toHaveBeenCalledTimes(1);
  });
  it('a failing database write does not fail the lookup, and is logged once without the query text', async () => {
    const m = await import('@/lib/data-sources/nominatim');
    m._resetNominatimForTests();
    const orig = fakePool.query;
    fakePool.query = async (text: string, params?: unknown[]) => { if (/INSERT INTO geocode_cache/.test(text)) throw new Error('disk full'); return orig(text, params); };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const r = await m.geocodeSearch('Sensitive Place Name', { fetchImpl: (async () => new Response('[]')) as unknown as typeof fetch });
    await m.geocodeSearch('Another Place', { fetchImpl: (async () => new Response('[]')) as unknown as typeof fetch });
    expect(r.status).toBe('NO MATCH FOUND');
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0])).not.toMatch(/Sensitive Place Name/);
    fakePool.query = orig;
    warn.mockRestore();
  });
});
