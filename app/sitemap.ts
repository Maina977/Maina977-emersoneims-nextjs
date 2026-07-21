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

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SITEMAP - All pages for maximum SEO visibility
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://www.emersoneims.com';

// Major Towns
const majorTowns = [
  'thika', 'eldoret', 'malindi', 'kitale', 'naivasha', 'ruiru', 'juja', 'kikuyu',
  'westlands', 'karen', 'ngong', 'ongata-rongai', 'mtwapa', 'nyali', 'diani'
];

// Industries - Critical for B2B SEO
const industries = [
  'hotels-hospitality',
  'hospitals-healthcare',
  'schools-universities',
  'banks-financial',
  'manufacturing',
  'flower-farms',
  'real-estate',
  'churches-religious',
  'government-ngo'
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

// Fault codes for SEO (sample - full list is in faultCodes.ts)
const faultCodes = [
  'spn-111', 'spn-115', 'spn-190', 'spn-94', 'spn-100', 'spn-1514',
  'dse-e020', 'dse-e040', 'dse-e047', 'dse-e070',
  'comap-a001', 'comap-a015'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  const urls: MetadataRoute.Sitemap = [
    // Main pages
    { url: BASE_URL, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/about-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/resources`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },

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
    { url: `${BASE_URL}/pro-building-suite`,                    lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9  },
    { url: `${BASE_URL}/all-tools`,                             lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

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
    { url: `${BASE_URL}/solutions/building`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
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
    // /counties is permanently redirected to /kenya — keep only the canonical.
    { url: `${BASE_URL}/kenya`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

    // Generator sub-routes (commercial intent)
    { url: `${BASE_URL}/generators/leasing`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/systems`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/generators/case-studies`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
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

  // Add fault code pages (HIGH-INTENT - people searching for specific codes)
  for (const code of faultCodes) {
    urls.push({
      url: `${BASE_URL}/faults/${code}`,
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
