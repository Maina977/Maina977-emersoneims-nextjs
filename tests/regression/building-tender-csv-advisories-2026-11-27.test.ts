/**
 * Wizard re-review 2 advisories on parseTenderCsv (lib/qs/tenders.ts):
 * AD-1 a '#' comment line may contain quotes; AD-2 duplicate header names
 * are refused. Rates are TEST tenderers' rates.
 */
import { describe, it, expect } from 'vitest';
import { parseTenderCsv, TenderError } from '@/lib/qs/tenders';

describe('AD-1: # comment lines are skipped before quote parsing', () => {
  it('a comment containing quotes (and commas) is skipped; the rows keep their file line numbers', () => {
    const t = parseTenderCsv('TEST', '# rates "excl VAT", dated 2026-11-27\ncode,rate\n# section "A", substructure\nA1,1250');
    expect(t.rates.size).toBe(1);
  });
  it('row numbers still count the comment lines', () => {
    expect(() => parseTenderCsv('TEST', '# rates "excl VAT"\ncode,rate\n# "x"\nA1,1250\nA2,abc')).toThrow(/TEST, row 5: the rate for A2 must be a number/);
  });
  it('# is a comment only as the first character of a physical line outside a quoted field', () => {
    // Inside a quoted field spanning lines, a line starting with # is data, not a comment.
    const t = parseTenderCsv('TEST', 'code,rate,note\nA1,1250,"line one\n# still the note"\nA2,15000,');
    expect([...t.rates.keys()]).toEqual(['A1', 'A2']);
    // A quoted code that starts with # is an item, not a comment.
    expect(parseTenderCsv('TEST', 'code,rate\n"#7",900').rates.get('#7')).toEqual({ rate: 900 });
    // An indented # is not a comment: it is an item code '# x' with a bad rate.
    expect(() => parseTenderCsv('TEST', 'code,rate\n  # x,abc')).toThrow(/row 2: the rate for # x must be a number/);
  });
});

describe('AD-2: duplicate header names are refused', () => {
  it('code,rate,rate is refused naming the column; case and surrounding spaces do not hide a duplicate', () => {
    expect(() => parseTenderCsv('TEST', 'code,rate,rate\nA1,1250,1300')).toThrow(/TEST, row 1: the header names the column "rate" more than once/);
    expect(() => parseTenderCsv('TEST', 'Code, RATE ,rate\nA1,1250,1300')).toThrow(/column "rate" more than once/);
    expect(() => parseTenderCsv('TEST', 'code,CODE,rate\nA1,A2,5')).toThrow(TenderError);
    expect(parseTenderCsv('TEST', 'code,rate,amount\nA1,1250,70275').rates.get('A1')).toEqual({ rate: 1250, amount: 70275 });
  });
});
