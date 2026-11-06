/**
 * Owner, 2026-11-06: homepage videos, images and slides must never be changed.
 * The hero section and the /generators slideshow are pinned to their original
 * behaviour (restored the same day). Only the /contact h1 fix remains.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const read = (f: string) => readFileSync(join(__dirname, '..', '..', f), 'utf8');

describe('homepage media is untouched; /contact h1 visible on first paint', () => {
  it('the homepage hero section keeps its original classes', () => {
    expect(read('app/page.tsx')).toMatch(/<section className="hero-full relative min-h-screen bg-black overflow-hidden content-auto">/);
  });
  it('the /generators hero slideshow mounts all slides and rotates every 4 s, as originally built', () => {
    const g = read('app/generators/GeneratorsPageClient.tsx');
    expect(g).toMatch(/GENERATOR_HERO_IMAGES\.map\(\(src, i\) => \(/);
    expect(g).toMatch(/setInterval\(\(\) => setIndex\(\(i\) => \(i \+ 1\) % GENERATOR_HERO_IMAGES\.length\), 4000\)/);
    expect(g).not.toMatch(/i > shown \+ 1/);
  });
  it('the /contact h1 is a plain h1', () => {
    const c = read('app/contact/page.tsx');
    expect(c).toMatch(/<h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">/);
  });
  it('"Two recent jobs" is gone from the homepage', () => {
    expect(read('components/home/RecentWorkSection.tsx')).not.toMatch(/Two recent jobs|Two jobs from this month/);
  });
});
