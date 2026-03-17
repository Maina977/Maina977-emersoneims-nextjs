/**
 * Service Detail Loading Skeleton
 * Shows instant feedback while service page loads
 */

export default function ServiceDetailLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section Skeleton */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="mb-8 flex gap-2">
            <div className="h-4 w-12 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-4 bg-slate-800 rounded animate-pulse" />
            <div className="h-4 w-24 bg-slate-800 rounded animate-pulse" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column Skeleton */}
            <div>
              {/* Badge */}
              <div className="h-8 w-32 bg-cyan-500/20 rounded-full mb-4 animate-pulse" />

              {/* Title */}
              <div className="h-12 w-full bg-slate-800 rounded-lg mb-4 animate-pulse" />
              <div className="h-12 w-3/4 bg-slate-800 rounded-lg mb-4 animate-pulse" />

              {/* Tagline */}
              <div className="h-6 w-2/3 bg-amber-500/20 rounded-lg mb-4 animate-pulse" />

              {/* Description */}
              <div className="space-y-2 mb-6">
                <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse" />
                <div className="h-4 w-full bg-slate-800/50 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-slate-800/50 rounded animate-pulse" />
              </div>

              {/* Benefits Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 w-32 bg-slate-800 rounded-lg animate-pulse" />
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <div className="h-12 w-40 bg-cyan-500/30 rounded-lg animate-pulse" />
                <div className="h-12 w-36 bg-green-500/30 rounded-lg animate-pulse" />
                <div className="h-12 w-32 bg-slate-700 rounded-lg animate-pulse" />
              </div>
            </div>

            {/* Right Column - Quote Box Skeleton */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <div className="h-8 w-48 bg-slate-700 rounded mb-4 animate-pulse" />

              {/* Price Box */}
              <div className="bg-slate-900/50 rounded-xl p-4 mb-6">
                <div className="h-4 w-20 bg-slate-700 rounded mb-2 animate-pulse" />
                <div className="h-8 w-48 bg-cyan-500/30 rounded mb-2 animate-pulse" />
                <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
              </div>

              {/* Contact Options */}
              <div className="space-y-3 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-slate-700/50 rounded-xl animate-pulse" />
                ))}
              </div>

              {/* Trust Signals */}
              <div className="space-y-2 pt-4 border-t border-slate-700">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-slate-700/50 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Skeleton */}
      <section className="py-6 px-4 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-6 w-6 bg-slate-700 rounded animate-pulse" />
                <div className="h-5 w-24 bg-slate-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Navigation Skeleton */}
      <section className="py-4 px-4 bg-slate-900/95 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-slate-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Content Section Skeleton */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-72 bg-slate-800 rounded-lg mb-8 animate-pulse" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                <div className="h-12 w-12 bg-slate-700 rounded-lg mb-4 animate-pulse" />
                <div className="h-6 w-3/4 bg-slate-700 rounded mb-2 animate-pulse" />
                <div className="h-4 w-full bg-slate-700/50 rounded mb-1 animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-700/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
