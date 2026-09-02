/*
 * Fail the build if the pricing guides and their middleware allow-list drift.
 *
 * WHY THIS EXISTS
 * /pricing/[slug] is guarded in middleware (guard 0e-price) because notFound()
 * does not produce a 404 status on Next 16 — see app/repair-centre/[hub]/page.tsx
 * and the soft-404 history. The guard holds an INLINED copy of the valid slugs,
 * inlined deliberately: a cross-module '@/lib' import has been proven to fail
 * open in this edge runtime.
 *
 * An inlined copy is a copy, and copies drift. The two ways it breaks are both
 * silent and both damaging:
 *
 *   1. A guide is added to PRICE_GUIDES but not to the guard. The page exists,
 *      renders correctly in dev, and hard-404s in production — an invisible
 *      money page.
 *   2. A guide is renamed or removed but left in the guard. That slug then
 *      falls through to the route, which calls notFound(), which returns
 *      HTTP 200 with a 404 body — the soft-404 that damages site-wide quality.
 *
 * Both are caught here, at build time, where they cost nothing.
 */
import fs from 'fs';

const SRC = 'lib/pricing/publishedPrices.ts';
const MW = 'middleware.ts';

const src = fs.readFileSync(SRC, 'utf8');
const mw = fs.readFileSync(MW, 'utf8');

// Slugs as the data module declares them.
const declared = [...src.matchAll(/^\s{4}slug:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1]);

// Slugs as the guard enforces them.
const guardBlock = /OK_PRICE_GUIDES\s*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(mw);
if (!guardBlock) {
  console.error('check-pricing-routes: FAIL — guard 0e-price (OK_PRICE_GUIDES) not found in middleware.ts.');
  console.error('  Every /pricing/<slug> would answer HTTP 200, including invented ones.');
  process.exit(1);
}
const guarded = [...guardBlock[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);

if (!declared.length) {
  console.error(`check-pricing-routes: FAIL — no slugs parsed from ${SRC}. Did the shape change?`);
  process.exit(1);
}

const missingFromGuard = declared.filter((s) => !guarded.includes(s));
const staleInGuard = guarded.filter((s) => !declared.includes(s));

// The segment must also be routable at all: middleware hard-404s any top-level
// segment absent from ROUTE_SEGMENTS, which would take out every guide at once.
const segmentOk = /ROUTE_SEGMENTS\s*=\s*new Set\(\[[^\]]*'pricing'/.test(mw);

let failed = false;

if (!segmentOk) {
  console.error("check-pricing-routes: FAIL — 'pricing' is missing from ROUTE_SEGMENTS in middleware.ts.");
  console.error('  Without it EVERY /pricing/* page hard-404s, verified 2026-08-25.');
  failed = true;
}
if (missingFromGuard.length) {
  console.error(`check-pricing-routes: FAIL — declared but not in the middleware guard: ${missingFromGuard.join(', ')}`);
  console.error('  These pages would hard-404 in production while looking fine in dev.');
  failed = true;
}
if (staleInGuard.length) {
  console.error(`check-pricing-routes: FAIL — in the middleware guard but no longer declared: ${staleInGuard.join(', ')}`);
  console.error('  These would soft-404: HTTP 200 carrying a "not found" body.');
  failed = true;
}

if (failed) {
  console.error(`\n  Fix by keeping PRICE_GUIDES in ${SRC} and OK_PRICE_GUIDES in ${MW} identical.`);
  process.exit(1);
}

console.log(`check-pricing-routes: PASS — ${declared.length} price guides, all routable and all guarded.`);
