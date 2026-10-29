/**
 * Quote checker (2026-10-27 audit, M9): "10KTL" ratings, "rating qty price"
 * lines, the quote's own arithmetic and the balance-of-system reference.
 */
import { describe, it, expect } from 'vitest';
import { parseLines, readRating, parseTotals, bosReferenceKes } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';

const one = (s: string) => parseLines(s)[0];

describe('quote checker, 2026-10-27', () => {
  it('reads "10KTL" and "SUN-5K-SG03" as inverter ratings', () => {
    expect(readRating('Growatt MID 10KTL3-X inverter')).toMatchObject({ kind: 'inverter', kw: 10 });
    expect(readRating('Deye SUN-5K-SG03LP1 hybrid inverter')).toMatchObject({ kind: 'inverter', kw: 5 });
  });
  it('"Panel 550 W 10 12500" is 10 panels at 12,500', () => {
    expect(one('Panel 550 W 10 12500')).toMatchObject({ qty: 10, unitPriceKes: 12500 });
  });
  it('"Battery 48 V 100 Ah 2 90000" is 2 at 90,000', () => {
    expect(one('Battery 48 V 100 Ah 2 90000')).toMatchObject({ qty: 2, unitPriceKes: 90000 });
  });
  it('subtotal, VAT and total are read, not priced as items', () => {
    const q = 'Panel 550W x 10 @ 12500\nSubtotal 125,000\nVAT 16% 20,000\nTotal 145,000';
    expect(parseLines(q)).toHaveLength(1);
    expect(parseTotals(q)).toEqual({ subtotal: 125000, vat: 20000, total: 145000 });
    const q2 = 'Panel 550W x 10 @ 12500\n16% VAT 20,000\nTotal 145,000';
    expect(parseLines(q2)).toHaveLength(1);
    expect(parseTotals(q2).vat).toBe(20000);
  });
  it('balance of system follows the calculator rates', () => {
    // 5.5 kWp: 70k/kWp less panels at 21.5/W = 48.5k/kWp, plus 12% of equipment.
    expect(bosReferenceKes(5.5, 500000)).toBe(Math.round(5.5 * 48500 + 60000));
    expect(bosReferenceKes(20, 0)).toBeGreaterThan(bosReferenceKes(10, 0));
  });
});
