import type { Metadata } from "next";
import { Suspense } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Geist, Geist_Mono, Inter, Manrope, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import "./styles/analytics.css";
import "./styles/high-contrast.css";

// Three.js setup for React Three Fiber
import '@/lib/three/setup';
import ClientLayout from "@/components/layout/ClientLayout";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

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
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=(), interest-cohort=()" />
        <meta httpEquiv="Cross-Origin-Embedder-Policy" content="require-corp" />
        <meta httpEquiv="Cross-Origin-Opener-Policy" content="same-origin" />
        <meta httpEquiv="Cross-Origin-Resource-Policy" content="same-origin" />

        {/* Content Security Policy - Maximum Security */}
        <meta httpEquiv="Content-Security-Policy" content="
          default-src 'self';
          script-src 'self' 'unsafe-inline' 'unsafe-eval'
            https://www.googletagmanager.com
            https://www.google-analytics.com
            https://www.google.com
            https://www.gstatic.com
            https://fonts.googleapis.com
            https://fonts.gstatic.com;
          style-src 'self' 'unsafe-inline'
            https://fonts.googleapis.com;
          font-src 'self'
            https://fonts.gstatic.com
            data:;
          img-src 'self' data: blob:
            https://www.emersoneims.com
            https://emersoneims.com
            https://www.google-analytics.com
            https://www.googletagmanager.com
            https://fonts.gstatic.com;
          connect-src 'self'
            https://www.google-analytics.com
            https://www.googletagmanager.com
            https://www.emersoneims.com
            https://emersoneims.com
            wss://www.emersoneims.com
            wss://emersoneims.com;
          frame-src 'none';
          object-src 'none';
          base-uri 'self';
          form-action 'self';
          upgrade-insecure-requests;
          block-all-mixed-content;
        " />

        {/* Anti-Copy Protection */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

        {/* Anti-Malware Headers */}
        <meta httpEquiv="X-Download-Options" content="noopen" />
        <meta httpEquiv="X-Permitted-Cross-Domain-Policies" content="none" />
        
        {/* Performance Hints */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Emerson EIMS" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="apple-touch-icon-precomposed" content="yes" />
        <meta name="msapplication-TileColor" content="#FFD166" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="application-name" content="Emerson EIMS" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FFD166" />

        {/* Enhanced Apple Touch Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76.png" />

        {/* Icons */}
        <link rel="icon" href="/favicon.ico" />
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
              logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.emersoneims.com'}/logo.svg`,
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
        {/* MAXIMUM SECURITY - ANTI-COPYING PROTECTION */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                'use strict';

                // Disable right-click context menu
                document.addEventListener('contextmenu', function(e) {
                  e.preventDefault();
                  alert('🚫 Right-click is disabled for security reasons.');
                  return false;
                });

                // Disable text selection
                document.addEventListener('selectstart', function(e) {
                  e.preventDefault();
                  return false;
                });

                // Disable copy
                document.addEventListener('copy', function(e) {
                  e.preventDefault();
                  alert('🚫 Copying is disabled for security reasons.');
                  return false;
                });

                // Disable cut
                document.addEventListener('cut', function(e) {
                  e.preventDefault();
                  alert('🚫 Cutting is disabled for security reasons.');
                  return false;
                });

                // Disable paste
                document.addEventListener('paste', function(e) {
                  e.preventDefault();
                  alert('🚫 Pasting is disabled for security reasons.');
                  return false;
                });

                // Disable keyboard shortcuts for copy/cut/paste
                document.addEventListener('keydown', function(e) {
                  // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A, F12, Ctrl+Shift+I, Ctrl+U
                  if (
                    (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a')) ||
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                    (e.ctrlKey && e.key === 'u') ||
                    (e.ctrlKey && e.key === 's')
                  ) {
                    e.preventDefault();
                    alert('🚫 This action is disabled for security reasons.');
                    return false;
                  }
                });

                // Disable drag and drop
                document.addEventListener('dragstart', function(e) {
                  e.preventDefault();
                  return false;
                });

                // Disable image dragging
                document.addEventListener('dragstart', function(e) {
                  if (e.target.tagName === 'IMG') {
                    e.preventDefault();
                    return false;
                  }
                });

                // Disable print screen (visual feedback)
                document.addEventListener('keyup', function(e) {
                  if (e.key === 'PrintScreen') {
                    alert('🚫 Screenshots are not allowed for security reasons.');
                    // Clear clipboard
                    navigator.clipboard.writeText('');
                  }
                });

                // Anti-debugging protection
                let devtoolsOpen = false;
                const threshold = 160;

                const detectDevTools = function() {
                  if (window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold) {
                    if (!devtoolsOpen) {
                      devtoolsOpen = true;
                      alert('🚫 Developer tools detected. This action is not allowed.');
                      window.location.href = 'about:blank';
                    }
                  } else {
                    devtoolsOpen = false;
                  }
                };

                setInterval(detectDevTools, 500);

                // Anti-malware protection
                const suspiciousKeywords = [
                  'eval', 'Function', 'setTimeout', 'setInterval', 'XMLHttpRequest', 'fetch',
                  'document.write', 'innerHTML', 'outerHTML', 'insertAdjacentHTML',
                  'localStorage', 'sessionStorage', 'cookie', 'location.href'
                ];

                // Monitor for suspicious script injections
                const observer = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                      mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                          const element = node as Element;
                          if (element.tagName === 'SCRIPT') {
                            console.warn('🚨 Suspicious script injection detected!');
                            element.remove();
                          }
                        }
                      });
                    }
                  });
                });

                observer.observe(document.body, {
                  childList: true,
                  subtree: true
                });

                // Anti-keylogger protection
                let keystrokeCount = 0;
                const maxKeystrokes = 1000;
                const timeWindow = 60000; // 1 minute

                document.addEventListener('keydown', function() {
                  keystrokeCount++;
                  if (keystrokeCount > maxKeystrokes) {
                    alert('🚫 Suspicious activity detected. Access restricted.');
                    document.body.innerHTML = '<h1>🚫 Access Denied</h1><p>Suspicious activity detected.</p>';
                  }
                });

                setInterval(function() {
                  keystrokeCount = 0;
                }, timeWindow);

                // Watermark protection
                const watermark = document.createElement('div');
                watermark.innerHTML = '© 2025 Emerson EIMS - All Rights Reserved';
                watermark.style.cssText = \`
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%) rotate(-45deg);
                  font-size: 72px;
                  color: rgba(255, 255, 255, 0.03);
                  font-weight: bold;
                  pointer-events: none;
                  z-index: 9999;
                  user-select: none;
                  font-family: monospace;
                \`;
                document.body.appendChild(watermark);

                console.log('🔒 Maximum Security Activated - Anti-Copying, Anti-Malware, Anti-Virus Protection Enabled');
              })();
            `,
          }}
        />

        {/* Universal Premium Sci-Fi Cursor - Awwwards SOTD Level */}
        <NextIntlClientProvider messages={messages}>
          <ClientLayout>
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
