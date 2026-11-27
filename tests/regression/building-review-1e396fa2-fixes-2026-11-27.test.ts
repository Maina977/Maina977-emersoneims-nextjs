/**
 * Re-review of 1e396fa2 / 04bfeb24 (appended to BUILDING-d1da0120-REVIEW.md):
 * T1 RFC 4180 tender CSV, W1 Kenyan U-value wording, W2 editions; plus the
 * trades re-review advisory A-1 (void threshold cap).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseTenderCsv, compareTenders, TenderError } from '@/lib/qs/tenders';
import { measuredWorks } from '@/lib/qs/works';
import type { Quantity } from '@/lib/qs/takeoff';

const root = join(__dirname, '..', '..');

describe('T1: tender CSVs are parsed as RFC 4180; malformed rows are refused with their row number', () => {
  it('the Excel row A1,"1,250.00" is refused (thousands separator), never read as rate 1 / amount 250', () => {
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,"1,250.00"')).toThrow(/TEST, row 2: the rate for A1 "1,250\.00" has a thousands separator/);
    expect(() => parseTenderCsv('TEST', 'code,rate,amount\nA1,"1,250.00","70,275.00"')).toThrow(TenderError);
    // Unquoted, it is 3 fields against a 2-field header.
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,1,250.00')).toThrow(/row 2: 3 field\(s\), the header has 2/);
  });
  it('a quoted field with an escaped quote "" and a comma is one field; plain numbers in quotes are accepted', () => {
    const t = parseTenderCsv('TEST', 'code,rate,amount,note\n"A1","1250.00","70275.00","said ""as per BQ"", incl. delivery"\nA2,15000,,');
    expect(t.rates.get('A1')).toEqual({ rate: 1250, amount: 70275 });
    expect(t.rates.get('A2')).toEqual({ rate: 15000 });
    // Hand check against the bill: 56.22 × 1,250 = 70,275.00 (no arithmetic error).
    const c = compareTenders([{ code: 'A1', description: 'TEST', unit: 'm²', quantity: 56.22 }, { code: 'A2', description: 'TEST', unit: 'm³', quantity: 11.244 }], [t, parseTenderCsv('U', 'code,rate\nA1,1180\nA2,16200')]);
    expect(c.rows[0].cells[0]).toEqual({ rate: 1250, amount: 70275, tenderedAmount: 70275, arithmeticError: false });
  });
  it('a short row, an unclosed quote and text after a closing quote are refused with the row', () => {
    expect(() => parseTenderCsv('TEST', 'code,rate,amount\nA1,1250,70275\nA2,15000')).toThrow(/TEST, row 3: 2 field\(s\), the header has 3/);
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,"1250')).toThrow(/row 2: a quoted field is not closed/);
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,"1250"x')).toThrow(/row 2: text after a closing quote/);
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,12"50')).toThrow(/row 2: a quote inside an unquoted field/);
    expect(() => parseTenderCsv('TEST', 'code,rate\nA1,1e3')).toThrow(/must be a number ≥ 0/);
  });
  it('row numbers are the file lines: blank and # comment lines are skipped but counted', () => {
    expect(() => parseTenderCsv('TEST', 'code,rate\n# priced 2026-11-27\n\nA1,abc')).toThrow(/TEST, row 4:/);
  });
});

describe('W1, W2', () => {
  it('W1: no unsourced "Kenya sets no statutory wall U-value"; the user is pointed to the code in force', () => {
    const html = readFileSync(join(root, 'public', 'eims-building-suite-v20261105.html'), 'utf8');
    expect(html).not.toContain('Kenya sets no statutory wall U-value');
    expect(html).toContain('Check the Kenyan code in force (National Building Code 2024) and the project specification for the wall U-value requirement.');
  });
  it('W2: BRE Digest 309 (1986); ASHRAE 62.1 stays "edition not stated" with the reason recorded', () => {
    const src = readFileSync(join(root, 'lib', 'wizard-api', 'buildingCalcs.ts'), 'utf8');
    expect(src).toContain("BRE Digest 309 (1986) / BS 8206-2:2008 (superseded 2022-01-31)");
    expect(src).toContain('ASHRAE 62.1 (edition not stated)');
    expect(src).toMatch(/Edition \(review W2, 2026-11-27\): kept as "edition not stated"[\s\S]*Naming a year would be a guess/);
  });
});

describe('A-1: the works void threshold allows the larger thresholds some rules use (up to 10 m²)', () => {
  it('hand-worked: formwork soffit 96 m² with a 4.5 m² stair void, SMM7 E20 rule 5 m² → 96 m² (void not deducted); at 0 → 91.5 m²', () => {
    const soffit: Quantity = { id: 'S1', kind: 'area', unit: 'm²', gross: 96, deductions: 4.5, net: 91.5, holes: [{ areaM2: 4.5 }] };
    const run = (t: number, src: string) => measuredWorks({ code: 'F', description: 'TEST', trade: 'formwork', voidRule: { value: t, source: src }, rows: [{ item: 'soffit', spec: 'TEST plywood', measurement: soffit, dims: [] }] })[0];
    expect(run(5, 'TEST SMM7 E20: voids ≤ 5 m² in soffits not deducted').quantity).toBe(96);
    expect(run(0, 'TEST: deduct all').quantity).toBe(91.5);
    expect(() => run(5, '')).toThrow(/give its source/);
    expect(() => run(12, 'TEST')).toThrow(/outside 0–10 m²/);
  });
});
