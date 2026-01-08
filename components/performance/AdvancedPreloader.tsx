'use client';

import { useEffect } from 'react';

/**
 * Apple-Level Aggressive Preloading
 * Preloads critical resources for instant page loads
 */
export default function AdvancedPreloader() {
  useEffect(() => {
    // Preload critical fonts
    const fonts = [
      '/fonts/geist-sans.woff2',
      '/fonts/space-grotesk.woff2',
      '/fonts/inter.woff2',
    ];

    // Preload critical images
    const images = [
      '/og-image.jpg',
      '/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png',
    ];

    // Preload critical routes
    const routes = [
      '/about-us',
      '/service',
      '/solution',
    ];

    const preloadResources = async () => {
      // Preload fonts
      fonts.forEach((font) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = font;
        document.head.appendChild(link);
      });

      // Preload images
      images.forEach((image) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = image;
        document.head.appendChild(link);
      });

      // Prefetch routes
      routes.forEach((route) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      });

    };

    preloadResources();
  }, []);

  return null;
}







