'use client';

/**
 * Technical Bible Hub - Comprehensive Technical Documentation Center
 *
 * A full-featured documentation system for field technicians including:
 * - Interactive schematics with zoom/pan
 * - Color-coded wiring diagrams with IEC standards
 * - Troubleshooting decision trees
 * - Step-by-step repair guides
 * - Searchable parts catalog
 * - Maintenance schedule generator
 * - Print/PDF export
 * - Offline capability
 */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TECHNICAL_SERVICES,
  SAMPLE_SCHEMATICS,
  SAMPLE_WIRING_DIAGRAMS,
  TROUBLESHOOTING_TREES,
  REPAIR_PROCEDURES,
  PARTS_CATALOG,
  MAINTENANCE_SCHEDULES,
  IEC_WIRE_COLORS,
  searchAllContent,
  getServiceById,
  getSchematicsByService,
  getWiringDiagramsByService,
  getTroubleshootingByService,
  getRepairsByService,
  getPartsByService,
  getMaintenanceByService,
  type ServiceCategory,
  type TechnicalService,
  type Schematic,
  type WiringDiagram,
  type TroubleshootingTree,
  type TroubleshootingNode,
  type RepairProcedure,
  type Part,
  type MaintenanceSchedule,
  type MaintenanceTask,
} from '@/lib/technical/technicalBible';

// ==================== ICONS ====================
const Icons = {
  sun: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  zap: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  sliders: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
    </svg>
  ),
  thermometer: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  cpu: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
    </svg>
  ),
  droplet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  flame: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    </svg>
  ),
  settings: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  tool: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  ),
  activity: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  zoomIn: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
    </svg>
  ),
  zoomOut: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>
  ),
  printer: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
    </svg>
  ),
  download: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  wifi: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  wifiOff: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  chevronDown: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  check: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  x: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  alertTriangle: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  clock: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  list: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  grid: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  play: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  pause: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  layers: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
  book: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  wrench: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  package: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
};

const getServiceIcon = (iconName: string) => {
  return Icons[iconName as keyof typeof Icons] || Icons.settings;
};

// ==================== TAB TYPES ====================
type TabType =
  | 'overview'
  | 'schematics'
  | 'wiring'
  | 'troubleshooting'
  | 'repairs'
  | 'parts'
  | 'maintenance'
  | 'search';

// ==================== LOADING SKELETON ====================
const LoadingSkeleton = ({ lines = 4 }: { lines?: number }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-slate-700/50 rounded" style={{ width: `${100 - i * 15}%` }} />
    ))}
  </div>
);

// ==================== SCHEMATIC VIEWER ====================
interface SchematicViewerProps {
  schematic: Schematic;
  onClose: () => void;
}

