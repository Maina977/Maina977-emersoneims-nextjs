'use client';

/**
 * DATA RECORDING & GRAPHING PANEL
 * - Live sensor data graphing with multi-parameter overlay
 * - Event logging with timestamps
 * - Data export (CSV/JSON)
 * - Trend analysis
 * - Historical data playback
 * - Overload/shutdown event logging
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface DataPoint {
  timestamp: number;
  value: number;
}

interface SensorData {
  id: string;
  name: string;
  unit: string;
  color: string;
  data: DataPoint[];
  current: number;
  min: number;
  max: number;
  avg: number;
  visible: boolean;
}

interface EventLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'critical' | 'success';
  category: string;
  message: string;
  details?: Record<string, string | number>;
}

interface RecordingSession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  duration: string;
  status: 'recording' | 'stopped' | 'saved';
  dataPoints: number;
  fileSize: string;
}

// ==================== MULTI-PARAMETER GRAPH ====================
function MultiParameterGraph({ sensors }: { sensors: SensorData[] }) {
  const [timeRange, setTimeRange] = useState<'1m' | '5m' | '15m' | '1h' | '24h'>('5m');
  const [hoveredPoint, setHoveredPoint] = useState<{ sensor: string; value: number; time: string } | null>(null);

  const visibleSensors = sensors.filter(s => s.visible);
  const timeRangeSeconds = { '1m': 60, '5m': 300, '15m': 900, '1h': 3600, '24h': 86400 };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-xl">📈</span>
          </div>
          <h3 className="text-lg font-bold text-cyan-400 uppercase tracking-wider">Live Data Graph</h3>
        </div>

        <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
          {Object.keys(timeRangeSeconds).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range as any)}
              className={`px-3 py-1 rounded text-xs ${
                timeRange === range ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Graph Area */}
      <div className="relative h-64 bg-slate-950/80 rounded-xl overflow-hidden">
        {/* Grid */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Horizontal grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1="0"
              y1={`${y}%`}
              x2="100%"
              y2={`${y}%`}
              stroke="rgba(51,65,85,0.3)"
              strokeWidth="1"
            />
          ))}
          {/* Vertical grid lines */}
          {[0, 20, 40, 60, 80, 100].map((x) => (
            <line
              key={x}
              x1={`${x}%`}
              y1="0"
              x2={`${x}%`}
              y2="100%"
              stroke="rgba(51,65,85,0.2)"
              strokeWidth="1"
            />
          ))}
        </svg>

        {/* Data lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" preserveAspectRatio="none">
          {visibleSensors.map((sensor) => {
            const points = sensor.data.map((point, idx) => {
              const x = (idx / (sensor.data.length - 1)) * 300;
              const normalizedValue = ((point.value - sensor.min) / (sensor.max - sensor.min)) * 100;
              const y = 200 - (normalizedValue * 2);
              return `${x},${y}`;
            }).join(' ');

            return (
              <g key={sensor.id}>
                {/* Area fill */}
                <motion.path
                  d={`M 0,200 L 0,${200 - ((sensor.data[0]?.value - sensor.min) / (sensor.max - sensor.min)) * 200} ${points} L 300,200 Z`}
                  fill={`${sensor.color}15`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                {/* Line */}
                <motion.polyline
                  points={points}
                  fill="none"
                  stroke={sensor.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredPoint && (
          <div className="absolute top-4 right-4 p-2 bg-slate-900/90 border border-slate-700 rounded-lg text-xs">
            <div className="text-white">{hoveredPoint.sensor}</div>
            <div className="text-cyan-400 font-mono">{hoveredPoint.value}</div>
            <div className="text-slate-500">{hoveredPoint.time}</div>
          </div>
        )}

        {/* Current values on right edge */}
        <div className="absolute right-2 top-0 bottom-0 flex flex-col justify-around">
          {visibleSensors.map((sensor) => (
            <div
              key={sensor.id}
              className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px]"
              style={{ backgroundColor: `${sensor.color}30`, color: sensor.color }}
            >
              <span className="font-mono font-bold">{sensor.current.toFixed(1)}</span>
              <span className="opacity-70">{sensor.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {sensors.map((sensor) => (
          <button
            key={sensor.id}
            onClick={() => {
              // Toggle visibility
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
              sensor.visible ? 'bg-slate-800' : 'bg-slate-900 opacity-50'
            }`}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: sensor.color }}
            />
            <span className="text-white">{sensor.name}</span>
            <span className="text-slate-500">{sensor.current.toFixed(1)} {sensor.unit}</span>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700/50">
        {visibleSensors.slice(0, 4).map((sensor) => (
          <div key={sensor.id} className="text-center">
            <div className="text-xs text-slate-500 mb-1">{sensor.name}</div>
            <div className="grid grid-cols-3 gap-1 text-[10px]">
              <div>
                <div className="text-slate-400">Min</div>
                <div className="font-mono" style={{ color: sensor.color }}>{sensor.min}</div>
              </div>
              <div>
                <div className="text-slate-400">Avg</div>
                <div className="font-mono" style={{ color: sensor.color }}>{sensor.avg.toFixed(1)}</div>
              </div>
              <div>
                <div className="text-slate-400">Max</div>
                <div className="font-mono" style={{ color: sensor.color }}>{sensor.max}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== EVENT LOG ====================
function EventLogViewer({ events }: { events: EventLog[] }) {
  const [filter, setFilter] = useState<string>('all');

  const typeColors = {
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: 'ℹ️' },
    warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: '⚠️' },
    error: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: '❌' },
    critical: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: '🚨' },
    success: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400', icon: '✅' },
  };

  const filteredEvents = filter === 'all' ? events : events.filter(e => e.type === filter);

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-amber-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <h3 className="text-lg font-bold text-amber-400 uppercase tracking-wider">Event Log</h3>
        </div>

        <div className="flex gap-1">
          {['all', 'info', 'warning', 'error', 'critical'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-2 py-1 rounded text-xs capitalize ${
                filter === type ? 'bg-amber-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {filteredEvents.map((event, idx) => {
          const colors = typeColors[event.type];
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.02 }}
              className={`p-3 rounded-lg ${colors.bg} border ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{colors.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${colors.text}`}>{event.message}</span>
                    <span className="text-[10px] text-slate-500 ml-2">{event.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-500 px-1.5 py-0.5 bg-slate-800 rounded">
                      {event.category}
                    </span>
                    {event.details && Object.entries(event.details).map(([key, value]) => (
                      <span key={key} className="text-[10px] text-slate-500">
                        {key}: <span className="text-slate-300">{value}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ==================== RECORDING CONTROLS ====================
function RecordingControls({ sessions, isRecording, onStartRecording, onStopRecording, onExport }: {
  sessions: RecordingSession[];
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onExport: (format: 'csv' | 'json', sessionId?: string) => void;
}) {
  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-green-500/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center"
            animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
          >
            <span className="text-xl">{isRecording ? '🔴' : '⏺️'}</span>
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-green-400 uppercase tracking-wider">Data Recording</h3>
            <p className="text-xs text-slate-500">Capture & export sensor data</p>
          </div>
        </div>

        <div className="flex gap-2">
          {isRecording ? (
            <motion.button
              onClick={onStopRecording}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium text-sm flex items-center gap-2"
            >
              <motion.div
                className="w-3 h-3 bg-white rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              Stop Recording
            </motion.button>
          ) : (
            <motion.button
              onClick={onStartRecording}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium text-sm"
            >
              ⏺️ Start Recording
            </motion.button>
          )}

          <div className="relative group">
            <button className="px-4 py-2 bg-slate-800 text-white rounded-lg font-medium text-sm hover:bg-slate-700">
              📤 Export
            </button>
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block">
              <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => onExport('csv')}
                  className="block w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                >
                  Export as CSV
                </button>
                <button
                  onClick={() => onExport('json')}
                  className="block w-full px-4 py-2 text-sm text-left text-slate-300 hover:bg-slate-700"
                >
                  Export as JSON
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recording Status */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-3 h-3 bg-red-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-red-400 font-medium">Recording in progress...</span>
          </div>
          <div className="text-sm text-slate-400 font-mono">
            <span id="recording-time">00:05:32</span> • <span>1,845 points</span>
          </div>
        </motion.div>
      )}

      {/* Previous Sessions */}
      <div className="space-y-2">
        <h4 className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recent Sessions</h4>
        {sessions.map((session) => (
          <div
            key={session.id}
            className="p-3 bg-slate-950/50 rounded-lg flex items-center justify-between"
          >
            <div>
              <div className="text-sm text-white">{session.name}</div>
              <div className="text-xs text-slate-500">
                {session.startTime} • {session.duration} • {session.dataPoints} points
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">{session.fileSize}</span>
              <button
                onClick={() => onExport('csv', session.id)}
                className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 hover:text-white"
              >
                CSV
              </button>
              <button
                onClick={() => onExport('json', session.id)}
                className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 hover:text-white"
              >
                JSON
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== TREND ANALYSIS ====================
function TrendAnalysis({ sensors }: { sensors: SensorData[] }) {
  const trends = sensors.map(sensor => {
    const recentData = sensor.data.slice(-30);
    const firstHalf = recentData.slice(0, 15);
    const secondHalf = recentData.slice(15);
    const firstAvg = firstHalf.reduce((acc, d) => acc + d.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((acc, d) => acc + d.value, 0) / secondHalf.length;
    const trend = secondAvg - firstAvg;
    const trendPercent = ((trend / firstAvg) * 100) || 0;

    return {
      ...sensor,
      trend,
      trendPercent,
      direction: (trend > 0.5 ? 'up' : trend < -0.5 ? 'down' : 'stable') as 'up' | 'down' | 'stable',
    };
  });

  const directionIcons: Record<'up' | 'down' | 'stable', string> = { up: '📈', down: '📉', stable: '➡️' };
  const directionColors: Record<'up' | 'down' | 'stable', string> = {
    up: 'text-red-400',
    down: 'text-green-400',
    stable: 'text-slate-400',
  };

  return (
    <div className="p-6 bg-slate-900/50 rounded-xl border border-purple-500/30">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-xl">📊</span>
        </div>
        <h3 className="text-lg font-bold text-purple-400 uppercase tracking-wider">Trend Analysis</h3>
      </div>

      <div className="space-y-3">
        {trends.filter(t => t.visible).map((trend) => (
          <div
            key={trend.id}
            className="p-3 bg-slate-950/50 rounded-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: trend.color }}
              />
              <span className="text-sm text-white">{trend.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-mono text-white">{trend.current.toFixed(1)} {trend.unit}</div>
                <div className={`text-xs ${directionColors[trend.direction]}`}>
                  {trend.trendPercent > 0 ? '+' : ''}{trend.trendPercent.toFixed(1)}%
                </div>
              </div>
              <span className="text-xl">{directionIcons[trend.direction]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN DATA RECORDING PANEL ====================
export default function DataRecordingPanel() {
  const [isRecording, setIsRecording] = useState(false);

  const [sensors, setSensors] = useState<SensorData[]>([
    { id: 'voltage', name: 'Voltage', unit: 'V', color: '#06b6d4', data: [], current: 230, min: 220, max: 240, avg: 230, visible: true },
    { id: 'frequency', name: 'Frequency', unit: 'Hz', color: '#22c55e', data: [], current: 50, min: 49.8, max: 50.2, avg: 50, visible: true },
    { id: 'load', name: 'Load', unit: '%', color: '#f59e0b', data: [], current: 72, min: 45, max: 85, avg: 68, visible: true },
    { id: 'fuel', name: 'Fuel Rate', unit: 'L/h', color: '#ef4444', data: [], current: 18.5, min: 12, max: 25, avg: 18, visible: true },
    { id: 'coolant', name: 'Coolant', unit: '°C', color: '#8b5cf6', data: [], current: 85, min: 75, max: 95, avg: 82, visible: false },
    { id: 'oil_press', name: 'Oil Press', unit: 'PSI', color: '#ec4899', data: [], current: 45, min: 40, max: 55, avg: 46, visible: false },
  ]);

  const [events] = useState<EventLog[]>([
    { id: '1', timestamp: '14:32:15', type: 'info', category: 'System', message: 'Generator started successfully' },
    { id: '2', timestamp: '14:35:42', type: 'warning', category: 'Fuel', message: 'Fuel level below 30%', details: { level: '28%' } },
    { id: '3', timestamp: '14:40:08', type: 'info', category: 'Load', message: 'Load transfer completed', details: { load: '72%' } },
    { id: '4', timestamp: '14:45:33', type: 'error', category: 'Temperature', message: 'High coolant temperature alert', details: { temp: '98°C', threshold: '95°C' } },
    { id: '5', timestamp: '14:47:17', type: 'success', category: 'Temperature', message: 'Coolant temperature normalized', details: { temp: '88°C' } },
    { id: '6', timestamp: '14:52:00', type: 'critical', category: 'Protection', message: 'Overload protection activated', details: { load: '105%', duration: '3s' } },
    { id: '7', timestamp: '14:52:03', type: 'info', category: 'Protection', message: 'Load shed completed, normal operation resumed' },
    { id: '8', timestamp: '14:55:22', type: 'warning', category: 'Battery', message: 'Battery voltage slightly low', details: { voltage: '12.8V' } },
  ]);

  const [sessions] = useState<RecordingSession[]>([
    { id: '1', name: 'Morning Run 2024-01-15', startTime: '08:00', endTime: '12:00', duration: '4h 00m', status: 'saved', dataPoints: 14400, fileSize: '2.4 MB' },
    { id: '2', name: 'Load Test Session', startTime: '14:00', endTime: '15:30', duration: '1h 30m', status: 'saved', dataPoints: 5400, fileSize: '980 KB' },
    { id: '3', name: 'Night Shift Recording', startTime: '22:00', endTime: '06:00', duration: '8h 00m', status: 'saved', dataPoints: 28800, fileSize: '4.8 MB' },
  ]);

  // Simulate real-time data
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setSensors(prev => prev.map(sensor => {
        const newValue = sensor.current + (Math.random() - 0.5) * (sensor.max - sensor.min) * 0.02;
        const clampedValue = Math.max(sensor.min, Math.min(sensor.max, newValue));
        const newData = [...sensor.data.slice(-59), { timestamp: now, value: clampedValue }];
        const values = newData.map(d => d.value);

        return {
          ...sensor,
          current: clampedValue,
          data: newData,
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((a, b) => a + b, 0) / values.length,
        };
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartRecording = () => setIsRecording(true);
  const handleStopRecording = () => setIsRecording(false);
  const handleExport = (format: 'csv' | 'json', sessionId?: string) => {
    console.log(`Exporting ${format} for session ${sessionId || 'current'}`);
    // Implement actual export logic
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 20px rgba(20,184,166,0.5)', '0 0 40px rgba(6,182,212,0.5)', '0 0 20px rgba(20,184,166,0.5)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-3xl">📊</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-teal-400 uppercase tracking-wider">Data Recording & Graphing</h2>
            <p className="text-sm text-slate-500">Live graphs • Event logging • Trend analysis • Export</p>
          </div>
        </div>

        {isRecording && (
          <motion.div
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-red-400 font-medium">RECORDING</span>
          </motion.div>
        )}
      </div>

      {/* Main Graph */}
      <MultiParameterGraph sensors={sensors} />

      {/* Recording Controls + Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecordingControls
          sessions={sessions}
          isRecording={isRecording}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onExport={handleExport}
        />
        <EventLogViewer events={events} />
      </div>

      {/* Trend Analysis */}
      <TrendAnalysis sensors={sensors} />

      {/* Bottom Info */}
      <motion.div
        className="p-4 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 border border-teal-500/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">💾</span>
            <div>
              <div className="text-sm font-bold text-white">Comprehensive Data Logging</div>
              <div className="text-xs text-slate-400">
                All sensor data logged every second • Export to CSV/JSON • Automatic session recovery
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-500">
            <span>📊 {sensors.filter(s => s.visible).length} Active Sensors</span>
            <span>📋 {events.length} Events</span>
            <span>💾 {sessions.length} Sessions</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
