#!/usr/bin/env node
/**
 * verify-deploy.mjs — confirm a deploy by CONTENT, never by HTTP status.
 *
 * WHY THIS EXISTS
 * On this site an HTTP 200 does not mean the page exists. app/[country]/[city]
 * is a root-level two-segment catch-all, and for months it answered 200 for any
 * /x/y URL. Even with that closed, a route that has not finished deploying can
 * still return 200 from a fallback.
 *
 * That single fact caused a repeated, embarrassing class of error: reporting
 * work as "live and verified" on the strength of a 200, when the page was not
 * there at all.
 *
 *   - /tools/building-suite-pro returned 200 -> recorded as a working tool.
 *     It never existed; the catch-all was faking it.
 *   - /generators/workshop-services returned 200 one second after push ->
 *     reported live. The title was actually "Page Not Found".
 *
 * Both times the mistake was mine and both times the fix was the same: check
 * for a string that ONLY the real page can contain. This script makes that the
 * default rather than something I have to remember.
 *
 * USAGE
 *   node scripts/verify-deploy.mjs                    # check every route in the manifest
 *   node scripts/verify-deploy.mjs --wait             # poll until all pass (deploy in progress)
 *   node scripts/verify-deploy.mjs /some/path "Marker text"   # ad-hoc single check
 *
 * EXIT
 *   0 = every route served its own content
 *   1 = at least one route is missing, stale, or served by a fallback
 */

const BASE = 'https://www.emersoneims.com';

/** Real-browser UA: middleware blocks unknown/headless agents. */
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

/**
 * Route -> a string only that page can produce.
 * Markers are deliberately taken from visible copy or a unique data value, not
 * from layout chrome that every page shares.
 */
const ROUTES = [
  ['/', 'GENERATORS · SOLAR · UPS'],
  ['/generators', 'Workshop Repairs'],
  ['/generators/workshop-services', 'Restore it. Rebuild it.'],
  ['/generators/spare-parts', 'Dispatch options'],
  ['/generators/spare-parts/filters', 'About filters'],
  ['/generators/spare-parts/control-panels', 'AMF (Automatic Mains Failure) controllers'],
  ['/generators/spare-parts/engine/6bt5-9', 'Spare parts for Cummins 6BT5.9'],
  ['/generators/spare-parts/engine/1104c-44', 'Spare parts for Perkins 1104C-44'],
  ['/services', 'mobile workshop comes to you'],
  ['/locations', 'mobile workshop team that covers all 47 counties'],
  ['/locations/nakuru', 'Our mobile workshop team serves Nakuru'],
  ['/kenya/mombasa', 'Mombasa'],
  ['/uganda/kampala', 'Kampala'],
  ['/sectors/supermarkets', 'Supermarkets'],
  ['/contact', 'Site Survey'],
  ['/booking', 'Site Survey'],
  ['/solar', 'Solar'],
  ['/hub', 'Hub'],
  ['/generator-oracle', 'Oracle'],
  ['/aquascan-pro-v3', 'AquaScan'],
  ['/solar-genius-pro', 'Solar'],
  ['/pro-building-suite', 'Building'],
];

/** URLs that MUST NOT resolve — proves the catch-all guard is still closed. */
const MUST_404 = [
  '/xyz/abc',
  '/regions/uganda',
  '/notarealsection/foo',
  '/generators/spare-parts/notreal',
  '/generators/spare-parts/engine/notreal',
];

/**
 * Normalise server-rendered HTML before matching.
 *
 * React splits a JSX line like `Spare parts for {label} generators` into
 * separate text nodes and inserts `<!-- -->` between them, so the rendered
 * markup reads "Spare parts for<!-- -->Cummins 6BT5.9<!-- --> generators".
 * A literal search for the sentence then fails on a page that is perfectly
 * fine — which is exactly the kind of false alarm this script exists to stop
 * me raising. Stripping comments, decoding the few entities that matter and
 * collapsing whitespace makes matching reflect what a reader actually sees.
 */
