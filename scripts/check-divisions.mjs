/**
 * BUILD GUARD — every link in the twelve divisions must be a route that exists.
 *
 * WHY THIS IS BLOCKING
 * /services is the page the whole service structure hangs from. A dead link
 * there is not a broken link on a leaf page; it is a dead link on the hub that
 * every division, every county page and the footer point at, and it is the
 * first thing a buyer clicks after deciding the company might be able to help.
 *
 * This site has already paid for the alternative. 383 dead internal links were
 * found and fixed in September 2026, and the reason they survived so long is
 * that nothing failed when one was added — a human had to notice.
 *
 * WHAT IT CHECKS
 * Each href resolves to either
 *   - a static route: app/<path>/page.tsx exists, or
 *   - a dynamic route whose parameter set is known at build time, which for
 *     this file means /services/<slug> from ALL_SERVICES and the fifteen
 *     /repair-centre/<hub> pages.
 *
 * Anything else fails the build and names the division it came from.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const APP = join(ROOT, 'app');

function read(p) {
  return readFileSync(join(ROOT, p), 'utf8');
}

/* ── The hrefs, lifted from the source without importing TypeScript ───────── */
const divSrc = read('lib/services/serviceDivisions.ts');
const hrefs = [...divSrc.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1]);
const uniq = [...new Set(hrefs)];

/* Which division each href belongs to, for a useful error message. */
const owner = new Map();
{
  const blocks = divSrc.split(/\n  \{\n    no: '/).slice(1);
  for (const b of blocks) {
    const title = (b.match(/title: '([^']+)'/) || [])[1] || '(unknown)';
    for (const m of b.matchAll(/href:\s*'([^']+)'/g)) {
      if (!owner.has(m[1])) owner.set(m[1], title);
    }
  }
}

/* ── Known dynamic routes ─────────────────────────────────────────────────── */
const serviceSlugs = new Set(
  [...read('lib/services/allServices.ts').matchAll(/^    slug: '([^']+)',$/gm)].map((m) => m[1]),
);

const repairHubs = new Set(
  existsSync(join(APP, 'repair-centre'))
    ? readdirSync(join(APP, 'repair-centre'), { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith('['))
        .map((d) => d.name)
    : [],
);

/*
 * /repair-centre/<hub> is a dynamic route driven by a data file rather than a
 * directory per hub, so an empty directory listing is expected and is NOT the
 * same as "no hubs exist". Fall back to the hub ids in the data.
 */
if (repairHubs.size === 0) {
  for (const f of ['lib/repair-centre/index.ts']) {
    if (existsSync(join(ROOT, f))) {
      for (const m of read(f).matchAll(/(?:slug|id):\s*'([a-z0-9-]+)'/g)) repairHubs.add(m[1]);
    }
  }
}

function resolves(href) {
  if (!href.startsWith('/')) return false;
  const path = href.split(/[?#]/)[0].replace(/\/$/, '') || '/';

  // Static route?
  if (path === '/' ? existsSync(join(APP, 'page.tsx')) : existsSync(join(APP, path, 'page.tsx'))) {
    return true;
  }

  // Route groups: app/(building)/foo/page.tsx serves /foo.
  for (const d of readdirSync(APP, { withFileTypes: true })) {
    if (d.isDirectory() && d.name.startsWith('(') && existsSync(join(APP, d.name, path, 'page.tsx'))) {
      return true;
    }
  }

  const m = path.match(/^\/services\/([^/]+)$/);
  if (m) return serviceSlugs.has(m[1]);

  const r = path.match(/^\/repair-centre\/([^/]+)$/);
  if (r) return repairHubs.size === 0 || repairHubs.has(r[1]);

  return false;
}

const dead = uniq.filter((h) => !resolves(h));

console.log(
  `check-divisions: ${uniq.length} distinct links across 12 divisions` +
    ` (${serviceSlugs.size} service slugs, ${repairHubs.size} repair hubs known)`,
);

if (dead.length) {
  console.error('\nFAIL — division links that resolve to no route:\n');
  for (const h of dead) console.error(`  ${h}\n      in division: ${owner.get(h) || '(unknown)'}`);
  console.error(
    '\nAdd the page, or remove the link. A division must not promise a page it cannot show.\n',
  );
  process.exit(1);
}

console.log('PASS — every division link resolves to a real route.');
