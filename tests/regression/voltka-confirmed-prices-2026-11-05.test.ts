/**
 * VOLTKA generator prices confirmed by the owner on 2026-11-05.
 * New VOLTKA, prime rated, ex-warehouse, excluding VAT; other sizes
 * "Request current price". Changing a figure here needs the owner's word.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  VOLTKA_CONFIRMED_PRICES,
  priceTextFor,
  confirmedSpan,
  REQUEST_CURRENT_PRICE,
  kes,
  kesMillions,
} from '@/lib/pricing/voltkaConfirmedPrices';
import { SEED_CATALOG } from '@/lib/pricing/catalog';
import { CUMMINS_BRAND_INFO } from '@/lib/brands/cumminsData';
import { PRICE_GUIDES } from '@/lib/pricing/publishedPrices';

const OWNER_LIST: [number, number | undefined, number][] = [
  [100, 2_100_000, 2_500_000],
  [125, 2_200_000, 2_600_000],
  [150, 2_300_000, 2_700_000],
  [200, 2_800_000, 3_000_000],
  [250, 3_100_000, 3_500_000],
  [312, 4_000_000, 4_100_000],
  [375, 4_400_000, 4_800_000],
  [500, undefined, 6_000_000],
  [750, undefined, 9_100_000],
];

describe('confirmed VOLTKA prices', () => {
  it('match the owner list exactly', () => {
    expect(VOLTKA_CONFIRMED_PRICES.map((p) => [p.kva, p.openKes, p.silentKes])).toEqual(OWNER_LIST);
  });

  it('format display text and fall back to request-current-price', () => {
    expect(priceTextFor(100)).toBe('Open frame KES 2,100,000 · Silent KES 2,500,000');
    expect(priceTextFor(500)).toBe('Silent KES 6,000,000');
    expect(priceTextFor(10)).toBe(REQUEST_CURRENT_PRICE);
    expect(priceTextFor(300)).toBe(REQUEST_CURRENT_PRICE);
    expect(kes(9_100_000)).toBe('KES 9,100,000');
    expect(kesMillions(2_100_000)).toBe('KES 2.1M');
    expect(kesMillions(3_000_000)).toBe('KES 3M');
    expect(confirmedSpan()).toEqual({ minKva: 100, maxKva: 750, lowKes: 2_100_000, highKes: 9_100_000 });
  });

  it('catalog VOLTKA items are the confirmed sizes only', () => {
    const v = SEED_CATALOG.filter((i) => i.category === 'generator-new');
    expect(v.map((i) => i.spec?.split(' ')[0])).toEqual(OWNER_LIST.map(([k]) => String(k)));
    const v100 = v.find((i) => i.id === 'voltka-100kva')!;
    expect([v100.priceFromKes, v100.priceToKes]).toEqual([2_100_000, 2_500_000]);
    const v750 = v.find((i) => i.id === 'voltka-750kva')!;
    expect([v750.priceFromKes, v750.priceToKes]).toEqual([9_100_000, undefined]);
  });

  it('brand data and schema follow the list', () => {
    expect(CUMMINS_BRAND_INFO.models.map((m) => m.kva)).toEqual(OWNER_LIST.map(([k]) => k));
    const offers = (CUMMINS_BRAND_INFO.structuredData as { offers: Record<string, string> }).offers;
    expect([offers.lowPrice, offers.highPrice, offers.offerCount]).toEqual(['2100000', '9100000', '9']);
  });

  it('the generator price guide shows only confirmed figures', () => {
    const g = PRICE_GUIDES.find((x) => x.slug === 'generator-prices-kenya')!;
    const allowed = new Set(OWNER_LIST.flatMap(([, o, s]) => [o, s]).filter(Boolean).map((n) => kes(n!)));
    for (const r of g.rows) {
      const figs = r.price.match(/KES [\d,]+/g) ?? [];
      if (!figs.length) expect(r.price).toBe(REQUEST_CURRENT_PRICE);
      for (const f of figs) expect(allowed.has(f), `${r.item}: ${f}`).toBe(true);
    }
  });

  it('no rendered copy still says the old "from KES 280,000"', () => {
    const root = join(__dirname, '..', '..');
    const files = [
      'app/page.tsx', 'app/layout.tsx', 'app/generators/page.tsx', 'app/generators/layout.tsx',
      'app/voltka/page.tsx', 'components/generators/GeneratorPriceList.tsx', 'lib/pricing/publishedPrices.ts',
      'lib/data/generator-brands.ts', 'components/seo/AdvancedSEO.tsx', 'lib/seo/industryData.ts',
      'components/seo/FAQSchema.tsx', 'components/seo/EnhancedSchemaMarkup.tsx', 'components/ai/SallyAIAssistant.tsx',
      'app/components/home/CumminsShopNow.tsx', 'lib/brands/cumminsData.ts',
    ];
    for (const f of files) {
      // Comments keep the history; strip them before checking what renders.
      const code = readFileSync(join(root, f), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
        .split('\n')
        .filter((l) => !l.trim().startsWith('//'))
        // A pump VSD retrofit in the price guides is also KES 280,000; not a generator.
        .filter((l) => !/VSD retrofit/.test(l))
        .join('\n');
      expect(/280,000/.test(code), f).toBe(false);
      expect(/Free Delivery/.test(code), f).toBe(false);
    }
  });

  it('meta description for /generators fits what Google shows', () => {
    const src = readFileSync(join(__dirname, '..', '..', 'app/generators/layout.tsx'), 'utf8');
    const m = /\n {2}description: "([^"]+)"/.exec(src);
    expect(m).not.toBeNull();
    expect(m![1].length).toBeLessThanOrEqual(160);
  });
});
