/*
  Full Site Audit for www.emersoneims.com
  Probes ALL routes and generates detailed report

  Usage:
    node scripts/fullSiteAudit.mjs

  Optional env:
    BASE_URL=http://127.0.0.1:3020 node scripts/fullSiteAudit.mjs
*/

const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:3020';

const routes = [
  // Main Pages
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/about-us', name: 'About Us' },
  { path: '/brands', name: 'Brands' },
  { path: '/contact', name: 'Contact' },
  { path: '/careers', name: 'Careers' },
  { path: '/case-studies', name: 'Case Studies' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/terms', name: 'Terms & Conditions' },
  
  // Services
  { path: '/services', name: 'Services Hub' },
  { path: '/service', name: 'Service (Alt)' },
  
  // Solutions Hub
  { path: '/solutions', name: 'Solutions Hub' },
  { path: '/solution', name: 'Solution (Alt)' },
  { path: '/solutions/generators', name: 'Solutions - Generators' },
  { path: '/solutions/solar', name: 'Solutions - Solar' },
  { path: '/solutions/solar-sizing', name: 'Solutions - Solar Sizing' },
  { path: '/solutions/ups', name: 'Solutions - UPS' },
  { path: '/solutions/motors', name: 'Solutions - Motors' },
  { path: '/solutions/controls', name: 'Solutions - Controls' },
  { path: '/solutions/ac', name: 'Solutions - AC' },
  { path: '/solutions/borehole-pumps', name: 'Solutions - Borehole Pumps' },
  { path: '/solutions/incinerators', name: 'Solutions - Incinerators' },
  { path: '/solutions/diesel-automation', name: 'Solutions - Diesel Automation' },
  { path: '/solutions/power-interruptions', name: 'Solutions - Power Interruptions' },
  { path: '/solutions/contact', name: 'Solutions - Contact' },
  
  // Generators
  { path: '/generators', name: 'Generators Hub' },
  { path: '/generators/maintenance', name: 'Generators - Maintenance' },
  { path: '/generators/used', name: 'Generators - Used' },
  { path: '/generators/case-studies', name: 'Generators - Case Studies' },
  { path: '/generator', name: 'Generator (Alt)' },
  { path: '/generator-services', name: 'Generator Services' },
  { path: '/generator-parts', name: 'Generator Parts' },
  
  // Solar
  { path: '/solar', name: 'Solar Hub' },
  
  // Diagnostics & Tools
  { path: '/diagnostics', name: 'Diagnostics Hub' },
  { path: '/diagnostic-suite', name: 'Diagnostic Suite' },
  { path: '/diagnostic-cockpit', name: 'Diagnostic Cockpit' },
  { path: '/diagnostic-qa', name: 'Diagnostic QA' },
  { path: '/fault-code-lookup', name: 'Fault Code Lookup' },
  { path: '/calculators', name: 'Calculators' },
  
  // Fabrication
  { path: '/fabrication', name: 'Fabrication' },
  
  // Innovations
  { path: '/innovations', name: 'Innovations' },
  
  // Kenya / Counties
  { path: '/kenya', name: 'Kenya' },
  { path: '/counties', name: 'Counties' },
  
  // API Routes
  { path: '/api/health', name: 'API Health Check' },
];

const ERROR_MARKERS = [
  'Something went wrong',
  'Application error',
  'ErrorBoundary',
  '__NEXT_ERROR__',
  '404',
  'Page not found',
  'This page could not be found',
  'NEXT_NOT_FOUND',
];

const SUCCESS_MARKERS = [
  'Emerson',
  'EIMS',
  'Generator',
  'Solar',
  'Diagnostic',
  'Power',
  'Energy',
];

function analyzeContent(text) {
  const hasError = ERROR_MARKERS.some((m) => text.toLowerCase().includes(m.toLowerCase()));
  const hasValidContent = SUCCESS_MARKERS.some((m) => text.toLowerCase().includes(m.toLowerCase()));
  const hasTitle = text.includes('<title>') && !text.includes('<title></title>');
  const hasMeta = text.includes('meta name="description"');
  const hasH1 = text.includes('<h1');
  const has404 = text.includes('404') || text.includes('not found');
  
  return { hasError, hasValidContent, hasTitle, hasMeta, hasH1, has404 };
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const text = await res.text();
    return { ok: true, status: res.status, text };
  } catch (error) {
    return { ok: false, error };
  } finally {
    clearTimeout(timeout);
  }
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('       EMERSON EIMS WEBSITE - COMPREHENSIVE AUDIT REPORT');
console.log('       Target: ' + baseUrl);
console.log('       Date: ' + new Date().toISOString());
console.log('═══════════════════════════════════════════════════════════════════\n');

const results = {
  passed: [],
  failed: [],
  warnings: [],
  notFound: [],
};

for (const route of routes) {
  const url = new URL(route.path, baseUrl).toString();
  const result = await fetchWithTimeout(url, 15000);

  if (!result.ok) {
    const msg = result.error?.name === 'AbortError' ? 'TIMEOUT' : String(result.error);
    console.log(`❌ ${route.name.padEnd(30)} ${route.path.padEnd(35)} ERROR: ${msg}`);
    results.failed.push({ ...route, error: msg });
    continue;
  }

  const bytes = Buffer.byteLength(result.text, 'utf8');
  const analysis = analyzeContent(result.text);
  
  let status = '✅';
  let issues = [];
  
  if (result.status === 404 || analysis.has404) {
    status = '🔴';
    issues.push('404 Not Found');
    results.notFound.push(route);
  } else if (result.status !== 200) {
    status = '⚠️';
    issues.push(`Status ${result.status}`);
    results.warnings.push({ ...route, status: result.status });
  } else if (analysis.hasError && !analysis.hasValidContent) {
    status = '❌';
    issues.push('Error content detected');
    results.failed.push({ ...route, error: 'Error markers found' });
  } else {
    if (!analysis.hasTitle) issues.push('Missing title');
    if (!analysis.hasMeta) issues.push('Missing meta description');
    if (!analysis.hasH1) issues.push('Missing H1');
    
    if (issues.length > 0) {
      status = '⚠️';
      results.warnings.push({ ...route, issues });
    } else {
      results.passed.push(route);
    }
  }
  
  const issueStr = issues.length > 0 ? ` [${issues.join(', ')}]` : '';
  const sizeKb = (bytes / 1024).toFixed(1);
  console.log(`${status} ${route.name.padEnd(30)} ${route.path.padEnd(35)} ${result.status} ${sizeKb}KB${issueStr}`);
}

console.log('\n═══════════════════════════════════════════════════════════════════');
console.log('                         AUDIT SUMMARY');
console.log('═══════════════════════════════════════════════════════════════════');
console.log(`✅ Passed:     ${results.passed.length}`);
console.log(`⚠️  Warnings:   ${results.warnings.length}`);
console.log(`🔴 Not Found:  ${results.notFound.length}`);
console.log(`❌ Failed:     ${results.failed.length}`);
console.log(`📊 Total:      ${routes.length}`);

if (results.notFound.length > 0) {
  console.log('\n🔴 Pages Not Found:');
  results.notFound.forEach(r => console.log(`   - ${r.path} (${r.name})`));
}

if (results.failed.length > 0) {
  console.log('\n❌ Failed Pages:');
  results.failed.forEach(r => console.log(`   - ${r.path} (${r.name}): ${r.error}`));
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  Pages with Warnings:');
  results.warnings.forEach(r => {
    const issueStr = r.issues ? r.issues.join(', ') : `Status ${r.status}`;
    console.log(`   - ${r.path} (${r.name}): ${issueStr}`);
  });
}

console.log('\n═══════════════════════════════════════════════════════════════════\n');
