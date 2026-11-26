/**
 * Building Suite wizard, Costing tab "QS Quotation" (review observation,
 * 2026-11-26): it called POST /api/report/quotation, which had no Next.js
 * route, so it always showed "Error generating quotation" (after asking for
 * client, VAT and discount). Now /api/report/* reaches the dispatcher's
 * not-available stub (501), and the tab says the quotation is not available
 * online and points to the measured take-off and BOQ. Nothing is priced,
 * computed or stored; no prices are invented.
 */
import { describe, it, expect, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextRequest } from 'next/server';

const route = () => import('@/app/api/report/[...path]/route');
const call = async (seg: string[], body: unknown = {}) => {
  const { POST } = await route();
  const res = await POST(new NextRequest(`http://localhost/api/report/${seg.join('/')}`, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } }), { params: Promise.resolve({ path: seg }) });
  return { status: res.status, j: await res.json() };
};

describe('/api/report/* answers the not-available stub (it was a 404 page)', () => {
  it('quotation, comprehensive and client-package: 501, success false, the engineer’s number, no figures', async () => {
    for (const seg of [['quotation'], ['comprehensive'], ['client-package']]) {
      const { status, j } = await call(seg, { area: 220, stories: 2, vat_rate: 16 });
      expect(status).toBe(501);
      expect(j.success).toBe(false);
      expect(j.error).toBe('not_available');
      expect(j.message).toMatch(/0768 860 665/);
      expect(JSON.stringify(j)).not.toMatch(/grand_total|cost_summary|"rate":\d|KES ?\d/);
    }
  });
});

describe('the Costing tab says so instead of "Error generating quotation"', () => {
  const html = readFileSync(join(__dirname, '..', '..', 'public', 'eims-building-suite-v20261105.html'), 'utf8');
  const slice = (from: string, to: string) => { const a = html.indexOf(from), b = html.indexOf(to, a); expect(a).toBeGreaterThan(-1); expect(b).toBeGreaterThan(a); return html.slice(a, b); };
  const src = slice('function crUnavailable(', 'async function crShowPackage(');

  it('the old generic errors are gone from the three Costing screens', () => {
    expect(html).not.toMatch(/>Error generating (quotation|report|package)</);
    expect(src).not.toMatch(/prompt\(/);
  });

  it('running crShowQuotation against the real route shows the not-available note and the take-off link, with no prompts', async () => {
    const el = { innerHTML: '' };
    const prompt = vi.fn();
    const fetchViaRoute = async (url: string, init: RequestInit) => {
      const seg = url.replace(/^\/api\/report\//, '').split('/');
      const { POST } = await route();
      return POST(new NextRequest(`http://localhost${url}`, init as never), { params: Promise.resolve({ path: seg }) });
    };
    const run = new Function('document', 'fetch', 'prompt', 'API', 'crGetParams', 'crLoadOverrides', 'crCountry', `${src}; return crShowQuotation();`);
    await run({ getElementById: () => el }, fetchViaRoute, prompt, '/api', () => ({ area: 220, stories: 2 }), () => ({}), 'Kenya');
    expect(prompt).not.toHaveBeenCalled();
    expect(el.innerHTML).toMatch(/A QS quotation is not available online/);
    expect(el.innerHTML).toMatch(/0768 860 665/);
    expect(el.innerHTML).toMatch(/href="\/solutions\/building\/takeoff"/);
    expect(el.innerHTML).not.toMatch(/Error generating/);
  });

  it('a non-JSON answer (e.g. an HTML 404 page) also gives the note, not a raw parse error', async () => {
    const el = { innerHTML: '' };
    const run = new Function('document', 'fetch', 'prompt', 'API', 'crGetParams', 'crLoadOverrides', 'crCountry', `${src}; return crShowQuotation();`);
    await run({ getElementById: () => el }, async () => new Response('<!doctype html><h1>404</h1>', { status: 404 }), () => null, '/api', () => ({}), () => ({}), 'Kenya');
    expect(el.innerHTML).toMatch(/A QS quotation is not available online/);
    expect(el.innerHTML).not.toMatch(/Unexpected token/);
  });
});
