import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import EmbedRouteLoading from '@/components/building-suite/EmbedRouteLoading';

const BuildingSuiteEmbed = dynamic(
  () => import('@/components/building-suite/BuildingSuiteEmbed'),
  {
    ssr: false,
    loading: () => <EmbedRouteLoading />,
  },
);

export const metadata: Metadata = {
  title: 'Building Suite Pro | Emerson EIMS',
  description:
    'Full EIMS engineering, quantity surveying, BIM, and professional reports — Building Suite Pro.',
  robots: { index: true, follow: true },
  alternates: {
    canonical: '/pro-building-suite',
  },
};

export default function ProBuildingSuitePage() {
  return <BuildingSuiteEmbed />;
}
