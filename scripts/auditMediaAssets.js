/**
 * COMPREHENSIVE MEDIA ASSETS AUDIT
 * Audits all images and videos across the entire website
 */

const fs = require('fs');
const path = require('path');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║     COMPREHENSIVE MEDIA ASSETS AUDIT - EMERSON EIMS         ║
╚══════════════════════════════════════════════════════════════╝
`);

// Image extensions
const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico'];
// Video extensions
const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.m4v', '.ogg'];

// Results storage
const results = {
  localImages: [],
  localVideos: [],
  codeImageReferences: [],
  codeVideoReferences: [],
  externalImageUrls: [],
  externalVideoUrls: [],
  imageUsage: {},
  videoUsage: {},
};

// Directories to search
const searchDirs = [
  'public',
  'app',
  'components',
  'lib',
];

// Files to check for references
const codeFiles = [
  'app/**/*.tsx',
  'app/**/*.ts',
  'app/**/*.jsx',
  'app/**/*.js',
  'components/**/*.tsx',
  'components/**/*.ts',
  'components/**/*.jsx',
  'components/**/*.js',
  'lib/**/*.ts',
  'lib/**/*.js',
];

/**
 * Recursively find all files with given extensions
 */
function findFiles(dir, extensions, results) {
  if (!fs.existsSync(dir)) return;
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      // Skip node_modules, .next, .git
      if (item.name === 'node_modules' || item.name === '.next' || item.name === '.git') {
        continue;
      }
      
      if (item.isDirectory()) {
        findFiles(fullPath, extensions, results);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (extensions.includes(ext)) {
          const stats = fs.statSync(fullPath);
          results.push({
            name: item.name,
            path: fullPath.replace(process.cwd(), '.').replace(/\\/g, '/'),
            size: stats.size,
            sizeMB: (stats.size / (1024 * 1024)).toFixed(2),
            extension: ext,
          });
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }
}

/**
 * Find all code files
 */
function findCodeFiles(dir, results) {
  if (!fs.existsSync(dir)) return;
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      
      if (item.name === 'node_modules' || item.name === '.next' || item.name === '.git') {
        continue;
      }
      
      if (item.isDirectory()) {
        findCodeFiles(fullPath, results);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (['.tsx', '.ts', '.jsx', '.js', '.json'].includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip
  }
}

/**
 * Extract image/video references from code
 */
function extractMediaReferences(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const references = {
    images: [],
    videos: [],
  };
  
  // Image patterns
  const imagePatterns = [
    /["']([^"']*\.(jpg|jpeg|png|webp|gif|svg|ico))["']/gi,
    /src=["']([^"']+)["']/gi,
    /url\(["']?([^"')]+\.(jpg|jpeg|png|webp|gif|svg|ico))["']?\)/gi,
    /https?:\/\/[^\s"')]+\.(jpg|jpeg|png|webp|gif|svg|ico)/gi,
  ];
  
  // Video patterns
  const videoPatterns = [
    /["']([^"']*\.(mp4|webm|mov|avi|mkv|m4v|ogg))["']/gi,
    /src=["']([^"']+\.(mp4|webm|mov|avi|mkv|m4v|ogg))["']/gi,
    /https?:\/\/[^\s"')]+\.(mp4|webm|mov|avi|mkv|m4v|ogg)/gi,
  ];
  
  // Extract images
  imagePatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const url = match[1] || match[0];
      if (url && !references.images.includes(url)) {
        references.images.push(url);
      }
    }
  });
  
  // Extract videos
  videoPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const url = match[1] || match[0];
      if (url && !references.videos.includes(url)) {
        references.videos.push(url);
      }
    }
  });
  
  return references;
}

console.log('🔍 Scanning local files...\n');

// Find local images
searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    findFiles(dir, imageExtensions, results.localImages);
  }
});

// Find local videos
searchDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    findFiles(dir, videoExtensions, results.localVideos);
  }
});

console.log('📝 Scanning code files for references...\n');

// Find code files
const codeFileList = [];
['app', 'components', 'lib'].forEach(dir => {
  if (fs.existsSync(dir)) {
    findCodeFiles(dir, codeFileList);
  }
});

// Extract references from code
codeFileList.forEach(filePath => {
  try {
    const refs = extractMediaReferences(filePath);
    refs.images.forEach(img => {
      if (img.startsWith('http')) {
        if (!results.externalImageUrls.includes(img)) {
          results.externalImageUrls.push(img);
        }
      } else {
        if (!results.codeImageReferences.includes(img)) {
          results.codeImageReferences.push(img);
        }
      }
    });
    refs.videos.forEach(vid => {
      if (vid.startsWith('http')) {
        if (!results.externalVideoUrls.includes(vid)) {
          results.externalVideoUrls.push(vid);
        }
      } else {
        if (!results.codeVideoReferences.includes(vid)) {
          results.codeVideoReferences.push(vid);
        }
      }
    });
  } catch (error) {
    // Skip files we can't read
  }
});

// Check imageAssets.ts specifically
const imageAssetsPath = path.join(process.cwd(), 'lib/data/imageAssets.ts');
if (fs.existsSync(imageAssetsPath)) {
  try {
    const content = fs.readFileSync(imageAssetsPath, 'utf8');
    const urlMatches = content.match(/https?:\/\/[^\s"')]+/g);
    if (urlMatches) {
      urlMatches.forEach(url => {
        if (imageExtensions.some(ext => url.toLowerCase().includes(ext))) {
          if (!results.externalImageUrls.includes(url)) {
            results.externalImageUrls.push(url);
          }
        }
        if (videoExtensions.some(ext => url.toLowerCase().includes(ext))) {
          if (!results.externalVideoUrls.includes(url)) {
            results.externalVideoUrls.push(url);
          }
        }
      });
    }
  } catch (error) {
    // Skip
  }
}

// Calculate totals
const totalLocalImages = results.localImages.length;
const totalLocalVideos = results.localVideos.length;
const totalCodeImageRefs = results.codeImageReferences.length;
const totalCodeVideoRefs = results.codeVideoReferences.length;
const totalExternalImages = results.externalImageUrls.length;
const totalExternalVideos = results.externalVideoUrls.length;

const totalImages = totalLocalImages + totalExternalImages;
const totalVideos = totalLocalVideos + totalExternalVideos;

// Calculate total sizes
const localImageSize = results.localImages.reduce((sum, img) => sum + img.size, 0);
const localVideoSize = results.localVideos.reduce((sum, vid) => sum + vid.size, 0);

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    AUDIT RESULTS SUMMARY                     ║
╚══════════════════════════════════════════════════════════════╝

📊 IMAGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Local Files:        ${totalLocalImages.toString().padStart(4)} files (${(localImageSize / (1024 * 1024)).toFixed(2)} MB)
  External URLs:      ${totalExternalImages.toString().padStart(4)} references
  Code References:    ${totalCodeImageRefs.toString().padStart(4)} references
  ────────────────────────────────────────────────────────────
  TOTAL IMAGES:       ${totalImages.toString().padStart(4)} unique assets

📹 VIDEOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Local Files:        ${totalLocalVideos.toString().padStart(4)} files (${(localVideoSize / (1024 * 1024)).toFixed(2)} MB)
  External URLs:      ${totalExternalVideos.toString().padStart(4)} references
  Code References:    ${totalCodeVideoRefs.toString().padStart(4)} references
  ────────────────────────────────────────────────────────────
  TOTAL VIDEOS:       ${totalVideos.toString().padStart(4)} unique assets

📈 GRAND TOTAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TOTAL MEDIA:        ${(totalImages + totalVideos).toString().padStart(4)} assets
`);

