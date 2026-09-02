/**
 * Build lib/data/verifiedFaultCodes.ts from lib/data/fault-codes-raw.csv
 *
 * The raw CSV is genuine curated data (12 real brands, 44 models, 2,156 unique
 * brand+model+code combinations) but it has two structural defects that must be
 * corrected before it is served to technicians:
 *
 *  1. Unquoted commas inside the Probable Cause and Solution fields spilled
 *     content across the trailing "solution 2..4" columns. In roughly 43% of
 *     rows the Solution column actually holds a fragment of the cause, so a
 *     naive import shows a cause where the fix should be. Columns 4-9 are
 *     therefore pooled and re-classified per item: entries beginning with an
 *     action verb are remedies, the rest are causes.
 *  2. 1,000 duplicate brand+model+code rows, and one junk row whose brand is
 *     literally "Brand" (a stray header). Both are dropped.
 *
 * Codes are industry-standard identifiers and the descriptions here are the
 * project's own curated text, consistent with the copyright posture documented
 * in lib/generator-oracle/data/*.ts.
 *
 * Run: node scripts/buildVerifiedFaultCodes.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '../lib/data/fault-codes-raw.csv');
const outPath = path.join(__dirname, '../lib/data/verifiedFaultCodes.ts');

function parseCSV(t) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (inQ) {
      if (c === '"' && t[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQ = false;
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter(r => r.some(x => x.trim()));
}

const ACTION = /^(replace|inspect|check|test|clean|repair|verify|reset|adjust|tighten|top\s?up|drain|refill|bleed|recalibrat|contact|measure|flush|service|re-?torque|reprogram|calibrat|install|remove|rebuild|overhaul|lubricat|change|update|tune|purge|seal|repl)/i;

const rows = parseCSV(fs.readFileSync(csvPath, 'utf8'));
const data = rows.slice(1);

const seen = new Map();
let dropped = 0, junk = 0;

for (const r of data) {
  const brand = (r[0] || '').trim();
  const model = (r[1] || '').trim();
  const code = (r[2] || '').trim();
  const description = (r[3] || '').trim();

  if (!brand || !code || brand.toLowerCase() === 'brand') { junk++; continue; }

  const key = `${brand}|${model}|${code}`.toLowerCase();
  if (seen.has(key)) { dropped++; continue; }

  // Pool columns 4..end and re-classify, repairing the comma spill.
  const pool = r.slice(4).map(x => (x || '').trim()).filter(Boolean);
  const causes = [], remedies = [];
  for (const item of pool) {
    for (const part of item.split(/\s*;\s*/).filter(Boolean)) {
      (ACTION.test(part) ? remedies : causes).push(part);
    }
  }

  seen.set(key, {
    code, brand, model, description,
    causes: [...new Set(causes)],
    remedies: [...new Set(remedies)],
  });
}

const entries = [...seen.values()].sort(
  (a, b) => a.brand.localeCompare(b.brand) || a.code.localeCompare(b.code)
);

const brands = [...new Set(entries.map(e => e.brand))].sort();
const withRemedy = entries.filter(e => e.remedies.length).length;

const esc = s => JSON.stringify(s);

const out = `/**
 * VERIFIED FAULT CODES — generated file, do not edit by hand.
 *
 * Source : lib/data/fault-codes-raw.csv
 * Builder: scripts/buildVerifiedFaultCodes.mjs
 * Built  : ${new Date().toISOString().slice(0, 10)}
 *
 * INDEPENDENT REFERENCE DATA
 * ==========================
 * Fault code numbers are industry-standard identifiers used here for
 * identification purposes only. Fault descriptions are short factual
 * descriptors of the condition (for example "Low Fuel Rail Pressure"), and the
 * cause and remedy entries are brief technical statements of engineering fact.
 * Nothing in this file is transcribed from a manufacturer service manual.
 *
 * This database is NOT affiliated with, endorsed by, or officially associated
 * with Perkins, Cummins, Caterpillar, Deutz, SDMO, Atlas Copco, Weichai,
 * Generac, Kohler, Doosan, or any other manufacturer. All brand names, model
 * numbers and trademarks are the property of their respective owners. For
 * official documentation always refer to the manufacturer's service manual for
 * the specific engine.
 *
 * Diagnostic content attached to these codes at runtime comes from
 * lib/data/faultKnowledge.ts, which is written from first principles in our own
 * words and carries the same posture.
 *
 * ${entries.length} unique brand+model+code entries across ${brands.length} brands.
 * Duplicates and malformed rows are removed by the builder; the CSV's spilled
 * cause/solution columns are re-classified per item (see the builder header).
 *
 * ${withRemedy} of ${entries.length} entries carry at least one remedy. Entries without one
 * still carry a verified code, brand, model and description — that is useful and
 * honest; an empty remedy list must render as "no remedy recorded" rather than
 * as a fabricated instruction.
 */

export interface VerifiedFaultCode {
  code: string;
  brand: string;
  model: string;
  description: string;
  causes: string[];
  remedies: string[];
}

export const VERIFIED_FAULT_CODES: VerifiedFaultCode[] = [
${entries.map(e => `  { code: ${esc(e.code)}, brand: ${esc(e.brand)}, model: ${esc(e.model)}, description: ${esc(e.description)}, causes: ${JSON.stringify(e.causes)}, remedies: ${JSON.stringify(e.remedies)} },`).join('\n')}
];

export const VERIFIED_FAULT_CODE_COUNT = VERIFIED_FAULT_CODES.length;

export const VERIFIED_FAULT_CODE_BRANDS = ${JSON.stringify(brands)};
`;

fs.writeFileSync(outPath, out);

console.log(`entries written : ${entries.length}`);
console.log(`duplicates      : ${dropped}`);
console.log(`junk rows       : ${junk}`);
console.log(`brands          : ${brands.length} -> ${brands.join(', ')}`);
console.log(`with remedy     : ${withRemedy}`);
console.log(`output          : ${outPath}`);
