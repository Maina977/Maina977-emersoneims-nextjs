#!/usr/bin/env node
/**
 * verify-image-perf.mjs — static gate for the two image defects found in the
 * 2026-07-20 performance audit. Both are invisible in code review and both
 * silently cost real money in bandwidth and Core Web Vitals.
 *
 *   CHECK 1 — quality outside the next.config `qualities` allowlist.
 *     Next 16 does NOT honour an unlisted quality; it silently falls back to
 *     75. So `quality={95}` and `quality={100}` render SOFTER than a plain
 *     `quality={85}`. The author's intent is silently inverted.
 *
 *   CHECK 2 — LCP preload contention.
 *     Only one element can be the Largest Contentful Paint. Every extra
 *     `priority` / fetchPriority="high" image emits a high-priority preload
 *     that competes with it for bandwidth. The homepage had THREE, one of
 *     which was a 277 KB picture sitting below the fold.
 *
 * Run:  node scripts/verify-image-perf.mjs
 * Exit: 0 = clean, 1 = defects found (safe to wire into CI / pre-commit).
 *
 * Scope note: _archive and components/building are excluded — both are
 * dead mirrors with no importers, verified 2026-07-20.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const SKIP = ['_archive', 'node_modules', '.next', 'components/building', 'external'];

/** Budget: how many priority images one route is allowed. 1 = the true LCP. */
const PRIORITY_BUDGET = 2;

function allowedQualities() {
  const cfg = readFileSync(join(ROOT, 'next.config.ts'), 'utf8');
  const m = cfg.match(/qualities:\s*\[([\d,\s]+)\]/);
  if (!m) {
    console.error('✖ Could not read `qualities` from next.config.ts — aborting');
    process.exit(1);
  }
  return m[1].split(',').map((s) => Number(s.trim())).filter(Boolean);
}

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = relative(ROOT, full).replace(/\\/g, '/');
    if (SKIP.some((s) => rel.startsWith(s) || rel.includes(`/${s}/`))) continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|jsx)$/.test(entry)) out.push(full);
  }
  return out;
}

const QUALITIES = allowedQualities();
const files = [...walk(join(ROOT, 'app')), ...walk(join(ROOT, 'components'))];

/**
 * Dead-code filter. This repo carries a number of unused mirror components
 * (verified 2026-07-20: components/building, components/performance/
 * OptimizedImage, components/media/ProductPhotography all have ZERO
 * importers). Reporting defects in files nothing renders is noise, and a
 * noisy gate is an ignored gate — so only live files can fail the build.
 *
 * "Live" = reachable as a route (a page/layout/template file under app), or
 * referenced by at least one import specifier somewhere in the tree.
 */
const allSource = files.map((f) => readFileSync(f, 'utf8')).join('\n');

/**
 * Basenames that occur more than once in the tree. The relative-import
 * fallback below cannot disambiguate these, so for them we trust only the
 * exact `@/` alias. Without this, the DEAD components/performance/
 * OptimizedImage.tsx is kept alive by imports of the LIVE
 * components/media/OptimizedImage.tsx — they share a basename.
 */
const basenameCount = new Map();
for (const f of files) {
  const b = relative(ROOT, f).replace(/\\/g, '/').split('/').pop().replace(/\.(tsx|jsx)$/, '');
  basenameCount.set(b, (basenameCount.get(b) || 0) + 1);
}

function isLive(rel) {
  if (/^app\/.*\/(page|layout|template|not-found|error)\.tsx$/.test(rel)) return true;
  if (/^app\/(page|layout)\.tsx$/.test(rel)) return true;
  const noExt = rel.replace(/\.(tsx|jsx)$/, '');
  if (allSource.includes('@/' + noExt)) return true;
  const base = noExt.split('/').pop();
  if (basenameCount.get(base) > 1) return false; // ambiguous → alias only
  return new RegExp(`from\\s+['"][^'"]*/${base}['"]`).test(allSource);
}

const qualityDefects = [];
const priorityByFile = [];
const skippedDead = [];

for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  if (!isLive(rel)) { skippedDead.push(rel); continue; }
  const lines = src.split('\n');

  lines.forEach((line, i) => {
    // strip line comments so documented values don't trip the checks
    const code = line.replace(/\/\/.*$/, '');
    const q = code.match(/quality=\{(\d+)\}/);
    if (q && !QUALITIES.includes(Number(q[1]))) {
      qualityDefects.push({
        file: rel, line: i + 1, value: Number(q[1]),
        detail: `quality={${q[1]}} is not in [${QUALITIES.join(', ')}] → silently served at 75`,
      });
    }
  });

  const priority = (src.match(/^\s*priority(\s|$|=\{true\})/gm) || []).length
    + (src.match(/fetchPriority=["']high["']/g) || []).length;
  if (priority > 0) priorityByFile.push({ file: rel, count: priority });
}

let failed = false;

console.log('═══ CHECK 1 — image quality allowlist ═══');
console.log(`  allowed in next.config.ts: [${QUALITIES.join(', ')}]`);
if (qualityDefects.length === 0) {
  console.log('  ✓ every quality prop is honoured\n');
} else {
  failed = true;
  for (const d of qualityDefects) console.log(`  ✖ ${d.file}:${d.line} — ${d.detail}`);
  console.log('');
}

console.log('═══ CHECK 2 — LCP preload contention (ADVISORY) ═══');
/**
 * Advisory, never fails the build. Static analysis cannot know whether a
 * component renders above or below the fold, and it cannot know which layout
 * variant a caller selects — on 2026-07-20 the three `priority` props in
 * CinematicImageGallery looked like defects but proved inert, because the
 * pages using it select variants that never render those branches (confirmed
 * by counting real <link rel=preload as=image> tags on the live pages).
 *
 * So this prints a census for a human to judge. To settle it empirically:
 *   curl -s <url> | grep -c '<link rel="preload" as="image"'
 * More than ~2 on any route means the true LCP is fighting for bandwidth.
 */
const total = priorityByFile.reduce((n, f) => n + f.count, 0);
for (const f of priorityByFile.sort((a, b) => b.count - a.count)) {
  console.log(`  ${f.count > PRIORITY_BUDGET ? '!' : '·'} ${f.count}× ${f.file}`);
}
console.log(`  ${total} high-priority image(s) across ${priorityByFile.length} live component(s).`);
console.log('  Reminder: only ONE element per route can be the LCP. `priority`');
console.log('  belongs on above-the-fold hero art only — never on a carousel,');
console.log('  gallery or any section that renders below the first viewport.\n');

if (skippedDead.length) {
  console.log(`(skipped ${skippedDead.length} file(s) with no importers — dead mirrors)\n`);
}

if (failed) {
  console.error('✖ verify-image-perf: defects found');
  process.exit(1);
}
console.log('✓ verify-image-perf: clean');
