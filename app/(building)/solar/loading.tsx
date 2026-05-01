// INSTANT SKELETON - Solar page loads instantly
export default function SolarLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Skeleton */}
      <div className="h-screen bg-gradient-to-b from-amber-950/20 to-black animate-pulse">
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="h-16 w-80 bg-amber-800/30 rounded-lg mb-6" />
          <div className="h-8 w-[500px] max-w-full bg-gray-800/50 rounded-lg mb-4" />
          <div className="flex gap-4 mt-8">
            <div className="h-12 w-40 bg-amber-500/20 rounded-xl" />
            <div className="h-12 w-40 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
