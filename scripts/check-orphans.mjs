/**
 * Find prerendered pages that nothing links to.
 *
 * WHY THIS EXISTS
 * The same failure has now happened at least four times on this site, and it
 * has never once been a coding mistake:
 *
 *   - 27 /sectors/* pages and 68 East African city pages, live and valid with
 *     zero internal links and zero sitemap entries (found 2026-07-21).
 *   - 13 blog articles written as their own app/blog/<slug>/page.tsx, each
 *     answering 200 with a correct canonical, none listed on /blog, none in
 *     the sitemap (found 2026-09-20). "Why Your Generator Won't Start" is the
 *     query a facility manager types at 2am and it had no route in.
 *   - 27 spare-parts categories and 23 engine pages, orphaned because their
 *     hub is a client component and its body never reaches the server HTML.
 *   - PartsCategoryLinks, a component written specifically to fix the third
 *     case, complete and correct and rendered nowhere for two months.
 *
 * Every one was finished work. The building was fine; the wiring was missed,
 * silently, and stayed missed because nothing looks for it. Type-checking
 * cannot see it, the build cannot see it, and a test that asserts HTTP 200
 * passes happily — the page loads, nobody can find it.
 *
 * WHY IT READS THE BUILD AND NOT THE SOURCE
 * Source analysis cannot resolve href={`/blog/${a.slug}`}. Matching on the
 * prefix would have marked all forty blog routes as linked and hidden exactly
 * the thirteen that were not. The prerendered HTML has no such ambiguity: the
 * links either exist or they do not. So this runs as postbuild, over what was
 * actually shipped.
 *
 * NOT BLOCKING, deliberately, and this is a considered choice rather than
 * timidity. Some pages are meant to be unlinked: noindex previews, pages
 * reached only from a form, deep tiers withdrawn from the sitemap on purpose.
 * A rule that failed the build on all of those would be turned off within a
 * week, and the guard that gets turned off protects nothing. It reports every
 * run instead, loudly, with the count first so a sudden jump is obvious.
 *
 * Pages carrying noindex are skipped: an unlinked page we have already told
 * Google to ignore is not a discovery problem.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const APP_DIR = join(ROOT, '.next', 'server', 'app');

if (!existsSync(APP_DIR)) {
  console.log('check-orphans: no build output found — run after `next build`. Skipping.');
  process.exit(0);
}

/** Every prerendered HTML file in the build output. */
function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (e.endsWith('.html')) out.push(p);
  }
  return out;
}

/** ".next/server/app/blog/generator-roi.html" -> "/blog/generator-roi" */
function routeOf(file) {
  const rel = relative(APP_DIR, file).split(sep).join('/');
  const noExt = rel.replace(/\.html$/, '');
  if (noExt === 'index') return '/';
  return '/' + noExt;
}

const files = walk(APP_DIR);
const pages = new Map(); // route -> { noindex }
const linked = new Set(); // every internal path any page links to

for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const route = routeOf(f);

  const robots = html.match(/<meta name="robots" content="([^"]*)"/i);
  pages.set(route, { noindex: !!robots && /noindex/i.test(robots[1]) });

  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    let href = m[1];
    if (href.length > 1) href = href.replace(/\/+$/, '');
    linked.add(href || '/');
  }
}

/*
 * A page is its own referrer in the HTML — self-links in breadcrumbs, canonical
 * tags rendered as anchors, "you are here" navigation. Those must not count, or
 * nothing is ever orphaned. Only links found on OTHER pages count, so the set
 * is rebuilt per page below rather than used whole.
 */
const linkedFromElsewhere = new Set();
for (const f of files) {
  const html = readFileSync(f, 'utf8');
  const self = routeOf(f).replace(/\/+$/, '') || '/';
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    let href = m[1];
    if (href.length > 1) href = href.replace(/\/+$/, '');
    const target = href || '/';
    if (target !== self) linkedFromElsewhere.add(target);
  }
}

const orphans = [];
for (const [route, meta] of pages) {
  if (route === '/') continue;
  if (meta.noindex) continue;
  const key = route.replace(/\/+$/, '') || '/';
  if (!linkedFromElsewhere.has(key)) orphans.push(route);
}

orphans.sort();

console.log(`Orphan guard — ${pages.size} prerendered pages, ${linkedFromElsewhere.size} link targets`);
console.log(`  unlinked and indexable: ${orphans.length}\n`);

if (orphans.length) {
  console.log('ADVISORY — no other page links to these. They can only be found');
  console.log('via the sitemap, if they are in it at all:');
  for (const o of orphans.slice(0, 40)) console.log(`  ${o}`);
  if (orphans.length > 40) console.log(`  ... and ${orphans.length - 40} more`);
  console.log('');
  console.log('  Unlinked is not always wrong — a page reached only from a form, or a');
  console.log('  tier withdrawn from the sitemap on purpose, belongs here. What must');
  console.log('  not happen is a finished page sitting in this list unnoticed.');
  console.log('');
} else {
  console.log('PASS — every indexable prerendered page is linked from somewhere.\n');
}

process.exit(0);
