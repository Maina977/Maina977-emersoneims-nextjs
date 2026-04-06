'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { Building2, PenTool, FileText } from 'lucide-react';

const ProBuildingSuiteIntegrated = dynamic(
  () => import('@/components/building/ProBuildingSuiteIntegrated'),
  { ssr: false }
);

const AIDesignStudioModule = dynamic(
  () => import('@/components/building/AIDesignStudioModule'),
  { ssr: false }
);

export default function ProBuildingSuitePage() {
  const [mode, setMode] = useState<'select' | 'design' | 'report'>('select');

  if (mode === 'select') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30">
              <Building2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-black text-white mb-3">PRO BUILDING SUITE</h1>
            <p className="text-emerald-400 text-lg">Complete AI Construction Platform</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Design Studio Option */}
            <button
              onClick={() => setMode('design')}
              className="bg-slate-800/50 hover:bg-slate-700/50 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-8 text-left transition-all group"
            >
              <div className="w-16 h-16 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/30">
                <PenTool className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">AI Design Studio</h2>
              <p className="text-slate-400 mb-4">Interactive building designer with full configuration options</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Building type selection (residential, commercial, etc.)</li>
                <li>• Architectural style options</li>
                <li>• Soil type & seismic zone</li>
                <li>• Solar & borehole integration</li>
                <li>• Real-time 3D preview</li>
              </ul>
              <div className="mt-4 text-emerald-400 font-semibold flex items-center gap-2">
                Open Design Studio →
              </div>
            </button>

            {/* Report Generator Option */}
            <button
              onClick={() => setMode('report')}
              className="bg-slate-800/50 hover:bg-slate-700/50 border border-cyan-500/30 hover:border-cyan-400 rounded-2xl p-8 text-left transition-all group"
            >
              <div className="w-16 h-16 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/30">
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
              <h2 className="text-white text-xl font-bold mb-2">Quick Report Generator</h2>
              <p className="text-slate-400 mb-4">Generate complete building reports from a description</p>
              <ul className="text-sm text-slate-500 space-y-1">
                <li>• Describe your dream building</li>
                <li>• AI generates 10 professional outputs</li>
                <li>• Floor plans, BOQ, electrical, plumbing</li>
                <li>• Structural analysis & risk assessment</li>
                <li>• Kenya market prices & suppliers</li>
              </ul>
              <div className="mt-4 text-cyan-400 font-semibold flex items-center gap-2">
                Generate Report →
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">Both tools are FREE and use real AI + Kenya market data</p>
          </div>
        </div>
      </main>
    );
  }

  if (mode === 'design') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950">
        <div className="p-4">
          <button
            onClick={() => setMode('select')}
            className="text-slate-400 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Selection
          </button>
        </div>
        <Suspense fallback={<div className="text-emerald-400 text-center p-8">Loading Design Studio...</div>}>
          <AIDesignStudioModule />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-emerald-950">
      <div className="p-4">
        <button
          onClick={() => setMode('select')}
          className="text-slate-400 hover:text-white mb-4 flex items-center gap-2"
        >
          ← Back to Selection
        </button>
      </div>
      <Suspense fallback={<div className="text-emerald-400 text-center p-8">Loading Report Generator...</div>}>
        <ProBuildingSuiteIntegrated />
      </Suspense>
    </main>
  );
}
