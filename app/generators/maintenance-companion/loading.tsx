// INSTANT SKELETON - Maintenance Hub loads instantly
export default function MaintenanceHubLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950/20 to-slate-950">
      {/* Header Skeleton */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="h-8 w-48 bg-cyan-500/20 rounded-full mx-auto mb-6 animate-pulse" />
          <div className="h-12 w-96 max-w-full bg-gray-800 rounded-lg mx-auto mb-4 animate-pulse" />
          <div className="h-6 w-[500px] max-w-full bg-gray-800/50 rounded-lg mx-auto animate-pulse" />
        </div>
      </div>

      {/* Tools Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 animate-pulse">
              <div className="h-12 w-12 bg-slate-800 rounded-xl mb-4" />
              <div className="h-6 bg-slate-800 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-800/50 rounded w-full mb-1" />
              <div className="h-4 bg-slate-800/50 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
