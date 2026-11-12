/**
 * Change Set C v2 (2026-11-12): brand-page Product identity.
 * - Unpriced brands: output identical to the pre-change template formulas.
 * - Priced (Cummins, VOLTKA price band): brand VOLTKA, Cummins as engine maker,
 *   on the parent page and all county variants.
 */
import { describe, it, expect } from 'vitest';
import { GENERATOR_BRANDS } from '@/lib/data/generator-brands';
import { brandProductIdentity, VOLTKA_PRODUCT_DESCRIPTION } from '@/lib/seo/brandProductSchema';

const COUNTIES = ['Kajiado', 'Kiambu', 'Kisumu', 'Machakos', 'Meru', 'Mombasa', 'Nairobi', 'Nakuru', 'Nyeri', 'Uasin Gishu'];

describe('brandProductIdentity', () => {
  it('leaves every unpriced brand exactly as before, on the parent page and county variants', () => {
    for (const b of GENERATOR_BRANDS) {
      expect(brandProductIdentity(b, false)).toEqual({
        name: `${b.name} Generators`, description: b.description, brand: { '@type': 'Brand', name: b.name },
      });
      for (const c of COUNTIES) {
        expect(brandProductIdentity(b, false, c)).toEqual({
          name: `${b.name} Generators in ${c}`, description: `${b.description}. Available in ${c}, Kenya.`, brand: { '@type': 'Brand', name: b.name },
        });
      }
    }
  });

  it('attributes the VOLTKA price band to VOLTKA with Cummins as the engine manufacturer', () => {
    const cummins = GENERATOR_BRANDS.find((b) => b.slug === 'cummins')!;
    const parent = brandProductIdentity(cummins, true);
    expect(parent.name).toBe('VOLTKA generators with Cummins engines');
    expect(parent.brand.name).toBe('VOLTKA');
    expect(parent.description).toBe(VOLTKA_PRODUCT_DESCRIPTION);
    expect(parent.additionalProperty).toEqual([{ '@type': 'PropertyValue', name: 'Engine manufacturer', value: 'Cummins' }]);
    for (const c of COUNTIES) {
      const v = brandProductIdentity(cummins, true, c);
      expect(v.name).toBe(`VOLTKA generators with Cummins engines in ${c}`);
      expect(v.brand.name).toBe('VOLTKA');
      expect(v.description).toBe(`${VOLTKA_PRODUCT_DESCRIPTION} Available in ${c}, Kenya.`);
    }
  });

  it('adds no model numbers, ratings, reviews, warranties or new prices', () => {
    const s = JSON.stringify(brandProductIdentity({ name: 'Cummins', description: 'x' }, true, 'Nairobi'));
    expect(s).not.toMatch(/\b[0-9]{2,}\b|rating|review|warranty|certif|KES/i);
  });
});
