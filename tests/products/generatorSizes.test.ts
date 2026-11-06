import { describe, it, expect } from 'vitest';
import { GENERATOR_SIZES, publishedPriceRange } from '@/lib/products/generatorSizes';
import { confirmedPriceFor, REQUEST_CURRENT_PRICE } from '@/lib/pricing/voltkaConfirmedPrices';

/*
 * GENERATOR_SIZES feeds the homepage cards, /generators, the per-size pages,
 * the brand-page schema and the sitemap. Since 2026-11-05 it carries NO prices
 * of its own: each size shows the owner-confirmed VOLTKA figures
 * (lib/pricing/voltkaConfirmedPrices.ts) or "Request current price".
 */

describe('GENERATOR_SIZES — sizes and confirmed prices', () => {
  it('has entries with unique slugs', () => {
    expect(GENERATOR_SIZES.length).toBeGreaterThan(0);
    const slugs = GENERATOR_SIZES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('shows a price only for confirmed sizes, and the confirmed figure', () => {
    for (const s of GENERATOR_SIZES) {
      const c = confirmedPriceFor(s.kva);
      if (!c) {
        expect(s.priceRange, s.slug).toBe(REQUEST_CURRENT_PRICE);
        expect(s.openKes, s.slug).toBeUndefined();
        expect(s.silentKes, s.slug).toBeUndefined();
        expect(/\d{3},\d{3}/.test(s.priceRange), s.slug).toBe(false);
      } else {
        expect(s.openKes, s.slug).toBe(c.openKes);
        expect(s.silentKes, s.slug).toBe(c.silentKes);
      }
    }
  });

  it('prices larger confirmed sets above smaller ones', () => {
    const priced = GENERATOR_SIZES.filter((s) => s.silentKes).sort((a, b) => a.kva - b.kva);
    for (let i = 1; i < priced.length; i++) {
      expect(priced[i].silentKes!, priced[i].slug).toBeGreaterThan(priced[i - 1].silentKes!);
    }
  });

  it('publishedPriceRange spans the confirmed list, nothing else', () => {
    expect(publishedPriceRange()).toEqual({ low: 2_100_000, high: 9_100_000, count: 9 });
  });
});
