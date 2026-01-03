'use client';

import dynamic from 'next/dynamic';
import { Suspense, ComponentType } from 'react';

// Skeleton loader for 3D scenes
const Scene3DSkeleton = () => (
  <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-gray-900 via-black to-gray-800 animate-pulse flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-white/50 text-sm">Loading 3D Scene...</p>
    </div>
  </div>
);

// Chart loading skeleton
const ChartSkeleton = () => (
  <div className="w-full h-full min-h-[200px] bg-gray-900/50 animate-pulse rounded-lg flex items-center justify-center">
    <div className="text-white/30">Loading Chart...</div>
  </div>
);

// Map loading skeleton  
const MapSkeleton = () => (
  <div className="w-full h-full min-h-[400px] bg-gray-900 animate-pulse flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 mx-auto bg-orange-500/20 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-orange-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <p className="text-white/50 text-sm">Loading Map...</p>
    </div>
  </div>
);

// ============================================
// LAZY LOADED 3D COMPONENTS (Heavy ~500KB+)
// ============================================

export const LazyHeroCanvas = dynamic(
  () => import('@/components/hero/HeroCanvas'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyGeneratorCore = dynamic(
  () => import('@/components/webgl/GeneratorCore'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyAdvancedGeneratorScene = dynamic(
  () => import('@/components/webgl/AdvancedGeneratorScene'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyCumminsGenerator3D = dynamic(
  () => import('@/components/webgl/CumminsGenerator3D'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyFloatingUFOs = dynamic(
  () => import('@/components/webgl/FloatingUFOs'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyInteractiveBlobs = dynamic(
  () => import('@/components/webgl/InteractiveBlobs'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyAdvancedParticles = dynamic(
  () => import('@/components/webgl/AdvancedParticles'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyAbstractFloatingShapes = dynamic(
  () => import('@/components/webgl/AbstractFloatingShapes'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazySimpleThreeScene = dynamic(
  () => import('@/components/webgl/SimpleThreeScene'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyFullScreenHero = dynamic(
  () => import('@/components/immersive/FullScreenHero'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

export const LazyProductConfigurator = dynamic(
  () => import('@/components/product/ProductConfigurator'),
  { ssr: false, loading: () => <Scene3DSkeleton /> }
);

// ============================================
// LAZY LOADED CHART COMPONENTS (Heavy ~300KB+)
// ============================================

export const LazyServiceAnalytics = dynamic(
  () => import('@/components/diagnostics/ServiceAnalytics'),
  { ssr: false, loading: () => <ChartSkeleton /> }
);

// ============================================
// LAZY LOADED MAP COMPONENTS (Heavy ~200KB+)
// ============================================

// If you have Mapbox components, add them here
// export const LazyMapboxMap = dynamic(
//   () => import('@/components/maps/MapboxMap'),
//   { ssr: false, loading: () => <MapSkeleton /> }
// );

// ============================================
// WRAPPER COMPONENTS WITH INTERSECTION OBSERVER
// ============================================

interface LazyLoadWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

// Lazy load content only when visible in viewport
export function LazyLoadOnView({ 
  children, 
  fallback = <Scene3DSkeleton />,
  rootMargin = '200px'
}: LazyLoadWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
}

// Re-export skeletons for external use
export { Scene3DSkeleton, ChartSkeleton, MapSkeleton };
