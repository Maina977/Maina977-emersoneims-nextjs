export default function SolarGeniusProLoading() {
  return (
    <div
      className="min-h-[100dvh] pt-[4.5rem] sm:pt-20 flex items-center justify-center bg-gradient-to-b from-slate-950 to-black"
      role="status"
      aria-live="polite"
    >
      <div className="text-center px-4">
        <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 text-sm sm:text-base font-medium">Solar Genius Pro</p>
        <p className="text-slate-500 text-xs mt-1">Preparing full workspace (downloaded on demand)…</p>
      </div>
    </div>
  );
}
