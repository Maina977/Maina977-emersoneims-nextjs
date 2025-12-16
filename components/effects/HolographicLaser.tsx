'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface HolographicLaserProps {
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
  className?: string;
}

/**
 * Holographic Laser Effect Component
 * Creates sci-fi laser grid effects with GSAP animations
 */
export default function HolographicLaser({ 
  intensity = 'medium',
  color = '#00ffff',
  className = ''
}: HolographicLaserProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const laserRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const lasers = laserRefs.current.filter(Boolean);
    if (lasers.length === 0) return;

    // Create GSAP timeline for laser animations
    const tl = gsap.timeline({ repeat: -1 });

    lasers.forEach((laser, index) => {
      // Staggered laser beam animations
      tl.to(laser, {
        opacity: intensity === 'high' ? 0.8 : intensity === 'medium' ? 0.5 : 0.3,
        scaleX: 1.2,
        duration: 0.5,
        ease: 'power2.inOut',
      }, index * 0.1)
      .to(laser, {
        opacity: 0.1,
        scaleX: 0.8,
        duration: 0.5,
        ease: 'power2.inOut',
      }, index * 0.1 + 0.5);
    });

    // Scroll-triggered laser intensity
    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to(lasers, {
          opacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.7 : 0.4,
          duration: 1,
          ease: 'power2.out',
        });
      },
      onLeave: () => {
        gsap.to(lasers, {
          opacity: 0.2,
          duration: 1,
          ease: 'power2.out',
        });
      },
      onEnterBack: () => {
        gsap.to(lasers, {
          opacity: intensity === 'high' ? 1 : intensity === 'medium' ? 0.7 : 0.4,
          duration: 1,
          ease: 'power2.out',
        });
      },
      onLeaveBack: () => {
        gsap.to(lasers, {
          opacity: 0.2,
          duration: 1,
          ease: 'power2.out',
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [intensity]);

  // Generate laser grid
  const laserCount = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{ zIndex: 1 }}
    >
      {/* Horizontal laser beams */}
      {Array.from({ length: laserCount }).map((_, i) => (
        <div
          key={`h-${i}`}
          ref={(el) => {
            if (el) laserRefs.current.push(el);
          }}
          className="absolute left-0 right-0 h-px"
          style={{
            top: `${(i + 1) * (100 / (laserCount + 1))}%`,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 ${intensity === 'high' ? '20px' : intensity === 'medium' ? '10px' : '5px'} ${color}`,
            opacity: 0.2,
            transform: 'scaleX(0.8)',
          }}
        />
      ))}

      {/* Vertical laser beams */}
      {Array.from({ length: laserCount }).map((_, i) => (
        <div
          key={`v-${i}`}
          ref={(el) => {
            if (el) laserRefs.current.push(el);
          }}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${(i + 1) * (100 / (laserCount + 1))}%`,
            background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 ${intensity === 'high' ? '20px' : intensity === 'medium' ? '10px' : '5px'} ${color}`,
            opacity: 0.2,
            transform: 'scaleY(0.8)',
          }}
        />
      ))}

      {/* Corner laser brackets */}
      <div
        className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: 0.5,
        }}
      />
      <div
        className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: 0.5,
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: 0.5,
        }}
      />
      <div
        className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2"
        style={{
          borderColor: color,
          boxShadow: `0 0 10px ${color}`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}






