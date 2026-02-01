// INSTANT SKELETON - Diagnostics page loads instantly
export default function DiagnosticsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-black">
      {/* Hero */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-12 w-64 bg-cyan-500/20 rounded-lg mx-auto mb-6 animate-pulse" />
          <div className="h-8 w-96 max-w-full bg-gray-800/50 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      {/* Dashboard Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 rounded-xl p-6 animate-pulse">
              <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-800/50 rounded" />
            </div>
          ))}
        </div>

        {/* Main Panel Skeleton */}
        <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-8 animate-pulse">
          <div className="h-64 bg-slate-800/30 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
