'use client';

import React, { useState, useCallback } from 'react';
import {
  GLOBAL_COUNTRIES_DB,
  BUILDING_MATERIALS_DB,
  BUILDING_TYPES_DB,
  BuildMasterProEngine,
  AISiteAnalyzer,
  AIQuantitySurveyor,
  type BOQReport,
  type SiteAnalysis,
  type DesignPlan,
  type FinancialAnalysis,
  type PermitRequirement
} from '@/lib/building/buildMasterProEngine';

// Module Types
type ModuleId =
  | 'overview' | 'site-analyzer' | 'ai-designer' | 'boq-generator' | 'material-db'
  | 'financial' | 'permits' | 'solar-integration' | 'borehole-integration' | 'comparison'
  | '3d-viewer' | 'landscaping' | 'timeline' | 'reports' | 'settings';

interface ModuleConfig {
  id: ModuleId;
  name: string;
  icon: string;
  description: string;
}

const MODULES: ModuleConfig[] = [
  { id: 'overview', name: 'Dashboard', icon: '🏠', description: 'Project overview and quick actions' },
  { id: 'site-analyzer', name: 'AI Site Analyzer', icon: '🛰️', description: 'NASA + Google Earth site analysis' },
  { id: 'ai-designer', name: '3D AI Designer', icon: '🏗️', description: 'AI-powered architectural design' },
  { id: 'boq-generator', name: 'AI Quantity Surveyor', icon: '📋', description: '100% accurate BOQ generation' },
  { id: 'material-db', name: 'Materials Database', icon: '🧱', description: 'Global materials with real-time pricing' },
  { id: 'financial', name: 'Financial Genius', icon: '💰', description: 'ROI, financing, and cost analysis' },
  { id: 'permits', name: 'AI Permits', icon: '📜', description: 'Automated permit requirements' },
  { id: 'solar-integration', name: 'Solar Integration', icon: '☀️', description: 'Solar system sizing and costing' },
  { id: 'borehole-integration', name: 'Borehole Option', icon: '💧', description: 'Water solution integration' },
  { id: 'comparison', name: 'Site Comparison', icon: '⚖️', description: 'Compare multiple sites' },
  { id: '3d-viewer', name: '3D Viewer', icon: '🔮', description: 'Interactive 3D visualization' },
  { id: 'landscaping', name: 'AI Landscaping', icon: '🌳', description: 'Landscape design and costing' },
  { id: 'timeline', name: 'Project Timeline', icon: '📅', description: 'Construction schedule' },
  { id: 'reports', name: 'Reports', icon: '📊', description: 'Professional PDF reports' },
  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'Project configuration' },
];

