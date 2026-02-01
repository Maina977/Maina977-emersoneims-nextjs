// INSTANT SKELETON - Generators page loads instantly
export default function GeneratorsLoading() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero Skeleton */}
      <div className="h-screen bg-gradient-to-b from-gray-900 to-black animate-pulse">
        <div className="flex flex-col items-center justify-center h-full px-6">
          <div className="h-16 w-96 bg-gray-800 rounded-lg mb-6" />
          <div className="h-8 w-[600px] max-w-full bg-gray-800/50 rounded-lg mb-4" />
          <div className="flex gap-4 mt-8">
            <div className="h-12 w-40 bg-amber-500/20 rounded-xl" />
            <div className="h-12 w-40 bg-gray-800 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse">
              <div className="h-48 bg-gray-800 rounded-lg mb-4" />
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
