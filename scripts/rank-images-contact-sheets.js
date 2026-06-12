// One-off: rank Desktop\IMAGES jpgs by sharpness+brightness, emit numbered
// contact sheets to %TEMP%\voltka-sheets for visual selection.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SRC = path.join(os.homedir(), 'Desktop', 'IMAGES');
const OUT = path.join(os.tmpdir(), 'voltka-sheets');
fs.mkdirSync(OUT, { recursive: true });

function listJpgs(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listJpgs(p));
    else if (/\.jpe?g$/i.test(e.name)) out.push(p);
  }
  return out;
}

(async () => {
  const files = listJpgs(SRC);
  // de-dupe by filename (subfolder repeats parent's files)
  const seen = new Set();
  const unique = files.filter((f) => {
    const n = path.basename(f).toLowerCase();
    if (seen.has(n)) return false;
    seen.add(n);
    return true;
  });
  console.log(`scoring ${unique.length} unique images...`);

  const scored = [];
  for (const f of unique) {
    try {
      const small = sharp(f, { failOn: 'none' }).rotate().resize(160).grayscale();
      const buf = await small.raw().toBuffer({ resolveWithObject: true });
      const { data, info } = buf;
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      const mean = sum / data.length;
      // laplacian variance for sharpness
      let lapVar = 0, lapMean = 0, n = 0;
      const w = info.width, h = info.height;
      const lap = [];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = y * w + x;
          const v = 4 * data[i] - data[i - 1] - data[i + 1] - data[i - w] - data[i + w];
          lap.push(v); lapMean += v; n++;
        }
      }
      lapMean /= n;
      for (const v of lap) lapVar += (v - lapMean) * (v - lapMean);
      lapVar /= n;
      scored.push({ f, brightness: mean, sharpness: lapVar });
    } catch (e) { /* skip unreadable */ }
  }

  // keep reasonably bright (mean > 90) and sharp; weight recency from filename date
  const yearOf = (f) => {
    const m = path.basename(f).match(/20\d{2}/);
    return m ? parseInt(m[0]) : 2015;
  };
  const candidates = scored
    .filter((s) => s.brightness > 90)
    .map((s) => ({ ...s, year: yearOf(s.f) }))
    .sort((a, b) => (b.year - a.year) || (b.sharpness - a.sharpness))
    .slice(0, 120);

  fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(candidates.map((c, i) => ({ idx: i + 1, file: c.f, b: Math.round(c.brightness), s: Math.round(c.sharpness), y: c.year })), null, 1));

  // contact sheets: 4 cols x 5 rows of 320x240 thumbs, numbered
  const CW = 320, CH = 240, COLS = 4, ROWS = 5;
  for (let sheet = 0; sheet * COLS * ROWS < candidates.length; sheet++) {
    const batch = candidates.slice(sheet * COLS * ROWS, (sheet + 1) * COLS * ROWS);
    const composites = [];
    for (let i = 0; i < batch.length; i++) {
      const thumb = await sharp(batch[i].f, { failOn: 'none' }).rotate().resize(CW, CH, { fit: 'cover' }).jpeg().toBuffer();
      const x = (i % COLS) * CW, y = Math.floor(i / COLS) * CH;
      const label = Buffer.from(`<svg width="70" height="34"><rect width="70" height="34" fill="black" opacity="0.75"/><text x="35" y="24" font-size="22" font-family="Arial" fill="#ffd000" text-anchor="middle" font-weight="bold">${sheet * COLS * ROWS + i + 1}</text></svg>`);
      composites.push({ input: thumb, left: x, top: y });
      composites.push({ input: label, left: x + 4, top: y + 4 });
    }
    await sharp({ create: { width: CW * COLS, height: CH * Math.ceil(batch.length / COLS), channels: 3, background: '#111' } })
      .composite(composites)
      .jpeg({ quality: 80 })
      .toFile(path.join(OUT, `sheet-${sheet + 1}.jpg`));
    console.log(`sheet-${sheet + 1}.jpg (${batch.length} thumbs)`);
  }
  console.log('done -> ' + OUT);
})();
