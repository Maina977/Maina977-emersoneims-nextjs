'use client';

import { useCallback, useState } from 'react';
import { codeLabel, modelsLabel, type SearchResultItem } from '@/lib/generator-oracle/client/oracleClient';
import { waLink } from '@/lib/serviceConnect/actions';

/**
 * LiveFaultLookup
 *
 * Public-facing fault-code lookup that calls the real
 * /api/generator-oracle/search endpoint.
 * No mocks, no static results — every row comes back from the server-side
 * fault index. Empty/unknown queries surface clear, honest UI states.
 *
 * Each result says what its number is: a J1939 SPN/FMI the engine reports, or
 * our reference number for a controller that shows a text alarm (codeLabel).
 */

type Severity = 'info' | 'warning' | 'critical' | 'shutdown';

interface SearchPayload {
  ok: boolean;
  query: string;
  interpretedAs?: string | null;
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  results: SearchResultItem[];
  error?: string;
}

const SEVERITY_STYLE: Record<Severity, string> = {
  info: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  critical: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  shutdown: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
};

const QUICK_QUERIES = ['SPN 100 FMI 1', 'oil pressure', 'overspeed', 'coolant', 'under voltage', 'battery'];

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded ${SEVERITY_STYLE[severity]}`}
    >
      {severity}
    </span>
  );
}

function KindBadge({ item }: { item: SearchResultItem }) {
  if (item.codeKind === 'reference') {
    return (
      <span
        className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-slate-700/40 text-slate-300 border-slate-600/40"
        title="Our reference number. This controller shows the alarm as text on its display, so match it by the alarm name."
      >
        Text alarm
      </span>
    );
  }
  return (
    <span
      className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      title="The code number the engine or controller reports"
    >
      {item.codeKind === 'j1587' ? 'J1587 code' : 'J1939 code'}
    </span>
  );
}

interface Props {
  className?: string;
  compact?: boolean;
}

export default function LiveFaultLookup({ className = '', compact = false }: Props) {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<SearchPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSearch = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setData(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/generator-oracle/search?q=${encodeURIComponent(trimmed)}&pageSize=10`,
        { cache: 'no-store' },
      );
      const json = (await res.json()) as SearchPayload;
      if (!res.ok || !json.ok) {
        setError(json.error || `Search failed (HTTP ${res.status})`);
        setData(null);
      } else {
        setData(json);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'network_error');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const askEngineer = (subject: string) => waLink(`Hi EmersonEIMS, I need help with generator fault: ${subject}`);

  return (
    <div
      className={`bg-slate-900/70 border border-slate-700 rounded-2xl ${compact ? 'p-5' : 'p-6 sm:p-8'} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Fault-code lookup</h3>
          <p className="text-slate-400 text-xs mt-1">
            Type a code as it appears on your generator (for example SPN 100 FMI 1) or the alarm wording.
            Descriptions are written by our engineers; your engine or controller manual is the final word.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          inputMode="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. SPN 110 FMI 0 or oil pressure"
          className="flex-1 min-w-0 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
          aria-label="Fault code or keyword"
          maxLength={100}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 text-sm font-semibold hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mt-3">
        {QUICK_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuery(q);
              runSearch(q);
            }}
            className="px-2.5 py-1 text-xs rounded border border-slate-700 bg-slate-800/60 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {error && (
          <div className="rounded-lg border border-rose-500/40 bg-rose-500/5 px-3 py-2 text-sm text-rose-200">
            <strong>Lookup failed:</strong> {error}. Please try again in a moment, or{' '}
            <a href={askEngineer(query.trim() || 'a fault code')} target="_blank" rel="noopener noreferrer" className="underline">
              ask an engineer on WhatsApp
            </a>.
          </div>
        )}

        {!error && !loading && !data && (
          <div className="text-sm text-slate-500">
            Enter a code or alarm wording to search the library.
          </div>
        )}

        {!error && data && data.results.length === 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-3 text-sm text-slate-300">
            <div className="font-semibold text-white mb-1">No matches for &ldquo;{data.query}&rdquo;.</div>
            <div className="text-slate-400 text-xs">
              Try the code exactly as shown on the display (e.g. <span className="font-mono">SPN 100 FMI 1</span>) or the
              alarm wording (e.g. <span className="font-mono">low oil pressure</span>).{' '}
              <a href={askEngineer(data.query)} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                Or send it to an engineer on WhatsApp
              </a>.
            </div>
          </div>
        )}

        {!error && data && data.results.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              {data.total.toLocaleString('en-US')} match{data.total === 1 ? '' : 'es'} for{' '}
              <span className="text-cyan-300 font-mono">{data.query}</span>
              {data.interpretedAs && data.interpretedAs.toUpperCase() !== data.query.toUpperCase() && (
                <>
                  {' '}(read as{' '}
                  <span className="font-mono text-cyan-300">
                    {codeLabel({ code: data.interpretedAs, codeKind: /^SPN/i.test(data.interpretedAs) ? 'j1939' : 'j1587' })}
                  </span>)
                </>
              )}{' '}
              · showing {data.results.length}
            </div>
            <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800 overflow-hidden">
              {data.results.map((r) => (
                <li key={r.id} className="p-3 bg-slate-950/40 hover:bg-slate-900/60 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-cyan-300 text-sm bg-slate-900 border border-cyan-500/30 px-2 py-0.5 rounded">
                        {codeLabel(r)}
                      </span>
                      <SeverityBadge severity={r.severity} />
                      <KindBadge item={r} />
                    </div>
                    <span className="text-xs text-slate-500">
                      {r.brand} · {modelsLabel(r)}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mt-2 line-clamp-1">{r.title}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</div>
                  <div className="text-xs text-slate-500 mt-2 flex flex-wrap items-center justify-between gap-2">
                    <span>
                      {r.category} · {r.subcategory}
                    </span>
                    <a
                      href={askEngineer(`${r.brand} ${codeLabel(r)} — ${r.title}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-semibold"
                    >
                      Ask an engineer about this →
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
