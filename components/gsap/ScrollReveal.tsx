'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  prefersReducedMotion?: boolean;
}

export default function ScrollReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 1,
  stagger = 0,
  className = '',
  prefersReducedMotion = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion || !ref.current) return;

    const ctx = gsap.context(() => {
      const element = ref.current;
      if (!element) return;

      // Set initial state based on direction
      const directions = {
        up: { y: 100, opacity: 0 },
        down: { y: -100, opacity: 0 },
        left: { x: 100, opacity: 0 },
        right: { x: -100, opacity: 0 },
        fade: { opacity: 0 },
      };

      const initial = directions[direction];

      // If children are multiple elements, stagger them
      const targets = stagger > 0 
        ? element.children 
        : element;

      gsap.set(targets, initial);

      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.to(targets, {
            x: 0,
            y: 0,
            opacity: 1,
            duration,
            delay,
            stagger: stagger > 0 ? stagger : 0,
            ease: 'power3.out',
          });
        },
        once: true,
      });
    }, ref);

    return () => ctx.revert();
  }, [direction, delay, duration, stagger, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}









