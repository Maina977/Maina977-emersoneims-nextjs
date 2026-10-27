/**
 * Before (live) vs after (local build) for the pages this change touched:
 * title, meta description, canonical path, robots, h1 count and JSON-LD.
 * Live is fetched gently: one request at a time, 2 s apart (gate rule 10).
 *   node scripts/verify/seo-compare.cjs
 * Exit 1 if a page loses its canonical/indexability, gains extra h1s, or
 * loses or changes the @type set of its JSON-LD. Text changes are printed
 * for review (expected where copy was corrected).
 */
const LIVE = 'https://www.emersoneims.com';
const LOCAL = process.env.VERIFY_BASE || 'http://localhost:3111';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';
const PAGES = [
  '/solar', '/faults', '/faults/spn-190', '/faults/spn-100', '/faults/spn-102', '/faults/spn-110',
  '/innovations', '/aquascan-pro-v3', '/aquascan-pro-v3/methodology', '/generator-oracle',
  '/solar-design-studio', '/solar-genius-pro', '/',
];

const pick = (re, h) => (re.exec(h) || [])[1] || null;
function facts(html) {
  const ld = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const types = new Set();
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk);
    if (o && typeof o === 'object') { if (o['@type']) [].concat(o['@type']).forEach((t) => types.add(t)); Object.values(o).forEach(walk); }
  };
  let ldErrors = 0;
  for (const s of ld) { try { walk(JSON.parse(s)); } catch { ldErrors++; } }
  const canon = pick(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i, html);
  return {
    title: pick(/<title[^>]*>([^<]*)<\/title>/i, html),
    description: pick(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i, html),
    canonical: canon ? new URL(canon, LIVE).pathname.replace(/\/$/, '') || '/' : null,
    robots: pick(/<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i, html),
    h1: (html.match(/<h1[\s>]/gi) || []).length,
    ldTypes: [...types].sort().join(','),
    ldErrors,
  };
}
const get = async (url) => {
  const r = await fetch(url, { headers: { 'user-agent': UA }, redirect: 'manual' });
  return { status: r.status, html: r.status === 200 ? await r.text() : '' };
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  let bad = 0;
  for (const p of PAGES) {
    const live = await get(LIVE + p);
    await sleep(2000);
    const local = await get(LOCAL + p);
    const a = facts(live.html), b = facts(local.html);
    const problems = [];
    if (local.status !== 200) problems.push(`local status ${local.status}`);
    if (live.status === 200 && b.canonical !== a.canonical) problems.push(`canonical ${a.canonical} -> ${b.canonical}`);
    if (b.canonical && b.canonical !== (p.replace(/\/$/, '') || '/')) problems.push(`canonical not self: ${b.canonical}`);
    if (/noindex/i.test(b.robots || '') && !/noindex/i.test(a.robots || '')) problems.push('became noindex');
    if (b.h1 !== 1) problems.push(`h1 count ${b.h1}`);
    if (b.ldErrors) problems.push(`${b.ldErrors} invalid JSON-LD block(s)`);
    // Reviewed, intended removal (rounds 4-5): the Generator Oracle
    // SoftwareApplication block was on every page, and /solar carried an
    // invented "10 AI engines" SoftwareApplication. It must stay on /generator-oracle.
    const INTENDED_REMOVED = new Set(['SoftwareApplication']);
    if (live.status === 200 && a.ldTypes !== b.ldTypes) {
      const before = new Set(a.ldTypes.split(',').filter(Boolean)), after = new Set(b.ldTypes.split(',').filter(Boolean));
      const removed = [...before].filter((t) => !after.has(t) && !(INTENDED_REMOVED.has(t) && p !== '/generator-oracle'));
      const added = [...after].filter((t) => !before.has(t));
      if (removed.length || added.length) problems.push(`JSON-LD types removed [${removed}] added [${added}]`);
      else console.log(`     JSON-LD: intended removal of ${[...before].filter((t) => !after.has(t)).join(',')}`);
    }
    // Lengths fail only when this deploy made them worse; older ones are listed.
    const tl = (x) => (x ? x.replace(/&amp;/g, '&').length : 0);
    if (!b.title || (tl(b.title) > 70 && tl(b.title) > tl(a.title))) problems.push(`title length ${tl(b.title)} (live ${tl(a.title)})`);
    else if (tl(b.title) > 70) console.log(`     note: title ${tl(b.title)} chars, unchanged problem from live`);
    if (!b.description || (b.description.length > 170 && b.description.length > (a.description || '').length)) problems.push(`description length ${b.description ? b.description.length : 0} (live ${(a.description || '').length})`);
    else if (b.description.length > 170) console.log(`     note: description ${b.description.length} chars, not longer than live (${(a.description || '').length})`);
    const changes = [];
    if (a.title !== b.title) changes.push(`title: "${a.title}" -> "${b.title}"`);
    if (a.description !== b.description) changes.push(`description: "${(a.description || '').slice(0, 80)}…" -> "${(b.description || '').slice(0, 80)}…"`);
    if (problems.length) { bad++; console.log(`FAIL ${p}: ${problems.join('; ')}`); }
    else console.log(`ok   ${p}: live ${live.status}, local 200, canonical self, 1 h1, JSON-LD [${b.ldTypes}]`);
    for (const c of changes) console.log(`     changed ${c}`);
    await sleep(2000);
  }
  console.log(bad ? `FAILED: ${bad} page(s)` : 'SEO COMPARE PASSED');
  process.exit(bad ? 1 : 0);
})();
