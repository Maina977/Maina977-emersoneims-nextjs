/**
 * Company history vs individual experience: the ONLY source for both.
 *
 * Owner-confirmed 2026-11-06: EmersonEIMS was founded in 2011 (NOT 2013; the
 * About page still said "Est. 2013" until 2026-11-07). JSON-LD foundingDate
 * is 2011-03-01 (app/layout.tsx, components/seo/StructuredData.tsx).
 *
 * Re-audit 7 Nov 2026, item 7: pages blurred the two. "15+ years of combined
 * technical experience", "over 15 years of combined experience", "10+ years of
 * combined experience" and team cards with "8+ years average" were never
 * measured for any engineer; the only verified figure is the company's own
 * history. Say "since 2011" for the business. For people, say that each
 * engineer's experience and qualifications come with the quotation; never a
 * number we have not checked.
 */
export const FOUNDING_YEAR = 2011;
export const COMPANY_HISTORY_LINE = 'Operating in Kenya since 2011';
export const TECHNICIAN_EXPERIENCE_LINE =
  "Each engineer's experience and qualifications are provided with your quotation";
