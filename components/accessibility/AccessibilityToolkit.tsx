/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMERSONEIMS ACCESSIBILITY TOOLKIT
 * World-Class Accessibility for ALL Users Including Visually Impaired
 * 
 * Features:
 * - Screen Reader Announcements
 * - High Contrast Mode
 * - Text Size Controls
 * - Keyboard Navigation Helpers
 * - Focus Management
 * - Voice Feedback
 * - Reduced Motion Support
 * 
 * "Power for Everyone" - EmersonEIMS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Accessibility Settings Interface
interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReaderMode: boolean;
  focusHighlight: boolean;
  textToSpeech: boolean;
  fontSize: number; // 1 = normal, 1.25 = large, 1.5 = extra large
  cursorSize: 'normal' | 'large' | 'extra-large';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  speak: (text: string) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reducedMotion: false,
  screenReaderMode: false,
  focusHighlight: true,
  textToSpeech: false,
  fontSize: 1,
  cursorSize: 'normal',
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('emersoneims-accessibility');
    if (saved) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load accessibility settings:', e);
      }
    }

    // Check system preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      setSettings(prev => ({ ...prev, highContrast: true }));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('emersoneims-accessibility', JSON.stringify(settings));
    }
  }, [settings, mounted]);

  // Apply settings to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    
    // High Contrast
    root.classList.toggle('high-contrast', settings.highContrast);
    
    // Large Text
    root.classList.toggle('large-text', settings.largeText);
    root.style.fontSize = `${settings.fontSize * 100}%`;
    
    // Reduced Motion
    root.classList.toggle('reduce-motion', settings.reducedMotion);
    
    // Focus Highlight
    root.classList.toggle('enhanced-focus', settings.focusHighlight);
    
    // Screen Reader Mode
    root.classList.toggle('screen-reader-mode', settings.screenReaderMode);
    
    // Cursor Size
    root.setAttribute('data-cursor-size', settings.cursorSize);
    
  }, [settings, mounted]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  // Screen reader announcement
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById(`aria-${priority}`);
    if (announcer) {
      announcer.textContent = '';
      setTimeout(() => {
        announcer.textContent = message;
      }, 100);
    }
  }, []);

  // Text-to-speech
  const speak = useCallback((text: string) => {
    if (settings.textToSpeech && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [settings.textToSpeech]);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('emersoneims-accessibility');
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSetting, announce, speak, resetSettings }}>
      {/* Live Regions for Screen Reader Announcements */}
      <div 
        id="aria-polite" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      />
      <div 
        id="aria-assertive" 
        aria-live="assertive" 
        aria-atomic="true" 
        className="sr-only"
      />
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Accessibility Control Panel - Floating Widget
 */
