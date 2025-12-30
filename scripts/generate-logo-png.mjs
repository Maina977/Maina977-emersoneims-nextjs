import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const inputSvg = path.join(projectRoot, 'public', 'emerson-eims-logo.svg');
const outputPng = path.join(projectRoot, 'public', 'emerson-eims-logo.png');

const density = 300; // higher density = sharper text when rasterizing
const targetWidth = 900; // outputs a crisp PNG; Next.js will downscale via width/height props

await sharp(inputSvg, { density })
  .resize({ width: targetWidth, withoutEnlargement: true })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPng);

const meta = await sharp(outputPng).metadata();
console.log(`Wrote ${outputPng}`);
console.log(`PNG: ${meta.width}x${meta.height}`);
