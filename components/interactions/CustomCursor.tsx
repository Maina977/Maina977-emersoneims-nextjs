'use client';

/**
 * AWWWARDS SOTD PREMIUM SCI-FI CURSOR
 * Universal, unique, and extremely premium cursor system
 * Features: Holographic effects, particle trails, energy waves, multi-layer animations
 */

import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

interface CustomCursorProps {
  enabled?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

export default function CustomCursor({ enabled = true }: CustomCursorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hover' | 'action' | 'text'>('default');
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdRef = useRef(0);
  const lastPositionRef = useRef({ x: 0, y: 0 });
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const followerX = useMotionValue(-100);
  const followerY = useMotionValue(-100);
  
  // Ultra-smooth spring physics
  const springConfig = { damping: 20, stiffness: 500, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const followerXSpring = useSpring(followerX, { damping: 15, stiffness: 200, mass: 0.8 });
  const followerYSpring = useSpring(followerY, { damping: 15, stiffness: 200, mass: 0.8 });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!enabled || !isClient) return;

    const updateCursor = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      
      cursorX.set(x);
      cursorY.set(y);
      followerX.set(x);
      followerY.set(y);

      // Create particle trail
      const distance = Math.sqrt(
        Math.pow(x - lastPositionRef.current.x, 2) + 
        Math.pow(y - lastPositionRef.current.y, 2)
      );

      if (distance > 5) {
        const newParticle: Particle = {
          id: particleIdRef.current++,
          x: lastPositionRef.current.x,
          y: lastPositionRef.current.y,
          opacity: 1,
          size: Math.random() * 4 + 2,
        };
        
        setParticles((prev) => [...prev.slice(-15), newParticle]);
        
        // Fade out particles
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 500);

        lastPositionRef.current = { x, y };
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleMouseMove = () => {};

    // Detect interactive elements and cursor types
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorAttr = target.getAttribute('data-cursor') || 
                        target.closest('[data-cursor]')?.getAttribute('data-cursor');
      
      if (cursorAttr === 'action' || target.closest('[data-cursor="action"]')) {
        setCursorType('action');
        setIsHovering(true);
      } else if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor="hover"]')
      ) {
        setCursorType('hover');
        setIsHovering(true);
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        setCursorType('text');
        setIsHovering(false);
      } else {
        setCursorType('default');
        setIsHovering(false);
      }
    };

    // Hide default cursor
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', updateCursor);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseleave', () => {
      cursorX.set(-100);
      cursorY.set(-100);
    });

    return () => {
      document.body.style.cursor = 'auto';
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled, isClient, cursorX, cursorY, followerX, followerY]);

  if (!enabled || !isClient) return null;

  // Cursor size and style based on state
  const getCursorSize = () => {
    if (isClicking) return 8;
    if (cursorType === 'action') return 24;
    if (cursorType === 'hover') return 20;
    if (cursorType === 'text') return 2;
    return 12;
  };

  const getFollowerSize = () => {
    if (isClicking) return 40;
    if (cursorType === 'action') return 80;
    if (cursorType === 'hover') return 60;
    return 48;
  };

  return (
    <>
      {/* Particle Trail - only rendered after client mount to prevent hydration mismatch */}
      {isClient && (
        <AnimatePresence>
          {particles.map((particle) => (
            <motion.div
              key={`particle-${particle.id}`}
              className="fixed pointer-events-none z-[9997]"
              style={{
                left: particle.x,
                top: particle.y,
                width: particle.size,
                height: particle.size,
                translateX: '-50%',
                translateY: '-50%',
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-amber-400 blur-[2px]" />
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Outer Follower Ring - Energy Wave */}
      <motion.div
        className="fixed pointer-events-none z-[9998]"
        style={{
          x: followerXSpring,
          y: followerYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full border-2"
          style={{
            width: getFollowerSize(),
            height: getFollowerSize(),
            borderColor: cursorType === 'action' 
              ? 'rgba(0, 255, 255, 0.4)' 
              : cursorType === 'hover'
              ? 'rgba(251, 191, 36, 0.4)'
              : 'rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            scale: isClicking ? 0.8 : isHovering ? 1.2 : 1,
            opacity: isHovering ? 0.6 : 0.3,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {/* Rotating Energy Ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: cursorType === 'action'
                ? 'conic-gradient(from 0deg, transparent, rgba(0, 255, 255, 0.3), transparent)'
                : cursorType === 'hover'
                ? 'conic-gradient(from 0deg, transparent, rgba(251, 191, 36, 0.3), transparent)'
                : 'conic-gradient(from 0deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </motion.div>

      {/* Middle Glow Ring - Holographic Effect */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          className="rounded-full blur-md"
          style={{
            width: getFollowerSize() * 0.7,
            height: getFollowerSize() * 0.7,
            background: cursorType === 'action'
              ? 'radial-gradient(circle, rgba(0, 255, 255, 0.4), transparent 70%)'
              : cursorType === 'hover'
              ? 'radial-gradient(circle, rgba(251, 191, 36, 0.4), transparent 70%)'
              : 'radial-gradient(circle, rgba(255, 255, 255, 0.2), transparent 70%)',
          }}
          animate={{
            scale: isClicking ? 0.6 : isHovering ? 1.1 : 1,
            opacity: isHovering ? 0.8 : 0.4,
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 400 }}
        />
      </motion.div>

      {/* Main Cursor Dot - Core */}
      <motion.div
        className="fixed pointer-events-none z-[10000]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        {/* Outer Pulse Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border"
          style={{
            width: getCursorSize() * 3,
            height: getCursorSize() * 3,
            borderColor: cursorType === 'action'
              ? 'rgba(0, 255, 255, 0.3)'
              : cursorType === 'hover'
              ? 'rgba(251, 191, 36, 0.3)'
              : 'rgba(255, 255, 255, 0.2)',
            borderWidth: 1,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Main Cursor Core */}
        <motion.div
          className="rounded-full relative overflow-visible"
          style={{
            width: getCursorSize(),
            height: getCursorSize(),
            background: cursorType === 'action'
              ? 'linear-gradient(135deg, rgba(0, 255, 255, 1), rgba(0, 200, 200, 1))'
              : cursorType === 'hover'
              ? 'linear-gradient(135deg, rgba(251, 191, 36, 1), rgba(245, 158, 11, 1))'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 1), rgba(200, 200, 200, 1))',
            boxShadow: cursorType === 'action'
              ? '0 0 20px rgba(0, 255, 255, 0.8), 0 0 40px rgba(0, 255, 255, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)'
              : cursorType === 'hover'
              ? '0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(251, 191, 36, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.3)'
              : '0 0 10px rgba(255, 255, 255, 0.5), inset 0 0 5px rgba(255, 255, 255, 0.3)',
          }}
          animate={{
            scale: isClicking ? 0.7 : isHovering ? 1.3 : 1,
            rotate: isHovering ? [0, 180, 360] : 0,
          }}
          transition={{
            scale: { type: 'spring', damping: 25, stiffness: 500 },
            rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
          }}
        >
          {/* Inner Glow */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8), transparent 60%)',
            }}
          />
          
          {/* Center Dot */}
          <div
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: getCursorSize() * 0.3,
              height: getCursorSize() * 0.3,
              background: 'rgba(255, 255, 255, 1)',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
            }}
          />
        </motion.div>

        {/* Text Cursor Line */}
        {cursorType === 'text' && (
          <motion.div
            className="absolute top-0 left-1/2 bg-white"
            style={{
              width: 2,
              height: 20,
              translateX: '-50%',
            }}
            animate={{
              opacity: [1, 0.3, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Action Cursor Crosshair */}
        {cursorType === 'action' && (
          <>
            <motion.div
              className="absolute top-1/2 left-0 bg-cyan-400"
              style={{
                width: 20,
                height: 2,
                translateY: '-50%',
              }}
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <motion.div
              className="absolute top-0 left-1/2 bg-cyan-400"
              style={{
                width: 2,
                height: 20,
                translateX: '-50%',
              }}
              animate={{
                scaleY: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.25,
              }}
            />
          </>
        )}
      </motion.div>

      {/* Click Ripple Effect */}
      <AnimatePresence>
        {isClicking && (
          <motion.div
            className="fixed pointer-events-none z-[9996] rounded-full border-2"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
              width: 60,
              height: 60,
              borderColor: cursorType === 'action'
                ? 'rgba(0, 255, 255, 0.6)'
                : 'rgba(251, 191, 36, 0.6)',
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
