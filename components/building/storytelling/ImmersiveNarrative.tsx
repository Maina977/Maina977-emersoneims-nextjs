'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ImmersiveNarrativeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Nike-Level Immersive Storytelling
 * Creates engaging, narrative-driven experiences
 */
export default function ImmersiveNarrative({
  children,
  className = '',
}: ImmersiveNarrativeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity,
        y,
        scale,
      }}
    >
      {children}
    </motion.div>
  );
}







