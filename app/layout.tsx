import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/accessibility.css"; // WCAG 2.1 AAA Accessibility Styles

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZED IMPORTS
// Critical components loaded directly, non-critical loaded in client wrapper
// ═══════════════════════════════════════════════════════════════════════════════
import TeslaStyleNavigation from '@/components/navigation/TeslaStyleNavigation';
import PremiumFooter from '@/components/layout/PremiumFooter';
import { OrganizationSchema } from '@/components/seo/StructuredData';
import SkipToContent from '@/components/accessibility/SkipToContent';
import { ScreenReaderAnnouncerProvider } from '@/components/accessibility/ScreenReaderAnnouncer';
import { KeyboardShortcutsHelper } from '@/components/accessibility/FocusManagement';
import { AntiScrapingMeta } from '@/components/security/SecurityShield';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import WebsiteStatsCounter from '@/components/social/WebsiteStatsCounter';

// Client-side only components wrapper (loaded after page is interactive)
import ClientSideComponents from '@/components/layout/ClientSideComponents';
import LiquidCursor from '@/components/awwwards/LiquidCursor';

// CONVERSION BOOSTERS - Turn Every Click Into Business
import FloatingActionBubbles from '@/components/conversion/FloatingActionBubbles';
import LiveSalesNotifications from '@/components/conversion/LiveSalesNotifications';
import UrgencyBar from '@/components/conversion/UrgencyBar';

// AI PERSONALIZATION & SEO DOMINATION
import IntelligentPersonalization from '@/components/ai/IntelligentPersonalization';
import AdvancedSEO, { SEOEventTracker } from '@/components/seo/AdvancedSEO';

// Default messages for the root layout (English)
const defaultMessages = {
  "Home": "Home",
  "About": "About",
  "Diagnostics": "Diagnostics",
  "Services": "Services",
  "Contact": "Contact",
  "Solar": "Solar",
  "Generators": "Generators",
  "Solutions": "Solutions"
};

export const revalidate = 3600; // ISR: Revalidate every hour

// Performance Optimization: Font loading - only load essential weights
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  weight: ['400', '600', '700'], // Reduced from 4 to 3 weights
  variable: '--font-inter',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com';

