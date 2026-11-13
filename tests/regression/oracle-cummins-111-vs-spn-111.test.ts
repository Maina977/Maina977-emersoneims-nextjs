/**
 * Management review 2026-11-13, item 2: Cummins proprietary fault code 111 is
 * "ECM critical internal failure", J1939 SPN 629 FMI 12. J1939 SPN 111 is
 * engine coolant level, a different identifier. They must never be confused.
 */
import { describe, it, expect } from 'vitest';
import { answerOracle } from '@/lib/generator-oracle/server/answer';
import { searchIndex } from '@/lib/generator-oracle/server/faultIndex';
import { CUMMINS_ERROR_CODES } from '@/lib/data/cumminsErrorCodes';
import { J1939_FAULT_CODES } from '@/lib/data/j1939FaultCodes';

describe('Cummins 111 is not J1939 SPN 111', () => {
  it('Cummins 111 resolves to SPN 629 FMI 12, the ECM', () => {
    const r = searchIndex({ query: 'Cummins 111', pageSize: 3 });
    expect(r.interpretedAs).toMatch(/SPN\s*629\s*FMI\s*12/i);
    expect(r.results[0].code).toMatch(/SPN629-FMI12/i);
    expect(`${r.results[0].title}`).not.toMatch(/coolant/i);
    const a = answerOracle('Cummins 111');
    expect(a.text).not.toMatch(/coolant level/i);
  });

  it('J1939 SPN 111 is coolant level, never the ECM', () => {
    const a = answerOracle('SPN 111 FMI 1');
    expect(a.found).toBe(true);
    expect(a.text).toMatch(/coolant level/i);
    expect(a.text.split('\n\n')[0]).not.toMatch(/ECM|control module/i);
    expect(J1939_FAULT_CODES.filter((j) => j.spn === 111).length).toBeGreaterThan(0);
    expect(J1939_FAULT_CODES.filter((j) => j.spn === 111).every((j) => /coolant level/i.test(j.title))).toBe(true);
  });

  it('the Cummins database records 111 with SPN 629 / FMI 12, not SPN 111', () => {
    const c = CUMMINS_ERROR_CODES.find((x) => x.code === '111')!;
    expect(c.spn).toBe(629);
    expect(c.fmi).toBe(12);
    expect(c.title).toMatch(/ECM/);
  });

  it('Cummins coolant-level codes map to SPN 111 (e.g. Cummins 235 → SPN 111 FMI 1)', () => {
    expect(searchIndex({ query: 'Cummins 235', pageSize: 1 }).interpretedAs).toMatch(/SPN\s*111\s*FMI\s*1\b/i);
  });
});
