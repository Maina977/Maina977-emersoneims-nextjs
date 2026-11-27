'use client';

/**
 * Tender comparison side by side (register R-27, 2026-11-27). Each tenderer's
 * priced bill is loaded as a CSV (code,rate[,amount]) against this bill's
 * items and quantities; lib/qs/tenders does the arithmetic. Nothing is stored
 * on a server.
 */
import { useState } from 'react';
import { compareTenders, parseTenderCsv, TenderError, TENDERS_ENGINE_VERSION, type BillLine, type Tender } from '@/lib/qs/tenders';

const input = 'rounded bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-white';
/** File → text with FileReader (Blob.text() is missing in some browsers and test DOMs). */
function readText(f: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result ?? ''));
    r.onerror = () => reject(r.error ?? new Error('the file could not be read'));
    r.readAsText(f);
  });
}
const fmt = (x: number | null) => (x === null ? '—' : x.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));

export default function TenderComparison({ lines }: { lines: BillLine[] }) {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  let result: ReturnType<typeof compareTenders> | null = null;
  let err = '';
  if (tenders.length >= 2) {
    try { result = compareTenders(lines, tenders); } catch (e) { err = e instanceof TenderError ? e.message : String(e); }
  }
  return (
    <div className="rounded border border-slate-700 p-3 space-y-2 text-xs">
      <div className="text-sm font-semibold">Tender comparison</div>
      <p className="text-slate-400">Load each tenderer&rsquo;s priced bill as a CSV with columns <code>code,rate</code> (and optionally <code>amount</code>), using this bill&rsquo;s item codes. Amounts are recomputed from this bill&rsquo;s quantities; tendered amounts that disagree are flagged as arithmetic errors. Only complete tenders are ranked. Totals are before preliminaries, contingency, O&amp;P and VAT.</p>
      <div className="flex flex-wrap items-end gap-2">
        <label>Tenderer <input aria-label="Tenderer name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Contractor A" className={`${input} w-40`} /></label>
        <label className="min-w-0 max-w-full">Priced bill (.csv)
          <input type="file" accept=".csv,text/csv" aria-label="Tenderer priced bill CSV" onChange={async (e) => {
            const f = e.target.files?.[0]; e.target.value = '';
            if (!f) return;
            try {
              const t = parseTenderCsv(name || f.name.replace(/\.csv$/i, ''), await readText(f));
              if (tenders.some((x) => x.name === t.name)) throw new TenderError(`A tender named "${t.name}" is already loaded`);
              setTenders([...tenders, t]); setName(''); setMsg(`Loaded ${t.rates.size} priced item(s) for ${t.name}.`);
            } catch (x) { setMsg(x instanceof TenderError ? `Refused: ${x.message}` : `Could not read the file: ${(x as Error).message}`); }
          }} className="block text-xs" />
        </label>
        {tenders.length > 0 && <button type="button" onClick={() => { setTenders([]); setMsg(''); }} className="rounded bg-slate-700 px-2 py-1">Clear tenders</button>}
      </div>
      <p role="status" className="text-slate-300">{msg || (tenders.length < 2 ? `Load at least two tenders (${tenders.length} loaded).` : '')}</p>
      {err && <p role="alert" className="text-red-300">{err}</p>}
      {result && (
        <>
          <div className="relative overflow-x-auto" role="region" aria-label="Tender comparison table, scrolls sideways" tabIndex={0}>
            <table className="w-full min-w-[40rem]">
              <caption className="sr-only">Tender comparison by item</caption>
              <thead><tr className="text-left text-slate-400"><th scope="col">Code</th><th scope="col">Description</th><th scope="col">Unit</th><th scope="col" className="text-right">Qty</th>
                {result.tenders.map((t) => <th key={t.name} scope="col" className="text-right">{t.name}: rate / amount</th>)}<th scope="col">Lowest</th></tr></thead>
              <tbody>
                {result.rows.map((r) => (
                  <tr key={r.code} className="border-t border-slate-800">
                    <td>{r.code}</td><td>{r.description}</td><td>{r.unit}</td><td className="text-right">{r.quantity}</td>
                    {r.cells.map((c, i) => (
                      <td key={i} className={`text-right ${c.arithmeticError ? 'text-amber-300' : ''}`} title={c.arithmeticError ? `Tendered amount ${fmt(c.tenderedAmount)} ≠ quantity × rate ${fmt(c.amount)}` : undefined}>
                        {c.rate === null ? <span className="text-red-300">not priced</span> : <>{fmt(c.rate)} / {fmt(c.amount)}{c.arithmeticError ? ` (tendered ${fmt(c.tenderedAmount)})` : ''}</>}
                      </td>
                    ))}
                    <td>{r.lowest.join(', ')}</td>
                  </tr>
                ))}
                <tr className="border-t border-slate-600 font-semibold"><td colSpan={4}>Total of measured items compared</td>
                  {result.tenders.map((t) => <td key={t.name} className="text-right">{fmt(t.total)}{t.complete ? '' : ' (incomplete)'}</td>)}<td /></tr>
              </tbody>
            </table>
          </div>
          <ul className="space-y-0.5 text-slate-300">
            {result.tenders.map((t) => (
              <li key={t.name}>{t.name}: {t.complete ? `rank ${t.rank}${t.overLowestPct ? `, ${t.overLowestPct} % above the lowest` : ' (lowest)'}` : `not ranked — ${t.notPriced.length} item(s) not priced (${t.notPriced.join(', ')})`}
                {t.arithmeticErrors.length ? `; arithmetic errors in ${t.arithmeticErrors.join(', ')}` : ''}{t.extraItems.length ? `; items not in this bill ignored: ${t.extraItems.join(', ')}` : ''}</li>
            ))}
          </ul>
          <p className="text-slate-500">{result.basis} · {TENDERS_ENGINE_VERSION}</p>
        </>
      )}
    </div>
  );
}
