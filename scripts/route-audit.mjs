#!/usr/bin/env node
/*
 * ROUTE AUDIT — checks the commercially important URLs against the failures
 * that stay invisible to every other guard in this repo.
 *
 * Created 2026-08-31. The existing prebuild guards each check one narrow
 * source-level invariant (pricing routes exist, size routes are guarded, no
 * hard-coded code totals). None of them fetches a rendered page and asks
 * whether it is actually indexable and coherent. Several real defects on this
 * site existed only in the response:
 *
 *   - a page carrying BOTH `noindex` in its metadata and an HTTP header saying
 *     `index, follow` — a contradiction no grep of the source can surface;
 *   - pages returning HTTP 200 with "Page Not Found" in the body (soft 404s),
 *     which look healthy to any status-code check;
 *   - a canonical inherited from a layout, silently pointing dozens of child
 *     pages at a single URL;
 *   - noindex pages left sitting in the sitemap.
 *
 * USAGE
 *   node scripts/route-audit.mjs                    # audit production
 *   node scripts/route-audit.mjs http://localhost:3000
 *
 * Exits non-zero if anything fails, so it can gate a deploy.
 */

const BASE = (process.argv[2] || 'https://www.emersoneims.com').replace(/\/$/, '');

// Googlebot UA deliberately: this site's middleware routes crawlers down a
// separate path, so auditing as a browser would exercise the wrong code.
const UA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

/** The URLs that earn money or carry the SEO. Not an exhaustive crawl. */
const ROUTES = [
  '/', '/generators', '/generators/installation', '/generators/maintenance',
  '/generators/spare-parts', '/services', '/services/cummins-generators',
  '/services/ats-changeover', '/solar', '/repair-centre', '/pricing',
  '/pricing/generator-prices-kenya', '/pricing/ats-changeover-price-kenya',
  '/contact', '/about-us', '/kenya', '/locations', '/faults',
];

/*
 * Soft-404 wording is matched against the h1/title ONLY, never the whole body:
 * a technical article legitimately discussing "page not found" errors was
 * flagged by a body-wide match here before.
 */
const PLACEHOLDER = [/lorem ipsum/i, /coming soon/i, /undefined undefined/i];
const SOFT_404 = [/page not found/i, /^404\b/];

const strip = (h) =>
  h.replace(/<script[\s\S]*?<\/script>/gi, ' ')
   .replace(/<style[\s\S]*?<\/style>/gi, ' ')
   .replace(/<[^>]+>/g, ' ')
   .replace(/\s+/g, ' ')
   .trim();

const one = (re, h) => (re.exec(h) || [])[1] || '';

async function audit(path) {
  const issues = [];
  let res;
  try {
    res = await fetch(BASE + path, { headers: { 'user-agent': UA }, redirect: 'manual' });
  } catch (e) {
    return { path, status: 0, issues: ['request failed: ' + e.message] };
  }

  if (res.status >= 300 && res.status < 400) {
    return { path, status: res.status, issues: ['redirects to ' + (res.headers.get('location') || '?')] };
  }
  if (res.status !== 200) return { path, status: res.status, issues: ['expected 200'] };

  const html = await res.text();
  const body = strip(html);

  const title = one(/<title[^>]*>([^<]*)<\/title>/i, html).trim();
  const desc = one(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i, html).trim();
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  const canonical = one(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i, html);

  // EVERY robots signal, not just the first — this site served two robots meta
  // tags on one page, and reading only the first hid a noindex.
  const metas = [...html.matchAll(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)/gi)]
    .map((m) => m[1].toLowerCase());
  const header = (res.headers.get('x-robots-tag') || '').toLowerCase();

  if (!title) issues.push('empty <title>');
  else if (title.length > 65) issues.push('title ' + title.length + ' chars (over ~60 renders truncated)');
  if (!desc) issues.push('missing meta description');
  else if (desc.length > 165) issues.push('description ' + desc.length + ' chars');

  if (h1s === 0) issues.push('no <h1>');
  if (h1s > 1) issues.push(h1s + ' <h1> elements');

  if (!canonical) issues.push('no canonical');
  else {
    let cp = canonical;
    try { cp = new URL(canonical).pathname; } catch { /* relative canonical */ }
    if (cp !== path && !(path === '/' && cp === '/')) issues.push('canonical points to ' + cp);
  }

  const noindexMeta = metas.some((m) => m.includes('noindex'));
  if (noindexMeta) issues.push('NOINDEX on a commercial route');
  if (noindexMeta && header.includes('index') && !header.includes('noindex')) {
    issues.push('CONFLICT: meta noindex vs X-Robots-Tag "' + header + '"');
  }

  const h1Text = strip(one(/<h1[^>]*>([\s\S]*?)<\/h1>/i, html));
  if (SOFT_404.some((re) => re.test(h1Text)) || SOFT_404.some((re) => re.test(title))) {
    issues.push('SOFT 404 — 200 status but "not found" in h1/title');
  }

  for (const re of PLACEHOLDER) if (re.test(body)) issues.push('placeholder text matched ' + re);
  if (body.length < 1200) issues.push('thin: ' + body.length + ' chars of visible text');

  return { path, status: res.status, issues };
}

console.log('\nROUTE AUDIT — ' + BASE + '\n' + '='.repeat(72));
let failed = 0;
for (const r of ROUTES) {
  const { path, status, issues } = await audit(r);
  if (issues.length) {
    failed++;
    console.log('\nFAIL  ' + status + '  ' + path);
    issues.forEach((i) => console.log('        - ' + i));
  } else {
    console.log('ok    ' + status + '  ' + path);
  }
}

console.log('\n' + '='.repeat(72));
console.log(failed === 0 ? 'All ' + ROUTES.length + ' routes pass.' : failed + ' of ' + ROUTES.length + ' routes have issues.');
process.exit(failed === 0 ? 0 : 1);
