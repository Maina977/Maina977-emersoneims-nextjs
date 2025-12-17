'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ExperimentalLayoutProps {
  children: ReactNode;
  variant?: 'asymmetric' | 'grid' | 'masonry' | 'split' | 'overlay';
  className?: string;
}

/**
 * Nike-Level Experimental Layouts
 * Creative, engaging layouts that break conventions
 */
export default function ExperimentalLayout({
  children,
  variant = 'grid',
  className = '',
}: ExperimentalLayoutProps) {
  const variantStyles = {
    asymmetric: 'grid grid-cols-1 md:grid-cols-12 gap-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
    masonry: 'columns-1 md:columns-2 lg:columns-3 gap-8',
    split: 'grid grid-cols-1 lg:grid-cols-2 gap-12 items-center',
    overlay: 'relative',
  };

  return (
    <motion.div
      className={`${variantStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}







