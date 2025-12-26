'use client';

import React, { useState } from 'react';

export default function GeneratorControlDiagnosticHub() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [diagnosticData, setDiagnosticData] = useState<any>(null);

  const connectToGenerator = () => {
    setIsConnected(true);
    setDiagnosticData({
      status: 'Online',
      voltage: '480V',
      frequency: '60Hz',
      load: '75%',
      fuelLevel: '85%',
      runtime: '1247 hours',
      lastMaintenance: '2024-01-15',
    });
  };

  const disconnectFromGenerator = () => {
    setIsConnected(false);
    setDiagnosticData(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Generator Control Diagnostic Hub</h3>

      <div className="mb-4">
        {!isConnected ? (
          <button
            onClick={connectToGenerator}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Connect to Generator
          </button>
        ) : (
          <button
            onClick={disconnectFromGenerator}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        )}
      </div>

      {isConnected && diagnosticData && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(diagnosticData).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-md">
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {value as string}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isConnected && (
        <div className="text-center py-8 text-gray-500">
          <p>Click "Connect to Generator" to start diagnostics</p>
        </div>
      )}
    </div>
  );
}