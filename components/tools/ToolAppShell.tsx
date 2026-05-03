'use client';

import type { ReactNode } from 'react';

/**
 * The global layout (app/layout.tsx) already pads main#main-content by
 * 64–72px to clear the fixed nav. We must NOT add another `pt-20` here or
 * tools render with a ~150px empty band at the top. Use a plain wrapper
 * sized to the remaining viewport.
 */
export function ToolAppShell({ children, label }: { children: ReactNode; label?: string }) {
  return (
    <div
      className="w-full min-h-[100dvh] [content-visibility:auto]"
      data-emerson-tool={label ?? 'app'}
    >
      {children}
    </div>
  );
}

export function ToolLoadingState({ name }: { name: string }) {
  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-b from-slate-950 to-black"
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
