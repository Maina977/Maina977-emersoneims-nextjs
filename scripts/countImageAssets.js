/**
 * Count exact number of images in imageAssets.ts
 */

const fs = require('fs');
const path = require('path');

const imageAssetsPath = path.join(process.cwd(), 'lib/data/imageAssets.ts');
const content = fs.readFileSync(imageAssetsPath, 'utf8');

// Count all image references
const imagePattern = /['"]([^'"]*\.(jpg|jpeg|png|webp|gif|svg|ico))['"]/gi;
const videoPattern = /['"]([^'"]*\.(mp4|webm|mov|avi|mkv|m4v|ogg))['"]/gi;

const imageMatches = content.match(imagePattern) || [];
const videoMatches = content.match(videoPattern) || [];

const localImages = imageMatches.filter(m => !m.includes('http') && !m.includes('https')).length;
const externalImages = imageMatches.filter(m => m.includes('http') || m.includes('https')).length;
const localVideos = videoMatches.filter(m => !m.includes('http') && !m.includes('https')).length;
const externalVideos = videoMatches.filter(m => m.includes('http') || m.includes('https')).length;

console.log(`
╔══════════════════════════════════════════════════════════════╗
║         IMAGE ASSETS DATABASE ANALYSIS                      ║
╚══════════════════════════════════════════════════════════════╝

📊 IMAGE ASSETS BREAKDOWN (from imageAssets.ts)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Local Image References:     ${localImages.toString().padStart(3)} references
  External Image References:  ${externalImages.toString().padStart(3)} references
  ────────────────────────────────────────────────────────────
  TOTAL IMAGE REFERENCES:     ${(localImages + externalImages).toString().padStart(3)} references

📹 VIDEO ASSETS BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Local Video References:     ${localVideos.toString().padStart(3)} references
  External Video References: ${externalVideos.toString().padStart(3)} references
  ────────────────────────────────────────────────────────────
  TOTAL VIDEO REFERENCES:    ${(localVideos + externalVideos).toString().padStart(3)} references

📈 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Total Media References:    ${(localImages + externalImages + localVideos + externalVideos).toString().padStart(3)} references
`);

// Count by category
const categories = {
  logos: (content.match(/logos:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  hero: (content.match(/hero:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  generators: (content.match(/generators:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  solar: (content.match(/solar:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  caseStudies: (content.match(/caseStudies:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  services: (content.match(/services:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  company: (content.match(/company:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  technical: (content.match(/technical:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  backgrounds: (content.match(/backgrounds:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  electrical: (content.match(/electrical:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  controls: (content.match(/controls:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  batteries: (content.match(/batteries:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
  parts: (content.match(/parts:\s*\{[\s\S]*?\}/) || [''])[0].match(imagePattern)?.length || 0,
};

console.log(`
📁 IMAGES BY CATEGORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);

Object.entries(categories)
  .sort((a, b) => b[1] - a[1])
  .forEach(([category, count]) => {
    if (count > 0) {
      console.log(`  ${category.padEnd(20)} ${count.toString().padStart(3)} images`);
    }
  });

const totalByCategory = Object.values(categories).reduce((sum, count) => sum + count, 0);
console.log(`  ${'─'.repeat(50)}`);
console.log(`  ${'TOTAL'.padEnd(20)} ${totalByCategory.toString().padStart(3)} images`);

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    ANALYSIS COMPLETE                         ║
╚══════════════════════════════════════════════════════════════╝
`);




