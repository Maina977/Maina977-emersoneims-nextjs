'use client';

/**
 * ServiceBiblePanel — renders the full per-service technical reference:
 * deep introduction, top 10 brands, install phases, parts manual, repair
 * manual, error-code library, ROI scenarios, warranty options, quality
 * controls, fast-repair callouts, references, and embedded SVG diagrams.
 *
 * Includes an in-page "Google" — a single search box that filters every
 * section live so an engineer can find any keyword across the whole bible
 * in one place.
 */

import { useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { ServiceBible } from '@/lib/services/serviceBibles';

const BibleDiagram = dynamic(() => import('./BibleDiagrams'), { ssr: false });

interface Props {
  bible: ServiceBible;
  contactPhoneDisplay: string;
  contactWhatsappUrl: string;
}

const SEVERITY: Record<string, string> = {
  low: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  medium: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  high: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  critical: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const PRIORITY: Record<string, string> = {
  routine: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  urgent: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  emergency: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const TIER: Record<string, string> = {
  premium: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  mid: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  value: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
};

function matches(query: string, ...fields: (string | string[] | undefined)[]): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return fields.some(f => {
    if (!f) return false;
    if (Array.isArray(f)) return f.some(s => s.toLowerCase().includes(q));
    return f.toLowerCase().includes(q);
  });
}

export default function ServiceBiblePanel({ bible, contactPhoneDisplay, contactWhatsappUrl }: Props) {
  const [query, setQuery] = useState('');
  const [openSection, setOpenSection] = useState<string>('intro');

  const filtered = useMemo(() => ({
    intro: bible.intro.filter(p => matches(query, p)),
    brands: bible.topBrands.filter(b => matches(query, b.name, b.origin, b.capability, b.notes, b.bestFor, b.warranty)),
    phases: bible.installPhases.filter(p => matches(query, p.phase, p.goal, p.checklist)),
    parts: bible.partsManual
      .map(g => ({ ...g, items: g.items.filter(i => matches(query, i.name, i.note, i.interval, g.group)) }))
      .filter(g => g.items.length > 0),
    repairs: bible.repairManual.filter(r => matches(query, r.fault, r.steps, r.warning)),
    errors: bible.errorCodes.filter(e => matches(query, e.code, e.family, e.meaning, e.fix)),
    roi: bible.roi.filter(r => matches(query, r.scenario, r.capex, r.annualSaving, r.payback, r.notes)),
    warranty: bible.warrantyOptions.filter(w => matches(query, w)),
    quality: bible.qualityChecks.filter(q2 => matches(query, q2)),
    fast: bible.fastRepairCallouts.filter(f => matches(query, f)),
    refs: bible.references.filter(r => matches(query, r)),
  }), [bible, query]);

  const totalHits =
    filtered.intro.length + filtered.brands.length + filtered.phases.length +
    filtered.parts.reduce((a, g) => a + g.items.length, 0) +
    filtered.repairs.length + filtered.errors.length + filtered.roi.length +
    filtered.warranty.length + filtered.quality.length + filtered.fast.length + filtered.refs.length;

  const sections: { id: string; label: string; count: number }[] = [
    { id: 'intro', label: 'Engineering Brief', count: filtered.intro.length },
    { id: 'brands', label: 'Top 10 Brands', count: filtered.brands.length },
    { id: 'diagrams', label: 'Diagrams', count: bible.diagrams.length },
    { id: 'install', label: 'Installation Guide', count: filtered.phases.length },
    { id: 'parts', label: 'Parts Manual', count: filtered.parts.reduce((a, g) => a + g.items.length, 0) },
    { id: 'repair', label: 'Repair Manual', count: filtered.repairs.length },
    { id: 'errors', label: 'Error Codes', count: filtered.errors.length },
    { id: 'roi', label: 'ROI & Cost', count: filtered.roi.length },
    { id: 'quality', label: 'Quality & Warranty', count: filtered.warranty.length + filtered.quality.length },
    { id: 'fast', label: 'Fast Repairs', count: filtered.fast.length },
    { id: 'refs', label: 'References', count: filtered.refs.length },
  ];

  return (
    <section id="bible" className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <span>📖</span> TECHNICAL BIBLE
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">{bible.hero.headline}</h2>
          <p className="mt-2 text-slate-300 max-w-3xl">{bible.hero.subhead}</p>
        </div>

        {/* In-page Google */}
        <div className="mb-6 sticky top-16 z-30 bg-slate-950/85 backdrop-blur-md py-3 border-y border-slate-800">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            <div className="relative flex-1">
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search this bible — error code, brand, fault, part, formula…"
                className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                aria-label="Search the bible"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
            </div>
            <div className="text-sm text-slate-400 whitespace-nowrap">
              {query ? <span className="text-cyan-300">{totalHits}</span> : <span>{totalHits}</span>} results
            </div>
          </div>
        </div>

        {/* Section nav */}
        <nav className="mb-8 flex flex-wrap gap-2" aria-label="Bible sections">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setOpenSection(s.id);
                document.getElementById(`bible-${s.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className={`px-3 py-1.5 rounded-md text-sm border transition-colors ${
                openSection === s.id
                  ? 'bg-cyan-500/20 text-cyan-200 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
              }`}
            >
              {s.label}
              <span className="ml-2 text-xs text-slate-500">{s.count}</span>
            </button>
          ))}
        </nav>

        {/* Engineering Brief */}
        {filtered.intro.length > 0 && (
          <section id="bible-intro" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Engineering Brief</h3>
            <div className="space-y-4 text-slate-300 leading-relaxed">
              {filtered.intro.map((p, i) => (
                <p key={i} className="text-[15px]">{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* Brands */}
        {filtered.brands.length > 0 && (
          <section id="bible-brands" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Top 10 Brands & Capabilities</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.brands.map((b, i) => (
                <article key={i} className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
                  <header className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{b.name}</h4>
                      <p className="text-xs text-slate-400">
                        {b.origin}{b.founded ? ` · est. ${b.founded}` : ''}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-semibold border ${TIER[b.tier]}`}>
                      {b.tier.toUpperCase()}
                    </span>
                  </header>
                  <p className="text-sm text-slate-300 mb-3">{b.capability}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {b.bestFor.map((u, j) => (
                      <span key={j} className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {u}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div><span className="text-slate-500">Warranty:</span> {b.warranty}</div>
                    <div><span className="text-slate-500">Notes:</span> {b.notes}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Diagrams */}
        {bible.diagrams.length > 0 && (
          <section id="bible-diagrams" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Schematics & Diagrams</h3>
            <div className="grid md:grid-cols-2 gap-5">
              {bible.diagrams.map(id => (
                <BibleDiagram key={id} id={id} />
              ))}
            </div>
          </section>
        )}

        {/* Install */}
        {filtered.phases.length > 0 && (
          <section id="bible-install" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Installation Guide</h3>
            <ol className="space-y-3">
              {filtered.phases.map((p, i) => (
                <li key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                  <div className="flex items-baseline gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-cyan-300">{p.phase}</h4>
                  </div>
                  <p className="text-sm text-slate-300 mb-3">{p.goal}</p>
                  <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-slate-300">
                    {p.checklist.map((c, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* Parts Manual */}
        {filtered.parts.length > 0 && (
          <section id="bible-parts" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Parts Manual & Service Intervals</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.parts.map((g, i) => (
                <div key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                  <h4 className="text-base font-semibold text-amber-300 mb-3">{g.group}</h4>
                  <ul className="space-y-2">
                    {g.items.map((it, j) => (
                      <li key={j} className="text-sm">
                        <div className="text-slate-200 font-medium">{it.name}</div>
                        {it.interval && <div className="text-xs text-slate-400">Interval: {it.interval}</div>}
                        {it.note && <div className="text-xs text-slate-500">{it.note}</div>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Repair Manual */}
        {filtered.repairs.length > 0 && (
          <section id="bible-repair" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Repair Manual</h3>
            <div className="space-y-3">
              {filtered.repairs.map((r, i) => (
                <details key={i} className="rounded-xl border border-slate-700 bg-slate-900/50 group" open={!!query}>
                  <summary className="cursor-pointer p-4 flex items-center justify-between gap-3 list-none">
                    <span className="font-medium text-white">{r.fault}</span>
                    <span className={`px-2 py-1 rounded text-[10px] font-semibold border ${PRIORITY[r.priority]}`}>
                      {r.priority.toUpperCase()}
                    </span>
                  </summary>
                  <div className="px-4 pb-4 space-y-2">
                    <ol className="list-decimal list-inside space-y-1 text-sm text-slate-300">
                      {r.steps.map((s, j) => <li key={j}>{s}</li>)}
                    </ol>
                    {r.warning && (
                      <div className="mt-2 p-3 rounded border border-red-500/30 bg-red-500/5 text-sm text-red-300">
                        <strong>Warning:</strong> {r.warning}
                      </div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Error Codes */}
        {filtered.errors.length > 0 && (
          <section id="bible-errors" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">Error Codes — Decode & Fix</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-slate-400 text-left">
                  <tr>
                    <th className="px-3 py-2">Code</th>
                    <th className="px-3 py-2">Family</th>
                    <th className="px-3 py-2">Meaning</th>
                    <th className="px-3 py-2">Severity</th>
                    <th className="px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.errors.map((e, i) => (
                    <tr key={i} className="bg-slate-900/40 align-top">
                      <td className="px-3 py-3 font-mono text-cyan-300 whitespace-nowrap">{e.code}</td>
                      <td className="px-3 py-3 text-slate-400">{e.family}</td>
                      <td className="px-3 py-3 text-slate-200">{e.meaning}</td>
                      <td className="px-3 py-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-semibold border ${SEVERITY[e.severity]}`}>
                          {e.severity.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-slate-300">
                        <ul className="list-disc list-inside space-y-0.5">
                          {e.fix.map((f, j) => <li key={j}>{f}</li>)}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ROI */}
        {filtered.roi.length > 0 && (
          <section id="bible-roi" className="mb-14 scroll-mt-32">
            <h3 className="text-2xl font-bold text-white mb-4">ROI & Cost Scenarios</h3>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-900 text-slate-400 text-left">
                  <tr>
                    <th className="px-3 py-2">Scenario</th>
                    <th className="px-3 py-2">CapEx</th>
                    <th className="px-3 py-2">Annual saving</th>
                    <th className="px-3 py-2">Payback</th>
                    <th className="px-3 py-2">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered.roi.map((r, i) => (
                    <tr key={i} className="bg-slate-900/40 align-top">
                      <td className="px-3 py-3 text-slate-200">{r.scenario}</td>
                      <td className="px-3 py-3 text-slate-300 whitespace-nowrap">{r.capex}</td>
                      <td className="px-3 py-3 text-emerald-300 whitespace-nowrap">{r.annualSaving}</td>
                      <td className="px-3 py-3 text-cyan-300 whitespace-nowrap">{r.payback}</td>
                      <td className="px-3 py-3 text-slate-400">{r.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Warranty + Quality */}
        {(filtered.warranty.length > 0 || filtered.quality.length > 0) && (
          <section id="bible-quality" className="mb-14 scroll-mt-32 grid md:grid-cols-2 gap-5">
            {filtered.warranty.length > 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                <h3 className="text-xl font-bold text-white mb-3">Warranty Options</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {filtered.warranty.map((w, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">✓</span><span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {filtered.quality.length > 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-5">
                <h3 className="text-xl font-bold text-white mb-3">Quality Checks</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  {filtered.quality.map((q, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">▸</span><span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Fast repair */}
        {filtered.fast.length > 0 && (
          <section id="bible-fast" className="mb-14 scroll-mt-32">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
              <h3 className="text-xl font-bold text-amber-300 mb-3">Fast Repair Capabilities</h3>
              <ul className="grid sm:grid-cols-2 gap-2 text-sm text-slate-300">
                {filtered.fast.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-300 mt-0.5">⚡</span><span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`tel:${contactPhoneDisplay.replace(/\s+/g, '')}`}
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
                >
                  📞 Call {contactPhoneDisplay}
                </a>
                <a
                  href={contactWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition"
                >
                  💬 WhatsApp
                </a>
              </div>
            </div>
          </section>
        )}

        {/* References */}
        {filtered.refs.length > 0 && (
          <section id="bible-refs" className="mb-4 scroll-mt-32">
            <h3 className="text-xl font-bold text-white mb-3">Standards & References</h3>
            <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
              {filtered.refs.map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
