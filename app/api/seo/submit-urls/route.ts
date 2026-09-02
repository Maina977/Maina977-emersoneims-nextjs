import { NextRequest, NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE SEO URL SUBMISSION API
// Submits to 10+ Search Engines: Google, Bing, Yandex, Baidu, DuckDuckGo, etc.
// IndexNow propagates to: Bing, Yandex, Seznam, Naver, Yep
// ═══════════════════════════════════════════════════════════════════════════════

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

// IndexNow API key
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'emersoneims2025indexnow';

// ═══════════════════════════════════════════════════════════════════════════════
// ALL IMPORTANT PAGES TO SUBMIT
// ═══════════════════════════════════════════════════════════════════════════════
const CRITICAL_PAGES = [
  // Homepage
  '',

  // Maintenance Hub - NEW COMPREHENSIVE PAGES
  '/maintenance-hub',
  '/maintenance-hub/solar',
  '/maintenance-hub/generators',
  '/maintenance-hub/general',

  // Generator Oracle
  '/generator-oracle',
  '/generator-oracle/africa',
  '/generator-oracle/tools',
  '/generator-oracle/purchase',

  // Main Service Pages
  '/generators',
  '/solar',
  '/services',
  '/solutions',
  '/contact',
  '/about',
  '/faq',

  // Solutions - All 9 Services
  '/solutions/generators',
  '/solutions/solar',
  '/solutions/ups',
  '/solutions/motor-rewinding',
  '/solutions/borehole-pumps',
  '/solutions/ac',
  '/solutions/controls',
  '/solutions/diesel-automation',
  '/solutions/incinerators',

  // Generator Sub-pages
  '/generators/maintenance',
  '/generators/installation',
  '/generators/rental',
  '/generators/spare-parts',
  '/generators/used',
  '/generators/maintenance-companion',

  // Diagnostics
  '/diagnostics',
  '/diagnostic-suite',
  '/diagnostic-cockpit',
  '/diagnostic-journey',
  '/fault-code-lookup',
  '/troubleshooting',

  // Counties (All 47)
  '/counties',
  '/counties/nairobi',
  '/counties/mombasa',
  '/counties/kisumu',
  '/counties/nakuru',
  '/counties/kiambu',
  '/counties/machakos',
  '/counties/kajiado',
  '/counties/uasin-gishu',
  '/counties/meru',
  '/counties/kilifi',
  '/counties/nyeri',
  '/counties/kakamega',
  '/counties/embu',
  '/counties/kisii',
  '/counties/nyandarua',
  '/counties/laikipia',
  '/counties/trans-nzoia',
  '/counties/bungoma',
  '/counties/kericho',
  '/counties/bomet',
  '/counties/narok',
  '/counties/migori',
  '/counties/homa-bay',
  '/counties/siaya',
  '/counties/vihiga',
  '/counties/nandi',
  '/counties/baringo',
  '/counties/elgeyo-marakwet',
  '/counties/west-pokot',
  '/counties/turkana',
  '/counties/samburu',
  '/counties/isiolo',
  '/counties/marsabit',
  '/counties/mandera',
  '/counties/wajir',
  '/counties/garissa',
  '/counties/tana-river',
  '/counties/lamu',
  '/counties/taita-taveta',
  '/counties/kwale',
  '/counties/tharaka-nithi',
  '/counties/kirinyaga',
  '/counties/muranga',
  '/counties/kitui',
  '/counties/makueni',
  '/counties/nyamira',

  // Other important pages
  '/blog',
  '/careers',
  '/gallery',
  '/brands',
  '/booking',
  '/calculators',
  '/knowledge-base',
  '/innovations',
  '/fabrication',
];

// Blog Articles
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
  method?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH ENGINE SUBMISSION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Every URL the site actually publishes, read from its own sitemap.
 *
 * This used to be a hardcoded CRITICAL_PAGES + BLOG_ARTICLES list of 105 URLs
 * while sitemap.xml carried 2,047. The other ~1,942 pages — the whole /kenya
 * county matrix, /locations, the Repair Centre, the East Africa cities — were
 * never submitted to any engine, so "comprehensive submit" covered 5% of the
 * site. Reading the sitemap means the two can never diverge again.
 */
async function getSitemapUrls(): Promise<string[]> {
  const res = await fetch(`${SITE_URL}/sitemap.xml`, {
    headers: { 'user-agent': 'EmersonEIMS-IndexNow/1.0' },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
  return [...new Set(urls)];
}

/*
 * Google and Bing sitemap PING have both been retired and were verified dead
 * from this machine on 2026-07-31: google.com/ping returns 404 and
 * bing.com/ping returns 410 Gone. The functions that called them were removed
 * rather than left to report a permanent failure on every run. Google has no
 * public submission API — it discovers URLs by crawling the sitemap in
 * robots.txt and via Search Console, which is why the Search Console
 * verification token still matters. Yandex's ping endpoint still answers 200
 * and is kept below.
 */

// 1. Yandex - Sitemap Ping
async function pingYandex(): Promise<SubmissionResult> {
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const pingUrl = `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const response = await fetch(pingUrl, { method: 'GET' });

    return {
      engine: 'Yandex',
      status: response.ok ? 'success' : 'error',
      message: response.ok ? 'Sitemap submitted to Yandex successfully' : `Yandex ping failed: ${response.status}`,
      method: 'Sitemap Ping',
    };
  } catch (error) {
    return { engine: 'Yandex', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'Sitemap Ping' };
  }
}

// 4. IndexNow - Submits to Bing, Yandex, Seznam, Naver, Yep
async function submitIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000), // IndexNow limit
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'IndexNow (Bing, Yandex, Seznam, Naver, Yep)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202 ? `${urls.length} URLs submitted via IndexNow` : `IndexNow failed: ${response.status}`,
      urls: urls.slice(0, 10),
      method: 'IndexNow API',
    };
  } catch (error) {
    return { engine: 'IndexNow', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'IndexNow API' };
  }
}

// 5. Bing IndexNow (Direct)
async function submitBingIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    };

    const response = await fetch('https://www.bing.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'Bing IndexNow (Direct)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202 ? `${urls.length} URLs submitted to Bing IndexNow` : `Failed: ${response.status}`,
      method: 'Bing IndexNow',
    };
  } catch (error) {
    return { engine: 'Bing IndexNow', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'Bing IndexNow' };
  }
}

// 6. Yandex IndexNow (Direct)
async function submitYandexIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    };

    const response = await fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'Yandex IndexNow (Direct)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202 ? `${urls.length} URLs submitted to Yandex IndexNow` : `Failed: ${response.status}`,
      method: 'Yandex IndexNow',
    };
  } catch (error) {
    return { engine: 'Yandex IndexNow', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'Yandex IndexNow' };
  }
}

// 7. Seznam IndexNow (Czech Republic)
async function submitSeznamIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    };

    const response = await fetch('https://search.seznam.cz/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'Seznam (Czech)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202 ? `${urls.length} URLs submitted to Seznam` : `Failed: ${response.status}`,
      method: 'IndexNow',
    };
  } catch (error) {
    return { engine: 'Seznam', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'IndexNow' };
  }
}

// 8. Naver IndexNow (South Korea)
async function submitNaverIndexNow(urls: string[]): Promise<SubmissionResult> {
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    };

    const response = await fetch('https://searchadvisor.naver.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      engine: 'Naver (Korea)',
      status: response.ok || response.status === 202 ? 'success' : 'error',
      message: response.ok || response.status === 202 ? `${urls.length} URLs submitted to Naver` : `Failed: ${response.status}`,
      method: 'IndexNow',
    };
  } catch (error) {
    return { engine: 'Naver', status: 'error', message: `Error: ${error instanceof Error ? error.message : 'Unknown'}`, method: 'IndexNow' };
  }
}

// 9. DuckDuckGo (Uses Bing index, so IndexNow helps)
async function pingDuckDuckGo(): Promise<SubmissionResult> {
  // DuckDuckGo primarily uses Bing's index, so submitting to Bing covers DDG
  return {
    engine: 'DuckDuckGo',
    status: 'success',
    message: 'DuckDuckGo uses Bing index - covered by Bing submission',
    method: 'Via Bing Index',
  };
}

// 10. Ecosia (Uses Bing index)
async function pingEcosia(): Promise<SubmissionResult> {
  return {
    engine: 'Ecosia',
    status: 'success',
    message: 'Ecosia uses Bing index - covered by Bing submission',
    method: 'Via Bing Index',
  };
}

// 11. Yahoo (Uses Bing index)
async function pingYahoo(): Promise<SubmissionResult> {
  return {
    engine: 'Yahoo',
    status: 'success',
    message: 'Yahoo uses Bing index - covered by Bing submission',
    method: 'Via Bing Index',
  };
}

// 12. Qwant (European search engine)
async function pingQwant(): Promise<SubmissionResult> {
  // Qwant uses Bing results partially
  return {
    engine: 'Qwant (Europe)',
    status: 'success',
    message: 'Qwant partially uses Bing index - covered by Bing submission',
    method: 'Via Bing Index',
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN API HANDLERS
// ═══════════════════════════════════════════════════════════════════════════════

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { urls: customUrls, submitAll, comprehensiveSubmit } = body;

    // Build URL list
    let urlsToSubmit: string[] = [];

    if (comprehensiveSubmit || submitAll) {
      // Every published URL, read from sitemap.xml — see getSitemapUrls().
      urlsToSubmit = await getSitemapUrls();
    } else if (customUrls && Array.isArray(customUrls)) {
      urlsToSubmit = customUrls;
    } else {
      // Default: critical pages only
      urlsToSubmit = CRITICAL_PAGES.map(page => `${SITE_URL}${page}`);
    }

    // Execute all submissions in parallel
    const results = await Promise.all([
      // Sitemap ping (1 — Google's and Bing's are retired, see above)
      pingYandex(),

      // IndexNow Submissions (5)
      submitIndexNow(urlsToSubmit),
      submitBingIndexNow(urlsToSubmit),
      submitYandexIndexNow(urlsToSubmit),
      submitSeznamIndexNow(urlsToSubmit),
      submitNaverIndexNow(urlsToSubmit),

      // Engines using Bing index (4)
      pingDuckDuckGo(),
      pingEcosia(),
      pingYahoo(),
      pingQwant(),
    ]);

    /*
     * DuckDuckGo, Ecosia, Yahoo and Qwant make no network call — they read from
     * Bing's index, so their "result" is a note, not a submission. Counting them
     * as successes inflated the score by four every run. They are separated out
     * here so `submitted` reflects requests that actually went somewhere.
     */
    const DERIVED = new Set(['DuckDuckGo', 'Ecosia', 'Yahoo', 'Qwant (Europe)']);
    const real = results.filter(r => !DERIVED.has(r.engine));
    const successful = real.filter(r => r.status === 'success').length;
    const failed = real.filter(r => r.status === 'error').length;

    return NextResponse.json({
      success: failed === 0,
      summary: {
        endpointsCalled: real.length,
        successful,
        failed,
        urlsSubmitted: urlsToSubmit.length,
        urlSource: comprehensiveSubmit || submitAll ? 'sitemap.xml' : 'request',
        coveredWithoutSubmission: [...DERIVED],
      },
      results,
      totalPages: urlsToSubmit.length,
      sampleUrls: urlsToSubmit.slice(0, 20),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  let totalPagesReady = 0;
  let samplePages: string[] = [];
  let sitemapError: string | null = null;

  try {
    const all = await getSitemapUrls();
    totalPagesReady = all.length;
    samplePages = all.slice(0, 30);
  } catch (e) {
    sitemapError = e instanceof Error ? e.message : 'Unknown error';
  }

  return NextResponse.json({
    message: 'SEO URL submission API',
    urlSource: 'sitemap.xml',
    totalPagesReady,
    ...(sitemapError ? { sitemapError } : {}),
    /*
     * Stated honestly. Google is NOT in this list: its sitemap ping endpoint was
     * retired (verified 404 on 2026-07-31) and it has no public submission API,
     * so nothing here can push a URL to Google. Google reaches these pages via
     * the sitemap referenced in robots.txt and via Search Console.
     */
    engines: {
      submittedTo: ['Bing', 'Yandex', 'Seznam', 'Naver', 'Yep'],
      coveredByBingIndex: ['DuckDuckGo', 'Ecosia', 'Yahoo', 'Qwant', 'AOL'],
      notReachableFromHere: ['Google'],
    },
    usage: {
      submitAll: 'POST with { "comprehensiveSubmit": true } — submits every sitemap URL',
      submitCustom: 'POST with { "urls": ["url1", "url2"] }',
    },
    samplePages,
  });
}
