'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MessageCircle, Gift, Clock, MapPin } from 'lucide-react';

/**
 * EXIT INTENT POPUP - CAPTURE LEAVING VISITORS
 *
 * When someone tries to leave, give them an irresistible offer
 * This alone can increase conversions by 10-15%
 */

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const COMPANY_PHONE = '+254768860665';
  const COMPANY_WHATSAPP = '254768860665';

  // Detect exit intent (mouse leaving viewport)
  useEffect(() => {
    if (hasShown) return;

    // Check if already shown this session
    const shown = sessionStorage.getItem('exitPopupShown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    };

    // Mobile: Show after 30 seconds of inactivity or scroll up
    let lastScrollY = window.scrollY;
    let inactivityTimer: NodeJS.Timeout;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // User scrolling up fast (trying to leave)
      if (currentScrollY < lastScrollY - 100 && currentScrollY < 200 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
      lastScrollY = currentScrollY;

      // Reset inactivity timer on scroll
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (!hasShown && window.scrollY > 500) {
          setIsVisible(true);
          setHasShown(true);
          sessionStorage.setItem('exitPopupShown', 'true');
        }
      }, 45000); // Show after 45 seconds of no scrolling
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(inactivityTimer);
    };
  }, [hasShown]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Exit Intent Lead',
          email: 'exitintent@capture.local',
          phone,
          message: 'Requested callback via exit intent popup - HIGH INTENT LEAD',
          service: 'general',
          source: 'exit_intent_popup',
        }),
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [phone]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99999] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl border border-amber-500/30 max-w-md w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with urgency */}
            <div className="bg-gradient-to-r from-red-600 to-amber-600 p-4 text-center relative overflow-hidden">
              <motion.div
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
                  <Gift className="w-6 h-6" />
                  WAIT! Special Offer
                </div>
                <p className="text-white/90 text-sm mt-1">Don't miss out on this exclusive deal!</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 p-1 text-white/70 hover:text-white z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              {!submitted ? (
                <>
                  {/* Offer */}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      FREE Site Assessment
                    </h3>
                    <p className="text-gray-400">
                      Get a professional power assessment worth <span className="text-amber-500 font-bold">KES 15,000</span> absolutely FREE!
                    </p>
                  </div>

                  {/* Urgency */}
                  <div className="flex items-center justify-center gap-2 mb-6 text-red-400">
                    <Clock className="w-4 h-4 animate-pulse" />
                    <span className="text-sm font-medium">Offer expires in 24 hours</span>
                  </div>

                  {/* Quick callback form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                        required
                        className="w-full px-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-black font-bold text-lg rounded-xl hover:from-amber-400 hover:to-orange-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        'Requesting...'
                      ) : (
                        <>
                          <Phone className="w-5 h-5" />
                          Call Me Back NOW
                        </>
                      )}
                    </button>
                  </form>

                  {/* Or call directly */}
                  <div className="mt-4 text-center">
                    <p className="text-gray-500 text-sm mb-3">Or contact us directly:</p>
                    <div className="flex gap-3">
                      <a
                        href={`tel:${COMPANY_PHONE}`}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500"
                      >
                        <Phone className="w-4 h-4" />
                        Call
                      </a>
                      <a
                        href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent("Hi! I saw your special offer. I'm interested in a free site assessment.")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-semibold rounded-lg hover:bg-[#22c55e]"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Trust signals */}
                  <div className="mt-6 pt-4 border-t border-gray-700 text-center">
                    <p className="text-xs text-gray-500">
                      Trusted by 500+ businesses across Kenya
                    </p>
                    <div className="flex items-center justify-center gap-4 mt-2">
                      <span className="text-xs text-gray-400">3-Year Warranty</span>
                      <span className="text-amber-500">|</span>
                      <span className="text-xs text-gray-400">24/7 Support</span>
                      <span className="text-amber-500">|</span>
                      <span className="text-xs text-gray-400">47 Counties</span>
                    </div>
                  </div>
                </>
              ) : (
                /* Success state */
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                  >
                    <span className="text-4xl">✓</span>
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">We'll Call You!</h3>
                  <p className="text-gray-400 mb-4">
                    Our team will contact you within 30 minutes
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
