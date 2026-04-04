'use client';

import React from 'react';

interface ProbabilityGaugeProps {
  probability: number;
  size?: number;
}

export const ProbabilityGauge: React.FC<ProbabilityGaugeProps> = ({ probability, size = 120 }) => {
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - probability);
  
  const getColor = () => {
    if (probability > 0.7) return '#4CAF50';
    if (probability > 0.4) return '#FFC107';
    return '#F44336';
  };

  return (
    <div className="gauge-container">
      <svg width={size} height={size}>
        <circle
          cx={radius}
          cy={radius}
          r={radius - 10}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="10"
        />
        <circle
          cx={radius}
          cy={radius}
          r={radius - 10}
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x={radius}
          y={radius + 5}
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill="#333"
        >
          {(probability * 100).toFixed(0)}%
        </text>
      </svg>
    </div>
  );
};