/**
 * Solar quote-line parser (2026-10-20 audit round 2): ratings and model names
 * must never be read as a quantity or a price.
 */
import { describe, it, expect } from 'vitest';
import { parseLines, readRating } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';

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

describe('CSV quotes and ratings (2026-10-20 audit round 3)', () => {
  it('CSV row "JA Solar 550W, 12, 15,000, 180,000" → 12 at 15,000', () => {
    expect(one('JA Solar 550W, 12, 15,000, 180,000')).toMatchObject({ qty: 12, unitPriceKes: 15000 });
  });
  it('a header row is not an item', () => {
    const rows = parseLines('Item, Qty, Unit price, Total\nJA Solar 550W, 12, 15,000, 180,000');
    expect(rows).toHaveLength(1);
  });
  it('reads the rating and kind of each line', () => {
    expect(readRating('Deye 5kW hybrid inverter')).toMatchObject({ kind: 'inverter', kw: 5, gridTie: false });
    expect(readRating('Sungrow SG5K-D 5kW grid-tie inverter')).toMatchObject({ kind: 'inverter', kw: 5, gridTie: true });
    expect(readRating('550W mono panel')).toMatchObject({ kind: 'panel', w: 550 });
    expect(readRating('Pylontech 5kWh lithium battery')).toMatchObject({ kind: 'battery', kwh: 5 });
    expect(readRating('DC cabling and isolators').kind).toBeNull();
  });
});

describe('Kenyan quote formats (2026-10-25 audit round 4)', () => {
  it('skips subtotal, VAT, total and payment terms', () => {
    const lines = parseLines('Panels 580W x 10 @ 12500\nSubtotal 295000\nVAT 16% 47200\nTOTAL KES 342,200\nPay within 30 days');
    expect(lines).toHaveLength(1);
    expect(lines[0].unitPriceKes).toBe(12500);
  });
  it('reads 48V 100Ah, kVA and "watts"', () => {
    expect(readRating('48V 100Ah lithium battery')).toMatchObject({ kind: 'battery', kwh: 4.8 });
    expect(readRating('3.5kVA off-grid inverter')).toMatchObject({ kind: 'inverter', kw: 3.5 });
    expect(readRating('450 watts mono panel')).toMatchObject({ kind: 'panel', w: 450 });
  });
});

describe('Quote checker audit round 5 (2026-10-25)', () => {
  it('keeps an item that mentions VAT inclusive', () => {
    const l = parseLines('Deye 8kW hybrid inverter (VAT 16% inclusive) 1 260000 260000');
    expect(l).toHaveLength(1);
    expect(l[0].unitPriceKes).toBe(260000);
  });
  it('does not price gibberish and skips document headers', () => {
    expect(parseLines('lorem 123 ipsum 456')[0].unitPriceKes).toBeNull();
    expect(parseLines('QUOTATION - 5kVA HYBRID SOLAR SYSTEM\nPanels 580W x 10 @ 12500')).toHaveLength(1);
  });
  it('reads an off-grid inverter as off-grid', () => {
    expect(readRating('Must 3.5kVA off-grid inverter')).toMatchObject({ kind: 'inverter', kw: 3.5, offGrid: true });
  });
});
