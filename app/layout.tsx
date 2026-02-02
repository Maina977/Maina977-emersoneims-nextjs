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
import { getMessages, getLocale } from 'next-intl/server';
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
    // ═══════════════════════════════════════════════════════════════════════════════
    // 🎯 #1 PRIORITY: MONEY KEYWORDS - Direct Purchase Intent
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator companies in Kenya", "generator company Kenya", "best generator company in Kenya",
    "generator suppliers in Kenya", "generator dealers Kenya", "generator sellers Kenya",
    "buy generator Kenya", "generator shop Kenya", "generator store Nairobi",
    "generator for sale in Kenya", "generator price in Kenya", "generator cost Kenya",

    // Generator Sales & Products - High Commercial Intent
    "generators for sale Kenya", "diesel generators Kenya", "industrial generators Kenya",
    "commercial generators Kenya", "silent generators Kenya", "used generators Kenya",
    "Cummins generators Kenya", "Perkins generators Kenya", "FG Wilson generators Kenya",
    "Caterpillar generators Kenya", "generator prices Kenya", "cheap generators Kenya",
    "new generators Kenya", "second hand generators Kenya", "refurbished generators Kenya",
    "standby generators Kenya", "prime power generators Kenya", "portable generators Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 💰 PRICE & COST KEYWORDS - Purchase Ready Searches
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator price list Kenya", "how much is a 10kva generator in Kenya",
    "how much is a 20kva generator in Kenya", "how much is a 50kva generator in Kenya",
    "how much is a 100kva generator in Kenya", "generator prices in Nairobi",
    "cheapest generator in Kenya", "affordable generators Kenya", "generator financing Kenya",
    "generator cost per kva Kenya", "solar panel prices Kenya", "solar system cost Kenya",
    "UPS price Kenya", "generator installation cost Kenya", "generator maintenance cost Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔧 SERVICE KEYWORDS - High Conversion
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator installation Kenya", "generator maintenance Kenya", "generator repair Kenya",
    "generator service Kenya", "generator hire Kenya", "generator rental Kenya",
    "generator spare parts Kenya", "generator parts supplier Kenya",
    "24/7 generator service Kenya", "emergency generator repair Nairobi",
    "generator servicing near me", "generator repair near me", "generator mechanic Kenya",
    "generator technician Kenya", "generator engineer Kenya", "power plant maintenance Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // ☀️ SOLAR KEYWORDS - Growing Market
    // ═══════════════════════════════════════════════════════════════════════════════
    "solar companies Kenya", "solar installation Kenya", "solar panels Kenya",
    "solar power systems Kenya", "best solar company Kenya", "solar energy Kenya",
    "commercial solar Kenya", "residential solar Kenya", "solar water heater Kenya",
    "solar panel installation Nairobi", "solar system for home Kenya", "solar farm Kenya",
    "off-grid solar Kenya", "hybrid solar system Kenya", "solar battery Kenya",
    "solar inverter Kenya", "solar charge controller Kenya", "net metering Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔋 UPS & POWER BACKUP
    // ═══════════════════════════════════════════════════════════════════════════════
    "UPS systems Kenya", "UPS suppliers Kenya", "power backup Kenya",
    "uninterruptible power supply Kenya", "APC UPS Kenya", "battery backup Kenya",
    "online UPS Kenya", "offline UPS Kenya", "line interactive UPS Kenya",
    "UPS for server room Kenya", "data center UPS Kenya", "industrial UPS Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔍 DIAGNOSTIC & ERROR CODE KEYWORDS - Technical Authority
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator error codes", "generator fault codes", "Cummins fault codes",
    "Perkins error codes", "generator troubleshooting Kenya", "power diagnostics Kenya",
    "DeepSea fault codes", "PowerWizard fault codes", "CAT generator fault codes",
    "generator alarm codes", "generator warning codes", "generator shutdown codes",
    "how to reset generator fault", "generator not starting", "generator overspeed alarm",
    "generator low oil pressure", "generator high temperature alarm",

    // ═══════════════════════════════════════════════════════════════════════════════
    // ⚡ MOTOR & ELECTRICAL SERVICES
    // ═══════════════════════════════════════════════════════════════════════════════
    "motor rewinding Kenya", "electric motor repair Kenya", "borehole pump Kenya",
    "electrical services Kenya", "AC installation Kenya", "HVAC services Kenya",
    "submersible pump Kenya", "water pump repair Kenya", "electric motor Kenya",
    "industrial motor repair Kenya", "motor winding Kenya", "pump installation Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 📍 LOCATION-BASED: ALL 47 KENYA COUNTIES
    // ═══════════════════════════════════════════════════════════════════════════════
    // Nairobi Region
    "generators Nairobi", "generator company Nairobi", "solar installation Nairobi",
    "generator repair Nairobi", "generator maintenance Nairobi", "UPS Nairobi",

    // Coast Region
    "generators Mombasa", "generator company Mombasa", "solar Mombasa",
    "generators Kilifi", "generators Kwale", "generators Lamu", "generators Taita Taveta",
    "generator Malindi", "generator Diani", "generator Watamu",

    // Central Region
    "generators Kiambu", "generators Nyeri", "generators Murang'a", "generators Kirinyaga",
    "generators Nyandarua", "generator Thika", "generator Ruiru", "generator Juja",

    // Rift Valley
    "generators Nakuru", "generators Eldoret", "generators Narok", "generators Kericho",
    "generators Bomet", "generators Baringo", "generators Laikipia", "generators Kajiado",
    "generators Uasin Gishu", "generators Trans Nzoia", "generators Nandi",
    "generators Elgeyo Marakwet", "generators West Pokot", "generators Turkana", "generators Samburu",

    // Western Region
    "generators Kakamega", "generators Bungoma", "generators Busia", "generators Vihiga",

    // Nyanza Region
    "generators Kisumu", "generators Kisii", "generators Nyamira", "generators Homa Bay",
    "generators Migori", "generators Siaya",

    // Eastern Region
    "generators Machakos", "generators Meru", "generators Embu", "generators Kitui",
    "generators Makueni", "generators Tharaka Nithi", "generators Isiolo", "generators Marsabit",

    // North Eastern Region
    "generators Garissa", "generators Wajir", "generators Mandera",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🗣️ SWAHILI KEYWORDS - Local Market Dominance
    // ═══════════════════════════════════════════════════════════════════════════════
    "jenereta Kenya", "kuuza jenereta", "bei ya jenereta", "fundi wa jenereta",
    "nguvu za jua Kenya", "solari Kenya", "stima backup Kenya",
    "jenereta ya dizeli", "jenereta ya nyumbani", "kununua jenereta",
    "huduma ya jenereta", "kukarabati jenereta", "vipuri vya jenereta",
    "paneli za sola", "mfumo wa sola", "betri ya sola",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🏭 INDUSTRY-SPECIFIC KEYWORDS
    // ═══════════════════════════════════════════════════════════════════════════════
    "hospital generators Kenya", "hotel generators Kenya", "factory generators Kenya",
    "construction site generators", "farm generators Kenya", "school generators Kenya",
    "office backup power Kenya", "data center UPS Kenya", "bank generators Kenya",
    "supermarket generators Kenya", "mall generators Kenya", "telecom tower generators",
    "cell tower power Kenya", "mining generators Kenya", "agricultural generators Kenya",
    "poultry farm generators Kenya", "dairy farm generators Kenya", "flower farm generators",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🏷️ BRAND-SPECIFIC SEARCHES
    // ═══════════════════════════════════════════════════════════════════════════════
    "Cummins dealer Kenya", "Perkins dealer Kenya", "FG Wilson dealer Kenya",
    "DeepSea controller Kenya", "generator controller Kenya",
    "Kohler generators Kenya", "Generac generators Kenya", "SDMO generators Kenya",
    "MTU generators Kenya", "Volvo generators Kenya", "John Deere generators Kenya",
    "Doosan generators Kenya", "Mitsubishi generators Kenya", "Yanmar generators Kenya",
    "Kipor generators Kenya", "Lister Petter generators Kenya", "Deutz generators Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // ❓ QUESTION-BASED KEYWORDS - Featured Snippets Target
    // ═══════════════════════════════════════════════════════════════════════════════
    "where to buy generator in Nairobi", "best generator for home Kenya",
    "generator size calculator Kenya", "how much is a generator in Kenya",
    "what size generator do I need Kenya", "how to choose a generator Kenya",
    "which generator brand is best in Kenya", "how to maintain generator Kenya",
    "why is my generator not starting", "when to service generator Kenya",
    "how often to service generator", "how long does generator last",
    "how to reduce generator fuel consumption", "how to connect generator to house",
    "what is the best solar company in Kenya", "how much does solar installation cost Kenya",
    "how many solar panels do I need Kenya", "is solar worth it in Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 📍 "NEAR ME" KEYWORDS - Local Intent
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator company near me", "generator repair near me", "generator shop near me",
    "generator parts near me", "solar installation near me", "UPS supplier near me",
    "generator service near me", "generator rental near me", "motor rewinding near me",
    "generator mechanic near me", "power backup near me", "electrical contractor near me",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🔥 LONG-TAIL COMMERCIAL KEYWORDS
    // ═══════════════════════════════════════════════════════════════════════════════
    "solar vs generator Kenya", "hybrid solar generator Kenya",
    "generator fuel consumption calculator", "generator load calculation Kenya",
    "automatic transfer switch Kenya", "ATS panel Kenya", "changeover switch Kenya",
    "generator synchronization Kenya", "parallel generator operation Kenya",
    "generator load bank testing Kenya", "generator commissioning Kenya",
    "power factor correction Kenya", "harmonic filter Kenya", "voltage stabilizer Kenya",

    // ═══════════════════════════════════════════════════════════════════════════════
    // 🌍 EAST AFRICA REGIONAL KEYWORDS
    // ═══════════════════════════════════════════════════════════════════════════════
    "generator companies East Africa", "generator supplier Tanzania", "generator Uganda",
    "generator Rwanda", "power solutions East Africa", "solar company East Africa",
    "industrial generators Africa", "power backup solutions Africa"
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV !== 'production';

  // Get locale and messages dynamically from cookie
  const locale = await getLocale();
  const messages = await getMessages();
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
            "@type": "Service",
            "name": "Generator & Solar Spare Parts Supply",
            "description": "Comprehensive spare parts catalog with 1,560+ genuine parts for generators (Cummins, Perkins, CAT), solar systems, motors, and switchgear. Fast delivery across Kenya.",
            "provider": {
              "@type": "LocalBusiness",
              "name": "EmersonEIMS"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Kenya"
            }
          }
        }
      ]
    }
  };

  return (
    <html lang={locale} className="scroll-smooth">
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
            🚀 WORLD'S FASTEST WEBSITE - EXTREME PERFORMANCE OPTIMIZATION
            Sub-1 second FCP target - Faster than Tesla, Google, Apple
        ════════════════════════════════════════════════════════════════════ */}

        {/* CRITICAL: DNS Prefetch - Resolve domains before they're needed */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* CRITICAL: Preconnect - Establish TCP/TLS connections early */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* HIGH PRIORITY: Preload only the logo for instant header render */}
        <link rel="preload" href="/images/logo-tagline.png" as="image" type="image/png" fetchPriority="high" />

        {/* DEFERRED: Prefetch pages user is likely to visit */}
        <link rel="prefetch" href="/generators" />
        <link rel="prefetch" href="/generators/maintenance-companion" />
        <link rel="prefetch" href="/contact" />
        <link rel="prefetch" href="/solar" />

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
      <body className={`${inter.className} antialiased`} suppressHydrationWarning lang={locale}>
        <ScreenReaderAnnouncerProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
        
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
