#!/usr/bin/env node
/**
 * Claim guard — stops unsupportable marketing claims re-entering the site.
 *
 * WHY THIS EXISTS
 * ---------------
 * The "authorised Cummins dealer" claim has been removed from this codebase
 * more than once and has come back every time. It comes back because it lives
 * in shared TEMPLATES (a brand page generator, a services registry, a location
 * meta template) rather than on the pages where anyone notices it — so a
 * page-level cleanup looks complete while the generator that produced it is
 * untouched. On the last pass it was even asserted inside FAQPage structured
 * data, i.e. stated to Google as machine-readable fact.
 *
 * Removing the text is not a fix. Removing the text AND leaving something that
 * fails loudly when it returns is a fix. That is this file.
 *
 * WHAT IS BANNED, AND WHY EACH ONE
 * --------------------------------
 *   authorised dealer   EmersonEIMS sells and services these brands. It is not
 *                       an authorised dealer of any of them. Claiming otherwise
 *                       is a false trade description under Kenya's Consumer
 *                       Protection Act 2012, and the manufacturers police it.
 *   factory-trained     No training certificates are on file. If they are
 *                       obtained, delete the rule and restore the claim with
 *                       the certificate named — a documented claim is stronger
 *                       than a vague one.
 *
 * WHAT IS DELIBERATELY ALLOWED
 * ----------------------------
 *   "Contact an authorized Perkins dealer", "must be done by an authorised
 *   dealer using EST" — advice pointing a technician at somebody ELSE's
 *   authorised dealer is true, useful, and not a claim about us. Only
 *   first-person claims are caught.
 *
 * USAGE
 *   node scripts/check-claims.mjs          exits 1 if any banned claim is found
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SCAN = ['app', 'components', 'lib'];
const EXT = /\.(ts|tsx)$/;

// Paths whose contents are not shipped: dead mirrors and archives. They are
// still reported, but as warnings, because a revived mirror brings the claim
// back with it.
const DEAD = [/[\\/]building[\\/]/, /^_archive[\\/]/];

const RULES = [
  {
    id: 'authorised-dealer',
    severity: 'error',
    /*
     * Matches "authorised <anything> dealer" where <anything> is up to ~30
     * characters of brand names, slashes and spaces.
     *
     * The loose middle is deliberate and was learned the hard way. The first
     * version of this rule required a SINGLE word between "authorised" and
     * "dealer", so it sailed straight past a live instance reading
     * "Authorised Cummins / Voltka dealer" — the slash between two brands was
     * enough to hide it. It also nearly missed a second copy that used the
     * British "-ised" spelling where every other instance used "-ized".
     * Both spellings and multi-brand phrasings are covered now.
     */
    /*
     * Three shapes, all of them FIRST PERSON. Anything else is somebody else's
     * dealer and is none of our business.
     *
     *   a) a sentence about us      "EmersonEIMS is an authorised Cummins dealer"
     *   b) a bare badge string      'Authorised Cummins / Voltka dealer'
     *   c) a title/meta template    "... | Authorized Cummins Dealer Kenya"
     *
     * The first version of this rule was a single loose pattern and it flagged
     * 22 lines, of which essentially all were legitimate: the DENIAL on
     * /why-emersoneims ("we hold no authorised-dealer appointment"), a QA rule
     * that requires dealer proof before accepting a "genuine" claim, buying
     * guides telling readers to prefer authorised dealers, and fault-code
     * entries ending "contact authorized dealer". A guard that fails on correct
     * content is worse than no guard, because the first thing anyone does is
     * switch it off. Precision matters more than reach here.
     */
    re: new RegExp(
      [
        // (a) first-person sentence
        String.raw`\b(EmersonEIMS|we|we're|we are)\b[^.]{0,60}?\bauthoris?z?ed\b[\s\w/&,-]{0,30}?\bdealer\b`,
        // (b) trust-badge string that NAMES A BRAND.
        //     The brand is the discriminator and it is doing real work. A badge
        //     claiming authorisation always names who authorised us
        //     ("Authorised Cummins / Voltka dealer"). A bare "Authorized Dealer"
        //     with no brand is almost always a where-to-buy reference — e.g.
        //     whereToSource: ["Cummins East Africa", "Authorized dealers"] and
        //     source: [part.manufacturer, 'Authorized Dealer'], both of which
        //     this guard failed on before the brand was required.
        String.raw`['"\`]\s*authoris?z?ed[\s\w/&,.-]{0,20}?(cummins|voltka|perkins|caterpillar|kohler|sdmo|mtu|deutz|volvo|generac|fg\s*wilson)[\s\w/&,.-]{0,20}?dealer`,
        // (c) SEO title or meta template asserting it of us
        String.raw`authoris?z?ed\s+[A-Za-z]+\s+dealer\s+(kenya|in\s)`,
      ].join('|'),
      'i',
    ),
    why: 'EmersonEIMS is not an authorised dealer of any generator brand.',
  },
  {
    id: 'factory-trained',
    /*
     * WARNING, not error, and that is a considered choice.
     *
     * There is no training certificate on file, so the claim cannot be
     * verified — but "unverified" is not the same as "false". The engineers may
     * genuinely hold manufacturer training. Hard-failing the build would
     * pressure someone into deleting a claim that could be true and is worth
     * real money in a tender.
     *
     * So it reports every time, loudly, and never blocks. Resolve it one way or
     * the other: produce the certificate and delete this rule, or reword.
     */
    severity: 'warn',
    re: /factory[-\s]?trained/i,
    why: 'No training certificates are on file to support this.',
  },
];

