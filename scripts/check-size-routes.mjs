/*
 * Keep GENERATOR_SIZES and middleware guard 0e-size identical.
 *
 * Same failure modes as the pricing guard, and the same reason the list is
 * inlined in middleware: a cross-module '@/lib' import has been proven to fail
 * open in this edge runtime.
 *
 *   - A size added to the data but not the guard HARD-404s in production while
 *     rendering perfectly in dev — an invisible product page.
 *   - A size removed from the data but left in the guard SOFT-404s: HTTP 200
 *     carrying a "not found" body, on exactly the commercial URLs we want
 *     Google to trust.
 */
import fs from 'fs';

const DATA = 'lib/products/generatorSizes.ts';
const MW = 'middleware.ts';

const declared = [...fs.readFileSync(DATA, 'utf8').matchAll(/slug:\s*'([0-9]+-kva)'/g)].map((m) => m[1]);
const block = /OK_GEN_SIZES\s*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(fs.readFileSync(MW, 'utf8'));

if (!block) {
  console.error('check-size-routes: FAIL — guard 0e-size (OK_GEN_SIZES) missing from middleware.ts.');
  console.error('  Every /generators/sizes/<anything> would answer HTTP 200.');
  process.exit(1);
}
if (!declared.length) {
  console.error(`check-size-routes: FAIL — no sizes parsed from ${DATA}. Did the shape change?`);
  process.exit(1);
}

const guarded = [...block[1].matchAll(/'([0-9]+-kva)'/g)].map((m) => m[1]);
const missing = declared.filter((s) => !guarded.includes(s));
const stale = guarded.filter((s) => !declared.includes(s));

let failed = false;
if (missing.length) {
  console.error(`check-size-routes: FAIL — declared but not guarded: ${missing.join(', ')}`);
  console.error('  These product pages would hard-404 in production.');
  failed = true;
}
if (stale.length) {
  console.error(`check-size-routes: FAIL — guarded but no longer declared: ${stale.join(', ')}`);
  console.error('  These would soft-404: HTTP 200 with a "not found" body.');
  failed = true;
}
if (failed) {
  console.error(`\n  Keep GENERATOR_SIZES in ${DATA} and OK_GEN_SIZES in ${MW} identical.`);
  process.exit(1);
}
console.log(`check-size-routes: PASS — ${declared.length} generator size pages, all guarded.`);
