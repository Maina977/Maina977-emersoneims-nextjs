// RESPONSIVE STYLES UTILITIES
// Mobile-first responsive styling

export const responsive = {
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  
  // Line heights
  lineHeight: {
    xs: 1.2,
    sm: 1.3,
    md: 1.4,
    lg: 1.5,
    xl: 1.6
  },
  
  // Breakpoints
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1400
  },
  
  // Container widths
  container: {
    sm: 540,
    md: 720,
    lg: 960,
    xl: 1140,
    xxl: 1320
  },
  
  // Grid columns
  grid: {
    columns: 12,
    gutter: {
      xs: 8,
      sm: 12,
      md: 16,
      lg: 20,
      xl: 24
    }
  }
};

// Media query helpers
export const media = {
  xs: `@media (min-width: ${responsive.breakpoints.xs}px)`,
  sm: `@media (min-width: ${responsive.breakpoints.sm}px)`,
  md: `@media (min-width: ${responsive.breakpoints.md}px)`,
  lg: `@media (min-width: ${responsive.breakpoints.lg}px)`,
  xl: `@media (min-width: ${responsive.breakpoints.xl}px)`,
  xxl: `@media (min-width: ${responsive.breakpoints.xxl}px)`,
  
  mobile: `@media (max-width: ${responsive.breakpoints.md - 1}px)`,
  tablet: `@media (min-width: ${responsive.breakpoints.md}px) and (max-width: ${responsive.breakpoints.lg - 1}px)`,
  desktop: `@media (min-width: ${responsive.breakpoints.lg}px)`,
  
  landscape: `@media (orientation: landscape)`,
  portrait: `@media (orientation: portrait)`,
  
  darkMode: `@media (prefers-color-scheme: dark)`,
  lightMode: `@media (prefers-color-scheme: light)`
};

// CSS-in-JS helper for responsive styles
export function responsiveStyle<T>(
  base: T,
  responsive: Partial<Record<keyof typeof responsive.breakpoints, T>>
): Record<string, T> {
  const styles: Record<string, T> = { base };
  
  for (const [breakpoint, value] of Object.entries(responsive)) {
    const bp = breakpoint as keyof typeof responsive.breakpoints;
    styles[media[bp]] = value;
  }
  
  return styles;
}

// Example usage in styled-components or emotion
export const responsiveGrid = (columns: number = 12) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gap: responsive.spacing.md,
  
  [media.sm]: { gap: responsive.spacing.lg },
  [media.md]: { gap: responsive.spacing.xl }
});

export const responsiveContainer = () => ({
  width: '100%',
  paddingLeft: responsive.spacing.md,
  paddingRight: responsive.spacing.md,
  marginLeft: 'auto',
  marginRight: 'auto',
  
  [media.sm]: {
    maxWidth: responsive.container.sm,
    paddingLeft: responsive.spacing.lg,
    paddingRight: responsive.spacing.lg
  },
  [media.md]: {
    maxWidth: responsive.container.md
  },
  [media.lg]: {
    maxWidth: responsive.container.lg
  },
  [media.xl]: {
    maxWidth: responsive.container.xl
  },
  [media.xxl]: {
    maxWidth: responsive.container.xxl
  }
});

export const responsiveTypography = (level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body') => {
  const sizes = {
    h1: { xs: 28, sm: 32, md: 36, lg: 40, xl: 48 },
    h2: { xs: 24, sm: 28, md: 32, lg: 36, xl: 40 },
    h3: { xs: 20, sm: 24, md: 28, lg: 32, xl: 36 },
    h4: { xs: 18, sm: 20, md: 24, lg: 28, xl: 32 },
    h5: { xs: 16, sm: 18, md: 20, lg: 24, xl: 28 },
    h6: { xs: 14, sm: 16, md: 18, lg: 20, xl: 24 },
    body: { xs: 14, sm: 16, md: 16, lg: 18, xl: 18 }
  };
  
  const size = sizes[level];
  
  return {
    fontSize: size.xs,
    [media.sm]: { fontSize: size.sm },
    [media.md]: { fontSize: size.md },
    [media.lg]: { fontSize: size.lg },
    [media.xl]: { fontSize: size.xl }
  };
};