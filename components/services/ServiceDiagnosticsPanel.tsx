'use client';

/**
 * ServiceDiagnosticsPanel
 *
 * Inline panel rendered inside each /services/<slug> page so users get the
 * same calculator + Q&A + gauges that used to live on /diagnostics, without
 * leaving the service subpage.
 */

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServiceDiagnostics, CalculatorKey } from '@/lib/services/serviceDiagnostics';

const CalculatorLoader = (
  <div className="p-8 text-center text-slate-400">Loading calculator…</div>
);

const CALCULATORS: Record<CalculatorKey, ReturnType<typeof dynamic>> = {
  generators: dynamic(() => import('@/components/calculators/AdvancedGeneratorCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  solar: dynamic(() => import('@/components/calculators/AdvancedSolarCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  'high-voltage': dynamic(() => import('@/components/calculators/AdvancedHighVoltageCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  'motor-rewinding': dynamic(() => import('@/components/calculators/AdvancedMotorRewindingCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  ac: dynamic(() => import('@/components/calculators/AdvancedACCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  ups: dynamic(() => import('@/components/calculators/AdvancedUPSCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  borehole: dynamic(() => import('@/components/calculators/AdvancedBoreholePumpCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  fabrication: dynamic(() => import('@/components/calculators/AdvancedFabricationCalculator'), { ssr: false, loading: () => CalculatorLoader }),
  incinerators: dynamic(() => import('@/components/calculators/AdvancedIncineratorCalculator'), { ssr: false, loading: () => CalculatorLoader }),
};

function NeedleGauge({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  const angle = (percentage / 100) * 180 - 90;
  return (
    <div className="flex flex-col items-center p-4 bg-slate-900/60 rounded-lg border border-slate-700">
      <svg width="120" height="70" viewBox="0 0 120 70">
        <path d="M10,65 A50,50 0 0,1 110,65" stroke="#333" strokeWidth="8" fill="none" />
        <path
          d="M10,65 A50,50 0 0,1 110,65"
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={`${percentage * 1.57} 157`}
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <line
          x1="60"
          y1="65"
          x2={60 + 40 * Math.cos((angle * Math.PI) / 180)}
          y2={65 + 40 * Math.sin((angle * Math.PI) / 180)}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="60" cy="65" r="5" fill={color} />
        <text x="10" y="68" fill="#666" fontSize="8">0</text>
        <text x="100" y="68" fill="#666" fontSize="8">{max}</text>
      </svg>
      <div className="text-center mt-2">
        <div className="text-lg font-bold" style={{ color }}>{value} {unit}</div>
        <div className="text-xs text-slate-400">{label}</div>
      </div>
    </div>
  );
}

interface Props {
  serviceShortName: string;
  diagnostics: ServiceDiagnostics;
  contactPhone: string;
  contactWhatsapp: string;
}

export default function ServiceDiagnosticsPanel({
  serviceShortName,
  diagnostics,
  contactPhone,
  contactWhatsapp,
}: Props) {
  const Calculator = CALCULATORS[diagnostics.calculatorKey];
  const [expandedQA, setExpandedQA] = useState<number | null>(null);

  return (
    <section className="py-16 px-4 bg-slate-950">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Sub-services strip */}
        <div className="flex flex-wrap gap-2">
          {diagnostics.subServices.map((sub) => (
            <span
              key={sub}
              className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-xs text-slate-300"
            >
              {sub}
            </span>
          ))}
        </div>

        {/* Calculator */}
        <div id="calculator" className="scroll-mt-32">
          <div className="flex items-center justify-between flex-wrap gap-3 border-b border-slate-700 pb-3 mb-5">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <span aria-hidden="true">🧮</span>
              {diagnostics.calculatorTitle}
            </h2>
            <code className="text-xs text-slate-400 px-3 py-1 bg-slate-800/70 rounded">
              {diagnostics.formula}
            </code>
          </div>
          <Calculator />
        </div>

        {/* Q&A + Gauges grid */}
        <div id="troubleshooting" className="grid grid-cols-1 lg:grid-cols-3 gap-6 scroll-mt-32">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-3 mb-4">
              Diagnostic Q&amp;A
            </h2>
            {diagnostics.qaPairs.map((qa, idx) => {
              const tone =
                qa.severity === 'critical'
                  ? 'border-red-500/50 bg-red-900/10'
                  : qa.severity === 'high'
                  ? 'border-orange-500/50 bg-orange-900/10'
                  : qa.severity === 'medium'
                  ? 'border-yellow-500/50 bg-yellow-900/10'
                  : 'border-green-500/50 bg-green-900/10';
              const badge =
                qa.severity === 'critical'
                  ? 'bg-red-500 text-white'
                  : qa.severity === 'high'
                  ? 'bg-orange-500 text-white'
                  : qa.severity === 'medium'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-green-500 text-white';
              return (
                <div key={idx} className={`border rounded-lg overflow-hidden ${tone}`}>
                  <button
                    onClick={() => setExpandedQA(expandedQA === idx ? null : idx)}
                    className="w-full text-left p-4 flex items-start justify-between hover:bg-white/5"
                  >
                    <div className="flex items-start gap-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${badge}`}>
                        {qa.severity.toUpperCase()}
                      </span>
                      <span className="font-semibold text-white">{qa.q}</span>
                    </div>
                    <span className={`text-cyan-400 transition-transform ${expandedQA === idx ? 'rotate-180' : ''}`}>▼</span>
                  </button>
                  <AnimatePresence>
                    {expandedQA === idx && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden border-t border-slate-700"
                      >
                        <div className="p-4 bg-black/30">
                          <div className="mb-3">
                            <h3 className="text-xs text-cyan-400 font-bold mb-1">DIAGNOSIS</h3>
                            <p className="text-slate-300 text-sm">{qa.a}</p>
                          </div>
                          <div>
                            <h3 className="text-xs text-green-400 font-bold mb-2">SOLUTIONS</h3>
                            <ul className="space-y-1">
                              {qa.solutions.map((sol, i) => (
                                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                  <span className="text-green-400">✓</span> {sol}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-700">
                            <a
                              href={contactWhatsapp}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded text-center text-sm font-bold"
                            >
                              💬 WhatsApp Expert
                            </a>
                            <a
                              href={`tel:${contactPhone}`}
                              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded text-center text-sm font-bold"
                            >
                              📞 Call Now
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-3 mb-4">
                Live Telemetry
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {diagnostics.gauges.map((g, idx) => (
                  <NeedleGauge key={idx} {...g} />
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-lg p-4">
              <h3 className="text-lg font-bold text-cyan-400 mb-2">Need Expert Help?</h3>
              <p className="text-slate-400 text-sm mb-3">
                Certified technicians available 24/7 for {serviceShortName.toLowerCase()}.
              </p>
              <div className="space-y-2">
                <a
                  href={contactWhatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-500 text-white py-2.5 rounded font-bold text-center text-sm"
                >
                  💬 WhatsApp
                </a>
                <a
                  href={`tel:${contactPhone}`}
                  className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded font-bold text-center text-sm"
                >
                  📞 Call {contactPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Jump-to in-page sections (Bible / Calculator anchors) */}
        {diagnostics.deepLinks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-cyan-400 border-b border-slate-700 pb-3 mb-2">
              Jump to a Section on This Page
            </h2>
            <p className="text-sm text-slate-400 mb-5">
              Everything for {serviceShortName.toLowerCase()} lives on this page — no extra clicks, no other pages.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {diagnostics.deepLinks.map((link) => {
                const isAnchor = link.href.startsWith('#');
                const Cmp: any = isAnchor ? 'a' : Link;
                return (
                  <Cmp
                    key={link.href}
                    href={link.href}
                    className="group flex items-start gap-3 p-4 bg-slate-800/60 border border-slate-700 rounded-xl hover:border-cyan-500/60 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-3xl shrink-0">{link.icon}</span>
                    <div className="min-w-0">
                      <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                        {link.label}
                      </div>
                      <p className="text-sm text-slate-400 mt-0.5">{link.description}</p>
                    </div>
                  </Cmp>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
