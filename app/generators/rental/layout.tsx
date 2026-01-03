import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Rental Kenya | Daily, Weekly, Monthly | 7.5kVA to 2MVA | EmersonEIMS',
  description: 'Generator rental services across all 47 Kenya counties. Rent generators from 7.5kVA to 2MVA for events, construction, emergencies. Same-day delivery in Nairobi. Silent generators for weddings, concerts, corporate events. 24/7 support.',
  keywords: [
    // Primary Rental Keywords
    'generator rental Kenya',
    'generator hire Kenya',
    'rent generator Nairobi',
    'generator for hire',
    'portable generator rental',
    'industrial generator rental',
    // Size Categories
    'small generator rental',
    '10 kVA generator rental',
    '20 kVA generator rental',
    '50 kVA generator rental',
    '100 kVA generator rental',
    '200 kVA generator rental',
    '500 kVA generator rental',
    '1000 kVA generator rental',
    '1 MVA generator rental',
    '2 MVA generator rental',
    // Events
    'generator for wedding Kenya',
    'generator for events',
    'generator for concert',
    'generator for outdoor event',
    'generator for corporate event',
    'silent generator rental',
    'quiet generator for events',
    // Construction
    'construction site generator',
    'generator for construction',
    'temporary power rental',
    'site power rental',
    // Emergency
    'emergency generator rental',
    'backup generator rental',
    'standby generator rental',
    'hospital backup generator',
    // Location Keywords
    'generator rental Mombasa',
    'generator rental Kisumu',
    'generator rental Nakuru',
    'generator rental Eldoret',
    'generator hire Nairobi',
    // Terms
    'daily generator rental',
    'weekly generator rental',
    'monthly generator rental',
    'long term generator rental',
    'short term generator hire',
    // Film/Production
    'generator for film production',
    'generator for TV production',
    'quiet generator filming',
    // Long-tail
    'how much to rent a generator in Kenya',
    'generator rental prices Kenya',
    'generator rental cost Nairobi',
    'cheap generator rental Kenya',
    'best generator rental company Kenya',
    'generator rental with delivery',
    'generator rental with operator',
  ],
  openGraph: {
    title: 'Generator Rental Kenya | 7.5kVA - 2MVA | All 47 Counties',
    description: 'Rent generators for any occasion. 50+ units available. Same-day delivery. Silent units for events. 24/7 support. Best rates in Kenya.',
    type: 'website',
    url: 'https://emersoneims.com/generators/rental',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/generator-rental.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Generator Rental Fleet',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Rental Kenya | EmersonEIMS',
    description: 'Rent generators 7.5kVA-2MVA. Events, construction, emergencies. All 47 counties.',
  },
  alternates: {
    canonical: 'https://emersoneims.com/generators/rental',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RentalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
