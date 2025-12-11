'use client';

import { useState } from 'react';

export default function CockpitSwitches({ labels = [], onToggle, initialState = {} }) {
  const [states, setStates] = useState(initialState);

  const handleToggle = (label) => {
    const newState = !states[label];
    setStates(prev => ({ ...prev, [label]: newState }));
    if (onToggle) onToggle(label, newState);
  };

  return (
    <div className="space-y-2">
      {labels.map((label) => (
        <div key={label} className="flex items-center justify-between p-2 bg-gray-800 rounded">
          <span className="text-xs text-gray-300">{label}</span>
          <button
            onClick={() => handleToggle(label)}
            className={`w-12 h-6 rounded-full transition-colors ${
              states[label] ? 'bg-amber-500' : 'bg-gray-600'
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-transform ${
                states[label] ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}


