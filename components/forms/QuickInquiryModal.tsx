'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QuickInquiryForm from './QuickInquiryForm';

interface QuickInquiryModalProps {
  trigger: React.ReactNode;
  service?: string;
  ctaLabel?: string;
  title?: string;
}

export default function QuickInquiryModal({
  trigger,
  service = '',
  ctaLabel = 'Send Inquiry',
  title = 'Quick Inquiry'
}: QuickInquiryModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)}>
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-gradient-to-br from-slate-900 to-black border border-slate-800 rounded-2xl p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition text-2xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Form */}
              <QuickInquiryForm
                service={service}
                ctaLabel={ctaLabel}
                onSuccess={() => setIsOpen(false)}
              />

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-gray-500">
                <p>Or call <a href="tel:+254768860665" className="text-amber-400 hover:text-amber-300">+254 768 860 665</a> for immediate assistance</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
