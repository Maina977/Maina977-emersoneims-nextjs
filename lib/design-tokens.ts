/**
 * ============================================================================
 * DESIGN TOKENS — Single Source of Truth
 * ============================================================================
 *
 * One token set used across:
 *   • Landing page
 *   • Simulator (controller / generator)
 *   • Quote audit
 *   • Diagnostics cockpit
 *   • Product database
 *   • Documentation / knowledge base
 *   • Homepage feature blocks
 *
 * RULES (LOCKED):
 *   1. NEVER hard-code colors, radii, shadows, spacings, font sizes or status
 *      colors in module CSS / TSX. Always reference these tokens — either via
 *      Tailwind classes (which derive from this file) or via the CSS custom
 *      properties emitted in `app/styles/tokens.css`.
 *   2. New visual primitives MUST be added here first, then propagated to
 *      Tailwind + CSS variables. No "module-only" tokens.
 *   3. Status colors come from `status.*` only — do not invent new
 *      success/warning/danger shades per module.
 *   4. To change brand color or radius, change it here once. Do not patch
 *      individual pages.
 *
 * Edit reviewers: any PR that adds a raw hex / rgba / px / rem value to a
 * component file should be rejected and the value moved here.
 * ============================================================================
 */

/* ---------- COLOR ---------- */

export const color = {
  /* Neutrals (Apple-grade gray ramp) */
  white: '#ffffff',
  black: '#000000',
  gray: {
    50:  '#fafafa',
    100: '#f5f5f7',
    200: '#e8e8ed',
    300: '#d2d2d7',
    400: '#86868b',
    500: '#6e6e73',
    600: '#424245',
    700: '#1d1d1f',
    800: '#161617',
    900: '#0b0b0c',
  },

  /* Brand */
  brand: {
    gold:        '#FFD166',
    goldDeep:    '#c9a227',
    goldLight:   '#f5d77a',
    cyan:        '#06b6d4',
    blue:        '#0071e3',
    blueDeep:    '#003a73',
  },

  /* Surface tokens (used by cards, panels, cockpits) */
  surface: {
    base:    '#ffffff',
    raised:  '#f5f5f7',
    sunken:  '#e8e8ed',
    inverse: '#0b0b0c',
    overlay: 'rgba(11, 11, 12, 0.72)',
  },

  /* Foreground / text */
  text: {
    primary:   '#1d1d1f',
    secondary: '#424245',
    muted:     '#6e6e73',
    inverse:   '#ffffff',
    accent:    '#c9a227',
    link:      '#0071e3',
  },

  /* Borders / dividers */
  border: {
    subtle: '#e8e8ed',
    strong: '#d2d2d7',
    accent: '#FFD166',
  },
} as const;

/* ---------- STATUS ---------- */
/** Status palette is the SAME across every module (diagnostics urgency,
 *  quote-audit findings, simulator alarms, product DB stock badges, etc.). */
export const status = {
  success: { fg: '#065f46', bg: '#ecfdf5', border: '#10b981', solid: '#10b981' },
  info:    { fg: '#1e3a8a', bg: '#eff6ff', border: '#3b82f6', solid: '#3b82f6' },
  warning: { fg: '#92400e', bg: '#fffbeb', border: '#f59e0b', solid: '#f59e0b' },
  danger:  { fg: '#991b1b', bg: '#fef2f2', border: '#ef4444', solid: '#ef4444' },
  neutral: { fg: '#1d1d1f', bg: '#f5f5f7', border: '#d2d2d7', solid: '#6e6e73' },
} as const;

/* ---------- SPACING (8px base) ---------- */

export const spacing = {
  0:    '0',
  px:   '1px',
  0.5:  '0.125rem', /* 2  */
  1:    '0.25rem',  /* 4  */
  2:    '0.5rem',   /* 8  */
  3:    '0.75rem',  /* 12 */
  4:    '1rem',     /* 16 */
  5:    '1.25rem',  /* 20 */
  6:    '1.5rem',   /* 24 */
  8:    '2rem',     /* 32 */
  10:   '2.5rem',   /* 40 */
  12:   '3rem',     /* 48 */
  16:   '4rem',     /* 64 */
  18:   '4.5rem',   /* 72 */
  20:   '5rem',     /* 80 */
  22:   '5.5rem',   /* 88 */
  24:   '6rem',     /* 96 */
  30:   '7.5rem',   /* 120 */
  32:   '8rem',     /* 128 */
  section:    '8rem',
  sectionLg:  '10rem',
} as const;

