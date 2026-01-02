'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface OptimizedMicroInteractionsProps {
  intensity?: 'low' | 'high';
  theme?: 'engineering' | 'high-contrast';
}

/**
 * OPTIMIZED MICRO INTERACTIONS - Performance Enhanced
 * Reduced DOM manipulation, uses CSS animations, throttled events
 */
export default function OptimizedMicroInteractions({ 
  intensity = 'low', // Default to low for performance
  theme = 'engineering'
}: OptimizedMicroInteractionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const lastTrailTime = useRef(0);
  const trailThrottle = 50; // ms between trail elements

  // Delay enabling for faster initial load
  useEffect(() => {
    const timer = setTimeout(() => setIsEnabled(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Throttled trail creator
  const createTrail = useCallback((x: number, y: number) => {
    if (!containerRef.current || intensity === 'low') return;
    
    const now = Date.now();
    if (now - lastTrailTime.current < trailThrottle) return;
    lastTrailTime.current = now;
    
    const trail = document.createElement('div');
    trail.className = 'cursor-trail-opt';
    trail.style.cssText = `left:${x}px;top:${y}px`;
    containerRef.current.appendChild(trail);
    
    // Remove after animation
    setTimeout(() => trail.remove(), 400);
  }, [intensity]);

  useEffect(() => {
    if (!isEnabled || intensity === 'low' || !containerRef.current) return;

    // Use passive event listeners
    const handleMouseMove = (e: MouseEvent) => {
      createTrail(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isEnabled, intensity, createTrail]);

  if (!isEnabled) return null;

  const trailColor = theme === 'high-contrast' 
    ? 'rgba(255, 255, 255, 0.4)' 
    : 'rgba(255, 183, 3, 0.3)';

  return (
    <>
      <div 
        ref={containerRef} 
        className="micro-interactions-container-opt"
        aria-hidden="true"
      />
      <style jsx global>{`
        .micro-interactions-container-opt {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          overflow: hidden;
        }
        
        .cursor-trail-opt {
          position: fixed;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${trailColor};
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: trailFadeOpt 0.4s ease-out forwards;
          will-change: opacity, transform;
        }
        
        @keyframes trailFadeOpt {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        }
      `}</style>
    </>
  );
}
