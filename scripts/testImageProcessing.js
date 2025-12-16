/**
 * TEST IMAGE PROCESSING SYSTEM
 * Verifies that the image processing system is working correctly
 */

const fs = require('fs');
const path = require('path');

// Test Sharp availability
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Sharp not available:', error.message);
  process.exit(1);
}

async function runTests() {
  console.log(`
🧪 TESTING IMAGE PROCESSING SYSTEM
==================================
`);

  // Test 1: Check Sharp installation
  console.log('Test 1: Checking Sharp installation...');
  try {
    const sharpPackage = require('sharp/package.json');
    console.log(`✅ Sharp installed: v${sharpPackage.version}\n`);
  } catch (error) {
    console.log(`❌ Sharp not installed: ${error.message}\n`);
    console.log(`   Run: npm install sharp --save-dev --legacy-peer-deps\n`);
    process.exit(1);
  }

  // Test 2: Check if processing script exists
  console.log('Test 2: Checking processing scripts...');
  const scripts = [
    'scripts/processImagesCinematic.js',
    'scripts/processAllImages.js',
    'scripts/watchAndProcessImages.js'
  ];

  let scriptsOk = true;
  for (const script of scripts) {
    if (fs.existsSync(script)) {
      console.log(`✅ ${script} exists`);
    } else {
      console.log(`❌ ${script} missing`);
      scriptsOk = false;
    }
  }

  if (scriptsOk) {
    console.log('✅ All scripts present\n');
  } else {
    console.log('❌ Some scripts missing\n');
    process.exit(1);
  }

  // Test 3: Check directories
  console.log('Test 3: Checking directories...');
  const inputDir = path.join(process.cwd(), 'public/images/premium');
  const outputDir = path.join(inputDir, 'processed');

  if (!fs.existsSync(inputDir)) {
    fs.mkdirSync(inputDir, { recursive: true });
    console.log(`✅ Created input directory: ${inputDir}`);
  } else {
    console.log(`✅ Input directory exists: ${inputDir}`);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✅ Created output directory: ${outputDir}`);
  } else {
    console.log(`✅ Output directory exists: ${outputDir}`);
  }

  console.log('');

  // Test 4: Test Sharp functionality
  console.log('Test 4: Testing Sharp functionality...');
  try {
    // Create a test image (1x1 pixel PNG)
    const testImageBuffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    );
    
    const testOutput = path.join(outputDir, 'test-output.jpg');
    
    await sharp(testImageBuffer)
      .resize(100, 100)
      .jpeg({ quality: 90 })
      .toFile(testOutput);
    
    if (fs.existsSync(testOutput)) {
      console.log('✅ Sharp processing works correctly');
      // Clean up test file
      fs.unlinkSync(testOutput);
      console.log('✅ Test file cleaned up\n');
    } else {
      console.log('❌ Sharp processing failed\n');
      process.exit(1);
    }
  } catch (error) {
    console.log(`❌ Sharp test failed: ${error.message}\n`);
    process.exit(1);
  }

  // Test 5: Check image count
  console.log('Test 5: Checking for images to process...');
  const imageFiles = fs.readdirSync(inputDir).filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });

  if (imageFiles.length > 0) {
    console.log(`✅ Found ${imageFiles.length} image(s) ready to process:`);
    imageFiles.slice(0, 5).forEach(file => console.log(`   - ${file}`));
    if (imageFiles.length > 5) {
      console.log(`   ... and ${imageFiles.length - 5} more`);
    }
    console.log(`\n💡 Run 'npm run process:images' to process them\n`);
  } else {
    console.log(`ℹ️  No images found in ${inputDir}`);
    console.log(`   Add images to this directory, then run: npm run process:images\n`);
  }

  // Summary
  console.log(`
========================================
   SYSTEM TEST COMPLETE
========================================
✅ Sharp library: Working
✅ Processing scripts: Present
✅ Directories: Ready
✅ Sharp functionality: Verified
${imageFiles.length > 0 ? '✅ Images found: Ready to process' : 'ℹ️  Images: Waiting for images'}
========================================

System Status: 🟢 READY
`);
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
