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
 *
 * THIS RUNS IN `prebuild`, SO A VIOLATION STOPS THE DEPLOY.
 * That is deliberate: shipping a false trade description is worse than a late
 * release. It was validated against all 2412 source files with zero false
 * positives before being wired in.
 *
 * If it ever blocks an urgent deploy and you are certain the flagged line is
 * legitimate, do NOT delete the rule in a hurry — add the line to the ALLOWED
 * list below with a one-line reason. That keeps the guard honest and leaves a
 * record of the judgement.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
/*
 * `public` is scanned because public/llms.txt is the file AI assistants read to
 * learn what this business sells — and it shipped "a 3-year installation
 * warranty" against the owner-confirmed two years, while this guard reported
 * PASS. The guard only looked at .ts/.tsx under app/components/lib, so the
 * single most quotable document on the site was outside its reach. A claim is a
 * claim whatever file it lives in, and a plain-text one aimed at language
 * models is more likely to be repeated verbatim to a customer than anything in
 * a component.
 */
const SCAN = ['app', 'components', 'lib', 'public'];
const EXT = /\.(ts|tsx|txt|md|json)$/;

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
  {
    id: 'fabricated-review-schema',
    /*
     * BLOCKING. aggregateRating / reviewCount / ratingValue in structured data
     * assert that real people left real reviews. Nothing on this site collects,
     * stores or displays a review corpus, so any such markup here is invented.
     *
     * Google's structured-data policy requires the reviews to be visible on the
     * page that declares them, and breaching it draws a manual action against
     * the whole domain rather than the one page. This is the same family as the
     * four invented testimonials still sitting unmounted in SocialProofWidget,
     * attributed to named individuals and flagged verified:true.
     *
     * Found in lib/brands/cumminsData.ts as
     *     "aggregateRating": { "ratingValue": "4.9", "reviewCount": "127" }
     * — dormant, because the pages importing that object read .warranty and
     * .supplier rather than .structuredData, but one render away from shipping.
     *
     * If genuine reviews are ever collected AND rendered on the page, delete
     * this rule in the same commit that adds them — not before.
     */
    severity: 'error',
    /*
     * A NUMERIC LITERAL is what makes this a claim.
     *
     * The first version matched the property name anywhere and flagged things
     * that assert nothing: `ratingValue: number;` (a TypeScript type) and
     * `ratingValue: review.ratingValue` (a generic component passing data it
     * was handed). Those components are fine — they publish whatever real
     * reviews they are given, and they are given none today.
     *
     * What is never acceptable is a rating written directly into the source,
     * because there is no way for a hardcoded 4.9 to have come from customers.
     * So the pattern requires a digit on the right-hand side.
     */
    /*
     * `ratingValue` ALONE IS NOT A SIGNAL — it is overloaded on this site.
     * components/hub/ProductIntelligenceClient.tsx carries
     *     { sku: 'CUM-C250D5', ratingValue: 250, ratingUnit: ... }
     * where 250 is the set's kVA rating, not a review score. Flagging that
     * would be exactly the cry-wolf failure this guard exists to avoid: once a
     * rule reports things that are plainly fine, the real findings get
     * discounted with them.
     *
     * `reviewCount` and the AggregateRating @type have no second meaning. A
     * literal count of reviews, or a declared AggregateRating node, is a review
     * claim and nothing else.
     */
    re: /["']?reviewCount["']?\s*:\s*["']?\d|["']@type["']\s*:\s*["']AggregateRating["']/i,
    why: 'A hardcoded rating or review count. No review corpus exists on this site, so any literal figure here is invented; Google requires the reviews to be visible on the page and treats fabricated markup as a site-wide manual action.',
  },
  {
    id: 'three-year-warranty',
    /*
     * BLOCKING, because this one is settled fact rather than judgement.
     *
     * The owner confirmed on 2026-08-26 that the generator warranty is TWO
     * years. The site was publishing THREE in 193 places — page titles, meta
     * descriptions, JSON-LD, the dedicated /warranty page, and the
     * generateMetadata of roughly 1,474 location pages. That reached Google
     * results as a commercial promise the business does not make.
     *
     * It is blocking because a false warranty term is not a marketing
     * overstatement, it is an offer. If the warranty genuinely changes to three
     * years, delete this rule in the same commit that updates the copy — and
     * not before.
     *
     * The pattern deliberately does NOT match "1-3 years" (third-party
     * manufacturer ranges), "2-3 years", "25-year" (solar performance), or
     * "3-year workmanship" — those are different cover and were left alone.
     */
    severity: 'error',
    /*
     * ABBREVIATIONS ARE INCLUDED, and they were the gap. The first version of
     * this rule matched "3 year" and "3 Years" only, and four live claims
     * survived the correction sweep because they were written short:
     *   PremiumFooter    "Cummins Generators (3-yr warranty)"  — on EVERY page
     *   CumminsBanner    "3 Yrs Warranty + 1 Yr Free Service"
     *   CumminsBanner    "3Yr Warranty"
     * "yr", "yrs" and the no-space form are all matched now.
     */
    re: /(?<![1-2]\s?[-–]\s?)\b3\s*[-–]?\s*(?:years?|yrs?)\b(?=[^\n]{0,40}warrant)|warrant[^\n]{0,40}(?<![1-2]\s?[-–]\s?)\b3\s*[-–]?\s*(?:years?|yrs?)\b/i,
    why: 'The generator warranty is 2 years (owner-confirmed 2026-08-26). Three was published site-wide and corrected.',
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
    file: 'components/seo/EnhancedSchemaMarkup.tsx',
    contains: "'@type': 'AggregateRating',",
    // This is the CONDITIONAL emitter — `...(rating && reviewCount && {...})`.
    // It publishes a rating only when one is passed in, which is exactly the
    // right shape for real review data and emits nothing today because nothing
    // passes any. The two HARDCODED blocks in this same file (4.8/347 and
    // 4.9/1247) were invented and have been removed; this one is the mechanism,
    // not a claim.
    why: 'data-driven emitter, not a hardcoded rating — emits only when real review data is supplied',
  },
  {
    file: 'lib/solar/marketIntelligence.ts',
    contains: 'reviewCount:',
    /*
     * An internal market-intelligence dataset of SOLAR SUPPLIER scores
     * (overall/quality/delivery/pricing/support plus a review count). Nothing
     * imports or renders it — verified — so none of it reaches a page or a
     * crawler, and it is not schema.org review markup about EmersonEIMS.
     *
     * It is allowed rather than deleted because it is third-party research
     * data the owner may have sourced, not a claim this site publishes. FLAGGED
     * FOR THE OWNER regardless: if these supplier scores were estimated rather
     * than measured, they should not be rendered anywhere without a source.
     */
    why: 'unrendered internal supplier dataset, not published review markup — flagged for owner review',
  },
  {
    file: 'lib/data/blog-articles.ts',
    match: '- Factory-trained technicians',
    // Sits in a buying guide under "Where to Buy in Kenya" -> "Authorized
    // Dealers (Recommended)" -> "Pros". It describes what a reader gets from an
    // authorised dealer. It is not a claim about EmersonEIMS, and rewording it
    // would make the advice wrong.
    why: 'editorial: pros of buying from an authorised dealer, not a claim about us',
  },
  {
    file: 'components/conversion/TrustBadges.tsx',
    contains: "id: '3-year-warranty'",
    // An internal React key, not customer-facing copy. The badge's own title
    // was corrected to "2-Year Warranty" in the same pass. Renaming the id
    // risks breaking anything that references it, for no reader benefit.
    why: 'internal identifier; the displayed title already says 2-Year Warranty',
  },
  {
    file: 'components/solar/SolarProductsShop.tsx',
    contains: 'bat-ritar-200gel',
    // A Ritar battery product line. Battery warranty is set by the battery
    // manufacturer and is unrelated to the EmersonEIMS generator warranty.
    why: 'third-party battery product warranty, not our generator cover',
  },
  /*
   * REMOVED 2026-08-29. Two entries here exempted the solar packages on
   * app/solar/page.tsx, on the reasoning that the owner's 2026-08-26
   * correction named the GENERATOR warranty and said nothing about solar.
   * That caution was right at the time and wrong now: the owner has since
   * stated that the universal warranty period is two years. Both packages
   * were corrected to "2 Year Warranty", so the exemptions would only serve
   * to hide a future regression.
   */
  {
    file: 'components/hub/ProductIntelligenceClient.tsx',
    contains: "sku: 'CYB-OL3000'",
    // A CyberPower UPS catalogue row. It trips the rule only because
    // `ratingValue: 3` sits within 40 characters of the word "warranty" — the
    // warranty text on this row is a third-party manufacturer's, and the 3 is a
    // star rating. Not our cover, and not a duration.
    why: 'third-party UPS catalogue row; the 3 is a star rating, not a warranty term',
  },
  {
    file: 'components/hub/ProductIntelligenceClient.tsx',
    contains: "sku: 'APC-SMT3K'",
    why: 'third-party UPS catalogue row; the 3 is a star rating, not a warranty term',
  },
  {
    file: 'lib/services/serviceBibles.ts',
    contains: "name: 'Huawei'",
    // A Huawei UPS capability description. The nearby digits are model numbers
    // (UPS5000-S / UPS2000-G), not a warranty duration of ours.
    why: 'third-party UPS model numbers near the word warranty, not our cover',
  },
  /*
   * REMOVED 2026-08-29, same reason as the solar entries above. This exempted
   * "3-year workmanship warranty" on the grounds that workmanship cover is a
   * different undertaking from the product warranty. The owner has since said
   * the universal warranty period is two years, which settles it; the text now
   * reads "2-year workmanship warranty".
   */
];

const isAllowed = (rel, line) =>
  ALLOWED.some(
    (a) =>
      rel === a.file &&
      /*
       * `match` is an EXACT trimmed line — precise, and the right default.
       * `contains` is a substring, added 2026-08-26 for lines that are simply
       * too long to quote safely: one product row here runs 321 characters, and
       * an exact copy of it would break on the next unrelated edit to that row,
       * silently re-blocking the build. Prefer `match`; reach for `contains`
       * only when the line is unwieldy, and keep the fragment distinctive.
       */
      (a.match !== undefined
        ? line.trim() === a.match
        : a.contains !== undefined && line.includes(a.contains))
  );

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
