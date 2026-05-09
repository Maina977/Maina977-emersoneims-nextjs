'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, X, Zap, Clock } from 'lucide-react';

/**
 * STICKY CALL BAR - ALWAYS VISIBLE CTA
 *
 * A persistent bar at the top that makes it impossible to miss the call-to-action
 * Shows phone number + WhatsApp + urgency message
 */

export default function StickyCallBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  // Urgency messages that rotate
  const urgencyMessages = [
    "24/7 Emergency Service Available",
    "Free Site Assessment - Limited Time!",
    "Same-Day Response Guaranteed",
    "3-Year Warranty on All Services",
    "Serving All 47 Counties in Kenya",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    // Check if dismissed this session
    const dismissed = sessionStorage.getItem('stickyBarDismissed');
    if (dismissed) {
      setIsDismissed(true);
    }

    // Rotate messages
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % urgencyMessages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Show/hide based on scroll
  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // Hide when scrolling down, show when scrolling up
      if (currentScroll > lastScroll && currentScroll > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('stickyBarDismissed', 'true');
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ type: 'spring', damping: 25 }}
          className="fixed top-0 left-0 right-0 z-[9998] bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 shadow-lg"
        >
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2 md:py-3">
              {/* Urgency message - desktop */}
              <div className="hidden md:flex items-center gap-2 text-white">
                <Zap className="w-4 h-4 animate-pulse" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentMessage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-sm font-medium"
                  >
                    {urgencyMessages[currentMessage]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Mobile: Just show "Call Now" */}
              <div className="flex md:hidden items-center gap-2 text-white text-sm font-bold">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>24/7 Emergency Service</span>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-2 md:gap-3">
                {/* Call button */}
                <a
                  href={`tel:${COMPANY_PHONE}`}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-colors text-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span className="hidden sm:inline">Call Now</span>
                  <span className="sm:hidden">Call</span>
                </a>

                {/* WhatsApp button */}
                <a
                  href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent("Hi! I need help with power solutions.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#22c55e] transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>

                {/* Dismiss button */}
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-white/70 hover:text-white ml-1"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
