/**
 * Release 1: one index policy for every template location route. Unprotected
 * pages become self-canonical + noindex, follow; protected pages and county
 * hubs keep their metadata exactly; nothing else on the page changes.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import protectedList from '@/lib/seo/templateIndexProtected.json';
import keep from '@/lib/seo/locationKeepIndexed.json';
import { applyTemplateIndexPolicy, isProtectedTemplatePage } from '@/lib/seo/templateIndexPolicy';

const SITE = 'https://www.emersoneims.com';
const root = join(__dirname, '..', '..');
const before = {
  title: 't',
  description: 'd',
  alternates: { canonical: `${SITE}/sectors/homes` },
  openGraph: { title: 'og', url: `${SITE}/sectors/homes` },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-snippet': -1 } },
};

describe('template index policy', () => {
  it('excludes an unprotected template page with one consistent signal', () => {
    for (const p of ['/sectors/homes/kenya/kericho', '/kenya/baringo/ac-repair', '/locations/ahero', '/somaliland/berbera']) {
      if (isProtectedTemplatePage(p)) continue;
      const out = applyTemplateIndexPolicy(p, before);
      expect(out.alternates?.canonical, p).toBe(SITE + p);
      expect((out.openGraph as { url?: string }).url, p).toBe(SITE + p);
      expect(out.robots, p).toEqual({ index: false, follow: true });
      expect(JSON.stringify(out.robots), p).not.toMatch(/googleBot/);
      expect(out.title).toBe('t');
      expect(out.description).toBe('d');
      expect((out.openGraph as { title?: string }).title).toBe('og');
    }
  });

  it('accepts a trailing slash', () => {
    expect(applyTemplateIndexPolicy('/sectors/homes/kenya/kericho/', before).alternates?.canonical).toBe(`${SITE}/sectors/homes/kenya/kericho`);
  });

  it('leaves every protected page exactly as it was', () => {
    const list = protectedList as string[];
    expect(list.length).toBeGreaterThan(800);
    for (const p of list) expect(applyTemplateIndexPolicy(p, before), p).toBe(before);
  });

  it('protects every page the 5 Nov stage kept indexed', () => {
    for (const p of keep as string[]) expect(isProtectedTemplatePage(p), p).toBe(true);
  });

  it('Release 1-N: holds every core-service and brand x county page unchanged', () => {
    for (const p of [
      '/brands/perkins/kenya/bomet',
      '/brands/cummins/kenya/nakuru',
      '/kenya/baringo/generators',
      '/kenya/baringo/generator-repairs',
      '/kenya/kiambu/limuru/solar-installation',
      '/kenya/baringo/electrical-services',
      '/kenya/baringo/motor-rewinding',
      '/kenya/baringo/automatic-transfer-switch',
    ]) {
      expect(applyTemplateIndexPolicy(p, before), p).toBe(before);
    }
  });

  it('Release 1-N: a held page keeps EXACTLY production behaviour (never moved into the index)', () => {
    // Self-canonical core page on a stage-1 route: production says noindex, follow; so must Release 1-N.
    const selfMeta = { title: 't', alternates: { canonical: `${SITE}/kenya/baringo/generators` }, robots: { index: true, follow: true } };
    expect(applyTemplateIndexPolicy('/kenya/baringo/generators', selfMeta).robots).toEqual({ index: false, follow: true });
    expect(applyTemplateIndexPolicy('/kenya/baringo/generators', selfMeta).alternates?.canonical).toBe(`${SITE}/kenya/baringo/generators`);
    // Brand x county had no stage-1 rule: metadata returned as it is.
    const brandMeta = { title: 'b', alternates: { canonical: `${SITE}/brands/cummins` }, robots: { index: true, follow: true } };
    expect(applyTemplateIndexPolicy('/brands/cummins/kenya/nakuru', brandMeta)).toBe(brandMeta);
  });

  it('Release 1-N: still excludes non-core template pages', () => {
    for (const p of ['/kenya/baringo/ac-companies', '/kenya/baringo/borehole-drilling', '/sectors/banks/kenya/kitui', '/locations/ahero']) {
      if (isProtectedTemplatePage(p)) continue;
      expect(applyTemplateIndexPolicy(p, before).robots, p).toEqual({ index: false, follow: true });
    }
  });

  it('never touches a county hub', () => {
    expect(applyTemplateIndexPolicy('/kenya/nakuru', before)).toBe(before);
  });

  it('leaves not-found responses closed', () => {
    const closed = { title: 'Not Found', robots: { index: false, follow: false } };
    expect(applyTemplateIndexPolicy('/sectors/nope/kenya/nowhere', closed)).toBe(closed);
  });

  it('does not invent an og:url on a page that has none', () => {
    const out = applyTemplateIndexPolicy('/sectors/homes/kenya/kericho', { title: 't' });
    expect(out.openGraph).toBeUndefined();
  });

  it('is wired into every template route and no other', () => {
    const routes = [
      'app/kenya/[county]/[...slug]/page.tsx',
      'app/locations/[location]/[service]/page.tsx',
      'app/locations/[location]/page.tsx',
      'app/brands/[brand]/kenya/[location]/page.tsx',
      'app/sectors/[sector]/kenya/[location]/page.tsx',
      'app/[country]/[city]/page.tsx',
    ];
    for (const r of routes) {
      const src = readFileSync(join(root, r), 'utf8');
      expect(/applyTemplateIndexPolicy|withLocationIndexPolicy/.test(src), r).toBe(true);
    }
    for (const r of ['app/kenya/[county]/page.tsx', 'app/brands/[brand]/page.tsx', 'app/sectors/[sector]/page.tsx', 'app/services/[service]/page.tsx']) {
      const src = readFileSync(join(root, r), 'utf8');
      expect(/applyTemplateIndexPolicy|withLocationIndexPolicy/.test(src), r).toBe(false);
    }
  });
});
