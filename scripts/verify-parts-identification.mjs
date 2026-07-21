#!/usr/bin/env node
/**
 * verify-parts-identification.mjs — enforce the owner's parts-identification rule.
 *
 * THE RULE (owner, 2026-07-21):
 *   "Every part should relate with the machine for that identification. No
 *    guessing. You can't lack the part number AND lack the machine
 *    identification."
 *
 * WHY IT MATTERS
 * A catalogue row showing a part number and a bare dash for fitment is useless
 * to the buyer — they still cannot tell whether it suits their set. Worse, it
 * invites them to order on hope. Either identifier alone is weak; the pair is
 * what makes a part orderable.
 *
 * This gate was written after an audit found 31 parts with a part number and no
 * fitment — all 31 added by me in the preceding commit. 27 were given real
 * fitment; 4 (Donaldson P550008/P551670/P552100 and Fleetguard AF25550) were
 * REMOVED because their application could not be stated with confidence, and
 * the rule says remove rather than guess.
 *
 * CHECKS
 *   1. Every part has a non-empty part number.        (hard fail)
 *   2. Every part has non-empty machine identification — the engine, alternator
 *      family, or application it fits.                (hard fail)
 *   3. Fitment must not be a placeholder such as "-", "n/a", "universal",
 *      "various" or "all" on its own — those identify nothing. (hard fail)
 *
 * Run:  node scripts/verify-parts-identification.mjs
 * Exit: 0 = every part is identifiable, 1 = rule violated
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DB = join(ROOT, 'app/data/spare-parts-database-COMPLETE.json');
const ADDITIONS = join(ROOT, 'app/data/spare-parts-verified-additions.json');

/** Values that look like fitment but identify nothing on their own. */
const PLACEHOLDERS = new Set(['-', '--', 'n/a', 'na', 'tbc', 'tbd', 'various', 'all', 'any', 'unknown', '']);

/**
 * Categories where "Universal" is a LEGITIMATE identification, because the
 * identifying attribute is the specification and it lives in the part name:
 * an M8 x 30 screw fits any M8 x 30 hole; 1.5mm2 cable is identified by size.
 * Machine-specific categories (filters, pistons, injectors, AVRs) are NOT here
 * and must name the engine or alternator family.
 */
const SPEC_IDENTIFIED = new Set(['hardware','tools','lubricants','wiring-electrical','hoses-clamps','fuel-tanks','gauges','safety-fire','enclosures','batteries','control-panels','exhaust-system','belts-pulleys','electrical-components']);

/** Auto-generated filler names — not real products. */
const GENERATED_NAME = /(part|item|component|accessory|spare)\s*#\s*\d+/i;

function collect() {
  const out = [];
  const db = JSON.parse(readFileSync(DB, 'utf8'));
  for (const sub of db?.categories?.[0]?.subcategories ?? []) {
    for (const p of sub.parts ?? []) out.push({ ...p, _cat: sub.id, _src: 'catalogue' });
  }
  try {
    const add = JSON.parse(readFileSync(ADDITIONS, 'utf8'));
    for (const a of add.additions ?? []) {
      for (const p of a.parts ?? []) out.push({ ...p, _cat: a.subcategoryId, _src: 'additions' });
    }
  } catch {
    /* additions file is optional */
  }
  return out;
}

const parts = collect();
const noPartNo = [];
const noMachine = [];
const placeholderOnly = [];
const generated = [];

for (const p of parts) {
  const pn = String(p.partNo ?? '').trim();
  if (!pn) { noPartNo.push(p); continue; }

  const compat = Array.isArray(p.compatibility) ? p.compatibility.map((c) => String(c).trim()).filter(Boolean) : [];
  if (compat.length === 0) { noMachine.push(p); continue; }

  if (GENERATED_NAME.test(p.name ?? '')) { generated.push(p); continue; }

  const meaningful = compat.filter((c) => !PLACEHOLDERS.has(c.toLowerCase()));
  const universalOnly = meaningful.length > 0 && meaningful.every((c) => c.toLowerCase() === 'universal');
  if (meaningful.length === 0) placeholderOnly.push(p);
  else if (universalOnly && !SPEC_IDENTIFIED.has(p._cat)) placeholderOnly.push(p);
}

console.log('═══ parts identification rule ═══');
console.log(`  parts checked: ${parts.length}`);

let failed = false;
const report = (list, title, hint) => {
  if (!list.length) return;
  failed = true;
  console.log(`\n  ✖ ${list.length} ${title}`);
  console.log(`    ${hint}`);
  for (const p of list.slice(0, 20)) {
    console.log(`      ${String(p._cat).padEnd(20)} ${String(p.partNo || '(none)').padEnd(16)} ${String(p.name || '').slice(0, 46)}`);
  }
  if (list.length > 20) console.log(`      … and ${list.length - 20} more`);
};

report(noPartNo, 'part(s) with NO part number', 'Add the manufacturer part number, or remove the row.');
report(
  noMachine,
  'part(s) with NO machine identification',
  'Add the engine, alternator family or application it fits. If it cannot be stated with confidence, REMOVE the part — do not guess.'
);
report(
  generated,
  'part(s) with an auto-generated placeholder name',
  'Names like "Battery Accessory Part #4" identify nothing and are not real products. Remove them or replace with the real product.'
);
report(
  placeholderOnly,
  'part(s) whose fitment is only a placeholder',
  'Values like "various", "universal" or "all" identify nothing. State the actual family or application.'
);

if (failed) {
  console.log('\n  RULE: every part must carry both a part number AND a machine');
  console.log('  identification. A part the customer cannot identify is a part');
  console.log('  they cannot order with confidence.');
  process.exit(1);
}

console.log('  ✓ every part carries both a part number and a machine identification');
