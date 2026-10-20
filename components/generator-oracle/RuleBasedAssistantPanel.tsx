'use client';

/**
 * RULE-BASED ENGINEERING ASSISTANT PANEL
 *
 * This component is the deterministic, non-generative engineering assistant
 * that powers Generator Oracle's AI surfaces (Expert Chat, Visual Diagnostic,
 * AI Analysis) when the local Ollama / Gemini AI stack is not configured for
 * the deployment.
 *
 * It is NOT generative AI. It does not hallucinate. Every response is
 * sourced from one of:
 *   - the published Repair Centre guides and our hand-written controller alarm
 *     descriptions (POST /api/generator-oracle/diagnose)
 *   - the typed fault-code lookup index (GET /api/generator-oracle/fault-code)
 *   - the asset card the user supplied
 *   - deterministic threshold rules in `ai-diagnostic-engine.ts`
 *
 * The output is always labelled "Rule-Based Engineering Guidance" so the
 * technician is never misled into thinking it is a generative model.
 *
 * @copyright 2026 EmersonEIMS / Generator Oracle
 */

import React, { useCallback, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  diagnoseSymptoms,
  lookupFaultCode,
  codeLabel,
  modelsLabel,
  type RankedFault,
  type RankedGuide,
  type FaultLookupResponse,
  OracleApiError,
} from '@/lib/generator-oracle/client/oracleClient';
import type { AssetCardValue } from '@/components/generator-oracle/AssetCardGate';
import { waLink, COMPANY_PHONE_DISPLAY, COMPANY_PHONE_TEL } from '@/lib/serviceConnect/actions';

export type RuleBasedMode = 'chat' | 'visual' | 'analysis';

export interface RuleBasedAssistantPanelProps {
  /** Drives header copy + the surfaced inputs. All modes share the engine. */
  mode: RuleBasedMode;
  /** Current asset card from the surrounding AssetCardGate. */
  card?: AssetCardValue;
  className?: string;
}

const MODE_HEADERS: Record<RuleBasedMode, { title: string; subtitle: string; emoji: string }> = {
  chat: {
    title: 'Expert Engineering Assistant — Rule-Based',
    subtitle:
      'Describe the symptoms and get the matching diagnostic guides and controller alarms from our library. Deterministic. No generative AI.',
    emoji: '🛠️',
  },
  visual: {
    title: 'Visual Symptom Triage — Rule-Based',
    subtitle:
      'Photo-based AI vision is not enabled on this deployment. Use this structured triage to capture what you see and surface the matching documented faults. Deterministic. No generative AI.',
    emoji: '🔍',
  },
  analysis: {
    title: 'Cross-Parameter Engineering Analysis — Rule-Based',
    subtitle:
      'Ranked diagnosis from our diagnostic guides and controller alarm library. Deterministic. No generative AI.',
    emoji: '🧪',
  },
};

const VISUAL_CHECKLIST: { id: string; label: string; mapsTo: string }[] = [
  { id: 'leak-fluid', label: 'Visible fluid leak (oil / coolant / fuel)', mapsTo: 'leak fluid drip stain' },
  { id: 'smoke', label: 'Smoke from exhaust or engine bay', mapsTo: 'smoke exhaust black white blue' },
  { id: 'corrosion', label: 'Battery / terminal corrosion', mapsTo: 'battery terminal corrosion' },
  { id: 'belt', label: 'Belt cracked / glazed / loose', mapsTo: 'belt cracked glazed slipping' },
  { id: 'wiring-damage', label: 'Wiring chafed, burnt or disconnected', mapsTo: 'wiring harness burnt chafed' },
  { id: 'fault-display', label: 'Fault code on controller display', mapsTo: 'controller fault code alarm display' },
  { id: 'overheat-signs', label: 'Discoloration / heat damage on component', mapsTo: 'overheat discoloration heat damage' },
  { id: 'hose-damage', label: 'Hose swollen, cracked, or weeping', mapsTo: 'hose cracked swollen weeping' },
];

const SEVERITY_COLOR: Record<string, string> = {
  shutdown: 'text-red-300 border-red-500/50 bg-red-500/10',
  critical: 'text-red-300 border-red-500/50 bg-red-500/10',
  warning: 'text-amber-300 border-amber-500/40 bg-amber-500/10',
  info: 'text-cyan-300 border-cyan-500/40 bg-cyan-500/10',
};

