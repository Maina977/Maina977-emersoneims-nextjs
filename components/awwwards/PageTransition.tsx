'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

/**
 * 🏆 MORPHING PAGE TRANSITIONS - AWWWARDS SOTD WORTHY
 * Cinematic page transitions with liquid morphing effects
 * Features:
 * - Liquid wipe animations
 * - Morphing shape reveals
 * - Staggered element animations
 * - Physics-based spring transitions
 * - Direction-aware animations
 */

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // Different transitions for different routes
  const getTransitionVariant = () => {
    if (pathname === '/') return 'slideUp';
    if (pathname?.startsWith('/generators')) return 'morphCircle';
    if (pathname?.startsWith('/solar')) return 'wipe';
    if (pathname?.startsWith('/diagnostics')) return 'curtain';
    return 'fade';
  };

  const variants = {
    // Slide up with scale
    slideUp: {
      initial: {
        y: '100%',
        scale: 0.8,
        opacity: 0,
      },
      animate: {
        y: 0,
        scale: 1,
        opacity: 1,
        transition: {
          duration: 0.8,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
      exit: {
        y: '-100%',
        scale: 1.1,
        opacity: 0,
        transition: {
          duration: 0.6,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
    },

    // Morphing circle expand
    morphCircle: {
      initial: {
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0,
      },
      animate: {
        clipPath: 'circle(150% at 50% 50%)',
        opacity: 1,
        transition: {
          duration: 1,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
      exit: {
        clipPath: 'circle(0% at 50% 50%)',
        opacity: 0,
        transition: {
          duration: 0.7,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
    },

    // Liquid wipe
    wipe: {
      initial: {
        clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
      },
      animate: {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: {
          duration: 0.9,
          ease: [0.87, 0, 0.13, 1],
        },
      },
      exit: {
        clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)',
        transition: {
          duration: 0.7,
          ease: [0.87, 0, 0.13, 1],
        },
      },
    },

    // Curtain reveal
    curtain: {
      initial: {
        clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
        opacity: 0,
      },
      animate: {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        opacity: 1,
        transition: {
          duration: 1,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
      exit: {
        clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
        opacity: 0,
        transition: {
          duration: 0.8,
          ease: [0.6, 0.05, 0.01, 0.9],
        },
      },
    },

    // Simple fade with scale
    fade: {
      initial: {
        opacity: 0,
        scale: 0.95,
      },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: 'easeOut',
        },
      },
      exit: {
        opacity: 0,
        scale: 1.05,
        transition: {
          duration: 0.4,
          ease: 'easeIn',
        },
      },
    },
  };

  const currentVariant = getTransitionVariant();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[currentVariant]}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * 🎬 LOADING OVERLAY - Appears during transitions
 */
export function TransitionOverlay() {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-black to-cyan-500/20" />

      {/* Animated logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="text-6xl font-bold text-amber-400"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          ⚡
        </motion.div>
      </div>

      {/* Particle burst */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2 w-2 h-2 bg-amber-400 rounded-full"
          initial={{
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: Math.cos((i / 12) * Math.PI * 2) * 100,
            y: Math.sin((i / 12) * Math.PI * 2) * 100,
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );
}
