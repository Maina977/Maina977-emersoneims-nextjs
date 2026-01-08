'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/**
 * 💰 FLOATING ACTION BUBBLES - CONVERSION MACHINE
 *
 * Revolutionary floating action system that follows users and creates urgency
 * Features:
 * - Floating bubbles that pulse and demand attention
 * - Quick actions: Call, WhatsApp, Quote, Emergency
 * - Urgency indicators (limited stock, special offers)
 * - Smooth animations that don't annoy
 * - Mobile-optimized
 */

interface Action {
  id: string;
  label: string;
  icon: string;
  href?: string;
  phone?: string;
  whatsapp?: string;
  color: string;
  gradient: string;
  urgency?: string;
  pulse?: boolean;
}

const actions: Action[] = [
  {
    id: 'call',
    label: 'Call Now',
    icon: '📞',
    phone: '0768860665',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
    urgency: '24/7 Available',
    pulse: true,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: '💬',
    whatsapp: '254768860665',
    color: 'from-green-400 to-green-600',
    gradient: 'bg-gradient-to-br from-green-400 to-green-600',
    urgency: 'Instant Response',
    pulse: true,
  },
  {
    id: 'quote',
    label: 'Get Quote',
    icon: '💰',
    href: '/contact?type=quote',
    color: 'from-amber-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    urgency: 'Free Quote',
    pulse: false,
  },
  {
    id: 'emergency',
    label: 'Emergency',
    icon: '⚡',
    href: '/contact?type=emergency',
    color: 'from-red-500 to-red-700',
    gradient: 'bg-gradient-to-br from-red-500 to-red-700',
    urgency: '48hr Delivery',
    pulse: true,
  },
];

export default function FloatingActionBubbles() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Auto-expand after 3 seconds to grab attention
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setIsExpanded(true);
        // Auto-collapse after showing
        setTimeout(() => setIsExpanded(false), 5000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const handleAction = (action: Action) => {
    setHasInteracted(true);

    if (action.phone) {
      window.location.href = `tel:${action.phone}`;
    } else if (action.whatsapp) {
      window.open(`https://wa.me/${action.whatsapp}?text=Hello! I'm interested in EmersonEIMS power solutions.`, '_blank');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Main Action Button */}
        <motion.button
          className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-2xl overflow-hidden ${
            isExpanded ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
          }`}
          onClick={() => {
            setIsExpanded(!isExpanded);
            setHasInteracted(true);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={isExpanded ? {} : {
            scale: [1, 1.1, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            scale: { duration: 2, repeat: Infinity, repeatDelay: 3 },
            rotate: { duration: 0.5, repeat: Infinity, repeatDelay: 5 },
          }}
        >
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-amber-400"
            animate={{
              scale: [1, 1.8, 1.8],
              opacity: [0.8, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-orange-500"
            animate={{
              scale: [1, 1.5, 1.5],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: 0.3,
              ease: 'easeOut',
            }}
          />

          {/* Icon */}
          <motion.span
            className="relative z-10"
            animate={{ rotate: isExpanded ? 45 : 0 }}
          >
            {isExpanded ? '✕' : '⚡'}
          </motion.span>

          {/* Badge */}
          {!isExpanded && (
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              !
            </motion.div>
          )}
        </motion.button>

        {/* Action Bubbles */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="absolute bottom-20 right-0 flex flex-col gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {actions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ scale: 0, x: 50, opacity: 0 }}
                  animate={{
                    scale: 1,
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: index * 0.1,
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                    },
                  }}
                  exit={{
                    scale: 0,
                    x: 50,
                    opacity: 0,
                    transition: { delay: (actions.length - index) * 0.05 },
                  }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  className="relative"
                >
                  {action.href ? (
                    <Link
                      href={action.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full ${action.gradient} text-white font-bold shadow-lg hover:shadow-2xl transition-shadow group`}
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="text-sm whitespace-nowrap">{action.label}</span>
                        {action.urgency && (
                          <span className="text-xs opacity-90 whitespace-nowrap">{action.urgency}</span>
                        )}
                      </div>
                      <motion.span
                        className="ml-2"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleAction(action)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-full ${action.gradient} text-white font-bold shadow-lg hover:shadow-2xl transition-shadow group relative overflow-hidden`}
                    >
                      {/* Pulse animation for urgent actions */}
                      {action.pulse && (
                        <motion.div
                          className="absolute inset-0 bg-white"
                          animate={{
                            scale: [1, 1.5],
                            opacity: [0.3, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: 'easeOut',
                          }}
                        />
                      )}

                      <span className="text-2xl relative z-10">{action.icon}</span>
                      <div className="flex flex-col items-start relative z-10">
                        <span className="text-sm whitespace-nowrap">{action.label}</span>
                        {action.urgency && (
                          <span className="text-xs opacity-90 whitespace-nowrap">{action.urgency}</span>
                        )}
                      </div>
                    </button>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
