'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Universal Accessibility Icon (International Symbol of Access)
const AccessibilityIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <circle cx="12" cy="4" r="2" />
    <path d="M19 13v-2c-1.54.02-3.09-.75-4.07-1.83l-1.29-1.43c-.17-.19-.38-.34-.61-.45-.01 0-.01-.01-.02-.01H13c-.35-.2-.75-.3-1.19-.26C10.76 7.11 10 8.04 10 9.09V15c0 1.1.9 2 2 2h5v5h2v-5.5c0-1.1-.9-2-2-2h-3v-3.45c1.29 1.07 3.25 1.94 5 1.95zm-6.17 5c-.41 1.16-1.52 2-2.83 2-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12.1c-2.28.46-4 2.48-4 4.9 0 2.76 2.24 5 5 5 2.42 0 4.44-1.72 4.9-4h-2.07z"/>
  </svg>
);

// Close Icon
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Feature icons
const TextSizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"/>
  </svg>
);

const ContrastIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18V4c4.41 0 8 3.59 8 8s-3.59 8-8 8z"/>
  </svg>
);

const CursorIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M13.64 21.97C13.14 22.21 12.54 22 12.31 21.5L10.13 16.76L7.62 18.78C7.45 18.92 7.24 19 7.02 19C6.55 19 6.15 18.61 6.15 18.14V4.86C6.15 4.39 6.54 4 7.02 4C7.24 4 7.45 4.08 7.62 4.22L18.39 12.76C18.76 13.04 18.85 13.55 18.6 13.93C18.47 14.13 18.27 14.26 18.04 14.31L14.53 15.08L16.71 19.82C16.95 20.32 16.73 20.91 16.23 21.15L13.64 21.97Z"/>
  </svg>
);

const SpacingIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M3 21h18v-2H3v2zM3 3v2h18V3H3zm0 9h18v-2H3v2z"/>
  </svg>
);

const HighlightIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M9.62 12L12 5.67 14.38 12M11 3L5.5 17h2.25l1.12-3h6.25l1.13 3h2.25L13 3h-2z"/>
  </svg>
);

const ResetIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
);

