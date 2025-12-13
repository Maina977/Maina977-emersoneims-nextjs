'use client';

import dynamic from 'next/dynamic';

const SiteSearch = dynamic(() => import('@/components/shared/SiteSearch'), { ssr: false });

export default function SiteSearchWrapper() {
  return <SiteSearch />;
}




