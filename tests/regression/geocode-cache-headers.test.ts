import { describe, it, expect, vi, afterEach } from 'vitest';

// Release 4.2 (2026-11-20): the site-wide 10-minute edge cache applied to
// /api/geocode, so 503/429 answers could be served to other visitors. Live check
// showed X-Vercel-Cache: HIT, Age: 79 on repeat lookups.
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

async function get(qs: string, ip: string) {
  vi.resetModules();
  const { GET } = await import('@/app/api/geocode/route');
  const { NextRequest } = await import('next/server');
  return GET(new NextRequest(`http://x/api/geocode?${qs}`, { headers: { 'x-forwarded-for': ip } }));
}

describe('geocode edge caching', () => {
  it('a found place is cached at the edge for a day', async () => {
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify([{ lat: '1', lon: '35', display_name: 'Kitale' }]))));
    const r = await get('q=Kitale', '198.51.100.31');
    expect(r.status).toBe(200);
    expect(r.headers.get('vercel-cdn-cache-control')).toBe('public, max-age=86400');
  });
  it('service unavailable (503) is never cached', async () => {
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('', { status: 502 })));
    const r = await get('q=Eldoret', '198.51.100.32');
    expect(r.status).toBe(503);
    expect(r.headers.get('vercel-cdn-cache-control')).toBe('no-store');
    expect(r.headers.get('cache-control')).toBe('no-store');
  });
  it('too many requests (429) is never cached', async () => {
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('[]')));
    vi.resetModules();
    const { GET } = await import('@/app/api/geocode/route');
    const { NextRequest } = await import('next/server');
    let last: Response | null = null;
    for (let i = 0; i < 17; i++) last = await GET(new NextRequest(`http://x/api/geocode?q=Place${i}x`, { headers: { 'x-forwarded-for': '203.0.113.88' } }));
    expect(last!.status).toBe(429);
    expect(last!.headers.get('vercel-cdn-cache-control')).toBe('no-store');
  }, 40000);
});
