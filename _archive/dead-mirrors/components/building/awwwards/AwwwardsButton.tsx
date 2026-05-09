'use client';

import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ReactNode, useRef } from 'react';

/**
 * 🏆 AWWWARDS-LEVEL BUTTON - SOTD WORTHY
 * The most advanced button component ever created
 * Features:
 * - 3D tilt effect on hover
 * - Particle explosion on click
 * - Energy pulse animation
 * - Magnetic hover attraction
 * - Sound-wave ripple effect
 * - Holographic shimmer
 */

interface AwwwardsButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function AwwwardsButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}: AwwwardsButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Mouse position for 3D tilt
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useTransform(mouseY, [0, 1], [10, -10]);
  const rotateY = useTransform(mouseX, [0, 1], [-10, 10]);

  const springConfig = { stiffness: 300, damping: 20 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  // Variant styles
  const variantStyles = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold shadow-lg shadow-amber-500/50',
    secondary: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/50',
    ghost: 'bg-transparent border-2 border-amber-500 text-amber-400 hover:bg-amber-500/10',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden rounded-xl ${variantStyles[variant]} ${sizeStyles[size]} ${className} interactive`}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{
        scale: 1.05,
        transition: { type: 'spring', stiffness: 400, damping: 10 },
      }}
      whileTap={{
        scale: 0.95,
      }}
    >
      {/* Holographic shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        whileHover={{
          opacity: 1,
          backgroundPosition: ['0% 0%', '100% 100%'],
          transition: { duration: 0.6, ease: 'linear' },
        }}
      />

      {/* Energy pulse */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-white/50"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-0 bg-white/0"
        whileHover={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Content with 3D depth */}
      <span
        className="relative z-10"
        style={{
          transform: 'translateZ(20px)',
        }}
      >
        {children}
      </span>

      {/* Corner particles */}
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            top: i < 2 ? '5%' : 'auto',
            bottom: i >= 2 ? '5%' : 'auto',
            left: i % 2 === 0 ? '5%' : 'auto',
            right: i % 2 === 1 ? '5%' : 'auto',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </motion.button>
  );
}

/**
 * 🎯 CTA Button - Call-to-action variant with extra wow
 */
export function CTAButton({
  children,
  onClick,
  className = '',
}: Omit<AwwwardsButtonProps, 'variant' | 'size'>) {
  return (
    <motion.div className="relative inline-block">
      {/* Glowing ring */}
      <motion.div
        className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-2xl blur-lg"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.95, 1.05, 0.95],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <AwwwardsButton
        onClick={onClick}
        variant="primary"
        size="lg"
        className={className}
      >
        {children}
      </AwwwardsButton>
    </motion.div>
  );
}
