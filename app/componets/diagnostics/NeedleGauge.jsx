'use client';

export default function NeedleGauge({ label, value, max, color = 'white' }) {
  const angle = (value / max) * 180 - 90; // Map value to -90° to +90°

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        {/* Gauge arc */}
        <path
          d="M10,90 A70,70 0 0,1 150,90"
          stroke="#333"
          strokeWidth="8"
          fill="none"
        />
        {/* Needle */}
        <line
          x1="80"
          y1="90"
          x2={80 + 70 * Math.cos((angle * Math.PI) / 180)}
          y2={90 + 70 * Math.sin((angle * Math.PI) / 180)}
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
        {/* Center pivot */}
        <circle cx="80" cy="90" r="6" fill={color} />
      </svg>
      <span className="text-sm text-gray-200 mt-1">
        {label}: {value}/{max}
      </span>
    </div>
  );
}
