import React from 'react';

interface UPSSystemsProps {
  performanceTier?: string;
}

export default function UPSSystems({ performanceTier }: UPSSystemsProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">UPS Systems</h2>
      <p className="text-gray-600 mb-6">
        Uninterruptible Power Supply systems for critical applications.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>UPS installation, maintenance, and battery replacement services.</p>
      </div>
    </div>
  );
}