'use client';

/**
 * PREDICTIVE MAINTENANCE PANEL
 * - Service Interval Tracking
 * - Battery Health Monitoring
 * - Filter Change Alerts
 * - Component Lifecycle Management
 * - Maintenance Calendar
 * - Cost Projection
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
type MaintenanceCategory =
  | 'engine' | 'electrical' | 'fuel' | 'cooling' | 'filters' | 'belts' | 'fluids'
  | 'sensors' | 'control' | 'injection' | 'governor' | 'protection' | 'starter' | 'exhaust';

interface MaintenanceItem {
  id: string;
  name: string;
  category: MaintenanceCategory;
  lastService: string;
  nextService: string;
  intervalHours: number;
  currentHours: number;
  hoursRemaining: number;
  status: 'ok' | 'due_soon' | 'overdue' | 'critical';
  cost: number;
  parts: string[];
  icon: string;
  // Enhanced diagnostic info
  failureSigns?: string[];
  testProcedure?: string[];
  criticalValues?: { min: number; max: number; unit: string };
  componentLifespan?: number; // hours
  failureRisk?: number; // percentage
}

interface BatteryHealth {
  voltage: number;
  capacity: number;
  age: number;
  maxAge: number;
  lastTest: string;
  coldCrankAmps: number;
  ratedCCA: number;
  status: 'good' | 'fair' | 'poor' | 'replace';
  prediction: string;
}

interface CalendarEvent {
  id: string;
  date: string;
  title: string;
  type: 'maintenance' | 'inspection' | 'test' | 'replacement';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  duration: string;
}

// ==================== MAINTENANCE ITEM CARD ====================
function MaintenanceItemCard({ item }: { item: MaintenanceItem }) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    ok: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', progress: 'bg-green-500' },
    due_soon: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', progress: 'bg-amber-500' },
    overdue: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', progress: 'bg-red-500' },
    critical: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', progress: 'bg-purple-500' },
  };

  const colors = statusColors[item.status];
  const progress = Math.min(100, ((item.intervalHours - item.hoursRemaining) / item.intervalHours) * 100);

  return (
    <motion.div
      className={`p-4 rounded-xl ${colors.bg} border ${colors.border} cursor-pointer`}
      whileHover={{ scale: 1.01 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <h4 className="font-medium text-white">{item.name}</h4>
            <p className="text-xs text-slate-500 capitalize">{item.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {item.failureRisk !== undefined && item.failureRisk > 20 && (
            <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">
              {item.failureRisk}% RISK
            </span>
          )}
          <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
            {item.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500">Service Progress</span>
          <span className={colors.text}>{item.hoursRemaining}h remaining</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${colors.progress}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div>
          <div className="text-white font-mono">{item.intervalHours}h</div>
          <div className="text-slate-500">Interval</div>
        </div>
        <div>
          <div className="text-white font-mono">{item.currentHours}h</div>
          <div className="text-slate-500">Current</div>
        </div>
        <div>
          <div className="text-amber-400 font-mono">KES {item.cost.toLocaleString()}</div>
          <div className="text-slate-500">Est. Cost</div>
        </div>
        {item.componentLifespan && (
          <div>
            <div className="text-cyan-400 font-mono">{item.componentLifespan}h</div>
            <div className="text-slate-500">Lifespan</div>
          </div>
        )}
      </div>

      {/* Critical Values */}
      {item.criticalValues && (
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Acceptable Range:</span>
            <span className="text-cyan-400 font-mono">
              {item.criticalValues.min} - {item.criticalValues.max} {item.criticalValues.unit}
            </span>
          </div>
        </div>
      )}

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
              {/* Failure Signs */}
              {item.failureSigns && item.failureSigns.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2">⚠️ Warning Signs of Failure</h5>
                  <ul className="space-y-1">
                    {item.failureSigns.map((sign, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {sign}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Test Procedure */}
              {item.testProcedure && item.testProcedure.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">🔧 Test Procedure</h5>
                  <ol className="space-y-1">
                    {item.testProcedure.map((step, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-400 font-mono">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Required Parts */}
              {item.parts && item.parts.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">📦 Required Parts</h5>
                  <div className="flex flex-wrap gap-1">
                    {item.parts.map((part, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-800/50 rounded text-xs text-slate-300">
                        {part}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Service Date & Expand Hint */}
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
        <span className="text-slate-500">Next Service: <span className={colors.text}>{item.nextService}</span></span>
        <span className="text-slate-600">{expanded ? '▲ Less' : '▼ More'}</span>
      </div>
    </motion.div>
  );
}

// ==================== BATTERY HEALTH MONITOR ====================
function BatteryHealthMonitor({ battery }: { battery: BatteryHealth }) {
  const statusColors = {
    good: { color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    fair: { color: '#f59e0b', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    poor: { color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
    replace: { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30' },
  };

  const colors = statusColors[battery.status];
  const ccaPercentage = (battery.coldCrankAmps / battery.ratedCCA) * 100;
  const agePercentage = (battery.age / battery.maxAge) * 100;

  return (
    <div className={`p-6 rounded-xl ${colors.bg} border ${colors.border}`}>
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-2xl">🔋</span>
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-amber-400 uppercase tracking-wider">Battery Health</h3>
          <p className="text-xs text-slate-500">Predictive monitoring & replacement alerts</p>
        </div>
      </div>

      {/* Main Battery Visualization */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative w-24 h-40">
          {/* Battery shape */}
          <div className="absolute inset-x-2 top-0 h-3 bg-slate-600 rounded-t-lg" />
          <div className="absolute inset-0 top-3 bg-slate-800 rounded-lg border-2 border-slate-600 overflow-hidden">
            <motion.div
              className="absolute bottom-0 left-0 right-0"
              style={{ backgroundColor: colors.color }}
              initial={{ height: 0 }}
              animate={{ height: `${battery.capacity}%` }}
              transition={{ duration: 1 }}
            />
            {/* Level markers */}
            {[25, 50, 75].map((level) => (
              <div
                key={level}
                className="absolute left-0 right-0 border-t border-slate-600/50"
                style={{ bottom: `${level}%` }}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Capacity</span>
              <span style={{ color: colors.color }}>{battery.capacity}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full" style={{ width: `${battery.capacity}%`, backgroundColor: colors.color }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">CCA ({battery.coldCrankAmps}/{battery.ratedCCA})</span>
              <span style={{ color: colors.color }}>{ccaPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full" style={{ width: `${ccaPercentage}%`, backgroundColor: colors.color }} />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-400">Age ({battery.age}/{battery.maxAge} months)</span>
              <span className={agePercentage > 80 ? 'text-red-400' : 'text-slate-400'}>{agePercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${agePercentage}%`,
                  backgroundColor: agePercentage > 80 ? '#ef4444' : agePercentage > 60 ? '#f59e0b' : '#22c55e'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <div className="text-lg font-mono font-bold text-white">{battery.voltage}V</div>
          <div className="text-[10px] text-slate-500">Voltage</div>
        </div>
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <div className="text-lg font-mono font-bold" style={{ color: colors.color }}>{battery.capacity}%</div>
          <div className="text-[10px] text-slate-500">Capacity</div>
        </div>
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <div className="text-lg font-mono font-bold text-cyan-400">{battery.coldCrankAmps}</div>
          <div className="text-[10px] text-slate-500">CCA</div>
        </div>
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <div className="text-lg font-mono font-bold uppercase" style={{ color: colors.color }}>{battery.status}</div>
          <div className="text-[10px] text-slate-500">Status</div>
        </div>
      </div>

      {/* Prediction */}
      <div className="p-3 bg-slate-950/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-lg">🔮</span>
          <div>
            <div className="text-xs text-slate-500">AI Prediction</div>
            <div className="text-sm text-white">{battery.prediction}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500 flex items-center justify-between">
        <span>Last Test: {battery.lastTest}</span>
        <a
          href="https://wa.me/254768860665?text=Hi!%20I%20need%20to%20schedule%20a%20battery%20test%20for%20my%20generator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 hover:text-amber-300"
        >
          Run Battery Test →
        </a>
      </div>
    </div>
  );
}

// ==================== MAINTENANCE CALENDAR ====================
function MaintenanceCalendar({ events }: { events: CalendarEvent[] }) {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const priorityColors = {
    low: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
    medium: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
    high: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
    critical: 'bg-red-500/20 border-red-500/50 text-red-400',
  };

  const typeIcons = {
    maintenance: '🔧',
    inspection: '🔍',
    test: '🧪',
    replacement: '🔄',
  };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/30">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-400 uppercase tracking-wider">Maintenance Calendar</h3>
            <p className="text-xs text-slate-500">Upcoming service schedule</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() - 1)))}
            className="p-1 hover:bg-slate-800 rounded"
          >
            ◀
          </button>
          <span className="text-white font-medium">
            {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={() => setSelectedMonth(new Date(selectedMonth.setMonth(selectedMonth.getMonth() + 1)))}
            className="p-1 hover:bg-slate-800 rounded"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border ${priorityColors[event.priority]} flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{typeIcons[event.type]}</span>
              <div>
                <div className="text-sm font-medium text-white">{event.title}</div>
                <div className="text-xs text-slate-400">{event.date} • {event.duration}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-mono text-amber-400">KES {event.estimatedCost.toLocaleString()}</div>
              <div className={`text-[10px] uppercase ${priorityColors[event.priority].split(' ')[2]}`}>{event.priority}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-slate-700/50 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-xl font-bold text-white">{events.length}</div>
          <div className="text-xs text-slate-500">Scheduled</div>
        </div>
        <div>
          <div className="text-xl font-bold text-amber-400">
            KES {events.reduce((acc, e) => acc + e.estimatedCost, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Est. Total</div>
        </div>
        <div>
          <div className="text-xl font-bold text-red-400">
            {events.filter(e => e.priority === 'critical' || e.priority === 'high').length}
          </div>
          <div className="text-xs text-slate-500">Urgent</div>
        </div>
      </div>
    </div>
  );
}

// ==================== COST PROJECTION ====================
function CostProjection({ items }: { items: MaintenanceItem[] }) {
  const monthlyProjections = [
    { month: 'Jan', cost: 25000 },
    { month: 'Feb', cost: 8500 },
    { month: 'Mar', cost: 45000 },
    { month: 'Apr', cost: 12000 },
    { month: 'May', cost: 78000 },
    { month: 'Jun', cost: 15000 },
  ];

  const maxCost = Math.max(...monthlyProjections.map(p => p.cost));

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-green-500/30">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
          <span className="text-2xl">💰</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-green-400 uppercase tracking-wider">Cost Projection</h3>
          <p className="text-xs text-slate-500">6-month maintenance forecast</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-40 flex items-end justify-between gap-2 mb-4">
        {monthlyProjections.map((proj, idx) => (
          <div key={proj.month} className="flex-1 flex flex-col items-center">
            <motion.div
              className="w-full bg-gradient-to-t from-green-500 to-emerald-400 rounded-t"
              initial={{ height: 0 }}
              animate={{ height: `${(proj.cost / maxCost) * 100}%` }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            />
            <span className="text-[10px] text-slate-500 mt-2">{proj.month}</span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-slate-700/50">
        <div>
          <div className="text-xl font-mono font-bold text-green-400">
            KES {monthlyProjections.reduce((acc, p) => acc + p.cost, 0).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">6-Month Total</div>
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-amber-400">
            KES {Math.round(monthlyProjections.reduce((acc, p) => acc + p.cost, 0) / 6).toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">Monthly Avg</div>
        </div>
        <div>
          <div className="text-xl font-mono font-bold text-cyan-400">
            {items.filter(i => i.status === 'overdue' || i.status === 'critical').length}
          </div>
          <div className="text-xs text-slate-500">Urgent Items</div>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN PREDICTIVE MAINTENANCE PANEL ====================
export default function PredictiveMaintenancePanel() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const [maintenanceItems] = useState<MaintenanceItem[]>([
    // ========== FLUIDS ==========
    {
      id: '1', name: 'Engine Oil Change', category: 'fluids',
      lastService: '2024-01-01', nextService: '2024-02-15',
      intervalHours: 250, currentHours: 220, hoursRemaining: 30,
      status: 'due_soon', cost: 8500, parts: ['Oil Filter', '15W-40 Oil (15L)'], icon: '🛢️',
      failureSigns: ['Low oil pressure warning', 'Dark/milky oil color', 'Metallic particles in oil', 'Increased engine noise'],
      testProcedure: ['Check oil level on dipstick', 'Inspect oil color and consistency', 'Check for metal particles', 'Monitor oil pressure gauge'],
      criticalValues: { min: 15, max: 65, unit: 'PSI' },
      componentLifespan: 250, failureRisk: 15
    },
    {
      id: '1b', name: 'Hydraulic Fluid Check', category: 'fluids',
      lastService: '2023-12-01', nextService: '2024-06-01',
      intervalHours: 1000, currentHours: 650, hoursRemaining: 350,
      status: 'ok', cost: 12000, parts: ['Hydraulic Fluid (10L)', 'Filter Element'], icon: '🛢️',
      failureSigns: ['Slow actuator response', 'Fluid foaming', 'High operating temperature'],
      testProcedure: ['Check fluid level', 'Inspect for contamination', 'Test viscosity'],
      componentLifespan: 2000, failureRisk: 5
    },

    // ========== FILTERS ==========
    {
      id: '2', name: 'Air Filter Replacement', category: 'filters',
      lastService: '2023-12-15', nextService: '2024-03-15',
      intervalHours: 500, currentHours: 320, hoursRemaining: 180,
      status: 'ok', cost: 4500, parts: ['Air Filter Element', 'Pre-Filter'], icon: '💨',
      failureSigns: ['Black exhaust smoke', 'Reduced power', 'High intake restriction', 'Increased fuel consumption'],
      testProcedure: ['Visual inspection for dirt/damage', 'Check intake restriction gauge', 'Blow test with compressed air'],
      criticalValues: { min: 0, max: 25, unit: 'inches H2O' },
      componentLifespan: 500, failureRisk: 8
    },
    {
      id: '3', name: 'Fuel Filter Change', category: 'filters',
      lastService: '2023-11-20', nextService: '2024-02-20',
      intervalHours: 500, currentHours: 480, hoursRemaining: 20,
      status: 'critical', cost: 3500, parts: ['Primary Fuel Filter', 'Secondary Filter', 'Seals Kit', 'Water Separator'], icon: '⛽',
      failureSigns: ['Hard starting', 'Engine surging', 'Loss of power under load', 'Water in fuel warning'],
      testProcedure: ['Drain water separator', 'Check filter pressure drop', 'Inspect for contamination'],
      criticalValues: { min: 0, max: 10, unit: 'PSI drop' },
      componentLifespan: 500, failureRisk: 85
    },
    {
      id: '3b', name: 'Oil Filter Replacement', category: 'filters',
      lastService: '2024-01-01', nextService: '2024-02-15',
      intervalHours: 250, currentHours: 220, hoursRemaining: 30,
      status: 'due_soon', cost: 2500, parts: ['Oil Filter Element', 'O-Ring Seals'], icon: '🔘',
      failureSigns: ['Low oil pressure', 'Bypass valve activation', 'Metal particles in oil'],
      testProcedure: ['Cut open old filter', 'Inspect media for debris', 'Check bypass valve'],
      componentLifespan: 250, failureRisk: 20
    },

    // ========== COOLING SYSTEM ==========
    {
      id: '4', name: 'Coolant System Flush', category: 'cooling',
      lastService: '2023-08-01', nextService: '2024-08-01',
      intervalHours: 2000, currentHours: 1200, hoursRemaining: 800,
      status: 'ok', cost: 12000, parts: ['Coolant (20L)', 'Thermostat', 'Hoses', 'Clamps'], icon: '❄️',
      failureSigns: ['Overheating', 'Coolant discoloration', 'White residue', 'Sweet smell from exhaust'],
      testProcedure: ['Test coolant freeze point', 'Check pH level (7.5-11)', 'Pressure test system', 'Inspect for leaks'],
      criticalValues: { min: 180, max: 210, unit: '°F' },
      componentLifespan: 4000, failureRisk: 5
    },
    {
      id: '4b', name: 'Water Pump Inspection', category: 'cooling',
      lastService: '2023-06-01', nextService: '2024-06-01',
      intervalHours: 3000, currentHours: 2200, hoursRemaining: 800,
      status: 'ok', cost: 35000, parts: ['Water Pump', 'Gasket', 'Impeller', 'Bearing'], icon: '💧',
      failureSigns: ['Coolant leak at weep hole', 'Bearing noise', 'Overheating at idle', 'Wobbling pulley'],
      testProcedure: ['Check weep hole for leaks', 'Feel for bearing play', 'Listen for bearing noise', 'Inspect belt tension'],
      componentLifespan: 8000, failureRisk: 8
    },
    {
      id: '4c', name: 'Radiator Service', category: 'cooling',
      lastService: '2023-04-01', nextService: '2025-04-01',
      intervalHours: 5000, currentHours: 3500, hoursRemaining: 1500,
      status: 'ok', cost: 45000, parts: ['Radiator Core', 'Fan Shroud', 'Hoses', 'Cap'], icon: '🌡️',
      failureSigns: ['External leaks', 'Fin damage', 'Internal blockage', 'Pressure cap failure'],
      testProcedure: ['Pressure test to 15 PSI', 'Check fin condition', 'Verify coolant flow', 'Test radiator cap'],
      criticalValues: { min: 13, max: 16, unit: 'PSI cap' },
      componentLifespan: 10000, failureRisk: 3
    },
    {
      id: '4d', name: 'Thermostat Replacement', category: 'cooling',
      lastService: '2023-08-01', nextService: '2025-08-01',
      intervalHours: 4000, currentHours: 2500, hoursRemaining: 1500,
      status: 'ok', cost: 8000, parts: ['Thermostat', 'Gasket', 'Housing O-Ring'], icon: '🌡️',
      failureSigns: ['Engine overcooling', 'Slow warm-up', 'Overheating', 'Erratic temperature'],
      testProcedure: ['Boil test thermostat opening', 'Check opening temperature', 'Verify full opening travel'],
      criticalValues: { min: 180, max: 195, unit: '°F opening' },
      componentLifespan: 6000, failureRisk: 5
    },

    // ========== BELTS ==========
    {
      id: '5', name: 'Drive Belt Inspection', category: 'belts',
      lastService: '2023-10-15', nextService: '2024-01-15',
      intervalHours: 1000, currentHours: 1050, hoursRemaining: -50,
      status: 'overdue', cost: 6500, parts: ['V-Belt Set', 'Tensioner Pulley', 'Idler Pulley'], icon: '⚙️',
      failureSigns: ['Squealing noise', 'Visible cracks', 'Glazed surface', 'Fraying edges', 'Battery not charging'],
      testProcedure: ['Check belt deflection (10-15mm)', 'Inspect for cracks/wear', 'Check pulley alignment', 'Verify tensioner spring'],
      criticalValues: { min: 10, max: 15, unit: 'mm deflection' },
      componentLifespan: 2000, failureRisk: 45
    },
    {
      id: '5b', name: 'Fan Belt Replacement', category: 'belts',
      lastService: '2023-09-01', nextService: '2024-09-01',
      intervalHours: 2000, currentHours: 1500, hoursRemaining: 500,
      status: 'ok', cost: 4500, parts: ['Fan Belt', 'Adjustment Hardware'], icon: '🌀',
      failureSigns: ['High engine temperature', 'Belt slipping noise', 'Visual wear patterns'],
      testProcedure: ['Check belt tension', 'Inspect for glazing', 'Verify pulley condition'],
      componentLifespan: 3000, failureRisk: 12
    },

    // ========== ENGINE ==========
    {
      id: '6', name: 'Valve Clearance Adjustment', category: 'engine',
      lastService: '2023-06-01', nextService: '2024-06-01',
      intervalHours: 3000, currentHours: 2100, hoursRemaining: 900,
      status: 'ok', cost: 25000, parts: ['Valve Cover Gasket', 'Feeler Gauges', 'Adjusting Shims'], icon: '🔧',
      failureSigns: ['Ticking noise', 'Power loss', 'Hard starting', 'Valve train noise'],
      testProcedure: ['Check clearance with feeler gauge', 'Intake: 0.25-0.30mm', 'Exhaust: 0.40-0.45mm', 'Adjust as needed'],
      criticalValues: { min: 0.25, max: 0.45, unit: 'mm' },
      componentLifespan: 10000, failureRisk: 6
    },
    {
      id: '6b', name: 'Cylinder Compression Test', category: 'engine',
      lastService: '2023-03-01', nextService: '2024-03-01',
      intervalHours: 2000, currentHours: 1800, hoursRemaining: 200,
      status: 'due_soon', cost: 15000, parts: ['Compression Tester', 'Leak-down Tester'], icon: '📊',
      failureSigns: ['Blue exhaust smoke', 'Hard starting', 'Loss of power', 'Oil consumption'],
      testProcedure: ['Remove glow plugs/injectors', 'Crank engine and record pressure', 'Compare cylinders (max 10% variance)', 'Perform leak-down test if low'],
      criticalValues: { min: 350, max: 450, unit: 'PSI' },
      componentLifespan: 15000, failureRisk: 15
    },
    {
      id: '6c', name: 'Turbocharger Service', category: 'engine',
      lastService: '2023-01-01', nextService: '2025-01-01',
      intervalHours: 5000, currentHours: 3800, hoursRemaining: 1200,
      status: 'ok', cost: 85000, parts: ['Turbo Rebuild Kit', 'Bearings', 'Seals', 'Oil Lines'], icon: '🌪️',
      failureSigns: ['Blue/black smoke', 'Whining noise', 'Loss of boost', 'Oil in intercooler', 'Shaft play'],
      testProcedure: ['Check shaft for radial play (<0.05mm)', 'Check axial play (<0.10mm)', 'Inspect compressor wheel', 'Verify oil supply/drain'],
      criticalValues: { min: 0, max: 0.05, unit: 'mm radial' },
      componentLifespan: 8000, failureRisk: 8
    },

    // ========== INJECTION SYSTEM ==========
    {
      id: '7', name: 'Injector Nozzle Service', category: 'injection',
      lastService: '2023-04-01', nextService: '2024-04-01',
      intervalHours: 4000, currentHours: 3500, hoursRemaining: 500,
      status: 'ok', cost: 45000, parts: ['Injector Nozzles (set)', 'Copper Washers', 'Seals', 'Hold-down Studs'], icon: '💉',
      failureSigns: ['Rough idle', 'Black smoke', 'Knock on specific cylinder', 'Poor fuel economy', 'Hard starting'],
      testProcedure: ['Pop test each injector (opening pressure)', 'Check spray pattern', 'Verify no drip after cut-off', 'Ultrasonic cleaning if needed'],
      criticalValues: { min: 2900, max: 3200, unit: 'PSI opening' },
      componentLifespan: 6000, failureRisk: 12
    },
    {
      id: '7b', name: 'Injection Pump Calibration', category: 'injection',
      lastService: '2023-01-15', nextService: '2025-01-15',
      intervalHours: 6000, currentHours: 4500, hoursRemaining: 1500,
      status: 'ok', cost: 120000, parts: ['Calibration Kit', 'Delivery Valves', 'Plungers', 'Governor Springs'], icon: '⚙️',
      failureSigns: ['Uneven power delivery', 'Timing drift', 'Fuel leak at pump', 'Governor hunting', 'Speed fluctuation'],
      testProcedure: ['Mount on test bench', 'Check delivery per stroke', 'Verify timing marks', 'Test governor response', 'Check fuel cut-off'],
      criticalValues: { min: 0, max: 2, unit: '° timing deviation' },
      componentLifespan: 12000, failureRisk: 6
    },
    {
      id: '7c', name: 'Fuel Lift Pump Service', category: 'injection',
      lastService: '2023-09-01', nextService: '2024-09-01',
      intervalHours: 3000, currentHours: 2200, hoursRemaining: 800,
      status: 'ok', cost: 18000, parts: ['Lift Pump', 'Diaphragm', 'Check Valves', 'Gaskets'], icon: '🔄',
      failureSigns: ['Air in fuel system', 'Hard starting', 'Engine stalling', 'No fuel at injection pump'],
      testProcedure: ['Check output pressure (4-8 PSI)', 'Test vacuum capability', 'Check for leaks', 'Verify priming function'],
      criticalValues: { min: 4, max: 8, unit: 'PSI' },
      componentLifespan: 6000, failureRisk: 10
    },

    // ========== GOVERNOR SYSTEM ==========
    {
      id: '8', name: 'Governor Actuator Service', category: 'governor',
      lastService: '2023-07-01', nextService: '2024-07-01',
      intervalHours: 4000, currentHours: 3200, hoursRemaining: 800,
      status: 'ok', cost: 55000, parts: ['Actuator Assembly', 'Linkage Kit', 'Potentiometer', 'Spring Set'], icon: '🎯',
      failureSigns: ['Speed fluctuation/hunting', 'Slow speed response', 'No speed control', 'Actuator noise/vibration'],
      testProcedure: ['Check actuator stroke (full travel)', 'Verify feedback signal', 'Test response time (<100ms)', 'Check linkage freeplay'],
      criticalValues: { min: 0, max: 100, unit: 'ms response' },
      componentLifespan: 10000, failureRisk: 7
    },
    {
      id: '8b', name: 'Mechanical Governor Overhaul', category: 'governor',
      lastService: '2022-12-01', nextService: '2024-12-01',
      intervalHours: 6000, currentHours: 4800, hoursRemaining: 1200,
      status: 'ok', cost: 75000, parts: ['Governor Weights', 'Springs', 'Thrust Bearing', 'Seals', 'Gaskets'], icon: '⚖️',
      failureSigns: ['Speed droop issues', 'Hunting at idle', 'No load regulation', 'Oil leaks', 'Sluggish response'],
      testProcedure: ['Check flyweight condition', 'Verify spring tension', 'Test thrust bearing', 'Check linkage wear', 'Verify oil level'],
      criticalValues: { min: 0, max: 4, unit: '% droop' },
      componentLifespan: 12000, failureRisk: 5
    },
    {
      id: '8c', name: 'Electronic Governor Controller', category: 'governor',
      lastService: '2023-05-01', nextService: '2025-05-01',
      intervalHours: 8000, currentHours: 5500, hoursRemaining: 2500,
      status: 'ok', cost: 45000, parts: ['GAC Controller', 'Speed Sensor', 'Actuator Driver'], icon: '🖥️',
      failureSigns: ['Error codes on display', 'Poor speed regulation', 'No communication', 'Erratic behavior'],
      testProcedure: ['Read fault codes', 'Check sensor inputs', 'Verify actuator output', 'Test PID response'],
      componentLifespan: 15000, failureRisk: 4
    },

    // ========== SENSORS ==========
    {
      id: '9', name: 'Magnetic Pickup Sensor', category: 'sensors',
      lastService: '2023-08-01', nextService: '2024-08-01',
      intervalHours: 3000, currentHours: 2400, hoursRemaining: 600,
      status: 'ok', cost: 12000, parts: ['MPU Sensor', 'Connector', 'Shielded Cable'], icon: '🧲',
      failureSigns: ['No speed signal', 'Erratic speed reading', 'Engine won\'t start', 'Governor hunting'],
      testProcedure: ['Check AC voltage output (1-5V at crank)', 'Verify air gap (0.5-1.0mm)', 'Test resistance (200-400Ω)', 'Inspect flywheel teeth'],
      criticalValues: { min: 0.5, max: 1.0, unit: 'mm gap' },
      componentLifespan: 10000, failureRisk: 8
    },
    {
      id: '9b', name: 'Oil Pressure Sensor', category: 'sensors',
      lastService: '2023-10-01', nextService: '2024-10-01',
      intervalHours: 4000, currentHours: 3200, hoursRemaining: 800,
      status: 'ok', cost: 8500, parts: ['Pressure Sender', 'Adapter', 'Connector'], icon: '📊',
      failureSigns: ['False low pressure alarms', 'Gauge fluctuation', 'No reading', 'Stuck reading'],
      testProcedure: ['Compare with mechanical gauge', 'Check resistance curve', 'Verify wiring continuity', 'Test at multiple pressures'],
      criticalValues: { min: 10, max: 180, unit: 'Ω range' },
      componentLifespan: 8000, failureRisk: 6
    },
    {
      id: '9c', name: 'Coolant Temperature Sensor', category: 'sensors',
      lastService: '2023-11-01', nextService: '2024-11-01',
      intervalHours: 4000, currentHours: 3400, hoursRemaining: 600,
      status: 'ok', cost: 6500, parts: ['Temp Sensor', 'Seal', 'Connector'], icon: '🌡️',
      failureSigns: ['False high temp alarms', 'No temperature reading', 'Gauge stuck', 'Fan running constantly'],
      testProcedure: ['Test resistance at known temps', 'Verify with IR thermometer', 'Check wiring', 'Test signal at controller'],
      criticalValues: { min: 200, max: 3000, unit: 'Ω range' },
      componentLifespan: 8000, failureRisk: 5
    },
    {
      id: '9d', name: 'Fuel Level Sensor', category: 'sensors',
      lastService: '2023-06-01', nextService: '2024-06-01',
      intervalHours: 3000, currentHours: 2500, hoursRemaining: 500,
      status: 'ok', cost: 15000, parts: ['Fuel Level Sender', 'Float Assembly', 'Gasket'], icon: '⛽',
      failureSigns: ['Stuck fuel reading', 'Erratic gauge', 'Float stuck', 'Low fuel alarm issues'],
      testProcedure: ['Move float and check resistance', 'Verify full scale operation', 'Inspect float for leaks', 'Check wiring'],
      criticalValues: { min: 33, max: 240, unit: 'Ω (E to F)' },
      componentLifespan: 8000, failureRisk: 7
    },

    // ========== ELECTRICAL ==========
    {
      id: '10', name: 'Alternator/Generator Head', category: 'electrical',
      lastService: '2023-09-01', nextService: '2024-03-01',
      intervalHours: 2000, currentHours: 1800, hoursRemaining: 200,
      status: 'due_soon', cost: 25000, parts: ['Bearings', 'Brush Set', 'AVR', 'Diode Pack'], icon: '⚡',
      failureSigns: ['Voltage fluctuation', 'Bearing noise', 'Overheating', 'Low output voltage', 'Sparking at brushes'],
      testProcedure: ['Check bearing play', 'Measure brush length (min 10mm)', 'Test insulation resistance', 'Verify voltage regulation'],
      criticalValues: { min: 220, max: 240, unit: 'VAC output' },
      componentLifespan: 15000, failureRisk: 18
    },
    {
      id: '10b', name: 'AVR (Auto Voltage Regulator)', category: 'electrical',
      lastService: '2023-05-01', nextService: '2025-05-01',
      intervalHours: 8000, currentHours: 6200, hoursRemaining: 1800,
      status: 'ok', cost: 35000, parts: ['AVR Module', 'Potentiometer', 'Capacitors'], icon: '📈',
      failureSigns: ['Voltage hunting', 'Over/under voltage', 'No voltage buildup', 'Unstable output'],
      testProcedure: ['Check sensing voltage', 'Test output to field', 'Verify potentiometer setting', 'Check for overheating'],
      criticalValues: { min: 0, max: 3, unit: '% regulation' },
      componentLifespan: 12000, failureRisk: 8
    },
    {
      id: '10c', name: 'Battery Charging System', category: 'electrical',
      lastService: '2023-12-01', nextService: '2024-06-01',
      intervalHours: 1000, currentHours: 850, hoursRemaining: 150,
      status: 'due_soon', cost: 8500, parts: ['Charging Alternator', 'Voltage Regulator', 'Cables'], icon: '🔌',
      failureSigns: ['Battery not charging', 'Overcharging', 'Low battery warning', 'Belt squealing'],
      testProcedure: ['Check output voltage (13.8-14.4V)', 'Test charging current', 'Inspect belt tension', 'Verify connections'],
      criticalValues: { min: 13.8, max: 14.4, unit: 'VDC' },
      componentLifespan: 6000, failureRisk: 12
    },

    // ========== STARTER SYSTEM ==========
    {
      id: '11', name: 'Starter Motor Service', category: 'starter',
      lastService: '2023-04-01', nextService: '2025-04-01',
      intervalHours: 5000, currentHours: 4200, hoursRemaining: 800,
      status: 'ok', cost: 45000, parts: ['Starter Motor', 'Solenoid', 'Brushes', 'Bendix Drive'], icon: '🔑',
      failureSigns: ['Slow cranking', 'Grinding noise', 'Click but no crank', 'Intermittent operation'],
      testProcedure: ['Check current draw (<300A)', 'Test solenoid pull-in', 'Verify pinion engagement', 'Check brush condition'],
      criticalValues: { min: 150, max: 300, unit: 'Amps draw' },
      componentLifespan: 10000, failureRisk: 6
    },
    {
      id: '11b', name: 'Glow Plug System', category: 'starter',
      lastService: '2023-09-01', nextService: '2024-09-01',
      intervalHours: 3000, currentHours: 2400, hoursRemaining: 600,
      status: 'ok', cost: 22000, parts: ['Glow Plugs (set)', 'Relay', 'Timer Module', 'Wiring'], icon: '🔥',
      failureSigns: ['Hard cold starting', 'White smoke at startup', 'Glow light not illuminating', 'Long crank time'],
      testProcedure: ['Check glow plug resistance (0.5-2Ω)', 'Test relay operation', 'Verify timer function', 'Check wiring connections'],
      criticalValues: { min: 0.5, max: 2.0, unit: 'Ω' },
      componentLifespan: 6000, failureRisk: 10
    },

    // ========== PROTECTION SYSTEM ==========
    {
      id: '12', name: 'Circuit Breaker Inspection', category: 'protection',
      lastService: '2023-02-01', nextService: '2024-02-01',
      intervalHours: 2000, currentHours: 1950, hoursRemaining: 50,
      status: 'critical', cost: 35000, parts: ['Main Breaker', 'Auxiliary Contacts', 'Arc Chutes'], icon: '🔒',
      failureSigns: ['Nuisance tripping', 'Won\'t reset', 'Overheating', 'Contact pitting', 'Burning smell'],
      testProcedure: ['Trip test at rated current', 'Check contact resistance', 'Inspect arc chutes', 'Verify mechanical operation'],
      criticalValues: { min: 80, max: 120, unit: '% trip rating' },
      componentLifespan: 10000, failureRisk: 65
    },
    {
      id: '12b', name: 'Safety Shutdowns Test', category: 'protection',
      lastService: '2023-11-01', nextService: '2024-05-01',
      intervalHours: 1000, currentHours: 750, hoursRemaining: 250,
      status: 'ok', cost: 8500, parts: ['Test Equipment', 'Shutdown Switches'], icon: '🛑',
      failureSigns: ['Shutdowns not activating', 'False alarms', 'Delayed response', 'Sensor failures'],
      testProcedure: ['Simulate overspeed condition', 'Test low oil pressure', 'Test high temp shutdown', 'Verify overcrank protection'],
      componentLifespan: 8000, failureRisk: 8
    },
    {
      id: '12c', name: 'Fuse and Relay Inspection', category: 'protection',
      lastService: '2023-08-01', nextService: '2024-08-01',
      intervalHours: 2000, currentHours: 1500, hoursRemaining: 500,
      status: 'ok', cost: 5500, parts: ['Fuse Set', 'Relay Set', 'Terminal Blocks'], icon: '⚡',
      failureSigns: ['Blown fuses', 'Relay clicking', 'Intermittent circuits', 'Corrosion on contacts'],
      testProcedure: ['Visual inspection', 'Continuity test each fuse', 'Test relay coil resistance', 'Check socket contacts'],
      componentLifespan: 10000, failureRisk: 6
    },

    // ========== EXHAUST SYSTEM ==========
    {
      id: '13', name: 'Exhaust System Inspection', category: 'exhaust',
      lastService: '2023-07-01', nextService: '2024-07-01',
      intervalHours: 3000, currentHours: 2600, hoursRemaining: 400,
      status: 'ok', cost: 25000, parts: ['Exhaust Gaskets', 'Flexible Section', 'Hangers', 'Clamps'], icon: '💨',
      failureSigns: ['Exhaust leaks', 'Loud noise', 'Soot deposits', 'Rust/corrosion', 'Back pressure increase'],
      testProcedure: ['Visual inspection for leaks', 'Check back pressure (<3" Hg)', 'Inspect flexible bellows', 'Verify hanger condition'],
      criticalValues: { min: 0, max: 3, unit: 'inches Hg' },
      componentLifespan: 8000, failureRisk: 7
    },
    {
      id: '13b', name: 'DPF Regeneration/Clean', category: 'exhaust',
      lastService: '2023-05-01', nextService: '2024-05-01',
      intervalHours: 2500, currentHours: 2200, hoursRemaining: 300,
      status: 'due_soon', cost: 55000, parts: ['DPF Filter', 'DOC Catalyst', 'Sensors'], icon: '🌫️',
      failureSigns: ['DPF warning light', 'Reduced power', 'Increased fuel consumption', 'Forced regeneration failing'],
      testProcedure: ['Check soot loading %', 'Verify regen capability', 'Test pressure sensors', 'Inspect DOC condition'],
      criticalValues: { min: 0, max: 85, unit: '% soot load' },
      componentLifespan: 6000, failureRisk: 18
    },

    // ========== CONTROL SYSTEM ==========
    {
      id: '14', name: 'Controller Firmware Update', category: 'control',
      lastService: '2023-03-01', nextService: '2024-09-01',
      intervalHours: 5000, currentHours: 4500, hoursRemaining: 500,
      status: 'ok', cost: 15000, parts: ['USB Interface', 'Configuration Software'], icon: '🖥️',
      failureSigns: ['Software bugs', 'Missing features', 'Communication errors', 'Display glitches'],
      testProcedure: ['Backup current config', 'Download latest firmware', 'Update via USB/Ethernet', 'Verify all functions'],
      componentLifespan: 20000, failureRisk: 3
    },
    {
      id: '14b', name: 'Control Panel Inspection', category: 'control',
      lastService: '2023-09-01', nextService: '2024-09-01',
      intervalHours: 2000, currentHours: 1600, hoursRemaining: 400,
      status: 'ok', cost: 12000, parts: ['Display Module', 'Membrane Keypad', 'LEDs'], icon: '🎛️',
      failureSigns: ['Dim display', 'Unresponsive buttons', 'LED failures', 'Display errors'],
      testProcedure: ['Test all buttons', 'Check LED indicators', 'Verify display segments', 'Test backlight'],
      componentLifespan: 15000, failureRisk: 5
    },
    {
      id: '14c', name: 'Communication Module Check', category: 'control',
      lastService: '2023-06-01', nextService: '2024-06-01',
      intervalHours: 3000, currentHours: 2700, hoursRemaining: 300,
      status: 'due_soon', cost: 18000, parts: ['RS485 Module', 'Ethernet Module', 'GSM Modem'], icon: '📡',
      failureSigns: ['No remote communication', 'Data errors', 'Connection drops', 'Slow response'],
      testProcedure: ['Test Modbus communication', 'Verify IP settings', 'Check signal strength', 'Test data logging'],
      componentLifespan: 10000, failureRisk: 12
    },
  ]);

  const [battery] = useState<BatteryHealth>({
    voltage: 13.8,
    capacity: 72,
    age: 18,
    maxAge: 36,
    lastTest: '2024-01-10',
    coldCrankAmps: 620,
    ratedCCA: 750,
    status: 'fair',
    prediction: 'Battery replacement recommended within 6-9 months based on current degradation rate',
  });

  const [calendarEvents] = useState<CalendarEvent[]>([
    { id: '1', date: 'Feb 15, 2024', title: 'Engine Oil Change', type: 'maintenance', priority: 'high', estimatedCost: 8500, duration: '2 hours' },
    { id: '2', date: 'Feb 18, 2024', title: 'Fuel Filter Replacement', type: 'replacement', priority: 'critical', estimatedCost: 3500, duration: '1 hour' },
    { id: '3', date: 'Feb 20, 2024', title: 'Drive Belt Replacement', type: 'replacement', priority: 'high', estimatedCost: 6500, duration: '1.5 hours' },
    { id: '4', date: 'Mar 01, 2024', title: 'Alternator Inspection', type: 'inspection', priority: 'medium', estimatedCost: 15000, duration: '3 hours' },
    { id: '5', date: 'Mar 15, 2024', title: 'Air Filter Change', type: 'maintenance', priority: 'low', estimatedCost: 4500, duration: '30 mins' },
    { id: '6', date: 'Apr 01, 2024', title: 'Load Bank Test', type: 'test', priority: 'medium', estimatedCost: 35000, duration: '4 hours' },
  ]);

  const categories = [
    { id: 'all', label: 'All', icon: '📋' },
    { id: 'engine', label: 'Engine', icon: '🔧' },
    { id: 'electrical', label: 'Electrical', icon: '⚡' },
    { id: 'injection', label: 'Injection', icon: '💉' },
    { id: 'governor', label: 'Governor', icon: '🎯' },
    { id: 'sensors', label: 'Sensors', icon: '📡' },
    { id: 'cooling', label: 'Cooling', icon: '❄️' },
    { id: 'filters', label: 'Filters', icon: '🎛️' },
    { id: 'belts', label: 'Belts', icon: '⚙️' },
    { id: 'fluids', label: 'Fluids', icon: '🛢️' },
    { id: 'starter', label: 'Starter', icon: '🔑' },
    { id: 'protection', label: 'Protection', icon: '🔒' },
    { id: 'exhaust', label: 'Exhaust', icon: '💨' },
    { id: 'control', label: 'Control', icon: '🖥️' },
  ];

  const filteredItems = activeCategory === 'all'
    ? maintenanceItems
    : maintenanceItems.filter(item => item.category === activeCategory);

  const statusSummary = {
    ok: maintenanceItems.filter(i => i.status === 'ok').length,
    due_soon: maintenanceItems.filter(i => i.status === 'due_soon').length,
    overdue: maintenanceItems.filter(i => i.status === 'overdue').length,
    critical: maintenanceItems.filter(i => i.status === 'critical').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 20px rgba(16,185,129,0.5)', '0 0 40px rgba(20,184,166,0.5)', '0 0 20px rgba(16,185,129,0.5)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-3xl">🔮</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-emerald-400 uppercase tracking-wider">Predictive Maintenance</h2>
            <p className="text-sm text-slate-500">Service intervals • Battery health • Component lifecycle</p>
          </div>
        </div>

        {/* Status Summary */}
        <div className="flex gap-3">
          <div className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-green-400">{statusSummary.ok}</div>
            <div className="text-[10px] text-slate-500">OK</div>
          </div>
          <div className="px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-amber-400">{statusSummary.due_soon}</div>
            <div className="text-[10px] text-slate-500">Due Soon</div>
          </div>
          <div className="px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-red-400">{statusSummary.overdue}</div>
            <div className="text-[10px] text-slate-500">Overdue</div>
          </div>
          <div className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
            <div className="text-xl font-bold text-purple-400">{statusSummary.critical}</div>
            <div className="text-[10px] text-slate-500">Critical</div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400'
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Maintenance Items */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <MaintenanceItemCard key={item.id} item={item} />
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <BatteryHealthMonitor battery={battery} />
          <CostProjection items={maintenanceItems} />
        </div>
      </div>

      {/* Calendar */}
      <MaintenanceCalendar events={calendarEvents} />
    </div>
  );
}
