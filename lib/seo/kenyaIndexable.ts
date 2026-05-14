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
    // county + core service — every county
    for (const service of CORE_SERVICE_SLUGS) {
      params.push({ county: county.slug, slug: [service] });
    }

    if (!isPriorityCounty(county.slug)) continue;

    // constituency + constituency-service — priority counties only
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
    for (const service of CORE_SERVICE_SLUGS) {
      urls.push(`/kenya/${county.slug}/${service}`);
    }

    if (!isPriorityCounty(county.slug)) continue;

    for (const constituency of county.constituencies) {
      urls.push(`/kenya/${county.slug}/${constituency.slug}`);
      for (const service of CORE_SERVICE_SLUGS) {
        urls.push(`/kenya/${county.slug}/${constituency.slug}/${service}`);
      }
    }
  }

  return urls;
}
