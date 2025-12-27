'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import MetalBezel from './MetalBezel';
import { UNIVERSAL_SERVICES } from '@/lib/data/diagnosticServices';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const SERVICES = UNIVERSAL_SERVICES;

export default function NineInOneCalculator() {
  const [service, setService] = useState(SERVICES[0]);
  const [fields, setFields] = useState({});
  const [result, setResult] = useState(null);
  const [errors, setErrors] = useState({});
  const [calculationHistory, setCalculationHistory] = useState([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const cfg = useMemo(() => getServiceConfig(service), [service]);

  // GSAP animations
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const onChange = (name, value) => {
    setFields((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    const e = {};
    cfg.inputs.forEach((inp) => {
      const v = Number(fields[inp.name]);
      if (inp.required && (isNaN(v) || v === null)) e[inp.name] = 'Required';
      if (inp.min !== undefined && v < inp.min) e[inp.name] = `>= ${inp.min}`;
      if (inp.max !== undefined && v > inp.max) e[inp.name] = `<= ${inp.max}`;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const compute = () => {
    if (!validate()) return;
    const out = cfg.compute(fields);
    setResult(out);
    
    // Add to history
    setCalculationHistory((prev) => [
      ...prev.slice(-9),
      { service, inputs: { ...fields }, outputs: out, timestamp: new Date() },
    ]);
  };

  // Generate chart data based on service and result
  const chartData = useMemo(() => {
    if (!result) return null;
    return generateChartData(service, result, fields);
  }, [result, service, fields]);

  return (
    <MetalBezel title="9‑in‑1 Engineering Calculator — Premium Awwwards Edition">
      <div
        ref={containerRef}
        className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 rounded-xl border-2 border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.4)] p-6 overflow-hidden"
      >
        {/* Holographic Grid Overlay */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }} />
        
        {/* Glowing Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400 opacity-50" />
        <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400 opacity-50" />
        <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400 opacity-50" />

        <div className="grid grid-cols-1 lg:grid-cols-[280px,1fr] gap-6 relative z-10">
          {/* Service selector - Enhanced */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-300 tracking-widest font-mono flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-400" />
              SERVICE MODE
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {SERVICES.map((s) => (
                <motion.button
                  key={s}
                  onClick={() => {
                    setService(s);
                    setFields({});
                    setResult(null);
                    setErrors({});
                  }}
                  className={`px-4 py-3 text-left rounded-lg border-2 font-mono transition-all ${
                    service === s
                      ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.6)]'
                      : 'bg-gray-900/80 border-cyan-500/30 text-cyan-300 hover:border-cyan-400/50 hover:bg-gray-800/80'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{s}</span>
                    {service === s && (
                      <span className="text-cyan-200 animate-pulse">●</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Inputs + Output + Charts */}
          <div className="space-y-6">
            {/* Inputs Section */}
            <div>
              <h3 className="text-sm font-bold text-cyan-300 tracking-widest mb-4 font-mono flex items-center gap-2">
                <span className="w-1 h-4 bg-cyan-400" />
                INPUT PARAMETERS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cfg.inputs.map((inp) => (
                  <motion.div
                    key={inp.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <label className="block text-xs text-cyan-400 mb-2 font-mono">
                      {inp.label} {inp.unit ? `(${inp.unit})` : ''}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={fields[inp.name] ?? ''}
                      onChange={(e) => onChange(inp.name, e.target.value)}
                      placeholder={inp.placeholder ?? ''}
                      className={`w-full px-4 py-3 bg-black/60 border-2 rounded-lg text-cyan-300 font-mono backdrop-blur-sm transition-all ${
                        errors[inp.name]
                          ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                          : 'border-cyan-500/30 hover:border-cyan-400/50 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      }`}
                    />
                    {errors[inp.name] && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-400 text-xs mt-1 font-mono"
                      >
                        {errors[inp.name]}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={compute}
                className="mt-6 px-8 py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white rounded-lg border-2 border-cyan-400 font-mono font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:shadow-[0_0_35px_rgba(6,182,212,0.7)] transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ▶ COMPUTE
              </motion.button>
            </div>

            {/* Results Section */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-6 bg-black/60 border-2 border-green-500/40 rounded-lg backdrop-blur-sm shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                  <h4 className="text-sm font-bold mb-4 text-green-400 tracking-widest font-mono flex items-center gap-2">
                    <span className="w-1 h-4 bg-green-400" />
                    CALCULATION RESULTS
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(result).map(([k, v]) => (
                      <motion.div
                        key={k}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-gray-900/60 border border-green-500/20 rounded-lg"
                      >
                        <div className="text-xs text-gray-400 font-mono mb-1">{k}</div>
                        <div className="text-xl font-bold text-green-400 font-mono">
                          {formatValue(v)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Chart Visualizations */}
                {chartData && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {chartData.line && (
                      <div className="p-4 bg-black/60 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm">
                        <h5 className="text-xs text-cyan-300 font-mono mb-3">TREND ANALYSIS</h5>
                        <div className="h-48">
                          <Line data={chartData.line.data} options={chartData.line.options} />
                        </div>
                      </div>
                    )}
                    {chartData.bar && (
                      <div className="p-4 bg-black/60 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm">
                        <h5 className="text-xs text-cyan-300 font-mono mb-3">COMPARISON</h5>
                        <div className="h-48">
                          <Bar data={chartData.bar.data} options={chartData.bar.options} />
                        </div>
                      </div>
                    )}
                    {chartData.doughnut && (
                      <div className="p-4 bg-black/60 border-2 border-cyan-500/30 rounded-lg backdrop-blur-sm md:col-span-2">
                        <h5 className="text-xs text-cyan-300 font-mono mb-3">DISTRIBUTION</h5>
                        <div className="h-64">
                          <Doughnut data={chartData.doughnut.data} options={chartData.doughnut.options} />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Calculation History */}
            {calculationHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-black/40 border border-cyan-500/20 rounded-lg"
              >
                <h5 className="text-xs text-cyan-300 font-mono mb-3">CALCULATION HISTORY</h5>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {calculationHistory.slice(-5).reverse().map((calc, idx) => (
                    <div key={idx} className="text-xs text-gray-400 font-mono border-b border-gray-800 pb-2">
                      {calc.service} — {calc.timestamp.toLocaleTimeString()}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MetalBezel>
  );
}

function formatValue(v) {
  if (typeof v === 'number' && !Number.isInteger(v)) return v.toFixed(3);
  return String(v);
}

// Generate Chart.js data based on service and results
function generateChartData(service, result, fields) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#06b6d4', font: { family: 'monospace' } },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 12,
        borderColor: 'rgba(6, 182, 212, 0.5)',
        borderWidth: 1,
        titleColor: '#06b6d4',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(6, 182, 212, 0.1)' },
        ticks: { color: '#06b6d4' },
      },
      y: {
        grid: { color: 'rgba(6, 182, 212, 0.1)' },
        ticks: { color: '#06b6d4' },
      },
    },
  };

  const charts = {};

  // Service-specific chart generation
  switch (service) {
    case 'Solar Systems':
      charts.bar = {
        data: {
          labels: ['Array Power', 'Daily Energy', 'Battery Capacity', 'Inverter Size'],
          datasets: [{
            label: 'Solar System Metrics',
            data: [
              result['Array power (W)'] / 1000,
              result['Daily energy (Wh/day)'] / 1000,
              result['Battery capacity (Ah)'] / 100,
              result['Inverter size (W)'] / 1000,
            ],
            backgroundColor: 'rgba(6, 182, 212, 0.6)',
            borderColor: '#06b6d4',
            borderWidth: 2,
          }],
        },
        options: chartOptions,
      };
      break;

    case 'Diesel Generators':
      charts.line = {
        data: {
          labels: ['0h', '1h', '2h', '3h', '4h', '5h'],
          datasets: [{
            label: 'Fuel Consumption (L)',
            data: Array.from({ length: 6 }, (_, i) => {
              const F = Number(fields.alpha) * Number(fields.pload) + Number(fields.beta);
              return F * i;
            }),
            borderColor: '#fbbf24',
            backgroundColor: 'rgba(251, 191, 36, 0.2)',
            fill: true,
            tension: 0.4,
          }],
        },
        options: chartOptions,
      };
      break;

    case 'AC & UPS':
      charts.doughnut = {
        data: {
          labels: ['Battery Capacity', 'Load', 'Efficiency'],
          datasets: [{
            data: [
              Number(fields.vbat) * Number(fields.capAh),
              Number(fields.pload),
              Number(fields.eff) * 100,
            ],
            backgroundColor: [
              'rgba(6, 182, 212, 0.8)',
              'rgba(34, 197, 94, 0.8)',
              'rgba(251, 191, 36, 0.8)',
            ],
            borderColor: ['#06b6d4', '#22c55e', '#fbbf24'],
            borderWidth: 2,
          }],
        },
        options: {
          ...chartOptions,
          plugins: {
            ...chartOptions.plugins,
            legend: {
              ...chartOptions.plugins.legend,
              position: 'bottom',
            },
          },
        },
      };
      break;

    default:
      // Generic bar chart for other services
      if (Object.keys(result).length > 0) {
        charts.bar = {
          data: {
            labels: Object.keys(result),
            datasets: [{
              label: 'Output Values',
              data: Object.values(result).map(v => typeof v === 'number' ? v : 0),
              backgroundColor: 'rgba(6, 182, 212, 0.6)',
              borderColor: '#06b6d4',
              borderWidth: 2,
            }],
          },
          options: chartOptions,
        };
      }
  }

  return Object.keys(charts).length > 0 ? charts : null;
}

/* ----- Per-service configuration ----- */
function getServiceConfig(service) {
  switch (service) {
    case 'Solar Systems':
      return {
        inputs: [
          { name: 'panels', label: 'Number of panels', min: 1, required: true },
          { name: 'panelW', label: 'Panel wattage', unit: 'W', min: 50, required: true },
          { name: 'psh', label: 'Peak sun hours', unit: 'h/day', min: 1, max: 9, required: true },
          { name: 'eff', label: 'System efficiency', unit: '', min: 0.6, max: 1, placeholder: '0.8', required: true },
          { name: 'autonomy', label: 'Autonomy days', unit: 'days', min: 0, placeholder: '1', required: true },
          { name: 'vdc', label: 'Battery/system voltage', unit: 'V', min: 12, required: true },
          { name: 'dod', label: 'Depth of discharge', unit: '', min: 0.2, max: 0.9, placeholder: '0.5', required: true },
          { name: 'peakLoad', label: 'Peak load', unit: 'W', min: 100, required: true },
          { name: 'sf', label: 'Safety factor', unit: '', min: 1.1, max: 1.5, placeholder: '1.25', required: true },
        ],
        compute: (f) => {
          const Parray = Number(f.panels) * Number(f.panelW);
          const Edaily = Parray * Number(f.psh) * Number(f.eff);
          const C_Ah = (Edaily * Number(f.autonomy)) / (Number(f.vdc) * Number(f.dod));
          const Pinv = Number(f.peakLoad) * Number(f.sf);
          return {
            'Array power (W)': Parray,
            'Daily energy (Wh/day)': Edaily,
            'Battery capacity (Ah)': C_Ah,
            'Inverter size (W)': Pinv,
          };
        },
      };

    case 'Diesel Generators':
      return {
        inputs: [
          { name: 'pload', label: 'Load', unit: 'kW', min: 1, required: true },
          { name: 'prated', label: 'Generator rated power', unit: 'kW', min: 1, required: true },
          { name: 'alpha', label: 'Fuel slope', unit: 'L/kWh', min: 0.15, max: 0.35, placeholder: '0.25', required: true },
          { name: 'beta', label: 'Idle offset', unit: 'L/h', min: 0, placeholder: '0', required: true },
          { name: 'fuelVol', label: 'Fuel volume', unit: 'L', min: 0, placeholder: '100', required: true },
        ],
        compute: (f) => {
          const LF = Number(f.pload) / Number(f.prated);
          const F = Number(f.alpha) * Number(f.pload) + Number(f.beta);
          const t = F > 0 ? Number(f.fuelVol) / F : 0;
          return {
            'Load factor (ratio)': LF,
            'Fuel consumption (L/h)': F,
            'Runtime (h)': t,
          };
        },
      };

    case 'Controls':
      return {
        inputs: [
          { name: 'alarms', label: 'Alarms observed', min: 0, required: true },
          { name: 'timeH', label: 'Observation time', unit: 'h', min: 0.1, required: true },
          { name: 'startsOK', label: 'Successful starts', min: 0, required: true },
          { name: 'startsTot', label: 'Total starts', min: 1, required: true },
        ],
        compute: (f) => {
          const lambda = Number(f.alarms) / Number(f.timeH);
          const mtbf = lambda > 0 ? 1 / lambda : Infinity;
          const ssr = Number(f.startsOK) / Number(f.startsTot);
          return {
            'Alarm rate (per h)': lambda,
            'MTBF (h)': mtbf,
            'Start success ratio': ssr,
          };
        },
      };

    case 'AC & UPS':
      return {
        inputs: [
          { name: 'vbat', label: 'Battery bus voltage', unit: 'V', min: 12, required: true },
          { name: 'capAh', label: 'Battery capacity', unit: 'Ah', min: 1, required: true },
          { name: 'eff', label: 'Inverter efficiency', unit: '', min: 0.7, max: 1, placeholder: '0.9', required: true },
          { name: 'pload', label: 'Load', unit: 'W', min: 10, required: true },
          { name: 'pf', label: 'Power factor', unit: '', min: 0.5, max: 1, placeholder: '0.9', required: true },
        ],
        compute: (f) => {
          const Ein = Number(f.vbat) * Number(f.capAh);
          const tmin = (Ein * Number(f.eff) / Number(f.pload)) * 60;
          const S = Number(f.pload) / Number(f.pf);
          return {
            'UPS runtime (min)': tmin,
            'Apparent power (VA)': S,
          };
        },
      };

    case 'Automation':
      return {
        inputs: [
          { name: 't1', label: 'Step 1 time', unit: 's', min: 0, required: true },
          { name: 't2', label: 'Step 2 time', unit: 's', min: 0, required: true },
          { name: 't3', label: 'Step 3 time', unit: 's', min: 0, required: true },
          { name: 'busy', label: 'Busy time per cycle', unit: 's', min: 0, required: true },
        ],
        compute: (f) => {
          const Tcycle = Number(f.t1) + Number(f.t2) + Number(f.t3);
          const Q = Tcycle > 0 ? 3600 / Tcycle : 0;
          const U = Tcycle > 0 ? Number(f.busy) / Tcycle : 0;
          return {
            'Cycle time (s)': Tcycle,
            'Throughput (units/h)': Q,
            'Utilization (ratio)': U,
          };
        },
      };

    case 'Pumps':
      return {
        inputs: [
          { name: 'rho', label: 'Fluid density', unit: 'kg/m3', min: 200, max: 2000, placeholder: '1000', required: true },
          { name: 'g', label: 'Gravity', unit: 'm/s2', min: 9.7, max: 9.9, placeholder: '9.81', required: true },
          { name: 'Q', label: 'Flow', unit: 'm3/s', min: 0.0001, required: true },
          { name: 'H', label: 'Head', unit: 'm', min: 0.5, required: true },
          { name: 'eta', label: 'Efficiency', unit: '', min: 0.4, max: 1, placeholder: '0.75', required: true },
        ],
        compute: (f) => {
          const Ph = Number(f.rho) * Number(f.g) * Number(f.Q) * Number(f.H);
          const Pm = Ph / Number(f.eta);
          return {
            'Hydraulic power (W)': Ph,
            'Motor power (W)': Pm,
          };
        },
      };

    case 'Incinerators':
      return {
        inputs: [
          { name: 'mass', label: 'Waste mass', unit: 'kg', min: 1, required: true },
          { name: 'lhv', label: 'Waste LHV', unit: 'MJ/kg', min: 5, max: 25, placeholder: '10', required: true },
          { name: 'eff', label: 'System efficiency', unit: '', min: 0.3, max: 0.9, placeholder: '0.7', required: true },
          { name: 'fuelLHV', label: 'Fuel LHV', unit: 'MJ/Nm3', min: 30, max: 45, placeholder: '35', required: true },
        ],
        compute: (f) => {
          const E = (Number(f.mass) * Number(f.lhv)) / Number(f.eff);
          const flow = E / Number(f.fuelLHV);
          return {
            'Thermal energy (MJ)': E,
            'Fuel gas flow (Nm3)': flow,
          };
        },
      };

    case 'Motors/Rewinding':
      return {
        inputs: [
          { name: 'pout', label: 'Shaft power', unit: 'kW', min: 0.1, required: true },
          { name: 'eff', label: 'Efficiency', unit: '', min: 0.6, max: 1, placeholder: '0.9', required: true },
          { name: 'V', label: 'Line voltage', unit: 'V', min: 200, required: true },
          { name: 'pf', label: 'Power factor', unit: '', min: 0.5, max: 1, placeholder: '0.85', required: true },
        ],
        compute: (f) => {
          const Pin = Number(f.pout) / Number(f.eff);
          const I = (Pin * 1000) / (Math.sqrt(3) * Number(f.V) * Number(f.pf));
          return {
            'Input power (kW)': Pin,
            'Phase current (A)': I,
          };
        },
      };

    case 'Diagnostics Hub':
      return {
        inputs: [
          { name: 'reported', label: 'Errors reported', min: 1, required: true },
          { name: 'resolved', label: 'Errors resolved', min: 0, required: true },
          { name: 'sumTime', label: 'Sum resolution time', unit: 'h', min: 0, required: true },
        ],
        compute: (f) => {
          const RR = Number(f.resolved) / Number(f.reported);
          const Tavg = Number(f.resolved) > 0 ? Number(f.sumTime) / Number(f.resolved) : 0;
          return {
            'Resolution rate (ratio)': RR,
            'Avg time to resolve (h)': Tavg,
          };
        },
      };

    default:
      return { inputs: [], compute: () => ({}) };
  }
}
