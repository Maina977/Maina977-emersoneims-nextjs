import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EmersonEIMS — Generators, Solar & Engineering Intelligence',
    short_name: 'EmersonEIMS',
    // Audit 2026-05-09: removed unverifiable "#1" superiority claim and
    // "20+ years" tenure claim (founding date is not publicly documented;
    // see data-policy.md — unlabelled estimates treated as sabotage).
    description:
      'EmersonEIMS — generators, solar and UPS sales, installation and 24/7 maintenance across Kenya, plus free engineering intelligence tools (Generator Oracle, Solar Genius Pro, AquaScan Pro, Building Suite Pro). Call +254 768 860 665.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f97316', // Orange-500
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'en-KE',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity', 'utilities', 'shopping'],
    shortcuts: [
      {
        name: 'Generators',
        short_name: 'Generators',
        description: 'Browse generator solutions from 5kVA to 2000kVA',
        url: '/generators',
        icons: [{ src: '/icon-generator.png', sizes: '96x96' }],
      },
      {
        name: 'Solar Power',
        short_name: 'Solar',
        description: 'Explore solar panel and battery systems',
        url: '/solar',
        icons: [{ src: '/icon-solar.png', sizes: '96x96' }],
      },
      {
        name: 'Services',
        short_name: 'Services',
        description: 'Maintenance, installation, and repairs',
        url: '/services',
        icons: [{ src: '/icon-services.png', sizes: '96x96' }],
      },
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Call +254 768 860 665 or +254 782 914 717',
        url: '/contact',
        icons: [{ src: '/icon-contact.png', sizes: '96x96' }],
      },
      {
        name: 'Blog',
        short_name: 'Blog',
        description: 'Expert articles on generators and solar',
        url: '/blog',
        icons: [{ src: '/icon-blog.png', sizes: '96x96' }],
      },
    ],
    related_applications: [],
  };
}


