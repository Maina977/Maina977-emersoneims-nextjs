'use client';

import { useState, useEffect } from 'react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  position?: 'bottom-right' | 'bottom-left';
}

function WhatsAppButtonInner({
  phoneNumber = '+254768860665',
  message = 'Hello EmersonEIMS! I need help with power solutions.',
  position = 'bottom-right'
}: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Show tooltip after 5 seconds if user hasn't interacted
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasInteracted) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [hasInteracted]);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  const quickMessages = [
    { icon: '⚡', text: 'Emergency Power Support', message: 'URGENT: I need emergency power support immediately!' },
    { icon: '📋', text: 'Get a Quote', message: 'Hi, I would like to request a quote for power solutions.' },
    { icon: '🔍', text: 'Request Site Survey', message: 'Hi, I would like to schedule a site survey for my location.' },
    { icon: '🔧', text: 'Technical Support', message: 'Hi, I need technical support for my generator/system.' },
    { icon: '💬', text: 'General Inquiry', message: 'Hello, I have some questions about your services.' },
  ];

  const positionClasses = position === 'bottom-right' 
    ? 'right-6 sm:right-8' 
    : 'left-6 sm:left-8';

  return (
    <>
      {/* Main floating button */}
      <div
        className={`fixed ${positionClasses} z-50`}
        style={{ bottom: 'calc(1.5rem + var(--consent-bar-h, 0px))' }}
      >          {/* Quick action menu */}
          {isOpen && (
            <div
             
             
             
              className="absolute bottom-20 right-0 w-72 bg-black/95 backdrop-blur-xl border border-green-500/30 rounded-2xl shadow-2xl shadow-green-500/20 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-500 p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-bold">EmersonEIMS Support</div>
                    <div className="text-green-100 text-xs flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                      Online now • Replies instantly
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick messages */}
              <div className="p-3 space-y-2">
                <div className="text-xs text-gray-400 uppercase tracking-wider px-2 mb-3">
                  Quick Actions
                </div>
                {quickMessages.map((item, index) => (
                  <a
                    key={index}
                    href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(item.message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-green-500/20 border border-transparent hover:border-green-500/30 transition-all group"
                   
                   
                    onClick={() => setHasInteracted(true)}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-white group-hover:text-green-400 transition-colors text-sm font-medium">
                      {item.text}
                    </span>
                    <span className="ml-auto text-gray-500 group-hover:text-green-400 transition-colors">→</span>
                  </a>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/10">
                <div className="text-xs text-gray-500 text-center">
                  24/7 Support • Response in &lt;2 minutes
                </div>
              </div>
            </div>
          )}
        {/* Tooltip */}          {showTooltip && !isOpen && (
            <div
             
             
             
              className="absolute bottom-4 right-20 bg-black border border-green-500/30 rounded-lg px-4 py-2 whitespace-nowrap shadow-lg"
            >
              <div className="text-white text-sm font-medium">Need help? Chat with us!</div>
              <div className="text-green-400 text-xs">We reply instantly 💬</div>
              {/* Arrow */}
              <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-green-500/30"></div>
            </div>
          )}
        {/* Main button */}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasInteracted(true);
            setShowTooltip(false);
          }}
          className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg shadow-green-500/40 flex items-center justify-center group transition-transform duration-200 hover:scale-110 active:scale-95"
          aria-label={isOpen ? 'Close WhatsApp chat' : 'Chat with us on WhatsApp'}
          aria-expanded={isOpen}
        >            {isOpen ? (
              <span
                key="close"
               
               
               
                className="text-white text-2xl"
              >
                ✕
              </span>
            ) : (
              <svg
                key="whatsapp"
               
               
               
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            )}
          {/*
            REMOVED 2026-09-26: a hardcoded red "1" badge on an infinite pulse.
            No message queue exists behind this button — it opens a wa.me link —
            so the count was manufactured urgency, not information. Same class as
            the fabricated testimonials and invented stock counts already removed
            from this site.
          */}
        </button>
      </div>
    </>
  );
}

/*
 * NO ANIMATION LIBRARY — 2026-09-26.
 *
 * This component previously used `m.*` inside LazyMotion with `domAnimation`,
 * which was itself a trim from full `motion.*`. Measured across four clean
 * Lighthouse runs on 2026-09-26, that shared framer-motion chunk was still the
 * largest single script cost on the site — 87 KB and ~1,289 ms of phone CPU —
 * and it stayed on the critical path as long as ANY mounted component imported
 * it. Removing it from the navigation alone changed nothing for exactly that
 * reason, so every component that kept it loaded was converted together.
 *
 * What it animated here was hover and tap scales, opacity fades and small
 * translations. Those are now Tailwind transition/hover/active classes and the
 * shared keyframes in app/globals.css.
 *
 * Exit animations are not reproduced: AnimatePresence held elements in the DOM
 * to animate them out, and keeping them mounted works against the reason for
 * the change. Elements now leave immediately, which is ordinary behaviour.
 */
export default function WhatsAppButton(props: Parameters<typeof WhatsAppButtonInner>[0]) {
  return <WhatsAppButtonInner {...props} />;
}
