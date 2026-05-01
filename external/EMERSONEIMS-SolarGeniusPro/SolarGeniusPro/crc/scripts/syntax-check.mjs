#!/usr/bin/env node
// Fast pre-dev syntax check: parses every .ts/.tsx in src/ with the same Babel
// parser Vite uses. Catches unterminated JSX, missing braces, etc. BEFORE the
// dev server starts, so errors surface as a clear list in the terminal instead
// of a single browser overlay crash.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { parse } from '@babel/parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SRC_DIRS = ['src', 'components'].map((d) => join(ROOT, d));

const EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function walk(dir, out = []) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    let s;
    try {
      s = statSync(full);
    } catch {
      continue;
    }
    if (s.isDirectory()) walk(full, out);
    else {
      const dot = name.lastIndexOf('.');
      if (dot > -1 && EXTS.has(name.slice(dot))) out.push(full);
    }
  }
  return out;
}

const files = SRC_DIRS.flatMap((d) => walk(d));
const errors = [];

for (const file of files) {
  const code = readFileSync(file, 'utf8');
  try {
    parse(code, {
      sourceType: 'module',
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true,
      plugins: ['typescript', 'jsx', 'classProperties', 'decorators-legacy', 'topLevelAwait'],
      errorRecovery: false,
    });
  } catch (e) {
    errors.push({ file, message: e.message });
  }
}

if (errors.length === 0) {
  console.log(`\u2713 syntax-check: ${files.length} files OK`);
  process.exit(0);
}

console.error(`\n\u2717 syntax-check failed (${errors.length} file${errors.length === 1 ? '' : 's'}):\n`);
for (const { file, message } of errors) {
  console.error(`  - ${relative(ROOT, file)}`);
  console.error(`      ${message}\n`);
}
process.exit(1);
