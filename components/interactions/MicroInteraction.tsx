'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef, useState } from 'react';

interface MicroInteractionProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  glow?: boolean;
  ripple?: boolean;
  magnetic?: boolean;
}

/**
 * Apple-Level Micro-Interactions
 * Delightful, subtle animations that enhance UX
 */
export default function MicroInteraction({
  children,
  className = '',
  scale = 1.05,
  glow = false,
  ripple = false,
  magnetic = false,
}: MicroInteractionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Magnetic effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnetic || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    x.set(distanceX * 0.1);
    y.set(distanceY * 0.1);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={magnetic ? { x: springX, y: springY } : undefined}
      whileHover={{
        scale: scale,
        transition: { type: 'spring', stiffness: 400, damping: 25 },
      }}
      whileTap={{
        scale: scale * 0.95,
        transition: { duration: 0.1 },
      }}
    >
      {glow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/20 via-cyan-500/20 to-cyan-400/20 blur-xl -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
      {ripple && (
        <motion.div
          className="absolute inset-0 rounded-full bg-cyan-400/30"
          initial={{ scale: 0, opacity: 0.5 }}
          animate={isHovered ? { scale: 2, opacity: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      )}
      {children}
    </motion.div>
  );
}







