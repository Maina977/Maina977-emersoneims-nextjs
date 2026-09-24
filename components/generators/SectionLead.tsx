import React from 'react';

/**
 * A section's lead heading and standfirst.
 *
 * COLOUR IS INHERITED, NOT SET HERE — and that is the fix, not a style choice.
 *
 * This component used to hard-code `text-gray-900` on the heading and
 * `text-gray-600` on the subtitle. Every live page that uses it wraps its
 * content in `bg-black text-white`, so the heading rendered #111827 on
 * #000000: a contrast ratio of about 1.06:1, which is not "low contrast", it
 * is invisible. The subtitle came out around 2.8:1, under the 4.5:1 that
 * WCAG AA asks for body text.
 *
 * Measured on the build of 2026-09-24: eleven built pages shipped a heading
 * nobody could read, including /generators and all six /specs/used/* pages,
 * which are in the sitemap. The text was in the HTML, so every audit that
 * counts words or headings passed it.
 *
 * Inheriting means the page decides. On the dark pages the heading is now
 * white because the wrapper says `text-white`; on a light page it would be
 * dark for the same reason. A component this generic should not be asserting
 * a colour it cannot know the background of.
 *
 * HEADING LEVEL IS A PROP, DEFAULTING TO h2.
 *
 * It always rendered an <h2>. That is right where it introduces a section
 * below a page title, which is most of its uses. It is wrong where it IS the
 * page title: the six /specs/used/* pages had h1=0, h2=3, h3=10 — no first-
 * level heading at all on six indexed pages. Those pass `as="h1"`; everything
 * else keeps the default and is unchanged.
 */

type HeadingLevel = 'h1' | 'h2' | 'h3';

interface SectionLeadProps {
  title?: string;
  subtitle?: string;
  centered?: boolean;
  showWebGL?: boolean;
  children?: React.ReactNode;
  className?: string;
  /** Heading level. Use "h1" only where this is the page's main title. */
  as?: HeadingLevel;
}

export default function SectionLead({
  title = 'Section Title',
  subtitle,
  centered = false,
  showWebGL = false,
  children,
  className = '',
  as = 'h2',
}: SectionLeadProps) {
  const containerClasses = centered ? 'text-center mb-12' : 'mb-12';
  const Heading = as;

  return (
    <div className={`${containerClasses} ${className}`}>
      {title && <Heading className="text-3xl font-bold mb-4">{title}</Heading>}
      {subtitle && <p className="text-lg opacity-80 mb-6">{subtitle}</p>}
      {children}
      {showWebGL && <div className="mt-4">{/* WebGL content would go here */}</div>}
    </div>
  );
}
