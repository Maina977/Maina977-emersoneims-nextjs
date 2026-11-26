/**
 * Real-project test D3 (2026-11-26): the Solar Quote Checker parser on EmersonEIMS's own quotation
 * layout ("description … qty  rate  total", a "Sales Tax (16.0%)" line, counts inside descriptions,
 * switchgear items). ALL LINES ARE SYNTHETIC: written in the same layout, no client data.
 * The checker stays unavailable to customers (pricesVerified() is false).
 */
import { describe, it, expect } from 'vitest';
import { isSummaryLine, parseLines, parseTotals } from '@/components/solar-modules/crc/src/pages/QuoteCheckerPage';
import { pricesVerified } from '@/lib/solar/sizing';

const one = (s: string) => parseLines(s)[0];

describe('Quote Checker gate', () => {
  it('stays off for customers: prices are not verified, so the page offers a quotation review instead', () => {
    expect(pricesVerified()).toBe(false);
  });
});

describe('tax and totals (synthetic EIMS layout)', () => {
  const QUOTE = [
    'TEST CHANGEOVER SWITCH 125A 4-POLE 2 18,500.00 37,000.00',
    'TEST CONTACTOR 3-POLE 40A 1 6,500.00 6,500.00',
    'Sub Total 43,500.00',
    'Sales Tax (16.0%) 6,960.00',
    'Total 50,460.00',
  ].join('\n');
  it('"Sales Tax (16.0%)" is the tax line, not a priced item; VAT, subtotal and total are found', () => {
    expect(isSummaryLine('Sales Tax (16.0%) 6,960.00')).toBe(true);
    expect(isSummaryLine('VAT 16% 6,960.00')).toBe(true);
    expect(isSummaryLine('Add VAT @ 16% 6,960')).toBe(true);
    expect(parseLines(QUOTE).map((l) => l.raw)).toEqual(['TEST CHANGEOVER SWITCH 125A 4-POLE 2 18,500.00 37,000.00', 'TEST CONTACTOR 3-POLE 40A 1 6,500.00 6,500.00']);
    expect(parseTotals(QUOTE)).toEqual({ subtotal: 43500, vat: 6960, total: 50460 });
  });
  it('an item that mentions VAT in its text is still an item', () => {
    expect(isSummaryLine('TEST INVERTER (price excl. VAT) 1 100,000 100,000')).toBe(false);
  });
});

describe('quantity, unit price and descriptive counts', () => {
  it('trailing qty | rate | total columns are used when qty × rate = total', () => {
    expect(one('TEST CHANGEOVER SWITCH 125A 4-POLE 2 18,500.00 37,000.00')).toMatchObject({ qty: 2, unitPriceKes: 18500 });
    expect(one('TEST CABLE TIES 3 packs 1 1,500 1,500')).toMatchObject({ qty: 1, unitPriceKes: 1500 });
  });
  it('a count inside the description is not a quantity: ambiguous lines need confirmation and are not priced', () => {
    const a = one('TEST EARTH ROD 2 pcs 3,000');
    expect(a.unitPriceKes).toBeNull();
    expect(a.needsConfirmation).toMatch(/count in the description/);
    const b = one('TEST PILOT LIGHT 2 sets 1,200 3,600');
    expect(b.unitPriceKes).toBeNull();
    expect(b.needsConfirmation).toMatch(/do not agree/);
    const c = one('TEST INSULATION TAPE 3 rolls 450');
    expect(c.unitPriceKes).toBeNull();
    expect(c.needsConfirmation).toBeTruthy();
  });
  it('"150 @ 150" is 150 at 150 (equal numbers count), with or without "@"', () => {
    expect(one('TEST SIGNAL CABLE 150 @ 150')).toMatchObject({ qty: 150, unitPriceKes: 150 });
    expect(one('TEST SIGNAL CABLE 150 150')).toMatchObject({ qty: 150, unitPriceKes: 150 });
  });
  it('numbers that do not agree, with no count in the text, need confirmation', () => {
    const r = one('TEST BUSBAR 1200 2 900 4,000');
    expect(r.unitPriceKes).toBeNull();
    expect(r.needsConfirmation).toMatch(/do not agree/);
  });
});

describe('switchgear items are recognised (no longer unpriced)', () => {
  for (const line of [
    'TEST ENCLOSURE 600x400x200 1 12,000 12,000',
    'TEST CONTACTOR 3-POLE 40A 1 6,500 6,500',
    'TEST PHASE FAILURE RELAY 1 4,800 4,800',
    'TEST PILOT LIGHT RED 3 350 1,050',
    'TEST LABELS 1 800 800',
    'TEST AUXILIARY CONTACT 2 900 1,800',
  ]) {
    it(line, () => {
      const r = one(line);
      expect(r.unitPriceKes).not.toBeNull();
      expect(r.needsConfirmation).toBeUndefined();
    });
  }
});
