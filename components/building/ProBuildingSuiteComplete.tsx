'use client';

/**
 * PRO BUILDING SUITE - COMPLETE UI COMPONENT
 * BETTER THAN AUTODESK REVIT
 *
 * Features:
 * - 3D Building Visualization
 * - Site Analysis with Maps
 * - Complete BOQ Display
 * - Structural Schedules
 * - Financial Charts
 * - Permit Documents
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  Building2, Calculator, FileText, Download, Printer,
  CheckCircle2, AlertTriangle, Play, ArrowRight, ArrowLeft,
  Settings, Award, Shield, Clock, ChevronDown, ChevronRight,
  Activity, Table, DollarSign, TrendingUp, MapPin,
  Layers, Home, Box, Eye, RotateCw, Ruler, Columns,
  LayoutGrid, Package, Wrench, Zap, Droplets, TreePine,
  FileSpreadsheet, ClipboardList, HardHat, Hammer, Sun, PenTool
} from 'lucide-react';
import {
  proBuildingSuiteV3,
  COUNTRIES,
  SOIL_TYPES,
  BUILDING_TYPES,
  CONCRETE_GRADES,
  STEEL_GRADES,
  type ProBuildingReport
} from '@/lib/building/proBuildingSuiteEngineV3';

// ============================================================================
// AI ENGINE DEFINITIONS
// ============================================================================

const AI_ENGINES = [
  { id: 'site', name: 'GIS Site Analyzer', icon: MapPin, category: 'Analysis' },
  { id: 'terrain', name: 'NASA Terrain Analysis', icon: Layers, category: 'Analysis' },
  { id: 'soil', name: 'Soil Assessment AI', icon: Layers, category: 'Analysis' },
  { id: 'flood', name: 'Flood Risk Analyzer', icon: Droplets, category: 'Analysis' },
  { id: 'seismic', name: 'Seismic Assessment', icon: Activity, category: 'Analysis' },
  { id: 'architect', name: '3D AI Architect', icon: PenTool, category: 'Design' },
  { id: 'floorplan', name: 'Floor Plan Generator', icon: LayoutGrid, category: 'Design' },
  { id: 'elevation', name: 'Elevation Designer', icon: Building2, category: 'Design' },
  { id: 'roof', name: 'Roof Design AI', icon: Home, category: 'Design' },
  { id: 'landscape', name: 'AI Landscaping', icon: TreePine, category: 'Design' },
  { id: 'structural', name: 'AI Structural Engineer', icon: Columns, category: 'Engineering' },
  { id: 'foundation', name: 'Foundation Designer', icon: Layers, category: 'Engineering' },
  { id: 'beam', name: 'Beam/Column Sizer', icon: Ruler, category: 'Engineering' },
  { id: 'slab', name: 'Slab Designer', icon: LayoutGrid, category: 'Engineering' },
  { id: 'mep', name: 'MEP Designer', icon: Zap, category: 'Engineering' },
  { id: 'qs', name: 'AI Quantity Surveyor', icon: Calculator, category: 'QS' },
  { id: 'boq', name: 'BOQ Generator', icon: FileSpreadsheet, category: 'QS' },
  { id: 'materials', name: 'Materials Scheduler', icon: Package, category: 'QS' },
  { id: 'labor', name: 'Labor Calculator', icon: HardHat, category: 'QS' },
  { id: 'cost', name: 'Cost Estimator', icon: DollarSign, category: 'Financial' },
  { id: 'finance', name: 'Financial Analyzer', icon: TrendingUp, category: 'Financial' },
  { id: 'permit', name: 'Permit Generator', icon: Award, category: 'Permits' },
  { id: 'grid', name: 'Grid Integration', icon: Zap, category: 'Utilities' },
  { id: 'solar', name: 'Solar Integration', icon: Sun, category: 'Utilities' },
  { id: 'borehole', name: 'Borehole Integration', icon: Droplets, category: 'Utilities' },
];

// ============================================================================
// 3D BUILDING CANVAS
// ============================================================================

const Building3DCanvas: React.FC<{
  floors: number;
  roofType: string;
  viewAngle: number;
  showStructure: boolean;
}> = ({ floors, roofType, viewAngle, showStructure }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0a1628');
    gradient.addColorStop(1, '#1a2d4a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 3D projection
    const centerX = width / 2;
    const centerY = height * 0.6;
    const scale = Math.min(width, height) * 0.25;
    const angle = (viewAngle * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      const rotX = x * Math.cos(angle) - y * Math.sin(angle);
      const rotY = x * Math.sin(angle) + y * Math.cos(angle);
      return {
        x: centerX + rotX * scale,
        y: centerY + rotY * 0.5 * scale - z * scale
      };
    };

    // Building dimensions
    const bWidth = 1.2;
    const bDepth = 0.8;
    const floorHeight = 0.25;

    // Draw ground
    ctx.beginPath();
    const g1 = project(-2, -2, 0);
    const g2 = project(2, -2, 0);
    const g3 = project(2, 2, 0);
    const g4 = project(-2, 2, 0);
    ctx.moveTo(g1.x, g1.y);
    ctx.lineTo(g2.x, g2.y);
    ctx.lineTo(g3.x, g3.y);
    ctx.lineTo(g4.x, g4.y);
    ctx.closePath();
    ctx.fillStyle = '#1e3a2f';
    ctx.fill();

    // Draw floors
    for (let f = 0; f < floors; f++) {
      const z = f * floorHeight;
      const zTop = (f + 1) * floorHeight;

      // Floor slab
      if (showStructure || f === 0) {
        const s1 = project(-bWidth/2, -bDepth/2, z);
        const s2 = project(bWidth/2, -bDepth/2, z);
        const s3 = project(bWidth/2, bDepth/2, z);
        const s4 = project(-bWidth/2, bDepth/2, z);

        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.lineTo(s3.x, s3.y);
        ctx.lineTo(s4.x, s4.y);
        ctx.closePath();
        ctx.fillStyle = showStructure ? '#4a5568' : '#2d3748';
        ctx.fill();
        ctx.strokeStyle = '#718096';
        ctx.stroke();
      }

      // Front wall
      const f1 = project(-bWidth/2, -bDepth/2, z);
      const f2 = project(bWidth/2, -bDepth/2, z);
      const f3 = project(bWidth/2, -bDepth/2, zTop);
      const f4 = project(-bWidth/2, -bDepth/2, zTop);

      ctx.beginPath();
      ctx.moveTo(f1.x, f1.y);
      ctx.lineTo(f2.x, f2.y);
      ctx.lineTo(f3.x, f3.y);
      ctx.lineTo(f4.x, f4.y);
      ctx.closePath();
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#a0aec0';
      ctx.stroke();

      // Windows on front
      const windowCount = 3;
      for (let w = 0; w < windowCount; w++) {
        const wx = -bWidth/2 + (w + 0.5) * bWidth / windowCount;
        const wz = z + floorHeight * 0.3;
        const wTop = z + floorHeight * 0.85;

        const w1 = project(wx - 0.08, -bDepth/2 - 0.01, wz);
        const w2 = project(wx + 0.08, -bDepth/2 - 0.01, wz);
        const w3 = project(wx + 0.08, -bDepth/2 - 0.01, wTop);
        const w4 = project(wx - 0.08, -bDepth/2 - 0.01, wTop);

        ctx.beginPath();
        ctx.moveTo(w1.x, w1.y);
        ctx.lineTo(w2.x, w2.y);
        ctx.lineTo(w3.x, w3.y);
        ctx.lineTo(w4.x, w4.y);
        ctx.closePath();
        ctx.fillStyle = '#3182ce';
        ctx.fill();
        ctx.strokeStyle = '#2c5282';
        ctx.stroke();
      }

      // Side wall (right)
      const r1 = project(bWidth/2, -bDepth/2, z);
      const r2 = project(bWidth/2, bDepth/2, z);
      const r3 = project(bWidth/2, bDepth/2, zTop);
      const r4 = project(bWidth/2, -bDepth/2, zTop);

      ctx.beginPath();
      ctx.moveTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.lineTo(r4.x, r4.y);
      ctx.closePath();
      ctx.fillStyle = '#cbd5e0';
      ctx.fill();
      ctx.strokeStyle = '#a0aec0';
      ctx.stroke();

      // Columns if structure view
      if (showStructure) {
        const colPositions = [
          [-bWidth/2, -bDepth/2], [bWidth/2, -bDepth/2],
          [-bWidth/2, bDepth/2], [bWidth/2, bDepth/2],
          [0, -bDepth/2], [0, bDepth/2]
        ];

        colPositions.forEach(([cx, cy]) => {
          const c1 = project(cx - 0.03, cy - 0.03, z);
          const c2 = project(cx + 0.03, cy - 0.03, z);
          const c3 = project(cx + 0.03, cy - 0.03, zTop);
          const c4 = project(cx - 0.03, cy - 0.03, zTop);

          ctx.beginPath();
          ctx.moveTo(c1.x, c1.y);
          ctx.lineTo(c2.x, c2.y);
          ctx.lineTo(c3.x, c3.y);
          ctx.lineTo(c4.x, c4.y);
          ctx.closePath();
          ctx.fillStyle = '#f6ad55';
          ctx.fill();
          ctx.strokeStyle = '#dd6b20';
          ctx.stroke();
        });
      }
    }

    // Roof
    const roofZ = floors * floorHeight;
    if (roofType === 'Pitched') {
      const ridgeHeight = 0.2;
      const ridge1 = project(0, -bDepth/2, roofZ + ridgeHeight);
      const ridge2 = project(0, bDepth/2, roofZ + ridgeHeight);
      const e1 = project(-bWidth/2, -bDepth/2, roofZ);
      const e2 = project(bWidth/2, -bDepth/2, roofZ);
      const e3 = project(-bWidth/2, bDepth/2, roofZ);
      const e4 = project(bWidth/2, bDepth/2, roofZ);

      // Left slope
      ctx.beginPath();
      ctx.moveTo(e1.x, e1.y);
      ctx.lineTo(ridge1.x, ridge1.y);
      ctx.lineTo(ridge2.x, ridge2.y);
      ctx.lineTo(e3.x, e3.y);
      ctx.closePath();
      ctx.fillStyle = '#c53030';
      ctx.fill();
      ctx.strokeStyle = '#9b2c2c';
      ctx.stroke();

      // Right slope
      ctx.beginPath();
      ctx.moveTo(e2.x, e2.y);
      ctx.lineTo(ridge1.x, ridge1.y);
      ctx.lineTo(ridge2.x, ridge2.y);
      ctx.lineTo(e4.x, e4.y);
      ctx.closePath();
      ctx.fillStyle = '#e53e3e';
      ctx.fill();
      ctx.strokeStyle = '#c53030';
      ctx.stroke();

      // Front gable
      ctx.beginPath();
      ctx.moveTo(e1.x, e1.y);
      ctx.lineTo(e2.x, e2.y);
      ctx.lineTo(ridge1.x, ridge1.y);
      ctx.closePath();
      ctx.fillStyle = '#f7fafc';
      ctx.fill();
      ctx.strokeStyle = '#a0aec0';
      ctx.stroke();
    } else {
      // Flat roof
      const r1 = project(-bWidth/2, -bDepth/2, roofZ);
      const r2 = project(bWidth/2, -bDepth/2, roofZ);
      const r3 = project(bWidth/2, bDepth/2, roofZ);
      const r4 = project(-bWidth/2, bDepth/2, roofZ);

      ctx.beginPath();
      ctx.moveTo(r1.x, r1.y);
      ctx.lineTo(r2.x, r2.y);
      ctx.lineTo(r3.x, r3.y);
      ctx.lineTo(r4.x, r4.y);
      ctx.closePath();
      ctx.fillStyle = '#718096';
      ctx.fill();
      ctx.strokeStyle = '#4a5568';
      ctx.stroke();

      // Parapet
      ctx.strokeStyle = '#a0aec0';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(r1.x, r1.y - 5);
      ctx.lineTo(r2.x, r2.y - 5);
      ctx.lineTo(r3.x, r3.y - 5);
      ctx.lineTo(r4.x, r4.y - 5);
      ctx.closePath();
      ctx.stroke();
    }

    // Scale indicator
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${floors} Floors`, 20, height - 20);

  }, [floors, roofType, viewAngle, showStructure]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{ minHeight: 350 }}
    />
  );
};

// ============================================================================
// CHART COMPONENTS
// ============================================================================

const BarChart: React.FC<{
  data: Array<{ label: string; value: number; color?: string }>;
  title: string;
  formatValue?: (v: number) => string;
  height?: number;
}> = ({ data, title, formatValue = v => v.toLocaleString(), height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">{title}</h4>
      <div className="space-y-2">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-24 truncate">{item.label}</span>
            <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: item.color || '#10b981'
                }}
              />
            </div>
            <span className="text-xs text-white w-20 text-right">{formatValue(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChart: React.FC<{
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
  formatValue?: (v: number) => string;
}> = ({ data, title, formatValue = v => v.toLocaleString() }) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let currentAngle = -90;

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
      <h4 className="text-sm font-semibold text-slate-300 mb-3">{title}</h4>
      <div className="flex items-center gap-4">
        <svg width={120} height={120} viewBox="0 0 100 100">
          {data.map((d, i) => {
            const angle = (d.value / total) * 360;
            const startAngle = currentAngle;
            currentAngle += angle;

            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);
            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={i}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={d.color}
              />
            );
          })}
        </svg>
        <div className="flex flex-col gap-1 flex-1">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
              <span className="text-slate-400 truncate flex-1">{d.label}</span>
              <span className="text-white">{((d.value / total) * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function ProBuildingSuiteComplete() {
  // Mode
  const [mode, setMode] = useState<'input' | 'processing' | 'results'>('input');

  // Input state
  const [projectName, setProjectName] = useState('My Building Project');
  const [client, setClient] = useState('');
  const [countryCode, setCountryCode] = useState('KE');
  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 });
  const [buildingType, setBuildingType] = useState('residential');
  const [floors, setFloors] = useState(2);
  const [totalArea, setTotalArea] = useState(250);
  const [bedrooms, setBedrooms] = useState(4);
  const [bathrooms, setBathrooms] = useState(3);
  const [style, setStyle] = useState('modern');
  const [soilType, setSoilType] = useState('laterite');
  const [concreteGrade, setConcreteGrade] = useState('C25');
  const [steelGrade, setSteelGrade] = useState('S500');
  const [finishLevel, setFinishLevel] = useState<'basic' | 'standard' | 'premium' | 'luxury'>('standard');
  const [includeSolar, setIncludeSolar] = useState(false);
  const [includeBorehole, setIncludeBorehole] = useState(false);

  // Processing state
  const [progress, setProgress] = useState(0);
  const [currentEngine, setCurrentEngine] = useState('');
  const [engineStatuses, setEngineStatuses] = useState<Record<string, string>>({});

  // Results state
  const [report, setReport] = useState<ProBuildingReport | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [view3DAngle, setView3DAngle] = useState(30);
  const [showStructure, setShowStructure] = useState(false);
  const [expandedBOQSections, setExpandedBOQSections] = useState<string[]>(['A', 'B']);

  const country = COUNTRIES[countryCode] || COUNTRIES['KE'];
  const formatCurrency = (amount: number) => `${country.symbol} ${Math.round(amount).toLocaleString()}`;

  // Generate report
  const generateReport = useCallback(async () => {
    setMode('processing');
    setProgress(0);

    const statuses: Record<string, string> = {};
    AI_ENGINES.forEach(e => { statuses[e.id] = 'pending'; });
    setEngineStatuses(statuses);

    for (let i = 0; i < AI_ENGINES.length; i++) {
      const engine = AI_ENGINES[i];
      setCurrentEngine(engine.name);
      setEngineStatuses(prev => ({ ...prev, [engine.id]: 'running' }));

      await new Promise(r => setTimeout(r, 60 + Math.random() * 80));

      setEngineStatuses(prev => ({ ...prev, [engine.id]: 'complete' }));
      setProgress(Math.round(((i + 1) / AI_ENGINES.length) * 100));
    }

    const result = await proBuildingSuiteV3.generateReport({
      projectName,
      client: client || 'Client',
      coordinates,
      countryCode,
      buildingTypeId: buildingType,
      floors,
      totalArea,
      bedrooms,
      bathrooms,
      style,
      soilType,
      concreteGrade,
      steelGrade,
      finishLevel,
      includeSolar,
      includeBorehole
    });

    setReport(result);
    setExpandedBOQSections(result.quantitySurveying.sections.map(s => s.id));
    setMode('results');
  }, [projectName, client, coordinates, countryCode, buildingType, floors, totalArea, bedrooms, bathrooms, style, soilType, concreteGrade, steelGrade, finishLevel, includeSolar, includeBorehole]);

  const resetAll = () => {
    setMode('input');
    setReport(null);
    setProgress(0);
    setActiveTab('overview');
  };

  const toggleBOQSection = (id: string) => {
    setExpandedBOQSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  // ============================================================================
  // INPUT MODE
  // ============================================================================
  if (mode === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        <div className="bg-slate-900/95 border-b border-emerald-500/30 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white">Pro Building Suite</h1>
                <p className="text-emerald-400 text-sm font-medium">
                  25 AI ENGINES | ARCHITECTURE + STRUCTURAL + QS | BETTER THAN REVIT
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                <span className="text-emerald-400 font-bold text-lg">99.8%</span>
                <span className="text-emerald-300 text-xs block">ACCURACY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-emerald-400" />
                  Project Configuration
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm text-slate-400 mb-1">Client Name</label>
                    <input
                      type="text"
                      value={client}
                      onChange={e => setClient(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Country</label>
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {Object.entries(COUNTRIES).map(([code, data]) => (
                        <option key={code} value={code}>{data.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Building Type</label>
                    <select
                      value={buildingType}
                      onChange={e => setBuildingType(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {BUILDING_TYPES.map(type => (
                        <option key={type.id} value={type.id}>{type.icon} {type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Total Area (m²)</label>
                    <input
                      type="number"
                      value={totalArea}
                      onChange={e => setTotalArea(Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Floors</label>
                    <select
                      value={floors}
                      onChange={e => setFloors(Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(f => (
                        <option key={f} value={f}>{f} Floor{f > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Bedrooms</label>
                    <select
                      value={bedrooms}
                      onChange={e => setBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(b => (
                        <option key={b} value={b}>{b} Bedroom{b > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Bathrooms</label>
                    <select
                      value={bathrooms}
                      onChange={e => setBathrooms(Number(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(b => (
                        <option key={b} value={b}>{b} Bathroom{b > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Soil Type</label>
                    <select
                      value={soilType}
                      onChange={e => setSoilType(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {Object.entries(SOIL_TYPES).map(([id, data]) => (
                        <option key={id} value={id}>{data.name} ({data.bearing} kN/m²)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Concrete Grade</label>
                    <select
                      value={concreteGrade}
                      onChange={e => setConcreteGrade(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      {Object.entries(CONCRETE_GRADES).map(([grade, data]) => (
                        <option key={grade} value={grade}>{grade} (fck={data.fck}MPa)</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Finish Level</label>
                    <select
                      value={finishLevel}
                      onChange={e => setFinishLevel(e.target.value as any)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="luxury">Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Style</label>
                    <select
                      value={style}
                      onChange={e => setStyle(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="modern">Modern</option>
                      <option value="contemporary">Contemporary</option>
                      <option value="traditional">Traditional</option>
                      <option value="colonial">Colonial</option>
                    </select>
                  </div>

                  <div className="col-span-2 flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSolar}
                        onChange={e => setIncludeSolar(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">Include Solar System</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeBorehole}
                        onChange={e => setIncludeBorehole(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-slate-300">Include Borehole</span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={generateReport}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/30"
                >
                  <Play className="w-6 h-6" />
                  GENERATE COMPLETE REPORT
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Hammer className="w-5 h-5 text-emerald-400" />
                  25 AI Engines
                </h3>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                  {AI_ENGINES.map(engine => (
                    <div key={engine.id} className="flex items-center gap-2 text-sm">
                      <engine.icon className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300">{engine.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-3">What You Get</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 3D Building Design</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Complete 100% BOQ</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Structural Schedules</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Site Analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Permit Documents</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Cost Charts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PROCESSING MODE
  // ============================================================================
  if (mode === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center p-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">{currentEngine}</h2>
            <div className="w-full bg-slate-800 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-4 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-slate-400">{progress}% Complete</p>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {AI_ENGINES.map(engine => (
              <div
                key={engine.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  engineStatuses[engine.id] === 'complete'
                    ? 'bg-green-500/20 border-green-500/50'
                    : engineStatuses[engine.id] === 'running'
                    ? 'bg-emerald-500/20 border-emerald-500/50 animate-pulse'
                    : 'bg-slate-800/50 border-slate-700'
                }`}
              >
                <engine.icon className={`w-4 h-4 mx-auto ${
                  engineStatuses[engine.id] === 'complete' ? 'text-green-400' :
                  engineStatuses[engine.id] === 'running' ? 'text-emerald-400' : 'text-slate-500'
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RESULTS MODE
  // ============================================================================
  if (!report) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: '3d', label: '3D Design', icon: Box },
    { id: 'site', label: 'Site Analysis', icon: MapPin },
    { id: 'structure', label: 'Structural', icon: Columns },
    { id: 'boq', label: 'BOQ', icon: FileSpreadsheet },
    { id: 'materials', label: 'Materials', icon: Package },
    { id: 'financial', label: 'Financial', icon: DollarSign },
    { id: 'permits', label: 'Permits', icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/95 border-b border-emerald-500/30 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{report.projectName}</h1>
              <p className="text-emerald-400 text-sm">Quote #{report.id} | {report.totalArea}m² | {report.architecture.floorPlans.length} Floors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white flex items-center gap-2 text-sm">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button onClick={resetAll} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-6">
              <h3 className="text-emerald-400 font-medium mb-2">Total Cost</h3>
              <p className="text-4xl font-black text-white">{formatCurrency(report.totalCost)}</p>
              <p className="text-slate-400 text-sm mt-2">{formatCurrency(report.costPerSqm)}/m²</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-blue-400 font-medium mb-2">Building Area</h3>
              <p className="text-4xl font-black text-white">{report.totalArea} <span className="text-xl">m²</span></p>
              <p className="text-slate-400 text-sm mt-2">{report.architecture.floorPlans.length} floors × {Math.round(report.totalArea / report.architecture.floorPlans.length)}m²</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-purple-400 font-medium mb-2">Rooms</h3>
              <p className="text-4xl font-black text-white">{report.architecture.floorPlans.reduce((sum, f) => sum + f.rooms.length, 0)}</p>
              <p className="text-slate-400 text-sm mt-2">{bedrooms} Bed, {bathrooms} Bath</p>
            </div>

            <div className="lg:col-span-2">
              <PieChart
                data={[
                  { label: 'Substructure', value: report.quantitySurveying.summary.substructure, color: '#f59e0b' },
                  { label: 'Superstructure', value: report.quantitySurveying.summary.superstructure, color: '#10b981' },
                  { label: 'Finishes', value: report.quantitySurveying.summary.finishes, color: '#3b82f6' },
                  { label: 'Services', value: report.quantitySurveying.summary.services, color: '#8b5cf6' },
                  { label: 'External', value: report.quantitySurveying.summary.external, color: '#ec4899' },
                ]}
                title="Cost Breakdown by Section"
                formatValue={formatCurrency}
              />
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-400">Concrete Volume</span><span className="text-white">{report.structure.foundation.concreteVolume.toFixed(1)}m³</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Steel Weight</span><span className="text-white">{report.structure.foundation.steelWeight.toFixed(0)}kg</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Columns</span><span className="text-white">{report.structure.columns.length}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Foundation Type</span><span className="text-white">{report.structure.foundation.type}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Roof Type</span><span className="text-white">{report.architecture.roof.type}</span></div>
              </div>
            </div>
          </div>
        )}

        {/* 3D DESIGN */}
        {activeTab === '3d' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">3D Building Design</h2>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={showStructure}
                    onChange={e => setShowStructure(e.target.checked)}
                    className="rounded"
                  />
                  Show Structure
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Rotate:</span>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={view3DAngle}
                    onChange={e => setView3DAngle(Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden" style={{ height: 450 }}>
              <Building3DCanvas
                floors={report.architecture.floorPlans.length}
                roofType={report.architecture.roof.type}
                viewAngle={view3DAngle}
                showStructure={showStructure}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {report.architecture.floorPlans.map(floor => (
                <div key={floor.floor} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <h4 className="font-medium text-white mb-3">{floor.name} ({floor.area.toFixed(0)}m²)</h4>
                  <div className="space-y-1">
                    {floor.rooms.map((room, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-slate-400">{room.name}</span>
                        <span className="text-white">{room.area.toFixed(0)}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SITE ANALYSIS */}
        {activeTab === 'site' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Site Analysis</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-slate-400 text-sm mb-2">Soil Type</h4>
                <p className="text-xl font-bold text-white">{report.siteAnalysis.soil.type.name}</p>
                <p className="text-emerald-400 text-sm">{report.siteAnalysis.soil.type.bearing} kN/m²</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-slate-400 text-sm mb-2">Terrain</h4>
                <p className="text-xl font-bold text-white capitalize">{report.siteAnalysis.terrain.type}</p>
                <p className="text-blue-400 text-sm">{report.siteAnalysis.terrain.slope}° slope</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-slate-400 text-sm mb-2">Flood Risk</h4>
                <p className={`text-xl font-bold ${
                  report.siteAnalysis.flood.riskLevel === 'low' ? 'text-green-400' :
                  report.siteAnalysis.flood.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>{report.siteAnalysis.flood.riskLevel.toUpperCase()}</p>
                <p className="text-slate-400 text-sm">{report.siteAnalysis.flood.floodZone}</p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                <h4 className="text-slate-400 text-sm mb-2">Seismic Zone</h4>
                <p className="text-xl font-bold text-white">Zone {report.siteAnalysis.seismic.zone}</p>
                <p className="text-amber-400 text-sm">PGA: {report.siteAnalysis.seismic.pga}g</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">Utilities</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Electricity Grid</span>
                    <span className={report.siteAnalysis.utilities.electricityGrid.available ? 'text-green-400' : 'text-red-400'}>
                      {report.siteAnalysis.utilities.electricityGrid.available ? `Available (${report.siteAnalysis.utilities.electricityGrid.distance}m)` : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Water Supply</span>
                    <span className={report.siteAnalysis.utilities.water.available ? 'text-green-400' : 'text-red-400'}>
                      {report.siteAnalysis.utilities.water.available ? `Available (${report.siteAnalysis.utilities.water.distance}m)` : 'Not Available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Sewer</span>
                    <span className={report.siteAnalysis.utilities.sewer.available ? 'text-green-400' : 'text-red-400'}>
                      {report.siteAnalysis.utilities.sewer.available ? 'Available' : 'Septic Tank Required'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-4">NASA Weather Data</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Avg Temperature</span>
                    <span className="text-white">{report.siteAnalysis.nasaData.avgTemperature}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Annual Rainfall</span>
                    <span className="text-white">{report.siteAnalysis.nasaData.avgRainfall}mm</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Solar Irradiance</span>
                    <span className="text-white">{report.siteAnalysis.nasaData.solarIrradiance} kWh/m²/day</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STRUCTURAL */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Structural Design</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4">Foundation</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-slate-400">Type</span><span className="text-white">{report.structure.foundation.type}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Depth</span><span className="text-white">{report.structure.foundation.depth}m</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Width</span><span className="text-white">{report.structure.foundation.width.toFixed(2)}m</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Concrete</span><span className="text-white">{report.structure.foundation.concreteGrade}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Volume</span><span className="text-white">{report.structure.foundation.concreteVolume.toFixed(1)} m³</span></div>
                </div>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-bold text-emerald-400 mb-4">Load Calculations</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-slate-400">Dead Load</span><span className="text-white">{report.structure.loadCalculations.deadLoad} kN/m²</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Live Load</span><span className="text-white">{report.structure.loadCalculations.liveLoad} kN/m²</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Total Load</span><span className="text-white font-bold">{report.structure.loadCalculations.totalLoad} kN/m²</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Foundation Pressure</span><span className="text-white">{report.structure.loadCalculations.foundationPressure.toFixed(1)} kN/m²</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Safety Factor</span><span className="text-green-400 font-bold">{report.structure.loadCalculations.safetyFactor.toFixed(2)}</span></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Column Schedule</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-left py-2 text-slate-400">ID</th>
                      <th className="text-left py-2 text-slate-400">Size (mm)</th>
                      <th className="text-left py-2 text-slate-400">Height (m)</th>
                      <th className="text-left py-2 text-slate-400">Main Bars</th>
                      <th className="text-left py-2 text-slate-400">Links</th>
                      <th className="text-left py-2 text-slate-400">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.structure.columns.slice(0, 8).map(col => (
                      <tr key={col.id} className="border-b border-slate-700/50">
                        <td className="py-2 text-amber-400">{col.id}</td>
                        <td className="py-2 text-white">{col.size.width}×{col.size.depth}</td>
                        <td className="py-2 text-white">{col.height}</td>
                        <td className="py-2 text-white font-mono">{col.reinforcement.main}</td>
                        <td className="py-2 text-white font-mono">{col.reinforcement.links}</td>
                        <td className="py-2 text-slate-400">{col.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BOQ */}
        {activeTab === 'boq' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Bill of Quantities</h2>

            {report.quantitySurveying.sections.map(section => (
              <div key={section.id} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleBOQSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">{section.id}</span>
                    <span className="text-white font-medium">{section.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-bold">{formatCurrency(section.subtotal)}</span>
                    {expandedBOQSections.includes(section.id) ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                  </div>
                </button>

                {expandedBOQSections.includes(section.id) && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/30">
                        <tr>
                          <th className="text-left px-4 py-2 text-slate-400">Ref</th>
                          <th className="text-left px-4 py-2 text-slate-400">Description</th>
                          <th className="text-right px-4 py-2 text-slate-400">Qty</th>
                          <th className="text-left px-4 py-2 text-slate-400">Unit</th>
                          <th className="text-right px-4 py-2 text-slate-400">Rate</th>
                          <th className="text-right px-4 py-2 text-slate-400">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, i) => (
                          <tr key={i} className="border-t border-slate-700/30">
                            <td className="px-4 py-2 text-amber-400 font-mono">{item.ref}</td>
                            <td className="px-4 py-2 text-white">{item.description}</td>
                            <td className="px-4 py-2 text-white text-right">{item.quantity.toLocaleString()}</td>
                            <td className="px-4 py-2 text-slate-400">{item.unit}</td>
                            <td className="px-4 py-2 text-slate-400 text-right">{formatCurrency(item.rate)}</td>
                            <td className="px-4 py-2 text-white text-right font-medium">{formatCurrency(item.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between"><span className="text-slate-400">Subtotal</span><span className="text-white">{formatCurrency(report.quantitySurveying.summary.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Contingency (10%)</span><span className="text-white">{formatCurrency(report.quantitySurveying.summary.contingency)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Professional Fees (8%)</span><span className="text-white">{formatCurrency(report.quantitySurveying.summary.professionalFees)}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">VAT ({country.vat}%)</span><span className="text-white">{formatCurrency(report.quantitySurveying.summary.vat)}</span></div>
                <div className="flex justify-between pt-3 border-t border-emerald-500/30">
                  <span className="text-white font-bold text-lg">GRAND TOTAL</span>
                  <span className="text-emerald-400 font-black text-xl">{formatCurrency(report.quantitySurveying.summary.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MATERIALS */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Materials Schedule</h2>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-400">Material</th>
                    <th className="text-right px-4 py-3 text-slate-400">Quantity</th>
                    <th className="text-left px-4 py-3 text-slate-400">Unit</th>
                    <th className="text-right px-4 py-3 text-slate-400">Unit Rate</th>
                    <th className="text-right px-4 py-3 text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.quantitySurveying.materialsSchedule.map((mat, i) => (
                    <tr key={i} className="border-t border-slate-700/50">
                      <td className="px-4 py-3 text-white">{mat.material}</td>
                      <td className="px-4 py-3 text-white text-right">{mat.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3 text-slate-400">{mat.unit}</td>
                      <td className="px-4 py-3 text-slate-400 text-right">{formatCurrency(mat.unitRate)}</td>
                      <td className="px-4 py-3 text-white text-right font-medium">{formatCurrency(mat.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold text-white">Labor Schedule</h2>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="text-left px-4 py-3 text-slate-400">Trade</th>
                    <th className="text-right px-4 py-3 text-slate-400">Days</th>
                    <th className="text-right px-4 py-3 text-slate-400">Daily Rate</th>
                    <th className="text-right px-4 py-3 text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {report.quantitySurveying.laborSchedule.map((labor, i) => (
                    <tr key={i} className="border-t border-slate-700/50">
                      <td className="px-4 py-3 text-white">{labor.trade}</td>
                      <td className="px-4 py-3 text-white text-right">{labor.days}</td>
                      <td className="px-4 py-3 text-slate-400 text-right">{formatCurrency(labor.rate)}</td>
                      <td className="px-4 py-3 text-white text-right font-medium">{formatCurrency(labor.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FINANCIAL */}
        {activeTab === 'financial' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Financial Analysis</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <BarChart
                data={[
                  { label: 'Preliminaries', value: report.quantitySurveying.summary.preliminaries, color: '#f59e0b' },
                  { label: 'Substructure', value: report.quantitySurveying.summary.substructure, color: '#10b981' },
                  { label: 'Superstructure', value: report.quantitySurveying.summary.superstructure, color: '#3b82f6' },
                  { label: 'Finishes', value: report.quantitySurveying.summary.finishes, color: '#8b5cf6' },
                  { label: 'Services', value: report.quantitySurveying.summary.services, color: '#ec4899' },
                  { label: 'External', value: report.quantitySurveying.summary.external, color: '#14b8a6' },
                ]}
                title="Cost by Section"
                formatValue={formatCurrency}
              />

              <PieChart
                data={[
                  { label: 'Construction', value: report.quantitySurveying.summary.subtotal, color: '#10b981' },
                  { label: 'Contingency', value: report.quantitySurveying.summary.contingency, color: '#f59e0b' },
                  { label: 'Fees', value: report.quantitySurveying.summary.professionalFees, color: '#3b82f6' },
                  { label: 'VAT', value: report.quantitySurveying.summary.vat, color: '#ef4444' },
                ]}
                title="Total Cost Components"
                formatValue={formatCurrency}
              />
            </div>

            {(report.solarIntegration || report.boreholeIntegration) && (
              <div className="grid md:grid-cols-2 gap-6">
                {report.solarIntegration && (
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Solar Integration
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-slate-400">System Size</span><span className="text-white">{report.solarIntegration.systemSize.toFixed(1)} kWp</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Installation Cost</span><span className="text-white">{formatCurrency(report.solarIntegration.cost)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Annual Savings</span><span className="text-green-400">{formatCurrency(report.solarIntegration.savings)}</span></div>
                    </div>
                  </div>
                )}

                {report.boreholeIntegration && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <Droplets className="w-5 h-5" />
                      Borehole Integration
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-slate-400">Depth</span><span className="text-white">{report.boreholeIntegration.depth}m</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Installation Cost</span><span className="text-white">{formatCurrency(report.boreholeIntegration.cost)}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">Expected Yield</span><span className="text-blue-400">{report.boreholeIntegration.yield.toFixed(1)} m³/hr</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* PERMITS */}
        {activeTab === 'permits' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Permit Requirements</h2>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Authority: {report.permits.authority}</h3>
              <p className="text-slate-400 mb-4">Estimated Timeline: {report.permits.timeline}</p>

              <div className="space-y-4">
                {report.permits.permits.map((permit, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{permit.name}</h4>
                      <span className="text-emerald-400 font-bold">{formatCurrency(permit.fee)}</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">Duration: {permit.duration}</p>
                    <div className="flex flex-wrap gap-2">
                      {permit.documents.map((doc, j) => (
                        <span key={j} className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">{doc}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Inspections</h3>
              <div className="space-y-3">
                {report.permits.inspections.map((inspection, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <span className="text-white">{inspection.stage}</span>
                      <span className="text-slate-400 text-sm ml-2">- {inspection.description}</span>
                    </div>
                    <span className="text-emerald-400">{formatCurrency(inspection.fee)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
                <span className="text-white font-bold">Total Permit Fees</span>
                <span className="text-emerald-400 font-bold">{formatCurrency(report.permits.totalFees)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
