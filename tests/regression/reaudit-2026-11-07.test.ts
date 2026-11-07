/**
 * External re-audit, 7 November 2026: one test per corrected finding.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  VOLTKA_PRICE_BASIS, VOLTKA_PRICE_EXCLUSIONS, voltkaEstimateKes, confirmedPriceFor,
} from '@/lib/pricing/voltkaConfirmedPrices';
import { getAllIndustries } from '@/lib/seo/industryData';
import { PRODUCT_WARRANTY, COMMERCIAL_POLICY } from '@/lib/commercial/policy';
import { GENERATOR_WARRANTIES } from '@/lib/data/warranties';
import {
  USED_GENERATOR_STOCK, isPublishableUnit, publishableStock, type UsedGeneratorUnit,
} from '@/lib/inventory/usedGeneratorStock';
import { FOUNDING_YEAR } from '@/lib/business/companyFacts';
import { getIndexableKenyaUrls, SUBMIT_CONSTITUENCY_PAGES } from '@/lib/seo/kenyaIndexable';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');

describe('1. one generator price source, exclusions named', () => {
  it('the price basis names VAT, ATS, delivery, installation and commissioning', () => {
    for (const w of ['VAT', 'ATS', 'delivery', 'installation', 'commissioning']) expect(VOLTKA_PRICE_BASIS.toLowerCase()).toContain(w.toLowerCase());
    expect(VOLTKA_PRICE_EXCLUSIONS).toHaveLength(5);
  });

  it('calculator estimate uses the next confirmed size up and never extrapolates', () => {
    expect(voltkaEstimateKes(250)).toEqual({ kes: 3_100_000, basisKva: 250 });
    expect(voltkaEstimateKes(180)).toEqual({ kes: 2_800_000, basisKva: 200 });
    expect(voltkaEstimateKes(800)).toBeNull();
    expect(read('app/calculators/page.tsx')).not.toMatch(/\* 200000/);
  });

  it('industry packages quote a generator only from the confirmed list or "Request current price"', () => {
    for (const ind of getAllIndustries()) {
      for (const sol of (ind as { solutions?: { price?: string; title?: string }[] }).solutions ?? []) {
        const p = sol.price ?? '';
        // UPS, solar and switchgear packages are rated in kVA too; only generator sets are checked here.
        if (!/kva/i.test(p) || /UPS|solar|ATS|ATM|power factor/i.test(sol.title ?? '')) continue;
        const m = p.match(/^VOLTKA (\d+) kVA from KES ([\d,]+) \(open frame/);
        expect(m, p).not.toBeNull();
        expect(confirmedPriceFor(Number(m![1]))?.openKes, p).toBe(Number(m![2].replace(/,/g, '')));
      }
    }
  });

  it('no file still carries the removed conflicting generator prices', () => {
    expect(read('lib/services/serviceBibles.ts')).not.toMatch(/new set KES 4\.5M/);
    expect(read('lib/data/blog-articles.ts')).not.toMatch(/5kVA diesel \(KES 180,000|20kVA Generator \| KES 600,000/);
    expect(read('app/blog/ups-vs-generator-which-is-right/page.tsx')).not.toMatch(/Generator \(25 kVA\): KES 1\.5M/);
    expect(read('app/faq/page.tsx')).not.toMatch(/\(20-50kVA\) KES 50,000-100,000/);
  });
});

describe('2. warranty and free servicing', () => {
  it('the sitewide FAQ schema states the confirmed terms', () => {
    const f = read('components/seo/FAQSchema.tsx');
    expect(f).not.toMatch(/6 months of free maintenance|12-month warranty|warranties ranging from 12-24 months/);
    expect(f).toMatch(/2-year warranty covering the engine, alternator and control system, plus 1 year of free servicing/);
  });

  it('used-generator cover is stated per unit', () => {
    expect(PRODUCT_WARRANTY['used-generator'].duration).toBe('2 years');
    expect(PRODUCT_WARRANTY['used-generator'].partsCovered).toMatch(/each unit/i);
    expect(GENERATOR_WARRANTIES.used[0].coverage.join(' ')).not.toMatch(/3-month free maintenance|Fully load-tested/);
    expect(COMMERCIAL_POLICY.newSetTermsLine).toBe('2-year warranty and 1 year free servicing on new generator sets');
  });
});

describe('3. delivery and installation promises', () => {
  const files = [
    'app/generator-parts/page.tsx', 'app/generator-parts/layout.tsx', 'app/generators/leasing/page.tsx',
    'app/generators/rental/page.tsx', 'app/generators/rental/layout.tsx', 'app/generators/spare-parts/page.tsx',
    'app/gallery/page.tsx', 'app/east-africa/page.tsx', 'components/seo/FAQSchema.tsx',
    'components/solar/SolarProductsShop.tsx', 'components/generators/ConversionCTAHub.tsx',
    'components/calculators/GeneratorSizingCalculator.tsx', 'lib/seo/industryData.ts', 'lib/data/seo-services.ts',
  ];
  it.each(files)('%s makes no unconfirmed delivery or installation-time promise', (f) => {
    const s = read(f);
    expect(s).not.toMatch(/same[- ]day delivery|delivered same day|48 ?hrs?\b|next-day mombasa|within 48-72 hours|within 3-5 business days|within 5-10 days|before 12pm|ship same-day/i);
  });
});

describe('4. used-generator catalogue', () => {
  const unit: UsedGeneratorUnit = {
    stockId: 'EIMS-U-99', title: 'Perkins test set', enclosure: 'canopied',
    photos: ['/images/used-stock/test.webp'], photographedOn: '2026-11-04', warrantyCoverage: 'Engine and alternator',
  };
  it('a unit needs a reference, title, photo, photo date and warranty cover to be shown', () => {
    expect(isPublishableUnit(unit)).toBe(true);
    expect(isPublishableUnit({ ...unit, photos: [] })).toBe(false);
    expect(isPublishableUnit({ ...unit, stockId: '' })).toBe(false);
    expect(isPublishableUnit({ ...unit, photographedOn: 'recently' })).toBe(false);
    expect(isPublishableUnit({ ...unit, engineHours: 2269 })).toBe(false); // hours without the date read
    expect(isPublishableUnit({ ...unit, engineHours: 2269, hoursReadOn: '2026-11-04' })).toBe(true);
    expect(isPublishableUnit({ ...unit, testRecord: { date: '2026-11-02', loadPercent: 75, durationHours: 2, reportRef: '' } })).toBe(false);
  });
  it('the owner-supplied units carry no invented hours, prices or ratings', () => {
    expect(USED_GENERATOR_STOCK.length).toBe(8);
    for (const u of USED_GENERATOR_STOCK) {
      expect(u.engineHours, u.stockId).toBeUndefined();
      expect(u.priceKes, u.stockId).toBeUndefined();
      if (u.rating) expect(u.rating, u.stockId).toMatch(/\(rating plate\)$/);
      for (const ph of u.photos) expect(existsSync(join(__dirname, '..', '..', 'public', ph)), ph).toBe(true);
    }
  });
  it('every unit in stock is publishable (nothing half-filled ships)', () => {
    expect(publishableStock()).toHaveLength(USED_GENERATOR_STOCK.length);
  });
  it('the six /specs/used pages redirect and are not in the sitemap', () => {
    expect(read('next.config.ts')).toMatch(/source: '\/specs\/used\/:brand\*',\s*destination: '\/generators\/used'/);
    expect(read('app/sitemap.ts')).not.toMatch(/specs\/used\/\$\{brand\}/);
  });
});

describe('5. partner marketplace', () => {
  it('makes no financial or verification undertaking it cannot back', () => {
    const m = read('app/marketplace/page.tsx').replace(/\/\*[\s\S]*?\*\//g, '');
    expect(m).not.toMatch(/automatic compensation|at no additional cost to you|we take responsibility|All partners carry liability insurance|We verify every partner/i);
    expect(m).toMatch(/No partners are listed yet/);
    expect(read('next.config.ts')).toMatch(/source: '\/marketplace\/partners\/:slug\*'/);
  });
});

describe('6. brand comparisons', () => {
  it('no star ratings in the brand tables', () => {
    expect(read('app/generators/GeneratorsStaticSections.tsx')).not.toMatch(/⭐/);
    expect(read('app/resources/buying-guides/page.tsx')).not.toMatch(/⭐/);
  });
});

describe('7. founding date and experience', () => {
  it('2011 everywhere a founding year is shown', () => {
    expect(FOUNDING_YEAR).toBe(2011);
    expect(read('app/about-us/page.tsx')).toMatch(/Est\. 2011/);
    for (const f of ['app/about-us/page.tsx', 'app/solutions/fabrication/page.tsx', 'app/solutions/high-voltage/page.tsx', 'components/sections/TrustBadgesSection.tsx']) {
      expect(read(f), f).not.toMatch(/Est\. 2013|value: ["']2012["']/);
    }
  });
  it('no unmeasured technician-experience numbers', () => {
    expect(read('app/team/page.tsx')).not.toMatch(/\d\+ years average|15 years of expertise/);
    expect(read('app/faults/page.tsx')).not.toMatch(/15\+ years of combined/);
    expect(read('lib/maintenance-hub/enhanced-services-data.ts')).not.toMatch(/15 years of combined experience/);
  });
});

describe('8. solar inverter content', () => {
  it('no false standards, climate figures or unconfirmed install counts', () => {
    const s = read('app/services/solar-inverters/page.tsx');
    expect(s).not.toMatch(/NRPOT|Kenya's 4[05]°C climate|2000\+ solar systems|467,200 kWh|100°C heatsink is normal|within 100ms/);
    expect(s).toMatch(/not any manufacturer&apos;s codes/);
    expect(read('components/visualizations/PerformanceGraphs.tsx')).not.toMatch(/output: 110/);
  });
});

describe('11. constituency pages', () => {
  it('are no longer submitted in the sitemap', () => {
    expect(SUBMIT_CONSTITUENCY_PAGES).toBe(false);
    expect(getIndexableKenyaUrls().filter((p) => p.split('/').filter(Boolean).length === 3)).toHaveLength(0);
    expect(getIndexableKenyaUrls().filter((p) => p.split('/').filter(Boolean).length === 2)).toHaveLength(47);
  });
});
