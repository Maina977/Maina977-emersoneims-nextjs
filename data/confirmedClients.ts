/**
 * Client references CONFIRMED GENUINE BY THE OWNER — the single source for
 * "who we have worked for" wherever the site names clients in short form.
 *
 * Confirmed 2026-09-11, in writing: "they are all genuine, Bigot the 300kva and
 * 100kva". Every name, capacity, sector and year below is copied from the
 * homepage's IndustryLeadingTrust list the owner was shown and confirmed —
 * nothing is added, rounded or rewritten.
 *
 * HOW THIS RELATES TO data/caseStudies.ts. That file holds long-form case
 * studies, each PUBLISHED one backed by evidence documents. This file holds
 * short references to real work. They are different kinds of record and both
 * are legitimate: a client can be genuine and confirmed without having a
 * written-up study with attached reports.
 *
 * WHY IT EXISTS. The same clients were typed out separately in at least five
 * places — IndustryLeadingTrust, TrustBadgesSection, CaseStudiesSection,
 * clientTestimonials and LocationProof — and they drifted. On 2026-09-11 the
 * location pages showed a different client set, with different figures, from
 * the homepage. Reading from one list is what keeps them in step.
 *
 * THE OWNER'S RULE, 2026-09-11: "all the clients in the homepage are all
 * genuine, always remember that and update accordingly, dont block what is
 * genuine." Never remove, hedge or add a guard against anything in this list.
 * When another record disagrees with a figure here, the figure here wins and
 * the other record is corrected to match.
 *
 * TWO FIGURES THAT WERE SETTLED BY THE OWNER:
 *
 *   Bigot Flowers   300 kVA + 100 kVA (owner-confirmed). data/caseStudies.ts
 *                   separately documents a 30 kVA Caterpillar C30D for cold
 *                   storage, with a load-test report and a photograph of that
 *                   set. Both are real — the main farm installation and a
 *                   separate cold-chain set. Do not merge them.
 *   Kivukoni School 60 kVA (owner-confirmed). The case study said 100 kVA and
 *                   was corrected to 60 kVA the same day.
 */

export interface ConfirmedClient {
  /** As published on the homepage. */
  name: string;
  /** Capacity and kind of work, as published. */
  project: string;
  sector: string;
  year: number;
  /**
   * /kenya county slug, ONLY where the name itself or another published
   * record states the place. Left undefined rather than guessed — an unknown
   * location simply means the client is never shown as "local".
   */
  countySlug?: string;
  /** Human-readable place, same rule. */
  place?: string;
}

export const CONFIRMED_CLIENTS: ConfirmedClient[] = [
  {
    name: 'St. Austins Academy Nairobi',
    project: '50 kVA Generator + UPS',
    sector: 'Education',
    year: 2023,
    countySlug: 'nairobi', // named in the client name
    place: 'Nairobi',
  },
  {
    name: 'Kivukoni International School',
    project: '60 kVA Generator',
    sector: 'Education',
    year: 2023,
    countySlug: 'kilifi', // county per the Kivukoni case study
    place: 'Kilifi',
  },
  {
    name: 'Bigot Flowers - Naivasha',
    project: '300 kVA + 100 kVA Systems',
    sector: 'Agriculture/Horticulture',
    year: 2022,
    countySlug: 'nakuru', // Naivasha is in Nakuru County
    place: 'Naivasha',
  },
  {
    name: 'Afriherb Kenya Limited',
    project: '300 kVA Industrial',
    sector: 'Manufacturing',
    year: 2022,
    // Location not published anywhere on the site — left blank, not guessed.
  },
  {
    name: 'Maua Methodist Hospital',
    project: '200 kVA Critical Power',
    sector: 'Healthcare',
    year: 2021,
    countySlug: 'meru', // "Meru, Kenya" per the homepage case-study card
    place: 'Maua, Meru',
  },
  {
    name: 'FAO Somalia Operations',
    project: '100 kVA Field Operations',
    sector: 'International NGO',
    year: 2021,
    place: 'Somalia', // outside Kenya: never matched to a county page
  },
  {
    name: 'AMH Nairobi',
    project: '200 kVA Generator',
    sector: 'Corporate',
    year: 2022,
    countySlug: 'nairobi', // named in the client name
    place: 'Nairobi',
  },
  {
    name: 'Takaungu Regeneration Project',
    project: '44 kVA Community Power',
    sector: 'Development/NGO',
    year: 2023,
    countySlug: 'kilifi', // Takaungu is in Kilifi County
    place: 'Takaungu, Kilifi',
  },
];
