'use client';

import dynamic from 'next/dynamic';
import EmbedRouteLoading from '@/components/building-suite/EmbedRouteLoading';

const BuildingSuiteEmbed = dynamic(
  () => import('@/components/building-suite/BuildingSuiteEmbed'),
  {
    ssr: false,
    loading: () => <EmbedRouteLoading />,
  },
);

export default function EimsProClient() {
  return <BuildingSuiteEmbed />;
}
