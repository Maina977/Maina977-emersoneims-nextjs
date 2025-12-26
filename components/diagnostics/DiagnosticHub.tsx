'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Sphere, Box, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

interface SystemNode {
  id: string;
  name: string;
  status: 'operational' | 'warning' | 'error' | 'maintenance';
  position: [number, number, number];
  connections: string[];
  metrics: {
    efficiency: number;
    temperature: number;
    power: number;
    lastUpdate: Date;
  };
  predictions: {
    failureRisk: number;
    maintenanceDue: Date;
    optimizationScore: number;
  };
}

export default function DiagnosticHub() {
  const [selectedNode, setSelectedNode] = useState<SystemNode | null>(null);
  const [realTimeData, setRealTimeData] = useState(true);
  const [aiMode, setAiMode] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [systemNodes, setSystemNodes] = useState<SystemNode[]>([
    {
      id: 'engine-1',
      name: 'Primary Generator',
      status: 'operational',
      position: [0, 0, 0],
      connections: ['battery-1', 'cooling-1', 'fuel-1'],
      metrics: { efficiency: 94, temperature: 68, power: 850, lastUpdate: new Date() },
      predictions: { failureRisk: 2, maintenanceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), optimizationScore: 96 }
    },
    {
      id: 'battery-1',
      name: 'Battery Bank',
      status: 'operational',
      position: [2, 1, 0],
      connections: ['engine-1', 'inverter-1'],
      metrics: { efficiency: 98, temperature: 25, power: 120, lastUpdate: new Date() },
      predictions: { failureRisk: 1, maintenanceDue: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), optimizationScore: 99 }
    },
    {
      id: 'cooling-1',
      name: 'Cooling System',
      status: 'warning',
      position: [-2, 1, 0],
      connections: ['engine-1'],
      metrics: { efficiency: 87, temperature: 45, power: 150, lastUpdate: new Date() },
      predictions: { failureRisk: 15, maintenanceDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), optimizationScore: 82 }
    },
    {
      id: 'fuel-1',
      name: 'Fuel System',
      status: 'operational',
      position: [0, -2, 0],
      connections: ['engine-1'],
      metrics: { efficiency: 95, temperature: 22, power: 0, lastUpdate: new Date() },
      predictions: { failureRisk: 3, maintenanceDue: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), optimizationScore: 94 }
    },
    {
      id: 'inverter-1',
      name: 'Power Inverter',
      status: 'operational',
      position: [2, -1, 0],
      connections: ['battery-1', 'solar-1'],
      metrics: { efficiency: 96, temperature: 35, power: 800, lastUpdate: new Date() },
      predictions: { failureRisk: 2, maintenanceDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), optimizationScore: 97 }
    },
    {
      id: 'solar-1',
      name: 'Solar Array',
      status: 'operational',
      position: [0, 2, 0],
      connections: ['inverter-1'],
      metrics: { efficiency: 89, temperature: 28, power: 450, lastUpdate: new Date() },
      predictions: { failureRisk: 1, maintenanceDue: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), optimizationScore: 92 }
    }
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    if (realTimeData) {
      intervalRef.current = setInterval(() => {
        setSystemNodes(prev => prev.map(node => ({
          ...node,
          metrics: {
            ...node.metrics,
            efficiency: Math.max(80, Math.min(100, node.metrics.efficiency + (Math.random() - 0.5) * 2)),
            temperature: Math.max(15, Math.min(80, node.metrics.temperature + (Math.random() - 0.5) * 5)),
            power: Math.max(0, node.metrics.power + (Math.random() - 0.5) * 50),
            lastUpdate: new Date()
          }
        })));
      }, 2000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [realTimeData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'error': return '#EF4444';
      case 'maintenance': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const SystemNode3D = ({ node }: { node: SystemNode }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
      if (meshRef.current) {
        meshRef.current.rotation.y += 0.01;
      }
    });

    return (
      <group position={node.position}>
        <Sphere ref={meshRef} args={[0.3]} onClick={() => setSelectedNode(node)}>
          <meshStandardMaterial color={getStatusColor(node.status)} />
        </Sphere>
        <Text
          position={[0, -0.6, 0]}
          fontSize={0.1}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {node.name}
        </Text>
        {/* Connection lines */}
        {node.connections.map(connId => {
          const connectedNode = systemNodes.find(n => n.id === connId);
          if (!connectedNode) return null;

          const start = new THREE.Vector3(...node.position);
          const end = new THREE.Vector3(...connectedNode.position);
          const direction = end.clone().sub(start).normalize();
          const length = start.distanceTo(end);

          return (
            <Cylinder
              key={connId}
              args={[0.01, 0.01, length]}
              position={start.clone().add(direction.clone().multiplyScalar(length / 2))}
              rotation={[0, 0, Math.atan2(direction.z, direction.x)]}
            >
              <meshBasicMaterial color="#4B5563" opacity={0.3} transparent />
            </Cylinder>
          );
        })}
      </group>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl shadow-2xl text-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AI-Powered Diagnostic Hub
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => setRealTimeData(!realTimeData)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              realTimeData ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            {realTimeData ? '🔴 Live' : '⚪ Paused'}
          </button>
          <button
            onClick={() => setAiMode(!aiMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              aiMode ? 'bg-purple-500 text-white' : 'bg-gray-600 text-gray-300'
            }`}
          >
            🤖 AI {aiMode ? 'Active' : 'Off'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3D Visualization */}
        <div className="bg-black/20 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-4">3D System Topology</h4>
          <div className="h-96 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              {systemNodes.map(node => (
                <SystemNode3D key={node.id} node={node} />
              ))}
            </Canvas>
          </div>
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">System Status</h4>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {systemNodes.map((node) => (
              <motion.div
                key={node.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedNode?.id === node.id ? 'border-blue-400 bg-blue-900/20' : 'border-gray-600 bg-gray-800/50'
                }`}
                onClick={() => setSelectedNode(node)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-white">{node.name}</h5>
                    <div className="flex items-center space-x-2 mt-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(node.status) }}
                      />
                      <span className="text-sm text-gray-300 capitalize">{node.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Efficiency</div>
                    <div className="text-lg font-bold text-green-400">{node.metrics.efficiency}%</div>
                  </div>
                </div>

                <AnimatePresence>
                  {selectedNode?.id === node.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-gray-600"
                    >
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Temperature:</span>
                          <span className="text-white ml-2">{node.metrics.temperature}°C</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Power:</span>
                          <span className="text-white ml-2">{node.metrics.power}kW</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Failure Risk:</span>
                          <span className={`ml-2 ${node.predictions.failureRisk > 10 ? 'text-red-400' : 'text-green-400'}`}>
                            {node.predictions.failureRisk}%
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Next Service:</span>
                          <span className="text-white ml-2">
                            {node.predictions.maintenanceDue.toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      {aiMode && (
                        <div className="mt-3 p-2 bg-purple-900/20 rounded">
                          <div className="text-xs text-purple-300">AI Recommendation:</div>
                          <div className="text-sm text-white">
                            {node.predictions.failureRisk > 10
                              ? 'Schedule maintenance within 7 days'
                              : 'System operating optimally'
                            }
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-400">
            {systemNodes.filter(n => n.status === 'operational').length}
          </div>
          <div className="text-sm text-gray-400">Operational</div>
        </div>
        <div className="bg-yellow-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {systemNodes.filter(n => n.status === 'warning').length}
          </div>
          <div className="text-sm text-gray-400">Warnings</div>
        </div>
        <div className="bg-red-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-400">
            {systemNodes.filter(n => n.status === 'error').length}
          </div>
          <div className="text-sm text-gray-400">Errors</div>
        </div>
        <div className="bg-blue-900/20 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(systemNodes.reduce((sum, n) => sum + n.metrics.efficiency, 0) / systemNodes.length)}%
          </div>
          <div className="text-sm text-gray-400">Avg Efficiency</div>
        </div>
      </div>
    </div>
  );
}