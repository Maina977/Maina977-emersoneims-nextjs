import type { Metadata } from "next";
import { Suspense } from 'react';
import { Geist, Geist_Mono, Inter, Manrope, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./styles/analytics.css";
import "./styles/high-contrast.css";
import SiteSearchWrapper from "@/components/shared/SiteSearchWrapper";
import SciFiHeader from "@/components/layout/SciFiHeader";
import SciFiFooter from "@/components/layout/SciFiFooter";
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";
import WebVitals from "@/components/analytics/WebVitals";
import ComprehensiveAnalytics from "@/components/analytics/ComprehensiveAnalytics";
import AIEngagement from "@/components/analytics/AIEngagement";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SkipToContent from "@/components/accessibility/SkipToContent";
import FocusVisible from "@/components/accessibility/FocusVisible";
import AdvancedPreloader from "@/components/performance/AdvancedPreloader";
import FontOptimizer from "@/components/performance/FontOptimizer";
import CustomCursor from "@/components/interactions/CustomCursor";
import LiveChat from "@/components/interactive/LiveChat";
import LiveVisitorCount from "@/components/social/LiveVisitorCount";
import HighContrastMode from "@/components/accessibility/HighContrastMode";
import UserProfile from "@/components/personalization/UserProfile";
import StructuredData from "@/components/seo/StructuredData";

// Primary display font - Premium, elegant (Apple-level)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

// Monospace font for tech elements
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

// Premium sans-serif for headings (Nike-level impact)
const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  preload: true,
});

// Elegant serif for hero text (Apple-level elegance)
const playfairDisplay = Playfair_Display({
  variable: "--font-hero",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
});

// Premium body font (Apple-level readability)
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
  // Note: Font features are handled via CSS font-feature-settings
});

// Manrope - Premium sans-serif alternative
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Emerson EIMS - Energy Infrastructure Management System",
    template: "%s | Emerson EIMS",
  },
  description: "Professional energy infrastructure management solutions including generators, solar systems, UPS, and comprehensive diagnostics.",
  keywords: [
    "energy management",
    "generators",
    "solar systems",
    "UPS",
    "power infrastructure",
    "diagnostics",
    "Emerson EIMS",
  ],
  authors: [{ name: "Emerson EIMS" }],
  creator: "Emerson EIMS",
  publisher: "Emerson EIMS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.emersoneims.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.emersoneims.com",
    siteName: "Emerson EIMS",
    title: "Emerson EIMS - Energy Infrastructure Management System",
    description: "Professional energy infrastructure management solutions",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.emersoneims.com"}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Emerson EIMS - Energy Infrastructure Management System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Emerson EIMS - Energy Infrastructure Management System",
    description: "Professional energy infrastructure management solutions",
    images: [`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.emersoneims.com"}/twitter-image.jpg`],
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.emersoneims.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Resource Hints for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* Preload Critical Resources */}
        <link rel="preload" href="/fonts/space-grotesk.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/playfair-display.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Performance Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Performance Hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fbbf24" />
        <meta name="apple-mobile-web-app-title" content="EmersonEIMS" />
        
        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'EmersonEIMS',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com',
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com'}/logo.png`,
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
              sameAs: [
                'https://www.linkedin.com/company/emersoneims',
                'https://www.facebook.com/emersoneims',
                'https://twitter.com/emersoneims',
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable} ${manrope.variable} antialiased touch-manipulation`}
      >
        {/* Universal Premium Sci-Fi Cursor - Awwwards SOTD Level */}
        <CustomCursor enabled={true} />
        <ServiceWorkerRegistration />
        <WebVitals />
        <ComprehensiveAnalytics />
        <AIEngagement />
        <GoogleAnalytics />
        <AdvancedPreloader />
        <FontOptimizer />
        <FocusVisible />
        <SkipToContent />
        <SiteSearchWrapper />
        <SciFiHeader />
        <main className="pt-20" id="main-content" role="main">
          {children}
        </main>
        <SciFiFooter />
        <LiveChat />
        <LiveVisitorCount />
        <HighContrastMode />
        <UserProfile />
        <StructuredData
          type="Organization"
          data={{
            name: 'Emerson EIMS',
            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com',
            logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://emersoneims.com'}/logo.png`,
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
      </body>
    </html>
  );
}
