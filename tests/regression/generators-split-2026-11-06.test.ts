/**
 * /generators split (2026-11-06): static sections render on the server; the
 * client page receives them ready-made. Guards against them drifting back.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');
const SECTIONS = ['GeneratorBibleHub', 'UrgencySection', 'TransparentPricing', 'WhyChooseUs',
  'BrandComparisonTable', 'GeneratorLeasingSection', 'DownloadsSection', 'GuaranteeSection'];

describe('/generators server/client split', () => {
  it('the route is a server component and the static sections file has no client directive', () => {
    // The directive only counts as the first statement of the file.
    const isClient = (f: string) => /^﻿?\s*['"]use client['"]/.test(read(f));
    expect(isClient('app/generators/page.tsx')).toBe(false);
    expect(isClient('app/generators/GeneratorsStaticSections.tsx')).toBe(false);
    expect(read('app/generators/GeneratorsPageClient.tsx')).toMatch(/^\uFEFF?'use client'/);
  });
  it('every static section is server-rendered and placed exactly once in the client page', () => {
    const client = read('app/generators/GeneratorsPageClient.tsx');
    const page = read('app/generators/page.tsx');
    const stat = read('app/generators/GeneratorsStaticSections.tsx');
    for (const n of SECTIONS) {
      expect(stat, n).toMatch(new RegExp(`export const ${n} = `));
      expect(page, n).toMatch(new RegExp(`${n}: <${n} />`));
      expect(client.split(`{staticSections.${n}}`).length - 1, n).toBe(1);
      expect(client, n).not.toMatch(new RegExp(`const ${n} = `));
    }
  });
  it('the static sections use no hooks, handlers or animation', () => {
    expect(read('app/generators/GeneratorsStaticSections.tsx')).not.toMatch(/useState|useEffect|useRef|onClick=|onChange=|framer-motion|whileInView/);
  });
});
