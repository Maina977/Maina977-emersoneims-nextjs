'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const ProBuildingSuiteComplete = dynamic(
  () => import('@/components/building/ProBuildingSuiteComplete'),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-emerald-400 text-lg">Loading Pro Building Suite...</p>
          <p className="text-gray-500 text-sm mt-2">27 AI Engines Initializing</p>
        </div>
      </div>
    )
  }
);

export default function ProBuildingSuitePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-emerald-400">Loading...</div>
        </div>
      }>
        <ProBuildingSuiteComplete />
      </Suspense>
    </main>
  );
}
