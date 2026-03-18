'use client';

/**
 * TECHNICAL BIBLE - World's Most Comprehensive Generator & Power Documentation
 *
 * The ultimate reference for technicians worldwide covering:
 * - Schematic diagrams for all products
 * - Complete wiring diagrams with colors, instructions
 * - Troubleshooting guides
 * - Repair manuals
 * - Parts catalogs
 * - Maintenance schedules
 *
 * 10 Services covered:
 * 1. Cummins Generators
 * 2. Generator Repairs
 * 3. ATS/Changeover Systems
 * 4. Distribution Boards
 * 5. Solar Energy
 * 6. Motor Rewinding
 * 7. AC Installation (HVAC)
 * 8. UPS Systems
 * 9. Borehole Pumps
 * 10. Hospital Incinerators
 */

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  BookOpen, Wrench, Cpu, Zap, AlertTriangle,
  Settings, FileText, Download, Search
} from 'lucide-react';

// Dynamic import for heavy technical content
const TechnicalBibleHub = dynamic(
  () => import('@/components/technical/TechnicalBibleHub'),
  {
    loading: () => (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Technical Documentation...</p>
          <p className="text-slate-400 text-sm mt-2">Preparing schematics, wiring diagrams & manuals</p>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function TechnicalBiblePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black">
      {/* Hero Section */}
      <section className="relative py-16 px-4 border-b border-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,200,255,0.15)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-slate-400">
              <li><Link href="/" className="hover:text-cyan-400 transition-colors">Home</Link></li>
              <li>/</li>
              <li className="text-cyan-400">Technical Bible</li>
            </ol>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>World's Most Complete Technical Reference</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Technical{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Bible
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Complete schematics, wiring diagrams, troubleshooting guides, repair manuals,
              and parts catalogs for all 10 services. The definitive reference for
              power system technicians.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-8">
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <Cpu className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Schematics</p>
                <p className="text-slate-400 text-xs">Circuit diagrams</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <Zap className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Wiring</p>
                <p className="text-slate-400 text-xs">Color-coded guides</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Troubleshoot</p>
                <p className="text-slate-400 text-xs">Fault diagnosis</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                <Wrench className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-white font-medium text-sm">Repair</p>
                <p className="text-slate-400 text-xs">Step-by-step</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 text-center mb-8">
              <div>
                <p className="text-3xl font-bold text-cyan-400">10</p>
                <p className="text-slate-400 text-sm">Services</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">500+</p>
                <p className="text-slate-400 text-sm">Schematics</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">2,000+</p>
                <p className="text-slate-400 text-sm">Procedures</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-cyan-400">10,000+</p>
                <p className="text-slate-400 text-sm">Parts Listed</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search schematics, wiring, parts, procedures..."
                className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technical Bible Content */}
      <Suspense fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white">Loading documentation...</p>
          </div>
        </div>
      }>
        <TechnicalBibleHub />
      </Suspense>
    </main>
  );
}
