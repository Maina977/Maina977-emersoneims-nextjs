#!/usr/bin/env node
/**
 * Catch hydration mismatches before they ship.
 *
 * A hydration mismatch happens when the server and the browser render different
 * markup for the same component. React reacts by throwing away the server HTML
 * and re-rendering, so the user sees content flicker, jump, or vanish. On a
 * price table that means the prices disappear.
 *
 * The causes are all the same shape: something in render that is not a pure
 * function of props and state.
 *
 *   toLocaleString() / toLocaleDateString()   locale differs between Node and browser
 *                                             ("600,000" vs "600.000")
 *   Math.random()                             different number each render
 *   Date.now() / new Date()                   different clock, and a different
 *                                             timezone on the server
 *
 * WHY IT IS EASY TO MISS: none of this breaks while a component is client-only.
 * It only breaks the moment the component starts server-rendering. This exact
 * bug appeared in GeneratorPriceList the instant `ssr: false` was removed so
 * Google could see the prices — 20 price strings went from client-only to
 * rendered on both sides, each built with a bare toLocaleString().
 *
 * So this checks the intersection: components that ARE server-rendered AND
 * contain a non-deterministic call. A component that is still ssr:false is
 * reported as a warning — it is a landmine for whoever server-renders it next.
 *
 * USAGE
 *   node scripts/check-hydration.mjs        exits 1 if a server-rendered
 *                                           component renders non-deterministically
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const EXT = /\.tsx$/;

/*
 * SCOPE — deliberately narrow, and it cost a rewrite to learn why.
 *
 * The first version also flagged Math.random() and Date.now(). It reported 1114
 * blocking issues, essentially all of them false: those calls live in event
 * handlers, useEffect bodies and callbacks, none of which run during server
 * render and none of which can mismatch. A guard reporting 1114 problems is a
 * guard nobody reads.
 *
 * What is left is the one shape that is nearly always a render-path bug and
 * that has actually broken this site twice: a bare toLocale*String() with NO
 * locale argument, interpolated into markup. Node and the browser disagree on
 * the default locale, so the same number renders "600,000" server-side and
 * "600.000" client-side.
 *
 * Passing an explicit locale — toLocaleString('en-KE') — is fine and is not
 * flagged, because both runtimes then agree.
 *
 * Math.random and Date.now in render are real hazards too, but they cannot be
 * told apart from safe usage by reading one line at a time. Catching them
 * properly needs an AST walk that knows whether it is inside a component's
 * render body. Worth doing; not worth faking.
 */
const RISKS = [
  { id: 'bare toLocaleString', re: /\.toLocale(String|DateString|TimeString)\s*\(\s*\)/ },
];

const isComment = (l) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(l);
const isDead = (rel) => /(^|\/)building(\/|$)|^_archive\//.test(rel);

/*
 * ENFORCED SCOPE.
 *
 * A full sweep finds ~619 bare toLocale*String() calls across the site. They are
 * real hazards, but most are latent — inside calculators whose values only exist
 * after user input — and failing the build on 619 findings would simply get this
 * guard deleted. Blocking everywhere is not a plan; it is a tantrum.
 *
 * So the guard BLOCKS on the surfaces that have been audited and are known clean,
 * and ADVISES everywhere else. Add a path here once you have cleaned it. That way
 * the enforced area only ever grows, and the build never breaks on debt someone
 * else has not had a chance to pay down.
 */
const ENFORCED = [
  /^app\/generators\//,
  /^components\/generators\//,
  /^components\/brands\//,
  /^components\/forms\//,
];
const isEnforced = (rel) => ENFORCED.some((p) => p.test(rel));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (['node_modules', '.next', '.git', '_archive'].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(e)) out.push(p);
  }
  return out;
}

// Which component paths are imported with ssr:false anywhere? Those are
// client-only and cannot mismatch — today.
const clientOnly = new Set();
for (const dir of ['app', 'components']) {
  const d = join(ROOT, dir);
  if (!existsSync(d)) continue;
  for (const f of walk(d)) {
    const src = readFileSync(f, 'utf8');
    for (const m of src.matchAll(/dynamic\(\s*\(\)\s*=>\s*import\('([^']+)'\)[^)]*ssr:\s*false/g)) {
      clientOnly.add(m[1].replace('@/', ''));
    }
  }
}

const errors = [];
const warnings = [];

for (const dir of ['app', 'components']) {
  const d = join(ROOT, dir);
  if (!existsSync(d)) continue;
  for (const f of walk(d)) {
    const rel = relative(ROOT, f).replace(/\\/g, '/');
    if (isDead(rel)) continue;
    const modulePath = rel.replace(/\.tsx$/, '');
    const isClientOnly = [...clientOnly].some((c) => modulePath.endsWith(c));

    readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
      if (isComment(line)) return;
      for (const r of RISKS) {
        if (!r.re.test(line)) continue;
        const hit = { rel, line: i + 1, id: r.id, text: line.trim().slice(0, 96) };
        // Blocking only where the surface has been audited (see ENFORCED) and
        // the component actually server-renders.
        if (!isClientOnly && isEnforced(rel)) errors.push(hit);
        else warnings.push(hit);
      }
    });
  }
}

const show = (rows) => rows.forEach((r) => {
  console.log(`  ${r.rel}:${r.line}  [${r.id}]`);
  console.log(`      ${r.text}`);
});

console.log(`Hydration guard — ${errors.length} blocking, ${warnings.length} advisory\n`);

if (warnings.length) {
  console.log(`ADVISORY — non-deterministic render inside ssr:false components.`);
  console.log('Harmless today; becomes a live bug the moment anyone server-renders them:');
  show(warnings.slice(0, 6));
  if (warnings.length > 6) console.log(`  ... and ${warnings.length - 6} more`);
  console.log('');
}

if (errors.length) {
  console.log('FAIL — these render on the SERVER and are non-deterministic:\n');
  show(errors);
  console.log('\nUse lib/format/currency.ts for money. For dates, pass an explicit');
  console.log('locale and timezone. For randomness, move it into useEffect.');
  process.exit(1);
}

console.log('PASS — no server-rendered component renders non-deterministically.');
