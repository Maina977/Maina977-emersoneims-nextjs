'use client';

import React, { useState } from 'react';

interface GeneratorCalculatorProps {
  className?: string;
}

export default function GeneratorCalculator({ className = "" }: GeneratorCalculatorProps) {
  const [power, setPower] = useState<number>(100);
  const [hours, setHours] = useState<number>(8);
  const [fuelType, setFuelType] = useState<string>('diesel');

  const calculateConsumption = () => {
    // Simple calculation - in reality this would be more complex
    const consumptionRate = fuelType === 'diesel' ? 0.08 : 0.12; // liters per kWh
    return (power * hours * consumptionRate).toFixed(2);
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold mb-4">Generator Fuel Calculator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Power Required (kW)
          </label>
          <input
            type="number"
            value={power}
            onChange={(e) => setPower(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Operating Hours
          </label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fuel Type
          </label>
          <select
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
          </select>
        </div>

        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">
            Estimated Fuel Consumption: <span className="font-semibold text-lg text-blue-600">
              {calculateConsumption()} liters
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}