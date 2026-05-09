'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

/**
 * PWA Install Prompt Component
 * Prompts users to install the app for offline access
 * Shows only on supported browsers and after user engagement
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if user dismissed prompt before
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 30) {
        return; // Don't show again for 30 days
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Show prompt after 30 seconds of engagement
      setTimeout(() => {
        setShowPrompt(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="bg-gradient-to-br from-gray-900 to-black border border-cyan-500/30 rounded-lg shadow-2xl p-6 backdrop-blur-sm">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Dismiss install prompt"
        >
          <X size={20} />
        </button>

        <div className="flex items-start gap-4">
          <div className="text-4xl">⚡</div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-lg mb-2">
              Install EmersonEIMS
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get instant access, offline support, and faster load times. Works like a native app!
            </p>
            
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-cyan-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity text-sm"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
              >
                Not Now
              </button>
            </div>

            <div className="mt-4 flex gap-4 text-xs text-gray-500">
              <span>📱 Works Offline</span>
              <span>⚡ Faster Load</span>
              <span>🔔 Push Alerts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
