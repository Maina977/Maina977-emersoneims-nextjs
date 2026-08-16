#!/usr/bin/env node
/**
 * check-code-counts — no hardcoded fault-code totals in customer-facing text.
 *
 * WHY THIS EXISTS
 * The site advertised "6,700+ verified fault codes" in 32 places — page copy,
 * meta descriptions, OpenGraph cards, JSON-LD product schema, the homepage and
 * the nav — while the index's own health endpoint counted 54,192 verified out
 * of 451,593 total. Nobody could tell from the markup which figure was true,
 * and the literal had been copied outward faster than it could be corrected.
 *
 * A number written into a component is a claim that stops being checked the
 * moment it is written. Counts belong in one place: the data. The page reads
 * them from /api/generator-oracle/health at runtime, and metadata — which
 * cannot read the index at request time — makes qualitative claims instead.
 *
 * This gate fails the build if a fault-code total is written back into the
 * markup. It deliberately does NOT match prices ("KES 450,000"), which are a
 * different kind of figure and belong in the copy.
 */
import fs from 'fs';
import path from 'path';

const ROOTS = ['app', 'components', 'lib'];

/** A digit-group followed by fault/code wording, in either order. */
const PATTERNS = [
  /\b\d{1,3},\d{3}\+?\s*(?:\+\s*)?(?:verified\s+)?(?:fault[- ]?code|fault codes|error codes|codes\b)/i,
  /\b(?:over|access|search)\s+\d{1,3},\d{3}\b[^.]{0,40}\b(?:fault|code)/i,
];

/** Explanatory comments about the historical figure are allowed. */
const isComment = (line) => /^\s*(\*|\/\/|\/\*)/.test(line);

/** Dead mirrors are not shipped; skip them. */
const SKIP = [/[\\/]building[\\/]/, /[\\/]_archive[\\/]/, /node_modules/];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (SKIP.some((r) => r.test(p))) return [];
    if (e.isDirectory()) return walk(p);
    return /\.tsx?$/.test(e.name) ? [p] : [];
  });
}

const hits = [];
for (const root of ROOTS) {
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (isComment(line)) return;
      if (/KES|Ksh|price|cost|budget|warranty|year|kVA|kW/i.test(line)) return; // money/specs, not counts
      // a bare mention of 'code' in prose without a digit-group adjacent is fine
      if (!/\d{1,3},\d{3}/.test(line)) return;
      if (PATTERNS.some((r) => r.test(line))) {
        hits.push({ file: file.split(path.sep).join('/'), line: i + 1, text: line.trim().slice(0, 110) });
      }
    });
  }
}

if (hits.length) {
  console.error(`check-code-counts: FAIL — ${hits.length} hardcoded fault-code total(s) in shipped text.\n`);
  for (const h of hits) console.error(`  ${h.file}:${h.line}\n    ${h.text}`);
  console.error(
    '\n  Counts must come from the data, not the markup.\n' +
    '  On-page: read /api/generator-oracle/health.\n' +
    '  In metadata (which cannot fetch): make a qualitative claim instead.\n'
  );
  process.exit(1);
}
console.log('check-code-counts: PASS — no hardcoded fault-code totals in shipped text.');
