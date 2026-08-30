import type { Metadata } from "next";
// `headers` is deliberately NOT imported. Calling it in this root layout opted
// every page into dynamic rendering — see the note in generateMetadata below.
import PerformanceBoot from "@/components/performance/PerformanceBoot";
import { Inter } from "next/font/google";
import "./globals.css";
import "@/styles/accessibility.css"; // WCAG 2.1 AAA Accessibility Styles

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE OPTIMIZED IMPORTS
// Critical components loaded directly, non-critical loaded in client wrapper
// ═══════════════════════════════════════════════════════════════════════════════
import TeslaStyleNavigation from '@/components/navigation/TeslaStyleNavigation';
import PremiumFooter from '@/components/layout/PremiumFooter';
import B2BSiteStrip from '@/components/b2b/B2BSiteStrip';
import { OrganizationSchema, WebSiteSchema, DiagnosticSuiteSchema } from '@/components/seo/StructuredData';
// AutoBreadcrumb is intentionally not imported — see the note at its former
// mount point below. The component file itself is unchanged.
// FAQSchema is intentionally not imported — see the note where it used to be
// rendered, below. The component file is still there if it is ever wanted on a
// page that actually displays its questions.
import SkipToContent from '@/components/accessibility/SkipToContent';
import { ScreenReaderAnnouncerProvider } from '@/components/accessibility/ScreenReaderAnnouncer';
import { KeyboardShortcutsHelper } from '@/components/accessibility/FocusManagement';
import { AntiScrapingMeta } from '@/components/security/SecurityShield';
import Script from 'next/script';
import { NextIntlClientProvider } from 'next-intl';
// getMessages / getLocale are deliberately NOT imported: both are
// request-scoped and forced every page in the app to render dynamically.
import { defaultLocale } from '@/i18n';
import enMessages from '@/messages/en.json';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import WebVitalsReporter from '@/components/analytics/WebVitalsReporter';
import { ALL_SERVICES } from '@/lib/services/allServices';

// ═══════════════════════════════════════════════════════════════════════════════
// PERFORMANCE: All non-critical components loaded AFTER page is interactive
// This reduces initial JS bundle by ~500KB and improves FCP by 2-3 seconds
// ═══════════════════════════════════════════════════════════════════════════════

// Client-side only components wrapper (loaded after page is interactive)
import ClientSideComponents from '@/components/layout/ClientSideComponents';

// DEFERRED: All these load 2 seconds AFTER page is interactive
// DeferredComponents is a 'use client' component that handles its own deferred loading
import DeferredComponents from '@/components/layout/DeferredComponents';

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
// Bing/MSN ownership verification. Set NEXT_PUBLIC_BING_SITE_VERIFICATION to the
// real token from Bing Webmaster Tools. Until then we emit nothing — a fake
// placeholder token previously shipped here and never verified the site.
const bingSiteVerification = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION;