const SchematicViewer = ({ schematic, onClose }: SchematicViewerProps) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(
    new Set(schematic.layers.map(l => l.id))
  );
  const svgRef = useRef<SVGSVGElement>(null);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(z => Math.min(Math.max(z * delta, 0.25), 4));
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleLayer = (layerId: string) => {
    setVisibleLayers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(layerId)) {
        newSet.delete(layerId);
      } else {
        newSet.add(layerId);
      }
      return newSet;
    });
  };

  const selectedComponentData = selectedComponent
    ? schematic.components.find(c => c.id === selectedComponent)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col"
    >
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{schematic.name}</h2>
          <p className="text-sm text-slate-400">{schematic.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-700 rounded-lg px-2 py-1">
            <button
              onClick={() => setZoom(z => Math.max(z - 0.25, 0.25))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              {Icons.zoomOut}
            </button>
            <span className="text-sm text-white min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(z + 0.25, 4))}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              {Icons.zoomIn}
            </button>
          </div>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="px-3 py-1 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {Icons.x}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Layer Panel */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            {Icons.layers} Layers
          </h3>
          <div className="space-y-2">
            {schematic.layers.map(layer => (
              <label
                key={layer.id}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={visibleLayers.has(layer.id)}
                  onChange={() => toggleLayer(layer.id)}
                  className="rounded border-slate-600 bg-slate-700 text-blue-500"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-sm text-slate-300 group-hover:text-white">
                  {layer.name}
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3">Components</h3>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {schematic.components.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`w-full text-left px-2 py-1 text-sm rounded transition-colors ${
                    selectedComponent === comp.id
                      ? 'bg-blue-500/30 text-blue-300'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {comp.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3">Notes</h3>
            <ul className="space-y-2">
              {schematic.notes.map((note, i) => (
                <li key={i} className="text-xs text-slate-400 flex gap-2">
                  <span className="text-yellow-500">!</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Schematic Canvas */}
        <div
          className="flex-1 overflow-hidden cursor-grab active:cursor-grabbing relative"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <svg
            ref={svgRef}
            width="100%"
            height="100%"
            viewBox={`${schematic.viewBox.x} ${schematic.viewBox.y} ${schematic.viewBox.width} ${schematic.viewBox.height}`}
            style={{
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transformOrigin: 'center',
            }}
            className="bg-slate-900"
          >
            {/* Grid */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Components */}
            {schematic.components
              .filter(comp => visibleLayers.has(comp.layer))
              .map(comp => {
                const layer = schematic.layers.find(l => l.id === comp.layer);
                const isSelected = selectedComponent === comp.id;

                return (
                  <g key={comp.id}>
                    {/* Component Box */}
                    <rect
                      x={comp.x}
                      y={comp.y}
                      width={comp.width}
                      height={comp.height}
                      fill={isSelected ? `${layer?.color}33` : '#1e293b'}
                      stroke={layer?.color || '#64748b'}
                      strokeWidth={isSelected ? 3 : 2}
                      rx={4}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedComponent(comp.id)}
                    />
                    {/* Component Label */}
                    <text
                      x={comp.x + comp.width / 2}
                      y={comp.y + comp.height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={layer?.color || '#94a3b8'}
                      fontSize={12}
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {comp.name}
                    </text>
                    {/* Part Number */}
                    {comp.partNumber && (
                      <text
                        x={comp.x + comp.width / 2}
                        y={comp.y + comp.height + 12}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize={9}
                        className="pointer-events-none"
                      >
                        {comp.partNumber}
                      </text>
                    )}
                  </g>
                );
              })}

            {/* Connection Lines */}
            {schematic.components.map(comp => {
              const layer = schematic.layers.find(l => l.id === comp.layer);
              return comp.connectedTo.map(targetId => {
                const target = schematic.components.find(c => c.id === targetId);
                if (!target || !visibleLayers.has(comp.layer)) return null;
                return (
                  <line
                    key={`${comp.id}-${targetId}`}
                    x1={comp.x + comp.width / 2}
                    y1={comp.y + comp.height / 2}
                    x2={target.x + target.width / 2}
                    y2={target.y + target.height / 2}
                    stroke={layer?.color || '#64748b'}
                    strokeWidth={1.5}
                    strokeDasharray="4,2"
                    opacity={0.5}
                  />
                );
              });
            })}
          </svg>
        </div>

        {/* Component Details Panel */}
        <AnimatePresence>
          {selectedComponentData && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {selectedComponentData.name}
                </h3>
                <button
                  onClick={() => setSelectedComponent(null)}
                  className="text-slate-400 hover:text-white"
                >
                  {Icons.x}
                </button>
              </div>

              {selectedComponentData.partNumber && (
                <div className="mb-4">
                  <span className="text-xs text-slate-500">Part Number</span>
                  <p className="text-sm font-mono text-blue-400">
                    {selectedComponentData.partNumber}
                  </p>
                </div>
              )}

              <p className="text-sm text-slate-400 mb-4">
                {selectedComponentData.details}
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Properties</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedComponentData.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-400">{key}</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedComponentData.specifications && (
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-2">Specifications</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedComponentData.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-slate-400">{key}</span>
                          <span className="text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Connected To</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedComponentData.connectedTo.map(id => {
                      const target = schematic.components.find(c => c.id === id);
                      return (
                        <button
                          key={id}
                          onClick={() => setSelectedComponent(id)}
                          className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded hover:bg-slate-600"
                        >
                          {target?.name || id}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ==================== WIRING DIAGRAM VIEWER ====================
interface WiringDiagramViewerProps {
  diagram: WiringDiagram;
  onClose: () => void;
}

const WiringDiagramViewer = ({ diagram, onClose }: WiringDiagramViewerProps) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);

  const selectedWireData = selectedWire
    ? diagram.wires.find(w => w.id === selectedWire)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col"
    >
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{diagram.name}</h2>
          <p className="text-sm text-slate-400">{diagram.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAnimation(!showAnimation)}
            className={`px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 transition-colors ${
              showAnimation
                ? 'bg-green-500/30 text-green-300'
                : 'bg-slate-700 text-white hover:bg-slate-600'
            }`}
          >
            {showAnimation ? Icons.pause : Icons.play}
            Current Flow
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {Icons.x}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Wire List */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3">Wire Schedule</h3>
          <div className="space-y-2">
            {diagram.wires.map(wire => {
              const colorData = IEC_WIRE_COLORS[wire.color];
              return (
                <button
                  key={wire.id}
                  onClick={() => setSelectedWire(wire.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedWire === wire.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-600"
                      style={{ backgroundColor: colorData?.hex || '#666' }}
                    />
                    <span className="text-sm font-medium text-white">
                      {wire.colorName}
                    </span>
                    <span className="text-xs text-slate-500 ml-auto">
                      {wire.gauge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{wire.function}</p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              {Icons.alertTriangle} Safety Notes
            </h3>
            <ul className="space-y-2">
              {diagram.safetyNotes.map((note, i) => (
                <li key={i} className="text-xs text-red-400 flex gap-2">
                  <span className="text-red-500 shrink-0">!</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700">
            <h3 className="text-sm font-semibold text-white mb-3">Test Points</h3>
            <div className="space-y-3">
              {diagram.testPoints.map(tp => (
                <div key={tp.id} className="text-xs">
                  <p className="text-white font-medium">{tp.name}</p>
                  <p className="text-green-400">{tp.expectedValue}</p>
                  <p className="text-slate-500">{tp.procedure}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diagram Canvas */}
        <div className="flex-1 p-8 overflow-auto">
          <svg width="600" height="400" viewBox="0 0 600 400" className="bg-slate-900 rounded-lg">
            {/* Grid */}
            <defs>
              <pattern id="wiring-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="1" />
              </pattern>
              {/* Animated dash pattern */}
              {showAnimation && (
                <pattern id="flow" width="10" height="1" patternUnits="userSpaceOnUse">
                  <rect width="6" height="1" fill="#22c55e">
                    <animate attributeName="x" from="0" to="10" dur="0.5s" repeatCount="indefinite" />
                  </rect>
                </pattern>
              )}
            </defs>
            <rect width="100%" height="100%" fill="url(#wiring-grid)" />

            {/* Terminal Blocks */}
            <g>
              <rect x="60" y="50" width="100" height="250" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="110" y="35" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">Controller</text>

              <rect x="440" y="50" width="100" height="250" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
              <text x="490" y="35" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">ATS</text>
            </g>

            {/* Terminals */}
            {diagram.terminals.map(terminal => (
              <g key={terminal.id}>
                <circle
                  cx={terminal.x}
                  cy={terminal.y}
                  r="8"
                  fill="#334155"
                  stroke={terminal.type === 'ground' ? '#22c55e' : '#64748b'}
                  strokeWidth="2"
                />
                <text
                  x={terminal.x < 300 ? terminal.x - 15 : terminal.x + 15}
                  y={terminal.y + 4}
                  textAnchor={terminal.x < 300 ? 'end' : 'start'}
                  fill="#94a3b8"
                  fontSize="10"
                >
                  {terminal.name.split(' ').pop()}
                </text>
              </g>
            ))}

            {/* Wires */}
            {diagram.wires.map(wire => {
              const fromTerminal = diagram.terminals.find(t => t.id === wire.from);
              const toTerminal = diagram.terminals.find(t => t.id === wire.to);
              if (!fromTerminal || !toTerminal) return null;

              const colorData = IEC_WIRE_COLORS[wire.color];
              const isSelected = selectedWire === wire.id;
              const midX = (fromTerminal.x + toTerminal.x) / 2;

              return (
                <g key={wire.id}>
                  <path
                    d={`M ${fromTerminal.x} ${fromTerminal.y}
                        C ${midX} ${fromTerminal.y}, ${midX} ${toTerminal.y}, ${toTerminal.x} ${toTerminal.y}`}
                    fill="none"
                    stroke={colorData?.hex || '#666'}
                    strokeWidth={isSelected ? 4 : 2}
                    strokeDasharray={showAnimation ? '6,4' : 'none'}
                    className={`cursor-pointer transition-all duration-200 ${
                      showAnimation ? 'animate-pulse' : ''
                    }`}
                    onClick={() => setSelectedWire(wire.id)}
                  />
                  {/* Wire Label */}
                  <text
                    x={midX}
                    y={(fromTerminal.y + toTerminal.y) / 2 - 8}
                    textAnchor="middle"
                    fill={colorData?.hex || '#666'}
                    fontSize="9"
                    fontWeight={isSelected ? 'bold' : 'normal'}
                  >
                    {wire.gauge}
                  </text>
                </g>
              );
            })}

            {/* Current Flow Animation Overlay */}
            {showAnimation && (
              <g className="pointer-events-none">
                {diagram.wires.map(wire => {
                  const fromTerminal = diagram.terminals.find(t => t.id === wire.from);
                  const toTerminal = diagram.terminals.find(t => t.id === wire.to);
                  if (!fromTerminal || !toTerminal) return null;
                  const midX = (fromTerminal.x + toTerminal.x) / 2;

                  return (
                    <circle key={`flow-${wire.id}`} r="3" fill="#22c55e">
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        path={`M ${fromTerminal.x} ${fromTerminal.y}
                              C ${midX} ${fromTerminal.y}, ${midX} ${toTerminal.y}, ${toTerminal.x} ${toTerminal.y}`}
                      />
                    </circle>
                  );
                })}
              </g>
            )}
          </svg>
        </div>

        {/* Wire Details Panel */}
        <AnimatePresence>
          {selectedWireData && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="w-72 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-slate-600"
                    style={{ backgroundColor: IEC_WIRE_COLORS[selectedWireData.color]?.hex || '#666' }}
                  />
                  <h3 className="text-lg font-semibold text-white">
                    {selectedWireData.colorName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedWire(null)}
                  className="text-slate-400 hover:text-white"
                >
                  {Icons.x}
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <p className="text-sm text-white font-medium">{selectedWireData.function}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs text-slate-500">Wire Gauge</span>
                    <p className="text-sm text-white">{selectedWireData.gauge}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Type</span>
                    <p className="text-sm text-white">{selectedWireData.type}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Max Current</span>
                    <p className="text-sm text-white">{selectedWireData.maxCurrent}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500">Voltage</span>
                    <p className="text-sm text-white">{selectedWireData.voltage}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500">IEC Color Code</span>
                  <p className="text-sm font-mono text-blue-400">{selectedWireData.color}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {IEC_WIRE_COLORS[selectedWireData.color]?.function}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <span className="text-xs text-slate-500">Connection</span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-white">{selectedWireData.from}</span>
                    <span className="text-slate-500">&rarr;</span>
                    <span className="text-sm text-white">{selectedWireData.to}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ==================== TROUBLESHOOTING WIZARD ====================
interface TroubleshootingWizardProps {
  tree: TroubleshootingTree;
  onClose: () => void;
}

const TroubleshootingWizard = ({ tree, onClose }: TroubleshootingWizardProps) => {
  const [currentNodeId, setCurrentNodeId] = useState(tree.startNode);
  const [history, setHistory] = useState<string[]>([]);

  const currentNode = tree.nodes.find(n => n.id === currentNodeId);

  const handleAnswer = (answer: 'yes' | 'no') => {
    if (!currentNode) return;
    const nextNodeId = answer === 'yes' ? currentNode.yesNode : currentNode.noNode;
    if (nextNodeId) {
      setHistory(prev => [...prev, currentNodeId]);
      setCurrentNodeId(nextNodeId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prevNodeId = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentNodeId(prevNodeId);
    }
  };

  const handleRestart = () => {
    setHistory([]);
    setCurrentNodeId(tree.startNode);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 border-red-500 text-red-300';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
      default: return 'bg-blue-500/20 border-blue-500 text-blue-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col"
    >
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{tree.name}</h2>
          <p className="text-sm text-slate-400">{tree.symptom}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            Step {history.length + 1}
          </span>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {Icons.x}
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            {currentNode && (
              <motion.div
                key={currentNodeId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Progress Bar */}
                <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(history.length / (tree.nodes.length / 2)) * 100}%` }}
                  />
                </div>

                {/* Question or Solution */}
                {currentNode.solution ? (
                  <div className={`p-6 rounded-xl border-2 ${getSeverityColor(currentNode.severity)}`}>
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-current/20">
                        {currentNode.severity === 'critical' ? Icons.alertTriangle :
                         currentNode.severity === 'warning' ? Icons.alertTriangle : Icons.check}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">Solution Found</h3>
                        <p className="text-base">{currentNode.solution}</p>

                        {currentNode.tools && currentNode.tools.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Required Tools</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentNode.tools.map((tool, i) => (
                                <span key={i} className="px-2 py-1 text-xs bg-slate-800 rounded">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentNode.partsList && currentNode.partsList.length > 0 && (
                          <div className="mt-4">
                            <h4 className="text-sm font-semibold mb-2">Parts Needed</h4>
                            <div className="flex flex-wrap gap-2">
                              {currentNode.partsList.map((part, i) => (
                                <span key={i} className="px-2 py-1 text-xs bg-slate-800 rounded">
                                  {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentNode.timeEstimate && (
                          <p className="mt-4 text-sm flex items-center gap-2">
                            {Icons.clock}
                            Estimated time: {currentNode.timeEstimate}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                    <p className="text-xl text-white font-medium text-center">
                      {currentNode.question}
                    </p>

                    {currentNode.tools && currentNode.tools.length > 0 && (
                      <div className="mt-4 text-center">
                        <span className="text-xs text-slate-500">Tools needed: </span>
                        <span className="text-xs text-slate-400">
                          {currentNode.tools.join(', ')}
                        </span>
                      </div>
                    )}

                    {currentNode.timeEstimate && (
                      <p className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                        {Icons.clock}
                        {currentNode.timeEstimate}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  {history.length > 0 && (
                    <button
                      onClick={handleBack}
                      className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Back
                    </button>
                  )}

                  {currentNode.solution ? (
                    <button
                      onClick={handleRestart}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Start Over
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleAnswer('yes')}
                        className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => handleAnswer('no')}
                        className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        No
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Related Fault Codes */}
      {tree.relatedFaultCodes.length > 0 && (
        <div className="bg-slate-800 border-t border-slate-700 px-4 py-3">
          <span className="text-sm text-slate-500">Related fault codes: </span>
          <span className="text-sm text-yellow-400">
            {tree.relatedFaultCodes.join(', ')}
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ==================== REPAIR GUIDE VIEWER ====================
interface RepairGuideViewerProps {
  procedure: RepairProcedure;
  onClose: () => void;
}

const RepairGuideViewer = ({ procedure, onClose }: RepairGuideViewerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStepComplete = (stepNum: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNum)) {
        newSet.delete(stepNum);
      } else {
        newSet.add(stepNum);
      }
      return newSet;
    });
  };

  const difficultyColors = {
    easy: 'bg-green-500/20 text-green-400 border-green-500',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500',
    advanced: 'bg-orange-500/20 text-orange-400 border-orange-500',
    expert: 'bg-red-500/20 text-red-400 border-red-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900/95 flex flex-col"
    >
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">{procedure.name}</h2>
            <p className="text-sm text-slate-400">{procedure.symptom}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 text-xs rounded-full border ${difficultyColors[procedure.difficulty]}`}>
              {procedure.difficulty.toUpperCase()}
            </span>
            <span className="text-sm text-slate-400 flex items-center gap-1">
              {Icons.clock} {procedure.timeEstimate}
            </span>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white transition-colors"
            >
              {Icons.x}
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          {/* Safety Warnings */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              {Icons.alertTriangle} Safety Warnings
            </h3>
            <ul className="space-y-2">
              {procedure.safetyWarnings.map((warning, i) => (
                <li key={i} className="text-xs text-red-300 flex gap-2 p-2 bg-red-500/10 rounded">
                  <span className="text-red-500 shrink-0">!</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Required */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              {Icons.wrench} Tools Required
            </h3>
            <ul className="space-y-1">
              {procedure.tools.map((tool, i) => (
                <li key={i} className="text-sm text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          {/* Parts Required */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              {Icons.package} Parts Required
            </h3>
            <ul className="space-y-2">
              {procedure.parts.map((part, i) => (
                <li key={i} className="text-sm p-2 bg-slate-700/50 rounded">
                  <span className="text-white">{part.name}</span>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span className="font-mono">{part.partNumber}</span>
                    <span>Qty: {part.quantity}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-3">Progress</h3>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${(completedSteps.size / procedure.steps.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {completedSteps.size} of {procedure.steps.length} steps completed
            </p>
          </div>
        </div>

        {/* Steps Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-4">
            {procedure.steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = completedSteps.has(step.stepNumber);

              return (
                <motion.div
                  key={step.stepNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-green-500/10 border-green-500/50'
                      : isActive
                      ? 'bg-blue-500/10 border-blue-500'
                      : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                  }`}
                  onClick={() => setCurrentStep(index)}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleStepComplete(step.stepNumber); }}
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-700 text-slate-400'
                      }`}
                    >
                      {isCompleted ? Icons.check : step.stepNumber}
                    </button>
                    <div className="flex-1">
                      <p className={`text-base ${isCompleted ? 'text-green-300' : 'text-white'}`}>
                        {step.instruction}
                      </p>

                      {step.warning && (
                        <div className="mt-2 p-2 bg-red-500/10 rounded text-sm text-red-400 flex items-start gap-2">
                          {Icons.alertTriangle}
                          <span>{step.warning}</span>
                        </div>
                      )}

                      {step.tip && (
                        <div className="mt-2 p-2 bg-blue-500/10 rounded text-sm text-blue-400 flex items-start gap-2">
                          {Icons.info}
                          <span>{step.tip}</span>
                        </div>
                      )}

                      {step.torqueSpec && (
                        <div className="mt-2 p-2 bg-yellow-500/10 rounded text-sm text-yellow-400">
                          Torque: {step.torqueSpec}
                        </div>
                      )}

                      {step.checkPoint && (
                        <div className="mt-2 p-2 bg-slate-700 rounded text-sm text-slate-300 flex items-start gap-2">
                          {Icons.check}
                          <span>Checkpoint: {step.checkPoint}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Test Procedure */}
            <div className="mt-8 p-4 bg-green-500/10 rounded-lg border border-green-500/30">
              <h3 className="text-lg font-semibold text-green-400 mb-2">Final Test Procedure</h3>
              <p className="text-white">{procedure.testProcedure}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== PARTS CATALOG ====================
interface PartsCatalogProps {
  parts: Part[];
  searchQuery: string;
}

const PartsCatalog = ({ parts, searchQuery }: PartsCatalogProps) => {
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredParts = useMemo(() => {
    if (!searchQuery) return parts;
    const query = searchQuery.toLowerCase();
    return parts.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.partNumber.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query)
    );
  }, [parts, searchQuery]);

  const availabilityColors = {
    'in-stock': 'bg-green-500/20 text-green-400',
    'order': 'bg-yellow-500/20 text-yellow-400',
    'special-order': 'bg-red-500/20 text-red-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">{filteredParts.length} parts found</p>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            {Icons.grid}
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            {Icons.list}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParts.map(part => (
            <motion.div
              key={part.id}
              whileHover={{ scale: 1.02 }}
              className="p-4 bg-slate-800 rounded-lg border border-slate-700 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setSelectedPart(part)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-blue-400">{part.partNumber}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${availabilityColors[part.availability]}`}>
                  {part.availability.replace('-', ' ')}
                </span>
              </div>
              <h4 className="text-white font-medium mb-1">{part.name}</h4>
              <p className="text-sm text-slate-400 line-clamp-2 mb-3">{part.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-green-400 font-semibold">
                  {part.price.currency} {part.price.min.toLocaleString()} - {part.price.max.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">{part.leadTime}</span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredParts.map(part => (
            <div
              key={part.id}
              className="p-3 bg-slate-800 rounded-lg border border-slate-700 flex items-center gap-4 cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => setSelectedPart(part)}
            >
              <span className="text-sm font-mono text-blue-400 w-32">{part.partNumber}</span>
              <span className="flex-1 text-white">{part.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${availabilityColors[part.availability]}`}>
                {part.availability.replace('-', ' ')}
              </span>
              <span className="text-green-400 text-sm w-48 text-right">
                {part.price.currency} {part.price.min.toLocaleString()} - {part.price.max.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Part Detail Modal */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedPart(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-sm font-mono text-blue-400">{selectedPart.partNumber}</span>
                  <h3 className="text-xl font-semibold text-white">{selectedPart.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedPart(null)}
                  className="text-slate-400 hover:text-white"
                >
                  {Icons.x}
                </button>
              </div>

              <p className="text-slate-400 mb-4">{selectedPart.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xs text-slate-500">Price Range</span>
                  <p className="text-lg text-green-400 font-semibold">
                    {selectedPart.price.currency} {selectedPart.price.min.toLocaleString()} - {selectedPart.price.max.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <span className="text-xs text-slate-500">Availability</span>
                  <p className={`text-lg font-semibold ${
                    selectedPart.availability === 'in-stock' ? 'text-green-400' :
                    selectedPart.availability === 'order' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {selectedPart.availability.replace('-', ' ').toUpperCase()}
                  </p>
                  <p className="text-xs text-slate-500">{selectedPart.leadTime}</p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-2">Specifications</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedPart.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between p-2 bg-slate-700/30 rounded">
                      <span className="text-sm text-slate-400">{key}</span>
                      <span className="text-sm text-white">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedPart.compatibleModels.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-2">Compatible Models</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPart.compatibleModels.map((model, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-slate-700 text-slate-300 rounded">
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedPart.replacementInterval && (
                <div className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
                  <span className="text-sm text-yellow-400">
                    Recommended Replacement: {selectedPart.replacementInterval}
                  </span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================== MAINTENANCE SCHEDULER ====================
interface MaintenanceSchedulerProps {
  schedule: MaintenanceSchedule;
  engineHours: number;
}

const MaintenanceScheduler = ({ schedule, engineHours }: MaintenanceSchedulerProps) => {
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const getDueTasks = () => {
    return schedule.tasks.filter(task => {
      if (!task.intervalHours) return false;
      return engineHours % task.intervalHours < 100;
    });
  };

  const priorityColors = {
    low: 'text-slate-400',
    medium: 'text-blue-400',
    high: 'text-yellow-400',
    critical: 'text-red-400',
  };

  const handlePrint = () => {
    window.print();
  };

  const dueTasks = getDueTasks();

  return (
    <div className="space-y-6">
      {/* Due Tasks Alert */}
      {dueTasks.length > 0 && (
        <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
          <h3 className="text-lg font-semibold text-yellow-400 mb-2 flex items-center gap-2">
            {Icons.alertTriangle} Maintenance Due
          </h3>
          <p className="text-sm text-yellow-300 mb-3">
            Based on {engineHours} engine hours, the following tasks are due:
          </p>
          <div className="flex flex-wrap gap-2">
            {dueTasks.map(task => (
              <span key={task.id} className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                {task.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
        >
          {Icons.printer} Print Checklist
        </button>
      </div>

      {/* Task Groups */}
      <div className="space-y-4">
        {['preventive', 'predictive', 'corrective'].map(category => {
          const categoryTasks = schedule.tasks.filter(t => t.category === category);
          if (categoryTasks.length === 0) return null;

          return (
            <div key={category} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4 capitalize">
                {category} Maintenance
              </h3>
              <div className="space-y-3">
                {categoryTasks.map(task => (
                  <div
                    key={task.id}
                    className={`p-4 rounded-lg border transition-colors ${
                      checkedTasks.has(task.id)
                        ? 'bg-green-500/10 border-green-500/30'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors ${
                          checkedTasks.has(task.id)
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-slate-500 text-transparent'
                        }`}
                      >
                        {Icons.check}
                      </button>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`font-medium ${checkedTasks.has(task.id) ? 'text-green-300 line-through' : 'text-white'}`}>
                            {task.name}
                          </h4>
                          <span className={`text-xs ${priorityColors[task.priority]}`}>
                            {task.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{task.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            {Icons.clock} {task.interval}
                          </span>
                          <span className="flex items-center gap-1">
                            {Icons.wrench} {task.estimatedTime}
                          </span>
                        </div>

                        {/* Expandable Procedure */}
                        <details className="mt-3">
                          <summary className="text-sm text-blue-400 cursor-pointer hover:text-blue-300">
                            View Procedure ({task.procedure.length} steps)
                          </summary>
                          <ul className="mt-2 space-y-1 pl-4 border-l-2 border-slate-600">
                            {task.procedure.map((step, i) => (
                              <li key={i} className="text-sm text-slate-400">
                                {step}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
interface TechnicalBibleHubProps {
  prefersReducedMotion?: boolean;
  initialService?: ServiceCategory;
}

export default function TechnicalBibleHub({
  prefersReducedMotion = false,
  initialService,
}: TechnicalBibleHubProps) {
  // State
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(initialService || null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [engineHours, setEngineHours] = useState(2500);

  // Viewers
  const [selectedSchematic, setSelectedSchematic] = useState<Schematic | null>(null);
  const [selectedWiring, setSelectedWiring] = useState<WiringDiagram | null>(null);
  const [selectedTroubleshooting, setSelectedTroubleshooting] = useState<TroubleshootingTree | null>(null);
  const [selectedRepair, setSelectedRepair] = useState<RepairProcedure | null>(null);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return searchAllContent(searchQuery);
  }, [searchQuery]);

  // Service-specific data
  const serviceData = useMemo(() => {
    if (!selectedService) return null;
    return {
      service: getServiceById(selectedService),
      schematics: getSchematicsByService(selectedService),
      wiringDiagrams: getWiringDiagramsByService(selectedService),
      troubleshooting: getTroubleshootingByService(selectedService),
      repairs: getRepairsByService(selectedService),
      parts: getPartsByService(selectedService),
      maintenance: getMaintenanceByService(selectedService),
    };
  }, [selectedService]);

  // Tab content
  const renderTabContent = () => {
    if (activeTab === 'search' && searchResults) {
      return (
        <div className="space-y-8">
          <h2 className="text-xl font-semibold text-white">Search Results for "{searchQuery}"</h2>

          {searchResults.schematics.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Schematics ({searchResults.schematics.length})</h3>
              <div className="grid gap-3">
                {searchResults.schematics.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSchematic(s)}
                    className="p-3 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white font-medium">{s.name}</span>
                    <p className="text-sm text-slate-400">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.troubleshooting.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Troubleshooting ({searchResults.troubleshooting.length})</h3>
              <div className="grid gap-3">
                {searchResults.troubleshooting.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTroubleshooting(t)}
                    className="p-3 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white font-medium">{t.name}</span>
                    <p className="text-sm text-slate-400">{t.symptom}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.repairs.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Repair Procedures ({searchResults.repairs.length})</h3>
              <div className="grid gap-3">
                {searchResults.repairs.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRepair(r)}
                    className="p-3 bg-slate-800 rounded-lg text-left hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white font-medium">{r.name}</span>
                    <p className="text-sm text-slate-400">{r.symptom}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchResults.parts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-white mb-3">Parts ({searchResults.parts.length})</h3>
              <PartsCatalog parts={searchResults.parts} searchQuery="" />
            </div>
          )}

          {Object.values(searchResults).every(arr => arr.length === 0) && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg">No results found for "{searchQuery}"</p>
              <p className="text-sm mt-2">Try different keywords or browse by service</p>
            </div>
          )}
        </div>
      );
    }

    if (!selectedService || !serviceData) {
      return (
        <div className="text-center py-12">
          <h2 className="text-xl text-white mb-4">Select a Service</h2>
          <p className="text-slate-400">Choose a service category to view technical documentation</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-blue-400">{serviceData.service?.schematicCount}</p>
                <p className="text-sm text-slate-400">Schematics</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-green-400">{serviceData.service?.wiringDiagramCount}</p>
                <p className="text-sm text-slate-400">Wiring Diagrams</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-yellow-400">{serviceData.service?.troubleshootingGuides}</p>
                <p className="text-sm text-slate-400">Troubleshooting Guides</p>
              </div>
              <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-purple-400">{serviceData.service?.repairProcedures}</p>
                <p className="text-sm text-slate-400">Repair Procedures</p>
              </div>
            </div>

            <p className="text-slate-300">{serviceData.service?.description}</p>

            {/* Quick Access */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceData.schematics.slice(0, 3).map(s => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedSchematic(s); }}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-blue-500 transition-colors"
                >
                  <span className="text-xs text-blue-400">SCHEMATIC</span>
                  <h4 className="text-white font-medium mt-1">{s.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{s.description}</p>
                </button>
              ))}
              {serviceData.troubleshooting.slice(0, 3).map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTroubleshooting(t)}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-yellow-500 transition-colors"
                >
                  <span className="text-xs text-yellow-400">TROUBLESHOOTING</span>
                  <h4 className="text-white font-medium mt-1">{t.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2">{t.symptom}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'schematics':
        return (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceData.schematics.length > 0 ? (
              serviceData.schematics.map(s => (
                <motion.button
                  key={s.id}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                  onClick={() => setSelectedSchematic(s)}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-blue-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      s.difficulty === 'basic' ? 'bg-green-500/20 text-green-400' :
                      s.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      s.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {s.difficulty}
                    </span>
                    <span className="text-xs text-slate-500">{s.category}</span>
                  </div>
                  <h4 className="text-white font-medium">{s.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">{s.description}</p>
                  <p className="text-xs text-slate-500 mt-2">{s.components.length} components</p>
                </motion.button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p>No schematics available for this service yet.</p>
              </div>
            )}
          </div>
        );

      case 'wiring':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {serviceData.wiringDiagrams.length > 0 ? (
              serviceData.wiringDiagrams.map(w => (
                <motion.button
                  key={w.id}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                  onClick={() => setSelectedWiring(w)}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-green-500 transition-colors"
                >
                  <span className="text-xs text-slate-500">{w.category}</span>
                  <h4 className="text-white font-medium mt-1">{w.name}</h4>
                  <p className="text-sm text-slate-400 line-clamp-2 mt-1">{w.description}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-slate-500">{w.wires.length} wires</span>
                    <span className="text-xs text-slate-500">{w.terminals.length} terminals</span>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {w.wires.slice(0, 6).map(wire => (
                      <div
                        key={wire.id}
                        className="w-4 h-4 rounded-full border border-slate-600"
                        style={{ backgroundColor: IEC_WIRE_COLORS[wire.color]?.hex || '#666' }}
                        title={wire.colorName}
                      />
                    ))}
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p>No wiring diagrams available for this service yet.</p>
              </div>
            )}
          </div>
        );

      case 'troubleshooting':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {serviceData.troubleshooting.length > 0 ? (
              serviceData.troubleshooting.map(t => (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                  onClick={() => setSelectedTroubleshooting(t)}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-yellow-500 transition-colors"
                >
                  <h4 className="text-white font-medium">{t.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{t.symptom}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs text-slate-500">{t.nodes.length} decision points</span>
                    {t.relatedFaultCodes.length > 0 && (
                      <span className="text-xs text-yellow-400">
                        {t.relatedFaultCodes.length} fault codes
                      </span>
                    )}
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p>No troubleshooting guides available for this service yet.</p>
              </div>
            )}
          </div>
        );

      case 'repairs':
        return (
          <div className="grid md:grid-cols-2 gap-4">
            {serviceData.repairs.length > 0 ? (
              serviceData.repairs.map(r => (
                <motion.button
                  key={r.id}
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.02 }}
                  onClick={() => setSelectedRepair(r)}
                  className="p-4 bg-slate-800 rounded-lg border border-slate-700 text-left hover:border-purple-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      r.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
                      r.difficulty === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' :
                      r.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {r.difficulty}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      {Icons.clock} {r.timeEstimate}
                    </span>
                  </div>
                  <h4 className="text-white font-medium">{r.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{r.symptom}</p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                    <span>{r.steps.length} steps</span>
                    <span>{r.tools.length} tools</span>
                    <span>{r.parts.length} parts</span>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                <p>No repair procedures available for this service yet.</p>
              </div>
            )}
          </div>
        );

      case 'parts':
        return <PartsCatalog parts={serviceData.parts} searchQuery={searchQuery} />;

      case 'maintenance':
        return serviceData.maintenance ? (
          <div>
            <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <label className="text-sm text-slate-400 block mb-2">Current Engine Hours</label>
              <input
                type="number"
                value={engineHours}
                onChange={e => setEngineHours(Number(e.target.value))}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <MaintenanceScheduler schedule={serviceData.maintenance} engineHours={engineHours} />
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <p>No maintenance schedule available for this service yet.</p>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    { id: 'overview', label: 'Overview', icon: Icons.book },
    { id: 'schematics', label: 'Schematics', icon: Icons.layers },
    { id: 'wiring', label: 'Wiring', icon: Icons.activity },
    { id: 'troubleshooting', label: 'Troubleshoot', icon: Icons.alertTriangle },
    { id: 'repairs', label: 'Repairs', icon: Icons.wrench },
    { id: 'parts', label: 'Parts', icon: Icons.package },
    { id: 'maintenance', label: 'Maintenance', icon: Icons.calendar },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                {Icons.book}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Technical Bible</h1>
                <p className="text-sm text-slate-400">Comprehensive Documentation Hub</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      setActiveTab('search');
                    }
                  }}
                  className="w-64 px-4 py-2 pl-10 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {Icons.search}
                </span>
              </div>

              {/* Online Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                isOnline ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isOnline ? Icons.wifi : Icons.wifiOff}
                <span className="text-sm">{isOnline ? 'Online' : 'Offline'}</span>
              </div>

              {/* Print Button */}
              <button
                onClick={() => window.print()}
                className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                title="Print"
              >
                {Icons.printer}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Service Sidebar */}
        <aside className="w-64 bg-slate-800 border-r border-slate-700 min-h-[calc(100vh-80px)] sticky top-20 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Services
            </h2>
            <nav className="space-y-1">
              {TECHNICAL_SERVICES.map(service => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id);
                    setActiveTab('overview');
                    setSearchQuery('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                    selectedService === service.id
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span style={{ color: service.color }}>
                    {getServiceIcon(service.icon)}
                  </span>
                  <span className="text-sm font-medium">{service.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-80px)]">
          {/* Tabs */}
          {selectedService && activeTab !== 'search' && (
            <div className="bg-slate-800/50 border-b border-slate-700 sticky top-20 z-30">
              <div className="max-w-6xl mx-auto px-4">
                <nav className="flex gap-1 overflow-x-auto py-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white'
                          : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="max-w-6xl mx-auto px-4 py-6">
            {isLoading ? (
              <LoadingSkeleton lines={6} />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedService}-${activeTab}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>

      {/* Full-screen Viewers */}
      <AnimatePresence>
        {selectedSchematic && (
          <SchematicViewer
            schematic={selectedSchematic}
            onClose={() => setSelectedSchematic(null)}
          />
        )}
        {selectedWiring && (
          <WiringDiagramViewer
            diagram={selectedWiring}
            onClose={() => setSelectedWiring(null)}
          />
        )}
        {selectedTroubleshooting && (
          <TroubleshootingWizard
            tree={selectedTroubleshooting}
            onClose={() => setSelectedTroubleshooting(null)}
          />
        )}
        {selectedRepair && (
          <RepairGuideViewer
            procedure={selectedRepair}
            onClose={() => setSelectedRepair(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
