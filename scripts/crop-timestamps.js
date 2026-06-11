// Remove camera timestamps by trimming the bottom 8% from affected shots.
const sharp = require('sharp');
const path = require('path');

const OUT = path.join(__dirname, '..', 'public', 'images', 'voltka');

const JOBS = [
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG-20260111-WA0001.jpg', out: 'voltka-vks44-night-delivery.webp', width: 2560, brightness: 1.22, saturation: 1.15 },
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG_20251118_132632.jpg', out: 'ats-changeover-panel-4k.webp', width: 2560, brightness: 1.08, saturation: 1.15 },
];

(async () => {
  for (const j of JOBS) {
    const meta = await sharp(j.src).rotate().metadata();
    const cropH = Math.round(meta.height * 0.92);
    const info = await sharp(j.src, { failOn: 'none' })
      .rotate()
      .extract({ left: 0, top: 0, width: meta.width, height: cropH })
      .resize({ width: j.width, kernel: 'lanczos3' })
      .modulate({ brightness: j.brightness, saturation: j.saturation })
      .sharpen({ sigma: 1.1, m1: 0.8, m2: 0.4 })
      .webp({ quality: 84, effort: 5 })
      .toFile(path.join(OUT, j.out));
    console.log(`OK ${j.out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
  }
})();
