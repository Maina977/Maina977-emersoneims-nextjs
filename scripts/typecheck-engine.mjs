// typecheck-engine.mjs — SMOKE TYPE-GATE for external/borehole-ai-engine
// ─────────────────────────────────────────────────────────────────────────
// The main tsconfig EXCLUDES external/** so the borehole engine is never
// type-checked by the Next.js build. On 2026-07-16 a bare identifier
// (`annualOM` missing from a destructure) shipped to production and threw a
// ReferenceError mid-PDF, truncating every customer report at page 24.
//
// This gate catches that entire bug class: it runs tsc over every engine
// source file (--noResolve: module-resolution errors are expected and
// ignored) and FAILS on:
//   TS1xxx  — syntax errors
//   TS2304  — cannot find name (the annualOM class)
//   TS2448 / TS2454 — use before declaration / assignment
//
// Run:  node scripts/typecheck-engine.mjs   (portable node OK)
import { execFileSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'external', 'borehole-ai-engine', 'src');
const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc');

const files = readdirSync(SRC).filter((f) => /\.(ts|tsx)$/.test(f)).map((f) => join(SRC, f));
console.log(`Type-gate: ${files.length} engine files`);

let out = '';
try {
  out = execFileSync(process.execPath, [
    tsc, '--noEmit', '--skipLibCheck', '--noResolve',
    '--target', 'es2020', '--module', 'esnext', '--jsx', 'react-jsx',
    ...files,
  ], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
} catch (e) {
  out = `${e.stdout ?? ''}${e.stderr ?? ''}`;
}

const fatal = out.split(/\r?\n/).filter((l) =>
  /error TS(1\d{3}|2304|2448|2454)\b/.test(l) &&
  // 1259/1192-style import-interop noise from --noResolve is not a code defect
  !/TS1259|TS1192|TS1479/.test(l));

if (fatal.length > 0) {
  console.error(`\nFATAL ENGINE DEFECTS (${fatal.length}):`);
  for (const l of fatal.slice(0, 40)) console.error('  ' + l);
  console.error('\nThese are runtime crashes waiting to ship (syntax / undefined identifier). Fix before committing.');
  process.exit(1);
}
console.log('Engine type-gate PASSED (no syntax / undefined-identifier defects).');
