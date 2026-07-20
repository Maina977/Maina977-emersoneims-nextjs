#!/usr/bin/env node
/**
 * verify-imports-tracked.mjs — catch "builds locally, dies on Vercel".
 *
 * THE BUG THIS PREVENTS (real incident, commit a692936, 2026-07):
 * Two work-in-progress pages (app/swoosh-x, app/swoosh-preview) were committed
 * while the components they import (components/home/SwooshGallery.tsx,
 * FreshBoot.tsx) were deliberately gitignored as "do not deploy".
 *
 * Locally everything worked — the files are on disk, so `next build` and `tsc`
 * both pass. But Vercel builds from a CLONE, which contains only tracked
 * files, so the imports vanished and the production build failed with:
 *
 *     Module not found: Can't resolve '@/components/home/SwooshGallery'
 *
 * That class of failure is invisible to every local check, because every local
 * check can see the untracked file. Only a tracked-vs-untracked comparison
 * catches it. Hence this script.
 *
 * Run:  node scripts/verify-imports-tracked.mjs
 * Exit: 0 = every import a committed file makes is itself committed
 *       1 = a tracked file imports something Vercel will not receive
 */
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CODE_RE = /\.(tsx|ts|jsx|js|mjs)$/;
const EXTS = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'];

/**
 * Trees Vercel never builds. deployment-package/ is listed in .vercelignore
 * (and .gitignore, though some files predate that), so unresolved imports
 * inside it cannot break a deployment and would only be noise here.
 */
const SKIP_TREES = ['deployment-package/', '_archive/'];

/** existsSync that is true only for real files, never directories. */
function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}

function tracked() {
  const out = execSync('git ls-files', { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return new Set(out.split('\n').map((l) => l.trim()).filter(Boolean));
}

/**
 * Resolve a '@/x/y' specifier the way the tsconfig paths alias does: '@/' maps
 * to the project root. Returns the repo-relative path of the file that would
 * actually be loaded, or null when nothing on disk matches.
 */
function resolveAlias(spec) {
  const base = spec.replace(/^@\//, '');
  // Try the path EXACTLY as written first. Specifiers that already carry an
  // extension — '@/app/data/products.json' being the common case — must not
  // have another extension appended, or they falsely report as missing.
  //
  // isFile() is essential: '@/lib/db' names a DIRECTORY that exists on disk,
  // so a bare existsSync would "resolve" it to the folder and then report the
  // folder as untracked (git tracks files, never directories). Directories
  // must fall through to the index lookup below.
  if (isFile(join(ROOT, base))) return base;
  for (const e of EXTS) {
    const p = base + e;
    if (existsSync(join(ROOT, p))) return p;
  }
  for (const e of EXTS) {
    const p = `${base}/index${e}`;
    if (existsSync(join(ROOT, p))) return p;
  }
  return null;
}

const TRACKED = tracked();
const sources = [...TRACKED].filter(
  (f) => CODE_RE.test(f) && !SKIP_TREES.some((t) => f.startsWith(t)),
);

const missing = []; // nothing on disk at all
const untracked = []; // on disk locally, but Vercel will never see it

for (const file of sources) {
  let src;
  try {
    src = readFileSync(join(ROOT, file), 'utf8');
  } catch {
    continue;
  }
  // Strip comments first. Commented-out imports are not real dependencies —
  // components/lazy/LazyComponents.tsx keeps a disabled `// import('@/components
  // /maps/MapboxMap')` as a placeholder, and counting it produced a false
  // "module missing" failure. Block comments go before line comments so a
  // `//` inside a /* ... */ region cannot confuse the second pass.
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`])\/\/.*$/gm, '$1');

  // static imports, re-exports, and dynamic import() of '@/...' specifiers
  const specs = new Set();
  for (const m of code.matchAll(/from\s+['"](@\/[^'"]+)['"]/g)) specs.add(m[1]);
  for (const m of code.matchAll(/import\(\s*['"](@\/[^'"]+)['"]\s*\)/g)) specs.add(m[1]);

  for (const spec of specs) {
    const resolved = resolveAlias(spec);
    if (!resolved) {
      missing.push({ file, spec });
    } else if (!TRACKED.has(resolved)) {
      untracked.push({ file, spec, resolved });
    }
  }
}

let failed = false;

console.log('═══ imports made by COMMITTED files ═══');
console.log(`  scanned ${sources.length} tracked source files`);

if (untracked.length) {
  failed = true;
  console.log('\n  ✖ TRACKED FILE IMPORTS AN UNTRACKED FILE');
  console.log('    Vercel builds from a clone and will NOT receive these.');
  console.log('    Fix by committing the dependency, or by removing the');
  console.log('    importing file from the repo if it is work-in-progress.\n');
  for (const u of untracked) {
    console.log(`    ${u.file}`);
    console.log(`      imports ${u.spec}`);
    console.log(`      -> ${u.resolved}  (on disk, NOT committed)`);
  }
}

if (missing.length) {
  failed = true;
  console.log('\n  ✖ IMPORT RESOLVES TO NOTHING ON DISK\n');
  for (const m of missing) console.log(`    ${m.file} imports ${m.spec}`);
}

if (!failed) console.log('  ✓ every aliased import of a committed file is itself committed');

process.exit(failed ? 1 : 0);
