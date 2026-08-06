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
import { getAllIndustries } from '@/lib/seo/industryData';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SITEMAP - All pages for maximum SEO visibility
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://www.emersoneims.com';

// Major Towns
const majorTowns = [
  'thika', 'eldoret', 'malindi', 'kitale', 'naivasha', 'ruiru', 'juja', 'kikuyu',
  'westlands', 'karen', 'ngong', 'ongata-rongai', 'mtwapa', 'nyali', 'diani'
];

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
  'healthcare',
  'manufacturing',
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
  const currentDate = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Main pages
    { url: BASE_URL, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    // Repair Centre — hub, equipment categories and published diagnosis guides
    { url: `${BASE_URL}/repair-centre`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    ...REPAIR_HUBS.map((h) => ({
      url: `${BASE_URL}/repair-centre/${h.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...REPAIR_ARTICLES.map((a) => ({
      url: `${BASE_URL}/repair-centre/${a.hub}/${a.slug}`,
      lastModified: new Date(a.header.lastReviewed),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),

    { url: `${BASE_URL}/resources`, lastModified: currentDate, changeFrequency: 'weekly', priority:0.8 },

    // Solar & UPS Intelligence Hub (RESOURCES → Solar & UPS Intelligence Hub)
    { url: `${BASE_URL}/hub`,                       lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/hub/verifier`,              lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/simulator`,             lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/ups-lab`,               lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/quote-audit`,           lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/product-intelligence`,  lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/installation`,          lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/authenticity`,          lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/maintenance`,           lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/safety`,                lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/abuse`,                 lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/power-quality`,         lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/lifecycle`,             lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/doc-pack`,              lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/hub/learn`,                 lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/hub/diagnostics`,           lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/solar-ups`,             lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/hub/library`,               lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

    // Generator pages
    { url: `${BASE_URL}/generators`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/generators/spare-parts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
    // Workshop Repairs & Fabrication — added 2026-07-21 (owner brief).
    { url: `${BASE_URL}/generators/workshop-services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/installation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/maintenance`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/rental`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/generators/used`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

    // Solar pages
    // /solutions/solar is permanently redirected to /solar in next.config.ts
    // and is kept out of the sitemap to avoid GSC "Page with redirect" warnings.
    { url: `${BASE_URL}/solar`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/solutions/solar-sizing`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

    // Diagnostic pages
    // /diagnostic-suite, /fault-code-lookup, /diagnostic-cockpit are NOT real
    // routes. /diagnostic-cockpit + /diagnostic-suite redirect to /diagnostics;
    // /fault-code-lookup redirects to /faults. They are removed from the sitemap
    // so Search Console stops reporting them as 404s during validation.
    { url: `${BASE_URL}/generator-oracle`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/diagnostics`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/faults`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/troubleshooting`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/technical-bible`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

    // AI Products / Intelligence Suite (HIGH PRIORITY for discoverability)
    { url: `${BASE_URL}/aquascan-pro-v3`,                       lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/aquascan-pro-v3/reports`,               lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE_URL}/aquascan-pro-v3/compare`,               lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7  },
    { url: `${BASE_URL}/solar-genius-pro`,                      lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/solar-genius-pro/solar-dashboard`,      lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-genius-pro/design-studio`,        lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-genius-pro/calculator-advanced`,  lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-genius-pro/fault-codes`,          lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-genius-pro-tools`,                lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/solar-genius-pro-futuristic`,           lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/solar-design-studio`,                   lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8  },
    { url: `${BASE_URL}/eims-pro`,                              lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/ai-tools`,                              lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/ai-tools/capabilities`,                 lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
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
    { url: `${BASE_URL}/services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/incinerators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    // Canonical Building Suite URL. Raised 0.8 -> 0.9 to carry the weight the
    // removed /pro-building-suite stub entry was holding; see the note above.
    { url: `${BASE_URL}/solutions/building`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/fabrication`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/high-voltage`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/diesel-automation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/power-interruptions`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },

    // Other pages
    { url: `${BASE_URL}/maintenance-hub`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/maintenance-hub/generators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/maintenance-hub/solar`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/maintenance-hub/hvac`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/electrical`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/borehole`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/incinerators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/motors`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/maintenance-hub/fabrication`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/maintenance-hub/welding`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/maintenance-hub/general`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/calculators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/booking`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/faq`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/gallery`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/brands`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/knowledge-base`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/careers`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/locations`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    /*
     * Added 2026-07-31 after a live crawl found these published, reachable and
     * absent from the sitemap:
     *   /east-africa    the regional hub above the 36 /<country>/<city> pages
     *   /marketplace    the spare-parts marketplace
     *   /all-tools      the engineering tools index
     *   /site-directory the HTML index of every section (see that page's header
     *                   for why it exists — the mega-menu nav renders no hrefs)
     */
    { url: `${BASE_URL}/east-africa`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/marketplace`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/all-tools`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/site-directory`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.6 },
    // /why-emersoneims was published, live and reachable from NOTHING — not one
    // internal link and not in the sitemap. That is how a page built around
    // naming six competitors survived unreviewed. Rebuilt and listed 2026-08-03.
    { url: `${BASE_URL}/why-emersoneims`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    // /counties is permanently redirected to /kenya — keep only the canonical.
    { url: `${BASE_URL}/kenya`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

    // Generator sub-routes (commercial intent)
    { url: `${BASE_URL}/generators/leasing`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/systems`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    // /generators/case-studies is 308-redirected to /case-studies in
    // next.config.ts and must NOT be listed — a sitemap advertises canonical
    // destinations, not redirect sources. /case-studies is listed below.
    { url: `${BASE_URL}/generators/maintenance-companion`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },

    // Industry pages - Critical for B2B SEO
    { url: `${BASE_URL}/industries`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
  ];

  // Add industry-specific pages (HIGH PRIORITY - B2B leads)
  for (const industry of industries) {
    urls.push({
      url: `${BASE_URL}/industries/${industry}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  }

  // Add blog articles (IMPORTANT for long-tail SEO)
  for (const slug of blogSlugs) {
    urls.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  }

  // Generator Oracle Product Pages
  urls.push(
    { url: `${BASE_URL}/products/generator-oracle`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${BASE_URL}/faults`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/troubleshooting`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/case-studies`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 }
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
  for (const fault of FAULT_CODES) {
    urls.push({
      url: `${BASE_URL}/faults/${fault.code.toLowerCase()}`,
      lastModified: currentDate,
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
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: depth <= 2 ? 0.85 : depth === 3 ? 0.8 : 0.7,
    });
  }

  // Add major town location pages
  for (const town of majorTowns) {
    urls.push({
      url: `${BASE_URL}/locations/${town}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    });
  }

  // Add curated location + service combinations (HIGH-INTENT keywords).
  // Sourced from the same indexed registry the page uses for
  // generateStaticParams — sitemap stays in lockstep with what's
  // actually rendered + indexable. Anything outside this list 404s.
  for (const { location, service } of getIndexedServiceLocationPaths()) {
    urls.push({
      url: `${BASE_URL}/locations/${location}/${service}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

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
      lastModified: currentDate,
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
        lastModified: currentDate,
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
      lastModified: currentDate,
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
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  });
  for (const slug of SECTORS_WITHOUT_INDUSTRY_HUB) {
    urls.push({
      url: `${BASE_URL}/sectors/${slug}`,
      lastModified: currentDate,
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
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return urls;
}
