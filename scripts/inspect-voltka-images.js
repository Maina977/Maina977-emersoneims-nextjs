// One-off: report dimensions of candidate VOLTKA/Cummins images
const sharp = require('sharp');

const candidates = [
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20260111-WA0001.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20260110-WA0006.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20251211-WA0010.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG_20251118_132632.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20250212-WA0000.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20250212-WA0002.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20250213-WA0002.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20250213-WA0003.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20251211-WA0010.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG_20250425_141647.jpg',
  'D:/Downloads/IMAGES AND VIDEOS/IMG_20250624_104708.jpg',
  'D:/EmersonEiMS Brochure/assets/public/generator-4k.png',
  'D:/EmersonEiMS Brochure/assets/public/VOLTKA 1.png',
  'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/tnpl-diesal-generator-1000x1000-1920x1080.webp',
  'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/KIVUKONI SCHOOL CUMMINS GENERATOR .webp',
  'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/switchgear-panel.png',
  'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/solar changeover control.png',
];

(async () => {
  for (const f of candidates) {
    try {
      const m = await sharp(f).metadata();
      console.log(`${m.width}x${m.height}  ${f.split('/').pop()}`);
    } catch (e) {
      console.log(`ERROR ${f}: ${e.message}`);
    }
  }
})();
