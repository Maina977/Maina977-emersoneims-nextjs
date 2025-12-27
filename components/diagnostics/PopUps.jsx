'use client';

export default function PopUps({ alerts = [], onClear }) {
  if (alerts.length === 0) {
    return <div className="text-gray-500 text-sm">No active alerts</div>;
  }

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-3 rounded border-l-4 ${
            alert.level === 'HIGH'
              ? 'bg-red-900/30 border-red-500'
              : 'bg-amber-900/30 border-amber-500'
          }`}
        >
          <div className="font-bold text-xs mb-1">{alert.title}</div>
          <div className="text-xs text-gray-300">{alert.message}</div>
        </div>
      ))}
      {onClear && (
        <button
          onClick={onClear}
          className="mt-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded"
        >
          Clear All
        </button>
      )}
    </div>
  );
}


