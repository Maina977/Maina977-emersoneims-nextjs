'use client';

import dynamic from 'next/dynamic';
import EmbedRouteLoading from '@/components/building-suite/EmbedRouteLoading';

// Native Next.js Pro Building Suite — replaces the legacy iframe that targeted
// http://127.0.0.1:5000 (a local Flask app that doesn't exist on Vercel).
// This is the same 203+ capability UI that already serves /solutions/building,
// and it is fully self-contained: no Python backend required.
const ProBuildingSuiteComplete = dynamic(
  () => import('@/components/building/ProBuildingSuiteComplete'),
  {
    ssr: false,
    loading: () => <EmbedRouteLoading />,
  },
);

export default function ProBuildingSuiteClient() {
  return <ProBuildingSuiteComplete />;
}