/* ---------- RADIUS ---------- */

export const radius = {
  none: '0',
  sm:   '0.375rem', /* 6  */
  md:   '0.75rem',  /* 12 */
  lg:   '1rem',     /* 16 */
  xl:   '1.5rem',   /* 24 */
  '2xl':'2rem',     /* 32 */
  '3xl':'2.5rem',   /* 40 */
  full: '9999px',
} as const;

/* ---------- SHADOW ---------- */
/** Shadow tiers map 1:1 with elevation. Do not invent module-specific shadows. */
export const shadow = {
  none:    'none',
  xs:      '0 1px 2px 0 rgba(0,0,0,0.05)',
  sm:      '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
  md:      '0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -2px rgba(0,0,0,0.06)',
  lg:      '0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.05)',
  xl:      '0 20px 25px -5px rgba(0,0,0,0.10), 0 8px 10px -6px rgba(0,0,0,0.05)',
  '2xl':   '0 25px 50px -12px rgba(0,0,0,0.25)',
  premium: '0 25px 50px -12px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,209,102,0.10)',
  glow:    '0 0 30px rgba(255,209,102,0.20)',
  focus:   '0 0 0 3px rgba(0,113,227,0.40)',
  inset:   'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
} as const;

/* ---------- TYPOGRAPHY ---------- */

export const fontFamily = {
  sans:    'ui-sans-serif, -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
  mono:    'ui-monospace, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  display: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
} as const;

export const fontSize = {
  xs:   ['0.75rem',  { lineHeight: '1rem' }],
  sm:   ['0.875rem', { lineHeight: '1.25rem' }],
  base: ['1rem',     { lineHeight: '1.5rem' }],
  lg:   ['1.125rem', { lineHeight: '1.75rem' }],
  xl:   ['1.25rem',  { lineHeight: '1.75rem' }],
  '2xl':['1.5rem',   { lineHeight: '2rem' }],
  '3xl':['1.875rem', { lineHeight: '2.25rem' }],
  '4xl':['2.25rem',  { lineHeight: '2.5rem' }],
  '5xl':['3rem',     { lineHeight: '1.1' }],
  '6xl':['3.75rem',  { lineHeight: '1.05' }],
  '7xl':['4.5rem',   { lineHeight: '1.05' }],
  '8xl':['6rem',     { lineHeight: '1.0' }],
  '9xl':['8rem',     { lineHeight: '1.0' }],
  /* Apple-style fluid display */
  display:  ['clamp(2.5rem, 8vw, 5rem)',   { lineHeight: '1.05', letterSpacing: '-0.03em' }],
  headline: ['clamp(2rem, 5vw, 3.5rem)',   { lineHeight: '1.10', letterSpacing: '-0.025em' }],
  title:    ['clamp(1.5rem, 3vw, 2.25rem)',{ lineHeight: '1.15', letterSpacing: '-0.02em' }],
} as const;

export const fontWeight = {
  normal:   '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
  black:    '900',
} as const;

export const letterSpacing = {
  tighter: '-0.04em',
  tight:   '-0.02em',
  normal:  '0',
  wide:    '0.02em',
  wider:   '0.04em',
} as const;

/* ---------- MOTION ---------- */

export const easing = {
  apple:  'cubic-bezier(0.25, 0.1, 0.25, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const duration = {
  fast:   '150ms',
  base:   '250ms',
  slow:   '400ms',
  slower: '600ms',
} as const;

/* ---------- Z-INDEX ---------- */

export const zIndex = {
  base:    0,
  raised:  10,
  sticky:  20,
  overlay: 30,
  modal:   40,
  toast:   50,
  tooltip: 60,
} as const;

/* ---------- AGGREGATE EXPORT ---------- */

export const tokens = {
  color,
  status,
  spacing,
  radius,
  shadow,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  easing,
  duration,
  zIndex,
} as const;

export type Tokens = typeof tokens;
export default tokens;
