'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Enhanced Touch Interactions
 * Apple-level mobile touch experience
 */
export function Touchable({ children, onTap, className = '' }: { children: ReactNode; onTap?: () => void; className?: string }) {
  const [isPressed, setIsPressed] = useState(false);
  const scale = useSpring(1, { stiffness: 400, damping: 17 });

  useEffect(() => {
    if (isPressed) {
      scale.set(0.95);
    } else {
      scale.set(1);
    }
  }, [isPressed, scale]);

  return (
    <motion.div
      className={className}
      style={{ scale }}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => {
        setIsPressed(false);
        onTap?.();
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => {
        setIsPressed(false);
        onTap?.();
      }}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </motion.div>
  );
}

/**
 * Swipeable Component
 * For swipe gestures on mobile
 */
export function Swipeable({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
}) {
  const x = useMotionValue(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const opacity = useTransform(springX, [-100, 0, 100], [0.5, 1, 0.5]);

  const handleStart = (clientX: number) => {
    setStartX(clientX);
    setIsDragging(true);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const delta = clientX - startX;
    x.set(delta);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const currentX = x.get();

    if (Math.abs(currentX) > threshold) {
      if (currentX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (currentX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }

    x.set(0);
    setIsDragging(false);
  };

  return (
    <motion.div
      style={{ x: springX, opacity }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => {
        if (isDragging) handleMove(e.clientX);
      }}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      drag="x"
      dragConstraints={{ left: -100, right: 100 }}
      dragElastic={0.2}
      className="touch-manipulation"
    >
      {children}
    </motion.div>
  );
}

/**
 * Magnetic Hover Effect
 * For desktop interactions
 */
export function Magnetic({ children, strength = 30 }: { children: ReactNode; strength?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / strength;
    const deltaY = (e.clientY - centerY) / strength;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}

