'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

/**
 * WHATSAPP FLOATING BUTTON - MOST IMPORTANT CTA FOR EAST AFRICA
 *
 * WhatsApp is the #1 communication tool in Kenya and East Africa
 * This button should be prominent, animated, and impossible to miss
 */

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const COMPANY_WHATSAPP = '254768860665';

  // Show tooltip after 5 seconds to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
        // Auto-hide after 8 seconds
        setTimeout(() => setShowTooltip(false), 8000);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleClick = () => {
    setHasInteracted(true);
    setShowTooltip(false);

    // Track click
    try {
      fetch('/api/analytics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'whatsapp_click',
          data: { source: 'floating_button', page: window.location.pathname },
        }),
      });
    } catch (e) {
      // Ignore tracking errors
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getMessage = () => {
    return `${getGreeting()}! I'm visiting your website and need assistance with power solutions. Can you help?`;
  };

  return (
    <div className="fixed bottom-24 left-6 z-[9997] md:bottom-6">
      {/* Tooltip/Message bubble */}
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.8 }}
            className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-2xl p-4 w-64 mb-2"
          >
            {/* Close button */}
            <button
              onClick={() => {
                setShowTooltip(false);
                setHasInteracted(true);
              }}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Message */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">EmersonEIMS Support</p>
                <p className="text-gray-600 text-xs mt-1">
                  Hi! Need help with generators, solar, or power solutions? Chat with us now!
                </p>
              </div>
            </div>

            {/* Reply button */}
            <a
              href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(getMessage())}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              className="mt-3 block w-full py-2 bg-[#25D366] text-white text-center font-semibold rounded-lg text-sm hover:bg-[#22c55e]"
            >
              Start Chat
            </a>

            {/* Typing indicator */}
            <div className="flex items-center gap-1 mt-2">
              <span className="text-xs text-gray-400">Online now</span>
              <span className="flex gap-0.5 ml-1">
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                />
                <motion.span
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  className="w-1.5 h-1.5 bg-green-500 rounded-full"
                />
              </span>
            </div>

            {/* Triangle pointer */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 shadow-lg" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main WhatsApp Button */}
      <motion.a
        href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(getMessage())}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="relative flex items-center justify-center w-16 h-16 bg-[#25D366] rounded-full shadow-2xl hover:bg-[#22c55e] transition-colors group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 0 0 rgba(37, 211, 102, 0.7)',
            '0 0 0 15px rgba(37, 211, 102, 0)',
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        {/* Pulse rings */}
        <motion.span
          className="absolute inset-0 rounded-full border-4 border-[#25D366]"
          animate={{
            scale: [1, 1.5, 1.5],
            opacity: [0.7, 0, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />

        {/* Icon */}
        <svg
          className="w-8 h-8 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Online indicator */}
        <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />

        {/* Notification badge */}
        <motion.span
          className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          1
        </motion.span>
      </motion.a>

      {/* "Chat with us" label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute -right-2 top-1/2 -translate-y-1/2 translate-x-full hidden lg:block"
      >
        <span className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
          Chat with us!
        </span>
      </motion.div>
    </div>
  );
}
