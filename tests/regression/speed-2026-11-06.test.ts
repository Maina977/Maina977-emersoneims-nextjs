/**
 * Lighthouse (mobile, live site, 2026-11-06) found three render blockers in our
 * own code; each test pins one fix. Measured before: / LCP 3.6 s, /generators
 * 4.8 s, /contact 4.0 s (render delay 3.3 s).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');

describe('render-blocking fixes', () => {
  it('the homepage hero is not content-visibility:auto', () => {
    expect(read('app/page.tsx')).toMatch(/<section className="hero-full relative min-h-screen bg-black overflow-hidden">/);
  });
  it('the /contact h1 is visible on first paint', () => {
    const c = read('app/contact/page.tsx');
    expect(c).toMatch(/<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">/);
    expect(c).not.toMatch(/<m\.h1/);
  });
  it('the /generators hero mounts only the current and next slide', () => {
    const g = read('app/generators/GeneratorsPageClient.tsx');
    expect(g).toMatch(/GENERATOR_HERO_IMAGES\.map\(\(src, i\) => i > shown \+ 1 \? null :/);
    expect(g).toMatch(/\}, 6000\);/);
  });
});
