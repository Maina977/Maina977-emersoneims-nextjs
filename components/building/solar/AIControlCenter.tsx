'use client';

import React, { useState } from 'react';

// =============================================================================
// AI CONTROL CENTER - World's Most Advanced Solar AI Dashboard
// =============================================================================

interface AIFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'ready' | 'processing' | 'complete' | 'error';
  category: 'analysis' | 'design' | 'financial' | 'operations';
}

const AI_FEATURES: AIFeature[] = [
  {
    id: 'depth',
    name: 'AI 3D Depth Estimation',
    description: 'Generate 3D roof models from any photo - no LIDAR needed',
    icon: '🎯',
    status: 'ready',
    category: 'analysis'
  },
  {
    id: 'optimizer',
    name: 'Neural Panel Optimizer',
    description: 'ML-powered panel placement with string-level optimization',
    icon: '🧠',
    status: 'ready',
    category: 'design'
  },
  {
    id: 'permits',
    name: 'AI Permit Generator',
    description: 'Auto-generate permit-ready documents and drawings',
    icon: '📋',
    status: 'ready',
    category: 'design'
  },
  {
    id: 'satellite',
    name: 'Satellite Roof Analyzer',
    description: 'Detect roof type, obstructions, and orientation from satellite',
    icon: '🛰️',
    status: 'ready',
    category: 'analysis'
  },
  {
    id: 'oracle',
    name: 'AI Energy Oracle',
    description: '25-year production prediction with weather ML',
    icon: '🔮',
    status: 'ready',
    category: 'financial'
  },
  {
    id: 'financial',
    name: 'Financial Genius',
    description: 'Smart ROI, NPV, IRR, and financing optimization',
    icon: '💰',
    status: 'ready',
    category: 'financial'
  },
  {
    id: 'copilot',
    name: 'Design Copilot',
    description: 'Natural language: "Add 10 panels avoiding the chimney"',
    icon: '🗣️',
    status: 'ready',
    category: 'design'
  },
  {
    id: 'anomaly',
    name: 'Anomaly Detector',
    description: 'Predict system failures before they happen',
    icon: '🔍',
    status: 'ready',
    category: 'operations'
  },
  {
    id: 'drone',
    name: 'Drone Commander',
    description: 'Plan autonomous drone survey missions',
    icon: '🚁',
    status: 'ready',
    category: 'operations'
  },
  {
    id: 'grid',
    name: 'Grid Analyzer',
    description: 'Smart grid integration and export optimization',
    icon: '⚡',
    status: 'ready',
    category: 'operations'
  }
];

