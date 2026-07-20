#!/usr/bin/env node
/**
 * verify-survey-policy.mjs — keep the site consistent with the owner's
 * authorised site-survey fee policy.
 *
 * THE POLICY (components/trust/SiteSurveyPolicy.tsx, owner-authorised):
 *   A modest fee covers the technician's site visit, inspection, testing and
 *   fault diagnosis, plus the written technical solution and quotation. The
 *   full fee is deducted from the contract when the work is awarded to
 *   EmersonEIMS.
 *
 * THEREFORE:
 *   - "free quote" / "free quotation" / "free written quote"  -> ALLOWED.
 *     Quoting genuinely is free.
 *   - "free site survey" / "free site assessment" / "free site visit" /
 *     "free assessment" / "no obligation site assessment"      -> FORBIDDEN.
 *     These promise the paid on-site diagnostic visit at no charge.
 *
 * WHY A GATE EXISTS AT ALL
 * This contradiction has been removed TWICE and came back both times:
 *   1. The first pass removed "free site SURVEY" but not "free site
 *      ASSESSMENT" — the same promise in different words.
 *   2. The second pass searched only *.tsx, so 28 occurrences hiding in *.ts
 *      data files survived, including one in lib/services/allServices.ts that
 *      fed BOTH the rendered page and its JSON-LD schema. Google could have
 *      surfaced the contradiction directly in search results.
 *
 * Hence this script scans EVERY text file type, not just components, and is
 * deliberately phrased to catch wording variants rather than exact strings.
 *
 * Run:  node scripts/verify-survey-policy.mjs
 * Exit: 0 = consistent, 1 = a contradiction is present
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const ROOTS = ['app', 'components', 'lib', 'data', 'public'];

/** Dead mirrors and vendor trees — nothing here reaches a user. */
const SKIP = [
  'node_modules', '_archive', '.next', 'deployment-package',
  'components/building', 'lib/building', 'app/(building)',
];

const SCAN_EXT = /\.(tsx|ts|jsx|js|mjs|json|md|txt|html)$/;

/**
 * The forbidden pattern. "free" (any case, optionally FREE/Free) followed
 * within a few words by an on-site activity. Deliberately tolerant of
 * separators and plurals so "FREE site surveys" and "free-site assessment"
 * both match.
 */
const FORBIDDEN =
  /(?<!hands[\s_-])\bfree[\s_-]+(?:on[\s-]?site[\s_-]+)?(?:site[\s_-]+)?(?:assessment|survey|visit|inspection|diagnosis)s?\b|\bno[\s-]?obligation\s+(?:site\s+)?(?:assessment|survey|visit|inspection)s?\b/i;

/**
 * Things that merely SOUND like the forbidden pattern but are legitimate:
 *
 *   "hands-free diagnostic"        — voice control, not a site visit. The
 *                                    lookbehind above handles this, but the
 *                                    guard stays as documentation.
 *   "free diagnostic tool/guide"   — our AI tools and written guides really
 *                                    ARE free. Only free ON-SITE diagnosis
 *                                    contradicts the policy, which is why
 *                                    "diagnostic" is excluded from the
 *                                    pattern and only "diagnosis" is matched.
 *   "free quote/quotation"         — quoting is genuinely free.
 */
const LEGITIMATE = /hands[\s_-]free|free[\s_-]+diagnostic[\s_-]+(?:tool|guide|app|software|calculator|lookup)/i;

/** The file that DEFINES the policy may quote the forbidden wording. */
const ALLOWLIST = ['components/trust/SiteSurveyPolicy.tsx', 'scripts/verify-survey-policy.mjs'];

function walk(dir, out = []) {
  let entries;
  try { entries = readdirSync(dir); } catch { return out; }
  for (const entry of entries) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    if (SKIP.some((s) => rel === s || rel.startsWith(`${s}/`))) continue;
    let st;
    try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) walk(full, out);
    else if (SCAN_EXT.test(entry)) out.push(rel);
  }
  return out;
}

const files = ROOTS.flatMap((r) => walk(join(ROOT, r)));
const hits = [];

for (const rel of files) {
  if (ALLOWLIST.includes(rel)) continue;
  let src;
  try { src = readFileSync(join(ROOT, rel), 'utf8'); } catch { continue; }
  src.split('\n').forEach((line, i) => {
    // Skip comment lines: explaining the removed wording must not re-trip it.
    const t = line.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('{/*')) return;
    if (LEGITIMATE.test(line)) return;
    if (FORBIDDEN.test(line)) {
      hits.push({ rel, line: i + 1, text: t.slice(0, 120) });
    }
  });
}

console.log('═══ site-survey fee policy consistency ═══');
console.log(`  scanned ${files.length} files across ${ROOTS.join(', ')}`);

if (hits.length === 0) {
  console.log('  ✓ no page promises the paid on-site visit for free');
  process.exit(0);
}

console.log(`\n  ✖ ${hits.length} contradiction(s) of the site-survey fee policy:\n`);
for (const h of hits) console.log(`    ${h.rel}:${h.line}\n      ${h.text}`);
console.log('\n  "Free QUOTE" is fine — quoting is genuinely free.');
console.log('  The on-site survey/diagnostic visit is NOT free; its fee is');
console.log('  deducted from the contract when the work is awarded to us.');
process.exit(1);
