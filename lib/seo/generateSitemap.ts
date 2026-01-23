/**
 * SITEMAP GENERATOR
 * Generates comprehensive sitemap for all pages, counties, services
 * Helps search engines discover all content
 *
 * Now includes ~127,000+ location-service pages for Kenya SEO dominance
 */

import { KENYA_COUNTIES, SERVICE_CATEGORIES } from './seoConfig';
import { KENYA_LOCATIONS } from '@/lib/data/kenya-locations';
import { SEO_SERVICES } from '@/lib/data/seo-services';

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
 */
export function generateSitemapIndex(): string {
  const baseUrl = 'https://www.emersoneims.com';
  const today = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-counties.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-services.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
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

// Generate robots.txt
export function generateRobotsTxt(): string {
  return `# Emerson EiMS - Robots.txt
# Allow all search engines to crawl everything

User-agent: *
Allow: /

# Sitemaps
Sitemap: https://www.emersoneims.com/sitemap.xml
Sitemap: https://www.emersoneims.com/sitemap-counties.xml
Sitemap: https://www.emersoneims.com/sitemap-services.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-counties.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-services.xml
Sitemap: https://www.emersoneims.com/sitemap-kenya-constituencies.xml

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
