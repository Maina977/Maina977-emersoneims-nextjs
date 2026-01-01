import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Generator Diagnostic BIBLE | 5,930+ Error Codes | Free Online Tool | EmersonEIMS',
  description: 'The world\'s most comprehensive generator error code database. Find and fix any generator problem with step-by-step solutions. Covers Cummins, Caterpillar, Perkins, Kohler, MTU, Volvo, FG Wilson & more. Works offline. Free to use.',
  keywords: [
    'generator error codes',
    'generator diagnostic tool',
    'generator troubleshooting',
    'Cummins error codes',
    'Caterpillar generator codes',
    'Perkins fault codes',
    'Kohler generator diagnostics',
    'generator repair guide',
    'generator maintenance',
    'diesel generator problems',
    'generator won\'t start',
    'generator overheat fix',
    'low oil pressure generator',
    'generator voltage problems',
    'AVR fault codes',
    'generator ECM codes',
    'free generator diagnostic',
    'offline generator manual',
    'Kenya generator repair',
    'East Africa generator service'
  ],
  openGraph: {
    title: 'Generator Diagnostic BIBLE | 5,930+ Error Codes | EmersonEIMS',
    description: 'Free online tool with the world\'s largest generator error code database. Step-by-step solutions for all major brands. Works offline.',
    type: 'website',
    url: 'https://emersoneims.com/diagnostic-suite',
    images: [
      {
        url: '/images/diagnostic-suite-og.jpg',
        width: 1200,
        height: 630,
        alt: 'EmersonEIMS Generator Diagnostic Suite'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Generator Diagnostic BIBLE | 5,930+ Error Codes',
    description: 'The world\'s most comprehensive generator troubleshooting tool. Free. Works offline.',
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
  alternates: {
    canonical: 'https://emersoneims.com/diagnostic-suite',
  },
  other: {
    'application-name': 'EmersonEIMS Generator Diagnostic BIBLE',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Generator Diagnostic',
  }
};

export default function DiagnosticSuiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