function normalise(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

async function fetchText(path) {
  const res = await fetch(BASE + path, {
    headers: { 'User-Agent': UA, 'Cache-Control': 'no-cache' },
    redirect: 'follow',
  });
  return { status: res.status, body: normalise(await res.text()) };
}

/** A page Next could not build renders this title even while returning 200. */
const FALLBACK_MARKERS = ['Page Not Found', 'This page could not be found'];

async function checkRoute(path, marker) {
  try {
    const { status, body } = await fetchText(path);
    if (status !== 200) return { ok: false, why: `HTTP ${status}` };
    for (const f of FALLBACK_MARKERS) {
      if (body.includes(f)) return { ok: false, why: `HTTP 200 but rendered "${f}" — fallback, not the real page` };
    }
    if (!body.includes(marker)) return { ok: false, why: `HTTP 200 but marker not found: "${marker}"` };
    return { ok: true };
  } catch (e) {
    return { ok: false, why: `request failed: ${e.message}` };
  }
}

async function check404(path) {
  try {
    const res = await fetch(BASE + path, { headers: { 'User-Agent': UA }, redirect: 'manual' });
    if (res.status === 404) return { ok: true };
    return { ok: false, why: `expected 404, got ${res.status} — soft-404 surface is open again` };
  } catch (e) {
    return { ok: false, why: `request failed: ${e.message}` };
  }
}

async function runOnce() {
  const failures = [];

  for (const [path, marker] of ROUTES) {
    const r = await checkRoute(path, marker);
    if (!r.ok) failures.push({ path, why: r.why });
  }
  for (const path of MUST_404) {
    const r = await check404(path);
    if (!r.ok) failures.push({ path, why: r.why });
  }
  return failures;
}

const args = process.argv.slice(2);

/**
 * Ad-hoc single check: node scripts/verify-deploy.mjs /path "Marker"
 *
 * Wrapped in a function with an early return. The first version fell straight
 * through into the manifest run below, so an ad-hoc check silently ran all 27
 * routes and then hit an unconditional process.exit(1) — every invocation
 * reported failure regardless of the actual result. Caught by testing the exit
 * codes rather than reading the output.
 */
async function main() {
  if (args.length === 2 && args[0].startsWith('/')) {
    const r = await checkRoute(args[0], args[1]);
    console.log(r.ok ? `✓ ${args[0]} — real content served` : `✖ ${args[0]} — ${r.why}`);
    // process.exitCode, not process.exit(): calling process.exit() while a
    // fetch handle is still closing aborts libuv on Windows with
    // "Assertion failed: !(handle->flags & UV_HANDLE_CLOSING)" and reports 127,
    // which would make this gate's exit code useless to CI.
    process.exitCode = r.ok ? 0 : 1;
    return;
  }
  await runManifest();
}

const wait = args.includes('--wait');
const MAX_ATTEMPTS = wait ? 20 : 1;

async function runManifest() {
  console.log('═══ deploy verification (content, not status) ═══');
  console.log(`  ${ROUTES.length} routes must serve their own content`);
  console.log(`  ${MUST_404.length} URLs must return 404\n`);

  let failures = [];
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    failures = await runOnce();
    if (failures.length === 0) {
      console.log(`  ✓ all ${ROUTES.length + MUST_404.length} checks passed${attempt > 1 ? ` (attempt ${attempt})` : ''}`);
      process.exitCode = 0;
      break;
    }
    if (attempt < MAX_ATTEMPTS) {
      console.log(`  attempt ${attempt}: ${failures.length} not ready, waiting 30s…`);
      await new Promise((r) => setTimeout(r, 30000));
    }
  }

  if (failures.length) {
    console.log(`\n  ✖ ${failures.length} check(s) failed:\n`);
    for (const f of failures) console.log(`    ${f.path}\n      ${f.why}`);
    console.log('\n  A 200 on this site does not prove a page exists — the catch-all and');
    console.log('  in-progress deploys both answer 200. Always verify the content.');
    process.exitCode = 1;
  }
}

await main();
