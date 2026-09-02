'use client';

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Generator Efficiency Curve
export function GeneratorEfficiencyCurve() {
  const data = [
    { load: '10%', efficiency: 68, fuelConsumption: 8.5 },
    { load: '25%', efficiency: 78, fuelConsumption: 7.2 },
    { load: '50%', efficiency: 85, fuelConsumption: 6.8 },
    { load: '75%', efficiency: 88, fuelConsumption: 6.5 },
    { load: '100%', efficiency: 90, fuelConsumption: 6.2 },
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-amber-400 mb-4">Generator Efficiency vs Load</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="load" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#f59e0b' }}
          />
          <Legend />
          <Line type="monotone" dataKey="efficiency" stroke="#f59e0b" strokeWidth={2} name="Efficiency %" />
          <Line type="monotone" dataKey="fuelConsumption" stroke="#ec4899" strokeWidth={2} name="Fuel (L/kWh)" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4">
        <strong>Key Insight:</strong> Generators operate most efficiently at 50-100% load. Below 30% load, efficiency drops significantly, wasting fuel. Proper sizing ensures operation in optimal range.
      </p>
    </div>
  );
}

// UPS Efficiency Curve
export function UPSEfficiencyCurve() {
  const data = [
    { load: '10%', online: 88, lineInt: 90, standby: 92 },
    { load: '25%', online: 90, lineInt: 91, standby: 93 },
    { load: '50%', online: 92, lineInt: 93, standby: 94 },
    { load: '75%', online: 93, lineInt: 94, standby: 95 },
    { load: '100%', online: 94, lineInt: 95, standby: 96 },
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-blue-400 mb-4">UPS Efficiency by Topology & Load</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="load" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#60a5fa' }}
          />
          <Legend />
          <Line type="monotone" dataKey="online" stroke="#60a5fa" strokeWidth={2} name="Online (Double-Conversion)" />
          <Line type="monotone" dataKey="lineInt" stroke="#10b981" strokeWidth={2} name="Line-Interactive" />
          <Line type="monotone" dataKey="standby" stroke="#8b5cf6" strokeWidth={2} name="Standby (Offline)" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4">
        <strong>Key Insight:</strong> Online UPS provides best protection but lowest efficiency. Standby is most efficient but offers no isolation from sags/surges. Proper topology selection depends on load criticality vs budget.
      </p>
    </div>
  );
}

// Solar Inverter Temperature Derating
export function SolarInverterTemperatureDerating() {
  const data = [
    { temp: '0°C', output: 110, efficiency: 98.5 },
    { temp: '15°C', output: 105, efficiency: 98.8 },
    { temp: '25°C', output: 100, efficiency: 99.0 },
    { temp: '35°C', output: 92, efficiency: 98.5 },
    { temp: '45°C', output: 82, efficiency: 97.5 },
    { temp: '55°C', output: 68, efficiency: 96.0 },
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-amber-400 mb-4">Solar Inverter Temperature Derating</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorOutput" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="temp" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: 'Output Power (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#fbbf24' }}
          />
          <Legend />
          <Area type="monotone" dataKey="output" stroke="#fbbf24" fillOpacity={1} fill="url(#colorOutput)" name="Output Power %" />
          <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} name="Efficiency %" />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4">
        <strong>Critical for Kenya:</strong> In 45°C ambient, solar inverters lose 18-32% capacity. Oversizing by 30% is essential to achieve rated output in peak heat. Proper ventilation (10cm clearance) reduces heatsink temperature by 5-10°C.
      </p>
    </div>
  );
}

// Battery Discharge Curve
export function BatteryDischargeCurve() {
  const data = [
    { time: '0 min', voltage: 48.0, capacity: 100 },
    { time: '15 min', voltage: 47.5, capacity: 85 },
    { time: '30 min', voltage: 47.0, capacity: 70 },
    { time: '45 min', voltage: 46.2, capacity: 55 },
    { time: '60 min', voltage: 45.2, capacity: 35 },
    { time: '75 min', voltage: 43.5, capacity: 15 },
    { time: '90 min', voltage: 40.0, capacity: 0 },
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-purple-400 mb-4">UPS Battery Discharge Profile (Full Load)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis yAxisId="left" stroke="#8b5cf6" label={{ value: 'Battery Voltage (V)', angle: -90, position: 'insideLeft' }} />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" label={{ value: 'Capacity (%)', angle: 90, position: 'insideRight' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#8b5cf6' }}
          />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="voltage" stroke="#8b5cf6" strokeWidth={2} name="Battery Voltage (V)" />
          <Line yAxisId="right" type="monotone" dataKey="capacity" stroke="#10b981" strokeWidth={2} name="Remaining Capacity (%)" />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4">
        <strong>Key Insight:</strong> Battery voltage drops faster as discharge progresses. UPS must transfer to mains or shutdown before voltage falls below minimum operating point (~40V for 48V system). Runtime calculation must account for this non-linear curve.
      </p>
    </div>
  );
}

// Motor Efficiency vs Load
export function MotorEfficiencyCurve() {
  const data = [
    { load: '10%', IE3: 75, IE2: 70, standard: 65 },
    { load: '25%', IE3: 82, IE2: 78, standard: 72 },
    { load: '50%', IE3: 88, IE2: 85, standard: 80 },
    { load: '75%', IE3: 90, IE2: 88, standard: 84 },
    { load: '100%', IE3: 91, IE2: 89, standard: 85 },
  ];

  return (
    <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-800">
      <h3 className="text-xl font-bold text-green-400 mb-4">Electric Motor Efficiency (IE Class Comparison)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="load" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" label={{ value: 'Efficiency (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
            labelStyle={{ color: '#10b981' }}
          />
          <Legend />
          <Bar dataKey="IE3" fill="#10b981" name="IE3 (Premium)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="IE2" fill="#f59e0b" name="IE2 (Standard)" radius={[8, 8, 0, 0]} />
          <Bar dataKey="standard" fill="#64748b" name="Standard" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-400 mt-4">
        <strong>Key Insight:</strong> Premium IE3 motors are 3-6% more efficient across all loads. For continuous duty motors, higher efficiency pays back investment in 2-4 years through energy savings. Mandatory in EU; optional in Kenya but recommended for industrial facilities.
      </p>
    </div>
  );
}

export default { GeneratorEfficiencyCurve, UPSEfficiencyCurve, SolarInverterTemperatureDerating, BatteryDischargeCurve, MotorEfficiencyCurve };
