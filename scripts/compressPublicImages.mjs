#!/usr/bin/env node
/**
 * Aggressive public/ image compressor.
 *
 * For every PNG/JPG/JPEG > 300 KB under public/:
 *   1. Resize so the longest edge <= 2000px (skip if smaller).
 *   2. Re-encode in place: PNG -> high-compression PNG (or convert to JPEG when no transparency),
 *      JPG/JPEG -> mozjpeg quality 78, progressive, chroma subsampling 4:2:0.
 *   3. Skip when the new buffer is bigger than the original (preserve original).
 *
 * Hard skip-list:
 *   - favicons / icons (<= 100KB anyway)
 *   - manifest icons / logo files (kept as-is)
 *
 * Run:  node scripts/compressPublicImages.mjs
 */

import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname.replace(/^\//, '');
const PUBLIC_DIR = join(ROOT, 'public');
const MIN_BYTES = 300 * 1024;          // only touch files > 300 KB
const MAX_EDGE = 2000;                 // resize so longest edge <= 2000px
const JPEG_QUALITY = 78;
const PNG_COMPRESSION = 9;
const SKIP_BASENAMES = new Set([
  'apple-touch-icon.png',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon.ico',
  'icon-192.png',
  'icon-192x192.png',
  'icon-512.png',
  'emerson-eims-logo.png',
  'logo.svg',
  'og-image.jpg',
]);

let totalBefore = 0;
let totalAfter = 0;
let filesTouched = 0;
let filesSkipped = 0;

async function* walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, ent.name);
    if (ent.isDirectory()) {
      yield* walk(full);
    } else {
      yield full;
    }
  }
}

async function compress(file) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;
  if (SKIP_BASENAMES.has(basename(file))) return;

  const st = await stat(file);
  if (st.size < MIN_BYTES) return;
  totalBefore += st.size;

  const orig = await readFile(file);
  let img = sharp(orig, { failOn: 'none' });
  const meta = await img.metadata();
  const longest = Math.max(meta.width || 0, meta.height || 0);
  if (longest > MAX_EDGE) {
    img = img.resize({
      width: meta.width >= meta.height ? MAX_EDGE : null,
      height: meta.height > meta.width ? MAX_EDGE : null,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  let out;
  let outExt = ext;
  if (ext === '.png') {
    // If the PNG has no real transparency, convert to JPEG (typical 70-90% smaller).
    const stats = await sharp(orig).stats();
    const hasAlpha = meta.hasAlpha && (stats.isOpaque === false);
    if (!hasAlpha) {
      out = await img
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .jpeg({ quality: JPEG_QUALITY, progressive: true, chromaSubsampling: '4:2:0', mozjpeg: true })
        .toBuffer();
      outExt = '.jpg';
    } else {
      out = await img
        .png({ compressionLevel: PNG_COMPRESSION, palette: true, quality: 85, effort: 10 })
        .toBuffer();
    }
  } else {
    out = await img
      .jpeg({ quality: JPEG_QUALITY, progressive: true, chromaSubsampling: '4:2:0', mozjpeg: true })
      .toBuffer();
  }

  if (out.length >= st.size) {
    filesSkipped++;
    totalAfter += st.size;
    return;
  }

  // Always write back to the SAME path (and same extension) so HTML/JSX refs keep working.
  // Exception: if we converted PNG -> JPG, write as .jpg AND keep a tiny PNG redirect? No --
  // safer to keep the original .png extension and just store JPEG-compressed-PNG: not possible.
  // So: when we want PNG->JPEG, we must keep .png extension untouched. Re-encode as PNG.
  if (outExt !== ext) {
    // Re-do as PNG to keep extension intact (still much smaller after resize+palette).
    out = await sharp(orig)
      .resize({
        width: meta.width >= meta.height ? Math.min(MAX_EDGE, meta.width) : null,
        height: meta.height > meta.width ? Math.min(MAX_EDGE, meta.height) : null,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .png({ compressionLevel: PNG_COMPRESSION, palette: true, quality: 80, effort: 10 })
      .toBuffer();
    if (out.length >= st.size) {
      filesSkipped++;
      totalAfter += st.size;
      return;
    }
  }

  await writeFile(file, out);
  totalAfter += out.length;
  filesTouched++;
  const saved = ((1 - out.length / st.size) * 100).toFixed(0);
  console.log(`  -${saved.padStart(2)}%  ${(st.size / 1024).toFixed(0).padStart(6)}KB -> ${(out.length / 1024).toFixed(0).padStart(6)}KB  ${relative(PUBLIC_DIR, file)}`);
}

console.log('Scanning public/ for images > 300 KB ...');
const queue = [];
for await (const f of walk(PUBLIC_DIR)) queue.push(f);

// Sequential to keep memory bounded
for (const f of queue) {
  try {
    await compress(f);
  } catch (e) {
    console.warn(`  !!  ${relative(PUBLIC_DIR, f)}: ${e.message}`);
  }
}

const beforeMB = (totalBefore / 1024 / 1024).toFixed(1);
const afterMB = (totalAfter / 1024 / 1024).toFixed(1);
const savedMB = ((totalBefore - totalAfter) / 1024 / 1024).toFixed(1);
const pct = totalBefore ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : '0';
console.log(`\nDone. Touched ${filesTouched} files (skipped ${filesSkipped} where new >= old).`);
console.log(`Before: ${beforeMB} MB`);
console.log(`After:  ${afterMB} MB`);
console.log(`Saved:  ${savedMB} MB (${pct}%)`);
