import { Metadata } from 'next';
import { QRCodeGallery } from '@/components/business/QRCodeGenerator';

export const metadata: Metadata = {
  title: 'QR Codes | EmersonEIMS',
  description: 'Download QR codes for EmersonEIMS business cards, brochures, and marketing materials.',
  robots: {
    index: false, // Don't index this internal page
    follow: false,
  },
};

export default function QRCodesPage() {
  return <QRCodeGallery />;
}
