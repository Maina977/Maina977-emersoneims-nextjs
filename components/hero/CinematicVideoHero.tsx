'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import OptimizedVideo from '@/components/media/OptimizedVideo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CinematicVideoHeroProps {
  videoSrc?: string;
  fallbackImage?: string;
  prefersReducedMotion?: boolean;
}

export default function CinematicVideoHero({
  videoSrc = '/videos/hero-energy.mp4',
  fallbackImage = '/images/hero-fallback.jpg',
  prefersReducedMotion = false,
}: CinematicVideoHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const subheadlineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      // Master timeline for hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Video fade in
      if (videoRef.current) {
        tl.fromTo(
          videoRef.current,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 2, ease: 'power2.inOut' },
          0
        );
      }

      // Headline animation - split text reveal
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word');
        tl.fromTo(
          words,
          {
            y: 100,
            opacity: 0,
            rotationX: -90,
          },
          {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: 0.08,
            ease: 'power3.out',
          },
          0.5
        );
      }

      // Subheadline fade and slide
      if (subheadlineRef.current) {
        tl.fromTo(
          subheadlineRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
          1.2
        );
      }

      // CTA buttons magnetic entrance
      if (ctaRef.current) {
        const buttons = ctaRef.current.querySelectorAll('.cta-button');
        tl.fromTo(
          buttons,
          { scale: 0.8, opacity: 0, y: 30 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)',
          },
          1.8
        );
      }

      // Parallax scroll effect
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        onUpdate: (self) => {
          const scrollProgress = self.progress;
          if (videoRef.current) {
            gsap.set(videoRef.current, {
              y: scrollProgress * 100,
              scale: 1 + scrollProgress * 0.1,
            });
          }
          if (headlineRef.current) {
            gsap.set(headlineRef.current, {
              y: scrollProgress * 50,
              opacity: 1 - scrollProgress * 0.5,
            });
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isVideoLoaded]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div
      ref={heroRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {prefersReducedMotion ? (
          <img
            src={fallbackImage}
            alt="Energy infrastructure"
            className="w-full h-full object-cover"
          />
        ) : (
          <OptimizedVideo
            src={videoSrc}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={handleVideoLoad}
            ref={videoRef}
          />
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        {/* Animated Grid Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid-pattern" />
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:px-8">
        {/* Headline */}
        <div
          ref={headlineRef}
          className="text-center mb-8"
        >
          <h1 className="text-hero font-display text-white mb-4">
            <span className="word block">Engineering</span>
            <span className="word block">Power</span>
            <span className="word block gradient-text-gold">
              for East Africa's
            </span>
            <span className="word block">Future</span>
          </h1>
        </div>

        {/* Subheadline */}
        <div
          ref={subheadlineRef}
          className="text-center max-w-4xl"
        >
          <p className="text-body-large text-text-secondary font-light mb-2">
            Intelligent energy solutions that power progress, sustain communities,
          </p>
          <p className="text-body-large text-text-secondary font-light">
            and transform lives across Kenya and beyond.
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          ref={ctaRef}
          className="flex gap-4 mt-12 flex-wrap justify-center"
        >
          <a href="/solutions" className="cta-button cta-primary">
            <span>Explore Solutions</span>
            <span className="cta-shine" />
          </a>
          <a href="/about#story" className="cta-button cta-secondary">
            <span>Watch Story</span>
            <span className="cta-icon">▶</span>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="scroll-indicator">
            <div className="scroll-line" />
            <div className="scroll-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}

