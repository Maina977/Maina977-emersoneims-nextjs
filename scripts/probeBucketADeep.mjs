// Deeper UX/structure probe for live emersoneims.com pages on commit 6d0139d.
const BASE = process.env.BASE_URL || 'https://emersoneims.com';

const ROUTES = [
  '/',
  '/resources',
  '/resources/solar-ups-hub',
  '/services/hospital-incinerators',
  '/generator-oracle',
];

// Generic checks across every route.
const COMMON = [
  { label: 'B2B strip mounted',         re: /EmersonEIMS serves/ },
  { label: 'B2B strip role=region',     re: /aria-label="B2B commercial positioning"/ },
  { label: 'Footer email',              re: /info@emersoneims\.com/ },
  { label: 'Footer phone +254768860665',re: /\+254[\s\u00a0]?768[\s\u00a0]?860[\s\u00a0]?665/ },
  { label: 'Footer phone +254782914717',re: /\+254[\s\u00a0]?782[\s\u00a0]?914[\s\u00a0]?717/ },
  { label: 'No "AI Unavailable" stuck on every page', re: /AI Unavailable/ , wantAbsent:true },
  { label: 'No 404 marker',             re: /This page could not be found|404/i, wantAbsent:true },
  { label: 'No raw "undefined" leak',   re: />\s*undefined\s*</ , wantAbsent:true },
  { label: 'No "[object Object]" leak', re: /\[object Object\]/ , wantAbsent:true },
];

const PER_ROUTE = {
  '/': [
    { label: 'Homepage Solar/UPS teaser id', re: /id="solar-ups-hub-teaser"/ },
    { label: 'Homepage teaser link href',    re: /href="\/resources\/solar-ups-hub"/ },
    { label: 'Homepage teaser CTA copy',     re: /Open hub/i },
    { label: 'Generator Oracle showcase present', re: /Generator Oracle/ },
  ],
  '/resources': [
    { label: 'Solar/UPS Hub card title',     re: /Solar \/ UPS Hub/ },
    { label: 'Solar/UPS Hub card desc',      re: /Solar \+ UPS resource hub/ },
    { label: 'Hub card href',                re: /href="\/resources\/solar-ups-hub"/ },
    { label: 'Generator Oracle NOT in resources mega menu (best-effort)', re: /resources[\s\S]{0,4000}href="\/generator-oracle"/i, wantAbsent:true },
  ],
  '/resources/solar-ups-hub': [
    { label: 'Final URL is /hub or alias rendered', re: /Solar|UPS|Hub/ },
  ],
  '/services/hospital-incinerators': [
    { label: 'Hospital incinerator service rendered', re: /Hospital.{0,40}Incinerator/i },
  ],
  '/generator-oracle': [
    { label: 'Oracle module loaded',          re: /Generator Oracle/ },
    { label: 'No fabricated AI text leak',    re: /As an AI language model|I am an AI/i, wantAbsent:true },
  ],
};

(async () => {
  for (const route of ROUTES) {
    console.log(`\n=== ${route} ===`);
    let res, body = '';
    try {
      res = await fetch(BASE + route, { redirect: 'follow' });
      body = await res.text();
    } catch (e) {
      console.log(`  ERR ${e.message}`);
      continue;
    }
    console.log(`  final-status=${res.status}  final-url=${res.url}  bytes=${body.length}`);
    const checks = [...COMMON, ...(PER_ROUTE[route] || [])];
    for (const c of checks) {
      const hit = c.re.test(body);
      const ok = c.wantAbsent ? !hit : hit;
      console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${c.label}`);
    }
  }
})();
