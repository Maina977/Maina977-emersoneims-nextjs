#!/usr/bin/env node
/**
 * check-bsp-routes — every Building Suite Pro slug must resolve to the wizard.
 *
 * WHY THIS EXISTS
 * lib/buildingSuitePro/featureRoutes.ts calls itself the "Single Source of
 * Truth for Feature Routes" and its own header comment says these slugs
 * "404'd in production — repeatedly, because every 'fix' patched only one or
 * two symptoms and left the rest fragmented."
 *
 * That is exactly what happened again. On 2026-08-08 the registry declared 22
 * slugs. Twelve served HTTP 200 with a self-contradicting
 * noindex + canonical-to-/solutions/building pair, and TEN — including /boq
 * and /quantity-surveying, the highest-intent terms the tool has — returned a
 * flat 404. The registry promised routes that "exist automatically because
 * app/(building)/(bsp-feature-routes)/ builds them dynamically"; that
 * directory has never existed.
 *
 * A source of truth nothing verifies is just a comment. This gate makes the
 * claim enforceable: if a slug or alias is added to the registry and no
 * redirect is added to next.config.ts, the build fails here rather than
 * silently shipping another dead URL.
 *
 * Deliberately parses both files as TEXT. next.config.ts cannot import a .ts
 * module at config-load time, and this script must run under plain node in
 * prebuild, so regex extraction is the honest option. It is strict about what
 * it accepts and reports anything it cannot parse instead of passing quietly.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const REGISTRY = path.join(ROOT, 'lib', 'buildingSuitePro', 'featureRoutes.ts');
const CONFIG = path.join(ROOT, 'next.config.ts');

/* /console is intentionally excluded: it canonicalises to the console SPA,
 * not to /solutions/building, and the wizard iframes it with hash fragments
 * at runtime. It is not part of the redirect cluster. */
const EXEMPT = new Set(['console']);

const fail = (msg) => { console.error(`check-bsp-routes: ${msg}`); process.exitCode = 1; };

for (const f of [REGISTRY, CONFIG]) {
  if (!fs.existsSync(f)) { fail(`missing ${path.relative(ROOT, f)}`); process.exit(1); }
}

const registrySrc = fs.readFileSync(REGISTRY, 'utf8');
const configSrc = fs.readFileSync(CONFIG, 'utf8');

/* Pull the BSP_FEATURES array body, then one entry per `{ slug: ... }`. */
const arrStart = registrySrc.indexOf('BSP_FEATURES');
if (arrStart < 0) { fail('BSP_FEATURES not found in the registry'); process.exit(1); }
const arrBody = registrySrc.slice(registrySrc.indexOf('[', arrStart), registrySrc.indexOf('] as const', arrStart));

const expected = new Map(); // slug -> mode
for (const m of arrBody.matchAll(/\{\s*slug:\s*'([^']+)'\s*,\s*mode:\s*'([^']+)'[^}]*\}/g)) {
  const [, slug, mode] = m;
  expected.set(slug, mode);
  const aliasBlock = /aliases:\s*\[([^\]]*)\]/.exec(m[0]);
  if (aliasBlock) {
    for (const a of aliasBlock[1].matchAll(/'([^']+)'/g)) expected.set(a[1], mode);
  }
}

if (expected.size === 0) { fail('parsed zero slugs from BSP_FEATURES — the registry format changed'); process.exit(1); }

/* Every redirect source -> destination declared in next.config.ts. */
const redirects = new Map();
for (const m of configSrc.matchAll(/\{\s*source:\s*'([^']+)'\s*,\s*destination:\s*'([^']+)'\s*,\s*permanent:\s*true\s*\}/g)) {
  redirects.set(m[1], m[2]);
}

let missing = 0;
let wrongMode = 0;
for (const [slug, mode] of expected) {
  if (EXEMPT.has(slug)) continue;
  const dest = redirects.get(`/${slug}`);
  if (!dest) {
    fail(`/${slug} is in the registry but has no permanent redirect in next.config.ts`);
    missing++;
    continue;
  }
  if (!dest.startsWith('/solutions/building')) {
    fail(`/${slug} redirects to ${dest}, which is not the Building Suite wizard`);
    wrongMode++;
    continue;
  }
  const got = /[?&]mode=([^&]+)/.exec(dest)?.[1];
  if (got !== mode) {
    fail(`/${slug} should open wizard mode "${mode}" but its redirect says "${got ?? '(none)'}"`);
    wrongMode++;
  }
}

const checked = expected.size - [...expected.keys()].filter((s) => EXEMPT.has(s)).length;
if (missing || wrongMode) {
  console.error(`check-bsp-routes: FAIL — ${missing} missing, ${wrongMode} wrong destination, of ${checked} registry slugs.`);
} else {
  console.log(`check-bsp-routes: PASS — all ${checked} Building Suite slugs redirect to the wizard with the right mode.`);
}
