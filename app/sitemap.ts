import { MetadataRoute } from 'next';

// Kenya counties for dynamic sitemap generation
const counties = [
  'nairobi', 'mombasa', 'kisumu', 'nakuru', 'eldoret', 'thika', 'malindi', 'kitale',
  'garissa', 'kakamega', 'meru', 'nyeri', 'machakos', 'kiambu', 'kericho', 'uasin-gishu',
  'narok', 'migori', 'siaya', 'kisii', 'bomet', 'bungoma', 'homa-bay', 'kajiado',
  'kericho', 'kilifi', 'kirinyaga', 'kwale', 'laikipia', 'lamu', 'makueni', 'mandera',
  'marsabit', 'muranga', 'nandi', 'nyandarua', 'nyamira', 'samburu', 'taita-taveta',
  'tana-river', 'tharaka-nithi', 'trans-nzoia', 'turkana', 'vihiga', 'wajir', 'west-pokot',
  'baringo'
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
  const currentDate = new Date();
  
  // Main pages
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
      url: `${baseUrl}/service`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solution`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/generators`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solar`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/diagnostic-qa`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diagnostic-suite`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diagnostics`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/brands`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/careers`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];
  
  // County pages
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
  
  return [...mainPages, ...countyPages];
}
