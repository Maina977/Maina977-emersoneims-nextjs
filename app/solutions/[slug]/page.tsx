import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';

/**
 * /solutions/[slug] — RETIRED (308 → /industries/<mapped>).
 *
 * The previous version of this route rendered a parallel "Solutions by
 * Sector" hub. That experiment was retired in favour of /industries
 * (powered by lib/seo/industryData.ts), which is the single canonical
 * sector hub for the site.
 *
 * To preserve any external/SEO links pointing at /solutions/<sector> we
 * keep the route alive as a 308 permanent redirect. The slugs we
 * pre-render here are the ones we previously listed in the sitemap and
 * exposed in the homepage band.
 *
 * NOTE: Adjacent /solutions/* slugs that are real product pages
 * (/solutions/solar, /solutions/ups, /solutions/borehole-pumps, etc.)
 * are folder routes with their own page.tsx and are NOT affected by
 * this dynamic [slug] route — Next picks the static folder first.
 */

const SECTOR_TO_INDUSTRY: Record<string, string> = {
  hospitals: 'hospitals-healthcare',
  schools: 'schools-universities',
  hotels: 'hotels-hospitality',
  factories: 'manufacturing',
  farms: 'flower-farms',
  'real-estate': 'real-estate',
};

const RETIRED_SECTOR_SLUGS = Object.keys(SECTOR_TO_INDUSTRY);
