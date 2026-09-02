import { Metadata } from 'next';
import { QRCodeGallery } from '@/components/business/QRCodeGenerator';

export const metadata: Metadata = {
  // Self-referential canonical. Declared here so this route does not depend
  // on the root layout reading headers() — that call forced the whole site
  // to render dynamically and disabled browser caching everywhere.
  alternates: { canonical: 'https://www.emersoneims.com/admin/qr-codes' },
  title: 'QR Codes',
  description: 'Download QR codes for EmersonEIMS business cards, brochures, and marketing materials.',
  robots: {
    index: false, // Don't index this internal page
    follow: false,
  },
};

export default function QRCodesPage() {
  return <QRCodeGallery />;
}
