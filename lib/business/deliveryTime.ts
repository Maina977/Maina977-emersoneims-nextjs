/**
 * Delivery, dispatch and installation-time wording: the ONLY source for it.
 *
 * Re-audit 7 Nov 2026, item 3. The site promised, in different places:
 * "same-day delivery in Nairobi", "order before 2pm, delivered same day",
 * "order before 12pm", "next-day Mombasa", "48hr nationwide", "next-day across
 * Kenya", rental road times from "2-4 hours" to "18-36 hours", installation
 * "within 48-72 hours of approval", "3-5 business days", "5-10 days" and
 * "emergency installations within 48 hours". None was owner-confirmed and
 * several contradicted each other.
 *
 * What the business does stand behind (already on the parts pages): confirmed
 * stock orders are DISPATCHED the same day; ARRIVAL depends on transport.
 * Generator delivery and installation dates depend on the unit, the site and
 * the survey, so they are set in the written quotation.
 *
 * Emergency response wording lives in ./responseTime.ts.
 */
export const PARTS_DISPATCH =
  'Confirmed stock orders are dispatched the same day; arrival depends on transport and distance.';
export const PARTS_DISPATCH_SHORT = 'Same-day dispatch on confirmed stock orders';
export const GENERATOR_DELIVERY =
  'Delivery date confirmed with your order: it depends on the unit, stock and distance.';
export const INSTALL_SCHEDULE =
  'Installation and commissioning dates are set in your written quotation after the site survey.';
export const RENTAL_DELIVERY =
  'Delivery time and transport cost are confirmed when you book: they depend on the unit, distance and site access.';
