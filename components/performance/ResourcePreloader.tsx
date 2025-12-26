'use client';

import { useEffect } from 'react';

interface ResourcePreloaderProps {
  resources?: {
    images?: string[];
    fonts?: string[];
    scripts?: string[];
    styles?: string[];
  };
}

export default function ResourcePreloader({ resources }: ResourcePreloaderProps) {
  useEffect(() => {
    const preloadResources = () => {
      const defaultResources = {
        images: [
          '/logo.svg',
          '/hero-bg.jpg',
          '/favicon.ico',
        ],
        fonts: [
          '/fonts/space-grotesk.woff2',
          '/fonts/playfair-display.woff2',
          '/fonts/inter.woff2',
          '/fonts/geist-sans.woff2',
        ],
        scripts: [],
        styles: [],
      };

      const allResources = { ...defaultResources, ...resources };

      // Preload images
      allResources.images?.forEach(src => {
        const img = new Image();
        img.src = src;
        img.loading = 'eager';
      });

      // Preload fonts
      allResources.fonts?.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Preload scripts
      allResources.scripts?.forEach(src => {
        const script = document.createElement('link');
        script.rel = 'preload';
        script.href = src;
        script.as = 'script';
        document.head.appendChild(script);
      });

      // Preload styles
      allResources.styles?.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        document.head.appendChild(link);
      });

      // DNS prefetch for external domains
      const dnsDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
        'https://www.emersoneims.com',
      ];

      dnsDomains.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
      });

      // Preconnect to critical origins
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ];

      preconnectDomains.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = href;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });
    };

    // Preload resources immediately
    preloadResources();

    // Preload additional resources on idle
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Preload non-critical resources during idle time
        const additionalImages = [
          '/about-hero.jpg',
          '/service-hero.jpg',
          '/contact-hero.jpg',
        ];

        additionalImages.forEach(src => {
          const img = new Image();
          img.src = src;
          img.loading = 'lazy';
        });
      });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        const additionalImages = [
          '/about-hero.jpg',
          '/service-hero.jpg',
          '/contact-hero.jpg',
        ];

        additionalImages.forEach(src => {
          const img = new Image();
          img.src = src;
          img.loading = 'lazy';
        });
      }, 2000);
    }

  }, [resources]);

  return null;
}