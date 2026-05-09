// One-shot post-deploy verification for /resources Solar/UPS Hub prominence.
const r = await fetch('https://emersoneims.com/resources');
const sha = r.headers.get('x-app-commit');
const h = await r.text();
const quickIdx = h.indexOf('Quick Access');
const catIdx = h.indexOf('Resource Categories');
const hubIdx = h.indexOf('/resources/solar-ups-hub');
const labelCount = (h.match(/Solar \/ UPS Hub/g) || []).length;
console.log(JSON.stringify({
  sha,
  status: r.status,
  bytes: h.length,
  quickAccessMarker: quickIdx,
  resourceCategoriesMarker: catIdx,
  hubFirstHrefIdx: hubIdx,
  hubInQuickAccessBand: hubIdx > 0 && quickIdx > 0 && hubIdx < catIdx,
  hubLabelCount: labelCount,
}, null, 2));
