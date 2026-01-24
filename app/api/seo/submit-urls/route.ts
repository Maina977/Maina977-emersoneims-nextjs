import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// SEO URL SUBMISSION API
// Submits URLs to Google, Bing, Yandex via IndexNow & Sitemap Ping
// ═══════════════════════════════════════════════════════════════════════════════

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

// IndexNow API key (you should generate your own at https://www.indexnow.org/)
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'emersoneims2025indexnow';

// All 12 blog article URLs
const BLOG_ARTICLES = [
  'generator-maintenance-tips-kenya',
  'generator-cost-saving-strategies',
  'generator-buying-guide-kenya',
  'generator-safety-tips-kenya',
  'generator-fire-safety-prevention',
  'solar-energy-solutions-kenya',
  'weather-impact-generators-kenya-counties',
  'diy-generator-maintenance-home',
  'diesel-generator-best-practices',
  'generator-roi-analysis-kenya',
  'solar-installation-tips-kenya',
  'generator-procurement-kenya',
];

interface SubmissionResult {
  engine: string;
  status: 'success' | 'error';
  message: string;
  urls?: string[];
}

// Ping Google with sitemap
async function pingGoogle(): Promise<SubmissionResult> {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    const response = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'Google',
      status: response.ok ? 'success' : 'error',
      message: response.ok
        ? 'Sitemap submitted to Google successfully'
        : `Google ping failed: ${response.status}`,
    };
  } catch (error) {
    return {
      engine: 'Google',
      status: 'error',
      message: `Google ping error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Ping Bing with sitemap
async function pingBing(): Promise<SubmissionResult> {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const pingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    const response = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'Bing',
      status: response.ok ? 'success' : 'error',
      message: response.ok
        ? 'Sitemap submitted to Bing successfully'
        : `Bing ping failed: ${response.status}`,
    };
  } catch (error) {
    return {
      engine: 'Bing',
      status: 'error',
      message: `Bing ping error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Submit URLs via IndexNow (Bing, Yandex, Seznam, Naver)
async function submitIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    // Submit to Bing's IndexNow endpoint (propagates to other engines)
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'IndexNow (Bing, Yandex, Seznam, Naver)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202
        ? `${urls.length} URLs submitted via IndexNow`
        : `IndexNow failed: ${response.status}`,
      urls: urls,
    };
  } catch (error) {
    return {
      engine: 'IndexNow',
      status: 'error',
      message: `IndexNow error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

// Ping Yandex with sitemap
async function pingYandex(): Promise<SubmissionResult> {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const pingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;

    const response = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'Yandex',
      status: response.ok ? 'success' : 'error',
      message: response.ok
        ? 'Sitemap submitted to Yandex successfully'
        : `Yandex ping failed: ${response.status}`,
    };
  } catch (error) {
    return {
      engine: 'Yandex',
      status: 'error',
      message: `Yandex ping error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { urls: customUrls, submitAll } = body;

    // Determine which URLs to submit
    let urlsToSubmit: string[] = [];

    if (customUrls && Array.isArray(customUrls)) {
      urlsToSubmit = customUrls;
    } else if (submitAll) {
      // Submit all blog articles
      urlsToSubmit = BLOG_ARTICLES.map(slug => `${SITE_URL}/blog/${slug}`);
      // Also add main pages
      urlsToSubmit.push(
        SITE_URL,
        `${SITE_URL}/blog`,
        `${SITE_URL}/generators`,
        `${SITE_URL}/solar`,
        `${SITE_URL}/contact`,
        `${SITE_URL}/diagnostics`,
      );
    } else {
      // Default: just blog articles
      urlsToSubmit = BLOG_ARTICLES.map(slug => `${SITE_URL}/blog/${slug}`);
    }

    // Execute all submissions in parallel
    const results = await Promise.all([
      pingGoogle(),
      pingBing(),
      pingYandex(),
      submitIndexNow(urlsToSubmit),
    ]);

    const successful = results.filter(r => r.status === 'success').length;
    const failed = results.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: true,
      summary: {
        totalEngines: results.length,
        successful,
        failed,
        urlsSubmitted: urlsToSubmit.length,
      },
      results,
      urls: urlsToSubmit,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return list of blog URLs that can be submitted
  const blogUrls = BLOG_ARTICLES.map(slug => `${SITE_URL}/blog/${slug}`);

  return NextResponse.json({
    message: 'SEO URL Submission API',
    usage: 'POST to this endpoint to submit URLs to search engines',
    availableBlogUrls: blogUrls,
    endpoints: {
      submitBlogArticles: 'POST with empty body',
      submitCustomUrls: 'POST with { "urls": ["url1", "url2"] }',
      submitAll: 'POST with { "submitAll": true }',
    },
  });
}
