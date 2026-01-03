import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Installation Services Kenya | Professional Installation | EmersonEIMS',
  description: 'Professional generator installation services across all 47 Kenya counties. Complete 8-phase installation process: site assessment, engineering design, civil works, electrical installation, commissioning. KEBS certified. All brands: Cummins, Caterpillar, Perkins, FG Wilson.',
  keywords: [
    // Primary Installation Keywords
    'generator installation Kenya',
    'generator installation services',
    'generator installation Nairobi',
    'professional generator installation',
    'commercial generator installation',
    'industrial generator installation',
    'residential generator installation',
    // Installation Types
    'indoor generator installation',
    'outdoor generator installation',
    'rooftop generator installation',
    'containerized generator installation',
    'temporary generator installation',
    // Brands
    'Cummins generator installation',
    'Caterpillar generator installation',
    'Perkins generator installation',
    'FG Wilson generator installation',
    'Kohler generator installation',
    // Technical Terms
    'ATS installation Kenya',
    'automatic transfer switch installation',
    'generator foundation construction',
    'generator electrical wiring',
    'generator commissioning',
    'load bank testing Kenya',
    'generator earthing system',
    // Compliance
    'KEBS generator certification',
    'NEMA generator permit',
    'Kenya Power generator connection',
    'generator compliance Kenya',
    // Services
    'generator site assessment',
    'generator engineering design',
    'generator civil works',
    'generator mechanical installation',
    'generator electrical installation',
    'generator testing commissioning',
    // Location Keywords
    'generator installation Mombasa',
    'generator installation Kisumu',
    'generator installation Nakuru',
    'generator installation Eldoret',
    'generator installation Kiambu',
    'generator installation Machakos',
    // Long-tail
    'how to install a generator Kenya',
    'generator installation cost Kenya',
    'generator installation requirements',
    'generator installation checklist',
    'generator installation guide Kenya',
    'best generator installation company Kenya',
  ],
  openGraph: {
    title: 'Professional Generator Installation Services | EmersonEIMS Kenya',
    description: 'Complete generator installation from site assessment to commissioning. 1,200+ installations completed. 47 counties coverage. 100% compliance rate.',
    type: 'website',
    url: 'https://emersoneims.com/generators/installation',
    siteName: 'EmersonEIMS',
    images: [
      {
        url: 'https://www.emersoneims.com/wp-content/uploads/2024/09/gen-installation.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Professional Generator Installation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Installation Kenya | EmersonEIMS',
    description: 'Professional generator installation services. 8-phase process. All brands. 47 counties.',
  },
  alternates: {
    canonical: 'https://emersoneims.com/generators/installation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function InstallationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
