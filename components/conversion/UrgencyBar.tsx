'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * ⚡ URGENCY BAR - FOMO GENERATOR
 *
 * Creates urgency with limited stock, time-sensitive offers, and live counters
 * Features:
 * - Stock countdown ("Only 3 left in Nairobi!")
 * - Flash sale timers
 * - People viewing counter
 * - Sticky top bar that demands attention
 * - Different messages rotate
 */

interface UrgencyMessage {
  id: string;
  text: string;
  icon: string;
  link: string;
  linkText: string;
  color: string;
  countdown?: number; // seconds
}

const urgencyMessages: UrgencyMessage[] = [
  {
    id: 'stock',
    text: 'Only 5 Cummins 500kVA Generators left in Nairobi!',
    icon: '🔥',
    link: '/generators',
    linkText: 'Order Now',
    color: 'from-red-600 to-orange-600',
  },
  {
    id: 'flash',
    text: '48-Hour Flash Sale: 15% OFF Solar Installations',
    icon: '⚡',
    link: '/solar',
    linkText: 'Claim Offer',
    color: 'from-amber-500 to-orange-500',
    countdown: 172800, // 48 hours
  },
  {
    id: 'viewers',
    text: '23 people are viewing generators right now',
    icon: '👥',
    link: '/generators',
    linkText: 'View Stock',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'emergency',
    text: 'Emergency Power? 48-Hour Delivery Available',
    icon: '🚨',
    link: '/contact?type=emergency',
    linkText: 'Get Help Now',
    color: 'from-red-500 to-red-700',
  },
];

export default function UrgencyBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [viewerCount, setViewerCount] = useState(23);

  const currentMessage = urgencyMessages[currentIndex];

  // Rotate messages every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % urgencyMessages.length);
    }, 8000);

    return () => clearInterval(timer);
  }, []);

  // Initialize countdown for flash sale
  useEffect(() => {
    if (currentMessage.countdown) {
      setCountdown(currentMessage.countdown);
    } else {
      setCountdown(null);
    }
  }, [currentMessage]);

  // Countdown timer
  useEffect(() => {
    if (countdown === null || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Random viewer count updates
  useEffect(() => {
    const timer = setInterval(() => {
      setViewerCount((prev) => {
        const change = Math.random() > 0.5 ? 1 : -1;
        const newCount = prev + change;
        return Math.max(15, Math.min(35, newCount)); // Keep between 15-35
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  // Format countdown
  const formatCountdown = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      exit={{ y: -100 }}
      className="fixed top-0 left-0 right-0 z-[9997] pointer-events-none"
    >
      <div className={`bg-gradient-to-r ${currentMessage.color} text-white py-3 px-4 shadow-lg pointer-events-auto`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          {/* Message */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMessage.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 flex-1"
            >
              {/* Animated Icon */}
              <motion.span
                className="text-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                {currentMessage.icon}
              </motion.span>

              {/* Text */}
              <span className="font-semibold text-sm sm:text-base">
                {currentMessage.id === 'viewers'
                  ? `${viewerCount} people are viewing generators right now`
                  : currentMessage.text}
              </span>

              {/* Countdown Timer */}
              {countdown !== null && countdown > 0 && (
                <motion.div
                  className="bg-black/20 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  ⏰ {formatCountdown(countdown)}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* CTA Button */}
          <div className="flex items-center gap-2">
            <Link
              href={currentMessage.link}
              className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg"
            >
              {currentMessage.linkText} →
            </Link>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 transition-colors ml-2"
              aria-label="Close urgency bar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar showing time until next message */}
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-white/30"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 8, ease: 'linear' }}
          key={currentIndex}
        />
      </div>
    </motion.div>
  );
}
