#!/usr/bin/env node
// Brand cleanup: remove forbidden Emerson Energy / Electric / Industrial variants.
// Active files only. Keeps _archive untouched. Keeps legal disclaimers intact.

import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());

const SKIP_DIRS = new Set([
  'node_modules', '.next', '.git', '_archive', '.vercel', '.turbo',
  'dist', 'build', 'out', 'coverage', '.cache', 'playwright-report',
  'test-results',
]);

// Files that intentionally name the US companies in order to disavow them.
const KEEP_AS_IS = new Set([
  path.join(ROOT, 'lib', 'ai', 'claudeService.ts'),
  path.join(ROOT, 'lib', 'building', 'ai', 'claudeService.ts'),
  path.join(ROOT, 'app', 'api', 'ai', 'chat', 'stream', 'route.ts'),
  path.join(ROOT, 'scripts', 'brand-cleanup.mjs'),
].map(p => p.toLowerCase()));

// Top-level throwaway log files to skip
const SKIP_TOP_PATTERNS = [
  /^build[-_].*\.txt$/i,
  /^_.*\.txt$/i,
  /^_.*\.patch$/i,
  /^_.*\.mjs$/i,
  /^lighthouse.*\.json$/i,
  /^lh.*\.json$/i,
  /^audit-services\.txt$/i,
  /^full-build-errors\.txt$/i,
  /^performance-test\.json$/i,
  /^MEDIA_RESOLUTION_REPORT\.json$/i,
  /^chunk-.*\.js$/i,
  /^debug\.js$/i,
];

const ALLOWED_EXTS = new Set([
  '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs',
  '.md', '.mdx', '.json', '.html', '.css', '.txt',
  '.yml', '.yaml',
]);

// Order: longest first so partial replacements don't strip context prematurely.
const REPLACEMENTS = [
  ['Emerson Electrical & Industrial Maintenance Services (EIMS)', 'EmersonEIMS'],
  ['Emerson Electrical & Instrumentation Management Services', 'EmersonEIMS'],
  ['Emerson Energy & Infrastructure Management Solutions', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure Management Solutions', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure Management System', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure', 'EmersonEIMS'],
  ['Emerson Industrial Maintenance Services Limited', 'EmersonEIMS'],
  ['Emerson Industrial Maintenance Services (EIMS)', 'EmersonEIMS'],
  ['Emerson Industrial Maintenance Services', 'EmersonEIMS'],
  ['Emerson Industrial Maintenance', 'EmersonEIMS'],
  ['EMERSON ENERGY', 'EmersonEIMS'],
  ['Emerson Energy', 'EmersonEIMS'],
  ['Emerson Electric Co.', 'EmersonEIMS'],
  ['Emerson Electric', 'EmersonEIMS'],
  ['Vertiv (Emerson)', 'Vertiv'],
  ['Emerson EIMS', 'EmersonEIMS'],
  // Post-cleanup compaction (composite phrases that collapse to duplicates):
  ['EmersonEIMS / EmersonEIMS', 'EmersonEIMS'],
  ['EmersonEIMS - EmersonEIMS', 'EmersonEIMS'],
  ['EmersonEIMS (EmersonEIMS)', 'EmersonEIMS'],
];

let filesScanned = 0;
let filesChanged = 0;
const changedList = [];

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile()) {
      // Skip top-level throwaway logs
      if (path.dirname(full) === ROOT) {
        if (SKIP_TOP_PATTERNS.some(rx => rx.test(entry.name))) continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (!ALLOWED_EXTS.has(ext)) continue;
      if (KEEP_AS_IS.has(full.toLowerCase())) continue;
      await processFile(full);
    }
  }
}

async function processFile(file) {
  filesScanned++;
  let text;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch {
    return;
  }
  let next = text;
  for (const [from, to] of REPLACEMENTS) {
    if (next.includes(from)) {
      next = next.split(from).join(to);
    }
  }
  if (next !== text) {
    await fs.writeFile(file, next, 'utf8');
    filesChanged++;
    changedList.push(path.relative(ROOT, file));
  }
}

await walk(ROOT);

console.log(`Scanned ${filesScanned} files.`);
console.log(`Changed ${filesChanged} files:`);
for (const f of changedList) console.log('  ' + f);
