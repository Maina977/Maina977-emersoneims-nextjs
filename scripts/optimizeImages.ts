/**
 * IMAGE OPTIMIZATION UTILITY
 * Compress and optimize all images for web delivery
 * Targets: <100KB per image, WebP format, lazy loading
 */

import sharp from 'sharp';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

interface OptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  path: string;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_PATTERNS = ['**/*.{jpg,jpeg,png,webp}'];
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;
const QUALITY = 85;

async function optimizeImage(filePath: string): Promise<OptimizationResult> {
  const stats = await fs.stat(filePath);
  const originalSize = stats.size;
  
  // Read and optimize image
  const image = sharp(filePath);
  const metadata = await image.metadata();
  
  // Determine if resize is needed
  const needsResize = 
    (metadata.width && metadata.width > MAX_WIDTH) ||
    (metadata.height && metadata.height > MAX_HEIGHT);
  
  let pipeline = image;
  
  if (needsResize) {
    pipeline = pipeline.resize(MAX_WIDTH, MAX_HEIGHT, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }
  
  // Convert to WebP with optimization
  const webpPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  
  await pipeline
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(webpPath);
  
  const webpStats = await fs.stat(webpPath);
  const optimizedSize = webpStats.size;
  const savings = ((originalSize - optimizedSize) / originalSize) * 100;
  
  return {
    originalSize,
    optimizedSize,
    savings,
    path: filePath,
  };
}

async function optimizeAllImages() {
  console.log('🖼️  Starting image optimization...\n');
  
  const imageFiles = await glob(IMAGE_PATTERNS, {
    cwd: PUBLIC_DIR,
    absolute: true,
  });
  
  console.log(`Found ${imageFiles.length} images to optimize\n`);
  
  const results: OptimizationResult[] = [];
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const filePath of imageFiles) {
    try {
      // Skip if already WebP
      if (filePath.endsWith('.webp')) {
        continue;
      }
      
      console.log(`Optimizing: ${path.basename(filePath)}`);
      const result = await optimizeImage(filePath);
      results.push(result);
      
      totalOriginal += result.originalSize;
      totalOptimized += result.optimizedSize;
      
      console.log(
        `  ✓ ${(result.originalSize / 1024).toFixed(2)}KB → ${(result.optimizedSize / 1024).toFixed(2)}KB (${result.savings.toFixed(1)}% savings)\n`
      );
    } catch (error) {
      console.error(`  ✗ Failed to optimize ${filePath}:`, error);
    }
  }
  
  const totalSavings = ((totalOriginal - totalOptimized) / totalOriginal) * 100;
  
  console.log('\n📊 Optimization Summary:');
  console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total savings: ${totalSavings.toFixed(1)}%`);
  console.log(`   Images processed: ${results.length}`);
  console.log('\n✅ Image optimization complete!\n');
}

// Run if called directly
if (require.main === module) {
  optimizeAllImages().catch(console.error);
}

export { optimizeImage, optimizeAllImages };
