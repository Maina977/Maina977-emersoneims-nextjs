// Pre-flight for Esikangu Church of God: admin hierarchy + registry wells
// around 0.026677, 34.647174 — same sources the engine uses.
import { readFile } from 'node:fs/promises';

const LAT = 0.0266768, LON = 34.6471737;
const R = 6371;
const hav = (a, b, c, d) => {
  const dLa = (c - a) * Math.PI / 180, dLo = (d - b) * Math.PI / 180;
  const x = Math.sin(dLa / 2) ** 2 + Math.cos(a * Math.PI / 180) * Math.cos(c * Math.PI / 180) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
};

// 1. Admin hierarchy (Nominatim + BigDataCloud, like imageDetector)
try {
  const nom = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${LAT}&lon=${LON}&format=json&addressdetails=1&zoom=14`, { headers: { 'User-Agent': 'EmersonEIMS-AquaScan/1.0' } }).then(r => r.json());
  console.log('NOMINATIM :', JSON.stringify(nom.address));
} catch (e) { console.log('NOMINATIM failed:', String(e).slice(0, 80)); }
try {
  const bdc = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${LAT}&longitude=${LON}&localityLanguage=en`).then(r => r.json());
  const levels = (bdc.localityInfo?.administrative ?? []).map(a => `L${a.adminLevel}:${a.name}`).join(' | ');
  console.log('BIGDATACLOUD:', levels);
} catch (e) { console.log('BDC failed:', String(e).slice(0, 80)); }

// 2. Bundled UNESCO registry within 25 km
const un = JSON.parse(await readFile('public/data/gov-wells-kenya.json', 'utf8'));
const near = un.wells
  .map(([name, lat, lon, depth, yld, status, county, src]) => ({ name, depth, status, county, src, d: hav(LAT, LON, lat, lon) }))
  .filter(w => w.d <= 25)
  .sort((a, b) => a.d - b.d);
const withDepth = near.filter(w => w.depth > 0);
console.log(`\nUNESCO REGISTRY: ${near.length} named water points within 25 km (${withDepth.length} with depths)`);
for (const w of near.slice(0, 8)) console.log(`  ${w.d.toFixed(1)} km — ${w.name}${w.depth > 0 ? ` — ${w.depth} m` : ''}${w.status ? ` (${w.status})` : ''}`);
if (withDepth.length) {
  const ds = withDepth.map(w => w.depth).sort((a, b) => a - b);
  console.log(`  Depths within 25 km: min ${ds[0]} m, median ${ds[Math.floor(ds.length / 2)]} m, max ${ds[ds.length - 1]} m`);
}

// 3. WPDx live within 10 km
try {
  const url = `https://data.waterpointdata.org/resource/jfkt-jmqa.json?$where=within_circle(geocoded_column,${LAT},${LON},10000)&$limit=200`;
  const wp = await fetch(url).then(r => r.json());
  if (Array.isArray(wp)) {
    const fn = wp.filter(p => String(p.status_clean ?? '').toLowerCase().includes('yes')).length;
    console.log(`\nWPDx LIVE: ${wp.length} water points within 10 km (${fn} recorded functional)`);
    for (const p of wp.slice(0, 5)) console.log(`  ${[p.clean_adm3, p.clean_adm2].filter(Boolean).join(', ')} — ${p.water_source_clean ?? p.water_source ?? '?'} (${p.status_clean ?? '?'}${p.install_year ? `, ${p.install_year}` : ''})`);
  } else console.log('\nWPDx: unexpected response', JSON.stringify(wp).slice(0, 120));
} catch (e) { console.log('WPDx failed:', String(e).slice(0, 100)); }

// 4. Baseline unit + county prior sanity
const kb = JSON.parse(await readFile('public/data/kenya-baseline.json', 'utf8'));
let best = null, bd = 1e9;
for (const u of kb.units) { const d = hav(LAT, LON, u.lat, u.lon); if (d < bd) { bd = d; best = u; } }
console.log(`\nBASELINE: nearest measured unit = ${best.name} (${bd.toFixed(0)} km) — ${best.climate?.precip_mm_yr} mm/yr, elev ${best.elevation_m} m`);
