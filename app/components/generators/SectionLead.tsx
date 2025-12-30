'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Lazy load WebGL background
const SimpleThreeScene = dynamic(
  () => import('@/components/webgl/SimpleThreeScene'),
  { ssr: false }
);

interface SectionLeadProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  showWebGL?: boolean;
}

/**
 * SectionLead - Awwwards SOTD Premium section header component
 * Used for generators, solutions, and other major sections
 * Enhanced with GSAP, WebGL, and premium animations
 */
export default function SectionLead({ 
  title, 
  subtitle, 
  centered = false,
  showWebGL = true 
}: SectionLeadProps) {
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.3]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0, -50]);

  // GSAP animations
  useEffect(() => {
    if (!titleRef.current) return;

    const ctx = gsap.context(() => {
      // Split text animation
      const chars = titleRef.current?.textContent?.split('') || [];
      if (titleRef.current) {
        titleRef.current.innerHTML = '';
        chars.forEach((char) => {
          const span = document.createElement('span');
          span.textContent = char === ' ' ? '\u00A0' : char;
          span.style.display = 'inline-block';
          titleRef.current?.appendChild(span);
        });

        gsap.fromTo(
          titleRef.current.children,
          {
            opacity: 0,
            y: 50,
            rotationX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.02,
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [title]);

  return (
    <motion.section
      ref={containerRef}
      className={`relative py-20 md:py-32 px-4 overflow-hidden ${centered ? 'text-center' : ''}`}
      style={{ opacity, scale, y }}
    >
      {/* WebGL Background */}
      {showWebGL && (
        <div className="absolute inset-0 -z-10 opacity-20">
          <Suspense fallback={null}>
            <SimpleThreeScene />
          </Suspense>
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black -z-10" />

      {/* Holographic Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Animated Particles - Client side only */}
      {typeof window !== 'undefined' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h1
          ref={titleRef}
          className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            className="text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl leading-relaxed"
            style={{
              marginLeft: centered ? 'auto' : '0',
              marginRight: centered ? 'auto' : '0',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Decorative Line */}
        <motion.div
          className={`mt-8 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent ${centered ? 'mx-auto' : ''}`}
          style={{ width: centered ? '200px' : '100px' }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
        />
      </div>
    </motion.section>
  );
}















