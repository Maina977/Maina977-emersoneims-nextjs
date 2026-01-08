'use client';

import PageTransition from '@/components/awwwards/PageTransition';

/**
 * Template wrapper for all pages - enables cinematic page transitions
 * This file wraps all route segments with PageTransition animation
 *
 * AWWWARDS SOTD: Morphing cinematic transitions between pages
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
