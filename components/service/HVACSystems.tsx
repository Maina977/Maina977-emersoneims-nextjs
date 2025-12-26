import React from 'react';

interface HVACSystemsProps {
  performanceTier?: string;
}

export default function HVACSystems({ performanceTier }: HVACSystemsProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">HVAC Systems</h2>
      <p className="text-gray-600 mb-6">
        Heating, ventilation, and air conditioning system services.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>HVAC installation, maintenance, and repair services.</p>
      </div>
    </div>
  );
}