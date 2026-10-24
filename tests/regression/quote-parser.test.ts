/**
 * Solar quote-line parser (2026-10-20 audit round 2): ratings and model names
 * must never be read as a quantity or a price.
 */
import { describe, it, expect } from 'vitest';
import { parseLines } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';

const one = (s: string) => parseLines(s)[0];

describe('parseLines', () => {
  it('"580W panel x 24 @ 13,920" → 24 at 13,920 (580 is the rating)', () => {
    expect(one('580W panel x 24 @ 13,920')).toMatchObject({ qty: 24, unitPriceKes: 13920 });
  });
  it('model number with digits does not become the price', () => {
    expect(one('JA Solar JAM72D40-580 580W panel x 52 @ 12500')).toMatchObject({ qty: 52, unitPriceKes: 12500 });
  });
  it('"qty unit total" columns → the unit price, not the line total', () => {
    expect(one('580W panel 52 12500 650000')).toMatchObject({ qty: 52, unitPriceKes: 12500 });
  });
  it('battery capacity in kWh is a rating', () => {
    expect(one('BYD HVS 10.2kWh battery x 1 @ 420000')).toMatchObject({ qty: 1, unitPriceKes: 420000 });
  });
  it('a single price with no quantity', () => {
    expect(one('Installation and commissioning 480000')).toMatchObject({ qty: 1, unitPriceKes: 480000 });
  });
  it('quantity then price, without markers', () => {
    expect(one('Sungrow SG5K-D inverter 2 165000')).toMatchObject({ qty: 2, unitPriceKes: 165000 });
  });
});
