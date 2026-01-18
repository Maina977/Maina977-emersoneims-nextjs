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
import { OrganizationSchema, WebSiteSchema, DiagnosticSuiteSchema } from '@/components/seo/StructuredData';
import FAQSchema from '@/components/seo/FAQSchema';
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

// 🤖 SALLY AI ASSISTANT - Personalized Visitor Engagement
import SallyAIAssistant from '@/components/ai/SallyAIAssistant';

// CONVERSION BOOSTERS - Turn Every Click Into Business
import FloatingActionBubbles from '@/components/conversion/FloatingActionBubbles';
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
    default: "Generator Companies in Kenya | EmersonEIMS - #1 Power Solutions Provider",
    template: "%s | EmersonEIMS - Best Generator & Solar Company Kenya"
  },
  description: "Kenya's Leading Generator Company - Sales, Installation, Maintenance & Repairs. 12+ Years Experience, 500+ Projects, 47 Counties Coverage. Cummins, Perkins, FG Wilson Authorized. 24/7 Emergency Service. Call +254768860665",
  keywords: [
    // ===== HIGH-PRIORITY SEARCH TERMS (Google Ranking Focus) =====
    "generator companies in Kenya", "generator company Kenya", "best generator company in Kenya",
    "generator suppliers in Kenya", "generator dealers Kenya", "generator sellers Kenya",
    "buy generator Kenya", "generator shop Kenya", "generator store Nairobi",

    // Generator Sales & Products
    "generators for sale Kenya", "diesel generators Kenya", "industrial generators Kenya",
    "commercial generators Kenya", "silent generators Kenya", "used generators Kenya",
    "Cummins generators Kenya", "Perkins generators Kenya", "FG Wilson generators Kenya",
    "Caterpillar generators Kenya", "generator prices Kenya", "cheap generators Kenya",

    // Generator Services
    "generator installation Kenya", "generator maintenance Kenya", "generator repair Kenya",
    "generator service Kenya", "generator hire Kenya", "generator rental Kenya",
    "generator spare parts Kenya", "generator parts supplier Kenya",
    "24/7 generator service Kenya", "emergency generator repair Nairobi",

    // Solar Keywords
    "solar companies Kenya", "solar installation Kenya", "solar panels Kenya",
    "solar power systems Kenya", "best solar company Kenya", "solar energy Kenya",
    "commercial solar Kenya", "residential solar Kenya", "solar water heater Kenya",

    // UPS & Power Backup
    "UPS systems Kenya", "UPS suppliers Kenya", "power backup Kenya",
    "uninterruptible power supply Kenya", "APC UPS Kenya", "battery backup Kenya",

    // Diagnostics & Error Codes
    "generator error codes", "generator fault codes", "Cummins fault codes",
    "Perkins error codes", "generator troubleshooting Kenya", "power diagnostics Kenya",

    // Motor & Electrical Services
    "motor rewinding Kenya", "electric motor repair Kenya", "borehole pump Kenya",
    "electrical services Kenya", "AC installation Kenya", "HVAC services Kenya",

    // Location-Based (47 Counties)
    "generators Nairobi", "generator company Nairobi", "solar installation Nairobi",
    "generators Mombasa", "generator company Mombasa", "solar Mombasa",
    "generators Kisumu", "generators Nakuru", "generators Eldoret",
    "generators Kiambu", "generators Machakos", "generators Thika",
    "generators Nyeri", "generators Meru", "generators Kisii",
    "generators Kakamega", "generators Garissa", "generators Malindi",

    // Swahili Keywords (Local Dominance)
    "jenereta Kenya", "kuuza jenereta", "bei ya jenereta", "fundi wa jenereta",
    "nguvu za jua Kenya", "solari Kenya", "stima backup Kenya",

    // Industry-Specific
    "hospital generators Kenya", "hotel generators Kenya", "factory generators Kenya",
    "construction site generators", "farm generators Kenya", "school generators Kenya",
    "office backup power Kenya", "data center UPS Kenya",

    // Brand-Specific Searches
    "Cummins dealer Kenya", "Perkins dealer Kenya", "FG Wilson dealer Kenya",
    "DeepSea controller Kenya", "generator controller Kenya",
    "Kohler generators Kenya", "Generac generators Kenya",

    // Long-Tail Keywords
    "where to buy generator in Nairobi", "best generator for home Kenya",
    "generator size calculator Kenya", "how much is a generator in Kenya",
    "generator maintenance cost Kenya", "generator fuel consumption calculator",
    "solar vs generator Kenya", "hybrid solar generator Kenya"
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
    siteName: "EmersonEIMS - Generator Companies in Kenya",
    title: "EmersonEIMS - #1 Generator Company in Kenya | Sales, Installation & Repairs",
    description: "Kenya's Best Generator Company - Cummins, Perkins, FG Wilson Sales & Service. 12 Years Experience, 500+ Projects, 47 Counties. Solar Installation, UPS Systems, Motor Rewinding. 24/7 Emergency Service. Call +254768860665",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "EmersonEIMS - Best Generator Company in Kenya",
        type: "image/jpeg",
      }
    ],
    countryName: "Kenya",
    phoneNumbers: ["+254 768 860 665", "+254 782 914 717"],
    emails: ["info@emersoneims.com"],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmersonEIMS - Best Generator Company in Kenya",
    description: "Kenya's #1 Generator & Solar Company. Cummins, Perkins, FG Wilson Authorized Dealer. Sales, Installation, Maintenance. 24/7 Service. 47 Counties. Call +254768860665",
    images: [`${siteUrl}/og-image.jpg`],
    creator: "@EmersonEIMS",
    site: "@EmersonEIMS",
  },
  ...(process.env.NEXT_PUBLIC_FACEBOOK_APP_ID && {
    facebook: {
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
    }
  }),
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
    "@type": "LocalBusiness",
    "name": "EmersonEIMS",
    "alternateName": "Emerson Energy Infrastructure Management Solutions",
    "url": siteUrl,
    "logo": `${siteUrl}/images/Emerson EIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png`,
    "image": `${siteUrl}/og-image.jpg`,
    "description": "Premium Power Engineering & Intelligent Energy Solutions. Powering Kenya's Future Through Intelligent Energy Solutions.",
    "telephone": "+254768860665",
    "email": "info@emersoneims.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressLocality": "Nairobi",
      "addressRegion": "Nairobi County"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -1.286389,
      "longitude": 36.817223
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "08:00",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "09:00",
        "closes": "16:00"
      }
    ],
    "priceRange": "KES",
    "currenciesAccepted": "KES, USD",
    "paymentAccepted": "Cash, M-Pesa, Bank Transfer, Credit Card",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "247",
      "bestRating": "5",
      "worstRating": "1"
    },
    "sameAs": [
      "https://www.facebook.com/EmersonEIMS",
      "https://twitter.com/EmersonEIMS",
      "https://www.linkedin.com/company/emersoneims"
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "telephone": "+254768860665",
        "availableLanguage": ["English", "Swahili"],
        "areaServed": [
          "KE", "TZ", "UG", "RW",
          "Mombasa", "Kwale", "Kilifi", "Tana River", "Lamu", "Taita-Taveta", "Garissa", "Wajir", "Mandera",
          "Marsabit", "Isiolo", "Meru", "Tharaka-Nithi", "Embu", "Kitui", "Machakos", "Makueni", "Nyandarua",
          "Nyeri", "Kirinyaga", "Murang'a", "Kiambu", "Turkana", "West Pokot", "Samburu", "Trans-Nzoia",
          "Uasin Gishu", "Elgeyo-Marakwet", "Nandi", "Baringo", "Laikipia", "Nakuru", "Narok", "Kajiado",
          "Kericho", "Bomet", "Kakamega", "Vihiga", "Bungoma", "Busia", "Siaya", "Kisumu", "Homa Bay",
          "Migori", "Kisii", "Nyamira", "Nairobi City"
        ]
      },
      {
        "@type": "ContactPoint",
        "contactType": "emergency service",
        "telephone": "+254782914717",
        "availableLanguage": ["English", "Swahili"],
        "hoursAvailable": "24/7"
      }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Energy Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Generator Installation & Maintenance",
            "description": "Professional installation and maintenance of industrial and commercial generators (Diesel, Gas, Used).",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Solar Power Systems",
            "description": "Complete solar energy solutions for residential, commercial, and industrial applications.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Power Diagnostics & Audits",
            "description": "Advanced power quality analysis, energy audits, and diagnostic services.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "UPS & Power Backup Systems",
            "description": "Uninterruptible Power Supply (UPS) systems for critical infrastructure.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Fuel Management Systems",
            "description": "Automated fuel monitoring and management for generator fleets.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Remote Monitoring",
            "description": "24/7 remote monitoring of power assets and infrastructure.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Spare Parts - Generators, Solar, Motors",
            "description": "Comprehensive spare parts catalog with 1,247 genuine parts for generators (Cummins, Perkins, CAT), solar systems, motors, and switchgear.",
            "brand": "EmersonEIMS",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "KES",
              "availability": "https://schema.org/InStock"
            }
          }
        }
      ]
    }
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Structured Data - LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* FAQ Schema for Rich Snippets */}
        <FAQSchema />
        
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

        {/* Bing & MSN-specific meta tags */}
        <meta name="msvalidate.01" content="8F9B2C3D4E5F6A7B8C9D0E1F2A3B4C5D" />
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="page-topic" content="Power Engineering, Energy Solutions, Generators, Solar Energy" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Nairobi, Kenya" />
        <meta name="geo.position" content="-1.286389;36.817223" />
        <meta name="ICBM" content="-1.286389, 36.817223" />

        {/* Additional Open Graph for WhatsApp/Telegram sharing */}
        <meta property="og:phone_number" content="+254768860665" />
        <meta property="og:email" content="info@emersoneims.com" />
        <meta property="og:latitude" content="-1.286389" />
        <meta property="og:longitude" content="36.817223" />
        <meta property="og:street-address" content="Nairobi" />
        <meta property="og:locality" content="Nairobi" />
        <meta property="og:region" content="Nairobi County" />
        <meta property="og:postal-code" content="" />
        <meta property="og:country-name" content="Kenya" />

        {/* LinkedIn-specific meta tags */}
        <meta property="og:see_also" content="https://www.linkedin.com/company/emersoneims" />

        {/* Author & Publisher */}
        <meta name="author" content="EmersonEIMS" />
        <meta name="publisher" content="EmersonEIMS - Energy Infrastructure Management Solutions" />
        <meta name="copyright" content="© 2026 EmersonEIMS. All rights reserved." />

        {/* Mobile App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="EmersonEIMS" />
        <meta name="apple-mobile-web-app-title" content="EmersonEIMS" />
        
        {/* ═══════════════════════════════════════════════════════════════════
            EXTREME PERFORMANCE - FASTEST WEBSITE IN THE WORLD
            DNS Prefetch, Preconnect, Preload for instant loading
        ════════════════════════════════════════════════════════════════════ */}

        {/* DNS Prefetch - Resolve domains early */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect to Critical Origins - Establish connections early */}
        <link rel="dns-prefetch" href={siteUrl} />
        <link rel="preconnect" href={siteUrl} crossOrigin="" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload Critical Resources - Load immediately */}
        <link rel="preload" href="/images/logo-tagline.png" as="image" type="image/png" fetchPriority="high" />
        <link rel="preload" href="/images/GEN%202-1920x1080.png" as="image" type="image/png" />

        {/* Preload Cinematic Video - For generators page instant playback */}
        <link rel="preload" href="/videos/VID-20250930-WA0000%20(3).mp4" as="video" type="video/mp4" />

        {/* Prefetch Secondary Resources */}
        <link rel="prefetch" href="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" as="video" type="video/mp4" />
        <link rel="prefetch" href="/generators" />
        <link rel="prefetch" href="/solar" />
        <link rel="prefetch" href="/services" />

        {/* Performance Optimization Meta - Mobile & Desktop */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />

        {/* Mobile Performance Hints */}
        <meta name="format-detection" content="telephone=yes" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="MobileOptimized" content="width" />
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
        
        {/* Global Structured Data for SEO - Rich Snippets */}
        <OrganizationSchema />
        <WebSiteSchema />
        <DiagnosticSuiteSchema />

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
            🤖 SALLY AI ASSISTANT - Personalized Visitor Welcome
            Greets visitors by name, creates instant connection
            Position: Above accessibility widget (z-index managed internally)
        ════════════════════════════════════════════════════════════════ */}
        <SallyAIAssistant />

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
