/**
 * BUILD GUARD — page titles must fit in a search result.
 *
 * WHY THIS EXISTS. app/layout.tsx appends " | EmersonEIMS Kenya" — 20
 * characters — to every page that does not opt out. Titles across the site
 * were written without budgeting for it, and on 2026-09-29, of 4,886
 * prerendered pages, 1,382 (28.3%) exceeded 60 characters. The longest ran to
 * 101. Google truncates around that mark, and on this site the part that
 * disappears is usually the place name the searcher typed.
 *
 * lib/seo/pageTitle.ts fixed the mechanism: spend the brand suffix only when
 * there is room, and drop a trailing "| qualifier" before losing the claim.
 * That took it to a small residue. This guard stops it drifting back — a new
 * route with a long template would otherwise reintroduce the problem silently,
 * which is exactly how it reached 28% in the first place.
 *
 * ADVISORY, NOT BLOCKING. A title is a content decision. Some are legitimately
 * long — a blog article's own headline, for instance — and failing a 4,970-page
 * build over an editorial choice would make this guard something people route
 * around. It reports, names the worst offenders, and fails only if the count
 * regresses past a recorded ceiling.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '.next/server/app';
const LIMIT = 60;

/*
 * The ceiling is the measured count after the 2026-09-29 fix, with a little
 * head-room. Lower it when the residue is reduced; never raise it to make a
 * red build go green.
 */
const CEILING = 160;

let files = [];
try {
  (function walk(d) {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.html')) files.push(p);
    }
  })(ROOT);
} catch {
  console.log('check-titles: no build output found — run after `next build`. Skipping.');
  process.exit(0);
}

const dec = (x) =>
  x.replace(/&amp;/g, '&').replace(/&#x27;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const long = [];
let scanned = 0;

for (const f of files) {
  const m = readFileSync(f, 'utf8').match(/<title>([^<]*)<\/title>/);
  if (!m) continue;
  scanned++;
  const t = dec(m[1]);
  if (t.length > LIMIT) {
    long.push({ route: f.slice(ROOT.length).split('\\').join('/').replace(/\.html$/, '') || '/', t, len: t.length });
  }
}

const pct = ((100 * long.length) / Math.max(1, scanned)).toFixed(1);
console.log(`check-titles: ${long.length} of ${scanned} titles over ${LIMIT} chars (${pct}%), ceiling ${CEILING}`);

if (long.length) {
  const byFamily = new Map();
  for (const r of long) {
    const k = r.route.replace(/^\//, '').split('/')[0] || '(root)';
    byFamily.set(k, (byFamily.get(k) || 0) + 1);
  }
  console.log('  by route family:');
  [...byFamily.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    .forEach(([k, n]) => console.log(`    ${String(n).padStart(4)}  /${k}`));

  console.log('  longest:');
  long.sort((a, b) => b.len - a.len).slice(0, 5)
    .forEach((r) => console.log(`    ${r.len}  ${r.route}\n          "${r.t.slice(0, 88)}"`));
}

if (long.length > CEILING) {
  console.error(
    `\nFAIL — over-long titles rose to ${long.length}, past the ${CEILING} ceiling.\n` +
      `Use seoTitle / seoTitleParts / seoTitleSmart from lib/seo/pageTitle.ts in the\n` +
      `route's generateMetadata, rather than raising the ceiling.\n`,
  );
  process.exit(1);
}

console.log('PASS — title length within the recorded ceiling.');
