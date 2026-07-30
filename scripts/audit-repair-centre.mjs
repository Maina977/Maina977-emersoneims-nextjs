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
 *  8. middleware guard 0f is in sync with the registry
 *  9. JSON-LD is emitted so it reaches the server-rendered HTML
 *
 * With --live it ALSO checks what the deployed server actually returns, which
 * is the only thing that has ever caught the real defects here. Source that
 * reads correctly has repeatedly shipped broken: notFound() and
 * dynamicParams=false both still served HTTP 200, and next/script emitted
 * JSON-LD that never appeared in the HTML. Both looked right in the editor.
 *
 * The live pass asserts, for every registry route:
 *   - published URLs return 200
 *   - a NEGATIVE CONTROL (a slug that must not exist) returns 404 — without
 *     this, a soft-404 is indistinguishable from a healthy page
 *   - articles carry TechArticle + BreadcrumbList in the initial HTML
 *   - hubs and the index carry BreadcrumbList
 *   - the article's own heading is actually in the HTML
 *
 * Usage:
 *   node scripts/audit-repair-centre.mjs            # before commit
 *   node scripts/audit-repair-centre.mjs --live     # after deploy
 */

import { build } from 'esbuild';
import { readFileSync, unlinkSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const root = process.cwd();
const out = path.join(root, '.repair-audit.bundle.mjs');

const coverageOut = path.join(root, '.repair-audit.coverage.mjs');
await build({
  entryPoints: [path.join(root, 'lib/repair-centre/hubCoverage.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: coverageOut,
  alias: { '@': root },
  logLevel: 'silent',
});
const { HUB_COVERAGE } = await import(pathToFileURL(coverageOut).href);
unlinkSync(coverageOut);

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

// 6b. Hub scope must not promise coverage the site does not have.
//
// A hub page prints its scope list to a technician. Before this check, ten of
// the fifteen hubs listed more topics than they had guides for — /repair-centre/solar
// advertised six topics over two articles, and the article covering one of them
// ("DC bus and isolation faults") sat in the inverters hub, linked from nowhere.
// The page made a promise the site did not keep.
//
// The rule is not "every scope item must have a guide" — writing takes time, and
// declaring a gap honestly is fine. The rule is that the mapping must be REAL:
// every hub needs a coverage entry, every key must be an actual scope label on
// that hub, and every slug must be an actual article. That way an uncovered topic
// is a deliberate, visible gap rather than an accident nobody noticed.
for (const h of REPAIR_HUBS) {
  const cov = HUB_COVERAGE[h.slug];
  if (!cov) {
    errors.push(`Hub "${h.slug}" has no entry in hubCoverage.ts — its scope list would render unlinked`);
    continue;
  }
  const scopeSet = new Set(h.scope);
  for (const label of Object.keys(cov.covers)) {
    if (!scopeSet.has(label)) {
      errors.push(`Hub "${h.slug}" coverage key "${label}" is not one of its scope items (typo or stale label)`);
    }
    for (const s of cov.covers[label]) {
      if (!slugSet.has(s)) {
        errors.push(`Hub "${h.slug}" scope "${label}" claims article "${s}" which does not exist`);
      }
    }
  }
  for (const sib of cov.siblings) {
    if (!hubSet.has(sib)) errors.push(`Hub "${h.slug}" sibling "${sib}" is not a real hub`);
    if (sib === h.slug) errors.push(`Hub "${h.slug}" lists itself as a sibling`);
  }
  // Every article filed in a hub must be reachable from that hub's scope, or it
  // is an orphan sitting under a scope list that never claims its subject —
  // exactly what happened to solar-charge-controller-not-charging.
  const claimed = new Set(Object.values(cov.covers).flat());
  for (const a of REPAIR_ARTICLES.filter(x => x.hub === h.slug)) {
    if (!claimed.has(a.slug)) {
      errors.push(`Article "${a.slug}" is in hub "${h.slug}" but no scope item claims it`);
    }
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

// 10. LIVE pass (--live): assert what the deployed server actually returns.
//     Everything above reads source. This reads the wire.
const LIVE = process.argv.includes('--live');
const liveResults = [];
if (LIVE) {
  const BASE = process.env.AUDIT_BASE_URL || 'https://www.emersoneims.com';
  const UA =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

  async function fetchPage(url) {
    const res = await fetch(url, { headers: { 'User-Agent': UA }, redirect: 'follow' });
    return { status: res.status, html: res.status === 200 ? await res.text() : '' };
  }
  const schemaTypes = html =>
    new Set([...html.matchAll(/"@type":"([A-Za-z]+)"/g)].map(m => m[1]));

  // Positive: every published route must be 200 and carry its own schema.
  const positives = [
    { url: `${BASE}/repair-centre`, needs: ['BreadcrumbList', 'CollectionPage'] },
    ...REPAIR_HUBS.map(h => ({ url: `${BASE}/repair-centre/${h.slug}`, needs: ['BreadcrumbList'] })),
    ...REPAIR_ARTICLES.map(a => ({
      url: `${BASE}/repair-centre/${a.hub}/${a.slug}`,
      needs: ['TechArticle', 'BreadcrumbList'],
      text: a.header.title,
      // Section 6 requires the decision tree as a VISUAL flowchart as well as
      // written steps. Inline SVG must therefore be in the server HTML.
      html: ['<svg', 'Diagnostic decision flowchart'],
    })),
  ];

  for (const p of positives) {
    let r;
    try {
      r = await fetchPage(p.url);
    } catch (e) {
      errors.push(`LIVE ${p.url}: request failed (${e.message})`);
      continue;
    }
    if (r.status !== 200) {
      errors.push(`LIVE ${p.url}: expected 200, got ${r.status}`);
      continue;
    }
    const types = schemaTypes(r.html);
    for (const t of p.needs) {
      if (!types.has(t)) {
        errors.push(`LIVE ${p.url}: schema "${t}" missing from server-rendered HTML`);
      }
    }
    if (p.text && !r.html.includes(p.text)) {
      errors.push(`LIVE ${p.url}: article heading not present in HTML — page rendered but content is missing`);
    }
    for (const frag of p.html ?? []) {
      if (!r.html.includes(frag)) {
        errors.push(`LIVE ${p.url}: expected markup "${frag}" missing from server-rendered HTML`);
      }
    }
    liveResults.push(`200 ${p.url.replace(BASE, '')}`);
  }

  // Negative controls. Without these a soft-404 looks exactly like success.
  const firstArticle = REPAIR_ARTICLES[0];
  const wrongHub = REPAIR_HUBS.find(h => h.slug !== firstArticle?.hub);
  const negatives = [
    `${BASE}/repair-centre/__no_such_hub__`,
    `${BASE}/repair-centre/${REPAIR_HUBS[0]?.slug}/__no_such_article__`,
    ...(firstArticle && wrongHub
      ? [`${BASE}/repair-centre/${wrongHub.slug}/${firstArticle.slug}`]
      : []),
  ];
  // Site-wide soft-404 controls. These routes are outside the Repair Centre but
  // have each shipped a soft-404 at some point, and /services is the commercial
  // core. Checking them here means one command catches a regression anywhere the
  // problem has previously occurred, rather than only where it was last fixed.
  const siteNegatives = [
    `${BASE}/services/__no_such_service__`,
    `${BASE}/blog/__no_such_post__`,
    `${BASE}/brands/__no_such_brand__/kenya/nairobi`,
    `${BASE}/sectors/__no_such_sector__/kenya/nairobi`,
  ];
  // And the pages that must NOT be caught by those guards.
  const sitePositives = [
    `${BASE}/services`,
    `${BASE}/services/generator-repairs`,
    `${BASE}/services/air-conditioning`,
    `${BASE}/blog`,
    `${BASE}/blog/generator-buying-guide-kenya`,
    `${BASE}/blog/three-phase-power-explained`,
    `${BASE}/sectors`,
  ];
  for (const url of siteNegatives) {
    try {
      const r = await fetchPage(url);
      if (r.status !== 404) {
        errors.push(`LIVE ${url}: expected 404, got ${r.status} — SOFT-404 regression outside the Repair Centre`);
      } else {
        liveResults.push(`404 ${url.replace(BASE, '')} (site negative control)`);
      }
    } catch (e) {
      errors.push(`LIVE ${url}: request failed (${e.message})`);
    }
  }
  for (const url of sitePositives) {
    try {
      const r = await fetchPage(url);
      if (r.status !== 200) {
        errors.push(`LIVE ${url}: expected 200, got ${r.status} — a guard is 404ing a real page`);
      } else {
        liveResults.push(`200 ${url.replace(BASE, '')}`);
      }
    } catch (e) {
      errors.push(`LIVE ${url}: request failed (${e.message})`);
    }
  }

  for (const url of negatives) {
    let r;
    try {
      r = await fetchPage(url);
    } catch (e) {
      errors.push(`LIVE ${url}: request failed (${e.message})`);
      continue;
    }
    if (r.status !== 404) {
      errors.push(`LIVE ${url}: expected 404, got ${r.status} — SOFT-404, middleware guard not covering this`);
    } else {
      liveResults.push(`404 ${url.replace(BASE, '')} (negative control)`);
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

if (LIVE) {
  console.log(`\nLIVE checks (${liveResults.length} passed):`);
  liveResults.forEach(r => console.log(`  ${r}`));
} else {
  console.log(`  (source-only — run with --live after deploy to check what the server returns)`);
}

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
