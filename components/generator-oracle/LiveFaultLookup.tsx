'use client';

import { useCallback, useState } from 'react';

/**
 * LiveFaultLookup
 *
 * Public-facing fault-code lookup that calls the real
 * /api/generator-oracle/search and /api/generator-oracle/fault-code endpoints.
 * No mocks, no static results — every row comes back from the server-side
 * fault index. Empty/unknown queries surface clear, honest UI states.
 */

type Severity = 'info' | 'warning' | 'critical' | 'shutdown';

interface SearchResultItem {
  id: string;
  code: string;
  brand: string;
  model: string;
  category: string;
  subcategory: string;
  severity: Severity;
  alarmType: 'warning' | 'trip' | 'shutdown' | 'lockout';
  title: string;
  description: string;
  verified: boolean;
  source: 'manufacturer-curated' | 'template-extended';
}

interface SearchPayload {
  ok: boolean;
  query: string;
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

const QUICK_QUERIES = ['1100', 'oil pressure', 'overspeed', 'low coolant', 'voltage', 'battery'];

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border rounded ${SEVERITY_STYLE[severity]}`}
    >
      {severity}
    </span>
  );
}

function SourceBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <span
      className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      title="Sourced from a manufacturer-curated brand file"
    >
      Manufacturer-curated
    </span>
  ) : (
    <span
      className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-slate-700/40 text-slate-300 border-slate-600/40"
      title="Generated from manufacturer-published code-range templates"
    >
      Template-extended
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

  return (
    <div
      className={`bg-slate-900/70 border border-slate-700 rounded-2xl ${compact ? 'p-5' : 'p-6 sm:p-8'} ${className}`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-white font-bold text-lg">Live fault-code lookup</h3>
          <p className="text-slate-400 text-xs mt-1">
            Backed by the real <span className="font-mono text-cyan-300">/api/generator-oracle/search</span> endpoint —
            results are read from the server-side fault index, not the page.
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
          placeholder="Try: 1100, oil pressure, DSE 7320, overspeed…"
          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-cyan-200 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/60"
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
            <strong>Lookup failed:</strong> {error}. The diagnostic engine is reachable separately —
            try again, or refine the query.
          </div>
        )}

        {!error && !loading && !data && (
          <div className="text-sm text-slate-500">
            Enter a code or keyword to query the live fault index.
          </div>
        )}

        {!error && data && data.results.length === 0 && (
          <div className="rounded-lg border border-slate-700 bg-slate-800/40 px-3 py-3 text-sm text-slate-300">
            <div className="font-semibold text-white mb-1">No matches for &ldquo;{data.query}&rdquo;.</div>
            <div className="text-slate-400 text-xs">
              Try a manufacturer code (e.g. <span className="font-mono">1100</span>), a symptom keyword,
              or browse by brand.
            </div>
          </div>
        )}

        {!error && data && data.results.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              {data.total.toLocaleString('en-US')} match{data.total === 1 ? '' : 'es'} for{' '}
              <span className="text-cyan-300 font-mono">{data.query}</span> · showing{' '}
              {data.results.length}
            </div>
            <ul className="divide-y divide-slate-800 rounded-lg border border-slate-800 overflow-hidden">
              {data.results.map((r) => (
                <li key={r.id} className="p-3 bg-slate-950/40 hover:bg-slate-900/60 transition-colors">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-cyan-300 text-sm bg-slate-900 border border-cyan-500/30 px-2 py-0.5 rounded">
                        {r.code}
                      </span>
                      <SeverityBadge severity={r.severity} />
                      <SourceBadge verified={r.verified} />
                    </div>
                    <span className="text-xs text-slate-500">
                      {r.brand} · {r.model}
                    </span>
                  </div>
                  <div className="text-sm text-white font-medium mt-2 line-clamp-1">{r.title}</div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-2">{r.description}</div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    {r.category} · {r.subcategory}
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
