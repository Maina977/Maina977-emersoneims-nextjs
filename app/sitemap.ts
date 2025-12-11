import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

  // Static routes
  const routes = [
    '',
    '/about-us',
    '/contact',
    '/services',
    '/solutions',
    '/generators',
    '/solar',
    '/diagnostics',
    '/solutions/generators',
    '/solutions/solar',
    '/solutions/ups',
    '/solutions/ac',
    '/solutions/motors',
    '/solutions/incinerators',
    '/solutions/diesel-automation',
    '/solutions/power-interruption',
    '/solutions/solar-sizing',
    '/solutions/bore-pumps',
    '/solutions/counties',
    '/generators/used',
    '/generators/testimonials',
    '/generators/service',
    '/generators/industries',
    '/generators/controls',
    '/generators/contact',
    '/generators/accessories',
    '/generators/case-studies',
    '/generator/error-frequency-chart',
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}




