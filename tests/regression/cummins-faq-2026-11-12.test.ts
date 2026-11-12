/**
 * Change Set C (2026-11-12): the Cummins brand page FAQ and its Product schema
 * state the published VOLTKA prices and attribute them to VOLTKA.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { getBrandBySlug, generateBrandFAQs } from '@/lib/data/generator-brands';
import { confirmedSpan, kesMillions, VOLTKA_PRICES_AS_OF_LABEL } from '@/lib/pricing/voltkaConfirmedPrices';
import { publishedPriceRange } from '@/lib/products/generatorSizes';

describe('Cummins brand FAQ', () => {
  const faqs = generateBrandFAQs(getBrandBySlug('cummins')!, 'Kenya');
  const price = faqs.find((f) => /How much do Cummins generators cost/.test(f.question))!;

  it('states the published VOLTKA range, its basis and date, with no "certified pre-owned"', () => {
    const s = confirmedSpan();
    expect(price.answer).toContain(kesMillions(s.lowKes));
    expect(price.answer).toContain(kesMillions(s.highKes));
    expect(price.answer).toMatch(/VOLTKA/);
    expect(price.answer).toMatch(/ex-warehouse, excl\. VAT/);
    expect(price.answer).toContain(VOLTKA_PRICES_AS_OF_LABEL);
    expect(price.answer).toMatch(/Used Cummins sets in Kenya are priced unit by unit/);
    expect(price.answer).not.toMatch(/pre-owned|certified|\{location\}/i);
  });

  it('visible FAQ range equals the range the Product schema declares', () => {
    const band = publishedPriceRange()!;
    const s = confirmedSpan();
    expect(band.low).toBe(s.lowKes);
    expect(band.high).toBe(s.highKes);
  });

  it('Product schema is attributed to VOLTKA whenever it carries prices', () => {
    const page = readFileSync(join(__dirname, '..', '..', 'app/brands/[brand]/page.tsx'), 'utf8');
    expect(page).toMatch(/name: priceBand \? 'VOLTKA generators with Cummins engines'/);
    expect(page).toMatch(/name: priceBand \? 'VOLTKA' : brand\.name/);
  });
});
