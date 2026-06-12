// Showcase set v3 — uniform resolutions across every landing-page image.
// Slides: exact 2560x1440 (16:9) cover-crops from the 4080x3072 series.
// Grid cards: exact 2560x1920 (4:3). Switchgear banner: 2560x1097 (21:9).
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OUT = path.join(__dirname, '..', 'public', 'images', 'voltka');
fs.mkdirSync(OUT, { recursive: true });
const D = path.join(os.homedir(), 'Desktop', 'IMAGES');
const P = path.join(__dirname, '..', 'public', 'images');

const SLIDE = { w: 2560, h: 1440 };
const CARD = { w: 2560, h: 1920 };
const WIDE = { w: 2560, h: 1097 };

const JOBS = [
  // ── 7 slides, one camera, one day, one resolution ──
  { src: path.join(D, 'IMG_20251115_101219.jpg'), out: 'voltka-vks44-hero-profile.webp', ...SLIDE, brightness: 1.06, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101330.jpg'), out: 'voltka-warehouse-fleet.webp', ...SLIDE, brightness: 1.09, saturation: 1.15 },
  { src: path.join(D, 'IMG_20251115_101259.jpg'), out: 'voltka-vks44-crane-dispatch-wide.webp', ...SLIDE, brightness: 1.08, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101145.jpg'), out: 'voltka-vks165-stock-forklift.webp', ...SLIDE, brightness: 1.07, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101250.jpg'), out: 'voltka-vks44-crane-lift.webp', ...SLIDE, brightness: 1.07, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101147.jpg'), out: 'voltka-vks165-vks188-delivery.webp', ...SLIDE, brightness: 1.07, saturation: 1.13 },
  { src: path.join(D, 'IMG_20251115_101225.jpg'), out: 'voltka-vks44-crane-side.webp', ...SLIDE, brightness: 1.07, saturation: 1.14 },
  // ── grid cards, uniform 4:3 ──
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG_20251118_132632.jpg', out: 'ats-changeover-card.webp', ...CARD, brightness: 1.08, saturation: 1.15 },
  { src: path.join(D, 'IMAGES AND VIDEOS', 'IMG-20250730-WA0003.jpg'), out: 'voltka-cummins-engine-open-canopy.webp', ...CARD, brightness: 1.08, saturation: 1.12 },
  { src: path.join(P, 'BIGOT CATERPILLAR 30KVA.jpg'), out: 'cat-open-frame.webp', ...CARD, brightness: 1.05, saturation: 1.1 },
  // studio render: contain on white so the unit is never cropped
  { src: path.join(P, 'GEN 2-1920x1080.png'), out: 'cat-canopy-studio.webp', ...CARD, brightness: 1.0, saturation: 1.05, contain: '#ffffff' },
  // ── switchgear/distribution wide banner ──
  { src: path.join(P, 'solar changeover control.png'), out: 'switchgear-distribution-room.webp', ...WIDE, brightness: 1.06, saturation: 1.08 },
];

(async () => {
  for (const j of JOBS) {
    try {
      let img = sharp(j.src, { failOn: 'none' }).rotate();
      img = j.contain
        ? img.resize({ width: j.w, height: j.h, fit: 'contain', background: j.contain, kernel: 'lanczos3' })
        : img.resize({ width: j.w, height: j.h, fit: 'cover', position: sharp.strategy.attention, kernel: 'lanczos3', withoutEnlargement: false });
      const info = await img
        .modulate({ brightness: j.brightness, saturation: j.saturation })
        .sharpen({ sigma: 1.1, m1: 0.8, m2: 0.4 })
        .webp({ quality: 84, effort: 5 })
        .toFile(path.join(OUT, j.out));
      console.log(`OK ${j.out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
    } catch (e) {
      console.log(`FAIL ${j.out}: ${e.message}`);
    }
  }
})();
