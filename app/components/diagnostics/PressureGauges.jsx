'use client';

import NeedleGauge from './NeedleGauge';

export default function PressureGauges() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <NeedleGauge label="Pressure" value={75} max={100} color="red" />
      <NeedleGauge label="Voltage" value={60} max={100} color="yellow" />
      <NeedleGauge label="Temperature" value={45} max={100} color="green" />
    </div>
  );
}


