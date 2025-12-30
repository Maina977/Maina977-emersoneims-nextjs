/**
 * Media Library - All images and videos with optimization config
 * Organized by category for easy management
 */

export interface MediaItem {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  hollywoodGrading?: boolean;
  category: string;
}

export const mediaLibrary: MediaItem[] = [
  // Generator Images
  {
    src: '/images/924.png',
    alt: 'Generator 924',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-3-1.png',
    alt: 'Generator GEN-3',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/63.png',
    alt: 'Generator 63',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/GEN%202-1920x1080.png',
    alt: 'Generator GEN-1',
    width: 1920,
    height: 1080,
    priority: true, // High priority
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/70.png',
    alt: 'Generator 70',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/IMG_20221222_153914_840.jpg',
    alt: 'Generator Installation',
    width: 3968,
    height: 2976,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/IMG_20240620_152044_448%20(1).jpg',
    alt: 'Generator Maintenance',
    width: 5952,
    height: 7936,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/BAT-5.png',
    alt: 'Battery System',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: '/images/PERKINS%20FILTER%202%20(1).webp',
    alt: 'Perkins Filter',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },

  // Solar Images
  {
    src: '/images/solar%20changeover%20control.png',
    alt: 'Solar Changeover Control',
    width: 1920,
    height: 1080,
    priority: true,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/16.png',
    alt: 'Solar Installation 16',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/solar%20for%20flower%20farms.png',
    alt: 'Solar for Flower Farms',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/solar%20power%20farms.png',
    alt: 'Solar Power Farms',
    width: 3840,
    height: 2160,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/7.png',
    alt: 'Solar Installation 7',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/4.png',
    alt: 'Solar Installation 4',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/14.png',
    alt: 'Solar Installation 14',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: '/images/solar%20hotel%20heaters.png',
    alt: 'Solar Hotel Heaters',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/2-2.png',
    alt: 'Solar Installation 2',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },

  // Videos
  {
    src: '/videos/FOR%20TRIALS%20IN%20KADENCE.mp4',
    alt: 'Emerson EIMS Showcase Video',
    width: 1920,
    height: 1080,
    priority: true,
    hollywoodGrading: true,
    category: 'videos',
  },
  {
    src: '/videos/Solution(1).mp4',
    alt: 'Solutions Video',
    width: 1920,
    height: 1080,
    priority: true,
    hollywoodGrading: true,
    category: 'videos',
  },

  // SVG Graphics
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-7.svg',
    alt: 'Design Element 7',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: false, // SVGs don't need color grading
    category: 'graphics',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-1.svg',
    alt: 'Design Element 1',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: false,
    category: 'graphics',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-2.svg',
    alt: 'Design Element 2',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: false,
    category: 'graphics',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/Untitled-design-4.svg',
    alt: 'Design Element 4',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: false,
    category: 'graphics',
  },
];

/**
 * Get media by category
 */
export function getMediaByCategory(category: string): MediaItem[] {
  return mediaLibrary.filter((item) => item.category === category);
}

/**
 * Get videos only
 */
export function getVideos(): MediaItem[] {
  return mediaLibrary.filter((item) => item.category === 'videos');
}

/**
 * Get images only
 */
export function getImages(): MediaItem[] {
  return mediaLibrary.filter((item) => item.category !== 'videos');
}


