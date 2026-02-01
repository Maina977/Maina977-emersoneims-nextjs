'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SystemLayer,
  SchematicPart,
  systemLayers,
  GeneratorSystem
} from '@/lib/maintenance-companion/schematicData';
import PartInfoCard from './shared/PartInfoCard';

interface SchematicExplorerProps {
  onViewGuide?: (guideId: string) => void;
  onViewPart?: (partNumber: string) => void;
}

export default function SchematicExplorer({ onViewGuide, onViewPart }: SchematicExplorerProps) {
  const [activeSystem, setActiveSystem] = useState<GeneratorSystem>('engine');
  const [hoveredPart, setHoveredPart] = useState<SchematicPart | null>(null);
  const [selectedPart, setSelectedPart] = useState<SchematicPart | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const activeLayer = systemLayers.find(layer => layer.id === activeSystem);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Interactive Schematic Explorer
        </h2>
        <p className="text-slate-400">
          Explore generator systems with clickable parts and detailed information
        </p>
      </div>

      {/* System Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {systemLayers.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveSystem(layer.id)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${activeSystem === layer.id
                ? 'text-white'
                : 'text-slate-400 hover:text-slate-300 bg-slate-800/50'}
            `}
            style={{
              backgroundColor: activeSystem === layer.id ? `${layer.color}20` : undefined,
              borderColor: activeSystem === layer.id ? `${layer.color}50` : 'transparent',
              borderWidth: 1,
              color: activeSystem === layer.id ? layer.color : undefined
            }}
          >
            {layer.name}
          </button>
        ))}
      </div>

      {/* Schematic Area */}
      <div className="relative bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-2 bg-slate-900/80 backdrop-blur rounded-lg text-slate-400 hover:text-white transition-colors text-sm font-mono"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-slate-900/80 backdrop-blur rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* System Description */}
        <div className="absolute top-4 left-4 z-10">
          <div
            className="px-4 py-2 rounded-lg backdrop-blur"
            style={{
              backgroundColor: `${activeLayer?.color}15`,
              borderColor: `${activeLayer?.color}30`,
              borderWidth: 1
            }}
          >
            <h3 className="font-semibold" style={{ color: activeLayer?.color }}>
              {activeLayer?.name}
            </h3>
            <p className="text-slate-400 text-sm">{activeLayer?.description}</p>
          </div>
        </div>

        {/* Interactive Schematic */}
        <motion.div
          className="relative min-h-[500px] overflow-auto"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* Generator Outline SVG */}
          <svg
            viewBox="0 0 100 100"
            className="w-full h-[500px]"
            style={{ minWidth: 600 }}
          >
            {/* Background Grid */}
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="#334155" strokeWidth="0.1" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Generator Base Outline */}
            <rect
              x="10"
              y="15"
              width="80"
              height="70"
              rx="2"
              fill="none"
              stroke="#475569"
              strokeWidth="0.5"
              strokeDasharray="2 1"
            />

            {/* Engine Block */}
            <rect
              x="25"
              y="25"
              width="35"
              height="50"
              rx="2"
              fill={activeSystem === 'engine' ? '#EF444420' : '#1E293B'}
              stroke={activeSystem === 'engine' ? '#EF4444' : '#475569'}
              strokeWidth="0.5"
            />
            <text x="42.5" y="52" textAnchor="middle" fill="#94A3B8" fontSize="3">
              ENGINE
            </text>

            {/* Alternator */}
            <rect
              x="62"
              y="35"
              width="25"
              height="30"
              rx="2"
              fill={activeSystem === 'electrical' ? '#10B98120' : '#1E293B'}
              stroke={activeSystem === 'electrical' ? '#10B981' : '#475569'}
              strokeWidth="0.5"
            />
            <text x="74.5" y="52" textAnchor="middle" fill="#94A3B8" fontSize="2.5">
              ALTERNATOR
            </text>

            {/* Radiator */}
            <rect
              x="10"
              y="25"
              width="12"
              height="40"
              rx="1"
              fill={activeSystem === 'cooling' ? '#06B6D420' : '#1E293B'}
              stroke={activeSystem === 'cooling' ? '#06B6D4' : '#475569'}
              strokeWidth="0.5"
            />
            <text x="16" y="47" textAnchor="middle" fill="#94A3B8" fontSize="2" transform="rotate(-90 16 47)">
              RADIATOR
            </text>

            {/* Control Panel */}
            <rect
              x="75"
              y="15"
              width="15"
              height="18"
              rx="1"
              fill={activeSystem === 'control' ? '#3B82F620' : '#1E293B'}
              stroke={activeSystem === 'control' ? '#3B82F6' : '#475569'}
              strokeWidth="0.5"
            />
            <text x="82.5" y="25" textAnchor="middle" fill="#94A3B8" fontSize="2">
              CONTROL
            </text>

            {/* Fuel Tank */}
            <rect
              x="10"
              y="68"
              width="25"
              height="15"
              rx="1"
              fill={activeSystem === 'fuel' ? '#F59E0B20' : '#1E293B'}
              stroke={activeSystem === 'fuel' ? '#F59E0B' : '#475569'}
              strokeWidth="0.5"
            />
            <text x="22.5" y="77" textAnchor="middle" fill="#94A3B8" fontSize="2">
              FUEL TANK
            </text>

            {/* Exhaust */}
            <path
              d="M 60 30 L 70 20 L 90 20"
              fill="none"
              stroke={activeSystem === 'exhaust' ? '#8B5CF6' : '#475569'}
              strokeWidth={activeSystem === 'exhaust' ? '1' : '0.5'}
            />
            <text x="80" y="18" textAnchor="middle" fill="#94A3B8" fontSize="2">
              EXHAUST
            </text>
          </svg>

          {/* Interactive Part Hotspots */}
          {activeLayer?.parts.map((part) => (
            <motion.div
              key={part.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${part.position.x}%`,
                top: `${part.position.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onMouseEnter={() => setHoveredPart(part)}
              onMouseLeave={() => setHoveredPart(null)}
              onClick={() => setSelectedPart(part)}
              whileHover={{ scale: 1.2 }}
            >
              {/* Pulsing ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: activeLayer.color }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
              {/* Center dot */}
              <div
                className="relative w-4 h-4 rounded-full border-2 bg-slate-900"
                style={{
                  borderColor: activeLayer.color,
                  boxShadow: `0 0 10px ${activeLayer.color}60`
                }}
              />
              {/* Tooltip */}
              {hoveredPart?.id === part.id && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 whitespace-nowrap z-20"
                >
                  <span className="text-white text-sm font-medium">{part.name}</span>
                  <span className="text-slate-400 text-xs block">{part.partNumber}</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Part Info Panel */}
        <AnimatePresence>
          {selectedPart && (
            <div className="absolute right-4 top-20 z-20">
              <PartInfoCard
                part={selectedPart}
                onClose={() => setSelectedPart(null)}
                onViewGuide={onViewGuide}
                onViewPart={onViewPart}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Parts List */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 p-4">
        <h3 className="text-white font-semibold mb-4" style={{ color: activeLayer?.color }}>
          {activeLayer?.name} Components ({activeLayer?.parts.length})
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeLayer?.parts.map((part) => (
            <motion.button
              key={part.id}
              onClick={() => setSelectedPart(part)}
              className={`
                text-left p-3 rounded-lg border transition-all
                ${selectedPart?.id === part.id
                  ? 'bg-slate-700/50 border-slate-600'
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-slate-600'}
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-sm font-medium">{part.name}</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    part.criticalLevel === 'critical' ? 'bg-red-500' :
                    part.criticalLevel === 'high' ? 'bg-amber-500' :
                    part.criticalLevel === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                />
              </div>
              <span className="text-slate-500 text-xs font-mono">{part.partNumber}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-slate-400">Critical</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-slate-400">High</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="text-slate-400">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-slate-400">Low</span>
        </div>
      </div>
    </div>
  );
}
