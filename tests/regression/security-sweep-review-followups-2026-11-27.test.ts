/**
 * Security sweep review follow-ups (2026-11-27):
 *  S1/SW-8: /api/payments/initiate is retired — 410 Gone on all 7 methods, and it never calls the M-Pesa service.
 *  F1: the spare-parts "4+ Stars" quick filter is shown only when real ratings exist (ratings are no longer invented,
 *      so the unconditional button emptied the list).
 */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const mpesa = vi.hoisted(() => ({ calls: 0 }));
vi.mock('@/lib/payments/mpesaService', () => ({ mpesaService: new Proxy({}, { get: () => () => { mpesa.calls++; return Promise.resolve({}); } }) }));

describe('/api/payments/initiate is retired', () => {
  it('answers 410 on all 7 methods and never calls the M-Pesa service', async () => {
    const route: Record<string, () => Response> = (await import('@/app/api/payments/initiate/route')) as never;
    const methods = ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'];
    expect(Object.keys(route).sort()).toEqual([...methods].sort());
    for (const m of methods) {
      const res = route[m]();
      expect(res.status, m).toBe(410);
      expect(res.headers.get('Cache-Control'), m).toBe('no-store');
    }
    expect(mpesa.calls).toBe(0);
  });
});

describe('spare-parts quick filter', () => {
  it('the "4+ Stars" button is rendered only when real ratings exist', () => {
    const src = fs.readFileSync(path.join(process.cwd(), 'app', 'generators', 'spare-parts', 'page.tsx'), 'utf8');
    const i = src.indexOf('4+ Stars');
    expect(i).toBeGreaterThan(-1);
    const before = src.slice(Math.max(0, i - 600), i);
    expect(before).toMatch(/\{hasRatings && \(/);
  });
});
