'use client';

export default function SystemLogs({ initialLogs = [] }) {
  return (
    <div className="bg-black border border-gray-700 rounded p-2 h-48 overflow-y-auto font-mono text-xs">
      {initialLogs.length === 0 ? (
        <div className="text-gray-500">No logs available</div>
      ) : (
        initialLogs.map((log, i) => (
          <div key={i} className="text-green-400 mb-1">
            {log}
          </div>
        ))
      )}
    </div>
  );
}


