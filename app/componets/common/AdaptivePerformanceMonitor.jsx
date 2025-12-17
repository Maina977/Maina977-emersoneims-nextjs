// components/common/AdaptivePerformanceMonitor.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";

export default function AdaptivePerformanceMonitor({ onPerformanceChange }) {
  const [fps, setFps] = useState(60);
  const [performanceLevel, setPerformanceLevel] = useState("high");
  const [performanceHistory, setPerformanceHistory] = useState([]);
  const [visible, setVisible] = useState(false);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef(null);
  const samplesRef = useRef([]);

  const calculatePerformanceLevel = useCallback((currentFps) => {
    if (currentFps < 25) return "low";
    if (currentFps < 45) return "medium";
    return "high";
  }, []);

  const getPerformanceRecommendation = useCallback((level) => {
    const recommendations = {
      low: "Reduce animations or close background tabs",
      medium: "Performance is acceptable",
      high: "Optimal performance"
    };
    return recommendations[level] || recommendations.medium;
  }, []);

  const measureFPS = useCallback(() => {
    const currentTime = performance.now();
    frameCountRef.current++;

    if (currentTime - lastTimeRef.current >= 1000) {
      const currentFps = Math.round(frameCountRef.current);
      setFps(currentFps);
      
      const newLevel = calculatePerformanceLevel(currentFps);
      if (newLevel !== performanceLevel) {
        setPerformanceLevel(newLevel);
        onPerformanceChange(newLevel);
      }
      
      setPerformanceHistory(prev => {
        const updated = [...prev, { fps: currentFps, level: newLevel, timestamp: currentTime }];
        return updated.slice(-30);
      });
      
      samplesRef.current.push(currentFps);
      if (samplesRef.current.length > 10) samplesRef.current.shift();
      
      frameCountRef.current = 0;
      lastTimeRef.current = currentTime;
    }
    
    rafIdRef.current = requestAnimationFrame(measureFPS);
  }, [calculatePerformanceLevel, onPerformanceChange, performanceLevel]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      rafIdRef.current = requestAnimationFrame(measureFPS);
    }
    
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [measureFPS]);

  const getFpsColor = useCallback(() => {
    if (fps < 25) return "#ff4757";
    if (fps < 45) return "#ffa502";
    return "#2ed573";
  }, [fps]);

  const getAverageFps = useCallback(() => {
    if (samplesRef.current.length === 0) return fps;
    const sum = samplesRef.current.reduce((a, b) => a + b, 0);
    return Math.round(sum / samplesRef.current.length);
  }, [fps]);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div 
        className={`fps-monitor ${visible ? 'expanded' : ''}`}
        role="status"
        aria-live="polite"
        aria-label={`Performance: ${performanceLevel}, FPS: ${fps}`}
      >
        <button 
          className="fps-toggle"
          onClick={toggleVisibility}
          aria-label={visible ? "Hide performance monitor" : "Show performance monitor"}
        >
          {visible ? "▼" : "▲"} Performance
        </button>
        
        {visible && (
          <div className="fps-details">
            <div className="fps-display">
              <span className="fps-value" style={{ color: getFpsColor() }}>
                {fps}
              </span>
              <span className="fps-label">FPS</span>
            </div>
            
            <div className="performance-info">
              <div className="performance-level">
                <span className="level-badge" style={{ 
                  backgroundColor: performanceLevel === 'high' ? '#2ed573' : 
                                 performanceLevel === 'medium' ? '#ffa502' : '#ff4757'
                }}>
                  {performanceLevel.toUpperCase()}
                </span>
                <span className="level-text">{getPerformanceRecommendation(performanceLevel)}</span>
              </div>
              
              <div className="performance-stats">
                <div className="stat">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">{getAverageFps()} FPS</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Samples:</span>
                  <span className="stat-value">{samplesRef.current.length}</span>
                </div>
              </div>
              
              {performanceHistory.length > 5 && (
                <div className="performance-history">
                  <div className="history-label">Last 30s trend:</div>
                  <div className="history-bar">
                    {performanceHistory.slice(-10).map((point, i) => (
                      <div 
                        key={i}
                        className="history-segment"
                        style={{
                          height: `${Math.min(100, (point.fps / 60) * 100)}%`,
                          backgroundColor: calculatePerformanceLevel(point.fps) === 'high' ? '#2ed573' : 
                                         calculatePerformanceLevel(point.fps) === 'medium' ? '#ffa502' : '#ff4757'
                        }}
                        title={`${point.fps} FPS (${point.level})`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {performanceLevel === 'low' && (
        <div className="performance-warning" role="alert">
          ⚠️ Low performance detected. Some animations may be disabled.
        </div>
      )}
    </>
  );
}