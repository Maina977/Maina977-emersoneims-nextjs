'use client';

export default function RealtimeGraphs() {
  return (
    <div className="bg-gray-900 p-4 rounded border border-gray-700">
      <h3 className="text-sm font-bold text-gray-300 mb-4">Real-time Metrics</h3>
      <div className="h-48 flex items-end justify-between gap-1">
        {Array.from({ length: 20 }).map((_, i) => {
          const height = Math.random() * 100;
          return (
            <div
              key={i}
              className="flex-1 bg-amber-500 rounded-t"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
  );
}


