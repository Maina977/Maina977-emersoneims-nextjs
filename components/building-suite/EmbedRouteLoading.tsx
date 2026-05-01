/**
 * Static shell shown while the embed chunk loads (no client JS required).
 * Keeps first paint light for /eims-pro and /pro-building-suite.
 */
export default function EmbedRouteLoading() {
  return (
    <div
      className="relative w-full min-h-[calc(100vh-4rem)] bg-slate-950"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading Building Suite workspace"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div
          className="h-10 w-10 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin"
          style={{ animationDuration: '0.75s' }}
        />
        <p className="mt-5 text-sm font-medium text-slate-300">Opening workspace…</p>
      </div>
    </div>
  );
}
