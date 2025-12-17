/**
 * Centralized Media Assets - NO DUPLICATIONS
 * Single source of truth for all images and videos
 * Each asset used only once across all pages
 */

export interface MediaAsset {
  url: string;
  type: 'image' | 'video';
  alt?: string;
  usedIn: string[]; // Pages where it's used
  category?: 'solar' | 'generator' | 'controls' | 'general' | 'logo' | 'video';
}

// Track all media assets to prevent duplication
export const MEDIA_ASSETS: Record<string, MediaAsset> = {
  // Solar Images
  'solar-changeover-control': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/solar-changeover-control-scaled.png',
    type: 'image',
    alt: 'Solar changeover control system',
    usedIn: [],
    category: 'solar',
  },
  'battery-5': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/BAT-5.png',
    type: 'image',
    alt: 'Battery system installation',
    usedIn: [],
    category: 'solar',
  },
  'solar-hotel-heaters': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/solar-hotel-heaters-scaled.png',
    type: 'image',
    alt: 'Solar hotel heating system',
    usedIn: [],
    category: 'solar',
  },
  'solar-image-11': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/11.png',
    type: 'image',
    alt: 'Solar installation showcase',
    usedIn: [],
    category: 'solar',
  },
  'solar-image-4': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/4-4.png',
    type: 'image',
    alt: 'Solar system component',
    usedIn: [],
    category: 'solar',
  },
  
  // General Images
  'installation-photo': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/11/IMG_20221119_172228_822-scaled.jpg',
    type: 'image',
    alt: 'EmersonEIMS installation project',
    usedIn: [],
    category: 'general',
  },
  'spare-parts': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/10/SPARES_300dpi.-fotor-enhance-20250821225707-1-1920x1080-1.webp',
    type: 'image',
    alt: 'Generator spare parts inventory',
    usedIn: [],
    category: 'generator',
  },
  
  // Logo
  'logo-main': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/10/cropped-Emerson-EIMS-Logo-and-Tagline-PNG-Picsart-BackgroundRemover.png',
    type: 'image',
    alt: 'EmersonEIMS Logo',
    usedIn: [],
    category: 'logo',
  },
  
  // SVG Graphics
  'design-4': {
    url: 'https://emersoneims.com/wp-content/uploads/2025/10/Untitled-design-4.svg',
    type: 'image',
    alt: 'EmersonEIMS design graphic',
    usedIn: [],
    category: 'general',
  },
};

// Get unused assets by category
export function getUnusedAssets(category?: string): MediaAsset[] {
  return Object.values(MEDIA_ASSETS).filter(
    asset => asset.usedIn.length === 0 && (!category || asset.category === category)
  );
}

// Mark asset as used
export function markAssetUsed(key: string, page: string) {
  if (MEDIA_ASSETS[key] && !MEDIA_ASSETS[key].usedIn.includes(page)) {
    MEDIA_ASSETS[key].usedIn.push(page);
  }
}








