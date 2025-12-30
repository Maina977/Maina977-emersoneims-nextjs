'use client';

export default function RadarScope({ size = 400, sweepSpeed = 0.024, blipCount = 10 }) {
  void sweepSpeed;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="radar-scope">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 10} fill="none" stroke="#0f0" strokeWidth="2" />
        <circle cx={size / 2} cy={size / 2} r={size / 3} fill="none" stroke="#0f0" strokeWidth="1" opacity="0.5" />
        <circle cx={size / 2} cy={size / 2} r={size / 6} fill="none" stroke="#0f0" strokeWidth="1" opacity="0.5" />
        <line x1={size / 2} y1={size / 2} x2={size / 2} y2="0" stroke="#0f0" strokeWidth="1" />
        <line x1={size / 2} y1={size / 2} x2={size} y2={size / 2} stroke="#0f0" strokeWidth="1" />
        {/* Blips */}
        {Array.from({ length: blipCount }).map((_, i) => {
          const angle = (i / blipCount) * Math.PI * 2;
          const radius = (size / 2 - 20) * (0.3 + Math.random() * 0.7);
          const x = size / 2 + Math.cos(angle) * radius;
          const y = size / 2 + Math.sin(angle) * radius;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill="#0f0" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}


