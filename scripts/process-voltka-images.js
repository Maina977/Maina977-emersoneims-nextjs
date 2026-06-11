// Cinematic grade for the VOLTKA/Cummins landing-page showcase.
// Upscales to 2560px (lanczos3), lifts brightness/saturation, applies an
// unsharp pass, exports WebP into public/images/voltka/.
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '..', 'public', 'images', 'voltka');
fs.mkdirSync(OUT, { recursive: true });

// brightness/saturation per shot: dark night shot gets a stronger lift
const JOBS = [
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG-20260110-WA0006.jpg', out: 'voltka-vks44-dispatch-crane.webp', width: 2560, brightness: 1.10, saturation: 1.18 },
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG-20260111-WA0001.jpg', out: 'voltka-vks44-night-delivery.webp', width: 2560, brightness: 1.22, saturation: 1.15 },
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG-20251211-WA0010.jpg', out: 'cummins-engine-detail.webp', width: 1600, brightness: 1.12, saturation: 1.12 },
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG_20251118_132632.jpg', out: 'ats-changeover-panel-4k.webp', width: 2560, brightness: 1.08, saturation: 1.15 },
  { src: 'D:/Downloads/IMAGES AND VIDEOS/IMG-20250213-WA0002.jpg', out: 'smartgen-controller-detail.webp', width: 1920, brightness: 1.08, saturation: 1.10 },
  { src: 'D:/EmersonEiMS Brochure/assets/public/generator-4k.png', out: 'voltka-vks40-studio.webp', width: 2160, brightness: 1.04, saturation: 1.12 },
  { src: 'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/KIVUKONI SCHOOL CUMMINS GENERATOR .webp', out: 'kivukoni-cummins-install.webp', width: 1920, brightness: 1.10, saturation: 1.15 },
  { src: 'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/switchgear-panel.png', out: 'switchgear-changeover-panel.webp', width: 2000, brightness: 1.08, saturation: 1.12 },
];

(async () => {
  for (const j of JOBS) {
    try {
      const img = sharp(j.src, { failOn: 'none' })
        .rotate() // respect EXIF orientation
        .resize({ width: j.width, withoutEnlargement: false, kernel: 'lanczos3' })
        .modulate({ brightness: j.brightness, saturation: j.saturation })
        .sharpen({ sigma: 1.1, m1: 0.8, m2: 0.4 })
        .webp({ quality: 84, effort: 5 });
      const info = await img.toFile(path.join(OUT, j.out));
      console.log(`OK ${j.out} ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)}KB`);
    } catch (e) {
      console.log(`FAIL ${j.out}: ${e.message}`);
    }
  }
})();
