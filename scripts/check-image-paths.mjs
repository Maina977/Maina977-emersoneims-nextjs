/**
 * Find image paths in source that do not resolve to a file in public/.
 *
 * WHY THIS EXISTS
 * On 2026-09-21 every image path in lib/services/allServices.ts was checked
 * against public/images for the first time. The result:
 *
 *     referenced: 30   missing: 30
 *
 * Thirty for thirty. heroImage is consumed only by the OpenGraph block, so
 * nothing looked broken on the page — but og:image 404d on nine of the ten
 * service pages, and a share on WhatsApp or LinkedIn showed a bare link with
 * no preview. The fallback, /images/og-default.jpg, did not exist either.
 *
 * The images were in public/images the whole time under sensible names. The
 * registry simply pointed at names nobody had checked.
 *
 * This is invisible to everything else in the build. TypeScript sees a valid
 * string. next build does not resolve runtime image paths. A test asserting
 * HTTP 200 passes, because the page renders — only the picture is missing. It
 * is the same shape as the orphaned pages and the dead /maintenance-hub link:
 * work that is finished and wired to nothing.
 *
 * WHAT IT CHECKS
 * String literals that look like a site-absolute image path — starting /
 * and ending in an image extension — in app/, components/ and lib/. Each must
 * exist under public/. %20 and other percent-escapes are decoded first,
 * because a filename with spaces is written encoded in source and stored
 * decoded on disk.
 *
 * WHAT IT DOES NOT CHECK
 * Paths built at runtime from a variable. Those cannot be resolved statically,
 * and guessing at them would produce false failures — which is how a guard
 * gets switched off. Remote URLs are skipped: not ours to validate.
 *
 * NOT BLOCKING. Dead mirrors still carry old paths, and a missing decorative
 * image should not stop a deploy. It reports every run with the count first,
 * so a jump is obvious. Promote to error once the count reaches zero.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const PUBLIC = join(ROOT, 'public');
const SRC_DIRS = ['app', 'components', 'lib'];
const EXT = /\.(tsx|ts|jsx|js|json)$/;
const IMG = /\.(png|jpe?g|webp|avif|gif|svg|ico)$/i;

/** Mirrors and archives: reported, never counted against the build. */
const isDead = (rel) => /(^|[\\/])building([\\/]|$)/.test(rel) || /^_archive[\\/]/.test(rel);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const e of entries) {
    if (['node_modules', '.next', '.git'].includes(e)) continue;
    const p = join(dir, e);
    let s;
    try {
      s = statSync(p);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(p, out);
    else if (EXT.test(e)) out.push(p);
  }
  return out;
}

const files = SRC_DIRS.flatMap((d) => walk(join(ROOT, d)));

/*
 * A site-absolute image path inside a quote. Kept deliberately tight: it must
 * start with a slash and end in an image extension, so it cannot match a route,
 * a className or a sentence that happens to contain a dot.
 */
const PATTERN = /["'`](\/[A-Za-z0-9._%\-/() ]+\.(?:png|jpe?g|webp|avif|gif|svg|ico))["'`]/gi;

const live = [];
const dead = [];
const seen = new Set();

for (const f of files) {
  const rel = relative(ROOT, f).split(sep).join('/');
  let src;
  try {
    src = readFileSync(f, 'utf8');
  } catch {
    continue;
  }
  for (const m of src.matchAll(PATTERN)) {
    const raw = m[1];
    if (!IMG.test(raw)) continue;

    // A filename with spaces is written %20 in source and stored plain on disk.
    let decoded = raw;
    try {
      decoded = decodeURIComponent(raw);
    } catch {
      // Leave it as-is: a malformed escape is itself worth reporting.
    }

    if (existsSync(join(PUBLIC, decoded))) continue;

    const key = rel + '|' + raw;
    if (seen.has(key)) continue;
    seen.add(key);

    const line = src.slice(0, m.index).split('\n').length;
    (isDead(rel) ? dead : live).push({ rel, line, raw });
  }
}

live.sort((a, b) => (a.rel === b.rel ? a.line - b.line : a.rel.localeCompare(b.rel)));

console.log(`Image path guard — ${files.length} source files scanned`);
console.log(`  unresolved in live source: ${live.length}   in dead mirrors: ${dead.length}\n`);

if (live.length) {
  console.log('ADVISORY — these image paths do not resolve to a file in public/.');
  console.log('A page referencing one renders fine and shows nothing:\n');
  for (const h of live.slice(0, 40)) {
    console.log(`  ${h.rel}:${h.line}`);
    console.log(`      ${h.raw}`);
  }
  if (live.length > 40) console.log(`  ... and ${live.length - 40} more`);
  console.log('');
  console.log('  Check public/ before deleting the reference — on 2026-09-21 every');
  console.log('  one of these had a real photograph sitting under a different name.');
  console.log('');
} else {
  console.log('PASS — every static image path in live source resolves.\n');
}

process.exit(0);
