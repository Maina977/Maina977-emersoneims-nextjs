/**
 * VIDEO OPTIMIZATION UTILITY
 * Compress videos for optimal web delivery
 * Target: <20MB per video, H.264 codec, optimized bitrate
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import path from 'path';
import fs from 'fs/promises';

const execAsync = promisify(exec);

interface VideoOptimizationResult {
  originalSize: number;
  optimizedSize: number;
  savings: number;
  path: string;
}

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEO_PATTERNS = ['**/*.{mp4,mov,avi,webm}'];
const MAX_BITRATE = '2M';
const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;

async function checkFFmpeg(): Promise<boolean> {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch {
    console.error('❌ FFmpeg not found. Please install FFmpeg first.');
    console.log('\nInstall FFmpeg:');
    console.log('  Windows: choco install ffmpeg');
    console.log('  macOS: brew install ffmpeg');
    console.log('  Linux: sudo apt-get install ffmpeg\n');
    return false;
  }
}

async function optimizeVideo(filePath: string): Promise<VideoOptimizationResult> {
  const stats = await fs.stat(filePath);
  const originalSize = stats.size;
  
  const outputPath = filePath.replace(/\.(mp4|mov|avi|webm)$/i, '.optimized.mp4');
  
  // FFmpeg optimization command
  // - H.264 codec for maximum compatibility
  // - Constrained bitrate
  // - Fast start for web streaming
  // - Resize to max 1920x1080
  const command = `ffmpeg -i "${filePath}" \
    -c:v libx264 \
    -preset slow \
    -crf 23 \
    -maxrate ${MAX_BITRATE} \
    -bufsize ${MAX_BITRATE} \
    -vf "scale='min(${TARGET_WIDTH},iw)':'min(${TARGET_HEIGHT},ih)':force_original_aspect_ratio=decrease" \
    -c:a aac \
    -b:a 128k \
    -movflags +faststart \
    -y \
    "${outputPath}"`;
  
  console.log(`  Processing: ${path.basename(filePath)}`);
  
  try {
    await execAsync(command);
    
    const optimizedStats = await fs.stat(outputPath);
    const optimizedSize = optimizedStats.size;
    const savings = ((originalSize - optimizedSize) / originalSize) * 100;
    
    return {
      originalSize,
      optimizedSize,
      savings,
      path: filePath,
    };
  } catch (error) {
    console.error(`  ✗ Failed to optimize ${filePath}`);
    throw error;
  }
}

async function optimizeAllVideos() {
  console.log('🎬 Starting video optimization...\n');
  
  const hasFFmpeg = await checkFFmpeg();
  if (!hasFFmpeg) {
    return;
  }
  
  const videoFiles = await glob(VIDEO_PATTERNS, {
    cwd: PUBLIC_DIR,
    absolute: true,
  });
  
  // Filter out already optimized files
  const filesToOptimize = videoFiles.filter(f => !f.includes('.optimized.'));
  
  console.log(`Found ${filesToOptimize.length} videos to optimize\n`);
  
  const results: VideoOptimizationResult[] = [];
  let totalOriginal = 0;
  let totalOptimized = 0;
  
  for (const filePath of filesToOptimize) {
    try {
      const result = await optimizeVideo(filePath);
      results.push(result);
      
      totalOriginal += result.originalSize;
      totalOptimized += result.optimizedSize;
      
      console.log(
        `  ✓ ${(result.originalSize / 1024 / 1024).toFixed(2)}MB → ${(result.optimizedSize / 1024 / 1024).toFixed(2)}MB (${result.savings.toFixed(1)}% savings)\n`
      );
    } catch (error) {
      console.error(`  ✗ Error optimizing ${filePath}`);
    }
  }
  
  const totalSavings = totalOriginal > 0 
    ? ((totalOriginal - totalOptimized) / totalOriginal) * 100 
    : 0;
  
  console.log('\n📊 Video Optimization Summary:');
  console.log(`   Original total: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Optimized total: ${(totalOptimized / 1024 / 1024).toFixed(2)}MB`);
  console.log(`   Total savings: ${totalSavings.toFixed(1)}%`);
  console.log(`   Videos processed: ${results.length}`);
  console.log('\n✅ Video optimization complete!\n');
  console.log('📝 Note: Optimized videos are saved with .optimized.mp4 extension');
  console.log('   Review them, then replace originals if satisfied.\n');
}

// Run if called directly
if (require.main === module) {
  optimizeAllVideos().catch(console.error);
}

export { optimizeVideo, optimizeAllVideos };
