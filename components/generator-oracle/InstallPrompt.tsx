'use client';

/**
 * InstallPrompt - Shows PWA install prompt for licensed users
 * Provides platform-specific instructions for installing the app
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissedAt = localStorage.getItem('oracle_install_dismissed');
    if (dismissedAt) {
      const dismissedTime = new Date(dismissedAt).getTime();
      const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
      if (dismissedTime > dayAgo) {
        setDismissed(true);
        return;
      }
    }

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPlatform('ios');
      setShowPrompt(true);
    } else if (/android/.test(ua)) {
      setPlatform('android');
      // Wait for beforeinstallprompt event
    } else {
      setPlatform('desktop');
      // Wait for beforeinstallprompt event
    }

    // Listen for install prompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('oracle_install_dismissed', new Date().toISOString());
  };

  // Don't show if installed, dismissed, or nothing to show
  if (isInstalled || dismissed || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:bottom-4 sm:left-4 sm:right-auto sm:w-96"
      >
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl shadow-cyan-500/10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <span className="text-2xl">🔮</span>
              </div>
              <div>
                <h3 className="text-white font-bold">Install Generator Oracle</h3>
                <p className="text-slate-400 text-sm">Works offline, faster access</p>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-slate-400 hover:text-white p-1 transition-colors"
              aria-label="Dismiss"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Platform-specific instructions */}
          {platform === 'ios' ? (
            <div className="space-y-3">
              <p className="text-slate-300 text-sm">
                Install this app on your iPhone for offline access:
              </p>
              <ol className="space-y-2 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">1</span>
                  Tap the <span className="text-blue-400 font-medium">Share</span> button <span className="text-blue-400">⎙</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">2</span>
                  Scroll down and tap <span className="text-blue-400 font-medium">"Add to Home Screen"</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">3</span>
                  Tap <span className="text-blue-400 font-medium">"Add"</span> to install
                </li>
              </ol>
              <button
                onClick={handleDismiss}
                className="w-full py-2 mt-2 text-slate-400 text-sm hover:text-white transition-colors"
              >
                Got it, thanks
              </button>
            </div>
          ) : platform === 'android' || platform === 'desktop' ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Install App
                  </button>
                ) : (
                  <div className="flex-1 py-3 bg-slate-700 text-slate-400 rounded-xl text-center text-sm">
                    Installation not available
                  </div>
                )}
              </div>
              <p className="text-slate-500 text-xs text-center">
                Installs instantly • No app store needed • Works offline
              </p>
            </div>
          ) : (
            <button
              onClick={handleDismiss}
              className="w-full py-2 text-slate-400 text-sm hover:text-white transition-colors"
            >
              Maybe later
            </button>
          )}

          {/* Benefits */}
          <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-lg">📴</span>
              <div className="text-xs text-slate-400">Offline</div>
            </div>
            <div>
              <span className="text-lg">⚡</span>
              <div className="text-xs text-slate-400">Faster</div>
            </div>
            <div>
              <span className="text-lg">📱</span>
              <div className="text-xs text-slate-400">Native Feel</div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
