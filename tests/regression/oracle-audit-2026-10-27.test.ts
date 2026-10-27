/**
 * Generator Oracle — the independent audit of 2026-10-27 (score 5/10).
 * Each case is a failure the auditor reproduced, with the correct answer.
 */
import { describe, it, expect } from 'vitest';
import { searchIndex, lookupFaultCode, diagnoseFromSymptoms } from '@/lib/generator-oracle/server/faultIndex';
import { answerOracle } from '@/lib/generator-oracle/server/answer';

const top = (q: string) => searchIndex({ query: q, page: 1, pageSize: 10 }).results;

describe('safety', () => {
  it('every coolant code warns not to open a hot cap', () => {
    for (const code of ['SPN110-FMI0', 'SPN110-FMI16', 'SPN111-FMI1']) {
      const r = lookupFaultCode(code).exactMatches.find((m) => m.code === code)!;
      expect(r.safetyWarnings.join(' '), code).toMatch(/cap while the engine is hot/i);
    }
  });
  it('low oil pressure says stop the engine', () => {
    const r = lookupFaultCode('SPN100-FMI1').exactMatches.find((m) => m.code === 'SPN100-FMI1')!;
    expect(r.safetyWarnings.join(' ')).toMatch(/stop the engine/i);
  });
});

describe('specific causes instead of generic FMI text', () => {
  it('SPN 110 FMI 0 names radiator, fan belt and coolant', () => {
    const r = lookupFaultCode('SPN110-FMI0').exactMatches.find((m) => m.code === 'SPN110-FMI0')!;
    const causes = r.possibleCauses.map((c) => c.cause).join(' ');
    expect(causes).toMatch(/radiator/i);
    expect(causes).not.toMatch(/Genuine over-range condition/i);
  });
});

describe('codes', () => {
  it.each([
    ['Cummins 151', 'SPN110-FMI0'], ['Cummins 143', 'SPN100-FMI18'], ['Cummins 415', 'SPN100-FMI1'],
    ['Cummins 234', 'SPN190-FMI0'], ['Cummins 1117', 'SPN627-FMI2'], ['Cummins 418', 'SPN97-FMI15'],
    ['SPN 97 FMI 16', 'SPN97-FMI16'], ['fmi 0 spn 110', 'SPN110-FMI0'], ['110.0', 'SPN110-FMI0'],
  ])('%s -> %s', (q, code) => {
    expect(top(q)[0]?.code).toBe(code);
  });
  it('Perkins 100 is oil pressure (SPN 100)', () => {
    expect(top('Perkins 100')[0]?.code).toMatch(/^SPN100-FMI/);
  });
  it('Cummins 115 keeps its meaning and is critical', () => {
    const r = top('Cummins 115')[0];
    expect(r.code).toBe('SPN612-FMI2');
    expect(r.severity).toBe('critical');
    expect(r.description).toMatch(/speed\/position signals lost/i);
  });
});

describe('nonsense and ambiguous input', () => {
  it.each(['!!!???', '0', '12'])('"%s" is not answered with alarms', (q) => {
    const a = answerOracle(q);
    expect(a.found).toBe(false);
    expect(a.results).toHaveLength(0);
  });
  it('an undefined FMI is called out', () => {
    expect(answerOracle('SPN 110 FMI 25').text).toMatch(/FMI 25 is not a defined failure mode/);
  });
  it('symptom diagnosis with no words returns nothing', () => {
    expect(diagnoseFromSymptoms({ symptoms: ['!!!'] }).ranked).toHaveLength(0);
  });
});

describe('page search and chat agree on symptoms', () => {
  it('generator overheating -> temperature alarms, not electrical ones', () => {
    const r = top('generator overheating').slice(0, 5);
    expect(r.length).toBeGreaterThan(0);
    for (const x of r) expect(x.title, x.title).toMatch(/temp|coolant|overheat|cool/i);
  });
  it('generator wont start -> fail to start first', () => {
    expect(top('generator wont start')[0]?.title).toMatch(/fail(ed)? to start|start fail|crank/i);
    expect(answerOracle('Fail to start').results[0]?.title).toMatch(/fail(ed)? to start|start fail|crank/i);
  });
  it('no power is not reverse power', () => {
    for (const x of answerOracle('no power').results) expect(x.title).not.toMatch(/reverse/i);
  });
  it('low coolant level does not offer the low-oil-pressure guide', () => {
    for (const g of answerOracle('low coolant level').guides) expect(g.title).not.toMatch(/oil pressure/i);
  });
  it('engine knocking finds the abnormal-noise guide', () => {
    expect(answerOracle('engine knocking').guides.map((g) => g.title).join(' ')).toMatch(/noise/i);
  });
});
