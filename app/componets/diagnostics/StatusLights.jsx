'use client';

export default function StatusLights({ status = 'green' }) {
  const colors = {
    green: '#0f0',
    amber: '#ff0',
    red: '#f00'
  };
  
  return (
    <div className="flex gap-2">
      <div 
        className="w-4 h-4 rounded-full"
        style={{ 
          backgroundColor: colors[status] || colors.green,
          boxShadow: `0 0 10px ${colors[status] || colors.green}`
        }}
      />
      <span className="text-xs text-gray-300 uppercase">{status}</span>
    </div>
  );
}


