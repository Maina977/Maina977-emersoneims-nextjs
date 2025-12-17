'use client';
import { useEffect, useState } from 'react';

export default function AltitudeTape() {
  const [altitude, setAltitude] = useState(1000); // starting altitude in feet

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate altitude changes
      setAltitude((prev) => {
        const change = Math.random() > 0.5 ? 20 : -20;
        return Math.max(0, prev + change);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Generate tick marks around current altitude
  const ticks = [];
  for (let offset = -200; offset <= 200; offset += 100) {
    ticks.push(altitude + offset);
  }

  return (
    <div className="relative bg-gray-900 border-4 border-red-600 rounded-lg p-2 h-64 overflow-hidden">
      <h2 className="text-sm font-bold text-red-400 mb-2">ALTITUDE</h2>

      {/* Tape with tick marks */}
      <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-red-300 text-sm">
        {ticks.map((tick, i) => (
          <div key={i} className="my-4">
            {tick} ft
          </div>
        ))}
      </div>

      {/* Indicator arrow */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-yellow-400"></div>
      </div>

      {/* Current altitude readout */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black px-3 py-1 rounded border border-yellow-400 text-yellow-300 font-bold">
        {altitude} ft
      </div>
    </div>
  );
}
