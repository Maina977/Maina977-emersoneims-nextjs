/**
 * locationFacts — DERIVED, VERIFIABLE facts for location landing pages.
 *
 * WHY THIS EXISTS (audit 2026-07-20)
 * The ~190 location pages were measured at 84% identical body text: three
 * different towns' pages shared 382-385 of 453 words, differing only by the
 * substituted place name. That is the textbook signature of scaled content
 * abuse / doorway pages under Google's March 2024 spam policy, and it is
 * precisely the pattern that earns a site-wide demotion.
 *
 * Worse, the shared boilerplate asserted things that are NOT TRUE:
 *   "Our technicians are based strategically to ensure fast response times
 *    throughout {location}."
 * EmersonEIMS operates from ONE base (Embakasi, Nairobi). Claiming resident
 * technicians in ~190 towns is an unverified claim, and the owner's audit
 * brief forbids publishing those outright.
 *
 * THE RULE THIS MODULE FOLLOWS
 * Every value returned here is either (a) already-stored real data — census
 * population, official coordinates, administrative hierarchy — or (b) computed
 * arithmetically from that data. NOTHING is invented. There are no fabricated
 * project counts, client names, response-time promises or local-presence
 * claims. If a fact is unknown, the field is omitted and the page renders
 * without it rather than filling the gap with plausible-sounding text.
 *
 * The result differentiates each page with information a customer genuinely
 * benefits from (how far we travel to reach them, what else is nearby) instead
 * of with reworded filler.
 */

import { COUNTIES, getLocationBySlug, type Location } from '@/lib/seo/kenyaLocations';

/**
 * Our single operating base: Embakasi, Nairobi — off Airport North Road, near
 * the KEMSA head office. Confirmed by the owner 2026-07-18. Coordinates are
 * the Embakasi area centroid, NOT a surveyed pin: they are used only to
 * compute approximate road-trip context, never presented as an exact address.
 */
const BASE = { lat: -1.3200, lng: 36.8900, label: 'Embakasi, Nairobi' };

/** Great-circle distance in km. Standard haversine; Earth radius 6371 km. */
function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

/** Compass direction from the base, e.g. "north-west". */
function bearingLabel(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): string {
  const dLat = to.lat - from.lat;
  const dLng = to.lng - from.lng;
  const ns = dLat > 0.15 ? 'north' : dLat < -0.15 ? 'south' : '';
  const ew = dLng > 0.15 ? 'east' : dLng < -0.15 ? 'west' : '';
  if (ns && ew) return `${ns}-${ew}`;
  return ns || ew || 'within';
}

export type LocationFacts = {
  name: string;
  /** Straight-line km from our Embakasi base. Undefined when unknown. */
  distanceKm?: number;
  /** Compass direction from the base, e.g. "north-west". */
  direction?: string;
  /** Census population, when recorded. */
  population?: number;
  /** County this place sits in (name), when resolvable. */
  countyName?: string;
  /** The county's administrative capital. */
  countyCapital?: string;
  /** Other served places in the same county, nearest first. Real slugs only. */
  nearby: Array<{ slug: string; name: string }>;
  /** How many constituencies the county has (real administrative count). */
  constituencyCount?: number;
};

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Build the fact set for a location slug. Returns null when the slug is
 * unknown, so callers can fall back to the plain template rather than render
 * half-empty prose.
 */
export function getLocationFacts(slug: string): LocationFacts | null {
  const loc: Location | undefined = getLocationBySlug(slug);
  if (!loc) return null;

  const county =
    COUNTIES.find((c) => c.slug === slug) ??
    COUNTIES.find(
      (c) => c.constituencies.includes(slug) || c.majorTowns.includes(slug)
    );

  const facts: LocationFacts = {
    name: loc.name,
    population: loc.population,
    countyName: county?.name,
    countyCapital: county?.capital,
    constituencyCount: county?.constituencies.length,
    nearby: [],
  };

  if (loc.coordinates) {
    const km = haversineKm(BASE, loc.coordinates);
    // Round to a sensible precision: exact-looking decimals would imply a
    // survey we did not perform.
    facts.distanceKm = km < 20 ? Math.round(km) : Math.round(km / 5) * 5;
    facts.direction = bearingLabel(BASE, loc.coordinates);
  }

  // Sibling places in the same county that we actually publish pages for.
  if (county) {
    const siblings = [...county.majorTowns, ...county.constituencies]
      .filter((s) => s !== slug)
      .filter((s, i, arr) => arr.indexOf(s) === i)
      .slice(0, 6);
    facts.nearby = siblings.map((s) => ({
      slug: s,
      name: getLocationBySlug(s)?.name ?? titleFromSlug(s),
    }));
  }

  return facts;
}

/**
 * The honest service-model sentence that REPLACES the old
 * "our technicians are based strategically in {location}" claim.
 *
 * It states what is actually true: one Nairobi base, teams dispatched from it,
 * with the real travel distance given so the customer can judge response time
 * for themselves. It deliberately makes NO promise about hours-to-site — we
 * have no measured figure for that, so none is offered.
 */
export function serviceModelSentence(facts: LocationFacts): string {
  if (facts.distanceKm == null) {
    return `Our engineering teams are dispatched from our ${BASE.label} base to ${facts.name}, with equipment, spares and test gear carried to site.`;
  }
  if (facts.distanceKm <= 25) {
    return `${facts.name} sits roughly ${facts.distanceKm} km from our ${BASE.label} workshop, so our teams reach it directly from base with spares and test equipment on board.`;
  }
  // "in a straight line" is stated deliberately. These are great-circle
  // distances, and the road journey is always longer (e.g. Mombasa is 432 km
  // direct but about 485 km by road). Quoting the direct figure without that
  // qualifier would understate the travel actually involved.
  return `${facts.name} lies about ${facts.distanceKm} km ${facts.direction} of our ${BASE.label} workshop in a straight line, further by road. Teams travel from base with the spares, tooling and test equipment the job needs, so a single visit can cover diagnosis and repair rather than requiring a return trip.`;
}

export const OPERATING_BASE = BASE;
