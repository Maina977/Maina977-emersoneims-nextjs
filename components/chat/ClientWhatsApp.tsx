'use client';

import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(() => import('@/components/chat/WhatsAppButton'), { 
  ssr: false,
  loading: () => null
});

export default function ClientWhatsApp() {
  return <WhatsAppButton />;
}
