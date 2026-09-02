import { OEM_FAULT_CODES } from './oemFaultCodes';

/**
 * Brand-family fault-code reference groups.
 *
 * WHY GROUPS AND NOT ONE PAGE PER CODE
 * The 1,831 OEM codes are currently reachable only through a client-side search
 * box on /plant-equipment-oracle, so Google can see none of them. The obvious
 * fix — a page per code — is the wrong one, and measuring the data is what
 * showed it: each record carries brand, family, code and a description
 * averaging THIRTY-SEVEN CHARACTERS. A page built from that is a database row
 * with a URL, and 1,831 of them is scaled content abuse of exactly the kind
 * this site has already been damaged by and spent two days undoing.
 *
 * The working model on this site is /faults/spn-157 and its siblings: about
 * 1,020 words of genuine diagnostic content per page, and they rank. Scaling
 * THAT to 1,831 codes would take roughly 1.8 million words that nobody has
 * written, and inventing them is not an option.
 *
 * So: seven substantial reference pages, one per engine family, each carrying
 * its complete code table. "Every Bobcat loader fault code in one place" is a
 * real thing a technician searches for and a real thing to publish. It makes
 * 1,799 codes crawlable without creating a single thin page.
 *
 * Groups below 20 codes are deliberately excluded — Hyundai R-9 (12) and
 * LiuGong CLG (4) would be thin on their own. They stay searchable in the tool.
 */

export interface BrandGroup {
  slug: string;
  brand: string;
  family: string;
  /** How the codes on this page are formatted, e.g. "SPN.FMI" or "M-code". */
  codeShape: string;
  codes: { code: string; description: string }[];
}

/** A group needs at least this many codes to justify a page of its own. */
const MIN_CODES_FOR_PAGE = 20;

function slugify(brand: string, family: string): string {
  return `${brand}-${family}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Describe the code format from the codes themselves rather than asserting it.
 * A technician who knows the shape can find their code faster.
 */
function describeShape(codes: { code: string }[]): string {
  const sample = codes.slice(0, 40).map((c) => c.code);
  if (sample.every((c) => /^\d+\.\d+$/.test(c))) return 'SPN.FMI (SAE J1939)';
  if (sample.some((c) => /^[A-Z]-?\d+/.test(c))) return 'alphanumeric OEM code';
  if (sample.every((c) => /^\d+$/.test(c))) return 'numeric OEM code';
  return 'OEM code';
}

function build(): BrandGroup[] {
  const byKey = new Map<string, { brand: string; family: string; codes: { code: string; description: string }[] }>();

  for (const row of OEM_FAULT_CODES) {
    const key = `${row.brand}::${row.family}`;
    if (!byKey.has(key)) byKey.set(key, { brand: row.brand, family: row.family, codes: [] });
    byKey.get(key)!.codes.push({ code: row.code, description: row.description });
  }

  return [...byKey.values()]
    .filter((g) => g.codes.length >= MIN_CODES_FOR_PAGE)
    .map((g) => ({
      slug: slugify(g.brand, g.family),
      brand: g.brand,
      family: g.family,
      codeShape: describeShape(g.codes),
      // Sort so a reader scanning for their code finds it predictably.
      codes: [...g.codes].sort((a, b) =>
        a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' })
      ),
    }))
    .sort((a, b) => b.codes.length - a.codes.length);
}

export const BRAND_GROUPS: readonly BrandGroup[] = build();

export function getBrandGroup(slug: string): BrandGroup | undefined {
  return BRAND_GROUPS.find((g) => g.slug === slug);
}

export function getBrandGroupSlugs(): string[] {
  return BRAND_GROUPS.map((g) => g.slug);
}

/** Total codes made crawlable by these pages — used in copy, so keep it derived. */
export function totalCodesCovered(): number {
  return BRAND_GROUPS.reduce((n, g) => n + g.codes.length, 0);
}
