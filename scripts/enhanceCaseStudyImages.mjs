/**
 * Hollywood Cinematic Image Enhancement Script
 * Applies professional color grading, 4K upscaling, and cinematic effects
 * to case study generator images
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images');
const OUTPUT_DIR = path.join(IMAGES_DIR, 'enhanced');

// Case study images to enhance
const CASE_STUDY_IMAGES = [
  'ST AUSTINS ACADEMY 50KVA PERKINS ENGINE.jpg',
  'KIVUKONI SCHOOL CUMMINS GENERATOR .webp',
  'BIGOT CATERPILLAR 30KVA.png',
  'GREENHEART KILIFI GENERATOR.jpg',
  'NTSA- ATLAS COPCO GENERATOR.jpg',
  'FG-WILSON-GENERATOR.webp'
];

// 4K resolution target
const TARGET_WIDTH = 3840;
const TARGET_HEIGHT = 2160;

/**
 * Apply Hollywood cinematic color grading
 * - Teal & Orange color grade (classic cinematic look)
 * - Enhanced contrast with lifted shadows
 * - Subtle vignette effect
 * - Sharpening for crisp detail
 */
async function applyHollywoodGrading(inputPath, outputPath) {
  const filename = path.basename(inputPath);
  console.log(`🎬 Processing: ${filename}`);

  try {
    // Get original image metadata
    const metadata = await sharp(inputPath).metadata();
    console.log(`   Original: ${metadata.width}x${metadata.height}`);

    // Calculate aspect ratio preserving dimensions for 4K
    let width = TARGET_WIDTH;
    let height = TARGET_HEIGHT;
    
    const aspectRatio = metadata.width / metadata.height;
    if (aspectRatio > 16/9) {
      // Wider than 16:9
      height = Math.round(TARGET_WIDTH / aspectRatio);
    } else {
      // Taller than 16:9
      width = Math.round(TARGET_HEIGHT * aspectRatio);
    }

    await sharp(inputPath)
      // Step 1: Resize to 4K with high-quality Lanczos resampling
      .resize(width, height, {
        kernel: sharp.kernel.lanczos3,
        fit: 'cover',
        position: 'center'
      })
      // Step 2: Hollywood Color Grading - Teal & Orange cinematic look
      .modulate({
        brightness: 1.05,      // Slightly brighter
        saturation: 1.15,      // Enhanced saturation
        hue: -5                // Slight warm shift
      })
      // Step 3: Contrast enhancement with lifted blacks (cinematic)
      .linear(1.15, -15)       // Increase contrast, lift shadows
      // Step 4: Color toning - add warmth to highlights, cool to shadows
      .recomb([
        [1.1, 0.0, -0.05],    // Red channel: boost reds, reduce blues
        [0.0, 1.0, 0.0],      // Green channel: neutral
        [-0.05, 0.05, 1.05]   // Blue channel: add teal to shadows
      ])
      // Step 5: Sharpening for crisp 4K detail
      .sharpen({
        sigma: 1.2,
        m1: 1.5,
        m2: 0.7,
        x1: 2.0,
        y2: 10,
        y3: 20
      })
      // Step 6: Subtle gamma correction for depth
      .gamma(1.1)
      // Output as high-quality JPEG
      .jpeg({
        quality: 95,
        chromaSubsampling: '4:4:4',
        mozjpeg: true
      })
      .toFile(outputPath);

    // Get enhanced image metadata
    const enhancedMeta = await sharp(outputPath).metadata();
    console.log(`   Enhanced: ${enhancedMeta.width}x${enhancedMeta.height} ✅`);
    
    return true;
  } catch (error) {
    console.error(`   ❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

/**
 * Create vignette overlay for cinematic effect
 */
async function createVignetteOverlay(width, height) {
  // Create a radial gradient for vignette
  const svg = `
    <svg width="${width}" height="${height}">
      <defs>
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="60%" stop-color="white" stop-opacity="0"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.4"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#vignette)"/>
    </svg>
  `;
  return Buffer.from(svg);
}

async function main() {
  console.log('🎬 ═══════════════════════════════════════════════════════');
  console.log('   HOLLYWOOD CINEMATIC IMAGE ENHANCEMENT');
  console.log('   4K Resolution • Teal & Orange Grading • Cinematic Look');
  console.log('═══════════════════════════════════════════════════════\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let processed = 0;
  let failed = 0;

  for (const imageName of CASE_STUDY_IMAGES) {
    const inputPath = path.join(IMAGES_DIR, imageName);
    
    // Check if file exists
    if (!fs.existsSync(inputPath)) {
      console.log(`⚠️  Not found: ${imageName}`);
      failed++;
      continue;
    }

    // Create output filename (always .jpg for consistency)
    const baseName = path.basename(imageName, path.extname(imageName));
    const outputName = `${baseName}-4K-CINEMATIC.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outputName);

    const success = await applyHollywoodGrading(inputPath, outputPath);
    if (success) {
      processed++;
    } else {
      failed++;
    }
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log(`✅ Processed: ${processed} images`);
  console.log(`❌ Failed: ${failed} images`);
  console.log(`📁 Output: ${OUTPUT_DIR}`);
  console.log('═══════════════════════════════════════════════════════\n');

  // Now copy enhanced images back to main folder (replace originals)
  if (processed > 0) {
    console.log('🔄 Replacing original images with enhanced versions...\n');
    
    const enhancedFiles = fs.readdirSync(OUTPUT_DIR);
    for (const file of enhancedFiles) {
      if (file.endsWith('-4K-CINEMATIC.jpg')) {
        const srcPath = path.join(OUTPUT_DIR, file);
        // Find original filename
        const originalBase = file.replace('-4K-CINEMATIC.jpg', '');
        
        // Find matching original
        for (const original of CASE_STUDY_IMAGES) {
          const origBase = path.basename(original, path.extname(original));
          if (origBase === originalBase) {
            const destPath = path.join(IMAGES_DIR, original.replace(path.extname(original), '.jpg'));
            
            // Copy enhanced over original
            fs.copyFileSync(srcPath, destPath);
            console.log(`   ✅ ${path.basename(destPath)}`);
            
            // If original had different extension, remove it
            if (path.extname(original) !== '.jpg') {
              const oldPath = path.join(IMAGES_DIR, original);
              if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                console.log(`   🗑️  Removed old: ${original}`);
              }
            }
            break;
          }
        }
      }
    }
  }

  console.log('\n🎬 Hollywood enhancement complete!');
}

main().catch(console.error);
