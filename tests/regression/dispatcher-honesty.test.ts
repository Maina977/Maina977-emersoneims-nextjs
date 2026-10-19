/**
 * Wizard / tool API dispatcher — honesty regressions (2026-10-18 tool audit).
 * Endpoints that are not built must not answer success:true; the Building
 * Suite showed "Ready ✓", "0 risks" and a BOQ total of 0 as results because
 * they did.
 */
import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { dispatch } from '@/lib/wizard-api/dispatcher';

const post = (path: string, body: unknown = {}) =>
  new NextRequest(`http://localhost${path}`, { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

describe('dispatcher', () => {
  it.each([
    ['/api/qs/boq', 'qs', ['boq']],
    ['/api/safety/risks', 'safety', ['risks']],
    ['/api/report/quotation', 'report', ['quotation']],
    ['/api/research/load-forecast/run', 'research', ['load-forecast', 'run']],
  ])('%s answers 501, not success', async (path, prefix, segs) => {
    const res = await dispatch(post(path), segs as string[], prefix as string);
    expect(res.status).toBe(501);
    const j = await res.json();
    expect(j.success).toBe(false);
    expect(j.message).toMatch(/0768 860 665/);
  });

  it('PVWatts-style yield is labelled as our NASA estimate, never as NREL', async () => {
    // Network-dependent: only assert the labelling when NASA answers.
    const res = await dispatch(new NextRequest('http://localhost/api/site/pvwatts?lat=-1.286&lon=36.817&kw=1'), ['pvwatts'], 'site');
    const j = await res.json();
    if (j.success) {
      expect(j.data.provenance.source).toMatch(/NASA POWER/);
      expect(j.data.provenance.source).not.toMatch(/NREL/);
      expect(j.data.annualKwh).toBeGreaterThan(1000);
      expect(j.data.annualKwh).toBeLessThan(2500);
    } else {
      expect(res.status).toBeGreaterThanOrEqual(400);
    }
  }, 20000);
});
