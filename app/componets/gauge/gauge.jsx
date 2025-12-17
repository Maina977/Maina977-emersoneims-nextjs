export default function Gauge({ label, value, max, color }) {
    const percentage = (value / max) * 100;
    return (
      <div className="flex flex-col items-center">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#333"
            strokeWidth="10"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={color}
            strokeWidth="10"
            fill="none"
            strokeDasharray={`${percentage * 2.83} 283`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="text-sm text-gray-200 mt-1">
          {label}: {value}/{max}
        </span>
      </div>
    );
  }
  