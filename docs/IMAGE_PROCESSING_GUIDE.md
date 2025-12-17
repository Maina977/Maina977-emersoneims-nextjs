# 🎬 CINEMATIC IMAGE PROCESSING GUIDE

## Overview

This guide explains how to process all images with **Hollywood/Cinematic color grading**, **4K resolution**, **sharpening**, and **cleanup** to ensure all images meet premium quality standards.

## Requirements

- **Resolution**: All images must be **4K (3840x2160)** or maintain aspect ratio with minimum 4K width
- **Color Grading**: Hollywood/Cinematic color grading applied
- **Quality**: Sharp, clear, bright, and clean
- **Format**: High-quality JPEG (95%) + WebP (90%) for web optimization

## Quick Start

### Option 1: Using NPM Scripts (Recommended)

```bash
# Process with Hollywood preset (default)
npm run process:images

# Process with Teal & Orange cinematic look
npm run process:images:teal

# Process with Blockbuster preset
npm run process:images:blockbuster
```

### Option 2: Using Batch Script (Windows)

```bash
# Double-click or run:
scripts\processImagesCinematic.bat
```

### Option 3: Using Node.js Directly

```bash
# Basic usage
node scripts/processImagesCinematic.js public/images/premium

# Specify output directory
node scripts/processImagesCinematic.js public/images/premium public/images/premium/processed

# Specify preset
node scripts/processImagesCinematic.js public/images/premium public/images/premium/processed hollywood
```

## Color Grading Presets

### 1. **Hollywood** (Default)
- **Look**: Classic Hollywood blockbuster
- **Characteristics**: Warm shadows, cool highlights, increased contrast
- **Best for**: General use, professional presentations
- **Settings**:
  - Saturation: 1.15x
  - Brightness: 1.05x
  - Contrast: 1.2x
  - Gamma: 1.1x
  - Warm tint: +5

### 2. **Teal & Orange**
- **Look**: Popular cinematic teal & orange look
- **Characteristics**: Enhanced color separation, vibrant
- **Best for**: Product photography, hero images
- **Settings**:
  - Saturation: 1.2x
  - Brightness: 1.08x
  - Contrast: 1.25x
  - Gamma: 1.15x
  - Warm tint: +8

### 3. **Blockbuster**
- **Look**: High-end blockbuster film look
- **Characteristics**: Maximum impact, high contrast
- **Best for**: Hero banners, featured images
- **Settings**:
  - Saturation: 1.1x
  - Brightness: 1.1x
  - Contrast: 1.3x
  - Gamma: 1.2x
  - Warm tint: +6

## Processing Features

### ✅ **4K Resolution**
- All images upscaled/resized to **3840x2160** (or maintain aspect ratio)
- Uses **Lanczos3** resampling for highest quality
- Minimum width: **3840px** (4K standard)

### ✅ **Color Grading**
- **Hollywood/Cinematic** color grading applied
- Warm shadows, cool highlights
- Increased contrast and saturation
- Gamma correction for optimal brightness

### ✅ **Sharpening**
- **Advanced sharpening** algorithm
- Sigma: 1.2 (sharpening strength)
- Flat areas: 1.0
- Jagged areas: 2.0
- Dual-pass sharpening for maximum clarity

### ✅ **Noise Reduction**
- Automatic denoising
- Threshold: 20
- Preserves detail while removing noise

### ✅ **Brightness & Contrast**
- Optimized brightness levels
- Enhanced contrast for visual impact
- Normalized color distribution

### ✅ **Web Optimization**
- **JPEG** output: 95% quality (high quality)
- **WebP** output: 90% quality (web optimized)
- Progressive JPEG encoding
- Automatic WebP conversion

## File Structure

```
public/
└── images/
    └── premium/
        ├── [original images]
        └── processed/          # Processed images saved here
            ├── image1.jpg     # 4K JPEG
            ├── image1.webp    # WebP version
            ├── image2.jpg
            ├── image2.webp
            └── ...
```

