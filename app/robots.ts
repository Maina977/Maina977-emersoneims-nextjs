import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';
  
  return {
    rules: [
      // Default rules for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/', '/private/', '*.json$'],
      },
      // Google - Priority crawler, no delay
      {
        userAgent: 'Googlebot',
        allow: '/',
        crawlDelay: 0,
      },
      // Bing - Microsoft's search engine
      {
        userAgent: 'Bingbot',
        allow: '/',
        crawlDelay: 1,
      },
      // Yahoo (uses Bing)
      {
        userAgent: 'Slurp',
        allow: '/',
        crawlDelay: 1,
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        crawlDelay: 1,
      },
      // Yandex - Russian search engine
      {
        userAgent: 'YandexBot',
        allow: '/',
        crawlDelay: 2,
      },
      // Baidu - Chinese search engine
      {
        userAgent: 'Baiduspider',
        allow: '/',
        crawlDelay: 2,
      },
      // Facebook crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
      },
      // Twitter/X crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
      },
      // LinkedIn crawler
      {
        userAgent: 'LinkedInBot',
        allow: '/',
      },
      // WhatsApp crawler
      {
        userAgent: 'WhatsApp',
        allow: '/',
      },
      // Pinterest crawler
      {
        userAgent: 'Pinterest',
        allow: '/',
      },
      // Telegram crawler
      {
        userAgent: 'TelegramBot',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
