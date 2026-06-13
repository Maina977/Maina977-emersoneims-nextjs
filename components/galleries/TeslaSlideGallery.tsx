'use client';

/**
 * TeslaSlideGallery — full-bleed cinematic slide deck (tesla.com style)
 *
 * Big edge-to-edge product photography that auto-advances with a slow
 * Ken-Burns push, a clean centered caption, minimal progress ticks and
 * prev/next affordances. No WebGL — pure CSS/GSAP-free transitions kept
 * deterministic so it never causes a hydration mismatch (initial slide
 * index is always 0 on server + client).
 *
 * Auto-plays, pauses on hover/touch, respects reduced motion.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export interface TeslaSlide {
  src: string;
  title: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

interface TeslaSlideGalleryProps {
  slides: TeslaSlide[];
  eyebrow?: string;
  intervalMs?: number;
  height?: string;
}

export default function TeslaSlideGallery({
  slides,
  eyebrow,
  intervalMs = 4000,
  height = 'h-[88svh] min-h-[560px]',
}: TeslaSlideGalleryProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (paused || prefersReducedMotion || slides.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), intervalMs);
    return () => clearInterval(t);
  }, [paused, prefersReducedMotion, slides.length, intervalMs]);

  const active = slides[index];

  return (
    <section
      className={`relative w-full ${height} overflow-hidden bg-black content-auto`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; setPaused(true); }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
        }
        touchX.current = null;
        setPaused(false);
      }}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-[1100ms] ease-out ${i === index ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden={i !== index}
        >
          <div className={`absolute inset-0 ${i === index && !prefersReducedMotion ? 'tesla-kenburns' : ''}`}>
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/40" />
        </div>
      ))}

      {/* Caption — Tesla-style centered top */}
      <div className="absolute inset-x-0 top-0 pt-16 md:pt-20 px-4 text-center z-10">
        {eyebrow && <p className="text-[11px] md:text-xs tracking-[0.4em] uppercase text-amber-400/90 mb-3">{eyebrow}</p>}
        <div key={index} className="tesla-cap">
          <h2 className="text-3xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">{active?.title}</h2>
          {active?.subtitle && <p className="mt-3 text-base md:text-xl text-gray-200 max-w-2xl mx-auto">{active.subtitle}</p>}
        </div>
        {active?.ctaHref && (
          <Link
            href={active.ctaHref}
            className="mt-7 inline-block px-9 py-3.5 bg-white text-black font-semibold rounded-full hover:bg-amber-300 transition-colors"
          >
            {active.ctaLabel || 'Learn More'}
          </Link>
        )}
      </div>

      {/* Prev / Next */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 border border-white/20 text-white backdrop-blur-sm flex items-center justify-center transition-colors"
          >
            ›
          </button>
        </>
      )}

      {/* Progress ticks */}
      <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-amber-400' : 'w-4 bg-white/30 hover:bg-white/60'}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes teslaKenBurns { from { transform: scale(1.0); } to { transform: scale(1.12); } }
        .tesla-kenburns { animation: teslaKenBurns 6s ease-out forwards; }
        @keyframes teslaCap { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .tesla-cap { animation: teslaCap 0.7s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>
    </section>
  );
}
