'use client';

import { motion } from 'framer-motion';

interface MetricGaugeProps {
  value: number;
  max: number;
  label: string;
  unit?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  warningThreshold?: number;
  criticalThreshold?: number;
}

export default function MetricGauge({
  value,
  max,
  label,
  unit = '',
  color = '#06B6D4',
  size = 'md',
  showPercentage = false,
  warningThreshold,
  criticalThreshold
}: MetricGaugeProps) {
  const percentage = Math.min(100, (value / max) * 100);

  // Determine color based on thresholds
  let displayColor = color;
  if (criticalThreshold && percentage >= criticalThreshold) {
    displayColor = '#EF4444'; // Red
  } else if (warningThreshold && percentage >= warningThreshold) {
    displayColor = '#F59E0B'; // Amber
  }

  const sizes = {
    sm: { width: 80, strokeWidth: 6, fontSize: 'text-sm', labelSize: 'text-xs' },
    md: { width: 120, strokeWidth: 8, fontSize: 'text-xl', labelSize: 'text-sm' },
    lg: { width: 160, strokeWidth: 10, fontSize: 'text-2xl', labelSize: 'text-base' }
  };

  const { width, strokeWidth, fontSize, labelSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={width}
          height={width}
        >
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-slate-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={displayColor}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${displayColor}40)`
            }}
          />
        </svg>

        {/* Center value */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-bold font-mono ${fontSize}`}
            style={{ color: displayColor }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {showPercentage ? `${percentage.toFixed(0)}%` : value.toLocaleString()}
          </motion.span>
          {unit && !showPercentage && (
            <span className={`text-slate-400 ${labelSize}`}>{unit}</span>
          )}
        </div>

        {/* Tick marks */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 bg-slate-600"
            style={{
              height: size === 'lg' ? 8 : size === 'md' ? 6 : 4,
              left: '50%',
              top: 2,
              transformOrigin: `0 ${width / 2 - 2}px`,
              transform: `translateX(-50%) rotate(${i * 30}deg)`
            }}
          />
        ))}
      </div>

      {/* Label */}
      <span className={`mt-2 text-slate-300 ${labelSize} text-center`}>
        {label}
      </span>
    </div>
  );
}
