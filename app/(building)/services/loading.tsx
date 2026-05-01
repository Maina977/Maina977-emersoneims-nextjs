// INSTANT SKELETON - Services page loads instantly
export default function ServicesLoading() {
  return (
    <div className="min-h-screen bg-black pt-24">
      {/* Hero */}
      <div className="py-20 px-6 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 w-64 bg-gray-800 rounded-lg mx-auto mb-6 animate-pulse" />
          <div className="h-6 w-96 max-w-full bg-gray-800/50 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl p-8 border border-gray-800 animate-pulse">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full mb-6" />
              <div className="h-6 bg-gray-800 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-800/50 rounded w-full mb-2" />
              <div className="h-4 bg-gray-800/50 rounded w-5/6 mb-2" />
              <div className="h-4 bg-gray-800/50 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
