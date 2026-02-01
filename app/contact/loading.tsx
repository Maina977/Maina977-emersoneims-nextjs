// INSTANT SKELETON - Contact page loads instantly
export default function ContactLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-24">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Form Skeleton */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-800 rounded-lg w-48 animate-pulse" />
            <div className="h-6 bg-gray-800/50 rounded w-full animate-pulse" />
            <div className="space-y-4">
              <div className="h-12 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-12 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-32 bg-gray-800/30 rounded-lg animate-pulse" />
              <div className="h-12 bg-amber-500/20 rounded-lg w-40 animate-pulse" />
            </div>
          </div>
          {/* Info Skeleton */}
          <div className="space-y-6">
            <div className="h-10 bg-gray-800 rounded-lg w-48 animate-pulse" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/20 rounded-lg animate-pulse">
                  <div className="w-12 h-12 bg-gray-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-800 rounded w-24 mb-2" />
                    <div className="h-4 bg-gray-800/50 rounded w-48" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
