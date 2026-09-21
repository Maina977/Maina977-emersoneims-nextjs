import { MetadataRoute } from 'next';
import { getAllServiceSlugs } from '@/lib/services/allServices';
import { getIndexedServiceLocationPaths } from '@/lib/seo/kenyaLocations';
import { getIndexableKenyaUrls } from '@/lib/seo/kenyaIndexable';
import {
  getAllCountrySlugs,
  getCitySlugsForCountry,
} from '@/lib/data/east-africa-locations';
import sparePartsDb from '@/app/data/spare-parts-database-COMPLETE.json';
import { getEngineIndex } from '@/lib/parts/engineIndex';
import { REPAIR_HUBS, REPAIR_ARTICLES } from '@/lib/repair-centre';
import { FAULT_CODES } from '@/lib/data/faultCodes';
import { ENGINE_BRAND_GROUPS } from '@/lib/faults/engineBrandGroups';
import { getAllIndustries } from '@/lib/seo/industryData';
import { PRICE_GUIDES } from '@/lib/pricing/publishedPrices';
import { GENERATOR_SIZES } from '@/lib/products/generatorSizes';
import { BRAND_GROUPS } from '@/lib/plant-oracle/brandGroups';
import { GENERATOR_BRANDS } from '@/lib/data/generator-brands';
import { PROBLEM_SLUGS } from '@/lib/seo/generatorProblems';
import { MAJOR_TOWN_SLUGS } from '@/lib/seo/majorTowns';
import { DIRECTORY_ARTICLE_SLUGS, DIRECTORY_ARTICLES } from '@/lib/data/blog-directory-articles';
import { BLOG_ARTICLES } from '@/lib/data/blog-articles';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SITEMAP - All pages for maximum SEO visibility
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://www.emersoneims.com';

// Major Towns
// Moved to lib/seo/majorTowns.ts so app/locations/page.tsx can LINK the same
// fifteen towns this sitemap lists. Five of them had no inbound link at all.
const majorTowns = MAJOR_TOWN_SLUGS;

/**
 * Industries — critical for B2B SEO.
 *
 * The dynamic slugs come from getAllIndustries(), the same registry that
 * app/industries/[industry] builds generateStaticParams from. This list used to
 * be typed by hand and had drifted: it emitted 'real-estate' and
 * 'government-ngo' while the registry defines 'real-estate-construction' and
 * 'government-ngos'. Both wrong URLs answered HTTP 200 with the title
 * "Industry Not Found" — soft-404s, advertised to Google by our own sitemap.
 *
 * The four entries below the spread are STATIC routes with their own directories
 * under app/industries/. They are real, distinct pages (e.g. /industries/
 * manufacturing has different content from the registry's
 * manufacturing-industries) and three of them were missing from the sitemap
 * entirely. They must be listed explicitly because they are not in the registry.
 */
const industries = [
  ...getAllIndustries().map(i => i.slug),
  'commercial-property',
  /*
   * 'healthcare' and 'manufacturing' WERE LISTED HERE AND WERE REMOVED
   * 2026-09-21.
   *
   * Each was one of three pages covering the same subject:
   *
   *   /industries/healthcare          737 words
   *   /industry-solutions/healthcare  896 words
   *   /industries/hospitals-healthcare  1,391 words, 7 inbound links
   *
   *   /industries/manufacturing              626 words
   *   /industry-solutions/manufacturing      862 words
   *   /industries/manufacturing-industries 1,363 words
   *
   * The first two of each pair now declare the third as their canonical. A
   * page cannot be advertised in the sitemap AND point its canonical at a
   * different URL: the sitemap says "index this", the canonical says "index
   * that instead", and Google is left to guess. That contradiction is the
   * "Duplicate without user-selected canonical" report.
   *
   * The winners, hospitals-healthcare and manufacturing-industries, come from
   * getAllIndustries() above and are still listed. Both losing pages still
   * serve in full; they are simply no longer advertised as separate
   * destinations.
   */
  'telecommunications',
];

// Services for location combinations.
// NOTE: location × service combos are now sourced from the curated
// `getIndexedServiceLocationPaths()` registry (top cities × core services
// only). The free-form `services` list below is unused for that loop and
// is kept solely for future expansion of dedicated /services/<slug>
// emission, which already happens via getAllServiceSlugs() at the bottom.
const services = [
  ...getAllServiceSlugs(),
  'generator-repair',
  'generator-maintenance',
  'generator-installation',
];
void services;

