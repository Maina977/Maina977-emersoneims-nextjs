'use client';

import React, { useEffect, useState } from "react";

/**
 * AdaptivePerformanceMonitor - Monitors FPS and adjusts performance tier
 * @param {Object} props
 * @param {Function} props.onPerformanceChange - Callback with 'low', 'medium', or 'high'
 */
export default function AdaptivePerformanceMonitor({ onPerformanceChange }) {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let rafId;
    let timeoutId;

    const measure = () => {
      const now = performance.now();
      const delta = now - lastTime;
      
      if (delta >= 1000) {
        const currentFps = Math.round((frameCount * 1000) / delta);
        setFps(currentFps);
        
        if (currentFps < 30) onPerformanceChange("low");
        else if (currentFps < 50) onPerformanceChange("medium");
        else onPerformanceChange("high");
        
        frameCount = 0;
        lastTime = now;
      }
      
      frameCount++;
      rafId = requestAnimationFrame(measure);
    };

    rafId = requestAnimationFrame(measure);
    
    return () => {
      cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onPerformanceChange]);

  return (
    <div className="fps-monitor" aria-label={`Frames per second: ${fps}`}>
      FPS: {fps}
    </div>
  );
}















