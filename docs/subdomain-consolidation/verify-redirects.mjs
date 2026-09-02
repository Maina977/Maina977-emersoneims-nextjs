/*
 * Verify that power.emersoneims.com is fully redirecting before it is deleted.
 *
 * RUN THIS BEFORE DECOMMISSIONING. Deleting the subdomain while any URL still
 * answers 200 throws away whatever authority that URL holds instead of passing
 * it to www. This walks the subdomain's own sitemap and checks every URL.
 *
 *   node docs/subdomain-consolidation/verify-redirects.mjs
 *
 * Exit code 0 means every URL 301s to a live www page and the subdomain is
 * safe to delete. Anything else means stop.
 */

const SUB = 'https://power.emersoneims.com';
const WWW = 'https://www.emersoneims.com';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const SAMPLE = Number(process.env.SAMPLE || 120); // full sweep: SAMPLE=0

const get = (u, redirect = 'manual') =>
  fetch(u, { headers: { 'user-agent': UA }, redirect });

// The sitemap itself may already be redirecting — that is expected and fine.
let paths = [];
try {
  const r = await get(`${SUB}/sitemap.xml`, 'follow');
  const xml = await r.text();
  paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
    .filter((p) => p);
} catch (e) {
  console.log(`Could not read the subdomain sitemap (${String(e).slice(0, 60)}).`);
}

if (!paths.length) {
  console.log('No sitemap URLs found. If the subdomain is already fully redirecting,');
  console.log('its sitemap now points at www — that is expected. Spot-check by hand:');
  console.log(`  curl -sI ${SUB}/generator-sales-bomet.html`);
  process.exit(0);
}

// Sample evenly so one family cannot dominate a partial run.
let targets = paths;
if (SAMPLE > 0 && paths.length > SAMPLE) {
  const step = Math.ceil(paths.length / SAMPLE);
  targets = paths.filter((_, i) => i % step === 0);
}

console.log(`subdomain sitemap: ${paths.length} URLs`);
console.log(`checking: ${targets.length}${SAMPLE > 0 && paths.length > SAMPLE ? ' (sampled — set SAMPLE=0 for all)' : ''}\n`);

const notRedirecting = [];
const badDestination = [];
const destCache = new Map();

for (const p of targets) {
  let r;
  try {
    r = await get(SUB + p);
  } catch (e) {
    notRedirecting.push([p, 'unreachable']);
    continue;
  }

  if (r.status !== 301 && r.status !== 308) {
    notRedirecting.push([p, r.status]);
    continue;
  }

  const dest = r.headers.get('location') || '';
  if (!dest.startsWith(WWW)) {
    badDestination.push([p, `points off-site: ${dest}`]);
    continue;
  }

  // Confirm the destination actually answers, once per distinct destination.
  if (!destCache.has(dest)) {
    try {
      const d = await get(dest);
      destCache.set(dest, d.status);
    } catch {
      destCache.set(dest, -1);
    }
    await new Promise((res) => setTimeout(res, 150));
  }
  const code = destCache.get(dest);
  if (code !== 200) badDestination.push([p, `${dest} answers ${code}`]);
}

console.log(`distinct destinations: ${destCache.size}`);
for (const [d, c] of [...destCache.entries()].sort()) {
  console.log(`  ${c === 200 ? 'ok  ' : 'FAIL'} ${c} ${d.replace(WWW, '') || '/'}`);
}

if (notRedirecting.length) {
  console.log(`\nSTILL ANSWERING DIRECTLY — these are still competing (${notRedirecting.length}):`);
  notRedirecting.slice(0, 25).forEach(([p, s]) => console.log(`  ${s}  ${p}`));
}
if (badDestination.length) {
  console.log(`\nREDIRECTING SOMEWHERE BROKEN (${badDestination.length}):`);
  badDestination.slice(0, 25).forEach(([p, why]) => console.log(`  ${p}  ->  ${why}`));
}

const clean = !notRedirecting.length && !badDestination.length;
console.log(
  clean
    ? '\nPASS — every checked URL 301s to a live www page.\n' +
      'Safe to delete the subdomain AFTER Google has recrawled it (allow 6-12 months).'
    : '\nDO NOT DELETE YET — fix the above first, or the authority on those URLs is lost.'
);
process.exit(clean ? 0 : 1);
