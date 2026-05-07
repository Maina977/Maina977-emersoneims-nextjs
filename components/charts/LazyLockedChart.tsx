'use client';

/**
 * LazyLockedChart — code-splits chart.js + react-chartjs-2 out of the
 * initial bundle. The wrapper keeps the same public surface as
 * `LockedChart`, but the heavy chart engine is fetched only after the
 * surrounding panel is interactive.
 *
 * Why this matters: chart.js is ~70 kB gzipped and react-chartjs-2 adds a
 * full client tree. Pages like /hub render multiple charts but they sit
 * below the fold; deferring the bundle improves FCP and TTI on every
 * device, especially mobile.
 */

import dynamic from 'next/dynamic';
import type { LockedChartProps } from '@/components/charts/dataviz';

const Inner = dynamic(
  () => import('@/components/charts/dataviz').then((m) => m.LockedChart),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="rounded-md border"
        style={{
          height: 280,
          background:
            'linear-gradient(110deg, rgba(15,30,60,0.04) 25%, rgba(15,30,60,0.08) 45%, rgba(15,30,60,0.04) 65%)',
          backgroundSize: '200% 100%',
          borderColor: 'var(--color-border-subtle)',
          animation: 'cockpit-flow-shimmer 1.6s linear infinite',
        }}
      />
    ),
  },
);

export default function LazyLockedChart(props: LockedChartProps) {
  return <Inner {...props} />;
}
