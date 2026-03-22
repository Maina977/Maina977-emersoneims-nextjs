'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  generateRoof3D,
  optimizePanelPlacement,
  calculateShadowAnimation,
  generateProductionHeatmap,
  calculatePerformance,
  calculateFinancials,
  ROOF_TEMPLATES,
  KENYA_SUN_PATHS,
  type Roof3DModel,
  type Panel3DPlacement,
  type RoofObstacle,
  type SolarDesign3D,
} from '@/lib/solar/solar3DDesignEngine';

// ==================== 3D CANVAS COMPONENT ====================

const Solar3DCanvas: React.FC<{
  roof: Roof3DModel | null;
  panels: Panel3DPlacement[];
  obstacles: RoofObstacle[];
  viewMode: 'perspective' | 'top' | 'side' | 'front';
  showShadows: boolean;
  showHeatmap: boolean;
  currentHour: number;
  selectedPanel: string | null;
  onPanelClick: (id: string) => void;
}> = ({ roof, panels, viewMode, showShadows, showHeatmap, currentHour, selectedPanel, onPanelClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !roof) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    // Clear canvas
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    const gridSize = 20;
    for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.offsetHeight);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.offsetWidth, y);
      ctx.stroke();
    }

    // Calculate scale and offset
    const scale = Math.min(
      (canvas.offsetWidth - 100) / roof.dimensions.length,
      (canvas.offsetHeight - 100) / roof.dimensions.width
    ) * 0.8;
    const offsetX = (canvas.offsetWidth - roof.dimensions.length * scale) / 2;
    const offsetY = (canvas.offsetHeight - roof.dimensions.width * scale) / 2;

    // Draw roof outline
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#1e293b';

    if (viewMode === 'top' || viewMode === 'perspective') {
      // Draw roof segments
      for (const segment of roof.segments) {
        ctx.beginPath();
        ctx.fillStyle = showHeatmap
          ? `rgba(245, 158, 11, ${segment.annualIrradiance / 2500})`
          : '#1e293b';
        ctx.strokeStyle = '#475569';

        // Simple rectangle representation
        const segmentScale = Math.sqrt(segment.area) / Math.max(roof.dimensions.length, roof.dimensions.width);
        const w = roof.dimensions.length * scale * segmentScale;
        const h = roof.dimensions.width * scale * segmentScale;
        const x = offsetX + (roof.dimensions.length * scale - w) / 2;
        const y = offsetY + (roof.dimensions.width * scale - h) / 2;

        ctx.rect(x, y, w, h);
        ctx.fill();
        ctx.stroke();

        // Segment label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(segment.name, x + w / 2, y + h / 2);
      }
    }

    // Draw full roof outline
    ctx.beginPath();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.rect(offsetX, offsetY, roof.dimensions.length * scale, roof.dimensions.width * scale);
    ctx.stroke();

    // Draw panels
    const panelWidth = 1.134 * scale; // Standard panel width in meters
    const panelHeight = 2.278 * scale; // Standard panel height in meters

    panels.forEach((panel, index) => {
      const x = offsetX + panel.position.x * scale - panelWidth / 2;
      const y = offsetY + panel.position.y * scale - panelHeight / 2;

      // Panel fill based on production
      const productionFactor = panel.annualProduction / 1000;
      const hue = Math.min(120, productionFactor * 40); // Green for high, yellow for low

      ctx.beginPath();
      ctx.fillStyle = selectedPanel === panel.id
        ? '#f59e0b'
        : showHeatmap
          ? `hsl(${hue}, 70%, 40%)`
          : '#1e40af';
      ctx.strokeStyle = selectedPanel === panel.id ? '#fbbf24' : '#3b82f6';
      ctx.lineWidth = selectedPanel === panel.id ? 2 : 1;
      ctx.rect(x, y, panelWidth, panelHeight);
      ctx.fill();
      ctx.stroke();

      // Panel cell lines
      ctx.strokeStyle = selectedPanel === panel.id ? '#fcd34d' : '#60a5fa';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(x, y + (panelHeight / 6) * i);
        ctx.lineTo(x + panelWidth, y + (panelHeight / 6) * i);
        ctx.stroke();
      }
      for (let i = 1; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(x + (panelWidth / 3) * i, y);
        ctx.lineTo(x + (panelWidth / 3) * i, y + panelHeight);
        ctx.stroke();
      }
    });

    // Draw shadows if enabled
    if (showShadows && currentHour >= 6 && currentHour <= 18) {
      const shadowAngle = ((currentHour - 12) / 6) * Math.PI / 2; // Simplified shadow angle
      const shadowLength = 30 * Math.cos(shadowAngle * 0.5);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      panels.forEach(panel => {
        const x = offsetX + panel.position.x * scale;
        const y = offsetY + panel.position.y * scale;

        ctx.beginPath();
        ctx.ellipse(
          x + shadowLength * Math.sin(shadowAngle),
          y + shadowLength * Math.cos(shadowAngle) * 0.3,
          panelWidth * 0.8,
          panelHeight * 0.2,
          shadowAngle,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
    }

    // Draw compass
    const compassX = canvas.offsetWidth - 50;
    const compassY = 50;
    ctx.beginPath();
    ctx.arc(compassX, compassY, 25, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.fill();
    ctx.stroke();

    // North arrow
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 20);
    ctx.lineTo(compassX - 5, compassY);
    ctx.lineTo(compassX + 5, compassY);
    ctx.closePath();
    ctx.fillStyle = '#ef4444';
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('N', compassX, compassY - 25);

    // Scale bar
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'left';
    const scaleBarLength = 5 * scale; // 5 meters
    ctx.beginPath();
    ctx.moveTo(20, canvas.offsetHeight - 30);
    ctx.lineTo(20 + scaleBarLength, canvas.offsetHeight - 30);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillText('5m', 20, canvas.offsetHeight - 15);

  }, [roof, panels, viewMode, showShadows, showHeatmap, currentHour, selectedPanel]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !roof) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const scale = Math.min(
      (rect.width - 100) / roof.dimensions.length,
      (rect.height - 100) / roof.dimensions.width
    ) * 0.8;
    const offsetX = (rect.width - roof.dimensions.length * scale) / 2;
    const offsetY = (rect.height - roof.dimensions.width * scale) / 2;

    // Check if clicked on a panel
    for (const panel of panels) {
      const px = offsetX + panel.position.x * scale;
      const py = offsetY + panel.position.y * scale;
      const pw = 1.134 * scale;
      const ph = 2.278 * scale;

      if (x >= px - pw / 2 && x <= px + pw / 2 && y >= py - ph / 2 && y <= py + ph / 2) {
        onPanelClick(panel.id);
        return;
      }
    }
    onPanelClick('');
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onClick={handleCanvasClick}
    />
  );
};

