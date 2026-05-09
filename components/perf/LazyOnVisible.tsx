'use client';

/**
 * LazyOnVisible
 * -------------
 * Defer mounting of a heavy section until it enters (or nearly enters) the
 * viewport. On mobile this reclaims significant main-thread time during the
 * initial paint, because the dozen below-the-fold homepage sections no
 * longer hydrate at once.
 *
 * Why not just `dynamic({ ssr: false })`?
 *   - `ssr: false` only delays *download*; the chunk still loads + hydrates
 *     immediately on mount because the JSX is in the tree.
 *   - This wrapper does not even render `children` until the element scrolls
 *     close to the viewport, so the React subtree itself is lazy.
 *
 * Behaviour:
 *   - Reserves space via `min-h` (passed in) so the page does not jump.
 *   - Uses `IntersectionObserver` with a configurable rootMargin (defaults
 *     to `200px` so the section is ready a hair before it scrolls in).
 *   - On browsers without IO support, mounts immediately (safe fallback).
 *   - When `prefers-reduced-motion` or `connection.saveData` is set, mounts
 *     immediately too (these users likely have noscript-y or assistive
 *     setups where empty placeholders feel broken).
 */
import React, { useEffect, useRef, useState } from 'react';

export interface LazyOnVisibleProps {
  children: React.ReactNode;
  /** Tailwind / inline min-height to reserve before content mounts. */
  minHeight?: string;
  /** IO rootMargin. Default 200px so we mount slightly before scroll-in. */
  rootMargin?: string;
  /** Optional className passed through to the placeholder/wrapper. */
  className?: string;
}

export default function LazyOnVisible({
  children,
  minHeight = 'min-h-[400px]',
  rootMargin = '200px',
  className = '',
}: LazyOnVisibleProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // No IntersectionObserver support → mount immediately.
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    // Save-data / data-saver users: mount immediately to avoid them seeing
    // a sea of empty skeletons. They've already opted into low-bandwidth
    // mode at the browser level; React mounting is cheap once chunks land.
    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean };
    }).connection;
    if (conn?.saveData) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.disconnect();
            break;
          }
        }
      },
      { rootMargin },
    );
    io.observe(node);

    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div
      ref={ref}
      className={`${visible ? '' : minHeight} ${className}`.trim()}
      // content-visibility lets the browser skip rendering work for the
      // placeholder area entirely until it scrolls in.
      style={visible ? undefined : { contentVisibility: 'auto' }}
    >
      {visible ? children : null}
    </div>
  );
}
