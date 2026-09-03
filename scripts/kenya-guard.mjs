/*
 * The /kenya allowlist that middleware guard 0b enforces.
 *
 * Guard 0b holds an INLINED Set of "county/slug" keys. It is inlined because a
 * cross-module '@/lib' import has been proven to fail open in this edge
 * runtime — the same reason guard 0i inlines its map. An inlined set is a copy,
 * and until 2026-09-03 this one was maintained by hand: 1,427 entries on a
 * single 46KB line, with no generator and nothing checking it.
 *
 * Both directions of drift are silent and expensive:
 *
 *   1. A service is added to lib/seo/countyServices.json but not to the guard.
 *      The route prerenders the page, the guard 308s it to the bare county
 *      page, and the page can never be reached. This is exactly what happened
 *      on 2026-08-01 to 46 real services at once.
 *   2. A service is removed from the JSON but left in the guard. The guard
 *      admits a URL the route no longer builds, and with dynamicParams = false
 *      that is a 404 where a redirect belongs.
 *
 * So the county tier is GENERATED from the same JSON the route reads.
 *
 * SCOPE — this file owns the county tier only: <county>/<service>, one segment.
 * Constituency entries (<county>/<constituency> and
 * <county>/<constituency>/<service>) are preserved untouched from whatever is
 * already in middleware.ts. They come from per-county constituency data that
 * lives in TypeScript this script cannot import, and they are not what the
 * 2026-09-03 restoration changed.
 *
 *   node scripts/kenya-guard.mjs           report the diff, change nothing
 *   node scripts/kenya-guard.mjs --write   rewrite the Set in middleware.ts
 */
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export const MIDDLEWARE = 'middleware.ts';
const JSON_PATH = 'lib/seo/countyServices.json';

function config() {
  return JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
}

/** Every service slug that earns a page at county level. */
export function countyServiceSlugs() {
  const cfg = config();
  return [...cfg.core, ...Object.values(cfg.restored).flat()];
}

/**
 * Every slug this script is allowed to govern — enabled AND excluded.
 *
 * Needed because "<county>/<segment>" is ambiguous: nairobi/ac-repair is a
 * service, kajiado/kajiado-central is a constituency landing page. Only a slug
 * known to be a service may be rewritten or removed. Without this the first
 * dry run proposed deleting 87 constituency pages, which would have 404'd them
 * all — the same class of failure this restoration exists to undo.
 */
function managedServiceSlugs() {
  const cfg = config();
  return new Set([...countyServiceSlugs(), ...cfg.excluded]);
}

/** The 47 county slugs, read from the guard's own inlined list. */
export function countySlugs(src) {
  const m = /const KENYA_COUNTIES = new Set\(\[([^\]]*)\]\)/.exec(src);
  if (!m) throw new Error('KENYA_COUNTIES not found in ' + MIDDLEWARE);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

/** The allowlist as it currently stands, plus the exact text to splice. */
export function readAllowlist(src) {
  const m = /(const OK_KENYA_PATHS = new Set\(\[)([\s\S]*?)(\]\))/.exec(src);
  if (!m) throw new Error('OK_KENYA_PATHS not found in ' + MIDDLEWARE);
  return {
    entries: new Set([...m[2].matchAll(/'([^']+)'/g)].map((x) => x[1])),
    full: m[0],
    open: m[1],
    close: m[3],
  };
}

/** What the allowlist must contain: existing constituency keys + county tier. */
export function expectedAllowlist(src) {
  const { entries } = readAllowlist(src);
  const counties = countySlugs(src);
  const services = countyServiceSlugs();

  // Preserve everything this script does not govern. A key is county-tier only
  // when it is "<known county>/<known service>". Two-part keys whose second
  // segment is a CONSTITUENCY (kajiado/kajiado-central) look identical in shape
  // and must survive untouched, as must every deeper constituency+service key.
  const countySet = new Set(counties);
  const managed = managedServiceSlugs();
  const preserved = [...entries].filter((key) => {
    const parts = key.split('/');
    if (parts.length !== 2) return true;
    return !(countySet.has(parts[0]) && managed.has(parts[1]));
  });

  const countyTier = [];
  for (const county of counties) {
    for (const service of services) countyTier.push(`${county}/${service}`);
  }

  return new Set([...preserved, ...countyTier]);
}

export function serialise(set) {
  return [...set].sort().map((k) => `'${k}'`).join(',');
}

// ── CLI ──────────────────────────────────────────────────────────────────────
// pathToFileURL, not a string compare: this repo lives under a path with spaces
// ("MY WEBSITE RECOVERY FOLDER"), so import.meta.url is percent-encoded and a
// naive endsWith() against argv[1] never matches — the script silently does
// nothing, which is how this was first written.
const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? '').href;
if (isMain) {
  const src = fs.readFileSync(MIDDLEWARE, 'utf8');
  const current = readAllowlist(src);
  const expected = expectedAllowlist(src);

  const added = [...expected].filter((k) => !current.entries.has(k));
  const removed = [...current.entries].filter((k) => !expected.has(k));

  console.log(`kenya-guard: ${current.entries.size} entries now, ${expected.size} expected`);
  console.log(`  county-tier services: ${countyServiceSlugs().length}`);
  console.log(`  to add:    ${added.length}`);
  console.log(`  to remove: ${removed.length}`);
  if (added.length) console.log('  e.g. ' + added.slice(0, 4).join(', '));
  if (removed.length) console.log('  e.g. ' + removed.slice(0, 4).join(', '));

  if (process.argv.includes('--write')) {
    if (!added.length && !removed.length) {
      console.log('kenya-guard: already in sync, nothing written.');
    } else {
      fs.writeFileSync(
        MIDDLEWARE,
        src.replace(current.full, current.open + serialise(expected) + current.close),
      );
      console.log(`kenya-guard: middleware.ts rewritten with ${expected.size} entries.`);
    }
  } else if (added.length || removed.length) {
    console.log('kenya-guard: run with --write to apply.');
  }
}
