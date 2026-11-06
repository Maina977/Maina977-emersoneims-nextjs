/**
 * Owner answers of 2026-11-06:
 *  - routing: generator@ for generators, solar@ for solar, info@ for all
 *  - warranty: 2 years on generator sales; 6 months on rewinding and all other
 *    repairs and services
 *  - founding year 2013
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { departmentRecipients, routedRecipients } from '@/lib/leads/routing';

const root = join(__dirname, '..', '..');
const code = (f: string) =>
  readFileSync(join(root, f), 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');

describe('lead routing', () => {
  it('sends generator and solar leads to their desk, info@ always kept', () => {
    const base = ['info@emersoneims.com', 'sally@emersoneims.com'];
    expect(routedRecipients(base, { service: 'generators', source: 'generator-size-100-kva' }))
      .toEqual([...base, 'generators@emersoneims.com']);
    expect(routedRecipients(base, { service: 'Solar Installation' })).toEqual([...base, 'solar@emersoneims.com']);
    expect(routedRecipients(base, { service: 'UPS Systems' })).toEqual(base);
    expect(routedRecipients(base, { service: 'Motor Rewinding' })).toEqual(base);
  });

  it('reads the message only on general forms', () => {
    expect(departmentRecipients({ service: 'general', message: 'Need a 200 kVA set for a school' })).toEqual(['generators@emersoneims.com']);
    expect(departmentRecipients({ service: 'Plumbing', message: 'pipe to the generator room' })).toEqual([]);
    expect(departmentRecipients({ service: 'general', message: 'solar with generator backup' }))
      .toEqual(['generators@emersoneims.com', 'solar@emersoneims.com']);
  });

  it('never duplicates an address already in the list', () => {
    expect(routedRecipients(['info@emersoneims.com', 'Solar@emersoneims.com'], { service: 'solar' }))
      .toEqual(['info@emersoneims.com', 'Solar@emersoneims.com']);
  });

  it('the lead email uses the routed list', () => {
    expect(code('app/api/contact/route.ts')).toMatch(/to: routedRecipients\(LEAD_RECIPIENTS, data\)/);
  });
});

describe('warranty terms', () => {
  const FILES = [
    'lib/services/allServices.ts', 'lib/data/seo-services.ts', 'lib/b2b/pageProfiles.ts',
    'components/seo/ToolSeoContent.tsx', 'app/services/layout.tsx', 'app/solar/page.tsx',
    'app/maintenance-hub/general/page.tsx', 'app/solutions/ac/page.tsx', 'components/service/MotorRewinding.tsx',
    'app/generators/maintenance/page.tsx', 'components/service/CrossServiceOptimizers.tsx',
    'lib/maintenance-hub/comprehensive-services-data.ts', 'lib/maintenance-hub/enhanced-services-part2.ts',
    'lib/maintenance-hub/enhanced-services-part3.ts', 'lib/services/serviceBibles.ts', 'components/cta/EmergencyCTA.tsx',
  ];
  it('no other repair/service/workmanship warranty period is stated', () => {
    const BAD = [/2-year workmanship/i, /two-year warranty/i, /2 years on workmanship/i, /12-month warranty/i,
      /30-day warranty/i, /90 days on repairs/i, /12-24 months warranty/i, /Workmanship (warranty )?12 months/i,
      /1 year for repairs/i, /up to 5 yr/i, /sub: 'On workmanship'/];
    for (const f of FILES) {
      const c = code(f);
      for (const re of BAD) expect(re.test(c), `${f}: ${re}`).toBe(false);
    }
  });
});

describe('founding year (owner corrected 2026-11-06: 2011)', () => {
  it('2011 everywhere the site states it; no 2012 or 2013', () => {
    for (const f of ['app/layout.tsx', 'components/seo/StructuredData.tsx', 'app/generators/GeneratorsPageClient.tsx', 'app/generators/GeneratorsStaticSections.tsx',
      'components/cta/UnifiedCTA.tsx', 'components/sections/TrustBadgesSection.tsx', 'app/team/page.tsx',
      'app/east-africa/page.tsx', 'app/about-us/page.tsx', 'components/layout/SciFiFooter.tsx',
      'app/calculators/page.tsx', 'lib/content/premiumCopywriting.ts', 'components/about/AboutCapabilityDeepDive.tsx']) {
      const c = code(f);
      expect(/[Ss]ince 201[23]\b|>201[23]<|"2013", event: "Founded"|foundingDate.{0,4}2013/.test(c), f).toBe(false);
    }
    expect(code('app/layout.tsx')).toMatch(/"foundingDate": "2011-03-01"/);
  });
});

describe('installation warranty (owner 2026-11-06: solar, plumbing, AC, incinerators = 1 year)', () => {
  it('installations say 1 year; repairs keep 6 months', () => {
    const solar = code('app/solar/page.tsx');
    expect(solar).toMatch(/installation workmanship carries a 1-year warranty/);
    expect(solar).toMatch(/\['1 year', 'Installation workmanship warranty'\]/);
    expect(solar).not.toMatch(/6-Month Workmanship Warranty/);
    expect(code('app/solutions/incinerators/page.tsx')).toMatch(/1-year warranty on installation; 6 months on service work/);
    const svc = code('lib/services/allServices.ts');
    expect(svc).toMatch(/1-year EmersonEIMS warranty on installation; 6 months on service work/);
    expect(svc).toMatch(/1-year warranty on installations, 6 months on repairs/);
    const bibles = code('lib/services/serviceBibles.ts');
    expect(bibles).toMatch(/Workmanship 1 year on installations, 6 months on repairs/);
    expect(bibles).toMatch(/1-year EmersonEIMS warranty on installation; 6 months on repairs/);
    const seo = code('lib/data/seo-services.ts');
    expect(seo).toMatch(/Our installation workmanship in \{location\} carries a 1-year warranty/);
    expect(seo).toMatch(/burst pipes, blocked drains[^']*6-month warranty on our workmanship/);
  });

  it('UPS, borehole-pump and distribution-board installations also 1 year', () => {
    const svc = code('lib/services/allServices.ts');
    expect(svc).not.toMatch(/6-month EmersonEIMS warranty on installation/);
    const bibles = code('lib/services/serviceBibles.ts');
    expect(bibles).toMatch(/'Workmanship warranty 1 year on installations, 6 months on repairs'/);
    expect(bibles).not.toMatch(/'Workmanship 6 months',/);
    expect(code('lib/maintenance-hub/enhanced-services-part3.ts')).toMatch(/1 year on installations, 6 months on repairs, manufacturer warranty on materials/);
    expect(code('app/maintenance-hub/general/page.tsx')).toMatch(/'1-year installation warranty'/);
  });
});

describe('generator warranty (owner 2026-11-06: 2 years on all generators sold)', () => {
  it('used generators carry 2 years too', async () => {
    expect(code('app/generators/used/page.tsx')).not.toMatch(/warranty: "(1 year|6 months)/);
    expect(code('app/generators/used/layout.tsx')).toMatch(/2-year warranty/);
    expect(code('app/resources/buying-guides/page.tsx')).not.toMatch(/1-year comprehensive warranty/);
    const { GENERATOR_WARRANTIES } = await import('@/lib/data/warranties');
    expect(GENERATOR_WARRANTIES.used[0].duration).toBe('2 Years');
  });
});