const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
const yandexVerification = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EmersonEIMS - Reliable Power. Without Limits.",
    template: "%s | EmersonEIMS - Premium Energy Solutions Kenya"
  },
  description: "Premium Power Engineering & Intelligent Energy Solutions in Kenya. Powering Kenya's Future Through Intelligent Energy Solutions - Generators, Solar Systems, UPS & Comprehensive Diagnostics.",
  keywords: [
    // Core Services
    "energy solutions Kenya", "generator installation Kenya", "solar power Kenya", "UPS systems Kenya",
    "power backup Kenya", "EmersonEIMS", "power engineering Kenya", "intelligent energy solutions",
    "reliable power Kenya", "energy infrastructure management", "commercial generators Kenya",
    "industrial power solutions", "renewable energy Kenya", "power diagnostics Kenya",
    "energy audits Kenya", "fuel management systems", "switchgear maintenance Kenya",
    
    // Swahili Keywords (Local Dominance)
    "nguvu za jua Kenya", "jenereta Kenya", "uuzaji wa jenereta", "fundi wa stima",
    "solaris Kenya", "backup power Nairobi",
    
    // Major Counties (Market Dominance)
    "generators Nairobi", "solar Mombasa", "power solutions Kisumu", "energy Nakuru",
    "generators Eldoret", "solar Thika", "power backup Kiambu", "energy Machakos",
    "generators Kisii", "solar Malindi", "power solutions Kitale", "energy Nyeri"
  ],
  authors: [{ name: "EmersonEIMS" }],
  creator: "EmersonEIMS",
  publisher: "EmersonEIMS - Energy Infrastructure Management Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteUrl,
    siteName: "EmersonEIMS",
    title: "EmersonEIMS - Reliable Power. Without Limits.",
    description: "Premium Power Engineering & Intelligent Energy Solutions. Powering Kenya's Future Through Intelligent Energy Solutions.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "EmersonEIMS - Reliable Power. Without Limits.",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmersonEIMS - Reliable Power. Without Limits.",
    description: "Premium Power Engineering & Intelligent Energy Solutions in Kenya. Powering Kenya's Future Through Intelligent Energy Solutions.",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@EmersonEIMS",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
    ...(yandexVerification ? { yandex: yandexVerification } : {}),
  },
  alternates: {
    canonical: siteUrl,
  },
  category: 'technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV !== 'production';
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EmersonEIMS",
    "alternateName": "Emerson Energy Infrastructure Management Solutions",
    "url": siteUrl,
    "logo": `${siteUrl}/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png`,
    "description": "Premium Power Engineering & Intelligent Energy Solutions. Powering Kenya's Future Through Intelligent Energy Solutions.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Nairobi"
    },
    "sameAs": [
      "https://www.facebook.com/EmersonEIMS",
      "https://twitter.com/EmersonEIMS",
      "https://www.linkedin.com/company/emersoneims"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["English", "Swahili"],
      "areaServed": [
        "KE", "TZ", "UG", "RW", // East Africa
        // 47 Counties of Kenya
        "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera",
        "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
        "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia",
        "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
        "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
        "Migori", "Kisii", "Nyamira", "Nairobi City"
      ]
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Energy Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Generator Installation & Maintenance",
            "description": "Professional installation and maintenance of industrial and commercial generators (Diesel, Gas, Used)."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar Power Systems",
            "description": "Complete solar energy solutions for residential, commercial, and industrial applications."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Power Diagnostics & Audits",
            "description": "Advanced power quality analysis, energy audits, and diagnostic services."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "UPS & Power Backup Systems",
            "description": "Uninterruptible Power Supply (UPS) systems for critical infrastructure."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fuel Management Systems",
            "description": "Automated fuel monitoring and management for generator fleets."
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Remote Monitoring",
            "description": "24/7 remote monitoring of power assets and infrastructure."
          }
        }
      ]
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* ═══════════════════════════════════════════════════════════════════
            ENTERPRISE SECURITY META TAGS
            © EmersonEIMS - All Rights Reserved
        ════════════════════════════════════════════════════════════════════ */}
        <AntiScrapingMeta />
        
        {/* Canonical & Theme */}
        <link rel="canonical" href={siteUrl} />
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        {/* Preconnect to Critical Origins */}
        <link rel="dns-prefetch" href={siteUrl} />
        <link rel="preconnect" href={siteUrl} crossOrigin="" />
        
        {/* Preload Critical Resources for Fast Loading */}
        <link rel="preload" href="/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png" as="image" type="image/png" />
        <link rel="preload" href="/images/tnpl-diesal-generator-1000x1000-1920x1080.webp" as="image" type="image/webp" fetchPriority="high" />
        
        {/* Video Prefetch - Lower priority to not block initial render */}
        <link rel="prefetch" href="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" as="video" type="video/mp4" />
        
        {/* Performance Optimization Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0EA5E9" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Multilingual Support - hreflang tags */}
        <link rel="alternate" hrefLang="en" href={`${siteUrl}`} />
        <link rel="alternate" hrefLang="sw" href={`${siteUrl}/sw`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}`} />
        
        {/* Performance: Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning lang="en">
        <ScreenReaderAnnouncerProvider>
        <NextIntlClientProvider locale="en" messages={defaultMessages}>
        
        {/* Real-time Analytics Tracker */}
        <AnalyticsTracker />
        
        {/* ═══════════════════════════════════════════════════════════════════
            WCAG 2.1 AAA ACCESSIBILITY - Screen Reader Support
        ════════════════════════════════════════════════════════════════════ */}
        
        {/* WCAG 2.1 AAA: Multiple Skip Links */}
        <SkipToContent />
        
        {/* Keyboard Shortcuts Reference for Screen Readers */}
        <KeyboardShortcutsHelper />
        
        {/* Global Structured Data for SEO */}
        <OrganizationSchema />
        
        <nav id="main-navigation" aria-label="Main navigation">
          <TeslaStyleNavigation />
        </nav>
        <main id="main-content" role="main" aria-label="Main content">
          {children}
        </main>
        <footer id="contact-section" role="contentinfo">
          <PremiumFooter />
        </footer>
        
        {/* ═══════════════════════════════════════════════════════════════════
            LIVE WEBSITE STATS COUNTER - Bottom Left Corner
            Shows real-time visitors, clicks, and activity notifications
        ════════════════════════════════════════════════════════════════════ */}
        <WebsiteStatsCounter />
        
        {/* ═══════════════════════════════════════════════════════════════════
            NON-CRITICAL: Client-side components loaded after page is interactive
        ════════════════════════════════════════════════════════════════════ */}
        <ClientSideComponents />

        {/* ═══════════════════════════════════════════════════════════════════
            AWWWARDS SOTD: Revolutionary Liquid Magnetic Cursor
        ════════════════════════════════════════════════════════════════════ */}
        <LiquidCursor />

        {/* ═══════════════════════════════════════════════════════════════════
            💰 CONVERSION MAXIMIZERS - Every Click = Business
        ════════════════════════════════════════════════════════════════════ */}
        <UrgencyBar />
        <FloatingActionBubbles />
        <LiveSalesNotifications />

        {/* ═══════════════════════════════════════════════════════════════════
            🧠 AI PERSONALIZATION - Website That Feels Alive
        ════════════════════════════════════════════════════════════════════ */}
        <IntelligentPersonalization />

        {/* ═══════════════════════════════════════════════════════════════════
            🚀 ADVANCED SEO - Dominate All Search Engines Across 47 Counties
        ════════════════════════════════════════════════════════════════════ */}
        <AdvancedSEO />
        <SEOEventTracker />

        {/* ═══════════════════════════════════════════════════════════════════
            DEFERRED SCRIPTS - Load after page is interactive
        ════════════════════════════════════════════════════════════════════ */}
        
        {/* Service Worker Cache Management - Deferred */}
        <Script
          id="sw-register"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              // Clear old caches on load
              (async function() {
                if ('caches' in window) {
                  const cacheNames = await caches.keys();
                  await Promise.all(cacheNames.map(name => caches.delete(name)));
                }
              })();
            `,
          }}
        />
        
        {/* Accessibility Keyboard Shortcut - Deferred */}
        <Script
          id="accessibility-shortcut"
          strategy="lazyOnload"
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('keydown', (e) => {
                if (e.altKey && e.key === 'a') {
                  e.preventDefault();
                  const panel = document.querySelector('[aria-label="Open accessibility settings"]');
                  if (panel) panel.click();
                }
              });
            `,
          }}
        />

        {/* Performance Monitoring - Web Vitals */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Track page load performance
                window.addEventListener('load', () => {
                  ${isDev ? `console.log('%c⚡ EmersonEIMS - Performance Monitor Active', 'background: #10B981; color: white; padding: 8px 16px; font-size: 14px; font-weight: bold;');` : ''}
                  
                  // Log Core Web Vitals
                  const perfData = performance.timing;
                  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                  const connectTime = perfData.responseEnd - perfData.requestStart;
                  
                  ${isDev ? `
                  console.log('📊 Performance:', {
                    pageLoad: pageLoadTime + 'ms',
                    server: connectTime + 'ms',
                    target: '<2000ms (Tesla: ~2100ms)'
                  });
                  ` : ''}
                  
                  // Alert if slower than Tesla (2100ms)
                  if (pageLoadTime > 2100) {
                    console.warn('⚠️ Load time exceeds Tesla benchmark:', pageLoadTime + 'ms');
                  }
                });
              }
            `,
          }}
        />
        </NextIntlClientProvider>
        </ScreenReaderAnnouncerProvider>
      </body>
    </html>
  );
}
