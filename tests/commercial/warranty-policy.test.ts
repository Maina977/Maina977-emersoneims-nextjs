import { describe, it, expect } from 'vitest';
import { GENERATOR_WARRANTIES } from '@/lib/data/warranties';
import { PRODUCT_WARRANTY, warrantyFor, COMMERCIAL_POLICY } from '@/lib/commercial/policy';

/*
 * OWNER-CONFIRMED 2026-09-02: warranty 2 years, free servicing 1 year, both on
 * NEW GENERATOR SETS ONLY.
 *
 * Before that confirmation the site published two different free-service
 * periods — lib/data/warranties.ts offered "free service for the first 1 year"
 * in one entry and "complimentary maintenance for the first 6 months" in the
 * very next one, and pages quoted whichever they had copied. These tests hold
 * the resolved answer, and hold the SCOPE, which is the half that matters:
 * the same figures must not creep back onto used sets, solar, UPS or repairs.
 */

describe('new generator terms — the confirmed figures', () => {
  it('warrants new sets for 2 years', () => {
    const product = GENERATOR_WARRANTIES.new.find((w) => w.type === 'product');
    expect(product?.duration).toBe('2 Years');
  });

  it('gives one year of free servicing, not six months', () => {
    const service = GENERATOR_WARRANTIES.new.find((w) => w.type === 'service');
    expect(service?.duration).toBe('1 Year');
    expect(service?.duration).not.toBe('6 Months');
  });

  it('states one free-service period, never two', () => {
    // The defect: two entries in the same array offering different periods.
    const periods = new Set(
      GENERATOR_WARRANTIES.new.filter((w) => w.type === 'service').map((w) => w.duration),
    );
    expect(periods.size).toBeLessThanOrEqual(1);
  });

  it('does not mention six months anywhere in the new-set terms', () => {
    const text = JSON.stringify(GENERATOR_WARRANTIES.new).toLowerCase();
    expect(text).not.toMatch(/6 months|six months/);
  });
});

describe('scope — the half that caused the original defect', () => {
  it('carries an approved entry for new generators', () => {
    expect(PRODUCT_WARRANTY['new-generator']?.duration).toBe('2 years');
  });

  it('does NOT extend the new-set term to anything else', () => {
    // warrantyFor() must fall back to the mechanism for every other product.
    for (const slug of ['used-generator', 'solar', 'ups', 'inverter', 'motor-rewinding', 'repairs']) {
      expect(warrantyFor(slug).short, slug).toBe(COMMERCIAL_POLICY.warrantyShort);
      expect(warrantyFor(slug).short, slug).not.toMatch(/2 years/i);
    }
  });

  it('falls back to the mechanism when no product is named', () => {
    expect(warrantyFor().short).toBe(COMMERCIAL_POLICY.warrantyShort);
  });

  it('names the exclusions explicitly', () => {
    const ex = (PRODUCT_WARRANTY['new-generator']?.exclusions || []).join(' ').toLowerCase();
    expect(ex).toContain('used');
    expect(ex).toContain('solar');
  });

  it('gives used generators their own, shorter term', () => {
    // Used sets are 1 year in the schedule — proof the terms really do differ
    // by product, which is why a single site-wide figure was wrong.
    expect(GENERATOR_WARRANTIES.used[0]?.duration).toBe('1 Year');
    expect(GENERATOR_WARRANTIES.used[0]?.duration).not.toBe(
      GENERATOR_WARRANTIES.new.find((w) => w.type === 'product')?.duration,
    );
  });
});
