/*
 * COMMERCIAL POLICY — ONE SOURCE FOR WARRANTY AND SERVICE WORDING.
 *
 * Created 2026-08-31. A live crawl found "2-Year Warranty" rendering on the
 * homepage, /generators, /services, /about-us, /brands, /industries,
 * /locations, /generators/maintenance, /locations/<area> and
 * /east-africa/tanzania — 168 hard-coded occurrences across more than forty
 * files, none of them reading from a shared source. Alongside it the site
 * separately promised "1 Year Free Service", "6-Month Service", a
 * "30-Day Money-Back" guarantee and a "Price Match Guarantee".
 *
 * Two problems, and the second is the serious one.
 *
 * First, they disagreed with each other. A buyer comparing two pages of this
 * site could be told two different things about the same purchase.
 *
 * Second, and worse, a single duration was being applied universally — to new
 * sets, used sets, refurbished sets, third-party equipment and repairs alike.
 * A warranty is a term of a specific contract for a specific machine. Stating
 * one blanket figure site-wide asserts a commitment on stock nobody has priced
 * and on used equipment where it cannot be true, and it is the kind of promise
 * that surfaces after a failure, when it is expensive to have been wrong.
 *
 * OWNER-CONFIRMED TERMS, 2026-09-02
 *
 *   Warranty        2 years, NEW GENERATOR SETS ONLY.
 *   Free servicing  1 year, on those same new sets.
 *
 * The scope is the load-bearing half. "New generator sets only" means the
 * term does NOT extend to used or refurbished sets, to solar, UPS, inverters,
 * motors or pumps, or to repair labour — each of which carries its own terms,
 * stated in the quotation. That is why the wording below still exists and is
 * still used everywhere outside a new-generator context: the figures are
 * confirmed, but they are confirmed for one product line, and the defect this
 * file was created to fix was publishing them as a promise about everything.
 *
 * The one-year figure settles a contradiction the site had been publishing on
 * both sides: lib/data/warranties.ts offered "free service for the first 1
 * year" in one entry and "complimentary maintenance for the first 6 months" in
 * the next, and pages quoted whichever they had copied. That file is now
 * corrected to one year and is the schedule of record.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * RELATED, AND IMPORTANT: lib/data/warranties.ts
 *
 * That file already holds a properly structured, differentiated warranty
 * schedule — new generators, used generators, rental, solar — with coverage
 * lists and a claim process. It is the best warranty data in this repository
 * and it is DEAD CODE: nothing imports it. Meanwhile more than twenty files
 * hard-coded "2-Year Warranty" independently. The correct source existed and
 * went unused while the wrong copies multiplied.
 *
 * It is not wired up here yet for one reason: it contradicts itself on the
 * free-service period. GENERATOR_WARRANTIES.new lists "Free service for the
 * first 1 year" in its coverage, and the very next entry in the same array
 * offers "Complimentary maintenance service for the first 6 months". The site
 * published BOTH ("1 Year Free Service" in some places, "6-Month Service" in
 * others), so the contradiction shipped.
 *
 * Which is correct is a management question, not one to settle by picking the
 * more generous number. Until it is answered, warranty DURATIONS are published
 * only where they are scoped to new generator sales, and free-service periods
 * are not published as a duration at all.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Site-wide wording. Use these instead of writing a warranty duration into a
 * page. They describe how warranty is determined, which is verifiable, rather
 * than how long it lasts, which varies per contract.
 */
export const COMMERCIAL_POLICY = {
  /** Short badge/chip text. Replaces "2-Year Warranty" in cards and pills. */
  warrantyShort: 'Warranty confirmed in quotation',

  /** One-line version for feature lists and comparison rows. */
  warrantyLine: 'Warranty terms vary by product and are confirmed in your written quotation.',

  /** Fuller paragraph for service and product pages. */
  warrantyDetail:
    'Warranty cover differs between new, used and refurbished equipment, and between the ' +
    'set, the alternator and the controls. The applicable term, what it covers and what ' +
    'it requires of you are stated in the written quotation for your specific machine.',

  /**
   * Owner-confirmed 2026-09-02: one year, on NEW GENERATOR SETS. Use this
   * only where the surrounding copy makes that scope explicit.
   */
  freeServicingNewSets: '1 year free servicing on new generator sets',

  /** Neutral fallback for everything that is NOT a new generator set. */
  servicePackageShort: 'Service package confirmed in quotation',

  servicePackageLine:
    'Service-package terms are confirmed in your quotation, and depend on the equipment ' +
    'supplied and the site it runs on.',

  /**
   * Maintenance obligation. This is true regardless of the term, and it is the
   * part customers most need to know, because it is the usual reason a claim
   * is refused.
   */
  maintenanceCondition:
    'Cover depends on the set being serviced at the intervals stated in the quotation, ' +
    'with the service record kept.',
} as const;

/**
 * Per-product warranty. Deliberately every field optional: a product should
 * publish only what has actually been confirmed for it, and show nothing where
 * a value is unknown rather than inheriting someone else's term.
 */
export interface ProductWarranty {
  /** e.g. "24 months or 1,000 running hours, whichever comes first". */
  duration?: string;
  /** Who carries the obligation — us, the manufacturer, or the supplier. */
  provider?: string;
  partsCovered?: string;
  labourCovered?: string;
  /** When cover begins: delivery, commissioning, or first start. */
  startsFrom?: string;
  /** Servicing the customer must perform to keep cover valid. */
  maintenanceRequired?: string;
  exclusions?: string[];
  /** Link to the full written terms, once they exist as a published document. */
  termsUrl?: string;
}

/**
 * Approved per-product warranty terms.
 *
 * DELIBERATELY EMPTY. It is not a stub to be filled with plausible values —
 * an entry here is a commitment the business must honour, so it is added only
 * from a management-approved schedule. Code must therefore handle "no entry"
 * as the normal case, which is what warrantyFor() below guarantees.
 */
export const PRODUCT_WARRANTY: Record<string, ProductWarranty> = {
  /*
   * Owner-confirmed 2026-09-02. Keyed by product line, NOT applied globally —
   * warrantyFor() returns the site-wide mechanism for anything absent here,
   * which is the correct answer for used sets, solar, UPS, motors and repairs.
   */
  'new-generator': {
    duration: '2 years',
    provider: 'EmersonEIMS',
    partsCovered: 'Engine components and factory defects, alternator and starter motor, control panel and wiring',
    startsFrom: 'Commissioning',
    maintenanceRequired: 'Serviced at the intervals stated in the quotation, with the service record kept',
    exclusions: ['Used and refurbished sets', 'Solar, UPS, inverters, motors and pumps', 'Repair labour on third-party equipment'],
  },
};

/**
 * Warranty wording for a product, falling back to the site-wide mechanism.
 *
 * Always returns something displayable, so a caller never has to choose
 * between showing an invented duration and showing nothing at all.
 */
export function warrantyFor(productSlug?: string): { short: string; detail: string } {
  const entry = productSlug ? PRODUCT_WARRANTY[productSlug] : undefined;

  if (entry?.duration) {
    return {
      short: entry.duration,
      detail: [entry.duration, entry.partsCovered, entry.labourCovered, entry.maintenanceRequired]
        .filter(Boolean)
        .join('. '),
    };
  }

  return {
    short: COMMERCIAL_POLICY.warrantyShort,
    detail: COMMERCIAL_POLICY.warrantyDetail,
  };
}
