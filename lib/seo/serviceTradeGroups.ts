/**
 * WHICH COUNTY+SERVICE PAGES ARE THE SAME ANSWER WRITTEN TWICE.
 *
 * THE PROBLEM, MEASURED
 * ---------------------
 * app/kenya/[county]/[...slug] builds 41 service pages per county, 1,927 in
 * total. Measured on the build of 2026-09-24, comparing six-word phrases
 * within ONE county (Baringo, 820 pairs):
 *
 *     median overlap between any two of its 41 pages   50%
 *     pairs at 50% or more                            417
 *     pairs at 60% or more                             26
 *
 *     72%  automation-services  vs  electrical-services
 *     70%  control-panels       vs  plc-programming
 *     69%  industrial-motors    vs  pump-motors
 *     68%  generator-companies  vs  generators
 *     68%  solar-inverters      vs  solar-spares
 *     67%  ac-gas-refill        vs  ac-repair
 *
 * Every one of those pages carried a self-referential canonical — each
 * declaring itself the definitive answer for its county. Search Console
 * replied with "Duplicate without user-selected canonical" and "Duplicate,
 * Google chose different canonical than user", which is Google saying: these
 * are the same page, you did not tell us which one counts, so we picked.
 *
 * This got worse before it got better. Until 2026-09-22 only ten of the 41
 * were linked from the county page, so Google rarely crawled the other 31.
 * Linking all 41 — correct on its own terms, since a published page nobody
 * can reach is a bug — is what put them in front of the crawler.
 *
 * THE RULE, WHICH IS NOT NEW
 * --------------------------
 * lib/seo/location-service-metadata.ts already decides canonicals this way on
 * the LOCATION axis: "a page earns a self-canonical by having unique
 * substance, and forfeits it by not having any." A constituency page with its
 * own verified altitude keeps its canonical; one without consolidates up to
 * the county.
 *
 * That rule was never applied on the SERVICE axis. It is here.
 *
 * WHAT IS NOT MERGED, AND WHY
 * ---------------------------
 * Trades stay separate. The 2026-09-03 restoration that added air
 * conditioning, boreholes, automation and incinerators back to the county
 * tier was right, and its reasoning holds: "AC repair in Nairobi is not a
 * near-duplicate of generator repair in Nairobi. Different trade, different
 * buyer, different search." Nothing below merges across a trade boundary.
 *
 * What merges is SYNONYMS WITHIN one trade — solar-panels, solar-batteries,
 * solar-inverters and solar-spares are four ways of writing "solar parts in
 * X", and a buyer searching any of them wants the same page.
 *
 * NOTHING IS DELETED, NOTHING REDIRECTS. Every URL still serves 200, still
 * renders, still carries index/follow, and is still linked from its county
 * page. A canonical is a consolidation signal, not a removal: the value of
 * all four solar-parts pages accrues to one, instead of being split four ways
 * and then arbitrated by Google.
 *
 * THE PRIMARIES ARE NOT CHOSEN ARBITRARILY. The ten core slugs are already
 * the canonical targets of the 440-page constituency+service tier, verified
 * against the build. Using them here means no canonical chain forms: a
 * constituency page points at a county+service primary, and that primary
 * points at itself. The three extra primaries — ac-installation,
 * borehole-pumps, incinerators — exist because those trades have no core slug
 * to point at, and pointing air conditioning at a generator page would be
 * worse than the duplication it fixed.
 */

/**
 * Non-primary service slug -> the primary it consolidates onto.
 * A slug absent from this map keeps its own canonical.
 */
export const SERVICE_CANONICAL_PRIMARY: Record<string, string> = {
  // ── Generators. "Companies", "lease", "canopies" and the rest are all the
  //    supply-side question; repairs and parts stay separate below because
  //    fixing one and buying one are different intents.
  'generator-companies': 'generators',
  'generator-lease': 'generators',
  'generator-canopies': 'generators',
  'generator-power-factor': 'generators',
  'automatic-transfer-switch': 'generators',
  'generator-changeover': 'generators',

  // ── Generator service. An overhaul is a repair job, not a purchase.
  'generator-engine-overhaul': 'generator-repairs',
  'repairs': 'generator-repairs',
  'maintenance': 'generator-maintenance',

  // ── Generator parts.
  'spareparts': 'generator-spare-parts',

  // ── Solar. Panels, batteries, inverters and spares are all "solar kit in X".
  'solar-companies': 'solar-installation',
  'solar-panels': 'solar-installation',
  'solar-batteries': 'solar-installation',
  'solar-inverters': 'solar-installation',
  'solar-spares': 'solar-installation',
  'solar-maintenance': 'solar-installation',
  'solar-repairs': 'solar-installation',
  'solar-experts': 'solar-installation',
  'solar-technicians': 'solar-installation',

  // ── Motors.
  'motor-repairs': 'motor-rewinding',
  'motor-maintenance': 'motor-rewinding',
  'motor-spares': 'motor-rewinding',
  'industrial-motors': 'motor-rewinding',
  'pump-motors': 'motor-rewinding',
  'motor-rewinding-companies': 'motor-rewinding',

  // ── Stored power.
  'inverter-systems': 'ups-systems',
  'power-backup': 'ups-systems',

  // ── Electrical and controls. automation-services measured 72% against
  //    electrical-services, control-panels 70% against plc-programming.
  'control-panels': 'electrical-services',
  'plc-programming': 'electrical-services',
  'automation-services': 'electrical-services',

  // ── Air conditioning. No core slug exists for this trade, so the
  //    installation page is promoted to primary rather than folded into an
  //    unrelated one.
  'ac-companies': 'ac-installation',
  'ac-repair': 'ac-installation',
  'ac-maintenance': 'ac-installation',
  'ac-gas-refill': 'ac-installation',

  // ── Water.
  'borehole-drilling': 'borehole-pumps',
  'water-pump-repair': 'borehole-pumps',

  // ── Waste.
  'incinerator-installation': 'incinerators',
  'incinerator-maintenance': 'incinerators',
};

/**
 * The primary a county+service page should declare as canonical.
 * Returns the slug unchanged when it is itself a primary.
 */
export function primaryServiceSlug(slug: string): string {
  return SERVICE_CANONICAL_PRIMARY[slug] ?? slug;
}

/** True when this slug consolidates onto a different page. */
export function isConsolidatedService(slug: string): boolean {
  return slug in SERVICE_CANONICAL_PRIMARY;
}
