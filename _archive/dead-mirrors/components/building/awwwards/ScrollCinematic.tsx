'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

/**
 * 🎬 CINEMATIC SCROLL STORY - AWWWARDS SOTD WORTHY
 *
 * Revolutionary scroll-jacking experience inspired by Apple product launches
 * Features:
 * - Scroll-driven text animations
 * - Image sequences that play on scroll
 * - Parallax layers with different speeds
 * - Sticky sections with morphing content
 * - Premium typography animations
 *
 * This component tells the EmersonEIMS story through immersive scrolling
 */

interface Story {
  title: string;
  subtitle: string;
  description: string;
  stat?: string;
  statLabel?: string;
  image: string;
  gradient: string;
}

const stories: Story[] = [
  {
    title: "POWER",
    subtitle: "When Hospitals Can't Fail",
    description: "500+ critical installations across East Africa. From ICUs to data centers, our generators power what matters most.",
    stat: "99.9%",
    statLabel: "Uptime Guarantee",
    image: "/images/tnpl-diesal-generator-1000x1000-1920x1080.webp",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "SOLAR",
    subtitle: "The Sun Never Sends a Bill",
    description: "Harnessing Kenya's 5.5-5.9 kWh/m²/day solar potential. Tier-1 panels engineered for equatorial intensity.",
    stat: "30%",
    statLabel: "Average Savings",
    image: "/images/solar power farms.png",
    gradient: "from-yellow-500/20 to-amber-500/20",
  },
  {
    title: "SMART",
    subtitle: "Intelligence at the Edge",
    description: "AI-powered predictive maintenance. Real-time monitoring. Remote diagnostics. Your power infrastructure, reimagined.",
    stat: "24/7",
    statLabel: "Active Monitoring",
    image: "/images/solar changeover control.png",
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
];

export default function ScrollCinematic() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className="relative bg-black">
      {/* Opening Statement - Sticky */}
      <section className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black/90" />

        <motion.div
          className="relative z-10 text-center px-6"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0]),
            scale: useTransform(scrollYProgress, [0, 0.1, 0.2], [1, 1, 0.8]),
          }}
        >
          <motion.h2
            className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-8"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="block bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text text-transparent">
              12 YEARS
            </span>
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-400 mt-4">
              OF ENGINEERING EXCELLENCE
            </span>
          </motion.h2>

          <motion.p
            className="text-xl sm:text-2xl text-gray-500 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Scroll to explore our story
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
              <motion.div
                className="w-1.5 h-3 bg-amber-400 rounded-full"
                animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Story Sections - Each one takes full viewport */}
      {stories.map((story, index) => (
        <StorySection
          key={index}
          story={story}
          index={index}
          totalStories={stories.length}
          scrollProgress={scrollYProgress}
        />
      ))}

      {/* Closing Statement */}
      <section className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black" />

        <motion.div
          className="relative z-10 text-center px-6"
          style={{
            opacity: useTransform(scrollYProgress, [0.85, 0.9, 1], [0, 1, 1]),
            scale: useTransform(scrollYProgress, [0.85, 0.9], [0.8, 1]),
          }}
        >
          <motion.h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8"
          >
            <span className="block text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text">
              YOUR POWER.
            </span>
            <span className="block text-white mt-2">
              OUR MISSION.
            </span>
          </motion.h2>

          <motion.p
            className="text-2xl sm:text-3xl text-gray-400 max-w-4xl mx-auto mb-12"
          >
            Let's build something extraordinary together
          </motion.p>

          {/* Premium CTA */}
          <motion.a
            href="/contact"
            className="inline-block px-12 py-6 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xl rounded-full hover:scale-105 transition-transform"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Your Project →
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}

// Individual Story Section Component
function StorySection({
  story,
  index,
  totalStories,
  scrollProgress
}: {
  story: Story;
  index: number;
  totalStories: number;
  scrollProgress: any;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Calculate section-specific progress (0 to 1 for this section)
  const sectionStart = (index + 1) / (totalStories + 2); // +2 for intro and outro
  const sectionEnd = (index + 2) / (totalStories + 2);

  const opacity = useTransform(
    scrollProgress,
    [sectionStart - 0.1, sectionStart, sectionEnd, sectionEnd + 0.1],
    [0, 1, 1, 0]
  );

  const scale = useTransform(
    scrollProgress,
    [sectionStart - 0.05, sectionStart, sectionEnd, sectionEnd + 0.05],
    [0.8, 1, 1, 1.1]
  );

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section
      ref={sectionRef}
      className="sticky top-0 h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          scale: imageScale,
          y: imageY,
        }}
      >
        <Image
          src={story.image}
          alt={story.title}
          fill
          className="object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${story.gradient}`} />
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 text-center"
        style={{ opacity, scale }}
      >
        {/* Title */}
        <motion.h3
          className="text-7xl sm:text-8xl md:text-9xl lg:text-[12rem] font-bold mb-6 leading-none"
          style={{
            textShadow: '0 0 80px rgba(0,0,0,0.5)',
          }}
        >
          <span className="text-transparent bg-gradient-to-r from-white via-amber-200 to-white bg-clip-text">
            {story.title}
          </span>
        </motion.h3>

        {/* Subtitle */}
        <motion.p
          className="text-3xl sm:text-4xl md:text-5xl font-light text-white mb-8"
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.7)',
          }}
        >
          {story.subtitle}
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-xl sm:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed"
          style={{
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          {story.description}
        </motion.p>

        {/* Stat */}
        {story.stat && (
          <motion.div
            className="inline-block px-8 py-4 rounded-2xl bg-black/50 backdrop-blur-xl border border-white/20"
          >
            <div className="text-5xl sm:text-6xl font-bold text-amber-400 mb-2">
              {story.stat}
            </div>
            <div className="text-sm sm:text-base text-gray-300 uppercase tracking-wider">
              {story.statLabel}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Section indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalStories }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === index
                ? 'w-12 bg-amber-500'
                : 'w-6 bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
