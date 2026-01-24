#!/usr/bin/env npx ts-node
/**
 * Search Engine Submission Script
 * Run: npx ts-node scripts/submit-to-search-engines.ts
 * Or after build: node scripts/submit-to-search-engines.js
 */

const SITE_URL = 'https://www.emersoneims.com';
const INDEXNOW_KEY = 'emersoneims2025indexnow';

// All blog article slugs
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

async function pingGoogle() {
  console.log('\n📍 Pinging Google...');
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    console.log(`   ✅ Google: ${response.ok ? 'Success' : 'Failed'} (${response.status})`);
    return response.ok;
  } catch (error) {
    console.log(`   ❌ Google: Error - ${error}`);
    return false;
  }
}

async function pingBing() {
  console.log('📍 Pinging Bing...');
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    console.log(`   ✅ Bing: ${response.ok ? 'Success' : 'Failed'} (${response.status})`);
    return response.ok;
  } catch (error) {
    console.log(`   ❌ Bing: Error - ${error}`);
    return false;
  }
}

async function pingYandex() {
  console.log('📍 Pinging Yandex...');
  try {
    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const response = await fetch(
      `https://webmaster.yandex.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`
    );
    console.log(`   ✅ Yandex: ${response.ok ? 'Success' : 'Failed'} (${response.status})`);
    return response.ok;
  } catch (error) {
    console.log(`   ❌ Yandex: Error - ${error}`);
    return false;
  }
}

async function submitIndexNow(urls: string[]) {
  console.log(`📍 Submitting ${urls.length} URLs via IndexNow...`);
  try {
    const payload = {
      host: new URL(SITE_URL).host,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    };

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const success = response.ok || response.status === 202;
    console.log(`   ${success ? '✅' : '❌'} IndexNow: ${response.status} (${response.statusText})`);

    if (success) {
      console.log('   📢 URLs propagated to: Bing, Yandex, Seznam.cz, Naver');
    }

    return success;
  } catch (error) {
    console.log(`   ❌ IndexNow: Error - ${error}`);
    return false;
  }
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('🚀 EMERSON EIMS - SEARCH ENGINE SUBMISSION');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Site: ${SITE_URL}`);
  console.log(`Articles: ${BLOG_ARTICLES.length}`);
  console.log('═══════════════════════════════════════════════════════════════');

  // Generate full URLs
  const blogUrls = BLOG_ARTICLES.map(slug => `${SITE_URL}/blog/${slug}`);
  const allUrls = [
    SITE_URL,
    `${SITE_URL}/blog`,
    `${SITE_URL}/generators`,
    `${SITE_URL}/solar`,
    `${SITE_URL}/contact`,
    `${SITE_URL}/diagnostics`,
    `${SITE_URL}/sitemap.xml`,
    ...blogUrls,
  ];

  console.log('\n📄 URLs to submit:');
  allUrls.forEach(url => console.log(`   - ${url}`));

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📡 SUBMITTING TO SEARCH ENGINES');
  console.log('═══════════════════════════════════════════════════════════════');

  // Run submissions
  const results = await Promise.all([
    pingGoogle(),
    pingBing(),
    pingYandex(),
    submitIndexNow(allUrls),
  ]);

  const successful = results.filter(Boolean).length;
  const total = results.length;

  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`📊 RESULTS: ${successful}/${total} successful`);
  console.log('═══════════════════════════════════════════════════════════════');

  console.log('\n📋 MANUAL SUBMISSION LINKS:');
  console.log('   Google Search Console: https://search.google.com/search-console');
  console.log('   Bing Webmaster Tools:  https://www.bing.com/webmasters');
  console.log('   Yandex Webmaster:      https://webmaster.yandex.com');
  console.log('   IndexNow Dashboard:    https://www.indexnow.org/');

  console.log('\n✅ Done! Search engines have been notified.');
  console.log('   Note: It may take 24-48 hours for URLs to be crawled and indexed.\n');
}

main().catch(console.error);
