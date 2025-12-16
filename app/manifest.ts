import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EmersonEIMS - Energy Infrastructure Management System',
    short_name: 'EmersonEIMS',
    description: 'Professional energy infrastructure management solutions including generators, solar systems, UPS, and comprehensive diagnostics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#fbbf24',
    orientation: 'portrait-primary',
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
    ],
    categories: ['business', 'productivity', 'utilities'],
    shortcuts: [
      {
        name: 'Generators',
        short_name: 'Generators',
        description: 'View generator solutions',
        url: '/generators',
        icons: [{ src: '/icon-generator.png', sizes: '96x96' }],
      },
      {
        name: 'Solar',
        short_name: 'Solar',
        description: 'View solar solutions',
        url: '/solar',
        icons: [{ src: '/icon-solar.png', sizes: '96x96' }],
      },
      {
        name: 'Contact',
        short_name: 'Contact',
        description: 'Get in touch',
        url: '/contact',
        icons: [{ src: '/icon-contact.png', sizes: '96x96' }],
      },
    ],
  };
}


