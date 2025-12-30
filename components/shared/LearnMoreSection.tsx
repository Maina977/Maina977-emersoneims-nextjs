'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface LearnMoreSectionProps {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
  buttonText?: string;
  variant?: 'default' | 'gold' | 'blue' | 'gradient';
}

/**
 * Learn More Expandable Section Component
 * Keeps pages clean by hiding detailed content behind expandable sections
 * Glassmorphic design with smooth Framer Motion animations
 */
export default function LearnMoreSection({
  title,
  children,
  defaultExpanded = false,
  className = '',
  buttonText = 'Learn More',
  variant = 'default'
}: LearnMoreSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const buttonVariants = {
    default: 'from-gray-800/50 to-gray-900/50 hover:from-gray-700/60 hover:to-gray-800/60 border-gray-600/30',
    gold: 'from-amber-500/20 to-yellow-600/20 hover:from-amber-500/30 hover:to-yellow-600/30 border-amber-500/30 text-amber-400',
    blue: 'from-blue-500/20 to-cyan-600/20 hover:from-blue-500/30 hover:to-cyan-600/30 border-blue-500/30 text-blue-400',
    gradient: 'from-purple-500/20 via-pink-500/20 to-red-500/20 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-red-500/30 border-purple-500/30 text-purple-400'
  };

  return (
    <div className={`relative ${className}`}>
      {/* Learn More Button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-full flex items-center justify-between gap-4 
          px-8 py-4 rounded-2xl
          bg-gradient-to-r ${buttonVariants[variant]}
          backdrop-blur-md border-2
          transition-all duration-300
          group relative overflow-hidden
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Holographic shine effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>

        <span className="text-lg md:text-xl font-bold relative z-10">
          {isExpanded ? `Hide Details` : buttonText}
        </span>

        {/* Animated Icon */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="relative z-10"
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>

        {/* Scan line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-50" />
      </motion.button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              exit={{ y: -20 }}
              transition={{ duration: 0.3 }}
              className="mt-6 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-700/30"
            >
              {/* Title if provided */}
              {title && (
                <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#fbbf24] via-[#fcd34d] to-[#fbbf24] bg-clip-text text-transparent">
                  {title}
                </h3>
              )}

              {/* Content */}
              <div className="text-gray-300 space-y-4">
                {children}
              </div>

              {/* Decorative corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-amber-500/30 rounded-tl-2xl" />
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-amber-500/30 rounded-br-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
