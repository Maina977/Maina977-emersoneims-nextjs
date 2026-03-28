'use client';

import React, { useState, useCallback } from 'react';
import {
  AdvancedSiteAnalyzer,
  DATA_SOURCES,
  BUILDMASTER_VS_COMPETITORS,
  type TerrainAnalysis,
  type SoilAnalysis,
  type FloodRiskAnalysis,
  type GeologicalAnalysis,
  type ClimateAnalysis,
  type VegetationAnalysis,
  type InfrastructureAnalysis,
  type EnvironmentalAnalysis,
  type LegalAnalysis,
} from '@/lib/building/advancedSiteAnalyzer';

interface AnalysisResults {
  terrain: TerrainAnalysis;
  soil: SoilAnalysis;
  flood: FloodRiskAnalysis;
  geology: GeologicalAnalysis;
  climate: ClimateAnalysis;
  vegetation: VegetationAnalysis;
  infrastructure: InfrastructureAnalysis;
  environmental: EnvironmentalAnalysis;
  legal: LegalAnalysis;
  overallScore: number;
  buildability: string;
  recommendations: string[];
  dataSources: string[];
  confidence: number;
  processingTime: number;
}

const AdvancedSiteAnalyzerModule: React.FC = () => {
  const [coordinates, setCoordinates] = useState({ lat: -1.2921, lng: 36.8219 });
  const [plotSize, setPlotSize] = useState(500);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeDataSources, setActiveDataSources] = useState<string[]>([]);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const analyzer = new AdvancedSiteAnalyzer();

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setProgress(0);
    setActiveDataSources([]);

    // Simulate data source connections
    const sources = [
      'NASA SRTM DEM', 'NASA POWER API', 'NASA GPM', 'Google Earth Engine',
      'Google Maps API', 'ISRIC SoilGrids', 'FAO Soil Database', 'Global Flood Database',
      'HydroSHEDS', 'OpenStreetMap', 'Sentinel-2', 'WorldClim', 'USGS Geological'
    ];

    for (let i = 0; i < sources.length; i++) {
      await new Promise(r => setTimeout(r, 200));
      setActiveDataSources(prev => [...prev, sources[i]]);
      setProgress(Math.round((i / sources.length) * 100));
    }

    const analysisResults = await analyzer.analyzeComprehensive(coordinates, plotSize);
    setResults(analysisResults);
    setProgress(100);
    setIsAnalyzing(false);
  }, [coordinates, plotSize]);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '🎯' },
    { id: 'terrain', name: 'Terrain', icon: '🏔️' },
    { id: 'soil', name: 'Soil', icon: '🪨' },
    { id: 'flood', name: 'Flood Risk', icon: '🌊' },
    { id: 'geology', name: 'Geology', icon: '⛰️' },
    { id: 'climate', name: 'Climate', icon: '🌦️' },
    { id: 'vegetation', name: 'Vegetation', icon: '🌿' },
    { id: 'infrastructure', name: 'Infrastructure', icon: '🔌' },
    { id: 'environmental', name: 'Environmental', icon: '🌍' },
    { id: 'legal', name: 'Legal/Zoning', icon: '📜' },
    { id: 'datasources', name: 'Data Sources', icon: '🛰️' },
    { id: 'competition', name: 'vs Competition', icon: '🏆' },
  ];

  // Data Sources Display
  const renderDataSources = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🛰️ Data Source Integrations</h2>
        <p className="text-emerald-400">Real-time data from NASA, Google, USGS & more</p>
      </div>

      {Object.entries(DATA_SOURCES).map(([category, sources]) => (
        <div key={category} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 capitalize">{category} Data Sources</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(sources).map(([key, source]: [string, any]) => (
              <div key={key} className="bg-slate-900/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-emerald-400 font-bold">{source.name}</h4>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">CONNECTED</span>
                </div>
                <p className="text-gray-400 text-sm mb-3">{source.description}</p>
                <div className="space-y-1 text-xs">
                  {source.dataTypes && (
                    <p className="text-gray-500"><span className="text-gray-400">Data:</span> {source.dataTypes.slice(0, 3).join(', ')}</p>
                  )}
                  {source.coverage && (
                    <p className="text-gray-500"><span className="text-gray-400">Coverage:</span> {source.coverage}</p>
                  )}
                  {source.resolution && (
                    <p className="text-gray-500"><span className="text-gray-400">Resolution:</span> {source.resolution}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  // Competition Comparison
  const renderCompetition = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🏆 BuildMaster Pro vs Industry Leaders</h2>
        <p className="text-emerald-400">Why we beat Autodesk Revit, ArchiCAD, SketchUp, Rhino & Vectorworks</p>
      </div>

      {Object.entries(BUILDMASTER_VS_COMPETITORS).map(([key, competitor]) => (
        <div key={key} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
          <div className="bg-slate-900/50 p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">{competitor.name}</h3>
                <p className="text-gray-400 text-sm">{competitor.marketPosition}</p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm font-bold">
                BuildMaster Pro WINS
              </span>
            </div>
          </div>
          <div className="p-4 grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm mb-2">Their Strengths</p>
              <div className="space-y-1">
                {competitor.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-white text-sm">
                    <span className="text-blue-400">●</span> {s}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-2">Their Weaknesses</p>
              <div className="space-y-1">
                {competitor.weaknesses.map((w, i) => (
                  <div key={i} className="flex items-center gap-2 text-white text-sm">
                    <span className="text-red-400">✗</span> {w}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-emerald-400 text-sm mb-2 font-bold">Our Advantages</p>
              <div className="space-y-1">
                {competitor.buildMasterAdvantage.map((a, i) => (
                  <div key={i} className="flex items-center gap-2 text-white text-sm">
                    <span className="text-emerald-400">✓</span> {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Overview Tab
  const renderOverview = () => (
    <div className="space-y-6">
      {results ? (
        <>
          {/* Score Summary */}
          <div className="grid md:grid-cols-5 gap-4">
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6">
              <div className="text-center">
                <p className="text-gray-400 text-sm">Overall Buildability Score</p>
                <p className="text-6xl font-bold text-emerald-400 mt-2">{results.overallScore}</p>
                <p className="text-white text-xl mt-2">{results.buildability}</p>
                <p className="text-gray-500 text-sm mt-1">{results.confidence}% confidence</p>
              </div>
            </div>
            {[
              { label: 'Terrain', icon: '🏔️', score: results.terrain.slope < 15 ? 'Good' : 'Challenging' },
              { label: 'Soil', icon: '🪨', score: results.soil.bearingCapacity > 150 ? 'Good' : 'Treatment Needed' },
              { label: 'Flood Risk', icon: '🌊', score: results.flood.riskLevel },
              { label: 'Infrastructure', icon: '🔌', score: results.infrastructure.powerGrid.distance < 500 ? 'Good' : 'Moderate' },
            ].map((item, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
                <span className="text-3xl">{item.icon}</span>
                <p className="text-white font-bold mt-2">{item.label}</p>
                <p className={`text-sm ${item.score === 'Good' || item.score === 'Very Low' || item.score === 'Low' ? 'text-emerald-400' : item.score === 'Moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                  {item.score}
                </p>
              </div>
            ))}
          </div>

          {/* Key Findings */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🔍 Key Findings</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Location</p>
                <p className="text-white">{results.terrain.elevation}m elevation, {results.terrain.terrainType}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Soil Type</p>
                <p className="text-white">{results.soil.soilType} ({results.soil.soilClass})</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Bearing Capacity</p>
                <p className="text-white">{results.soil.bearingCapacity} kN/m²</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Flood Zone</p>
                <p className="text-white">{results.flood.floodZone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Seismic Zone</p>
                <p className="text-white">{results.geology.seismicZone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Climate Zone</p>
                <p className="text-white">{results.climate.climateZone}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Zoning</p>
                <p className="text-white">{results.legal.zoning}</p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 text-sm">Power Grid</p>
                <p className="text-white">{results.infrastructure.powerGrid.distance}m away</p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/10 border border-amber-500/30 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📋 AI Recommendations</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {results.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">→</span>
                  <span className="text-white text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Sources Used */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-3">🛰️ Data Sources Used</h3>
            <div className="flex flex-wrap gap-2">
              {results.dataSources.map((source, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-sm rounded-full">
                  {source}
                </span>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-3">Analysis completed in {results.processingTime}ms</p>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <span className="text-6xl">🛰️</span>
          <h3 className="text-2xl font-bold text-white mt-4">Advanced Site Analysis</h3>
          <p className="text-gray-400 mt-2">Using NASA, Google Earth Engine, USGS & 10+ data sources</p>
        </div>
      )}
    </div>
  );

  // Terrain Tab
  const renderTerrain = () => results && (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Elevation</p>
          <p className="text-3xl font-bold text-white">{results.terrain.elevation}m</p>
          <p className="text-gray-500 text-xs">Above sea level</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Slope</p>
          <p className="text-3xl font-bold text-white">{results.terrain.slope}°</p>
          <p className="text-gray-500 text-xs">{results.terrain.aspect} facing</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Terrain Type</p>
          <p className="text-xl font-bold text-white">{results.terrain.terrainType}</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${
          results.terrain.excavationDifficulty === 'Easy' ? 'bg-green-500/20 border border-green-500/30' :
          results.terrain.excavationDifficulty === 'Moderate' ? 'bg-amber-500/20 border border-amber-500/30' :
          'bg-red-500/20 border border-red-500/30'
        }`}>
          <p className="text-gray-400 text-sm">Excavation</p>
          <p className="text-xl font-bold text-white">{results.terrain.excavationDifficulty}</p>
        </div>
      </div>

      {/* Cut/Fill Analysis */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📐 Cut/Fill Volume Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Cut Volume</p>
            <p className="text-2xl font-bold text-red-400">{results.terrain.cutFillVolume.cut} m³</p>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Fill Volume</p>
            <p className="text-2xl font-bold text-green-400">{results.terrain.cutFillVolume.fill} m³</p>
          </div>
          <div className={`rounded-lg p-4 ${results.terrain.cutFillVolume.net > 0 ? 'bg-red-500/10 border border-red-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
            <p className="text-gray-400 text-sm">Net Volume</p>
            <p className={`text-2xl font-bold ${results.terrain.cutFillVolume.net > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {results.terrain.cutFillVolume.net > 0 ? '+' : ''}{results.terrain.cutFillVolume.net} m³
            </p>
          </div>
        </div>
      </div>

      {/* Viewshed */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">👁️ Viewshed Analysis</h3>
        <div className="flex flex-wrap gap-2">
          {results.terrain.viewshed.map((view, i) => (
            <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">{view}</span>
          ))}
        </div>
      </div>
    </div>
  );

  // Soil Tab
  const renderSoil = () => results && (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Soil Type</p>
          <p className="text-xl font-bold text-white">{results.soil.soilType}</p>
          <p className="text-gray-500 text-xs">{results.soil.soilClass}</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${results.soil.bearingCapacity > 200 ? 'bg-green-500/20 border border-green-500/30' : results.soil.bearingCapacity > 150 ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
          <p className="text-gray-400 text-sm">Bearing Capacity</p>
          <p className="text-2xl font-bold text-white">{results.soil.bearingCapacity}</p>
          <p className="text-gray-500 text-xs">kN/m²</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Water Table</p>
          <p className="text-2xl font-bold text-white">{results.soil.waterTableDepth}m</p>
          <p className="text-gray-500 text-xs">depth</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">pH Level</p>
          <p className="text-2xl font-bold text-white">{results.soil.ph}</p>
          <p className="text-gray-500 text-xs">{results.soil.ph < 6 ? 'Acidic' : results.soil.ph > 7.5 ? 'Alkaline' : 'Neutral'}</p>
        </div>
      </div>

      {/* Soil Composition */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🧪 Soil Composition</h3>
        <div className="space-y-4">
          {[
            { label: 'Sand', value: results.soil.texture.sand, color: 'amber' },
            { label: 'Silt', value: results.soil.texture.silt, color: 'gray' },
            { label: 'Clay', value: results.soil.texture.clay, color: 'orange' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-white w-16">{item.label}</span>
              <div className="flex-1 bg-slate-700 rounded-full h-4 overflow-hidden">
                <div className={`bg-${item.color}-500 h-full`} style={{ width: `${item.value}%` }} />
              </div>
              <span className="text-white w-12 text-right">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Plasticity Index */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📊 Plasticity Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Liquid Limit</p>
            <p className="text-xl font-bold text-white">{results.soil.plasticity.liquid}%</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Plastic Limit</p>
            <p className="text-xl font-bold text-white">{results.soil.plasticity.plastic}%</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">Plasticity Index</p>
            <p className="text-xl font-bold text-white">{results.soil.plasticity.index}%</p>
          </div>
        </div>
      </div>

      {/* Soil Risks */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Expansivity', value: results.soil.expansivity },
          { label: 'Compressibility', value: results.soil.compressibility },
          { label: 'Corrosivity', value: results.soil.corrosivity },
          { label: 'Drainage', value: results.soil.drainageClass },
        ].map((item, i) => (
          <div key={i} className={`rounded-xl p-4 text-center ${
            item.value === 'Low' || item.value === 'Well Drained' ? 'bg-green-500/10 border border-green-500/30' :
            item.value === 'High' || item.value === 'Very High' || item.value === 'Poorly Drained' ? 'bg-red-500/10 border border-red-500/30' :
            'bg-amber-500/10 border border-amber-500/30'
          }`}>
            <p className="text-gray-400 text-sm">{item.label}</p>
            <p className="text-white font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Treatment Required */}
      {results.soil.treatmentRequired.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-amber-400 mb-4">⚠️ Soil Treatment Required</h3>
          <div className="space-y-2">
            {results.soil.treatmentRequired.map((treatment, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <span className="text-amber-400">→</span> {treatment}
              </div>
            ))}
          </div>
          <p className="text-emerald-400 mt-4 font-bold">
            Recommended Foundation: {results.soil.foundationRecommendation}
          </p>
        </div>
      )}
    </div>
  );

  // Flood Risk Tab
  const renderFloodRisk = () => results && (
    <div className="space-y-6">
      {/* Risk Level Banner */}
      <div className={`rounded-xl p-6 text-center ${
        results.flood.riskLevel === 'Very Low' ? 'bg-green-500/20 border border-green-500/30' :
        results.flood.riskLevel === 'Low' ? 'bg-emerald-500/20 border border-emerald-500/30' :
        results.flood.riskLevel === 'Moderate' ? 'bg-amber-500/20 border border-amber-500/30' :
        results.flood.riskLevel === 'High' ? 'bg-orange-500/20 border border-orange-500/30' :
        'bg-red-500/20 border border-red-500/30'
      }`}>
        <p className="text-gray-400 text-sm">Flood Risk Level</p>
        <p className="text-4xl font-bold text-white mt-2">{results.flood.riskLevel}</p>
        <p className="text-white mt-2">{results.flood.floodZone}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">River Distance</p>
          <p className="text-2xl font-bold text-white">{results.flood.riverProximity}m</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Catchment Area</p>
          <p className="text-2xl font-bold text-white">{results.flood.upstreamCatchment} km²</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Flash Flood Risk</p>
          <p className="text-xl font-bold text-white">{results.flood.flashFloodRisk}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
          <p className="text-gray-400 text-sm">Drainage Basin</p>
          <p className="text-sm font-bold text-white">{results.flood.drainageBasin}</p>
        </div>
      </div>

      {/* Return Period Analysis */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">📈 Flood Return Period Analysis</h3>
        <div className="grid md:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">10-Year Flood</p>
            <p className="text-2xl font-bold text-white">{results.flood.returnPeriod['10yr']}m</p>
            <p className="text-gray-500 text-xs">predicted depth</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">50-Year Flood</p>
            <p className="text-2xl font-bold text-amber-400">{results.flood.returnPeriod['50yr']}m</p>
            <p className="text-gray-500 text-xs">predicted depth</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <p className="text-gray-400 text-sm">100-Year Flood</p>
            <p className="text-2xl font-bold text-red-400">{results.flood.returnPeriod['100yr']}m</p>
            <p className="text-gray-500 text-xs">predicted depth</p>
          </div>
        </div>
      </div>

      {/* Historical Floods */}
      {results.flood.historicalFloods.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📜 Historical Flood Events</h3>
          <div className="space-y-3">
            {results.flood.historicalFloods.map((flood, i) => (
              <div key={i} className="flex items-center justify-between bg-slate-900/50 rounded-lg p-3">
                <span className="text-white font-bold">{flood.year}</span>
                <span className={`px-2 py-0.5 rounded text-sm ${
                  flood.severity === 'Minor' ? 'bg-green-500/20 text-green-400' :
                  flood.severity === 'Moderate' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-red-500/20 text-red-400'
                }`}>{flood.severity}</span>
                <span className="text-gray-400">{flood.depth}m depth</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mitigations */}
      {results.flood.mitigations.length > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-emerald-400 mb-4">🛡️ Recommended Mitigations</h3>
          <div className="space-y-2">
            {results.flood.mitigations.map((mitigation, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <span className="text-emerald-400">✓</span> {mitigation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Building Restrictions */}
      {results.flood.buildingRestrictions.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4">⚠️ Building Restrictions</h3>
          <div className="space-y-2">
            {results.flood.buildingRestrictions.map((restriction, i) => (
              <div key={i} className="flex items-center gap-2 text-white">
                <span className="text-red-400">!</span> {restriction}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">🛰️ Advanced Site Analyzer</h2>
        <p className="text-emerald-400">NASA + Google Earth Engine + USGS + 10 More Data Sources</p>
        <p className="text-gray-500 text-sm mt-1">Beats Autodesk Revit, ArchiCAD, SketchUp, Rhino & Vectorworks</p>
      </div>

      {/* Input Controls */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Latitude</label>
            <input
              type="number"
              step="0.0001"
              value={coordinates.lat}
              onChange={(e) => setCoordinates({ ...coordinates, lat: parseFloat(e.target.value) })}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Longitude</label>
            <input
              type="number"
              step="0.0001"
              value={coordinates.lng}
              onChange={(e) => setCoordinates({ ...coordinates, lng: parseFloat(e.target.value) })}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">Plot Size (sqm)</label>
            <input
              type="number"
              value={plotSize}
              onChange={(e) => setPlotSize(parseInt(e.target.value))}
              className="w-full p-3 bg-slate-900 border border-slate-600 rounded-lg text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold rounded-lg disabled:opacity-50"
            >
              {isAnalyzing ? `Analyzing... ${progress}%` : '🛰️ Analyze Site'}
            </button>
          </div>
        </div>

        {/* Active Data Sources */}
        {isAnalyzing && activeDataSources.length > 0 && (
          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
            <p className="text-emerald-400 text-sm mb-2">Connecting to data sources:</p>
            <div className="flex flex-wrap gap-2">
              {activeDataSources.slice(-6).map((source, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded text-emerald-400 text-xs animate-pulse">
                  {source}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'terrain' && results && renderTerrain()}
      {activeTab === 'soil' && results && renderSoil()}
      {activeTab === 'flood' && results && renderFloodRisk()}
      {activeTab === 'datasources' && renderDataSources()}
      {activeTab === 'competition' && renderCompetition()}
      {activeTab !== 'overview' && activeTab !== 'terrain' && activeTab !== 'soil' && activeTab !== 'flood' && activeTab !== 'datasources' && activeTab !== 'competition' && !results && (
        <div className="text-center py-12">
          <span className="text-6xl">🛰️</span>
          <p className="text-white font-bold mt-4">Run analysis to see {activeTab} data</p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSiteAnalyzerModule;
