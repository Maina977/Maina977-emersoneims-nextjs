/**
 * Security hotfix 2026-11-26 (CA-27): /api/building/quotations had no authentication. Anyone could list every
 * stored quotation and overwrite a quotation's VAT and total. It is retired: every HTTP method answers
 * 410 Gone, and no method reads from or writes to storage (the database client is never loaded).
 * No quotation data is used or logged here.
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const prismaLoaded = vi.fn();
vi.mock('@/lib/prisma/client', () => { prismaLoaded(); return { prisma: new Proxy({}, { get: () => { throw new Error('storage must not be touched'); } }) }; });

const METHODS = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] as const;

describe('/api/building/quotations is retired (410 Gone on every method)', () => {
  it('every exported method answers 410 with no-store and the retirement message; storage is never loaded', async () => {
    const route: Record<string, () => Response> = await import('@/app/api/building/quotations/route') as any;
    for (const m of METHODS) {
      expect(typeof route[m], m).toBe('function');
      const res = route[m]();
      expect(res.status, m).toBe(410);
      expect(res.headers.get('Cache-Control'), m).toBe('no-store');
      const body = await res.json();
      expect(body).toEqual({ success: false, error: 'This quotations API has been retired for security reasons.' });
    }
    expect(prismaLoaded).not.toHaveBeenCalled();
  });

  it('the route module exports nothing but the retired handlers (no hidden action such as generate-pdf survives)', async () => {
    const route = await import('@/app/api/building/quotations/route');
    expect(Object.keys(route).sort()).toEqual([...METHODS].sort());
    const src = fs.readFileSync(path.join(process.cwd(), 'app', 'api', 'building', 'quotations', 'route.ts'), 'utf8');
    expect(src).not.toMatch(/prisma|quotationsStore|generate-pdf|request\.json/);
  });

  it('there is no other route under /api/building/quotations (no sub-path such as /[id])', () => {
    const dir = path.join(process.cwd(), 'app', 'api', 'building', 'quotations');
    expect(fs.readdirSync(dir)).toEqual(['route.ts']);
  });

  it('no page or component calls the quotations API', () => {
    const roots = ['app', 'components', 'lib'].map((d) => path.join(process.cwd(), d));
    const hits: string[] = [];
    const walk = (d: string) => {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) { if (e.name !== 'node_modules') walk(p); continue; }
        if (!/\.(tsx?|jsx?)$/.test(e.name) || p.includes(path.join('api', 'building', 'quotations'))) continue;
        if (fs.readFileSync(p, 'utf8').includes('/api/building/quotations')) hits.push(path.relative(process.cwd(), p));
      }
    };
    roots.forEach(walk);
    expect(hits).toEqual([]);
  });
});
