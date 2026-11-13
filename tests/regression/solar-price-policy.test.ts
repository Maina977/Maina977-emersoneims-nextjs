/**
 * Management decision 2026-11-13, item 4: show only prices with an
 * identifiable source, verification date, currency and VAT status; otherwise
 * "Request a quotation" or the customer's own figures, labelled as such.
 * The solar rates in lib/solar/sizing.ts have no source, so they must not
 * reach a customer. Never invent prices or tariffs.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NextRequest } from 'next/server';
import { sizeSolar, publicSizing, pricesVerified, PRICE_BASIS, REQUEST_QUOTATION } from '@/lib/solar/sizing';
import { POST as calculate } from '@/app/api/solar/calculate/route';

const root = join(__dirname, '..', '..');
const src = (f: string) => readFileSync(join(root, f), 'utf8');

describe('price basis', () => {
  it('the current rates are recorded as unverified (no source, no date)', () => {
    expect(PRICE_BASIS.source).toBeNull();
    expect(PRICE_BASIS.verifiedOn).toBeNull();
    expect(pricesVerified()).toBe(false);
    expect(PRICE_BASIS.currency).toBe('KES');
    expect(PRICE_BASIS.vat).toMatch(/VAT/);
  });
});

describe('publicSizing', () => {
  const sized = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.5, systemType: 'hybrid', nightUsePct: 40 });

  it('no tariff, no cost: no price, no saving, no payback, "Request a quotation"', () => {
    const p = publicSizing(sized, { tariffGiven: false });
    expect(p.cost).toBeNull();
    expect(p.monthlySavingKes).toBeNull();
    expect(p.paybackYears).toBeNull();
    expect(p.pricing.status).toBe('request-quotation');
    expect(p.assumptions.join(' ')).toMatch(new RegExp(REQUEST_QUOTATION));
    expect(p.assumptions.join(' ')).not.toMatch(/KES [\d,]{4,}|Prices are typical|Payback range|Tariff assumed/);
  });

  it('customer tariff and quoted cost: saving and payback from their figures, labelled', () => {
    const tariffed = sizeSolar({ monthlyKwh: 600, pshAnnual: 5.5, systemType: 'hybrid', nightUsePct: 40, tariffKesPerKwh: 28 });
    const p = publicSizing(tariffed, { tariffGiven: true, customerCostKes: 900_000 });
    expect(p.cost).toBeNull(); // still no EmersonEIMS price
    expect(p.monthlySavingKes).toBe(Math.round(tariffed.annualSavingKes / 12));
    expect(p.paybackYears).toBeCloseTo(900_000 / tariffed.annualSavingKes, 1);
    expect(p.pricing.userProvided).toEqual(['tariff', 'installed cost']);
    expect(p.assumptions.join(' ')).toMatch(/your figure \(a user-provided assumption\)/);
  });
});

describe('/api/solar/calculate', () => {
  const post = (body: Record<string, unknown>) => calculate(new NextRequest('http://localhost/api/solar/calculate', {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
  }));

  it('returns no price and no assumed-tariff saving when the customer gives none', async () => {
    const j = await (await post({ consumption: 600, location: 'nairobi', systemType: 'hybrid' })).json();
    expect(j.pvKwp).toBeGreaterThan(0); // the engineering still works
    expect(j.cost).toBeNull();
    expect(j.totalCost).toBeNull();
    expect(j.monthlySaving).toBeNull();
    expect(j.paybackYears).toBeNull();
    expect(j.pricing.status).toBe('request-quotation');
  });

  it('a large user no longer gets an assumed commercial tariff', async () => {
    const j = await (await post({ consumption: 20000, location: 'nairobi', systemType: 'grid-tied' })).json();
    expect(j.monthlySaving).toBeNull();
  });

  it('uses the customer tariff and quoted cost; rejects an impossible quoted cost', async () => {
    const j = await (await post({ consumption: 600, location: 'nairobi', systemType: 'hybrid', tariff: 28, installedCostKes: 900000 })).json();
    expect(j.monthlySaving).toBeGreaterThan(0);
    expect(j.paybackYears).toBeGreaterThan(0);
    expect(j.pricing.userProvided).toContain('installed cost');
    const bad = await post({ consumption: 600, location: 'nairobi', systemType: 'hybrid', installedCostKes: 5 });
    expect(bad.status).toBe(400);
  });
});

describe('no screen shows an unsourced price or an assumed tariff', () => {
  it('no default tariff or diesel price is pre-filled or substituted', () => {
    for (const f of ['components/solar/SolarDesignStudioPro.tsx', 'components/solar/SolarROICalculator.tsx', 'components/solar-modules/crc/src/pages/CalculatorPage.tsx']) {
      expect(src(f), f).not.toMatch(/DEFAULT_TARIFF_KES_PER_KWH|DEFAULT_DIESEL_KES_PER_LITRE/);
    }
  });
  it('every screen that can price a system checks pricesVerified() first', () => {
    for (const f of [
      'app/solar/page.tsx', 'components/solar/SolarDesignStudioPro.tsx', 'components/solar/SolarROICalculator.tsx',
      'components/solar/SolarBibleEngine.tsx', 'components/solar-modules/crc/src/pages/DesignerPage.tsx',
      'components/solar-modules/crc/src/pages/QuoteCheckerPage.tsx', 'components/solar-modules/crc/src/pages/ReportPage.tsx',
      'components/solar-modules/crc/core/calculator/SolarCalculatorEngine.ts',
    ]) expect(src(f), f).toMatch(/pricesVerified\(\)/);
  });
  it('the SEO FAQ and /solar copy quote no price figures', () => {
    expect(src('components/seo/ToolSeoContent.tsx')).not.toMatch(/HOME_FROM|HOME_TO|estimateInstalledCost/);
    expect(src('app/solar/page.tsx')).not.toMatch(/PAYBACK_RANGE|KES 22-28 per kWh|starts at about KES/);
  });
  it('the finance dashboard has no sample capex or saving figures', () => {
    expect(src('components/solar-modules/crc/components/AdvancedFeaturesDashboard.tsx')).not.toMatch(/1247500|240000|4500000|1200000/);
  });
});
