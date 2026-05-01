#!/usr/bin/env node
// scripts/quarantine-math-random.mjs
//
// Surgical codemod: replace every non-ID `Math.random()` call in the listed
// files with an inline IIFE that throws `Error('DATA_POLICY: synthetic value
// refused')`. ID-style usages (`.toString(16)` or `.toString(36)`) are
// preserved because they are random identifiers, not fabricated data.
//
// Run from crc/:  node scripts/quarantine-math-random.mjs
//
// Output: per-file count of replacements, total, and a list of files
// touched. The script is idempotent (already-quarantined sites are
// skipped because the regex no longer matches).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const root       = path.resolve(__dirname, '..');

// Files explicitly opted-in for quarantine. Edit this list rather than
// running globally so we never accidentally touch pure ID-generation code.
const TARGETS = [
  'core/ai/WeatherAlertEngine.ts',
  'core/calculator/Global3DDataProvider.ts',
  'core/advanced/SmartHomeDesignEngine.ts',
  'core/ai/failurePredictionAI.ts',
  'core/ai/AIStorageOptimizerEngine.ts',
  'core/ai/SmartLoadManagementEngine.ts',
  'core/ai/energySimulationEngine.ts',
  'core/ai/learningEngine.ts',
  'src/pages/DashboardPage_Modern.tsx',
  'src/pages/AnalyticsPage.tsx',
];

const REPLACEMENT =
  "(()=>{throw new Error('DATA_POLICY: synthetic value refused — wire a real source. See DATA_POLICY.md')})()";

// Match Math.random() but NOT when followed by .toString(16) or .toString(36)
// (those are legitimate random-ID generators and don't fabricate data).
const PATTERN = /Math\.random\(\)(?!\s*\.toString\(\s*(?:16|36)\s*\))/g;

let totalReplacements = 0;
const filesTouched = [];

for (const rel of TARGETS) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.warn(`[skip] missing: ${rel}`);
    continue;
  }
  const src = fs.readFileSync(full, 'utf8');
  const matches = src.match(PATTERN) || [];
  if (matches.length === 0) {
    console.log(`[ok]   ${rel}: 0 (already clean)`);
    continue;
  }
  const out = src.replace(PATTERN, REPLACEMENT);
  fs.writeFileSync(full, out, 'utf8');
  console.log(`[fix]  ${rel}: ${matches.length} replaced`);
  totalReplacements += matches.length;
  filesTouched.push(rel);
}

console.log('');
console.log(`Done. Files touched: ${filesTouched.length}. Replacements: ${totalReplacements}.`);
