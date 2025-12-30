/**
 * FIND ALL IMAGES IN PROJECT
 * Searches for image files in common locations
 */

const fs = require('fs');
const path = require('path');

console.log(`
🔍 SEARCHING FOR IMAGES IN PROJECT
===================================
`);

const locations = [
  'public/images/premium',
  'public/images',
  'public/media',
  'public/assets',
  'images',
  'media',
];

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

let totalFound = 0;
const foundImages = {};

locations.forEach(loc => {
  const fullPath = path.join(process.cwd(), loc);
  
  if (fs.existsSync(fullPath)) {
    try {
      const files = fs.readdirSync(fullPath, { recursive: true, withFileTypes: true })
        .filter(item => {
          if (!item.isFile()) return false;
          const ext = path.extname(item.name).toLowerCase();
          return imageExtensions.includes(ext);
        })
        .map(item => {
          const filePath = path.join(item.path || fullPath, item.name);
          const stats = fs.statSync(filePath);
          return {
            name: item.name,
            path: filePath,
            size: stats.size,
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
          };
        });
      
      if (files.length > 0) {
        foundImages[loc] = files;
        totalFound += files.length;
        console.log(`✅ Found ${files.length} image(s) in: ${loc}`);
        files.slice(0, 5).forEach(file => {
          console.log(`   - ${file.name} (${file.sizeMB} MB)`);
        });
        if (files.length > 5) {
          console.log(`   ... and ${files.length - 5} more`);
        }
        console.log('');
      } else {
        console.log(`❌ No images in: ${loc}\n`);
      }
    } catch (error) {
      console.log(`⚠️  Error reading ${loc}: ${error.message}\n`);
    }
  } else {
    console.log(`⊘ Directory doesn't exist: ${loc}\n`);
  }
});

// Check root public folder
const publicRoot = path.join(process.cwd(), 'public');
if (fs.existsSync(publicRoot)) {
  try {
    const rootFiles = fs.readdirSync(publicRoot)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return imageExtensions.includes(ext);
      })
      .map(file => {
        const filePath = path.join(publicRoot, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
        };
      });
    
    if (rootFiles.length > 0) {
      foundImages['public/'] = rootFiles;
      totalFound += rootFiles.length;
      console.log(`✅ Found ${rootFiles.length} image(s) in: public/`);
      rootFiles.forEach(file => {
        console.log(`   - ${file.name} (${file.sizeMB} MB)`);
      });
      console.log('');
    }
  } catch (error) {
    void error;
    // Ignore
  }
}

console.log(`
========================================
   SEARCH COMPLETE
========================================
Total images found: ${totalFound}
`);

if (totalFound === 0) {
  console.log(`
⚠️  NO IMAGES FOUND IN PROJECT
==============================

Expected locations:
  - public/images/premium/
  - public/images/
  - public/media/
  - public/assets/
  - public/ (root)

💡 If you uploaded images, please check:
   1. Are they in the correct folder?
   2. Are they the correct file format (.jpg, .png, etc.)?
   3. Did the upload complete successfully?

📝 Most images in imageAssets.ts are hosted on WordPress:
   - https://emersoneims.com/wp-content/uploads/
   - These don't need to be in the project folder

🎯 To process local images:
   1. Add images to: public/images/premium/
   2. Run: npm run process:images
`);
} else {
  console.log(`
✅ IMAGES FOUND!
===============

Locations with images:`);
  Object.keys(foundImages).forEach(loc => {
    console.log(`   - ${loc}: ${foundImages[loc].length} image(s)`);
  });
  
  console.log(`
💡 To process images in public/images/premium/:
   npm run process:images
`);
}


