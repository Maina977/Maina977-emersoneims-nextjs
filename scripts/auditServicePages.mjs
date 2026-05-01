// Audit all 10 service detail pages for required elements.
const BASE = process.env.BASE_URL || 'http://127.0.0.1:3020';
const SLUGS = [
  'cummins-generators',
  'generator-repairs',
  'ats-changeover',
  'distribution-boards',
  'solar-energy',
  'motor-rewinding',
  'ac-installation',
  'ups-systems',
  'borehole-pumps',
  'hospital-incinerators',
];

// Each check: label -> regex (case-insensitive). Counts matches in the SSR HTML.
const CHECKS = [
  ['Hero: Open Calculator btn', /Open\s+[A-Za-z &-]+\s+Calculator/i],
  ['Hero: Read Technical Bible btn', /Read Technical Bible/i],
  ['Tab: Technical Bible (PRO)', /Technical Bible.{0,400}?PRO/is],
  ['Live Engineering Widgets section', /id="widgets"/i],
  ['Widget data sources cited', /Source:[\s\S]{0,30}(NEMA|IEC|NASA|Cummins|Grundfos|EASA|KEBS|WRA|ASHRAE|Kigali|Schneider|IEEE|Deepsea|ASCO|EPRA|WHO|EN |ISO |ITU|AHRI|ITIC|APC|Eaton|Vertiv|Daikin|Trina|Pylontech|EPRA|Power Group|Aggreko|Mantrac|FG Wilson)/i],
  ['Why-choose section anchor', /id="why-choose"/i],
  ['Features section anchor', /id="features"/i],
  ['Who-for section anchor', /id="who-for"/i],
  ['Calculator anchor (#calculator)', /id="calculator"/i],
  ['Troubleshooting anchor', /id="troubleshooting"/i],
  ['Bible root anchor (#bible)', /id="bible"/i],
  ['Bible: intro section', /id="bible-intro"/i],
  ['Bible: brands section', /id="bible-brands"/i],
  ['Bible: diagrams section', /id="bible-diagrams"/i],
  ['Bible: install section', /id="bible-install"/i],
  ['Bible: parts section', /id="bible-parts"/i],
  ['Bible: repair section', /id="bible-repair"/i],
  ['Bible: errors section', /id="bible-errors"/i],
  ['Bible: roi section', /id="bible-roi"/i],
  ['Bible: quality section', /id="bible-quality"/i],
  ['Diagnostic Q&A heading', /Diagnostic\s+Q&amp;A/i],
  ['Live Telemetry gauges', /Live Telemetry/i],
  ['Jump-to-section panel', /Jump to a Section on This Page/i],
  ['No external /technical-bible link', /href="\/technical-bible/i, true],
  ['No external /solutions/ link', /href="\/solutions\//i, true],
  ['No external /calculators link', /href="\/calculators[\"\/?#]/i, true],
  ['No external /maintenance-hub link', /href="\/maintenance-hub/i, true],
  ['Top 10 Brands content', /Top 10 Brands/i],
  ['Tap-card hint text', /Tap any card/i],
  ['WhatsApp prefilled CTA', /WhatsApp us/i],
];

function pad(s, n) { return (s + ' '.repeat(n)).slice(0, n); }

const summary = [];

for (const slug of SLUGS) {
  const url = `${BASE}/services/${slug}`;
  let html = '';
  let status = 0;
  try {
    const res = await fetch(url, { redirect: 'follow' });
    status = res.status;
    html = await res.text();
  } catch (e) {
    console.log(`\n=== ${slug} === FETCH ERROR: ${e.message}`);
    continue;
  }

  let pass = 0, fail = 0;
  const failed = [];
  console.log(`\n=== ${slug}  (HTTP ${status}, ${(html.length / 1024).toFixed(1)} KB) ===`);
  for (const [label, regex, mustNotExist] of CHECKS) {
    const matches = html.match(new RegExp(regex.source, regex.flags + (regex.global ? '' : 'g'))) || [];
    const count = matches.length;
    let ok;
    if (mustNotExist) {
      ok = count === 0;
    } else {
      ok = count > 0;
    }
    if (ok) pass++; else { fail++; failed.push(label); }
    const tag = ok ? 'PASS' : 'FAIL';
    console.log(`  [${tag}] ${pad(label, 38)}  count=${count}`);
  }
  summary.push({ slug, status, pass, fail, failed });
}

console.log('\n\n========== SUMMARY ==========');
for (const s of summary) {
  console.log(`${pad(s.slug, 22)}  HTTP ${s.status}  pass=${s.pass}  fail=${s.fail}`);
  if (s.failed.length) console.log('   missing: ' + s.failed.join('; '));
}
const total = summary.length, perfect = summary.filter(s => s.fail === 0).length;
console.log(`\n${perfect}/${total} pages clean.`);
