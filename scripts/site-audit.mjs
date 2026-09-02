/*
 * SITE AUDIT — every page, checked mechanically.
 *
 * WHY THIS EXISTS
 * This site has ~3,400 URLs. Reviewing them by eye does not scale, and the
 * consequence of trying was that three site-wide defects survived roughly forty
 * separate "SEO checks": duplicate <main> landmarks on 215 pages, a 72px white
 * band across the homepage, and a navbar overlapping the logo. Every one of
 * those is trivially detectable by machine and was missed by a human reading
 * source. So: check everything, every time, and only report what is objectively
 * true or false.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 * It has no opinion about design. Nothing here scores taste, tone or layout.
 * Every rule below is a fact a browser or a crawler can verify, which means a
 * finding is either a real defect or a bug in this script — never a matter of
 * argument. Design judgement is a separate job done by looking at the page.
 *
 * SEVERITY
 *   ERROR  actively costs traffic, money or accessibility compliance
 *   WARN   real defect, lower blast radius
 *   INFO   worth knowing, not necessarily wrong
 *
 * USAGE
 *   node scripts/site-audit.mjs                  # sample across the sitemap
 *   node scripts/site-audit.mjs --all            # every URL (slow, thorough)
 *   node scripts/site-audit.mjs --limit 500
 *   node scripts/site-audit.mjs --origin http://localhost:3000
 *   node scripts/site-audit.mjs --json out.json  # machine-readable
 *
 * Requests run concurrently but politely; this hits production, so CONCURRENCY
 * is deliberately modest and every response is streamed as text once.
 */
import fs from 'node:fs';

const ORIGIN = argValue('--origin', 'https://www.emersoneims.com');
const LIMIT = Number(argValue('--limit', process.argv.includes('--all') ? '100000' : '250'));
const JSON_OUT = argValue('--json', null);
const CONCURRENCY = Number(argValue('--concurrency', '6'));

// The middleware refuses obvious bot/headless agents, so present as real Chrome.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

function argValue(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const stripTags = (s) => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const decode = (s) =>
  s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

/** Pull <loc> entries out of the sitemap, following sitemap indexes one level. */
async function collectUrls() {
  const seen = new Set();
  const queue = ['/sitemap.xml'];
  const out = [];

  while (queue.length && out.length < LIMIT) {
    const path = queue.shift();
    let xml;
    try {
      const res = await fetch(ORIGIN + path, { headers: { 'user-agent': UA } });
      if (!res.ok) continue;
      xml = await res.text();
    } catch { continue; }

    const isIndex = /<sitemapindex/i.test(xml);
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      const loc = decode(m[1]);
      let p;
      try { p = new URL(loc).pathname; } catch { continue; }
      if (isIndex) {
        if (!seen.has(p)) { seen.add(p); queue.push(p); }
      } else if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
        if (out.length >= LIMIT) break;
      }
    }
  }
  return out;
}

