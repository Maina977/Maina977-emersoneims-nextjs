/*
 * ADD SELF-REFERENTIAL CANONICALS TO STATIC ROUTES.
 *
 * WHY THIS EXISTS
 * app/layout.tsx derives a canonical from the request path via `await
 * headers()`. That fixes a real Search Console defect, but it lives in the
 * ROOT layout, so it opts EVERY page on this site into dynamic rendering.
 * The visible consequence is the response header
 *     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
 * which tells every visitor's browser never to store a page. Repeat visits
 * re-download the whole document — 440KB of HTML on the homepage — and the
 * carefully tuned s-maxage/stale-while-revalidate policy in vercel.json is
 * overridden.
 *
 * The layout's own comment names the condition for removing that call: every
 * statically prerendered page must declare its own alternates.canonical. This
 * script satisfies that condition for the 124 static routes that do not, so
 * `headers()` can then be removed and the whole site can render statically.
 *
 * SAFETY
 *   - only touches files with `export const metadata` and NO existing
 *     `alternates` key — anything already declaring one is left alone
 *   - skips dynamic routes ([param]): their canonical varies per request and
 *     must come from generateMetadata, not a constant
 *   - skips route groups when building the URL — (building) is not a path
 *     segment
 *   - inserts one key immediately after the object opens; nothing else in the
 *     file is touched
 *   - --apply is required; the default is a dry run
 */
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = path.join(process.cwd(), 'app');
const ROOT_LAYOUT = path.join(ROOT, 'layout.tsx');
const SITE = 'https://www.emersoneims.com';

const changed = [];
const skipped = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '_archive') continue;
      walk(f);
      continue;
    }
    if (e.name !== 'page.tsx' && e.name !== 'layout.tsx') continue;
    if (f === ROOT_LAYOUT) continue;

    const src = fs.readFileSync(f, 'utf8');
    if (!/export\s+const\s+metadata/.test(src)) continue;
    if (/alternates:/.test(src)) continue;

    const rel = path.relative(ROOT, f).split(path.sep).join('/');
    const dirPath = rel.replace(/\/(page|layout)\.tsx$/, '');
    const segments = dirPath === '' ? [] : dirPath.split('/').filter((x) => !/^\(.*\)$/.test(x));

    if (segments.some((x) => x.startsWith('['))) {
      skipped.push({ rel, why: 'dynamic route — canonical must come from generateMetadata' });
      continue;
    }

    const url = SITE + '/' + segments.join('/');
    const canonical = url.endsWith('/') && url !== SITE + '/' ? url.slice(0, -1) : url;

    // Insert directly after the metadata object opens, preserving indentation.
    const m = /(export\s+const\s+metadata(?:\s*:\s*Metadata)?\s*=\s*\{)/.exec(src);
    if (!m) { skipped.push({ rel, why: 'could not locate the metadata object opening' }); continue; }

    const next =
      src.slice(0, m.index + m[0].length) +
      `\n  // Self-referential canonical. Declared here so this route does not depend\n` +
      `  // on the root layout reading headers() — that call forced the whole site\n` +
      `  // to render dynamically and disabled browser caching everywhere.\n` +
      `  alternates: { canonical: '${canonical}' },` +
      src.slice(m.index + m[0].length);

    changed.push({ rel, canonical });
    if (APPLY) fs.writeFileSync(f, next);
  }
}

walk(ROOT);

console.log(`\n${APPLY ? 'ADDED' : 'WOULD ADD'} canonicals to ${changed.length} route(s)\n`);
changed.slice(0, 15).forEach((c) => console.log(`  ${c.canonical.replace(SITE, '').padEnd(48)} ${c.rel}`));
if (changed.length > 15) console.log(`  ... and ${changed.length - 15} more`);

if (skipped.length) {
  console.log(`\nSKIPPED ${skipped.length}:`);
  skipped.forEach((s) => console.log(`  ${s.rel}\n      ${s.why}`));
}

if (!APPLY) console.log('\nDry run. Re-run with --apply to write.');
