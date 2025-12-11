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
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/924.png',
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
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/63-scaled.png',
    alt: 'Generator 63',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/GEN-1-1-scaled.png',
    alt: 'Generator GEN-1',
    width: 1920,
    height: 1080,
    priority: true, // High priority
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/70-scaled.png',
    alt: 'Generator 70',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/IMG_20221222_153914_840-scaled.jpg',
    alt: 'Generator Installation',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/IMG_20240620_152044_448-1-scaled.jpg',
    alt: 'Generator Maintenance',
    width: 1920,
    height: 1080,
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
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/PERKINS-FILTER-2-1.webp',
    alt: 'Perkins Filter',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'generators',
  },

  // Solar Images
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/solar-changeover-control-scaled.png',
    alt: 'Solar Changeover Control',
    width: 1920,
    height: 1080,
    priority: true,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/16.png',
    alt: 'Solar Installation 16',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/solar-for-flower-farms-scaled.png',
    alt: 'Solar for Flower Farms',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/solar-power-farms-scaled.png',
    alt: 'Solar Power Farms',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/7.png',
    alt: 'Solar Installation 7',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/4.png',
    alt: 'Solar Installation 4',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/14-1.png',
    alt: 'Solar Installation 14',
    width: 1920,
    height: 1080,
    priority: false,
    hollywoodGrading: true,
    category: 'solar',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/11/solar-hotel-heaters-scaled.png',
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
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/FOR-TRIALS-IN-KADENCE-2.mp4',
    alt: 'Emerson EIMS Showcase Video',
    width: 1920,
    height: 1080,
    priority: true,
    hollywoodGrading: true,
    category: 'videos',
  },
  {
    src: 'https://www.emersoneims.com/wp-content/uploads/2025/10/Solution1.mp4',
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


