/**
 * Report B: /accounts must answer a real 404 STATUS wherever accounts are off.
 * The page's notFound() streams a 200 under app/loading.tsx (protected-preview
 * check, 2026-11-24: HTTP 200 with the not-found body), so the middleware
 * answers it, as it does for /validation/pilots.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

afterEach(() => { vi.unstubAllEnvs(); });
const get = async (url: string) => {
  const { middleware } = await import('@/middleware');
  return middleware(new NextRequest(url, { headers: { 'user-agent': 'Mozilla/5.0' } }));
};

describe('/accounts hard 404 unless accounts are enabled', () => {
  it('flag not set (as on the preview today): 404, noindex, for the page and sub-paths', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('ACCOUNTS_ENABLED', '');
    for (const p of ['/accounts', '/accounts/', '/accounts?view=reset&token=x']) {
      const res = await get(`https://preview.example.vercel.app${p}`);
      expect(res.status, p).toBe(404);
      expect(res.headers.get('X-Robots-Tag')).toBe('noindex, nofollow');
      expect(res.headers.get('X-Accounts-Guard')).toBe('404-disabled');
    }
  });
  it('production: 404 even with the flag set', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    vi.stubEnv('ACCOUNTS_ENABLED', 'true');
    expect((await get('https://www.emersoneims.com/accounts')).status).toBe(404);
  });
  it('enabled preview: the guard steps aside (the page renders)', async () => {
    vi.stubEnv('VERCEL_ENV', 'preview');
    vi.stubEnv('ACCOUNTS_ENABLED', 'true');
    const res = await get('https://preview.example.vercel.app/accounts');
    expect(res.headers.get('X-Accounts-Guard')).toBeNull();
  });
  it('does not catch other paths that merely start with "accounts"', async () => {
    vi.stubEnv('VERCEL_ENV', 'production');
    const res = await get('https://www.emersoneims.com/accountsfoo');
    expect(res.headers.get('X-Accounts-Guard')).toBeNull();
  });
});
