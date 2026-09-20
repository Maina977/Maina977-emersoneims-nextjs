/**
 * CURATED /kenya/* INDEXABLE PATH REGISTRY — single source of truth
 * ─────────────────────────────────────────────────────────────────
 * The /kenya/[county]/[...slug] route can theoretically address
 * ~300,000 URLs (47 counties × ~290 constituencies × 15-24 generated
 * villages × 56 services). Google classifies that volume of templated,
 * near-identical pages as "doorway pages" and refuses to index them
 * (Search Console: "Crawled — currently not indexed").
 *
 * This module defines the ONLY /kenya/* URLs we want Google to index:
 *   - county pages              (47)            — handled by app/kenya/[county]
 *   - county + core service     (47 × CORE)
 *   - constituency              (priority counties only)
 *   - constituency + core svc   (priority constituencies × CORE)
 *
 * Village and village-service pages are intentionally NOT generated —
 * they have zero unique content. Anything outside this set 404s
 * (dynamicParams = false on the route).
 *
 * Both generateStaticParams (the route) and the sitemap import from
 * here so the indexable set and the sitemap can never drift apart.
 */

import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';
import { getServiceBySlug } from '@/lib/data/seo-services';
import { hasConstituencyData } from '@/lib/data/kenya-constituency-conditions';
import countyServices from '@/lib/seo/countyServices.json';

/**
 * High-intent, commercially meaningful services. A deliberately small
 * subset of the 56 SEO_SERVICES — only services worth a unique page
 * per location. Any slug here that doesn't exist in SEO_SERVICES is
 * silently dropped by CORE_SERVICE_SLUGS below.
 */
const CORE_SERVICE_CANDIDATES = [
  'generator-companies',
  'generators',
  'generator-repairs',
  'generator-maintenance',
  'generator-spare-parts',
  'solar-installation',
  'solar-companies',
  'motor-rewinding',
  'ups-systems',
  'electrical-services',
];

/** Validated core service slugs (only those that exist in SEO_SERVICES). */
export const CORE_SERVICE_SLUGS: string[] = CORE_SERVICE_CANDIDATES.filter(
  (slug) => getServiceBySlug(slug) !== undefined
);

/**
 * SERVICES THAT GET A PAGE AT COUNTY LEVEL — a wider set than CORE.
 *
 * Restored 2026-09-03. On 2026-08-01 guard 0b was narrowed to an exact
 * allowlist built from CORE_SERVICE_SLUGS. That stopped Google inventing junk
 * URLs, which was real and worth fixing, but it also swept up every other REAL
 * service: 46 of the 56 in SEO_SERVICES stopped being pages and started
 * issuing 308s to the bare county page. Four entire trades — air conditioning,
 * boreholes, automation and incinerators — had no county coverage left at all.
 *
 * Verified live on 2026-09-03 before this change: 190 of 240 service-county
 * URLs across the five largest counties redirected away, /kenya/nairobi/ac-repair
 * among them. The page they land on is headed "Generator Services in Nairobi
 * County" and never mentions air conditioning.
 *
 * The 2026-08-15 duplication measurement that justified narrowing the sitemap
 * compared the SAME service across DIFFERENT counties (60-68% identical). It
 * never compared different services in one county, and does not apply here:
 * "AC repair in Nairobi" is not a near-duplicate of "generator repair in
 * Nairobi". Different trade, different buyer, different search.
 *
 * The list, and the rule for what earns a place in it, is in
 * lib/seo/countyServices.json — shared with scripts/generate-kenya-guard.mjs
 * because middleware cannot import from @/lib in the edge runtime.
 */
const COUNTY_SERVICE_CANDIDATES: string[] = [
  ...countyServices.core,
  ...Object.values(countyServices.restored).flat(),
];

/** Validated county-level service slugs. Same filter, same guarantee. */
export const COUNTY_SERVICE_SLUGS: string[] = COUNTY_SERVICE_CANDIDATES.filter(
  (slug) => getServiceBySlug(slug) !== undefined
);

/**
 * Counties whose constituencies are also worth indexing — major
 * population/commercial centres. Non-priority counties get the county
 * page + county-service pages only.
 */
export const PRIORITY_COUNTY_SLUGS = [
  'nairobi',
  'mombasa',
  'kisumu',
  'nakuru',
  'kiambu',
  'machakos',
  'kajiado',
  'nyeri',
  'meru',
  'uasin-gishu',
];

export function isPriorityCounty(countySlug: string): boolean {
  return PRIORITY_COUNTY_SLUGS.includes(countySlug);
}

/**
 * Curated params for app/kenya/[county]/[...slug]/generateStaticParams.
 * Returns county-service for every county, plus constituency and
 * constituency-service for priority counties only.
 */
