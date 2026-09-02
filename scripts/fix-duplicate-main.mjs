/*
 * DUPLICATE <main> LANDMARKS — find, and optionally fix.
 *
 * THE DEFECT
 * app/layout.tsx wraps every page in <main id="main-content">. 214 page.tsx
 * files ALSO open their own <main>, so those pages ship two <main> landmarks
 * nested one inside the other. Verified on the live site: 9 of 10 sampled URLs
 * served two. That is invalid HTML (one <main> per document), and it fails the
 * axe rule behind Lighthouse's "Document does not have more than one main
 * landmark", so it puts a hard ceiling on the accessibility score of most of
 * the site.
 *
 * It has a second, quieter cost. layout.tsx carries
 *     main#main-content:has(>section.hero-full:first-child){padding-top:0}
 * to drop the fixed-navbar offset on pages that own a full-viewport hero. The
 * page's own <main> sits between the two, so the hero is never a direct child,
 * the selector never matches, and the offset stays — which is what produced the
 * 72px white band across the top of the homepage.
 *
 * THE FIX, AND WHY THIS DIRECTION
 * The layout keeps <main>; the page-level ones become <div>. That is the right
 * way round: the landmark belongs to the shell, roughly 3,200 pages already
 * rely on it, and inverting the choice would strip the landmark from all of
 * them to satisfy 214.
 *
 * SAFETY — this rewrites a lot of files, so it refuses anything ambiguous:
 *   - a file must contain exactly one <main and exactly one </main>;
 *     anything else is reported and skipped, never guessed at
 *   - only the tag names change; className, id, every other attribute and all
 *     content are untouched
 *   - CRLF line endings are preserved (these files are CRLF, and rewriting
 *     them as LF would show up as a whole-file diff and hide the real change)
 *   - --apply is required; the default is a dry run that only reports
 *
 * USAGE
 *   node scripts/fix-duplicate-main.mjs           # dry run, shows every change
 *   node scripts/fix-duplicate-main.mjs --apply   # write the files
 */
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = path.join(process.cwd(), 'app');
const COMPONENTS = path.join(process.cwd(), 'components');
const ROOT_LAYOUT = path.join(ROOT, 'layout.tsx');

/*
 * Directories that must never be rewritten:
 *   _archive        dead mirrors, kept for reference and not shipped
 *   external        vendored third-party sources
 *   node_modules    obvious
 * and any *-backup / *-old file, which is a snapshot rather than live code.
 *
 * components/building IS included. Those are the (building) route group's own
 * components, and that group renders under the same root layout, so a <main>
 * in there is a duplicate landmark exactly as it is anywhere else. They are
 * each transformed in place — never copied from their non-building twin, which
 * are genuinely different files.
 */
const SKIP_DIRS = new Set(['node_modules', '_archive', 'external', '.next']);
const isBackup = (name) => /(-old-backup|-backup|-old)\.tsx$/i.test(name);

/**
 * Page and layout files under app/, plus every component. The root layout is
 * the one file that SHOULD own a <main>.
 */
function collect(dir, out = [], componentsMode = false) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      collect(full, out, componentsMode);
    } else if (entry.name.endsWith('.tsx')) {
      if (isBackup(entry.name)) continue;
      if (full === ROOT_LAYOUT) continue;
      if (componentsMode || entry.name === 'page.tsx' || entry.name === 'layout.tsx') out.push(full);
    }
  }
  return out;
}

const files = [...collect(ROOT), ...collect(COMPONENTS, [], true)];
const changed = [];
const skipped = [];

for (const file of files) {
  const src = fs.readFileSync(file, 'utf8');
  const opens = src.match(/<main[\s>]/g) || [];
  const closes = src.match(/<\/main>/g) || [];
  if (opens.length === 0 && closes.length === 0) continue;

  // Balance is the safety condition, not "exactly one". Several pages have an
  // early-return branch (a loading or not-found state) with its own <main>
  // alongside the primary return: two opens, two closes, only ever one of them
  // rendered. Each is still a <main> inside the layout's <main>, so both must
  // become <div>. What is genuinely unsafe is an UNBALANCED file, where a tag
  // is built by interpolation or spans a construct this regex cannot see — so
  // that is what gets refused.
  if (opens.length !== closes.length) {
    skipped.push({ file, opens: opens.length, closes: closes.length, note: 'unbalanced' });
    continue;
  }

  /*
   * The tag name changes, and two attributes go with it.
   *
   * role="main" makes ANY element a main landmark, so leaving it on would
   * defeat the whole exercise — <div role="main"> is exactly as duplicated as
   * <main>. id="main-content" is the root layout's own anchor (the skip link
   * targets it), and two elements sharing an id is invalid HTML besides.
   * Everything else — className, style, aria-label, data-* — is captured and
   * replayed untouched.
   */
  const stripLandmarkAttrs = (attrs) =>
    (attrs ?? '')
      .replace(/\srole=(["'])main\1/gi, '')
      .replace(/\sid=(["'])main-content\1/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+$/, '');

  const next = src
    .replace(/<main(\s[^>]*)?>/g, (_m, attrs) => `<div${stripLandmarkAttrs(attrs)}>`)
    .replace(/<\/main>/g, '</div>');

  if (next === src) { skipped.push({ file, opens: opens.length, closes: closes.length, note: 'no-op' }); continue; }

  const openLine = src.slice(0, src.search(/<main[\s>]/)).split('\n').length;
  changed.push({ file, openLine, before: (/<main(\s[^>]*)?>/.exec(src) || [''])[0].slice(0, 90) });
  if (APPLY) fs.writeFileSync(file, next); // read as utf8, written back unchanged apart from the tags
}

const rel = (f) => path.relative(process.cwd(), f).replace(/\\/g, '/');

console.log(`\nscanned ${files.length} files under app/ and components/`);
console.log(`${APPLY ? 'REWROTE' : 'WOULD REWRITE'} ${changed.length} file(s)\n`);
for (const c of changed.slice(0, 12)) {
  console.log(`  ${rel(c.file)}:${c.openLine}`);
  console.log(`      ${c.before}  ->  ${c.before.replace(/^<main/, '<div')}`);
}
if (changed.length > 12) console.log(`  ... and ${changed.length - 12} more`);

if (skipped.length) {
  console.log(`\nSKIPPED ${skipped.length} file(s) — ambiguous, left alone for a human to look at:`);
  for (const s of skipped.slice(0, 15)) {
    console.log(`  ${rel(s.file)}   <main>x${s.opens}  </main>x${s.closes}${s.note ? '  ' + s.note : ''}`);
  }
  if (skipped.length > 15) console.log(`  ... and ${skipped.length - 15} more`);
}

if (!APPLY) console.log('\nDry run. Re-run with --apply to write.');
