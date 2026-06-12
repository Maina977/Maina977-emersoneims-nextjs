const sharp = require('sharp');
const path = require('path');
const os = require('os');
const V = 'd:/MY WEBSITE RECOVERY FOLDER/my-app/public/images/voltka';
const O = path.join(os.tmpdir(), 'voltka-proof');
require('fs').mkdirSync(O, { recursive: true });
const files = ['voltka-vks44-hero-profile.webp','cat-open-frame.webp','cat-canopy-studio.webp','switchgear-distribution-room.webp','ats-changeover-card.webp','voltka-warehouse-fleet.webp'];
(async () => { for (const f of files) { await sharp(path.join(V,f)).resize(640).jpeg({quality:78}).toFile(path.join(O, f.replace('.webp','.jpg'))); } console.log('ok ' + O); })();
