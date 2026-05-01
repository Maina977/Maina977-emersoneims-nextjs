'use client';

import type { ReactNode } from 'react';

/**
 * Fixed nav (~64–80px) is global; this shell adds padding so tool UIs are not covered.
 * content-visibility improves paint on long dashboards (supported browsers).
 */
export function ToolAppShell({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div
      className="w-full min-h-[100dvh] pt-[4.5rem] sm:pt-20 [content-visibility:auto]"
      data-emerson-tool={label ?? 'app'}
    >
      {children}
    </div>
  );
}

export function ToolLoadingState({ name }: { name: string }) {
  return (
    <div
      className="min-h-[100dvh] pt-[4.5rem] sm:pt-20 flex items-center justify-center bg-gradient-to-b from-slate-950 to-black"
      role="status"
      aria-live="polite"
    >
      <div className="text-center px-4">
        <div className="w-16 h-16 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-300 text-sm sm:text-base font-medium">{name}</p>
        <p className="text-slate-500 text-xs mt-1">Preparing full workspace (downloaded on demand)…</p>
      </div>
    </div>
  );
}
