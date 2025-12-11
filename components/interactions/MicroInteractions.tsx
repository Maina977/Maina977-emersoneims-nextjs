'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface MicroInteractionsProps {
  intensity?: 'low' | 'high';
  theme?: 'engineering' | 'high-contrast';
}

export default function MicroInteractions({ 
  intensity = 'high',
  theme = 'engineering'
}: MicroInteractionsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (intensity === 'low' || !containerRef.current) return;

    const container = containerRef.current;
    
    // Add cursor trail effect
    const handleMouseMove = (e: MouseEvent) => {
      const trail = document.createElement('div');
      trail.className = 'cursor-trail';
      trail.style.left = `${e.clientX}px`;
      trail.style.top = `${e.clientY}px`;
      container.appendChild(trail);

      setTimeout(() => {
        trail.remove();
      }, 500);
    };

    // Add ripple effect on click
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      container.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [intensity]);

  return (
    <>
      <div ref={containerRef} className="micro-interactions-container" />
      <style jsx global>{`
        .micro-interactions-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
        }

        .cursor-trail {
          position: fixed;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: ${theme === 'high-contrast' 
            ? 'rgba(255, 255, 255, 0.5)' 
            : 'rgba(255, 183, 3, 0.4)'};
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: fadeOut 0.5s ease-out forwards;
        }

        .ripple-effect {
          position: fixed;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid ${theme === 'high-contrast' 
            ? 'rgba(255, 255, 255, 0.6)' 
            : 'rgba(255, 183, 3, 0.6)'};
          pointer-events: none;
          transform: translate(-50%, -50%);
          animation: ripple 0.6s ease-out forwards;
        }

        @keyframes fadeOut {
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
        }

        @keyframes ripple {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
          }
        }

        /* Magnetic effect for buttons */
        [data-magnetic="true"] {
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }

        [data-magnetic="true"]:hover {
          transform: scale(1.05);
        }

        /* Cursor effect for action elements */
        [data-cursor="action"] {
          cursor: pointer;
        }

        [data-cursor="action"]:hover {
          cursor: grab;
        }

        [data-cursor="action"]:active {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}




