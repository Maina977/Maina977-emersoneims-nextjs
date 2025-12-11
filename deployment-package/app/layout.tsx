import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
