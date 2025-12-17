'use client';

/**
 * HIGH CONTRAST MODE
 * Accessibility feature for better visibility
 */

import { useState, useEffect } from 'react';

export default function HighContrastMode() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('highContrast');
    if (saved === 'true') {
      setIsEnabled(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    localStorage.setItem('highContrast', newState.toString());
    
    if (newState) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <button
      onClick={toggle}
      className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-gray-900 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-gray-800 transition-all border border-gray-700"
      aria-label="Toggle high contrast mode"
      title="High Contrast Mode"
    >
      {isEnabled ? '🔆' : '🌓'}
    </button>
  );
}