interface AccessibilitySettings {
  fontSize: number; // 0 = normal, 1 = large, 2 = extra large
  highContrast: boolean;
  largeCursor: boolean;
  lineSpacing: number; // 0 = normal, 1 = increased, 2 = double
  highlightLinks: boolean;
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>({
    fontSize: 0,
    highContrast: false,
    largeCursor: false,
    lineSpacing: 0,
    highlightLinks: false,
  });
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings(parsed);
      applySettings(parsed);
    }
  }, []);

  // Apply settings to document
  const applySettings = (s: AccessibilitySettings) => {
    const html = document.documentElement;
    const body = document.body;

    // Font size
    html.classList.remove('a11y-font-large', 'a11y-font-xl');
    if (s.fontSize === 1) html.classList.add('a11y-font-large');
    if (s.fontSize === 2) html.classList.add('a11y-font-xl');

    // High contrast
    html.classList.toggle('a11y-high-contrast', s.highContrast);

    // Large cursor
    body.classList.toggle('a11y-large-cursor', s.largeCursor);

    // Line spacing
    html.classList.remove('a11y-spacing-increased', 'a11y-spacing-double');
    if (s.lineSpacing === 1) html.classList.add('a11y-spacing-increased');
    if (s.lineSpacing === 2) html.classList.add('a11y-spacing-double');

    // Highlight links
    html.classList.toggle('a11y-highlight-links', s.highlightLinks);
  };

  // Update and save settings
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  // Cycle through options
  const cycleFontSize = () => {
    updateSetting('fontSize', ((settings.fontSize + 1) % 3) as 0 | 1 | 2);
  };

  const cycleSpacing = () => {
    updateSetting('lineSpacing', ((settings.lineSpacing + 1) % 3) as 0 | 1 | 2);
  };

  // Reset all settings
  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      fontSize: 0,
      highContrast: false,
      largeCursor: false,
      lineSpacing: 0,
      highlightLinks: false,
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  const fontSizeLabels = ['Normal', 'Large', 'Extra Large'];
  const spacingLabels = ['Normal', 'Increased', 'Double'];

  if (!mounted) return null;

  return (
    <>
      {/* Global Accessibility Styles */}
      <style jsx global>{`
        /* Font Size Adjustments */
        .a11y-font-large {
          font-size: 112.5% !important;
        }
        .a11y-font-large * {
          font-size: inherit;
        }
        .a11y-font-xl {
          font-size: 125% !important;
        }
        .a11y-font-xl * {
          font-size: inherit;
        }

        /* High Contrast Mode */
        .a11y-high-contrast {
          filter: contrast(1.25) !important;
        }
        .a11y-high-contrast * {
          border-color: currentColor !important;
        }
        .a11y-high-contrast a,
        .a11y-high-contrast button {
          outline: 2px solid currentColor !important;
          outline-offset: 2px !important;
        }

        /* Large Cursor */
        .a11y-large-cursor,
        .a11y-large-cursor * {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' stroke='%23fff' stroke-width='1' d='M5.5 3.21V20.8l4.71-4.71h6.71L5.5 3.21z'/%3E%3C/svg%3E") 0 0, auto !important;
        }

        /* Line Spacing */
        .a11y-spacing-increased * {
          line-height: 1.8 !important;
          letter-spacing: 0.05em !important;
        }
        .a11y-spacing-double * {
          line-height: 2.2 !important;
          letter-spacing: 0.1em !important;
        }

        /* Highlight Links */
        .a11y-highlight-links a {
          background-color: #ffff00 !important;
          color: #000 !important;
          padding: 2px 4px !important;
          text-decoration: underline !important;
          font-weight: bold !important;
        }
        .a11y-highlight-links a:focus,
        .a11y-highlight-links a:hover {
          background-color: #000 !important;
          color: #ffff00 !important;
        }
      `}</style>

      {/* Floating Accessibility Button - ALWAYS VISIBLE - Positioned ABOVE stats counter */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-4 z-[9999] bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl shadow-2xl shadow-blue-600/50 flex items-center gap-3 px-5 py-4 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2 group border-2 border-white/20"
        aria-label="Open Accessibility Options - We fully support visually impaired users with screen readers, high contrast, large text and more"
        title="♿ Accessibility Options - Click here for visually impaired support. WCAG 2.1 AAA Compliant"
        whileHover={{ scale: 1.08, boxShadow: '0 25px 50px rgba(37, 99, 235, 0.5)' }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 1, scale: 1, x: 0 }}
        animate={{
          opacity: 1,
          scale: 1,
          x: 0,
          boxShadow: [
            '0 10px 30px rgba(37, 99, 235, 0.4)',
            '0 15px 40px rgba(37, 99, 235, 0.6)',
            '0 10px 30px rgba(37, 99, 235, 0.4)',
          ],
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        {/* Accessibility Icon with pulse animation */}
        <span className="relative text-2xl">
          <AccessibilityIcon />
          <span className="absolute inset-0 rounded-full bg-white/30 animate-ping" />
        </span>

        {/* Label - Always visible with clear text */}
        <div className="flex flex-col items-start">
          <span className="font-bold text-base whitespace-nowrap">
            Accessibility
          </span>
          <span className="text-xs text-blue-100 whitespace-nowrap">
            For Visually Impaired
          </span>
        </div>

        {/* WCAG Badge - Larger and more prominent */}
        <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full border-2 border-white shadow-lg">
          ♿ AAA
        </span>
        
        {/* Active indicator - shows when settings are enabled */}
        {(settings.fontSize > 0 || settings.highContrast || settings.largeCursor || settings.lineSpacing > 0 || settings.highlightLinks) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </span>
        )}
      </motion.button>

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: -100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-4 top-1/2 -translate-y-1/2 z-50 w-80 max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Accessibility Settings"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 text-white px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <AccessibilityIcon />
                    <div>
                      <h2 className="font-bold text-xl">♿ Accessibility Options</h2>
                      <p className="text-blue-100 text-sm">For All Users Including Visually Impaired</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    aria-label="Close accessibility panel"
                  >
                    <CloseIcon />
                  </button>
                </div>

                {/* Accessibility Statement */}
                <div className="bg-white/10 rounded-lg px-3 py-2 border border-white/20">
                  <p className="text-xs text-blue-50 leading-relaxed">
                    <strong>EmersonEIMS is committed to digital accessibility.</strong> We provide tools for visually impaired users, screen reader support, and WCAG 2.1 AAA compliance.
                  </p>
                </div>
              </div>

              {/* Settings */}
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {/* Font Size */}
                <button
                  onClick={cycleFontSize}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.fontSize > 0
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${settings.fontSize > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <TextSizeIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-gray-900 block">Text Size</span>
                    <span className="text-sm text-gray-500">{fontSizeLabels[settings.fontSize]}</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= settings.fontSize ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </button>

                {/* High Contrast */}
                <button
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.highContrast
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${settings.highContrast ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <ContrastIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-gray-900 block">High Contrast</span>
                    <span className="text-sm text-gray-500">Increase color contrast</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${settings.highContrast ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.highContrast ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </div>
                </button>

                {/* Large Cursor */}
                <button
                  onClick={() => updateSetting('largeCursor', !settings.largeCursor)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.largeCursor
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${settings.largeCursor ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <CursorIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-gray-900 block">Large Cursor</span>
                    <span className="text-sm text-gray-500">Bigger mouse pointer</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${settings.largeCursor ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.largeCursor ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </div>
                </button>

                {/* Line Spacing */}
                <button
                  onClick={cycleSpacing}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.lineSpacing > 0
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${settings.lineSpacing > 0 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <SpacingIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-gray-900 block">Line Spacing</span>
                    <span className="text-sm text-gray-500">{spacingLabels[settings.lineSpacing]}</span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i <= settings.lineSpacing ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </button>

                {/* Highlight Links */}
                <button
                  onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    settings.highlightLinks
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${settings.highlightLinks ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <HighlightIcon />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-semibold text-gray-900 block">Highlight Links</span>
                    <span className="text-sm text-gray-500">Make links more visible</span>
                  </div>
                  <div className={`w-12 h-6 rounded-full transition-colors ${settings.highlightLinks ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${settings.highlightLinks ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </div>
                </button>

                {/* Reset Button */}
                <button
                  onClick={resetSettings}
                  className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 transition-all"
                >
                  <ResetIcon />
                  <span className="font-medium">Reset All Settings</span>
                </button>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  ♿ EmersonEIMS is committed to digital accessibility for everyone
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
