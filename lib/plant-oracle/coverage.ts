import {
  VERIFIED_FAULT_CODES,
  type VerifiedFaultCode,
} from '@/lib/data/verifiedFaultCodes';
import { OEM_FAULT_CODES, searchOemCodes } from '@/lib/plant-oracle/oemFaultCodes';

/**
 * PLANT & EQUIPMENT ORACLE — coverage and search over VERIFIED data only.
 *
 * WHY THIS IS BUILT ON verifiedFaultCodes.ts AND NOTHING ELSE.
 * The generator side of this codebase also exposes `generateExtendedCodes()`,
 * whose own file header states it is "TEMPLATE EXPANSION, not curated data" —
 * every integer in a range, not a verified fault. That is where the ~451,000
 * figure comes from. It is honestly labelled at source, and it must never be
 * the basis of a diagnostic answer here: roughly 9,500 fabricated codes were
 * removed from this database once already, and rebuilding that is not on the
 * table.
 *
 * So this tool reads curated records only — never the expanded ranges. Two
 * sets feed it: the 2,155 engine-brand records in verifiedFaultCodes.ts, and
 * the 1,831 machine-maker records in oemFaultCodes.ts (Bobcat, Kubota, John
 * Deere, Volvo CE, Komatsu, SANY, JCB, Hitachi, Hyundai, LiuGong) sourced and
 * rewritten on 2026-08-16/17. Smaller number than
 * the headline figure elsewhere on the site, entirely defensible.
 *
 * WHAT MAKES THIS A *PLANT* TOOL RATHER THAN A GENERATOR ONE.
 * The codes are keyed to ENGINE families — Perkins 1100, Cummins QSB, Cat C9,
 * Deutz TCD — and those engines are fitted to excavators, loaders, rollers,
 * telehandlers, compressors and drill rigs as readily as to gensets. Nothing
 * needed inventing to serve plant equipment; the data was always engine data.
 *
 * WHAT IS DELIBERATELY NOT CLAIMED.
 * No machine-to-engine fitment table. Asserting "a JCB 3CX has engine X" for
 * every machine and year is exactly the kind of confident, unverifiable claim
 * this project has had to strip out before. Instead the tool asks the
 * technician to read the engine data plate, which is what actually happens in
 * the field and is always correct for the machine in front of them.
 *
 * DECLARED GAPS ARE PART OF THE PRODUCT. Brands with no records say so. A
 * tool that admits Yanmar is missing is more trustworthy than one that quietly
 * returns nothing, and it tells the owner exactly which manual to source next.
 * Eight brands came off that list on 2026-08-16 because real tables were
 * sourced, not because the claim softened.
 */

export interface BrandCoverage {
  brand: string;
  codes: number;
  families: string[];
  /**
   * Whether the codes are keyed to an ENGINE or to a MACHINE.
   *
   * Not cosmetic — it tells the technician where to look. An engine-brand row
   * is found from the engine data plate; a machine-maker row is found from the
   * badge on the bodywork. Merging both under one "Engine brand" heading, as
   * this table did after the OEM sets were added, told half the readers to go
   * to the wrong place.
   */
  kind: 'engine' | 'machine';
}

/** Brands we hold verified records for, largest first. */
export function getCoverage(): BrandCoverage[] {
  const map = new Map<string, { codes: number; families: Set<string> }>();
  /*
   * Machine-maker codes sourced separately (Bobcat, Kubota, John Deere,
   * Volvo CE, Komatsu, JCB, Hitachi, Hyundai) sit alongside the engine set. A technician does not
   * care which file a code came from, so coverage is reported as one list.
   */
  const kinds = new Map<string, 'engine' | 'machine'>();

  for (const r of OEM_FAULT_CODES) {
    const e = map.get(r.brand) ?? { codes: 0, families: new Set<string>() };
    e.codes += 1;
    if (r.family) e.families.add(r.family);
    map.set(r.brand, e);
    kinds.set(r.brand, 'machine');
  }
  for (const r of VERIFIED_FAULT_CODES) {
    const e = map.get(r.brand) ?? { codes: 0, families: new Set<string>() };
    e.codes += 1;
    if (r.model) e.families.add(r.model);
    map.set(r.brand, e);
    // An engine brand that ALSO has machine-maker records keeps 'machine',
    // because that is the surface a reader will recognise it by.
    if (!kinds.has(r.brand)) kinds.set(r.brand, 'engine');
  }
  return [...map.entries()]
    .map(([brand, v]) => ({
      brand,
      codes: v.codes,
      families: [...v.families].sort(),
      kind: kinds.get(brand) ?? 'engine',
    }))
    .sort((a, b) => b.codes - a.codes);
}

