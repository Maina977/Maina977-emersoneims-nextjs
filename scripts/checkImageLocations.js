/**
 * COMPREHENSIVE IMAGE LOCATION CHECKER
 * Checks all possible locations where images might be
 */

const fs = require('fs');
const path = require('path');

console.log(`
🔍 COMPREHENSIVE IMAGE LOCATION CHECK
====================================
`);

const locations = [
  'public/images/premium',
  'public/images',
  'public/media',
  'public/assets',
  'public',
  'images',
  'media',
  'assets',
];

const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

let totalFound = 0;
const results = [];

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
            path: filePath.replace(process.cwd(), '.').replace(/\\/g, '/'),
            size: stats.size,
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
            modified: stats.mtime.toISOString().split('T')[0],
          };
        });
      
      if (files.length > 0) {
        totalFound += files.length;
        results.push({
          location: loc,
          count: files.length,
          files: files,
        });
      }
    } catch (error) {
      void error;
      // Directory exists but can't read
    }
  }
});

if (totalFound === 0) {
  console.log(`
❌ NO IMAGES FOUND IN PROJECT
==============================

Checked locations:
${locations.map(loc => `  - ${loc}`).join('\n')}

💡 POSSIBLE REASONS:
===================

1. Images uploaded to WordPress (external URLs)
   → These are already configured in imageAssets.ts
   → No local files needed

2. Images uploaded to wrong location
   → Please check where you uploaded them
   → Expected: public/images/premium/

3. Images uploaded but not synced
   → Check if upload completed successfully
   → Verify file permissions

4. Images in different format
   → Check if they're .jpg, .jpeg, .png, or .webp
   → Other formats won't be detected

📝 NEXT STEPS:
=============

If you uploaded images locally:
  1. Confirm the exact folder path
  2. Verify files are .jpg/.png format
  3. Check file permissions
  4. Run this script again

If images are on WordPress:
  ✅ Already configured - no action needed
  ✅ Processing script will work with WordPress URLs
`);
} else {
  console.log(`
✅ FOUND ${totalFound} IMAGE(S)!
===============================
`);

  results.forEach(result => {
    console.log(`📁 ${result.location}: ${result.count} image(s)`);
    result.files.forEach(file => {
      console.log(`   ✓ ${file.name} (${file.sizeMB} MB) - ${file.path}`);
    });
    console.log('');
  });

  console.log(`
💡 TO PROCESS THESE IMAGES:
==========================
npm run process:images
`);
}

console.log(`
========================================
`);