// Blog article slugs
const blogSlugs = [
  'generator-maintenance-tips-kenya',
  'generator-cost-saving-strategies',
  'generator-buying-guide-kenya',
  'generator-safety-tips-kenya',
  'generator-fire-safety-prevention',
  'solar-energy-solutions-kenya',
  'weather-impact-generators-kenya-counties',
  'diy-generator-maintenance-home',
  'diesel-generator-best-practices',
  'generator-roi-analysis-kenya',
  'solar-installation-tips-kenya',
  'generator-procurement-kenya',
  'generator-servicing-cost-kenya',
  'generator-altitude-derating-kenya',
  'true-cost-per-kwh-kenya',
  'ups-sizing-runtime-kenya',
  'power-factor-correction-kenya',
  'borehole-pump-selection-kenya',
  'hv-intake-upgrade-kenya',
  'solar-battery-chemistries-kenya',
  'earthing-lightning-protection-kenya',
  'hvac-cooling-load-sizing-kenya'
];

// Fault code URLs are derived from FAULT_CODES further down — see the comment
// at that loop for why the previous hand-written list was removed.

export default function sitemap(): MetadataRoute.Sitemap {
  /*
   * <lastmod> IS A CLAIM ABOUT THE CONTENT, NOT ABOUT THE BUILD.
   *
   * Until now this file declared `const currentDate = new Date()` and stamped
   * it on 124 of its 125 entry groups. Every deploy therefore told Google that
   * all ~1,000 URLs had changed, at the same instant, whether or not a single
   * word had moved. Measured on the build of 2026-09-21: 948 of 1,008 <lastmod>
   * values were identical and equal to the build time.
   *
   * Google's sitemap documentation is explicit that it uses lastmod only when
   * the value is consistently and verifiably accurate, and ignores it
   * otherwise. So the old behaviour bought nothing — but it cost something,
   * because the 60 entries that WERE accurate (the repair articles, dated from
   * their own lastReviewed) sat in a file whose every other date was obviously
   * synthetic. A crawler has no way to trust one and discount the rest.
   *
   * The rule now: emit lastmod only where a real content date exists, and omit
   * it everywhere else. lastmod is an optional element; leaving it out says "we
   * do not know", which is true and costs nothing. Inventing one says "this
   * changed today", which is false.
   *
   * Real dates come from the two article registries. Everything else — service
   * pages, brand pages, location pages, calculators — is generated from data
   * with no modification date to read, so those entries carry no lastmod. If a
   * dated field is ever added to those registries, look it up here.
   */
  const BLOG_DATES = new Map<string, string>([
    // updatedDate wins where an article has been revised; date is the original.
    ...BLOG_ARTICLES.map((a) => [a.slug, a.updatedDate ?? a.date] as const),
    ...DIRECTORY_ARTICLES.map((a) => [a.slug, a.date] as const),
  ]);

  /** A lastmod fragment to spread, or nothing at all when the date is unknown. */
  const lastmod = (slug: string) => {
    const d = BLOG_DATES.get(slug);
    if (!d) return {};
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? {} : { lastModified: parsed };
  };

  const urls: MetadataRoute.Sitemap = [
    // Main pages
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about-us`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, changeFrequency: 'monthly', priority: 0.4 },
    /*
     * Pricing. /pricing has existed for a long time and was never listed here,
     * which is part of why price intent found nothing: of 1,385 sitemap URLs,
     * three targeted price or cost, all blog posts. Priority is high because
     * these are the closest-to-purchase pages on the site.
     */
    { url: `${BASE_URL}/pricing`, changeFrequency: 'weekly', priority: 0.95 },
    /*
     * Plant fault-code references. 1,799 OEM codes were reachable only through
     * a client-side search box, so Google could see none of them. Seven
     * substantial reference pages make the whole set crawlable without
     * creating a thin page per code.
     */
    { url: `${BASE_URL}/faults/plant`, changeFrequency: 'monthly', priority: 0.8 },
    ...BRAND_GROUPS.map((g) => ({
      url: `${BASE_URL}/faults/plant/${g.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...PRICE_GUIDES.map((g) => ({
      url: `${BASE_URL}/pricing/${g.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    })),
    // Repair Centre — hub, equipment categories and published diagnosis guides
    { url: `${BASE_URL}/repair-centre`, changeFrequency: 'weekly', priority: 0.9 },
    ...REPAIR_HUBS.map((h) => ({
      url: `${BASE_URL}/repair-centre/${h.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...REPAIR_ARTICLES.map((a) => ({
      url: `${BASE_URL}/repair-centre/${a.hub}/${a.slug}`,
      lastModified: new Date(a.header.lastReviewed),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    { url: `${BASE_URL}/resources`, changeFrequency: 'weekly', priority:0.8 },

    // Solar & UPS Intelligence Hub (RESOURCES → Solar & UPS Intelligence Hub)
    { url: `${BASE_URL}/hub`,                       changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/hub/verifier`,              changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/simulator`,             changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/ups-lab`,               changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/quote-audit`,           changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/product-intelligence`,  changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/installation`,          changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/authenticity`,          changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/maintenance`,           changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/safety`,                changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/abuse`,                 changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/power-quality`,         changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/lifecycle`,             changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/doc-pack`,              changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/hub/learn`,                 changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/diagnostics`,           changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/solar-ups`,             changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/library`,               changeFrequency: 'weekly', priority: 0.85 },

    // Generator pages
    { url: `${BASE_URL}/generators`, changeFrequency: 'daily', priority: 1.0 },
    /*
     * Per-size generator pages. An external audit on 2026-08-26 found the site
     * had no product-level URLs while every ranking competitor publishes one
     * page per set with a size and a price. Highest priority after the
     * category page: these are the closest-to-purchase pages on the site.
     */
    ...GENERATOR_SIZES.map((g) => ({
      url: `${BASE_URL}/generators/sizes/${g.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.95,
    })),
    { url: `${BASE_URL}/generators/spare-parts`, changeFrequency: 'daily', priority: 0.95 },
    // Workshop Repairs & Fabrication — added 2026-07-21 (owner brief).
    { url: `${BASE_URL}/generators/workshop-services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/installation`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/maintenance`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/rental`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/generators/used`, changeFrequency: 'daily', priority: 0.9 },

    // Solar pages
    // /solutions/solar is permanently redirected to /solar in next.config.ts
    // and is kept out of the sitemap to avoid GSC "Page with redirect" warnings.
    { url: `${BASE_URL}/solar`, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/solutions/solar-sizing`, changeFrequency: 'weekly', priority: 0.85 },

    // Diagnostic pages
    // /diagnostic-suite, /fault-code-lookup, /diagnostic-cockpit are NOT real
    // routes. /diagnostic-cockpit + /diagnostic-suite redirect to /diagnostics;
    // /fault-code-lookup redirects to /faults. They are removed from the sitemap
    // so Search Console stops reporting them as 404s during validation.
    { url: `${BASE_URL}/generator-oracle`, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/diagnostics`, changeFrequency: 'weekly', priority: 0.9 },
    /*
     * /faults and /troubleshooting were listed TWICE — here at priority 0.85
     * and again below at 0.9. A duplicated <loc> makes a sitemap ambiguous
     * about a URL's own importance and is a validation warning. The later,
     * higher-priority entries are the ones kept, so neither page loses
     * standing; only the contradiction is removed.
     */
    { url: `${BASE_URL}/technical-bible`, changeFrequency: 'weekly', priority: 0.9 },

    /*
     * AI Products / Intelligence Suite.
     *
     * THE TOOL SUB-ROUTES ARE DELIBERATELY NOT LISTED (removed 2026-08-26).
     * Measured as Googlebot: /aquascan-pro-v3 and its /reports and /compare
     * sub-routes shared 99% of their 8-word sequences, and
     * /solar-genius-pro/calculator-advanced was 99% identical to its parent.
     * They are client-rendered application shells — the interactive tool is
     * assembled after hydration, so what a crawler receives is the same frame
     * every time, with no distinct content behind it.
     *
     * Submitting them asks Google to index eight copies of one page and choose
     * between them. The parent tool page is the one that should rank; the
     * sub-routes are states of the app, not documents.
     *
     * NOTHING IS DELETED. Every sub-route still returns 200, still renders,
     * still carries index/follow and stays internally linked, so a visitor or a
     * crawler following a link reaches it exactly as before. It simply stops
     * being advertised as a page worth indexing in its own right.
     */
    { url: `${BASE_URL}/aquascan-pro-v3`,                       changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/solar-genius-pro`,                      changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/solar-genius-pro-tools`,                changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/solar-genius-pro-futuristic`,           changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-design-studio`,                   changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/eims-pro`,                              changeFrequency: 'weekly', priority: 0.9  },
    // Plant & Equipment Oracle — sibling to Generator Oracle, built on the
    // same 2,155 VERIFIED codes but framed for excavators, loaders and
    // compressors. Self-canonical, server-rendered, real body content.
    { url: `${BASE_URL}/plant-equipment-oracle`,               changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/ai-tools`,                              changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/ai-tools/capabilities`,                 changeFrequency: 'monthly', priority: 0.7 },
    /*
     * /pro-building-suite AND /all-tools ARE DELIBERATELY NOT LISTED HERE.
     *
     * Both are redirect stubs carrying robots:{index:false}. Submitting a
     * noindex page in a sitemap — /pro-building-suite was here at priority 0.9,
     * higher than most real pages — asks Google to crawl something we have
     * simultaneously told it to ignore. It spends crawl budget and returns
     * nothing, which is part of why Building Suite Pro recorded ZERO
     * impressions in the July 2026 Search Console export.
     *
     * Worse, the redirect on /pro-building-suite does not actually fire: the
     * live URL returns HTTP 200 and renders 162 words of critical CSS and no
     * content. Anyone reaching it — including from /site-directory — got a
     * blank page.
     *
     * The canonical Building Suite URL is /solutions/building, which is
     * indexable, renders content, and is already listed below at priority 0.8.
     * Raised to 0.9 to inherit the weight this entry was carrying.
     *
     * Nothing is deleted: both stub routes still exist and still serve, so old
     * links and bookmarks are unaffected. They are simply no longer advertised
     * to Google as destinations.
     */

    // Service pages
    // The /solutions/* slugs that 308 redirect in next.config.ts (solar, ups,
    // motor-rewinding, borehole-pumps, ac, generators, controls, motors) are
    // omitted here — only the canonical /services/* (or top-level) destinations
    // are listed. The non-redirected /solutions/* slugs are still emitted.
    // The /services/<slug> URLs themselves are appended below from the
    // canonical registry (`getAllServiceSlugs`) so this list stays in sync
    // with what's actually rendered by app/services/[service]/page.tsx.
    { url: `${BASE_URL}/services`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/incinerators`, changeFrequency: 'weekly', priority: 0.75 },
    // Canonical Building Suite URL. Raised 0.8 -> 0.9 to carry the weight the
    // removed /pro-building-suite stub entry was holding; see the note above.
    { url: `${BASE_URL}/solutions/building`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/fabrication`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/high-voltage`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/diesel-automation`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/power-interruptions`, changeFrequency: 'weekly', priority: 0.75 },

    // Other pages
    { url: `${BASE_URL}/maintenance-hub`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/maintenance-hub/generators`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/maintenance-hub/solar`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/maintenance-hub/hvac`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/electrical`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/borehole`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/incinerators`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/motors`, changeFrequency: 'weekly', priority: 0.75 },
    /*
     * Plumbing was the eleventh card on /maintenance-hub and the only one
     * without a page: it 404d from the day it was linked until 2026-09-21.
     * Correctly absent from this list while it did not exist; added now that
     * it does.
     */
    { url: `${BASE_URL}/maintenance-hub/plumbing`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/fabrication`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/maintenance-hub/welding`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/maintenance-hub/general`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/calculators`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/booking`, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/gallery`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/brands`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/knowledge-base`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/careers`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/locations`, changeFrequency: 'weekly', priority: 0.9 },
    /*
     * Added 2026-07-31 after a live crawl found these published, reachable and
     * absent from the sitemap:
     *   /east-africa    the regional hub above the 36 /<country>/<city> pages
     *   /marketplace    the spare-parts marketplace
     *   /all-tools      the engineering tools index
     *   /site-directory the HTML index of every section (see that page's header
     *                   for why it exists — the mega-menu nav renders no hrefs)
     */
    { url: `${BASE_URL}/east-africa`, changeFrequency: 'weekly', priority: 0.8 },
    /*
     * /marketplace REMOVED 2026-08-31, reversing the 2026-07-31 addition above.
     *
     * That addition was correct that the page was published and reachable, but
     * the page was advertising a partner network that does not exist: three
     * invented companies, a star rating and review count for each, and a
     * "Showing 3 of 47 verified partners" line. It is now noindex until real
     * partners can be listed (see the header of app/marketplace/page.tsx), and
     * a sitemap must only offer URLs we are asking Google to index.
     *
     * RESTORE this entry when the robots block on that page comes off.
     */
    /*
     * /all-tools REMOVED 2026-08-06, reversing the 2026-07-31 addition above.
     *
     * That addition was right about the symptom — the page is published and
     * reachable — but the page carries robots:{index:false} and is a redirect
     * stub returning 162 words of CSS with no content. Listing a noindex page in
     * the sitemap asks Google to crawl what we have told it to ignore, and it
     * was the second such entry (the first, /pro-building-suite at priority 0.9,
     * is removed above).
     *
     * The engineering tools index that SHOULD carry this traffic is /ai-tools,
     * which is indexable, renders content and is already listed. Nothing is
     * deleted: /all-tools still exists and still serves.
     */
    { url: `${BASE_URL}/site-directory`, changeFrequency: 'weekly', priority: 0.6 },
    // /why-emersoneims was published, live and reachable from NOTHING — not one
    // internal link and not in the sitemap. That is how a page built around
    // naming six competitors survived unreviewed. Rebuilt and listed 2026-08-03.
    { url: `${BASE_URL}/why-emersoneims`, changeFrequency: 'monthly', priority: 0.7 },
    // /counties is permanently redirected to /kenya — keep only the canonical.
    { url: `${BASE_URL}/kenya`, changeFrequency: 'daily', priority: 0.9 },

    // Generator sub-routes (commercial intent)
    { url: `${BASE_URL}/generators/leasing`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/systems`, changeFrequency: 'weekly', priority: 0.8 },
    /*
     * The four engine-brand pages. All are live, 200, and carry 560-720 words
     * of their own, but until 2026-09-02 they had no server layout, so they
     * inherited the section canonical and told Google they were duplicates of
     * /generators — and they were absent from this sitemap as well. Three of
     * them have no inbound internal link either, so they were invisible twice
     * over. Listed here now that each declares its own canonical.
     */
    { url: `${BASE_URL}/generators/cummins`, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/generators/caterpillar`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/perkins`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/volvo-penta`, changeFrequency: 'weekly', priority: 0.8 },

    /*
     * PAGES THAT HAD NO CRAWL PATH AT ALL — added 2026-09-02 after building
     * the internal link graph of all 1,425 sitemap URLs and comparing it to
     * what the site actually serves.
     *
     * The 17 brand pages were the worst case: /brands is linked from all
     * 1,425 pages (it is in the main nav) and linked to NONE of its own brand
     * pages, and none of them were listed here either. Seventeen pages of
     * ~900-950 words with zero inbound links and zero sitemap entries.
     * components/seo/BrandDirectory.tsx now links them as well; a sitemap
     * entry alone is discovery without authority.
     *
     * The whole /generator-problems section was in the same state: the index
     * itself had no inbound link either.
     *
     * Generated from the registries, never hand-typed — a hand-typed list is
     * a copy, and a copy drifts the moment a brand or a problem is added.
     */
    ...GENERATOR_BRANDS.map((brand) => ({
      url: `${BASE_URL}/brands/${brand.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    { url: `${BASE_URL}/generator-problems`, changeFrequency: 'weekly', priority: 0.85 },
    ...PROBLEM_SLUGS.map((slug) => ({
      url: `${BASE_URL}/generator-problems/${slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    // Substantial pages (884-1,591 words) that were linked but never listed.
    { url: `${BASE_URL}/east-africa/uganda`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/east-africa/tanzania`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/east-africa/rwanda`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/fabrication`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/guides/emergency-response`, changeFrequency: 'monthly', priority: 0.75 },
    /*
     * THE THREE TECHNICAL REFERENCE GUIDES.
     *
     * /services/air-conditioning, /services/borehole-drilling and
     * /services/solar-inverters are static routes under app/services/ that are
     * NOT in ALL_SERVICES, so the getAllServiceSlugs() loop at the bottom of
     * this file never reached them. Only the first was ever listed here, by
     * hand, and the other two were left out.
     *
     * Audited on 2026-09-21 against the built output: both answer 200, are
     * indexable, carry a self-referential canonical and a single h1, and run to
     * 929 and 1,718 words of hydrogeology and inverter engineering. No page in
     * the entire 4,875-page build linked to either, and neither was in any
     * sitemap. They were reachable only by guessing the URL.
     *
     * They are not duplicates of the commercial pages they sit beside.
     * /services/borehole-pumps sells the service; /services/borehole-drilling
     * explains aquifer testing and yield assessment. The pair is a hub and its
     * supporting detail, which is why each now links to the other.
     */
    { url: `${BASE_URL}/services/air-conditioning`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/borehole-drilling`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/solar-inverters`, changeFrequency: 'weekly', priority: 0.8 },

    // The three tool sub-pages that carry their own crawlable article. The
    // other four mount ssr:false components, carry no unique text and are
    // deliberately noindex — they are NOT listed here.
    { url: `${BASE_URL}/solar-genius-pro/fault-codes`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/solar-genius-pro/design-studio`, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solar-genius-pro/solar-dashboard`, changeFrequency: 'weekly', priority: 0.75 },

    // Used-equipment specification pages, one per engine brand.
    ...['cummins', 'caterpillar', 'perkins', 'sdmo', 'volvo-penta', 'wei-chai'].map((brand) => ({
      url: `${BASE_URL}/specs/used/${brand}`,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // /generators/case-studies is 308-redirected to /case-studies in
    // next.config.ts and must NOT be listed — a sitemap advertises canonical
    // destinations, not redirect sources. /case-studies is listed below.
    { url: `${BASE_URL}/generators/maintenance-companion`, changeFrequency: 'weekly', priority: 0.75 },

    // Industry pages - Critical for B2B SEO
    { url: `${BASE_URL}/industries`, changeFrequency: 'weekly', priority: 0.95 },
  ];

  // Add industry-specific pages (HIGH PRIORITY - B2B leads)
  for (const industry of industries) {
    urls.push({
      url: `${BASE_URL}/industries/${industry}`,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Add blog articles (IMPORTANT for long-tail SEO)
  for (const slug of blogSlugs) {
    urls.push({
      url: `${BASE_URL}/blog/${slug}`,
      ...lastmod(slug),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  /**
   * The other blog. Thirteen articles render from their own
   * app/blog/<slug>/page.tsx rather than from BLOG_ARTICLES, and blogSlugs
   * above only ever listed the latter. Audited against production on
   * 2026-09-20: all thirteen answered 200 with a correct self-referential
   * canonical and were in no sitemap and linked from no page — finished work
   * that no crawler and no reader could reach.
   *
   * Sourced from the registry rather than retyped here, because a hand-kept
   * copy is exactly how the drift above happened.
   */
  for (const slug of DIRECTORY_ARTICLE_SLUGS) {
    urls.push({
      url: `${BASE_URL}/blog/${slug}`,
      ...lastmod(slug),
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  /*
   * VOLTKA — the one generator brand we actually sell, and until 2026-09-21
   * the only one without a page. Priority 0.95 puts it level with the other
   * primary commercial pages: seventeen brand pages exist for makes we
   * service, and this is the page for the make we sell.
   */
  urls.push({
    url: BASE_URL + '/voltka',
    changeFrequency: 'weekly',
    priority: 0.95,
  });

  // Generator Oracle Product Pages
  urls.push(
    { url: `${BASE_URL}/products/generator-oracle`, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/faults`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/troubleshooting`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/case-studies`, changeFrequency: 'weekly', priority: 0.85 }
  );

  /*
   * Fault code pages (HIGH-INTENT — people search for the exact code).
   *
   * Derived from FAULT_CODES, the same registry app/faults/[code] builds its
   * generateStaticParams from, using the identical slug rule
   * (fault.code.toLowerCase()). It used to be a hand-written list of 12 slugs,
   * and one of them — dse-e047 — had no record behind it. That URL was
   * advertised in the sitemap and answered HTTP 200 with the title "Fault Code
   * Not Found": a soft-404, the class of defect that damages the whole domain
   * rather than the one page (Next 16 on Vercel returns 200 even when
   * notFound() fires inside a matched dynamic route).
   *
   * Deriving the list makes that impossible, and publishes every real code page
   * instead of an arbitrary 12. Never hand-add a slug here.
   */
  /*
   * Engine fault-code brand pages. 2,127 verified codes across ten generator
   * makers that previously had no URL at all — see lib/faults/engineBrandGroups.ts
   * for why these are per-BRAND rather than per-code. Derived from the same
   * registry the route builds its generateStaticParams from, so this list can
   * never advertise a URL that 404s.
   */
  for (const g of ENGINE_BRAND_GROUPS) {
    urls.push({
      url: `${BASE_URL}/faults/engine/${g.slug}`,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  for (const fault of FAULT_CODES) {
    urls.push({
      url: `${BASE_URL}/faults/${fault.code.toLowerCase()}`,
      changeFrequency: 'monthly',
      priority: 0.85,
    });
  }

  // Add the curated, indexable /kenya/* pages — counties, county+service,
  // and (for priority counties) constituency + constituency+service. This
  // is the SAME set generateStaticParams() builds in
  // app/kenya/[county]/[...slug]/page.tsx, sourced from kenyaIndexable.ts,
  // so the sitemap can never list a URL that 404s. Village and
  // village-service doorway pages are intentionally excluded.
  for (const path of getIndexableKenyaUrls()) {
    const depth = path.split('/').filter(Boolean).length; // 2=county, 3, 4
    urls.push({
      url: `${BASE_URL}${path}`,
      changeFrequency: 'weekly',
      priority: depth <= 2 ? 0.85 : depth === 3 ? 0.8 : 0.7,
    });
  }

  // Add major town location pages
  for (const town of majorTowns) {
    urls.push({
      url: `${BASE_URL}/locations/${town}`,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  }

  /*
   * /locations/<town>/<service> REMOVED FROM THE SITEMAP, 2026-08-29.
   * The pages are untouched and still serve — this only stops submitting them.
   *
   * WHY. Search Console returned "Crawled - currently not indexed" for this
   * tier. That status is not an error to validate away; it is Google saying it
   * fetched the pages, understood them, and judged them not worth index space.
   * Measured on the live site the same day, /locations/thika and
   * /locations/eldoret shared 64% of their 8-word sequences — Google was right.
   *
   * 208 URLs of the 224 in this section were the town+service tier, and
   * together with the constituency tier they made 81% of everything we asked
   * Google to index. Crawl budget is finite on a site with this authority, and
   * every fetch spent re-reading a near-duplicate is one not spent on a page
   * that can rank. The 15 town landing pages stay listed.
   *
   * NOTHING IS DELETED. Every URL still returns 200, still renders, still
   * carries index/follow and stays internally linked, so both visitors and
   * crawlers following links reach them exactly as before. Re-listing them is
   * a one-line change if the content is ever genuinely differentiated.
   *
   * for (const { location, service } of getIndexedServiceLocationPaths()) { ... }
   */

  // Sector landing pages live at /industries/<slug> and are already
  // emitted earlier in this sitemap (see the `industries` loop). The
  // /solutions/<sector> pages were retired in favour of /industries to
  // avoid duplicate B2B sector hubs.

  // Canonical /services/<slug> pages — one entry per service in the
  // registry. Keeps the sitemap aligned with the dynamic route at
  // app/services/[service]/page.tsx so every service we offer is
  // discoverable, not just the 5 that used to be hardcoded.
  for (const slug of getAllServiceSlugs()) {
    urls.push({
      url: `${BASE_URL}/services/${slug}`,
      changeFrequency: 'weekly',
      priority: 0.85,
    });
  }

  /**
   * Spare-parts category pages — /generators/spare-parts/<category>.
   *
   * Added 2026-07-21 (directive Phase Four). 1,248 real parts across 27
   * categories previously lived only inside a client-side module that crawlers
   * cannot browse, so none of it could rank for "generator spare parts in
   * Kenya", "Cummins generator parts Kenya" and similar commercial queries.
   *
   * Slugs come from the same JSON the route's generateStaticParams reads, so
   * the sitemap cannot drift from what actually renders.
   */
  {
    const root = sparePartsDb as unknown as Record<string, unknown>;
    const cats = (Array.isArray(root)
      ? root
      : Object.values(root).find((v) => Array.isArray(v))) as
      | Array<{ subcategories?: Array<{ id: string; parts?: unknown[] }> }>
      | undefined;
    for (const sub of cats?.[0]?.subcategories ?? []) {
      if (!sub.id || !(sub.parts?.length ?? 0)) continue;
      urls.push({
        url: `${BASE_URL}/generators/spare-parts/${sub.id}`,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  /**
   * Engine-model parts pages — /generators/spare-parts/engine/<model>.
   *
   * Added 2026-07-21. The catalogue could only be browsed by part type, so a
   * customer who knows they have a Cummins 6BT5.9 had no way to ask what fits
   * it — even though 72 parts already carried that fitment. These pivot the
   * EXISTING real compatibility data; nothing is generated. Engines with fewer
   * than 5 parts get no page, so none are thin.
   */
  for (const e of getEngineIndex()) {
    urls.push({
      url: `${BASE_URL}/generators/spare-parts/engine/${e.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  /**
   * Sector pages — /sectors/<slug>, served by app/sectors/[sector].
   *
   * Audit 2026-07-21: all 27 sector pages return HTTP 200 but had ZERO sitemap
   * entries and zero internal links, so they were invisible to search engines.
   *
   * Only a CURATED SUBSET is emitted. /industries/<slug> already owns the big
   * sector hubs (hotels, hospitals, schools, banks, churches, flower farms,
   * real estate) with far more depth — /industries/hospitals-healthcare is
   * ~1,520 words against ~485 on /sectors/hospitals. Listing both would put two
   * of our own pages in front of the same query, which is why a previous audit
   * deliberately retired the third /solutions/<sector> set.
   *
   * So this list is restricted to sectors with NO /industries counterpart.
   * Every one is a real target market named in the owner's directive
   * (supermarkets and malls, restaurants, mining and quarrying, residential
   * estates and apartments, agriculture/farms/ranches, tourism and game
   * reserves) that currently has no other page competing for it.
   *
   * Anything whose head noun already has an /industries hub — schools,
   * hospitals, hotels, banks, churches, NGOs, flower farms, real estate, and
   * their "private-" variants — is deliberately EXCLUDED.
   */
  const SECTORS_WITHOUT_INDUSTRY_HUB = [
    'supermarkets',
    'restaurants',
    'quarries',
    'apartments',
    'homes',
    'farms',
    'ranches',
    'embassies',
    'consulates',
    'private-offices',
    'tourist-destinations',
    'masai-mara',
  ];
  // The /sectors index itself — added 2026-07-27 when the page was created.
  // It previously 404'd while every sector page's breadcrumb linked to it.
  urls.push({
    url: `${BASE_URL}/sectors`,
    changeFrequency: 'monthly',
    priority: 0.8,
  });
  for (const slug of SECTORS_WITHOUT_INDUSTRY_HUB) {
    urls.push({
      url: `${BASE_URL}/sectors/${slug}`,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  }

  /**
   * East African city pages — /<country>/<city>, served by app/[country]/[city].
   *
   * Audit 2026-07-21 found these were fully built and returning HTTP 200
   * (Uganda, Tanzania, Rwanda, South Sudan and their cities) while being
   * completely invisible to search engines: ZERO sitemap entries and zero
   * internal links. The regional expansion existed but earned nothing.
   *
   * The set comes from the same functions the route's generateStaticParams
   * uses, so the sitemap cannot drift from what actually renders — and now
   * that the route is dynamicParams=false, every URL emitted here is a real
   * pre-generated page rather than a templated fallback.
   *
   * Priority sits below Kenyan service pages: this is a supporting regional
   * presence, not the core market.
   */
  for (const countrySlug of getAllCountrySlugs()) {
    for (const citySlug of getCitySlugsForCountry(countrySlug)) {
      urls.push({
        url: `${BASE_URL}/${countrySlug}/${citySlug}`,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
