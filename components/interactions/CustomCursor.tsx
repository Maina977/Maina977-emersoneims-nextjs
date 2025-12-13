'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CustomCursorProps {
  enabled?: boolean;
}

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Check for interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled, cursorX, cursorY]);

  if (!enabled || typeof window === 'undefined') return null;

  return (
    <>
      {/* Main Cursor */}
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <div
          className={`w-full h-full rounded-full border-2 border-white transition-all duration-300 ${
            isHovering ? 'scale-150 bg-white/20' : 'scale-100 bg-transparent'
          } ${isClicking ? 'scale-75' : ''}`}
        />
      </motion.div>

      {/* Cursor Follower */}
      <motion.div
        className="fixed top-0 left-0 w-12 h-12 pointer-events-none z-[9998]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        <div
          className={`w-full h-full rounded-full bg-white/10 backdrop-blur-sm transition-all duration-500 ${
            isHovering ? 'scale-150 opacity-50' : 'scale-100 opacity-30'
          }`}
        />
      </motion.div>
    </>
  );
}

