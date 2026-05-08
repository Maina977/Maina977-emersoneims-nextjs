// Check WHERE the duplicates are: in script JSON-LD or in actual rendered DOM.
const r = await fetch('https://emersoneims.com/');
const h = await r.text();

// Strip <script>...</script> blocks
const noScripts = h.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

const t = (label, regex) => {
  const all = (h.match(regex) || []).length;
  const visible = (noScripts.match(regex) || []).length;
  console.log(label.padEnd(40) + ' total=' + all + '  visible(post-script-strip)=' + visible);
};

console.log('=== HOMEPAGE ===');
t('<footer>', /<footer\b/g);
t('<nav>', /<nav\b/g);
t('<nav data-active-section>', /<nav\b[^>]*data-active-section/g);
t('B2B aria-label="B2B commercial..."', /aria-label=\"B2B commercial positioning\"/g);
t('TeslaStyleNavigation primary nav id', /id=\"tesla-primary-mobile-menu\"|tesla-primary/g);
t('<address>', /<address\b/g);
t('© Emerson EiMS', /© [0-9]{4} Emerson EiMS/g);
t('Engineered in Nairobi', /ENGINEERED IN NAIROBI/g);
t('emersoneimservices@', /emersoneimservices@emersoneims\.com/g);
t('generators@', /generators@emersoneims\.com/g);
t('solar@emersoneims', /solar@emersoneims\.com/g);
t('sally@emersoneims', /sally@emersoneims\.com/g);

// Now extract JSON-LD blocks to see what they contain
const ldjsonBlocks = [...h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
console.log('\n--- JSON-LD blocks: ' + ldjsonBlocks.length + ' ---');
for (let i = 0; i < ldjsonBlocks.length; i++) {
  const body = ldjsonBlocks[i][1];
  const len = body.length;
  const hasEmails = (body.match(/@emersoneims\.com/g) || []).length;
  console.log('  block ' + i + ': len=' + len + '  emersoneims emails count=' + hasEmails);
}
