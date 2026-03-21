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

    // Generator pages
    { url: `${BASE_URL}/generators`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/generators/spare-parts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/generators/installation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/maintenance`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/generators/rental`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/generators/used`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

    // Solar pages
    { url: `${BASE_URL}/solar`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/solutions/solar`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/solar-sizing`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

    // Diagnostic pages
    { url: `${BASE_URL}/generator-oracle`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
    { url: `${BASE_URL}/diagnostics`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/diagnostic-suite`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/diagnostic-cockpit`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/fault-code-lookup`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/troubleshooting`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/technical-bible`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

    // Service pages
    { url: `${BASE_URL}/services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/solutions/ups`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/solutions/motor-rewinding`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/solutions/borehole-pumps`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/solutions/ac`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/solutions/incinerators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },

    // Other pages
    { url: `${BASE_URL}/maintenance-hub`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/calculators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/booking`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/faq`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
    { url: `${BASE_URL}/gallery`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/brands`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/locations`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/counties`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/kenya`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },

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

  // Add county pages
  for (const county of counties) {
    urls.push({
      url: `${BASE_URL}/counties/${county}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    // Add kenya/county pages
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
