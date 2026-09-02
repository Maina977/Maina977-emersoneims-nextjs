/*
 * PROMOTIONS — a promotion may only be published if it is real.
 *
 * Created 2026-08-31. Two fabricated promotions were running on this site at
 * the same time, and both had the same defect: a deadline that could not pass.
 *
 *   /solar rendered "SOLAR SAVINGS WEEK - 15% OFF All Systems!" above a
 *   countdown whose end date was computed as `new Date()` plus seven days
 *   INSIDE the effect — re-derived on every mount. Every visitor saw a fresh
 *   6d 23h 59m. The week had been ending for as long as the page had been live.
 *
 *   /generators carried an "URGENCY & SCARCITY" band that counted down to zero
 *   and then reset itself to exactly 3d 14h 27m 45s.
 *
 * A deadline that cannot pass is fabricated, and presenting one to buyers is
 * misleading advertising whether or not a discount sits behind it. There was
 * also a "March Sale: 15% OFF All Generators" running in August.
 *
 * The failure was structural, not clerical: any component could invent a
 * discount and a timer with nothing to check it against. This module makes a
 * promotion a piece of DATA that must satisfy every condition below, and
 * renders nothing when it does not.
 *
 * TO PUBLISH A PROMOTION: add an entry to PROMOTIONS with all fields filled
 * from a real, approved offer. Anything missing means nothing renders — which
 * is the correct outcome, not a bug to work around.
 */

export interface Promotion {
  id: string;
  /** Master switch. False means nothing renders regardless of dates. */
  enabled: boolean;
  /** Headline shown to the customer. State the actual offer, not urgency. */
  headline: string;
  /** ISO date the offer genuinely opens. */
  startsAt: string;
  /** ISO date it genuinely closes. Must be a real, fixed calendar date. */
  endsAt: string;
  /** What the offer actually is. Empty means it cannot be published. */
  terms: string[];
  /** Products or services it applies to. Empty means it cannot be published. */
  eligibleProducts: string[];
  /** Who approved it, and when. An offer nobody owns is not an offer. */
  approvedBy: string;
  /** Optional destination for the call to action. */
  href?: string;
  ctaLabel?: string;
}

/**
 * Approved, live promotions.
 *
 * DELIBERATELY EMPTY. This is not a stub awaiting plausible placeholder data —
 * every entry is a commercial commitment the business must honour on the
 * phone, so entries come only from an approved offer. The empty case is the
 * normal case, and activePromotion() below returns null for it.
 */
export const PROMOTIONS: Promotion[] = [];

/**
 * True only if the promotion is real, complete, approved and currently within
 * its own dates. Every condition must hold; there is no partial publish.
 *
 * `now` is injectable so this is testable without waiting for the calendar.
 */
export function isPublishable(p: Promotion, now: Date = new Date()): boolean {
  if (!p.enabled) return false;
  if (!p.headline?.trim()) return false;
  if (!p.approvedBy?.trim()) return false;
  if (!p.terms?.length) return false;
  if (!p.eligibleProducts?.length) return false;

  const start = Date.parse(p.startsAt);
  const end = Date.parse(p.endsAt);
  // An unparseable or backwards date range is a data error, not a live offer.
  if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
  if (end <= start) return false;

  const t = now.getTime();
  return t >= start && t <= end;
}

/**
 * The one promotion to show, or null.
 *
 * Returns null when nothing qualifies, so callers render nothing rather than
 * an empty band. If several qualify, the one ending soonest wins — that is the
 * only genuine urgency available, and it comes from a real date.
 */
export function activePromotion(now: Date = new Date()): Promotion | null {
  const live = PROMOTIONS.filter((p) => isPublishable(p, now));
  if (!live.length) return null;
  return live.sort((a, b) => Date.parse(a.endsAt) - Date.parse(b.endsAt))[0];
}
