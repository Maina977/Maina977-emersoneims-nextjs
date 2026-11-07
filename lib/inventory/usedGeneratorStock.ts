/**
 * USED-GENERATOR STOCK: the only place the site lists a used unit for sale.
 *
 * Re-audit 7 Nov 2026, item 4: the old /generators/used catalogue was six
 * brand cards with invented price ranges ("KSh 800,000 – 15M"), invented
 * running-hour ranges ("2,000 – 8,500 hrs"), model lists that are not real
 * products (Caterpillar "C100D5", SDMO "AIRDOSER 60") and photographs of new
 * VOLTKA stock and of customers' installed sets presented as pre-owned
 * inventory. None of it described a machine anyone could buy.
 *
 * RULES FOR ADDING A UNIT
 *   - Only a unit physically in our stock, identified by its own stock number.
 *   - Engine hours read from that unit's hour meter, not a typical range.
 *   - A price only if the owner has set one for THAT unit; otherwise leave
 *     priceKes out and the page shows "Request current price".
 *   - testRecord only if a test was actually run on THAT unit, with its date
 *     and report reference.
 *   - photos only of THAT unit. No stock, brand, warehouse or customer images.
 *   - Remove the unit the day it is sold or reserved.
 * isPublishableUnit() enforces the mandatory fields; the page never renders a
 * unit that fails it, and tests/regression/reaudit-2026-11-07.test.ts checks it.
 *
 * While this list is empty the page says so and offers the current stock list
 * on request. That is the honest state, not a placeholder to fill.
 */

export interface UsedUnitTestRecord {
  /** ISO date the test was run, e.g. "2026-11-02". */
  date: string;
  /** Load applied, % of prime rating. */
  loadPercent: number;
  durationHours: number;
  /** Our report number, so the buyer can ask for the document. */
  reportRef: string;
}

export interface UsedGeneratorUnit {
  /** Our stock number, e.g. "EIMS-U-0012". */
  stockId: string;
  make: string;
  model: string;
  /** Prime rating as plated. */
  kvaPrime: number;
  /** Hour-meter reading on the date below. */
  engineHours: number;
  hoursReadOn: string;
  yearOfManufacture?: number;
  enclosure: 'open' | 'canopied';
  phase: 'single' | 'three';
  location: string;
  /** Owner-set price for this unit, KES excl. VAT. Omit if not set. */
  priceKes?: number;
  testRecord?: UsedUnitTestRecord;
  /** Photos of this unit only (paths under /public). At least one. */
  photos: string[];
  /** What the 2-year warranty covers on THIS unit, as written on its quotation. */
  warrantyCoverage: string;
  /** Anything a buyer must know: repairs done, parts replaced, known wear. */
  conditionNotes?: string;
}

/** Owner-confirmed 2026-11-06: every generator we sell, new or used. */
export const USED_WARRANTY_TERM = '2 years';

export const USED_GENERATOR_STOCK: readonly UsedGeneratorUnit[] = [];

export function isPublishableUnit(u: UsedGeneratorUnit): boolean {
  return (
    /^[A-Z0-9][A-Z0-9-]{2,}$/i.test(u.stockId) &&
    u.make.trim() !== '' &&
    u.model.trim() !== '' &&
    u.kvaPrime > 0 &&
    Number.isFinite(u.engineHours) && u.engineHours >= 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(u.hoursReadOn) &&
    u.location.trim() !== '' &&
    u.photos.length > 0 &&
    u.warrantyCoverage.trim() !== '' &&
    (u.testRecord === undefined || (u.testRecord.reportRef.trim() !== '' && /^\d{4}-\d{2}-\d{2}$/.test(u.testRecord.date)))
  );
}

export function publishableStock(list: readonly UsedGeneratorUnit[] = USED_GENERATOR_STOCK): UsedGeneratorUnit[] {
  return list.filter(isPublishableUnit);
}

/**
 * Makes we buy, recondition, sell used and service (owner: VOLTKA is the only
 * make sold new; Perkins, CAT, Volvo Penta and the others are sold used).
 * Links go to the brand pages, which carry the engineering detail.
 */
export const USED_MAKES: readonly { name: string; href: string }[] = [
  { name: 'Cummins', href: '/generators/cummins' },
  { name: 'Perkins', href: '/generators/perkins' },
  { name: 'Caterpillar', href: '/generators/caterpillar' },
  { name: 'Volvo Penta', href: '/generators/volvo-penta' },
  { name: 'FG Wilson', href: '/brands' },
  { name: 'SDMO', href: '/brands/sdmo' },
  { name: 'Weichai', href: '/brands/weichai' },
];

/** What we send for each unit on the current stock list. */
export const STOCK_LIST_FIELDS: readonly string[] = [
  'Stock number, make, model and plated kVA rating',
  'Engine hours from the hour meter, with the date it was read',
  'Year of manufacture, enclosure and phase',
  'Price for that unit (excl. VAT), or "request current price"',
  'Load-test report for that unit, where a test has been run',
  'Photographs of that unit',
  'What the 2-year warranty covers on that unit',
];
