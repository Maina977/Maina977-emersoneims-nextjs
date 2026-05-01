'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const AIBoreholeAnalyzer = dynamic(
  () => import('../../ai-borehole-analyzer/src/index').then(mod => mod.default ? mod : { default: mod }),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <AIBoreholeAnalyzer />
      </div>
    </main>
  );
}