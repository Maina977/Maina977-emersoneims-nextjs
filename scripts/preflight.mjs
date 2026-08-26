#!/usr/bin/env node
/*
 * Preflight — run this immediately before `git push`.
 *
 * WHY IT EXISTS
 * On 2026-08-26 a commit was pushed after a LOCAL build reported failure. The
 * failure was benign — a stale .next/lock from a second build I had started and
 * killed, so nothing was ever compiled — and the code happened to be a one-line
 * string change that deployed fine. But the process was wrong: the push was
 * chained onto the build with `;` so it ran regardless of the exit code, and
 * the failure was only noticed afterwards.
 *
 * Had that lock masked a genuine parse error, it would have reached production.
 * Two real parse errors DID occur the same day — a shell-eaten backslash
 * producing `.replace(//$/` and a shell-eaten quote producing
 * `['plant',comap-a001'` — and either would have taken the site down. The build
 * caught those only because it actually ran.
 *
 * This checks the things that are fast and that have actually broken this
 * codebase, and it distinguishes "the build failed" from "the build never ran",
 * which is the distinction that was missed.
 *
 *   node scripts/preflight.mjs
 *
 * Exit 0 means the guards pass and a real build result exists for the current
 * working tree. It is NOT a substitute for `next build` — it is the check that
 * you did not skip it.
 */
import { execSync } from 'node:child_process';
import { existsSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];
const notes = [];

/* 1. A stale lock means a build could not start. That is not the same as a
 *    build failing, and mistaking one for the other is what caused this. */
const lock = join(process.cwd(), '.next', 'lock');
if (existsSync(lock)) {
  problems.push(
    '.next/lock exists — a build is running, or one was killed and left it behind.\n' +
    '     A build attempted now reports FAILURE without compiling anything.\n' +
    '     Fix: wait for the running build, or delete .next/lock and rebuild.'
  );
}

/* 2. Did a build actually produce output, and is it newer than the newest
 *    source file? A green result from an hour and twelve edits ago proves
 *    nothing about what is about to be pushed. */
/*
 * BUILD_ID is written at the end of a successful `next build` and is the most
 * reliable marker across versions. app-build-manifest.json does NOT exist in
 * Next 16 — checking for it made this script report "no build output" on a
 * perfectly good build, which is exactly the kind of false alarm that teaches
 * people to ignore a guard.
 */
const manifest = join(process.cwd(), '.next', 'BUILD_ID');
if (!existsSync(manifest)) {
  problems.push('No .next/BUILD_ID — no successful build. Run `npx next build` before pushing.');
} else {
  const builtAt = statSync(manifest).mtimeMs;
  let newest = 0;
  let newestFile = '';
  const skip = new Set(['node_modules', '.next', '.git', 'public', 'docs']);
  (function walk(dir) {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      if (skip.has(e.name)) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx|mjs|css)$/.test(e.name)) {
        const m = statSync(p).mtimeMs;
        if (m > newest) { newest = m; newestFile = p; }
      }
    }
  })(process.cwd());

  if (newest > builtAt) {
    const mins = Math.round((newest - builtAt) / 60000);
    problems.push(
      `Source changed ${mins} minute(s) AFTER the last build.\n` +
      `     newest: ${newestFile.replace(process.cwd(), '.')}\n` +
      '     The build output does not represent what you are about to push. Rebuild.'
    );
  } else {
    notes.push(`build output is newer than every source file (built ${new Date(builtAt).toISOString().slice(11, 19)})`);
  }
}

/* 3. The route guards. Seconds to run, and each one exists because a silent
 *    hard-404 or soft-404 shipped before. */
const guards = [
  'scripts/check-claims.mjs',
  'scripts/check-segment-guard.mjs',
  'scripts/check-pricing-routes.mjs',
  'scripts/check-size-routes.mjs',
  'scripts/check-plant-routes.mjs',
];
for (const g of guards) {
  if (!existsSync(g)) continue;
  try {
    execSync(`node ${g}`, { stdio: 'pipe' });
    notes.push(`${g.replace('scripts/', '')} passed`);
  } catch (e) {
    const out = (e.stdout?.toString() || '') + (e.stderr?.toString() || '');
    problems.push(`${g} FAILED:\n     ${out.trim().split('\n').slice(0, 4).join('\n     ')}`);
  }
}

/* 4. Regexes the shell has eaten before. `//` in place of `/\/` is a comment
 *    to JavaScript, not a pattern, and it is a parse error that kills a deploy. */
try {
  const hits = execSync(
    'git diff --cached -U0 -- "*.ts" "*.tsx" || true',
    { encoding: 'utf8' }
  )
    .split('\n')
    .filter((l) => l.startsWith('+') && /\.(replace|match|split|test|exec)\(\/\//.test(l));
  if (hits.length) {
    problems.push(
      'A staged line contains `(//` where a regex was intended — the shell ate a backslash.\n' +
      hits.slice(0, 3).map((h) => '     ' + h.trim().slice(0, 100)).join('\n')
    );
  }
} catch { /* not fatal */ }

if (problems.length) {
  console.error('PREFLIGHT FAILED — do not push:\n');
  problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}\n`));
  process.exit(1);
}

console.log('preflight: PASS');
notes.forEach((n) => console.log(`  · ${n}`));
console.log('\n  Guards pass and the build output matches the working tree.');
