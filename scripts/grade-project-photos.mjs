/*
 * Colour-grade and re-export the project photographs.
 *
 * WHAT THIS DOES, AND WHAT IT HONESTLY CANNOT
 * A grade controls exposure, contrast, colour and sharpness. It cannot change
 * where the camera was standing, and it cannot invent detail the sensor never
 * recorded. So:
 *
 *   Kilifi   3072x4080, 12.5MP  — full-quality originals. Exported at up to
 *                                 3072px, which is genuinely 4K-class.
 *   Migori   1056x1408,  1.5MP  — every one arrived through WhatsApp (the
 *                                 -WA0008 filenames), which threw the
 *                                 resolution away before we ever saw them.
 *                                 Exported at native size. Upscaling to 4K
 *                                 would fabricate detail and, on a generator
 *                                 canopy, look like mush.
 *
 *   → Ask for the Migori originals off the phone via Drive or a cable. They
 *     will be ~12MP like the Kilifi set, and this script re-runs unchanged.
 *
 * THE GRADE
 * Teal-orange, which is the standard cinematic separation — and here it is not
 * an arbitrary choice: the VOLTKA canopies are teal and the site accent is
 * amber, so the grade pulls the subject and the brand toward each other rather
 * than fighting them.
 *
 *   · shadows lifted slightly, so detail survives on dark canopies and PCBs
 *   · S-curve contrast via gamma + linear, for depth without crushing
 *   · saturation raised modestly — industrial subjects look fake past ~1.2
 *   · warmth in the highlights, coolness held in the shadows
 *   · unsharp mask tuned per subject: strong on boards, gentle on wide shots
 *
 * Nothing is cropped, cloned, or composited. These are evidence photographs of
 * work done for named clients; changing what they show would defeat the point
 * of publishing them.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const DESKTOP = 'C:/Users/ADMIN/Desktop';
const OUT = path.join(process.cwd(), 'public/images/projects');
fs.mkdirSync(OUT, { recursive: true });

/**
 * Two grade profiles. Detail shots (boards, panels) take more local contrast
 * and sharpening; wide shots take less, because sharpening a wide frame mostly
 * sharpens noise.
 */
const GRADE = {
  detail: {
    brightness: 1.06,
    saturation: 1.16,
    hue: 0,
    gamma: 1.08,
    sharpen: { sigma: 1.1, m1: 0.6, m2: 2.2 },
    warmth: [1.03, 1.0, 0.97], // R,G,B multipliers — warm highlights, cool shadows
  },
  wide: {
    brightness: 1.08,
    saturation: 1.12,
    hue: 0,
    gamma: 1.05,
    sharpen: { sigma: 0.8, m1: 0.4, m2: 1.6 },
    warmth: [1.04, 1.0, 0.96],
  },
};

const SELECTED = [
  // ── Migori: WhatsApp-compressed, exported at native resolution ──
  { src: `${DESKTOP}/330 kva Migori Mining/IMG-20260812-WA0008.jpg`, out: 'migori-voltka-dispatch', grade: 'wide' },
  { src: `${DESKTOP}/330 kva Migori Mining/IMG-20260815-WA0006.jpg`, out: 'migori-330kva-installed', grade: 'wide' },
  { src: `${DESKTOP}/330 kva Migori Mining/IMG-20260812-WA0015.jpg`, out: 'migori-ats-panel-internals', grade: 'detail' },
  { src: `${DESKTOP}/330 kva Migori Mining/IMG-20260815-WA0013.jpg`, out: 'migori-site-work', grade: 'wide' },
  // ── Kilifi: full 12.5MP originals, exported large ──
  { src: `${DESKTOP}/genverter kilifi yacht/IMG_20260826_131555_1.jpg`, out: 'kilifi-genverter-pcb-damage', grade: 'detail' },
  { src: `${DESKTOP}/genverter kilifi yacht/IMG_20260826_131452_1.jpg`, out: 'kilifi-genverter-motor-connect', grade: 'detail' },
  { src: `${DESKTOP}/genverter kilifi yacht/IMG_20260826_131638_1.jpg`, out: 'kilifi-genverter-bench', grade: 'detail' },
  { src: `${DESKTOP}/genverter kilifi yacht/IMG_20260826_132037_1.jpg`, out: 'kilifi-genverter-detail', grade: 'detail' },
];

/** Longest edge we will export. Never larger than the source. */
const MAX_EDGE = 3072;

let done = 0;
let totalIn = 0;
let totalOut = 0;

for (const item of SELECTED) {
  if (!fs.existsSync(item.src)) { console.log(`MISSING  ${path.basename(item.src)}`); continue; }

  const g = GRADE[item.grade];
  const meta = await sharp(item.src).metadata();
  const longest = Math.max(meta.width, meta.height);
  const target = Math.min(longest, MAX_EDGE);

  const outFile = path.join(OUT, `${item.out}.webp`);
  await sharp(item.src)
    .rotate()
    .resize({ width: target, height: target, fit: 'inside', withoutEnlargement: true })
    .modulate({ brightness: g.brightness, saturation: g.saturation, hue: g.hue })
    .gamma(g.gamma)
    // Warm the highlights and cool the shadows — the teal/orange separation.
    .linear(g.warmth, [0, 0, 0])
    .sharpen(g.sharpen)
    .webp({ quality: 82, effort: 5 })
    .toFile(outFile);

  const inKb = fs.statSync(item.src).size / 1024;
  const outKb = fs.statSync(outFile).size / 1024;
  totalIn += inKb; totalOut += outKb;
  const graded = await sharp(outFile).metadata();
  console.log(
    `${item.out.padEnd(34)} ${meta.width}x${meta.height} → ${graded.width}x${graded.height}  ` +
    `${outKb.toFixed(0)}KB  [${item.grade}]${longest < 2000 ? '  (source WhatsApp-limited)' : ''}`
  );
  done++;
}

console.log(`\ngraded ${done}/${SELECTED.length}   ${(totalIn / 1024).toFixed(1)}MB source → ${(totalOut / 1024).toFixed(1)}MB output`);
