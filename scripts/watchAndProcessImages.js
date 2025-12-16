/**
 * WATCH AND PROCESS IMAGES AUTOMATICALLY
 * Monitors image directory and processes new images automatically
 * 
 * Usage:
 *   node scripts/watchAndProcessImages.js
 */

const fs = require('fs');
const path = require('path');
const { processImage } = require('./processImagesCinematic');

const WATCH_DIR = path.join(process.cwd(), 'public/images/premium');
const OUTPUT_DIR = path.join(WATCH_DIR, 'processed');
const PRESET = 'hollywood';

console.log(`
🎬 AUTOMATIC IMAGE PROCESSOR
============================
Watching: ${WATCH_DIR}
Output: ${OUTPUT_DIR}
Preset: ${PRESET}

Press Ctrl+C to stop watching...
`);

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process existing images first
async function processExistingImages() {
  const files = fs.readdirSync(WATCH_DIR).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
  
  if (files.length > 0) {
    console.log(`\n📸 Found ${files.length} existing images. Processing...\n`);
    
    for (const file of files) {
      const inputPath = path.join(WATCH_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file);
      
      // Skip if already processed
      if (fs.existsSync(outputPath)) {
        console.log(`⊘ Already processed: ${file}`);
        continue;
      }
      
      await processImage(inputPath, outputPath, PRESET);
    }
    
    console.log(`\n✅ Finished processing existing images!\n`);
  }
}

// Watch for new files
function watchDirectory() {
  console.log('👀 Watching for new images...\n');
  
  fs.watch(WATCH_DIR, { recursive: false }, async (eventType, filename) => {
    if (!filename) return;
    
    const ext = path.extname(filename).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;
    
    const inputPath = path.join(WATCH_DIR, filename);
    const outputPath = path.join(OUTPUT_DIR, filename);
    
    // Wait a bit for file to be fully written
    setTimeout(async () => {
      if (fs.existsSync(inputPath) && !fs.existsSync(outputPath)) {
        console.log(`\n🆕 New image detected: ${filename}`);
        await processImage(inputPath, outputPath, PRESET);
        console.log(`✅ Processed: ${filename}\n`);
      }
    }, 1000);
  });
}

// Start processing
async function start() {
  await processExistingImages();
  watchDirectory();
}

start().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});



