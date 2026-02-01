// INSTANT SKELETON - Generator Oracle loads instantly
export default function GeneratorOracleLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950">
      {/* Hero */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 w-32 bg-purple-500/20 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-14 w-80 max-w-full bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-[450px] max-w-full bg-gray-800/50 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      {/* Search Box Skeleton */}
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800 animate-pulse">
          <div className="h-14 bg-slate-800 rounded-xl mb-6" />
          <div className="flex justify-center">
            <div className="h-12 w-48 bg-purple-500/30 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/30 rounded-xl p-6 text-center animate-pulse">
              <div className="h-10 w-20 bg-slate-800 rounded mx-auto mb-2" />
              <div className="h-4 w-24 bg-slate-800/50 rounded mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
