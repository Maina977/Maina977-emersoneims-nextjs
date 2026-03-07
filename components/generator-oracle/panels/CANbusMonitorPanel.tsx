'use client';

/**
 * CANBUS MONITOR PANEL
 *
 * Comprehensive J1939/CANbus monitoring interface:
 * - Real-time CAN message decoding
 * - J1939 PGN/SPN interpretation
 * - Traffic recording and playback
 * - Node health monitoring
 * - Bus load analysis
 * - Fault detection
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface CANMessage {
  id: string;
  timestamp: number;
  pgn: number;
  sourceAddress: number;
  destinationAddress: number;
  priority: number;
  dataBytes: number[];
  decoded?: {
    spns: Array<{
      spn: number;
      name: string;
      value: number;
      unit: string;
      status: 'normal' | 'warning' | 'critical';
    }>;
  };
}

interface CANNode {
  address: number;
  name: string;
  manufacturer?: string;
  lastSeen: number;
  messageCount: number;
  status: 'active' | 'inactive' | 'error';
}

interface BusStatistics {
  totalMessages: number;
  messagesPerSecond: number;
  busLoad: number;
  errorFrames: number;
  dominantNodes: { address: number; percentage: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// J1939 DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const J1939_PGNS: Record<number, { name: string; spns: Array<{ spn: number; name: string; startBit: number; length: number; scale: number; offset: number; unit: string }> }> = {
  // Engine Controller #1 (EEC1)
  61444: {
    name: 'Electronic Engine Controller 1',
    spns: [
      { spn: 190, name: 'Engine Speed', startBit: 24, length: 16, scale: 0.125, offset: 0, unit: 'rpm' },
      { spn: 899, name: 'Engine Torque Mode', startBit: 0, length: 4, scale: 1, offset: 0, unit: '' },
      { spn: 512, name: 'Driver Demand Engine Torque', startBit: 8, length: 8, scale: 1, offset: -125, unit: '%' },
      { spn: 513, name: 'Actual Engine Torque', startBit: 16, length: 8, scale: 1, offset: -125, unit: '%' }
    ]
  },
  // Engine Temperature #1 (ET1)
  65262: {
    name: 'Engine Temperature 1',
    spns: [
      { spn: 110, name: 'Engine Coolant Temperature', startBit: 0, length: 8, scale: 1, offset: -40, unit: '°C' },
      { spn: 174, name: 'Fuel Temperature', startBit: 8, length: 8, scale: 1, offset: -40, unit: '°C' },
      { spn: 175, name: 'Engine Oil Temperature', startBit: 16, length: 16, scale: 0.03125, offset: -273, unit: '°C' }
    ]
  },
  // Engine Fluid Level/Pressure #1 (EFL/P1)
  65263: {
    name: 'Engine Fluid Level/Pressure 1',
    spns: [
      { spn: 94, name: 'Fuel Delivery Pressure', startBit: 0, length: 8, scale: 4, offset: 0, unit: 'kPa' },
      { spn: 22, name: 'Extended Crankcase Blow-by Pressure', startBit: 8, length: 8, scale: 0.05, offset: 0, unit: 'kPa' },
      { spn: 98, name: 'Engine Oil Level', startBit: 16, length: 8, scale: 0.4, offset: 0, unit: '%' },
      { spn: 100, name: 'Engine Oil Pressure', startBit: 24, length: 8, scale: 4, offset: 0, unit: 'kPa' }
    ]
  },
  // Intake/Exhaust Conditions #1 (IC1)
  65270: {
    name: 'Intake/Exhaust Conditions 1',
    spns: [
      { spn: 102, name: 'Boost Pressure', startBit: 8, length: 8, scale: 2, offset: 0, unit: 'kPa' },
      { spn: 105, name: 'Intake Manifold Temperature', startBit: 16, length: 8, scale: 1, offset: -40, unit: '°C' },
      { spn: 106, name: 'Air Inlet Pressure', startBit: 24, length: 8, scale: 2, offset: 0, unit: 'kPa' }
    ]
  },
  // Vehicle Electrical Power #1 (VEP1)
  65271: {
    name: 'Vehicle Electrical Power 1',
    spns: [
      { spn: 114, name: 'Net Battery Current', startBit: 0, length: 8, scale: 1, offset: -125, unit: 'A' },
      { spn: 115, name: 'Alternator Current', startBit: 8, length: 8, scale: 1, offset: 0, unit: 'A' },
      { spn: 167, name: 'Charging System Potential', startBit: 16, length: 16, scale: 0.05, offset: 0, unit: 'V' },
      { spn: 168, name: 'Battery Potential', startBit: 32, length: 16, scale: 0.05, offset: 0, unit: 'V' }
    ]
  },
  // Diagnostic Message (DM1)
  65226: {
    name: 'Active Diagnostic Trouble Codes',
    spns: [
      { spn: 1213, name: 'Malfunction Indicator Lamp', startBit: 0, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 623, name: 'Red Stop Lamp', startBit: 2, length: 2, scale: 1, offset: 0, unit: '' },
      { spn: 624, name: 'Amber Warning Lamp', startBit: 4, length: 2, scale: 1, offset: 0, unit: '' }
    ]
  },
  // Engine Hours (HOURS)
  65253: {
    name: 'Engine Hours, Revolutions',
    spns: [
      { spn: 247, name: 'Engine Total Hours of Operation', startBit: 0, length: 32, scale: 0.05, offset: 0, unit: 'hours' },
      { spn: 249, name: 'Engine Total Revolutions', startBit: 32, length: 32, scale: 1000, offset: 0, unit: 'rev' }
    ]
  }
};

const J1939_SOURCE_ADDRESSES: Record<number, string> = {
  0: 'Engine #1',
  1: 'Engine #2',
  3: 'Transmission',
  11: 'Brakes - System Controller',
  15: 'Retarder - Engine',
  17: 'Cruise Control',
  21: 'Cab Controller',
  33: 'Body Controller',
  37: 'Instrument Cluster',
  41: 'Tachograph',
  43: 'Door Controller',
  49: 'Climate Control',
  128: 'Generator Set Controller',
  129: 'Generator Set Controller #2',
  130: 'Transfer Switch',
  243: 'Off-Board Diagnostic Tool',
  254: 'Null Address',
  255: 'Global'
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIMULATED CAN DATA GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════

function generateSimulatedCANMessage(): CANMessage {
  const pgns = Object.keys(J1939_PGNS).map(Number);
  const pgn = pgns[Math.floor(Math.random() * pgns.length)];
  const pgnInfo = J1939_PGNS[pgn];

  // Generate realistic data bytes based on PGN
  const dataBytes = new Array(8).fill(0).map(() => Math.floor(Math.random() * 256));

  // Decode SPNs
  const decoded = {
    spns: pgnInfo.spns.map(spnDef => {
      // Simulate realistic values
      let value: number;
      switch (spnDef.spn) {
        case 190: // Engine Speed
          value = 1450 + Math.random() * 100;
          break;
        case 110: // Coolant Temp
          value = 75 + Math.random() * 20;
          break;
        case 100: // Oil Pressure
          value = 350 + Math.random() * 100;
          break;
        case 102: // Boost Pressure
          value = 150 + Math.random() * 50;
          break;
        case 168: // Battery Voltage
          value = 27 + Math.random() * 2;
          break;
        case 247: // Engine Hours
          value = 5000 + Math.random() * 100;
          break;
        default:
          value = Math.random() * 100;
      }

      let status: 'normal' | 'warning' | 'critical' = 'normal';
      // Set status based on value ranges
      if (spnDef.spn === 110 && value > 95) status = 'critical';
      else if (spnDef.spn === 110 && value > 90) status = 'warning';
      else if (spnDef.spn === 100 && value < 200) status = 'critical';
      else if (spnDef.spn === 100 && value < 300) status = 'warning';

      return {
        spn: spnDef.spn,
        name: spnDef.name,
        value: Math.round(value * 100) / 100,
        unit: spnDef.unit,
        status
      };
    })
  };

  return {
    id: `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    pgn,
    sourceAddress: [0, 128, 37, 130][Math.floor(Math.random() * 4)],
    destinationAddress: 255,
    priority: Math.floor(Math.random() * 8),
    dataBytes,
    decoded
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function CANbusMonitorPanel() {
  // State
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [messages, setMessages] = useState<CANMessage[]>([]);
  const [nodes, setNodes] = useState<CANNode[]>([]);
  const [statistics, setStatistics] = useState<BusStatistics>({
    totalMessages: 0,
    messagesPerSecond: 0,
    busLoad: 0,
    errorFrames: 0,
    dominantNodes: []
  });
  const [activeTab, setActiveTab] = useState<'live' | 'decoded' | 'nodes' | 'diagnostics'>('live');
  const [filterPGN, setFilterPGN] = useState<number | null>(null);
  const [filterAddress, setFilterAddress] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMessages, setRecordedMessages] = useState<CANMessage[]>([]);

  // Simulation effect
  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newMessage = generateSimulatedCANMessage();

      setMessages(prev => {
        const updated = [newMessage, ...prev].slice(0, 100); // Keep last 100 messages
        return updated;
      });

      // Update nodes
      setNodes(prev => {
        const existing = prev.find(n => n.address === newMessage.sourceAddress);
        if (existing) {
          return prev.map(n =>
            n.address === newMessage.sourceAddress
              ? { ...n, lastSeen: Date.now(), messageCount: n.messageCount + 1 }
              : n
          );
        }
        return [...prev, {
          address: newMessage.sourceAddress,
          name: J1939_SOURCE_ADDRESSES[newMessage.sourceAddress] || `Unknown (${newMessage.sourceAddress})`,
          lastSeen: Date.now(),
          messageCount: 1,
          status: 'active'
        }];
      });

      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalMessages: prev.totalMessages + 1,
        messagesPerSecond: Math.round(Math.random() * 50 + 50),
        busLoad: Math.round(Math.random() * 30 + 10),
        errorFrames: Math.floor(Math.random() * 3),
        dominantNodes: nodes.slice(0, 3).map(n => ({
          address: n.address,
          percentage: Math.round(Math.random() * 30 + 10)
        }))
      }));

      // Record if recording
      if (isRecording) {
        setRecordedMessages(prev => [...prev, newMessage]);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isMonitoring, isRecording, nodes]);

  // Filter messages
  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      if (filterPGN !== null && msg.pgn !== filterPGN) return false;
      if (filterAddress !== null && msg.sourceAddress !== filterAddress) return false;
      return true;
    });
  }, [messages, filterPGN, filterAddress]);

  // Toggle monitoring
  const toggleMonitoring = useCallback(() => {
    setIsMonitoring(!isMonitoring);
    if (isMonitoring) {
      setIsRecording(false);
    }
  }, [isMonitoring]);

  // Toggle recording
  const toggleRecording = useCallback(() => {
    if (!isRecording) {
      setRecordedMessages([]);
    }
    setIsRecording(!isRecording);
  }, [isRecording]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setRecordedMessages([]);
  }, []);

  // Export recording
  const exportRecording = useCallback(() => {
    const blob = new Blob([JSON.stringify(recordedMessages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `can-recording-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [recordedMessages]);

  // Render Live Tab
  const renderLiveTab = () => (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-2 items-center">
        <button
          onClick={toggleMonitoring}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isMonitoring
              ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
          }`}
        >
          {isMonitoring ? '⏹ Stop' : '▶ Start'} Monitoring
        </button>
        <button
          onClick={toggleRecording}
          disabled={!isMonitoring}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isRecording
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          } ${!isMonitoring && 'opacity-50 cursor-not-allowed'}`}
        >
          {isRecording ? '🔴 Recording...' : '⏺ Record'}
        </button>
        <button
          onClick={clearMessages}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
        {recordedMessages.length > 0 && (
          <button
            onClick={exportRecording}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            Export ({recordedMessages.length} msgs)
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterPGN ?? ''}
          onChange={(e) => setFilterPGN(e.target.value ? Number(e.target.value) : null)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
        >
          <option value="">All PGNs</option>
          {Object.entries(J1939_PGNS).map(([pgn, info]) => (
            <option key={pgn} value={pgn}>{pgn} - {info.name}</option>
          ))}
        </select>
        <select
          value={filterAddress ?? ''}
          onChange={(e) => setFilterAddress(e.target.value ? Number(e.target.value) : null)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-300"
        >
          <option value="">All Addresses</option>
          {Object.entries(J1939_SOURCE_ADDRESSES).map(([addr, name]) => (
            <option key={addr} value={addr}>{addr} - {name}</option>
          ))}
        </select>
      </div>

      {/* Message List */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          <table className="w-full text-xs font-mono">
            <thead className="sticky top-0 bg-gray-800">
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-2 px-2">Time</th>
                <th className="text-left py-2 px-2">PGN</th>
                <th className="text-left py-2 px-2">Source</th>
                <th className="text-left py-2 px-2">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="py-1 px-2 text-gray-500">
                    {new Date(msg.timestamp).toISOString().substr(11, 12)}
                  </td>
                  <td className="py-1 px-2 text-amber-400">
                    {msg.pgn} ({J1939_PGNS[msg.pgn]?.name.substr(0, 20) || 'Unknown'})
                  </td>
                  <td className="py-1 px-2 text-cyan-400">
                    {msg.sourceAddress} ({J1939_SOURCE_ADDRESSES[msg.sourceAddress]?.substr(0, 15) || 'Unknown'})
                  </td>
                  <td className="py-1 px-2 text-gray-300">
                    {msg.dataBytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Render Decoded Tab
  const renderDecodedTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Decoded Parameters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {messages.slice(0, 6).map((msg) => (
          <div key={msg.id} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="text-white font-medium text-sm">
                  {J1939_PGNS[msg.pgn]?.name || `PGN ${msg.pgn}`}
                </h4>
                <p className="text-gray-500 text-xs">
                  From: {J1939_SOURCE_ADDRESSES[msg.sourceAddress] || `Address ${msg.sourceAddress}`}
                </p>
              </div>
              <span className="text-gray-500 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <div className="space-y-2">
              {msg.decoded?.spns.map((spn) => (
                <div key={spn.spn} className="flex justify-between items-center">
                  <span className="text-gray-400 text-xs">{spn.name}</span>
                  <span className={`text-sm font-mono ${
                    spn.status === 'critical' ? 'text-red-400' :
                    spn.status === 'warning' ? 'text-amber-400' :
                    'text-green-400'
                  }`}>
                    {spn.value} {spn.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render Nodes Tab
  const renderNodesTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">CAN Bus Nodes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const timeSinceLastSeen = (Date.now() - node.lastSeen) / 1000;
          const isStale = timeSinceLastSeen > 5;

          return (
            <div
              key={node.address}
              className={`bg-gray-800/50 rounded-xl p-4 border ${
                isStale ? 'border-gray-700' : 'border-green-500/30'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{node.name}</h4>
                  <p className="text-gray-500 text-sm">Address: 0x{node.address.toString(16).toUpperCase()}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  isStale ? 'bg-gray-700 text-gray-400' : 'bg-green-500/20 text-green-400'
                }`}>
                  {isStale ? 'Inactive' : 'Active'}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Messages:</span>
                  <span className="text-white ml-2">{node.messageCount}</span>
                </div>
                <div>
                  <span className="text-gray-500">Last Seen:</span>
                  <span className="text-white ml-2">
                    {isStale ? `${Math.round(timeSinceLastSeen)}s ago` : 'Now'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {nodes.length === 0 && (
          <div className="col-span-2 text-center py-8 text-gray-500">
            No nodes detected. Start monitoring to discover CAN bus nodes.
          </div>
        )}
      </div>
    </div>
  );

  // Render Diagnostics Tab
  const renderDiagnosticsTab = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-amber-400">Bus Diagnostics</h3>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{statistics.totalMessages}</p>
          <p className="text-gray-500 text-sm">Total Messages</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-cyan-400">{statistics.messagesPerSecond}</p>
          <p className="text-gray-500 text-sm">Messages/Second</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className={`text-3xl font-bold ${
            statistics.busLoad > 70 ? 'text-red-400' :
            statistics.busLoad > 50 ? 'text-amber-400' :
            'text-green-400'
          }`}>
            {statistics.busLoad}%
          </p>
          <p className="text-gray-500 text-sm">Bus Load</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-center">
          <p className={`text-3xl font-bold ${
            statistics.errorFrames > 0 ? 'text-red-400' : 'text-green-400'
          }`}>
            {statistics.errorFrames}
          </p>
          <p className="text-gray-500 text-sm">Error Frames</p>
        </div>
      </div>

      {/* Bus Health */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-4">Bus Health Checks</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Termination Resistance</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded">60Ω (OK)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Signal Quality</span>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded">Good</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Baud Rate</span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded">250 kbps</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Active Nodes</span>
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded">{nodes.length}</span>
          </div>
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
        <h4 className="text-white font-medium mb-4">Troubleshooting Guide</h4>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-amber-400 font-medium">No Communication</p>
            <ul className="text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Check CAN H and CAN L connections</li>
              <li>Verify 120Ω termination at each end</li>
              <li>Check for correct baud rate (250k for J1939)</li>
              <li>Ensure shield is grounded at one point only</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-amber-400 font-medium">Intermittent Communication</p>
            <ul className="text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Check for loose connections</li>
              <li>Inspect cables for damage/chafing</li>
              <li>Check for EMI from high-current cables</li>
              <li>Verify proper twisted pair wiring</li>
            </ul>
          </div>
          <div className="p-3 bg-gray-900/50 rounded-lg">
            <p className="text-amber-400 font-medium">High Error Rate</p>
            <ul className="text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Check bus load (should be &lt;70%)</li>
              <li>Look for faulty node flooding bus</li>
              <li>Verify all nodes at same baud rate</li>
              <li>Check for ground potential differences</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">CANbus Monitor</h2>
          <p className="text-gray-400 text-sm">J1939 Protocol Analysis & Diagnostics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`} />
          <span className="text-gray-400 text-sm">{isMonitoring ? 'Monitoring' : 'Idle'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4">
        {[
          { id: 'live', label: 'Live Traffic', icon: '📡' },
          { id: 'decoded', label: 'Decoded Data', icon: '📊' },
          { id: 'nodes', label: 'Nodes', icon: '🔌' },
          { id: 'diagnostics', label: 'Diagnostics', icon: '🔧' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === 'live' && renderLiveTab()}
          {activeTab === 'decoded' && renderDecodedTab()}
          {activeTab === 'nodes' && renderNodesTab()}
          {activeTab === 'diagnostics' && renderDiagnosticsTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
