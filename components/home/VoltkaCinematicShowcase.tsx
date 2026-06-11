'use client';

/**
 * VOLTKA CUMMINS CINEMATIC SHOWCASE
 * Premium Ken Burns slideshow of real VOLTKA Cummins deliveries,
 * changeover switchgear and genuine engine detail — graded 2.5K WebP.
 * Additive section: sits directly under the hero to put the flagship
 * product (Cummins generators) in front of buyers immediately.
 */

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const SLIDES = [
  {
    src: '/images/voltka/voltka-vks44-dispatch-crane.webp',
    alt: 'VOLTKA Cummins VKS 44 super silent generator crane-loaded for delivery at EmersonEIMS Nairobi warehouse',
    tag: 'DISPATCH DAY',
    title: 'Brand New VOLTKA Cummins, Crane-Loaded & On Its Way',
    copy: 'Every unit leaves our Nairobi warehouse tested, fueled and ready to take load.',
  },
  {
    src: '/images/voltka/voltka-vks44-night-delivery.webp',
    alt: 'VOLTKA Cummins VKS 44 generator delivered at night in Kenya',
    tag: 'DELIVERED ON TIME',
    title: 'Night Delivery — Powered Before the Morning Shift',
    copy: 'When a client needs power by morning, our crews deliver and commission overnight.',
  },
  {
    src: '/images/voltka/voltka-vks40-studio.webp',
    alt: 'VOLTKA VKS 40 Cummins super silent diesel generator studio shot',
    tag: 'SUPER SILENT RANGE',
    title: 'VOLTKA VKS Series — 10kVA to 2000kVA',
    copy: 'Genuine Cummins engines in super silent canopies. 3-year warranty, 1 year free service.',
  },
  {
    src: '/images/voltka/cummins-engine-detail.webp',
    alt: 'Genuine Cummins diesel engine with Fleetguard filtration inside a VOLTKA canopy',
    tag: 'GENUINE CUMMINS INSIDE',
    title: 'Open the Canopy — Verify the Engine Yourself',
    copy: 'Genuine Cummins blocks with Fleetguard filtration. We show you before you buy.',
  },
  {
    src: '/images/voltka/ats-changeover-panel-4k.webp',
    alt: 'Automatic transfer switch changeover panel commissioned and running on load, 401V across three phases',
    tag: 'ATS & CHANGEOVERS',
    title: 'Commissioned, On Load, 401V Across All Three Phases',
    copy: 'We wire the ATS, test the changeover and hand over a running system — not boxes.',
  },
  {
    src: '/images/voltka/kivukoni-cummins-install.webp',
    alt: 'Cummins generator installed at Kivukoni School',
    tag: 'REAL INSTALLATIONS',
    title: 'Trusted by Schools, Hospitals, Factories & Farms',
    copy: 'From Kivukoni School to industrial plants — documented installs in all 47 counties.',
  },
];

const SLIDE_MS = 5500;

export default function VoltkaCinematicShowcase() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, SLIDE_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  const slide = SLIDES[index];

  return (
    <section
      className="relative bg-black content-auto overflow-hidden"
      aria-label="VOLTKA Cummins generators cinematic showcase"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Section heading */}
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-sm">
          <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
          <span className="text-xs sm:text-sm text-amber-300 tracking-wider uppercase font-medium">
            Authorized Cummins · Powered by VOLTKA
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
          The Generators That{' '}
          <span className="text-amber-500">Keep Kenya Running</span>
        </h2>
        <p className="mt-4 text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Real deliveries. Real installations. Real changeover panels on load —
          shot on our own sites, not stock photos.
        </p>
      </div>

      {/* Cinematic stage */}
      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-14 pb-16 sm:pb-20">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)]">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={slide.src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1 }}
                animate={{
                  opacity: 1,
                  scale: 1.08,
                  transition: {
                    opacity: { duration: 0.9 },
                    scale: { duration: SLIDE_MS / 1000 + 1.5, ease: 'linear' },
                  },
                }}
                exit={{ opacity: 0, transition: { duration: 0.9 } }}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(min-width: 1536px) 1400px, 100vw"
                  quality={90}
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Cinematic grading */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/30 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(251,191,36,0.12),transparent_55%)] pointer-events-none" />

            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-10">
              <motion.div
                key={slide.title}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
              >
                <span className="inline-block mb-3 px-3 py-1 rounded-full bg-amber-500 text-black text-[10px] sm:text-xs font-bold tracking-[0.18em]">
                  {slide.tag}
                </span>
                <h3 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white max-w-3xl leading-tight">
                  {slide.title}
                </h3>
                <p className="mt-2 text-sm sm:text-lg text-gray-300 max-w-2xl">
                  {slide.copy}
                </p>
              </motion.div>
            </div>

            {/* Progress dots */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex gap-2">
              {SLIDES.map((s, i) => (
                <button
                  key={s.src}
                  onClick={() => setIndex(i)}
                  aria-label={`Show slide ${i + 1}: ${s.tag}`}
                  aria-current={i === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-8 bg-amber-400' : 'w-3 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CTAs under the stage */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <a
            href="https://wa.me/254768860665?text=Hi%20EmersonEIMS%2C%20I%20want%20today%27s%20best%20offer%20on%20a%20VOLTKA%20Cummins%20generator"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-center tap-scale touch-target"
          >
            Get Today&apos;s Generator Offer
          </a>
          <Link
            href="/generators"
            className="w-full sm:w-auto px-6 sm:px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 text-center tap-scale touch-target"
          >
            Explore All Models →
          </Link>
        </div>
      </div>
    </section>
  );
}
