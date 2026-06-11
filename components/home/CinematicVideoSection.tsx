'use client';

/**
 * CINEMATIC VIDEO SECTION
 * Gives the EmersonEIMS services film a dedicated stage on ALL devices
 * (the hero video is gated to tablet+ for data reasons). Click-to-play
 * with a graded poster, so the 18 MB file never loads until requested.
 */

import { useRef, useState } from 'react';
import Image from 'next/image';

export default function CinematicVideoSection() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = () => {
    setPlaying(true);
    // play() after state flip; the element is already mounted
    requestAnimationFrame(() => videoRef.current?.play().catch(() => {}));
  };

  return (
    <section
      className="py-16 sm:py-24 bg-gradient-to-b from-black via-slate-900/60 to-black content-auto"
      aria-label="Watch EmersonEIMS in action"
    >
      <div className="max-w-content mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs sm:text-sm text-amber-400 tracking-[0.25em] uppercase font-semibold">
          See It With Your Own Eyes
        </span>
        <h2 className="mt-4 text-3xl sm:text-5xl font-bold text-white leading-tight">
          Watch: Generators, Solar & Engineering{' '}
          <span className="text-amber-500">In Action</span>
        </h2>
        <p className="mt-4 text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
          Deliveries, installations and commissioning — filmed on our real
          project sites across Kenya.
        </p>
      </div>

      <div className="max-w-full-content mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.8)] aspect-video bg-black">
          {playing ? (
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              playsInline
              preload="auto"
              poster="/images/voltka/voltka-vks44-dispatch-crane.webp"
            >
              <source src="/videos/FOR%20TRIALS%20IN%20KADENCE.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <button
              onClick={start}
              className="group absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Play the EmersonEIMS services video"
            >
              <Image
                src="/images/voltka/voltka-vks44-dispatch-crane.webp"
                alt="VOLTKA Cummins generator dispatch — play video"
                fill
                sizes="(min-width: 1536px) 1400px, 100vw"
                quality={88}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-black/35 group-hover:bg-black/25 transition-colors" />
              {/* Play button */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="relative flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28">
                  <span className="absolute inset-0 rounded-full bg-amber-500/30 animate-ping" />
                  <span className="relative flex items-center justify-center w-16 h-16 sm:w-22 sm:h-22 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-2xl shadow-amber-500/40 group-hover:scale-110 transition-transform">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 sm:w-9 sm:h-9 fill-black translate-x-0.5" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="absolute bottom-5 left-0 right-0 text-center text-white font-semibold text-sm sm:text-base tracking-wide">
                ▶ Watch our work — 28 seconds
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
