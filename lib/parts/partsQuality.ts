/**
 * partsQuality — enforce the owner's parts-identification rule at render time.
 *
 * THE RULE (owner, 2026-07-21):
 *   "Every part should relate with the machine for that identification. No
 *    guessing. You can't lack the part number and lack the machine
 *    identification."
 *
 * Applying that rule to the existing catalogue exposed three problems:
 *
 * 1. GENERATED FILLER — 485 of 1,248 rows (39%) were auto-generated: names like
 *    "Battery Accessory Part #1" through "#80", "Tool Part #1", "Enclosure Part
 *    #1", carrying invented part numbers (BAT-ACC-001). They identify nothing,
 *    they are not real products, and a customer clicking "Quote" on one gets a
 *    meaningless enquiry. These are hidden.
 *
 * 2. WRONG FITMENT — six AVRs were listed as "Universal" when they are strictly
 *    brand-specific. An SX460 is a Stamford part; telling a customer with a
 *    Leroy Somer alternator that it is universal sells them the wrong part.
 *    These are corrected.
 *
 * 3. DUPLICATES — the same product listed under two numbering styles
 *    (SX460 and SX460-AVR). Deduplication now normalises part numbers.
 *
 * NOTHING IS DELETED. Filtering happens at READ time; the underlying JSON is
 * untouched, so any decision here is reversible by editing this one file.
 *
 * "Universal" is NOT treated as invalid everywhere. For hardware, cable,
 * lubricants and fittings the identification legitimately IS the specification
 * — an M8 x 30 screw fits any M8 x 30 hole, 1.5mm² cable is identified by its
 * size. It is only wrong on parts that are genuinely machine-specific.
 */

export type PartLike = {
  partNo: string;
  name: string;
  brand?: string;
  category?: string;
  compatibility?: string[];
  pricing?: { currency?: string; retailPrice?: number; bulkPrice?: number; minimumOrder?: number };
};

/**
 * Auto-generated filler: "<Something> Part #12", "Item #3", "Component #7".
 * Matches the generated blocks found in the catalogue, not legitimate names
 * that merely contain a number (e.g. "Gauge 52mm").
 */
const GENERATED_NAME = /\b(part|item|component|accessory|spare)\s*#\s*\d+/i;

/** Fitment values that identify nothing on their own. */
const EMPTY_FITMENT = new Set(['', '-', '--', 'n/a', 'na', 'tbc', 'tbd', 'unknown', 'any', 'various', 'all']);

/**
 * Corrections for parts whose stored fitment is wrong. Keyed by normalised part
 * number. These are brand-specific components that were marked "Universal".
 */
const FITMENT_CORRECTIONS: Record<string, string[]> = {
  SX460: ['Stamford BC / UC / S0 / S1 series alternators'],
  SX440: ['Stamford UC / HC series alternators'],
  MX341: ['Stamford PMG-excited alternators'],
  MX321: ['Stamford PMG-excited alternators'],
  AS440: ['Stamford self-excited alternators'],
  AS480: ['Stamford self-excited alternators'],
  R438: ['Leroy Somer LSA series alternators'],
  R449: ['Leroy Somer LSA series alternators (PMG-excited)'],
  R230: ['Leroy Somer LSA series alternators'],
  R250: ['Leroy Somer LSA series alternators'],
  UVR6: ['Mecc Alte alternators'],
  SR7: ['Mecc Alte alternators'],
};

/** Normalise a part number so SX460 and SX460-AVR are recognised as one part. */
export function normalisePartNo(pn: string): string {
  return String(pn ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .replace(/(AVR|OEM|GEN)$/, '');
}

/** True when the row is auto-generated filler rather than a real product. */
export function isGeneratedFiller(p: PartLike): boolean {
  return GENERATED_NAME.test(p.name ?? '');
}

/** Meaningful fitment entries only. */
export function meaningfulFitment(p: PartLike): string[] {
  const raw = Array.isArray(p.compatibility) ? p.compatibility : [];
  return raw.map((c) => String(c).trim()).filter((c) => c && !EMPTY_FITMENT.has(c.toLowerCase()));
}

/**
 * Apply corrections, drop generated filler, and de-duplicate.
 * Order is preserved so the catalogue reads the same as before.
 */
export function cleanParts(parts: PartLike[]): PartLike[] {
  const seen = new Set<string>();
  const out: PartLike[] = [];

  for (const p of parts) {
    if (!p?.partNo || !p?.name) continue;
    if (isGeneratedFiller(p)) continue;

    const key = normalisePartNo(p.partNo);
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const correction = FITMENT_CORRECTIONS[key];
    out.push(correction ? { ...p, compatibility: correction } : p);
  }

  return out;
}

/**
 * What to show in the "Fits" column. Never a bare dash: if we genuinely do not
 * hold fitment, say so in a way that tells the customer what to do next, which
 * is the point of the owner's rule.
 */
export function fitmentLabel(p: PartLike): string {
  const f = meaningfulFitment(p);
  if (f.length) return f.slice(0, 4).join(', ');
  return 'Confirm with your serial number';
}
