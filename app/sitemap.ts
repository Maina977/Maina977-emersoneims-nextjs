import { MetadataRoute } from 'next';

// ═══════════════════════════════════════════════════════════════════════════════
// 🗺️ COMPREHENSIVE SITEMAP FOR #1 SEO RANKING IN KENYA
// Simplified and robust version with error handling
// ═══════════════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://www.emersoneims.com';

// Lazy load location data to avoid build-time issues
let cachedLocations: typeof import('@/lib/data/kenya-locations').KENYA_LOCATIONS | null = null;
let cachedServices: typeof import('@/lib/data/seo-services').SEO_SERVICES | null = null;

async function getLocations() {
  if (!cachedLocations) {
    try {
      const { KENYA_LOCATIONS } = await import('@/lib/data/kenya-locations');
      cachedLocations = KENYA_LOCATIONS;
    } catch (e) {
      console.error('Failed to load KENYA_LOCATIONS:', e);
      cachedLocations = [];
    }
  }
  return cachedLocations;
}

async function getServices() {
  if (!cachedServices) {
    try {
      const { SEO_SERVICES } = await import('@/lib/data/seo-services');
      cachedServices = SEO_SERVICES;
    } catch (e) {
      console.error('Failed to load SEO_SERVICES:', e);
      cachedServices = [];
    }
  }
  return cachedServices;
}

// All 47 Kenya Counties for Local SEO Dominance
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

// Major Towns for Extra Local SEO
const majorTowns = [
  'thika', 'eldoret', 'malindi', 'kitale', 'naivasha', 'ruiru', 'juja', 'kikuyu',
  'limuru', 'nyahururu', 'nanyuki', 'ongata-rongai', 'ngong', 'karen', 'westlands',
  'industrial-area', 'eastleigh', 'donholm', 'buruburu', 'south-b', 'south-c',
  'diani', 'watamu', 'lamu-town', 'voi', 'taveta', 'mtwapa', 'nyali', 'bamburi'
];

// Service Types for Service-Location Pages
const localServices = [
  'generator-sales', 'generator-installation', 'generator-maintenance', 'generator-repair',
  'generator-rental', 'solar-installation', 'solar-maintenance', 'ups-systems',
  'motor-rewinding', 'borehole-pumps', 'electrical-services', 'power-backup'
];

// Generator Brands for Brand Pages
const generatorBrands = [
  'cummins', 'perkins', 'caterpillar', 'fg-wilson', 'kohler', 'generac', 'sdmo',
  'mtu', 'volvo', 'john-deere', 'doosan', 'mitsubishi', 'yanmar', 'kipor', 'lister-petter', 'deutz'
];

// Generator Sizes for Size Pages
const generatorSizes = [
  '10kva', '15kva', '20kva', '25kva', '30kva', '40kva', '50kva', '60kva', '80kva',
  '100kva', '150kva', '200kva', '250kva', '300kva', '350kva', '400kva', '500kva',
  '600kva', '750kva', '800kva', '1000kva', '1250kva', '1500kva', '2000kva'
];

// Blog posts
const blogPosts = [
  'generator-maintenance-tips-kenya', 'generator-cost-saving-strategies',
  'generator-buying-guide-kenya', 'generator-safety-tips-kenya',
  'generator-fire-safety-prevention', 'solar-energy-solutions-kenya',
  'weather-impact-generators-kenya-counties', 'diy-generator-maintenance-home',
  'diesel-generator-best-practices', 'generator-roi-analysis-kenya',
  'solar-installation-tips-kenya', 'generator-procurement-kenya',
];

// Error Code Categories
const errorCodeCategories = [
  'cummins-fault-codes', 'perkins-fault-codes', 'caterpillar-fault-codes',
  'deepsea-fault-codes', 'powerwizard-fault-codes', 'comap-fault-codes',
  'woodward-fault-codes', 'generator-alarm-codes', 'generator-warning-codes'
];

// Industries
const industries = [
  'hospitals', 'hotels', 'factories', 'schools', 'supermarkets', 'banks',
  'telecom', 'construction', 'farms', 'data-centers', 'malls', 'offices'
];

