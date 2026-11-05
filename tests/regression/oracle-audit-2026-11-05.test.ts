/**
 * Generator Oracle search, self-audit 2026-11-05.
 */
import { describe, it, expect } from 'vitest';
import { searchIndex, diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';

const titles = (q: string, n = 4) => searchIndex({ query: q, pageSize: n }).results.map((r) => r.title);

describe('Oracle search 2026-11-05', () => {
  it('"no voltage output" never lists an over-voltage alarm near the top', () => {
    expect(titles('no voltage output').some((t) => /over\s?-?volt/i.test(t))).toBe(false);
  });
  it('a shutdown after running a while leads with heat/fuel/oil/load, not overspeed', () => {
    for (const q of ['generator shuts down after 10 minutes', 'shuts down after running for a while']) {
      const top = titles(q, 3);
      expect(top.length).toBeGreaterThan(0);
      expect(top.some((t) => /overspeed|over voltage|overvoltage|fail to start/i.test(t))).toBe(false);
      expect(/coolant|temperature|fuel|oil|overload|current/i.test(top[0])).toBe(true);
    }
    const d = diagnoseFromSymptoms({ symptoms: ['shuts down after 10 minutes'], topN: 3 });
    expect(d.ranked.length).toBeGreaterThan(0);
    expect(/overspeed/i.test(d.ranked[0].title)).toBe(false);
  });
  it('smoke or burning from the alternator or panel carries a safety notice', () => {
    for (const q of ['smoke from alternator', 'burning smell from panel', 'alternator winding smoking']) {
      expect(searchIndex({ query: q }).notice || '').toMatch(/^SAFETY FIRST: ELECTRICAL BURNING/);
    }
    expect(searchIndex({ query: 'black smoke' }).notice || '').not.toMatch(/ELECTRICAL BURNING/);
  });
  it('loss of excitation is found', () => {
    expect(titles('alternator no excitation')[0]).toMatch(/excitation/i);
  });
  it('a brand and an unknown number explains what to type', () => {
    const r = searchIndex({ query: 'DSE 200' });
    expect(r.total).toBe(0);
    expect(r.notice || '').toMatch(/alarm NAME/);
  });
  it('exact alarm names and J1939 codes are unchanged', () => {
    expect(titles('low oil pressure shutdown')[0]).toMatch(/low oil pressure shutdown/i);
    expect(searchIndex({ query: 'SPN 110 FMI 0' }).results[0].code).toBe('SPN110-FMI0');
    expect(titles('fail to stop')[0]).toMatch(/fail to stop/i);
  });
});
