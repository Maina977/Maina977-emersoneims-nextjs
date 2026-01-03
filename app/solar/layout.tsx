import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Power Solutions Kenya | Commercial & Residential Solar Installation | EmersonEIMS',
  description: 'Leading solar installation company in Kenya. Complete solar solutions: panels, batteries, inverters for homes, businesses, industries. 47 counties coverage. 25-year warranty. Free consultation. Calculate your savings today.',
  keywords: [
    // Primary Keywords
    'solar installation Kenya',
    'solar panels Kenya',
    'solar power systems Nairobi',
    'commercial solar Kenya',
    'residential solar Kenya',
    'solar company Kenya',
    // Products
    'solar panels for sale Kenya',
    'solar batteries Kenya',
    'solar inverters Kenya',
    'lithium batteries solar',
    'LFP batteries Kenya',
    'hybrid solar system',
    // Services
    'solar installation services',
    'solar system design Kenya',
    'solar maintenance Kenya',
    'solar repair Kenya',
    'off-grid solar Kenya',
    'grid-tied solar Kenya',
    // Applications
    'solar for homes Kenya',
    'solar for businesses Kenya',
    'solar for hospitals Kenya',
    'solar for hotels Kenya',
    'solar for factories Kenya',
    'solar for schools Kenya',
    'solar for farms Kenya',
    'solar irrigation Kenya',
    'solar water pumping',
    // County Coverage
    'solar Nairobi',
    'solar Mombasa',
    'solar Kisumu',
    'solar Nakuru',
    'solar Eldoret',
    'solar Kiambu',
    'solar Machakos',
    'solar Kajiado',
    'solar Garissa',
    'solar Turkana',
    // Benefits
    'solar savings Kenya',
    'reduce electricity bills Kenya',
    'solar ROI calculator',
    'solar payback period',
    'solar financing Kenya',
    // Technical
    'solar system sizing Kenya',
    'solar irradiance Kenya',
    'peak sun hours Kenya',
    'solar calculator Kenya',
    'kWh solar production',
    // Brands
    'tier 1 solar panels Kenya',
    'monocrystalline panels Kenya',
    'premium solar panels',
    // Long-tail
    'how much does solar cost in Kenya',
    'best solar company in Kenya',
    'solar installation cost Kenya',
    'solar power for home Nairobi',
    'commercial solar installation Kenya',
    'industrial solar solutions Kenya',
    'solar backup power Kenya',
    'solar vs generator Kenya',
    'solar energy Kenya 2024',
    'clean energy Kenya',
    'renewable energy Kenya',
    'sustainable power Kenya',
    'green energy solutions Kenya',
    'ESG solar Kenya',
  ],
  openGraph: {
    title: 'Solar Power Solutions Kenya | 47 Counties Coverage | EmersonEIMS',
    description: 'Transform your energy with premium solar solutions. 2,450+ projects completed. 98.7% system uptime. 25-year warranty. Interactive calculator for instant quotes.',
    type: 'website',
    url: 'https://emersoneims.com/solar',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Premium Solar Installation Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Solar Power Solutions Kenya | EmersonEIMS',
    description: 'Premium solar installations across 47 counties. Calculate your savings instantly. 25-year warranty.',
    images: ['https://www.emersoneims.com/wp-content/uploads/2025/11/SOLAR-IMAGE-KADENCE.png'],
  },
  alternates: {
    canonical: 'https://emersoneims.com/solar',
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
};

export default function SolarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}
