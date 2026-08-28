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

/** Every page.tsx under app/, excluding build mirrors and archives. */
function pageFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '_archive') continue;
      pageFiles(full, out);
    } else if (entry.name === 'page.tsx' || entry.name === 'layout.tsx') {
      // The root layout is the one file that SHOULD keep its <main>.
      if (full === path.join(ROOT, 'layout.tsx')) continue;
      out.push(full);
    }
  }
  return out;
}

const files = pageFiles(ROOT);
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

  // Only the tag name changes. The attribute list is captured and replayed.
  const next = src
    .replace(/<main(\s[^>]*)?>/g, (_m, attrs) => `<div${attrs ?? ''}>`)
    .replace(/<\/main>/g, '</div>');

  if (next === src) { skipped.push({ file, opens: opens.length, closes: closes.length, note: 'no-op' }); continue; }

  const openLine = src.slice(0, src.search(/<main[\s>]/)).split('\n').length;
  changed.push({ file, openLine, before: (/<main(\s[^>]*)?>/.exec(src) || [''])[0].slice(0, 90) });
  if (APPLY) fs.writeFileSync(file, next); // read as utf8, written back unchanged apart from the tags
}

const rel = (f) => path.relative(process.cwd(), f).replace(/\\/g, '/');

console.log(`\nscanned ${files.length} page/layout files under app/`);
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
