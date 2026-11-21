'use client';

/**
 * /solar tool tabs (Savings Calculator, Size My System, …).
 *
 * Early-click finding (production, 2026-11-21): a click on "Savings Calculator"
 * before the page had hydrated did nothing, because the tabs were <button>s
 * whose only behaviour was a React onClick. They are now native links
 * (href="#solar-tool-roi"): before hydration the browser records the choice in
 * the address, and on hydration useHashTab opens that tab. After hydration a
 * click opens the tab at once and updates the address without a scroll jump.
 * The address also keeps the open tab across a reload, so a recovery
 * "Reload page" returns to the same tool (its inputs are restored from
 * sessionStorage, lib/loading/sessionDraft.ts).
 */

import { useCallback, useEffect, useState, type MouseEvent } from 'react';

export const TAB_HASH_PREFIX = '#solar-tool-';

export interface SolarTab { id: string; label: string; icon: string; badge?: string }

function tabFromHash<T extends string>(hash: string, ids: readonly T[]): T | null {
  if (!hash.startsWith(TAB_HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(TAB_HASH_PREFIX.length)) as T;
  return ids.includes(id) ? id : null;
}

/** Active tab state that follows the address (#solar-tool-<id>), including a choice made before hydration. */
export function useHashTab<T extends string>(initial: T, ids: readonly T[]) {
  const [active, setActive] = useState<T>(initial);
  const idsKey = ids.join('|');
  useEffect(() => {
    const sync = () => { const t = tabFromHash(window.location.hash, ids); if (t) setActive(t); };
    sync(); // a tab clicked before hydration, or kept across a reload
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
    // ids are compared by value (idsKey)
  }, [idsKey]);
  const select = useCallback((id: T) => {
    setActive(id);
    try { window.history.replaceState(window.history.state, '', TAB_HASH_PREFIX + encodeURIComponent(id)); } catch { /* address not updated; the tab still opens */ }
  }, []);
  return [active, select] as const;
}

export default function SolarToolTabs<T extends string>({ tabs, active, onSelect }: { tabs: readonly (SolarTab & { id: T })[]; active: T; onSelect: (id: T) => void }) {
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto pb-2" role="tablist" aria-label="Solar tools">
      {tabs.map((tab) => (
        <a
          key={tab.id}
          href={TAB_HASH_PREFIX + tab.id}
          role="tab"
          aria-selected={active === tab.id}
          onClick={(e: MouseEvent<HTMLAnchorElement>) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return; // new tab/window: leave to the browser
            e.preventDefault();
            onSelect(tab.id);
          }}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all flex items-center gap-2 ${
            active === tab.id
              ? 'bg-amber-500 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {tab.icon} {tab.label}
          {tab.badge && (
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">{tab.badge}</span>
          )}
        </a>
      ))}
    </div>
  );
}