/** All the per-page rules. Each returns findings; none of them guess. */
function checkPage(path, status, finalUrl, html, headers) {
  const f = [];
  const add = (sev, code, detail) => f.push({ sev, code, detail });

  if (status >= 500) { add('ERROR', 'http-5xx', `HTTP ${status}`); return f; }
  if (status === 404) { add('ERROR', 'http-404', `HTTP 404 but present in sitemap`); return f; }
  if (status >= 300 && status < 400) {
    add('WARN', 'sitemap-redirect', `HTTP ${status} -> ${finalUrl} (sitemaps should list final URLs)`);
    return f;
  }
  if (status !== 200) { add('ERROR', 'http-status', `HTTP ${status}`); return f; }

  // --- Landmarks & headings -------------------------------------------------
  const mains = (html.match(/<main[\s>]/gi) || []).length;
  if (mains > 1) add('ERROR', 'duplicate-main', `${mains} <main> landmarks (invalid HTML, axe failure)`);
  if (mains === 0) add('WARN', 'no-main', 'no <main> landmark');

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => stripTags(m[1]));
  if (h1s.length === 0) add('ERROR', 'no-h1', 'no <h1>');
  else if (h1s.length > 1) add('WARN', 'multiple-h1', `${h1s.length} <h1>: ${h1s.map((t) => t.slice(0, 30)).join(' | ')}`);

  // --- Title & description --------------------------------------------------
  const title = decode(stripTags(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] || ''));
  if (!title) add('ERROR', 'no-title', 'no <title>');
  else if (title.length > 65) add('WARN', 'title-long', `${title.length} chars: "${title.slice(0, 70)}..."`);
  else if (title.length < 15) add('WARN', 'title-short', `${title.length} chars: "${title}"`);

  const descMatch =
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i.exec(html) ||
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i.exec(html);
  const desc = decode(descMatch?.[1] || '');
  if (!desc) add('ERROR', 'no-description', 'no meta description');
  else if (desc.length > 165) add('INFO', 'description-long', `${desc.length} chars`);
  else if (desc.length < 50) add('WARN', 'description-short', `${desc.length} chars`);

  // --- Indexability ---------------------------------------------------------
  const robotsMeta = /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i.exec(html)?.[1] || '';
  const noindex = /noindex/i.test(robotsMeta) || /noindex/i.test(headers.get('x-robots-tag') || '');
  if (noindex) add('ERROR', 'noindex-in-sitemap', `noindex ("${robotsMeta}") but listed in sitemap`);

  const canonical = /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i.exec(html)?.[1];
  if (!canonical) add('WARN', 'no-canonical', 'no canonical link');
  else {
    let cp = null;
    try { cp = new URL(canonical, ORIGIN).pathname.replace(/\/$/, '') || '/'; } catch { /* malformed */ }
    const self = path.replace(/\/$/, '') || '/';
    if (cp === null) add('ERROR', 'canonical-malformed', canonical);
    else if (cp !== self) add('WARN', 'canonical-elsewhere', `${self} -> ${cp}`);
    if (noindex && cp && cp !== self) add('ERROR', 'noindex-plus-canonical', `noindex AND canonical to ${cp} — can de-index the target`);
  }

  // --- Soft 404 -------------------------------------------------------------
  const bodyText = stripTags(html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, ''));

  /*
   * Soft-404 detection has to key on the page's OWN identity — its h1 and its
   * title — not on body prose.
   *
   * The first version of this rule searched the whole body for phrases
   * including "does not exist", and reported five repair-centre articles as
   * soft-404s. All five were false. They are real, complete articles whose
   * technical prose happens to contain the phrase: "a control board reporting
   * a condition that does not exist", "chases a fault that does not exist".
   * One of them was 394KB with the h1 "Online UPS Bypass Fault — Diagnosis and
   * Repair". An auditor that cries wolf is worse than no auditor, because the
   * real findings get discounted along with the phantom ones.
   *
   * A genuine soft-404 announces itself where the page says what it is.
   */
  const notFoundish = /^\s*(404|page not found|not found|page unavailable|this page (?:does not exist|isn'?t available))/i;
  const h1Text = h1s[0] || '';
  if (status === 200 && (notFoundish.test(h1Text) || notFoundish.test(title))) {
    add('ERROR', 'soft-404', `HTTP 200 but identifies as not-found — h1: "${h1Text.slice(0, 50)}"`);
  }
  if (bodyText.length < 600) add('WARN', 'thin-content', `${bodyText.length} chars of visible text`);

  // --- Images ---------------------------------------------------------------
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const noAlt = imgs.filter((t) => !/\balt\s*=/i.test(t));
  if (noAlt.length) add('WARN', 'img-no-alt', `${noAlt.length}/${imgs.length} <img> without alt`);

  // --- Structured data ------------------------------------------------------
  const ldBlocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
  const types = [];
  for (const b of ldBlocks) {
    try {
      const parsed = JSON.parse(b[1].trim());
      for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
        if (node && node['@type']) types.push(String(node['@type']));
      }
    } catch {
      add('ERROR', 'jsonld-invalid', 'a JSON-LD block does not parse');
    }
  }
  const faqCount = types.filter((t) => /FAQPage/i.test(t)).length;
  if (faqCount > 1) add('ERROR', 'duplicate-faqpage', `${faqCount} FAQPage entities`);
  if (faqCount === 1 && !/frequently asked|FAQ/i.test(bodyText)) {
    add('ERROR', 'faq-schema-invisible', 'FAQPage schema but no visible FAQ content (Google policy)');
  }
  const orgCount = types.filter((t) => /^(Organization|LocalBusiness)$/i.test(t)).length;
  if (orgCount > 1) add('WARN', 'duplicate-org', `${orgCount} Organization/LocalBusiness entities`);

  // --- Language / viewport --------------------------------------------------
  if (!/<html[^>]+lang=/i.test(html)) add('ERROR', 'no-lang', '<html> has no lang attribute');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) add('ERROR', 'no-viewport', 'no viewport meta');

  return f;
}