/** A line that is a comment is documentation ABOUT the rule, not a claim. */
const isComment = (l) => /^\s*(\/\/|\*|\/\*)/.test(l);

/**
 * Reviewed exceptions — content that trips a rule but is verified correct.
 *
 * Keep this list SHORT and justified. A guard that reports known-good lines
 * every run teaches people to ignore it, which is how the dealer claim survived
 * two cleanups in the first place.
 */
const ALLOWED = [
  {
    file: 'lib/data/blog-articles.ts',
    match: '- Factory-trained technicians',
    // Sits in a buying guide under "Where to Buy in Kenya" -> "Authorized
    // Dealers (Recommended)" -> "Pros". It describes what a reader gets from an
    // authorised dealer. It is not a claim about EmersonEIMS, and rewording it
    // would make the advice wrong.
    why: 'editorial: pros of buying from an authorised dealer, not a claim about us',
  },
];

const isAllowed = (rel, line) =>
  ALLOWED.some((a) => rel === a.file && line.trim() === a.match);

/**
 * Lines that mention an authorised dealer WITHOUT claiming to be one.
 *
 * All of these are real examples from this codebase that the first draft of
 * this guard wrongly failed on:
 *   - "we hold no authorised-dealer appointment"      the correct denial
 *   - "require authorised-dealer proof"               a QA rule
 *   - "Authorised dealer verified — cross-check ..."  an inspection step
 *   - "Contact ECM manufacturer ... or authorized dealer"  service advice
 *   - "## Option 1: Authorized Local Dealers"         a buying guide
 */
const isNotAClaimAboutUs = (l) =>
  /\b(no|not|never|without)\b[^.]{0,25}authoris?z?ed/i.test(l) ||
  /\b(contact|call|visit|by an|through|from|prefer|use an?)\b[^.]{0,25}authoris?z?ed/i.test(l) ||
  /\b(require|proof|verify|verified|cross-check|check|confirm)\b[^.]{0,40}authoris?z?ed/i.test(l) ||
  /authoris?z?ed[\s\w]{0,25}\b(verified|proof|portal|recommended)\b/i.test(l);

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.next' || entry === '.git') continue;
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (EXT.test(entry)) out.push(p);
  }
  return out;
}

const files = SCAN.flatMap((d) => {
  try {
    return walk(join(ROOT, d));
  } catch {
    return [];
  }
});

const errors = [];
const warnings = [];
const inDeadMirror = [];

for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const lines = readFileSync(file, 'utf8').split('\n');
  const isDead = DEAD.some((d) => d.test(rel));

  lines.forEach((line, i) => {
    if (isComment(line) || isNotAClaimAboutUs(line) || isAllowed(rel, line)) return;
    for (const rule of RULES) {
      if (!rule.re.test(line)) continue;
      const hit = { rel, line: i + 1, rule: rule.id, why: rule.why, text: line.trim().slice(0, 110) };
      if (isDead) inDeadMirror.push(hit);
      else if (rule.severity === 'error') errors.push(hit);
      else warnings.push(hit);
    }
  });
}

const show = (rows) => {
  for (const r of rows) {
    console.log(`  ${r.rel}:${r.line}  [${r.rule}]`);
    console.log(`      ${r.text}`);
  }
};

console.log(`Claim guard — scanned ${files.length} files`);
console.log(`  blocking: ${errors.length}   advisory: ${warnings.length}   dead mirrors: ${inDeadMirror.length}\n`);

if (inDeadMirror.length) {
  console.log(`NOTE — ${inDeadMirror.length} hit(s) in dead mirrors/archives. Not shipped, so not blocking,`);
  console.log('but revive one of those files and the claim ships with it:');
  show(inDeadMirror.slice(0, 6));
  if (inDeadMirror.length > 6) console.log(`  ... and ${inDeadMirror.length - 6} more`);
  console.log('');
}

if (warnings.length) {
  console.log(`ADVISORY — ${warnings.length} unverified claim(s) in live source:`);
  show(warnings.slice(0, 8));
  if (warnings.length > 8) console.log(`  ... and ${warnings.length - 8} more`);
  console.log('\n  Unverified is not the same as false. Either produce the evidence and');
  console.log('  delete the rule, or reword. Not blocking.\n');
}

if (errors.length) {
  console.log(`FAIL — ${errors.length} unsupportable claim(s) in LIVE source:\n`);
  show(errors);
  console.log('\nThese are false as written. Fix the wording. If the position has genuinely');
  console.log('changed, remove the rule from scripts/check-claims.mjs and state the');
  console.log('evidence in the commit message.');
  process.exit(1);
}

console.log('PASS — no false claims in live source.');
