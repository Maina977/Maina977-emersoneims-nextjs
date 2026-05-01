// MINIMAL GLOBAL LOADING — slim top progress bar only.
// Replaces the previous full-viewport "Loading..." overlay that
// briefly hid the SSR'd page content during streaming hand-off and
// made the site appear broken to users.
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] bg-cyan-500/20 overflow-hidden pointer-events-none"
    >
      <div className="h-full w-1/3 bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 animate-[loading-bar_1.2s_ease-in-out_infinite]" />
      <style>{`@keyframes loading-bar{0%{transform:translateX(-100%)}100%{transform:translateX(400%)}}`}</style>
    </div>
  );
}
