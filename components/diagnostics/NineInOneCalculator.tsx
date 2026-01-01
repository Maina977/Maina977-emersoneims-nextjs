'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface CalculationInput {
  label: string;
  value: string;
  unit: string;
  placeholder: string;
}

interface CalculationResult {
  name: string;
  value: number | string;
  unit: string;
  formula: string;
}

export default function NineInOneCalculator() {
  const [inputs, setInputs] = useState<Record<string, string>>({
    power: '',
    voltage: '',
    current: '',
    powerFactor: '',
    efficiency: '',
    length: '',
    resistance: '',
    load: '',
    time: '',
    capacity: '',
    depthOfDischarge: '',
    solarEnergy: '',
    safetyFactor: '',
    hoursPerDay: '',
  });

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  const calculations = useMemo(() => {
    const p = parseFloat(inputs.power) || 0;
    const v = parseFloat(inputs.voltage) || 0;
    const i = parseFloat(inputs.current) || 0;
    const pf = parseFloat(inputs.powerFactor) || 1;
    const eff = parseFloat(inputs.efficiency) || 100;
    const l = parseFloat(inputs.length) || 0;
    const r = parseFloat(inputs.resistance) || 0;
    const load = parseFloat(inputs.load) || 0;
    const t = parseFloat(inputs.time) || 0;
    const cap = parseFloat(inputs.capacity) || 0;
    const dod = parseFloat(inputs.depthOfDischarge) || 80;
    const energy = parseFloat(inputs.solarEnergy) || 0;
    const sf = parseFloat(inputs.safetyFactor) || 1.25;
    const hpd = parseFloat(inputs.hoursPerDay) || 0;

    const results: CalculationResult[] = [];

    // Power Factor
    if (p > 0 && v > 0 && i > 0) {
      const apparentPower = v * i;
      const calculatedPf = p / apparentPower;
      results.push({
        name: 'Power Factor',
        value: calculatedPf.toFixed(3),
        unit: '',
        formula: 'PF = P / (V × I)',
      });
    }

    // Efficiency
    if (p > 0 && eff > 0) {
      const outputPower = (p * eff) / 100;
      results.push({
        name: 'Output Power',
        value: outputPower.toFixed(2),
        unit: 'kW',
        formula: 'P_out = P_in × (η/100)',
      });
    }

    // Current
    if (p > 0 && v > 0 && pf > 0) {
      const calculatedCurrent = p / (v * pf);
      results.push({
        name: 'Current',
        value: calculatedCurrent.toFixed(2),
        unit: 'A',
        formula: 'I = P / (V × PF)',
      });
    }

    // Voltage Drop
    if (i > 0 && l > 0 && r > 0) {
      const voltageDrop = (i * l * r) / 1000;
      results.push({
        name: 'Voltage Drop',
        value: voltageDrop.toFixed(2),
        unit: 'V',
        formula: 'VD = (I × L × R) / 1000',
      });
    }

    // Cable Size (simplified)
    if (i > 0) {
      const k = 100; // Current carrying capacity factor
      const cableSize = (i * sf) / k;
      results.push({
        name: 'Cable Size',
        value: cableSize.toFixed(2),
        unit: 'mm²',
        formula: 'A = (I × SF) / K',
      });
    }

    // Generator Sizing
    if (load > 0 && pf > 0) {
      const generatorPower = (load * sf) / pf;
      results.push({
        name: 'Generator Size',
        value: generatorPower.toFixed(2),
        unit: 'kVA',
        formula: 'P_gen = (Load × SF) / PF',
      });
    }

    // Fuel Consumption (simplified)
    if (p > 0 && t > 0 && eff > 0) {
      const cv = 42; // MJ/L for diesel
      const fuelConsumption = (p * t) / (eff * cv);
      results.push({
        name: 'Fuel Consumption',
        value: fuelConsumption.toFixed(2),
        unit: 'L',
        formula: 'FC = (P × T) / (η × CV)',
      });
    }

    // Battery Runtime
    if (cap > 0 && v > 0 && p > 0 && dod > 0) {
      const batteryEnergy = cap * v * (dod / 100);
      const runtime = batteryEnergy / p;
      results.push({
        name: 'Battery Runtime',
        value: runtime.toFixed(1),
        unit: 'hours',
        formula: 'T = (C × V × DOD) / P',
      });
    }

    // Solar Panel Count
    if (energy > 0 && hpd > 0) {
      const panelPower = 400; // W per panel
      const panelCount = Math.ceil((energy * 1000) / (panelPower * hpd));
      results.push({
        name: 'Solar Panels Needed',
        value: panelCount,
        unit: 'panels',
        formula: 'N = (E × 1000) / (P_panel × H)',
      });
    }

    return results;
  }, [inputs]);

  const inputFields: CalculationInput[] = [
    { label: 'Power', value: inputs.power, unit: 'kW', placeholder: '100' },
    { label: 'Voltage', value: inputs.voltage, unit: 'V', placeholder: '400' },
    { label: 'Current', value: inputs.current, unit: 'A', placeholder: '150' },
    { label: 'Power Factor', value: inputs.powerFactor, unit: '', placeholder: '0.8' },
    { label: 'Efficiency', value: inputs.efficiency, unit: '%', placeholder: '95' },
    { label: 'Cable Length', value: inputs.length, unit: 'm', placeholder: '50' },
    { label: 'Resistance', value: inputs.resistance, unit: 'Ω/km', placeholder: '0.5' },
    { label: 'Load', value: inputs.load, unit: 'kW', placeholder: '75' },
    { label: 'Time', value: inputs.time, unit: 'hours', placeholder: '8' },
    { label: 'Battery Capacity', value: inputs.capacity, unit: 'Ah', placeholder: '200' },
    { label: 'Depth of Discharge', value: inputs.depthOfDischarge, unit: '%', placeholder: '80' },
    { label: 'Daily Energy', value: inputs.solarEnergy, unit: 'kWh', placeholder: '20' },
    { label: 'Safety Factor', value: inputs.safetyFactor, unit: '', placeholder: '1.25' },
    { label: 'Sun Hours/Day', value: inputs.hoursPerDay, unit: 'hours', placeholder: '5' },
  ];

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? {} : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-200"
      role="region"
      aria-labelledby="calculator-title"
    >
      <div className="mb-6">
        <h3 id="calculator-title" className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">9-in-1 Electrical Calculator</h3>
        <p className="text-sm sm:text-base text-gray-600">Professional electrical engineering calculations</p>
      </div>

      <fieldset className="mb-6">
        <legend className="sr-only">Enter electrical values for calculations</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {inputFields.map((field, index) => (
            <motion.div
              key={field.label}
              initial={prefersReducedMotion ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? {} : { delay: index * 0.05 }}
              className="space-y-2"
            >
              <label 
                htmlFor={`calc-${field.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label} {field.unit && <span className="text-gray-500">({field.unit})</span>}
              </label>
              <input
                id={`calc-${field.label.toLowerCase().replace(/\s+/g, '-')}`}
                type="number"
                inputMode="decimal"
                value={field.value}
                onChange={(e) => handleInputChange(
                  field.label.toLowerCase().replace(/\s+/g, '').replace(/[^a-zA-Z]/g, ''),
                  e.target.value
                )}
                placeholder={field.placeholder}
                aria-describedby={field.unit ? `${field.label.toLowerCase().replace(/\s+/g, '-')}-unit` : undefined}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 text-base"
              />
              {field.unit && (
                <span id={`${field.label.toLowerCase().replace(/\s+/g, '-')}-unit`} className="sr-only">
                  in {field.unit}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </fieldset>

      {calculations.length > 0 && (
        <motion.div
          initial={prefersReducedMotion ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="border-t pt-6"
          role="region"
          aria-live="polite"
          aria-label="Calculation results - updates automatically"
        >
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
            Calculation Results 
            <span className="sr-only"> - {calculations.length} results calculated</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4" role="list">
            {calculations.map((calc, index) => (
              <motion.div
                key={calc.name}
                initial={prefersReducedMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={prefersReducedMotion ? {} : { delay: index * 0.1 }}
                className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                role="listitem"
                aria-label={`${calc.name}: ${calc.value} ${calc.unit}`}
              >
                <h5 className="font-semibold text-gray-900 text-sm mb-1">{calc.name}</h5>
                <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1" aria-hidden="true">
                  {calc.value} {calc.unit}
                </p>
                <p className="text-xs text-gray-600 font-mono" aria-label={`Formula: ${calc.formula}`}>{calc.formula}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg" role="note">
        <p className="text-xs sm:text-sm text-gray-700">
          <span aria-hidden="true">💡 </span>
          Enter values in the fields above to perform real-time electrical calculations.
          All results are calculated using standard electrical engineering formulas.
        </p>
      </div>
    </motion.div>
  );
}