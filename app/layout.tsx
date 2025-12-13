import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk, Playfair_Display } from "next/font/google";
import "./globals.css";
import SiteSearchWrapper from "@/components/shared/SiteSearchWrapper";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${playfairDisplay.variable} ${inter.variable} antialiased touch-manipulation`}
      >
        <SiteSearchWrapper />
        {children}
      </body>
    </html>
  );
}
