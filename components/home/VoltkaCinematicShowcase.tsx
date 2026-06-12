'use client';

/**
 * VOLTKA CUMMINS CINEMATIC SHOWCASE — Tesla-style full-bleed stage.
 * 7 shots from one 4080x3072 shoot, all exported at exactly 2560x1440
 * so every frame is identical in size, proportion and resolution.
 * All slides stay mounted and crossfade via opacity (no remount flash),
 * static frames (no zoom), headline top center, twin Tesla-proportion
 * pill CTAs, swipe / keyboard / chevron navigation.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const SLIDES = [
  {
    src: '/images/voltka/voltka-vks44-hero-profile.webp',
    alt: 'VOLTKA Cummins VKS 44 super silent generator side profile with VOLTKA branding at EmersonEIMS Nairobi warehouse',
    kicker: 'VOLTKA · POWERED BY CUMMINS',
    title: 'VKS Series',
    sub: 'Super silent. Genuine Cummins engine. 10–2000 kVA.',
  },
  {
    src: '/images/voltka/voltka-warehouse-fleet.webp',
    alt: 'Fleet of VOLTKA Cummins generators in stock at EmersonEIMS warehouse in Nairobi, Kenya',
    kicker: 'IN STOCK · NAIROBI',
    title: 'Every Size. On the Floor.',
    sub: 'VKS 44 to VKS 275 — ready for inspection today, not on order.',
  },
  {
    src: '/images/voltka/voltka-vks44-crane-dispatch-wide.webp',
    alt: 'VOLTKA Cummins VKS 44 generator crane-loaded onto a delivery truck at EmersonEIMS Nairobi warehouse',
    kicker: 'DISPATCH DAY',
    title: 'Delivered in 48 Hours',
    sub: 'Crane-loaded, fueled and tested before it leaves Nairobi.',
  },
  {
    src: '/images/voltka/voltka-vks165-stock-forklift.webp',
    alt: 'VOLTKA VKS 165 and VKS 188 generators in stock with forklift at EmersonEIMS warehouse',
    kicker: 'INDUSTRIAL RANGE',
    title: 'VKS 165 · VKS 188 · VKS 275',
    sub: 'Three-phase industrial sets with 3-year warranty, 1 year free service.',
  },
  {
    src: '/images/voltka/voltka-vks44-crane-lift.webp',
    alt: 'VOLTKA VKS 44 generator lifted by crane above a delivery truck, front angle showing VOLTKA branding',
    kicker: 'BUILT TO MOVE',
    title: 'From Our Floor to Your Site',
    sub: 'Rigging, transport and offloading handled by our own crew.',
  },
  {
    src: '/images/voltka/voltka-vks165-vks188-delivery.webp',
    alt: 'VOLTKA VKS 165 and VKS 188 generators staged for delivery beside the truck at EmersonEIMS',
    kicker: 'COMMISSIONED, NOT COURIERED',
    title: 'We Hand Over Running Systems',
    sub: 'ATS wired, changeover tested, on load — in all 47 counties.',
  },
  {
    src: '/images/voltka/voltka-vks44-crane-side.webp',
    alt: 'VOLTKA VKS 44 super silent generator lowered onto a delivery truck at EmersonEIMS Nairobi',
    kicker: 'ON ITS WAY',
    title: 'Yours Could Be Next',
    sub: 'Order today, on your site this week — anywhere in Kenya.',
  },
];

const SLIDE_MS = 6000;

export default function VoltkaCinematicShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => go(1), SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  };

  const slide = SLIDES[index];

  return (
    <section
      className="relative bg-black content-auto overflow-hidden h-[88svh] min-h-[560px] sm:h-screen"
      aria-label="VOLTKA Cummins generators showcase"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        if (touchX.current !== null) {
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
        }
        touchX.current = null;
        setPaused(false);
      }}
    >
      {/* Full-bleed stage — every slide stays mounted, pure opacity
          crossfade. No remount flash, no zoom: crisp, Tesla-static. */}
      {SLIDES.map((s, i) => (
        <div
          key={s.src}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={s.src}
            alt={s.alt}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Gentle grading — image stays bright, text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/55 pointer-events-none" />

      {/* Headline — top center, Tesla typography */}
      <div className="absolute top-0 left-0 right-0 pt-14 sm:pt-[8vh] px-4 text-center pointer-events-none">
        <motion.div
          key={slide.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.55, ease: 'easeOut' }}
        >
          <p className="text-[10px] sm:text-xs font-medium tracking-[0.3em] text-amber-300 uppercase mb-3">
            {slide.kicker}
          </p>
          <h2 className="text-[34px] sm:text-5xl lg:text-[54px] font-medium text-white tracking-tight leading-[1.08]">
            {slide.title}
          </h2>
          <p className="mt-2.5 text-sm sm:text-base text-white/85 font-light max-w-xl mx-auto">
            {slide.sub}
          </p>
        </motion.div>
      </div>

      {/* Twin CTAs — Tesla proportions: 264px, slim, 4px radius */}
      <div className="absolute bottom-16 sm:bottom-[7vh] left-0 right-0 px-6 flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center">
        <a
          href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20want%20today%27s%20best%20offer%20on%20a%20VOLTKA%20Cummins%20generator"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-[264px] py-2.5 rounded bg-white text-[#171a20] text-sm font-medium text-center hover:bg-white/90 transition-colors duration-200 tap-scale touch-target shadow-[0_2px_16px_rgba(0,0,0,0.3)]"
        >
          Get Today&apos;s Offer
        </a>
        <Link
          href="/generators"
          className="w-full sm:w-[264px] py-2.5 rounded bg-[#171a20]/70 text-white text-sm font-medium text-center backdrop-blur-sm hover:bg-[#171a20]/85 transition-colors duration-200 tap-scale touch-target"
        >
          Explore All Models
        </Link>
      </div>

      {/* Chevrons — desktop only */}
      <button
        onClick={() => go(-1)}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/25 text-white/75 backdrop-blur-sm hover:bg-black/50 hover:text-white transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button
        onClick={() => go(1)}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-black/25 text-white/75 backdrop-blur-sm hover:bg-black/50 hover:text-white transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
      </button>

      {/* Dots — bottom center, slim */}
      <div className="absolute bottom-6 sm:bottom-7 left-0 right-0 flex justify-center gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}: ${s.title}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
