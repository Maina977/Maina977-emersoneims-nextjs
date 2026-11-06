'use client';

/**
 * Lead pipeline (master brief §10, audit §7). Reached only with the
 * admin_session cookie (middleware); data from /api/admin/leads.
 */
import { useCallback, useEffect, useState } from 'react';

type Stage = { id: string; label: string };
type Lead = {
  id: number; reference: string | null; created_at: string; name: string; phone: string | null; email: string;
  company: string | null; service: string | null; source: string | null; location: string | null;
  status: string; notes: string | null; assigned_to: string | null;
};

export default function LeadPipelinePage() {
  const [stages, setStages] = useState<Stage[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, { status: string; notes: string }>>({});

  const load = useCallback(async () => {
    setError('');
    const res = await fetch(`/api/admin/leads${filter ? `?status=${encodeURIComponent(filter)}` : ''}`, { cache: 'no-store' });
    if (!res.ok) { setError(res.status === 404 ? 'Your session has ended. Sign in again.' : 'Could not load leads.'); return; }
    const json = await res.json();
    setStages(json.stages); setCounts(json.counts); setLeads(json.leads);
    setDrafts(Object.fromEntries((json.leads as Lead[]).map((l) => [l.id, { status: l.status, notes: l.notes ?? '' }])));
  }, [filter]);

  useEffect(() => { void load(); }, [load]);

  async function save(id: number) {
    const d = drafts[id];
    setSaving(id);
    const res = await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: d.status, notes: d.notes }),
    });
    setSaving(null);
    if (!res.ok) { setError('Could not save that change.'); return; }
    await load();
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Lead pipeline</h1>
        <button
          type="button"
          onClick={async () => { await fetch('/api/admin/session', { method: 'DELETE' }); window.location.assign('/admin/login'); }}
          className="rounded-lg border border-white/20 px-3 py-1.5 text-sm"
        >
          Sign out
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by stage">
        <button type="button" onClick={() => setFilter('')} className={`rounded-full px-3 py-1 text-sm ${filter === '' ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
          All ({total})
        </button>
        {stages.map((s) => (
          <button key={s.id} type="button" onClick={() => setFilter(s.id)} className={`rounded-full px-3 py-1 text-sm ${filter === s.id ? 'bg-amber-500 text-black' : 'bg-white/10'}`}>
            {s.label} ({counts[s.id] ?? 0})
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 text-red-400">{error} {error.startsWith('Your session') && <a className="underline" href="/admin/login">Sign in</a>}</p>}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-white/60">
            <tr>
              <th className="p-2">Ref</th><th className="p-2">Received</th><th className="p-2">Customer</th>
              <th className="p-2">Service / source</th><th className="p-2">Stage</th><th className="p-2">Notes</th><th className="p-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {leads.map((l) => (
              <tr key={l.id} className="align-top">
                <td className="p-2 font-mono text-amber-300">{l.reference ?? l.id}</td>
                <td className="p-2 whitespace-nowrap">{new Date(l.created_at).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}</td>
                <td className="p-2">
                  <div className="font-medium">{l.name}</div>
                  {l.phone && <a className="block text-amber-300" href={`tel:${l.phone}`}>{l.phone}</a>}
                  <div className="text-white/50">{l.company || ''} {l.location ? `· ${l.location}` : ''}</div>
                </td>
                <td className="p-2"><div>{l.service}</div><div className="text-white/50">{l.source}</div></td>
                <td className="p-2">
                  <label className="sr-only" htmlFor={`stage-${l.id}`}>Stage for {l.reference}</label>
                  <select
                    id={`stage-${l.id}`}
                    value={drafts[l.id]?.status ?? l.status}
                    onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: { ...d[l.id], status: e.target.value } }))}
                    className="rounded border border-white/20 bg-black px-2 py-1"
                  >
                    {!stages.some((s) => s.id === l.status) && <option value={l.status}>{l.status}</option>}
                    {stages.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </td>
                <td className="p-2">
                  <label className="sr-only" htmlFor={`notes-${l.id}`}>Notes for {l.reference}</label>
                  <textarea
                    id={`notes-${l.id}`}
                    rows={2}
                    value={drafts[l.id]?.notes ?? ''}
                    onChange={(e) => setDrafts((d) => ({ ...d, [l.id]: { ...d[l.id], notes: e.target.value } }))}
                    className="w-56 rounded border border-white/20 bg-black px-2 py-1"
                  />
                </td>
                <td className="p-2">
                  <button type="button" onClick={() => save(l.id)} disabled={saving === l.id} className="rounded bg-amber-500 px-3 py-1 font-semibold text-black disabled:opacity-50">
                    {saving === l.id ? 'Saving…' : 'Save'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && !error && <p className="mt-6 text-white/60">No leads in this stage.</p>}
      </div>
    </main>
  );
}
