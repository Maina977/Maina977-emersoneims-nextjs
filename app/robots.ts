import { MetadataRoute } from 'next';

// Force dynamic generation - bypass edge cache
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

  /*
   * ONE GROUP WINS. A crawler obeys only the MOST SPECIFIC group that matches
   * its token, and ignores every other group entirely — including '*'.
   *
   * That made the per-bot groups below actively harmful. Each said only
   * `allow: '/'`, so for Googlebot, Bingbot, GPTBot and 25 others the '*'
   * disallows did not apply at all: /api/, /admin/, /private/ and /test-* were
   * fully crawlable by every major search and AI crawler. The groups were
   * added to welcome those bots and silently removed all protection instead.
   *
   * Every group now carries this same list, so "welcome" no longer means
   * "help yourself".
   *
   * /_next/static/ IS DELIBERATELY NOT LISTED. Blocking it blocks the CSS and
   * JavaScript needed to render the page. Google's own guidance is explicit
   * that this hurts, because a crawler that cannot fetch stylesheets and
   * scripts cannot see the page a user sees. Googlebot escaped this by having
   * its own group, but everything falling back to '*' did not — including
   * Google-InspectionTool, which powers the URL Inspection live test, so the
   * live test was rendering this site unstyled. Hashed build assets are not
   * indexable as pages; there was nothing to protect.
   */
  const SHARED_DISALLOW = ['/api/', '/admin/', '/private/', '/test-*'];

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
        disallow: SHARED_DISALLOW,
      },
      // Google - Priority crawler, no delay
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 0,
      },
      // Bing - Microsoft's search engine
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 1,
      },
      // Yahoo (uses Bing)
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 1,
      },
      // DuckDuckGo
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 1,
      },
      // Yandex - Russian search engine
      {
        userAgent: 'YandexBot',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 2,
      },
      // Baidu - Chinese search engine
      {
        userAgent: 'Baiduspider',
        allow: '/',
        disallow: SHARED_DISALLOW,
        crawlDelay: 2,
      },
      // ─── AI ASSISTANTS / LLM CRAWLERS (2026-07-17) ───
      // Explicitly welcome AI search + assistants so EmersonEIMS services and
      // AI tools can be discovered, cited and answered when users ask
      // ChatGPT / Perplexity / Gemini / Claude / DeepSeek about generators,
      // solar, boreholes, spare parts and repairs in Kenya & East Africa.
      { userAgent: 'GPTBot', allow: '/', disallow: SHARED_DISALLOW },              // OpenAI (ChatGPT)
      { userAgent: 'OAI-SearchBot', allow: '/', disallow: SHARED_DISALLOW },       // ChatGPT Search
      { userAgent: 'ChatGPT-User', allow: '/', disallow: SHARED_DISALLOW },        // ChatGPT browsing
      { userAgent: 'PerplexityBot', allow: '/', disallow: SHARED_DISALLOW },       // Perplexity
      { userAgent: 'Perplexity-User', allow: '/', disallow: SHARED_DISALLOW },
      { userAgent: 'ClaudeBot', allow: '/', disallow: SHARED_DISALLOW },           // Anthropic (Claude)
      { userAgent: 'anthropic-ai', allow: '/', disallow: SHARED_DISALLOW },
      { userAgent: 'Claude-Web', allow: '/', disallow: SHARED_DISALLOW },
      { userAgent: 'Google-Extended', allow: '/', disallow: SHARED_DISALLOW },     // Gemini
      { userAgent: 'CCBot', allow: '/', disallow: SHARED_DISALLOW },               // Common Crawl (many models)
      { userAgent: 'DeepSeekBot', allow: '/', disallow: SHARED_DISALLOW },         // DeepSeek
      { userAgent: 'Amazonbot', allow: '/', disallow: SHARED_DISALLOW },           // Amazon (Rufus/Alexa)
      { userAgent: 'Applebot-Extended', allow: '/', disallow: SHARED_DISALLOW },   // Apple Intelligence
      { userAgent: 'cohere-ai', allow: '/', disallow: SHARED_DISALLOW },           // Cohere
      { userAgent: 'Bytespider', allow: '/', disallow: SHARED_DISALLOW },          // ByteDance / Doubao
      { userAgent: 'meta-externalagent', allow: '/', disallow: SHARED_DISALLOW },  // Meta AI
      // Facebook crawler
      {
        userAgent: 'facebookexternalhit',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // Twitter/X crawler
      {
        userAgent: 'Twitterbot',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // LinkedIn crawler
      {
        userAgent: 'LinkedInBot',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // WhatsApp crawler
      {
        userAgent: 'WhatsApp',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // Pinterest crawler
      {
        userAgent: 'Pinterest',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
      // Telegram crawler
      {
        userAgent: 'TelegramBot',
        allow: '/',
        disallow: SHARED_DISALLOW,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
