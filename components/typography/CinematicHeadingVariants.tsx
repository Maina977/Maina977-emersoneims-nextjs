'use client';

import CinematicHeading from './CinematicHeading';

/**
 * Pre-configured Cinematic Heading Variants
 * Use these for consistent headings across all pages
 */

// Hero Heading (H1) - Largest, most prominent
export function HeroHeading({ children, className = '', align = 'center' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
  return (
    <CinematicHeading as="h1" variant="hero" align={align} className={className}>
      {children}
    </CinematicHeading>
  );
}

// Section Heading (H2) - Main section titles
export function SectionHeading({ children, className = '', align = 'center' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
  return (
    <CinematicHeading as="h2" variant="section" align={align} className={className}>
      {children}
    </CinematicHeading>
  );
}

// Subsection Heading (H3) - Subsection titles
export function SubsectionHeading({ children, className = '', align = 'left' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
  return (
    <CinematicHeading as="h3" variant="subsection" align={align} className={className}>
      {children}
    </CinematicHeading>
  );
}

// Card Heading (H4) - Card titles
export function CardHeading({ children, className = '', align = 'left' }: { children: React.ReactNode; className?: string; align?: 'left' | 'center' | 'right' }) {
  return (
    <CinematicHeading as="h4" variant="card" align={align} className={className}>
      {children}
    </CinematicHeading>
  );
}