export function getIndexableKenyaParams(): { county: string; slug: string[] }[] {
  const params: { county: string; slug: string[] }[] = [];

  for (const county of KENYA_LOCATIONS) {
    /*
     * County tier uses the WIDER list. A county page for a trade we actually
     * perform — AC repair, borehole drilling, transfer switches — is a distinct
     * page answering a distinct search, and each of these has its own keywords,
     * heading and FAQs in SEO_SERVICES.
     */
    for (const service of COUNTY_SERVICE_SLUGS) {
      params.push({ county: county.slug, slug: [service] });
    }

    if (!isPriorityCounty(county.slug)) continue;

    /*
     * Constituency tier deliberately stays on CORE_SERVICE_SLUGS. These pages
     * measured 68% identical to one another on 2026-08-15, which is why they
     * were withdrawn from the sitemap. Widening this tier would multiply that
     * duplication by four — 43 constituencies x 31 more services — and rebuild
     * exactly the doorway problem that withdrawal was meant to end.
     */
    for (const constituency of county.constituencies) {
      params.push({ county: county.slug, slug: [constituency.slug] });
      for (const service of CORE_SERVICE_SLUGS) {
        params.push({ county: county.slug, slug: [constituency.slug, service] });
      }
    }
  }

  return params;
}

/**
 * Same curated set as absolute-path strings, for the XML sitemap.
 * Includes the bare /kenya/<county> pages (owned by app/kenya/[county]).
 */
export function getIndexableKenyaUrls(): string[] {
  const urls: string[] = [];

  for (const county of KENYA_LOCATIONS) {
    urls.push(`/kenya/${county.slug}`);
    /*
     * COUNTY+SERVICE IS NO LONGER SUBMITTED (2026-09-20). The bare county page
     * above still is.
     *
     * The rule this applies is not a new one. On 2026-08-29 the constituency
     * tier was withdrawn from this sitemap for measuring 68% identical, on the
     * reasoning that Google had already answered with "Crawled - currently not
     * indexed" and was right to. The county+service tier was left in because it
     * was believed to be below that bar. It is not. It is well above it.
     *
     * MEASURED 2026-09-20 on the live site, all 47 counties, /generator-repairs,
     * 8-word sequences — the same method as the August measurement, with two
     * corrections that make it stricter and fairer:
     *   - site-wide chrome (nav, footer) subtracted, by removing every sequence
     *     that also appears on /contact and /blog. Without this the shared
     *     header inflates every page-to-page comparison on the site.
     *   - the county name replaced with a placeholder, because a swapped place
     *     name is the thing Google discounts, not a difference it rewards.
     *
     * Each county was then compared with all 46 others and scored on its
     * CLOSEST twin, which is the only comparison that matters: a page is
     * redundant if ANY other page already says it.
     *
     *     county + service   80-93% identical to its nearest twin  (median 89%)
     *     bare county page   59-76%                                (median ~67%)
     *
     * Every single county has a twin at 80% or above at the service tier. There
     * is no subset worth keeping and no line to draw between them — picking
     * winners would be arbitrary, so the whole tier goes.
     *
     * WHY THE BARE COUNTY PAGE SURVIVES: at 59-76% it sits around the bar the
     * August decision accepted, and the sourced altitude, temperature and
     * distance figures in kenya-county-conditions.ts do real differentiating
     * work at that level. Mombasa against Kisumu is 59% — coastal against
     * lakeside, genuinely different engineering. The service tier dilutes that
     * same data with a much larger shared service description, which is why it
     * scores so much worse than the page above it.
     *
     * NOTHING IS DELETED OR DE-INDEXED. getIndexableKenyaParams is untouched,
     * so every one of these URLs still builds, still returns 200, still carries
     * index/follow and stays internally linked — a visitor or crawler following
     * a link reaches it normally. No noindex is added: that would contradict
     * the self-referential canonical these pages carry, and this file's own
     * history records what conflicting directives cost the last time.
     *
     * Restoring the loop is the one-line change if Search Console ever shows
     * this tier earning impressions.
     */

    if (!isPriorityCounty(county.slug)) continue;

    for (const constituency of county.constituencies) {
      /*
       * SUBMIT ONLY WHAT WE ASKED GOOGLE TO INDEX (2026-08-29).
       *
       * Two separate reasons a constituency URL does not belong in a sitemap
       * when it has no confirmed altitude/climate record:
       *
       * 1. IT CANONICALISES SOMEWHERE ELSE. Without a verified record,
       *    generateLocationServiceMetadata points its canonical at the
       *    county+service page. Submitting a URL that declares another URL
       *    canonical is a contradiction: the sitemap says "index this", the
       *    page says "no, index that". A sitemap should only ever list
       *    self-canonical URLs.
       *
       * 2. GOOGLE HAS ALREADY ANSWERED. Measured on the live site on
       *    2026-08-29, two constituency+service pages in different counties
       *    shared 68% of their 8-word sequences, and Search Console returned
       *    "Crawled - currently not indexed" for this tier. That status is not
       *    an error to be validated away — it is Google judging the pages not
       *    worth index space, and it was right.
       *
       * Nothing is deleted. Every one of these URLs still returns 200, still
       * renders, still carries index/follow and stays internally linked, so a
       * visitor or a crawler following a link reaches it normally. It simply
       * stops consuming crawl budget that belongs to the ~850 pages that can
       * actually rank.
       */
      if (!hasConstituencyData(county.slug, constituency.slug)) continue;

      urls.push(`/kenya/${county.slug}/${constituency.slug}`);
      for (const service of CORE_SERVICE_SLUGS) {
        urls.push(`/kenya/${county.slug}/${constituency.slug}/${service}`);
      }
    }
  }

  return urls;
}
