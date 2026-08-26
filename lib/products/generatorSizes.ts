/**
 * PER-SIZE GENERATOR PAGES — the commercial gap an external audit identified.
 *
 * WHY THIS EXISTS
 * An audit on 2026-08-26 found the site had no product-level pages, while the
 * competitors who rank publish one page per set with a size, a price and a
 * specification. Sampled searches ("generator price in Kenya 30kva") return
 * competitor product URLs and no EmersonEIMS result. /generators is a strong
 * category page and /pricing/generator-prices-kenya carries the whole table,
 * but neither is a page about a 30 kVA generator, which is what the buyer
 * typed.
 *
 * WHAT IS REAL HERE AND WHAT IS DELIBERATELY ABSENT
 * Real, and sourced:
 *   - kVA, phase and price range — published on /generators, verified by value
 *   - kW at 0.8 power factor — arithmetic, the standard genset convention
 *   - Brand and supply route (Cummins via Voltka) and warranty terms — from
 *     lib/brands/cumminsData.ts, which the owner maintains
 *
 * Deliberately ABSENT, because we do not have verified figures and a made-up
 * datasheet is worse than none:
 *   - engine and alternator model numbers
 *   - fuel consumption at load
 *   - dimensions, weight, sound level
 * Each page says plainly that those are confirmed on quotation for the actual
 * set offered. That is honest, and it still beats having no page at all.
 *
 * NOT AN AUTHORISED DEALER. cumminsData.ts records dealerStatus as
 * 'Sales & Service' and that wording is load-bearing — the claim of official
 * manufacturer appointment has resurfaced repeatedly and must not reappear.
 */

export interface GeneratorSize {
  /** URL slug, e.g. '30-kva'. */
  slug: string;
  kva: number;
  phase: 'single' | 'three';
  /** Exactly as published on /generators. */
  priceRange: string;
  /** Who the source page says it suits. */
  suits: string;
  /** Flagged on the source page as a common choice. */
  popular?: boolean;
  /** One concrete, checkable load example for this size. */
  loadExample: string;
}

/** kW at the 0.8 power factor gensets are rated to. Arithmetic, not a claim. */
export function kwFromKva(kva: number): number {
  return Math.round(kva * 0.8);
}

export const GENERATOR_SIZES: readonly GeneratorSize[] = [
  {
    slug: '10-kva', kva: 10, phase: 'single', priceRange: 'KES 280,000 – 350,000',
    suits: 'Shops, small offices and homes',
    loadExample: 'Lighting, a few computers, a fridge and a small pump — not an electric cooker or a welding set.',
  },
  {
    slug: '15-kva', kva: 15, phase: 'three', priceRange: 'KES 380,000 – 450,000',
    suits: 'Small offices and workshops',
    loadExample: 'A small workshop with a single three-phase machine, or an office floor with servers.',
  },
  {
    slug: '20-kva', kva: 20, phase: 'three', priceRange: 'KES 480,000 – 580,000',
    suits: 'Small commercial premises',
    loadExample: 'A restaurant kitchen, a small clinic, or a borehole pump plus lighting.',
  },
  {
    slug: '30-kva', kva: 30, phase: 'three', priceRange: 'KES 650,000 – 780,000', popular: true,
    suits: 'Small business and clinics',
    loadExample: 'A clinic with theatre lighting and sterilisers, or a supermarket with cold rooms.',
  },
  {
    slug: '50-kva', kva: 50, phase: 'three', priceRange: 'KES 950,000 – 1,150,000',
    suits: 'Medium business, schools',
    loadExample: 'A school with a computer lab and kitchen, or a small hotel with lifts.',
  },
  {
    slug: '60-kva', kva: 60, phase: 'three', priceRange: 'KES 1,100,000 – 1,350,000',
    suits: 'Medium commercial',
    loadExample: 'A mid-size office block, or a workshop with several motors starting on the same feed.',
  },
  {
    slug: '80-kva', kva: 80, phase: 'three', priceRange: 'KES 1,400,000 – 1,700,000',
    suits: 'Larger commercial premises',
    loadExample: 'A hotel with laundry and kitchen, or a light manufacturing line.',
  },
  {
    slug: '100-kva', kva: 100, phase: 'three', priceRange: 'KES 1,750,000 – 2,100,000', popular: true,
    suits: 'Hotels, schools, factories',
    loadExample: 'A hospital wing, a factory with a compressor and several motors, or a hotel with full back-of-house.',
  },
  {
    slug: '150-kva', kva: 150, phase: 'three', priceRange: 'KES 2,400,000 – 2,900,000',
    suits: 'Industrial and institutional',
    loadExample: 'A processing plant, or a campus building with lifts, HVAC and laboratories.',
  },
  {
    slug: '200-kva', kva: 200, phase: 'three', priceRange: 'KES 3,200,000 – 3,800,000',
    suits: 'Industrial',
    loadExample: 'A factory floor with multiple large motors, or a data room with full cooling.',
  },
  {
    slug: '250-kva', kva: 250, phase: 'three', priceRange: 'KES 4,000,000 – 4,800,000',
    suits: 'Large industrial',
    loadExample: 'A cold-storage facility, or a hospital carrying theatres and imaging on standby.',
  },
  {
    slug: '300-kva', kva: 300, phase: 'three', priceRange: 'KES 4,800,000 – 5,800,000',
    suits: 'Large industrial',
    loadExample: 'A medium manufacturing plant running its full line on standby power.',
  },
  {
    slug: '500-kva', kva: 500, phase: 'three', priceRange: 'KES 7,500,000 – 9,000,000',
    suits: 'Major industrial facilities',
    loadExample: 'A large plant, a shopping centre, or a facility running several buildings from one set.',
  },
] as const;

export function getGeneratorSize(slug: string): GeneratorSize | undefined {
  return GENERATOR_SIZES.find((g) => g.slug === slug);
}

export function getAllGeneratorSizeSlugs(): string[] {
  return GENERATOR_SIZES.map((g) => g.slug);
}

/** The next size up, for the derate advice — undefined at the top of the range. */
export function nextSizeUp(g: GeneratorSize): GeneratorSize | undefined {
  return GENERATOR_SIZES.find((x) => x.kva > g.kva);
}