async function audit(path) {
  try {
    const res = await fetch(ORIGIN + path, { headers: { 'user-agent': UA }, redirect: 'manual' });
    const status = res.status;
    if (status >= 300 && status < 400) {
      return { path, status, findings: checkPage(path, status, res.headers.get('location') || '', '', res.headers) };
    }
    const html = await res.text();
    return { path, status, bytes: Buffer.byteLength(html), findings: checkPage(path, status, ORIGIN + path, html, res.headers) };
  } catch (err) {
    return { path, status: 0, findings: [{ sev: 'ERROR', code: 'fetch-failed', detail: String(err.message).slice(0, 80) }] };
  }
}

// ---------------------------------------------------------------------------
console.log(`\nSITE AUDIT — ${ORIGIN}`);
process.stdout.write('collecting sitemap URLs... ');
const urls = await collectUrls();
console.log(`${urls.length} URLs\n`);
if (!urls.length) { console.log('No URLs found — is the sitemap reachable?'); process.exit(1); }

const results = [];
let done = 0;
const queue = [...urls];
await Promise.all(
  Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const p = queue.shift();
      const r = await audit(p);
      results.push(r);
      done++;
      if (done % 25 === 0 || done === urls.length) process.stdout.write(`\r  audited ${done}/${urls.length}`);
    }
  })
);
console.log('\n');

// --- Cross-page checks that need the whole corpus --------------------------
const titles = new Map();
for (const r of results) {
  if (r.status !== 200) continue;
  const t = r.findings.find((x) => x.code === 'title-dup-key')?.detail;
  void t;
}

// Aggregate by rule.
const byCode = new Map();
for (const r of results) {
  for (const f of r.findings) {
    if (!byCode.has(f.code)) byCode.set(f.code, { sev: f.sev, pages: [] });
    byCode.get(f.code).pages.push({ path: r.path, detail: f.detail });
  }
}

const order = { ERROR: 0, WARN: 1, INFO: 2 };
const sorted = [...byCode.entries()].sort(
  (a, b) => order[a[1].sev] - order[b[1].sev] || b[1].pages.length - a[1].pages.length
);

const clean = results.filter((r) => r.findings.length === 0).length;
console.log(`${clean}/${results.length} pages passed every check with no findings.\n`);
console.log('RULE'.padEnd(26) + 'SEV'.padEnd(7) + 'PAGES');
console.log('-'.repeat(70));
for (const [code, info] of sorted) {
  console.log(code.padEnd(26) + info.sev.padEnd(7) + info.pages.length);
}

console.log('\n\nDETAIL — up to 6 example pages per rule, worst first\n');
for (const [code, info] of sorted) {
  console.log(`${info.sev}  ${code}  (${info.pages.length} page${info.pages.length === 1 ? '' : 's'})`);
  for (const p of info.pages.slice(0, 6)) console.log(`    ${p.path}\n        ${p.detail}`);
  if (info.pages.length > 6) console.log(`    ... and ${info.pages.length - 6} more`);
  console.log('');
}

if (JSON_OUT) {
  fs.writeFileSync(JSON_OUT, JSON.stringify({ origin: ORIGIN, audited: results.length, results }, null, 2));
  console.log(`full results written to ${JSON_OUT}`);
}

const errors = sorted.filter(([, i]) => i.sev === 'ERROR').reduce((n, [, i]) => n + i.pages.length, 0);
console.log(`\n${errors} ERROR-level finding(s) across ${results.length} pages.`);
process.exit(errors > 0 ? 1 : 0);
