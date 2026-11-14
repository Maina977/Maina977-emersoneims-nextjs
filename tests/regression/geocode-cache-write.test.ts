import { describe, it, expect, vi, beforeEach } from 'vitest';

// Release 4.1 (2026-11-15): the shared cache write is awaited. Live on Release 4
// every repeat lookup missed: the fire-and-forget INSERT did not complete after
// the response on Vercel, so other instances never found the shared copy.

const rows = new Map<string, unknown>();
let insertsCompleted = 0;
const fakePool = {
  query: async (text: string, params: unknown[] = []) => {
    if (/CREATE TABLE/.test(text)) return { rows: [] };
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

beforeEach(() => { vi.stubEnv('VERCEL_ENV', 'production'); rows.clear(); insertsCompleted = 0; });

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
