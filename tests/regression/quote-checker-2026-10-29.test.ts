/** Quote checker, round-5 audit (2026-10-29). */
import { describe, it, expect } from 'vitest';
import { parseLines, readRating, bosReferenceKes } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';

describe('quote checker round 5', () => {
  it('KTL models are grid-tie inverters, even without the word "inverter"', () => {
    expect(readRating('Huawei SUN2000-10KTL-M1')).toMatchObject({ kind: 'inverter', kw: 10, gridTie: true });
    expect(readRating('Growatt MID 10KTL3-X hybrid inverter')).toMatchObject({ gridTie: false });
  });
  it('a bare model line is priced', () => {
    expect(parseLines('Huawei SUN2000-10KTL-M1 1 230000')[0]).toMatchObject({ qty: 1, unitPriceKes: 230000 });
  });
  it('"cabling" is a balance-of-system line', () => {
    expect(parseLines('DC cabling 1 45000')[0]).toMatchObject({ unitPriceKes: 45000 });
  });
  it('quantity 0 and exponent prices are not checked', () => {
    expect(parseLines('550W panel x 0 @ 12500')[0].unitPriceKes).toBeNull();
    expect(parseLines('550W panel x 2 @ 1e9')[0].unitPriceKes).toBeNull();
  });
  it('the built-in example quote is within the balance-of-system range', () => {
    // 10 × 580 W = 5.8 kWp; equipment refs 124,700 + 175,000 + 288,000 = 587,700.
    const ref = bosReferenceKes(5.8, 587700);
    const quoted = 85000 + 90000 + 140000;
    expect(Math.abs(quoted / ref - 1)).toBeLessThan(0.35);
  });
});
