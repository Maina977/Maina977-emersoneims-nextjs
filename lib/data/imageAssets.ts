/**
 * STREAMLINED IMAGE ASSETS DATABASE
 * Essential image references for EmersonEIMS website
 * Optimized for performance and maintainability
 */

export const imageAssets = {
  // ==================== LOGOS & BRANDING ====================
  logos: {
    main: "/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png",
    favicon: "/favicon.ico",
    appleTouch: "/apple-touch-icon.png",
    ogImage: "/og-image.jpg",
    twitterImage: "/twitter-image.jpg",
  },

  // ==================== HERO & BANNER IMAGES ====================
  hero: {
    homepage: "/images/tnpl-diesal-generator-1000x1000-1920x1080.webp",
    generators: "/images/GEN%202-1920x1080.png",
    solar: "/images/solar%20power%20farms.png",
    diagnostics: "/images/GEN%202-1920x1080.png",
    contact: "/images/IMG_20251115_101219.jpg",
  },

  // ==================== GENERATORS ====================
  generators: {
    main: "/images/GEN%202-1920x1080.png",
    warehouse: "/videos/VID-20250930-WA0000%20(3).mp4",
    poster: "/images/GEN%202-1920x1080.png",
    control: "/images/solar%20changeover%20control.png",
    maintenance: "/images/IMG-20250804-WA0006.jpg",
    technicians: "/images/IMG_20221222_153914_840.jpg",
    engineParts: "/images/ENGINE%20PARTS.png",
    perkinsparts: "/images/Perkins-4000-Parts.webp",
    filters: "/images/PERKINS%20FILTER%202%20(1).webp",
    warehouse901: "/images/901.png",
    fgWilson: "/images/FG-WILSON-GENERATOR.jpg",
    ntsa: "/images/NTSA- ATLAS COPCO GENERATOR.jpg",
    greenheart: "/images/GREENHEART KILIFI GENERATOR.jpg",
  },

  // ==================== SOLAR ====================
  solar: {
    farm: "/images/solar%20power%20farms.png",
    panels: "/images/solar%20panel%20installation.png",
    inverter: "/images/solar%20inverter.png",
    battery: "/images/solar%20battery%20bank.png",
  },

  // ==================== SERVICES ====================
  services: {
    motorRewinding: "/images/motor-rewinding-workshop.png",
    waterTreatment: "/images/water-treatment-plant.png",
    structuralSteel: "/images/structural-steel-work.png",
    steelFabrication: "/images/steel-fabrication-workshop.png",
    generatorCanopy: "/images/generator-canopy-fabrication.png",
    hvac: "/images/IMG_20240620_152044_448%20(1).jpg",
  },

  // ==================== BRANDS ====================
  brands: {
    cummins: "/brand/IMG_0001.jpg",
    perkins: "/brand/IMG_0002.jpg",
    fgWilson: "/brand/IMG_0003.jpg",
    caterpillar: "/brand/IMG_0004.jpg",
    deepsea: "/brand/IMG_0005.jpg",
    stamford: "/brand/IMG_0006.jpg",
    mecc: "/brand/IMG_0007.jpg",
    leroy: "/brand/IMG_0008.jpg",
  },

  // ==================== COUNTIES & LOCATIONS ====================
  locations: {
    nairobi: "/images/IMG_20251115_101219.jpg",
    mombasa: "/images/IMG_20251115_101219.jpg",
    kisumu: "/images/IMG_20251115_101219.jpg",
    // Add specific county images as needed
  },

  // ==================== DIAGNOSTICS & TECHNICAL ====================
  diagnostics: {
    cockpit: "/images/GEN%202-1920x1080.png",
    controlPanel: "/images/solar%20changeover%20control.png",
    dashboard: "/images/GEN%202-1920x1080.png",
  },

  // ==================== FALLBACK ====================
  fallback: {
    placeholder: "/images/GEN%202-1920x1080.png",
    default: "/images/tnpl-diesal-generator-1000x1000-1920x1080.webp",
  },
};

// Helper function to get image by key path (e.g., "generators.main")
export function getImage(path: string): string {
  const keys = path.split('.');
  let value: any = imageAssets;

  for (const key of keys) {
    value = value?.[key];
    if (!value) return imageAssets.fallback.default;
  }

  return typeof value === 'string' ? value : imageAssets.fallback.default;
}

// Export default for convenience
export default imageAssets;
