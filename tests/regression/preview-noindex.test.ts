/**
 * Management decision 2026-11-13, item 1: Preview deployments are noindex;
 * production indexing unchanged.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

async function headersFor(env: string) {
  vi.stubEnv('VERCEL_ENV', env);
  vi.resetModules();
  const cfg = (await import('@/next.config')).default as { headers: () => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>> };
  return (await cfg.headers()).flatMap((h) => h.headers.filter((x) => x.key === 'X-Robots-Tag').map((x) => `${h.source} ${x.value}`));
}
async function robotsFor(env: string) {
  vi.stubEnv('VERCEL_ENV', env);
  vi.resetModules();
  return (await import('@/app/robots')).default();
}

describe('preview noindex', () => {
  it('a preview build sends X-Robots-Tag: noindex, nofollow on every path', async () => {
    expect(await headersFor('preview')).toContain('/(.*) noindex, nofollow');
  });
  it('a production build adds no site-wide noindex', async () => {
    expect((await headersFor('production')).filter((h) => h.startsWith('/(.*) noindex'))).toEqual([]);
  });
  it('preview robots.txt disallows everything; production robots.txt is unchanged', async () => {
    expect(await robotsFor('preview')).toEqual({ rules: [{ userAgent: '*', disallow: '/' }] });
    const prod = await robotsFor('production');
    expect(JSON.stringify(prod)).not.toMatch(/"disallow":"\/"(?!\w)/);
    expect(prod.sitemap).toBeTruthy();
  });
});