export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSetting, announce, resetSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    announce(isOpen ? 'Accessibility panel closed' : 'Accessibility panel opened');
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={togglePanel}
        className={`
          fixed bottom-24 left-4 z-50 p-4 rounded-full
          bg-gradient-to-r from-blue-600 to-blue-700
          text-white shadow-lg hover:shadow-xl
          transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-offset-2
          ${isOpen ? 'scale-90' : 'hover:scale-110'}
        `}
        aria-label="Open accessibility settings"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Accessibility Settings"
          className={`
            fixed bottom-40 left-4 z-50 w-80 max-h-[70vh] overflow-y-auto
            rounded-2xl shadow-2xl
            ${settings.highContrast 
              ? 'bg-black border-4 border-yellow-400 text-yellow-400' 
              : 'bg-gray-900 border border-gray-700 text-white'
            }
          `}
        >
          {/* Header */}
          <div className={`p-4 border-b ${settings.highContrast ? 'border-yellow-400' : 'border-gray-700'}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span>♿</span> Accessibility
              </h2>
              <button
                onClick={togglePanel}
                className="p-2 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Close accessibility panel"
              >
                ✕
              </button>
            </div>
            <p className={`text-sm mt-1 ${settings.highContrast ? 'text-yellow-300' : 'text-gray-400'}`}>
              Power for Everyone 🇰🇪
            </p>
          </div>

          {/* Settings */}
          <div className="p-4 space-y-4">
            {/* High Contrast */}
            <AccessibilityToggle
              label="High Contrast"
              description="Increases color contrast for better visibility"
              icon="🎨"
              checked={settings.highContrast}
              onChange={(v) => {
                updateSetting('highContrast', v);
                announce(v ? 'High contrast mode enabled' : 'High contrast mode disabled');
              }}
            />

            {/* Large Text */}
            <AccessibilityToggle
              label="Large Text"
              description="Increases text size across the site"
              icon="🔤"
              checked={settings.largeText}
              onChange={(v) => {
                updateSetting('largeText', v);
                updateSetting('fontSize', v ? 1.25 : 1);
                announce(v ? 'Large text enabled' : 'Large text disabled');
              }}
            />

            {/* Text Size Slider */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <span>📏</span> Text Size: {Math.round(settings.fontSize * 100)}%
              </label>
              <input
                type="range"
                min="0.8"
                max="2"
                step="0.1"
                value={settings.fontSize}
                onChange={(e) => updateSetting('fontSize', parseFloat(e.target.value))}
                className="w-full accent-amber-500"
                aria-label="Adjust text size"
              />
            </div>

            {/* Reduced Motion */}
            <AccessibilityToggle
              label="Reduce Motion"
              description="Minimizes animations and movement"
              icon="🎬"
              checked={settings.reducedMotion}
              onChange={(v) => {
                updateSetting('reducedMotion', v);
                announce(v ? 'Reduced motion enabled' : 'Reduced motion disabled');
              }}
            />

            {/* Focus Highlight */}
            <AccessibilityToggle
              label="Enhanced Focus"
              description="Shows clear focus indicators when navigating"
              icon="🎯"
              checked={settings.focusHighlight}
              onChange={(v) => {
                updateSetting('focusHighlight', v);
                announce(v ? 'Enhanced focus enabled' : 'Enhanced focus disabled');
              }}
            />

            {/* Text to Speech */}
            <AccessibilityToggle
              label="Text to Speech"
              description="Reads content aloud when hovering"
              icon="🔊"
              checked={settings.textToSpeech}
              onChange={(v) => {
                updateSetting('textToSpeech', v);
                announce(v ? 'Text to speech enabled' : 'Text to speech disabled');
              }}
            />

            {/* Screen Reader Mode */}
            <AccessibilityToggle
              label="Screen Reader Mode"
              description="Optimizes layout for screen readers"
              icon="👁️"
              checked={settings.screenReaderMode}
              onChange={(v) => {
                updateSetting('screenReaderMode', v);
                announce(v ? 'Screen reader mode enabled' : 'Screen reader mode disabled');
              }}
            />

            {/* Cursor Size */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium">
                <span>🖱️</span> Cursor Size
              </label>
              <select
                value={settings.cursorSize}
                onChange={(e) => updateSetting('cursorSize', e.target.value as 'normal' | 'large' | 'extra-large')}
                className={`
                  w-full p-2 rounded-lg
                  ${settings.highContrast 
                    ? 'bg-black border-2 border-yellow-400 text-yellow-400' 
                    : 'bg-gray-800 border border-gray-600 text-white'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-400
                `}
                aria-label="Select cursor size"
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="extra-large">Extra Large</option>
              </select>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                resetSettings();
                announce('Accessibility settings reset to defaults');
              }}
              className={`
                w-full p-3 rounded-lg font-medium
                ${settings.highContrast
                  ? 'bg-yellow-400 text-black hover:bg-yellow-300'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
                }
                transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
            >
              🔄 Reset to Defaults
            </button>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t ${settings.highContrast ? 'border-yellow-400' : 'border-gray-700'}`}>
            <p className={`text-xs ${settings.highContrast ? 'text-yellow-300' : 'text-gray-500'}`}>
              Keyboard: Press <kbd className="px-1 py-0.5 bg-white/10 rounded">Alt + A</kbd> to open this panel
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Toggle Component
const AccessibilityToggle: React.FC<{
  label: string;
  description: string;
  icon: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}> = ({ label, description, icon, checked, onChange }) => {
  const { settings } = useAccessibility();
  
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl mt-0.5">{icon}</span>
      <div className="flex-1">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium">{label}</span>
          <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`
              relative w-12 h-6 rounded-full transition-colors
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
              ${checked 
                ? settings.highContrast ? 'bg-yellow-400' : 'bg-amber-500'
                : settings.highContrast ? 'bg-gray-600' : 'bg-gray-600'
              }
            `}
          >
            <span
              className={`
                absolute top-1 w-4 h-4 rounded-full transition-transform
                ${checked ? 'translate-x-7' : 'translate-x-1'}
                ${settings.highContrast ? 'bg-black' : 'bg-white'}
              `}
            />
          </button>
        </label>
        <p className={`text-xs mt-0.5 ${settings.highContrast ? 'text-yellow-300' : 'text-gray-500'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AccessibilityProvider;
