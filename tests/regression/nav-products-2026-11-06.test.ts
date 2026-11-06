/**
 * External audit (Nov 2026) P4: the menu is built around what customers buy.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { getAllServiceSlugs } from '@/lib/services/allServices';

const root = join(__dirname, '..', '..');
const nav = readFileSync(join(root, 'components/navigation/TeslaStyleNavigation.tsx'), 'utf8');

function routeExists(href: string): boolean {
  const path = href.split('#')[0];
  if (path === '/') return true;
  const parts = path.split('/').filter(Boolean);
  if (existsSync(join(root, 'app', ...parts, 'page.tsx'))) return true;
  if (path.startsWith('/services/')) return getAllServiceSlugs().includes(path.slice('/services/'.length));
  // One-level dynamic child, e.g. app/repair-centre/[category]/page.tsx.
  const parent = join(root, 'app', ...parts.slice(0, -1));
  return existsSync(parent) && readdirSync(parent).some((d) => /^\[[^.]+\]$/.test(d) && existsSync(join(parent, d, 'page.tsx')));
}

describe('navigation (audit P4)', () => {
  it('bar order: HOME, PRODUCTS, SERVICES, REPAIR CENTRE, ENGINEERING TOOLS, INDUSTRIES, RESOURCES, CONTACT', () => {
    const start = nav.indexOf('const NAV_ITEMS = [');
    const block = nav.slice(start, nav.indexOf('\n];', start));
    const labels = [...block.matchAll(/^\s*\{[^}]*label: '([A-Z ]+)'/gm)].map((m) => m[1]);
    expect(labels).toEqual(['HOME', 'PRODUCTS', 'SERVICES', 'REPAIR CENTRE', 'ENGINEERING TOOLS', 'INDUSTRIES', 'RESOURCES', 'CONTACT']);
  });

  it('every menu link points at a page the site serves', () => {
    const hrefs = [...new Set([...nav.matchAll(/href: '(\/[^']*)'/g)].map((m) => m[1]))];
    expect(hrefs.length).toBeGreaterThan(60);
    const missing = hrefs.filter((h) => !routeExists(h));
    expect(missing).toEqual([]);
  });

  it('the links from the retired GENERATORS and SOLAR menus are all still in the menu', () => {
    for (const h of ['/generators/used', '/generators/leasing', '/generators/rental', '/brands', '/generators/installation',
      '/generators/maintenance', '/generators/workshop-services', '/generators/systems', '/maintenance-hub/generators',
      '/generators/maintenance-companion', '/generator-problems', '/solar-genius-pro/design-studio', '/solutions/solar-sizing',
      '/solar-genius-pro/solar-dashboard', '/solar-genius-pro/calculator-advanced', '/solar-genius-pro/fault-codes',
      '/maintenance-hub/solar', '/hub/ups-lab']) {
      expect(nav.includes(`href: '${h}'`), h).toBe(true);
    }
  });
});
