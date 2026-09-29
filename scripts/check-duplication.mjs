/**
 * BUILD GUARD — near-duplicate content, and runaway page generation.
 *
 * THIS IS THE GUARD THAT DID NOT EXIST, AND THAT IS WHY THE SITE LOST 97% OF
 * ITS TRAFFIC.
 *
 * The record, from this repository's own history:
 *
 *   2026-01-23  929ebbaf  "SEO: Add Kenya-wide location-service pages (5000+ pages)"
 *   2026-03-13  938e3a9b  "Major Performance & SEO Overhaul - 30,000+ Location Pages"
 *   2026-03-18  e9b9dd96  "Add 100,000+ village pages to sitemap for full Kenya SEO coverage"
 *
 * Those pages were generated from templates and differed mainly by a
 * substituted place name. On 2026-08-21 organic impressions fell from
 * 1,010/day to 29/day — 97% in a single day — and stayed flat for five weeks.
 * Roughly 51,000 pages were still indexed that day, so it was not a crawl or
 * indexing fault; it was Google judging the domain. Scaled content built to
 * rank rather than to inform is precisely what its scaled-content and
 * doorway-page policies act on.
 *
 * Eighteen build guards existed at that point. Every one of them checked a
 * detail — a dead link, a stale count, a false claim — and not one of them
 * asked the question that mattered: ARE THESE PAGES THE SAME PAGE?
 *
 * So this guard asks it, on every build:
 *
 *   1. SIMILARITY. Sample pages within each route family and measure 8-word
 *      phrase overlap between pairs. 8-word shingles are used because that is
 *      the measure the 2026-08 audit used, so the numbers are comparable:
 *      pages that were 60-68% identical then are 39-53% now.
 *
 *   2. SCALE. Compare the submitted URL count against a recorded ceiling. The
 *      March 2026 sitemap went from hundreds to 100,000+ in a single commit
 *      with nothing to stop it. A jump like that is now a build failure.
 *
 * ADVISORY ON SIMILARITY, BLOCKING ON SCALE. A family drifting a few points is
 * a judgement call and should not stop a deploy; a sitemap growing by an order
 * of magnitude is never an accident worth shipping unreviewed.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = '.next/server/app';

/** Raise ONLY with a deliberate decision recorded in the commit message. */
const SITEMAP_CEILING = 1200;

/** 8-word overlap above this within a family is reported. */
const SIMILARITY_WARN = 65;

if (!existsSync(ROOT)) {
  console.log('check-duplication: no build output — run after `next build`. Skipping.');
  process.exit(0);
}

/* ── 1. Sitemap scale ─────────────────────────────────────────────────────── */
let submitted = null;
for (const p of ['.next/server/app/sitemap.xml.body', '.next/server/app/sitemap.xml']) {
  if (existsSync(p)) {
    const xml = readFileSync(p, 'utf8');
    submitted = (xml.match(/<loc>/g) || []).length;
    break;
  }
}

/* ── 2. Similarity within route families ──────────────────────────────────── */

/*
 * MEASURE ONLY WHAT IS SUBMITTED — corrected 2026-09-29.
 *
 * The first version of this guard walked every .html in the build output. On
 * the build of 2026-09-29 that made it flag four families, and THREE OF THEM
 * DO NOT SERVE:
 *
 *     /counties/<name>        47 pages   66%   308 redirect, 0 submitted
 *     /marketplace/<page>      4 pages   83%   404,           0 submitted
 *     /solutions/generators/*  18 pages   80%   404,           0 submitted
 *     /brands/<brand>         17 pages   67%   200,          17 submitted  <- real
 *
 * Next builds HTML for routes that middleware or the route handler later
 * refuses, so build output is not the indexable set. A guard reporting 75%
 * false positives is worse than no guard: it trains whoever reads the build
 * log to scroll past it, which is precisely how 100,000+ near-duplicate pages
 * cleared eighteen other guards in March 2026.
 *
 * So the comparison set is now the sitemap — the pages we actually ask Google
 * to index, which is the only set whose similarity can cost anything.
 */
const submittedPaths = new Set();
if (submitted !== null) {
  for (const p of ['.next/server/app/sitemap.xml.body', '.next/server/app/sitemap.xml']) {
    if (!existsSync(p)) continue;
    for (const m of readFileSync(p, 'utf8').matchAll(/<loc>([^<]+)/g)) {
      let path = m[1].trim().replace(new RegExp('^https?://[^/]+'), '');
      if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);
      submittedPaths.add(path === '' ? '/' : path);
    }
    break;
  }
}

