'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
}

/**
 * Reveal Animation Component
 * Apple-level reveal animations
 */
export function Reveal({ children, direction = 'up', delay = 0, duration = 0.8 }: RevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
    fade: { y: 0, x: 0 },
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directions[direction] }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, ...directions[direction] }}
      transition={{
        duration,
        delay,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parallax Reveal Component
 * Tesla-level parallax effects
 */
export function ParallaxReveal({ children, speed = 0.5 }: { children: ReactNode; speed?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [50 * speed, -50 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Reveal Component
 * For lists and grids
 */
export function StaggerReveal({ children, stagger = 0.1 }: { children: ReactNode[]; stagger?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <div ref={ref}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0 }}
            transition={{
              duration: 0.6,
              delay: index * stagger,
              ease: [0.43, 0.13, 0.23, 0.96],
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        children
      )}
    </div>
  );
}

