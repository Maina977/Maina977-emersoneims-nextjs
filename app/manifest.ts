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
        // File on disk is icon-512.png (icon-512x512.png does not exist) — a
        // wrong path here makes Chrome reject the install / drop the splash icon.
        src: '/icon-512.png',
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
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['business', 'productivity', 'utilities', 'shopping'],
    // Shortcut icons removed: /icon-generator.png, /icon-solar.png, etc. do not
    // exist in /public, so referencing them produced broken icon fetches. The
    // shortcuts still work without per-item icons (the app icon is used).
    shortcuts: [
      {
        name: 'Generators',
        short_name: 'Generators',
        description: 'Browse generator solutions from 5kVA to 2000kVA',
        url: '/generators',
      },
      {
        name: 'Solar Power',
        short_name: 'Solar',
        description: 'Explore solar panel and battery systems',
        url: '/solar',
      },
      {
        name: 'Services',
        short_name: 'Services',
        description: 'Maintenance, installation, and repairs',
        url: '/services',
      },
      {
        name: 'Contact Us',
        short_name: 'Contact',
        description: 'Call +254 768 860 665 or +254 782 914 717',
        url: '/contact',
      },
      {
        name: 'Blog',
        short_name: 'Blog',
        description: 'Expert articles on generators and solar',
        url: '/blog',
      },
    ],
    related_applications: [],
  };
}


