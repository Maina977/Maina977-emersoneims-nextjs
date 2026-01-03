import { MetadataRoute } from 'next';

// Kenya counties for dynamic sitemap generation
const counties = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi', 'kitale',
  'garissa', 'kakamega', 'meru', 'nyeri', 'machakos', 'kiambu', 'kericho', 'uasin-gishu',
  'narok', 'migori', 'siaya', 'kisii', 'bomet', 'bungoma', 'homa-bay', 'kajiado',
  'kilifi', 'kirinyaga', 'kwale', 'laikipia', 'lamu', 'makueni', 'mandera',
  'marsabit', 'muranga', 'nandi', 'nyandarua', 'nyamira', 'samburu', 'taita-taveta',
  'tana-river', 'tharaka-nithi', 'trans-nzoia', 'turkana', 'vihiga', 'wajir', 'west-pokot',
  'baringo', 'embu', 'isiolo', 'elgeyo-marakwet'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
  const currentDate = new Date();
  
  // ═══════════════════════════════════════════════════════════════════════════════
  // MAIN PAGES - Highest Priority (Homepage & Core Pages)
  // ═══════════════════════════════════════════════════════════════════════════════
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERATOR PAGES - Premium Revenue Pages
  // ═══════════════════════════════════════════════════════════════════════════════
  const generatorPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/generators`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/generators/used`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generators/installation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generators/maintenance`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generators/rental`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generators/spare-parts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/generators/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/generator-parts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/generator-services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOLAR PAGES - Growing Market
  // ═══════════════════════════════════════════════════════════════════════════════
  const solarPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/solar`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/solutions/solar`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/solar-sizing`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIAGNOSTIC PAGES - Technical Authority
  // ═══════════════════════════════════════════════════════════════════════════════
  const diagnosticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/diagnostics`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diagnostic-suite`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/diagnostic-cockpit`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/diagnostic-qa`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fault-code-lookup`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/innovations`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // SERVICE & SOLUTION PAGES
  // ═══════════════════════════════════════════════════════════════════════════════
  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/service`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/generators`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/solutions/controls`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/ups`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/motor-rewinding`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/borehole-pumps`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/solutions/incinerators`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/solutions/ac`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/solutions/diesel-automation`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/solutions/motors`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.75,
    },
    {
      url: `${baseUrl}/solutions/power-interruptions`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fabrication`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // COUNTY PAGES - Local SEO Dominance (47 Counties)
  // ═══════════════════════════════════════════════════════════════════════════════
  const countyPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/counties`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...counties.map(county => ({
      url: `${baseUrl}/counties/${county}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
  
  // Combine all pages for comprehensive sitemap
  return [
    ...mainPages,
    ...generatorPages,
    ...solarPages,
    ...diagnosticPages,
    ...servicePages,
    ...countyPages,
  ];
}
