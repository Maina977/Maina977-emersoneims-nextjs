'use client';

/**
 * SwooshGallery — cinematic project-photo "swoosh" into the net (homepage)
 *
 * The PHOTO ITSELF is the projectile (no cartoon ball): a project image flies
 * in from the lower-left as a small card, travelling along a true Bézier arc
 * (CSS Motion Path) like a real basketball shot, with a warm comet streak
 * behind it. As it reaches the rim it drops through the net (net ripples) and
 * OPENS to full size, hanging in the net until the next photo is thrown.
 *
 * Robust: pure CSS @keyframes + offset-path (no framer-motion → no hydration
 * mismatch from animation libs), direct /images/* paths, bounded <section>,
 * reduced-motion grid fallback, image #0 shown from first paint.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface SwooshGalleryItem {
  src: string;
  title: string;
  subtitle?: string;
}

interface SwooshGalleryProps {
  items: SwooshGalleryItem[];
  eyebrow?: string;
  heading?: string;
}

// ── Tuning knobs ─────────────────────────────────────────────────────────
const FLY_MS = 1500;    // throw → through-net → opened
const HOLD_MS = 2900;   // how long the opened image is shown
const FRAME_W = 560;    // opened image width
const FRAME_H = 340;    // opened image height
const STAGE_H = 660;    // stage height
const IMG_TOP = 196;    // opened image top within the stage (px)

// Smooth basketball arc as a cubic Bézier, in the flying card's local space
// (origin = top-left of the FRAME-sized rail; end = frame centre).
const END_X = FRAME_W / 2;
const END_Y = FRAME_H / 2;
const ARC_PATH = `path('M ${END_X - 540} ${END_Y + 560} C ${END_X - 360} ${END_Y - 470}, ${END_X + 430} ${END_Y - 360}, ${END_X} ${END_Y}')`;

export default function SwooshGallery({
  items,
  eyebrow = 'Proof in the Field — From Our Gallery',
  heading = 'Every Project, Nothing But Net.',
}: SwooshGalleryProps) {
  const [settledIndex, setSettledIndex] = useState<number | null>(0);
  const [flyingIndex, setFlyingIndex] = useState<number | null>(null);
  const [throwId, setThrowId] = useState(0);
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const nextRef = useRef(0);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setMounted(true), []);

  const throwNext = useCallback(() => {
    if (items.length === 0) return;
    nextRef.current = (nextRef.current + 1) % items.length;
    setFlyingIndex(nextRef.current);
    setThrowId((id) => id + 1);
  }, [items.length]);

  useEffect(() => {
    if (!mounted || prefersReducedMotion || items.length === 0) return;
    holdTimer.current = setTimeout(throwNext, 1700);
    return () => { if (holdTimer.current) clearTimeout(holdTimer.current); };
  }, [mounted, prefersReducedMotion, items.length, throwNext]);

  const handleFlyEnd = () => {
    if (prefersReducedMotion || items.length === 0) return;
    setSettledIndex(nextRef.current);
    setFlyingIndex(null);
    holdTimer.current = setTimeout(throwNext, HOLD_MS);
  };

  // ── Static fallback (SSR / pre-mount / reduced motion) ──────────────────
  if (!mounted || prefersReducedMotion || items.length === 0) {
    return (
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs tracking-[0.35em] uppercase text-amber-400/80 text-center mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-12">{heading}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.slice(0, 8).map((item) => (
              <figure key={item.src} className="relative aspect-[3/2] overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.src} alt={item.title} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-3 text-xs text-white">{item.title}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/gallery" className="inline-block px-8 py-4 border border-amber-400/60 text-amber-300 font-bold rounded-full hover:bg-amber-400/10 transition-all">View Full Project Gallery →</Link>
          </div>
        </div>
      </section>
    );
  }

  const settled = settledIndex != null ? items[settledIndex] : null;
  const flying = flyingIndex != null ? items[flyingIndex] : null;
  const focusIndex = flyingIndex ?? settledIndex ?? 0;
  const focus = items[focusIndex];
  const HOOP_W = FRAME_W + 70;

  return (
    <section className="relative bg-black overflow-hidden content-auto" aria-label={heading}>
      <div className="relative z-10 pt-14 md:pt-16 pb-2 text-center px-4">
        <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-amber-400/90 mb-3">{eyebrow}</p>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{heading}</h2>
      </div>

      <div className="relative mx-auto" style={{ height: STAGE_H, maxWidth: 980 }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(251,191,36,0.10),transparent_56%)]" />

        {/* Opened image at rest — hangs in the net until replaced */}
        {settled && (
          <div className="absolute z-[4] overflow-hidden rounded-[20px] border border-amber-300/25 shadow-[0_36px_90px_rgba(0,0,0,0.72)]"
            style={{ left: '50%', top: IMG_TOP, width: FRAME_W, height: FRAME_H, transform: 'translateX(-50%)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={settled.src} alt={settled.title} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
          </div>
        )}

        {/* Flying photo + comet — local rail anchored at the rest spot */}
        {flying && (
          <div className="absolute z-[6]" style={{ left: '50%', top: IMG_TOP, width: FRAME_W, height: FRAME_H, transform: 'translateX(-50%)' }}>
            {/* comet streak (aligned to the path tangent) */}
            <div key={`streak-${throwId}`} className="swoosh-streak" aria-hidden="true" />
            {/* the photo itself is the ball */}
            <div key={`fly-${throwId}`} onAnimationEnd={handleFlyEnd}
              className="swoosh-fly absolute inset-0 overflow-hidden rounded-[20px] border border-amber-300/40 shadow-[0_30px_70px_rgba(0,0,0,0.7)] ring-1 ring-white/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={flying.src} alt={flying.title} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-white/10" />
            </div>
          </div>
        )}

        {/* Flash as the photo swooshes through */}
        {flying && <div key={`flash-${throwId}`} className="swoosh-flash absolute z-[5]" style={{ left: '50%', top: IMG_TOP - 4 }} aria-hidden="true" />}

        {/* Rim + draped net, centred in front of the photo's top edge */}
        <div key={`hoop-${throwId}`} className="pointer-events-none absolute left-1/2 -translate-x-1/2 z-[8]" style={{ top: IMG_TOP - 150, width: HOOP_W }}>
          <svg width={HOOP_W} height="190" viewBox={`0 0 ${HOOP_W} 190`} fill="none" className="mx-auto overflow-visible">
            <defs>
              <linearGradient id="swrim2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#fdba74" /><stop offset="0.5" stopColor="#f97316" /><stop offset="1" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            {(() => {
              const cx = HOOP_W / 2, rimRx = FRAME_W / 2 + 12, rimCy = 138, netH = 86, strands = 15;
              const els: React.ReactElement[] = [];
              for (let i = 0; i <= strands; i++) {
                const f = i / strands;
                const xTop = cx - rimRx + f * (rimRx * 2);
                const xBot = cx - rimRx * 0.58 + f * (rimRx * 1.16);
                els.push(<path key={`s${i}`} d={`M ${xTop} ${rimCy} Q ${(xTop + xBot) / 2} ${rimCy + netH * 0.55} ${xBot} ${rimCy + netH}`} stroke="rgba(255,255,255,0.42)" strokeWidth="1.05" fill="none" />);
              }
              for (let r = 1; r <= 3; r++) {
                const y = rimCy + (netH * r) / 4, halfW = rimRx * (1 - 0.15 * r);
                els.push(<path key={`r${r}`} d={`M ${cx - halfW} ${y} Q ${cx} ${y + 13} ${cx + halfW} ${y}`} stroke="rgba(255,255,255,0.30)" strokeWidth="0.9" fill="none" />);
              }
              return (
                <>
                  <rect x={cx - 150} y="6" width="300" height="118" rx="10" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
                  <rect x={cx - 52} y="44" width="104" height="64" rx="4" stroke="rgba(251,191,36,0.55)" strokeWidth="2.5" fill="none" />
                  <g className="swoosh-net">{els}</g>
                  <ellipse cx={cx} cy={rimCy} rx={rimRx} ry="16" stroke="rgba(249,115,22,0.32)" strokeWidth="15" className="swoosh-rim-glow" />
                  <ellipse cx={cx} cy={rimCy} rx={rimRx} ry="16" stroke="url(#swrim2)" strokeWidth="8" />
                  <ellipse cx={cx} cy={rimCy} rx={rimRx} ry="16" stroke="rgba(255,255,255,0.28)" strokeWidth="1.6" />
                </>
              );
            })()}
          </svg>
        </div>

        {/* Caption + dots */}
        <div className="absolute inset-x-0 z-[9] text-center px-4" style={{ top: IMG_TOP + FRAME_H + 28 }}>
          <div key={`cap-${throwId}`} className="swoosh-caption-in">
            <p className="text-lg md:text-2xl font-semibold text-white">{focus.title}</p>
            {focus.subtitle && <p className="text-sm md:text-base text-amber-300/90 mt-1 tracking-wide">{focus.subtitle}</p>}
          </div>
          <div className="mt-5 flex items-center justify-center gap-1.5">
            {items.map((_, i) => (
              <span key={i} className={`h-1 rounded-full transition-all duration-500 ${i === focusIndex ? 'w-7 bg-amber-400' : 'w-1.5 bg-white/25'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 pb-16 text-center px-4">
        <Link href="/gallery" className="inline-block px-7 py-3 border border-amber-400/60 text-amber-300 text-sm font-bold rounded-full hover:bg-amber-400/10 transition-all">View Full Project Gallery →</Link>
      </div>

      <style>{`
        /* The photo flies along a real Bézier arc (offset-path), staying upright,
           growing from a small card to the full opened image as it enters the net. */
        .swoosh-fly {
          offset-path: ${ARC_PATH};
          offset-rotate: 0deg;
          transform-origin: center center;
          will-change: offset-distance, transform, opacity;
          animation: swooshFly ${FLY_MS}ms cubic-bezier(0.33, 0.04, 0.28, 1) forwards;
        }
        @keyframes swooshFly {
          0%   { offset-distance: 0%;   transform: scale(0.16); opacity: 0; }
          10%  { opacity: 1; }
          66%  { offset-distance: 80%;  transform: scale(0.34); opacity: 1; }
          84%  { offset-distance: 96%;  transform: scale(0.6); }
          100% { offset-distance: 100%; transform: scale(1); opacity: 1; }
        }

        /* Comet streak rides the same arc, elongated along the tangent, and
           fades out before the photo opens. */
        .swoosh-streak {
          position: absolute; top: 0; left: 0; width: 230px; height: 30px;
          margin: -15px 0 0 -115px; border-radius: 50%;
          background: linear-gradient(to right, rgba(251,191,36,0) 0%, rgba(249,115,22,0.7) 45%, rgba(255,180,90,0.95) 80%, rgba(255,250,240,1) 100%);
          filter: blur(9px); mix-blend-mode: screen;
          offset-path: ${ARC_PATH}; offset-rotate: auto;
          animation: swooshStreak ${FLY_MS}ms cubic-bezier(0.33, 0.04, 0.28, 1) forwards;
        }
        @keyframes swooshStreak {
          0%   { offset-distance: 2%;  opacity: 0; }
          14%  { opacity: .95; }
          60%  { offset-distance: 74%; opacity: .85; }
          78%  { offset-distance: 90%; opacity: 0; }
          100% { opacity: 0; }
        }

        .swoosh-flash {
          width: 240px; height: 240px; margin-left:-120px; border-radius:50%;
          background: radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,196,120,0.7) 28%, rgba(249,115,22,0.25) 50%, transparent 70%);
          opacity:0; animation: swooshFlash ${FLY_MS}ms ease-out both;
        }
        @keyframes swooshFlash {
          0%,72% { opacity:0; transform: scale(0.2); }
          82%    { opacity:.9; transform: scale(1); }
          92%    { opacity:0; transform: scale(1.6); }
          100%   { opacity:0; }
        }

        .swoosh-net { transform-origin: top center; animation: swooshNet ${FLY_MS}ms ease-out both; }
        @keyframes swooshNet {
          0%,74% { transform: scaleY(1); }
          84%    { transform: scaleY(1.3); }
          94%    { transform: scaleY(0.95); }
          100%   { transform: scaleY(1); }
        }
        .swoosh-rim-glow { animation: swooshRimGlow 3s ease-in-out infinite; }
        @keyframes swooshRimGlow { 0%,100%{opacity:.3} 50%{opacity:.62} }

        @keyframes swooshCaptionIn { 0%,78%{opacity:0;transform:translateY(14px)} 100%{opacity:1;transform:translateY(0)} }
        .swoosh-caption-in { animation: swooshCaptionIn ${FLY_MS}ms ease-out both; }
      `}</style>
    </section>
  );
}
