/** Generator Oracle, round-5 audit (2026-10-29). */
import { describe, it, expect } from 'vitest';
import { searchIndex, lookupFaultCode, codeLikeQuery } from '@/lib/generator-oracle/server/faultIndex';

describe('oracle round 5', () => {
  it('bare short and negative numbers list nothing', () => {
    for (const q of ['42', '0', '7', '-1']) expect(searchIndex({ query: q }).total).toBe(0);
  });
  it('"surging" finds speed alarms', () => {
    const r = searchIndex({ query: 'surging' });
    expect(r.total).toBeGreaterThan(0);
    expect(r.results[0].title.toLowerCase()).toMatch(/speed|frequency|hunt/); // surging = speed/frequency hunting
  });
  it('fault-code lookup agrees with search', () => {
    const c = lookupFaultCode('Cummins 151');
    expect(c.found).toBe(true);
    expect(c.exactMatches[0].code).toBe('SPN110-FMI0');
    expect(lookupFaultCode('E001').exactMatches.length).toBe(0);
    expect(lookupFaultCode('42').found).toBe(false);
  });
  it('codes are recognised in free text', () => {
    expect(codeLikeQuery('Cummins 151')).toBeTruthy();
    expect(codeLikeQuery('SPN 100 FMI 1')).toBeTruthy();
    expect(codeLikeQuery('black smoke under load')).toBeNull();
  });
  it('controller entries: no AUTO without a warning, conditions in words, topic safety', () => {
    const r = searchIndex({ query: 'Earth fault', pageSize: 50 }).results.find((x) => /deepsea/i.test(x.brand));
    expect(r).toBeTruthy();
    const full = lookupFaultCode(r!.id).exactMatches[0];
    const steps = full.resetPathways.flatMap((p) => p.steps.map((s) => s.action)).join(' | ');
    if (/AUTO/.test(steps)) expect(steps).toMatch(/can start and take load/);
    expect(full.resetPathways.flatMap((p) => p.requiresCondition || []).join(' ')).not.toMatch(/_/);
    expect(full.safetyWarnings.join(' ')).toMatch(/insulation tester|exposed metalwork/i);
    expect(full.safetyWarnings.join(' ')).not.toMatch(/^Follow standard electrical safety procedures$/m);
  });
});
