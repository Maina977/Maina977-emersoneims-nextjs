/**
 * Repair Centre registry integrity audit.
 *
 * Bundles the TS registry with esbuild and EXECUTES it, so the numbers and the
 * cross-references are real rather than parsed out of source with a regex.
 *
 * Checks:
 *  1. Every article slug is unique
 *  2. Every article's hub exists
 *  3. Every hub articleSlugs entry resolves to a real article
 *  4. Every article registered under a hub is listed in that hub's articleSlugs
 *  5. Every relatedSlugs entry resolves to a real article (no dead links)
 *  6. No article relates to itself
 *  7. Required content sections are present and non-trivial
 *
 * Usage: node scripts/audit-repair-centre.mjs
 */

import { build } from 'esbuild';
import { readFileSync, unlinkSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '.repair-audit.bundle.mjs');

await build({
  entryPoints: [path.join(root, 'lib/repair-centre/index.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: out,
  alias: { '@': root },
  logLevel: 'silent',
});

const mod = await import(pathToFileURL(out).href);
unlinkSync(out);

const { REPAIR_ARTICLES, REPAIR_HUBS } = mod;
const errors = [];
const warnings = [];

const slugs = REPAIR_ARTICLES.map(a => a.slug);
const slugSet = new Set(slugs);
const hubSet = new Set(REPAIR_HUBS.map(h => h.slug));

// 1. unique slugs
const seen = new Set();
for (const s of slugs) {
  if (seen.has(s)) errors.push(`Duplicate article slug: ${s}`);
  seen.add(s);
}

// 2. hub exists
for (const a of REPAIR_ARTICLES) {
  if (!hubSet.has(a.hub)) errors.push(`Article ${a.slug} references unknown hub "${a.hub}"`);
}

// 3. hub articleSlugs resolve
for (const h of REPAIR_HUBS) {
  for (const s of h.articleSlugs) {
    if (!slugSet.has(s)) errors.push(`Hub ${h.slug} lists unwritten article slug "${s}"`);
    else {
      const a = REPAIR_ARTICLES.find(x => x.slug === s);
      if (a.hub !== h.slug) errors.push(`Hub ${h.slug} lists "${s}" but that article belongs to hub "${a.hub}"`);
    }
  }
}

// 4. every article is listed by its hub
for (const a of REPAIR_ARTICLES) {
  const h = REPAIR_HUBS.find(x => x.slug === a.hub);
  if (h && !h.articleSlugs.includes(a.slug)) {
    errors.push(`Article ${a.slug} is not listed in hub ${h.slug} articleSlugs`);
  }
}

// 5 + 6. relatedSlugs resolve, and no self-reference
for (const a of REPAIR_ARTICLES) {
  for (const r of a.relatedSlugs ?? []) {
    if (r === a.slug) errors.push(`Article ${a.slug} relates to itself`);
    else if (!slugSet.has(r)) errors.push(`Article ${a.slug} has dead relatedSlug "${r}"`);
  }
}

// 7. content completeness
const MIN = {
  directAnswer: 200,
};
for (const a of REPAIR_ARTICLES) {
  const need = ['header', 'directAnswer', 'symptoms', 'whatItMeans', 'causes', 'safety', 'tools', 'decisionTree', 'diagnosis', 'repair', 'validation', 'whenNotToRepair', 'prevention', 'faq', 'references'];
  for (const k of need) {
    const v = a[k];
    if (v == null) errors.push(`Article ${a.slug} missing section "${k}"`);
    else if (Array.isArray(v) && v.length === 0) errors.push(`Article ${a.slug} has empty section "${k}"`);
  }
  if (typeof a.directAnswer === 'string' && a.directAnswer.length < MIN.directAnswer) {
    warnings.push(`Article ${a.slug} directAnswer is short (${a.directAnswer.length} chars)`);
  }
  if (a.diagnosis && a.diagnosis.length < 6) warnings.push(`Article ${a.slug} has only ${a.diagnosis.length} diagnostic steps`);
  if (a.faq && a.faq.length < 3) warnings.push(`Article ${a.slug} has only ${a.faq.length} FAQ entries`);
  if (a.header && !a.header.lastReviewed) errors.push(`Article ${a.slug} missing lastReviewed date`);
  // steps must be sequentially numbered
  if (Array.isArray(a.diagnosis)) {
    a.diagnosis.forEach((d, i) => {
      if (d.step !== i + 1) errors.push(`Article ${a.slug} diagnosis step ${i + 1} is numbered ${d.step}`);
    });
  }
}

// 8. middleware guard 0f must stay in sync with the registry.
//    The sitemap is generated FROM the registry, so a hub or article the guard
//    does not know about would be published in the sitemap and then 404'd by
//    middleware — an own goal that is easy to ship and hard to notice.
{
  const mw = readFileSync(path.join(root, 'middleware.ts'), 'utf8');
  const hubBlock = mw.match(/const OK_REPAIR_HUBS = new Set\(\[([^\]]*)\]\)/);
  const artBlock = mw.match(/const OK_REPAIR_ARTICLES: Record<string, string> = \{([\s\S]*?)\};/);
  if (!hubBlock || !artBlock) {
    errors.push('middleware.ts: could not find guard 0f OK_REPAIR_HUBS / OK_REPAIR_ARTICLES — did the guard get renamed or removed?');
  } else {
    const mwHubs = new Set([...hubBlock[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
    const mwArts = new Map([...artBlock[1].matchAll(/'([^']+)'\s*:\s*'([^']+)'/g)].map(m => [m[1], m[2]]));
    for (const h of hubSet) if (!mwHubs.has(h)) errors.push(`middleware guard 0f is missing hub "${h}" — /repair-centre/${h} would 404`);
    for (const h of mwHubs) if (!hubSet.has(h)) warnings.push(`middleware guard 0f lists hub "${h}" that is no longer in the registry`);
    for (const a of REPAIR_ARTICLES) {
      if (!mwArts.has(a.slug)) errors.push(`middleware guard 0f is missing article "${a.slug}" — it is in the sitemap but would 404`);
      else if (mwArts.get(a.slug) !== a.hub) errors.push(`middleware guard 0f maps "${a.slug}" to hub "${mwArts.get(a.slug)}" but the registry says "${a.hub}"`);
    }
    for (const [s] of mwArts) if (!slugSet.has(s)) warnings.push(`middleware guard 0f lists article "${s}" that is no longer in the registry`);
  }
}

// 9. JSON-LD must be emitted by a PLAIN <script> tag in these server components.
//    next/script with no strategy defaults to afterInteractive, which injects
//    the tag client-side only — it never appears in the initial HTML, so no
//    crawler ever sees it. That shipped silently: TechArticle and
//    BreadcrumbList were absent from every article page while the code looked
//    correct. Verified by fetching the live HTML, not by reading the source.
{
  const ROUTE_FILES = [
    'app/repair-centre/page.tsx',
    'app/repair-centre/[hub]/page.tsx',
    'app/repair-centre/[hub]/[slug]/page.tsx',
  ];
  for (const rel of ROUTE_FILES) {
    let src;
    try {
      src = readFileSync(path.join(root, rel), 'utf8');
    } catch {
      errors.push(`${rel}: route file missing`);
      continue;
    }
    if (!/type="application\/ld\+json"/.test(src)) {
      errors.push(`${rel}: no JSON-LD block found — structured data lost`);
      continue;
    }
    if (/<Script\s/.test(src) && !/strategy="beforeInteractive"/.test(src)) {
      errors.push(`${rel}: JSON-LD uses next/script without strategy="beforeInteractive" — it will NOT appear in the server-rendered HTML. Use a plain <script> tag.`);
    }
    if (/from 'next\/script'/.test(src) && !/<Script\s/.test(src)) {
      warnings.push(`${rel}: imports next/script but never uses it`);
    }
  }
}

// report
console.log(`Repair Centre registry audit`);
console.log(`  hubs:     ${REPAIR_HUBS.length}`);
console.log(`  articles: ${REPAIR_ARTICLES.length}`);
for (const h of REPAIR_HUBS) {
  const n = REPAIR_ARTICLES.filter(a => a.hub === h.slug).length;
  console.log(`    ${h.slug.padEnd(14)} ${n} article(s)`);
}
console.log(`  routes:   ${1 + REPAIR_HUBS.length + REPAIR_ARTICLES.length} (index + hubs + articles)`);

if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  warnings.forEach(w => console.log(`  ! ${w}`));
}
if (errors.length) {
  console.log(`\nERRORS (${errors.length}):`);
  errors.forEach(e => console.log(`  X ${e}`));
  process.exit(1);
}
console.log(`\nOK — no integrity errors.`);