export default function RuleBasedAssistantPanel({
  mode,
  card,
  className = '',
}: RuleBasedAssistantPanelProps) {
  const header = MODE_HEADERS[mode];

  const [symptoms, setSymptoms] = useState('');
  const [faultCode, setFaultCode] = useState('');
  const [ranked, setRanked] = useState<RankedFault[] | null>(null);
  const [guides, setGuides] = useState<RankedGuide[]>([]);
  const [lookup, setLookup] = useState<FaultLookupResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const runDiagnose = useCallback(
    async (symptomList: string[], alarmText?: string) => {
      setBusy(true);
      setError(null);
      setRanked(null);
      setGuides([]);
      try {
        const res = await diagnoseSymptoms({
          symptoms: symptomList,
          alarmText,
          brand: card?.make,
          model: card?.controller,
          topN: 10,
        });
        setRanked(res.ranked);
        setGuides(res.guides ?? []);
      } catch (e) {
        const msg =
          e instanceof OracleApiError
            ? `${e.message} (HTTP ${e.status})`
            : e instanceof Error
              ? e.message
              : 'Diagnose request failed.';
        setError(msg);
      } finally {
        setBusy(false);
      }
    },
    [card?.make, card?.controller],
  );

  const onChatDiagnose = useCallback(() => {
    const list = symptoms
      .split(/[\n,;]+/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (list.length === 0 && !symptoms.trim()) return;
    void runDiagnose(list.length ? list : [symptoms.trim()], symptoms.trim());
  }, [symptoms, runDiagnose]);

  const onVisualTriage = useCallback(() => {
    const list = VISUAL_CHECKLIST.filter((c) => checked.has(c.id)).map((c) => c.mapsTo);
    if (list.length === 0) return;
    void runDiagnose(list);
  }, [checked, runDiagnose]);

  const onLookupCode = useCallback(async () => {
    const code = faultCode.trim();
    if (!code) return;
    setBusy(true);
    setError(null);
    setLookup(null);
    try {
      const res = await lookupFaultCode(code, card?.make);
      setLookup(res);
    } catch (e) {
      const msg =
        e instanceof OracleApiError
          ? `${e.message} (HTTP ${e.status})`
          : e instanceof Error
            ? e.message
            : 'Fault code lookup failed.';
      setError(msg);
    } finally {
      setBusy(false);
    }
  }, [faultCode, card?.make]);

  const toggleCheck = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div
      className={`flex flex-col h-full p-6 ${className}`}
      role="region"
      aria-label="Rule-based engineering assistant"
      data-testid="rule-based-assistant"
    >
      {/* Mode banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-5"
      >
        <div className="flex items-start gap-3">
          <div className="text-3xl" aria-hidden>
            {header.emoji}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold text-emerald-200">{header.title}</h2>
            <p className="text-sm text-slate-300 mt-1 leading-relaxed">{header.subtitle}</p>
            <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Deterministic engineering guidance · No generative AI
            </p>
          </div>
        </div>
      </motion.div>

      {/* Asset card summary */}
      {card && (
        <div className="mb-5 grid grid-cols-2 sm:grid-cols-5 gap-2 rounded-lg border border-slate-700/60 bg-slate-900/40 p-3 text-xs">
          <Field label="Make" value={card.make} />
          <Field label="Model" value={card.model} />
          <Field label="Controller" value={card.controller} />
          <Field label="Serial" value={card.serial} />
          <Field label="Firmware" value={card.firmware} />
        </div>
      )}

      {/* Mode-specific input */}
      {mode === 'chat' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200" htmlFor="rb-symptoms">
            Describe symptoms or paste an alarm message
          </label>
          <textarea
            id="rb-symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. won't crank, low oil pressure shutdown after 30s, exhaust temp climbing"
            className="w-full min-h-[88px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onChatDiagnose}
            disabled={busy || symptoms.trim().length === 0}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Diagnosing…' : 'Run rule-based diagnosis'}
          </button>
        </div>
      )}

      {mode === 'visual' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200">
            Tick every visible symptom you can confirm on the unit
          </label>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {VISUAL_CHECKLIST.map((c) => (
              <li key={c.id}>
                <label className="flex items-start gap-2 rounded-lg border border-slate-700 bg-slate-900/50 p-3 cursor-pointer hover:border-emerald-500/50">
                  <input
                    type="checkbox"
                    checked={checked.has(c.id)}
                    onChange={() => toggleCheck(c.id)}
                    className="mt-0.5 h-4 w-4 accent-emerald-500"
                  />
                  <span className="text-sm text-slate-200">{c.label}</span>
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onVisualTriage}
            disabled={busy || checked.size === 0}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Matching…' : 'Find matching documented faults'}
          </button>
        </div>
      )}

      {mode === 'analysis' && (
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-200" htmlFor="rb-analysis-symptoms">
            Enter symptoms / readings notes / alarm text
          </label>
          <textarea
            id="rb-analysis-symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="e.g. coolant 105C and rising, low load, no overheat alarm yet, RPM stable"
            className="w-full min-h-[88px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onChatDiagnose}
            disabled={busy || symptoms.trim().length === 0}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Analysing…' : 'Run rule-based engineering analysis'}
          </button>
        </div>
      )}

      {/* Fault code lookup (all modes) */}
      <div className="mt-6 space-y-2">
        <label className="block text-sm font-semibold text-slate-200" htmlFor="rb-faultcode">
          Or look up a specific fault code
        </label>
        <div className="flex gap-2">
          <input
            id="rb-faultcode"
            value={faultCode}
            onChange={(e) => setFaultCode(e.target.value)}
            placeholder="e.g. SPN 100 FMI 1, 110-0, low oil pressure"
            className="flex-1 rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onLookupCode}
            disabled={busy || faultCode.trim().length === 0}
            className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-bold text-white hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Look up
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200"
        >
          {error}
        </div>
      )}

      {/* Diagnostic guides — the primary answer for mechanical symptoms */}
      {ranked && guides.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-300 mb-2">
            Start here: diagnostic guides for these symptoms
          </h3>
          <ul className="space-y-2">
            {guides.map((g) => (
              <li key={g.url} className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-3">
                <Link href={g.url} className="font-semibold text-sm text-emerald-200 hover:text-emerald-100 underline-offset-2 hover:underline">
                  {g.title} →
                </Link>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{g.summary}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ranked controller alarms */}
      {ranked && (
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-300 mb-2">
            {ranked.length > 0 ? `Related controller alarms (${ranked.length})` : 'Related controller alarms'}
          </h3>
          {ranked.length === 0 ? (
            <p className="text-sm text-slate-400">
              No controller alarm in our library matches these symptoms.
              {guides.length > 0 ? ' Use the guides above.' : ' Try describing what the generator does in different words, or ask an engineer below.'}
            </p>
          ) : (
            <ul className="space-y-2">
              {ranked.map((r) => (
                <li
                  key={r.id}
                  className={`rounded-lg border p-3 ${SEVERITY_COLOR[r.severity] ?? 'border-slate-700 text-slate-200'}`}
                >
                  <div className="flex items-baseline justify-between gap-2 flex-wrap">
                    <div className="font-semibold text-sm">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900/60 mr-2">
                        {r.brand} · {modelsLabel(r)}
                      </span>
                      {r.title}
                      <span className="ml-2 font-mono text-xs opacity-70" title={r.codeKind === 'reference' ? 'Our reference number. This controller shows the alarm as text, so match it by name.' : undefined}>
                        {codeLabel(r)}
                      </span>
                    </div>
                    <div className="text-xs uppercase tracking-wide opacity-80">
                      {r.severity}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{r.description}</p>
                  {r.matchedTerms.length > 0 && (
                    <p className="text-xs mt-1 text-slate-400">
                      Matched: {r.matchedTerms.join(', ')}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Lookup result */}
      {lookup && (
        <div className="mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-300 mb-2">
            Fault code lookup — {lookup.code}
          </h3>
          {!lookup.found ? (
            <p className="text-sm text-slate-400">
              This code is not in our library. Check it against the engine or controller
              service manual, or send it to one of our engineers below.
            </p>
          ) : (
            <div className="space-y-2">
              {lookup.exactMatches.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className={`rounded-lg border p-3 ${SEVERITY_COLOR[m.severity] ?? 'border-slate-700 text-slate-200'}`}
                >
                  <div className="font-semibold text-sm">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-900/60 mr-2">
                      {m.brand} · {modelsLabel(m)}
                    </span>
                    {codeLabel(m)} — {m.title}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{m.description}</p>
                </div>
              ))}
              {lookup.partialMatches.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="rounded-lg border border-slate-700 bg-slate-900/40 p-3"
                >
                  <div className="font-semibold text-sm text-slate-200">
                    <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 mr-2">
                      {p.brand} · {modelsLabel(p)}
                    </span>
                    {codeLabel(p)} — {p.title}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Next step: a person. Carries what the user typed so they do not repeat it. */}
      {(ranked || lookup) && (
        <div className="mt-6 rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
          <p className="text-sm text-slate-200 font-semibold">Want an engineer to look at this?</p>
          <p className="text-xs text-slate-400 mt-1">
            Send us what you entered and one of our engineers will help you narrow it down.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={waLink(
                `Hi EmersonEIMS, I need help with my generator.` +
                  (card?.make ? `\nMake: ${card.make}` : '') +
                  (card?.controller ? `\nController: ${card.controller}` : '') +
                  (symptoms.trim() ? `\nSymptoms: ${symptoms.trim()}` : '') +
                  (lookup ? `\nFault code: ${lookup.code}` : ''),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-500"
            >
              WhatsApp an engineer
            </a>
            <a
              href={`tel:${COMPANY_PHONE_TEL}`}
              className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800"
            >
              Call {COMPANY_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      )}

      {/* Footer disclaimer */}
      <p className="mt-6 text-xs text-slate-500 leading-relaxed">
        This assistant returns documented engineering data only. It does not generate or
        infer diagnoses. Always verify findings against the OEM service manual and the
        physical unit before acting.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="text-sm text-slate-200 truncate" title={value}>
        {value || '—'}
      </div>
    </div>
  );
}
