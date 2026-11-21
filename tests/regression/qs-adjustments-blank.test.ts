import { describe, it, expect } from 'vitest';
import { buildBoq, incompleteNotice, type BoqItem } from '@/lib/qs/boq';
import { draftAdjustments } from '@/lib/qs/project';

// Directive 2026-11-21: empty optional adjustment fields must not show errors;
// values actually entered keep their 0-100 limits. TEST rates only.
const Q = new Map([['M1', { id: 'M1', kind: 'area', unit: 'm²', gross: 96, deductions: 0, net: 96, holes: [] }]]) as never;
const item: BoqItem = { code: '1', section: 'TEST', description: 'TEST slab', unit: 'm²', links: [{ measurementId: 'M1', factor: 1 }], rate: { value: 1500, currency: 'KES', kind: 'supplier-quote', source: 'TEST quote', date: '2026-11-21', location: 'TEST' } } as never;
const blank = { prelims: '', contingency: '', ohp: '', vat: '', vatFrom: '' };

describe('BOQ adjustments: blank is "not entered yet", not an error', () => {
  it('all five blank: no errors, five "not entered yet", no total, INCOMPLETE notice names them', () => {
    const b = buildBoq([item], Q, draftAdjustments(blank), 'A');
    expect(b.errors).toEqual([]);
    expect(b.missing).toEqual(['Preliminaries %', 'Contingency %', 'Overheads & profit %', 'VAT %', 'VAT rate effective date']);
    expect(b.grandTotal).toBeNull();
    expect(incompleteNotice(b)).toMatch(/not entered yet: Preliminaries %/);
    expect(incompleteNotice(b)).not.toMatch(/error/);
  });
  it('a value entered outside 0-100, or not a number, is still an error', () => {
    const b = buildBoq([item], Q, draftAdjustments({ ...blank, contingency: '150', ohp: 'abc' }), 'A');
    expect(b.errors).toEqual(['Contingency % must be a number between 0 and 100', 'Overheads & profit % must be a number between 0 and 100']);
    expect(b.missing).toEqual(['Preliminaries %', 'VAT %', 'VAT rate effective date']);
  });
  it('an entered date that is not a date is an error', () => {
    const b = buildBoq([item], Q, draftAdjustments({ prelims: '5', contingency: '5', ohp: '10', vat: '16', vatFrom: 'soon' }), 'A');
    expect(b.errors).toEqual(['The VAT rate needs the date it applies from (YYYY-MM-DD)']);
  });
  it('all entered and valid: a full bill (hand check 96 × 1,500 = 144,000; +5 % = 151,200; +5 % = 158,760; +10 % = 174,636; +16 % VAT = 202,577.76)', () => {
    const b = buildBoq([item], Q, draftAdjustments({ prelims: '5', contingency: '5', ohp: '10', vat: '16', vatFrom: '2026-11-21' }), 'A');
    expect(b.errors).toEqual([]);
    expect(b.missing).toEqual([]);
    expect(b.measuredWorks).toBe(144000);
    expect(b.grandTotal).toBe(202577.76);
  });
});
