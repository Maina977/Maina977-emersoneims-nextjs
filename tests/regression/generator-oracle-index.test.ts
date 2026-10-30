/**
 * Generator Oracle — honesty and accuracy regressions (2026-10-18 tool audit).
 *
 * Each test pins a defect the audit found, so it cannot quietly return:
 * template codes padding the count, model copies duplicating results, wrong
 * J1939 meanings marked verified, invented DSE/ComAp numbers on public pages,
 * and code formats technicians actually type returning nothing.
 */
import { describe, it, expect } from 'vitest';
// 'server-only' is aliased to tests/stubs/server-only.ts in vitest.config.ts.

import {
  buildHealthReport,
  searchIndex,
  lookupFaultCode,
  diagnoseFromSymptoms,
  normalizeCodeQuery,
} from '@/lib/generator-oracle/server/faultIndex';
import { FAULT_CODES } from '@/lib/data/faultCodes';

describe('Generator Oracle fault index', () => {
  it('reports an honest total with no template expansion', () => {
    const h = buildHealthReport();
    expect(h.totals.faultCodes).toBe(h.totals.controllerAlarms + h.totals.j1939Codes);
    expect(h.totals.faultCodes).toBeLessThan(5_000); // was 451,593
    expect(h.totals).not.toHaveProperty('templateCodes');
  });

  it('never returns a "meaning not verified" template row', () => {
    for (const q of ['oil', '1120', 'coolant', 'voltage']) {
      const r = searchIndex({ query: q, pageSize: 100 });
      expect(r.results.every((x) => !/meaning not verified/i.test(x.title))).toBe(true);
    }
  });

  it('returns one row per brand + code (model copies merged)', () => {
    const r = searchIndex({ query: 'low oil pressure', pageSize: 100 });
    const keys = r.results.map((x) => `${x.brand}|${x.code}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('reads codes the way technicians type them', () => {
    expect(normalizeCodeQuery('SPN 100 FMI 1')).toBe('SPN100-FMI1');
    expect(normalizeCodeQuery('spn100 fmi1')).toBe('SPN100-FMI1');
    expect(normalizeCodeQuery('100-1')).toBe('SPN100-FMI1');
    expect(normalizeCodeQuery('MID 128 PID 100 FMI 1')).toBe('MID128-PID100-FMI1');
    expect(normalizeCodeQuery('low oil pressure')).toBeNull();
    const r = searchIndex({ query: 'SPN 100 FMI 1' });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results.every((x) => x.code === 'SPN100-FMI1')).toBe(true);
  });

  it('defaults to 20 results when no page size is given', () => {
    expect(searchIndex({ query: 'oil' }).pageSize).toBe(20);
  });

  it('no longer carries the wrong CAT / VODIA meanings', () => {
    const spn520 = lookupFaultCode('SPN520-FMI0');
    expect(spn520.exactMatches.some((m) => /generator voltage/i.test(m.title))).toBe(false);
    const pid105 = searchIndex({ query: 'MID128-PID105' });
    expect(pid105.results.some((x) => /oil level/i.test(x.title))).toBe(false);
  });

  it('marks text-alarm controller numbers as reference numbers', () => {
    const r = searchIndex({ query: 'oil', brand: 'DSE' });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results.every((x) => x.codeKind === 'reference')).toBe(true);
  });

  it('leads symptom diagnosis with the right Repair Centre guide', () => {
    const smoke = diagnoseFromSymptoms({ symptoms: ['white smoke', 'hard starting'] });
    expect(smoke.guides[0]?.url).toBe('/repair-centre/fuel-systems/generator-excessive-smoke');
    const oil = diagnoseFromSymptoms({ symptoms: ['low oil pressure'] });
    expect(oil.guides[0]?.title).toMatch(/low oil pressure/i);
    // "hard" must not match inside "hardware"
    expect(smoke.ranked.some((x) => /watchdog/i.test(x.title))).toBe(false);
  });

  it('reads "under load" as when the symptom happens, not as under-range', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['black smoke under load'] });
    expect(r.ranked.some((x) => x.matchedTerms.includes('under'))).toBe(false);
    // Smoke is answered by the Repair Centre guide; controller alarms are kept
    // only when they concern the exhaust, intake or boost (2026-10-30 re-audit).
    expect(r.guides[0]?.title).toMatch(/smoke/i);
    expect(r.guides[0]?.matchedTerms).toEqual(expect.arrayContaining(['black', 'smoke']));
    for (const x of r.ranked) expect(`${x.title} ${x.description ?? ''}`).toMatch(/smoke|exhaust|air filter|intake|boost|turbo/i);
    const uv = diagnoseFromSymptoms({ symptoms: ['under voltage'] });
    expect(uv.ranked[0]?.title).toMatch(/under ?voltage/i);
  });
});

describe('Published fault-code pages', () => {
  it('do not publish SPN 111 / 115 as ECM or speed-sensor faults', () => {
    const codes = FAULT_CODES.map((f) => f.code);
    expect(codes).not.toContain('SPN-111');
    expect(codes).not.toContain('SPN-115');
    expect(codes).toContain('CUMMINS-111');
    expect(codes).toContain('CUMMINS-115');
  });

  it('carry no invented DSE E0xx / ComAp A0xx numbers', () => {
    for (const f of FAULT_CODES) {
      const text = [f.code, f.title, ...f.searchKeywords, ...f.faqQuestions.flatMap((q) => [q.question, q.answer])].join(' ');
      if (f.brand === 'DSE' || f.brand === 'ComAp') {
        expect(text, f.code).not.toMatch(/\b[EA]0\d{2}\b/);
        expect(f.alarm, f.code).toBe(true);
      }
    }
  });

  it('are all allowed through the middleware slug guard (and nothing else is)', async () => {
    // The guard's set is inlined in middleware.ts (edge runtime). When fault
    // pages were renamed on 2026-10-18 the stale set 404'd every new page;
    // this keeps the two in step.
    const fs = await import('node:fs');
    const src = fs.readFileSync('middleware.ts', 'utf8');
    const m = src.match(/const OK_FAULTS = new Set\(\[([^\]]*)\]\);/);
    expect(m, 'OK_FAULTS not found in middleware.ts').toBeTruthy();
    const allowed = new Set([...m![1].matchAll(/'([^']+)'/g)].map((x) => x[1]));
    allowed.delete('plant');
    const slugs = new Set(FAULT_CODES.map((f) => f.code.toLowerCase()));
    expect([...slugs].filter((s) => !allowed.has(s)), 'pages the guard would 404').toEqual([]);
    expect([...allowed].filter((s) => !slugs.has(s)), 'allowed slugs with no page').toEqual([]);
  });

  it('only link to codes that exist', () => {
    const codes = new Set(FAULT_CODES.map((f) => f.code));
    for (const f of FAULT_CODES) for (const r of f.relatedCodes) expect(codes.has(r), `${f.code} -> ${r}`).toBe(true);
  });
});
