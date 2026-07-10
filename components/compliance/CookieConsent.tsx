'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Cookie Consent Banner - GDPR Compliance
 * Shows on first visit, stores preference in localStorage.
 *
 * IMPORTANT: every localStorage access is wrapped. Edge's Tracking Prevention
 * (and Firefox/Brave strict modes, private windows with storage blocked, etc.)
 * makes even *reading* `localStorage` throw a SecurityError. Because this banner
 * is mounted site-wide, an unguarded access here threw inside a passive effect
 * and took the WHOLE page down via the error boundary ("Oops! Error"). Guard
 * everything so blocked storage degrades to "banner just shows" instead of a crash.
 */
function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* storage blocked — ignore */ }
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = safeGet('cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      const t = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(t);
    }
  }, []);

  const acceptCookies = () => {
    safeSet('cookie-consent', 'accepted');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    // Initialize analytics after consent
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied', // We don't use ads
      });
    }
  };

  const declineCookies = () => {
    safeSet('cookie-consent', 'essential');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    // Disable analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  const rejectAllCookies = () => {
    safeSet('cookie-consent', 'rejected');
    safeSet('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    // Optionally clear all non-essential cookies here if needed
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
    // Optionally, clear other cookies/localStorage here
  };

  if (!showBanner) return null;

  // Mobile UX audit 2026-07-10: on a 390px phone this banner rendered 326px
  // tall -- with the floating accessibility button it covered 54% of every
  // first-time visitor's screen. Phones now get a compact single-line notice
  // with the same three GDPR choices; the full copy appears from md: up.
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 bg-gradient-to-r from-gray-900 to-black border-t border-cyan-500/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 md:gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="hidden md:block text-2xl">🍪</div>
              <div>
                <h3 className="hidden md:block text-white font-semibold text-lg mb-1">
                  Cookie & Privacy Notice
                </h3>
                <p className="text-gray-300 text-xs md:text-sm leading-snug md:leading-relaxed max-w-3xl">
                  <span className="md:hidden">We use essential and analytics cookies; data stays private. </span>
                  <span className="hidden md:inline">
                    We use essential cookies to ensure our website works properly and analytics cookies to understand how you interact with it.
                    Your data is processed securely and never shared with third parties.{' '}
                  </span>
                  <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <button
              onClick={acceptCookies}
              className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-2.5 bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-xs md:text-sm whitespace-nowrap"
              aria-label="Accept cookies"
            >
              Accept All
            </button>
            <button
              onClick={declineCookies}
              className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-xs md:text-sm whitespace-nowrap"
              aria-label="Allow only essential cookies"
            >
              Essential Only
            </button>
            <button
              onClick={rejectAllCookies}
              className="flex-1 md:flex-none px-3 py-2 md:px-6 md:py-2.5 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition-colors text-xs md:text-sm whitespace-nowrap"
              aria-label="Reject all cookies"
            >
              Reject All
            </button>
            <button
              onClick={declineCookies}
              className="hidden md:block p-2.5 text-gray-400 hover:text-white transition-colors"
              aria-label="Close cookie notice"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
