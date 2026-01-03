# Quick Integration Guide - Media Optimization

## 🚀 Quick Start

### Replace Images in Your Components

**Before:**
```jsx
<img src="/images/photo.jpg" alt="Photo" />
```

**After:**
```jsx
import OptimizedImage from '@/components/media/OptimizedImage';

<OptimizedImage
  src="/images/photo.jpg"
  alt="Photo"
  width={1920}
  height={1080}
  hollywoodGrading={true}
/>
```

### Replace Videos

**Before:**
```jsx
<video src="/media/video.mp4" />
```

**After:**
```jsx
import OptimizedVideo from '@/components/media/OptimizedVideo';

<OptimizedVideo
  src="/media/video.mp4"
  poster="/images/video-poster.jpg"
  autoplay={false}
  loop={true}
  muted={true}
  hollywoodGrading={true}
/>
```

## 📝 Example: Update a Page Component

```tsx
'use client';

import OptimizedImage from '@/components/media/OptimizedImage';
import OptimizedVideo from '@/components/media/OptimizedVideo';
import { getMediaByCategory } from '@/lib/media/mediaLibrary';

export default function MyPage() {
  const generatorImages = getMediaByCategory('generators');
  const videos = getMediaByCategory('videos');

  return (
    <div>
      {/* Single optimized image */}
      <OptimizedImage
        src="https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png"
        alt="Generator"
        width={1920}
        height={1080}
        priority={true}
        hollywoodGrading={true}
      />

      {/* Video with poster */}
      <OptimizedVideo
        src={videos[0].src}
        alt={videos[0].alt}
        poster="/images/video-poster.jpg"
        hollywoodGrading={true}
      />

      {/* Gallery of images */}
      <div className="grid grid-cols-3 gap-4">
        {generatorImages.map((img, index) => (
          <OptimizedImage
            key={index}
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            hollywoodGrading={img.hollywoodGrading}
          />
        ))}
      </div>
    </div>
  );
}
```

## ✅ Benefits You Get

1. **Automatic Optimization** - Images converted to WebP/AVIF
2. **Lazy Loading** - Only loads when visible
3. **Hollywood Grading** - 4K cinematic color correction
4. **Fast Loading** - Zero lagging
5. **Error Handling** - Graceful fallbacks
6. **Mobile Optimized** - Fast on all devices

## 🎨 Hollywood Grading Applied Automatically

All images/videos with `hollywoodGrading={true}` get:
- Enhanced contrast
- Rich saturation
- Professional brightness
- 4K optimization
- GPU acceleration

## 📦 All Your Media Files

All your provided URLs are now in `lib/media/mediaLibrary.ts`:
- ✅ 18 Images (generators + solar)
- ✅ 2 Videos
- ✅ 4 SVG Graphics

Ready to use! 🚀


