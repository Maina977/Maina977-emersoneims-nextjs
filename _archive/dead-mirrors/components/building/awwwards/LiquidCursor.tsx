'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * 🏆 LIQUID MAGNETIC CURSOR - AWWWARDS SOTD WORTHY
 * World's first liquid cursor with quantum physics-inspired morphing
 * Features:
 * - Liquid blob that follows mouse with spring physics
 * - Magnetic attraction to interactive elements
 * - Morphs into different shapes based on hover target
 * - Color-shifting based on element type
 * - Ripple waves on click
 * - Particle trail effect
 */

interface RippleEffect {
  id: number;
  x: number;
  y: number;
  timestamp: number;
}

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [cursorVariant, setCursorVariant] = useState<'default' | 'button' | 'link' | 'input'>('default');
  const [isVisible, setIsVisible] = useState(false);

  // Mouse position with spring physics
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Hide on mobile/touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const updateCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      // Check if hovering over interactive element
      const target = e.target as HTMLElement;
      const isButton = target.closest('button, a, [role="button"], .interactive');
      const isInput = target.closest('input, textarea, select');

      if (isInput) {
        setCursorVariant('input');
      } else if (isButton) {
        setCursorVariant('button');

        // Magnetic effect - pull cursor towards button center
        const rect = isButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (distance < 100) {
          const pullStrength = 0.3;
          const pullX = centerX + (e.clientX - centerX) * (1 - pullStrength);
          const pullY = centerY + (e.clientY - centerY) * (1 - pullStrength);
          cursorX.set(pullX);
          cursorY.set(pullY);
        }
      } else {
        setCursorVariant('default');
      }
    };

    const handleClick = (e: MouseEvent) => {
      // Create ripple effect
      const newRipple: RippleEffect = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      };
      setRipples(prev => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 800);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY]);

  // Cursor variants configuration
  const variants = {
    default: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(251, 191, 36, 0.3)',
      border: '2px solid rgba(251, 191, 36, 0.8)',
      mixBlendMode: 'screen' as const,
    },
    button: {
      width: 80,
      height: 80,
      backgroundColor: 'rgba(251, 191, 36, 0.2)',
      border: '3px solid rgba(251, 191, 36, 1)',
      mixBlendMode: 'screen' as const,
    },
    link: {
      width: 60,
      height: 60,
      backgroundColor: 'rgba(6, 182, 212, 0.3)',
      border: '2px solid rgba(6, 182, 212, 0.8)',
      mixBlendMode: 'screen' as const,
    },
    input: {
      width: 4,
      height: 24,
      backgroundColor: 'rgba(251, 191, 36, 1)',
      border: 'none',
      mixBlendMode: 'normal' as const,
      borderRadius: '2px',
    },
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Liquid Cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full backdrop-blur-sm"
          animate={cursorVariant}
          variants={variants}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 28,
          }}
          style={{
            boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)',
            filter: 'blur(1px)',
          }}
        />

        {/* Inner Dot */}
        {cursorVariant !== 'input' && (
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full"
            style={{
              translateX: '-50%',
              translateY: '-50%',
            }}
            animate={{
              scale: cursorVariant === 'button' ? 0 : 1,
            }}
          />
        )}

        {/* Particle Trail */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 bg-cyan-400 rounded-full"
          style={{
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            scale: [1, 0],
            opacity: [1, 0],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatDelay: 0.1,
          }}
        />
      </motion.div>

      {/* Click Ripple Effects */}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-[9998] rounded-full border-2 border-amber-400"
          style={{
            left: ripple.x,
            top: ripple.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{
            width: 100,
            height: 100,
            opacity: 0,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}

      {/* Secondary Ripple */}
      {ripples.map(ripple => (
        <motion.div
          key={`${ripple.id}-2`}
          className="fixed pointer-events-none z-[9997] rounded-full border border-cyan-400"
          style={{
            left: ripple.x,
            top: ripple.y,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{
            width: 150,
            height: 150,
            opacity: 0,
          }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
        />
      ))}

      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
