'use client';

/**
 * REMOTE CONNECTIVITY PANEL
 * - GSM/WiFi Module Management
 * - Multi-Site Dashboard Integration
 * - Remote Start/Stop Commands
 * - Fleet Monitoring
 * - Security & Access Control
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== TYPES ====================
interface RemoteSite {
  id: string;
  name: string;
  location: string;
  county: string;
  status: 'online' | 'offline' | 'warning' | 'critical';
  generator: {
    model: string;
    kva: number;
    status: 'running' | 'standby' | 'fault' | 'maintenance';
    load: number;
    fuelLevel: number;
    hours: number;
    voltage: number;
    frequency: number;
  };
  connection: {
    type: 'GSM' | 'WiFi' | 'Ethernet' | 'Satellite';
    signal: number;
    latency: number;
    lastSeen: string;
  };
  alerts: number;
  coordinates: { lat: number; lng: number };
}

interface ConnectivityModule {
  type: 'GSM' | 'WiFi' | 'Bluetooth' | 'Ethernet';
  status: 'connected' | 'connecting' | 'disconnected' | 'error';
  signal: number;
  details: Record<string, string | number>;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  ip: string;
  details: string;
  status: 'success' | 'failed' | 'warning';
}

// ==================== CONNECTION STATUS CARD ====================
function ConnectionStatusCard({ module }: { module: ConnectivityModule }) {
  const statusColors = {
    connected: { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', glow: 'rgba(34,197,94,0.3)' },
    connecting: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', glow: 'rgba(245,158,11,0.3)' },
    disconnected: { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-400', glow: 'transparent' },
    error: { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', glow: 'rgba(239,68,68,0.3)' },
  };

  const icons = { GSM: '📶', WiFi: '📡', Bluetooth: '🔵', Ethernet: '🔌' };
  const colors = statusColors[module.status];

  return (
    <motion.div
      className={`p-4 rounded-xl border ${colors.bg} ${colors.border}`}
      style={{ boxShadow: `0 0 20px ${colors.glow}` }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{icons[module.type]}</span>
          <span className="font-bold text-white">{module.type}</span>
        </div>
        <div className={`flex items-center gap-1 ${colors.text}`}>
          <motion.div
            className={`w-2 h-2 rounded-full ${colors.border.replace('border', 'bg')}`}
            animate={{ scale: module.status === 'connecting' ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.5, repeat: module.status === 'connecting' ? Infinity : 0 }}
          />
          <span className="text-xs uppercase">{module.status}</span>
        </div>
      </div>

      {/* Signal Strength */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Signal Strength</span>
          <span className={colors.text}>{module.signal}%</span>
        </div>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className={`flex-1 h-${bar + 1} rounded-sm ${
                module.signal >= bar * 20
                  ? colors.border.replace('border', 'bg')
                  : 'bg-slate-700'
              }`}
              style={{ height: `${bar * 4 + 4}px` }}
            />
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-1">
        {Object.entries(module.details).map(([key, value]) => (
          <div key={key} className="flex justify-between text-xs">
            <span className="text-slate-500 capitalize">{key.replace('_', ' ')}</span>
            <span className="text-white font-mono">{value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==================== SITE CARD ====================
function SiteCard({ site, onSelect }: { site: RemoteSite; onSelect: (site: RemoteSite) => void }) {
  const statusColors = {
    online: 'from-green-500/20 to-emerald-500/20 border-green-500/50',
    offline: 'from-slate-500/20 to-slate-600/20 border-slate-500/50',
    warning: 'from-amber-500/20 to-orange-500/20 border-amber-500/50',
    critical: 'from-red-500/20 to-rose-500/20 border-red-500/50',
  };

  const genStatusColors = {
    running: 'bg-green-500',
    standby: 'bg-blue-500',
    fault: 'bg-red-500',
    maintenance: 'bg-amber-500',
  };

  return (
    <motion.div
      onClick={() => onSelect(site)}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`p-4 rounded-xl bg-gradient-to-br ${statusColors[site.status]} border cursor-pointer`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-bold text-white">{site.name}</h4>
          <p className="text-xs text-slate-400">{site.location}, {site.county}</p>
        </div>
        <div className="flex items-center gap-2">
          {site.alerts > 0 && (
            <motion.span
              className="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              {site.alerts}
            </motion.span>
          )}
          <div className={`w-3 h-3 rounded-full ${genStatusColors[site.generator.status]}`} />
        </div>
      </div>

      {/* Generator Status */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-white">{site.generator.load}%</div>
          <div className="text-[10px] text-slate-500">Load</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-amber-400">{site.generator.fuelLevel}%</div>
          <div className="text-[10px] text-slate-500">Fuel</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-cyan-400">{site.generator.voltage}V</div>
          <div className="text-[10px] text-slate-500">Voltage</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-mono font-bold text-green-400">{site.generator.frequency}Hz</div>
          <div className="text-[10px] text-slate-500">Freq</div>
        </div>
      </div>

      {/* Connection Info */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">{site.connection.type}</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4].map((bar) => (
              <div
                key={bar}
                className={`w-1 rounded-sm ${
                  site.connection.signal >= bar * 25 ? 'bg-green-500' : 'bg-slate-700'
                }`}
                style={{ height: `${bar * 2 + 4}px` }}
              />
            ))}
          </div>
        </div>
        <span className="text-slate-500">{site.connection.latency}ms</span>
      </div>
    </motion.div>
  );
}

// ==================== REMOTE CONTROL PANEL ====================
function RemoteControlPanel({ site, onCommand }: {
  site: RemoteSite | null;
  onCommand: (command: string) => void;
}) {
  if (!site) {
    return (
      <div className="p-8 text-center text-slate-500">
        <span className="text-4xl block mb-2">📍</span>
        Select a site to view remote controls
      </div>
    );
  }

  const commands = [
    { id: 'start', icon: '▶️', label: 'Remote Start', color: 'green', enabled: site.generator.status === 'standby' },
    { id: 'stop', icon: '⏹️', label: 'Remote Stop', color: 'red', enabled: site.generator.status === 'running' },
    { id: 'test', icon: '🧪', label: 'Test Run', color: 'blue', enabled: site.generator.status === 'standby' },
    { id: 'transfer', icon: '🔀', label: 'Load Transfer', color: 'purple', enabled: true },
    { id: 'reset', icon: '🔄', label: 'Reset Alarm', color: 'amber', enabled: true },
    { id: 'silence', icon: '🔇', label: 'Silence Alarm', color: 'slate', enabled: true },
  ];

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-cyan-500/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-bold text-cyan-400">{site.name}</h4>
          <p className="text-xs text-slate-500">{site.generator.model} - {site.generator.kva} kVA</p>
        </div>
        <span className={`px-2 py-1 rounded text-xs uppercase ${
          site.generator.status === 'running' ? 'bg-green-500/20 text-green-400' :
          site.generator.status === 'standby' ? 'bg-blue-500/20 text-blue-400' :
          site.generator.status === 'fault' ? 'bg-red-500/20 text-red-400' :
          'bg-amber-500/20 text-amber-400'
        }`}>
          {site.generator.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {commands.map((cmd) => (
          <motion.button
            key={cmd.id}
            onClick={() => cmd.enabled && onCommand(cmd.id)}
            disabled={!cmd.enabled}
            whileHover={cmd.enabled ? { scale: 1.05 } : {}}
            whileTap={cmd.enabled ? { scale: 0.95 } : {}}
            className={`p-3 rounded-lg text-center transition-all ${
              cmd.enabled
                ? `bg-${cmd.color}-500/20 border border-${cmd.color}-500/50 hover:bg-${cmd.color}-500/30 text-white`
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-600 cursor-not-allowed'
            }`}
          >
            <span className="text-2xl block mb-1">{cmd.icon}</span>
            <span className="text-xs">{cmd.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <span className="text-lg font-mono text-white">{site.generator.hours.toLocaleString()}</span>
          <span className="text-[10px] text-slate-500 block">Hours</span>
        </div>
        <div className="p-2 bg-slate-950/50 rounded-lg text-center">
          <span className="text-lg font-mono text-white">{site.connection.lastSeen}</span>
          <span className="text-[10px] text-slate-500 block">Last Update</span>
        </div>
      </div>
    </div>
  );
}

// ==================== AUDIT LOG ====================
function AuditLog({ entries }: { entries: AuditLogEntry[] }) {
  const statusIcons = {
    success: { icon: '✅', color: 'text-green-400' },
    failed: { icon: '❌', color: 'text-red-400' },
    warning: { icon: '⚠️', color: 'text-amber-400' },
  };

  return (
    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
      <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
        <span>📋</span> Security & Audit Trail
      </h4>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {entries.map((entry) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 bg-slate-950/50 rounded-lg flex items-start gap-3"
          >
            <span className={statusIcons[entry.status].color}>
              {statusIcons[entry.status].icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white font-medium">{entry.action}</span>
                <span className="text-[10px] text-slate-500">{entry.timestamp}</span>
              </div>
              <div className="text-xs text-slate-400 truncate">{entry.details}</div>
              <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                <span>👤 {entry.user}</span>
                <span>•</span>
                <span>🌐 {entry.ip}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ==================== MAIN REMOTE CONNECTIVITY PANEL ====================
export default function RemoteConnectivityPanel() {
  const [selectedSite, setSelectedSite] = useState<RemoteSite | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  const [connectivityModules] = useState<ConnectivityModule[]>([
    {
      type: 'GSM',
      status: 'connected',
      signal: 85,
      details: { carrier: 'Safaricom', sim: '+254 768 860 665', network: '4G LTE', data: '2.4GB used' },
    },
    {
      type: 'WiFi',
      status: 'connected',
      signal: 92,
      details: { ssid: 'EmersonEIMS_Network', ip: '192.168.1.105', mac: 'A4:C3:F0:12:34:56' },
    },
    {
      type: 'Bluetooth',
      status: 'disconnected',
      signal: 0,
      details: { device: 'Not connected', range: '10m max' },
    },
    {
      type: 'Ethernet',
      status: 'connected',
      signal: 100,
      details: { ip: '10.0.0.50', gateway: '10.0.0.1', dns: '8.8.8.8', speed: '1Gbps' },
    },
  ]);

  const [sites] = useState<RemoteSite[]>([
    {
      id: '1',
      name: 'Kenyatta National Hospital',
      location: 'Ngong Road',
      county: 'Nairobi',
      status: 'online',
      generator: { model: 'CAT C18', kva: 500, status: 'running', load: 72, fuelLevel: 65, hours: 4582, voltage: 415, frequency: 50.0 },
      connection: { type: 'GSM', signal: 90, latency: 45, lastSeen: '2s ago' },
      alerts: 0,
      coordinates: { lat: -1.2991, lng: 36.8064 },
    },
    {
      id: '2',
      name: 'Sarova Stanley Hotel',
      location: 'Kimathi Street',
      county: 'Nairobi',
      status: 'warning',
      generator: { model: 'Perkins 2206A', kva: 350, status: 'running', load: 85, fuelLevel: 28, hours: 3240, voltage: 412, frequency: 49.9 },
      connection: { type: 'WiFi', signal: 75, latency: 22, lastSeen: '5s ago' },
      alerts: 2,
      coordinates: { lat: -1.2833, lng: 36.8219 },
    },
    {
      id: '3',
      name: 'Safaricom Data Center',
      location: 'Enterprise Road',
      county: 'Nairobi',
      status: 'online',
      generator: { model: 'Cummins QSK60', kva: 2000, status: 'standby', load: 0, fuelLevel: 95, hours: 892, voltage: 0, frequency: 0 },
      connection: { type: 'Ethernet', signal: 100, latency: 5, lastSeen: '1s ago' },
      alerts: 0,
      coordinates: { lat: -1.3031, lng: 36.8517 },
    },
    {
      id: '4',
      name: 'Mombasa Port Authority',
      location: 'Kilindini',
      county: 'Mombasa',
      status: 'critical',
      generator: { model: 'MTU 16V4000', kva: 1500, status: 'fault', load: 0, fuelLevel: 42, hours: 6780, voltage: 0, frequency: 0 },
      connection: { type: 'GSM', signal: 65, latency: 120, lastSeen: '30s ago' },
      alerts: 5,
      coordinates: { lat: -4.0435, lng: 39.6682 },
    },
    {
      id: '5',
      name: 'Lake Nakuru Lodge',
      location: 'Lake Nakuru NP',
      county: 'Nakuru',
      status: 'online',
      generator: { model: 'FG Wilson P200', kva: 200, status: 'running', load: 45, fuelLevel: 88, hours: 2100, voltage: 408, frequency: 50.1 },
      connection: { type: 'Satellite', signal: 55, latency: 350, lastSeen: '15s ago' },
      alerts: 0,
      coordinates: { lat: -0.3604, lng: 36.0800 },
    },
    {
      id: '6',
      name: 'Kisumu Airport',
      location: 'Kisumu International',
      county: 'Kisumu',
      status: 'offline',
      generator: { model: 'Kohler 150REZXB', kva: 150, status: 'maintenance', load: 0, fuelLevel: 60, hours: 5430, voltage: 0, frequency: 0 },
      connection: { type: 'GSM', signal: 0, latency: 0, lastSeen: '2h ago' },
      alerts: 1,
      coordinates: { lat: -0.0861, lng: 34.7289 },
    },
  ]);

  const [auditLog] = useState<AuditLogEntry[]>([
    { id: '1', timestamp: '14:32:15', action: 'Remote Start', user: 'admin@emersoneims.com', ip: '41.139.218.45', details: 'Generator started at Kenyatta National Hospital', status: 'success' },
    { id: '2', timestamp: '14:28:42', action: 'Configuration Change', user: 'tech.john@emersoneims.com', ip: '197.248.15.22', details: 'Updated low fuel threshold from 20% to 25%', status: 'success' },
    { id: '3', timestamp: '14:15:08', action: 'Login Attempt', user: 'unknown', ip: '185.220.101.45', details: 'Failed login attempt - invalid credentials', status: 'failed' },
    { id: '4', timestamp: '13:55:33', action: 'Alarm Acknowledged', user: 'admin@emersoneims.com', ip: '41.139.218.45', details: 'High temperature alarm cleared at Sarova Stanley', status: 'success' },
    { id: '5', timestamp: '13:42:17', action: 'Report Generated', user: 'manager@client.co.ke', ip: '196.201.214.8', details: 'Monthly maintenance report exported', status: 'success' },
    { id: '6', timestamp: '13:30:00', action: 'Firmware Update', user: 'system', ip: 'localhost', details: 'Controller firmware v2.4.1 deployed to 3 sites', status: 'warning' },
  ]);

  const handleCommand = (command: string) => {
    console.log(`Executing command: ${command} on site: ${selectedSite?.name}`);
    // Here you would send the actual command
  };

  // Statistics
  const stats = {
    total: sites.length,
    online: sites.filter(s => s.status === 'online').length,
    running: sites.filter(s => s.generator.status === 'running').length,
    alerts: sites.reduce((acc, s) => acc + s.alerts, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center"
            animate={{
              boxShadow: ['0 0 20px rgba(99,102,241,0.5)', '0 0 40px rgba(139,92,246,0.5)', '0 0 20px rgba(99,102,241,0.5)'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-3xl">🌐</span>
          </motion.div>
          <div>
            <h2 className="text-xl font-bold text-indigo-400 uppercase tracking-wider">Remote Connectivity</h2>
            <p className="text-sm text-slate-500">GSM/WiFi Modules • Multi-Site Dashboard • Fleet Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="text-center">
              <div className="text-xl font-bold text-white">{stats.total}</div>
              <div className="text-[10px] text-slate-500">Total Sites</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-400">{stats.online}</div>
              <div className="text-[10px] text-slate-500">Online</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-cyan-400">{stats.running}</div>
              <div className="text-[10px] text-slate-500">Running</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-400">{stats.alerts}</div>
              <div className="text-[10px] text-slate-500">Alerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Connectivity Modules */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {connectivityModules.map((module) => (
          <ConnectionStatusCard key={module.type} module={module} />
        ))}
      </div>

      {/* Sites Grid + Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sites Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Connected Sites</h3>
            <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded text-xs ${viewMode === 'grid' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-xs ${viewMode === 'map' ? 'bg-indigo-500 text-white' : 'text-slate-400'}`}
              >
                Map
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sites.map((site) => (
              <SiteCard
                key={site.id}
                site={site}
                onSelect={setSelectedSite}
              />
            ))}
          </div>
        </div>

        {/* Control Panel + Audit Log */}
        <div className="space-y-4">
          <RemoteControlPanel site={selectedSite} onCommand={handleCommand} />
          <AuditLog entries={auditLog} />
        </div>
      </div>

      {/* Connection Security Notice */}
      <motion.div
        className="p-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/30 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">🔐</span>
          <div>
            <div className="text-sm font-bold text-white">Secure Remote Access</div>
            <div className="text-xs text-slate-400">
              All communications encrypted with TLS 1.3 • Two-factor authentication enabled • Full audit trail logging
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
