/*
 * Shared derivation of "which first-level children does each guarded segment
 * really have", read straight off the app/ directory.
 *
 * WHY THE FILESYSTEM AND NOT THE BUILD MANIFEST
 * prebuild runs BEFORE next build, so .next/server/app-paths-manifest.json is
 * always the PREVIOUS build's. A route added in this commit would be missing
 * from it and the guard would 404 a brand-new real page. app/ is current by
 * definition.
 *
 * WHY NOT THE SITEMAP
 * Because that mistake has already been made here once: /services and /blog
 * each have static route folders that never appear in the sitemap, and a
 * sitemap-derived allow-list would have 404'd 20 working pages. See the
 * 2026-07-27 note in the soft-404 memory. A guard that over-blocks is worse
 * than the soft-404 it replaces.
 */
import fs from 'fs';
import path from 'path';

/**
 * Segments whose first-level children are fully enumerable and static.
 *
 * Verified live 2026-08-25: each of these answered HTTP 200 to an invented
 * child URL, and each has zero dynamic first-level children, so listing them
 * cannot block a real page. Segments already covered by guards 0a-0h
 * (locations, kenya, repair-centre, brands, sectors, services, blog, pricing)
 * are deliberately absent — they have their own, richer rules.
 */
export const GUARDED_SEGMENTS = [
  'about-us', 'africa', 'ai-tools', 'all-tools', 'analytics', 'aquascan-pro',
  'booking', 'calculators', 'careers', 'case-studies', 'diagnostics',
  'east-africa', 'eims-pro', 'fabrication', 'faq', 'gallery', 'generator',
  'generator-oracle', 'generator-parts', 'generator-services', 'generators',
  'guides', 'healthcare', 'high-rise', 'hub', 'industry-solutions',
  'innovations', 'knowledge-base', 'maintenance-hub', 'marketplace',
  'podcasts', 'products', 'resources', 'safety', 'service', 'solar',
  'specs', 'technical-bible', 'tools', 'troubleshooting',
];

const PAGE_FILES = ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'route.ts', 'route.js'];

/** Does this directory render something at its own path? */
function isRoute(dir) {
  return PAGE_FILES.some((f) => fs.existsSync(path.join(dir, f)));
}

/**
 * First-level child slugs of app/<segment>.
 *
 * Returns null when the segment has a DYNAMIC first-level child — such a
 * segment cannot be safely enumerated and must not be guarded this way, or a
 * real slug would 404.
 */
export function childrenOf(appDir, segment) {
  const base = path.join(appDir, segment);
  if (!fs.existsSync(base)) return null;

  const out = new Set();
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const name = entry.name;

    // A dynamic child means anything could be valid — refuse to enumerate.
    if (name.startsWith('[')) return null;

    // Route groups "(marketing)" and parallel slots "@modal" do not appear in
    // the URL; their children surface at this level instead.
    if (name.startsWith('(') || name.startsWith('@')) {
      const inner = path.join(base, name);
      for (const sub of fs.readdirSync(inner, { withFileTypes: true })) {
        if (!sub.isDirectory()) continue;
        if (sub.name.startsWith('[')) return null;
        if (isRoute(path.join(inner, sub.name))) out.add(sub.name);
      }
      continue;
    }

    // A directory with no page of its own may still hold deeper routes; the
    // URL segment is still reachable, so it stays allowed.
    out.add(name);
  }
  return [...out].sort();
}

/** { segment: [children] } for every guarded segment that is enumerable. */
export function buildSegmentMap(appDir) {
  const map = {};
  const skipped = [];
  for (const seg of GUARDED_SEGMENTS) {
    const kids = childrenOf(appDir, seg);
    if (kids === null) skipped.push(seg);
    else map[seg] = kids;
  }
  return { map, skipped };
}

/** The exact one-line literal that must appear inside middleware.ts. */
export function serialiseMap(map) {
  const parts = Object.keys(map)
    .sort()
    .map((k) => `'${k}':[${map[k].map((c) => `'${c}'`).join(',')}]`);
  return `{${parts.join(',')}}`;
}
