#!/usr/bin/env node
// One-shot follow-up to commit fab728d — find any image still >800KB and
// shrink it: cap longest side at 1800px, then drop to palette PNG (256 colors)
// or recompress JPEG with mozjpeg q78. Replaces in place.

import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = 'public/images';
const MAX_SIDE = 1800;
const SIZE_FLOOR = 800 * 1024; // anything bigger gets processed

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

let totalBefore = 0;
let totalAfter = 0;
let filesProcessed = 0;
let filesSkipped = 0;
const failures = [];

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;

  const before = (await stat(file)).size;
  if (before < SIZE_FLOOR) continue;

  const tmp = file + '.tmp';
  try {
    const img = sharp(file, { failOn: 'none' });
    const meta = await img.metadata();
    const needsResize = (meta.width ?? 0) > MAX_SIDE || (meta.height ?? 0) > MAX_SIDE;

    let pipeline = sharp(file, { failOn: 'none' });
    if (needsResize) {
      pipeline = pipeline.resize({
        width: MAX_SIDE,
        height: MAX_SIDE,
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    if (ext === '.png') {
      // Palette mode (max 256 colors) — typically 70-90% smaller for product photos
      // with no visible quality loss at view distance.
      pipeline = pipeline.png({ palette: true, quality: 80, effort: 7, compressionLevel: 9 });
    } else {
      // mozjpeg q78 — same setting used in the prior batch (commit fab728d)
      pipeline = pipeline.jpeg({ quality: 78, mozjpeg: true });
    }

    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    if (after >= before) {
      // New file isn't smaller — keep the original
      await unlink(tmp);
      filesSkipped++;
      console.log(`SKIP   ${file}   (already optimal: ${(before/1024).toFixed(0)}KB)`);
      continue;
    }

    await rename(tmp, file);
    totalBefore += before;
    totalAfter += after;
    filesProcessed++;
    const pct = ((1 - after / before) * 100).toFixed(0);
    console.log(`OK     ${file}   ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB  (-${pct}%)`);
  } catch (err) {
    failures.push({ file, err: err.message });
    try { await unlink(tmp); } catch {}
    console.log(`FAIL   ${file}   ${err.message}`);
  }
}

console.log('\n=== SUMMARY ===');
console.log(`Processed: ${filesProcessed} files`);
console.log(`Skipped:   ${filesSkipped} files (already optimal)`);
console.log(`Failed:    ${failures.length} files`);
console.log(`Saved:     ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(2)} MB  (${((1 - totalAfter / totalBefore) * 100).toFixed(0)}% reduction on processed files)`);
