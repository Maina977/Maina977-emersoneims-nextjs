'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Cookie Consent Banner - GDPR Compliance
 * Shows on first visit, stores preference in localStorage
 */
export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after 2 seconds
      setTimeout(() => setShowBanner(true), 2000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
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
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    
    // Disable analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-gray-900 to-black border-t border-cyan-500/30 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🍪</div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">
                  Cookie & Privacy Notice
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
                  We use essential cookies to ensure our website works properly and analytics cookies to understand how you interact with it. 
                  Your data is processed securely and never shared with third parties. 
                  <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 ml-1 underline">
                    Learn more in our Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={acceptCookies}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm whitespace-nowrap"
              aria-label="Accept cookies"
            >
              Accept All
            </button>
            <button
              onClick={declineCookies}
              className="px-6 py-2.5 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors text-sm whitespace-nowrap"
              aria-label="Decline optional cookies"
            >
              Essential Only
            </button>
            <button
              onClick={declineCookies}
              className="p-2.5 text-gray-400 hover:text-white transition-colors"
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
