// Lightweight, lazy-first diagnostics page optimized for bundle size and SSR safety
'use client';
import React, { Suspense, lazy } from 'react';
import '@/app/styles/diagnostics.css';

// Lazy-load heavy parts and prefer client-only for interactive widgets
const HeroSection = lazy(() => import('@/components/diagnostics/HeroSection'));
const RealTimeMonitor = lazy(() => import('@/components/diagnostics/RealTimeMonitor'));
const DiagnosticMachine = lazy(() => import('@/components/diagnostics/DiagnosticMachine'));

// Simple fallback used across Suspense boundaries
function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white">Loading Diagnostics Cockpit...</p>
        <p className="text-gray-500 text-sm mt-2">Optimizing performance...</p>
      </div>
    </div>
  );
}

export default function DiagnosticsPage() {
  return (
    <main className="eims-section min-h-screen">
      <Suspense fallback={<LoadingSpinner />}>
        <HeroSection />

        <div className="eims-shell py-10">
          <Suspense fallback={<div className="h-40 bg-gray-900/50 rounded-xl animate-pulse my-6" />}>
            <RealTimeMonitor />
          </Suspense>

          <Suspense fallback={<div className="h-96 bg-gray-900/30 rounded-2xl border border-gray-800 animate-pulse my-8" />}>
            <DiagnosticMachine />
          </Suspense>
        </div>
      </Suspense>
    </main>
  );
}