// Detailed breakdown
if (totalLocalImages > 0) {
  console.log(`
📁 LOCAL IMAGES BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  const byExtension = {};
  results.localImages.forEach(img => {
    byExtension[img.extension] = (byExtension[img.extension] || 0) + 1;
  });
  Object.entries(byExtension).forEach(([ext, count]) => {
    console.log(`  ${ext.padEnd(6)} ${count.toString().padStart(3)} files`);
  });
  
  console.log(`\n  Top 10 Largest Images:`);
  results.localImages
    .sort((a, b) => b.size - a.size)
    .slice(0, 10)
    .forEach((img, idx) => {
      console.log(`  ${(idx + 1).toString().padStart(2)}. ${img.name.padEnd(40)} ${img.sizeMB.padStart(8)} MB`);
    });
}

if (totalLocalVideos > 0) {
  console.log(`
📹 LOCAL VIDEOS BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  const byExtension = {};
  results.localVideos.forEach(vid => {
    byExtension[vid.extension] = (byExtension[vid.extension] || 0) + 1;
  });
  Object.entries(byExtension).forEach(([ext, count]) => {
    console.log(`  ${ext.padEnd(6)} ${count.toString().padStart(3)} files`);
  });
  
  console.log(`\n  All Videos:`);
  results.localVideos.forEach((vid, idx) => {
    console.log(`  ${(idx + 1).toString().padStart(2)}. ${vid.name.padEnd(40)} ${vid.sizeMB.padStart(8)} MB`);
  });
}

if (totalExternalImages > 0) {
  console.log(`
🌐 EXTERNAL IMAGE SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  const domains = {};
  results.externalImageUrls.forEach(url => {
    try {
      const domain = new URL(url).hostname;
      domains[domain] = (domains[domain] || 0) + 1;
    } catch (e) {
      // Invalid URL
    }
  });
  Object.entries(domains)
    .sort((a, b) => b[1] - a[1])
    .forEach(([domain, count]) => {
      console.log(`  ${domain.padEnd(50)} ${count.toString().padStart(3)} images`);
    });
  
  console.log(`\n  Sample External Images (first 10):`);
  results.externalImageUrls.slice(0, 10).forEach((url, idx) => {
    const shortUrl = url.length > 70 ? url.substring(0, 67) + '...' : url;
    console.log(`  ${(idx + 1).toString().padStart(2)}. ${shortUrl}`);
  });
}

if (totalExternalVideos > 0) {
  console.log(`
🌐 EXTERNAL VIDEO SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  const domains = {};
  results.externalVideoUrls.forEach(url => {
    try {
      const domain = new URL(url).hostname;
      domains[domain] = (domains[domain] || 0) + 1;
    } catch (e) {
      // Invalid URL
    }
  });
  Object.entries(domains)
    .sort((a, b) => b[1] - a[1])
    .forEach(([domain, count]) => {
      console.log(`  ${domain.padEnd(50)} ${count.toString().padStart(3)} videos`);
    });
  
  console.log(`\n  All External Videos:`);
  results.externalVideoUrls.forEach((url, idx) => {
    const shortUrl = url.length > 70 ? url.substring(0, 67) + '...' : url;
    console.log(`  ${(idx + 1).toString().padStart(2)}. ${shortUrl}`);
  });
}

// Storage summary
console.log(`
💾 STORAGE SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Local Images:      ${(localImageSize / (1024 * 1024)).toFixed(2)} MB
  Local Videos:      ${(localVideoSize / (1024 * 1024)).toFixed(2)} MB
  ────────────────────────────────────────────────────────────
  Total Local:       ${((localImageSize + localVideoSize) / (1024 * 1024)).toFixed(2)} MB
`);

// Recommendations
console.log(`
💡 RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

if (totalLocalImages === 0 && totalExternalImages > 0) {
  console.log(`
  ⚠️  No local images found, but ${totalExternalImages} external image references exist.
  ✅ This is fine if images are hosted on WordPress/CDN.
  💡 To process images locally, upload them to: public/images/premium/
`);
}

if (totalLocalImages > 0) {
  console.log(`
  ✅ ${totalLocalImages} local images found.
  💡 Run 'npm run process:images' to apply cinematic color grading.
`);
}

if (totalLocalVideos === 0 && totalExternalVideos > 0) {
  console.log(`
  ⚠️  No local videos found, but ${totalExternalVideos} external video references exist.
  ✅ Videos are likely hosted externally (WordPress/CDN).
`);
}

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    AUDIT COMPLETE                           ║
╚══════════════════════════════════════════════════════════════╝
`);

