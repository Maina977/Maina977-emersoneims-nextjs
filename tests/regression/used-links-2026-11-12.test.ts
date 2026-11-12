/**
 * Change Set D (2026-11-12): contextual links to /generators/used from the
 * pages where a buyer weighs a make or a size. Deliberately NOT sitewide.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');

describe('used-stock contextual links', () => {
  it.each([
    ['app/generators/cummins/page.tsx', 'Cummins'],
    ['app/generators/perkins/page.tsx', 'Perkins'],
    ['app/generators/caterpillar/page.tsx', 'Caterpillar'],
    ['app/generators/volvo-penta/page.tsx', 'Volvo Penta'],
  ])('%s links to the used stock for %s', (file, make) => {
    const s = read(file);
    expect(s).toContain(`Looking for a used ${make} set?`);
    expect(s).toContain('href="/generators/used"');
    // No blanket warranty promise in the link text: terms are per unit.
    expect(s).toContain('the warranty terms for each unit are on its quotation');
    expect(s).not.toMatch(/unit by unit, each with a 2-year warranty/);
  });

  it('every size page offers the used alternative', () => {
    expect(read('app/generators/sizes/[size]/page.tsx')).toMatch(/href="\/generators\/used"[\s\S]{0,200}Used generators, unit by unit/);
  });

  it('is not added to the sitewide footer', () => {
    expect(read('components/layout/PremiumFooter.tsx')).not.toContain("'/generators/used'");
  });
});
