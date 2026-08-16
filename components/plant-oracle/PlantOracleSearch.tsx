'use client';

import { useState, useCallback } from 'react';

/**
 * Client search island for the Plant & Equipment Oracle.
 *
 * Kept deliberately small: the page around it is server-rendered so crawlers
 * and a technician on a bad connection both get the coverage table, the engine
 * plate guidance and the brand list without waiting for JavaScript. This
 * component only adds the interactive lookup on top.
 *
 * An empty result is an honest answer here, not a failure state — it means we
 * hold no verified record for that code, and it says exactly that rather than
 * offering the nearest thing it can find.
 */

interface Hit {
  code: string;
  brand: string;
  model: string;
  description: string;
  causes: string[];
  remedies: string[];
}

export default function PlantOracleSearch({ brands }: { brands: string[] }) {
  const [spn, setSpn] = useState('');
  const [fmi, setFmi] = useState('');
  const [decoded, setDecoded] = useState<{ ok: boolean; reading?: string; note?: string; spn?: { name: string }; fmi?: { plain: string } } | null>(null);
  const [decoding, setDecoding] = useState(false);
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [classification, setClassification] = useState<
    { label: string; brands: string[]; meaning: string; detail?: string } | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const run = useCallback(async () => {
    if (!q.trim() && !brand) return;
    setLoading(true);
    setErr('');
    try {
      const p = new URLSearchParams();
      if (q.trim()) p.set('q', q.trim());
      if (brand) p.set('brand', brand);
      const r = await fetch(`/api/plant-oracle/search?${p.toString()}`);
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || 'search failed');
      setHits(j.results as Hit[]);
      setClassification(j.classification ?? null);
    } catch {
      setErr('Search could not run just now. Try again, or call +254 768 860 665 and describe the fault.');
      setHits(null);
      setClassification(null);
    } finally {
      setLoading(false);
    }
  }, [q, brand]);

  const decode = useCallback(async () => {
    if (!spn.trim() || !fmi.trim()) return;
    setDecoding(true);
    setDecoded(null);
    try {
      const r = await fetch(`/api/plant-oracle/search?spn=${encodeURIComponent(spn.trim())}&fmi=${encodeURIComponent(fmi.trim())}`);
      const j = await r.json();
      setDecoded(j.decoded ?? null);
    } catch {
      setDecoded({ ok: false, note: 'Could not decode just now. Call +254 768 860 665 and read us the code.' });
    } finally {
      setDecoding(false);
    }
  }, [spn, fmi]);

  return (
    <div className="rounded-2xl border border-amber-500/20 bg-white/5 p-6 md:p-8">
      <form
        onSubmit={(e) => { e.preventDefault(); run(); }}
        className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
      >
        <label className="sr-only" htmlFor="plant-q">Fault code or symptom</label>
        <input
          id="plant-q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Fault code from the display, e.g. 1011 — or a symptom"
          className="w-full rounded-lg bg-black/30 border border-white/15 px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
        />
        <label className="sr-only" htmlFor="plant-brand">Engine brand</label>
        <select
          id="plant-brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="rounded-lg bg-black/30 border border-white/15 px-4 py-3 text-white focus:border-amber-400 focus:outline-none"
        >
          <option value="">Any engine brand</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? 'Searching…' : 'Look up'}
        </button>
      </form>

      {err && <p className="mt-4 text-red-300">{err}</p>}

      {hits !== null && !err && (
        <div className="mt-6">
          {hits.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-black/20 p-5">
              {/*
                A structural classification is shown ABOVE the "we don't hold
                it" message and visually separated, because it is a different
                kind of statement: what the code's shape proves, not what our
                table says. It must never read as a verified answer.
              */}
              {classification && (
                <div className="mb-4 rounded-md border border-amber-400/30 bg-amber-400/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-amber-300/80 mb-1">
                    Recognised format — not a verified entry
                  </p>
                  <p className="text-white font-semibold mb-1">{classification.label}</p>
                  <p className="text-sm text-gray-300 mb-2">{classification.meaning}</p>
                  {classification.detail && (
                    <p className="text-sm text-amber-200/90">{classification.detail}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Used by {classification.brands.join(', ')}.
                  </p>
                </div>
              )}
              <p className="text-white font-semibold mb-2">No verified record for that.</p>
              <p className="text-gray-400">
                We hold 2,155 checked fault codes across 11 engine brands, and this
                is not one of them — so rather than show you the closest guess, we
                are telling you we do not have it. Read the engine data plate and
                try the engine brand and code together, or call{' '}
                <a href="tel:+254768860665" className="text-amber-300">+254&nbsp;768&nbsp;860&nbsp;665</a>{' '}
                and describe what the machine is doing.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-400 mb-3">
                {hits.length} verified {hits.length === 1 ? 'record' : 'records'}
              </p>
              <ul className="grid gap-3">
                {hits.map((h, i) => (
                  <li key={`${h.brand}-${h.model}-${h.code}-${i}`} className="rounded-lg border border-white/10 bg-black/20 p-5">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                      <span className="font-mono text-lg font-bold text-amber-300">{h.code}</span>
                      <span className="text-sm text-gray-400">{h.brand} {h.model}</span>
                    </div>
                    <p className="text-white font-semibold mb-2">{h.description}</p>
                    {h.causes.length > 0 && (
                      <p className="text-sm text-gray-400 mb-2">
                        <span className="text-gray-500">Likely cause: </span>
                        {h.causes.join('; ')}
                      </p>
                    )}
                    {h.remedies.length > 0 ? (
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-500">Check: </span>
                        {h.remedies.join('; ')}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">
                        No remedy recorded for this code — the code, brand and
                        description are verified, the fix is not. We will not
                        invent one.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}

      {/* ---- J1939 decoder: how John Deere, JCB, Komatsu and Doosan are served ---- */}
      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-1">
          Machine showing an SPN and FMI instead?
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          J1939 is an SAE standard, so an SPN/FMI pair means the same thing on a
          John Deere, JCB, Komatsu, Doosan or Volvo as on any other engine — even
          though we hold no manufacturer table for those makes.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); decode(); }}
          className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"
        >
          <label className="sr-only" htmlFor="j-spn">SPN</label>
          <input
            id="j-spn" inputMode="numeric" value={spn}
            onChange={(e) => setSpn(e.target.value)}
            placeholder="SPN, e.g. 100"
            className="w-full rounded-lg bg-black/30 border border-white/15 px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
          />
          <label className="sr-only" htmlFor="j-fmi">FMI</label>
          <input
            id="j-fmi" inputMode="numeric" value={fmi}
            onChange={(e) => setFmi(e.target.value)}
            placeholder="FMI, e.g. 3"
            className="w-full rounded-lg bg-black/30 border border-white/15 px-4 py-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
          />
          <button
            type="submit" disabled={decoding}
            className="rounded-lg border border-amber-400/60 px-6 py-3 font-bold text-amber-300 hover:bg-amber-400/10 disabled:opacity-60"
          >
            {decoding ? 'Decoding…' : 'Decode'}
          </button>
        </form>

        {decoded && (
          <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-5">
            {decoded.ok ? (
              <>
                <p className="text-white font-semibold mb-2">{decoded.reading}</p>
                {decoded.fmi?.plain && <p className="text-sm text-gray-400">{decoded.fmi.plain}</p>}
              </>
            ) : (
              <p className="text-gray-300">{decoded.note}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
