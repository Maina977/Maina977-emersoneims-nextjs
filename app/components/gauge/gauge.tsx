export default function Gauge({ label, value, max, color }: { label: string; value: number; max: number; color?: string }) {
    const percentage = (value / max) * 100;
  
    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="#333"
            strokeWidth="12"
            fill="none"
          />
  
          {/* Safe zone (green) */}
          <path
            d="M10,190 A90,90 0 0,1 100,10"
            stroke="green"
            strokeWidth="12"
            fill="none"
            className="glow-green"
          />
  
          {/* Caution zone (yellow) */}
          <path
            d="M100,10 A90,90 0 0,1 190,10"
            stroke="yellow"
            strokeWidth="12"
            fill="none"
            className="glow-yellow"
          />
  
          {/* Danger zone (red) */}
          <path
            d="M190,10 A90,90 0 0,1 190,190"
            stroke="red"
            strokeWidth="12"
            fill="none"
            className="glow-red"
          />
  
          {/* Dynamic gauge arc */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${percentage * 5.65} 565`}
            transform="rotate(-90 100 100)"
          />
        </svg>
  
        <span className="text-sm text-gray-200 mt-2">
          {label}: {value}/{max}
        </span>
      </div>
    );
  }
  