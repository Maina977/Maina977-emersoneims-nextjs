'use client';

import { useState, useEffect } from 'react';

export default function SkipAnimation() {
  const [showSkip, setShowSkip] = useState(false);

  useEffect(() => {
    // Show skip button after a short delay
    const timer = setTimeout(() => {
      setShowSkip(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSkip = () => {
    // Dispatch event to skip animations
    document.dispatchEvent(new CustomEvent('skipAnimations'));
    setShowSkip(false);
  };

  if (!showSkip) return null;

  return (
    <button
      onClick={handleSkip}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-amber-500 text-black font-bold rounded hover:bg-amber-400 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
      aria-label="Skip loading animation"
    >
      Skip Animation
    </button>
  );
}




