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
        // Only assets that actually exist in /public — preloading missing
        // files produced 404s on every page and surfaced as a runtime
        // "NetworkError" in the dev overlay. Fonts are handled by next/font,
        // not raw /fonts/*.woff2 (those files don't exist).
        images: [
          '/logo.svg',
        ],
        fonts: [] as string[],
        scripts: [] as string[],
        styles: [] as string[],
      };

      const allResources = { ...defaultResources, ...resources };

      // Preload images — swallow errors so a missing asset can never bubble
      // up as a runtime NetworkError.
      allResources.images?.forEach(src => {
        const img = new Image();
        img.onerror = () => { /* ignore missing preload target */ };
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

    // (Removed idle preloads of /about-hero.jpg, /service-hero.jpg and
    // /contact-hero.jpg — those files don't exist and only produced 404s.)

  }, [resources]);

  return null;
}