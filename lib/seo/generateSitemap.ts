/**
 * SITEMAP GENERATOR
 * Generates comprehensive sitemap for all pages, counties, services
 * Helps search engines discover all content
 */

import { KENYA_COUNTIES, SERVICE_CATEGORIES } from './seoConfig';

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
