import { describe, it, expect } from 'vitest';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';

/*
 * GENERATOR_SIZES is the single source the homepage VKS44 card, the trade-in
 * calculator, /generators, the per-size pages and the sitemap all read from.
 *
 * The calculator parses the LOW bound out of `priceRange` with a regex, so the
 * STRING FORMAT of that field is load-bearing: if an entry is ever written as
 * "From 950k" or "POA", the parse silently yields 0 and the homepage renders a
 * zero-priced generator. These tests pin the format so that change fails here
 * instead of in production.
 */

// The same expression the trade-in calculator uses.
const lowBound = (range: string) =>
  Number((range.match(/[\d,]{6,}/) || ['0'])[0].replace(/,/g, '')) || 0;

describe('GENERATOR_SIZES — the shared price source', () => {
  it('has entries', () => {
    expect(GENERATOR_SIZES.length).toBeGreaterThan(0);
  });

  it('gives every size a parseable low bound above zero', () => {
    for (const s of GENERATOR_SIZES) {
      expect(lowBound(s.priceRange), `${s.slug} -> "${s.priceRange}"`).toBeGreaterThan(0);
    }
  });

  it('never lets the low bound exceed the high bound', () => {
    for (const s of GENERATOR_SIZES) {
      const nums = (s.priceRange.match(/[\d,]{6,}/g) || []).map((n) => Number(n.replace(/,/g, '')));
      if (nums.length === 2) expect(nums[0], s.slug).toBeLessThanOrEqual(nums[1]);
    }
  });

  it('prices larger sets above smaller ones', () => {
    // A price list that is not monotonic in kVA is almost certainly a typo.
    const sorted = [...GENERATOR_SIZES].sort((a, b) => a.kva - b.kva);
    for (let i = 1; i < sorted.length; i++) {
      expect(lowBound(sorted[i].priceRange), `${sorted[i].slug} vs ${sorted[i - 1].slug}`)
        .toBeGreaterThan(lowBound(sorted[i - 1].priceRange));
    }
  });

  it('resolves 44 kVA to the 50 kVA entry', () => {
    // The VKS44 has no entry of its own; both the homepage card and the
    // calculator fall back to the nearest rating, and must agree on which.
    const nearest = GENERATOR_SIZES.reduce((best, s) =>
      Math.abs(s.kva - 44) < Math.abs(best.kva - 44) ? s : best
    );
    expect(nearest.kva).toBe(50);
    expect(lowBound(nearest.priceRange)).toBeGreaterThan(0);
  });

  it('gives every entry a unique slug', () => {
    const slugs = GENERATOR_SIZES.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});
