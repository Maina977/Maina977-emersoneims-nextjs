/**
 * BUILD GUARD — middleware guard 0h must know about every real /services page.
 *
 * WHY THIS EXISTS, AND IT IS NOT A HYPOTHETICAL
 * On 2026-09-25 /services/plumbing was added to ALL_SERVICES, prerendered by
 * `next build`, emitted into the sitemap at priority 0.85, and linked from the
 * footer of all 4,790 pages. It then answered **HTTP 404 in production**.
 *
 * Not a deploy failure — the response carried X-App-Commit for the right
 * commit, and the footer links from the same commit were live on the homepage.
 * The page was 404'd by middleware guard 0h, which holds an INLINED literal set
 * of valid /services slugs and had never been told about the new one.
 *
 * That guard is inlined for a good reason: a cross-module '@/lib' import has
 * been proven to fail open in this edge runtime, so the list cannot be imported
 * at runtime. The cost of inlining is that it drifts silently, and the failure
 * mode is the worst available — a real, linked, submitted page returning 404 to
 * Googlebot while every local check passes.
 *
 * WHAT IT CHECKS
 * OK_SERVICES in middleware.ts must be a SUPERSET of:
 *   - every slug in ALL_SERVICES (what /services/[service] prerenders), and
 *   - every static route folder under app/services.
 *
 * A superset, not an exact match: a slug may legitimately linger in the guard
 * after a page is retired, and blocking the build for that would be noise.
 * Missing entries are the failure that matters.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

/* ── What the guard currently allows ─────────────────────────────────────── */
const mw = read('middleware.ts');
const block = mw.match(/const OK_SERVICES = new Set\(\[([\s\S]*?)\]\);/);
if (!block) {
  console.error('check-services-guard: FAIL — could not find OK_SERVICES in middleware.ts.');
  console.error('  Guard 0h may have been renamed or removed. Fix this script or the guard.');
  process.exit(1);
}
const allowed = new Set([...block[1].matchAll(/'([^']+)'/g)].map((m) => m[1].toLowerCase()));

/* ── What actually exists ────────────────────────────────────────────────── */
const dynamicSlugs = [...read('lib/services/allServices.ts').matchAll(/^    slug: '([^']+)',$/gm)]
  .map((m) => m[1].toLowerCase());

const servicesDir = join(ROOT, 'app', 'services');
const staticSlugs = existsSync(servicesDir)
  ? readdirSync(servicesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('[') && !d.name.startsWith('('))
      .filter((d) => existsSync(join(servicesDir, d.name, 'page.tsx')))
      .map((d) => d.name.toLowerCase())
  : [];

const required = [...new Set([...dynamicSlugs, ...staticSlugs])].sort();
const missing = required.filter((s) => !allowed.has(s));

console.log(
  `check-services-guard: ${required.length} real /services pages ` +
    `(${dynamicSlugs.length} dynamic, ${staticSlugs.length} static), ` +
    `${allowed.size} allowed by middleware guard 0h`,
);

if (missing.length) {
  console.error('\nFAIL — real /services pages that middleware guard 0h would 404:\n');
  for (const s of missing) console.error(`  /services/${s}`);
  console.error(
    `\nAdd them to OK_SERVICES in middleware.ts (guard 0h).\n` +
      `A page that builds, sitemaps and links but 404s in production is the\n` +
      `most expensive bug this site can ship: Google sees a dead link on a URL\n` +
      `we told it to index.\n`,
  );
  process.exit(1);
}

console.log('PASS — every real /services page is allowed through middleware.');
