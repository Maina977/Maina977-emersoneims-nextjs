/**
 * VOLTKA GENERATOR PRICES — THE ONLY GENERATOR PRICES THIS SITE PUBLISHES.
 *
 * Confirmed by the owner on 2026-11-05:
 *   - make: VOLTKA, new
 *   - rating: prime
 *   - terms: ex-warehouse, generator only (delivery, installation, cabling,
 *     civil works and changeover quoted separately)
 *   - VAT: prices EXCLUDE VAT (16%)
 *   - any size not listed here: "Request current price"
 *
 * Every page, table, meta description and JSON-LD offer that shows a generator
 * price reads it from this file. The figures that were on the site before
 * (from KES 280,000 for 10 kVA, the brand ranges for Cummins, Perkins and
 * FG Wilson, the per-size bands from 10 to 500 kVA) were not in the owner's
 * confirmed list and were removed. Do not add a size or a figure here unless
 * the owner has confirmed it; tests/regression/voltka-confirmed-prices-2026-11-05.test.ts
 * pins the list.
 */

export interface VoltkaConfirmedPrice {
  kva: number;
  /** Open-frame set, KES excl. VAT. Absent where the owner gave no open price. */
  openKes?: number;
  /** Silent (canopied) set, KES excl. VAT. */
  silentKes?: number;
}

export const VOLTKA_PRICES_AS_OF = '2026-11-05';
export const VOLTKA_PRICES_AS_OF_LABEL = '5 November 2026';

export const VOLTKA_CONFIRMED_PRICES: readonly VoltkaConfirmedPrice[] = [
  { kva: 100, openKes: 2_100_000, silentKes: 2_500_000 },
  { kva: 125, openKes: 2_200_000, silentKes: 2_600_000 },
  { kva: 150, openKes: 2_300_000, silentKes: 2_700_000 },
  { kva: 200, openKes: 2_800_000, silentKes: 3_000_000 },
  { kva: 250, openKes: 3_100_000, silentKes: 3_500_000 },
  { kva: 312, openKes: 4_000_000, silentKes: 4_100_000 },
  { kva: 375, openKes: 4_400_000, silentKes: 4_800_000 },
  { kva: 500, silentKes: 6_000_000 },
  { kva: 750, silentKes: 9_100_000 },
];

/** Short statement of what the price covers. Shown wherever a price is. */
export const VOLTKA_PRICE_BASIS =
  'New VOLTKA, prime rated, ex-warehouse, excluding VAT. Delivery, installation, cabling and civil works are quoted separately.';

/** One-line version for meta descriptions and table footers. */
export const VOLTKA_PRICE_BASIS_SHORT = 'prime rated, ex-warehouse, excl. VAT';

export const REQUEST_CURRENT_PRICE = 'Request current price';

export function confirmedPriceFor(kva: number): VoltkaConfirmedPrice | undefined {
  return VOLTKA_CONFIRMED_PRICES.find((p) => p.kva === kva);
}

/** Lowest and highest confirmed price (KES) for one size, or null. */
export function confirmedBoundsFor(kva: number): { low: number; high: number } | null {
  const p = confirmedPriceFor(kva);
  if (!p) return null;
  const nums = [p.openKes, p.silentKes].filter((n): n is number => typeof n === 'number' && n > 0);
  if (!nums.length) return null;
  return { low: Math.min(...nums), high: Math.max(...nums) };
}

/** "KES 2,100,000" — locale-independent so server and browser render the same. */
export function kes(n: number): string {
  return `KES ${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

/** "KES 2.1M" style for tight spaces. */
export function kesMillions(n: number): string {
  const m = n / 1_000_000;
  const s = Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
  return `KES ${s}M`;
}

/**
 * Display text for a size: "Open frame KES 2,100,000 · Silent KES 2,500,000",
 * "Silent KES 6,000,000", or "Request current price".
 */
export function priceTextFor(kva: number): string {
  const p = confirmedPriceFor(kva);
  if (!p) return REQUEST_CURRENT_PRICE;
  const parts: string[] = [];
  if (p.openKes) parts.push(`Open frame ${kes(p.openKes)}`);
  if (p.silentKes) parts.push(`Silent ${kes(p.silentKes)}`);
  return parts.join(' · ');
}

/** The published span, for "100–750 kVA from KES 2.1M" summaries. */
export function confirmedSpan(): { minKva: number; maxKva: number; lowKes: number; highKes: number } {
  const all = VOLTKA_CONFIRMED_PRICES.flatMap((p) => [p.openKes, p.silentKes]).filter(
    (n): n is number => typeof n === 'number',
  );
  return {
    minKva: Math.min(...VOLTKA_CONFIRMED_PRICES.map((p) => p.kva)),
    maxKva: Math.max(...VOLTKA_CONFIRMED_PRICES.map((p) => p.kva)),
    lowKes: Math.min(...all),
    highKes: Math.max(...all),
  };
}

/**
 * The one sentence summaries use. It does NOT say "from KES 2.1M" on its own:
 * smaller sets exist and are priced on request, so "from" would imply the
 * 100 kVA price is the cheapest generator we sell.
 */
export function confirmedSpanSentence(): string {
  const s = confirmedSpan();
  return `VOLTKA ${s.minKva}–${s.maxKva} kVA: ${kesMillions(s.lowKes)} to ${kesMillions(s.highKes)} (${VOLTKA_PRICE_BASIS_SHORT}); other sizes on request`;
}
