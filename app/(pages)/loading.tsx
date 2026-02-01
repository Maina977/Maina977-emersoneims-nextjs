// Generic page loading skeleton
export default function PageLoading() {
  return (
    <div className="min-h-screen bg-black pt-24">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="h-10 bg-gray-800 rounded-lg w-64 mb-8 animate-pulse" />

        {/* Content blocks */}
        <div className="space-y-6">
          <div className="h-6 bg-gray-800/50 rounded w-full animate-pulse" />
          <div className="h-6 bg-gray-800/50 rounded w-5/6 animate-pulse" />
          <div className="h-6 bg-gray-800/50 rounded w-4/6 animate-pulse" />
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-6 animate-pulse">
              <div className="h-40 bg-gray-800 rounded-lg mb-4" />
              <div className="h-5 bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-800/50 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
