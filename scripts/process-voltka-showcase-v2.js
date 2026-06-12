// Tesla-grade showcase set v2 — 7 hand-picked VOLTKA shots from Desktop\IMAGES.
// Upscale to 2560px (lanczos3), cinematic brightness/saturation lift, unsharp
// pass, export WebP into public/images/voltka/.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

const OUT = path.join(__dirname, '..', 'public', 'images', 'voltka');
fs.mkdirSync(OUT, { recursive: true });
const D = path.join(os.homedir(), 'Desktop', 'IMAGES');

const JOBS = [
  { src: path.join(D, 'IMG_20251115_101219.jpg'), out: 'voltka-vks44-hero-profile.webp', brightness: 1.06, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101259.jpg'), out: 'voltka-vks44-crane-dispatch-wide.webp', brightness: 1.08, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101250.jpg'), out: 'voltka-vks44-crane-lift.webp', brightness: 1.07, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101330.jpg'), out: 'voltka-warehouse-fleet.webp', brightness: 1.09, saturation: 1.15 },
  { src: path.join(D, 'IMG_20251115_101145.jpg'), out: 'voltka-vks165-stock-forklift.webp', brightness: 1.07, saturation: 1.14 },
  { src: path.join(D, 'IMG_20251115_101147.jpg'), out: 'voltka-vks165-vks188-delivery.webp', brightness: 1.07, saturation: 1.13 },
  { src: path.join(D, 'IMAGES AND VIDEOS', 'IMG-20250730-WA0003.jpg'), out: 'voltka-cummins-engine-open-canopy.webp', brightness: 1.08, saturation: 1.12 },
];

(async () => {
  for (const j of JOBS) {
    try {
      const info = await sharp(j.src, { failOn: 'none' })
        .rotate()
        .resize({ width: 2560, withoutEnlargement: false, kernel: 'lanczos3' })
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
