/*
 * A layout's metadata is INHERITED by every page beneath it. So a hard-coded
 * `alternates.canonical` in a layout makes every child page declare a
 * canonical pointing at the SECTION ROOT — asking Google to index the parent
 * and drop the child. This has now happened twice:
 *
 *   2026-07-31: 41 published pages were canonicalising themselves away
 *               (/maintenance-hub/*, /hub/*, /generators/*, /solar-genius-pro/*,
 *               /aquascan-pro-v3/*, /ai-tools/*). Fixed by deleting the
 *               canonicals from those six layouts.
 *   2026-09-02: back again. A later perf fix re-added the canonicals — for a
 *               good reason: without them the route falls back to the root
 *               layout, which reads headers(), and that forces the whole site
 *               to render dynamically. Six commercial pages
 *               (/generators/cummins, /caterpillar, /perkins, /volvo-penta,
 *               /systems, /leasing and /ai-tools/capabilities) were serving
 *               canonical=".../generators" and ".../ai-tools" again, verified
 *               live as Googlebot.
 *
 * Both fixes cannot both be right, and deleting the canonical re-breaks
 * rendering. The rule that satisfies both: a layout MAY declare a canonical,
 * but then every page beneath it must override it — with its own layout.tsx
 * (needed when the page is 'use client', which cannot export metadata) or with
 * its own metadata. This check enforces exactly that.
 */
import fs from 'fs';
import path from 'path';

const toPosix = (p) => p.split(path.sep).join('/');

const APP = 'app';
const CANON = /alternates\s*:\s*\{[^}]*canonical/s;

/** Every directory under app/, depth-first. */
function dirs(root) {
  const out = [];
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    if (e.name === 'node_modules' || e.name.startsWith('_')) continue;
    const d = path.join(root, e.name);
    out.push(d, ...dirs(d));
  }
  return out;
}

function declaresCanonical(file) {
  if (!fs.existsSync(file)) return false;
  return CANON.test(fs.readFileSync(file, 'utf8'));
}

/*
 * Routes that never render, because a next.config.ts redirect runs before
 * routing and answers first. An inherited canonical cannot reach a crawler
 * through a 308, so these are not defects — but the page files are kept on
 * disk, so the walk below still finds them.
 *
 * Removing a redirect from next.config.ts without also removing the entry
 * here would hide a real regression, so each one names the redirect it
 * depends on.
 */
const SHADOWED_BY_REDIRECT = new Set([
  // next.config.ts: the six retired sector slugs -> /industries/<hub>
  'app/solutions/[slug]',
  // next.config.ts: '/solutions/motors' -> '/services/motor-rewinding'
  'app/solutions/motors',
]);
const all = [APP, ...dirs(APP)];
const layoutCanonical = new Set(
  all.filter((d) => declaresCanonical(path.join(d, 'layout.tsx'))),
);
// The root layout is exempt: it emits a self-referential canonical from
// x-pathname, which is per-request and therefore correct for every page.
layoutCanonical.delete(APP);

const pages = all.filter((d) => fs.existsSync(path.join(d, 'page.tsx')));

const orphans = [];
for (const p of pages) {
  // Walk from the page's own directory upwards. The DEEPEST declaration wins,
  // so the first one found going up is the canonical this page actually ships.
  let cur = p;
  let source = null;
  while (cur.startsWith(APP)) {
    if (cur === p && declaresCanonical(path.join(p, 'page.tsx'))) { source = { dir: cur, from: 'page' }; break; }
    if (declaresCanonical(path.join(cur, 'layout.tsx'))) { source = { dir: cur, from: 'layout' }; break; }
    if (cur === APP) break;
    cur = path.dirname(cur);
  }
  // No canonical anywhere above it: the root layout handles it. Fine.
  if (!source) continue;
  // Its own canonical, or one built per-page: fine.
  if (source.dir === p) continue;
  // Inherited from an ancestor layout that hard-codes one URL: broken.
  if (SHADOWED_BY_REDIRECT.has(toPosix(p))) continue;
  if (layoutCanonical.has(source.dir)) orphans.push({ page: p, inheritsFrom: source.dir });
}

if (orphans.length) {
  console.error('check-canonical-inheritance: FAIL — page(s) inherit a hard-coded canonical from an ancestor layout.');
  console.error('  Each of these declares <link rel="canonical"> pointing at another URL, which asks');
  console.error('  Google to drop the page and credit the parent instead.\n');
  for (const o of orphans) {
    console.error(`  ${toPosix(o.page)}`);
    console.error(`      inherits the canonical hard-coded in ${toPosix(o.inheritsFrom)}/layout.tsx`);
  }
  console.error('\n  Fix: add a server layout.tsx beside the page with its own');
  console.error("  `alternates: { canonical: ... }` (a 'use client' page cannot export metadata),");
  console.error('  or declare the canonical in the page\'s own metadata.');
  process.exit(1);
}

console.log(
  `check-canonical-inheritance: PASS — ${layoutCanonical.size} layout(s) declare a canonical, ` +
  `all ${pages.length} pages either override it or inherit none.`,
);
