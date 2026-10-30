// Generator Oracle round-6 audit (2026-10-30): one validator on every path,
// ranking for common phrasings, safety on symptom answers, honest counts.
import { describe, it, expect } from 'vitest';
import { searchIndex, lookupFaultCode, invalidCodeReason, diagnoseFromSymptoms, listBrandSummaries } from '@/lib/generator-oracle/server/faultIndex';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

describe('impossible codes: the same reason everywhere', () => {
  for (const q of ['SPN -5', 'SPN 100 FMI 45', 'SPN 100 FMI 25', '-5', 'FMI 45']) {
    it(`"${q}" is refused with a reason by search, lookup and chat`, () => {
      const why = invalidCodeReason(q);
      expect(why).toBeTruthy();
      expect(searchIndex({ query: q }).notice).toBe(why);
      expect(lookupFaultCode(q).notice).toBe(why);
      expect(answerOracle(q).text).toContain(why!);
    });
  }
  it('FMI 22-30 are reserved; 0-21 and 31 are valid', () => {
    expect(invalidCodeReason('SPN 100 FMI 22')).toMatch(/reserved/);
    expect(invalidCodeReason('SPN 100 FMI 21')).toBeNull();
    expect(invalidCodeReason('SPN 100 FMI 31')).toBeNull();
  });
});

describe('ranking for common phrasings', () => {
  it('"over speed" finds engine overspeed, not over-frequency', () => {
    const t = searchIndex({ query: 'over speed', pageSize: 3 }).results.map((r) => r.title).join(' | ');
    expect(t).toMatch(/overspeed/i);
    expect(t).not.toMatch(/frequency|voltage/i);
  });
  it('"overheating" finds high coolant temperature alarms', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['overheating'] });
    expect(r.ranked[0].title).toMatch(/temperature/i);
    expect(r.safety?.join(' ')).toMatch(/radiator/);
  });
  it('"generator voltage low" has no sensor-circuit or supply alarms in the top five', () => {
    const t = diagnoseFromSymptoms({ symptoms: ['generator voltage low'] }).ranked.slice(0, 5).map((r) => r.title).join(' | ');
    expect(t).not.toMatch(/sensor|supply/i);
  });
  it('"fuel leak" gets no contamination guide, a fire warning and a leak note', () => {
    const r = diagnoseFromSymptoms({ symptoms: ['fuel leak'] });
    expect(r.guides.map((g) => g.title).join(' ')).not.toMatch(/contamination/i);
    expect(r.safety?.join(' ')).toMatch(/flames/);
    expect(r.notes[0]).toMatch(/leak/);
    expect(answerOracle('fuel leak').text).toMatch(/Safety/);
  });
});

describe('honest counts and empty searches', () => {
  it('verifiedCodes counts only verified entries', () => {
    for (const b of listBrandSummaries()) expect(b.verifiedCodes).toBeLessThanOrEqual(b.totalCodes);
    expect(listBrandSummaries().some((b) => b.totalCodes > 0 && b.verifiedCodes < b.totalCodes)).toBe(true);
  });
  it('an empty search with no filter returns nothing', () => {
    expect(searchIndex({ query: '' }).total).toBe(0);
  });
});