// Spare Parts
const sparePartsCategories = [
  'filters', 'belts', 'batteries', 'starters', 'alternators', 'injectors',
  'fuel-pumps', 'water-pumps', 'turbochargers', 'gaskets', 'bearings', 'controllers'
];

// Generator Problems
const generatorProblems = [
  'wont-start', 'overheating', 'low-oil-pressure', 'voltage-frequency-unstable', 'exhaust-smoke'
];

// ═══════════════════════════════════════════════════════════════════════════════
// SITEMAP INDEX GENERATOR - Required for 100,000+ URLs
// Each sitemap file can have max 50,000 URLs
// ═══════════════════════════════════════════════════════════════════════════════
export async function generateSitemaps() {
  try {
    const locations = await getLocations();

    const sitemaps = [
      { id: 0 }, // Core pages, generators, solar, diagnostics, tools
      { id: 1 }, // Blog, brands, sizes, error codes, industries, spare parts
    ];

    // Add one sitemap per county (47 counties) for location pages
    if (locations && locations.length > 0) {
      locations.forEach((_, index) => {
        sitemaps.push({ id: index + 2 });
      });
    }

    return sitemaps;
  } catch (error) {
    console.error('Error generating sitemaps:', error);
    // Return minimal sitemaps on error
    return [{ id: 0 }, { id: 1 }];
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SITEMAP GENERATOR BY ID
// ═══════════════════════════════════════════════════════════════════════════════
export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Sitemap 0: Core pages
  if (id === 0) {
    return [
      // Main pages
      { url: BASE_URL, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/about-us`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${BASE_URL}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${BASE_URL}/careers`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.6 },
      { url: `${BASE_URL}/privacy`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },
      { url: `${BASE_URL}/terms`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.4 },

      // Generator pages
      { url: `${BASE_URL}/generators`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/generators/used`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${BASE_URL}/generators/installation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${BASE_URL}/generators/maintenance`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.95 },
      { url: `${BASE_URL}/generators/rental`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${BASE_URL}/generators/spare-parts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${BASE_URL}/generators/case-studies`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/generator-parts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/generator-services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },

      // Solar pages
      { url: `${BASE_URL}/solar`, lastModified: currentDate, changeFrequency: 'daily', priority: 1.0 },
      { url: `${BASE_URL}/solutions/solar`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/solutions/solar-sizing`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

      // Diagnostic pages
      { url: `${BASE_URL}/diagnostics`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/diagnostic-suite`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${BASE_URL}/diagnostic-cockpit`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
      { url: `${BASE_URL}/diagnostic-qa`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.8 },
      { url: `${BASE_URL}/fault-code-lookup`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${BASE_URL}/innovations`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

      // Service & Solution pages
      { url: `${BASE_URL}/service`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/services`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/solutions`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/solutions/generators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${BASE_URL}/solutions/controls`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/solutions/ups`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/solutions/motor-rewinding`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/solutions/borehole-pumps`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/solutions/incinerators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
      { url: `${BASE_URL}/solutions/ac`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
      { url: `${BASE_URL}/solutions/diesel-automation`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
      { url: `${BASE_URL}/solutions/motors`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.75 },
      { url: `${BASE_URL}/solutions/power-interruptions`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/fabrication`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/case-studies`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

      // Tools & Calculators
      { url: `${BASE_URL}/calculators`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/diagnostic-journey`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/booking`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.85 },
      { url: `${BASE_URL}/gallery`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.7 },

      // Generator Oracle
      { url: `${BASE_URL}/generator-oracle`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.95 },
      { url: `${BASE_URL}/generator-oracle/tools`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      { url: `${BASE_URL}/generator-oracle/purchase`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

      // Generator Problems
      { url: `${BASE_URL}/generator-problems`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      ...generatorProblems.map(problem => ({
        url: `${BASE_URL}/generator-problems/${problem}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })),

      // County index pages
      { url: `${BASE_URL}/counties`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
      ...counties.map(county => ({
        url: `${BASE_URL}/counties/${county}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })),

      // Major town pages
      ...majorTowns.map(town => ({
        url: `${BASE_URL}/locations/${town}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })),

      // Kenya index
      { url: `${BASE_URL}/kenya`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      { url: `${BASE_URL}/locations`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    ];
  }

  // Sitemap 1: Blog, brands, sizes, categories
  if (id === 1) {
    return [
      // Blog pages
      { url: `${BASE_URL}/blog`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      ...blogPosts.map(slug => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),
      { url: `${BASE_URL}/knowledge-base`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
      { url: `${BASE_URL}/faq`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
      { url: `${BASE_URL}/troubleshooting`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },

      // Brand pages
      { url: `${BASE_URL}/brands`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
      ...generatorBrands.map(brand => ({
        url: `${BASE_URL}/generators/brands/${brand}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),

      // Size pages
      ...generatorSizes.map(size => ({
        url: `${BASE_URL}/generators/${size}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),

      // Error code pages
      ...errorCodeCategories.map(category => ({
        url: `${BASE_URL}/diagnostics/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),

      // Industry pages
      ...industries.map(industry => ({
        url: `${BASE_URL}/solutions/industries/${industry}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      })),

      // Spare parts pages
      { url: `${BASE_URL}/spare-parts`, lastModified: currentDate, changeFrequency: 'daily', priority: 0.9 },
      ...sparePartsCategories.map(category => ({
        url: `${BASE_URL}/spare-parts/${category}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      })),

      // Top county service pages
      ...['nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu', 'machakos', 'kajiado', 'nyeri', 'meru'].flatMap(county =>
        localServices.map(service => ({
          url: `${BASE_URL}/services/${service}/${county}`,
          lastModified: currentDate,
          changeFrequency: 'weekly' as const,
          priority: 0.75,
        }))
      ),
    ];
  }

  // Sitemaps 2-48: One per county (47 counties)
  // Each contains: county + constituencies + villages × services
  try {
    const locations = await getLocations();
    const services = await getServices();

    const countyIndex = id - 2;
    if (countyIndex >= 0 && locations && countyIndex < locations.length) {
      const county = locations[countyIndex];
      const pages: MetadataRoute.Sitemap = [];

      // County landing page
      pages.push({
        url: `${BASE_URL}/kenya/${county.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.85,
      });

      // County + Service pages
      if (services && services.length > 0) {
        for (const service of services) {
          pages.push({
            url: `${BASE_URL}/kenya/${county.slug}/${service.slug}`,
            lastModified: currentDate,
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      }

      // Constituency pages + services + villages
      for (const constituency of county.constituencies || []) {
        // Constituency landing
        pages.push({
          url: `${BASE_URL}/kenya/${county.slug}/${constituency.slug}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.7,
        });

        // Constituency + Service pages
        if (services && services.length > 0) {
          for (const service of services) {
            pages.push({
              url: `${BASE_URL}/kenya/${county.slug}/${constituency.slug}/${service.slug}`,
              lastModified: currentDate,
              changeFrequency: 'monthly',
              priority: 0.6,
            });
          }
        }

        // Village pages + services (FULL COVERAGE)
        for (const village of constituency.villages || []) {
          // Village landing
          pages.push({
            url: `${BASE_URL}/kenya/${county.slug}/${constituency.slug}/${village.slug}`,
            lastModified: currentDate,
            changeFrequency: 'monthly',
            priority: 0.55,
          });

          // Village + Service pages
          if (services && services.length > 0) {
            for (const service of services) {
              pages.push({
                url: `${BASE_URL}/kenya/${county.slug}/${constituency.slug}/${village.slug}/${service.slug}`,
                lastModified: currentDate,
                changeFrequency: 'monthly',
                priority: 0.5,
              });
            }
          }
        }
      }

      return pages;
    }
  } catch (error) {
    console.error(`Error generating sitemap ${id}:`, error);
  }

  // Fallback - empty sitemap
  return [];
}