export async function generateMetadata(): Promise<Metadata> {
  // Self-referential canonical derived from the request path (middleware sets
  // `x-pathname`). Pages that declare their own alternates.canonical override
  // this. Previously the root layout hard-coded the canonical to the site root,
  // so every page canonicalised to the homepage — the root cause of Search
  // Console's "Duplicate without user-selected canonical".
  //
  // The `|| "/"` fallback used to run whenever the header was absent, which is
  // exactly what happens on a STATICALLY PRERENDERED route — headers() has no
  // request to read at build time. /generators/case-studies hit this and
  // shipped canonical=<homepage>, re-creating the very bug described above on
  // that page. An absent header yielded NO canonical rather than a wrong one:
  // Google treating a URL as its own canonical is far less damaging than being
  // told it duplicates the homepage. Any statically prerendered page must
  // declare its own alternates.canonical.
  //
  // THE headers() CALL IS NOW GONE (2026-08-29), and the condition above is
  // satisfied instead: scripts/add-canonicals.mjs gave 117 static routes their
  // own self-referential canonical, joining the 147 that already had one.
  //
  // WHY IT HAD TO GO. Reading headers() in the ROOT layout opts every page on
  // the site into dynamic rendering. The visible cost was the response header
  //     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
  // on every URL — Next's default for a dynamically rendered route. That tells
  // every visitor's browser never to store a page, so repeat visits
  // re-downloaded the entire document (440KB of HTML on the homepage) instead
  // of revalidating a cached copy, and it silently overrode the policy this
  // project deliberately tuned in vercel.json
  //     public, max-age=0, s-maxage=60, stale-while-revalidate=300
  // which exists so the edge can answer instantly and refresh behind the user.
  //
  // With this removed the site prerenders and `export const revalidate = 3600`
  // above governs freshness, as originally intended.
  //
  // IF YOU ADD A ROUTE: give it its own alternates.canonical. Do not restore
  // headers() here to cover it — that trades one page's canonical for every
  // page's cacheability.
  const canonical: string | undefined = undefined;

  return {
  metadataBase: new URL(siteUrl),
  title: {
    default: "EmersonEIMS | B2B Power & Engineering Partner for Industry, Healthcare & Telecom in Kenya",
    template: "%s | EmersonEIMS Kenya"
  },
  description: "EmersonEIMS is a B2B power-engineering partner for manufacturers, hospitals, telecom, commercial property and construction in Kenya \u2014 Cummins generators, generator repairs, ATS / changeover panels, distribution boards, solar PV, UPS systems, motor rewinding, air-conditioning, borehole pumps, hospital incinerators and steel fabrication \u2014 backed by a 2-year warranty, SLA maintenance and 24/7 emergency response across all 47 counties. Call +254768860665.",
  // NOTE: Keywords meta tag removed - Google has ignored this tag since 2009
  // SEO is achieved through quality content, proper H1-H6 structure, and semantic HTML
  authors: [{ name: "EmersonEIMS" }],
  creator: "EmersonEIMS",
  publisher: "EmersonEIMS",
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
    title: "EmersonEIMS | B2B Power & Engineering Partner for Kenyan Industry",
    description: "Engineering-grade generators, solar, UPS, motors, HVAC, boreholes and incinerators for manufacturing, healthcare, telecom and commercial property in Kenya. 2-year warranty, SLA maintenance, 24/7 emergency. Call +254768860665.",
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
    emails: [
      "info@emersoneims.com",
      "emersoneimservices@emersoneims.com",
      "generators@emersoneims.com",
      "solar@emersoneims.com",
      "sally@emersoneims.com",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EmersonEIMS | B2B Power & Engineering Partner Kenya | 2-Year Warranty",
    description: "B2B power & engineering for industry, healthcare, telecom & construction in Kenya. Generators, solar, UPS, HVAC, boreholes, incinerators. SLA maintenance + 24/7 emergency. Call +254768860665.",
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
  // Omitted entirely when the path is unknown — see the note above generateMetadata.
  ...(canonical ? { alternates: { canonical } } : {}),
  category: 'technology',
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDev = process.env.NODE_ENV !== 'production';

  /*
   * Locale and messages are supplied as CONSTANTS, not fetched per request.
   *
   * getLocale() and getMessages() are next-intl's request-scoped server APIs.
   * Calling either one marks this render dynamic — and because this is the
   * ROOT layout, that made all ~3,400 pages dynamic, which is what produced
   *     Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
   * on every URL and stopped any browser from ever caching a page.
   *
   * Removing the cookie read from i18n.ts was necessary but not sufficient:
   * these two calls kept the request scope alive on their own. The build route
   * table still showed the homepage as dynamic afterwards.
   *
   * There is nothing left for them to resolve. The switcher that used to set
   * NEXT_LOCALE was removed from the nav on 2026-07-31 and the translation
   * hooks in SciFiHeader are commented out, so every visitor already received
   * the default locale. Passing it directly is what was happening in practice,
   * now stated honestly and cheaply.
   *
   * NextIntlClientProvider still wraps the tree below, so useTranslations()
   * keeps working for any component that wants it. Restoring real multilingual
   * support means locale-prefixed routes (/sw/...) with generateStaticParams,
   * which keeps pages static — not reinstating a request-scoped read here.
   */
  const locale = defaultLocale;
  const messages = enMessages;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    /*
     * THE CANONICAL ENTITY ANCHOR.
     *
     * This node had no @id, which caused two separate problems.
     *
     * 1. A DANGLING REFERENCE. The OfferCatalog below already points its
     *    provider at `${siteUrl}/#organization` — but nothing declared that
     *    @id, so every Offer referenced a company node that did not exist.
     * 2. TWO COMPANIES INSTEAD OF ONE. Page-level Organization nodes (e.g.
     *    app/kenya/page.tsx) also had no @id and used a different name —
     *    "Emerson EiMS Kenya" against this node's "EmersonEIMS". A 400-page
     *    audit found 114 URLs each carrying two unlinked Organization or
     *    LocalBusiness entities, so a crawler had no way to know they were the
     *    same business, and the trust signals split between them.
     *
     * An @id is how schema.org expresses identity. Every other node that
     * describes this company must reuse this exact string so the graph
     * resolves to one entity rather than several.
     */
    "@id": `${siteUrl}/#organization`,
    // NAP consistency with the Google Business Profile matters for local
    // ranking: Google associates a site with a listing partly by matching name,
    // address and phone. The listing is registered as "EMERSON INDUSTRIAL
    // MAINTENANCE SERVICES - GENERATOR SALES AND MAINTENANCE IN KENYA" while this
    // schema declared only "EmersonEIMS", so the two did not corroborate each
    // other. The trading name stays primary; the registered listing name is now
    // carried as alternateName so both match something.
    "name": "EmersonEIMS",
    "alternateName": "EMERSON INDUSTRIAL MAINTENANCE SERVICES - GENERATOR SALES AND MAINTENANCE IN KENYA",
    "url": siteUrl,
    "logo": `${siteUrl}/images/EmersonEIMS Logo and Tagline PNG-Picsart-BackgroundRemover.png`,
    "image": `${siteUrl}/og-image.jpg`,
    "description": "EmersonEIMS — B2B power & engineering partner in Kenya. Generators, solar, UPS, motors, HVAC, boreholes and incinerators with a 2-year warranty, SLA-backed maintenance and 24/7 emergency response across 47 counties.",
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
      "latitude": -1.3200,
      "longitude": 36.8900
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
    "priceRange": "$$$",
    "currenciesAccepted": "KES, USD",
    "paymentAccepted": "Cash, M-Pesa, Bank Transfer, Credit Card",
    // NOTE: AggregateRating intentionally omitted. Google's structured-data
    // policy prohibits self-asserted aggregate ratings without on-page,
    // user-generated reviews. We will reintroduce this only when reviews
    // are sourced from a verifiable third party (Google Business Profile,
    // Trustpilot) and rendered on the page itself.
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
        "email": "info@emersoneims.com",
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
        "contactType": "technical support",
        "telephone": "+254768860665",
        "email": "emersoneimservices@emersoneims.com",
        "availableLanguage": ["English", "Swahili"],
        "areaServed": "KE"
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+254768860665",
        "email": "generators@emersoneims.com",
        "productSupported": "Generators, ATS, Controllers, Diesel Automation",
        "areaServed": "KE"
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+254768860665",
        "email": "solar@emersoneims.com",
        "productSupported": "Solar PV, Hybrid, UPS, Batteries, Inverters",
        "areaServed": "KE"
      },
      {
        "@type": "ContactPoint",
        "contactType": "account management",
        "telephone": "+254768860665",
        "email": "sally@emersoneims.com",
        "areaServed": "KE"
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
      "name": "Energy & Engineering Solutions",
      // Built dynamically from the canonical service registry so every
      // service we offer is advertised to search engines via schema.org
      // — each Offer.itemOffered.@id deep-links to its dedicated
      // /services/<slug> page where the per-service Service + FAQPage
      // schema lives. White-hat: no keyword stuffing, just a complete
      // and accurate machine-readable catalog of what we actually do.
      "itemListElement": ALL_SERVICES.map((svc) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "@id": `${siteUrl}/services/${svc.slug}#service`,
          "name": svc.name,
          "description": svc.description,
          "url": `${siteUrl}/services/${svc.slug}`,
          "provider": {
            "@type": "LocalBusiness",
            "@id": `${siteUrl}/#organization`,
            "name": "EmersonEIMS",
          },
          "areaServed": {
            "@type": "Country",
            "name": "Kenya",
          },
        },
      })),
    }
  };

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        {/* Structured Data - LocalBusiness Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* FAQPage schema is deliberately NOT emitted here any more.
            (Component kept at components/seo/FAQSchema.tsx — nothing deleted;
            restoring it is re-adding this one line.)

            It was mounted in the root layout, so all ~3,400 pages carried the
            same ten Q&As. Three problems, in order of seriousness:

            1. POLICY. Google requires FAQPage content to be visible on the page
               that declares it. This markup was visible on none of them, which
               is the kind of thing that earns a structured-data manual action.
               Since 2023 Google also stopped showing FAQ rich results for
               commercial sites, so the upside being risked for was ~zero.
            2. DUPLICATE ENTITY. /faq builds its own FAQPage from FAQ_DATA and
               renders every question and answer visibly, which is correct and
               compliant. The layout copy put a second, different FAQPage on
               that same URL.
            3. CONTRADICTORY PRICE. One answer read "a 10kVA home backup
               generator installation starts from KES 350,000" while the
               homepage now shows "Generators from KES 280,000" from
               GENERATOR_SIZES. Two starting prices on one page, and the one a
               crawler could quote was the wrong one.

            Same class of defect as the canonical-inheritance trap: a tag set in
            a layout is inherited by every child page, so a layout is the last
            place page-specific structured data belongs. */}
        
        {/* ═══════════════════════════════════════════════════════════════════
            ENTERPRISE SECURITY META TAGS
            © EmersonEIMS - All Rights Reserved
        ════════════════════════════════════════════════════════════════════ */}
        <AntiScrapingMeta />
        
        {/* Theme. The canonical link is emitted per-page via the Metadata API
            (see generateMetadata above) — a hard-coded <link rel="canonical">
            here pointed every page at the homepage and fought the per-page
            canonical, causing "Duplicate without user-selected canonical". */}
        <meta name="theme-color" content="#0EA5E9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Bing & MSN-specific meta tags. Only emit a real verification token. */}
        {bingSiteVerification ? (
          <meta name="msvalidate.01" content={bingSiteVerification} />
        ) : null}
        <meta name="rating" content="general" />
        <meta name="distribution" content="global" />
        <meta name="coverage" content="Worldwide" />
        <meta name="target" content="all" />
        <meta name="audience" content="all" />
        <meta name="page-topic" content="Power Engineering, Energy Solutions, Generators, Solar Energy" />
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Embakasi, Nairobi, Kenya" />
        <meta name="geo.position" content="-1.3200;36.8900" />
        <meta name="ICBM" content="-1.3200, 36.8900" />

        {/* Additional Open Graph for WhatsApp/Telegram sharing */}
        <meta property="og:phone_number" content="+254768860665" />
        <meta property="og:email" content="info@emersoneims.com" />
        <meta property="og:latitude" content="-1.3200" />
        <meta property="og:longitude" content="36.8900" />
        <meta property="og:street-address" content="Embakasi, off Airport North Road" />
        <meta property="og:locality" content="Embakasi, Nairobi" />
        <meta property="og:region" content="Nairobi County" />
        <meta property="og:postal-code" content="" />
        <meta property="og:country-name" content="Kenya" />

        {/* LinkedIn-specific meta tags */}
        <meta property="og:see_also" content="https://www.linkedin.com/company/emersoneims" />

        {/* Author & Publisher */}
        <meta name="author" content="EmersonEIMS" />
        <meta name="publisher" content="EmersonEIMS" />
        <meta name="copyright" content="© 2026 EmersonEIMS. All rights reserved." />

        {/* Mobile App Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="EmersonEIMS" />
        <meta name="apple-mobile-web-app-title" content="EmersonEIMS" />
        
        {/* ═══════════════════════════════════════════════════════════════════
            🚀 PERFORMANCE-OPTIMISED DELIVERY
            Target: Sub-500ms First Contentful Paint (FCP)
            Target: Sub-100ms Time to First Byte (TTFB)
            Target: 100/100 Lighthouse Score
        ════════════════════════════════════════════════════════════════════ */}

        {/* CRITICAL: Inline Critical CSS for instant render */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Critical Above-the-fold CSS - Eliminates render blocking */
          *{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
          body{margin:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}
          /* Skeleton Loading - Instant perceived performance */
          .loading-skeleton{background:linear-gradient(90deg,#1a1a2e 25%,#16213e 50%,#1a1a2e 75%);background-size:200% 100%;animation:shimmer 1.5s infinite}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          /* Lazy Image Loading - Smooth fade in */
          .lazy-image{opacity:0;transition:opacity .3s ease-in-out}.lazy-image.loaded{opacity:1}
          /* Prevent CLS - Reserve space for images and media */
          img,video,iframe{height:auto;max-width:100%;display:block}
          /* Fast font loading with fallback */
          @font-face{font-family:Inter;font-style:normal;font-weight:400 700;font-display:swap;src:local('Inter'),local('Inter-Regular')}
          /* Navigation skeleton for instant render */
          nav#main-navigation{min-height:64px}
          /* Hero opt-in: pages add the hero-full class to first section to fill viewport */
          main#main-content>section.hero-full:first-child{min-height:100vh}
          /* Compensate fixed navbar so non-hero pages do not sit under it */
          /* min-height reserves the page. Without it the whole site's
             Cumulative Layout Shift was 0.62 — against a 0.10 "good"
             threshold — from ONE shift, measured on the live homepage under
             Lighthouse conditions (4x CPU, slow 4G):
                 FOOTER  y 310 -> 0   h 534 -> 0   at 4957ms
             The cause is streaming SSR. The layout shell (nav and footer)
             flushes to the browser before the page's children stream in, so
             the footer paints 310px down a nearly empty viewport and is then
             shoved below the fold when the content arrives. Reserving a
             viewport of height means the footer starts off-screen, so the
             later reflow moves something the user was never shown and costs
             no CLS. 100svh (not vh) so mobile browser chrome does not make
             the reservation taller than the actual visible area. */
          main#main-content{padding-top:64px;min-height:100svh}
          @media(min-width:1024px){nav#main-navigation{min-height:72px}main#main-content{padding-top:72px}}
          /* Pages that own a full-viewport hero opt out of the offset */
          main#main-content:has(>section.hero-full:first-child){padding-top:0}
          /* Skip-navigation links must not reserve layout space */
          nav.skip-navigation{min-height:0}
          /* Button focus states for accessibility */
          button:focus-visible,a:focus-visible{outline:2px solid #0EA5E9;outline-offset:2px}
          /* Reduce motion for users who prefer it */
          @media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;transition-duration:0.01ms!important}}
          /* GPU acceleration for animations */
          .animate{will-change:transform,opacity;transform:translateZ(0)}
          /* Hide content until JS loads */
          .js-loading{visibility:hidden}.js-loaded{visibility:visible}
        ` }} />

        {/* CRITICAL: DNS Prefetch - Resolve domains 100ms+ faster */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://cdn.vercel-insights.com" />
        <link rel="dns-prefetch" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://api.anthropic.com" />

        {/* CRITICAL: Preconnect - Establish TCP/TLS 200ms+ faster */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.google-analytics.com" crossOrigin="anonymous" />

        {/* HIGHEST PRIORITY: Preload critical resources */}
        <link rel="preload" href="/images/logo-tagline.png" as="image" type="image/png" fetchPriority="high" />

        {/* PERF: removed blanket <link rel="prefetch"> for /generators, /generator-oracle,
            /contact and /solar. They were forcing every user to download four extra HTML
            documents on every page load (heavy on mobile data). next/link prefetch on
            hover already covers in-app navigation. */}

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
        {/* Manifest is generated by app/manifest.ts and served at
            /manifest.webmanifest (Next.js convention). The static
            public/manifest.json was deleted to avoid two competing manifests. */}
        <link rel="manifest" href="/manifest.webmanifest" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0EA5E9" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Multilingual Support - hreflang tags
            Must match the `locales` array in middleware.ts (11 locales).
            `en` is the default locale and is served at the root (no /en
            prefix), all others are served at /<locale>. */}
        <link rel="alternate" hrefLang="en-KE" href={`${siteUrl}`} />
        <link rel="alternate" hrefLang="en" href={`${siteUrl}`} />
        <link rel="alternate" hrefLang="sw" href={`${siteUrl}/sw`} />
        <link rel="alternate" hrefLang="fr" href={`${siteUrl}/fr`} />
        <link rel="alternate" hrefLang="de" href={`${siteUrl}/de`} />
        <link rel="alternate" hrefLang="es" href={`${siteUrl}/es`} />
        <link rel="alternate" hrefLang="pt" href={`${siteUrl}/pt`} />
        <link rel="alternate" hrefLang="zh" href={`${siteUrl}/zh`} />
        <link rel="alternate" hrefLang="nl" href={`${siteUrl}/nl`} />
        <link rel="alternate" hrefLang="am" href={`${siteUrl}/am`} />
        <link rel="alternate" hrefLang="so" href={`${siteUrl}/so`} />
        <link rel="alternate" hrefLang="ar" href={`${siteUrl}/ar`} />
        <link rel="alternate" hrefLang="x-default" href={`${siteUrl}`} />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning lang={locale}>
        {/*
          NO-JS SAFETY NET.

          framer-motion writes its `initial` state into the server-rendered
          markup, so any element with initial={{ opacity: 0 }} ships as
          style="opacity:0" and stays invisible until hydration. On /generators
          alone that was 127 elements out of 1,380 — if the bundle fails to load
          on a poor connection, most of the page is blank with no error and no
          clue why.

          This costs nothing when JavaScript works (a <noscript> block is inert)
          and turns a blank page into a readable one when it does not. It is a
          floor, not a fix: the real remedy is fewer elements starting hidden,
          which is why the hero and the banner directly beneath it no longer
          animate opacity at all.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* World-class font and resource preloading (client-only) */}
        <PerformanceBoot />
        <ScreenReaderAnnouncerProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
        
        {/* Real-time Analytics Tracker */}
        <AnalyticsTracker />
        {/* Real-user Core Web Vitals -> /api/analytics/collect (type='vitals').
            Mounted HERE, next to the tracker that actually runs, because the
            repo's two pre-existing web-vitals implementations were both dead
            (never imported / never-mounted parent). See the component header. */}
        <WebVitalsReporter />
        
        {/* ═══════════════════════════════════════════════════════════════════
            WCAG 2.1 AAA ACCESSIBILITY - Screen Reader Support
        ════════════════════════════════════════════════════════════════════ */}
        
        {/* WCAG 2.1 AAA: Multiple Skip Links */}
        <SkipToContent />
        
        {/*
          KeyboardShortcutsHelper MOVED TO THE END OF THE DOCUMENT (2026-08-26).

          It renders an sr-only <h2>Keyboard Shortcuts</h2>. Mounted here, at
          the top of <body>, that was the FIRST heading in the document on every
          page — before the H1. A design audit picked it up on both / and
          /generators as heading number one.

          Two costs, both real. Google reads sr-only text: the first topic it
          saw on every page was a list of keyboard keys. And screen-reader users
          navigating by heading landed on shortcuts before they reached what the
          page is about.

          It is NOT removed — it is genuinely useful and it stays exactly as
          written. It now mounts after the footer, where a help reference
          belongs, so the H1 is the first heading and the note is still
          reachable by heading navigation and by its role="note" landmark.
        */}
        
        {/* Global Structured Data for SEO - Rich Snippets */}
        <OrganizationSchema />
        <WebSiteSchema />
        <DiagnosticSuiteSchema />
        {/* AutoBreadcrumb IS NOT MOUNTED (2026-08-29). The component file is
            untouched at components/seo/AutoBreadcrumb.tsx — only this mount is
            removed — but it must not be restored as written, because it was
            costing the entire site and delivering nothing.

            IT PRODUCED NO BREADCRUMBS. Its intent was a BreadcrumbList JSON-LD
            on every deep page, to replace the long URL in search results with
            a Home > Section > Page trail. It returns that schema inside a
            next/script <Script> tag, which injects client-side, so a crawler
            never sees it. Verified against the live site as Googlebot on
            /repair-centre/ups/ups-bypass-fault and /generators/sizes/100-kva:
            no BreadcrumbList on either — the exact "JSON-LD via next/script is
            invisible" trap this project has hit before.

            AND IT FORCED THE WHOLE SITE DYNAMIC. It reads the path via
            headers(), and a request API called from the ROOT layout opts every
            page into dynamic rendering. That is what produced
                Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate
            on all ~3,400 URLs, so no visitor's browser ever cached a page and
            repeat visits re-downloaded 440KB of HTML. This mount was the last
            of three such triggers, after i18n.ts's cookies() read and the
            layout's own getLocale()/getMessages().

            TO BRING BREADCRUMBS BACK PROPERLY: render the JSON-LD as a plain
            <script type="application/ld+json"> so it is in the server HTML,
            and pass the path in from each route rather than reading headers()
            here — otherwise the schema costs every page its cacheability. */}

        <nav id="main-navigation" aria-label="Main navigation">
          <TeslaStyleNavigation />
        </nav>
        {/* Site-wide B2B positioning strip — single source of truth.
            Mounted here so EVERY page in the site carries the B2B message.
            See components/b2b/B2BSiteStrip.tsx and tests/regression/site-invariants.test.ts. */}
        <B2BSiteStrip />
        <main id="main-content" role="main" aria-label="Main content">
          {children}
        </main>
        {/* PremiumFooter renders its own semantic <footer>; we wrap it in a
            <div> (not <footer>) to avoid nested-footer markup while keeping
            the #contact-section anchor target stable. The B2B strip is mounted
            ONCE near the top (after TeslaStyleNavigation); a second mount
            here would render the strip twice on every page. */}
        <div id="contact-section">
          <PremiumFooter />
        </div>

        {/* Keyboard shortcuts reference for screen readers — see the note where
            this used to mount, at the top of <body>. Placed after the content so
            it is not the document's first heading. */}
        <KeyboardShortcutsHelper />
        
        {/* ═══════════════════════════════════════════════════════════════════
            NON-CRITICAL: Client-side components loaded after page is interactive
        ════════════════════════════════════════════════════════════════════ */}
        <ClientSideComponents />

        {/* ═══════════════════════════════════════════════════════════════════
            DEFERRED COMPONENTS - Load 2 seconds AFTER page is interactive
            Includes: AI Assistant, Conversion tools, SEO, Performance monitoring
            This reduces initial bundle by ~500KB for faster FCP
        ════════════════════════════════════════════════════════════════════ */}
        <DeferredComponents />

        {/* ═══════════════════════════════════════════════════════════════════
            DEFERRED SCRIPTS - Load after page is interactive
        ════════════════════════════════════════════════════════════════════ */}
        
        {/* PERF: removed blanket cache-clearing script. The previous version called
            caches.delete() on EVERY page load, which destroyed the browser cache
            and forced full re-download of every asset. Cache invalidation is now
            handled by Next.js content hashing on the asset URLs. */}
        
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

        {/* PERF: Performance Monitoring — only attached in dev. Production users
            should not pay the cost of three PerformanceObservers and a load-time
            handler that exist only to log to the console. */}
        {isDev && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                // Ultra Performance Tracking
                const TARGETS = { FCP: 500, LCP: 1000, FID: 50, CLS: 0.1, TTFB: 100 };

                // Track Core Web Vitals
                if ('PerformanceObserver' in window) {
                  // First Contentful Paint & Largest Contentful Paint
                  new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                      const value = entry.startTime;
                      ${isDev ? `
                      const target = entry.name === 'first-contentful-paint' ? TARGETS.FCP : TARGETS.LCP;
                      const status = value <= target ? '✅' : '⚠️';
                      console.log(status + ' ' + entry.name + ': ' + value.toFixed(0) + 'ms (target: ' + target + 'ms)');
                      ` : ''}
                    }
                  }).observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

                  // First Input Delay
                  new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                      const value = entry.processingStart - entry.startTime;
                      ${isDev ? `
                      const status = value <= TARGETS.FID ? '✅' : '⚠️';
                      console.log(status + ' FID: ' + value.toFixed(0) + 'ms (target: ' + TARGETS.FID + 'ms)');
                      ` : ''}
                    }
                  }).observe({ entryTypes: ['first-input'] });

                  // Cumulative Layout Shift
                  let clsValue = 0;
                  new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                      if (!entry.hadRecentInput) clsValue += entry.value;
                    }
                    ${isDev ? `
                    const status = clsValue <= TARGETS.CLS ? '✅' : '⚠️';
                    console.log(status + ' CLS: ' + clsValue.toFixed(3) + ' (target: ' + TARGETS.CLS + ')');
                    ` : ''}
                  }).observe({ entryTypes: ['layout-shift'] });
                }

                // Time to First Byte
                window.addEventListener('load', () => {
                  const navEntry = performance.getEntriesByType('navigation')[0];
                  if (navEntry) {
                    const ttfb = navEntry.responseStart - navEntry.requestStart;
                    ${isDev ? `
                    const status = ttfb <= TARGETS.TTFB ? '✅' : '⚠️';
                    console.log(status + ' TTFB: ' + ttfb.toFixed(0) + 'ms (target: ' + TARGETS.TTFB + 'ms)');
                    console.log('%c⚡ EmersonEIMS - World\\'s #1 Fastest Website', 'background: linear-gradient(135deg, #FFD166, #06B6D4); color: #000; padding: 12px 24px; font-size: 16px; font-weight: bold; border-radius: 8px;');
                    ` : ''}
                  }
                });
              }
            `,
          }}
        />
        )}
        </NextIntlClientProvider>
        </ScreenReaderAnnouncerProvider>
      </body>
    </html>
  );
}