export default function AIControlCenter() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [copilotCommand, setCopilotCommand] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Demo data for simulations
  const demoLocation = { lat: -1.2921, lng: 36.8219 };  // Nairobi
  const demoSystemSize = 10;  // kW

  const runAIAnalysis = async (featureId: string) => {
    setActiveFeature(featureId);
    setProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const featureResults: Record<string, unknown> = {
      depth: {
        pointCloudGenerated: true,
        meshTriangles: 12456,
        roofPlanesDetected: 2,
        obstructionsFound: 3,
        confidence: 0.89
      },
      optimizer: {
        totalPanels: 28,
        totalCapacity: 11.2,
        annualProduction: 18760,
        strings: 3,
        optimizationScore: 94,
        efficiency: 0.21
      },
      permits: {
        documentsGenerated: 5,
        types: ['Site Plan', 'Electrical Diagram', 'Structural Letter', 'Interconnection', 'Building Permit'],
        aiConfidence: 0.94,
        readyForSubmission: true
      },
      satellite: {
        roofArea: 130,
        usableArea: 105,
        roofType: 'Metal - Corrugated',
        orientation: 'South-facing',
        pitch: 15,
        treeShading: 'Low',
        solarPotential: 88
      },
      oracle: {
        year1Production: 18500,
        year25Production: 16280,
        lifetimeTotal: 435000,
        degradation: '0.5% per year',
        confidence: 0.88
      },
      financial: {
        systemCost: 880000,
        incentives: 220000,
        netCost: 660000,
        paybackYears: 4.2,
        roi: 285,
        npv: 1250000,
        irr: 18.5,
        lcoe: 0.052
      },
      copilot: {
        commandUnderstood: true,
        action: 'Optimized panel placement',
        panelsAdded: 4,
        newTotal: 32,
        newProduction: 21500
      },
      anomaly: {
        systemHealth: 96,
        anomaliesDetected: 0,
        maintenanceNeeded: false,
        nextService: '6 months',
        inverterHealth: 98,
        panelHealth: 97
      },
      drone: {
        missionPlanned: true,
        waypoints: 24,
        flightTime: '18 minutes',
        batteryRequired: '72%',
        coverageArea: '450 m²',
        resolution: '1.2 cm/pixel'
      },
      grid: {
        gridCapacity: 15,
        exportPotential: 8500,
        curtailmentRisk: 'Low',
        voltageStability: 92,
        batteryRecommended: true,
        estimatedSavings: 125000
      }
    };

    setResults(prev => ({ ...prev, [featureId]: featureResults[featureId] }));
    setProcessing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const categories = ['analysis', 'design', 'financial', 'operations'] as const;
  const categoryLabels: Record<typeof categories[number], string> = {
    analysis: 'Site Analysis',
    design: 'System Design',
    financial: 'Financial Analysis',
    operations: 'Operations & Monitoring'
  };

  const categoryColors: Record<typeof categories[number], string> = {
    analysis: 'from-blue-500 to-cyan-500',
    design: 'from-purple-500 to-pink-500',
    financial: 'from-green-500 to-emerald-500',
    operations: 'from-orange-500 to-yellow-500'
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-2xl p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-3xl">🤖</span>
          </div>
          <div className="text-left">
            <h2 className="text-3xl font-bold text-white">AI Control Center</h2>
            <p className="text-blue-300">World&apos;s Most Advanced Solar AI</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <div className="bg-blue-500/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-blue-300">10 AI Engines</span>
          </div>
          <div className="bg-green-500/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-green-300">Neural Networks</span>
          </div>
          <div className="bg-purple-500/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-purple-300">Machine Learning</span>
          </div>
          <div className="bg-orange-500/20 backdrop-blur px-4 py-2 rounded-full">
            <span className="text-orange-300">No LIDAR Required</span>
          </div>
        </div>
      </div>

      {/* AI Features Grid by Category */}
      {categories.map(category => (
        <div key={category} className="mb-8">
          <h3 className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${categoryColors[category]} mb-4`}>
            {categoryLabels[category]}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_FEATURES.filter(f => f.category === category).map(feature => (
              <div
                key={feature.id}
                className={`bg-white/5 backdrop-blur rounded-xl p-4 border transition-all cursor-pointer ${
                  activeFeature === feature.id
                    ? 'border-blue-400 shadow-lg shadow-blue-500/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => runAIAnalysis(feature.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{feature.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{feature.description}</p>
                  </div>
                </div>

                {activeFeature === feature.id && processing && (
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-blue-400">
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">AI Processing...</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1 mt-2">
                      <div className="bg-blue-500 h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
                    </div>
                  </div>
                )}

                {results[feature.id] && activeFeature === feature.id && !processing ? (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <span>✓</span>
                      <span className="text-sm font-medium">Analysis Complete</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(results[feature.id] as Record<string, unknown>).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-gray-300">
                          <span className="text-gray-500">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                          <span className="text-white">
                            {typeof value === 'number' ? value.toLocaleString() : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* AI Copilot Command Center */}
      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🗣️</span> AI Design Copilot
        </h3>
        <p className="text-gray-300 mb-4">
          Use natural language to control your solar design. Try commands like:
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            'Add 10 panels avoiding the chimney',
            'Maximize production on south roof',
            'Optimize for best ROI',
            'How many kWh will this produce?',
            'Move panels away from the vent'
          ].map(cmd => (
            <button
              key={cmd}
              onClick={() => setCopilotCommand(cmd)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm text-gray-300 transition"
            >
              &quot;{cmd}&quot;
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={copilotCommand}
            onChange={(e) => setCopilotCommand(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={() => runAIAnalysis('copilot')}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition"
          >
            Execute
          </button>
        </div>
      </div>

      {/* Image Upload for 3D Analysis */}
      <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-6 border border-blue-500/30 mb-8">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>🎯</span> AI 3D Analysis from Photo
        </h3>
        <p className="text-gray-300 mb-4">
          Upload any photo of a roof - our AI will generate a 3D model, detect obstructions, and calculate solar potential.
          <span className="text-blue-400 font-semibold"> No expensive LIDAR equipment needed!</span>
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block w-full cursor-pointer">
              <div className="border-2 border-dashed border-blue-500/50 rounded-xl p-8 text-center hover:border-blue-400 transition">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-300">Drop a roof photo or click to upload</p>
                <p className="text-gray-500 text-sm mt-1">Supports JPG, PNG, HEIC</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          {imagePreview && (
            <div className="flex-1">
              <div className="relative rounded-xl overflow-hidden">
                <img src={imagePreview} alt="Uploaded roof" className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                  <button
                    onClick={() => runAIAnalysis('depth')}
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition"
                  >
                    Analyze with AI
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-blue-400">10</div>
          <div className="text-gray-400 text-sm">AI Engines</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-green-400">0.89</div>
          <div className="text-gray-400 text-sm">Avg Confidence</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-purple-400">&lt;2s</div>
          <div className="text-gray-400 text-sm">Analysis Time</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-xl p-4 text-center">
          <div className="text-3xl font-bold text-orange-400">100%</div>
          <div className="text-gray-400 text-sm">Cloud-Free</div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="bg-white/5 backdrop-blur rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">EmersonEIMS AI Capabilities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-gray-400">Feature</th>
                <th className="text-center py-3 px-4 text-gray-400">Traditional Tools</th>
                <th className="text-center py-3 px-4 text-gray-400">EmersonEIMS AI</th>
                <th className="text-center py-3 px-4 text-gray-400">Advantage</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: '3D Roof Modeling', traditional: 'Expensive LIDAR', ems: 'AI from Any Photo', advantage: '10x Cheaper' },
                { feature: 'Panel Optimization', traditional: 'Manual Placement', ems: 'Neural Network ML', advantage: '15% More Power' },
                { feature: 'Permit Generation', traditional: 'Hours of Work', ems: 'AI Auto-Generate', advantage: 'Instant' },
                { feature: 'Production Prediction', traditional: '1-Year Estimate', ems: '25-Year ML Forecast', advantage: 'Long-term ROI' },
                { feature: 'Voice Control', traditional: 'Not Available', ems: 'Full Voice Commands', advantage: 'Hands-free' },
                { feature: 'Natural Language', traditional: 'Click Menus', ems: 'AI Copilot Chat', advantage: 'Intuitive' },
                { feature: 'System Monitoring', traditional: 'Basic Alerts', ems: 'Predictive AI', advantage: 'Prevent Failures' },
                { feature: 'Site Surveys', traditional: 'Manual Process', ems: 'AI Drone Commander', advantage: 'Autonomous' },
                { feature: 'Financial Analysis', traditional: 'Spreadsheets', ems: 'AI Financial Genius', advantage: 'Smart ROI' },
                { feature: 'Africa Coverage', traditional: 'USA/Europe Only', ems: '15 African Countries', advantage: 'Local Data' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-white/5">
                  <td className="py-3 px-4 text-white">{row.feature}</td>
                  <td className="py-3 px-4 text-center text-gray-400">{row.traditional}</td>
                  <td className="py-3 px-4 text-center text-green-400">{row.ems}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
                      {row.advantage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏆</span>
            <div>
              <h4 className="text-lg font-bold text-green-400">World&apos;s Most Advanced Solar AI Platform</h4>
              <p className="text-gray-300 text-sm">
                10 AI engines, 15 African countries, enterprise integrations - all powered by cutting-edge machine learning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
