// Audit: navbar count, B2B strip presence, footer email coverage on live.
const URLS = [
  'https://emersoneims.com/',
  'https://emersoneims.com/about-us',
  'https://emersoneims.com/services',
  'https://emersoneims.com/solutions/incinerators',
  'https://emersoneims.com/resources',
  'https://emersoneims.com/resources/solar-ups-hub',
  'https://emersoneims.com/generator-oracle',
  'https://emersoneims.com/contact',
];

const expectedNavLabels = ['HOME', 'ABOUT', 'SERVICES', 'AI SOLUTIONS', 'GENERATORS', 'SOLAR', 'RESOURCES', 'CONTACT'];
const expectedEmails = [
  'info@emersoneims.com',
  'emersoneimservices@emersoneims.com',
  'generators@emersoneims.com',
  'solar@emersoneims.com',
  'sally@emersoneims.com',
];

for (const url of URLS) {
  const r = await fetch(url);
  const sha = r.headers.get('x-app-commit');
  const h = await r.text();
  const navOpenTagCount = (h.match(/<nav\b[^>]*data-active-section/g) || []).length;
  const totalNavTags = (h.match(/<nav\b/g) || []).length;
  const navItemCounts = expectedNavLabels.map(l => [l, (h.match(new RegExp('>'+l+'<', 'g')) || []).length]);
  const b2bStrip = (h.match(/aria-label=\"B2B commercial positioning\"/g) || []).length;
  const b2bBand = (h.match(/B2BCommercialBand|b2b-commercial-band/g) || []).length;
  const emailCounts = expectedEmails.map(e => [e, (h.match(new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length]);
  const footerOpenTags = (h.match(/<footer\b/g) || []).length;
  console.log('--- ' + url.replace('https://emersoneims.com', '') + ' ---');
  console.log('  sha:', sha?.slice(0, 12), 'status:', r.status, 'bytes:', h.length);
  console.log('  <nav data-active-section> count:', navOpenTagCount, '  total <nav>:', totalNavTags);
  console.log('  nav-item label counts:', JSON.stringify(Object.fromEntries(navItemCounts)));
  console.log('  B2B strip count:', b2bStrip, '  B2B band count:', b2bBand);
  console.log('  <footer> count:', footerOpenTags);
  console.log('  email counts:', JSON.stringify(Object.fromEntries(emailCounts)));
}
