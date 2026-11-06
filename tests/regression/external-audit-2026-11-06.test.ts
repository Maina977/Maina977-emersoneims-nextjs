/**
 * Findings of the external website audit (November 2026), confirmed in the
 * code on 2026-11-06 and fixed. Each test pins one finding.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CUMMINS_BRAND_INFO } from '@/lib/brands/cumminsData';

const root = join(__dirname, '..', '..');
const read = (f: string) => readFileSync(join(root, f), 'utf8');
const code = (f: string) =>
  read(f)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');

describe('external audit, November 2026', () => {
  it('P1: the Cummins banner shows only confirmed prices', () => {
    const src = code('components/brands/CumminsBanner.tsx');
    for (const old of ["'KES 5.5M'", "'KES 9.5M'", "'KES 500K'", "'KES 1.6M'", "'KES 2.3M'", "'KES 16M'"]) {
      expect(src.includes(old), old).toBe(false);
    }
    expect(src).toMatch(/confirmedPriceFor\(kva\)/);
  });

  it('P2: one warranty and one free-servicing period', () => {
    expect(CUMMINS_BRAND_INFO.warranty.years).toBe(2);
    expect(CUMMINS_BRAND_INFO.freeService.years).toBe(1);
    expect(code('app/generators/GeneratorsPageClient.tsx') + code('app/generators/GeneratorsStaticSections.tsx')).not.toMatch(/first 6 months/);
  });

  it('P3: no overnight nationwide delivery-and-commissioning promise', () => {
    expect(code('components/home/VoltkaShowroomGrid.tsx')).not.toMatch(/commission overnight/);
  });

  it('P6: no stale "this month" and no tripled CONTACT heading', () => {
    expect(code('components/home/RecentWorkSection.tsx')).not.toMatch(/from this month/);
    const contact = code('app/contact/page.tsx');
    expect(contact).not.toMatch(/<GlitchText/);
    expect(contact).not.toMatch(/COMMAND CENTER/);
  });

  it('incinerators: no blanket "NEMA compliant" claim', () => {
    expect(code('lib/services/allServices.ts')).not.toMatch(/NEMA Compliant'|NEMA compliant systems|NEMA compliant\./);
    expect(code('app/services/page.tsx')).not.toMatch(/NEMA-compliant/);
  });
});
