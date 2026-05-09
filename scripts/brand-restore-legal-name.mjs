#!/usr/bin/env node
// Restore "Emerson Industrial Maintenance Services [Limited]" (legal Kenyan
// company name = EIMS expansion) while keeping forbidden US-brand variants
// purged. Strategy: for every file changed in commit 0f41d27, take the
// pre-cleanup version from aef5452, re-apply ONLY the forbidden replacements,
// then write the result. This preserves the legitimate legal name everywhere
// it appeared, and keeps the US-brand purge intact.

import { execSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(process.cwd());
const BASE = 'aef5452';        // commit immediately before brand cleanup
const CLEANUP = '0f41d27';     // brand cleanup commit

// Forbidden US-brand expansions only. NOTE: "Emerson Industrial Maintenance
// Services" is the LEGITIMATE legal name and is intentionally NOT in this list.
const FORBIDDEN = [
  ['Emerson Electrical & Industrial Maintenance Services (EIMS)', 'EmersonEIMS'],
  ['Emerson Electrical & Instrumentation Management Services', 'EmersonEIMS'],
  ['Emerson Energy & Infrastructure Management Solutions', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure Management Solutions', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure Management System', 'EmersonEIMS'],
  ['Emerson Energy Infrastructure', 'EmersonEIMS'],
  ['EMERSON ENERGY', 'EmersonEIMS'],
  ['Emerson Energy', 'EmersonEIMS'],
  ['Emerson Electric Co.', 'EmersonEIMS'],
  ['Emerson Electric', 'EmersonEIMS'],
  ['Vertiv (Emerson/Liebert)', 'Vertiv'],
  ['Vertiv (Emerson)', 'Vertiv'],
  ['Emerson EIMS', 'EmersonEIMS'],
  ['EmersonEIMS / EmersonEIMS', 'EmersonEIMS'],
  ['EmersonEIMS - EmersonEIMS', 'EmersonEIMS'],
  ['EmersonEIMS (EmersonEIMS)', 'EmersonEIMS'],
];

// Files changed by 0f41d27 (relative paths from git).
const changed = execSync(`git diff --name-only ${BASE} ${CLEANUP}`, { encoding: 'utf8' })
  .split('\n').map(s => s.trim()).filter(Boolean);

console.log(`Found ${changed.length} files changed in cleanup commit.`);

let restored = 0;
let unchanged = 0;
let missing = 0;
const restoredList = [];

for (const rel of changed) {
  const abs = path.join(ROOT, rel);
  let baseContent;
  try {
    baseContent = execSync(`git show ${BASE}:"${rel}"`, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    // File didn't exist at BASE (e.g. brand-cleanup.mjs itself). Skip.
    missing++;
    continue;
  }
  let next = baseContent;
  for (const [from, to] of FORBIDDEN) {
    if (next.includes(from)) next = next.split(from).join(to);
  }

  let current;
  try {
    current = await fs.readFile(abs, 'utf8');
  } catch {
    missing++;
    continue;
  }

  if (current === next) {
    unchanged++;
  } else {
    await fs.writeFile(abs, next, 'utf8');
    restored++;
    restoredList.push(rel);
  }
}

console.log(`\nRestored: ${restored}`);
console.log(`Already correct: ${unchanged}`);
console.log(`Skipped (file not in base): ${missing}`);
if (restoredList.length) {
  console.log('\nFiles restored:');
  for (const f of restoredList) console.log('  ' + f);
}
