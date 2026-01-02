'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * OPTIMIZED MAGNETIC CURSOR - Performance Enhanced
 * Only renders on desktop, uses efficient spring config
 */
export default function OptimizedMagneticCursor() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Optimized spring config - faster response, less computation
  const springConfig = { damping: 35, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if desktop (no touch)
    const checkDevice = () => {
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(!hasTouch && isLargeScreen);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice, { passive: true });
    
    // Delay cursor appearance for faster initial load
    const timer = setTimeout(() => setIsVisible(true), 2000);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || !isVisible) return;

    // Throttle mousemove updates
    let rafId: number | null = null;
    
    const moveCursor = (e: MouseEvent) => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        cursorX.set(e.clientX - 12);
        cursorY.set(e.clientY - 12);
        rafId = null;
      });
    };

    window.addEventListener('mousemove', moveCursor, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isDesktop, isVisible, cursorX, cursorY]);

  // Don't render on mobile/touch devices
  if (!isDesktop || !isVisible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 w-6 h-6 rounded-full border border-amber-500/60 pointer-events-none z-[9999] mix-blend-difference will-change-transform"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      aria-hidden="true"
    />
  );
}
