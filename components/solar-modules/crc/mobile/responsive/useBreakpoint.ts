// RESPONSIVE BREAKPOINT HOOK
// Mobile-first responsive design

import { useState, useEffect } from 'react';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export interface Breakpoints {
  xs: number;  // < 576px
  sm: number;  // ≥ 576px
  md: number;  // ≥ 768px
  lg: number;  // ≥ 992px
  xl: number;  // ≥ 1200px
  xxl: number; // ≥ 1400px
}

const defaultBreakpoints: Breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400
};

export function useBreakpoint(customBreakpoints?: Partial<Breakpoints>) {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('xs');
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      
      let newBreakpoint: Breakpoint = 'xs';
      if (newWidth >= breakpoints.xxl) newBreakpoint = 'xxl';
      else if (newWidth >= breakpoints.xl) newBreakpoint = 'xl';
      else if (newWidth >= breakpoints.lg) newBreakpoint = 'lg';
      else if (newWidth >= breakpoints.md) newBreakpoint = 'md';
      else if (newWidth >= breakpoints.sm) newBreakpoint = 'sm';
      else newBreakpoint = 'xs';
      
      setCurrentBreakpoint(newBreakpoint);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);
  
  return {
    width,
    breakpoint: currentBreakpoint,
    isXs: currentBreakpoint === 'xs',
    isSm: currentBreakpoint === 'sm',
    isMd: currentBreakpoint === 'md',
    isLg: currentBreakpoint === 'lg',
    isXl: currentBreakpoint === 'xl',
    isXxl: currentBreakpoint === 'xxl',
    isMobile: currentBreakpoint === 'xs' || currentBreakpoint === 'sm',
    isTablet: currentBreakpoint === 'md',
    isDesktop: currentBreakpoint === 'lg' || currentBreakpoint === 'xl' || currentBreakpoint === 'xxl',
    upTo: (breakpoint: Breakpoint) => {
      const breakpointValues: Record<Breakpoint, number> = breakpoints;
      return width <= breakpointValues[breakpoint];
    },
    downTo: (breakpoint: Breakpoint) => {
      const breakpointValues: Record<Breakpoint, number> = breakpoints;
      return width >= breakpointValues[breakpoint];
    },
    between: (min: Breakpoint, max: Breakpoint) => {
      const breakpointValues: Record<Breakpoint, number> = breakpoints;
      return width >= breakpointValues[min] && width <= breakpointValues[max];
    }
  };
}

// CSS-in-JS responsive helper
export function responsive<T>(
  styles: Partial<Record<Breakpoint, T>>,
  breakpoint: Breakpoint
): T | undefined {
  const breakpointOrder: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  for (let i = currentIndex; i >= 0; i--) {
    const bp = breakpointOrder[i];
    if (styles[bp] !== undefined) {
      return styles[bp];
    }
  }
  
  return undefined;
}