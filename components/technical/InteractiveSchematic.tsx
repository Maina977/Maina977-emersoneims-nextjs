'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * INTERACTIVE SCHEMATIC VIEWER COMPONENT
 *
 * Displays detailed wiring diagrams with:
 * - Zoomable/pannable view
 * - Layer toggling
 * - Wire highlighting on hover
 * - Component tooltips
 * - Connection tracing
 */

// Types
interface Position { x: number; y: number; }
interface Size { width: number; height: number; }

interface SchematicWire {
  id: string;
  from: { component: string; pin: string; x: number; y: number };
  to: { component: string; pin: string; x: number; y: number };
  waypoints?: Position[];
  color: string;
  gauge: string;
  label: string;
  type: 'power' | 'ground' | 'signal' | 'can' | 'communication';
  layer: string;
}

interface SchematicComponent {
  id: string;
  name: string;
  type: string;
  position: Position;
  size: Size;
  terminals: SchematicTerminal[];
  layer: string;
  description?: string;
}

interface SchematicTerminal {
  id: string;
  name: string;
  position: Position;
  type: 'input' | 'output' | 'power' | 'ground' | 'communication';
}

interface SchematicLayer {
  id: string;
  name: string;
  color: string;
  visible: boolean;
}

interface SchematicData {
  title: string;
  description: string;
  viewBox: { width: number; height: number };
  layers: SchematicLayer[];
  components: SchematicComponent[];
  wires: SchematicWire[];
  legend: { symbol: string; label: string; color: string }[];
}

interface InteractiveSchematicProps {
  data: SchematicData;
  onComponentClick?: (component: SchematicComponent) => void;
  onWireClick?: (wire: SchematicWire) => void;
}

// Wire colors map
const wireColorMap: Record<string, string> = {
  'red': '#EF4444',
  'black': '#1F2937',
  'blue': '#3B82F6',
  'green': '#10B981',
  'yellow': '#F59E0B',
  'orange': '#F97316',
  'white': '#F9FAFB',
  'brown': '#92400E',
  'purple': '#8B5CF6',
  'pink': '#EC4899',
  'gray': '#6B7280',
};

