'use client';

// ULTRA-FAST GLOBAL LOADING - Instant perceived performance
export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative">
        {/* Pulsing Logo Placeholder */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-amber-500/20 animate-pulse" />

        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 animate-spin" />

        {/* Loading Text */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
          <span className="text-white/60 text-sm font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
}
