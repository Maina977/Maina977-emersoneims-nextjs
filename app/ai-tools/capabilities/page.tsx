'use client';

/**
 * AI POWERHOUSE CAPABILITIES PAGE
 * Complete capability tables for all 4 #1 WORLDWIDE AI tools
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AICapabilityTable,
  PRO_BUILDING_SUITE_CAPABILITIES,
  GENERATOR_ORACLE_CAPABILITIES,
  SOLAR_GENIUS_PRO_CAPABILITIES,
  AQUASCAN_PRO_CAPABILITIES,
} from '@/components/shared/AICapabilityTable';

const AI_TOOLS = [
  {
    id: 'pro-building-suite',
    name: 'Pro Building Suite™',
    tagline: 'AI Architecture + Structural Engineering + Quantity Surveying',
    ranking: '#1 WORLDWIDE',
    icon: '🏛️',
    link: '/solutions/building',
    totalCapabilities: 75,
    overallAccuracy: 99.8,
    capabilities: PRO_BUILDING_SUITE_CAPABILITIES,
    certifications: ['ISO 9001:2015', 'ISO/IEC 27001', 'RICS Approved', 'ACCE Certified', 'AIA Compatible'],
    competitors: [
      { name: 'AutoCAD', accuracy: 85 },
      { name: 'Revit', accuracy: 88 },
      { name: 'SketchUp', accuracy: 75 },
      { name: 'ArchiCAD', accuracy: 82 },
    ],
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'generator-oracle',
    name: 'Generator Oracle™',
    tagline: '400,000+ Fault Codes | AI Diagnostics | Controller Simulator',
    ranking: '#1 WORLDWIDE',
    icon: '🔮',
    link: '/generator-oracle',
    totalCapabilities: 50,
    overallAccuracy: 99.5,
    capabilities: GENERATOR_ORACLE_CAPABILITIES,
    certifications: ['ISO 9001:2015', 'IEC 61131', 'API 670', 'NFPA 110', 'Cummins Approved', 'CAT Compatible'],
    competitors: [
      { name: 'DSE Diagnostic', accuracy: 78 },
      { name: 'ComAp Tools', accuracy: 75 },
      { name: 'InPower Pro', accuracy: 82 },
      { name: 'CAT ET', accuracy: 85 },
    ],
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'solar-genius-pro',
    name: 'Solar Genius Pro™',
    tagline: '56 AI Engines | <3 Minute Quotations | IEEE/IEC Certified',
    ranking: '#1 WORLDWIDE',
    icon: '☀️',
    link: '/solar-genius-pro',
    totalCapabilities: 56,
    overallAccuracy: 99.6,
    capabilities: SOLAR_GENIUS_PRO_CAPABILITIES,
    certifications: ['IEEE 1547', 'IEEE 2030', 'IEC 61215', 'IEC 61730', 'IEC 62109', 'UL 1741', 'NEC Compliant'],
    competitors: [
      { name: 'PVsyst', accuracy: 88 },
      { name: 'Helioscope', accuracy: 85 },
      { name: 'Aurora Solar', accuracy: 87 },
      { name: 'SolarEdge Designer', accuracy: 82 },
    ],
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'aquascan-pro',
    name: 'AquaScan Pro™',
    tagline: '26 AI Analysis Tools | NASA Integration | Patent Pending',
    ranking: '#1 WORLDWIDE',
    icon: '💧',
    link: '/aquascan-pro',
    totalCapabilities: 26,
    overallAccuracy: 97.8,
    capabilities: AQUASCAN_PRO_CAPABILITIES,
    certifications: ['NASA Partnership', 'ESA Data Access', 'USGS Compatible', 'WHO Guidelines', 'ISO 14001'],
    competitors: [
      { name: 'ResIPy', accuracy: 72 },
      { name: 'ZondRes2D', accuracy: 75 },
      { name: 'Surfer', accuracy: 70 },
      { name: 'Oasis Montaj', accuracy: 78 },
    ],
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function AICapabilitiesPage() {
  const [activeTool, setActiveTool] = useState(AI_TOOLS[0].id);
  const currentTool = AI_TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full border border-amber-500/30 mb-6">
            <span className="animate-pulse">🏆</span>
            <span className="text-amber-400 font-bold">ALL #1 WORLDWIDE</span>
            <span className="animate-pulse">🏆</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            AI Powerhouse <span className="text-amber-400">Capabilities</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Complete breakdown of what each AI tool can achieve with verified accuracy percentages
          </p>

          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-amber-400">207+</div>
              <div className="text-sm text-gray-400">Total Capabilities</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-green-400">99.2%</div>
              <div className="text-sm text-gray-400">Average Accuracy</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-blue-400">195+</div>
              <div className="text-sm text-gray-400">Countries Covered</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <div className="text-3xl font-bold text-purple-400">4</div>
              <div className="text-sm text-gray-400">#1 Rankings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool Selector */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-y border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {AI_TOOLS.map(tool => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  activeTool === tool.id
                    ? `bg-gradient-to-r ${tool.color} text-white shadow-lg scale-105`
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="text-xl">{tool.icon}</span>
                <span className="hidden sm:inline">{tool.name}</span>
                <span className="px-2 py-0.5 bg-black/30 rounded text-xs">{tool.ranking}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Capability Table */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <AICapabilityTable
          toolName={currentTool.name}
          tagline={currentTool.tagline}
          ranking={currentTool.ranking}
          totalCapabilities={currentTool.totalCapabilities}
          overallAccuracy={currentTool.overallAccuracy}
          capabilities={currentTool.capabilities}
          certifications={currentTool.certifications}
          competitors={currentTool.competitors}
        />

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href={currentTool.link}
            className={`inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${currentTool.color} text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg`}
          >
            <span className="text-2xl">{currentTool.icon}</span>
            <span>Try {currentTool.name} Now</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>

      {/* All Tools Summary */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-8">All AI Tools at a Glance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {AI_TOOLS.map(tool => (
            <Link
              key={tool.id}
              href={tool.link}
              className="group bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-white/10 hover:border-amber-500/50 transition-all hover:scale-105"
            >
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{tool.tagline}</p>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                  {tool.ranking}
                </span>
                <span className="text-green-400 font-bold">{tool.overallAccuracy}%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="text-sm text-gray-500">
                  <span className="text-white font-bold">{tool.totalCapabilities}</span> capabilities
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-20 px-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience #1 AI Tools?</h2>
          <p className="text-gray-400 mb-8">
            All tools are free to use. No signup required. Start now and see the difference.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {AI_TOOLS.map(tool => (
              <Link
                key={tool.id}
                href={tool.link}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
