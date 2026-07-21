#!/usr/bin/env node
/**
 * import-parts-prices.mjs — merge a REAL price/stock export into the website's
 * spare-parts catalogue.
 *
 * WHY THIS EXISTS
 * The owner asked for the catalogue to be expanded to ~15,000 parts with
 * current selling prices. Neither half of that can be invented:
 *
 *   - Part numbers are manufacturer facts. A generated part number that looks
 *     plausible (LF9114) but does not exist is worse than a wrong price — the
 *     customer orders something nobody can supply.
 *   - Selling prices are EmersonEIMS's own commercial data. They depend on
 *     buying cost, margin, forex and duty. No amount of web research produces
 *     OUR price; it produces somebody else's, out of date.
 *
 * The EmersonEIMS ERP's 15,453-SKU catalogue was examined and rejected for
 * exactly this reason: assets/js/seed-catalog.js builds it from nested
 * brand x rating loops with formula prices (8000 + watts*20), cost fixed at
 * price*0.4 and hardcoded quantities.
 *
 * So this script is the honest path: YOU export real data, it lands on the
 * site. Nothing is generated here — every row must come from the export.
 *
 * USAGE
 *   1. In ERP PRO -> Stores & Inventory, click the "CSV" button to export.
 *   2. node scripts/import-parts-prices.mjs <export.csv> [--apply]
 *
 * Without --apply it runs a DRY RUN: reports what would change and writes
 * nothing. Always dry-run first.
 *
 * ACCEPTED COLUMNS (case/spacing insensitive, extra columns ignored)
 *   required : part number  (aliases: partno, part_no, part number, code, sku)
 *   required : price        (aliases: price, retail, retail price, selling price)
 *   optional : bulk price   (aliases: bulk, bulk price, wholesale, trade price)
 *   optional : min order    (aliases: moq, minimum order, min qty)
 *   optional : name / description, brand
 *
 * BEHAVIOUR
 *   - Matches on part number, case-insensitive, ignoring spaces and dashes.
 *   - Only UPDATES prices of parts already in the catalogue. It never invents
 *     a catalogue entry from a price row alone, because a price row carries no
 *     engine-compatibility data and compatibility is what makes these pages
 *     worth publishing.
 *   - Unmatched export rows are listed in the report so you can see which real
 *     parts are missing from the site and supply their details.
 *   - Refuses to write a price of 0 or a non-numeric price.
 *   - Backs the catalogue up before writing.
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const DB_PATH = join(ROOT, 'app/data/spare-parts-database-COMPLETE.json');

const args = process.argv.slice(2);
const csvPath = args.find((a) => !a.startsWith('--'));
const APPLY = args.includes('--apply');

if (!csvPath) {
  console.error('Usage: node scripts/import-parts-prices.mjs <export.csv> [--apply]');
  process.exit(1);
}
if (!existsSync(csvPath)) {
  console.error(`✖ CSV not found: ${csvPath}`);
  process.exit(1);
}

/** Minimal RFC4180-ish CSV parser: handles quoted fields and embedded commas. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false;
      } else field += c;
    } else if (c === '"') inQ = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim() !== ''));
}

const norm = (s) => String(s ?? '').toLowerCase().replace(/[\s_-]/g, '');
const key = (s) => norm(s);

const ALIASES = {
  partNo: ['partno', 'partnumber', 'part', 'code', 'sku', 'itemcode'],
  price: ['price', 'retail', 'retailprice', 'sellingprice', 'unitprice', 'sellprice'],
  bulk: ['bulk', 'bulkprice', 'wholesale', 'wholesaleprice', 'tradeprice'],
  moq: ['moq', 'minimumorder', 'minorder', 'minqty', 'minimumqty'],
  name: ['name', 'description', 'itemname', 'partname'],
  brand: ['brand', 'make', 'manufacturer'],
};

function findCol(headers, aliases) {
  for (let i = 0; i < headers.length; i++) {
    if (aliases.includes(norm(headers[i]))) return i;
  }
  return -1;
}

function money(v) {
  const n = Number(String(v ?? '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

// ── read the export ──────────────────────────────────────────────────────────
const rows = parseCsv(readFileSync(csvPath, 'utf8'));
if (rows.length < 2) { console.error('✖ CSV has no data rows'); process.exit(1); }

const headers = rows[0];
const cPart = findCol(headers, ALIASES.partNo);
const cPrice = findCol(headers, ALIASES.price);
const cBulk = findCol(headers, ALIASES.bulk);
const cMoq = findCol(headers, ALIASES.moq);

console.log('═══ import-parts-prices ═══');
console.log(`  file: ${csvPath}`);
console.log(`  columns detected: ${headers.join(' | ')}`);
if (cPart < 0 || cPrice < 0) {
  console.error('\n✖ Could not find a part-number column and/or a price column.');
  console.error(`  part number aliases: ${ALIASES.partNo.join(', ')}`);
  console.error(`  price aliases:       ${ALIASES.price.join(', ')}`);
  console.error('  Rename the header in your export, or add the alias above.');
  process.exit(1);
}

const exported = new Map();
let skipped = 0;
for (const r of rows.slice(1)) {
  const pn = (r[cPart] ?? '').trim();
  const price = money(r[cPrice]);
  if (!pn || !price) { skipped++; continue; }
  exported.set(key(pn), {
    partNo: pn,
    price,
    bulk: cBulk >= 0 ? money(r[cBulk]) : null,
    moq: cMoq >= 0 ? Number(String(r[cMoq]).replace(/[^0-9]/g, '')) || null : null,
  });
}
console.log(`  usable price rows: ${exported.size}  (skipped ${skipped} with no part number or no valid price)`);

// ── walk the catalogue ───────────────────────────────────────────────────────
const db = JSON.parse(readFileSync(DB_PATH, 'utf8'));
const subs = db?.categories?.[0]?.subcategories ?? [];

let matched = 0, changed = 0, unchanged = 0;
const samples = [];
const catalogueKeys = new Set();

for (const sub of subs) {
  for (const p of sub.parts ?? []) {
    catalogueKeys.add(key(p.partNo));
    const hit = exported.get(key(p.partNo));
    if (!hit) continue;
    matched++;
    const before = p.pricing?.retailPrice ?? null;
    if (before === hit.price && (!hit.bulk || p.pricing?.bulkPrice === hit.bulk)) { unchanged++; continue; }
    changed++;
    if (samples.length < 12) {
      samples.push(`${p.partNo.padEnd(14)} ${String(before ?? '—').padStart(8)} -> ${String(hit.price).padStart(8)}`);
    }
    if (APPLY) {
      p.pricing = {
        currency: 'KES',
        retailPrice: hit.price,
        ...(hit.bulk ? { bulkPrice: hit.bulk } : p.pricing?.bulkPrice ? { bulkPrice: p.pricing.bulkPrice } : {}),
        ...(hit.moq ? { minimumOrder: hit.moq } : p.pricing?.minimumOrder ? { minimumOrder: p.pricing.minimumOrder } : {}),
        source: 'erp-export',
        updated: new Date().toISOString().slice(0, 10),
      };
    }
  }
}

const unmatched = [...exported.values()].filter((e) => !catalogueKeys.has(key(e.partNo)));

console.log('\n═══ RESULT ═══');
console.log(`  catalogue parts:        ${catalogueKeys.size}`);
console.log(`  matched by part number: ${matched}`);
console.log(`    price would change:   ${changed}`);
console.log(`    already correct:      ${unchanged}`);
console.log(`  export rows with no catalogue entry: ${unmatched.length}`);

if (samples.length) {
  console.log('\n  sample changes (part, old -> new KES):');
  samples.forEach((s) => console.log('    ' + s));
}

if (unmatched.length) {
  console.log('\n  first 15 unmatched part numbers — these are real parts we sell');
  console.log('  but do not yet list. Send their engine compatibility and they');
  console.log('  can be added to the catalogue properly:');
  unmatched.slice(0, 15).forEach((u) => console.log(`    ${u.partNo}  (KES ${u.price})`));
}

if (!APPLY) {
  console.log('\n  DRY RUN — nothing written. Re-run with --apply to save.');
  process.exit(0);
}

if (changed === 0) {
  console.log('\n  Nothing to write.');
  process.exit(0);
}

const backup = DB_PATH.replace(/\.json$/, `.backup-${Date.now()}.json`);
copyFileSync(DB_PATH, backup);
writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
console.log(`\n  ✓ wrote ${changed} price updates`);
console.log(`  ✓ backup: ${backup}`);
console.log('  Next: npx tsc --noEmit, then commit and deploy.');