/** Path separator in build-output filenames on Windows. */
const BACKSLASH = String.fromCharCode(92);

/** Build-output file -> the route path it serves at. */
const routeOf = (file) => {
  const rel = file.slice(ROOT.length).split(BACKSLASH).join('/').slice(0, -5);
  return rel === '/index' ? '/' : rel;
};

const pages = [];
let skippedUnsubmitted = 0;
(function walk(d) {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) {
      // With no readable sitemap, fall back to measuring everything rather
      // than silently measuring nothing.
      if (submittedPaths.size && !submittedPaths.has(routeOf(p))) {
        skippedUnsubmitted++;
        continue;
      }
      pages.push(p);
    }
  }
})(ROOT);

const families = new Map();
for (const f of pages) {
  const rel = f.slice(ROOT.length).split('\\').join('/');
  const seg = rel.replace(/^\//, '').split('/');
  // Group by family + depth, so county pages are compared with county pages.
  const key = seg.length > 1 ? `${seg[0]} (depth ${seg.length})` : seg[0].replace(/\.html$/, '');
  if (!families.has(key)) families.set(key, []);
  families.get(key).push(f);
}

const text = (f) =>
  readFileSync(f, 'utf8')
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);

const shingles = (w, n = 8) => {
  const s = new Set();
  for (let i = 0; i + n <= w.length; i++) s.add(w.slice(i, i + n).join(' '));
  return s;
};

const jaccard = (a, b) => {
  let inter = 0;
  for (const x of a) if (b.has(x)) inter++;
  const uni = a.size + b.size - inter;
  return uni === 0 ? 0 : (100 * inter) / uni;
};

const rows = [];
for (const [family, list] of families) {
  if (list.length < 4) continue; // too few to be a scaled pattern
  // Sample evenly across the family rather than taking the first few, which
  // would compare alphabetical neighbours and flatter the result.
  const step = Math.max(1, Math.floor(list.length / 6));
  const sample = [];
  for (let i = 0; i < list.length && sample.length < 6; i += step) sample.push(list[i]);
  if (sample.length < 3) continue;

  const sets = sample.map((f) => shingles(text(f)));
  const scores = [];
  for (let i = 0; i < sets.length; i++)
    for (let j = i + 1; j < sets.length; j++) {
      if (sets[i].size < 40 || sets[j].size < 40) continue;
      scores.push(jaccard(sets[i], sets[j]));
    }
  if (!scores.length) continue;
  scores.sort((a, b) => a - b);
  rows.push({
    family,
    pages: list.length,
    median: scores[Math.floor(scores.length / 2)],
    max: scores[scores.length - 1],
  });
}

rows.sort((a, b) => b.median - a.median);

console.log(
  `check-duplication: ${pages.length} submitted pages measured, ${rows.length} families sampled` +
    (submitted !== null ? `, ${submitted} URLs submitted (ceiling ${SITEMAP_CEILING})` : '') +
    (skippedUnsubmitted ? `, ${skippedUnsubmitted} built-but-unsubmitted pages ignored` : ''),
);

const flagged = rows.filter((r) => r.median > SIMILARITY_WARN);
for (const r of rows.slice(0, 6)) {
  const mark = r.median > SIMILARITY_WARN ? '  **' : '    ';
  console.log(
    `${mark} ${r.family.padEnd(28)} ${String(r.pages).padStart(5)} pages   median ${r.median.toFixed(0)}%   worst ${r.max.toFixed(0)}%`,
  );
}

if (flagged.length) {
  console.log(
    `\n  ADVISORY — ${flagged.length} family/families above ${SIMILARITY_WARN}% 8-word overlap.\n` +
      `  Pages this similar are one page to a search engine. Give each one\n` +
      `  something sourced and specific, or consolidate them onto a canonical.\n`,
  );
}

if (submitted !== null && submitted > SITEMAP_CEILING) {
  console.error(
    `\nFAIL — sitemap submits ${submitted} URLs, past the ${SITEMAP_CEILING} ceiling.\n\n` +
      `  In March 2026 this sitemap went from hundreds of URLs to 100,000+ in a\n` +
      `  single commit, and five months later the domain lost 97% of its organic\n` +
      `  impressions in one day. Scale is not a ranking strategy.\n\n` +
      `  If this growth is deliberate and each page carries content a reader\n` +
      `  could not get from its siblings, raise SITEMAP_CEILING in this file and\n` +
      `  say why in the commit message. Do not raise it to make a build pass.\n`,
  );
  process.exit(1);
}

console.log('PASS — no runaway page generation.');
