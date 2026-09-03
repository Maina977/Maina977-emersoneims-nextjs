/*
 * Keep middleware guard 0b's inlined allowlist honest against
 * lib/seo/countyServices.json — the same list the /kenya route builds its
 * generateStaticParams from.
 *
 * WHY THIS IS A BUILD-BLOCKING CHECK. When these two disagree the failure is
 * completely silent: the page builds, the route prerenders it, and the guard
 * 308s every visitor and every crawler to the bare county page before the page
 * is ever reached. Nothing errors. Nothing appears in the build log. The only
 * way to see it is to request the URL on the deployed site.
 *
 * That is not hypothetical. On 2026-08-01 the allowlist was narrowed to 10
 * services while lib/data/seo-services.ts still defined 56, and 46 real
 * services — every AC, borehole, automation and incinerator page in all 47
 * counties — quietly became redirects. It was found on 2026-09-03, five weeks
 * later, only because the owner reported that enquiries had stopped.
 *
 * Run `node scripts/kenya-guard.mjs --write` to fix a failure here.
 */
import fs from 'node:fs';
import {
  MIDDLEWARE,
  readAllowlist,
  expectedAllowlist,
  countyServiceSlugs,
} from './kenya-guard.mjs';

const src = fs.readFileSync(MIDDLEWARE, 'utf8');

let current;
let expected;
try {
  current = readAllowlist(src).entries;
  expected = expectedAllowlist(src);
} catch (err) {
  console.error('check-kenya-guard: FAIL — ' + err.message);
  console.error('  Guard 0b protects /kenya/<county>/<...> from answering 200 for any slug.');
  process.exit(1);
}

const missing = [...expected].filter((k) => !current.has(k));
const extra = [...current].filter((k) => !expected.has(k));

if (missing.length || extra.length) {
  console.error('check-kenya-guard: FAIL — the allowlist and countyServices.json disagree.');
  if (missing.length) {
    console.error(`\n  ${missing.length} URL(s) the route builds but the guard would redirect away.`);
    console.error('  These pages would be unreachable in production and fine in dev:');
    missing.slice(0, 8).forEach((k) => console.error(`      /kenya/${k}`));
    if (missing.length > 8) console.error(`      ... and ${missing.length - 8} more`);
  }
  if (extra.length) {
    console.error(`\n  ${extra.length} URL(s) the guard admits but the route no longer builds.`);
    console.error('  With dynamicParams = false these answer 404 instead of redirecting:');
    extra.slice(0, 8).forEach((k) => console.error(`      /kenya/${k}`));
    if (extra.length > 8) console.error(`      ... and ${extra.length - 8} more`);
  }
  console.error('\n  Fix: node scripts/kenya-guard.mjs --write');
  process.exit(1);
}

console.log(
  `check-kenya-guard: PASS — ${current.size} allowlisted /kenya paths, ` +
  `${countyServiceSlugs().length} services per county, guard and route agree.`,
);
