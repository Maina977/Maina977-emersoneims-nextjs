/**
 * Find images whose filename names one subject while the page names another.
 *
 * WHY THIS EXISTS
 * A Caterpillar photograph on a page selling Cummins, or an oil filter
 * illustrating a turbocharger, is not a cosmetic slip. To a buyer comparing
 * suppliers it reads as a company that does not know its own stock, and it
 * undermines every accurate claim on the same page. Nothing else in this build
 * can see it: the path resolves, the image renders, the page returns 200. Only
 * a human looking at the picture — or this — notices the subject is wrong.
 *
 * WHAT IT COMPARES
 * For every static image reference it extracts two things: the subject implied
 * by the FILENAME, and the subject implied by the ROUTE the file sits on. Where
 * both are known and they disagree, it reports.
 *
 * TWO VOCABULARIES, because the failure has two shapes:
 *   BRANDS — Cummins on a Perkins page.
 *   PARTS  — a filter illustrating a turbocharger.
 *
 * WHY THE ROUTE AND NOT THE SURROUNDING TEXT
 * Nearby text is unreliable: a Cummins page legitimately mentions Perkins when
 * comparing them, and matching on that produces false alarms. A route says what
 * the page is FOR. /generators/cummins is a Cummins page whatever else it
 * discusses.
 *
 * DELIBERATELY SILENT where the filename names no subject. A photograph called
 * hero-fallback.jpg makes no claim, so there is nothing to contradict. This
 * guard reports contradictions, not missing specificity — that judgement
 * belongs to a person looking at the picture.
 *
 * NOT BLOCKING. A generic photograph used honestly is legitimate: on this site
 * lib/products/generatorSizes.ts uses a Caterpillar canopy photograph captioned
 * "Sound-attenuated generator canopy" — generic wording, no false claim, and
 * deliberate. A rule that failed the build on that would be wrong, and would be
 * switched off. It reports; a person decides.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const ROOT = process.cwd();
const SRC_DIRS = ['app', 'components', 'lib', 'data'];
const EXT = /\.(tsx|ts|jsx|js|json)$/;

/** Generator and engine makes this site sells, services or photographs. */
const BRANDS = {
  cummins: /\bcummins\b/i,
  perkins: /\bperkins\b/i,
  caterpillar: /\b(caterpillar|\bcat[-_ ])/i,
  'atlas-copco': /\batlas[-_ ]?copco\b/i,
  'fg-wilson': /\bfg[-_ ]?wilson\b/i,
  volvo: /\bvolvo\b/i,
  voltka: /\bvoltka\b/i,
  sdmo: /\bsdmo\b/i,
  doosan: /\bdoosan\b/i,
  himoinsa: /\bhimoinsa\b/i,
  weichai: /\bweichai\b/i,
  iveco: /\biveco\b/i,
  honda: /\bhonda\b/i,
  'john-deere': /\bjohn[-_ ]?deere\b/i,
  olympian: /\bolympian\b/i,
  leyland: /\bleyland\b/i,
  gesan: /\bgesan\b/i,
  'lister-petter': /\blister[-_ ]?petter\b/i,
  man: /\bman[-_ ](engine|generator|diesel)\b/i,
};

/** Part and equipment types where showing the wrong object is obvious. */
const PARTS = {
  turbocharger: /\bturbo(charger)?s?\b/i,
  filter: /\b(oil|fuel|air|coolant)?[-_ ]?filters?\b/i,
  alternator: /\balternators?\b/i,
  'starter-motor': /\bstarter([-_ ]motor)?\b/i,
  injector: /\binjectors?\b/i,
  piston: /\bpistons?\b/i,
  radiator: /\bradiators?\b/i,
  battery: /\bbatter(y|ies)\b/i,
  controller: /\b(controller|dse|smartgen|powerwizard|comap)\b/i,
  avr: /\bavr\b/i,
  'control-panel': /\b(control[-_ ]panel|switchgear|distribution[-_ ]board)\b/i,
  pump: /\bpumps?\b/i,
  'solar-panel': /\bsolar[-_ ](panel|module|pv)\b/i,
  inverter: /\binverters?\b/i,
  ups: /\bups\b/i,
  incinerator: /\bincinerator\b/i,
  motor: /\bmotor[-_ ](rewind|repair|winding)\b/i,
};

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

/** Subjects a string names, from one vocabulary. */
function subjectsIn(text, vocab) {
  const found = [];
  for (const [name, re] of Object.entries(vocab)) if (re.test(text)) found.push(name);
  return found;
}

/**
 * What a source path is ABOUT. app/generators/cummins/page.tsx is a Cummins
 * page; a dynamic segment like [brand] is about nothing in particular, so it
 * yields no subject and is never reported.
 */
function routeSubject(rel, vocab) {
  const cleaned = rel.replace(/\[[^\]]+\]/g, ' ').replace(/[\\/]/g, ' ');
  return subjectsIn(cleaned, vocab);
}

const PATTERN = /["'`](\/[A-Za-z0-9._%\-/() ]+\.(?:png|jpe?g|webp|avif|gif|svg))["'`]/gi;

const live = [];
const dead = [];

for (const f of SRC_DIRS.flatMap((d) => walk(join(ROOT, d)))) {
  const rel = relative(ROOT, f).split(sep).join('/');
  let src;
  try {
    src = readFileSync(f, 'utf8');
  } catch {
    continue;
  }

  const routeBrands = routeSubject(rel, BRANDS);
  const routeParts = routeSubject(rel, PARTS);
  if (!routeBrands.length && !routeParts.length) continue;

  for (const m of src.matchAll(PATTERN)) {
    const img = decodeURIComponent(m[1]);
    const fileBrands = subjectsIn(img, BRANDS);
    const fileParts = subjectsIn(img, PARTS);

    const brandClash =
      fileBrands.length && routeBrands.length && !fileBrands.some((b) => routeBrands.includes(b));
    const partClash =
      fileParts.length && routeParts.length && !fileParts.some((p) => routeParts.includes(p));

    if (!brandClash && !partClash) continue;

    const line = src.slice(0, m.index).split('\n').length;
    const hit = {
      rel,
      line,
      img,
      kind: brandClash ? 'brand' : 'part',
      inFile: (brandClash ? fileBrands : fileParts).join(', '),
      inRoute: (brandClash ? routeBrands : routeParts).join(', '),
    };
    (isDead(rel) ? dead : live).push(hit);
  }
}

console.log('Image subject guard — filename subject vs page subject');
console.log(`  contradictions in live source: ${live.length}   in dead mirrors: ${dead.length}\n`);

if (live.length) {
  console.log('ADVISORY — the filename names one subject, the page is about another.');
  console.log('A wrong picture renders perfectly and still loses the sale:\n');
  for (const h of live.slice(0, 40)) {
    console.log(`  ${h.rel}:${h.line}   [${h.kind}]`);
    console.log(`      image names : ${h.inFile}`);
    console.log(`      page is for : ${h.inRoute}`);
    console.log(`      ${h.img}`);
  }
  if (live.length > 40) console.log(`  ... and ${live.length - 40} more`);
  console.log('');
  console.log('  A generic photograph captioned generically is fine and is not this.');
  console.log('  Look at the picture before changing anything.');
  console.log('');
} else {
  console.log('PASS — no image contradicts the subject of the page it sits on.\n');
}

process.exit(0);
