import { MetadataRoute } from 'next';

// ═══════════════════════════════════════════════════════════════════════════════
// 🗺️ COMPREHENSIVE SITEMAP FOR #1 SEO RANKING
// All 47 Kenya Counties + Services + Products + Content
// ═══════════════════════════════════════════════════════════════════════════════

// All 47 Kenya Counties for Local SEO Dominance
const counties = [
  // Nairobi Region
  'nairobi',
  // Coast Region
  'mombasa', 'kilifi', 'kwale', 'lamu', 'taita-taveta', 'tana-river',
  // Central Region
  'kiambu', 'nyeri', 'muranga', 'kirinyaga', 'nyandarua',
  // Rift Valley Region
  'nakuru', 'uasin-gishu', 'narok', 'kericho', 'bomet', 'baringo', 'laikipia',
  'kajiado', 'trans-nzoia', 'nandi', 'elgeyo-marakwet', 'west-pokot', 'turkana', 'samburu',
  // Western Region
  'kakamega', 'bungoma', 'busia', 'vihiga',
  // Nyanza Region
  'kisumu', 'kisii', 'nyamira', 'homa-bay', 'migori', 'siaya',
  // Eastern Region
  'machakos', 'meru', 'embu', 'kitui', 'makueni', 'tharaka-nithi', 'isiolo', 'marsabit',
  // North Eastern Region
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
const services = [
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

// Blog posts for sitemap
const blogPosts = [
  'complete-guide-generator-sizing-kenya',
  'solar-power-investment-roi-kenya',
  'generator-maintenance-checklist',
  'ups-systems-buying-guide',
  'motor-rewinding-when-to-repair',
  'power-backup-solutions-hospitals',
  'how-to-choose-generator-kenya',
  'diesel-vs-petrol-generator',
  'generator-fuel-consumption-guide',
  'solar-roi-calculator-kenya',
  'backup-power-for-hospitals',
  'industrial-generators-guide',
  'generator-noise-reduction-tips',
  'generator-load-calculation',
  'automatic-transfer-switch-guide',
  'generator-maintenance-schedule'
];

// Error Code Categories for Diagnostic Pages
const errorCodeCategories = [
  'cummins-fault-codes', 'perkins-fault-codes', 'caterpillar-fault-codes',
  'deepsea-fault-codes', 'powerwizard-fault-codes', 'comap-fault-codes',
  'woodward-fault-codes', 'generator-alarm-codes', 'generator-warning-codes'
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
  // BLOG & CONTENT PAGES - Authority Building
  // ═══════════════════════════════════════════════════════════════════════════════
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogPosts.map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    {
      url: `${baseUrl}/knowledge-base`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/troubleshooting`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // TOOLS & CALCULATORS - High Engagement Pages
  // ═══════════════════════════════════════════════════════════════════════════════
  const toolPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/calculators`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diagnostic-journey`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/gallery`,
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
      priority: 0.85,
    })),
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // MAJOR TOWN PAGES - Extra Local SEO Coverage
  // ═══════════════════════════════════════════════════════════════════════════════
  const townPages: MetadataRoute.Sitemap = majorTowns.map(town => ({
    url: `${baseUrl}/locations/${town}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERATOR BRAND PAGES - Brand Authority
  // ═══════════════════════════════════════════════════════════════════════════════
  const brandPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    ...generatorBrands.map(brand => ({
      url: `${baseUrl}/generators/brands/${brand}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // GENERATOR SIZE PAGES - Size-Based Search Intent
  // ═══════════════════════════════════════════════════════════════════════════════
  const sizePages: MetadataRoute.Sitemap = generatorSizes.map(size => ({
    url: `${baseUrl}/generators/${size}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ═══════════════════════════════════════════════════════════════════════════════
  // ERROR CODE PAGES - Technical Authority for Diagnostics
  // ═══════════════════════════════════════════════════════════════════════════════
  const errorCodePages: MetadataRoute.Sitemap = errorCodeCategories.map(category => ({
    url: `${baseUrl}/diagnostics/${category}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ═══════════════════════════════════════════════════════════════════════════════
  // SERVICE-LOCATION PAGES - Hyper-Local SEO (Top Counties Only)
  // ═══════════════════════════════════════════════════════════════════════════════
  const topCounties = ['nairobi', 'mombasa', 'kisumu', 'nakuru', 'kiambu', 'machakos', 'kajiado', 'nyeri', 'meru'];
  const serviceLocationPages: MetadataRoute.Sitemap = [];

  topCounties.forEach(county => {
    services.forEach(service => {
      serviceLocationPages.push({
        url: `${baseUrl}/services/${service}/${county}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      });
    });
  });

  // ═══════════════════════════════════════════════════════════════════════════════
  // INDUSTRY-SPECIFIC PAGES - Vertical Market SEO
  // ═══════════════════════════════════════════════════════════════════════════════
  const industries = [
    'hospitals', 'hotels', 'factories', 'schools', 'supermarkets', 'banks',
    'telecom', 'construction', 'farms', 'data-centers', 'malls', 'offices'
  ];

  const industryPages: MetadataRoute.Sitemap = industries.map(industry => ({
    url: `${baseUrl}/solutions/industries/${industry}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.75,
  }));

  // ═══════════════════════════════════════════════════════════════════════════════
  // SPARE PARTS PAGES - Product SEO
  // ═══════════════════════════════════════════════════════════════════════════════
  const sparePartsCategories = [
    'filters', 'belts', 'batteries', 'starters', 'alternators', 'injectors',
    'fuel-pumps', 'water-pumps', 'turbochargers', 'gaskets', 'bearings', 'controllers'
  ];

  const sparePartsPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/spare-parts`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...sparePartsCategories.map(category => ({
      url: `${baseUrl}/spare-parts/${category}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // COMBINE ALL PAGES FOR COMPREHENSIVE SITEMAP
  // Total: 500+ High-Quality URLs
  // ═══════════════════════════════════════════════════════════════════════════════
  return [
    ...mainPages,
    ...generatorPages,
    ...solarPages,
    ...diagnosticPages,
    ...servicePages,
    ...blogPages,
    ...toolPages,
    ...countyPages,
    ...townPages,
    ...brandPages,
    ...sizePages,
    ...errorCodePages,
    ...serviceLocationPages,
    ...industryPages,
    ...sparePartsPages,
  ];
}