## Usage Examples

### Process All Images in Premium Folder

```bash
npm run process:images
```

This will:
1. Read all images from `public/images/premium/`
2. Process each image with Hollywood color grading
3. Upscale to 4K resolution
4. Apply sharpening and cleanup
5. Save to `public/images/premium/processed/`
6. Create WebP versions for web optimization

### Process Specific Directory

```bash
node scripts/processImagesCinematic.js path/to/images path/to/output hollywood
```

### Skip Existing Files

```bash
node scripts/processImagesCinematic.js public/images/premium public/images/premium/processed hollywood --skip-existing
```

## Processing Workflow

1. **Install Dependencies** (if not already installed)
   ```bash
   npm install
   ```

2. **Run Processing**
   ```bash
   npm run process:images
   ```

3. **Review Processed Images**
   - Check `public/images/premium/processed/` folder
   - Verify 4K resolution
   - Check color grading looks correct
   - Test WebP versions load properly

4. **Update Image References** (if needed)
   - Update `lib/data/imageAssets.ts` to point to processed images
   - Or replace original images with processed versions

## Technical Details

### Image Processing Pipeline

1. **Read Image** → Load original image
2. **Resize** → Upscale to 4K (Lanczos3 resampling)
3. **Denoise** → Remove noise while preserving detail
4. **Color Grading** → Apply cinematic color adjustments
5. **Sharpen** → Advanced sharpening algorithm
6. **Normalize** → Optimize brightness/contrast
7. **Export JPEG** → Save high-quality JPEG (95%)
8. **Export WebP** → Create WebP version (90%)

### Resolution Handling

- **16:9 Images**: Resized to exactly **3840x2160**
- **Other Aspect Ratios**: Maintained, but minimum width is **3840px**
- **Smaller Images**: Upscaled using high-quality Lanczos3 algorithm
- **Larger Images**: Downscaled maintaining quality

### Color Grading Algorithm

The color grading uses:
- **Modulate**: Brightness and saturation adjustments
- **Gamma**: Gamma correction for optimal brightness
- **Tint**: Warm/cool color temperature adjustment
- **Linear**: Contrast enhancement
- **Normalize**: Color distribution optimization

## Troubleshooting

### Sharp Not Installed

```bash
npm install sharp --save-dev
```

### Processing Errors

- Check image file formats (supports: JPG, JPEG, PNG, WebP)
- Ensure sufficient disk space
- Check file permissions

### Quality Issues

- Adjust preset settings in `scripts/processImagesCinematic.js`
- Modify `CONFIG` object for different quality levels
- Try different presets (hollywood, tealOrange, blockbuster)

## Best Practices

1. **Backup Original Images**: Keep originals before processing
2. **Test Presets**: Try different presets to find best look
3. **Batch Process**: Process all images at once for consistency
4. **Verify Results**: Check processed images before deploying
5. **Use WebP**: Use WebP versions for web to reduce file size

## Integration with Image Assets

After processing, update `lib/data/imageAssets.ts`:

```typescript
// Before
solar: {
  main: "/images/premium/solar-main.jpg",
}

// After (using processed images)
solar: {
  main: "/images/premium/processed/solar-main.webp", // Use WebP for web
  mainJpeg: "/images/premium/processed/solar-main.jpg", // Fallback JPEG
}
```

## Performance Considerations

- **Processing Time**: ~2-5 seconds per image (depends on size)
- **File Size**: 4K images are larger, but WebP helps reduce web size
- **Storage**: Ensure sufficient disk space for processed images
- **Memory**: Sharp uses efficient memory management

## Support

For issues or questions:
1. Check `scripts/processImagesCinematic.js` for configuration
2. Review Sharp documentation: https://sharp.pixelplumbing.com/
3. Adjust preset settings in the script

---

**Last Updated**: 2025-01-XX
**Status**: ✅ Ready for production use





