'use client';

import { useEffect, useRef, Suspense, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedImage from '@/components/media/OptimizedImage';
import OptimizedVideo from '@/components/media/OptimizedVideo';
import AnimatedImage from '@/components/effects/AnimatedImage';
import HolographicLaser from '@/components/effects/HolographicLaser';
import CTAButton from '@/components/shared/CTAButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const SimpleThreeScene = lazy(() => import('@/components/webgl/SimpleThreeScene'));

interface AwardWinningPageTemplateProps {
  title: string;
  subtitle?: string;
  paragraphs: string[]; // 5 paragraphs of verified content
  images?: Array<{
    src: string;
    alt: string;
    animationType?: 'pop' | 'shake' | 'rotate' | 'parallax' | '3d';
  }>;
  videos?: Array<{
    src: string;
    poster?: string;
  }>;
  heroImage?: string;
  heroVideo?: string;
  children?: React.ReactNode;
}

/**
 * Award-Winning Page Template
 * Includes: 3D images, popping/shaking/rotating images, parallax, videos, Three.js, GSAP, TailwindCSS
 */
export default function AwardWinningPageTemplate({
  title,
  subtitle,
  paragraphs,
  images = [],
  videos = [],
  heroImage,
  heroVideo,
  children,
}: AwardWinningPageTemplateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // GSAP ScrollTrigger animations
  useEffect(() => {
    if (!containerRef.current) return;

    const sections = containerRef.current.querySelectorAll('section');
    const textElements = containerRef.current.querySelectorAll('p, h2, h3');

    // Animate sections on scroll
    sections.forEach((section, index) => {
      gsap.fromTo(
        section,
        { opacity: 0, y: 100 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Stagger text animations
    textElements.forEach((el, index) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black text-white">
      {/* Holographic Laser Overlay */}
      <HolographicLaser intensity="high" color="#fbbf24" />
      
      {/* 3D Background Scene */}
      <Suspense fallback={null}>
        <div className="fixed inset-0 -z-10 opacity-20">
          <SimpleThreeScene />
        </div>
      </Suspense>

      {/* Hero Section */}
      <motion.section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        {heroVideo ? (
          <OptimizedVideo
            src={heroVideo}
            autoPlay={true}
            loop={true}
            muted={true}
            playsInline={true}
            className="absolute inset-0 w-full h-full object-cover"
            priority={true}
          />
        ) : heroImage ? (
          <AnimatedImage
            src={heroImage}
            alt={title}
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full"
            animationType="parallax"
            intensity="high"
          />
        ) : null}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        
        <motion.div
          className="relative z-20 text-center px-4 max-w-6xl mx-auto"
          style={{ y: parallaxY }}
        >
          <motion.h1
            className="text-6xl md:text-8xl font-display font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="text-xl md:text-2xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </motion.div>
      </motion.section>

      {/* Content Sections with 5 Paragraphs */}
      <section className="py-20 bg-black relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* First Paragraph with Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-[#fbbf24] font-display">
                {title} Excellence
              </h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {paragraphs[0]}
              </p>
            </motion.div>
            {images[0] && (
              <AnimatedImage
                src={images[0].src}
                alt={images[0].alt}
                width={800}
                height={600}
                animationType={images[0].animationType || 'pop'}
                intensity="high"
                className="rounded-2xl overflow-hidden"
              />
            )}
          </div>

          {/* Second Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto text-center">
              {paragraphs[1]}
            </p>
          </motion.div>

          {/* Third Paragraph with Video */}
          {videos[0] && (
            <div className="mb-16">
              <OptimizedVideo
                src={videos[0].src}
                poster={videos[0].poster}
                autoPlay={false}
                loop={true}
                muted={true}
                playsInline={true}
                className="w-full rounded-2xl overflow-hidden"
              />
            </div>
          )}

          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {paragraphs[2]}
            </p>
          </motion.div>

          {/* Image Gallery with Different Animations */}
          {images.length > 1 && (
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {images.slice(1, 4).map((img, index) => (
                <AnimatedImage
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  animationType={img.animationType || ['pop', 'shake', 'rotate'][index] as any}
                  intensity="medium"
                  className="rounded-xl overflow-hidden"
                />
              ))}
            </div>
          )}

          {/* Fourth Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {paragraphs[3]}
            </p>
          </motion.div>

          {/* 3D Image Section */}
          {images[4] && (
            <div className="mb-16">
              <AnimatedImage
                src={images[4].src}
                alt={images[4].alt}
                width={1200}
                height={800}
                animationType="3d"
                intensity="high"
                className="rounded-2xl overflow-hidden"
              />
            </div>
          )}

          {/* Fifth Paragraph */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl mx-auto">
              {paragraphs[4]}
            </p>
          </motion.div>

          {/* Additional Content */}
          {children}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#fbbf24]/10 via-black to-[#fbbf24]/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] bg-clip-text text-transparent font-display"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Ready to Get Started?
          </motion.h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" variant="primary" size="lg">
              Contact Us
            </CTAButton>
            <CTAButton href="/diagnostics" variant="secondary" size="lg">
              Try Diagnostics
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}


