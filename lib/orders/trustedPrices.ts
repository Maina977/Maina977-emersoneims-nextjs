/**
 * Server-side prices for marketplace orders (order-abuse hotfix 2026-11-26).
 *
 * The checkout sends each line's unit price from the browser (localStorage
 * cart). That price is never used. Each line is priced here from the trusted
 * record the marketplace itself lists from: the stock file
 * lib/parts/inventory-2026-07-22.csv (column "Price", KES), the same file
 * /api/parts/search reads. 7,793 part codes, each with one consistent
 * positive price (checked 2026-11-26; a code listed twice has the same price).
 *
 * A line is priced only when its code is in that file with exactly one
 * positive price. Anything else (unknown code, conflicting or zero price,
 * file unreadable) is left unpriced and the whole order is "price to be
 * confirmed by EmersonEIMS"; a price from the request is never authoritative.
 */
import fs from 'fs';
import path from 'path';

export const PRICE_SOURCE = 'lib/parts/inventory-2026-07-22.csv';
export const PRICE_TO_BE_CONFIRMED = 'Price to be confirmed by EmersonEIMS';

export interface PriceRecord {
  code: string;
  name: string;
  unitPrice: number; // KES, from the stock file
}

let cache: Map<string, PriceRecord> | null = null;
let cacheFailed = false;

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; } else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      out.push(cur); cur = '';
    } else cur += ch;
  }
  out.push(cur);
  return out;
}

/** Build the price book from CSV text. Codes with conflicting or non-positive prices are excluded. */
export function buildPriceBook(csv: string): Map<string, PriceRecord> {
  const seen = new Map<string, PriceRecord | 'conflict'>();
  const lines = csv.trim().split(/\r?\n/);
  for (const line of lines.slice(1)) {
    const v = parseCSVLine(line);
    const code = (v[0] || '').trim();
    const name = (v[1] || '').trim();
    const price = Number((v[9] || '').trim());
    if (!code) continue;
    const prev = seen.get(code);
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) { seen.set(code, 'conflict'); continue; }
    if (prev === undefined) seen.set(code, { code, name, unitPrice: price });
    else if (prev === 'conflict' || prev.unitPrice !== price) seen.set(code, 'conflict');
  }
  const book = new Map<string, PriceRecord>();
  for (const [code, rec] of seen) if (rec !== 'conflict') book.set(code, rec);
  return book;
}

/** The price book, or null if the trusted file cannot be read (then nothing is priced). */
export function loadPriceBook(): Map<string, PriceRecord> | null {
  if (cache) return cache;
  if (cacheFailed) return null;
  try {
    cache = buildPriceBook(fs.readFileSync(path.join(process.cwd(), 'lib/parts/inventory-2026-07-22.csv'), 'utf-8'));
    return cache;
  } catch {
    cacheFailed = true;
    return null;
  }
}

export interface PricedLine { partCode: string; partName: string; quantity: number; unitPrice: number; subtotal: number }

/**
 * Price every line from the book. Returns the priced lines, or null when any
 * line cannot be priced (the order is then "price to be confirmed").
 */
export function priceLines(
  items: Array<{ partCode: string; quantity: number }>,
  book: Map<string, PriceRecord> | null,
): PricedLine[] | null {
  if (!book) return null;
  const out: PricedLine[] = [];
  for (const it of items) {
    const rec = book.get(it.partCode.trim());
    if (!rec) return null;
    out.push({ partCode: rec.code, partName: rec.name, quantity: it.quantity, unitPrice: rec.unitPrice, subtotal: rec.unitPrice * it.quantity });
  }
  return out;
}
