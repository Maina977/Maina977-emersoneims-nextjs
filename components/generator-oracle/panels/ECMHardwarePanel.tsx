'use client';

/**
 * ECM HARDWARE COMMUNICATION PANEL
 *
 * Real hardware communication with Engine Control Modules
 * Connects Generator Oracle with actual ECM hardware via:
 * - USB-to-CAN adapters (Web Serial API)
 * - Bluetooth CAN adapters (Web Bluetooth API)
 * - USB adapters (WebUSB API)
 *
 * Capabilities:
 * - Live data streaming from ECM
 * - Fault code reading and clearing
 * - Active component tests
 * - Parameter reading
 *
 * This bridges the gap between Generator Oracle and dealer tools like CAT ET and VODIA
 *
 * (c) 2026 Generator Oracle. All Rights Reserved.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ECMCommunicationService,
  HardwareAdapter,
  ECMConnection,
  LiveParameter,
  J1939FaultCode,
  FaultCodeReadResult,
  ActiveTest,
  ConnectionStatus,
  AdapterType,
  ProtocolType
} from '@/lib/generator-oracle/ecm-communication/ECMCommunicationCore';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface ECMHardwarePanelProps {
  onClose?: () => void;
  onConnectionChange?: (connected: boolean, ecmInfo?: any) => void;
  onLiveDataUpdate?: (data: LiveParameter[]) => void;
  onFaultCodesRead?: (codes: J1939FaultCode[]) => void;
}

type PanelView = 'connection' | 'liveData' | 'faultCodes' | 'activeTests' | 'parameters';

// ═══════════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ECMHardwarePanel({
  onClose,
  onConnectionChange,
  onLiveDataUpdate,
  onFaultCodesRead
}: ECMHardwarePanelProps) {
  // Service instance
  const ecmService = useRef<ECMCommunicationService>(new ECMCommunicationService());

  // Connection state
  const [availableAdapters, setAvailableAdapters] = useState<HardwareAdapter[]>([]);
  const [selectedAdapter, setSelectedAdapter] = useState<HardwareAdapter | null>(null);
  const [connection, setConnection] = useState<ECMConnection | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Live data state
  const [liveData, setLiveData] = useState<LiveParameter[]>([]);
  const [isStreamingLiveData, setIsStreamingLiveData] = useState(false);
  const [updateRate, setUpdateRate] = useState(5); // Hz

  // Fault codes state
  const [faultCodeResult, setFaultCodeResult] = useState<FaultCodeReadResult | null>(null);
  const [isReadingCodes, setIsReadingCodes] = useState(false);
  const [isClearingCodes, setIsClearingCodes] = useState(false);

  // Active tests state
  const [availableTests, setAvailableTests] = useState<ActiveTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<ActiveTest | null>(null);
  const [isRunningTest, setIsRunningTest] = useState(false);

  // UI state
  const [currentView, setCurrentView] = useState<PanelView>('connection');
  const [isScanning, setIsScanning] = useState(false);
  const [browserSupport, setBrowserSupport] = useState({
    webSerial: false,
    webBluetooth: false,
    webUSB: false
  });

  // Protocol selection
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolType>('j1939');
  const [baudRate, setBaudRate] = useState(250000);

  // ─────────────────────────────────────────────────────────────────────────────
  // BROWSER CAPABILITY CHECK
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    setBrowserSupport({
      webSerial: 'serial' in navigator,
      webBluetooth: 'bluetooth' in navigator,
      webUSB: 'usb' in navigator
    });
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // ADAPTER SCANNING
  // ─────────────────────────────────────────────────────────────────────────────

  const scanForAdapters = useCallback(async () => {
    setIsScanning(true);
    setConnectionError(null);
    try {
      const adapters = await ecmService.current.scanForAdapters();
      setAvailableAdapters(adapters);
      if (adapters.length === 0) {
        setConnectionError('No adapters found. Connect a USB-CAN or Bluetooth adapter and try again.');
      }
    } catch (error) {
      setConnectionError(`Scan failed: ${error}`);
    } finally {
      setIsScanning(false);
    }
  }, []);

  const requestNewAdapter = useCallback(async (type: AdapterType) => {
    setIsScanning(true);
    setConnectionError(null);
    try {
      const adapter = await ecmService.current.requestAdapter(type);
      if (adapter) {
        setAvailableAdapters(prev => [...prev, adapter]);
        setSelectedAdapter(adapter);
      }
    } catch (error) {
      setConnectionError(`Failed to connect adapter: ${error}`);
    } finally {
      setIsScanning(false);
    }
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // ECM CONNECTION
  // ─────────────────────────────────────────────────────────────────────────────

  const connectToECM = useCallback(async () => {
    if (!selectedAdapter) return;

    setConnectionStatus('connecting');
    setConnectionError(null);

    try {
      const conn = await ecmService.current.connectToECM(selectedAdapter, {
        type: selectedProtocol,
        baudRate,
        canId: 0x18FEF100,
        extendedId: true,
        timeout: 5000,
        retries: 3,
        addressingMode: 'functional'
      });

      setConnection(conn);
      setConnectionStatus('connected');
      onConnectionChange?.(true, conn.ecmInfo);

      // Load available active tests
      const tests = await ecmService.current.getAvailableActiveTests?.() || [];
      setAvailableTests(tests);

    } catch (error) {
      setConnectionStatus('error');
      setConnectionError(`Connection failed: ${error}`);
      onConnectionChange?.(false);
    }
  }, [selectedAdapter, selectedProtocol, baudRate, onConnectionChange]);

  const disconnectFromECM = useCallback(async () => {
    if (isStreamingLiveData) {
      ecmService.current.stopLiveData();
      setIsStreamingLiveData(false);
    }
    await ecmService.current.disconnect();
    setConnection(null);
    setConnectionStatus('disconnected');
    setLiveData([]);
    setFaultCodeResult(null);
    onConnectionChange?.(false);
  }, [isStreamingLiveData, onConnectionChange]);

  // ─────────────────────────────────────────────────────────────────────────────
  // LIVE DATA STREAMING
  // ─────────────────────────────────────────────────────────────────────────────

  const startLiveDataStream = useCallback(async () => {
    if (!connection) return;

    try {
      await ecmService.current.startLiveData(
        ['engine_speed', 'coolant_temp', 'oil_pressure', 'fuel_rate', 'battery_voltage'],
        updateRate,
        (data) => {
          setLiveData(data);
          onLiveDataUpdate?.(data);
        },
        (error) => {
          console.error('Live data error:', error);
          setConnectionError(`Live data error: ${error.message}`);
        }
      );
      setIsStreamingLiveData(true);
    } catch (error) {
      setConnectionError(`Failed to start live data: ${error}`);
    }
  }, [connection, updateRate, onLiveDataUpdate]);

  const stopLiveDataStream = useCallback(() => {
    ecmService.current.stopLiveData();
    setIsStreamingLiveData(false);
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // FAULT CODE OPERATIONS
  // ─────────────────────────────────────────────────────────────────────────────

  const readFaultCodes = useCallback(async () => {
    if (!connection) return;

    setIsReadingCodes(true);
    setConnectionError(null);

    try {
      const result = await ecmService.current.readFaultCodes();
      setFaultCodeResult(result);
      onFaultCodesRead?.(result.activeCodes);
    } catch (error) {
      setConnectionError(`Failed to read fault codes: ${error}`);
    } finally {
      setIsReadingCodes(false);
    }
  }, [connection, onFaultCodesRead]);

  const clearFaultCodes = useCallback(async () => {
    if (!connection || !faultCodeResult) return;

    setIsClearingCodes(true);
    setConnectionError(null);

    try {
      const result = await ecmService.current.clearFaultCodes(faultCodeResult.activeCodes);
      if (result.success) {
        // Re-read to confirm
        await readFaultCodes();
      } else {
        setConnectionError(result.message);
      }
    } catch (error) {
      setConnectionError(`Failed to clear fault codes: ${error}`);
    } finally {
      setIsClearingCodes(false);
    }
  }, [connection, faultCodeResult, readFaultCodes]);

  // ─────────────────────────────────────────────────────────────────────────────
  // ACTIVE TESTS
  // ─────────────────────────────────────────────────────────────────────────────

  const executeActiveTest = useCallback(async (test: ActiveTest) => {
    if (!connection) return;

    setIsRunningTest(true);
    setSelectedTest(test);
    setConnectionError(null);

    try {
      const result = await ecmService.current.executeActiveTest?.(test, test.parameters);
      if (!result?.success) {
        setConnectionError(`Test failed: ${result?.notes || 'Unknown error'}`);
      }
    } catch (error) {
      setConnectionError(`Failed to execute test: ${error}`);
    } finally {
      setIsRunningTest(false);
      setSelectedTest(null);
    }
  }, [connection]);

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: CONNECTION VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  const renderConnectionView = () => (
    <div className="space-y-4">
      {/* Browser Support Status */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Browser Capabilities</h3>
        <div className="grid grid-cols-3 gap-2">
          <div className={`p-2 rounded text-center text-xs ${browserSupport.webSerial ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            <div className="text-lg mb-1">{browserSupport.webSerial ? '✓' : '✗'}</div>
            Web Serial
          </div>
          <div className={`p-2 rounded text-center text-xs ${browserSupport.webBluetooth ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            <div className="text-lg mb-1">{browserSupport.webBluetooth ? '✓' : '✗'}</div>
            Bluetooth
          </div>
          <div className={`p-2 rounded text-center text-xs ${browserSupport.webUSB ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            <div className="text-lg mb-1">{browserSupport.webUSB ? '✓' : '✗'}</div>
            WebUSB
          </div>
        </div>
        {!browserSupport.webSerial && !browserSupport.webBluetooth && (
          <p className="text-xs text-yellow-400 mt-2">
            Use Chrome or Edge for hardware adapter support
          </p>
        )}
      </div>

      {/* Adapter Selection */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">Hardware Adapters</h3>
          <button
            onClick={scanForAdapters}
            disabled={isScanning}
            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'Scan'}
          </button>
        </div>

        {/* Connect New Adapter Buttons */}
        <div className="flex gap-2 mb-3">
          {browserSupport.webSerial && (
            <button
              onClick={() => requestNewAdapter('usb_can')}
              disabled={isScanning || connectionStatus === 'connected'}
              className="flex-1 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>🔌</span> USB-CAN
            </button>
          )}
          {browserSupport.webBluetooth && (
            <button
              onClick={() => requestNewAdapter('bluetooth_can')}
              disabled={isScanning || connectionStatus === 'connected'}
              className="flex-1 px-3 py-2 text-xs bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>📶</span> Bluetooth
            </button>
          )}
        </div>

        {/* Available Adapters List */}
        {availableAdapters.length > 0 ? (
          <div className="space-y-2">
            {availableAdapters.map((adapter) => (
              <div
                key={adapter.id}
                onClick={() => setSelectedAdapter(adapter)}
                className={`p-3 rounded cursor-pointer transition-colors ${
                  selectedAdapter?.id === adapter.id
                    ? 'bg-blue-600/30 border border-blue-500'
                    : 'bg-gray-700/50 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{adapter.name}</p>
                    <p className="text-xs text-gray-400">{adapter.manufacturer} - {adapter.model}</p>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${adapter.isConnected ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {adapter.supportedProtocols.map(p => (
                    <span key={p} className="px-1.5 py-0.5 text-[10px] bg-gray-600 rounded">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 text-center py-4">
            No adapters detected. Click USB-CAN or Bluetooth to connect.
          </p>
        )}
      </div>

      {/* Protocol Settings */}
      {selectedAdapter && connectionStatus !== 'connected' && (
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Protocol Settings</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Protocol</label>
              <select
                value={selectedProtocol}
                onChange={(e) => setSelectedProtocol(e.target.value as ProtocolType)}
                className="w-full bg-gray-700 rounded px-2 py-1.5 text-sm"
              >
                <option value="j1939">J1939 (Diesel)</option>
                <option value="can">Raw CAN</option>
                <option value="modbus_rtu">Modbus RTU</option>
                <option value="iso15765">ISO 15765</option>
                <option value="uds">UDS</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Baud Rate</label>
              <select
                value={baudRate}
                onChange={(e) => setBaudRate(Number(e.target.value))}
                className="w-full bg-gray-700 rounded px-2 py-1.5 text-sm"
              >
                <option value={250000}>250 kbps</option>
                <option value={500000}>500 kbps</option>
                <option value={1000000}>1 Mbps</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Connection Button */}
      {selectedAdapter && (
        <button
          onClick={connectionStatus === 'connected' ? disconnectFromECM : connectToECM}
          disabled={connectionStatus === 'connecting'}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            connectionStatus === 'connected'
              ? 'bg-red-600 hover:bg-red-700'
              : connectionStatus === 'connecting'
              ? 'bg-gray-600 cursor-wait'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {connectionStatus === 'connecting' ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⚙️</span> Connecting to ECM...
            </span>
          ) : connectionStatus === 'connected' ? (
            'Disconnect from ECM'
          ) : (
            'Connect to ECM'
          )}
        </button>
      )}

      {/* Connection Status */}
      {connection && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-400">Connected to ECM</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Manufacturer:</span>
              <span className="ml-2">{connection.ecmInfo.manufacturer}</span>
            </div>
            <div>
              <span className="text-gray-400">Model:</span>
              <span className="ml-2">{connection.ecmInfo.model}</span>
            </div>
            <div>
              <span className="text-gray-400">Software:</span>
              <span className="ml-2">{connection.ecmInfo.softwareVersion}</span>
            </div>
            <div>
              <span className="text-gray-400">Calibration:</span>
              <span className="ml-2">{connection.ecmInfo.calibrationId}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {connectionError && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-3">
          <p className="text-sm text-red-400">{connectionError}</p>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: LIVE DATA VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  const renderLiveDataView = () => (
    <div className="space-y-4">
      {/* Stream Controls */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-300">Live ECM Data Stream</h3>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-400">Rate:</label>
            <select
              value={updateRate}
              onChange={(e) => setUpdateRate(Number(e.target.value))}
              disabled={isStreamingLiveData}
              className="bg-gray-700 rounded px-2 py-1 text-xs"
            >
              <option value={1}>1 Hz</option>
              <option value={5}>5 Hz</option>
              <option value={10}>10 Hz</option>
              <option value={20}>20 Hz</option>
            </select>
          </div>
        </div>

        <button
          onClick={isStreamingLiveData ? stopLiveDataStream : startLiveDataStream}
          disabled={!connection}
          className={`w-full py-2 rounded font-medium transition-colors ${
            isStreamingLiveData
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          } disabled:opacity-50`}
        >
          {isStreamingLiveData ? '⏹ Stop Stream' : '▶️ Start Live Data'}
        </button>
      </div>

      {/* Live Data Display */}
      <div className="grid grid-cols-2 gap-3">
        {liveData.map((param) => (
          <div
            key={param.id}
            className={`bg-gray-800/50 rounded-lg p-3 border ${
              param.status === 'critical' ? 'border-red-500' :
              param.status === 'warning' ? 'border-yellow-500' :
              'border-gray-700'
            }`}
          >
            <div className="text-xs text-gray-400 mb-1">{param.name}</div>
            <div className="flex items-baseline gap-1">
              <span className={`text-2xl font-bold ${
                param.status === 'critical' ? 'text-red-400' :
                param.status === 'warning' ? 'text-yellow-400' :
                'text-green-400'
              }`}>
                {param.value.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500">{param.unit}</span>
            </div>
            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-200 ${
                  param.status === 'critical' ? 'bg-red-500' :
                  param.status === 'warning' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(100, (param.value / param.max) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-0.5">
              <span>{param.min}</span>
              <span>{param.max}</span>
            </div>
          </div>
        ))}
      </div>

      {/* No Data State */}
      {liveData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-sm">Start the live data stream to see ECM parameters</p>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: FAULT CODES VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  const renderFaultCodesView = () => (
    <div className="space-y-4">
      {/* Read/Clear Controls */}
      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">ECM Fault Codes</h3>
        <div className="flex gap-2">
          <button
            onClick={readFaultCodes}
            disabled={!connection || isReadingCodes}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium disabled:opacity-50"
          >
            {isReadingCodes ? '🔄 Reading...' : '📖 Read Codes'}
          </button>
          <button
            onClick={clearFaultCodes}
            disabled={!connection || !faultCodeResult?.activeCodes.length || isClearingCodes}
            className="flex-1 py-2 bg-orange-600 hover:bg-orange-700 rounded font-medium disabled:opacity-50"
          >
            {isClearingCodes ? '🔄 Clearing...' : '🗑️ Clear Codes'}
          </button>
        </div>
      </div>

      {/* Fault Code Results */}
      {faultCodeResult && (
        <>
          {/* Active Codes */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-red-400 mb-2">
              Active Codes ({faultCodeResult.activeCodes.length})
            </h4>
            {faultCodeResult.activeCodes.length > 0 ? (
              <div className="space-y-2">
                {faultCodeResult.activeCodes.map((code, idx) => (
                  <div key={idx} className="bg-red-900/30 rounded p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-red-300">
                        SPN {code.spn} / FMI {code.fmi}
                      </span>
                      <span className="text-xs text-gray-400">x{code.occurrenceCount}</span>
                    </div>
                    <p className="text-sm mt-1">{code.spnDescription}</p>
                    <p className="text-xs text-gray-400">{code.fmiDescription}</p>
                    <div className="flex gap-2 mt-2">
                      {code.lampStatus.redStop && <span className="text-xs bg-red-700 px-1.5 py-0.5 rounded">STOP</span>}
                      {code.lampStatus.amberWarning && <span className="text-xs bg-yellow-700 px-1.5 py-0.5 rounded">WARNING</span>}
                      {code.lampStatus.malfunction && <span className="text-xs bg-orange-700 px-1.5 py-0.5 rounded">MIL</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No active fault codes</p>
            )}
          </div>

          {/* Pending Codes */}
          {faultCodeResult.pendingCodes.length > 0 && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-400 mb-2">
                Pending Codes ({faultCodeResult.pendingCodes.length})
              </h4>
              <div className="space-y-2">
                {faultCodeResult.pendingCodes.map((code, idx) => (
                  <div key={idx} className="bg-yellow-900/30 rounded p-2">
                    <span className="font-mono text-sm text-yellow-300">
                      SPN {code.spn} / FMI {code.fmi}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">{code.spnDescription}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Codes */}
          {faultCodeResult.historyCodes.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-400 mb-2">
                History Codes ({faultCodeResult.historyCodes.length})
              </h4>
              <div className="space-y-1">
                {faultCodeResult.historyCodes.map((code, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-gray-400">SPN {code.spn} / FMI {code.fmi}</span>
                    <span className="text-xs text-gray-500">{code.spnDescription}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* No Results State */}
      {!faultCodeResult && !isReadingCodes && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🔍</div>
          <p className="text-sm">Click "Read Codes" to retrieve fault codes from ECM</p>
        </div>
      )}
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // RENDER: ACTIVE TESTS VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  const renderActiveTestsView = () => (
    <div className="space-y-4">
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
        <p className="text-sm text-yellow-400">
          ⚠️ Active tests actuate real components. Ensure engine is in safe state before running tests.
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-300 mb-3">Available Tests</h3>

        {availableTests.length > 0 ? (
          <div className="space-y-2">
            {availableTests.map((test) => (
              <div key={test.id} className="bg-gray-700/50 rounded p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{test.name}</p>
                    <p className="text-xs text-gray-400">{test.description}</p>
                  </div>
                  <button
                    onClick={() => executeActiveTest(test)}
                    disabled={isRunningTest || !connection}
                    className={`px-3 py-1 text-sm rounded ${
                      selectedTest?.id === test.id
                        ? 'bg-yellow-600 animate-pulse'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:opacity-50`}
                  >
                    {selectedTest?.id === test.id ? 'Running...' : 'Run'}
                  </button>
                </div>
                {test.safetyWarnings.length > 0 && (
                  <div className="mt-2 text-xs text-yellow-400">
                    {test.safetyWarnings.map((warn, i) => (
                      <p key={i}>⚠️ {warn}</p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">
              {connection
                ? 'No active tests available for this ECM'
                : 'Connect to ECM to see available tests'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN RENDER
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-gray-900 text-white rounded-xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <span>🔌</span> ECM Hardware Communication
            </h2>
            <p className="text-xs text-gray-300 mt-1">
              Connect to real ECMs via USB-CAN or Bluetooth adapters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs rounded ${
              connectionStatus === 'connected' ? 'bg-green-600' :
              connectionStatus === 'connecting' ? 'bg-yellow-600 animate-pulse' :
              connectionStatus === 'error' ? 'bg-red-600' :
              'bg-gray-600'
            }`}>
              {connectionStatus.toUpperCase()}
            </span>
            {onClose && (
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">✕</button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'connection' as PanelView, label: '🔌 Connect', disabled: false },
            { id: 'liveData' as PanelView, label: '📊 Live Data', disabled: !connection },
            { id: 'faultCodes' as PanelView, label: '🔴 Fault Codes', disabled: !connection },
            { id: 'activeTests' as PanelView, label: '⚡ Active Tests', disabled: !connection }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              disabled={tab.disabled}
              className={`px-3 py-1.5 text-xs rounded-t transition-colors ${
                currentView === tab.id
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'connection' && renderConnectionView()}
            {currentView === 'liveData' && renderLiveDataView()}
            {currentView === 'faultCodes' && renderFaultCodesView()}
            {currentView === 'activeTests' && renderActiveTestsView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer - Comparison Note */}
      <div className="bg-gray-800/50 border-t border-gray-700 p-3">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Generator Oracle ECM Communication System</span>
          <span className="text-green-400">Bridging the gap with CAT ET & VODIA</span>
        </div>
      </div>
    </div>
  );
}