const BuildMasterProHub: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [countryCode, setCountryCode] = useState('KE');
  const [buildingType, setBuildingType] = useState('Bungalow');
  const [totalArea, setTotalArea] = useState(150);
  const [floors, setFloors] = useState(1);
  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 });
  const [siteAnalysis, setSiteAnalysis] = useState<SiteAnalysis | null>(null);
  const [boqReport, setBOQReport] = useState<BOQReport | null>(null);
  const [financial, setFinancial] = useState<FinancialAnalysis | null>(null);
  const [permits, setPermits] = useState<PermitRequirement[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [specifications, setSpecifications] = useState({
    roofType: 'tiles',
    wallType: 'blocks',
    floorType: 'tiles',
    windowType: 'aluminum',
    finishLevel: 'standard',
    style: 'Modern',
    requirements: ['eco-friendly']
  });
  const [includeSolar, setIncludeSolar] = useState(true);
  const [includeBorehole, setIncludeBorehole] = useState(true);

  // Get country info
  const country = GLOBAL_COUNTRIES_DB[countryCode] || GLOBAL_COUNTRIES_DB['KE'];

  // Format currency
  const formatCurrency = (amount: number): string => {
    return `${country.symbol} ${amount.toLocaleString()}`;
  };

  // Run full analysis
  const runFullAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const engine = new BuildMasterProEngine();
      const report = await engine.generateComprehensiveReport(
        coordinates,
        buildingType,
        totalArea,
        floors,
        countryCode,
        specifications,
        { includeSolar, includeBorehole }
      );

      setSiteAnalysis(report.siteAnalysis);
      setBOQReport(report.boq);
      setFinancial(report.financial);
      setPermits(report.permits);
    } catch (error) {
      console.error('Analysis error:', error);
    }
    setIsAnalyzing(false);
  }, [coordinates, buildingType, totalArea, floors, countryCode, specifications, includeSolar, includeBorehole]);

  // Navigation
  const renderNavigation = () => (
    <div className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🏗️</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">BuildMaster Pro™</h1>
              <p className="text-emerald-400 text-xs">Universal AI Construction Ecosystem</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm"
            >
              {Object.entries(GLOBAL_COUNTRIES_DB).map(([code, data]) => (
                <option key={code} value={code}>{data.name}</option>
              ))}
            </select>

            <button
              onClick={runFullAnalysis}
              disabled={isAnalyzing}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : '🚀 Generate Report'}
            </button>
          </div>
        </div>

        {/* Module Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {MODULES.map((module) => (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
                activeModule === module.id
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <span className="mr-1">{module.icon}</span>
              {module.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Overview Module
  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'AI Engines', value: '15+', icon: '🤖', color: 'emerald' },
          { label: 'Countries', value: '195+', icon: '🌍', color: 'blue' },
          { label: 'Materials', value: '500+', icon: '🧱', color: 'orange' },
          { label: 'Building Types', value: '20+', icon: '🏢', color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 border border-${stat.color}-500/30 rounded-xl p-4 text-center`}>
            <span className="text-3xl">{stat.icon}</span>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Project Setup */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">🚀 Quick Project Setup</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Building Type</label>
            <select
              value={buildingType}
              onChange={(e) => setBuildingType(e.target.value)}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            >
              {BUILDING_TYPES_DB.map(type => (
                <option key={type.id} value={type.name}>{type.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Total Area (sqm)</label>
            <input
              type="number"
              value={totalArea}
              onChange={(e) => setTotalArea(Number(e.target.value))}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Number of Floors</label>
            <select
              value={floors}
              onChange={(e) => setFloors(Number(e.target.value))}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            >
              {[1, 2, 3, 4, 5].map(f => (
                <option key={f} value={f}>{f} Floor{f > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">GPS Coordinates</label>
            <input
              type="text"
              value={`${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`}
              onChange={(e) => {
                const parts = e.target.value.split(',').map(p => parseFloat(p.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                  setCoordinates({ lat: parts[0], lng: parts[1] });
                }
              }}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
              placeholder="-1.2921, 36.8219"
            />
          </div>
        </div>

        {/* Specifications */}
        <div className="grid md:grid-cols-5 gap-4 mt-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Roof Type</label>
            <select
              value={specifications.roofType}
              onChange={(e) => setSpecifications({...specifications, roofType: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="tiles">Roof Tiles</option>
              <option value="iron">Iron Sheets</option>
              <option value="flat">Flat Concrete</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Wall Type</label>
            <select
              value={specifications.wallType}
              onChange={(e) => setSpecifications({...specifications, wallType: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="blocks">Concrete Blocks</option>
              <option value="brick">Clay Bricks</option>
              <option value="stone">Natural Stone</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Floor Type</label>
            <select
              value={specifications.floorType}
              onChange={(e) => setSpecifications({...specifications, floorType: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="tiles">Ceramic Tiles</option>
              <option value="terrazzo">Terrazzo</option>
              <option value="hardwood">Hardwood</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Windows</label>
            <select
              value={specifications.windowType}
              onChange={(e) => setSpecifications({...specifications, windowType: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="aluminum">Aluminum</option>
              <option value="steel">Steel</option>
              <option value="upvc">UPVC</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Design Style</label>
            <select
              value={specifications.style}
              onChange={(e) => setSpecifications({...specifications, style: e.target.value})}
              className="w-full p-2 bg-slate-900 border border-slate-600 rounded-lg text-white text-sm"
            >
              <option value="Modern">Modern</option>
              <option value="Contemporary">Contemporary</option>
              <option value="Colonial">Colonial</option>
              <option value="Mediterranean">Mediterranean</option>
            </select>
          </div>
        </div>

        {/* Integration Options */}
        <div className="flex gap-6 mt-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSolar}
              onChange={(e) => setIncludeSolar(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white">☀️ Include Solar System</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeBorehole}
              onChange={(e) => setIncludeBorehole(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-white">💧 Include Borehole</span>
          </label>
        </div>

        <button
          onClick={runFullAnalysis}
          disabled={isAnalyzing}
          className="mt-6 w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg text-lg disabled:opacity-50"
        >
          {isAnalyzing ? '🔄 Running 15+ AI Engines...' : '🚀 Generate Complete Analysis'}
        </button>
      </div>

      {/* Results Summary */}
      {boqReport && financial && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Total Project Cost</h3>
            <p className="text-3xl font-bold text-emerald-400">{formatCurrency(financial.totalProjectCost)}</p>
            <p className="text-gray-500 text-sm mt-1">{formatCurrency(boqReport.costPerSqm)}/sqm</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Estimated Value</h3>
            <p className="text-3xl font-bold text-blue-400">{formatCurrency(financial.roi.estimatedValue)}</p>
            <p className="text-gray-500 text-sm mt-1">+{financial.roi.appreciation}% appreciation/year</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/30 rounded-xl p-6">
            <h3 className="text-gray-400 text-sm mb-2">Monthly Rental Income</h3>
            <p className="text-3xl font-bold text-purple-400">{formatCurrency(financial.roi.rentalIncome)}</p>
            <p className="text-gray-500 text-sm mt-1">{financial.roi.paybackPeriod} years payback</p>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { title: 'AI Site Analysis', desc: 'NASA + Google Earth terrain, soil, flood risk analysis', icon: '🛰️' },
          { title: '100% BOQ Accuracy', desc: 'Every material, fitting, and accessory calculated', icon: '📋' },
          { title: 'Real-Time Pricing', desc: 'Country-specific material costs in local currency', icon: '💰' },
          { title: '3D AI Design', desc: 'Futuristic architectural designs with room layouts', icon: '🏠' },
          { title: 'Solar Integration', desc: 'System sizing, costing, and ROI analysis', icon: '☀️' },
          { title: 'Borehole Option', desc: 'Water solution with depth and cost estimates', icon: '💧' },
          { title: 'Auto Permits', desc: 'All required permits with costs and timelines', icon: '📜' },
          { title: 'Financial Genius', desc: 'Financing, ROI, and payback calculations', icon: '📈' },
          { title: 'Site Comparison', desc: 'Compare multiple locations side-by-side', icon: '⚖️' },
        ].map((feature, i) => (
          <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
            <span className="text-3xl">{feature.icon}</span>
            <h4 className="text-white font-bold mt-2">{feature.title}</h4>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  // Site Analyzer Module
  const renderSiteAnalyzer = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🛰️ AI Site Analyzer</h2>
        <p className="text-gray-400">NASA + Google Earth powered site analysis</p>
      </div>

      {/* Image Upload */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">📸 Upload Site Images</h3>
        <div className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => e.target.files && setUploadedImages(Array.from(e.target.files))}
            className="hidden"
            id="site-images"
          />
          <label htmlFor="site-images" className="cursor-pointer">
            <span className="text-5xl">📷</span>
            <p className="text-white font-bold mt-4">Drop images/videos or click to upload</p>
            <p className="text-gray-500 text-sm">AI will extract GPS coordinates and analyze terrain</p>
          </label>
        </div>
        {uploadedImages.length > 0 && (
          <div className="mt-4 flex gap-2 flex-wrap">
            {uploadedImages.map((file, i) => (
              <div key={i} className="bg-slate-700 px-3 py-1 rounded text-white text-sm">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Analysis Results */}
      {siteAnalysis && (
        <div className="space-y-6">
          {/* Location Verification */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">✅</span>
              <div>
                <h3 className="text-xl font-bold text-white">Location Verified</h3>
                <p className="text-emerald-400">{siteAnalysis.verificationSource}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Coordinates</p>
                <p className="text-white font-mono">{siteAnalysis.coordinates.lat.toFixed(6)}, {siteAnalysis.coordinates.lng.toFixed(6)}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Elevation</p>
                <p className="text-white font-mono">{siteAnalysis.terrain.elevation}m above sea level</p>
              </div>
            </div>
          </div>

          {/* Confidence Metrics */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Confidence Metrics</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Geological', value: siteAnalysis.confidence.geological },
                { label: 'Terrain', value: siteAnalysis.confidence.terrain },
                { label: 'Infrastructure', value: siteAnalysis.confidence.infrastructure },
                { label: 'Overall', value: siteAnalysis.confidence.overall },
              ].map((metric, i) => (
                <div key={i} className="text-center">
                  <div className="relative w-20 h-20 mx-auto">
                    <svg className="transform -rotate-90 w-20 h-20">
                      <circle cx="40" cy="40" r="35" stroke="#1e293b" strokeWidth="6" fill="none" />
                      <circle
                        cx="40" cy="40" r="35"
                        stroke={metric.value >= 80 ? '#10b981' : metric.value >= 60 ? '#f59e0b' : '#ef4444'}
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={`${metric.value * 2.2} 220`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold">{metric.value}%</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Terrain Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🏔️ Terrain Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-white">{siteAnalysis.terrain.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Slope</span><span className="text-white">{siteAnalysis.terrain.slope}°</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Accessibility</span><span className="text-white">{siteAnalysis.terrain.accessibility}</span></div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🪨 Soil Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="text-white">{siteAnalysis.soil.type}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Bearing Capacity</span><span className="text-white">{siteAnalysis.soil.bearingCapacity} kN/m²</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Water Table</span><span className="text-white">{siteAnalysis.soil.waterTable}m depth</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Excavation</span><span className="text-white">{siteAnalysis.soil.excavationDifficulty}</span></div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Treatment Required</span>
                  <span className={siteAnalysis.soil.treatmentRequired ? 'text-amber-400' : 'text-green-400'}>
                    {siteAnalysis.soil.treatmentRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subsurface Visualization */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">📐 Subsurface Layers</h3>
            <div className="relative h-64 bg-gradient-to-b from-amber-900/30 via-slate-700/30 to-blue-900/30 rounded-xl overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1/4 border-b border-amber-500/50 flex items-center px-4">
                <span className="bg-amber-500/20 text-amber-300 px-3 py-1 rounded text-sm">0-{Math.round(siteAnalysis.soil.waterTable * 0.4)}m: Topsoil / Weathered Zone</span>
              </div>
              <div className="absolute inset-x-0 top-1/4 h-1/3 border-b border-slate-500/50 flex items-center px-4">
                <span className="bg-slate-500/20 text-slate-300 px-3 py-1 rounded text-sm">{Math.round(siteAnalysis.soil.waterTable * 0.4)}-{Math.round(siteAnalysis.soil.waterTable * 0.8)}m: {siteAnalysis.soil.type} Layer</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-5/12 flex items-center px-4">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded text-sm">{Math.round(siteAnalysis.soil.waterTable * 0.8)}m+: Bedrock / Foundation Layer</span>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">⚠️ Risk Assessment</h3>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className={`p-4 rounded-lg ${siteAnalysis.environment.floodRisk === 'Low' ? 'bg-green-500/20 border border-green-500/30' : siteAnalysis.environment.floodRisk === 'Moderate' ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
                <p className="text-gray-400 text-sm">Flood Risk</p>
                <p className="text-white font-bold">{siteAnalysis.environment.floodRisk}</p>
              </div>
              <div className="bg-slate-700/50 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Seismic Zone</p>
                <p className="text-white font-bold">{siteAnalysis.environment.seismicZone}</p>
              </div>
              <div className={`p-4 rounded-lg ${siteAnalysis.risks.overall === 'Low' ? 'bg-green-500/20 border border-green-500/30' : 'bg-amber-500/20 border border-amber-500/30'}`}>
                <p className="text-gray-400 text-sm">Overall Risk</p>
                <p className="text-white font-bold">{siteAnalysis.risks.overall}</p>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 text-sm">Mitigations Recommended:</p>
              {siteAnalysis.risks.mitigations.map((m, i) => (
                <div key={i} className="flex items-center gap-2 text-white">
                  <span className="text-green-400">✓</span> {m}
                </div>
              ))}
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">🔌 Infrastructure Assessment</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <span className="text-3xl">⚡</span>
                <p className="text-white font-bold mt-2">{siteAnalysis.infrastructure.gridDistance} km</p>
                <p className="text-gray-400 text-sm">To Power Grid</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <span className="text-3xl">💧</span>
                <p className="text-white font-bold mt-2">{siteAnalysis.infrastructure.waterSupply}</p>
                <p className="text-gray-400 text-sm">Water Supply</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <span className="text-3xl">🛣️</span>
                <p className="text-white font-bold mt-2">{siteAnalysis.infrastructure.roadAccess}</p>
                <p className="text-gray-400 text-sm">Road Access</p>
              </div>
              <div className="text-center p-4 bg-slate-700/50 rounded-lg">
                <span className="text-3xl">🚰</span>
                <p className="text-white font-bold mt-2">{siteAnalysis.infrastructure.sewerConnection ? 'Available' : 'Septic Required'}</p>
                <p className="text-gray-400 text-sm">Sewer</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!siteAnalysis && (
        <div className="text-center py-12">
          <span className="text-6xl">🛰️</span>
          <p className="text-white font-bold mt-4">Enter coordinates or upload images to analyze</p>
          <button onClick={runFullAnalysis} className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg">
            Run Site Analysis
          </button>
        </div>
      )}
    </div>
  );

  // BOQ Generator Module
  const renderBOQGenerator = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">📋 AI Quantity Surveyor</h2>
        <p className="text-gray-400">100% accurate Bill of Quantities with real-time pricing</p>
      </div>

      {boqReport ? (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm">Total Materials</p>
              <p className="text-2xl font-bold text-emerald-400">{formatCurrency(Object.values(boqReport.subtotals).reduce((a, b) => a + b, 0))}</p>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm">Labor Cost</p>
              <p className="text-2xl font-bold text-blue-400">{formatCurrency(boqReport.laborCost)}</p>
            </div>
            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm">Contingency (10%)</p>
              <p className="text-2xl font-bold text-amber-400">{formatCurrency(boqReport.contingency)}</p>
            </div>
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm">Grand Total</p>
              <p className="text-2xl font-bold text-purple-400">{formatCurrency(boqReport.totalCost)}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">Category Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(boqReport.subtotals).map(([category, total]) => (
                <div key={category} className="flex items-center gap-4">
                  <span className="text-gray-400 w-32">{category}</span>
                  <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full"
                      style={{ width: `${(total / boqReport.totalCost) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-mono w-32 text-right">{formatCurrency(total)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed BOQ Table */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">Detailed Bill of Quantities</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-900">
                  <tr>
                    <th className="text-left p-3 text-gray-400 text-sm">Item</th>
                    <th className="text-left p-3 text-gray-400 text-sm">Description</th>
                    <th className="text-center p-3 text-gray-400 text-sm">Unit</th>
                    <th className="text-center p-3 text-gray-400 text-sm">Qty</th>
                    <th className="text-right p-3 text-gray-400 text-sm">Rate</th>
                    <th className="text-right p-3 text-gray-400 text-sm">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {boqReport.items.map((item, i) => (
                    <tr key={item.id} className={i % 2 === 0 ? 'bg-slate-800/30' : ''}>
                      <td className="p-3 text-gray-500 text-sm">{item.id}</td>
                      <td className="p-3 text-white text-sm">{item.description}</td>
                      <td className="p-3 text-center text-gray-400 text-sm">{item.unit}</td>
                      <td className="p-3 text-center text-white text-sm">{item.quantity.toLocaleString()}</td>
                      <td className="p-3 text-right text-gray-400 text-sm">{formatCurrency(item.unitRate)}</td>
                      <td className="p-3 text-right text-emerald-400 font-mono text-sm">{formatCurrency(item.totalCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl">📋</span>
          <p className="text-white font-bold mt-4">Configure project settings and run analysis</p>
          <button onClick={runFullAnalysis} className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg">
            Generate BOQ
          </button>
        </div>
      )}
    </div>
  );

  // Materials Database Module
  const renderMaterialsDB = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🧱 Global Materials Database</h2>
        <p className="text-gray-400">500+ materials with real-time pricing in 195+ countries</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {['Cement', 'Steel', 'Blocks', 'Timber', 'Roofing', 'Tiles', 'Electrical', 'Plumbing'].map(category => {
          const materials = BUILDING_MATERIALS_DB.filter(m => m.category === category);
          return (
            <div key={category} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h3 className="text-white font-bold mb-3">{category}</h3>
              <div className="space-y-2">
                {materials.slice(0, 3).map(mat => (
                  <div key={mat.id} className="flex justify-between text-sm">
                    <span className="text-gray-400 truncate flex-1">{mat.name}</span>
                    <span className="text-emerald-400 ml-2">{formatCurrency(mat.prices[countryCode] || mat.prices['KE'])}</span>
                  </div>
                ))}
                {materials.length > 3 && (
                  <p className="text-gray-500 text-xs">+{materials.length - 3} more...</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Materials List */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">All Materials</h3>
          <span className="text-gray-400 text-sm">{BUILDING_MATERIALS_DB.length} items</span>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {BUILDING_MATERIALS_DB.map(mat => (
            <div key={mat.id} className="flex items-center justify-between p-3 border-b border-slate-700/50 hover:bg-slate-700/30">
              <div>
                <p className="text-white text-sm">{mat.name}</p>
                <p className="text-gray-500 text-xs">{mat.category} / {mat.subcategory}</p>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-mono">{formatCurrency(mat.prices[countryCode] || mat.prices['KE'])}</p>
                <p className="text-gray-500 text-xs">per {mat.unit}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Financial Module
  const renderFinancial = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">💰 Financial Genius</h2>
        <p className="text-gray-400">Complete financial analysis, ROI, and financing options</p>
      </div>

      {financial ? (
        <div className="space-y-6">
          {/* Cost Breakdown */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Cost Breakdown</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(financial.breakdown).map(([key, value]) => (
                <div key={key} className="bg-slate-700/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm capitalize">{key}</p>
                  <p className="text-white text-xl font-bold">{formatCurrency(value)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
              <span className="text-white font-bold text-xl">Total Project Cost</span>
              <span className="text-emerald-400 font-bold text-2xl">{formatCurrency(financial.totalProjectCost)}</span>
            </div>
          </div>

          {/* ROI Analysis */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">📈 ROI Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Estimated Property Value</span>
                  <span className="text-white font-bold">{formatCurrency(financial.roi.estimatedValue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Annual Appreciation</span>
                  <span className="text-emerald-400 font-bold">{financial.roi.appreciation}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Rental Income</span>
                  <span className="text-white font-bold">{formatCurrency(financial.roi.rentalIncome)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payback Period</span>
                  <span className="text-blue-400 font-bold">{financial.roi.paybackPeriod} years</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">🏦 Financing Options</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Down Payment (20%)</span>
                  <span className="text-white font-bold">{formatCurrency(financial.financing.downPayment)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Loan Amount (80%)</span>
                  <span className="text-white font-bold">{formatCurrency(financial.financing.loanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Interest Rate</span>
                  <span className="text-amber-400 font-bold">{financial.financing.interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Payment</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(financial.financing.monthlyPayment)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid vs Solar Comparison */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">⚡ Power Options Comparison</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">🔌</span>
                  <h4 className="text-white font-bold">National Grid Connection</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">Distance</span><span className="text-white">{financial.gridConnection.distance} km</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Connection Cost</span><span className="text-amber-400">{formatCurrency(financial.gridConnection.cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Timeline</span><span className="text-white">{financial.gridConnection.timeline}</span></div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">☀️</span>
                  <h4 className="text-white font-bold">Solar System</h4>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-gray-400">System Size</span><span className="text-white">{financial.solarOption.systemSize} kWp</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Installation Cost</span><span className="text-amber-400">{formatCurrency(financial.solarOption.cost)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Monthly Savings</span><span className="text-emerald-400">{formatCurrency(financial.solarOption.monthlySavings)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Payback</span><span className="text-white">{financial.solarOption.payback} months</span></div>
                </div>
              </div>
            </div>
          </div>

          {/* Borehole Option */}
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">💧</span>
              <h4 className="text-xl font-bold text-white">Borehole Water Option</h4>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Estimated Depth</p>
                <p className="text-white text-2xl font-bold">{financial.boreholeOption.estimatedDepth}m</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Drilling Cost</p>
                <p className="text-blue-400 text-2xl font-bold">{formatCurrency(financial.boreholeOption.cost)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Monthly Savings</p>
                <p className="text-emerald-400 text-2xl font-bold">{formatCurrency(financial.boreholeOption.monthlySavings)}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-sm">Payback Period</p>
                <p className="text-white text-2xl font-bold">{financial.boreholeOption.payback} months</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl">💰</span>
          <p className="text-white font-bold mt-4">Run analysis to see financial breakdown</p>
          <button onClick={runFullAnalysis} className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg">
            Generate Financial Analysis
          </button>
        </div>
      )}
    </div>
  );

  // Permits Module
  const renderPermits = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">📜 AI Permit Generator</h2>
        <p className="text-gray-400">All required permits, costs, and timelines</p>
      </div>

      {permits.length > 0 ? (
        <div className="space-y-4">
          {permits.map((permit, i) => (
            <div key={i} className={`border rounded-xl p-6 ${
              permit.status === 'required' ? 'bg-slate-800/50 border-slate-700' :
              permit.status === 'recommended' ? 'bg-amber-500/10 border-amber-500/30' :
              'bg-slate-800/30 border-slate-700/50'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{permit.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      permit.status === 'required' ? 'bg-red-500/20 text-red-400' :
                      permit.status === 'recommended' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>
                      {permit.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{permit.authority}</p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-400 font-bold">{formatCurrency(permit.estimatedCost)}</p>
                  <p className="text-gray-500 text-sm">{permit.timeline}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm mb-2">Required Documents:</p>
                <div className="flex flex-wrap gap-2">
                  {permit.documents.map((doc, j) => (
                    <span key={j} className="px-2 py-1 bg-slate-700 rounded text-white text-sm">{doc}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6 flex justify-between items-center">
            <span className="text-white font-bold text-xl">Total Permit Costs</span>
            <span className="text-emerald-400 font-bold text-2xl">
              {formatCurrency(permits.reduce((sum, p) => sum + p.estimatedCost, 0))}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl">📜</span>
          <p className="text-white font-bold mt-4">Run analysis to see required permits</p>
          <button onClick={runFullAnalysis} className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg">
            Generate Permits List
          </button>
        </div>
      )}
    </div>
  );

  // Site Comparison Module
  const renderComparison = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">⚖️ Site Comparison Tool</h2>
        <p className="text-gray-400">Compare multiple sites side-by-side</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {['Site A', 'Site B', 'Site C'].map((site, i) => (
          <div key={i} className={`border rounded-xl p-6 ${i === 1 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">{site}</h3>
              {i === 1 && <span className="px-2 py-1 bg-emerald-500 text-white text-xs rounded">RECOMMENDED</span>}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="text-gray-400">Success Rate</span><span className="text-white">{85 + i * 3}%</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Soil Quality</span><span className="text-white">{['Good', 'Excellent', 'Good'][i]}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Flood Risk</span><span className="text-white">{['Low', 'Very Low', 'Moderate'][i]}</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Grid Distance</span><span className="text-white">{[2.5, 0.8, 3.2][i]} km</span></div>
              <div className="flex justify-between"><span className="text-gray-400">Est. Cost</span><span className="text-emerald-400">{formatCurrency([8500000, 7800000, 9200000][i])}</span></div>
            </div>
            <button className="w-full mt-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600">
              Analyze This Site
            </button>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center">
        <p className="text-emerald-400 text-lg font-bold">
          "Site B is recommended due to excellent soil quality, lowest flood risk, and closest grid proximity"
        </p>
      </div>
    </div>
  );

  // Placeholder for other modules
  const renderPlaceholder = (title: string, icon: string) => (
    <div className="text-center py-20">
      <span className="text-6xl">{icon}</span>
      <h2 className="text-2xl font-bold text-white mt-4">{title}</h2>
      <p className="text-gray-400 mt-2">Coming soon - Run full analysis to populate data</p>
      <button onClick={runFullAnalysis} className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-lg">
        Run Analysis
      </button>
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {renderNavigation()}

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeModule === 'overview' && renderOverview()}
        {activeModule === 'site-analyzer' && renderSiteAnalyzer()}
        {activeModule === 'ai-designer' && renderPlaceholder('3D AI Designer', '🏗️')}
        {activeModule === 'boq-generator' && renderBOQGenerator()}
        {activeModule === 'material-db' && renderMaterialsDB()}
        {activeModule === 'financial' && renderFinancial()}
        {activeModule === 'permits' && renderPermits()}
        {activeModule === 'solar-integration' && renderPlaceholder('Solar Integration', '☀️')}
        {activeModule === 'borehole-integration' && renderPlaceholder('Borehole Integration', '💧')}
        {activeModule === 'comparison' && renderComparison()}
        {activeModule === '3d-viewer' && renderPlaceholder('3D Viewer', '🔮')}
        {activeModule === 'landscaping' && renderPlaceholder('AI Landscaping', '🌳')}
        {activeModule === 'timeline' && renderPlaceholder('Project Timeline', '📅')}
        {activeModule === 'reports' && renderPlaceholder('Professional Reports', '📊')}
        {activeModule === 'settings' && renderPlaceholder('Settings', '⚙️')}
      </div>
    </div>
  );
};

export default BuildMasterProHub;
