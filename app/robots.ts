import { MetadataRoute } from 'next';

// Force dynamic generation - bypass edge cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

  return {
    rules: [
      // Default rules for all crawlers - optimized for maximum visibility
      {
        userAgent: '*',
        // Allow rules are positive permission hints to crawlers; they do NOT
        // create routes. Removed entries that pointed at non-existent or
        // permanently-redirected paths (/counties/ → /kenya/, /diagnostic-suite/
        // → /diagnostics/, /fault-code-lookup/ → /faults/) so Search Console
        // stops re-discovering those slugs as crawl targets.
        allow: [
          '/',
          '/generators/',
          '/solar/',
          '/solutions/',
          '/services/',
          '/blog/',
          '/kenya/',
          '/diagnostics/',
          '/generator-oracle/',
          '/solar-genius-pro/',
          '/aquascan-pro-v3/',
          '/pro-building-suite/',
          '/ai-tools/',
          '/faults/',
          '/calculators/',
          '/contact/',
          '/about-us/',
          '/knowledge-base/',
          '/troubleshooting/',
          '/faq/',
          '/gallery/',
          '/booking/',
          '/hub/',
        ],
        disallow: ['/api/', '/admin/', '/_next/static/', '/private/', '/test-*'],
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
