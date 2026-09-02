/*
 * Keep middleware guard 0i honest against the app/ directory.
 *
 * Guard 0i hard-404s /<segment>/<child> when the child is not a real route. It
 * holds an INLINED map, inlined because a cross-module '@/lib' import has been
 * proven to fail open in this edge runtime. An inlined map is a copy, and a
 * copy drifts. Both directions of drift are silent and damaging:
 *
 *   1. A new page is added under a guarded segment but not to the map. The
 *      page renders perfectly in dev and HARD-404s in production. This has
 *      happened here before: on 2026-07-31 eight segments were missing from
 *      the catch-all set and the guard 404'd real published pages, including
 *      the whole /marketplace checkout flow and all of /east-africa.
 *   2. A page is deleted but left in the map. That path then soft-404s —
 *      HTTP 200 carrying a "not found" body — which is the defect guard 0i
 *      exists to remove.
 *
 * Regenerate from the filesystem and compare. Fail loudly on any difference.
 */
import fs from 'fs';
import { buildSegmentMap, serialiseMap, GUARDED_SEGMENTS } from './segment-children.mjs';

const MW = 'middleware.ts';
const mw = fs.readFileSync(MW, 'utf8');

const found = /const SEG_CHILDREN: Record<string, string\[\]> = (\{[\s\S]*?\});/.exec(mw);
if (!found) {
  console.error('check-segment-guard: FAIL — guard 0i (SEG_CHILDREN) is missing from middleware.ts.');
  console.error('  Without it, 40 top-level segments answer HTTP 200 to any invented child URL.');
  process.exit(1);
}

const { map, skipped } = buildSegmentMap('app');
const expected = serialiseMap(map);
const actual = found[1].replace(/\s+/g, '');

if (actual === expected) {
  const total = Object.values(map).reduce((n, v) => n + v.length, 0);
  console.log(
    `check-segment-guard: PASS — ${Object.keys(map).length} segments, ${total} real children guarded` +
    (skipped.length ? ` (skipped, dynamic child: ${skipped.join(', ')})` : '')
  );
  process.exit(0);
}

// Report the difference in terms of pages, which is what actually matters.
const parse = (lit) => {
  const out = {};
  for (const m of lit.matchAll(/'([^']+)':\[([^\]]*)\]/g)) {
    out[m[1]] = m[2] ? m[2].split(',').map((x) => x.replace(/'/g, '')) : [];
  }
  return out;
};
const a = parse(actual);
const e = parse(expected);

console.error('check-segment-guard: FAIL — guard 0i has drifted from the app/ directory.\n');

for (const seg of new Set([...Object.keys(a), ...Object.keys(e)])) {
  const inGuard = a[seg] || [];
  const onDisk = e[seg] || [];
  const wouldHard404 = onDisk.filter((c) => !inGuard.includes(c));
  const wouldSoft404 = inGuard.filter((c) => !onDisk.includes(c));
  if (wouldHard404.length) {
    console.error(`  /${seg} — real pages the guard would HARD-404: ${wouldHard404.map((c) => '/' + seg + '/' + c).join(', ')}`);
  }
  if (wouldSoft404.length) {
    console.error(`  /${seg} — gone from disk but still allowed (soft-404): ${wouldSoft404.map((c) => '/' + seg + '/' + c).join(', ')}`);
  }
  if (!a[seg] && e[seg]) console.error(`  /${seg} — segment missing from the guard entirely`);
}

console.error(`\n  Regenerate the SEG_CHILDREN literal in ${MW} from scripts/segment-children.mjs.`);
console.error(`  Guarded segment list lives in that module (${GUARDED_SEGMENTS.length} segments).`);
process.exit(1);
