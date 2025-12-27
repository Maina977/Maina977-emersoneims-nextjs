'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingSequenceProps {
  onComplete: () => void;
  prefersReducedMotion?: boolean;
}

// Mark as client component to handle function props

export default function LoadingSequence({ 
  onComplete, 
  prefersReducedMotion = false 
}: LoadingSequenceProps) {
  useEffect(() => {
    if (prefersReducedMotion) {
      // Skip animation if user prefers reduced motion
      onComplete();
      return;
    }

    // Simulate loading sequence - Reduced from 2200ms to 800ms for better UX
    const timer = setTimeout(() => {
      onComplete();
    }, 800);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080c]"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            className="text-6xl font-bold text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            EMERSON EIMS
          </motion.div>
          <motion.div
            className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

