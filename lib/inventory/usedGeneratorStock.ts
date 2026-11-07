/**
 * USED-GENERATOR STOCK: the only place the site lists a used unit for sale.
 *
 * Re-audit 7 Nov 2026, item 4: the old /generators/used catalogue was six
 * brand cards with invented price ranges, invented running-hour ranges, model
 * lists that are not real products and photographs of new VOLTKA stock and of
 * customers' installed sets presented as pre-owned inventory.
 *
 * SOURCE OF THE UNITS BELOW (2026-11-07): the owner's photos, "IMAGES AND
 * VIDEOS/new images/Photos-2-002.zip" (42 WhatsApp photos dated 4 Nov 2026).
 * Every field is what those photos show and nothing more:
 *   - make/model from the badge or decal on the canopy;
 *   - the GEP110-4 rating, year, voltage and phase from its rating plate
 *     (photo WA0026, not published: it carries a previous owner's asset tag);
 *   - no hour reading is attached to any unit. One photo shows a meter at
 *     2,269.6 h (WA0032), but no photo ties that panel to a particular set;
 *   - no price was supplied, so every unit shows "Request current price".
 * Photos were grouped into units by canopy colour, badge and interior; the
 * owner should confirm the grouping. Not published: WA0015/WA0016 (another
 * company's "Sold and Serviced by" stickers), WA0019 (another dealer's sign;
 * WA0022 shows the same set), and the John Deere set (only its stickered
 * exterior identifies it).
 *
 * RULES FOR ADDING OR EDITING A UNIT
 *   - Only a unit physically in stock, with photos of THAT unit.
 *   - Engine hours only from that unit's hour meter, with the date read.
 *   - A price only if the owner set one for THAT unit.
 *   - testRecord only if a test was actually run on THAT unit.
 *   - Remove the unit the day it is sold or reserved.
 * isPublishableUnit() enforces the mandatory fields; the page never renders a
 * unit that fails it.
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
  /** Our reference for this unit, e.g. "EIMS-U-01". */
  stockId: string;
  /** What the card is headed with, e.g. "Olympian GEP110-4". */
  title: string;
  make?: string;
  model?: string;
  /** Rating exactly as known, with its source, e.g. "100 kVA prime / 110 kVA standby (rating plate)". */
  rating?: string;
  /** Other rating-plate facts: year, voltage, phase, frequency. */
  plate?: string[];
  /** Hour-meter reading and the date it was read; both or neither. */
  engineHours?: number;
  hoursReadOn?: string;
  enclosure: 'open' | 'canopied' | 'trailer-mounted canopy';
  location?: string;
  /** Owner-set price for this unit, KES excl. VAT. Omit if not set. */
  priceKes?: number;
  testRecord?: UsedUnitTestRecord;
  /** Photos of this unit only (paths under /public). At least one. */
  photos: string[];
  /** ISO date the photos were taken. */
  photographedOn: string;
  /** What the 2-year warranty covers on THIS unit. */
  warrantyCoverage: string;
  conditionNotes?: string;
}

/** Owner-confirmed 2026-11-06: every generator we sell, new or used. */
export const USED_WARRANTY_TERM = '2 years';

const COVER = "Stated on this unit's quotation and invoice, according to its condition";
const P = (unit: string, n: number) => Array.from({ length: n }, (_, i) => `/images/used-stock/${unit}-${i + 1}.webp`);

export const USED_GENERATOR_STOCK: readonly UsedGeneratorUnit[] = [
  {
    stockId: 'EIMS-U-01', title: 'Olympian GEP110-4', make: 'Olympian (Caterpillar)', model: 'GEP110-4',
    rating: '100 kVA / 80 kW prime, 110 kVA / 88 kW standby (rating plate)',
    plate: ['Year of manufacture 2011', '415/240 V, three-phase, 50 Hz, 1500 rpm', 'Made in the United Kingdom'],
    enclosure: 'canopied', photos: P('u01-olympian-gep110-4', 2), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-02', title: 'Olympian GEP150-1', make: 'Olympian (Caterpillar)', model: 'GEP150-1',
    enclosure: 'canopied', photos: P('u02-olympian-gep150-1', 1), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-03', title: 'Olympian canopied set', make: 'Olympian (Caterpillar)',
    enclosure: 'canopied', photos: P('u03-olympian', 4), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-04', title: 'Diesel Power canopied set', make: 'Diesel Power',
    enclosure: 'canopied', photos: P('u04-diesel-power', 5), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-05', title: 'Trailer-mounted canopied set',
    enclosure: 'trailer-mounted canopy', photos: P('u06-trailer', 2), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-06', title: 'FG Wilson, Perkins-powered', make: 'FG Wilson',
    enclosure: 'canopied', photos: P('u07-fg-wilson-perkins', 3), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-07', title: 'FG Wilson, Perkins-powered (compact)', make: 'FG Wilson',
    enclosure: 'canopied', photos: P('u08-fg-wilson-perkins', 3), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
  {
    stockId: 'EIMS-U-08', title: 'Cummins canopied set', make: 'Cummins',
    enclosure: 'canopied', photos: P('u09-cummins', 3), photographedOn: '2026-11-04', warrantyCoverage: COVER,
  },
];

const ISO = /^\d{4}-\d{2}-\d{2}$/;

export function isPublishableUnit(u: UsedGeneratorUnit): boolean {
  const hoursOk =
    (u.engineHours === undefined && u.hoursReadOn === undefined) ||
    (u.engineHours !== undefined && Number.isFinite(u.engineHours) && u.engineHours >= 0 && ISO.test(u.hoursReadOn ?? ''));
  return (
    /^[A-Z0-9][A-Z0-9-]{2,}$/i.test(u.stockId) &&
    u.title.trim() !== '' &&
    u.photos.length > 0 &&
    u.photos.every((p) => p.startsWith('/images/')) &&
    ISO.test(u.photographedOn) &&
    u.warrantyCoverage.trim() !== '' &&
    hoursOk &&
    (u.testRecord === undefined || (u.testRecord.reportRef.trim() !== '' && ISO.test(u.testRecord.date)))
  );
}

export function publishableStock(list: readonly UsedGeneratorUnit[] = USED_GENERATOR_STOCK): UsedGeneratorUnit[] {
  return list.filter(isPublishableUnit);
}

/**
 * Makes we buy, recondition, sell used and service (owner: VOLTKA is the only
 * make sold new; Perkins, CAT, Volvo Penta and the others are sold used).
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

/** What we send for each unit on request. */
export const STOCK_LIST_FIELDS: readonly string[] = [
  'Make, model and plated kVA rating',
  'Engine hours from the hour meter, with the date it was read',
  'Year of manufacture, enclosure and phase',
  'Price for that unit (excl. VAT)',
  'Load-test report for that unit, where a test has been run',
  'More photographs of that unit',
  'What the 2-year warranty covers on that unit',
];
