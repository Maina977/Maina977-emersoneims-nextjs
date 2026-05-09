'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { SECTOR_LIST } from '@/lib/sectors/config';

// Lightweight, dependency-free Sectors dropdown for the main nav.
// • Desktop: click-triggered, keyboard accessible (Enter/Space/Esc)
// • Mobile : the host nav already shows this as a plain link → /solutions
//   (this component renders only on lg+ so we don't duplicate items)
// • Feature-flagged via NEXT_PUBLIC_ENABLE_SECTOR_SOLUTIONS
export default function SolutionsDropdown() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('mousedown', onClick);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousedown', onClick);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (process.env.NEXT_PUBLIC_ENABLE_SECTOR_SOLUTIONS !== 'true') return null;

  return (
    <div ref={wrapperRef} className="relative hidden lg:block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
          if (e.key === 'ArrowDown' && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={`relative px-3 xl:px-4 py-2 text-[11px] xl:text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap rounded-md ${
          open ? 'text-white' : 'text-white/75 hover:text-white'
        }`}
      >
        SECTORS
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-72 bg-gray-950 border border-amber-500/20 rounded-lg shadow-2xl shadow-black/60 py-2 z-[60]"
        >
          {SECTOR_LIST.map((s) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-white/85 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span className="font-semibold capitalize">
                {s.slug.replace('-', ' ')}
              </span>
              <span className="block text-[11px] text-white/50 mt-0.5 line-clamp-1">
                {s.painStatement}
              </span>
            </Link>
          ))}
          <div className="border-t border-white/10 mt-1 pt-1">
            <Link
              href="/solutions"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="block px-4 py-2 text-xs uppercase tracking-wider font-bold text-amber-400 hover:text-amber-300 hover:bg-white/5"
            >
              View All Sectors →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