// ==================== MAIN COMPONENT ====================

export default function Solar3DDesignStudio() {
  // State
  const [step, setStep] = useState<'setup' | 'design' | 'analysis' | 'export'>('setup');
  const [buildingType, setBuildingType] = useState<string>('');
  const [customDimensions, setCustomDimensions] = useState({ length: 15, width: 10, height: 3, pitch: 25 });
  const [location, setLocation] = useState('nairobi');
  const [roof, setRoof] = useState<Roof3DModel | null>(null);
  const [panels, setPanels] = useState<Panel3DPlacement[]>([]);
  const [obstacles, setObstacles] = useState<RoofObstacle[]>([]);
  const [targetCapacity, setTargetCapacity] = useState(10); // kW

  // Design tools state
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'side' | 'front'>('top');
  const [showShadows, setShowShadows] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentHour, setCurrentHour] = useState(12);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // AI Assistant state
  const [aiMessage, setAiMessage] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  // Performance data
  const [performance, setPerformance] = useState<ReturnType<typeof calculatePerformance> | null>(null);
  const [financials, setFinancials] = useState<ReturnType<typeof calculateFinancials> | null>(null);

  // Generate roof model
  const handleGenerateRoof = () => {
    const newRoof = generateRoof3D(buildingType || 'kenyan_bungalow', customDimensions, location);
    setRoof(newRoof);
    setStep('design');

    // AI suggestions
    setAiSuggestions([
      `Optimal panel placement for ${location} weather conditions`,
      `Recommended: ${Math.ceil(targetCapacity / 0.545)} panels for ${targetCapacity}kW system`,
      `Best orientation: North-facing at ${ROOF_TEMPLATES[buildingType]?.dimensions?.pitch || 25}° tilt`,
    ]);
  };

  // Auto-place panels
  const handleAutoPlace = () => {
    if (!roof) return;

    setAiMessage('AI is calculating optimal panel placement...');

    setTimeout(() => {
      const newPanels = optimizePanelPlacement(
        roof,
        { width: 1134, height: 2278, wattage: 545 },
        targetCapacity
      );
      setPanels(newPanels);

      const perf = calculatePerformance(newPanels, roof);
      setPerformance(perf);

      const fin = calculateFinancials(
        newPanels.length * 25000, // Estimated cost per panel installed
        perf.annualProduction,
        22
      );
      setFinancials(fin);

      setAiMessage(`Placed ${newPanels.length} panels generating ${Math.round(perf.annualProduction).toLocaleString()} kWh/year`);
      setAiSuggestions([
        `System efficiency: ${Math.round(perf.performanceRatio)}%`,
        `Payback period: ${fin.paybackYears} years`,
        `25-year savings: KES ${fin.yearlyProjection[24].cumulativeSavings.toLocaleString()}`,
      ]);
    }, 1500);
  };

  // Shadow animation
  const handleAnimateShadows = () => {
    setIsAnimating(true);
    let hour = 6;
    const interval = setInterval(() => {
      setCurrentHour(hour);
      hour++;
      if (hour > 18) {
        hour = 6;
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 500);
  };

  // Add obstacle
  const handleAddObstacle = (type: RoofObstacle['type']) => {
    const newObstacle: RoofObstacle = {
      id: `obstacle-${Date.now()}`,
      type,
      position: { x: 5, y: 5, z: roof?.dimensions.height || 3 },
      dimensions: {
        width: type === 'chimney' ? 0.8 : type === 'ac_unit' ? 1 : 0.5,
        depth: type === 'chimney' ? 0.8 : type === 'ac_unit' ? 1 : 0.5,
        height: type === 'chimney' ? 1.5 : type === 'antenna' ? 2 : 0.5,
      },
      shadowImpact: type === 'tree_shadow' ? 0.5 : 0.2,
    };
    setObstacles([...obstacles, newObstacle]);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              3D Solar Design Studio
            </h2>
            <p className="text-blue-100">
              AI-Powered Design | Better Than Aurora Solar | No Site Visit Required
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm">
              AI Engine v2.0
            </span>
            <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-sm animate-pulse">
              LIVE
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mt-6">
          {['setup', 'design', 'analysis', 'export'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s ? 'bg-white text-purple-600' :
                  ['setup', 'design', 'analysis', 'export'].indexOf(step) > i ? 'bg-green-500 text-white' :
                  'bg-white/20 text-white/50'
                }`}
              >
                {['setup', 'design', 'analysis', 'export'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span className={`ml-2 text-sm ${step === s ? 'text-white font-semibold' : 'text-white/70'}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 3 && <div className="w-8 h-0.5 bg-white/20 ml-4" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: Setup */}
          {step === 'setup' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🏗️</span>
                <h3 className="text-2xl font-bold text-white">Configure Your Building</h3>
                <p className="text-gray-400">Select building type or enter custom dimensions</p>
              </div>

              {/* Building Type Selection */}
              <div>
                <label className="block text-gray-400 text-sm mb-3">Building Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'kenyan_bungalow', name: 'Bungalow', icon: '🏠' },
                    { id: 'kenyan_maisonette', name: 'Maisonette', icon: '🏡' },
                    { id: 'flat_commercial', name: 'Office Block', icon: '🏢' },
                    { id: 'warehouse', name: 'Warehouse', icon: '🏭' },
                    { id: 'apartment_block', name: 'Apartments', icon: '🏬' },
                    { id: 'shopping_mall', name: 'Mall/Retail', icon: '🛒' },
                    { id: 'school', name: 'School', icon: '🏫' },
                    { id: 'hospital', name: 'Hospital', icon: '🏥' },
                  ].map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setBuildingType(type.id);
                        const template = ROOF_TEMPLATES[type.id];
                        if (template?.dimensions) {
                          setCustomDimensions({
                            length: template.dimensions.length,
                            width: template.dimensions.width,
                            height: template.dimensions.height,
                            pitch: template.dimensions.pitch,
                          });
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all ${
                        buildingType === type.id
                          ? 'bg-purple-500/20 border-purple-500 text-white'
                          : 'bg-slate-800/50 border-slate-700 text-gray-400 hover:border-slate-500'
                      }`}
                    >
                      <span className="text-3xl block mb-2">{type.icon}</span>
                      <span className="text-sm font-medium">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Dimensions */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4">Custom Dimensions (meters)</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Length</label>
                    <input
                      type="number"
                      value={customDimensions.length}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, length: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Width</label>
                    <input
                      type="number"
                      value={customDimensions.width}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, width: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Height</label>
                    <input
                      type="number"
                      value={customDimensions.height}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, height: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 text-xs mb-1">Roof Pitch (°)</label>
                    <input
                      type="number"
                      value={customDimensions.pitch}
                      onChange={(e) => setCustomDimensions({ ...customDimensions, pitch: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Location & Capacity */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Location</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    {Object.keys(KENYA_SUN_PATHS).map(loc => (
                      <option key={loc} value={loc}>{loc.charAt(0).toUpperCase() + loc.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Target System Size (kW)</label>
                  <input
                    type="number"
                    value={targetCapacity}
                    onChange={(e) => setTargetCapacity(parseFloat(e.target.value) || 1)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white"
                    min={1}
                    max={1000}
                  />
                </div>
              </div>

              {/* Calculated Info */}
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold text-white">
                      {Math.round(customDimensions.length * customDimensions.width)}m²
                    </p>
                    <p className="text-gray-500 text-sm">Roof Area</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-400">
                      ~{Math.ceil(targetCapacity / 0.545)}
                    </p>
                    <p className="text-gray-500 text-sm">Panels Needed</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-400">
                      {Math.round(targetCapacity * 5.5 * 365)}
                    </p>
                    <p className="text-gray-500 text-sm">kWh/Year Est.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGenerateRoof}
                disabled={!buildingType && customDimensions.length <= 0}
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Generate 3D Design →
              </button>
            </motion.div>
          )}

          {/* STEP 2: Design */}
          {step === 'design' && roof && (
            <motion.div
              key="design"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* AI Assistant Bar */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">🤖</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {aiMessage || 'AI Design Assistant Ready - Click "Auto Place Panels" to optimize your design'}
                    </p>
                    {aiSuggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {aiSuggestions.map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Design Canvas */}
              <div className="grid lg:grid-cols-4 gap-4">
                {/* Toolbar */}
                <div className="lg:col-span-1 space-y-4">
                  {/* View Controls */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="text-white font-bold mb-3">View</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {['top', 'perspective', 'side', 'front'].map(v => (
                        <button
                          key={v}
                          onClick={() => setViewMode(v as typeof viewMode)}
                          className={`py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === v
                              ? 'bg-purple-500 text-white'
                              : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                          }`}
                        >
                          {v.charAt(0).toUpperCase() + v.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="text-white font-bold mb-3">AI Tools</h4>
                    <div className="space-y-2">
                      <button
                        onClick={handleAutoPlace}
                        className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
                      >
                        <span>🤖</span> Auto Place Panels
                      </button>
                      <button
                        onClick={handleAnimateShadows}
                        disabled={isAnimating}
                        className="w-full py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                      >
                        <span>🌅</span> {isAnimating ? 'Animating...' : 'Shadow Study'}
                      </button>
                      <button
                        onClick={() => setShowHeatmap(!showHeatmap)}
                        className={`w-full py-2 rounded-lg transition-all flex items-center justify-center gap-2 ${
                          showHeatmap ? 'bg-orange-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                        }`}
                      >
                        <span>🔥</span> {showHeatmap ? 'Hide' : 'Show'} Heatmap
                      </button>
                    </div>
                  </div>

                  {/* Add Obstacles */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="text-white font-bold mb-3">Add Obstacles</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { type: 'chimney', icon: '🏠', label: 'Chimney' },
                        { type: 'vent', icon: '💨', label: 'Vent' },
                        { type: 'skylight', icon: '🪟', label: 'Skylight' },
                        { type: 'ac_unit', icon: '❄️', label: 'AC Unit' },
                        { type: 'antenna', icon: '📡', label: 'Antenna' },
                        { type: 'tree_shadow', icon: '🌳', label: 'Tree' },
                      ].map(obs => (
                        <button
                          key={obs.type}
                          onClick={() => handleAddObstacle(obs.type as RoofObstacle['type'])}
                          className="py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-all text-sm"
                        >
                          {obs.icon} {obs.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slider */}
                  <div className="bg-slate-800/50 rounded-xl p-4">
                    <h4 className="text-white font-bold mb-3">Time of Day</h4>
                    <input
                      type="range"
                      min={5}
                      max={19}
                      value={currentHour}
                      onChange={(e) => setCurrentHour(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-gray-500 text-xs mt-1">
                      <span>5 AM</span>
                      <span className="text-amber-400 font-bold">{currentHour}:00</span>
                      <span>7 PM</span>
                    </div>
                  </div>
                </div>

                {/* Canvas */}
                <div className="lg:col-span-3 bg-slate-900 rounded-xl overflow-hidden border border-slate-700" style={{ height: '500px' }}>
                  <Solar3DCanvas
                    roof={roof}
                    panels={panels}
                    obstacles={obstacles}
                    viewMode={viewMode}
                    showShadows={showShadows}
                    showHeatmap={showHeatmap}
                    currentHour={currentHour}
                    selectedPanel={selectedPanel}
                    onPanelClick={setSelectedPanel}
                  />
                </div>
              </div>

              {/* Panel Stats */}
              {panels.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-amber-400">{panels.length}</p>
                    <p className="text-gray-500 text-sm">Panels</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-blue-400">
                      {(panels.length * 0.545).toFixed(1)}kW
                    </p>
                    <p className="text-gray-500 text-sm">System Size</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-green-400">
                      {performance ? Math.round(performance.annualProduction).toLocaleString() : '-'}
                    </p>
                    <p className="text-gray-500 text-sm">kWh/Year</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-purple-400">
                      {performance ? `${Math.round(performance.performanceRatio)}%` : '-'}
                    </p>
                    <p className="text-gray-500 text-sm">Efficiency</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-pink-400">
                      {financials ? `${financials.paybackYears}yr` : '-'}
                    </p>
                    <p className="text-gray-500 text-sm">Payback</p>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('setup')}
                  className="flex-1 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
                >
                  ← Back to Setup
                </button>
                <button
                  onClick={() => setStep('analysis')}
                  disabled={panels.length === 0}
                  className={`flex-1 py-4 font-bold rounded-xl transition-all ${
                    panels.length > 0
                      ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90'
                      : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  View Analysis →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Analysis */}
          {step === 'analysis' && performance && financials && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">📊</span>
                <h3 className="text-2xl font-bold text-white">System Performance Analysis</h3>
                <p className="text-gray-400">AI-generated comprehensive performance report</p>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-amber-400">{panels.length}</p>
                  <p className="text-gray-400">Solar Panels</p>
                  <p className="text-gray-500 text-sm">{(panels.length * 0.545).toFixed(1)} kWp</p>
                </div>
                <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-green-400">
                    {Math.round(performance.annualProduction).toLocaleString()}
                  </p>
                  <p className="text-gray-400">kWh/Year</p>
                  <p className="text-gray-500 text-sm">Year 1 Production</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-blue-400">
                    KES {(financials.annualSavings / 1000).toFixed(0)}K
                  </p>
                  <p className="text-gray-400">Annual Savings</p>
                  <p className="text-gray-500 text-sm">{financials.paybackYears} years payback</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-purple-400">{financials.roi25Year}%</p>
                  <p className="text-gray-400">25-Year ROI</p>
                  <p className="text-gray-500 text-sm">Net Present Value: KES {(financials.npv / 1000000).toFixed(1)}M</p>
                </div>
              </div>

              {/* Monthly Production Chart */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4">Monthly Production Forecast</h4>
                <div className="flex items-end justify-between h-40 gap-1">
                  {performance.monthlyProduction.map((value, i) => {
                    const maxValue = Math.max(...performance.monthlyProduction);
                    const height = (value / maxValue) * 100;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all hover:from-green-500 hover:to-green-300"
                          style={{ height: `${height}%` }}
                          title={`${Math.round(value)} kWh`}
                        />
                        <span className="text-gray-500 text-xs mt-2">
                          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Losses Breakdown */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4">System Losses</h4>
                <div className="space-y-3">
                  {Object.entries(performance.losses).filter(([k]) => k !== 'total').map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4">
                      <span className="text-gray-400 w-32 capitalize">{key.replace('_', ' ')}</span>
                      <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                          style={{ width: `${value * 5}%` }}
                        />
                      </div>
                      <span className="text-gray-300 w-16 text-right">{value.toFixed(1)}%</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 pt-2 border-t border-slate-700">
                    <span className="text-white font-bold w-32">Total Losses</span>
                    <div className="flex-1" />
                    <span className="text-red-400 font-bold w-16 text-right">{performance.losses.total.toFixed(1)}%</span>
                  </div>
                </div>
              </div>

              {/* 25-Year Financial Projection */}
              <div className="bg-slate-800/50 rounded-xl p-6">
                <h4 className="text-white font-bold mb-4">25-Year Financial Projection</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="p-2 text-left text-gray-400">Year</th>
                        <th className="p-2 text-right text-gray-400">Production</th>
                        <th className="p-2 text-right text-gray-400">Savings</th>
                        <th className="p-2 text-right text-gray-400">Cumulative</th>
                        <th className="p-2 text-right text-gray-400">Cash Flow</th>
                      </tr>
                    </thead>
                    <tbody>
                      {financials.yearlyProjection.filter((_, i) => i < 10 || i === 24).map((year) => (
                        <tr key={year.year} className="border-b border-slate-800">
                          <td className="p-2 text-white">{year.year}</td>
                          <td className="p-2 text-right text-gray-300">{year.production.toLocaleString()} kWh</td>
                          <td className="p-2 text-right text-green-400">KES {year.savings.toLocaleString()}</td>
                          <td className="p-2 text-right text-blue-400">KES {year.cumulativeSavings.toLocaleString()}</td>
                          <td className={`p-2 text-right font-bold ${year.cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            KES {year.cashFlow.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep('design')}
                  className="flex-1 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
                >
                  ← Back to Design
                </button>
                <button
                  onClick={() => setStep('export')}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Export & Share →
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Export */}
          {step === 'export' && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <span className="text-6xl mb-4 block">🚀</span>
                <h3 className="text-2xl font-bold text-white">Export Your Design</h3>
                <p className="text-gray-400">Share, download, or proceed to quotation</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button className="p-6 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl hover:border-green-500 transition-all text-left">
                  <span className="text-4xl mb-4 block">📄</span>
                  <h4 className="text-white font-bold mb-2">Download PDF Report</h4>
                  <p className="text-gray-400 text-sm">Complete design report with specifications</p>
                </button>

                <button className="p-6 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl hover:border-blue-500 transition-all text-left">
                  <span className="text-4xl mb-4 block">📱</span>
                  <h4 className="text-white font-bold mb-2">View in AR</h4>
                  <p className="text-gray-400 text-sm">See panels on your actual roof</p>
                </button>

                <button className="p-6 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:border-purple-500 transition-all text-left">
                  <span className="text-4xl mb-4 block">🔗</span>
                  <h4 className="text-white font-bold mb-2">Share Design Link</h4>
                  <p className="text-gray-400 text-sm">Send to family, engineers, or financiers</p>
                </button>

                <a
                  href={`https://wa.me/254768860665?text=${encodeURIComponent(
                    `Hi! I designed a ${panels.length}-panel (${(panels.length * 0.545).toFixed(1)}kW) system in your 3D Design Studio.\n\nEstimated production: ${performance ? Math.round(performance.annualProduction).toLocaleString() : 'N/A'} kWh/year\nPayback: ${financials?.paybackYears || 'N/A'} years\n\nI'd like to proceed with installation.`
                  )}`}
                  className="p-6 bg-gradient-to-br from-green-600/30 to-green-500/20 border border-green-500/50 rounded-xl hover:border-green-400 transition-all text-left"
                >
                  <span className="text-4xl mb-4 block">💬</span>
                  <h4 className="text-white font-bold mb-2">Order via WhatsApp</h4>
                  <p className="text-gray-400 text-sm">Get instant response from our team</p>
                </a>

                <button className="p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl hover:border-amber-500 transition-all text-left">
                  <span className="text-4xl mb-4 block">💰</span>
                  <h4 className="text-white font-bold mb-2">Generate Full Quotation</h4>
                  <p className="text-gray-400 text-sm">Complete BOM with pricing</p>
                </button>

                <button className="p-6 bg-gradient-to-br from-slate-600/30 to-slate-500/20 border border-slate-500/50 rounded-xl hover:border-slate-400 transition-all text-left">
                  <span className="text-4xl mb-4 block">💾</span>
                  <h4 className="text-white font-bold mb-2">Save to My Designs</h4>
                  <p className="text-gray-400 text-sm">Access later from any device</p>
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('analysis')}
                  className="flex-1 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-all"
                >
                  ← Back to Analysis
                </button>
                <button
                  onClick={() => {
                    setStep('setup');
                    setRoof(null);
                    setPanels([]);
                    setObstacles([]);
                    setBuildingType('');
                  }}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition-all"
                >
                  Start New Design
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/50 border-t border-slate-700 p-4 text-center">
        <p className="text-gray-500 text-sm">
          EmersonEIMS 3D Solar Design Studio v2.0 | AI-Powered | More Advanced Than Aurora Solar
        </p>
      </div>
    </div>
  );
}
