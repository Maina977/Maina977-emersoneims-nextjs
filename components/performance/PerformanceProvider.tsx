'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components with loading fallbacks
const LazyCustomCursor = dynamic(() => import('@/components/interactions/CustomCursor'), {
  ssr: false,
  loading: () => null,
});

const LazyServiceWorkerRegistration = dynamic(() => import('@/components/pwa/ServiceWorkerRegistration'), {
  ssr: false,
  loading: () => null,
});

const LazyWebVitals = dynamic(() => import('@/components/analytics/WebVitals'), {
  ssr: false,
  loading: () => null,
});

const LazyComprehensiveAnalytics = dynamic(() => import('@/components/analytics/ComprehensiveAnalytics'), {
  ssr: false,
  loading: () => null,
});

const LazyAIEngagement = dynamic(() => import('@/components/analytics/AIEngagement'), {
  ssr: false,
  loading: () => null,
});

const LazyGoogleAnalytics = dynamic(() => import('@/components/analytics/GoogleAnalytics'), {
  ssr: false,
  loading: () => null,
});

const LazyAdvancedPreloader = dynamic(() => import('@/components/performance/AdvancedPreloader'), {
  ssr: false,
  loading: () => null,
});

const LazyFontOptimizer = dynamic(() => import('@/components/performance/FontOptimizer'), {
  ssr: false,
  loading: () => null,
});

const LazyCriticalCSSInjector = dynamic(() => import('@/components/performance/CriticalCSSInjector'), {
  ssr: false,
  loading: () => null,
});

const LazyResourcePreloader = dynamic(() => import('@/components/performance/ResourcePreloader'), {
  ssr: false,
  loading: () => null,
});

const LazyFocusVisible = dynamic(() => import('@/components/accessibility/FocusVisible'), {
  ssr: false,
  loading: () => null,
});

const LazySkipToContent = dynamic(() => import('@/components/accessibility/SkipToContent'), {
  ssr: false,
  loading: () => null,
});

const LazySiteSearchWrapper = dynamic(() => import('@/components/shared/SiteSearchWrapper'), {
  ssr: false,
  loading: () => null,
});

const LazySciFiHeader = dynamic(() => import('@/components/layout/SciFiHeader'), {
  ssr: false,
  loading: () => <div className="h-20 bg-black animate-pulse" />,
});

const LazySciFiFooter = dynamic(() => import('@/components/layout/SciFiFooter'), {
  ssr: false,
  loading: () => <div className="h-32 bg-black animate-pulse" />,
});

const LazyLiveChat = dynamic(() => import('@/components/interactive/LiveChat'), {
  ssr: false,
  loading: () => null,
});

const LazyLiveVisitorCount = dynamic(() => import('@/components/social/LiveVisitorCount'), {
  ssr: false,
  loading: () => null,
});

const LazyHighContrastMode = dynamic(() => import('@/components/accessibility/HighContrastMode'), {
  ssr: false,
  loading: () => null,
});

const LazyUserProfile = dynamic(() => import('@/components/personalization/UserProfile'), {
  ssr: false,
  loading: () => null,
});

const LazyMaximumSecurity = dynamic(() => import('@/components/security/MaximumSecurity'), {
  ssr: false,
  loading: () => null,
});

const LazyStructuredData = dynamic(() => import('@/components/seo/StructuredData'), {
  ssr: false,
  loading: () => null,
});

const LazyPerformanceMonitor = dynamic(() => import('@/components/performance/PerformanceMonitor'), {
  ssr: false,
  loading: () => null,
});

interface PerformanceProviderProps {
  children: React.ReactNode;
}

export default function PerformanceProvider({ children }: PerformanceProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Preload critical resources
    const preloadResources = () => {
      // Preload fonts
      const fontLinks = [
        '/fonts/space-grotesk.woff2',
        '/fonts/playfair-display.woff2',
        '/fonts/inter.woff2',
      ];

      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
      });

      // Preload critical images
      const imageLinks = [
        '/logo.png',
        '/hero-bg.jpg',
      ];

      imageLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'image';
        document.head.appendChild(link);
      });

      // DNS prefetch for external resources
      const dnsPrefetch = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com',
      ];

      dnsPrefetch.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    preloadResources();

    // Mark as loaded after initial render
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    // Server-side rendering - return minimal structure
    return (
      <>
        <LazySciFiHeader />
        <main className="pt-20" id="main-content" role="main">
          {children}
        </main>
        <LazySciFiFooter />
      </>
    );
  }

  return (
    <>
      {/* Critical CSS for instant rendering */}
      <LazyCriticalCSSInjector />

      {/* Resource preloader for maximum speed */}
      <LazyResourcePreloader />

      {/* Performance monitoring */}
      <LazyPerformanceMonitor />

      {/* Critical components - load immediately */}
      <LazyCustomCursor enabled={true} />
      <LazyServiceWorkerRegistration />
      <LazyWebVitals />

      {/* Analytics - load with low priority */}
      <LazyComprehensiveAnalytics />
      <LazyAIEngagement />
      <LazyGoogleAnalytics />

      {/* Performance components */}
      <LazyAdvancedPreloader />
      <LazyFontOptimizer />

      {/* Accessibility */}
      <LazyFocusVisible />
      <LazySkipToContent />

      {/* Core layout */}
      <LazySiteSearchWrapper />
      <LazySciFiHeader />

      <main className="pt-20" id="main-content" role="main">
        {children}
      </main>

      <LazySciFiFooter />

      {/* Interactive components - load after main content */}
      {isLoaded && (
        <>
          <LazyLiveChat />
          <LazyLiveVisitorCount />
          <LazyHighContrastMode />
          <LazyUserProfile />
          <LazyMaximumSecurity />
          <LazyStructuredData
            data={{
              '@type': 'Organization',
              name: 'Emerson EiMS',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com'}/logo.svg`,
              description: 'Professional energy infrastructure management solutions',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Old North Airport Road',
                addressLocality: 'Nairobi',
                addressCountry: 'KE',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+254-768-860-655',
                contactType: 'Customer Service',
              },
            }}
          />
        </>
      )}
    </>
  );
}