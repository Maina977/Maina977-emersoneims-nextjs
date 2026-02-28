'use client';

/**
 * COMPREHENSIVE DIAGNOSIS HISTORY PANEL
 * Complete tracking of all diagnostic sessions with search, filter, and export
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DiagnosisEntry {
  id: string;
  timestamp: string;
  faultCode: string;
  faultTitle: string;
  severity: 'info' | 'warning' | 'critical' | 'shutdown';
  controller: string;
  model: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'escalated';
  resolution?: string;
  technician?: string;
  duration?: number; // minutes
  partsUsed?: string[];
  cost?: number;
  notes?: string;
}

// Sample comprehensive history data
const SAMPLE_HISTORY: DiagnosisEntry[] = [
  {
    id: '1',
    timestamp: '2026-02-28T09:30:00',
    faultCode: '1100',
    faultTitle: 'Low Oil Pressure',
    severity: 'shutdown',
    controller: 'DSE',
    model: 'DSE 7320',
    status: 'resolved',
    resolution: 'Replaced oil pressure sender and topped up oil level',
    technician: 'John Kamau',
    duration: 45,
    partsUsed: ['Oil Pressure Sender', 'Engine Oil 15W-40 5L'],
    cost: 12500,
    notes: 'Oil level was low due to minor leak at drain plug gasket. Replaced gasket and tightened to spec.',
  },
  {
    id: '2',
    timestamp: '2026-02-27T14:15:00',
    faultCode: '2210',
    faultTitle: 'High Coolant Temperature',
    severity: 'critical',
    controller: 'ComAp',
    model: 'InteliLite',
    status: 'resolved',
    resolution: 'Cleaned radiator fins and replaced thermostat',
    technician: 'Peter Ochieng',
    duration: 120,
    partsUsed: ['Thermostat 82°C', 'Coolant 10L'],
    cost: 18500,
    notes: 'Radiator was blocked with dust and debris. Thermostat was stuck closed.',
  },
  {
    id: '3',
    timestamp: '2026-02-26T11:45:00',
    faultCode: '3300',
    faultTitle: 'Battery Low Voltage',
    severity: 'warning',
    controller: 'Woodward',
    model: 'EasyGen 3500',
    status: 'resolved',
    resolution: 'Replaced batteries and cleaned terminals',
    technician: 'David Mwangi',
    duration: 60,
    partsUsed: ['Battery 12V 150Ah x2', 'Terminal Protector'],
    cost: 48000,
    notes: 'Batteries were 5 years old. Alternator checked and confirmed working correctly.',
  },
  {
    id: '4',
    timestamp: '2026-02-25T16:30:00',
    faultCode: '4120',
    faultTitle: 'Overspeed Shutdown',
    severity: 'shutdown',
    controller: 'SmartGen',
    model: 'HGM6100',
    status: 'resolved',
    resolution: 'Calibrated governor actuator and replaced speed sensor',
    technician: 'John Kamau',
    duration: 180,
    partsUsed: ['Magnetic Pickup Sensor', 'Governor Actuator'],
    cost: 85000,
    notes: 'Governor actuator was sluggish. Speed sensor reading was intermittent due to gap being too wide.',
  },
  {
    id: '5',
    timestamp: '2026-02-24T08:00:00',
    faultCode: '5050',
    faultTitle: 'Fail to Start',
    severity: 'critical',
    controller: 'CAT PowerWizard',
    model: 'PowerWizard 2.0',
    status: 'in-progress',
    technician: 'Peter Ochieng',
    notes: 'Investigating fuel system. Lift pump suspected.',
  },
  {
    id: '6',
    timestamp: '2026-02-23T13:20:00',
    faultCode: '6001',
    faultTitle: 'Generator Phase Imbalance',
    severity: 'warning',
    controller: 'Datakom',
    model: 'DKG-509',
    status: 'escalated',
    notes: 'Phase imbalance exceeds 15%. Waiting for specialist to inspect AVR and windings.',
  },
  {
    id: '7',
    timestamp: '2026-02-22T10:00:00',
    faultCode: '7100',
    faultTitle: 'Low Fuel Level',
    severity: 'warning',
    controller: 'Lovato',
    model: 'RGK800',
    status: 'resolved',
    resolution: 'Refueled generator - 500L diesel delivered',
    technician: 'David Mwangi',
    duration: 30,
    cost: 72500,
    notes: 'Scheduled fuel delivery arranged for weekly top-ups.',
  },
  {
    id: '8',
    timestamp: '2026-02-21T15:45:00',
    faultCode: '8200',
    faultTitle: 'Exhaust Temperature High',
    severity: 'critical',
    controller: 'Siemens',
    model: 'SIPROTEC',
    status: 'resolved',
    resolution: 'Replaced injector nozzles and cleaned air filter',
    technician: 'John Kamau',
    duration: 240,
    partsUsed: ['Injector Nozzle x6', 'Air Filter Element'],
    cost: 125000,
    notes: 'Two injectors were dribbling. Air filter was heavily contaminated.',
  },
];

interface HistoryPanelProps {
  history?: DiagnosisEntry[];
}

export default function HistoryPanel({ history = SAMPLE_HISTORY }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [controllerFilter, setControllerFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity' | 'cost'>('date');
  const [selectedEntry, setSelectedEntry] = useState<DiagnosisEntry | null>(null);

  // Get unique values for filters
  const controllers = useMemo(() => [...new Set(history.map(h => h.controller))], [history]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = history.filter(entry => {
      const matchesSearch = searchQuery === '' ||
        entry.faultCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.faultTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.resolution?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
      const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
      const matchesController = controllerFilter === 'all' || entry.controller === controllerFilter;

      return matchesSearch && matchesStatus && matchesSeverity && matchesController;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'severity':
          const severityOrder = { shutdown: 0, critical: 1, warning: 2, info: 3 };
          return severityOrder[a.severity] - severityOrder[b.severity];
        case 'cost':
          return (b.cost || 0) - (a.cost || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [history, searchQuery, statusFilter, severityFilter, controllerFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const resolved = history.filter(h => h.status === 'resolved').length;
    const totalCost = history.reduce((acc, h) => acc + (h.cost || 0), 0);
    const avgDuration = history.filter(h => h.duration).reduce((acc, h, _, arr) => acc + (h.duration || 0) / arr.length, 0);

    return { total: history.length, resolved, totalCost, avgDuration };
  }, [history]);

  const exportHistory = (format: 'csv' | 'json' | 'pdf') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(filteredHistory, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnosis-history-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['Date', 'Fault Code', 'Title', 'Severity', 'Controller', 'Status', 'Resolution', 'Technician', 'Cost (KES)'];
      const rows = filteredHistory.map(h => [
        new Date(h.timestamp).toLocaleString(),
        h.faultCode,
        h.faultTitle,
        h.severity,
        h.controller,
        h.status,
        h.resolution || '',
        h.technician || '',
        h.cost || '',
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagnosis-history-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const severityColors = {
    info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
    warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', text: 'text-amber-400' },
    critical: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
    shutdown: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
  };

  const statusColors = {
    pending: { bg: 'bg-slate-500/20', text: 'text-slate-400' },
    'in-progress': { bg: 'bg-blue-500/20', text: 'text-blue-400' },
    resolved: { bg: 'bg-green-500/20', text: 'text-green-400' },
    escalated: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <span className="text-3xl">📋</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Diagnosis History</h2>
            <p className="text-slate-400">Complete record of all diagnostic sessions</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportHistory('csv')}
            className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
          >
            Export CSV
          </button>
          <button
            onClick={() => exportHistory('json')}
            className="px-4 py-2 bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <div className="text-3xl font-bold text-cyan-400">{stats.total}</div>
          <div className="text-sm text-slate-400">Total Diagnoses</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-green-500/30">
          <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
          <div className="text-sm text-slate-400">Resolved</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-amber-500/30">
          <div className="text-3xl font-bold text-amber-400">KES {stats.totalCost.toLocaleString()}</div>
          <div className="text-sm text-slate-400">Total Cost</div>
        </div>
        <div className="p-4 bg-slate-900/50 rounded-xl border border-blue-500/30">
          <div className="text-3xl font-bold text-blue-400">{Math.round(stats.avgDuration)} min</div>
          <div className="text-sm text-slate-400">Avg Duration</div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search fault codes, descriptions, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          >
            <option value="all">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
            <option value="shutdown">Shutdown</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white"
          >
            <option value="date">Sort by Date</option>
            <option value="severity">Sort by Severity</option>
            <option value="cost">Sort by Cost</option>
          </select>
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length === 0 ? (
          <div className="p-12 bg-slate-900/50 rounded-xl border border-slate-700/50 text-center">
            <div className="text-4xl mb-4">📭</div>
            <div className="text-xl text-slate-400">No matching records found</div>
            <div className="text-sm text-slate-500 mt-2">Try adjusting your search or filters</div>
          </div>
        ) : (
          filteredHistory.map((entry) => (
            <motion.div
              key={entry.id}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${severityColors[entry.severity].bg} ${severityColors[entry.severity].border} hover:scale-[1.01]`}
              onClick={() => setSelectedEntry(entry)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`px-3 py-1 rounded-lg font-mono text-lg ${severityColors[entry.severity].bg} ${severityColors[entry.severity].text}`}>
                    {entry.faultCode}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{entry.faultTitle}</h4>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-slate-400">{entry.controller} - {entry.model}</span>
                      <span className={`px-2 py-0.5 rounded text-xs uppercase ${statusColors[entry.status].bg} ${statusColors[entry.status].text}`}>
                        {entry.status}
                      </span>
                    </div>
                    {entry.resolution && (
                      <p className="text-sm text-slate-400 mt-2 line-clamp-1">{entry.resolution}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                  {entry.cost && (
                    <div className="text-amber-400 font-medium mt-1">
                      KES {entry.cost.toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedEntry(null)}
          >
            <motion.div
              className="w-full max-w-2xl bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className={`p-6 ${severityColors[selectedEntry.severity].bg} border-b ${severityColors[selectedEntry.severity].border}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-lg font-mono text-2xl ${severityColors[selectedEntry.severity].text} bg-slate-900/50`}>
                      {selectedEntry.faultCode}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedEntry.faultTitle}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-300">{selectedEntry.controller}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-300">{selectedEntry.model}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEntry(null)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Status & Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400">Status</div>
                    <div className={`text-lg font-semibold capitalize ${statusColors[selectedEntry.status].text}`}>
                      {selectedEntry.status}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400">Date & Time</div>
                    <div className="text-lg font-semibold text-white">
                      {new Date(selectedEntry.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Technician & Duration */}
                {(selectedEntry.technician || selectedEntry.duration) && (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedEntry.technician && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-slate-400">Technician</div>
                        <div className="text-lg font-semibold text-white">{selectedEntry.technician}</div>
                      </div>
                    )}
                    {selectedEntry.duration && (
                      <div className="p-4 bg-slate-800/50 rounded-lg">
                        <div className="text-sm text-slate-400">Duration</div>
                        <div className="text-lg font-semibold text-white">{selectedEntry.duration} minutes</div>
                      </div>
                    )}
                  </div>
                )}

                {/* Resolution */}
                {selectedEntry.resolution && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="text-sm text-green-400 font-medium mb-2">Resolution</div>
                    <div className="text-white">{selectedEntry.resolution}</div>
                  </div>
                )}

                {/* Parts Used */}
                {selectedEntry.partsUsed && selectedEntry.partsUsed.length > 0 && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Parts Used</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.partsUsed.map((part, idx) => (
                        <span key={idx} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-300">
                          {part}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cost */}
                {selectedEntry.cost && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-amber-400">Total Cost</div>
                      <div className="text-2xl font-bold text-amber-400">
                        KES {selectedEntry.cost.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {selectedEntry.notes && (
                  <div className="p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-sm text-slate-400 mb-2">Technician Notes</div>
                    <div className="text-slate-300">{selectedEntry.notes}</div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-800/50 border-t border-slate-700 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30">
                  Export Details
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
