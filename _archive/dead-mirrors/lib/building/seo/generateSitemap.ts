/**
 * SITEMAP GENERATOR
 * Generates comprehensive sitemap for all pages, counties, services
 * Helps search engines discover all content
 *
 * Now includes ~1.4M+ location-service pages for East Africa SEO dominance
 * - Kenya: 47 counties, 290 constituencies, 8000+ villages
 * - International: 9 countries, 70+ cities
 * - Brands: 17 generator brands
 * - Sectors: 25 target sectors
 */

import { KENYA_COUNTIES, SERVICE_CATEGORIES } from './seoConfig';
import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';
import { GENERATOR_BRANDS, getAllBrandSlugs } from '@/lib/data/generator-brands';
import { TARGET_SECTORS, getAllSectorSlugs } from '@/lib/data/target-sectors';
import { EAST_AFRICA_COUNTRIES, getAllCountrySlugs, getCitySlugsForCountry } from '@/lib/data/east-africa-locations';

export interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export function generateSitemap(): SitemapEntry[] {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: SitemapEntry[] = [];

  // Main pages (highest priority)
  const mainPages = [
    { path: '/', priority: 1.0, changeFreq: 'daily' as const },
    { path: '/generators', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/solar', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/service', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/solution', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/about-us', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/brands', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/diagnostics', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/diagnostic-suite', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/diagnostic-qa', priority: 0.9, changeFreq: 'weekly' as const },
  ];

  mainPages.forEach(page => {
    entries.push({
      url: `${baseUrl}${page.path}`,
      lastModified: today,
      changeFrequency: page.changeFreq,
      priority: page.priority
    });
  });

  // All 47 county pages (high priority for local SEO)
  KENYA_COUNTIES.forEach(county => {
    const countySlug = county.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    entries.push({
      url: `${baseUrl}/counties/${countySlug}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85
    });

    // Service-specific county pages
    SERVICE_CATEGORIES.forEach(service => {
      entries.push({
        url: `${baseUrl}/counties/${countySlug}/${service.id}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.8
      });
    });
  });

  // Service pages
  SERVICE_CATEGORIES.forEach(service => {
    entries.push({
      url: `${baseUrl}/services/${service.id}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85
    });

    // Service brands
    if (service.brands) {
      service.brands.forEach(brand => {
        const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        entries.push({
          url: `${baseUrl}/services/${service.id}/${brandSlug}`,
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.7
        });
      });
    }
  });

  // Brand pages
  const allBrands = SERVICE_CATEGORIES.flatMap(s => s.brands || []);
  const uniqueBrands = [...new Set(allBrands)];
  
  uniqueBrands.forEach(brand => {
    const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    entries.push({
      url: `${baseUrl}/brands/${brandSlug}`,
      lastModified: today,
      changeFrequency: 'monthly',
      priority: 0.75
    });
  });

  return entries;
}

// Generate XML sitemap
export function generateSitemapXML(): string {
  const entries = generateSitemap();
  
  const xmlEntries = entries.map(entry => `
  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified.toISOString()}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries}
</urlset>`;
}

// ============================================================================
// COMPREHENSIVE KENYA LOCATION-SERVICE SITEMAP
// ============================================================================

/**
 * Generate all Kenya location-service URLs
 * Total: ~127,000+ pages
 */
export function generateKenyaLocationSitemap(): SitemapEntry[] {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();
  const entries: SitemapEntry[] = [];

  // Kenya landing page
  entries.push({
    url: `${baseUrl}/kenya`,
    lastModified: today,
    changeFrequency: 'daily',
    priority: 0.9
  });

  for (const county of KENYA_LOCATIONS) {
    // County landing page
    entries.push({
      url: `${baseUrl}/kenya/${county.slug}`,
      lastModified: today,
      changeFrequency: 'weekly',
      priority: 0.85
    });

    // County + Service pages (~705 total)
    for (const service of SEO_SERVICES) {
      entries.push({
        url: `${baseUrl}/kenya/${county.slug}/${service.slug}`,
        lastModified: today,
        changeFrequency: 'weekly',
        priority: 0.8
      });
    }

    // Constituency pages (~290 total)
    for (const constituency of county.constituencies) {
      entries.push({
        url: `${baseUrl}/kenya/${county.slug}/${constituency.slug}`,
        lastModified: today,
        changeFrequency: 'monthly',
        priority: 0.7
      });

      // Constituency + Service pages (~4,350 total)
      for (const service of SEO_SERVICES) {
        entries.push({
          url: `${baseUrl}/kenya/${county.slug}/${constituency.slug}/${service.slug}`,
          lastModified: today,
          changeFrequency: 'monthly',
          priority: 0.6
        });
      }

      // Village pages and Village + Service pages (generated on-demand, excluded from static sitemap)
      // These will be discovered through internal linking
    }
  }

  return entries;
}

/**
 * Generate sitemap index for multiple sitemaps (required for large sites)
 * Split into 30+ sitemaps to stay under 50K URL limit per sitemap
 */
export function generateSitemapIndex(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Core Pages -->
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Kenya Location Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-kenya-counties.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-kenya-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-kenya-constituencies.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Generator Brands Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-brands.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-brands-kenya.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- Target Sectors Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-sectors.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-sectors-kenya.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>

  <!-- International Sitemaps -->
  <sitemap>
    <loc>${baseUrl}/sitemap-international.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-uganda.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-tanzania.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-rwanda.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-ethiopia.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-drc.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-south-sudan.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-somaliland.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
}

/**
 * Generate Kenya county + service sitemap XML
 */
export function generateKenyaCountyServiceSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  for (const county of KENYA_LOCATIONS) {
    // County + Service pages
    for (const service of SEO_SERVICES) {
      entries.push(`
  <url>
    <loc>${baseUrl}/kenya/${county.slug}/${service.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

/**
 * Generate Kenya constituency sitemap XML
 */
export function generateKenyaConstituencySitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  for (const county of KENYA_LOCATIONS) {
    for (const constituency of county.constituencies) {
      // Constituency landing
      entries.push(`
  <url>
    <loc>${baseUrl}/kenya/${county.slug}/${constituency.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);

      // Constituency + Service pages
      for (const service of SEO_SERVICES) {
        entries.push(`
  <url>
    <loc>${baseUrl}/kenya/${county.slug}/${constituency.slug}/${service.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

/**
 * Get sitemap statistics
 */
export function getSitemapStats() {
  let countyServicePages = 0;
  let constituencyPages = 0;
  let constituencyServicePages = 0;
  let villagePages = 0;
  let villageServicePages = 0;

  for (const county of KENYA_LOCATIONS) {
    countyServicePages += SEO_SERVICES.length;

    for (const constituency of county.constituencies) {
      constituencyPages += 1;
      constituencyServicePages += SEO_SERVICES.length;

      for (const village of constituency.villages) {
        villagePages += 1;
        villageServicePages += SEO_SERVICES.length;
      }
    }
  }

  return {
    counties: KENYA_LOCATIONS.length,
    services: SEO_SERVICES.length,
    countyServicePages,
    constituencyPages,
    constituencyServicePages,
    villagePages,
    villageServicePages,
    total: KENYA_LOCATIONS.length + countyServicePages + constituencyPages +
           constituencyServicePages + villagePages + villageServicePages
  };
}

// ============================================================================
// BRANDS SITEMAP
// ============================================================================

/**
 * Generate brand landing pages sitemap
 */
export function generateBrandsSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  // Brand landing pages
  for (const brand of GENERATOR_BRANDS) {
    entries.push(`
  <url>
    <loc>${baseUrl}/brands/${brand.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

/**
 * Generate brand + Kenya location pages sitemap
 */
export function generateBrandsKenyaSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  // Brand + County pages
  for (const brand of GENERATOR_BRANDS) {
    for (const county of KENYA_LOCATIONS) {
      entries.push(`
  <url>
    <loc>${baseUrl}/brands/${brand.slug}/kenya/${county.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

// ============================================================================
// SECTORS SITEMAP
// ============================================================================

/**
 * Generate sector landing pages sitemap
 */
export function generateSectorsSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  // Sector landing pages
  for (const sector of TARGET_SECTORS) {
    entries.push(`
  <url>
    <loc>${baseUrl}/sectors/${sector.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

/**
 * Generate sector + Kenya location pages sitemap
 */
export function generateSectorsKenyaSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  // Sector + County pages
  for (const sector of TARGET_SECTORS) {
    for (const county of KENYA_LOCATIONS) {
      entries.push(`
  <url>
    <loc>${baseUrl}/sectors/${sector.slug}/kenya/${county.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

// ============================================================================
// INTERNATIONAL SITEMAP
// ============================================================================

/**
 * Generate international country/city pages sitemap
 */
export function generateInternationalSitemapXML(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();

  const entries: string[] = [];

  // Country + City pages
  for (const country of EAST_AFRICA_COUNTRIES) {
    for (const city of country.cities) {
      entries.push(`
  <url>
    <loc>${baseUrl}/${country.slug}/${city.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`);
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

/**
 * Generate sitemap for specific country
 */
export function generateCountrySitemapXML(countrySlug: string): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date();
  const country = EAST_AFRICA_COUNTRIES.find(c => c.slug === countrySlug);

  if (!country) return '';

  const entries: string[] = [];

  for (const city of country.cities) {
    entries.push(`
  <url>
    <loc>${baseUrl}/${country.slug}/${city.slug}</loc>
    <lastmod>${today.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('')}
</urlset>`;
}

// ============================================================================
// COMPREHENSIVE STATS
// ============================================================================

/**
 * Get comprehensive sitemap statistics for all pages
 */
export function getComprehensiveSitemapStats() {
  const kenyaStats = getSitemapStats();

  // Brand pages
  const brandPages = GENERATOR_BRANDS.length;
  const brandLocationPages = GENERATOR_BRANDS.length * KENYA_LOCATIONS.length;

  // Sector pages
  const sectorPages = TARGET_SECTORS.length;
  const sectorLocationPages = TARGET_SECTORS.length * KENYA_LOCATIONS.length;

  // International pages
  let internationalPages = 0;
  for (const country of EAST_AFRICA_COUNTRIES) {
    internationalPages += country.cities.length;
  }

  return {
    kenya: kenyaStats,
    brands: {
      brandPages,
      brandLocationPages,
      total: brandPages + brandLocationPages
    },
    sectors: {
      sectorPages,
      sectorLocationPages,
      total: sectorPages + sectorLocationPages
    },
    international: {
      countries: EAST_AFRICA_COUNTRIES.length,
      cityPages: internationalPages,
      total: internationalPages
    },
    grandTotal: kenyaStats.total + brandPages + brandLocationPages +
                sectorPages + sectorLocationPages + internationalPages
  };
}

// Generate robots.txt
export function generateRobotsTxt(): string {
  return `# Emerson EiMS - Robots.txt
# Allow all search engines to crawl everything
# 1.4M+ pages across Kenya and East Africa

User-agent: *
Allow: /

# Sitemap Index (contains all sitemaps)
Sitemap: https://www.emersoneims.com/sitemap.xml

# Individual Sitemaps
Sitemap: https://www.emersoneims.com/sitemap-main.xml
Sitemap: https://www.emersoneims.com/sitemap-services.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-counties.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-services.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-constituencies.xml
Sitemap: https://www.emersoneims.com/sitemap-brands.xml
Sitemap: https://www.emersoneims.com/sitemap-brands-kenya.xml
Sitemap: https://www.emersoneims.com/sitemap-sectors.xml
Sitemap: https://www.emersoneims.com/sitemap-sectors-kenya.xml
Sitemap: https://www.emersoneims.com/sitemap-international.xml
Sitemap: https://www.emersoneims.com/sitemap-uganda.xml
Sitemap: https://www.emersoneims.com/sitemap-tanzania.xml
Sitemap: https://www.emersoneims.com/sitemap-rwanda.xml
Sitemap: https://www.emersoneims.com/sitemap-ethiopia.xml
Sitemap: https://www.emersoneims.com/sitemap-drc.xml
Sitemap: https://www.emersoneims.com/sitemap-south-sudan.xml
Sitemap: https://www.emersoneims.com/sitemap-somaliland.xml

# Crawl delay (optional, for politeness)
Crawl-delay: 0

# Specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block only sensitive areas (if any)
Disallow: /api/
Disallow: /admin/
Disallow: /_next/static/

# Allow important JS and CSS files for rendering
Allow: /*.js
Allow: /*.css
Allow: /*.jpg
Allow: /*.jpeg
Allow: /*.png
Allow: /*.gif
Allow: /*.svg
Allow: /*.webp
`;
}
