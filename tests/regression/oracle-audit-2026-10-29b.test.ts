// Generator Oracle round-6 audit: impossible codes are refused with a reason,
// and a generator-voltage question is not answered with battery alarms.
import { describe, it, expect } from 'vitest';
import { searchIndex, lookupFaultCode, codeLikeQuery, invalidCodeReason, diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';

describe('impossible J1939 codes', () => {
  it('refuses a negative SPN instead of reading it as SPN 5', () => {
    const r = searchIndex({ query: 'SPN -5' });
    expect(r.results).toHaveLength(0);
    expect(r.notice).toMatch(/never negative/);
    expect(codeLikeQuery('SPN -5')).toBeNull();
    expect(lookupFaultCode('SPN -5').found).toBe(false);
  });
  it('refuses FMI above 31 and SPN above 524287', () => {
    expect(invalidCodeReason('SPN 100 FMI 45')).toMatch(/FMI 45/);
    expect(invalidCodeReason('SPN 600000 FMI 1')).toMatch(/524287/);
    expect(searchIndex({ query: 'SPN 100 FMI 45' }).notice).toMatch(/0 to 31/);
  });
  it('still reads valid codes, including SPN-100 written with a dash', () => {
    expect(invalidCodeReason('SPN 100 FMI 1')).toBeNull();
    expect(invalidCodeReason('SPN-100')).toBeNull();
    expect(searchIndex({ query: 'SPN 100 FMI 1' }).results.length).toBeGreaterThan(0);
  });
});

describe('generator voltage symptoms', () => {
  it('"voltage drops when AC starts" does not lead with battery alarms', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['voltage drops when AC starts'] });
    const titles = r.ranked.slice(0, 3).map((f) => f.title);
    expect(titles.length).toBeGreaterThan(0);
    for (const t of titles) expect(t).not.toMatch(/battery|fail to start|mains/i);
    expect(titles[0]).toMatch(/under voltage/i);
  });
  it('"generator voltage low" leads with generator under-voltage, not the controller supply', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['generator voltage low'] });
    expect(r.ranked[0].title).toMatch(/under voltage/i);
  });
  it('a battery question still gets battery alarms', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['battery voltage low'] });
    expect(r.ranked[0].title).toMatch(/battery/i);
  });
});