// Component icons/shapes
const ComponentShape: React.FC<{
  component: SchematicComponent;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}> = ({ component, isHovered, isSelected, onClick, onHover }) => {
  const getShape = () => {
    switch (component.type) {
      case 'battery':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#4B5563'} strokeWidth={2} rx={4} />
            <rect x={component.size.width * 0.3} y={-4} width={component.size.width * 0.4} height={8}
              fill="#10B981" />
            <text x={component.size.width / 2} y={component.size.height / 2 + 5}
              textAnchor="middle" fill="white" fontSize={10}>BAT</text>
          </g>
        );

      case 'controller':
      case 'ecm':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1E3A5F" stroke={isHovered || isSelected ? '#F59E0B' : '#3B82F6'} strokeWidth={2} rx={6} />
            <rect x={4} y={4} width={component.size.width - 8} height={20}
              fill="#0EA5E9" rx={2} />
            <text x={component.size.width / 2} y={18}
              textAnchor="middle" fill="white" fontSize={9} fontWeight="bold">{component.name}</text>
            <text x={component.size.width / 2} y={component.size.height - 8}
              textAnchor="middle" fill="#94A3B8" fontSize={8}>{component.type.toUpperCase()}</text>
          </g>
        );

      case 'relay':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#374151" stroke={isHovered || isSelected ? '#F59E0B' : '#6B7280'} strokeWidth={2} rx={2} />
            <circle cx={component.size.width / 2} cy={component.size.height / 2}
              r={Math.min(component.size.width, component.size.height) / 3} fill="none" stroke="#9CA3AF" strokeWidth={1} />
            <text x={component.size.width / 2} y={component.size.height + 12}
              textAnchor="middle" fill="#D1D5DB" fontSize={8}>{component.name}</text>
          </g>
        );

      case 'solenoid':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#374151" stroke={isHovered || isSelected ? '#F59E0B' : '#F97316'} strokeWidth={2} rx={2} />
            <path d={`M ${component.size.width * 0.2} ${component.size.height * 0.3}
              Q ${component.size.width * 0.5} ${component.size.height * 0.5}, ${component.size.width * 0.8} ${component.size.height * 0.3}
              Q ${component.size.width * 0.5} ${component.size.height * 0.7}, ${component.size.width * 0.2} ${component.size.height * 0.7}`}
              fill="none" stroke="#F97316" strokeWidth={1.5} />
            <text x={component.size.width / 2} y={component.size.height + 12}
              textAnchor="middle" fill="#D1D5DB" fontSize={8}>{component.name}</text>
          </g>
        );

      case 'breaker':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#EF4444'} strokeWidth={2} rx={4} />
            <line x1={component.size.width * 0.2} y1={component.size.height * 0.3}
              x2={component.size.width * 0.5} y2={component.size.height * 0.5} stroke="#EF4444" strokeWidth={2} />
            <line x1={component.size.width * 0.5} y1={component.size.height * 0.5}
              x2={component.size.width * 0.8} y2={component.size.height * 0.7} stroke="#EF4444" strokeWidth={2} />
            <text x={component.size.width / 2} y={component.size.height + 12}
              textAnchor="middle" fill="#D1D5DB" fontSize={8}>{component.name}</text>
          </g>
        );

      case 'ct':
      case 'vt':
        return (
          <g>
            <circle cx={component.size.width / 2} cy={component.size.height / 2}
              r={Math.min(component.size.width, component.size.height) / 2 - 2}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#8B5CF6'} strokeWidth={2} />
            <circle cx={component.size.width / 2} cy={component.size.height / 2}
              r={Math.min(component.size.width, component.size.height) / 3}
              fill="none" stroke="#8B5CF6" strokeWidth={1} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 4}
              textAnchor="middle" fill="white" fontSize={10}>{component.type.toUpperCase()}</text>
          </g>
        );

      case 'generator':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#10B981'} strokeWidth={2} rx={4} />
            <circle cx={component.size.width / 2} cy={component.size.height / 2}
              r={Math.min(component.size.width, component.size.height) / 3} fill="none" stroke="#10B981" strokeWidth={2} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 4}
              textAnchor="middle" fill="white" fontSize={12}>G</text>
            <text x={component.size.width / 2} y={component.size.height + 12}
              textAnchor="middle" fill="#D1D5DB" fontSize={8}>{component.name}</text>
          </g>
        );

      case 'supply':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#EF4444'} strokeWidth={2} rx={4} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 5}
              textAnchor="middle" fill="white" fontSize={10}>AC/DC</text>
          </g>
        );

      case 'sensors':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#06B6D4'} strokeWidth={2} rx={4} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 5}
              textAnchor="middle" fill="white" fontSize={10}>SENSORS</text>
          </g>
        );

      case 'injectors':
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#1F2937" stroke={isHovered || isSelected ? '#F59E0B' : '#F59E0B'} strokeWidth={2} rx={4} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 5}
              textAnchor="middle" fill="white" fontSize={10}>INJ</text>
          </g>
        );

      default:
        return (
          <g>
            <rect x={0} y={0} width={component.size.width} height={component.size.height}
              fill="#374151" stroke={isHovered || isSelected ? '#F59E0B' : '#6B7280'} strokeWidth={2} rx={4} />
            <text x={component.size.width / 2} y={component.size.height / 2 + 5}
              textAnchor="middle" fill="white" fontSize={10}>{component.name}</text>
          </g>
        );
    }
  };

  return (
    <g
      transform={`translate(${component.position.x}, ${component.position.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'pointer' }}
    >
      {getShape()}
    </g>
  );
};

// Wire path component
const WirePath: React.FC<{
  wire: SchematicWire;
  isHovered: boolean;
  isSelected: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}> = ({ wire, isHovered, isSelected, onClick, onHover }) => {
  const color = wireColorMap[wire.color] || wire.color;
  const strokeWidth = isHovered || isSelected ? 4 : 2;

  // Build path
  let pathD = `M ${wire.from.x} ${wire.from.y}`;
  if (wire.waypoints && wire.waypoints.length > 0) {
    wire.waypoints.forEach(wp => {
      pathD += ` L ${wp.x} ${wp.y}`;
    });
  }
  pathD += ` L ${wire.to.x} ${wire.to.y}`;

  return (
    <g
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      style={{ cursor: 'pointer' }}
    >
      {/* Shadow/glow for selected/hovered */}
      {(isHovered || isSelected) && (
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeOpacity={0.3}
          strokeLinecap="round"
        />
      )}

      {/* Main wire */}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={wire.type === 'ground' ? '5,5' : undefined}
      />

      {/* Wire label */}
      {(isHovered || isSelected) && (
        <text
          x={(wire.from.x + wire.to.x) / 2}
          y={(wire.from.y + wire.to.y) / 2 - 8}
          textAnchor="middle"
          fill={color}
          fontSize={10}
          fontWeight="bold"
          style={{ pointerEvents: 'none' }}
        >
          {wire.label} ({wire.gauge})
        </text>
      )}

      {/* Terminal dots */}
      <circle cx={wire.from.x} cy={wire.from.y} r={4} fill={color} />
      <circle cx={wire.to.x} cy={wire.to.y} r={4} fill={color} />
    </g>
  );
};

// Main component
export default function InteractiveSchematic({
  data,
  onComponentClick,
  onWireClick
}: InteractiveSchematicProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [layers, setLayers] = useState<Record<string, boolean>>(
    Object.fromEntries(data.layers.map(l => [l.id, l.visible]))
  );
  const [hoveredComponent, setHoveredComponent] = useState<string | null>(null);
  const [hoveredWire, setHoveredWire] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [selectedWire, setSelectedWire] = useState<string | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<{ x: number; y: number; content: React.ReactNode } | null>(null);

  // Filter visible elements based on layers
  const visibleWires = useMemo(() =>
    data.wires.filter(w => layers[w.layer]),
    [data.wires, layers]
  );

  const visibleComponents = useMemo(() =>
    data.components.filter(c => layers[c.layer]),
    [data.components, layers]
  );

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleLayer = (layerId: string) => {
    setLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const handleComponentClick = (component: SchematicComponent) => {
    setSelectedComponent(component.id === selectedComponent ? null : component.id);
    setSelectedWire(null);
    onComponentClick?.(component);
  };

  const handleWireClick = (wire: SchematicWire) => {
    setSelectedWire(wire.id === selectedWire ? null : wire.id);
    setSelectedComponent(null);
    onWireClick?.(wire);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">{data.title}</h3>
          <p className="text-sm text-slate-400">{data.description}</p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-white font-medium w-16 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            title="Zoom In"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors ml-2"
            title="Reset View"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Layer controls */}
        <div className="w-48 p-4 border-r border-slate-700 bg-slate-800/50">
          <h4 className="text-sm font-semibold text-white mb-3">Layers</h4>
          <div className="space-y-2">
            {data.layers.map(layer => (
              <label key={layer.id} className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={layers[layer.id]}
                  onChange={() => toggleLayer(layer.id)}
                  className="w-4 h-4 rounded"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {layer.name}
                </span>
              </label>
            ))}
          </div>

          {/* Legend */}
          <h4 className="text-sm font-semibold text-white mt-6 mb-3">Legend</h4>
          <div className="space-y-2">
            {data.legend.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-lg" style={{ color: item.color }}>{item.symbol}</span>
                <span className="text-xs text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Schematic view */}
        <div className="flex-1 h-[600px] overflow-hidden relative">
          <svg
            width="100%"
            height="100%"
            viewBox={`${-pan.x / zoom} ${-pan.y / zoom} ${data.viewBox.width / zoom} ${data.viewBox.height / zoom}`}
            className="bg-slate-950"
          >
            {/* Grid pattern */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Wires layer */}
            <g>
              {visibleWires.map(wire => (
                <WirePath
                  key={wire.id}
                  wire={wire}
                  isHovered={hoveredWire === wire.id}
                  isSelected={selectedWire === wire.id}
                  onClick={() => handleWireClick(wire)}
                  onHover={hovered => setHoveredWire(hovered ? wire.id : null)}
                />
              ))}
            </g>

            {/* Components layer */}
            <g>
              {visibleComponents.map(component => (
                <ComponentShape
                  key={component.id}
                  component={component}
                  isHovered={hoveredComponent === component.id}
                  isSelected={selectedComponent === component.id}
                  onClick={() => handleComponentClick(component)}
                  onHover={hovered => setHoveredComponent(hovered ? component.id : null)}
                />
              ))}
            </g>
          </svg>

          {/* Info panel for selected item */}
          <AnimatePresence>
            {(selectedComponent || selectedWire) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-72 bg-slate-800 border border-slate-600 rounded-xl p-4 shadow-xl"
              >
                {selectedComponent && (
                  <>
                    {(() => {
                      const comp = data.components.find(c => c.id === selectedComponent);
                      if (!comp) return null;
                      return (
                        <>
                          <h4 className="text-white font-semibold">{comp.name}</h4>
                          <p className="text-slate-400 text-sm mt-1">{comp.type}</p>
                          {comp.description && (
                            <p className="text-slate-300 text-sm mt-2">{comp.description}</p>
                          )}
                          <div className="mt-3">
                            <p className="text-xs text-slate-500 mb-1">Terminals:</p>
                            <div className="flex flex-wrap gap-1">
                              {comp.terminals.map(t => (
                                <span key={t.id} className="px-2 py-1 bg-slate-700 rounded text-xs text-slate-300">
                                  {t.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                {selectedWire && (
                  <>
                    {(() => {
                      const wire = data.wires.find(w => w.id === selectedWire);
                      if (!wire) return null;
                      return (
                        <>
                          <h4 className="text-white font-semibold">{wire.label}</h4>
                          <div className="mt-2 space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Wire Color:</span>
                              <span className="text-white flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: wireColorMap[wire.color] || wire.color }} />
                                {wire.color}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Gauge:</span>
                              <span className="text-white">{wire.gauge}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Type:</span>
                              <span className="text-white capitalize">{wire.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">From:</span>
                              <span className="text-white">{wire.from.component} ({wire.from.pin})</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">To:</span>
                              <span className="text-white">{wire.to.component} ({wire.to.pin})</span>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                <button
                  onClick={() => {
                    setSelectedComponent(null);
                    setSelectedWire(null);
                  }}
                  className="mt-4 w-full py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-white transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
