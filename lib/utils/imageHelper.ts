/**
 * IMAGE HELPER UTILITIES
 * Centralized image management and fallback handling
 */

import { imageAssets } from '@/lib/data/imageAssets';

/**
 * Get optimized image URL with automatic fallback
 */
export function getOptimizedImageUrl(
  category: keyof typeof imageAssets,
  key: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
    fallback?: string;
  }
): string {
  const categoryImages = imageAssets[category] as Record<string, string> | undefined;
  const baseUrl = categoryImages?.[key] || options?.fallback || imageAssets.fallbacks.placeholder;
  
  // If it's a WordPress URL, we can add query params for optimization
  if (baseUrl.includes('wp-content')) {
    const params = new URLSearchParams();
    if (options?.width) params.append('w', options.width.toString());
    if (options?.height) params.append('h', options.height.toString());
    if (options?.quality) params.append('q', options.quality.toString());
    params.append('fit', 'crop');
    
    return `${baseUrl}?${params.toString()}`;
  }
  
  return baseUrl;
}

/**
 * Get responsive image srcset
 */
export function getResponsiveSrcSet(
  category: keyof typeof imageAssets,
  key: string,
  sizes: number[] = [400, 800, 1200, 1920]
): string {
  return sizes
    .map((size) => {
      const url = getOptimizedImageUrl(category, key, { width: size });
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * Check if image exists (for error handling)
 */
export async function checkImageExists(url: string): Promise<boolean> {
  if (typeof window === 'undefined') return true; // SSR - assume exists
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get image dimensions from URL (if available)
 */
export function getImageDimensions(
  category: keyof typeof imageAssets,
  key: string
): { width: number; height: number } | null {
  // Predefined dimensions for known images
  const dimensions: Record<string, { width: number; height: number }> = {
    'hero.homepage': { width: 1920, height: 1080 },
    'hero.solar': { width: 1920, height: 1080 },
    'hero.generators': { width: 1920, height: 1080 },
    'solar.showcase1': { width: 3840, height: 2160 },
    'solar.showcase2': { width: 3840, height: 2160 },
    'solar.showcase4': { width: 1920, height: 1080 },
    'solar.showcase5': { width: 3840, height: 2160 },
    'solar.showcase7': { width: 3840, height: 2160 },
    'solar.showcase11': { width: 1920, height: 1080 },
  };
  
  const dimensionKey = `${category}.${key}`;
  return dimensions[dimensionKey] || { width: 1200, height: 800 };
}

/**
 * Generate image alt text based on category and key
 */
export function generateImageAlt(
  category: keyof typeof imageAssets,
  key: string
): string {
  const altTexts: Record<string, string> = {
    'hero.homepage': 'EmersonEIMS - Premium Power Engineering Solutions',
    'hero.solar': 'Solar Energy Systems by EmersonEIMS',
    'hero.generators': 'Diesel Generators by EmersonEIMS',
    'caseStudies.bigotFlowers': 'Bigot Flowers - Power Solutions Case Study',
    'caseStudies.stAustin': 'St. Austin Academy - Energy Infrastructure',
    'caseStudies.kivukoni': 'Kivukoni International School - Solar Solutions',
    'caseStudies.greenheart': 'Greenheart Kilifi - Hospitality Energy Solutions',
    'caseStudies.ntsa': 'NTSA - Government Power Infrastructure',
    'caseStudies.afrhearb': 'AfRhearb Limited - Industrial Power Systems',
    'caseStudies.kimfay': 'Kimfay Limited - Commercial Energy Solutions',
    'caseStudies.sanergy': 'Sanergy Limited - Waste Management Power',
  };
  
  const altKey = `${category}.${key}`;
  return altTexts[altKey] || `EmersonEIMS ${category} - ${key}`;
}


