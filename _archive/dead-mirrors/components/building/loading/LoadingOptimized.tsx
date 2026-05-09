'use client';

import { motion } from 'framer-motion';

interface LoadingOptimizedProps {
  message?: string;
}

export default function LoadingOptimized({ message = 'Loading...' }: LoadingOptimizedProps) {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 mx-auto mb-4 border-4 border-amber-400/30 border-t-amber-400 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          className="text-text-secondary text-sm"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}











