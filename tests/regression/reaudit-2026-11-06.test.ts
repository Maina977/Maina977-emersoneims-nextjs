/**
 * External re-audit, 6 November 2026: findings confirmed in the code and fixed.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cumminsGenerators, cumminsFuelData } from '@/app/lib/data/cumminsgenerators';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');

describe('re-audit 6 Nov 2026', () => {
  it('A: no page claims published prices include delivery, installation or commissioning', () => {
    const g = read('app/generators/GeneratorsPageClient.tsx') + read('app/generators/GeneratorsStaticSections.tsx');
    expect(g).not.toMatch(/Our pricing includes delivery/);
    expect(g).not.toMatch(/Prices include delivery/);
  });

  it('C: Cummins D5 models are three-phase', () => {
    for (const m of [...cumminsGenerators, ...cumminsFuelData]) {
      if (/C\d+D5$/.test(m.model)) expect(m.phase, m.model).toBe('Three');
    }
  });

  it('C: used-generator figures are labelled as typical, not a unit\'s own', () => {
    expect(read('app/generators/used/page.tsx')).toMatch(/Typical range across this brand&apos;s stock/);
  });

  it('D: the booking page does not say free AI tools are as accurate as a site assessment', () => {
    const b = read('app/booking/page.tsx');
    expect(b).not.toMatch(/just as\s+accurate/);
    expect(b).toMatch(/do not replace an engineer&apos;s inspection/);
  });
});
