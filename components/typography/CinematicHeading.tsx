'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * Cinematic Heading Component
 * Consistent heading styles across all pages
 * - Same size, design, font, color, cinematic effects
 */

interface CinematicHeadingProps {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: ReactNode;
  className?: string;
  variant?: 'hero' | 'section' | 'subsection' | 'card';
  align?: 'left' | 'center' | 'right';
  animate?: boolean;
}

const sizeMap = {
  hero: 'text-6xl md:text-8xl',
  section: 'text-4xl md:text-5xl',
  subsection: 'text-2xl md:text-3xl',
  card: 'text-xl md:text-2xl',
};

export default function CinematicHeading({
  as = 'h2',
  children,
  className = '',
  variant = 'section',
  align = 'center',
  animate = true,
}: CinematicHeadingProps) {
  const Component = as;
  const sizeClass = sizeMap[variant];
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  const baseClasses = `
    ${sizeClass}
    font-bold
    font-display
    bg-gradient-to-r
    from-[#fbbf24]
    via-[#f59e0b]
    to-[#fbbf24]
    bg-clip-text
    text-transparent
    ${alignClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const headingContent = (
    <Component
      className={baseClasses}
      style={{
        textShadow: '0 0 40px rgba(251, 191, 36, 0.3)',
        backgroundSize: '200% auto',
        animation: animate ? 'gradient-shift 3s ease infinite' : 'none',
      }}
    >
      {children}
    </Component>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {headingContent}
      </motion.div>
    );
  }

  return headingContent;
}








