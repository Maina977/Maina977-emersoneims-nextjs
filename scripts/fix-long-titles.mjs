/*
 * PAGE TITLES THAT RENDER TOO LONG, OR SAY THE BRAND TWICE.
 *
 * THE MECHANISM
 * app/layout.tsx sets:
 *     title: { template: "%s | EmersonEIMS Kenya" }
 * Next appends that to every page title. So a page's own budget is about 40
 * characters, not the ~60 Google renders — and any page title that already
 * contains "EmersonEIMS" ends up printing the brand twice, e.g.
 *     "PCB & Motherboard Repair | EmersonEIMS Repair Centre | EmersonEIMS Kenya"
 *
 * Anything past roughly 60 rendered characters is cut off in results, so the
 * tail is written, shipped, and never seen by anyone.
 *
 * WHAT THIS DOES — AND THE LINE IT WILL NOT CROSS
 * Titles are editorial. This script therefore only ever DELETES whole
 * segments; it never invents words, reorders, or truncates mid-phrase:
 *
 *   1. split on the separators actually used here:  |  —  •  ·
 *   2. drop any segment that is just the brand (the template re-adds it)
 *   3. while still over budget, drop segments from the END, because these
 *      titles are front-loaded and the tail is keyword stuffing
 *   4. never go below the first segment
 *
 * If the first segment alone is still over budget, the file is REPORTED, not
 * edited — shortening it needs a human decision about which words matter, and
 * guessing would be worse than leaving it.
 *
 * USAGE
 *   node scripts/fix-long-titles.mjs           # dry run — review every change
 *   node scripts/fix-long-titles.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const ROOT = path.join(process.cwd(), 'app');
const SUFFIX = ' | EmersonEIMS Kenya';
/*
 * 65 rather than 60. Google truncates on rendered pixel width (~580px), not on
 * a character count, so treating 60 as a hard cliff bought nothing and cost
 * real keywords: at a 40-character own-budget this script reduced
 * "Careers | EmersonEIMS — Power & Engineering Jobs in Kenya" to bare
 * "Careers", throwing away both the service words and "Kenya".
 */
const RENDERED_BUDGET = 65;
const OWN_BUDGET = RENDERED_BUDGET - SUFFIX.length; // 45

/*
 * SPLIT ON THE PIPE ONLY.
 *
 * The first version also split on bullets, and that produced fragments that
 * actively misrepresented the business:
 *     "Agro-Industrial Power Solutions | Coffee • Cocoa • Tea • Grain | ..."
 *       became  "Agro-Industrial Power Solutions | Coffee"
 *     "Mining Power Solutions Africa | Gold • Diamonds • Cobalt | ..."
 *       became  "Mining Power Solutions Africa | Gold"
 * A bulleted run is one idea written as a list. It survives whole or it is
 * dropped whole — it is never cut in the middle, which would tell a searcher
 * we only serve coffee, or only mine gold.
 */
const SEPARATOR = /\s+\|\s+/;

/*
 * Below this, the remaining title is a generic label rather than something
 * anybody searches for ("Careers", "Case Studies", "Our Team"). Those are
 * reported for a human to write, not silently shipped.
 */
const MIN_USEFUL = 18;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '_archive') continue;
      walk(full, out);
    } else if (e.name === 'page.tsx' || e.name === 'layout.tsx') out.push(full);
  }
  return out;
}

