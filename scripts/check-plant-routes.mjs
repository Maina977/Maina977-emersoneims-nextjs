/*
 * Keep the plant fault-code pages and their middleware guards in sync.
 *
 * Two inlined copies have to agree with the data, and both drift silently:
 *
 *   OK_FAULTS must contain 'plant', or the index at /faults/plant hard-404s
 *   via the two-segment slug guard.
 *
 *   OK_PLANT_BRANDS (guard 0e-plant) must match BRAND_GROUPS exactly. A brand
 *   in the data but not the guard hard-404s in production while rendering
 *   perfectly in dev. A brand in the guard but not the data soft-404s — HTTP
 *   200 carrying a "not found" body — on a page built to be indexed.
 *
 * They are inlined rather than imported because a cross-module '@/lib' import
 * has been proven to fail open in this edge runtime.
 */
import fs from 'fs';

const DATA = 'lib/plant-oracle/oemFaultCodes.ts';
const MW = 'middleware.ts';
const MIN_CODES = 20; // must match MIN_CODES_FOR_PAGE in brandGroups.ts

const src = fs.readFileSync(DATA, 'utf8');
const mw = fs.readFileSync(MW, 'utf8');

// Rebuild the expected slugs from the data, the same way brandGroups.ts does.
const rows = [...src.matchAll(
  /\{\s*brand:\s*"([^"]+)",\s*family:\s*"([^"]+)",\s*code:\s*"([^"]+)",\s*description:\s*"([^"]+)"/g
)].map((m) => ({ brand: m[1], family: m[2] }));

if (!rows.length) {
  console.error(`check-plant-routes: FAIL — no fault codes parsed from ${DATA}. Did the shape change?`);
  process.exit(1);
}

const byKey = new Map();
for (const r of rows) {
  const k = `${r.brand}::${r.family}`;
  byKey.set(k, (byKey.get(k) || 0) + 1);
}
const slugify = (b, f) =>
  `${b}-${f}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);

const expected = [...byKey.entries()]
  .filter(([, n]) => n >= MIN_CODES)
  .map(([k]) => { const [b, f] = k.split('::'); return slugify(b, f); })
  .sort();

let failed = false;

// 1. 'plant' must be allowed under /faults.
if (!/const OK_FAULTS = new Set\(\[\s*'plant'/.test(mw)) {
  console.error("check-plant-routes: FAIL — 'plant' is missing from OK_FAULTS in middleware.ts.");
  console.error('  /faults/plant would hard-404 via the two-segment slug guard.');
  failed = true;
}

// 2. Guard 0e-plant must match the data.
const block = /OK_PLANT_BRANDS\s*=\s*new Set\(\[([\s\S]*?)\]\)/.exec(mw);
if (!block) {
  console.error('check-plant-routes: FAIL — guard 0e-plant (OK_PLANT_BRANDS) missing from middleware.ts.');
  console.error('  Every /faults/plant/<anything> would answer HTTP 200.');
  failed = true;
} else {
  const guarded = [...block[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]).sort();
  const missing = expected.filter((s) => !guarded.includes(s));
  const stale = guarded.filter((s) => !expected.includes(s));
  if (missing.length) {
    console.error(`check-plant-routes: FAIL — in the data but not guarded: ${missing.join(', ')}`);
    console.error('  These reference pages would hard-404 in production.');
    failed = true;
  }
  if (stale.length) {
    console.error(`check-plant-routes: FAIL — guarded but no longer in the data: ${stale.join(', ')}`);
    console.error('  These would soft-404: HTTP 200 with a "not found" body.');
    failed = true;
  }
}

if (failed) {
  console.error(`\n  Regenerate OK_PLANT_BRANDS in ${MW} from the groups in ${DATA}`);
  console.error(`  (brands with at least ${MIN_CODES} codes).`);
  process.exit(1);
}

const covered = [...byKey.entries()].filter(([, n]) => n >= MIN_CODES).reduce((n, [, c]) => n + c, 0);
console.log(`check-plant-routes: PASS — ${expected.length} reference pages, ${covered} codes, all guarded.`);
