import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Emerson Energy - Generators & Solar Power Kenya',
    short_name: 'Emerson',
    description: 'Kenya\'s #1 generator and solar power company. 20+ years experience, 47 counties, 24/7 support. Call 0768 860 655.',
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
        description: 'Call 0768 860 655 or 0782914717',
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