/**
 * Brands a Kenyan plant operator will ask for and we hold NOTHING on.
 *
 * Listed explicitly rather than left as an empty search result. Each needs a
 * real source — an OEM workshop manual we rephrase in our own words, or our
 * own job cards — before it can appear in results. Until then the tool says so.
 */
export const DECLARED_GAPS: readonly string[] = [
  /*
   * Nine brands came off this list once real tables were sourced. These are
   * the ones still genuinely uncovered.
   *
   * YANMAR IS DELIBERATELY NOT LISTED AS A GAP, and does not have a table
   * either: Yanmar reports faults as standard J1939 SPN/FMI pairs, so it is
   * already served by the decoder rather than needing records of its own.
   * Listing it as missing would understate what the tool can actually do.
   *
   * XCMG, Lonking and Shantui were attempted on 2026-08-17 and no usable public
   * table was found for any of them — every promising source was a Scribd or
   * PDFCoffee mirror returning 403. Left declared rather than padded out with
   * guesses. Each needs an owner-supplied workshop manual.
   */
  'XCMG',
  'Lonking',
  'Shantui',
] as const;

export interface SearchHit extends VerifiedFaultCode {
  /** Why this record matched, for display. */
  matchedOn: 'code' | 'description' | 'brand' | 'model';
}

/**
 * Search the verified set. Exact and prefix code matches rank above text
 * matches, because a technician standing at a machine types the number first.
 */
export function searchPlantCodes(
  query: string,
  opts: { brand?: string; limit?: number } = {}
): SearchHit[] {
  const q = query.trim().toLowerCase();
  const limit = Math.min(Math.max(opts.limit ?? 40, 1), 200);
  if (!q && !opts.brand) return [];

  const brandFilter = opts.brand?.toLowerCase();

  /*
   * OEM machine-maker codes are searched first and surfaced above the engine
   * set. Someone who types a Komatsu CA code wants the Komatsu answer, not a
   * Perkins code that happens to share digits.
   */
  const oem: SearchHit[] = searchOemCodes(query, { brand: opts.brand, limit }).map((r) => ({
    code: r.code,
    brand: r.brand,
    model: r.family,
    description: r.description,
    causes: [],
    remedies: [],
    matchedOn: 'code' as const,
  }));

  const exact: SearchHit[] = [];
  const prefix: SearchHit[] = [];
  const text: SearchHit[] = [];

  for (const r of VERIFIED_FAULT_CODES) {
    if (brandFilter && r.brand.toLowerCase() !== brandFilter) continue;
    if (!q) {
      text.push({ ...r, matchedOn: 'brand' });
      if (text.length >= limit) break;
      continue;
    }
    const code = r.code.toLowerCase();
    if (code === q) exact.push({ ...r, matchedOn: 'code' });
    else if (code.startsWith(q)) prefix.push({ ...r, matchedOn: 'code' });
    else if (r.description.toLowerCase().includes(q)) text.push({ ...r, matchedOn: 'description' });
    else if (r.model.toLowerCase().includes(q)) text.push({ ...r, matchedOn: 'model' });
    else if (r.brand.toLowerCase().includes(q)) text.push({ ...r, matchedOn: 'brand' });
  }

  return [...oem, ...exact, ...prefix, ...text].slice(0, limit);
}

/** Headline figures, computed rather than asserted. */
export function getStats() {
  const brands = new Set<string>();
  const families = new Set<string>();
  let withRemedy = 0;
  for (const r of OEM_FAULT_CODES) {
    brands.add(r.brand);
    if (r.family) families.add(`${r.brand} ${r.family}`);
  }
  for (const r of VERIFIED_FAULT_CODES) {
    brands.add(r.brand);
    if (r.model) families.add(`${r.brand} ${r.model}`);
    if (r.remedies.length > 0) withRemedy += 1;
  }
  return {
    codes: VERIFIED_FAULT_CODES.length + OEM_FAULT_CODES.length,
    engineCodes: VERIFIED_FAULT_CODES.length,
    oemCodes: OEM_FAULT_CODES.length,
    brands: brands.size,
    families: families.size,
    withRemedy,
    gaps: DECLARED_GAPS.length,
  };
}
