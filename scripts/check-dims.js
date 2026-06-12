// One-off: dimensions of showcase sources
const sharp = require('sharp');
const os = require('os');
const path = require('path');
const D = path.join(os.homedir(), 'Desktop', 'IMAGES');
const P = path.join(__dirname, '..', 'public', 'images');
const files = [
  path.join(D, 'IMG_20251115_101219.jpg'),
  path.join(D, 'IMG_20251115_101259.jpg'),
  path.join(D, 'IMG_20251115_101250.jpg'),
  path.join(D, 'IMG_20251115_101330.jpg'),
  path.join(D, 'IMG_20251115_101145.jpg'),
  path.join(D, 'IMG_20251115_101147.jpg'),
  path.join(D, 'IMAGES AND VIDEOS', 'IMG-20250730-WA0003.jpg'),
  'D:/Downloads/IMAGES AND VIDEOS/IMG-20251211-WA0010.jpg',
  path.join(P, 'BIGOT CATERPILLAR 30KVA.jpg'),
  path.join(P, 'GEN 2-1920x1080.png'),
  path.join(P, 'solar changeover control.png'),
  path.join(P, 'voltka', 'voltka-vks44-night-delivery.webp'),
];
(async () => {
  for (const f of files) {
    try {
      const m = await sharp(f).metadata();
      const o = m.orientation && m.orientation >= 5 ? ' (rotated)' : '';
      console.log(`${m.width}x${m.height}${o}  ${path.basename(f)}`);
    } catch (e) { console.log(`ERR ${path.basename(f)}: ${e.message}`); }
  }
})();
