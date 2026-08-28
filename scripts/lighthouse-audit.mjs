/*
 * LIGHTHOUSE AUDIT — the site's scores, measured rather than asserted.
 *
 * WHY THIS EXISTS
 * Design and SEO reviews on this project have been graded by opinion, including
 * mine. An opinion is not something you can hold anyone to and not something
 * you can watch improve. This runs Google's own Lighthouse engine — the same
 * engine behind PageSpeed Insights and behind essentially every third-party
 * "website rating" service — against real, live URLs, and prints four scores
 * out of 100 per page plus the audits that cost the points.
 *
 * WHY NOT THE PAGESPEED API
 * The keyless PSI endpoint has a per-day quota that this project exhausts
 * quickly. Running the engine locally is unlimited, repeatable, and produces
 * the same category scores.
 *
 * WHY NOTHING IS ADDED TO package.json
 * Lighthouse and its Chrome tooling are large. Adding them as a devDependency
 * would put them into the Vercel build, which installs devDependencies — for a
 * tool that never runs in production. So this shells out to `npx --yes
 * lighthouse`. The first run downloads it; later runs are cached. The
 * production build is untouched.
 *
 * USAGE
 *   node scripts/lighthouse-audit.mjs                  # key commercial pages, mobile
 *   node scripts/lighthouse-audit.mjs --desktop        # desktop profile
 *   node scripts/lighthouse-audit.mjs --url /pricing   # one path
 *   node scripts/lighthouse-audit.mjs --all            # every page in PAGES
 *   node scripts/lighthouse-audit.mjs --min 90         # exit 1 if any score < 90
 *
 * READING THE OUTPUT
 * Performance is the volatile one — it moves with network conditions and with
 * whatever else this machine is doing, so treat a single run as indicative and
 * a repeated run as real. Accessibility, Best Practices and SEO are close to
 * deterministic: if those move, something in the code moved them.
 *
 * MOBILE IS THE DEFAULT ON PURPOSE. Google indexes this site mobile-first, and
 * the mobile profile applies a 4x CPU slowdown and a throttled connection. It
 * is the honest number. Desktop will always look better and matters less.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const ORIGIN = process.env.AUDIT_ORIGIN || 'https://www.emersoneims.com';

/**
 * The pages that earn money, plus the homepage. Ordered by commercial value:
 * if a run is cut short, the important numbers have already printed.
 */
const PAGES = [
  ['/', 'Homepage'],
  ['/generators', 'Generators category'],
  ['/pricing/generator-prices-kenya', 'Generator prices guide'],
  ['/repair-centre', 'Repair centre'],
  ['/solar', 'Solar'],
  ['/services/ups-systems', 'UPS systems'],
  ['/contact', 'Contact'],
  ['/generators/sizes/100-kva', 'Product page (100 kVA)'],
  ['/case-studies', 'Case studies'],
  ['/maintenance-hub', 'Maintenance'],
];

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const valueOf = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const desktop = has('--desktop');
const minScore = Number(valueOf('--min', '0'));
const singleUrl = valueOf('--url', null);

const targets = singleUrl
  ? [[singleUrl, singleUrl]]
  : has('--all')
    ? PAGES
    : PAGES.slice(0, 6);

const outDir = path.join(os.tmpdir(), 'eims-lighthouse');
fs.mkdirSync(outDir, { recursive: true });

/** Run Lighthouse once and return the parsed report, or null if it failed. */
function audit(url) {
  const outFile = path.join(outDir, `lh-${Date.now()}.json`);
  const args = [
    '--yes',
    'lighthouse',
    url,
    '--output=json',
    `--output-path=${outFile}`,
    '--quiet',
    '--chrome-flags=--headless=new --no-sandbox --disable-gpu',
    `--only-categories=${CATEGORIES.join(',')}`,
    // The site's middleware refuses obvious headless user-agents, so Lighthouse
    // must present itself as a real Chrome or every page audits as a 403.
    '--form-factor=' + (desktop ? 'desktop' : 'mobile'),
  ];
  if (desktop) args.push('--preset=desktop');

  try {
    execFileSync('npx', args, {
      stdio: ['ignore', 'ignore', 'pipe'],
      timeout: 240000,
      shell: process.platform === 'win32',
    });
    const report = JSON.parse(fs.readFileSync(outFile, 'utf8'));
    fs.unlinkSync(outFile);
    return report;
  } catch (err) {
    const stderr = err.stderr ? String(err.stderr).slice(-300) : err.message;
    console.log(`    ! lighthouse failed: ${stderr.replace(/\s+/g, ' ').trim()}`);
    try { fs.unlinkSync(outFile); } catch { /* nothing to clean up */ }
    return null;
  }
}

const pad = (s, n) => String(s).padEnd(n);
const band = (n) => (n >= 90 ? 'green' : n >= 50 ? 'amber' : 'RED');

console.log(`\nLighthouse — ${desktop ? 'DESKTOP' : 'MOBILE'} — ${ORIGIN}`);
console.log(`${targets.length} page(s). Mobile applies 4x CPU throttling; that is the number Google indexes on.\n`);
console.log(pad('PAGE', 30) + CATEGORIES.map((c) => pad(c.slice(0, 5).toUpperCase(), 7)).join('') + 'LCP      CLS');
console.log('-'.repeat(84));

const rows = [];
let worst = 100;

for (const [pathname, label] of targets) {
  const url = pathname.startsWith('http') ? pathname : ORIGIN + pathname;
  const report = audit(url);
  if (!report) { console.log(pad(label, 30) + 'failed'); continue; }

  const cats = report.categories;
  const scores = CATEGORIES.map((c) => (cats[c] ? Math.round(cats[c].score * 100) : 0));
  worst = Math.min(worst, ...scores);

  const lcp = report.audits['largest-contentful-paint']?.displayValue ?? '-';
  const cls = report.audits['cumulative-layout-shift']?.displayValue ?? '-';

  console.log(pad(label, 30) + scores.map((s) => pad(s, 7)).join('') + pad(lcp, 9) + cls);

  rows.push({ label, url, scores, report });
}

console.log('-'.repeat(84));

// Per-page detail: what actually cost the points, worst first.
for (const { label, scores, report } of rows) {
  const failing = Object.values(report.audits)
    .filter((a) => a.score !== null && a.score < 0.9 && a.title && a.scoreDisplayMode !== 'notApplicable')
    .sort((a, b) => a.score - b.score)
    .slice(0, 8);
  if (failing.length === 0) continue;
  console.log(`\n${label}  [${scores.join(' / ')}]  ${band(Math.min(...scores))}`);
  for (const a of failing) {
    const cost = a.details?.overallSavingsMs ? `  (~${Math.round(a.details.overallSavingsMs)}ms)` : '';
    console.log(`   ${pad(Math.round(a.score * 100), 4)} ${a.title.slice(0, 68)}${cost}`);
  }
}

console.log('');
if (minScore > 0 && worst < minScore) {
  console.log(`FAIL — lowest score ${worst} is below the --min ${minScore} threshold.`);
  process.exit(1);
}
console.log(`Lowest score across all pages and categories: ${worst}`);
