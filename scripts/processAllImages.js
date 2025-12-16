/**
 * PROCESS ALL IMAGES IN BATCH
 * Processes all images found in the premium directory
 * 
 * Usage:
 *   node scripts/processAllImages.js [preset]
 */

const fs = require('fs');
const path = require('path');
const { processImage } = require('./processImagesCinematic');

const INPUT_DIR = path.join(process.cwd(), 'public/images/premium');
const OUTPUT_DIR = path.join(INPUT_DIR, 'processed');
const PRESET = process.argv[2] || 'hollywood';

async function processAll() {
  console.log(`
🎬 BATCH IMAGE PROCESSOR
========================
Input: ${INPUT_DIR}
Output: ${OUTPUT_DIR}
Preset: ${PRESET}
`);

  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Error: Input directory does not exist: ${INPUT_DIR}`);
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Find all image files
  const files = fs.readdirSync(INPUT_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (files.length === 0) {
    console.log('ℹ️  No images found to process.');
    console.log(`   Please add images to: ${INPUT_DIR}`);
    process.exit(0);
  }

  console.log(`📸 Found ${files.length} images to process\n`);

  const results = {
    processed: [],
    failed: [],
    skipped: [],
  };

  // Process each image
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const inputPath = path.join(INPUT_DIR, file);
    const outputPath = path.join(OUTPUT_DIR, file);

    console.log(`[${i + 1}/${files.length}] Processing: ${file}`);

    // Skip if already processed (unless --force flag)
    if (fs.existsSync(outputPath) && !process.argv.includes('--force')) {
      console.log(`   ⊘ Skipped (already exists, use --force to reprocess)\n`);
      results.skipped.push(file);
      continue;
    }

    const result = await processImage(inputPath, outputPath, PRESET);

    if (result.success) {
      results.processed.push(result);
      console.log(`   ✅ Success: ${result.dimensions.width}x${result.dimensions.height}\n`);
    } else {
      results.failed.push(result);
      console.log(`   ❌ Failed: ${result.error}\n`);
    }
  }

  // Summary
  console.log(`
========================================
   PROCESSING COMPLETE!
========================================
   ✅ Processed: ${results.processed.length}
   ❌ Failed: ${results.failed.length}
   ⊘ Skipped: ${results.skipped.length}
========================================

Processed images saved to: ${OUTPUT_DIR}
WebP versions also created for web optimization.
`);

  if (results.failed.length > 0) {
    console.log('Failed images:');
    results.failed.forEach(r => console.log(`   - ${r.input}: ${r.error}`));
  }
}

processAll().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});



