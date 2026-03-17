'use client';

/**
 * Premium Skeleton Loaders - Apple/Tesla Quality Loading States
 *
 * PERFORMANCE OPTIMIZED:
 * - Zero external dependencies (no framer-motion)
 * - Pure CSS animations for 60fps
 * - GPU-accelerated transforms
 * - Minimal DOM nodes
 *
 * These provide instant perceived performance by showing
 * placeholder content while real content loads.
 */

// Base shimmer animation - Pure CSS for maximum performance
const shimmerClass = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent";

/**
 * Card Skeleton - For service cards, product cards, etc.
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700 p-6 ${shimmerClass} ${className}`}>
      <div className="h-6 bg-slate-700 rounded w-3/4 mb-4" />
      <div className="h-4 bg-slate-700 rounded w-full mb-2" />
      <div className="h-4 bg-slate-700 rounded w-5/6 mb-4" />
      <div className="h-10 bg-slate-700 rounded w-1/3" />
    </div>
  );
}

/**
 * Hero Skeleton - For page hero sections
 */
export function HeroSkeleton() {
  return (
    <div className={`py-20 px-4 ${shimmerClass}`}>
      <div className="max-w-4xl mx-auto">
        <div className="h-12 bg-slate-800 rounded w-3/4 mb-6" />
        <div className="h-6 bg-slate-800 rounded w-full mb-2" />
        <div className="h-6 bg-slate-800 rounded w-5/6 mb-8" />
        <div className="flex gap-4">
          <div className="h-12 bg-slate-700 rounded-lg w-40" />
          <div className="h-12 bg-slate-700 rounded-lg w-40" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid Skeleton - For service grids, product listings
 */
export function GridSkeleton({ count = 6, columns = 3 }: { count?: number; columns?: number }) {
  const colsClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  return (
    <div className={`grid gap-6 ${colsClass}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Table Skeleton - For data tables
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className={`bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden ${shimmerClass}`}>
      {/* Header */}
      <div className="flex gap-4 p-4 border-b border-slate-700 bg-slate-800/50">
        <div className="h-4 bg-slate-700 rounded w-1/4" />
        <div className="h-4 bg-slate-700 rounded w-1/4" />
        <div className="h-4 bg-slate-700 rounded w-1/4" />
        <div className="h-4 bg-slate-700 rounded w-1/4" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border-b border-slate-700/50">
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
          <div className="h-4 bg-slate-700/50 rounded w-1/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Diagnostic Panel Skeleton - For Generator Oracle panels
 */
export function DiagnosticPanelSkeleton() {
  return (
    <div className={`bg-slate-900/90 rounded-2xl border border-cyan-500/30 p-6 ${shimmerClass}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-slate-700 rounded-full" />
        <div>
          <div className="h-5 bg-slate-700 rounded w-40 mb-2" />
          <div className="h-3 bg-slate-700 rounded w-24" />
        </div>
      </div>
      {/* Content */}
      <div className="space-y-4">
        <div className="h-4 bg-slate-700 rounded w-full" />
        <div className="h-4 bg-slate-700 rounded w-5/6" />
        <div className="h-4 bg-slate-700 rounded w-4/6" />
      </div>
      {/* Gauges */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="h-24 bg-slate-700 rounded-xl" />
        <div className="h-24 bg-slate-700 rounded-xl" />
        <div className="h-24 bg-slate-700 rounded-xl" />
      </div>
    </div>
  );
}

/**
 * Image Skeleton - For images with blur placeholder
 */
export function ImageSkeleton({ aspectRatio = '16/9', className = '' }: { aspectRatio?: string; className?: string }) {
  return (
    <div
      className={`bg-slate-800 rounded-lg ${shimmerClass} ${className}`}
      style={{ aspectRatio }}
    />
  );
}

/**
 * Text Skeleton - For paragraphs
 */
export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-slate-700 rounded ${shimmerClass}`}
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        />
      ))}
    </div>
  );
}

/**
 * Page Skeleton - Full page loading state
 */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      <HeroSkeleton />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <GridSkeleton count={6} />
      </div>
    </div>
  );
}

/**
 * Location Page Skeleton
 */
export function LocationPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black animate-pulse">
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-8">
        <div className="flex gap-2">
          <div className="h-4 bg-slate-800 rounded w-12" />
          <div className="h-4 bg-slate-800 rounded w-20" />
          <div className="h-4 bg-slate-800 rounded w-24" />
        </div>
      </div>

      {/* Hero */}
      <HeroSkeleton />

      {/* Services Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-8 bg-slate-800 rounded w-64 mb-8" />
        <GridSkeleton count={9} columns={3} />
      </div>
    </div>
  );
}

// Add shimmer keyframe to global CSS
export const shimmerKeyframe = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
`;