/** Returns a shortened title, or null when it cannot be shortened safely. */
function shorten(title) {
  let parts = title.split(SEPARATOR).map((s) => s.trim()).filter(Boolean);

  // The template already ends with the brand; saying it here repeats it. A
  // segment that is ONLY the brand goes entirely; one that merely mentions it
  // keeps its other words.
  parts = parts.filter((p) => !/^emersoneims(\s+kenya)?$/i.test(p.trim()));

  /*
   * Strip the brand ONLY where it sits at the edge of a segment.
   *
   * Removing it from the middle of a phrase destroys the grammar: this turned
   * "Why EmersonEIMS Leads | Competitive Positioning | Market Leader Kenya"
   * into "Why Leads | Competitive Positioning". A title that reads as broken
   * English in a search result is worse than one that is merely too long, so
   * an interior mention disqualifies the whole file from automatic rewriting
   * and it gets reported for a human instead.
   */
  const BRAND = /\bEmersonEIMS(\s+Kenya)?\b/i;
  const cleaned = [];
  for (const p of parts) {
    const m = BRAND.exec(p);
    if (!m) { cleaned.push(p); continue; }
    const atStart = m.index === 0;
    /*
     * Only a LEADING brand is safe to remove.
     *
     * "EmersonEIMS — Power & Engineering Jobs in Kenya" -> "Power & Engineering
     * Jobs in Kenya" reads correctly. But the brand anywhere else is usually
     * the grammatical object of the phrase, and deleting it leaves a sentence
     * fragment. Both of these were produced by earlier versions of this rule
     * and caught before shipping:
     *     "Why EmersonEIMS Leads"     -> "Why Leads"
     *     "Why Choose EmersonEIMS"    -> "Why Choose"
     * Repeating the brand is a small cost; publishing broken English in a
     * search result is not. So a non-leading mention leaves the segment
     * exactly as written, and the title is shortened by dropping later
     * segments instead.
     */
    if (!atStart) { cleaned.push(p); continue; }
    cleaned.push(
      p
        .replace(BRAND, ' ')
        // Brand removal can strand a leading or trailing dash or bullet, e.g.
        // "EmersonEIMS — Power & Engineering Jobs" -> "— Power & Engineering Jobs".
        .replace(/^\s*[—–\-•·]+\s*/, '')
        .replace(/\s*[—–\-•·]+\s*$/, '')
        .replace(/\s+/g, ' ')
        .trim()
    );
  }
  parts = cleaned.filter(Boolean);
  if (parts.length === 0) return null;

  while (parts.length > 1 && parts.join(' | ').length > OWN_BUDGET) parts.pop();

  const next = parts.join(' | ');
  if (next.length > OWN_BUDGET) return null; // first segment alone is too long
  if (next.length < MIN_USEFUL) return null; // too generic to be worth ranking
  if (!next || next === title) return null;
  return next;
}

const fixed = [];
const manual = [];

for (const file of walk(ROOT)) {
  if (file === path.join(ROOT, 'layout.tsx')) continue; // root layout owns the template
  const src = fs.readFileSync(file, 'utf8');

  // Only a simple string literal on a `title:` property. A template literal or
  // a function builds a title per route and cannot be judged from source.
  //
  // The closing quote must be followed by a comma or end-of-line. Without that
  // anchor this pattern matched only part of a string containing an ESCAPED
  // quote — 'Solar Solution School | 10 AI Engines | World\'s Most Advanced
  // Solar Platform' matched up to the backslash, and rewriting that prefix
  // left the tail stranded as  '...10 AI Engines's Most Advanced Solar
  // Platform'  — an unterminated string literal that failed the build.
  const m = /((?:^|\n)\s*title:\s*)(['"])([^'"\n]{4,300})\2(?=\s*,|\s*\n)/.exec(src);
  if (!m) continue;

  const title = m[3];
  // Belt and braces: never touch a literal containing an escape sequence. The
  // rewrite replays the raw captured text, so any backslash in it is a sign
  // this simple matcher does not fully understand the string.
  if (title.includes('\\')) continue;
  const rendered = title.length + SUFFIX.length;
  const dupBrand = /emersoneims/i.test(title);
  if (rendered <= RENDERED_BUDGET && !dupBrand) continue;

  const line = src.slice(0, m.index).split('\n').length + 1;
  const rel = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const next = shorten(title);

  if (!next) {
    manual.push({ rel, line, title, rendered });
    continue;
  }

  fixed.push({ rel, line, before: title, after: next, was: rendered, now: next.length + SUFFIX.length });

  if (APPLY) {
    // Replace only the captured literal, preserving the original quote style.
    const replacement = `${m[1]}${m[2]}${next}${m[2]}`;
    fs.writeFileSync(file, src.slice(0, m.index) + replacement + src.slice(m.index + m[0].length));
  }
}

console.log(`\n${APPLY ? 'REWROTE' : 'WOULD REWRITE'} ${fixed.length} title(s)  (budget ${RENDERED_BUDGET} rendered / ${OWN_BUDGET} own)\n`);
for (const f of fixed) {
  console.log(`  ${f.rel}:${f.line}   ${f.was} -> ${f.now}`);
  console.log(`      - "${f.before}"`);
  console.log(`      + "${f.after}"`);
}

if (manual.length) {
  console.log(`\n${manual.length} title(s) NOT touched — the first segment alone exceeds ${OWN_BUDGET} chars,`);
  console.log(`so shortening needs a human choice about which words matter:\n`);
  for (const m2 of manual) console.log(`  ${m2.rel}:${m2.line}  (${m2.rendered})\n      "${m2.title}"`);
}

if (!APPLY) console.log('\nDry run. Re-run with --apply to write.');
