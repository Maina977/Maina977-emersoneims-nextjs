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
interface MaintenanceItem {
  id: string;
  name: string;
  category: 'engine' | 'electrical' | 'fuel' | 'cooling' | 'filters' | 'belts' | 'fluids';
  lastService: string;
  nextService: string;
  intervalHours: number;
  currentHours: number;
  hoursRemaining: number;
  status: 'ok' | 'due_soon' | 'overdue' | 'critical';
  cost: number;
  parts: string[];
  icon: string;
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
      className={`p-4 rounded-xl ${colors.bg} border ${colors.border}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{item.icon}</span>
          <div>
            <h4 className="font-medium text-white">{item.name}</h4>
            <p className="text-xs text-slate-500 capitalize">{item.category}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${colors.bg} ${colors.text} border ${colors.border}`}>
          {item.status.replace('_', ' ')}
        </span>
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
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
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
      </div>

      {/* Next Service Date */}
      <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
        <span className="text-slate-500">Next Service:</span>
        <span className={colors.text}>{item.nextService}</span>
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
        <button className="text-amber-400 hover:text-amber-300">Run Battery Test →</button>
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
    { id: '1', name: 'Engine Oil Change', category: 'fluids', lastService: '2024-01-01', nextService: '2024-02-15', intervalHours: 250, currentHours: 220, hoursRemaining: 30, status: 'due_soon', cost: 8500, parts: ['Oil Filter', '15W-40 Oil (15L)'], icon: '🛢️' },
    { id: '2', name: 'Air Filter Replacement', category: 'filters', lastService: '2023-12-15', nextService: '2024-03-15', intervalHours: 500, currentHours: 320, hoursRemaining: 180, status: 'ok', cost: 4500, parts: ['Air Filter Element'], icon: '💨' },
    { id: '3', name: 'Fuel Filter Change', category: 'filters', lastService: '2023-11-20', nextService: '2024-02-20', intervalHours: 500, currentHours: 480, hoursRemaining: 20, status: 'critical', cost: 3500, parts: ['Fuel Filter', 'Seals Kit'], icon: '⛽' },
    { id: '4', name: 'Coolant System Flush', category: 'cooling', lastService: '2023-08-01', nextService: '2024-08-01', intervalHours: 2000, currentHours: 1200, hoursRemaining: 800, status: 'ok', cost: 12000, parts: ['Coolant (20L)', 'Thermostat', 'Hoses'], icon: '❄️' },
    { id: '5', name: 'Drive Belt Inspection', category: 'belts', lastService: '2023-10-15', nextService: '2024-01-15', intervalHours: 1000, currentHours: 1050, hoursRemaining: -50, status: 'overdue', cost: 6500, parts: ['V-Belt Set', 'Tensioner'], icon: '⚙️' },
    { id: '6', name: 'Valve Clearance Adjustment', category: 'engine', lastService: '2023-06-01', nextService: '2024-06-01', intervalHours: 3000, currentHours: 2100, hoursRemaining: 900, status: 'ok', cost: 25000, parts: ['Valve Cover Gasket', 'Feeler Gauges'], icon: '🔧' },
    { id: '7', name: 'Injector Service', category: 'fuel', lastService: '2023-04-01', nextService: '2024-04-01', intervalHours: 4000, currentHours: 3500, hoursRemaining: 500, status: 'ok', cost: 45000, parts: ['Injector Nozzles', 'Seals'], icon: '💉' },
    { id: '8', name: 'Alternator Inspection', category: 'electrical', lastService: '2023-09-01', nextService: '2024-03-01', intervalHours: 2000, currentHours: 1800, hoursRemaining: 200, status: 'due_soon', cost: 15000, parts: ['Bearings', 'Brush Set', 'AVR Check'], icon: '⚡' },
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
    { id: 'fuel', label: 'Fuel', icon: '⛽' },
    { id: 'cooling', label: 'Cooling', icon: '❄️' },
    { id: 'filters', label: 'Filters', icon: '🎛️' },
    { id: 'belts', label: 'Belts', icon: '⚙️' },
    { id: 'fluids', label: 'Fluids', icon: '🛢️' },
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
