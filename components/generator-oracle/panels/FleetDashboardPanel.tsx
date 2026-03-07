'use client';

/**
 * Fleet Dashboard Panel - Comprehensive Fleet Management with Predictive AI
 *
 * Features:
 * - Fleet overview with health scores
 * - Predictive failure forecasting
 * - Maintenance scheduling
 * - Performance analytics
 * - AI-powered recommendations
 * - Exportable reports
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================

interface GeneratorAsset {
  id: string;
  name: string;
  serialNumber: string;
  brand: string;
  model: string;
  ecmModel: string;
  controllerModel: string;
  location: {
    site: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  status: 'running' | 'standby' | 'maintenance' | 'fault' | 'offline';
  healthScore: number; // 0-100
  lastMaintenance: string;
  nextMaintenance: string;
  engineHours: number;
  metrics: GeneratorMetrics;
  faultHistory: FaultHistoryEntry[];
  predictedFailures: PredictedFailure[];
}

interface GeneratorMetrics {
  powerOutput: number; // kW
  loadPercentage: number;
  fuelLevel: number;
  coolantTemp: number;
  oilPressure: number;
  voltage: number;
  frequency: number;
  rpm: number;
  efficiency: number;
}

interface FaultHistoryEntry {
  code: string;
  description: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  resolved: boolean;
  resolution?: string;
}

interface PredictedFailure {
  component: string;
  probability: number; // 0-100
  estimatedTimeframe: string;
  confidence: number;
  recommendedAction: string;
  basedOn: string[];
}

interface MaintenanceTask {
  id: string;
  generatorId: string;
  generatorName: string;
  type: 'preventive' | 'corrective' | 'predictive';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: string;
  estimatedDuration: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue';
  assignedTo?: string;
}

interface FleetAnalytics {
  totalGenerators: number;
  runningCount: number;
  standbyCount: number;
  maintenanceCount: number;
  faultCount: number;
  offlineCount: number;
  averageHealthScore: number;
  totalPowerCapacity: number;
  currentPowerOutput: number;
  averageEfficiency: number;
  upcomingMaintenanceTasks: number;
  overdueMaintenanceTasks: number;
  predictedFailuresNext30Days: number;
}

// ==================== MOCK DATA ====================

const MOCK_FLEET: GeneratorAsset[] = [
  {
    id: 'GEN-001',
    name: 'Primary Generator A',
    serialNumber: 'CAT-2023-001',
    brand: 'Caterpillar',
    model: 'C15 ACERT',
    ecmModel: 'CAT A5E2',
    controllerModel: 'DSE 8610',
    location: {
      site: 'Main Data Center',
      address: 'Westlands, Nairobi',
      coordinates: { lat: -1.2672, lng: 36.8077 }
    },
    status: 'running',
    healthScore: 94,
    lastMaintenance: '2026-02-15',
    nextMaintenance: '2026-03-15',
    engineHours: 4523,
    metrics: {
      powerOutput: 450,
      loadPercentage: 72,
      fuelLevel: 85,
      coolantTemp: 82,
      oilPressure: 45,
      voltage: 415,
      frequency: 50.1,
      rpm: 1500,
      efficiency: 94.2
    },
    faultHistory: [
      { code: 'DSE-3007', description: 'Low coolant temperature warning', timestamp: '2026-02-28', severity: 'warning', resolved: true, resolution: 'Thermostat replaced' }
    ],
    predictedFailures: [
      { component: 'Fuel Filter', probability: 45, estimatedTimeframe: '30-45 days', confidence: 78, recommendedAction: 'Schedule preventive replacement', basedOn: ['Engine hours trend', 'Fuel quality analysis'] }
    ]
  },
  {
    id: 'GEN-002',
    name: 'Backup Generator B',
    serialNumber: 'CUM-2022-045',
    brand: 'Cummins',
    model: 'QSK60-G21',
    ecmModel: 'Cummins CM2350',
    controllerModel: 'DSE 7320',
    location: {
      site: 'Industrial Park',
      address: 'Mombasa Road, Nairobi',
      coordinates: { lat: -1.3167, lng: 36.8833 }
    },
    status: 'standby',
    healthScore: 88,
    lastMaintenance: '2026-01-20',
    nextMaintenance: '2026-04-20',
    engineHours: 8921,
    metrics: {
      powerOutput: 0,
      loadPercentage: 0,
      fuelLevel: 92,
      coolantTemp: 28,
      oilPressure: 0,
      voltage: 0,
      frequency: 0,
      rpm: 0,
      efficiency: 0
    },
    faultHistory: [],
    predictedFailures: [
      { component: 'Alternator Bearings', probability: 35, estimatedTimeframe: '60-90 days', confidence: 72, recommendedAction: 'Monitor vibration levels', basedOn: ['Vibration analysis', 'Hours since last service'] }
    ]
  },
  {
    id: 'GEN-003',
    name: 'Emergency Unit C',
    serialNumber: 'PERK-2024-012',
    brand: 'Perkins',
    model: '4008-30TAG3',
    ecmModel: 'Perkins 2806',
    controllerModel: 'ComAp InteliGen 200',
    location: {
      site: 'Hospital Complex',
      address: 'Kenyatta Avenue, Nairobi',
      coordinates: { lat: -1.2864, lng: 36.8172 }
    },
    status: 'fault',
    healthScore: 42,
    lastMaintenance: '2025-12-10',
    nextMaintenance: '2026-03-10',
    engineHours: 12450,
    metrics: {
      powerOutput: 0,
      loadPercentage: 0,
      fuelLevel: 67,
      coolantTemp: 105,
      oilPressure: 18,
      voltage: 0,
      frequency: 0,
      rpm: 0,
      efficiency: 0
    },
    faultHistory: [
      { code: 'SPN-110-FMI-0', description: 'Engine coolant temperature very high', timestamp: '2026-03-07', severity: 'shutdown', resolved: false },
      { code: 'SPN-100-FMI-1', description: 'Oil pressure low warning', timestamp: '2026-03-07', severity: 'critical', resolved: false }
    ],
    predictedFailures: [
      { component: 'Water Pump', probability: 85, estimatedTimeframe: 'Immediate', confidence: 92, recommendedAction: 'Replace water pump immediately', basedOn: ['Temperature spike pattern', 'Pressure drop correlation'] },
      { component: 'Thermostat', probability: 65, estimatedTimeframe: 'Immediate', confidence: 85, recommendedAction: 'Inspect and replace if stuck', basedOn: ['Coolant flow analysis'] }
    ]
  },
  {
    id: 'GEN-004',
    name: 'Retail Unit D',
    serialNumber: 'FG-2023-089',
    brand: 'FG Wilson',
    model: 'P500E5',
    ecmModel: 'Perkins 2806',
    controllerModel: 'DSE 7310',
    location: {
      site: 'Shopping Mall',
      address: 'Garden City, Nairobi',
      coordinates: { lat: -1.2256, lng: 36.8762 }
    },
    status: 'running',
    healthScore: 91,
    lastMaintenance: '2026-02-01',
    nextMaintenance: '2026-05-01',
    engineHours: 3210,
    metrics: {
      powerOutput: 380,
      loadPercentage: 65,
      fuelLevel: 78,
      coolantTemp: 79,
      oilPressure: 48,
      voltage: 412,
      frequency: 50.0,
      rpm: 1500,
      efficiency: 92.8
    },
    faultHistory: [],
    predictedFailures: []
  },
  {
    id: 'GEN-005',
    name: 'Manufacturing Unit E',
    serialNumber: 'VOL-2021-156',
    brand: 'Volvo Penta',
    model: 'TAD1643VE',
    ecmModel: 'Volvo EMS2',
    controllerModel: 'SmartGen HGM9510',
    location: {
      site: 'Factory Complex',
      address: 'Athi River, Nairobi',
      coordinates: { lat: -1.4500, lng: 36.9833 }
    },
    status: 'maintenance',
    healthScore: 75,
    lastMaintenance: '2026-03-05',
    nextMaintenance: '2026-06-05',
    engineHours: 15678,
    metrics: {
      powerOutput: 0,
      loadPercentage: 0,
      fuelLevel: 100,
      coolantTemp: 25,
      oilPressure: 0,
      voltage: 0,
      frequency: 0,
      rpm: 0,
      efficiency: 0
    },
    faultHistory: [
      { code: 'SGM-2012', description: 'Scheduled maintenance reminder', timestamp: '2026-03-01', severity: 'info', resolved: true, resolution: 'Major service in progress' }
    ],
    predictedFailures: [
      { component: 'Injector Pump', probability: 55, estimatedTimeframe: '90-120 days', confidence: 68, recommendedAction: 'Schedule rebuild during next service', basedOn: ['Hours since overhaul', 'Fuel consumption trend'] }
    ]
  },
  {
    id: 'GEN-006',
    name: 'Telecom Site F',
    serialNumber: 'SDMO-2022-234',
    brand: 'SDMO',
    model: 'J200K',
    ecmModel: 'John Deere PowerTech',
    controllerModel: 'Nexys',
    location: {
      site: 'Cell Tower Site 47',
      address: 'Karen, Nairobi',
      coordinates: { lat: -1.3197, lng: 36.7086 }
    },
    status: 'standby',
    healthScore: 96,
    lastMaintenance: '2026-02-25',
    nextMaintenance: '2026-05-25',
    engineHours: 1890,
    metrics: {
      powerOutput: 0,
      loadPercentage: 0,
      fuelLevel: 95,
      coolantTemp: 30,
      oilPressure: 0,
      voltage: 0,
      frequency: 0,
      rpm: 0,
      efficiency: 0
    },
    faultHistory: [],
    predictedFailures: []
  }
];

const MOCK_MAINTENANCE_TASKS: MaintenanceTask[] = [
  {
    id: 'MT-001',
    generatorId: 'GEN-003',
    generatorName: 'Emergency Unit C',
    type: 'corrective',
    description: 'Water pump replacement and cooling system inspection',
    priority: 'urgent',
    scheduledDate: '2026-03-08',
    estimatedDuration: '4-6 hours',
    status: 'scheduled',
    assignedTo: 'John Mwangi'
  },
  {
    id: 'MT-002',
    generatorId: 'GEN-001',
    generatorName: 'Primary Generator A',
    type: 'preventive',
    description: 'Oil and filter change, 500-hour service',
    priority: 'medium',
    scheduledDate: '2026-03-15',
    estimatedDuration: '2-3 hours',
    status: 'scheduled',
    assignedTo: 'Peter Ochieng'
  },
  {
    id: 'MT-003',
    generatorId: 'GEN-005',
    generatorName: 'Manufacturing Unit E',
    type: 'preventive',
    description: 'Major service - 15,000 hour overhaul',
    priority: 'high',
    scheduledDate: '2026-03-05',
    estimatedDuration: '2-3 days',
    status: 'in_progress',
    assignedTo: 'Technical Team Alpha'
  },
  {
    id: 'MT-004',
    generatorId: 'GEN-002',
    generatorName: 'Backup Generator B',
    type: 'predictive',
    description: 'Alternator bearing inspection based on AI prediction',
    priority: 'low',
    scheduledDate: '2026-04-15',
    estimatedDuration: '3-4 hours',
    status: 'scheduled'
  }
];

// ==================== HELPER FUNCTIONS ====================

function getStatusColor(status: GeneratorAsset['status']): string {
  switch (status) {
    case 'running': return 'bg-green-500';
    case 'standby': return 'bg-blue-500';
    case 'maintenance': return 'bg-yellow-500';
    case 'fault': return 'bg-red-500';
    case 'offline': return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
}

function getHealthColor(score: number): string {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-yellow-400';
  if (score >= 50) return 'text-orange-400';
  return 'text-red-400';
}

function getPriorityColor(priority: MaintenanceTask['priority']): string {
  switch (priority) {
    case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

function calculateFleetAnalytics(fleet: GeneratorAsset[]): FleetAnalytics {
  const analytics: FleetAnalytics = {
    totalGenerators: fleet.length,
    runningCount: fleet.filter(g => g.status === 'running').length,
    standbyCount: fleet.filter(g => g.status === 'standby').length,
    maintenanceCount: fleet.filter(g => g.status === 'maintenance').length,
    faultCount: fleet.filter(g => g.status === 'fault').length,
    offlineCount: fleet.filter(g => g.status === 'offline').length,
    averageHealthScore: Math.round(fleet.reduce((sum, g) => sum + g.healthScore, 0) / fleet.length),
    totalPowerCapacity: 2800, // kW (example)
    currentPowerOutput: fleet.reduce((sum, g) => sum + g.metrics.powerOutput, 0),
    averageEfficiency: Math.round(fleet.filter(g => g.metrics.efficiency > 0).reduce((sum, g) => sum + g.metrics.efficiency, 0) / fleet.filter(g => g.metrics.efficiency > 0).length),
    upcomingMaintenanceTasks: MOCK_MAINTENANCE_TASKS.filter(t => t.status === 'scheduled').length,
    overdueMaintenanceTasks: MOCK_MAINTENANCE_TASKS.filter(t => t.status === 'overdue').length,
    predictedFailuresNext30Days: fleet.reduce((sum, g) => sum + g.predictedFailures.filter(p => p.estimatedTimeframe.includes('day') || p.estimatedTimeframe.includes('Immediate')).length, 0)
  };
  return analytics;
}

// ==================== COMPONENTS ====================

function GlassCard({ children, className = '', glow = false }: { children: React.ReactNode; className?: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden
        ${glow ? 'shadow-lg shadow-cyan-500/20' : 'shadow-lg shadow-black/20'}
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.8) 100%)'
      }}
    >
      {children}
    </motion.div>
  );
}

function StatCard({ label, value, icon, color = 'cyan', trend }: { label: string; value: string | number; icon: string; color?: string; trend?: { value: number; direction: 'up' | 'down' } }) {
  const colorClasses = {
    cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
    green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
    red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
    orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 text-orange-400',
  };

  return (
    <div className={`relative p-4 rounded-xl bg-gradient-to-br border ${colorClasses[color as keyof typeof colorClasses] || colorClasses.cyan}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.direction === 'up' ? 'text-green-400' : 'text-red-400'}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function GeneratorCard({ generator, onClick }: { generator: GeneratorAsset; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="relative p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-cyan-500/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-white">{generator.name}</h3>
          <p className="text-xs text-slate-400">{generator.brand} {generator.model}</p>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(generator.status)} text-white`}>
          {generator.status.charAt(0).toUpperCase() + generator.status.slice(1)}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <p className="text-xs text-slate-400 mb-1">Health Score</p>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${generator.healthScore}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full rounded-full ${generator.healthScore >= 90 ? 'bg-green-500' : generator.healthScore >= 70 ? 'bg-yellow-500' : generator.healthScore >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
            />
          </div>
          <p className={`text-xs mt-1 ${getHealthColor(generator.healthScore)}`}>{generator.healthScore}%</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Power Output</p>
          <p className="text-lg font-bold text-white">{generator.metrics.powerOutput} kW</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400">Load</p>
          <p className="font-medium text-white">{generator.metrics.loadPercentage}%</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400">Fuel</p>
          <p className="font-medium text-white">{generator.metrics.fuelLevel}%</p>
        </div>
        <div className="p-2 bg-slate-900/50 rounded">
          <p className="text-slate-400">Hours</p>
          <p className="font-medium text-white">{generator.engineHours.toLocaleString()}</p>
        </div>
      </div>

      {generator.predictedFailures.length > 0 && (
        <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <p className="text-xs text-orange-400 flex items-center gap-1">
            <span>⚠️</span>
            {generator.predictedFailures.length} predicted failure{generator.predictedFailures.length > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {generator.faultHistory.filter(f => !f.resolved).length > 0 && (
        <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-xs text-red-400 flex items-center gap-1">
            <span>🚨</span>
            {generator.faultHistory.filter(f => !f.resolved).length} active fault{generator.faultHistory.filter(f => !f.resolved).length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </motion.div>
  );
}

function GeneratorDetailModal({ generator, onClose }: { generator: GeneratorAsset; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'history' | 'maintenance'>('overview');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 p-6 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{generator.name}</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(generator.status)} text-white`}>
                  {generator.status.toUpperCase()}
                </span>
              </div>
              <p className="text-slate-400">{generator.brand} {generator.model} | S/N: {generator.serialNumber}</p>
              <p className="text-sm text-slate-500 mt-1">📍 {generator.location.site} - {generator.location.address}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span className="text-2xl text-slate-400">×</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            {(['overview', 'predictions', 'history', 'maintenance'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-cyan-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Health Score */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Health Score</h3>
                  <div className="flex items-center gap-4">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#334155" strokeWidth="8" />
                        <circle
                          cx="64" cy="64" r="56"
                          fill="none"
                          stroke={generator.healthScore >= 90 ? '#22c55e' : generator.healthScore >= 70 ? '#eab308' : generator.healthScore >= 50 ? '#f97316' : '#ef4444'}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${generator.healthScore * 3.52} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-3xl font-bold ${getHealthColor(generator.healthScore)}`}>{generator.healthScore}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm">ECM: {generator.ecmModel}</p>
                      <p className="text-slate-400 text-sm">Controller: {generator.controllerModel}</p>
                      <p className="text-slate-400 text-sm">Engine Hours: {generator.engineHours.toLocaleString()}</p>
                      <p className="text-slate-400 text-sm">Last Maintenance: {generator.lastMaintenance}</p>
                    </div>
                  </div>
                </div>

                {/* Live Metrics */}
                <h3 className="text-lg font-semibold text-white mb-3">Live Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Power Output</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.powerOutput} kW</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Load</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.loadPercentage}%</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Voltage</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.voltage} V</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Frequency</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.frequency} Hz</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">RPM</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.rpm}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Coolant Temp</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.coolantTemp}°C</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Oil Pressure</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.oilPressure} PSI</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Fuel Level</p>
                    <p className="text-xl font-bold text-white">{generator.metrics.fuelLevel}%</p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'predictions' && (
              <motion.div
                key="predictions"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">AI Failure Predictions</h3>
                {generator.predictedFailures.length === 0 ? (
                  <div className="p-8 text-center bg-green-500/10 border border-green-500/20 rounded-xl">
                    <span className="text-4xl">✓</span>
                    <p className="text-green-400 mt-2">No failures predicted in the near future</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {generator.predictedFailures.map((prediction, idx) => (
                      <div key={idx} className="p-4 bg-slate-800/50 border border-orange-500/20 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-orange-400">{prediction.component}</h4>
                          <div className="text-right">
                            <p className="text-lg font-bold text-white">{prediction.probability}%</p>
                            <p className="text-xs text-slate-400">probability</p>
                          </div>
                        </div>
                        <p className="text-sm text-white mb-2">Timeframe: {prediction.estimatedTimeframe}</p>
                        <p className="text-sm text-slate-400 mb-3">Confidence: {prediction.confidence}%</p>
                        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                          <p className="text-sm text-cyan-400"><strong>Recommendation:</strong> {prediction.recommendedAction}</p>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-slate-500">Based on: {prediction.basedOn.join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Fault History</h3>
                {generator.faultHistory.length === 0 ? (
                  <div className="p-8 text-center bg-slate-800/50 rounded-xl">
                    <p className="text-slate-400">No fault history recorded</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {generator.faultHistory.map((fault, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${
                        fault.resolved ? 'bg-slate-800/50 border-slate-700' : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              fault.severity === 'shutdown' ? 'bg-red-500 text-white' :
                              fault.severity === 'critical' ? 'bg-orange-500 text-white' :
                              fault.severity === 'warning' ? 'bg-yellow-500 text-black' :
                              'bg-blue-500 text-white'
                            }`}>{fault.severity.toUpperCase()}</span>
                            <span className="ml-2 font-mono text-sm text-white">{fault.code}</span>
                          </div>
                          <span className="text-xs text-slate-400">{fault.timestamp}</span>
                        </div>
                        <p className="text-white text-sm">{fault.description}</p>
                        {fault.resolved && fault.resolution && (
                          <p className="text-xs text-green-400 mt-2">✓ Resolved: {fault.resolution}</p>
                        )}
                        {!fault.resolved && (
                          <p className="text-xs text-red-400 mt-2">⚠ Active - requires attention</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'maintenance' && (
              <motion.div
                key="maintenance"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">Maintenance Schedule</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Last Maintenance</p>
                    <p className="text-lg font-bold text-white">{generator.lastMaintenance}</p>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-xl">
                    <p className="text-xs text-slate-400">Next Scheduled</p>
                    <p className="text-lg font-bold text-cyan-400">{generator.nextMaintenance}</p>
                  </div>
                </div>

                <h4 className="font-semibold text-white mb-3">Scheduled Tasks</h4>
                {MOCK_MAINTENANCE_TASKS.filter(t => t.generatorId === generator.id).length === 0 ? (
                  <div className="p-8 text-center bg-slate-800/50 rounded-xl">
                    <p className="text-slate-400">No pending maintenance tasks</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {MOCK_MAINTENANCE_TASKS.filter(t => t.generatorId === generator.id).map(task => (
                      <div key={task.id} className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-400">{task.scheduledDate}</span>
                        </div>
                        <p className="text-white">{task.description}</p>
                        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
                          <span>Duration: {task.estimatedDuration}</span>
                          {task.assignedTo && <span>Assigned: {task.assignedTo}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AIInsightsPanel({ fleet }: { fleet: GeneratorAsset[] }) {
  const insights = useMemo(() => {
    const results: { type: 'warning' | 'recommendation' | 'optimization'; icon: string; title: string; description: string }[] = [];

    // Find critical issues
    const faultGenerators = fleet.filter(g => g.status === 'fault');
    if (faultGenerators.length > 0) {
      results.push({
        type: 'warning',
        icon: '🚨',
        title: `${faultGenerators.length} Generator${faultGenerators.length > 1 ? 's' : ''} in Fault State`,
        description: `Immediate attention required for: ${faultGenerators.map(g => g.name).join(', ')}`
      });
    }

    // Predictive maintenance alerts
    const predictedFailures = fleet.flatMap(g => g.predictedFailures.filter(p => p.probability > 60));
    if (predictedFailures.length > 0) {
      results.push({
        type: 'recommendation',
        icon: '🔮',
        title: `${predictedFailures.length} High-Probability Failure${predictedFailures.length > 1 ? 's' : ''} Predicted`,
        description: 'AI analysis suggests scheduling preventive maintenance to avoid unplanned downtime'
      });
    }

    // Efficiency optimization
    const runningGens = fleet.filter(g => g.status === 'running');
    const avgEfficiency = runningGens.length > 0
      ? runningGens.reduce((sum, g) => sum + g.metrics.efficiency, 0) / runningGens.length
      : 0;
    if (avgEfficiency > 0 && avgEfficiency < 92) {
      results.push({
        type: 'optimization',
        icon: '⚡',
        title: 'Efficiency Optimization Available',
        description: `Average fleet efficiency is ${avgEfficiency.toFixed(1)}%. Adjusting load distribution could improve by 3-5%`
      });
    }

    // Maintenance due
    const overdueMaint = fleet.filter(g => new Date(g.nextMaintenance) < new Date());
    if (overdueMaint.length > 0) {
      results.push({
        type: 'warning',
        icon: '📅',
        title: `${overdueMaint.length} Overdue Maintenance`,
        description: `Schedule maintenance for: ${overdueMaint.map(g => g.name).join(', ')}`
      });
    }

    // Add general recommendation if no issues
    if (results.length === 0) {
      results.push({
        type: 'recommendation',
        icon: '✓',
        title: 'Fleet Operating Normally',
        description: 'All generators are within operational parameters. Continue regular monitoring.'
      });
    }

    return results;
  }, [fleet]);

  return (
    <div className="space-y-3">
      {insights.map((insight, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`p-4 rounded-xl border ${
            insight.type === 'warning' ? 'bg-red-500/10 border-red-500/30' :
            insight.type === 'recommendation' ? 'bg-cyan-500/10 border-cyan-500/30' :
            'bg-green-500/10 border-green-500/30'
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl">{insight.icon}</span>
            <div>
              <h4 className={`font-semibold ${
                insight.type === 'warning' ? 'text-red-400' :
                insight.type === 'recommendation' ? 'text-cyan-400' :
                'text-green-400'
              }`}>{insight.title}</h4>
              <p className="text-sm text-slate-400 mt-1">{insight.description}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function FleetDashboardPanel() {
  const [fleet] = useState<GeneratorAsset[]>(MOCK_FLEET);
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorAsset | null>(null);
  const [activeView, setActiveView] = useState<'grid' | 'map' | 'analytics'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | GeneratorAsset['status']>('all');

  const analytics = useMemo(() => calculateFleetAnalytics(fleet), [fleet]);

  const filteredFleet = useMemo(() => {
    if (filterStatus === 'all') return fleet;
    return fleet.filter(g => g.status === filterStatus);
  }, [fleet, filterStatus]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6" glow>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🏭</span>
              Fleet Dashboard
            </h1>
            <p className="text-slate-400 mt-1">Real-time monitoring with predictive AI analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="all">All Generators</option>
              <option value="running">Running</option>
              <option value="standby">Standby</option>
              <option value="maintenance">Maintenance</option>
              <option value="fault">Fault</option>
              <option value="offline">Offline</option>
            </select>
            <div className="flex rounded-lg overflow-hidden border border-slate-700">
              {(['grid', 'map', 'analytics'] as const).map(view => (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeView === view ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {view === 'grid' ? '📋' : view === 'map' ? '🗺️' : '📊'} {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
            <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
              <span>📥</span> Export Report
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <StatCard label="Total Generators" value={analytics.totalGenerators} icon="🔢" color="cyan" />
        <StatCard label="Running" value={analytics.runningCount} icon="▶️" color="green" trend={{ value: 5, direction: 'up' }} />
        <StatCard label="In Fault" value={analytics.faultCount} icon="⚠️" color="red" />
        <StatCard label="Avg Health" value={`${analytics.averageHealthScore}%`} icon="💚" color={analytics.averageHealthScore >= 80 ? 'green' : 'yellow'} />
        <StatCard label="Power Output" value={`${analytics.currentPowerOutput} kW`} icon="⚡" color="blue" />
        <StatCard label="Predicted Failures" value={analytics.predictedFailuresNext30Days} icon="🔮" color="orange" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Generator Grid or Analytics */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6">
            <AnimatePresence mode="wait">
              {activeView === 'grid' && (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Fleet Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredFleet.map(generator => (
                      <GeneratorCard
                        key={generator.id}
                        generator={generator}
                        onClick={() => setSelectedGenerator(generator)}
                      />
                    ))}
                  </div>
                  {filteredFleet.length === 0 && (
                    <div className="p-8 text-center text-slate-400">
                      No generators match the selected filter
                    </div>
                  )}
                </motion.div>
              )}

              {activeView === 'map' && (
                <motion.div
                  key="map"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Geographic Distribution</h2>
                  <div className="h-96 bg-slate-800 rounded-xl flex items-center justify-center">
                    <div className="text-center text-slate-400">
                      <span className="text-6xl mb-4 block">🗺️</span>
                      <p>Map integration available with Mapbox GL</p>
                      <p className="text-sm mt-2">Shows generator locations across Nairobi region</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'analytics' && (
                <motion.div
                  key="analytics"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4">Performance Analytics</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-2">Average Efficiency</p>
                      <p className="text-3xl font-bold text-green-400">{analytics.averageEfficiency}%</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-xl">
                      <p className="text-xs text-slate-400 mb-2">Total Capacity</p>
                      <p className="text-3xl font-bold text-cyan-400">{analytics.totalPowerCapacity} kW</p>
                    </div>
                  </div>

                  <div className="h-48 bg-slate-800/50 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-2">Power Output Trend (24h)</p>
                    <div className="h-full flex items-end gap-1">
                      {Array.from({ length: 24 }, (_, i) => (
                        <div
                          key={i}
                          className="flex-1 bg-cyan-500/50 rounded-t"
                          style={{ height: `${30 + Math.random() * 70}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>
        </div>

        {/* Right: AI Insights & Maintenance */}
        <div className="space-y-6">
          {/* AI Insights */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>🧠</span> AI Insights
            </h2>
            <AIInsightsPanel fleet={fleet} />
          </GlassCard>

          {/* Upcoming Maintenance */}
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>📅</span> Upcoming Maintenance
            </h2>
            <div className="space-y-3">
              {MOCK_MAINTENANCE_TASKS.filter(t => t.status !== 'completed').slice(0, 4).map(task => (
                <div key={task.id} className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="flex items-start justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-400">{task.scheduledDate}</span>
                  </div>
                  <p className="text-sm text-white">{task.generatorName}</p>
                  <p className="text-xs text-slate-400 mt-1">{task.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Generator Detail Modal */}
      <AnimatePresence>
        {selectedGenerator && (
          <GeneratorDetailModal
            generator={selectedGenerator}
            onClose={() => setSelectedGenerator(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
