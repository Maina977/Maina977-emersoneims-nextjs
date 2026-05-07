import { MetadataRoute } from 'next';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SITEMAP - All pages for maximum SEO visibility
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://www.emersoneims.com';

// All 47 Kenya Counties
const counties = [
  'nairobi', 'mombasa', 'kilifi', 'kwale', 'lamu', 'taita-taveta', 'tana-river',
  'kiambu', 'nyeri', 'muranga', 'kirinyaga', 'nyandarua',
  'nakuru', 'uasin-gishu', 'narok', 'kericho', 'bomet', 'baringo', 'laikipia',
  'kajiado', 'trans-nzoia', 'nandi', 'elgeyo-marakwet', 'west-pokot', 'turkana', 'samburu',
  'kakamega', 'bungoma', 'busia', 'vihiga',
  'kisumu', 'kisii', 'nyamira', 'homa-bay', 'migori', 'siaya',
  'machakos', 'meru', 'embu', 'kitui', 'makueni', 'tharaka-nithi', 'isiolo', 'marsabit',
  'garissa', 'wajir', 'mandera'
];

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

// Services for location combinations
const services = [
  'generators',
  'generator-repair',
  'generator-maintenance',
  'generator-installation',
  'solar',
  'ups',
  'motor-rewinding',
  'borehole-pumps'
];

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
  'generator-servicing-cost-kenya'
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
    { url: `${BASE_URL}/all-tools`,                             lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

    // Service pages
    // The /solutions/* slugs that 308 redirect in next.config.ts (solar, ups,
    // motor-rewinding, borehole-pumps, ac, generators, controls, motors) are
    // omitted here — only the canonical /services/* (or top-level) destinations
    // are listed. The non-redirected /solutions/* slugs are still emitted.
    { url: `${BASE_URL}/services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/services/ups-systems`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/motor-rewinding`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/borehole-pumps`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/services/ac-installation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/services/ats-changeover`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
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

  // Add county pages
  for (const county of counties) {
    // NOTE: /counties/{slug} is permanently redirected to /kenya/{slug} in
    // next.config.ts — listing both in the sitemap created "Page with
    // redirect" entries in Search Console. Emit only the canonical /kenya path.
    urls.push({
      url: `${BASE_URL}/kenya/${county}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
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

  // Add location + service combinations for top towns (HIGH-INTENT keywords)
  const topLocations = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'westlands', 'karen'];
  for (const location of topLocations) {
    for (const service of services) {
      urls.push({
        url: `${BASE_URL}/locations/${location}/${service}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }
  }

  return urls;
}
