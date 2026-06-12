const sharp = require('sharp');
(async () => {
  const info = await sharp('D:/Downloads/IMAGES AND VIDEOS/IMG-20260111-WA0001.jpg', { failOn: 'none' })
    .rotate()
    .resize({ width: 2560, height: 1440, fit: 'cover', position: sharp.strategy.attention, kernel: 'lanczos3', withoutEnlargement: false })
    .modulate({ brightness: 1.22, saturation: 1.15 })
    .sharpen({ sigma: 1.1, m1: 0.8, m2: 0.4 })
    .webp({ quality: 84, effort: 5 })
    .toFile('d:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/voltka/voltka-vks44-night-delivery.webp');
  console.log(`OK ${info.width}x${info.height} ${(info.size/1024).toFixed(0)}KB`);
})();
