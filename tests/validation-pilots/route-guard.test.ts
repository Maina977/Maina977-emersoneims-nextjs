import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

const notFound = vi.fn(() => { throw new Error('NEXT_NOT_FOUND'); });
vi.mock('next/navigation', () => ({
  notFound: () => notFound(),
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn() }),
  usePathname: () => '/validation/pilots',
  useSearchParams: () => new URLSearchParams(),
}));

afterEach(() => { vi.unstubAllEnvs(); notFound.mockClear(); });

describe('/validation/pilots is preview-only', () => {
  it('production: the page calls notFound()', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    const Page = (await import('@/app/validation/pilots/page')).default;
    expect(() => Page()).toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });
  it('preview and local: the page renders the tool', async () => {
    for (const env of ['preview', 'development', '']) {
      vi.stubEnv('VERCEL_ENV', env);
      const Page = (await import('@/app/validation/pilots/page')).default;
      expect(() => Page()).not.toThrow();
    }
    expect(notFound).not.toHaveBeenCalled();
  });
  it('is noindex, nofollow and rendered per request', async () => {
    const mod = await import('@/app/validation/pilots/page');
    expect(mod.metadata.robots).toMatchObject({ index: false, follow: false });
    expect(mod.dynamic).toBe('force-dynamic');
  });
  it('production middleware answers a hard 404 (notFound alone does not set the status on Next 16)', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    const { middleware } = await import('@/middleware');
    for (const p of ['/validation/pilots', '/validation/pilots/', '/validation/pilots/x']) {
      const res = middleware(new NextRequest(`https://www.emersoneims.com${p}`, { headers: { 'user-agent': 'Mozilla/5.0' } }));
      expect(res.status, p).toBe(404);
      expect(res.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
    }
    vi.stubEnv('VERCEL_ENV', 'preview');
    const res = middleware(new NextRequest('https://preview.example.vercel.app/validation/pilots', { headers: { 'user-agent': 'Mozilla/5.0' } }));
    expect(res.headers.get('X-Pilot-Guard')).toBeNull();
  });
});

describe('sitemap excludes the pilot page', () => {
  it('no sitemap URL is under /validation', async () => {
    const sitemap = (await import('@/app/sitemap')).default;
    const urls = sitemap().map((e) => e.url);
    expect(urls.length).toBeGreaterThan(100);
    expect(urls.filter((u) => /\/validation(\/|$)/.test(new URL(u).pathname))).toEqual([]);
  });
  it('the sitemap source never names the route', () => {
    expect(fs.readFileSync(path.resolve('app/sitemap.ts'), 'utf8')).not.toMatch(/validation\/pilots/);
  });
});
