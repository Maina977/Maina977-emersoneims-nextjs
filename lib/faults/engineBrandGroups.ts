import { VERIFIED_FAULT_CODES, type VerifiedFaultCode } from '@/lib/data/verifiedFaultCodes';

/**
 * Engine fault-code reference groups, one per generator brand.
 *
 * THE GAP THIS CLOSES
 * lib/data/verifiedFaultCodes.ts holds 2,145 verified brand+model+code entries
 * across eleven generator engine makers, built by script from a source CSV. Not
 * one of them had a page. They were reachable only inside the Generator Oracle
 * app, which is client-side, so Google could see none of them — the same defect
 * that hid 1,831 plant codes and eight named client testimonials before this.
 *
 * WHY BRAND PAGES AND NOT ONE PAGE PER CODE
 * This decision is settled on this site, and the data settles it again here.
 * Measured across all 2,145 records: the average description is THIRTY
 * CHARACTERS, and only 403 carry a description over 25 characters together
 * with at least one cause and one remedy. A page per code would be a database
 * row with a URL, 2,145 times over — scaled content abuse of exactly the kind
 * this project has already spent days undoing (the fabricated village-tier
 * location pages, and the 1,832 fault pages proposed and correctly retracted
 * in an earlier session).
 *
 * lib/plant-oracle/brandGroups.ts reached the same conclusion for the plant
 * codes and shipped seven brand pages instead. This mirrors it deliberately,
 * down to the 20-code floor, so the two halves of the fault library behave the
 * same way.
 *
 * WHAT MAKES THESE PAGES SUBSTANTIAL RATHER THAN THIN
 * "Every Caterpillar generator fault code in one place" is a real thing a
 * technician searches for and a real thing to publish. The Caterpillar page
 * carries 547 codes; Perkins 513; Cummins 500. And unlike the plant records,
 * these entries carry causes and remedies as well as a description, so each row
 * is a diagnostic line rather than a label.
 *
 * NOTHING IS GENERATED. Every code, description, cause and remedy is read
 * straight from the verified registry. No severity is inferred, no missing
 * remedy is filled in, and a brand with too few codes gets no page rather than
 * a padded one.
 */

export interface EngineBrandGroup {
  slug: string;
  brand: string;
  /** Distinct model/series strings represented, for the page's sub-heading. */
  models: string[];
  codes: VerifiedFaultCode[];
  /** How many of this brand's codes carry at least one remedy. */
  withRemedy: number;
}

/**
 * A brand needs at least this many codes to justify a page of its own — the
 * same floor lib/plant-oracle/brandGroups.ts uses. Doosan (18 codes) falls
 * below it and is deliberately left out rather than published thin; its codes
 * stay searchable inside the Oracle.
 */
const MIN_CODES_FOR_PAGE = 20;

function slugify(brand: string): string {
  return brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function build(): EngineBrandGroup[] {
  const byBrand = new Map<string, VerifiedFaultCode[]>();
  for (const entry of VERIFIED_FAULT_CODES) {
    const key = entry.brand.trim();
    if (!key) continue;
    if (!byBrand.has(key)) byBrand.set(key, []);
    byBrand.get(key)!.push(entry);
  }

  return [...byBrand.entries()]
    .map(([brand, codes]) => {
      // Sort numerically where the code is a number, alphabetically otherwise,
      // so a technician scanning for "1045" finds it where they expect.
      const sorted = [...codes].sort((a, b) => {
        const na = Number(a.code);
        const nb = Number(b.code);
        if (Number.isFinite(na) && Number.isFinite(nb)) return na - nb;
        return a.code.localeCompare(b.code, 'en', { numeric: true });
      });
      return {
        slug: slugify(brand),
        brand,
        models: [...new Set(sorted.map((c) => c.model).filter(Boolean))].sort(),
        codes: sorted,
        withRemedy: sorted.filter((c) => c.remedies.length > 0).length,
      };
    })
    .filter((g) => g.codes.length >= MIN_CODES_FOR_PAGE)
    .sort((a, b) => b.codes.length - a.codes.length);
}

export const ENGINE_BRAND_GROUPS: readonly EngineBrandGroup[] = build();

export function getEngineBrandGroup(slug: string): EngineBrandGroup | undefined {
  return ENGINE_BRAND_GROUPS.find((g) => g.slug === slug);
}

/** Total codes actually published across all brand pages. */
export const ENGINE_CODES_PUBLISHED = ENGINE_BRAND_GROUPS.reduce(
  (n, g) => n + g.codes.length,
  0
);
